### 17.8.11 Configurando o Limite de Fusão para Páginas de Índice

Você pode configurar o valor `MERGE_THRESHOLD` para páginas de índice. Se a porcentagem de "página cheia" para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação `UPDATE`, o `InnoDB` tenta fusão a página de índice com uma página de índice vizinha. O valor padrão de `MERGE_THRESHOLD` é 50, que é o valor previamente codificado. O valor mínimo de `MERGE_THRESHOLD` é 1 e o valor máximo é 50.

Quando a porcentagem de "página cheia" para uma página de índice cair abaixo de 50%, que é o valor padrão de `MERGE_THRESHOLD`, o `InnoDB` tenta fusão a página de índice com uma página vizinha. Se ambas as páginas estiverem próximas de 50% de capacidade, uma divisão de página pode ocorrer logo após as páginas serem fundidas. Se esse comportamento de fusão-divisão ocorrer frequentemente, pode ter um efeito adverso no desempenho. Para evitar fusões-divisões frequentes, você pode diminuir o valor de `MERGE_THRESHOLD` para que o `InnoDB` tente fusões de página em uma porcentagem de "página cheia" mais baixa. Fusões de páginas em uma porcentagem de "página cheia" mais baixa deixa mais espaço nas páginas de índice e ajuda a reduzir o comportamento de fusão-divisão.

O `MERGE_THRESHOLD` para páginas de índice pode ser definido para uma tabela ou para índices individuais. Um valor `MERGE_THRESHOLD` definido para um índice individual tem prioridade sobre um valor `MERGE_THRESHOLD` definido para a tabela. Se não definido, o valor `MERGE_THRESHOLD` tem o valor padrão de 50.

#### Definindo MERGE\_THRESHOLD para uma Tabela

Você pode definir o valor `MERGE_THRESHOLD` para uma tabela usando a cláusula `COMMENT` *`table_option`* da instrução `CREATE TABLE`. Por exemplo:

```
CREATE TABLE t1 (
   id INT,
  KEY id_index (id)
) COMMENT='MERGE_THRESHOLD=45';
```

Você também pode definir o valor `MERGE_THRESHOLD` para uma tabela existente usando a cláusula `COMMENT` *`table_option`* com `ALTER TABLE`:

```
CREATE TABLE t1 (
   id INT,
  KEY id_index (id)
);

ALTER TABLE t1 COMMENT='MERGE_THRESHOLD=40';
```

#### Definindo o MERGE\_THRESHOLD para Índices Individuais

Para definir o valor `MERGE\_THRESHOLD` para um índice individual, você pode usar a cláusula `COMMENT` do *`index_option`* com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, conforme mostrado nos exemplos a seguir:

* Definindo `MERGE\_THRESHOLD` para um índice individual usando `CREATE TABLE`:

  ```
  CREATE TABLE t1 (
     id INT,
    KEY id_index (id) COMMENT 'MERGE_THRESHOLD=40'
  );
  ```

* Definindo `MERGE\_THRESHOLD` para um índice individual usando `ALTER TABLE`:

  ```
  CREATE TABLE t1 (
     id INT,
    KEY id_index (id)
  );

  ALTER TABLE t1 DROP KEY id_index;
  ALTER TABLE t1 ADD KEY id_index (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

* Definindo `MERGE\_THRESHOLD` para um índice individual usando `CREATE INDEX`:

  ```
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

Observação

Você não pode modificar o valor `MERGE\_THRESHOLD` no nível do índice para `GEN_CLUST_INDEX`, que é o índice agrupado criado pelo `InnoDB` quando uma tabela `InnoDB` é criada sem um índice de chave primária ou chave única. Você só pode modificar o valor `MERGE\_THRESHOLD` para `GEN_CLUST_INDEX` definindo `MERGE\_THRESHOLD` para a tabela.

#### Consultando o Valor MERGE\_THRESHOLD para um Índice

O valor atual de `MERGE\_THRESHOLD` para um índice pode ser obtido consultando a tabela `INNODB_INDEXES`. Por exemplo:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_INDEXES WHERE NAME='id_index' \G
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

Você pode usar `SHOW CREATE TABLE` para visualizar o valor `MERGE\_THRESHOLD` para uma tabela, se explicitamente definido usando a cláusula `COMMENT` do *`table_option`*:

```
mysql> SHOW CREATE TABLE t2 \G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `id` int(11) DEFAULT NULL,
  KEY `id_index` (`id`) COMMENT 'MERGE_THRESHOLD=40'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Observação

Um valor `MERGE\_THRESHOLD` definido no nível do índice tem prioridade sobre um valor `MERGE\_THRESHOLD` definido para a tabela. Se não definido, `MERGE\_THRESHOLD` tem o valor padrão de 50% (`MERGE\_THRESHOLD=50`, que é o valor previamente codificado.

Da mesma forma, você pode usar `SHOW INDEX` para visualizar o valor `MERGE\_THRESHOLD` para um índice, se explicitamente definido usando a cláusula `COMMENT` do *`index_option`*:

```
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

#### Medindo o Efeito das Definições de MERGE\_THRESHOLD

A tabela `INNODB_METRICS` fornece dois contadores que podem ser usados para medir o efeito de um ajuste de `MERGE_THRESHOLD` em fusões de páginas de índice.

```
mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS
       WHERE NAME like '%index_page_merge%';
+-----------------------------+----------------------------------------+
| NAME                        | COMMENT                                |
+-----------------------------+----------------------------------------+
| index_page_merge_attempts   | Number of index page merge attempts    |
| index_page_merge_successful | Number of successful index page merges |
+-----------------------------+----------------------------------------+
```

Ao diminuir o valor de `MERGE_THRESHOLD`, os objetivos são:

* Um número menor de tentativas de fusão de páginas e fusões de páginas bem-sucedidas

* Um número semelhante de tentativas de fusão de páginas e fusões de páginas bem-sucedidas

Um ajuste de `MERGE_THRESHOLD` muito pequeno pode resultar em grandes arquivos de dados devido a uma quantidade excessiva de espaço de página vazio.

Para obter informações sobre o uso dos contadores `INNODB_METRICS`, consulte a Seção 17.15.6, “Tabela de métricas do esquema de informações InnoDB”.