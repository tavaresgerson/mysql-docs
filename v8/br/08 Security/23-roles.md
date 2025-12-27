### 8.2.10 Usando papéis

Um papel do MySQL é uma coleção nomeada de privilégios. Assim como as contas de usuário, os papéis podem ter privilégios concedidos a eles e revogados.

Uma conta de usuário pode receber papéis, o que concede à conta os privilégios associados a cada papel. Isso permite a atribuição de conjuntos de privilégios a contas e oferece uma alternativa conveniente para conceder privilégios individuais, tanto para a conceitualização das atribuições de privilégios desejadas quanto para implementá-las.

A lista a seguir resume as capacidades de gerenciamento de papéis fornecidas pelo MySQL:

* `CREATE ROLE` e `DROP ROLE` criam e removem papéis.
* `GRANT` e `REVOKE` atribuem privilégios para revogar privilégios de contas de usuário e papéis.
* `SHOW GRANTS` exibe as atribuições de privilégios e papéis para contas de usuário e papéis.
* `SET DEFAULT ROLE` especifica quais papéis de conta estão ativos por padrão.
* `SET ROLE` altera os papéis ativos dentro da sessão atual.
* A função `CURRENT_ROLE()` exibe os papéis ativos dentro da sessão atual.
* As variáveis de sistema `mandatory_roles` e `activate_all_roles_on_login` permitem definir papéis obrigatórios e a ativação automática dos papéis concedidos quando os usuários fazem login no servidor.

Para descrições das declarações individuais de manipulação de papéis (incluindo os privilégios necessários para usá-las), consulte a Seção 15.7.1, “Declarações de Gerenciamento de Contas”. A discussão a seguir fornece exemplos de uso de papéis. A menos que especificado de outra forma, as declarações SQL mostradas aqui devem ser executadas usando uma conta MySQL com privilégios administrativos suficientes, como a conta `root`.

* Criando Papéis e Concedendo-lhes Privilégios
* Definindo Papéis Obrigatórios
* Verificando Privilegios de Papel
* Ativando Papéis
* Revoando Papéis ou Privilegios de Papel
* Removendo Papéis
* Interchangabilidade de Usuário e Papel

* Uma aplicação usa um banco de dados chamado `app_db`.
* Associado à aplicação, podem existir contas para desenvolvedores que criam e mantêm a aplicação, e para usuários que interagem com ela.
* Os desenvolvedores precisam de acesso total ao banco de dados. Alguns usuários precisam apenas de acesso de leitura, outros precisam de acesso de leitura/escrita.

Para evitar conceder privilégios individualmente a possivelmente muitas contas de usuário, crie rolos como nomes para os conjuntos de privilégios necessários. Isso facilita a concessão dos privilégios necessários às contas de usuário, concedendo os rolos apropriados.

Para criar os rolos, use a instrução `CREATE ROLE`:

```
CREATE ROLE 'app_developer', 'app_read', 'app_write';
```

Os nomes dos rolos são muito semelhantes aos nomes das contas de usuário e consistem em uma parte de usuário e uma parte de host no formato `'user_name'@'host_name'`. A parte do host, se omitida, tem como padrão `'%'`. A parte de usuário e a parte do host podem não ser citadas, a menos que contenham caracteres especiais, como `-` ou `%`. Ao contrário dos nomes de contas, a parte de usuário dos nomes dos rolos não pode ser em branco. Para obter informações adicionais, consulte a Seção 8.2.5, “Especificando Nomes de Rolos”.

Para atribuir privilégios aos rolos, execute instruções `GRANT` usando a mesma sintaxe que para atribuir privilégios às contas de usuário:

```
GRANT ALL ON app_db.* TO 'app_developer';
GRANT SELECT ON app_db.* TO 'app_read';
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```

Agora, suponha que, inicialmente, você precise de uma conta de desenvolvedor, duas contas de usuário que precisam de acesso apenas de leitura e uma conta de usuário que precisa de acesso de leitura/escrita. Use `CREATE USER` para criar as contas:

```
CREATE USER 'dev1'@'localhost' IDENTIFIED BY 'dev1pass';
CREATE USER 'read_user1'@'localhost' IDENTIFIED BY 'read_user1pass';
CREATE USER 'read_user2'@'localhost' IDENTIFIED BY 'read_user2pass';
CREATE USER 'rw_user1'@'localhost' IDENTIFIED BY 'rw_user1pass';
```

Para atribuir a cada conta de usuário os privilégios necessários, você poderia usar instruções `GRANT` da mesma forma que foi mostrado, mas isso requer enumerar privilégios individuais para cada usuário. Em vez disso, use uma sintaxe `GRANT` alternativa que permite conceder rolos em vez de privilégios:

