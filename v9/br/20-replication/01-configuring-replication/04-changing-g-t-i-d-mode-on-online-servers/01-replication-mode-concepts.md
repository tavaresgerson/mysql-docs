#### 19.1.4.1 Conceitos do Modo de Replicação

Antes de definir o modo de replicação de um servidor online, é importante entender alguns conceitos-chave da replicação. Esta seção explica esses conceitos e é uma leitura essencial antes de tentar modificar o modo de replicação de um servidor online.

Os modos de replicação disponíveis no MySQL dependem de diferentes técnicas para identificar transações registradas. Os tipos de transações usados pela replicação estão listados aqui:

* Uma transação GTID é identificada por um identificador de transação global (GTID) que assume uma das duas formas: `UUID:NUMBER` ou `UUID:TAG:NUMBER`. Cada transação GTID na log binária é precedida por um `Gtid_log_event`. Uma transação GTID pode ser endereçada pelo seu GTID ou pelo nome do arquivo em que é registrada e sua posição dentro desse arquivo.

* Uma transação anônima não tem GTID; o MySQL 9.5 garante que cada transação anônima em um log seja precedida por um `Anonymous_gtid_log_event`. (Em versões antigas do MySQL, uma transação anônima não era precedida por nenhum evento específico.) Uma transação anônima pode ser endereçada apenas pelo nome do arquivo e pela posição.

Ao usar GTIDs, você pode aproveitar a autoposição do GTID e o failover automático, e usar `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids` e as tabelas do Schema de Desempenho para monitorar transações replicadas (veja a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”).

Uma transação em um log de retransmissão de uma fonte executando uma versão anterior do MySQL pode não ser precedida por nenhum evento específico, mas, após ser retransmitida e registrada no log binário da replica, é precedida por um `Anonymous_gtid_log_event`.

Para alterar o modo de replicação online, é necessário definir as variáveis `gtid_mode` e `enforce_gtid_consistency` usando uma conta que tenha privilégios suficientes para definir variáveis de sistema globais; consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Os valores permitidos para `gtid_mode` estão listados aqui, em ordem, com seus significados:

* `OFF`: Apenas transações anônimas podem ser replicadas.

* `OFF_PERMISSIVE`: Novas transações são anônimas; transações replicadas podem ser GTID ou anônimas.

* `ON_PERMISSIVE`: Novas transações usam GTIDs; transações replicadas podem ser GTID ou anônimas.

* `ON`: Todas as transações devem ter GTIDs; transações anônimas não podem ser replicadas.

É possível ter servidores que usam transações anônimas e servidores que usam transações GTID na mesma topologia de replicação. Por exemplo, uma fonte onde `gtid_mode=ON` pode replicar para uma replica onde `gtid_mode=ON_PERMISSIVE`.

A replicação a partir de uma fonte que usa `gtid_mode=ON` oferece a capacidade de usar o autoposicionamento GTID, configurado usando a opção `SOURCE_AUTO_POSITION` da declaração `CHANGE REPLICATION SOURCE TO`. A topologia de replicação em uso tem um impacto sobre a possibilidade de habilitar o autoposicionamento ou não, pois essa funcionalidade depende de GTIDs e não é compatível com transações anônimas. É altamente recomendável garantir que não haja transações anônimas restantes na topologia antes de habilitar o autoposicionamento; consulte a Seção 19.1.4.2, “Habilitando Transações GTID Online”.

Combinações válidas de `gtid_mode` e autoposicionamento em fonte e replica são mostradas na tabela a seguir. O significado de cada entrada é o seguinte:

* `Y`: Os valores de `gtid_mode` na fonte e na replica são compatíveis.

* `N`: Os valores de `gtid_mode` na fonte e na replica não são compatíveis.

* `*`: O autoposicionamento pode ser usado com essa combinação de valores.

**Tabela 19.1 Combinações Válidas de GTID Mode em Fonte e Replicação**

<table summary="Explica combinações compatíveis (Y) e incompatíveis (N) de modo GTID de fonte e replica. Um asterisco (*) indica que o autoposicionamento pode ser usado com essa combinação de modos GTID."><col style="width: 26%"/><col style="width: 12%"/><col style="width: 24%"/><col style="width: 24%"/><col style="width: 12%"/><thead><tr> <th><p> <code>gtid_mode</code> </p></th> <th><p> Fonte <code>OFF</code> </p></th> <th><p> Fonte <code>OFF_PERMISSIVE</code> </p></th> <th><p> Fonte <code>ON_PERMISSIVE</code> </p></th> <th><p> Fonte <code>ON</code> </p></th> </tr></thead><tbody><tr> <th><p> Replica <code>OFF</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> N </p></td> <td><p> N </p></td> </tr><tr> <th><p> Replica <code>OFF_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON</code> </p></th> <td><p> N </p></td> <td><p> N </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr></tbody></table>

O valor atual de `gtid_mode` também afeta `gtid_next`. A tabela a seguir mostra o comportamento do servidor para combinações de diferentes valores de `gtid_mode` e `gtid_next`. O significado de cada entrada é o seguinte:

* `ANONYMOUS`: Gerar uma transação anônima.

* `Error`: Gerar um erro e não executar `SET GTID_NEXT`.

* `UUID:NUMBER`: Gerar um GTID com o UUID:NUMBER especificado.

* `UUID:TAG:NUMBER`: Gerar um GTID com o UUID:TAG:NUMBER especificado.

* `New GTID`: Gerar um GTID com um número gerado automaticamente.

**Tabela 19.2 Combinações válidas de gtid_mode e gtid_next**

<table summary="Explica o comportamento para cada uma das combinações possíveis do modo GTID e do ajuste para a variável gtid_next. Com gtid_next definido como AUTOMÁTICO, o comportamento também varia dependendo se o registro binário está habilitado ou desabilitado." width="16%" style="width:16%"><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><col><

Quando o registro binário não está em uso e `gtid_next` é `AUTOMATIC`, então nenhum GTID é gerado.