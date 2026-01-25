## 10.11 Restrições em Conjuntos de Caracteres (Character Sets)

* Identificadores são armazenados nas tabelas do Database `mysql` (`user`, `db`, e assim por diante) usando `utf8`, mas os identificadores podem conter apenas caracteres do Basic Multilingual Plane (BMP). Caracteres suplementares não são permitidos em identificadores.

* Os character sets `ucs2`, `utf16`, `utf16le` e `utf32` possuem as seguintes restrições:

  + Nenhum deles pode ser usado como o client character set. Consulte Character Sets de Cliente Não Permitidos.

  + Atualmente não é possível usar `LOAD DATA` para carregar arquivos de dados que utilizam estes character sets.

  + Indexes `FULLTEXT` não podem ser criados em uma coluna que utilize qualquer um destes character sets. No entanto, você pode realizar buscas `IN BOOLEAN MODE` na coluna sem um Index.

  + O uso de `ENCRYPT()` com estes character sets não é recomendado porque a chamada de sistema subjacente espera uma string terminada por um zero byte.

* Os operators `REGEXP` e `RLIKE` funcionam em nível de byte (byte-wise fashion), portanto, eles não são multibyte safe e podem produzir resultados inesperados com multibyte character sets. Além disso, estes operators comparam caracteres pelos seus valores de byte, e caracteres acentuados podem não ser comparados como iguais, mesmo que uma determinada collation os trate como iguais.