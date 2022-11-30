data "aws_vpc" "api_instance" {
  id = var.vpc_id
}

resource "aws_security_group" "api_instance" {
  name_prefix = "api-instance"
  vpc_id          = data.aws_vpc.api_instance.id

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
  }

  ingress {
    from_port   = 0
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.api_instance.cidr_block]
    to_port     = 65535
  }
}