import requests
from jose import jwt
from pprint import pprint

from variables import Variables


def decode_token(token):
    # build the URL where the public keys are
    jwks_url = 'https://cognito-idp.{}.amazonaws.com/{}/' \
                '.well-known/jwks.json'.format(
                        'eu-west-1',
                        Variables.USER_POOL_ID.value)
    # get the keys
    jwks = requests.get(jwks_url).json()
    pprint(jwt.decode(token, jwks))