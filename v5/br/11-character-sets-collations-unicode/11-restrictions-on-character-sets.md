## 10.11 Restrições em Character Sets

* Identificadores são armazenados nas tabelas do `database` `mysql` (`user`, `db`, e assim por diante) usando `utf8`, mas os identificadores podem conter apenas caracteres do Plano Multilíngue Básico (BMP - Basic Multilingual Plane). Caracteres suplementares não são permitidos em identificadores.

* Os `character sets` `ucs2`, `utf16`, `utf16le` e `utf32` possuem as seguintes restrições:

  + Nenhum deles pode ser usado como o `client character set`. Consulte Conjuntos de Caracteres de Cliente Não Permitidos.

  + Atualmente, não é possível usar `LOAD DATA` para carregar arquivos de dados que utilizam esses `character sets`.

  + `FULLTEXT indexes` não podem ser criados em uma coluna que utiliza qualquer um desses `character sets`. No entanto, você pode realizar buscas `IN BOOLEAN MODE` na coluna sem um `index`.

  + O uso de `ENCRYPT()` com esses `character sets` não é recomendado porque a chamada de sistema subjacente espera uma string terminada por um byte zero.

* Os operadores `REGEXP` e `RLIKE` funcionam de forma byte a byte (`byte-wise`), portanto, não são seguros para multibytes (`multibyte safe`) e podem produzir resultados inesperados com `character sets` multibyte. Além disso, esses operadores comparam caracteres por seus valores de byte, e caracteres acentuados podem não ser comparados como iguais mesmo que uma determinada `collation` os trate como tal.