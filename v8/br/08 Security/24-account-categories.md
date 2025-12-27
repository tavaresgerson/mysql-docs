### 8.2.11 Categorias de Conta

O MySQL incorpora o conceito de categorias de contas de usuário, com base no privilégio `SYSTEM_USER`.

*  Contas de Sistema e Contas Regulares
*  Operações Afetadas pelo Privilégio SYSTEM_USER
*  Sessões de Sistema e Contas Regulares
*  Protegendo Contas de Sistema Contra Manipulação por Contas Regulares

#### Contas de Sistema e Contas Regulares

O MySQL incorpora o conceito de categorias de contas de usuário, com usuários de sistema e regulares distinguidos de acordo com a presença do privilégio `SYSTEM_USER`:

* Um usuário com o privilégio `SYSTEM_USER` é um usuário de sistema.
* Um usuário sem o privilégio `SYSTEM_USER` é um usuário regular.

O privilégio `SYSTEM_USER` tem um efeito nas contas às quais um determinado usuário pode aplicar seus outros privilégios, bem como se o usuário está protegido contra outras contas:

* Um usuário de sistema pode modificar tanto contas de sistema quanto contas regulares. Ou seja, um usuário que tem os privilégios apropriados para realizar uma determinada operação em contas regulares é habilitado pela posse de `SYSTEM_USER` para também realizar a operação em contas de sistema. Uma conta de sistema pode ser modificada apenas por usuários de sistema com privilégios apropriados, não por usuários regulares.
* Um usuário regular com privilégios apropriados pode modificar contas regulares, mas não contas de sistema. Uma conta regular pode ser modificada por usuários de sistema e regulares com privilégios apropriados.

Se um usuário tem os privilégios apropriados para realizar uma determinada operação em contas regulares, `SYSTEM_USER` habilita o usuário a também realizar a operação em contas de sistema. `SYSTEM_USER` não implica nenhum outro privilégio, então a capacidade de realizar uma determinada operação de conta permanece condicionada à posse de quaisquer outros privilégios necessários. Por exemplo, se um usuário pode conceder os privilégios `SELECT` e `UPDATE` a contas regulares, então com `SYSTEM_USER` o usuário também pode conceder `SELECT` e `UPDATE` a contas de sistema.

A distinção entre contas de sistema e contas regulares permite um melhor controle sobre certas questões de administração de contas, protegendo contas que possuem o privilégio `SYSTEM_USER` das contas que não possuem esse privilégio. Por exemplo, o privilégio `CREATE USER` permite não apenas a criação de novas contas, mas também a modificação e remoção de contas existentes. Sem o conceito de usuário de sistema, um usuário que possui o privilégio `CREATE USER` pode modificar ou excluir qualquer conta existente, incluindo a conta `root`. O conceito de usuário de sistema permite restringir as modificações à conta `root` (que é uma conta de sistema) para que elas possam ser feitas apenas por usuários de sistema. Usuários regulares com o privilégio `CREATE USER` ainda podem modificar ou excluir contas existentes, mas apenas contas regulares.

#### Operações Afetadas pelo Privilégio `SYSTEM_USER`

O privilégio `SYSTEM_USER` afeta essas operações:

* Manipulação de contas.

  A manipulação de contas inclui a criação e exclusão de contas, a concessão e revogação de privilégios, a alteração de características de autenticação de conta, como credenciais ou plugin de autenticação, e a alteração de outras características da conta, como a política de expiração da senha.

  O privilégio `SYSTEM_USER` é necessário para manipular contas de sistema usando declarações de gerenciamento de contas, como `CREATE USER` e `GRANT`. Para impedir que uma conta modifique contas de sistema dessa maneira, transforme-a em uma conta regular, não concedendo-lhe o privilégio `SYSTEM_USER`. (No entanto, para proteger completamente as contas de sistema contra contas regulares, você também deve reter os privilégios de modificação para o esquema de sistema `mysql` de contas regulares. Veja Proteger Contas de Sistema Contra Manipulação por Contas Regulares.)
* Apagamento de sessões atuais e declarações que estejam sendo executadas dentro delas.

