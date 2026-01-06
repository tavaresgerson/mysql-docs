## 25.11 Características gerais da tabela do esquema de desempenho

O nome do banco de dados `performance_schema` é minúsculo, assim como os nomes das tabelas nele contidas. As consultas devem especificar os nomes em minúsculas.

Muitas tabelas no banco de dados `performance_schema` são apenas de leitura e não podem ser modificadas:

```sql
mysql> TRUNCATE TABLE performance_schema.setup_instruments;
ERROR 1683 (HY000): Invalid performance_schema usage.
```

Algumas das tabelas de configuração têm colunas que podem ser modificadas para afetar o funcionamento do Gerenciador de Desempenho; algumas também permitem a inserção ou exclusão de linhas. A truncação é permitida para limpar eventos coletados, então `TRUNCATE TABLE` pode ser usado em tabelas que contêm esse tipo de informação, como tabelas com o prefixo `events_waits_`.

As tabelas de resumo podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não para remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, após você ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

Os privilégios são os mesmos que para outras bases de dados e tabelas:

- Para recuperar de tabelas do `performance_schema`, você deve ter o privilégio `SELECT`.

- Para alterar as colunas que podem ser modificadas, você deve ter o privilégio `UPDATE`.

- Para truncar tabelas que podem ser truncadas, você deve ter o privilégio `DROP`.

Como apenas um conjunto limitado de privilégios se aplica às tabelas do Schema de Desempenho, as tentativas de usar `GRANT ALL` como abreviação para conceder privilégios no nível de banco de dados ou tabela falham com um erro:

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
