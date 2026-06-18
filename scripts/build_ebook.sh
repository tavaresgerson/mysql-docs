#!/bin/bash

# Configurações do Projeto
BASE_DIR="/home/tavares/Development/Traduções/mysql-docs"
DOCS_DIR="${BASE_DIR}/v5/br"
OUTPUT_FILE="${BASE_DIR}/mysql-v5-ptbr.epub"
METADATA="${DOCS_DIR}/metadata.yaml"
COVER="${BASE_DIR}/cover.png"
RESOURCE_PATH="${BASE_DIR}/src/assets"

echo "Iniciando a construção do eBook para: ${BASE_DIR}..."

# 2. Ler a ordem dos capítulos a partir do index.md
# Extrai os links do arquivo index.md para garantir a ordem correta e caminhos exatos
INDEX_FILE="${DOCS_DIR}/index.md"
CHAPTERS=$(sed -n 's/.*](\(.*\))/\1/p' "$INDEX_FILE" | grep '\.md$' | sed 's|^/||' | awk -v prefix="${DOCS_DIR}/" '{print prefix $0}')

if [ -z "$CHAPTERS" ]; then
    echo "Erro: Nenhum capítulo encontrado listado em ${INDEX_FILE}"
    exit 1
fi

echo "Total de arquivos a processar: $(echo "$CHAPTERS" | wc -w)"

# 3. Executar o Pandoc
echo "Gerando EPUB..."
pandoc "$METADATA" \
    --verbose \
    --epub-cover-image="$COVER" \
    --resource-path="$RESOURCE_PATH" \
    $CHAPTERS \
    -o "$OUTPUT_FILE"

echo "Sucesso! eBook gerado em: ${OUTPUT_FILE}"
