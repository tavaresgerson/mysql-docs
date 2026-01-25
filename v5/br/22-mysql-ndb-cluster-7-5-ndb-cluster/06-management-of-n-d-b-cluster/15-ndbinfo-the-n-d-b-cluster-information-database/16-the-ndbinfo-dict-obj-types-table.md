#### 21.6.15.16 A Tabela ndbinfo dict_obj_types

A tabela `dict_obj_types` é uma tabela estática que lista os possíveis tipos de objeto de dicionário usados no kernel do NDB. Estes são os mesmos tipos definidos por [`Object::Type`](/doc/ndbapi/en/ndb-object.html#ndb-object-type) na API do NDB.

A tabela `dict_obj_types` contém as seguintes colunas:

* `type_id`

  O ID de tipo (type ID) para este tipo

* `type_name`

  O nome deste tipo