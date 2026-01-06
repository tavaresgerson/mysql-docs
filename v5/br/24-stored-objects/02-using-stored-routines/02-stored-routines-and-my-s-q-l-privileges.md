### 23.2.2 Rotinas Armazenadas e Privilégios do MySQL

O sistema de concessão do MySQL leva em consideração as rotinas armazenadas da seguinte forma:

- O privilégio `CREATE ROUTINE` é necessário para criar rotinas armazenadas.

- O privilégio `ALTER ROUTINE` é necessário para alterar ou descartar rotinas armazenadas. Este privilégio é concedido automaticamente ao criador de uma rotina, se necessário, e descartado do criador quando a rotina é descartada.

- O privilégio `EXECUTE` é necessário para executar rotinas armazenadas. No entanto, este privilégio é concedido automaticamente ao criador de uma rotina, se necessário (e é removido do criador quando a rotina é removida). Além disso, a característica `SQL SECURITY` padrão para uma rotina é `DEFINER`, que permite que os usuários que têm acesso ao banco de dados com o qual a rotina está associada executem a rotina.

- Se a variável de sistema `automatic_sp_privileges` for 0, os privilégios `EXECUTE` e `ALTER ROUTINE` não serão concedidos automaticamente ao criador da rotina e removidos dele.

- O criador de uma rotina é a conta usada para executar a instrução `CREATE` para ela. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

O servidor manipula a tabela `mysql.proc` em resposta a declarações que criam, alteram ou excluem rotinas armazenadas. A manipulação manual dessa tabela não é suportada.
