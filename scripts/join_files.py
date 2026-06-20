import os
import sys
import shutil
from pathlib import Path


def consolidate_markdown_docs(root_path):
    root = Path(root_path).resolve()

    if not root.is_dir():
        print(f"Erro: '{root_path}' não é um diretório válido ou não existe.\n", file=sys.stderr)
        return

    # os.walk com topdown=False varre os diretórios mais profundos primeiro.
    # Isso garante que diretórios aninhados sejam consolidados de dentro para fora.
    for dirpath, _, _ in os.walk(root, topdown=False):
        current_dir = Path(dirpath)

        # Ignora o diretório raiz informado pelo usuário
        if current_dir == root:
            continue

        # Lista apenas os arquivos .md presentes DIRETAMENTE neste diretório
        md_files = [f for f in current_dir.iterdir() if f.is_file() and f.suffix.lower() == '.md']

        # Se não houver arquivos Markdown, pula a pasta (evita apagar pastas com imagens ou outros assets)
        if not md_files:
            continue

        print(f"Processando: {current_dir.relative_to(root)}")

        # Isola o index.md e ordena o restante alfabeticamente
        index_file = current_dir / 'index.md'
        other_md_files = sorted([f for f in md_files if f.name.lower() != 'index.md'])

        files_to_concat = []
        if index_file.exists():
            files_to_concat.append(index_file)
        files_to_concat.extend(other_md_files)

        concatenated_content = []
        for md_path in files_to_concat:
            try:
                with open(md_path, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        concatenated_content.append(content)
            except Exception as e:
                print(f"  [ERRO] Falha ao ler '{md_path.name}': {e}", file=sys.stderr)

        if not concatenated_content:
            print("  [AVISO] Nenhum conteúdo de texto encontrado. Pulando.")
            continue

        # O novo arquivo terá o nome da subpasta e ficará um nível acima (no diretório pai)
        new_file_name = f"{current_dir.name}.md"
        new_file_path = current_dir.parent / new_file_name

        try:
            # Junta os arquivos com duas quebras de linha para manter os parágrafos isolados
            with open(new_file_path, 'w', encoding='utf-8') as f:
                f.write('\n\n\n'.join(concatenated_content) + '\n')
            print(f"  [OK] Criado: {new_file_path.name} (Nível acima)")

            # Remove o diretório original completamente (arquivos antigos vão junto)
            shutil.rmtree(current_dir)
            print(f"  [OK] Diretório original removido.")

        except Exception as e:
            print(f"  [ERRO] Falha na gravação ou exclusão de '{current_dir.name}': {e}", file=sys.stderr)


if __name__ == '__main__':
    print("=== Concatenador de Pastas Markdown ===")
    print("ATENÇÃO: Este script apagará as subpastas processadas e seus arquivos após a concatenação.")
    print("Recomenda-se fazer um backup (cópia) do diretório antes de executar.\n")

    while True:
        try:
            input_dir = input("Digite o caminho absoluto do diretório principal (ou 'q' para sair): ").strip()

            if input_dir.lower() in ['sair', 'exit', 'quit', 'q']:
                break

            if not input_dir:
                continue

            consolidate_markdown_docs(input_dir)
            print("\nProcesso concluído!\n")

        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Erro inesperado: {e}\n", file=sys.stderr)
