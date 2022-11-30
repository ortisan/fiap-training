


resource "aws_sns_topic" "dynamodb_alarms_topic" {
  name = "dynamodb_alarms_topic-${local.student_name}"
}

resource "aws_sns_topic_subscription" "dynamodb_alarms_topic" {
  topic_arn = aws_sns_topic.dynamodb_alarms_topic.arn
  protocol  = "email-json"
  endpoint  = local.student_email
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_orders_write_capacity" {
  alarm_name          = "dynamodb-orders-throttling-write-${local.student_name}"
  alarm_description   = "Alarms if table get in throttling state"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ConsumedWriteCapacityUnits"
  namespace           = "AWS/DynamoDB"
  dimensions = {
    TableName = aws_dynamodb_table.orders.id
  }
  period                    = "60"
  statistic                 = "Sum"
  threshold                 = "60"
  actions_enabled           = true
  alarm_actions             = [aws_sns_topic.dynamodb_alarms_topic.arn]
  ok_actions                = [aws_sns_topic.dynamodb_alarms_topic.arn]
  insufficient_data_actions = []
  depends_on = [
    aws_dynamodb_table.orders
  ]
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_orders_read_capacity" {
  alarm_name          = "dynamodb-orders-throttling-read-${local.student_name}"
  alarm_description   = "Alarms if table get in throttling state"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ConsumedReadCapacityUnits"
  namespace           = "AWS/DynamoDB"
  dimensions = {
    TableName = aws_dynamodb_table.orders.id
  }
  period                    = "60"
  statistic                 = "Sum"
  threshold                 = "60"
  actions_enabled           = true
  alarm_actions             = [aws_sns_topic.dynamodb_alarms_topic.arn]
  ok_actions                = [aws_sns_topic.dynamodb_alarms_topic.arn]
  insufficient_data_actions = []
  depends_on = [
    aws_dynamodb_table.orders
  ]
}