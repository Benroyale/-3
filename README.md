# ДЗ №3. Docker. Bash

Два контейнера, которые работают с общими данными на хосте.

Генератор (Python) делает `data/data.csv`. Аналитик (Node.js) читает этот csv
и собирает из него `data/report.html`.

Файлы лежат в папке `data/` на самом хосте, а не внутри контейнеров. Контейнеры видят их через примонтированный том (`-v <папка_хоста>:/data`).

## Структура

```
.
├── run.sh
├── data/
├── local_data/
├── generator/
│   ├── Dockerfile
│   └── generate.py
└── reporter/
    ├── Dockerfile
    ├── report.js
    └── package.json
```

## Команды

Генератор:

```bash
./run.sh build_generator
./run.sh run_generator
./run.sh create_local_data
```

Аналитик:

```bash
./run.sh build_reporter
./run.sh run_reporter
```

Вспомогательные:

```bash
./run.sh structure
./run.sh clear_data
./run.sh inside_generator
./run.sh inside_reporter
```

## Как запустить

```bash
./run.sh build_generator
./run.sh run_generator
./run.sh build_reporter
./run.sh run_reporter
```

После этого в `data/` появятся `data.csv` и `report.html`. Отчёт можно
скачать и открыть в браузере.

## Про права на файлы

Контейнеры запускаются с `--user $(id -u):$(id -g)`, чтобы файлы в `data/`
принадлежали обычному пользователю. Иначе на Linux и в Codespaces их создавал бы
root, и `clear_data` не смог бы удалить их без sudo.

Зависимости аналитика (`csv-parse`) ставятся при сборке образа через `npm
install` в Dockerfile, а не при каждом запуске.
