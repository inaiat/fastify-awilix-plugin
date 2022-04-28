# fastify-awilix-plugin

A dependency injection plugin for fastify framework.

## Getting started

```bash
yarn add @inaiat/fastify-awilix-plugin awilix
```

Next, set up the plugin:
```ts
import { fastifyAwilixPlugin } from '@inaiat/fastify-awilix-plugin'
```

Next, set up the plugin:
```ts
declare module '@inaiat/fastify-awilix-plugin' {
  interface Cradle {
    dateService: Date
    printDate: string
  }
}

const dateService = () => new Date();
const printService = ({dateService: Date}) => dateService().toDateString()

fastify.register(fastifyAwilixPlugin.default, {
      module: {
        dateService: asFunction(dateService).singleton(),
        printDate: asFunction(printService).singleton()
}})

server.get(
      '/status',
      async (request) => {
        const cradle = request.diScope.cradle
        return cradle.printDate
      }
    )
    
