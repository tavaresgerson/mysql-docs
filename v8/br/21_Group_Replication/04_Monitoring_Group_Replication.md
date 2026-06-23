## 20.4 Replicação do Grupo de Monitoramento

Você pode usar o MySQL [Performance Schema][(performance-schema.html "Chapter 29 MySQL Performance Schema")] para monitorar a Replicação de Grupo. Essas tabelas do Schema de Desempenho exibem informações específicas para a Replicação de Grupo:

* `replication_group_member_stats`: Veja a Seção 20.4.4, “A tabela replication_group_member_stats”.

* `replication_group_members`: Veja a Seção 20.4.3, “A tabela replication_group_members”.

* `replication_group_communication_information`: Veja a Seção 29.12.11.12, “A tabela de comunicação do grupo replication_group”.

Essas tabelas de replicação do Schema de desempenho também mostram informações relacionadas à Replicação de grupo:

* `replication_connection_status` mostra informações sobre a Replicação por Grupo, como as transações recebidas do grupo e colocadas na fila de aplicador (registro de relevo).

* `replication_applier_status` mostra os estados dos canais e dos fios relacionados à Replicação por Grupo. Esses também podem ser usados para monitorar o que as threads individuais dos trabalhadores estão fazendo.

Os canais de replicação criados pelo plugin de replicação do grupo estão listados aqui:

* `group_replication_recovery`: Usado para mudanças de replicação relacionadas à recuperação distribuída.

* `group_replication_applier`: Usado para as alterações recebidas do grupo, para aplicar transações que vêm diretamente do grupo.

Para obter informações sobre as variáveis do sistema que afetam a Replicação em Grupo, consulte a Seção 20.9.1, “Variáveis do Sistema de Replicação em Grupo”. Consulte a Seção 20.9.2, “Variáveis de Status da Replicação em Grupo”, para obter variáveis de status que fornecem informações sobre a Replicação em Grupo.

Começando com o MySQL 8.0.21, as mensagens relacionadas a eventos do ciclo de vida da Replicação de Grupo, exceto erros, são classificadas como mensagens de sistema; essas são sempre escritas no log de erro do membro do grupo de replicação. Você pode usar essas informações para revisar o histórico da participação de um servidor específico em um grupo de replicação. (Anteriormente, esses eventos eram classificados como mensagens de informação; para um servidor MySQL de uma versão anterior ao 8.0.21, essas mensagens podem ser adicionadas ao log de erro definindo `log_error_verbosity` como `3`.)

Alguns eventos do ciclo de vida que afetam todo o grupo são registrados em cada membro do grupo, como um novo membro entrando no status `ONLINE` no grupo ou uma eleição primária. Outros eventos são registrados apenas no membro onde ocorrem, como o modo de leitura exclusiva super ser habilitado ou desabilitado no membro, ou o membro deixando o grupo. Vários eventos do ciclo de vida que podem indicar um problema se ocorrerem frequentemente são registrados como mensagens de alerta, incluindo um membro se tornando inacessível e depois acessível novamente, e um membro começando a recuperação distribuída por transferência de estado do log binário ou por uma operação de clonagem remota.

Nota

Se você está monitorando uma ou mais instâncias secundárias usando **mysqladmin**, você deve estar ciente de que uma declaração `FLUSH STATUS` executada por este utilitário cria um evento GTID na instância local, o que pode afetar operações futuras do grupo.

### 20.4.1 GTIDs e Replicação de Grupo

A Replicação em Grupo usa GTIDs (identificadores globais de transação) para rastrear exatamente quais transações foram comprometidas em cada instância do servidor. As configurações `gtid_mode=ON` e `enforce_gtid_consistency=ON` são necessárias em todos os membros do grupo. As transações recebidas dos clientes são atribuídas um GTID pelo membro do grupo que as recebe. Quaisquer transações replicadas que são recebidas pelos membros do grupo em canais de replicação assíncrona de servidores de origem externos ao grupo retêm os GTIDs que possuem quando chegam ao membro do grupo.

