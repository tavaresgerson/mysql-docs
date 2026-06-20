import re
from pathlib import Path
import sys

def processar_diretorio(caminho_str):
    """Varre o diretório e remove os TOCs dos arquivos de texto."""
    caminho = Path(caminho_str)
    
    if not caminho.is_dir():
        print(f"Erro: '{caminho_str}' não é um diretório válido ou não existe.\n")
        return

    # Regex compilado para melhor performance no loop
    padrao = re.compile(r"^\[\d+(?:\.\d+)*\s+[^\]]+\]\([^)]+\.html\)\n*", re.MULTILINE)
    
    arquivos_modificados = 0
    total_remocoes = 0

    # Busca recursivamente por arquivos .md e .txt
    extensoes = ('*.md', '*.txt')
    arquivos = []
    for ext in extensoes:
        arquivos.extend(caminho.rglob(ext))

    if not arquivos:
        print("Nenhum arquivo .md ou .txt encontrado neste diretório.\n")
        return

    for arquivo in arquivos:
        try:
            with open(arquivo, 'r', encoding='utf-8') as f:
                conteudo = f.read()

            # subn retorna uma tupla: (novo_texto, numero_de_substituicoes)
            novo_conteudo, substituicoes = padrao.subn("", conteudo)

            if substituicoes > 0:
                with open(arquivo, 'w', encoding='utf-8') as f:
                    f.write(novo_conteudo)
                
                print(f"[+] Ajustado: {arquivo.name} ({substituicoes} TOCs removidos)")
                arquivos_modificados += 1
                total_remocoes += substituicoes

        except UnicodeDecodeError:
            print(f"[!] Erro de codificação ao ler {arquivo.name}. Verifique se é UTF-8.")
        except Exception as e:
            print(f"[!] Erro inesperado ao processar {arquivo.name}: {e}")

    print(f"\nResumo: {total_remocoes} TOCs removidos em {arquivos_modificados} arquivos.\n")


def main():
    print("=== Limpador de TOC ===")
    print("Formatos suportados: .md e .txt")
    print("Pressione 'q' e dê Enter para sair a qualquer momento.\n")

    while True:
        entrada = input("Digite o caminho completo da pasta: ").strip()
        
        if entrada.lower() == 'q':
            print("Encerrando o programa.")
            sys.exit(0)
            
        if not entrada:
            continue
            
        processar_diretorio(entrada)

if __name__ == "__main__":
    main()
