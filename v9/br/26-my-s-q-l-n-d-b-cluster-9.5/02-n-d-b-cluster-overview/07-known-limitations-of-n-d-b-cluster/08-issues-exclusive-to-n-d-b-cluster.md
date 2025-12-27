#### 25.2.7.8 Problemas Exclusivos do NDB Cluster

Os seguintes são limitações específicas do motor de armazenamento `NDB`:

* **Arquitetura da máquina.** Todas as máquinas usadas no cluster devem ter a mesma arquitetura. Ou seja, todas as máquinas que hospedam nós devem ser big-endian ou little-endian, e você não pode usar uma mistura de ambos. Por exemplo, você não pode ter um nó de gerenciamento rodando em uma máquina PowerPC que direciona um nó de dados que está rodando em uma máquina x86. Esta restrição não se aplica a máquinas que simplesmente estão executando **mysql** ou outros clientes que podem estar acessando os nós SQL do cluster.

* **Registro binário.** O NDB Cluster tem as seguintes limitações ou restrições em relação ao registro binário:

  + O NDB Cluster não pode produzir um log binário para tabelas que têm colunas `BLOB` mas sem uma chave primária.

  + Apenas as seguintes operações de esquema são registradas em um log binário de cluster que não está no **mysqld** executando a declaração:

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
* **Operações de esquema.** As operações de esquema (declarações DDL) são rejeitadas durante o reinício de qualquer nó de dados. As operações de esquema também não são suportadas durante a realização de uma atualização ou downgrade online.

* **Número de réplicas de fragmentos.** O número de réplicas de fragmentos, conforme determinado pelo parâmetro de configuração do nó de dados `NoOfReplicas`, é o número de cópias de todos os dados armazenados pelo NDB Cluster. Definir este parâmetro para 1 significa que há apenas uma única cópia; nesse caso, não há redundância e a perda de um nó de dados implica na perda de dados. Para garantir a redundância e, assim, a preservação dos dados mesmo em caso de falha de um nó de dados, defina este parâmetro para 2, que é o valor padrão e recomendado em produção.

Definir `NoOfReplicas` para um valor maior que 2 é suportado (até um máximo de 4), mas não é necessário para proteger contra a perda de dados.

Veja também a Seção 25.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”.