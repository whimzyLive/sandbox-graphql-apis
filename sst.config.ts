import { SSTConfig } from "sst";
import { AppSyncStack } from "./stacks/AppSyncStack";
import { HttpApiStack } from "./stacks/HttpApiStack";

export default {
  config(_input) {
    return {
      name: "graphql-appsync",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(AppSyncStack);
    app.stack(HttpApiStack);
  },
} satisfies SSTConfig;
