import os
import subprocess
import sys
import re
import tempfile
import time

# Configurações
BASE_DIR = "/home/tavares/Development/Traduções/mysql-docs"
DOCS_DIR = os.path.join(BASE_DIR, "v5/br")
INDEX_FILE = os.path.join(DOCS_DIR, "index.md")
METADATA = os.path.join(DOCS_DIR, "metadata.yaml")

def get_chapters(index_path):
    chapters = []
    if not os.path.exists(index_path):
        return []
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        links = re.findall(r'\]\(([^)]+)\)', content)
        for link in links:
            if link.endswith('.md') and not link.startswith('http'):
                clean_link = link.lstrip('/')
                full_path = os.path.join(DOCS_DIR, clean_link)
                if os.path.exists(full_path):
                    chapters.append(full_path)
    except Exception as e:
        print(f"Erro ao ler índice: {e}")
    return chapters

def run_test(test_name, chapters, output_format='html', use_assets=False):
    print(f"\n=== TESTE: {test_name} ===")
    print(f"Arquivos: {len(chapters)}")
    print(f"Formato: {output_format}")

    # Cria arquivo temporário unificado
    fd, temp_path = tempfile.mkstemp(suffix='.md', text=True)
    with os.fdopen(fd, 'w', encoding='utf-8') as outfile:
        # Adiciona metadados simples
        if os.path.exists(METADATA):
            with open(METADATA, 'r') as m:
                outfile.write(m.read() + "\n\n")

        for ch in chapters:
            with open(ch, 'r') as infile:
                outfile.write(f"\n\n<!-- {os.path.basename(ch)} -->\n\n")
                outfile.write(infile.read())
                outfile.write("\n")

    output_file = os.path.join(BASE_DIR, f"debug_output.{output_format}")

    cmd = ['pandoc', temp_path, '-o', output_file]
    if output_format == 'epub':
        cmd.append('--verbose')

    print("Executando Pandoc...", end=' ', flush=True)
    start = time.time()

    try:
        # Timeout de 60 segundos para o teste
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        elapsed = time.time() - start

        if result.returncode == 0:
            print(f"✅ SUCESSO em {elapsed:.2f}s")
            print(f"Gerado: {output_file}")
            return True
        else:
            print(f"❌ FALHA (Código {result.returncode})")
            print("Erro:", result.stderr[:500]) # Mostra os primeiros 500 chars do erro
            return False
    except subprocess.TimeoutExpired:
        print("❌ TIMEOUT (Mais de 60s)")
        print("O Pandoc travou mesmo com poucos arquivos.")
        return False
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

def main():
    all_chapters = get_chapters(INDEX_FILE)
    if not all_chapters:
        print("Nenhum capítulo encontrado.")
        return

    # Teste 1: Apenas 10 arquivos, saída HTML (mais leve)
    if not run_test("Smoke Test (10 arquivos -> HTML)", all_chapters[:10], 'html'):
        print("\nDIAGNÓSTICO: O Pandoc falhou até no teste mais básico.")
        print("Verifique se o 'pandoc' está instalado corretamente e se os arquivos .md são válidos.")
        return

    # Teste 2: 100 arquivos, saída EPUB (teste de empacotamento)
    if not run_test("Carga Média (100 arquivos -> EPUB)", all_chapters[:100], 'epub'):
        print("\nDIAGNÓSTICO: Falha ao gerar EPUB com carga média.")
        print("Pode ser um problema de memória ou um arquivo específico corrompido nos primeiros 100.")
        return

    # Teste 3: 500 arquivos (teste de escala)
    if not run_test("Carga Alta (500 arquivos -> EPUB)", all_chapters[:500], 'epub'):
        print("\nDIAGNÓSTICO: Falha ao escalar para 500 arquivos.")
        return

    print("\nCONCLUSÃO: O sistema parece capaz de processar blocos de arquivos.")
    print("Se o script completo trava, provavelmente há um arquivo corrompido mais para o final da lista")
    print("ou o volume total (2000+) excede o limite do Pandoc nesta máquina.")

if __name__ == "__main__":
    main()
