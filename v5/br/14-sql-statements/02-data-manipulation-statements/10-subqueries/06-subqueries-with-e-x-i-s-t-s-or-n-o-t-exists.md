#### 13.2.10.6 Subqueries com EXISTS ou NOT EXISTS

Se uma subquery retornar quaisquer linhas, `EXISTS subquery` é `TRUE` e `NOT EXISTS subquery` é `FALSE`. Por exemplo:

```sql
SELECT column1 FROM t1 WHERE EXISTS (SELECT * FROM t2);
```

Tradicionalmente, uma subquery `EXISTS` começa com `SELECT *`, mas poderia começar com `SELECT 5` ou `SELECT column1` ou qualquer outra coisa. O MySQL ignora a lista [`SELECT`](select.html "13.2.9 SELECT Statement") em tal subquery, portanto, não faz diferença.

No exemplo anterior, se `t2` contiver quaisquer linhas, mesmo linhas que contenham apenas valores `NULL`, a condição `EXISTS` é `TRUE`. Este é, na verdade, um exemplo improvável, pois uma subquery `[NOT] EXISTS` quase sempre contém correlações. Aqui estão alguns exemplos mais realistas:

* Que tipo de loja está presente em uma ou mais cidades?

  ```sql
  SELECT DISTINCT store_type FROM stores
    WHERE EXISTS (SELECT * FROM cities_stores
                  WHERE cities_stores.store_type = stores.store_type);
  ```

* Que tipo de loja não está presente em nenhuma cidade?

  ```sql
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (SELECT * FROM cities_stores
                      WHERE cities_stores.store_type = stores.store_type);
  ```

* Que tipo de loja está presente em todas as cidades?

  ```sql
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (
      SELECT * FROM cities WHERE NOT EXISTS (
        SELECT * FROM cities_stores
         WHERE cities_stores.city = cities.city
         AND cities_stores.store_type = stores.store_type));
  ```

O último exemplo é uma Query `NOT EXISTS` duplamente aninhada. Ou seja, ele possui uma cláusula `NOT EXISTS` dentro de outra cláusula `NOT EXISTS`. Formalmente, ele responde à pergunta “existe uma cidade com uma loja que não está em `Stores`?” Mas é mais fácil dizer que um `NOT EXISTS` aninhado responde à pergunta “*x* é `TRUE` para todo *y*?”