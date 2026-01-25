### 23.2.2 Stored Routines e Privilégios do MySQL

O sistema de concessão (grant system) do MySQL considera as Stored Routines da seguinte forma:

* O `CREATE ROUTINE` privilege é necessário para criar Stored Routines.

* O `ALTER ROUTINE` privilege é necessário para alterar ou remover (drop) Stored Routines. Este privilégio é concedido automaticamente ao criador de uma routine, se necessário, e removido do criador quando a routine é removida (dropped).

* O `EXECUTE` privilege é exigido para executar Stored Routines. No entanto, este privilégio é concedido automaticamente ao criador de uma routine, se necessário (e removido do criador quando a routine é removida). Além disso, a característica padrão de `SQL SECURITY` para uma routine é `DEFINER`, o que permite que usuários que têm acesso ao Database ao qual a routine está associada a executem.

* Se a system variable `automatic_sp_privileges` for 0, os privilégios `EXECUTE` e `ALTER ROUTINE` não são concedidos e removidos automaticamente do criador da routine.

* O criador de uma routine é a account usada para executar o `CREATE` statement para ela. Isso pode não ser o mesmo que a account nomeada como o `DEFINER` na definição da routine.

O servidor manipula a tabela `mysql.proc` em resposta aos statements que criam, alteram ou removem (drop) Stored Routines. A manipulação manual desta tabela não é suportada.