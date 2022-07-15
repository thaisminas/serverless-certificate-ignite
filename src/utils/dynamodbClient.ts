import { DynamoDB } from 'aws-sdk';

const options = {
    region: "localhost",
    //porta padrao do dynamo
    endpoint: "http://localhost:8000",
    accessKeyId: "x",
    secretAccessKey: "x"
}

const isOffline = () => {
    return process.env.IS_OFFLINE;
};

//verifica se esta offline e usa o dynamo local, se nao usa o da aws.
export const document = isOffline()
  ? new DynamoDB.DocumentClient(options)
  : new DynamoDB.DocumentClient();