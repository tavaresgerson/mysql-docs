#### 13.7.3.1 Instrução CREATE FUNCTION para Funções Carregáveis

```sql
CREATE [AGGREGATE] FUNCTION function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

Esta instrução carrega a função carregável nomeada *`function_name`*. (`CREATE FUNCTION` também é usado para criar stored functions; veja Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

Uma função carregável (loadable function) é uma forma de estender o MySQL com uma nova function que funciona como uma function nativa (built-in) do MySQL, como `ABS()` ou `CONCAT()`. Veja Adicionando uma Função Carregável.

*`function_name`* é o nome que deve ser usado nas instruções SQL para invocar a function. A cláusula `RETURNS` indica o tipo do valor de retorno da function. `DECIMAL` é um valor legal após `RETURNS`, mas atualmente functions `DECIMAL` retornam valores string e devem ser escritas como functions `STRING`.

A palavra-chave `AGGREGATE`, se fornecida, significa que a function é uma função aggregate (de grupo). Uma função aggregate funciona exatamente como uma função aggregate nativa do MySQL, como `SUM()` ou `COUNT()`.

*`shared_library_name`* é o nome base do arquivo shared library contendo o código que implementa a function. O arquivo deve estar localizado no diretório de plugin. Este diretório é fornecido pelo valor da system variable `plugin_dir`. Para mais informações, veja Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

`CREATE FUNCTION` exige o privilege `INSERT` para o system database `mysql`, pois adiciona uma linha à system table `mysql.func` para registrar a function.

Durante a sequência normal de startup, o server carrega functions registradas na tabela `mysql.func`. Se o server for iniciado com a opção `--skip-grant-tables`, as functions registradas na tabela não são carregadas e ficam indisponíveis.

Note

Para fazer upgrade da shared library associada a uma função carregável, execute uma instrução `DROP FUNCTION`, faça o upgrade da shared library e, em seguida, execute uma instrução `CREATE FUNCTION`. Se você fizer o upgrade da shared library primeiro e depois usar `DROP FUNCTION`, o server pode ser encerrado inesperadamente (shut down).