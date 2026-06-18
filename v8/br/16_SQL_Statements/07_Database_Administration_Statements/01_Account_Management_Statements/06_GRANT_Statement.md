#### 15.7.1.6 Declaração de concessão

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

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”)
}
```

A declaração `GRANT` atribui privilégios e papéis às contas e papéis de usuários do MySQL. Existem vários aspectos da declaração `GRANT`, descritos nos seguintes tópicos:

- GRANT Visão Geral Geral
- Diretrizes para citação de objetos
- Nomes de Conta
- Privilégios suportados pelo MySQL
- Privilegios Globais
- Privilégios de banco de dados
- Prêmios da Mesa
- Coluna Privilegios
- Privilégios de rotina armazenados
- Privilégios de Usuário Proxy
- Atribuição de papéis
- A cláusula `AS` e as restrições de privilégio
- Outras características da conta
- Versões de GRANT do MySQL e SQL Padrão

##### GRANT Visão Geral Geral

A declaração `GRANT` permite que os administradores do sistema concedam privilégios e papéis, que podem ser concedidos a contas de usuário e papéis. Essas restrições de sintaxe se aplicam:

- `GRANT` não pode misturar a concessão de privilégios e papéis na mesma declaração. Uma declaração `GRANT` específica deve conceder privilégios ou papéis.

- A cláusula `ON` distingue se a declaração concede privilégios ou papéis:

  - Com `ON`, a declaração concede privilégios.

  - Sem `ON`, a declaração concede papéis.

  - É permitido atribuir tanto privilégios quanto papéis a uma conta, mas você deve usar declarações separadas `GRANT` com sintaxe apropriada para o que deve ser concedido.

Para obter mais informações sobre os papéis, consulte a Seção 8.2.10, “Usando papéis”.

Para conceder um privilégio com `GRANT`, você deve ter o privilégio `GRANT OPTION` e você deve ter os privilégios que está concedendo. (Alternativamente, se você tiver o privilégio `UPDATE` para as tabelas de concessão no esquema de sistema `mysql`, você pode conceder qualquer conta qualquer privilégio. Quando a variável de sistema `read_only` estiver habilitada, `GRANT` requer adicionalmente o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

`GRANT` ou tem sucesso para todos os usuários e papéis nomeados ou desfaz e não tem efeito se ocorrer qualquer erro. A declaração é escrita no log binário apenas se tiver sucesso para todos os usuários e papéis nomeados.

A declaração `REVOKE` está relacionada a `GRANT` e permite que os administradores removam privilégios de conta. Veja a Seção 15.7.1.8, “Declaração REVOKE”.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificando Nomes de Conta”. Cada nome de função usa o formato descrito na Seção 8.2.5, “Especificando Nomes de Função”. Por exemplo:

```
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT 'role1', 'role2' TO 'user1'@'localhost', 'user2'@'localhost';
GRANT SELECT ON world.* TO 'role3';
```

A parte do nome do host da conta ou do nome do papel, se omitida, tem como padrão `'%'`.

Normalmente, um administrador de banco de dados usa primeiro `CREATE USER` para criar uma conta e definir suas características não privilegiadas, como a senha, se ela usa conexões seguras e limites de acesso aos recursos do servidor, e depois usa `GRANT` para definir seus privilégios. `ALTER USER` pode ser usado para alterar as características não privilegiadas de contas existentes. Por exemplo:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

Do programa **mysql**, `GRANT` responde com `Query OK, 0 rows affected` quando executado com sucesso. Para determinar quais privilégios resultam da operação, use `SHOW GRANTS`. Veja a Seção 15.7.7.21, “Instrução SHOW GRANTS”.

Importante

Em algumas circunstâncias, `GRANT` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 8.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 6.5.1.3, “Registro do Cliente do MySQL”.

`GRANT` suporta nomes de host com até 255 caracteres (60 caracteres antes do MySQL 8.0.17). Os nomes de usuário podem ter até 32 caracteres. Os nomes de banco de dados, tabela, coluna e rotina podem ter até 64 caracteres.

Aviso

*Não tente alterar o comprimento permitido para os nomes de usuário alterando a tabela `mysql.user` do sistema. Isso resulta em comportamento imprevisível, que pode até tornar impossível para os usuários fazer login no servidor MySQL*. Nunca altere a estrutura das tabelas no esquema de sistema `mysql` de qualquer maneira, exceto por meio do procedimento descrito no Capítulo 3, *Atualizando o MySQL*.

##### Diretrizes para citação de objetos

Vários objetos nas declarações `GRANT` estão sujeitos a citação, embora a citação seja opcional em muitos casos: nomes de conta, funções, bancos de dados, tabelas, colunas e rotinas. Por exemplo, se um valor `user_name` ou `host_name` em um nome de conta for legal como um identificador não citado, você não precisa citar. No entanto, as aspas são necessárias para especificar uma string `user_name` contendo caracteres especiais (como `-`), ou uma string `host_name` contendo caracteres especiais ou caracteres curinga, como `%` (por exemplo, `'test-user'@'%.com'`). Cite o nome do usuário e o nome do host separadamente.

Para especificar valores citados:

- Nomeie o banco de dados, a tabela, a coluna e as rotinas como identificadores.

- Cite nomes de usuários e nomes de hosts como identificadores ou como strings.

- Citar senhas como strings.

Para as diretrizes de citação de strings e identificadores, consulte a Seção 11.1.1, “Literais de String”, e a Seção 11.2, “Nomes de Objetos de Esquema”.

Importante

O uso dos caracteres curinga `%` e `_` conforme descrito nos próximos parágrafos é desaconselhável a partir do MySQL 8.0.35 e, portanto, está sujeito à remoção em uma versão futura do MySQL.

Os caracteres curingas `_` e `%` são permitidos ao especificar nomes de banco de dados em declarações `GRANT` que concedem privilégios ao nível do banco de dados (`GRANT ... ON db_name.*`). Isso significa, por exemplo, que, para usar um caractere `_` como parte de um nome de banco de dados, especifique-o usando o caractere de escape `\` como `_` na declaração `GRANT`, para evitar que o usuário possa acessar bancos de dados adicionais que correspondam ao padrão do caractere curinga (por exemplo, ``GRANT ... ON `foo_bar`.* TO ...``).

Emitir várias declarações `GRANT` contendo asteriscos pode não ter o efeito esperado em declarações DML; ao resolver concessões que envolvem asteriscos, o MySQL considera apenas a primeira concessão que corresponde. Em outras palavras, se um usuário tiver duas concessões de nível de banco de dados que usam asteriscos e que correspondem ao mesmo banco de dados, a concessão que foi criada primeiro será aplicada. Considere o banco de dados `db` e a tabela `t` criadas usando as declarações mostradas aqui:

```
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Em seguida (assumindo que a conta corrente seja a conta MySQL `root` ou outra conta com os privilégios necessários), criamos um usuário `u` e em seguida emitimos duas instruções `GRANT` contendo asteriscos, da seguinte forma:

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

