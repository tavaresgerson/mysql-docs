#### 15.2.15.6 Subconsultas com EXISTS ou NOT EXISTS

Se uma subconsulta retornar qualquer linha, `EXISTS subquery` é `TRUE`, e `NOT EXISTS subquery` é `FALSE`. Por exemplo:

```
SELECT column1 FROM t1 WHERE EXISTS (SELECT * FROM t2);
```

Tradicionalmente, uma subconsulta `EXISTS` começa com `SELECT *`, mas poderia começar com `SELECT 5` ou `SELECT column1` ou qualquer outra coisa. O MySQL ignora a lista `SELECT` em uma subconsulta desse tipo, então não faz diferença.

Para o exemplo anterior, se `t2` contiver qualquer linha, mesmo linhas com apenas valores de `NULL`, a condição `EXISTS` é `TRUE`. Esse é, na verdade, um exemplo improvável, pois uma subconsulta `[NOT] EXISTS` quase sempre contém correlações. Aqui estão alguns exemplos mais realistas:

- Que tipo de loja está presente em uma ou mais cidades?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE EXISTS (SELECT * FROM cities_stores
                  WHERE cities_stores.store_type = stores.store_type);
  ```

- Que tipo de loja está presente em nenhuma cidade?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (SELECT * FROM cities_stores
                      WHERE cities_stores.store_type = stores.store_type);
  ```

- Que tipo de loja está presente em todas as cidades?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (
      SELECT * FROM cities WHERE NOT EXISTS (
        SELECT * FROM cities_stores
         WHERE cities_stores.city = cities.city
         AND cities_stores.store_type = stores.store_type));
  ```

O último exemplo é uma consulta duplamente aninhada `NOT EXISTS`. Ou seja, ela tem uma cláusula `NOT EXISTS` dentro de uma cláusula `NOT EXISTS`. Formalmente, ela responde à pergunta “existe uma cidade com uma loja que não está em `Stores`”? Mas é mais fácil dizer que uma `NOT EXISTS` aninhada responde à pergunta “`x` é `TRUE` para todos os `y`?”

No MySQL 8.0.19 e versões posteriores, você também pode usar `NOT EXISTS` ou `NOT EXISTS` com `TABLE` na subconsulta, assim:

```
SELECT column1 FROM t1 WHERE EXISTS (TABLE t2);
```

Os resultados são os mesmos quando se usa `SELECT *` sem a cláusula `WHERE` na subconsulta.
