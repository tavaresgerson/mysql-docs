### 12.9.2 Buscas Full-Text Booleanas

O MySQL pode executar buscas full-text booleanas usando o modificador `IN BOOLEAN MODE`. Com este modificador, certos caracteres têm um significado especial no início ou no final das palavras na string de busca. Na Query a seguir, os operadores `+` e `-` indicam que uma palavra deve estar presente ou ausente, respectivamente, para que ocorra um match. Assim, a Query recupera todas as rows que contêm a palavra “MySQL” mas que *não* contêm a palavra “YourSQL”:

```sql
mysql> SELECT * FROM articles WHERE MATCH (title,body)
    -> AGAINST ('+MySQL -YourSQL' IN BOOLEAN MODE);
+----+-----------------------+-------------------------------------+
| id | title                 | body                                |
+----+-----------------------+-------------------------------------+
|  1 | MySQL Tutorial        | DBMS stands for DataBase ...        |
|  2 | How To Use MySQL Well | After you went through a ...        |
|  3 | Optimizing MySQL      | In this tutorial, we show ...       |
|  4 | 1001 MySQL Tricks     | 1. Never run mysqld as root. 2. ... |
|  6 | MySQL Security        | When configured properly, MySQL ... |
+----+-----------------------+-------------------------------------+
```

Nota

Na implementação deste recurso, o MySQL usa o que é algumas vezes referido como lógica Boolean implícita, na qual:

* `+` significa `AND`
* `-` significa `NOT`
* [*sem operador*] implica `OR`

Buscas full-text booleanas têm estas características:

* Elas não ordenam automaticamente as rows em ordem decrescente de relevância.

* Tabelas `InnoDB` exigem um `FULLTEXT` Index em todas as columns da expressão `MATCH()` para executar queries booleanas. Queries booleanas contra um Search Index `MyISAM` podem funcionar mesmo sem um `FULLTEXT` Index, embora uma busca executada dessa maneira seja bastante lenta.

* Os parâmetros full-text de comprimento mínimo e máximo de palavra aplicam-se a Indexes `FULLTEXT` criados usando o Parser `FULLTEXT` embutido e o plugin Parser MeCab. `innodb_ft_min_token_size` e `innodb_ft_max_token_size` são usados para Search Indexes `InnoDB`. `ft_min_word_len` e `ft_max_word_len` são usados para Search Indexes `MyISAM`.

  Os parâmetros full-text de comprimento mínimo e máximo de palavra não se aplicam a Indexes `FULLTEXT` criados usando o Parser ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

