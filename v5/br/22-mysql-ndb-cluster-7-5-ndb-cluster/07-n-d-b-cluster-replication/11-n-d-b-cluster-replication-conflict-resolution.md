### 21.7.11 Resolução de conflitos na replicação em cluster do NDB

- Requisitos
- Controle de coluna de origem
- Controle de Resolução de Conflitos
- Funções de Resolução de Conflitos
- Tabela de exceções para resolução de conflitos
- Variáveis de status de detecção de conflitos
- Exemplos

Ao usar uma configuração de replicação que envolve múltiplas fontes (incluindo replicação circular), é possível que diferentes fontes tentem atualizar a mesma linha na replica com dados diferentes. A resolução de conflitos na Replicação de NDB Cluster fornece uma maneira de resolver tais conflitos, permitindo que uma coluna de resolução definida pelo usuário seja usada para determinar se uma atualização em uma fonte específica deve ser aplicada na replica ou

Alguns tipos de resolução de conflitos suportados pelo NDB Cluster (`NDB$OLD()`, `NDB$MAX()`, `NDB$MAX_DELETE_WIN()`) implementam essa coluna definida pelo usuário como uma coluna de tipo `timestamp` (embora seu tipo não possa ser `TIMESTAMP`, conforme explicado mais adiante nesta seção). Esses tipos de resolução de conflitos são sempre aplicados linha por linha, em vez de em nível transacional. As funções de resolução de conflitos baseadas em epocas `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` comparam a ordem em que as epocas são replicadas (e, portanto, essas funções são transacionais). Diferentes métodos podem ser usados para comparar os valores da coluna de resolução na replica quando ocorrem conflitos, conforme explicado mais adiante nesta seção; o método usado pode ser configurado para agir em uma única tabela, banco de dados ou servidor, ou em um conjunto de uma ou mais tabelas usando correspondência de padrões. Consulte Correspondência com asteriscos para obter informações sobre o uso de correspondências de padrões nas colunas `db`, `table_name` e `server_id` da tabela `mysql.ndb_replication`.

Você também deve ter em mente que é responsabilidade do aplicativo garantir que a coluna Resolução esteja corretamente preenchida com valores relevantes, para que a função de resolução possa fazer a escolha apropriada ao determinar se deve aplicar uma atualização.

#### Requisitos

As preparações para a resolução de conflitos devem ser feitas tanto na fonte quanto na replica. Essas tarefas estão descritas na lista a seguir:

- Ao escrever os logs binários na fonte, você deve determinar quais colunas serão enviadas (todas as colunas ou apenas aquelas que foram atualizadas). Isso é feito para o MySQL Server como um todo, aplicando a opção de inicialização **mysqld** `--ndb-log-updated-only` (descrita mais adiante nesta seção), ou em uma ou mais tabelas específicas, colocando as entradas apropriadas na tabela `mysql.ndb_replication` (veja Tabela ndb\_replication).

  Nota

  Se você estiver replicando tabelas com colunas muito grandes (como as colunas `TEXT` ou `BLOB`), `--ndb-log-updated-only` também pode ser útil para reduzir o tamanho dos logs binários e evitar possíveis falhas de replicação devido ao excedente de `max_allowed_packet`.

  Para obter mais informações sobre esse problema, consulte Seção 16.4.1.19, “Replicação e max\_allowed\_packet”.

- Na replica, você deve determinar qual tipo de resolução de conflitos aplicar (“o último timestamp vence”, “o mesmo timestamp vence”, “o primário vence”, “o primário vence, transação completa” ou nenhum). Isso é feito usando a tabela de sistema `mysql.ndb_replication`, e se aplica a uma ou mais tabelas específicas (consulte tabela ndb\_replication).

- O NDB Cluster também suporta a detecção de conflitos de leitura, ou seja, a detecção de conflitos entre leituras de uma determinada linha em um cluster e atualizações ou exclusões da mesma linha em outro cluster. Isso requer bloqueios de leitura exclusivos obtidos definindo `ndb_log_exclusive_reads` igual a 1 na replica. Todas as linhas lidas por uma leitura conflitante são registradas na tabela de exceções. Para mais informações, consulte Detecção e resolução de conflitos de leitura.

- O `NDB` aplica os eventos `WRITE_ROW` estritamente como inserções, exigindo que não haja nenhuma linha existente; ou seja, uma escrita de entrada é sempre rejeitada se a linha já existir.

Ao usar as funções `NDB$OLD()`, `NDB$MAX()` e `NDB$MAX_DELETE_WIN()` para resolução de conflitos baseada em temporizadores, frequentemente nos referimos à coluna usada para determinar as atualizações como uma coluna de “temporizador”. No entanto, o tipo de dados dessa coluna nunca é `TIMESTAMP`; em vez disso, seu tipo de dados deve ser `INT` (`INTEGER`) ou `BIGINT`. A coluna “temporizador” também deve ser `UNSIGNED` e `NOT NULL`.

As funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` discutidas mais adiante nesta seção funcionam comparando a ordem relativa das épocas de replicação aplicadas em um NDB Cluster primário e secundário e não utilizam timestamps.

#### Controle da coluna da fonte

Podemos ver as operações de atualização em termos de imagens de “antes” e “depois” — ou seja, os estados da tabela antes e depois da atualização ser aplicada. Normalmente, ao atualizar uma tabela com uma chave primária, a imagem de “antes” não é de grande interesse; no entanto, quando precisamos determinar, por atualização, se os valores atualizados devem ou não ser usados em uma réplica, precisamos garantir que ambas as imagens sejam escritas no log binário da fonte. Isso é feito com a opção `--ndb-log-update-as-write` para o **mysqld**, conforme descrito mais adiante nesta seção.

Importante

A decisão de registrar linhas completas ou apenas colunas atualizadas é tomada quando o servidor MySQL é iniciado e não pode ser alterada online. Você deve reiniciar **mysqld** ou iniciar uma nova instância de **mysqld** com opções de registro diferentes.

#### Controle de Resolução de Conflitos

A resolução de conflitos geralmente é habilitada no servidor onde os conflitos podem ocorrer. Assim como a seleção do método de registro, ela é habilitada por entradas na tabela `mysql.ndb_replication`.

`NBT_UPDATED_ONLY_MINIMAL` e `NBT_UPDATED_FULL_MINIMAL` podem ser usados com `NDB$EPOCH()`, `NDB$EPOCH2()` e `NDB$EPOCH_TRANS()`, porque esses não exigem valores de coluna "antes" que não sejam chaves primárias. Algoritmos de resolução de conflitos que exigem os valores antigos, como `NDB$MAX()` e `NDB$OLD()`, não funcionam corretamente com esses valores de `binlog_type`.

#### Funções de Resolução de Conflitos

Esta seção fornece informações detalhadas sobre as funções que podem ser usadas para detecção e resolução de conflitos com a Replicação NDB. Essas funções estão listadas aqui em ordem alfabética:

- NDB$OLD()
- NDB$MAX()
- NDB$MAX\_DELETE\_WIN()
- NDB$EPOCH()
- NDB$EPOCH\_TRANS
- NDB$EPOCH2
- NDB$EPOCH2\_TRANS

##### NDB$OLD()

Se o valor de *`column_name`* for o mesmo tanto na fonte quanto na réplica, a atualização será aplicada; caso contrário, a atualização não será aplicada na réplica e uma exceção será registrada no log. Isso é ilustrado pelo seguinte pseudocodigo:

```sql
if (source_old_column_value == replica_current_column_value)
  apply_update();
else
  log_exception();
```

Essa função pode ser usada para resolução de conflitos de "ganhador com o mesmo valor". Esse tipo de resolução de conflitos garante que as atualizações não sejam aplicadas na replica da fonte errada.

Importante

O valor da coluna da imagem "antes" da fonte é usado por esta função.

##### NDB$MAX()

Se o valor da coluna “timestamp” para uma determinada linha proveniente da fonte for maior que o da replica, ele é aplicado; caso contrário, ele não é aplicado na replica. Isso é ilustrado pelo seguinte pseudocodigo:

```sql
if (source_new_column_value > replica_current_column_value)
  apply_update();
```

Essa função pode ser usada para resolução de conflitos de "maior timestamp vence". Esse tipo de resolução de conflitos garante que, em caso de conflito, a versão da linha que foi atualizada mais recentemente é a versão que persiste.

Importante

O valor da coluna da imagem "after" das fontes é usado por esta função.

##### NDB$MAX\_DELETE\_WIN()

Esta é uma variação do `NDB$MAX()`. Devido ao fato de que não há um timestamp disponível para uma operação de exclusão, uma exclusão usando `NDB$MAX()` é, na verdade, processada como `NDB$OLD`, mas, para alguns casos de uso, isso não é ótimo. Para `NDB$MAX_DELETE_WIN()`, se o valor da coluna “timestamp” para uma determinada linha que adiciona ou atualiza uma linha existente proveniente da fonte for maior que o da replica, ele é aplicado. No entanto, as operações de exclusão são tratadas como tendo sempre o valor mais alto. Isso é ilustrado pelo seguinte pseudocodigo:

```sql
if ( (source_new_column_value > replica_current_column_value)
        ||
      operation.type == "delete")
  apply_update();