Se encerrarmos a sessão e, em seguida, nos logar novamente com o cliente **mysql**, desta vez como **u**, vemos que essa conta tem apenas o privilégio fornecido pela primeira concessão correspondente, mas não pela segunda:

```
$> mysql -uu -hlocalhost
```

```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 8.0.45-tr Source distribution

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

Nas atribuições de privilégios, o MySQL interpreta as ocorrências de caracteres curinga `_` e `%` não escapados em nomes de bancos de dados como caracteres literais nessas circunstâncias:

- Quando o nome de um banco de dados não é usado para conceder privilégios ao nível do banco de dados, mas como um qualificador para conceder privilégios a algum outro objeto, como uma tabela ou uma rotina (por exemplo, `GRANT ... ON db_name.tbl_name`).

- Ativação de `partial_revokes` faz com que o MySQL interprete os caracteres curinga não escapados `_` e `%` nos nomes dos bancos de dados como caracteres literais, assim como se tivessem sido escapados como `_` e `\%`. Como isso altera a forma como o MySQL interpreta os privilégios, pode ser aconselhável evitar caracteres curinga não escapados nas atribuições de privilégios para instalações onde `partial_revokes` pode estar habilitado. Para mais informações, consulte a Seção 8.2.12, “Restrição de privilégios usando revogações parciais”.

##### Nomes de Conta

Um valor `user` em uma declaração `GRANT` indica uma conta MySQL à qual a declaração se aplica. Para acomodar a concessão de direitos para usuários de hosts arbitrários, o MySQL suporta a especificação do valor `user` na forma `'user_name'@'host_name'`.

Você pode especificar caracteres curinga no nome do host. Por exemplo, `'user_name'@'%.example.com'` se aplica a `user_name` para qualquer host no domínio `example.com`, e `'user_name'@'198.51.100.%'` se aplica a `user_name` para qualquer host na sub-rede de classe C `198.51.100`.

O formulário simples `'user_name'` é sinônimo de `'user_name'@'%'`.

Nota

O MySQL atribui automaticamente todos os privilégios concedidos ao `'username'@'%'` à conta `'username'@'localhost'` também. Esse comportamento é desaconselhável no MySQL 8.0.35 e em versões posteriores do MySQL 8.0 e está sujeito à remoção em uma versão futura do MySQL.

*O MySQL não suporta caracteres curinga em nomes de usuários*. Para se referir a um usuário anônimo, especifique uma conta com um nome de usuário vazio com a instrução `GRANT`:

```
GRANT ALL ON test.* TO ''@'localhost' ...;
```

Nesse caso, qualquer usuário que se conecte ao host local com a senha correta para o usuário anônimo terá permissão para acessar, com os privilégios associados à conta do usuário anônimo.

Para obter informações adicionais sobre os valores de nome de usuário e nome de host em nomes de contas, consulte a Seção 8.2.4, “Especificação de Nomes de Contas”.

Aviso

Se você permitir que usuários anônimos locais se conectem ao servidor MySQL, também deve conceder privilégios a todos os usuários locais como `'user_name'@'localhost'`. Caso contrário, a conta de usuário anônimo para `localhost` na tabela de sistema `mysql.user` será usada quando usuários nomeados tentarem fazer login no servidor MySQL a partir da máquina local. Para obter detalhes, consulte a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

Para determinar se esse problema se aplica a você, execute a seguinte consulta, que lista quaisquer usuários anônimos:

```
SELECT Host, User FROM mysql.user WHERE User='';
```

Para evitar o problema descrito acima, exclua a conta de usuário anônimo local usando esta declaração:

```
DROP USER ''@'localhost';
```

##### Privilégios suportados pelo MySQL

As tabelas a seguir resumem os tipos de privilégios estáticos e dinâmicos `priv_type` permitidos que podem ser especificados para as instruções `GRANT` e `REVOKE`, e os níveis nos quais cada privilégio pode ser concedido. Para obter informações adicionais sobre cada privilégio, consulte a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”. Para informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilégios Estáticos versus Dinâmicos.

**Tabela 15.11 Permissões estáticas permitidas para GRANT e REVOKE**

<table><thead><tr> <th>Privilégio</th> <th>Significado e Níveis de Financiamento</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>CREATE TEMPORARY TABLES</code>]</td> <td>Concede todos os privilégios no nível de acesso especificado, exceto [[PH_HTML_CODE_<code>CREATE TEMPORARY TABLES</code>] e [[PH_HTML_CODE_<code>CREATE USER</code>].</td> </tr><tr> <td>[[PH_HTML_CODE_<code>CREATE USER</code>]</td> <td>Ative o uso de [[PH_HTML_CODE_<code>DROP USER</code>]. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>RENAME USER</code>]</td> <td>Ative a alteração ou a eliminação de rotinas armazenadas. Níveis: Global, banco de dados, rotina.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative a criação de bancos de dados e tabelas. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>CREATE VIEW</code>]</td> <td>Ative a criação de papéis. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>DELETE</code>]</td> <td>Ative a criação de rotinas armazenadas. Níveis: Global, banco de dados.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>DELETE</code>]</td> <td>Ative a criação, alteração ou eliminação de espaços de tabela e grupos de arquivos de log. Nível: Global.</td> </tr><tr> <td>[[<code>CREATE TEMPORARY TABLES</code>]]</td> <td>Ative o uso de [[<code>GRANT OPTION</code><code>CREATE TEMPORARY TABLES</code>]. Níveis: Global, banco de dados.</td> </tr><tr> <td>[[<code>CREATE USER</code>]]</td> <td>Ative o uso de [[<code>CREATE USER</code>]], [[<code>DROP USER</code>]], [[<code>RENAME USER</code>]] e [[<code>REVOKE ALL PRIVILEGES</code>]]. Nível: Global.</td> </tr><tr> <td>[[<code>CREATE VIEW</code>]]</td> <td>Ative a criação ou alteração de visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[<code>DELETE</code>]]</td> <td>Ative o uso de [[<code>DELETE</code>]]. Nível: Global, banco de dados, tabela.</td> </tr><tr> <td>[[<code>PROXY</code><code>CREATE TEMPORARY TABLES</code>]</td> <td>Ative a possibilidade de excluir bancos de dados, tabelas e visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[<code>PROXY</code><code>CREATE TEMPORARY TABLES</code>]</td> <td>Ative a opção para que os papéis possam ser removidos. Nível: Global.</td> </tr><tr> <td>[[<code>PROXY</code><code>CREATE USER</code>]</td> <td>Ative o uso de eventos para o Agendamento de Eventos. Níveis: Global, banco de dados.</td> </tr><tr> <td>[[<code>PROXY</code><code>CREATE USER</code>]</td> <td>Permitir que o usuário execute rotinas armazenadas. Níveis: Global, banco de dados, rotina.</td> </tr><tr> <td>[[<code>PROXY</code><code>DROP USER</code>]</td> <td>Permitir que o usuário faça com que o servidor leia ou escreva arquivos. Nível: Global.</td> </tr><tr> <td>[[<code>PROXY</code><code>RENAME USER</code>]</td> <td>Ative ou desative privilégios para serem concedidos ou removidos de outras contas. Níveis: Global, banco de dados, tabela, rotina, proxy.</td> </tr><tr> <td>[[<code>PROXY</code><code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative a criação ou remoção de índices. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[<code>PROXY</code><code>CREATE VIEW</code>]</td> <td>Ative o uso de [[<code>PROXY</code><code>DELETE</code>]. Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td>[[<code>PROXY</code><code>DELETE</code>]</td> <td>Ative o uso de [[<code>ALTER</code><code>CREATE TEMPORARY TABLES</code>] em tabelas para as quais você tenha o privilégio [[<code>ALTER</code><code>CREATE TEMPORARY TABLES</code>]. Níveis: Global, banco de dados.</td> </tr><tr> <td>[[<code>ALTER</code><code>CREATE USER</code>]</td> <td>Ative o usuário para ver todos os processos com [[<code>ALTER</code><code>CREATE USER</code>]. Nível: Global.</td> </tr><tr> <td>[[<code>ALTER</code><code>DROP USER</code>]</td> <td>Ative o encaminhamento de proxy do usuário. Nível: De usuário para usuário.</td> </tr><tr> <td>[[<code>ALTER</code><code>RENAME USER</code>]</td> <td>Ative a criação de chaves estrangeiras. Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td>[[<code>ALTER</code><code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative o uso das operações [[<code>ALTER</code><code>CREATE VIEW</code>]. Nível: Global.</td> </tr><tr> <td>[[<code>ALTER</code><code>DELETE</code>]</td> <td>Permitir que o usuário pergunte onde estão os servidores de origem ou replicação. Nível: Global.</td> </tr><tr> <td>[[<code>ALTER</code><code>DELETE</code>]</td> <td>Ative as réplicas para ler eventos de log binário da fonte. Nível: Global.</td> </tr><tr> <td>[[<code>ALTER TABLE</code><code>CREATE TEMPORARY TABLES</code>]</td> <td>Ative o uso de [[<code>ALTER TABLE</code><code>CREATE TEMPORARY TABLES</code>]. Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td>[[<code>ALTER TABLE</code><code>CREATE USER</code>]</td> <td>Ative [[<code>ALTER TABLE</code><code>CREATE USER</code>] para mostrar todos os bancos de dados. Nível: Global.</td> </tr><tr> <td>[[<code>ALTER TABLE</code><code>DROP USER</code>]</td> <td>Ative o uso de [[<code>ALTER TABLE</code><code>RENAME USER</code>]. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[<code>ALTER TABLE</code><code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative o uso de<span><strong>mysqladmin shutdown</strong></span>Nível: Global.</td> </tr><tr> <td>[[<code>ALTER TABLE</code><code>CREATE VIEW</code>]</td> <td>Ative o uso de outras operações administrativas, como [[<code>ALTER TABLE</code><code>DELETE</code>], [[<code>ALTER TABLE</code><code>DELETE</code>], [[<code>ALTER ROUTINE</code><code>CREATE TEMPORARY TABLES</code>], [[<code>ALTER ROUTINE</code><code>CREATE TEMPORARY TABLES</code>], [[<code>ALTER ROUTINE</code><code>CREATE USER</code>] e<span><strong>mysqladmin debug</strong></span>comando. Nível: Global.</td> </tr><tr> <td>[[<code>ALTER ROUTINE</code><code>CREATE USER</code>]</td> <td>Ative as operações de gatilho. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>[[<code>ALTER ROUTINE</code><code>DROP USER</code>]</td> <td>Ative o uso de [[<code>ALTER ROUTINE</code><code>RENAME USER</code>]. Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td>[[<code>ALTER ROUTINE</code><code>REVOKE ALL PRIVILEGES</code>]</td> <td>Sinônimo de<span class="quote">“<span class="quote">sem privilégios</span>”</span></td> </tr></tbody></table>

**Tabela 15.12 Prerrogativas Dinâmicas Permitidas para GRANTE e REVOGAR**

<table><thead><tr> <th>Privilégio</th> <th>Significado e Níveis de Financiamento</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>InnoDB</code>]</td> <td>Ative a administração de senhas duplas. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>InnoDB</code>]</td> <td>Permitir consultas bloqueadas pelo filtro do log de auditoria. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FIREWALL_EXEMPT</code>]</td> <td>Ative a configuração do log de auditoria. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FIREWALL_USER</code>]</td> <td>Ative a administração de políticas de autenticação. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_OPTIMIZER_COSTS</code>]</td> <td>Ative a administração de backup. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_STATUS</code>]</td> <td>Ative o controle do log binário. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_TABLES</code>]</td> <td>Ative e desative a criptografia do log binário. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_USER_RESOURCES</code>]</td> <td>Ative a administração de clones. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GROUP_REPLICATION_ADMIN</code>]</td> <td>Ative o controle de limite/restrição de conexão. Nível: Global.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_REDO_LOG_ARCHIVE</code>]</td> <td>Ative a rotação da chave [[<code>InnoDB</code>]]. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ABORT_EXEMPT</code><code>InnoDB</code>]</td> <td>Ative a administração de regras de firewall, qualquer usuário. Nível: Global.</td> </tr><tr> <td>[[<code>FIREWALL_EXEMPT</code>]]</td> <td>Eximir o usuário das restrições do firewall. Nível: Global.</td> </tr><tr> <td>[[<code>FIREWALL_USER</code>]]</td> <td>Ative a administração de regras de firewall, self. Nível: Global.</td> </tr><tr> <td>[[<code>FLUSH_OPTIMIZER_COSTS</code>]]</td> <td>Ative a recarga do custo do otimizador. Nível: Global.</td> </tr><tr> <td>[[<code>FLUSH_STATUS</code>]]</td> <td>Ative o varrimento do indicador de status. Nível: Global.</td> </tr><tr> <td>[[<code>FLUSH_TABLES</code>]]</td> <td>Ative o esvaziamento da tabela. Nível: Global.</td> </tr><tr> <td>[[<code>FLUSH_USER_RESOURCES</code>]]</td> <td>Ative o esvaziamento de recursos do usuário. Nível: Global.</td> </tr><tr> <td>[[<code>GROUP_REPLICATION_ADMIN</code>]]</td> <td>Ative o controle de replicação em grupo. Nível: Global.</td> </tr><tr> <td>[[<code>INNODB_REDO_LOG_ARCHIVE</code>]]</td> <td>Ative a administração de arquivamento do log de refazer. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>InnoDB</code>]</td> <td>Ative ou desative o registro de refazer. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>InnoDB</code>]</td> <td>Ative a partilha de utilizador ou de função entre os nós SQL (NDB Cluster). Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FIREWALL_EXEMPT</code>]</td> <td>Ative a administração de contas de usuário sem senha. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FIREWALL_USER</code>]</td> <td>Ative as variáveis de sistema somente leitura persistentes. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_OPTIMIZER_COSTS</code>]</td> <td>Aconteça como o [[<code>AUDIT_ADMIN</code><code>FLUSH_STATUS</code>] para um canal de replicação. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_TABLES</code>]</td> <td>Ative o controle de replicação regular. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_USER_RESOURCES</code>]</td> <td>Ative a administração do grupo de recursos. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>GROUP_REPLICATION_ADMIN</code>]</td> <td>Ative a administração do grupo de recursos. Nível: Global.</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>INNODB_REDO_LOG_ARCHIVE</code>]</td> <td>Ative a possibilidade de atribuir ou revogar papéis, use [[<code>AUTHENTICATION_POLICY_ADMIN</code><code>InnoDB</code>]. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>InnoDB</code>]</td> <td>Ative a definição de variáveis de sistema de sessão restritas. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FIREWALL_EXEMPT</code>]</td> <td>Ative a definição de valores não-próprios [[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FIREWALL_USER</code>]. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_OPTIMIZER_COSTS</code>]</td> <td>Ative o acesso às definições de rotinas armazenadas. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_STATUS</code>]</td> <td>Não reescreva consultas executadas por este usuário. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_TABLES</code>]</td> <td>Designar a conta como conta do sistema. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_USER_RESOURCES</code>]</td> <td>Ative a modificação ou persistência de variáveis de sistema globais. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>GROUP_REPLICATION_ADMIN</code>]</td> <td>Ative a substituição das configurações de criptografia padrão. Nível: Global.</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>INNODB_REDO_LOG_ARCHIVE</code>]</td> <td>Ative a configuração do log de telemetria para o MySQL HeatWave na AWS. Nível: Global.</td> </tr><tr> <td>[[<code>BACKUP_ADMIN</code><code>InnoDB</code>]</td> <td>Ative a administração de conexões do pool de threads. Nível: Global.</td> </tr><tr> <td>[[<code>BACKUP_ADMIN</code><code>InnoDB</code>]</td> <td>Ative o uso das funções de Tokens de Versão. Nível: Global.</td> </tr><tr> <td>[[<code>BACKUP_ADMIN</code><code>FIREWALL_EXEMPT</code>]</td> <td>Ative a execução de [[<code>BACKUP_ADMIN</code><code>FIREWALL_USER</code>]. Nível: Global.</td> </tr></tbody></table>

Um gatilho está associado a uma tabela. Para criar ou excluir um gatilho, você deve ter o privilégio `TRIGGER` para a tabela, não para o gatilho.

Nas declarações `GRANT`, o privilégio `ALL [PRIVILEGES]` ou `PROXY` deve ser nomeado por si mesmo e não pode ser especificado junto com outros privilégios. `ALL [PRIVILEGES]` representa todos os privilégios disponíveis para o nível em que os privilégios devem ser concedidos, exceto os privilégios `GRANT OPTION` e `PROXY`.

As informações da conta do MySQL são armazenadas nas tabelas do esquema de sistema `mysql`. Para obter detalhes adicionais, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”, que discute extensivamente o esquema de sistema `mysql` e o sistema de controle de acesso.

Se as tabelas de concessão contiverem linhas de privilégio que contenham nomes de banco de dados ou tabelas com maiúsculas e minúsculas misturadas e a variável de sistema `lower_case_table_names` estiver definida para um valor diferente de zero, o `REVOKE` não pode ser usado para revogar esses privilégios. Nesses casos, é necessário manipular as tabelas de concessão diretamente. (O `GRANT` não cria essas linhas quando o `lower_case_table_names` estiver definido, mas essas linhas podem ter sido criadas antes de definir essa variável. A configuração do `lower_case_table_names` só pode ser configurada durante o início do servidor.)

Os privilégios podem ser concedidos em vários níveis, dependendo da sintaxe usada para a cláusula `ON`. Para `REVOKE`, a mesma sintaxe `ON` especifica quais privilégios devem ser removidos.

Para os níveis global, banco de dados, tabela e rotina, `GRANT ALL` atribui apenas os privilégios que existem no nível que você está concedendo. Por exemplo, `GRANT ALL ON db_name.*` é uma declaração de nível de banco de dados, então ela não concede privilégios exclusivos do nível global, como `FILE`. Conceder `ALL` não atribui o privilégio `GRANT OPTION` ou `PROXY`.

A cláusula `object_type`, se presente, deve ser especificada como `TABLE`, `FUNCTION` ou `PROCEDURE` quando o objeto a seguir for uma tabela, uma função armazenada ou um procedimento armazenado.

Os privilégios que um usuário possui para uma base de dados, tabela, coluna ou rotina são formados aditivamente como o `OR` lógico dos privilégios da conta em cada um dos níveis de privilégio, incluindo o nível global. Não é possível negar um privilégio concedido em um nível superior pela ausência desse privilégio em um nível inferior. Por exemplo, esta declaração concede os privilégios `SELECT` e `INSERT` globalmente:

```
GRANT SELECT, INSERT ON *.* TO u1;
```

Os privilégios concedidos globalmente se aplicam a todas as bases de dados, tabelas e colunas, mesmo que não tenham sido concedidos em nenhum desses níveis inferiores.

A partir do MySQL 8.0.16, é possível negar explicitamente um privilégio concedido em nível global revogando-o para bancos de dados específicos, se a variável de sistema `partial_revokes` estiver habilitada:

```
GRANT SELECT, INSERT, UPDATE ON *.* TO u1;
REVOKE INSERT, UPDATE ON db1.* FROM u1;
```

O resultado das declarações anteriores é que `SELECT` se aplica globalmente a todas as tabelas, enquanto `INSERT` e `UPDATE` se aplicam globalmente, exceto para tabelas em `db1`. O acesso à conta de `db1` é apenas de leitura.

Os detalhes do procedimento de verificação de privilégios estão apresentados na Seção 8.2.7, “Controle de Acesso, Etapa 2: Verificação da Solicitação”.

Se você estiver usando privilégios de tabela, coluna ou rotina para até um usuário, o servidor examina os privilégios de tabela, coluna e rotina para todos os usuários, o que faz o MySQL funcionar um pouco mais devagar. Da mesma forma, se você limitar o número de consultas, atualizações ou conexões para qualquer usuário, o servidor deve monitorar esses valores.

O MySQL permite que você conceda privilégios em bancos de dados ou tabelas que não existem. Para tabelas, os privilégios a serem concedidos devem incluir o privilégio \[\[`CREATE`] ]. *Esse comportamento é intencional* e visa permitir que o administrador do banco de dados prepare contas e privilégios de usuários para bancos de dados ou tabelas que serão criados posteriormente.

Importante

*O MySQL não revoga automaticamente quaisquer privilégios quando você exclui um banco de dados ou uma tabela*. No entanto, se você excluir uma rotina, quaisquer privilégios de nível de rotina concedidos para essa rotina serão revogados.

##### Privilegios Globais

Os privilégios globais são administrativos ou aplicam-se a todas as bases de dados em um servidor específico. Para atribuir privilégios globais, use a sintaxe `ON *.*`:

```
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

