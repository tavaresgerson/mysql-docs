## 6.2 Controle de Acesso e Gerenciamento de Conta

O MySQL permite a criação de contas que permitem que os usuários clientes se conectem ao servidor e acessem dados gerenciados pelo servidor. A função principal do sistema de privilégios do MySQL é autenticar um usuário que se conecta a partir de um host específico e associar esse usuário com privilégios em um banco de dados, como `SELECT`, `INSERT`, `UPDATE` e `DELETE`. A funcionalidade adicional inclui a capacidade de conceder privilégios para operações administrativas.

Para controlar quais usuários podem se conectar, cada conta pode ser atribuída a credenciais de autenticação, como uma senha. A interface de usuário para contas MySQL consiste em declarações SQL, como `CREATE USER`, `GRANT` e `REVOKE`. Veja a Seção 13.7.1, “Declarações de Gerenciamento de Conta”.

O sistema de privilégios do MySQL garante que todos os usuários possam realizar apenas as operações permitidas a eles. Como usuário, quando você se conecta a um servidor MySQL, sua identidade é determinada por *o host do qual você se conecta* e *o nome de usuário que você especifica*. Quando você emite solicitações após se conectar, o sistema concede privilégios de acordo com sua identidade e *o que você deseja fazer*.

O MySQL considera tanto o nome do seu host quanto o nome do usuário para identificá-lo, pois não há motivo para supor que um nome de usuário específico pertença à mesma pessoa em todos os hosts. Por exemplo, o usuário `joe` que se conecta a partir de `office.example.com` não precisa ser a mesma pessoa que o usuário `joe` que se conecta a partir de `home.example.com`. O MySQL lida com isso, permitindo que você distinga usuários em diferentes hosts que, por acaso, tenham o mesmo nome: você pode conceder um conjunto de privilégios para conexões por `joe` a partir de `office.example.com`, e um conjunto de privilégios diferente para conexões por `joe` a partir de `home.example.com`. Para ver quais privilégios uma conta específica tem, use a declaração `SHOW GRANTS`. Por exemplo:

```sql
SHOW GRANTS FOR 'joe'@'office.example.com';
SHOW GRANTS FOR 'joe'@'home.example.com';
```

Internamente, o servidor armazena informações de privilégio nas tabelas de concessão do banco de dados do sistema `mysql`. O servidor MySQL lê o conteúdo dessas tabelas na memória quando é iniciado e baseia as decisões de controle de acesso nas cópias de memória das tabelas de concessão.

O controle de acesso do MySQL envolve duas etapas quando você executa um programa cliente que se conecta ao servidor:

**Etapa 1:** O servidor aceita ou rejeita a conexão com base na sua identidade e se você pode verificar sua identidade fornecendo a senha correta.

**Etapa 2:** Supondo que você possa se conectar, o servidor verifica cada declaração que você emite para determinar se você tem privilégios suficientes para executá-la. Por exemplo, se você tentar selecionar linhas de uma tabela em um banco de dados ou excluir uma tabela do banco de dados, o servidor verifica se você tem o privilégio `SELECT` para a tabela ou o privilégio `DROP` para o banco de dados.

Para uma descrição mais detalhada do que acontece em cada etapa, consulte a Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”, e a Seção 6.2.6, “Controle de Acesso, Etapa 2: Verificação de Solicitação”. Para obter ajuda no diagnóstico de problemas relacionados a privilégios, consulte a Seção 6.2.17, “Solucionando Problemas de Conexão com o MySQL”.

Se seus privilégios forem alterados (por você ou por outra pessoa) enquanto você estiver conectado, essas alterações não necessariamente terão efeito imediatamente na próxima declaração que você emitir. Para obter detalhes sobre as condições sob as quais o servidor recarrega as tabelas de concessão, consulte a Seção 6.2.9, “Quando as Alterações de Privilegio Têm Efeito”.

Há algumas coisas que você não pode fazer com o sistema de privilégios do MySQL:

* Você não pode especificar explicitamente que um usuário específico deve ser negado o acesso. Isso significa que você não pode corresponder explicitamente a um usuário e, em seguida, recusar a conexão.

* Não é possível especificar que um usuário tenha privilégios para criar ou descartar tabelas em um banco de dados, mas não para criar ou descartar o próprio banco de dados.

* Uma senha se aplica globalmente a uma conta. Você não pode associar uma senha a um objeto específico, como um banco de dados, uma tabela ou uma rotina.

### 6.2.1 Nomes de Usuários e Senhas de Conta

O MySQL armazena as contas na tabela `user` do banco de dados do sistema `mysql`. Uma conta é definida em termos de um nome de usuário e o host ou hosts do cliente a partir dos quais o usuário pode se conectar ao servidor. Para informações sobre a representação da conta na tabela `user`, consulte a Seção 6.2.3, “Tabelas de Concessão”.

Uma conta também pode ter credenciais de autenticação, como uma senha. As credenciais são manipuladas pelo plugin de autenticação da conta. O MySQL suporta vários plugins de autenticação. Alguns deles usam métodos de autenticação integrados, enquanto outros permitem a autenticação usando métodos de autenticação externos. Veja a Seção 6.2.13, “Autenticação Conectada”.

Há várias distinções entre a forma como os nomes de usuário e as senhas são usados pelo MySQL e pelo seu sistema operacional:

* Os nomes de usuário, como são usados pelo MySQL para fins de autenticação, não têm nada a ver com os nomes de usuário (nomes de login) usados pelo Windows ou Unix. No Unix, a maioria dos clientes MySQL, por padrão, tenta fazer login usando o nome de usuário atual do Unix como o nome de usuário do MySQL, mas isso é apenas para conveniência. O padrão pode ser facilmente ignorado, porque os programas de cliente permitem que qualquer nome de usuário seja especificado com a opção `-u` ou `--user`. Isso significa que qualquer pessoa pode tentar se conectar ao servidor usando qualquer nome de usuário, então você não pode tornar um banco de dados seguro de nenhuma maneira, a menos que todas as contas do MySQL tenham senhas. Qualquer pessoa que especifique um nome de usuário para uma conta que não tem senha pode se conectar com sucesso ao servidor.

* Os nomes de usuário do MySQL podem ter até 32 caracteres. Os nomes de usuário do sistema operacional podem ter um comprimento máximo diferente.

Aviso

O limite de comprimento do nome do usuário do MySQL é codificado em servidores e clientes MySQL, e tentar contorná-lo modificando as definições das tabelas no banco de dados `mysql` *não funciona*.

Você nunca deve alterar a estrutura das tabelas no banco de dados `mysql` de qualquer maneira, exceto por meio do procedimento que é descrito na Seção 2.10, “Atualização do MySQL”. Tentar redefinir as tabelas do sistema do MySQL de qualquer outra maneira resulta em comportamento indefinido e não suportado. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

* Para autenticar as conexões dos clientes para contas que utilizam métodos de autenticação integrados, o servidor usa senhas armazenadas na tabela `user`. Essas senhas são distintas das senhas para fazer login no seu sistema operacional. Não há conexão necessária entre a senha "externa" que você usa para fazer login em uma máquina Windows ou Unix e a senha que você usa para acessar o servidor MySQL naquela máquina.

Se o servidor autentica um cliente usando algum outro plugin, o método de autenticação que o plugin implementa pode ou não usar uma senha armazenada na tabela `user`. Nesse caso, é possível que uma senha externa também seja usada para autenticar-se no servidor MySQL.

* As senhas armazenadas na tabela `user` são criptografadas usando algoritmos específicos do plugin. Para informações sobre a criptografia de senhas nativa do MySQL, consulte a Seção 6.1.2.4, “Criptografia de senhas no MySQL”.

* Se o nome de usuário e a senha contiverem apenas caracteres ASCII, é possível se conectar ao servidor, independentemente das configurações do conjunto de caracteres. Para habilitar conexões quando o nome de usuário ou a senha contiverem caracteres não ASCII, as aplicações cliente devem chamar a função `mysql_options()` da API C com a opção `MYSQL_SET_CHARSET_NAME` e o nome apropriado do conjunto de caracteres como argumentos. Isso faz com que a autenticação ocorra usando o conjunto de caracteres especificado. Caso contrário, a autenticação falha, a menos que o conjunto de caracteres padrão do servidor seja o mesmo que o codificação nos padrões de autenticação padrão.

Os programas padrão de cliente MySQL suportam a opção `--default-character-set` que faz com que `mysql_options()` seja chamado conforme descrito. Além disso, a autodetecção de conjuntos de caracteres é suportada conforme descrito na Seção 10.4, “Conjunto de caracteres de conexão e colatitudes”. Para programas que usam um conector que não é baseado na API C, o conector pode fornecer um equivalente a `mysql_options()` que pode ser usado em vez disso. Verifique a documentação do conector.

As notas anteriores não se aplicam a `ucs2`, `utf16` e `utf32`, que não são permitidos como conjuntos de caracteres do cliente.

O processo de instalação do MySQL preenche as tabelas de concessão com uma conta inicial `root`, conforme descrito na Seção 2.9.4, “Segurando a Conta Inicial do MySQL”, que também discute como atribuir uma senha a ela. Posteriormente, você normalmente configura, modifica e remove contas do MySQL usando declarações como `CREATE USER`, `DROP USER`, `GRANT` e `REVOKE`. Veja a Seção 6.2.7, “Adicionar Contas, Atribuir Privilegios e Remover Contas”, e a Seção 13.7.1, “Declarações de Gerenciamento de Conta”.

Para se conectar a um servidor MySQL com um cliente de linha de comando, especifique as opções de nome de usuário e senha conforme necessário para a conta que você deseja usar:

```sql
$> mysql --user=finley --password db_name
```

Se você prefere opções curtas, o comando é o seguinte:

```sql
$> mysql -u finley -p db_name
```

Se você omitir o valor da senha após a opção `--password` ou `-p` na linha de comando (como mostrado acima), o cliente solicitará uma senha. Alternativamente, a senha pode ser especificada na linha de comando:

```sql
$> mysql --user=finley --password=password db_name
$> mysql -u finley -ppassword db_name
```

Se você usar a opção `-p`, não deve haver *espaço* entre `-p` e o valor da senha a seguir.

Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte a Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. Para evitar fornecer a senha na linha de comando, use um arquivo de opção ou um arquivo de caminho de login. Consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”, e a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre a especificação de nomes de usuário, senhas e outros parâmetros de conexão, consulte a Seção 4.2.4, “Conectar ao servidor MySQL usando opções de comando”.

### 6.2.2 Privilegios fornecidos pelo MySQL

Os privilégios concedidos a uma conta MySQL determinam quais operações a conta pode realizar. Os privilégios do MySQL diferem nos contextos em que se aplicam e em diferentes níveis de operação:

* Os privilégios administrativos permitem que os usuários gerenciem a operação do servidor MySQL. Esses privilégios são globais, pois não são específicos para um banco de dados particular.

* Os privilégios do banco de dados se aplicam a um banco de dados e a todos os objetos dentro dele. Esses privilégios podem ser concedidos para bancos de dados específicos ou globalmente, para que se apliquem a todos os bancos de dados.

* Os privilégios para objetos de banco de dados, como tabelas, índices, visualizações e rotinas armazenadas, podem ser concedidos para objetos específicos dentro de um banco de dados, para todos os objetos de um determinado tipo dentro de um banco de dados (por exemplo, todas as tabelas em um banco de dados) ou globalmente para todos os objetos de um determinado tipo em todos os bancos de dados.

As informações sobre os privilégios da conta são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Para uma descrição da estrutura e do conteúdo dessas tabelas, consulte a Seção 6.2.3, “Tabelas de Concessão”. O servidor MySQL lê o conteúdo das tabelas de concessão na memória quando é iniciado e o recarrega nas circunstâncias indicadas na Seção 6.2.9, “Quando as Alterações de Privilegio Se Tornam Efetivas”. O servidor baseia as decisões de controle de acesso nas cópias de memória das tabelas de concessão.

Importante

Algumas versões do MySQL introduzem mudanças nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas capacidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Veja a Seção 2.10, “Atualizando o MySQL”.

As seções a seguir resumem os privilégios disponíveis, fornecem descrições mais detalhadas de cada privilégio e oferecem diretrizes de uso.

* Resumo dos privilégios disponíveis
* Descrições dos privilégios
* Diretrizes para concessão de privilégios

#### Resumo dos privilégios disponíveis

A tabela a seguir mostra os nomes de privilégio utilizados nas declarações `GRANT` e `REVOKE`, juntamente com o nome da coluna associada a cada privilégio nas tabelas de concessão e o contexto em que o privilégio se aplica.

**Tabela 6.2 Privilegios Permitidos para GRANDE e REVOGAÇÃO**

<table>
<col style="width: 30%"/>
<col style="width: 33%"/>
<col style="width: 37%"/>
<thead>
<tr>
<th>Privilege</th>
<th>Grant Table Column</th>
<th>Context</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>ALL [PRIVILEGES]</code></th>
<td>Sinônimo de “todos os privilégios”</td>
<td>Administração de servidores</td>
</tr>
<tr>
<th><code>ALTER</code></th>
<td><code>Alter_priv</code></td>
<td>Tables</td>
</tr>
<tr>
<th><code>ALTER ROUTINE</code></th>
<td><code>Alter_routine_priv</code></td>
<td>Stored routines</td>
</tr>
<tr>
<th><code>CREATE</code></th>
<td><code>Create_priv</code></td>
<td>Databases, tables, or indexes</td>
</tr>
<tr>
<th><code>CREATE ROUTINE</code></th>
<td><code>Create_routine_priv</code></td>
<td>Stored routines</td>
</tr>
<tr>
<th><code>CREATE TABLESPACE</code></th>
<td><code>Create_tablespace_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>CREATE TEMPORARY TABLES</code></th>
<td><code>Create_tmp_table_priv</code></td>
<td>Tables</td>
</tr>
<tr>
<th><code>CREATE USER</code></th>
<td><code>Create_user_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>CREATE VIEW</code></th>
<td><code>Create_view_priv</code></td>
<td>Views</td>
</tr>
<tr>
<th><code>DELETE</code></th>
<td><code>Delete_priv</code></td>
<td>Tables</td>
</tr>
<tr>
<th><code>DROP</code></th>
<td><code>Drop_priv</code></td>
<td>Databases, tables, or views</td>
</tr>
<tr>
<th><code>EVENT</code></th>
<td><code>Event_priv</code></td>
<td>Databases</td>
</tr>
<tr>
<th><code>EXECUTE</code></th>
<td><code>Execute_priv</code></td>
<td>Stored routines</td>
</tr>
<tr>
<th><code>FILE</code></th>
<td><code>File_priv</code></td>
<td>File access on server host</td>
</tr>
<tr>
<th><code>GRANT OPTION</code></th>
<td><code>Grant_priv</code></td>
<td>Bases de dados, tabelas ou rotinas armazenadas</td>
</tr>
<tr>
<th><code>INDEX</code></th>
<td><code>Index_priv</code></td>
<td>Tables</td>
</tr>
<tr>
<th><code>INSERT</code></th>
<td><code>Insert_priv</code></td>
<td>Tables or columns</td>
</tr>
<tr>
<th><code>LOCK TABLES</code></th>
<td><code>Lock_tables_priv</code></td>
<td>Databases</td>
</tr>
<tr>
<th><code>PROCESS</code></th>
<td><code>Process_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>PROXY</code></th>
<td>See <code>proxies_priv</code> table</td>
<td>Server administration</td>
</tr>
<tr>
<th><code>REFERENCES</code></th>
<td><code>References_priv</code></td>
<td>Databases or tables</td>
</tr>
<tr>
<th><code>RELOAD</code></th>
<td><code>Reload_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>REPLICATION CLIENT</code></th>
<td><code>Repl_client_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>REPLICATION SLAVE</code></th>
<td><code>Repl_slave_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>SELECT</code></th>
<td><code>Select_priv</code></td>
<td>Tables or columns</td>
</tr>
<tr>
<th><code>SHOW DATABASES</code></th>
<td><code>Show_db_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>SHOW VIEW</code></th>
<td><code>Show_view_priv</code></td>
<td>Views</td>
</tr>
<tr>
<th><code>SHUTDOWN</code></th>
<td><code>Shutdown_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>SUPER</code></th>
<td><code>Super_priv</code></td>
<td>Server administration</td>
</tr>
<tr>
<th><code>TRIGGER</code></th>
<td><code>Trigger_priv</code></td>
<td>Tables</td>
</tr>
<tr>
<th><code>UPDATE</code></th>
<td><code>Update_priv</code></td>
<td>Tables or columns</td>
</tr>
<tr>
<th><code>USAGE</code></th>
<td>Synonym for “no privileges”</td>
<td>Server administration</td>
</tr>
</tbody>
</table>

#### Descrições de privilégios

A lista a seguir fornece descrições gerais de cada privilégio disponível no MySQL. As instruções SQL específicas podem ter requisitos de privilégio mais específicos do que os indicados aqui. Se assim for, a descrição da declaração em questão fornece os detalhes.

* `ALL`, `ALL PRIVILEGES`

Esses especizadores de privilégio são abreviações para “todos os privilégios disponíveis em um nível de privilégio dado” (exceto `GRANT OPTION`). Por exemplo, conceder `ALL` no nível global ou de tabela concede todos os privilégios globais ou todos os privilégios de nível de tabela, respectivamente.

* `ALTER`

Permite o uso da declaração `ALTER TABLE` para alterar a estrutura das tabelas. `ALTER TABLE` também requer os privilégios `CREATE` e `INSERT`. Para renomear uma tabela, são necessários os privilégios `ALTER` e `DROP` na tabela antiga, `CREATE`, e `INSERT` na nova tabela.

* `ALTER ROUTINE`

Permite o uso de declarações que alteram ou excluem rotinas armazenadas (procedimentos e funções armazenadas).

* `CREATE`

Permite o uso de declarações que criam novos bancos de dados e tabelas.

* `CREATE ROUTINE`

Permite o uso de declarações que criam rotinas armazenadas (procedimentos e funções armazenadas).

* `CREATE TABLESPACE`

Permite o uso de declarações que criam, alteram ou eliminam espaços de tabela e grupos de arquivos de registro.

* `CREATE TEMPORARY TABLES`

Permite a criação de tabelas temporárias usando a declaração `CREATE TEMPORARY TABLE`.

Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégio na tabela. A sessão que criou a tabela pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`. Para mais informações, consulte a Seção 13.1.18.2, “Declaração CREATE TEMPORARY TABLE”.

* `CREATE USER`

Permite o uso das declarações `ALTER USER`, `CREATE USER`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`.

* `CREATE VIEW`

Permite o uso da declaração `CREATE VIEW`.

* `DELETE`

Permite a exclusão de linhas de tabelas em um banco de dados.

* `DROP`

Permite o uso de declarações que excluem (removem) bancos de dados, tabelas e visualizações existentes. O privilégio `DROP` é necessário para usar a declaração `ALTER TABLE ... DROP PARTITION` em uma tabela particionada. O privilégio `DROP` também é necessário para `TRUNCATE TABLE`.

* `EVENT`

Permite o uso de declarações que criam, alteram, excluem ou exibem eventos para o Agendamento de Eventos.

* `EXECUTE`

Permite o uso de declarações que executam rotinas armazenadas (procedimentos e funções armazenadas).

* `FILE`

Afeta as seguintes operações e comportamentos do servidor:

+ Permite a leitura e escrita de arquivos no host do servidor usando as declarações `LOAD DATA` e `SELECT ... INTO OUTFILE` e a função `LOAD_FILE()`. Um usuário que possui o privilégio `FILE` pode ler qualquer arquivo no host do servidor que seja legível para o mundo ou legível pelo servidor MySQL. (Isso implica que o usuário pode ler qualquer arquivo em qualquer diretório do banco de dados, porque o servidor pode acessar qualquer um desses arquivos.)

+ Permite a criação de novos arquivos em qualquer diretório onde o servidor MySQL tenha acesso de escrita. Isso inclui o diretório de dados do servidor, que contém os arquivos que implementam as tabelas de privilégio.

