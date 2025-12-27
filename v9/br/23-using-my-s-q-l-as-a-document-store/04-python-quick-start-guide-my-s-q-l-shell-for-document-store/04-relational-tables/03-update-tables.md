#### 22.4.4.3 Atualizar Tabelas

Você pode usar o método `update()` para modificar um ou mais registros em uma tabela. O método `update()` funciona filtrando uma consulta para incluir apenas os registros que serão atualizados e, em seguida, aplicando as operações que você especificar a esses registros.

Para substituir o nome de uma cidade na tabela cidade, passe o novo nome da cidade ao método `set()`. Em seguida, passe o nome da cidade a ser localizada e substituída ao método `where()`. O exemplo a seguir substitui a cidade Peking por Beijing.

```
mysql-py> db.city.update().set("Name", "Beijing").where("Name = 'Peking'")
```

Use o método `select()` para verificar a mudança.

```
mysql-py> db.city.select(["ID", "Name", "CountryCode", "District", "Info"]).where("Name = 'Beijing'")
+------+-----------+-------------+----------+-----------------------------+
| ID   | Name      | CountryCode | District | Info                        |
+------+-----------+-------------+----------+-----------------------------+
| 1891 | Beijing   | CHN         | Peking   | {"Population": 7472000}     |
+------+-----------+-------------+----------+-----------------------------+
1 row in set (0.00 sec)
```

##### Informações Relacionadas

* Veja TableUpdateFunction para a definição completa da sintaxe.