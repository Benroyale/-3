import csv
import random
import os
import sys

NUM_ROWS = 100


COLUMNS = ["price", "quantity", "rating", "category"]

def generate_row():

    return {
        "price": round(random.uniform(0.5, 50.0), 2),
        "quantity": random.randint(1, 200),
        "rating": round(random.uniform(1.0, 5.0), 1),
        "category": random.choice(["food", "drinks", "snacks", "bakery", "dairy"]),
    }

OUTPUT_DIR = sys.argv[1] if len(sys.argv) > 1 else "/data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "data.csv")

os.makedirs(OUTPUT_DIR, exist_ok=True)

rows = [generate_row() for _ in range(NUM_ROWS)]

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=COLUMNS)
    writer.writeheader()
    writer.writerows(rows)
