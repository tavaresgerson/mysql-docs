## 1.4 O que há de novo no MySQL 8.4 em relação ao MySQL 8.0

Esta seção resume o que foi adicionado, depreciado, alterado e removido do MySQL 8.4 desde o MySQL 8.0. Uma seção de acompanhamento lista como opções e variáveis do servidor MySQL que foram adicionadas, depreciadas ou removidas no MySQL 8.4; veja Seção 1.5, "Variáveis e opções de servidor e status adicionadas, depreciadas ou removidas no MySQL 8.4 desde o 8.0".

### Características adicionadas ou alteradas no MySQL 8.4

Os seguintes recursos foram adicionados ao MySQL 8.4:

- **Mudanças de autenticação de senha nativa do MySQL.** A partir do MySQL 8.4.0, o plug-in de autenticação depreciado `mysql_native_password` não está mais ativado por padrão. Para ativá-lo, inicie o servidor com `--mysql-native-password=ON` (adicionado no MySQL 8.4.0), ou incluindo `mysql_native_password=ON` na seção `[mysqld]` do seu arquivo de configuração do MySQL (adicionado no MySQL 8.4.0).

  Para mais informações sobre como ativar, usar e desativar o `mysql_native_password`, consulte a Seção 8.4.1.1, "Autenticação Pluggable Nativa".
- **Alterações no valor padrão da variável do sistema InnoDB.** Os valores padrão para várias variáveis do sistema do servidor relacionadas ao motor de armazenamento `InnoDB` foram alterados no MySQL 8.4.0, conforme mostrado na tabela a seguir:

  **Tabela 1.1 Valores padrão das variáveis do sistema InnoDB no MySQL 8.4 diferentes do MySQL 8.0**

  <table>
     <thead>
      <tr>
      <th scope="col">Nome da variável do sistema InnoDB</th>
      <th scope="col">Novo valor padrão (MySQL 8.4)</th>
      <th scope="col">Valor padrão anterior (MySQL 8.0)</th>
      </tr>
     </thead>
     <tbody>
      <tr>
      <th><code>innodb_buffer_pool_size</code></th>
      <td><code>innodb_buffer_pool_size</code> se <code>none</code> para suportado, caso contrário <code>all</code></td>
      <td>Ativado</td>
      </tr>
      <tr>
      <th><code>--innodb-dedicated-server</code></th>
      <td>
      <p>Se <code>ON</code> <= 1 GiB, então <code>innodb_flush_method</code></p>
      <p>Se <code>innodb_redo_log_capacity</code> &gt; 1 GiB, então este é o valor mínimo das seguintes duas dicas calculadas na faixa de 1-64:</p>
      <div>
      <ul style="list-style-type: circle;">
      <li>
      <p>Sugestão de pool: calculada como 1/2 de (<code>OFF</code>/<code>OFF</code>)</p>
      </li>
      <li>
      <p>Dica de CPU: Calculada como 1/4 do número de processadores lógicos disponíveis</p>
      </li>
      </ul>
      </div>
      </td>
      <td>8 (ou 1 se <code>innodb_buffer_pool_size</code> 1 GiB)</td>
      </tr>
      <tr>
      <th><code>OFF</code> <code>innodb_buffer_pool_size</code></th>
      <td><code>none</code></td>
      <td><code>all</code></td>
      </tr>
      <tr>
      <th><code>--innodb-dedicated-server</code></th>
      <td>Se o valor de [<code>ON</code>], o valor de [<code>innodb_flush_method</code>] não é mais alterado como no MySQL 8.0, mas o cálculo de [<code>innodb_redo_log_capacity</code>] é alterado de baseada em memória para baseada em CPU. "Ativação de Configuração InnoDB Automática para um Servidor MySQL Dedicado". (O valor padrão real desta variável é <code>OFF</code>; isso não mudou desde o MySQL 8.0.)</td>
      <td><code>OFF</code></td>
      </tr>
      <tr>
      <th><code>MADV_DONTDUMP</code><code>innodb_buffer_pool_size</code></th>
      <td><code>MADV_DONTDUMP</code><code>innodb_buffer_pool_size</code></td>
      <td><code>MADV_DONTDUMP</code><code>none</code></td>
      </tr>
      <tr>
      <th><code>MADV_DONTDUMP</code><code>all</code></th>
      <td>2</td>
      <td><code>MADV_DONTDUMP</code><code>--innodb-dedicated-server</code> * 2</td>
      </tr>
      <tr>
      <th><code>MADV_DONTDUMP</code><code>ON</code></th>
      <td>128, com a seguinte redacção</td>
      <td><code>MADV_DONTDUMP</code><code>innodb_flush_method</code>, o que significava um padrão de 4</td>
      </tr>
      <tr>
      <th><code>ON</code><code>innodb_buffer_pool_size</code></th>
      <td>10 000 milhões</td>
      <td>200 milhões</td>
      </tr>
      <tr>
      <th><code>ON</code><code>innodb_buffer_pool_size</code></th>
      <td>2 * <code>ON</code><code>none</code></td>
      <td>2 * <code>ON</code><code>all</code>, com um valor por defeito mínimo de 2000</td>
      </tr>
      <tr>
      <th><code>ON</code><code>--innodb-dedicated-server</code></th>
      <td>67108864 (64 MiB)</td>
      <td>16777216 (16 MiB)</td>
      </tr>
      <tr>
      <th><code>ON</code><code>ON</code></th>
      <td><code>ON</code><code>innodb_flush_method</code></td>
      <td><code>ON</code><code>innodb_redo_log_capacity</code></td>
      </tr>
      <tr>
      <th><code>ON</code><code>OFF</code></th>
      <td><code>ON</code><code>OFF</code></td>
      <td>4</td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>innodb_buffer_pool_size</code></th>
      <td>processadores lógicos disponíveis / 8, com um valor por defeito mínimo de 4</td>
      <td>4</td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>innodb_buffer_pool_size</code></th>
      <td>1 se os processadores lógicos disponíveis forem &lt;= 16, caso contrário 4</td>
      <td>4</td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>none</code></th>
      <td>processadores lógicos disponíveis / 2, com um valor por defeito mínimo de 4</td>
      <td>4</td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>all</code></th>
      <td><code>innodb_buffer_pool_instances</code><code>--innodb-dedicated-server</code></td>
      <td><code>innodb_buffer_pool_instances</code><code>ON</code></td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>innodb_flush_method</code></th>
      <td>3% da memória total, com um valor por defeito num intervalo de 1 a 4 GiB</td>
      <td>1073741824 (1 GiB)</td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>innodb_redo_log_capacity</code></th>
      <td>0, o que significa <code>innodb_buffer_pool_instances</code><code>OFF</code></td>
      <td>1073741824 (1 GiB)</td>
      </tr>
      <tr>
      <th><code>innodb_buffer_pool_instances</code><code>OFF</code> (Deprecado no MySQL 8.0.26)</th>
      <td><code>innodb_buffer_pool_size</code><code>innodb_buffer_pool_size</code></td>
      <td><code>innodb_buffer_pool_size</code><code>innodb_buffer_pool_size</code></td>
      </tr>
     </tbody>
  </table>

- O requisito de versão do plugin `clone` foi relaxado para permitir uma clonagem entre diferentes lançamentos de pontos na mesma série.

  Por exemplo, uma funcionalidade `clone` agora permite clonar 8.4.0 para 8.4.14 e vice-versa.
- **Autenticação LDAP baseada em SASL no Windows.** No Microsoft Windows, o plugin do servidor para autenticação LDAP baseada em SASL agora é suportado. Isso significa que os clientes do Windows agora podem usar o GSSAPI/Kerberos para autenticar com o plugin `authentication_ldap_sasl_client`.

  Para mais informações, consulte SASL-Based LDAP Authentication (Without Proxying).
- **Replicação do MySQL: `SOURCE_RETRY_COUNT` alteração.** O valor padrão para uma opção `SOURCE_RETRY_COUNT` da instrução `CHANGE REPLICATION SOURCE TO` foi alterado para 10. Isto significa que, usando os valores padrão para esta opção e para `SOURCE_CONNECT_RETRY` (60), a réplica espera 60 segundos entre as tentativas de reconexão, e continua tentando se reconectar a esta taxa por 10 minutos antes do tempo se esgotar e falhar.

  Esta alteração também se aplica ao valor padrão da desatualizada opção de servidor `--master-retry-count`. (Você deve usar `SOURCE_RETRY_COUNT`, em vez disso.)

  Para obter mais informações, ver secção 19.4.9.1, "Conversão de falha de conexão assíncrona para fontes".
