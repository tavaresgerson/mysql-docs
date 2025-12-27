#### 15.4.2.5 Declaração `STOP REPLICA`

```
STOP REPLICA [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Para de replicar os threads.

A declaração `STOP REPLICA` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`). A melhor prática recomendada é executar `STOP REPLICA` na replica antes de parar o servidor de replicação (consulte a Seção 7.1.19, “O Processo de Parada do Servidor”, para obter mais informações).

Assim como `START REPLICA`, esta declaração pode ser usada com as opções `IO_THREAD` e `SQL_THREAD` para nomear o(s) thread(s) de replicação a serem parados. Observe que o canal do aplicável de replicação em grupo (`group_replication_applier`) não tem nenhum thread de I/O (receptor) de replicação, apenas um thread de replicação SQL (aplicável). Portanto, usar a opção `SQL_THREAD` para parar completamente esse canal.

A `STOP REPLICA` causa um commit implícito de uma transação em andamento. Consulte a Seção 15.3.3, “Declarações que Causam um Commit Implícito”.

`gtid_next` deve ser definido como `AUTOMATIC` antes de emitir esta declaração.

Você pode controlar quanto tempo a `STOP REPLICA` espera antes de expirar, definindo a variável de sistema `rpl_stop_replica_timeout`. Isso pode ser usado para evitar deadlocks entre `STOP REPLICA` e outras declarações SQL que usam diferentes conexões de cliente para a replica. Quando o valor do tempo limite é alcançado, o cliente que emitiu o comando retorna uma mensagem de erro e para de esperar, mas a instrução `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixam de estar ocupados, a declaração `STOP REPLICA` é executada e a replica para.

Algumas declarações `CHANGE REPLICATION SOURCE TO` são permitidas enquanto a replica está em execução, dependendo dos estados dos threads de replicação. No entanto, usar `STOP REPLICA` antes de executar uma declaração `CHANGE REPLICATION SOURCE TO` nesses casos ainda é suportado. Consulte a Seção 15.4.2.2, “Declaração CHANGE REPLICATION SOURCE TO”, e a Seção 19.4.8, “Alterar fontes durante o failover”, para obter mais informações.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `STOP REPLICA` a um canal de replicação específico. Se nenhum canal for nomeado e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `STOP REPLICA` não nomear um canal ao usar múltiplos canais, essa declaração para de funcionar para todos os canais. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

Os canais de replicação para a replicação em grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. `STOP REPLICA` não pode ser usado com o canal `group_replication_recovery`, e deve ser usado apenas com o canal `group_replication_applier` quando a replicação em grupo não estiver em execução. O canal `group_replication_applier` tem apenas um thread de aplicável e não tem nenhum thread de receptor, então ele pode ser parado se necessário usando a opção `SQL_THREAD` sem a opção `IO_THREAD`.

Quaisquer lacunas na sequência de transações executadas a partir do log de retransmissão são fechadas como parte da parada dos threads do trabalhador. Se a replica for parada inesperadamente (por exemplo, devido a um erro em um thread do trabalhador ou outro thread emitindo `KILL`), enquanto uma instrução `STOP REPLICA` estiver sendo executada, a sequência de transações executadas a partir do log de retransmissão pode se tornar inconsistente. Consulte a Seção 19.5.1.35, “Inconsistências de Replicação e Transações”, para obter mais informações.

Quando a fonte estiver usando o formato de registro binário baseado em linhas, você deve executar `STOP REPLICA` ou `STOP REPLICA SQL_THREAD` na replica antes de desligar o servidor da replica, se você estiver replicando tabelas que usam um motor de armazenamento não transakcional. Se o grupo de eventos de replicação atual tiver modificado uma ou mais tabelas não transakcionais, `STOP REPLICA` aguarda até 60 segundos para que o grupo de eventos seja concluído, a menos que você emita uma instrução `KILL QUERY` ou `KILL CONNECTION` para o thread SQL da replicação. Se o grupo de eventos permanecer incompleto após o tempo limite, uma mensagem de erro é registrada.

Quando a fonte estiver usando o formato de registro binário baseado em instruções, alterar a fonte enquanto tiver tabelas temporárias abertas é potencialmente inseguro. Esta é uma das razões pelas quais a replicação baseada em instruções de tabelas temporárias não é recomendada. Você pode descobrir se há tabelas temporárias na replica verificando o valor de `Replica_open_temp_tables`. Ao usar a replicação baseada em instruções, esse valor deve ser 0 antes de executar `CHANGE REPLICATION SOURCE TO`. Se houver alguma tabela temporária aberta na replica, emitir uma instrução `CHANGE REPLICATION SOURCE TO` após emitir uma `STOP REPLICA` causa um aviso `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`.