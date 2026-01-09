## 1.4 O que há de novo no MySQL 8.4 desde o MySQL 8.0

Esta seção resume o que foi adicionado, descontinuado, alterado e removido no MySQL 8.4 desde o MySQL 8.0. Uma seção complementar lista as opções e variáveis do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 8.4; veja a Seção 1.5, “Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 8.4 desde 8.0”.

*  Recursos Adicionados ou Alterações no MySQL 8.4
*  Recursos Descontinuados no MySQL 8.4
*  Recursos Removidos no MySQL 8.4

### Recursos Adicionados ou Alterações no MySQL 8.4

Os seguintes recursos foram adicionados ao MySQL 8.4:

**Mudanças na autenticação nativa do MySQL.**: A partir do MySQL 8.4.0, o plugin de autenticação `mysql_native_password` descontinuado não é mais ativado por padrão. Para ativá-lo, inicie o servidor com `--mysql-native-password=ON` (adicionado no MySQL 8.4.0), ou incluindo `mysql_native_password=ON` na seção `[mysqld]` do seu arquivo de configuração do MySQL (adicionado no MySQL 8.4.0).

Para mais informações sobre como ativar, usar e desativar `mysql_native_password`, consulte a Seção 8.4.1.1, “Autenticação Plugável Nativa”.

**Mudanças no valor padrão da variável do sistema InnoDB.**: Os valores padrão de várias variáveis do sistema do servidor relacionadas ao motor de armazenamento `InnoDB` foram alterados no MySQL 8.4.0, conforme mostrado na tabela a seguir:

**Tabela 1.1 Valores padrão de variáveis do sistema InnoDB no MySQL 8.4 diferentes do MySQL 8.0**

<table>
   <thead>
      <tr>
         <th>Nome da Variável do Sistema InnoDB</th>
         <th>Novo Valor Padrão (MySQL 8.4)</th>
         <th>Valor Padrão Anterior (MySQL 8.0)</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>innodb_buffer_pool_in_core_file</code></th>
         <td><code>OFF</code> se <code>MADV_DONTDUMP</code> for suportado, caso contrário <code>ON</code></td>
         <td><code>ON</code></td>
      </tr>
      <tr>
         <th><code>innodb_buffer_pool_instances</code></th>
         <td>
            <p> Se <code>innodb_buffer_pool_size</code> &lt;= 1 GiB, então <code>innodb_buffer_pool_instances=1</code> </p>
            <p> Se <code>innodb_buffer_pool_size</code> &gt; 1 GiB, então este é o valor mínimo dos seguintes dois hints calculados na faixa de 1-64: </p>
            <div>
               <ul style="list-style-type: circle; ">
                  <li>
                     <p> Hint do buffer pool: Calculado como 1/2 de (<code>innodb_buffer_pool_size</code> / <code>innodb_buffer_pool_chunk_size</code>) </p>
                  </li>
                  <li>
                     <p> Hint de CPU: Calculado como 1/4 do número de processadores lógicos disponíveis </p>
                  </li>
               </ul>
            </div>
         </td>
         <td>8 (ou 1 se <code>innodb_buffer_pool_size</code> &lt; 1 GiB)</td>
      </tr>
      <tr>
         <th><code>innodb_change_buffering</code></th>
         <td><code>none</code></td>
         <td><code>all</code></td>
      </tr>
      <tr>
         <th><code>--innodb-dedicated-server</code></th>
         <td>Se <code>ON</code>, o valor de <code>innodb_flush_method</code> não é mais alterado como no MySQL 8.0, mas o cálculo de <code>innodb_redo_log_capacity</code> é alterado de baseado em memória para baseado em CPU. Para mais informações, consulte Seção 17.8.12, “Habilitar Configuração Automática InnoDB para um Servidor MySQL Dedicado”. (O valor padrão real desta variável é <code>OFF</code>; isso não muda do MySQL 8.0.)</td>
         <td><code>OFF</code></td>
      </tr>
      <tr>
         <th><code>innodb_adaptive_hash_index</code></th>
         <td><code>OFF</code></td>
         <td><code>ON</code></td>
      </tr>
      <tr>
         <th><code>innodb_doublewrite_files</code></th>
         <td>2</td>
         <td><code>innodb_buffer_pool_instances</code> * 2</td>
      </tr>
      <tr>
         <th><code>innodb_doublewrite_pages</code></th>
         <td>128</td>
         <td><code>innodb_write_io_threads</code>, o que significava um valor padrão de 4</td>
      </tr>
      <tr>
         <th><code>innodb_flush_method</code> no Linux</th>
         <td><code>O_DIRECT</code> se suportado, caso contrário <code>fsync</code></td>
         <td>fsync</td>
      </tr>
      <tr>
         <th><code>innodb_io_capacity</code></th>
         <td>10000</td>
         <td>200</td>
      </tr>
      <tr>
         <th><code>innodb_io_capacity_max</code></th>
         <td>2 * <code>innodb_io_capacity</code></td>
         <td>2 * <code>innodb_io_capacity</code>, com um valor padrão mínimo de 2000</td>
      </tr>
      <tr>
         <th><code>innodb_log_buffer_size</code></th>
         <td>67108864 (64 MiB)</td>
         <td>16777216 (16 MiB)</td>
      </tr>
      <tr>
         <th><code>innodb_numa_interleave</code></th>
         <td><code>ON</code></td>
         <td><code>OFF</code></td>
      </tr>
      <tr>
         <th><code>innodb_page_cleaners</code></th>
         <td><code>innodb_buffer_pool_instances</code></td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_parallel_read_threads</code></th>
         <td>processadores lógicos disponíveis / 8, com um valor padrão mínimo de 4</td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_purge_threads</code></th>
         <td>1 se processadores lógicos disponíveis &lt;= 16, caso contrário 4</td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_read_io_threads</code></th>
         <td>processadores lógicos disponíveis / 2, com um valor padrão mínimo de 4</td>
         <td>4</td>
      </tr>
      <tr>
         <th><code>innodb_use_fdatasync</code></th>
         <td><code>ON</code></td>
         <td><code>OFF</code></td>
      </tr>
      <tr>
         <th><code>temptable_max_ram</code></th>
         <td>3% do total de memória, com um valor padrão dentro de uma faixa de 1-4 GiB</td>
         <td>1073741824 (1 GiB)</td>
      </tr>
      <tr>
         <th><code>temptable_max_mmap</code></th>
         <td>0, o que significa <code>OFF</code></td>
         <td>1073741824 (1 GiB)</td>
      </tr>
      <tr>
         <th><code>temptable_use_mmap</code> (Depreciado no MySQL 8.0.26)</th>
         <td><code>OFF</code></td>
         <td><code>ON</code></td>
      </tr>
   </tbody>
</table>

**Plugin de clonagem**: A exigência de versionamento do plugin de clonagem foi relaxada para permitir a clonagem entre diferentes versões pontualmente da mesma série. Em outras palavras, apenas os números das versões principal e secundária devem corresponder, enquanto anteriormente o número da versão pontual também tinha que corresponder.

Por exemplo, a funcionalidade de clonagem agora permite a clonagem de 8.4.0 para 8.4.14 e vice-versa.

**Autenticação LDAP com base em SASL no Windows**: No Microsoft Windows, o plugin do servidor para autenticação LDAP com base em SASL agora é suportado. Isso significa que os clientes do Windows agora podem usar o GSSAPI/Kerberos para autenticar-se com o plugin `authentication_ldap_sasl_client`.

Para mais informações, consulte Autenticação LDAP com base em SASL (sem proxy).

**Replicação MySQL: Mudança no `SOURCE_RETRY_COUNT`**: O valor padrão da opção `SOURCE_RETRY_COUNT` da instrução `CHANGE REPLICATION SOURCE TO` foi alterado para 10. Isso significa que, usando os valores padrão para essa opção e para `SOURCE_CONNECT_RETRY` (60), a replica aguarda 60 segundos entre as tentativas de reconexão e continua tentando reconectar nessa taxa por 10 minutos antes de falhar e ser substituída.

Essa mudança também se aplica ao valor padrão da opção de servidor desatualizada `--master-retry-count`. (Você deve usar `SOURCE_RETRY_COUNT`, em vez disso.)

Para mais informações, consulte Seção 19.4.9.1, "Falha de Conexão Assíncrona para Fontes".

**MySQL Replication: com a tag `GTIDs`**: O formato dos identificadores globais de transações (GIDs) usados na Replicação MySQL e na Replicação por Grupo foi estendido para permitir a identificação de grupos de transações, tornando possível atribuir um nome único aos GTIDs que pertencem a um grupo específico de transações. Por exemplo, as transações que contêm operações de dados podem ser facilmente distinguidas das que resultam de operações administrativas, simplesmente comparando seus GTIDs.