Os GTIDs que são atribuídos a transações recebidas de clientes utilizam o nome do grupo especificado pela variável de sistema `group_replication_group_name` como a parte UUID do identificador, em vez do UUID do servidor do membro do grupo individual que recebeu a transação. Portanto, todas as transações recebidas diretamente pelo grupo podem ser identificadas e agrupadas em conjuntos de GTIDs, e não importa qual membro as recebeu originalmente. Cada membro do grupo tem um bloco de GTIDs consecutivos reservado para seu uso, e quando esses são consumidos, reserva mais. A variável de sistema `group_replication_gtid_assignment_block_size` define o tamanho dos blocos, com um padrão de 1 milhão de GTIDs em cada bloco.

Os eventos de alteração de visão (`View_change_log_event`), que são gerados pelo próprio grupo quando um novo membro se junta, são atribuídos GTIDs quando são registrados no log binário. Por padrão, os GTIDs desses eventos também usam o nome do grupo especificado pela variável de sistema `group_replication_group_name` como a parte UUID do identificador. A partir do MySQL 8.0.26, você pode definir a variável de sistema de Replicação de Grupo `group_replication_view_change_uuid` para usar um UUID alternativo nos GTIDs para eventos de alteração de visão, para que eles sejam fáceis de distinguir das transações recebidas pelo grupo dos clientes. Isso pode ser útil se sua configuração permitir o failover entre grupos e você precisar identificar e descartar transações que eram específicas ao grupo de backup. O UUID alternativo deve ser diferente dos UUIDs do servidor dos membros. Também deve ser diferente de quaisquer UUIDs nos GTIDs aplicados a transações anônimas usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`.

A partir do MySQL 8.0.27, as configurações `GTID_ONLY=1`, `REQUIRE_ROW_FORMAT = 1` e `SOURCE_AUTO_POSITION = 1` são aplicadas para os canais de Replicação de Grupo `group_replication_applier` e `group_replication_recovery`. As configurações são feitas automaticamente nos canais de Replicação de Grupo quando eles são criados, ou quando um servidor membro em um grupo de replicação é atualizado para 8.0.27 ou superior. Essas opções são normalmente definidas usando uma declaração `CHANGE REPLICATION SOURCE TO`, mas note que você não pode desativá-las para um canal de Replicação de Grupo. Com essas opções definidas, o membro do grupo não persistirá nomes de arquivos e posições de arquivo nos repositórios de metadados de replicação para esses canais. O posicionamento automático GTID e o desvio automático GTID são usados para localizar as posições corretas do receptor e do aplicável quando necessário.

#### Transações Extras

Se um membro associado tiver transações em seu conjunto GTID que não estão presentes nos membros existentes do grupo, não é permitido completar o processo de recuperação distribuída e não pode se associar ao grupo. Se uma operação de clonagem remota foi realizada, essas transações seriam excluídas e perdidas, porque o diretório de dados no membro associado é apagado. Se a transferência de estado de um log binário de um doador foi realizada, essas transações poderiam entrar em conflito com as transações do grupo.

Transações extras podem estar presentes em um membro se uma transação administrativa for realizada na instância enquanto a Replicação de Grupo está parada. Para evitar a introdução de novas transações dessa maneira, sempre defina o valor da variável de sistema `sql_log_bin` para `OFF` antes de emitir declarações administrativas e, posteriormente, de volta para `ON`:

```
SET SQL_LOG_BIN=0;
<administrator action>
SET SQL_LOG_BIN=1;
```

Definir essa variável de sistema para `OFF` significa que as transações que ocorrem a partir desse ponto até que você a defina novamente para `ON` não serão escritas no log binário e não receberão GTIDs atribuídos a elas.

Se uma transação extra estiver presente em um membro associado, verifique o log binário do servidor afetado para ver o que a transação extra realmente contém. O método mais seguro para conciliar os dados do membro associado e o conjunto de GTID com os membros atualmente no grupo é usar a funcionalidade de clonagem do MySQL para transferir o conteúdo de um servidor no grupo para o servidor afetado. Para obter instruções sobre como fazer isso, consulte a Seção 7.6.7.3, “Clonagem de Dados Remotas”. Se a transação for necessária, execute-a novamente após o membro ter se associado com sucesso.

### 20.4.2 Estados do servidor de replicação em grupo

O estado de um membro de um grupo de replicação em grupo mostra seu papel atual no grupo. A tabela do Schema de desempenho `replication_group_members` mostra o estado de cada membro em um grupo. Se o grupo estiver totalmente funcional e todos os membros estarem se comunicando corretamente, todos os membros relatam o mesmo estado para todos os outros membros. No entanto, um membro que deixou o grupo ou faz parte de uma partição de rede não pode relatar informações precisas sobre os outros servidores. Nessa situação, o membro não tenta adivinhar o status dos outros servidores e, em vez disso, os relata como inalcançáveis.

Um membro do grupo pode estar nos seguintes estados:

`ONLINE` :   O servidor é um membro ativo de um grupo e em um estado totalmente funcional. Outros membros do grupo podem se conectar a ele, assim como os clientes, se aplicável. Um membro só está totalmente sincronizado com o grupo e participando dele quando está no estado `ONLINE`.

`RECOVERING` :   O servidor se juntou a um grupo e está no processo de se tornar um membro ativo. A recuperação distribuída está ocorrendo atualmente, onde o membro está recebendo uma transferência de estado de um doador usando uma operação de clonagem remota ou o log binário do doador. Este estado é

Para mais informações, consulte a Seção 20.5.4, “Recuperação Distribuída”.

`OFFLINE` : O plugin de replicação de grupo é carregado, mas o membro não pertence a nenhum grupo. Esse status pode ocorrer brevemente enquanto um membro está se juntando ou se reinsertando em um grupo.

`ERROR` : O membro está em um estado de erro e não está funcionando corretamente como membro do grupo. Um membro pode entrar em estado de erro durante a aplicação de transações ou durante a fase de recuperação. Um membro neste estado não participa das transações do grupo. Para mais informações sobre os possíveis motivos dos estados de erro, consulte a Seção 20.7.7, “Respostas à Detecção de Falha e Partição de Rede”.

Dependendo da ação de saída definida por `group_replication_exit_state_action`, o membro está no modo de leitura somente (`super_read_only=ON`) e também pode estar no modo offline (`offline_mode=ON`). Observe que um servidor em modo offline após a ação de saída `OFFLINE_MODE` é exibido com o status `ERROR`, não `OFFLINE`. Um servidor com a ação de saída `ABORT_SERVER` é desligado e removido da visão do grupo. Para mais informações, consulte a Seção 20.7.7.4, “Ação de Saída”.

Enquanto um membro se junta ou se reinserta em um grupo de replicação, seu status pode ser exibido como `ERROR` antes que o grupo complete as verificações de compatibilidade e o aceite como membro.

`UNREACHABLE` :   O detector de falha local suspeita que o membro não pode ser contatado, porque as mensagens do grupo estão expirando. Isso pode acontecer, por exemplo, se um membro for desconectado involuntariamente. Se você ver esse status em outros servidores, também pode significar que o membro onde você consulta esta tabela faz parte de uma partição, onde um subconjunto dos servidores do grupo pode se comunicar entre si, mas não pode se comunicar com os outros servidores do grupo. Para mais informações, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

Veja a Seção 20.4.3, “A tabela replication_group_members”, para um exemplo do conteúdo da tabela do Schema de desempenho.

### 20.4.3 A tabela replication_group_members

A tabela `performance_schema.replication_group_members` é usada para monitorar o status das diferentes instâncias do servidor que são membros do grupo. As informações na tabela são atualizadas sempre que houver uma mudança de visão, por exemplo, quando a configuração do grupo é alterada dinamicamente quando um novo membro se junta. Nesse ponto, os servidores trocam parte de seus metadados para se sincronizar e continuar a cooperar juntos. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, para que as informações sobre todos os membros do grupo possam ser consultadas a partir de qualquer membro. Esta tabela pode ser usada para obter uma visão de alto nível do estado de um grupo de replicação, por exemplo, emitindo:

```
SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | d391e9ee-2691-11ec-bf61-00059a3c7a00 | example1    |        4410 | ONLINE       | PRIMARY     | 8.0.27         | XCom                       |
| group_replication_applier | e059ce5c-2691-11ec-8632-00059a3c7a00 | example2    |        4420 | ONLINE       | SECONDARY   | 8.0.27         | XCom                       |
| group_replication_applier | ecd9ad06-2691-11ec-91c7-00059a3c7a00 | example3    |        4430 | ONLINE       | SECONDARY   | 8.0.27         | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
3 rows in set (0.0007 sec)
```

Com base nesse resultado, podemos ver que o grupo consiste em três membros. A tabela mostra o `server_uuid` de cada membro, bem como o nome do host e o número de porta do membro, que os clientes usam para se conectar a ele. A coluna `MEMBER_STATE` mostra uma das Seções 20.4.2, “Estados do servidor de replicação de grupo”, neste caso, mostra que todos os três membros deste grupo são `ONLINE`, e a coluna `MEMBER_ROLE` mostra que há dois secundários e um único primário. Portanto, este grupo deve estar executando no modo single-primary. A coluna `MEMBER_VERSION` pode ser útil quando você está atualizando um grupo e está combinando membros que executam diferentes versões do MySQL. A coluna `MEMBER_COMMUNICATION_STACK` mostra a pilha de comunicação usada para o grupo.

Para mais informações sobre o valor `MEMBER_HOST` e seu impacto no processo de recuperação distribuída, consulte a Seção 20.2.1.3, “Credenciais do usuário para recuperação distribuída”.

### 20.4.4 A tabela replication_group_member_stats

Cada membro de um grupo de replicação certifica e aplica as transações recebidas pelo grupo. As estatísticas sobre os procedimentos de certificação e aplicação são úteis para entender como a fila de aplicação está crescendo, quantos conflitos foram encontrados, quantas transações foram verificadas, quais transações estão comprometidas em todos os lugares, e assim por diante.

A tabela `performance_schema.replication_group_member_stats` fornece informações em nível de grupo relacionadas ao processo de certificação, e também estatísticas para as transações recebidas e geradas por cada membro individual do grupo de replicação. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, portanto, as informações sobre todos os membros do grupo podem ser consultadas por qualquer membro. Note que o atualização das estatísticas para membros remotos é controlada pelo período de mensagem especificado na opção `group_replication_flow_control_period`, portanto, essas podem diferir ligeiramente das estatísticas coletadas localmente para o membro onde a consulta é feita. Para usar esta tabela para monitorar um membro de Replicação de Grupo, emita a seguinte declaração:

```
mysql> SELECT * FROM performance_schema.replication_group_member_stats\G
```

Começando com o MySQL 8.0.19, você também pode usar a seguinte declaração:

```
mysql> TABLE performance_schema.replication_group_member_stats\G
```

Essas colunas são importantes para monitorar o desempenho dos membros conectados no grupo. Suponha que um dos membros do grupo sempre reporte um grande número de transações em sua fila em comparação com outros membros. Isso significa que o membro está atrasado e não consegue se manter atualizado com os outros membros do grupo. Com base nessa informação, você pode decidir remover o membro do grupo ou adiar o processamento das transações nos outros membros do grupo, a fim de reduzir o número de transações em fila. Essas informações também podem ajudá-lo a decidir como ajustar o controle de fluxo do plugin de Replicação do Grupo, veja Seção 20.7.2, “Controle de Fluxo”.