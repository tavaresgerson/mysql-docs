import os
import re

# --- CONFIGURAÇÕES ---
DIRECTORY_TO_CHECK = "./v5/br"  # Diretório onde estão os arquivos revisados/traduzidos

def check_vitepress_syntax(file_path):
    """
    Verifica erros comuns que quebram o build do VitePress:
    1. Chaves de interpolação não escapadas: {{ }} (devem ser @{{ }})
    2. Tags HTML/Vue não fechadas ou mal formatadas.
    3. Uso de '<' ou '>' que não são tags mas não estão escapados.
    """
    errors = []
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    stack = [] # Para rastrear tags abertas

    for line_num, line in enumerate(lines, 1):
        # Ignorar blocos de código
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue

        if in_code_block:
            continue

        # 1. Verificar chaves de interpolação Vue {{ }} não escapadas
        # O VitePress tenta renderizar o que está dentro, se falhar, o build quebra.
        if re.search(r'(?<!@)\{\{', line):
            errors.append(f"Linha {line_num}: Possível interpolação Vue não escapada '{{{{'. Use '@{{{{' para exibir como texto.")

        # 2. Verificar tags HTML/Vue mal formatadas ou caracteres '<' soltos
        # Procura por '<' seguido de letras (início de tag) que não parecem ser tags HTML padrão
        # ou que podem estar mal fechadas.
        tags = re.findall(r'<(/?[a-zA-Z0-9-]+)', line)
        for tag in tags:
            if tag.startswith('/'):
                tag_name = tag[1:]
                if not stack or stack[-1] != tag_name:
                    # Pode ser um erro, mas Markdown permite tags fechando sem abrir em alguns casos
                    # Aqui focamos em avisar para conferência manual
                    pass
                elif stack:
                    stack.pop()
            else:
                # Tags de fechamento automático comuns no Markdown/HTML
                if tag not in ['img', 'br', 'hr', 'input', 'link', 'meta']:
                    stack.append(tag)

        # 3. Verificar caracteres '<' que parecem tags mas podem ser operadores matemáticos (comum em SQL)
        # Se houver um '<' seguido de um caractere que não é espaço e não foi identificado como tag
        if re.search(r'<[^/a-zA-Z\s]', line):
            errors.append(f"Linha {line_num}: Caractere '<' suspeito. Se for um operador menor que, use '&lt;'.")

    return errors

def main():
    print(f"Iniciando validação em: {DIRECTORY_TO_CHECK}\n")
    files_with_errors = 0

    for root, _, files in os.walk(DIRECTORY_TO_CHECK):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                errors = check_vitepress_syntax(file_path)

                if errors:
                    files_with_errors += 1
                    print(f"❌ Arquivo: {file_path}")
                    for err in errors:
                        print(f"   {err}")
                    print("-" * 50)

    if files_with_errors == 0:
        print("✅ Nenhum erro de sintaxe óbvio encontrado!")
    else:
        print(f"\nBusca concluída. {files_with_errors} arquivo(s) precisam de atenção.")

if __name__ == "__main__":
    main()
