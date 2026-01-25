#### 21.2.7.8 Problemas Exclusivos do NDB Cluster

As seguintes são limitações específicas do storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"):

* **Arquitetura da máquina.** Todas as máquinas usadas no cluster devem ter a mesma arquitetura. Ou seja, todas as máquinas que hospedam nodes devem ser big-endian ou little-endian, e não é possível usar uma mistura de ambos. Por exemplo, você não pode ter um management node rodando em um PowerPC que direcione um data node rodando em uma máquina x86. Esta restrição não se aplica a máquinas que simplesmente executam o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") ou outros clients que possam estar acessando os SQL nodes do cluster.

* **Binary logging.** O NDB Cluster tem as seguintes limitações ou restrições em relação ao binary logging:

  + O NDB Cluster não pode produzir um binary log para tabelas que possuem colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") mas que não têm uma Primary Key.

  + Somente as seguintes operações de Schema são registradas em um cluster binary log que *não* está no [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que executa a instrução:

    - [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")
    - [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement")
    - [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement")
    - [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") / [`CREATE SCHEMA`](create-database.html "13.1.11 CREATE DATABASE Statement")

    - [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") / [`DROP SCHEMA`](drop-database.html "13.1.22 DROP DATABASE Statement")

    - [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement")
    - [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement")
    - [`DROP TABLESPACE`](drop-tablespace.html "13.1.30 DROP TABLESPACE Statement")
    - [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")
    - [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement")
    - [`DROP LOGFILE GROUP`](drop-logfile-group.html "13.1.26 DROP LOGFILE GROUP Statement")

* **Schema operations.** Operações de Schema (instruções DDL) são rejeitadas enquanto qualquer data node estiver reiniciando. Schema operations também não são suportadas durante a realização de um upgrade ou downgrade online.

* **Número de réplicas de fragmento.** O número de réplicas de fragmento, conforme determinado pelo configuration parameter [NoOfReplicas](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) do data node, é o número de cópias de todos os dados armazenados pelo NDB Cluster. Definir este parâmetro como 1 significa que há apenas uma única cópia; neste caso, nenhuma redundância é fornecida, e a perda de um data node implica na perda de dados. Para garantir a redundância e, consequentemente, a preservação dos dados mesmo que um data node falhe, defina este parâmetro como 2, que é o valor padrão e recomendado em produção.

  Definir [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) para um valor maior que 2 é possível (até um máximo de 4), mas desnecessário para proteger contra a perda de dados. Além disso, *valores maiores que 2 para este parâmetro não são suportados em produção*.

Veja também [Seção 21.2.7.10, “Limitações Relacionadas a Múltiplos NDB Cluster Nodes”](mysql-cluster-limitations-multiple-nodes.html "21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes").