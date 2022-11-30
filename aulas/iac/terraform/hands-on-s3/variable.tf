// declarar as variaveis
variable "region" {
  type    = string
  default = "us-east-1"
}

// declarar o bucket prefix
variable "bucket_prefix" {
  type = string
}