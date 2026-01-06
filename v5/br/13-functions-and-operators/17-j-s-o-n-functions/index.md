## 12.17 Funções JSON

12.17.1 Referência de Função JSON

12.17.2 Funções que criam valores JSON

12.17.3 Funções que buscam valores JSON

12.17.4 Funções que modificam valores JSON

12.17.5 Funções que retornam atributos de valor JSON

12.17.6 Funções de Utilitário JSON

As funções descritas nesta seção realizam operações em valores JSON. Para discussão sobre o tipo de dados `JSON` e exemplos adicionais que mostram como usar essas funções, consulte a Seção 11.5, “O Tipo de Dados JSON”.

Para funções que aceitam um argumento JSON, ocorre um erro se o argumento não for um valor JSON válido. Argumentos analisados como JSON são indicados por *`json_doc`*; argumentos indicados por *`val`* não são analisados.

As funções que retornam valores JSON sempre realizam a normalização desses valores (veja Normalização, Fusão e Autoenrolagem de Valores JSON) e, assim, os ordenam. *O resultado preciso da ordenação pode ser alterado a qualquer momento; não confie nele para ser consistente entre as versões*.

A menos que indicado de outra forma, as funções JSON foram adicionadas no MySQL 5.7.8.

Também está disponível um conjunto de funções espaciais para operar com valores GeoJSON. Consulte a Seção 12.16.11, “Funções GeoJSON Espaciais”.