Os privilégios estáticos `CREATE TABLESPACE`, `CREATE USER`, `FILE`, `PROCESS`, `RELOAD`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `SHOW DATABASES`, `SHUTDOWN` e `SUPER`, `CREATE ROLE` e `DROP ROLE` são administrativos e só podem ser concedidos globalmente.

Os privilégios dinâmicos são globais e só podem ser concedidos globalmente.

Outros privilégios podem ser concedidos globalmente ou em níveis mais específicos.

O efeito do `GRANT OPTION` concedido a nível global difere para privilégios estáticos e dinâmicos:

- O `GRANT OPTION` concedido para qualquer privilégio global estático se aplica a todos os privilégios globais estáticos.

- O `GRANT OPTION` concedido para qualquer privilégio dinâmico aplica-se apenas a esse privilégio dinâmico.

`GRANT ALL` ao nível global concede todos os privilégios globais estáticos e todos os privilégios dinâmicos atualmente registrados. Um privilégio dinâmico registrado após a execução da declaração `GRANT` não é concedido retroativamente a nenhuma conta.

O MySQL armazena privilégios globais na tabela de sistema `mysql.user`.

##### Privilégios de banco de dados

Os privilégios de banco de dados se aplicam a todos os objetos de um determinado banco de dados. Para atribuir privilégios de nível de banco de dados, use a sintaxe `ON db_name.*`:

