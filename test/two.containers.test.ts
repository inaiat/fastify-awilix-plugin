/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { asFunction } from 'awilix';
import { getConfiguredTestServer } from './helpers'
import * as fastifyAwilixPlugin from '../src'

enum Colors {
  RED, BLUE, GREEN
}

declare module '../src/index' {
  interface Cradle {
    dateService: Date
    printDate: string
  }
}

declare module '../src/index' {
  interface Cradle {
    colorService: Colors
    printColor: string
  }
}

describe(`dependency injection tests with two plugins`, () => {

  test('shoud d.i. and two plugin works with printService and PrintColor', async () => {

    const dateService = () => new Date();
    const printService = (dateService: Date) => dateService.toISOString()
    const colorService = () => Colors.GREEN;
    const printColor = (colorService: Colors) => colorService.toString()

    const { server } = getConfiguredTestServer()

    server.register(fastifyAwilixPlugin.default, {
      module: {
        dateService: asFunction(dateService).singleton(),
        printDate: asFunction(printService).singleton()
      }
    })

    server.register(fastifyAwilixPlugin.default, {
      module: {
        colorService: asFunction(colorService).singleton(),
        printColor: asFunction(printColor).singleton()
      }
    })

    server.get(
      '/date',
      async (request) => {
        const cradle = request.diScope.cradle
        return cradle.printDate
      }
    )

    server.get(
      '/color',
      async (request) => {
        const cradle = request.diScope.cradle
        return cradle.printColor
      }
    )

    const date = await server.inject({
      method: 'GET',
      url: '/date',
    })
    expect(date.statusCode).toEqual(200)

    const color = await server.inject({
      method: 'GET',
      url: '/color',
    })
    expect(color.statusCode).toEqual(200)
    expect(color.body).toEqual("2")

    await server.close()

  })



})

