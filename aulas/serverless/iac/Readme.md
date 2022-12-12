## Comandos úteis:

Validação do template:
    
```sh
aws cloudformation validate-template --template-body file://template.yaml 
```

Criação da stack:

```sh
aws cloudformation create-stack --stack-name test-stack --template-body file://template.yaml --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=CustomerEmailNotification,ParameterValue=teste@gmail.com 
```

Atualização da Stack:

```sh
aws cloudformation update-stack --stack-name test-stack --template-body file://template.yaml --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=CustomerEmailNotification,ParameterValue=teste@gmail.com 
```

Remoção da Stack:

```sh
aws cloudformation delete-stack --stack-name test-stack
```