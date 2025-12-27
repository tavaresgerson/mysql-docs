## 14.17 Funções JSON

As funções descritas nesta seção realizam operações em valores JSON. Para discussão sobre o tipo de dados `JSON` e exemplos adicionais mostrando como usar essas funções, consulte a Seção 13.5, “O Tipo de Dados JSON”.

Para funções que aceitam um argumento JSON, ocorre um erro se o argumento não for um valor JSON válido. Argumentos analisados como JSON são indicados por *`json_doc`*; argumentos indicados por *`val`* não são analisados.

Funções que retornam valores JSON sempre realizam a normalização desses valores (consulte Normalização, Fusão e Autoenrolagem de Valores JSON) e, assim, os ordenam. *O resultado preciso da ordenação pode mudar a qualquer momento; não confie nele para ser consistente entre as versões*.

Um conjunto de funções espaciais para operar em valores GeoJSON também está disponível. Consulte a Seção 14.16.11, “Funções GeoJSON Espaciais”.