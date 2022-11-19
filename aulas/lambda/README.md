# Lambda

Este repositório contém todo o conteúdo de apoio para as aulas de Lambda.

## SAM

O AWS Serverless Application Model(AWS SAM) é uma estrutura de código aberto que você pode usar para criar aplicações serverless na AWS.

Você pode usar o AWS SAM Para definir aplicativos sem servidor. AWS SAM consiste nos seguintes componentes:

- AWS SAM especificação do modelo. Você usa essa especificação para definir seu aplicativo serverless. O fornece uma sintaxe simples e limpa para descrever funções, APIs, permissões, configurações e eventos que compõem uma aplicação sem servidor. Você usa um arquivo de modelo para operar em uma única entidade implantável e versionada que é seu aplicativo sem servidor.
- AWS SAM Interface da linha de comando do (AWS SAMCLI). Você usa essa ferramenta para criar aplicativos serverless definidos na especificação. A CLI fornece comandos que permitem verificar se os arquivos de modelo são gravados de acordo com a especificação, invocam funções do Lambda localmente, depurar funções do Lambda, empacotar e implantar aplicativos serverless na AWS e assim por diante.

> AWS Docs: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html

### Como instalar?

Siga o passo a passo:

- Windows: https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-sam-cli-install-windows.html
- Linux: https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-sam-cli-install-linux.html

### Extensão AWS Toolkit para o VSCode

Siga o passo a passo: 
- https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/setup-toolkit.html



## Criação do projeto:

```sh
sam init
```

Siga o passo a passo.

## Comandos básicos:

Validação do projeto

```sh
sam validate
```
Teste da API:

```sh
curl http://localhost:8080/hello
```

### Configuração de debug

```json
# Code
{
    "type": "aws-sam",
    "request": "direct-invoke",
    "name": "Hello World Lambda",
    "invokeTarget": {
        "target": "code",
        "projectRoot": "hello-world",
        "lambdaHandler": "app.lambdaHandler"
    },
    "lambda": {
        "runtime": "nodejs16.x",
        "payload": {},
        "environmentVariables": {}
    }
}

# API
{
    "type": "aws-sam",
    "request": "direct-invoke",
    "name": "Hello World API Lambda",
    "invokeTarget": {
    "target": "api",
    "templatePath": "hello-world-marcelo/template.yaml",
    "logicalId": "HelloWorldFunction"
    },
    "api": {
    "path": "/hello",
    "httpMethod": "get",
    "payload": {
        "json": {}
    },
    "querystring": "name=Marcelo",
    "headers": {
        "cookie": "name=value; name2=value2; name3=value3"
    }
    },
    "sam": {},
    "aws": {}
}
```

# Deploy

```sh
sam deploy --guided
```

# Checar logs e trace

Logs
```sh
sam logs --stack-name <stackname> --tail --include-traces
```

Traces

```sh
sam traces --tail
```