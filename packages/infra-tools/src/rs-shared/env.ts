const { PORT: PORT_ENV } = process.env

const PORT = PORT_ENV ? Number(PORT_ENV) : undefined

export { PORT }
