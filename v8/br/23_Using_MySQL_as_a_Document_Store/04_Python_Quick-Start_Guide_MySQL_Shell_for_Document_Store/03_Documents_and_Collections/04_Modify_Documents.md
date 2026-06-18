#### 22.4.3.4 Modificar documentos

Você pode usar o método `modify()` para atualizar um ou mais documentos em uma coleção. O X DevAPI fornece métodos adicionais para uso com o método `modify()` para:

- Definir e desdefinir campos dentro dos documentos.
- Adicione, insira e exclua arrays.
- Encaixe, limite e organize os documentos que serão modificados.

##### Definir e desdefinir campos de documento

O método `modify()` funciona filtrando uma coleção para incluir apenas os documentos que serão modificados e, em seguida, aplicando as operações que você especificar a esses documentos.

No exemplo a seguir, o método `modify()` usa a condição de busca para identificar o documento a ser alterado e, em seguida, o método `set()` substitui dois valores dentro do objeto de demografia aninhado.

```
mysql-py> db.countryinfo.modify("Code = 'SEA'").set(
"demographics", {"LifeExpectancy": 78, "Population": 28})
```

Depois de modificar um documento, use o método `find()` para verificar a alteração.

Para remover conteúdo de um documento, use os métodos `modify()` e `unset()`. Por exemplo, a seguinte consulta remove o RNP de um documento que corresponde à condição de pesquisa.

```
mysql-py> db.countryinfo.modify("Name = 'Sealand'").unset("GNP")
```

Use o método `find()` para verificar a alteração.

```
mysql-py> db.countryinfo.find("Name = 'Sealand'")
{
    "_id": "00005e2ff4af00000000000000f4",
    "Name": "Sealand",
    "Code:": "SEA",
    "IndepYear": 1967,
    "geography": {
        "Region": "British Islands",
        "Continent": "Europe",
        "SurfaceArea": 193
    },
    "government": {
        "HeadOfState": "Michael Bates",
        "GovernmentForm": "Monarchy"
    },
    "demographics": {
        "Population": 27,
        "LifeExpectancy": 79
    }
}
```

##### Adicionar, Inserir e Remover Arrays

Para adicionar um elemento a um campo de array, ou inserir ou excluir elementos em um array, use os métodos `array_append()`, `array_insert()` ou `array_delete()`. Os seguintes exemplos modificam a coleção `countryinfo` para permitir o rastreamento de aeroportos internacionais.

O primeiro exemplo usa os métodos `modify()` e `set()` para criar um novo campo "Aeroportos" em todos os documentos.

Cuidado

Tenha cuidado ao modificar documentos sem especificar uma condição de pesquisa; isso modifica todos os documentos da coleção.

```
mysql-py> db.countryinfo.modify("true").set("Airports", [])
```

Com o campo Aeroportos adicionado, o próximo exemplo usa o método `array_append()` para adicionar um novo aeroporto a um dos documentos. *$.Airports* no exemplo a seguir representa o campo Aeroportos do documento atual.

```
mysql-py> db.countryinfo.modify("Name = 'France'").array_append("$.Airports", "ORY")
```

Use `find()` para ver a mudança.

```
mysql-py> db.countryinfo.find("Name = 'France'")
{
    "GNP": 1424285,
    "_id": "00005de917d80000000000000048",
    "Code": "FRA",
    "Name": "France",
    "Airports": [
        "ORY"
    ],
    "IndepYear": 843,
    "geography": {
        "Region": "Western Europe",
        "Continent": "Europe",
        "SurfaceArea": 551500
    },
    "government": {
        "HeadOfState": "Jacques Chirac",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 59225700,
        "LifeExpectancy": 78.80000305175781
    }
}
```

Para inserir um elemento em uma posição diferente na matriz, use o método `array_insert()` para especificar qual índice inserir na expressão de caminho. Neste caso, o índice é 0, ou seja, o primeiro elemento da matriz.

```
mysql-py> db.countryinfo.modify("Name = 'France'").array_insert("$.Airports[0]", "CDG")
```

Para excluir um elemento da matriz, você deve passar ao método `array_delete()` o índice do elemento a ser excluído.

```
mysql-py> db.countryinfo.modify("Name = 'France'").array_delete("$.Airports[1]")
```

##### Informações Relacionadas

- O Manual de Referência do MySQL fornece instruções para ajudá-lo a pesquisar e modificar valores JSON.

- Consulte CollectionModifyFunction para obter a definição completa da sintaxe.
