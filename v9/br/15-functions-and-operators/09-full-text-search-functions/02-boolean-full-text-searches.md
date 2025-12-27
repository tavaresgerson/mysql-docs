### 14.9.2 Pesquisas de Texto Completo Booleanas

O MySQL pode realizar pesquisas de texto completo booleanas usando o modificador `IN BOOLEAN MODE`. Com este modificador, certos caracteres têm um significado especial no início ou no final das palavras na string de pesquisa. Na seguinte consulta, os operadores `+` e `-` indicam que uma palavra deve estar presente ou ausente, respectivamente, para que uma correspondência ocorra. Assim, a consulta recupera todas as linhas que contêm a palavra “MySQL”, mas que *não* contêm a palavra “YourSQL”:

```
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

Observação

Ao implementar essa funcionalidade, o MySQL usa o que é às vezes referido como lógica booleana implícita, na qual

* `+` representa `AND`
* `-` representa `NOT`
* [*sem operador*] implica `OR`

As pesquisas de texto completo booleanas têm essas características:

* Elas não classificam automaticamente as linhas em ordem decrescente de relevância.

* As tabelas `InnoDB` requerem um índice `FULLTEXT` em todas as colunas da expressão `MATCH()` para realizar consultas booleanas. Consultas booleanas em um índice de pesquisa `MyISAM` podem funcionar mesmo sem um índice `FULLTEXT`, embora uma pesquisa executada dessa maneira seria bastante lenta.

* Os parâmetros de comprimento mínimo e máximo de palavra do texto completo se aplicam a índices `FULLTEXT` criados usando o parser `FULLTEXT` embutido e o plugin de parser MeCab. `innodb_ft_min_token_size` e `innodb_ft_max_token_size` são usados para índices de pesquisa `InnoDB`. `ft_min_word_len` e `ft_max_word_len` são usados para índices de pesquisa `MyISAM`.

* Os parâmetros de comprimento mínimo e máximo de palavra do texto completo não se aplicam a índices `FULLTEXT` criados usando o parser ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

* A lista de palavras-chave aplica-se, controlada por `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para índices de pesquisa full-text de `InnoDB`, e `ft_stopword_file` para os de `MyISAM`.

* A pesquisa full-text de `InnoDB` não suporta o uso de múltiplos operadores em uma única palavra de pesquisa, como neste exemplo: `'++apple'`. O uso de múltiplos operadores em uma única palavra de pesquisa retorna um erro de sintaxe para a saída padrão. A pesquisa full-text de `MyISAM` processa com sucesso a mesma pesquisa, ignorando todos os operadores, exceto o operador imediatamente adjacente à palavra de pesquisa.

* A pesquisa full-text de `InnoDB` só suporta sinais de mais ou menos no início ou no final. Por exemplo, `InnoDB` suporta `'+apple'` mas não suporta `'apple+'`. Especificar um sinal de mais ou menos no final causa um erro de sintaxe na `InnoDB`.

* A pesquisa full-text de `InnoDB` não suporta o uso de um sinal de mais no início com um caractere curinga (`'+*'`), uma combinação de sinal de mais e menos (`'+-'`) ou um sinal de mais e menos no início (`'+-apple'`). Essas consultas inválidas retornam um erro de sintaxe.

* A pesquisa full-text de `InnoDB` não suporta o uso do símbolo `@` em pesquisas full-text booleanas. O símbolo `@` é reservado para uso pelo operador de pesquisa de proximidade `@distance`.

* Eles não usam o limiar de 50% que se aplica aos índices de pesquisa de `MyISAM`.

A capacidade de pesquisa full-text booleana suporta os seguintes operadores:

* `+`

  Um sinal de mais no início ou no final indica que essa palavra *deve* estar presente em cada linha que é retornada. A `InnoDB` só suporta sinais de mais no início.

* `-`

  Um sinal de menos no início ou no final indica que essa palavra *não* deve estar presente em nenhuma das linhas que são retornadas. A `InnoDB` só suporta sinais de menos no início.

Nota: O operador `-` atua apenas para excluir linhas que, de outra forma, sejam correspondidas por outros termos de busca. Assim, uma busca em modo booleano que contenha apenas termos precedidos por `-` retorna um resultado vazio. Não retorna "todas as linhas exceto aquelas que contenham algum dos termos excluídos".

* (sem operador)

  Por padrão (quando nem `+` nem `-` é especificado), a palavra é opcional, mas as linhas que a contêm são classificadas como mais relevantes. Isso imita o comportamento de `MATCH() AGAINST()` sem o modificador `IN BOOLEAN MODE`.

