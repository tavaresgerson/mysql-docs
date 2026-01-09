### 8.2.12 Restrição de privilégios usando revogações parciais

É possível conceder privilégios que se aplicam globalmente se a variável de sistema `partial_revokes` estiver habilitada. Especificamente, para usuários que têm privilégios no nível global, `partial_revokes` permite que privilégios para esquemas específicos sejam revogados, mantendo os privilégios em vigor para outros esquemas. As restrições de privilégios impostas dessa forma podem ser úteis para a administração de contas que têm privilégios globais, mas não devem ter permissão para acessar certos esquemas. Por exemplo, é possível permitir que uma conta modifique qualquer tabela, exceto as do esquema `mysql`.

* Usando revogações parciais
* Revogações parciais versus concessões explícitas de esquema
* Desabilitando revogações parciais
* Revogações parciais e replicação

::: info Nota

Por simplicidade, as instruções `CREATE USER` mostradas aqui não incluem senhas. Para uso em produção, sempre atribua senhas para as contas.

:::

#### Usando Revogações Parciais

A variável de sistema `partial_revokes` controla se as restrições de privilégios podem ser aplicadas às contas. Por padrão, `partial_revokes` está desabilitada e as tentativas de revogar parcialmente privilégios globais produzem um erro:

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

`SET PERSIST` define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado para reinicializações subsequentes do servidor. Para alterar o valor para a instância MySQL em execução sem que ele seja carregado para reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe de SET para atribuição de variáveis”.

Com `partial_revokes` habilitada, a revogação parcial tem sucesso:

 `SHOW GRANTS` lista as revogações parciais como declarações `REVOKE` em sua saída. O resultado indica que `u1` tem privilégios globais de `SELECT` e `INSERT`, exceto que `INSERT` não pode ser exercido para tabelas no esquema `world`. Ou seja, o acesso de `u1` às tabelas `world` é de leitura apenas.

O servidor registra as restrições de privilégio implementadas por meio de revogações parciais na tabela `mysql.user` do sistema. Se uma conta tiver revogações parciais, o valor da coluna `User_attributes` terá um atributo `Restrictions`:

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

::: info Nota

Embora revogações parciais possam ser impostas para qualquer esquema, as restrições de privilégio no esquema `mysql` são particularmente úteis como parte de uma estratégia para impedir que contas regulares modifiquem contas de sistema. Consulte  Protegendo Contas de Sistema Contra Manipulação por Contas Regulares.

:::

As operações de revogação parcial estão sujeitas a estas condições:

* É possível usar revogações parciais para impor restrições em esquemas inexistentes, mas apenas se o privilégio revogado for concedido globalmente. Se um privilégio não for concedido globalmente, revogá-lo para um esquema inexistente produz um erro.
* As revogações parciais aplicam-se apenas ao nível do esquema. Não é possível usar revogações parciais para privilégios que se aplicam apenas globalmente (como `FILE` ou `BINLOG_ADMIN`), ou para privilégios de tabela, coluna ou rotina.
* Nas atribuições de privilégios, habilitar `partial_revokes` faz com que o MySQL interprete ocorrências de caracteres curinga `_` e `%` SQL não escapados em nomes de esquemas como caracteres literais, assim como se tivessem sido escapados como `_` e `\%`. Como isso altera a forma como o MySQL interpreta os privilégios, pode ser aconselhável evitar caracteres curinga não escapados em atribuições de privilégios para instalações onde `partial_revokes` pode estar habilitado.

Como mencionado anteriormente, as revogações parciais de privilégios de nível de esquema aparecem na saída `SHOW GRANTS` como declarações `REVOKE`. Isso difere da forma como `SHOW GRANTS` representa privilégios de nível de esquema "simples":

* Quando concedidos, os privilégios de nível de esquema são representados por suas próprias declarações `GRANT` na saída:

  ```
mysql> SELECT User, Host, User_attributes->>'$.Restrictions'
       FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
+------+------+------------------------------------------------------+
| User | Host | User_attributes->>'$.Restrictions'                   |
+------+------+------------------------------------------------------+
| u1   | %    | [{"Database": "world", "Privileges": ["INSERT"]}] |
+------+------+------------------------------------------------------+
```
* Quando revogados, os privilégios de nível de esquema simplesmente desaparecem da saída. Eles não aparecem como declarações `REVOKE`:

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

