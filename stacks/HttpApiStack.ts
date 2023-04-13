import { Api, StackContext, Table } from "sst/constructs";

export function HttpApiStack({ stack }: StackContext) {
  const notesTable = new Table(stack, "NotesHttp", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    routes: {
      "POST /graphql": "packages/functions/apollo/src/main.handler",
    },
    defaults: {
      function: {
        bind: [notesTable],
        copyFiles: [
          { from: "packages/functions/apollo/src/graphql/schema.graphql" },
        ],
      },
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
