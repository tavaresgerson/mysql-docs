#### 13.7.3.2 Declaração DROP FUNCTION para Funções Carregáveis (Loadable Functions)

```sql
DROP FUNCTION [IF EXISTS] function_name
```

Esta declaração remove a Loadable Function nomeada *`function_name`*. (`DROP FUNCTION` também é usado para remover stored functions; consulte [Seção 13.1.27, “Declarações DROP PROCEDURE e DROP FUNCTION”](drop-procedure.html "13.1.27 Declarações DROP PROCEDURE e DROP FUNCTION").)

[`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") é o complemento de [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Ela requer o privilege [`DELETE`](privileges-provided.html#priv_delete) para o system database `mysql`, pois remove a linha da system table `mysql.func` que registra a function.

Durante a sequência normal de startup, o server carrega as functions registradas na tabela `mysql.func`. Como [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") remove a linha `mysql.func` da function removida (dropped), o server não carrega a function durante restarts subsequentes.

Nota

Para fazer o upgrade da shared library associada a uma loadable function, emita uma declaração [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), faça o upgrade da shared library e, em seguida, emita uma declaração [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Se você fizer o upgrade da shared library primeiro e depois usar [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), o server pode ser inesperadamente encerrado (shut down).