O novo formato de GTID é `UUID:TAG:NUMBER`, onde `TAG` é uma string de até 8 caracteres, que é habilitada definindo o valor da variável de sistema `gtid_next` para `AUTOMATIC:TAG`, adicionada nesta versão (veja a descrição da variável para o formato do tag e outras informações). Esse tag persiste para todas as transações que se originam na sessão atual (a menos que sejam alteradas usando `SET gtid_next`), e é aplicado no momento do commit para essas transações, ou, ao usar a Replicação por Grupo, no momento da certificação. Também é possível definir `gtid_next` para `UUID:TAG:NUMBER` para definir o UUID de uma única transação para um valor arbitrário, juntamente com a atribuição de um tag personalizado. As atribuições de `UUID` e `NUMBER` permanecem inalteradas em relação às versões anteriores do MySQL. Em qualquer caso, o usuário é responsável por garantir que o tag seja único para uma determinada topologia de replicação.

O formato original `UUID:NUMBER` para GTIDs continua sendo suportado inalterado, conforme implementado nas versões anteriores do MySQL; as alterações nas configurações de replicação existentes usando GTIDs não são necessárias.

Definir `gtid_next` para `AUTOMATIC:TAG` ou `UUID:TAG:NUMBER` requer um novo privilégio `TRANSACTION_GTID_TAG`, que é adicionado nesta versão; isso é verdadeiro tanto no servidor de origem quanto para o `PRIVILEGE_CHECKS_APPLIER` para o thread do aplicativo de replica. Isso também significa que um administrador agora pode restringir o uso de `SET @gtid_next=AUTOMATIC:TAG` ou `UUID:TAG:NUMBER` a um conjunto desejado de usuários ou papéis do MySQL, para que apenas esses usuários relacionados a um domínio de dados ou operacional específico possam comprometer novas transações com tags atribuídas.

::: info Nota

Ao atualizar de uma versão anterior do MySQL para o MySQL 8.4, quaisquer contas de usuário ou papéis que já tenham o privilégio `BINLOG_ADMIN` são automaticamente concedidos o privilégio `TRANSACTION_GTID_TAG`.

:::

As funções integradas `GTID_SUBSET()`, `GTID_SUBTRACT()`, e `WAIT_FOR_EXECUTED_GTID_SET()` são compatíveis com GTIDs com tags.

Para mais informações, consulte as descrições da variável de sistema `gtid_next` e do privilégio `TRANSACTION_GTID_TAG`, bem como a Seção 19.1.4, "Mudando o Modo GTID em Servidores Online".

**Replicação: `SQL_AFTER_GTIDS` e `MTA`**: A opção da instrução `START REPLICA` `SQL_AFTER_GTIDS` agora é compatível com o aplicador multiss线程. (Anteriormente, quando o MTA estava habilitado e o usuário tentava usar essa opção, a instrução gerava o aviso `ER_MTA_FEATURE_IS_NOT_SUPPORTED`, e a replica era alternada para o modo single-threaded.) Isso significa que uma replica que precisa recuperar transações perdidas pode agora fazê-lo sem perder a vantagem de desempenho do multithreading.

Para mais informações, consulte a Seção 15.4.2.4, Instrução `START REPLICA`, bem como a documentação da variável de sistema `replica_parallel_workers`. Veja também a Seção 19.2.3.2, "Monitoramento do Aplicador de Replicação de Threads", e a Seção 25.7.11, "Replicação de NDB Cluster Usando o Aplicador Multiss线程".

**Compatibilidade reversa da terminologia de replicação**: Este lançamento adiciona a opção `--output-as-version` para `mysqldump`. Essa opção permite criar um dump de um servidor MySQL 8.2 ou posterior que é compatível com versões mais antigas do MySQL; seu valor, um dos listados aqui, determina a compatibilidade da terminologia de replicação usada no dump:

* `SERVER`: Obtém a versão do servidor e utiliza as versões mais recentes das declarações de replicação e nomes de variáveis compatíveis com essa versão do MySQL.
* `BEFORE_8_2_0`: A saída é compatível com servidores MySQL que executam versões de 8.0.23 a 8.1.0, inclusive.
* `BEFORE_8_0_23`: A saída é compatível com servidores MySQL que executam versões anteriores a 8.0.23.

Veja a descrição dessa opção para obter mais informações.

Além disso, um novo valor é adicionado aos já permitidos para a variável de sistema `terminology_use_previous`. `BEFORE_8_2_0` faz com que o servidor imprima `DISABLE ON SLAVE` (agora desatualizado) em vez de `DISABLE ON REPLICA` na saída do `SHOW CREATE EVENT`. O valor existente `BEFORE_8_0_26` agora também tem esse efeito, além dos que já tinha anteriormente.

O número da versão do MySQL usado nos comentários específicos para versões suporta uma versão principal composta por um ou dois dígitos; isso significa que toda a versão pode ter de cinco a seis dígitos. Para obter mais informações sobre como essa mudança afeta o tratamento de comentários versionados no MySQL, consulte a Seção 11.7, “Comentários”.

**`group_replication_set_as_primary()` e declarações `DDL`**: A função `group_replication_set_as_primary()` aguarda declarações DDL em andamento, como `ALTER TABLE`, enquanto espera que todas as transações sejam concluídas, antes de eleger um novo primário.

Para obter mais informações, consulte a descrição dessa função.

**Rastreamento de declarações DDL e DCL para `group_replication_set_as_primary()`**: `group_replication_set_as_primary()` agora aguarda que as seguintes declarações sejam concluídas antes de uma nova primária ser eleita:

