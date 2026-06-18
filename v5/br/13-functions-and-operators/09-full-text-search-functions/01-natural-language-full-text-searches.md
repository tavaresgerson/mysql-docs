### 12.9.1 Pesquisas Full-Text em Linguagem Natural

Por padrão ou com o modificador `IN NATURAL LANGUAGE MODE`, a função `MATCH()` executa uma pesquisa (search) em linguagem natural para uma string em uma coleção de texto. Uma coleção é um conjunto de uma ou mais colunas incluídas em um `FULLTEXT` Index. A string de pesquisa é fornecida como argumento para `AGAINST()`. Para cada row na tabela, `MATCH()` retorna um valor de relevância; ou seja, uma medida de similaridade entre a string de pesquisa e o texto nessa row nas colunas nomeadas na lista `MATCH()`.

```sql
mysql> CREATE TABLE articles (
    ->   id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    ->   title VARCHAR(200),
    ->   body TEXT,
    ->   FULLTEXT (title,body)
    -> ) ENGINE=InnoDB;
Query OK, 0 rows affected (0.08 sec)

mysql> INSERT INTO articles (title,body) VALUES
    ->   ('MySQL Tutorial','DBMS stands for DataBase ...'),
    ->   ('How To Use MySQL Well','After you went through a ...'),
    ->   ('Optimizing MySQL','In this tutorial, we show ...'),
    ->   ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
    ->   ('MySQL vs. YourSQL','In the following database comparison ...'),
    ->   ('MySQL Security','When configured properly, MySQL ...');
Query OK, 6 rows affected (0.01 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM articles
    -> WHERE MATCH (title,body)
    -> AGAINST ('database' IN NATURAL LANGUAGE MODE);
+----+-------------------+------------------------------------------+
| id | title             | body                                     |
+----+-------------------+------------------------------------------+
|  1 | MySQL Tutorial    | DBMS stands for DataBase ...             |
|  5 | MySQL vs. YourSQL | In the following database comparison ... |
+----+-------------------+------------------------------------------+
2 rows in set (0.00 sec)
```

Por padrão, a pesquisa é realizada de forma case-insensitive (não diferencia maiúsculas de minúsculas). Para realizar uma pesquisa full-text case-sensitive, use um collation binário para as colunas indexadas. Por exemplo, uma coluna que usa o conjunto de caracteres `latin1` pode ter um collation `latin1_bin` atribuído para torná-la case-sensitive para pesquisas full-text.

Quando `MATCH()` é usada em uma cláusula `WHERE`, como no exemplo mostrado anteriormente, as rows retornadas são automaticamente ordenadas com a maior relevância primeiro, desde que as seguintes condições sejam atendidas:

* Não deve haver uma cláusula `ORDER BY` explícita.
* A pesquisa deve ser executada usando um full-text Index scan em vez de um table scan.
* Se a Query fizer JOIN de tabelas, o full-text Index scan deve ser a tabela não constante mais à esquerda no JOIN.

Dadas as condições listadas, geralmente exige menos esforço especificar uma ordem de classificação explícita usando `ORDER BY` quando esta for necessária ou desejada.

Valores de relevância são números floating-point não negativos. Relevância zero significa nenhuma similaridade. A relevância é calculada com base no número de palavras na row (documento), no número de palavras únicas na row, no número total de palavras na coleção e no número de rows que contêm uma palavra específica.

Nota

O termo “documento” pode ser usado de forma intercambiável com o termo “row”, e ambos os termos referem-se à parte indexada da row. O termo “coleção” refere-se às colunas indexadas e engloba todas as rows.

Para simplesmente contar as ocorrências (matches), você pode usar uma Query como esta:

```sql
mysql> SELECT COUNT(*) FROM articles
    -> WHERE MATCH (title,body)
    -> AGAINST ('database' IN NATURAL LANGUAGE MODE);
+----------+
| COUNT(*) |
+----------+
|        2 |
+----------+
1 row in set (0.00 sec)
```

Você pode achar mais rápido reescrever a Query da seguinte forma:

```sql
mysql> SELECT
    -> COUNT(IF(MATCH (title,body) AGAINST ('database' IN NATURAL LANGUAGE MODE), 1, NULL))
    -> AS count
    -> FROM articles;
+-------+
| count |
+-------+
|     2 |
+-------+
1 row in set (0.03 sec)
```

A primeira Query faz algum trabalho extra (ordenar os resultados por relevância), mas também pode usar um Index Lookup baseado na cláusula `WHERE`. O Index Lookup pode tornar a primeira Query mais rápida se a pesquisa corresponder a poucas rows. A segunda Query executa um Full Table Scan, o que pode ser mais rápido do que o Index Lookup se o termo de pesquisa estiver presente na maioria das rows.

