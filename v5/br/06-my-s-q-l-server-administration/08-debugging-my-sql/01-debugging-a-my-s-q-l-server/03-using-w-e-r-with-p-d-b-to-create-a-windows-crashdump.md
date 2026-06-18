#### 5.8.1.3 Usar o WER com o PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição **ZIP Archive Debug Binaries & Test Suite** do MySQL. Esses arquivos fornecem informações para depuração da sua instalação do MySQL em caso de problemas. Este é um download separado do arquivo MSI ou Zip padrão.

Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado "ZIP Archive Debug Binaries & Test Suite".

O arquivo PDB contém informações mais detalhadas sobre o `mysqld` e outras ferramentas que permitem a criação de arquivos de registro e de depuração mais detalhados. Você pode usá-los com o **WinDbg** ou o Visual Studio para depurar o **mysqld**.

Para obter mais informações sobre arquivos PDB, consulte o artigo Base de Conhecimento da Microsoft KB 121366. Para obter mais informações sobre as opções de depuração disponíveis, consulte Ferramentas de depuração para Windows.

Para usar o WinDbg, instale o Kit de Drivers Completo do Windows (WDK) ou instale a versão independente.

Importante

Os arquivos `.exe` e `.pdb` devem ser idênticos (ambos o número da versão e a edição do servidor MySQL) ou o WinDBG reclamará ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção [mysqld] no `my.ini`. Reinicie o servidor MySQL após fazer essas alterações.

2. Crie um diretório para armazenar os arquivos gerados, como `c:\símbolos`

3. Determine o caminho para o seu executável **windbg.exe** usando a interface gráfica de usuário ou a linha de comando, por exemplo: `dir /s /b windbg.exe` -- um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Inicie o `windbg.exe`, fornecendo as seguintes diretivas: `mysqld-debug.exe`, `mysqld.pdb`, `mysqld.dmp` e o código-fonte. Alternativamente, insira cada caminho na interface gráfica do WinDbg. Por exemplo:

   ```sql
   windbg.exe -i "C:\mysql-5.7.44-winx64\bin\"^
    -z "C:\mysql-5.7.44-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\5.7\5.7.44\mysql-5.7.44"^
    -y "C:\mysql-5.7.44-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   Nota

   O caractere `^` e a nova linha são removidos pelo processador de linha de comando do Windows, então certifique-se de que os espaços permaneçam intactos.