+ A partir do MySQL 5.7.17, permite o uso da opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` para a declaração `CREATE TABLE`.

Como medida de segurança, o servidor não sobrescreve os arquivos existentes.

Para limitar a localização em que os arquivos podem ser lidos e escritos, defina a variável de sistema `secure_file_priv` para um diretório específico. Veja a Seção 5.1.7, “Variáveis do sistema do servidor”.

* `GRANT OPTION`

Permite que você conceda ou revogue a outros usuários os privilégios que você mesmo possui.

* `INDEX`

Permite o uso de declarações que criam ou descartam (removem) índices. `INDEX` se aplica a tabelas existentes. Se você tem o privilégio `CREATE` para uma tabela, você pode incluir definições de índice na declaração `CREATE TABLE`.

* `INSERT`

Permite que linhas sejam inseridas em tabelas de um banco de dados. `INSERT` também é necessário para as declarações de manutenção de tabela `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* `LOCK TABLES`

Permite o uso de declarações explícitas `LOCK TABLES` para bloquear tabelas para as quais você tem o privilégio `SELECT`. Isso inclui o uso de bloqueios de escrita, que impede que outras sessões leiam a tabela bloqueada.

* `PROCESS`

O privilégio `PROCESS` controla o acesso às informações sobre os threads que estão sendo executados no servidor (ou seja, informações sobre as declarações que estão sendo executadas pelas sessões). As informações sobre os threads disponíveis usando a declaração `SHOW PROCESSLIST`, o comando **mysqladmin processlist**, a tabela `INFORMATION_SCHEMA.PROCESSLIST` e a tabela do Schema de Desempenho `processlist` são acessíveis da seguinte forma:

+ Com o privilégio `PROCESS`, um usuário tem acesso a informações sobre todas as threads, mesmo aquelas pertencentes a outros usuários.

+ Sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

Nota

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja a Seção 25.12.16.4, “A tabela de threads”.

O privilégio `PROCESS` também permite o uso da declaração `SHOW ENGINE`, acesso às tabelas `INFORMATION_SCHEMA` `InnoDB` (tabelas com nomes que começam com `INNODB_`), e (a partir do MySQL 5.7.31) acesso à tabela `INFORMATION_SCHEMA` `FILES`.

* `PROXY`

Permite que um usuário se imite ou se torne conhecido como outro usuário. Veja a Seção 6.2.14, “Usuários Proxy”.

* `REFERENCES`

A criação de uma restrição de chave estrangeira requer o privilégio `REFERENCES` para a tabela pai.

* `RELOAD`

O `RELOAD` permite as seguintes operações:

+ Uso da declaração `FLUSH`.

+ Uso dos comandos do **mysqladmin** que são equivalentes às operações do `FLUSH`: `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `flush-threads`, `refresh` e `reload`.

O comando `reload` indica ao servidor que recarregue as tabelas de concessão na memória. `flush-privileges` é sinônimo de `reload`. O comando `refresh` fecha e reabre os arquivos de registro e esvazia todas as tabelas. Os outros comandos `flush-xxx` realizam funções semelhantes a `refresh`, mas são mais específicos e podem ser preferíveis em algumas situações. Por exemplo, se você deseja esvaziar apenas os arquivos de registro, `flush-logs` é uma escolha melhor do que `refresh`.

+ Uso das opções do **mysqldump** que realizam várias operações do `FLUSH`: `--flush-logs` e `--master-data`.

+ Uso da declaração `RESET`.

* `REPLICATION CLIENT`

Permite o uso das declarações `SHOW MASTER STATUS`, `SHOW SLAVE STATUS` e `SHOW BINARY LOGS`.

* `REPLICATION SLAVE`

Permite que a conta solicite atualizações que foram feitas em bancos de dados no servidor de origem, usando as declarações `SHOW SLAVE HOSTS`, `SHOW RELAYLOG EVENTS` e `SHOW BINLOG EVENTS`. Este privilégio também é necessário para usar as opções **mysqlbinlog** `--read-from-remote-server` (`-R`) e `--read-from-remote-master`. Conceda este privilégio às contas que são usadas por servidores replicados para se conectarem ao servidor atual como sua fonte.

* `SELECT`

Permite que as linhas sejam selecionadas a partir de tabelas em um banco de dados. As declarações `SELECT` exigem o privilégio `SELECT` apenas se elas realmente acessarem tabelas. Algumas declarações `SELECT` não acessam tabelas e podem ser executadas sem permissão para qualquer banco de dados. Por exemplo, você pode usar `SELECT` como uma calculadora simples para avaliar expressões que não fazem referência a tabelas:

  ```sql
  SELECT 1+1;
  SELECT PI()*2;
  ```

O privilégio `SELECT` também é necessário para outras declarações que leem valores de coluna. Por exemplo, `SELECT` é necessário para colunas referenciadas no lado direito da atribuição de *`col_name`*=*`expr`* em declarações `UPDATE` ou para colunas nomeadas na cláusula `WHERE` de declarações `DELETE` ou `UPDATE`.

O privilégio `SELECT` é necessário para tabelas ou visualizações usadas com `EXPLAIN`, incluindo quaisquer tabelas subjacentes nas definições de visualizações.

* `SHOW DATABASES`

Permite que a conta veja os nomes dos bancos de dados emitindo a declaração `SHOW DATABASE`. As contas que não possuem esse privilégio veem apenas os bancos de dados para os quais possuem alguns privilégios e não podem usar a declaração de forma alguma se o servidor foi iniciado com a opção `--skip-show-database`.

Cuidado

Porque um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

* `SHOW VIEW`

Permite o uso da declaração `SHOW CREATE VIEW`. Este privilégio também é necessário para visualizações usadas com `EXPLAIN`.

* `SHUTDOWN`

Permite o uso da declaração `SHUTDOWN`, o comando **mysqladmin shutdown** e a função API C `mysql_shutdown()`.

* `SUPER`

Afeta as seguintes operações e comportamentos do servidor:

+ Permite alterações na configuração do servidor, modificando variáveis de sistema globais. Para algumas variáveis de sistema, definir o valor da sessão também requer o privilégio `SUPER`. Se uma variável de sistema estiver restrita e exigir um privilégio especial para definir o valor da sessão, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format`, `sql_log_bin` e `sql_log_off`. Veja também a Seção 5.1.8.1, “Privilégios de variáveis de sistema”.

+ Permite alterações nas características de transação global (consulte a Seção 13.3.6, “Instrução SET TRANSACTION”).

+ Permite que a conta comece e pare a replicação, incluindo a Replicação em Grupo.

+ Permite o uso das declarações `CHANGE MASTER TO` e `CHANGE REPLICATION FILTER`.

+ Permite o controle de registro binário por meio das declarações `PURGE BINARY LOGS` e `BINLOG`.

+ Permite definir o ID de autorização efetivo ao executar uma visão ou programa armazenado. Um usuário com este privilégio pode especificar qualquer conta no atributo `DEFINER` de uma visão ou programa armazenado.

+ Permite o uso das declarações `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`.

+ Permite o uso do comando **mysqladmin debug**.

+ Habilita a rotação da chave de criptografia `InnoDB`.

+ Permite a leitura do arquivo de chave DES pela função `DES_ENCRYPT()`.

+ Permite a execução das funções dos Tokens de Versão.
+ Permite o controle sobre as conexões do cliente que não são permitidas para contas que não são `SUPER`:

- Permite o uso da declaração `KILL` ou do comando **mysqladmin kill** para matar os threads pertencentes a outras contas. (Uma conta sempre pode matar seus próprios threads.)

- O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `SUPER` se conectam.

- O servidor aceita uma conexão de um cliente `SUPER`, mesmo que o limite de conexão configurado pela variável de sistema `max_connections` seja atingido.

- Um servidor em modo offline (habilitado `offline_mode`) não encerra as conexões do cliente `SUPER` na próxima solicitação do cliente e aceita novas conexões dos clientes `SUPER`.

- As atualizações podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabela e ao uso de declarações de gerenciamento de contas, como `GRANT` e `REVOKE`, que atualizam tabelas implicitamente.

Você também pode precisar do privilégio `SUPER` para criar ou alterar funções armazenadas se o registro binário estiver habilitado, conforme descrito na Seção 23.7, “Registro Binário de Programas Armazenados”.

* `TRIGGER`

Permite operações de gatilho. Você deve ter esse privilégio para criar, descartar, executar ou exibir gatilhos para uma tabela.

Quando um gatilho é ativado (por um usuário que tem privilégios para executar as declarações `INSERT`, `UPDATE` ou `DELETE` para a tabela associada ao gatilho), a execução do gatilho exige que o usuário que definiu o gatilho ainda tenha o privilégio `TRIGGER` para a tabela.

* `UPDATE`

Permite que as linhas sejam atualizadas em tabelas de um banco de dados.

* `USAGE`

Este especificador de privilégio significa “sem privilégios”. É usado a nível global com `GRANT` para modificar atributos de conta, como limites de recursos ou características SSL, sem nomear privilégios específicos da conta na lista de privilégios. `SHOW GRANTS` exibe `USAGE` para indicar que uma conta não tem privilégios em um nível de privilégio.

#### Diretrizes de concessão de privilégios

É uma boa ideia conceder a uma conta apenas os privilégios que ela precisa. Você deve exercer cuidados especiais ao conceder os privilégios `FILE` e administrativos:

* `FILE` pode ser abusado para ler em uma tabela de banco de dados quaisquer arquivos que o servidor MySQL possa ler no host do servidor. Isso inclui todos os arquivos que podem ser lidos por qualquer pessoa no mundo e arquivos no diretório de dados do servidor. A tabela pode então ser acessada usando `SELECT` para transferir seu conteúdo para o host do cliente.

* `GRANT OPTION` permite que os usuários dêem seus privilégios a outros usuários. Dois usuários que têm privilégios diferentes e com o privilégio `GRANT OPTION` são capazes de combinar privilégios.

* `ALTER` pode ser usado para subverter o sistema de privilégios ao renomear tabelas.

* `SHUTDOWN` pode ser abusado para negar serviço a outros usuários inteiramente ao encerrar o servidor.

* `PROCESS` pode ser usado para visualizar o texto simples das declarações atualmente em execução, incluindo as declarações que definem ou alteram senhas.

* `SUPER` pode ser usado para encerrar outras sessões ou alterar a forma como o servidor opera.

* Os privilégios concedidos para o próprio banco de dados do sistema `mysql` podem ser usados para alterar senhas e outras informações de privilégios de acesso:

+ As senhas são armazenadas criptografadas, portanto, um usuário malicioso não pode simplesmente lê-las para saber a senha em texto simples. No entanto, um usuário com acesso de escrita à tabela do sistema `mysql.user` coluna `authentication_string` pode alterar a senha de uma conta e, em seguida, se conectar ao servidor MySQL usando essa conta.

+ `INSERT` ou `UPDATE` concedidos para o banco de dados do sistema `mysql` permitem que o usuário adicione privilégios ou modifique privilégios existentes, respectivamente.

+ `DROP` para o banco de dados do sistema `mysql` permite que um usuário remova tabelas de privilégio, ou até mesmo o próprio banco de dados.

### 6.2.3 Tabelas de subvenções

O banco de dados do sistema `mysql` inclui várias tabelas de concessão que contêm informações sobre as contas de usuário e os privilégios que elas possuem. Esta seção descreve essas tabelas. Para informações sobre outras tabelas no banco de dados do sistema, consulte a Seção 5.3, “O Banco de Dados do Sistema mysql”.

A discussão aqui descreve a estrutura subjacente das tabelas de concessão e como o servidor usa seu conteúdo ao interagir com os clientes. No entanto, normalmente, você não modifica as tabelas de concessão diretamente. As modificações ocorrem indiretamente quando você usa declarações de gerenciamento de contas, como `CREATE USER`, `GRANT` e `REVOKE`, para configurar contas e controlar os privilégios disponíveis para cada uma. Veja a Seção 13.7.1, “Declarações de Gerenciamento de Conta”. Quando você usa essas declarações para realizar manipulações de conta, o servidor modifica as tabelas de concessão em seu nome.

Nota

A modificação direta das tabelas de subsídios usando declarações como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua conta e risco. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

A partir do MySQL 5.7.18, para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela possui a estrutura esperada e produz um erro se não o fizer. Para atualizar as tabelas para a estrutura esperada, realize o procedimento de atualização do MySQL. Veja a Seção 2.10, “Atualizando o MySQL”.

* Visão geral da tabela de concessão
* Tabelas de concessão de usuário e db
* Tabelas de concessão de tabelas e colunas _tables_priv
* Tabela de concessão de processos _procs_priv
* Tabela de concessão de proxies _proxies_priv
* Propriedades de coluna de escopo da tabela de concessão
* Propriedades de coluna de privilégio da tabela de concessão

#### Visão geral da tabela de subsídios

Essas tabelas do banco de dados `mysql` contêm informações de concessão:

* `user`: Contas de usuário, privilégios globais e outras colunas não de privilégio.

* `db`: Privilegios de nível de banco de dados.

* `tables_priv`: Privilegios de nível de tabela.

* `columns_priv`: Privilegios em nível de coluna.

* `procs_priv`: Permissões de procedimentos e funções armazenadas.

* `proxies_priv`: Privilegios do usuário proxy.

Cada tabela de subsídio contém colunas de escopo e colunas de privilégio:

* As colunas de escopo determinam o escopo de cada linha nas tabelas; ou seja, o contexto em que a linha se aplica. Por exemplo, uma linha de tabela `user` com os valores `Host` e `User` de `'h1.example.net'` e `'bob'` se aplica para autenticar conexões feitas ao servidor a partir do host `h1.example.net` por um cliente que especifica um nome de usuário de `bob`. Da mesma forma, uma linha de tabela `db` com os valores das colunas `Host`, `User` e `Db` de `'h1.example.net'`, `'bob'` e `'reports'` se aplica quando `bob` se conecta a partir do host `h1.example.net` para acessar o banco de dados `reports`. As tabelas `tables_priv` e `columns_priv` contêm colunas de escopo que indicam tabelas ou combinações de tabelas/colunas às quais cada linha se aplica. As colunas de escopo `procs_priv` indicam a rotina armazenada à qual cada linha se aplica.

* As colunas de privilégio indicam quais privilégios uma linha de tabela concede, ou seja, quais operações ela permite que sejam realizadas. O servidor combina as informações nas várias tabelas de concessão para formar uma descrição completa dos privilégios de um usuário. A Seção 6.2.6, “Controle de Acesso, Etapa 2: Solicitação de Verificação”, descreve as regras para isso.

Além disso, uma tabela de subsídios pode conter colunas usadas para fins que não a avaliação de escopo ou privilégio.

O servidor utiliza as tabelas de concessão da seguinte maneira:

* As colunas de escopo da tabela `user` determinam se as conexões recebidas devem ser rejeitadas ou permitidas. Para conexões permitidas, quaisquer privilégios concedidos na tabela `user` indicam os privilégios globais do usuário. Quaisquer privilégios concedidos nesta tabela se aplicam a *todas* as bases de dados no servidor.

Cuidado

Porque um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

* As colunas de escopo da tabela `db` determinam quais usuários podem acessar quais bancos de dados de quais hosts. As colunas de privilégio determinam as operações permitidas. Um privilégio concedido no nível do banco de dados aplica-se ao banco de dados e a todos os objetos no banco de dados, como tabelas e programas armazenados.

* As tabelas `tables_priv` e `columns_priv` são semelhantes à tabela `db`, mas são mais detalhadas: Elas se aplicam aos níveis de tabela e coluna, e não ao nível do banco de dados. Um privilégio concedido ao nível da tabela se aplica à tabela e a todas as suas colunas. Um privilégio concedido ao nível da coluna se aplica apenas a uma coluna específica.

* A tabela `procs_priv` se aplica a rotinas armazenadas (procedimentos e funções armazenadas). Um privilégio concedido no nível da rotina aplica-se apenas a um único procedimento ou função.

* A tabela `proxies_priv` indica quais usuários podem atuar como representantes de outros usuários e se um usuário pode conceder o privilégio `PROXY` a outros usuários.

O servidor lê o conteúdo das tabelas de concessão na memória quando ele é iniciado. Você pode dizer que ele recarregue as tabelas emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**. As alterações nas tabelas de concessão entram em vigor conforme indicado na Seção 6.2.9, “Quando as Alterações de Privilegio Entram em Efeito”.

Quando você modifica uma conta, é uma boa ideia verificar se suas alterações têm o efeito desejado. Para verificar os privilégios de uma conta específica, use a declaração `SHOW GRANTS`. Por exemplo, para determinar os privilégios concedidos a uma conta com os valores de nome de usuário e nome de host de `bob` e `pc84.example.com`, use esta declaração:

```sql
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

Para exibir propriedades não privilegiadas de uma conta, use `SHOW CREATE USER`:

```sql
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### As tabelas de usuários e de concessão de acesso (db Grant)

O servidor utiliza as tabelas `user` e `db` no banco de dados `mysql` em ambas as primeiras e segundas etapas do controle de acesso (ver Seção 6.2, “Controle de Acesso e Gerenciamento de Conta”). As colunas das tabelas `user` e `db` são mostradas aqui.

**Tabela 6.3 Colunas de tabelas usuário e db**

<table>
<col style="width: 40%"/>
<col style="width: 30%"/>
<col style="width: 30%"/>
<thead>
<tr>
<th>Table Name</th>
<th><code>user</code></th>
<th><code>db</code></th>
</tr>
</thead>
<tbody>
<tr>
<th><strong>Scope columns</strong></th>
<td><code>Host</code></td>
<td><code>Host</code></td>
</tr>
<tr>
<th></th>
<td><code>User</code></td>
<td><code>Db</code></td>
</tr>
<tr>
<th></th>
<td></td>
<td><code>User</code></td>
</tr>
<tr>
<th><strong>Privilege columns</strong></th>
<td><code>Select_priv</code></td>
<td><code>Select_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Insert_priv</code></td>
<td><code>Insert_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Update_priv</code></td>
<td><code>Update_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Delete_priv</code></td>
<td><code>Delete_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Index_priv</code></td>
<td><code>Index_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Alter_priv</code></td>
<td><code>Alter_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Create_priv</code></td>
<td><code>Create_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Drop_priv</code></td>
<td><code>Drop_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Grant_priv</code></td>
<td><code>Grant_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Create_view_priv</code></td>
<td><code>Create_view_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Show_view_priv</code></td>
<td><code>Show_view_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Create_routine_priv</code></td>
<td><code>Create_routine_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Alter_routine_priv</code></td>
<td><code>Alter_routine_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Execute_priv</code></td>
<td><code>Execute_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Trigger_priv</code></td>
<td><code>Trigger_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Event_priv</code></td>
<td><code>Event_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Create_tmp_table_priv</code></td>
<td><code>Create_tmp_table_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Lock_tables_priv</code></td>
<td><code>Lock_tables_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>References_priv</code></td>
<td><code>References_priv</code></td>
</tr>
<tr>
<th></th>
<td><code>Reload_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Shutdown_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Process_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>File_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Show_db_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Super_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Repl_slave_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Repl_client_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Create_user_priv</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>Create_tablespace_priv</code></td>
<td></td>
</tr>
<tr>
<th><strong>Security columns</strong></th>
<td><code>ssl_type</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>ssl_cipher</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>x509_issuer</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>x509_subject</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>plugin</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>authentication_string</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>password_expired</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>password_last_changed</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>password_lifetime</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>account_locked</code></td>
<td></td>
</tr>
<tr>
<th><strong>Resource control columns</strong></th>
<td><code>max_questions</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>max_updates</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>max_connections</code></td>
<td></td>
</tr>
<tr>
<th></th>
<td><code>max_user_connections</code></td>
<td></td>
</tr>
</tbody>
</table>

As colunas `user` da tabela `plugin` e `authentication_string` armazenam informações sobre o plugin de autenticação e as credenciais.

O servidor utiliza o plugin nomeado na coluna `plugin` de uma linha de conta para autenticar as tentativas de conexão para a conta.

A coluna `plugin` deve estar não vazia. No momento inicial e no momento de execução do `FLUSH PRIVILEGES`, o servidor verifica as linhas da tabela `user`. Para qualquer linha com uma coluna `plugin` vazia, o servidor escreve um aviso no log de erro deste formulário:

