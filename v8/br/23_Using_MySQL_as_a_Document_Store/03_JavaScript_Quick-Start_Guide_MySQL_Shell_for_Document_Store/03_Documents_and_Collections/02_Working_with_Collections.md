#### 22.3.3.2 Trabalhando com Coleções

Para trabalhar com as coleções em um esquema, use o objeto global `db` para acessar o esquema atual. Neste exemplo, estamos usando o esquema `world_x` importado anteriormente e a coleção `countryinfo`. Portanto, o formato das operações que você emite é `db.collection_name.operation`, onde `collection_name` é o nome da coleção contra a qual a operação é executada. Nos exemplos seguintes, as operações são executadas contra a coleção `countryinfo`.

##### Adicionar um documento

Use o método `add()` para inserir um documento ou uma lista de documentos em uma coleção existente. Insira o seguinte documento na coleção `countryinfo`. Como este é um conteúdo de várias linhas, pressione **Enter** duas vezes para inserir o documento.

```
mysql-js> db.countryinfo.add(
 {
    GNP: .6,
    IndepYear: 1967,
    Name: "Sealand",
    Code: "SEA",
    demographics: {
        LifeExpectancy: 79,
        Population: 27
    },
    geography: {
        Continent: "Europe",
        Region: "British Islands",
        SurfaceArea: 193
    },
    government: {
        GovernmentForm: "Monarchy",
        HeadOfState: "Michael Bates"
    }
  }
)
```

O método retorna o status da operação. Você pode verificar a operação pesquisando o documento. Por exemplo:

```
mysql-js> db.countryinfo.find("Name = 'Sealand'")
{
    "GNP": 0.6,
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

Observe que, além dos campos especificados quando o documento foi adicionado, há um campo adicional, o `_id`. Cada documento requer um campo identificador chamado `_id`. O valor do campo `_id` deve ser único entre todos os documentos da mesma coleção. No MySQL 8.0.11 e versões superiores, os IDs dos documentos são gerados pelo servidor, não pelo cliente, portanto, o MySQL Shell não define automaticamente um valor de `_id`. Um servidor MySQL 8.0.11 ou superior define um valor de `_id` se o documento não contiver o campo `_id`. Um servidor MySQL de uma versão anterior 8.0 ou 5.7 não define um valor de `_id` nesta situação, então você deve especificá-lo explicitamente. Se você não o fizer, o MySQL Shell retorna o erro 5115 Documento está faltando um campo necessário. Para mais informações, consulte Entendendo IDs de documentos.

##### Informações Relacionadas

- Consulte CollectionAddFunction para obter a definição completa da sintaxe.

- Veja Entendendo IDs de documentos.
