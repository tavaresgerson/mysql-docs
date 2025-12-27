### 20.5.6 Usando o MySQL Enterprise Backup com a Replicação por Grupo

O MySQL Enterprise Backup é uma ferramenta de backup com licença comercial para o MySQL Server, disponível com a [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/). Esta seção explica como fazer o backup e, posteriormente, restaurar um membro da Replicação por Grupo usando o MySQL Enterprise Backup. A mesma técnica pode ser usada para adicionar rapidamente um novo membro a um grupo.

#### Fazendo o Backup de um Membro da Replicação por Grupo Usando o MySQL Enterprise Backup

Fazer o backup de um membro da Replicação por Grupo é semelhante a fazer o backup de uma instância MySQL autônoma. As instruções a seguir assumem que você já está familiarizado com como usar o MySQL Enterprise Backup para fazer um backup; se não for o caso, revise Fazendo o Backup de um Servidor de Banco de Dados. Além disso, observe os requisitos descritos em Conceder Privilégios ao Administrador de Backup e Usando o MySQL Enterprise Backup com a Replicação por Grupo.

Considere o seguinte grupo com três membros, `s1`, `s2` e `s3`, rodando em hosts com os mesmos nomes:

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

Usando o MySQL Enterprise Backup, crie um backup de `s2` emitindo em seu host, por exemplo, o seguinte comando:

```
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

#### Restaurando um Membro Falhado

Suponha que um dos membros (`s3` no exemplo a seguir) esteja irremediavelmente corrompido. O backup mais recente do membro do grupo `s2` pode ser usado para restaurar `s3`. Aqui estão os passos para realizar a restauração:

1. *Copie o backup de s2 para o host de s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3`, neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Parta o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```
      s3> systemctl stop mysqld
      ```

   2. Preservar os dois arquivos de configuração no diretório de dados do servidor corrompido, `auto.cnf` e `mysqld-auto.cnf` (se existir), copiando-os para um local seguro fora do diretório de dados. Isso é para preservar o UUID do servidor e a Seção 7.1.9.3, “Variáveis de Sistema Persistentes” (se usada), que são necessárias nos passos abaixo.

   3. Exclua todo o conteúdo no diretório de dados de `s3`. Por exemplo:

      ```
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para diretórios diferentes do diretório de dados, elas também devem ser vazias; caso contrário, a operação de restauração falhará.

   4. Restaure o backup de `s2` no hospedeiro para `s3`:

      ```
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

   Nota

   O comando acima assume que os logs binários e logs de retransmissão em `s2` e `s3` tenham o mesmo nome de base e estejam no mesmo local nos dois servidores. Se essas condições não forem atendidas, você deve usar as opções `--log-bin` e `--relay-log` para restaurar o log binário e o log de retransmissão para seus caminhos de arquivo originais em `s3`. Por exemplo, se você sabe que, em `s3`, o nome de base do log binário é `s3-bin` e o nome de base do log de retransmissão é `s3-relay-bin`, seu comando de restauração deve parecer assim:

      ```
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

   A capacidade de restaurar o log binário e o log de retransmissão aos caminhos de arquivo corretos facilita o processo de restauração; se isso for impossível por algum motivo, consulte Refazer o Membro Falhado para Reingressar como um Novo Membro.

3. *Restaure o arquivo `auto.cnf` para s3.* Para voltar a se juntar ao grupo de replicação, o membro restaurado *deve* ter o mesmo `server_uuid` que usou para se juntar ao grupo antes. Forneça o UUID do servidor antigo copiando o arquivo `auto.cnf` preservado no passo 2 acima para o diretório de dados do membro restaurado.

   Nota

   Se você não puder fornecer o `server_uuid` original do membro falhado ao membro restaurado restaurando seu antigo `auto.cnf`, você deve permitir que o membro restaurado se junte ao grupo como um novo membro; veja as instruções em Reconstruir o Membro Falhado para Reingressar como Novo Membro abaixo sobre como fazer isso.

4. *Restaure o arquivo `mysqld-auto.cnf` para s3 (necessário apenas se s3 usar variáveis de sistema persistentes).* Os ajustes para a Seção 7.1.9.3, “Variáveis de Sistema Pervasientes” que foram usados para configurar o membro falhado devem ser fornecidos ao membro restaurado. Esses ajustes podem ser encontrados no arquivo `mysqld-auto.cnf` do servidor falhado, que você deve ter preservado no passo 2 acima. Restaure o arquivo para o diretório de dados do servidor restaurado. Veja Restaurar Variáveis de Sistema Pervasientes sobre o que fazer se você não tiver uma cópia do arquivo.

5. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que usam systemd:

   ```
   systemctl start mysqld
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, realize os passos descritos em Restaurar um Membro Primário *antes de iniciar o servidor restaurado*.

6. *Reinicie a Replicação do Grupo.* Conecte-se ao `s3` reiniciado usando, por exemplo, um cliente **mysql**, e execute o seguinte comando:

   ```
   mysql> START GROUP_REPLICATION;
   ```

Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é alcançado usando o mecanismo de recuperação distribuído da Replicação de Grupo, e o processo começa após a declaração START GROUP_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

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

