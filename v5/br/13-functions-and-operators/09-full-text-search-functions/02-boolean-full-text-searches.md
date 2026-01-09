### 12.9.2 Pesquisas de Texto Completas Booleanas

O MySQL pode realizar pesquisas de texto completo booleanas usando o modificador `IN BOOLEAN MODE`. Com este modificador, certos caracteres têm um significado especial no início ou no final das palavras na string de pesquisa. Na seguinte consulta, os operadores `+` e `-` indicam que uma palavra deve estar presente ou ausente, respectivamente, para que uma correspondência ocorra. Assim, a consulta recupera todas as linhas que contêm a palavra “MySQL”, mas que *não* contêm a palavra “YourSQL”:

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

Ao implementar essa funcionalidade, o MySQL utiliza o que é às vezes chamado de lógica booleana implícita, na qual

- `+` representa `E`
- `-` representa `NOT`
- [*sem operador*] implica em `OU`

As pesquisas de texto completo booleanas têm essas características:

- Eles não classificam automaticamente as linhas em ordem decrescente de relevância.

- As tabelas `InnoDB` exigem um índice `FULLTEXT` em todas as colunas da expressão `MATCH()` para realizar consultas booleanas. Consultas booleanas em um índice de pesquisa `MyISAM` podem funcionar mesmo sem um índice `FULLTEXT`, embora uma pesquisa executada dessa maneira seja bastante lenta.

- Os parâmetros de comprimento mínimo e máximo de palavras para o texto completo se aplicam aos índices `FULLTEXT` criados usando o analisador `FULLTEXT` integrado e o plugin de analisador MeCab. `innodb_ft_min_token_size` e `innodb_ft_max_token_size` são usados para índices de pesquisa `InnoDB`. `ft_min_word_len` e `ft_max_word_len` são usados para índices de pesquisa `MyISAM`.

  Os parâmetros de comprimento mínimo e máximo de palavras para o texto completo não se aplicam aos índices `FULLTEXT` criados usando o analisador ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

