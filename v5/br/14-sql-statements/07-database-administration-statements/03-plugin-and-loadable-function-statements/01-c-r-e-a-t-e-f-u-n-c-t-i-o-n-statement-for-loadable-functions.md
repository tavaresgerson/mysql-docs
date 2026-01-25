#### 13.7.3.1 Instrução CREATE FUNCTION para Funções Carregáveis

```sql
CREATE [AGGREGATE] FUNCTION function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

Esta instrução carrega a função carregável nomeada *`function_name`*. (`CREATE FUNCTION` também é usado para criar stored functions; veja [Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”](create-procedure.html "13.1.16 Instruções CREATE PROCEDURE e CREATE FUNCTION").)

Uma função carregável (loadable function) é uma forma de estender o MySQL com uma nova function que funciona como uma function nativa (built-in) do MySQL, como [`ABS()`](mathematical-functions.html#function_abs) ou [`CONCAT()`](string-functions.html#function_concat). Veja [Adicionando uma Função Carregável](/doc/extending-mysql/5.7/en/adding-loadable-function.html).

*`function_name`* é o nome que deve ser usado nas instruções SQL para invocar a function. A cláusula `RETURNS` indica o tipo do valor de retorno da function. `DECIMAL` é um valor legal após `RETURNS`, mas atualmente functions `DECIMAL` retornam valores string e devem ser escritas como functions `STRING`.

A palavra-chave `AGGREGATE`, se fornecida, significa que a function é uma função aggregate (de grupo). Uma função aggregate funciona exatamente como uma função aggregate nativa do MySQL, como [`SUM()`](aggregate-functions.html#function_sum) ou [`COUNT()`](aggregate-functions.html#function_count).

*`shared_library_name`* é o nome base do arquivo shared library contendo o código que implementa a function. O arquivo deve estar localizado no diretório de plugin. Este diretório é fornecido pelo valor da system variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir). Para mais informações, veja [Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”](function-loading.html "5.6.1 Instalando e Desinstalando Funções Carregáveis").

[`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 Instrução CREATE FUNCTION para Funções Carregáveis") exige o privilege [`INSERT`](privileges-provided.html#priv_insert) para o system database `mysql`, pois adiciona uma linha à system table `mysql.func` para registrar a function.

Durante a sequência normal de startup, o server carrega functions registradas na tabela `mysql.func`. Se o server for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), as functions registradas na tabela não são carregadas e ficam indisponíveis.

Note

Para fazer upgrade da shared library associada a uma função carregável, execute uma instrução [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 Instrução DROP FUNCTION para Funções Carregáveis"), faça o upgrade da shared library e, em seguida, execute uma instrução [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 Instrução CREATE FUNCTION para Funções Carregáveis"). Se você fizer o upgrade da shared library primeiro e depois usar [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 Instrução DROP FUNCTION para Funções Carregáveis"), o server pode ser encerrado inesperadamente (shut down).