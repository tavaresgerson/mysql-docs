### 21.7.11 Resolução de Conflitos na Replicação do NDB Cluster

* [Requisitos](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-requirements "Requirements")
* [Controle de Colunas na Origem](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-source-column "Source Column Control")
* [Controle de Resolução de Conflitos](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-control "Conflict Resolution Control")
* [Funções de Resolução de Conflitos](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-functions "Conflict Resolution Functions")
* [Tabela de Exceções da Resolução de Conflitos](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-exceptions-table "Conflict Resolution Exceptions Table")
* [Variáveis de Status da Detecção de Conflitos](mysql-cluster-replication-conflict-resolution.html#conflict-detection-statvars "Conflict Detection Status Variables")
* [Exemplos](mysql-cluster-replication-conflict-resolution.html#conflict-detection-examples "Examples")

Quando se utiliza uma configuração de *replication* que envolve múltiplas *sources* (incluindo replicação circular), é possível que diferentes *sources* tentem realizar o *update* da mesma *row* na *replica* com dados distintos. A resolução de conflitos na Replicação do NDB Cluster fornece um meio de resolver tais conflitos, permitindo que uma coluna de resolução definida pelo usuário seja utilizada para determinar se um *update* em uma determinada *source* deve ser aplicado ou não na *replica*.

Alguns tipos de resolução de conflitos suportados pelo NDB Cluster (`NDB$OLD()`, `NDB$MAX()`, `NDB$MAX_DELETE_WIN()`) implementam esta coluna definida pelo usuário como uma coluna de "*timestamp*" (embora seu tipo não possa ser [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), conforme explicado mais adiante nesta seção). Estes tipos de resolução de conflitos são sempre aplicados *row-by-row* em vez de em uma base *transactional*. As funções de resolução de conflitos baseadas em *epoch*, `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`, comparam a ordem em que os *epochs* são replicados (e, portanto, estas funções são *transactional*). Diferentes métodos podem ser usados para comparar valores de coluna de resolução na *replica* quando ocorrem conflitos, conforme explicado mais adiante nesta seção; o método usado pode ser configurado para atuar em uma única *table*, *database*, ou *server*, ou em um conjunto de uma ou mais *tables* usando correspondência de padrões (*pattern matching*). Veja [Correspondência com caracteres curinga (wildcards)](mysql-cluster-replication-schema.html#ndb-replication-wildcards "Matching with wildcards"), para informações sobre o uso de correspondências de padrões nas colunas `db`, `table_name` e `server_id` da *table* `mysql.ndb_replication`.

Você também deve ter em mente que é responsabilidade da aplicação garantir que a coluna de resolução seja populada corretamente com valores relevantes, para que a função de resolução possa fazer a escolha apropriada ao determinar se deve aplicar um *update*.

#### Requisitos

Os preparativos para a resolução de conflitos devem ser feitos tanto na *source* quanto na *replica*. Estas tarefas estão descritas na lista a seguir:

* Na *source* que está gravando os *binary logs*, você deve determinar quais colunas são enviadas (todas as colunas ou apenas aquelas que foram atualizadas). Isto é feito para o MySQL Server como um todo aplicando a opção de inicialização do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) (descrita mais adiante nesta seção), ou em uma ou mais *tables* específicas, inserindo as entradas adequadas na *table* `mysql.ndb_replication` (veja [Tabela ndb_replication](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table")).

  Note

  Se você estiver replicando *tables* com colunas muito grandes (como colunas [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")), [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) também pode ser útil para reduzir o tamanho dos *binary logs* e evitar possíveis falhas de *replication* devido a exceder [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet).

  Veja [Seção 16.4.1.19, “Replicação e max_allowed_packet”](replication-features-max-allowed-packet.html "16.4.1.19 Replication and max_allowed_packet"), para mais informações sobre este problema.

* Na *replica*, você deve determinar qual tipo de resolução de conflitos aplicar (“o *timestamp* mais recente vence”, “o mesmo *timestamp* vence”, “a *primary* vence”, “a *primary* vence, *transaction* completa”, ou nenhuma). Isto é feito usando a *system table* `mysql.ndb_replication`, e se aplica a uma ou mais *tables* específicas (veja [Tabela ndb_replication](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table")).

* O NDB Cluster também suporta a detecção de conflitos de *read*, ou seja, detectar conflitos entre *reads* de uma determinada *row* em um *cluster* e *updates* ou *deletes* da mesma *row* em outro *cluster*. Isso requer *read locks* exclusivos obtidos definindo [`ndb_log_exclusive_reads`](mysql-cluster-options-variables.html#sysvar_ndb_log_exclusive_reads) igual a 1 na *replica*. Todas as *rows* lidas por um *read* conflitante são registradas na *exceptions table*. Para mais informações, veja [Detecção e resolução de conflitos de read](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-read-conflicts "Read conflict detection and resolution").

* O `NDB` aplica *events* `WRITE_ROW` estritamente como *inserts*, exigindo que não haja tal *row* já existente; ou seja, um *write* de entrada é sempre rejeitado se a *row* já existir.

Ao usar as funções `NDB$OLD()`, `NDB$MAX()` e `NDB$MAX_DELETE_WIN()` para resolução de conflitos baseada em *timestamp*, frequentemente nos referimos à coluna usada para determinar os *updates* como uma coluna de "*timestamp*". No entanto, o tipo de dados desta coluna nunca é [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"); em vez disso, seu tipo de dados deve ser [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ([`INTEGER`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) ou [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A coluna de "*timestamp*" também deve ser `UNSIGNED` e `NOT NULL`.

As funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` discutidas mais adiante nesta seção funcionam comparando a ordem relativa dos *epochs* de *replication* aplicados em um NDB Cluster *primary* e *secondary*, e não fazem uso de *timestamps*.

#### Controle de Colunas na Origem

Podemos ver as operações de *update* em termos de imagens "antes" e "depois" — ou seja, os estados da *table* antes e depois que o *update* é aplicado. Normalmente, ao atualizar uma *table* com uma *Primary Key*, a imagem "antes" não é de grande interesse; no entanto, quando precisamos determinar, por *update*, se devemos ou não usar os valores atualizados em uma *replica*, precisamos garantir que ambas as imagens sejam gravadas no *binary log* da *source*. Isso é feito com a opção [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write) para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), conforme descrito mais adiante nesta seção.

Important

Se o *logging* de *rows* completas ou apenas de colunas atualizadas é feito é decidido quando o MySQL *server* é iniciado e não pode ser alterado *online*; você deve reiniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), ou iniciar uma nova instância do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com diferentes opções de *logging*.

#### Controle de Resolução de Conflitos

A resolução de conflitos geralmente é habilitada no *server* onde os conflitos podem ocorrer. Assim como a seleção do método de *logging*, ela é habilitada por entradas na *table* `mysql.ndb_replication`.

`NBT_UPDATED_ONLY_MINIMAL` e `NBT_UPDATED_FULL_MINIMAL` podem ser usados com `NDB$EPOCH()`, `NDB$EPOCH2()` e `NDB$EPOCH_TRANS()`, porque estes não exigem valores "antes" de colunas que não são *Primary Keys*. Algoritmos de resolução de conflitos que exigem os valores antigos, como `NDB$MAX()` e `NDB$OLD()`, não funcionam corretamente com estes valores de `binlog_type`.

#### Funções de Resolução de Conflitos

Esta seção fornece informações detalhadas sobre as funções que podem ser usadas para detecção e resolução de conflitos com a Replicação NDB. Estas funções estão listadas aqui em ordem alfabética:

* [NDB$OLD()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-old "NDB$OLD()")
* [NDB$MAX()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-max "NDB$MAX()")
* [NDB$MAX_DELETE_WIN()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-max-delete-win "NDB$MAX_DELETE_WIN()")
* [NDB$EPOCH()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch "NDB$EPOCH()")
* [NDB$EPOCH_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch-trans "NDB$EPOCH_TRANS()")
* [NDB$EPOCH2()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch2 "NDB$EPOCH2()")
* [NDB$EPOCH2_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch2-trans "NDB$EPOCH2_TRANS()")

##### NDB$OLD()

Se o valor de *`column_name`* for o mesmo tanto na *source* quanto na *replica*, então o *update* é aplicado; caso contrário, o *update* não é aplicado na *replica* e uma exceção é gravada no *log*. Isso é ilustrado pelo seguinte pseudo-código:

```sql
if (source_old_column_value == replica_current_column_value)
  apply_update();
else
  log_exception();
```

Esta função pode ser usada para resolução de conflitos do tipo "mesmo valor vence" (*same value wins*). Este tipo de resolução de conflitos garante que os *updates* não sejam aplicados na *replica* a partir da *source* errada.

Important

O valor da coluna da imagem "antes" da *source* é usado por esta função.

##### NDB$MAX()

Se o valor da coluna "*timestamp*" para uma dada *row* vindo da *source* for superior ao valor na *replica*, ele é aplicado; caso contrário, não é aplicado na *replica*. Isso é ilustrado pelo seguinte pseudo-código:

```sql
if (source_new_column_value > replica_current_column_value)
  apply_update();
```

Esta função pode ser usada para resolução de conflitos do tipo "*timestamp* maior vence" (*greatest timestamp wins*). Este tipo de resolução de conflitos garante que, no caso de um conflito, a versão da *row* que foi atualizada mais recentemente é a versão que persiste.

Important

O valor da coluna da imagem "depois" da *source* é usado por esta função.

##### NDB$MAX_DELETE_WIN()

Esta é uma variação de `NDB$MAX()`. Devido ao fato de que nenhum *timestamp* está disponível para uma operação de *delete*, um *delete* usando `NDB$MAX()` é, na verdade, processado como `NDB$OLD`, mas para alguns casos de uso, isso não é ideal. Para `NDB$MAX_DELETE_WIN()`, se o valor da coluna "*timestamp*" para uma dada *row* adicionando ou atualizando uma *row* existente vindo da *source* for superior ao valor na *replica*, ele é aplicado. No entanto, as operações de *delete* são tratadas como sempre tendo o valor mais alto. Isso é ilustrado pelo seguinte pseudo-código:

```sql
if ( (source_new_column_value > replica_current_column_value)
        ||
      operation.type == "delete")
  apply_update();
```

Esta função pode ser usada para resolução de conflitos do tipo "*timestamp* maior, *delete* vence" (*greatest timestamp, delete wins*). Este tipo de resolução de conflitos garante que, no caso de um conflito, a versão da *row* que foi excluída ou (de outra forma) mais recentemente atualizada é a versão que persiste.

Note

Assim como acontece com `NDB$MAX()`, o valor da coluna da imagem "depois" da *source* é o valor usado por esta função.

##### NDB$EPOCH()

A função `NDB$EPOCH()` rastreia a ordem em que os *epochs* replicados são aplicados em um *cluster replica* em relação às alterações originadas na *replica*. Esta ordenação relativa é usada para determinar se as alterações originadas na *replica* são concorrentes com quaisquer alterações que se originam localmente e, portanto, estão potencialmente em conflito.

A maior parte do que se segue na descrição de `NDB$EPOCH()` também se aplica a `NDB$EPOCH_TRANS()`. Quaisquer exceções são observadas no texto.

`NDB$EPOCH()` é assimétrica, operando em um NDB Cluster em uma configuração de *replication* bidirecional (às vezes referida como *replication* "ativo-ativo"). Referimo-nos aqui ao *cluster* no qual ela opera como a *primary*, e o outro como a *secondary*. A *replica* na *primary* é responsável por detectar e lidar com conflitos, enquanto a *replica* na *secondary* não está envolvida em nenhuma detecção ou tratamento de conflitos.

Quando a *replica* na *primary* detecta conflitos, ela injeta *events* em seu próprio *binary log* para compensá-los; isso garante que o NDB Cluster *secondary* se realinhe eventualmente com a *primary* e, assim, evita que a *primary* e a *secondary* divirjam. Este mecanismo de compensação e realinhamento exige que o NDB Cluster *primary* sempre vença quaisquer conflitos com a *secondary* — ou seja, que as alterações da *primary* sejam sempre usadas em vez daquelas da *secondary* em caso de conflito. Esta regra de "a *primary* sempre vence" tem as seguintes implicações:

* Operações que alteram dados, uma vez *committed* na *primary*, são totalmente persistentes e não são desfeitas ou revertidas (*rolled back*) pela detecção e resolução de conflitos.

* Os dados lidos da *primary* são totalmente consistentes. Quaisquer alterações *committed* na *Primary* (localmente ou da *replica*) não são revertidas posteriormente.

* As operações que alteram dados na *secondary* podem ser revertidas posteriormente se a *primary* determinar que estão em conflito.

* *Rows* individuais lidas na *secondary* são autoconsistentes em todos os momentos, cada *row* sempre refletindo um estado *committed* pela *secondary*, ou um *committed* pela *primary*.

* Conjuntos de *rows* lidas na *secondary* podem não ser necessariamente consistentes em um determinado ponto no tempo. Para `NDB$EPOCH_TRANS()`, este é um estado transitório; para `NDB$EPOCH()`, pode ser um estado persistente.

* Assumindo um período de tempo suficiente sem quaisquer conflitos, todos os dados no NDB Cluster *secondary* (eventualmente) se tornam consistentes com os dados da *primary*.

`NDB$EPOCH()` e `NDB$EPOCH_TRANS()` não exigem modificações de *schema* do usuário, ou alterações de aplicação para fornecer detecção de conflitos. No entanto, deve-se pensar cuidadosamente no *schema* usado e nos padrões de *access* usados, para verificar se o sistema completo se comporta dentro dos limites especificados.

Cada uma das funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` pode aceitar um parâmetro opcional; este é o número de *bits* a serem usados para representar os 32 *bits* inferiores do *epoch*, e deve ser definido como não inferior ao valor calculado conforme mostrado aqui:

```sql
CEIL( LOG2( TimeBetweenGlobalCheckpoints / TimeBetweenEpochs ), 1)
```

Para os valores padrão destes parâmetros de configuração (2000 e 100 milissegundos, respectivamente), isto fornece um valor de 5 *bits*, portanto o valor padrão (6) deve ser suficiente, a menos que outros valores sejam usados para [`TimeBetweenGlobalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenglobalcheckpoints), [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs), ou ambos. Um valor muito pequeno pode resultar em falsos positivos, enquanto um valor muito grande pode levar a um desperdício excessivo de espaço no *database*.

Ambos `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` inserem entradas para *rows* conflitantes nas *exceptions tables* relevantes, desde que estas *tables* tenham sido definidas de acordo com as mesmas regras de *schema* de *exceptions table* descritas em outras partes desta seção (veja [NDB$OLD()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-old "NDB$OLD()")). Você deve criar qualquer *exceptions table* antes de criar a *data table* com a qual ela será usada.

Assim como as outras funções de detecção de conflitos discutidas nesta seção, `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` são ativadas incluindo entradas relevantes na *table* `mysql.ndb_replication` (veja [Tabela ndb_replication](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table")). Os papéis dos NDB Clusters *primary* e *secondary* neste cenário são totalmente determinados pelas entradas da *table* `mysql.ndb_replication`.

Como os algoritmos de detecção de conflitos empregados por `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` são assimétricos, você deve usar valores diferentes para as entradas de `server_id` das *replicas* *primary* e *secondary*.

Um conflito entre operações `DELETE` por si só não é suficiente para desencadear um conflito usando `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`, e o posicionamento relativo dentro dos *epochs* não importa.

**Limitações em NDB$EPOCH()**

As seguintes limitações se aplicam atualmente ao usar `NDB$EPOCH()` para realizar a detecção de conflitos:

* Conflitos são detectados usando limites de *epoch* do NDB Cluster, com granularidade proporcional a [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs) (padrão: 100 milissegundos). A *conflict window* mínima é o tempo mínimo durante o qual *updates* concorrentes para os mesmos dados em ambos os *clusters* sempre reportam um conflito. Este é sempre um tempo de duração diferente de zero, e é aproximadamente proporcional a `2 * (latency + queueing + TimeBetweenEpochs)`. Isso implica que — assumindo o padrão para [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs) e ignorando qualquer *latency* entre *clusters* (bem como quaisquer atrasos de *queueing*) — o tamanho mínimo da *conflict window* é de aproximadamente 200 milissegundos. Esta *window* mínima deve ser considerada ao analisar os padrões de "corrida" (*race patterns*) esperados da aplicação.

* É necessário armazenamento adicional para *tables* que utilizam as funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`; é necessário de 1 a 32 *bits* de espaço extra por *row*, dependendo do valor passado para a função.

* Conflitos entre operações de *delete* podem resultar em divergência entre a *primary* e a *secondary*. Quando uma *row* é excluída em ambos os *clusters* concomitantemente, o conflito pode ser detectado, mas não é registrado, uma vez que a *row* é excluída. Isso significa que outros conflitos durante a propagação de quaisquer operações de realinhamento subsequentes não são detectados, o que pode levar à divergência.

  Os *deletes* devem ser serializados externamente ou roteados para apenas um *cluster*. Alternativamente, uma *row* separada deve ser atualizada *transactionally* com tais *deletes* e quaisquer *inserts* que os sigam, para que os conflitos possam ser rastreados através dos *deletes* de *rows*. Isso pode exigir alterações nas aplicações.

* Apenas dois NDB Clusters em uma configuração bidirecional "ativo-ativo" são atualmente suportados ao usar `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()` para detecção de conflitos.

* *Tables* que possuem colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") não são atualmente suportadas com `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`.

##### NDB$EPOCH_TRANS()

`NDB$EPOCH_TRANS()` estende a função `NDB$EPOCH()`. Os conflitos são detectados e tratados da mesma forma, usando a regra "a *primary* vence todos" (veja [NDB$EPOCH()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch "NDB$EPOCH()")), mas com a condição extra de que quaisquer outras *rows* atualizadas na mesma *transaction* em que o conflito ocorreu também são consideradas em conflito. Em outras palavras, onde `NDB$EPOCH()` realinha *rows* conflitantes individuais na *secondary*, `NDB$EPOCH_TRANS()` realinha *transactions* conflitantes.

Além disso, quaisquer *transactions* que sejam detectavelmente dependentes de uma *transaction* conflitante também são consideradas em conflito, sendo estas dependências determinadas pelo conteúdo do *binary log* do *cluster secondary*. Como o *binary log* contém apenas operações de modificação de dados (*inserts*, *updates* e *deletes*), apenas modificações de dados sobrepostas são usadas para determinar dependências entre *transactions*.

`NDB$EPOCH_TRANS()` está sujeito às mesmas condições e limitações de `NDB$EPOCH()`, e ainda requer que *row events* da Versão 2 do *binary log* sejam usados ([`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) igual a 0), o que adiciona uma sobrecarga de armazenamento de 2 *bytes* por *event* no *binary log*. Além disso, todos os IDs de *transaction* devem ser registrados no *binary log* da *secondary*, usando [`--ndb-log-transaction-id`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-transaction-id) definido como `ON`. Isto adiciona uma quantidade variável de sobrecarga (até 13 *bytes* por *row*).

Veja [NDB$EPOCH()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch "NDB$EPOCH()").

##### NDB$EPOCH2()

A função `NDB$EPOCH2()` é semelhante a `NDB$EPOCH()`, exceto que `NDB$EPOCH2()` oferece tratamento de *delete-delete* com uma topologia de *replication* bidirecional. Neste cenário, os papéis de *primary* e *secondary* são atribuídos às duas *sources* definindo a variável de sistema [`ndb_slave_conflict_role`](mysql-cluster-options-variables.html#sysvar_ndb_slave_conflict_role) para o valor apropriado em cada *source* (geralmente um de `PRIMARY` e outro de `SECONDARY`). Quando isso é feito, as modificações feitas pela *secondary* são refletidas pela *primary* de volta para a *secondary*, que então as aplica condicionalmente.

##### NDB$EPOCH2_TRANS()

`NDB$EPOCH2_TRANS()` estende a função `NDB$EPOCH2()`. Os conflitos são detectados e tratados da mesma forma, e atribuindo papéis de *primary* e *secondary* aos *clusters* em *replication*, mas com a condição extra de que quaisquer outras *rows* atualizadas na mesma *transaction* em que o conflito ocorreu também são consideradas em conflito. Ou seja, `NDB$EPOCH2()` realinha *rows* conflitantes individuais na *secondary*, enquanto `NDB$EPOCH_TRANS()` realinha *transactions* conflitantes.

Onde `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` usam metadados que são especificados por *row*, por último *epoch* modificado, para determinar na *primary* se uma alteração de *row* replicada de entrada da *secondary* é concorrente com uma alteração localmente *committed*; as alterações concorrentes são consideradas conflitantes, com atualizações subsequentes na *exceptions table* e realinhamento da *secondary*. Surge um problema quando uma *row* é excluída na *primary*, de modo que não há mais nenhum *epoch* de última modificação disponível para determinar se quaisquer operações replicadas entram em conflito, o que significa que operações de *delete* conflitantes não são detectadas. Isso pode resultar em divergência, sendo um exemplo um *delete* em um *cluster* que é concorrente com um *delete* e *insert* no outro; é por isso que as operações de *delete* podem ser roteadas para apenas um *cluster* ao usar `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`.

`NDB$EPOCH2()` contorna o problema que acabamos de descrever — armazenando informações sobre *rows* excluídas na *PRIMARY* — ignorando qualquer conflito *delete-delete* e evitando qualquer potencial divergência resultante também. Isso é realizado refletindo qualquer operação aplicada com sucesso e replicada da *secondary* de volta para a *secondary*. Em seu retorno à *secondary*, ela pode ser usada para reaplicar uma operação na *secondary* que foi excluída por uma operação originada da *primary*.

Ao usar `NDB$EPOCH2()`, você deve ter em mente que a *secondary* aplica o *delete* da *primary*, removendo a nova *row* até que ela seja restaurada por uma operação refletida. Em teoria, o *insert* ou *update* subsequente na *secondary* entra em conflito com o *delete* da *primary*, mas neste caso, optamos por ignorar isso e permitir que a *secondary* "vença", no interesse de evitar a divergência entre os *clusters*. Em outras palavras, após um *delete*, a *primary* não detecta conflitos e, em vez disso, adota as alterações seguintes da *secondary* imediatamente. Devido a isso, o estado da *secondary* pode revisitar múltiplos estados *committed* anteriores à medida que avança para um estado final (estável), e alguns deles podem ser visíveis.

Você também deve estar ciente de que refletir todas as operações da *secondary* de volta para a *primary* aumenta o tamanho do *binary log* da *primary*, bem como as demandas por largura de banda, uso de CPU e I/O de *disk*.

A aplicação de operações refletidas na *secondary* depende do estado da *row* alvo na *secondary*. Se as alterações refletidas são aplicadas ou não na *secondary* pode ser rastreado verificando as variáveis de *status* [`Ndb_conflict_reflected_op_prepare_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_reflected_op_prepare_count) e [`Ndb_conflict_reflected_op_discard_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_reflected_op_discard_count). O número de alterações aplicadas é simplesmente a diferença entre estes dois valores (note que `Ndb_conflict_reflected_op_prepare_count` é sempre maior ou igual a `Ndb_conflict_reflected_op_discard_count`).

Os *events* são aplicados se e somente se ambas as seguintes condições forem verdadeiras:

* A existência da *row* — isto é, se ela existe ou não — está de acordo com o tipo de *event*. Para operações de *delete* e *update*, a *row* já deve existir. Para operações de *insert*, a *row* *não* deve existir.

* A *row* foi modificada pela última vez pela *primary*. É possível que a modificação tenha sido realizada através da execução de uma operação refletida.

Se ambas as condições não forem atendidas, a operação refletida é descartada pela *secondary*.

#### Tabela de Exceções da Resolução de Conflitos

Para usar a função de resolução de conflitos `NDB$OLD()`, também é necessário criar uma *exceptions table* correspondente a cada *table* [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para a qual este tipo de resolução de conflitos deve ser empregado. Isto também é verdade ao usar `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`. O nome desta *table* é o nome da *table* para a qual a resolução de conflitos deve ser aplicada, com a *string* `$EX` anexada. (Por exemplo, se o nome da *table* original for `mytable`, o nome da *exceptions table* correspondente deve ser `mytable$EX`.) A sintaxe para criar a *exceptions table* é a mostrada aqui:

```sql
CREATE TABLE original_table$EX  (
    [NDB$]server_id INT UNSIGNED,
    [NDB$]source_server_id INT UNSIGNED,
    [NDB$]source_epoch BIGINT UNSIGNED,
    [NDB$]count INT UNSIGNED,

    [NDB$OP_TYPE ENUM('WRITE_ROW','UPDATE_ROW', 'DELETE_ROW',
      'REFRESH_ROW', 'READ_ROW') NOT NULL,]
    [NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
      'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL,]
    [NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL,]

    original_table_pk_columns,

    [orig_table_column|orig_table_column$OLD|orig_table_column$NEW,]

    [additional_columns,]

    PRIMARY KEY([NDB$]server_id, [NDB$]source_server_id, [NDB$]source_epoch, [NDB$]count)
) ENGINE=NDB;
```

As quatro primeiras colunas são obrigatórias. Os nomes das quatro primeiras colunas e das colunas que correspondem às colunas da *Primary Key* da *table* original não são críticos; no entanto, sugerimos, por razões de clareza e consistência, que você use os nomes mostrados aqui para as colunas `server_id`, `source_server_id`, `source_epoch` e `count`, e que você use os mesmos nomes da *table* original para as colunas que correspondem àquelas na *Primary Key* da *table* original.

Se a *exceptions table* usar uma ou mais das colunas opcionais `NDB$OP_TYPE`, `NDB$CFT_CAUSE` ou `NDB$ORIG_TRANSID` discutidas mais adiante nesta seção, então cada uma das colunas obrigatórias também deve ser nomeada usando o prefixo `NDB$`. Se desejar, você pode usar o prefixo `NDB$` para nomear as colunas obrigatórias, mesmo que não defina nenhuma coluna opcional, mas neste caso, todas as quatro colunas obrigatórias devem ser nomeadas usando o prefixo.

Após estas colunas, as colunas que compõem a *Primary Key* da *table* original devem ser copiadas na ordem em que são usadas para definir a *Primary Key* da *table* original. Os tipos de dados para as colunas que duplicam as colunas da *Primary Key* da *table* original devem ser os mesmos (ou maiores) do que os das colunas originais. Um subconjunto das colunas da *Primary Key* pode ser usado.

A *exceptions table* deve usar o *storage engine* [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). (Um exemplo que usa `NDB$OLD()` com uma *exceptions table* é mostrado mais adiante nesta seção.)

Colunas adicionais podem ser definidas opcionalmente após as colunas da *Primary Key* copiadas, mas não antes de nenhuma delas; tais colunas extras não podem ser `NOT NULL`. O NDB Cluster suporta três colunas opcionais adicionais predefinidas, `NDB$OP_TYPE`, `NDB$CFT_CAUSE` e `NDB$ORIG_TRANSID`, que são descritas nos próximos parágrafos.

`NDB$OP_TYPE`: Esta coluna pode ser usada para obter o tipo de operação que causa o conflito. Se você usar esta coluna, defina-a conforme mostrado aqui:

```sql
NDB$OP_TYPE ENUM('WRITE_ROW', 'UPDATE_ROW', 'DELETE_ROW',
    'REFRESH_ROW', 'READ_ROW') NOT NULL
```

Os tipos de operação `WRITE_ROW`, `UPDATE_ROW` e `DELETE_ROW` representam operações iniciadas pelo usuário. As operações `REFRESH_ROW` são operações geradas pela resolução de conflitos em *transactions* de compensação enviadas de volta ao *cluster* de origem a partir do *cluster* que detectou o conflito. As operações `READ_ROW` são operações de rastreamento de *read* iniciadas pelo usuário definidas com *row locks* exclusivos.

`NDB$CFT_CAUSE`: Você pode definir uma coluna opcional `NDB$CFT_CAUSE` que fornece a causa do conflito registrado. Esta coluna, se usada, é definida conforme mostrado aqui:

```sql
NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
    'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL
```

`ROW_DOES_NOT_EXIST` pode ser relatado como a causa para operações `UPDATE_ROW` e `WRITE_ROW`; `ROW_ALREADY_EXISTS` pode ser relatado para *events* `WRITE_ROW`. `DATA_IN_CONFLICT` é relatado quando uma função de conflito baseada em *row* detecta um conflito; `TRANS_IN_CONFLICT` é relatado quando uma função de conflito *transactional* rejeita todas as operações pertencentes a uma *transaction* completa.

`NDB$ORIG_TRANSID`: A coluna `NDB$ORIG_TRANSID`, se usada, contém o ID da *transaction* de origem. Esta coluna deve ser definida da seguinte forma:

```sql
NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL
```

`NDB$ORIG_TRANSID` é um valor de 64 *bits* gerado pelo `NDB`. Este valor pode ser usado para correlacionar múltiplas entradas de *exceptions table* pertencentes à mesma *transaction* conflitante da mesma ou de diferentes *exceptions tables*.

Colunas de referência adicionais que não fazem parte da *Primary Key* da *table* original podem ser nomeadas `colname$OLD` ou `colname$NEW`. `colname$OLD` referencia valores antigos em operações de *update* e *delete* — ou seja, operações que contêm *events* `DELETE_ROW`. `colname$NEW` pode ser usado para referenciar novos valores em operações de *insert* e *update* — em outras palavras, operações que usam *events* `WRITE_ROW`, *events* `UPDATE_ROW`, ou ambos os tipos de *events*. Onde uma operação conflitante não fornece um valor para uma determinada coluna de referência que não é uma *Primary Key*, a *row* da *exceptions table* contém `NULL`, ou um valor padrão definido para essa coluna.

Important

A *table* `mysql.ndb_replication` é lida quando uma *data table* é configurada para *replication*, portanto, a *row* correspondente a uma *table* a ser replicada deve ser inserida em `mysql.ndb_replication` *antes* que a *table* a ser replicada seja criada.

#### Variáveis de Status da Detecção de Conflitos

Várias variáveis de *status* podem ser usadas para monitorar a detecção de conflitos. Você pode ver quantas *rows* foram encontradas em conflito por `NDB$EPOCH()` desde a última vez que esta *replica* foi reiniciada a partir do valor atual da variável de *status* do sistema [`Ndb_conflict_fn_epoch`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch).

[`Ndb_conflict_fn_epoch_trans`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch_trans) fornece o número de *rows* que foram encontradas diretamente em conflito por `NDB$EPOCH_TRANS()`. [`Ndb_conflict_fn_epoch2`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch2) e [`Ndb_conflict_fn_epoch2_trans`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_epoch2_trans) mostram o número de *rows* encontradas em conflito por `NDB$EPOCH2()` e `NDB$EPOCH2_TRANS()`, respectivamente. O número de *rows* realmente realinhadas, incluindo aquelas afetadas devido à sua participação ou dependência das mesmas *transactions* que outras *rows* conflitantes, é dado por [`Ndb_conflict_trans_row_reject_count`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_trans_row_reject_count).

Outra variável de *status* do *server* [`Ndb_conflict_fn_max`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_max) fornece uma contagem do número de vezes que uma *row* não foi aplicada no *SQL node* atual devido à resolução de conflito de "o *timestamp* maior vence" desde a última vez que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi iniciado. [`Ndb_conflict_fn_max_del_win`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_max_del_win) fornece uma contagem do número de vezes que a resolução de conflitos baseada no resultado de `NDB$MAX_DELETE_WIN()` foi aplicada.

O número de vezes que uma *row* não foi aplicada como resultado da resolução de conflito de "o mesmo *timestamp* vence" em um determinado [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") desde a última vez que foi reiniciado é dado pela variável de *status* global [`Ndb_conflict_fn_old`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_old). Além de incrementar [`Ndb_conflict_fn_old`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_old), a *Primary Key* da *row* que não foi usada é inserida em uma *exceptions table*, conforme explicado em outra parte desta seção.

Veja também [Seção 21.4.3.9.3, “Variáveis de Status do NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-status-variables "21.4.3.9.3 NDB Cluster Status Variables").

#### Exemplos

Os exemplos a seguir assumem que você já tem uma configuração de *replication* do NDB Cluster em funcionamento, conforme descrito em [Seção 21.7.5, “Preparando o NDB Cluster para Replicação”](mysql-cluster-replication-preparation.html "21.7.5 Preparing the NDB Cluster for Replication") e [Seção 21.7.6, “Iniciando a Replicação do NDB Cluster (Canal Único de Replicação)”](mysql-cluster-replication-starting.html "21.7.6 Starting NDB Cluster Replication (Single Replication Channel)").

**Exemplo de NDB$MAX().** Suponha que você deseja habilitar a resolução de conflitos de "o *timestamp* maior vence" na *table* `test.t1`, usando a coluna `mycol` como o "*timestamp*". Isso pode ser feito usando as seguintes etapas:

1. Certifique-se de que você iniciou o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") da *source* com [`--ndb-log-update-as-write=OFF`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write).

2. Na *source*, execute esta instrução [`INSERT`](insert.html "13.2.5 INSERT Statement"):

   ```sql
   INSERT INTO mysql.ndb_replication
       VALUES ('test', 't1', 0, NULL, 'NDB$MAX(mycol)');
   ```

   Note

   Se a *table* `ndb_replication` ainda não existir, você deve criá-la. Veja [Tabela ndb_replication](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table").

   Inserir 0 na coluna `server_id` indica que todos os *SQL nodes* que acessam esta *table* devem usar a resolução de conflitos. Se você quiser usar a resolução de conflitos em um [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") específico apenas, use o ID real do *server*.

   Inserir `NULL` na coluna `binlog_type` tem o mesmo efeito que inserir 0 (`NBT_DEFAULT`); o padrão do *server* é usado.

3. Crie a *table* `test.t1`:

   ```sql
   CREATE TABLE test.t1 (
       columns
       mycol INT UNSIGNED,
       columns
   ) ENGINE=NDB;
   ```

   Agora, quando *updates* são realizados nesta *table*, a resolução de conflitos é aplicada, e a versão da *row* que tem o maior valor para `mycol` é gravada na *replica*.

Note

Outras opções de `binlog_type`, como `NBT_UPDATED_ONLY_USE_UPDATE` (`6`), devem ser usadas para controlar o *logging* na *source* usando a *table* `ndb_replication* em vez de usar opções de linha de comando.

**Exemplo de NDB$OLD().** Suponha que uma *table* [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como a definida aqui está sendo replicada, e você deseja habilitar a resolução de conflitos de "o mesmo *timestamp* vence" para *updates* nesta *table*:

```sql
CREATE TABLE test.t2  (
    a INT UNSIGNED NOT NULL,
    b CHAR(25) NOT NULL,
    columns,
    mycol INT UNSIGNED NOT NULL,
    columns,
    PRIMARY KEY pk (a, b)
)   ENGINE=NDB;
```

As seguintes etapas são necessárias, na ordem mostrada:

1. Primeiro — e *antes* de criar `test.t2` — você deve inserir uma *row* na *table* [`mysql.ndb_replication`](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), conforme mostrado aqui:

   ```sql
   INSERT INTO mysql.ndb_replication
       VALUES ('test', 't2', 0, 0, 'NDB$OLD(mycol)');
   ```

   Os valores possíveis para a coluna `binlog_type` são mostrados anteriormente nesta seção; neste caso, usamos `0` para especificar que o comportamento de *logging* padrão do *server* seja usado. O valor `'NDB$OLD(mycol)'` deve ser inserido na coluna `conflict_fn`.

2. Crie uma *exceptions table* apropriada para `test.t2`. A instrução de criação de *table* mostrada aqui inclui todas as colunas obrigatórias; quaisquer colunas adicionais devem ser declaradas após estas colunas, e antes da definição da *Primary Key* da *table*.

   ```sql
   CREATE TABLE test.t2$EX  (
       server_id INT UNSIGNED,
       source_server_id INT UNSIGNED,
       source_epoch BIGINT UNSIGNED,
       count INT UNSIGNED,
       a INT UNSIGNED NOT NULL,
       b CHAR(25) NOT NULL,

       [additional_columns,]

       PRIMARY KEY(server_id, source_server_id, source_epoch, count)
   )   ENGINE=NDB;
   ```

   Podemos incluir colunas adicionais para obter informações sobre o tipo, a causa e o ID da *transaction* de origem para um determinado conflito. Também não somos obrigados a fornecer colunas correspondentes para todas as colunas da *Primary Key* na *table* original. Isso significa que você pode criar a *exceptions table* assim:

   ```sql
   CREATE TABLE test.t2$EX  (
       NDB$server_id INT UNSIGNED,
       NDB$source_server_id INT UNSIGNED,
       NDB$source_epoch BIGINT UNSIGNED,
       NDB$count INT UNSIGNED,
       a INT UNSIGNED NOT NULL,

       NDB$OP_TYPE ENUM('WRITE_ROW','UPDATE_ROW', 'DELETE_ROW',
         'REFRESH_ROW', 'READ_ROW') NOT NULL,
       NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
         'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL,
       NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL,

       [additional_columns,]

       PRIMARY KEY(NDB$server_id, NDB$source_server_id, NDB$source_epoch, NDB$count)
   )   ENGINE=NDB;
   ```

   Note

   O prefixo `NDB$` é obrigatório para as quatro colunas obrigatórias, uma vez que incluímos pelo menos uma das colunas `NDB$OP_TYPE`, `NDB$CFT_CAUSE` ou `NDB$ORIG_TRANSID` na definição da *table*.

3. Crie a *table* `test.t2` conforme mostrado anteriormente.

Estas etapas devem ser seguidas para cada *table* para a qual você deseja realizar a resolução de conflitos usando `NDB$OLD()`. Para cada *table* desta natureza, deve haver uma *row* correspondente em `mysql.ndb_replication`, e deve haver uma *exceptions table* no mesmo *database* da *table* que está sendo replicada.

**Detecção e resolução de conflitos de read.**

O NDB Cluster também suporta o rastreamento de operações de *read*, o que torna possível em configurações de *replication* circular gerenciar conflitos entre *reads* de uma determinada *row* em um *cluster* e *updates* ou *deletes* da mesma *row* em outro. Este exemplo usa as *tables* `employee` e `department` para modelar um cenário no qual um funcionário é movido de um departamento para outro no *cluster source* (ao qual nos referimos doravante como *cluster A*) enquanto o *cluster replica* (doravante *B*) atualiza a contagem de funcionários do antigo departamento do funcionário em uma *transaction* intercalada.

As *data tables* foram criadas usando as seguintes instruções SQL:

```sql
# Employee table
CREATE TABLE employee (
    id INT PRIMARY KEY,
    name VARCHAR(2000),
    dept INT NOT NULL
)   ENGINE=NDB;

# Department table
CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(2000),
    members INT
)   ENGINE=NDB;
```

O conteúdo das duas *tables* inclui as *rows* mostradas na saída (parcial) das seguintes instruções [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> SELECT id, name, dept FROM employee;
+---------------+------+
| id   | name   | dept |
+------+--------+------+
...
| 998  |  Mike  | 3    |
| 999  |  Joe   | 3    |
| 1000 |  Mary  | 3    |
...
+------+--------+------+

mysql> SELECT id, name, members FROM department;
+-----+-------------+---------+
| id  | name        | members |
+-----+-------------+---------+
...
| 3   | Old project | 24      |
...
+-----+-------------+---------+
```

Assumimos que já estamos usando uma *exceptions table* que inclui as quatro colunas obrigatórias (e estas são usadas para a *Primary Key* desta *table*), as colunas opcionais para tipo e causa da operação, e a coluna da *Primary Key* da *table* original, criada usando a instrução SQL mostrada aqui:

```sql
CREATE TABLE employee$EX  (
    NDB$server_id INT UNSIGNED,
    NDB$source_server_id INT UNSIGNED,
    NDB$source_epoch BIGINT UNSIGNED,
    NDB$count INT UNSIGNED,

    NDB$OP_TYPE ENUM( 'WRITE_ROW','UPDATE_ROW', 'DELETE_ROW',
                      'REFRESH_ROW','READ_ROW') NOT NULL,
    NDB$CFT_CAUSE ENUM( 'ROW_DOES_NOT_EXIST',
                        'ROW_ALREADY_EXISTS',
                        'DATA_IN_CONFLICT',
                        'TRANS_IN_CONFLICT') NOT NULL,

    id INT NOT NULL,

    PRIMARY KEY(NDB$server_id, NDB$source_server_id, NDB$source_epoch, NDB$count)
)   ENGINE=NDB;
```

Suponha que ocorram as duas *transactions* simultâneas nos dois *clusters*. No *cluster A*, criamos um novo departamento e, em seguida, movemos o funcionário número 999 para esse departamento, usando as seguintes instruções SQL:

```sql
BEGIN;
  INSERT INTO department VALUES (4, "New project", 1);
  UPDATE employee SET dept = 4 WHERE id = 999;
COMMIT;
```

Ao mesmo tempo, no *cluster B*, outra *transaction* faz um *read* de `employee`, conforme mostrado aqui:

```sql
BEGIN;
  SELECT name FROM employee WHERE id = 999;
  UPDATE department SET members = members - 1  WHERE id = 3;
commit;
```

As *transactions* conflitantes não são normalmente detectadas pelo mecanismo de resolução de conflitos, uma vez que o conflito está entre uma operação de *read* (`SELECT`) e uma operação de *update*. Você pode contornar este problema executando [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") [`ndb_log_exclusive_reads`](mysql-cluster-options-variables.html#sysvar_ndb_log_exclusive_reads) `= 1` no *cluster replica*. Adquirir *exclusive read locks* desta forma faz com que quaisquer *rows* lidas na *source* sejam sinalizadas como necessitando de resolução de conflitos no *cluster replica*. Se habilitarmos *exclusive reads* desta forma antes do *logging* destas *transactions*, o *read* no *cluster B* é rastreado e enviado ao *cluster A* para resolução; o conflito na *row* do funcionário é subsequentemente detectado e a *transaction* no *cluster B* é abortada.

O conflito é registrado na *exceptions table* (no *cluster A*) como uma operação `READ_ROW` (veja [Tabela de Exceções da Resolução de Conflitos](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-exceptions-table "Conflict Resolution Exceptions Table"), para uma descrição dos tipos de operação), conforme mostrado aqui:

```sql
mysql> SELECT id, NDB$OP_TYPE, NDB$CFT_CAUSE FROM employee$EX;
+-------+-------------+-------------------+
| id    | NDB$OP_TYPE | NDB$CFT_CAUSE     |
+-------+-------------+-------------------+
...
| 999   | READ_ROW    | TRANS_IN_CONFLICT |
+-------+-------------+-------------------+
```

Quaisquer *rows* existentes encontradas na operação de *read* são sinalizadas. Isso significa que múltiplas *rows* resultantes do mesmo conflito podem ser registradas na *exception table*, conforme mostrado ao examinar os efeitos de um conflito entre um *update* no *cluster A* e um *read* de múltiplas *rows* no *cluster B* da mesma *table* em *transactions* simultâneas. A *transaction* executada no *cluster A* é mostrada aqui:

```sql
BEGIN;
  INSERT INTO department VALUES (4, "New project", 0);
  UPDATE employee SET dept = 4 WHERE dept = 3;
  SELECT COUNT(*) INTO @count FROM employee WHERE dept = 4;
  UPDATE department SET members = @count WHERE id = 4;
COMMIT;
```

Concomitantemente, uma *transaction* contendo as instruções mostradas aqui é executada no *cluster B*:

```sql
SET ndb_log_exclusive_reads = 1;  # Must be set if not already enabled
...
BEGIN;
  SELECT COUNT(*) INTO @count FROM employee WHERE dept = 3 FOR UPDATE;
  UPDATE department SET members = @count WHERE id = 3;
COMMIT;
```

Neste caso, todas as três *rows* que correspondem à condição `WHERE` no `SELECT` da segunda *transaction* são lidas e, portanto, são sinalizadas na *exceptions table*, conforme mostrado aqui:

```sql
mysql> SELECT id, NDB$OP_TYPE, NDB$CFT_CAUSE FROM employee$EX;
+-------+-------------+-------------------+
| id    | NDB$OP_TYPE | NDB$CFT_CAUSE     |
+-------+-------------+-------------------+
...
| 998   | READ_ROW    | TRANS_IN_CONFLICT |
| 999   | READ_ROW    | TRANS_IN_CONFLICT |
| 1000  | READ_ROW    | TRANS_IN_CONFLICT |
...
+-------+-------------+-------------------+
```

O rastreamento de *read* é realizado apenas com base nas *rows* existentes. Um *read* baseado em uma determinada condição rastreia conflitos apenas de quaisquer *rows* que são *encontradas* e não de quaisquer *rows* que são inseridas em uma *transaction* intercalada. Isso é semelhante à forma como o *exclusive row locking* é realizado em uma única instância do NDB Cluster.