- A lista de palavras-chave aplica-se, controlada por `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para índices de pesquisa `InnoDB`, e `ft_stopword_file` para os de `MyISAM`.

- A pesquisa de texto completo do `InnoDB` não suporta o uso de múltiplos operadores em uma única palavra de busca, como neste exemplo: `'++apple'`. O uso de múltiplos operadores em uma única palavra de busca retorna um erro sintático para a saída padrão. A pesquisa de texto completo do MyISAM processa com sucesso a mesma pesquisa, ignorando todos os operadores, exceto o operador imediatamente adjacente à palavra de busca.

- A pesquisa de texto completo do `InnoDB` só suporta sinais de mais ou menos no início. Por exemplo, o `InnoDB` suporta `'+apple'` mas não suporta `'apple+'`. Especificar um sinal de mais ou menos no final faz com que o `InnoDB` informe um erro de sintaxe.

- A pesquisa de texto completo do `InnoDB` não suporta o uso de um sinal mais no início com um caractere curinga (`'+*'`), uma combinação de sinal mais e menos (`'+-'`) ou um sinal mais e menos no início (`'+-apple'`). Essas consultas inválidas retornam um erro de sintaxe.

- A pesquisa de texto completo do InnoDB não suporta o uso do símbolo `@` em pesquisas de texto completo booleanas. O símbolo `@` é reservado para uso pelo operador de proximidade `@distance`.

- Eles não usam o limiar de 50% que se aplica aos índices de pesquisa `MyISAM`.

A capacidade de busca de texto completo booleano suporta os seguintes operadores:

- `+`

  Um sinal de mais no início ou no final indica que essa palavra *deve* estar presente em cada linha que é retornada. O `InnoDB` só suporta sinais de mais no início.

- `-`

  Um sinal de menos no início ou no final indica que essa palavra *não* deve estar presente em nenhuma das linhas retornadas. O `InnoDB` só suporta sinais de menos no início.

  Observação: O operador `-` atua apenas para excluir linhas que, de outra forma, sejam correspondidas por outros termos de pesquisa. Assim, uma pesquisa em modo lógico que contenha apenas termos precedidos por `-` retornará um resultado vazio. Não retornará “todas as linhas, exceto aquelas que contenham algum dos termos excluídos”.

- (sem operador)

  Por padrão (quando nem `+` nem `-` é especificado), a palavra é opcional, mas as linhas que a contêm são classificadas como melhores. Isso imita o comportamento de `MATCH() AGAINST()` sem o modificador `IN BOOLEAN MODE`.

- @distance

  Este operador funciona apenas em tabelas `InnoDB`. Ele testa se duas ou mais palavras começam todas dentro de uma distância especificada uma da outra, medida em palavras. Especifique as palavras de busca dentro de uma string entre aspas imediatamente antes do operador `@distance`, por exemplo, `MATCH(col1) CONTRA(`palavra1 palavra2 palavra3" @8' EM MODO VERDADEIRO)\`

- `> <`

  Esses dois operadores são usados para alterar a contribuição de uma palavra para o valor de relevância atribuído a uma linha. O operador `>` aumenta a contribuição e o operador `<` a diminui. Veja o exemplo que segue essa lista.

- `( )`

  As parênteses agrupam as palavras em subexpressões. Os grupos entre parênteses podem ser aninhados.

- `~`

  Uma tilde principal atua como um operador de negação, fazendo com que a contribuição da palavra para a relevância da linha seja negativa. Isso é útil para marcar palavras de "ruído". Uma linha que contém tal palavra é avaliada de forma mais baixa do que outras, mas não é excluída completamente, como seria com o operador `-`.

- `*`

  O asterisco serve como operador de truncação (ou caractere curinga). Ao contrário dos outros operadores, ele é *após* a palavra afetada. As palavras correspondem se começam com a palavra que precede o operador `*`.

  Se uma palavra for especificada com o operador de truncação, ela não será removida de uma consulta booleana, mesmo que seja muito curta ou um termo comum. Se uma palavra é considerada muito curta, isso é determinado pelo ajuste `innodb_ft_min_token_size` para tabelas `InnoDB`, ou `ft_min_word_len` para tabelas `MyISAM`. Essas opções não são aplicáveis a índices `FULLTEXT` que usam o analisador de ngram.

  A palavra com wildcard é considerada um prefixo que deve estar presente no início de uma ou mais palavras. Se o comprimento mínimo da palavra for de 4, uma pesquisa por `'+word +the*'` pode retornar menos linhas do que uma pesquisa por `'+word +the'`, porque a segunda consulta ignora o termo de busca muito curto `the`.

- `"`

  Uma frase que está entre aspas duplas (`"`) corresponde apenas às linhas que contêm a frase *literalmente, como foi digitada*. O mecanismo de pesquisa de texto completo divide a frase em palavras e realiza uma pesquisa no índice `FULLTEXT` pelas palavras. Os caracteres não-palavras não precisam ser correspondidos exatamente: a pesquisa de frase exige apenas que as correspondências contenham exatamente as mesmas palavras que a frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`.

  Se a frase não contiver palavras no índice, o resultado será vazio. As palavras podem não estar no índice devido a uma combinação de fatores: se não existem no texto, são palavras-chave ou são mais curtas que o comprimento mínimo das palavras indexadas.

Os exemplos a seguir demonstram algumas cadeias de busca que utilizam operadores booleanos de texto completo:

- ‘maçã banana’

  Encontre linhas que contenham pelo menos uma das duas palavras.

- `'+ suco de maçã'`

  Encontre linhas que contenham ambas as palavras.

- `'+apple macintosh'`

  Encontre linhas que contenham a palavra “maçã”, mas classifique as linhas com maior prioridade se elas também contiverem “maçã McIntosh”.

- `'+apple -macintosh'`

  Encontre linhas que contenham a palavra “maçã”, mas não “maçã McIntosh”.

- `'+apple ~macintosh'`

  Encontre linhas que contenham a palavra “maçã”, mas se a linha também contiver a palavra “maçã McIntosh”, classifique-a como menos importante do que se a linha não contiver essa palavra. Isso é “mais suave” do que uma busca por `'+apple -macintosh'`, para a qual a presença de “maçã McIntosh” faz com que a linha não seja exibida.

- `'+apple +(>turnover <strudel)'`

  Encontre linhas que contenham as palavras “maçã” e “vendas totais”, ou “maçã” e “strudel” (em qualquer ordem), mas classifique “vendas totais da maçã” como mais importante do que “strudel de maçã”.

- `'apple*'`

  Encontre linhas que contenham palavras como “maçã”, “maçãs”, “purea de maçã” ou “maçã”.

- `"algumas palavras"`

  Encontre linhas que contenham a frase exata “algumas palavras” (por exemplo, linhas que contenham “algumas palavras de sabedoria”, mas não “algumas palavras de barulho”). Observe que os caracteres `"` que encerram a frase são caracteres operadores que delimitam a frase. Eles não são as aspas que encerram a própria string de pesquisa.

#### Classificações de relevância para a pesquisa de modo booleano do InnoDB

A pesquisa de texto completo do `InnoDB` é modelada pelo motor de busca de texto completo Sphinx, e os algoritmos utilizados são baseados nos algoritmos de classificação BM25 e TF-IDF. Por essas razões, as classificações de relevância para a pesquisa de texto completo booleana do `InnoDB` podem diferir das classificações de relevância do `MyISAM`.

O `InnoDB` utiliza uma variação do sistema de ponderação "frequência de termos - frequência inversa de documentos" (`TF-IDF`) para classificar a relevância de um documento para uma consulta de pesquisa de texto completo dada. A ponderação `TF-IDF` é baseada na frequência com que uma palavra aparece em um documento, compensada pela frequência com que a palavra aparece em todos os documentos da coleção. Em outras palavras, quanto mais frequentemente uma palavra aparece em um documento e menos frequentemente ela aparece na coleção de documentos, mais alto o documento é classificado.

##### Como o Ranking de Relevância é Calculado

O valor da frequência de termos (`TF`) é o número de vezes que uma palavra aparece em um documento. O valor da frequência inversa de documentos (`IDF`) de uma palavra é calculado usando a seguinte fórmula, onde `total_records` é o número de registros na coleção e `matching_records` é o número de registros em que o termo de busca aparece.

```sql
${IDF} = log10( ${total_records} / ${matching_records} )
```

Quando um documento contém uma palavra várias vezes, o valor IDF é multiplicado pelo valor TF:

```sql
${TF} * ${IDF}
```

Usando os valores de `TF` e `IDF`, o ranking de relevância para um documento é calculado usando esta fórmula:

```sql
${rank} = ${TF} * ${IDF} * ${IDF}
```

A fórmula é demonstrada nos exemplos a seguir.

##### Ranking de relevância para uma busca por uma única palavra

Este exemplo demonstra o cálculo do ranking de relevância para uma pesquisa de uma palavra.

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

Existem 8 registros no total, com 3 que correspondem ao termo de busca “banco de dados”. O primeiro registro (`id 6`) contém o termo de busca 6 vezes e tem um ranking de relevância de `1.0886961221694946`. Esse valor de classificação é calculado usando um valor de `TF` de 6 (o termo de busca “banco de dados” aparece 6 vezes no registro `id 6`) e um valor de `IDF` de 0,42596873216370745, que é calculado da seguinte forma (onde 8 é o número total de registros e 3 é o número de registros em que o termo de busca aparece):

```sql
${IDF} = LOG10( 8 / 3 ) = 0.42596873216370745
```

Os valores de `TF` e `IDF` são então inseridos na fórmula de classificação:

```sql
${rank} = ${TF} * ${IDF} * ${IDF}
```

Ao realizar o cálculo no cliente de linha de comando do MySQL, o valor de classificação retornado é de 1,088696164686938.

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

Você pode notar uma pequena diferença nos valores de classificação retornados pela instrução `SELECT ... MATCH ... AGAINST` e pelo cliente de linha de comando do MySQL (`1.0886961221694946` versus `1.088696164686938`). A diferença ocorre devido à forma como os tipos de dados são convertidos entre inteiros e flutuantes/dobles internamente pelo `InnoDB` (junto com decisões relacionadas à precisão e arredondamento), e como isso é feito em outros lugares, como no cliente de linha de comando do MySQL ou em outros tipos de calculadoras.

##### Ranking de relevância para uma busca por múltiplas palavras

Este exemplo demonstra o cálculo do ranking de relevância para uma pesquisa de texto completo de várias palavras com base na tabela `articles` e nos dados usados no exemplo anterior.

Se você pesquisar em mais de uma palavra, o valor de classificação de relevância é a soma do valor de classificação de relevância para cada palavra, conforme mostrado nesta fórmula:

```sql
${rank} = ${TF} * ${IDF} * ${IDF} + ${TF} * ${IDF} * ${IDF}
```

Realizar uma pesquisa com dois termos ('tutorial de MySQL') retorna os seguintes resultados:

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

No primeiro registro (`id 8`), 'mysql' aparece uma vez e 'tutorial' aparece duas vezes. Existem seis registros correspondentes para 'mysql' e dois registros correspondentes para 'tutorial'. O cliente de linha de comando MySQL retorna o valor de classificação esperado ao inserir esses valores na fórmula de classificação para uma pesquisa de múltiplas palavras:

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

A pequena diferença nos valores de classificação retornados pela instrução `SELECT ... MATCH ... AGAINST` e pelo cliente de linha de comando do MySQL é explicada no exemplo anterior.
