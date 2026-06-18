#### 22.3.4.1 Inserir registros em tabelas

Você pode usar o método `insert()` com o método `values()` para inserir registros em uma tabela relacional existente. O método `insert()` aceita colunas individuais ou todas as colunas da tabela. Use um ou mais métodos `values()` para especificar os valores a serem inseridos.

##### Insira um registro completo

Para inserir um registro completo, passe para o método `insert()` todas as colunas da tabela. Em seguida, passe para o método `values()` um valor para cada coluna da tabela. Por exemplo, para adicionar um novo registro à tabela de cidade no esquema `world_x`, insira o seguinte registro e pressione **Enter** duas vezes.

```
mysql-js> db.city.insert("ID", "Name", "CountryCode", "District", "Info").values(
None, "Olympia", "USA", "Washington", '{"Population": 5000}')
```

A tabela da cidade tem cinco colunas: ID, Nome, CountryCode, Distrito e Info. Cada valor deve corresponder ao tipo de dado da coluna que representa.

##### Inserir um registro parcial

O exemplo a seguir insere valores nas colunas ID, Nome e CountryCode da tabela cidade.

```
mysql-js> db.city.insert("ID", "Name", "CountryCode").values(
None, "Little Falls", "USA").values(None, "Happy Valley", "USA")
```

Quando você especifica colunas usando o método `insert()`, o número de valores deve corresponder ao número de colunas. No exemplo anterior, você deve fornecer três valores para corresponder às três colunas especificadas.

##### Informações Relacionadas

- Consulte a TabelaInsertFunction para obter a definição completa da sintaxe.
