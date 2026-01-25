### 2.11.3 Notas de Downgrade

Antes de fazer o downgrade a partir do MySQL 5.7, revise as informações nesta seção. Alguns itens podem exigir ações antes de realizar o downgrade.

* Alterações nas Tabelas de Sistema
* Alterações do InnoDB
* Alterações de Log
* Alterações de SQL

#### Alterações nas Tabelas de Sistema

* No MySQL 5.7.13, colunas de tabela de sistema que armazenam valores de string `user@host` tiveram seu comprimento aumentado. Antes de fazer o downgrade para uma versão anterior, garanta que não haja valores `user@host` que excedam o limite anterior de 77 caracteres e realize as seguintes alterações nas tabelas de sistema `mysql`:

  ```sql
  ALTER TABLE mysql.proc MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.event MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.tables_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.procs_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ```

* O comprimento máximo dos nomes de usuário MySQL foi aumentado de 16 caracteres para 32 caracteres no MySQL 5.7.8. Antes de fazer o downgrade para uma versão anterior, garanta que não haja nomes de usuário com mais de 16 caracteres e realize as seguintes alterações nas tabelas de sistema `mysql`:

  ```sql
  ALTER TABLE mysql.tables_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.columns_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.user MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.db MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.procs_priv MODIFY User char(16) binary DEFAULT '' NOT NULL;
  ```

* A coluna `Password` da tabela de sistema `mysql.user` foi removida no MySQL 5.7.6. Todas as credenciais são armazenadas na coluna `authentication_string`, incluindo aquelas anteriormente armazenadas na coluna `Password`. Para tornar a tabela `mysql.user` compatível com versões anteriores, realize as seguintes alterações antes de fazer o downgrade:

  ```sql
  ALTER TABLE mysql.user ADD Password char(41) character set latin1
    collate latin1_bin NOT NULL default '' AFTER user;
  UPDATE mysql.user SET password = authentication_string WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  UPDATE mysql.user SET authentication_string = '' WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  ```

* As tabelas de sistema `help_*` e `time_zone*` mudaram de `MyISAM` para `InnoDB` no MySQL 5.7.5. Antes de fazer o downgrade para uma versão anterior, altere cada tabela afetada de volta para `MyISAM` executando as seguintes instruções:

  ```sql
  ALTER TABLE mysql.help_category ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.help_keyword ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.help_relation ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.help_topic ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_leap_second ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_name ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_transition  ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_transition_type ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ```

* As tabelas de sistema `mysql.plugin` e `mysql.servers` mudaram de `MyISAM` para `InnoDB` no MySQL 5.7.6. Antes de fazer o downgrade para uma versão anterior, altere cada tabela afetada de volta para `MyISAM` executando as seguintes instruções:

  ```sql
  ALTER TABLE mysql.plugin ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.servers ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ```

* A definição da coluna `plugin` na tabela de sistema `mysql.user` difere no MySQL 5.7. Antes de fazer o downgrade para um servidor MySQL 5.6 para as versões 5.6.23 e superiores, altere a definição da coluna `plugin` usando esta instrução:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin
    DEFAULT 'mysql_native_password';
  ```

  Antes de fazer o downgrade para um servidor MySQL 5.6.22 ou mais antigo, altere a definição da coluna `plugin` usando esta instrução:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin DEFAULT '';
  ```

* A partir do MySQL 5.7.7, o schema `sys` é instalado por padrão durante a instalação do diretório de dados. Antes de fazer o downgrade para uma versão anterior, é recomendado que você descarte o schema `sys`:

  ```sql
  DROP DATABASE sys;
  ```

  Se você estiver fazendo o downgrade para uma versão que inclui o schema `sys`, o **mysql_upgrade** recria o schema `sys` em um formato compatível. O schema `sys` não está incluído no MySQL 5.6.

#### Alterações do InnoDB

* A partir do MySQL 5.7.5, o campo `FIL_PAGE_FLUSH_LSN`, escrito na primeira página de cada arquivo de tablespace de sistema `InnoDB` e nos arquivos de tablespace de undo `InnoDB`, é escrito apenas no primeiro arquivo do tablespace de sistema `InnoDB` (número de página 0:0). Como resultado, se você tiver um tablespace de sistema com múltiplos arquivos e decidir fazer o downgrade do MySQL 5.7 para o MySQL 5.6, você poderá encontrar uma mensagem inválida na inicialização do MySQL 5.6 indicando que os Log Sequence Numbers *`x`* e *`y`* nos arquivos ibdata não correspondem ao Log Sequence Number *`y`* nos arquivos ib_logfiles. Se você encontrar esta mensagem, reinicie o MySQL 5.6. A mensagem inválida não deverá mais aparecer.

* Para simplificar a descoberta de tablespace do `InnoDB` durante a recuperação de falhas (crash recovery), novos tipos de registro de redo log foram introduzidos no MySQL 5.7.5. Este aprimoramento altera o formato do redo log. Antes de realizar um Downgrade In-Place a partir do MySQL 5.7.5 ou posterior, realize um shutdown limpo utilizando uma configuração de `innodb_fast_shutdown` de `0` ou `1`. Um slow shutdown (desligamento lento) utilizando `innodb_fast_shutdown=0` é uma etapa recomendada no Downgrade In-Place.