- **Replicação do MySQL: GTIDs marcados.** O formato de identificadores globais de transações (GIDs) usado na Replicação do MySQL e na Replicação de Grupo foi estendido para permitir uma identificação de grupos de transações, tornando possível atribuir um nome exclusivo aos GTIDs que pertencem a um grupo específico de transações. Por exemplo, as transações que contêm operações de dados podem ser facilmente distinguidas daquelas decorrentes de operações administrativas simplesmente comparando seus GTIDs.

  O novo formato GTID é `UUID:TAG:NUMBER`, onde `TAG` é uma sequência de até 8 caracteres, que é ativada para definir o valor da variável do sistema `gtid_next` para `AUTOMATIC:TAG`, adicionado nesta versão (veja uma descrição da variável para o formato da tag e outras informações). Esta tag persiste para todas as transações originadas na sessão atual (a menos que alteradas usando `SET gtid_next`), e é aplicada no momento do compromisso para essas transações, ou, quando se usa uma Replicação de Grupo, no momento da certificação. Também é possível definir `gtid_next` para `UUID:TAG:NUMBER` para definir o UUID de uma única transação para um valor arbitrário, com uma atribuição de uma atribuição de forma personalizada.

  O formato original do `UUID:NUMBER` para GTIDs continua a ser suportado inalterado, como implementado em versões anteriores do MySQL; mudanças nas configurações de replicação existentes usando GTIDs não são necessárias.

  Uma definição de `gtid_next` para `AUTOMATIC:TAG` ou `UUID:TAG:NUMBER` requer um novo privilégio `TRANSACTION_GTID_TAG` que é adicionado nesta versão; isso é verdadeiro tanto no servidor de origem quanto para o `PRIVILEGE_CHECKS_APPLIER` para o thread do aplicador de réplica. Isso também significa que um administrador pode agora restringir o uso de `SET @gtid_next=AUTOMATIC:TAG` ou `UUID:TAG:NUMBER` a um conjunto desejado de usuários ou funções do MySQL para que apenas os usuários relacionados a um dado domínio ou dados operacionais possam cometer novas transações com tags atribuídas.

  ::: info Nota
  Ao atualizar de uma versão anterior do MySQL para o MySQL 8.4, quaisquer contas de usuário ou funções que já tenham o privilégio `BINLOG_ADMIN` são automaticamente concedidas o privilégio `TRANSACTION_GTID_TAG`.
  :::

  As funções embutidas `GTID_SUBSET()`, `GTID_SUBTRACT()`, e `WAIT_FOR_EXECUTED_GTID_SET()` são compatíveis com GTIDs marcados.

  Para obter mais informações, consulte as descrições da variável de sistema `gtid_next` e do privilégio `TRANSACTION_GTID_TAG`, bem como a Seção 19.1.4, "Changing GTID Mode on Online Servers".
