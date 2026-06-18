#### 15.7.1.11 Declaração de definição de função

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

Cada nome de função usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Função”. A parte do nome de função que contém o nome do host, se omitida, tem como padrão `'%'`.

Os privilégios que o usuário recebeu diretamente (em vez de através de papéis) permanecem inalterados pelas alterações nos papéis ativos.

A declaração permite esses especizadores de papel:

- `DEFAULT`: Ative os papéis padrão da conta. Os papéis padrão são aqueles especificados com `SET DEFAULT ROLE`.

  Quando um usuário se conecta ao servidor e autentica-se com sucesso, o servidor determina quais papéis devem ser ativados como papéis padrão. Se a variável de sistema `activate_all_roles_on_login` estiver habilitada, o servidor ativa todos os papéis concedidos. Caso contrário, o servidor executa implicitamente `SET ROLE DEFAULT`. O servidor ativa apenas os papéis padrão que podem ser ativados. O servidor escreve avisos em seu log de erro para papéis padrão que não podem ser ativados, mas o cliente não recebe avisos.

  Se um usuário executar `SET ROLE DEFAULT` durante uma sessão, ocorrerá um erro se nenhuma função padrão puder ser ativada (por exemplo, se não existir ou não ser concedida ao usuário). Nesse caso, os papéis ativos atuais não serão alterados.

- `NONE`: Defina as funções ativas para `NONE` (sem funções ativas).

- `ALL`: Ative todos os papéis concedidos à conta.

- `ALL EXCEPT role [, role ] ...`: Ative todos os papéis concedidos à conta, exceto os nomeados. Os papéis nomeados não precisam existir ou serem concedidos à conta.

- `role [, role ] ...`: Ative os papéis nomeados, que devem ser concedidos à conta.

Nota

`SET DEFAULT ROLE` e `SET ROLE DEFAULT` são declarações diferentes:

- `SET DEFAULT ROLE` define quais papéis de conta devem ser ativados por padrão nas sessões da conta.

- `SET ROLE DEFAULT` define os papéis ativos dentro da sessão atual para os papéis padrão da conta atual.

Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando papéis”.
