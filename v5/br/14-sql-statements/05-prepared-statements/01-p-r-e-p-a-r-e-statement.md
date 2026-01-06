### 13.5.1 Declaração PREPARE

```sql
PREPARE stmt_name FROM preparable_stmt
```

A instrução `PREPARE` prepara uma instrução SQL e atribui a ela um nome, *`stmt_name`*, pelo qual a instrução será referenciada posteriormente. A instrução preparada é executada com `EXECUTE` e liberada com `DEALLOCATE PREPARE`. Para exemplos, consulte Seção 13.5, “Instruções Preparadas”.

Os nomes das declarações não são sensíveis ao maiúsculas e minúsculas. *`preparable_stmt`* é uma literal de string ou uma variável de usuário que contém o texto da declaração SQL. O texto deve representar uma única declaração, não várias. Dentro da declaração, os caracteres `?` podem ser usados como marcadores de parâmetro para indicar onde os valores de dados devem ser vinculados à consulta posteriormente, quando você executá-la. Os caracteres `?` não devem ser fechados entre aspas, mesmo que você pretenda vinculá-los a valores de string. Os marcadores de parâmetro podem ser usados apenas onde os valores de dados devem aparecer, não para palavras-chave SQL, identificadores, etc.

Se uma declaração preparada com o nome fornecido já existir, ela será desalocada implicitamente antes que a nova declaração seja preparada. Isso significa que, se a nova declaração contiver um erro e não puder ser preparada, um erro será retornado e nenhuma declaração com o nome fornecido existirá.

O escopo de uma declaração preparada é a sessão na qual ela é criada, o que tem várias implicações:

- Uma declaração preparada criada em uma sessão não está disponível para outras sessões.

- Quando uma sessão termina, seja de forma normal ou anormal, suas declarações preparadas deixam de existir. Se o recurso de reconexão automática estiver habilitado, o cliente não é notificado de que a conexão foi perdida. Por essa razão, os clientes podem desejar desativar a reconexão automática. Consulte Controle de Reconexão Automática.

- Uma declaração preparada criada dentro de um programa armazenado continua a existir após o programa terminar de ser executado e pode ser executada fora do programa mais tarde.

- Uma declaração preparada em contexto de programa armazenado não pode se referir a parâmetros de procedimentos ou funções armazenados ou variáveis locais, pois elas deixam de estar no escopo quando o programa termina e não estariam disponíveis se a declaração fosse executada posteriormente fora do programa. Como solução alternativa, consulte as variáveis definidas pelo usuário, que também têm escopo de sessão; veja Seção 9.4, “Variáveis Definidas pelo Usuário”.
