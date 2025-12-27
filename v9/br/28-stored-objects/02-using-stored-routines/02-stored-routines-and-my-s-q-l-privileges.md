### 27.2.2 Rotinas Armazenadas e Privilégios MySQL

O sistema de concessão de privilégios MySQL leva em consideração as rotinas armazenadas da seguinte forma:

* O privilégio `CREATE ROUTINE` é necessário para criar rotinas armazenadas.

* O privilégio `ALTER ROUTINE` é necessário para alterar ou excluir rotinas armazenadas. Este privilégio é concedido automaticamente ao criador da rotina, se necessário, e excluído do criador quando a rotina é excluída.

* O privilégio `EXECUTE` é necessário para executar rotinas armazenadas. No entanto, este privilégio é concedido automaticamente ao criador da rotina, se necessário (e excluído do criador quando a rotina é excluída). Além disso, a característica `SQL SECURITY` padrão para uma rotina é `DEFINER`, que permite que os usuários que têm acesso ao banco de dados com o qual a rotina está associada executem a rotina.

* Se a variável de sistema `automatic_sp_privileges` for 0, os privilégios `EXECUTE` e `ALTER ROUTINE` não são concedidos automaticamente ao criador da rotina e excluídos dele.

* O criador de uma rotina é a conta usada para executar a declaração `CREATE` para ela. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

* A conta nomeada como `DEFINER` de uma rotina pode ver todas as propriedades da rotina, incluindo sua definição. A conta, portanto, tem acesso total ao resultado da rotina, conforme produzido por:

  + O conteúdo da tabela do Schema de Informações `ROUTINES`.

  + As declarações `SHOW CREATE FUNCTION` e `SHOW CREATE PROCEDURE`.

  + As declarações `SHOW FUNCTION CODE` e `SHOW PROCEDURE CODE`.

  + As declarações `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`.

* Para uma conta diferente da conta nomeada como `DEFINER` da rotina, o acesso às propriedades da rotina depende dos privilégios concedidos à conta:

+ Com o privilégio `SHOW_ROUTINE` ou o privilégio global `SELECT`, a conta pode ver todas as propriedades da rotina, incluindo sua definição.

+ Com o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclui a rotina, a conta pode ver todas as propriedades da rotina, exceto sua definição.