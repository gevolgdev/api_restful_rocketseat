import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'
import { ENV } from '../env'

type TKnexConfig = Knex.Config

export const knexConfig: TKnexConfig = {
	client: 'sqlite3',
	connection: {
		filename: ENV.DATABASE_URL,
	},
	useNullAsDefault: true,
	migrations: {
		extension: 'ts',
		directory: './db/migrations',
	},
}

export const knex = setupKnex(knexConfig)