```

Essa função pode ser usada para a resolução de conflitos de "maior timestamp, exclui vitórias". Esse tipo de resolução de conflitos garante que, em caso de conflito, a versão da linha que foi excluída ou (de outra forma) mais recentemente atualizada é a versão que persiste.

Nota

Assim como no caso de `NDB$MAX()`, o valor da coluna da imagem "after" da fonte é o valor utilizado por essa função.

##### NDB$EPOCH()

A função `NDB$EPOCH()` rastreia a ordem em que as épocas replicadas são aplicadas em um clúster replicado em relação às alterações que têm origem na replica. Essa ordem relativa é usada para determinar se as alterações que têm origem na replica são concorrentes com quaisquer alterações que tenham origem localmente e, portanto, potencialmente em conflito.

A maioria do que segue na descrição de `NDB$EPOCH()` também se aplica a `NDB$EPOCH_TRANS()`. Quaisquer exceções são mencionadas no texto.

`NDB$EPOCH()` é assimétrico, operando em um único NDB Cluster em uma configuração de replicação bidirecional (às vezes referida como replicação "ativo-ativo"). Aqui, nos referimos ao cluster no qual ele opera como o primário, e o outro como o secundário. A replica no primário é responsável por detectar e lidar com conflitos, enquanto a replica no secundário não está envolvida em nenhum tipo de detecção ou resolução de conflitos.

Quando a replica no primário detecta conflitos, ela injeta eventos em seu próprio log binário para compensar esses conflitos; isso garante que o NDB Cluster secundário eventualmente se realine com o primário e, assim, mantenha o primário e o secundário não divergindo. Esse mecanismo de compensação e realinhamento exige que o NDB Cluster primário sempre vença quaisquer conflitos com o secundário — ou seja, que as alterações do primário sejam sempre usadas em vez das do secundário em caso de conflito. Essa regra de “primário sempre vence” tem as seguintes implicações:

- As operações que alteram dados, uma vez realizadas no primário, são totalmente persistentes e não são desfeitas ou revertidas pela detecção e resolução de conflitos.

- Os dados lidos do primário são totalmente consistentes. Quaisquer alterações aplicadas no primário (localmente ou a partir da replica) não são revertidas posteriormente.

- As operações que alteram dados no secundário podem ser revertidas posteriormente, caso o primário determine que estão em conflito.

- As linhas individuais lidas no secundário são consistentes em todos os momentos, cada linha sempre refletindo um estado comprometido pelo secundário ou por um comprometido pelo primário.

- Os conjuntos de linhas lidos no secundário podem não ser necessariamente consistentes em um único ponto de tempo. Para `NDB$EPOCH_TRANS()`, esse é um estado transitório; para `NDB$EPOCH()`, pode ser um estado persistente.

- Supondo um período de tempo suficiente sem quaisquer conflitos, todos os dados do NDB Cluster secundário (eventualmente) se tornam consistentes com os dados do primário.

`NDB$EPOCH()` e `NDB$EPOCH_TRANS()` não exigem nenhuma modificação no esquema do usuário ou alterações na aplicação para fornecer detecção de conflitos. No entanto, é necessário pensar cuidadosamente sobre o esquema utilizado e os padrões de acesso para verificar se o sistema completo se comporta dentro dos limites especificados.

Cada uma das funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` pode receber um parâmetro opcional; este é o número de bits a serem usados para representar os 32 bits inferiores da época, e deve ser definido como no mínimo o valor calculado conforme mostrado aqui:

```sql
CEIL( LOG2( TimeBetweenGlobalCheckpoints / TimeBetweenEpochs ), 1)
```

Para os valores padrão desses parâmetros de configuração (2000 e 100 milissegundos, respectivamente), isso resulta em um valor de 5 bits, portanto, o valor padrão (6) deve ser suficiente, a menos que outros valores sejam usados para `TimeBetweenGlobalCheckpoints`, `TimeBetweenEpochs` ou ambos. Um valor muito pequeno pode resultar em falsos positivos, enquanto um valor muito grande pode levar a um espaço desperdiçado excessivo no banco de dados.

Tanto o `NDB$EPOCH()` quanto o `NDB$EPOCH_TRANS()` inserem entradas para linhas conflitantes nas tabelas de exceções relevantes, desde que essas tabelas tenham sido definidas de acordo com as mesmas regras do esquema da tabela de exceções, conforme descrito em outras partes desta seção (veja NDB$OLD()). Você deve criar qualquer tabela de exceção antes de criar a tabela de dados com a qual ela será usada.

Assim como as outras funções de detecção de conflitos discutidas nesta seção, `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` são ativadas ao incluir entradas relevantes na tabela `mysql.ndb_replication` (veja tabela ndb\_replication). Os papéis dos Clustres NDB primários e secundários neste cenário são totalmente determinados pelas entradas da tabela `mysql.ndb_replication`.

Como os algoritmos de detecção de conflitos empregados por `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` são assimétricos, você deve usar valores diferentes para as entradas `server_id` das réplicas primária e secundária.

Um conflito entre operações `DELETE` por si só não é suficiente para desencadear um conflito usando `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`, e a colocação relativa dentro das épocas não importa.

**Limitações do NDB$EPOCH()**

As seguintes limitações atualmente se aplicam ao uso da função `NDB$EPOCH()` para detectar conflitos:

- Os conflitos são detectados usando os limites de época do NDB Cluster, com granularidade proporcional a `TimeBetweenEpochs` (padrão: 100 milissegundos). A janela mínima de conflito é o tempo mínimo durante o qual atualizações concorrentes dos mesmos dados em ambos os clusters sempre relatam um conflito. Isso é sempre um tempo não nulo e é aproximadamente proporcional a `2 * (latência + filagem + TimeBetweenEpochs)`. Isso implica que, assumindo o padrão para `TimeBetweenEpochs` e ignorando qualquer latência entre os clusters (bem como quaisquer atrasos de filagem), o tamanho da janela mínima de conflito é aproximadamente 200 milissegundos. Essa janela mínima deve ser considerada ao analisar os padrões esperados de "corrida" do aplicativo.

- Armazenamento adicional é necessário para tabelas que utilizam as funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`; são necessários de 1 a 32 bits de espaço extra por linha, dependendo do valor passado para a função.

- Conflitos entre operações de exclusão podem resultar em divergência entre os clusters primário e secundário. Quando uma linha é excluída em ambos os clusters simultaneamente, o conflito pode ser detectado, mas não é registrado, uma vez que a linha foi excluída. Isso significa que conflitos adicionais durante a propagação de quaisquer operações subsequentes de realinhamento não são detectados, o que pode levar à divergência.

  Os apagamentos devem ser serializados externamente ou encaminhados para apenas um cluster. Alternativamente, uma linha separada deve ser atualizada transacionalmente com esses apagamentos e quaisquer inserções que os sigam, para que os conflitos possam ser rastreados em apagamentos de linhas. Isso pode exigir alterações nos aplicativos.

- Atualmente, apenas dois clusters do NDB em uma configuração bidirecional "ativo-ativo" são suportados ao usar `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()` para detecção de conflitos.

- As tabelas com colunas `BLOB` ou `TEXT` não são atualmente suportadas com `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`.

##### NDB$EPOCH\_TRANS()

`NDB$EPOCH_TRANS()` estende a função `NDB$EPOCH()`. Os conflitos são detectados e tratados da mesma maneira, usando a regra "o primário vence sempre" (veja NDB$EPOCH()), mas com a condição adicional de que quaisquer outras linhas atualizadas na mesma transação em que o conflito ocorreu também são consideradas em conflito. Em outras palavras, onde `NDB$EPOCH()` realinha linhas conflitantes individuais no secundário, `NDB$EPOCH_TRANS()` realinha transações conflitantes.

Além disso, quaisquer transações que sejam dependentes de forma detectável de uma transação conflitante também são consideradas conflitantes, essas dependências sendo determinadas pelo conteúdo do log binário do cluster secundário. Como o log binário contém apenas operações de modificação de dados (inserções, atualizações e exclusões), apenas as modificações de dados sobrepostos são usadas para determinar as dependências entre as transações.

`NDB$EPOCH_TRANS()` está sujeito às mesmas condições e limitações que `NDB$EPOCH()`, e, além disso, exige que sejam usados eventos de linha de log binário da versão 2 (`log_bin_use_v1_row_events` igual a 0), o que adiciona um custo de armazenamento de 2 bytes por evento no log binário. Além disso, todos os IDs de transação devem ser registrados no log binário do secundário, usando `--ndb-log-transaction-id` (variável de sistema `log_bin_use_v1_row_events` no arquivo `replication-options-binary-log.html`#sysvar\_log\_bin\_use\_v1\_row\_events) definido como `ON`. Isso adiciona uma quantidade variável de overhead (até 13 bytes por linha).

Veja NDB$EPOCH().

##### NDB$EPOCH2()

A função `NDB$EPOCH2()` é semelhante à `NDB$EPOCH()`, exceto que `NDB$EPOCH2()` oferece suporte à manipulação de apagamento-apagamento com uma topologia de replicação bidirecional. Nesse cenário, os papéis primário e secundário são atribuídos às duas fontes ao definir a variável de sistema `ndb_slave_conflict_role` para o valor apropriado em cada fonte (geralmente um para cada `PRIMARY` e `SECONDARY`). Quando isso é feito, as modificações feitas pelo secundário são refletidas pelo primário para o secundário, que as aplica condicionalmente.

##### NDB$EPOCH2\_TRANS()

`NDB$EPOCH2_TRANS()` estende a função `NDB$EPOCH2()`. Os conflitos são detectados e tratados da mesma maneira, e a atribuição de papéis primários e secundários aos clústeres replicados, mas com a condição adicional de que quaisquer outras linhas atualizadas na mesma transação em que o conflito ocorreu também são consideradas em conflito. Ou seja, `NDB$EPOCH2()` realinha as linhas conflitantes individuais no secundário, enquanto `NDB$EPOCH_TRANS()` realinha as transações conflitantes.

Quando `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` usam metadados especificados por linha, por última modificação de época, para determinar se uma mudança de linha replicada recebida do secundário é concorrente com uma mudança localmente confirmada no primário; as mudanças concorrentes são consideradas conflitantes, com atualizações da tabela de exceções subseqüentes e realinhamento do secundário. Um problema surge quando uma linha é excluída no primário, de modo que não há mais nenhuma última modificação de época disponível para determinar se alguma operação replicada está em conflito, o que significa que operações de exclusão conflitantes não são detectadas. Isso pode resultar em divergência, um exemplo sendo uma exclusão em um clúster que é concorrente com uma exclusão e inserção no outro; é por isso que as operações de exclusão podem ser direcionadas apenas para um clúster ao usar `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`.

`NDB$EPOCH2()` evita o problema descrito acima, armazenando informações sobre as linhas excluídas no PRIMARY, ignorando qualquer conflito de exclusão e evitando qualquer possível divergência resultante. Isso é feito refletindo qualquer operação aplicada com sucesso no secundário e replicando-a do secundário de volta ao secundário. Ao retornar ao secundário, ele pode ser usado para reaplicar uma operação no secundário que foi excluída por uma operação originada do primário.

Ao usar `NDB$EPOCH2()`, você deve ter em mente que o secundário aplica a exclusão do primário, removendo a nova linha até que seja restaurada por uma operação refletida. Teoricamente, a subsequente inserção ou atualização no secundário entra em conflito com a exclusão do primário, mas, neste caso, escolhemos ignorar isso e permitir que o secundário "ganhe", no interesse de prevenir a divergência entre os clusters. Em outras palavras, após uma exclusão, o primário não detecta conflitos e, em vez disso, adota imediatamente as próximas alterações do secundário. Por causa disso, o estado do secundário pode revisitar múltiplos estados comprometidos anteriores à medida que avança para um estado final (estável), e alguns deles podem ser visíveis.

Você também deve estar ciente de que refletir todas as operações do secundário para o primário aumenta o tamanho do logbinary do log do primário, além de exigir largura de banda, uso da CPU e I/O de disco.

A aplicação de operações refletidas no secundário depende do estado da linha-alvo no secundário. Se as alterações refletidas forem aplicadas ou não no secundário pode ser rastreado verificando as variáveis de estado `Ndb_conflict_reflected_op_prepare_count` e `Ndb_conflict_reflected_op_discard_count`. O número de alterações aplicadas é simplesmente a diferença entre esses dois valores (note que `Ndb_conflict_reflected_op_prepare_count` é sempre maior ou igual a `Ndb_conflict_reflected_op_discard_count`).

Os eventos são aplicados se e somente se ambas as seguintes condições forem verdadeiras:

- A existência da linha — ou seja, se ela existe ou não — está de acordo com o tipo de operação. Para operações de exclusão e atualização, a linha já deve existir. Para operações de inserção, a linha *não* deve existir.

- A linha foi modificada pela última vez pelo primary. É possível que a modificação tenha sido realizada por meio da execução de uma operação refletida.

Se nenhuma dessas condições for atendida, a operação refletida é descartada pelo secundário.

#### Tabela de exceções para resolução de conflitos

Para usar a função de resolução de conflitos `NDB$OLD()`, também é necessário criar uma tabela de exceções correspondente a cada tabela `[NDB]` (mysql-cluster.html) para a qual esse tipo de resolução de conflitos será empregado. Isso também é verdadeiro ao usar `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`. O nome dessa tabela é o nome da tabela para a qual a resolução de conflitos será aplicada, com a string `$EX` anexada. (Por exemplo, se o nome da tabela original for `mytable`, o nome da tabela de exceções correspondente deve ser `mytable$EX`.) A sintaxe para criar a tabela de exceções é mostrada aqui:

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

As primeiras quatro colunas são obrigatórias. Os nomes das primeiras quatro colunas e das colunas que correspondem às colunas da chave primária da tabela original não são críticos; no entanto, sugerimos, por razões de clareza e consistência, que você use os nomes mostrados aqui para as colunas `server_id`, `source_server_id`, `source_epoch` e `count`, e que você use os mesmos nomes que na tabela original para as colunas que correspondem às da chave primária da tabela original.

Se a tabela de exceções utilizar uma ou mais das colunas opcionais `NDB$OP_TYPE`, `NDB$CFT_CAUSE` ou `NDB$ORIG_TRANSID`, discutidas mais adiante nesta seção, então cada uma das colunas obrigatórias também deve ser nomeada usando o prefixo `NDB$`. Se desejar, você pode usar o prefixo `NDB$` para nomear as colunas obrigatórias, mesmo que você não defina nenhuma coluna opcional, mas, nesse caso, todas as quatro colunas obrigatórias devem ser nomeadas usando o prefixo.

Após essas colunas, as colunas que compõem a chave primária da tabela original devem ser copiadas na ordem em que são usadas para definir a chave primária da tabela original. Os tipos de dados das colunas que duplicam as colunas da chave primária da tabela original devem ser os mesmos (ou maiores que) os dos colunas originais. Pode-se usar um subconjunto das colunas da chave primária.

A tabela de exceções deve usar o mecanismo de armazenamento `NDB`. (Um exemplo que usa `NDB$OLD()` com uma tabela de exceções é mostrado mais adiante nesta seção.)

Colunas adicionais podem ser definidas opcionalmente após as colunas da chave primária copiadas, mas não antes de qualquer uma delas; quaisquer colunas extras desse tipo não podem ser `NOT NULL`. O NDB Cluster suporta três colunas opcionais adicionais e pré-definidas `NDB$OP_TYPE`, `NDB$CFT_CAUSE` e `NDB$ORIG_TRANSID`, que são descritas nos próximos parágrafos.

`NDB$OP_TYPE`: Esta coluna pode ser usada para obter o tipo de operação que está causando o conflito. Se você usar esta coluna, defina-a conforme mostrado aqui:

```sql
NDB$OP_TYPE ENUM('WRITE_ROW', 'UPDATE_ROW', 'DELETE_ROW',
    'REFRESH_ROW', 'READ_ROW') NOT NULL
```

Os tipos de operações `WRITE_ROW`, `UPDATE_ROW` e `DELETE_ROW` representam operações iniciadas pelo usuário. As operações `REFRESH_ROW` são operações geradas pela resolução de conflitos em transações compensatórias enviadas de volta ao clúster de origem do clúster que detectou o conflito. As operações `READ_ROW` são operações de rastreamento de leitura iniciadas pelo usuário, definidas com bloqueios exclusivos de linha.

`NDB$CFT_CAUSE`: Você pode definir uma coluna opcional `NDB$CFT_CAUSE` que fornece a causa do conflito registrado. Essa coluna, se usada, é definida conforme mostrado aqui:

```sql
NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
    'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL
```

`ROW_DOES_NOT_EXIST` pode ser relatado como a causa para as operações `UPDATE_ROW` e `WRITE_ROW`; `ROW_ALREADY_EXISTS` pode ser relatado para eventos `WRITE_ROW`. `DATA_IN_CONFLICT` é relatado quando uma função de conflito baseado em linha detecta um conflito; `TRANS_IN_CONFLICT` é relatado quando uma função de conflito transacional rejeita todas as operações pertencentes a uma transação completa.

`NDB$ORIG_TRANSID`: A coluna `NDB$ORIG_TRANSID`, se utilizada, contém o ID da transação de origem. Esta coluna deve ser definida da seguinte forma:

```sql
NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL
```

`NDB$ORIG_TRANSID` é um valor de 64 bits gerado pelo `NDB`. Esse valor pode ser usado para correlacionar várias entradas da tabela de exceções que pertencem à mesma transação conflitante, provenientes de tabelas de exceções iguais ou diferentes.

Colunas de referência adicionais que não fazem parte da chave primária da tabela original podem ser nomeadas `colname$OLD` ou `colname$NEW`. `colname$OLD` faz referência a valores antigos em operações de atualização e exclusão — ou seja, operações que contêm eventos `DELETE_ROW`. `colname$NEW` pode ser usado para fazer referência a novos valores em operações de inserção e atualização — em outras palavras, operações que usam eventos `WRITE_ROW`, `UPDATE_ROW` ou ambos. Quando uma operação conflitante não fornece um valor para uma coluna de referência específica que não é uma chave primária, a linha da tabela de exceções contém `NULL` ou um valor padrão definido para essa coluna.

Importante

A tabela `mysql.ndb_replication` é lida quando uma tabela de dados é configurada para replicação, portanto, a linha correspondente a uma tabela a ser replicada deve ser inserida em \`mysql.ndb\_replication *antes* de a tabela a ser replicada ser criada.

#### Variáveis de Status de Detecção de Conflitos

Várias variáveis de status podem ser usadas para monitorar a detecção de conflitos. Você pode ver quantos registros foram encontrados em conflito desde que essa replica foi reiniciada pela última vez a partir do valor atual da variável de status do sistema `Ndb_conflict_fn_epoch`.

`Ndb_conflict_fn_epoch_trans` fornece o número de linhas que foram encontradas diretamente em conflito pelo `NDB$EPOCH_TRANS()`. `Ndb_conflict_fn_epoch2` e `Ndb_conflict_fn_epoch2_trans` mostram o número de linhas encontradas em conflito pelo `NDB$EPOCH2()` e `NDB$EPOCH2_TRANS()`, respectivamente. O número de linhas realmente realinhadas, incluindo aquelas afetadas devido à sua pertença ou dependência das mesmas transações que outras linhas em conflito, é dado por `Ndb_conflict_trans_row_reject_count`.

Outra variável de status do servidor `Ndb_conflict_fn_max` fornece um contagem do número de vezes que uma linha não foi aplicada no nó SQL atual devido à resolução de conflitos "maior timestamp vence" desde a última vez que o **mysqld** foi iniciado. `Ndb_conflict_fn_max_del_win` fornece um contagem do número de vezes que a resolução de conflitos com base no resultado de `NDB$MAX_DELETE_WIN()` foi aplicada.

O número de vezes que uma linha não foi aplicada como resultado da resolução de conflitos "mesmo timestamp vence" em um determinado **mysqld** desde a última vez que foi reiniciado é fornecido pela variável de status global `Ndb_conflict_fn_old`. Além de incrementar `Ndb_conflict_fn_old`, a chave primária da linha que não foi usada é inserida em uma tabela de exceções, conforme explicado em outra parte desta seção.

Veja também Seção 21.4.3.9.3, “Variáveis de Status do NDB Cluster”.

#### Exemplos

Os exemplos a seguir pressupõem que você já tenha uma configuração de replicação de NDB Cluster funcionando, conforme descrito em Seção 21.7.5, “Preparando o NDB Cluster para Replicação” e Seção 21.7.6, “Iniciando a Replicação do NDB Cluster (Canal de Replicação Único)”.

**Exemplo de NDB$MAX().** Suponha que você queira habilitar a resolução de conflitos "o maior timestamp vence" na tabela `test.t1`, usando a coluna `mycol` como o "timestamp". Isso pode ser feito seguindo os seguintes passos:

1. Certifique-se de que você iniciou a fonte **mysqld** com `--ndb-log-update-as-write=OFF`.

2. Na fonte, execute esta instrução `INSERT`:

   ```sql
   INSERT INTO mysql.ndb_replication
       VALUES ('test', 't1', 0, NULL, 'NDB$MAX(mycol)');
   ```

   Nota

   Se a tabela `ndb_replication` ainda não existir, você deve criá-la. Consulte Tabela ndb\_replication.

   Inserir um 0 na coluna `server_id` indica que todos os nós SQL que acessam essa tabela devem usar a resolução de conflitos. Se você deseja usar a resolução de conflitos apenas em um **mysqld** específico, use o ID do servidor real.

   Inserir `NULL` na coluna `binlog_type` tem o mesmo efeito que inserir 0 (`NBT_DEFAULT`); o padrão do servidor é usado.

3. Crie a tabela `test.t1`:

   ```sql
   CREATE TABLE test.t1 (
       columns
       mycol INT UNSIGNED,
       columns
   ) ENGINE=NDB;
   ```

   Agora, quando as atualizações são realizadas nesta tabela, a resolução de conflitos é aplicada e a versão da linha com o maior valor para `mycol` é escrita na replica.

Nota

Outras opções do `binlog_type`, como `NBT_UPDATED_ONLY_USE_UPDATE` (`6`), devem ser usadas para controlar o registro na fonte usando a tabela `ndb_replication`, em vez de usar opções da linha de comando.

**Exemplo de NDB$OLD().** Suponha que uma tabela `NDB` (mysql-cluster.html), como a definida aqui, esteja sendo replicada e você queira habilitar a resolução de conflitos "mesmo timestamp vence" para atualizações nesta tabela:

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

São necessários os seguintes passos, na ordem indicada:

1. Primeiro — e *antes* de criar `test.t2` — você deve inserir uma linha na tabela `mysql.ndb_replication`, conforme mostrado aqui:

   ```sql
   INSERT INTO mysql.ndb_replication
       VALUES ('test', 't2', 0, 0, 'NDB$OLD(mycol)');
   ```

   Os valores possíveis para a coluna `binlog_type` são mostrados anteriormente nesta seção; neste caso, usamos `0` para especificar que o comportamento padrão de registro do servidor seja usado. O valor `'NDB$OLD(mycol)'` deve ser inserido na coluna `conflict_fn`.

2. Crie uma tabela de exceções apropriada para `test.t2`. A declaração de criação da tabela mostrada aqui inclui todas as colunas necessárias; quaisquer colunas adicionais devem ser declaradas após essas colunas e antes da definição da chave primária da tabela.

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

   Podemos incluir colunas adicionais para informações sobre o tipo, causa e ID da transação de origem para um determinado conflito. Além disso, não somos obrigados a fornecer colunas correspondentes para todas as colunas da chave primária da tabela original. Isso significa que você pode criar a tabela de exceções da seguinte maneira:

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

   Nota

   O prefixo `NDB$` é necessário para as quatro colunas obrigatórias, pois incluímos pelo menos uma das colunas `NDB$OP_TYPE`, `NDB$CFT_CAUSE` ou `NDB$ORIG_TRANSID` na definição da tabela.

3. Crie a tabela `test.t2` conforme mostrado anteriormente.

Essas etapas devem ser seguidas para cada tabela para a qual você deseja realizar a resolução de conflitos usando `NDB$OLD()`. Para cada tabela desse tipo, deve haver uma linha correspondente no `mysql.ndb_replication` e deve haver uma tabela de exceções no mesmo banco de dados da tabela que está sendo replicada.

**Leia sobre detecção e resolução de conflitos.**

O NDB Cluster também suporta o rastreamento de operações de leitura, o que permite, em configurações de replicação circular, gerenciar conflitos entre leituras de uma determinada linha em um cluster e atualizações ou exclusões da mesma linha em outro. Este exemplo usa as tabelas `employee` e `department` para modelar um cenário em que um funcionário é movido de um departamento para outro no cluster de origem (a que chamamos de cluster *A*) enquanto o cluster de replica (a seguir *B*) atualiza o número de funcionários do antigo departamento do funcionário em uma transação intercalada.

As tabelas de dados foram criadas usando as seguintes instruções SQL:

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

O conteúdo das duas tabelas inclui as linhas exibidas na saída (parcial) das seguintes instruções `SELECT`:

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

Acreditamos que já estamos usando uma tabela de exceções que inclui as quatro colunas necessárias (e essas são usadas como chave primária dessa tabela), as colunas opcionais para o tipo de operação e a causa, e a coluna da chave primária da tabela original, criada usando a instrução SQL mostrada aqui:

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

Suponha que ocorram as duas transações simultâneas nos dois clusters. No cluster *A*, criamos um novo departamento e, em seguida, movemos o número de empregado 999 para esse departamento, usando as seguintes instruções SQL:

```sql
BEGIN;
  INSERT INTO department VALUES (4, "New project", 1);
  UPDATE employee SET dept = 4 WHERE id = 999;
