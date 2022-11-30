// declarar o recurso bucket
// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket

resource "aws_s3_bucket" "mybucket" {
  bucket_prefix = var.bucket_prefix
  acl           = "public-read"
}


// declarar o recurso aws_s3_bucket_website_configuration
resource "aws_s3_bucket_website_configuration" "mybucket" {
  bucket = aws_s3_bucket.mybucket.bucket

  index_document {
    suffix = "index.html"
  }
}
