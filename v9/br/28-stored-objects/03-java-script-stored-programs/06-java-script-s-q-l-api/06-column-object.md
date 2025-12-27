#### 27.3.6.6 Objeto da Coluna

O objeto `Column` representa os metadados da coluna em um conjunto de resultados. `Column` possui os métodos listados aqui:

* `getFractionalDigits()`: Obtém os dígitos fracionários do valor da coluna, se aplicável. Retorna um inteiro.

* `getLength()`: Obtém o comprimento da coluna, como um inteiro.

* `getCharacterSetName()`: Obtém o nome do conjunto de caracteres usado pela coluna.

Consulte o Capítulo 12, *Sets de Caracteres, Colagens, Unicode*, para obter mais informações sobre os conjuntos de caracteres e colagens MySQL.

* `getCollationName()`: Obtém o nome do conjunto de caracteres collation usado pela coluna.

Consulte o Capítulo 12, *Sets de Caracteres, Colagens, Unicode*, para obter mais informações sobre os conjuntos de caracteres e colagens MySQL.

* `getColumnLabel()`: Retorna um valor de string representando o alias da coluna, ou o nome da coluna se nenhum alias for definido.

* `getColumnName()`: Retorna um valor de string representando o nome da coluna.

* `getSchemaName()`: Obtém o nome do esquema no qual a coluna é definida.

* `String getTableLabel()`: Obtém o alias da tabela na qual a coluna ocorre.

* `getTableName()`: Obtém o nome da tabela na qual a coluna ocorre.

* `getType()`: Obtém o tipo da coluna (um objeto `Type`).

* `isNumberSigned()`: Indica se uma coluna numérica é assinada (`true` se for assinada).

* `isPadded()`: Se `true`, o preenchimento é usado para o valor da coluna.

Todos os métodos listados acima retornam strings, a menos que indicado de outra forma.