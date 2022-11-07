# DynamoDB

Esse hands-on tem o propósito de criar uma tabela e demonstrar as capacidades do DynamoDB.

Veremos as seguintes customizações:

- *ttl*
- *streams*
- *PITR*
- alarmes

## Pré Requisitos:

1. Instalação do terraform;
2. Configuração das credenciais aws.
3. Instalar o pacote npm serverless
  ```sh
  npm install -g serverless
  ```


## Criação do ambiente:

Inicialização do projeto terraform:

  ```sh
  terraform init
  ```

Atualize o seu nome e email nas variaveis **student_name** e **student_email**:
  
  ```sh
  variable "student_name" {
    ...
    default = "marcelo"
  }
  ...
  variable "student_email" {
    ...
    default = "tentativafc@gmail.com"
  }
  ```

Formate e valide o projeto:

  ```sh
  terraform fmt && terraform validate
  ```

Criação da infraestrutura:

  ```sh
  terraform apply --auto-approve
  ```

Criaremos alguns alarmes, sendo necessária a confirmação de subscrição conforme exemplo abaixo:

  ![image](images/dynamodb-subscription.png)

## Operações:

- Put Item:

  ```sh
  aws dynamodb --region us-east-1 put-item \
      --table-name OrdersMarcelo \
      --item file://data/order.json \
      --return-consumed-capacity TOTAL \
      --return-item-collection-metrics SIZE
  ```

- Get Item:

  ```sh
  aws dynamodb --region us-east-1 get-item \
      --table-name OrdersMarcelo \
      --key file://data/key.json \
      --return-consumed-capacity TOTAL
  ```

- Update Item:

  ```sh
  aws dynamodb --region us-east-1 update-item \
      --table-name OrdersMarcelo \
      --key file://data/key.json \
      --update-expression "SET #P = :p" \
      --expression-attribute-names file://data/expression-attribute-names.json \
      --expression-attribute-values file://data/expression-attribute-values.json  \
      --return-values ALL_NEW \
      --return-consumed-capacity TOTAL \
      --return-item-collection-metrics SIZE
  ```

- Delete Item:

  ```sh
  aws dynamodb --region us-east-1 delete-item \
    --table-name OrdersMarcelo \
    --key file://data/key.json \
    --return-values ALL_OLD \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE
  ```

## Teste de Alarmes:

Popule os dados de exemplo na tabela:

    ```sh
    aws dynamodb --region us-east-1 batch-write-item \
      --request-items=file://data/orders1.json

    aws dynamodb --region us-east-1 batch-write-item \
      --request-items=file://data/orders2.json  
    
    aws dynamodb --region us-east-1 batch-write-item \
      --request-items=file://data/orders3.json 
    
    aws dynamodb --region us-east-1 batch-write-item \
      --request-items=file://data/orders3.json  
    ```

Testando alarmes manualmente:

```sh
# Read Alarm
aws cloudwatch --region us-east-1 set-alarm-state --alarm-name \
  dynamodb-orders-throttling-read-Marcelo --state-reason "testing" \
  --state-value ALARM

aws cloudwatch --region us-east-1 set-alarm-state --alarm-name \
  dynamodb-orders-throttling-read-Marcelo --state-reason "testing" \
  --state-value OK

# Read Alarm
aws cloudwatch --region us-east-1 set-alarm-state --alarm-name \
  dynamodb-orders-throttling-write-Marcelo --state-reason "testing" \
  --state-value ALARM

aws cloudwatch --region us-east-1 set-alarm-state --alarm-name \
  dynamodb-orders-throttling-write-Marcelo \
  --state-reason "testing" \
  --state-value OK
```

# Hands-On Streams

1. Habilite os streams na receita de terraform;
2. Obtenha o nome do bucke de auditoria. Ele é exibido no output da execução do terraform;
    ```sh
    terraform output
    ```
3. Altere o arquivo .env com esse valor e faça o deploy da lambda:
    ```sh
    sls deploy
    ```
4. Crie o trigger no dynamo apontando para a lambda de cdc;
  ![image](images/dynamodb-subscription.png)

5. Crie, altere ou remova um item e confira os logs e o bucket de auditoria.
  ![image](images/dynamodb-cdc-audit-bucket.png)
