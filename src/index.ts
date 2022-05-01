/* eslint-disable @typescript-eslint/no-empty-interface */
import './type-extensions'
import { AwilixContainer, createContainer, InjectionModeType, NameAndRegistrationPair } from 'awilix'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

export interface Cradle {}

export type DiContainer = AwilixContainer<Cradle>

export type DiModule = NameAndRegistrationPair<Cradle>

const defaultInjectionMode: InjectionModeType = 'PROXY'

const defaultContainer = (injectionMode: InjectionModeType) =>
  createContainer<Cradle>({
    injectionMode,
  })

export type FastifyAwilixOptions = {
  module: DiModule
  injectionMode?: InjectionModeType
  container?: DiContainer
}

export const create = (
  fastify: FastifyInstance,
  injectionMode: InjectionModeType = defaultInjectionMode,
  container: DiContainer = defaultContainer(injectionMode)
) => {
  if (fastify.diContainer) {
    fastify.log.warn('Fastify awilix plugin already decorated')
  } else {
    decorateFastify(fastify, container)
  }

  return {
    register: (module: DiModule) => {
      fastify.diContainer.register(module)
    },
  }
}

const decorateFastify = (fastify: FastifyInstance, diContainer: DiContainer) => {
  fastify.decorate('diContainer', diContainer)
  fastify.decorateRequest('diScope', null)

  fastify.addHook('onRequest', (request, reply, done) => {
    request.diScope = fastify.diContainer.createScope()
    done()
  })

  fastify.addHook('onResponse', (request, reply, done) => {
    void request.diScope.dispose().then(() => done())
  })

  fastify.addHook('onClose', (instance, done) => {
    void instance.diContainer.dispose().then(() => done())
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
