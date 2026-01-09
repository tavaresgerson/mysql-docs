#### 19.1.3.2 Ciclo de Vida do GTID

O ciclo de vida de um GTID consiste nas seguintes etapas:

1. Uma transação é executada e confirmada na fonte. Essa transação do cliente recebe um GTID composto pelo UUID da fonte e pelo menor número de sequência de transação não nulo ainda não utilizado neste servidor. O GTID é escrito no log binário da fonte (imediatamente antes da própria transação no log). Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não recebe um GTID.

2. Se um GTID foi atribuído para a transação, ele é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo binário de log anterior na tabela `mysql.gtid_executed`.

3. Se um GTID foi atribuído para a transação, o GTID é externalizado de forma não atômica (muito pouco tempo após a transação ser confirmada) adicionando-o ao conjunto de GTIDs na variável de sistema `@@GLOBAL.gtid_executed`. Este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID confirmadas e é usado na replicação como um token que representa o estado do servidor. Com o registro binário habilitado (como exigido pela fonte), o conjunto de GTIDs na variável de sistema `@@GLOBAL.gtid_executed` é um registro completo das transações aplicadas, mas a tabela `mysql.gtid_executed` não é, porque o histórico mais recente ainda está no arquivo binário de log atual.

4. Após os dados do log binário serem transmitidos para a replica e armazenados no log de retransmissão da replica (usando mecanismos estabelecidos para esse processo, consulte a Seção 19.2, “Implementação de Replicação”, para detalhes), a replica lê o GTID e define o valor da variável de sistema `gtid_next` como esse GTID. Isso indica à replica que a próxima transação deve ser registrada usando esse GTID. É importante notar que a replica define `gtid_next` em um contexto de sessão.

5. A replica verifica se nenhum thread já assumiu a propriedade do GTID em `gtid_next` para processar a transação. Ao ler e verificar o GTID da transação replicada primeiro, antes de processar a própria transação, a replica garante não apenas que nenhuma transação anterior com esse GTID foi aplicada na replica, mas também que nenhuma outra sessão já leu esse GTID, mas ainda não comprometeu a transação associada. Portanto, se vários clientes tentarem aplicar a mesma transação simultaneamente, o servidor resolve isso permitindo que apenas um deles execute. A variável de sistema `gtid_owned` (`@@GLOBAL.gtid_owned`) da replica mostra cada GTID que está atualmente em uso e o ID do thread que a possui. Se o GTID já tiver sido usado, nenhum erro é levantado, e a função de auto-skip é usada para ignorar a transação.

6. Se o GTID não tiver sido usado, a replica aplica a transação replicada. Como `gtid_next` é definido como o GTID já atribuído pela fonte, a replica não tenta gerar um novo GTID para essa transação, mas usa o GTID armazenado em `gtid_next`.

7. Se o registro binário estiver habilitado na replica, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo binário anterior da tabela `mysql.gtid_executed`.

8. Se o registro binário estiver desabilitado na replica, o GTID é persistido de forma atômica escrevendo-o diretamente na tabela `mysql.gtid_executed`. O MySQL adiciona uma declaração à transação para inserir o GTID na tabela. Esta operação é atômica tanto para declarações DDL quanto para declarações DML. Nesta situação, a tabela `mysql.gtid_executed` é um registro completo das transações aplicadas na replica.

9. Muito pouco tempo após a transação replicada ser commitada na replica, o GTID é externalizado de forma não atômica, adicionando-o ao conjunto de GTIDs na variável de sistema `@@GLOBAL.gtid_executed` (para a replica). Quanto à origem, este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID comprometidas. Se o registro binário estiver desabilitado na replica, a tabela `mysql.gtid_executed` também é um registro completo das transações aplicadas na replica. Se o registro binário estiver habilitado na replica, o que significa que alguns GTIDs são registrados apenas no log binário, o conjunto de GTIDs na variável de sistema `gtid_executed` é o único registro completo.

