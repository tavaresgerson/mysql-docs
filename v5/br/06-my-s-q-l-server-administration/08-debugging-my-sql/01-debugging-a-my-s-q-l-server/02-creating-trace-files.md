#### 5.8.1.2 Criar arquivos de rastreamento

Se o servidor **mysqld** não iniciar ou elebrar facilmente, você pode tentar criar um arquivo de registro para encontrar o problema.

Para fazer isso, você deve ter um **mysqld** que foi compilado com suporte de depuração. Você pode verificar isso executando `mysqld -V`. Se o número da versão terminar com `-debug`, ele foi compilado com suporte para arquivos de rastreamento. (No Windows, o servidor de depuração é chamado de **mysqld-debug** em vez de **mysqld**.)

Inicie o servidor **mysqld** com um log de rastreamento em `/tmp/mysqld.trace` no Unix ou `\mysqld.trace` no Windows:

```sql
$> mysqld --debug
```

No Windows, você também deve usar a bandeira `--standalone` para não iniciar o **mysqld** como um serviço. Em uma janela de console, use este comando:

```sql
C:\> mysqld-debug --debug --standalone
```

Depois disso, você pode usar a ferramenta de linha de comando `mysql.exe` em uma segunda janela do console para reproduzir o problema. Você pode parar o servidor **mysqld** com **mysqladmin shutdown**.

O arquivo de registro pode se tornar **muito grande**! Para gerar um arquivo de registro menor, você pode usar opções de depuração como esta:

**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**

Isso imprime apenas informações com as tags mais interessantes no arquivo de registro.

Se você enviar um relatório de erro, adicione apenas as linhas do arquivo de registro que indicam onde algo parece estar errado. Se você não conseguir localizar o local errado, abra um relatório de erro e faça o upload de todo o arquivo de registro para o relatório, para que um desenvolvedor do MySQL possa analisá-lo. Para obter instruções, consulte Seção 1.5, “Como relatar erros ou problemas”.

O arquivo de rastreamento é feito com o pacote DBUG por Fred Fish. Veja Seção 5.8.3, “O Pacote DBUG”.
