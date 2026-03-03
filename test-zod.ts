import { z } from 'zod'

const schema = z.literal('hello')
const res = schema.safeParse(undefined)
console.log(JSON.stringify(res.error?.issues, null, 2))
