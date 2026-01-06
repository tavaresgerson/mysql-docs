#### 13.7.3.1 Declaração CREATE FUNCTION para funções carregáveis

```sql
CREATE [AGGREGATE] FUNCTION function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

Esta declaração carrega a função carregável nomeada *`function_name`*. (`CREATE FUNCTION` também é usado para criar funções armazenadas; veja Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

Uma função carregável é uma maneira de estender o MySQL com uma nova função que funciona como uma função nativa (integrada) do MySQL, como [`ABS()`](https://pt.wikipedia.org/wiki/ABS_\(fun%C3%A7%C3%A3o_matem%C3%A1tica\)) ou [`CONCAT()`](https://pt.wikipedia.org/wiki/CONCAT_\(fun%C3%A7%C3%A3o_de_string\)). Veja Adicionar uma Função Carregável.

*`nome_da_função`* é o nome que deve ser usado nas instruções SQL para invocar a função. A cláusula `RETURNS` indica o tipo do valor de retorno da função. `DECIMAL` é um valor válido após `RETURNS`, mas atualmente as funções `DECIMAL` retornam valores de string e devem ser escritas como funções `STRING`.

A palavra-chave `AGGREGATE`, se fornecida, indica que a função é uma função agregada (grupo). Uma função agregada funciona exatamente como uma função agregada nativa do MySQL, como `SUM()` ou `COUNT()`.

*`shared_library_name`* é o nome base do arquivo de biblioteca compartilhada que contém o código que implementa a função. O arquivo deve estar localizado no diretório do plugin. Esse diretório é fornecido pelo valor da variável de sistema `plugin_dir`. Para mais informações, consulte a Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

A função `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados do sistema `mysql`, pois adiciona uma linha à tabela do sistema `mysql.func` para registrar a função.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração de `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração de `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.
