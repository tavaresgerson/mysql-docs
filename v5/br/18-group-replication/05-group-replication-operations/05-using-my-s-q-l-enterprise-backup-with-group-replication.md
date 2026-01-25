### 17.5.5 Usando MySQL Enterprise Backup com Group Replication

[MySQL Enterprise Backup](/doc/mysql-enterprise-backup/4.1/en/) é um utilitário de backup licenciado comercialmente para o MySQL Server, disponível com o [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/). Esta seção explica como fazer backup e, subsequentemente, restaurar um member do Group Replication usando o MySQL Enterprise Backup. A mesma técnica pode ser usada para adicionar rapidamente um novo member a um grupo.

#### Fazendo Backup de um Member do Group Replication Usando MySQL Enterprise Backup

Fazer backup de um member do Group Replication é semelhante a fazer backup de uma instância MySQL stand-alone. As seguintes instruções pressupõem que você já esteja familiarizado com o uso do MySQL Enterprise Backup para realizar um backup; caso contrário, revise o [Guia do Usuário do MySQL Enterprise Backup 4.1](/doc/mysql-enterprise-backup/4.1/en/), especialmente [Fazendo Backup de um Database Server](/doc/mysql-enterprise-backup/4.1/en/backing-up.html). Observe também os requisitos descritos em [Concedendo Privilégios MySQL ao Administrador de Backup](/doc/mysql-enterprise-backup/4.1/en/mysqlbackup.privileges.html) e [Usando MySQL Enterprise Backup com Group Replication](/doc/mysql-enterprise-backup/4.1/en/meb-group-replication.html).

Considere o seguinte grupo com três members, `s1`, `s2` e `s3`, rodando em hosts com os mesmos nomes:

```sql
mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
+-------------+-------------+--------------+
| member_host | member_port | member_state |
+-------------+-------------+--------------+
| s1          |        3306 | ONLINE       |
| s2          |        3306 | ONLINE       |
| s3          |        3306 | ONLINE       |
+-------------+-------------+--------------+
```

Usando o MySQL Enterprise Backup, crie um backup de `s2` emitindo em seu host, por exemplo, o seguinte comando:

```sql
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

Note

* Ao fazer backup de um secondary member, como o MySQL Enterprise Backup não pode gravar o status e metadados do backup em uma Server Instance read-only, ele pode emitir avisos semelhantes ao seguinte durante a operação de backup:

  ```sql
  181113 21:31:08 MAIN WARNING: This backup operation cannot write to backup
  progress. The MySQL server is running with the --super-read-only option.
  ```

  Você pode evitar o aviso usando a opção `--no-history-logging` com seu comando de backup.

#### Restaurando um Member Falho

Suponha que um dos members (`s3` no exemplo a seguir) esteja irremediavelmente corrompido. O backup mais recente do member do grupo `s2` pode ser usado para restaurar `s3`. Aqui estão os passos para realizar a restauração:

1. *Copie o backup de s2 para o host de s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis. Neste exemplo, assumimos que os hosts são ambos Serveres Linux e usamos SCP para copiar os arquivos entre eles:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao host de destino (o host para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Pare o Server corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

   2. Preserve o arquivo de configuração `auto.cnf`, localizado no Data Directory do Server corrompido, copiando-o para um local seguro fora do Data Directory. Isso é para preservar o [`server_uuid`](replication-options.html#sysvar_server_uuid) do Server, que será necessário mais tarde.

   3. Exclua todo o conteúdo do Data Directory de `s3`. Por exemplo:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as System Variables [`innodb_data_home_dir`](innodb-parameters.html#sysvar_innodb_data_home_dir), [`innodb_log_group_home_dir`](innodb-parameters.html#sysvar_innodb_log_group_home_dir) e [`innodb_undo_directory`](innodb-parameters.html#sysvar_innodb_undo_directory) apontarem para quaisquer diretórios diferentes do Data Directory, eles também devem ser esvaziados; caso contrário, a operação de restauração falhará.

   4. Restaure o backup de `s2` para o host de `s3`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Note

      O comando acima assume que os Binary Logs e Relay Logs em `s2` e `s3` têm o mesmo nome base e estão no mesmo local nos dois Serveres. Se essas condições não forem atendidas, para o MySQL Enterprise Backup 4.1.2 e posterior, você deve usar as opções [`--log-bin`](/doc/mysql-enterprise-backup/4.1/en/server-repository-options.html#option_meb_log-bin) e [`--relay-log`](/doc/mysql-enterprise-backup/4.1/en/server-repository-options.html#option_meb_relay-log) para restaurar o Binary Log e o Relay Log para seus caminhos de arquivo originais em `s3`. Por exemplo, se você souber que em `s3` o nome base do Binary Log é `s3-bin` e o nome base do Relay Log é `s3-relay-bin`, seu comando de restauração deve ser parecido com:

      ```sql
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Ser capaz de restaurar o Binary Log e o Relay Log para os caminhos de arquivo corretos torna o processo de restauração mais fácil; se isso for impossível por algum motivo, consulte [Reconstruir o Member Falho para Retornar como um Novo Member](group-replication-enterprise-backup.html#group-replication-rebuild-member "Reconstruir o Member Falho para Retornar como um Novo Member").

3. *Restaure o arquivo `auto.cnf` para s3.* Para retornar ao grupo de Replication, o member restaurado *deve* ter o mesmo [`server_uuid`](replication-options.html#sysvar_server_uuid) que ele usava para ingressar no grupo antes. Forneça o antigo Server UUID copiando o arquivo `auto.cnf` preservado na etapa 2 acima para o Data Directory do member restaurado.

   Note

   Se você não conseguir fornecer o [`server_uuid`](replication-options.html#sysvar_server_uuid) original do member falho ao member restaurado, restaurando seu antigo arquivo `auto.cnf`, você deve permitir que o member restaurado ingresse no grupo como um novo member; consulte as instruções em [Reconstruir o Member Falho para Retornar como um Novo Member](group-replication-enterprise-backup.html#group-replication-rebuild-member "Reconstruir o Member Falho para Retornar como um Novo Member") abaixo sobre como fazer isso.

4. *Inicie o Server restaurado.* Por exemplo, em distribuições Linux que usam systemd:

   ```sql
   systemctl start mysqld
   ```

   Note

   Se o Server que você está restaurando for um primary member, execute as etapas descritas em [Restaurando um Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restaurando um Primary Member") *antes de iniciar o Server restaurado*.

5. *Reinicie o Group Replication.* Conecte-se ao `s3` reiniciado usando, por exemplo, um cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e emita o seguinte comando:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Antes que a instância restaurada possa se tornar um member online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após o backup ter sido realizado; isso é alcançado usando o mecanismo de [distributed recovery](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery") do Group Replication, e o processo começa após a instrução [START GROUP_REPLICATION](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") ter sido emitida. Para verificar o status do member da instância restaurada, emita:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | RECOVERING   |
   +-------------+-------------+--------------+
   ```

   Isso mostra que `s3` está aplicando transações para se sincronizar com o grupo (*catch up*). Assim que ele se sincronizar com o restante do grupo, seu `member_state` muda para `ONLINE`:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Note

   Se o Server que você está restaurando for um primary member, assim que ele ganhar sincronia com o grupo e se tornar `ONLINE`, execute as etapas descritas no final de [Restaurando um Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restaurando um Primary Member") para reverter as alterações de configuração que você havia feito no Server antes de iniciá-lo.

O member foi agora totalmente restaurado a partir do backup e funciona como um member regular do grupo.

#### Reconstruir o Member Falho para Retornar como um Novo Member

Às vezes, as etapas descritas acima em [Restaurando um Member Falho](group-replication-enterprise-backup.html#group-replication-restore-failed-member "Restaurando um Member Falho") não podem ser realizadas porque, por exemplo, o Binary Log ou Relay Log está corrompido, ou simplesmente está faltando no backup. Em tal situação, use o backup para reconstruir o member e, em seguida, adicione-o ao grupo como um novo member. Nas etapas abaixo, assumimos que o member reconstruído se chama `s3`, como o member falho, e está em execução no mesmo host em que `s3` estava:

1. *Copie o backup de s2 para o host de s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis. Neste exemplo, assumimos que os hosts são ambos Serveres Linux e usamos SCP para copiar os arquivos entre eles:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao host de destino (o host para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Pare o Server corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

   2. Exclua todo o conteúdo do Data Directory de `s3`. Por exemplo:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as System Variables [`innodb_data_home_dir`](innodb-parameters.html#sysvar_innodb_data_home_dir), [`innodb_log_group_home_dir`](innodb-parameters.html#sysvar_innodb_log_group_home_dir) e [`innodb_undo_directory`](innodb-parameters.html#sysvar_innodb_undo_directory) apontarem para quaisquer diretórios diferentes do Data Directory, eles também devem ser esvaziados; caso contrário, a operação de restauração falhará.

   3. Restaure o backup de `s2` para o host de `s3`. Com esta abordagem, estamos reconstruindo `s3` como um novo member, para o qual não precisamos ou não queremos usar os antigos Binary Logs e Relay Logs no backup; portanto, se esses logs foram incluídos em seu backup, exclua-os usando as opções [`--skip-binlog`](/doc/mysql-enterprise-backup/4.1/en/backup-capacity-options.html#option_meb_skip-binlog) e [`--skip-relaylog`](/doc/mysql-enterprise-backup/4.1/en/backup-capacity-options.html#option_meb_skip-relaylog):

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

      Notes

      * Se você tiver Binary Logs e Relay Logs saudáveis no backup que possa transferir para o host de destino sem problemas, é recomendável seguir o procedimento mais fácil, conforme descrito em [Restaurando um Member Falho](group-replication-enterprise-backup.html#group-replication-restore-failed-member "Restaurando um Member Falho") acima.

      * NÃO restaure manualmente o arquivo `auto.cnf` do Server corrompido para o Data Directory do novo member—quando o `s3` reconstruído ingressar no grupo como um novo member, um novo Server UUID será atribuído a ele.

3. *Inicie o Server restaurado.* Por exemplo, em distribuições Linux que usam systemd:

   ```sql
   systemctl start mysqld
   ```

   Note

   Se o Server que você está restaurando for um primary member, execute as etapas descritas em [Restaurando um Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restaurando um Primary Member") *antes de iniciar o Server restaurado*.

4. *Reconfigure o member restaurado para ingressar no Group Replication.* Conecte-se ao Server restaurado com um cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e redefina as informações de source e replica com os seguintes comandos:

   ```sql
   mysql> RESET MASTER;
   ```

   ```sql
   mysql> RESET SLAVE ALL;
   ```

   Para que o Server restaurado possa se recuperar automaticamente usando o mecanismo de [distributed recovery](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery") integrado do Group Replication, configure a System Variable [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) do Server. Para fazer isso, use o arquivo `backup_gtid_executed.sql` incluído no backup de `s2`, que geralmente é restaurado sob o Data Directory do member restaurado. Desabilite o binary logging, use o arquivo `backup_gtid_executed.sql` para configurar [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) e, em seguida, reative o binary logging emitindo as seguintes instruções com seu cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

   ```sql
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

   Em seguida, configure as [Group Replication user credentials](group-replication-user-credentials.html "17.2.1.3 User Credentials") no member:

   ```sql
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' /
   		FOR CHANNEL 'group_replication_recovery';
   ```

5. *Reinicie o Group Replication.* Emita o seguinte comando para o Server restaurado com seu cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Antes que a instância restaurada possa se tornar um member online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após o backup ter sido realizado; isso é alcançado usando o mecanismo de [distributed recovery](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery") do Group Replication, e o processo começa após a instrução [START GROUP_REPLICATION](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") ter sido emitida. Para verificar o status do member da instância restaurada, emita:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | RECOVERING   |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Isso mostra que `s3` está aplicando transações para se sincronizar com o grupo (*catch up*). Assim que ele se sincronizar com o restante do grupo, seu `member_state` muda para `ONLINE`:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Note

   Se o Server que você está restaurando for um primary member, assim que ele ganhar sincronia com o grupo e se tornar `ONLINE`, execute as etapas descritas no final de [Restaurando um Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restaurando um Primary Member") para reverter as alterações de configuração que você havia feito no Server antes de iniciá-lo.

O member foi agora restaurado para o grupo como um novo member.

**Restaurando um Primary Member.** Se o member restaurado for um primary no grupo, deve-se tomar cuidado para evitar operações de write no Database restaurado durante a fase de recovery do Group Replication: Dependendo de como o grupo é acessado pelos clientes, existe a possibilidade de instruções DML serem executadas no member restaurado assim que ele se tornar acessível na rede, antes que o member termine de se sincronizar (*catch-up*) nas atividades que perdeu enquanto estava fora do grupo. Para evitar isso, *antes de iniciar o Server restaurado*, configure as seguintes System Variables no arquivo de opção do Server:

```sql
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```

Essas configurações garantem que o member se torne read-only na inicialização e que o event scheduler seja desativado enquanto o member está se sincronizando com o grupo durante a fase de recovery. O tratamento de erro adequado também deve ser configurado nos clientes, pois eles são temporariamente impedidos de realizar operações DML durante esse período no member restaurado. Assim que o processo de restauração for totalmente concluído e o member restaurado estiver em sincronia com o restante do grupo, reverta essas alterações; reinicie o event scheduler:

```sql
mysql> SET global event_scheduler=ON;
```

Edite as seguintes System Variables no arquivo de opção do member, para que as configurações estejam corretas para a próxima inicialização:

```sql
group_replication_start_on_boot=ON
super_read_only=OFF
event_scheduler=ON
```
