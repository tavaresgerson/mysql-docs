### 24.4.22 A Tabela INNODB_SYS_INDEXES do INFORMATION_SCHEMA

A tabela [`INNODB_SYS_INDEXES`](information-schema-innodb-sys-indexes-table.html "24.4.22 The INFORMATION_SCHEMA INNODB_SYS_INDEXES Table") fornece metadados sobre os Indexes do `InnoDB`, equivalente às informações na tabela interna `SYS_INDEXES` no dicionário de dados do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

A tabela [`INNODB_SYS_INDEXES`](information-schema-innodb-sys-indexes-table.html "24.4.22 The INFORMATION_SCHEMA INNODB_SYS_INDEXES Table") possui as seguintes colunas:

* `INDEX_ID`

  Um identificador para o Index. Os identificadores de Index são exclusivos em todos os Databases de uma instância.

* `NAME`

  O nome do Index. A maioria dos Indexes criados implicitamente pelo `InnoDB` tem nomes consistentes, mas os nomes dos Indexes não são necessariamente únicos. Exemplos: `PRIMARY` para um Primary Key Index, `GEN_CLUST_INDEX` para o Index que representa uma Primary Key quando nenhuma é especificada, e `ID_IND`, `FOR_IND` e `REF_IND` para Foreign Key Constraints.

* `TABLE_ID`

  Um identificador que representa a Table associada ao Index; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `TYPE`

  Um valor numérico derivado de informações de nível de bit que identifica o tipo de Index. 0 = Secondary Index não exclusivo; 1 = Clustered Index gerado automaticamente (`GEN_CLUST_INDEX`); 2 = Index não clustered exclusivo; 3 = Clustered Index; 32 = Full-text Index; 64 = Spatial Index; 128 = Secondary Index em uma [coluna gerada virtualmente](glossary.html#glos_virtual_generated_column "virtual generated column").

* `N_FIELDS`

  O número de colunas na chave do Index. Para Indexes `GEN_CLUST_INDEX`, este valor é 0 porque o Index é criado usando um valor artificial em vez de uma coluna de Table real.

* `PAGE_NO`

  O número da página raiz da B-tree do Index. Para Full-text Indexes, a coluna `PAGE_NO` não é utilizada e definida como -1 (`FIL_NULL`) porque o Full-text Index é disposto em várias B-trees (tabelas auxiliares).

* `SPACE`

  Um identificador para o Tablespace onde o Index reside. 0 significa o [system tablespace](glossary.html#glos_system_tablespace "system tablespace") do `InnoDB`. Qualquer outro número representa uma Table criada com um arquivo `.ibd` separado no modo [file-per-table](glossary.html#glos_file_per_table "file-per-table"). Este identificador permanece o mesmo após uma instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). Como todos os Indexes para uma Table residem no mesmo Tablespace que a Table, este valor não é necessariamente único.

* `MERGE_THRESHOLD`

  O valor de limite de Merge (Merge Threshold) para páginas de Index. Se a quantidade de dados em uma página de Index cair abaixo do valor [`MERGE_THRESHOLD`](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages") quando uma Row é excluída ou quando uma Row é encurtada por uma operação de Update, o `InnoDB` tenta fazer o Merge da página de Index com a página de Index vizinha. O valor de limite padrão é de 50%. Para mais informações, consulte [Seção 14.8.12, “Configurando o Merge Threshold para Páginas de Index”](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages").

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 34\G
*************************** 1. row ***************************
       INDEX_ID: 39
           NAME: GEN_CLUST_INDEX
       TABLE_ID: 34
           TYPE: 1
       N_FIELDS: 0
        PAGE_NO: 3
          SPACE: 23
MERGE_THRESHOLD: 50
*************************** 2. row ***************************
       INDEX_ID: 40
           NAME: i1
       TABLE_ID: 34
           TYPE: 0
       N_FIELDS: 1
        PAGE_NO: 4
          SPACE: 23
MERGE_THRESHOLD: 50
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar esta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo Data Types e valores Default.