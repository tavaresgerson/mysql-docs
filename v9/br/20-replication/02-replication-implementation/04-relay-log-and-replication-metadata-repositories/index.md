### 19.2.4 Repositórios de Log de Replicação e Metadados de Replicação

19.2.4.1 O Log de Replicação

19.2.4.2 Repositórios de Metadados de Replicação

Um servidor de replicação cria vários repositórios de informações para serem usados no processo de replicação:

* O *log de replicação* do servidor de replicação, que é escrito pela thread de I/O de replicação (receptor), contém as transações lidas do log binário do servidor de origem de replicação. As transações no log de replicação são aplicadas na replica pela thread de SQL de replicação (aplicador). Para informações sobre o log de replicação, consulte a Seção 19.2.4.1, “O Log de Replicação”.

* O *repositório de metadados de conexão* do servidor de replicação contém informações que a thread de receptor de replicação precisa para se conectar ao servidor de origem de replicação e recuperar transações do log binário da fonte. O repositório de metadados de conexão é escrito na tabela `mysql.slave_master_info`.

* O *repositório de metadados de aplicador* do servidor de replicação contém informações que a thread de aplicador de replicação precisa para ler e aplicar transações do log de replicação da replica. O repositório de metadados de aplicador é escrito na tabela `mysql.slave_relay_log_info`.

O repositório de metadados de conexão do servidor de replicação e o repositório de metadados de aplicador são coletivamente conhecidos como os repositórios de metadados de replicação. Para informações sobre esses, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

**Tornando a replicação resiliente a interrupções inesperadas.** As tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o mecanismo de armazenamento transacional `InnoDB`. As atualizações no repositório de metadados do aplicável da replica são confirmadas junto com as transações, o que significa que as informações de progresso da replica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma interrupção inesperada do servidor. Para obter informações sobre a combinação de configurações na replica mais resiliente a interrupções inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Interrupção Inesperada de uma Replica”.