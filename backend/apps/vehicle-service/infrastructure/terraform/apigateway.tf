resource "aws_api_gateway_rest_api" "vehicle_api" {

  name = "vehicles-api"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "vehicles" {
  path_part   = "vehicles"
  parent_id   = aws_api_gateway_rest_api.vehicle_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.vehicle_api.id
}

resource "aws_api_gateway_method" "get_vehicle" {
  rest_api_id   = aws_api_gateway_rest_api.vehicle_api.id
  resource_id   = aws_api_gateway_resource.vehicles.id
  http_method   = "GET"
  authorization = "NONE"
}

# resource "aws_api_gateway_stage" "dev" {
#   deployment_id = aws_api_gateway_deployment.vehicle_api.id
#   rest_api_id   = aws_api_gateway_rest_api.vehicle_api.id
#   stage_name    = "dev"
# }

# resource "aws_api_gateway_stage" "prod" {
#   deployment_id = aws_api_gateway_deployment.vehicle_api.id
#   rest_api_id   = aws_api_gateway_rest_api.vehicle_api.id
#   stage_name    = "prod"
# }