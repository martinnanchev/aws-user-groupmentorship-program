#tst_insert_logins.py
import json
import boto3
from datetime import datetime


def lambda_handler(event, context):

    return {
        'statusCode': 200,
        'body': json.dumps("Marto")
    }