- **Replicação: `SQL_AFTER_GTIDS` e `MTA`.** Uma opção de instrução `START REPLICA` `SQL_AFTER_GTIDS` agora é compatível com o aplicador multi-threaded. (Anteriormente, quando o `MTA` estava habilitado e o usuário tentou usar essa opção, uma instrução levantou o aviso `ER_MTA_FEATURE_IS_NOT_SUPPORTED`, e uma réplica foi mudada para o modo single-threaded. Isso significa que uma réplica que precisa recuperar transações perdidas agora pode fazê-lo sem perder uma vantagem de desempenho do multithreading.

  Para obter mais informações, consulte a Seção 15.4.2.4, "START REPLICA Statement", bem como uma documentação para uma variável do sistema `replica_parallel_workers`.
- Esta versão adiciona uma opção `--output-as-version` para `mysqldump`. Esta opção permite criar um dump a partir de um servidor MySQL 8.2 ou mais novo que seja compatível com versões mais antigas do MySQL; seu valor, um dos listados aqui, determina a compatibilidade da terminologia de replicação usada no dump:

  - `SERVER`: Obtém uma versão do servidor e usa como versões mais recentes de instruções de replicação e nomes de variáveis compatíveis com essa versão do MySQL.
  - `BEFORE_8_2_0`: A saída é compatível com servidores MySQL executando versões 8.0.23 a 8.1.0, inclusive.
  - `BEFORE_8_0_23`: A saída é compatível com servidores MySQL executando versões anteriores a 8.0.23.

  Ver uma descrição desta opção para mais informações.

  Além disso, um novo valor é adicionado àqueles já permitidos para uma variável do sistema `terminology_use_previous`. `BEFORE_8_2_0` faz com que o servidor imprima `DISABLE ON SLAVE` (agora desatualizado) em vez de `DISABLE ON REPLICA` na saída de `SHOW CREATE EVENT`. O valor existente `BEFORE_8_0_26` agora também tem esse efeito, além dos que já tinha anteriormente.
- O número de versão do MySQL usado em comentários específicos de versão suporta uma versão principal consistindo de um ou dois dígitos; isso significa que uma versão inteira pode ter cinco ou seis dígitos de comprimento.
- **`group_replication_set_as_primary()` e instruções DDL.** A função `group_replication_set_as_primary()` aguarda instruções DDL em andamento, como `ALTER TABLE` quando aguarda que todas as transações sejam concluídas, antes de escolher uma nova primária.
- **O rastreamento de instruções DDL e DCL para `group_replication_set_as_primary()`.** `group_replication_set_as_primary()` agora aguarda que as seguintes instruções sejam concluídas antes de uma nova primária ser eleita:

  - `ALTER DATABASE`
  - `ALTER FUNCTION`
  - `ALTER INSTANCE`
  - `ALTER PROCEDURE`
  - `ALTER SERVER`
  - `ALTER TABLESPACE`
  - `ALTER USER`
  - `ALTER VIEW`
  - `CREATE DATABASE`
  - `CREATE FUNCTION`
  - `CREATE PROCEDURE`
  - `CREATE ROLE`
  - `CREATE SERVER`
  - `CREATE SPATIAL REFERENCE SYSTEM`
  - `CREATE TABLESPACE`
  - `CREATE TRIGGER`
  - `CREATE USER`
  - `CREATE VIEW`
  - `DROP DATABASE`
  - `DROP FUNCTION`
  - `DROP PROCEDURE`
  - `DROP ROLE`
  - `DROP SERVER`
  - `DROP SPATIAL REFERENCE SYSTEM`
  - `DROP TABLESPACE`
  - `DROP TRIGGER`
  - `DROP USER`
  - `DROP VIEW`
  - `GRANT`
  - `RENAME TABLE`
  - `REVOKE`

  Estas são adicionais às instruções adicionadas no MySQL 8.1 ou de outra forma já suportadas a este respeito. Para mais informações, incluindo uma lista de todas essas instruções suportadas no MySQL 8.3, consulte a descrição da função `group_replication_set_as_primary()`.
- A compatibilidade de versão para servidores dentro de grupos foi estendida da seguinte forma:

  Os downgrades em local de servidores dentro de grupos são suportados dentro da série MySQL 8.4 LTS. Por exemplo, um membro de um grupo executando MySQL 8.4.2 pode ser downgraded para MySQL 8.4.0.

  Da mesma forma, uma associação de grupos de versões cruzadas também é suportada dentro da série de versões 8.4. Por exemplo, um servidor executando o MySQL 8.4.0 pode se juntar a um grupo cujos membros atualmente executam o MySQL 8.4.2, assim como um servidor executando o MySQL 8.4.3.
- **Valores padrão das variáveis de replicação de grupo.** Os valores padrão das duas variáveis do sistema do servidor relacionadas à replicação de grupo foram alterados no MySQL 8.4:

  - O valor padrão da variável do sistema `group_replication_consistency` foi alterado para `BEFORE_ON_PRIMARY_FAILOVER` no MySQL 8.4.0. (Anteriormente, era `EVENTUAL`.)
  - O valor padrão da variável do sistema `group_replication_exit_state_action` foi alterado para `OFFLINE_MODE` no MySQL 8.4.0. (Anteriormente, era `READ_ONLY`.)

- Várias variáveis de status específicas foram adicionadas ao plug-in de replicação de grupo que melhoram o diagnóstico e a resolução de problemas de instabilidade de rede, fornecendo estatísticas sobre o uso da rede, mensagens de controle e mensagens de dados para cada membro do grupo.

Como parte deste trabalho, uma nova coluna `MEMBER_FAILURE_SUSPICIONS_COUNT` foi adicionada à tabela `replication_group_communication_information` do Esquema de Desempenho. O conteúdo desta coluna é formatado como uma matriz JSON cujas chaves são os IDs dos membros do grupo e cujos valores são o número de vezes que um membro do grupo foi considerado suspeito. Consulte a descrição desta tabela para obter mais informações.

- **Um novo privilégio é adicionado no MySQL 8.4.0 especificamente para permitir o uso de instruções `FLUSH PRIVILEGES`.** Ao contrário do privilégio `RELOAD`, o privilégio `FLUSH_PRIVILEGES` aplica-se apenas a instruções `FLUSH PRIVILEGES`.

  No MySQL 8.4, o privilégio `RELOAD` continua a ser suportado nesta capacidade para fornecer compatibilidade com versões anteriores.

  Ao atualizar, é realizada uma verificação para ver se há algum usuário com o privilégio `FLUSH_PRIVILEGES`; se não houver nenhum, qualquer usuário com o privilégio `RELOAD` também receberá automaticamente o novo privilégio.

  Se você fizer downgrade do MySQL 8.4 (ou posterior) para uma versão do MySQL que não suporta o privilégio `FLUSH_PRIVILEGES`, um usuário que recebeu anteriormente este privilégio não poderá executar instruções `FLUSH PRIVILEGES` a menos que o usuário tenha o privilégio `RELOAD`.

- **Privilégio `OPTIMIZE_LOCAL_TABLE`.** MySQL 8.4.0 adiciona um novo privilégio `OPTIMIZE_LOCAL_TABLE`. Os usuários devem ter este privilégio para executar as instruções `OPTIMIZE LOCAL TABLE` e `OPTIMIZE NO_WRITE_TO_BINLOG TABLE`.

  Ao atualizar uma série de versões anteriores, os usuários com o privilégio `SYSTEM_USER` recebem automaticamente o privilégio `OPTIMIZE_LOCAL_TABLE`.

- **Mascaramento e desidentificação de dados corporativos do MySQL.** Os componentes de mascaramento de dados adicionaram suporte para especificar um esquema dedicado para armazenar uma tabela interna relacionada e funções de mascaramento. Anteriormente, o esquema do sistema `mysql` fornecia uma única opção de armazenamento. A nova variável somente leitura `component_masking.masking_database` permite definir e persistir um nome de esquema alternativo na inicialização do servidor.

- O componente MySQL Enterprise Data Masking and De-Identification agora inclui a capacidade de liberar os dados não secundários ou uma réplica para uma memória. Isto pode ser feito por qualquer uma das maneiras descritas aqui:

- Uma liberação pode ser realizada pelo usuário a qualquer momento usando uma função `masking_dictionaries_flush()` adicionada nesta versão.

- O componente pode ser configurado para liberar uma memória periodicamente, aproveitando o componente Scheduler, definindo uma nova variável de sistema `component_masking.dictionaries_flush_interval_seconds` para um valor apropriado.

  Para obter mais informações, consulte a Seção 8.5, "Mascaramento e desidentificação de dados corporativos do MySQL" e as descrições desses itens.

- **Atualizações automáticas de histograma.** MySQL 8.4.0 adiciona suporte para atualizações automáticas de histogramas. Quando este recurso está habilitado para um determinado histograma, ele é atualizado sempre que `ANALYZE TABLE` é executado na tabela à qual pertence. Além disso, o recálculo automático de estatísticas persistentes pelo `InnoDB` (consulte a Seção 17.8.10.1, Configurando parâmetros estatísticos do `Persistent Optimizer`) também atualiza o histograma. As atualizações do histograma continuam a usar o mesmo número de buckets com os quais foram originalmente especificados, se houver.

  Você pode ativar esse recurso ao especificar o histograma incluindo uma opção `AUTO UPDATE` para uma instrução `ANALYZE TABLE`. Para desativá-lo, inclua `MANUAL UPDATE`. `MANUAL UPDATE` (sem atualizações automáticas) é o padrão se nenhuma opção for especificada.

- Adicionada uma variável de sistema `tls-certificates-enforced-validation`, que permite que um DBA imponha uma validação de certificado na inicialização do servidor ou ao usar uma instrução `ALTER INSTANCE RELOAD TLS` para recarregar certificados em tempo de execução. Com uma imposição habilitada, uma descoberta de um certificado inválido interrompe uma invocação do servidor na inicialização, evita o carregamento de certificados inválidos em tempo de execução e emite avisos. Para obter mais informações, consulte Configurando uma aplicação de validação de certificado.

- Adicionadas variáveis de sistema do servidor para controlar uma quantidade de tempo que as contas MySQL que se conectam a um servidor MySQL usando autenticação conectável LDAP devem esperar quando o servidor LDAP está inativo ou não responde. O tempo limite padrão passou a ser 30 segundos para as seguintes variáveis de autenticação LDAP simples e baseadas em SASL:

  - `authentication_ldap_simple_connect_timeout`
  - `authentication_ldap_simple_response_timeout`
  - `authentication_ldap_sasl_connect_timeout`
  - `authentication_ldap_sasl_response_timeout`

  Os tempos limite de conexão e resposta são configuráveis por meio das variáveis do sistema somente em plataformas Linux.

- O registro do processo de desligamento foi aprimorado, com a adição de mensagens de inicialização e desligamento para o servidor MySQL, plugins e componentes. Essas mensagens agora também são registradas para fechamento de conexões. Essas adições devem facilitar uma resolução de problemas e uma depuração de problemas, especialmente no caso de o servidor demorar muito para desligar.

Para obter mais informações, consulte a Seção 7.4.2, "O log de erros".

- **Adições às mensagens de inicialização e encerramento do servidor.** Adicionamos os seguintes tipos de mensagens aos processos de inicialização e encerramento do servidor, conforme indicado nesta lista:

- Mensagens de início e término para inicialização do servidor quando o servidor é iniciado com `--initialize` ou `--initialize-insecure`; eles são adicionais e diferentes daqueles mostrados durante uma inicialização e desligamento normais do servidor.

  - Mensagens de início e fim para inicialização do `InnoDB`.
  - Mensagens de início e término para execução do arquivo iniciadas durante uma inicialização do servidor.
  - Mensagens de início e fim para execução de instruções compiladas durante uma inicialização do servidor.
  - Mensagens de início e término para recuperação de falhas durante uma inicialização do servidor (se ocorrer recuperação de falhas).
  - Mensagens de início e término para inicialização de plugins dinâmicos durante uma inicialização do servidor.
  - Mensagens de início e fim da etapa de inicialização dos componentes (aparentes durante uma inicialização do servidor).
  - Mensagens para encerramento de threads de réplica, bem como encerramento normal e forçado de threads de conexão, durante o desligamento do servidor.
  - Mensagens de início e término para desligamento de plugins e componentes durante desligamento do servidor.
  - Informações do código de saída (valor de retorno) com mensagens de desligamento durante uma inicialização ou desligamento e encerramento do servidor)

  Além disso, se o servidor foi construído usando `WITH_SYSTEMD`, o servidor agora inclui todas as mensagens do **systemd** no log de erros.

- Adicionada uma instrução `SHOW PARSE_TREE`, que mostra uma árvore de análise formatada em JSON para uma instrução `SELECT`. Esta declaração se destina apenas para uso em testes e desenvolvimento, e não em produção. Ele está disponível apenas em compilações de depuração ou se o MySQL foi compilado a partir do código-fonte usando uma opção CMake `-DWITH_SHOW_PARSE_TREE` e não está incluído ou suportado em compilações de lançamento.

- **Informações de conexão do plug-in do pool de threads.** Adicionadas informações de conexão do pool de threads ao MySQL Performance Schema, como segue:

- Adicionada uma tabela `tp_connections`, com informações sobre cada conexão do pool de threads.

- Adicionadas as seguintes colunas à tabela `tp_thread_state`: `TIME_OF_ATTACH`, `MARKED_STALLED`, `STATE`, `EVENT_COUNT`, `ACCUMULATED_EVENT_TIME`, `EXEC_COUNT` e `ACCUMULATED_EXEC_TIME`

