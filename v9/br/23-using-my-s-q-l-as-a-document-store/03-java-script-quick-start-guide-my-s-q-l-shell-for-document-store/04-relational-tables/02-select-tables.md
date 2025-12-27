#### 22.3.4.2 Selecionar Tabelas

Você pode usar o método `select()` para consultar e retornar registros de uma tabela em um banco de dados. A X DevAPI fornece métodos adicionais para usar com o método `select()` para filtrar e ordenar os registros retornados.

O MySQL fornece os seguintes operadores para especificar condições de busca: `OR` (`||`), `AND` (`&&`), `XOR`, `IS`, `NOT`, `BETWEEN`, `IN`, `LIKE`, `!=`, `<>`, `>`, `>=`, `<`, `<=`, `&`, `|`, `<<`, `>>`, `+`, `-`, `*`, `/`, `~` e `%`.

##### Selecionar Todos os Registros

Para emitir uma consulta que retorne todos os registros de uma tabela existente, use o método `select()` sem especificar condições de busca. O exemplo a seguir seleciona todos os registros da tabela cidade no banco de dados `world_x`.

Nota

Limite o uso do método `select()` vazio para declarações interativas. Sempre use seleções explícitas de colunas no código da sua aplicação.

```
mysql-js> db.city.select()
+------+------------+-------------+------------+-------------------------+
| ID   | Name       | CountryCode | District   | Info                    |
+------+------------+-------------+------------+-------------------------+
|    1 | Kabul      | AFG         | Kabol      |{"Population": 1780000}  |
|    2 | Qandahar   | AFG         | Qandahar   |{"Population": 237500}   |
|    3 | Herat      | AFG         | Herat      |{"Population": 186800}   |
...    ...          ...           ...          ...
| 4079 | Rafah      | PSE         | Rafah      |{"Population": 92020}    |
+------+------- ----+-------------+------------+-------------------------+
4082 rows in set (0.01 sec)
```

Um conjunto vazio (sem registros correspondentes) retorna as seguintes informações:

```
Empty set (0.00 sec)
```

##### Filtrar Pesquisas

Para emitir uma consulta que retorne um conjunto de colunas da tabela, use o método `select()` e especifique as colunas a serem retornadas entre colchetes. Esta consulta retorna as colunas Nome e CódigoDoPaís da tabela cidade.

```
mysql-js> db.city.select(["Name", "CountryCode"])
+-------------------+-------------+
| Name              | CountryCode |
+-------------------+-------------+
| Kabul             | AFG         |
| Qandahar          | AFG         |
| Herat             | AFG         |
| Mazar-e-Sharif    | AFG         |
| Amsterdam         | NLD         |
...                 ...
| Rafah             | PSE         |
| Olympia           | USA         |
| Little Falls      | USA         |
| Happy Valley      | USA         |
+-------------------+-------------+
4082 rows in set (0.00 sec)
```

Para emitir uma consulta que retorne linhas que correspondem a condições de busca específicas, use o método `where()` para incluir essas condições. Por exemplo, o exemplo a seguir retorna os nomes e códigos de país das cidades que começam com a letra Z.

```
mysql-js> db.city.select(["Name", "CountryCode"]).where("Name like 'Z%'")
+-------------------+-------------+
| Name              | CountryCode |
+-------------------+-------------+
| Zaanstad          | NLD         |
| Zoetermeer        | NLD         |
| Zwolle            | NLD         |
| Zenica            | BIH         |
| Zagazig           | EGY         |
| Zaragoza          | ESP         |
| Zamboanga         | PHL         |
| Zahedan           | IRN         |
| Zanjan            | IRN         |
| Zabol             | IRN         |
| Zama              | JPN         |
| Zhezqazghan       | KAZ         |
| Zhengzhou         | CHN         |
...                 ...
| Zeleznogorsk      | RUS         |
+-------------------+-------------+
59 rows in set (0.00 sec)
```

Você pode separar um valor da condição de busca usando o método `bind()`. Por exemplo, em vez de usar "Nome = 'Z%' " como a condição, substitua um localizador nomeado composto por um colon seguido de um nome que começa com uma letra, como *nome*. Em seguida, inclua o localizador e o valor no método `bind()` da seguinte forma:

```
mysql-js> db.city.select(["Name", "CountryCode"]).
              where("Name like :name").bind("name", "Z%")
```