* A lista de stopwords se aplica, controlada por `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para Search Indexes `InnoDB`, e `ft_stopword_file` para os `MyISAM`.

* A busca full-text `InnoDB` não suporta o uso de múltiplos operadores em uma única palavra de busca, como neste exemplo: `'++apple'`. O uso de múltiplos operadores em uma única palavra de busca retorna um Syntax Error para o standard out. A busca full-text MyISAM processa essa mesma busca com sucesso, ignorando todos os operadores, exceto o operador imediatamente adjacente à palavra de busca.

* A busca full-text `InnoDB` suporta apenas sinais de mais ou menos à esquerda (leading). Por exemplo, `InnoDB` suporta `'+apple'` mas não suporta `'apple+'`. A especificação de um sinal de mais ou menos à direita (trailing) faz com que `InnoDB` relate um Syntax Error.

* A busca full-text `InnoDB` não suporta o uso de um sinal de mais à esquerda com wildcard (`'+*'`), uma combinação de sinais de mais e menos (`'+-'`), ou a combinação de sinais de mais e menos à esquerda (`'+-apple'`). Essas Queries inválidas retornam um Syntax Error.

* A busca full-text `InnoDB` não suporta o uso do símbolo `@` em buscas full-text booleanas. O símbolo `@` é reservado para uso pelo operador de busca de proximidade `@distance`.

* Elas não usam o limite de 50% (50% threshold) que se aplica aos Search Indexes `MyISAM`.

A capacidade de busca full-text booleana suporta os seguintes operadores:

* `+`

  Um sinal de mais à esquerda (leading) ou à direita (trailing) indica que esta palavra *deve* estar presente em cada row que é retornada. `InnoDB` suporta apenas sinais de mais à esquerda.

* `-`

  Um sinal de menos à esquerda (leading) ou à direita (trailing) indica que esta palavra *não* deve estar presente em nenhuma das rows que são retornadas. `InnoDB` suporta apenas sinais de menos à esquerda.

  Nota: O operador `-` atua apenas para excluir rows que seriam, de outra forma, correspondidas por outros termos de busca. Assim, uma busca em modo booleano que contém apenas termos precedidos por `-` retorna um resultado vazio. Ela não retorna “todas as rows, exceto aquelas que contêm qualquer um dos termos excluídos.”

* (sem operador)

  Por padrão (quando nem `+` nem `-` é especificado), a palavra é opcional, mas as rows que a contêm são classificadas como mais relevantes (rated higher). Isso imita o comportamento de `MATCH() AGAINST()` sem o modificador `IN BOOLEAN MODE`.

* `@distance`

  Este operador funciona apenas em tabelas `InnoDB`. Ele testa se duas ou mais palavras começam dentro de uma distância especificada uma da outra, medida em palavras. Especifique as palavras de busca dentro de uma string entre aspas duplas imediatamente antes do operador `@distance`, por exemplo, `MATCH(col1) AGAINST('"word1 word2 word3" @8' IN BOOLEAN MODE)`

* `> <`

  Estes dois operadores são usados para alterar a contribuição de uma palavra para o valor de relevância que é atribuído a uma row. O operador `>` aumenta a contribuição e o operador `<` a diminui. Consulte o exemplo após esta lista.

* `( )`

  Parênteses agrupam palavras em subexpressões. Grupos entre parênteses podem ser aninhados.

* `~`

  Um til à esquerda (leading) atua como um operador de negação, fazendo com que a contribuição da palavra para a relevância da row seja negativa. Isso é útil para marcar palavras “noise” (ruído). Uma row contendo tal palavra é classificada como menos relevante (rated lower) do que outras, mas não é excluída completamente, como aconteceria com o operador `-`.

* `*`

  O asterisco serve como operador de truncamento (ou wildcard). Diferentemente dos outros operadores, ele é *anexado* à palavra a ser afetada. O match ocorre se as palavras começarem com a palavra que precede o operador `*`.

  Se uma palavra for especificada com o operador de truncamento, ela não é removida de uma Query booleana, mesmo que seja muito curta ou uma stopword. Se uma palavra é muito curta é determinado pela configuração `innodb_ft_min_token_size` para tabelas `InnoDB`, ou `ft_min_word_len` para tabelas `MyISAM`. Essas opções não são aplicáveis a Indexes `FULLTEXT` que usam o Parser ngram.

  A palavra com wildcard é considerada um prefixo que deve estar presente no início de uma ou mais palavras. Se o comprimento mínimo da palavra for 4, uma busca por `'+word +the*'` pode retornar menos rows do que uma busca por `'+word +the'`, porque a segunda Query ignora o termo de busca muito curto `the`.

* `"`

  Uma frase que é delimitada por aspas duplas (`"`) corresponde apenas a rows que contêm a frase *literalmente, como foi digitada*. O motor full-text divide a frase em palavras e executa uma busca no `FULLTEXT` Index pelas palavras. Caracteres que não são palavras não precisam ser correspondidos exatamente: a busca de frase exige apenas que os matches contenham exatamente as mesmas palavras da frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`.

  Se a frase não contiver palavras que estão no Index, o resultado é vazio. As palavras podem não estar no Index devido a uma combinação de fatores: se elas não existirem no texto, se forem stopwords, ou se forem mais curtas que o comprimento mínimo das palavras indexadas.

Os exemplos a seguir demonstram algumas strings de busca que usam operadores full-text booleanos:

* `'apple banana'`

  Encontra rows que contêm pelo menos uma das duas palavras.

* `'+apple +juice'`

  Encontra rows que contêm ambas as palavras.

* `'+apple macintosh'`

  Encontra rows que contêm a palavra “apple”, mas classifica as rows mais alto (rank rows higher) se elas também contiverem “macintosh”.

* `'+apple -macintosh'`

  Encontra rows que contêm a palavra “apple” mas não “macintosh”.

* `'+apple ~macintosh'`

  Encontra rows que contêm a palavra “apple”, mas se a row também contiver a palavra “macintosh”, classifica-a como menos relevante (rate it lower) do que se a row não a contivesse. Isso é "mais suave" do que uma busca por `'+apple -macintosh'`, na qual a presença de “macintosh” faz com que a row não seja retornada de forma alguma.

* `'+apple +(>turnover <strudel)'`

  Encontra rows que contêm as palavras “apple” e “turnover”, ou “apple” e “strudel” (em qualquer ordem), mas classifica “apple turnover” mais alto (rank higher) do que “apple strudel”.

* `'apple*'`

  Encontra rows que contêm palavras como “apple”, “apples”, “applesauce” ou “applet”.

* `'"some words"'`

  Encontra rows que contêm a frase exata “some words” (por exemplo, rows que contêm “some words of wisdom” mas não “some noise words”). Observe que os caracteres `"` que delimitam a frase são caracteres de operador que delimitam a frase. Eles não são as aspas que delimitam a própria string de busca.