* `ALTER DATABASE`
* `ALTER FUNCTION`
* `ALTER INSTANCE`
* `ALTER PROCEDURE`
* `ALTER SERVER`
* `ALTER TABLESPACE`
* `ALTER USER`
* `ALTER VIEW`
* `CREATE DATABASE`
* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE ROLE`
* `CREATE SERVER`
* `CREATE SPATIAL REFERENCE SYSTEM`
* `CREATE TABLESPACE`
* `CREATE TRIGGER`
* `CREATE USER`
* `CREATE VIEW`
* `DROP DATABASE`
* `DROP FUNCTION`
* `DROP PROCEDURE`
* `DROP ROLE`
* `DROP SERVER`
* `DROP SPATIAL REFERENCE SYSTEM`
* `DROP TABLESPACE`
* `DROP TRIGGER`
* `DROP USER`
* `DROP VIEW`
* `GRANT`
* `RENAME TABLE`
* `REVOKE`

Esses são, além dos que foram adicionados no MySQL 8.1 ou já suportados nesse sentido. Para mais informações, incluindo uma lista de todas as declarações suportadas no MySQL 8.3, consulte a descrição da função `group_replication_set_as_primary()`.

**Compatibilidade com a versão da replicação em grupo**: A compatibilidade com a versão dos servidores dentro dos grupos foi estendida da seguinte forma:

Descerradas in-place de servidores dentro dos grupos são suportadas na série MySQL 8.4 LTS. Por exemplo, um membro de um grupo executando MySQL 8.4.2 pode ser descerrado para MySQL 8.4.0.

Da mesma forma, a associação de grupos entre versões também é suportada na série de lançamentos 8.4. Por exemplo, um servidor que executa o MySQL 8.4.0 pode se juntar a um grupo cujos membros atualmente executam o MySQL 8.4.2, assim como um servidor que executa o MySQL 8.4.3.

**Padrões das variáveis de replicação de grupo**: Os valores padrão de duas variáveis de sistema do servidor relacionadas à replicação de grupo foram alterados no MySQL 8.4:

* O valor padrão da variável de sistema `group_replication_consistency` foi alterado para `BEFORE_ON_PRIMARY_FAILOVER` no MySQL 8.4.0. (Anteriormente, era `EVENTUAL`.)
* O valor padrão da variável de sistema `group_replication_exit_state_action` foi alterado para `OFFLINE_MODE` no MySQL 8.4.0. (Anteriormente, era `READ_ONLY`.)

Para mais informações, consulte a Seção 20.5.3.2, “Configurando Garantías de Consistência de Transações”, e a Seção 20.7.7, “Respostas à Detecção de Falha e Partição de Rede”, além das descrições das variáveis listadas.


**Variáveis de Status da Replicação de Grupo**: Foram adicionadas várias variáveis de status específicas do plugin de replicação de grupo que melhoram o diagnóstico e a solução de problemas de instabilidades de rede, fornecendo estatísticas sobre o uso da rede, mensagens de controle e mensagens de dados para cada membro do grupo.

Consulte a Seção 20.9.2, “Variáveis de Status da Replicação de Grupo”, para obter mais informações.

Como parte deste trabalho, uma nova coluna `MEMBER_FAILURE_SUSPICIONS_COUNT` foi adicionada à tabela `replication_group_communication_information` do Schema de Desempenho. O conteúdo desta coluna é formatado como um array JSON cujas chaves são o ID do membro do grupo e cujos valores são o número de vezes que o membro do grupo foi considerado suspeito. Consulte a descrição desta tabela para obter mais informações.

**Privilégio `FLUSH_PRIVILEGES`**: Um novo privilégio é adicionado no MySQL 8.4.0 especificamente para permitir o uso de instruções `FLUSH PRIVILEGES`. Ao contrário do privilégio `RELOAD`, o privilégio `FLUSH_PRIVILEGES` aplica-se apenas a instruções `FLUSH PRIVILEGES`.

No MySQL 8.4, o privilégio `RELOAD` continua a ser suportado nesta capacidade para fornecer compatibilidade reversa.

Ao fazer uma atualização, uma verificação é realizada para ver se há algum usuário com o privilégio `FLUSH_PRIVILEGES`; se não houver, quaisquer usuários com o privilégio `RELOAD` são automaticamente atribuídos ao novo privilégio também.

Se você fazer uma atualização de um MySQL 8.4 (ou posterior) para uma versão do MySQL que não suporte o privilégio `FLUSH_PRIVILEGES`, um usuário que anteriormente recebeu este privilégio não poderá executar instruções `FLUSH PRIVILEGES` a menos que o usuário tenha o privilégio `RELOAD`.

**Privilégio `OPTIMIZE_LOCAL_TABLE`**: O MySQL 8.4.0 adiciona um novo privilégio `OPTIMIZE_LOCAL_TABLE`. Os usuários devem ter este privilégio para executar as instruções `OPTIMIZE LOCAL TABLE` e `OPTIMIZE NO_WRITE_TO_BINLOG TABLE`.

Ao atualizar de uma série de versões anteriores, os usuários com o privilégio `SYSTEM_USER` recebem automaticamente o privilégio `OPTIMIZE_LOCAL_TABLE`.

**Mascagem e desidentificação de dados do MySQL Enterprise**: Os componentes de mascagem e desidentificação de dados adicionaram suporte para especificar um esquema dedicado para armazenar a tabela interna relacionada e as funções de mascaramento. Anteriormente, o esquema `mysql` do sistema fornecia a única opção de armazenamento. A nova variável de leitura `component_masking.masking_database` permite definir e persistir um nome de esquema alternativo na inicialização do servidor.

**Limpeza dos dicionários de mascagem de dados**: O componente de Mascagem e Desidentificação de Dados do MySQL Enterprise agora inclui a capacidade de limpar os dados na cópia secundária ou replica na memória. Isso pode ser feito de uma das maneiras descritas aqui:

* A limpeza pode ser realizada pelo usuário a qualquer momento usando a função `masking_dictionaries_flush()` adicionada nesta versão.
* O componente pode ser configurado para limpar a memória periodicamente, aproveitando o componente Scheduler, definindo a nova variável de sistema `component_masking.dictionaries_flush_interval_seconds` para um valor apropriado.

Para mais informações, consulte a Seção 8.5, “Mascagem e Desidentificação de Dados do MySQL Enterprise”, e as descrições desses itens.

**Atualizações automáticas do histograma**: O MySQL 8.4.0 adiciona suporte para atualizações automáticas dos histogramas. Quando essa funcionalidade é habilitada para um histograma específico, ele é atualizado sempre que a instrução `ANALYZE TABLE` é executada na tabela a qual pertence. Além disso, o recálculo automático das estatísticas persistentes pelo `InnoDB` (consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”) também atualiza o histograma. As atualizações do histograma continuam a usar o mesmo número de buckets que foram especificados originalmente, se houver.

Você pode habilitar essa funcionalidade ao especificar o histograma, incluindo a opção `AUTO UPDATE` para a instrução `ANALYZE TABLE`. Para desabilitar, inclua `MANUAL UPDATE` em vez disso. `MANUAL UPDATE` (sem atualizações automáticas) é o padrão se nenhuma opção for especificada.

Para mais informações, consulte Análise de Estatísticas de Histograma.

* Foi adicionada a variável de sistema `tls-certificates-enforced-validation`, que permite que um DBA enforce (impede) a validação de certificados na inicialização do servidor ou ao usar a instrução `ALTER INSTANCE RELOAD TLS` para recarregar certificados em tempo de execução. Com a enforcagem habilitada, a descoberta de um certificado inválido interrompe a invocação do servidor na inicialização, previne o carregamento de certificados inválidos em tempo de execução e emite avisos. Para mais informações, consulte Configurando a Enforcagem de Validação de Certificados.

* Adicionamos variáveis do sistema do servidor para controlar o tempo que as contas do MySQL que se conectam a um servidor MySQL usando autenticação pluagável LDAP devem esperar quando o servidor LDAP estiver indisponível ou sem resposta. O tempo limite padrão se tornou de 30 segundos para as seguintes variáveis de autenticação LDAP simples e baseadas em SASL:

* `authentication_ldap_simple_connect_timeout`
* `authentication_ldap_simple_response_timeout`
* `authentication_ldap_sasl_connect_timeout`
* `authentication_ldap_sasl_response_timeout`

Os tempos de conexão e resposta são configuráveis através das variáveis do sistema apenas em plataformas Linux. Para mais informações, consulte Configurando os tempos de espera para autenticação pluagável LDAP.

* O processo de desligamento foi aprimorado, com a adição de mensagens de inicialização e desligamento para o servidor MySQL, plugins e componentes. Essas mensagens também são registradas ao fechar conexões. Essas adições devem facilitar a solução de problemas e depuração de problemas, especialmente no caso de o servidor demorar excessivamente para desligar. Para mais informações, consulte a Seção 7.4.2, “O Log de Erros”.

**Adições às mensagens de inicialização e desligamento do servidor**: Adicionamos os seguintes tipos de mensagens aos processos de inicialização e desligamento do servidor conforme observado nesta lista:

* Mensagens de início e fim para a inicialização do servidor quando o servidor é iniciado com `--initialize` ou `--initialize-insecure`; essas mensagens são adicionais e distintas das mostradas durante o início e o desligamento normais do servidor.
* Mensagens de início e fim para a inicialização do `InnoDB`.
* Mensagens de início e fim para a execução do arquivo de inicialização durante a inicialização do servidor.
* Mensagens de início e fim para a execução de instruções compiladas durante a inicialização do servidor.
* Mensagens de início e fim para a recuperação de falhas durante o início do servidor (se a recuperação de falhas ocorrer).
* Mensagens de início e fim para a inicialização de plugins dinâmicos durante o início do servidor.
* Mensagens de início e fim para a etapa de inicialização de componentes (aparientes durante o início do servidor).
* Mensagens para o desligamento de threads de replica, bem como o desligamento suave e forçado de threads de conexão, durante o desligamento do servidor.
* Mensagens de início e fim para o desligamento de plugins e componentes durante o desligamento do servidor.
* Informações sobre o código de saída (valor de retorno) com mensagens de desligamento durante a inicialização ou o desligamento do servidor e fim.
Além disso, se o servidor foi construído usando `WITH_SYSTEMD`, o servidor agora inclui todas as mensagens do `systemd` no log de erro.

* Adicionamos a declaração `SHOW PARSE_TREE`, que exibe o árvore de parse formatada em JSON para uma declaração `SELECT`. Esta declaração é destinada apenas para uso de teste e desenvolvimento, e não para produção. Está disponível apenas em builds de depuração, ou se o MySQL foi compilado a partir do código-fonte usando a opção `-DWITH_SHOW_PARSE_TREE` do CMake, e não está incluída ou suportada em builds de lançamento.


**Informações de conexão do plugin de pool de threads**: Adicionamos informações de conexão do pool de threads ao Schema de Desempenho do MySQL, da seguinte forma:

* Adicionamos uma tabela `tp_connections`, com informações sobre cada conexão do pool de threads.
* Adicionamos as seguintes colunas à tabela `tp_thread_state`: `TIME_OF_ATTACH`, `MARKED_STALLED`, `STATE`, `EVENT_COUNT`, `ACCUMULATED_EVENT_TIME`, `EXEC_COUNT` e `ACCUMULATED_EXEC_TIME`
* Adicionamos as seguintes colunas à tabela `tp_thread_group_state`: `EFFECTIVE_MAX_TRANSACTIONS_LIMIT`, `NUM_QUERY_THREADS`, `TIME_OF_LAST_THREAD_CREATION`, `NUM_CONNECT_HANDLER_THREAD_IN_SLEEP`, `THREADS_BOUND_TO_TRANSACTION`, `QUERY_THREADS_COUNT` e `TIME_OF_EARLIEST_CON_EXPIRE`.

Para mais informações, consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”, e a Seção 29.12.16, “Tables of Thread Pool do Schema de Desempenho”.

**Uso da tabela Schema de Informações PROCESSLIST**: Embora a tabela `INFORMATION_SCHEMA.PROCESSLIST` tenha sido descontinuada no MySQL 8.0.35 e 8.2.0, o interesse em monitorar seu uso permanece. Este lançamento adiciona duas variáveis de status do sistema que fornecem informações sobre os acessos à tabela `PROCESSLIST`, listadas aqui:

* `Deprecated_use_i_s_processlist_count` fornece um contador do número de referências à tabela `PROCESSLIST` em consultas desde que o servidor foi iniciado pela última vez.
* `Deprecated_use_i_s_processlist_last_timestamp` armazena a hora em que a tabela `PROCESSLIST` foi acessada pela última vez. Este é um valor de data e hora (número de microsegundos desde o Epoch Unix).

**Otimização da tabela hash para operações de conjunto**: O MySQL 8.2 melhora o desempenho das instruções que usam as operações de conjunto `EXCEPT` e `INTERSECT` por meio de uma nova otimização da tabela hash, que é habilitada automaticamente para essas instruções e controlada definindo o interruptor `hash_set_operations` do otimizador; para desabilitar essa otimização e fazer com que o otimizador use a otimização da tabela temporária antiga de versões anteriores do MySQL, defina essa bandeira para `off`.

A quantidade de memória alocada para essa otimização pode ser controlada definindo o valor da variável de sistema do servidor `set_operations_buffer_size`; aumentar o tamanho do buffer pode melhorar ainda mais os tempos de execução de algumas instruções que usam essas operações.

Veja a Seção 10.9.2, “Otimizações Alternativas”, para mais informações.

**Opção CMake `WITH_LD`** `WITH_LD` define se deve usar o linker llvm lld ou mold, ou, caso contrário, usar o linker padrão. `WITH_LD` também substitui a opção CMake `USE_LD_LLD`, que foi removida no MySQL 8.3.0.

**Melhorias no MySQL Enterprise Firewall**: Desde o MySQL 8.0, foram feitas várias melhorias no MySQL Enterprise Firewall. Elas estão listadas aqui:

* Os procedimentos armazenados fornecidos pelo MySQL Enterprise Firewall agora funcionam de forma transacional. Quando ocorre um erro durante a execução de um procedimento armazenado do firewall, um erro é relatado e todas as alterações feitas pelo procedimento armazenado até aquele momento são revertidas.
* Os procedimentos armazenados do firewall agora evitam realizar combinações desnecessárias de instruções `DELETE` mais `INSERT`, bem como operações `INSERT IGNORE` mais `UPDATE`, consumindo assim menos tempo e recursos, tornando-os mais rápidos e eficientes.
* Procedimentos armazenados baseados em usuário e UDFs, desatualizados no MySQL 8.0.26, agora geram uma notificação de desatualização. Especificamente, chamar `sp_set_firewall_mode()` ou `sp_reload_firewall_rules()` gera tal notificação. Consulte Procedimentos Armazenados de Perfil de Conta do Firewall, bem como Migração de Perfis de Conta para Perfis de Grupo, para obter mais informações.
* O MySQL Enterprise Firewall agora permite que seu cache de memória seja recarregado periodicamente com dados armazenados nas tabelas do firewall. A variável de sistema `mysql_firewall_reload_interval_seconds` define o cronograma de recarga periódica para uso em tempo de execução ou desabilita as recargas por padrão. Implementações anteriores recarregavam o cache apenas no início do servidor ou quando o plugin do lado do servidor era reinstalado.
* Foi adicionada a variável de sistema `mysql_firewall_database` para permitir o armazenamento de tabelas internas, funções e procedimentos armazenados em um esquema personalizado.
* Foi adicionado o script `uninstall_firewall.sql` para simplificar a remoção de um firewall instalado.

Para obter mais informações sobre procedimentos armazenados de firewall, consulte Procedimentos Armazenados de Firewall do MySQL Enterprise.

**Autenticação plugável**: Foram adicionados suportes para autenticação no MySQL Server usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos em um contexto WebAuthn. O novo método de autenticação WebAuthn é baseado nos padrões FIDO e FIDO2. Ele usa um par de plugins, `authentication_webauthn` no lado do servidor e `authentication_webauthn_client` no lado do cliente. O plugin de autenticação WebAuthn no lado do servidor é incluído apenas nas distribuições da Edição Empresarial do MySQL.
**Migração de chaveira**: É suportada a migração de um componente de chaveira para um plugin de chaveira. Para realizar essa migração, use a opção de servidor `--keyring-migration-from-component` introduzida no MySQL 8.4.0, definindo `--keyring-migration-source` com o nome do componente de origem e `--keyring-migration-destination` com o nome do plugin de destino.

Consulte Migração de Chaveira Usando um Servidor de Migração para obter mais informações.

**MySQL Enterprise Audit**: Foi adicionado o script `audit_log_filter_uninstall.sql` para simplificar a remoção do MySQL Enterprise Audit.
**Novos Palavras-chave**: Palavras-chave adicionadas no MySQL 8.4 desde o MySQL 8.0. Palavras-chave reservadas são marcadas com (R).

`AUTO`, `BERNOULLI`, `GTIDS`, `LOG`, `MANUAL` (R), `PARALLEL` (R), `PARSE_TREE`, `QUALIFY` (R), `S3` e `TABLESAMPLE` (R).

**Coleta de lixo de certificação de replicação em grupo preventiva**: Uma variável de sistema adicionada no MySQL 8.4.0 `group_replication_preemptive_garbage_collection` habilita a coleta de lixo preventiva para a replicação em grupo em modo único-primário, mantendo apenas os conjuntos de escrita para aquelas transações que ainda não foram confirmadas. Isso pode economizar tempo e consumo de memória. Uma variável de sistema adicional `group_replication_preemptive_garbage_collection_rows_threshold` (também introduzida no MySQL 8.4.0) define um limite inferior para o número de linhas de certificação necessárias para acionar a coleta de lixo preventiva, se habilitada; o valor padrão é 100000.

No modo multi-primário, cada conjunto de escrita nas informações de certificação é necessário desde o momento em que uma transação é certificada até que seja confirmada em todos os membros, o que torna necessário detectar conflitos entre transações. No modo único-primário, onde precisamos nos preocupar apenas com as dependências das transações, isso não é um problema; isso significa que os conjuntos de escrita precisam ser mantidos apenas até que a certificação seja concluída.

Não é possível alterar o modo de replicação em grupo entre único-primário e multi-primário quando `group_replication_preemptive_garbage_collection` está habilitado.

Consulte a Seção 20.7.9, “Monitoramento do Uso de Memória da Replicação em Grupo com Instrumentação de Memória do Schema de Desempenho”, para obter ajuda com a obtenção de informações sobre o consumo de memória por esse processo.

**Recuperação do log de retransmissão sanitizado**: No MySQL 8.4.0 e versões posteriores, é possível recuperar o log de retransmissão com todas as transações incompletas removidas. O log de retransmissão agora é sanitizado quando o servidor é iniciado com `--relay-log-recovery=OFF` (o padrão), o que significa que todos os seguintes itens são removidos:

* Transações que permanecem incompletas no final do log de retransmissão
* Arquivos de log de retransmissão que contêm transações incompletas ou partes delas apenas
* Referências no arquivo de índice do log de retransmissão para arquivos de log de retransmissão que foram assim removidos

Para mais informações, consulte a descrição da variável de sistema `relay_log_recovery`.

**Arquivo de histórico de atualização do MySQL**: Como parte do processo de instalação no MySQL 8.4.0 e versões posteriores, um arquivo no formato JSON chamado `mysql_upgrade_history` é criado no diretório de dados do servidor, ou atualizado se já existir. Este arquivo inclui informações sobre a versão do servidor MySQL instalada, quando foi instalada e se a versão fazia parte de uma série LTS ou de uma série de inovação.

Um arquivo típico de `mysql_upgrade_history` pode parecer algo como este (o formato foi ajustado para melhor legibilidade):

  ```
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

