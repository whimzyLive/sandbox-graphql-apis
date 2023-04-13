import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
const { readFileSync } = require("fs");
import listNotes from "./graphql/listNotes";
import createNote from "./graphql/createNote";
import updateNote from "./graphql/updateNote";
import deleteNote from "./graphql/deleteNote";
import getNoteById from "./graphql/getNoteById";
import Note from "./graphql/Note";

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

export const handler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