* Os undo logs do MySQL 5.7.8 e 5.7.9 poderiam conter informações insuficientes sobre colunas espaciais (Bug #21508582). Antes de realizar um Downgrade In-Place do MySQL 5.7.10 ou superior para o MySQL 5.7.9 ou anterior, realize um slow shutdown utilizando `innodb_fast_shutdown=0` para limpar os undo logs. Um slow shutdown utilizando `innodb_fast_shutdown=0` é uma etapa recomendada no Downgrade In-Place.

* Os undo logs do MySQL 5.7.8 poderiam conter informações insuficientes sobre colunas virtuais e Index de colunas virtuais (Bug #21869656). Antes de realizar um Downgrade In-Place do MySQL 5.7.9 ou posterior para o MySQL 5.7.8 ou anterior, realize um slow shutdown utilizando `innodb_fast_shutdown=0` para limpar os undo logs. Um slow shutdown utilizando `innodb_fast_shutdown=0` é uma etapa recomendada no Downgrade In-Place.

* A partir do MySQL 5.7.9, o cabeçalho do redo log do primeiro arquivo de redo log (`ib_logfile0`) inclui um identificador da versão do formato e uma string de texto que identifica a versão do MySQL que criou os arquivos de redo log. Este aprimoramento altera o formato do redo log. Para evitar que versões mais antigas do MySQL iniciem em arquivos de redo log criados no MySQL 5.7.9 ou posterior, o checksum para páginas de checkpoint do redo log foi alterado. Como resultado, você deve realizar um slow shutdown do MySQL (utilizando `innodb_fast_shutdown=0`) e remover os arquivos de redo log (os arquivos `ib_logfile*`) antes de realizar um Downgrade In-Place. Um slow shutdown utilizando `innodb_fast_shutdown=0` e a remoção dos arquivos de redo log são etapas recomendadas no Downgrade In-Place.

* Uma nova versão de compressão usada pelo recurso de compressão de página do `InnoDB` foi adicionada no MySQL 5.7.32. A nova versão de compressão não é compatível com versões anteriores do MySQL. Criar uma tabela com compressão de página no MySQL 5.7.32 ou superior e acessar a tabela após o downgrade para uma versão anterior ao MySQL 5.7.32 causa uma falha. Como solução alternativa, descomprima essas tabelas antes de fazer o downgrade. Para descomprimir uma tabela, execute `ALTER TABLE tbl_name COMPRESSION='None'` e `OPTIMIZE TABLE`. Para obter informações sobre o recurso de compressão de página do `InnoDB`, consulte a Seção 14.9.2, “InnoDB Page Compression”.

#### Alterações de Log

* O suporte para enviar o log de erro do servidor para o `syslog` no MySQL 5.7.5 e superior difere das versões mais antigas. Se você usa `syslog` e faz o downgrade para uma versão anterior a 5.7.5, você deve parar de usar as variáveis de sistema **mysqld** relevantes e, em vez disso, usar as opções de comando **mysqld_safe** correspondentes. Suponha que você use `syslog` definindo estas variáveis de sistema no grupo `[mysqld]` de um arquivo de opções:

  ```sql
  [mysqld]
  log_syslog=ON
  log_syslog_tag=mytag
  ```

  Para fazer o downgrade, remova essas configurações e adicione configurações de opções no grupo de arquivo de opções `[mysqld_safe]`:

  ```sql
  [mysqld_safe]
  syslog
  syslog-tag=mytag
  ```

  Variáveis de sistema relacionadas ao `syslog` que não possuem uma opção **mysqld_safe** correspondente não podem ser usadas após um downgrade.

#### Alterações de SQL

* Um trigger pode ter triggers para diferentes combinações de evento de trigger (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`), mas antes do MySQL 5.7.2 não pode ter múltiplos triggers com o mesmo evento de trigger e tempo de ação. O MySQL 5.7.2 remove essa limitação e múltiplos triggers são permitidos. Essa mudança tem implicações para downgrades.

  Se você fizer o downgrade de um servidor que suporta múltiplos triggers para uma versão mais antiga que não suporta, o downgrade terá estes efeitos:

  + Para cada tabela que tem triggers, todas as definições de trigger permanecem no arquivo `.TRG` para a tabela. No entanto, se houver múltiplos triggers com o mesmo evento de trigger e tempo de ação, o servidor executa apenas um deles quando o evento de trigger ocorre. Para obter informações sobre arquivos `.TRG`, consulte Table Trigger Storage.

  + Se triggers para a tabela forem adicionados ou descartados subsequentemente ao downgrade, o servidor reescreve o arquivo `.TRG` da tabela. O arquivo reescrito retém apenas um trigger por combinação de evento de trigger e tempo de ação; os outros são perdidos.

  Para evitar esses problemas, modifique seus triggers antes de fazer o downgrade. Para cada tabela que tem múltiplos triggers por combinação de evento de trigger e tempo de ação, converta cada conjunto de triggers em um único trigger da seguinte forma:

  1. Para cada trigger, crie uma stored routine (rotina armazenada) que contenha todo o código do trigger. Valores acessados usando `NEW` e `OLD` podem ser passados para a rotina usando parâmetros. Se o trigger precisar de um único valor de resultado do código, você pode colocar o código em uma stored function (função armazenada) e fazer com que a função retorne o valor. Se o trigger precisar de múltiplos valores de resultado do código, você pode colocar o código em uma stored procedure (procedimento armazenado) e retornar os valores usando parâmetros `OUT`.

  2. Descarte todos os triggers para a tabela.
  3. Crie um novo trigger para a tabela que invoque as stored routines recém-criadas. O efeito para este trigger é, portanto, o mesmo que o dos múltiplos triggers que ele substitui.