### 8.2.10 Usando papéis

Um papel do MySQL é uma coleção nomeada de privilégios. Assim como as contas de usuário, os papéis podem ter privilégios concedidos a eles e revogados.

Uma conta de usuário pode receber papéis, o que concede à conta os privilégios associados a cada papel. Isso permite a atribuição de conjuntos de privilégios às contas e oferece uma alternativa conveniente para a atribuição de privilégios individuais, tanto para a conceituação das atribuições de privilégios desejadas quanto para a implementação delas.

A lista a seguir resume as capacidades de gerenciamento de papéis fornecidas pelo MySQL:

- `CREATE ROLE` e `DROP ROLE` criam e removem papéis.

- `GRANT` e `REVOKE` atribuem privilégios para revogar privilégios de contas e papéis de usuários.

- `SHOW GRANTS` exibe atribuições de privilégios e papéis para contas e papéis de usuários.

- `SET DEFAULT ROLE` especifica quais papéis de conta são ativos por padrão.

- `SET ROLE` altera os papéis ativos dentro da sessão atual.

- A função `CURRENT_ROLE()` exibe os papéis ativos dentro da sessão atual.

- As variáveis de sistema `mandatory_roles` e `activate_all_roles_on_login` permitem definir papéis obrigatórios e a ativação automática de papéis concedidos quando os usuários fazem login no servidor.

Para descrições de declarações de manipulação de funções individuais (incluindo os privilégios necessários para usá-las), consulte a Seção 15.7.1, “Declarações de Gerenciamento de Conta”. A discussão a seguir fornece exemplos de uso de funções. A menos que especificado de outra forma, as declarações SQL mostradas aqui devem ser executadas usando uma conta MySQL com privilégios administrativos suficientes, como a conta `root`.

- Criando papéis e concedendo privilégios a eles
- Definindo papéis obrigatórios
- Verificar privilégios de papel
- Ativação de papéis
- Revocar papéis ou privilégios de papel
- Abandonando papéis
- Intercambiabilidade de Usuário e Papel

#### Criando papéis e concedendo privilégios a eles

Considere este cenário:

- Um aplicativo usa um banco de dados chamado `app_db`.

- Associado à aplicação, podem haver contas para desenvolvedores que criam e mantêm a aplicação, e para usuários que interagem com ela.

- Os desenvolvedores precisam ter acesso total ao banco de dados. Alguns usuários precisam apenas de acesso de leitura, outros precisam de acesso de leitura/escrita.

Para evitar conceder privilégios individualmente a muitas contas de usuário, crie papéis como nomes para os conjuntos de privilégios necessários. Isso facilita a concessão dos privilégios necessários às contas de usuário, concedendo os papéis apropriados.

Para criar os papéis, use a declaração `CREATE ROLE`:

```
CREATE ROLE 'app_developer', 'app_read', 'app_write';
```

Os nomes de papéis são muito parecidos com os nomes de contas de usuário e consistem em uma parte de usuário e uma parte de host no formato `'user_name'@'host_name'`. A parte de host, se omitida, tem como padrão `'%'`. A parte de usuário e a parte de host não podem ser citadas a menos que contenham caracteres especiais, como `-` ou `%`. Ao contrário dos nomes de contas, a parte de usuário dos nomes de papéis não pode ser em branco. Para obter informações adicionais, consulte a Seção 8.2.5, “Especificação de Nomes de Papéis”.

Para atribuir privilégios aos papéis, execute as instruções `GRANT` usando a mesma sintaxe que para atribuir privilégios às contas de usuário:

```
GRANT ALL ON app_db.* TO 'app_developer';
GRANT SELECT ON app_db.* TO 'app_read';
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```

Agora, suponha que você precise inicialmente de uma conta de desenvolvedor, duas contas de usuário que precisem de acesso apenas de leitura e uma conta de usuário que precise de acesso de leitura/escrita. Use `CREATE USER` para criar as contas:

```
CREATE USER 'dev1'@'localhost' IDENTIFIED BY 'dev1pass';
CREATE USER 'read_user1'@'localhost' IDENTIFIED BY 'read_user1pass';
CREATE USER 'read_user2'@'localhost' IDENTIFIED BY 'read_user2pass';
CREATE USER 'rw_user1'@'localhost' IDENTIFIED BY 'rw_user1pass';
```

Para atribuir a cada conta de usuário os privilégios necessários, você pode usar as instruções `GRANT` do mesmo formato mostrado acima, mas isso exige a enumeração de privilégios individuais para cada usuário. Em vez disso, use uma sintaxe alternativa `GRANT` que permite a concessão de papéis em vez de privilégios:

