### 8.2.11 Categorias de Conta

O MySQL incorpora o conceito de categorias de contas de usuário, com base no privilégio `SYSTEM_USER`.

* Contas de Sistema e Contas Regulares
* Operações Afetadas pelo Privilégio SYSTEM_USER
* Sessões de Sistema e Sessões Regulares
* Protegendo Contas de Sistema Contra Manipulação por Contas Regulares

#### Contas de Sistema e Contas Regulares

O MySQL incorpora o conceito de categorias de contas de usuário, com usuários de sistema e usuários regulares distinguidos de acordo com a presença do privilégio `SYSTEM_USER`:

* Um usuário com o privilégio `SYSTEM_USER` é um usuário de sistema.

* Um usuário sem o privilégio `SYSTEM_USER` é um usuário regular.

O privilégio `SYSTEM_USER` tem um efeito nas contas às quais um determinado usuário pode aplicar seus outros privilégios, bem como se o usuário está protegido contra outras contas:

* Um usuário de sistema pode modificar tanto contas de sistema quanto contas regulares. Isso significa que um usuário que tem os privilégios apropriados para realizar uma determinada operação em contas regulares é habilitado pela posse do `SYSTEM_USER` para realizar a operação também em contas de sistema. Uma conta de sistema só pode ser modificada por usuários de sistema com privilégios apropriados, não por usuários regulares.

* Um usuário regular com privilégios apropriados pode modificar contas regulares, mas não contas de sistema. Uma conta regular pode ser modificada por usuários de sistema e usuários regulares com privilégios apropriados.

Se um usuário tiver os privilégios apropriados para realizar uma operação específica em contas regulares, o `SYSTEM_USER` permite que o usuário também realize a operação em contas de sistema. O `SYSTEM_USER` não implica em nenhum outro privilégio, portanto, a capacidade de realizar uma operação em uma conta específica permanece condicionada à posse de quaisquer outros privilégios necessários. Por exemplo, se um usuário pode conceder os privilégios `SELECT` e `UPDATE` a contas regulares, então, com `SYSTEM_USER`, o usuário também pode conceder `SELECT` e `UPDATE` a contas de sistema.

A distinção entre contas de sistema e contas regulares permite um melhor controle sobre certas questões de administração de contas, protegendo contas que possuem o privilégio `SYSTEM_USER` de contas que não possuem o privilégio. Por exemplo, o privilégio `CREATE USER` permite não apenas a criação de novas contas, mas também a modificação e remoção de contas existentes. Sem o conceito de usuário de sistema, um usuário que possui o privilégio `CREATE USER` pode modificar ou excluir qualquer conta existente, incluindo a conta `root`. O conceito de usuário de sistema permite restringir as modificações à conta `root` (que é uma conta de sistema) para que elas possam ser feitas apenas por usuários de sistema. Usuários regulares com o privilégio `CREATE USER` ainda podem modificar ou excluir contas existentes, mas apenas contas regulares.

#### Operações Afetadas pelo Privilégio SYSTEM_USER

O privilégio `SYSTEM_USER` afeta essas operações:

* Manipulação de contas.

A manipulação de contas inclui a criação e exclusão de contas, a concessão e revogação de privilégios, a alteração de características de autenticação de contas, como credenciais ou plugin de autenticação, e a alteração de outras características de contas, como a política de expiração da senha.

O privilégio `SYSTEM_USER` é necessário para manipular contas do sistema usando declarações de gerenciamento de contas, como `CREATE USER` e `GRANT`. Para impedir que uma conta modifique contas do sistema dessa maneira, torne-a uma conta regular, não concedendo-lhe o privilégio `SYSTEM_USER`. (No entanto, para proteger completamente as contas do sistema contra contas regulares, você também deve reter os privilégios de modificação para o esquema de sistema `mysql` de contas regulares. Veja Proteger Contas do Sistema Contra Manipulação por Contas Regulares.)

