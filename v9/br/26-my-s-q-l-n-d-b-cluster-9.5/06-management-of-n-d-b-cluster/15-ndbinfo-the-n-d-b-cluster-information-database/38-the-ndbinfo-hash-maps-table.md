#### 25.6.15.38 A tabela ndbinfo hash_maps

* `id`

  O ID único do mapa de hash

* `version`

  Versão do mapa de hash (inteiro)

* `state`

  Estado do mapa de hash; consulte Object::State para valores e descrições.

* `fq_name`

  Nome completo do mapa de hash

A tabela `hash_maps` é na verdade uma visualização composta pelas quatro colunas com os mesmos nomes da tabela `dict_obj_info`, conforme mostrado aqui:

```
CREATE VIEW hash_maps AS
  SELECT id, version, state, fq_name
  FROM dict_obj_info
  WHERE type=24;  # Hash map; defined in dict_obj_types
```

Consulte a descrição de `dict_obj_info` para obter mais informações.