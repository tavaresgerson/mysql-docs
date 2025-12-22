### 7.5.4 Componentes de atributo de consulta

Um serviço de componente fornece acesso a atributos de consulta (ver Seção 11.6,  Atributos de consulta). O componente `query_attributes` usa esse serviço para fornecer acesso a atributos de consulta dentro de instruções SQL.

- Propósito: Implementa a função `mysql_query_attribute_string()` que toma um argumento de nome de atributo e retorna o valor do atributo como uma string, ou `NULL` se o atributo não existir.
- \[`file://component_query_attributes`]

Os desenvolvedores que desejam incorporar o mesmo serviço de componente de atributo de consulta usado por `query_attributes` devem consultar o arquivo `mysql_query_attributes.h` em uma distribuição de origem MySQL.
