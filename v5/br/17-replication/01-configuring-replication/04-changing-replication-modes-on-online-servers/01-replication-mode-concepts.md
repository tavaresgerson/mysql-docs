#### 16.1.4.1 Conceitos do Modo de Replicação

Para poder configurar com segurança o modo de replicação de um servidor online, é importante entender alguns conceitos-chave da replicação. Esta seção explica esses conceitos e é uma leitura essencial antes de tentar modificar o modo de replicação de um servidor online.

Os modos de replicação disponíveis no MySQL dependem de diferentes técnicas para identificar as transações registradas. Os tipos de transações usados pela replicação são os seguintes:

- As transações GTID são identificadas por um identificador global de transação (GTID) na forma `UUID: NÚMERO`. Cada transação GTID em um log é sempre precedida por um `Gtid_log_event`. As transações GTID podem ser endereçadas usando o GTID ou usando o nome do arquivo e a posição.

- As transações anônimas não têm um GTID atribuído, e o MySQL garante que cada transação anônima em um log é precedida por um `Anonymous_gtid_log_event`. Em versões anteriores, as transações anônimas não eram precedidas por nenhum evento específico. As transações anônimas só podem ser acessadas usando o nome do arquivo e a posição.

Ao usar GTIDs, você pode aproveitar a autoposição e o fail-over automático, além de usar `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids` e monitorar transações replicadas usando as tabelas do Schema de Desempenho. Com GTIDs habilitados, você não pode usar `sql_slave_skip_counter`, em vez disso, use transações vazias.

As transações em um log de retransmissão que foram recebidas de uma fonte que está executando uma versão anterior do MySQL podem não ser precedidas por nenhum evento específico, mas, após serem retransmitidas e registradas no log binário da replica, são precedidas por um `Anonymous_gtid_log_event`.

A capacidade de configurar o modo de replicação online significa que as variáveis `gtid_mode` e `enforce_gtid_consistency` agora são dinâmicas e podem ser definidas a partir de uma declaração de nível superior por uma conta que tenha privilégios suficientes para definir variáveis de sistema globais. Veja Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. Em versões anteriores, ambas as variáveis podiam ser configuradas apenas usando a opção apropriada no início do servidor, o que significava que as alterações no modo de replicação exigiam um reinício do servidor. Em todas as versões, `gtid_mode` poderia ser definido como `ON` ou `OFF`, o que correspondia a se os GTIDs eram usados para identificar transações ou não. Quando `gtid_mode=ON` não é possível replicar transações anônimas, e quando `gtid_mode=OFF` apenas transações anônimas podem ser replicadas. A partir do MySQL 5.7.6, a variável `gtid_mode` tem dois estados adicionais, `OFF_PERMISSIVE` e `ON_PERMISSIVE`. Quando `gtid_mode=OFF_PERMISSIVE` então *novas* transações são anônimas enquanto permitem que transações replicadas sejam transações GTID ou anônimas. Quando `gtid_mode=ON_PERMISSIVE` então *novas* transações usam GTIDs enquanto permitem que transações replicadas sejam transações GTID ou anônimas. Isso significa que é possível ter uma topologia de replicação que tem servidores usando transações anônimas e GTIDs. Por exemplo, uma fonte com `gtid_mode=ON` poderia estar replicando para uma replica com `gtid_mode=ON_PERMISSIVE`. Os valores válidos para `gtid_mode` são os seguintes e nessa ordem:

- `DESLIGADO`
- `OFF_PERMISSIVE`
- `ON_PERMISSIVE`
- `ON`

