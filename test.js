import { tipos } from './graphql/types.js';
import { resolvers } from './graphql/resolvers.js';
import { gql } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import conectarBD from './database/connection';
import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();
await conectarBD();

const server = new ApolloServer({
  typeDefs: tipos,
  resolvers: resolvers,
});

it('creates user', async () => {
  const result = await server.executeOperation({
    query: gql`
      mutation Mutation(
        $nombre: String!
        $idUsuario: String!
        $email: String!
        $rol: Enum_Rol!
        $clave: String!
      ) {
        crearUsuario(
          nombre: $nombre
          idUsuario: $idUsuario
          email: $email
          rol: $rol
          clave: $clave
        ) {
          email
        }
      }
    `,
    variables: {
      nombre: 'test',
      idUsuario: 'test',
      email: 'testing@testing.com',
      rol: 'Administrador',
      clave: 'test',
    },
  });

  assert.equal(result.data.crearUsuario.correo, 'testing@testing.com');
});

it('fetches user', async () => {
  const result = await server.executeOperation({
    query: gql`
      query Usuarios($filtro: FiltroUsuarios) {
        Usuarios(filtro: $filtro) {
          email
        }
      }
    `,
    variables: {
      filtro: {
        correo: 'testing@testing.com',
      },
    },
  });

  assert.equal(result.data.Usuarios.length, 1);

  assert.equal(result.data.Usuarios[0].email, 'testing@testing.com');
});

it('deletes user', async () => {
  const result = await server.executeOperation({
    query: gql`
      mutation EliminarUsuario($correo: String) {
        eliminarUsuario(email: $email) {
          email
        }
      }
    `,
    variables: {
      email: 'testing@testing.com',
    },
  });
  assert.equal(result.data.eliminarUsuario.email, 'testing@testing.com');
});

it('fetches user after deletion', async () => {
  const result = await server.executeOperation({
    query: gql`
      query Usuarios($filtro: FiltroUsuarios) {
        Usuarios(filtro: $filtro) {
          email
        }
      }
    `,
    variables: {
      filtro: {
        email: 'testing@testing.com',
      },
    },
  });

  assert.equal(result.data.Usuarios.length, 0);
});