* `@distance`

  Este operador funciona apenas em tabelas `InnoDB`. Testa se duas ou mais palavras começam todas dentro de uma distância especificada uma da outra, medida em palavras. Especifique as palavras de busca dentro de uma string entre aspas imediatamente antes do operador `@distance`, por exemplo, `MATCH(col1) AGAINST('"word1 word2 word3" @8' IN BOOLEAN MODE)`

* `> <`

  Esses dois operadores são usados para alterar a contribuição de uma palavra para o valor de relevância atribuído a uma linha. O operador `>` aumenta a contribuição e o operador `<` a diminui. Veja o exemplo que segue esta lista.

* `( )`

  Os parênteses agrupam palavras em subexpressões. Grupos entre parênteses podem ser aninhados.

* `~`

  Um tilde inicial atua como um operador de negação, fazendo com que a contribuição da palavra para a relevância da linha seja negativa. Isso é útil para marcar palavras de "ruído". Uma linha que contém tal palavra é classificada como menos relevante do que outras, mas não é excluída completamente, como seria com o operador `-`.

* `*`

  O asterisco serve como operador de truncação (ou wildcard). Ao contrário dos outros operadores, ele é *após* a palavra afetada. Palavras correspondem se começam com a palavra que precede o operador `*`.

Se uma palavra for especificada com o operador de truncação, ela não será removida de uma consulta booleana, mesmo que seja muito curta ou um termo não indexado. Se uma palavra é muito curta, isso é determinado pelo ajuste `innodb_ft_min_token_size` para tabelas `InnoDB`, ou `ft_min_word_len` para tabelas `MyISAM`. Essas opções não são aplicáveis a índices `FULLTEXT` que usam o analisador ngram.

A palavra com asterisco é considerada como um prefixo que deve estar presente no início de uma ou mais palavras. Se o comprimento mínimo da palavra for de 4, uma pesquisa por `'+palavra +o*'` pode retornar menos linhas do que uma pesquisa por `'+palavra +o'`, porque a segunda consulta ignora o termo de pesquisa muito curto `o`.

* `"`

  Uma frase que está entre aspas (`"`) corresponde apenas a linhas que contêm a frase *literalmente, como foi digitada*. O mecanismo de texto completo divide a frase em palavras e realiza uma pesquisa no índice `FULLTEXT` pelas palavras. Caracteres não-palavras não precisam ser correspondidos exatamente: a pesquisa de frase exige apenas que as correspondências contenham exatamente as mesmas palavras que a frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`.

  Se a frase não contiver palavras que estejam no índice, o resultado será vazio. As palavras podem não estar no índice devido a uma combinação de fatores: se não existem no texto, são termos não indexados ou são mais curtas que o comprimento mínimo das palavras indexadas.

Os seguintes exemplos demonstram algumas cadeias de pesquisa que usam operadores booleanos de texto completo:

* `'apple banana'`

  Encontrar linhas que contenham pelo menos uma das duas palavras.

* `'+apple +juice'`

  Encontrar linhas que contenham ambas as palavras.

* `'+apple macintosh'`

  Encontrar linhas que contenham a palavra “apple”, mas classificar as linhas mais altas se também contiverem “macintosh”.

* `'+apple -macintosh'`

Encontre linhas que contenham a palavra “maçã”, mas não “maçã McIntosh”.

* `'+apple ~macintosh'`

  Encontre linhas que contenham a palavra “maçã”, mas se a linha também contiver a palavra “maçã McIntosh”, classifique-a como menos relevante do que se a linha não contiver. Isso é “mais suave” do que uma busca por `'+apple -macintosh'`, para a qual a presença de “maçã McIntosh” faz com que a linha não seja exibida.

* `'+apple +(>turnover <strudel)'`

  Encontre linhas que contenham as palavras “maçã” e “turnover” ou “maçã” e “strudel” (em qualquer ordem), mas classifique “turnover de maçã” como mais relevante do que “strudel de maçã”.

* `'apple*'`

  Encontre linhas que contenham palavras como “maçã”, “maçãs”, “pureia de maçã” ou “maçã”.

* `'"algumas palavras"'`

  Encontre linhas que contenham a frase exata “algumas palavras” (por exemplo, linhas que contêm “algumas palavras de sabedoria”, mas não “algumas palavras de ruído”). Note que os caracteres `"` que encerram a frase são caracteres operadores que delimitam a frase. Eles não são as aspas que encerram a própria string de busca.

