### 2.10.3 Mudanças no MySQL 5.7

Antes de fazer o upgrade para o MySQL 5.7, revise as mudanças descritas nesta seção para identificar aquelas que se aplicam à sua instalação e aplicações atuais do MySQL. Execute quaisquer ações recomendadas.

As mudanças marcadas como **Mudança incompatível** são incompatibilidades com versões anteriores do MySQL e podem exigir sua atenção *antes do upgrade*. Nosso objetivo é evitar essas mudanças, mas ocasionalmente elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre releases. Se um problema de upgrade aplicável à sua instalação envolver uma incompatibilidade, siga as instruções fornecidas na descrição. Às vezes, isso envolve dump e recarregamento de tabelas, ou o uso de uma instrução como `CHECK TABLE` ou `REPAIR TABLE`.

Para instruções de dump e recarregamento, consulte a Seção 2.10.12, “Reconstrução ou Reparo de Tabelas ou Indexes”. Qualquer procedimento que envolva `REPAIR TABLE` com a opção `USE_FRM` *deve* ser feito antes do upgrade. O uso desta instrução com uma versão do MySQL diferente daquela usada para criar a tabela (ou seja, usá-la após o upgrade) pode danificar a tabela. Consulte a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

* Mudanças de Configuração
* Mudanças na Tabela de Sistema
* Mudanças no Servidor
* Mudanças no InnoDB
* Mudanças no SQL

#### Mudanças de Configuração

