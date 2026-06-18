#### 19.1.4.1 Conceitos do Modo de Replicação

Antes de definir o modo de replicação de um servidor online, é importante entender alguns conceitos-chave da replicação. Esta seção explica esses conceitos e é uma leitura essencial antes de tentar modificar o modo de replicação de um servidor online.

Os modos de replicação disponíveis no MySQL dependem de diferentes técnicas para identificar transações registradas. Os tipos de transações usados pela replicação estão listados aqui:

- As transações GTID são identificadas por um identificador global de transação (GTID), que assume a forma `UUID:NUMBER`. Cada transação GTID no log binário é precedida por um `Gtid_log_event`. Uma transação GTID pode ser endereçada pelo seu GTID ou pelo nome do arquivo em que é registrada e sua posição dentro desse arquivo.

- Uma transação anônima não tem GTID; o MySQL 8.0 garante que cada transação anônima em um log seja precedida por um `Anonymous_gtid_log_event`. (Em versões anteriores do MySQL, uma transação anônima não era precedida por nenhum evento específico.) Uma transação anônima pode ser endereçada apenas pelo nome do arquivo e pela posição.

Ao usar GTIDs, você pode aproveitar a autoposição do GTID e o failover automático, e usar as tabelas `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids` e Schema de Desempenho para monitorar transações replicadas (veja a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”).

Uma transação em um log de retransmissão de uma fonte que está executando uma versão anterior do MySQL pode não ser precedida por nenhum evento específico, mas, após ser retransmitida e registrada no log binário da replica, é precedida por um `Anonymous_gtid_log_event`.

Para alterar o modo de replicação online, é necessário definir as variáveis `gtid_mode` e `enforce_gtid_consistency` usando uma conta que tenha privilégios suficientes para definir variáveis de sistema globais; consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Os valores permitidos para `gtid_mode` estão listados aqui, em ordem, com seus significados:

- `OFF`: Apenas as transações anônimas podem ser replicadas.

- `OFF_PERMISSIVE`: Novas transações são anônimas; transações replicadas podem ser GTID ou anônimas.

- `ON_PERMISSIVE`: Novas transações usam GTIDs; transações replicadas podem ser GTID ou anônimas.

- `ON`: Todas as transações devem ter GTIDs; transações anônimas não podem ser replicadas.

É possível ter servidores que utilizam transações anônimas e servidores que utilizam transações GTID na mesma topologia de replicação. Por exemplo, uma fonte onde `gtid_mode=ON` pode replicar para uma replica onde `gtid_mode=ON_PERMISSIVE`.

