### 2.11.3 Notas de Downgrade

Antes de fazer a atualização para uma versão anterior do MySQL 5.7, revise as informações nesta seção. Alguns itens podem exigir ação antes da atualização.

- Alterações na tabela do sistema
- Alterações no InnoDB
- Registro de alterações
- Alterações no SQL

#### Alterações na tabela do sistema

- No MySQL 5.7.13, as colunas das tabelas do sistema que armazenam valores de cadeias de caracteres user\@host foram aumentadas em comprimento. Antes de fazer uma atualização para uma versão anterior, certifique-se de que não haja valores de user\@host que excedam o limite anterior de 77 caracteres e realize as seguintes alterações na tabela do sistema `mysql`:

  ```sql
  ALTER TABLE mysql.proc MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.event MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.tables_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.procs_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ```

- O comprimento máximo dos nomes de usuário do MySQL foi aumentado de 16 caracteres para 32 caracteres no MySQL 5.7.8. Antes de fazer a atualização para uma versão anterior, certifique-se de que não há nomes de usuário maiores que 16 caracteres e realize as seguintes alterações na tabela de sistema `mysql`:

  ```sql
  ALTER TABLE mysql.tables_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.columns_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.user MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.db MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.procs_priv MODIFY User char(16) binary DEFAULT '' NOT NULL;
  ```

- A coluna `Password` da tabela `mysql.user` do sistema foi removida no MySQL 5.7.6. Todas as credenciais são armazenadas na coluna `authentication_string`, incluindo aquelas que antes estavam armazenadas na coluna `Password`. Para tornar a tabela `mysql.user` compatível com versões anteriores, realize as seguintes alterações antes de fazer o downgrade:

  ```sql
  ALTER TABLE mysql.user ADD Password char(41) character set latin1
    collate latin1_bin NOT NULL default '' AFTER user;
  UPDATE mysql.user SET password = authentication_string WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  UPDATE mysql.user SET authentication_string = '' WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  ```

- As tabelas de sistema `help_*` e `time_zone*` foram alteradas de `MyISAM` para `InnoDB` no MySQL 5.7.5. Antes de fazer uma atualização para uma versão anterior, altere cada tabela afetada de volta para `MyISAM` executando as seguintes instruções:

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

- As tabelas `mysql.plugin` e `mysql.servers` do sistema mudaram de `MyISAM` para `InnoDB` no MySQL 5.7.6. Antes de fazer uma atualização para uma versão anterior, altere cada tabela afetada de volta para `MyISAM` executando as seguintes instruções:

  ```sql
  ALTER TABLE mysql.plugin ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.servers ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ```

- A definição da coluna `plugin` na tabela `mysql.user` do sistema difere no MySQL 5.7. Antes de fazer a atualização para um servidor MySQL 5.6 para versões 5.6.23 e superiores, altere a definição da coluna `plugin` usando esta instrução:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin
    DEFAULT 'mysql_native_password';
  ```

  Antes de fazer a atualização para um servidor MySQL 5.6.22 ou para uma versão anterior, altere a definição da coluna `plugin` usando esta instrução:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin DEFAULT '';
  ```

- A partir do MySQL 5.7.7, o esquema `sys` é instalado por padrão durante a instalação do diretório de dados. Antes de fazer uma atualização para uma versão anterior, recomenda-se que você exclua o esquema `sys`:

  ```sql
  DROP DATABASE sys;
  ```

  Se você estiver fazendo uma atualização para uma versão que inclui o esquema `sys`, o **mysql_upgrade** recria o esquema `sys` em uma forma compatível. O esquema `sys` não está incluído no MySQL 5.6.

#### Alterações no InnoDB

- A partir do MySQL 5.7.5, o campo `FIL_PAGE_FLUSH_LSN`, escrito na primeira página de cada arquivo de espaço de tabela do sistema `InnoDB` e nos arquivos de espaço de tabela de desfazer `InnoDB`, é escrito apenas no primeiro arquivo do espaço de tabela de sistema `InnoDB` (número de página 0:0). Como resultado, se você tiver um espaço de tabela de sistema de vários arquivos e decidir fazer uma atualização para o MySQL 5.6, você pode encontrar uma mensagem inválida na inicialização do MySQL 5.6, afirmando que os números de sequência de log *`x`* e *`y`* nos arquivos ibdata não correspondem ao número de sequência de log *`y`* nos ib_logfiles. Se você encontrar essa mensagem, reinicie o MySQL 5.6. A mensagem inválida não deve aparecer mais.

- Para simplificar a descoberta do espaço de tabela `InnoDB` durante a recuperação após falhas, novos tipos de registro de log de redo foram introduzidos no MySQL 5.7.5. Essa melhoria altera o formato do log de redo. Antes de realizar uma desativação local a partir do MySQL 5.7.5 ou posterior, execute um desligamento limpo usando uma configuração `innodb_fast_shutdown` de `0` ou `1`. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada no Desativação Local.

- Os registros de desfazer dos MySQL 5.7.8 e 5.7.9 podem conter informações insuficientes sobre as colunas espaciais (Bug `#21508582`). Antes de realizar uma desativação local do MySQL 5.7.10 ou superior para o MySQL 5.7.9 ou versões anteriores, execute um desligamento lento usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada no Desativação Local.

