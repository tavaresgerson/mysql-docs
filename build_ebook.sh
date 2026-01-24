#!/bin/bash

# Configurações do Projeto
BASE_DIR="v5/br"
DOCS_DIR="${BASE_DIR}/src/docs"
OUTPUT_FILE="${BASE_DIR}/mysql-v5-ptbr.epub"
METADATA="${BASE_DIR}/metadata.yaml"
COVER="${BASE_DIR}/cover.jpg"
RESOURCE_PATH="${BASE_DIR}/src/assets"

echo "Iniciando a construção do eBook para: ${BASE_DIR}..."

# 1. Identificar o Prefácio (se existir)
PREFACE=""
if [ -f "${DOCS_DIR}/preface.md" ]; then
    PREFACE="${DOCS_DIR}/preface.md"
    echo "Prefácio encontrado."
fi

# 2. Listar e ordenar os capítulos numericamente (Natural Sort)
# O 'sort -V' garante que chapter_2 venha antes de chapter_10
CHAPTERS=$(find "${DOCS_DIR}" -name "chapter_*.md" | sort -V)

if [ -z "$CHAPTERS" ]; then
    echo "Erro: Nenhum capítulo encontrado em ${DOCS_DIR}"
    exit 1
fi

# 3. Executar o Pandoc
echo "Gerando EPUB..."
pandoc "$METADATA" \
    --epub-cover-image="$COVER" \
    --resource-path="$RESOURCE_PATH" \
    $PREFACE $CHAPTERS \
    -o "$OUTPUT_FILE"

echo "Sucesso! eBook gerado em: ${OUTPUT_FILE}"
