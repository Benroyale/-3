import csv
import os
import random
import sys

N_ROWS = 100

COLUMNS = ["id", "name", "category", "price", "quantity", "rating"]

PRODUCT_NAMES = [
    "Bread", "Milk", "Coffee", "Tea", "Apple", "Banana", "Cheese",
    "Chocolate", "Water", "Juice", "Pasta", "Rice", "Eggs", "Butter",
    "Yogurt", "Cookies", "Cereal", "Honey", "Sugar", "Salt",
]

CATEGORIES = ["food", "drinks", "snacks", "bakery", "dairy"]


def generate_row(row_id):
    return {
        "id": row_id,
        "name": random.choice(PRODUCT_NAMES),
        "category": random.choice(CATEGORIES),
        "price": round(random.uniform(0.5, 50.0), 2),
        "quantity": random.randint(1, 200),
        "rating": round(random.uniform(1.0, 5.0), 1),
    }


def main():
    output_path = sys.argv[1] if len(sys.argv) > 1 else "data/data.csv"
    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        writer.writeheader()
        for row_id in range(1, N_ROWS + 1):
            writer.writerow(generate_row(row_id))

    print(f"Generated {N_ROWS} rows -> {output_path}")


if __name__ == "__main__":
    main()
