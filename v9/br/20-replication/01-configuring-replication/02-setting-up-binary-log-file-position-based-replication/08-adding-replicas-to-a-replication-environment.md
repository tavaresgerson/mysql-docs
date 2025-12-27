#### 19.1.2.8 Adicionando Replicas a um Ambiente de Replicação

Você pode adicionar outra replica a uma configuração de replicação existente sem parar o servidor de origem. Para fazer isso, você pode configurar a nova replica copiando o diretório de dados de uma replica existente e atribuindo à nova replica um ID de servidor diferente (que é especificado pelo usuário) e um UUID de servidor (que é gerado durante a inicialização).

Observação

Se o servidor de origem da replicação ou a replica existente que você está copiando para criar a nova replica tiver eventos agendados, certifique-se de que esses eventos sejam desativados na nova replica antes de iniciá-la. Se um evento for executado na nova replica que já foi executado no servidor de origem, a operação duplicada causa um erro. O Agendamento de Eventos é controlado pela variável de sistema `event_scheduler`, que tem o valor padrão `ON`, então os eventos que estão ativos no servidor original são executados por padrão quando a nova replica é iniciada. Para impedir que todos os eventos sejam executados na nova replica, defina a variável de sistema `event_scheduler` para `OFF` ou `DISABLED` na nova replica. Alternativamente, você pode usar a instrução `ALTER EVENT` para definir eventos individuais para `DISABLE` ou `DISABLE ON REPLICA` para impedir que sejam executados na nova replica. Você pode listar os eventos em um servidor usando a instrução `SHOW` ou a tabela `EVENTS` do Schema de Informações. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Como alternativa para criar uma nova replica dessa maneira, o plugin de clone do MySQL Server pode ser usado para transferir todos os dados e configurações de replicação de uma replica existente para um clone. Para instruções sobre como usar esse método, consulte a Seção 7.6.6.7, “Clonagem para Replicação”.

Para duplicar uma replica existente sem clonagem, siga estes passos:

1. Parar a replica existente e registrar as informações do status da replica, especialmente as posições do arquivo binário de log de origem e do arquivo de log de retransmissão. Você pode visualizar o status da replica nas tabelas de replicação do Schema de Desempenho (veja a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”), ou emitindo `SHOW REPLICA STATUS` da seguinte forma:

   ```
   mysql> STOP REPLICA;
   mysql> SHOW REPLICA STATUS\G
   ```

2. Parar a replica existente:

   ```
   $> mysqladmin shutdown
   ```

3. Copiar o diretório de dados da replica existente para a nova replica, incluindo os arquivos de log e os arquivos de log de retransmissão. Você pode fazer isso criando um arquivo de arquivação usando **tar** ou **WinZip**, ou realizando uma cópia direta usando uma ferramenta como **cp** ou **rsync**.

   Importante

   * Antes de copiar, verifique se todos os arquivos relacionados à replica existente estão realmente armazenados no diretório de dados. Por exemplo, o espaço de tabela do sistema `InnoDB`, o espaço de tabela de undo e o log de reescrita podem estar armazenados em um local alternativo. Os arquivos do espaço de tabela `InnoDB` e os espaços de tabela por tabela podem ter sido criados em outros diretórios. Os logs binários e logs de retransmissão da replica podem estar em seus próprios diretórios fora do diretório de dados. Verifique as variáveis de sistema que estão configuradas para a replica existente e procure por quaisquer caminhos alternativos que tenham sido especificados. Se encontrar algum, copie esses diretórios também.

   * Durante a cópia, se os arquivos tiverem sido usados para os repositórios de metadados de replicação (veja a Seção 19.2.4, “Repositórios de Log de Retransmissão e Metadados de Replicação”), certifique-se de que você também copie esses arquivos da replica existente para a nova replica. Se as tabelas tiverem sido usadas para os repositórios (o padrão é que as tabelas estão no diretório de dados.

* Após a cópia, exclua o arquivo `auto.cnf` da cópia do diretório de dados na nova replica, para que a nova replica seja iniciada com um UUID de servidor gerado diferente. O UUID do servidor deve ser único.

Um problema comum que ocorre ao adicionar novas replicas é que a nova replica falha com uma série de mensagens de aviso e erro, como estas:

```
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a replica and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

Esta situação pode ocorrer se a variável de sistema `relay_log` não for especificada, pois os arquivos de log do relay contêm o nome do host como parte de seus nomes de arquivo. Isso também é verdadeiro para o arquivo de índice do log do relay se a variável de sistema `relay_log_index` não for usada. Para obter mais informações sobre essas variáveis, consulte a Seção 19.1.6, “Opções e variáveis de registro binário e replicação”.

Para evitar este problema, use o mesmo valor para `relay_log` na nova replica que foi usado na replica existente. Se esta opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin`. Se isso não for possível, copie o arquivo de índice do log do relay da replica existente para a nova replica e defina a variável de sistema `relay_log_index` na nova replica para corresponder ao que foi usado na replica existente. Se esta opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin.index`. Alternativamente, se você já tentou iniciar a nova replica após seguir os passos restantes nesta seção e encontrou erros como os descritos anteriormente, então realize as seguintes etapas:

1. Se ainda não o fez, execute `STOP REPLICA` na nova replica.

      Se já iniciou a replica existente novamente, execute `STOP REPLICA` na replica existente também.

2. Copie o conteúdo do arquivo de índice de log de retransmissão da replica existente para o arquivo de índice de log de retransmissão da nova replica, certificando-se de sobrescrever qualquer conteúdo já existente no arquivo.

3. Prossiga com os passos restantes nesta seção.
4. Quando a cópia estiver concluída, reinicie a replica existente.
5. Na nova replica, edite a configuração e atribua à nova replica um ID de servidor único (usando a variável de sistema `server_id`) que não seja usado pela fonte ou por nenhuma das replicas existentes.

6. Inicie o servidor da nova replica, garantindo que a replicação ainda não esteja iniciada, especificando `--skip-replica-start`. Use as tabelas de replicação do Schema de Desempenho ou execute `SHOW REPLICA STATUS` para confirmar que a nova replica tem as configurações corretas em comparação com a replica existente. Também exiba o ID do servidor e o UUID do servidor e verifique se esses valores estão corretos e únicos para a nova replica.

7. Inicie os threads da replica executando uma declaração `START REPLICA`. A nova replica agora usa as informações em seu repositório de metadados de conexão para iniciar o processo de replicação.