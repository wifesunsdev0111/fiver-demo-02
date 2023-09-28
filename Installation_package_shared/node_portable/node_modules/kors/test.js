import test from 'ava'
import request from 'supertest-as-promised'
import Koa from 'koa'
import kors from './index'

test('kors', t => {
  const app = new Koa()
  app.use(kors)

  app.use((ctx, next) => {
    ctx.body = 'test'
    return next()
  })

  let res = request(app.listen())
    .get('/')
    .expect('Access-Control-Allow-Origin', '*')

  return res
})
