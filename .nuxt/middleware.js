const middleware = {}

middleware['ensure-has-no-stored-auth-token'] = require('..\\middleware\\ensure-has-no-stored-auth-token.ts')
middleware['ensure-has-no-stored-auth-token'] = middleware['ensure-has-no-stored-auth-token'].default || middleware['ensure-has-no-stored-auth-token']

middleware['ensure-has-stored-auth-token'] = require('..\\middleware\\ensure-has-stored-auth-token.ts')
middleware['ensure-has-stored-auth-token'] = middleware['ensure-has-stored-auth-token'].default || middleware['ensure-has-stored-auth-token']

middleware['post-redirect'] = require('..\\middleware\\post-redirect.ts')
middleware['post-redirect'] = middleware['post-redirect'].default || middleware['post-redirect']

export default middleware