As transações do cliente que são completamente filtradas na fonte não recebem um GTID, portanto, não são adicionadas ao conjunto de transações na variável de sistema `gtid_executed`, nem são adicionadas à tabela `mysql.gtid_executed`. No entanto, os GTIDs das transações replicadas que são completamente filtradas na replica são preservados. Se o registro binário estiver habilitado na replica, a transação filtrada é escrita no log binário como um `Gtid_log_event` seguido por uma transação vazia que contém apenas as instruções `BEGIN` e `COMMIT`. Se o registro binário estiver desabilitado, o GTID da transação filtrada é escrito na tabela `mysql.gtid_executed`. Preservar os GTIDs para as transações filtradas garante que a tabela `mysql.gtid_executed` e o conjunto de GTIDs na variável de sistema `gtid_executed` possam ser compactados. Isso também garante que as transações filtradas não sejam recuperadas novamente se a replica se reconectar à fonte, conforme explicado na Seção 19.1.3.3, “Autoposicionamento do GTID”.

Em uma replica multithread, as transações podem ser aplicadas em paralelo, então as transações replicadas podem ser confirmadas fora de ordem (a menos que `replica_preserve_commit_order = 1`). Quando isso acontece, o conjunto de GTIDs na variável de sistema `gtid_executed` contém múltiplos intervalos de GTIDs com lacunas entre eles. (Em uma fonte ou em uma replica de único thread, há GTIDs crescentemente crescentes sem lacunas entre os números.) As lacunas em replicações multithread ocorrem apenas entre as transações mais recentemente aplicadas e são preenchidas à medida que a replicação progride. Quando os threads de replicação são interrompidos de forma limpa usando a declaração `STOP REPLICA`, as transações em andamento são aplicadas para que as lacunas sejam preenchidas. No caso de um desligamento, como uma falha do servidor ou o uso da declaração `KILL` para interromper os threads de replicação, as lacunas podem permanecer.

##### Quais mudanças são atribuídas a um GTID?

O cenário típico é que o servidor gera um novo GTID para uma transação confirmada. No entanto, GTIDs também podem ser atribuídos a outras mudanças além de transações, e, em alguns casos, uma única transação pode ser atribuída a múltiplos GTIDs.

Cada mudança de banco de dados (DDL ou DML) que é escrita no log binário é atribuída a um GTID. Isso inclui mudanças que são autoconfirmadas e mudanças que são confirmadas usando as declarações `BEGIN` e `COMMIT` ou `START TRANSACTION`. Um GTID também é atribuído à criação, alteração ou exclusão de um banco de dados e de um objeto de banco de dados não de tabela, como um procedimento, função, gatilho, evento, visão, usuário, papel ou concessão.

Atualizações não transacionais, assim como atualizações transacionais, recebem GTIDs. Além disso, para uma atualização não transacional, se ocorrer uma falha de escrita em disco ao tentar gravar no cache do log binário e, portanto, for criada uma lacuna no log binário, o evento de registro de incidente resultante recebe um GTID.

Quando uma tabela é automaticamente eliminada por uma instrução gerada no log binário, um GTID é atribuído à instrução. Tabelas temporárias são eliminadas automaticamente quando uma replica começa a aplicar eventos de uma fonte que acabou de ser iniciada, e quando a replicação baseada em instruções está em uso (`binlog_format=STATEMENT`) e uma sessão do usuário que tem tabelas temporárias abertas se desconecta. Tabelas que usam o motor de armazenamento `MEMORY` são excluídas automaticamente na primeira vez que são acessadas após o servidor ser iniciado, porque as linhas podem ter sido perdidas durante o desligamento.

Quando uma transação não é escrita no log binário no servidor de origem, o servidor não atribui um GTID a ela. Isso inclui transações que são revertidas e transações que são executadas enquanto o registro binário está desativado no servidor de origem, seja globalmente (com `--skip-log-bin` especificado na configuração do servidor) ou para a sessão (`SET @@SESSION.sql_log_bin = 0`). Isso também inclui transações sem efeito quando a replicação baseada em linhas está em uso (`binlog_format=ROW`).

As transações XA recebem GTIDs separados para a fase `XA PREPARE` da transação e para a fase `XA COMMIT` ou `XA ROLLBACK` da transação. As transações XA são preparadas de forma persistente para que os usuários possam comprometer ou reverter elas no caso de uma falha (o que, em uma topologia de replicação, pode incluir uma transição para outro servidor). As duas partes da transação são, portanto, replicadas separadamente, então elas devem ter seus próprios GTIDs, mesmo que uma transação não XA que seja revertida não tenha um GTID.

