#### 26.4.3.24 A visão schema_auto_increment_columns

Essa visualização indica quais tabelas têm colunas `AUTO_INCREMENT` e fornece informações sobre essas colunas, como os valores atuais e máximos da coluna e a proporção de uso (proporção de valores usados para possíveis valores). Por padrão, as linhas são ordenadas pelo menor índice de uso e pelo valor máximo da coluna.

As tabelas nesses esquemas são excluídas da saída de visualização: `mysql`, `sys`, `INFORMATION_SCHEMA`, `performance_schema`.

A visão `schema_auto_increment_columns` tem essas colunas:

- `esquema_tabela`

  O esquema que contém a tabela.

- `nome_tabela`

  A tabela que contém a coluna `AUTO_INCREMENT`.

- `nome_coluna`

  O nome da coluna `AUTO_INCREMENT`.

- `data_type`

  O tipo de dado da coluna.

- `tipo_coluna`

  O tipo de coluna da coluna, que é o tipo de dado mais, possivelmente, outras informações. Por exemplo, para uma coluna com um tipo de coluna `bigint(20) unsigned`, o tipo de dado é apenas `bigint`.

- `is_signed`

  Se o tipo de coluna é assinado.

- `is_unsigned`

  Se o tipo da coluna é assinado ou

- `max_value`

  O valor máximo permitido para a coluna.

- `auto_increment`

  O valor atual de `AUTO_INCREMENT` para a coluna.

- `auto_increment_ratio`

  A proporção entre os valores permitidos e os valores utilizados na coluna. Isso indica quanto da sequência de valores está "esgotado".
