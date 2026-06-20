## 25.11 Características Gerais da Tabela do Schema de Desempenho

O nome do banco de dados `performance_schema` é minúsculo, assim como os nomes das tabelas nele contidas. As consultas devem especificar os nomes em minúsculas.

Muitas tabelas no banco de dados `performance_schema` são somente de leitura e não podem ser modificadas:

```sql
mysql> TRUNCATE TABLE performance_schema.setup_instruments;
ERROR 1683 (HY000): Invalid performance_schema usage.
```

Algumas das tabelas de configuração têm colunas que podem ser modificadas para afetar o funcionamento do Gerador de Desempenho; outras também permitem que strings sejam inseridas ou excluídas. A truncação é permitida para limpar eventos coletados, então `TRUNCATE TABLE` pode ser usado em tabelas que contêm esse tipo de informação, como tabelas com um prefixo de `events_waits_`.

As tabelas resumidas podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é redefinir as colunas resumidas para 0 ou `NULL`, e não remover strings. Isso permite que você limpe os valores coletados e reinicie a agregação. Isso pode ser útil, por exemplo, depois de ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas resumidas.

Os privilégios são iguais aos de outras bases de dados e tabelas:

* Para recuperar dos `performance_schema` tabelas, você deve ter o privilégio `SELECT`.

* Para alterar as colunas que podem ser modificadas, você deve ter o privilégio `UPDATE`.

* Para truncar tabelas que podem ser truncadas, você deve ter o privilégio `DROP`.

Como apenas um conjunto limitado de privilégios se aplica a tabelas do Performance Schema, as tentativas de usar `GRANT ALL` como abreviação para conceder privilégios no nível de banco de dados ou tabela falham com um erro:

```sql
mysql> GRANT ALL ON performance_schema.*
       TO 'u1'@'localhost';
ERROR 1044 (42000): Access denied for user 'root'@'localhost'
to database 'performance_schema'
mysql> GRANT ALL ON performance_schema.setup_instruments
       TO 'u2'@'localhost';
ERROR 1044 (42000): Access denied for user 'root'@'localhost'
to database 'performance_schema'
```

Em vez disso, conceda exatamente os privilégios desejados:

```sql
mysql> GRANT SELECT ON performance_schema.*
       TO 'u1'@'localhost';
Query OK, 0 rows affected (0.03 sec)

mysql> GRANT SELECT, UPDATE ON performance_schema.setup_instruments
       TO 'u2'@'localhost';
Query OK, 0 rows affected (0.02 sec)
```