import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'certificateignite',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', "serverless-dymanodb-local" , "serverless-offline"],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { 
      generateCertificate: {
        handler: "src/functions/hello.handler",
        events: [
          {
            http: {
              path: "generateCertificate",
              //para pegar as informacoes dentro do body adiciona o post
              method: "post",

              cors: true,
            }
          }
        ]
      }
   },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      //aponta que ira rodar local
      stages: ["dev", "local"],
      start: {
        //porta padrao do dynamo
        port: 8000,
        //salva em memoria
        inMemory: true,
        migrate: true,
      }
    }
  },

  resources: {
    //resources permite que cria a tabela
    Resources: {
      dbCertificateUsers: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "users_certificate",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              "AttributeName": "id",
              "AttibuteType": "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
