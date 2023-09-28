module.exports = function (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*')
  return next()
}