* Matar sessões atuais e declarações que estejam sendo executadas dentro delas.

  Para matar uma sessão ou declaração que esteja sendo executada com o privilégio `SYSTEM_USER`, sua própria sessão deve ter o privilégio `SYSTEM_USER`, além de qualquer outro privilégio necessário (`CONNECTION_ADMIN` ou o privilégio obsoleto `SUPER`).

  Se o usuário que coloca um servidor em modo offline não tiver o privilégio `SYSTEM_USER`, os usuários de clientes conectados que têm o privilégio `SYSTEM_USER` também não são desconectados. No entanto, esses usuários não podem iniciar novas conexões ao servidor enquanto ele estiver em modo offline, a menos que também tenham o privilégio `CONNECTION_ADMIN` ou `SUPER`. É apenas sua conexão existente que não é encerrada, porque o privilégio `SYSTEM_USER` é necessário para isso.

* Definir o atributo `DEFINER` para objetos armazenados.

  Para definir o atributo `DEFINER` para um objeto armazenado em uma conta que tenha o privilégio `SYSTEM_USER`, você deve ter o privilégio `SYSTEM_USER`, além de qualquer outro privilégio necessário.

* Especificar papéis obrigatórios.

  Um papel que tenha o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`.

* Sobrar o item "abort" no filtro de log de auditoria do MySQL Enterprise Audit.

As contas com o privilégio `SYSTEM_USER` são automaticamente atribuídas o privilégio `AUDIT_ABORT_EXEMPT`, para que as consultas da conta sejam sempre executadas, mesmo que um item de "abort" no filtro do log de auditoria o bloqueie. Portanto, as contas com o privilégio `SYSTEM_USER` podem ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria. Veja a Seção 8.4.6, “Auditoria do MySQL Enterprise”.

#### Sessões de Sistema e Sessões Regulares

As sessões que executam dentro do servidor são distinguidas como sessões de sistema ou regulares, de forma semelhante à distinção entre usuários de sistema e regulares:

* Uma sessão que possui o privilégio `SYSTEM_USER` é uma sessão de sistema.

* Uma sessão que não possui o privilégio `SYSTEM_USER` é uma sessão regular.

Uma sessão regular é capaz de realizar apenas operações permitidas para usuários regulares. Uma sessão de sistema é, adicionalmente, capaz de realizar operações permitidas apenas para usuários de sistema.

Os privilégios possuídos por uma sessão são aqueles concedidos diretamente à sua conta subjacente, mais aqueles concedidos a todos os papéis atualmente ativos dentro da sessão. Assim, uma sessão pode ser uma sessão de sistema porque sua conta foi concedida o privilégio `SYSTEM_USER` diretamente, ou porque a sessão ativou um papel que possui o privilégio `SYSTEM_USER`. Papéis concedidos a uma conta que não estão ativos dentro da sessão não afetam os privilégios da sessão.

Como a ativação e desativação de papéis podem mudar os privilégios possuídos pelas sessões, uma sessão pode mudar de uma sessão regular para uma sessão de sistema ou vice-versa. Se uma sessão ativa ou desativa um papel que possui o privilégio `SYSTEM_USER`, a mudança apropriada entre sessão regular e de sistema ocorre imediatamente, apenas para aquela sessão:

* Se uma sessão regular ativar um papel com o privilégio `SYSTEM_USER`, a sessão se torna uma sessão de sistema.

* Se uma sessão de sistema desativar um papel com o privilégio `SYSTEM_USER`, a sessão se torna uma sessão regular, a menos que algum outro papel com o privilégio `SYSTEM_USER` permaneça ativo.

Essas operações não têm efeito em sessões existentes:

* Se o privilégio `SYSTEM_USER` for concedido ou revogado de uma conta, as sessões existentes para a conta não mudam entre sessões regulares e de sistema. A operação de concessão ou revogação afeta apenas as sessões para conexões subsequentes pela conta.

* Declarações executadas por um objeto armazenado invocado dentro de uma sessão são executadas com o status de sistema ou regular da sessão pai, mesmo que o atributo `DEFINER` do objeto nomeie uma conta de sistema.

Como a ativação de papel afeta apenas sessões e não contas, conceder um papel que tenha o privilégio `SYSTEM_USER` a uma conta regular não protege essa conta contra usuários regulares. O papel protege apenas as sessões para a conta na qual o papel foi ativado e protege a sessão apenas contra ser eliminada por sessões regulares.

#### Protegendo Contas de Sistema Contra Manipulação por Contas Regulares

A manipulação de contas inclui a criação e eliminação de contas, a concessão e revogação de privilégios, a alteração de características de autenticação de conta, como credenciais ou plugin de autenticação, e a alteração de outras características da conta, como a política de expiração da senha.

A manipulação de contas pode ser feita de duas maneiras:

* Usando declarações de gerenciamento de contas, como `CREATE USER` e `GRANT`. Esse é o método preferido.

* Por meio da modificação direta das tabelas de concessão usando instruções como `INSERT` e `UPDATE`. Esse método é desaconselhado, mas possível para usuários com os privilégios apropriados no esquema do sistema `mysql` que contém as tabelas de concessão.

Para proteger completamente as contas do sistema contra modificações por uma conta específica, torne-a uma conta regular e não conceda-lhe privilégios de modificação para o esquema `mysql`:

* O privilégio `SYSTEM_USER` é necessário para manipular contas do sistema usando instruções de gerenciamento de contas. Para impedir que uma conta modifique contas do sistema dessa maneira, torne-a uma conta regular não concedendo `SYSTEM_USER` a ela. Isso inclui não conceder `SYSTEM_USER` a quaisquer papéis concedidos à conta.

* Os privilégios para o esquema `mysql` permitem a manipulação de contas do sistema por meio da modificação direta das tabelas de concessão, mesmo que a conta que está modificando seja uma conta regular. Para restringir a modificação direta não autorizada de contas do sistema por uma conta regular, não conceda privilégios de modificação para o esquema `mysql` à conta (ou a quaisquer papéis concedidos à conta). Se uma conta regular deve ter privilégios globais que se aplicam a todos os esquemas, as modificações no esquema `mysql` podem ser impedidas usando restrições de privilégio impostas por meio de revogações parciais. Veja a Seção 8.2.12, “Restrição de privilégio usando revogações parciais”.

Observação

Ao contrário de reter o privilégio `SYSTEM_USER`, que impede uma conta de modificar contas do sistema, mas não contas regulares, reter os privilégios do esquema `mysql` impede que uma conta modifique contas do sistema, bem como contas regulares. Isso não deve ser um problema, pois, como mencionado, a modificação direta das tabelas de concessão é desaconselhada.

Suponha que você queira criar um usuário `u1` que tenha todos os privilégios em todos os esquemas, exceto que `u1` deve ser um usuário comum sem a capacidade de modificar contas do sistema. Supondo que a variável de sistema `partial_revokes` esteja habilitada, configure `u1` da seguinte forma:

```
CREATE USER u1 IDENTIFIED BY 'password';

