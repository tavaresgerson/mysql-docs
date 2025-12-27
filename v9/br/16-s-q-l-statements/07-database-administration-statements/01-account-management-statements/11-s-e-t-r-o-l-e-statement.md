#### 15.7.1.11 Declaração de DEFINIR ROLHO

```
SET ROLE {
    DEFAULT
  | NONE
  | ALL
  | ALL EXCEPT role [, role ] ...
  | role [, role ] ...
}
```

`SET ROLE` modifica os privilégios efetivos do usuário atual dentro da sessão atual, especificando quais de seus papéis concedidos estão ativos. Os papéis concedidos incluem aqueles concedidos explicitamente ao usuário e aqueles nomeados no valor da variável de sistema `mandatory_roles`.

Exemplos:

```
SET ROLE DEFAULT;
SET ROLE 'role1', 'role2';
SET ROLE ALL;
SET ROLE ALL EXCEPT 'role1', 'role2';
```

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papéis”. A parte do nome de papel que contém o nome do host, se omitida, tem como padrão `'%'`.

Os privilégios que o usuário foi concedido diretamente (em vez de por meio de papéis) permanecem não afetados por alterações nos papéis ativos.

A declaração permite esses especifadores de papel:

* `DEFAULT`: Ativa os papéis padrão da conta. Os papéis padrão são aqueles especificados com `SET DEFAULT ROLE`.

  Quando um usuário se conecta ao servidor e autentica-se com sucesso, o servidor determina quais papéis ativar como os papéis padrão. Se a variável de sistema `activate_all_roles_on_login` estiver habilitada, o servidor ativa todos os papéis concedidos. Caso contrário, o servidor executa `SET ROLE DEFAULT` implicitamente. O servidor ativa apenas os papéis padrão que podem ser ativados. O servidor escreve avisos em seu log de erro para papéis padrão que não podem ser ativados, mas o cliente não recebe avisos.

  Se um usuário executar `SET ROLE DEFAULT` durante uma sessão, ocorre um erro se qualquer papel padrão não puder ser ativado (por exemplo, se não existir ou não estiver concedido ao usuário). Nesse caso, os papéis ativos atuais não são alterados.

* `NONE`: Defina os papéis ativos para `NONE` (sem papéis ativos).

* `ALL`: Ative todos os papéis concedidos à conta.

* `ALL EXCEPT role [, role ] ...`: Ative todos os papéis concedidos à conta, exceto aqueles nomeados. Os papéis nomeados não precisam existir ou estar concedidos à conta.

* `role [, role ] ...`: Ative os papéis nomeados, que devem ser concedidos à conta.

Observação

`SET DEFAULT ROLE` e `SET ROLE DEFAULT` são instruções diferentes:

* `SET DEFAULT ROLE` define quais papéis de conta devem ser ativados por padrão nas sessões da conta.

* `SET ROLE DEFAULT` define os papéis ativos na sessão atual como os papéis padrão da conta atual.

Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando Papéis”.