```
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

Se você usar a sintaxe `ON *` (em vez de `ON *.*`), os privilégios são atribuídos ao nível do banco de dados para o banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os privilégios `CREATE`, `DROP`, `EVENT`, `GRANT OPTION`, `LOCK TABLES` e `REFERENCES` podem ser especificados no nível do banco de dados. Privilegios de tabela ou rotina também podem ser especificados no nível do banco de dados, caso em que eles se aplicam a todas as tabelas ou rotinas no banco de dados.

O MySQL armazena os privilégios do banco de dados na tabela `mysql.db` do sistema.

##### Prêmios da Mesa

Os privilégios de tabela se aplicam a todas as colunas de uma tabela específica. Para atribuir privilégios de nível de tabela, use a sintaxe `ON db_name.tbl_name`:

```
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

Se você especificar `tbl_name` em vez de `db_name.tbl_name`, a declaração se aplica a `tbl_name` no banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os valores permitidos `priv_type` ao nível da tabela são `ALTER`, `CREATE VIEW`, `CREATE`, `DELETE`, `DROP`, `GRANT OPTION`, `INDEX`, `INSERT`, `REFERENCES`, `SELECT`, `SHOW VIEW`, `TRIGGER` e `UPDATE`.

Os privilégios de nível de tabela se aplicam a tabelas e visualizações de base. Eles não se aplicam a tabelas criadas com `CREATE TEMPORARY TABLE`, mesmo que os nomes das tabelas sejam iguais. Para obter informações sobre os privilégios de tabela `TEMPORARY`, consulte a Seção 15.1.20.2, “Instrução CREATE TEMPORARY TABLE”.

