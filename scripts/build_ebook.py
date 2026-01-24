import os
import subprocess
import sys
import re
import tempfile
import time

# Configurações do Projeto
BASE_DIR = "/home/tavares/Development/Traduções/mysql-docs"
DOCS_DIR = os.path.join(BASE_DIR, "v5/br")
OUTPUT_FILE = os.path.join(BASE_DIR, "mysql-v5-ptbr.epub")
METADATA = os.path.join(DOCS_DIR, "metadata.yaml")
COVER = os.path.join(BASE_DIR, "cover.png")
RESOURCE_PATH = os.path.join(BASE_DIR, "src/assets")
INDEX_FILE = os.path.join(DOCS_DIR, "index.md")

def check_dependencies():
    try:
        subprocess.run(['pandoc', '--version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except FileNotFoundError:
        print("ERRO: O 'pandoc' não foi encontrado no sistema.")
        return False

def get_chapters(index_path):
    chapters = []
    if not os.path.exists(index_path):
        print(f"ERRO: Arquivo de índice não encontrado: {index_path}")
        return []

    print(f"Lendo índice: {index_path}")
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
        print(f"ERRO ao processar index.md: {e}")
    return chapters

def create_merged_temp_file(chapters):
    print("Concatenando arquivos...")
    try:
        fd, temp_path = tempfile.mkstemp(suffix='.md', text=True)
        with os.fdopen(fd, 'w', encoding='utf-8') as outfile:
            # Não incluímos METADATA aqui, passaremos como argumento no Estágio 2
            for chapter_path in chapters:
                try:
                    with open(chapter_path, 'r', encoding='utf-8') as infile:
                        outfile.write(f"\n\n<!-- SOURCE: {os.path.basename(chapter_path)} -->\n\n")
                        outfile.write(infile.read())
                        outfile.write("\n")
                except Exception as e:
                    print(f"Erro ao ler {chapter_path}: {e}")

        print(f"Arquivo unificado: {temp_path}")
        return temp_path
    except Exception as e:
        print(f"Erro ao criar arquivo temporário: {e}")
        return None

def build_ebook():
    if not check_dependencies():
        sys.exit(1)

    chapters = get_chapters(INDEX_FILE)
    if not chapters:
        print("ERRO: Nenhum capítulo encontrado.")
        sys.exit(1)

    print(f"Total de capítulos: {len(chapters)}")

    # 1. Cria arquivo Markdown único
    merged_md = create_merged_temp_file(chapters)
    if not merged_md:
        sys.exit(1)

    # Arquivo intermediário HTML
    temp_html = os.path.join(BASE_DIR, "temp_ebook.html")

    try:
        # ETAPA 1: Markdown -> HTML
        print("\n" + "="*50)
        print("ETAPA 1/2: Convertendo Markdown para HTML...")
        print("(Isso valida a sintaxe e é mais rápido que gerar EPUB direto)")
        print("="*50)

        cmd_html = [
            'pandoc',
            merged_md,
            '-o', temp_html,
            f'--resource-path={RESOURCE_PATH}',
            '--metadata', 'title=MySQL Manual' # Título temporário
        ]

        start = time.time()
        subprocess.run(cmd_html, check=True)
        print(f"✅ HTML gerado com sucesso em {time.time() - start:.1f}s")

        # ETAPA 2: HTML -> EPUB
        print("\n" + "="*50)
        print("ETAPA 2/2: Empacotando HTML para EPUB...")
        print("="*50)

        cmd_epub = [
            'pandoc',
            temp_html,
            METADATA, # Aplica metadados reais (autor, título, etc)
            '-o', OUTPUT_FILE,
            f'--epub-cover-image={COVER}',
            f'--resource-path={RESOURCE_PATH}',
            '--verbose'
        ]

        start = time.time()
        # Usamos Popen para streaming de logs
        process = subprocess.Popen(cmd_epub, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        for line in process.stdout:
            print(line, end='')
        process.wait()

        if process.returncode == 0:
            print(f"\n✅ SUCESSO! eBook gerado em {time.time() - start:.1f}s")
            print(f"Arquivo final: {OUTPUT_FILE}")
        else:
            print(f"\n❌ Falha no empacotamento EPUB (Código {process.returncode})")

    except subprocess.CalledProcessError:
        print("\n❌ ERRO CRÍTICO na Etapa 1 (Markdown -> HTML).")
        print("Provavelmente há um erro de sintaxe em algum arquivo Markdown.")
    except KeyboardInterrupt:
        print("\nCancelado pelo usuário.")
    finally:
        # Limpeza
        if os.path.exists(merged_md):
            os.remove(merged_md)
        if os.path.exists(temp_html):
            os.remove(temp_html)
            print("Arquivos temporários removidos.")

if __name__ == "__main__":
    build_ebook()
