### 17.5.5 Usando o MySQL Enterprise Backup com a Replicação por Grupo

MySQL Enterprise Backup é um utilitário de backup com licença comercial para o MySQL Server, disponível com a [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/). Esta seção explica como fazer backup e, posteriormente, restaurar um membro da Replicação em Grupo usando o MySQL Enterprise Backup. A mesma técnica pode ser usada para adicionar rapidamente um novo membro a um grupo.

#### Fazer backup de um membro da replicação em grupo usando o MySQL Enterprise Backup

Fazer backup de um membro da replicação em grupo é semelhante a fazer backup de uma instância MySQL independente. As instruções a seguir assumem que você já está familiarizado com como usar o MySQL Enterprise Backup para fazer um backup; se não for o caso, revise o Guia do Usuário do MySQL Enterprise Backup 4.1, especialmente Fazendo backup de um servidor de banco de dados. Além disso, observe os requisitos descritos em Conceder privilégios MySQL ao administrador de backup e Usando o MySQL Enterprise Backup com a replicação em grupo.

Considere o seguinte grupo com três membros, `s1`, `s2` e `s3`, executando em hosts com os mesmos nomes:

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

Use o MySQL Enterprise Backup para criar um backup do `s2` executando o seguinte comando no seu host, por exemplo:

