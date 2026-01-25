#### 14.21.5.5 Adaptando Instruções DML para Operações memcached

Benchmarks sugerem que o plugin `daemon_memcached` acelera as operações DML (inserts, updates e deletes) mais do que acelera as queries. Portanto, considere focar os esforços iniciais de desenvolvimento em aplicações com alta intensidade de escrita (write-intensive) que são limitadas por I/O (I/O-bound), e procure oportunidades para usar MySQL com o plugin `daemon_memcached` para novas aplicações com alta intensidade de escrita.

Instruções DML de linha única são os tipos de instruções mais fáceis de transformar em operações `memcached`. `INSERT` se torna `add`, `UPDATE` se torna `set`, `incr` ou `decr`, e `DELETE` se torna `delete`. É garantido que essas operações afetem apenas uma linha quando emitidas através da interface **memcached**, porque a *`key`* é única dentro da tabela.

Nos seguintes exemplos SQL, `t1` refere-se à tabela usada para operações **memcached**, baseada na configuração na tabela `innodb_memcache.containers`. `key` refere-se à coluna listada sob `key_columns`, e `val` refere-se à coluna listada sob `value_columns`.

```sql
INSERT INTO t1 (key,val) VALUES (some_key,some_value);
SELECT val FROM t1 WHERE key = some_key;
UPDATE t1 SET val = new_value WHERE key = some_key;
UPDATE t1 SET val = val + x WHERE key = some_key;
DELETE FROM t1 WHERE key = some_key;
```

As seguintes instruções `TRUNCATE TABLE` e `DELETE`, que removem todas as linhas da tabela, correspondem à operação `flush_all`, onde `t1` está configurada como a tabela para operações **memcached**, como no exemplo anterior.

```sql
TRUNCATE TABLE t1;
DELETE FROM t1;
```