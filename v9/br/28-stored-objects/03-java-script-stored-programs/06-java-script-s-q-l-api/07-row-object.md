#### 27.3.6.7 Objeto de Linha

O objeto `Row` modela uma linha em um conjunto de resultados. O `Row` fornece os métodos listados aqui:

* `getField(String name)`: Retorna o valor do primeiro campo chamado *`name`*. Você pode recuperar o nome usando `getColumnLabel()`.

* `getLength()`: Retorna o número de campos na linha.

Além disso, a API fornece os seguintes mecanismos de conveniência para procurar um valor de coluna em uma linha dada:

* Busca de propriedade do objeto `Row`*: O nome da coluna pode ser usado diretamente como uma propriedade do objeto, desde que seja um identificador legítimo de JavaScript.

  Exemplo: `row.my_column`.

* Busca de chave do objeto `Row`*: O nome da coluna, citado, pode ser usado como um nome de chave.

  Exemplo: `row['my_column']`.

* Busca de índice do objeto `Row`*: Um índice de coluna válido pode ser usado para procurar o valor da coluna.

  Exemplo: `row[2]`.