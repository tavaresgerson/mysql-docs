#### 15.2.15.6 Subconsultas com EXISTS ou NOT EXISTS

Se uma subconsulta retornar qualquer linha, `EXISTS subconsulta` é `TRUE`, e `NOT EXISTS subconsulta` é `FALSE`. Por exemplo:

```
SELECT column1 FROM t1 WHERE EXISTS (SELECT * FROM t2);
```

Tradicionalmente, uma subconsulta `EXISTS` começa com `SELECT *`, mas poderia começar com `SELECT 5` ou `SELECT column1` ou qualquer coisa. O MySQL ignora a lista `SELECT` nessa subconsulta, então não faz diferença.

Para o exemplo anterior, se `t2` contém qualquer linha, mesmo linhas com apenas valores `NULL`, a condição `EXISTS` é `TRUE`. Esse é, na verdade, um exemplo improvável, porque uma subconsulta `[NOT] EXISTS` quase sempre contém correlações. Aqui estão alguns exemplos mais realistas:

* Que tipo de loja está presente em uma ou mais cidades?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE EXISTS (SELECT * FROM cities_stores
                  WHERE cities_stores.store_type = stores.store_type);
  ```

* Que tipo de loja está presente em nenhuma cidade?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (SELECT * FROM cities_stores
                      WHERE cities_stores.store_type = stores.store_type);
  ```

* Que tipo de loja está presente em todas as cidades?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (
      SELECT * FROM cities WHERE NOT EXISTS (
        SELECT * FROM cities_stores
         WHERE cities_stores.city = cities.city
         AND cities_stores.store_type = stores.store_type));
  ```

O último exemplo é uma subconsulta `NOT EXISTS` duplamente enlaçada. Ou seja, tem uma cláusula `NOT EXISTS` dentro de uma cláusula `NOT EXISTS`. Formalmente, responde à pergunta “existe uma cidade com uma loja que não está em `Stores`?” Mas é mais fácil dizer que uma `NOT EXISTS` enlaçada responde à pergunta “*`x`* é `TRUE` para todos os *`y`*?”

Você também pode usar `NOT EXISTS` ou `NOT EXISTS` com `TABLE` na subconsulta, assim:

```
SELECT column1 FROM t1 WHERE EXISTS (TABLE t2);
```

Os resultados são os mesmos quando se usa `SELECT *` sem cláusula `WHERE` na subconsulta.