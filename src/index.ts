/* eslint-disable @typescript-eslint/no-empty-interface */
import { AwilixContainer, createContainer, InjectionModeType, NameAndRegistrationPair } from 'awilix'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

export interface Cradle {}

const defaultInjectionMode: InjectionModeType = 'PROXY'

const defaultContainer = (injectionMode: InjectionModeType) =>
  createContainer<Cradle>({
    injectionMode,
  })

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
  container?: AwilixContainer<Cradle>
}

const decorateFastify = (fastify: FastifyInstance, diContainer: AwilixContainer<Cradle>) => {
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

export const fastifyAwilixPlugin: FastifyPluginCallback<FastifyAwilixOptions> = (fastify, options, done) => {
  if (!fastify.diContainer) {
    decorateFastify(fastify, options.container ?? defaultContainer(options.injectionMode ?? defaultInjectionMode))
  }
  fastify.diContainer.register(options.module)
  done()
}

export default fp(fastifyAwilixPlugin, { fastify: '3.x', name: 'fastify-awilix-plugin' })
