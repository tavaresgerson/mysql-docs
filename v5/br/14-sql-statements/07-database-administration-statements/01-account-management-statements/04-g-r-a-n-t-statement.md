#### 13.7.1.4 Declaração de concessão

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

A declaração `GRANT` concede privilégios às contas de usuário do MySQL. Existem vários aspectos da declaração `GRANT`, descritos nos seguintes tópicos:

- Visão Geral do Auxílio
- Diretrizes para citação de objetos
- Privilegios suportados pelo MySQL
- Nomes de contas e senhas
- Privilégios globais
- Privilégios de banco de dados
- Privilégios da tabela
- Privilégios de coluna
- Privilégios de rotina armazenados
- Privilégios do Usuário Proxy
- Criação de Conta Implícita
- Outras características da conta
- Versões MySQL e SQL Padrão do GRANT

##### GRANT Visão Geral Geral

A declaração `GRANT` concede privilégios às contas de usuário do MySQL.

Para conceder um privilégio com `GRANT`, você deve ter o privilégio `GRANT OPTION` e você deve ter os privilégios que está concedendo. (Alternativamente, se você tiver o privilégio `UPDATE` para as tabelas de concessão no banco de dados do sistema `mysql`, você pode conceder qualquer conta qualquer privilégio.) Quando a variável de sistema `read_only` é habilitada, `GRANT` requer adicionalmente o privilégio `SUPER`.

