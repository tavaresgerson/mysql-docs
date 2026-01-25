## 6.2 Controle de Acesso e Gerenciamento de Contas

[6.2.1 Nomes de Usuários de Contas e Senhas](user-names.html)

[6.2.2 Privilégios Fornecidos pelo MySQL](privileges-provided.html)

[6.2.3 Grant Tables](grant-tables.html)

[6.2.4 Especificando Nomes de Contas](account-names.html)

[6.2.5 Controle de Acesso, Estágio 1: Verificação de Conexão](connection-access.html)

[6.2.6 Controle de Acesso, Estágio 2: Verificação de Solicitação](request-access.html)

[6.2.7 Adicionando Contas, Atribuindo Privilégios e Removendo Contas](creating-accounts.html)

[6.2.8 Contas Reservadas](reserved-accounts.html)

[6.2.9 Quando as Alterações de Privilégio Entram em Vigor](privilege-changes.html)

[6.2.10 Atribuindo Senhas de Contas](assigning-passwords.html)

[6.2.11 Gerenciamento de Senhas](password-management.html)

[6.2.12 Tratamento de Senhas Expiradas pelo Servidor](expired-password-handling.html)

[6.2.13 Autenticação Pluggable](pluggable-authentication.html)

[6.2.14 Usuários Proxy](proxy-users.html)

[6.2.15 Bloqueio de Contas](account-locking.html)

[6.2.16 Definindo Limites de Recursos de Conta](user-resources.html)

[6.2.17 Solução de Problemas de Conexão ao MySQL](problems-connecting.html)

[6.2.18 Auditoria de Atividade de Conta Baseada em SQL](account-activity-auditing.html)

O MySQL permite a criação de contas que autorizam usuários cliente a se conectar ao servidor e acessar dados gerenciados por ele. A função principal do sistema de privilégios do MySQL é autenticar um usuário que se conecta a partir de um determinado host e associar esse usuário a privilégios em um Database, como [`SELECT`](select.html "13.2.9 SELECT Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement"). Funcionalidades adicionais incluem a capacidade de conceder privilégios para operações administrativas.

Para controlar quais usuários podem se conectar, cada conta pode receber credenciais de autenticação, como uma senha. A interface de usuário para contas MySQL consiste em instruções SQL como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"). Consulte a [Seção 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements").

O sistema de privilégios do MySQL garante que todos os usuários possam realizar apenas as operações permitidas a eles. Como usuário, ao se conectar a um servidor MySQL, sua identidade é determinada pelo *host do qual você se conecta* e pelo *nome de usuário que você especifica*. Ao emitir solicitações após a conexão, o sistema concede privilégios de acordo com sua identidade e *o que você deseja fazer*.

O MySQL considera tanto o seu host name quanto o nome de usuário ao identificá-lo porque não há razão para presumir que um determinado nome de usuário pertença à mesma pessoa em todos os hosts. Por exemplo, o usuário `joe` que se conecta a partir de `office.example.com` não precisa ser a mesma pessoa que o usuário `joe` que se conecta a partir de `home.example.com`. O MySQL lida com isso permitindo que você distinga usuários em diferentes hosts que por acaso têm o mesmo nome: Você pode conceder um conjunto de privilégios para conexões de `joe` a partir de `office.example.com` e um conjunto diferente de privilégios para conexões de `joe` a partir de `home.example.com`. Para ver quais privilégios uma determinada conta possui, use a instrução [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"). Por exemplo:

```sql
SHOW GRANTS FOR 'joe'@'office.example.com';
SHOW GRANTS FOR 'joe'@'home.example.com';
```

Internamente, o servidor armazena informações de privilégio nas *grant tables* do `mysql` system database. O servidor MySQL lê o conteúdo dessas tabelas para a memória quando inicia e baseia as decisões de controle de acesso nas cópias das *grant tables* que estão na memória.

O controle de acesso do MySQL envolve dois estágios ao executar um programa cliente que se conecta ao servidor:

**Estágio 1:** O servidor aceita ou rejeita a conexão com base em sua identidade e se você pode verificar sua identidade fornecendo a senha correta.

**Estágio 2:** Assumindo que você pode se conectar, o servidor verifica cada instrução que você emite para determinar se você tem privilégios suficientes para executá-la. Por exemplo, se você tentar selecionar linhas de uma tabela em um Database ou remover (drop) uma tabela do Database, o servidor verifica se você tem o privilégio [`SELECT`](privileges-provided.html#priv_select) para a tabela ou o privilégio [`DROP`](privileges-provided.html#priv_drop) para o Database.

Para uma descrição mais detalhada do que acontece durante cada estágio, consulte a [Seção 6.2.5, “Access Control, Stage 1: Connection Verification”](connection-access.html "6.2.5 Access Control, Stage 1: Connection Verification") e a [Seção 6.2.6, “Access Control, Stage 2: Request Verification”](request-access.html "6.2.6 Access Control, Stage 2: Request Verification"). Para obter ajuda no diagnóstico de problemas relacionados a privilégios, consulte a [Seção 6.2.17, “Troubleshooting Problems Connecting to MySQL”](problems-connecting.html "6.2.17 Troubleshooting Problems Connecting to MySQL").

Se seus privilégios forem alterados (seja por você ou por outra pessoa) enquanto você estiver conectado, essas alterações não entrarão necessariamente em vigor imediatamente para a próxima instrução que você emitir. Para obter detalhes sobre as condições sob as quais o servidor recarrega as *grant tables*, consulte a [Seção 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").

Existem algumas coisas que você não pode fazer com o sistema de privilégios do MySQL:

* Você não pode especificar explicitamente que o acesso a um determinado usuário deve ser negado. Ou seja, você não pode corresponder explicitamente um usuário e, em seguida, recusar a conexão.

* Você não pode especificar que um usuário tem privilégios para criar ou remover (drop) tabelas em um Database, mas não para criar ou remover o Database em si.

* Uma senha se aplica globalmente a uma conta. Você não pode associar uma senha a um objeto específico, como um Database, tabela ou rotina.