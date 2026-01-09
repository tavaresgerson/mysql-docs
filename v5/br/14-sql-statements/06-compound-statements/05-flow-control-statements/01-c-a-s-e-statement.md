#### 13.6.5.1 Declaração CASE

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

A instrução `CASE` para programas armazenados implementa uma construção condicional complexa.

Nota

Existe também um operador *CASE* (funções de controle de fluxo.html#operador_case\*), que difere da declaração *CASE* (case.html) descrita aqui. Veja Seção 12.5, “Funções de Controle de Fluxo”. A declaração *CASE* (case.html) não pode ter uma cláusula *ELSE NULL* e é encerrada com *END CASE* em vez de *END*.

Para a primeira sintaxe, *`case_value`* é uma expressão. Esse valor é comparado com a expressão *`when_value`* em cada cláusula `WHEN` até que uma delas seja igual. Quando uma *`when_value`* igual é encontrada, a cláusula `THEN` correspondente *`statement_list`* é executada. Se nenhuma *`when_value`* for igual, a cláusula `ELSE` *`statement_list`* é executada, se houver uma.

Essa sintaxe não pode ser usada para testar a igualdade com `NULL`, porque `NULL = NULL` é falso. Veja Seção 3.3.4.6, “Trabalhando com Valores NULL”.

Para a segunda sintaxe, cada expressão da cláusula `WHEN *` `search_condition`\* é avaliada até que uma seja verdadeira, momento em que sua cláusula correspondente `THEN *` `statement_list`\* é executada. Se nenhuma *`search_condition`* for igual, a cláusula `ELSE *` `statement_list`\* é executada, se houver uma.

Se nenhum valor de *`when_value`* ou *`search_condition`* corresponder ao valor testado e a instrução `CASE` (case.html) não contiver nenhuma cláusula `ELSE`, será gerado um erro de não encontrar o caso para a instrução `CASE`.

Cada *`statement_list`* consiste em uma ou mais instruções SQL; uma *`statement_list`* vazia não é permitida.

Para lidar com situações em que nenhum valor é correspondido por nenhuma cláusula `WHEN`, use um `ELSE` contendo um bloco vazio de `[BEGIN ... END]` (begin-end.html), como mostrado neste exemplo. (A indentação usada aqui na cláusula `ELSE` é apenas para fins de clareza e não tem importância adicional.)

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