- Os registros de desfazer do MySQL 5.7.8 podem conter informações insuficientes sobre colunas virtuais e índices de colunas virtuais (Bug #21869656). Antes de realizar uma desativação local do MySQL 5.7.9 ou posterior para o MySQL 5.7.8 ou anterior, execute um desligamento lento usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Desativação Local.

- A partir do MySQL 5.7.9, o cabeçalho do log de refazer do primeiro arquivo de log de refazer (`ib_logfile0`) inclui um identificador de versão do formato e uma string de texto que identifica a versão do MySQL que criou os arquivos de log de refazer. Essa melhoria altera o formato do log de refazer. Para evitar que versões mais antigas do MySQL iniciem em arquivos de log de refazer criados no MySQL 5.7.9 ou posterior, o checksum (cópia de segurança) das páginas de verificação de ponto de controle do log de refazer foi alterado. Como resultado, você deve realizar um desligamento lento do MySQL (usando `innodb_fast_shutdown=0`) e remover os arquivos de log de refazer (os arquivos `ib_logfile*`) antes de realizar uma desativação local. Um desligamento lento usando `innodb_fast_shutdown=0` e a remoção dos arquivos de log de refazer são etapas recomendadas na Desativação Local.

- Uma nova versão de compressão usada pelo recurso de compressão de páginas do `InnoDB` foi adicionada no MySQL 5.7.32. A nova versão de compressão não é compatível com versões anteriores do MySQL. Criar uma tabela compactada em MySQL 5.7.32 ou superior e acessar a tabela após a atualização para uma versão anterior ao MySQL 5.7.32 causa um erro. Como solução alternativa, descomprima essas tabelas antes da atualização. Para descomprimir uma tabela, execute `ALTER TABLE tbl_name COMPRESSION='None'` e `OPTIMIZE TABLE`. Para obter informações sobre o recurso de compressão de páginas do `InnoDB`, consulte a Seção 14.9.2, “Compressão de Páginas do InnoDB”.

#### Registro de alterações

- O suporte para enviar o log de erros do servidor para o `syslog` no MySQL 5.7.5 e versões posteriores difere das versões mais antigas. Se você usar `syslog` e fazer uma atualização para uma versão mais antiga que 5.7.5, você deve parar de usar as variáveis de sistema **mysqld** relevantes e usar as opções de comando **mysqld_safe** correspondentes. Suponha que você use `syslog` configurando essas variáveis de sistema no grupo `[mysqld]` de um arquivo de opções:

  ```
  [mysqld]
  log_syslog=ON
  log_syslog_tag=mytag
  ```

  Para fazer o downgrade, remova essas configurações e adicione configurações de opções no grupo de opções `[mysqld_safe]`:

  ```
  [mysqld_safe]
  syslog
  syslog-tag=mytag
  ```

  As variáveis de sistema relacionadas ao `syslog` que não têm a opção correspondente ao **mysqld_safe** não podem ser usadas após uma redução de versão.

#### Alterações no SQL

- Um gatilho pode ter gatilhos para diferentes combinações de evento de gatilho (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`), mas antes do MySQL 5.7.2 não pode ter múltiplos gatilhos que tenham o mesmo evento de gatilho e tempo de ação. O MySQL 5.7.2 elimina essa limitação e múltiplos gatilhos são permitidos. Essa mudança tem implicações para as despromoções.

  Se você desatualizar um servidor que suporta múltiplos gatilhos para uma versão mais antiga que não o faz, o processo de desatualização terá esses efeitos:

  - Para cada tabela que possui gatilhos, todas as definições de gatilho permanecem no arquivo `.TRG` da tabela. No entanto, se houver vários gatilhos com o mesmo evento de gatilho e hora de ação, o servidor executa apenas um deles quando o evento de gatilho ocorre. Para obter informações sobre arquivos `.TRG`, consulte Armazenamento de gatilhos de tabela.

  - Se os gatilhos da tabela forem adicionados ou removidos após a redução, o servidor reescreve o arquivo `.TRG` da tabela. O arquivo reescrito retém apenas um gatilho por combinação de evento do gatilho e hora da ação; os outros são perdidos.

  Para evitar esses problemas, modifique seus gatilhos antes de fazer a atualização para uma versão anterior. Para cada tabela que tenha múltiplos gatilhos por combinação de evento do gatilho e hora da ação, converta cada conjunto desses gatilhos em um único gatilho da seguinte forma:

  1. Para cada gatilho, crie uma rotina armazenada que contenha todo o código do gatilho. Os valores acessados usando `NEW` e `OLD` podem ser passados para a rotina usando parâmetros. Se o gatilho precisar de um único valor de resultado do código, você pode colocar o código em uma função armazenada e fazer com que a função retorne o valor. Se o gatilho precisar de múltiplos valores de resultado do código, você pode colocar o código em um procedimento armazenado e retornar os valores usando parâmetros `OUT`.

  2. Desmarque todos os gatilhos da tabela.

  3. Crie um novo gatilho para a tabela que invoca as rotinas armazenadas que foram criadas. O efeito deste gatilho é, portanto, o mesmo que os múltiplos gatilhos que ele substitui.
