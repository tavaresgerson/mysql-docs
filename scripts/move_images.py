import sys
import shutil
from pathlib import Path

def mover_imagens(caminho_str):
    caminho_base = Path(caminho_str).resolve()
    
    if not caminho_base.is_dir():
        print(f"Erro: '{caminho_str}' não é um diretório válido ou não existe.\n")
        return

    pasta_destino = caminho_base / 'images'
    
    # Cria a pasta destino se não existir
    pasta_destino.mkdir(exist_ok=True)
    
    extensoes_imagens = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'}
    imagens_movidas = 0

    # Varre recursivamente todos os arquivos
    for arquivo in caminho_base.rglob('*'):
        # Ignora se não for arquivo, se a extensão não for de imagem, ou se já estiver na pasta destino
        if not arquivo.is_file() or arquivo.suffix.lower() not in extensoes_imagens:
            continue
            
        if arquivo.parent == pasta_destino:
            continue

        destino_final = pasta_destino / arquivo.name

        # Trata conflitos de nomes (evita sobrescrever arquivos diferentes com o mesmo nome)
        if destino_final.exists():
            contador = 1
            while True:
                novo_nome = f"{arquivo.stem}_{contador}{arquivo.suffix}"
                destino_final = pasta_destino / novo_nome
                if not destino_final.exists():
                    break
                contador += 1

        try:
            shutil.move(str(arquivo), str(destino_final))
            print(f"[+] Movido: {arquivo.name} -> images/{destino_final.name}")
            imagens_movidas += 1
        except Exception as e:
            print(f"[!] Erro ao mover {arquivo.name}: {e}")

    print(f"\nResumo: {imagens_movidas} imagens movidas para {pasta_destino}\n")

def main():
    print("=== Organizador de Imagens ===")
    print("Move recursivamente todas as imagens para a pasta 'images' na raiz do diretório informado.")
    print("Pressione 'q' e dê Enter para sair a qualquer momento.\n")

    while True:
        entrada = input("Digite o caminho completo da pasta base: ").strip()
        
        if entrada.lower() == 'q':
            print("Encerrando o programa.")
            sys.exit(0)
            
        if not entrada:
            continue
            
        mover_imagens(entrada)

if __name__ == "__main__":
    main()
