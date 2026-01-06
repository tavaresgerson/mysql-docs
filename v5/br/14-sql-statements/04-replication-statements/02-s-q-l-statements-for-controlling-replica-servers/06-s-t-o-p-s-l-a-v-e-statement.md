#### 13.4.2.6 Declaração de PARAR SLAVE

```sql
STOP SLAVE [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Para interromper os threads de replicação, o comando `[STOP SLAVE]` (stop-slave.html) requer o privilégio `[SUPER]` (privilegios-fornecidos.html#priv\_super). A melhor prática recomendada é executar `STOP SLAVE` na replica antes de interromper o servidor da replica (consulte Seção 5.1.16, "O processo de desligamento do servidor" para obter mais informações).

*Ao usar o formato de registro baseado em linhas*: Você deve executar `STOP SLAVE` ou `STOP SLAVE SQL_THREAD` na replica antes de desligar o servidor da replica, se você estiver replicando tabelas que utilizam um motor de armazenamento não transacional (consulte a *Nota* mais adiante nesta seção).

Assim como `START SLAVE`, essa declaração pode ser usada com as opções `IO_THREAD` e `SQL_THREAD` para nomear o(s) thread(s) a serem interrompidos. Observe que o canal do aplicativo de replicação de grupo (`group_replication_applier`) não tem um thread de I/O de replicação, apenas um thread de SQL de replicação. Portanto, usar a opção `SQL_THREAD` interrompe completamente esse canal.

`STOP SLAVE` causa um commit implícito de uma transação em andamento. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

`gtid_next` deve ser definido como `AUTOMATIC` antes de emitir essa declaração.

Você pode controlar quanto tempo o `STOP SLAVE` espera antes de expirar o tempo de espera configurando a variável de sistema `rpl_stop_slave_timeout`. Isso pode ser usado para evitar deadlocks entre o `STOP SLAVE` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica. Quando o valor do tempo de espera é alcançado, o cliente que emitiu o comando retorna uma mensagem de erro e para de esperar, mas a instrução `STOP SLAVE` permanece em vigor. Uma vez que os threads de replicação deixarem de estar ocupados, a instrução `STOP SLAVE` é executada e a replica para.

Algumas instruções `CHANGE MASTER TO` são permitidas enquanto a réplica estiver em execução, dependendo dos estados do fio de SQL de replicação e do fio de E/S de replicação. No entanto, usar `STOP SLAVE` antes de executar `CHANGE MASTER TO` nesses casos ainda é suportado. Consulte Seção 13.4.2.1, “Instrução CHANGE MASTER TO” e Seção 16.3.7, “Alterando Fontes Durante o Failover” para obter mais informações.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a instrução se aplica. Ao fornecer uma cláusula `FOR CHANNEL channel`, a instrução `STOP SLAVE` é aplicada a um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais extras, a instrução se aplica ao canal padrão. Se uma instrução `STOP SLAVE` não nomear um canal ao usar múltiplos canais, essa instrução para de funcionar para todos os canais. Esta instrução não pode ser usada com o canal `group_replication_recovery`. Consulte Seção 16.2.2, “Canais de replicação” para obter mais informações.

*Ao usar a replicação baseada em instruções*: alterar a fonte enquanto ela tem tabelas temporárias abertas é potencialmente inseguro. Esta é uma das razões pelas quais a replicação baseada em instruções de tabelas temporárias não é recomendada. Você pode descobrir se há alguma tabela temporária na replica verificando o valor de `Slave_open_temp_tables`; ao usar a replicação baseada em instruções, esse valor deve ser 0 antes de executar `CHANGE MASTER TO`. Se houver alguma tabela temporária aberta na replica, emitir uma instrução `CHANGE MASTER TO` após emitir uma `STOP SLAVE` causa um aviso `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`.

Quando você usa uma replica multithread (`slave_parallel_workers` é um valor não nulo), quaisquer lacunas na sequência de transações executadas a partir do log de retransmissão são fechadas como parte da parada dos threads do trabalhador. Se a replica for parada inesperadamente (por exemplo, devido a um erro em um thread do trabalhador ou outro thread emitindo `KILL`), enquanto uma instrução `STOP SLAVE` estiver sendo executada, a sequência de transações executadas a partir do log de retransmissão pode se tornar inconsistente. Consulte Seção 16.4.1.32, “Replicação e Inconsistências de Transações” para obter mais informações.

Se o grupo atual de eventos de replicação tiver modificado uma ou mais tabelas não transacionais, o SLAVE aguarda até 60 segundos para que o grupo de eventos seja concluído, a menos que você emita uma instrução `KILL QUERY` ou `KILL CONNECTION` para o thread SQL de replicação. Se o grupo de eventos permanecer incompleto após o tempo limite, uma mensagem de erro é registrada.
