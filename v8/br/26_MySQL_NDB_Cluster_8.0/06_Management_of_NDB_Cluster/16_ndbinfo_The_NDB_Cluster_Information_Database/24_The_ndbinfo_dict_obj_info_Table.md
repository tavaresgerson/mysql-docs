#### 25.6.16.24 Tabela ndbinfo dict\_obj\_info

A tabela `dict_obj_info` fornece informações sobre os objetos do dicionário de dados `NDB` (`DICT`) como tabelas e índices. (A tabela `dict_obj_types` pode ser consultada para obter uma lista de todos os tipos.) Essas informações incluem o tipo do objeto, o estado, o objeto pai (se houver) e o nome totalmente qualificado.

A tabela `dict_obj_info` contém as seguintes colunas:

- `type`

  Tipo de objeto `DICT`; faça a junção em `dict_obj_types` para obter o nome

- `id`

  Identificador do objeto; para arquivos de registro de desfazer de dados de disco e arquivos de dados, este é o mesmo valor exibido na coluna `LOGFILE_GROUP_NUMBER` da tabela do esquema de informações `FILES`; para arquivos de registro de desfazer, também é o mesmo valor exibido na coluna `log_id` nas tabelas `ndbinfo` `logbuffers` e `logspaces`

- `version`

  Versão do objeto

- `state`

  Estado do objeto; consulte Object::State para valores e descrições.

- `parent_obj_type`

  Tipo do objeto pai (um ID de tipo `dict_obj_types`); 0 indica que o objeto não tem pai

- `parent_obj_id`

  ID do objeto pai (como uma tabela base); 0 indica que o objeto não tem pai

- `fq_name`

  Nome de objeto totalmente qualificado; para uma tabela, este tem a forma `database_name/def/table_name`, para uma chave primária, o formato é `sys/def/table_id/PRIMARY`, e para uma chave única é `sys/def/table_id/uk_name$unique`
