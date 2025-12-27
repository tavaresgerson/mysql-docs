## Características Gerais da Tabela do Schema de Desempenho

O nome do banco de dados `performance_schema` é escrito em minúsculas, assim como os nomes das tabelas nele contidas. As consultas devem especificar os nomes em minúsculas.

Muitas tabelas no banco de dados `performance_schema` são de leitura somente e não podem ser modificadas:

```
mysql> TRUNCATE TABLE performance_schema.setup_instruments;
ERROR 1683 (HY000): Invalid performance_schema usage.
```

Algumas das tabelas de configuração têm colunas que podem ser modificadas para afetar o funcionamento do Schema de Desempenho; algumas também permitem que linhas sejam inseridas ou excluídas. A truncagem é permitida para limpar eventos coletados, então o `TRUNCATE TABLE` pode ser usado em tabelas que contêm esse tipo de informação, como tabelas com um prefixo de `events_waits_`.

As tabelas de resumo podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é resetear as colunas de resumo para 0 ou `NULL`, não remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, após uma mudança na configuração de tempo de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

Os privilégios são os mesmos que para outras bases de dados e tabelas:

* Para recuperar das tabelas do `performance_schema`, você deve ter o privilégio `SELECT`.

* Para alterar as colunas que podem ser modificadas, você deve ter o privilégio `UPDATE`.

* Para truncar tabelas que podem ser truncadas, você deve ter o privilégio `DROP`.

Como apenas um conjunto limitado de privilégios se aplica às tabelas do Schema de Desempenho, tentativas de usar `GRANT ALL` como abreviação para conceder privilégios no nível da base de dados ou da tabela falham com um erro:

```
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

```
mysql> GRANT SELECT ON performance_schema.*
       TO 'u1'@'localhost';
Query OK, 0 rows affected (0.03 sec)

mysql> GRANT SELECT, UPDATE ON performance_schema.setup_instruments
       TO 'u2'@'localhost';
Query OK, 0 rows affected (0.02 sec)
```