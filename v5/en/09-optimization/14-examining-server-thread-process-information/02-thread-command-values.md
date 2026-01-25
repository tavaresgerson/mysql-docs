### 8.14.2 Valores de Comando de Thread

Um Thread pode ter qualquer um dos seguintes valores de `Command`:

* `Binlog Dump`

  Este é um Thread na origem da replicação, responsável por enviar o conteúdo do binary log para uma réplica.

* `Change user`

  O Thread está executando uma operação de `change user`.

* `Close stmt`

  O Thread está fechando um prepared statement.

* `Connect`

  Uma réplica está conectada à sua origem.

* `Connect Out`

  Uma réplica está se conectando à sua origem.

* `Create DB`

  O Thread está executando uma operação de `create database`.

* `Daemon`

  Este Thread é interno ao servidor, não sendo um Thread que atende a uma conexão de cliente.

* `Debug`

  O Thread está gerando informações de debugging.

* `Delayed insert`

  O Thread é um manipulador de `delayed insert`.

* `Drop DB`

  O Thread está executando uma operação de `drop database`.

* `Error`
* `Execute`

  O Thread está executando um prepared statement.

* `Fetch`

  O Thread está buscando (`fetching`) os resultados da execução de um prepared statement.

* `Field List`

  O Thread está recuperando informações para as colunas da tabela.

* `Init DB`

  O Thread está selecionando um default Database.

* `Kill`

  O Thread está encerrando (`killing`) outro Thread.

* `Long Data`

  O Thread está recuperando dados longos (`long data`) no resultado da execução de um prepared statement.

* `Ping`

  O Thread está processando uma solicitação de `ping` do servidor.

* `Prepare`

  O Thread está preparando um prepared statement.

* `Processlist`

  O Thread está gerando informações sobre os Threads do servidor.

* `Query`

  O Thread está executando um statement.

* `Quit`

  O Thread está sendo encerrado (`terminating`).

* `Refresh`

  O Thread está limpando (flushing) tabelas, logs ou caches, ou redefinindo a variável de status ou informações do servidor de replicação.

* `Register Slave`

  O Thread está registrando um servidor de réplica.

* `Reset stmt`

  O Thread está redefinindo (`resetting`) um prepared statement.

* `Set option`

  O Thread está definindo ou redefinindo uma opção de execução de statement do cliente.

* `Shutdown`

  O Thread está desligando (`shutting down`) o servidor.

* `Sleep`

  O Thread está esperando que o cliente envie um novo statement.

* `Statistics`

  O Thread está gerando informações de status do servidor.

* `Time`

  Não utilizado.