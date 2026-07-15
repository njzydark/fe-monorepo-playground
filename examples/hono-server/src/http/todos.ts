import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { db } from '../db/client'
import { todos } from '../db/schema'

const TodoSchema = z
  .object({
    id: z.number().int().positive().openapi({
      example: 1,
    }),
    title: z.string().openapi({
      example: 'Wire React app to Hono API',
    }),
    completed: z.boolean().openapi({
      example: false,
    }),
    createdAt: z.string().openapi({
      example: '2026-07-15 10:00:00',
    }),
    updatedAt: z.string().openapi({
      example: '2026-07-15 10:00:00',
    }),
  })
  .openapi('Todo')

const TodoListResponseSchema = z
  .object({
    todos: z.array(TodoSchema),
  })
  .openapi('TodoListResponse')

const TodoResponseSchema = z
  .object({
    todo: TodoSchema,
  })
  .openapi('TodoResponse')

const DeleteTodoResponseSchema = z
  .object({
    ok: z.literal(true).openapi({
      example: true,
    }),
    todo: TodoSchema,
  })
  .openapi('DeleteTodoResponse')

const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      example: 'Todo not found.',
    }),
  })
  .openapi('ErrorResponse')

const TodoParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1',
    }),
})

const CreateTodoBodySchema = z
  .object({
    title: z.string().trim().min(1).openapi({
      example: 'Add API playground',
    }),
    completed: z.boolean().optional().openapi({
      example: false,
    }),
  })
  .openapi('CreateTodoBody')

const UpdateTodoBodySchema = z
  .object({
    title: z.string().trim().min(1).optional().openapi({
      example: 'Update API playground',
    }),
    completed: z.boolean().optional().openapi({
      example: true,
    }),
  })
  .refine((payload) => payload.title !== undefined || payload.completed !== undefined, {
    message: 'At least one field is required.',
  })
  .openapi('UpdateTodoBody')

const jsonContent = <T extends z.ZodType>(schema: T) => {
  return {
    'application/json': {
      schema,
    },
  }
}

const listTodosRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Todos'],
  summary: 'List todos',
  responses: {
    200: {
      content: jsonContent(TodoListResponseSchema),
      description: 'Todo list',
    },
  },
})

const createTodoRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Todos'],
  summary: 'Create a todo',
  request: {
    body: {
      content: jsonContent(CreateTodoBodySchema),
      required: true,
    },
  },
  responses: {
    201: {
      content: jsonContent(TodoResponseSchema),
      description: 'Created todo',
    },
    400: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Invalid todo payload',
    },
  },
})

const getTodoRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Todos'],
  summary: 'Get a todo',
  request: {
    params: TodoParamsSchema,
  },
  responses: {
    200: {
      content: jsonContent(TodoResponseSchema),
      description: 'Todo detail',
    },
    400: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Invalid todo id',
    },
    404: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Todo not found',
    },
  },
})

const updateTodoRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Todos'],
  summary: 'Update a todo',
  request: {
    params: TodoParamsSchema,
    body: {
      content: jsonContent(UpdateTodoBodySchema),
      required: true,
    },
  },
  responses: {
    200: {
      content: jsonContent(TodoResponseSchema),
      description: 'Updated todo',
    },
    400: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Invalid todo payload',
    },
    404: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Todo not found',
    },
  },
})

const deleteTodoRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Todos'],
  summary: 'Delete a todo',
  request: {
    params: TodoParamsSchema,
  },
  responses: {
    200: {
      content: jsonContent(DeleteTodoResponseSchema),
      description: 'Deleted todo',
    },
    400: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Invalid todo id',
    },
    404: {
      content: jsonContent(ErrorResponseSchema),
      description: 'Todo not found',
    },
  },
})

const parseTodoId = (value: string): number => {
  return Number(value)
}

const getTodoById = (id: number) => {
  return db.select().from(todos).where(eq(todos.id, id)).get()
}

export const todoRoutes = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Invalid request.'
      return c.json({ error: message }, 400)
    }
  },
})

todoRoutes.openapi(listTodosRoute, (c) => {
  const rows = db.select().from(todos).all()
  return c.json({ todos: rows }, 200)
})

todoRoutes.openapi(createTodoRoute, (c) => {
  const payload = c.req.valid('json')
  const todo = db
    .insert(todos)
    .values({
      title: payload.title,
      completed: payload.completed === true,
    })
    .returning()
    .get()

  return c.json({ todo }, 201)
})

todoRoutes.openapi(getTodoRoute, (c) => {
  const { id: todoId } = c.req.valid('param')
  const todo = getTodoById(parseTodoId(todoId))

  if (!todo) {
    return c.json({ error: 'Todo not found.' }, 404)
  }

  return c.json({ todo }, 200)
})

todoRoutes.openapi(updateTodoRoute, (c) => {
  const { id: todoId } = c.req.valid('param')
  const payload = c.req.valid('json')
  const id = parseTodoId(todoId)
  const existingTodo = getTodoById(id)

  if (!existingTodo) {
    return c.json({ error: 'Todo not found.' }, 404)
  }

  const todo = db
    .update(todos)
    .set({
      title: payload.title ?? existingTodo.title,
      completed: payload.completed ?? existingTodo.completed,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(todos.id, id))
    .returning()
    .get()

  return c.json({ todo }, 200)
})

todoRoutes.openapi(deleteTodoRoute, (c) => {
  const { id: todoId } = c.req.valid('param')
  const todo = db
    .delete(todos)
    .where(eq(todos.id, parseTodoId(todoId)))
    .returning()
    .get()

  if (!todo) {
    return c.json({ error: 'Todo not found.' }, 404)
  }

  return c.json({ ok: true as const, todo }, 200)
})
