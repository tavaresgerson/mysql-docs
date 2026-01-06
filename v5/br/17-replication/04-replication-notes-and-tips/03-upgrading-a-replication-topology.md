### 16.4.3 Atualização de uma topologia de replicação

Ao atualizar servidores que participam de uma topologia de replicação, é necessário levar em consideração o papel de cada servidor na topologia e estar atento a problemas específicos da replicação. Para obter informações gerais e instruções sobre a atualização de uma instância do servidor MySQL, consulte Seção 2.10, “Atualização do MySQL”.

Como explicado na Seção 16.4.2, “Compatibilidade de Replicação Entre Versões do MySQL”, o MySQL suporta a replicação de uma fonte executando uma série de lançamentos para uma réplica executando a série de lançamentos seguinte, mas não suporta a replicação de uma fonte executando um lançamento mais recente para uma réplica executando um lançamento anterior. Uma réplica em uma versão anterior pode não ter a capacidade necessária para processar transações que podem ser gerenciadas pela fonte em uma versão posterior. Portanto, você deve atualizar todas as réplicas em uma topologia de replicação para a versão do servidor MySQL de destino, antes de atualizar o servidor de origem para a versão de destino. Dessa forma, você nunca estará na situação em que uma réplica ainda na versão anterior esteja tentando gerenciar transações de uma fonte na versão posterior.

Em uma topologia de replicação com múltiplas fontes (replicação de múltiplas fontes), o uso de mais de duas versões do MySQL Server não é suportado, independentemente do número de servidores MySQL de origem ou replica. Esta restrição se aplica não apenas às séries de lançamento, mas também aos números de versão dentro da mesma série de lançamento. Por exemplo, você não pode usar MySQL 5.7.22, MySQL 5.7.24 e MySQL 5.7.28 simultaneamente em uma configuração desse tipo, embora você possa usar qualquer uma dessas versões juntas.

Se você precisar desatualizar os servidores em uma topologia de replicação, o servidor de origem deve ser desatualizado antes que as réplicas sejam desatualizadas. Nas réplicas, você deve garantir que o log binário e o log de retransmissão tenham sido processados completamente e removê-los antes de prosseguir com a desatualização.

#### Mudanças de comportamento entre as versões

Embora essa sequência de atualização seja correta, ainda é possível encontrar dificuldades de replicação ao replicar de uma fonte de uma versão anterior que ainda não foi atualizada para uma réplica de uma versão posterior que foi atualizada. Isso pode acontecer se a fonte usar declarações ou depender de comportamentos que não são mais suportados na versão posterior instalada na réplica. Você pode usar o utilitário de verificação de atualização do MySQL Shell `util.checkForServerUpgrade()` para verificar instâncias de servidor MySQL 5.7 ou instâncias de servidor MySQL 8.0 para atualização para uma versão GA do MySQL 8.0. O utilitário identifica tudo o que precisa ser corrigido para aquela instância de servidor para que ela não cause um problema após a atualização, incluindo recursos e comportamentos que não estão mais disponíveis na versão posterior. Consulte Utilitário de Verificação de Atualização para obter informações sobre o utilitário de verificação de atualização.

Se você estiver atualizando uma configuração de replicação existente de uma versão do MySQL que não suporta identificadores de transação global (GTIDs) para uma versão que os suporta, apenas habilite os GTIDs na fonte e nas réplicas quando você tiver certeza de que a configuração atende a todos os requisitos para replicação baseada em GTIDs. Consulte Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs” para obter informações sobre a conversão de configurações de replicação baseadas em posições de arquivo de log binário para replicação baseada em GTIDs.

Alterações que afetam as operações no modo SQL estrito (`STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES`) podem resultar em falha na replicação em uma replica atualizada. Se você usar o registro baseado em instruções (`binlog_format=STATEMENT`), se uma replica for atualizada antes da fonte, a fonte executa instruções que têm sucesso lá, mas podem falhar na replica e, assim, causar o término da replicação. Para lidar com isso, pare todas as novas instruções na fonte e espere até que as réplicas recuperem, depois atualize as réplicas. Alternativamente, se você não puder parar novas instruções, mude temporariamente para o registro baseado em linhas na fonte (`binlog_format=ROW`) e espere até que todas as réplicas tenham processado todos os logs binários produzidos até o ponto desta mudança, depois atualize as réplicas.

