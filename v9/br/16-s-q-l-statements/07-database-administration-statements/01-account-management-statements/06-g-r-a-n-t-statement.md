#### 15.7.1.6 Declaração `GRANT`

```
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    TO user_or_role [, user_or_role] ...
    [WITH GRANT OPTION]
    [AS user
        [WITH ROLE
            DEFAULT
          | NONE
          | ALL
          | ALL EXCEPT role [, role ] ...
          | role [, role ] ...
        ]
    ]
}

GRANT PROXY ON user_or_role
    TO user_or_role [, user_or_role] ...
    [WITH GRANT OPTION]

GRANT role [, role] ...
    TO user_or_role [, user_or_role] ...
    [WITH ADMIN OPTION]

object_type: {
    TABLE
  | EVENT
  | FUNCTION
  | LIBRARY
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

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”)
}
```

A declaração `GRANT` atribui privilégios e papéis às contas e papéis de usuário do MySQL. Existem vários aspectos da declaração `GRANT`, descritos nos seguintes tópicos:

* Visão Geral Geral da Declaração `GRANT`
* Diretrizes para Citação de Objetos
* Nomes de Conta
* Privilegios Suportáveis pelo MySQL
* Privilegios Globais
* Privilegios de Banco de Dados
* Privilegios de Tabela
* Privilegios de Coluna
* Privilegios de Rotina Armazenada
* Privilegios de Usuário Proxy
* Atribuição de Papéis
* A Cláusula `AS` e Restrições de Privilegio
* Outras Características da Conta
* Versões de GRANT do MySQL e SQL Padrão

##### Visão Geral da Declaração `GRANT`

A declaração `GRANT` permite que os administradores do sistema atribuam privilégios e papéis, que podem ser concedidos a contas e papéis de usuário. Essas restrições de sintaxe se aplicam:

* A declaração `GRANT` não pode misturar a concessão de privilégios e papéis na mesma declaração. Uma declaração `GRANT` dada deve conceder privilégios ou papéis.

* A cláusula `ON` distingue se a declaração concede privilégios ou papéis:

  + Com `ON`, a declaração concede privilégios.

  + Sem `ON`, a declaração concede papéis.

  + É permitido atribuir tanto privilégios quanto papéis a uma conta, mas você deve usar declarações `GRANT` separadas, cada uma com sintaxe apropriada para o que deve ser concedido.

Para mais informações sobre papéis, consulte a Seção 8.2.10, “Usando Papéis”.

Para conceder um privilégio com `GRANT`, você deve ter o privilégio `GRANT OPTION` e você deve ter os privilégios que está concedendo. (Alternativamente, se você tiver o privilégio `UPDATE` para as tabelas de concessão no esquema do sistema `mysql`, você pode conceder qualquer conta qualquer privilégio.) Quando a variável de sistema `read_only` está habilitada, `GRANT` requer adicionalmente o privilégio `CONNECTION_ADMIN` (ou o privilégio `SUPER` desatualizado).

A instrução `GRANT` pode ser executada com sucesso para todos os usuários e papéis nomeados ou ser revertida e não ter efeito se ocorrer algum erro. A declaração é escrita no log binário apenas se for executada com sucesso para todos os usuários e papéis nomeados.

