#### 22.4.3.3 Encontrar Documentos

Você pode usar o método `find()` para consultar e retornar documentos de uma coleção em um esquema. O MySQL Shell fornece métodos adicionais para usar com o método `find()` para filtrar e ordenar os documentos retornados.

O MySQL fornece os seguintes operadores para especificar condições de busca: `OR` (`||`), `AND` (`&&`), `XOR`, `IS`, `NOT`, `BETWEEN`, `IN`, `LIKE`, `!=`, `<>`, `>`, `>=`, `<`, `<=`, `&`, `|`, `<<`, `>>`, `+`, `-`, `*`, `/`, `~` e `%`.

##### Encontrar Todos os Documentos em uma Coleção

Para retornar todos os documentos em uma coleção, use o método `find()` sem especificar condições de busca. Por exemplo, a seguinte operação retorna todos os documentos na coleção `countryinfo`.

```
mysql-py> db.countryinfo.find()
[
     {
          "GNP": 828,
          "Code:": "ABW",
          "Name": "Aruba",
          "IndepYear": null,
          "geography": {
              "Continent": "North America",
              "Region": "Caribbean",
              "SurfaceArea": 193
          },
          "government": {
              "GovernmentForm": "Nonmetropolitan Territory of The Netherlands",
              "HeadOfState": "Beatrix"
          }
          "demographics": {
              "LifeExpectancy": 78.4000015258789,
              "Population": 103000
          },
          ...
      }
 ]
240 documents in set (0.00 sec)
```

O método produz resultados que contêm informações operacionais além de todos os documentos na coleção.

Um conjunto vazio (sem documentos correspondentes) retorna as seguintes informações:

```
Empty set (0.00 sec)
```

##### Filtrar Pesquisas

Você pode incluir condições de busca com o método `find()`. A sintaxe para expressões que formam uma condição de busca é a mesma da tradicional Capítulo 14 do MySQL, *Funções e Operadores*. Você deve encerrar todas as expressões entre aspas. Por conveniência, alguns dos exemplos não exibem a saída.

Uma condição de busca simples poderia consistir no campo `Name` e um valor que sabemos estar em um documento. O exemplo seguinte retorna um único documento:

```
mysql-py> db.countryinfo.find("Name = 'Australia'")
[
    {
        "GNP": 351182,
        "Code:": "AUS",
        "Name": "Australia",
        "IndepYear": 1901,
        "geography": {
            "Continent": "Oceania",
            "Region": "Australia and New Zealand",
            "SurfaceArea": 7741220
        },
        "government": {
            "GovernmentForm": "Constitutional Monarchy, Federation",
            "HeadOfState": "Elisabeth II"
        }
        "demographics": {
            "LifeExpectancy": 79.80000305175781,
            "Population": 18886000
        },
    }
]
```

O exemplo seguinte busca todos os países que têm um PIB superior a $500 bilhões. A coleção `countryinfo` mede o PIB em milhões de unidades.

```
mysql-py> db.countryinfo.find("GNP > 500000")
...[output removed]
10 documents in set (0.00 sec)
```

O campo População na seguinte consulta está embutido no objeto demografia. Para acessar o campo embutido, use um ponto entre demografia e População para identificar a relação. Os nomes de documentos e campos são sensíveis a maiúsculas e minúsculas.

```
mysql-py> db.countryinfo.find("GNP > 500000 and demographics.Population < 100000000")
...[output removed]
6 documents in set (0.00 sec)
```

Os operadores aritméticos na seguinte expressão são usados para pesquisar por países com um PIB per capita superior a $30000. As condições de busca podem incluir operadores aritméticos e a maioria das funções do MySQL.

Nota

Sete documentos na coleção `countryinfo` têm um valor de população de zero. Portanto, mensagens de aviso aparecem no final da saída.

```
mysql-py> db.countryinfo.find("GNP*1000000/demographics.Population > 30000")
...[output removed]
9 documents in set, 7 warnings (0.00 sec)
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
Warning (Code 1365): Division by 0
```

Você pode separar um valor da condição de busca usando o método `bind()`. Por exemplo, em vez de especificar um nome de país codificado como condição, substitua um localizador nomeado consistindo de um colon seguido de um nome que começa com uma letra, como *country*. Em seguida, use o método `bind(placeholder, value)` da seguinte forma:

```
mysql-py> db.countryinfo.find("Name = :country").bind("country", "Italy")
{
    "GNP": 1161755,
    "_id": "00005de917d8000000000000006a",
    "Code": "ITA",
    "Name": "Italy",
    "Airports": [],
    "IndepYear": 1861,
    "geography": {
        "Region": "Southern Europe",
        "Continent": "Europe",
        "SurfaceArea": 301316
    },
    "government": {
        "HeadOfState": "Carlo Azeglio Ciampi",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 57680000,
        "LifeExpectancy": 79
    }
}
1 document in set (0.01 sec)
```

