### 13.1.34 Declaração TRUNCATE TABLE

```sql
TRUNCATE [TABLE] tbl_name
```

O `TRUNCATE TABLE` esvazia uma tabela completamente. Requer o privilégio [`DROP`](privileges-provided.html#priv_drop).

Logicamente, o [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é semelhante a uma declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") que apaga todas as linhas, ou a uma sequência de declarações [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") e [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Para alcançar alta performance, ele ignora o método DML de exclusão de dados. Dessa forma, ele não pode ser rolled back, não faz com que os Triggers `ON DELETE` sejam acionados, e não pode ser executado para tabelas `InnoDB` com relacionamentos de Foreign Key pai-filho.

Embora [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") seja semelhante a [`DELETE`](delete.html "13.2.2 DELETE Statement"), ele é classificado como uma declaração DDL em vez de uma declaração DML. Ele difere do [`DELETE`](delete.html "13.2.2 DELETE Statement") das seguintes maneiras:

* As operações de Truncate descartam e recriam a tabela, o que é muito mais rápido do que apagar linhas uma por uma, particularmente para tabelas grandes.

* As operações de Truncation causam um Commit implícito e, portanto, não podem ser rolled back. Consulte [Seção 13.3.3, “Declarações Que Causam um Commit Implícito”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

* As operações de Truncation não podem ser executadas se a sessão mantiver um Table Lock ativo.

* O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") falha para uma tabela `InnoDB` ou tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") se houver quaisquer restrições de `FOREIGN KEY` de outras tabelas que referenciem a tabela. Restrições de Foreign Key entre colunas da mesma tabela são permitidas.

* As operações de Truncation não retornam um valor significativo para o número de linhas apagadas. O resultado usual é “0 rows affected” (0 linhas afetadas), o que deve ser interpretado como “nenhuma informação.”

* Enquanto o arquivo de formato de tabela `tbl_name.frm` for válido, a tabela pode ser recriada como uma tabela vazia com [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), mesmo que os arquivos de dados ou Index tenham sido corrompidos.

* Qualquer valor `AUTO_INCREMENT` é redefinido para seu valor inicial. Isso é verdade mesmo para `MyISAM` e `InnoDB`, que normalmente não reutilizam valores de sequência.

* Quando usado com tabelas particionadas, [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") preserva o particionamento; ou seja, os arquivos de dados e Index são descartados e recriados, enquanto o arquivo de definições de partição (`.par`) não é afetado.

* A declaração [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não invoca Triggers `ON DELETE`.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é tratado, para fins de Binary Logging e Replication, como DDL em vez de DML, e é sempre logado como uma declaração.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para uma tabela fecha todos os handlers para a tabela que foram abertos com [`HANDLER OPEN`](handler.html "13.2.4 HANDLER Statement").

Em um sistema com um grande Buffer Pool do `InnoDB` e [`innodb_adaptive_hash_index`](innodb-parameters.html#sysvar_innodb_adaptive_hash_index) ativado, as operações de `TRUNCATE TABLE` podem causar uma queda temporária no desempenho do sistema devido a um LRU scan (varredura LRU) que ocorre ao remover entradas de adaptive hash index de uma tabela `InnoDB`. O problema foi corrigido para [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") no MySQL 5.5.23 (Bug #13704145, Bug #64284), mas continua sendo um problema conhecido para `TRUNCATE TABLE` (Bug #68184).

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") pode ser usado com as tabelas de resumo do Performance Schema, mas o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Consulte [Seção 25.12.15, “Tabelas de Resumo do Performance Schema”](performance-schema-summary-tables.html "25.12.15 Performance Schema Summary Tables").