O MySQL armazena os privilégios da tabela na tabela `mysql.tables_priv` do sistema.

##### Coluna Privilegios

Os privilégios de coluna se aplicam a colunas individuais em uma tabela específica. Cada privilégio a ser concedido no nível da coluna deve ser seguido pela coluna ou colunas, entre parênteses.

```
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

Os valores `priv_type` permitidos para uma coluna (ou seja, quando você usa uma cláusula `column_list`) são `INSERT`, `REFERENCES`, `SELECT` e `UPDATE`.

O MySQL armazena os privilégios de coluna na tabela `mysql.columns_priv` do sistema.

##### Privilégios de rotina armazenados

Os privilégios `ALTER ROUTINE`, `CREATE ROUTINE`, `EXECUTE` e `GRANT OPTION` aplicam-se a rotinas armazenadas (procedimentos e funções). Eles podem ser concedidos nos níveis global e de banco de dados. Exceto para `CREATE ROUTINE`, esses privilégios podem ser concedidos no nível da rotina para rotinas individuais.

```
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

Os valores permitidos `priv_type` no nível de rotina são `ALTER ROUTINE`, `EXECUTE` e `GRANT OPTION`. `CREATE ROUTINE` não é um privilégio de nível de rotina, pois você deve ter o privilégio no nível global ou do banco de dados para criar uma rotina em primeiro lugar.