#### Classificações de Relevância para Busca de Booleano no Modo InnoDB

A busca de texto completo `InnoDB` é modelada pelo motor de busca de texto completo Sphinx, e os algoritmos usados são baseados nos algoritmos de classificação BM25 e TF-IDF. Por essas razões, as classificações de relevância para a busca de texto completo booleano `InnoDB` podem diferir das classificações de relevância de `MyISAM`.

O `InnoDB` usa uma variação do sistema de ponderação "frequência de termos - frequência inversa de documento" (`TF-IDF`) para classificar a relevância de um documento para uma consulta de pesquisa de texto completo dada. A ponderação `TF-IDF` é baseada na frequência com que uma palavra aparece em um documento, compensada pela frequência com que a palavra aparece em todos os documentos da coleção. Em outras palavras, quanto mais frequentemente uma palavra aparece em um documento e menos frequentemente a palavra aparece na coleção de documentos, mais alto o documento é classificado.

##### Como o Ranking de Relevância é Calculado

O valor de frequência de termos (`TF`) é o número de vezes que uma palavra aparece em um documento. O valor de frequência inversa de documento (`IDF`) de uma palavra é calculado usando a seguinte fórmula, onde `total_records` é o número de registros na coleção e `matching_records` é o número de registros em que o termo de busca aparece.

```
${IDF} = log10( ${total_records} / ${matching_records} )
```

Quando um documento contém uma palavra várias vezes, o valor de IDF é multiplicado pelo valor de TF:

```
${TF} * ${IDF}
```

Usando os valores de `TF` e `IDF`, o ranking de relevância para um documento é calculado usando a seguinte fórmula:

```
${rank} = ${TF} * ${IDF} * ${IDF}
```

A fórmula é demonstrada nos exemplos seguintes.

##### Ranking de Relevância para uma Busca de Palavra Única

Este exemplo demonstra o cálculo do ranking de relevância para uma busca de palavra única.

```
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

Há um total de 8 registros, com 3 que correspondem ao termo de busca “banco de dados”. O primeiro registro (`id 6`) contém o termo de busca 6 vezes e tem um ranking de relevância de `1.0886961221694946`. Esse valor de classificação é calculado usando um valor de `TF` de 6 (o termo de busca “banco de dados” aparece 6 vezes no registro `id 6`) e um valor de `IDF` de 0,42596873216370745, que é calculado da seguinte forma (onde 8 é o número total de registros e 3 é o número de registros em que o termo de busca aparece):

```
${IDF} = LOG10( 8 / 3 ) = 0.42596873216370745
```

Os valores de `TF` e `IDF` são então inseridos na fórmula de classificação:

```
${rank} = ${TF} * ${IDF} * ${IDF}
```

Realizar o cálculo no cliente de linha de comando do MySQL retorna um valor de classificação de 1.088696164686938.

```
mysql> SELECT 6*LOG10(8/3)*LOG10(8/3);
+-------------------------+
| 6*LOG10(8/3)*LOG10(8/3) |
+-------------------------+
|       1.088696164686938 |
+-------------------------+
1 row in set (0.00 sec)
```

Nota

Você pode notar uma pequena diferença nos valores de classificação retornados pela declaração `SELECT ... MATCH ... AGAINST` e pelo cliente de linha de comando do MySQL (`1.0886961221694946` versus `1.088696164686938`). A diferença é devido à forma como os tipos de dados inteiros e flutuantes/dobles são convertidos internamente pelo `InnoDB` (junto com decisões relacionadas à precisão e arredondamento), e como eles são realizados em outros lugares, como no cliente de linha de comando do MySQL ou em outros tipos de calculadoras.

##### Ranking de Relevância para uma Busca de Palavras Múltiplas

Este exemplo demonstra o cálculo do ranking de relevância para uma busca de texto completo de múltiplas palavras com base na tabela `articles` e nos dados usados no exemplo anterior.

Se você pesquisar em mais de uma palavra, o valor do ranking de relevância é uma soma do valor do ranking de relevância para cada palavra, conforme mostrado nesta fórmula:

```
${rank} = ${TF} * ${IDF} * ${IDF} + ${TF} * ${IDF} * ${IDF}
```

Realizar uma pesquisa em dois termos ('mysql tutorial') retorna os seguintes resultados:

```
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
```FNKWa7Sg0X```

Nota

A pequena diferença nos valores de classificação retornados pela instrução `SELECT ... MATCH ... AGAINST` e pelo cliente de linha de comando MySQL é explicada no exemplo anterior.