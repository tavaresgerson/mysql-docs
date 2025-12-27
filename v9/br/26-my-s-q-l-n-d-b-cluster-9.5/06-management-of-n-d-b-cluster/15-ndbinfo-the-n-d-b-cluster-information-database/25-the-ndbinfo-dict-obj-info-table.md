#### 25.6.15.25 Tabela ndbinfo dict_obj_info

A tabela `dict_obj_info` fornece informações sobre objetos do dicionário de dados `NDB` (`DICT`), como tabelas e índices. (A tabela `dict_obj_types` pode ser consultada para obter uma lista de todos os tipos.) Essas informações incluem o tipo do objeto, o estado, o objeto pai (se houver) e o nome totalmente qualificado.

A tabela `dict_obj_info` contém as seguintes colunas:

* `type`

  Tipo do objeto `DICT`; faça uma junção com a tabela `dict_obj_types` para obter o nome

* `id`

  Identificador do objeto; para arquivos de log de desfazer de dados em disco e arquivos de dados, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela `FILES` do Esquema de Informações; para arquivos de desfazer, também é o mesmo valor exibido na coluna `log_id` nas tabelas `ndbinfo` `logbuffers` e `logspaces`

* `version`

  Versão do objeto

* `state`

  Estado do objeto; consulte Object::State para valores e descrições.

* `parent_obj_type`

  Tipo do objeto pai (um ID de tipo da tabela `dict_obj_types`); 0 indica que o objeto não tem pai

* `parent_obj_id`

  ID do objeto pai (como uma tabela base); 0 indica que o objeto não tem pai

* `fq_name`

  Nome do objeto totalmente qualificado; para uma tabela, este tem a forma `database_name/def/table_name`, para uma chave primária, a forma é `sys/def/table_id/PRIMARY`, e para uma chave única é `sys/def/table_id/uk_name$unique`