/* eslint-disable @typescript-eslint/no-empty-interface */
import { AwilixContainer, createContainer, InjectionModeType, NameAndRegistrationPair } from 'awilix'
import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

export interface Cradle {}

const defaultInjectionMode: InjectionModeType = 'CLASSIC'

declare module 'fastify' {
  interface FastifyRequest {
    diScope: AwilixContainer<Cradle>
  }

  interface FastifyInstance {
    diContainer: AwilixContainer<Cradle>
  }
}
export type FastifyAwilixOptions = {
  module: NameAndRegistrationPair<Cradle>
  injectionMode?: InjectionModeType
}

export const fastifyAwilixPlugin: FastifyPluginCallback<FastifyAwilixOptions> = (fastify, options, done) => {
  if (!fastify.diContainer) {
    const diContainer = createContainer<Cradle>({
      injectionMode: options.injectionMode ?? defaultInjectionMode,
    })
    fastify.decorate('diContainer', diContainer)
    fastify.decorateRequest('diScope', null)

    fastify.addHook('onRequest', (request, reply, done) => {
      request.diScope = fastify.diContainer.createScope()
      done()
    })

    fastify.addHook('onResponse', (request, reply, done) => {
      request.diScope.dispose().then(() => done())
    })

    fastify.addHook('onClose', (instance, done) => {
      instance.diContainer.dispose().then(() => done())
    })
  }

  fastify.diContainer.register(options.module)

  done()
}

export default fp(fastifyAwilixPlugin, { fastify: '3.x', name: 'fastifyAwilix' })