* **Mudança incompatível**: No MySQL 5.7.11, o valor padrão de `--early-plugin-load` é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que esse plugin seja carregado por padrão. No MySQL 5.7.12 e superior, o valor padrão de `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

  A encryption do tablespace `InnoDB` exige que o plugin keyring a ser usado seja carregado antes da inicialização do `InnoDB`, portanto, essa mudança no valor padrão de `--early-plugin-load` introduz uma incompatibilidade para upgrades da versão 5.7.11 para 5.7.12 ou superior. Os administradores que possuem tablespaces `InnoDB` criptografados devem tomar ações explícitas para garantir o carregamento contínuo do plugin keyring: Inicie o servidor com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para informações adicionais, consulte a Seção 6.4.4.1, “Instalação do Plugin Keyring”.

* **Mudança incompatível**: O `INFORMATION_SCHEMA` possui tabelas que contêm informações de variáveis de sistema e status (consulte a Seção 24.3.11, “As Tabelas INFORMATION_SCHEMA GLOBAL_VARIABLES e SESSION_VARIABLES”, e a Seção 24.3.10, “As Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS”). A partir do MySQL 5.7.6, o Performance Schema também contém tabelas de variáveis de sistema e status (consulte a Seção 25.12.13, “Tabelas de Variáveis de Sistema do Performance Schema”, e a Seção 25.12.14, “Tabelas de Variáveis de Status do Performance Schema”). As tabelas do Performance Schema destinam-se a substituir as tabelas do `INFORMATION_SCHEMA`, que estão descontinuadas (deprecated) a partir do MySQL 5.7.6 e foram removidas no MySQL 8.0.

  Para conselhos sobre a migração das tabelas do `INFORMATION_SCHEMA` para as tabelas do Performance Schema, consulte a Seção 25.20, “Migrando para as Tabelas de Variáveis de Status e Sistema do Performance Schema”. Para auxiliar na migração, você pode usar a variável de sistema `show_compatibility_56`, que afeta como as informações de variáveis de sistema e status são fornecidas pelas tabelas `INFORMATION_SCHEMA` e Performance Schema, e também pelas instruções `SHOW VARIABLES` e `SHOW STATUS`. `show_compatibility_56` está habilitada por padrão nas versões 5.7.6 e 5.7.7, e desabilitada por padrão no MySQL 5.7.8.

  Para detalhes sobre os efeitos de `show_compatibility_56`, consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”. Para melhor compreensão, é altamente recomendável que você leia também estas seções:

  + Seção 25.12.13, “Tabelas de Variáveis de Sistema do Performance Schema”
  + Seção 25.12.14, “Tabelas de Variáveis de Status do Performance Schema”
  + Seção 25.12.15.10, “Tabelas de Resumo de Variáveis de Status”
* **Mudança incompatível**: A partir do MySQL 5.7.6, a inicialização do diretório de dados cria apenas uma única conta `root`, `'root'@'localhost'`. (Consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.) Uma tentativa de conexão ao host `127.0.0.1` normalmente resolve para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que exista uma conta que possa aceitar uma Connection. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie estas contas:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

* **Mudança incompatível**: A partir do MySQL 5.7.6, para algumas plataformas Linux, quando o MySQL é instalado usando pacotes RPM e Debian, a inicialização e o desligamento do servidor agora são gerenciados usando systemd em vez de **mysqld_safe**, e o **mysqld_safe** não é instalado. Isso pode exigir algum ajuste na forma como você especifica as opções do servidor. Para obter detalhes, consulte a Seção 2.5.10, “Gerenciando o Servidor MySQL com systemd”.

* **Mudança incompatível**: No MySQL 5.7.5, a versão binária executável de **mysql_install_db** está localizada no diretório de instalação `bin`, enquanto a versão Perl estava localizada no diretório de instalação `scripts`. Para upgrades de uma versão mais antiga do MySQL, você pode encontrar uma versão em ambos os diretórios. Para evitar confusão, remova a versão no diretório `scripts`. Para novas instalações do MySQL 5.7.5 ou posterior, **mysql_install_db** é encontrado apenas no diretório `bin`, e o diretório `scripts` não está mais presente. As aplicações que esperam encontrar **mysql_install_db** no diretório `scripts` devem ser atualizadas para procurar no diretório `bin`.

  A localização de **mysql_install_db** torna-se menos relevante a partir do MySQL 5.7.6 porque, a partir dessa versão, ele está descontinuado em favor de **mysqld --initialize** (ou **mysqld --initialize-insecure**). Consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”

* **Mudança incompatível**: No MySQL 5.7.5, estas mudanças no SQL mode foram feitas:

  + O SQL mode estrito para storage engines transacionais (`STRICT_TRANS_TABLES`) agora está habilitado por padrão.

  + A implementação do SQL mode `ONLY_FULL_GROUP_BY` foi tornada mais sofisticada, para não mais rejeitar Queries determinísticas que eram rejeitadas anteriormente. Consequentemente, `ONLY_FULL_GROUP_BY` agora está habilitado por padrão, para proibir Queries não determinísticas contendo expressões não garantidas de serem determinadas exclusivamente dentro de um grupo.

  + As mudanças no SQL mode padrão resultam em um valor de variável de sistema `sql_mode` padrão com estes modes habilitados: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ENGINE_SUBSTITUTION`.

  + O mode `ONLY_FULL_GROUP_BY` agora também está incluído nos modes compreendidos pelo SQL mode `ANSI`.

  Se você descobrir que ter `ONLY_FULL_GROUP_BY` habilitado faz com que Queries para aplicações existentes sejam rejeitadas, qualquer uma destas ações deve restaurar a operação:

  + Se for possível modificar uma Query ofensiva, faça-o, seja para que as colunas não agregadas não determinísticas sejam funcionalmente dependentes das colunas `GROUP BY`, ou referenciando colunas não agregadas usando `ANY_VALUE()`.

  + Se não for possível modificar uma Query ofensiva (por exemplo, se for gerada por uma aplicação de terceiros), defina a variável de sistema `sql_mode` na inicialização do servidor para não habilitar `ONLY_FULL_GROUP_BY`.

  Para obter mais informações sobre SQL modes e Queries `GROUP BY`, consulte a Seção 5.1.10, “SQL Modes do Servidor”, e a Seção 12.19.3, “Manuseio de GROUP BY pelo MySQL”.

#### Mudanças na Tabela de Sistema

