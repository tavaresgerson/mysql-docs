### 16.2.4 Repositórios de Log de Relé e Metadados de Replicação

16.2.4.1 O Log de Relé

16.2.4.2 Repositórios de metadados de replicação

Um servidor de replicação cria vários repositórios de informações para serem usados no processo de replicação:

- O *registro de retransmissão*, que é escrito pela thread de E/S de replicação, contém as transações lidas do log binário do servidor de origem da replicação. As transações no registro de retransmissão são aplicadas na replica pela thread SQL de replicação. Para obter informações sobre o registro de retransmissão, consulte Seção 16.2.4.1, “O Registro de Retransmissão”.

- O repositório de metadados de conexão da réplica contém informações que a thread de E/S de replicação precisa para se conectar ao servidor de origem da replicação e recuperar transações do log binário da origem. O repositório de metadados de conexão é escrito na tabela `mysql.slave_master_info` ou em um arquivo.

- O repositório de metadados do aplicador de réplicas contém informações que o thread de SQL de replicação precisa ler e aplicar as transações do log de retransmissão da réplica. O repositório de metadados do aplicador é escrito na tabela `mysql.slave_relay_log_info` ou em um arquivo.

O repositório de metadados de conexão e o repositório de metadados do aplicativo são coletivamente conhecidos como os repositórios de metadados de replicação. Para obter informações sobre eles, consulte Seção 16.2.4.2, "Repositórios de Metadados de Replicação".

**Tornando a replicação resiliente a interrupções inesperadas.** As tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o mecanismo de armazenamento transacional `InnoDB`. As atualizações no repositório de metadados do aplicável da replica são confirmadas junto com as transações, o que significa que as informações de progresso da replica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma interrupção inesperada do servidor. Para obter informações sobre a combinação de configurações na replica mais resiliente a interrupções inesperadas, consulte Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Replica”.
