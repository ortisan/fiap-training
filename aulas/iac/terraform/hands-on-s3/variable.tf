// declarar a variavel region
variable "region" {
  type    = string
  default = "us-east-1"
}

// declarar o bucket prefix
variable "mybucketprefix" {
  type    = string
  default = "my-bucket"
}