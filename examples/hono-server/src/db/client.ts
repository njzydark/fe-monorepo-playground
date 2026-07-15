import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL ?? path.resolve(process.cwd(), '.data/starter.db')

fs.mkdirSync(path.dirname(databaseUrl), { recursive: true })

export const sqlite = new Database(databaseUrl)
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })
