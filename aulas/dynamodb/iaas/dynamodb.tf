resource "aws_dynamodb_table" "orders" {
  name             = "Orders${local.student_name}"
  billing_mode     = "PROVISIONED"
  read_capacity    = 1
  write_capacity   = 1
  hash_key         = "CustomerId"
  range_key        = "OrderId"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "CustomerId"
    type = "S"
  }

  attribute {
    name = "OrderId"
    type = "S"
  }

  attribute {
    name = "OrderDate"
    type = "N"
  }

  point_in_time_recovery {
    enabled = true
  }

  local_secondary_index {
    name               = "LastOrdersOfCustomer"
    range_key          = "OrderDate"
    projection_type    = "INCLUDE"
    non_key_attributes = ["OrderId"]
  }

  tags = {
    Name        = "Orders${local.student_name}"
    Environment = "production"
  }
}