Para pesquisas full-text em linguagem natural, as colunas nomeadas na função `MATCH()` devem ser as mesmas colunas incluídas em algum `FULLTEXT` Index na sua tabela. Para a Query anterior, as colunas nomeadas na função `MATCH()` (`title` e `body`) são as mesmas nomeadas na definição do `FULLTEXT` Index da tabela `article`. Para pesquisar `title` ou `body` separadamente, você criaria `FULLTEXT` Indexes separados para cada coluna.

Você também pode realizar uma boolean search (pesquisa booleana) ou uma pesquisa com query expansion (expansão de Query). Esses tipos de pesquisa são descritos na Seção 12.9.2, “Boolean Full-Text Searches”, e na Seção 12.9.3, “Full-Text Searches with Query Expansion”.

Uma pesquisa full-text que usa um Index pode nomear colunas apenas de uma única tabela na cláusula `MATCH()` porque um Index não pode abranger várias tabelas. Para tabelas `MyISAM`, uma boolean search pode ser feita na ausência de um Index (embora mais lentamente), caso em que é possível nomear colunas de múltiplas tabelas.

O exemplo anterior é uma ilustração básica que mostra como usar a função `MATCH()` onde as rows são retornadas em ordem decrescente de relevância. O próximo exemplo mostra como recuperar os valores de relevância explicitamente. As rows retornadas não são ordenadas porque o comando `SELECT` não inclui cláusulas `WHERE` nem `ORDER BY`:

```sql
mysql> SELECT id, MATCH (title,body)
    -> AGAINST ('Tutorial' IN NATURAL LANGUAGE MODE) AS score
    -> FROM articles;
+----+---------------------+
| id | score               |
+----+---------------------+
|  1 | 0.22764469683170319 |
|  2 |                   0 |
|  3 | 0.22764469683170319 |
|  4 |                   0 |
|  5 |                   0 |
|  6 |                   0 |
+----+---------------------+
6 rows in set (0.00 sec)
```

O exemplo a seguir é mais complexo. A Query retorna os valores de relevância e também ordena as rows em ordem decrescente de relevância. Para alcançar este resultado, especifique `MATCH()` duas vezes: uma na lista `SELECT` e uma na cláusula `WHERE`. Isso não causa sobrecarga adicional, pois o otimizador do MySQL percebe que as duas chamadas `MATCH()` são idênticas e invoca o código de pesquisa full-text apenas uma vez.

```sql
mysql> SELECT id, body, MATCH (title,body)
    ->   AGAINST ('Security implications of running MySQL as root'
    ->   IN NATURAL LANGUAGE MODE) AS score
    -> FROM articles
    ->   WHERE MATCH (title,body)
    ->   AGAINST('Security implications of running MySQL as root'
    ->   IN NATURAL LANGUAGE MODE);
+----+-------------------------------------+-----------------+
| id | body                                | score           |
+----+-------------------------------------+-----------------+
|  4 | 1. Never run mysqld as root. 2. ... | 1.5219271183014 |
|  6 | When configured properly, MySQL ... | 1.3114095926285 |
+----+-------------------------------------+-----------------+
2 rows in set (0.00 sec)
```