Além disso, o processo de instalação agora verifica a presença de um arquivo `mysql_upgrade_info` (desatualizado no MySQL 8.0 e não mais utilizado). Se encontrado, o arquivo é removido.

**Opção `--system-command` do cliente `mysql`**: A opção `--system-command` para o cliente `mysql`, disponível no MySQL 8.4.3 e versões posteriores, habilita ou desabilita o comando `system`.

Esta opção está habilitada por padrão. Para desabilitá-la, use `--system-command=OFF` ou `--skip-system-command`, o que faz com que o comando `system` seja rejeitado com um erro.

**Opção `--commands` do cliente `mysql`**: A opção `--commands` do cliente `mysql`, introduzida no MySQL 8.4.6, habilita ou desabilita a maioria dos comandos do cliente `mysql`.

Esta opção está habilitada por padrão. Para desabilitá-la, inicie o cliente `mysql` com `--commands=OFF` ou `--skip-commands`.

Para mais informações, consulte a Seção 6.5.1.1, “Opções do Cliente `mysql`”.

**Subconsultas escalares correlacionadas a tabelas derivadas**: O MySQL 8.4.0 remove uma restrição anterior sobre a transformação de uma subconsulta escalar correlacionada em uma tabela derivada, de modo que um operando da expressão de igualdade que não contasse com uma referência externa pudesse ser apenas uma referência de coluna simples.

