# 🚀 Criaçao de API REST

## Estrutura da aplicação

###### Como micro framework, vair ser usado o fastify:

```shell
yarn add fastify
```

###### E para a utilização do Typescript instalamos:

```shell
yarn add typescript tsx @types/node
```

## Banco de dados

### _Estratégias de acesso ao banco_

**SQLite:** Salva arquivos no projeto, local.

**Knex:** Query builder.

## Configurando o Knex

```
yarn add knex sqlite3
```

Entao configuramos o banco:

```ts
// separe a config para importar ela depois
export const knexConfig = {
	client: 'sqlite3',
	connection: {
		filename: './tmp/app.db',
	},
	useNullAsDefault: true,
}

export const knex = setupKnex(knexConfig)

app.get('/', async (req, res) => {
	const initialData = knex('user_schema').select('*')

	return initialData
})
```

### Migrations

Controle/Histórico de versões e mudanças do banco de dados.

Crie um arquivo de config do Knex `knexfile.ts`

```ts
import { knexConfig } from './src/database'

export default knexConfig
```

Crie esse script para rodar o knex com tsx

```json
{
	"knex": "tsx ./node_modules/.bin/knex"
}
```

```
yarn run knex -- migrate:make <nome-da-tabela>
```

• Para cada tabela, defina no arquivo do migrate ( NUNCA SUBA TABELAS COM NOME ERRADO !!! trabalhoso pra reverter)

```ts
export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('transactions', (table) => {
		table.uuid('id').primary()
		table.text('title').notNullable()
		table.decimal('amount', 10, 2).notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('transactions')
}
```

• Rode o comando para rodar as migrations e criar as colunas

```
yarn run knex -- migrate:latest
```

E para voltar a alteraçao que vc fez é:

```
yarn run knex -- migrate:rollback
```

### Query

Bem simples implementar query.

```ts
app.get('/', async (req, res) => {
	const data = knex('transactions').select('*').returning('*')

	return data
})

app.post('/new-transaction', async (req, res) => {
	const { title, amount } = req.body as ITransactionsPost

	const data = knex('transactions').insert({
		id: crypto.randomUUID(),
		title,
		amount,
	})

	return res.send(data).code(201)
})
```
