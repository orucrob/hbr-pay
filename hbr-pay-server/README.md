# hbr-pay-server

## Parameters
template specifies following parameteres for Brantree sandbox
- MerchantId
- PublicKey
- PrivateKey

## Local development \ testing

```powershell
sam build
sam local invoke PaymentFunction --event .\event.json
```

## Packaging and deployment

Package Lambda functions to S3
```powershell
sam package --output-template-file packaged.yaml --s3-bucket <<bucket for deploy>> 
```

Create a Cloudformation Stack and deploy SAM resources
```powershell
sam deploy --template-file .\packaged.yaml --stack-name hbr-pay-server --capabilities CAPABILITY_IAM 
```


## Testing


```powershell
Invoke-WebRequest -Uri https://<<api gateway path>>/Prod/pay -Method POST -body ' {"amount": "13.12", "nonce": "fake-valid-nonce"}'
```



## Cleanup

In order to delete  Serverless Application you can use the following AWS CLI Command:

```bash
aws cloudformation delete-stack --stack-name hbr-cognito-test
```

