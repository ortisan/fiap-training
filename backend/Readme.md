# Backend

Aqui estarão todos os serviços backends bem como sua infraestrutura.

## Serviços

### Auth Service

Serviço responsável em fazer o signin e login dos clientes.

### Vehicle Service

Serviço responsável pelo cadastro e visualização de veículos.

## Pré Requisitos:

- Instalação do nodejs
- Instalação do pacote serverless
- Instalação do terraform

### Validação:

Na pasta apps/vehicles-service execute o comando:

```sh
serverless invoke local --function post-vehicle
```

### Deploy na AWS

1. Configure suas credenciais AWS com o comando
    ```sh 
    aws configure
    ```
2. Faça o deploy da aplicação:
    ```sh 
    serverless deploy
    ```