Isso significa que as colunas internas podem ser contidas em expressões determinísticas, como mostrado aqui:

```
func1(.., funcN(.., coluna-interna-a, ..), coluna-interna-b) = expressão-exterior

coluna-interna-a + coluna-interna-b = expressão-exterior
```

Por exemplo, a seguinte consulta agora é suportada para otimização:

```
SELECT * FROM t1
  WHERE ( SELECT func(t2.a) FROM t2
            WHERE func(t2.a) = t1.a ) > 0;
```

O operando interno não pode conter referências de colunas externas; da mesma forma, o operando externo não pode conter referências de colunas internas. Além disso, o operando interno não pode conter uma subconsulta.

Se a subconsulta transformada tiver agrupamento explícito, a análise de dependência funcional pode ser excessivamente pessimista, resultando em um erro como `ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP BY clause and contains nonaggregated column`.... Para o motor de armazenamento  `InnoDB`, a transformação é desabilitada por padrão (ou seja, a bandeira `subquery_to_derived` da variável `optimizer_switch` não está habilitada); nesse caso, essas consultas passam sem causar erros, mas também não são transformadas.

Veja a Seção 15.2.15.7, “Subconsultas Relacionadas”, para mais informações.

### Recursos Desatualizados no MySQL 8.4

Os seguintes recursos são desatualizados no MySQL 8.4 e podem ser removidos em uma série futura. Onde são mostradas alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações que usam recursos desatualizados no MySQL 8.4 que foram removidos em uma versão posterior do MySQL, as declarações podem falhar ao serem replicadas de uma fonte MySQL 8.4 para uma replica executando uma versão posterior, ou podem ter efeitos diferentes na fonte e na replica. Para evitar tais problemas, as aplicações que usam recursos desatualizados em 8.4 devem ser revisadas para evitá-los e usar alternativas quando possível.

**Variável de sistema `group_replication_allow_local_lower_version_join`**: A variável de sistema `group_replication_allow_local_lower_version_join` está desatualizada e, ao ser definida, gera um aviso ( `ER_WARN_DEPRECATED_SYNTAX_NO_REPLACEMENT`) para ser registrado.

Você deve esperar que essa variável seja removida em uma versão futura do MySQL. Como a funcionalidade habilitada pela definição de `group_replication_allow_local_lower_version_join` já não é útil, não há planos para substituí-la.

**Metadados de recuperação da replicação em grupo**: A recuperação da replicação em grupo não depende mais da gravação de eventos de alteração de visão no log binário para marcar alterações na associação ao grupo; em vez disso, quando todos os membros de um grupo são versões 8.3.0 ou superior do MySQL, os membros compartilham metadados de recuperação comprimidos e nenhum evento desse tipo é registrado (ou atribuído um GTID) quando um novo membro se junta ao grupo.

Os metadados de recuperação incluem o ID da visão GCS, `GTID_SET` de transações certificadas e informações de certificação, além de uma lista de membros online.

Como o `View_change_log_event` não desempenha mais um papel na recuperação, a variável de sistema `group_replication_view_change_uuid` deixou de ser necessária e, portanto, está desatualizada; espere sua remoção em uma futura versão do MySQL. Você deve estar ciente de que não há planos para substituir ou alternar essa variável ou sua funcionalidade, e desenvolva seus aplicativos de acordo.

**Função `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`**: A função SQL `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` foi descontinuada no MySQL 8.0 e não é mais suportada a partir do MySQL 8.2. Tentar invocá-la agora causa um erro de sintaxe.

