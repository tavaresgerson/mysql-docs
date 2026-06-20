## 2.11 Desatualizando o MySQL

Esta seção descreve os passos para fazer uma desativação de uma instalação do MySQL.

A desativação é uma operação menos comum do que a ativação. A desativação é normalmente realizada devido a um problema de compatibilidade ou de desempenho que ocorre em um sistema de produção e que não foi descoberto durante a verificação inicial de ativação nos sistemas de teste. Assim como o procedimento de ativação descrito na Seção 2.10, “Ativação do MySQL”, realize e verifique o procedimento de desativação em alguns sistemas de teste antes de usá-lo em um sistema de produção.

Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta do MySQL com privilégios administrativos incluem `-u root` na string de comando para especificar o usuário do MySQL `root`. Os comandos que exigem uma senha para `root` também incluem uma opção `-p`. Como `-p` é seguido por nenhum valor de opção, tais comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de string de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).

### 2.11.1 Antes de começar

Revise as informações nesta seção antes de fazer a atualização para uma versão anterior. Realize as ações recomendadas.

* Proteja seus dados fazendo um backup. O backup deve incluir o banco de dados `mysql`, que contém as tabelas do sistema MySQL. Veja a Seção 7.2, “Métodos de backup de banco de dados”.

* Revise a Seção 2.11.2, “Caminhos de Downgrade”, para garantir que o caminho de downgrade pretendido seja suportado.

* Revise a Seção 2.11.3, “Notas de Downgrade”, para itens que podem exigir ação antes do downgrade.

Nota

Os procedimentos de downgrade descritos nas seções a seguir pressupõem que você está fazendo o downgrade com arquivos de dados criados ou modificados pela versão mais recente do MySQL. No entanto, se você não modificou seus dados após a atualização, é recomendado fazer o downgrade usando backups feitos *antes* da atualização para a nova versão do MySQL. Muitas das alterações descritas na Seção 2.11.3, "Notas de Downgrade", que exigem ação, não são aplicáveis ao fazer o downgrade usando backups feitos *antes* da atualização para a nova versão do MySQL.

* O uso de novos recursos, novas opções de configuração ou novos valores de opção de configuração que não são suportados por uma versão anterior pode causar erros ou falhas de downgrade. Antes de fazer o downgrade, requeira as alterações resultantes do uso de novos recursos e remova as configurações que não são suportadas pela versão para a qual está fazendo o downgrade.

### 2.11.2 Caminhos de Downgrade

* A desativação é apenas suportada entre as versões de Disponibilidade Geral (GA).

* A desativação do MySQL 5.7 para 5.6 é suportada usando o método de *desativação lógica*.

* A desativação de versões que são ignoradas não é suportada. Por exemplo, a desativação direta de MySQL 5.7 para 5.5 não é suportada.

* O downgrade dentro de uma série de lançamento é suportado. Por exemplo, o downgrade de MySQL 5.7.*`z`* para 5.7.*`y`* é suportado. O pular uma versão também é suportado. Por exemplo, o downgrade de MySQL 5.7.*`z`* para 5.7.*`x`* é suportado.

### 2.11.3 Notas de Downgrade

Antes de fazer uma atualização para uma versão mais antiga do MySQL 5.7, revise as informações nesta seção. Alguns itens podem exigir ação antes da atualização.

* Alterações na tabela do sistema
* Alterações no InnoDB
* Alterações de registro
* Alterações no SQL

#### Alterações na tabela do sistema

* No MySQL 5.7.13, as colunas da tabela de sistema que armazenam valores de cadeia de texto user@host foram aumentadas em comprimento. Antes de fazer uma desativação para uma versão anterior, certifique-se de que não há valores user@host que excedam o limite anterior de 77 caracteres, e realize as seguintes alterações na tabela de sistema `mysql`:

  ```sql
  ALTER TABLE mysql.proc MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.event MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.tables_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.procs_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ```

* O comprimento máximo dos nomes de usuário do MySQL foi aumentado de 16 caracteres para 32 caracteres no MySQL 5.7.8. Antes de fazer uma desinstalação para uma versão anterior, certifique-se de que não há nomes de usuário maiores que 16 caracteres e realize as seguintes alterações na tabela de sistema `mysql`:

  ```sql
  ALTER TABLE mysql.tables_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.columns_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.user MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.db MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.procs_priv MODIFY User char(16) binary DEFAULT '' NOT NULL;
  ```