COMMIT;
```

Ao mesmo tempo, no conjunto *B*, outra transação lê do `employee`, como mostrado aqui:

```sql
BEGIN;
  SELECT name FROM employee WHERE id = 999;
  UPDATE department SET members = members - 1  WHERE id = 3;
commit;
```

As transações conflitantes normalmente não são detectadas pelo mecanismo de resolução de conflitos, uma vez que o conflito está entre uma operação de leitura (`SELECT`) e uma operação de atualização. Você pode contornar esse problema executando `SET` `ndb_log_exclusive_reads` `= 1` no clúster de replica. Ao adquirir bloqueios de leitura exclusivos dessa maneira, quaisquer linhas lidas na fonte são marcadas como necessitando de resolução de conflito no clúster de replica. Se ativarmos as leituras exclusivas dessa maneira antes da logagem dessas transações, a leitura no clúster *B* é rastreada e enviada ao clúster *A* para resolução; o conflito na linha do funcionário é detectado posteriormente e a transação no clúster *B* é abortada.

O conflito está registrado na tabela de exceções (no grupo *A*) como uma operação `READ_ROW` (consulte Tabela de Exceções de Resolução de Conflitos, para uma descrição dos tipos de operações), conforme mostrado aqui:

```sql
mysql> SELECT id, NDB$OP_TYPE, NDB$CFT_CAUSE FROM employee$EX;
+-------+-------------+-------------------+
| id    | NDB$OP_TYPE | NDB$CFT_CAUSE     |
+-------+-------------+-------------------+
...
| 999   | READ_ROW    | TRANS_IN_CONFLICT |
+-------+-------------+-------------------+
```

Quaisquer linhas existentes encontradas na operação de leitura são marcadas. Isso significa que múltiplas linhas resultantes do mesmo conflito podem ser registradas na tabela de exceções, conforme demonstrado ao examinar os efeitos de um conflito entre uma atualização no cluster *A* e uma leitura de múltiplas linhas no cluster *B* da mesma tabela em transações simultâneas. A transação executada no cluster *A* é mostrada aqui:

```sql
BEGIN;
  INSERT INTO department VALUES (4, "New project", 0);
  UPDATE employee SET dept = 4 WHERE dept = 3;
  SELECT COUNT(*) INTO @count FROM employee WHERE dept = 4;
  UPDATE department SET members = @count WHERE id = 4;
COMMIT;
```

Ao mesmo tempo, uma transação contendo as declarações mostradas aqui está em execução no clúster *B*:

```sql
SET ndb_log_exclusive_reads = 1;  # Must be set if not already enabled
...
BEGIN;
  SELECT COUNT(*) INTO @count FROM employee WHERE dept = 3 FOR UPDATE;
  UPDATE department SET members = @count WHERE id = 3;
COMMIT;
```

Neste caso, todas as três linhas que correspondem à condição `WHERE` na consulta `SELECT` da segunda transação são lidas e, portanto, marcadas na tabela de exceções, conforme mostrado aqui:

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

A leitura de rastreamento é realizada com base apenas nas linhas existentes. Uma leitura baseada em uma condição específica conflitará apenas com quaisquer linhas que sejam *encontradas* e não com quaisquer linhas que sejam inseridas em uma transação intercalada. Isso é semelhante à forma como o bloqueio exclusivo de linhas é realizado em uma única instância do NDB Cluster.
