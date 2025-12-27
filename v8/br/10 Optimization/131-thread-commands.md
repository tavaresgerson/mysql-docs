### 10.14.2 Valores de comandos de thread

Um thread pode ter qualquer um dos seguintes valores de `Command`:

* `Binlog Dump`

  Este é um thread em uma fonte de replicação para enviar o conteúdo do log binário para uma réplica.
* `Change user`

  O thread está executando uma operação de alteração de usuário.
* `Close stmt`

  O thread está fechando uma declaração preparada.
* `Connect`

  Usado por threads de recebimento de replicação conectados à fonte e por threads de trabalho de replicação.
* `Connect Out`

  Uma réplica está se conectando à sua fonte.
* `Create DB`

  O thread está executando uma operação de criação de banco de dados.
* `Daemon`

  Este thread é interno ao servidor, não é um thread que atende a uma conexão de cliente.
* `Debug`

  O thread está gerando informações de depuração.
* `Delayed insert`

  O thread é um manipulador de inserção retardada.
* `Drop DB`

  O thread está executando uma operação de drop de banco de dados.
* `Error`
* `Execute`

  O thread está executando uma declaração preparada.
* `Fetch`

  O thread está obtendo os resultados da execução de uma declaração preparada.
* `Field List`

  O thread está recuperando informações para as colunas da tabela.
* `Init DB`

  O thread está selecionando um banco de dados padrão.
* `Kill`

  O thread está matando outro thread.
* `Long Data`

  O thread está obtendo dados longos no resultado da execução de uma declaração preparada.
* `Ping`

  O thread está lidando com uma solicitação de ping do servidor.
* `Prepare`

  O thread está preparando uma declaração preparada.
* `Processlist`

  O thread está produzindo informações sobre threads do servidor.
* `Query`

  Empregado para clientes de usuário enquanto executa consultas por threads de aplicador de replicação de fluxo único, bem como pelo thread do coordenador de replicação.
* `Quit`

  O thread está terminando.
* `Refresh`

  O thread está limpando tabelas, logs ou caches, ou resetando a variável de status ou informações do servidor de replicação.
* `Register Slave`

  O thread está registrando um servidor de réplica.
* `Reset stmt`

  O thread está redefinindo uma declaração preparada.
* `Set option`

O fio está definindo ou redefinindo uma opção de execução de uma declaração do cliente.
* `Shutdown`

  O fio está desligando o servidor.
* `Sleep`

  O fio está aguardando que o cliente envie uma nova declaração para ele.
* `Statistics`

  O fio está produzindo informações de status do servidor.
* `Time`

  Não utilizado.