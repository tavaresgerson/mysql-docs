#### 21.6.15.15 Tabela ndbinfo dict_obj_info

A tabela `dict_obj_info` fornece informações sobre objetos do dicionário de dados `NDB` (`DICT`), como tabelas e índices. (A tabela `dict_obj_types` ([mysql-cluster-ndbinfo-dict-obj-types.html]) pode ser consultada para obter uma lista de todos os tipos.) Essas informações incluem o tipo do objeto, o estado, o objeto pai (se houver) e o nome totalmente qualificado.

A tabela `dict_obj_info` contém as seguintes colunas:

- `tipo`

  Tipo do objeto `DICT`; faça uma junção no `dict_obj_types` para obter o nome

- `id`

  Identificador do objeto; para arquivos de registro de desfazer de dados de disco e arquivos de dados, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela do esquema de informações `FILES`

- `versão`

  Versão do objeto

- "estado"

  Estado do objeto

- `parent_obj_type`

  Tipo do objeto pai (um ID de tipo `dict_obj_types`); 0 indica que o objeto não tem pai

- `parent_obj_id`

  ID do objeto pai (como uma tabela base); 0 indica que o objeto não tem pai

- `fq_name`

  Nome de objeto totalmente qualificado; para uma tabela, este tem a forma `database_name/def/table_name`, para uma chave primária, a forma é `sys/def/table_id/PRIMARY`, e para uma chave única é `sys/def/table_id/uk_name$unique`

##### Notas

Esta tabela foi adicionada no NDB 7.5.4.
