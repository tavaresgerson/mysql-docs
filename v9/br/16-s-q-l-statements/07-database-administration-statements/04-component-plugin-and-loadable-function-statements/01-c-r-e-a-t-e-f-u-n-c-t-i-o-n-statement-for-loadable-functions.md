#### 15.7.4.1 Declaração `CREATE FUNCTION` para Funções Carregáveis

```
CREATE [AGGREGATE] FUNCTION [IF NOT EXISTS] function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

Esta declaração carrega a função carregável nomeada *`nome_função`*. (`CREATE FUNCTION` também é usado para criar funções armazenadas; veja Seção 15.1.21, “Declarações `CREATE PROCEDURE` e `CREATE FUNCTION`.”)

Uma função carregável é uma maneira de estender o MySQL com uma nova função que funciona como uma função nativa (incorporada) do MySQL, como `ABS()` ou `CONCAT()`. Veja Adicionar uma Função Carregável.

*`nome_função`* é o nome que deve ser usado em declarações SQL para invocar a função. A cláusula `RETURNS` indica o tipo do valor de retorno da função. `DECIMAL` é um valor legal após `RETURNS`, mas atualmente as funções `DECIMAL` retornam valores de string e devem ser escritas como funções `STRING`.

`IF NOT EXISTS` previne que um erro ocorra se já existir uma função carregável com o mesmo nome. Isso *não* previne que um erro ocorra se já existir uma função incorporada com o mesmo nome. `IF NOT EXISTS` também é suportado para declarações `CREATE FUNCTION`. Veja Resolução de Nome de Função.

A palavra-chave `AGGREGATE`, se fornecida, indica que a função é uma função agregada (grupo). Uma função agregada funciona exatamente como uma função agregada nativa do MySQL, como `SUM()` ou `COUNT()`.

*`nome_biblioteca_compartilhada`* é o nome base do arquivo da biblioteca compartilhada que contém o código que implementa a função. O arquivo deve estar localizado no diretório do plugin. Esse diretório é dado pelo valor da variável de sistema `plugin_dir`. Para mais informações, veja Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

`CREATE FUNCTION` requer o privilégio `INSERT` para o esquema de sistema `mysql` porque adiciona uma linha à tabela de sistema `mysql.func` para registrar a função.

A instrução `CREATE FUNCTION` também adiciona a função à tabela do Schema de Desempenho `user_defined_functions`, que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 29.12.22.12, “A tabela user_defined_functions”.

Observação

Assim como a tabela `mysql.func` do sistema, a tabela do Schema de Desempenho `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION`. Ao contrário da tabela `mysql.func`, a tabela `user_defined_functions` também lista as funções carregáveis instaladas automaticamente por componentes do servidor ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis.

Observação

Para atualizar a biblioteca compartilhada associada a uma função carregável, execute uma instrução `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma instrução `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e depois usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.