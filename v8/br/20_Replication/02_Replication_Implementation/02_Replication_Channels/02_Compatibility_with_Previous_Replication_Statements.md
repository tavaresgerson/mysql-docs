#### 19.2.2.2. Compatibilidade com declarações de replicação anteriores

Quando uma réplica tem vários canais e a opção `FOR CHANNEL channel` não é especificada, uma declaração válida geralmente atua em todos os canais disponíveis, com algumas exceções específicas.

Por exemplo, as seguintes declarações funcionam conforme o esperado para todos, exceto para certos canais de replicação em grupo:

- `START REPLICA` inicia os threads de replicação para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

- `STOP REPLICA` para a replicação de threads para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

- `SHOW REPLICA STATUS` relata o status para todos os canais, exceto o canal `group_replication_applier`.

- `RESET REPLICA` redefini todos os canais.

Aviso

Use `RESET REPLICA` com cautela, pois essa declaração exclui todos os canais existentes, limpa seus arquivos de log de retransmissão e recria apenas o canal padrão.

Algumas declarações de replicação não podem ser aplicadas em todos os canais. Nesse caso, é gerado o erro 1964 "Múltiplos canais existem na replica". Forneça o nome do canal como argumento. As seguintes declarações e funções geram esse erro quando usadas em uma topologia de replicação de múltiplas fontes e a opção `FOR CHANNEL channel` não é usada para especificar qual canal deve ser afetado:

- `SHOW RELAYLOG EVENTS`
- `CHANGE REPLICATION SOURCE TO`
- `CHANGE MASTER TO`
- `MASTER_POS_WAIT()`
- `SOURCE_POS_WAIT()`

Observe que um canal padrão sempre existe em uma topologia de replicação de uma única fonte, onde as declarações e funções se comportam como nas versões anteriores do MySQL.
