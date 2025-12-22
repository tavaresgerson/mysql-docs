#### 7.6.7.7 Clonagem para Replicação

O plugin de clone suporta replicação. Além de clonar dados, uma operação de clonagem extrai coordenadas de replicação do doador e as transfere para o destinatário, o que permite o uso do plugin de clone para provisionamento de membros e réplicas de replicação de grupo.

Os membros da Replicação de Grupo também podem ser configurados para usar o plugin clone como uma opção para recuperação distribuída, caso em que os membros que se juntam escolhem automaticamente a maneira mais eficiente de recuperar dados do grupo de membros existentes do grupo.

Durante a operação de clonagem, tanto a posição do log binário (nome de arquivo, offset) quanto o conjunto GTID \[`gtid_executed`] são extraídos e transferidos da instância do servidor MySQL doador para o destinatário. Esses dados permitem iniciar a replicação em uma posição consistente no fluxo de replicação. Os logs binários e os logs de retransmissão, que são mantidos em arquivos, não são copiados do doador para o destinatário. Para iniciar a replicação, os logs binários necessários para o destinatário alcançar o doador não devem ser purgados entre o momento em que os dados são clonados e o momento em que a replicação é iniciada. Se os logs binários necessários não estiverem disponíveis, um erro de aperto de mão de replicação será relatado. Portanto, uma instância clonada deve ser adicionada a um grupo sem demora excessiva para evitar que os logs binários necessários sejam purgados ou o novo membro fique atrasado, exigindo mais tempo de recuperação.

- Executar esta consulta numa instância clonada do servidor MySQL para verificar a posição do registo binário que foi transferido para o destinatário:

  ```
  mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
  ```
- Emite esta consulta em uma instância clonada do servidor MySQL para verificar o conjunto de GTID `gtid_executed` que foi transferido para o destinatário:

  ```
  mysql> SELECT @@GLOBAL.GTID_EXECUTED;
  ```

Por padrão, os repositórios de metadados de replicação são mantidos em tabelas que são copiadas do doador para o destinatário durante a operação de clonagem. Os repositórios de metadados de replicação mantêm configurações de configuração relacionadas à replicação que podem ser usadas para retomar a replicação corretamente após a operação de clonagem. As tabelas `mysql.slave_master_info`, `mysql.slave_relay_log_info`, e `mysql.slave_worker_info` são todas copiadas.

Para uma lista do que está incluído em cada quadro, ver secção 19.2.4.2, "Repositórios de metadados de replicação".

Para clonar para replicação, siga os seguintes passos:

1. Para um novo membro do grupo para Replicação de Grupo, primeiro configure a instância do MySQL Server para Replicação de Grupo, seguindo as instruções na Seção 20.2.1.6, Adição de Instâncias ao Grupo. Também configure os pré-requisitos para clonagem descritos na Seção 20.5.4.2, Clonagem para Recuperação Distribuída. Quando você emite `START GROUP_REPLICATION` no membro que se junta, a operação de clonagem é gerenciada automaticamente pela Replicação de Grupo, então você não precisa realizar a operação manualmente, e você não precisa executar quaisquer outras etapas de configuração no membro que se junta.
2. Para uma réplica em uma topologia de replicação MySQL fonte/replica, primeiro clone os dados da instância do servidor MySQL doador para o destinatário manualmente. O doador deve ser uma fonte ou réplica na topologia de replicação.
3. Após a operação de clonagem ser concluída com sucesso, se você quiser usar os mesmos canais de replicação na instância do servidor MySQL destinatário que estavam presentes no doador, verifique quais deles podem retomar a replicação automaticamente na topologia de replicação MySQL de origem / réplica e quais precisam ser configurados manualmente.

   - Para a replicação baseada em GTID, se o destinatário for configurado com `gtid_mode=ON` e tiver sido clonado de um doador com `gtid_mode=ON`, `ON_PERMISSIVE`, ou `OFF_PERMISSIVE`, o `gtid_executed` GTID definido pelo doador é aplicado ao destinatário. Se o destinatário for clonado de uma réplica já na topologia, os canais de replicação no destinatário que usam o posicionamento automático GTID podem retomar a replicação automaticamente após a operação de clonagem quando o canal é iniciado. Você não precisa executar nenhuma configuração manual se quiser usar esses mesmos canais.
   - Para replicação baseada em posição de arquivo de log binário, a posição de log binário do doador é aplicada ao destinatário. Canais de replicação no destinatário que usam replicação baseada em posição de arquivo de log binário tentam realizar automaticamente o processo de recuperação do log de retransmissão, usando as informações do log de retransmissão clonadas, antes de reiniciar a replicação. Para uma réplica de um único thread (`replica_parallel_workers` é definido como 0), a recuperação do log de retransmissão deve ter sucesso na ausência de quaisquer outros problemas, permitindo que o canal retome a replicação sem mais configuração. Para uma réplica multithread (`replica_parallel_workers` é maior que 0), a recuperação do log de retransmissão provavelmente falhará porque geralmente não pode ser concluída automaticamente. Neste caso, uma mensagem de erro é emitida e você deve configurar o canal manualmente.
4. Se você precisar configurar canais de replicação clonados manualmente, ou quiser usar canais de replicação diferentes no destinatário, as seguintes instruções fornecem um resumo e exemplos abreviados para adicionar uma instância de servidor MySQL destinatário a uma topologia de replicação.

   - Para adicionar uma instância de servidor MySQL destinatário a uma topologia de replicação MySQL que usa transações baseadas em GTID como fonte de dados de replicação, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.3.4, "Configuração de Replicação Usando GTIDs". Adicione canais de replicação para a instância como mostrado no exemplo abreviado a seguir. A instrução `CHANGE REPLICATION SOURCE TO` deve definir o endereço do host e o número de porta da fonte, e a opção `SOURCE_AUTO_POSITION` deve ser ativada, como mostrado:

     ```
     CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```
   - Para adicionar uma instância de servidor MySQL destinatário a uma topologia de replicação MySQL que usa replicação baseada em posição de arquivo de registro binário, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.2, "Configuração de replicação baseada em posição de arquivo de registro binário". Adicione canais de replicação para a instância como mostrado no exemplo abreviado a seguir, usando a posição de log binário que foi transferida para o destinatário durante a operação de clonagem:

     ```
     SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_LOG_FILE = 'source_log_name',
            SOURCE_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```
