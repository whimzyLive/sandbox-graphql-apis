import { StackContext, Table, AppSyncApi } from "sst/constructs";

export function AppSyncStack({ stack }: StackContext) {
  // Create a notes table
  const notesTable = new Table(stack, "Notes", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  // Create the AppSync GraphQL API
  const api = new AppSyncApi(stack, "AppSyncApi", {
    schema: "packages/functions/app-sync/src/graphql/schema.graphql",
    defaults: {
      function: {
        memorySize: "2 GB",
        // Bind the table name to the function
        bind: [notesTable],
      },
    },
    dataSources: {
      notes: "packages/functions/app-sync/src/main.handler",
    },
    resolvers: {
      "Query    listNotes": "notes",
      "Query    getNoteById": "notes",
      "Mutation createNote": "notes",
      "Mutation updateNote": "notes",
      "Mutation deleteNote": "notes",
    },
  });

  // Show the AppSync API Id and API Key in the output
  stack.addOutputs({
    ApiId: api.apiId,
    APiUrl: api.url,
    ApiKey: api.cdk.graphqlApi.apiKey || "",
  });
}
