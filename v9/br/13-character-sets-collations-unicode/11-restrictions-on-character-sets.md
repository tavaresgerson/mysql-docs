## 12.11 Restrições para Conjuntos de Caracteres

* Os identificadores são armazenados em tabelas de banco de dados `mysql` (`user`, `db` e assim por diante) usando `utf8mb3`, mas os identificadores podem conter apenas caracteres no Plano Multilíngue Básico (BMP). Caracteres suplementares não são permitidos em identificadores.

* Os conjuntos de caracteres `ucs2`, `utf16`, `utf16le` e `utf32` têm as seguintes restrições:

  + Nenhum deles pode ser usado como conjunto de caracteres do cliente. Veja Conjuntos de Caracteres do Cliente Imperativos.

  + Atualmente, não é possível usar `LOAD DATA` para carregar arquivos de dados que utilizam esses conjuntos de caracteres.

  + Índices `FULLTEXT` não podem ser criados em uma coluna que use qualquer um desses conjuntos de caracteres. No entanto, você pode realizar pesquisas no modo `IN BOOLEAN MODE` na coluna sem um índice.

* Os operadores `REGEXP` e `RLIKE` funcionam de forma byte a byte, portanto, não são seguros para multibytes e podem produzir resultados inesperados com conjuntos de caracteres multibytes. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser considerados iguais, mesmo que uma determinada ordenação os trate como iguais.