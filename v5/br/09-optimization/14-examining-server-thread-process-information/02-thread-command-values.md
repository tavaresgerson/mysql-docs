### 8.14.2 Valores dos comandos de thread

Um thread pode ter qualquer um dos seguintes valores `Command`:

- `Binlog Dump`

  Este é um thread sobre uma fonte de replicação para enviar o conteúdo do log binário para uma replica.

- `Change user`

  O thread está executando uma operação de alteração de usuário.

- `Close stmt`

  O thread está fechando uma declaração preparada.

- `Connect`

  Uma réplica está conectada à sua fonte.

- `Connect Out`

  Uma réplica está se conectando à sua fonte.

- `Create DB`

  O thread está executando uma operação de criação de banco de dados.

- `Daemon`

  Esse thread é interno ao servidor, não é um thread que atende a uma conexão com o cliente.

- `Debug`

  O thread está gerando informações de depuração.

- `Delayed insert`

  O thread é um manipulador de inserção retardada.

- `Drop DB`

  O thread está executando uma operação de drop de banco de dados.

* `Error`
* `Execute`

  O thread está executando uma declaração preparada.

- `Fetch`

  O thread está obtendo os resultados da execução de uma declaração preparada.

* `Field List`

  O thread está recuperando informações para as colunas da tabela.

* `Init DB`

  O thread está selecionando um banco de dados padrão.

* `Kill`

  O thread está matando outro thread.

- `Long Data`

  O thread está recuperando dados longos como resultado da execução de uma declaração preparada.

- `Ping`

  O thread está tratando de um pedido de ping do servidor.

* `Prepare`

  O thread está preparando uma declaração preparada.

* `Processlist`

  O thread está produzindo informações sobre os threads do servidor.

* `Query`

  O thread está executando uma declaração.

* `Quit`

  O thread está terminando.

* `Refresh`

  O thread está limpando a tabela, os logs ou os caches, ou redefinindo a variável de status ou as informações do servidor de replicação.

* `Register Slave`

  O thread está registrando um servidor replica.

* `Reset stmt`

  O thread está redefinindo uma declaração preparada.

* `Set option`

  O thread está definindo ou redefinindo uma opção de execução de uma declaração do cliente.

* `Shutdown`

  O thread está desligando o servidor.

* `Sleep`

  O thread está esperando que o cliente envie uma nova declaração para ele.

* `Statistics`

  O thread está produzindo informações sobre o status do servidor.

* `Time`

  Não utilizado.
