import requests
from jose import jwt
from pprint import pprint

from variables import Variables


def check_token(token):
    # https://amzn.to/2vUwFx7
    # Decode the headers and payload without verifying signature
    access_headers = jwt.get_unverified_header(token)
    print('Token headers:')
    pprint(access_headers)
    access_claims = jwt.get_unverified_claims(token)
    print('Token claims:')
    pprint(access_claims)
    # Now let's check the signature, step by step.
    # As seen in https://bit.ly/2E3fAFP
    print('Checking key manually')
    # Retrieve JSON Web Key Set, which contains two public keys
    # corresponding to the two private keys that could be used
    # to sign the token.
    jwks_url = 'https://cognito-idp.{}.amazonaws.com/{}/' \
                '.well-known/jwks.json'.format(
                        'eu-west-1',
                        Variables.USER_POOL_ID.value)
    r = requests.get(jwks_url)
    if r.status_code == 200:
        jwks = r.json()
    else:
        print( 'Did not retrieve JWKS, got {}'.format(r._status_code))
    # The token header contains a field 'kid', which stands for Key ID.
    # The JWKS also contains two 'kid' fields, one for each key. The
    # 'kid' in the header tells us which public key must be used
    # to verify the signature.
    kid = access_headers['kid']
    # get the public key that corresponds to the key id from headers
    key_index = -1
    for i in range(len(jwks['keys'])):
        if kid == jwks['keys'][i]['kid']:
            key_index = i
            break
    if key_index == -1:
        print('Public key not found, can not verify token')
    else:
        # convert public key to the proper format
        public_key = jwk.construct(jwks['keys'][key_index])
        # get claims and signature from token
        claims, encoded_signature = token.rsplit('.', 1)
        # decrypted signature must match header and payload
        decoded_signature = base64url_decode(
                                encoded_signature.encode('utf-8'))
        if not public_key.verify(claims.encode("utf8"),
                                 decoded_signature):
            print('Signature verification failed')
        else:
            print('Signature successfully verified')