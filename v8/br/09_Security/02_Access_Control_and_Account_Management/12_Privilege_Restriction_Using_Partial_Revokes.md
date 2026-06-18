### 8.2.12 Restrição de privilégios usando revogações parciais

Antes do MySQL 8.0.16, não é possível conceder privilégios que se apliquem globalmente, exceto para certos esquemas. A partir do MySQL 8.0.16, isso é possível se a variável de sistema `partial_revokes` estiver habilitada. Especificamente, para usuários que têm privilégios no nível global, `partial_revokes` permite que os privilégios para esquemas específicos sejam revogados, mantendo os privilégios em vigor para outros esquemas. As restrições de privilégio impostas dessa forma podem ser úteis para a administração de contas que têm privilégios globais, mas não devem ter permissão para acessar certos esquemas. Por exemplo, é possível permitir que uma conta modifique qualquer tabela, exceto aquelas no esquema de sistema `mysql`.

- Usando revogações parciais
- Revocações parciais versus concessões explícitas de esquema
- Desativar Reivindicações Parciais
- Reivindicações parciais e replicação

Nota

Por simplicidade, as declarações `CREATE USER` mostradas aqui não incluem senhas. Para uso em produção, sempre atribua senhas para as contas.

#### Usando revogações parciais

A variável de sistema `partial_revokes` controla se as restrições de privilégio podem ser aplicadas às contas. Por padrão, `partial_revokes` está desativado e as tentativas de revogar parcialmente os privilégios globais geram um erro:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT ON *.* TO u1;
mysql> REVOKE INSERT ON world.* FROM u1;
ERROR 1141 (42000): There is no such grant defined for user 'u1' on host '%'
```

Para permitir a operação `REVOKE`, habilite `partial_revokes`:

```
SET PERSIST partial_revokes = ON;
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor da instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Com o `partial_revokes` ativado, a revogação parcial é bem-sucedida:

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+------------------------------------------+
| Grants for u1@%                          |
+------------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%`  |
| REVOKE INSERT ON `world`.* FROM `u1`@`%` |
+------------------------------------------+
```

`SHOW GRANTS` lista revogações parciais como declarações `REVOKE` em sua saída. O resultado indica que `u1` tem privilégios globais de `SELECT` e `INSERT`, exceto que `INSERT` não pode ser exercido para tabelas no esquema `world`. Ou seja, o acesso por `u1` às tabelas `world` é apenas de leitura.

O servidor registra as restrições de privilégio implementadas por revogações parciais na tabela do sistema `mysql.user`. Se uma conta tiver revogações parciais, o valor da coluna `User_attributes` tem um atributo `Restrictions`:

```
mysql> SELECT User, Host, User_attributes->>'$.Restrictions'
       FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
+------+------+------------------------------------------------------+
| User | Host | User_attributes->>'$.Restrictions'                   |
+------+------+------------------------------------------------------+
| u1   | %    | [{"Database": "world", "Privileges": ["INSERT"]}] |
+------+------+------------------------------------------------------+
```

Nota

Embora revogações parciais possam ser impostas para qualquer esquema, as restrições de privilégio no esquema de sistema `mysql` são especialmente úteis como parte de uma estratégia para impedir que contas regulares modifiquem contas de sistema. Veja Protegendo Contas de Sistema Contra Manipulação por Contas Regulares.

As operações de revogação parcial estão sujeitas a estas condições:

- É possível usar revogações parciais para restringir esquemas inexistentes, mas apenas se o privilégio revogado for concedido globalmente. Se um privilégio não for concedido globalmente, revogá-lo para um esquema inexistente produz um erro.

- As revogações parciais só se aplicam ao nível do esquema. Você não pode usar revogações parciais para privilégios que se aplicam apenas globalmente (como `FILE` ou `BINLOG_ADMIN`) ou para privilégios de tabela, coluna ou rotina.

- Nas atribuições de privilégios, a ativação de `partial_revokes` faz com que o MySQL interprete as ocorrências de caracteres curinga SQL não escapados `_` e `%` em nomes de esquemas como caracteres literais, assim como se tivessem sido escapados como `_` e `\%`. Como isso altera a forma como o MySQL interpreta os privilégios, pode ser aconselhável evitar caracteres curinga não escapados nas atribuições de privilégios para instalações onde `partial_revokes` pode estar habilitado.

