### 14.9.3 Pesquisas de texto completo com expansão de consulta

A pesquisa de texto completo suporta a expansão de consulta (e, em particular, sua variante "expansão de consulta cega"). Isso geralmente é útil quando uma frase de busca é muito curta, o que muitas vezes significa que o usuário está confiando em um conhecimento implícito que o mecanismo de busca de texto completo carece. Por exemplo, um usuário que busca por "banco de dados" pode realmente querer dizer que "MySQL", "Oracle", "DB2" e "RDBMS" são todas frases que devem corresponder a "bancos de dados" e também devem ser retornadas. Esse é um conhecimento implícito.

A expansão de consulta cega (também conhecida como feedback automático de relevância) é ativada adicionando `WITH QUERY EXPANSION` ou `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` após a frase de busca. Ela funciona realizando a busca duas vezes, onde a frase de busca para a segunda busca é a frase de busca original concatenada com os poucos documentos mais relevantes da primeira busca. Assim, se um desses documentos contiver a palavra "bancos de dados" e a palavra "MySQL", a segunda busca encontra os documentos que contêm a palavra "MySQL", mesmo que não contenham a palavra "banco de dados". O exemplo seguinte mostra essa diferença:

```
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

Outro exemplo poderia ser buscar livros de Georges Simenon sobre Maigret, quando um usuário não tem certeza de como digitar "Maigret". Uma busca por "Megre e os testemunhas relutantes" encontra apenas "Maigret e os Testemunhas Relutantes" sem expansão de consulta. Uma busca com expansão de consulta encontra todos os livros com a palavra "Maigret" na segunda passagem.

::: info Nota

Como a expansão de consulta cega tende a aumentar significativamente o ruído ao retornar documentos não relevantes, use-a apenas quando a frase de busca é curta.