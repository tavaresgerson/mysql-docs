#### 16.4.1.9 Replicação de declarações DROP ... IF EXISTS

As instruções `DROP DATABASE IF EXISTS`, `DROP TABLE IF EXISTS` e `DROP VIEW IF EXISTS` são sempre replicadas, mesmo que o banco de dados, a tabela ou a visualização a serem excluídos não existam na fonte. Isso garante que o objeto a ser excluído não exista mais na fonte ou na replica, uma vez que a replica tenha alcançado a fonte.

As instruções `DROP ... IF EXISTS` para programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) também são replicadas, mesmo que o programa armazenado a ser excluído não exista na origem.