Quando um usuário concede um privilégio, qualquer restrição que o concedente tenha sobre o privilégio é herdada pelo beneficiário, a menos que o beneficiário já tenha o privilégio sem a restrição. Considere os seguintes dois usuários, um dos quais tem o privilégio global `SELECT`:

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

Suponha que um usuário administrativo `admin` tenha um privilégio global, mas parcialmente revogado, `SELECT`:

```
CREATE USER u1, u2;
GRANT SELECT ON *.* TO u2;
```

Se `admin` concede `SELECT` globalmente a `u1` e `u2`, o resultado difere para cada usuário:

* Se `admin` concede `SELECT` globalmente a `u1`, que não tem privilégio `SELECT` para começar, `u1` herda a restrição do privilégio de `admin`:

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
* Por outro lado, `u2` já possui um privilégio global `SELECT` sem restrição. `GRANT` só pode adicionar aos privilégios existentes de um beneficiário, não reduzi-los, então se `admin` concede `SELECT` globalmente a `u2`, `u2` não herda a restrição de `admin`:

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
Se uma declaração `GRANT` incluir uma cláusula `AS user`, as restrições de privilégio aplicadas são as da combinação de usuário/papel especificada pela cláusula, e não as do usuário que executa a declaração. Para informações sobre a cláusula `AS`, consulte a Seção 15.7.1.6, “Declaração GRANT”.

As restrições sobre novos privilégios concedidos a uma conta são adicionadas a quaisquer restrições existentes para essa conta:

```
  mysql> GRANT SELECT ON *.* TO u2;
  mysql> SHOW GRANTS FOR u2;
  +---------------------------------+
  | Grants for u2@%                 |
  +---------------------------------+
  | GRANT SELECT ON *.* TO `u2`@`%` |
  +---------------------------------+
  ```

A agregação de restrições de privilégio aplica-se tanto quando os privilégios são explicitamente revogados parcialmente (como acabou de ser mostrado) quanto quando as restrições são herdadas implicitamente do usuário que executa a declaração ou do usuário mencionado em uma cláusula `AS user`.

Se uma conta tem uma restrição de privilégio em um esquema:

* A conta não pode conceder a outras contas um privilégio no esquema restrito ou em qualquer objeto dentro dele.
* Outra conta que não tem a restrição pode conceder privilégios à conta restrita para o esquema restrito ou objetos dentro dele. Suponha que um usuário não restrito execute essas declarações:

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

A conta resultante tem esses privilégios, com a capacidade de realizar operações limitadas dentro do esquema restrito:

```
  CREATE USER u1;
  GRANT SELECT, INSERT, UPDATE ON *.* TO u1;
  REVOKE SELECT, INSERT, UPDATE ON mysql.* FROM u1;
  GRANT SELECT ON mysql.user TO u1;          -- grant table privilege
  GRANT SELECT(Host,User) ON mysql.db TO u1; -- grant column privileges
  ```

Se uma conta tiver uma restrição em um privilégio global, a restrição é removida por qualquer uma dessas ações:

* Conceder o privilégio globalmente à conta por uma conta que não tenha restrição no privilégio.
* Conceder o privilégio no nível do esquema.
* Revocar o privilégio globalmente.

Considere um usuário `u1` que possui vários privilégios globalmente, mas com restrições em `INSERT`, `UPDATE` e `DELETE`:

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

Conceder um privilégio globalmente a `u1` de uma conta sem restrição remove a restrição de privilégio. Por exemplo, para remover a restrição de `INSERT`:

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

Conceder um privilégio no nível do esquema a `u1` remove a restrição de privilégio. Por exemplo, para remover a restrição de `UPDATE`:

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

Revocar um privilégio global remove o privilégio, incluindo quaisquer restrições nele. Por exemplo, para remover a restrição de `DELETE` (com o custo de remover todo o acesso de `DELETE`):

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

Se uma conta tiver um privilégio tanto no nível global quanto no nível do esquema, você deve revogá-lo no nível do esquema duas vezes para efetuar uma revogação parcial. Suponha que `u1` tenha esses privilégios, onde `INSERT` é mantido tanto globalmente quanto no esquema `world`:

```
mysql> REVOKE DELETE ON *.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+-------------------------------------------------+
| Grants for u1@%                                 |
+-------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE ON *.* TO `u1`@`%` |
+-------------------------------------------------+
```