* **Mudança incompatível**: A coluna `Password` da tabela de sistema `mysql.user` foi removida no MySQL 5.7.6. Todas as credenciais são armazenadas na coluna `authentication_string`, incluindo aquelas anteriormente armazenadas na coluna `Password`. Se estiver realizando um in-place upgrade para MySQL 5.7.6 ou posterior, execute **mysql_upgrade** conforme as instruções do procedimento de in-place upgrade para migrar o conteúdo da coluna `Password` para a coluna `authentication_string`.

  Se estiver realizando um upgrade lógico usando um arquivo dump do **mysqldump** de uma instalação MySQL pré-5.7.6, você deve observar estas condições para o comando **mysqldump** usado para gerar o arquivo dump:

  + Você deve incluir a opção `--add-drop-table`

  + Você não deve incluir a opção `--flush-privileges`

  Conforme descrito no procedimento de upgrade lógico, carregue o arquivo dump pré-5.7.6 no servidor 5.7.6 (ou posterior) antes de executar **mysql_upgrade**.

#### Mudanças no Servidor

* **Mudança incompatível**: A partir do MySQL 5.7.5, o suporte para senhas que usam o formato mais antigo de password hashing pré-4.1 é removido, o que envolve as seguintes mudanças. As aplicações que usam qualquer recurso não mais suportado devem ser modificadas.

  + O plugin de autenticação `mysql_old_password` que usava valores hash de senha pré-4.1 é removido. As contas que usam este plugin são desabilitadas na inicialização e o servidor grava uma mensagem de “unknown plugin” (plugin desconhecido) no error log. Para instruções sobre como fazer upgrade de contas que usam este plugin, consulte a Seção 6.4.1.3, “Migrando de Hashing de Senha Pré-4.1 e o Plugin mysql_old_password”.

  + Para a variável de sistema `old_passwords`, um valor de 1 (produzir valores hash pré-4.1) não é mais permitido.

  + A opção `--secure-auth` para o servidor e programas cliente é o padrão, mas agora é um no-op. Ela está descontinuada (deprecated); espere que seja removida em um futuro release do MySQL.

  + A opção `--skip-secure-auth` para o servidor e programas cliente não é mais suportada e usá-la produz um erro.

  + A variável de sistema `secure_auth` permite apenas um valor de 1; um valor de 0 não é mais permitido.

  + A função `OLD_PASSWORD()` é removida.

* **Mudança incompatível**: No MySQL 5.6.6, o data type `YEAR(2)` de 2 dígitos foi descontinuado. No MySQL 5.7.5, o suporte para `YEAR(2)` é removido. Uma vez que você faça o upgrade para MySQL 5.7.5 ou superior, quaisquer colunas `YEAR(2)` de 2 dígitos restantes devem ser convertidas para colunas `YEAR` de 4 dígitos para se tornarem utilizáveis novamente. Para estratégias de conversão, consulte a Seção 11.2.5, “Limitações de YEAR(2) de 2 Dígitos e Migração para YEAR de 4 Dígitos”. A execução de **mysql_upgrade** após o upgrade é uma das possíveis estratégias de conversão.

