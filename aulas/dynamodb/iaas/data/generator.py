import json
import random
import uuid
from datetime import datetime, timedelta

d = datetime.today()

if __name__ == "__main__":
    
    for i in range(4):

        items = []

        for j in range(25):
        
            customerId = str(uuid.uuid4())
            orderId = str(uuid.uuid4())
            sessionId = str(uuid.uuid4())
            price = random.randint(100, 1000)
            orderDate = (d - timedelta(days=1))

            item = {
                "PutRequest": {
                    "Item": {
                        "CustomerId": {"S": customerId},
                        "OrderId": {"S": orderId},
                        "SessionId": {"S": sessionId},
                        "Price": {"N": str(price)},
                        "OrderDate": {"N": orderDate.strftime("%s")},
                    }
                }
            }

            items.append(item)

        json_to_insert = {"OrdersMarcelo": items}

        with open(f"orders{i+1}.json", "w") as outfile:
            json.dump(json_to_insert, outfile)