```
GRANT 'app_developer' TO 'dev1'@'localhost';
GRANT 'app_read' TO 'read_user1'@'localhost', 'read_user2'@'localhost';
GRANT 'app_read', 'app_write' TO 'rw_user1'@'localhost';
```

A instrução `GRANT` para a conta `rw_user1` concede os rolos de leitura e escrita, que combinam para fornecer os privilégios de leitura e escrita necessários.

A sintaxe `GRANT` para conceder funções a uma conta difere da sintaxe para conceder privilégios: há uma cláusula `ON` para atribuir privilégios, enquanto não há uma cláusula `ON` para atribuir funções. Como as sinttaxes são distintas, você não pode misturar a atribuição de privilégios e funções na mesma instrução. (É permitido atribuir tanto privilégios quanto funções a uma conta, mas você deve usar instruções `GRANT` separadas, cada uma com a sintaxe apropriada para o que será concedido.) Funções não podem ser concedidas a usuários anônimos.

Quando criada, uma função está bloqueada, não tem senha e é atribuída o plugin de autenticação padrão. (Esses atributos de função podem ser alterados mais tarde com a instrução `ALTER USER`, por usuários que têm o privilégio global `CREATE USER`.)

Enquanto bloqueada, uma função não pode ser usada para autenticar-se no servidor. Se desbloqueada, uma função pode ser usada para autenticar. Isso ocorre porque funções e usuários são ambos identificadores de autorização com muito em comum e pouco para distingui-los. Veja também Intercambiabilidade de Usuário e Função.

#### Definindo Funções Obrigatórias

É possível especificar funções como obrigatórias ao nomeá-las no valor da variável de sistema `mandatory_roles`. O servidor trata uma função obrigatória como concedida a todos os usuários, para que não precise ser concedida explicitamente a nenhuma conta.

Para especificar funções obrigatórias no início do servidor, defina `mandatory_roles` no arquivo `my.cnf` do seu servidor:

```
[mysqld]
mandatory_roles='role1,role2@localhost,r3@%.example.com'
```

Para definir e persistir `mandatory_roles` em tempo de execução, use uma instrução como esta:

```
SET PERSIST mandatory_roles = 'role1,role2@localhost,r3@%.example.com';
```

