### 10.14.2 Valores de comandos de thread

Um thread pode ter qualquer um dos seguintes valores de `Command`:

* `Binlog Dump`

  Este é um thread em uma fonte de replicação para enviar o conteúdo do log binário para uma réplica.

* `Change user`

  O thread está executando uma operação de mudança de usuário.

* `Close stmt`

  O thread está fechando uma declaração preparada.

* `Connect`

  Usado por threads de receptor de replicação conectados à fonte e por threads de trabalhador de replicação.

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

O fio está limpando a tabela, os logs ou os caches, ou redefinindo a variável de status ou as informações do servidor de replicação.

* `Registrar Escravo`

  O fio está registrando um servidor replica.

* `Reset stmt`

  O fio está redefinindo uma declaração preparada.

* `Definir opção`

  O fio está definindo ou redefinindo uma opção de execução de uma declaração do cliente.

* `Fechar`

  O fio está fechando o servidor.

* `Dormir`

  O fio está aguardando que o cliente envie uma nova declaração para ele.

* `Estatísticas`

  O fio está produzindo informações de status do servidor.

* `Tempo`

  Não utilizado.