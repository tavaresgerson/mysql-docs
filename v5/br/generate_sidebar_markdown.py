import re
import ast

def parse_js_file(filename):
    """
    Lê o arquivo JS e tenta converter a estrutura de array/objetos JS
    para uma lista de dicionários Python válida.
    """
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Remover o 'export default' e ponto e vírgula final
        content = re.sub(r'export default\s*', '', content)
        content = content.strip().rstrip(';')

        # 2. Converter booleanos de JS (lowercase) para Python (Capitalized)
        content = re.sub(r'\btrue\b', 'True', content)
        content = re.sub(r'\bfalse\b', 'False', content)

        # 3. Adicionar aspas nas chaves dos objetos que não têm aspas
        # Procura por: (início de linha ou { ou ,) seguido de espaço, seguido de palavra, seguido de :
        # Exemplo: muda { text: 'Ola' } para { "text": 'Ola' }
        content = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', content)

        # 4. Parse seguro usando ast.literal_eval
        # Isso transforma a string formatada em objetos Python reais (listas e dicts)
        data = ast.literal_eval(content)
        return data

    except Exception as e:
        print(f"Erro ao processar o arquivo: {e}")
        return []

def generate_markdown(items, level=0):
    """
    Função recursiva que gera a string Markdown baseada na hierarquia.
    """
    md_output = ""
    indent = "  " * level  # 2 espaços por nível de indentação

    for item in items:
        text = item.get('text', 'Sem Título')
        link = item.get('link')
        children = item.get('items')

        # Cria a linha do item
        if link:
            # Se tiver link, cria um link markdown
            line = f"{indent}- [{text}]({link})\n"
        else:
            # Se não tiver link (geralmente é um título de seção), deixa em negrito ou texto puro
            line = f"{indent}- **{text}**\n"

        md_output += line

        # Se tiver filhos (items), chama a função recursivamente
        if children:
            md_output += generate_markdown(children, level + 1)

    return md_output

def main():
    input_file = '.vitepress/sidebar.js'
    output_file = 'index.md'

    print(f"Lendo {input_file}...")
    data = parse_js_file(input_file)

    if data:
        print("Gerando Markdown...")
        markdown_content = "# Índice de Navegação\n\n"
        markdown_content += generate_markdown(data)

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

        print(f"Sucesso! Arquivo salvo como: {output_file}")
    else:
        print("Não foi possível extrair dados do arquivo.")

if __name__ == "__main__":
    main()
