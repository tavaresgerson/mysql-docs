#### 16.1.2.6 Adicionando réplicas a uma topologia de replicação

Você pode adicionar outra replica a uma configuração de replicação existente sem parar o servidor de origem. Para fazer isso, você pode configurar a nova replica copiando o diretório de dados de uma replica existente e atribuindo à nova replica um ID de servidor diferente (que é especificado pelo usuário) e um UUID do servidor (que é gerado durante a inicialização).

Para duplicar uma replica existente:

1. Pare a replica existente e registre as informações do status da replica, especialmente os arquivos de log binário da fonte e os arquivos de log de relevo. Você pode visualizar o status da replica nas tabelas de replicação do Schema de Desempenho (consulte Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”), ou executando `SHOW SLAVE STATUS` da seguinte forma:

   ```sql
   mysql> STOP SLAVE;
   mysql> SHOW SLAVE STATUS\G
   ```

2. Desligue a replica existente:

   ```sql
   $> mysqladmin shutdown
   ```

3. Copie o diretório de dados da replica existente para a nova replica, incluindo os arquivos de log e os arquivos de log de retransmissão. Você pode fazer isso criando um arquivo compactado usando **tar** ou **WinZip**, ou realizando uma cópia direta usando uma ferramenta como **cp** ou **rsync**.

   Importante

   - Antes de copiar, verifique se todos os arquivos relacionados à replica existente estão realmente armazenados no diretório de dados. Por exemplo, o espaço de tabela do sistema `InnoDB`, o espaço de tabela de desfazer e o log de refazer podem estar armazenados em um local alternativo. Os arquivos do espaço de tabela `InnoDB` e os espaços de tabela por arquivo podem ter sido criados em outros diretórios. Os logs binários e logs de retransmissão da replica podem estar em seus próprios diretórios fora do diretório de dados. Verifique as variáveis de sistema que estão configuradas para a replica existente e procure por quaisquer caminhos alternativos que tenham sido especificados. Se encontrar algum, copie esses diretórios também.

   - Durante a cópia, se os arquivos tiverem sido usados para os repositórios de metadados de replicação (consulte Seção 16.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”), o que é o padrão no MySQL 5.7, certifique-se de que também copie esses arquivos da replica existente para a nova replica. Se as tabelas tiverem sido usadas para os repositórios, as tabelas estão no diretório de dados.

   - Após a cópia, exclua o arquivo `auto.cnf` da cópia do diretório de dados na nova replica, para que a nova replica seja iniciada com um UUID de servidor gerado de forma diferente. O UUID do servidor deve ser único.

   Um problema comum que ocorre ao adicionar novas réplicas é que a nova réplica falha com uma série de mensagens de aviso e erro, como estas:

   ```sql
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a slave and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

   Essa situação pode ocorrer se a variável de sistema `relay_log` não for especificada, pois os arquivos de log do retransmissor contêm o nome do host como parte de seus nomes de arquivo. Isso também é verdadeiro para o arquivo de índice do log do retransmissor se a variável de sistema `relay_log_index` não for usada. Para obter mais informações sobre essas variáveis, consulte Seção 16.1.6, “Opções e variáveis de registro binário e replicação”.

   Para evitar esse problema, use o mesmo valor para `relay_log` na nova replica que foi usada na replica existente. Se essa opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin`. Se isso não for possível, copie o arquivo de índice do log de replicação da replica existente para a nova replica e defina a variável de sistema `relay_log_index` na nova replica para corresponder ao que foi usado na replica existente. Se essa opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin.index`. Alternativamente, se você já tentou iniciar a nova replica após seguir as etapas restantes nesta seção e encontrou erros como os descritos anteriormente, então realize as etapas a seguir:

   1. Se você ainda não fez isso, execute `STOP SLAVE` na nova réplica.

      Se você já iniciou a replica existente novamente, execute `STOP SLAVE` na replica existente também.

   2. Copie o conteúdo do arquivo de índice de log de retransmissão do replica existente para o arquivo de índice de log de retransmissão da nova replica, garantindo que qualquer conteúdo já existente no arquivo seja sobrescrito.

   3. Prossiga com os passos restantes nesta seção.

4. Quando a cópia estiver concluída, reinicie a replica existente.

5. Na nova réplica, edite a configuração e atribua à nova réplica um ID de servidor único (usando a variável de sistema `server_id`) que não seja usado pela fonte ou por nenhuma das réplicas existentes.

6. Inicie o novo servidor de replicação, especificando a opção `--skip-slave-start` para que a replicação ainda não seja iniciada. Use as tabelas de replicação do Schema de Desempenho ou execute `SHOW SLAVE STATUS` para confirmar que a nova replica tem as configurações corretas em comparação com a replica existente. Além disso, exiba o ID do servidor e o UUID do servidor e verifique se esses valores estão corretos e únicos para a nova replica.

7. Comece os threads de replicação emitindo uma declaração `START SLAVE`:

   ```sql
   mysql> START SLAVE;
   ```

   A nova réplica agora usa as informações no seu repositório de metadados de conexão para iniciar o processo de replicação.
