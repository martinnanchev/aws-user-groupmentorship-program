import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AccountRecovery,
  Mfa,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime, Function, Code } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { EndpointType, RestApi } from "aws-cdk-lib/aws-apigateway";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {CfnOutput} from "aws-cdk-lib";
export class CdkAuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * UserPool and UserPool Client
     */
    const userPool: UserPool = new UserPool(this, `UserPool`, {
      selfSignUpEnabled: true,
      deletionProtection: true,
      passwordPolicy: {
        requireUppercase: true,
        requireSymbols: true,
        requireLowercase: true,
        requireDigits: true,
      },
    });
    const client = new UserPoolClient(this, `UserPoolClient`, {
      userPool,
      authFlows: {
        userPassword: true
      }
    });
    // Dynamo DB Table tst_logins
    const table = new Table(this, "tst_logins", {
      partitionKey: { name: "user_id", type: AttributeType.STRING },
    });
    console.log(__dirname)

    const dynamoLambda = new Function(this, "tst_insert_logins", {

      code: Code.fromAsset(path.join(__dirname, "../src")),
      runtime: Runtime.PYTHON_3_8,
      handler: "tst_insert_logins.lambda_handler",
    });
    table.grantReadWriteData(dynamoLambda);

    const api = new RestApi(this, "insert-login", {
      description: "Authentication Service RestApi",
      endpointTypes: [EndpointType.REGIONAL],
    });
    const apiLambdaIntegration = new apigateway.LambdaIntegration(
      dynamoLambda,
      {}
    );
    const auth = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "poolAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );
    const method = api.root.addMethod("POST", apiLambdaIntegration, {
      authorizer: auth,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    }); // POST /

    new CfnOutput(this, "clientId", {
      value: client.userPoolClientId
    });
    new CfnOutput(this, "userPoolId", {
      value: userPool.userPoolId
    });
    new CfnOutput(this, "apiUrl", {
      value: api.url
    });
  }
}
