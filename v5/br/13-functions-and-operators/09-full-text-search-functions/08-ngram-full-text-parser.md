### 12.9.8 Parser de Texto Completo ngram

O analisador de texto completo MySQL integrado usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não usam delimitadores de palavras. Para resolver essa limitação, o MySQL fornece um analisador de texto completo ngram que suporta chinês, japonês e coreano (CJK). O analisador de texto completo ngram é suportado para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um plugin de analisador de texto completo MeCab para japonês, que tokeniza documentos em palavras significativas. Para mais informações, consulte a Seção 12.9.9, “Plugin de Analisador de Texto Completo MeCab”.

Um ngram é uma sequência contínua de *`n`* caracteres de uma sequência dada de texto. O analisador de ngrams tokeniza uma sequência de texto em uma sequência contínua de *`n`* caracteres. Por exemplo, você pode tokenizar “abcd” para diferentes valores de *`n`* usando o analisador de texto completo de ngrams.

```sql
n=1: 'a', 'b', 'c', 'd'
n=2: 'ab', 'bc', 'cd'
n=3: 'abc', 'bcd'
n=4: 'abcd'
```

O analisador de texto completo ngram é um plugin de servidor integrado. Como outros plugins de servidor integrados, ele é carregado automaticamente quando o servidor é iniciado.

A sintaxe de pesquisa de texto completo descrita na Seção 12.9, “Funções de Pesquisa de Texto Completo”, aplica-se ao plugin de analisador de ngram. As diferenças no comportamento de análise são descritas nesta seção. As opções de configuração relacionadas ao texto completo, exceto as opções de comprimento mínimo e máximo de palavras (`innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len`, `ft_max_word_len`) também são aplicáveis.

#### Configurando o tamanho do token ngram

O analisador de ngrams tem um tamanho padrão de token de ngram de 2 (bigram). Por exemplo, com um tamanho de token de 2, o analisador de ngrams analisa a string “abc def” em quatro tokens: “ab”, “bc”, “de” e “ef”.

O tamanho do token ngram é configurável usando a opção de configuração `ngram_token_size`, que tem um valor mínimo de 1 e um valor máximo de 10.

Normalmente, o `ngram_token_size` é definido para o tamanho do token mais grande que você deseja pesquisar. Se você só pretende pesquisar por caracteres individuais, defina `ngram_token_size` para 1. Um tamanho de token menor produz um índice de pesquisa de texto completo menor e pesquisas mais rápidas. Se você precisar pesquisar por palavras compostas por mais de um caractere, defina `ngram_token_size` conforme necessário. Por exemplo, “Feliz Aniversário” é “生日快乐” em chinês simplificado, onde “生日” é “aniversário” e “快乐” se traduz como “feliz”. Para pesquisar por palavras de dois caracteres, como essas, defina `ngram_token_size` para um valor de 2 ou superior.

Como uma variável somente de leitura, `ngram_token_size` só pode ser definida como parte de uma string de inicialização ou em um arquivo de configuração:

- String de inicialização:

  ```sql
  mysqld --ngram_token_size=2
  ```

- Arquivo de configuração:

  ```sql
  [mysqld]
  ngram_token_size=2
  ```

Nota

As seguintes opções de configuração de comprimento mínimo e máximo de palavras são ignoradas para índices `FULLTEXT` que utilizam o analisador ngram: `innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len` e `ft_max_word_len`.

#### Criando um índice FULLTEXT que usa o analisador ngram

Para criar um índice `FULLTEXT` que use o analisador ngram, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

O exemplo a seguir demonstra como criar uma tabela com um índice `ngram` `FULLTEXT`, inserir dados de exemplo (texto simplificado chinês) e visualizar dados tokenizados na tabela do esquema de informações `INNODB_FT_INDEX_CACHE`.