Uma frase que está entre aspas duplas (`"`) corresponde apenas a rows que contêm a frase *literalmente, como foi digitada*. O motor full-text divide a frase em palavras e executa uma pesquisa no `FULLTEXT` Index para essas palavras. Caracteres que não são palavras (nonword characters) não precisam ser correspondidos exatamente: a pesquisa de frase exige apenas que as correspondências contenham exatamente as mesmas palavras que a frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`. Se a frase não contiver palavras que estejam no Index, o resultado será vazio. Por exemplo, se todas as palavras forem stopwords ou mais curtas que o comprimento mínimo de palavras indexadas, o resultado será vazio.

A implementação `FULLTEXT` do MySQL considera qualquer sequência de caracteres verdadeiros de palavra (letras, dígitos e underscores) como uma palavra. Essa sequência também pode conter apóstrofos (`'`), mas não mais de um seguido. Isso significa que `aaa'bbb` é considerado uma palavra, mas `aaa''bbb` é considerado duas palavras. Apóstrofos no início ou no fim de uma palavra são removidos pelo parser `FULLTEXT`; `'aaa'bbb'` seria analisado como `aaa'bbb`.

O parser `FULLTEXT` embutido determina onde as palavras começam e terminam procurando por certos caracteres delimitadores; por exemplo, (espaço), `,` (vírgula) e `.` (ponto). Se as palavras não forem separadas por delimitadores (como, por exemplo, em chinês), o parser `FULLTEXT` embutido não pode determinar onde uma palavra começa ou termina. Para poder adicionar palavras ou outros termos indexados nesses idiomas a um `FULLTEXT` Index que usa o parser `FULLTEXT` embutido, você deve pré-processá-los para que sejam separados por algum delimitador arbitrário. Alternativamente, você pode criar `FULLTEXT` Indexes usando o plugin de parser ngram (para chinês, japonês ou coreano) ou o plugin de parser MeCab (para japonês).

É possível escrever um plugin que substitua o parser full-text embutido. Para detalhes, consulte A API de Plugin do MySQL. Para um exemplo do código-fonte de um plugin de parser, consulte o diretório `plugin/fulltext` de uma distribuição de código-fonte do MySQL.

Algumas palavras são ignoradas em pesquisas full-text:

* Qualquer palavra que seja muito curta é ignorada. O comprimento mínimo padrão de palavras encontradas por pesquisas full-text é de três caracteres para `InnoDB` search indexes, ou quatro caracteres para `MyISAM`. Você pode controlar esse limite definindo uma opção de configuração antes de criar o Index: a opção de configuração `innodb_ft_min_token_size` para `InnoDB` search indexes, ou `ft_min_word_len` para `MyISAM`.

  Nota

  Este comportamento não se aplica a `FULLTEXT` Indexes que usam o parser ngram. Para o parser ngram, o comprimento do token é definido pela opção `ngram_token_size`.

* Palavras na lista de stopwords são ignoradas. Uma stopword é uma palavra, como “the” ou “some” (em inglês), que é tão comum que é considerada ter valor semântico zero. Existe uma lista de stopwords embutida, mas ela pode ser substituída por uma lista definida pelo usuário. As listas de stopwords e as opções de configuração relacionadas são diferentes para `InnoDB` search indexes e `MyISAM` search indexes. O processamento de stopwords é controlado pelas opções de configuração `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para `InnoDB` search indexes, e `ft_stopword_file` para `MyISAM` search indexes.

Consulte a Seção 12.9.4, “Full-Text Stopwords” para visualizar as listas de stopwords padrão e como alterá-las. O comprimento mínimo padrão de palavras pode ser alterado conforme descrito na Seção 12.9.6, “Ajuste Fino (Fine-Tuning) da Pesquisa Full-Text do MySQL”.

Cada palavra correta na coleção e na Query é ponderada de acordo com sua importância na coleção ou Query. Assim, uma palavra que está presente em muitos documentos tem um peso menor, pois possui um valor semântico mais baixo nessa coleção específica. Inversamente, se a palavra for rara, ela recebe um peso maior. Os pesos das palavras são combinados para calcular a relevância da row. Essa técnica funciona melhor com grandes coleções.

Limitação MyISAM

Para tabelas muito pequenas, a distribuição de palavras não reflete adequadamente o seu valor semântico, e este modelo pode, às vezes, produzir resultados bizarros para search indexes em tabelas `MyISAM`. Por exemplo, embora a palavra “MySQL” esteja presente em todas as rows da tabela `articles` mostrada anteriormente, uma pesquisa pela palavra em um `MyISAM` search index não produz resultados:

```sql
mysql> SELECT * FROM articles
    -> WHERE MATCH (title,body)
    -> AGAINST ('MySQL' IN NATURAL LANGUAGE MODE);
Empty set (0.00 sec)
```

O resultado da pesquisa está vazio porque a palavra “MySQL” está presente em pelo menos 50% das rows e, portanto, é efetivamente tratada como uma stopword. Essa técnica de filtragem é mais adequada para grandes conjuntos de dados (data sets), onde você pode não querer que o result set retorne cada segunda row de uma tabela de 1GB, do que para pequenos conjuntos de dados onde pode causar resultados insatisfatórios para termos populares.

O limite de 50% pode ser surpreendente quando você tenta a pesquisa full-text pela primeira vez para ver como funciona, e torna as tabelas `InnoDB` mais adequadas para experimentação com pesquisas full-text. Se você criar uma tabela `MyISAM` e inserir apenas uma ou duas rows de texto nela, cada palavra no texto ocorrerá em pelo menos 50% das rows. Como resultado, nenhuma pesquisa retorna resultados até que a tabela contenha mais rows. Usuários que precisam contornar a limitação de 50% podem construir search indexes em tabelas `InnoDB` ou usar o modo de pesquisa booleana explicado na Seção 12.9.2, “Boolean Full-Text Searches”.