`SET PERSIST` define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Definir `mandatory_roles` requer o privilégio `ROLE_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o desatualizado privilégio `SUPER`) normalmente necessário para definir uma variável de sistema global.

Rotulações obrigatórias, como as rotulações concedidas explicitamente, só entram em vigor quando ativadas (consulte Ativação de rotulações). No momento do login, a ativação da rotação ocorre para todas as rotulações concedidas se a variável de sistema `activate_all_roles_on_login` estiver habilitada, ou para rotulações definidas como rotulações padrão caso contrário. No momento do runtime, o comando `SET ROLE` ativa as rotulações.

Rotulações nomeadas no valor de `mandatory_roles` não podem ser revogadas com `REVOKE` ou excluídas com `DROP ROLE` ou `DROP USER`.

Para evitar que as sessões sejam automaticamente criadas como sessões de sistema, uma rotação que tenha o privilégio `SYSTEM_USER` não pode ser listada no valor da variável de sistema `mandatory_roles`:

* Se `mandatory_roles` for atribuída uma rotação no momento do início que tenha o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem no log de erro e sai.
* Se `mandatory_roles` for atribuída uma rotação no momento do runtime que tenha o privilégio `SYSTEM_USER`, ocorre um erro e o valor de `mandatory_roles` permanece inalterado.

Mesmo com essa proteção, é melhor evitar conceder o privilégio `SYSTEM_USER` por meio de uma rotação para evitar a possibilidade de escalada de privilégios.

Se uma rotação nomeada em `mandatory_roles` não estiver presente na tabela de sistema `mysql.user`, a rotação não é concedida aos usuários. Quando o servidor tenta ativar a rotação para um usuário, ele não trata a rotação inexistente como obrigatória e escreve uma mensagem de aviso no log de erro. Se a rotação for criada posteriormente e, assim, tornar-se válida, pode ser necessário o comando `FLUSH PRIVILEGES` para fazer com que o servidor a trate como obrigatória.

`SHOW GRANTS` exibe rotulações obrigatórias de acordo com as regras descritas na Seção 15.7.7.22, “Instrução SHOW GRANTS”.

#### Verificação de privilégios de rotação

Para verificar os privilégios atribuídos a uma conta, use `SHOW GRANTS`. Por exemplo:

```
mysql> SHOW GRANTS FOR 'dev1'@'localhost';
+-------------------------------------------------+
| Grants for dev1@localhost                       |
+-------------------------------------------------+
| GRANT USAGE ON *.* TO `dev1`@`localhost`        |
| GRANT `app_developer`@`%` TO `dev1`@`localhost` |
+-------------------------------------------------+
```

No entanto, isso mostra cada papel concedido sem "expandir" para os privilégios que o papel representa. Para mostrar os privilégios do papel também, adicione uma cláusula `USING` que nomeia os papéis concedidos para os quais os privilégios devem ser exibidos:

```
mysql> SHOW GRANTS FOR 'dev1'@'localhost' USING 'app_developer';
+----------------------------------------------------------+
| Grants for dev1@localhost                                |
+----------------------------------------------------------+
| GRANT USAGE ON *.* TO `dev1`@`localhost`                 |
| GRANT ALL PRIVILEGES ON `app_db`.* TO `dev1`@`localhost` |
| GRANT `app_developer`@`%` TO `dev1`@`localhost`          |
+----------------------------------------------------------+
```

Verifique o outro tipo de usuário de maneira semelhante:

```
mysql> SHOW GRANTS FOR 'read_user1'@'localhost' USING 'app_read';
+--------------------------------------------------------+
| Grants for read_user1@localhost                        |
+--------------------------------------------------------+
| GRANT USAGE ON *.* TO `read_user1`@`localhost`         |
| GRANT SELECT ON `app_db`.* TO `read_user1`@`localhost` |
| GRANT `app_read`@`%` TO `read_user1`@`localhost`       |
+--------------------------------------------------------+
mysql> SHOW GRANTS FOR 'rw_user1'@'localhost' USING 'app_read', 'app_write';
+------------------------------------------------------------------------------+
| Grants for rw_user1@localhost                                                |
+------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `rw_user1`@`localhost`                                 |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `app_db`.* TO `rw_user1`@`localhost` |
| GRANT `app_read`@`%`,`app_write`@`%` TO `rw_user1`@`localhost`               |
+------------------------------------------------------------------------------+
```

`SHOW GRANTS` exibe papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.22, "Declaração SHOW GRANTS".

#### Ativação de Papéis

Os papéis concedidos a uma conta de usuário podem ser ativos ou inativos dentro das sessões da conta. Se um papel concedido estiver ativo dentro de uma sessão, seus privilégios se aplicam; caso contrário, eles não se aplicam. Para determinar quais papéis estão ativos dentro da sessão atual, use a função `CURRENT_ROLE()`.

Por padrão, conceder um papel a uma conta ou nomeá-lo na variável de sistema `mandatory_roles` não causa automaticamente que o papel se torne ativo dentro das sessões da conta. Por exemplo, até agora na discussão anterior, nenhum papel `rw_user1` foi ativado. Se você se conectar ao servidor como `rw_user1` e invocar a função `CURRENT_ROLE()`, o resultado é `NONE` (sem papéis ativos):

```
mysql> SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
```

Para especificar quais papéis devem se tornar ativos cada vez que um usuário se conecta ao servidor e autentica, use `SET DEFAULT ROLE`. Para definir o padrão para todos os papéis atribuídos para cada conta criada anteriormente, use esta declaração:

```
SET DEFAULT ROLE ALL TO
  'dev1'@'localhost',
  'read_user1'@'localhost',
  'read_user2'@'localhost',
  'rw_user1'@'localhost';
