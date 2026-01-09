#### 19.2.4.2 Repositórios de Metadados de Replicação

Um servidor de replicação cria dois repositórios de metadados de replicação: o repositório de metadados de conexão e o repositório de metadados do aplicável. Os repositórios de metadados de replicação sobrevivem ao desligamento de um servidor de replicação. Se a replicação com base na posição do arquivo de log binário estiver em uso, quando a replicação for reiniciada, ela lê os dois repositórios para determinar até onde havia avançado anteriormente na leitura do log binário da fonte e no processamento do seu próprio log de retransmissão. Se a replicação com base no GTID estiver em uso, a replica não usa os repositórios de metadados de replicação para esse propósito, mas precisa deles para os outros metadados que contêm.

* O *repositório de metadados de conexão* do replicação contém informações que o thread de I/O de replicação (receptor) precisa para se conectar ao servidor de origem da replicação e recuperar transações do log binário da fonte. Os metadados neste repositório incluem a configuração de conexão, os detalhes da conta de usuário de replicação, as configurações SSL para a conexão e o nome do arquivo e a posição onde o thread de receptor de replicação está lendo atualmente do log binário da fonte.

* O *repositório de metadados do aplicável* da replicação contém informações que o thread de SQL de replicação (aplicável) precisa para ler e aplicar transações do log de retransmissão da replicação. Os metadados neste repositório incluem o nome do arquivo e a posição até a qual o thread de aplicável de replicação executou as transações no log de retransmissão, e a posição equivalente no log binário da fonte. Também inclui metadados para o processo de aplicação de transações, como o número de threads de trabalhador e a conta `PRIVILEGE_CHECKS_USER` para o canal.

O repositório de metadados de conexão é escrito na tabela `slave_master_info` no esquema do sistema `mysql`, e o repositório de metadados de aplicação é escrito na tabela `slave_relay_log_info` no esquema do sistema `mysql`. Uma mensagem de aviso é emitida se o **mysqld** não conseguir inicializar as tabelas para os repositórios de metadados de replicação, mas a réplica é permitida para continuar iniciando. Esta situação ocorre com maior probabilidade quando se está atualizando de uma versão do MySQL que não suporta o uso de tabelas para os repositórios para uma versão em que elas são suportadas.

Importante

1. Não tente atualizar ou inserir linhas nas tabelas `mysql.slave_master_info` ou `mysql.slave_relay_log_info` manualmente. Isso pode causar comportamento indefinido e não é suportado. A execução de qualquer instrução que exija um bloqueio de escrita em qualquer uma das tabelas `slave_master_info` ou `slave_relay_log_info` é desaconselhada enquanto a replicação estiver em andamento (embora instruções que realizam apenas leituras sejam permitidas a qualquer momento).

2. Os privilégios de acesso para a tabela de repositório de metadados de conexão `mysql.slave_master_info` devem ser restritos ao administrador do banco de dados, pois ela contém o nome da conta de usuário de replicação e a senha para se conectar à fonte. Use um modo de acesso restrito para proteger os backups do banco de dados que incluem esta tabela. Você pode limpar as credenciais da conta de usuário de replicação do repositório de metadados de conexão e, em vez disso, sempre fornecê-las usando uma instrução `START REPLICA` para iniciar o canal de replicação. Esta abordagem significa que o canal de replicação sempre precisa de intervenção do operador para ser reiniciado, mas o nome da conta e a senha não são registrados nos repositórios de metadados de replicação.

`RESET REPLICA` limpa os dados nos repositórios de metadados de replicação, com exceção dos parâmetros de conexão de replicação (dependendo da versão do MySQL Server). Para obter detalhes, consulte a descrição da opção `RESET REPLICA`.

Você pode definir a opção `GTID_ONLY` da instrução `CHANGE REPLICATION SOURCE TO` para impedir que um canal de replicação persista nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação. Isso evita escritas e leituras nas tabelas em situações em que a replicação baseada em GTID não as exija realmente. Com a configuração `GTID_ONLY`, o repositório de metadados de conexão e o repositório de metadados do aplicável não são atualizados quando a replicação de filas e a aplicação de eventos em uma transação são realizadas pela replica ou quando os threads de replicação são iniciados e interrompidos. As posições de arquivo são rastreadas na memória e podem ser visualizadas usando `SHOW REPLICA STATUS` se forem necessárias. Os repositórios de metadados de replicação são sincronizados apenas nas seguintes situações:

* Quando uma instrução `CHANGE REPLICATION SOURCE TO` é emitida.

* Quando uma instrução `RESET REPLICA` é emitida. `RESET REPLICA ALL` exclui, em vez de atualizar, os repositórios, então eles são sincronizados implicitamente.

* Quando um canal de replicação é inicializado.

* Se os repositórios de metadados de replicação forem movidos de arquivos para tabelas.

Criar os repositórios de metadados de replicação como tabelas é o padrão; o uso de arquivos é desaconselhável.

As tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o mecanismo de armazenamento transacional `InnoDB`. As atualizações no repositório de metadados do aplicável são confirmadas junto com as transações, o que significa que as informações de progresso da replica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma parada inesperada do servidor. Para obter informações sobre a combinação de configurações em uma replica que é mais resistente a paradas inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Replica”.

Quando você faz um backup dos dados da replica ou transfere uma instantânea de seus dados para criar uma nova replica, certifique-se de incluir as tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` que contêm os repositórios de metadados de replicação. Para operações de clonagem, note que, quando os repositórios de metadados de replicação são criados como tabelas, eles são copiados para o destinatário durante uma operação de clonagem, mas quando são criados como arquivos, eles não são copiados. Quando a replicação com base na posição do arquivo de log binário está em uso, os repositórios de metadados de replicação são necessários para retomar a replicação após o reinício da replica restaurada, copiada ou clonada. Se você não tiver os arquivos de log de relay, mas ainda tiver o repositório de metadados do aplicável, você pode verificá-lo para determinar até que ponto o thread SQL de replicação foi executado no log binário da fonte. Em seguida, você pode usar uma declaração `CHANGE REPLICATION SOURCE TO` com as opções `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` para dizer à replica para reler os logs binários da fonte a partir desse ponto (desde que os logs binários necessários ainda existam na fonte).

Um repositório adicional, o repositório de metadados do trabalhador de aplicação, é criado principalmente para uso interno e contém informações de status sobre os threads dos trabalhadores em uma replica multithread. O repositório de metadados do trabalhador de aplicação inclui os nomes e posições do arquivo de log de relevo e do arquivo binário de origem para cada thread do trabalhador. Se o repositório de metadados do aplicador for criado como uma tabela, o que é o padrão, o repositório de metadados do trabalhador de aplicação é escrito na tabela `mysql.slave_worker_info`. Se o repositório de metadados do aplicador for escrito em um arquivo, o repositório de metadados do trabalhador de aplicação é escrito no arquivo `worker-relay-log.info`. Para uso externo, as informações de status dos threads dos trabalhadores são apresentadas na tabela `replication_applier_status_by_worker` do Schema de Desempenho.

Os repositórios de metadados de replicação originalmente continham informações semelhantes às mostradas na saída da declaração `SHOW REPLICA STATUS`, que é discutida na Seção 15.4.2, “Declarações SQL para Controlar Servidores de Replica”. Informações adicionais foram posteriormente adicionadas aos repositórios de metadados de replicação que não são exibidas pela declaração `SHOW REPLICA STATUS`.

Para o repositório de metadados de conexão, a tabela a seguir mostra a correspondência entre as colunas na tabela `mysql.slave_master_info`, as colunas exibidas por `SHOW REPLICA STATUS` e as linhas no arquivo obsoleto `master.info`.

<table summary="A correspondência entre as colunas da tabela mysql.slave_master_info, as colunas exibidas pelo comando SHOW REPLICA STATUS e as linhas do arquivo master.info desatualizado.">
<col style="width: 31%"/><col style="width: 40%"/><col style="width: 16%"/><col style="width: 18%"/>
<thead><tr>
<th><code>slave_master_info</code> Coluna da Tabela</th>
<th><code>SHOW REPLICA STATUS</code> Coluna</th>
<th><code>master.info</code> Linha do Arquivo</th>
<th>Descrição</th>
</tr></thead><tbody>
<tr>
<th><code>Número de linhas</code></th>
<td>[Nenhuma]</td>
<td>1</td>
<td>Número de colunas na tabela (ou linhas no arquivo)</td>
</tr>
<tr>
<th><code>Nome do log mestre</code></th>
<td><code>Source_Log_File</code></td>
<td>2</td>
<td>O nome do arquivo de log binário atualmente sendo lido da fonte</td>
</tr>
<tr>
<th><code>Posição do log mestre</code></th>
<td><code>Read_Source_Log_Pos</code></td>
<td>3</td>
<td>A posição atual dentro do log binário que foi lida da fonte</td>
</tr>
<tr>
<th><code>Host</code></th>
<td><code>Source_Host</code></td>
<td>4</td>
<td>O nome do servidor do destino da replicação</td>
</tr>
<tr>
<th><code>Nome do usuário</code></th>
<td><code>Source_User</code></td>
<td>5</td>
<td>O nome da conta de usuário de replicação usada para se conectar à fonte</td>
</tr>
<tr>
<th><code>Senha do usuário</code></th>
<td><code>Password</code> (não exibida em <code>SHOW REPLICA STATUS</code>)</td>
<td>6</td>
<td>A senha da conta de usuário usada para se conectar à fonte</td>
</tr>
<tr>
<th><code>Porta</code></th>
<td><code>Source_Port</code></td>
<td>7</td>
<td>A porta de rede usada para se conectar ao servidor de destino da replicação</td>
</tr>
<tr>
<th><code>Tentativa de reconexão</code></th>
<td><code>Connect_Retry</code></td>
<td>8</td>
<td>O período (em segundos) que a replica espera antes de tentar se reconectar à fonte</td>
</tr>
<tr>
<th><code>Habilitado SSL</code></th>
<td><code>Source_SSL_Allowed</code></td>
<td>9</td>
<td>Se a replica suporta conexões SSL</td>
</tr>
<tr>
<th><code>CA</code></th>
<td><code>Source_SSL_CA_File</code></td>
<td>10</td>
<td>O arquivo usado para o certificado da Autoridade de Certificação (CA)</td>
</tr>
<tr>
<th><code>Caminho da CA</code></th>
<td><code>Source_SSL_CA_Path</code></td>
<td>11</td>
<td>O caminho para o arquivo de certificado da Autoridade de Certificação (CA)</td>
</tr>
<tr>
<th><code>Certificado</code></th>
<td><code>Source_SSL_Cert</code></td>
<td>12</td>
<td>O nome do arquivo de certificado SSL</td>
</tr>
<tr>
<th><code>Cifrador</code></th>
<td><code>Source_SSL_Cipher</code></td>
<td>13</td>
<td>A lista de possíveis cifradores usados no handshake para a conexão SSL</td>
</tr>
<tr>
<th><code>Chave</code></th>
<td><code>Source_SSL_Key</code></td>
<td>14</td>
<td>O nome do arquivo de chave SSL</td>
</tr>
<tr>
<th><code>Verificar certificado do servidor</code></th>
<td><code>Source_

Para o repositório de metadados do aplicativo, a tabela a seguir mostra a correspondência entre as colunas da tabela `mysql.slave_relay_log_info`, as colunas exibidas pelo `SHOW REPLICA STATUS` e as linhas do arquivo desatualizado `relay-log.info`.

<table summary="A correspondência entre as colunas da tabela mysql.slave_relay_log_info, as colunas exibidas pelo comando SHOW REPLICA STATUS e as linhas no arquivo obsoleto relay-log.info."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th><code>slave_relay_log_info</code> Coluna da Tabela</th> <th><code>SHOW REPLICA STATUS</code> Coluna</th> <th>Linha no arquivo <code>relay-log.info</code></th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>Número_de_linhas</code></th> <td>[Nenhum]</td> <td>1</td> <td>Número de colunas na tabela ou linhas no arquivo</td> </tr><tr> <th><code>Nome_do_log_relay</code></th> <td><code>Relay_Log_File</code></td> <td>2</td> <td>O nome do arquivo binário de log da fonte do log relay</td> </tr><tr> <th><code>Pos_do_log_relay</code></th> <td><code>Relay_Log_Pos</code></td> <td>3</td> <td>A posição atual dentro do arquivo binário de log relay; os eventos até essa posição foram executados no banco de dados da replica</td> </tr><tr> <th><code>Nome_do_log_fonte</code></th> <td><code>Relay_Source_Log_File</code></td> <td>4</td> <td>O nome do arquivo binário de log da fonte do log relay a partir do qual os eventos no arquivo binário de log relay foram lidos</td> </tr><tr> <th><code>Pos_do_log_fonte</code></th> <td><code>Exec_Source_Log_Pos</code></td> <td>5</td> <td>A posição equivalente dentro do arquivo binário de log da fonte dos eventos que foram executados na replica</td> </tr><tr> <th><code>Atraso_SQL</code></th> <td><code>SQL_Delay</code></td> <td>6</td> <td>O número de segundos que a replica deve ficar atrasada em relação à fonte</td> </tr><tr> <th><code>Número_de_trabalhadores</code></th> <td>[Nenhum]</td> <td>7</td> <td>O número de threads de trabalho para aplicar transações de replicação em paralelo</td> </tr><tr> <th><code>ID</code></th> <td>[Nenhum]</td> <td>8</td> <td>ID usado para fins internos; atualmente, este é sempre 1</td> </tr><tr> <th><code>Nome_do_canal</code></th> <td><code>Channel_name</code></td> <td>9</td> <td>O nome do canal de replicação</td> </tr><tr> <th><code>Nome_do_usuário_de_verificação_de_privilégios</code></th> <td>[Nenhum]</td> <td>10</td> <td>O nome do usuário para a conta <code>PRIVILEGE_CHECKS_USER</code> do canal</td> </tr><tr> <th><code>Nome_do_host_de_verificação_de_privilégios</code></th> <td>[Nenhum]</td> <td>11</td> <td>O nome do host para a conta <code>PRIVILEGE_CHECKS_USER</code> do canal</td> </tr><tr> <th><code>Exigir_formato_de_linha</code></th> <td>[Nenhum]</td> <td>12</td> <td>Se o canal aceita apenas eventos baseados em linhas</td> </tr><tr> <th><code>Exigir_verificação_de_chave_primaria_da_tabela</code></th> <td>[Nenhum]</td> <td>13</td> <td>A política do canal sobre se as tabelas devem ter chaves primárias para operações <code>CREATE TABLE</code> e <code>ALTER TABLE</code></td> </tr><tr> <th><code>Tipo_de_gtid_para_transações_anônimas</code></th> <td>[Nenhum]</td> <td>14</td> <td>Se o canal atribui um GTID a trans