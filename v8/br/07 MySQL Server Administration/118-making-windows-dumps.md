#### 7.9.1.3 Usando o WER com o PDB para criar um crashdump do Windows

Os arquivos de banco de dados do programa (com o sufixo `pdb`) estão incluídos na distribuição **Arquivos de Binários de Depuração e Conjunto de Testes de Arquivos de Depuração em Arquivo ZIP** do MySQL. Esses arquivos fornecem informações para depuração da sua instalação do MySQL em caso de problemas. Este é um download separado do arquivo padrão MSI ou ZIP.

::: info Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado "Arquivos de Binários de Depuração e Conjunto de Testes de Arquivos de Depuração em Arquivo ZIP".

:::

O arquivo PDB contém informações mais detalhadas sobre o `mysqld` e outras ferramentas que permitem a criação de arquivos de registro e dump mais detalhados. Você pode usá-los com o `WinDbg` ou o Visual Studio para depurar o `mysqld`.

Para obter mais informações sobre os arquivos PDB e as opções de depuração disponíveis, consulte [Ferramentas de Depuração para Windows](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/).

Para usar o `WinDbg`, instale o Kit de Drivers do Windows (WDK) completo ou instale a versão autônoma.

Importante

Os arquivos `.exe` e `.pdb` devem ser uma correspondência exata (ambos o número da versão e a edição do servidor MySQL); caso contrário, o WinDBG reclamará ao tentar carregar os símbolos.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção `core-file` na seção `[mysqld]` no `my.ini`. Reinicie o servidor MySQL após fazer essas alterações.
2. Crie um diretório para armazenar os arquivos gerados, como `c:\symbols`
3. Determine o caminho para o seu executável `windbg.exe` usando o GUI de Encontrar ou a linha de comando, por exemplo: `dir /s /b windbg.exe` -- um padrão comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*
4. Inicie o `windbg.exe`, fornecendo os caminhos para `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp` e o código-fonte. Alternativamente, forneça cada caminho a partir do GUI do WinDbg. Por exemplo:

   ```
   windbg.exe -i "C:\mysql-8.4.6-winx64\bin\"^
    -z "C:\mysql-8.4.6-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\8.4\8.4.6\mysql-8.4.6"^
    -y "C:\mysql-8.4.6-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   ::: info Nota

   O caractere `^` e a nova linha são removidos pelo processador de linha de comando do Windows, então certifique-se de que os espaços permaneçam intactos.

:::