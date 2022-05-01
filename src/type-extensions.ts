import { DiContainer } from '.'

declare module 'fastify' {
  interface FastifyRequest {
    diScope: DiContainer
  }

  interface FastifyInstance {
    diContainer: DiContainer
  }
}
