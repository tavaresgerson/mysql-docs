### 27.2.2 Rotinas Armazenadas e Privilégios do MySQL

O sistema de concessão do MySQL leva em consideração as rotinas armazenadas da seguinte forma:

- O privilégio `CREATE ROUTINE` é necessário para criar rotinas armazenadas.

- O privilégio `ALTER ROUTINE` é necessário para alterar ou descartar rotinas armazenadas. Este privilégio é concedido automaticamente ao criador de uma rotina, se necessário, e descartado do criador quando a rotina é descartada.

- O privilégio `EXECUTE` é necessário para executar rotinas armazenadas. No entanto, este privilégio é concedido automaticamente ao criador de uma rotina, se necessário (e é removido do criador quando a rotina é removida). Além disso, a característica padrão `SQL SECURITY` para uma rotina é `DEFINER`, que permite que os usuários que têm acesso ao banco de dados com o qual a rotina está associada executem a rotina.

- Se a variável de sistema `automatic_sp_privileges` for 0, os privilégios `EXECUTE` e `ALTER ROUTINE` não serão automaticamente concedidos ao criador da rotina e removidos dele.

- O criador de uma rotina é a conta usada para executar a instrução `CREATE`. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

- A conta nomeada como rotina `DEFINER` pode ver todas as propriedades de rotina, incluindo sua definição. Assim, a conta tem acesso total à saída da rotina conforme produzida por:

  - O conteúdo da tabela do esquema de informações `ROUTINES`.

  - As declarações `SHOW CREATE FUNCTION` e `SHOW CREATE PROCEDURE`.

  - As declarações `SHOW FUNCTION CODE` e `SHOW PROCEDURE CODE`.

  - As declarações `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`.

- Para uma conta diferente da conta nomeada como a rotina `DEFINER`, o acesso às propriedades da rotina depende dos privilégios concedidos à conta:

  - Com o privilégio `SHOW_ROUTINE` ou o privilégio global `SELECT`, a conta pode ver todas as propriedades rotineiras, incluindo sua definição.

  - Com o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclui a rotina, a conta pode ver todas as propriedades da rotina, exceto sua definição.
