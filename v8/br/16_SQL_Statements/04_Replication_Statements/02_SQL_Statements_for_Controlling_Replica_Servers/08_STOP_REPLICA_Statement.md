#### 15.4.2.8 Declaração de PARAR REPLICA

```
STOP REPLICA [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Para interromper os threads de replicação. A partir do MySQL 8.0.22, use `STOP REPLICA` no lugar de `STOP SLAVE`, que agora está desatualizado. Em versões anteriores ao MySQL 8.0.22, use `STOP SLAVE`.

O `STOP REPLICA` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`). A melhor prática recomendada é executar o `STOP REPLICA` na replica antes de parar o servidor da replica (consulte a Seção 7.1.19, “O processo de desligamento do servidor”, para obter mais informações).

Assim como `START REPLICA`, esta declaração pode ser usada com as opções `IO_THREAD` e `SQL_THREAD` para nomear o(s) fio(s) de replicação a serem interrompidos. Observe que o canal do aplicativo de replicação de grupo (`group_replication_applier`) não tem nenhum fio de I/O de replicação (receptor), apenas um fio de replicação SQL (aplicativo). Portanto, usar a opção `SQL_THREAD` interrompe completamente esse canal.

`STOP REPLICA` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

`gtid_next` deve ser definido como `AUTOMATIC` antes de emitir esta declaração.

Você pode controlar quanto tempo o `STOP REPLICA` espera antes de expirar o tempo de espera, definindo a variável de sistema `rpl_stop_replica_timeout` (a partir do MySQL 8.0.26) ou `rpl_stop_slave_timeout` (antes do MySQL 8.0.26). Isso pode ser usado para evitar deadlocks entre o `STOP REPLICA` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica. Quando o valor de tempo de espera é alcançado, o cliente que emitiu o comando retorna uma mensagem de erro e para de esperar, mas a instrução `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixarem de estar ocupados, a instrução `STOP REPLICA` é executada e a replica para.

Algumas declarações `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` são permitidas enquanto a replica está em execução, dependendo dos estados dos threads de replicação. No entanto, o uso de `STOP REPLICA` antes de executar uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` nesses casos ainda é suportado. Consulte a Seção 15.4.2.3, “Declaração de MUDANÇA DE FONTE DE REPLICA PARA”, a Seção 15.4.2.1, “Declaração de MUDANÇA DE MASTER PARA” e a Seção 19.4.8, “Mudança de Fontes Durante o Failover”, para obter mais informações.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A cláusula `FOR CHANNEL channel` aplica a declaração `STOP REPLICA` a um canal de replicação específico. Se nenhum canal for nomeado e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `STOP REPLICA` não nomear um canal ao usar vários canais, essa declaração interrompe os threads especificados para todos os canais. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Os canais de replicação para a Replicação em Grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O canal `STOP REPLICA` não pode ser usado com o canal `group_replication_recovery`, e deve ser usado apenas com o canal `group_replication_applier` quando a Replicação em Grupo não estiver em execução. O canal `group_replication_applier` tem apenas um fio de aplicador e não tem fio de receptor, portanto, pode ser parado se necessário, usando a opção `SQL_THREAD` sem a opção `IO_THREAD`.

Quando a replica é multithreading (`replica_parallel_workers` ou `slave_parallel_workers` é um valor não nulo), quaisquer lacunas na sequência de transações executadas a partir do log de retransmissão são fechadas como parte da parada dos threads do trabalhador. Se a replica for parada inesperadamente (por exemplo, devido a um erro em um thread do trabalhador ou outro thread emitindo `KILL`), enquanto uma instrução `STOP REPLICA` estiver sendo executada, a sequência de transações executadas a partir do log de retransmissão pode se tornar inconsistente. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”, para obter mais informações.

Quando a fonte estiver usando o formato de registro binário baseado em linha, você deve executar `STOP REPLICA` ou `STOP REPLICA SQL_THREAD` na replica antes de desligar o servidor da replica, se você estiver replicando tabelas que utilizam um motor de armazenamento não transacional. Se o grupo de eventos de replicação atual tiver modificado uma ou mais tabelas não transacionais, `STOP REPLICA` aguarda até 60 segundos para que o grupo de eventos seja concluído, a menos que você emita uma declaração `KILL QUERY` ou `KILL CONNECTION` para o thread de SQL de replicação. Se o grupo de eventos permanecer incompleto após o tempo limite, uma mensagem de erro é registrada.

Quando a fonte está usando o formato de registro binário baseado em declarações, alterar a fonte enquanto ela tiver tabelas temporárias abertas pode ser potencialmente inseguro. Esta é uma das razões pelas quais a replicação baseada em declarações de tabelas temporárias não é recomendada. Você pode descobrir se há alguma tabela temporária na replica verificando o valor de `Replica_open_temp_tables` ou `Slave_open_temp_tables`. Ao usar a replicação baseada em declarações, esse valor deve ser 0 antes de executar `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Se houver alguma tabela temporária aberta na replica, emitir uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` após emitir uma declaração `STOP REPLICA` causa um aviso `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`.
