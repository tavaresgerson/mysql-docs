### 12.9.3 Buscas Full-Text com Expansão de Query

A busca Full-Text suporta expansão de Query (e, em particular, sua variante "expansão cega de Query" – *blind query expansion*). Isso é geralmente útil quando uma frase de busca é muito curta, o que muitas vezes significa que o usuário está confiando em conhecimento implícito que o motor de busca Full-Text não possui. Por exemplo, um usuário buscando por “database” pode realmente querer dizer que “MySQL”, “Oracle”, “DB2” e “RDBMS” são todas frases que deveriam corresponder a “databases” e também serem retornadas. Este é o conhecimento implícito.

A expansão cega de Query (*blind query expansion*) (também conhecida como *automatic relevance feedback* – feedback automático de relevância) é ativada adicionando `WITH QUERY EXPANSION` ou `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` após a frase de busca. Ela funciona realizando a busca duas vezes, onde a frase de busca para a segunda busca é a frase de busca original concatenada com os poucos documentos mais altamente relevantes da primeira busca. Assim, se um desses documentos contiver a palavra “databases” e a palavra “MySQL”, a segunda busca encontrará os documentos que contêm a palavra “MySQL” mesmo que não contenham a palavra “database”. O exemplo a seguir mostra essa diferença:

```sql
mysql> SELECT * FROM articles
    WHERE MATCH (title,body)
    AGAINST ('database' IN NATURAL LANGUAGE MODE);
+----+-------------------+------------------------------------------+
| id | title             | body                                     |
+----+-------------------+------------------------------------------+
|  1 | MySQL Tutorial    | DBMS stands for DataBase ...             |
|  5 | MySQL vs. YourSQL | In the following database comparison ... |
+----+-------------------+------------------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT * FROM articles
    WHERE MATCH (title,body)
    AGAINST ('database' WITH QUERY EXPANSION);
+----+-----------------------+------------------------------------------+
| id | title                 | body                                     |
+----+-----------------------+------------------------------------------+
|  5 | MySQL vs. YourSQL     | In the following database comparison ... |
|  1 | MySQL Tutorial        | DBMS stands for DataBase ...             |
|  3 | Optimizing MySQL      | In this tutorial we show ...             |
|  6 | MySQL Security        | When configured properly, MySQL ...      |
|  2 | How To Use MySQL Well | After you went through a ...             |
|  4 | 1001 MySQL Tricks     | 1. Never run mysqld as root. 2. ...      |
+----+-----------------------+------------------------------------------+
6 rows in set (0.00 sec)
```

Outro exemplo poderia ser a busca por livros de Georges Simenon sobre Maigret, quando um usuário não tem certeza de como soletrar “Maigret”. Uma busca por “Megre and the reluctant witnesses” encontra apenas “Maigret and the Reluctant Witnesses” sem expansão de Query. Uma busca com expansão de Query encontra todos os livros com a palavra “Maigret” na segunda passagem.

Nota

Como a expansão cega de Query tende a aumentar o ruído significativamente, retornando documentos não relevantes, use-a apenas quando a frase de busca for curta.