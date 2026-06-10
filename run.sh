#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

GENERATOR_IMAGE="data-generator"
REPORTER_IMAGE="data-reporter"

DATA_DIR="$PROJECT_DIR/data"

USER_FLAG="--user $(id -u):$(id -g)"

build_generator() {
    docker build -t "$GENERATOR_IMAGE" ./generator
}

run_generator() {
    mkdir -p "$DATA_DIR"
    docker run --rm $USER_FLAG -v "$DATA_DIR:/data" "$GENERATOR_IMAGE"
}

create_local_data() {
    mkdir -p "$PROJECT_DIR/local_data"
    python3 ./generator/generate.py "$PROJECT_DIR/local_data/data.csv"
}

build_reporter() {
    docker build -t "$REPORTER_IMAGE" ./reporter
}

run_reporter() {
    mkdir -p "$DATA_DIR"
    docker run --rm $USER_FLAG -v "$DATA_DIR:/data" "$REPORTER_IMAGE"
}

structure() {
    if command -v tree >/dev/null 2>&1; then
        tree -a -I '.git|node_modules'
    else
        find . -not -path './.git/*' -not -path '*/node_modules/*' | sort
    fi
}

clear_data() {
    rm -f "$DATA_DIR"/*.csv "$DATA_DIR"/*.html
    echo "data/ очищена."
}

inside_generator() {
    mkdir -p "$DATA_DIR"
    docker run --rm $USER_FLAG -v "$DATA_DIR:/data" "$GENERATOR_IMAGE" ls -la /data
}

inside_reporter() {
    mkdir -p "$DATA_DIR"
    docker run --rm $USER_FLAG -v "$DATA_DIR:/data" "$REPORTER_IMAGE" ls -la /data
}

usage() {
    cat <<EOF
Использование: ./run.sh <команда>

Генератор:
  build_generator     собрать образ генератора
  run_generator       сгенерировать data/data.csv (в контейнере)
  create_local_data   сгенерировать local_data/data.csv (локально, без Docker)

Аналитик:
  build_reporter      собрать образ аналитика
  run_reporter        сформировать data/report.html (в контейнере)

Вспомогательные:
  structure           показать структуру проекта
  clear_data          удалить .csv и .html из data/
  inside_generator    показать содержимое /data изнутри контейнера генератора
  inside_reporter     показать содержимое /data изнутри контейнера аналитика
EOF
}

CMD="${1:-}"
case "$CMD" in
    build_generator|run_generator|create_local_data|\
    build_reporter|run_reporter|\
    structure|clear_data|inside_generator|inside_reporter)
        "$CMD"
        ;;
    *)
        usage
        exit 1
        ;;
esac
