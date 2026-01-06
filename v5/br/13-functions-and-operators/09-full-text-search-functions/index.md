## 12.9 Funções de pesquisa de texto completo

12.9.1 Pesquisas de Texto Completo em Linguagem Natural

12.9.2 Pesquisas de Texto Completas Booleanas

12.9.3 Pesquisas de texto completo com expansão de consulta

12.9.4 Palavras-chave completas de texto

12.9.5 Restrições de texto completo

12.9.6 Ajuste fino da pesquisa de texto completo do MySQL

12.9.7 Adicionando uma Cotação Definida pelo Usuário para Indexação de Texto Completo

12.9.8 ngram Full-Text Parser

12.9.9 Plugin do analisador de texto completo MeCab

`MATCH (col1,col2,...) CONTRA (expr [modificador de pesquisa])`

```sql
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

- Os índices de texto completo só podem ser usados com tabelas `InnoDB` ou `MyISAM` e só podem ser criados para colunas `CHAR`, `VARCHAR` ou `TEXT`.

- O MySQL oferece um analisador de ngram de texto completo integrado que suporta chinês, japonês e coreano (CJK), e um plugin de analisador de texto completo MeCab instalável para japonês. As diferenças de análise são descritas na Seção 12.9.8, “Analisador de ngram de texto completo”, e na Seção 12.9.9, “Plugin de analisador de texto completo MeCab”.

- Uma definição de índice `FULLTEXT` pode ser dada na instrução `CREATE TABLE` quando uma tabela é criada, ou adicionada posteriormente usando `ALTER TABLE` ou `CREATE INDEX`.

- Para conjuntos de dados grandes, é muito mais rápido carregar seus dados em uma tabela que não tenha um índice `FULLTEXT` e, em seguida, criar o índice depois disso, do que carregar dados em uma tabela que tenha um índice `FULLTEXT` existente.

A pesquisa de texto completo é realizada usando a sintaxe `MATCH() CONTRA()`. `MATCH()` recebe uma lista separada por vírgula que nomeia as colunas a serem pesquisadas. `CONTRAS` recebe uma string para pesquisar e um modificador opcional que indica que tipo de pesquisa deve ser realizada. A string de pesquisa deve ser um valor de string que é constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela porque ela pode diferir para cada linha.

Existem três tipos de pesquisas de texto completo:

- Uma pesquisa em linguagem natural interpreta a cadeia de busca como uma frase em linguagem humana natural (uma frase em texto livre). Não há operadores especiais, com exceção dos caracteres de aspas duplas ("). A lista de palavras-chave não usadas se aplica. Para obter mais informações sobre listas de palavras-chave não usadas, consulte a Seção 12.9.4, “Palavras-chave não usadas para pesquisa de texto completo”.

  As pesquisas de texto completo são pesquisas em linguagem natural se o modificador `EM MODO DE LINGUAGEM NATURAL` for fornecido ou se nenhum modificador for fornecido. Para mais informações, consulte a Seção 12.9.1, “Pesquisas de Texto Completo em Linguagem Natural”.

- Uma pesquisa booleana interpreta a string de pesquisa usando as regras de uma linguagem de consulta especial. A string contém as palavras a serem pesquisadas. Também pode conter operadores que especificam requisitos, como a presença ou ausência de uma palavra em linhas correspondentes, ou que ela deve ser ponderada mais alta ou mais baixa do que o usual. Algumas palavras comuns (palavras-chave) são omitidas do índice de pesquisa e não correspondem se estiverem presentes na string de pesquisa. O modificador `IN BOOLEAN MODE` especifica uma pesquisa booleana. Para mais informações, consulte a Seção 12.9.2, “Pesquisas de Texto Completas Booleanas”.

- Uma pesquisa de expansão de consulta é uma modificação de uma pesquisa de linguagem natural. A string de pesquisa é usada para realizar uma pesquisa de linguagem natural. Em seguida, palavras das linhas mais relevantes retornadas pela pesquisa são adicionadas à string de pesquisa e a pesquisa é realizada novamente. A consulta retorna as linhas da segunda pesquisa. O modificador `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` ou `WITH QUERY EXPANSION` especifica uma pesquisa de expansão de consulta. Para mais informações, consulte a Seção 12.9.3, “Pesquisas de Texto Completo com Expansão de Consulta”.

Para obter informações sobre o desempenho das consultas `FULLTEXT`, consulte a Seção 8.3.4, “Índices de Colunas”.

Para obter mais informações sobre os índices `FULLTEXT` do `InnoDB`, consulte a Seção 14.6.2.4, “Índices Full-Text do InnoDB”.

As restrições para a pesquisa de texto completo estão listadas na Seção 12.9.5, “Restrições de Texto Completo”.

O utilitário **myisam\_ftdump** descarrega o conteúdo de um índice de texto completo `MyISAM`. Isso pode ser útil para depuração de consultas de texto completo. Veja a Seção 4.6.2, “myisam\_ftdump — Exibir informações do índice de texto completo”.
