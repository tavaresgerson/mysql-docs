#### 16.2.2.2. Compatibilidade com declarações de replicação anteriores

Quando uma réplica tem vários canais e a opção `FOR CHANNEL` não é especificada, uma declaração válida geralmente atua em todos os canais disponíveis, com algumas exceções específicas.

Por exemplo, as seguintes declarações funcionam conforme o esperado para todos, exceto para certos canais de replicação em grupo:

- `START SLAVE` inicia os threads de replicação para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

- `STOP SLAVE` para de replicar os threads para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

- `SHOW SLAVE STATUS` relata o status para todos os canais, exceto o canal `group_replication_applier`.

- `FLUSH RELAY LOGS` esvazia os logs do retransmissor para todos os canais, exceto o canal `group_replication_applier`.

- O botão `RESET SLAVE` redefini todos os canais.

Aviso

Use `RESET SLAVE` com cautela, pois essa declaração exclui todos os canais existentes, limpa seus arquivos de log de retransmissão e recria apenas o canal padrão.

Algumas declarações de replicação não podem ser aplicadas em todos os canais. Nesse caso, é gerado o erro 1964 Múltiplos canais existem no escravo. Por favor, forneça o nome do canal como argumento. As seguintes declarações e funções geram esse erro quando usadas em uma topologia de replicação de múltiplas fontes e a opção `FOR CHANNEL channel` não é usada para especificar qual canal deve ser afetado:

- `Mostre eventos do RELAYLOG`
- `MUDAR MASTER PARA`
- `MASTER_POS_WAIT()`
- `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`

Observe que um canal padrão sempre existe em uma topologia de replicação de uma única fonte, onde as declarações e funções se comportam como nas versões anteriores do MySQL.