GRANT ALL ON *.* TO u1 WITH GRANT OPTION;
-- GRANT ALL includes SYSTEM_USER, so at this point
-- u1 can manipulate system or regular accounts

REVOKE SYSTEM_USER ON *.* FROM u1;
-- Revoking SYSTEM_USER makes u1 a regular user;
-- now u1 can use account-management statements
-- to manipulate only regular accounts

REVOKE ALL ON mysql.* FROM u1;
-- This partial revoke prevents u1 from directly
-- modifying grant tables to manipulate accounts
```

Para impedir o acesso de uma conta ao esquema de sistema `mysql`, reforce todos os seus privilégios no esquema `mysql`, como foi mostrado acima. Também é possível permitir o acesso parcial ao esquema `mysql`, como acesso apenas de leitura. O exemplo a seguir cria uma conta que tem privilégios `SELECT`, `INSERT`, `UPDATE` e `DELETE` globalmente para todos os esquemas, mas apenas `SELECT` para o esquema `mysql`:

```
CREATE USER u2 IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u2;
REVOKE INSERT, UPDATE, DELETE ON mysql.* FROM u2;
```

Outra possibilidade é redefinir todos os privilégios do esquema `mysql`, mas conceder acesso a tabelas ou colunas específicas do `mysql`. Isso pode ser feito mesmo com uma redefinição parcial do `mysql`. As seguintes instruções habilitam o acesso apenas de leitura para `u1` dentro do esquema `mysql`, mas apenas para a tabela `db` e as colunas `Host` e `User` da tabela `user`:

```
CREATE USER u3 IDENTIFIED BY 'password';
GRANT ALL ON *.* TO u3;
REVOKE ALL ON mysql.* FROM u3;
GRANT SELECT ON mysql.db TO u3;
GRANT SELECT(Host,User) ON mysql.user TO u3;
```