* A coluna `Password` da tabela do sistema `mysql.user` foi removida no MySQL 5.7.6. Todas as credenciais são armazenadas na coluna `authentication_string`, incluindo as que anteriormente estavam armazenadas na coluna `Password`. Para tornar a tabela `mysql.user` compatível com versões anteriores, realize as seguintes alterações antes de fazer a desinstalação:

  ```sql
  ALTER TABLE mysql.user ADD Password char(41) character set latin1
    collate latin1_bin NOT NULL default '' AFTER user;
  UPDATE mysql.user SET password = authentication_string WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  UPDATE mysql.user SET authentication_string = '' WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  ```

* As tabelas dos sistemas `help_*` e `time_zone*` foram alteradas de `MyISAM` para `InnoDB` no MySQL 5.7.5. Antes de fazer uma atualização para uma versão anterior, altere cada tabela afetada de volta para `MyISAM` executando as seguintes instruções:

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

* As tabelas dos sistemas `mysql.plugin` e `mysql.servers` foram alteradas de `MyISAM` para `InnoDB` no MySQL 5.7.6. Antes de fazer uma atualização para uma versão anterior, altere cada tabela afetada de volta para `MyISAM` executando as seguintes instruções:

  ```sql
  ALTER TABLE mysql.plugin ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.servers ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ```

* A definição da coluna `plugin` na tabela do sistema `mysql.user` difere no MySQL 5.7. Antes de fazer uma desativação para um servidor MySQL 5.6 para versões 5.6.23 e superiores, altere a definição da coluna `plugin` usando esta declaração:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin
    DEFAULT 'mysql_native_password';
  ```

Antes de fazer uma atualização para um servidor MySQL 5.6.22 ou mais antigo, altere a definição da coluna `plugin` usando esta declaração:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin DEFAULT '';
  ```

* A partir do MySQL 5.7.7, o esquema `sys` é instalado por padrão durante a instalação do diretório de dados. Antes de fazer uma desvantagem para uma versão anterior, é recomendável que você elimine o esquema `sys`:

  ```sql
  DROP DATABASE sys;
  ```

Se você estiver fazendo uma atualização para uma versão que inclui o esquema `sys`, o `mysqld_upgrade` recria o esquema `sys` em um formato compatível. O esquema `sys` não está incluído no MySQL 5.6.

#### Alterações no InnoDB

* A partir do MySQL 5.7.5, o campo `FIL_PAGE_FLUSH_LSN`, escrito na primeira página de cada arquivo do espaço de tabela de sistema `InnoDB` e nos arquivos de espaço de desfazer `InnoDB`, é escrito apenas no primeiro arquivo do espaço de tabela de sistema `InnoDB` (número de página 0:0). Como resultado, se você tiver um espaço de tabela de sistema de vários arquivos e decidir fazer uma desativação do MySQL 5.7 para o MySQL 5.6, você pode encontrar uma mensagem inválida na inicialização do MySQL 5.6, afirmando que os números de sequência de log *`x`* e *`y`* nos arquivos ibdata não correspondem ao número de sequência de log *`y`* nos ib_logfiles. Se você encontrar essa mensagem, reinicie o MySQL 5.6. A mensagem inválida não deve aparecer mais.

* Para simplificar a descoberta do espaço de `InnoDB` durante a recuperação em caso de falha, novos tipos de registros de log de refazer foram introduzidos no MySQL 5.7.5. Essa melhoria altera o formato do log de refazer. Antes de realizar uma desativação em local no MySQL 5.7.5 ou posterior, realize um desligamento limpo usando uma configuração `innodb_fast_shutdown` de `0` ou `1`. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada no Desativação em Local.

