import re
import sys

def reformat_markdown(text):
    lines = text.split('\n')
    output = []
    buffer = ""
    in_code_block = False

    # Expressões regulares para identificar o início de novos blocos no Markdown
    # Identifica listas: "1.", "1)", "-", "*", "+"
    list_item_re = re.compile(r'^(\s*)([-*+]|\d+[\.\)])\s+')
    # Identifica cabeçalhos: "#", "##", etc.
    header_re = re.compile(r'^(\s*)#{1,6}\s+')
    # Identifica blockquotes: ">"
    blockquote_re = re.compile(r'^(\s*)>\s+')

    # Expressão regular para remover links internos, preservando âncora, ignorando links externos e imagens
    internal_link_re = re.compile(r'(?<!!)\[((?:[^\[\]]|\[[^\]]*\])*)\]\((?!https:)[^)]+\)')

    def flush_buffer():
        """Despeja o parágrafo acumulado na lista de saída final"""
        nonlocal buffer
        if buffer:
            output.append(buffer)
            buffer = ""

    for line in lines:
        stripped = line.strip()

        # 1. Trata blocos de código (não altera nada dentro deles)
        if stripped.startswith('```'):
            flush_buffer()
            in_code_block = not in_code_block
            output.append(line.rstrip())
            continue

        if in_code_block:
            output.append(line.rstrip())
            continue

        # --- Filtro de links internos ---
        line = internal_link_re.sub(r'\1', line)
        stripped = line.strip()  # Atualiza para os próximos passos
        # --------------------------------

        # 2. Trata linhas em branco (separam parágrafos)
        if not stripped:
            flush_buffer()
            output.append("")
            continue

        # 3. Identifica se a linha atual começa um NOVO elemento (lista, título, citação)
        if list_item_re.match(line) or header_re.match(line) or blockquote_re.match(line):
            flush_buffer()
            buffer = line.rstrip()  # Começa um novo parágrafo mantendo a indentação original
        else:
            # 4. É uma continuação de texto!
            if not buffer:
                # Se o buffer estiver vazio, inicia com a linha atual
                buffer = line.rstrip()
            else:
                # Junta a linha de continuação na mesma linha, removendo os espaços excedentes do início
                buffer = buffer.rstrip() + " " + stripped

    # Garante que a última linha processada seja adicionada
    flush_buffer()

    return '\n'.join(output)


if __name__ == '__main__':
    print("=== Formatador de Markdown Interativo ===")
    print("Digite 'sair', 'q' ou pressione Ctrl+C para encerrar o programa.\n")

    while True:
        try:
            # Pede o caminho absoluto do arquivo
            input_file = input("Digite o caminho absoluto do arquivo .md: ").strip()

            # Condição para encerrar o script
            if input_file.lower() in ['sair', 'exit', 'quit', 'q']:
                print("Encerrando o script...")
                break

            # Ignora se o usuário apertar Enter com a linha vazia
            if not input_file:
                continue

            with open(input_file, 'r', encoding='utf-8') as f:
                content = f.read()

            formatted_content = reformat_markdown(content)

            # Sobrescreve o arquivo original com o conteúdo formatado
            with open(input_file, 'w', encoding='utf-8') as f:
                f.write(formatted_content)

            print(f"Sucesso: O arquivo '{input_file}' foi formatado e sobrescrito!\n")

        except FileNotFoundError:
            print(f"Erro: Arquivo '{input_file}' não encontrado. Verifique o caminho e tente novamente.\n",
                  file=sys.stderr)
        except KeyboardInterrupt:
            # Permite sair de forma limpa usando Ctrl+C
            print("\nEncerrando o script...")
            break
        except Exception as e:
            print(f"Erro inesperado: {e}\n", file=sys.stderr)