Como mencionado anteriormente, as revogações parciais de privilégios de nível de esquema aparecem na saída `SHOW GRANTS` como instruções `REVOKE`. Isso difere da forma como `SHOW GRANTS` representa os privilégios de nível de esquema “simples”:

- Quando concedidos, os privilégios de nível de esquema são representados por suas próprias declarações `GRANT` na saída:

  ```
  mysql> CREATE USER u1;
  mysql> GRANT UPDATE ON mysql.* TO u1;
  mysql> GRANT DELETE ON world.* TO u1;
  mysql> SHOW GRANTS FOR u1;
  +---------------------------------------+
  | Grants for u1@%                       |
  +---------------------------------------+
  | GRANT USAGE ON *.* TO `u1`@`%`        |
  | GRANT UPDATE ON `mysql`.* TO `u1`@`%` |
  | GRANT DELETE ON `world`.* TO `u1`@`%` |
  +---------------------------------------+
  ```

- Quando revogados, os privilégios de nível de esquema simplesmente desaparecem da saída. Eles não aparecem como declarações `REVOKE`:

  ```
  mysql> REVOKE UPDATE ON mysql.* FROM u1;
  mysql> REVOKE DELETE ON world.* FROM u1;
  mysql> SHOW GRANTS FOR u1;
  +--------------------------------+
  | Grants for u1@%                |
  +--------------------------------+
  | GRANT USAGE ON *.* TO `u1`@`%` |
  +--------------------------------+
  ```

Quando um usuário concede um privilégio, qualquer restrição que o concedente tenha sobre o privilégio é herdada pelo beneficiário, a menos que o beneficiário já tenha o privilégio sem a restrição. Considere os seguintes dois usuários, um dos quais tem o privilégio global `SELECT`:

```
CREATE USER u1, u2;
GRANT SELECT ON *.* TO u2;
```

Suponha que um usuário administrativo `admin` tenha um privilégio global, mas parcialmente revogado `SELECT`:

```
mysql> CREATE USER admin;
mysql> GRANT SELECT ON *.* TO admin WITH GRANT OPTION;
mysql> REVOKE SELECT ON mysql.* FROM admin;
mysql> SHOW GRANTS FOR admin;
+------------------------------------------------------+
| Grants for admin@%                                   |
+------------------------------------------------------+
| GRANT SELECT ON *.* TO `admin`@`%` WITH GRANT OPTION |
| REVOKE SELECT ON `mysql`.* FROM `admin`@`%`          |
+------------------------------------------------------+
```

Se `admin` concede `SELECT` globalmente para `u1` e `u2`, o resultado difere para cada usuário:

- Se `admin` concede `SELECT` globalmente a `u1`, que não tem privilégio `SELECT` para começar, `u1` herda a restrição de privilégio `admin`:

  ```
  mysql> GRANT SELECT ON *.* TO u1;
  mysql> SHOW GRANTS FOR u1;
  +------------------------------------------+
  | Grants for u1@%                          |
  +------------------------------------------+
  | GRANT SELECT ON *.* TO `u1`@`%`          |
  | REVOKE SELECT ON `mysql`.* FROM `u1`@`%` |
  +------------------------------------------+
  ```

- Por outro lado, `u2` já possui um privilégio global `SELECT` sem restrições. `GRANT` só pode adicionar aos privilégios existentes de um beneficiário, não reduzi-los, então se `admin` concede `SELECT` globalmente a `u2`, `u2` não herda a restrição `admin`:

  ```
  mysql> GRANT SELECT ON *.* TO u2;
  mysql> SHOW GRANTS FOR u2;
  +---------------------------------+
  | Grants for u2@%                 |
  +---------------------------------+
  | GRANT SELECT ON *.* TO `u2`@`%` |
  +---------------------------------+
  ```

Se uma declaração `GRANT` incluir uma cláusula `AS user`, as restrições de privilégio aplicadas são as da combinação de usuário/papel especificada pela cláusula, e não as do usuário que executa a declaração. Para informações sobre a cláusula `AS`, consulte a Seção 15.7.1.6, “Declaração GRANT”.

