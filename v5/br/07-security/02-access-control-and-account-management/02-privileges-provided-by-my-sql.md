### 6.2.2 Prêmios fornecidos pelo MySQL

Os privilégios concedidos a uma conta MySQL determinam quais operações a conta pode realizar. Os privilégios do MySQL diferem nos contextos em que se aplicam e em diferentes níveis de operação:

- Os privilégios administrativos permitem que os usuários gerenciem o funcionamento do servidor MySQL. Esses privilégios são globais, pois não são específicos de um banco de dados particular.

- Os privilégios de banco de dados se aplicam a um banco de dados e a todos os objetos dentro dele. Esses privilégios podem ser concedidos para bancos de dados específicos ou globalmente, para que se apliquem a todos os bancos de dados.

- Os privilégios para objetos de banco de dados, como tabelas, índices, visualizações e rotinas armazenadas, podem ser concedidos para objetos específicos dentro de um banco de dados, para todos os objetos de um determinado tipo dentro de um banco de dados (por exemplo, todas as tabelas em um banco de dados) ou globalmente para todos os objetos de um determinado tipo em todos os bancos de dados.

As informações sobre os privilégios da conta são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Para uma descrição da estrutura e do conteúdo dessas tabelas, consulte Seção 6.2.3, “Tabelas de Concessão”. O servidor MySQL lê o conteúdo das tabelas de concessão na memória quando ele é iniciado e os recarrega nas circunstâncias indicadas na Seção 6.2.9, “Quando os Alterações de Privilégio Se Tornam Efetivas”. O servidor baseia as decisões de controle de acesso nas cópias em memória das tabelas de concessão.

Importante

Algumas versões do MySQL introduzem alterações nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas funcionalidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Consulte Seção 2.10, “Atualização do MySQL”.

As seções a seguir resumem os privilégios disponíveis, fornecem descrições mais detalhadas de cada privilégio e oferecem diretrizes de uso.

- Resumo dos privilégios disponíveis
- Descrição dos privilégios
- Diretrizes de Concessão de Privilegios

#### Resumo dos privilégios disponíveis

A tabela a seguir mostra os nomes de privilégios usados nas declarações `GRANT` e `REVOKE`, juntamente com o nome da coluna associado a cada privilégio nas tabelas de concessão e o contexto em que o privilégio se aplica.

**Tabela 6.2 Prerrogativas Permitidas para GRANTE e REVOGAR**

