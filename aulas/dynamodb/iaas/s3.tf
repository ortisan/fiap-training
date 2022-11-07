resource "aws_s3_bucket" "audit_bucket" {
  bucket_prefix = "orders-audity-bucket-"
  tags = {
    Name        = "Audit bucket"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_acl" "audit_bucket_acl" {
  bucket = aws_s3_bucket.audit_bucket.id
  acl    = "private"
}

output "audit_bucket_name" {
  value = aws_s3_bucket.audit_bucket.id
}