* Os registros de desfazer do MySQL 5.7.8 e 5.7.9 podem conter informações insuficientes sobre colunas espaciais (Bug #21508582). Antes de realizar uma desativação localizada a partir do MySQL 5.7.10 ou superior para o MySQL 5.7.9 ou anterior, realize um desligamento lento usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada no Desativação Localizada.

* Os registros de desfazer do MySQL 5.7.8 podem conter informações insuficientes sobre colunas virtuais e índices de coluna virtual (Bug #21869656). Antes de realizar uma desativação localizada do MySQL 5.7.9 ou posterior para o MySQL 5.7.8 ou anterior, realize um desligamento lento usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada no Desativação Local.

* A partir do MySQL 5.7.9, o cabeçalho do log de refazer do primeiro arquivo de log de refazer (`ib_logfile0`) inclui um identificador de versão do formato e uma string de texto que identifica a versão do MySQL que criou os arquivos de log de refazer. Essa melhoria altera o formato do log de refazer. Para evitar que versões mais antigas do MySQL comecem a funcionar em arquivos de log de refazer criados no MySQL 5.7.9 ou posterior, o checksum (verificação de integridade) das páginas de ponto de verificação do log de refazer foi alterado. Como resultado, você deve realizar um desligamento lento do MySQL (usando innodb_fast_shutdown=0) e remover os arquivos de log de refazer (os arquivos `ib_logfile*`) antes de realizar uma desativação localizada. Um desligamento lento usando `innodb_fast_shutdown=0` e a remoção dos arquivos de log de refazer são etapas recomendadas no Desativação Localizada.

* Uma nova versão de compressão usada pelo recurso de compressão de página `InnoDB` foi adicionada no MySQL 5.7.32. A nova versão de compressão não é compatível com versões anteriores do MySQL. Criar uma tabela comprimida em página no MySQL 5.7.32 ou superior e acessar a tabela após a desvantagem para uma versão anterior ao MySQL 5.7.32 causa uma falha. Como uma solução alternativa, descomprima essas tabelas antes de desvantagem. Para descomprimir uma tabela, execute `ALTER TABLE tbl_name COMPRESSION='None'` e `OPTIMIZE TABLE`. Para informações sobre o recurso de compressão de página `InnoDB`, consulte a Seção 14.9.2, “Compressão de Página InnoDB”.

#### Registro de Alterações

* O suporte para enviar o registro do log de erro do servidor para o `syslog` no MySQL 5.7.5 e superior difere das versões mais antigas. Se você usar o `syslog` e fazer uma desativação para uma versão mais antiga que 5.7.5, você deve parar de usar as variáveis de sistema relevantes `mysqld` e usar as opções de comando correspondentes `mysqld_safe` em vez disso. Suponha que você use o `syslog` definindo essas variáveis de sistema no grupo `[mysqld]` de um arquivo de opção:

  ```sql
  [mysqld]
  log_syslog=ON
  log_syslog_tag=mytag
  ```

Para fazer uma desativação, remova esses ajustes e adicione configurações de opção no grupo de arquivos de opção `[mysqld_safe]`:

  ```sql
  [mysqld_safe]
  syslog
  syslog-tag=mytag
  ```

As variáveis de sistema relacionadas ao `syslog` que não possuem opção correspondente ao `mysqld_safe` não podem ser usadas após uma descida de nível.

#### Alterações no SQL

* Um gatilho pode ter gatilhos para diferentes combinações de evento de gatilho (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`); no entanto, antes do MySQL 5.7.2, não é possível ter múltiplos gatilhos que tenham o mesmo evento de gatilho e tempo de ação. O MySQL 5.7.2 elimina essa limitação e múltiplos gatilhos são permitidos. Essa mudança tem implicações para as descontinuidades.

Se você desfazer um servidor que suporta múltiplos gatilhos para uma versão mais antiga que não o faz, o efeito do desfazer é o seguinte:

+ Para cada tabela que possui gatilhos, todas as definições de gatilho permanecem no arquivo `.TRG` para a tabela. No entanto, se houver vários gatilhos com o mesmo evento de gatilho e tempo de ação, o servidor executa apenas um deles quando o evento de gatilho ocorre. Para informações sobre os arquivos `.TRG`, consulte Armazenamento de gatilho de tabela.

+ Se os gatilhos da tabela forem adicionados ou removidos após a desvalorização, o servidor reescreve o arquivo `.TRG` da tabela. O arquivo reescrito retém apenas um gatilho por combinação de evento de gatilho e hora da ação; os outros são perdidos.

Para evitar esses problemas, modifique seus gatilhos antes de fazer a desativação. Para cada tabela que tem vários gatilhos por combinação de evento de gatilho e hora de ação, converta cada conjunto desses gatilhos em um único gatilho da seguinte forma:

1. Para cada gatilho, crie uma rotina armazenada que contenha todo o código do gatilho. Os valores acessados usando `NEW` e `OLD` podem ser passados para a rotina usando parâmetros. Se o gatilho precisar de um único valor de resultado do código, você pode colocar o código em uma função armazenada e fazer com que a função retorne o valor. Se o gatilho precisar de vários valores de resultado do código, você pode colocar o código em um procedimento armazenado e retornar os valores usando os parâmetros `OUT`.

2. Remova todos os gatilhos da tabela.  
  
  3. Crie um novo gatilho para a tabela que invoque as rotinas armazenadas que foram criadas. O efeito deste gatilho é, portanto, o mesmo que os múltiplos gatilhos que ele substitui.

### 2.11.4 Desatualização de instalações binárias e baseadas em pacotes em Unix/Linux

Esta seção descreve como fazer uma desinstalação de instalações binárias e baseadas em pacotes do MySQL em Unix/Linux. Métodos de desinstalação local e lógico são descritos.

* Downgrade no local
* Downgrade lógico

#### Downgrade In-Place

A desativação no local envolve desligar a nova versão do MySQL, substituir os binários ou pacotes do MySQL novo pelos antigos e reiniciar a versão antiga do MySQL no diretório de dados existente.

A desativação no local é suportada para desativações entre versões GA dentro da mesma série de versões.

A desativação no local não é suportada para instalações de repositórios MySQL APT, SLES e Yum.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_safe` não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

Para realizar uma desativação no local:

1. Revise as informações na Seção 2.11.1, “Antes de Começar”.

2. Se você usar transações XA com `InnoDB`, execute `XA RECOVER` antes de fazer uma desativação para verificar transações XA não comprometidas. Se os resultados forem retornados, comprometa ou desconsome as transações XA emitindo uma declaração `XA COMMIT` ou `XA ROLLBACK`.

3. Configure o MySQL para realizar um desligamento lento, definindo `innodb_fast_shutdown` para `0`. Por exemplo:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

Com uma parada lenta, `InnoDB` realiza uma purga completa e uma fusão de buffers antes de desligar, o que garante que os arquivos de dados estejam totalmente preparados para o caso de diferenças de formato de arquivo entre as versões.

4. Desative o servidor MySQL mais recente. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

5. Após o desligamento lento, remova os arquivos de registro de redo `InnoDB` (os arquivos `ib_logfile*`) do diretório `data` para evitar problemas de downgrade relacionados a mudanças no formato do arquivo de registro de redo que podem ter ocorrido entre as versões.

   ```sql
   rm ib_logfile*
   ```

6. Desdém os binários ou pacotes do MySQL no local, substituindo os binários ou pacotes mais recentes pelos mais antigos.

7. Inicie o servidor MySQL mais antigo (desatualizado) usando o diretório de dados existente. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

8. Execute `mysqld_upgrade`. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

`mysqld_upgrade` examina todas as tabelas em todos os bancos de dados em busca de incompatibilidades com a versão atual do MySQL e tenta reparar as tabelas se problemas forem encontrados.

9. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

#### Downgrade lógico

O downgrade lógico envolve o uso do **mysqldump** para drenar todas as tabelas da nova versão do MySQL e, em seguida, carregar o arquivo de dump na versão antiga do MySQL.

Desvantagens lógicas são suportadas para desvantagens entre versões dentro da mesma série de lançamento e para desvantagens para o nível de lançamento anterior. Apenas desvantagens entre versões de Disponibilidade Geral (GA) são suportadas. Antes de prosseguir, revise a Seção 2.11.1, “Antes de Começar”.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_safe` não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

Para as instalações de repositórios do MySQL APT, SLES e Yum, apenas são suportadas reduções para o nível de versão anterior. Quando as instruções exigem a inicialização de uma instância mais antiga, use o utilitário de gerenciamento de pacotes para remover os pacotes do MySQL 5.7 e instalar pacotes do MySQL 5.6.

Para realizar uma desativação lógica:

1. Revise as informações na Seção 2.11.1, “Antes de Começar”.

2. Descarte todas as bases de dados. Por exemplo:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-downgrade.sql
   ```

3. Desative o servidor MySQL mais recente. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Para inicializar uma instância do MySQL 5.7, use `mysqld` com a opção `--initialize` ou `--initialize-insecure`.

   ```sql
   mysqld --initialize --user=mysql
   ```

5. Inicie o servidor MySQL mais antigo, usando o novo diretório de dados. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```

6. Carregue o arquivo de dump no servidor MySQL mais antigo. Por exemplo:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

7. Execute `mysqld_upgrade`. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

`mysqld_upgrade` examina todas as tabelas em todos os bancos de dados em busca de incompatibilidades com a versão atual do MySQL e tenta reparar as tabelas se problemas forem encontrados.

8. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```

### 2.11.5 Solução de problemas de downgrade

Se você desfazer uma série de lançamentos para outra, pode haver incompatibilidades nos formatos de armazenamento de tabela. Nesse caso, use **mysqldump** para drenar suas tabelas antes de desfazer. Após desfazer, recarregue o arquivo de dump usando **mysql** ou **mysqlimport** para recriar suas tabelas. Para exemplos, consulte a Seção 2.10.13, “Copiar bancos de dados MySQL para outra máquina”.

Um sintoma típico de uma mudança de formato de tabela incompatível para baixo, quando você desatualiza, é que você não pode abrir tabelas. Nesse caso, use o procedimento a seguir:

1. Parar o servidor MySQL mais antigo que você está desatualizando. 2. Reiniciar o servidor MySQL mais novo do qual você está desatualizando. 3. Expor quaisquer tabelas que não eram acessíveis ao servidor mais antigo usando **mysqldump** para criar um arquivo de dump. 4. Parar o servidor MySQL mais novo e reiniciar o mais antigo. 5. Recarregar o arquivo de dump no servidor mais antigo. Suas tabelas devem ser acessíveis.