```sql
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

```sql
CREATE TABLE articles (
      id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
      title VARCHAR(200),
      body TEXT
     ) ENGINE=InnoDB CHARACTER SET utf8;

ALTER TABLE articles ADD FULLTEXT INDEX ft_index (title,body) WITH PARSER ngram;

# Or:

CREATE FULLTEXT INDEX ft_index ON articles (title,body) WITH PARSER ngram;
```

#### Parser ngram Gerenciamento de Espaço

O analisador ngram elimina espaços durante a análise. Por exemplo:

- “ab cd” é analisado como “ab”, “cd”

- “a bc” é analisado como “bc”

#### Tratamento de palavras-chave de parada do analisador ngram

O analisador de texto completo MySQL integrado compara as palavras com as entradas na lista de palavras-chave. Se uma palavra for igual a uma entrada na lista de palavras-chave, a palavra é excluída do índice. Para o analisador de n-gramas, o tratamento das palavras-chave é realizado de maneira diferente. Em vez de excluir tokens que são iguais a entradas na lista de palavras-chave, o analisador de n-gramas exclui tokens que *contem* palavras-chave. Por exemplo, assumindo `ngram_token_size=2`, um documento que contém “a,b” é analisado para “a,” e “,b”. Se uma vírgula (“,”) for definida como uma palavra-chave, tanto “a,” quanto “,b” serão excluídos do índice porque contêm uma vírgula.

Por padrão, o analisador ngram usa a lista de palavras-chave padrão, que contém uma lista de palavras-chave em inglês. Para uma lista de palavras-chave aplicável ao chinês, japonês ou coreano, você deve criar a sua própria lista. Para obter informações sobre como criar uma lista de palavras-chave, consulte a Seção 12.9.4, “Palavras-chave de Texto Completo”.

As palavras-chave maiores que o tamanho do `ngram_token_size` são ignoradas.

#### Pesquisar termos do Parser ngram

Para a pesquisa no modo de linguagem natural, o termo de busca é convertido em uma união de termos ngram. Por exemplo, a string “abc” (assumindo `ngram_token_size=2`) é convertida em “ab bc”. Dados dois documentos, um contendo “ab” e outro contendo “abc”, o termo de busca “ab bc” corresponde a ambos os documentos.

Para a pesquisa no modo *booleano*, o termo de busca é convertido em uma pesquisa de frase ngram. Por exemplo, a string 'abc' (assumindo `ngram_token_size=2`) é convertida em '“ab bc”’. Dados dois documentos, um contendo 'ab' e outro contendo 'abc', a frase de busca '“ab bc”' só corresponde ao documento que contém 'abc'.

#### Pesquisar por palavras-chave com o analisador ngram

Como um índice `FULLTEXT` de ngrams contém apenas ngrams e não contém informações sobre o início dos termos, as pesquisas com caracteres curinga podem retornar resultados inesperados. Os seguintes comportamentos se aplicam às pesquisas com caracteres curinga usando índices de pesquisa `FULLTEXT` de ngrams:

- Se o termo prefixo de uma pesquisa com wildcard for menor que o tamanho do token ngram, a consulta retorna todas as linhas indexadas que contêm tokens ngram começando com o termo prefixo. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa em “a\*” retorna todas as linhas que começam com “a”.

- Se o termo prefixo de uma pesquisa com wildcard for mais longo que o tamanho do token ngram, o termo prefixo é convertido em uma frase ngram e o operador wildcard é ignorado. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa com wildcard “abc\*” é convertida em “ab bc”.

#### ngram Parser Pesquisa de Frases

As pesquisas por frase são convertidas em pesquisas por ngram de frase. Por exemplo, a frase de pesquisa “abc” é convertida em “ab bc”, o que retorna documentos que contêm “abc” e “ab bc”.

A frase de busca “abc def” é convertida em “ab bc de ef”, o que retorna documentos que contêm “abc def” e “ab bc de ef”. Um documento que contém “abcdef” não é retornado.