As restrições sobre novos privilégios concedidos a uma conta são adicionadas a quaisquer restrições existentes para essa conta:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
mysql> REVOKE INSERT ON mysql.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE INSERT ON `mysql`.* FROM `u1`@`%`                |
+---------------------------------------------------------+
mysql> REVOKE DELETE, UPDATE ON db2.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE UPDATE, DELETE ON `db2`.* FROM `u1`@`%`          |
| REVOKE INSERT ON `mysql`.* FROM `u1`@`%`                |
+---------------------------------------------------------+
```

A agregação das restrições de privilégio se aplica tanto quando os privilégios são revogados explicitamente (como foi mostrado) quanto quando as restrições são herdadas implicitamente do usuário que executa a declaração ou do usuário mencionado em uma cláusula `AS user`.

Se uma conta tiver uma restrição de privilégio em um esquema:

- A conta não pode conceder privilégios a outras contas no esquema restrito ou a qualquer objeto dentro dele.

- Uma outra conta que não tenha a restrição pode conceder privilégios à conta restrita para o esquema ou objetos restritos dentro dela. Suponha que um usuário não restrito execute essas instruções:

  ```
  CREATE USER u1;
  GRANT SELECT, INSERT, UPDATE ON *.* TO u1;
  REVOKE SELECT, INSERT, UPDATE ON mysql.* FROM u1;
  GRANT SELECT ON mysql.user TO u1;          -- grant table privilege
  GRANT SELECT(Host,User) ON mysql.db TO u1; -- grant column privileges
  ```

  A conta resultante tem esses privilégios, com a capacidade de realizar operações limitadas dentro do esquema restrito:

  ```
  mysql> SHOW GRANTS FOR u1;
  +-----------------------------------------------------------+
  | Grants for u1@%                                           |
  +-----------------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u1`@`%`           |
  | REVOKE SELECT, INSERT, UPDATE ON `mysql`.* FROM `u1`@`%`  |
  | GRANT SELECT (`Host`, `User`) ON `mysql`.`db` TO `u1`@`%` |
  | GRANT SELECT ON `mysql`.`user` TO `u1`@`%`                |
  +-----------------------------------------------------------+
  ```

Se uma conta tiver uma restrição de privilégio global, a restrição será removida por qualquer uma dessas ações:

- Atribuir o privilégio global à conta por uma conta que não tenha restrições sobre o privilégio.

- Conceder o privilégio ao nível do esquema.

- Retirar o privilégio globalmente.

Considere um usuário `u1` que possui vários privilégios globalmente, mas com restrições em `INSERT`, `UPDATE` e `DELETE`:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
mysql> REVOKE INSERT, UPDATE, DELETE ON mysql.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+----------------------------------------------------------+
| Grants for u1@%                                          |
+----------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%`  |
| REVOKE INSERT, UPDATE, DELETE ON `mysql`.* FROM `u1`@`%` |
+----------------------------------------------------------+
```

A concessão de um privilégio global para `u1` a partir de uma conta sem restrições remove a restrição de privilégio. Por exemplo, para remover a restrição `INSERT`:

```
mysql> GRANT INSERT ON *.* TO u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE UPDATE, DELETE ON `mysql`.* FROM `u1`@`%`        |
+---------------------------------------------------------+
```

Ao conceder um privilégio ao nível do esquema para `u1`, a restrição de privilégio é removida. Por exemplo, para remover a restrição `UPDATE`:

```
mysql> GRANT UPDATE ON mysql.* TO u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE DELETE ON `mysql`.* FROM `u1`@`%`                |
+---------------------------------------------------------+
```

Revocar um privilégio global remove o privilégio, incluindo quaisquer restrições nele. Por exemplo, para remover a restrição `DELETE` (a um custo de remover todo o acesso `DELETE`):

```
mysql> REVOKE DELETE ON *.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+-------------------------------------------------+
| Grants for u1@%                                 |
+-------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE ON *.* TO `u1`@`%` |
+-------------------------------------------------+
```

Se uma conta tiver privilégios tanto no nível global quanto no nível do esquema, você deve revogá-los no nível do esquema duas vezes para efetuar uma revogação parcial. Suponha que `u1` tenha esses privilégios, onde `INSERT` é mantido tanto globalmente quanto no esquema `world`:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT ON *.* TO u1;
mysql> GRANT INSERT ON world.* TO u1;
mysql> SHOW GRANTS FOR u1;
+-----------------------------------------+
| Grants for u1@%                         |
+-----------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%` |
| GRANT INSERT ON `world`.* TO `u1`@`%`   |
+-----------------------------------------+
```

A revogação de `INSERT` em `world` revoga o privilégio de nível de esquema (`SHOW GRANTS` não exibe mais a declaração de nível de esquema `GRANT`):

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+-----------------------------------------+
| Grants for u1@%                         |
+-----------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%` |
+-----------------------------------------+
```

