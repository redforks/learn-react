import { z } from 'zod'
import { zfd } from 'zod-form-data'

const schema = zfd.formData({
  intent: zfd.text(z.literal('delete')),
  id: zfd.numeric(z.number().int().positive()),
})

const fd = new FormData()
fd.append('id', '1')
fd.append('intent', 'delete')
fd.append('intent', 'delete')

const res = schema.safeParse(fd)
console.log(res.success)
if (!res.success) console.log(JSON.stringify(res.error.issues, null, 2))
