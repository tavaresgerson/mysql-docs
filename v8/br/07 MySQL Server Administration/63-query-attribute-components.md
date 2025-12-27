### 7.5.4 Componentes de atributos de consulta

Um serviço de componente fornece acesso a atributos de consulta (consulte a Seção 11.6, “Atributos de consulta”). O componente `query_attributes` usa esse serviço para fornecer acesso aos atributos de consulta dentro das instruções SQL.

* Propósito: Implementa a função `mysql_query_attribute_string()`, que recebe um argumento de nome de atributo e retorna o valor do atributo como uma string, ou `NULL` se o atributo não existir.
* URN: `file://component_query_attributes`

Os desenvolvedores que desejam incorporar o mesmo serviço de componente de atributos de consulta usado pelo `query_attributes` devem consultar o arquivo `mysql_query_attributes.h` em uma distribuição de código-fonte MySQL.