- Adicionadas as seguintes colunas à tabela `tp_thread_group_state`: `EFFECTIVE_MAX_TRANSACTIONS_LIMIT`, `NUM_QUERY_THREADS`, `TIME_OF_LAST_THREAD_CREATION`, `NUM_CONNECT_HANDLER_THREAD_IN_SLEEP`, `THREADS_BOUND_TO_TRANSACTION`, `QUERY_THREADS_COUNT` e `TIME_OF_EARLIEST_CON_EXPIRE`.

Para obter mais informações, consulte a Seção 7.6.3, "Pool de threads corporativos do MySQL" e a Seção 29.12.16, "Tabelas de pool de threads do esquema de desempenho".

- **Uso da tabela PROCESSLIST do esquema de informações.** Embora uma tabela `INFORMATION_SCHEMA.PROCESSLIST` tenha sido descontinuada no MySQL 8.0.35 e 8.2.0, o interesse permanece em rastrear seu uso. Esta versão adiciona duas variáveis de status do sistema que fornecem informações sobre acessos à tabela `PROCESSLIST`, listadas aqui:

- `Deprecated_use_i_s_processlist_count` fornece uma contagem do número de referências à tabela `PROCESSLIST` em consultas desde uma última inicialização do servidor.

- Este é um valor de carimbo de dados/hora (número de microssegundos Unix).

- **Otimização de tabela de hash para operações de conjunto.** O MySQL 8.2 melhora o desempenho de instruções usando como operações de conjunto `EXCEPT` e `INTERSECT` por meio de uma nova otimização de tabela de hash que é habilitada automaticamente para tais instruções e controlada pela configuração da chave otimizadora `hash_set_operations`; para desativar esta otimização e fazer com que o otimizador use uma antiga otimização de tabela temporária de versões anteriores do MySQL, define este sinalizador como `off`.

A quantidade de memória alocada para esta otimização pode ser controlada definindo o valor da variável de sistema do servidor `set_operations_buffer_size`; aumentar o tamanho do buffer pode melhorar ainda mais o tempo de execução de algumas instruções usando essas operações.

Para obter mais informações, consulte a Secção 10.9.2, "Otimizações comutáveis".

- **WITH_LD CMake opção.** `WITH_LD`: Defina se deve usar o llvm lld ou mold linker, caso contrário, use o linker padrão. `WITH_LD` também substitui a `USE_LD_LLD` CMake opção que foi removida no MySQL 8.3.0.
- **Melhorias no MySQL Enterprise Firewall.** Uma série de melhorias foram feitas desde o MySQL 8.0 para o MySQL Enterprise Firewall.

  - Os procedimentos armazenados fornecidos pelo MySQL Enterprise Firewall agora se comportam de maneira transacional. Quando ocorre um erro durante a execução de um procedimento armazenado de firewall, um erro é relatado e todas as alterações feitas pelo procedimento armazenado até esse momento são revertidas.
  - Os procedimentos armazenados no firewall agora evitam executar combinações desnecessárias de instruções `DELETE` mais `INSERT`, bem como as de operações `INSERT IGNORE` mais `UPDATE`, consumindo menos tempo e menos recursos, tornando-as mais rápidas e eficientes.
  - Procedimentos armazenados baseados no usuário e UDFs, depreciados no MySQL 8.0.26, agora levantam um aviso de depreciação. Especificamente, chamar um dos `sp_set_firewall_mode()` ou `sp_reload_firewall_rules()` gera tal aviso. Veja Procedimentos armazenados do perfil de conta de firewall, bem como Migrar perfis de conta para perfis de grupo, para mais informações.
  - O MySQL Enterprise Firewall agora permite que seu cache de memória seja recarregado periodicamente com dados armazenados nas tabelas do firewall. A variável do sistema `mysql_firewall_reload_interval_seconds` define o cronograma de recarregamento periódico para uso no tempo de execução ou desativa os recarregamentos por padrão. Implementações anteriores recarregavam o cache apenas na inicialização do servidor ou quando o plugin do lado do servidor era reinstalado.
  - Adicionou a variável do sistema do servidor `mysql_firewall_database` para permitir o armazenamento de tabelas internas, funções e procedimentos armazenados em um esquema personalizado.
  - Adicionado o script `uninstall_firewall.sql` para simplificar a remoção de um firewall instalado.

  Para mais informações sobre procedimentos armazenados no firewall, consulte Procedimentos armazenados no MySQL Enterprise Firewall.
- **Autenticação Pluggable.** Suporte adicionado para autenticação no MySQL Server usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos em um contexto WebAuthn. O novo método de autenticação WebAuthn é baseado nos padrões FIDO e FIDO2. Ele usa um par de plugins, `authentication_webauthn` no lado do servidor e `authentication_webauthn_client` no lado do cliente. O plugin de autenticação WebAuthn do lado do servidor é incluído apenas nas distribuições MySQL Enterprise Edition.
- **Migração de keyring.** Migração de um componente de keyring para um plugin de keyring é suportada. Para executar tal migração, use a opção de servidor `--keyring-migration-from-component` introduzida no MySQL 8.4.0, definindo `--keyring-migration-source` como o nome do componente de origem e `--keyring-migration-destination` como o nome do plugin de destino.

  Ver Migração de chaves usando um servidor de migração, para mais informações.
- **MySQL Enterprise Audit.** Adicionado o script `audit_log_filter_uninstall.sql` para simplificar a remoção do MySQL Enterprise Audit.
- **Novas palavras-chave.** Palavras-chave adicionadas no MySQL 8.4 desde o MySQL 8.0. Palavras-chave reservadas são marcadas com (R).

  `AUTO`, `BERNOULLI`, `GTIDS`, `LOG`, `MANUAL` (R), `PARALLEL` (R), `PARSE_TREE`, `QUALIFY` (R), `S3`, e `TABLESAMPLE` (R).
- **Coleta de lixo de certificação de replicação de grupo preventiva.** Uma variável de sistema adicionada no MySQL 8.4.0 `group_replication_preemptive_garbage_collection` permite a coleta de lixo preventiva para a replicação de grupo em execução no modo single-primary, mantendo apenas os conjuntos de gravação para as transações que ainda não foram comprometidas. Isso pode economizar tempo e consumo de memória. Uma variável de sistema adicional `group_replication_preemptive_garbage_collection_rows_threshold` (também introduzida no MySQL 8.4.0) define um limite inferior no número de linhas de certificação necessárias para desencadear a coleta de lixo preventiva, se estiver ativada; o padrão é 100000.

  No modo multi-primário, cada conjunto de gravação nas informações de certificação é necessário desde o momento em que uma transação é certificada até que seja comprometida em todos os membros, o que torna necessário detectar conflitos entre transações.

  Não é possível alterar o modo de replicação de grupo entre mono-primário e multi-primário quando `group_replication_preemptive_garbage_collection` está habilitado.

  Ver a secção 20.7.9, "Monitoramento do uso da memória de replicação em grupo com instrumentação de memória de esquema de desempenho", para obter ajuda na obtenção de informações sobre a memória consumida por este processo.
- **Recuperação de registro de relay.** No MySQL 8.4.0 e posterior, é possível recuperar o registro de *relay* com quaisquer transações incompletas removidas. O registro de relay agora é quando o servidor é iniciado com `--relay-log-recovery=OFF` (o padrão), o que significa que todos os itens a seguir são removidos:

  - Transacções que permanecem incompletas no final do registo de retransmissão
  - Ficheiros de registo de retransmissão que contenham apenas transações incompletas ou partes delas
  - Referências no ficheiro de índice de registo de retransmissão a ficheiros de registo de retransmissão que foram assim eliminados

  Para mais informações, consulte a descrição da variável do sistema do servidor `relay_log_recovery`.
- **Arquivo de histórico de atualização do MySQL.** Como parte do processo de instalação no MySQL 8.4.0 e posterior, um arquivo em formato JSON chamado `mysql_upgrade_history` é criado no diretório de dados do servidor, ou atualizado se já existir. Este arquivo inclui informações sobre a versão do servidor MySQL instalada, quando foi instalada e se o lançamento fazia parte de uma série LTS ou de uma série Innovation.

  Um arquivo típico de `mysql_upgrade_history` pode ter uma aparência parecida com esta (formatação ajustada para leitura):

  ```json
  {
    "file_format":"1",

    "upgrade_history":
    [
      {
        "date":"2024-03-15 22:02:35",
        "version":"8.4.0",
        "maturity":"LTS",
        "initialize":true
      },

      {
        "date":"2024-05-17 17:46:12",
        "version":"8.4.1",
        "maturity":"LTS",
        "initialize":false
      }
    ]
  }
  ```

  Além disso, o processo de instalação agora verifica a presença de um arquivo `mysql_upgrade_info` (deprecado no MySQL 8.0, e não é mais usado). Se encontrado, o arquivo é removido.
