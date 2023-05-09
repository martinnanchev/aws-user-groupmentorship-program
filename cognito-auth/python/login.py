import boto3

from variables import Variables

cidp = boto3.client('cognito-idp')
r = cidp.initiate_auth(
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            'USERNAME': 'cognito-py-demo',
            'PASSWORD': 'D0lphins!'},
        ClientId=Variables.USER_POOL_CLIENT.value)
print(r)