# Infraestrutura


```sh
aws cloudformation deploy --template-file ./cloudformations/template.yaml --stack-name apis-veiculos-shopping
```

```sh
aws cloudformation delete-stack \
    --stack-name apis-veiculos-shopping
```