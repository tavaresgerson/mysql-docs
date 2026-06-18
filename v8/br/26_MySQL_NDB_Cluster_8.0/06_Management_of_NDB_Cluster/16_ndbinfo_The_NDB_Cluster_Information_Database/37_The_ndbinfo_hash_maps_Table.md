#### 25.6.16.37 Tabela ndbinfo hash\_maps

- `id`

  ID único do mapa de hash

- `version`

  Versão do mapa de hash (número inteiro)

- `state`

  Estado do mapa de hash; veja Object::State para valores e descrições.

- `fq_name`

  O nome totalmente qualificado do mapa de hash

A tabela `hash_maps` é, na verdade, uma visualização que consiste nas quatro colunas com os mesmos nomes da tabela `dict_obj_info`, conforme mostrado aqui:

```
CREATE VIEW hash_maps AS
  SELECT id, version, state, fq_name
  FROM dict_obj_info
  WHERE type=24;  # Hash map; defined in dict_obj_types
```

Veja a descrição de `dict_obj_info` para mais informações.

A tabela `hash_maps` foi adicionada no NDB 8.0.29.
