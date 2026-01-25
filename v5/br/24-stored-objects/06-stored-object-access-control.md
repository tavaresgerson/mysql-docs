## 23.6 Controle de Acesso a Objetos Armazenados

Programas armazenados (procedures, functions, triggers e events) e views são definidos antes do uso e, quando referenciados, são executados dentro de um contexto de segurança que determina seus privilégios. Os privilégios aplicáveis à execução de um objeto armazenado são controlados por seu atributo `DEFINER` e sua característica `SQL SECURITY`.

* O Atributo DEFINER
* A Característica SQL SECURITY
* Exemplos
* Objetos Armazenados Órfãos
* Diretrizes para Minimização de Risco

### O Atributo DEFINER

A definição de um objeto armazenado pode incluir um atributo `DEFINER` que nomeia uma conta MySQL. Se uma definição omite o atributo `DEFINER`, o definer padrão do objeto é o usuário que o cria.

As seguintes regras determinam quais contas você pode especificar como o atributo `DEFINER` para um objeto armazenado:

* Se você tem o privilégio `SUPER`, você pode especificar qualquer conta como o atributo `DEFINER`. Se a conta não existir, um aviso é gerado.

* Caso contrário, a única conta permitida é a sua própria, especificada literalmente ou como `CURRENT_USER` ou `CURRENT_USER()`. Você não pode definir o definer para nenhuma outra conta.

Criar um objeto armazenado com uma conta `DEFINER` inexistente cria um objeto órfão, o que pode ter consequências negativas; veja Objetos Armazenados Órfãos.

### A Característica SQL SECURITY

Para stored routines (procedures e functions) e views, a definição do objeto pode incluir uma característica `SQL SECURITY` com valor `DEFINER` ou `INVOKER` para especificar se o objeto executa no contexto definer ou invoker. Se a definição omite a característica `SQL SECURITY`, o padrão é o contexto definer.

Triggers e events não possuem a característica `SQL SECURITY` e sempre são executados no contexto definer. O servidor invoca esses objetos automaticamente conforme necessário, portanto, não há um usuário invoker.

Os contextos de segurança definer e invoker diferem da seguinte forma:

* Um objeto armazenado que é executado no contexto de segurança definer é executado com os privilégios da conta nomeada por seu atributo `DEFINER`. Esses privilégios podem ser totalmente diferentes daqueles do usuário invoker. O invoker deve ter privilégios apropriados para referenciar o objeto (por exemplo, `EXECUTE` para chamar uma stored procedure ou `SELECT` para selecionar a partir de uma view), mas durante a execução do objeto, os privilégios do invoker são ignorados e apenas os privilégios da conta `DEFINER` são relevantes. Se a conta `DEFINER` tiver poucos privilégios, o objeto será correspondentemente limitado nas operações que pode realizar. Se a conta `DEFINER` for altamente privilegiada (como uma conta administrativa), o objeto pode realizar operações poderosas *independentemente de quem o invoca.*

* Um stored routine ou view que é executado no contexto de segurança invoker pode realizar apenas operações para as quais o invoker possui privilégios. O atributo `DEFINER` não tem efeito na execução do objeto.

### Exemplos

Considere a seguinte stored procedure, que é declarada com `SQL SECURITY DEFINER` para ser executada no contexto de segurança definer:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE p1()
SQL SECURITY DEFINER
BEGIN
  UPDATE t1 SET counter = counter + 1;
END;
```

Qualquer usuário que possua o privilégio `EXECUTE` para `p1` pode invocá-la com uma instrução `CALL`. No entanto, quando `p1` é executada, ela o faz no contexto de segurança definer e, portanto, é executada com os privilégios de `'admin'@'localhost'`, a conta nomeada como seu atributo `DEFINER`. Esta conta deve ter o privilégio `EXECUTE` para `p1`, bem como o privilégio `UPDATE` para a tabela `t1` referenciada dentro do corpo do objeto. Caso contrário, a procedure falhará.

Agora considere esta stored procedure, que é idêntica a `p1`, exceto que sua característica `SQL SECURITY` é `INVOKER`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE p2()
SQL SECURITY INVOKER
BEGIN
  UPDATE t1 SET counter = counter + 1;
END;
```

Ao contrário de `p1`, `p2` é executada no contexto de segurança invoker e, portanto, com os privilégios do usuário invoker, independentemente do valor do atributo `DEFINER`. `p2` falha se o invoker não tiver o privilégio `EXECUTE` para `p2` ou o privilégio `UPDATE` para a tabela `t1`.

### Objetos Armazenados Órfãos

Um objeto armazenado órfão é aquele em que seu atributo `DEFINER` nomeia uma conta inexistente:

* Um objeto armazenado órfão pode ser criado especificando uma conta `DEFINER` inexistente no momento da criação do objeto.

* Um objeto armazenado existente pode se tornar órfão através da execução de uma instrução `DROP USER` que remove a conta `DEFINER` do objeto, ou uma instrução `RENAME USER` que renomeia a conta `DEFINER` do objeto.

Um objeto armazenado órfão pode ser problemático das seguintes maneiras:

* Como a conta `DEFINER` não existe, o objeto pode não funcionar como esperado se for executado no contexto de segurança definer:

  + Para um stored routine, ocorre um erro no momento da execução da rotina se o valor `SQL SECURITY` for `DEFINER`, mas a conta definer não existir.

  + Para um trigger, não é recomendado que a ativação do trigger ocorra até que a conta realmente exista. Caso contrário, o comportamento em relação à verificação de privilégios é indefinido.

  + Para um event, ocorre um erro no momento da execução do event se a conta não existir.

  + Para uma view, ocorre um erro quando a view é referenciada se o valor `SQL SECURITY` for `DEFINER`, mas a conta definer não existir.

