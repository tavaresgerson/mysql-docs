## Funções de Busca de Texto Completo

`MATCH (col1,col2,...) AGAINST (expr [search_modifier])`

```
search_modifier:
  {
       IN NATURAL LANGUAGE MODE
     | IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
     | IN BOOLEAN MODE
     | WITH QUERY EXPANSION
  }
```

O MySQL oferece suporte para indexação e busca de texto completo:

* Um índice de texto completo no MySQL é um índice do tipo `FULLTEXT`.
* Índices de texto completo podem ser usados apenas com tabelas `InnoDB` ou `MyISAM`, e podem ser criados apenas para colunas `CHAR`, `VARCHAR` ou `TEXT`.
* O MySQL fornece um analisador de ngram de texto completo integrado que suporta chinês, japonês e coreano (CJK), e um plugin de analisador de texto completo MeCab instalável para japonês. As diferenças de análise são descritas na Seção 14.9.8, “Analisador de ngram de texto completo”, e na Seção 14.9.9, “Plugin de analisador de texto completo MeCab”.
* A definição de índice `FULLTEXT` pode ser dada na instrução `CREATE TABLE` ao criar uma tabela, ou adicionada posteriormente usando `ALTER TABLE` ou `CREATE INDEX`.
* Para conjuntos de dados grandes, é muito mais rápido carregar seus dados em uma tabela que não tenha um índice `FULLTEXT` e, em seguida, criar o índice depois disso, do que carregar dados em uma tabela que tenha um índice `FULLTEXT` existente.

A busca de texto completo é realizada usando a sintaxe `MATCH() AGAINST()`. `MATCH()` recebe uma lista separada por vírgula que nomeia as colunas a serem pesquisadas. `AGAINST` recebe uma string para pesquisar e um modificador opcional que indica que tipo de busca deve ser realizada. A string de busca deve ser um valor de string que é constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela porque ela pode diferir para cada linha.

O MySQL não permite o uso de uma coluna de resumo com `MATCH`; mais especificamente, qualquer consulta que corresponda a todos os critérios listados aqui é rejeitada com `ER_FULLTEXT_WITH_ROLLUP`:

* `MATCH()` aparece na lista `SELECT`, na cláusula `GROUP BY`, na cláusula `HAVING` ou na cláusula `ORDER BY` de um bloco de consulta.
* O bloco de consulta contém uma cláusula `GROUP BY ... WITH ROLLUP`.
* O argumento da chamada para a função `MATCH()` é uma das colunas de agrupamento.

Alguns exemplos de tais consultas são mostrados aqui:

```
# MATCH() in SELECT list...
SELECT MATCH (a) AGAINST ('abc') FROM t GROUP BY a WITH ROLLUP;
SELECT 1 FROM t GROUP BY a, MATCH (a) AGAINST ('abc') WITH ROLLUP;

# ...in HAVING clause...
SELECT 1 FROM t GROUP BY a WITH ROLLUP HAVING MATCH (a) AGAINST ('abc');

# ...and in ORDER BY clause
SELECT 1 FROM t GROUP BY a WITH ROLLUP ORDER BY MATCH (a) AGAINST ('abc');
```

O uso de `MATCH()` com uma coluna de agregação na cláusula `WHERE` é permitido.

Existem três tipos de buscas de texto completo:

* Uma busca de linguagem natural interpreta a string de busca como uma frase em linguagem humana natural (uma frase em texto livre). Não há operadores especiais, com exceção dos caracteres de aspas duplas ("). A lista de palavras-chave não usadas aplica-se. Para mais informações sobre listas de palavras-chave não usadas, consulte a Seção 14.9.4, “Palavras-chave não usadas de texto completo”.

As buscas de texto completo são buscas de linguagem natural se o modificador `IN MODO DE LINGUAGEM NATURAL` for fornecido ou se nenhum modificador for fornecido. Para mais informações, consulte a Seção 14.9.1, “Buscas de texto completo de linguagem natural”.
* Uma busca booleana interpreta a string de busca usando as regras de uma linguagem de consulta especial. A string contém as palavras a serem pesquisadas. Também pode conter operadores que especificam requisitos, como que uma palavra deve estar presente ou ausente em linhas correspondentes, ou que deve ser ponderada mais alta ou mais baixa do que o usual. Algumas palavras comuns (palavras-chave não usadas) são omitidas do índice de busca e não correspondem se estiverem presentes na string de busca. O modificador `IN MODO BOOLEANO` especifica uma busca booleana. Para mais informações, consulte a Seção 14.9.2, “Buscas de texto completo booleanas”.
* Uma busca de expansão de consulta é uma modificação de uma busca de linguagem natural. A string de busca é usada para realizar uma busca de linguagem natural. Em seguida, palavras das linhas mais relevantes retornadas pela busca são adicionadas à string de busca e a busca é realizada novamente. A consulta retorna as linhas da segunda busca. O modificador `IN MODO DE LINGUAGEM NATURAL COM EXPANSÃO DE CONSULTA` ou `COM EXPANSÃO DE CONSULTA` especifica uma busca de expansão de consulta. Para mais informações, consulte a Seção 14.9.3, “Buscas de texto completo com expansão de consulta”.

Para informações sobre o desempenho das consultas `FULLTEXT`, consulte a Seção 10.3.5, “Indeks de colunas”.

Para mais informações sobre índices `FULLTEXT` de `InnoDB`, consulte a Seção 17.6.2.4, “Indekses de texto completo InnoDB”.

As restrições para a pesquisa de texto completo estão listadas na Seção 14.9.5, “Restrições de Texto Completo”.

O utilitário `myisam_ftdump` exibe o conteúdo de um índice de texto completo `MyISAM`. Isso pode ser útil para depuração de consultas de texto completo. Veja a Seção 6.6.3, “myisam_ftdump — Exibir informações do índice de texto completo”.