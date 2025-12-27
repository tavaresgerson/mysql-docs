#### 22.4.4.1 Inserir Registros em Tabelas

Você pode usar o método `insert()` com o método `values()` para inserir registros em uma tabela relacional existente. O método `insert()` aceita colunas individuais ou todas as colunas da tabela. Use um ou mais métodos `values()` para especificar os valores a serem inseridos.

##### Inserir um Registro Completo

Para inserir um registro completo, passe para o método `insert()` todas as colunas da tabela. Em seguida, passe para o método `values()` um valor para cada coluna. Por exemplo, para adicionar um novo registro à tabela cidade no banco de dados `world_x`, insira o seguinte registro e pressione **Enter** duas vezes.

```
mysql-py> db.city.insert("ID", "Name", "CountryCode", "District", "Info").values(
None, "Olympia", "USA", "Washington", '{"Population": 5000}')
```

A tabela cidade tem cinco colunas: ID, Nome, CountryCode, Distrito e Info. Cada valor deve corresponder ao tipo de dado da coluna que representa.

##### Inserir um Registro Parcial

O exemplo a seguir insere valores nas colunas ID, Nome e CountryCode da tabela cidade.

```
mysql-py> db.city.insert("ID", "Name", "CountryCode").values(
None, "Little Falls", "USA").values(None, "Happy Valley", "USA")
```

Quando você especifica colunas usando o método `insert()`, o número de valores deve corresponder ao número de colunas. No exemplo anterior, você deve fornecer três valores para corresponder às três colunas especificadas.

##### Informações Relacionadas

* Veja TableInsertFunction para a definição completa da sintaxe.