* O objeto pode apresentar um risco de segurança se a conta `DEFINER` inexistente for posteriormente recriada para um propósito não relacionado ao objeto. Neste caso, a conta "adota" o objeto e, com os privilégios apropriados, é capaz de executá-lo, mesmo que essa não seja a intenção.

Para obter informações sobre as contas usadas como definers de objetos armazenados em uma instalação MySQL, consulte o `INFORMATION_SCHEMA`.

Esta Query identifica quais tabelas do `INFORMATION_SCHEMA` descrevem objetos que possuem um atributo `DEFINER`:

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE COLUMN_NAME = 'DEFINER';
+--------------------+------------+
| TABLE_SCHEMA       | TABLE_NAME |
+--------------------+------------+
| information_schema | EVENTS     |
| information_schema | ROUTINES   |
| information_schema | TRIGGERS   |
| information_schema | VIEWS      |
+--------------------+------------+
```

O resultado informa quais tabelas consultar para descobrir quais valores `DEFINER` de objetos armazenados existem e quais objetos possuem um determinado valor `DEFINER`:

* Para identificar quais valores `DEFINER` existem em cada tabela, use estas Queries:

  ```sql
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.EVENTS;
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.ROUTINES;
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.TRIGGERS;
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.VIEWS;
  ```

  Os resultados da Query são significativos para qualquer conta exibida da seguinte forma:

  + Se a conta existir, removê-la (`dropping`) ou renomeá-la fará com que objetos armazenados se tornem órfãos. Se você planeja remover ou renomear a conta, considere primeiro remover seus objetos armazenados associados ou redefini-los para ter um definer diferente.

  + Se a conta não existir, criá-la fará com que ela adote objetos armazenados atualmente órfãos. Se você planeja criar a conta, considere se os objetos órfãos devem ser associados a ela. Caso contrário, redefina-os para ter um definer diferente.

  Para redefinir um objeto com um definer diferente, você pode usar `ALTER EVENT` ou `ALTER VIEW` para modificar diretamente a conta `DEFINER` de events e views. Para stored procedures, functions e triggers, você deve remover o objeto e recriá-lo com uma conta `DEFINER` diferente.

* Para identificar quais objetos possuem uma determinada conta `DEFINER`, use estas Queries, substituindo a conta de interesse por `user_name@host_name`:

  ```sql
  SELECT EVENT_SCHEMA, EVENT_NAME FROM INFORMATION_SCHEMA.EVENTS
  WHERE DEFINER = 'user_name@host_name';
  SELECT ROUTINE_SCHEMA, ROUTINE_NAME, ROUTINE_TYPE
  FROM INFORMATION_SCHEMA.ROUTINES
  WHERE DEFINER = 'user_name@host_name';
  SELECT TRIGGER_SCHEMA, TRIGGER_NAME FROM INFORMATION_SCHEMA.TRIGGERS
  WHERE DEFINER = 'user_name@host_name';
  SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS
  WHERE DEFINER = 'user_name@host_name';
  ```

  Para a tabela `ROUTINES`, a Query inclui a coluna `ROUTINE_TYPE` para que as linhas de saída distingam se o `DEFINER` é para uma stored procedure ou stored function.

  Se a conta que você está procurando não existir, quaisquer objetos exibidos por essas Queries são objetos órfãos.

### Diretrizes para Minimização de Risco

Para minimizar o risco potencial na criação e uso de objetos armazenados, siga estas diretrizes:

* Não crie objetos armazenados órfãos; ou seja, objetos para os quais o atributo `DEFINER` nomeia uma conta inexistente. Não faça com que objetos armazenados se tornem órfãos ao remover ou renomear uma conta nomeada pelo atributo `DEFINER` de qualquer objeto existente.

* Para um stored routine ou view, use `SQL SECURITY INVOKER` na definição do objeto sempre que possível, para que ele possa ser usado apenas por usuários com permissões apropriadas para as operações realizadas pelo objeto.

* Se você criar objetos armazenados de contexto definer enquanto usa uma conta que tem o privilégio `SUPER`, especifique um atributo `DEFINER` explícito que nomeie uma conta possuindo apenas os privilégios necessários para as operações realizadas pelo objeto. Especifique uma conta `DEFINER` altamente privilegiada apenas quando for absolutamente necessário.

* Administradores podem impedir que usuários criem objetos armazenados que especifiquem contas `DEFINER` altamente privilegiadas, não concedendo a eles o privilégio `SUPER`.

* Objetos de contexto definer devem ser escritos tendo em mente que eles podem acessar dados para os quais o usuário invoker não tem privilégios. Em alguns casos, você pode impedir referências a esses objetos não concedendo privilégios específicos a usuários não autorizados:

  + Um stored routine não pode ser referenciado por um usuário que não tenha o privilégio `EXECUTE` para ele.

  + Uma view não pode ser referenciada por um usuário que não tenha o privilégio apropriado para ela (`SELECT` para selecionar a partir dela, `INSERT` para inserir nela, e assim por diante).

  No entanto, não existe tal controle para triggers e events porque eles sempre são executados no contexto definer. O servidor invoca esses objetos automaticamente conforme necessário, e os usuários não os referenciam diretamente:

  + Um trigger é ativado pelo acesso à tabela à qual está associado, mesmo acessos comuns à tabela por usuários sem privilégios especiais.

  + Um event é executado pelo servidor em uma base agendada.

  Em ambos os casos, se a conta `DEFINER` for altamente privilegiada, o objeto pode ser capaz de realizar operações sensíveis ou perigosas. Isso permanece verdadeiro se os privilégios necessários para criar o objeto forem revogados da conta do usuário que o criou. Os administradores devem ser especialmente cuidadosos ao conceder privilégios de criação de objetos aos usuários.