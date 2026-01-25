#### 13.6.5.1 Instrução CASE

```sql
CASE case_value
    WHEN when_value THEN statement_list
    [WHEN when_value THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

Ou:

```sql
CASE
    WHEN search_condition THEN statement_list
    [WHEN search_condition THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

A instrução [`CASE`](case.html "13.6.5.1 CASE Statement") para stored programs implementa uma construção condicional complexa.

Nota

Existe também um *operator* [`CASE`](flow-control-functions.html#operator_case), que difere da *instrução* [`CASE`](case.html "13.6.5.1 CASE Statement") descrita aqui. Consulte [Section 12.5, “Flow Control Functions”](flow-control-functions.html "12.5 Flow Control Functions"). A instrução [`CASE`](case.html "13.6.5.1 CASE Statement") não pode ter uma cláusula `ELSE NULL`, e é finalizada com `END CASE` em vez de `END`.

Para a primeira sintaxe, *`case_value`* é uma expression. Este valor é comparado à expression *`when_value`* em cada cláusula `WHEN` até que uma delas seja igual. Quando um *`when_value`* igual é encontrado, a *`statement_list`* da cláusula `THEN` correspondente é executada. Se nenhum *`when_value`* for igual, a *`statement_list`* da cláusula `ELSE` é executada, se houver uma.

Esta sintaxe não pode ser usada para testar igualdade com `NULL` porque `NULL = NULL` é falso. Consulte [Section 3.3.4.6, “Working with NULL Values”](working-with-null.html "3.3.4.6 Working with NULL Values").

Para a segunda sintaxe, a expression *`search_condition`* de cada cláusula `WHEN` é avaliada até que uma seja verdadeira, momento em que a *`statement_list`* da sua cláusula `THEN` correspondente é executada. Se nenhuma *`search_condition`* for igual, a *`statement_list`* da cláusula `ELSE` é executada, se houver uma.

Se nenhum *`when_value`* ou *`search_condition`* corresponder ao valor testado e a instrução [`CASE`](case.html "13.6.5.1 CASE Statement") não contiver uma cláusula `ELSE`, resultará em um erro do tipo Case not found for CASE statement.

Cada *`statement_list`* consiste em uma ou mais instruções SQL; uma *`statement_list`* vazia não é permitida.

Para lidar com situações em que nenhum valor é correspondido por qualquer cláusula `WHEN`, use um `ELSE` contendo um bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") vazio, conforme mostrado neste exemplo. (O recuo usado aqui na cláusula `ELSE` é apenas para fins de clareza e não tem outra significância.)

```sql
DELIMITER |

CREATE PROCEDURE p()
  BEGIN
    DECLARE v INT DEFAULT 1;

    CASE v
      WHEN 2 THEN SELECT v;
      WHEN 3 THEN SELECT 0;
      ELSE
        BEGIN
        END;
    END CASE;
  END;
  |
```