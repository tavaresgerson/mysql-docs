### 12.9.5 Restrições de texto completo

- As pesquisas de texto completo são suportadas apenas para tabelas `InnoDB` e `MyISAM`.

- As pesquisas de texto completo não são suportadas para tabelas particionadas. Consulte a Seção 22.6, “Restrições e Limitações na Partição”.

- As pesquisas de texto completo podem ser usadas com a maioria dos conjuntos de caracteres multibyte. A exceção é que, para o Unicode, o conjunto de caracteres `utf8` pode ser usado, mas não o conjunto de caracteres `ucs2`. Embora os índices `FULLTEXT` em colunas `ucs2` não possam ser usados, você pode realizar pesquisas no modo `IN BOOLEAN MODE` em uma coluna `ucs2` que não tenha esse índice.

  As observações para `utf8` também se aplicam a `utf8mb4`, e as observações para `ucs2` também se aplicam a `utf16`, `utf16le` e `utf32`.

- Línguas ideográficas, como o chinês e o japonês, não têm delimitadores de palavras. Portanto, o analisador de texto completo integrado *não pode determinar onde as palavras começam e terminam nessas e outras línguas semelhantes*.

  Um analisador de texto completo baseado em caracteres que suporta chinês, japonês e coreano (CJK) e um plugin de analisador MeCab baseado em palavras que suporta japonês são fornecidos para uso com as tabelas `InnoDB` e `MyISAM`.

- Embora o uso de múltiplos conjuntos de caracteres dentro de uma única tabela seja suportado, todas as colunas de um índice `FULLTEXT` devem usar o mesmo conjunto de caracteres e ordenação.

- A lista de colunas `MATCH()` deve corresponder exatamente à lista de colunas em alguma definição de índice `FULLTEXT` para a tabela, a menos que essa `MATCH()` esteja no modo `IN BOOLEAN MODE` em uma tabela `MyISAM`. Para tabelas `MyISAM`, as pesquisas no modo booleano podem ser feitas em colunas não indexadas, embora sejam propensas a serem lentas.

- O argumento para `AGAINST()` deve ser um valor de string que seja constante durante a avaliação da consulta. Isso exclui, por exemplo, uma coluna de tabela, pois ela pode variar para cada linha.

- Os índices de dicas são mais limitados para pesquisas `FULLTEXT` do que para pesquisas não `FULLTEXT`. Veja a Seção 8.9.4, “Indicação de índice”.

- Para o `InnoDB`, todas as operações de manipulação de dados (DML) (`INSERT`, `UPDATE`, `DELETE`) que envolvem colunas com índices de texto completo são processadas no momento do commit da transação. Por exemplo, para uma operação de `INSERT`, uma string inserida é tokenizada e decomposta em palavras individuais. As palavras individuais são então adicionadas às tabelas de índice de texto completo quando a transação é confirmada. Como resultado, as buscas de texto completo retornam apenas dados confirmados.

- O caractere '%' não é um caractere de comodínio suportado para pesquisas de texto completo.
