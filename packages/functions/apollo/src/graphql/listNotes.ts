import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function listNotes(): Promise<
  Record<string, unknown>[] | undefined
> {
  const params = {
    TableName: Table.NotesHttp.tableName,
  };

  const data = await dynamoDb.scan(params).promise();

  return data.Items;
}