O MySQL armazena privilégios de nível de rotina na tabela de sistema `mysql.procs_priv`.

##### Privilégios de Usuário Proxy

O privilégio `PROXY` permite que um usuário seja um representante de outro. O usuário proxy assume ou assume a identidade do usuário proxy; ou seja, assume os privilégios do usuário proxy.

```
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

Quando `PROXY` é concedido, ele deve ser o único privilégio nomeado na declaração `GRANT`, e a única opção `WITH` permitida é `WITH GRANT OPTION`.

Para que o proxy funcione, o usuário do proxy precisa se autenticar por meio de um plugin que retorne o nome do usuário proxy ao servidor quando o usuário do proxy se conectar, e que o usuário do proxy tenha o privilégio `PROXY` para o usuário proxy. Para obter detalhes e exemplos, consulte a Seção 8.2.19, “Usuários de Proxy”.

O MySQL armazena privilégios de proxy na tabela de sistema `mysql.proxies_priv`.

##### Atribuição de papéis

A sintaxe `GRANT` sem uma cláusula `ON` concede papéis em vez de privilégios individuais. Um papel é uma coleção nomeada de privilégios; veja a Seção 8.2.10, “Usando Papéis”. Por exemplo:

```
GRANT 'role1', 'role2' TO 'user1'@'localhost', 'user2'@'localhost';
```

Cada função a ser concedida deve existir, assim como cada conta de usuário ou função para a qual ela deve ser concedida. A partir do MySQL 8.0.16, as funções não podem ser concedidas a usuários anônimos.

Atribuir um papel não significa que ele se torne ativo automaticamente. Para obter informações sobre a ativação e desativação de papéis, consulte Ativação de papéis.

Esses privilégios são necessários para conceder papéis:

- Se você tiver o privilégio `ROLE_ADMIN` (ou o privilégio descontinuado `SUPER`), você pode conceder ou revogar qualquer função para usuários ou funções.

- Se você recebeu um papel com uma declaração `GRANT` que inclui a cláusula `WITH ADMIN OPTION`, você poderá conceder esse papel a outros usuários ou papéis ou revogá-lo de outros usuários ou papéis, desde que o papel esteja ativo no momento em que você o conceder ou revogar posteriormente. Isso inclui a capacidade de usar o próprio `WITH ADMIN OPTION`.

- Para conceder um papel que tenha o privilégio `SYSTEM_USER`, você deve ter o privilégio `SYSTEM_USER`.

É possível criar referências circulares com `GRANT`. Por exemplo:

```
CREATE USER 'u1', 'u2';
CREATE ROLE 'r1', 'r2';

