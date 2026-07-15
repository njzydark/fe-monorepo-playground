import { sqlite } from './client'

export const initializeDatabase = () => {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const row = sqlite.prepare('SELECT COUNT(*) AS count FROM todos').get() as { count: number }

  if (row.count > 0) {
    return
  }

  const insert = sqlite.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)')

  insert.run('Wire React app to Hono API', 1)
  insert.run('Add a new todo from the form', 0)
  insert.run('Edit or delete an item', 0)
}