```
GRANT 'app_developer' TO 'dev1'@'localhost';
GRANT 'app_read' TO 'read_user1'@'localhost', 'read_user2'@'localhost';
GRANT 'app_read', 'app_write' TO 'rw_user1'@'localhost';
```

A declaração `GRANT` para a conta `rw_user1` concede os papéis de leitura e escrita, que combinam para fornecer os privilégios de leitura e escrita necessários.

A sintaxe `GRANT` para conceder funções a uma conta difere da sintaxe para conceder privilégios: há uma cláusula `ON` para atribuir privilégios, enquanto não há uma cláusula `ON` para atribuir funções. Como as sintaxes são distintas, você não pode misturar a atribuição de privilégios e funções na mesma instrução. (É permitido atribuir tanto privilégios quanto funções a uma conta, mas você deve usar declarações separadas `GRANT` com sintaxe apropriada para o que será concedido.) A partir do MySQL 8.0.16, funções não podem ser concedidas a usuários anônimos.

Quando um papel é criado, ele é bloqueado, não tem senha e é atribuído o plugin de autenticação padrão. (Esses atributos do papel podem ser alterados posteriormente com a declaração `ALTER USER`, por usuários que possuem o privilégio global `CREATE USER`.)

Enquanto bloqueado, um papel não pode ser usado para autenticar-se no servidor. Se desbloqueado, um papel pode ser usado para autenticar. Isso ocorre porque papéis e usuários são ambos identificadores de autorização com muito em comum e pouco para distingui-los. Veja também Intercambiabilidade de Usuário e Papel.

#### Definindo papéis obrigatórios

É possível especificar funções como obrigatórias ao nomeá-las no valor da variável de sistema `mandatory_roles`. O servidor trata uma função obrigatória como concedida a todos os usuários, de modo que não precisa ser concedida explicitamente a nenhuma conta.

Para especificar papéis obrigatórios ao iniciar o servidor, defina `mandatory_roles` no arquivo do servidor `my.cnf`:

```
[mysqld]
mandatory_roles='role1,role2@localhost,r3@%.example.com'
```

Para definir e persistir em `mandatory_roles` em tempo de execução, use uma declaração como esta:

```
SET PERSIST mandatory_roles = 'role1,role2@localhost,r3@%.example.com';
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor da instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Para definir `mandatory_roles`, é necessário o privilégio `ROLE_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou do privilégio desatualizado `SUPER`, normalmente necessário para definir uma variável de sistema global).

Os papéis obrigatórios, assim como os papéis explicitamente concedidos, só entram em vigor quando ativados (consulte Ativação de papéis). No momento do login, a ativação do papel ocorre para todos os papéis concedidos, se a variável de sistema `activate_all_roles_on_login` estiver habilitada, ou para papéis que sejam definidos como papéis padrão caso contrário. No momento da execução, o `SET ROLE` ativa os papéis.

Os papéis nomeados no valor de `mandatory_roles` não podem ser revogados com `REVOKE` ou removidos com `DROP ROLE` ou `DROP USER`.

Para evitar que as sessões sejam feitas como sessões do sistema por padrão, um papel que tenha o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`:

- Se `mandatory_roles` receber um papel no início que tenha o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem no log de erro e sai.

- Se `mandatory_roles` receber um papel no tempo de execução que tenha o privilégio `SYSTEM_USER`, ocorrerá um erro e o valor `mandatory_roles` permanecerá inalterado.

Mesmo com essa proteção, é melhor evitar conceder o privilégio `SYSTEM_USER` por meio de um papel para evitar a possibilidade de escalada de privilégios.

Se um papel nomeado em `mandatory_roles` não estiver presente na tabela de sistema `mysql.user`, o papel não será concedido aos usuários. Quando o servidor tenta ativar o papel para um usuário, ele não trata o papel inexistente como obrigatório e escreve um aviso no log de erro. Se o papel for criado posteriormente e, assim, tornar-se válido, pode ser necessário `FLUSH PRIVILEGES` para fazer com que o servidor o trate como obrigatório.

`SHOW GRANTS` exibe os papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.21, “Declaração de GRANTS”.

#### Verificar privilégios de papel

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

No entanto, isso mostra cada papel concedido sem “expandir” para os privilégios que o papel representa. Para mostrar os privilégios do papel também, adicione uma cláusula `USING` que nomeie os papéis concedidos para os quais os privilégios serão exibidos:

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

Verifique cada tipo de usuário de maneira semelhante:

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

`SHOW GRANTS` exibe os papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.21, “Declaração de GRANTS”.

#### Ativação de papéis

Os papéis concedidos a uma conta de usuário podem estar ativos ou inativos durante as sessões da conta. Se um papel concedido estiver ativo durante uma sessão, seus privilégios serão aplicados; caso contrário, não serão. Para determinar quais papéis estão ativos durante a sessão atual, use a função `CURRENT_ROLE()`.

Por padrão, conceder um papel a uma conta ou nomeá-la no valor da variável de sistema `mandatory_roles` não faz com que o papel se torne ativo nas sessões da conta automaticamente. Por exemplo, como até agora, nas discussões anteriores, nenhum papel `rw_user1` foi ativado, se você se conectar ao servidor como `rw_user1` e invocar a função `CURRENT_ROLE()`, o resultado é `NONE` (sem papéis ativos):

```
mysql> SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
```

Para especificar quais papéis devem se tornar ativos sempre que um usuário se conectar ao servidor e se autenticar, use `SET DEFAULT ROLE`. Para definir o padrão para todos os papéis atribuídos para cada conta criada anteriormente, use esta declaração:

```
SET DEFAULT ROLE ALL TO
  'dev1'@'localhost',
  'read_user1'@'localhost',
  'read_user2'@'localhost',
  'rw_user1'@'localhost';
