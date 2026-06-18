#### 7.6.7.7 Clonagem para Replicação

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai as coordenadas de replicação do doador e as transfere para o destinatário, o que permite usar o plugin de clonagem para provisionamento de membros e réplicas da Replicação de Grupo. Usar o plugin de clonagem para provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações.

Os membros da replicação em grupo também podem ser configurados para usar o plugin de clone como uma opção para recuperação distribuída, caso em que os membros que se juntam automaticamente escolhem a maneira mais eficiente de recuperar os dados do grupo a partir dos membros existentes do grupo. Para mais informações, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

Durante a operação de clonagem, a posição do log binário (nome do arquivo, deslocamento) e o conjunto de GTID `gtid_executed` são extraídos e transferidos do servidor MySQL do doador para o receptor. Esses dados permitem iniciar a replicação em uma posição consistente no fluxo de replicação. Os logs binários e os logs de retransmissão, que estão armazenados em arquivos, não são copiados do doador para o receptor. Para iniciar a replicação, os logs binários necessários para que o receptor consiga acompanhar o doador não devem ser apagados entre o momento em que os dados são clonados e o momento em que a replicação é iniciada. Se os logs binários necessários não estiverem disponíveis, um erro de aperto de mão de replicação é relatado. Uma instância clonada deve, portanto, ser adicionada a um grupo de replicação sem demora excessiva para evitar que os logs binários necessários sejam apagados ou que o novo membro fique significativamente para trás, exigindo mais tempo de recuperação.

- Emita essa consulta em uma instância de servidor MySQL clonada para verificar a posição do log binário que foi transferido para o destinatário:

  ```
  mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
  ```

- Emita essa consulta em uma instância de servidor MySQL clonada para verificar o GTID `gtid_executed` configurado que foi transferido para o destinatário:

  ```
  mysql> SELECT @@GLOBAL.GTID_EXECUTED;
  ```

Por padrão no MySQL 8.0, os repositórios de metadados de replicação são mantidos em tabelas que são copiadas do doador para o destinatário durante a operação de clonagem. Os repositórios de metadados de replicação armazenam configurações relacionadas à replicação que podem ser usadas para retomar a replicação corretamente após a operação de clonagem.

- No MySQL 8.0.17 e 8.0.18, apenas a tabela `mysql.slave_master_info` (o repositório de metadados de conexão) é copiada.

- A partir do MySQL 8.0.19, as tabelas `mysql.slave_relay_log_info` (o repositório de metadados do aplicável) e `mysql.slave_worker_info` (o repositório de metadados do trabalhador do aplicável) também são copiadas.

Para uma lista do que está incluído em cada tabela, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”. Observe que, se as configurações `master_info_repository=FILE` e `relay_log_info_repository=FILE` forem usadas no servidor (o que não é o padrão no MySQL 8.0 e está desatualizado), os repositórios de metadados de replicação não serão clonados; eles serão clonados apenas se `TABLE` for definido.

Para clonar para replicação, siga os passos abaixo:

1. Para um novo membro do grupo para a replicação em grupo, configure primeiro a instância do servidor MySQL para a replicação em grupo, seguindo as instruções na Seção 20.2.1.6, “Adicionar instâncias ao grupo”. Configure também os pré-requisitos para o clonagem descritos na Seção 20.5.4.2, “Clonagem para recuperação distribuída”. Quando você emitir `START GROUP_REPLICATION` no membro que está se juntando, a operação de clonagem é gerenciada automaticamente pela replicação em grupo, então você não precisa realizar a operação manualmente e não precisa executar mais etapas de configuração no membro que está se juntando.

2. Para uma replica em uma topologia de replicação de fonte/replica do MySQL, primeiro clone os dados do servidor MySQL do doador para o destinatário manualmente. O doador deve ser uma fonte ou replica na topologia de replicação. Para instruções de clonagem, consulte a Seção 7.6.7.3, “Clonagem de Dados Remotas”.