* A partir do MySQL 5.7.7, `CHECK TABLE ... FOR UPGRADE` relata que uma tabela precisa de um rebuild se contiver colunas temporais antigas em formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de segundos fracionários) e a variável de sistema `avoid_temporal_upgrade` estiver desabilitada. Isso ajuda o **mysql_upgrade** a detectar e fazer o upgrade de tabelas contendo colunas temporais antigas. Se `avoid_temporal_upgrade` estiver habilitada, `FOR UPGRADE` ignora as colunas temporais antigas presentes na tabela; consequentemente, o **mysql_upgrade** não faz o upgrade delas.

  A partir do MySQL 5.7.7, `REPAIR TABLE` faz o upgrade de uma tabela se ela contiver colunas temporais antigas em formato pré-5.6.4 e a variável de sistema `avoid_temporal_upgrade` estiver desabilitada. Se `avoid_temporal_upgrade` estiver habilitada, `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não faz o upgrade delas.

  Para verificar tabelas que contêm tais colunas temporais e precisam de um rebuild, desabilite `avoid_temporal_upgrade` antes de executar `CHECK TABLE ... FOR UPGRADE`.

  Para fazer o upgrade de tabelas que contêm tais colunas temporais, desabilite `avoid_temporal_upgrade` antes de executar `REPAIR TABLE` ou **mysql_upgrade**.

* **Mudança incompatível**: A partir do MySQL 5.7.2, o servidor exige que as linhas de conta na tabela de sistema `mysql.user` tenham um valor de coluna `plugin` não vazio e desabilita contas com um valor vazio. Isso exige que você faça o upgrade de sua tabela `mysql.user` para preencher todos os valores `plugin`. A partir do MySQL 5.7.6, use este procedimento:

  Se você planeja fazer o upgrade usando o diretório de dados de sua instalação MySQL existente:

  1. Pare o servidor antigo (MySQL 5.6)
  2. Faça o upgrade dos binários do MySQL no local, substituindo os binários antigos pelos novos

  3. Inicie o servidor MySQL 5.7 normalmente (sem opções especiais)
  4. Execute **mysql_upgrade** para fazer o upgrade das tabelas de sistema

  5. Reinicie o servidor MySQL 5.7

  Se você planeja fazer o upgrade recarregando um arquivo dump gerado a partir de sua instalação MySQL existente:

  1. Para gerar o arquivo dump, execute **mysqldump** com a opção `--add-drop-table` e sem a opção `--flush-privileges`

  2. Pare o servidor antigo (MySQL 5.6)
  3. Faça o upgrade dos binários do MySQL no local (substitua os binários antigos pelos novos)

  4. Inicie o servidor MySQL 5.7 normalmente (sem opções especiais)
  5. Recarregue o arquivo dump (**mysql < *`dump_file`***)

  6. Execute **mysql_upgrade** para fazer o upgrade das tabelas de sistema

  7. Reinicie o servidor MySQL 5.7

  Antes do MySQL 5.7.6, o procedimento é mais envolvido:

  Se você planeja fazer o upgrade usando o diretório de dados de sua instalação MySQL existente:

  1. Pare o servidor antigo (MySQL 5.6)
  2. Faça o upgrade dos binários do MySQL no local (substitua os binários antigos pelos novos)

  3. Reinicie o servidor com a opção `--skip-grant-tables` para desabilitar a verificação de privilégios

  4. Execute **mysql_upgrade** para fazer o upgrade das tabelas de sistema

  5. Reinicie o servidor normalmente (sem `--skip-grant-tables`)

  Se você planeja fazer o upgrade recarregando um arquivo dump gerado a partir de sua instalação MySQL existente:

  1. Para gerar o arquivo dump, execute **mysqldump** sem a opção `--flush-privileges`

  2. Pare o servidor antigo (MySQL 5.6)
  3. Faça o upgrade dos binários do MySQL no local (substitua os binários antigos pelos novos)

  4. Reinicie o servidor com a opção `--skip-grant-tables` para desabilitar a verificação de privilégios

  5. Recarregue o arquivo dump (**mysql < *`dump_file`***)

  6. Execute **mysql_upgrade** para fazer o upgrade das tabelas de sistema

  7. Reinicie o servidor normalmente (sem `--skip-grant-tables`)

  O **mysql_upgrade** é executado por padrão como o usuário `root` do MySQL. Para os procedimentos anteriores, se a senha do `root` estiver expirada quando você executar **mysql_upgrade**, ele exibirá uma mensagem informando que sua senha expirou e que o **mysql_upgrade** falhou como resultado. Para corrigir isso, redefina a senha do `root` e execute **mysql_upgrade** novamente:

  ```sql
  $> mysql -u root -p
  Enter password: ****  <- enter root password here
  mysql> ALTER USER USER() IDENTIFIED BY 'root-password'; # MySQL 5.7.6 and up
  mysql> SET PASSWORD = PASSWORD('root-password');        # Before MySQL 5.7.6
  mysql> quit

  $> mysql_upgrade -p
  Enter password: ****  <- enter root password here
  ```

  A instrução de redefinição de senha normalmente não funciona se o servidor for iniciado com `--skip-grant-tables`, mas a primeira invocação de **mysql_upgrade** faz um flush dos privilégios, então quando você executa **mysql**, a instrução é aceita.

  Se o próprio **mysql_upgrade** expirar a senha do `root`, você deve redefinir a senha novamente da mesma maneira.

  Após seguir as instruções anteriores, é aconselhável que os DBAs também convertam as contas que usam o plugin de autenticação `mysql_old_password` para usar `mysql_native_password`, pois o suporte para `mysql_old_password` foi removido. Para instruções de upgrade de conta, consulte a Seção 6.4.1.3, “Migrando de Hashing de Senha Pré-4.1 e o Plugin mysql_old_password”.

* **Mudança incompatível**: É possível que um valor `DEFAULT` de coluna seja válido para o valor `sql_mode` no momento da criação da tabela, mas inválido para o valor `sql_mode` quando as linhas são inseridas ou atualizadas. Exemplo:

  ```sql
  SET sql_mode = '';
  CREATE TABLE t (d DATE DEFAULT 0);
  SET sql_mode = 'NO_ZERO_DATE,STRICT_ALL_TABLES';
  INSERT INTO t (d) VALUES(DEFAULT);
  ```

  Neste caso, 0 deve ser aceito para o `CREATE TABLE`, mas rejeitado para o `INSERT`. No entanto, anteriormente o servidor não avaliava os valores `DEFAULT` usados para inserções ou atualizações em relação ao `sql_mode` atual. No exemplo, o `INSERT` é bem-sucedido e insere `'0000-00-00'` na coluna `DATE`.

  A partir do MySQL 5.7.2, o servidor aplica as verificações `sql_mode` adequadas para gerar um Warning ou Error no momento da inserção ou atualização.

  Uma incompatibilidade resultante para replicação, se você usar logging baseado em instrução (`binlog_format=STATEMENT`), é que se uma replica for atualizada, uma source que não foi atualizada executa o exemplo anterior sem erro, enquanto o `INSERT` falha na replica e a replicação para.

  Para lidar com isso, pare todas as novas instruções na source e espere até que as replicas se atualizem. Em seguida, faça o upgrade das replicas seguido pela source. Alternativamente, se você não puder parar novas instruções, mude temporariamente para logging baseado em linha na source (`binlog_format=ROW`) e espere até que todas as replicas tenham processado todos os binary logs produzidos até o ponto desta mudança. Em seguida, faça o upgrade das replicas seguido pela source e mude a source de volta para logging baseado em instrução.

* **Mudança incompatível**: Várias mudanças foram feitas no audit log plugin para melhor compatibilidade com o Oracle Audit Vault. Para fins de upgrade, o principal problema é que o formato padrão do arquivo de audit log mudou: As informações dentro dos elementos `<AUDIT_RECORD>` que eram escritas anteriormente usando atributos agora são escritas usando subelementos.

  Exemplo do formato antigo de `<AUDIT_RECORD>`:

  ```sql
  <AUDIT_RECORD
   TIMESTAMP="2013-04-15T15:27:27"
   NAME="Query"
   CONNECTION_ID="3"
   STATUS="0"
   SQLTEXT="SELECT 1"
  />
  ```

  Exemplo do novo formato:

  ```sql
  <AUDIT_RECORD>
   <TIMESTAMP>2013-04-15T15:27:27 UTC</TIMESTAMP>
   <RECORD_ID>3998_2013-04-15T15:27:27</RECORD_ID>
   <NAME>Query</NAME>
   <CONNECTION_ID>3</CONNECTION_ID>
   <STATUS>0</STATUS>
   <STATUS_CODE>0</STATUS_CODE>
   <USER>root[root] @ localhost [127.0.0.1]</USER>
   <OS_LOGIN></OS_LOGIN>
   <HOST>localhost</HOST>
   <IP>127.0.0.1</IP>
   <COMMAND_CLASS>select</COMMAND_CLASS>
   <SQLTEXT>SELECT 1</SQLTEXT>
  </AUDIT_RECORD>
  ```

  Se você usou anteriormente uma versão mais antiga do audit log plugin, use este procedimento para evitar escrever entradas de log de novo formato em um arquivo de log existente que contém entradas de formato antigo:

  1. Pare o servidor.
  2. Renomeie o arquivo de audit log atual manualmente. Este arquivo contém entradas de log usando apenas o formato antigo.

  3. Atualize o servidor e reinicie-o. O audit log plugin cria um novo arquivo de log, que contém entradas de log usando apenas o novo formato.

  Para obter informações sobre o audit log plugin, consulte a Seção 6.4.5, “MySQL Enterprise Audit”.

* A partir do MySQL 5.7.7, o connection timeout padrão para uma replica foi alterado de 3600 segundos (uma hora) para 60 segundos (um minuto). O novo padrão é aplicado quando uma replica sem uma configuração para a variável de sistema `slave_net_timeout` é atualizada para MySQL 5.7. A configuração padrão para o heartbeat interval, que regula o sinal heartbeat para impedir que o connection timeout ocorra na ausência de dados se a Connection ainda estiver boa, é calculado como metade do valor de `slave_net_timeout`. O heartbeat interval é registrado no source info log da replica (a tabela `mysql.slave_master_info` ou arquivo `master.info`), e não é alterado automaticamente quando o valor ou a configuração padrão de `slave_net_timeout` é alterado. Uma replica MySQL 5.6 que usou o connection timeout e o heartbeat interval padrão e foi então atualizada para MySQL 5.7, portanto, tem um heartbeat interval que é muito mais longo do que o connection timeout.

  Se o nível de atividade na source for tal que as atualizações para o binary log são enviadas para a replica pelo menos uma vez a cada 60 segundos, esta situação não é um problema. No entanto, se nenhum dado for recebido da source, porque o heartbeat não está sendo enviado, o connection timeout expira. A replica, portanto, pensa que a Connection com a source foi perdida e faz múltiplas tentativas de reconexão (conforme controlado pelas configurações `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT`, que também podem ser vistas no source info log). As tentativas de reconexão geram inúmeras dump threads zumbis que a source deve eliminar, fazendo com que o error log na source contenha múltiplos Errors na forma While initializing dump thread for slave with UUID *`uuid`*, found a zombie dump thread with the same UUID. Master is killing the zombie dump thread *`threadid`*. Para evitar esse problema, imediatamente antes de fazer o upgrade de uma replica para MySQL 5.7, verifique se a variável de sistema `slave_net_timeout` está usando a configuração padrão. Em caso afirmativo, emita `CHANGE MASTER TO` com a opção `MASTER_HEARTBEAT_PERIOD` e defina o heartbeat interval para 30 segundos, para que funcione com o novo connection timeout de 60 segundos que se aplica após o upgrade.

* **Mudança incompatível**: O MySQL 5.6.22 e posterior reconhecia o privilégio `REFERENCES`, mas não o impunha totalmente; um usuário com pelo menos um de `SELECT`, `INSERT`, `UPDATE`, `DELETE` ou `REFERENCES` poderia criar uma foreign key constraint em uma tabela. O MySQL 5.7 (e posterior) exige que o usuário tenha o privilégio `REFERENCES` para fazer isso. Isso significa que, se você migrar usuários de um servidor MySQL 5.6 (qualquer versão) para um que execute o MySQL 5.7, você deve garantir que conceda este privilégio explicitamente a quaisquer usuários que precisem ser capazes de criar foreign keys. Isso inclui a conta de usuário empregada para importar dumps contendo tabelas com foreign keys.

#### Mudanças no InnoDB

* A partir do MySQL 5.7.24, a versão da biblioteca zlib incluída no MySQL foi elevada da versão 1.2.3 para a versão 1.2.11.

  A função `compressBound()` do zlib na versão 1.2.11 do zlib retorna uma estimativa ligeiramente superior do tamanho do Buffer necessário para comprimir um determinado comprimento de bytes do que retornava na versão 1.2.3 do zlib. A função `compressBound()` é chamada pelas funções do `InnoDB` que determinam o tamanho máximo da linha permitido ao criar tabelas `InnoDB` comprimidas ou inserir linhas em tabelas `InnoDB` comprimidas. Como resultado, as operações `CREATE TABLE ... ROW_FORMAT=COMPRESSED` ou `INSERT` com tamanhos de linha muito próximos ao tamanho máximo da linha que foram bem-sucedidas em releases anteriores podem agora falhar.

  Se você tiver tabelas `InnoDB` comprimidas com linhas grandes, é recomendável que você teste as instruções `CREATE TABLE` de tabelas comprimidas em uma instância de teste do MySQL 5.7 antes de fazer o upgrade.

* **Mudança incompatível**: Para simplificar a tablespace discovery do `InnoDB` durante o crash recovery, novos tipos de redo log record foram introduzidos no MySQL 5.7.5. Este aprimoramento altera o formato do redo log. Antes de realizar um in-place upgrade, execute um clean shutdown usando uma configuração `innodb_fast_shutdown` de `0` ou `1`. Um slow shutdown usando `innodb_fast_shutdown=0` é uma etapa recomendada no In-Place Upgrade.

* **Mudança incompatível**: Os undo logs do MySQL 5.7.8 e 5.7.9 podem conter informações insuficientes sobre spatial columns, o que pode resultar em uma falha de upgrade (Bug #21508582). Antes de realizar um in-place upgrade do MySQL 5.7.8 ou 5.7.9 para 5.7.10 ou superior, execute um slow shutdown usando `innodb_fast_shutdown=0` para limpar os undo logs. Um slow shutdown usando `innodb_fast_shutdown=0` é uma etapa recomendada no In-Place Upgrade.

* **Mudança incompatível**: Os undo logs do MySQL 5.7.8 podem conter informações insuficientes sobre virtual columns e virtual column indexes, o que pode resultar em uma falha de upgrade (Bug #21869656). Antes de realizar um in-place upgrade do MySQL 5.7.8 para MySQL 5.7.9 ou superior, execute um slow shutdown usando `innodb_fast_shutdown=0` para limpar os undo logs. Um slow shutdown usando `innodb_fast_shutdown=0` é uma etapa recomendada no In-Place Upgrade.

* **Mudança incompatível**: A partir do MySQL 5.7.9, o redo log header do primeiro arquivo de redo log (`ib_logfile0`) inclui um format version identifier e uma string de texto que identifica a versão do MySQL que criou os arquivos de redo log. Este aprimoramento altera o formato do redo log, exigindo que o MySQL seja desligado de forma limpa usando uma configuração `innodb_fast_shutdown` de `0` ou `1` antes de realizar um in-place upgrade para MySQL 5.7.9 ou superior. Um slow shutdown usando `innodb_fast_shutdown=0` é uma etapa recomendada no In-Place Upgrade.

* No MySQL 5.7.9, `DYNAMIC` substitui `COMPACT` como o row format padrão implícito para tabelas `InnoDB`. Uma nova opção de configuração, `innodb_default_row_format`, especifica o row format padrão do `InnoDB`. Os valores permitidos incluem `DYNAMIC` (o padrão), `COMPACT` e `REDUNDANT`.

  Após o upgrade para 5.7.9, quaisquer novas tabelas que você criar usam o row format definido por `innodb_default_row_format`, a menos que você defina explicitamente um row format (`ROW_FORMAT`).

  Para tabelas existentes que não definem explicitamente uma opção `ROW_FORMAT` ou que usam `ROW_FORMAT=DEFAULT`, qualquer operação que reconstrua uma tabela também altera silenciosamente o row format da tabela para o formato definido por `innodb_default_row_format`. Caso contrário, as tabelas existentes mantêm sua configuração de row format atual. Para obter mais informações, consulte Definindo o Row Format de uma Tabela.

* A partir do MySQL 5.7.6, o storage engine `InnoDB` usa seu próprio manipulador de particionamento (partitioning handler) integrado (“nativo”) para quaisquer novas tabelas particionadas criadas usando `InnoDB`. As tabelas `InnoDB` particionadas criadas em versões anteriores do MySQL não são atualizadas automaticamente. Você pode facilmente fazer o upgrade de tais tabelas para usar o native partitioning do `InnoDB` no MySQL 5.7.9 ou posterior usando qualquer um dos seguintes métodos:

  + Para fazer o upgrade de uma tabela individual do generic partitioning handler para o native partitioning do *`InnoDB`*, execute a instrução `ALTER TABLE table_name UPGRADE PARTITIONING`.

  + Para fazer o upgrade de todas as tabelas `InnoDB` que usam o generic partitioning handler para usar o native partitioning handler, execute **mysql_upgrade**.

#### Mudanças no SQL

* **Mudança incompatível**: A função `GET_LOCK()` foi reimplementada no MySQL 5.7.5 usando o subsistema metadata locking (MDL) e suas capacidades foram estendidas:

  + Anteriormente, `GET_LOCK()` permitia a aquisição de apenas um Lock nomeado por vez, e uma segunda chamada `GET_LOCK()` liberava qualquer Lock existente. Agora, `GET_LOCK()` permite a aquisição de mais de um Lock nomeado simultâneo e não libera Locks existentes.

    As aplicações que dependem do comportamento do `GET_LOCK()` de liberar qualquer Lock anterior devem ser modificadas para o novo comportamento.

  + A capacidade de adquirir múltiplos Locks introduz a possibilidade de deadlock entre clientes. O subsistema MDL detecta deadlock e retorna um Error `ER_USER_LOCK_DEADLOCK` quando isso ocorre.

  + O subsistema MDL impõe um limite de 64 caracteres nos lock names, então este limite agora também se aplica aos Locks nomeados. Anteriormente, nenhum limite de comprimento era imposto.

  + Os Locks adquiridos com `GET_LOCK()` agora aparecem na tabela `metadata_locks` do Performance Schema. A coluna `OBJECT_TYPE` diz `USER LEVEL LOCK` e a coluna `OBJECT_NAME` indica o lock name.

  + Uma nova função, `RELEASE_ALL_LOCKS()`, permite a liberação de todos os Locks nomeados adquiridos de uma só vez.

  Para obter mais informações, consulte a Seção 12.14, “Funções de Locking”.

* O optimizer agora manipula derived tables e views na cláusula `FROM` de forma consistente para melhor evitar materialization desnecessária e para permitir o uso de pushed-down conditions que produzem planos de execução mais eficientes.

  No entanto, no MySQL 5.7, antes do MySQL 5.7.11, e para instruções como `DELETE` ou `UPDATE` que modificam tabelas, usar a estratégia de merge para uma derived table que anteriormente foi materializada pode resultar em um Error `ER_UPDATE_TABLE_USED`:

  ```sql
  mysql> DELETE FROM t1
      -> WHERE id IN (SELECT id
      ->              FROM (SELECT t1.id
      ->                    FROM t1 INNER JOIN t2 USING (id)
      ->                    WHERE t2.status = 0) AS t);
  ERROR 1093 (HY000): You can't specify target table 't1'
  for update in FROM clause
  ```

  O Error ocorre quando o merge de uma derived table no bloco de Query externo resulta em uma instrução que seleciona e modifica uma tabela simultaneamente. (A materialization não causa o problema porque, na prática, ela converte a derived table em uma tabela separada.) A solução alternativa para evitar esse Error era desabilitar o flag `derived_merge` da variável de sistema `optimizer_switch` antes de executar a instrução:

  ```sql
  SET optimizer_switch = 'derived_merge=off';
  ```

  O flag `derived_merge` controla se o optimizer tenta fazer o merge de subqueries e views na cláusula `FROM` no bloco de Query externo, assumindo que nenhuma outra regra impeça o merge. Por padrão, o flag é `on` para habilitar o merge. Definir o flag como `off` evita o merge e o Error que acabamos de descrever. Para obter mais informações, consulte a Seção 8.2.2.4, “Otimizando Derived Tables e Referências de View com Merging ou Materialization”.

* Algumas Keywords podem estar reservadas no MySQL 5.7 que não estavam reservadas no MySQL 5.6. Consulte a Seção 9.3, “Keywords e Reserved Words”. Isso pode fazer com que palavras anteriormente usadas como identifiers se tornem ilegais. Para corrigir instruções afetadas, use identifier quoting. Consulte a Seção 9.2, “Nomes de Schema Object”.

* Após o upgrade, é recomendável que você teste os optimizer hints especificados no código da aplicação para garantir que os hints ainda sejam necessários para atingir a estratégia de optimization desejada. Os aprimoramentos do optimizer podem, às vezes, tornar certos optimizer hints desnecessários. Em alguns casos, um optimizer hint desnecessário pode até ser contraproducente.

* Em instruções `UNION`, para aplicar `ORDER BY` ou `LIMIT` a um `SELECT` individual, coloque a cláusula dentro dos parênteses que envolvem o `SELECT`:

  ```sql
  (SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
  UNION
  (SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
  ```

  Versões anteriores do MySQL podem permitir tais instruções sem parênteses. No MySQL 5.7, o requisito de parênteses é imposto.