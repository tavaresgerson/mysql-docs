#### 15.7.1.9 Declaração de definir o papel padrão

```
SET DEFAULT ROLE
    {NONE | ALL | role [, role ] ...}
    TO user [, user ] ...
```

Para cada `user` nomeado imediatamente após a palavra-chave `TO`, esta declaração define quais papéis se tornam ativos quando o usuário se conecta ao servidor e se autentica, ou quando o usuário executa a declaração `SET ROLE DEFAULT` durante uma sessão.

`SET DEFAULT ROLE` é uma sintaxe alternativa para `ALTER USER ... DEFAULT ROLE` (consulte a Seção 15.7.1.1, “Instrução ALTER USER”). No entanto, `ALTER USER` pode definir o padrão apenas para um único usuário, enquanto `SET DEFAULT ROLE` pode definir o padrão para vários usuários. Por outro lado, você pode especificar `CURRENT_USER` como o nome do usuário para a instrução `ALTER USER`, enquanto não é possível para `SET DEFAULT ROLE`.

`SET DEFAULT ROLE` exige esses privilégios:

- Para definir os papéis padrão para outro usuário, é necessário o privilégio global `CREATE USER` ou o privilégio `UPDATE` para a tabela de sistema `mysql.default_roles`.

- Definir os papéis padrão para você não requer privilégios especiais, desde que os papéis que você deseja como padrão tenham sido concedidos a você.

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
SET DEFAULT ROLE 'admin', 'developer' TO 'joe'@'10.0.0.1';
```

A parte do nome do host do nome do papel, se omitida, tem como padrão `'%'`.

A cláusula que segue as palavras-chave `DEFAULT ROLE` permite esses valores:

- `NONE`: Defina o padrão para `NONE` (sem papéis).

- `ALL`: Defina o padrão para todas as funções concedidas à conta.

- `role [, role ] ...`: Defina o padrão para os papéis nomeados, que devem existir e estar concedidos à conta no momento em que o `SET DEFAULT ROLE` é executado.

Nota

`SET DEFAULT ROLE` e `SET ROLE DEFAULT` são declarações diferentes:

- `SET DEFAULT ROLE` define quais papéis de conta devem ser ativados por padrão nas sessões da conta.

- `SET ROLE DEFAULT` define os papéis ativos dentro da sessão atual para os papéis padrão da conta atual.

Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando papéis”.
