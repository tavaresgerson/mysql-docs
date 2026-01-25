## 25.11 Características Gerais das Tabelas do Performance Schema

O nome do Database `performance_schema` está em letras minúsculas, assim como os nomes das tabelas dentro dele. As Querys devem especificar os nomes em letras minúsculas.

Muitas tabelas no Database `performance_schema` são somente leitura e não podem ser modificadas:

```sql
mysql> TRUNCATE TABLE performance_schema.setup_instruments;
ERROR 1683 (HY000): Invalid performance_schema usage.
```

Algumas das tabelas de configuração (setup tables) possuem colunas que podem ser modificadas para afetar a operação do Performance Schema; algumas também permitem que linhas sejam inseridas ou excluídas. O truncamento é permitido para limpar eventos coletados, de modo que [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") pode ser usado em tabelas que contêm esses tipos de informação, como aquelas nomeadas com o prefixo `events_waits_`.

As tabelas de resumo (Summary tables) podem ser truncadas com [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, após você ter feito uma alteração na configuração em tempo de execução (runtime). Exceções a este comportamento de truncamento são observadas nas seções individuais das summary tables.

Os Privileges são os mesmos que para outros Databases e tabelas:

* Para recuperar dados das tabelas do `performance_schema`, você deve ter o Privilege [`SELECT`](privileges-provided.html#priv_select).

* Para alterar as colunas que podem ser modificadas, você deve ter o Privilege [`UPDATE`](privileges-provided.html#priv_update).

* Para truncar tabelas que podem ser truncadas, você deve ter o Privilege [`DROP`](privileges-provided.html#priv_drop).

Como apenas um conjunto limitado de Privileges se aplica às tabelas do Performance Schema, tentativas de usar `GRANT ALL` como atalho para conceder Privileges no nível do Database ou da tabela falham com um erro:

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

Em vez disso, conceda exatamente os Privileges desejados:

```sql
mysql> GRANT SELECT ON performance_schema.*
       TO 'u1'@'localhost';
Query OK, 0 rows affected (0.03 sec)

mysql> GRANT SELECT, UPDATE ON performance_schema.setup_instruments
       TO 'u2'@'localhost';
Query OK, 0 rows affected (0.02 sec)
```