Em vez de `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, recomenda-se que você use `WAIT_FOR_EXECUTED_GTID_SET()`, que permite que você espere por GTIDs específicos. Isso funciona independentemente do canal de replicação ou do cliente do usuário pelo qual as transações especificadas chegam ao servidor.

**Replicação baseada em GTID e `IGNORE_SERVER_IDS`**: Quando identificadores de transações globais (GTIDs) são usados para replicação, as transações que já foram aplicadas são automaticamente ignoradas. Isso significa que `IGNORE_SERVER_IDS` não é compatível com o modo GTID. Se `gtid_mode` estiver em `ON`, a instrução `CHANGE REPLICATION SOURCE TO` com uma lista não vazia de `IGNORE_SERVER_IDS` é rejeitada com um erro. Da mesma forma, se qualquer canal de replicação existente foi criado com uma lista de IDs de servidor a serem ignorados, `SET gtid_mode=ON` também é rejeitada. Antes de iniciar a replicação baseada em GTID, verifique e limpe quaisquer listas de IDs de servidor ignorados nos servidores envolvidos; você pode fazer isso verificando a saída de `SHOW REPLICA STATUS`. Nesses casos, você pode limpar a lista emitindo `CHANGE REPLICATION SOURCE TO` com uma lista vazia de IDs de servidor, como mostrado aqui:

```
CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
```

Consulte a Seção 19.1.3.7, “Restrições sobre a replicação com GTIDs”, para obter mais informações.

**Rastreamento e formato de registro de transações de log binário**: A utilização de informações de writeset para detecção de conflitos tem causado problemas no rastreamento de dependências; por essa razão, agora limitamos o uso de writesets para verificações de conflitos quando o registro baseado em linhas está em vigor.

Isso significa que, nesses casos, `binlog_format` deve ser `ROW` e `MIXED` não é mais suportado.

**Variável de sistema `expire_logs_days`**: A variável de sistema `expire_logs_days`, descontinuada no MySQL 8.0, foi removida. Tentativas de obter ou definir essa variável em tempo de execução ou para iniciar o `mysqld` com a opção equivalente (`--expire-logs-days`) agora resultam em um erro.

Em vez de `expire_logs_days`, use `binlog_expire_logs_seconds`, que permite especificar períodos de expiração diferentes de (apenas) um número inteiro de dias.

**Caracteres curinga em concessões de banco de dados**: O uso dos caracteres `%` e `_` como curingas em concessões de banco de dados foi descontinuado no MySQL 8.2.0. Você deve esperar que a funcionalidade de curinga seja removida em uma futura versão do MySQL e que esses caracteres sejam sempre tratados como literais, pois já são quando o valor da variável de sistema `partial_revokes` é `ON`.

Além disso, o tratamento do `%` pelo servidor como sinônimo de `localhost` ao verificar privilégios agora também é desaconselhado a partir do MySQL 8.2.0 e, portanto, está sujeito à remoção em uma futura versão do MySQL.

**Opção `--character-set-client-handshake`**: A opção `--character-set-client-handshake` do servidor, originalmente destinada ao uso com atualizações de versões muito antigas do MySQL, agora é desaconselhada e uma mensagem de aviso é emitida sempre que ela é usada. Você deve esperar que essa opção seja removida em uma futura versão do MySQL; as aplicações que dependem dessa opção devem começar a migrar dela o mais rápido possível.

**Chaves estrangeiras não padrão**: O uso de chaves não únicas ou parciais como chaves estrangeiras é não padrão e é desaconselhado no MySQL. A partir do MySQL 8.4.0, você deve habilitar explicitamente essas chaves definindo `restrict_fk_on_non_standard_key` para `OFF`, ou iniciando o servidor com `--skip-restrict-fk-on-non-standard-key`.

`restrict_fk_on_non_standard_key` está definido como `ON` por padrão, o que significa que tentar usar uma chave não padrão como chave estrangeira em uma `CREATE TABLE` ou em outra instrução SQL é rejeitada com `ER_WARN_DEPRECATED_NON_STANDARD_KEY`. Definindo-o como `ON`, essas instruções podem ser executadas, mas elas geram o mesmo erro como um aviso.

As atualizações do MySQL 8.0 são suportadas, mesmo que existam tabelas contendo chaves estrangeiras que se referem a chaves não únicas ou parciais. Nesses casos, o servidor escreve uma lista de mensagens de aviso contendo os nomes de quaisquer chaves estrangeiras que se referem a chaves não padrão.

### Recursos Removidos no MySQL 8.4

Os seguintes itens estão obsoletos e foram removidos no MySQL 8.4. Onde são mostradas alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações do MySQL 8.3 que utilizam recursos removidos no MySQL 8.4, as instruções podem falhar ao serem replicadas de uma fonte do MySQL 8.3 para uma réplica do MySQL 8.4, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que utilizam recursos removidos no MySQL 8.4 devem ser revisadas para evitar esses recursos e usar alternativas quando possível.

**Opções e variáveis do servidor removidas**: Várias opções e variáveis do servidor suportadas em versões anteriores do MySQL foram removidas no MySQL 8.4. Tentar definir qualquer uma delas no MySQL 8.4 gera um erro. Essas opções e variáveis estão listadas aqui:

* `binlog_transaction_dependency_tracking`: Desatualizado no MySQL 8.0.35 e no MySQL 8.2.0. Não há planos para substituir essa variável ou sua funcionalidade, que foi internalizada no servidor. No MySQL 8.4 (e versões posteriores), quando réplicas multithread estão em uso, o `mysqld` fonte usa sempre sets de escrita para gerar informações de dependência para o log binário; isso tem o mesmo efeito que definir `binlog_transaction_dependency_tracking` para `WRITESET` nas versões anteriores do MySQL.
* `group_replication_recovery_complete_at`: Desatualizado no MySQL 8.0.34. No MySQL 8.4 e versões posteriores, a política aplicada durante o processo de recuperação distribuída é sempre marcar um novo membro online apenas após ele ter recebido, certificado e aplicado todas as transações que ocorreram antes de se juntar ao grupo; isso é equivalente a definir `group_replication_recovery_complete_at` para `TRANSACTIONS_APPLIED` nas versões anteriores do MySQL.
* `avoid_temporal_upgrade` e `show_old_temporals`: Ambas as variáveis foram desatualizadas no MySQL 5.6; nenhuma delas teve efeito nas versões recentes do MySQL. Ambas as variáveis foram removidas; não há planos para substituí-las.
* `--no-dd-upgrade`: Desatualizado no MySQL 8.0.16, agora removido. Use `--upgrade=NONE` em vez disso.
* `--old` e `--new`: Ambas desatualizadas no MySQL 8.0.35 e no MySQL 8.2.0, e agora removidas.
* `--language`: Desatualizada no MySQL 5.5, e agora removida.
* As opções de servidor `--ssl` e `--admin-ssl`, bem como as variáveis de sistema `have_ssl` e `have_openssl` do sistema do servidor, foram desatualizadas no MySQL 8.0.26. Todas elas foram removidas nesta versão. Use `--tls-version` e `--admin-tls-version` em vez disso.
* A variável de sistema `default_authentication_plugin`, desatualizada no MySQL 8.0.27, é removida a partir do MySQL 8.4.0. Use `authentication_policy` em vez disso.

Como parte da remoção do `default_authentication_plugin`, a sintaxe para `authentication_policy` foi alterada. Consulte a descrição de `authentication_policy` para obter mais informações.

**Opção de servidor `--skip-host-cache`**: Esta opção foi removida; inicie o servidor com `--host-cache-size=0` em vez disso. Consulte a Seção 7.1.12.3, “Consultas DNS e o Cache de Anfitriões”.

**Opções de servidor `--innodb` e `--skip-innodb`**: Essas opções foram removidas. O mecanismo de armazenamento `InnoDB` está sempre habilitado e não é possível desabilitá-lo.

**Opções de servidor `--character-set-client-handshake` e `--old-style-user-limits`**: Essas opções eram anteriormente usadas para compatibilidade com versões muito antigas do MySQL, que não são mais suportadas ou mantidas, e, portanto, não servem mais para nenhum propósito útil.

**Instrução `FLUSH HOSTS`**: A instrução `FLUSH HOSTS`, desatualizada no MySQL 8.0.23, foi removida. Para limpar o cache de anfitriões, execute `TRUNCATE TABLE` `performance_schema.host_cache` ou `mysqladmin flush-hosts`.

**Opções e variáveis de replicação obsoletas**: Várias opções e variáveis relacionadas à replicação do MySQL foram desatualizadas em versões anteriores do MySQL e foram removidas do MySQL 8.4. Tentar usar qualquer uma dessas opções ou variáveis agora faz com que o servidor lance um erro de sintaxe. Essas opções e variáveis estão listadas aqui:

* `--slave-rows-search-algorithms`: O algoritmo usado pelo aplicativo de replicação para procurar linhas de tabela ao aplicar atualizações ou excluí-las agora é sempre `HASH_SCAN, INDEX_SCAN` e não é mais configurável pelo usuário.
* `log_bin_use_v1_events`: Isso permitia que servidores de origem que executam MySQL 5.7 e versões mais recentes replicasem para versões anteriores do MySQL que não são mais suportadas ou mantidas.
* `--relay-log-info-file`, `--relay-log-info-repository`, `--master-info-file`, `--master-info-repository`: O uso de arquivos para o repositório de metadados do aplicativo e o repositório de metadados de conexão foi substituído por tabelas seguras em caso de falha, e não é mais suportado. Veja a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.
* `transaction_write_set_extraction`
* `group_replication_ip_whitelist`: Use `group_replication_ip_allowlist` em vez disso.
* `group_replication_primary_member`: Não é mais necessário; verifique a coluna `MEMBER_ROLE` da tabela `replication_group_members` do Schema de Desempenho.

**Sintaxe SQL de replicação**: Várias instruções SQL usadas na Replicação do MySQL que foram desatualizadas em versões anteriores do MySQL não são mais suportadas no MySQL 8.4. Tentar usar qualquer uma dessas instruções agora produz um erro de sintaxe. Essas instruções podem ser divididas em dois grupos: as relacionadas aos servidores de origem e as que se referem aos réplicas, conforme mostrado aqui:

Como parte deste trabalho, a opção `DESABILITAR EM SLAVE` para `CREATE EVENT` e `ALTER EVENT` agora é desatualizada e substituída por `DESABILITAR EM REPLICA`. O termo correspondente `SLAVESIDE_DISABLED` também é agora desatualizado e não é mais usado em descrições de eventos, como na tabela do Schema de Informações `EVENTS`; `REPLICA_SIDE_DISABLED` é agora mostrado.

As declarações que foram removidas, que se relacionam com servidores de origem de replicação, estão listadas aqui:
  * `CHANGE MASTER TO`: Use `CHANGE REPLICATION SOURCE TO`.
  * `RESET MASTER`: Use `RESET BINARY LOGS AND GTIDS`.
  * `SHOW MASTER STATUS`: Use `SHOW BINARY LOG STATUS`.
  * `PURGE MASTER LOGS`: Use `PURGE BINARY LOGS`.
  * `SHOW MASTER LOGS`: Use `SHOW BINARY LOGS`.

As declarações SQL removidas relacionadas a réplicas estão listadas aqui:
  * `START SLAVE`: Use `START REPLICA`.
  * `STOP SLAVE`: Use `STOP REPLICA`.
  * `SHOW SLAVE STATUS`: Use `SHOW REPLICA STATUS`.
  * `SHOW SLAVE HOSTS`: Use `SHOW REPLICAS`.
  * `RESET SLAVE`: Use `RESET REPLICA`.

Todas as declarações listadas anteriormente foram removidas dos programas e arquivos de teste do MySQL, bem como de qualquer outro uso interno.

Além disso, várias opções desatualizadas anteriormente suportadas por `CHANGE REPLICATION SOURCE TO` e `START REPLICA` foram removidas e não são mais aceitas pelo servidor. As opções removidas para cada uma dessas declarações SQL estão listadas a seguir.

As opções removidas de `ALTERAR A FONTE DE REPLICAÇÃO PARA` estão listadas aqui:
  * `MASTER_AUTO_POSITION`: Use `SOURCE_AUTO_POSITION`.
  * `MASTER_HOST`: Use `SOURCE_HOST`.
  * `MASTER_BIND`: Use `SOURCE_BIND`.
  * `MASTER_UseR`: Use `SOURCE_UseR`.
  * `MASTER_PASSWORD`: Use `SOURCE_PASSWORD`.
  * `MASTER_PORT`: Use `SOURCE_PORT`.
  * `MASTER_CONNECT_RETRY`: Use `SOURCE_CONNECT_RETRY`.
  * `MASTER_RETRY_COUNT`: Use `SOURCE_RETRY_COUNT`.
  * `MASTER_DELAY`: Use `SOURCE_DELAY`.
  * `MASTER_SSL`: Use `SOURCE_SSL`.
  * `MASTER_SSL_CA`: Use `SOURCE_SSL_CA`.
  * `MASTER_SSL_CAPATH`: Use `SOURCE_SSL_CAPATH`.
  * `MASTER_SSL_CIPHER`: Use `SOURCE_SSL_CIPHER`.
  * `MASTER_SSL_CRL`: Use `SOURCE_SSL_CRL`.
  * `MASTER_SSL_CRLPATH`: Use `SOURCE_SSL_CRLPATH`.
  * `MASTER_SSL_KEY`: Use `SOURCE_SSL_KEY`.
  * `MASTER_SSL_VERIFY_SERVER_CERT`: Use `SOURCE_SSL_VERIFY_SERVER_CERT`.
  * `MASTER_TLS_VERSION`: Use `SOURCE_TLS_VERSION`.
  * `MASTER_TLS_CIPHERSUITES`: Use `SOURCE_TLS_CIPHERSUITES`.
  * `MASTER_SSL_CERT`: Use `SOURCE_SSL_CERT`.
  * `MASTER_PUBLIC_KEY_PATH`: Use `SOURCE_PUBLIC_KEY_PATH`.
  * `GET_MASTER_PUBLIC_KEY`: Use `GET_SOURCE_PUBLIC_KEY`.
  * `MASTER_HEARTBEAT_PERIOD`: Use `SOURCE_HEARTBEAT_PERIOD`.
  * `MASTER_COMPRESSION_ALGORITHMS`: Use `SOURCE_COMPRESSION_ALGORITHMS`.
  * `MASTER_ZSTD_COMPRESSION_LEVEL`: Use `SOURCE_ZSTD_COMPRESSION_LEVEL`.
  * `MASTER_LOG_FILE`: Use `SOURCE_LOG_FILE`.
  * `MASTER_LOG_POS`: Use `SOURCE_LOG_POS`.

As opções removidas da declaração `START REPLICA` estão listadas aqui:

  * `MASTER_LOG_FILE`: Use `SOURCE_LOG_FILE`.
  * `MASTER_LOG_POS`: Use `SOURCE_LOG_POS`.

**Variáveis do sistema e `NULL`**: Não é intencionado ou suportado que uma opção de inicialização do servidor MySQL seja definida como `NULL` (`--my-option=NULL`) e interpretada pelo servidor como `NULL` SQL, e isso não deve ser possível. O MySQL 8.1 (e versões posteriores) proíbe especificamente a definição de opções de inicialização do servidor como `NULL` dessa maneira, e rejeita uma tentativa de fazer isso com um erro. Tentativas de definir as variáveis de sistema do servidor correspondentes como `NULL` usando `SET` ou similar no cliente `mysql` também são rejeitadas.

As variáveis de sistema do servidor na lista a seguir estão isentas da restrição descrita acima:

  * `admin_ssl_ca`
  * `admin_ssl_capath`
  * `admin_ssl_cert`
  * `admin_ssl_cipher`
  * `admin_tls_ciphersuites`
  * `admin_ssl_key`
  * `admin_ssl_crl`
  * `admin_ssl_crlpath`
  * `basedir`
  * `character_sets_dir`
  * `ft_stopword_file`
  * `group_replication_recovery_tls_ciphersuites`
  * `init_file`
  * `lc_messages_dir`
  * `plugin_dir`
  * `relay_log`
  * `relay_log_info_file`
  * `replica_load_tmpdir`
  * `ssl_ca`
  * `ssl_capath`
  * `ssl_cert`
  * `ssl_cipher`
  * `ssl_crl`
  * `ssl_crlpath`
  * `ssl_key`
  * `socket`
  * `tls_ciphersuites`
  * `tmpdir`

Veja também  Seção 7.1.8, “Variáveis do sistema do servidor”.

**Identificadores com o sinal de dólar inicial**: O uso do sinal de dólar (`$`) como caractere inicial de um identificador não citado foi desaconselhado no MySQL 8.0 e está restrito no MySQL 8.1 e versões posteriores; o uso de um identificador não citado que começa com um sinal de dólar e contém um ou mais sinais de dólar (além do primeiro) agora gera um erro de sintaxe.

Identificadores não citados que começam com `$` não são afetados por essa restrição se não contiverem nenhum caractere de dólar adicional.

Veja a Seção 11.2, “Nomes de Objetos de Esquema”.

Como parte deste trabalho, as seguintes variáveis de status do servidor, anteriormente desaconselhadas, foram removidas. Elas estão listadas aqui, juntamente com suas substituições:

  * `Com_slave_start`: Use `Com_replica_start`.
  * `Com_slave_stop`: Use `Com_replica_stop`.
  * `Com_show_slave_status`: Use `Com_show_replica_status`.
  * `Com_show_slave_hosts`: Use `Com_show_replicas`.
  * `Com_show_master_status`: Use `Com_show_binary_log_status`.
  * `Com_change_master`: Use `Com_change_replication_source`.

As variáveis listadas como removidas não aparecem mais na saída de instruções como `SHOW STATUS`. Veja também as Variáveis `Com_xxx`.

**Plugins**: Vários plugins foram removidos no MySQL 8.4.0 e estão listados aqui, juntamente com quaisquer variáveis de sistema e outras características associadas a eles que também foram removidas ou afetadas de outra forma pela remoção do plugin:

* Os módulos `authentication_fido` e `authentication_fido_client`: Use o módulo `authentication_webauthn` em vez disso. Veja a Seção 8.4.1.11, “WebAuthn Pluggable Authentication”. A variável de sistema `authentication_fido_rp_id`, a opção `--fido-register-factor` do cliente `mysql` e a opção `-DWITH_FIDO` do CMake também foram removidas.
  * O módulo `keyring_file`: Use o componente `component_keyring_file` em vez disso. Veja a Seção 8.4.4.4, “Usando o componente de cartela de chave com base em arquivo `component_keyring_file`”. A variável de sistema `keyring_file_data` também foi removida. Além disso, as opções CMake `-DINSTALL_MYSQLKEYRINGDIR` e `-DWITH_KEYRING_TEST` foram removidas.
  * O módulo `keyring_encrypted_file`: Use o componente `component_keyring_encrypted_file` em vez disso. Veja a Seção 8.4.4.5, “Usando o componente de cartela de chave com base em arquivo criptografado `component_keyring_encrypted_file`”. As variáveis de sistema `keyring_encrypted_file_data` e `keyring_encrypted_file_password` também foram removidas.
  * O módulo `keyring_oci`: Use o componente `component_keyring_oci` em vez disso. Veja a Seção 8.4.4.9, “Usando o componente de cartela de chave Oracle Cloud Infrastructure Vault”. As seguintes variáveis de sistema do servidor também foram removidas: `keyring_oci_ca_certificate`, `keyring_oci_compartment`, `keyring_oci_encryption_endpoint`, `keyring_oci_key_file`, `keyring_oci_key_fingerprint`, `keyring_oci_management_endpoint`, `keyring_oci_master_key`, `keyring_oci_secrets_endpoint`, `keyring_oci_tenancy`, `keyring_oci_user`, `keyring_oci_vaults_endpoint` e `keyring_oci_virtual_vault`.
  * O módulo `openssl_udf`: Use o componente de criptografia da MySQL Enterprise (`component_enterprise_encryption`); veja a Seção 8.6, “MySQL Enterprise Encryption”.

**Suporte para cifrações fracas**: Ao configurar conexões criptografadas, o MySQL 8.4.0 e versões posteriores não permitem mais especificar qualquer cifra que não atenda aos seguintes requisitos:

  * Conforme a versão adequada do TLS (TLS v1.2 ou TLSv1.3, conforme apropriado)
  * Fornece segurança reversa perfeita
  * Usa SHA2 na cifra, certificado ou em ambos
  * Usa AES em GCM ou qualquer outro algoritmo ou modo AEAD

Isso tem implicações para a configuração das seguintes variáveis de sistema:

  * `ssl_cipher`
  * `admin_ssl_cipher`
  * `tls_ciphersuites`
  * `admin_tls_ciphersuites`

Veja as descrições dessas variáveis para conhecer seus valores permitidos no MySQL 8.4 e mais informações.

::: info Nota

O `libmysqlclient` continua a suportar cifrações adicionais que não satisfazem essas condições para manter a capacidade de se conectar a versões mais antigas do MySQL.

:::

**`INFORMATION_SCHEMA.TABLESPACES`**: A tabela `INFORMATION_SCHEMA.TABLESPACES`, que na verdade não era usada, foi descontinuada no MySQL 8.0.22 e agora foi removida.

::: info Nota

Para tabelas `NDB`, a tabela `INFORMATION_SCHEMA.FILES` fornece informações sobre o tablespace.

Para tabelas `InnoDB`, as tabelas `INFORMATION_SCHEMA.INNODB_TABLESPACES` e `INFORMATION_SCHEMA.INNODB_DATAFILES` fornecem metadados do tablespace.

**Cláusula `DROP TABLESPACE` e `ALTER TABLESPACE: ENGINE`**: A cláusula `ENGINE` para as instruções `DROP TABLESPACE` e `ALTER TABLESPACE` foi descontinuada no MySQL 8.0. No MySQL 8.4, ela não é mais suportada e causa um erro se você tentar usá-la com `DROP TABLESPACE` ou `ALTER TABLESPACE ... DROP DATAFILE`. `ENGINE` também não é mais suportada para todas as outras variantes de `ALTER TABLESPACE`, com as duas exceções listadas aqui:

  * `ALTER TABLESPACE ... ADD DATAFILE ENGINE={NDB|NDBCLUSTER}`
  * `ALTER UNDO TABLESPACE ... SET {ACTIVE|INACTIVE} ENGINE=INNODB`


Para mais informações, consulte a documentação dessas instruções.

**`LOW_PRIORITY com LOCK TABLES ... WRITE`**: A cláusula `LOW_PRIORITY` da instrução `LOCK TABLES ... WRITE` não tinha efeito desde o MySQL 5.5 e foi descontinuada no MySQL 5.6. Ela não é mais suportada no MySQL 8.4; incluir-a em `LOCK TABLES` agora causa um erro de sintaxe.

**Versão do formato `EXPLAIN=JSON`**: Agora é possível escolher entre duas versões do formato de saída JSON usado pelas instruções `EXPLAIN FORMAT=JSON` usando a variável de sistema `explain_json_format_version` introduzida nesta versão. Definir essa variável para `1` faz com que o servidor use a Versão 1, que é o formato linear que sempre foi usado para a saída de tais instruções no MySQL 8.2 e versões anteriores. Esse é o valor e o formato padrão no MySQL 8.4. Definir `explain_json_format_version` para `2` faz com que o formato da Versão 2 seja usado; esse formato de saída JSON é baseado em caminhos de acesso e é destinado a fornecer melhor compatibilidade com futuras versões do Otimizador do MySQL.

Veja Obter Informações do Plano de Execução para obter mais informações e exemplos.

**Capturando a saída `EXPLAIN FORMAT=JSON`**: `EXPLAIN FORMAT=JSON` foi estendido com uma opção `INTO`, que fornece a capacidade de armazenar a saída `EXPLAIN` formatada em JSON em uma variável do usuário, onde ela pode ser trabalhada usando funções JSON do MySQL, como este exemplo:

```sql
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

