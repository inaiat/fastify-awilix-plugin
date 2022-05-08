/* eslint-disable @typescript-eslint/no-empty-interface */
import './type-extensions'
import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { defaultContainer, defaultInjectionMode, setupAwilixDecorator } from './plugin.helper'
import { FastifyAwilixOptions } from '.'

export const fastifyAwilixPlugin: FastifyPluginCallback<FastifyAwilixOptions> = (fastify, options, done) => {
  setupAwilixDecorator(fastify, options.container ?? defaultContainer(options.injectionMode ?? defaultInjectionMode))
  fastify.diContainer.register(options.module)
  done()
}

export default fp(fastifyAwilixPlugin, { fastify: '4.x', name: 'fastify-awilix-plugin' })