Para interromper uma sessão ou declaração que esteja executando com o privilégio `SYSTEM_USER`, sua própria sessão deve possuir o privilégio `SYSTEM_USER`, além de qualquer outro privilégio necessário (prívilégio `CONNECTION_ADMIN` ou o desatualizado privilégio `SUPER`).

Se o usuário que coloca um servidor em modo offline não possuir o privilégio `SYSTEM_USER`, os usuários de clientes conectados que possuem o privilégio `SYSTEM_USER` também não serão desconectados. No entanto, esses usuários não podem iniciar novas conexões com o servidor enquanto ele estiver em modo offline, a menos que também possuam o privilégio `CONNECTION_ADMIN` ou `SUPER`. Apenas sua conexão existente não será encerrada, porque o privilégio `SYSTEM_USER` é necessário para isso.
* Definir o atributo `DEFINER` para objetos armazenados.

Para definir o atributo `DEFINER` para um objeto armazenado em uma conta que possui o privilégio `SYSTEM_USER`, você deve possuir o privilégio `SYSTEM_USER`, além de qualquer outro privilégio necessário.
* Especificar papéis obrigatórios.

Um papel que possui o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`.
* Sobrar o filtro de log de auditoria do MySQL Enterprise Audit.

Contas com o privilégio `SYSTEM_USER` são automaticamente atribuídas o privilégio `AUDIT_ABORT_EXEMPT`, para que as consultas da conta sejam sempre executadas, mesmo que um item de "abort" no filtro do log de auditoria o bloqueie. Contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria. Veja a Seção 8.4.5, "MySQL Enterprise Audit".

#### Sessões Sistema e Regulares

As sessões que executam dentro do servidor são distinguidas como sessões de sistema ou regulares, de forma semelhante à distinção entre usuários sistema e regulares:

* Uma sessão que possui o privilégio `SYSTEM_USER` é uma sessão de sistema.
* Uma sessão que não possui o privilégio `SYSTEM_USER` é uma sessão regular.

Uma sessão regular pode realizar apenas operações permitidas para usuários regulares. Uma sessão de sistema também pode realizar operações permitidas apenas para usuários de sistema.

Os privilégios possuídos por uma sessão são aqueles concedidos diretamente à sua conta subjacente, além dos concedidos a todos os papéis atualmente ativos dentro da sessão. Assim, uma sessão pode ser uma sessão de sistema porque sua conta foi concedida o privilégio `SYSTEM_USER` diretamente, ou porque a sessão ativou um papel que possui o privilégio `SYSTEM_USER`. Papéis concedidos a uma conta que não estão ativos dentro da sessão não afetam os privilégios da sessão.

Como a ativação e desativação de papéis podem alterar os privilégios possuídos pelas sessões, uma sessão pode mudar de uma sessão regular para uma sessão de sistema ou vice-versa. Se uma sessão ativa ou desativa um papel que possui o privilégio `SYSTEM_USER`, a mudança apropriada entre sessões regulares e de sistema ocorre imediatamente, apenas para aquela sessão:

* Se uma sessão regular ativa um papel com o privilégio `SYSTEM_USER`, a sessão se torna uma sessão de sistema.
* Se uma sessão de sistema desativa um papel com o privilégio `SYSTEM_USER`, a sessão se torna uma sessão regular, a menos que algum outro papel com o privilégio `SYSTEM_USER` permaneça ativo.

Essas operações não têm efeito em sessões existentes:

* Se o privilégio `SYSTEM_USER` for concedido ou revogado de uma conta, as sessões existentes para a conta não mudam entre sessões regulares e de sistema. A operação de concessão ou revogação afeta apenas as sessões para conexões subsequentes pela conta.
* As declarações executadas por um objeto armazenado invocado dentro de uma sessão são executadas com o status de sistema ou regular da sessão pai, mesmo que o atributo `DEFINER` do objeto nomeie uma conta de sistema.

Como a ativação de funções afeta apenas as sessões e não as contas, conceder um papel que tenha o privilégio `SYSTEM_USER` a uma conta comum não protege essa conta contra usuários comuns. O papel protege apenas as sessões da conta na qual o papel foi ativado e protege a sessão apenas contra ser interrompida por sessões comuns.

#### Protegendo Contas de Sistema Contra Manipulação por Contas Comuns

A manipulação de contas inclui a criação e remoção de contas, a concessão e revogação de privilégios, a alteração de características de autenticação da conta, como credenciais ou plugin de autenticação, e a alteração de outras características da conta, como a política de expiração da senha.

A manipulação de contas pode ser feita de duas maneiras:

* Usando declarações de gerenciamento de contas, como `CREATE USER` e `GRANT`. Esse é o método preferido.
* Modificando diretamente a tabela de concessão usando declarações como `INSERT` e `UPDATE`. Esse método é desencorajado, mas possível para usuários com os privilégios apropriados no esquema do sistema `mysql` que contém as tabelas de concessão.

Para proteger completamente as contas de sistema contra modificações por uma conta específica, transforme-a em uma conta comum e não conceda-lhe privilégios de modificação para o esquema `mysql`:

* O privilégio `SYSTEM_USER` é necessário para manipular contas do sistema usando declarações de gerenciamento de contas. Para impedir que uma conta modifique contas do sistema dessa maneira, torne-a uma conta regular, não concedendo `SYSTEM_USER` a ela. Isso inclui não conceder `SYSTEM_USER` a quaisquer papéis concedidos à conta.
* Os privilégios para o esquema `mysql` permitem a manipulação de contas do sistema através da modificação direta das tabelas de concessão, mesmo que a conta modificadora seja uma conta regular. Para restringir a modificação direta não autorizada de contas do sistema por uma conta regular, não conceda privilégios de modificação para o esquema `mysql` à conta (ou quaisquer papéis concedidos à conta). Se uma conta regular deve ter privilégios globais que se aplicam a todos os esquemas, as modificações do esquema `mysql` podem ser impedidas usando restrições de privilégio impostas usando revogações parciais. Veja a Seção 8.2.12, “Restrição de privilégio usando revogações parciais”.

::: info Nota

Ao contrário de reter o privilégio `SYSTEM_USER`, que impede que uma conta modifique contas do sistema, mas não contas regulares, reter os privilégios do esquema `mysql` impede que uma conta modifique contas do sistema, bem como contas regulares. Isso não deve ser um problema, pois, como mencionado, a modificação direta das tabelas de concessão é desencorajada.

:::

Suponha que você queira criar um usuário `u1` que tenha todos os privilégios em todos os esquemas, exceto que `u1` deve ser um usuário regular sem a capacidade de modificar contas do sistema. Supondo que a variável de sistema `partial_revokes` esteja habilitada, configure `u1` da seguinte forma:

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

Para impedir todo o acesso do esquema de sistema `mysql` por uma conta, reveja todos os seus privilégios no esquema `mysql`, como mostrado acima. Também é possível permitir acesso parcial ao esquema `mysql`, como acesso apenas para leitura. O exemplo seguinte cria uma conta que tem privilégios `SELECT`, `INSERT`, `UPDATE` e `DELETE` globalmente para todos os esquemas, mas apenas `SELECT` para o esquema `mysql`:

```
CREATE USER u2 IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u2;
REVOKE INSERT, UPDATE, DELETE ON mysql.* FROM u2;
```

Outra possibilidade é revogar todos os privilégios do esquema `mysql`, mas conceder acesso a tabelas ou colunas específicas do `mysql`. Isso pode ser feito mesmo com uma revogação parcial no `mysql`. As seguintes instruções permitem o acesso apenas de leitura a `u1` dentro do esquema `mysql`, mas apenas para a tabela `db` e as colunas `Host` e `User` da tabela `user`:

```
CREATE USER u3 IDENTIFIED BY 'password';
GRANT ALL ON *.* TO u3;
REVOKE ALL ON mysql.* FROM u3;
GRANT SELECT ON mysql.db TO u3;
GRANT SELECT(Host,User) ON mysql.user TO u3;
```