A declaração `REVOKE` está relacionada à `GRANT` e permite que os administradores removam privilégios de conta. Consulte Seção 13.7.1.6, “Declaração REVOKE”.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
```

A parte do nome do host da conta, se omitida, tem como padrão `'%'.`

Normalmente, um administrador de banco de dados usa primeiro `CREATE USER` para criar uma conta e definir suas características não privilegiadas, como a senha, se ela usa conexões seguras e limites de acesso aos recursos do servidor, e depois usa `GRANT` para definir seus privilégios. O `ALTER USER` pode ser usado para alterar as características não privilegiadas das contas existentes. Por exemplo:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

Nota

Os exemplos mostrados aqui não incluem nenhuma cláusula `IDENTIFIED`. Assume-se que você estabeleça senhas com `CREATE USER` no momento da criação da conta para evitar a criação de contas inseguras.

Nota

Se uma conta mencionada em uma declaração de `GRANT` não existir, o `GRANT` pode criá-la nas condições descritas mais adiante na discussão do modo SQL `NO_AUTO_CREATE_USER`. Também é possível usar o `GRANT` para especificar características de contas que não são privilégios, como se elas usam conexões seguras e limites de acesso aos recursos do servidor.

No entanto, o uso de `GRANT` para criar contas ou definir características não privilegiadas está desaconselhado no MySQL 5.7. Em vez disso, realize essas tarefas usando `CREATE USER` ou `ALTER USER`.

No programa **mysql**, o comando `GRANT` responde com `Query OK, 0 rows affected` quando executado com sucesso. Para determinar quais privilégios resultam da operação, use o comando `SHOW GRANTS` (exibir_permissões). Consulte Seção 13.7.5.21, “Instrução SHOW GRANTS”.

Importante

Em algumas circunstâncias, `GRANT` pode ser registrado nos logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte Seção 4.5.1.3, “Registro do Cliente MySQL”.

`GRANT` suporta nomes de host com até 60 caracteres. Os nomes de usuário podem ter até 32 caracteres. Os nomes de banco de dados, tabela, coluna e rotina podem ter até 64 caracteres.

Aviso

*Não tente alterar o comprimento permitido para os nomes de usuário alterando a tabela `mysql.user` do sistema. Isso resulta em comportamento imprevisível, que pode até tornar impossível para os usuários fazer login no servidor MySQL*. Nunca altere a estrutura das tabelas no banco de dados do sistema `mysql` de qualquer maneira, exceto por meio do procedimento descrito em Seção 2.10, “Atualização do MySQL”.

##### Diretrizes para citação de objetos

Vários objetos nas declarações ``GRANT` estão sujeitos à citação, embora a citação seja opcional em muitos casos: nomes de conta, banco de dados, tabela, coluna e rotinas. Por exemplo, se um valor de *`user_name`* ou *`host_name`* em um nome de conta for legal como um identificador não citado, você não precisa citar. No entanto, as aspas são necessárias para especificar uma string de *`user_name`* contendo caracteres especiais (como `-`) ou uma string de *`host_name`* contendo caracteres especiais ou caracteres curinga, como `%`(por exemplo,`'test-user'@'%.com'\`). Cite o nome de usuário e o nome do host separadamente.

Para especificar valores citados:

- Nomeie o banco de dados, a tabela, a coluna e as rotinas como identificadores.

- Cite nomes de usuários e nomes de hosts como identificadores ou como strings.

- Citar senhas como strings.

Para as diretrizes de citação de strings e identificadores, consulte Seção 9.1.1, “Literais de String” e Seção 9.2, “Nomes de Objetos de Esquema”.

Os caracteres curingas `_` e `%` são permitidos ao especificar nomes de banco de dados em declarações de `GRANT` (concessão de privilégios) que concedem privilégios ao nível do banco de dados (`GRANT ... ON db_name.*`). Isso significa, por exemplo, que, para usar um caractere `_` como parte de um nome de banco de dados, especifique-o usando o caractere de escape `\` como `_` na declaração de `GRANT`, para evitar que o usuário possa acessar bancos de dados adicionais que correspondam ao padrão de curinga (por exemplo, `GRANT ... ON `foo_bar`.* TO ...`).

Emitir várias declarações `GRANT` contendo caracteres curinga pode não ter o efeito esperado em declarações DML; ao resolver concessões que envolvem caracteres curinga, o MySQL considera apenas a primeira concessão que corresponde. Em outras palavras, se um usuário tiver duas concessões de nível de banco de dados que usam caracteres curinga e que correspondem ao mesmo banco de dados, a concessão que foi criada primeiro será aplicada. Considere o banco de dados `db` e a tabela `t` criados usando as declarações mostradas aqui:

```sql
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Em seguida (assumindo que a conta corrente seja a conta `root` do MySQL ou outra conta com os privilégios necessários), criamos um usuário `u` e em seguida emitimos duas declarações `GRANT` contendo asteriscos, da seguinte forma:

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

Se encerrarmos a sessão e, em seguida, nos logarmos novamente com o cliente **mysql**, desta vez como **u**, vemos que essa conta tem apenas o privilégio fornecido pela primeira concessão correspondente, mas não pela segunda:

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

Quando um nome de banco de dados não é usado para conceder privilégios ao nível do banco de dados, mas como um qualificador para conceder privilégios a algum outro objeto, como uma tabela ou rotina (por exemplo, `GRANT ... ON db_name.tbl_name`), o MySQL interpreta caracteres curinga como caracteres literais.

##### Privilégios suportados pelo MySQL

A tabela a seguir resume os tipos de privilégio *`priv_type`* permitidos que podem ser especificados para as instruções `GRANT` e `REVOKE`, e os níveis nos quais cada privilégio pode ser concedido. Para obter informações adicionais sobre cada privilégio, consulte Seção 6.2.2, “Privilégios Fornecidos pelo MySQL”.

**Tabela 13.8 Privilegios Permitidos para GRANTE e REVOGAR**

<table><thead><tr> <th>Privilégio</th> <th>Significado e Níveis de Financiamento</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>CREATE TEMPORARY TABLE</code>]</td> <td>Concede todos os privilégios no nível de acesso especificado, excetoPH_HTML_CODE_<code>CREATE TEMPORARY TABLE</code>]ePH_HTML_CODE_<code>CREATE USER</code>].</td> </tr><tr> <td>PH_HTML_CODE_<code>DROP USER</code>]</td> <td>Ative o uso dePH_HTML_CODE_<code>RENAME USER</code>]Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>PH_HTML_CODE_<code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative a alteração ou a eliminação de rotinas armazenadas. Níveis: Global, banco de dados, rotina.</td> </tr><tr> <td>PH_HTML_CODE_<code>CREATE VIEW</code>]</td> <td>Ative a criação de bancos de dados e tabelas. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td>PH_HTML_CODE_<code>DELETE</code>]</td> <td>Ative a criação de rotinas armazenadas. Níveis: Global, banco de dados.</td> </tr><tr> <td>PH_HTML_CODE_<code>DELETE</code>]</td> <td>Ative a criação, alteração ou eliminação de espaços de tabela e grupos de arquivos de log. Nível: Global.</td> </tr><tr> <td>PH_HTML_CODE_<code>DROP</code>]</td> <td>Ative o uso de<code>CREATE TEMPORARY TABLE</code>Níveis: Global, banco de dados.</td> </tr><tr> <td><code>GRANT OPTION</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Ative o uso de<code>CREATE USER</code>,<code>DROP USER</code>,<code>RENAME USER</code>, e<code>REVOKE ALL PRIVILEGES</code>Nível: Global.</td> </tr><tr> <td><code>CREATE VIEW</code></td> <td>Ative a criação ou alteração de visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>DELETE</code></td> <td>Ative o uso de<code>DELETE</code>Nível: Global, banco de dados, tabela.</td> </tr><tr> <td><code>DROP</code></td> <td>Ative a possibilidade de excluir bancos de dados, tabelas e visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>PROXY</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Ative o uso de eventos para o Agendamento de Eventos. Níveis: Global, banco de dados.</td> </tr><tr> <td><code>PROXY</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Permitir que o usuário execute rotinas armazenadas. Níveis: Global, banco de dados, rotina.</td> </tr><tr> <td><code>PROXY</code><code>CREATE USER</code>]</td> <td>Permitir que o usuário faça com que o servidor leia ou escreva arquivos. Nível: Global.</td> </tr><tr> <td><code>PROXY</code><code>DROP USER</code>]</td> <td>Ative ou desative privilégios para serem concedidos ou removidos de outras contas. Níveis: Global, banco de dados, tabela, rotina, proxy.</td> </tr><tr> <td><code>PROXY</code><code>RENAME USER</code>]</td> <td>Ative a criação ou remoção de índices. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>PROXY</code><code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative o uso de<code>PROXY</code><code>CREATE VIEW</code>]Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>PROXY</code><code>DELETE</code>]</td> <td>Ative o uso de<code>PROXY</code><code>DELETE</code>]nas mesas para as quais você tem<code>PROXY</code><code>DROP</code>]privilégio. Níveis: Global, banco de dados.</td> </tr><tr> <td><code>ALTER</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Permitir que o usuário veja todos os processos com<code>ALTER</code><code>CREATE TEMPORARY TABLE</code>]Nível: Global.</td> </tr><tr> <td><code>ALTER</code><code>CREATE USER</code>]</td> <td>Ative o encaminhamento de proxy do usuário. Nível: De usuário para usuário.</td> </tr><tr> <td><code>ALTER</code><code>DROP USER</code>]</td> <td>Ative a criação de chaves estrangeiras. Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>ALTER</code><code>RENAME USER</code>]</td> <td>Ative o uso de<code>ALTER</code><code>REVOKE ALL PRIVILEGES</code>]operações. Nível: Global.</td> </tr><tr> <td><code>ALTER</code><code>CREATE VIEW</code>]</td> <td>Permitir que o usuário pergunte onde estão os servidores de origem ou replicação. Nível: Global.</td> </tr><tr> <td><code>ALTER</code><code>DELETE</code>]</td> <td>Ative as réplicas para ler eventos de log binário da fonte. Nível: Global.</td> </tr><tr> <td><code>ALTER</code><code>DELETE</code>]</td> <td>Ative o uso de<code>ALTER</code><code>DROP</code>]Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>ALTER TABLE</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Ative<code>ALTER TABLE</code><code>CREATE TEMPORARY TABLE</code>]para mostrar todos os bancos de dados. Nível: Global.</td> </tr><tr> <td><code>ALTER TABLE</code><code>CREATE USER</code>]</td> <td>Ative o uso deRENAME USER</code>]"><code>ALTER TABLE</code><code>DROP USER</code>]Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>ALTER TABLE</code><code>RENAME USER</code>]</td> <td>Ative o uso de<span><strong>mysqladmin shutdown</strong></span>Nível: Global.</td> </tr><tr> <td><code>ALTER TABLE</code><code>REVOKE ALL PRIVILEGES</code>]</td> <td>Ative o uso de outras operações administrativas, como<code>ALTER TABLE</code><code>CREATE VIEW</code>],<code>ALTER TABLE</code><code>DELETE</code>],<code>ALTER TABLE</code><code>DELETE</code>],<code>ALTER TABLE</code><code>DROP</code>], e<span><strong>mysqladmin debug</strong></span>comando. Nível: Global.</td> </tr><tr> <td><code>ALTER ROUTINE</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Ative as operações de gatilho. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>ALTER ROUTINE</code><code>CREATE TEMPORARY TABLE</code>]</td> <td>Ative o uso de<code>ALTER ROUTINE</code><code>CREATE USER</code>]Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>ALTER ROUTINE</code><code>DROP USER</code>]</td> <td>Sinônimo de<span class="quote">“<span class="quote">sem privilégios</span>”</span></td> </tr></tbody></table>