- **Opção `--system-command`** A opção `--system-command` para o cliente `mysql`, disponível no MySQL 8.4.3 e posterior, ativa ou desativa o comando `system`.

  Esta opção está habilitada por padrão. Para desativá-la, use `--system-command=OFF` ou `--skip-system-command`, o que faz com que o comando `system` seja rejeitado com um erro.
- **Cliente mysql --commands opção.** O **cliente mysql** `--commands` opção, introduzida no MySQL 8.4.6, permite ou desativa a maioria dos comandos do cliente `mysql`.

  Esta opção está habilitada por padrão. Para desativá-la, inicie o cliente `mysql` com `--commands=OFF` ou `--skip-commands`.
**Subconsultas escalares correlacionadas para tabelas derivadas.** O MySQL 8.4.0 remove uma restrição anterior à transformação de uma subconsulta escalar correlacionada em uma tabela derivada, permitindo que um operando da expressão de igualdade que não continha uma referência externa seja apenas uma simples referência de coluna.

  Isso significa que colunas internas podem ser incluídas em expressões determinísticas, como mostrado aqui:

  ```
  func1(.., funcN(.., inner-column-a, ..), inner-column-b) = outside-expression

  inner-column-a + inner-column-b = outside-expression
  ```

  Por exemplo, a seguinte consulta agora é suportada para otimização:

  ```sql
  SELECT * FROM t1
    WHERE ( SELECT func(t2.a) FROM t2
              WHERE func(t2.a) = t1.a ) > 0;
  ```

  O operando interno não pode conter referências de coluna externa; do mesmo modo, o operando externo não pode conter referências de coluna interna.

  Se a subconsulta transformada tiver agrupamento explícito, a análise de dependência funcional pode ser excessivamente pessimista, resultando em um erro como ERRO 1055 (42000): A expressão #2 da lista `SELECT` não está na cláusula `GROUP BY` e contém uma coluna não agregada .... Para o mecanismo de armazenamento `InnoDB` , a transformação está desativada por padrão (ou seja, a bandeira `subquery_to_derived` da variável `optimizer_switch` não está habilitada); neste caso, essas consultas passam sem levantar nenhum erro, mas também não são transformadas.

### Características depreciadas no MySQL 8.4

Os seguintes recursos estão desatualizados no MySQL 8.4 e podem ser removidos em uma série futura.

Para aplicativos que usam recursos desatualizados no MySQL 8.4 que foram removidos em uma versão posterior do MySQL, instruções podem falhar quando replicadas de uma fonte do MySQL 8.4 para uma réplica executando uma versão posterior, ou podem ter efeitos diferentes na fonte e na réplica.

- **`group_replication_allow_local_lower_version_join()` sistema variável.** A `group_replication_allow_local_lower_version_join` sistema variável está desatualizado, e configurá-lo faz com que um aviso (`ER_WARN_DEPRECATED_SYNTAX_NO_REPLACEMENT`) a ser registrado.

  Você deve esperar que essa variável seja removida em uma versão futura do MySQL. Uma vez que a funcionalidade ativada pela configuração `group_replication_allow_local_lower_version_join` não é mais útil, nenhuma substituição para ela é planejada.
- **Metadados de recuperação de replicação de grupo.** A recuperação de replicação de grupo não depende mais da gravação de eventos de mudança de visão no log binário para marcar mudanças na associação ao grupo; em vez disso, quando todos os membros de um grupo são a versão MySQL 8.3.0 ou posterior, os membros compartilham metadados de recuperação compactados e nenhum evento é registrado (ou atribuído a um GTID) quando um novo membro se junta ao grupo.

  Os metadados de recuperação incluem o ID de visualização GCS, `GTID_SET` de transações certificadas e informações de certificação, bem como uma lista de membros on-line.

  Uma vez que a `View_change_log_event` não desempenha mais um papel na recuperação, a variável do sistema `group_replication_view_change_uuid` não é mais necessária e, portanto, agora está desatualizada; espere sua remoção em uma versão futura do MySQL. Você deve estar ciente de que nenhuma substituição ou alternativa para esta variável ou sua funcionalidade está planejada, e desenvolva seus aplicativos de acordo.
