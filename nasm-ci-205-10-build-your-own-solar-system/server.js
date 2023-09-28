const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('googleAnalytics.json');
const middlewares = jsonServer.defaults();
const port = 4000;

const cors = require('cors');


server.use(   
  cors({
  origin: true,
  credentials: true,
  preflightContinue: false,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

server.options('*', cors());
server.use(middlewares);
server.use(router);



server.listen(port,()=>{
  console.log(`json server is running on port ${port}`)
})