```

Agora, se você se conectar como `rw_user1`, o valor inicial de `CURRENT_ROLE()` refletirá as novas atribuições de papéis padrão:

```
mysql> SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```

Para que todos os papéis explicitamente concedidos e obrigatórios sejam ativados automaticamente quando os usuários se conectarem ao servidor, habilite a variável de sistema `activate_all_roles_on_login`. Por padrão, a ativação automática do papel está desativada.

Durante uma sessão, um usuário pode executar `SET ROLE` para alterar o conjunto de papéis ativos. Por exemplo, para `rw_user1`:

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

A primeira declaração `SET ROLE` desativa todos os papéis. A segunda torna o `rw_user1` efetivamente apenas para leitura. A terceira restaura os papéis padrão.

O usuário efetivo para objetos de programa armazenado e visualização está sujeito aos atributos `DEFINER` e `SQL SECURITY`, que determinam se a execução ocorre no contexto do invocante ou do definidor (consulte a Seção 27.6, “Controle de Acesso a Objetos Armazenados”):

- Objetos de programa armazenado e de visualização que executam no contexto do invocante são executados com os papéis ativos na sessão atual.

- Objetos de programa armazenado e de visualização que executam no contexto do definidor são executados com os papéis padrão do usuário nomeado em seu atributo `DEFINER`. Se `activate_all_roles_on_login` estiver habilitado, esses objetos são executados com todos os papéis concedidos ao usuário `DEFINER`, incluindo papéis obrigatórios. Para programas armazenados, se a execução deve ocorrer com papéis diferentes dos padrões, o corpo do programa pode executar `SET ROLE` para ativar os papéis necessários. Isso deve ser feito com cuidado, pois os privilégios atribuídos aos papéis podem ser alterados.

#### Revocar papéis ou privilégios de papel

Assim como os papéis podem ser concedidos a uma conta, eles também podem ser revogados de uma conta:

```
REVOKE role FROM user;
```

Os papéis nomeados na variável de sistema `mandatory_roles` não podem ser revogados.

`REVOKE` também pode ser aplicado a um papel para modificar os privilégios concedidos a ele. Isso afeta não apenas o próprio papel, mas também qualquer conta que tenha concedido esse papel. Suponha que você queira tornar temporariamente todos os usuários de aplicativos apenas de leitura. Para fazer isso, use `REVOKE` para revogar os privilégios de modificação do papel `app_write`:

```
REVOKE INSERT, UPDATE, DELETE ON app_db.* FROM 'app_write';
```

Como acontece, isso deixa o papel sem privilégios, como pode ser visto usando `SHOW GRANTS` (o que demonstra que essa declaração pode ser usada com papéis, não apenas com usuários):

```
mysql> SHOW GRANTS FOR 'app_write';
+---------------------------------------+
| Grants for app_write@%                |
+---------------------------------------+
| GRANT USAGE ON *.* TO `app_write`@`%` |
+---------------------------------------+
```

Como a revogação de privilégios de um papel afeta os privilégios de qualquer usuário que seja atribuído ao papel modificado, o `rw_user1` agora não tem privilégios de modificação de tabela (os `INSERT`, `UPDATE` e `DELETE` já não estão presentes):

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

Na verdade, o usuário de leitura/escrita `rw_user1` tornou-se um usuário somente de leitura. Isso também ocorre com quaisquer outras contas que recebam o papel `app_write`, ilustrando como o uso de papéis torna desnecessário modificar privilégios para contas individuais.

Para restaurar os privilégios de modificação ao papel, basta concedi-los novamente:

```
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```

Agora, o `rw_user1` tem novamente privilégios de modificação, assim como qualquer outra conta que tenha o papel `app_write`.

#### Abandonando papéis

Para abandonar papéis, use `DROP ROLE`:

```
DROP ROLE 'app_read', 'app_write';
```

A remoção de um papel revoga-o de todas as contas para as quais foi concedido.

Os papéis nomeados na variável de sistema `mandatory_roles` não podem ser removidos.

#### Intercambiabilidade de Usuário e Papel

Como foi mencionado anteriormente para `SHOW GRANTS`, que exibe subsídios para contas de usuário ou papéis, contas e papéis podem ser usados de forma intercambiável.

Uma diferença entre papéis e usuários é que `CREATE ROLE` cria um identificador de autorização que está bloqueado por padrão, enquanto `CREATE USER` cria um identificador de autorização que está desbloqueado por padrão. Você deve ter em mente que essa distinção não é imutável; um usuário com privilégios apropriados pode bloquear ou desbloquear papéis ou (outros) usuários após eles terem sido criados.

Se um administrador de banco de dados tem a preferência de que um identificador de autorização específico deve ser um papel, um esquema de nome pode ser usado para comunicar essa intenção. Por exemplo, você pode usar um prefixo `r_` para todos os identificadores de autorização que você pretende serem papéis e nada mais.

Outra diferença entre papéis e usuários está nos privilégios disponíveis para administrá-los:

- Os privilégios `CREATE ROLE` e `DROP ROLE` permitem o uso apenas das instruções `CREATE ROLE` e `DROP ROLE`, respectivamente.

- O privilégio `CREATE USER` permite o uso das instruções `ALTER USER`, `CREATE ROLE`, `CREATE USER`, `DROP ROLE`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`.