3. Após a operação de clonagem ser concluída com sucesso, se você deseja usar os mesmos canais de replicação no servidor MySQL do destino que estavam presentes no doador, verifique quais deles podem retomar a replicação automaticamente na topologia de replicação MySQL fonte/replica e quais precisam ser configurados manualmente.

   - Para a replicação baseada em GTID, se o destinatário estiver configurado com `gtid_mode=ON` e tiver sido clonado a partir de um doador com `gtid_mode=ON`, `ON_PERMISSIVE` ou `OFF_PERMISSIVE`, o GTID `gtid_executed` do doador é aplicado no destinatário. Se o destinatário for clonado a partir de uma replica já na topologia, os canais de replicação no destinatário que utilizam o posicionamento automático de GTID podem retomar a replicação automaticamente após a operação de clonagem quando o canal for iniciado. Você não precisa realizar nenhuma configuração manual se você apenas quiser usar esses mesmos canais.

   - Para a replicação baseada na posição do arquivo de log binário, se o destinatário estiver no MySQL 8.0.17 ou 8.0.18, a posição do log binário do doador não será aplicada no destinatário, apenas registrada na tabela do Schema de Desempenho `clone_status`. Portanto, os canais de replicação no destinatário que utilizam a replicação baseada na posição do arquivo de log binário devem ser configurados manualmente para retomar a replicação após a operação de clonagem. Certifique-se de que esses canais não estejam configurados para iniciar a replicação automaticamente ao inicializar o servidor, pois eles ainda não possuem a posição do log binário e tentam iniciar a replicação do início.

   - Para a replicação baseada na posição do arquivo de log binário, se o destinatário estiver no MySQL 8.0.19 ou superior, a posição do log binário do doador é aplicada no destinatário. Os canais de replicação no destinatário que usam a replicação baseada na posição do arquivo de log binário tentam automaticamente realizar o processo de recuperação do log de retransmissão, usando as informações clonadas do log de retransmissão, antes de reiniciar a replicação. Para uma replica única (`replica_parallel_workers` ou `slave_parallel_workers` é definido como 0), a recuperação do log de retransmissão deve ser bem-sucedida na ausência de quaisquer outros problemas, permitindo que o canal retome a replicação sem mais configuração. Para uma replica multisserial (`replica_parallel_workers` ou `slave_parallel_workers` é maior que 0), a recuperação do log de retransmissão provavelmente falhará porque geralmente não pode ser concluída automaticamente. Neste caso, uma mensagem de erro é emitida e você deve configurar o canal manualmente.

4. Se você precisar configurar canais de replicação clonados manualmente ou quiser usar canais de replicação diferentes no destinatário, as instruções a seguir fornecem um resumo e exemplos abreviados para adicionar uma instância do servidor MySQL do destinatário a uma topologia de replicação. Consulte também as instruções detalhadas que se aplicam à sua configuração de replicação.

   - Para adicionar uma instância de servidor MySQL do destinatário a uma topologia de replicação MySQL que utiliza transações baseadas em GTID como fonte de dados de replicação, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Adicione canais de replicação para a instância conforme mostrado no exemplo abreviado a seguir. A declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) deve definir o endereço do host e o número de porta da fonte, e a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` deve ser habilitada, conforme mostrado:

     ```
     mysql> CHANGE MASTER TO MASTER_HOST = 'source_host_name', MASTER_PORT = source_port_num,
            ...
            MASTER_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     mysql> START SLAVE USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';

     Or from MySQL 8.0.22 and 8.0.23:

     mysql> CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     mysql> START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```

   - Para adicionar uma instância de servidor MySQL do destinatário a uma topologia de replicação MySQL que utiliza a replicação baseada na posição do arquivo de log binário, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.2, “Configurando a Replicação Baseada na Posição do Arquivo de Log Binário”. Adicione canais de replicação para a instância conforme mostrado no exemplo abreviado a seguir, usando a posição do log binário que foi transferida para o destinatário durante a operação de clonagem:

     ```
     mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     mysql> CHANGE MASTER TO MASTER_HOST = 'source_host_name', MASTER_PORT = source_port_num,
            ...
            MASTER_LOG_FILE = 'source_log_name',
            MASTER_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     mysql> START SLAVE USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';

     Or from MySQL 8.0.22 and 8.0.23:

     mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     mysql> CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_LOG_FILE = 'source_log_name',
            SOURCE_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     mysql> START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```
