import {
  Api,
  ApiGatewayV1Api,
  Function,
  StackContext,
  Table,
} from "sst/constructs";

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
        memorySize: "2 GB",
        bind: [notesTable],
        copyFiles: [
          { from: "packages/functions/apollo/src/graphql/schema.graphql" },
        ],
      },
    },
  });

  // Create REST API
  const RESTapi = new ApiGatewayV1Api(stack, "RESTApi", {
    routes: {
      "POST /graphql": "packages/functions/apollo/src/main.handlerV1",
    },
    defaults: {
      function: {
        memorySize: "2 GB",
        bind: [notesTable],
        copyFiles: [
          { from: "packages/functions/apollo/src/graphql/schema.graphql" },
        ],
      },
    },
  });

  // standalone function api
  const apiFunction = new Function(stack, "FunctionApi", {
    handler: "packages/functions/apollo/src/main.handler",
    url: true,
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    RESTEndpoint: RESTapi.url,
    FunctionApi: apiFunction.url,
  });
}