```

Agora, se você se conectar como `rw_user1`, o valor inicial de `CURRENT_ROLE()` reflete as novas atribuições de papéis padrão:

```
mysql> SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```

Para fazer com que todos os papéis explicitamente concedidos e obrigatórios sejam ativados automaticamente quando os usuários se conectam ao servidor, habilite a variável de sistema `activate_all_roles_on_login`. Por padrão, a ativação automática de papéis está desativada.

Dentro de uma sessão, um usuário pode executar `SET ROLE` para alterar o conjunto de papéis ativos. Por exemplo, para `rw_user1`:

```
mysql> SET ROLE NONE; SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
mysql> SET ROLE ALL EXCEPT 'app_write'; SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| `app_read`@`%` |
+----------------+
mysql> SET ROLE DEFAULT; SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```

A primeira instrução `SET ROLE` desativa todos os papéis. A segunda torna o `rw_user1` efetivamente apenas de leitura. A terceira restaura os papéis padrão.

O usuário efetivo para objetos de programa armazenado e visual é sujeito aos atributos `DEFINER` e `SQL SECURITY`, que determinam se a execução ocorre no contexto do invocante ou do definidor (veja a Seção 27.6, “Controle de Acesso a Objetos Armazenados”):

* Objetos de programa armazenado e visual que executam no contexto do invocante executam com os papéis que estão ativos na sessão atual.
* Objetos de programa armazenado e visual que executam no contexto do definidor executam com os papéis padrão do usuário nomeado em seu atributo `DEFINER`. Se `activate_all_roles_on_login` estiver habilitado, esses objetos executam com todos os papéis concedidos ao usuário `DEFINER`, incluindo papéis obrigatórios. Para programas armazenados, se a execução deve ocorrer com papéis diferentes dos padrão, o corpo do programa pode executar `SET ROLE` para ativar os papéis necessários. Isso deve ser feito com cautela, pois os privilégios atribuídos aos papéis podem ser alterados.

#### Revocação de Papéis ou Privilégios de Papel

Assim como papéis podem ser concedidos a uma conta, eles também podem ser revogados:

```
REVOKE role FROM user;
```

Papéis nomeados no valor da variável de sistema `mandatory_roles` não podem ser revogados.

 `REVOKE` também pode ser aplicado a um papel para modificar os privilégios concedidos a ele. Isso afeta não apenas o próprio papel, mas qualquer conta que tenha concedido o papel. Suponha que você queira tornar temporariamente todos os usuários da aplicação apenas de leitura. Para fazer isso, use `REVOKE` para revogar os privilégios de modificação do papel `app_write`:

```
REVOKE INSERT, UPDATE, DELETE ON app_db.* FROM 'app_write';
```

Como resultado, o papel fica sem privilégios, como pode ser visto usando `SHOW GRANTS` (que demonstra que essa instrução pode ser usada com papéis, não apenas com usuários):

```
mysql> SHOW GRANTS FOR 'app_write';
+---------------------------------------+
| Grants for app_write@%                |
+---------------------------------------+
| GRANT USAGE ON *.* TO `app_write`@`%` |
+---------------------------------------+
```

Como a revogação de privilégios de um papel afeta os privilégios de qualquer usuário que seja atribuído ao papel modificado, o `rw_user1` agora não tem privilégios de modificação de tabela (as operações `INSERT`, `UPDATE` e `DELETE` já não estão mais disponíveis):

```
mysql> SHOW GRANTS FOR 'rw_user1'@'localhost'
       USING 'app_read', 'app_write';
+----------------------------------------------------------------+
| Grants for rw_user1@localhost                                  |
+----------------------------------------------------------------+
| GRANT USAGE ON *.* TO `rw_user1`@`localhost`                   |
| GRANT SELECT ON `app_db`.* TO `rw_user1`@`localhost`           |
| GRANT `app_read`@`%`,`app_write`@`%` TO `rw_user1`@`localhost` |
+----------------------------------------------------------------+
```

Na prática, o usuário de leitura/escrita `rw_user1` tornou-se um usuário de leitura apenas. Isso também ocorre com quaisquer outras contas que recebam o papel `app_write`, ilustrando como o uso de papéis torna desnecessário modificar os privilégios de contas individuais.

Para restaurar os privilégios de modificação ao papel, basta reatribuí-los:

```
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```

Agora, o `rw_user1` novamente tem privilégios de modificação, assim como qualquer outra conta que receba o papel `app_write`.

#### Remoção de Papéis

Para remover papéis, use `DROP ROLE`:

```
DROP ROLE 'app_read', 'app_write';
```

A remoção de um papel revoga-o de todas as contas às quais foi concedido.

Papéis nomeados no valor da variável de sistema `mandatory_roles` não podem ser removidos.

#### Interchangibilidade de Usuários e Papéis

Como foi sugerido anteriormente para `SHOW GRANTS`, que exibe os privilégios para contas de usuário ou papéis, contas e papéis podem ser usados de forma intercambiável.

Uma diferença entre papéis e usuários é que `CREATE ROLE` cria um identificador de autorização que é bloqueado por padrão, enquanto `CREATE USER` cria um identificador de autorização que é desbloqueado por padrão. Você deve ter em mente que essa distinção não é imutável; um usuário com privilégios apropriados pode bloquear ou desbloquear papéis ou (outros) usuários após eles terem sido criados.

Se um administrador de banco de dados tem a preferência de que um identificador de autorização específico deve ser um papel, um esquema de nome pode ser usado para comunicar essa intenção. Por exemplo, você poderia usar um prefixo `r_` para todos os identificadores de autorização que você pretende ser papéis e nada mais.

Outra diferença entre papéis e usuários reside nos privilégios disponíveis para administrá-los:

* Os privilégios `CREATE ROLE` e `DROP ROLE` permitem o uso apenas das instruções `CREATE ROLE` e `DROP ROLE`, respectivamente.
* O privilégio `CREATE USER` permite o uso das instruções `ALTER USER`, `CREATE ROLE`, `CREATE USER`, `DROP ROLE`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`.

