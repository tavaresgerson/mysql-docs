find . -name "*.md" | sort -V > lista.txt

# 1. Cria um arquivo mestre vazio e seguro
> group_docs.html

# 2. Lê a sua lista.txt e traduz o MD protegendo a sintaxe de código
while IFS= read -r arquivo; do
    if [ -f "$arquivo" ]; then
        echo "Lendo e isolando código: $arquivo"
        # O pandoc converte para HTML blindando o '#' dentro de blocos SQL
        pandoc "$arquivo" -f markdown -t html >> group_docs.html
        # Injeta quebra de capítulo para o livro não ficar colado
        echo -e "\n<div style='page-break-after: always;'></div>\n" >> group_docs.html
    fi
done < lista.txt

# 3. O Calibre assume o HTML limpo e gera o e-book sem corromper os títulos
echo "Empacotando e-book com o Calibre..."
ebook-convert group_docs.html mysql5_br_doc.epub \
    --chapter "//*[name()='h1' or name()='h2']" \
    --level1-toc "//*[name()='h1']" \
    --level2-toc "//*[name()='h2']" \
		--authors "Oracle" \
		--title "MySQL 5.x Documentação"

echo "Concluído."

rm lista.txt group_docs.html
