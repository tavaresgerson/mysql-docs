#### 15.7.4.2 Declaração `DROP FUNCTION` para Funções Carregáveis

```
DROP FUNCTION [IF EXISTS] function_name
```

Esta declaração exclui a função carregável denominada *`nome_da_função`*. (`DROP FUNCTION` também é usado para excluir funções armazenadas; veja a Seção 15.1.34, “Declarações `DROP PROCEDURE` e `DROP FUNCTION`.”)

`DROP FUNCTION` é o complemento de `CREATE FUNCTION`. Requer o privilégio `DELETE` para o esquema de sistema `mysql` porque remove a linha da tabela de sistema `mysql.func` que registra a função.

`DROP FUNCTION` também exclui a função da tabela do Schema de Desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 29.12.22.12, “A tabela user_defined_functions”.

Durante a sequência de inicialização normal, o servidor carrega as funções registradas na tabela `mysql.func`. Como `DROP FUNCTION` exclui a linha `mysql.func` da função excluída, o servidor não carrega a função durante reinicializações subsequentes.

`DROP FUNCTION` não pode ser usado para excluir uma função carregável que é instalada automaticamente por componentes ou plugins, em vez de usar `CREATE FUNCTION`. Tal função também é excluída automaticamente quando o componente ou plugin que a instalou é desinstalado.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.