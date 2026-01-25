### 13.5.1 Instrução PREPARE

```sql
PREPARE stmt_name FROM preparable_stmt
```

A instrução [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") prepara uma instrução SQL e atribui a ela um nome, *`stmt_name`*, pelo qual a instrução será referenciada posteriormente. A instrução preparada é executada com [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement") e liberada com [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement"). Para exemplos, veja [Seção 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements").

Nomes de instrução não diferenciam maiúsculas de minúsculas (*case-sensitive*). *`preparable_stmt`* é um literal string ou uma user variable (variável de usuário) que contém o texto da instrução SQL. O texto deve representar uma única instrução, e não múltiplas instruções. Dentro da instrução, caracteres `?` podem ser usados como *parameter markers* para indicar onde os valores de dados devem ser ligados à Query posteriormente, quando você a executa. Os caracteres `?` não devem ser incluídos em aspas, mesmo que você pretenda ligá-los a valores string. *Parameter markers* podem ser usados apenas onde valores de dados devem aparecer, e não para *SQL keywords*, identificadores, e assim por diante.

Se uma instrução preparada com o nome fornecido já existe, ela é desalocada implicitamente antes que a nova instrução seja preparada. Isso significa que se a nova instrução contiver um erro e não puder ser preparada, um erro é retornado e nenhuma instrução com o nome fornecido existirá.

O *scope* (escopo) de uma instrução preparada é a *session* (sessão) dentro da qual ela é criada, o que acarreta várias implicações:

*   Uma instrução preparada criada em uma *session* não está disponível para outras *sessions*.

*   Quando uma *session* termina, seja de forma normal ou anormal, suas instruções preparadas deixam de existir. Se o *auto-reconnect* estiver habilitado, o cliente não é notificado de que a conexão foi perdida. Por este motivo, os clientes podem querer desabilitar o *auto-reconnect*. Veja [Controle de Reconexão Automática](/doc/c-api/5.7/en/c-api-auto-reconnect.html).

*   Uma instrução preparada criada dentro de um programa armazenado continua a existir após o programa terminar a execução e pode ser executada fora do programa posteriormente.

*   Uma instrução preparada no contexto de um programa armazenado não pode fazer referência a parâmetros de *stored procedure* ou *function*, ou variáveis locais, porque elas saem do *scope* quando o programa termina e não estariam disponíveis se a instrução fosse executada posteriormente fora do programa. Como *workaround* (solução alternativa), faça referência, em vez disso, a variáveis definidas pelo usuário, que também têm *session scope*; veja [Seção 9.4, “User-Defined Variables”](user-variables.html "9.4 User-Defined Variables").