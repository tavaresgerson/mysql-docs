#### 15.7.4.2 Declaração da função DROP para funções carregáveis

```
DROP FUNCTION [IF EXISTS] function_name
```

Essa declaração elimina a função carregável chamada `function_name`. (`DROP FUNCTION` também é usado para eliminar funções armazenadas; veja a Seção 15.1.29, “Instruções DROP PROCEDURE e DROP FUNCTION”.)

`DROP FUNCTION` é o complemento de `CREATE FUNCTION`. Ele requer o privilégio `DELETE` para o esquema de sistema `mysql`, pois remove a linha da tabela de sistema `mysql.func` que registra a função.

`DROP FUNCTION` também remove a função da tabela do Schema de Desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 29.12.21.10, “A tabela user\_defined\_functions”.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Como o `DROP FUNCTION` remove a linha `mysql.func` da função removida, o servidor não carrega a função durante reinicializações subsequentes.

`DROP FUNCTION` não pode ser usado para descartar uma função carregável que é instalada automaticamente por componentes ou plugins, em vez de usar `CREATE FUNCTION`. Tal função também é descartada automaticamente quando o componente ou plugin que a instalou é desinstalado.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.
