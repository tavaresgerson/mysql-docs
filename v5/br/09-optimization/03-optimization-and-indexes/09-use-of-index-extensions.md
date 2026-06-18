### 8.3.9 Uso de extensões do índice

O `InnoDB` estende automaticamente cada índice secundário, adicionando as colunas da chave primária. Considere esta definição de tabela:

```sql
CREATE TABLE t1 (
  i1 INT NOT NULL DEFAULT 0,
  i2 INT NOT NULL DEFAULT 0,
  d DATE DEFAULT NULL,
  PRIMARY KEY (i1, i2),
  INDEX k_d (d)
) ENGINE = InnoDB;
```

Esta tabela define a chave primária nas colunas `(i1, i2)`. Também define um índice secundário `k_d` na coluna `(d)`, mas internamente o `InnoDB` estende esse índice e o trata como colunas `(d, i1, i2)`.

O otimizador leva em consideração as colunas da chave primária do índice secundário estendido ao determinar como e se usar esse índice. Isso pode resultar em planos de execução de consultas mais eficientes e melhor desempenho.

O otimizador pode usar índices secundários extensos para o acesso aos índices `ref`, `range` e `index_merge`, para o acesso ao varredura de índice Loose, para otimização de junções e ordenamento, e para otimização de `MIN()`/`MAX()`.

O exemplo a seguir mostra como os planos de execução são afetados pelo fato de o otimizador usar índices secundários estendidos. Suponha que `t1` seja preenchido com essas linhas:

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

Agora, considere esta consulta:

```sql
EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'
```

O plano de execução depende se o índice estendido é usado.

Quando o otimizador não considera extensões de índice, ele trata o índice `k_d` como apenas `(d)`. O `EXPLAIN` para a consulta produz este resultado:

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

Quando o otimizador leva em consideração as extensões de índice, ele trata `k_d` como `(d, i1, i2)`. Nesse caso, ele pode usar o prefixo de índice mais à esquerda `(d, i1)` para produzir um plano de execução melhor:

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

Em ambos os casos, `key` indica que o otimizador usa o índice secundário `k_d`, mas a saída do `EXPLAIN` mostra essas melhorias ao usar o índice estendido:

- `key_len` passa de 4 bytes para 8 bytes, indicando que as buscas por chave usam as colunas `d` e `i1`, e não apenas `d`.

- O valor `ref` muda de `const` para `const,const` porque a busca por chave usa duas partes da chave, não uma.

- O número de `rows` diminui de 5 para 1, indicando que o `InnoDB` deve precisar examinar menos linhas para produzir o resultado.

- O valor `Extra` muda de `Usando onde; Usando índice` para `Usando índice`. Isso significa que as linhas podem ser lidas usando apenas o índice, sem consultar as colunas na linha de dados.

Diferenças no comportamento do otimizador para o uso de índices estendidos também podem ser observadas com `SHOW STATUS`:

```sql
FLUSH TABLE t1;
FLUSH STATUS;
SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01';
SHOW STATUS LIKE 'handler_read%'
```

As declarações anteriores incluem `FLUSH TABLES` e `FLUSH STATUS` para limpar o cache da tabela e limpar os contadores de status.

Sem extensões de índice, o comando `SHOW STATUS` produz este resultado:

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

Com extensões de índice, o comando `SHOW STATUS` produz esse resultado. O valor `Handler_read_next` diminui de 5 para 1, indicando um uso mais eficiente do índice:

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

A bandeira `use_index_extensions` da variável de sistema `optimizer_switch` permite controlar se o otimizador leva em consideração as colunas da chave primária ao determinar como usar os índices secundários de uma tabela `InnoDB`. Por padrão, `use_index_extensions` está habilitado. Para verificar se a desabilitação do uso de extensões de índice melhora o desempenho, use esta instrução:

```sql
SET optimizer_switch = 'use_index_extensions=off';
```

O uso de extensões de índice pelo otimizador está sujeito aos limites habituais sobre o número de partes-chave em um índice (16) e ao comprimento máximo da chave (3072 bytes).
