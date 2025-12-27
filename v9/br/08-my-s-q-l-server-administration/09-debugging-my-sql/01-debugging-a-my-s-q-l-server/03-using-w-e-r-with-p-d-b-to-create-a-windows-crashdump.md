#### 7.9.1.3 Usando o WER com o PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição **Arquivos de Binários e Conjunto de Testes de Depuração do Arquivo ZIP Debug** do MySQL. Esses arquivos fornecem informações para depuração da sua instalação do MySQL em caso de problemas. Esse é um download separado do arquivo MSI padrão ou Zip.

Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado "Arquivos de Binários e Conjunto de Testes de Depuração do Arquivo ZIP".

O arquivo PDB contém informações mais detalhadas sobre o `mysqld` e outras ferramentas que permitem a criação de arquivos de registro e dump mais detalhados. Você pode usá-los com o **WinDbg** ou o Visual Studio para depurar o **mysqld**.

Para mais informações sobre os arquivos PDB, consulte o artigo da Base de Conhecimento da Microsoft 121366. Para mais informações sobre as opções de depuração disponíveis, consulte Ferramentas de Depuração para Windows.

Para usar o WinDbg, instale o Kit de Drivers Completo do Windows (WDK) ou instale a versão autônoma.

Importante

Os arquivos `.exe` e `.pdb` devem ser uma correspondência exata (ambos o número da versão e a edição do servidor MySQL); caso contrário, o WinDBG reclamará ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção [mysqld] no `my.ini`. Reinicie o servidor MySQL após fazer essas alterações.

2. Crie um diretório para armazenar os arquivos gerados, como `c:\symbols`

3. Determine o caminho para o seu executável `windbg.exe` usando o GUI de Encontrar ou a linha de comando, por exemplo: `dir /s /b windbg.exe` -- um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Inicie o `windbg.exe`, fornecendo os caminhos para `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp` e o código-fonte. Alternativamente, passe cada caminho a partir do GUI do WinDbg. Por exemplo:

   ```
   windbg.exe -i "C:\mysql-9.5.0-winx64\bin\"^
    -z "C:\mysql-9.5.0-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\9.5\9.5.0\mysql-9.5.0"^
    -y "C:\mysql-9.5.0-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   Nota

O caractere `^` e a nova linha são removidos pelo processador de linha de comando do Windows, então certifique-se de que os espaços permaneçam intactos.