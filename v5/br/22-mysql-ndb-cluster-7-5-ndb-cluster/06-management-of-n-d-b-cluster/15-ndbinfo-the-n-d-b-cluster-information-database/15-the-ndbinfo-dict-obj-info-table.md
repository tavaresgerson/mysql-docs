#### 21.6.15.15 A Tabela ndbinfo dict_obj_info

A tabela `dict_obj_info` fornece informações sobre objetos do dicionário de dados do `NDB` ([`DICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html)), como tables e indexes. (A tabela [`dict_obj_types`](mysql-cluster-ndbinfo-dict-obj-types.html "21.6.15.16 The ndbinfo dict_obj_types Table") pode ser consultada (Query) para obter uma lista de todos os types.) Esta informação inclui o type, o state, o parent object (se houver) e o nome totalmente qualificado do objeto.

A tabela `dict_obj_info` contém as seguintes colunas:

* `type`

  O type do objeto [`DICT`]; faça um JOIN em [`dict_obj_types`] para obter o nome

* `id`

  Identificador do objeto; para arquivos de undo log e data files do Disk Data, este é o mesmo valor mostrado na coluna `LOGFILE_GROUP_NUMBER` da tabela [`FILES`] do Information Schema

* `version`

  Versão do objeto

* `state`

  State do objeto

* `parent_obj_type`

  O type do Parent object (um ID de type de `dict_obj_types`); 0 indica que o objeto não possui parent

* `parent_obj_id`

  ID do Parent object (como uma base table); 0 indica que o objeto não possui parent

* `fq_name`

  Nome totalmente qualificado do objeto (Fully qualified object name); para uma table, o formato é `database_name/def/table_name`; para uma Primary Key, o formato é `sys/def/table_id/PRIMARY`; e para uma unique key, é `sys/def/table_id/uk_name$unique`

##### Notas

Esta tabela foi adicionada no NDB 7.5.4.