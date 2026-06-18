#### 15.6.5.1 Declaração CASE

```
CASE case_value
    WHEN when_value THEN statement_list
    [WHEN when_value THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

Ou:

```
CASE
    WHEN search_condition THEN statement_list
    [WHEN search_condition THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

A declaração `CASE` para programas armazenados implementa uma construção condicional complexa.

Nota

Existe também um operador `CASE` \* e a instrução `CASE` \* descrita aqui são diferentes. Veja a Seção 14.5, “Funções de Controle de Fluxo”. A instrução `CASE` não pode ter uma cláusula `ELSE NULL`, e é finalizada com `END CASE` em vez de `END`.

Para a primeira sintaxe, `case_value` é uma expressão. Esse valor é comparado com a expressão `when_value` em cada cláusula `WHEN` até que uma delas seja igual. Quando uma `when_value` igual é encontrada, a cláusula correspondente `THEN` `statement_list` é executada. Se nenhuma `when_value` for igual, a cláusula `ELSE` `statement_list` é executada, se houver uma.

Essa sintaxe não pode ser usada para testar a igualdade com `NULL` porque `NULL = NULL` é falsa. Veja a Seção 5.3.4.6, “Trabalhando com Valores NULL”.

Para a segunda sintaxe, cada cláusula `WHEN` `search_condition` expressão é avaliada até que uma seja verdadeira, momento em que sua cláusula correspondente `THEN` `statement_list` é executada. Se nenhum `search_condition` for igual, a cláusula `ELSE` `statement_list` é executada, se houver uma.

Se nenhum `when_value` ou `search_condition` corresponder ao valor testado e a cláusula `CASE` da instrução CASE não contiver nenhuma cláusula `ELSE`, será gerado um erro de "Caso não encontrado para a instrução CASE".

Cada `statement_list` consiste em uma ou mais instruções SQL; um `statement_list` vazio não é permitido.

Para lidar com situações em que nenhum valor é correspondido por qualquer cláusula `WHEN`, use uma `ELSE` que contenha um bloco vazio `BEGIN ... END`, conforme mostrado neste exemplo. (A indentação usada aqui na cláusula `ELSE` é apenas para fins de clareza e não tem importância significativa.)

```
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