Nos seguintes casos especiais, uma única instrução pode gerar múltiplas transações e, portanto, ser atribuída múltiplos GTIDs:

* Uma procedura armazenada é invocada e compromete múltiplas transações. Um GTID é gerado para cada transação que a procedura compromete.

* Uma instrução `DROP TABLE` de várias tabelas exclui tabelas de diferentes tipos. Múltiplos GTIDs podem ser gerados se alguma das tabelas usar motores de armazenamento que não suportam DDL atômico, ou se alguma das tabelas for uma tabela temporária.

* Uma instrução `CREATE TABLE ... SELECT` é emitida quando a replicação baseada em linhas está em uso (`binlog_format=ROW`). Um GTID é gerado para a ação `CREATE TABLE` e um GTID é gerado para as ações de inserção de linhas.

##### A variável de sistema gtid_next

Por padrão, para novas transações comprometidas em sessões de usuário, o servidor gera e atribui automaticamente um novo GTID. Quando a transação é aplicada em uma replica, o GTID do servidor de origem é preservado. Você pode alterar esse comportamento configurando o valor de sessão da variável de sistema `gtid_next`:

* Quando `gtid_next` está definido como `AUTOMATIC` (o padrão) e uma transação é confirmada e escrita no log binário, o servidor gera e atribui automaticamente um novo GTID. Se uma transação for revertida ou não escrita no log binário por outro motivo, o servidor não gera e atribui um GTID.

* Se você definir `gtid_next` como `AUTOMATIC:TAG`, um novo GTID que inclui a tag especificada é atribuído a cada nova transação.

* Se você definir `gtid_next` como um GTID válido (composto por um UUID, uma tag opcional e um número de sequência de transação, separados por um colon), o servidor atribui esse GTID à sua transação. Esse GTID é atribuído e adicionado a `gtid_executed`, mesmo quando a transação não é escrita no log binário, ou quando a transação está vazia.

Lembre-se de que, após definir `gtid_next` como um GTID específico (no formato `UUID:NUMBER` ou `UUID:TAG:NUMBER`), e a transação ter sido confirmada ou revertida, uma declaração explícita `SET @@SESSION.gtid_next` deve ser emitida antes de qualquer outra declaração. Você pode usar isso para definir o valor do GTID de volta para `AUTOMATIC` se não quiser atribuir mais GTIDs explicitamente.

Quando os threads do aplicador de replicação aplicam transações replicadas, eles usam essa técnica, definindo explicitamente `@@SESSION.gtid_next` para o GTID da transação replicada conforme atribuído no servidor de origem. Isso significa que o GTID do servidor de origem é mantido, em vez de um novo GTID ser gerado e atribuído pela replica. Isso também significa que o GTID é adicionado a `gtid_executed` na replica, mesmo quando o registro binário ou o registro de atualização da replica estão desativados na replica, ou quando a transação é uma operação sem efeito ou é filtrada na replica.

É possível que um cliente simule uma transação replicada ao definir `@@SESSION.gtid_next` para um GTID específico antes de executar a transação. Essa técnica é usada pelo **mysqlbinlog** para gerar um backup do log binário que o cliente pode reproduzir para preservar os GTIDs. Uma transação replicada simulada, confirmada por um cliente, é completamente equivalente a uma transação replicada confirmada por um thread do aplicativo de replicação, e não podem ser distinguidas após o fato.

##### A variável de sistema `gtid_purged`

O conjunto de GTIDs na variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) contém os GTIDs de todas as transações que foram confirmadas no servidor, mas que não existem em nenhum arquivo de log binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

* GTIDs de transações replicadas que foram confirmadas com o registro binário desativado na replica.

* GTIDs de transações que foram escritas em um arquivo de log binário que agora foi purgado.

* GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

Você pode alterar o valor de `gtid_purged` para registrar no servidor que as transações de um determinado conjunto de GTIDs foram aplicadas, embora não existam em nenhum log binário no servidor. Ao adicionar GTIDs ao `gtid_purged`, eles também são adicionados ao `gtid_executed`. Um exemplo de uso para essa ação é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os logs binários relevantes contendo as transações no servidor. Você também pode escolher se deseja substituir todo o conjunto de GTIDs em `gtid_purged` por um conjunto de GTIDs especificado ou se deseja adicionar um conjunto de GTIDs especificado aos GTIDs já em `gtid_purged`. Para obter detalhes sobre como fazer isso, consulte a descrição de `gtid_purged`.

