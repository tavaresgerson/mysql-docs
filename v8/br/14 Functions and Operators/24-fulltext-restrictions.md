### 14.9.5 Restrições de texto completo

* As pesquisas de texto completo são suportadas apenas para tabelas `InnoDB` e `MyISAM`.
* As pesquisas de texto completo não são suportadas para tabelas particionadas. Consulte a Seção 26.6, “Restrições e Limitações de Partição”.
* As pesquisas de texto completo podem ser usadas com a maioria dos conjuntos de caracteres multibyte. A exceção é que, para o Unicode, o conjunto de caracteres `utf8mb3` ou `utf8mb4` pode ser usado, mas não o conjunto de caracteres `ucs2`. Embora os índices `FULLTEXT` em colunas `ucs2` não possam ser usados, você pode realizar pesquisas no modo `IN BOOLEAN MODE` em uma coluna `ucs2` que não tenha tal índice.
* As observações para `utf8mb3` também se aplicam a `utf8mb4`, e as observações para `ucs2` também se aplicam a `utf16`, `utf16le` e `utf32`.
* Línguas ideográficas, como o chinês e o japonês, não têm delimitadores de palavras. Portanto, o parser de texto completo embutido *não pode determinar onde as palavras começam e terminam nestas e outras línguas*.

* Um parser de texto completo baseado em n-gramas que suporta chinês, japonês e coreano (CJK) e um plugin de parser MeCab baseado em palavras que suporta japonês são fornecidos para uso com tabelas `InnoDB` e `MyISAM`.
* Embora o uso de múltiplos conjuntos de caracteres dentro de uma única tabela seja suportado, todas as colunas em um índice `FULLTEXT` devem usar o mesmo conjunto de caracteres e collation.
* A lista de colunas `MATCH()` deve corresponder exatamente à lista de colunas em algum definição de índice `FULLTEXT` para a tabela, a menos que essa `MATCH()` esteja no modo `IN BOOLEAN MODE` em uma tabela `MyISAM`. Para tabelas `MyISAM`, as pesquisas no modo booleano podem ser feitas em colunas não indexadas, embora sejam provavelmente lentas.
* O argumento para `AGAINST()` deve ser um valor de string que seja constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela porque ela pode diferir para cada linha.

O argumento para `MATCH()` não pode usar uma coluna de agregação.
* As dicas de índice são mais limitadas para pesquisas `FULLTEXT` do que para pesquisas não `FULLTEXT`. Veja a Seção 10.9.4, “Dicas de índice”.
* Para `InnoDB`, todas as operações DML ( `INSERT`, `UPDATE`, `DELETE`) que envolvem colunas com índices de texto completo são processadas no momento do commit da transação. Por exemplo, para uma operação `INSERT`, uma string inserida é tokenizada e decomposta em palavras individuais. As palavras individuais são então adicionadas às tabelas de índice de texto completo quando a transação é confirmada. Como resultado, as pesquisas de texto completo retornam apenas dados confirmados.
* O caractere '%' não é um caractere de comodinho suportado para pesquisas de texto completo.