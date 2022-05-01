import { FastifyInstance } from 'fastify'
import { defaultContainer, defaultInjectionMode, setupAwilixDecorator } from './plugin.helper'
import { InjectionModeType } from 'awilix'
import { DiContainer, DiModule } from '.'

export class FastifyAwilix {
  constructor(
    readonly fastify: FastifyInstance,
    readonly injectionMode: InjectionModeType = defaultInjectionMode,
    readonly container: DiContainer = defaultContainer(injectionMode)
  ) {
    setupAwilixDecorator(fastify, container)
  }

  public register(module: DiModule): void {
    this.fastify.diContainer.register(module)
  }
}
