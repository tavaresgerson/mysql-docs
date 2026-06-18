## 14.9 Funções de pesquisa de texto completo

14.9.1 Pesquisas de Texto Completo em Linguagem Natural

14.9.2 Pesquisas de Texto Completas Booleanas

14.9.3 Pesquisas de texto completo com expansão de consulta

14.9.4 Palavras-chave completas de texto

14.9.5 Restrições de texto completo

14.9.6 Ajuste fino da pesquisa de texto completo do MySQL

14.9.7 Adicionando uma Cotação Definida pelo Usuário para Indexação de Texto Completo

14.9.8 ngram Full-Text Parser

14.9.9 Plugin do analisador de texto completo MeCab

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

- Um índice de texto completo no MySQL é um índice do tipo `FULLTEXT`.

- Os índices de texto completo só podem ser usados com tabelas `InnoDB` ou `MyISAM` e só podem ser criados para as colunas `CHAR`, `VARCHAR` ou `TEXT`.

- O MySQL oferece um analisador de ngram de texto completo integrado que suporta chinês, japonês e coreano (CJK), e um plugin de analisador de texto completo MeCab instalável para japonês. As diferenças de análise são descritas na Seção 14.9.8, “Analisador de ngram de texto completo”, e na Seção 14.9.9, “Plugin de analisador de texto completo MeCab”.

- Uma definição de índice `FULLTEXT` pode ser fornecida na declaração `CREATE TABLE` quando uma tabela é criada, ou adicionada posteriormente usando `ALTER TABLE` ou `CREATE INDEX`.

- Para conjuntos de dados grandes, é muito mais rápido carregar seus dados em uma tabela que não tenha o índice `FULLTEXT` e, em seguida, criar o índice depois disso, do que carregar dados em uma tabela que tenha um índice existente `FULLTEXT`.

A pesquisa de texto completo é realizada usando a sintaxe `MATCH() AGAINST()`. `MATCH()` recebe uma lista separada por vírgula que nomeia as colunas a serem pesquisadas. `AGAINST` recebe uma string para pesquisar e um modificador opcional que indica que tipo de pesquisa deve ser realizada. A string de pesquisa deve ser um valor de string que é constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela porque ela pode diferir para cada linha.

Anteriormente, o MySQL permitia o uso de uma coluna de agregação com `MATCH()`, mas as consultas que empregavam essa construção apresentavam desempenho ruim e resultados não confiáveis. (Isso ocorre porque `MATCH()` não é implementado como uma função de seus argumentos, mas sim como uma função do ID da linha da linha atual na varredura subjacente da tabela base.) A partir do MySQL 8.0.28, o MySQL não permite mais tais consultas; mais especificamente, qualquer consulta que corresponda a todos os critérios listados aqui é rejeitada com `ER_FULLTEXT_WITH_ROLLUP`:

- `MATCH()` aparece na lista `SELECT`, na cláusula `GROUP BY`, na cláusula `HAVING` ou na cláusula `ORDER BY` de um bloco de consulta.

- O bloco de consulta contém uma cláusula `GROUP BY ... WITH ROLLUP`.

- O argumento da chamada para a função `MATCH()` é uma das colunas de agrupamento.

Alguns exemplos dessas consultas estão mostrados aqui:

```
# MATCH() in SELECT list...
SELECT MATCH (a) AGAINST ('abc') FROM t GROUP BY a WITH ROLLUP;
SELECT 1 FROM t GROUP BY a, MATCH (a) AGAINST ('abc') WITH ROLLUP;

# ...in HAVING clause...
SELECT 1 FROM t GROUP BY a WITH ROLLUP HAVING MATCH (a) AGAINST ('abc');

# ...and in ORDER BY clause
SELECT 1 FROM t GROUP BY a WITH ROLLUP ORDER BY MATCH (a) AGAINST ('abc');
```

O uso de `MATCH()` com uma coluna de agrupamento na cláusula `WHERE` é permitido.

Existem três tipos de pesquisas de texto completo:

- Uma pesquisa em linguagem natural interpreta a cadeia de busca como uma frase em linguagem humana natural (uma frase em texto livre). Não há operadores especiais, com exceção dos caracteres de aspas duplas ("). A lista de palavras-chave não usadas se aplica. Para obter mais informações sobre listas de palavras-chave não usadas, consulte a Seção 14.9.4, “Palavras-chave não usadas para pesquisa de texto completo”.

  As pesquisas de texto completo são pesquisas em linguagem natural se o modificador `IN NATURAL LANGUAGE MODE` for fornecido ou se nenhum modificador for fornecido. Para mais informações, consulte a Seção 14.9.1, “Pesquisas de Texto Completo em Linguagem Natural”.

- Uma pesquisa booleana interpreta a string de pesquisa usando as regras de uma linguagem de consulta especial. A string contém as palavras a serem pesquisadas. Também pode conter operadores que especificam requisitos, como a presença ou ausência de uma palavra em linhas correspondentes, ou que ela deve ser ponderada mais alta ou mais baixa do que o usual. Algumas palavras comuns (stopwords) são omitidas do índice de pesquisa e não correspondem se estiverem presentes na string de pesquisa. O modificador `IN BOOLEAN MODE` especifica uma pesquisa booleana. Para mais informações, consulte a Seção 14.9.2, “Pesquisas de Texto Completo Booleanas”.

- Uma pesquisa de expansão de consulta é uma modificação de uma pesquisa de linguagem natural. A string de pesquisa é usada para realizar uma pesquisa de linguagem natural. Em seguida, palavras das linhas mais relevantes retornadas pela pesquisa são adicionadas à string de pesquisa e a pesquisa é realizada novamente. A consulta retorna as linhas da segunda pesquisa. O modificador `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` ou `WITH QUERY EXPANSION` especifica uma pesquisa de expansão de consulta. Para mais informações, consulte a Seção 14.9.3, “Pesquisas de Texto Completo com Expansão de Consulta”.

Para obter informações sobre o desempenho da consulta `FULLTEXT`, consulte a Seção 10.3.5, “Índices de Colunas”.

Para obter mais informações sobre os índices `InnoDB` `FULLTEXT`, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”.

As restrições para a pesquisa de texto completo estão listadas na Seção 14.9.5, “Restrições de Texto Completo”.

O utilitário **myisam\_ftdump** descarrega o conteúdo de um índice de texto completo `MyISAM`. Isso pode ser útil para depuração de consultas de texto completo. Veja a Seção 6.6.3, “myisam\_ftdump — Exibir informações do índice de texto completo”.
