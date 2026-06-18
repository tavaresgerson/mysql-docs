### 19.2.4 Repositórios de Log de Relé e Metadados de Replicação

19.2.4.1 O Log de Retransmissão

19.2.4.2 Repositórios de metadados de replicação

Um servidor de replicação cria vários repositórios de informações para serem usados no processo de replicação:

- O log de *relê* da réplica, que é escrito pela thread de I/O de replicação (receptor), contém as transações lidas do log binário do servidor de origem da replicação. As transações no log de relê são aplicadas na réplica pela thread de SQL de replicação (aplicador). Para obter informações sobre o log de relê, consulte a Seção 19.2.4.1, “O Log de Relê”.

- O repositório de metadados de conexão da réplica contém informações que o thread do receptor de replicação precisa para se conectar ao servidor de origem da replicação e recuperar transações do log binário da origem. O repositório de metadados de conexão é escrito na tabela `mysql.slave_master_info`.

- O repositório de metadados do aplicador de réplica contém as informações que o fio do aplicador de replicação precisa ler e aplicar as transações do log de retransmissão da réplica. O repositório de metadados do aplicador é escrito na tabela `mysql.slave_relay_log_info`.

O repositório de metadados de conexão da réplica e o repositório de metadados do aplicativo são coletivamente conhecidos como os repositórios de metadados de replicação. Para obter informações sobre eles, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

**Tornando a replicação resistente a interrupções inesperadas.** As tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o mecanismo de armazenamento transacional `InnoDB`. As atualizações no repositório de metadados do aplicável da replica são confirmadas junto com as transações, o que significa que as informações de progresso da replica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma interrupção inesperada do servidor. Para obter informações sobre a combinação de configurações na replica mais resistente a interrupções inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Interrupção Inesperada de uma Replica”.