Essa opção só pode ser usada se a instrução `EXPLAIN` também contiver `FORMAT=JSON`; caso contrário, uma erro de sintaxe ocorre. Essa exigência não é afetada pelo valor de `explain_format`.

`INTO` pode ser usado com qualquer instrução explicável, com exceção de `EXPLAIN FOR CONNECTION`. Não pode ser usado com `EXPLAIN ANALYZE`.

Para mais informações e exemplos, consulte Obter Informações do Plano de Execução.

**`EXPLAIN FOR SCHEMA`**: Foi adicionada uma opção `FOR SCHEMA` à instrução `EXPLAIN`. A sintaxe é mostrada aqui, onde *`stmt`* é uma instrução explicável:

```sql
EXPLAIN [opções] FOR SCHEMA schema_name stmt
```

Isso faz com que `stmt` seja executado como se estivesse no esquema nomeado.

`FOR DATABASE` também é suportado como sinônimo.

Essa opção não é compatível com `FOR CONNECTION`.

Consulte Obter Informações do Plano de Execução para mais informações.

**Comentários do cliente preservados**: No MySQL 8.0, a remoção de comentários do cliente `mysql` era o comportamento padrão; o padrão foi alterado para preservar tais comentários.

Para habilitar a remoção de comentários como era realizada no MySQL 8.0 e versões anteriores, inicie o cliente `mysql` com `--skip-comments`.