```sql
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

Para resolver esse problema, consulte a Seção 6.4.1.3, “Migrando para fora da criptografia de hash de senha pré-4.1 e do plugin mysql\_old\_password”.

A coluna `password_expired` permite que os DBAs expiram as senhas das contas e exijam que os usuários refaçam suas senhas. O valor padrão `password_expired` é `'N'`, mas pode ser definido como `'Y'` com a declaração `ALTER USER`. Após a senha de uma conta ter sido expirada, todas as operações realizadas pela conta em conexões subsequentes ao servidor resultam em um erro até que o usuário emita uma declaração `ALTER USER` para estabelecer uma nova senha da conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.

`password_last_changed` é uma coluna `TIMESTAMP` que indica quando a senha foi alterada pela última vez. O valor não é `NULL` apenas para contas que utilizam métodos de autenticação internos do MySQL (contas que utilizam um plugin de autenticação de `mysql_native_password` ou `sha256_password`). O valor é `NULL` para outras contas, como aquelas autenticadas usando um sistema de autenticação externo.

`password_last_changed` é atualizado pelas declarações `CREATE USER`, `ALTER USER` e `SET PASSWORD`, e pelas declarações `GRANT` que criam uma conta ou alteram a senha de uma conta.

`password_lifetime` indica a vida útil da senha da conta, em dias. Se a senha tiver expirado (avaliada usando a coluna `password_last_changed`, o servidor considera que a senha expirou quando os clientes se conectam usando a conta. Um valor de *`N`* maior que zero significa que a senha deve ser alterada a cada *`N`* dias. Um valor de 0 desativa a expiração automática da senha. Se o valor for `NULL` (o padrão), a política de expiração global se aplica, conforme definido pela variável de sistema `default_password_lifetime`.

`account_locked` indica se a conta está bloqueada (consulte a Seção 6.2.15, “Bloqueio de conta”).

#### As tabelas\_priv e as colunas\_priv Conceder tabelas

Durante a segunda etapa do controle de acesso, o servidor realiza a verificação da solicitação para garantir que cada cliente tenha privilégios suficientes para cada solicitação que emite. Além das tabelas de concessão `user` e `db`, o servidor também pode consultar as tabelas `tables_priv` e `columns_priv` para solicitações que envolvem tabelas. Essas últimas tabelas fornecem um controle de privilégio mais preciso nos níveis de tabela e coluna. Elas possuem as colunas mostradas na tabela a seguir.

**Tabela 6.4 colunas_priv e colunas_priv da tabela columns**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Table Name</th> <th><code>tables_priv</code></th> <th><code>columns_priv</code></th> </tr></thead><tbody><tr> <th><strong>Scope columns</strong></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th></th> <td><code>Db</code></td> <td><code>Db</code></td> </tr><tr> <th></th> <td><code>User</code></td> <td><code>User</code></td> </tr><tr> <th></th> <td><code>Table_name</code></td> <td><code>Table_name</code></td> </tr><tr> <th></th> <td></td> <td><code>Column_name</code></td> </tr><tr> <th><strong>Privilege columns</strong></th> <td><code>Table_priv</code></td> <td><code>Column_priv</code></td> </tr><tr> <th></th> <td><code>Column_priv</code></td> <td></td> </tr><tr> <th><strong>Other columns</strong></th> <td><code>Timestamp</code></td> <td><code>Timestamp</code></td> </tr><tr> <th></th> <td><code>Grantor</code></td> <td></td> </tr></tbody></table>

As colunas `Timestamp` e `Grantor` são definidas como o timestamp atual e o valor da `CURRENT_USER`, respectivamente, mas, de outra forma, não são utilizadas.

#### A tabela de concessão procs\_priv

Para a verificação de solicitações que envolvem rotinas armazenadas, o servidor pode consultar a tabela `procs_priv`, que possui as colunas mostradas na tabela a seguir.

**Tabela 6.5 Colunas da tabela procs\_priv**

<table><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Table Name</th> <th><code>procs_priv</code></th> </tr></thead><tbody><tr> <td><strong>Scope columns</strong></td> <td><code>Host</code></td> </tr><tr> <td></td> <td><code>Db</code></td> </tr><tr> <td></td> <td><code>User</code></td> </tr><tr> <td></td> <td><code>Routine_name</code></td> </tr><tr> <td></td> <td><code>Routine_type</code></td> </tr><tr> <td><strong>Privilege columns</strong></td> <td><code>Proc_priv</code></td> </tr><tr> <td><strong>Other columns</strong></td> <td><code>Timestamp</code></td> </tr><tr> <td></td> <td><code>Grantor</code></td> </tr></tbody></table>

A coluna `Routine_type` é uma coluna `ENUM` com valores de `'FUNCTION'` ou `'PROCEDURE'` para indicar o tipo de rotina a que a linha se refere. Essa coluna permite que privilégios sejam concedidos separadamente para uma função e um procedimento com o mesmo nome.

As colunas `Timestamp` e `Grantor` não são utilizadas.

#### A tabela de concessão proxies\_priv

A tabela `proxies_priv` registra informações sobre contas proxy. Ela tem as seguintes colunas:

* `Host`, `User`: A conta proxy; ou seja, a conta que possui o privilégio `PROXY` para a conta proxy.

* `Proxied_host`, `Proxied_user`: A conta proxy.

* `Grantor`, `Timestamp`: Não utilizada.

* `With_grant`: Se a conta proxy pode conceder o privilégio `PROXY` a outras contas.

Para que uma conta possa conceder o privilégio `PROXY` a outras contas, ela deve ter uma linha na tabela `proxies_priv` com `With_grant` definido como 1 e `Proxied_host` e `Proxied_user` definidos para indicar a conta ou contas para as quais o privilégio pode ser concedido. Por exemplo, a conta `'root'@'localhost'` criada durante a instalação do MySQL tem uma linha na tabela `proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Veja a Seção 6.2.14, “Usuários Proxy”.

#### Propriedades da coluna de escopo da tabela de subsídios

As colunas de escopo nas tabelas de concessão contêm strings. O valor padrão para cada uma delas é a string vazia. O quadro a seguir mostra o número de caracteres permitidos em cada coluna.

**Tabela 6.6 Colunas de comprimento da tabela de concessão**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column Name</th> <th>Maximum Permitted Characters</th> </tr></thead><tbody><tr> <td><code>Host</code>, <code>Proxied_host</code></td> <td>60</td> </tr><tr> <td><code>User</code>, <code>Proxied_user</code></td> <td>32</td> </tr><tr> <td><code>Password</code></td> <td>41</td> </tr><tr> <td><code>Db</code></td> <td>64</td> </tr><tr> <td><code>Table_name</code></td> <td>64</td> </tr><tr> <td><code>Column_name</code></td> <td>64</td> </tr><tr> <td><code>Routine_name</code></td> <td>64</td> </tr></tbody></table>

Os valores de `Host` e `Proxied_host` são convertidos para minúsculas antes de serem armazenados nas tabelas de concessão.

Para fins de verificação de acesso, as comparações dos valores de `User`, `Proxied_user`, `Password`, `authentication_string`, `Db` e `Table_name` são sensíveis ao caso. As comparações dos valores de `Host`, `Proxied_host`, `Column_name` e `Routine_name` não são sensíveis ao caso.

#### Propriedades da coluna de privilégios da tabela de subsídio

As tabelas `user` e `db` listam cada privilégio em uma coluna separada que é declarada como `ENUM('N','Y') DEFAULT 'N'`. Em outras palavras, cada privilégio pode ser desativado ou ativado, com o padrão sendo desativado.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` declaram as colunas de privilégio como colunas `SET`. Os valores nessas colunas podem conter qualquer combinação dos privilégios controlados pela tabela. Apenas os privilégios listados no valor da coluna são ativados.

**Tabela 6.7 Valores de coluna de privilégio de tipo de conjunto**

<table><col style="width: 20%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Table Name</th> <th>Column Name</th> <th>Possible Set Elements</th> </tr></thead><tbody><tr> <th><code>tables_priv</code></th> <td><code>Table_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code></td> </tr><tr> <th><code>tables_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>columns_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>procs_priv</code></th> <td><code>Proc_priv</code></td> <td><code>'Execute', 'Alter Routine', 'Grant'</code></td> </tr></tbody></table>

Apenas a tabela `user` especifica privilégios administrativos, como `RELOAD` e `SHUTDOWN`. As operações administrativas são operações no próprio servidor e não são específicas do banco de dados, portanto, não há motivo para listar esses privilégios nas outras tabelas de concessão. Consequentemente, o servidor precisa consultar apenas a tabela `user` para determinar se um usuário pode realizar uma operação administrativa.

O privilégio `FILE` também é especificado apenas na tabela `user`. Não é um privilégio administrativo como tal, mas a capacidade de um usuário de ler ou escrever arquivos no host do servidor é independente do banco de dados a ser acessado.

### 6.2.4 Especificando Nomes de Conta

Os nomes de conta do MySQL consistem em um nome de usuário e um nome de host, o que permite a criação de contas distintas para usuários com o mesmo nome de usuário que se conectam a partir de hosts diferentes. Esta seção descreve a sintaxe para os nomes de conta, incluindo valores especiais e regras de caracteres curinga.

Os nomes das contas aparecem em declarações SQL, como `CREATE USER`, `GRANT` e `SET PASSWORD`, e seguem estas regras:

* A sintaxe do nome da conta é `'user_name'@'host_name'`.

* A parte `@'host_name'` é opcional. Um nome de conta que consiste apenas em um nome de usuário é equivalente a `'user_name'@'%'`. Por exemplo, `'me'` é equivalente a `'me'@'%'`.

* O nome do usuário e o nome do host não precisam ser citados se forem identificadores legais sem citação. As citações devem ser usadas se uma string *`user_name`* contiver caracteres especiais (como espaço ou `-`), ou uma string *`host_name`* contiver caracteres especiais ou caracteres de comodinho (como `.` ou `%`). Por exemplo, no nome da conta `'test-user'@'%.com'`, tanto as partes do nome do usuário quanto do host requerem citações.

* Cite nomes de usuários e nomes de hosts como identificadores ou como strings, usando aspas duplas (`` ` ``), single quotation marks (`'`), or double quotation marks (`"`). Para diretrizes de citação de strings e citação de identificadores, consulte Seção 9.1.1, “Literal de String”, e Seção 9.2, “Nomes de Objetos do Esquema”.

* As partes do nome do usuário e do nome do host, se citadas, devem ser citadas separadamente. Ou seja, escreva `'me'@'localhost'`, não `'me@localhost'`. Esta última é, na verdade, equivalente a `'me@localhost'@'%'`.

* Uma referência à função `CURRENT_USER` ou `CURRENT_USER()` é equivalente a especificar o nome de usuário e o nome do host do cliente atual literalmente.

O MySQL armazena os nomes de contas em tabelas de concessão no banco de dados do sistema `mysql`, usando colunas separadas para as partes do nome do usuário e do nome do host:

* A tabela `user` contém uma linha para cada conta. As colunas `User` e `Host` armazenam o nome do usuário e o nome do host. Esta tabela também indica quais privilégios globais a conta tem.

* Outras tabelas de concessão indicam privilégios que uma conta tem para bancos de dados e objetos dentro dos bancos de dados. Essas tabelas têm as colunas `User` e `Host` para armazenar o nome da conta. Cada linha dessas tabelas está associada à conta na tabela `user` que tem os mesmos valores `User` e `Host`.

* Para fins de verificação de acesso, as comparações dos valores do Usuário são sensíveis ao caso. As comparações dos valores do Host não são sensíveis ao caso.

Para obter informações adicionais sobre as propriedades dos nomes de usuário e nomes de host armazenados nas tabelas de concessão, como o comprimento máximo, consulte Propriedades da coluna de escopo da tabela de concessão.

Os nomes de usuário e os nomes de host têm certos valores especiais ou convenções de caracteres curinga, conforme descrito a seguir.

A parte do nome de usuário de um nome de conta é um valor que não está em branco que corresponde literalmente ao nome de usuário das tentativas de conexão de entrada, ou um valor em branco (a string vazia) que corresponde a qualquer nome de usuário. Uma conta com um nome de usuário em branco é um usuário anônimo. Para especificar um usuário anônimo em declarações SQL, use uma parte de nome de usuário em branco citada, como `''@'localhost'`.

A parte do nome de host de um nome de conta pode assumir muitas formas, e os caracteres de comodinho são permitidos:

* Um valor de host pode ser um nome de host ou um endereço IP (IPv4 ou IPv6). O nome `'localhost'` indica o host local. O endereço IP `'127.0.0.1'` indica a interface de loopback IPv4. O endereço IP `'::1'` indica a interface de loopback IPv6.

Os caracteres curinga `%` e `_` são permitidos nos valores de nome de host ou endereço IP. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, um valor de host de `'%'` corresponde a qualquer nome de host, enquanto um valor de `'%.mysql.com'` corresponde a qualquer host no domínio `mysql.com`. `'198.51.100.%'` corresponde a qualquer host na rede de classe C 198.51.100.

Como os valores de wildcard de IP são permitidos nos valores de host (por exemplo, `'198.51.100.%'` para corresponder a cada host em uma sub-rede), alguém poderia tentar explorar essa capacidade ao nomear um host `198.51.100.somewhere.com`. Para impedir tais tentativas, o MySQL não realiza correspondência em nomes de host que comecem com dígitos e um ponto. Por exemplo, se um host é nomeado `1.2.example.com`, seu nome nunca corresponderá à parte de host dos nomes de conta. Um valor de wildcard de IP pode corresponder apenas a endereços IP, não a nomes de host.

* Para um valor de host especificado como um endereço IPv4, pode-se fornecer uma máscara de rede para indicar quantos bits de endereço devem ser usados para o número de rede. A notação de máscara de rede não pode ser usada para endereços IPv6.

A sintaxe é `host_ip/netmask`. Por exemplo:

  ```sql
  CREATE USER 'david'@'198.51.100.0/255.255.255.0';
  ```

Isso permite que o `david` se conecte a qualquer host cliente que tenha um endereço IP *`client_ip`* para o qual a seguinte condição seja verdadeira:

  ```sql
  client_ip & netmask = host_ip
  ```

Ou seja, para a declaração `CREATE USER` que foi mostrada agora:

  ```sql
  client_ip & 255.255.255.0 = 198.51.100.0
  ```

Os endereços IP que satisfazem essa condição variam de `198.51.100.0` a `198.51.100.255`.

Uma máscara de rede geralmente começa com bits definidos como 1, seguidos por bits definidos como 0. Exemplos:

+ `198.0.0.0/255.0.0.0`: Qualquer host na rede de classe A 198

+ `198.51.0.0/255.255.0.0`: Qualquer host na rede de classe B 198.51

+ `198.51.100.0/255.255.255.0`: Qualquer host na rede de classe C 198.51.100

+ `198.51.100.1`: Apenas o host com este endereço IP específico

O servidor realiza a correspondência dos valores de host nos nomes de conta contra o host do cliente usando o valor retornado pelo resolutor DNS do sistema para o nome de host ou endereço IP do cliente. Exceto no caso em que o valor de host da conta é especificado usando notação de máscara de rede, o servidor realiza essa comparação como uma correspondência de string, mesmo para um valor de host de conta dado como um endereço IP. Isso significa que você deve especificar valores de host de conta no mesmo formato usado pelo DNS. Aqui estão exemplos de problemas a serem observados:

* Suponha que um host na rede local tenha um nome totalmente qualificado de `host1.example.com`. Se o DNS retornar pesquisas de nome para este host como `host1.example.com`, use esse nome nos valores de host da conta. Se o DNS retornar apenas `host1`, use `host1` em vez disso.

* Se o DNS retornar o endereço IP de um host dado como `198.51.100.2`, que corresponde a um valor de host de conta como `198.51.100.2`, mas não `198.051.100.2`. Da mesma forma, corresponde a um padrão de host de conta como `198.51.100.%`, mas não `198.051.100.%`.

Para evitar problemas como esses, é aconselhável verificar o formato no qual seu DNS retorna nomes e endereços de hospedagem. Use valores no mesmo formato nos nomes das contas do MySQL.

### 6.2.5 Controle de Acesso, Etapa 1: Verificação de Conexão

Quando você tenta se conectar a um servidor MySQL, o servidor aceita ou rejeita a conexão com base nessas condições:

* Sua identidade e se você pode verificá-la fornecendo as credenciais adequadas.

* Se sua conta está bloqueada ou desbloqueada.

O servidor verifica as credenciais primeiro, depois o estado de bloqueio da conta. Uma falha em qualquer um desses passos faz com que o servidor negue o acesso completamente. Caso contrário, o servidor aceita a conexão e, em seguida, entra na Etapa 2 e aguarda por solicitações.

O servidor realiza verificação de identidade e credenciais usando colunas na tabela `user`, aceitando a conexão apenas se essas condições forem satisfeitas:

* O nome do host do cliente e o nome do usuário correspondem às colunas `Host` e `User` na linha da tabela `user`. Para as regras que regem os valores permitidos de `Host` e `User`, consulte a Seção 6.2.4, “Especificação de Nomes de Conta”.

* O cliente fornece as credenciais especificadas na linha (por exemplo, uma senha), conforme indicado pela coluna `authentication_string`. As credenciais são interpretadas usando o plugin de autenticação nomeado na coluna `plugin`.

* A linha indica que a conta está desbloqueada. O estado de bloqueio é registrado na coluna `account_locked`, que deve ter um valor de `'N'`. O bloqueio da conta pode ser definido ou alterado com a declaração `CREATE USER` ou `ALTER USER`.

Sua identidade é baseada em duas informações:

* O nome do usuário do MySQL. * O host do cliente a partir do qual você se conecta.

Se o valor da coluna `User` não estiver em branco, o nome do usuário em uma conexão recebida deve corresponder exatamente. Se o valor da tabela `User` estiver em branco, ele corresponderá a qualquer nome de usuário. Se a linha da tabela `user` que corresponde a uma conexão recebida tiver um nome de usuário em branco, o usuário é considerado um usuário anônimo sem nome, e não um usuário com o nome que o cliente realmente especificou. Isso significa que um nome de usuário em branco é usado para todas as verificações de acesso subsequentes durante a duração da conexão (ou seja, durante a Etapa 2).

A coluna `authentication_string` pode estar em branco. Isso não é um caractere curinga e não significa que qualquer senha corresponda. Isso significa que o usuário deve se conectar sem especificar uma senha. O método de autenticação implementado pelo plugin que autentica o cliente pode ou não usar a senha na coluna `authentication_string`. Neste caso, é possível que uma senha externa também seja usada para autenticação no servidor MySQL.

Os valores de senha não em branco armazenados na coluna `authentication_string` da tabela `user` são criptografados. O MySQL não armazena senhas em texto claro para que qualquer pessoa as veja. Em vez disso, a senha fornecida por um usuário que está tentando se conectar é criptografada (usando o método de hashing de senha implementado pelo plugin de autenticação de conta). A senha criptografada é então usada durante o processo de conexão, quando verifica-se se a senha está correta. Isso é feito sem que a senha criptografada viaje pela conexão. Veja a Seção 6.2.1, “Nomes e Senhas de Usuários da Conta”.

Do ponto de vista do servidor MySQL, a senha criptografada é a *real* senha, então você nunca deve dar acesso a ela a ninguém. Em particular, *não dê acesso de leitura a tabelas no banco de dados do sistema `mysql` a usuários que não são administrativos*.

A tabela a seguir mostra como as várias combinações dos valores de `User` e `Host` na tabela `user` se aplicam às conexões recebidas.

<table summary="How various combinations of User and Host values in the user table apply to incoming connections to a MySQL server.">
<col style="width: 15%"/>
<col style="width: 35%"/>
<col style="width: 50%"/>
<thead>
<tr>
<th>User Value*</th>
<th>Host Value*</th>
<th>Permissible Connections</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>'fred'</code></th>
<td><code>'h1.example.net'</code></td>
<td><code>fred</code>, connecting from <code>h1.example.net</code></td>
</tr>
<tr>
<th><code>''</code></th>
<td><code>'h1.example.net'</code></td>
<td>Any user, connecting from <code>h1.example.net</code></td>
</tr>
<tr>
<th><code>'fred'</code></th>
<td><code>'%'</code></td>
<td><code>fred</code>, conectando-se a qualquer host</td>
</tr>
<tr>
<th><code>''</code></th>
<td><code>'%'</code></td>
<td>Qualquer usuário, conectando-se a partir de qualquer host</td>
</tr>
<tr>
<th><code>'fred'</code></th>
<td><code>'%.example.net'</code></td>
<td><code>fred</code>, conectando-se a qualquer host no<code>example.net</code>domínio</td>
</tr>
<tr>
<th><code>'fred'</code></th>
<td><code>'x.example.%'</code></td>
<td><code>fred</code>, conectando-se a<code>x.example.net</code>,<code>x.example.com</code>,<code>x.example.edu</code>, e assim por diante; isso provavelmente não é útil</td>
</tr>
<tr>
<th><code>'fred'</code></th>
<td><code>'198.51.100.177'</code></td>
<td><code>fred</code>, conectando-se do host com o endereço IP<code>198.51.100.177</code></td>
</tr>
<tr>
<th><code>'fred'</code></th>
<td><code>'198.51.100.%'</code></td>
<td><code>fred</code>, conectando-se a qualquer host no<code>198.51.100</code>sub-rede de classe C</td>
</tr>
<tr>
<th><code>'fred'</code></th>
<td><code>'198.51.100.0/255.255.255.0'</code></td>
<td>Same as previous example</td>
</tr>
</tbody>
</table>