GRANT 'u1' TO 'u1';   -- simple loop: u1 => u1
GRANT 'r1' TO 'r1';   -- simple loop: r1 => r1

GRANT 'r2' TO 'u2';
GRANT 'u2' TO 'r2';   -- mixed user/role loop: u2 => r2 => u2
```

Referências de subsídios circulares são permitidas, mas não adicionam novos privilégios ou papéis ao beneficiário, pois um usuário ou papel já possui seus privilégios e papéis.

##### A cláusula `AS` e as restrições de privilégio

A partir do MySQL 8.0.16, `GRANT` tem uma cláusula `AS user [WITH ROLE]` que especifica informações adicionais sobre o contexto de privilégio a ser usado para a execução da declaração. Essa sintaxe é visível ao nível do SQL, embora seu propósito principal seja permitir a replicação uniforme em todos os nós das restrições de privilégio do concedente impostas por revogações parciais, fazendo com que essas restrições apareçam no log binário. Para informações sobre revogações parciais, consulte a Seção 8.2.12, “Restrição de Privilégio Usando Revogações Parciais”.

Quando a cláusula `AS user` é especificada, a execução da declaração leva em consideração quaisquer restrições de privilégio associadas ao usuário nomeado, incluindo todos os papéis especificados por `WITH ROLE`, se presentes. O resultado é que os privilégios realmente concedidos pela declaração podem ser reduzidos em relação aos especificados.

Essas condições se aplicam à cláusula `AS user`:

- `AS` tem efeito apenas quando o nomeado `user` tem restrições de privilégio (o que implica que a variável de sistema `partial_revokes` está habilitada).

- Se `WITH ROLE` for fornecido, todos os papéis nomeados devem ser concedidos ao `user` nomeado.

- O nome `user` deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. O usuário atual pode ser nomeado junto com `WITH ROLE` para o caso de que o usuário executando queira que `GRANT` execute com um conjunto de papéis aplicados que podem diferir dos papéis ativos na sessão atual.

- `AS` não pode ser usado para obter privilégios que não sejam de posse do usuário que executa a instrução `GRANT`. O usuário executando deve ter, no mínimo, os privilégios que serão concedidos, mas a cláusula `AS` só pode restringir os privilégios concedidos, não escalar.

- Em relação aos privilégios a serem concedidos, `AS` não pode especificar uma combinação de usuário/papel que tenha mais privilégios (menos restrições) do que o usuário que executa a instrução `GRANT`. A combinação de usuário/papel `AS` é permitida para ter mais privilégios do que o usuário que executa a instrução, mas apenas se a instrução não conceder esses privilégios adicionais.

- O `AS` é suportado apenas para conceder privilégios globais (`ON *.*`).

- `AS` não é suportado para bolsas `PROXY`.

O exemplo a seguir ilustra o efeito da cláusula `AS`. Crie um usuário `u1` que tenha alguns privilégios globais, bem como restrições sobre esses privilégios:

```
CREATE USER u1;
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
REVOKE INSERT, UPDATE ON schema1.* FROM u1;
REVOKE SELECT ON schema2.* FROM u1;
```

Além disso, crie um papel `r1` que levante algumas das restrições de privilégio e conceda o papel ao `u1`:

```
CREATE ROLE r1;
GRANT INSERT ON schema1.* TO r1;
GRANT SELECT ON schema2.* TO r1;
GRANT r1 TO u1;
```

Agora, usando uma conta que não tenha restrições de privilégio próprias, conceda a vários usuários o mesmo conjunto de privilégios globais, mas cada um com diferentes restrições impostas pela cláusula `AS`, e verifique quais privilégios estão realmente concedidos.

- A declaração `GRANT` aqui não tem cláusula `AS`, portanto, os privilégios concedidos são exatamente os especificados:

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

- A declaração `GRANT` aqui tem uma cláusula `AS`, então os privilégios concedidos são os especificados, mas com as restrições de `u1` aplicadas:

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

  Como mencionado anteriormente, a cláusula `AS` só pode adicionar restrições de privilégio; ela não pode aumentar os privilégios. Assim, embora o `u1` tenha o privilégio `DELETE`, isso não está incluído nos privilégios concedidos porque a declaração não especifica a concessão do `DELETE`.

- A cláusula `AS` para a declaração `GRANT` aqui torna o papel `r1` ativo para `u1`. Esse papel remove algumas das restrições sobre `u1`. Consequentemente, os privilégios concedidos têm algumas restrições, mas não tantas quanto na declaração anterior `GRANT`:

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

Se uma declaração `GRANT` incluir uma cláusula `AS user`, as restrições de privilégio do usuário que executa a declaração são ignoradas (em vez de aplicadas como faria na ausência de uma cláusula `AS`).

##### Outras características da conta

A cláusula opcional `WITH` é usada para permitir que um usuário conceda privilégios a outros usuários. A cláusula `WITH GRANT OPTION` dá ao usuário a capacidade de conceder a outros usuários quaisquer privilégios que o usuário tenha no nível de privilégio especificado.

Para conceder o privilégio `GRANT OPTION` a uma conta sem alterar seus privilégios, faça o seguinte:

```
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Tenha cuidado com quem você concede o privilégio `GRANT OPTION`, pois dois usuários com diferentes privilégios podem combinar os privilégios!

