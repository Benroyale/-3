const fs = require("fs");
const { parse } = require("csv-parse/sync");

const INPUT_PATH = "/data/data.csv";
const OUTPUT_PATH = "/data/report.html";

function main() {
  const raw = fs.readFileSync(INPUT_PATH, "utf-8");

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });

  const total = records.length;

  const avgPrice =
    records.reduce((s, r) => s + parseFloat(r.price), 0) / (total || 1);
  const avgRating =
    records.reduce((s, r) => s + parseFloat(r.rating), 0) / (total || 1);

  const totalQuantity = records.reduce(
    (s, r) => s + parseInt(r.quantity, 10),
    0
  );

  const byCategory = {};
  for (const r of records) {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  }

  const categoryRows = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, cnt]) => `<tr><td>${cat}</td><td>${cnt}</td></tr>`)
    .join("\n");

  const sampleRows = records
    .slice(0, 10)
    .map(
      (r) =>
        `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.category}</td>` +
        `<td>${r.price}</td><td>${r.quantity}</td><td>${r.rating}</td></tr>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Отчёт по данным</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #222; }
    h1 { color: #2c3e50; }
    .cards { display: flex; gap: 20px; flex-wrap: wrap; margin: 20px 0; }
    .card { background: #f4f6f8; border-radius: 8px; padding: 16px 24px; }
    .card .value { font-size: 28px; font-weight: bold; color: #2980b9; }
    table { border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #ccc; padding: 6px 12px; text-align: left; }
    th { background: #2c3e50; color: #fff; }
  </style>
</head>
<body>
  <h1>Отчёт по сгенерированным данным</h1>
  <p>Сгенерировано: ${new Date().toISOString()}</p>

  <div class="cards">
    <div class="card"><div>Всего записей</div><div class="value">${total}</div></div>
    <div class="card"><div>Средняя цена</div><div class="value">${avgPrice.toFixed(2)}</div></div>
    <div class="card"><div>Средний рейтинг</div><div class="value">${avgRating.toFixed(2)}</div></div>
    <div class="card"><div>Всего на складе</div><div class="value">${totalQuantity}</div></div>
  </div>

  <h2>Количество по категориям</h2>
  <table>
    <tr><th>Категория</th><th>Количество</th></tr>
    ${categoryRows}
  </table>

  <h2>Первые 10 записей</h2>
  <table>
    <tr><th>id</th><th>name</th><th>category</th><th>price</th><th>quantity</th><th>rating</th></tr>
    ${sampleRows}
  </table>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_PATH, html, "utf-8");
  console.log(`Report written -> ${OUTPUT_PATH} (${total} rows)`);
}

main();
