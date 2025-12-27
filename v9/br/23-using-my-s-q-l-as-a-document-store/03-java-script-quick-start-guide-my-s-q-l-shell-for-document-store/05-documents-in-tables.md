### 22.3.5 Documentos em Tabelas

No MySQL, uma tabela pode conter dados relacionais tradicionais, valores JSON ou ambos. Você pode combinar dados tradicionais com documentos JSON armazenando os documentos em colunas com um tipo de dados nativo `JSON`.

Os exemplos nesta seção usam a tabela `cidade` no esquema `world_x`.

#### Descrição da Tabela `cidade`

A tabela `cidade` tem cinco colunas (ou campos).

```
+---------------+------------+-------+-------+---------+------------------+
| Field         | Type       | Null  | Key   | Default | Extra            |
+---------------+------------+-------+-------+---------+------------------+
| ID            | int(11)    | NO    | PRI   | null    | auto_increment   |
| Name          | char(35)   | NO    |       |         |                  |
| CountryCode   | char(3)    | NO    |       |         |                  |
| District      | char(20)   | NO    |       |         |                  |
| Info          | json       | YES   |       | null    |                  |
+---------------+------------+-------+-------+---------+------------------+
```

#### Inserir um Registro

Para inserir um documento na coluna de uma tabela, passe ao método `values()` um documento JSON bem formado na ordem correta. No exemplo seguinte, um documento é passado como o valor final a ser inserido na coluna `Info`.

```
mysql-js> db.city.insert().values(
None, "San Francisco", "USA", "California", '{"Population":830000}')
```

#### Selecionar um Registro

Você pode emitir uma consulta com uma condição de busca que avalia os valores dos documentos na expressão.

```
mysql-js> db.city.select(["ID", "Name", "CountryCode", "District", "Info"]).where(
"CountryCode = :country and Info->'$.Population' > 1000000").bind(
'country', 'USA')
+------+----------------+-------------+----------------+-----------------------------+
| ID   | Name           | CountryCode | District       | Info                        |
+------+----------------+-------------+----------------+-----------------------------+
| 3793 | New York       | USA         | New York       | {"Population": 8008278}     |
| 3794 | Los Angeles    | USA         | California     | {"Population": 3694820}     |
| 3795 | Chicago        | USA         | Illinois       | {"Population": 2896016}     |
| 3796 | Houston        | USA         | Texas          | {"Population": 1953631}     |
| 3797 | Philadelphia   | USA         | Pennsylvania   | {"Population": 1517550}     |
| 3798 | Phoenix        | USA         | Arizona        | {"Population": 1321045}     |
| 3799 | San Diego      | USA         | California     | {"Population": 1223400}     |
| 3800 | Dallas         | USA         | Texas          | {"Population": 1188580}     |
| 3801 | San Antonio    | USA         | Texas          | {"Population": 1144646}     |
+------+----------------+-------------+----------------+-----------------------------+
9 rows in set (0.01 sec)
```

#### Informações Relacionadas

* Veja Trabalhando com Tabelas e Documentos Relacionais para obter mais informações.

* Veja a Seção 13.5, “O Tipo de Dados JSON” para uma descrição detalhada do tipo de dados.