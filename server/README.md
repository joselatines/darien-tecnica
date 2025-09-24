# Darien Prueba Tecnica Server Node

## Installation and Setup

1. Empieza configurando la base de datos PostgresSQL en el Docker Compose:
```bash
docker-compose up -d
```

2. Instala las dependencias del proyecto:
```bash
yarn install
```

3. Corre las migraciones de la base de datos:
```bash
npx prisma migrate dev --name init
```

## Variables de entorno

Copia el `.env.example` a `.env` and agrega tus valores (si no estas utilizando el docker-compose para iniciar la base de datos). La base de datos esta configurada para admitir una url en un contenedor de docker compose PostgreSQL.

## Uso de la api

Todos los endpoints deben ser enviados `x-api-key` en el header con el valor especifico del .env `API_KEY`.

## Compilar y correr el proyecto

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Correr tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
