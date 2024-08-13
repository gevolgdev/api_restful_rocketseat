import fastify from 'fastify'

const app = fastify()

app.get('/', (req, res) => {
	return res.send('Rota de GET')
})

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log('🚀 HTTP Server is running!')
	})
