### 14.8.12 Configurando o Merge Threshold para Index Pages

Você pode configurar o valor de `MERGE_THRESHOLD` para as index pages. Se a porcentagem de "page-full" (página cheia) para uma index page cair abaixo do valor de `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação `UPDATE`, o `InnoDB` tenta fazer o merge da index page com uma index page vizinha. O valor `MERGE_THRESHOLD` padrão é 50, que é o valor previamente fixado (hardcoded). O valor mínimo de `MERGE_THRESHOLD` é 1 e o valor máximo é 50.

Quando a porcentagem de "page-full" para uma index page cai abaixo de 50%, que é a configuração `MERGE_THRESHOLD` padrão, o `InnoDB` tenta fazer o merge da index page com uma página vizinha. Se ambas as páginas estiverem próximas de 50% de ocupação, um page split (divisão de página) pode ocorrer logo após o merge das páginas. Se este comportamento de merge-split ocorrer frequentemente, pode ter um efeito adverso no performance. Para evitar merge-splits frequentes, você pode reduzir o valor de `MERGE_THRESHOLD` para que o `InnoDB` tente fazer merges de página em uma porcentagem de "page-full" mais baixa. O merge de páginas em uma porcentagem de página cheia menor deixa mais espaço nas index pages e ajuda a reduzir o comportamento de merge-split.

O `MERGE_THRESHOLD` para index pages pode ser definido para uma table ou para indexes individuais. Um valor `MERGE_THRESHOLD` definido para um index individual tem prioridade sobre um valor `MERGE_THRESHOLD` definido para a table. Se não for definido, o valor de `MERGE_THRESHOLD` assume o padrão de 50.

#### Definindo MERGE_THRESHOLD para uma Table

Você pode definir o valor de `MERGE_THRESHOLD` para uma table usando a cláusula *`table_option`* `COMMENT` da instrução `CREATE TABLE`. Por exemplo:

```sql
CREATE TABLE t1 (
   id INT,
  KEY id_index (id)
) COMMENT='MERGE_THRESHOLD=45';
```

Você também pode definir o valor de `MERGE_THRESHOLD` para uma table existente usando a cláusula *`table_option`* `COMMENT` com `ALTER TABLE`:

```sql
CREATE TABLE t1 (
   id INT,
  KEY id_index (id)
);

ALTER TABLE t1 COMMENT='MERGE_THRESHOLD=40';
```

#### Definindo MERGE_THRESHOLD para Indexes Individuais

Para definir o valor de `MERGE_THRESHOLD` para um index individual, você pode usar a cláusula *`index_option`* `COMMENT` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, conforme mostrado nos exemplos a seguir:

* Definindo `MERGE_THRESHOLD` para um index individual usando `CREATE TABLE`:

  ```sql
  CREATE TABLE t1 (
     id INT,
    KEY id_index (id) COMMENT 'MERGE_THRESHOLD=40'
  );
  ```

* Definindo `MERGE_THRESHOLD` para um index individual usando `ALTER TABLE`:

  ```sql
  CREATE TABLE t1 (
     id INT,
    KEY id_index (id)
  );

  ALTER TABLE t1 DROP KEY id_index;
  ALTER TABLE t1 ADD KEY id_index (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

* Definindo `MERGE_THRESHOLD` para um index individual usando `CREATE INDEX`:

  ```sql
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

Nota

Você não pode modificar o valor de `MERGE_THRESHOLD` no nível do index para `GEN_CLUST_INDEX`, que é o clustered index criado pelo `InnoDB` quando uma table `InnoDB` é criada sem uma primary key ou unique key index. Você só pode modificar o valor de `MERGE_THRESHOLD` para `GEN_CLUST_INDEX` definindo `MERGE_THRESHOLD` para a table.

#### Consultando o Valor de MERGE_THRESHOLD para um Index

O valor atual de `MERGE_THRESHOLD` para um index pode ser obtido consultando a table `INNODB_SYS_INDEXES`. Por exemplo:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE NAME='id_index' \G
*************************** 1. row ***************************
       INDEX_ID: 91
           NAME: id_index
       TABLE_ID: 68
           TYPE: 0
       N_FIELDS: 1
        PAGE_NO: 4
          SPACE: 57
MERGE_THRESHOLD: 40
```

Você pode usar `SHOW CREATE TABLE` para visualizar o valor de `MERGE_THRESHOLD` para uma table, se definido explicitamente usando a cláusula *`table_option`* `COMMENT`:

```sql
mysql> SHOW CREATE TABLE t2 \G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `id` int(11) DEFAULT NULL,
  KEY `id_index` (`id`) COMMENT 'MERGE_THRESHOLD=40'
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

Nota

Um valor `MERGE_THRESHOLD` definido no nível do index tem prioridade sobre um valor `MERGE_THRESHOLD` definido para a table. Se não for definido, `MERGE_THRESHOLD` assume o padrão de 50% (`MERGE_THRESHOLD=50`), que é o valor previamente fixado (hardcoded).

Da mesma forma, você pode usar `SHOW INDEX` para visualizar o valor de `MERGE_THRESHOLD` para um index, se definido explicitamente usando a cláusula *`index_option`* `COMMENT`:

```sql
mysql> SHOW INDEX FROM t2 \G
*************************** 1. row ***************************
        Table: t2
   Non_unique: 1
     Key_name: id_index
 Seq_in_index: 1
  Column_name: id
    Collation: A
  Cardinality: 0
     Sub_part: NULL
       Packed: NULL
         Null: YES
   Index_type: BTREE
      Comment:
Index_comment: MERGE_THRESHOLD=40
```

#### Medindo o Efeito das Configurações de MERGE_THRESHOLD

A table `INNODB_METRICS` fornece dois counters que podem ser usados para medir o efeito de uma configuração de `MERGE_THRESHOLD` nos merges de index page.

```sql
mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS
       WHERE NAME like '%index_page_merge%';
+-----------------------------+----------------------------------------+
| NAME                        | COMMENT                                |
+-----------------------------+----------------------------------------+
| index_page_merge_attempts   | Number of index page merge attempts    |
| index_page_merge_successful | Number of successful index page merges |
+-----------------------------+----------------------------------------+
```

Ao reduzir o valor de `MERGE_THRESHOLD`, os objetivos são:

* Um número menor de tentativas de page merge e de page merges bem-sucedidos

* Um número similar de tentativas de page merge e de page merges bem-sucedidos

Uma configuração de `MERGE_THRESHOLD` muito pequena pode resultar em arquivos de dados grandes devido a uma quantidade excessiva de espaço vazio nas páginas.

Para obter informações sobre como usar os counters de `INNODB_METRICS`, consulte a Seção 14.16.6, "InnoDB INFORMATION_SCHEMA Metrics Table".