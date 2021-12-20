import { types } from './graphql/types.js';
import { resolvers } from './graphql/resolver.js';
import { gql } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import conectarBD from './database/connection.js';
import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();
await conectarBD();

const server = new ApolloServer({
  typeDefs: types,
  resolvers: resolvers,
});

it('creates user', async () => {
  const result = await server.executeOperation({
    query: gql`
      mutation Mutation(
        $email: String!
        $idUsuario: String!
        $nombre: String!
        $clave: String!
        $rol: Enum_Rol!
      ) {
        crearUsuario(
          email: $email
          idUsuario: $idUsuario
          nombre: $nombre
          clave: $clave
          rol: $rol
          
        ) {
          email
        }
      }
    `,
    variables: {
      email: 'testing@testing.com',
      idUsuario: 'test',
      nombre: 'test',
      clave: 'test',
      rol: 'Administrador'     
    },
  });

  assert.equal(result.data.crearUsuario.email, 'testing@testing.com');
});

it('fetches user', async () => {
  const result = await server.executeOperation({
    query: gql`
    query Usuario($_id: ID!, $usuario: ID!) {
      Usuario(_id: $_id, usuario: $usuario) {
        _id
        idUsuario
        email
        nombre
        rol
        estado
      }
    }
    `,
    variables: {
      _id: '61b398d465ec516a5451a652',
      usuario: '61b398d465ec516a5451a652'
    },
  });

  assert.equal(result.data.Usuario._id, '61b398d465ec516a5451a652');
});

it('deletes user', async () => {
  const result = await server.executeOperation({
    query: gql`
    mutation EliminarUsuario($id: ID, $email: String) {
      eliminarUsuario(_id: $id, email: $email){
        email
      }
    }
    `,
    variables: {
      id: '61afae949da6abecaec82bf6',
      email: 'testing@testing.com',
    },
  });
  assert.equal(result.data.eliminarUsuario.email, 'testing@testing.com');
});

