### 7.5.4 Componentes de atributos de consulta

A partir do MySQL 8.0.23, um serviço de componente fornece acesso aos atributos de consulta (veja a Seção 11.6, “Atributos de Consulta”). O componente `query_attributes` usa esse serviço para fornecer acesso aos atributos de consulta dentro das instruções SQL.

- Objetivo: Implementa a função `mysql_query_attribute_string()` que recebe um argumento de nome de atributo e retorna o valor do atributo como uma string, ou `NULL` se o atributo não existir.

- URN: `file://component_query_attributes`

Os desenvolvedores que desejam incorporar o mesmo serviço de componente de consulta e atributo usado pelo `query_attributes` devem consultar o arquivo `mysql_query_attributes.h` em uma distribuição de fonte MySQL.