- **A função `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` SQL foi depreciada no MySQL 8.0, e não é mais suportada a partir do MySQL 8.2. Tentando invocar esta função agora causa um erro de sintaxe.

  Em vez de `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, é recomendado que você use `WAIT_FOR_EXECUTED_GTID_SET()`, o que permite que você espere por GTIDS específicos. Isso funciona independentemente do canal de replicação ou do cliente de usuário através do qual as transações especificadas chegam ao servidor.
- **Replicação baseada em GTID e `IGNORE_SERVER_IDS`.** Quando os identificadores globais de transação (GTIDs) são usados para replicação, as transações que já foram aplicadas são automaticamente ignoradas. Isso significa que o `IGNORE_SERVER_IDS` não é compatível com o modo GTID. Se o `gtid_mode` é o `ON`, o `CHANGE REPLICATION SOURCE TO` com uma lista de `IGNORE_SERVER_IDS` não vazia é rejeitado com um erro. Da mesma forma, se qualquer canal de replicação existente foi criado com uma lista de IDs de servidor a serem ignorados, o `SET gtid_mode=ON` também é rejeitado. Antes de iniciar a replicação baseada em GTID, verifique e limpe quaisquer listas de IDs de servidor ignorados nos servidores envolvidos; você pode fazer isso verificando a saída do `SHOW REPLICA STATUS`.

  ```
  CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
  ```

  Para obter mais informações, consulte a secção 19.1.3.7, "Restrições à replicação com GTIDs".
- ** O uso de informações de conjuntos de gravação para detecção de conflitos causou problemas com o rastreamento de dependências; por esta razão, agora limitamos o uso de conjuntos de gravação para verificações de conflitos quando o registro baseado em linhas está em vigor.

  Isso significa que, nesses casos, `binlog_format` deve ser `ROW`, e `MIXED` não é mais suportado.
- A variável do sistema do servidor `expire_logs_days`, depreciada no MySQL 8.0, foi removida. Tentando obter ou definir esta variável no tempo de execução, ou para iniciar `mysqld` com a opção equivalente (`--expire-logs-days`), agora resulta em um erro.

  Em vez de `expire_logs_days`, use `binlog_expire_logs_seconds`, que permite especificar períodos de validade diferentes de (apenas) em um número integral de dias.
- ** Caracteres wildcard em concessões de banco de dados. ** O uso dos caracteres `%` e `_` como wildcards em concessões de banco de dados foi descartado no MySQL 8.2.0. Você deve esperar que a funcionalidade wildcard seja removida em uma versão futura do MySQL e que esses caracteres sempre sejam tratados como literais, como já são sempre que o valor da variável do sistema do servidor `partial_revokes` é `ON`.

  Além disso, o tratamento de `%` pelo servidor como um sinônimo de `localhost` ao verificar privilégios agora também está desatualizado a partir do MySQL 8.2.0 e, portanto, sujeito a remoção em uma versão futura do MySQL.
- ** A opção do servidor `--character-set-client-handshake`, originalmente destinada a ser usada com atualizações de versões muito antigas do MySQL, agora está desatualizada e um aviso é emitido sempre que é usado. Você deve esperar que essa opção seja removida em uma versão futura do MySQL; os aplicativos que dependem dessa opção devem começar a migrar para longe dela o mais rápido possível.
- **Chaves externas não padrão. ** O uso de chaves não únicas ou parciais como chaves externas não é padrão e é depreciado no MySQL. Começando com o MySQL 8.4.0, você deve ativar explicitamente essas chaves definindo `restrict_fk_on_non_standard_key` para `OFF`, ou iniciando o servidor com `--skip-restrict-fk-on-non-standard-key`.

  \[`restrict_fk_on_non_standard_key`] é \[`ON`] por padrão, o que significa que tentar usar uma chave não padrão como uma chave estrangeira em um \[`CREATE TABLE`] ou outra instrução SQL é rejeitado com \[`ER_WARN_DEPRECATED_NON_STANDARD_KEY`].

  As atualizações do MySQL 8.0 são suportadas mesmo se houver tabelas contendo chaves estrangeiras referentes a chaves não únicas ou parciais.

### Características Removidas no MySQL 8.4

Os itens a seguir são obsoletos e foram removidos no MySQL 8.4.

Para aplicativos MySQL 8.3 que usam recursos removidos no MySQL 8.4, instruções podem falhar quando replicadas de uma fonte MySQL 8.3 para uma réplica MySQL 8.4, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, aplicativos que usam recursos removidos no MySQL 8.4 devem ser revisados para evitá-los e usar alternativas quando possível.

- ** Opções e variáveis do servidor removidas. ** Várias opções e variáveis do servidor suportadas em versões anteriores do MySQL foram removidas no MySQL 8.4.

  - No MySQL 8.4 (e posterior), quando réplicas multithreaded estão em uso, a fonte `mysqld` sempre usa conjuntos de gravação para gerar informações de dependência para o log binário; isso tem o mesmo efeito que definir `binlog_transaction_dependency_tracking` para `WRITESET` em versões anteriores do MySQL.
  - No MySQL 8.4 e posterior, a política aplicada durante o processo de recuperação distribuída é sempre marcar um novo membro on-line somente depois de ter recebido, certificado e aplicado todas as transações que ocorreram antes de ele se juntar ao grupo; isso é equivalente a definir o `group_replication_recovery_complete_at` para o `TRANSACTIONS_APPLIED` em versões anteriores do MySQL.
  - `avoid_temporal_upgrade` e `show_old_temporals`: Ambas as variáveis foram depreciadas no MySQL 5.6; nenhuma delas teve qualquer efeito nas versões recentes do MySQL. Ambas as variáveis foram removidas; não há planos para substituir qualquer uma delas.
  - `--no-dd-upgrade`: Desaproveitado no MySQL 8.0.16, agora removido. Use `--upgrade=NONE` em vez disso.
  - `--old` e `--new`: Ambos depreciados no MySQL 8.0.35 e MySQL 8.2.0, e agora removidos.
  - `--language`: Desaproveitado no MySQL 5.5, e agora removido.
  - As opções de servidor `--ssl` e `--admin-ssl`, bem como as variáveis de sistema de servidor `have_ssl` e `have_openssl`, foram depreciadas no MySQL 8.0.26.
  - A variável de sistema `default_authentication_plugin`, depreciada no MySQL 8.0.27, é removida a partir do MySQL 8.4.0. Use `authentication_policy` em seu lugar.

    Como parte da remoção do `default_authentication_plugin`, a sintaxe do `authentication_policy` foi alterada. Veja a descrição do `authentication_policy` para mais informações.
  - **--skip-host-cache opção do servidor. ** Esta opção foi removida; inicie o servidor com `--host-cache-size=0` em vez disso. Veja Seção 7.1.12.3, DNS Lookups and the Host Cache.
  - ** As opções do servidor --innodb e --skip-innodb. ** Estas opções foram removidas. O motor de armazenamento `InnoDB` está sempre ativado e não é possível desativá-lo.
  - **--caracter-set-client-handshake e --old-style-user-limits opções de servidor. ** Estas opções foram anteriormente usadas para compatibilidade com versões muito antigas do MySQL que não são mais suportadas ou mantidas, e, portanto, não servem mais qualquer propósito útil.
  - ** A instrução `FLUSH HOSTS`, depreciada no MySQL 8.0.23, foi removida. Para limpar o cache do host, emita `TRUNCATE TABLE` `performance_schema.host_cache` ou **mysqladmin flush-hosts**.
- ** Opções e variáveis de replicação obsoletas. ** Várias opções e variáveis relacionadas à replicação do MySQL foram depreciadas em versões anteriores do MySQL e foram removidas do MySQL 8.4.

  - `--slave-rows-search-algorithms`: O algoritmo usado pelo aplicador de replicação para procurar linhas de tabela ao aplicar atualizações ou exclusões é agora sempre `HASH_SCAN,INDEX_SCAN`, e não é mais configurável pelo usuário.
  - `log_bin_use_v1_events`: Isso permitiu que os servidores de origem executando o MySQL 5.7 e mais recentes replicassem versões anteriores do MySQL que não são mais suportadas ou mantidas.
  - `--relay-log-info-file`, `--relay-log-info-repository`, `--master-info-file`, `--master-info-repository`: O uso de arquivos para o repositório de metadados do aplicador e o repositório de metadados de conexão foi substituído por tabelas seguras contra falhas, e não é mais suportado. Veja Seção 19.2.4.2, Repositórios de Metadados de Replicação.
  - `transaction_write_set_extraction`
  - `group_replication_ip_whitelist`: Use `group_replication_ip_allowlist` em vez disso.
  - `group_replication_primary_member`: Não é mais necessário; verifique a coluna `MEMBER_ROLE` da tabela do Esquema de Desempenho `replication_group_members` em vez disso.
- ** Replicação da sintaxe do SQL. ** Um número de instruções SQL usadas no MySQL Replication que foram depreciadas em versões anteriores do MySQL não são mais suportadas no MySQL 8.4. Tentando usar qualquer uma dessas instruções agora produz um erro de sintaxe. Estas instruções podem ser divididas em dois grupos: aquelas relacionadas a servidores de origem e aquelas referentes a réplicas, como mostrado aqui:

  Como parte deste trabalho, a opção `DISABLE ON SLAVE` para `CREATE EVENT` e `ALTER EVENT` é agora descartada, e é substituída por `DISABLE ON REPLICA`. O termo correspondente `SLAVESIDE_DISABLED` também é agora descartado, e não é mais usado em descrições de eventos, como na tabela de Esquema de Informação `EVENTS`; `REPLICA_SIDE_DISABLED` é agora mostrado em seu lugar.

  - As instruções que foram removidas, que se relacionam com os servidores de origem de replicação, estão listadas aqui:

    - `CHANGE MASTER TO`: Use `CHANGE REPLICATION SOURCE TO`.
    - `RESET MASTER`: Use `RESET BINARY LOGS AND GTIDS`.
    - `SHOW MASTER STATUS`: Use `SHOW BINARY LOG STATUS`.
    - `PURGE MASTER LOGS`: Use `PURGE BINARY LOGS`.
    - `SHOW MASTER LOGS`: Use `SHOW BINARY LOGS`.
  - As instruções SQL removidas relacionadas às réplicas estão listadas aqui:

    - `START SLAVE`: Use `START REPLICA`.
    - `STOP SLAVE`: Use `STOP REPLICA`.
    - `SHOW SLAVE STATUS`: Use `SHOW REPLICA STATUS`.
    - `SHOW SLAVE HOSTS`: Use `SHOW REPLICAS`.
    - `RESET SLAVE`: Use `RESET REPLICA`.

  Todas as instruções listadas anteriormente foram removidas de programas e arquivos de teste do MySQL, bem como de qualquer outro uso interno.

  Além disso, uma série de opções desatualizadas anteriormente suportadas por `CHANGE REPLICATION SOURCE TO` e `START REPLICA` foram removidas e não são mais aceitas pelo servidor. As opções removidas para cada uma dessas instruções SQL estão listadas a seguir.

  - As opções removidas do `CHANGE REPLICATION SOURCE TO` estão listadas aqui:

    - `MASTER_AUTO_POSITION`: Use `SOURCE_AUTO_POSITION`.
    - `MASTER_HOST`: Use `SOURCE_HOST`.
    - `MASTER_BIND`: Use `SOURCE_BIND`.
    - `MASTER_UseR`: Use `SOURCE_UseR`.
    - `MASTER_PASSWORD`: Use `SOURCE_PASSWORD`.
    - `MASTER_PORT`: Use `SOURCE_PORT`.
    - `MASTER_CONNECT_RETRY`: Use `SOURCE_CONNECT_RETRY`.
    - `MASTER_RETRY_COUNT`: Use `SOURCE_RETRY_COUNT`.
    - `MASTER_DELAY`: Use `SOURCE_DELAY`.
    - `MASTER_SSL`: Use `SOURCE_SSL`.
    - `MASTER_SSL_CA`: Use `SOURCE_SSL_CA`.
    - `MASTER_SSL_CAPATH`: Use `SOURCE_SSL_CAPATH`.
    - `MASTER_SSL_CIPHER`: Use `SOURCE_SSL_CIPHER`.
    - `MASTER_SSL_CRL`: Use `SOURCE_SSL_CRL`.
    - `MASTER_SSL_CRLPATH`: Use `SOURCE_SSL_CRLPATH`.
    - `MASTER_SSL_KEY`: Use `SOURCE_SSL_KEY`.
    - `MASTER_SSL_VERIFY_SERVER_CERT`: Use `SOURCE_SSL_VERIFY_SERVER_CERT`.
    - `MASTER_TLS_VERSION`: Use `SOURCE_TLS_VERSION`.
    - `MASTER_TLS_CIPHERSUITES`: Use `SOURCE_TLS_CIPHERSUITES`.
    - `MASTER_SSL_CERT`: Use `SOURCE_SSL_CERT`.
    - `MASTER_PUBLIC_KEY_PATH`: Use `SOURCE_PUBLIC_KEY_PATH`.
    - `GET_MASTER_PUBLIC_KEY`: Use `GET_SOURCE_PUBLIC_KEY`.
    - `MASTER_HEARTBEAT_PERIOD`: Use `SOURCE_HEARTBEAT_PERIOD`.
    - `MASTER_COMPRESSION_ALGORITHMS`: Use `SOURCE_COMPRESSION_ALGORITHMS`.
    - `MASTER_ZSTD_COMPRESSION_LEVEL`: Use `SOURCE_ZSTD_COMPRESSION_LEVEL`.
    - `MASTER_LOG_FILE`: Use `SOURCE_LOG_FILE`.
    - `MASTER_LOG_POS`: Use `SOURCE_LOG_POS`.
  - As opções removidas da instrução `START REPLICA` estão listadas aqui:

    - `MASTER_LOG_FILE`: Use `SOURCE_LOG_FILE`.
    - `MASTER_LOG_POS`: Use `SOURCE_LOG_POS`.
  - ** Variaveis de sistema e NULL. ** Não é pretendido ou suportado para uma opção de inicialização do servidor MySQL ser definida como NULL (`--my-option=NULL`) e ser interpretada pelo servidor como SQL `NULL`, e não deve ser possível. O MySQL 8.1 (e posterior) especificamente não permite a definição de opções de inicialização para `NULL` desta forma, e rejeita uma tentativa de fazer com um erro. As tentativas de definir as variáveis do sistema do servidor correspondentes para `NULL` usando `SET` ou similares no cliente `mysql` também são rejeitadas.

    As variáveis do sistema de servidores da lista a seguir estão excluídas da restrição descrita:

    - `admin_ssl_ca`
    - `admin_ssl_capath`
    - `admin_ssl_cert`
    - `admin_ssl_cipher`
    - `admin_tls_ciphersuites`
    - `admin_ssl_key`
    - `admin_ssl_crl`
    - `admin_ssl_crlpath`
    - `basedir`
    - `character_sets_dir`
    - `ft_stopword_file`
    - `group_replication_recovery_tls_ciphersuites`
    - `init_file`
    - `lc_messages_dir`
    - `plugin_dir`
    - `relay_log`
    - `relay_log_info_file`
    - `replica_load_tmpdir`
    - `ssl_ca`
    - `ssl_capath`
    - `ssl_cert`
    - `ssl_cipher`
    - `ssl_crl`
    - `ssl_crlpath`
    - `ssl_key`
    - `socket`
    - `tls_ciphersuites`
    - `tmpdir`

    Ver também a secção 7.1.8, "Variaveis do sistema do servidor".
  - ** Identificadores com um sinal inicial de dólar. ** O uso do sinal de dólar (`$`) como o caractere inicial de um identificador não citado foi descartado no MySQL 8.0, e é restrito no MySQL 8.1 e posterior; usando um identificador não citado começando com um sinal de dólar e contendo um ou mais sinais de dólar (além do primeiro) agora gera um erro de sintaxe.

    Os identificadores não cotados que começam com `$` não são afetados por esta restrição se não contiverem caracteres adicionais `$`.

    Ver Secção 11.2, "Nomes de Objetos do Esquema".

  Também como parte deste trabalho, as seguintes variáveis de status de servidor, anteriormente depreciadas, foram removidas.

  - `Com_slave_start`: Use `Com_replica_start`.
  - `Com_slave_stop`: Use `Com_replica_stop`.
  - `Com_show_slave_status`: Use `Com_show_replica_status`.
  - `Com_show_slave_hosts`: Use `Com_show_replicas`.
  - `Com_show_master_status`: Use `Com_show_binary_log_status`.
  - `Com_change_master`: Use `Com_change_replication_source`.

  As variáveis listadas como removidas não aparecem mais na saída de instruções como `SHOW STATUS`.
- ** Plugins. ** Vários plugins foram removidos no MySQL 8.4.0, e estão listados aqui, juntamente com quaisquer variáveis do sistema e outros recursos associados a eles que também foram removidos ou afetados pela remoção do plugin:

  - Plugins `authentication_fido` e `authentication_fido_client`: Use o plug-in `authentication_webauthn` em vez disso. Veja Seção 8.4.1.11, WebAuthn Pluggable Authentication.

    A variável do sistema de servidor `authentication_fido_rp_id`, a opção do cliente `mysql` `--fido-register-factor` e a opção `-DWITH_FIDO` CMake também foram removidas.
  - Plugin `keyring_file`: Use o componente `component_keyring_file` em vez disso. Veja Seção 8.4.4.4, Utilizando o componente\_keyring\_file Componente de Keyring Baseado em Arquivo.

    A variável do sistema `keyring_file_data` também foi removida. Além disso, as opções de CMake `-DINSTALL_MYSQLKEYRINGDIR` e `-DWITH_KEYRING_TEST` foram removidas.
  - `keyring_encrypted_file` plugin: Use o componente `component_keyring_encrypted_file` em vez disso. Veja \[Seção 8.4.4.5, Using the component\_keyring\_encrypted\_file Encrypted File-Based Keyring Component]{keyring-encrypted-file-component.html}.

    As variáveis de sistema `keyring_encrypted_file_data` e `keyring_encrypted_file_password` também foram removidas.
  - `keyring_oci` plug-in: Use o componente `component_keyring_oci` em vez disso. Veja a Seção 8.4.4.9, "Using the Oracle Cloud Infrastructure Vault Keyring Component".

    As seguintes variáveis do sistema de servidor também foram removidas: `keyring_oci_ca_certificate`, `keyring_oci_compartment`, `keyring_oci_encryption_endpoint`, `keyring_oci_key_file`, `keyring_oci_key_fingerprint`, `keyring_oci_management_endpoint`, `keyring_oci_master_key`, `keyring_oci_secrets_endpoint`, `keyring_oci_tenancy`, `keyring_oci_user`, `keyring_oci_vaults_endpoint`, e `keyring_oci_virtual_vault`.
  - Plugin `openssl_udf`: Use o componente MySQL Enterprise Encryption (`component_enterprise_encryption`) em vez disso; veja Seção 8.6, MySQL Enterprise Encryption.
- ** Apoio a cifras fracas. ** Ao configurar conexões criptografadas, o MySQL 8.4.0 e posterior não permitem mais especificar qualquer cifra que não atenda aos seguintes requisitos:

  - Conforme à versão TLS apropriada (TLS v1.2 ou TLSv1.3, conforme o caso)
  - Fornece perfeito sigilo para a frente
  - Utiliza SHA2 em enciframento, certificado ou ambos
  - Utiliza AES em GCM ou quaisquer outros algoritmos ou modos AEAD

  Isto tem implicações para a definição das seguintes variáveis do sistema:

  - `ssl_cipher`
  - `admin_ssl_cipher`
  - `tls_ciphersuites`
  - `admin_tls_ciphersuites`

  Veja as descrições dessas variáveis para seus valores permitidos no MySQL 8.4, e mais informações.

  ::: info Note

  `libmysqlclient` continua a suportar cifras adicionais que não satisfazem essas condições, a fim de manter a capacidade de se conectar a versões mais antigas do MySQL.

  :::
- ** INFORMATION\_SCHEMA.TABLESPACES. ** A tabela `INFORMATION_SCHEMA.TABLESPACES`, que não foi realmente usada, foi depreciada no MySQL 8.0.22 e agora foi removida.

  ::: info Note

  Para tabelas `NDB`, o esquema de informações da tabela `FILES` fornece informações relacionadas ao espaço das tabelas.

  Para tabelas `InnoDB`, o Esquema de Informação das tabelas `INNODB_TABLESPACES` e `INNODB_DATAFILES` fornece metadados do espaço de tabelas.

  :::
- ** A cláusula `ENGINE` para as instruções `DROP TABLESPACE` e `ALTER TABLESPACE` foi desconsiderada no MySQL 8.0. No MySQL 8.4, ela não é mais suportada e causa um erro se você tentar usá-la com `DROP TABLESPACE` ou `ALTER TABLESPACE ... DROP DATAFILE`. `ENGINE` também não é mais suportada para todas as outras variantes do `ALTER TABLESPACE`, com as duas exceções listadas aqui:

  - `ALTER TABLESPACE ... ADD DATAFILE ENGINE={NDB|NDBCLUSTER}`
  - `ALTER UNDO TABLESPACE ... SET {ACTIVE|INACTIVE} ENGINE=INNODB`

  Para mais informações, consulte a documentação relativa a estas declarações.
- ** A cláusula `LOW_PRIORITY` da instrução `LOCK TABLES ... WRITE` não tinha efeito desde o MySQL 5.5, e foi depreciada no MySQL 5.6. Ela não é mais suportada no MySQL 8.4; incluindo-a no `LOCK TABLES` agora causa um erro de sintaxe.
- ** EXPLAIN FORMAT=JSON format versioning. ** Agora é possível escolher entre 2 versões do formato de saída JSON usado pelas instruções `EXPLAIN FORMAT=JSON` usando a variável do sistema do servidor `explain_json_format_version` introduzida nesta versão. A definição desta variável em `1` faz com que o servidor use a Versão 1, que é o formato linear que sempre foi usado para a saída de tais instruções no MySQL 8.2 e anteriores. Este é o valor e o formato padrão no MySQL 8.4. A definição de `explain_json_format_version` em `2` faz com que o formato da Versão 2 seja usado; este formato de saída JSON é baseado em caminhos de acesso e destina-se a fornecer melhor compatibilidade com futuras versões do MySQL Optimizer.

  Para mais informações e exemplos, consulte Obter informações sobre o plano de execução.
- ** Capturing EXPLAIN FORMAT=JSON output. ** `EXPLAIN FORMAT=JSON` foi estendido com uma `INTO` opção, que fornece a capacidade de armazenar JSON-formateado `EXPLAIN` saída em uma variável de usuário onde ele pode ser trabalhado com o uso de funções JSON MySQL, como este:

  ```
  mysql> EXPLAIN FORMAT=JSON INTO @myex SELECT name FROM a WHERE id = 2;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_EXTRACT(@myex, "$.query_block.table.key");
  +------------------------------------------------+
  | JSON_EXTRACT(@myex, "$.query_block.table.key") |
  +------------------------------------------------+
  | "PRIMARY"                                      |
  +------------------------------------------------+
  1 row in set (0.01 sec)
  ```

  Esta opção só pode ser usada se a instrução `EXPLAIN` também contiver `FORMAT=JSON`; caso contrário, um erro de sintaxe resulta. Este requisito não é afetado pelo valor de `explain_format`.

  `INTO` pode ser usado com qualquer declaração explicável com exceção de `EXPLAIN FOR CONNECTION`. Ele não pode ser usado com `EXPLAIN ANALYZE`.

  Para mais informações e exemplos, ver Obter informações sobre o plano de execução.
- ** EXPLIAN FOR SCHEMA. ** Adicionou uma opção `FOR SCHEMA` à instrução `EXPLAIN`. A sintaxe é como mostrado aqui, onde `stmt` é uma instrução explicável:

  ```
  EXPLAIN [options] FOR SCHEMA schema_name stmt
  ```

  Isso faz com que `stmt` seja executado como se estivesse no esquema nomeado.

  `FOR DATABASE` também é suportado como sinônimo.

  Esta opção não é compatível com `FOR CONNECTION`.

  Para mais informações, consulte Obter informações sobre o plano de execução.
- ** Comentários do cliente preservados. ** No MySQL 8.0, a remoção de comentários do cliente `mysql` era o comportamento padrão; o padrão foi alterado para preservar esses comentários.

  Para habilitar a remoção de comentários como foi realizado no MySQL 8.0 e anteriores, inicie o cliente `mysql` com `--skip-comments`.
- ** O uso do modificador `AUTO_INCREMENT` com as colunas `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") nas instruções `CREATE TABLE` e `ALTER TABLE` foi descartado no MySQL 8.0; o suporte para ele foi removido completamente no MySQL 8.4, onde ele levanta `ER_WRONG_FIELD_SPEC` (especificador de coluna incorreto para coluna).

  Antes de atualizar para o MySQL 8.4 a partir de uma série anterior, você \* deve \* corrigir qualquer tabela que contenha uma coluna `FLOAT` ou `DOUBLE` com `AUTO_INCREMENT` para que a tabela não use mais nenhuma delas. Caso contrário, a atualização falha.
