### 10.14.2 Valores dos comandos de fio

Um fio pode ter qualquer um dos seguintes valores `Command`:

- `Binlog Dump`

  Este é um fio sobre uma fonte de replicação para enviar o conteúdo do log binário para uma replica.

- `Change user`

  O fio está executando uma operação de alteração de usuário.

- `Close stmt`

  O fio está fechando uma declaração preparada.

- `Connect`

  Utilizado por threads do receptor de replicação conectados à fonte e por threads do trabalhador de replicação.

- `Connect Out`

  Uma réplica está se conectando à sua fonte.

- `Create DB`

  O fio está executando uma operação de criação de banco de dados.

- `Daemon`

  Esse fio é interno ao servidor, não é um fio que atende a uma conexão com o cliente.

- `Debug`

  O fio está gerando informações de depuração.

- `Delayed insert`

  O fio é um manipulador de inserção retardada.

- `Drop DB`

  O fio está executando uma operação de drop de banco de dados.

- `Error`

- `Execute`

  O fio está executando uma declaração preparada.

- `Fetch`

  O fio está obtendo os resultados da execução de uma declaração preparada.

- `Field List`

  O fio está recuperando informações para as colunas da tabela.

- `Init DB`

  O fio está selecionando um banco de dados padrão.

- `Kill`

  O fio está matando outro fio.

- `Long Data`

  O fio está recuperando dados longos como resultado da execução de uma declaração preparada.

- `Ping`

  O fio está tratando de um pedido de ping do servidor.

- `Prepare`

  O fio está preparando uma declaração preparada.

- `Processlist`

  O fio está produzindo informações sobre os fios do servidor.

- `Query`

  Empregado para clientes usuários enquanto executa consultas por threads de aplicação de replicação de único fio, bem como pelo fio do coordenador de replicação.

- `Quit`

  O fio está terminando.

- `Refresh`

  O fio está limpando a tabela, os logs ou os caches, ou redefinindo a variável de status ou as informações do servidor de replicação.

- `Register Slave`

  O fio está registrando um servidor replica.

- `Reset stmt`

  O fio está redefinindo uma declaração preparada.

- `Set option`

  O fio está definindo ou redefinindo uma opção de execução de uma declaração do cliente.

- `Shutdown`

  O fio está desligando o servidor.

- `Sleep`

  O fio está esperando que o cliente envie uma nova declaração para ele.

- `Statistics`

  O fio está produzindo informações sobre o status do servidor.

- `Time`

  Unused.
