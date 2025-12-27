### 14.9.1 Pesquisas de Texto Completo em Linguagem Natural

Por padrão ou com o modificador `IN MODO DE LINGUAGEM NATURAL`, a função `MATCH()` realiza uma pesquisa em linguagem natural para uma string em uma coleção de texto. Uma coleção é um conjunto de uma ou mais colunas incluídas em um índice `FULLTEXT`. A string de pesquisa é fornecida como argumento para `AGAINST()`. Para cada linha na tabela, `MATCH()` retorna um valor de relevância; ou seja, uma medida de similaridade entre a string de pesquisa e o texto dessa linha nas colunas nomeadas na lista `MATCH()`.

```
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

Por padrão, a pesquisa é realizada de forma não sensível a maiúsculas. Para realizar uma pesquisa de texto completo sensível a maiúsculas, use uma ordenação sensível a maiúsculas ou binária para as colunas indexadas. Por exemplo, uma coluna que usa o conjunto de caracteres `utf8mb4` pode ser atribuída uma ordenação de `utf8mb4_0900_as_cs` ou `utf8mb4_bin` para torná-la sensível a maiúsculas para pesquisas de texto completo.

Quando `MATCH()` é usado em uma cláusula `WHERE`, como no exemplo mostrado anteriormente, as linhas retornadas são automaticamente ordenadas com a maior relevância primeiro, desde que as seguintes condições sejam atendidas:

* Não deve haver uma cláusula `ORDER BY` explícita.

* A pesquisa deve ser realizada usando uma varredura do índice de texto completo em vez de uma varredura da tabela.

* Se a consulta fizer junções de tabelas, a varredura do índice de texto completo deve ser a tabela não constante mais à esquerda na junção.

Dadas as condições listadas acima, geralmente é menos trabalhoso especificar o uso de `ORDER BY` uma ordem de classificação explícita quando isso é necessário ou desejado.

Os valores de relevância são números de ponto flutuante não negativos. Zero relevância significa nenhuma semelhança. A relevância é calculada com base no número de palavras na linha (documento), no número de palavras únicas na linha, no número total de palavras na coleção e no número de linhas que contêm uma palavra específica.

Nota

O termo “documento” pode ser usado de forma intercambiável com o termo “linha”, e ambos os termos se referem à parte indexada da linha. O termo “coleção” refere-se às colunas indexadas e abrange todas as linhas.

Para simplesmente contar os correspondências, você poderia usar uma consulta como esta:

```
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

Você pode achar mais rápido reescrever a consulta da seguinte forma:

```
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

A primeira consulta realiza um trabalho extra (ordenando os resultados por relevância), mas também pode usar uma busca por índice com base na cláusula `WHERE`. A busca por índice pode tornar a primeira consulta mais rápida se o termo de busca corresponder a poucas linhas. A segunda consulta realiza uma varredura completa da tabela, o que pode ser mais rápido do que a busca por índice se o termo de busca estiver presente na maioria das linhas.

Para buscas de texto completo em linguagem natural, as colunas nomeadas na função `MATCH()` devem ser as mesmas colunas incluídas em algum índice `FULLTEXT` na sua tabela. Para a consulta anterior, note que as colunas nomeadas na função `MATCH()` (`title` e `body`) são as mesmas que as nomeadas na definição do índice `FULLTEXT` da tabela `article`. Para buscar o `title` ou `body` separadamente, você criaria índices `FULLTEXT` separados para cada coluna.

Você também pode realizar uma busca booleana ou uma busca com expansão de consulta. Esses tipos de busca são descritos na Seção 14.9.2, “Buscas de Texto Completo Booleanas”, e na Seção 14.9.3, “Buscas de Texto Completo com Expansão de Consulta”.

Uma pesquisa de texto completo que utiliza um índice pode nomear colunas apenas de uma única tabela na cláusula `MATCH()` porque um índice não pode abranger múltiplas tabelas. Para tabelas `MyISAM`, uma pesquisa booleana pode ser realizada na ausência de um índice (embora mais lentamente), caso em que é possível nomear colunas de múltiplas tabelas.

O exemplo anterior é uma ilustração básica que mostra como usar a função `MATCH()` onde as linhas são retornadas em ordem de relevância decrescente. O próximo exemplo mostra como recuperar os valores de relevância explicitamente. As linhas retornadas não são ordenadas porque a instrução `SELECT` não inclui cláusulas `WHERE` ou `ORDER BY`:

```
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

O exemplo seguinte é mais complexo. A consulta retorna os valores de relevância e também ordena as linhas em ordem de relevância decrescente. Para obter esse resultado, especifique `MATCH()` duas vezes: uma na lista `SELECT` e uma na cláusula `WHERE`. Isso não causa sobrecarga adicional, porque o otimizador do MySQL percebe que as duas chamadas `MATCH()` são idênticas e invoca o código de pesquisa de texto completo apenas uma vez.

```
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

Uma frase que está entre aspas duplas (`"`) corresponde apenas a linhas que contêm a frase *literalmente, como foi digitada*. O motor de pesquisa de texto divide a frase em palavras e realiza uma pesquisa no índice `FULLTEXT` pelas palavras. Caracteres não-palavras não precisam ser correspondidos exatamente: a pesquisa de frases requer apenas que as correspondências contenham exatamente as mesmas palavras que a frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`. Se a frase não contiver palavras que estão no índice, o resultado é vazio. Por exemplo, se todas as palavras forem palavras-padrão ou mais curtas que o comprimento mínimo das palavras indexadas, o resultado é vazio.