É possível que o nome do host do cliente e o nome do usuário de uma conexão recebida correspondam a mais de uma linha na tabela `user`. O conjunto de exemplos anteriores demonstra isso: Várias das entradas mostradas correspondem a uma conexão de `h1.example.net` por `fred`.

Quando há várias opções de jogos, o servidor deve determinar qual deles deve ser usado. Ele resolve esse problema da seguinte forma:

* Sempre que o servidor lê a tabela `user` na memória, ela ordena as linhas.

* Quando um cliente tenta se conectar, o servidor examina as linhas em ordem ordenada.

* O servidor usa a primeira linha que corresponde ao nome do host do cliente e ao nome do usuário.

O servidor utiliza regras de classificação que ordenam as linhas com os valores mais específicos do `Host` em primeiro lugar:

* Os endereços IP e nomes de host literais são os mais específicos.
* A especificidade de um endereço IP literal não é afetada pelo fato de ele ter uma máscara de rede, portanto, `198.51.100.13` e `198.51.100.0/255.255.255.0` são considerados igualmente específicos.

* O padrão `'%'` significa "qualquer hospedeiro" e é o menos específico.

* A string vazia `''` também significa “qualquer hospedeiro”, mas é ordenada após `'%'`.

As conexões não TCP (arquivo de soquete, tubo nomeado e memória compartilhada) são tratadas como conexões locais e correspondem a uma parte do host da `localhost` se houver tais contas, ou partes do host com caracteres especiais que correspondem à `localhost`, caso contrário (por exemplo, `local%`, `l%`, `%`).

As linhas com o mesmo valor `Host` são ordenadas com os valores `User` mais específicos em primeiro lugar. Um valor em branco `User` significa “qualquer usuário” e é o menos específico, portanto, para linhas com o mesmo valor `Host`, os usuários não anônimos são ordenados antes dos usuários anônimos.

Para linhas com valores igualmente específicos de `Host` e `User`, a ordem não é determinada.

Para entender como isso funciona, suponha que a tabela `user` tenha a seguinte aparência:

```sql
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| %         | root     | ...
| %         | jeffrey  | ...
| localhost | root     | ...
| localhost |          | ...
+-----------+----------+-
```

Quando o servidor lê a tabela na memória, ele ordena as linhas usando as regras descritas acima. O resultado após o ordenamento é o seguinte:

```sql
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| localhost | root     | ...
| localhost |          | ...
| %         | jeffrey  | ...
| %         | root     | ...
+-----------+----------+-
```

Quando um cliente tenta se conectar, o servidor examina as linhas ordenadas e usa a primeira correspondência encontrada. Para uma conexão de `localhost` por `jeffrey`, duas das linhas da tabela correspondem: a que tem os valores de `Host` e `User` de `'localhost'` e `''`, e a que tem os valores de `'%'` e `'jeffrey'`. A linha `'localhost'` aparece primeiro na ordem ordenada, então é a que o servidor usa.

Aqui está outro exemplo. Suponha que a tabela `user` pareça assim:

```sql
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| %              | jeffrey  | ...
| h1.example.net |          | ...
+----------------+----------+-
```

A tabela ordenada parece assim:

```sql
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| h1.example.net |          | ...
| %              | jeffrey  | ...
+----------------+----------+-
```

A primeira linha corresponde a uma conexão por qualquer usuário de `h1.example.net`, enquanto a segunda linha corresponde a uma conexão por `jeffrey` de qualquer host.

Nota

É um equívoco comum pensar que, para um nome de usuário dado, todas as linhas que explicitamente nomeiam esse usuário são usadas primeiro quando o servidor tenta encontrar uma correspondência para a conexão. Isso não é verdade. O exemplo anterior ilustra isso, onde uma conexão de `h1.example.net` por `jeffrey` é correspondida primeiro não pela linha contendo `'jeffrey'` como o valor da coluna `User`, mas pela linha sem nome de usuário. Como resultado, `jeffrey` é autenticado como um usuário anônimo, embora ele tenha especificado um nome de usuário ao se conectar.

Se você conseguir se conectar ao servidor, mas seus privilégios não forem o que você espera, provavelmente está sendo autenticado como outra conta. Para descobrir qual conta o servidor usou para autenticá-lo, use a função `CURRENT_USER()`. (Veja a Seção 12.15, “Funções de Informação”.) Ela retorna um valor no formato `user_name@host_name` que indica os valores `User` e `Host` da linha correspondente da tabela `user`. Suponha que `jeffrey` se conecte e emita a seguinte consulta:

```sql
mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| @localhost     |
+----------------+
```

O resultado mostrado aqui indica que a linha da tabela correspondente `user` tinha um valor em branco na coluna `User`. Em outras palavras, o servidor está tratando `jeffrey` como um usuário anônimo.

Outra maneira de diagnosticar problemas de autenticação é imprimir a tabela `user` e ordená-la manualmente para ver onde a primeira correspondência está sendo feita.

### 6.2.6 Controle de Acesso, Etapa 2: Solicitação de Verificação

Após o servidor aceitar uma conexão, ele entra na Etapa 2 do controle de acesso. Para cada solicitação que você emite através da conexão, o servidor determina qual operação você deseja realizar e, em seguida, verifica se seus privilégios são suficientes. É aqui que as colunas de privilégio nas tabelas de concessão entram em jogo. Esses privilégios podem vir de qualquer uma das tabelas `user`, `db`, `tables_priv`, `columns_priv` ou `procs_priv`. (Você pode achar útil consultar a Seção 6.2.3, “Tabelas de Concessão”, que lista as colunas presentes em cada tabela de concessão.)

A tabela `user` concede privilégios globais. A linha da tabela `user` para uma conta indica os privilégios da conta que se aplicam de forma global, independentemente do banco de dados padrão. Por exemplo, se a tabela `user` concede o privilégio `DELETE`, você pode excluir linhas de qualquer tabela em qualquer banco de dados no host do servidor. É prudente conceder privilégios na tabela `user` apenas às pessoas que precisam deles, como administradores de banco de dados. Para outros usuários, deixe todos os privilégios na tabela `user` definidos como `'N'` e conceda privilégios apenas em níveis mais específicos (para bancos de dados, tabelas, colunas ou rotinas particulares).

A tabela `db` concede privilégios específicos do banco de dados. Os valores nas colunas de escopo desta tabela podem assumir as seguintes formas:

* Um valor vazio `User` corresponde ao usuário anônimo. Um valor não vazio corresponde literalmente; não há caracteres especiais nos nomes dos usuários.

* Os caracteres curinga `%` e `_` podem ser usados nas colunas `Host` e `Db`. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Se você deseja usar qualquer caractere literalmente ao conceder privilégios, deve escapar com uma barra invertida. Por exemplo, para incluir o caractere sublinhado (`_`) como parte de um nome de banco de dados, especifique-o como `\_` na declaração `GRANT`.

* Um valor de `'%'` ou vazio de `Host` significa “qualquer hospedeiro”.

* Um valor de `'%'` ou vazio de `Db` significa “qualquer banco de dados”.

O servidor lê a tabela `db` na memória e a ordena ao mesmo tempo em que lê a tabela `user`. O servidor ordena a tabela `db` com base nas colunas de escopo `Host`, `Db` e `User`. Assim como na tabela `user`, a ordenação coloca os valores mais específicos primeiro e os menos específicos por último, e quando o servidor procura por linhas correspondentes, ele usa a primeira correspondência que encontra.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` concedem privilégios específicos para a tabela, específicos para a coluna e específicos para a rotina. Os valores nas colunas de escopo dessas tabelas podem assumir as seguintes formas:

* Os caracteres curinga `%` e `_` podem ser usados na coluna `Host`. Esses têm o mesmo significado que para operações de correspondência de padrões realizadas com o operador `LIKE`.

* Um valor de `'%'` ou vazio de `Host` significa “qualquer hospedeiro”.

As colunas `Db`, `Table_name`, `Column_name` e `Routine_name` não podem conter caracteres asteriscos ou ficar em branco.

O servidor ordena as tabelas `tables_priv`, `columns_priv` e `procs_priv` com base nas colunas `Host`, `Db` e `User`. Isso é semelhante ao ordenamento da tabela `db`, mas mais simples porque apenas a coluna `Host` pode conter caracteres asteriscos.

O servidor utiliza as tabelas ordenadas para verificar cada solicitação que recebe. Para solicitações que requerem privilégios administrativos, como `SHUTDOWN` ou `RELOAD`, o servidor verifica apenas a linha da tabela `user`, pois é a única tabela que especifica privilégios administrativos. O servidor concede acesso se a linha permitir a operação solicitada e, caso contrário, nega o acesso. Por exemplo, se você deseja executar **mysqladmin shutdown**, mas a linha da sua tabela `user` não concede o privilégio `SHUTDOWN` para você, o servidor nega o acesso, mesmo sem verificar a tabela `db`. (Esta última tabela não contém nenhuma coluna `Shutdown_priv`, portanto, não há necessidade de verificá-la.)

Para solicitações relacionadas a bancos de dados (`INSERT`, `UPDATE`, e assim por diante), o servidor verifica primeiro os privilégios globais do usuário na linha da tabela `user`. Se a linha permitir a operação solicitada, o acesso é concedido. Se os privilégios globais na tabela `user` forem insuficientes, o servidor determina os privilégios específicos do banco de dados do usuário a partir da tabela `db`:

* O servidor procura na tabela `db` uma correspondência nas colunas `Host`, `Db` e `User`.

As colunas `Host` e `User` são correspondidas ao nome do host do usuário conectando e ao nome do usuário do MySQL.

* A coluna `Db` é correspondida ao banco de dados que o usuário deseja acessar.

* Se não houver uma linha para `Host` e `User`, o acesso será negado.

Após determinar os privilégios específicos do banco de dados concedidos pelas linhas da tabela `db`, o servidor adiciona-os aos privilégios globais concedidos pela tabela `user`. Se o resultado permitir a operação solicitada, o acesso é concedido. Caso contrário, o servidor verifica sucessivamente os privilégios da tabela e coluna do usuário nas tabelas `tables_priv` e `columns_priv`, adiciona-os aos privilégios do usuário e permite ou nega o acesso com base no resultado. Para operações de rotina armazenada, o servidor usa a tabela `procs_priv` em vez de `tables_priv` e `columns_priv`.

Expresso em termos lógicos, a descrição anterior sobre como os privilégios de um usuário são calculados pode ser resumida da seguinte forma:

```sql
global privileges
OR database privileges
OR table privileges
OR column privileges
OR routine privileges
```

Pode não ser aparente por que, se os privilégios globais forem inicialmente encontrados como insuficientes para a operação solicitada, o servidor adiciona esses privilégios à tabela e aos privilégios de coluna do banco de dados posteriormente. O motivo é que um pedido pode exigir mais de um tipo de privilégio. Por exemplo, se você executar uma declaração `INSERT INTO ... SELECT`, você precisa dos privilégios `INSERT` e `SELECT`. Seus privilégios podem ser tais que a linha de tabela `user` concede um privilégio global e a linha de tabela `db` concede o outro especificamente para o banco de dados relevante. Neste caso, você tem os privilégios necessários para realizar o pedido, mas o servidor não pode dizer isso apenas com seus privilégios globais ou de banco de dados. Ele deve tomar uma decisão de controle de acesso com base nos privilégios combinados.

### 6.2.7 Adicionar contas, atribuir privilégios e excluir contas

Para gerenciar contas do MySQL, use as instruções SQL destinadas a esse propósito:

* `CREATE USER` e `DROP USER` criam e removem contas.

* `GRANT` e `REVOKE` atribuem privilégios e revogam privilégios de contas.

* `SHOW GRANTS` exibe as atribuições de privilégios da conta.

As declarações de gerenciamento de conta fazem com que o servidor realize as modificações apropriadas nas tabelas de concessão subjacentes, que são discutidas na Seção 6.2.3, "Tabelas de concessão".

Nota

A modificação direta das tabelas de subsídios usando declarações como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua conta e risco. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

A partir do MySQL 5.7.18, para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela possui a estrutura esperada e produz um erro se não o fizer. `mysqld_upgrade` deve ser executado para atualizar as tabelas para a estrutura esperada.

Outra opção para criar contas é usar a ferramenta gráfica MySQL Workbench. Além disso, vários programas de terceiros oferecem capacidades para administração de contas do MySQL. `phpMyAdmin` é um desses programas.

Esta seção discute os seguintes tópicos:

* Criar contas e conceder privilégios
* Verificar privilégios e propriedades da conta
* Revogar privilégios da conta
* Eliminar contas

Para informações adicionais sobre as declarações discutidas aqui, consulte a Seção 13.7.1, “Declarações de Gerenciamento de Conta”.

#### Criando Contas e Atribuindo Privilegios

Os exemplos a seguir mostram como usar o programa cliente **mysql** para configurar novas contas. Esses exemplos assumem que a conta `root` do MySQL tem o privilégio `CREATE USER` e todos os privilégios que ela concede a outras contas.

Na linha de comando, conecte-se ao servidor como o usuário `root` do MySQL, fornecendo a senha apropriada na prompt de senha:

```sql
$> mysql -u root -p
Enter password: (enter root password here)
```

Após se conectar ao servidor, você pode adicionar novas contas. O exemplo a seguir usa as declarações `CREATE USER` e `GRANT` para configurar quatro contas (onde você vê `'password'`, substitua uma senha apropriada):

```sql
CREATE USER 'finley'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'localhost'
  WITH GRANT OPTION;

CREATE USER 'finley'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'%.example.com'
  WITH GRANT OPTION;

CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'password';
GRANT RELOAD,PROCESS
  ON *.*
  TO 'admin'@'localhost';

CREATE USER 'dummy'@'localhost';
```

As contas criadas por essas declarações têm as seguintes propriedades:

* Duas contas têm um nome de usuário de `finley`. Ambas são contas de superusuário com privilégios globais completos para fazer qualquer coisa. A conta `'finley'@'localhost'` pode ser usada apenas ao se conectar a partir do host local. A conta `'finley'@'%.example.com'` usa o caractere curinga `'%'` na parte do host, então pode ser usada para se conectar a partir de qualquer host no domínio `example.com`.

A conta `'finley'@'localhost'` é necessária se houver uma conta de usuário anônimo para `localhost`. Sem a conta `'finley'@'localhost'`, essa conta de usuário anônimo tem precedência quando o `finley` se conecta a partir do host local e o `finley` é tratado como um usuário anônimo. A razão para isso é que a conta de usuário anônimo tem um valor mais específico da coluna `Host` do que a conta `'finley'@'%'` e, portanto, vem antes no `user` ordem de classificação da tabela. (Para informações sobre a classificação da tabela `user`, consulte a Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”.)

* A conta `'admin'@'localhost'` só pode ser usada pelo `admin` para se conectar ao host local. Ela recebe os privilégios administrativos globais `RELOAD` e `PROCESS`. Esses privilégios permitem que o usuário `admin` execute os comandos **mysqladmin reload**, **mysqladmin refresh**, e **mysqladmin flush-*`xxx`***, além do **mysqladmin processlist**. Não são concedidos privilégios para acessar quaisquer bancos de dados. Você pode adicionar tais privilégios usando declarações `GRANT`.

* A conta `'dummy'@'localhost'` não tem senha (o que é inseguro e não é recomendado). Essa conta só pode ser usada para se conectar a partir do host local. Não são concedidos privilégios. Assume-se que você concede privilégios específicos à conta usando as declarações `GRANT`.

O exemplo anterior concede privilégios em nível global. O próximo exemplo cria três contas e concede-lhes acesso em níveis mais baixos, ou seja, a bancos de dados específicos ou objetos dentro dos bancos de dados. Cada conta tem um nome de usuário de `custom`, mas as partes do nome de host diferem:

```sql
CREATE USER 'custom'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON bankaccount.*
  TO 'custom'@'localhost';

CREATE USER 'custom'@'host47.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON expenses.*
  TO 'custom'@'host47.example.com';

CREATE USER 'custom'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON customer.addresses
  TO 'custom'@'%.example.com';
```

Os três perfis podem ser utilizados da seguinte forma:

* A conta `'custom'@'localhost'` possui todos os privilégios de nível de banco de dados para acessar o banco de dados `bankaccount`. A conta pode ser usada para se conectar ao servidor apenas a partir do host local.

* A conta `'custom'@'host47.example.com'` possui privilégios específicos de nível de banco de dados para acessar o banco de dados `expenses`. A conta pode ser usada para se conectar ao servidor apenas a partir do host `host47.example.com`.

* A conta `'custom'@'%.example.com'` possui privilégios específicos em nível de tabela para acessar a tabela `addresses` no banco de dados `customer`, a partir de qualquer host no domínio `example.com`. A conta pode ser usada para se conectar ao servidor a partir de todas as máquinas do domínio devido ao uso do caractere comodínio `%` na parte do host do nome da conta.

#### Privilegios e propriedades da conta corrente

Para ver os privilégios de uma conta, use `SHOW GRANTS`:

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO 'admin'@'localhost' |
+-----------------------------------------------------+
```

Para ver propriedades não privilegiadas para uma conta, use `SHOW CREATE USER`:

```sql
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER 'admin'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*67ACDEBDAB923990001F0FFB017EB8ED41861105'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

#### Retirar privilégios da conta

Para revogar os privilégios da conta, use a declaração `REVOKE`. Os privilégios podem ser revogados em diferentes níveis, assim como podem ser concedidos em diferentes níveis.

Revocar privilégios globais:

```sql
REVOKE ALL
  ON *.*
  FROM 'finley'@'%.example.com';

REVOKE RELOAD
  ON *.*
  FROM 'admin'@'localhost';
```

Reveja os privilégios do nível de banco de dados:

```sql
REVOKE CREATE,DROP
  ON expenses.*
  FROM 'custom'@'host47.example.com';
```

Revocar privilégios de nível de tabela:

```sql
REVOKE INSERT,UPDATE,DELETE
  ON customer.addresses
  FROM 'custom'@'%.example.com';
```

Para verificar o efeito da revogação de privilégios, use `SHOW GRANTS`:

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+---------------------------------------------+
| Grants for admin@localhost                  |
+---------------------------------------------+
| GRANT PROCESS ON *.* TO 'admin'@'localhost' |
+---------------------------------------------+
```

#### Deixar contas

Para remover uma conta, use a declaração `DROP USER`. Por exemplo, para descartar algumas das contas criadas anteriormente:

```sql
DROP USER 'finley'@'localhost';
DROP USER 'finley'@'%.example.com';
DROP USER 'admin'@'localhost';
DROP USER 'dummy'@'localhost';
```

### 6.2.8 Contas Reservadas

Uma parte do processo de instalação do MySQL é a inicialização do diretório de dados (consulte a Seção 2.9.1, “Inicialização do diretório de dados”). Durante a inicialização do diretório de dados, o MySQL cria contas de usuário que devem ser consideradas reservadas:

* `'root'@'localhost`: Usado para fins administrativos. Esta conta tem todos os privilégios e pode realizar qualquer operação.

Estritamente falando, esse nome de conta não está reservado, no sentido de que algumas instalações renomeiam a conta `root` para algo mais, para evitar expor uma conta altamente privilegiada com um nome bem conhecido.

* `'mysql.sys'@'localhost'`: Usado como o `DEFINER` para objetos de esquema `sys`. O uso da conta `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`. Esta conta é bloqueada para que não possa ser usada para conexões de clientes.

* `'mysql.session'@'localhost'`: Usado internamente por plugins para acessar o servidor. Essa conta está bloqueada para que não possa ser usada para conexões de clientes.

### 6.2.9 Quando as Alterações de Privilegio Se Tornam Efetivas

