import fastify from 'fastify'
import { ENV } from './env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
	prefix: 'transactions',
})

app
	.listen({
		port: ENV.PORT,
	})
	.then(() => {
		console.log('🚀 HTTP Server is running!')
	})