Revocar `INSERT` em `world` novamente realiza uma revogação parcial do privilégio global (`SHOW GRANTS` agora inclui uma declaração de nível de esquema `REVOKE`):

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+------------------------------------------+
| Grants for u1@%                          |
+------------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%`  |
| REVOKE INSERT ON `world`.* FROM `u1`@`%` |
+------------------------------------------+
```

#### Revocações parciais versus concessões explícitas de esquema

Para fornecer acesso a contas para alguns esquemas, mas não para outros, as revogações parciais oferecem uma alternativa à abordagem de conceder explicitamente o acesso ao nível do esquema sem conceder privilégios globais. As duas abordagens têm vantagens e desvantagens diferentes.

Atribuição de privilégios de nível de esquema e não de privilégios globais:

- Adicionar um novo esquema: O esquema é inacessível para as contas existentes por padrão. Para que qualquer conta tenha acesso ao esquema, o DBA deve conceder o acesso ao nível do esquema.

- Adicionar uma nova conta: O DBA deve conceder acesso ao nível do esquema para cada esquema para o qual a conta deve ter acesso.

Conceder privilégios globais em conjunto com revogações parciais:

- Adicionar um novo esquema: O esquema é acessível para contas existentes que possuem privilégios globais. Para qualquer conta que precise ser inacessível ao esquema, o DBA deve adicionar uma revogação parcial.

- Adicionar uma nova conta: O DBA deve conceder os privilégios globais, além de revogar parcialmente cada esquema restrito.

A abordagem que utiliza concessão explícita em nível de esquema é mais conveniente para contas para as quais o acesso é limitado a poucos esquemas. A abordagem que utiliza revogações parciais é mais conveniente para contas com acesso amplo a todos os esquemas, exceto alguns.

#### Desativar Reivindicações Parciais

Uma vez ativado, `partial_revokes` não pode ser desativado se qualquer conta tiver restrições de privilégio. Se tal conta existir, a desativação de `partial_revokes` falhará:

- Para tentativas de desabilitar `partial_revokes` ao iniciar, o servidor registra uma mensagem de erro e habilita `partial_revokes`.

- Para tentativas de desabilitar `partial_revokes` em tempo de execução, ocorre um erro e o valor `partial_revokes` permanece inalterado.

Para desabilitar `partial_revokes` quando existem restrições, as restrições devem ser removidas primeiro:

1. Determine quais contas têm revogações parciais:

   ```
   SELECT User, Host, User_attributes->>'$.Restrictions'
   FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
   ```

2. Para cada conta desse tipo, remova suas restrições de privilégio. Suponha que a etapa anterior mostre que a conta `u1` tem essas restrições:

   ```
   [{"Database": "world", "Privileges": ["INSERT", "DELETE"]
   ```

   A remoção da restrição pode ser feita de várias maneiras:

   - Atribua os privilégios globalmente, sem restrições:

     ```
     GRANT INSERT, DELETE ON *.* TO u1;
     ```

   - Atribua os privilégios ao nível do esquema:

     ```
     GRANT INSERT, DELETE ON world.* TO u1;
     ```

   - Retirar os privilégios globalmente (assumindo que eles não são mais necessários):

     ```
     REVOKE INSERT, DELETE ON *.* FROM u1;
     ```

   - Remova a conta em si (assumindo que ela não seja mais necessária):

     ```
     DROP USER u1;
     ```

Depois que todas as restrições de privilégio forem removidas, é possível desativar as revogações parciais:

```
SET PERSIST partial_revokes = OFF;
```

#### Reivindicações parciais e replicação

Em cenários de replicação, se o `partial_revokes` estiver habilitado em qualquer host, ele deve estar habilitado em todos os hosts. Caso contrário, as instruções `REVOKE` para revogar parcialmente um privilégio global não terão o mesmo efeito em todos os hosts em que a replicação ocorre, o que pode resultar em inconsistências ou erros na replicação.

Quando o `partial_revokes` está habilitado, uma sintaxe estendida é registrada no log binário para as instruções `GRANT`, incluindo o usuário atual que emitiu a instrução e seus papéis atualmente ativos. Se um usuário ou um papel registrado dessa maneira não existir na replica, o fio do aplicável de replicação para `GRANT` pára com um erro. Certifique-se de que todas as contas de usuário que emitem ou podem emitir instruções `GRANT` no servidor de origem da replicação também existam na replica e tenham o mesmo conjunto de papéis que têm na fonte.