```sql
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

Nota

- Ao fazer uma cópia de segurança de um membro secundário, uma vez que o MySQL Enterprise Backup não pode gravar o status de backup e os metadados em uma instância do servidor de leitura somente, ele pode emitir avisos semelhantes ao seguinte durante a operação de backup:

  ```sql
  181113 21:31:08 MAIN WARNING: This backup operation cannot write to backup
  progress. The MySQL server is running with the --super-read-only option.
  ```

  Você pode evitar o aviso usando a opção `--no-history-logging` com seu comando de backup.

#### Restaurando um Membro Falido

Suponha que um dos membros (`s3` no exemplo a seguir) esteja irremediavelmente corrompido. O backup mais recente do membro do grupo `s2` pode ser usado para restaurar `s3`. Aqui estão os passos para realizar a restauração:

1. *Copie o backup do s2 para o host do s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3`, neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Pare o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

   2. Preservar o arquivo de configuração `auto.cnf`, localizado no diretório de dados do servidor corrompido, copiando-o para um local seguro fora do diretório de dados. Isso é para preservar o UUID do servidor, que será necessário mais tarde.

   3. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e \[`innodb_undo_directory`]\(innodb-parameters.html#sysvar\_innodb\_undo\_directory] apontarem para diretórios diferentes do diretório de dados, eles também devem ser limpos; caso contrário, a operação de restauração falhará.

   4. Restaure o backup do `s2` no host para `s3`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Nota

      O comando acima assume que os logs binários e os logs de retransmissão em `s2` e `s3` têm o mesmo nome de base e estão no mesmo local nos dois servidores. Se essas condições não forem atendidas, para o MySQL Enterprise Backup 4.1.2 e versões posteriores, você deve usar as opções `--log-bin` e `--relay-log` para restaurar o log binário e o log de retransmissão para seus caminhos de arquivo originais em `s3`. Por exemplo, se você sabe que, em `s3`, o nome de base do log binário é `s3-bin` e o nome de base do log de retransmissão é `s3-relay-bin`, seu comando de restauração deve parecer assim:

      ```sql
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Ser capaz de restaurar o log binário e o log de retransmissão para os caminhos de arquivo corretos facilita o processo de restauração; se isso for impossível por algum motivo, consulte Reestruturar o membro falhado para se reiniciar como um novo membro.

3. *Restaure o arquivo `auto.cnf` para s3.* Para voltar a se juntar ao grupo de replicação, o membro restaurado *deve* ter o mesmo `[server_uuid]` (replication-options.html#sysvar\_server\_uuid) que ele usou para se juntar ao grupo antes. Forneça o antigo UUID do servidor copiando o arquivo `auto.cnf` preservado no passo 2 acima para o diretório de dados do membro restaurado.

   Nota

   Se você não puder fornecer o `server_uuid` original do membro falhado ao membro restaurado restaurando seu antigo arquivo `auto.cnf`, você deve permitir que o membro restaurado se junte ao grupo como um novo membro; veja as instruções em Recriar o Membro Falhado para Reingressar como um Novo Membro abaixo sobre como fazer isso.

4. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que usam o systemd:

   ```sql
   systemctl start mysqld
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, execute os passos descritos em Restaurando um Membro Primário *antes de iniciar o servidor restaurado*.

5. *Reinicie a replicação em grupo.* Conecte-se ao `s3` reiniciado, por exemplo, usando um cliente **mysql** e execute o seguinte comando:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de recuperação distribuída da Replicação de Grupo, e o processo começa após a declaração START GROUP\_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

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

   Isso mostra que o `s3` está aplicando transações para se recuperar do grupo. Assim que recuperar o restante do grupo, seu `member_state` muda para `ONLINE`:

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

   Nota

   Se o servidor que você está restaurando for um membro primário, uma vez que ele tenha sincronizado com o grupo e se tornado `ONLINE`, execute os passos descritos no final de Restaurando um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro foi agora totalmente restaurado a partir do backup e funciona como um membro regular do grupo.

#### Reinstale o membro falhado para se juntar novamente como um novo membro

Às vezes, os passos descritos acima em Restaurando um Membro Falhado não podem ser realizados porque, por exemplo, o log binário ou o log de retransmissão está corrompido ou simplesmente está ausente do backup. Nessa situação, use o backup para reconstruir o membro e, em seguida, adicione-o ao grupo como um novo membro. Nos passos abaixo, assumimos que o membro reconstruído é chamado `s3`, como o membro falhado, e que ele está sendo executado no mesmo host que `s3`:

1. \*Copie o backup do s2 para o host do s3. A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3`, neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Pare o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

   2. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e \[`innodb_undo_directory`]\(innodb-parameters.html#sysvar\_innodb\_undo\_directory] apontarem para diretórios diferentes do diretório de dados, eles também devem ser limpos; caso contrário, a operação de restauração falhará.

   3. Restaure o backup de `s2` no host de `s3`. Com essa abordagem, estamos reconstruindo `s3` como um novo membro, para o qual não precisamos nem queremos usar os logs binários e de retransmissão antigos no backup; portanto, se esses logs tiverem sido incluídos no seu backup, exclua-os usando as opções `--skip-binlog` e `--skip-relaylog`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

      Notas

      - Se você tiver logs binários saudáveis e logs de retransmissão no backup que você possa transferir para o host de destino sem problemas, é recomendável seguir o procedimento mais fácil descrito em Restaurando um Membro Falhado acima.

      - Não restaure manualmente o arquivo `auto.cnf` do servidor corrompido no diretório de dados do novo membro. Quando o `s3` reconstruído se juntar ao grupo como um novo membro, ele receberá um novo UUID do servidor.

3. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que usam o systemd:

   ```sql
   systemctl start mysqld
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, execute os passos descritos em Restaurando um Membro Primário *antes de iniciar o servidor restaurado*.

4. *Reconfigure o membro restaurado para se juntar à Replicação em Grupo.* Conecte-se ao servidor restaurado com um cliente **mysql** e reinicie as informações de origem e replicação com os seguintes comandos:

   ```sql
   mysql> RESET MASTER;
   ```

   ```sql
   mysql> RESET SLAVE ALL;
   ```

   Para que o servidor restaurado possa se recuperar automaticamente usando o mecanismo integrado da Replicação em Grupo para recuperação distribuída, configure a variável `gtid_executed` do servidor. Para isso, use o arquivo `backup_gtid_executed.sql` incluído no backup do `s2`, que geralmente é restaurado no diretório de dados do membro restaurado. Desative o registro binário, use o arquivo `backup_gtid_executed.sql` para configurar `gtid_executed` e, em seguida, reative o registro binário emitindo as seguintes instruções com seu cliente de **mysql**:

   ```sql
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

   Em seguida, configure as credenciais de usuário de Replicação de grupo no membro:

   ```sql
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' /
   		FOR CHANNEL 'group_replication_recovery';
   ```

5. *Reinicie a replicação em grupo.* Emite o seguinte comando para o servidor restaurado com seu cliente **mysql**:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de recuperação distribuída da Replicação de Grupo, e o processo começa após a declaração START GROUP\_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

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

   Isso mostra que o `s3` está aplicando transações para se recuperar do grupo. Assim que recuperar o restante do grupo, seu `member_state` muda para `ONLINE`:

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

   Nota

   Se o servidor que você está restaurando for um membro primário, uma vez que ele tenha sincronizado com o grupo e se tornado `ONLINE`, execute os passos descritos no final de Restaurando um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro foi agora restaurado ao grupo como um novo membro.

**Restauração de um membro primário.** Se o membro restaurado for primário no grupo, é necessário tomar cuidado para evitar gravações no banco de dados restaurado durante a fase de recuperação da replicação de grupo: Dependendo de como o grupo é acessado pelos clientes, há a possibilidade de instruções DML serem executadas no membro restaurado assim que ele se tornar acessível na rede, antes de o membro terminar de recuperar as atividades que perdeu enquanto estava fora do grupo. Para evitar isso, *antes de iniciar o servidor restaurado*, configure as seguintes variáveis de sistema no arquivo de opção do servidor:

```sql
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```

Essas configurações garantem que o membro se torne somente de leitura ao iniciar e que o planejador de eventos seja desativado enquanto o membro está se atualizando com o grupo durante a fase de recuperação. O tratamento adequado de erros também deve ser configurado nos clientes, pois eles são temporariamente impedidos de realizar operações DML durante esse período no membro restaurado. Uma vez que o processo de restauração esteja totalmente concluído e o membro restaurado esteja sincronizado com o resto do grupo, reverta essas alterações; reinicie o planejador de eventos:

```sql
mysql> SET global event_scheduler=ON;
```

Editar as seguintes variáveis de sistema no arquivo de opções do membro, para que as coisas estejam corretamente configuradas para a próxima inicialização:

```sql
group_replication_start_on_boot=ON
super_read_only=OFF
event_scheduler=ON
```
