#### 21.2.7.8 Problemas Exclusivos do NDB Cluster

As seguintes são limitações específicas do storage engine `NDB`:

* **Arquitetura da máquina.** Todas as máquinas usadas no cluster devem ter a mesma arquitetura. Ou seja, todas as máquinas que hospedam nodes devem ser big-endian ou little-endian, e não é possível usar uma mistura de ambos. Por exemplo, você não pode ter um management node rodando em um PowerPC que direcione um data node rodando em uma máquina x86. Esta restrição não se aplica a máquinas que simplesmente executam o **mysql** ou outros clients que possam estar acessando os SQL nodes do cluster.

* **Binary logging.** O NDB Cluster tem as seguintes limitações ou restrições em relação ao binary logging:

  + O NDB Cluster não pode produzir um binary log para tabelas que possuem colunas `BLOB` mas que não têm uma Primary Key.

  + Somente as seguintes operações de Schema são registradas em um cluster binary log que *não* está no **mysqld** que executa a instrução:

    - `CREATE TABLE`
    - `ALTER TABLE`
    - `DROP TABLE`
    - `CREATE DATABASE` / `CREATE SCHEMA`

    - `DROP DATABASE` / `DROP SCHEMA`

    - `CREATE TABLESPACE`
    - `ALTER TABLESPACE`
    - `DROP TABLESPACE`
    - `CREATE LOGFILE GROUP`
    - `ALTER LOGFILE GROUP`
    - `DROP LOGFILE GROUP`

* **Schema operations.** Operações de Schema (instruções DDL) são rejeitadas enquanto qualquer data node estiver reiniciando. Schema operations também não são suportadas durante a realização de um upgrade ou downgrade online.

* **Número de réplicas de fragmento.** O número de réplicas de fragmento, conforme determinado pelo configuration parameter NoOfReplicas do data node, é o número de cópias de todos os dados armazenados pelo NDB Cluster. Definir este parâmetro como 1 significa que há apenas uma única cópia; neste caso, nenhuma redundância é fornecida, e a perda de um data node implica na perda de dados. Para garantir a redundância e, consequentemente, a preservação dos dados mesmo que um data node falhe, defina este parâmetro como 2, que é o valor padrão e recomendado em produção.

  Definir `NoOfReplicas` para um valor maior que 2 é possível (até um máximo de 4), mas desnecessário para proteger contra a perda de dados. Além disso, *valores maiores que 2 para este parâmetro não são suportados em produção*.

Veja também Seção 21.2.7.10, “Limitações Relacionadas a Múltiplos NDB Cluster Nodes”.