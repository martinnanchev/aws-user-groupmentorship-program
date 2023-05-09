import boto3

from variables import Variables

cidp = boto3.client('cognito-idp')
r = cidp.sign_up(
        ClientId=Variables.USER_POOL_CLIENT.value,
        Username='cognito-py-demo',
        Password='D0lphins!',
        UserAttributes=[{'Name': 'email',
                         'Value': 'martin_nanchev@pokerstarsint.com'}])
cidp.admin_confirm_sign_up(
        UserPoolId=Variables.USER_POOL_ID.value,
        Username='cognito-py-demo')