## 22.3 Gerenciamento de Partições

22.3.1 Gerenciamento de Partições RANGE e LIST

22.3.2 Gerenciamento de Partições HASH e KEY

22.3.3 Troca de Partições e Subpartições com Tabelas

22.3.4 Manutenção de Partições

22.3.5 Obter informações sobre partições

O MySQL 5.7 oferece várias maneiras de modificar tabelas particionadas. É possível adicionar, excluir, redefinir, combinar ou dividir partições existentes. Todas essas ações podem ser realizadas usando as extensões de particionamento da instrução `ALTER TABLE`. Há também maneiras de obter informações sobre tabelas e partições particionadas. Discutimos esses tópicos nas seções a seguir.

- Para obter informações sobre a gestão de partições em tabelas particionadas por `RANGE` ou `LIST`, consulte Seção 22.3.1, “Gestão de Partições RANGE e LIST”.

- Para uma discussão sobre a gestão das partições `HASH` e `KEY`, consulte Seção 22.3.2, “Gestão das Partições HASH e KEY”.

- Consulte Seção 22.3.5, “Obtendo Informações sobre Partições” para uma discussão sobre os mecanismos fornecidos no MySQL 5.7 para obter informações sobre tabelas e partições particionadas.

- Para uma discussão sobre a realização de operações de manutenção em partições, consulte Seção 22.3.4, "Manutenção de Partições".

Nota

No MySQL 5.7, todas as partições de uma tabela particionada devem ter o mesmo número de subpartições, e não é possível alterar a particionamento de subpartições uma vez que a tabela tenha sido criada.

Para alterar o esquema de particionamento de uma tabela, é necessário apenas usar a instrução `ALTER TABLE` com uma cláusula `*partition_options*`. Esta cláusula tem a mesma sintaxe que a usada com `CREATE TABLE` para criar uma tabela particionada, e sempre começa com as palavras-chave `PARTITION BY`. Suponha que você tenha uma tabela particionada por intervalo usando a seguinte instrução `CREATE TABLE`:

```sql
CREATE TABLE trb3 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (1995),
        PARTITION p2 VALUES LESS THAN (2000),
        PARTITION p3 VALUES LESS THAN (2005)
    );
```

Para repartir essa tabela de modo que ela seja dividida por chave em duas partições usando o valor da coluna `id` como base para a chave, você pode usar essa instrução:

```sql
ALTER TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;
```

Isso tem o mesmo efeito na estrutura da tabela quanto a deletar a tabela e recriá-la usando `CREATE TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;`.

`ALTER TABLE ... ENGINE = ...` altera apenas o mecanismo de armazenamento usado pela tabela e deixa o esquema de particionamento da tabela intacto. Use `ALTER TABLE ... REMOVE PARTITIONING` para remover o esquema de particionamento de uma tabela. Veja Seção 13.1.8, “Instrução ALTER TABLE”.

Importante

Apenas uma única cláusula `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION` pode ser usada em uma determinada declaração `ALTER TABLE` (alter-table-partition-operations.html). Se você (por exemplo) desejar excluir uma partição e reorganizar as partições restantes de uma tabela, você deve fazer isso em duas declarações separadas `ALTER TABLE` (alter-table-partition-operations.html) (uma usando `DROP PARTITION` e depois uma segunda usando `REORGANIZE PARTITION`).

No MySQL 5.7, é possível excluir todas as linhas de uma ou mais partições selecionadas usando `ALTER TABLE ... TRUNCATE PARTITION`.
