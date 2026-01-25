#### 13.7.1.4 GRANT Statement

```sql
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list) ...
    ON [object_type] priv_level
    TO user [auth_option] [, user [auth_option ...
    [REQUIRE {NONE | tls_option AND] tls_option] ...}]
    [WITH {GRANT OPTION | resource_option} ...]

GRANT PROXY ON user
    TO user [, user] ...
    [WITH GRANT OPTION]

object_type: {
    TABLE
  | FUNCTION
  | PROCEDURE
}

priv_level: {
    *
  | *.*
  | db_name.*
  | db_name.tbl_name
  | tbl_name
  | db_name.routine_name
}

user:
    (see Section 6.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
  | IDENTIFIED BY PASSWORD 'auth_string'
}

tls_option: {
    SSL
  | X509
  | CIPHER 'cipher'
  | ISSUER 'issuer'
  | SUBJECT 'subject'
}

resource_option: {
  | MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
}
```

A instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") concede privilégios a contas de usuário MySQL. Existem diversos aspectos da instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), descritos nos tópicos a seguir:

* [Visão Geral do GRANT](grant.html#grant-overview "Visão Geral do GRANT")
* [Diretrizes de Citação de Objetos](grant.html#grant-quoting "Diretrizes de Citação de Objetos")
* [Privilégios Suportados pelo MySQL](grant.html#grant-privileges "Privilégios Suportados pelo MySQL")
* [Nomes de Conta e Senhas](grant.html#grant-accounts-passwords "Nomes de Conta e Senhas")
* [Privilégios Globais](grant.html#grant-global-privileges "Privilégios Globais")
* [Privilégios de Database](grant.html#grant-database-privileges "Privilégios de Database")
* [Privilégios de Table](grant.html#grant-table-privileges "Privilégios de Table")
* [Privilégios de Coluna](grant.html#grant-column-privileges "Privilégios de Coluna")
* [Privilégios de Rotinas Armazenadas (Stored Routine)](grant.html#grant-routine-privileges "Privilégios de Rotinas Armazenadas")
* [Privilégios de Usuário Proxy](grant.html#grant-proxy-privileges "Privilégios de Usuário Proxy")
* [Criação Implícita de Conta](grant.html#grant-account-creation "Criação Implícita de Conta")
* [Outras Características da Conta](grant.html#grant-other-characteristics "Outras Características da Conta")
* [Versões MySQL e SQL Padrão do GRANT](grant.html#grant-mysql-vs-standard-sql "Versões MySQL e SQL Padrão do GRANT")

##### Visão Geral do GRANT

A instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") concede privilégios a contas de usuário MySQL.

Para conceder um privilégio com [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), você deve ter o privilégio [`GRANT OPTION`](privileges-provided.html#priv_grant-option), e você deve ter os privilégios que está concedendo. (Alternativamente, se você tiver o privilégio [`UPDATE`](privileges-provided.html#priv_update) para as grant tables no Database de sistema `mysql`, você pode conceder qualquer privilégio a qualquer conta.) Quando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) está habilitada, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") adicionalmente requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

A instrução [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") está relacionada a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e permite que os administradores removam privilégios de conta. Consulte [Seção 13.7.1.6, “REVOKE Statement”](revoke.html "13.7.1.6 REVOKE Statement").

Cada nome de conta usa o formato descrito em [Seção 6.2.4, “Especificando Nomes de Conta”](account-names.html "6.2.4 Especificando Nomes de Conta"). Por exemplo:

```sql
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
```

A parte do host name da conta, se omitida, assume o padrão `'%'`.

Normalmente, um administrador de Database usa primeiro [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") para criar uma conta e definir suas características que não são privilégios, como sua senha, se usa conexões seguras e limites de acesso aos recursos do servidor, e depois usa [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para definir seus privilégios. [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") pode ser usado para alterar as características que não são privilégios de contas existentes. Por exemplo:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

Note

Os exemplos mostrados aqui não incluem a cláusula `IDENTIFIED`. Presume-se que você estabeleça senhas com [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") no momento da criação da conta para evitar a criação de contas inseguras.

Note

Se uma conta nomeada em uma instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") ainda não existir, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") poderá criá-la sob as condições descritas posteriormente na discussão sobre o modo SQL [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user). Também é possível usar [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para especificar características de conta que não são privilégios, como se ela usa conexões seguras e limites de acesso aos recursos do servidor.

No entanto, o uso de [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para criar contas ou definir características que não são privilégios está obsoleto no MySQL 5.7. Em vez disso, execute essas tarefas usando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement").

A partir do programa [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement") responde com `Query OK, 0 rows affected` quando executado com sucesso. Para determinar quais privilégios resultam da operação, use [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"). Consulte [Seção 13.7.5.21, “SHOW GRANTS Statement”](show-grants.html "13.7.5.21 SHOW GRANTS Statement").

Importante

Sob algumas circunstâncias, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico como `~/.mysql_history`, o que significa que senhas em texto simples podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte [Seção 6.1.2.3, “Senhas e Logging”](password-logging.html "6.1.2.3 Senhas e Logging"). Para informações semelhantes sobre logging do lado do cliente, consulte [Seção 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").

[`GRANT`](grant.html "13.7.1.4 GRANT Statement") suporta host names de até 60 caracteres. User names podem ter até 32 caracteres. Nomes de Database, Table, coluna e rotina podem ter até 64 caracteres.

Aviso

*Não tente alterar o comprimento permitido para user names alterando a tabela de sistema `mysql.user`. Fazer isso resulta em comportamento imprevisível que pode até impossibilitar o login dos usuários no servidor MySQL*. Nunca altere a estrutura das tables no Database de sistema `mysql` de qualquer maneira, exceto por meio do procedimento descrito na [Seção 2.10, “Atualizando MySQL”](upgrading.html "2.10 Atualizando MySQL").

##### Diretrizes de Citação de Objetos

Vários objetos dentro das instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") estão sujeitos a citação (delimitação), embora a citação seja opcional em muitos casos: Nomes de Conta, Database, Table, coluna e rotina. Por exemplo, se um valor *`user_name`* ou *`host_name`* em um nome de conta for legal como um identificador não citado, você não precisa citá-lo. No entanto, aspas são necessárias para especificar uma string *`user_name`* contendo caracteres especiais (como `-`), ou uma string *`host_name`* contendo caracteres especiais ou curingas como `%` (por exemplo, `'test-user'@'%.com'`). Cite o user name e o host name separadamente.

Para especificar valores citados:

* Cite nomes de Database, Table, coluna e rotina como identificadores.

* Cite user names e host names como identificadores ou como strings.

* Cite senhas como strings.

Para diretrizes de citação de strings e identificadores, consulte [Seção 9.1.1, “Literais de String”](string-literals.html "9.1.1 Literais de String"), e [Seção 9.2, “Nomes de Objeto de Schema”](identifiers.html "9.2 Schema Object Names").

Os curingas `_` e `%` são permitidos ao especificar nomes de Database em instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") que concedem privilégios no nível do Database (`GRANT ... ON db_name.*`). Isso significa, por exemplo, que para usar um caractere `_` como parte de um nome de Database, especifique-o usando o caractere de escape `\` como `\_` na instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), para evitar que o usuário possa acessar Databases adicionais que correspondam ao padrão curinga (por exemplo, `` GRANT ... ON `foo\_bar`.* TO ... ``).

A emissão de múltiplas instruções `GRANT` contendo curingas pode não ter o efeito esperado nas instruções DML; ao resolver concessões envolvendo curingas, o MySQL leva em consideração apenas a primeira concessão correspondente. Em outras palavras, se um usuário tiver duas concessões de nível de Database usando curingas que correspondam ao mesmo Database, a concessão que foi criada primeiro é aplicada. Considere o Database `db` e a Table `t` criados usando as instruções mostradas aqui:

```sql
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Em seguida (assumindo que a conta atual é a conta `root` do MySQL ou outra conta com os privilégios necessários), criamos um usuário `u` e emitimos duas instruções `GRANT` contendo curingas, assim:

```sql
mysql> CREATE USER u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT SELECT ON `d_`.* TO u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT INSERT ON `d%`.* TO u;
Query OK, 0 rows affected (0.00 sec)

mysql> EXIT
```

```sql
Bye
```

Se encerrarmos a sessão e fizermos login novamente com o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), desta vez como **u**, veremos que esta conta tem apenas o privilégio fornecido pela primeira concessão correspondente, mas não a segunda:

```sql
$> mysql -uu -hlocalhost
```

```sql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 5.7.52-tr Source distribution

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input
statement.

mysql> TABLE db.t;
+------+
| c    |
+------+
|    1 |
+------+
1 row in set (0.00 sec)

mysql> INSERT INTO db.t VALUES ROW(2);
ERROR 1142 (42000): INSERT command denied to user 'u'@'localhost' for table 't'
```

Quando um nome de Database não é usado para conceder privilégios no nível do Database, mas como um qualificador para conceder privilégios a algum outro objeto, como uma Table ou rotina (por exemplo, `GRANT ... ON db_name.tbl_name`), o MySQL interpreta os caracteres curinga como caracteres literais.

##### Privilégios Suportados pelo MySQL

A tabela a seguir resume os tipos de privilégio *`priv_type`* permitidos que podem ser especificados para as instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), e os níveis nos quais cada privilégio pode ser concedido. Para informações adicionais sobre cada privilégio, consulte [Seção 6.2.2, “Privilégios Fornecidos pelo MySQL”](privileges-provided.html "6.2.2 Privilégios Fornecidos pelo MySQL").

**Tabela 13.8 Privilégios Permitidos para GRANT e REVOKE**

<table><thead><tr> <th>Privilégio</th> <th>Significado e Níveis de Concessão</th> </tr></thead><tbody><tr> <td><code>ALL [PRIVILEGES]</code></td> <td>Concede todos os privilégios no nível de acesso especificado, exceto <code>GRANT OPTION</code> e <code>PROXY</code>.</td> </tr><tr> <td><code>ALTER</code></td> <td>Permite o uso de <code>ALTER TABLE</code>. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>ALTER ROUTINE</code></td> <td>Permite que rotinas armazenadas sejam alteradas ou descartadas (dropped). Níveis: Global, Database, Rotina.</td> </tr><tr> <td><code>CREATE</code></td> <td>Permite a criação de Database e Table. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>CREATE ROUTINE</code></td> <td>Permite a criação de rotinas armazenadas. Níveis: Global, Database.</td> </tr><tr> <td><code>CREATE TABLESPACE</code></td> <td>Permite que tablespaces e grupos de arquivos de log sejam criados, alterados ou descartados. Nível: Global.</td> </tr><tr> <td><code>CREATE TEMPORARY TABLES</code></td> <td>Permite o uso de <code>CREATE TEMPORARY TABLE</code>. Níveis: Global, Database.</td> </tr><tr> <td><code>CREATE USER</code></td> <td>Permite o uso de <code>CREATE USER</code>, <code>DROP USER</code>, <code>RENAME USER</code>, e <code>REVOKE ALL PRIVILEGES</code>. Nível: Global.</td> </tr><tr> <td><code>CREATE VIEW</code></td> <td>Permite que views sejam criadas ou alteradas. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>DELETE</code></td> <td>Permite o uso de <code>DELETE</code>. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>DROP</code></td> <td>Permite que Databases, Tables e views sejam descartados. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>EVENT</code></td> <td>Permite o uso de eventos para o Event Scheduler. Níveis: Global, Database.</td> </tr><tr> <td><code>EXECUTE</code></td> <td>Permite que o usuário execute rotinas armazenadas. Níveis: Global, Database, Rotina.</td> </tr><tr> <td><code>FILE</code></td> <td>Permite que o usuário faça com que o servidor leia ou escreva arquivos. Nível: Global.</td> </tr><tr> <td><code>GRANT OPTION</code></td> <td>Permite que privilégios sejam concedidos ou removidos de outras contas. Níveis: Global, Database, Table, Rotina, Proxy.</td> </tr><tr> <td><code>INDEX</code></td> <td>Permite que Indexes sejam criados ou descartados. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>INSERT</code></td> <td>Permite o uso de <code>INSERT</code>. Níveis: Global, Database, Table, Coluna.</td> </tr><tr> <td><code>LOCK TABLES</code></td> <td>Permite o uso de <code>LOCK TABLES</code> em Tables para as quais você tem o privilégio <code>SELECT</code>. Níveis: Global, Database.</td> </tr><tr> <td><code>PROCESS</code></td> <td>Permite que o usuário veja todos os processos com <code>SHOW PROCESSLIST</code>. Nível: Global.</td> </tr><tr> <td><code>PROXY</code></td> <td>Permite a função de proxy de usuário. Nível: De usuário para usuário.</td> </tr><tr> <td><code>REFERENCES</code></td> <td>Permite a criação de chaves estrangeiras (foreign keys). Níveis: Global, Database, Table, Coluna.</td> </tr><tr> <td><code>RELOAD</code></td> <td>Permite o uso de operações <code>FLUSH</code>. Nível: Global.</td> </tr><tr> <td><code>REPLICATION CLIENT</code></td> <td>Permite que o usuário pergunte onde estão os servidores source ou replica. Nível: Global.</td> </tr><tr> <td><code>REPLICATION SLAVE</code></td> <td>Permite que réplicas leiam eventos de log binário do source. Nível: Global.</td> </tr><tr> <td><code>SELECT</code></td> <td>Permite o uso de <code>SELECT</code>. Níveis: Global, Database, Table, Coluna.</td> </tr><tr> <td><code>SHOW DATABASES</code></td> <td>Permite que <code>SHOW DATABASES</code> mostre todos os Databases. Nível: Global.</td> </tr><tr> <td><code>SHOW VIEW</code></td> <td>Permite o uso de <code>SHOW CREATE VIEW</code>. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>SHUTDOWN</code></td> <td>Permite o uso de <span><strong>mysqladmin shutdown</strong></span>. Nível: Global.</td> </tr><tr> <td><code>SUPER</code></td> <td>Permite o uso de outras operações administrativas, como <code>CHANGE MASTER TO</code>, <code>KILL</code>, <code>PURGE BINARY LOGS</code>, <code>SET GLOBAL</code> e o comando <span><strong>mysqladmin debug</strong></span>. Nível: Global.</td> </tr><tr> <td><code>TRIGGER</code></td> <td>Permite operações de Trigger. Níveis: Global, Database, Table.</td> </tr><tr> <td><code>UPDATE</code></td> <td>Permite o uso de <code>UPDATE</code>. Níveis: Global, Database, Table, Coluna.</td> </tr><tr> <td><code>USAGE</code></td> <td>Sinônimo de “nenhum privilégio”.</td> </tr></tbody></table>

Um Trigger está associado a uma Table. Para criar ou descartar um Trigger, você deve ter o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger) para a Table, não para o Trigger.

Em instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), o privilégio [`ALL [PRIVILEGES]`](privileges-provided.html#priv_all) ou [`PROXY`](privileges-provided.html#priv_proxy) deve ser nomeado sozinho e não pode ser especificado junto com outros privilégios. [`ALL [PRIVILEGES]`](privileges-provided.html#priv_all) representa todos os privilégios disponíveis para o nível no qual os privilégios devem ser concedidos, exceto os privilégios [`GRANT OPTION`](privileges-provided.html#priv_grant-option) e [`PROXY`](privileges-provided.html#priv_proxy).

[`USAGE`](privileges-provided.html#priv_usage) pode ser especificado para criar um usuário que não tem privilégios, ou para especificar as cláusulas `REQUIRE` ou `WITH` para uma conta sem alterar seus privilégios existentes. (No entanto, o uso de [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para definir características que não são privilégios está obsoleto.)

As informações da conta MySQL são armazenadas nas Tables do Database de sistema `mysql`. Para detalhes adicionais, consulte [Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”](access-control.html "6.2 Controle de Acesso e Gerenciamento de Contas"), que discute extensivamente o Database de sistema `mysql` e o sistema de controle de acesso.

Se as grant tables contiverem linhas de privilégio que contenham nomes de Database ou Table com maiúsculas e minúsculas misturadas e a variável de sistema [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) estiver definida para um valor não zero, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") não poderá ser usado para revogar esses privilégios. É necessário manipular as grant tables diretamente. ([`GRANT`](grant.html "13.7.1.4 GRANT Statement") não cria tais linhas quando [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) está definido, mas tais linhas podem ter sido criadas antes de definir essa variável.)

Os privilégios podem ser concedidos em vários níveis, dependendo da sintaxe usada para a cláusula `ON`. Para [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), a mesma sintaxe `ON` especifica quais privilégios remover.

Para os níveis global, Database, Table e rotina, [`GRANT ALL`](grant.html "13.7.1.4 GRANT Statement") atribui apenas os privilégios que existem no nível que você está concedendo. Por exemplo, `GRANT ALL ON db_name.*` é uma instrução de nível de Database, portanto, não concede nenhum privilégio somente global, como [`FILE`](privileges-provided.html#priv_file). Conceder [`ALL`](privileges-provided.html#priv_all) não atribui o privilégio [`GRANT OPTION`](privileges-provided.html#priv_grant-option) ou [`PROXY`](privileges-provided.html#priv_proxy).

A cláusula *`object_type`*, se presente, deve ser especificada como `TABLE`, `FUNCTION` ou `PROCEDURE` quando o objeto seguinte for uma Table, uma stored function ou uma stored procedure.

Os privilégios que um usuário possui para um Database, Table, coluna ou rotina são formados aditivamente como o [`OR`](logical-operators.html#operator_or) lógico dos privilégios da conta em cada um dos níveis de privilégio, incluindo o nível global. Não é possível negar um privilégio concedido em um nível superior pela ausência desse privilégio em um nível inferior. Por exemplo, esta instrução concede os privilégios [`SELECT`](privileges-provided.html#priv_select) e [`INSERT`](privileges-provided.html#priv_insert) globalmente:

```sql
GRANT SELECT, INSERT ON *.* TO u1;
```

Os privilégios concedidos globalmente se aplicam a todos os Databases, Tables e colunas, mesmo que não tenham sido concedidos em nenhum desses níveis inferiores.

Detalhes do procedimento de verificação de privilégios são apresentados na [Seção 6.2.6, “Controle de Acesso, Etapa 2: Verificação de Requisição”](request-access.html "6.2.6 Controle de Acesso, Etapa 2: Verificação de Requisição").

Se você estiver usando privilégios de Table, coluna ou rotina para até mesmo um usuário, o servidor examina os privilégios de Table, coluna e rotina para todos os usuários, e isso retarda um pouco o MySQL. Da mesma forma, se você limitar o número de Queries, Updates ou conexões para quaisquer usuários, o servidor deve monitorar esses valores.

O MySQL permite que você conceda privilégios em Databases ou Tables que não existem. Para Tables, os privilégios a serem concedidos devem incluir o privilégio [`CREATE`](privileges-provided.html#priv_create). *Este comportamento é intencional* e tem como objetivo permitir que o administrador do Database prepare contas de usuário e privilégios para Databases ou Tables que serão criados posteriormente.

Importante

*O MySQL não revoga automaticamente quaisquer privilégios quando você descarta um Database ou Table*. No entanto, se você descartar uma rotina, quaisquer privilégios de nível de rotina concedidos para essa rotina serão revogados.

##### Nomes de Conta e Senhas

Um valor *`user`* em uma instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") indica uma conta MySQL à qual a instrução se aplica. Para acomodar a concessão de direitos a usuários de hosts arbitrários, o MySQL suporta a especificação do valor *`user`* no formato `'user_name'@'host_name'`.

Você pode especificar curingas no host name. Por exemplo, `'user_name'@'%.example.com'` se aplica a *`user_name`* para qualquer host no domínio `example.com`, e `'user_name'@'198.51.100.%'` se aplica a *`user_name`* para qualquer host na sub-rede classe C `198.51.100`.

A forma simples `'user_name'` é um sinônimo para `'user_name'@'%'`.

*O MySQL não suporta curingas em user names*. Para se referir a um usuário anônimo, especifique uma conta com um user name vazio com a instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"):

```sql
GRANT ALL ON test.* TO ''@'localhost' ...;
```

Neste caso, qualquer usuário que se conecte do host local com a senha correta para o usuário anônimo tem acesso permitido, com os privilégios associados à conta de usuário anônimo.

Para informações adicionais sobre user name e host name em nomes de conta, consulte [Seção 6.2.4, “Especificando Nomes de Conta”](account-names.html "6.2.4 Especificando Nomes de Conta").

Aviso

Se você permitir que usuários anônimos locais se conectem ao servidor MySQL, você também deve conceder privilégios a todos os usuários locais como `'user_name'@'localhost'`. Caso contrário, a conta de usuário anônimo para `localhost` na tabela de sistema `mysql.user` é usada quando usuários nomeados tentam fazer login no servidor MySQL a partir da máquina local. Para detalhes, consulte [Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”](connection-access.html "6.2.5 Controle de Acesso, Etapa 1: Verificação de Conexão").

Para determinar se este problema se aplica a você, execute a seguinte Query, que lista quaisquer usuários anônimos:

```sql
SELECT Host, User FROM mysql.user WHERE User='';
```

Para evitar o problema recém-descrito, exclua a conta de usuário anônimo local usando esta instrução:

```sql
DROP USER ''@'localhost';
```

Para a sintaxe [`GRANT`](grant.html "13.7.1.4 GRANT Statement") que permite que um valor *`auth_option`* siga um valor *`user`*, *`auth_option`* começa com `IDENTIFIED` e indica como a conta se autentica, especificando um plugin de autenticação de conta, credenciais (por exemplo, uma senha) ou ambos. A sintaxe da cláusula *`auth_option`* é a mesma da instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). Para detalhes, consulte [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Note

O uso de [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para definir características de autenticação de conta está obsoleto no MySQL 5.7. Em vez disso, estabeleça ou altere as características de autenticação usando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Espere que essa capacidade do [`GRANT`](grant.html "13.7.1.4 GRANT Statement") seja removida em uma futura versão do MySQL.

Quando `IDENTIFIED` está presente e você tem o privilégio de concessão global ([`GRANT OPTION`](privileges-provided.html#priv_grant-option)), qualquer senha especificada se torna a nova senha para a conta, mesmo que a conta exista e já tenha uma senha. Sem `IDENTIFIED`, a senha da conta permanece inalterada.

##### Privilégios Globais

Privilégios globais são administrativos ou se aplicam a todos os Databases em um determinado servidor. Para atribuir privilégios globais, use a sintaxe `ON *.*`:

```sql
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

Os privilégios [`CREATE TABLESPACE`](privileges-provided.html#priv_create-tablespace), [`CREATE USER`](privileges-provided.html#priv_create-user), [`FILE`](privileges-provided.html#priv_file), [`PROCESS`](privileges-provided.html#priv_process), [`RELOAD`](privileges-provided.html#priv_reload), [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client), [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave), [`SHOW DATABASES`](privileges-provided.html#priv_show-databases), [`SHUTDOWN`](privileges-provided.html#priv_shutdown) e [`SUPER`](privileges-provided.html#priv_super) são administrativos e só podem ser concedidos globalmente.

Outros privilégios podem ser concedidos globalmente ou em níveis mais específicos.

[`GRANT OPTION`](privileges-provided.html#priv_grant-option) concedido no nível global para qualquer privilégio global se aplica a todos os privilégios globais.

O MySQL armazena privilégios globais na tabela de sistema `mysql.user`.

##### Privilégios de Database

Privilégios de Database se aplicam a todos os objetos em um determinado Database. Para atribuir privilégios de nível de Database, use a sintaxe `ON db_name.*`:

```sql
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

Se você usar a sintaxe `ON *` (em vez de `ON *.*`), os privilégios serão atribuídos no nível de Database para o Database padrão. Ocorre um erro se não houver um Database padrão.

Os privilégios [`CREATE`](privileges-provided.html#priv_create), [`DROP`](privileges-provided.html#priv_drop), [`EVENT`](privileges-provided.html#priv_event), [`GRANT OPTION`](privileges-provided.html#priv_grant-option), [`LOCK TABLES`](privileges-provided.html#priv_lock-tables) e [`REFERENCES`](privileges-provided.html#priv_references) podem ser especificados no nível do Database. Privilégios de Table ou rotina também podem ser especificados no nível do Database, caso em que se aplicam a todas as Tables ou rotinas no Database.

O MySQL armazena privilégios de Database na tabela de sistema `mysql.db`.

##### Privilégios de Table

Privilégios de Table se aplicam a todas as colunas em uma determinada Table. Para atribuir privilégios de nível de Table, use a sintaxe `ON db_name.tbl_name`:

```sql
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

Se você especificar *`tbl_name`* em vez de *`db_name.tbl_name`*, a instrução se aplica a *`tbl_name`* no Database padrão. Ocorre um erro se não houver um Database padrão.

Os valores *`priv_type`* permitidos no nível de Table são [`ALTER`](privileges-provided.html#priv_alter), [`CREATE VIEW`](privileges-provided.html#priv_create-view), [`CREATE`](privileges-provided.html#priv_create), [`DELETE`](privileges-provided.html#priv_delete), [`DROP`](privileges-provided.html#priv_drop), [`GRANT OPTION`](privileges-provided.html#priv_grant-option), [`INDEX`](privileges-provided.html#priv_index), [`INSERT`](privileges-provided.html#priv_insert), [`REFERENCES`](privileges-provided.html#priv_references), [`SELECT`](privileges-provided.html#priv_select), [`SHOW VIEW`](privileges-provided.html#priv_show-view), [`TRIGGER`](privileges-provided.html#priv_trigger) e [`UPDATE`](privileges-provided.html#priv_update).

Privilégios de nível de Table se aplicam a Tables base e views. Eles não se aplicam a Tables criadas com [`CREATE TEMPORARY TABLE`](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement"), mesmo que os nomes das Tables correspondam. Para obter informações sobre privilégios de Table `TEMPORARY`, consulte [Seção 13.1.18.2, “CREATE TEMPORARY TABLE Statement”](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

O MySQL armazena privilégios de Table na tabela de sistema `mysql.tables_priv`.

##### Privilégios de Coluna

Privilégios de coluna se aplicam a colunas únicas em uma determinada Table. Cada privilégio a ser concedido no nível de coluna deve ser seguido pela coluna ou colunas, entre parênteses.

```sql
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

Os valores *`priv_type`* permitidos para uma coluna (ou seja, quando você usa uma cláusula *`column_list`*) são [`INSERT`](privileges-provided.html#priv_insert), [`REFERENCES`](privileges-provided.html#priv_references), [`SELECT`](privileges-provided.html#priv_select) e [`UPDATE`](privileges-provided.html#priv_update).

O MySQL armazena privilégios de coluna na tabela de sistema `mysql.columns_priv`.

##### Privilégios de Rotinas Armazenadas

Os privilégios [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), [`EXECUTE`](privileges-provided.html#priv_execute) e [`GRANT OPTION`](privileges-provided.html#priv_grant-option) se aplicam a rotinas armazenadas (procedures e functions). Eles podem ser concedidos nos níveis global e de Database. Exceto por [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), esses privilégios podem ser concedidos no nível de rotina para rotinas individuais.

```sql
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

Os valores *`priv_type`* permitidos no nível de rotina são [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), [`EXECUTE`](privileges-provided.html#priv_execute) e [`GRANT OPTION`](privileges-provided.html#priv_grant-option). [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine) não é um privilégio de nível de rotina porque você deve ter o privilégio no nível global ou de Database para criar uma rotina em primeiro lugar.

O MySQL armazena privilégios de nível de rotina na tabela de sistema `mysql.procs_priv`.

##### Privilégios de Usuário Proxy

O privilégio [`PROXY`](privileges-provided.html#priv_proxy) permite que um usuário seja um proxy para outro. O usuário proxy se passa ou assume a identidade do usuário proxied; ou seja, ele assume os privilégios do usuário proxied.

```sql
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

Quando [`PROXY`](privileges-provided.html#priv_proxy) é concedido, ele deve ser o único privilégio nomeado na instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), a cláusula `REQUIRE` não pode ser fornecida, e a única opção `WITH` permitida é `WITH GRANT OPTION`.

A função de proxy requer que o usuário proxy se autentique através de um plugin que retorne o nome do usuário proxied ao servidor quando o usuário proxy se conecta, e que o usuário proxy tenha o privilégio `PROXY` para o usuário proxied. Para detalhes e exemplos, consulte [Seção 6.2.14, “Usuários Proxy”](proxy-users.html "6.2.14 Usuários Proxy").

O MySQL armazena privilégios de proxy na tabela de sistema `mysql.proxies_priv`.

##### Criação Implícita de Conta

Se uma conta nomeada em uma instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") não existir, a ação tomada depende do modo SQL [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user):

* Se [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) não estiver habilitado, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") cria a conta. *Isso é muito inseguro* a menos que você especifique uma senha não vazia usando `IDENTIFIED BY`.

* Se [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) estiver habilitado, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") falha e não cria a conta, a menos que você especifique uma senha não vazia usando `IDENTIFIED BY` ou nomeie um plugin de autenticação usando `IDENTIFIED WITH`.

Se a conta já existir, `IDENTIFIED WITH` é proibido porque se destina apenas ao uso na criação de novas contas.

##### Outras Características da Conta

O MySQL pode verificar atributos de certificado X.509 além da autenticação usual baseada no user name e nas credenciais. Para informações básicas sobre o uso de SSL com MySQL, consulte [Seção 6.3, “Usando Conexões Criptografadas”](encrypted-connections.html "6.3 Usando Conexões Criptografadas").

A cláusula opcional `REQUIRE` especifica opções relacionadas a SSL para uma conta MySQL. A sintaxe é a mesma da instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). Para detalhes, consulte [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Note

O uso de [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para definir características SSL de conta está obsoleto no MySQL 5.7. Em vez disso, estabeleça ou altere as características SSL usando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Espere que essa capacidade do [`GRANT`](grant.html "13.7.1.4 GRANT Statement") seja removida em uma futura versão do MySQL.

A cláusula opcional `WITH` é usada para estes propósitos:

* Para permitir que um usuário conceda privilégios a outros usuários
* Para especificar limites de recursos para um usuário

A cláusula `WITH GRANT OPTION` dá ao usuário a capacidade de conceder a outros usuários quaisquer privilégios que o usuário tenha no nível de privilégio especificado.

Para conceder o privilégio [`GRANT OPTION`](privileges-provided.html#priv_grant-option) a uma conta sem alterar seus privilégios de outra forma, faça o seguinte:

```sql
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Tenha cuidado com quem você concede o privilégio [`GRANT OPTION`] porque dois usuários com privilégios diferentes podem ser capazes de combinar privilégios!

Você não pode conceder a outro usuário um privilégio que você mesmo não tem; o privilégio [`GRANT OPTION`] permite que você atribua apenas aqueles privilégios que você mesmo possui.

Esteja ciente de que quando você concede a um usuário o privilégio [`GRANT OPTION`] em um nível de privilégio específico, quaisquer privilégios que o usuário possua (ou possa receber no futuro) nesse nível também podem ser concedidos por esse usuário a outros usuários. Suponha que você conceda a um usuário o privilégio [`INSERT`] em um Database. Se você então conceder o privilégio [`SELECT`] no Database e especificar `WITH GRANT OPTION`, esse usuário pode conceder a outros usuários não apenas o privilégio [`SELECT`], mas também [`INSERT`]. Se você então conceder o privilégio [`UPDATE`] ao usuário no Database, o usuário poderá conceder [`INSERT`], [`SELECT`] e [`UPDATE`].

Para um usuário não administrativo, você não deve conceder o privilégio [`ALTER`] globalmente ou para o Database de sistema `mysql`. Se você fizer isso, o usuário pode tentar subverter o sistema de privilégios renomeando Tables!

Para informações adicionais sobre riscos de segurança associados a privilégios específicos, consulte [Seção 6.2.2, “Privilégios Fornecidos pelo MySQL”](privileges-provided.html "6.2.2 Privilégios Fornecidos pelo MySQL").

É possível definir limites no uso de recursos do servidor por uma conta, conforme discutido na [Seção 6.2.16, “Configurando Limites de Recursos da Conta”](user-resources.html "6.2.16 Configurando Limites de Recursos da Conta"). Para fazer isso, use uma cláusula `WITH` que especifique um ou mais valores *`resource_option`*. Limites não especificados mantêm seus valores atuais. A sintaxe é a mesma da instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). Para detalhes, consulte [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Note

O uso de [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para definir limites de recursos da conta está obsoleto no MySQL 5.7. Em vez disso, estabeleça ou altere os limites de recursos usando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Espere que essa capacidade do [`GRANT`](grant.html "13.7.1.4 GRANT Statement") seja removida em uma futura versão do MySQL.

##### Versões MySQL e SQL Padrão do GRANT

As maiores diferenças entre as versões MySQL e SQL Padrão do [`GRANT`](grant.html "13.7.1.4 GRANT Statement") são:

* O MySQL associa privilégios à combinação de um host name e user name e não apenas a um user name.

* O SQL Padrão não possui privilégios globais ou de nível de Database, nem suporta todos os tipos de privilégio que o MySQL suporta.

* O MySQL não suporta o privilégio `UNDER` do SQL Padrão.

* Os privilégios do SQL Padrão são estruturados de maneira hierárquica. Se você remover um usuário, todos os privilégios concedidos a ele são revogados. Isso também é verdade no MySQL se você usar [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"). Consulte [Seção 13.7.1.3, “DROP USER Statement”](drop-user.html "13.7.1.3 DROP USER Statement").

* No SQL Padrão, quando você descarta uma Table, todos os privilégios para a Table são revogados. No SQL Padrão, quando você revoga um privilégio, todos os privilégios que foram concedidos com base nesse privilégio também são revogados. No MySQL, os privilégios podem ser descartados com as instruções [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") ou [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement").

* No MySQL, é possível ter o privilégio [`INSERT`](privileges-provided.html#priv_insert) para apenas algumas das colunas em uma Table. Neste caso, você ainda pode executar instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") na Table, desde que insira valores apenas para aquelas colunas para as quais você tem o privilégio [`INSERT`]. As colunas omitidas são definidas para seus valores Default implícitos se o modo SQL estrito não estiver habilitado. No modo estrito, a instrução é rejeitada se alguma das colunas omitidas não tiver um valor Default. (O SQL Padrão exige que você tenha o privilégio [`INSERT`] em todas as colunas.) Para obter informações sobre o modo SQL estrito e valores Default implícitos, consulte [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html "5.1.10 Server SQL Modes"), e [Seção 11.6, “Valores Default de Tipo de Dados”](data-type-defaults.html "11.6 Data Type Default Values").