A instrução `REVOKE` está relacionada à `GRANT` e permite que os administradores removam privilégios de conta. Consulte a Seção 15.7.1.8, “Instrução REVOKE”.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT 'role1', 'role2' TO 'user1'@'localhost', 'user2'@'localhost';
GRANT SELECT ON world.* TO 'role3';
```

A parte do nome de host da conta ou do papel, se omitida, tem como padrão `'%'`.

Normalmente, um administrador de banco de dados primeiro usa `CREATE USER` para criar uma conta e definir suas características não de privilégio, como sua senha, se ela usa conexões seguras e limites de acesso a recursos do servidor, e depois usa `GRANT` para definir seus privilégios. `ALTER USER` pode ser usado para alterar as características não de privilégio de contas existentes. Por exemplo:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

Do programa **mysql**, `GRANT` responde com `Query OK, 0 rows affected` quando executado com sucesso. Para determinar quais privilégios resultam da operação, use `SHOW GRANTS`. Consulte a Seção 15.7.7.23, “Instrução SHOW GRANTS”.

Importante

Em algumas circunstâncias, `GRANT` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 8.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 6.5.1.3, “Registro do Cliente do mysql”.

`GRANT` suporta nomes de host com até 255 caracteres. Os nomes de usuário podem ter até 32 caracteres. Os nomes de banco de dados, tabela, coluna e rotina podem ter até 64 caracteres.

Aviso

*Não tente alterar o comprimento permitido para nomes de usuário alterando a tabela `mysql.user` do sistema. Isso resulta em comportamento imprevisível que pode até tornar impossível para os usuários fazer login no servidor MySQL*. Nunca altere a estrutura das tabelas no esquema `mysql` de qualquer maneira, exceto por meio do procedimento descrito no Capítulo 3, *Atualizando o MySQL*.

##### Diretrizes para Citação de Objetos

Vários objetos nas declarações `GRANT` estão sujeitos à citação, embora a citação seja opcional em muitos casos: Nomes de conta, papel, banco de dados, tabela, coluna e rotinas. Por exemplo, se um valor de *`user_name`* ou *`host_name`* em um nome de conta for legal como um identificador não citado, você não precisa citar. No entanto, as aspas são necessárias para especificar uma string de *`user_name`* contendo caracteres especiais (como `-`) ou uma string de *`host_name`* contendo caracteres especiais ou caracteres curinga, como `%` (por exemplo, `'test-user'@'%.com'`). Cite o nome de usuário e o nome do host separadamente.

Para especificar valores citados:

* Cite os nomes de banco de dados, tabela, coluna e rotina como identificadores.
* Cite os nomes de usuário e host como identificadores ou como strings.
* Cite as senhas como strings.

Para as diretrizes de citação de strings e identificadores, consulte a Seção 11.1.1, “Literal de String”, e a Seção 11.2, “Nomes de Objetos do Esquema”.

Importante

O uso dos caracteres curinga `%` e `_` conforme descrito nos próximos parágrafos é desatualizado e, portanto, sujeito à remoção em uma versão futura do MySQL.

Os caracteres curingas `_` e `%` são permitidos ao especificar nomes de banco de dados em declarações `GRANT` que concedem privilégios ao nível do banco de dados (`GRANT ... ON db_name.*`). Isso significa, por exemplo, que, para usar um caractere `_` como parte de um nome de banco de dados, especifique-o usando o caractere de escape `\` como `\_` na declaração `GRANT`, para evitar que o usuário possa acessar bancos de dados adicionais que correspondam ao padrão de curinga (por exemplo, `GRANT ... ON `foo\_bar`.* TO ...`).

Emitir múltiplas declarações `GRANT` contendo curingas pode não ter o efeito esperado em declarações DML; ao resolver concessões que envolvem curingas, o MySQL considera apenas a primeira concessão que corresponde. Em outras palavras, se um usuário tiver duas concessões ao nível do banco de dados que usam curingas que correspondem ao mesmo banco de dados, a concessão criada primeiro é aplicada. Considere o banco de dados `db` e a tabela `t` criados usando as declarações mostradas aqui:

```
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Em seguida (assumindo que a conta atual é a conta `root` do MySQL ou outra conta com os privilégios necessários), criamos um usuário `u` e em seguida emitimos duas declarações `GRANT` contendo curingas, assim:

```
mysql> CREATE USER u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT SELECT ON `d_`.* TO u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT INSERT ON `d%`.* TO u;
Query OK, 0 rows affected (0.00 sec)

mysql> EXIT
```

```
Bye
```

Se encerrarmos a sessão e depois iniciarmos novamente a sessão com o cliente **mysql**, desta vez como **u**, vemos que essa conta tem apenas o privilégio fornecido pela primeira concessão que corresponde, mas não pela segunda:

```
$> mysql -uu -hlocalhost
```

