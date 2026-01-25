### 5.1.16 O Processo de Shutdown do Server

O processo de Shutdown do Server ocorre da seguinte forma:

1. O processo de Shutdown é iniciado.

   Isso pode ser iniciado de várias maneiras. Por exemplo, um usuário com o privilégio [`SHUTDOWN`](privileges-provided.html#priv_shutdown) pode executar um comando [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). O [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") pode ser usado em qualquer plataforma suportada pelo MySQL. Outros métodos de iniciação de Shutdown específicos do sistema operacional também são possíveis: O Server é encerrado no Unix quando recebe um sinal `SIGTERM`. Um Server rodando como um service no Windows é encerrado quando o gerenciador de services o instrui.

2. O Server cria uma Shutdown Thread, se necessário.

   Dependendo de como o Shutdown foi iniciado, o Server pode criar uma Thread para lidar com o processo de Shutdown. Se o Shutdown foi solicitado por um Client, uma Shutdown Thread é criada. Se o Shutdown for resultado do recebimento de um sinal `SIGTERM`, a Thread de sinal pode lidar com o Shutdown por conta própria, ou pode criar uma Thread separada para fazê-lo. Se o Server tentar criar uma Shutdown Thread e não conseguir (por exemplo, se a memória estiver esgotada), ele emitirá uma mensagem de diagnóstico que aparece no error log:

   ```sql
   Error: Can't create thread to kill server
   ```

3. O Server para de aceitar novas Connections.

   Para evitar que novas atividades sejam iniciadas durante o Shutdown, o Server para de aceitar novas Client Connections, fechando os handlers para as interfaces de rede nas quais ele normalmente escuta por Connections: a porta TCP/IP, o arquivo de Unix socket, o named pipe do Windows e a shared memory no Windows.

4. O Server encerra a atividade atual.

   Para cada Thread associada a uma Client Connection, o Server interrompe a Connection com o Client e marca a Thread como *killed* (encerrada). As Threads morrem quando percebem que estão marcadas dessa forma. Threads para Connections ociosas morrem rapidamente. Threads que estão processando Statements atualmente verificam seu estado periodicamente e demoram mais para morrer. Para obter informações adicionais sobre o encerramento de Threads, consulte [Section 13.7.6.4, “KILL Statement”](kill.html "13.7.6.4 KILL Statement"), em particular para as instruções sobre operações *killed* de [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") ou [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") em tabelas `MyISAM`.

   Para Threads que têm uma transaction aberta, a transaction é *rolled back* (revertida). Se uma Thread estiver atualizando uma tabela não transacional, uma operação como um [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`INSERT`](insert.html "13.2.5 INSERT Statement") de múltiplas linhas pode deixar a tabela parcialmente atualizada porque a operação pode ser encerrada antes da conclusão.

   Se o Server for um *source replication server* (servidor de replicação de origem), ele trata as Threads associadas a Replicas atualmente conectadas como outras Client Threads. Ou seja, cada uma é marcada como *killed* e sai quando verifica seu estado na próxima vez.

   Se o Server for uma Replica, ele interrompe as Threads de I/O e SQL, se estiverem ativas, antes de marcar as Client Threads como *killed*. A SQL Thread é permitida a finalizar seu Statement atual (para evitar causar problemas de Replication) e, em seguida, para. Se a SQL Thread estiver no meio de uma transaction neste ponto, o Server espera até que o grupo de eventos de Replication atual (se houver) termine a execução, ou até que o usuário emita um Statement [`KILL QUERY`](kill.html "13.7.6.4 KILL Statement") ou [`KILL CONNECTION`](kill.html "13.7.6.4 KILL Statement"). Consulte também [Section 13.4.2.6, “STOP SLAVE Statement”](stop-slave.html "13.4.2.6 STOP SLAVE Statement"). Uma vez que Statements não transacionais não podem ser *rolled back*, para garantir Replication *crash-safe* (segura contra falhas), apenas tabelas transacionais devem ser usadas.

   Nota

   Para garantir a segurança contra falhas (*crash safety*) na Replica, você deve executá-la com [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) ativado.

   Consulte também [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")).

5. O Server encerra ou fecha os Storage Engines.

   Nesta fase, o Server *flushes* (descarrega) o table cache e fecha todas as tabelas abertas.

   Cada Storage Engine executa as ações necessárias para as tabelas que gerencia. O `InnoDB` *flushes* seu Buffer Pool para o disco (a menos que [`innodb_fast_shutdown`](innodb-parameters.html#sysvar_innodb_fast_shutdown) seja 2), escreve o LSN atual no tablespace e encerra suas próprias Threads internas. O `MyISAM` *flushes* quaisquer *index writes* pendentes para uma tabela.

6. O Server sai.

Para fornecer informações aos processos de gerenciamento, o Server retorna um dos *exit codes* descritos na lista a seguir. A frase entre parênteses indica a ação tomada pelo *systemd* em resposta ao código, para plataformas nas quais o *systemd* é usado para gerenciar o Server.

* 0 = encerramento bem-sucedido (sem reinício executado)
* 1 = encerramento mal-sucedido (sem reinício executado)
* 2 = encerramento mal-sucedido (reinício executado)