<table><col style="width: 30%"/><col style="width: 33%"/><col style="width: 37%"/><thead><tr> <th>Privilégio</th> <th>Coluna da Tabela de Concessão</th> <th>Contexto</th> </tr></thead><tbody><tr> <th><a class="link" href="privileges-provided.html#priv_all">[[PH_HTML_CODE_<code>Create_tablespace_priv</code>]</a></th> <td>Sinônimo de<span class="quote">“<span class="quote">todos os privilégios</span>”</span></td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_alter">[[PH_HTML_CODE_<code>Create_tablespace_priv</code>]</a></th> <td>[[PH_HTML_CODE_<code>Create_tmp_table_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_alter-routine">[[PH_HTML_CODE_<code>CREATE USER</code>]</a></th> <td>[[PH_HTML_CODE_<code>Create_user_priv</code>]</td> <td>Rotinas armazenadas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_create">[[PH_HTML_CODE_<code>CREATE VIEW</code>]</a></th> <td>[[PH_HTML_CODE_<code>Create_view_priv</code>]</td> <td>Bancos de dados, tabelas ou índices</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_create-routine">[[PH_HTML_CODE_<code>DELETE</code>]</a></th> <td>[[PH_HTML_CODE_<code>Delete_priv</code>]</td> <td>Rotinas armazenadas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_create-tablespace">[[PH_HTML_CODE_<code>DROP</code>]</a></th> <td>[[<code>Create_tablespace_priv</code>]]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_create-temporary-tables">[[<code>ALTER</code><code>Create_tablespace_priv</code>]</a></th> <td>[[<code>Create_tmp_table_priv</code>]]</td> <td>Tabelas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_create-user">[[<code>CREATE USER</code>]]</a></th> <td>[[<code>Create_user_priv</code>]]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_create-view">[[<code>CREATE VIEW</code>]]</a></th> <td>[[<code>Create_view_priv</code>]]</td> <td>Visões</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_delete">[[<code>DELETE</code>]]</a></th> <td>[[<code>Delete_priv</code>]]</td> <td>Tabelas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_drop">[[<code>DROP</code>]]</a></th> <td>[[<code>Alter_priv</code><code>Create_tablespace_priv</code>]</td> <td>Bancos de dados, tabelas ou visualizações</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_event">[[<code>Alter_priv</code><code>Create_tablespace_priv</code>]</a></th> <td>[[<code>Alter_priv</code><code>Create_tmp_table_priv</code>]</td> <td>Bancos de dados</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_execute">[[<code>Alter_priv</code><code>CREATE USER</code>]</a></th> <td>[[<code>Alter_priv</code><code>Create_user_priv</code>]</td> <td>Rotinas armazenadas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_file">[[<code>Alter_priv</code><code>CREATE VIEW</code>]</a></th> <td>[[<code>Alter_priv</code><code>Create_view_priv</code>]</td> <td>Acesso a arquivos no host do servidor</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_grant-option">[[<code>Alter_priv</code><code>DELETE</code>]</a></th> <td>[[<code>Alter_priv</code><code>Delete_priv</code>]</td> <td>Bancos de dados, tabelas ou rotinas armazenadas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_index">[[<code>Alter_priv</code><code>DROP</code>]</a></th> <td>[[<code>ALTER ROUTINE</code><code>Create_tablespace_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_insert">[[<code>ALTER ROUTINE</code><code>Create_tablespace_priv</code>]</a></th> <td>[[<code>ALTER ROUTINE</code><code>Create_tmp_table_priv</code>]</td> <td>Tabelas ou colunas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_lock-tables">[[<code>ALTER ROUTINE</code><code>CREATE USER</code>]</a></th> <td>[[<code>ALTER ROUTINE</code><code>Create_user_priv</code>]</td> <td>Bancos de dados</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_process">[[<code>ALTER ROUTINE</code><code>CREATE VIEW</code>]</a></th> <td>[[<code>ALTER ROUTINE</code><code>Create_view_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_proxy">[[<code>ALTER ROUTINE</code><code>DELETE</code>]</a></th> <td>Veja a tabela [[<code>ALTER ROUTINE</code><code>Delete_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_references">[[<code>ALTER ROUTINE</code><code>DROP</code>]</a></th> <td>[[<code>Alter_routine_priv</code><code>Create_tablespace_priv</code>]</td> <td>Bancos de dados ou tabelas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_reload">[[<code>Alter_routine_priv</code><code>Create_tablespace_priv</code>]</a></th> <td>[[<code>Alter_routine_priv</code><code>Create_tmp_table_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_replication-client">[[<code>Alter_routine_priv</code><code>CREATE USER</code>]</a></th> <td>[[<code>Alter_routine_priv</code><code>Create_user_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_replication-slave">[[<code>Alter_routine_priv</code><code>CREATE VIEW</code>]</a></th> <td>[[<code>Alter_routine_priv</code><code>Create_view_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_select">[[<code>Alter_routine_priv</code><code>DELETE</code>]</a></th> <td>[[<code>Alter_routine_priv</code><code>Delete_priv</code>]</td> <td>Tabelas ou colunas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_show-databases">[[<code>Alter_routine_priv</code><code>DROP</code>]</a></th> <td>[[<code>CREATE</code><code>Create_tablespace_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_show-view">[[<code>CREATE</code><code>Create_tablespace_priv</code>]</a></th> <td>[[<code>CREATE</code><code>Create_tmp_table_priv</code>]</td> <td>Visões</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_shutdown">[[<code>CREATE</code><code>CREATE USER</code>]</a></th> <td>[[<code>CREATE</code><code>Create_user_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_super">[[<code>CREATE</code><code>CREATE VIEW</code>]</a></th> <td>[[<code>CREATE</code><code>Create_view_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_trigger">[[<code>CREATE</code><code>DELETE</code>]</a></th> <td>[[<code>CREATE</code><code>Delete_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_update">[[<code>CREATE</code><code>DROP</code>]</a></th> <td>[[<code>Create_priv</code><code>Create_tablespace_priv</code>]</td> <td>Tabelas ou colunas</td> </tr><tr> <th><a class="link" href="privileges-provided.html#priv_usage">[[<code>Create_priv</code><code>Create_tablespace_priv</code>]</a></th> <td>Sinônimo de<span class="quote">“<span class="quote">sem privilégios</span>”</span></td> <td>Administração de servidores</td> </tr></tbody></table>

#### Descrição de privilégios

A lista a seguir fornece descrições gerais de cada privilégio disponível no MySQL. As instruções SQL específicas podem ter requisitos de privilégio mais específicos do que os indicados aqui. Se assim for, a descrição da instrução em questão fornece os detalhes.

- `TODOS`, `TODOS OS PRIVILEGIOS`

  Esses especizadores de privilégio são abreviações para “todos os privilégios disponíveis em um determinado nível de privilégio” (exceto `GRANT OPTION`). Por exemplo, conceder `ALL` no nível global ou de tabela concede todos os privilégios globais ou todos os privilégios de nível de tabela, respectivamente.

- `ALTERAR`

  Permite o uso da instrução `ALTER TABLE` para alterar a estrutura das tabelas. A instrução `ALTER TABLE` também requer os privilégios `CREATE` e `INSERT`. Para renomear uma tabela, são necessários os privilégios `ALTER` e `DROP` na tabela antiga, `CREATE` e `INSERT` na nova tabela.

- `ALTERAR ROTINA`

  Permite o uso de declarações que alteram ou excluem rotinas armazenadas (procedimentos e funções armazenadas).

- `CREATE`

  Permite o uso de declarações que criam novos bancos de dados e tabelas.

- `Crie rotina`

  Permite o uso de declarações que criam rotinas armazenadas (procedimentos e funções armazenadas).

- `CREATE TABLESPACE`

  Permite o uso de declarações que criam, alteram ou eliminam espaços de tabela e grupos de arquivos de log.

- `Crie tabelas temporárias`

  Permite a criação de tabelas temporárias usando a instrução `CREATE TEMPORARY TABLE`.

  Após uma sessão criar uma tabela temporária, o servidor não realiza mais verificações de privilégios na tabela. A sessão criadora pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`. Para mais informações, consulte Seção 13.1.18.2, “Instrução CREATE TEMPORARY TABLE”.

- `Crie usuário`

  Permite o uso das instruções `ALTER USER`, `CREATE USER`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`.

- `CREATE VIEW`

  Habilita o uso da instrução `CREATE VIEW`.

- `DELETAR`

  Permite a exclusão de linhas de tabelas em um banco de dados.

- `DROP`

  Permite o uso de instruções que excluem (removem) bancos de dados, tabelas e visualizações existentes. O privilégio `DROP` é necessário para usar a instrução `ALTER TABLE ... DROP PARTITION` em uma tabela particionada. O privilégio `DROP` também é necessário para a instrução `TRUNCATE TABLE` (truncate-table.html).

- `EVENTO`

  Permite o uso de declarações que criam, alteram, excluem ou exibem eventos para o Agendamento de Eventos.

- `EXECUTAR`

  Permite o uso de declarações que executam rotinas armazenadas (procedimentos e funções armazenadas).

- `Arquivo`

  Afeta as seguintes operações e comportamentos do servidor:

  - Permite a leitura e a escrita de arquivos no host do servidor usando as instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e a função `LOAD_FILE()`. Um usuário que tenha o privilégio `FILE` pode ler qualquer arquivo no host do servidor que seja legível para todos ou legível pelo servidor MySQL. (Isso implica que o usuário pode ler qualquer arquivo em qualquer diretório de banco de dados, porque o servidor pode acessar qualquer um desses arquivos.)

  - Permite a criação de novos arquivos em qualquer diretório onde o servidor MySQL tenha acesso de escrita. Isso inclui o diretório de dados do servidor, que contém os arquivos que implementam as tabelas de privilégios.

  - A partir do MySQL 5.7.17, permite o uso da opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` para a instrução `CREATE TABLE`.

  Como medida de segurança, o servidor não sobrescreve arquivos existentes.

  Para limitar a localização em que os arquivos podem ser lidos e escritos, defina a variável de sistema `secure_file_priv` para um diretório específico. Veja Seção 5.1.7, “Variáveis de Sistema do Servidor”.

- `OPÇÃO DE CONCEDIMENTO`

  Permite que você conceda ou revogue os privilégios que você mesmo possui para outros usuários.

- `INDEX`

  Permite o uso de declarações que criam ou excluem (removem) índices. `INDEX` se aplica a tabelas existentes. Se você tiver o privilégio `CREATE` para uma tabela, você pode incluir definições de índices na declaração `CREATE TABLE`.

- `INSERT`

  Permite que linhas sejam inseridas em tabelas de um banco de dados. `INSERT` também é necessário para as declarações de manutenção de tabelas `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

- `LOCK TABLES`

  Permite o uso de declarações explícitas de `LOCK TABLES` para bloquear tabelas para as quais você tem o privilégio de `SELECT`. Isso inclui o uso de bloqueios de escrita, que impede que outras sessões leiam a tabela bloqueada.

- `PROCESSO`

  O privilégio `PROCESS` controla o acesso às informações sobre os threads que estão sendo executados no servidor (ou seja, informações sobre as instruções sendo executadas pelas sessões). As informações sobre os threads disponíveis usando a instrução `SHOW PROCESSLIST`, o comando **mysqladmin processlist**, a tabela `**INFORMATION_SCHEMA.PROCESSLIST**` (information-schema-processlist-table.html) e a tabela do Schema de Desempenho `processlist` são acessíveis da seguinte forma:

  - Com o privilégio `PROCESSO`, um usuário tem acesso a informações sobre todos os threads, mesmo aqueles pertencentes a outros usuários.

  - Sem o privilégio `PROCESSO`, os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

  Nota

  A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja Seção 25.12.16.4, “A tabela de threads”.

  O privilégio `PROCESSO` também permite o uso da instrução `SHOW ENGINE`, acesso às tabelas do `INFORMATION_SCHEMA` `InnoDB` (tabelas com nomes que começam com `INNODB_`) e (a partir do MySQL 5.7.31) acesso à tabela do `INFORMATION_SCHEMA` `ARCHIVOS`.

- `PROXY`

  Permite que um usuário se identifique como outro usuário ou se torne conhecido como outro usuário. Consulte Seção 6.2.14, “Usuários Proxy”.

- `REFERÊNCIAS`

  Para criar uma restrição de chave estrangeira, é necessário o privilégio `REFERENCES` para a tabela pai.

- `RELOAD`

  O `RELOAD` permite as seguintes operações:

  - Uso da instrução `FLUSH`.

  - Uso dos comandos **mysqladmin** que são equivalentes às operações `FLUSH` (flush.html): `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `flush-threads`, `refresh` e `reload`.

    O comando `reload` indica ao servidor que recarregue as tabelas de permissões na memória. `flush-privileges` é um sinônimo de `reload`. O comando `refresh` fecha e reabre os arquivos de log e esvazia todas as tabelas. Os outros comandos `flush-xxx` realizam funções semelhantes ao `refresh`, mas são mais específicos e podem ser preferíveis em alguns casos. Por exemplo, se você quiser esvaziar apenas os arquivos de log, `flush-logs` é uma escolha melhor do que `refresh`.

  - Uso das opções do **mysqldump** que realizam várias operações de `FLUSH`: `--flush-logs` e `--master-data`.

  - Uso da declaração `RESET`.

- `CLIENTE DE REPLICAÇÃO`

  Habilita o uso das instruções `SHOW MASTER STATUS`, `SHOW SLAVE STATUS` e `SHOW BINARY LOGS`.

- `ESCRAVO DE REPLICAÇÃO`

  Habilita a conta a solicitar atualizações que foram feitas em bancos de dados no servidor de origem, usando as instruções `SHOW SLAVE HOSTS`, `SHOW RELAYLOG EVENTS` e `SHOW BINLOG EVENTS`. Este privilégio também é necessário para usar as opções do **mysqlbinlog** `--read-from-remote-server` (`-R`) e `--read-from-remote-master`. Conceda este privilégio às contas que são usadas pelos servidores replicados para se conectarem ao servidor atual como sua origem.

- `SELECT`

  Permite que as linhas sejam selecionadas a partir de tabelas em um banco de dados. As instruções `[SELECT]` (select.html) exigem o privilégio `[SELECT]` (privileges-provided.html#priv\_select) apenas se elas realmente acessarem tabelas. Algumas instruções `[SELECT]` (select.html) não acessam tabelas e podem ser executadas sem permissão para qualquer banco de dados. Por exemplo, você pode usar `[SELECT]` (select.html) como uma calculadora simples para avaliar expressões que não fazem referência a tabelas:

  ```sql
  SELECT 1+1;
  SELECT PI()*2;
  ```

  O privilégio `SELECT` também é necessário para outras instruções que leem valores de coluna. Por exemplo, o `SELECT` é necessário para colunas referenciadas no lado direito da atribuição *`col_name`*=*`expr`* em instruções `UPDATE`, ou para colunas nomeadas na cláusula `WHERE` de instruções `DELETE` ou `UPDATE`.

  O privilégio `SELECT` é necessário para tabelas ou visualizações usadas com `EXPLAIN`, incluindo quaisquer tabelas subjacentes nas definições de visualizações.

- `Mostrar bancos de dados`

  Habilita a conta a ver os nomes dos bancos de dados ao emitir a instrução `SHOW DATABASE`. As contas que não têm esse privilégio veem apenas os bancos de dados para os quais têm algum privilégio e não podem usar a instrução de forma alguma se o servidor foi iniciado com a opção `--skip-show-database`.

  Cuidado

  Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de bases de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

- `Mostrar visualização`

  Habilita o uso da instrução `SHOW CREATE VIEW`. Este privilégio também é necessário para vistas usadas com `EXPLAIN`.

- `SHUTDOWN`

  Permite o uso da instrução `SHUTDOWN`, do comando **mysqladmin shutdown** e da função C API `mysql_shutdown()`.

- `SUPER`

  Afeta as seguintes operações e comportamentos do servidor:

  - Permite alterações na configuração do servidor modificando variáveis de sistema globais. Para algumas variáveis de sistema, definir o valor da sessão também requer o privilégio `SUPER`. Se uma variável de sistema estiver restrita e exigir um privilégio especial para definir o valor da sessão, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format`, `sql_log_bin` e `sql_log_off`. Veja também Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

  - Permite alterações nas características das transações globais (consulte Seção 13.3.6, “Instrução SET TRANSACTION”).

  - Permite que a conta inicie e pare a replicação, incluindo a replicação em grupo.

  - Habilita o uso das instruções `CHANGE MASTER TO` e `CHANGE REPLICATION FILTER`.

  - Habilita o controle do log binário por meio das instruções `PURGE BINARY LOGS` e `BINLOG`.

  - Permite definir o ID de autorização efetivo ao executar uma visualização ou um programa armazenado. Um usuário com esse privilégio pode especificar qualquer conta no atributo `DEFINER` de uma visualização ou programa armazenado.

  - Permite o uso das instruções `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`.

  - Habilita o uso do comando **mysqladmin debug**.

  - Habilita a rotação da chave de criptografia do InnoDB.

  - Permite a leitura do arquivo de chave DES pela função [`DES_ENCRYPT()`](https://docs.php.net/en/manual/encryption-functions.html#function_des-encrypt).

  - Habilita a execução das funções dos Tokens de Versão.

  - Permite o controle sobre as conexões do cliente que não são permitidas para contas não-`SUPER`:

    - Permite o uso da instrução `KILL` ou do comando **mysqladmin kill** para matar threads pertencentes a outras contas. (Uma conta sempre pode matar suas próprias threads.)

    - O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `SUPER` se conectam.

    - O servidor aceita uma conexão de um cliente `SUPER`, mesmo que o limite de conexões configurado pela variável de sistema `max_connections` tenha sido atingido.

    - Um servidor em modo offline (`offline_mode` ativado) não encerra as conexões do cliente `SUPER` na próxima solicitação do cliente e aceita novas conexões de clientes `SUPER`.

    - As atualizações podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabelas e ao uso de declarações de gerenciamento de contas, como `GRANT` e `REVOKE`, que atualizam tabelas implicitamente.

  Você também pode precisar do privilégio `SUPER` para criar ou alterar funções armazenadas se o registro binário estiver habilitado, conforme descrito na Seção 23.7, “Registro Binário de Programas Armazenados”.

- `TRIGGER`

  Habilita operações de gatilho. Você deve ter esse privilégio para que uma tabela possa criar, excluir, executar ou exibir gatilhos para essa tabela.

  Quando um gatilho é ativado (por um usuário que tem privilégios para executar instruções de `INSERT` (`insert.html`), `UPDATE` (`update.html`) ou `DELETE` (`delete.html`) para a tabela associada ao gatilho), a execução do gatilho exige que o usuário que definiu o gatilho ainda tenha o privilégio `TRIGGER` (`privileges-provided.html#priv_trigger`) para a tabela.

- `ATUALIZAR`

  Permite que as linhas sejam atualizadas em tabelas de um banco de dados.

- `USO`

  Este especificador de privilégio significa “sem privilégios”. Ele é usado a nível global com `GRANT` para modificar atributos de conta, como limites de recursos ou características SSL, sem nomear privilégios específicos da conta na lista de privilégios. `SHOW GRANTS` exibe `USAGE` para indicar que uma conta não tem privilégios em um nível de privilégio.

#### Diretrizes de concessão de privilégios

É uma boa ideia conceder a uma conta apenas os privilégios que ela precisa. Você deve ter cuidado especial ao conceder os privilégios `FILE` e administrativos:

- `FILE` pode ser abusado para ler em uma tabela de banco de dados quaisquer arquivos que o servidor MySQL possa ler no host do servidor. Isso inclui todos os arquivos que podem ser lidos por qualquer pessoa no mundo e arquivos no diretório de dados do servidor. A tabela pode então ser acessada usando `SELECT` para transferir seu conteúdo para o host do cliente.

- A opção `GRANT OPTION` (privilegios concedidos) permite que os usuários atribuam seus privilégios a outros usuários. Dois usuários que possuem privilégios diferentes e com o privilégio `GRANT OPTION` (privilegios concedidos) podem combinar os privilégios.

- `ALTER` pode ser usado para reverter o sistema de privilégios renomeando tabelas.

- `SHUTDOWN` pode ser abusado para negar o serviço a outros usuários por completo, ao encerrar o servidor.

- O `PROCESSO` pode ser usado para visualizar o texto simples das instruções atualmente em execução, incluindo instruções que definem ou alteram senhas.

- `SUPER` pode ser usado para encerrar outras sessões ou alterar a forma como o servidor opera.

- Os privilégios concedidos para o próprio banco de dados do sistema `mysql` podem ser usados para alterar senhas e outras informações de privilégios de acesso:

  - As senhas são armazenadas criptografadas, portanto, um usuário malicioso não pode simplesmente lê-las para saber a senha em texto simples. No entanto, um usuário com acesso de escrita à coluna `authentication_string` da tabela `mysql.user` do sistema pode alterar a senha de uma conta e, em seguida, se conectar ao servidor MySQL usando essa conta.

  - As permissões ``INSERT` ou ``UPDATE` concedidas para o banco de dados do sistema `mysql` permitem que um usuário adicione permissões ou modifique permissões existentes, respectivamente.

  - `DROP` para o banco de dados do sistema `mysql` permite que um usuário remova tabelas de privilégios ou até mesmo o próprio banco de dados.