```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 9.5.0-tr Source distribution

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

Em atribuições de privilégios, o MySQL interpreta ocorrências de caracteres curinga `_` e `%` SQL não escapados em nomes de bancos de dados como caracteres literais nessas circunstâncias:

* Quando um nome de banco de dados não é usado para conceder privilégios ao nível do banco de dados, mas como um qualificador para conceder privilégios a algum outro objeto, como uma tabela ou rotina (por exemplo, `GRANT ... ON db_name.tbl_name`).

* Ativação do `partial_revokes` faz com que o MySQL interprete os caracteres curinga `_` e `%` não escapados nos nomes de banco de dados como caracteres literais, assim como se tivessem sido escapados como `\_` e `\%`. Como isso altera a forma como o MySQL interpreta os privilégios, pode ser aconselhável evitar caracteres curinga não escapados nas atribuições de privilégios para instalações onde `partial_revokes` pode estar habilitado. Para mais informações, consulte a Seção 8.2.12, “Restrição de privilégios usando revocações parciais”.

##### Nomes de Contas

O valor `*` `user` em uma declaração `GRANT` indica uma conta MySQL para a qual a declaração se aplica. Para acomodar o concedimento de direitos a usuários de hosts arbitrários, o MySQL suporta a especificação do valor `*` `user` na forma `'user_name'@'host_name'`.

Você pode especificar caracteres curinga no nome do host. Por exemplo, `'user_name'@'%.example.com'` se aplica a *`user_name`* para qualquer host no domínio `example.com`, e `'user_name'@'198.51.100.%'` se aplica a *`user_name`* para qualquer host na sub-rede de classe C `198.51.100`.

A forma simples `'user_name'` é um sinônimo de `'user_name'@'%'`.

Nota

O MySQL atribui automaticamente todos os privilégios concedidos a `'username'@'%'` à conta `'username'@'localhost'` também. Esse comportamento é desatualizado e está sujeito à remoção em uma versão futura do MySQL.

*O MySQL não suporta caracteres curinga em nomes de usuários*. Para se referir a um usuário anônimo, especifique uma conta com um nome de usuário vazio com a declaração `GRANT`:

```
GRANT ALL ON test.* TO ''@'localhost' ...;
```

Neste caso, qualquer usuário que se conecte ao host local com a senha correta para o usuário anônimo terá acesso, com os privilégios associados à conta do usuário anônimo.

Para obter informações adicionais sobre os valores de nome de usuário e nome de host em nomes de contas, consulte a Seção 8.2.4, “Especificação de Nomes de Contas”.

Aviso

Se você permitir que usuários anônimos locais se conectem ao servidor MySQL, também deve conceder privilégios a todos os usuários locais como `'user_name'@'localhost'`. Caso contrário, a conta do usuário anônimo para `localhost` na tabela de sistema `mysql.user` será usada quando usuários nomeados tentarem fazer login no servidor MySQL a partir da máquina local. Para obter detalhes, consulte a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

Para determinar se esse problema se aplica a você, execute a seguinte consulta, que lista todos os usuários anônimos:

```
SELECT Host, User FROM mysql.user WHERE User='';
```

Para evitar o problema descrito, exclua a conta do usuário anônimo local usando esta instrução:

```
DROP USER ''@'localhost';
```

##### Privilegios Suportáveis pelo MySQL

As seguintes tabelas resumem os tipos de privilégios *`priv_type`* estáticos e dinâmicos permitidos que podem ser especificados para as instruções `GRANT` e `REVOKE`, e os níveis nos quais cada privilégio pode ser concedido. Para obter informações adicionais sobre cada privilégio, consulte a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”. Para informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilégios Estáticos versus Dinâmicos.

**Tabela 15.11 Privilégios Estáticos Permitidos para GRANT e REVOKE**

<table><thead><tr> <th>Privilegio</th> <th>Significado e Níveis de Concedi­do</th> </tr></thead><tbody><tr> <td><a class="link" href="privileges-provided.html#priv_all"><code class="literal">ALL [PRIVILEGES]</code></a></td> <td>Concede todos os privilégios no nível de acesso especificado, exceto <a class="link" href="privileges-provided.html#priv_grant-option"><code class="literal">GRANT OPTION</code></a> e <a class="link" href="privileges-provided.html#priv_proxy"><code class="literal">PROXY</code></a>.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_alter"><code class="literal">ALTER</code></a></td> <td>Habilita o uso de <a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code class="literal">ALTER TABLE</code></a>. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_alter-routine"><code class="literal">ALTER ROUTINE</code></a></td> <td>Habilita a alteração ou remoção de rotinas armazenadas. Níveis: Global, banco de dados.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create"><code class="literal">CREATE</code></a></td> <td>Habilita a criação de bancos de dados e tabelas. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-role"><code class="literal">CREATE ROLE</code></a></td> <td>Habilita a criação de um papel. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-routine"><code class="literal">CREATE ROUTINE</code></a></td> <td>Habilita a criação de rotinas armazenadas. Níveis: Global, banco de dados.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-tablespace"><code class="literal">CREATE TABLESPACE</code></a></td> <td>Habilita a criação de espaços de tabelas e grupos de arquivos de log. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-temporary-tables"><code class="literal">CREATE TEMPORARY TABLES</code></a></td> <td>Habilita o uso de <a class="link" href="create-table.html" title="15.1.24 CREATE TABLE Statement"><code class="literal">CREATE TEMPORARY TABLE</code></a>. Níveis: Global, banco de dados.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-user"><code class="literal">CREATE USER</code></a></td> <td>Habilita o uso de <a class="link" href="create-user.html" title="15.7.1.3 CREATE USER Statement"><code class="literal">CREATE USER</code></a>, <a class="link" href="drop-user.html" title="15.7.1.5 DROP USER Statement"><code class="literal">DROP USER</code></a>, <a class="link" href="rename-user.html" title="15.7.1.7 RENAME USER Statement"><code class="literal">RENAME USER</code></a>, e <a class="link" href="revoke.html" title="15.7.1.8 REVOKE ALL PRIVILEGES Statement"><code class="literal">REVOKE ALL PRIVILEGES</code></a>. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-view"><code class="literal">CREATE VIEW</code></a></td> <td>Habilita a criação ou alteração de visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_delete"><code class="literal">DELETE</code></a></td> <td>Habilita o uso de <a class="link" href="delete.html" title="15.2.2 DELETE Statement"><code class="literal">DELETE</code></a>. N

**Tabela 15.12 Prerrogativas Dinâmicas Permitidas para GRANTE e REVOGAR**

<table><thead><tr> <th>Privilegio</th> <th>Significado e Níveis de Concedibilidade</th> </tr></thead><tbody><tr> <td><a class="link" href="privileges-provided.html#priv_application-password_admin"><code class="literal">APPLICATION_PASSWORD_ADMIN</code></a></td> <td>Habilitar administração de senha dupla. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_audit_abort_exempt"><code class="literal">AUDIT_ABORT_EXEMPT</code></a></td> <td>Permitir consultas bloqueadas pelo filtro do log de auditoria. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_audit_admin"><code class="literal">AUDIT_ADMIN</code></a></td> <td>Habilitar a configuração do log de auditoria. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_authentication_policy_admin"><code class="literal">AUTHENTICATION_POLICY_ADMIN</code></a></td> <td>Habilitar a administração da política de autenticação. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_backup_admin"><code class="literal">BACKUP_ADMIN</code></a></td> <td>Habilitar a administração de backups. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_binlog_admin"><code class="literal">BINLOG_ADMIN</code></a></td> <td>Habilitar o controle do log binário. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_binlog_encryption_admin"><code class="literal">BINLOG_ENCRYPTION_ADMIN</code></a></td> <td>Habilitar a ativação e desativação da criptografia do log binário. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_clone_admin"><code class="literal">CLONE_ADMIN</code></a></td> <td>Habilitar a administração de clones. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_connection_admin"><code class="literal">CONNECTION_ADMIN</code></a></td> <td>Habilitar o controle do limite/restrição de conexões. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_encryption_key_admin"><code class="literal">ENCRYPTION_KEY_ADMIN</code></a></td> <td>Habilitar a rotação da chave <code class="literal">InnoDB</code>. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall_admin"><code class="literal">FIREWALL_ADMIN</code></a></td> <td>Habilitar a administração das regras de firewall, qualquer usuário. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall_exempt"><code class="literal">FIREWALL_EXEMPT</code></a></td> <td>Eximir o usuário das restrições do firewall. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall_user"><code class="literal">FIREWALL_USER</code></a></td> <td>Habilitar a administração das regras de firewall, para o próprio usuário. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush_optimizer_costs"><code class="literal">FLUSH_OPTIMIZER_COSTS</code></a></td> <td>Habilitar a recarga dos custos do otimizador. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush_status"><code class="literal">FLUSH_STATUS</code></a></td> <td>Habilitar o envio do indicador de status. Nível: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush_tables"><code class="literal">FLUSH_TABLES</code></a></td> <td>Habilitar o esvaziamento das tabelas. Nível: Global.</td> </tr><tr> <td><a class

Um gatilho está associado a uma tabela. Para criar ou excluir um gatilho, você deve ter o privilégio `TRIGGER` para a tabela, e não para o gatilho.

Nas declarações `GRANT`, o privilégio `ALL [PRIVILEGES]` ou `PROXY` deve ser nomeado por si mesmo e não pode ser especificado junto com outros privilégios. `ALL [PRIVILEGES]` significa todos os privilégios disponíveis para o nível em que os privilégios devem ser concedidos, exceto os privilégios `GRANT OPTION` e `PROXY`.

As informações da conta MySQL são armazenadas nas tabelas do esquema do sistema `mysql`. Para obter detalhes adicionais, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”, que discute extensivamente o esquema do sistema `mysql` e o sistema de controle de acesso.

Se as tabelas de concessão contiverem linhas de privilégio que contêm nomes de banco de dados ou tabelas em maiúsculas e minúsculas misturados e a variável de sistema `lower_case_table_names` estiver definida para um valor não nulo, o `REVOKE` não pode ser usado para revogar esses privilégios. É necessário, nesses casos, manipular diretamente as tabelas de concessão. (`GRANT` não cria tais linhas quando `lower_case_table_names` é definido, mas tais linhas podem ter sido criadas antes de definir essa variável. O ajuste `lower_case_table_names` só pode ser configurado na inicialização do servidor.)

Os privilégios podem ser concedidos em vários níveis, dependendo da sintaxe usada para a cláusula `ON`. Para `REVOKE`, a mesma sintaxe `ON` especifica quais privilégios devem ser removidos.

Para os níveis global, banco de dados, tabela e rotina, `GRANT ALL` atribui apenas os privilégios que existem no nível em que você está concedendo. Por exemplo, `GRANT ALL ON db_name.*` é uma declaração de nível de banco de dados, então não concede quaisquer privilégios exclusivos do nível global, como `FILE`. Conceder `ALL` não atribui o privilégio `GRANT OPTION` ou `PROXY`.

A cláusula `object_type`, se presente, deve ser especificada como `TABLE`, `EVENT`, `FUNCTION`, `LIBRARY` ou `PROCEDURE` quando o objeto a seguir for uma tabela, um evento, uma função armazenada, uma biblioteca JavaScript ou um procedimento armazenado.

Os privilégios que um usuário possui para uma base de dados, tabela, coluna ou rotina são formados aditivamente como a `OR` lógica dos privilégios da conta em cada um dos níveis de privilégio, incluindo o nível global. Não é possível negar um privilégio concedido em um nível superior pela ausência desse privilégio em um nível inferior. Por exemplo, esta declaração concede os privilégios `SELECT` e `INSERT` globalmente:

```
GRANT SELECT, INSERT ON *.* TO u1;
```

Os privilégios concedidos globalmente se aplicam a todas as bases de dados, tabelas e colunas, mesmo que não tenham sido concedidos em nenhum dos níveis inferiores.

É possível negar explicitamente um privilégio concedido no nível global revogando-o para bases de dados particulares, se a variável de sistema `partial_revokes` estiver habilitada:

```
GRANT SELECT, INSERT, UPDATE ON *.* TO u1;
REVOKE INSERT, UPDATE ON db1.* FROM u1;
```

O resultado das declarações anteriores é que `SELECT` se aplica globalmente a todas as tabelas, enquanto `INSERT` e `UPDATE` se aplicam globalmente, exceto para tabelas em `db1`. O acesso da conta a `db1` é apenas de leitura.

Os detalhes do procedimento de verificação de privilégios são apresentados na Seção 8.2.7, “Controle de Acesso, Etapa 2: Verificação de Solicitação”.

Se você estiver usando privilégios de tabela, coluna ou rotina para até um usuário, o servidor examina os privilégios de tabela, coluna e rotina para todos os usuários e isso desacelera um pouco o MySQL. Da mesma forma, se você limitar o número de consultas, atualizações ou conexões para qualquer usuário, o servidor deve monitorar esses valores.

O MySQL permite que você conceda privilégios em bancos de dados ou tabelas que não existem. Para tabelas, os privilégios a serem concedidos devem incluir o privilégio `CREATE`. *Esse comportamento é intencional* e visa permitir que o administrador do banco de dados prepare contas e privilégios de usuários para bancos de dados ou tabelas que serão criados posteriormente.

Importante

*O MySQL não revoga automaticamente quaisquer privilégios quando você exclui um banco de dados ou uma tabela.* No entanto, se você excluir uma rotina, quaisquer privilégios de nível de rotina concedidos para essa rotina serão revogados.

##### Privilegios Globais

Os privilégios globais são administrativos ou se aplicam a todos os bancos de dados em um servidor específico. Para atribuir privilégios globais, use a sintaxe `ON *.*`:

```
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

