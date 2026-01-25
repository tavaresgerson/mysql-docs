#### 16.1.3.5 Usando GTIDs para Failover e Scaleout

Existem várias técnicas ao usar o MySQL Replication com Global Transaction Identifiers (GTIDs) para provisionar uma nova replica, que pode ser usada para scaleout, sendo promovida a source conforme necessário para failover. Esta seção descreve as seguintes técnicas:

* [Replication simples](replication-gtids-failover.html#replication-gtids-failover-replicate "Simple replication")
* [Copiando dados e transações para a replica](replication-gtids-failover.html#replication-gtids-failover-copy "Copying data and transactions to the replica")
* [Injetando transações vazias](replication-gtids-failover.html#replication-gtids-failover-empty "Injecting empty transactions")
* [Excluindo transações com gtid_purged](replication-gtids-failover.html#replication-gtids-failover-gtid-purged "Excluding transactions with gtid_purged")
* [Restaurando replicas no modo GTID](replication-gtids-failover.html#replication-gtids-restoring-mysqlbinlog "Restoring GTID mode replicas")

Global Transaction Identifiers foram adicionados ao MySQL Replication com o objetivo de simplificar o gerenciamento geral do fluxo de dados de replication e, em particular, das atividades de failover. Cada identifier identifica exclusivamente um conjunto de Binary Log Events que, juntos, compõem uma Transaction. GTIDs desempenham um papel fundamental na aplicação de alterações ao Database: o Server automaticamente ignora qualquer Transaction que possua um identifier que o Server reconheça como já processado anteriormente. Este comportamento é crítico para o posicionamento automático do replication e para o failover correto.

O mapeamento entre identifiers e conjuntos de Events que compreendem uma dada Transaction é capturado no Binary Log. Isso apresenta alguns desafios ao provisionar um novo Server com dados de outro Server existente. Para reproduzir o conjunto de identifiers no novo Server, é necessário copiar os identifiers do Server antigo para o novo e preservar a relação entre os identifiers e os Events reais. Isso é necessário para restaurar uma replica que esteja imediatamente disponível como candidata a se tornar uma nova source em caso de failover ou switchover.

**Replication simples.** A maneira mais fácil de reproduzir todos os identifiers e Transactions em um novo Server é fazer com que o novo Server se torne a replica de uma source que possua o histórico de execução completo, e habilitar os Global Transaction Identifiers em ambos os Servers. Veja [Section 16.1.3.4, “Setting Up Replication Using GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs"), para mais informações.

Uma vez iniciado o replication, o novo Server copia o Binary Log completo da source e, assim, obtém todas as informações sobre todos os GTIDs.

Este método é simples e eficaz, mas exige que a replica leia o Binary Log da source; às vezes, pode levar um tempo comparativamente longo para que a nova replica alcance (catch up) a source, portanto, este método não é adequado para failover rápido ou restauração a partir de Backup. Esta seção explica como evitar a busca de todo o histórico de execução da source, copiando arquivos de Binary Log para o novo Server.

**Copiando dados e transações para a replica.** Executar todo o histórico de Transactions pode ser demorado quando o Server source processou um grande número de Transactions anteriormente, e isso pode representar um grande gargalo ao configurar uma nova replica. Para eliminar essa exigência, um snapshot do conjunto de dados, dos Binary Logs e das informações de Global Transaction que o Server source contém pode ser importado para a nova replica. O Server source pode ser tanto a source quanto a replica, mas você deve garantir que a source tenha processado todas as Transactions necessárias antes de copiar os dados.

Existem diversas variantes deste método, a diferença estando na maneira como os data dumps e Transactions dos Binary Logs são transferidos para a replica, conforme descrito aqui:

Data Set : 1. Crie um dump file usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") no Server source. Defina a opção [`--master-data`](mysqldump.html#option_mysqldump_master-data) do [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") (com o valor padrão de 1) para incluir uma instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") com informações de Binary Logging. Defina a opção [`--set-gtid-purged`](mysqldump.html#option_mysqldump_set-gtid-purged) como `AUTO` (o padrão) ou `ON`, para incluir informações sobre Transactions executadas no dump. Em seguida, use o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para importar o dump file no Server de destino.

    2. Alternativamente, crie um data snapshot do Server source usando raw data files e, em seguida, copie esses arquivos para o Server de destino, seguindo as instruções em [Section 16.1.2.4, “Choosing a Method for Data Snapshots”](replication-snapshot-method.html "16.1.2.4 Choosing a Method for Data Snapshots"). Se você usar tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), você pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um snapshot consistente. Este comando registra o nome do Log e o offset correspondente ao snapshot a ser usado na replica. MySQL Enterprise Backup é um produto comercial que está incluído como parte de uma assinatura MySQL Enterprise. Veja [Section 28.1, “MySQL Enterprise Backup Overview”](mysql-enterprise-backup.html "28.1 MySQL Enterprise Backup Overview") para informações detalhadas.

    3. Alternativamente, pare ambos os Servers source e de destino, copie o conteúdo do diretório de dados da source para o diretório de dados da nova replica e, em seguida, reinicie a replica. Se você usar este método, a replica deve ser configurada para replication baseada em GTID, ou seja, com [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode). Para instruções e informações importantes sobre este método, veja [Section 16.1.2.6, “Adding Replicas to a Replication Topology”](replication-howto-additionalslaves.html "16.1.2.6 Adding Replicas to a Replication Topology").

Histórico de Transactions : Se o Server source tiver um histórico completo de Transactions em seus Binary Logs (ou seja, o GTID set `@@GLOBAL.gtid_purged` estiver vazio), você pode usar estes métodos.

    1. Importe os Binary Logs do Server source para a nova replica usando [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), com as opções [`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server) e [`--read-from-remote-master`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-master).

    2. Alternativamente, copie os arquivos de Binary Log do Server source para a replica. Você pode fazer cópias da replica usando [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") com as opções [`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server) e [`--raw`](mysqlbinlog.html#option_mysqlbinlog_raw). Eles podem ser lidos na replica usando [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") `>` `file` (sem a opção [`--raw`](mysqlbinlog.html#option_mysqlbinlog_raw)) para exportar os arquivos de Binary Log para arquivos SQL, e então passando esses arquivos para o cliente [**mysql**](mysql.5.1 "4.5.1 mysql — The MySQL Command-Line Client") para processamento. Garanta que todos os arquivos de Binary Log sejam processados usando um único processo [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), em vez de múltiplas conexões. Por exemplo:

       ```sql
       $> mysqlbinlog copied-binlog.000001 copied-binlog.000002 | mysql -u root -p
       ```

       Para mais informações, veja [Section 4.6.7.3, “Using mysqlbinlog to Back Up Binary Log Files”](mysqlbinlog-backup.html "4.6.7.3 Using mysqlbinlog to Back Up Binary Log Files").

Este método tem a vantagem de que um novo Server fica disponível quase imediatamente; apenas aquelas Transactions que foram commitadas enquanto o snapshot ou dump file estava sendo refeito ainda precisam ser obtidas da source existente. Isso significa que a disponibilidade da replica não é instantânea, mas apenas um período de tempo relativamente curto deve ser necessário para que a replica alcance (catch up) estas poucas Transactions restantes.

Copiar os Binary Logs para o Server de destino antecipadamente é geralmente mais rápido do que ler todo o histórico de execução de Transactions da source em tempo real. No entanto, nem sempre é viável mover esses arquivos para o destino quando necessário, devido ao tamanho ou outras considerações. Os dois métodos restantes para provisionar uma nova replica discutidos nesta seção usam outros meios para transferir informações sobre Transactions para a nova replica.

**Injetando transações vazias.** A variável global [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) da source contém o conjunto de todas as Transactions executadas na source. Em vez de copiar os Binary Logs ao tirar um snapshot para provisionar um novo Server, você pode, em vez disso, anotar o conteúdo de `gtid_executed` no Server do qual o snapshot foi tirado. Antes de adicionar o novo Server à cadeia de replication, simplesmente commite uma Transaction vazia no novo Server para cada Transaction identifier contido no `gtid_executed` da source, desta forma:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';

BEGIN;
COMMIT;

SET GTID_NEXT='AUTOMATIC';
```

Uma vez que todos os Transaction identifiers tenham sido restaurados desta forma usando Transactions vazias, você deve fazer o flush e o purge dos Binary Logs da replica, conforme mostrado aqui, onde *`N`* é o sufixo não zero do nome do Binary Log file atual:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'source-bin.00000N';
```

Você deve fazer isso para evitar que este Server inunde o fluxo de replication com Transactions falsas caso seja promovido a source posteriormente. (A instrução [`FLUSH LOGS`](flush.html#flush-logs) força a criação de um novo arquivo de Binary Log; [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") faz o purge das Transactions vazias, mas retém seus identifiers.)

Este método cria um Server que é essencialmente um snapshot, mas que com o tempo é capaz de se tornar uma source à medida que seu histórico de Binary Log converge com o do fluxo de replication (ou seja, à medida que alcança a source ou sources). Este resultado é semelhante em efeito ao obtido usando o método de provisionamento restante, que discutimos nos próximos parágrafos.

**Excluindo transações com gtid_purged.** A variável global [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) da source contém o conjunto de todas as Transactions que foram purgadas do Binary Log da source. Assim como no método discutido anteriormente (veja [Injetando transações vazias](replication-gtids-failover.html#replication-gtids-failover-empty "Injecting empty transactions")), você pode registrar o valor de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) no Server do qual o snapshot foi tirado (em vez de copiar os Binary Logs para o novo Server). Diferentemente do método anterior, não há necessidade de commitar Transactions vazias (ou de emitir [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement")); em vez disso, você pode definir [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) na replica diretamente, com base no valor de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) no Server do qual o Backup ou snapshot foi tirado.

Assim como no método que usa Transactions vazias, este método cria um Server que é funcionalmente um snapshot, mas que com o tempo é capaz de se tornar uma source à medida que seu histórico de Binary Log converge com o do Server source de replication ou do grupo.

**Restaurando replicas no modo GTID.** Ao restaurar uma replica em uma configuração de replication baseada em GTID que encontrou um Error, injetar uma Transaction vazia pode não resolver o problema porque um Event não possui um GTID.

Use [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") para encontrar a próxima Transaction, que é provavelmente a primeira Transaction no próximo Log file após o Event. Copie tudo até o `COMMIT` para essa Transaction, certificando-se de incluir o `SET @@SESSION.GTID_NEXT`. Mesmo que você não esteja usando replication baseado em Row, você ainda pode executar Binary Log Row Events no Command Line Client.

Pare a replica e execute a Transaction que você copiou. A saída do [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") define o delimiter como `/*!*/;`, então redefina-o:

```sql
mysql> DELIMITER ;
```

Reinicie o replication a partir da posição correta automaticamente:

```sql
mysql> SET GTID_NEXT=automatic;
mysql> RESET SLAVE;
mysql> START SLAVE;
```