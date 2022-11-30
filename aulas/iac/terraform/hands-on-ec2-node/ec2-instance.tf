data "aws_ami" "amazn2" {
  # TODO ...
}

resource "aws_instance" "api_instance" {
  # TODO ...
  user_data              = file("./templates/user_data.sh")
}
