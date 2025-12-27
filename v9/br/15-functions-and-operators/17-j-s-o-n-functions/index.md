## 14.17 Funções JSON

14.17.1 Referência de Funções JSON

14.17.2 Funções que criam valores JSON

14.17.3 Funções que buscam valores JSON

14.17.4 Funções que modificam valores JSON

14.17.5 Funções que retornam atributos de valores JSON

14.17.6 Funções de tabela JSON

14.17.7 Funções de validação de esquema JSON

14.17.8 Funções de utilidade JSON

As funções descritas nesta seção realizam operações em valores JSON. Para discussão sobre o tipo de dados `JSON` e exemplos adicionais mostrando como usar essas funções, consulte a Seção 13.5, “O Tipo de Dados JSON”.

Para funções que aceitam um argumento JSON, ocorre um erro se o argumento não for um valor JSON válido. Argumentos analisados como JSON são indicados por *`json_doc`*; argumentos indicados por *`val`* não são analisados.

Funções que retornam valores JSON sempre realizam a normalização desses valores (consulte Normalização, Fusão e Autoenrolagem de Valores JSON) e, assim, os ordenam. *O resultado preciso da ordenação pode mudar a qualquer momento; não confie nele para ser consistente entre as versões*.

Também está disponível um conjunto de funções espaciais para operar em valores GeoJSON. Consulte a Seção 14.16.11, “Funções GeoJSON Espaciais”.