A implementação do `FULLTEXT` do MySQL considera qualquer sequência de caracteres de palavras verdadeiros (letras, dígitos e sublinhados) como uma palavra. Essa sequência também pode conter apóstrofos (`'`), mas não mais de um em sequência. Isso significa que `aaa'bbb` é considerado uma palavra, mas `aaa''bbb` é considerado duas palavras. Os apóstrofos no início ou no final de uma palavra são removidos pelo analisador `FULLTEXT`; `'aaa'bbb'` seria analisado como `aaa'bbb`.

O analisador `FULLTEXT` embutido determina onde as palavras começam e terminam procurando por certos caracteres de delimitador; por exemplo, (espaço), `,` (vírgula) e `.` (ponto). Se as palavras não forem separadas por delimitadores (como, por exemplo, no chinês), o analisador `FULLTEXT` embutido não pode determinar onde uma palavra começa ou termina. Para poder adicionar palavras ou outros termos indexados em tais idiomas a um índice `FULLTEXT` que usa o analisador `FULLTEXT` embutido, você deve pré-processá-los para que sejam separados por algum delimitador arbitrário. Alternativamente, você pode criar índices `FULLTEXT` usando o plugin analisador ngram (para chinês, japonês ou coreano) ou o plugin analisador MeCab (para japonês).

É possível escrever um plugin que substitui o analisador de texto completo embutido. Para detalhes, consulte a API de plugins do MySQL. Para obter o código-fonte do plugin analisador, consulte o diretório `plugin/fulltext` de uma distribuição de código-fonte do MySQL.

Algumas palavras são ignoradas em buscas de texto completo:

* Qualquer palavra que seja muito curta é ignorada. O comprimento mínimo padrão das palavras encontradas por buscas de texto completo é de três caracteres para índices de pesquisa `InnoDB`, ou quatro caracteres para `MyISAM`. Você pode controlar o corte definindo uma opção de configuração antes de criar o índice: opção de configuração `innodb_ft_min_token_size` para índices de pesquisa `InnoDB`, ou `ft_min_word_len` para `MyISAM`.

Nota

Esse comportamento não se aplica aos índices `FULLTEXT` que utilizam o analisador ngram. Para o analisador ngram, o tamanho do token é definido pela opção `ngram_token_size`.

* As palavras da lista de palavras-reservadas são ignoradas. Uma palavra-reservada é uma palavra como “o” ou “algum” que é tão comum que é considerada ter um valor semântico nulo. Existe uma lista de palavras-reservadas embutida, mas ela pode ser substituída por uma lista definida pelo usuário. As listas de palavras-reservadas e as opções de configuração relacionadas são diferentes para índices de pesquisa `InnoDB` e `MyISAM`. O processamento das palavras-reservadas é controlado pelas opções de configuração `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para índices de pesquisa `InnoDB`, e `ft_stopword_file` para `MyISAM`.

Veja a Seção 14.9.4, “Palavras-reservadas de Texto Completo”, para ver as listas de palavras-reservadas padrão e como alterá-las. O comprimento mínimo padrão da palavra pode ser alterado conforme descrito na Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

Cada palavra correta na coleção e na consulta é ponderada de acordo com sua importância na coleção ou consulta. Assim, uma palavra que está presente em muitos documentos tem um peso menor, porque tem menor valor semântico nessa coleção específica. Por outro lado, se a palavra for rara, ela recebe um peso maior. Os pesos das palavras são combinados para calcular a relevância da linha. Essa técnica funciona melhor com grandes coleções.

Limitação do MyISAM

Para tabelas muito pequenas, a distribuição das palavras não reflete adequadamente seu valor semântico, e esse modelo pode, às vezes, produzir resultados bizarros para índices de pesquisa em tabelas `MyISAM`. Por exemplo, embora a palavra “MySQL” esteja presente em cada linha da tabela `articles` mostrada anteriormente, uma pesquisa pela palavra em um índice de pesquisa `MyISAM` não produz resultados:

O resultado da pesquisa está vazio porque a palavra “MySQL” está presente em pelo menos 50% das linhas, e, portanto, é tratada como uma palavra-chave. Essa técnica de filtragem é mais adequada para conjuntos de dados grandes, onde você pode não querer que o conjunto de resultados retorne cada segunda linha de uma tabela de 1 GB, do que para conjuntos de dados pequenos, onde pode causar resultados ruins para termos populares.

O limiar de 50% pode surpreender você quando você tentar pela primeira vez a pesquisa de texto completo para ver como ela funciona, e torna as tabelas `InnoDB` mais adequadas para experimentação com pesquisas de texto completo. Se você criar uma tabela `MyISAM` e inserir apenas uma ou duas linhas de texto nela, cada palavra no texto ocorre em pelo menos 50% das linhas. Como resultado, nenhuma pesquisa retorna resultados até que a tabela contenha mais linhas. Usuários que precisam contornar a limitação de 50% podem criar índices de pesquisa em tabelas `InnoDB`, ou usar o modo de busca booleana explicado na Seção 14.9.2, “Pesquisas de Texto Completo Booleanas”.