Um gatilho está associado a uma tabela. Para criar ou excluir um gatilho, você deve ter o privilégio `TRIGGER` para a tabela, não para o gatilho.

Nas declarações de `GRANT`, o privilégio `ALL [PRIVILEGES]` ou `PROXY` deve ser nomeado por si mesmo e não pode ser especificado junto com outros privilégios. `ALL [PRIVILEGES]` representa todos os privilégios disponíveis para o nível em que os privilégios devem ser concedidos, exceto os privilégios `GRANT OPTION` e `PROXY`.

`USAGE` pode ser especificado para criar um usuário que não tenha privilégios ou para especificar as cláusulas `REQUIRE` ou `WITH` para uma conta sem alterar seus privilégios existentes. (No entanto, o uso de `GRANT` para definir características não-privilegiadas é desaconselhado.

As informações da conta do MySQL são armazenadas nas tabelas do banco de dados do sistema `mysql`. Para obter detalhes adicionais, consulte Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”, que discute extensivamente o banco de dados do sistema `mysql` e o sistema de controle de acesso.

Se as tabelas de concessão contiverem linhas de privilégio que contenham nomes de banco de dados ou tabelas com maiúsculas e minúsculas misturadas e a variável de sistema `lower_case_table_names` estiver definida para um valor diferente de zero, a opção `REVOKE` não pode ser usada para revogar esses privilégios. É necessário manipular as tabelas de concessão diretamente. (`GRANT` não cria essas linhas quando a variável `lower_case_table_names` está definida, mas essas linhas podem ter sido criadas antes de definir essa variável.)

Os privilégios podem ser concedidos em vários níveis, dependendo da sintaxe usada para a cláusula `ON`. Para `REVOKE` (revogar), a mesma sintaxe `ON` especifica quais privilégios devem ser removidos.

Para os níveis global, banco de dados, tabela e rotina, `GRANT ALL` atribui apenas os privilégios que existem no nível em que você está concedendo. Por exemplo, `GRANT ALL ON db_name.*` é uma declaração de nível de banco de dados, então ela não concede privilégios exclusivos do nível global, como `FILE`. A concessão de `ALL` não atribui o privilégio `GRANT OPTION` ou `PROXY`.

A cláusula `object_type`, se presente, deve ser especificada como `TABLE`, `FUNCTION` ou `PROCEDURE` quando o objeto a seguir for uma tabela, uma função armazenada ou um procedimento armazenado.

Os privilégios que um usuário possui para uma base de dados, tabela, coluna ou rotina são formados aditivamente como a lógica [`OR`]\(operadores lógicos.html#operador_ou) dos privilégios da conta em cada um dos níveis de privilégio, incluindo o nível global. Não é possível negar um privilégio concedido em um nível superior pela ausência desse privilégio em um nível inferior. Por exemplo, esta declaração concede os privilégios de consulta `SELECT` e de inserção `INSERT` globalmente:

```sql
GRANT SELECT, INSERT ON *.* TO u1;
```

Os privilégios concedidos globalmente se aplicam a todas as bases de dados, tabelas e colunas, mesmo que não tenham sido concedidos em nenhum desses níveis inferiores.

Os detalhes do procedimento de verificação de privilégios estão apresentados na Seção 6.2.6, "Controle de Acesso, Etapa 2: Verificação de Solicitação".

Se você estiver usando privilégios de tabela, coluna ou rotina para até um usuário, o servidor examina os privilégios de tabela, coluna e rotina para todos os usuários, o que faz o MySQL funcionar um pouco mais devagar. Da mesma forma, se você limitar o número de consultas, atualizações ou conexões para qualquer usuário, o servidor deve monitorar esses valores.

O MySQL permite que você conceda privilégios em bancos de dados ou tabelas que não existem. Para tabelas, os privilégios a serem concedidos devem incluir o privilégio `CREATE`. *Esse comportamento é intencional* e visa permitir que o administrador do banco de dados prepare contas e privilégios de usuários para bancos de dados ou tabelas que serão criados posteriormente.

Importante

*O MySQL não revoga automaticamente quaisquer privilégios quando você exclui um banco de dados ou uma tabela*. No entanto, se você excluir uma rotina, quaisquer privilégios de nível de rotina concedidos para essa rotina serão revogados.

##### Nomes e Senhas de Conta

Um valor `user` em uma declaração `GRANT` indica uma conta MySQL à qual a declaração se aplica. Para acomodar a concessão de direitos a usuários de hosts arbitrários, o MySQL suporta a especificação do valor `user` na forma `'user_name'@'host_name'`.

Você pode especificar caracteres curinga no nome do host. Por exemplo, `'user_name'@'%.example.com'` se aplica a *`user_name`* para qualquer host no domínio `example.com`, e `'user_name'@'198.51.100.%'` se aplica a *`user_name`* para qualquer host na sub-rede de classe C `198.51.100`.

A forma simples `'user_name'` é um sinônimo de `'user_name'@'%'`.

*O MySQL não suporta caracteres curinga em nomes de usuários*. Para se referir a um usuário anônimo, especifique uma conta com um nome de usuário vazio com a instrução `GRANT`:

```sql
GRANT ALL ON test.* TO ''@'localhost' ...;
```

Nesse caso, qualquer usuário que se conecte ao host local com a senha correta para o usuário anônimo terá permissão para acessar, com os privilégios associados à conta do usuário anônimo.

Para obter informações adicionais sobre os valores de nome de usuário e nome de host em nomes de contas, consulte Seção 6.2.4, “Especificação de Nomes de Contas”.

Aviso

Se você permitir que usuários anônimos locais se conectem ao servidor MySQL, também deve conceder privilégios a todos os usuários locais como `'user_name'@'localhost'`. Caso contrário, a conta de usuário anônimo para `localhost` na tabela de sistema `mysql.user` será usada quando usuários nomeados tentarem fazer login no servidor MySQL a partir da máquina local. Para obter detalhes, consulte Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

Para determinar se esse problema se aplica a você, execute a seguinte consulta, que lista quaisquer usuários anônimos:

```sql
SELECT Host, User FROM mysql.user WHERE User='';
```

Para evitar o problema descrito acima, exclua a conta de usuário anônimo local usando esta declaração:

```sql
DROP USER ''@'localhost';
```

Para a sintaxe de `GRANT` que permite que um valor de *`auth_option`* siga um valor de *`user`*, *`auth_option`* começa com `IDENTIFIED` e indica como a conta autentica, especificando um plugin de autenticação de conta, credenciais (por exemplo, uma senha) ou ambos. A sintaxe da cláusula *`auth_option`* é a mesma da declaração `CREATE USER`. Para detalhes, consulte Seção 13.7.1.2, “Declaração CREATE USER”.

Nota

O uso de `GRANT` para definir características de autenticação de conta está desatualizado no MySQL 5.7. Em vez disso, estabeleça ou mude as características de autenticação usando `CREATE USER` ou `ALTER USER`. Espere que essa capacidade de `GRANT` seja removida em uma futura versão do MySQL.

Quando `IDENTIFIED` está presente e você tem o privilégio de concessão global (`GRANT OPTION`), qualquer senha especificada se torna a nova senha da conta, mesmo que a conta já exista e tenha uma senha. Sem `IDENTIFIED`, a senha da conta permanece inalterada.

##### Privilegios Globais

Os privilégios globais são administrativos ou aplicam-se a todas as bases de dados em um servidor específico. Para atribuir privilégios globais, use a sintaxe `ON *.*`:

```sql
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

Os privilégios `CREATE TABLESPACE`, `CREATE USER`, `FILE`, `PROCESS`, `RELOAD`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `SHOW DATABASES`, `SHUTDOWN` e `SUPER` são administrativos e só podem ser concedidos globalmente.

Outros privilégios podem ser concedidos globalmente ou em níveis mais específicos.

A opção de privilégio (`GRANT OPTION`)(privileges-provided.html#priv_grant-option) concedida em nível global para qualquer privilégio global aplica-se a todos os privilégios globais.

O MySQL armazena privilégios globais na tabela de sistema `mysql.user`.

##### Privilégios de banco de dados

Os privilégios de banco de dados se aplicam a todos os objetos em um banco de dados específico. Para atribuir privilégios de nível de banco de dados, use a sintaxe `ON db_name.*`:

```sql
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

Se você usar a sintaxe `ON *` (em vez de `ON *.*`), os privilégios serão atribuídos ao nível do banco de dados para o banco de dados padrão. Um erro ocorrerá se não houver um banco de dados padrão.

Os privilégios `CREATE`, `DROP`, `EVENT`, `GRANT OPTION`, `LOCK TABLES` e `REFERENCES` podem ser especificados no nível do banco de dados. Privilegios de tabela ou rotina também podem ser especificados no nível do banco de dados, caso em que eles se aplicam a todas as tabelas ou rotinas no banco de dados.

O MySQL armazena os privilégios do banco de dados na tabela `mysql.db` do sistema.

##### Prêmios da Mesa

Os privilégios de tabela se aplicam a todas as colunas de uma tabela específica. Para atribuir privilégios de nível de tabela, use a sintaxe `ON db_name.tbl_name`:

```sql
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

Se você especificar *`tbl_name`* em vez de *`db_name.tbl_name`*, a instrução se aplica a *`tbl_name`* no banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os valores permitidos de *`priv_type`* no nível da tabela são `ALTER`, `CREATE VIEW`, `CREATE`, `DELETE`, `DROP`, `GRANT OPTION`, `INDEX`, `INSERT`, `REFERENCES`, `SELECT`, `SHOW VIEW`, `TRIGGER` e `UPDATE`.

Os privilégios de nível de tabela se aplicam a tabelas e visualizações básicas. Eles não se aplicam a tabelas criadas com `CREATE TEMPORARY TABLE`, mesmo que os nomes das tabelas sejam iguais. Para obter informações sobre os privilégios de tabela `TEMPORARY`, consulte Seção 13.1.18.2, “Instrução CREATE TEMPORARY TABLE”.

O MySQL armazena os privilégios da tabela na tabela `mysql.tables_priv` do sistema.

##### Coluna Privilegios

Os privilégios de coluna se aplicam a colunas individuais em uma tabela específica. Cada privilégio a ser concedido no nível da coluna deve ser seguido pela coluna ou colunas, entre parênteses.

```sql
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

Os valores permitidos de *`priv_type`* para uma coluna (ou seja, quando você usa uma cláusula *`column_list`*) são `INSERT`, `REFERENCES`, `SELECT` e `UPDATE`.

O MySQL armazena os privilégios das colunas na tabela de sistema `mysql.columns_priv`.

##### Privilégios de rotina armazenados

Os privilégios `ALTER ROUTINE`, `CREATE ROUTINE`, `EXECUTE` e `GRANT OPTION` aplicam-se a rotinas armazenadas (procedimentos e funções). Eles podem ser concedidos nos níveis global e de banco de dados. Exceto para `CREATE ROUTINE`, esses privilégios podem ser concedidos no nível da rotina para rotinas individuais.

```sql
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

Os valores permitidos de *`priv_type`* no nível da rotina são `ALTER ROUTINE`, `EXECUTE` e `GRANT OPTION`. `CREATE ROUTINE` não é um privilégio no nível da rotina, pois você deve ter o privilégio no nível global ou do banco de dados para criar uma rotina em primeiro lugar.

O MySQL armazena privilégios de nível de rotina na tabela de sistema `mysql.procs_priv`.

##### Privilégios de Usuário Proxy

O privilégio `PROXY` permite que um usuário seja um proxy para outro. O usuário proxy assume ou assume a identidade do usuário proxy; ou seja, assume os privilégios do usuário proxy.

```sql
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

Quando o `PROXY` é concedido, ele deve ser o único privilégio mencionado na declaração `GRANT`, a cláusula `REQUIRE` não pode ser dada e a única opção `WITH` permitida é `WITH GRANT OPTION`.

A proxy exige que o usuário da proxy se autentique por meio de um plugin que retorne o nome do usuário proxy ao servidor quando o usuário da proxy se conectar, e que o usuário da proxy tenha o privilégio `PROXY` para o usuário proxy. Para obter detalhes e exemplos, consulte Seção 6.2.14, “Usuários de Proxy”.

O MySQL armazena privilégios de proxy na tabela de sistema `mysql.proxies_priv`.

##### Criação Implícita de Conta

Se uma conta mencionada em uma declaração de `GRANT` não existir, a ação tomada depende do modo SQL `NO_AUTO_CREATE_USER`:

- Se `NO_AUTO_CREATE_USER` não estiver habilitado, o `GRANT` cria a conta. *Isso é muito inseguro* a menos que você especifique uma senha não vazia usando `IDENTIFIED BY`.

- Se `NO_AUTO_CREATE_USER` estiver habilitado, a instrução `GRANT` falha e não cria a conta, a menos que você especifique uma senha não vazia usando `IDENTIFIED BY` ou nomeie um plugin de autenticação usando `IDENTIFIED WITH`.

Se a conta já existir, o comando `IDENTIFIED WITH` é proibido, pois ele é destinado apenas para uso ao criar novas contas.

##### Outras características da conta

O MySQL pode verificar os atributos do certificado X.509, além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL com o MySQL, consulte Seção 6.3, “Usando Conexões Encriptadas”.

A cláusula opcional `REQUIRE` especifica opções relacionadas ao SSL para uma conta MySQL. A sintaxe é a mesma da instrução `CREATE USER`. Para detalhes, consulte Seção 13.7.1.2, “Instrução CREATE USER”.

Nota

O uso de `GRANT` para definir as características de SSL da conta está desatualizado no MySQL 5.7. Em vez disso, estabeleça ou mude as características de SSL usando `CREATE USER` ou `ALTER USER`. Espere que essa capacidade de `GRANT` seja removida em uma futura versão do MySQL.

A cláusula `WITH` opcional é usada para esses propósitos:

- Para permitir que um usuário conceda privilégios a outros usuários
- Para especificar limites de recursos para um usuário

A cláusula `WITH GRANT OPTION` permite que o usuário atribua a outros usuários quaisquer privilégios que o usuário tenha no nível de privilégio especificado.

Para conceder o privilégio `GRANT OPTION` a uma conta sem alterar seus privilégios, faça o seguinte:

```sql
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Tenha cuidado com quem você concede o privilégio de `GRANT OPTION`, pois dois usuários com privilégios diferentes podem combinar os privilégios!

Você não pode conceder um privilégio a outro usuário que você mesmo não possui; o privilégio `GRANT OPTION` permite que você atribua apenas os privilégios que você mesmo possui.

Tenha em mente que, ao conceder a um usuário o privilégio `GRANT OPTION` em um nível de privilégio específico, quaisquer privilégios que o usuário possua (ou possa ser concedidos no futuro) nesse nível também podem ser concedidos por esse usuário a outros usuários. Suponha que você conceda a um usuário o privilégio `INSERT` em um banco de dados. Se, em seguida, conceder o privilégio `SELECT` no banco de dados e especificar `WITH GRANT OPTION`, esse usuário pode conceder a outros usuários não apenas o privilégio `SELECT`, mas também `INSERT`. Se, em seguida, conceder o privilégio `UPDATE` ao usuário no banco de dados, o usuário pode conceder `INSERT`, `SELECT` e `UPDATE`.

Para um usuário não administrativo, você não deve conceder o privilégio `ALTER` globalmente ou para o banco de dados do sistema `mysql`. Se você fizer isso, o usuário poderá tentar contornar o sistema de privilégios renomeando tabelas!

Para obter informações adicionais sobre os riscos de segurança associados a certos privilégios, consulte Seção 6.2.2, “Privilégios fornecidos pelo MySQL”.

É possível definir limites de uso dos recursos do servidor para uma conta, conforme discutido em Seção 6.2.16, “Definir Limites de Recursos da Conta”. Para fazer isso, use uma cláusula `WITH` que especifique um ou mais valores de *`resource_option`*. Limites não especificados mantêm seus valores atuais. A sintaxe é a mesma da instrução `CREATE USER`. Para obter detalhes, consulte Seção 13.7.1.2, “Instrução CREATE USER”.

Nota

O uso de `GRANT` para definir limites de recursos da conta está desatualizado no MySQL 5.7. Em vez disso, estabeleça ou mude os limites de recursos usando `CREATE USER` ou `ALTER USER`. Espere que essa capacidade de `GRANT` seja removida em uma futura versão do MySQL.

##### Versões de GRANT do MySQL e SQL Padrão

As maiores diferenças entre as versões MySQL e SQL padrão do `GRANT` são:

- O MySQL associa privilégios à combinação de um nome de host e um nome de usuário e não apenas a um nome de usuário.

- O SQL padrão não possui privilégios globais ou de nível de banco de dados, nem suporta todos os tipos de privilégios que o MySQL suporta.

- O MySQL não suporta o privilégio padrão SQL `UNDER`.

- Os privilégios padrão do SQL são estruturados de forma hierárquica. Se você remover um usuário, todos os privilégios que o usuário recebeu serão revogados. Isso também é válido no MySQL se você usar `DROP USER`. Veja Seção 13.7.1.3, “Instrução DROP USER”.

- No SQL padrão, ao excluir uma tabela, todos os privilégios da tabela são revogados. No SQL padrão, ao revogar um privilégio, todos os privilégios que foram concedidos com base nesse privilégio também são revogados. No MySQL, os privilégios podem ser excluídos com as instruções `DROP USER` ou `REVOKE`.

- No MySQL, é possível ter o privilégio `INSERT` apenas para algumas das colunas de uma tabela. Nesse caso, você ainda pode executar instruções `INSERT` na tabela, desde que insira valores apenas para as colunas para as quais você tenha o privilégio `INSERT`. As colunas omitidas são definidas com seus valores padrão implícitos se o modo SQL rigoroso não estiver habilitado. No modo rigoroso, a instrução é rejeitada se qualquer uma das colunas omitidas não tiver um valor padrão. (O SQL padrão exige que você tenha o privilégio `INSERT` em todas as colunas.) Para informações sobre o modo SQL rigoroso e valores padrão de tipos de dados, consulte Seção 5.1.10, “Modos de SQL do Servidor” e Seção 11.6, “Valores Padrão de Tipos de Dados”.
