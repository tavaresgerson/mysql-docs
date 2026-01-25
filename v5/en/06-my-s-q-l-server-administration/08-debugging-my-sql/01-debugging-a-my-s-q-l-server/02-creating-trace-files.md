#### 5.8.1.2 Criando Arquivos Trace

Se o Server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não iniciar ou travar facilmente, você pode tentar criar um arquivo trace para encontrar o problema.

Para fazer isso, você deve ter um [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que tenha sido compilado com suporte a Debugging. Você pode verificar isso executando `mysqld -V`. Se o número da versão terminar com `-debug`, ele foi compilado com suporte para arquivos trace. (No Windows, o Server de Debugging é chamado [**mysqld-debug**](mysqld.html "4.3.1 mysqld — The MySQL Server") em vez de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").)

Inicie o Server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com um log trace em `/tmp/mysqld.trace` no Unix ou `\mysqld.trace` no Windows:

```sql
$> mysqld --debug
```

No Windows, você também deve usar o flag [`--standalone`](server-options.html#option_mysqld_standalone) para não iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como um Service. Em uma janela console, use este comando:

```sql
C:\> mysqld-debug --debug --standalone
```

Depois disso, você pode usar a ferramenta de linha de comando `mysql.exe` em uma segunda janela console para reproduzir o problema. Você pode parar o Server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

O arquivo trace pode se tornar **muito grande**! Para gerar um arquivo trace menor, você pode usar opções de debugging como estas:

[**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**](mysqld.html "4.3.1 mysqld — The MySQL Server")

Isso imprime apenas informações com as tags mais interessantes no arquivo trace.

Se você registrar um Bug, adicione ao Bug Report apenas as linhas do arquivo trace que indicam onde algo parece estar errado. Se você não conseguir localizar o local incorreto, abra um Bug Report e faça o upload de todo o arquivo trace para o relatório, para que um desenvolvedor MySQL possa analisá-lo. Para instruções, consulte [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

O arquivo trace é gerado com o pacote DBUG por Fred Fish. Consulte [Section 5.8.3, “The DBUG Package”](dbug-package.html "5.8.3 The DBUG Package").