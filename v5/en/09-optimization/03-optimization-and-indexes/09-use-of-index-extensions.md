### 8.3.9 Uso de Extensões de Index

O `InnoDB` estende automaticamente cada Secondary Index anexando as colunas da Primary Key a ele. Considere esta definição de tabela:

```sql
CREATE TABLE t1 (
  i1 INT NOT NULL DEFAULT 0,
  i2 INT NOT NULL DEFAULT 0,
  d DATE DEFAULT NULL,
  PRIMARY KEY (i1, i2),
  INDEX k_d (d)
) ENGINE = InnoDB;
```

Esta tabela define a Primary Key nas colunas `(i1, i2)`. Ela também define um Secondary Index `k_d` na coluna `(d)`, mas internamente o `InnoDB` estende este Index e o trata como as colunas `(d, i1, i2)`.

O Optimizer leva em consideração as colunas da Primary Key do Secondary Index estendido ao determinar como e se deve usar esse Index. Isso pode resultar em Execution Plans de Query mais eficientes e melhor performance.

O Optimizer pode usar Secondary Indexes estendidos para acesso a Index por `ref`, `range` e `index_merge`, para acesso por Loose Index Scan, para otimização de JOIN e ordenação, e para otimização de `MIN()`/`MAX()`.

O exemplo a seguir mostra como os Execution Plans são afetados dependendo se o Optimizer usa Secondary Indexes estendidos. Suponha que `t1` esteja populada com estas linhas:

```sql
INSERT INTO t1 VALUES
(1, 1, '1998-01-01'), (1, 2, '1999-01-01'),
(1, 3, '2000-01-01'), (1, 4, '2001-01-01'),
(1, 5, '2002-01-01'), (2, 1, '1998-01-01'),
(2, 2, '1999-01-01'), (2, 3, '2000-01-01'),
(2, 4, '2001-01-01'), (2, 5, '2002-01-01'),
(3, 1, '1998-01-01'), (3, 2, '1999-01-01'),
(3, 3, '2000-01-01'), (3, 4, '2001-01-01'),
(3, 5, '2002-01-01'), (4, 1, '1998-01-01'),
(4, 2, '1999-01-01'), (4, 3, '2000-01-01'),
(4, 4, '2001-01-01'), (4, 5, '2002-01-01'),
(5, 1, '1998-01-01'), (5, 2, '1999-01-01'),
(5, 3, '2000-01-01'), (5, 4, '2001-01-01'),
(5, 5, '2002-01-01');
```

Agora considere esta Query:

```sql
EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'
```

O Execution Plan depende se o Index estendido é usado.

Quando o Optimizer não considera as extensões de Index, ele trata o Index `k_d` apenas como `(d)`. O `EXPLAIN` para a Query produz este resultado:

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ref
possible_keys: PRIMARY,k_d
          key: k_d
      key_len: 4
          ref: const
         rows: 5
        Extra: Using where; Using index
```

Quando o Optimizer leva as extensões de Index em consideração, ele trata `k_d` como `(d, i1, i2)`. Neste caso, ele pode usar o prefixo do Index mais à esquerda `(d, i1)` para produzir um Execution Plan melhor:

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ref
possible_keys: PRIMARY,k_d
          key: k_d
      key_len: 8
          ref: const,const
         rows: 1
        Extra: Using index
```

Em ambos os casos, `key` indica que o Optimizer usa o Secondary Index `k_d`, mas a saída do `EXPLAIN` mostra estas melhorias ao usar o Index estendido:

* `key_len` passa de 4 bytes para 8 bytes, indicando que as pesquisas de Key usam as colunas `d` e `i1`, e não apenas `d`.

* O valor `ref` muda de `const` para `const,const` porque a pesquisa de Key usa duas Key Parts, e não uma.

* A contagem de `rows` diminui de 5 para 1, indicando que o `InnoDB` precisará examinar menos linhas para produzir o resultado.

* O valor `Extra` muda de `Using where; Using index` para `Using index`. Isso significa que as linhas podem ser lidas usando apenas o Index, sem consultar colunas na linha de dados.

Diferenças no comportamento do Optimizer para o uso de Indexes estendidos também podem ser vistas com `SHOW STATUS`:

```sql
FLUSH TABLE t1;
FLUSH STATUS;
SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01';
SHOW STATUS LIKE 'handler_read%'
```

As instruções anteriores incluem `FLUSH TABLES` e `FLUSH STATUS` para limpar o cache da tabela e zerar os contadores de status.

Sem as extensões de Index, `SHOW STATUS` produz este resultado:

```sql
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 0     |
| Handler_read_key      | 1     |
| Handler_read_last     | 0     |
| Handler_read_next     | 5     |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 0     |
| Handler_read_rnd_next | 0     |
+-----------------------+-------+
```

Com as extensões de Index, `SHOW STATUS` produz este resultado. O valor `Handler_read_next` diminui de 5 para 1, indicando um uso mais eficiente do Index:

```sql
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 0     |
| Handler_read_key      | 1     |
| Handler_read_last     | 0     |
| Handler_read_next     | 1     |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 0     |
| Handler_read_rnd_next | 0     |
+-----------------------+-------+
```

O flag `use_index_extensions` da variável de sistema `optimizer_switch` permite controlar se o Optimizer deve levar as colunas da Primary Key em consideração ao determinar como usar os Secondary Indexes de uma tabela `InnoDB`. Por padrão, `use_index_extensions` está habilitado. Para verificar se desabilitar o uso de extensões de Index melhora a performance, use esta instrução:

```sql
SET optimizer_switch = 'use_index_extensions=off';
```

O uso de extensões de Index pelo Optimizer está sujeito aos limites usuais no número de Key Parts em um Index (16) e no comprimento máximo da Key (3072 bytes).