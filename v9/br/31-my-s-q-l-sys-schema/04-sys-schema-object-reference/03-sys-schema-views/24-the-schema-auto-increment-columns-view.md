#### 30.4.3.24 A visão `schema\_auto\_increment\_columns`

Essa visão indica quais tabelas possuem colunas `AUTO_INCREMENT` e fornece informações sobre essas colunas, como os valores atuais e máximos da coluna e a proporção de uso (proporção de valores usados para os possíveis). Por padrão, as linhas são ordenadas em ordem decrescente de proporção de uso e valor máximo da coluna.

As tabelas nesses esquemas são excluídas da saída da visão: `mysql`, `sys`, `INFORMATION_SCHEMA`, `performance_schema`.

A visão `schema_auto_increment_columns` tem essas colunas:

* `table_schema`

  O esquema que contém a tabela.

* `table_name`

  O nome da tabela que contém a coluna `AUTO_INCREMENT`.

* `column_name`

  O nome da coluna `AUTO_INCREMENT`.

* `data_type`

  O tipo de dados da coluna.

* `column_type`

  O tipo de coluna da coluna, que é o tipo de dados mais possivelmente outras informações. Por exemplo, para uma coluna com um tipo de coluna `bigint(20) unsigned`, o tipo de dados é apenas `bigint`.

* `is_signed`

  Se o tipo de coluna é assinado.

* `is_unsigned`

  Se o tipo de coluna é não assinado.

* `max_value`

  O valor máximo permitido para a coluna.

* `auto_increment`

  O valor atual `AUTO_INCREMENT` para a coluna.

* `auto_increment_ratio`

  A proporção de valores usados para os valores permitidos para a coluna. Isso indica quanto da sequência de valores está "usada".