Isso mostra que o `s3` está aplicando transações para recuperar o atraso em relação ao grupo. Uma vez que ele tenha recuperado o restante do grupo, seu `member_state` muda para `ONLINE`:

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

Se o servidor que você está restaurando for um membro primário, uma vez que ele tenha alcançado a sincronia com o grupo e se torne `ONLINE`, execute as etapas descritas no final de Restaurar um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro agora foi totalmente restaurado a partir da cópia de segurança e funciona como um membro regular do grupo.

#### Reinstale o Membro Falhado para Reintegrar como Novo Membro

Às vezes, os passos descritos acima em Restaurar um Membro Falhado não podem ser realizados porque, por exemplo, o log binário ou o log de retransmissão está corrompido ou simplesmente está ausente da cópia de segurança. Nessa situação, use a cópia de segurança para reconstruir o membro e, em seguida, adicione-o ao grupo como um novo membro. Nos passos abaixo, assumimos que o membro reconstruído é chamado `s3`, como o membro falhado, e que ele está rodando no mesmo host que o `s3`:

1. *Copie a cópia de segurança do s2 para o host do s3 .* A maneira exata de copiar a cópia de segurança depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são ambos servidores Linux e usam SCP para copiar os arquivos entre eles:

```
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3`, neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

   1. Parta o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```
      s3> systemctl stop mysqld
      ```

   2. Preservar o arquivo de configuração `mysqld-auto.cnf`, se encontrado no diretório de dados do servidor corrompido, copiando-o para um local seguro fora do diretório de dados. Isso é para preservar a Seção 7.1.9.3, “Variáveis de sistema persistidas”, que são necessárias mais tarde.

   3. Exclua todo o conteúdo no diretório de dados de `s3`. Por exemplo:

      ```
      s3> rm -rf /var/lib/mysql/*
      ```

      Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para diretórios diferentes do diretório de dados, elas também devem ser vazias; caso contrário, a operação de restauração falha.

   4. Restaure o backup de `s2` no hospedeiro de `s3`. Com essa abordagem, estamos reconstruindo `s3` como um novo membro, para o qual não precisamos ou não queremos usar o binário antigo e os logs de retransmissão no backup; portanto, se esses logs tiverem sido incluídos no seu backup, exclua-os usando as opções `--skip-binlog` e `--skip-relaylog`:

      ```
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

   Nota

   Se você tiver logs de binário e de retransmissão saudáveis no backup que pode transferir para o hospedeiro de destino sem problemas, é recomendável seguir o procedimento mais fácil, conforme descrito em Restaurar um membro falhado acima.

3. *Restaure o arquivo `mysqld-auto.cnf` para o s3 (só necessário se o s3 usar variáveis de sistema persistentes).* As configurações da Seção 7.1.9.3, “Variáveis de Sistema Persistentes”, que foram usadas para configurar o membro falhado, devem ser fornecidas ao servidor restaurado. Essas configurações podem ser encontradas no arquivo `mysqld-auto.cnf` do servidor falhado, que você deve ter preservado no passo 2 acima. Restaure o arquivo para o diretório de dados do servidor restaurado. Veja Restaurar Variáveis de Sistema Persistentes para saber o que fazer se você não tiver uma cópia do arquivo.

   Nota

   **NÃO** restaure o arquivo `auto.cnf` do servidor corrompido para o diretório de dados do novo membro — quando o `s3` reconstruído se juntar ao grupo como um novo membro, ele receberá um novo UUID do servidor.

4. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que usam systemd:

   ```
   systemctl start mysqld
   ```

   Nota

   Se o servidor que você está restaurando for um membro primário, execute os passos descritos em Restaurar um Membro Primário *antes de iniciar o servidor restaurado*.

5. *Reconfigure o membro restaurado para se juntar à Replicação em Grupo.* Conecte-se ao servidor restaurado com um cliente **mysql** e reinicie as informações de origem e replica com as seguintes instruções:

   ```
   mysql> RESET BINARY LOGS AND GTIDS;

   mysql> RESET REPLICA ALL;
   ```

   Para que o servidor restaurado possa se recuperar automaticamente usando o mecanismo de recuperação distribuída embutido da Replicação em Grupo, configure a variável `gtid_executed` do servidor. Para fazer isso, use o arquivo `backup_gtid_executed.sql` incluído no backup de `s2`, que geralmente é restaurado no diretório de dados do membro restaurado. Desative o registro binário, use o arquivo `backup_gtid_executed.sql` para configurar `gtid_executed`, e depois reative o registro binário emitindo as seguintes instruções com seu cliente **mysql**:

   ```
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```EpqLihfdbq```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user',
       ->   SOURCE_PASSWORD='password'
       ->   FOR CHANNEL 'group_replication_recovery';
   ```ruEbswcc5n```
   mysql> START GROUP_REPLICATION;
   ```S6IeYjFJny```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | RECOVERING   |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```CKFu17S9IM```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```Awxpq7ldyI```
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```j9V18ti4hd```
mysql> SET global event_scheduler=ON;
```EVw1SfPO0Z```