# Infraestructure as a Code (IaaC)

## CloudFormation

O template de CloudFormation possui a seguinte estrutura:

```yaml
AWSTemplateFormatVersion: "version date"

Description:
  String

Parameters:
  set of parameters

Rules:
  set of rules

Mappings:
  set of mappings

Conditions:
  set of conditions

Resources:
  set of resources

Outputs:
  set of outputs
```

### Hands-On - Criando um bucket S3 com CloudFormation (Tempo estimado 30 mins)

Esse HandsOn dará uma visão geral de como o CloudFormation funciona.

1. Configurar as credenciais;

2. Efetura o login na AWS;

3. Ir para o serviço CloudFormation;

4. Executar o comando:

    O comando irá criar um bucket através do CloudFormation.

    ```sh 
    aws cloudformation create-stack \
    --stack-name s3-example \
    --template-body file://./cloudformation/s3-template.yaml \
    --parameters ParameterKey=BucketName,ParameterValue=my-s3-bucket-111222333
    ```

5. Listar as stacks no CloudFormation. Alguma foi criada?

6. Observar os eventos e status;

7. Ir para o S3 e verificar quais buckets foram criados;

8. Deletar a stack com o comando:

    ```sh 
    aws cloudformation delete-stack \
    --stack-name s3-example
    ```

10. O S3 foi removido? Caso não foi, qual foi o motivo?

    ```sh
    aws cloudformation create-stack \
    --stack-name ec2-example-mappings \
    --template-body file://./cloudformation/ec2-template-mappings.yaml
    ```

    ```sh
     aws cloudformation delete-stack \
    --stack-name ec2-example-mappings
    ```