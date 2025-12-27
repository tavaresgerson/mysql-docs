### 14.9.8 Parser de Texto Completo ngram

O parser de texto completo integrado do MySQL usa o espaço em branco entre as palavras como delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não usam delimitadores de palavras. Para resolver essa limitação, o MySQL fornece um parser de texto completo ngram que suporta chinês, japonês e coreano (CJK). O parser de texto completo ngram é suportado para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um plugin de parser de texto completo MeCab para japonês, que tokeniza documentos em palavras significativas. Para mais informações, consulte a Seção 14.9.9, “Plugin de Parser de Texto Completo MeCab”.

Um ngram é uma sequência contínua de *`n`* caracteres de uma sequência dada de texto. O parser de ngram tokeniza uma sequência de texto em uma sequência contínua de *`n`* caracteres. Por exemplo, você pode tokenizar “abcd” para diferentes valores de *`n`* usando o parser de texto completo ngram.

```
n=1: 'a', 'b', 'c', 'd'
n=2: 'ab', 'bc', 'cd'
n=3: 'abc', 'bcd'
n=4: 'abcd'
```

O parser de texto completo ngram é um plugin de servidor integrado. Como com outros plugins de servidor integrados, ele é carregado automaticamente quando o servidor é iniciado.

A sintaxe de pesquisa de texto completo descrita na Seção 14.9, “Funções de Pesquisa de Texto Completo” se aplica ao plugin de parser de texto completo ngram. Diferenças no comportamento de parsing são descritas nesta seção. As opções de configuração relacionadas ao texto completo, exceto as opções de comprimento mínimo e máximo de palavra (`innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len`, `ft_max_word_len`) também são aplicáveis.

#### Configurando o Tamanho do Token ngram

O parser de ngram tem um tamanho de token de ngram padrão de 2 (bigram). Por exemplo, com um tamanho de token de 2, o parser de ngram tokeniza a string “abc def” em quatro tokens: “ab”, “bc”, “de” e “ef”.

O tamanho do token ngram é configurável usando a opção de configuração `ngram_token_size`, que tem um valor mínimo de 1 e um valor máximo de 10.

Tipicamente, `ngram_token_size` é definido para o tamanho do token maior que você deseja pesquisar. Se você só pretende pesquisar por caracteres únicos, defina `ngram_token_size` para 1. Um tamanho de token menor produz um índice de pesquisa de texto completo menor e pesquisas mais rápidas. Se você precisar pesquisar por palavras compostas por mais de um caractere, defina `ngram_token_size` conforme necessário. Por exemplo, “Feliz Aniversário” é “生日快乐” em chinês simplificado, onde “生日” é “aniversário” e “快乐” se traduz como “feliz”. Para pesquisar por palavras de dois caracteres, como essas, defina `ngram_token_size` para um valor de 2 ou superior.

Como uma variável de leitura somente para leitura, `ngram_token_size` só pode ser definido como parte de uma string de inicialização ou em um arquivo de configuração:

* String de inicialização:

  ```
  mysqld --ngram_token_size=2
  ```

* Arquivo de configuração:

  ```
  [mysqld]
  ngram_token_size=2
  ```

Observação

As seguintes opções de configuração de comprimento mínimo e máximo de palavra são ignoradas para índices `FULLTEXT` que usam o analisador ngram: `innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len` e `ft_max_word_len`.

#### Criando um Índice `FULLTEXT` que Usa o Analisador ngram

Para criar um índice `FULLTEXT` que usa o analisador ngram, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

O seguinte exemplo demonstra a criação de uma tabela com um índice `FULLTEXT` `ngram`, inserindo dados de amostra (texto em chinês simplificado) e visualizando dados tokenizados na tabela `INNODB_FT_INDEX_CACHE` do Schema de Informações.

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

#### Gerenciamento de Espaço do Analisador ngram
Portuguese (Brazilian):

O analisador de ngrams elimina espaços ao analisar. Por exemplo:

* “ab cd” é analisado como “ab”, “cd”

* “a bc” é analisado como “bc”

#### Tratamento de Stopwords no Analisador de ngrams

O analisador de texto completo do MySQL integrado compara as palavras com entradas na lista de stopwords. Se uma palavra for igual a uma entrada na lista de stopwords, a palavra é excluída do índice. Para o analisador de ngrams, o tratamento de stopwords é realizado de maneira diferente. Em vez de excluir tokens que são iguais a entradas na lista de stopwords, o analisador de ngrams exclui tokens que *contem* stopwords. Por exemplo, assumindo `ngram_token_size=2`, um documento que contém “a,b” é analisado como “a,” e “,b”. Se uma vírgula (“,”) for definida como um stopword, tanto “a,” quanto “,b” serão excluídos do índice porque contêm uma vírgula.

Por padrão, o analisador de ngrams usa a lista de stopwords padrão, que contém uma lista de stopwords em inglês. Para uma lista de stopwords aplicável ao chinês, japonês ou coreano, você deve criar a sua própria. Para obter informações sobre como criar uma lista de stopwords, consulte a Seção 14.9.4, “Stopwords de Texto Completo”.

Stopwords maiores que `ngram_token_size` são ignorados.

#### Busca por Termos no Analisador de ngrams

Para a busca no modo *linguagem natural*, o termo de busca é convertido em uma união de termos de ngrams. Por exemplo, a string “abc” (assumindo `ngram_token_size=2`) é convertida em “ab bc”. Dadas duas documentos, um contendo “ab” e outro contendo “abc”, o termo de busca “ab bc” corresponde a ambos os documentos.

Para a busca no modo *modo booleano*, o termo de busca é convertido em uma busca de frase de ngrams. Por exemplo, a string 'abc' (assumindo `ngram_token_size=2`) é convertida em '“ab bc”’. Dadas duas documentos, um contendo 'ab' e outro contendo 'abc', a frase de busca '“ab bc”' só corresponde ao documento que contém 'abc'.

#### Busca com Caractere Especial no Analisador de ngrams

Como um índice `FULLTEXT` de ngram contém apenas ngrams e não contém informações sobre o início dos termos, as pesquisas com caracteres curinga podem retornar resultados inesperados. Os seguintes comportamentos se aplicam às pesquisas com caracteres curinga usando índices de pesquisa de ngram `FULLTEXT`:

* Se o termo prefixo de uma pesquisa com caracteres curinga for mais curto que o tamanho do token de ngram, a consulta retorna todas as linhas indexadas que contêm tokens de ngram começando com o termo prefixo. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa em “a\*” retorna todas as linhas que começam com “a”.

* Se o termo prefixo de uma pesquisa com caracteres curinga for mais longo que o tamanho do token de ngram, o termo prefixo é convertido em uma frase de ngram e o operador de caracteres curinga é ignorado. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa com caracteres curinga “abc\*” é convertida em “ab bc”.

#### Pesquisa de Frases de Parser de Ngram

As pesquisas de frases são convertidas em pesquisas de frases de ngram. Por exemplo, a frase de pesquisa “abc” é convertida em “ab bc”, o que retorna documentos que contêm “abc” e “ab bc”.

A frase de pesquisa “abc def” é convertida em “ab bc de ef”, o que retorna documentos que contêm “abc def” e “ab bc de ef”. Um documento que contém “abcdef” não é retornado.