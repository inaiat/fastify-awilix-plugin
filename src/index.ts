import { AwilixContainer, InjectionModeType, NameAndRegistrationPair } from 'awilix'
import './type-extensions'

export { fastifyAwilixPlugin } from './FastifyAwilixPlugin'
export { FastifyAwilix } from './FastifyAwilix'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Cradle {}

export type DiContainer = AwilixContainer<Cradle>

export type DiModule = NameAndRegistrationPair<Cradle>

export type FastifyAwilixOptions = {
  module: DiModule
  injectionMode?: InjectionModeType
  container?: DiContainer
}
