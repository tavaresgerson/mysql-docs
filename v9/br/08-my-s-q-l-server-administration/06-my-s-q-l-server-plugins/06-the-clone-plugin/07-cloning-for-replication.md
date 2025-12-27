#### 7.6.6.7 Clonagem para Replicação

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai as coordenadas de replicação do servidor MySQL do doador e as transfere para o destinatário, o que permite usar o plugin de clonagem para provisionamento de membros e réplicas da Replicação em Grupo. Usar o plugin de clonagem para provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações.

Os membros da Replicação em Grupo também podem ser configurados para usar o plugin de clonagem como uma opção para recuperação distribuída, caso em que os membros que se juntam automaticamente escolhem a maneira mais eficiente de recuperar os dados do grupo a partir dos membros do grupo existentes. Para mais informações, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

Durante a operação de clonagem, a posição do log binário (nome do arquivo, deslocamento) e o conjunto de GTID `gtid_executed` são extraídos e transferidos do servidor MySQL da instância do doador para o destinatário. Esses dados permitem iniciar a replicação em uma posição consistente no fluxo de replicação. Os logs binários e logs de retransmissão, que são mantidos em arquivos, não são copiados do doador para o destinatário. Para iniciar a replicação, os logs binários necessários para que o destinatário consiga acompanhar o doador não devem ser apagados entre o momento em que os dados são clonados e o momento em que a replicação é iniciada. Se os logs binários necessários não estiverem disponíveis, um erro de aperto de mão de replicação é relatado. Uma instância clonada deve, portanto, ser adicionada a um grupo de replicação sem atraso excessivo para evitar que os logs binários necessários sejam apagados ou que o novo membro fique significativamente para trás, exigindo mais tempo de recuperação.

* Emita essa consulta em uma instância de servidor MySQL clonada para verificar a posição do log binário que foi transferida para o destinatário:

  ```
  mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
  ```

* Realize essa consulta em uma instância de servidor MySQL clonada para verificar o conjunto de GTID `gtid_executed` transferido para o destinatário:

  ```
  mysql> SELECT @@GLOBAL.GTID_EXECUTED;
  ```

Por padrão, os repositórios de metadados de replicação são mantidos em tabelas que são copiados do doador para o destinatário durante a operação de clonagem. Os repositórios de metadados de replicação contêm configurações relacionadas à replicação que podem ser usadas para retomar a replicação corretamente após a operação de clonagem. As tabelas `mysql.slave_master_info`, `mysql.slave_relay_log_info` e `mysql.slave_worker_info` são todas copiados.

Para uma lista do que está incluído em cada tabela, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

Para clonar para replicação, siga os seguintes passos:

1. Para um novo membro do grupo para a Replicação em Grupo, configure primeiro a instância do Servidor MySQL para a Replicação em Grupo, seguindo as instruções na Seção 20.2.1.6, “Adicionar Instâncias ao Grupo”. Também configure os pré-requisitos para clonagem descritos na Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”. Quando você emitir `START GROUP_REPLICATION` no membro que está se juntando, a operação de clonagem é gerenciada automaticamente pela Replicação em Grupo, então você não precisa realizar a operação manualmente e não precisa realizar quaisquer etapas de configuração adicionais no membro que está se juntando.

2. Para uma replica em uma topologia de replicação MySQL fonte/replica, primeiro clone os dados do servidor MySQL doador para o destinatário manualmente. O doador deve ser uma fonte ou replica na topologia de replicação. Para instruções de clonagem, consulte a Seção 7.6.6.3, “Clonagem de Dados Remotas”.

3. Após a operação de clonagem ser concluída com sucesso, se você deseja usar os mesmos canais de replicação no servidor MySQL do destinatário que estavam presentes no doador, verifique quais deles podem retomar a replicação automaticamente na topologia de replicação MySQL de origem/replica, e quais precisam ser configurados manualmente.

* Para a replicação baseada em GTID, se o destinatário estiver configurado com `gtid_mode=ON` e tiver sido clonado a partir de um doador com `gtid_mode=ON`, `ON_PERMISSIVE` ou `OFF_PERMISSIVE`, o GTID `gtid_executed` definido no doador é aplicado no destinatário. Se o destinatário for clonado a partir de uma replica já na topologia, os canais de replicação no destinatário que usam a replicação baseada na posição do arquivo de log binário podem retomar a replicação automaticamente após a operação de clonagem quando o canal for iniciado. Você não precisa realizar nenhuma configuração manual se apenas quiser usar esses mesmos canais.

* Para a replicação baseada na posição do arquivo de log binário, a posição do arquivo de log binário do doador é aplicada no destinatário. Os canais de replicação no destinatário que usam a replicação baseada na posição do arquivo de log binário tentam automaticamente realizar o processo de recuperação do log de retransmissão, usando as informações do log de retransmissão clonado, antes de reiniciar a replicação.

4. Se você precisar configurar canais de replicação clonados manualmente ou quiser usar canais de replicação diferentes no destinatário, as instruções a seguir fornecem um resumo e exemplos abreviados para adicionar uma instância de servidor MySQL do destinatário a uma topologia de replicação. Consulte também as instruções detalhadas que se aplicam à sua configuração de replicação.

* Para adicionar uma instância de servidor MySQL destinatário a uma topologia de replicação MySQL que utiliza transações baseadas em GTID como fonte de dados da replicação, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Adicione canais de replicação para a instância conforme mostrado no exemplo abreviado a seguir. A declaração `CHANGE REPLICATION SOURCE TO` deve definir o endereço do host e o número de porta da fonte, e a opção `SOURCE_AUTO_POSITION` deve estar habilitada, conforme mostrado:

     ```
     CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```

* Para adicionar uma instância de servidor MySQL destinatário a uma topologia de replicação MySQL que utiliza replicação baseada na posição do arquivo de log binário, configure a instância conforme necessário, seguindo as instruções na Seção 19.1.2, “Configurando a Replicação Baseada na Posição do Arquivo de Log Binário”. Adicione canais de replicação para a instância conforme mostrado no exemplo abreviado a seguir, usando a posição do log binário que foi transferida para o destinatário durante a operação de clonagem:

     ```
     SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_LOG_FILE = 'source_log_name',
            SOURCE_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```