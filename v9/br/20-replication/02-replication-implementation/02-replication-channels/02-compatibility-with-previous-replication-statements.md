#### 19.2.2.2 Compatibilidade com Declarações de Replicação Prévias

Quando uma replica tem vários canais e a opção `FOR CHANNEL channel` não é especificada, uma declaração válida geralmente atua em todos os canais disponíveis, com algumas exceções específicas.

Por exemplo, as seguintes declarações se comportam conforme esperado para todos, exceto certos canais de Replicação de Grupo:

* `START REPLICA` inicia os threads de replicação para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

* `STOP REPLICA` para de iniciar os threads de replicação para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

* `SHOW REPLICA STATUS` relata o status para todos os canais, exceto o canal `group_replication_applier`.

* `RESET REPLICA` redefini o estado de todos os canais.

Aviso

Use `RESET REPLICA` com cautela, pois essa declaração exclui todos os canais existentes, limpa seus arquivos de log de relevo e recria apenas o canal padrão.

Algumas declarações de replicação não podem operar em todos os canais. Nesse caso, o erro 1964 Múltiplos canais existem na replica é gerado. As seguintes declarações e funções geram esse erro quando usadas em uma topologia de replicação de múltiplos fontes e uma opção `FOR CHANNEL channel` não é usada para especificar qual canal deve ser atuado:

* `SHOW RELAYLOG EVENTS`
* `CHANGE REPLICATION SOURCE TO`
* `SOURCE_POS_WAIT()`

Observe que um canal padrão sempre existe em uma topologia de replicação de uma única fonte, onde declarações e funções se comportam como nas versões anteriores do MySQL.