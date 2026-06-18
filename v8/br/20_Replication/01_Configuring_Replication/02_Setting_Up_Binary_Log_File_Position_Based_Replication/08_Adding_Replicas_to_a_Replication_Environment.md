#### 19.1.2.8 Adicionando réplicas a um ambiente de replicação

Você pode adicionar outra replica a uma configuração de replicação existente sem parar o servidor de origem. Para fazer isso, você pode configurar a nova replica copiando o diretório de dados de uma replica existente e atribuindo à nova replica um ID de servidor diferente (que é especificado pelo usuário) e um UUID do servidor (que é gerado durante a inicialização).

Nota

Se o servidor de origem da replicação ou a replica existente que você está copiando para criar a nova replica tiver eventos agendados, certifique-se de que esses eventos sejam desabilitados na nova replica antes de iniciá-la. Se um evento for executado na nova replica e já tiver sido executado na fonte, a operação duplicada causa um erro. O Agendamento de Eventos é controlado pela variável de sistema `event_scheduler`, que tem o valor padrão `ON` a partir do MySQL 8.0, então os eventos que estão ativos no servidor original são executados por padrão quando a nova replica é iniciada. Para impedir que todos os eventos sejam executados na nova replica, defina a variável de sistema `event_scheduler` para `OFF` ou `DISABLED` na nova replica. Alternativamente, você pode usar a instrução `ALTER EVENT` para definir eventos individuais para `DISABLE` ou `DISABLE ON SLAVE` para impedir que sejam executados na nova replica. Você pode listar os eventos em um servidor usando a instrução `SHOW` ou a tabela do Schema de Informações `EVENTS`. Para obter mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Como alternativa para criar uma nova réplica dessa maneira, o plugin de clone do MySQL Server pode ser usado para transferir todos os dados e configurações de replicação de uma réplica existente para um clone. Para obter instruções sobre como usar esse método, consulte a Seção 7.6.7.7, “Clonagem para Replicação”.

Para duplicar uma replica existente sem fazer uma clonagem, siga estes passos:

1. Pare a replica existente e registre as informações do status da replica, especialmente as posições do arquivo binário de log de origem e do arquivo de log de retransmissão. Você pode visualizar o status da replica nas tabelas de replicação do Schema de Desempenho (consulte a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”), ou emitindo `SHOW REPLICA STATUS` da seguinte forma:

   ```
   mysql> STOP SLAVE;
   mysql> SHOW SLAVE STATUS\G
   Or from MySQL 8.0.22:
   mysql> STOP REPLICA;
   mysql> SHOW REPLICA STATUS\G
   ```

2. Desligue a replica existente:

   ```
   $> mysqladmin shutdown
   ```

3. Copie o diretório de dados da replica existente para a nova replica, incluindo os arquivos de log e os arquivos de log de retransmissão. Você pode fazer isso criando um arquivo compactado usando **tar** ou `WinZip`, ou realizando uma cópia direta usando uma ferramenta como **cp** ou **rsync**.

   Importante

   - Antes de copiar, verifique se todos os arquivos relacionados à replica existente estão realmente armazenados no diretório de dados. Por exemplo, os espaços de tabela `InnoDB` do sistema, o espaço de tabela undo e o log de refazer podem estar armazenados em um local alternativo. Os arquivos do espaço de tabela `InnoDB` e os espaços de tabela por arquivo podem ter sido criados em outros diretórios. Os logs binários e logs de retransmissão da replica podem estar em seus próprios diretórios fora do diretório de dados. Verifique as variáveis do sistema que estão configuradas para a replica existente e procure por quaisquer caminhos alternativos que tenham sido especificados. Se encontrar algum, copie esses diretórios também.

   - Durante a cópia, se os arquivos tiverem sido usados para os repositórios de metadados de replicação (consulte a Seção 19.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”), certifique-se de que também copie esses arquivos da replica existente para a nova replica. Se as tabelas tiverem sido usadas para os repositórios, o que é o padrão a partir do MySQL 8.0, as tabelas estão no diretório de dados.

   - Após a cópia, exclua o arquivo `auto.cnf` da cópia do diretório de dados na nova replica, para que a nova replica seja iniciada com um UUID de servidor gerado de forma diferente. O UUID do servidor deve ser único.

   Um problema comum que ocorre ao adicionar novas réplicas é que a nova réplica falha com uma série de mensagens de aviso e erro, como estas:

   ```
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a replica and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

   Essa situação pode ocorrer se a variável de sistema `relay_log` não for especificada, pois os arquivos de log do retransmissor contêm o nome do host como parte de seus nomes de arquivo. Isso também é verdadeiro para o arquivo de índice de log do retransmissor se a variável de sistema `relay_log_index` não for usada. Para obter mais informações sobre essas variáveis, consulte a Seção 19.1.6, “Opções e variáveis de registro binário e replicação”.

   Para evitar esse problema, use o mesmo valor para `relay_log` na nova replica que foi usada na replica existente. Se essa opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin`. Se isso não for possível, copie o arquivo de índice de log de retransmissão da replica existente para a nova replica e defina a variável de sistema `relay_log_index` na nova replica para corresponder ao que foi usado na replica existente. Se essa opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin.index`. Alternativamente, se você já tentou iniciar a nova replica após seguir os passos restantes nesta seção e encontrou erros como os descritos anteriormente, então realize os seguintes passos:

   1. Se você ainda não o fez, emita `STOP REPLICA` na nova réplica.

      Se você já iniciou a replica existente novamente, emita `STOP REPLICA` na replica existente também.

   2. Copie o conteúdo do arquivo de índice de log de retransmissão do replica existente para o arquivo de índice de log de retransmissão da nova replica, garantindo que qualquer conteúdo já existente no arquivo seja sobrescrito.

   3. Prossiga com os passos restantes nesta seção.

4. Quando a cópia estiver concluída, reinicie a replica existente.

5. Na nova réplica, edite a configuração e atribua à nova réplica um ID de servidor único (usando a variável de sistema `server_id`) que não seja usado pela fonte ou por nenhuma das réplicas existentes.

6. Inicie o novo servidor de replicação, garantindo que a replicação ainda não esteja iniciando, especificando a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`. Use as tabelas de replicação do Schema de Desempenho ou emita `SHOW REPLICA STATUS` para confirmar que o novo replica tem as configurações corretas em comparação com o replica existente. Também exiba o ID do servidor e o UUID do servidor e verifique se esses são corretos e únicos para o novo replica.

7. Comece os threads de replicação emitindo uma declaração `START REPLICA`. O novo replica agora usa as informações em seu repositório de metadados de conexão para iniciar o processo de replicação.