Dica

Dentro de um programa, a vinculação permite que você especifique localizadores em suas expressões, que são preenchidos com valores antes da execução e podem se beneficiar da escapamento automático, conforme apropriado.

Sempre use a vinculação para higienizar a entrada. Evite introduzir valores em consultas usando concatenação de strings, o que pode produzir entrada inválida e, em alguns casos, pode causar problemas de segurança.

Você pode usar localizadores e o método `bind()` para criar buscas salvas que você pode então chamar com diferentes valores. Por exemplo, para criar uma busca salva para um país:

```
mysql-py> myFind = db.countryinfo.find("Name = :country")
mysql-py> myFind.bind('country', 'France')
{
    "GNP": 1424285,
    "_id": "00005de917d80000000000000048",
    "Code": "FRA",
    "Name": "France",
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
1 document in set (0.0028 sec)

mysql-py> myFind.bind('country', 'Germany')
{
    "GNP": 2133367,
    "_id": "00005de917d80000000000000038",
    "Code": "DEU",
    "Name": "Germany",
    "IndepYear": 1955,
    "geography": {
        "Region": "Western Europe",
        "Continent": "Europe",
        "SurfaceArea": 357022
    },
    "government": {
        "HeadOfState": "Johannes Rau",
        "GovernmentForm": "Federal Republic"
    },
    "demographics": {
        "Population": 82164700,
        "LifeExpectancy": 77.4000015258789
    }
}

1 document in set (0.0026 sec)
```

##### Resultados do Projeto

Você pode retornar campos específicos de um documento, em vez de retornar todos os campos. O exemplo seguinte retorna os campos PIB e Nome de todos os documentos na coleção `countryinfo` que correspondem às condições de busca.

Use o método `fields()` para passar a lista de campos a serem retornados.

```
mysql-py> db.countryinfo.find("GNP > 5000000").fields(["GNP", "Name"])
[
    {
        "GNP": 8510700,
        "Name": "United States"
    }
]
1 document in set (0.00 sec)
```

Além disso, você pode alterar os documentos retornados — adicionando, renomeando, aninhados e até calculando novos valores de campos — com uma expressão que descreve o documento a ser retornado. Por exemplo, altere os nomes dos campos com a seguinte expressão para retornar apenas dois documentos.

```
mysql-py> db.countryinfo.find().fields(
mysqlx.expr('{"Name": upper(Name), "GNPPerCapita": GNP*1000000/demographics.Population}')).limit(2)
{
    "Name": "ARUBA",
    "GNPPerCapita": 8038.834951456311
}
{
    "Name": "AFGHANISTAN",
    "GNPPerCapita": 263.0281690140845
}
```

##### Limitar, Ordenar e Ignorar Resultados

Você pode aplicar os métodos `limit()`, `sort()` e `skip()` para gerenciar o número e a ordem dos documentos retornados pelo método `find()`.

Para especificar o número de documentos incluídos em um conjunto de resultados, adicione o método `limit()` com um valor ao método `find()`. A seguinte consulta retorna os cinco primeiros documentos na coleção `countryinfo`.

```
mysql-py> db.countryinfo.find().limit(5)
... [output removed]
5 documents in set (0.00 sec)
```

Para especificar uma ordem para os resultados, adicione o método `sort()` ao método `find()`. Passe ao método `sort()` uma lista de um ou mais campos para ordenar e, opcionalmente, o atributo `desc` (descendente) ou `asc` (ascendente), conforme apropriado. A ordem ascendente é o tipo de ordem padrão.

Por exemplo, a seguinte consulta ordena todos os documentos pelo campo IndepYear e, em seguida, retorna os oito primeiros documentos em ordem decrescente.

```
mysql-py> db.countryinfo.find().sort(["IndepYear desc"]).limit(8)
... [output removed]
8 documents in set (0.00 sec)
```

Por padrão, o método `limit()` começa pelo primeiro documento na coleção. Você pode usar o método `skip()` para alterar o documento inicial. Por exemplo, para ignorar o primeiro documento e retornar os próximos oito documentos que correspondem à condição, passe ao método `skip()` um valor de 1.

```
mysql-py> db.countryinfo.find().sort(["IndepYear desc"]).limit(8).skip(1)
... [output removed]
8 documents in set (0.00 sec)
```

##### Informações Relacionadas

* O Manual de Referência do MySQL fornece documentação detalhada sobre funções e operadores.

* Veja CollectionFindFunction para a definição completa da sintaxe.