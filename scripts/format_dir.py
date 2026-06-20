import sys
import re
from pathlib import Path


def reformat_markdown(text):
    lines = text.split('\n')
    output = []
    buffer = ""
    in_code_block = False

    # Expressões regulares para identificar o início de novos blocos no Markdown
    list_item_re = re.compile(r'^(\s*)([-*+]|\d+[\.\)])\s+')
    header_re = re.compile(r'^(\s*)#{1,6}\s+')
    blockquote_re = re.compile(r'^(\s*)>\s+')

    # Expressão regular fornecida para identificar links internos
    # Preserva links que começam com 'https:' e imagens (iniciadas com '!')
    internal_link_re = re.compile(r'(?<!!)\[((?:[^\[\]]|\[[^\]]*\])*)\]\((?!https:)[^)]+\)')

    def flush_buffer():
        nonlocal buffer
        if buffer:
            output.append(buffer)
            buffer = ""

    for line in lines:
        stripped = line.strip()

        # 1. Trata blocos de código
        if stripped.startswith('```'):
            flush_buffer()
            in_code_block = not in_code_block
            output.append(line.rstrip())
            continue

        if in_code_block:
            output.append(line.rstrip())
            continue

        # --- NOVA ETAPA: Filtro de links internos ---
        # Aplica a regex de substituição na linha atual.
        # \1 corresponde ao grupo 1 (o texto âncora capturado entre os colchetes).
        line = internal_link_re.sub(r'\1', line)
        stripped = line.strip()  # Atualiza a versão sem espaços após a substituição
        # -------------------------------------------

        # 2. Trata linhas em branco
        if not stripped:
            flush_buffer()
            output.append("")
            continue

        # 3. Identifica se a linha atual começa um NOVO elemento
        if list_item_re.match(line) or header_re.match(line) or blockquote_re.match(line):
            flush_buffer()
            buffer = line.rstrip()
        else:
            # 4. É uma continuação de texto
            if not buffer:
                buffer = line.rstrip()
            else:
                buffer = buffer.rstrip() + " " + stripped

    flush_buffer()
    return '\n'.join(output)


def process_directory(directory_path):
    path = Path(directory_path)

    if not path.is_dir():
        print(f"Erro: '{directory_path}' não é um diretório válido ou não existe.\n", file=sys.stderr)
        return

    # Busca todos os arquivos .md recursivamente usando rglob
    md_files = list(path.rglob('*.md'))

    if not md_files:
        print(f"Aviso: Nenhum arquivo .md foi encontrado no diretório '{directory_path}' ou em seus subdiretórios.\n")
        return

    print(f"Encontrados {len(md_files)} arquivos .md. Iniciando formatação...")

    success_count = 0
    error_count = 0

    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            formatted_content = reformat_markdown(content)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(formatted_content)

            print(f"  [OK] {file_path}")
            success_count += 1

        except Exception as e:
            print(f"  [ERRO] Falha ao processar '{file_path}': {e}", file=sys.stderr)
            error_count += 1

    print(f"\nResumo: {success_count} arquivos formatados com sucesso, {error_count} erros.\n")


if __name__ == '__main__':
    print("=== Formatador de Markdown Recursivo ===")
    print("Digite 'sair', 'q' ou pressione Ctrl+C para encerrar o programa.\n")

    while True:
        try:
            input_dir = input("Digite o caminho absoluto do diretório: ").strip()

            if input_dir.lower() in ['sair', 'exit', 'quit', 'q']:
                print("Encerrando o script...")
                break

            if not input_dir:
                continue

            process_directory(input_dir)

        except KeyboardInterrupt:
            print("\nEncerrando o script...")
            break
        except Exception as e:
            print(f"Erro inesperado no loop principal: {e}\n", file=sys.stderr)