Assim, os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto `CREATE USER` e podem ser concedidos a usuários que devem ter permissão apenas para criar e descartar papéis, e não para realizar manipulação de contas mais geral.

Em relação aos privilégios e à intercambiabilidade de usuários e papéis, você pode tratar uma conta de usuário como um papel e conceder essa conta a outro usuário ou papel. O efeito é conceder os privilégios e papéis da conta ao outro usuário ou papel.

Este conjunto de instruções demonstra que você pode conceder a um usuário, a um papel, a um usuário a um papel ou a um papel a outro papel:

```
CREATE USER 'u1';
CREATE ROLE 'r1';
GRANT SELECT ON db1.* TO 'u1';
GRANT SELECT ON db2.* TO 'r1';
CREATE USER 'u2';
CREATE ROLE 'r2';
GRANT 'u1', 'r1' TO 'u2';
GRANT 'u1', 'r1' TO 'r2';
```

O resultado em cada caso é conceder ao objeto receptor os privilégios associados ao objeto concedido. Após a execução dessas instruções, cada um de `u2` e `r2` recebeu privilégios de um usuário (`u1`) e um papel (`r1`):

```
mysql> SHOW GRANTS FOR 'u2' USING 'u1', 'r1';
+-------------------------------------+
| Grants for u2@%                     |
+-------------------------------------+
| GRANT USAGE ON *.* TO `u2`@`%`      |
| GRANT SELECT ON `db1`.* TO `u2`@`%` |
| GRANT SELECT ON `db2`.* TO `u2`@`%` |
| GRANT `u1`@`%`,`r1`@`%` TO `u2`@`%` |
+-------------------------------------+
mysql> SHOW GRANTS FOR 'r2' USING 'u1', 'r1';
+-------------------------------------+
| Grants for r2@%                     |
+-------------------------------------+
| GRANT USAGE ON *.* TO `r2`@`%`      |
| GRANT SELECT ON `db1`.* TO `r2`@`%` |
| GRANT SELECT ON `db2`.* TO `r2`@`%` |
| GRANT `u1`@`%`,`r1`@`%` TO `r2`@`%` |
+-------------------------------------+
```

O exemplo anterior é ilustrativo apenas, mas a intercambiabilidade de contas de usuário e papéis tem aplicação prática, como na seguinte situação: Suponha que um projeto de desenvolvimento de aplicativos legados tenha começado antes do advento dos papéis no MySQL, então todas as contas de usuário associadas ao projeto recebem privilégios diretamente (em vez de privilégios concedidos em virtude de serem concedidos papéis). Uma dessas contas é uma conta de desenvolvedor que foi originalmente concedida os privilégios da seguinte forma:

```
CREATE USER 'old_app_dev'@'localhost' IDENTIFIED BY 'old_app_devpass';
GRANT ALL ON old_app.* TO 'old_app_dev'@'localhost';
```

Se esse desenvolvedor sair do projeto, torna-se necessário atribuir os privilégios a outro usuário, ou talvez a vários usuários se as atividades de desenvolvimento se expandirem. Aqui estão algumas maneiras de lidar com o problema:

* Sem usar papéis: Altere a senha da conta para que o desenvolvedor original não possa usá-la e faça com que um novo desenvolvedor use a conta:

  ```
  ALTER USER 'old_app_dev'@'localhost' IDENTIFIED BY 'new_password';
  ```
* Usando papéis: Bloqueie a conta para impedir que qualquer pessoa a use para se conectar ao servidor:

  ```
  ALTER USER 'old_app_dev'@'localhost' ACCOUNT LOCK;
  ```

  Em seguida, trate a conta como um papel. Para cada desenvolvedor novo no projeto, crie uma nova conta e conceda a ela os privilégios da conta do desenvolvedor original:

  ```
  CREATE USER 'new_app_dev1'@'localhost' IDENTIFIED BY 'new_password';
  GRANT 'old_app_dev'@'localhost' TO 'new_app_dev1'@'localhost';
  ```

  O efeito é atribuir os privilégios da conta do desenvolvedor original à nova conta.