Você não pode conceder um privilégio a outro usuário que você mesmo não possui; o privilégio `GRANT OPTION` permite que você atribua apenas os privilégios que você mesmo possui.

Tenha em mente que, ao conceder a um usuário o privilégio `GRANT OPTION` em um nível de privilégio específico, quaisquer privilégios que o usuário possua (ou possa ser concedidos no futuro) nesse nível também podem ser concedidos por esse usuário a outros usuários. Suponha que você conceda a um usuário o privilégio `INSERT` em um banco de dados. Se, em seguida, você conceder o privilégio `SELECT` no banco de dados e especificar `WITH GRANT OPTION`, esse usuário pode dar a outros usuários não apenas o privilégio `SELECT`, mas também `INSERT`. Se, em seguida, você conceder o privilégio `UPDATE` ao usuário no banco de dados, o usuário pode conceder `INSERT`, `SELECT` e `UPDATE`.

Para um usuário não administrativo, você não deve conceder o privilégio `ALTER` globalmente ou para o esquema de sistema `mysql`. Se você fizer isso, o usuário poderá tentar subverter o sistema de privilégios renomeando tabelas!

Para obter informações adicionais sobre os riscos de segurança associados a certos privilégios, consulte a Seção 8.2.2, “Privilégios fornecidos pelo MySQL”.

##### Versões de GRANT do MySQL e SQL Padrão

As maiores diferenças entre as versões MySQL e SQL padrão do `GRANT` são:

- O MySQL associa privilégios à combinação de um nome de host e um nome de usuário e não apenas a um nome de usuário.

- O SQL padrão não possui privilégios globais ou de nível de banco de dados, nem suporta todos os tipos de privilégios que o MySQL suporta.

- O MySQL não suporta o privilégio padrão SQL `UNDER`.

- Os privilégios padrão do SQL são estruturados de forma hierárquica. Se você remover um usuário, todos os privilégios que o usuário recebeu serão revogados. Isso também é válido no MySQL se você usar `DROP USER`. Veja a Seção 15.7.1.5, “Instrução DROP USER”.

- No SQL padrão, ao excluir uma tabela, todos os privilégios da tabela são revogados. No SQL padrão, ao revogar um privilégio, todos os privilégios que foram concedidos com base nesse privilégio também são revogados. No MySQL, os privilégios podem ser excluídos com as instruções `DROP USER` ou `REVOKE`.

- No MySQL, é possível ter o privilégio `INSERT` apenas para algumas das colunas de uma tabela. Nesse caso, você ainda pode executar instruções `INSERT` na tabela, desde que insira valores apenas para as colunas para as quais você tem o privilégio `INSERT`. As colunas omitidas são definidas com seus valores padrão implícitos se o modo SQL rigoroso não estiver habilitado. No modo rigoroso, a instrução é rejeitada se qualquer uma das colunas omitidas não tiver um valor padrão. (O SQL padrão exige que você tenha o privilégio `INSERT` em todas as colunas.) Para informações sobre o modo SQL rigoroso e valores padrão de tipos de dados, consulte a Seção 7.1.11, “Modos de SQL do servidor”, e a Seção 13.6, “Valores padrão de tipos de dados”.
