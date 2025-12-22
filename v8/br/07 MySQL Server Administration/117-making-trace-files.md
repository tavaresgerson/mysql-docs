#### 7.9.1.2 Criação de ficheiros de rastreamento

Se o servidor `mysqld` não iniciar ou falhar facilmente, você pode tentar criar um arquivo de rastreamento para encontrar o problema.

Para fazer isso, você deve ter um `mysqld` que tenha sido compilado com suporte de depuração. Você pode verificar isso executando `mysqld -V`. Se o número de versão termina com `-debug`, ele é compilado com suporte para arquivos de rastreamento. (No Windows, o servidor de depuração é chamado de **mysqld-debug** em vez de `mysqld`.)

Inicie o servidor `mysqld` com um registro de rastreamento em `/tmp/mysqld.trace` no Unix ou `\mysqld.trace` no Windows:

```
$> mysqld --debug
```

No Windows, você também deve usar a bandeira `--standalone` para não iniciar `mysqld` como um serviço. Em uma janela do console, use este comando:

```
C:\> mysqld-debug --debug --standalone
```

Depois disso, você pode usar a ferramenta de linha de comando `mysql.exe` em uma segunda janela do console para reproduzir o problema. Você pode parar o servidor `mysqld` com **mysqladmin shutdown**.

O arquivo de rastreamento pode se tornar **muito grande**! Para gerar um arquivo de rastreamento menor, você pode usar opções de depuração algo assim:

**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**

Isto só imprime informações com as etiquetas mais interessantes para o arquivo de rastreamento.

Se você arquivar um bug, por favor adicione apenas as linhas do arquivo de rastreamento para o relatório de bugs que indicam onde algo parece dar errado. Se você não conseguir localizar o lugar errado, abra um relatório de bugs e faça upload do arquivo de rastreamento inteiro para o relatório, para que um desenvolvedor do MySQL possa dar uma olhada nele.

O arquivo de rastreamento é feito com o pacote `DBUG` por Fred Fish.
