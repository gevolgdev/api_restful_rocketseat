import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string(),
	NODE_ENV: z
		.enum(['development', 'staging', 'production', 'test'])
		.default('production'),
	PORT: z.number().default(3333),
})

export const _ENV = envSchema.safeParse(process.env)

if (_ENV.success === false) {
	console.error('Invalid envoriment variables!', _ENV.error.format())

	throw new Error('Invalid envoriment variables!')
}

export const ENV = _ENV.data
