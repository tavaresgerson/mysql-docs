#### 15.7.4.1 Declaração CREATE FUNCTION para funções carregáveis

```
CREATE [AGGREGATE] FUNCTION [IF NOT EXISTS] function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

Esta declaração carrega a função carregável nomeada `function_name`. (`CREATE FUNCTION` também é usado para criar funções armazenadas; veja a Seção 15.1.17, “Instruções CREATE PROCEDURE e CREATE FUNCTION”).

Uma função carregável é uma maneira de estender o MySQL com uma nova função que funciona como uma função nativa (incorporada) do MySQL, como `ABS()` ou `CONCAT()`. Veja Adicionar uma Função Carregável.

`function_name` é o nome que deve ser usado nas instruções SQL para invocar a função. A cláusula `RETURNS` indica o tipo do valor de retorno da função. `DECIMAL` é um valor legal após `RETURNS`, mas atualmente as funções `DECIMAL` retornam valores de string e devem ser escritas como funções `STRING`.

`IF NOT EXISTS` impede que um erro ocorra se já existir uma função carregável com o mesmo nome. Ele *não* impede que um erro ocorra se já existir uma função embutida com o mesmo nome. `IF NOT EXISTS` é suportado para instruções `CREATE FUNCTION` que começam com o MySQL 8.0.29. Veja também Resolução de Nome de Função.

A palavra-chave `AGGREGATE` (se fornecida) indica que a função é uma função agregada (grupo). Uma função agregada funciona exatamente como uma função agregada nativa do MySQL, como `SUM()` ou `COUNT()`.

`shared_library_name` é o nome base do arquivo de biblioteca compartilhada que contém o código que implementa a função. O arquivo deve estar localizado no diretório do plugin. Esse diretório é fornecido pelo valor da variável de sistema `plugin_dir`. Para mais informações, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

O `CREATE FUNCTION` requer o privilégio `INSERT` para o esquema de sistema `mysql` porque adiciona uma linha à tabela de sistema `mysql.func` para registrar a função.

`CREATE FUNCTION` também adiciona a função à tabela do Schema de Desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 29.12.21.10, “A tabela user\_defined\_functions”.

Nota

Assim como a tabela do sistema `mysql.func`, a tabela do Schema de Desempenho `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION`. Ao contrário da tabela `mysql.func`, a tabela `user_defined_functions` também lista as funções carregáveis instaladas automaticamente por componentes do servidor ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.