Os privilégios estáticos `CREATE TABLESPACE`, `CREATE USER`, `FILE`, `PROCESS`, `RELOAD`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `SHOW DATABASES`, `SHUTDOWN`, `SUPER`, `CREATE ROLE` e `DROP ROLE` são administrativos e só podem ser concedidos globalmente.

Os privilégios dinâmicos são todos globais e só podem ser concedidos globalmente.

Outros privilégios podem ser concedidos globalmente ou em níveis mais específicos.

O efeito do `GRANT OPTION` concedido no nível global difere para privilégios estáticos e dinâmicos:

* O `GRANT OPTION` concedido para qualquer privilégio global estático se aplica a todos os privilégios globais estáticos.

* O `GRANT OPTION` concedido para qualquer privilégio dinâmico se aplica apenas a esse privilégio dinâmico.

`GRANT ALL` no nível global concede todos os privilégios globais estáticos e todos os privilégios dinâmicos atualmente registrados. Um privilégio dinâmico registrado subsequente à execução da declaração `GRANT` não é concedido retroativamente a nenhuma conta.

O MySQL armazena privilégios globais na tabela `mysql.user` do sistema.

##### Privilegios de Banco de Dados

Os privilégios de banco de dados se aplicam a todos os objetos em um banco de dados específico. Para atribuir privilégios de nível de banco de dados, use a sintaxe `ON db_name.*`:

```
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

Se você usar a sintaxe `ON *` (em vez de `ON *.*`), os privilégios são atribuídos ao nível do banco de dados para o banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os privilégios `CREATE`, `DROP`, `EVENT`, `GRANT OPTION`, `LOCK TABLES` e `REFERENCES` podem ser especificados ao nível do banco de dados. Os privilégios de tabela ou rotina também podem ser especificados ao nível do banco de dados, caso em que eles se aplicam a todas as tabelas ou rotinas no banco de dados.

O MySQL armazena os privilégios de banco de dados na tabela `mysql.db` do sistema.

##### Privilégios de Tabela

Os privilégios de tabela se aplicam a todas as colunas em uma tabela específica. Para atribuir privilégios de nível de tabela, use a sintaxe `ON db_name.tbl_name`:

```
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

Se você especificar *`tbl_name`* em vez de *`db_name.tbl_name`*, a instrução se aplica a *`tbl_name`* no banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os valores permitidos de *`priv_type`* ao nível da tabela são `ALTER`, `CREATE VIEW`, `CREATE`, `DELETE`, `DROP`, `GRANT OPTION`, `INDEX`, `INSERT`, `REFERENCES`, `SELECT`, `SHOW VIEW`, `TRIGGER` e `UPDATE`.

Os privilégios de nível de tabela se aplicam a tabelas base e visualizações. Eles não se aplicam a tabelas criadas com `CREATE TEMPORARY TABLE`, mesmo que os nomes das tabelas coincidam. Para informações sobre os privilégios de tabela `TEMPORARY`, consulte a Seção 15.1.24.2, “Instrução CREATE TEMPORARY TABLE”.