Dica

Dentro de um programa, a vinculação permite que você especifique localizadores em suas expressões, que são preenchidos com valores antes da execução e podem se beneficiar da escapamento automático, conforme apropriado.

Sempre use a vinculação para higienizar a entrada. Evite introduzir valores em consultas usando concatenação de strings, o que pode produzir entrada inválida e, em alguns casos, pode causar problemas de segurança.

##### Resultados do Projeto

Para emitir uma consulta usando o operador `AND`, adicione o operador entre as condições de busca no método `where()`.

```
mysql-js> db.city.select(["Name", "CountryCode"]).where(
"Name like 'Z%' and CountryCode = 'CHN'")
+----------------+-------------+
| Name           | CountryCode |
+----------------+-------------+
| Zhengzhou      | CHN         |
| Zibo           | CHN         |
| Zhangjiakou    | CHN         |
| Zhuzhou        | CHN         |
| Zhangjiang     | CHN         |
| Zigong         | CHN         |
| Zaozhuang      | CHN         |
...              ...
| Zhangjiagang   | CHN         |
+----------------+-------------+
22 rows in set (0.01 sec)
```

Para especificar múltiplos operadores condicionais, você pode encerrar as condições de busca entre parênteses para alterar a precedência do operador. O exemplo seguinte demonstra a colocação dos operadores `AND` e `OR`.

```
mysql-js> db.city.select(["Name", "CountryCode"]).
where("Name like 'Z%' and (CountryCode = 'CHN' or CountryCode = 'RUS')")
+-------------------+-------------+
| Name              | CountryCode |
+-------------------+-------------+
| Zhengzhou         | CHN         |
| Zibo              | CHN         |
| Zhangjiakou       | CHN         |
| Zhuzhou           | CHN         |
...                 ...
| Zeleznogorsk      | RUS         |
+-------------------+-------------+
29 rows in set (0.01 sec)
```

##### Limpar, Ordenar e Deslocar Resultados

Você pode aplicar os métodos `limit()`, `orderBy()` e `offSet()` para gerenciar o número e a ordem dos registros retornados pelo método `select()`.

Para especificar o número de registros incluídos em um conjunto de resultados, adicione o método `limit()` ao método `select()`. Por exemplo, a seguinte consulta retorna os cinco primeiros registros na tabela de países.

```
mysql-js> db.country.select(["Code", "Name"]).limit(5)
+------+-------------+
| Code | Name        |
+------+-------------+
| ABW  | Aruba       |
| AFG  | Afghanistan |
| AGO  | Angola      |
| AIA  | Anguilla    |
| ALB  | Albania     |
+------+-------------+
5 rows in set (0.00 sec)
```

Para especificar uma ordem dos resultados, adicione o método `orderBy()` ao método `select()`. Passe ao método `orderBy()` uma lista de uma ou mais colunas para ordenar e, opcionalmente, o atributo `desc` (descrescente) ou `asc` (crescente), conforme apropriado. A ordem crescente é o tipo de ordem padrão.

Por exemplo, a seguinte consulta ordena todos os registros pelo campo Nome e, em seguida, retorna os três primeiros registros em ordem decrescente.

```
mysql-js> db.country.select(["Code", "Name"]).orderBy(["Name desc"]).limit(3)
+------+------------+
| Code | Name       |
+------+------------+
| ZWE  | Zimbabwe   |
| ZMB  | Zambia     |
| YUG  | Yugoslavia |
+------+------------+
3 rows in set (0.00 sec)
```

Por padrão, o método `limit()` começa a partir do primeiro registro da tabela. Você pode usar o método `offset()` para alterar o registro inicial. Por exemplo, para ignorar o primeiro registro e retornar os três registros seguintes que correspondem à condição, passe ao método `offset()` um valor de 1.

```
mysql-js> db.country.select(["Code", "Name"]).orderBy(["Name desc"]).limit(3).offset(1)
+------+------------+
| Code | Name       |
+------+------------+
| ZMB  | Zambia     |
| YUG  | Yugoslavia |
| YEM  | Yemen      |
+------+------------+
3 rows in set (0.00 sec)
```

##### Informações Relacionadas

* O Manual de Referência do MySQL fornece documentação detalhada sobre funções e operadores.

* Consulte TableSelectFunction para a definição completa da sintaxe.