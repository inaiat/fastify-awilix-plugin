/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { asFunction, InjectionMode } from 'awilix'
import { getConfiguredTestServer } from './helpers'
import * as fastifyAwilixPlugin from '../src'

declare module '../src/index' {
  interface Cradle {
    dateService: Date
    printDate: string
  }
}

describe(`dependency injection tests`, () => {

  test('shoud d.i. and use printService on request', async () => {

    const dateService = () => new Date();
    const printService = ({dateService: Date}) => dateService().toDateString()

    const { server } = getConfiguredTestServer()

    const container = fastifyAwilixPlugin.create(server)

    container.register({
        dateService: asFunction(dateService).singleton(),
        printDate: asFunction(printService).singleton()
    })

    server.get(
      '/status',
      async (request) => {
        const cradle = request.diScope.cradle
        return cradle.printDate
      }
    )

    const login = await server.inject({
      method: 'GET',
      url: '/status',
    })

    expect(server.diContainer.options.injectionMode).toEqual(InjectionMode.PROXY)
    expect(login.statusCode).toEqual(200)
  })

})