Revocando `INSERT` em `world` revoga o privilégio de nível do esquema (o `SHOW GRANTS` não exibe mais a declaração de `GRANT` de nível do esquema):

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

Revocando `INSERT` em `world` novamente realiza uma revogação parcial do privilégio global (o `SHOW GRANTS` agora inclui uma declaração de `REVOKE` de nível do esquema):

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+-----------------------------------------+
| Grants for u1@%                         |
+-----------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%` |
+-----------------------------------------+
```

#### Revogações Parciais Contra Regras de Esquema Explicitas
Português (Brasil):

Para fornecer acesso a contas para alguns esquemas, mas não para outros, as revogações parciais oferecem uma alternativa à abordagem de conceder explicitamente o acesso ao nível do esquema sem conceder privilégios globais. As duas abordagens têm vantagens e desvantagens diferentes.

Conceder privilégios ao nível do esquema e não privilégios globais:

* Adicionar um novo esquema: O esquema é inacessível para contas existentes por padrão. Para qualquer conta para a qual o esquema deve ser acessível, o DBA deve conceder acesso ao nível do esquema.
* Adicionar uma nova conta: O DBA deve conceder acesso ao nível do esquema para cada esquema para o qual a conta deve ter acesso.

Conceder privilégios globais em conjunto com revogações parciais:

* Adicionar um novo esquema: O esquema é acessível para contas existentes que têm privilégios globais. Para qualquer conta que o esquema deve ser inacessível, o DBA deve adicionar uma revogação parcial.
* Adicionar uma nova conta: O DBA deve conceder os privilégios globais, mais uma revogação parcial em cada esquema restrito.

A abordagem que usa a concessão explícita ao nível do esquema é mais conveniente para contas para as quais o acesso é limitado a alguns esquemas. A abordagem que usa revogações parciais é mais conveniente para contas com acesso amplo a todos os esquemas, exceto alguns.

#### Desativar Revogações Parciais

Uma vez ativadas, as `partial_revokes` não podem ser desativadas se qualquer conta tiver restrições de privilégio. Se existir alguma conta dessas, a desativação de `partial_revokes` falha:

* Para tentativas de desativar `partial_revokes` no início, o servidor registra uma mensagem de erro e ativa `partial_revokes`.
* Para tentativas de desativar `partial_revokes` no tempo de execução, ocorre um erro e o valor de `partial_revokes` permanece inalterado.

Para desativar `partial_revokes` quando as restrições existem, as restrições primeiro devem ser removidas:

1. Determinar quais contas têm revogações parciais:

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
2. Para cada conta dessas, remova suas restrições de privilégio. Suponha que o passo anterior mostre que a conta `u1` tem essas restrições:

A remoção de restrições de privilégios pode ser feita de várias maneiras:

* Atribuir os privilégios globalmente, sem restrições:

```
   SELECT User, Host, User_attributes->>'$.Restrictions'
   FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
   ```
* Atribuir os privilégios ao nível do esquema:

```
   [{"Database": "world", "Privileges": ["INSERT", "DELETE"]
   ```
* Revogar os privilégios globalmente (assumindo que eles não são mais necessários):

```
     GRANT INSERT, DELETE ON *.* TO u1;
     ```
* Remover a própria conta (assumindo que ela não é mais necessária):

```
     GRANT INSERT, DELETE ON world.* TO u1;
     ```

Após a remoção de todas as restrições de privilégios, é possível desabilitar revogações parciais:

```
     REVOKE INSERT, DELETE ON *.* FROM u1;
     ```

#### Revocações Parciais e Replicação

Em cenários de replicação, se `partial_revokes` estiver habilitado em qualquer host, ele deve estar habilitado em todos os hosts. Caso contrário, as declarações `REVOKE` para revogar parcialmente um privilégio global não terão o mesmo efeito para todos os hosts em que a replicação ocorre, o que pode resultar em inconsistências ou erros na replicação.

Quando `partial_revokes` está habilitado, uma sintaxe estendida é registrada no log binário para as declarações `GRANT`, incluindo o usuário atual que emitiu a declaração e seus papéis atualmente ativos. Se um usuário ou um papel registrado dessa maneira não existir na replica, o thread do aplicativo de replicação para:

```error
GRANT statement com um erro. Certifique-se de que todas as contas de usuário que emitem ou podem emitir declarações `GRANT` no servidor de origem da replicação também existam na replica e tenham o mesmo conjunto de papéis que têm na fonte.