**Colunas `AUTO_INCREMENT` e de ponto flutuante**: O uso do modificador `AUTO_INCREMENT` com colunas `FLOAT` e `DOUBLE` nas instruções `CREATE TABLE` e `ALTER TABLE` foi desaconselhado no MySQL 8.0; o suporte a isso é removido completamente no MySQL 8.4, onde gera `ER_WRONG_FIELD_SPEC` (Especificador de coluna incorreto para coluna).

Antes de fazer a atualização para o MySQL 8.4 a partir de uma versão anterior, você *deve* corrigir qualquer tabela que contenha uma coluna `FLOAT` ou `DOUBLE` com `AUTO_INCREMENT` para que a tabela não use mais nenhuma dessas colunas. Caso contrário, a atualização falhará.

**Utilitário `mysql_ssl_rsa_setup`**: O utilitário `mysql_ssl_rsa_setup`, desatualizado no MySQL 8.0.34, foi removido. Para distribuições MySQL compiladas com OpenSSL, o servidor MySQL pode gerar automaticamente os arquivos SSL e RSA ausentes durante o inicialização. Consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”, para obter mais informações.

**Privilégios MySQL**: Adicionou o privilégio `SET_ANY_DEFINER` para a criação de objetos definidores e o privilégio `ALLOW_NONEXISTENT_DEFINER` para proteção de objetos órfãos. Juntos, esses privilégios coexistem com o privilégio desatualizado `SET_USER_ID`.

**Privilégio `SET_USER_ID`**: O privilégio `SET_USER_ID`, desatualizado no MySQL 8.2.0, foi removido. O uso em declarações `GRANT` agora causa um erro de sintaxe.

Em vez de `SET_USER_ID`, você pode usar o privilégio `SET_ANY_DEFINER` para a criação de objetos definidores e os privilégios `ALLOW_NONEXISTENT_DEFINER` para proteção de objetos órfãos.

Ambos os privilégios são necessários para criar objetos SQL órfãos usando `CREATE PROCEDURE`, `CREATE FUNCTION`, `CREATE TRIGGER`, `CREATE EVENT` ou `CREATE VIEW`.

**Opções de servidor `--abort-slave-event-count` e `--disconnect-slave-event-count`**: As opções de inicialização do servidor MySQL `--abort-slave-event-count` e `--disconnect-slave-event-count`, anteriormente usadas em testes, foram desaconselhadas no MySQL 8.0 e foram removidas nesta versão. Tentar iniciar o `mysqld` com qualquer uma dessas opções agora resulta em um erro.

**Ferramenta `mysql_upgrade`**: A ferramenta `mysql_upgrade`, desaconselhada no MySQL 8.0.16, foi removida.

**Ferramenta `mysqlpump`.** A ferramenta `mysqlpump`, juntamente com seus utilitários auxiliares **lz4_decompress** e **zlib_decompress**, desaconselhados no MySQL 8.0.34, foram removidos. Em vez disso, use as ferramentas de dump do `mysqldump` ou do MySQL Shell.

**Opções `CMake` obsoletas**: As seguintes opções para compilar o servidor com CMake eram obsoletas e foram removidas:

  * `USE_LD_LLD`: Use `WITH_LD=lld` em vez disso.
  * `WITH_BOOST`, `DOWNLOAD_BOOST`, `DOWNLOAD_BOOST_TIMEOUT`: Essas opções não são mais necessárias; o MySQL agora inclui e usa uma versão incorporada do Boost ao compilar a partir do código-fonte.

**Palavras-chave obsoletas**: Palavras-chave removidas no MySQL 8.4 desde o MySQL 8.0. Palavras-chave reservadas são marcadas com (R).

`GET_MASTER_PUBLIC_KEY`, `MASTER_AUTO_POSITION`, `MASTER_BIND` (R), `MASTER_COMPRESSION_ALGORITHMS`, `MASTER_CONNECT_RETRY`, `MASTER_DELAY`, `MASTER_HEARTBEAT_PERIOD`, `MASTER_HOST`, `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `MASTER_PASSWORD`, `MASTER_PORT`, `MASTER_PUBLIC_KEY_PATH`, `MASTER_RETRY_COUNT`, `MASTER_SSL`, `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT` (R), `MASTER_TLS_CIPHERSUITES`, `MASTER_TLS_VERSION`, `MASTER_USER` e `MASTER_ZSTD_COMPRESSION_LEVEL`.

**Prefixos de índice na chave de particionamento**: Colunas com prefixos de índice eram permitidos na chave de particionamento para uma tabela particionada no MySQL 8.0, e geravam uma mensagem de aviso sem outros efeitos ao criar, alterar ou atualizar uma tabela particionada. Tais colunas não são mais permitidas em tabelas particionadas, e o uso de qualquer dessas colunas na chave de particionamento faz com que a instrução `CREATE TABLE` ou `ALTER TABLE` seja rejeitada com um erro.

Para mais informações, consulte Prefixos de índice de coluna não suportados para particionamento de chave.