Os conjuntos de GTIDs nas variáveis de sistema `gtid_executed` e `gtid_purged` são inicializados quando o servidor é iniciado. Cada arquivo de log binário começa com o evento `Previous_gtids_log_event`, que contém o conjunto de GTIDs em todos os arquivos de log binário anteriores (composto pelos GTIDs no `Previous_gtids_log_event` do arquivo anterior e pelos GTIDs de cada `Gtid_log_event` no próprio arquivo anterior). O conteúdo de `Previous_gtids_log_event` nos arquivos de log binário mais antigos e mais recentes é usado para calcular os conjuntos `gtid_executed` e `gtid_purged` no momento do início do servidor:

* `gtid_executed` é calculado como a união dos GTIDs em `Previous_gtids_log_event` no arquivo de log binário mais recente, dos GTIDs das transações nesse arquivo de log binário e dos GTIDs armazenados na tabela `mysql.gtid_executed`. Este conjunto de GTIDs contém todos os GTIDs que foram usados (ou adicionados explicitamente a `gtid_purged`) no servidor, independentemente de estarem ou não atualmente em um arquivo de log binário no servidor. Ele não inclui os GTIDs das transações que estão atualmente sendo processadas no servidor (`@@GLOBAL.gtid_owned`).

* `gtid_purged` é calculado adicionando primeiro os GTIDs em `Previous_gtids_log_event` no arquivo de log binário mais recente e os GTIDs das transações nesse arquivo de log binário. Essa etapa fornece o conjunto de GTIDs que estão atualmente, ou estavam, registrados em um log binário no servidor (`gtids_in_binlog`). Em seguida, os GTIDs em `Previous_gtids_log_event` no arquivo de log binário mais antigo são subtraídos de `gtids_in_binlog`. Essa etapa fornece o conjunto de GTIDs que estão atualmente registrados em um log binário no servidor (`gtids_in_binlog_not_purged`). Finalmente, `gtids_in_binlog_not_purged` é subtraído de `gtid_executed`. O resultado é o conjunto de GTIDs que foram usados no servidor, mas não estão atualmente registrados em um arquivo de log binário no servidor, e esse resultado é usado para inicializar `gtid_purged`.

##### Reinicialização do Histórico de Execução de GTIDs

Se você precisar reinicializar o histórico de execução de GTIDs em um servidor, use a instrução `RESET BINARY LOGS AND GTIDS`. Você pode precisar fazer isso após realizar consultas de teste para verificar uma configuração de replicação em novos servidores habilitados para GTIDs, ou quando você deseja unir um novo servidor a um grupo de replicação, mas ele contém algumas transações locais indesejadas que não são aceitas pela Replicação de Grupo.

Aviso

Use `RESET BINARY LOGS E GTIDS` com cautela para evitar perder o histórico de execução de GTID e os arquivos de log binário desejados.

Antes de emitir `RESET BINARY LOGS E GTIDS`, certifique-se de ter backups dos arquivos de log binário do servidor e do arquivo de índice de log binário, se houver, e obtenha e salve o conjunto de GTID mantido no valor global da variável de sistema `gtid_executed` (por exemplo, emitindo uma declaração `SELECT @@GLOBAL.gtid_executed` e salvando os resultados). Se você está removendo transações indesejadas desse conjunto de GTID, use **mysqlbinlog** para examinar o conteúdo das transações para garantir que elas não tenham valor, não contenham dados que devem ser salvos ou replicados e não tenham resultado em alterações de dados no servidor.

Quando você emite `RESET BINARY LOGS E GTIDS`, as seguintes operações de reset são realizadas:

* O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`).

* O valor global (mas não o valor de sessão) da variável de sistema `gtid_executed` é definido como uma string vazia.

* A tabela `mysql.gtid_executed` é limpa (veja a tabela mysql.gtid_executed).

* Se o servidor tiver log binário habilitado, os arquivos de log binário existentes são excluídos e o arquivo de índice de log binário é limpo.

Lembre-se de que `RESET BINARY LOGS E GTIDS` é o método para resetar o histórico de execução de GTID, mesmo que o servidor seja uma replica onde o log binário esteja desativado. `RESET REPLICA` não tem efeito no histórico de execução de GTID.