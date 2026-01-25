### 12.9.5 Restrições de Full-Text

* Buscas full-text são suportadas apenas para tabelas `InnoDB` e `MyISAM`.

* Buscas full-text não são suportadas para tabelas particionadas. Consulte Seção 22.6, “Restrições e Limitações sobre Particionamento”.

* Buscas full-text podem ser usadas com a maioria dos character sets multibyte. A exceção é que para Unicode, o character set `utf8` pode ser usado, mas não o character set `ucs2`. Embora Indexes `FULLTEXT` em colunas `ucs2` não possam ser usados, você pode executar buscas `IN BOOLEAN MODE` em uma coluna `ucs2` que não tenha tal Index.

  As observações para `utf8` também se aplicam a `utf8mb4`, e as observações para `ucs2` também se aplicam a `utf16`, `utf16le` e `utf32`.

* Linguagens ideográficas, como Chinês e Japonês, não possuem delimitadores de palavras. Portanto, o parser full-text embutido *não consegue determinar onde as palavras começam e terminam nessas e em outras linguagens semelhantes*.

  Um parser full-text ngram baseado em caracteres que suporta Chinês, Japonês e Coreano (CJK), e um plugin de parser MeCab baseado em palavras que suporta Japonês são fornecidos para uso com tabelas `InnoDB` e `MyISAM`.

* Embora o uso de múltiplos character sets dentro de uma única tabela seja suportado, todas as colunas em um Index `FULLTEXT` devem usar o mesmo character set e collation.

* A lista de colunas `MATCH()` deve corresponder exatamente à lista de colunas em alguma definição de Index `FULLTEXT` para a tabela, a menos que este `MATCH()` esteja em `IN BOOLEAN MODE` em uma tabela `MyISAM`. Para tabelas `MyISAM`, buscas em modo boolean podem ser feitas em colunas sem Index, embora sejam propensas a ser lentas.

* O argumento de `AGAINST()` deve ser um valor string que seja constante durante a avaliação da Query. Isso exclui, por exemplo, uma coluna da tabela, pois ela pode ser diferente para cada linha.

* Index hints são mais limitados para buscas `FULLTEXT` do que para buscas não-`FULLTEXT`. Consulte Seção 8.9.4, “Index Hints”.

* Para `InnoDB`, todas as operações DML (`INSERT`, `UPDATE`, `DELETE`) envolvendo colunas com Indexes full-text são processadas no momento do commit da transaction. Por exemplo, para uma operação `INSERT`, uma string inserida é tokenizada e decomposta em palavras individuais. As palavras individuais são então adicionadas às tabelas de Index full-text quando a transaction é committed. Como resultado, buscas full-text retornam apenas dados committed.

* O caractere '%' não é um caractere wildcard suportado para buscas full-text.