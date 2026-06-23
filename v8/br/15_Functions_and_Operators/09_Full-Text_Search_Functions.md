## 14.9 Funções de pesquisa de texto completo

[`MATCH (col1,col2,...) AGAINST (expr [search_modifier])`](fulltext-search.html#function_match)

```
search_modifier:
  {
       IN NATURAL LANGUAGE MODE
     | IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
     | IN BOOLEAN MODE
     | WITH QUERY EXPANSION
  }
```

O MySQL tem suporte para indexação e busca de texto completo:

* Um índice de texto completo no MySQL é um índice do tipo `FULLTEXT`.

* Os índices de texto completo só podem ser usados com as tabelas `InnoDB` ou `MyISAM`, e só podem ser criados para as colunas `CHAR`, `VARCHAR` ou `TEXT`.

* O MySQL oferece um analisador de ngram de texto completo embutido que suporta chinês, japonês e coreano (CJK), e um plugin de analisador de texto completo MeCab instalável para japonês. As diferenças de análise são descritas na Seção 14.9.8, “Analisador de ngram de texto completo”, e na Seção 14.9.9, “Plugin de analisador de texto completo MeCab”.

* Uma definição do índice `FULLTEXT` pode ser dada na declaração `CREATE TABLE` quando uma tabela é criada, ou adicionada posteriormente usando `ALTER TABLE` ou `CREATE INDEX`.

* Para conjuntos de dados grandes, é muito mais rápido carregar seus dados em uma tabela que não tenha o índice `FULLTEXT` e, em seguida, criar o índice, do que carregar dados em uma tabela que tenha um índice existente `FULLTEXT`.

A pesquisa de texto completo é realizada usando a sintaxe `MATCH() AGAINST()`. `MATCH()` recebe uma lista separada por vírgula que nomeia as colunas a serem pesquisadas. `AGAINST` recebe uma string para pesquisar e um modificador opcional que indica que tipo de pesquisa deve ser realizada. A string de pesquisa deve ser um valor de string que é constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela porque isso pode diferir para cada linha.

Anteriormente, o MySQL permitia o uso de uma coluna de agregação com `MATCH()`, mas as consultas que empregavam essa construção apresentavam desempenho ruim e resultados não confiáveis. (Isso ocorre porque `MATCH()` não é implementado como uma função de seus argumentos, mas sim como uma função do ID da linha da linha atual na varredura subjacente da tabela base.) A partir do MySQL 8.0.28, o MySQL não permite mais tais consultas; mais especificamente, qualquer consulta que corresponda a todos os critérios listados aqui é rejeitada com `ER_FULLTEXT_WITH_ROLLUP`:

* `MATCH()` aparece na lista `SELECT`, cláusula `GROUP BY`, cláusula `HAVING` ou cláusula `ORDER BY` de um bloco de consulta.

* O bloco de consulta contém uma cláusula `GROUP BY ... WITH ROLLUP`.

* O argumento da chamada à função `MATCH()` é uma das colunas de agrupamento.

Alguns exemplos dessas consultas são mostrados aqui:

```
# MATCH() in SELECT list...
SELECT MATCH (a) AGAINST ('abc') FROM t GROUP BY a WITH ROLLUP;
SELECT 1 FROM t GROUP BY a, MATCH (a) AGAINST ('abc') WITH ROLLUP;

# ...in HAVING clause...
SELECT 1 FROM t GROUP BY a WITH ROLLUP HAVING MATCH (a) AGAINST ('abc');

# ...and in ORDER BY clause
SELECT 1 FROM t GROUP BY a WITH ROLLUP ORDER BY MATCH (a) AGAINST ('abc');
```

O uso de `MATCH()` com uma coluna de rolamento na cláusula `WHERE` é permitido.

Existem três tipos de pesquisas de texto completo:

* Uma pesquisa em linguagem natural interpreta a cadeia de busca como uma frase em linguagem humana natural (uma frase em texto livre). Não há operadores especiais, com exceção dos caracteres de aspas duplas ("). A lista de palavras-chave aplica-se. Para mais informações sobre listas de palavras-chave, consulte a Seção 14.9.4, "Palavras-chave de texto completo".

As pesquisas de texto completo são pesquisas em linguagem natural se o modificador `IN NATURAL LANGUAGE MODE` for fornecido ou se nenhum modificador for fornecido. Para mais informações, consulte a Seção 14.9.1, “Pesquisas de texto completo em linguagem natural”.

* Uma pesquisa booleana interpreta a string de pesquisa usando as regras de uma linguagem de consulta especial. A string contém as palavras a serem pesquisadas. Também pode conter operadores que especificam requisitos, como que uma palavra deve estar presente ou ausente em linhas correspondentes, ou que deve ser ponderada mais alta ou mais baixa do que o usual. Algumas palavras comuns (stopwords) são omitidas do índice de pesquisa e não correspondem se estiverem presentes na string de pesquisa. O modificador `IN BOOLEAN MODE` especifica uma pesquisa booleana. Para mais informações, consulte a Seção 14.9.2, “Pesquisas de Texto Completas Booleanas”.

* Uma pesquisa de expansão de consulta é uma modificação de uma pesquisa de linguagem natural. A string de pesquisa é usada para realizar uma pesquisa de linguagem natural. Em seguida, as palavras das linhas mais relevantes retornadas pela pesquisa são adicionadas à string de pesquisa e a pesquisa é realizada novamente. A consulta retorna as linhas da segunda pesquisa. O modificador `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` ou `WITH QUERY EXPANSION` especifica uma pesquisa de expansão de consulta. Para mais informações, consulte a Seção 14.9.3, “Pesquisas de Texto Completo com Expansão de Consulta”.

Para informações sobre o desempenho da consulta `FULLTEXT`, consulte a Seção 10.3.5, “Índices de Coluna”.

Para mais informações sobre os índices `InnoDB` `FULLTEXT`, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”.

As restrições para a pesquisa de texto completo estão listadas na Seção 14.9.5, “Restrições de texto completo”.

A ferramenta **myisam_ftdump** descarrega o conteúdo de um índice de texto completo `MyISAM`. Isso pode ser útil para depuração de consultas de texto completo. Veja a Seção 6.6.3, “myisam_ftdump — Exibir informações do índice de texto completo”.

### 14.9.1 Pesquisas de texto completo em linguagem natural

Por padrão ou com o modificador `IN NATURAL LANGUAGE MODE`, a função `MATCH()` realiza uma pesquisa de linguagem natural para uma string em uma coleção de texto. Uma coleção é um conjunto de uma ou mais colunas incluídas em um índice `FULLTEXT`. A string de pesquisa é dada como argumento para `AGAINST()`. Para cada linha na tabela, `MATCH()` retorna um valor de relevância; ou seja, uma medida de semelhança entre a string de pesquisa e o texto naquela linha nas colunas nomeadas na lista `MATCH()`.

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

Por padrão, a pesquisa é realizada de forma não sensível ao caso. Para realizar uma pesquisa de texto completo sensível ao caso, use uma ordenação sensível ao caso ou binária para as colunas indexadas. Por exemplo, uma coluna que usa o conjunto de caracteres `utf8mb4` pode ser atribuída uma ordenação de `utf8mb4_0900_as_cs` ou `utf8mb4_bin` para torná-la sensível ao caso para pesquisas de texto completo.

Quando o `MATCH()` é usado em uma cláusula `WHERE`, como no exemplo mostrado anteriormente, as linhas devolvidas são automaticamente ordenadas com a maior relevância em primeiro lugar, desde que as seguintes condições sejam atendidas:

* Não deve haver cláusula explícita `ORDER BY`.

* A pesquisa deve ser realizada usando uma varredura de índice de texto completo, em vez de uma varredura de tabela.

* Se a consulta fizer junção de tabelas, o índice de pesquisa de texto completo deve ser a tabela não constante mais à esquerda na junção.

Dadas as condições listadas acima, geralmente é menos esforço especificar o uso de `ORDER BY` para uma ordem de classificação explícita quando isso é necessário ou desejado.

Os valores de relevância são números de ponto flutuante não negativos. Zero relevância significa nenhuma semelhança. A relevância é calculada com base no número de palavras na linha (documento), no número de palavras únicas na linha, no número total de palavras na coleção e no número de linhas que contêm uma palavra específica.

Nota

O termo “documento” pode ser usado de forma intercambiável com o termo “linha”, e ambos os termos se referem à parte indexada da linha. O termo “coleção” se refere às colunas indexadas e engloba todas as linhas.

Para simplesmente contar partidas, você pode usar uma consulta como esta:

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

A primeira consulta realiza um trabalho adicional (ordenando os resultados por relevância), mas também pode usar uma pesquisa de índice com base na cláusula `WHERE`. A pesquisa de índice pode tornar a primeira consulta mais rápida se a pesquisa corresponder a poucas linhas. A segunda consulta realiza uma varredura completa da tabela, o que pode ser mais rápido do que a pesquisa de índice se o termo de busca estiver presente na maioria das linhas.

Para pesquisas de texto completo em linguagem natural, as colunas nomeadas na função `MATCH()` devem ser as mesmas colunas incluídas em algum índice `FULLTEXT` em sua tabela. Para a consulta anterior, observe que as colunas nomeadas na função `MATCH()` (`title` e `body`) são as mesmas que as nomeadas na definição do índice `article` da tabela `FULLTEXT`. Para pesquisar o `title` ou `body` separadamente, você criaria índices separados `FULLTEXT` para cada coluna.

Você também pode realizar uma pesquisa booleana ou uma pesquisa com expansão de consulta. Esses tipos de pesquisa são descritos na Seção 14.9.2, “Pesquisas de texto completo booleana”, e na Seção 14.9.3, “Pesquisas de texto completo com expansão de consulta”.

Uma pesquisa de texto completo que utiliza um índice pode nomear colunas apenas de uma única tabela na cláusula `MATCH()`, porque um índice não pode abranger múltiplas tabelas. Para as tabelas `MyISAM`, uma pesquisa booleana pode ser feita na ausência de um índice (embora de forma mais lenta), nesse caso, é possível nomear colunas de múltiplas tabelas.

O exemplo anterior é uma ilustração básica que mostra como usar a função `MATCH()`, onde as linhas são devolvidas em ordem de relevância decrescente. O próximo exemplo mostra como recuperar os valores de relevância explicitamente. As linhas devolvidas não estão ordenadas porque a declaração `SELECT` não inclui nem as cláusulas `WHERE` nem `ORDER BY`:

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

O exemplo a seguir é mais complexo. A consulta retorna os valores de relevância e também ordena as linhas em ordem decrescente de relevância. Para obter esse resultado, especifique `MATCH()` duas vezes: uma na lista `SELECT` e uma na cláusula `WHERE`. Isso não causa sobrecarga adicional, porque o otimizador do MySQL percebe que as duas chamadas de `MATCH()` são idênticas e invoca o código de pesquisa full-text apenas uma vez.

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

Uma frase que está encerrada entre aspas duplas (`"`) corresponde apenas às linhas que contêm a frase *literalmente, como foi digitada*. O motor de texto completo divide a frase em palavras e realiza uma pesquisa no índice `FULLTEXT` pelas palavras. Os caracteres não-palavras não precisam ser correspondidos exatamente: a pesquisa de frase exige apenas que as correspondências contenham exatamente as mesmas palavras que a frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`. Se a frase não contiver palavras que estão no índice, o resultado é vazio. Por exemplo, se todas as palavras são palavras não-verbais ou mais curtas que o comprimento mínimo das palavras indexadas, o resultado é vazio.

A implementação do MySQL `FULLTEXT` considera qualquer sequência de caracteres de palavra verdadeira (letras, dígitos e sublinhados) como uma palavra. Essa sequência também pode conter apóstrofos (`'`), mas não mais de um em sequência. Isso significa que `aaa'bbb` é considerado uma palavra, mas `aaa''bbb` é considerado duas palavras. Os apóstrofos no início ou no fim de uma palavra são removidos pelo analisador `FULLTEXT`; `'aaa'bbb'` seria analisado como `aaa'bbb`.

O analisador embutido `FULLTEXT` determina onde as palavras começam e terminam, procurando certos caracteres de delimitador; por exemplo, (espaço), `,` (ponto e vírgula) e `.` (ponto). Se as palavras não forem separadas por delimitadores (como, por exemplo, no caso do chinês), o analisador embutido `FULLTEXT` não pode determinar onde uma palavra começa ou termina. Para poder adicionar palavras ou outros termos indexados nessas línguas a um índice `FULLTEXT` que usa o analisador embutido `FULLTEXT`, você deve pré-processá-los para que sejam separados por algum delimitador arbitrário. Alternativamente, você pode criar índices `FULLTEXT` usando o plugin de analisador ngram (para chinês, japonês ou coreano) ou o plugin de analisador MeCab (para japonês).

É possível escrever um plugin que substitua o analisador de texto completo embutido. Para obter detalhes, consulte a API do plugin MySQL. Para obter, por exemplo, o código-fonte do plugin de analisador, consulte o diretório `plugin/fulltext` de uma distribuição de fonte MySQL.

Algumas palavras são ignoradas em pesquisas de texto completo:

* Qualquer palavra que seja muito curta é ignorada. O comprimento mínimo padrão das palavras que são encontradas por pesquisas de texto completo é de três caracteres para os índices de pesquisa `InnoDB`, ou quatro caracteres para os índices de pesquisa `MyISAM`. Você pode controlar o corte definindo uma opção de configuração antes de criar o índice: opção de configuração `innodb_ft_min_token_size` para índices de pesquisa `InnoDB`, ou `ft_min_word_len` para índices de pesquisa `MyISAM`.

Nota

Esse comportamento não se aplica aos índices `FULLTEXT` que utilizam o analisador de ngram. Para o analisador de ngram, o comprimento do token é definido pela opção `ngram_token_size`.

* As palavras da lista de palavras-stop são ignoradas. Uma palavra-stop é uma palavra como “o” ou “algum” que é tão comum que é considerada ter valor semântico nulo. Há uma lista de palavras-stop embutida, mas ela pode ser substituída por uma lista definida pelo usuário. As listas de palavras-stop e as opções de configuração relacionadas são diferentes para os índices de pesquisa `InnoDB` e `MyISAM`. O processamento de palavras-stop é controlado pelas opções de configuração `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para os índices de pesquisa `InnoDB`, e `ft_stopword_file` para os `MyISAM`.

Veja a Seção 14.9.4, “Stopwords de Texto Completo”, para ver as listas de stopwords padrão e como modificá-las. O comprimento mínimo de palavra padrão pode ser alterado conforme descrito na Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

Cada palavra correta na coleção e na consulta é ponderada de acordo com sua importância na coleção ou consulta. Assim, uma palavra que está presente em muitos documentos tem um peso menor, porque tem menor valor semântico nesta coleção em particular. Por outro lado, se a palavra é rara, ela recebe um peso maior. Os pesos das palavras são combinados para calcular a relevância da linha. Esta técnica funciona melhor com grandes coleções.

Limitação do MyISAM

Para tabelas muito pequenas, a distribuição das palavras não reflete adequadamente seu valor semântico, e este modelo pode, às vezes, produzir resultados bizarros para índices de pesquisa em tabelas `MyISAM`. Por exemplo, embora a palavra “MySQL” esteja presente em cada linha da tabela `articles` mostrada anteriormente, uma pesquisa pela palavra em um índice de pesquisa `MyISAM` não produz resultados:

```
mysql> SELECT * FROM articles
    -> WHERE MATCH (title,body)
    -> AGAINST ('MySQL' IN NATURAL LANGUAGE MODE);
Empty set (0.00 sec)
```

O resultado da pesquisa está vazio porque a palavra “MySQL” está presente em pelo menos 50% das linhas, e, portanto, é tratada efetivamente como uma palavra parada. Essa técnica de filtragem é mais adequada para grandes conjuntos de dados, onde você pode não querer que o conjunto de resultados retorne cada segunda linha de uma tabela de 1 GB, do que para pequenos conjuntos de dados onde isso pode causar resultados ruins para termos populares.

O limiar de 50% pode surpreendê-lo quando você tenta pela primeira vez a pesquisa de texto completo para ver como ela funciona, e torna as tabelas `InnoDB` mais adequadas para experimentação com pesquisas de texto completo. Se você criar uma tabela `MyISAM` e inserir apenas uma ou duas linhas de texto nela, cada palavra do texto ocorre em pelo menos 50% das linhas. Como resultado, nenhuma pesquisa retorna resultados até que a tabela contenha mais linhas. Os usuários que precisam contornar a limitação de 50% podem construir índices de pesquisa em tabelas `InnoDB`, ou usar o modo de busca booleana explicado na Seção 14.9.2, “Pesquisas de Texto Completo Booleanas”.

### 14.9.2 Pesquisas completas de texto booleanas

O MySQL pode realizar pesquisas de texto completo booleano usando o modificador `IN BOOLEAN MODE`. Com este modificador, certos caracteres têm um significado especial no início ou no final das palavras na string de pesquisa. Na seguinte consulta, os operadores `+` e `-` indicam que uma palavra deve estar presente ou ausente, respectivamente, para que uma correspondência ocorra. Assim, a consulta recupera todas as linhas que contêm a palavra “MySQL”, mas que *não* contêm a palavra “YourSQL”:

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

Nota

Ao implementar essa funcionalidade, o MySQL utiliza o que é às vezes referido como lógica booleana implícita, na qual

* `+` representa `AND`
* `-` representa `NOT`
* [*no operador*] implica em `OR`

As pesquisas de texto completo booleano têm essas características:

* Eles não classificam automaticamente as linhas em ordem decrescente de relevância.

As tabelas `InnoDB` exigem um índice `FULLTEXT` em todas as colunas da expressão `MATCH()` para realizar consultas booleanas. Consultas booleanas em um índice de pesquisa `MyISAM` podem funcionar mesmo sem um índice `FULLTEXT`, embora uma pesquisa executada dessa maneira seria bastante lenta.

* Os parâmetros de comprimento mínimo e máximo de texto completo se aplicam aos índices `FULLTEXT` criados usando o analisador embutido `FULLTEXT` e o plugin de analisador MeCab. `innodb_ft_min_token_size` e `innodb_ft_max_token_size` são usados para índices de pesquisa `InnoDB`. `ft_min_word_len` e `ft_max_word_len` são usados para índices de pesquisa `MyISAM`.

Os parâmetros de comprimento mínimo e máximo de palavras para o índice de texto completo não se aplicam aos índices `FULLTEXT` criados usando o analisador de ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

* A lista de palavras-stop se aplica, controlada por `innodb_ft_enable_stopword`, `innodb_ft_server_stopword_table` e `innodb_ft_user_stopword_table` para índices de pesquisa `InnoDB`, e `ft_stopword_file` para os `MyISAM`.

* A pesquisa de texto completo `InnoDB` não suporta o uso de múltiplos operadores em uma única palavra de pesquisa, como neste exemplo: `'++apple'`. O uso de múltiplos operadores em uma única palavra de pesquisa retorna um erro de sintaxe para a saída padrão. A pesquisa de texto completo MyISAM processa com sucesso a mesma pesquisa, ignorando todos os operadores, exceto o operador imediatamente adjacente à palavra de pesquisa.

* A pesquisa de texto completo `InnoDB` só suporta sinais de mais ou menos no início. Por exemplo, `InnoDB` suporta `'+apple'`, mas não suporta `'apple+'`. Especificar um sinal de mais ou menos no final faz com que `InnoDB` informe um erro de sintaxe.

* A pesquisa de texto completo `InnoDB` não suporta o uso de um sinal de mais com caractere curinga no início (`'+*'`), uma combinação de sinal de mais e menos (`'+-'`), ou uma combinação de sinal de mais e menos no início (`'+-apple'`). Essas consultas inválidas retornam um erro de sintaxe.

* A pesquisa de texto completo `InnoDB` não suporta o uso do símbolo `@` em pesquisas de texto completo booleanas. O símbolo `@` é reservado para uso pelo operador de pesquisa de proximidade `@distance`.

* Eles não usam o limite de 50% que se aplica aos índices de pesquisa `MyISAM`.

A capacidade de busca de texto completo booleano suporta os seguintes operadores:

* `+`

Um sinal de mais inicial ou final indica que essa palavra *deve* estar presente em cada linha que é devolvida. `InnoDB` só suporta sinais de mais iniciais.

* `-`

Um sinal de menos prefixado ou sufixado indica que essa palavra não deve estar presente em nenhuma das linhas que são retornadas. O `InnoDB` só suporta sinais de menos prefixados.

Nota: O operador `-` age apenas para excluir linhas que, de outra forma, são correspondidas por outros termos de pesquisa. Assim, uma pesquisa em modo booleano que contém apenas termos precedidos por `-` retorna um resultado vazio. Não retorna “todas as linhas exceto aquelas que contêm algum dos termos excluídos”.

* (sem operador)

Por padrão (quando nem `+` nem `-` é especificado), a palavra é opcional, mas as linhas que a contêm são classificadas como mais altas. Isso imita o comportamento de `MATCH() AGAINST()`(fulltext-search.html#function_match) sem o modificador `IN BOOLEAN MODE`.

* `@distance`

Este operador funciona apenas em tabelas `InnoDB`. Testa se duas ou mais palavras começam todas dentro de uma distância especificada uma da outra, medida em palavras. Especifique as palavras de busca em uma cadeia entre aspas duplas imediatamente antes do operador `@distance`, por exemplo, `MATCH(col1) AGAINST('"word1 word2 word3" @8' IN BOOLEAN MODE)`

* `> <`

Esses dois operadores são usados para alterar a contribuição de uma palavra para o valor de relevância que é atribuído a uma linha. O operador `>` aumenta a contribuição e o operador `<` a diminui. Veja o exemplo que segue esta lista.

* `( )`

As parênteses agrupam palavras em subexpressões. Os grupos entre parênteses podem ser aninhados.

* `~`

Uma tilde principal atua como um operador de negação, fazendo com que a contribuição da palavra para a relevância da linha seja negativa. Isso é útil para marcar palavras de "ruído". Uma linha que contém tal palavra é avaliada como inferior às outras, mas não é excluída completamente, como seria com o operador `-`.

* `*`

O asterisco serve como operador de truncação (ou comodinho). Ao contrário dos outros operadores, ele é *após* a palavra que será afetada. As palavras correspondem se começam com a palavra que precede o operador `*`.

Se uma palavra for especificada com o operador de truncação, ela não será removida de uma consulta booleana, mesmo que seja muito curta ou uma palavra parada. Se uma palavra é muito curta é determinado a partir do ajuste `innodb_ft_min_token_size` para as tabelas `InnoDB`, ou `ft_min_word_len` para as tabelas `MyISAM`. Essas opções não são aplicáveis aos índices `FULLTEXT` que usam o analisador de ngram.

A palavra wildcarded é considerada um prefixo que deve estar presente no início de uma ou mais palavras. Se o comprimento mínimo da palavra for de 4, uma pesquisa por `'+word +the*'` pode retornar menos linhas do que uma pesquisa por `'+word +the'`, porque a segunda consulta ignora o termo de busca muito curto `the`.

* `"`

Uma frase que está encerrada entre aspas duplas (`"`) corresponde apenas às linhas que contêm a frase *literalmente, como foi digitada*. O motor de texto completo divide a frase em palavras e realiza uma pesquisa no índice `FULLTEXT` para as palavras. Os caracteres não-alfabéticos não precisam ser correspondidos exatamente: a pesquisa de frase exige apenas que as correspondências contenham exatamente as mesmas palavras que a frase e na mesma ordem. Por exemplo, `"test phrase"` corresponde a `"test, phrase"`.

Se a frase não contiver palavras que estejam no índice, o resultado será vazio. As palavras podem não estar no índice devido a uma combinação de fatores: se não existem no texto, são palavras de parada ou são mais curtas que o comprimento mínimo das palavras indexadas.

Os exemplos a seguir demonstram algumas cadeias de busca que utilizam operadores de texto completo booleanos:

* `'apple banana'`

Encontre linhas que contenham pelo menos uma das duas palavras.

* `'+apple +juice'`

Encontre linhas que contenham ambas as palavras.

* `'+apple macintosh'`

Encontre linhas que contenham a palavra “apple”, mas classifique as linhas mais altas se elas também contenham “macintosh”.

* `'+apple -macintosh'`

Encontre linhas que contenham a palavra “apple”, mas não “macintosh”.

* `'+apple ~macintosh'`

Encontre linhas que contenham a palavra “apple”, mas se a linha também contiver a palavra “macintosh”, classifique-a como menos importante do que se a linha não contiver essa palavra. Isso é “mais suave” do que uma busca para `'+apple -macintosh'`, para a qual a presença de “macintosh” faz com que a linha não seja devolvida.

* `'+apple +(>turnover <strudel)'`

Encontre linhas que contenham as palavras “apple” e “turnover”, ou “apple” e “strudel” (em qualquer ordem), mas classifique “apple turnover” como mais importante do que “apple strudel”.

* `'apple*'`

Encontre linhas que contenham palavras como “apple”, “apples”, “applesauce” ou “applet”.

* `'"some words"'`

Encontre linhas que contenham a frase exata “algumas palavras” (por exemplo, linhas que contenham “algumas palavras de sabedoria”, mas não “algumas palavras de ruído”). Note que os caracteres `"` que encerram a frase são caracteres operador que delimitam a frase. Eles não são as aspas que encerram a própria string de pesquisa.

#### Rankings de relevância para pesquisa no modo booleano do InnoDB

A pesquisa de texto completo `InnoDB` é modelada pelo motor de busca de texto completo Sphinx, e os algoritmos utilizados são baseados nos algoritmos de classificação BM25 e TF-IDF. Por essas razões, as classificações de relevância para a pesquisa de texto completo `InnoDB` booleana podem diferir das classificações de relevância de `MyISAM`.

`InnoDB` utiliza uma variação do sistema de ponderação de "frequência de termos - frequência inversa de documentos" (`TF-IDF`) para classificar a relevância de um documento para uma consulta de pesquisa de texto completo dada. A ponderação `TF-IDF` é baseada na frequência com que uma palavra aparece em um documento, compensada pela frequência com que a palavra aparece em todos os documentos da coleção. Em outras palavras, quanto mais frequentemente uma palavra aparece em um documento e menos frequentemente a palavra aparece na coleção de documentos, mais alto o documento é classificado.

##### Como o Ranking de Relevância é Calculado

O valor da frequência de termo (`TF`) é o número de vezes que uma palavra aparece em um documento. O valor da frequência inversa de documento (`IDF`) de uma palavra é calculado usando a seguinte fórmula, onde `total_records` é o número de registros na coleção e `matching_records` é o número de registros em que o termo de busca aparece.

```
${IDF} = log10( ${total_records} / ${matching_records} )
```

Quando um documento contém uma palavra várias vezes, o valor IDF é multiplicado pelo valor TF:

```
${TF} * ${IDF}
```

Usando os valores `TF` e `IDF`, o ranking de relevância para um documento é calculado usando esta fórmula:

```
${rank} = ${TF} * ${IDF} * ${IDF}
```

A fórmula é demonstrada nos exemplos a seguir.

##### Ranking de relevância para uma busca por uma palavra única

Este exemplo demonstra o cálculo do ranking de relevância para uma busca de uma palavra única.

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

Existem 8 registros no total, com 3 que correspondem ao termo de pesquisa “banco de dados”. O primeiro registro (`id 6`) contém o termo de pesquisa 6 vezes e tem um ranking de relevância de `1.0886961221694946`. Esse valor de classificação é calculado usando um valor de `TF` de 6 (o termo de pesquisa aparece 6 vezes no registro `id 6`) e um valor de `IDF` de 0,42596873216370745, que é calculado da seguinte forma (onde 8 é o número total de registros e 3 é o número de registros que o termo de pesquisa aparece):

```
${IDF} = LOG10( 8 / 3 ) = 0.42596873216370745
```

Os valores `TF` e `IDF` são, em seguida, inseridos na fórmula de classificação:

```
${rank} = ${TF} * ${IDF} * ${IDF}
```

Realizando o cálculo no cliente de linha de comando do MySQL, retorna um valor de classificação de 1,088696164686938.

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

Você pode notar uma pequena diferença nos valores de classificação retornados pela declaração `SELECT ... MATCH ... AGAINST` e pelo cliente de linha de comando do MySQL (`1.0886961221694946` versus `1.088696164686938`). A diferença se deve ao modo como os casts entre inteiros e flutuantes/doblantes são realizados internamente pelo `InnoDB` (junto com decisões relacionadas à precisão e arredondamento), e como eles são realizados em outros lugares, como no cliente de linha de comando do MySQL ou em outros tipos de calculadoras.

##### Ranking de relevância para uma busca por múltiplos termos

Este exemplo demonstra o cálculo do ranking de relevância para uma pesquisa de texto completo de várias palavras com base na tabela `articles` e nos dados utilizados no exemplo anterior.

Se você pesquisar em mais de uma palavra, o valor de classificação de relevância é uma soma do valor de classificação de relevância para cada palavra, conforme mostrado nesta fórmula:

```
${rank} = ${TF} * ${IDF} * ${IDF} + ${TF} * ${IDF} * ${IDF}
```

Realizar uma pesquisa com dois termos ('mysql tutorial') retorna os seguintes resultados:

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
```

No primeiro registro (`id 8`), 'mysql' aparece uma vez e 'tutorial' aparece duas vezes. Há seis registros correspondentes para 'mysql' e dois registros correspondentes para 'tutorial'. O cliente de linha de comando MySQL retorna o valor de classificação esperado ao inserir esses valores na fórmula de classificação para uma pesquisa de múltiplas palavras:

```
mysql> SELECT (1*log10(8/6)*log10(8/6)) + (2*log10(8/2)*log10(8/2));
+-------------------------------------------------------+
| (1*log10(8/6)*log10(8/6)) + (2*log10(8/2)*log10(8/2)) |
+-------------------------------------------------------+
|                                    0.7405621541938003 |
+-------------------------------------------------------+
1 row in set (0.00 sec)
```

Nota

A pequena diferença nos valores de classificação retornados pela declaração `SELECT ... MATCH ... AGAINST` e pelo cliente de linha de comando do MySQL é explicada no exemplo anterior.

### 14.9.3 Pesquisas de texto completo com expansão de consulta

A pesquisa de texto completo suporta a expansão de consultas (e, em particular, sua variante “expansão de consulta cega”). Isso geralmente é útil quando uma frase de busca é muito curta, o que muitas vezes significa que o usuário está confiando em conhecimento implícito que o motor de busca de texto completo não possui. Por exemplo, um usuário que busca por “banco de dados” pode realmente significar que “MySQL”, “Oracle”, “DB2” e “RDBMS” são todas frases que devem corresponder a “databases” e também devem ser devolvidas. Esse é conhecimento implícito.

A expansão de consulta cega (também conhecida como feedback automático de relevância) é ativada adicionando `WITH QUERY EXPANSION` ou `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` após a frase de busca. Ela funciona realizando a busca duas vezes, onde a frase de busca para a segunda busca é a frase de busca original concatenada com os poucos documentos mais altamente relevantes da primeira busca. Assim, se um desses documentos contiver a palavra “databases” e a palavra “MySQL”, a segunda busca encontra os documentos que contêm a palavra “MySQL”, mesmo que eles não contenham a palavra “database”. O exemplo a seguir mostra essa diferença:

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

Outro exemplo poderia ser a busca por livros de Georges Simenon sobre Maigret, quando o usuário não tem certeza de como escrever “Maigret”. Uma busca por “Megre e os testemunhas relutantes” encontra apenas “Maigret e os Testemunhas Relutantes” sem expansão de consulta. Uma busca com expansão de consulta encontra todos os livros com a palavra “Maigret” na segunda passagem.

Nota

Como a expansão de consulta cega tende a aumentar significativamente o ruído ao retornar documentos irrelevantes, use-a apenas quando a frase de busca é curta.

### 14.9.4 Palavras-chave de texto completo

A lista de palavras-chave é carregada e pesquisada para consultas de texto completo usando o conjunto de caracteres e a correção de texto do servidor (os valores das variáveis de sistema `character_set_server` e `collation_server`). Pode ocorrer falsos positivos ou negativos em buscas de palavras-chave se o arquivo de palavras-chave ou as colunas usadas para indexação ou pesquisas de texto completo tiverem um conjunto de caracteres ou correção de texto diferente de `character_set_server` ou `collation_server`.

A sensibilidade ao caso das consultas de palavras-chave depende da collation do servidor. Por exemplo, as consultas são insensíveis ao caso se a collation for `utf8mb4_0900_ai_ci`, enquanto as consultas são sensíveis ao caso se a collation for `utf8mb4_0900_as_cs` ou `utf8mb4_bin`.

* Palavras-chave para índices de pesquisa InnoDB
* Palavras-chave para índices de pesquisa MyISAM

#### Palavras-chave para índices de pesquisa InnoDB

`InnoDB` tem uma lista relativamente curta de palavras de parada padrão, porque documentos de fontes técnicas, literárias e outras frequentemente usam palavras curtas como palavras-chave ou em frases significativas. Por exemplo, você pode pesquisar por “ser ou não ser” e esperar obter um resultado sensível, em vez de todas essas palavras serem ignoradas.

Para ver a lista de palavras-chave padrão `InnoDB`, consulte a tabela do esquema de informações `INNODB_FT_DEFAULT_STOPWORD`.

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

Para definir sua própria lista de palavras não relevantes para todas as tabelas `InnoDB`, defina uma tabela com a mesma estrutura que a tabela `INNODB_FT_DEFAULT_STOPWORD`, preencha-a com palavras não relevantes e defina o valor da opção `innodb_ft_server_stopword_table` para um valor na forma `db_name/table_name` antes de criar o índice de texto completo. A tabela de palavras não relevantes deve ter uma única coluna `VARCHAR` com o nome `value`. O exemplo a seguir demonstra como criar e configurar uma nova tabela global de palavras não relevantes para `InnoDB`.

```
-- Create a new stopword table

mysql> CREATE TABLE my_stopwords(value VARCHAR(30)) ENGINE = INNODB;
Query OK, 0 rows affected (0.01 sec)

-- Insert stopwords (for simplicity, a single stopword is used in this example)

mysql> INSERT INTO my_stopwords(value) VALUES ('Ishmael');
Query OK, 1 row affected (0.00 sec)

-- Create the table

mysql> CREATE TABLE opening_lines (
id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
opening_line TEXT(500),
author VARCHAR(200),
title VARCHAR(200)
) ENGINE=InnoDB;
Query OK, 0 rows affected (0.01 sec)

-- Insert data into the table

mysql> INSERT INTO opening_lines(opening_line,author,title) VALUES
('Call me Ishmael.','Herman Melville','Moby-Dick'),
('A screaming comes across the sky.','Thomas Pynchon','Gravity\'s Rainbow'),
('I am an invisible man.','Ralph Ellison','Invisible Man'),
('Where now? Who now? When now?','Samuel Beckett','The Unnamable'),
('It was love at first sight.','Joseph Heller','Catch-22'),
('All this happened, more or less.','Kurt Vonnegut','Slaughterhouse-Five'),
('Mrs. Dalloway said she would buy the flowers herself.','Virginia Woolf','Mrs. Dalloway'),
('It was a pleasure to burn.','Ray Bradbury','Fahrenheit 451');
Query OK, 8 rows affected (0.00 sec)
Records: 8  Duplicates: 0  Warnings: 0

-- Set the innodb_ft_server_stopword_table option to the new stopword table

mysql> SET GLOBAL innodb_ft_server_stopword_table = 'test/my_stopwords';
Query OK, 0 rows affected (0.00 sec)

-- Create the full-text index (which rebuilds the table if no FTS_DOC_ID column is defined)

mysql> CREATE FULLTEXT INDEX idx ON opening_lines(opening_line);
Query OK, 0 rows affected, 1 warning (1.17 sec)
Records: 0  Duplicates: 0  Warnings: 1
```

Verifique se a palavra parada especificada ('Ishmael') não aparece consultando a tabela do esquema de informações `INNODB_FT_INDEX_TABLE`.

Nota

Por padrão, palavras com menos de 3 caracteres ou com mais de 84 caracteres não aparecem em um índice de pesquisa de texto completo `InnoDB`. Os valores máximos e mínimos de comprimento de palavra são configuráveis usando as variáveis `innodb_ft_max_token_size` e `innodb_ft_min_token_size`. Esse comportamento padrão não se aplica ao plugin de análise de ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

```
mysql> SET GLOBAL innodb_ft_aux_table='test/opening_lines';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT word FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 15;
+-----------+
| word      |
+-----------+
| across    |
| all       |
| burn      |
| buy       |
| call      |
| comes     |
| dalloway  |
| first     |
| flowers   |
| happened  |
| herself   |
| invisible |
| less      |
| love      |
| man       |
+-----------+
15 rows in set (0.00 sec)
```

Para criar listas de palavras-chave por tabela, crie outras tabelas de palavras-chave e use a opção `innodb_ft_user_stopword_table` para especificar a tabela de palavras-chave que você deseja usar antes de criar o índice de texto completo.

#### Palavras-chave para índices de pesquisa MyISAM

O arquivo de palavras-chave é carregado e pesquisado usando `latin1` se `character_set_server` é `ucs2`, `utf16`, `utf16le` ou `utf32`.

Para substituir a lista de palavras-chave padrão para tabelas MyISAM, defina a variável de sistema `ft_stopword_file`. (Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.) O valor da variável deve ser o nome do caminho do arquivo que contém a lista de palavras-chave, ou a string vazia para desabilitar a filtragem de palavras-chave. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Após alterar o valor desta variável ou o conteúdo do arquivo de palavras-chave, reinicie o servidor e reconstrua seus índices `FULLTEXT`.

A lista de palavras-stop é livre de formato, separando as palavras-stop com qualquer caractere não alfanumérico, como nova linha, espaço ou vírgula. As exceções são o caractere sublinhado (`_`) e uma única apóstrofe (`'`) que são tratados como parte de uma palavra. O conjunto de caracteres da lista de palavras-stop é o conjunto de caracteres padrão do servidor; consulte a Seção 12.3.2, “Conjunto de caracteres do servidor e cotação”.

A lista a seguir mostra as palavras-chave padrão para os índices de pesquisa do `MyISAM`. Em uma distribuição de fonte MySQL, você pode encontrar essa lista no arquivo `storage/myisam/ft_static.c`.

```
a's           able          about         above         according
accordingly   across        actually      after         afterwards
again         against       ain't         all           allow
allows        almost        alone         along         already
also          although      always        am            among
amongst       an            and           another       any
anybody       anyhow        anyone        anything      anyway
anyways       anywhere      apart         appear        appreciate
appropriate   are           aren't        around        as
aside         ask           asking        associated    at
available     away          awfully       be            became
because       become        becomes       becoming      been
before        beforehand    behind        being         believe
below         beside        besides       best          better
between       beyond        both          brief         but
by            c'mon         c's           came          can
can't         cannot        cant          cause         causes
certain       certainly     changes       clearly       co
com           come          comes         concerning    consequently
consider      considering   contain       containing    contains
corresponding could         couldn't      course        currently
definitely    described     despite       did           didn't
different     do            does          doesn't       doing
don't         done          down          downwards     during
each          edu           eg            eight         either
else          elsewhere     enough        entirely      especially
et            etc           even          ever          every
everybody     everyone      everything    everywhere    ex
exactly       example       except        far           few
fifth         first         five          followed      following
follows       for           former        formerly      forth
four          from          further       furthermore   get
gets          getting       given         gives         go
goes          going         gone          got           gotten
greetings     had           hadn't        happens       hardly
has           hasn't        have          haven't       having
he            he's          hello         help          hence
her           here          here's        hereafter     hereby
herein        hereupon      hers          herself       hi
him           himself       his           hither        hopefully
how           howbeit       however       i'd           i'll
i'm           i've          ie            if            ignored
immediate     in            inasmuch      inc           indeed
indicate      indicated     indicates     inner         insofar
instead       into          inward        is            isn't
it            it'd          it'll         it's          its
itself        just          keep          keeps         kept
know          known         knows         last          lately
later         latter        latterly      least         less
lest          let           let's         like          liked
likely        little        look          looking       looks
ltd           mainly        many          may           maybe
me            mean          meanwhile     merely        might
more          moreover      most          mostly        much
must          my            myself        name          namely
nd            near          nearly        necessary     need
needs         neither       never         nevertheless  new
next          nine          no            nobody        non
none          noone         nor           normally      not
nothing       novel         now           nowhere       obviously
of            off           often         oh            ok
okay          old           on            once          one
ones          only          onto          or            other
others        otherwise     ought         our           ours
ourselves     out           outside       over          overall
own           particular    particularly  per           perhaps
placed        please        plus          possible      presumably
probably      provides      que           quite         qv
rather        rd            re            really        reasonably
regarding     regardless    regards       relatively    respectively
right         said          same          saw           say
saying        says          second        secondly      see
seeing        seem          seemed        seeming       seems
seen          self          selves        sensible      sent
serious       seriously     seven         several       shall
she           should        shouldn't     since         six
so            some          somebody      somehow       someone
something     sometime      sometimes     somewhat      somewhere
soon          sorry         specified     specify       specifying
still         sub           such          sup           sure
t's           take          taken         tell          tends
th            than          thank         thanks        thanx
that          that's        thats         the           their
theirs        them          themselves    then          thence
there         there's       thereafter    thereby       therefore
therein       theres        thereupon     these         they
they'd        they'll       they're       they've       think
third         this          thorough      thoroughly    those
though        three         through       throughout    thru
thus          to            together      too           took
toward        towards       tried         tries         truly
try           trying        twice         two           un
under         unfortunately unless        unlikely      until
unto          up            upon          us            use
used          useful        uses          using         usually
value         various       very          via           viz
vs            want          wants         was           wasn't
way           we            we'd          we'll         we're
we've         welcome       well          went          were
weren't       what          what's        whatever      when
whence        whenever      where         where's       whereafter
whereas       whereby       wherein       whereupon     wherever
whether       which         while         whither       who
who's         whoever       whole         whom          whose
why           will          willing       wish          with
within        without       won't         wonder        would
wouldn't      yes           yet           you           you'd
you'll        you're        you've        your          yours
yourself      yourselves    zero
```

### 14.9.5 Restrições de texto completo

* As pesquisas de texto completo são suportadas apenas para as tabelas `InnoDB` e `MyISAM`.

* As pesquisas de texto completo não são suportadas para tabelas particionadas. Consulte a Seção 26.6, “Restrições e Limitações sobre Partição”.

* As pesquisas de texto completo podem ser usadas com a maioria dos conjuntos de caracteres multibyte. A exceção é que, para o Unicode, o conjunto de caracteres `utf8mb3` ou `utf8mb4` pode ser usado, mas não o conjunto de caracteres `ucs2`. Embora os índices `FULLTEXT` em colunas `ucs2` não possam ser usados, você pode realizar pesquisas `IN BOOLEAN MODE` em uma coluna `ucs2` que não tenha tal índice.

As observações para `utf8mb3` também se aplicam a `utf8mb4`, e as observações para `ucs2` também se aplicam a `utf16`, `utf16le` e `utf32`.

* As línguas ideográficas, como o chinês e o japonês, não possuem delimitadores de palavras. Portanto, o analisador de texto completo embutido *não pode determinar onde as palavras começam e terminam nesses e em outras línguas semelhantes*.

Um analisador de texto completo baseado em caracteres que suporta chinês, japonês e coreano (CJK) e um plugin de analisador MeCab baseado em palavras que suporta japonês são fornecidos para uso com as tabelas `InnoDB` e `MyISAM`.

* Embora o uso de múltiplos conjuntos de caracteres em uma única tabela seja suportado, todas as colunas em um índice `FULLTEXT` devem usar o mesmo conjunto de caracteres e codificação.

* A lista de colunas `MATCH()` deve corresponder exatamente à lista de colunas em alguma definição de índice `FULLTEXT` para a tabela, a menos que essa `MATCH()` seja `IN BOOLEAN MODE` em uma tabela `MyISAM`. Para tabelas `MyISAM`, pesquisas em modo booleano podem ser feitas em colunas não indexadas, embora sejam propensas a serem lentas.

* O argumento para `AGAINST()` deve ser um valor de string que seja constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela, porque ela pode diferir para cada linha.

A partir do MySQL 8.0.28, o argumento para `MATCH()` não pode usar uma coluna de agregação.

* As dicas de índice são mais limitadas para pesquisas de `FULLTEXT` do que para pesquisas que não são de `FULLTEXT`. Veja a Seção 10.9.4, “Dicas de índice”.

* Para `InnoDB`, todas as operações DML (`INSERT`, `UPDATE`, `DELETE`) que envolvem colunas com índices de texto completo são processadas no momento do commit da transação. Por exemplo, para uma operação de `INSERT`, uma string inserida é tokenizada e decomposta em palavras individuais. As palavras individuais são então adicionadas às tabelas de índice de texto completo quando a transação é comprometida. Como resultado, as pesquisas de texto completo retornam apenas dados comprometidos.

* O caractere '%' não é um caractere de comodinho suportado para pesquisas de texto completo.

### 14.9.6 Ajuste fino da pesquisa full-text do MySQL

A capacidade de pesquisa de texto completo do MySQL tem poucos parâmetros que podem ser ajustados pelo usuário. Você pode exercer mais controle sobre o comportamento da pesquisa de texto completo se tiver uma distribuição de fonte MySQL, pois algumas alterações exigem modificações no código-fonte. Veja a Seção 2.8, “Instalando MySQL a partir da fonte”.

A pesquisa de texto completo é cuidadosamente ajustada para eficácia. Modificar o comportamento padrão na maioria dos casos pode, na verdade, diminuir a eficácia. *Não altere as fontes do MySQL a menos que você saiba o que está fazendo*.

A maioria das variáveis de texto completo descritas nesta seção deve ser definida no momento do início do servidor. É necessário reiniciar o servidor para alterá-las; elas não podem ser modificadas enquanto o servidor estiver em execução.

Algumas alterações variáveis exigem que você reconstrua os índices `FULLTEXT` em suas tabelas. As instruções para fazer isso são fornecidas mais adiante nesta seção.

* Configurando o comprimento mínimo e máximo das palavras
* Configurando o Limiar de Pesquisa de Linguagem Natural
* Modificando os operadores de pesquisa de texto completo booleano
* Modificações no conjunto de caracteres
* Refazendo índices de texto completo InnoDB
* Otimizando índices de texto completo InnoDB
* Refazendo índices de texto completo MyISAM

#### Configurando o comprimento mínimo e máximo das palavras

As definições das longitudes mínima e máxima das palavras a serem indexadas são definidas pelos `innodb_ft_min_token_size` e `innodb_ft_max_token_size` para os índices de pesquisa `InnoDB`, e pelos `ft_min_word_len` e `ft_max_word_len` para os índices de pesquisa `MyISAM`.

Nota

Os parâmetros de comprimento mínimo e máximo de palavras para o índice de texto completo não se aplicam aos índices `FULLTEXT` criados usando o analisador ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

Depois de alterar qualquer uma dessas opções, reconstrua seus índices do `FULLTEXT` para que a mudança entre em vigor. Por exemplo, para tornar as palavras de dois caracteres pesquisáveis, você pode colocar as seguintes linhas em um arquivo de opções:

```
[mysqld]
innodb_ft_min_token_size=2
ft_min_word_len=2
```

Em seguida, reinicie o servidor e reconstrua seus índices `FULLTEXT`. Para as tabelas `MyISAM`, observe as observações sobre **myisamchk** nas instruções que se seguem para a reconstrução dos índices de texto completo `MyISAM`.

#### Configurando o Limite de Pesquisa em Linguagem Natural

Para os índices de pesquisa de `MyISAM`, o limite de 50% para pesquisas em linguagem natural é determinado pelo esquema de ponderação específico escolhido. Para desativá-lo, procure a seguinte linha em `storage/myisam/ftdefs.h`:

```
#define GWS_IN_USE GWS_PROB
```

Altere essa linha para esta:

```
#define GWS_IN_USE GWS_FREQ
```

Em seguida, recomponha o MySQL. Não há necessidade de reconstruir os índices neste caso.

Nota

Ao fazer essa alteração, você *reduz severamente* a capacidade do MySQL de fornecer valores de relevância adequados para a função `MATCH()`. Se você realmente precisa pesquisar por palavras comuns, seria melhor pesquisar usando `IN BOOLEAN MODE` em vez disso, que não observa o limite de 50%.

#### Modificando operadores de busca de texto completo booleano

Para alterar os operadores usados para pesquisas de texto completo booleano em tabelas do `MyISAM`, defina a variável de sistema `ft_boolean_syntax`. (`InnoDB` não tem um ajuste equivalente.) Essa variável pode ser alterada enquanto o servidor estiver em execução, mas você deve ter privilégios suficientes para definir variáveis de sistema globais (consulte Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”). Nesse caso, não é necessário reconstruir os índices.

#### Modificações no Conjunto de Caracteres

Para o analisador de texto completo integrado, você pode alterar o conjunto de caracteres que são considerados caracteres de palavra de várias maneiras, conforme descrito na lista a seguir. Após fazer a modificação, reconstrua os índices para cada tabela que contém quaisquer índices `FULLTEXT`. Suponha que você queira tratar o caractere hífen ('-') como um caractere de palavra. Use um desses métodos:

* Modifique a fonte do MySQL: Em `storage/innobase/handler/ha_innodb.cc` (para `InnoDB`), ou em `storage/myisam/ftdefs.h` (para `MyISAM`), consulte as macros `true_word_char()` e `misc_word_char()`. Adicione `'-'` a uma dessas macros e recomponha o MySQL.

* Modificar um arquivo de conjunto de caracteres: Isso não requer recompilação. A macro `true_word_char()` usa uma tabela de "tipo de caractere" para distinguir letras e números de outros caracteres. Você pode editar o conteúdo do array `<ctype><map>` em um dos arquivos XML de conjunto de caracteres para especificar que `'-'` é uma "letra". Em seguida, use o conjunto de caracteres fornecido para seus índices `FULLTEXT`. Para informações sobre o formato do array `<ctype><map>`, consulte a Seção 12.13.1, "Arrays de Definição de Caracteres".

* Adicione uma nova correção para o conjunto de caracteres usado pelas colunas indexadas e altere as colunas para usar essa correção. Para informações gerais sobre como adicionar correções, consulte a Seção 12.14, “Adicionando uma Correção a um Conjunto de Caracteres”. Para um exemplo específico de indexação de texto completo, consulte a Seção 14.9.7, “Adicionando uma Correção Definida pelo Usuário para Indexação de Texto Completo”.

#### Rebuilding InnoDB Full-Text Indexes

Para que as alterações sejam efetivas, os índices `FULLTEXT` devem ser reconstruídos após modificar qualquer uma das seguintes variáveis de índice de texto completo: `innodb_ft_min_token_size`; `innodb_ft_max_token_size`; `innodb_ft_server_stopword_table`; `innodb_ft_user_stopword_table`; `innodb_ft_enable_stopword`; `ngram_token_size`. A modificação de `innodb_ft_min_token_size`, `innodb_ft_max_token_size` ou `ngram_token_size` requer o reinício do servidor.

Para reconstruir os índices `FULLTEXT` para uma tabela `InnoDB`, use `ALTER TABLE` com as opções `DROP INDEX` e `ADD INDEX` para descartar e recriar cada índice.

#### Otimizando índices full-text do InnoDB

Executar `OPTIMIZE TABLE` em uma tabela com uma reconstrução do índice de texto completo refaz o índice de texto completo, removendo os IDs de documento excluídos e consolidando várias entradas para a mesma palavra, quando possível.

Para otimizar um índice de texto completo, habilite `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE`.

```
mysql> set GLOBAL innodb_optimize_fulltext_only=ON;
Query OK, 0 rows affected (0.01 sec)

mysql> OPTIMIZE TABLE opening_lines;
+--------------------+----------+----------+----------+
| Table              | Op       | Msg_type | Msg_text |
+--------------------+----------+----------+----------+
| test.opening_lines | optimize | status   | OK       |
+--------------------+----------+----------+----------+
1 row in set (0.01 sec)
```

Para evitar tempos prolongados de reconstrução para índices de texto completo em tabelas grandes, você pode usar a opção `innodb_ft_num_word_optimize` para realizar a otimização em etapas. A opção `innodb_ft_num_word_optimize` define o número de palavras que são otimizadas a cada vez que `OPTIMIZE TABLE` é executado. O ajuste padrão é de 2000, o que significa que 2000 palavras são otimizadas a cada vez que [[`OPTIMIZE TABLE`][(optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement")]] é executado. As operações subsequentes de `OPTIMIZE TABLE` continuam a partir do ponto onde a operação anterior de `OPTIMIZE TABLE` terminou.

#### Rebuilding MyISAM Full-Text Indexes

Se você modificar variáveis de texto completo que afetam a indexação (`ft_min_word_len`, `ft_max_word_len` ou `ft_stopword_file`), ou se você alterar o próprio arquivo de palavras-chave, você deve reconstruir seus índices do `FULLTEXT` após fazer as alterações e reiniciar o servidor.

Para reconstruir os índices `FULLTEXT` para uma tabela `MyISAM`, é suficiente realizar uma operação de reparo `QUICK`:

```
mysql> REPAIR TABLE tbl_name QUICK;
```

Como alternativa, use `ALTER TABLE` conforme descrito acima. Em alguns casos, isso pode ser mais rápido do que uma operação de reparo.

Cada tabela que contém qualquer índice `FULLTEXT` deve ser reparada como mostrado acima. Caso contrário, as consultas para a tabela podem gerar resultados incorretos, e as modificações na tabela fazem com que o servidor veja a tabela como corrupta e necessitando de reparo.

Se você usar **myisamchk** para realizar uma operação que modifica os índices das tabelas `MyISAM` (como reparo ou análise), os índices `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros de comprimento mínimo, comprimento máximo e arquivo de palavras-stop do full-text, a menos que você especifique o contrário. Isso pode resultar em consultas que falham.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados nos arquivos de índice `MyISAM`. Para evitar o problema, se você modificou os valores do arquivo de comprimento mínimo ou máximo da palavra ou do arquivo de palavras irrelevantes usados pelo servidor, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para **myisamchk** que você usa para **mysqld**. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, pode reparar uma tabela com **myisamchk** da seguinte forma:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que **myisamchk** e o servidor utilizem os mesmos valores para os parâmetros de texto completo, coloque cada um deles nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa para usar **myisamchk** para modificação do índice da tabela `MyISAM` é usar as declarações `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas declarações são realizadas pelo servidor, que conhece os valores adequados dos parâmetros de texto completo a serem usados.

### 14.9.7 Adicionando uma Cotação Definida pelo Usuário para Indicação de Texto Completo

Aviso

As collation definidas pelo usuário são desaconselhadas; você deve esperar que o suporte para elas seja removido em uma versão futura do MySQL. A partir do MySQL 8.0.33, o servidor emite um aviso para qualquer uso de `COLLATE user_defined_collation` em uma declaração SQL; um aviso também é emitido quando o servidor é iniciado com `--collation-server` definido igual ao nome de uma collation definida pelo usuário.

Esta seção descreve como adicionar uma collation definida pelo usuário para pesquisas de texto completo usando o analisador de texto completo integrado. A collation de exemplo é como `latin1_swedish_ci` mas trata o caractere `'-'` como uma letra em vez de como um caractere de pontuação, para que possa ser indexado como um caractere de palavra. As informações gerais sobre adição de collation estão fornecidas na Seção 12.14, “Adicionando uma collation a um conjunto de caracteres”; presume-se que você a leu e está familiarizado com os arquivos envolvidos.

Para adicionar uma codificação para indexação de texto completo, use o procedimento a seguir. As instruções aqui adicionam uma codificação para um conjunto de caracteres simples, que, conforme discutido na Seção 12.14, “Adicionando uma codificação a um conjunto de caracteres”, pode ser criado usando um arquivo de configuração que descreve as propriedades do conjunto de caracteres. Para um conjunto de caracteres complexo, como o Unicode, crie codificações usando arquivos de fonte C que descrevam as propriedades do conjunto de caracteres.

1. Adicione uma ordenação ao arquivo `Index.xml`. A faixa permitida de IDs para ordenações definidas pelo usuário é dada na Seção 12.14.2, “Escolhendo um ID de ordenação”. O ID deve ser inutilizado, então escolha um valor diferente de 1025 se esse ID já estiver sendo usado no seu sistema.

   ```
   <charset name="latin1">
   ...
   <collation name="latin1_fulltext_ci" id="1025"/>
   </charset>
   ```

2. Declare a ordem de classificação para a correção no arquivo `latin1.xml`. Neste caso, a ordem pode ser copiada do `latin1_swedish_ci`:

   ```
   <collation name="latin1_fulltext_ci">
   <map>
   00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
   10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F
   20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F
   30 31 32 33 34 35 36 37 38 39 3A 3B 3C 3D 3E 3F
   40 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
   50 51 52 53 54 55 56 57 58 59 5A 5B 5C 5D 5E 5F
   60 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
   50 51 52 53 54 55 56 57 58 59 5A 7B 7C 7D 7E 7F
   80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F
   90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F
   A0 A1 A2 A3 A4 A5 A6 A7 A8 A9 AA AB AC AD AE AF
   B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF
   41 41 41 41 5C 5B 5C 43 45 45 45 45 49 49 49 49
   44 4E 4F 4F 4F 4F 5D D7 D8 55 55 55 59 59 DE DF
   41 41 41 41 5C 5B 5C 43 45 45 45 45 49 49 49 49
   44 4E 4F 4F 4F 4F 5D F7 D8 55 55 55 59 59 DE FF
   </map>
   </collation>
   ```

3. Modifique o array `ctype` em `latin1.xml`. Altere o valor correspondente a 0x2D (que é o código para o caractere `'-'`) de 10 (ponto de pontuação) para 01 (letra maiúscula). No array a seguir, este é o elemento na quarta linha para baixo, terceiro valor da extremidade.

   ```
   <ctype>
   <map>
   00
   20 20 20 20 20 20 20 20 20 28 28 28 28 28 20 20
   20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
   48 10 10 10 10 10 10 10 10 10 10 10 10 01 10 10
   84 84 84 84 84 84 84 84 84 84 10 10 10 10 10 10
   10 81 81 81 81 81 81 01 01 01 01 01 01 01 01 01
   01 01 01 01 01 01 01 01 01 01 01 10 10 10 10 10
   10 82 82 82 82 82 82 02 02 02 02 02 02 02 02 02
   02 02 02 02 02 02 02 02 02 02 02 10 10 10 10 20
   10 00 10 02 10 10 10 10 10 10 01 10 01 00 01 00
   00 10 10 10 10 10 10 10 10 10 02 10 02 00 02 01
   48 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
   10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
   01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01
   01 01 01 01 01 01 01 10 01 01 01 01 01 01 01 02
   02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02
   02 02 02 02 02 02 02 10 02 02 02 02 02 02 02 02
   </map>
   </ctype>
   ```

4. Reinicie o servidor.
5. Para utilizar a nova codificação, inclua-a na definição das colunas que devem usá-la:

   ```
   mysql> DROP TABLE IF EXISTS t1;
   Query OK, 0 rows affected (0.13 sec)

   mysql> CREATE TABLE t1 (
       a TEXT CHARACTER SET latin1 COLLATE latin1_fulltext_ci,
       FULLTEXT INDEX(a)
       ) ENGINE=InnoDB;
   Query OK, 0 rows affected (0.47 sec)
   ```

6. Teste a ordenação para verificar se o hífen é considerado como um caractere de palavra:

   ```
   mysql> INSERT INTO t1 VALUEs ('----'),('....'),('abcd');
   Query OK, 3 rows affected (0.22 sec)
   Records: 3  Duplicates: 0  Warnings: 0

   mysql> SELECT * FROM t1 WHERE MATCH a AGAINST ('----' IN BOOLEAN MODE);
   +------+
   | a    |
   +------+
   | ---- |
   +------+
   1 row in set (0.00 sec)
   ```

### 14.9.8 Parser de Texto Completo ngram

O analisador de texto completo MySQL integrado usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não usam delimitadores de palavras. Para resolver essa limitação, o MySQL fornece um analisador de texto completo ngram que suporta chinês, japonês e coreano (CJK). O analisador de texto completo ngram é compatível para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um plugin de analisador de texto completo MeCab para japonês, que tokeniza documentos em palavras significativas. Para mais informações, consulte a Seção 14.9.9, “Plugin de Analisador de Texto Completo MeCab”.

Um ngram é uma sequência contínua de caracteres *`n`* de uma sequência dada de texto. O analisador de ngram tokeniza uma sequência de texto em uma sequência contínua de caracteres *`n`*. Por exemplo, você pode tokenizar “abcd” para diferentes valores de *`n`* usando o analisador de texto completo de ngram.

```
n=1: 'a', 'b', 'c', 'd'
n=2: 'ab', 'bc', 'cd'
n=3: 'abc', 'bcd'
n=4: 'abcd'
```

O analisador de texto completo ngram é um plugin de servidor integrado. Como outros plugins de servidor integrados, ele é carregado automaticamente quando o servidor é iniciado.

A sintaxe de pesquisa de texto completo descrita na Seção 14.9, “Funções de Pesquisa de Texto Completo”, aplica-se ao plugin de analisador de ngram. As diferenças no comportamento de análise são descritas nesta seção. As opções de configuração relacionadas ao texto completo, exceto as opções de comprimento mínimo e máximo de palavra (`innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len`, `ft_max_word_len`) também são aplicáveis.

#### Configurando o tamanho do token ngram

O analisador de ngram tem um tamanho padrão de token de ngram de 2 (bigram). Por exemplo, com um tamanho de token de 2, o analisador de ngram analisa a string “abc def” em quatro tokens: “ab”, “bc”, “de” e “ef”.

O tamanho do token ngram é configurável usando a opção de configuração `ngram_token_size`, que tem um valor mínimo de 1 e um valor máximo de 10.

Normalmente, `ngram_token_size` é definido para o tamanho do maior caractere que você deseja pesquisar. Se você só pretende pesquisar caracteres únicos, defina `ngram_token_size` para 1. Um tamanho de caractere menor produz um índice de pesquisa de texto completo menor e pesquisas mais rápidas. Se você precisar pesquisar palavras compostas por mais de um caractere, defina `ngram_token_size` conforme necessário. Por exemplo, “Feliz Aniversário” é “生日快乐” em chinês simplificado, onde “生日” é “aniversário” e “快乐” se traduz como “feliz”. Para pesquisar palavras de dois caracteres, como essas, defina `ngram_token_size` para um valor de 2 ou superior.

Como uma variável somente de leitura, `ngram_token_size` só pode ser definida como parte de uma string de inicialização ou em um arquivo de configuração:

* Cadeia de inicialização:

  ```
  mysqld --ngram_token_size=2
  ```

* Arquivo de configuração:

  ```
  [mysqld]
  ngram_token_size=2
  ```

Nota

As seguintes opções de configuração de comprimento mínimo e máximo de palavra são ignoradas para os índices `FULLTEXT` que utilizam o analisador de ngram: `innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len` e `ft_max_word_len`.

#### Criando um índice FULLTEXT que usa o parser ngram

Para criar um índice `FULLTEXT` que utilize o analisador de ngram, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

O exemplo a seguir demonstra como criar uma tabela com um índice `ngram` `FULLTEXT`, inserindo dados de amostra (texto simplificado em chinês) e visualizando dados tokenizados na tabela do esquema de informações `INNODB_FT_INDEX_CACHE`.

```
mysql> USE test;

mysql> CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT,
      FULLTEXT (title,body) WITH PARSER ngram
    ) ENGINE=InnoDB CHARACTER SET utf8mb4;

mysql> SET NAMES utf8mb4;

INSERT INTO articles (title,body) VALUES
    ('数据库管理','在本教程中我将向你展示如何管理数据库'),
    ('数据库应用开发','学习开发数据库应用程序');

mysql> SET GLOBAL innodb_ft_aux_table="test/articles";

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE ORDER BY doc_id, position;
```

Para adicionar um índice `FULLTEXT` a uma tabela existente, você pode usar `ALTER TABLE` ou `CREATE INDEX`. Por exemplo:

```
CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT
     ) ENGINE=InnoDB CHARACTER SET utf8mb4;

ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER ngram;

# Or:

CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER ngram;
```

#### Manipulação de Espaço do Parser ngram

O analisador ngram elimina espaços ao analisar. Por exemplo:

* “ab cd” é analisado como “ab”, “cd”

* “a bc” é analisado como “bc”

#### Tratamento de palavras de parada do parser ngram

O analisador de texto completo MySQL integrado compara as palavras com as entradas na lista de palavras-chave. Se uma palavra for igual a uma entrada na lista de palavras-chave, a palavra é excluída do índice. Para o analisador de ngram, o tratamento das palavras-chave é realizado de maneira diferente. Em vez de excluir tokens que são iguais a entradas na lista de palavras-chave, o analisador de ngram exclui tokens que *contem* palavras-chave. Por exemplo, assumindo `ngram_token_size=2`, um documento que contém “a,b” é analisado como “a” e “,b”. Se uma vírgula (“,”) for definida como uma palavra-chave, tanto “a,” quanto “,b” serão excluídos do índice porque contêm uma vírgula.

Por padrão, o analisador ngram usa a lista de palavras irrelevantes padrão, que contém uma lista de palavras irrelevantes em inglês. Para uma lista de palavras irrelevantes aplicável ao chinês, japonês ou coreano, você deve criar a sua própria lista. Para obter informações sobre como criar uma lista de palavras irrelevantes, consulte a Seção 14.9.4, “Palavras irrelevantes de texto completo”.

As palavras-chave maiores que `ngram_token_size` são ignoradas.

#### Parser de ngram Pesquisa de termos

Para a pesquisa em *modo de linguagem natural*, o termo de busca é convertido em uma união de termos ngram. Por exemplo, a string “abc” (assumindo `ngram_token_size=2`) é convertida em “ab bc”. Dada duas documentos, um contendo “ab” e o outro contendo “abc”, o termo de busca “ab bc” corresponde a ambos os documentos.

Para a busca no modo booleano, o termo de busca é convertido em uma busca de frase ngram. Por exemplo, a string 'abc' (assumindo `ngram_token_size=2`) é convertida em '“ab bc”’. Dadas duas documentos, um contendo 'ab' e o outro contendo 'abc', a frase de busca '“ab bc”' só corresponde ao documento que contém 'abc'.

#### Pesquisas de busca com caracteres especiais do analisador ngram

Como um índice ngram `FULLTEXT` contém apenas ngrams e não contém informações sobre o início dos termos, as pesquisas com caracteres especiais podem retornar resultados inesperados. Os seguintes comportamentos se aplicam às pesquisas com caracteres especiais usando índices de pesquisa ngram `FULLTEXT`:

* Se o termo prefixo de uma pesquisa com wildcard for mais curto que o tamanho do token ngram, a consulta retorna todas as linhas indexadas que contêm tokens ngram começando com o termo prefixo. Por exemplo, supondo `ngram_token_size=2`, uma pesquisa em “a\*” retorna todas as linhas que começam com “a”.

* Se o termo prefixo de uma pesquisa com wildcard for mais longo que o tamanho do token ngram, o termo prefixo é convertido em uma frase ngram e o operador wildcard é ignorado. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa com wildcard “abc\*” é convertida em “ab bc”.

#### Parser ngram de Pesquisa de Frases

As pesquisas de frase são convertidas em pesquisas de frase ngram. Por exemplo, a frase de pesquisa “abc” é convertida em “ab bc”, que retorna documentos que contêm “abc” e “ab bc”.

A frase de busca “abc def” é convertida em “ab bc de ef”, o que retorna documentos que contêm “abc def” e “ab bc de ef”. Um documento que contém “abcdef” não é retornado.

### 14.9.9 Plugin do analisador de texto completo MeCab

O analisador de texto completo MySQL integrado usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não usam delimitadores de palavras. Para abordar essa limitação para o japonês, o MySQL fornece um plugin de analisador de texto completo MeCab. O plugin de analisador de texto completo MeCab é compatível para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também oferece um plugin de analisador de texto completo ngram que suporta japonês. Para mais informações, consulte a Seção 14.9.8, “Analisador de Texto Completo ngram”.

O plugin de analisador de texto completo MeCab é um plugin de analisador de texto completo para japonês que tokeniza uma sequência de texto em palavras significativas. Por exemplo, o MeCab tokeniza “データベース管理” (“Gestão de Banco de Dados”) em “データベース” (“Banco de Dados”) e “管理” (“Gestão”). Em comparação, o analisador de texto completo ngram tokeniza o texto em uma sequência contínua de caracteres *`n`*, onde *`n`* representa um número entre 1 e 10.

Além de tokenizar o texto em palavras significativas, os índices do MeCab são, normalmente, menores do que os índices de ngram, e as pesquisas de texto completo do MeCab são, geralmente, mais rápidas. Uma desvantagem é que pode levar mais tempo para o analisador de texto completo do MeCab tokenizar documentos, em comparação com o analisador de texto completo de ngram.

A sintaxe de pesquisa de texto completo descrita na Seção 14.9, “Funções de Pesquisa de Texto Completo”, se aplica ao plugin de analisador MeCab. As diferenças no comportamento de análise são descritas nesta seção. As opções de configuração relacionadas ao texto completo também são aplicáveis.

Para obter informações adicionais sobre o analisador MeCab, consulte o projeto [MeCab: Yet Another Part-of-Speech and Morphological Analyzer][(http://taku910.github.io/mecab/)] no Github.

#### Instalando o Plugin do Parser MeCab

O plugin de analisador MeCab requer `mecab` e `mecab-ipadic`.

Nas plataformas Fedora, Debian e Ubuntu suportadas (exceto Ubuntu 12.04, onde a versão do sistema `mecab` é muito antiga), o MySQL vincula dinamicamente à instalação do sistema `mecab` se estiver instalado na localização padrão. Em outras plataformas Unix-like suportadas, o `libmecab.so` é vinculado estaticamente em `libpluginmecab.so`, que está localizado no diretório do plugin MySQL. O `mecab-ipadic` está incluído nos binários do MySQL e está localizado em `MYSQL_HOME\lib\mecab`.

Você pode instalar `mecab` e `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo (em Fedora, Debian e Ubuntu), ou você pode construir `mecab` e `mecab-ipadic` a partir de fonte. Para informações sobre a instalação de `mecab` e `mecab-ipadic` usando um utilitário de gerenciamento de pacotes nativo, consulte [Instalando MeCab a partir de uma distribuição binária (opcional)](fulltext-search-mecab.html#install-mecab-binary "Installing MeCab From a Binary Distribution (Optional)"). Se você deseja construir `mecab` e `mecab-ipadic` a partir de fonte, consulte [Construindo MeCab a partir de fonte (opcional)](fulltext-search-mecab.html#build-mecab-from-source "Installing MeCab From Source (Optional)").

Em Windows, `libmecab.dll` é encontrado no diretório MySQL `bin`. `mecab-ipadic` está localizado em `MYSQL_HOME/lib/mecab`.

Para instalar e configurar o plugin do analisador MeCab, realize as etapas a seguir:

1. No arquivo de configuração do MySQL, defina a opção de configuração `mecab_rc_file` para o local do arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. Se você estiver usando o pacote MeCab distribuído com o MySQL, o arquivo `mecabrc` está localizado em `MYSQL_HOME/lib/mecab/etc/`.

   ```
   [mysqld]
   loose-mecab-rc-file=MYSQL_HOME/lib/mecab/etc/mecabrc
   ```

O prefixo `loose` é um modificador de opção. A opção `mecab_rc_file` não é reconhecida pelo MySQL até que o plugin do analisador MeCaB seja instalado, mas deve ser definida antes de tentar instalar o plugin do analisador MeCaB. O prefixo `loose` permite que você reinicie o MySQL sem encontrar um erro devido a uma variável não reconhecida.

Se você usa sua própria instalação do MeCab ou constrói o MeCab a partir do código fonte, o local do arquivo de configuração `mecabrc` pode ser diferente.

Para obter informações sobre o arquivo de configuração do MySQL e sua localização, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

2. Também no arquivo de configuração do MySQL, defina o tamanho mínimo do token para 1 ou 2, que são os valores recomendados para uso com o analisador MeCab. Para as tabelas `InnoDB`, o tamanho mínimo do token é definido pela opção de configuração `innodb_ft_min_token_size`, que tem um valor padrão de 3. Para as tabelas `MyISAM`, o tamanho mínimo do token é definido por `ft_min_word_len`, que tem um valor padrão de 4.

   ```
   [mysqld]
   innodb_ft_min_token_size=1
   ```

3. Modifique o arquivo de configuração `mecabrc` para especificar o dicionário que você deseja usar. O pacote `mecab-ipadic` distribuído com os binários do MySQL inclui três dicionários (`ipadic_euc-jp`, `ipadic_sjis` e `ipadic_utf-8`). O arquivo de configuração `mecabrc` embalado com o MySQL contém uma entrada semelhante à seguinte:

   ```
   dicdir =  /path/to/mysql/lib/mecab/lib/mecab/dic/ipadic_euc-jp
   ```

Para usar o dicionário `ipadic_utf-8`, por exemplo, modifique a entrada da seguinte forma:

   ```
   dicdir=MYSQL_HOME/lib/mecab/dic/ipadic_utf-8
   ```

Se você está usando sua própria instalação do MeCab ou construiu o MeCab a partir do código fonte, a entrada padrão `dicdir` no arquivo `mecabrc` provavelmente será diferente, assim como os dicionários e sua localização.

Nota

Depois que o plugin do analisador MeCab é instalado, você pode usar a variável de status `mecab_charset` para visualizar o conjunto de caracteres usado com o MeCab. Os três dicionários MeCab fornecidos com o suporte binário do MySQL suportam os seguintes conjuntos de caracteres.

* O dicionário `ipadic_euc-jp` suporta os conjuntos de caracteres `ujis` e `eucjpms`.

* O dicionário `ipadic_sjis` suporta os conjuntos de caracteres `sjis` e `cp932`.

* O dicionário `ipadic_utf-8` suporta os conjuntos de caracteres `utf8mb3` e `utf8mb4`.

`mecab_charset` relata apenas o primeiro conjunto de caracteres suportado. Por exemplo, o dicionário `ipadic_utf-8` suporta tanto `utf8mb3` quanto `utf8mb4`. `mecab_charset` sempre relata `utf8` quando este dicionário está em uso.

4. Reinicie o MySQL.
5. Instale o plugin do analisador MeCab:

O plugin analisador MeCab é instalado usando `INSTALL PLUGIN`. O nome do plugin é `mecab`, e o nome da biblioteca compartilhada é `libpluginmecab.so`. Para informações adicionais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

   ```
   INSTALL PLUGIN mecab SONAME 'libpluginmecab.so';
   ```

Uma vez instalado, o plugin de analisador MeCab é carregado em cada reinício normal do MySQL.

6. Verifique se o plugin do analisador MeCab está carregado usando a declaração `SHOW PLUGINS`.

   ```
   mysql> SHOW PLUGINS;
   ```

Um plugin `mecab` deve aparecer na lista de plugins.

#### Criando um índice FULLTEXT que usa o analisador MeCab

Para criar um índice `FULLTEXT` que utilize o analisador mecab, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

Este exemplo demonstra a criação de uma tabela com um índice `mecab` `FULLTEXT`, inserindo dados de amostra e visualizando dados tokenizados na tabela do esquema de informações `INNODB_FT_INDEX_CACHE`:

```
mysql> USE test;

mysql> CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT,
      FULLTEXT (title,body) WITH PARSER mecab
    ) ENGINE=InnoDB CHARACTER SET utf8mb4;

mysql> SET NAMES utf8mb4;

mysql> INSERT INTO articles (title,body) VALUES
    ('データベース管理','このチュートリアルでは、私はどのようにデータベースを管理する方法を紹介します'),
    ('データベースアプリケーション開発','データベースアプリケーションを開発することを学ぶ');

mysql> SET GLOBAL innodb_ft_aux_table="test/articles";

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE ORDER BY doc_id, position;
```

Para adicionar um índice `FULLTEXT` a uma tabela existente, você pode usar `ALTER TABLE` ou `CREATE INDEX`. Por exemplo:

```
CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT
     ) ENGINE=InnoDB CHARACTER SET utf8mb4;

ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER mecab;

# Or:

CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER mecab;
```

#### Manipulação de Espaço do Parser MeCab

O analisador MeCab usa espaços como separadores em strings de consulta. Por exemplo, o analisador MeCab tokeniza データベース管理 como データベース e 管理.

#### Tratamento de palavras irrelevantes pelo MeCab Parser

Por padrão, o analisador MeCab utiliza a lista de palavras parada padrão, que contém uma lista curta de palavras parada em inglês. Para uma lista de palavras parada aplicável ao japonês, você deve criar a sua própria lista. Para obter informações sobre a criação de listas de palavras parada, consulte a Seção 14.9.4, “Palavras parada de texto completo”.

#### Pesquisa de termos do analisador MeCab

Para a busca no modo de linguagem natural, o termo de busca é convertido em uma união de tokens. Por exemplo, データベース管理 é convertido em データベース 管理.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース管理' IN NATURAL LANGUAGE MODE);
```

Para a busca no modo booleano, o termo de busca é convertido em uma frase de busca. Por exemplo, データベース管理 é convertido em データベース 管理.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース管理' IN BOOLEAN MODE);
```

#### Busca com caracteres especiais no analisador MeCab

Os termos de busca com caracteres especiais não são tokenizados. Uma busca em データベース管理\* é realizada no prefixo, データベース管理.

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('データベース*' IN BOOLEAN MODE);
```

#### Busca de Frases pelo Parser MeCab

As frases são tokenizadas. Por exemplo, "database management" é tokenizado como "database management".

```
SELECT COUNT(*) FROM articles
    WHERE MATCH(title,body) AGAINST('"データベース管理"' IN BOOLEAN MODE);
```

#### Instalando o MeCab a partir de uma distribuição binária (opcional)

Esta seção descreve como instalar `mecab` e `mecab-ipadic` a partir de uma distribuição binária usando um utilitário de gerenciamento de pacotes nativo. Por exemplo, no Fedora, você pode usar o Yum para realizar a instalação:

```
$> yum mecab-devel
```

Em Debian ou Ubuntu, você pode realizar uma instalação do APT:

```
$> apt-get install mecab
$> apt-get install mecab-ipadic
```

#### Instalando o MeCab a partir de fonte (opcional)

Se você deseja construir `mecab` e `mecab-ipadic` a partir do código fonte, os passos básicos de instalação estão fornecidos abaixo. Para informações adicionais, consulte a documentação do MeCab.

1. Faça o download dos pacotes tar.gz para `mecab` e `mecab-ipadic` a partir de <http://taku910.github.io/mecab/#download>. A partir de fevereiro de 2016, os pacotes mais recentes disponíveis são `mecab-0.996.tar.gz` e `mecab-ipadic-2.7.0-20070801.tar.gz`.

2. Instale `mecab`:

   ```
   $> tar zxfv mecab-0.996.tar
   $> cd mecab-0.996
   $> ./configure
   $> make
   $> make check
   $> su
   $> make install
   ```

3. Instale `mecab-ipadic`:

   ```
   $> tar zxfv mecab-ipadic-2.7.0-20070801.tar
   $> cd mecab-ipadic-2.7.0-20070801
   $> ./configure
   $> make
   $> su
   $> make install
   ```

4. Compile o MySQL usando a opção `WITH_MECAB` do CMake. Defina a opção `WITH_MECAB` para `system` se você instalou `mecab` e `mecab-ipadic` no local padrão.

   ```
   -DWITH_MECAB=system
   ```

Se você definiu um diretório de instalação personalizado, defina `WITH_MECAB` para o diretório personalizado. Por exemplo:

   ```
   -DWITH_MECAB=/path/to/mecab
   ```