É importante notar que o estado de `gtid_mode` só pode ser alterado de uma vez, de acordo com a ordem acima. Por exemplo, se `gtid_mode` estiver atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`. Isso garante que o processo de mudança de transações anônimas para transações GTID online seja corretamente gerenciado pelo servidor. Quando você alterna entre `gtid_mode=ON` e `gtid_mode=OFF`, o estado GTID (ou seja, o valor de `gtid_executed`) é persistente. Isso garante que o conjunto de GTID aplicado pelo servidor seja sempre mantido, independentemente das mudanças entre os tipos de `gtid_mode`.

Como parte das mudanças introduzidas pelo MySQL 5.7.6, os campos relacionados aos GTIDs foram modificados para exibirem as informações corretas, independentemente da opção atualmente selecionada `gtid_mode`. Isso significa que campos que exibem conjuntos de GTIDs, como `gtid_executed`, `gtid_purged`, `RECEIVED_TRANSACTION_SET` na tabela `replication_connection_status` (performance-schema-replication-connection-status-table.html) do Schema de Desempenho, e os resultados relacionados ao GTID da consulta `SHOW SLAVE STATUS` (show-slave-status.html), agora retornam a string vazia quando não há GTIDs presentes. Campos que exibem um único GTID, como `CURRENT_TRANSACTION` na tabela `replication_applier_status_by_worker` (performance-schema-replication-applier-status-by-worker-table.html) do Schema de Desempenho, agora exibem `ANONYMOUS` quando as transações com GTIDs não estão sendo usadas.

A replicação a partir de uma fonte usando `gtid_mode=ON` oferece a capacidade de usar a autoposição, configurada usando a declaração `CHANGE MASTER TO MASTER_AUTO_POSITION = 1;`. A topologia de replicação sendo usada afeta se é possível habilitar a autoposição ou não, pois essa funcionalidade depende dos GTIDs e não é compatível com transações anônimas. Um erro é gerado se a autoposição for habilitada e uma transação anônima for encontrada. É altamente recomendável garantir que não haja transações anônimas restantes na topologia antes de habilitar a autoposição, veja Seção 16.1.4.2, “Habilitando Transações GTID Online”. As combinações válidas de `gtid_mode` e autoposição na fonte e na replica são mostradas na tabela a seguir, onde o `gtid_mode` da fonte está na horizontal e o `gtid_mode` da replica está na vertical:

**Tabela 16.1 Combinações válidas de fonte e replicação gtid\_mode**

<table width="708"><col style="width: 2%"/><col style="width: 1%"/><col style="width: 2%"/><col style="width: 21%"/><col style="width: 17%"/><thead><tr> <th><p> <a class="link" href="replication-options-gtids.html#sysvar_gtid_mode">[[<code>gtid_mode</code>]]</a> </p></th> <th><p>[[<code>OFF</code>]]</p></th> <th><p>[[<code>OFF_PERMISSIVE</code>]]</p></th> <th><p>[[<code>ON_PERMISSIVE</code>]]</p></th> <th><p>[[<code>ON</code>]]</p></th> </tr></thead><tbody><tr> <th><p>Replica [[<code>OFF</code>]]</p></th> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>N</p></td> <td><p>N</p></td> </tr><tr> <th><p>Replica [[<code>OFF_PERMISSIVE</code>]]</p></th> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y*</p></td> </tr><tr> <th><p>Replica [[<code>ON_PERMISSIVE</code>]]</p></th> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y</p></td> <td><p>Y*</p></td> </tr><tr> <th><p>Replica [[<code>ON</code>]]</p></th> <td><p>N</p></td> <td><p>N</p></td> <td><p>Y</p></td> <td><p>Y*</p></td> </tr></tbody></table>

Na tabela acima, as entradas são:

- `Y`: o [`gtid_mode`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%B5es_de_gtids) da fonte e da replicação é compatível

- `N`: o [`gtid_mode`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%B5es_de_gtids) da fonte e da replica não é compatível

- \`: o posicionamento automático pode ser usado

O valor atualmente selecionado de `gtid_mode` também afeta a variável `gtid_next`. A tabela a seguir mostra o comportamento do servidor para os diferentes valores de `gtid_mode` e `gtid_next`.

**Tabela 16.2 Combinações válidas de gtid\_mode e gtid\_next**

<table><col style="width: 2.03%"/><col style="width: 1%"/><col style="width: 2.01%"/><col style="width: 1.92%"/><col style="width: 1.04%"/><thead><tr> <th><p> <a class="link" href="replication-options-gtids.html#sysvar_gtid_next">[[<code>gtid_next</code>]]</a> </p></th> <th><p>AUTOMATIZADO</p><p>log binário</p></th> <th><p>AUTOMATIZADO</p><p>logar-se binariamente</p></th> <th><p>ANÔNIMO</p></th> <th><p>UUID: NÚMERO</p></th> </tr></thead><tbody><tr> <th><p> [[<code>&gt;OFF</code>]] </p></th> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td>ANÔNIMO</td> <td><p>Erro</p></td> </tr><tr> <th><p> [[<code>&gt;OFF_PERMISSIVE</code>]] </p></th> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td><p>UUID: NÚMERO</p></td> </tr><tr> <th><p> [[<code>&gt;ON_PERMISSIVE</code>]] </p></th> <td><p>Novo GTID</p></td> <td><p>ANÔNIMO</p></td> <td><p>ANÔNIMO</p></td> <td><p>UUID: NÚMERO</p></td> </tr><tr> <th><p> [[<code>&gt;ON</code>]] </p></th> <td><p>Novo GTID</p></td> <td><p>ANÔNIMO</p></td> <td><p>Erro</p></td> <td><p>UUID: NÚMERO</p></td> </tr></tbody></table>

Na tabela acima, as entradas são:

- `ANÔNIMO`: gerar uma transação anônima.

- `Erro`: gerar um erro e não conseguir executar `SET GTID_NEXT`.

- `UUID:NUMBER`: gerar um GTID com o UUID especificado: NUMBER.

- `New GTID`: gerar um GTID com um número gerado automaticamente.

Quando o log binário está desativado e `gtid_next` está configurado como `AUTOMATIC`, não é gerado nenhum GTID. Isso é consistente com o comportamento das versões anteriores.
