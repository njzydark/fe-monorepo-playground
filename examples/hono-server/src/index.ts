import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { initializeDatabase } from './db/seed'
import { todoRoutes } from './http/todos'

const port = Number(process.env.PORT ?? 8787)
const app = new OpenAPIHono()

initializeDatabase()

app.use('*', logger())
app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  }),
)

app.get('/', (c) => {
  return c.json({
    name: 'example-hono-server',
    endpoints: {
      docs: '/docs',
      health: '/health',
      openapi: '/openapi.json',
      todos: '/api/todos',
    },
  })
})

app.get('/health', (c) => {
  return c.json({ ok: true })
})

app.route('/api/todos', todoRoutes)
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Todo Starter API',
    version: '0.1.0',
    description: 'Hono, Drizzle, and SQLite API for the React Todo CRUD starter.',
  },
})
app.get(
  '/docs',
  Scalar({
    pageTitle: 'Todo Starter API',
    theme: 'default',
    url: '/openapi.json',
  }),
)

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Hono server running at http://localhost:${info.port}`)
  },
)
