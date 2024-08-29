import { knex } from '../database'
import crypto, { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'
import { ENV } from '../env'

export async function transactionsRoutes(app: FastifyInstance) {
	app.addHook('preHandler', async (req, res) => {
		console.log(`[${req.method}]: ${req.url}`)
	})

	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, res) => {
			console.log('req', req.cookies)
			const sessionId = req.cookies.sessionId

			try {
				const AllTransactions = await knex('transactions')
					.where('session_id', sessionId)
					.select()
					.returning('*')
					.first()

				return { AllTransactions }
			} catch (error) {
				console.error('Error during database query:', error)
				return res.status(500).send({ message: 'Internal Server Error' })
			}
		},
	)

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const sessionId = req.cookies.sessionId

			const getTransactionsParamsSchema = z.object({
				id: z.string().uuid(),
			})

			const { id } = getTransactionsParamsSchema.parse(req.params)

			const getTransactionDataById = await knex('transactions')
				.where({
					id,
					session_id: sessionId,
				})
				.first()

			if (!getTransactionDataById) {
				return {
					message: 'Esse ID não existe!',
				}
			}

			return {
				getTransactionDataById,
			}
		},
	)

	app.get(
		'/summary',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const sessionId = req.cookies.sessionId

			const getSummaryTransactions = await knex('transactions')
				.where({
					session_id: sessionId,
				})
				.sum('amount', {
					as: 'amount',
				})
				.first()

			return { getSummaryTransactions }
		},
	)

	app.post('/create', async (req, res) => {
		const createTransactionSchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['credit', 'debit']),
		})

		const { title, amount, type } = createTransactionSchema.parse(req.body)

		let sessionId = req.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			const timeToExpiredCookies = 60 * 60

			res
				.cookie('sessionId', sessionId, {
					path: '/',
					maxAge: timeToExpiredCookies,
				})
				.send({ message: 'Cookie criado com sucesso!', cookie: sessionId })
		}

		const data = knex('transactions').insert({
			id: crypto.randomUUID(),
			title,
			amount: type === 'credit' ? amount : amount * -1,
			session_id: sessionId,
		})

		return res.send(data).code(201)
	})
}
