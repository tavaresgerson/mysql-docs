#### 22.4.3.1 Criar, listar e excluir coleções

No MySQL Shell, você pode criar novas coleções, obter uma lista das coleções existentes em um esquema e remover uma coleção existente de um esquema. Os nomes das coleções são sensíveis a maiúsculas e minúsculas e cada nome de coleção deve ser único.

##### Confirme o esquema

Para mostrar o valor atribuído à variável schema, execute:

```
mysql-py> db
```

Se o valor do esquema não for `Schema:world_x`, defina a variável `db` emitindo:

```
mysql-py> \use world_x
```

##### Criar uma coleção

Para criar uma nova coleção em um esquema existente, use o método `createCollection()` do objeto `db`. O exemplo a seguir cria uma coleção chamada `flags` no esquema `world_x`.

```
mysql-py> db.create_collection("flags")
```

O método retorna um objeto de coleção.

```
<Collection:flags>
```

##### Lista de Coleções

Para exibir todas as coleções no esquema `world_x`, use o método `get_collections()` do objeto `db`. As coleções retornadas pelo servidor ao qual você está conectado aparecem entre colchetes.

```
mysql-py> db.get_collections()
[
    <Collection:countryinfo>,
    <Collection:flags>
]
```

##### Deixe uma Coleção

Para excluir uma coleção existente de um esquema, use o método `drop_collection()` do objeto `db`. Por exemplo, para excluir a coleção `flags` do esquema atual, execute:

```
mysql-py> db.drop_collection("flags")
```

O método `drop_collection()` também é usado no MySQL Shell para excluir uma tabela relacional de um esquema.

##### Informações Relacionadas

- Veja Objetos da Coleção para mais exemplos.
