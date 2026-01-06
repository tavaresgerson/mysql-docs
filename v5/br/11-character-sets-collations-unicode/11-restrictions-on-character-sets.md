## 10.11 Restrições aos Conjuntos de Caracteres

- Os identificadores são armazenados em tabelas de banco de dados `mysql` (`user`, `db`, e assim por diante) usando `utf8`, mas os identificadores podem conter apenas caracteres no Plano Multilíngue Básico (BMP). Caracteres suplementares não são permitidos em identificadores.

- Os conjuntos de caracteres `ucs2`, `utf16`, `utf16le` e `utf32` têm as seguintes restrições:

  - Nenhum deles pode ser usado como o conjunto de caracteres do cliente. Veja Conjuntos de caracteres de cliente impermissíveis.

  - Atualmente, não é possível usar `LOAD DATA` para carregar arquivos de dados que utilizam esses conjuntos de caracteres.

  - Os índices `FULLTEXT` não podem ser criados em uma coluna que utilize qualquer um desses conjuntos de caracteres. No entanto, você pode realizar pesquisas no modo `IN BOOLEAN MODE` na coluna sem um índice.

  - O uso de `ENCRYPT()` com esses conjuntos de caracteres não é recomendado, pois a chamada de sistema subjacente espera uma string terminada por um byte zero.

- Os operadores `REGEXP` e `RLIKE` funcionam de forma de byte, portanto, não são seguros para multibytes e podem produzir resultados inesperados com conjuntos de caracteres multibytes. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser considerados iguais, mesmo que uma determinada ordenação os trate como iguais.
