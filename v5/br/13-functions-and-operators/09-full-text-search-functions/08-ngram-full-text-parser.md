### 12.9.8 Parser Full-Text ngram

O parser full-text embutido do MySQL usa o espaço em branco entre as palavras como um delimitador para determinar onde as palavras começam e terminam, o que é uma limitação ao trabalhar com idiomas ideográficos que não utilizam delimitadores de palavras. Para resolver essa limitação, o MySQL fornece um parser full-text ngram que oferece suporte a Chinês, Japonês e Coreano (CJK). O parser full-text ngram tem suporte para uso com `InnoDB` e `MyISAM`.

Nota

O MySQL também fornece um plugin de parser full-text MeCab para Japonês, que tokeniza documentos em palavras significativas. Para mais informações, consulte a Seção 12.9.9, “MeCab Full-Text Parser Plugin”.

Um ngram é uma sequência contígua de *`n`* caracteres a partir de uma dada sequência de texto. O parser ngram tokeniza uma sequência de texto em uma sequência contígua de *`n`* caracteres. Por exemplo, você pode tokenizar “abcd” para diferentes valores de *`n`* usando o parser full-text ngram.

```sql
n=1: 'a', 'b', 'c', 'd'
n=2: 'ab', 'bc', 'cd'
n=3: 'abc', 'bcd'
n=4: 'abcd'
```

O parser full-text ngram é um plugin de servidor embutido. Assim como outros plugins de servidor embutidos, ele é carregado automaticamente quando o servidor é iniciado.

A sintaxe de full-text search descrita na Seção 12.9, “Full-Text Search Functions”, se aplica ao plugin de parser ngram. As diferenças no comportamento de parsing são descritas nesta seção. Opções de configuração relacionadas a full-text, exceto as opções de comprimento mínimo e máximo de palavra (`innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len`, e `ft_max_word_len`), também são aplicáveis.

#### Configurando o Token Size do ngram

O parser ngram possui um ngram token size padrão de 2 (bigram). Por exemplo, com um token size de 2, o parser ngram analisa a string “abc def” em quatro tokens: “ab”, “bc”, “de” e “ef”.

O ngram token size é configurável usando a opção de configuração `ngram_token_size`, que tem um valor mínimo de 1 e máximo de 10.

Tipicamente, `ngram_token_size` é configurado para o tamanho do maior token que você deseja pesquisar. Se você pretende pesquisar apenas por caracteres únicos, defina `ngram_token_size` como 1. Um token size menor produz um Index full-text search menor e pesquisas mais rápidas. Se você precisar pesquisar por palavras compostas por mais de um caractere, defina `ngram_token_size` de acordo. Por exemplo, “Happy Birthday” é “生日快乐” em chinês simplificado, onde “生日” é “birthday” e “快乐” se traduz como “happy”. Para pesquisar por palavras de dois caracteres como estas, defina `ngram_token_size` para um valor de 2 ou superior.

Como uma variável somente leitura, `ngram_token_size` só pode ser definida como parte de uma string de inicialização ou em um arquivo de configuração:

* String de inicialização:

  ```sql
  mysqld --ngram_token_size=2
  ```

* Arquivo de configuração:

  ```sql
  [mysqld]
  ngram_token_size=2
  ```

Nota

As seguintes opções de configuração de comprimento mínimo e máximo de palavra são ignoradas para Indexes `FULLTEXT` que usam o parser ngram: `innodb_ft_min_token_size`, `innodb_ft_max_token_size`, `ft_min_word_len`, e `ft_max_word_len`.

#### Criando um Index FULLTEXT que Usa o Parser ngram

Para criar um Index `FULLTEXT` que usa o parser ngram, especifique `WITH PARSER ngram` com `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`.

O exemplo a seguir demonstra a criação de uma tabela com um Index `FULLTEXT` `ngram`, a inserção de dados de amostra (texto em Chinês Simplificado) e a visualização dos dados tokenizados na tabela `INNODB_FT_INDEX_CACHE` do Information Schema.

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

Para adicionar um Index `FULLTEXT` a uma tabela existente, você pode usar `ALTER TABLE` ou `CREATE INDEX`. Por exemplo:

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

#### Tratamento de Espaços pelo Parser ngram

O parser ngram elimina espaços durante o parsing. Por exemplo:

* “ab cd” é analisado como “ab”, “cd”

* “a bc” é analisado como “bc”

#### Tratamento de Stopwords pelo Parser ngram

O parser full-text embutido do MySQL compara palavras com entradas na lista de stopword. Se uma palavra for igual a uma entrada na lista de stopword, a palavra é excluída do Index. Para o parser ngram, o tratamento de stopword é realizado de forma diferente. Em vez de excluir tokens que são iguais a entradas na lista de stopword, o parser ngram exclui tokens que *contêm* stopwords. Por exemplo, assumindo `ngram_token_size=2`, um documento que contém “a,b” é analisado como “a,” e “,b”. Se uma vírgula (“,”) for definida como uma stopword, ambos “a,” e “,b” serão excluídos do Index porque contêm uma vírgula.

Por padrão, o parser ngram usa a lista de stopword padrão, que contém uma lista de stopwords em Inglês. Para uma lista de stopword aplicável a Chinês, Japonês ou Coreano, você deve criar a sua própria. Para informações sobre como criar uma lista de stopword, consulte a Seção 12.9.4, “Full-Text Stopwords”.

Stopwords com comprimento maior do que `ngram_token_size` são ignoradas.

#### Pesquisa de Termos pelo Parser ngram

Para a pesquisa em *natural language mode*, o termo de pesquisa é convertido em uma união de termos ngram. Por exemplo, a string “abc” (assumindo `ngram_token_size=2`) é convertida para “ab bc”. Dados dois documentos, um contendo “ab” e o outro contendo “abc”, o termo de pesquisa “ab bc” corresponde a ambos os documentos.

Para a pesquisa em *boolean mode*, o termo de pesquisa é convertido em uma ngram phrase search. Por exemplo, a string 'abc' (assumindo `ngram_token_size=2`) é convertida para '“ab bc”'. Dados dois documentos, um contendo 'ab' e o outro contendo 'abc', a search phrase '“ab bc”' corresponde apenas ao documento contendo 'abc'.

#### Pesquisa Wildcard pelo Parser ngram

Como um Index `FULLTEXT` ngram contém apenas ngrams e não contém informações sobre o início dos termos, as pesquisas wildcard podem retornar resultados inesperados. Os seguintes comportamentos se aplicam às pesquisas wildcard usando Indexes de full-text search ngram:

* Se o termo prefixo de uma pesquisa wildcard for menor que o ngram token size, a Query retorna todas as linhas indexadas que contêm tokens ngram começando com o termo prefixo. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa em “a\*” retorna todas as linhas que começam com “a”.

* Se o termo prefixo de uma pesquisa wildcard for maior que o ngram token size, o termo prefixo é convertido em uma phrase ngram e o operador wildcard é ignorado. Por exemplo, assumindo `ngram_token_size=2`, uma pesquisa wildcard “abc\*” é convertida para “ab bc”.

#### Pesquisa por Phrase pelo Parser ngram

Phrase searches (pesquisas por frase) são convertidas em ngram phrase searches. Por exemplo, a search phrase “abc” é convertida para “ab bc”, que retorna documentos contendo “abc” e “ab bc”.

A search phrase “abc def” é convertida para “ab bc de ef”, que retorna documentos contendo “abc def” e “ab bc de ef”. Um documento que contém “abcdef” não é retornado.