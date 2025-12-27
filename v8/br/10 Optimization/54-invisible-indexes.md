### 10.3.12 Índices Invisíveis

O MySQL suporta índices invisíveis, ou seja, índices que não são usados pelo otimizador. O recurso se aplica a índices que não são chaves primárias (explícitos ou implícitos).

Os índices são visíveis por padrão. Para controlar explicitamente a visibilidade de um novo índice, use a palavra-chave `VISIBLE` ou `INVISIBLE` como parte da definição do índice para `CREATE TABLE`, `CREATE INDEX` ou `ALTER TABLE`:

```
CREATE TABLE t1 (
  i INT,
  j INT,
  k INT,
  INDEX i_idx (i) INVISIBLE
) ENGINE = InnoDB;
CREATE INDEX j_idx ON t1 (j) INVISIBLE;
ALTER TABLE t1 ADD INDEX k_idx (k) INVISIBLE;
```

Para alterar a visibilidade de um índice existente, use a palavra-chave `VISIBLE` ou `INVISIBLE` com a operação `ALTER TABLE ... ALTER INDEX`:

```
ALTER TABLE t1 ALTER INDEX i_idx INVISIBLE;
ALTER TABLE t1 ALTER INDEX i_idx VISIBLE;
```

Informações sobre a visibilidade ou invisibilidade de um índice estão disponíveis na tabela `STATISTICS` do esquema de informações ou na saída do comando `SHOW INDEX`. Por exemplo:

```
mysql> SELECT INDEX_NAME, IS_VISIBLE
       FROM INFORMATION_SCHEMA.STATISTICS
       WHERE TABLE_SCHEMA = 'db1' AND TABLE_NAME = 't1';
+------------+------------+
| INDEX_NAME | IS_VISIBLE |
+------------+------------+
| i_idx      | YES        |
| j_idx      | NO         |
| k_idx      | NO         |
+------------+------------+
```

Índices invisíveis permitem testar o efeito da remoção de um índice no desempenho das consultas, sem fazer uma alteração destrutiva que deve ser desfeita caso o índice seja necessário. Remover e adicionar um índice pode ser caro para uma tabela grande, enquanto torná-lo invisível e visível são operações rápidas e in loco.

Se um índice tornado invisível for realmente necessário ou usado pelo otimizador, existem várias maneiras de notar o efeito da sua ausência nas consultas da tabela:

* Erros ocorrem para consultas que incluem dicas de índice que se referem ao índice invisível.
* Os dados do Schema de Desempenho mostram um aumento no volume de trabalho para as consultas afetadas.
* As consultas têm diferentes planos de execução `EXPLAIN`.
* As consultas aparecem no log de consultas lentas que não apareciam lá anteriormente.

O sinalizador `use_invisible_indexes` da variável de sistema `optimizer_switch` controla se o otimizador usa índices invisíveis para a construção do plano de execução da consulta. Se o sinalizador estiver `off` (o padrão), o otimizador ignora índices invisíveis (o mesmo comportamento do que antes da introdução deste sinalizador). Se o sinalizador estiver `on`, os índices invisíveis permanecem invisíveis, mas o otimizador os leva em consideração para a construção do plano de execução.

Usando a dica de otimização `SET_VAR` para atualizar o valor de `optimizer_switch` temporariamente, você pode habilitar índices invisíveis apenas durante a execução de uma única consulta, da seguinte forma:

```
mysql> EXPLAIN SELECT /*+ SET_VAR(optimizer_switch = 'use_invisible_indexes=on') */
     >     i, j FROM t1 WHERE j >= 50\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: range
possible_keys: j_idx
          key: j_idx
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using index condition

mysql> EXPLAIN SELECT i, j FROM t1 WHERE j >= 50\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 5
     filtered: 33.33
        Extra: Using where
```

A visibilidade do índice não afeta a manutenção do índice. Por exemplo, um índice continua sendo atualizado com as alterações nas linhas da tabela, e um índice único impede a inserção de duplicatas em uma coluna, independentemente de o índice ser visível ou invisível.

Uma tabela sem uma chave primária explícita ainda pode ter uma chave primária implícita eficaz se tiver algum índice `UNIQUE` em colunas `NOT NULL`. Nesse caso, o primeiro índice desse tipo aplica a mesma restrição às linhas da tabela que uma chave primária explícita e esse índice não pode ser tornado invisível. Considere a seguinte definição de tabela:

```
CREATE TABLE t2 (
  i INT NOT NULL,
  j INT NOT NULL,
  UNIQUE j_idx (j)
) ENGINE = InnoDB;
```

A definição não inclui uma chave primária explícita, mas o índice na coluna `NOT NULL` `j` aplica a mesma restrição às linhas que uma chave primária e não pode ser tornado invisível:

```
mysql> ALTER TABLE t2 ALTER INDEX j_idx INVISIBLE;
ERROR 3522 (HY000): A primary key index cannot be invisible.
```

Agora, suponha que uma chave primária explícita seja adicionada à tabela:

```
ALTER TABLE t2 ADD PRIMARY KEY (i);
```

A chave primária explícita não pode ser tornado invisível. Além disso, o índice único em `j` não atua mais como uma chave primária implícita e, como resultado, pode ser tornado invisível:

```
mysql> ALTER TABLE t2 ALTER INDEX j_idx INVISIBLE;
Query OK, 0 rows affected (0.03 sec)
```