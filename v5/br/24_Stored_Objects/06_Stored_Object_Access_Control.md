## 23.6 Controle de Acesso a Objetos Armazenados

Os programas armazenados (procedimentos, funções, gatilhos e eventos) e as visualizações são definidos antes do uso e, quando referenciados, são executados dentro de um contexto de segurança que determina seus privilégios. Os privilégios aplicáveis à execução de um objeto armazenado são controlados por seu atributo `DEFINER` e característica `SQL SECURITY`.

* O atributo DEFINER
* A característica de SEGURANÇA SQL
* Exemplos
* Objetos armazenados órfãos
* Diretrizes de minimização de riscos

### O atributo DEFINER

Uma definição de objeto armazenada pode incluir um atributo `DEFINER` que nomeia uma conta MySQL. Se uma definição omite o atributo `DEFINER`, o definidor padrão do objeto é o usuário que a cria.

As regras a seguir determinam quais contas você pode especificar como o atributo `DEFINER` para um objeto armazenado:

* Se você tiver o privilégio `SUPER`, pode especificar qualquer conta como o atributo [[`DEFINER`]. Se a conta não existir, um aviso é gerado.

* Caso contrário, a única conta permitida é a sua própria, especificada de forma literal ou como `CURRENT_USER` ou `CURRENT_USER()`. Você não pode definir o definidor para qualquer outra conta.

Criar um objeto armazenado com uma conta inexistente `DEFINER` cria um objeto órfão, que pode ter consequências negativas; veja Objetos Armazenados Órfãos.

### A característica de segurança SQL

Para rotinas armazenadas (procedimentos e funções) e visualizações, a definição do objeto pode incluir uma característica `SQL SECURITY` com um valor de `DEFINER` ou `INVOKER` para especificar se o objeto é executado em contexto de definidor ou invocador. Se a definição omite a característica `SQL SECURITY`, o padrão é o contexto de definidor.

Os gatilhos e eventos não têm característica `SQL SECURITY` e sempre são executados no contexto definido. O servidor invoca esses objetos automaticamente conforme necessário, portanto, não há usuário invocando.

Os contextos de segurança do definidor e do invocador diferem da seguinte forma:

* Um objeto armazenado que é executado no contexto de segurança do definidor é executado com os privilégios da conta nomeada pelo seu atributo `DEFINER`. Esses privilégios podem ser completamente diferentes dos do usuário que está invocando. O invocante deve ter privilégios apropriados para referenciar o objeto (por exemplo, `EXECUTE` para chamar um procedimento armazenado ou `SELECT` para selecionar de uma visão), mas durante a execução do objeto, os privilégios do invocante são ignorados e apenas os privilégios da conta `DEFINER` importam. Se a conta `DEFINER` tiver poucos privilégios, o objeto é, consequentemente, limitado nas operações que pode realizar. Se a conta `DEFINER` for altamente privilegiada (como uma conta administrativa), o objeto pode realizar operações poderosas *sem importar quem a invoque.*

* Uma rotina ou visão armazenada que é executada no contexto de segurança do invocador pode realizar apenas operações para as quais o invocador tem privilégios. O atributo `DEFINER` não tem efeito na execução do objeto.

### Exemplos

Considere o seguinte procedimento armazenado, que é declarado com `SQL SECURITY DEFINER` para executar em contexto de segurança definido:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE p1()
SQL SECURITY DEFINER
BEGIN
  UPDATE t1 SET counter = counter + 1;
END;
```

Qualquer usuário que tenha o privilégio `EXECUTE` para `p1` pode invocá-lo com uma declaração `CALL`. No entanto, quando `p1` é executado, ele é executado no contexto de segurança definido e, portanto, é executado com os privilégios de `'admin'@'localhost'`, a conta denominada como seu atributo `DEFINER`. Esta conta deve ter o privilégio `EXECUTE` para `p1` e também o privilégio `UPDATE` para a tabela `t1` referenciada no corpo do objeto. Caso contrário, o procedimento falha.

Agora, considere este procedimento armazenado, que é idêntico ao `p1`, exceto que sua característica `SQL SECURITY` é `INVOKER`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE p2()
SQL SECURITY INVOKER
BEGIN
  UPDATE t1 SET counter = counter + 1;
END;
```

Ao contrário de `p1`, `p2` é executado no contexto de invocante e, portanto, com os privilégios do usuário que o invoca, independentemente do valor do atributo `DEFINER`. `p2` falha se o invocante não tiver o privilégio `EXECUTE` para `p2` ou o privilégio `UPDATE` para a tabela `t1`.

### Objetos Armazenados de Orfanato

Um objeto de objeto órfão é aquele para o qual o atributo `DEFINER` nomeia uma conta inexistente:

* Um objeto de objeto armazenado pode ser criado especificando uma conta `DEFINER` inexistente no momento da criação do objeto.

* Um objeto armazenado existente pode se tornar órfão devido à execução de uma declaração `DROP USER` que elimina a conta do objeto `DEFINER`, ou uma declaração `RENAME USER` que renomeia a conta do objeto `DEFINER`.

Um objeto armazenado de órfão pode ser problemático das seguintes maneiras:

* Como a conta `DEFINER` não existe, o objeto pode não funcionar conforme o esperado se for executado em um contexto de segurança definido:

+ Para uma rotina armazenada, ocorre um erro no momento da execução da rotina se o valor `SQL SECURITY` for `DEFINER`, mas a conta do definidor não existir.

+ Para um gatilho, não é uma boa ideia que a ativação do gatilho ocorra até que a conta realmente exista. Caso contrário, o comportamento em relação ao controle de privilégios é indefinido.

+ Para um evento, ocorre um erro no momento da execução do evento se a conta não existir.

+ Para uma visão, ocorre um erro quando a visão é referenciada se o valor `SQL SECURITY` for `DEFINER`, mas a conta do definidor não existir.

* O objeto pode apresentar um risco de segurança se a conta inexistente `DEFINER` for posteriormente recriada para um propósito não relacionado ao objeto. Nesse caso, a conta "adquire" o objeto e, com os privilégios apropriados, é capaz de executá-lo, mesmo que isso não seja o que se pretende.

Para obter informações sobre as contas usadas como definidores de objeto armazenado em uma instalação do MySQL, consulte o `INFORMATION_SCHEMA`.

Essa consulta identifica quais tabelas `INFORMATION_SCHEMA` descrevem objetos que possuem um atributo `DEFINER`:

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

O resultado indica quais tabelas consultar para descobrir quais valores do objeto armazenado `DEFINER` existem e quais objetos têm um valor particular do `DEFINER`:

* Para identificar quais valores de `DEFINER` existem em cada tabela, use essas consultas:

  ```sql
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.EVENTS;
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.ROUTINES;
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.TRIGGERS;
  SELECT DISTINCT DEFINER FROM INFORMATION_SCHEMA.VIEWS;
  ```

Os resultados da consulta são significativos para qualquer conta exibida da seguinte forma:

+ Se a conta existir, a eliminação ou renomeação dela faz com que os objetos armazenados se tornem órfãos. Se você planeja eliminar ou renomear a conta, considere primeiro eliminar seus objetos armazenados associados ou redefiní-los para ter um definidor diferente.

+ Se a conta não existir, criá-la fará com que ela adote objetos armazenados atualmente órfãos. Se você planeja criar a conta, considere se os objetos órfãos devem ser associados a ela. Se não, redefina-os para terem um definidor diferente.

Para redefinir um objeto com um definidor diferente, você pode usar `ALTER EVENT` ou `ALTER VIEW` para modificar diretamente a conta de eventos e visualizações `DEFINER`. Para procedimentos e funções armazenadas e para gatilhos, você deve descartar o objeto e recriá-lo com uma conta diferente `DEFINER`.

* Para identificar quais objetos têm uma conta específica `DEFINER`, use essas consultas, substituindo a conta de interesse por `user_name@host_name`:

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

Para a tabela `ROUTINES`, a consulta inclui a coluna `ROUTINE_TYPE` para que as linhas de saída distingam se o `DEFINER` é para um procedimento armazenado ou uma função armazenada.

Se a conta que você está procurando não existir, quaisquer objetos exibidos por essas consultas são objetos órfãos.

### Diretrizes de Minimização de Risco

Para minimizar o risco potencial de criação e uso de objetos armazenados, siga estas diretrizes:

* Não crie objetos armazenados órfãos; ou seja, objetos para os quais o atributo `DEFINER` nomeia uma conta inexistente. Não faça com que os objetos armazenados se tornem órfãos, descartando ou renomeando uma conta nomeada pelo atributo `DEFINER` de qualquer objeto existente.

* Para uma rotina ou visualização armazenada, use `SQL SECURITY INVOKER` na definição do objeto, quando possível, para que ela possa ser usada apenas por usuários com permissões apropriadas para as operações realizadas pelo objeto.

* Se você criar objetos armazenados com definer-context ao usar uma conta que tenha o privilégio `SUPER`, especifique um atributo explícito `DEFINER` que nomeie uma conta que possua apenas os privilégios necessários para as operações realizadas pelo objeto. Especifique uma conta altamente privilegiada `DEFINER` apenas quando absolutamente necessário.

* Os administradores podem impedir que os usuários criem objetos armazenados que especifiquem contas altamente privilegiadas `DEFINER`, não concedendo-lhes o privilégio `SUPER`.

* Os objetos de definição de contexto devem ser escritos, considerando que eles podem ter acesso a dados para os quais o usuário que os invoca não tem privilégios. Em alguns casos, você pode impedir referências a esses objetos ao não conceder privilégios específicos a usuários não autorizados:

+ Uma rotina armazenada não pode ser referenciada por um usuário que não possui o privilégio `EXECUTE` para ela.

+ Uma visão não pode ser referenciada por um usuário que não tenha o privilégio apropriado para selecioná-la, `SELECT` para selecionar dela, `INSERT` para inserir nela, e assim por diante).

No entanto, não existe nenhum controle para gatilhos e eventos, pois eles sempre são executados no contexto definido. O servidor invoca esses objetos automaticamente conforme necessário, e os usuários não os referenciam diretamente:

+ Um gatilho é ativado pelo acesso à tabela com a qual está associado, mesmo acessos comuns de tabela por usuários sem privilégios especiais.

+ Um evento é executado pelo servidor de forma programada.

Em ambos os casos, se a conta `DEFINER` for altamente privilegiada, o objeto pode ser capaz de realizar operações sensíveis ou perigosas. Isso permanece verdadeiro se os privilégios necessários para criar o objeto forem revogados da conta do usuário que o criou. Os administradores devem ter especial cuidado ao conceder privilégios de criação de objetos aos usuários.