- O utilitário **mysql\_ssl\_rsa\_setup**, depreciado no MySQL 8.0.34, foi removido. Para distribuições MySQL compiladas usando OpenSSL, o servidor MySQL pode executar geração automática de arquivos SSL e RSA ausentes na inicialização. Veja a Seção 8.3.3.1, Criando Certificados e Chaves SSL e RSA usando MySQL, para mais informações.
- ** Privilégios do MySQL. ** Adicionado o privilégio `SET_ANY_DEFINER` para criação de objetos definidores e o privilégio `ALLOW_NONEXISTENT_DEFINER` para proteção de objetos órfãos. Juntos, esses privilégios coexistem com o privilégio depreciado `SET_USER_ID`.
- ** Privilégio SET\_USER\_ID. ** O privilégio `SET_USER_ID`, depreciado no MySQL 8.2.0, foi removido. uso em `GRANT` instruções agora causa um erro de sintaxe

  Em vez de `SET_USER_ID`, você pode usar o privilégio `SET_ANY_DEFINER` para criação de objetos definidores, e os privilégios `ALLOW_NONEXISTENT_DEFINER` para proteção de objetos órfãos.

  Ambos os privilégios são necessários para produzir objetos SQL órfãos usando `CREATE PROCEDURE`, `CREATE FUNCTION`, `CREATE TRIGGER`, `CREATE EVENT`, ou `CREATE VIEW`.