O conjunto de caracteres padrão mudou de `latin1` para `utf8mb4` no MySQL 8.0. Em um ambiente replicado, ao atualizar do MySQL 5.7 para 8.0, é recomendável alterar o conjunto de caracteres padrão de volta ao conjunto de caracteres usado no MySQL 5.7 antes da atualização. Após a conclusão da atualização, o conjunto de caracteres padrão pode ser alterado para `utf8mb4`. Supondo que os parâmetros anteriores fossem usados, uma maneira de preservá-los é iniciar o servidor com essas linhas no arquivo `my.cnf`:

```sql
[mysqld]
character_set_server=latin1
collation_server=latin1_swedish_ci
```

#### Procedimento de Atualização Padrão

Para atualizar uma topologia de replicação, siga as instruções na Seção 2.10, “Atualizando o MySQL” para cada instância individual do servidor MySQL, usando este procedimento geral:

1. Atualize as réplicas primeiro. Em cada instância de réplica:

   - Realize os verificações preliminares e os passos descritos em Preparando sua instalação para atualização.

   - Desligue o servidor MySQL.

   - Atualize os binários ou pacotes do MySQL Server.

   - Reinicie o servidor MySQL.

   - Se você atualizou para uma versão anterior ao MySQL 8.0.16, invocar **mysql\_upgrade** manualmente para atualizar as tabelas e esquemas do sistema. Quando o servidor estiver em execução com identificadores de transação global (GTIDs) habilitados (`gtid_mode=ON`), não habilite o registro binário por **mysql\_upgrade** (portanto, não use a opção `--write-binlog`). Em seguida, desligue e reinicie o servidor.

   - Se você atualizou para o MySQL 8.0.16 ou uma versão posterior, não invocar **mysql\_upgrade**. A partir dessa versão, o MySQL Server executa todo o procedimento de atualização do MySQL, desabilitando o registro binário durante a atualização.

   - Reinicie a replicação usando uma declaração `START REPLICA` ou `START SLAVE`.

2. Depois que todas as réplicas forem atualizadas, siga os mesmos passos para atualizar e reiniciar o servidor de origem, com exceção da instrução `START REPLICA` ou `START SLAVE`. Se você fez uma alteração temporária no registro baseado em linhas ou no conjunto de caracteres padrão, você pode reverter a alteração agora.

#### Procedimento de atualização com reparo ou reconstrução da tabela

Algumas atualizações podem exigir que você exclua e recree objetos de banco de dados ao migrar de uma série do MySQL para outra. Por exemplo, alterações na codificação podem exigir que os índices das tabelas sejam reconstruídos. Tais operações, se necessárias, são detalhadas em Seção 2.10.3, “Alterações no MySQL 5.7”. É mais seguro realizar essas operações separadamente nas réplicas e na fonte e desabilitar a replicação dessas operações da fonte para a réplica. Para isso, use o seguinte procedimento:

1. Pare todas as réplicas e atualize os binários ou pacotes. Reinicie-os com a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, para que eles não se conectem à fonte. Realize quaisquer operações de reparo ou reconstrução de tabelas necessárias para recriar objetos de banco de dados, como o uso de `REPAIR TABLE` ou `ALTER TABLE`, ou o dumping e o carregamento de tabelas ou gatilhos.

2. Desative o log binário na fonte. Para fazer isso sem reiniciar a fonte, execute a instrução `SET sql_log_bin = OFF`. Alternativamente, pare a fonte e reinicie-a com a opção `--skip-log-bin`. Se você reiniciar a fonte, também pode querer impedir as conexões dos clientes. Por exemplo, se todos os clientes se conectarem usando TCP/IP, habilite a variável de sistema `skip_networking` ao reiniciar a fonte.

3. Com o log binário desativado, realize quaisquer operações de reparo ou reconstrução de tabelas necessárias para recriar os objetos do banco de dados. O log binário deve ser desativado durante essa etapa para evitar que essas operações sejam registradas e enviadas para as réplicas posteriormente.

4. Reative o log binário na fonte. Se você definiu `sql_log_bin` como `OFF` anteriormente, execute a instrução `SET sql_log_bin = ON`. Se você reiniciou a fonte para desabilitar o log binário, reinicie-a sem `--skip-log-bin` e sem habilitar a variável de sistema `skip_networking` para que os clientes e réplicas possam se conectar.

5. Reinicie as réplicas, desta vez sem a opção `--skip-slave-start` ou a variável de sistema `skip_slave_start`.