Assim, os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto `CREATE USER` e podem ser concedidos a usuários que só devem ter permissão para criar e remover papéis, e não para realizar manipulação de contas mais genéricas.

Em relação aos privilégios e intercâmbios de usuários e papéis, você pode tratar uma conta de usuário como um papel e conceder essa conta a outro usuário ou papel. O efeito é conceder os privilégios e papéis da conta ao outro usuário ou papel.

Este conjunto de declarações demonstra que você pode conceder um usuário a um usuário, um papel a um usuário, um usuário a um papel ou um papel a um papel:

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

O resultado em cada caso é conceder ao objeto beneficiário os privilégios associados ao objeto concedido. Após a execução dessas declarações, cada um de `u2` e `r2` recebeu privilégios de um usuário (`u1`) e um papel (`r1`):

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

O exemplo anterior é apenas ilustrativo, mas a intercambiabilidade de contas e papéis de usuários tem aplicação prática, como na seguinte situação: Suponha que um projeto de desenvolvimento de aplicativos legados tenha começado antes do surgimento dos papéis no MySQL, então todas as contas de usuário associadas ao projeto recebem privilégios diretamente (em vez de receber privilégios em virtude de serem concedidos papéis). Uma dessas contas é uma conta de desenvolvedor que foi originalmente concedida os seguintes privilégios:

```
CREATE USER 'old_app_dev'@'localhost' IDENTIFIED BY 'old_app_devpass';
GRANT ALL ON old_app.* TO 'old_app_dev'@'localhost';
```

Se esse desenvolvedor sair do projeto, será necessário atribuir os privilégios a outro usuário ou, talvez, a vários usuários, se as atividades de desenvolvimento se expandirem. Aqui estão algumas maneiras de lidar com o problema:

- Sem usar papéis: altere a senha da conta para que o desenvolvedor original não possa usá-la e faça com que um novo desenvolvedor use a conta:

  ```
  ALTER USER 'old_app_dev'@'localhost' IDENTIFIED BY 'new_password';
  ```

- Usando papéis: Bloquear a conta para impedir que alguém a use para se conectar ao servidor:

  ```
  ALTER USER 'old_app_dev'@'localhost' ACCOUNT LOCK;
  ```

  Em seguida, trate a conta como um papel. Para cada desenvolvedor novo no projeto, crie uma nova conta e conceda-lhe a conta do desenvolvedor original:

  ```
  CREATE USER 'new_app_dev1'@'localhost' IDENTIFIED BY 'new_password';
  GRANT 'old_app_dev'@'localhost' TO 'new_app_dev1'@'localhost';
  ```

  O efeito é atribuir os privilégios da conta do desenvolvedor original para a nova conta.