O MySQL armazena os privilégios de tabela na tabela `mysql.tables_priv` do sistema.

##### Privilégios de Coluna

Os privilégios de coluna se aplicam a colunas individuais em uma tabela específica. Cada privilégio a ser concedido ao nível da coluna deve ser seguido pela coluna ou colunas, entre parênteses.

```
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

Os valores permitidos de *`priv_type`* para uma coluna (ou seja, quando você usa uma cláusula *`column_list`*) são `INSERT`, `REFERENCES`, `SELECT` e `UPDATE`.

O MySQL armazena os privilégios de coluna na tabela de sistema `mysql.columns_priv`.

##### Privilegios de Rotina Armazenada

Os privilégios `ALTER ROUTINE`, `CREATE ROUTINE`, `EXECUTE` e `GRANT OPTION` se aplicam a rotinas armazenadas (procedimentos e funções). Eles podem ser concedidos em níveis global e de banco de dados. Exceto para `CREATE ROUTINE`, esses privilégios podem ser concedidos em nível de rotina para rotinas individuais.

```
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

Os valores permitidos de *`priv_type`* em nível de rotina são `ALTER ROUTINE`, `EXECUTE` e `GRANT OPTION`. `CREATE ROUTINE` não é um privilégio em nível de rotina porque você deve ter o privilégio em nível global ou de banco de dados para criar uma rotina em primeiro lugar.

O MySQL armazena privilégios em nível de rotina na tabela de sistema `mysql.procs_priv`.

##### Privilegios de Usuário Proxy

O privilégio `PROXY` permite que um usuário seja um proxy para outro. O usuário proxy assume ou assume a identidade do usuário proxy; ou seja, assume os privilégios do usuário proxy.

```
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

Quando `PROXY` é concedido, ele deve ser o único privilégio nomeado na declaração `GRANT`, e a única opção `WITH` permitida é `WITH GRANT OPTION`.

A proxy exige que o usuário proxy autentique por meio de um plugin que retorne o nome do usuário proxy ao servidor quando o usuário proxy se conectar, e que o usuário proxy tenha o privilégio `PROXY` para o usuário proxy. Para detalhes e exemplos, consulte a Seção 8.2.19, “Usuários Proxy”.

O MySQL armazena privilégios de proxy na tabela de sistema `mysql.proxies_priv`.

##### Concedendo Papéis

A sintaxe `GRANT` sem uma cláusula `ON` concede papéis em vez de privilégios individuais. Um papel é uma coleção nomeada de privilégios; veja a Seção 8.2.10, “Usando Papéis”. Por exemplo:

```
GRANT 'role1', 'role2' TO 'user1'@'localhost', 'user2'@'localhost';
```

Cada papel a ser concedido deve existir, assim como cada conta de usuário ou papel a que ele deve ser concedido. Papéis não podem ser concedidos a usuários anônimos.

Conceder um papel não causa automaticamente que o papel seja ativo. Para obter informações sobre a ativação e inativação de papéis, consulte Ativação de Papéis.

Esses privilégios são necessários para conceder papéis:

* Se você tiver o privilégio `ROLE_ADMIN` (ou o privilégio `SUPER` desatualizado), você pode conceder ou revogar qualquer papel a usuários ou papéis.

* Se você recebeu um papel com uma declaração `GRANT` que inclui a cláusula `WITH ADMIN OPTION`, você pode conceder esse papel a outros usuários ou papéis, ou revogá-lo de outros usuários ou papéis, desde que o papel esteja ativo no momento em que você o concede ou revoga posteriormente. Isso inclui a capacidade de usar `WITH ADMIN OPTION` em si.

* Para conceder um papel que tenha o privilégio `SYSTEM_USER`, você deve ter o privilégio `SYSTEM_USER`.

É possível criar referências de concessão circulares com `GRANT`. Por exemplo:

```
CREATE USER 'u1', 'u2';
CREATE ROLE 'r1', 'r2';

GRANT 'u1' TO 'u1';   -- simple loop: u1 => u1
GRANT 'r1' TO 'r1';   -- simple loop: r1 => r1

