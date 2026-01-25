## 12.17 Funções JSON

12.17.1 Referência de Funções JSON

12.17.2 Funções Que Criam Valores JSON

12.17.3 Funções Que Pesquisam Valores JSON

12.17.4 Funções Que Modificam Valores JSON

12.17.5 Funções Que Retornam Atributos de Valores JSON

12.17.6 Funções de Utilidade JSON

As funções descritas nesta seção realizam operações em valores JSON. Para uma discussão sobre o tipo de dado `JSON` e exemplos adicionais mostrando como usar essas funções, veja a Seção 11.5, “O Tipo de Dado JSON”.

Para funções que aceitam um argumento JSON, ocorre um erro se o argumento não for um valor JSON válido. Argumentos analisados (parsed) como JSON são indicados por *`json_doc`*; argumentos indicados por *`val`* não são analisados.

Funções que retornam valores JSON sempre realizam a *normalization* desses valores (veja Normalização, Fusão e *Autowrapping* de Valores JSON) e, portanto, os ordenam. *O resultado preciso da ordenação (sort) está sujeito a alterações a qualquer momento; não dependa de sua consistência entre as versões (releases)*.

Salvo indicação em contrário, as funções JSON foram adicionadas no MySQL 5.7.8.

Um conjunto de funções espaciais para operar em valores GeoJSON também está disponível. Veja a Seção 12.16.11, “Funções Espaciais GeoJSON”.