import Fastify from 'fastify';
import { app } from './app/app';
import cors from '@fastify/cors';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = Fastify({
  logger: false,
  ignoreDuplicateSlashes: true,
});

server.register(cors, {
  preflight: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  hideOptionsRoute: false,
});

server.addHook('onRequest', (req, res, done) => {
  done();
});

server.register(app);

server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(
      server.printRoutes({ commonPrefix: false, includeHooks: false })
    );
    console.log(`[ ready ] http://${host}:${port}`);

    process.on('SIGINT', () => {
      console.log('\n\nServer shutdown at', new Date(), '\n\n');
      process.exit(0);
    });
  }
});