GRANT 'r2' TO 'u2';
GRANT 'u2' TO 'r2';   -- mixed user/role loop: u2 => r2 => u2
```

Referências de concessão circulares são permitidas, mas não adicionam novos privilégios ou papéis ao concedente porque um usuário ou papel já tem seus privilégios e papéis.

##### A Cláusula `AS` e Restrições de Privilégio
```
CREATE USER u1;
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
REVOKE INSERT, UPDATE ON schema1.* FROM u1;
REVOKE SELECT ON schema2.* FROM u1;
```

`GRANT` pode especificar informações adicionais sobre o contexto de privilégio a ser usado para a execução da declaração usando uma cláusula `AS user [WITH ROLE]`. Essa sintaxe é visível ao nível do SQL, embora seu propósito principal seja permitir a replicação uniforme em todos os nós das restrições de privilégio impostas por revogações parciais, fazendo com que essas restrições apareçam no log binário. Para informações sobre revogações parciais, consulte a Seção 8.2.12, “Restrição de Privilégios Usando Revogações Parciais”.

Quando a cláusula `AS user` é especificada, a execução da declaração leva em consideração quaisquer restrições de privilégio associadas ao usuário nomeado, incluindo todos os papéis especificados por `WITH ROLE`, se presentes. O resultado é que os privilégios realmente concedidos pela declaração podem ser reduzidos em relação aos especificados.

Essas condições se aplicam à cláusula `AS user`:

* `AS` tem efeito apenas quando o usuário nomeado *`user`* tem restrições de privilégio (o que implica que a variável de sistema `partial_revokes` está habilitada).

* Se `WITH ROLE` for fornecido, todos os papéis nomeados devem ser concedidos ao usuário nomeado *`user`*.

* O usuário nomeado *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. O usuário atual pode ser nomeado junto com `WITH ROLE` para o caso de que o usuário executando `GRANT` execute com um conjunto de papéis aplicado que pode diferir dos papéis ativos na sessão atual.

* `AS` não pode ser usado para obter privilégios que não são possuídos pelo usuário que executa a declaração `GRANT`. O usuário executando deve ter pelo menos os privilégios a serem concedidos, mas a cláusula `AS` só pode restringir os privilégios concedidos, não escalar.

* Em relação aos privilégios a serem concedidos, a `AS` não pode especificar uma combinação de usuário/papel que tenha mais privilégios (menos restrições) do que o usuário que executa a declaração `GRANT`. A combinação de usuário/papel `AS` é permitida para ter mais privilégios do que o usuário que executa a declaração, mas apenas se a declaração não conceder esses privilégios adicionais.

* A combinação de usuário/papel `AS` é suportada apenas para conceder privilégios globais (`ON *.*`).

* A `AS` não é suportada para concessões `PROXY`.

O exemplo a seguir ilustra o efeito da cláusula `AS`. Crie um usuário `u1` que tenha alguns privilégios globais, bem como restrições sobre esses privilégios:

```
CREATE ROLE r1;
GRANT INSERT ON schema1.* TO r1;
GRANT SELECT ON schema2.* TO r1;
GRANT r1 TO u1;
```

Crie também um papel `r1` que levante algumas das restrições de privilégio e conceda o papel a `u1`:

```
  mysql> CREATE USER u2;
  mysql> GRANT SELECT, INSERT, UPDATE ON *.* TO u2;
  mysql> SHOW GRANTS FOR u2;
  +-------------------------------------------------+
  | Grants for u2@%                                 |
  +-------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u2`@`%` |
  +-------------------------------------------------+
  ```

Agora, usando uma conta que não tenha restrições de privilégio próprias, conceda a vários usuários o mesmo conjunto de privilégios globais, mas cada um com diferentes restrições impostas pela cláusula `AS`, e verifique quais privilégios são realmente concedidos.

* A declaração `GRANT` aqui não tem a cláusula `AS`, então os privilégios concedidos são exatamente os especificados:

  ```
  mysql> CREATE USER u3;
  mysql> GRANT SELECT, INSERT, UPDATE ON *.* TO u3 AS u1;
  mysql> SHOW GRANTS FOR u3;
  +----------------------------------------------------+
  | Grants for u3@%                                    |
  +----------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u3`@`%`    |
  | REVOKE INSERT, UPDATE ON `schema1`.* FROM `u3`@`%` |
  | REVOKE SELECT ON `schema2`.* FROM `u3`@`%`         |
  +----------------------------------------------------+
  ```

* A declaração `GRANT` aqui tem a cláusula `AS`, então os privilégios concedidos são aqueles especificados, mas com as restrições de `u1` aplicadas:

  ```
  mysql> CREATE USER u4;
  mysql> GRANT SELECT, INSERT, UPDATE ON *.* TO u4 AS u1 WITH ROLE r1;
  mysql> SHOW GRANTS FOR u4;
  +-------------------------------------------------+
  | Grants for u4@%                                 |
  +-------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u4`@`%` |
  | REVOKE UPDATE ON `schema1`.* FROM `u4`@`%`      |
  +-------------------------------------------------+
  ```

