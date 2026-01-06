#### 13.7.3.2 Declaração da função DROP para funções carregáveis

```sql
DROP FUNCTION [IF EXISTS] function_name
```

Essa declaração exclui a função carregável chamada *`nome_da_função`*. (`DROP FUNCTION` também é usado para excluir funções armazenadas; veja Seção 13.1.27, “Instruções DROP PROCEDURE e DROP FUNCTION”.)

`DROP FUNCTION` é o complemento de `CREATE FUNCTION`. Ele requer o privilégio `DELETE` para o banco de dados do sistema `mysql`, pois remove a linha da tabela do sistema `mysql.func` que registra a função.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Como o `DROP FUNCTION` remove a linha `mysql.func` da função que foi removida, o servidor não carrega a função durante reinicializações subsequentes.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração de `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração de `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.
