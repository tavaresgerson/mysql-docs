#### 7.9.1.2 Criando Arquivos de Rastreamento

Se o servidor `mysqld` não iniciar ou falhar facilmente, você pode tentar criar um arquivo de rastreamento para encontrar o problema.

Para fazer isso, você deve ter um `mysqld` compilado com suporte de depuração. Você pode verificar isso executando `mysqld -V`. Se o número da versão terminar com `-debug`, ele foi compilado com suporte para arquivos de rastreamento. (Em Windows, o servidor de depuração é chamado `mysqld-debug` em vez de `mysqld`.)

Inicie o servidor `mysqld` com um log de rastreamento em `/tmp/mysqld.trace` em Unix ou `\mysqld.trace` em Windows:

```
$> mysqld --debug
```

Em Windows, você também deve usar a flag `--standalone` para não iniciar o `mysqld` como um serviço. Em uma janela de console, use este comando:

```
C:\> mysqld-debug --debug --standalone
```

Depois disso, você pode usar a ferramenta de linha de comando `mysql.exe` em uma segunda janela de console para reproduzir o problema. Você pode parar o servidor `mysqld` com `mysqladmin shutdown`.

O arquivo de rastreamento pode se tornar **muito grande**! Para gerar um arquivo de rastreamento menor, você pode usar opções de depuração como esta:

`mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace`

Isso apenas imprime informações com as tags mais interessantes no arquivo de rastreamento.

Se você registrar um bug, adicione apenas aquelas linhas do arquivo de rastreamento ao relatório do bug que indicam onde algo parece estar errado. Se você não conseguir localizar o lugar errado, abra um relatório de bug e faça o upload de todo o arquivo de rastreamento ao relatório, para que um desenvolvedor do MySQL possa examiná-lo. Para instruções, consulte a Seção 1.6, “Como Registrar Bugs ou Problemas”.

O arquivo de rastreamento é feito com o pacote `DBUG` por Fred Fish. Veja a Seção 7.9.4, “O Pacote DBUG”.