Como mencionado anteriormente, a cláusula `AS` só pode adicionar restrições de privilégio; ela não pode escalar privilégios. Assim, embora `u1` tenha o privilégio `DELETE`, ele não está incluído nos privilégios concedidos porque a declaração não especifica a concessão de `DELETE`.

* A cláusula `AS` para a declaração `GRANT` aqui torna o papel `r1` ativo para `u1`. Esse papel remove algumas das restrições impostas a `u1`. Consequentemente, os privilégios concedidos têm algumas restrições, mas não tantas quanto a declaração `GRANT` anterior:

  ```
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Se uma declaração `GRANT` incluir uma cláusula `AS user`, as restrições de privilégio do usuário que executa a declaração são ignoradas (em vez de aplicadas como estariam na ausência de uma cláusula `AS`).

##### Outras Características da Conta

A cláusula opcional `WITH` é usada para permitir que um usuário conceda privilégios a outros usuários. A cláusula `WITH GRANT OPTION` dá ao usuário a capacidade de dar a outros usuários quaisquer privilégios que o usuário tenha no nível de privilégio especificado.

Para conceder o privilégio `GRANT OPTION` a uma conta sem alterar seus privilégios, faça o seguinte:



Tenha cuidado com quem você concede o privilégio `GRANT OPTION`, pois dois usuários com privilégios diferentes podem ser capazes de combinar privilégios!

Você não pode conceder a outro usuário um privilégio que você mesmo não possui; o privilégio `GRANT OPTION` permite que você atribua apenas os privilégios que você mesmo possui.

Esteja ciente de que, ao conceder a um usuário o privilégio `GRANT OPTION` em um nível de privilégio específico, quaisquer privilégios que o usuário possua (ou possa ser concedidos no futuro) nesse nível também podem ser concedidos por esse usuário a outros usuários. Suponha que você conceda a um usuário o privilégio `INSERT` em um banco de dados. Se, em seguida, você conceder o privilégio `SELECT` no banco de dados e especificar `WITH GRANT OPTION`, esse usuário pode dar a outros usuários não apenas o privilégio `SELECT`, mas também `INSERT`. Se, em seguida, você conceder o privilégio `UPDATE` ao usuário no banco de dados, o usuário pode conceder `INSERT`, `SELECT` e `UPDATE`.

Para um usuário não administrativo, você não deve conceder o privilégio `ALTER` globalmente ou para o esquema de sistema `mysql`. Se você fizer isso, o usuário pode tentar subverter o sistema de privilégios renomeando tabelas!

Para obter informações adicionais sobre os riscos de segurança associados a certos privilégios, consulte a Seção 8.2.2, “Privilégios fornecidos pelo MySQL”.

##### MySQL e versões padrão do SQL de GRANT

As maiores diferenças entre as versões MySQL e padrão do SQL de `GRANT` são:

* O MySQL associa privilégios à combinação de um nome de host e nome de usuário e não apenas ao nome de usuário.

* O SQL padrão não tem privilégios globais ou de nível de banco de dados, nem suporta todos os tipos de privilégios que o MySQL suporta.

* O MySQL não suporta o privilégio padrão do SQL `UNDER`.

* Os privilégios do SQL padrão são estruturados de forma hierárquica. Se você remover um usuário, todos os privilégios que o usuário recebeu são revogados. Isso também é verdadeiro no MySQL se você usar `DROP USER`. Veja a Seção 15.7.1.5, “Instrução DROP USER”.

* No SQL padrão, quando você exclui uma tabela, todos os privilégios da tabela são revogados. No SQL padrão, quando você revoga um privilégio, todos os privilégios que foram concedidos com base nesse privilégio também são revogados. No MySQL, os privilégios podem ser excluídos com as instruções `DROP USER` ou `REVOKE`.

* No MySQL, é possível ter o privilégio de `INSERT` apenas para algumas das colunas de uma tabela. Nesse caso, você ainda pode executar instruções `INSERT` na tabela, desde que insira valores apenas para as colunas para as quais você tem o privilégio de `INSERT`. As colunas omitidas são definidas com seus valores padrão implícitos se o modo SQL rigoroso não estiver habilitado. No modo rigoroso, a instrução é rejeitada se qualquer uma das colunas omitidas não tiver um valor padrão. (O SQL padrão exige que você tenha o privilégio de `INSERT` em todas as colunas.) Para informações sobre o modo SQL rigoroso e valores padrão de tipos de dados, consulte a Seção 7.1.11, “Modos de SQL do servidor”, e a Seção 13.6, “Valores padrão de tipos de dados”.