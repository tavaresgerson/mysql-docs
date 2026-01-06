#### 13.2.10.6 Subconsultas com EXISTS ou NOT EXISTS

Se uma subconsulta retornar qualquer linha, `EXISTS subquery` é `TRUE` e `NOT EXISTS subquery` é `FALSE`. Por exemplo:

```sql
SELECT column1 FROM t1 WHERE EXISTS (SELECT * FROM t2);
```

Tradicionalmente, uma subconsulta `EXISTS` começa com `SELECT *`, mas poderia começar com `SELECT 5` ou `SELECT column1` ou qualquer outra coisa. O MySQL ignora a lista `SELECT` em uma subconsulta desse tipo, então não faz diferença.

Para o exemplo anterior, se `t2` contiver qualquer linha, mesmo linhas com apenas valores `NULL`, a condição `EXISTS` será `TRUE`. Esse é, na verdade, um exemplo improvável, pois uma subconsulta `[NOT] EXISTS` quase sempre contém correlações. Aqui estão alguns exemplos mais realistas:

- Que tipo de loja está presente em uma ou mais cidades?

  ```sql
  SELECT DISTINCT store_type FROM stores
    WHERE EXISTS (SELECT * FROM cities_stores
                  WHERE cities_stores.store_type = stores.store_type);
  ```

- Que tipo de loja está presente em nenhuma cidade?

  ```sql
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (SELECT * FROM cities_stores
                      WHERE cities_stores.store_type = stores.store_type);
  ```

- Que tipo de loja está presente em todas as cidades?

  ```sql
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (
      SELECT * FROM cities WHERE NOT EXISTS (
        SELECT * FROM cities_stores
         WHERE cities_stores.city = cities.city
         AND cities_stores.store_type = stores.store_type));
  ```

O último exemplo é uma consulta `NOT EXISTS` duplamente aninhada. Ou seja, ela tem uma cláusula `NOT EXISTS` dentro de uma cláusula `NOT EXISTS`. Formalmente, ela responde à pergunta “existe uma cidade com uma loja que não está em `Stores`?” Mas é mais fácil dizer que uma `NOT EXISTS` aninhada responde à pergunta “*`x`* é `TRUE` para todos os *`y`*?”
