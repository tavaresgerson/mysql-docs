#### 7.9.1.3 Usando WER com PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição **ZIP Archive Debug Binaries & Test Suite** do MySQL. Estes arquivos fornecem informações para depurar sua instalação do MySQL em caso de problema. Este é um download separado do arquivo MSI ou Zip padrão.

::: info Note

Os arquivos PDB estão disponíveis em um arquivo separado chamado "ZIP Archive Debug Binaries & Test Suite".

:::

O arquivo PDB contém informações mais detalhadas sobre `mysqld` e outras ferramentas que permitem a criação de arquivos de rastreamento e despejo mais detalhados. Você pode usá-los com **WinDbg** ou Visual Studio para depurar `mysqld`.

Para obter mais informações sobre arquivos PDB e as opções de depuração disponíveis, consulte \[Debugging Tools for Windows] (<https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/>).

Para usar o WinDbg, instale o Kit de Controladores do Windows completo (WDK) ou instale a versão autônoma.

Importância

Os arquivos `.exe` e `.pdb` devem ser uma correspondência exata (tanto o número de versão quanto a edição do servidor MySQL); caso contrário, ou o WinDBG reclama ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção \[mysqld] em `my.ini`. Reinicie o servidor MySQL depois de fazer essas alterações.
2. Criar um diretório para armazenar os arquivos gerados, como `c:\symbols`
3. Determine o caminho para o seu **windbg.exe** executável usando a GUI de Busca ou a partir da linha de comando, por exemplo: `dir /s /b windbg.exe` - um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*
4. Inicie `windbg.exe` dando-lhe os caminhos para `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp`, e o código-fonte. Alternativamente, passe em cada caminho da GUI do WinDbg. Por exemplo:

   ```
   windbg.exe -i "C:\mysql-8.4.6-winx64\bin\"^
    -z "C:\mysql-8.4.6-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\8.4\8.4.6\mysql-8.4.6"^
    -y "C:\mysql-8.4.6-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   ::: info Note

   O caráter `^` e a nova linha são removidos pelo processador de linha de comando do Windows, portanto, certifique-se de que os espaços permaneçam intactos.

   :::
