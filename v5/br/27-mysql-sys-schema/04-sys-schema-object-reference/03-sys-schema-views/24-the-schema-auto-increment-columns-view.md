#### 26.4.3.24 A View `schema_auto_increment_columns`

Esta view indica quais tabelas possuem colunas `AUTO_INCREMENT` e fornece informações sobre essas colunas, como os valores atuais e máximos da coluna e o *usage ratio* (proporção de valores usados em relação aos valores possíveis). Por padrão, as linhas são ordenadas pelo *usage ratio* decrescente e pelo valor máximo da coluna.

Tabelas nestes schemas são excluídas da saída da view: `mysql`, `sys`, `INFORMATION_SCHEMA`, `performance_schema`.

A view `schema_auto_increment_columns` possui as seguintes colunas:

* `table_schema`

  O schema que contém a tabela.

* `table_name`

  A tabela que contém a coluna `AUTO_INCREMENT`.

* `column_name`

  O nome da coluna `AUTO_INCREMENT`.

* `data_type`

  O tipo de dado da coluna.

* `column_type`

  O tipo de coluna da coluna, que é o tipo de dado mais possivelmente outras informações. Por exemplo, para uma coluna com um `column type` de `bigint(20) unsigned`, o tipo de dado é apenas `bigint`.

* `is_signed`

  Indica se o tipo de coluna é assinado (*signed*).

* `is_unsigned`

  Indica se o tipo de coluna é não assinado (*unsigned*).

* `max_value`

  O valor máximo permitido para a coluna.

* `auto_increment`

  O valor `AUTO_INCREMENT` atual para a coluna.

* `auto_increment_ratio`

  A proporção de valores usados em relação aos valores permitidos para a coluna. Isso indica o quanto da sequência de valores foi “consumida” (*“used up”*).