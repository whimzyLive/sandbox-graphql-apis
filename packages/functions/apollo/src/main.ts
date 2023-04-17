import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
  middleware,
} from "@as-integrations/aws-lambda";
const { readFileSync } = require("fs");
import listNotes from "./graphql/listNotes";
import createNote from "./graphql/createNote";
import updateNote from "./graphql/updateNote";
import deleteNote from "./graphql/deleteNote";
import getNoteById from "./graphql/getNoteById";
import Note from "./graphql/Note";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

const typeDefs = readFileSync(
  require.resolve("./graphql/schema.graphql")
).toString("utf-8");

const resolvers = {
  Query: {
    listNotes,
    getNoteById: async (_: any, { noteId }: { noteId: string }) =>
      getNoteById(noteId),
  },
  Mutation: {
    createNote: async (_: any, { note }: { note: Note }) => createNote(note),
    updateNote: async (_: any, { note }: { note: Note }) => updateNote(note),
    deleteNote: async (_: any, { noteId }: { noteId: string }) =>
      deleteNote(noteId),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const requestHandler = handlers.createAPIGatewayProxyEventV2RequestHandler();

const cookieMiddleware: middleware.LambdaRequest<
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2
> = async (event: APIGatewayProxyEventV2) => {
  return async (result) => {
    console.log("Setting Cookies from middleware");
    const cookie = "cartId=1; SameSite=Lax; HttpOnly=true; Secure=true";
    // Ensure proper initialization of the cookies property on the result
    result.cookies = result.cookies ?? [];
    result.cookies?.push(cookie);
    console.log(result);
  };
};

export const handler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  requestHandler,
  {
    middleware: [cookieMiddleware],
  }
);

export const handlerV1 = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventRequestHandler()
);