`gtid_mode` pode ser alterado apenas um passo de cada vez, com base na ordem dos valores conforme mostrado na lista anterior. Por exemplo, se `gtid_mode` for definido como `OFF_PERMISSIVE`, é possível alterá-lo para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`. Isso garante que o processo de mudança de transações anônimas para transações GTID online seja tratado corretamente pelo servidor; o estado GTID (ou seja, o valor de `gtid_executed`) é persistente. Isso garante que o ajuste GTID aplicado pelo servidor seja sempre mantido e esteja correto, independentemente de quaisquer alterações no valor de `gtid_mode`.

As variáveis do sistema que exibem conjuntos de GTID, como `gtid_executed` e `gtid_purged`, a coluna `RECEIVED_TRANSACTION_SET` da tabela do Schema de Desempenho `replication_connection_status`, e os resultados relacionados aos GTID na saída do `SHOW REPLICA STATUS` retornam cadeias vazias quando não há GTID presentes. As fontes de informações sobre um único GTID, como as informações exibidas na coluna `CURRENT_TRANSACTION` da tabela do Schema de Desempenho `replication_applier_status_by_worker`, mostram `ANONYMOUS` quando as transações de GTID não estão em uso.

A replicação a partir de uma fonte usando `gtid_mode=ON` permite o uso da autoposição do GTID, configurada usando a opção `SOURCE_AUTO_POSITION` da declaração `CHANGE REPLICATION SOURCE TO`. A topologia de replicação em uso tem um impacto sobre a possibilidade de habilitar a autoposição ou não, uma vez que essa funcionalidade depende dos GTIDs e não é compatível com transações anônimas. É altamente recomendável garantir que não haja transações anônimas restantes na topologia antes de habilitar a autoposição; consulte a Seção 19.1.4.2, “Habilitando Transações GTID Online”.

As combinações válidas de `gtid_mode` e autoposicionamento na fonte e na réplica estão mostradas na tabela a seguir. O significado de cada entrada é o seguinte:

- `Y`: Os valores de `gtid_mode` na fonte e na replica são compatíveis.

- `N`: Os valores de `gtid_mode` na fonte e na replica não são compatíveis.

- `*`: A autoposição pode ser usada com essa combinação de valores.

**Tabela 19.1 Combinações válidas de fonte e replicação gtid\_mode**

<table summary="Explica as combinações compatíveis (Y) e incompatíveis (N) entre o modo de GTID da fonte e o modo de replica. Um asterisco (*) indica que o posicionamento automático pode ser usado com essa combinação de modos de GTID."><thead><tr> <th scope="col"><p> [[<code>gtid_mode</code>]] </p></th> <th scope="col"><p>[[<code>OFF</code>]]</p></th> <th scope="col"><p>[[<code>OFF_PERMISSIVE</code>]]</p></th> <th scope="col"><p>[[<code>ON_PERMISSIVE</code>]]</p></th> <th scope="col"><p>[[<code>ON</code>]]</p></th> </tr></thead><tbody><tr> <th><p>Replica [[<code>OFF</code>]]</p></th> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>N</p></td> <td><p>N</p></td> </tr><tr> <th><p>Replica [[<code>OFF_PERMISSIVE</code>]]</p></th> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y*</p></td> </tr><tr> <th><p>Replica [[<code>ON_PERMISSIVE</code>]]</p></th> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y*</p></td> </tr><tr> <th><p>Replica [[<code>ON</code>]]</p></th> <td><p>N</p></td> <td><p>N</p></td> <td><p>Y</p></td> <td><p>Y*</p></td> </tr></tbody></table>

O valor atual de `gtid_mode` também afeta `gtid_next`. A tabela a seguir mostra o comportamento do servidor para combinações de diferentes valores de `gtid_mode` e `gtid_next`. O significado de cada entrada é o seguinte:

- `ANONYMOUS`: Gerar uma transação anônima.

- `Error`: Gerar um erro e não executar `SET GTID_NEXT`.

- `UUID:NUMBER`: Gerar um GTID com o UUID especificado: NUMBER.

- `New GTID`: Gerar um GTID com um número gerado automaticamente.

**Tabela 19.2 Combinações válidas de gtid\_mode e gtid\_next**

<table summary="Explica o comportamento para cada uma das combinações possíveis do modo GTID e do ajuste para a variável gtid_next. Com gtid_next definido como AUTOMÁTICO, o comportamento também varia dependendo se o registro binário está habilitado ou desabilitado."><thead><tr> <th scope="col"></th> <th scope="col"><p>[[PH_HTML_CODE_<code>gtid_mode</code>] AUTOMÁTICO</p><p>log binário</p></th> <th scope="col"><p>[[PH_HTML_CODE_<code>gtid_mode</code>] AUTOMÁTICO</p><p>logar-se binariamente</p></th> <th scope="col"><p>[[<code>gtid_next</code>]] ANÔNIMO</p></th> <th scope="col"><p>[[<code>gtid_next</code>]] UUID:NUMBER</p></th> </tr></thead><tbody><tr> <th><p>[[<code>gtid_mode</code>]] [[<code>OFF</code>]]</p></th> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td>ANÔNIMO</td> <td><p>Erro</p></td> </tr><tr> <th><p>[[<code>gtid_mode</code>]] [[<code>OFF_PERMISSIVE</code>]]</p></th> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td><p>UUID: NÚMERO</p></td> </tr><tr> <th><p>[[<code>gtid_mode</code>]] [[<code>ON_PERMISSIVE</code>]]</p></th> <td><p>Novo GTID</p></td> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td><p>UUID: NÚMERO</p></td> </tr><tr> <th><p>[[<code>gtid_mode</code>]] [[<code>gtid_next</code><code>gtid_mode</code>]</p></th> <td><p>Novo GTID</p></td> <td><p>ANÔNIMO</p></td> <td><p>Erro</p></td> <td><p>UUID: NÚMERO</p></td> </tr></tbody></table>

Quando o registro binário não está em uso e `gtid_next` é `AUTOMATIC`, então não é gerado nenhum GTID, o que é consistente com o comportamento das versões anteriores do MySQL.