Se o servidor `mysqld` for iniciado sem a opção `--skip-grant-tables`, ele lê todos os conteúdos da tabela de concessão na memória durante sua sequência de inicialização. As tabelas de memória tornam-se eficazes para o controle de acesso nesse ponto.

Se você modificar as tabelas de concessão indiretamente usando uma declaração de gerenciamento de conta, o servidor percebe essas mudanças e carrega as tabelas de concessão na memória novamente imediatamente. As declarações de gerenciamento de conta são descritas na Seção 13.7.1, “Declarações de Gerenciamento de Conta”. Exemplos incluem `GRANT`, `REVOKE`, `SET PASSWORD` e `RENAME USER`.

Se você modificar as tabelas de concessão diretamente usando declarações como `INSERT`, `UPDATE` ou `DELETE` (o que não é recomendado), as alterações não terão efeito na verificação de privilégios até que você informe ao servidor para recarregar as tabelas ou reiniciá-lo. Assim, se você alterar as tabelas de concessão diretamente, mas esquecer de recarregá-las, as alterações *não terão efeito* até que você reinicie o servidor. Isso pode deixá-lo se perguntando por que suas alterações não parecem fazer diferença!

Para dizer ao servidor que recarregue as tabelas de concessão, realize uma operação de flush-privileges. Isso pode ser feito emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**.

Um recarregamento da tabela de subsídios afeta os privilégios de cada sessão de cliente existente da seguinte forma:

As alterações de privilégios de tabela e coluna entram em vigor na próxima solicitação do cliente.

As alterações dos privilégios do banco de dados entram em vigor na próxima vez que o cliente executar uma declaração `USE db_name`.

Nota

As aplicações cliente podem armazenar o nome do banco de dados; portanto, esse efeito pode não ser visível para elas sem realmente mudar para um banco de dados diferente.

* Os privilégios e senhas globais não são afetados para um cliente conectado. Essas alterações só entram em vigor em sessões para conexões subsequentes.

Se o servidor for iniciado com a opção `--skip-grant-tables`, ele não lê as tabelas de concessão ou implementa qualquer controle de acesso. Qualquer usuário pode se conectar e realizar qualquer operação, *o que é inseguro.* Para fazer com que um servidor assim iniciado leia as tabelas e habilite a verificação de acesso, limpe os privilégios.

### 6.2.10 Atribuição de Senhas de Conta

As credenciais necessárias para os clientes que se conectam ao servidor MySQL podem incluir uma senha. Esta seção descreve como atribuir senhas para contas MySQL.

O MySQL armazena as credenciais na tabela `user` no banco de dados do sistema `mysql`. As operações que atribuem ou modificam senhas são permitidas apenas para usuários com o privilégio `CREATE USER`, ou, como alternativa, privilégios para o banco de dados `mysql` (prerrogativa `INSERT` para criar novas contas, `UPDATE` para modificar contas existentes). Se a variável do sistema `read_only` estiver habilitada, o uso de declarações de modificação de contas, como `CREATE USER` ou `ALTER USER`, requer adicionalmente o privilégio `SUPER`.

A discussão aqui resume a sintaxe apenas para as declarações de atribuição de senha mais comuns. Para detalhes completos sobre outras possibilidades, consulte a Seção 13.7.1.2, “Declaração CREATE USER”, a Seção 13.7.1.1, “Declaração ALTER USER”, a Seção 13.7.1.4, “Declaração GRANT” e a Seção 13.7.1.7, “Declaração SET PASSWORD”.

O MySQL utiliza plugins para realizar autenticação de clientes; veja a Seção 6.2.13, “Autenticação Conectada”. Em declarações de atribuição de senha, o plugin de autenticação associado a uma conta realiza qualquer hashing exigido de uma senha em texto claro especificada. Isso permite que o MySQL ofusque as senhas antes de armazená-las na tabela do sistema `mysql.user`. Para as declarações descritas aqui, o MySQL gera automaticamente o hashing da senha especificada. Há também sintaxe para `CREATE USER` e `ALTER USER` que permite que valores hashed sejam especificados literalmente. Para detalhes, consulte as descrições dessas declarações.

Para atribuir uma senha ao criar uma nova conta, use `CREATE USER` e inclua uma cláusula `IDENTIFIED BY`:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

`CREATE USER` também suporta sintaxe para especificar o plugin de autenticação da conta. Veja a Seção 13.7.1.2, “Instrução CREATE USER”.

Para atribuir ou alterar uma senha para uma conta existente, use a declaração `ALTER USER` com uma cláusula `IDENTIFIED BY`:

```sql
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Se você não estiver conectado como um usuário anônimo, pode alterar sua própria senha sem nomear sua própria conta literalmente:

```sql
ALTER USER USER() IDENTIFIED BY 'password';
```

Para alterar uma senha de conta a partir da linha de comando, use o comando **mysqladmin**:

```sql
mysqladmin -u user_name -h host_name password "password"
```

A conta para a qual este comando define a senha é aquela com uma linha na tabela do sistema `mysql.user` que corresponde a *`user_name`* na coluna `User` e o host do cliente *do qual você se conecta* na coluna `Host`.

Aviso

Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se você está usando a Replicação do MySQL, esteja ciente de que, atualmente, uma senha usada por uma réplica como parte de uma declaração `CHANGE MASTER TO` é efetivamente limitada a 32 caracteres de comprimento; se a senha for mais longa, quaisquer caracteres excedentes serão truncados. Isso não é devido a qualquer limite imposto pelo MySQL Server de forma geral, mas sim é um problema específico da Replicação do MySQL. (Para mais informações, consulte o Bug #43439.)

### 6.2.11 Gerenciamento de Senhas

O MySQL permite que os administradores de banco de dados expirem senhas de conta manualmente e estabeleçam uma política para a expiração automática das senhas. A política de expiração pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para deferir à política global ou para substituir a política global com comportamento específico por conta.

* Armazenamento de credenciais internas versus externas
* Política de expiração de senha

#### Armazenamento de Credenciais Internas versus Externas

Alguns plugins de autenticação armazenam as credenciais da conta internamente no MySQL, na tabela do sistema `mysql.user`:

* `mysql_native_password`
* `sha256_password`

A discussão nesta seção se aplica a esses plugins de autenticação, pois as capacidades de gerenciamento de senhas descritas aqui são baseadas no armazenamento de credenciais internas gerenciado pelo próprio MySQL.

Outros plugins de autenticação armazenam as credenciais da conta externamente no MySQL. Para contas que utilizam plugins que realizam autenticação contra um sistema de credenciais externo, o gerenciamento de senhas também deve ser realizado externamente contra esse sistema.

Para informações sobre plugins de autenticação individual, consulte a Seção 6.4.1, “Plugins de Autenticação”.

#### Política de Expansão de Senha

Para expirar uma senha de conta manualmente, use a declaração `ALTER USER`:

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

Esta operação marca a senha expirada na linha correspondente da tabela do sistema `mysql.user`.

A expiração da senha de acordo com a política é automática e é baseada na idade da senha, que para uma conta específica é avaliada a partir da data e hora da sua última alteração de senha. A tabela do sistema `mysql.user` indica para cada conta quando sua senha foi alterada pela última vez, e o servidor trata automaticamente a senha como expirada no momento da conexão do cliente se sua idade for maior que sua vida útil permitida. Isso funciona sem expiração explícita manual de senha.

Para estabelecer uma política automática de expiração de senha globalmente, use a variável de sistema `default_password_lifetime`. Seu valor padrão é 0, que desativa a expiração automática da senha. Se o valor de `default_password_lifetime` for um número inteiro positivo *`N`*, indica o tempo de vida permitido da senha, de modo que as senhas devem ser alteradas a cada *`N`* dias.

Nota

Antes de 5.7.11, o valor padrão `default_password_lifetime` é 360 (as senhas devem ser alteradas aproximadamente uma vez por ano). Para essas versões, esteja ciente de que, se não fizer alterações na variável `default_password_lifetime` ou nas contas individuais dos usuários, cada senha do usuário expira após 360 dias e a conta começa a funcionar no modo restrito. Os clientes que se conectam ao servidor usando a conta recebem então um erro indicando que a senha deve ser alterada: `ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.`

No entanto, isso é fácil de passar despercebido para clientes que se conectam automaticamente ao servidor, como as conexões feitas a partir de scripts. Para evitar que esses clientes deixem de funcionar de repente devido à expiração da senha, certifique-se de alterar as configurações de expiração da senha para esses clientes, da seguinte forma:

```sql
ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER
```

Alternativamente, defina a variável `default_password_lifetime` para `0`, desativando assim a expiração automática da senha para todos os usuários.

Exemplos:

* Para estabelecer uma política global de que as senhas tenham uma vida útil de aproximadamente seis meses, comece o servidor com essas linhas em um arquivo do servidor `my.cnf`:

  ```sql
  [mysqld]
  default_password_lifetime=180
  ```

* Para estabelecer uma política global de forma que as senhas nunca expirem, defina `default_password_lifetime` como 0:

  ```sql
  [mysqld]
  default_password_lifetime=0
  ```

* `default_password_lifetime` também pode ser alterado em tempo de execução:

  ```sql
  SET GLOBAL default_password_lifetime = 180;
  SET GLOBAL default_password_lifetime = 0;
  ```

A política global de expiração de senhas se aplica a todas as contas que não tenham sido configuradas para ignorá-la. Para estabelecer uma política para contas individuais, use as opções `PASSWORD EXPIRE` das declarações `CREATE USER` e `ALTER USER`. Veja a Seção 13.7.1.2, “Declaração CREATE USER”, e a Seção 13.7.1.1, “Declaração ALTER USER”.

Exemplos de declarações específicas para contas:

* Exigir que a senha seja alterada a cada 90 dias:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ```

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

* Desativar a expiração da senha:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

* Atrasar a política de expiração global para todas as contas nomeadas na declaração:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

Quando um cliente se conecta com sucesso, o servidor determina se a senha da conta expirou:

* O servidor verifica se a senha foi expirada manualmente.

* Caso contrário, o servidor verifica se a idade da senha é maior que sua vida útil permitida de acordo com a política automática de expiração de senha. Se assim for, o servidor considera que a senha expirou.