- As opções de inicialização do servidor MySQL `--abort-slave-event-count` e `--disconnect-slave-event-count`, anteriormente usadas em testes, foram depreciadas no MySQL 8.0, e foram removidas nesta versão. Tentando iniciar `mysqld` com qualquer uma dessas opções agora resulta em um erro.
- O utilitário **mysql\_upgrade**, desatualizado no MySQL 8.0.16, foi removido.
- ** utilidade mysqlpump. ** A utilidade ** mysqlpump ** juntamente com suas utilidades auxiliares ** lz4\_decompress ** e ** zlib\_decompress **, depreciadas no MySQL 8.0.34, foram removidas. Em vez disso, use ** mysqldump ** ou \[utilidades de despejo do MySQL Shell] ((/doc/mysql-shell/8.4/en/mysql-shell-utilities-dump-instance-schema.html).
- ** Opções obsoletas do CMake. ** As seguintes opções para compilar o servidor com o CMake foram obsoletas e foram removidas:

  - `USE_LD_LLD`: Use `WITH_LD=lld` em vez disso.
  - `WITH_BOOST`, `DOWNLOAD_BOOST`, `DOWNLOAD_BOOST_TIMEOUT`: Essas opções não são mais necessárias; o MySQL agora inclui e usa uma versão em pacote do Boost ao compilar a partir do código-fonte.
- ** Palavras-chave removidas. ** Palavras-chave removidas no MySQL 8.4 desde o MySQL 8.0. Palavras-chave reservadas são marcadas com (R).

  O presente regulamento entra em vigor no vigésimo dia seguinte ao da sua publicação no Jornal Oficial da União Europeia. O presente regulamento entra em vigor no vigésimo dia seguinte ao da publicação no Jornal Oficial da União Europeia.
- ** Prefixos de índice na chave de particionamento. ** Colunas com prefixos de índice foram permitidas na chave de particionamento para uma tabela particionada no MySQL 8.0, e geraram um aviso sem outros efeitos ao criar, alterar ou atualizar uma tabela particionada. Tais colunas não são mais permitidas em tabelas particionadas, e usar tais colunas na chave de particionamento faz com que a instrução `CREATE TABLE` ou `ALTER TABLE` seja rejeitada com um erro.

  Para mais informações, consulte Prefixos de índice de coluna não suportados para particionamento de chaves.
