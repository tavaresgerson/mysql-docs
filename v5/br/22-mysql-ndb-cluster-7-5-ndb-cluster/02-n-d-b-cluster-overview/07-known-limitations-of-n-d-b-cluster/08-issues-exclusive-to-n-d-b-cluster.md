#### 21.2.7.8 Questões exclusivas do cluster NDB

As seguintes são limitações específicas do mecanismo de armazenamento `NDB`:

- **Arquitetura da máquina.** Todas as máquinas utilizadas no clúster devem ter a mesma arquitetura. Ou seja, todas as máquinas que hospedam nós devem ser big-endian ou little-endian, e não é possível usar uma mistura de ambas. Por exemplo, não é possível ter um nó de gerenciamento rodando em um PowerPC que direciona um nó de dados que está rodando em uma máquina x86. Esta restrição não se aplica a máquinas que simplesmente executam **mysql** ou outros clientes que possam estar acessando os nós SQL do clúster.

- **Registro binário.** O NDB Cluster tem as seguintes limitações ou restrições em relação ao registro binário:

  - O NDB Cluster não pode gerar um log binário para tabelas que possuem colunas `BLOB` mas sem chave primária.

  - Apenas as seguintes operações de esquema são registradas em um log binário de cluster que *não* está em execução no **mysqld** com a seguinte instrução:

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

- **Operações de esquema.** As operações de esquema (instruções DDL) são rejeitadas enquanto qualquer nó de dados for reiniciado. As operações de esquema também não são suportadas durante uma atualização ou atualização online.

- **Número de réplicas de fragmentos.** O número de réplicas de fragmentos, conforme determinado pelo parâmetro de configuração do nó de dados `NoOfReplicas`, é o número de cópias de todos os dados armazenados pelo NDB Cluster. Definir este parâmetro para 1 significa que há apenas uma única cópia; nesse caso, não há redundância e a perda de um nó de dados implica na perda de dados. Para garantir a redundância e, assim, a preservação dos dados mesmo em caso de falha de um nó de dados, defina este parâmetro para 2, que é o valor padrão e recomendado em produção.

  Definir `NoOfReplicas` para um valor maior que 2 é possível (até um máximo de 4), mas não é necessário para evitar a perda de dados. Além disso, **valores maiores que 2 para este parâmetro não são suportados em produção**.

Veja também Seção 21.2.7.10, “Limitações relacionadas a múltiplos nós do cluster NDB”.