Se a senha expirar (seja manualmente ou automaticamente), o servidor desconecta o cliente ou restringe as operações permitidas a ele (consulte a Seção 6.2.12, “Tratamento do servidor de senhas expiradas”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha da conta:

```sql
mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> ALTER USER USER() IDENTIFIED BY 'password';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```

Este modo restrito de operação permite declarações `SET`, o que é útil antes do MySQL 5.7.6, se `SET PASSWORD` deve ser usado em vez de `ALTER USER` e a senha da conta tem um formato de hashing que exige que `old_passwords` seja definido com um valor diferente do seu padrão.

Após o cliente redefinir a senha, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que utilizam a conta. Também é possível que um usuário administrativo redefina a senha da conta, mas quaisquer sessões restritas existentes para essa conta permanecem restritas. Um cliente que utiliza a conta deve se desconectar e se reconectar antes que as declarações possam ser executadas com sucesso.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.

### 6.2.12 Tratamento do servidor de senhas expiradas

O MySQL oferece capacidade de expiração de senha, que permite que os administradores de banco de dados exijam que os usuários redefram suas senhas. As senhas podem expirar manualmente e com base em uma política de expiração automática (consulte a Seção 6.2.11, “Gestão de Senhas”).

A declaração `ALTER USER` permite a expiração da senha da conta. Por exemplo:

```sql
ALTER USER 'myuser'@'localhost' PASSWORD EXPIRE;
```

Para cada conexão que utiliza uma conta com uma senha expirada, o servidor ou desconecta o cliente ou restringe o cliente ao "modo sandbox", no qual o servidor permite que o cliente realize apenas as operações necessárias para redefinir a senha expirada. A ação realizada pelo servidor depende das configurações do cliente e do servidor, conforme discutido mais adiante.

Se o servidor desconectar o cliente, ele retorna um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`:

```sql
$> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```

Se o servidor restringir o cliente ao modo sandbox, essas operações são permitidas dentro da sessão do cliente:

* O cliente pode redefinir a senha da conta com `ALTER USER` ou `SET PASSWORD`. Após isso ter sido feito, o servidor restaura o acesso normal para a sessão, bem como para conexões subsequentes que utilizam a conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.

* O cliente pode usar a declaração `SET`, que é útil antes do MySQL 5.7.6, se `SET PASSWORD` deve ser usado em vez de `ALTER USER` e a conta usa um plugin de autenticação para o qual a variável de sistema `old_passwords` deve ser definida primeiro em um valor não padrão para realizar a criptografia de senha de uma maneira específica.

Para qualquer operação não permitida dentro da sessão, o servidor retorna um erro `ER_MUST_CHANGE_PASSWORD`:

```sql
mysql> USE performance_schema;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.
```

Isso é o que normalmente acontece para invocções interativas do cliente **mysql**, porque, por padrão, essas invocções são colocadas em modo sandbox. Para retomar o funcionamento normal, selecione uma nova senha.

Para invocações não interativas do cliente **mysql** (por exemplo, em modo em lote), o servidor normalmente desconecta o cliente se a senha expirar. Para permitir que as invocações não interativas do **mysql** permaneçam conectadas para que a senha possa ser alterada (usando as declarações permitidas no modo sandbox), adicione a opção `--connect-expired-password` ao comando **mysql**.

Como mencionado anteriormente, se o servidor desconecta um cliente com senha expirada ou o restringe ao modo sandbox, depende de uma combinação de configurações do cliente e do servidor. A discussão a seguir descreve as configurações relevantes e como elas interagem.

Nota

Essa discussão se aplica apenas para contas com senhas expiradas. Se um cliente se conectar usando uma senha não expirada, o servidor lida normalmente com o cliente.

Do lado do cliente, um cliente específico indica se pode lidar com o modo sandbox para senhas expiradas. Para clientes que usam a biblioteca de clientes C, há duas maneiras de fazer isso:

* Passe a bandeira `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_options()` antes de conectar:

  ```sql
  my_bool arg = 1;
  mysql_options(mysql,
                MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                &arg);
  ```

Essa é a técnica usada dentro do cliente **mysql**, que permite `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` se invocado interativamente ou com a opção `--connect-expired-password`.

* Passe a bandeira `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_real_connect()` no momento da conexão:

  ```sql
  MYSQL mysql;
  mysql_init(&mysql);
  if (!mysql_real_connect(&mysql,
                          host, user, password, db,
                          port, unix_socket,
                          CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS))
  {
    ... handle error ...
  }
  ```

Outros Conectivos MySQL têm suas próprias convenções para indicar prontidão para lidar com o modo sandbox. Consulte a documentação do Conectivo no qual você está interessado.

Do lado do servidor, se um cliente indicar que pode lidar com senhas expiradas, o servidor coloca-o no modo sandbox.

Se um cliente não indicar que pode lidar com senhas expiradas (ou usa uma versão mais antiga da biblioteca do cliente que não pode indicar isso), a ação do servidor depende do valor da variável de sistema `disconnect_on_expired_password`:

* Se `disconnect_on_expired_password` estiver habilitado (o padrão), o servidor desconecta o cliente com um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`.

* Se `disconnect_on_expired_password` estiver desativado, o servidor coloca o cliente no modo sandbox.

### 6.2.13 Autenticação Conectada

Quando um cliente se conecta ao servidor MySQL, o servidor utiliza o nome de usuário fornecido pelo cliente e o host do cliente para selecionar a linha de conta apropriada da tabela do sistema `mysql.user`. O servidor, em seguida, autentica o cliente, determinando a partir da linha de conta qual plugin de autenticação se aplica ao cliente:

* Se o servidor não conseguir encontrar o plugin, ocorre um erro e a tentativa de conexão é rejeitada.

* Caso contrário, o servidor invoca esse plugin para autenticar o usuário, e o plugin retorna um status ao servidor, indicando se o usuário forneceu a senha correta e está autorizado a se conectar.

A autenticação conectada permite essas capacidades importantes:

* **Escolha dos métodos de autenticação.** A autenticação plugável facilita para os administradores de banco de dados escolher e alterar o método de autenticação usado para contas individuais do MySQL.

* **Autenticação externa.** A autenticação plugável permite que os clientes se conectem ao servidor MySQL com credenciais apropriadas para métodos de autenticação que armazenam as credenciais em locais diferentes da tabela do sistema `mysql.user`. Por exemplo, plugins podem ser criados para usar métodos de autenticação externa, como PAM, IDs de login do Windows, LDAP ou Kerberos.

* **Usuários proxy:** Se um usuário é autorizado a se conectar, um plugin de autenticação pode retornar ao servidor um nome de usuário diferente do nome do usuário que está se conectando, para indicar que o usuário que está se conectando é um proxy para outro usuário (o usuário proxy). Enquanto a conexão durar, o usuário proxy é tratado, para fins de controle de acesso, como tendo os privilégios do usuário proxy. Na verdade, um usuário assume a identidade de outro. Para mais informações, consulte a Seção 6.2.14, “Usuários proxy”.

Nota

Se você iniciar o servidor com a opção `--skip-grant-tables`, os plugins de autenticação não são usados, mesmo que carregados, porque o servidor não realiza nenhuma autenticação de cliente e permite que qualquer cliente se conecte. Como isso é inseguro, você pode querer usar `--skip-grant-tables` em conjunto com a habilitação da variável de sistema `skip_networking` para impedir que clientes remotos se conectem.

* Plugins de autenticação disponíveis
* Uso de plugins de autenticação
* Restrições sobre autenticação plugável

#### Plugins de autenticação disponíveis

O MySQL 5.7 oferece esses plugins de autenticação:

* Plugins que realizam autenticação nativa; ou seja, autenticação baseada nos métodos de hashing de senha utilizados antes da introdução da autenticação intercambiável no MySQL. O plugin `mysql_native_password` implementa autenticação baseada no método nativo de hashing de senha. O plugin `mysql_old_password` implementa autenticação nativa baseada no método de hashing de senha mais antigo (e é desatualizado e removido no MySQL 5.7.5). Veja a Seção 6.4.1.1, “Autenticação Intercambiável Nativa”, e a Seção 6.4.1.2, “Autenticação Nativa Antiga”.

* Plugins que realizam autenticação usando hashing de senha SHA-256. Esse é um tipo de criptografia mais forte do que a disponível na autenticação nativa. Veja a Seção 6.4.1.5, “Autenticação Plugável SHA-256”, e a Seção 6.4.1.4, “Cache de Autenticação Plugável SHA-2”.

* Um plugin do lado do cliente que envia a senha para o servidor sem criptografia ou hashing. Este plugin é usado em conjunto com plugins do lado do servidor que exigem acesso à senha exatamente como fornecida pelo usuário do cliente. Veja a Seção 6.4.1.6, “Autenticação Deslizável de Texto Claro do Lado do Cliente”.

* Um plugin que realiza autenticação externa usando PAM (Pluggable Authentication Modules), permitindo que o MySQL Server use PAM para autenticar usuários do MySQL. Este plugin também suporta usuários proxy. Veja a Seção 6.4.1.7, “Autenticação Pluggable PAM”.

* Um plugin que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que se cadastraram no Windows podem se conectar a partir de programas cliente do MySQL ao servidor com base nas informações de seu ambiente, sem especificar uma senha adicional. Este plugin também suporta usuários proxy. Veja a Seção 6.4.1.8, “Autenticação Plugável do Windows”.

* Plugins que realizam autenticação usando LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório, como X.500. Esses plugins também suportam usuários proxy. Veja a Seção 6.4.1.9, “Autenticação Conectada por LDAP”.

* Um plugin que impede todas as conexões do cliente em qualquer conta que o utilize. Os casos de uso para este plugin incluem contas proxy que nunca devem permitir login direto, mas são acessadas apenas através de contas proxy e contas que devem ser capazes de executar programas e visualizações armazenadas com privilégios elevados, sem expor esses privilégios a usuários comuns. Veja a Seção 6.4.1.10, “Autenticação Plugável sem Login”.

* Um plugin que autentica clientes que se conectam a partir do host local através do arquivo de socket Unix. Veja a Seção 6.4.1.11, “Autenticação de Peer de Socket Pluggable”.

* Um plugin de teste que verifica as credenciais da conta e registra o sucesso ou o fracasso no registro do log de erro do servidor. Este plugin é destinado a fins de teste e desenvolvimento, e como exemplo de como escrever um plugin de autenticação. Veja a Seção 6.4.1.12, “Autenticação Plugável de Teste”.

Nota

Para obter informações sobre as restrições atuais sobre o uso de autenticação plugável, incluindo quais conectores suportam quais plugins, consulte Restrições sobre Autenticação Plugável.

Os desenvolvedores de conectores de terceiros devem ler essa seção para determinar em que medida um conector pode aproveitar as capacidades de autenticação plugáveis e quais são os passos a serem tomados para se tornar mais compatível.

Se você está interessado em escrever seus próprios plugins de autenticação, veja Escrever plugins de autenticação.

#### Uso do Plugin de Autenticação

Esta seção fornece instruções gerais para a instalação e uso de plugins de autenticação. Para instruções específicas de um plugin dado, consulte a seção que descreve esse plugin na Seção 6.4.1, “Plugins de Autenticação”.

Em geral, a autenticação conectada usa um par de plugins correspondentes nos lados do servidor e do cliente, então você usa um método de autenticação dado assim:

* Se necessário, instale a biblioteca de plugins ou as bibliotecas que contenham os plugins apropriados. No host do servidor, instale a biblioteca que contém o plugin do lado do servidor, para que o servidor possa usá-lo para autenticar conexões de clientes. Da mesma forma, em cada host de cliente, instale a biblioteca que contém o plugin do lado do cliente para uso por programas de cliente. Os plugins de autenticação que são construídos não precisam ser instalados.

* Para cada conta do MySQL que você criar, especifique o plugin apropriado para o lado do servidor que será usado para autenticação. Se a conta for usar o plugin de autenticação padrão, a declaração de criação da conta não precisa especificar explicitamente o plugin. A variável de sistema `default_authentication_plugin` configura o plugin de autenticação padrão.

* Quando um cliente se conecta, o plugin do lado do servidor informa ao programa do cliente qual plugin do lado do cliente deve ser usado para autenticação.

No caso de uma conta usar um método de autenticação que é o padrão tanto para o servidor quanto para o programa cliente, o servidor não precisa comunicar ao cliente qual plugin do lado do cliente deve ser usado, e uma ida e volta na negociação cliente/servidor pode ser evitada. Isso é verdade para contas que usam autenticação nativa MySQL.

Para clientes padrão do MySQL, como **mysql** e **mysqladmin**, a opção `--default-auth=plugin_name` pode ser especificada na linha de comando como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar, embora o servidor substitua isso se o plugin do lado do servidor associado à conta do usuário exigir um plugin do lado do cliente diferente.

Se o programa do cliente não encontrar o arquivo da biblioteca de plugins do lado do cliente, especifique uma opção `--plugin-dir=dir_name` para indicar a localização do diretório da biblioteca de plugins.

#### Restrições sobre autenticação plugável

A primeira parte desta seção descreve as restrições gerais sobre a aplicabilidade do framework de autenticação plugável descrito na Seção 6.2.13, “Autenticação Plugável”. A segunda parte descreve como os desenvolvedores de conectores de terceiros podem determinar em que medida um conector pode aproveitar as capacidades de autenticação plugável e quais os passos a serem tomados para se tornar mais conformista.

O termo “autenticação nativa” usado aqui se refere à autenticação contra senhas armazenadas na tabela do sistema `mysql.user`. Esse é o mesmo método de autenticação fornecido por servidores MySQL mais antigos, antes de a autenticação plugável ser implementada. “Autenticação nativa do Windows” se refere à autenticação usando as credenciais de um usuário que já iniciou sessão no Windows, conforme implementado pelo plugin de Autenticação Nativa do Windows (“plugin do Windows” abreviado).

* Restrições de autenticação geral intercambiável
* Autenticação intercambiável e Conectores de terceiros

##### Restrições Gerais de Autenticação Conectada

##### Restrições Gerais de Autenticação Conectada

This document describes the general restrictions on the use of plug-in authentication in the Microsoft Dynamics 365 for Finance and Operations environment.

Este documento descreve as restrições gerais sobre o uso de autenticação plug-in no ambiente Microsoft Dynamics 365 para Finanças e Operações.

* **Conectador/C++:** Os clientes que utilizam este conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa.

Exceção: Um conector suporta autenticação plugável se foi construído para se conectar dinamicamente ao `libmysqlclient` (em vez de estaticamente) e carrega a versão atual do `libmysqlclient` se essa versão estiver instalada, ou se o conector for recompilado a partir de fonte para se conectar ao `libmysqlclient` atual.

* **Connector/NET:** Os clientes que utilizam o Connector/NET podem se conectar ao servidor por meio de contas que utilizam autenticação nativa ou autenticação nativa do Windows.

* **Conectador/PHP:** Os clientes que utilizam este conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa, quando compilados usando o driver nativo MySQL para PHP (`mysqlnd`).

* **Autenticação nativa do Windows:** Conectar através de uma conta que utiliza o plugin do Windows requer a configuração do Domínio do Windows. Sem isso, a autenticação NTLM é usada e, então, apenas conexões locais são possíveis; ou seja, o cliente e o servidor devem rodar no mesmo computador.

* **Usuários proxy:** O suporte para usuários proxy está disponível na medida em que os clientes podem se conectar através de contas autenticadas com plugins que implementam a capacidade de usuário proxy (ou seja, plugins que podem retornar um nome de usuário diferente do do usuário que está se conectando). Por exemplo, os plugins PAM e Windows suportam usuários proxy. Os plugins de autenticação `mysql_native_password` e `sha256_password` não suportam usuários proxy por padrão, mas podem ser configurados para isso; consulte Suporte do servidor para mapeamento de usuários proxy.

* **Replicação**: As réplicas podem utilizar não apenas contas de origem com autenticação nativa, mas também se conectar através de contas de origem que utilizam autenticação não nativa, se o plugin necessário do lado do cliente estiver disponível. Se o plugin estiver integrado ao `libmysqlclient`, ele estará disponível por padrão. Caso contrário, o plugin deve ser instalado no lado da réplica no diretório nomeado pela variável de sistema `plugin_dir` da réplica.

* **Tabelas `FEDERATED`:** Uma tabela `FEDERATED` pode acessar a tabela remota apenas por meio de contas no servidor remoto que utilizem autenticação nativa.

##### Autenticação Conectada e Conectores de Terceiros

Os desenvolvedores de conectores de terceiros podem usar as seguintes diretrizes para determinar a prontidão de um conector para aproveitar as capacidades de autenticação plugável e quais passos devem ser tomados para se tornar mais compatível:

* Um conector existente que não recebeu alterações utiliza autenticação nativa e os clientes que utilizam o conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa. * No entanto, você deve testar o conector contra uma versão recente do servidor para verificar se essas conexões ainda funcionam sem problemas.

Exceção: Um conector pode funcionar com autenticação plugável sem quaisquer alterações se ele se conectar dinamicamente a `libmysqlclient` (em vez de estaticamente) e carrega a versão atual de `libmysqlclient` se essa versão estiver instalada.

* Para aproveitar as capacidades de autenticação plugáveis, um conector que é baseado em `libmysqlclient` deve ser relinkado contra a versão atual de `libmysqlclient`. Isso permite que o conector suporte conexões através de contas que exigem plugins do lado do cliente agora construídos em `libmysqlclient` (como o plugin em texto claro necessário para autenticação PAM e o plugin do Windows necessário para autenticação nativa do Windows). A ligação com um `libmysqlclient` atual também permite que o conector acesse plugins do lado do cliente instalados no diretório padrão do plugin MySQL (tipicamente o diretório nomeado pelo valor padrão da variável de sistema `plugin_dir` do servidor local).

Se um conector estiver vinculado dinamicamente a `libmysqlclient`, é necessário garantir que a versão mais recente de `libmysqlclient` esteja instalada no host do cliente e que o conector a carregue no momento da execução.

* Outra maneira de um conector suportar um método de autenticação específico é implementá-lo diretamente no protocolo cliente/servidor. O Connector/NET utiliza essa abordagem para fornecer suporte à autenticação nativa do Windows.

* Se um conector deve ser capaz de carregar plugins do lado do cliente a partir de um diretório diferente do diretório padrão de plugins, ele deve implementar algum meio para que os usuários do cliente especifiquem o diretório. As possibilidades para isso incluem uma opção de linha de comando ou uma variável de ambiente a partir da qual o conector pode obter o nome do diretório. Programas padrão de clientes MySQL, como **mysql** e **mysqladmin**, implementam uma opção `--plugin-dir`. Veja também a Interface de Plugin de Cliente API C.

* O suporte de usuários proxy por um conector depende, conforme descrito anteriormente nesta seção, se os métodos de autenticação que ele suporta permitem usuários proxy.

### 6.2.14 Usuários de Proxy

O servidor MySQL autentica as conexões dos clientes usando plugins de autenticação. O plugin que autentica uma conexão específica pode solicitar que o usuário que está se conectando (externo) seja tratado como um usuário diferente para fins de verificação de privilégios. Isso permite que o usuário externo seja um proxy para o segundo usuário; ou seja, assuma os privilégios do segundo usuário:

* O usuário externo é um "usuário proxy" (um usuário que pode se passar por outro usuário ou se tornar conhecido como outro usuário).

* O segundo usuário é um "usuário proxy" (um usuário cuja identidade e privilégios podem ser assumidos por um usuário proxy).

Esta seção descreve como a capacidade de usuário proxy funciona. Para informações gerais sobre plugins de autenticação, consulte a Seção 6.2.13, “Plugins de Autenticação”. Para informações sobre plugins específicos, consulte a Seção 6.4.1, “Plugins de Autenticação”. Para informações sobre a escrita de plugins de autenticação que suportam usuários proxy, consulte Implementando Suporte ao Usuário Proxy em Plugins de Autenticação.

* Requisitos para Suporte ao Usuário Proxy
* Exemplo Simples de Usuário Proxy
* Prevenindo Login Direto em Contas Proxy
* Concedendo e Revoando o Privilegio de PROXY
* Usuários de Proxy Padrão
* Conflitos entre Usuários de Proxy Padrão e Usuário Anônimo
* Suporte do Servidor para Mapeamento de Usuário Proxy
* Variáveis do Sistema de Usuário Proxy

#### Requisitos para Suporte ao Usuário Proxy

Para que a proxy ocorra para um plugin de autenticação específico, essas condições devem ser satisfeitas:

* O proxy deve ser suportado, seja pelo próprio plugin, seja pelo servidor MySQL em nome do plugin. Neste último caso, o suporte do servidor pode precisar ser habilitado explicitamente; consulte Suporte ao servidor para mapeamento de usuários proxy.

* A conta do usuário do proxy externo deve ser configurada para ser autenticada pelo plugin. Use a declaração `CREATE USER` para associar uma conta a um plugin de autenticação, ou `ALTER USER` para alterá-lo.

* A conta do usuário proxy deve existir e ter os privilégios que serão assumidos pelo usuário proxy. Use as declarações `CREATE USER` e `GRANT` para isso.

Normalmente, o usuário proxy é configurado para que ele possa ser usado apenas em cenários de proxy e não para logins diretos.

* A conta de usuário proxy deve ter o privilégio `PROXY` para a conta proxy. Use a declaração `GRANT` para isso.

* Para que um cliente conectado à conta do proxy seja tratado como um usuário do proxy, o plugin de autenticação deve retornar um nome de usuário diferente do nome do usuário do cliente, para indicar o nome de usuário da conta proxy que define os privilégios a serem assumidos pelo usuário do proxy.

Alternativamente, para plugins que são fornecidos com mapeamento proxy pelo servidor, o usuário proxy é determinado a partir do privilégio `PROXY` mantido pelo usuário proxy.

O mecanismo de proxy permite mapear apenas o nome do usuário do cliente externo para o nome do usuário proxy. Não há disposição para mapear nomes de host:

* Quando um cliente se conecta ao servidor, o servidor determina a conta correta com base no nome do usuário passado pelo programa do cliente e no host a partir do qual o cliente se conecta.

* Se essa conta for uma conta proxy, o servidor tenta determinar a conta apropriada proxy, encontrando uma correspondência para uma conta proxy usando o nome de usuário retornado pelo plugin de autenticação e o nome do host da conta proxy. O nome do host na conta proxy é ignorado.

#### Exemplo de Usuário de Proxy Simples

Considere as seguintes definições de contas:

```sql
-- create proxy account
CREATE USER 'employee_ext'@'localhost'
  IDENTIFIED WITH my_auth_plugin
  AS 'my_auth_string';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'employee'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL
  ON employees.*
  TO 'employee'@'localhost';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'employee'@'localhost'
  TO 'employee_ext'@'localhost';
```

Quando um cliente se conecta como `employee_ext` do host local, o MySQL usa o plugin denominado `my_auth_plugin` para realizar a autenticação. Suponha que `my_auth_plugin` retorne um nome de usuário de `employee` ao servidor, com base no conteúdo de `'my_auth_string'` e, possivelmente, consultando algum sistema de autenticação externo. O nome `employee` difere de `employee_ext`, então retornar `employee` serve como um pedido ao servidor para tratar o usuário externo `employee_ext`, para fins de verificação de privilégios, como o usuário local `employee`.

Neste caso, `employee_ext` é o usuário proxy e `employee` é o usuário proxy.

O servidor verifica se a autenticação de proxy para `employee` é possível para o usuário `employee_ext` verificando se `employee_ext` (o usuário proxy) tem o privilégio `PROXY` para `employee` (o usuário proxy). Se este privilégio não tiver sido concedido, ocorre um erro. Caso contrário, `employee_ext` assume os privilégios de `employee`. O servidor verifica as declarações executadas durante a sessão do cliente por `employee_ext` contra os privilégios concedidos a `employee`. Neste caso, `employee_ext` pode acessar tabelas no banco de dados `employees`.

A conta proxy, `employee`, utiliza o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 6.4.1.10, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenindo Login Direto em Contas Proxy.

Quando ocorre a proxy, as funções `USER()` e `CURRENT_USER()` podem ser usadas para ver a diferença entre o usuário conectando-se (o usuário proxy) e a conta cujos privilégios se aplicam durante a sessão atual (o usuário proxy). Para o exemplo descrito anteriormente, essas funções retornam esses valores:

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------------+--------------------+
| USER()                 | CURRENT_USER()     |
+------------------------+--------------------+
| employee_ext@localhost | employee@localhost |
+------------------------+--------------------+
```

Na declaração `CREATE USER` que cria a conta de usuário proxy, a cláusula `IDENTIFIED WITH` que nomeia o plugin de autenticação de suporte a proxy é opcionalmente seguida por uma cláusula `AS 'auth_string'` que especifica uma string que o servidor passa para o plugin quando o usuário se conecta. Se presente, a string fornece informações que ajudam o plugin a determinar como mapear o nome do usuário do cliente proxy (externo) para um nome de usuário proxy. Cabe a cada plugin determinar se ele requer a cláusula `AS`. Se assim for, o formato da string de autenticação depende de como o plugin pretende usá-la. Consulte a documentação de um plugin específico para obter informações sobre os valores da string de autenticação que ele aceita.

#### Prevenindo o Login Direto em Contas Proxy

As contas proxy são geralmente destinadas a serem usadas apenas por meio de contas proxy. Ou seja, os clientes se conectam usando uma conta proxy, e então são mapeados e assumem os privilégios do usuário apropriado proxy.

Existem várias maneiras de garantir que uma conta proxy não possa ser usada diretamente:

* Associe a conta ao plugin de autenticação `mysql_no_login`. Nesse caso, a conta não pode ser usada para logins diretos em nenhuma circunstância. Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 6.4.1.10, “Autenticação Plugável sem Login”.

* Inclua a opção `ACCOUNT LOCK` ao criar a conta. Veja a Seção 13.7.1.2, “Declaração CREATE USER”. Com este método, inclua também uma senha para que, se a conta for desbloqueada posteriormente, não possa ser acessada sem senha. (Se o plugin `validate_password` estiver habilitado, ele não permite a criação de uma conta sem senha, mesmo que a conta esteja bloqueada. Veja a Seção 6.4.3, “O Plugin de Validação de Senha”.)

* Crie a conta com uma senha, mas não diga a ninguém a senha. Se você não deixar ninguém saber a senha da conta, os clientes não poderão usá-la para se conectar diretamente ao servidor MySQL.

#### Concedendo e Revogando o Privilegio de PROXY

O privilégio `PROXY` é necessário para permitir que um usuário externo se conecte e tenha os privilégios de outro usuário. Para conceder este privilégio, use a declaração `GRANT`. Por exemplo:

```sql
GRANT PROXY ON 'proxied_user' TO 'proxy_user';
```

A declaração cria uma linha na tabela de concessão `mysql.proxies_priv`.

No momento da conexão, *`proxy_user`* deve representar um usuário válido autenticado externamente no MySQL, e *`proxied_user`* deve representar um usuário válido autenticado localmente. Caso contrário, a tentativa de conexão falha.

A sintaxe correspondente ao `REVOKE` é:

```sql
REVOKE PROXY ON 'proxied_user' FROM 'proxy_user';
```

As extensões de sintaxe MySQL `GRANT` e `REVOKE` funcionam como de costume. Exemplos:

```sql
-- grant PROXY to multiple accounts
GRANT PROXY ON 'a' TO 'b', 'c', 'd';

-- revoke PROXY from multiple accounts
REVOKE PROXY ON 'a' FROM 'b', 'c', 'd';

-- grant PROXY to an account and enable the account to grant
-- PROXY to the proxied account
GRANT PROXY ON 'a' TO 'd' WITH GRANT OPTION;

-- grant PROXY to default proxy account
GRANT PROXY ON 'a' TO ''@'';
```

O privilégio `PROXY` pode ser concedido nestes casos:

* Por um usuário que tem `GRANT PROXY ... WITH GRANT OPTION` para *`proxied_user`*.

* Por *`proxied_user`* para si mesmo: O valor de `USER()` deve corresponder exatamente a `CURRENT_USER()` e *`proxied_user`*, tanto para as partes do nome do usuário quanto para as partes do nome do host da conta.

A conta inicial `root` criada durante a instalação do MySQL tem o privilégio `PROXY ... WITH GRANT OPTION` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Por exemplo, `root` pode fazer isso:

```sql
CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'admin_password';
GRANT PROXY
  ON ''@''
  TO 'admin'@'localhost'
  WITH GRANT OPTION;
```

Essas declarações criam um usuário `admin` que pode gerenciar todas as mapeamentos `GRANT PROXY`. Por exemplo, `admin` pode fazer isso:

```sql
GRANT PROXY ON sally TO joe;
```

#### Usuários de Proxy Padrão

Para especificar que alguns ou todos os usuários devem se conectar usando um plugin de autenticação dado, crie uma conta "branca" no MySQL com um nome de usuário e nome de host vazios (`''@''`), associe-a a esse plugin e deixe o plugin retornar o nome real do usuário autenticado (se diferente do usuário branco). Suponha que exista um plugin chamado `ldap_auth` que implementa a autenticação LDAP e mapeia os usuários conectados em uma conta de desenvolvedor ou gerente. Para configurar o redirecionamento dos usuários para essas contas, use as seguintes declarações:

```sql
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH ldap_auth
  AS 'O=Oracle, OU=MySQL';

-- create proxied accounts; use
-- mysql_no_login plugin to prevent direct login
CREATE USER 'developer'@'localhost'
  IDENTIFIED WITH mysql_no_login;
CREATE USER 'manager'@'localhost'
  IDENTIFIED WITH mysql_no_login;

-- grant to default proxy account the
-- PROXY privilege for proxied accounts
GRANT PROXY
  ON 'manager'@'localhost'
  TO ''@'';
GRANT PROXY
  ON 'developer'@'localhost'
  TO ''@'';
```

Agora, suponha que um cliente se conecte da seguinte forma:

```sql
$> mysql --user=myuser --password ...
Enter password: myuser_password
```

O servidor não encontra `myuser` definido como um usuário MySQL, mas, como há uma conta de usuário em branco (`''@''`) que corresponde ao nome do usuário e ao nome do host do cliente, o servidor autentica o cliente contra essa conta: O servidor invoca o plugin de autenticação `ldap_auth` e passa `myuser` e *`myuser_password`* como o nome de usuário e a senha.

Se o plugin `ldap_auth` encontrar no diretório LDAP que *`myuser_password`* não é a senha correta para `myuser`, a autenticação falha e o servidor rejeita a conexão.

Se a senha estiver correta e `ldap_auth` verificar que `myuser` é um desenvolvedor, ele retorna o nome do usuário `developer` ao servidor MySQL, em vez de `myuser`. Retornar um nome de usuário diferente do nome do usuário do cliente de `myuser` sinaliza para o servidor que ele deve tratar `myuser` como um proxy. O servidor verifica que `''@''` pode autenticar como `developer` (porque `''@''` tem o privilégio `PROXY` para fazer isso) e aceita a conexão. A sessão prossegue com `myuser` tendo os privilégios do usuário proxy de `developer`. (Esses privilégios devem ser configurados pelo DBA usando declarações `GRANT`, não mostradas.) As funções `USER()` e `CURRENT_USER()` retornam esses valores:

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------+---------------------+
| USER()           | CURRENT_USER()      |
+------------------+---------------------+
| myuser@localhost | developer@localhost |
+------------------+---------------------+
```

Se o plugin, em vez disso, encontrar no diretório LDAP que `myuser` é um gerente, ele retorna `manager` como o nome do usuário e a sessão prossegue com `myuser`, que possui os privilégios do usuário proxy `manager`.

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------+-------------------+
| USER()           | CURRENT_USER()    |
+------------------+-------------------+
| myuser@localhost | manager@localhost |
+------------------+-------------------+
```

Por simplicidade, a autenticação externa não pode ser múltipla: nem as credenciais para `developer` nem as para `manager` são consideradas no exemplo anterior. No entanto, elas ainda são usadas se um cliente tentar se conectar e autenticar diretamente como a conta `developer` ou `manager`, e é por isso que essas contas proxy devem ser protegidas contra login direto (consulte Prevenindo login direto em contas proxy).

#### Conflitos entre o Usuário Proxy Padrão e o Usuário Anônimo

Se você pretende criar um usuário proxy padrão, verifique se há outras contas existentes que "se encaixam em qualquer usuário" e que têm precedência sobre o usuário proxy padrão, porque elas podem impedir que o usuário trabalhe conforme o esperado.

Na discussão anterior, a conta de usuário de proxy padrão tem `''` na parte do host, que corresponde a qualquer host. Se você configurar um usuário de proxy padrão, certifique-se também de verificar se existem contas sem proxy com a mesma parte do usuário e `'%'` na parte do host, porque `'%'` também corresponde a qualquer host, mas tem precedência sobre `''` pelas regras que o servidor usa para classificar as linhas de conta internamente (consulte a Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”).

Suponha que uma instalação do MySQL inclua esses dois perfis:

```sql
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH some_plugin
  AS 'some_auth_string';
-- create anonymous account
CREATE USER ''@'%'
  IDENTIFIED BY 'anon_user_password';
```

A primeira conta (`''@''`) é destinada como o usuário proxy padrão, usado para autenticar conexões para usuários que não correspondem de outra forma a uma conta mais específica. A segunda conta (`''@'%'`) é uma conta de usuário anônimo, que pode ter sido criada, por exemplo, para permitir que usuários sem sua própria conta se conectem anonimamente.

Ambas as contas têm a mesma parte de usuário (`''`), que corresponde a qualquer usuário. E cada conta tem uma parte de host que corresponde a qualquer host. No entanto, há uma prioridade na correspondência de contas para tentativas de conexão, porque as regras de correspondência classificam um host de `'%'` à frente de `''`. Para contas que não correspondem a nenhuma conta mais específica, o servidor tenta autenticá-las contra `''@'%'` (o usuário anônimo) em vez de `''@''` (o usuário proxy padrão). Como resultado, a conta do proxy padrão nunca é usada.

Para evitar esse problema, use uma das seguintes estratégias:

* Remova a conta anônima para que ela não conflita com o usuário do proxy padrão.

* Use um usuário proxy padrão mais específico que corresponda àquele que vem antes do usuário anônimo. Por exemplo, para permitir apenas conexões de proxy `localhost`, use `''@'localhost'`:

  ```sql
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

Além disso, modifique quaisquer declarações de `GRANT PROXY` para nomear `''@'localhost'` em vez de `''@''` como o usuário proxy.

Tenha em atenção que esta estratégia impede as conexões de utilizadores anónimos de `localhost`.

* Use uma conta padrão nomeada em vez de uma conta padrão anônima. Para um exemplo dessa técnica, consulte as instruções para usar o plugin `authentication_windows`. Veja a Seção 6.4.1.8, “Autenticação Plugável do Windows”.

* Crie vários usuários proxy, um para conexões locais e outro para "tudo o resto" (conexões remotas). Isso pode ser útil, especialmente quando os usuários locais devem ter privilégios diferentes dos usuários remotos.

Crie os usuários proxy:

  ```sql
  -- create proxy user for local connections
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  -- create proxy user for remote connections
  CREATE USER ''@'%'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

Crie os usuários proxy:

  ```sql
  -- create proxied user for local connections
  CREATE USER 'developer'@'localhost'
    IDENTIFIED WITH mysql_no_login;
  -- create proxied user for remote connections
  CREATE USER 'developer'@'%'
    IDENTIFIED WITH mysql_no_login;
  ```

Concede ao respectivo endereço proxy o privilégio `PROXY` para a conta proxy correspondente:

  ```sql
  GRANT PROXY
    ON 'developer'@'localhost'
    TO ''@'localhost';
  GRANT PROXY
    ON 'developer'@'%'
    TO ''@'%';
  ```

Por fim, conceda privilégios apropriados aos usuários proxied local e remoto (não mostrados).

Suponha que a combinação `some_plugin`/`'some_auth_string'` faça com que o nome do usuário do cliente seja mapeado para `some_plugin`. As conexões locais correspondem ao usuário proxy `''@'localhost'`, que é mapeado para o usuário proxy `'developer'@'localhost'`. As conexões remotas correspondem ao usuário proxy `''@'%'`, que é mapeado para o usuário proxy `'developer'@'%'`.

#### Suporte do servidor para mapeamento de usuários proxy

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Desses, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`. Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam tal solicitação:

* Por padrão, `check_proxy_users` está desativado, portanto, o servidor não realiza mapeamento de usuários proxy, mesmo para plugins de autenticação que solicitam suporte do servidor para usuários proxy.

* Se `check_proxy_users` estiver habilitado, também pode ser necessário habilitar uma variável de sistema específica do plugin para aproveitar o suporte de mapeamento de usuários do proxy do servidor:

+ Para o plugin `mysql_native_password`, habilite `mysql_native_password_proxy_users`.

+ Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

Por exemplo, para habilitar todas as capacidades anteriores, inicie o servidor com essas linhas no arquivo `my.cnf`:

```sql
[mysqld]
check_proxy_users=ON
mysql_native_password_proxy_users=ON
sha256_password_proxy_users=ON
```

Supondo que as variáveis do sistema relevantes tenham sido habilitadas, crie o usuário proxy como de costume usando `CREATE USER`, em seguida, conceda ao `PROXY` o privilégio a uma única outra conta para ser tratada como o usuário proxy. Quando o servidor recebe um pedido de conexão bem-sucedido para o usuário proxy, ele descobre que o usuário tem o `PROXY` privilégio e usa-o para determinar o usuário proxy apropriado.

```sql
-- create proxy account
CREATE USER 'proxy_user'@'localhost'
  IDENTIFIED WITH mysql_native_password
  BY 'password';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

Para usar a conta proxy, conecte-se ao servidor usando seu nome e senha:

```sql
$> mysql -u proxy_user -p
Enter password: (enter proxy_user password here)
```

A autenticação é bem-sucedida, o servidor descobre que `proxy_user` tem o privilégio `PROXY` para `proxied_user`, e a sessão prossegue com `proxy_user` tendo os privilégios de `proxied_user`.

O mapeamento de usuários proxy realizado pelo servidor está sujeito a essas restrições:

* O servidor não proxy para ou a partir de um usuário anônimo, mesmo que o privilégio associado `PROXY` seja concedido.

* Quando uma única conta recebeu privilégios de proxy para mais de uma conta proxy, o mapeamento de usuários do proxy do servidor não é determinístico. Portanto, não é aconselhável conceder privilégios de proxy a uma única conta para múltiplas contas proxy.

#### Variáveis do Sistema de Usuário Proxy

Duas variáveis do sistema ajudam a rastrear o processo de login do proxy:

* `proxy_user`: Este valor é `NULL` se a proxy não for usada. Caso contrário, indica a conta de usuário da proxy. Por exemplo, se um cliente se autentica através da conta de proxy `''@''`, esta variável é definida da seguinte forma:

  ```sql
  mysql> SELECT @@proxy_user;
  +--------------+
  | @@proxy_user |
  +--------------+
  | ''@''        |
  +--------------+
  ```

* `external_user`: Às vezes, o plugin de autenticação pode usar um usuário externo para autenticar-se no servidor MySQL. Por exemplo, ao usar a autenticação nativa do Windows, um plugin que autentica usando a API do Windows não precisa do ID de login passado para ele. No entanto, ele ainda usa um ID de usuário do Windows para autenticar. O plugin pode retornar esse ID do usuário externo (ou os primeiros 512 bytes UTF-8) ao servidor usando a variável de sessão `external_user` somente leitura. Se o plugin não definir essa variável, seu valor é `NULL`.

### 6.2.15 Bloqueio da Conta

O MySQL suporta o bloqueio e o desbloqueio de contas de usuários usando as cláusulas `ACCOUNT LOCK` e `ACCOUNT UNLOCK` para as declarações `CREATE USER` e `ALTER USER`:

* Quando utilizado com `CREATE USER`, essas cláusulas especificam o estado de bloqueio inicial para uma nova conta. Na ausência de qualquer cláusula, a conta é criada em um estado não bloqueado.

Se o plugin `validate_password` estiver habilitado, ele não permite a criação de uma conta sem uma senha, mesmo que a conta esteja bloqueada. Veja a Seção 6.4.3, “O Plugin de Validação de Senha”.

* Quando utilizado com `ALTER USER`, essas cláusulas especificam o novo estado de bloqueio para uma conta existente. Na ausência de qualquer cláusula, o estado de bloqueio da conta permanece inalterado.

O estado de bloqueio da conta é registrado na coluna `account_locked` da tabela do sistema `mysql.user`. A saída de `SHOW CREATE USER` indica se uma conta está bloqueada ou desbloqueada.

Se um cliente tentar se conectar a uma conta bloqueada, a tentativa falha. O servidor incrementa a variável de status `Locked_connects` que indica o número de tentativas de conexão a uma conta bloqueada, retorna um erro `ER_ACCOUNT_HAS_BEEN_LOCKED` e escreve uma mensagem no log de erro:

```sql
Access denied for user 'user_name'@'host_name'.
Account is locked.
```

A bloquagem de uma conta não afeta a capacidade de se conectar usando um usuário proxy que assume a identidade da conta bloqueada. Também não afeta a capacidade de executar programas ou visualizações armazenadas que tenham um atributo `DEFINER` que nomeia a conta bloqueada. Isso significa que a capacidade de usar uma conta proxy ou programas ou visualizações armazenadas não é afetada pela bloquagem da conta.

A capacidade de bloqueio de contas depende da presença da coluna `account_locked` na tabela do sistema `mysql.user`. Para atualizações a partir de versões do MySQL mais antigas que 5.7.6, realize o procedimento de atualização do MySQL para garantir que essa coluna exista. Veja a Seção 2.10, “Atualizando o MySQL”. Para instalações não atualizadas que não possuem a coluna `account_locked`, o servidor trata todas as contas como desbloqueadas, e o uso das cláusulas `ACCOUNT LOCK` ou `ACCOUNT UNLOCK` produz um erro.

### 6.2.16 Definindo Limites de Recursos da Conta

Uma maneira de restringir o uso dos recursos do servidor MySQL pelo cliente é definir a variável de sistema global `max_user_connections` para um valor não nulo. Isso limita o número de conexões simultâneas que podem ser feitas por qualquer conta, mas não coloca limites sobre o que um cliente pode fazer uma vez conectado. Além disso, definir `max_user_connections` não habilita a gestão de contas individuais. Ambos os tipos de controle são de interesse para os administradores do MySQL.

Para abordar essas preocupações, o MySQL permite limites para contas individuais no uso desses recursos do servidor:

* O número de consultas que uma conta pode emitir por hora
* O número de atualizações que uma conta pode emitir por hora
* O número de vezes que uma conta pode se conectar ao servidor por hora

* Número de conexões simultâneas ao servidor por uma conta

Qualquer declaração que um cliente possa emitir conta para o limite de consulta, a menos que seus resultados sejam servidos a partir do cache de consulta. Apenas as declarações que modificam bancos de dados ou tabelas contam para o limite de atualização.

Uma “conta” neste contexto corresponde a uma linha na tabela do sistema `mysql.user`. Ou seja, uma conexão é avaliada em relação aos valores `User` e `Host` na linha da tabela `user` que se aplica à conexão. Por exemplo, uma conta `'usera'@'%.example.com'` corresponde a uma linha na tabela `user` que tem os valores `User` e `Host` de `usera` e `%.example.com`, para permitir que `usera` se conecte de qualquer host no domínio `example.com`. Neste caso, o servidor aplica limites de recursos nesta linha coletivamente a todas as conexões por `usera` de qualquer host no domínio `example.com`, porque todas essas conexões usam a mesma conta.

Antes do MySQL 5.0, uma “conta” era avaliada com base no host real a partir do qual um usuário se conecta. Esse método mais antigo de contabilidade pode ser selecionado iniciando o servidor com a opção `--old-style-user-limits`. Neste caso, se `usera` se conecta simultaneamente a partir de `host1.example.com` e `host2.example.com`, o servidor aplica os limites do recurso da conta separadamente para cada conexão. Se `usera` se conecta novamente a partir de `host1.example.com`, o servidor aplica os limites para essa conexão juntamente com a conexão existente desse host.

Para estabelecer limites de recursos para uma conta no momento da criação da conta, use a declaração `CREATE USER`. Para modificar os limites de uma conta existente, use `ALTER USER`. Forneça uma cláusula `WITH` que nomeie cada recurso a ser limitado. O valor padrão para cada limite é zero (sem limite). Por exemplo, para criar uma nova conta que possa acessar o banco de dados `customer`, mas apenas de forma limitada, emita essas declarações:

```sql
mysql> CREATE USER 'francis'@'localhost' IDENTIFIED BY 'frank'
    ->     WITH MAX_QUERIES_PER_HOUR 20
    ->          MAX_UPDATES_PER_HOUR 10
    ->          MAX_CONNECTIONS_PER_HOUR 5
    ->          MAX_USER_CONNECTIONS 2;
```

Os tipos de limite não precisam de todos serem nomeados na cláusula `WITH`, mas aqueles nomeados podem estar presentes em qualquer ordem. O valor para cada limite por hora deve ser um inteiro representando um número por hora. Para `MAX_USER_CONNECTIONS`, o limite é um inteiro representando o número máximo de conexões simultâneas por conta. Se este limite for definido como zero, o valor da variável de sistema global `max_user_connections` determina o número de conexões simultâneas. Se `max_user_connections` também for zero, não há limite para a conta.

Para modificar os limites de uma conta existente, use uma declaração `ALTER USER`. A declaração a seguir altera o limite de consulta para `francis` para 100:

```sql
mysql> ALTER USER 'francis'@'localhost' WITH MAX_QUERIES_PER_HOUR 100;
```

A declaração modifica apenas o valor limite especificado e deixa a conta de outra forma inalterada.

Para remover um limite, defina seu valor como zero. Por exemplo, para remover o limite de quantas vezes por hora o `francis` pode se conectar, use esta declaração:

```sql
mysql> ALTER USER 'francis'@'localhost' WITH MAX_CONNECTIONS_PER_HOUR 0;
```

Como mencionado anteriormente, o limite de conexão simultânea para uma conta é determinado a partir do limite `MAX_USER_CONNECTIONS` e da variável de sistema `max_user_connections`. Suponha que o valor global `max_user_connections` seja 10 e três contas tenham limites de recursos individuais especificados da seguinte forma:

```sql
ALTER USER 'user1'@'localhost' WITH MAX_USER_CONNECTIONS 0;
ALTER USER 'user2'@'localhost' WITH MAX_USER_CONNECTIONS 5;
ALTER USER 'user3'@'localhost' WITH MAX_USER_CONNECTIONS 20;
```

`user1` tem um limite de conexão de 10 (o valor global `max_user_connections`) porque tem um limite `MAX_USER_CONNECTIONS` de zero. `user2` e `user3` têm limites de conexão de 5 e 20, respectivamente, porque têm limites `MAX_USER_CONNECTIONS` não nulos.

O servidor armazena os limites de recursos para uma conta na linha da tabela `user` correspondente à conta. As colunas `max_questions`, `max_updates` e `max_connections` armazenam os limites por hora, e a coluna `max_user_connections` armazena o limite do `MAX_USER_CONNECTIONS` (ver Seção 6.2.3, “Tabelas de Concessão”).

O contagem do uso de recursos ocorre quando qualquer conta tiver um limite não nulo colocado em seu uso de qualquer um dos recursos.

À medida que o servidor é executado, ele conta o número de vezes que cada conta usa os recursos. Se uma conta atingir seu limite de número de conexões na última hora, o servidor rejeita mais conexões para a conta até que essa hora termine. Da mesma forma, se a conta atingir seu limite de número de consultas ou atualizações, o servidor rejeita mais consultas ou atualizações até que a hora termine. Em todos esses casos, o servidor emite mensagens de erro apropriadas.

O contagem de recursos ocorre por conta, não por cliente. Por exemplo, se sua conta tiver um limite de consulta de 50, você não pode aumentar seu limite para 100 fazendo duas conexões simultâneas de cliente ao servidor. As consultas emitidas em ambas as conexões são contadas juntas.

As atualizações de contagem de uso de recursos por hora podem ser redefinidas globalmente para todas as contas ou individualmente para uma conta específica:

* Para redefinir as contagens atuais para zero em todas as contas, emita uma declaração `FLUSH USER_RESOURCES`. As contagens também podem ser redefinidas recarregando as tabelas de concessão (por exemplo, com uma declaração `FLUSH PRIVILEGES` ou um comando **mysqladmin reload**).

* Os contagem de uma conta individual podem ser redefinidas para zero, definindo novamente qualquer um de seus limites. Especifique um valor de limite igual ao valor atualmente atribuído à conta.

Os recálculos por hora do contador não afetam o limite `MAX_USER_CONNECTIONS`.

Todos os contagem começam em zero quando o servidor começa. As contagens não são transferidas através dos reinício do servidor.

Para o limite `MAX_USER_CONNECTIONS`, pode ocorrer um caso marginal se a conta tiver, atualmente, o número máximo de conexões permitidas para ela: uma desconexão seguida rapidamente por uma conexão pode resultar em um erro (`ER_TOO_MANY_USER_CONNECTIONS` ou `ER_USER_LIMIT_REACHED`) se o servidor não tiver processado completamente a desconexão até que a conexão ocorra. Quando o servidor termina o processamento da desconexão, outra conexão é permitida novamente.

### 6.2.17 Solução de problemas com problemas de conexão ao MySQL

Se você encontrar problemas ao tentar se conectar ao servidor MySQL, os seguintes itens descrevem algumas ações que você pode tomar para corrigir o problema.

* Certifique-se de que o servidor está em execução. Se não estiver, os clientes não poderão se conectar a ele. Por exemplo, se uma tentativa de conexão com o servidor falhar com uma mensagem como uma das seguintes, uma das causas pode ser que o servidor não esteja em execução:

  ```sql
  $> mysql
  ERROR 2003: Can't connect to MySQL server on 'host_name' (111)
  $> mysql
  ERROR 2002: Can't connect to local MySQL server through socket
  '/tmp/mysql.sock' (111)
  ```

* É possível que o servidor esteja em execução, mas você esteja tentando se conectar usando uma porta TCP/IP, canal de comunicação ou arquivo de soquete Unix diferente daquela em que o servidor está ouvindo. Para corrigir isso quando você invoca um programa cliente, especifique uma opção `--port` para indicar o número de porta apropriado, ou uma opção `--socket` para indicar o canal de comunicação ou arquivo de soquete Unix apropriado. Para descobrir onde está o arquivo de soquete, você pode usar este comando:

  ```sql
  $> netstat -ln | grep mysql
  ```

* Certifique-se de que o servidor não foi configurado para ignorar conexões de rede ou (se você está tentando se conectar remotamente) que não foi configurado para ouvir apenas localmente em suas interfaces de rede. Se o servidor foi iniciado com a variável de sistema `skip_networking` habilitada, ele não aceita conexões TCP/IP de forma alguma. Se o servidor foi iniciado com a variável de sistema `bind_address` definida como `127.0.0.1`, ele escuta conexões TCP/IP apenas localmente na interface de loopback e não aceita conexões remotas.

* Verifique para garantir que não há firewall bloqueando o acesso ao MySQL. Seu firewall pode estar configurado com base na aplicação que está sendo executada, ou no número de porta usado pelo MySQL para comunicação (3306 por padrão). Em Linux ou Unix, verifique a configuração de suas tabelas de IP (ou similar) para garantir que a porta não tenha sido bloqueada. Em Windows, aplicativos como ZoneAlarm ou o Firewall do Windows podem precisar ser configurados para não bloquear a porta do MySQL.

* As tabelas de concessão devem ser configuradas corretamente para que o servidor possa usá-las para controle de acesso. Para alguns tipos de distribuição (como distribuições binárias no Windows ou RPM e DEB no Linux), o processo de instalação inicializa o diretório de dados do MySQL, incluindo o banco de dados do sistema `mysql` que contém as tabelas de concessão. Para distribuições que não fazem isso, você deve inicializar o diretório de dados manualmente. Para detalhes, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

Para determinar se você precisa inicializar as tabelas de concessão, procure um diretório `mysql` no diretório de dados. (O diretório de dados normalmente é nomeado `data` ou `var` e está localizado sob o diretório de instalação do MySQL.) Certifique-se de que você tem um arquivo chamado `user.MYD` no diretório de banco de dados `mysql`. Se não, inicialize o diretório de dados. Após fazer isso e iniciar o servidor, você deve ser capaz de se conectar ao servidor.

* Após uma instalação recente, se você tentar fazer login no servidor como `root` sem usar uma senha, você pode receber a seguinte mensagem de erro.

  ```sql
  $> mysql -u root
  ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
  ```

Isso significa que uma senha de raiz já foi atribuída durante a instalação e ela precisa ser fornecida. Veja a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”, sobre as diferentes maneiras pelas quais a senha poderia ter sido atribuída e, em alguns casos, como encontrá-la. Se você precisar redefinir a senha de raiz, veja as instruções na Seção B.3.3.2, “Como Redefinir a Senha de Raiz”. Após encontrar ou redefinir sua senha, faça login novamente como `root` usando a opção `--password` (ou `-p`):

  ```sql
  $> mysql -u root -p
  Enter password:
  ```

No entanto, o servidor vai permitir que você se conecte como `root` sem usar uma senha se você tiver inicializado o MySQL usando **mysqld --initialize-insecure** (consulte Seção 2.9.1, “Inicializando o Diretório de Dados” para detalhes). Esse é um risco de segurança, então você deve definir uma senha para a conta `root`; consulte Seção 2.9.4, “Segurando a Conta Inicial do MySQL” para instruções.

* Se você atualizou uma instalação MySQL existente para uma versão mais recente, você realizou o procedimento de atualização do MySQL? Se não, faça isso. A estrutura das tabelas de concessão muda ocasionalmente quando novas capacidades são adicionadas, então, após uma atualização, você deve sempre garantir que suas tabelas tenham a estrutura atual. Para instruções, consulte a Seção 2.10, “Atualizando o MySQL”.

* Se um programa de cliente receber a seguinte mensagem de erro quando tenta se conectar, isso significa que o servidor espera senhas em um formato mais recente do que o cliente é capaz de gerar:

  ```sql
  $> mysql
  Client does not support authentication protocol requested
  by server; consider upgrading MySQL client
  ```

Para obter informações sobre como lidar com isso, consulte a Seção 6.4.1.3, “Migrando para fora da criptografia de senha pré-4.1 e do plugin mysql\_old\_password”.

* Lembre-se de que os programas de cliente utilizam parâmetros de conexão especificados em arquivos de opção ou variáveis de ambiente. Se um programa de cliente parecer estar enviando parâmetros de conexão padrão incorretos quando você não os especificou na linha de comando, verifique quaisquer arquivos de opção aplicáveis e seu ambiente. Por exemplo, se você receber `Access denied` ao executar um cliente sem nenhuma opção, certifique-se de que você não especificou uma senha antiga em nenhum de seus arquivos de opção!

Você pode suprimir o uso de arquivos de opção por um programa cliente, invocando-o com a opção `--no-defaults`. Por exemplo:

  ```sql
  $> mysqladmin --no-defaults -u root version
  ```

Os arquivos de opção que os clientes usam estão listados na Seção 4.2.2.2, “Usando arquivos de opção”. As variáveis de ambiente estão listadas na Seção 4.9, “Variáveis de ambiente”.

* Se você receber o seguinte erro, isso significa que você está usando uma senha incorreta do `root`:

  ```sql
  $> mysqladmin -u root -pxxxx ver
  Access denied for user 'root'@'localhost' (using password: YES)
  ```

Se o erro anterior ocorrer mesmo quando você não especificou uma senha, isso significa que você tem uma senha incorreta listada em algum arquivo de opção. Tente a opção `--no-defaults` conforme descrito no item anterior.

Para obter informações sobre a alteração de senhas, consulte a Seção 6.2.10, “Atribuição de senhas de conta”.

Se você perdeu ou esqueceu a senha do `root`, consulte a Seção B.3.3.2, “Como redefinir a senha do root”.

* `localhost` é um sinônimo do nome do seu host local e também é o host padrão para o qual os clientes tentam se conectar se você não especificar explicitamente um host.

Você pode usar a opção `--host=127.0.0.1` para nomear o host do servidor explicitamente. Isso faz uma conexão TCP/IP com o servidor local `mysqld`. Você também pode usar TCP/IP, especificando uma opção `--host` que usa o nome real do host local. Neste caso, o nome do host deve ser especificado em uma linha de tabela `user` no host do servidor, mesmo que você esteja executando o programa cliente no mesmo host que o servidor.

* A mensagem de erro `Access denied` informa quem você está tentando fazer login como, o host do cliente do qual você está tentando se conectar e se você estava usando uma senha. Normalmente, você deve ter uma linha na tabela `user` que corresponda exatamente ao nome do host e ao nome de usuário que foram fornecidos na mensagem de erro. Por exemplo, se você receber uma mensagem de erro que contém `using password: NO`, isso significa que você tentou fazer login sem uma senha.

* Se você receber um erro `Access denied` ao tentar se conectar ao banco de dados com `mysql -u user_name`, você pode estar com um problema com a tabela `user`. Verifique isso executando `mysql -u root mysql` e emitindo esta declaração SQL:

  ```sql
  SELECT * FROM user;
  ```

O resultado deve incluir uma linha com as colunas `Host` e `User` correspondendo ao nome do host do seu cliente e ao nome do usuário do MySQL.

* Se o seguinte erro ocorrer quando você tenta se conectar a um host diferente daquele em que o servidor MySQL está em execução, isso significa que não há uma linha na tabela `user` com um valor `Host` que corresponda ao host do cliente:

  ```sql
  Host ... is not allowed to connect to this MySQL server
  ```

Você pode corrigir isso configurando uma conta para a combinação do nome do host do cliente e do nome de usuário que você está usando ao tentar se conectar.

Se você não conhece o endereço IP ou o nome do host da máquina da qual está se conectando, deve colocar uma linha com `'%'` como o valor da coluna `Host` na tabela `user`. Após tentar se conectar a partir da máquina do cliente, use uma consulta `SELECT USER()` para ver como você realmente se conectou. Em seguida, mude o `'%'` na linha da tabela `user` para o nome do host real que aparece no log. Caso contrário, seu sistema fica inseguro, pois permite conexões de qualquer host para o nome de usuário dado.

Em Linux, outra razão pela qual esse erro pode ocorrer é que você está usando uma versão binária do MySQL que foi compilada com uma versão diferente da biblioteca `glibc` do que a que você está usando. Nesse caso, você deve atualizar seu sistema operacional ou `glibc`, ou baixar uma distribuição de fonte da versão do MySQL e compilar manualmente. Um RPM de fonte é normalmente trivial de compilar e instalar, então isso não é um grande problema.

* Se você especificar um nome de host ao tentar se conectar, mas receber uma mensagem de erro onde o nome de host não é mostrado ou é um endereço IP, isso significa que o servidor MySQL teve um erro ao tentar resolver o endereço IP do host do cliente em um nome:

  ```sql
  $> mysqladmin -u root -pxxxx -h some_hostname ver
  Access denied for user 'root'@'' (using password: YES)
  ```

Se você tentar se conectar como `root` e receber o seguinte erro, isso significa que você não tem uma linha na tabela `user` com um valor na coluna `User` de `'root'` e que `mysqld` não consegue resolver o nome do host do seu cliente:

  ```sql
  Access denied for user ''@'unknown'
  ```

Esses erros indicam um problema no DNS. Para corrigi-lo, execute **mysqladmin flush-hosts** para redefinir o cache de hosts interno do DNS. Veja a Seção 5.1.11.2, “Consultas de DNS e o cache de hosts”.

Algumas soluções permanentes são:

+ Descubra o que está errado com o seu servidor DNS e corrija-o.
+ Especifique endereços IP em vez de nomes de host nas tabelas de concessão do MySQL.

+ Coloque uma entrada para o nome da máquina do cliente em `/etc/hosts` em Unix ou `\windows\hosts` em Windows.

+ Inicie `mysqld` com a variável de sistema `skip_name_resolve` habilitada.

Inicie `mysqld` com a opção `--skip-host-cache`.

+ Em Unix, se você estiver executando o servidor e o cliente na mesma máquina, conecte-se a `localhost`. Para conexões a `localhost`, os programas MySQL tentam se conectar ao servidor local usando um arquivo de socket Unix, a menos que haja parâmetros de conexão especificados para garantir que o cliente faça uma conexão TCP/IP. Para mais informações, consulte a Seção 4.2.4, “Conectando ao servidor MySQL usando opções de comando”.

+ Em Windows, se você estiver executando o servidor e o cliente na mesma máquina e o servidor suporte conexões de canal nomeado, conecte-se ao nome do host `.` (período). As conexões a `.` usam um canal nomeado em vez de TCP/IP.

* Se o `mysql -u root` funcionar, mas o `mysql -h your_hostname -u root` resultar no `Access denied` (onde *`your_hostname`* é o nome real do host local), você pode não ter o nome correto para o seu host na tabela `user`. Um problema comum aqui é que o valor `Host` na linha da tabela `user` especifica um nome de host não qualificado, mas as rotinas de resolução de nomes do seu sistema retornam um nome de domínio totalmente qualificado (ou vice-versa). Por exemplo, se você tiver uma linha com o host `'pluto'` na tabela `user`, mas seu DNS informar ao MySQL que o nome do seu host é `'pluto.example.com'`, a linha não funciona. Tente adicionar uma linha à tabela `user` que contenha o endereço IP do seu host como o valor da coluna `Host`. (Alternativamente, você poderia adicionar uma linha à tabela `user` com um valor `Host` que contenha um caractere curinga (por exemplo, `'pluto.%'`). No entanto, o uso de valores `Host` terminando com `%` é *inseguro* e *não é recomendado!)

* Se o `mysql -u user_name` funcionar, mas o `mysql -u user_name some_db` não, você não concedeu acesso ao usuário especificado para o banco de dados denominado *`some_db`*.

* Se o `mysql -u user_name` funcionar quando executado no host do servidor, mas o `mysql -h host_name -u user_name` não funcionar quando executado em um host de cliente remoto, você não ativou o acesso ao servidor para o nome de usuário especificado a partir do host remoto.

* Se você não conseguir descobrir por que está recebendo `Access denied`, remova da tabela `user` todas as linhas que têm valores de `Host` contendo caracteres de asterisco (linhas que contêm caracteres de `'%'` ou `'_'`). Um erro muito comum é inserir uma nova linha com `Host`=`'%'` e `User`=`'some_user'`, pensando que isso permite especificar `localhost` para se conectar da mesma máquina. A razão pela qual isso não funciona é que os privilégios padrão incluem uma linha com `Host`=`'localhost'` e `User`=`''`. Como essa linha tem um valor de `Host` `'localhost'` que é mais específico do que `'%'`, ela é usada preferencialmente à nova linha ao se conectar a partir de `localhost`! O procedimento correto é inserir uma segunda linha com `Host`=`'localhost'` e `User`=`'some_user'`, ou excluir a linha com `Host`=`'localhost'` e `User`=`''`. Após excluir a linha, lembre-se de emitir uma declaração de `FLUSH PRIVILEGES` para recarregar as tabelas de concessão. Veja também a Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

* Se você conseguir se conectar ao servidor MySQL, mas receber uma mensagem `Access denied` sempre que emitir uma declaração `SELECT ... INTO OUTFILE` ou `LOAD DATA`, sua linha na tabela `user` não tem o privilégio `FILE` habilitado.

* Se você alterar as tabelas de privilégios diretamente (por exemplo, usando as declarações `INSERT`, `UPDATE` ou `DELETE`), e suas alterações parecerem ignoradas, lembre-se de que você deve executar uma declaração `FLUSH PRIVILEGES` ou um comando **mysqladmin flush-privileges** para fazer o servidor recarregar as tabelas de privilégios. Caso contrário, suas alterações não terão efeito até a próxima vez que o servidor for reiniciado. Lembre-se de que, após alterar a senha do `root` com uma declaração `UPDATE`, você não precisa especificar a nova senha até depois de esvaziar os privilégios, porque o servidor ainda não sabe que você mudou a senha.

* Se seus privilégios parecerem ter mudado em meio a uma sessão, pode ser que um administrador do MySQL os tenha alterado. Recarregar as tabelas de concessão afeta as novas conexões do cliente, mas também afeta as conexões existentes, conforme indicado na Seção 6.2.9, “Quando as Alterações de Privilegio Se Tornam Efetivas”.

* Se você tiver problemas de acesso com um programa Perl, PHP, Python ou ODBC, tente se conectar ao servidor com `mysql -u user_name db_name` ou `mysql -u user_name -ppassword db_name`. Se você conseguir se conectar usando o cliente **mysql**, o problema está com seu programa, não com os privilégios de acesso. (Não há espaço entre `-p` e a senha; você também pode usar a sintaxe `--password=password` para especificar a senha. Se você usar a opção `-p` ou `--password` sem valor de senha, o MySQL solicitará a senha.)

* Para fins de teste, inicie o servidor `mysqld` com a opção `--skip-grant-tables`. Em seguida, você pode alterar as tabelas de concessão do MySQL e usar a declaração `SHOW GRANTS` para verificar se suas modificações tiveram o efeito desejado. Quando estiver satisfeito com suas alterações, execute **mysqladmin flush-privileges** para informar ao servidor `mysqld` que recarregue os privilégios. Isso permite que você comece a usar o novo conteúdo da tabela de concessão sem parar e reiniciar o servidor.

* Se tudo mais falhar, inicie o servidor `mysqld` com uma opção de depuração (por exemplo, `--debug=d,general,query`). Isso exibe informações sobre o host e o usuário das conexões tentativas, bem como informações sobre cada comando emitido. Veja a Seção 5.8.3, “O pacote DBUG”.

* Se você tiver outros problemas com as tabelas de concessão do MySQL e quiser perguntar sobre isso no [Slack da Comunidade MySQL][(https://mysqlcommunity.slack.com/)], sempre forneça um dump das tabelas de concessão do MySQL. Você pode fazer um dump das tabelas com o comando **mysqldump mysql**. Para fazer um relatório de erro, consulte as instruções na Seção 1.5, “Como relatar erros ou problemas”. Em alguns casos, você pode precisar reiniciar o `mysqld` com o `--skip-grant-tables` para executar o **mysqldump**.

### 6.2.18 Auditoria da atividade de conta baseada em SQL

As aplicações podem usar as seguintes diretrizes para realizar auditoria baseada em SQL que vincula a atividade do banco de dados a contas do MySQL.

As contas do MySQL correspondem a linhas na tabela do sistema `mysql.user`. Quando um cliente se conecta com sucesso, o servidor autentica o cliente em uma linha específica desta tabela. Os valores das colunas `User` e `Host` nesta linha identificam de forma única a conta e correspondem ao formato `'user_name'@'host_name'` no qual os nomes das contas são escritos em declarações SQL.

A conta usada para autenticar um cliente determina quais privilégios o cliente tem. Normalmente, a função `CURRENT_USER()` pode ser invocada para determinar qual é a conta para o usuário do cliente. Seu valor é construído a partir das colunas `User` e `Host` da linha da tabela `user` para a conta.

No entanto, há circunstâncias em que o valor `CURRENT_USER()` não corresponde ao usuário do cliente, mas a uma conta diferente. Isso ocorre em contextos em que a verificação de privilégios não é baseada na conta do cliente:

* Rotinas armazenadas (procedimentos e funções) definidas com a característica `SQL SECURITY DEFINER`

* Visões definidas com a característica `SQL SECURITY DEFINER`

* Gatilhos e eventos

Nesses contextos, o verificação de privilégios é feita contra a conta `DEFINER` e `CURRENT_USER()` se refere a essa conta, não à conta do cliente que invocou a rotina ou a visualização armazenada ou que causou o disparo a ser ativado. Para determinar o usuário que está invocando, você pode chamar a função `USER()`, que retorna um valor que indica o nome real do usuário fornecido pelo cliente e o host a partir do qual o cliente se conectou. No entanto, esse valor não corresponde necessariamente diretamente a uma conta na tabela `user`, porque o valor `USER()` nunca contém caracteres de mascaramento, enquanto os valores de conta (como retornados por `CURRENT_USER()`) podem conter caracteres de mascaramento de nome de usuário e nome de host.

Por exemplo, um nome de usuário em branco corresponde a qualquer usuário, portanto, uma conta de `''@'localhost'` permite que os clientes se conectem como um usuário anônimo do host local com qualquer nome de usuário. Neste caso, se um cliente se conecta como `user1` do host local, `USER()` e `CURRENT_USER()` retornam valores diferentes:

```sql
mysql> SELECT USER(), CURRENT_USER();
+-----------------+----------------+
| USER()          | CURRENT_USER() |
+-----------------+----------------+
| user1@localhost | @localhost     |
+-----------------+----------------+
```

A parte do nome de host de uma conta também pode conter caracteres de padrão `'%'` ou `'_'`. Se o nome de host contém um caractere de padrão `CURRENT_USER()` ou utiliza notação de máscara de rede, a conta pode ser usada para clientes que se conectam a partir de vários hosts e o valor `'user2'@'%.example.com'` não indica qual deles. Por exemplo, a conta `user2` pode ser usada por `example.com` para se conectar a partir de qualquer host no domínio `user2`. Se `remote.example.com` se conecta a partir de `USER()` e `CURRENT_USER()`, `USER()` e [[PH_ICD_12610]] retornam valores diferentes:

```sql
mysql> SELECT USER(), CURRENT_USER();
+--------------------------+---------------------+
| USER()                   | CURRENT_USER()      |
+--------------------------+---------------------+
| user2@remote.example.com | user2@%.example.com |
+--------------------------+---------------------+
```

Se um aplicativo precisar invocar `USER()` para auditoria de usuários (por exemplo, se estiver realizando auditoria a partir de triggers), mas também precisar associar o valor de `USER()` a uma conta na tabela `user`, é necessário evitar contas que contenham caracteres de comodinho na coluna `User` ou `Host`. Especificamente, não permitir que `User` esteja vazio (o que cria uma conta de usuário anônimo) e não permitir caracteres de padrão ou notação de máscara de rede nos valores de `Host`. Todas as contas devem ter um valor não vazio de `User` e um valor literal de `Host`.

Em relação aos exemplos anteriores, as contas `''@'localhost'` e `'user2'@'%.example.com'` devem ser alteradas para não utilizar caracteres de mascaramento:

```sql
RENAME USER ''@'localhost' TO 'user1'@'localhost';
RENAME USER 'user2'@'%.example.com' TO 'user2'@'remote.example.com';
```

Se o `user2` precisar se conectar a vários hosts no domínio `example.com`, deve haver uma conta separada para cada host.

Para extrair a parte do nome do usuário ou do nome do host de um valor `CURRENT_USER()` ou `USER()`, use a função `SUBSTRING_INDEX()`:

```sql
mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',1);
+---------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',1) |
+---------------------------------------+
| user1                                 |
+---------------------------------------+

mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',-1);
+----------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',-1) |
+----------------------------------------+
| localhost                              |
+----------------------------------------+
```
