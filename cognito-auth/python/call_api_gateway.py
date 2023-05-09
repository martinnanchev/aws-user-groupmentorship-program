import requests

from variables import Variables


headers = {'Authorization': ""}
# url = 'https://4a48x6598i.execute-api.eu-central-1.amazonaws.com/' \
#       'prod/insert-login'
url = Variables.API_GATEWAY.value
r = requests.post(url, headers=headers)
print(r.status_code)
print(r.text)