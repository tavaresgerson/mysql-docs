#### 14.21.5.5 Adaptando declarações DML para operações memcached

Os benchmarks sugerem que o plugin `daemon_memcached` acelera as operações DML (inserções, atualizações e exclusões) mais do que as consultas. Portanto, considere focar os esforços iniciais de desenvolvimento em aplicações intensivas em escrita que estejam limitadas por I/O, e procure oportunidades para usar o MySQL com o plugin `daemon_memcached` para novas aplicações intensivas em escrita.

As instruções DML de uma única linha são os tipos de instruções mais fáceis de transformar em operações do `memcached`. `INSERT` se torna `add`, `UPDATE` se torna `set`, `incr` ou `decr`, e `DELETE` se torna `delete`. Essas operações garantem que afetem apenas uma linha quando emitidas através da interface do **memcached**, porque o *`chave`* é único dentro da tabela.

Nos exemplos de SQL a seguir, `t1` refere-se à tabela usada para operações do **memcached**, com base na configuração na tabela `innodb_memcache.containers`. `key` refere-se à coluna listada em `key_columns`, e `val` refere-se à coluna listada em `value_columns`.

```sql
INSERT INTO t1 (key,val) VALUES (some_key,some_value);
SELECT val FROM t1 WHERE key = some_key;
UPDATE t1 SET val = new_value WHERE key = some_key;
UPDATE t1 SET val = val + x WHERE key = some_key;
DELETE FROM t1 WHERE key = some_key;
```

As seguintes instruções `TRUNCATE TABLE` e `DELETE`, que removem todas as linhas da tabela, correspondem à operação `flush_all`, onde `t1` é configurado como a tabela para operações **memcached**, como no exemplo anterior.

```sql
TRUNCATE TABLE t1;
DELETE FROM t1;
```
