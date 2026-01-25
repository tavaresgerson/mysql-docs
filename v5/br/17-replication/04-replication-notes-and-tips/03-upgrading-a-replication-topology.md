### 16.4.3 Atualizando uma Topologia de Replication

Ao atualizar servidores que participam de uma topologia de Replication, você precisa levar em consideração o papel de cada servidor na topologia e observar problemas específicos da Replication. Para informações e instruções gerais sobre a atualização de uma instância de servidor MySQL, consulte [Seção 2.10, “Atualizando MySQL”](upgrading.html "2.10 Atualizando MySQL").

Conforme explicado na [Seção 16.4.2, “Compatibilidade de Replication Entre Versões do MySQL”](replication-compatibility.html "16.4.2 Compatibilidade de Replication Entre Versões do MySQL"), o MySQL suporta Replication de um Source executando uma série de releases para uma Replica executando a próxima série de releases superior, mas não suporta Replication de um Source executando um release posterior para uma Replica executando um release anterior. Uma Replica em um release anterior pode não ter a capacidade necessária para processar transações que podem ser tratadas pelo Source em um release posterior. Portanto, você deve atualizar todas as Replicas em uma topologia de Replication para o release alvo do MySQL Server, antes de atualizar o servidor Source para o release alvo. Dessa forma, você nunca estará na situação em que uma Replica ainda no release anterior está tentando lidar com transações de um Source no release posterior.

Em uma topologia de Replication onde existem múltiplos Sources (multi-source replication), o uso de mais de duas versões do MySQL Server não é suportado, independentemente do número de servidores MySQL Source ou Replica. Essa restrição se aplica não apenas às séries de releases, mas também aos números de versão dentro da mesma série de releases. Por exemplo, você não pode usar MySQL 5.7.22, MySQL 5.7.24 e MySQL 5.7.28 simultaneamente em tal configuração, embora possa usar quaisquer dois desses releases juntos.

Se você precisar fazer o downgrade dos servidores em uma topologia de Replication, o Source deve ter seu downgrade realizado antes que as Replicas sejam rebaixadas. Nas Replicas, você deve garantir que o Binary Log e o Relay Log tenham sido totalmente processados e removê-los antes de prosseguir com o downgrade.

#### Mudanças de Comportamento Entre Releases

Embora essa sequência de atualização esteja correta, ainda é possível encontrar dificuldades de Replication ao replicar de um Source em um release anterior que ainda não foi atualizado, para uma Replica em um release posterior que foi atualizada. Isso pode acontecer se o Source usar statements ou depender de comportamento que não é mais suportado no release posterior instalado na Replica. Você pode usar o utilitário verificador de atualização do MySQL Shell, `util.checkForServerUpgrade()`, para verificar instâncias de servidor MySQL 5.7 ou instâncias de servidor MySQL 8.0 para atualização para um release GA (General Availability) do MySQL 8.0. O utilitário identifica tudo o que precisa ser corrigido para essa instância de servidor para que não cause um problema após a atualização, incluindo recursos e comportamentos que não estão mais disponíveis no release posterior. Consulte [Upgrade Checker Utility](/doc/mysql-shell/8.0/en/mysql-shell-utilities-upgrade.html) para obter informações sobre o utilitário verificador de atualização.

Se você estiver atualizando uma configuração de Replication existente de uma versão do MySQL que não suporta global transaction identifiers (GTIDs) para uma versão que o suporta, somente habilite GTIDs no Source e nas Replicas quando você tiver certeza de que a configuração atende a todos os requisitos para Replication baseada em GTID. Consulte [Seção 16.1.3.4, “Configurando Replication Usando GTIDs”](replication-gtids-howto.html "16.1.3.4 Configurando Replication Usando GTIDs") para obter informações sobre como converter configurações de Replication baseadas na posição de arquivo do Binary Log para usar Replication baseada em GTID.

Mudanças que afetam operações no strict SQL mode ([`STRICT_TRANS_TABLES`] ou [`STRICT_ALL_TABLES`]) podem resultar em falha de Replication em uma Replica atualizada. Se você usar logging baseado em statement ([`binlog_format=STATEMENT`]), se uma Replica for atualizada antes do Source, o Source executa statements que são bem-sucedidos lá, mas que podem falhar na Replica e, assim, fazer com que a Replication pare. Para lidar com isso, interrompa todos os novos statements no Source e espere até que as Replicas os processem (catch up), e então atualize as Replicas. Alternativamente, se você não puder interromper novos statements, altere temporariamente para logging baseado em row no Source ([`binlog_format=ROW`]) e espere até que todas as Replicas tenham processado todos os Binary Logs produzidos até o ponto dessa alteração, e então atualize as Replicas.

