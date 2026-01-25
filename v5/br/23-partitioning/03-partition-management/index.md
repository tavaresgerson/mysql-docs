## 22.3 Gerenciamento de Partições

[22.3.1 Gerenciamento de Partições RANGE e LIST](partitioning-management-range-list.html)

[22.3.2 Gerenciamento de Partições HASH e KEY](partitioning-management-hash-key.html)

[22.3.3 Troca de Partições e Subpartições com Tabelas](partitioning-management-exchange.html)

[22.3.4 Manutenção de Partições](partitioning-maintenance.html)

[22.3.5 Obtendo Informações Sobre Partições](partitioning-info.html)

O MySQL 5.7 oferece diversas maneiras de modificar tabelas particionadas. É possível adicionar, remover, redefinir, mesclar ou dividir partições existentes. Todas essas ações podem ser realizadas usando as extensões de particionamento da instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"). Existem também formas de obter informações sobre tabelas e partições particionadas. Discutiremos esses tópicos nas seções a seguir.

* Para obter informações sobre o gerenciamento de partições em tabelas particionadas por `RANGE` ou `LIST`, consulte [Seção 22.3.1, “Gerenciamento de Partições RANGE e LIST”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions").

* Para uma discussão sobre o gerenciamento de partições `HASH` e `KEY`, consulte [Seção 22.3.2, “Gerenciamento de Partições HASH e KEY”](partitioning-management-hash-key.html "22.3.2 Management of HASH and KEY Partitions").

* Consulte [Seção 22.3.5, “Obtendo Informações Sobre Partições”](partitioning-info.html "22.3.5 Obtaining Information About Partitions"), para uma discussão sobre os mecanismos fornecidos no MySQL 5.7 para obter informações sobre tabelas e partições particionadas.

* Para uma discussão sobre a realização de operações de manutenção em partições, consulte [Seção 22.3.4, “Manutenção de Partições”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

Nota

No MySQL 5.7, todas as partições de uma tabela particionada devem ter o mesmo número de subpartições, e não é possível alterar o subparticionamento uma vez que a tabela tenha sido criada.

Para alterar o esquema de particionamento de uma tabela, é necessário apenas usar a instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") com uma cláusula *`partition_options`*. Essa cláusula tem a mesma sintaxe usada com [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") para criar uma tabela particionada, e sempre começa com as palavras-chave `PARTITION BY`. Suponha que você tenha uma tabela particionada por range usando a seguinte instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"):

```sql
CREATE TABLE trb3 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (1995),
        PARTITION p2 VALUES LESS THAN (2000),
        PARTITION p3 VALUES LESS THAN (2005)
    );
```

Para reparticionar esta tabela de forma que ela seja particionada por key em duas partições usando o valor da coluna `id` como base para a key, você pode usar esta instrução:

```sql
ALTER TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;
```

Isso tem o mesmo efeito na estrutura da tabela que remover a tabela e recriá-la usando `CREATE TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;`.

`ALTER TABLE ... ENGINE = ...` altera apenas o storage engine usado pela tabela e mantém intacto o esquema de particionamento da tabela. Use `ALTER TABLE ... REMOVE PARTITIONING` para remover o particionamento de uma tabela. Consulte [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement").

Importante

Apenas uma única cláusula `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION` pode ser usada em uma determinada instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"). Se você (por exemplo) deseja remover uma partition e reorganizar as partições restantes de uma tabela, você deve fazê-lo em duas instruções [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") separadas (uma usando `DROP PARTITION` e depois uma segunda usando `REORGANIZE PARTITION`).

No MySQL 5.7, é possível excluir todas as linhas de uma ou mais partições selecionadas usando [`ALTER TABLE ... TRUNCATE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement").