## 12.9 Funções de Busca Full-Text

12.9.1 Buscas Full-Text em Linguagem Natural

12.9.2 Buscas Full-Text Booleanas

12.9.3 Buscas Full-Text com Expansão de Query

12.9.4 Stopwords Full-Text

12.9.5 Restrições Full-Text

12.9.6 Ajustando a Busca Full-Text do MySQL

12.9.7 Adicionando uma Collation Definida pelo Usuário para Indexação Full-Text

12.9.8 Parser Full-Text ngram

12.9.9 Plugin Parser Full-Text MeCab

`MATCH (col1,col2,...) AGAINST (expr [search_modifier])`

```sql
search_modifier:
  {
       IN NATURAL LANGUAGE MODE
     | IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
     | IN BOOLEAN MODE
     | WITH QUERY EXPANSION
  }
```

O MySQL oferece suporte para indexação e busca full-text:

*   Um Index full-text no MySQL é um Index do tipo `FULLTEXT`.
*   Os Indexes full-text podem ser usados apenas com tabelas `InnoDB` ou `MyISAM`, e podem ser criados apenas para colunas `CHAR`, `VARCHAR` ou `TEXT`.
*   O MySQL fornece um parser full-text `ngram` integrado que suporta Chinês, Japonês e Coreano (CJK), e um plugin parser full-text MeCab instalável para Japonês. As diferenças de parsing estão descritas na Seção 12.9.8, “Parser Full-Text ngram”, e na Seção 12.9.9, “Plugin Parser Full-Text MeCab”.
*   Uma definição de Index `FULLTEXT` pode ser fornecida na instrução `CREATE TABLE` quando uma tabela é criada, ou adicionada posteriormente usando `ALTER TABLE` ou `CREATE INDEX`.
*   Para grandes conjuntos de dados, é muito mais rápido carregar seus dados em uma tabela que não possui um Index `FULLTEXT` e depois criar o Index, do que carregar dados em uma tabela que já possui um Index `FULLTEXT` existente.

A busca full-text é realizada usando a sintaxe `MATCH() AGAINST()`. `MATCH()` recebe uma lista separada por vírgulas que nomeia as colunas a serem pesquisadas. `AGAINST` recebe uma string para buscar e um modificador opcional que indica o tipo de busca a ser realizada. A string de busca deve ser um valor de string que seja constante durante a avaliação da Query. Isso exclui, por exemplo, uma coluna de tabela, pois ela pode ser diferente para cada linha.

Existem três tipos de buscas full-text:

*   Uma busca em linguagem natural interpreta a string de busca como uma frase na linguagem humana natural (uma frase em texto livre). Não há operadores especiais, com exceção de aspas duplas ("). A lista de stopwords se aplica. Para mais informações sobre listas de stopwords, consulte a Seção 12.9.4, “Stopwords Full-Text”.

    Buscas full-text são buscas em linguagem natural se o modificador `IN NATURAL LANGUAGE MODE` for fornecido ou se nenhum modificador for fornecido. Para mais informações, consulte a Seção 12.9.1, “Buscas Full-Text em Linguagem Natural”.

*   Uma busca booleana interpreta a string de busca usando as regras de uma linguagem de Query especial. A string contém as palavras a serem buscadas. Ela também pode conter operadores que especificam requisitos, como o fato de uma palavra dever estar presente ou ausente nas linhas correspondentes, ou que ela deve ser ponderada (weighted) mais alta ou mais baixa do que o normal. Certas palavras comuns (stopwords) são omitidas do Index de busca e não correspondem se estiverem presentes na string de busca. O modificador `IN BOOLEAN MODE` especifica uma busca booleana. Para mais informações, consulte a Seção 12.9.2, “Buscas Full-Text Booleanas”.

*   Uma busca por expansão de Query é uma modificação de uma busca em linguagem natural. A string de busca é usada para realizar uma busca em linguagem natural. Em seguida, palavras das linhas mais relevantes retornadas pela busca são adicionadas à string de busca e a busca é feita novamente. A Query retorna as linhas da segunda busca. O modificador `IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION` ou `WITH QUERY EXPANSION` especifica uma busca por expansão de Query. Para mais informações, consulte a Seção 12.9.3, “Buscas Full-Text com Expansão de Query”.

Para informações sobre o desempenho de Queries `FULLTEXT`, consulte a Seção 8.3.4, “Column Indexes”.

Para mais informações sobre Indexes `FULLTEXT` do `InnoDB`, consulte a Seção 14.6.2.4, “InnoDB Full-Text Indexes”.

As restrições na busca full-text estão listadas na Seção 12.9.5, “Restrições Full-Text”.

O utilitário **myisam_ftdump** despeja o conteúdo de um Index full-text `MyISAM`. Isso pode ser útil para depurar Queries full-text. Consulte a Seção 4.6.2, “myisam_ftdump — Exibir informações de Index Full-Text”.