O character set padrão mudou de `latin1` para `utf8mb4` no MySQL 8.0. Em uma configuração replicada, ao atualizar do MySQL 5.7 para o 8.0, é aconselhável alterar o character set padrão de volta para o character set usado no MySQL 5.7 antes da atualização. Após a conclusão da atualização, o character set padrão pode ser alterado para `utf8mb4`. Assumindo que os padrões anteriores foram usados, uma maneira de preservá-los é iniciar o servidor com estas linhas no arquivo `my.cnf`:

```sql
[mysqld]
character_set_server=latin1
collation_server=latin1_swedish_ci
```

#### Procedimento de Atualização Padrão

Para atualizar uma topologia de Replication, siga as instruções na [Seção 2.10, “Atualizando MySQL”](upgrading.html "2.10 Atualizando MySQL") para cada instância individual do MySQL Server, usando este procedimento geral:

1. Atualize as Replicas primeiro. Em cada instância de Replica:

   * Realize as verificações e etapas preliminares descritas em [Preparing Your Installation for Upgrade](/doc/refman/8.0/en/upgrade-prerequisites.html).

   * Desligue o MySQL Server.
   * Atualize os binários ou pacotes do MySQL Server.
   * Reinicie o MySQL Server.
   * Se você atualizou para um release anterior ao MySQL 8.0.16, invoque o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") manualmente para atualizar as system tables e os schemas. Quando o servidor estiver executando com global transaction identifiers (GTIDs) habilitados ([`gtid_mode=ON`]), não habilite o Binary Log por [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") (portanto, não use a opção [`--write-binlog`]). Em seguida, desligue e reinicie o servidor.

   * Se você atualizou para o MySQL 8.0.16 ou posterior, não invoque o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"). A partir desse release, o MySQL Server executa todo o procedimento de atualização do MySQL, desabilitando o Binary Log durante a atualização.

   * Reinicie a Replication usando uma instrução [`START REPLICA`](/doc/refman/8.0/en/start-replica.html) ou [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

2. Quando todas as Replicas tiverem sido atualizadas, siga os mesmos passos para atualizar e reiniciar o Source server, com exceção da instrução [`START REPLICA`](/doc/refman/8.0/en/start-replica.html) ou [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"). Se você fez uma alteração temporária para logging baseado em row ou para o character set padrão, você pode reverter a alteração agora.

#### Procedimento de Atualização com Reparo ou Reconstrução de Tabela

Algumas atualizações podem exigir que você descarte e recrie database objects ao passar de uma série do MySQL para a próxima. Por exemplo, alterações de collation podem exigir que os Indexes de tabela sejam reconstruídos. Tais operações, se necessárias, são detalhadas na [Seção 2.10.3, “Changes in MySQL 5.7”](upgrading-from-previous-series.html "2.10.3 Changes in MySQL 5.7"). É mais seguro realizar essas operações separadamente nas Replicas e no Source, e desabilitar a Replication dessas operações do Source para a Replica. Para conseguir isso, use o seguinte procedimento:

1. Pare todas as Replicas e atualize os binários ou pacotes. Reinicie-as com a opção [`--skip-slave-start`], ou a partir do MySQL 8.0.24, a system variable [`skip_slave_start`], para que não se conectem ao Source. Realize quaisquer operações de reparo ou reconstrução de tabela necessárias para recriar database objects, como o uso de `REPAIR TABLE` ou `ALTER TABLE`, ou dump e recarregamento de tabelas ou triggers.

2. Desabilite o Binary Log no Source. Para fazer isso sem reiniciar o Source, execute uma instrução `SET sql_log_bin = OFF`. Alternativamente, pare o Source e reinicie-o com a opção [`--skip-log-bin`]. Se você reiniciar o Source, você também pode querer proibir conexões de cliente. Por exemplo, se todos os clientes se conectam usando TCP/IP, habilite a system variable [`skip_networking`] ao reiniciar o Source.

3. Com o Binary Log desabilitado, execute quaisquer operações de reparo ou reconstrução de tabela necessárias para recriar database objects. O Binary Log deve ser desabilitado durante esta etapa para evitar que essas operações sejam registradas e enviadas às Replicas posteriormente.

4. Reabilite o Binary Log no Source. Se você definiu [`sql_log_bin`] como `OFF` anteriormente, execute uma instrução `SET sql_log_bin = ON`. Se você reiniciou o Source para desabilitar o Binary Log, reinicie-o sem [`--skip-log-bin`] e sem habilitar a system variable [`skip_networking`] para que clientes e Replicas possam se conectar.

5. Reinicie as Replicas, desta vez sem a opção [`--skip-slave-start`] ou a system variable [`skip_slave_start`].