#### Classificações de Relevância para Busca InnoDB em Modo Booleano

A busca full-text `InnoDB` é modelada com base no motor de busca full-text Sphinx, e os algoritmos usados são baseados nos algoritmos de ranking BM25 e TF-IDF. Por estas razões, as classificações de relevância (relevancy rankings) para buscas full-text booleanas `InnoDB` podem diferir das classificações de relevância `MyISAM`.

O `InnoDB` usa uma variação do sistema de ponderação "term frequency-inverse document frequency" (`TF-IDF`) para classificar a relevância de um documento para uma dada Query de busca full-text. A ponderação `TF-IDF` é baseada na frequência com que uma palavra aparece em um documento, compensada pela frequência com que a palavra aparece em todos os documentos na coleção. Em outras palavras, quanto mais frequentemente uma palavra aparece em um documento, e quanto menos frequentemente a palavra aparece na coleção de documentos, mais alto o documento é classificado (ranked).

##### Como a Classificação de Relevância é Calculada

O valor da frequência do termo (`TF`, *term frequency*) é o número de vezes que uma palavra aparece em um documento. O valor da frequência inversa do documento (`IDF`, *inverse document frequency*) de uma palavra é calculado usando a seguinte fórmula, onde `total_records` é o número de records na coleção, e `matching_records` é o número de records nos quais o termo de busca aparece.

```sql
${IDF} = log10( ${total_records} / ${matching_records} )
```

Quando um documento contém uma palavra múltiplas vezes, o valor IDF é multiplicado pelo valor TF:

```sql
${TF} * ${IDF}
```

Usando os valores `TF` e `IDF`, a classificação de relevância (relevancy ranking) para um documento é calculada usando esta fórmula:

```sql
${rank} = ${TF} * ${IDF} * ${IDF}
```

A fórmula é demonstrada nos exemplos a seguir.

##### Classificação de Relevância para Busca de Palavra Única

Este exemplo demonstra o cálculo da classificação de relevância para uma busca de palavra única.

```sql
mysql> CREATE TABLE articles (
    ->   id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    ->   title VARCHAR(200),
    ->   body TEXT,
    ->   FULLTEXT (title,body)
    ->)  ENGINE=InnoDB;
Query OK, 0 rows affected (1.04 sec)

mysql> INSERT INTO articles (title,body) VALUES
    ->   ('MySQL Tutorial','This database tutorial ...'),
    ->   ("How To Use MySQL",'After you went through a ...'),
    ->   ('Optimizing Your Database','In this database tutorial ...'),
    ->   ('MySQL vs. YourSQL','When comparing databases ...'),
    ->   ('MySQL Security','When configured properly, MySQL ...'),
    ->   ('Database, Database, Database','database database database'),
    ->   ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
    ->   ('MySQL Full-Text Indexes', 'MySQL fulltext indexes use a ..');
Query OK, 8 rows affected (0.06 sec)
Records: 8  Duplicates: 0  Warnings: 0

mysql> SELECT id, title, body,
    ->   MATCH (title,body) AGAINST ('database' IN BOOLEAN MODE) AS score
    ->   FROM articles ORDER BY score DESC;
+----+------------------------------+-------------------------------------+---------------------+
| id | title                        | body                                | score               |
+----+------------------------------+-------------------------------------+---------------------+
|  6 | Database, Database, Database | database database database          |  1.0886961221694946 |
|  3 | Optimizing Your Database     | In this database tutorial ...       | 0.36289870738983154 |
|  1 | MySQL Tutorial               | This database tutorial ...          | 0.18144935369491577 |
|  2 | How To Use MySQL             | After you went through a ...        |                   0 |
|  4 | MySQL vs. YourSQL            | When comparing databases ...        |                   0 |
|  5 | MySQL Security               | When configured properly, MySQL ... |                   0 |
|  7 | 1001 MySQL Tricks            | 1. Never run mysqld as root. 2. ... |                   0 |
|  8 | MySQL Full-Text Indexes      | MySQL fulltext indexes use a ..     |                   0 |
+----+------------------------------+-------------------------------------+---------------------+
8 rows in set (0.00 sec)
```

