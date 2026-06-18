#### 7.9.1.3 Usar o WER com o PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição de **Arquivos de Binários de Depuração e Conjunto de Testes ZIP** do MySQL. Esses arquivos fornecem informações para depuração da sua instalação do MySQL em caso de problemas. Este é um download separado do arquivo MSI ou Zip padrão.

Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado "ZIP Archive Debug Binaries & Test Suite".

O arquivo PDB contém informações mais detalhadas sobre `mysqld` e outras ferramentas que permitem a criação de arquivos de depuração e dump mais detalhados. Você pode usá-los com o **WinDbg** ou o Visual Studio para depurar o **mysqld**.

Para obter mais informações sobre arquivos PDB e as opções de depuração disponíveis, consulte Ferramentas de depuração para Windows.

Para usar o WinDbg, instale o Kit de Drivers Completo do Windows (WDK) ou instale a versão independente.

Importante

Os arquivos `.exe` e `.pdb` devem corresponder exatamente (tanto o número da versão quanto a edição do servidor MySQL); caso contrário, o WinDBG reclamará ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção \[mysqld] em `my.ini`. Reinicie o servidor MySQL após fazer essas alterações.

2. Crie um diretório para armazenar os arquivos gerados, como `c:\symbols`

3. Determine o caminho para o seu executável **windbg.exe** usando a interface gráfica de pesquisa ou a linha de comando, por exemplo: `dir /s /b windbg.exe` -- um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Inicie `windbg.exe` e forneça as seguintes diretivas: `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp` e o código-fonte. Alternativamente, insira cada caminho na interface gráfica do WinDbg. Por exemplo:

   ```
   windbg.exe -i "C:\mysql-8.0.44-winx64\bin\"^
    -z "C:\mysql-8.0.44-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\8.0\8.0.44\mysql-8.0.44"^
    -y "C:\mysql-8.0.44-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   Nota

   O caractere `^` e a nova linha são removidos pelo processador de linha de comando do Windows, então certifique-se de que os espaços permaneçam intactos.
