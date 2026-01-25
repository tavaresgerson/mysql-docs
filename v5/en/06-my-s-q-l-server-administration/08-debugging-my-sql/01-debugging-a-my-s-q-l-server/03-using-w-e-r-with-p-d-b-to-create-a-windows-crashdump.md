#### 5.8.1.3 Usando WER com PDB para criar um crashdump do Windows

Arquivos Program Database (com o sufixo `pdb`) estão incluídos na distribuição **ZIP Archive Debug Binaries & Test Suite** do MySQL. Estes arquivos fornecem informações para o debugging da sua instalação MySQL em caso de problemas. Este é um download separado do arquivo MSI ou Zip padrão.

Nota

Os arquivos PDB estão disponíveis em um arquivo separado rotulado como "ZIP Archive Debug Binaries & Test Suite".

O arquivo PDB contém informações mais detalhadas sobre `mysqld` e outras ferramentas, o que permite a criação de arquivos trace e dump mais detalhados. Você pode usá-los com o **WinDbg** ou Visual Studio para fazer o debug de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Para mais informações sobre arquivos PDB, consulte [Microsoft Knowledge Base Article 121366](http://support.microsoft.com/kb/121366/). Para mais informações sobre as opções de debugging disponíveis, consulte [Debugging Tools for Windows](http://www.microsoft.com/whdc/devtools/debugging/default.mspx).

Para usar o WinDbg, instale o Windows Driver Kit (WDK) completo ou instale a versão standalone.

Importante

Os arquivos `.exe` e `.pdb` devem ser uma correspondência exata (tanto o número de versão quanto a edição do MySQL Server) ou o WinDBG reclamará ao tentar carregar os symbols.

1. Para gerar um minidump `mysqld.dmp`, habilite a opção [`core-file`](server-options.html#option_mysqld_core-file) sob a seção [mysqld] em `my.ini`. Reinicie o MySQL Server após realizar estas alterações.

2. Crie um diretório para armazenar os arquivos gerados, como `c:\symbols`

3. Determine o path (caminho) para o seu executável **windbg.exe** usando o GUI Find ou a partir da command line, por exemplo: `dir /s /b windbg.exe` -- um default comum é *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Inicie `windbg.exe`, fornecendo-lhe os paths para `mysqld-debug.exe`, `mysqld.pdb`, `mysqld.dmp` e o source code. Alternativamente, passe cada path pelo WinDbg GUI. Por exemplo:

   ```sql
   windbg.exe -i "C:\mysql-5.7.44-winx64\bin\"^
    -z "C:\mysql-5.7.44-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\5.7\5.7.44\mysql-5.7.44"^
    -y "C:\mysql-5.7.44-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   Nota

   O caractere `^` e a newline são removidos pelo processador da command line do Windows, portanto, certifique-se de que os espaços permaneçam intactos.