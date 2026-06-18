### 20.5.6 Usando o MySQL Enterprise Backup com a Replicação por Grupo

O MySQL Enterprise Backup é um utilitário de backup com licença comercial para o MySQL Server, disponível com a Edição Empresarial do MySQL. Esta seção explica como fazer um backup e, posteriormente, restaurar um membro da Replicação em Grupo usando o MySQL Enterprise Backup. A mesma técnica pode ser usada para adicionar rapidamente um novo membro a um grupo.

#### Fazer backup de um membro da replicação em grupo usando o MySQL Enterprise Backup

Fazer backup de um membro da replicação em grupo é semelhante a fazer backup de uma instância MySQL independente. As instruções a seguir assumem que você já está familiarizado com o uso do MySQL Enterprise Backup para fazer um backup; se não for o caso, revise Fazendo backup de um servidor de banco de dados. Além disso, observe os requisitos descritos em Conceder privilégios MySQL ao administrador de backup e Usando o MySQL Enterprise Backup com a replicação em grupo.

Considere o seguinte grupo com três membros, `s1`, `s2` e `s3`, executando em hosts com os mesmos nomes:

```
mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
+-------------+-------------+--------------+
| member_host | member_port | member_state |
+-------------+-------------+--------------+
| s1          |        3306 | ONLINE       |
| s2          |        3306 | ONLINE       |
| s3          |        3306 | ONLINE       |
+-------------+-------------+--------------+
```

Use o MySQL Enterprise Backup para criar um backup de `s2` executando o seguinte comando no seu host, por exemplo:

```
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

Notas

- *Para o MySQL Enterprise Backup 8.0.18 e versões anteriores,* Se a variável de sistema `sql_require_primary_key` estiver definida como `ON` para o grupo, o MySQL Enterprise Backup não conseguirá registrar o progresso do backup nos servidores. Isso ocorre porque a tabela `backup_progress` no servidor é uma tabela CSV, para a qual as chaves primárias não são suportadas. Nesse caso, o **mysqlbackup** emite os seguintes avisos durante a operação de backup:

  ```
  181011 11:17:06 MAIN WARNING: MySQL query 'CREATE TABLE IF NOT EXISTS
  mysql.backup_progress( `backup_id` BIGINT NOT NULL, `tool_name` VARCHAR(4096)
  NOT NULL, `error_code` INT NOT NULL, `error_message` VARCHAR(4096) NOT NULL,
  `current_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP               ON
  UPDATE CURRENT_TIMESTAMP,`current_state` VARCHAR(200) NOT NULL ) ENGINE=CSV
  DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin': 3750, Unable to create a table
  without PK, when system variable 'sql_require_primary_key' is set. Add a PK
  to the table or unset this variable to avoid this message. Note that tables
  without PK can cause performance problems in row-based replication, so please
  consult your DBA before changing this setting.
  181011 11:17:06 MAIN WARNING: This backup operation's progress info cannot be
  logged.
  ```

  Isso não impede que o **mysqlbackup** termine o backup.

- *Para o MySQL Enterprise Backup 8.0.20 e versões anteriores*, ao fazer um backup de um membro secundário, pois o MySQL Enterprise Backup não pode gravar o status do backup e os metadados em uma instância do servidor somente leitura, ele pode emitir avisos semelhantes ao seguinte durante a operação de backup:

  ```
  181113 21:31:08 MAIN WARNING: This backup operation cannot write to backup
  progress. The MySQL server is running with the --super-read-only option.
  ```

  Você pode evitar o aviso usando a opção `--no-history-logging` com seu comando de backup. Isso não é um problema para o MySQL Enterprise Backup 8.0.21 e versões posteriores — consulte o uso do MySQL Enterprise Backup com a Replicação por Grupo para obter detalhes.

#### Restaurando um Membro Falido

Suponha que um dos membros (`s3` no exemplo a seguir) esteja irremediavelmente corrompido. O backup mais recente do membro do grupo `s2` pode ser usado para restaurar `s3`. Aqui estão os passos para realizar a restauração:

1. *Copie o backup do s2 para o host do s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Pare o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```
      s3> systemctl stop mysqld
      ```

   2. Preservar os dois arquivos de configuração no diretório de dados do servidor danificado, `auto.cnf` e `mysqld-auto.cnf` (se existir), copiando-os para um local seguro fora do diretório de dados. Isso é necessário para preservar o UUID do servidor e a Seção 7.1.9.3, “Variáveis de Sistema Persistentes” (se usado), que são necessárias nos passos abaixo.

   3. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para diretórios diferentes do diretório de dados, elas também devem ser deixadas em branco; caso contrário, a operação de restauração falhará.

   4. Restaure o backup de `s2` no host para `s3`:

      ```
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Nota

      O comando acima assume que os logs binários e os logs de retransmissão em `s2` e `s3` têm o mesmo nome de base e estão no mesmo local nos dois servidores. Se essas condições não forem atendidas, você deve usar as opções `--log-bin` e `--relay-log` para restaurar o log binário e o log de retransmissão aos seus caminhos de arquivo originais em `s3`. Por exemplo, se você souber que, em `s3`, o nome de base do log binário é `s3-bin` e o nome de base do log de retransmissão é `s3-relay-bin`, seu comando de restauração deve parecer assim:

      ```
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Ser capaz de restaurar o log binário e o log de retransmissão para os caminhos de arquivo corretos facilita o processo de restauração; se isso for impossível por algum motivo, consulte a opção "Reinstale o membro falhado para se juntar novamente como um novo membro".

3. *Restaure o arquivo `auto.cnf` para s3.* Para se reiniciar no grupo de replicação, o membro restaurado *deve* ter o mesmo `server_uuid` que ele usou para se juntar ao grupo antes. Forneça o UUID do servidor antigo copiando o arquivo `auto.cnf` preservado no passo 2 acima para o diretório de dados do membro restaurado.

   Nota

   Se você não puder fornecer o arquivo original `server_uuid` do membro falhado ao membro restaurado restaurando seu antigo arquivo `auto.cnf`, você deve permitir que o membro restaurado se junte ao grupo como um novo membro; veja as instruções na seção "Reestruture o Membro Falhado para Reingressar como Novo Membro" abaixo sobre como fazer isso.

4. *Restaure o arquivo `mysqld-auto.cnf` para o s3 (só necessário se o s3 usar variáveis de sistema persistentes).* As configurações da Seção 7.1.9.3, “Variáveis de Sistema Persistentes”, que foram usadas para configurar o membro falhado, devem ser fornecidas ao membro restaurado. Essas configurações podem ser encontradas no arquivo `mysqld-auto.cnf` do servidor falhado, que você deve ter preservado no passo 2 acima. Restaure o arquivo no diretório de dados do servidor restaurado. Veja Restaurar Variáveis de Sistema Persistentes para saber o que fazer se você não tiver uma cópia do arquivo.

5. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que usam o systemd:

   ```
   systemctl start mysqld
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, execute os passos descritos em Restaurar um Membro Primário *antes de iniciar o servidor restaurado*.

6. *Reinicie a replicação em grupo.* Conecte-se ao `s3` reiniciado, por exemplo, usando um cliente **mysql**, e execute a seguinte instrução:

   ```
   mysql> START GROUP_REPLICATION;
   ```

   Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de recuperação distribuída da Replicação de Grupo, e o processo começa após a instrução START GROUP\_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | RECOVERING   |
   +-------------+-------------+--------------+
   ```

   Isso mostra que o `s3` está aplicando transações para se recuperar do grupo. Assim que se recuperar do resto do grupo, seu `member_state` muda para `ONLINE`:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, após ele ter atingido a sincronia com o grupo e se tornar `ONLINE`, siga os passos descritos no final de Restaurar um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro foi agora totalmente restaurado a partir do backup e funciona como um membro regular do grupo.

#### Reinstale o membro falhado para se juntar novamente como um novo membro

Às vezes, os passos descritos acima em Restaurar um Membro Falhado não podem ser realizados porque, por exemplo, o log binário ou o log de retransmissão está corrompido ou simplesmente está ausente do backup. Nessa situação, use o backup para reconstruir o membro e, em seguida, adicione-o ao grupo como um novo membro. Nos passos abaixo, assumimos que o membro reconstruído é chamado `s3`, como o membro falhado, e que ele está rodando no mesmo host que `s3`:

1. \*Copie o backup do s2 para o host do s3. A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Pare o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```
      s3> systemctl stop mysqld
      ```

   2. Preservar o arquivo de configuração `mysqld-auto.cnf`, se encontrado no diretório de dados do servidor corrompido, copiando-o para um local seguro fora do diretório de dados. Isso é para preservar a Seção 7.1.9.3, “Variáveis de Sistema Persistentes”, do servidor, que serão necessárias mais tarde.

   3. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para diretórios diferentes do diretório de dados, elas também devem ser deixadas em branco; caso contrário, a operação de restauração falhará.

   4. Restaure o backup de `s2` no host de `s3`. Com essa abordagem, estamos reconstruindo `s3` como um novo membro, para o qual não precisamos nem queremos usar os logs binários e de encaminhamento antigos no backup; portanto, se esses logs estiverem incluídos no seu backup, exclua-os usando as opções `--skip-binlog` e `--skip-relaylog`:

      ```
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

      Nota

      Se você tiver logs binários e logs de retransmissão saudáveis no backup que você pode transferir para o host de destino sem problemas, é recomendável seguir o procedimento mais fácil descrito em Restaurar um Membro Falhado acima.

3. *Restaure o arquivo `mysqld-auto.cnf` para o s3 (só necessário se o s3 usar variáveis de sistema persistentes).* As configurações da Seção 7.1.9.3, “Variáveis de Sistema Persistentes”, que foram usadas para configurar o membro falhado, devem ser fornecidas ao servidor restaurado. Essas configurações podem ser encontradas no arquivo `mysqld-auto.cnf` do servidor falhado, que você deve ter preservado no passo 2 acima. Restaure o arquivo no diretório de dados do servidor restaurado. Veja Restaurar Variáveis de Sistema Persistentes para saber o que fazer se você não tiver uma cópia do arquivo.

   Nota

   Não restaure o arquivo `auto.cnf` do servidor corrompido no diretório de dados do novo membro — quando o `s3` reconstruído se juntar ao grupo como um novo membro, ele receberá um novo UUID do servidor.

4. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que usam o systemd:

   ```
   systemctl start mysqld
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, execute os passos descritos em Restaurar um Membro Primário *antes de iniciar o servidor restaurado*.

5. *Reconfigure o membro restaurado para se juntar à Replicação em Grupo.* Conecte-se ao servidor restaurado com um cliente **mysql** e reinicie as informações de origem e replicação com as seguintes instruções:

   ```
   mysql> RESET MASTER;
   ```

   ```
   mysql> RESET MASTER;
   mysql> RESET SLAVE ALL;
   ```

   No MySQL 8.0.22 e versões posteriores, use as instruções mostradas aqui:

   ```
   mysql> RESET MASTER;
   mysql> RESET REPLICA ALL;
   ```

   Para que o servidor restaurado possa se recuperar automaticamente usando o mecanismo de recuperação distribuída integrado do Grupo de Replicação, configure a variável `gtid_executed` do servidor. Para isso, use o arquivo `backup_gtid_executed.sql` incluído no backup de `s2`, que geralmente é restaurado no diretório de dados do membro restaurado. Desative o registro binário, use o arquivo `backup_gtid_executed.sql` para configurar `gtid_executed`, e, em seguida, reative o registro binário emitindo as seguintes instruções com seu cliente **mysql**:

   ```
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

   Em seguida, configure as credenciais do usuário de replicação em grupo no membro usando os comandos SQL mostrados aqui:

   ```
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password'
   		-> FOR CHANNEL 'group_replication_recovery';
   ```

   Em MySQL 8.0.23 e versões posteriores, use essas instruções:

   ```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password'
   		-> FOR CHANNEL 'group_replication_recovery';
   ```

6. *Reinicie a replicação em grupo.* Emite a seguinte declaração para o servidor restaurado com seu cliente **mysql**:

   ```
   mysql>> START GROUP_REPLICATION;
   ```

   Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de recuperação distribuída da Replicação de Grupo, e o processo começa após a instrução START GROUP\_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | RECOVERING   |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Isso mostra que o `s3` está aplicando transações para se recuperar do grupo. Assim que se recuperar do resto do grupo, seu `member_state` muda para `ONLINE`:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, após ele ter atingido a sincronia com o grupo e se tornar `ONLINE`, siga os passos descritos no final de Restaurar um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro foi agora restaurado ao grupo como um novo membro.

**Restauração de variáveis de sistema persistentes.** O **mysqlbackup** não oferece suporte para fazer backup ou preservar a Seção 7.1.9.3, “Variáveis de sistema persistentes” — o arquivo `mysqld-auto.cnf` não é incluído em um backup. Para iniciar o membro restaurado com suas configurações de variáveis persistentes, você precisa fazer uma das seguintes ações:

- Preservar uma cópia do arquivo `mysqld-auto.cnf` do servidor corrompido e copiá-lo para o diretório de dados do servidor restaurado.

- Copie o arquivo `mysqld-auto.cnf` de outro membro do grupo para o diretório de dados do servidor restaurado, se esse membro tiver as mesmas configurações de variáveis de sistema persistentes que o membro corrompido.

- Depois que o servidor restaurado for iniciado e antes de você reiniciar a Replicação de Grupo, defina manualmente todas as variáveis do sistema para seus valores persistentes por meio de um cliente **mysql**.

**Restauração de um membro primário.** Se o membro restaurado for primário no grupo, é necessário tomar cuidado para evitar gravações no banco de dados restaurado durante o processo de recuperação distribuída da replicação de grupo. Dependendo de como o grupo é acessado pelos clientes, há a possibilidade de instruções DML serem executadas no membro restaurado assim que ele se tornar acessível na rede, antes de o membro terminar de recuperar as atividades que perdeu enquanto estava fora do grupo. Para evitar isso, *antes de iniciar o servidor restaurado*, configure as seguintes variáveis de sistema no arquivo de opção do servidor:

```
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```

Essas configurações garantem que o membro se torne somente de leitura ao iniciar, e que o planejador de eventos seja desativado enquanto o membro recupera o grupo durante o processo de recuperação distribuída. É necessário também fornecer um tratamento adequado de erros nos clientes, pois eles não podem realizar operações DML durante esse período no membro que está sendo restaurado.

Depois que o processo de restauração estiver totalmente concluído e o membro restaurado estiver sincronizado com o resto do grupo, você poderá reverter essas alterações. Primeiro, reinicie o planejador de eventos usando a instrução mostrada aqui:

```
mysql> SET global event_scheduler=ON;
```

Depois disso, você deve definir as seguintes variáveis de sistema no arquivo de opções do membro, para que ele tenha os valores necessários na próxima vez que o membro for iniciado:

```
group_replication_start_on_boot=ON
super_read_only=OFF
event_scheduler=ON
```