Há 8 records no total, com 3 que correspondem ao termo de busca “database”. O primeiro record (`id 6`) contém o termo de busca 6 vezes e tem uma classificação de relevância (relevancy ranking) de `1.0886961221694946`. Este valor de ranking é calculado usando um valor `TF` de 6 (o termo de busca “database” aparece 6 vezes no record `id 6`) e um valor `IDF` de 0.42596873216370745, que é calculado da seguinte forma (onde 8 é o número total de records e 3 é o número de records nos quais o termo de busca aparece):

```sql
${IDF} = LOG10( 8 / 3 ) = 0.42596873216370745
```

Os valores `TF` e `IDF` são então inseridos na fórmula de ranking:

```sql
${rank} = ${TF} * ${IDF} * ${IDF}
```

A execução do cálculo no Command-Line Client do MySQL retorna um valor de ranking de 1.088696164686938.

```sql
mysql> SELECT 6*LOG10(8/3)*LOG10(8/3);
+-------------------------+
| 6*LOG10(8/3)*LOG10(8/3) |
+-------------------------+
|       1.088696164686938 |
+-------------------------+
1 row in set (0.00 sec)
```

Nota

Você pode notar uma pequena diferença nos valores de ranking retornados pela instrução `SELECT ... MATCH ... AGAINST` e pelo Command-Line Client do MySQL (`1.0886961221694946` versus `1.088696164686938`). A diferença deve-se à forma como as conversões (casts) entre integers e floats/doubles são realizadas internamente pelo `InnoDB` (juntamente com decisões relacionadas de precisão e arredondamento), e como elas são realizadas em outros locais, como no Command-Line Client do MySQL ou em outros tipos de calculadoras.

##### Classificação de Relevância para Busca de Múltiplas Palavras

Este exemplo demonstra o cálculo da classificação de relevância para uma busca full-text de múltiplas palavras com base na tabela `articles` e nos dados usados no exemplo anterior.

Se você buscar por mais de uma palavra, o valor da classificação de relevância (relevancy ranking) é a soma dos valores de classificação de relevância para cada palavra, conforme mostrado nesta fórmula:

```sql
${rank} = ${TF} * ${IDF} * ${IDF} + ${TF} * ${IDF} * ${IDF}
```

A execução de uma busca em dois termos ('mysql tutorial') retorna os seguintes resultados:

```sql
mysql> SELECT id, title, body, MATCH (title,body)
    ->   AGAINST ('mysql tutorial' IN BOOLEAN MODE) AS score
    ->   FROM articles ORDER BY score DESC;
+----+------------------------------+-------------------------------------+----------------------+
| id | title                        | body                                | score                |
+----+------------------------------+-------------------------------------+----------------------+
|  1 | MySQL Tutorial               | This database tutorial ...          |   0.7405621409416199 |
|  3 | Optimizing Your Database     | In this database tutorial ...       |   0.3624762296676636 |
|  5 | MySQL Security               | When configured properly, MySQL ... | 0.031219376251101494 |
|  8 | MySQL Full-Text Indexes      | MySQL fulltext indexes use a ..     | 0.031219376251101494 |
|  2 | How To Use MySQL             | After you went through a ...        | 0.015609688125550747 |
|  4 | MySQL vs. YourSQL            | When comparing databases ...        | 0.015609688125550747 |
|  7 | 1001 MySQL Tricks            | 1. Never run mysqld as root. 2. ... | 0.015609688125550747 |
|  6 | Database, Database, Database | database database database          |                    0 |
+----+------------------------------+-------------------------------------+----------------------+
8 rows in set (0.00 sec)
```

No primeiro record (`id 8`), 'mysql' aparece uma vez e 'tutorial' aparece duas vezes. Existem seis records de match para 'mysql' e dois records de match para 'tutorial'. O Command-Line Client do MySQL retorna o valor de ranking esperado ao inserir esses valores na fórmula de ranking para uma busca de múltiplas palavras:

```sql
mysql> SELECT (1*log10(8/6)*log10(8/6)) + (2*log10(8/2)*log10(8/2));
+-------------------------------------------------------+
| (1*log10(8/6)*log10(8/6)) + (2*log10(8/2)*log10(8/2)) |
+-------------------------------------------------------+
|                                    0.7405621541938003 |
+-------------------------------------------------------+
1 row in set (0.00 sec)
```

Nota

A pequena diferença nos valores de ranking retornados pela instrução `SELECT ... MATCH ... AGAINST` e pelo Command-Line Client do MySQL é explicada no exemplo anterior.
