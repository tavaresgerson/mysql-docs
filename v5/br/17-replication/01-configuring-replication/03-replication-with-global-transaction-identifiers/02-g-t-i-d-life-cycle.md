#### 16.1.3.2 Ciclo de vida do GTID

O ciclo de vida de um GTID consiste nas seguintes etapas:

1. Uma transação é executada e comprometida no servidor de origem da replicação. Essa transação do cliente recebe um GTID composto pelo UUID da origem e pelo menor número de sequência de transação não nulo ainda não utilizado neste servidor. O GTID é escrito no log binário da origem (imediatamente antes da própria transação no log). Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não recebe um GTID.

2. Se um GTID foi atribuído para a transação, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário é rotado ou o servidor é desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo de log binário anterior na tabela `mysql.gtid_executed`.

3. Se um GTID foi atribuído para a transação, o GTID é externalizado não-atômico (muito pouco tempo após a transação ser confirmada) adicionando-o ao conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`). Este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID confirmadas e é usado na replicação como um token que representa o estado do servidor. Com o registro binário habilitado (como exigido para a fonte), o conjunto de GTIDs na variável de sistema `gtid_executed` é um registro completo das transações aplicadas, mas a tabela `mysql.gtid_executed` não é, porque o histórico mais recente ainda está no arquivo de log binário atual.

4. Após os dados do log binário serem transmitidos para a replica e armazenados no log de retransmissão da replica (usando mecanismos estabelecidos para esse processo, consulte Seção 16.2, “Implementação da Replicação” para detalhes), a replica lê o GTID e define o valor da variável de sistema `gtid_next` como esse GTID. Isso indica à replica que a próxima transação deve ser registrada usando esse GTID. É importante notar que a replica define `gtid_next` em um contexto de sessão.

5. A replica verifica se nenhum thread já assumiu a propriedade do GTID em `gtid_next` para processar a transação. Ao ler e verificar o GTID da transação replicada primeiro, antes de processar a própria transação, a replica garante não apenas que nenhuma transação anterior com esse GTID foi aplicada na replica, mas também que nenhuma outra sessão já leu esse GTID, mas ainda não comprometeu a transação associada. Portanto, se vários clientes tentarem aplicar a mesma transação simultaneamente, o servidor resolve isso permitindo que apenas um deles execute. A variável de sistema `gtid_owned` (`@@GLOBAL.gtid_owned`) da replica mostra cada GTID que está atualmente em uso e o ID do thread que o possui. Se o GTID já tiver sido usado, nenhum erro é gerado e a função de desvio automático é usada para ignorar a transação.

6. Se o GTID não tiver sido usado, a replica aplica a transação replicada. Como `gtid_next` está definido para o GTID já atribuído pela fonte, a replica não tenta gerar um novo GTID para essa transação, mas, em vez disso, usa o GTID armazenado em `gtid_next`.

7. Se o registro binário estiver habilitado na replica, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo de log binário anterior na tabela `mysql.gtid_executed`.

8. Se o registro binário estiver desativado na replica, o GTID será persistido de forma atômica, escrevendo-o diretamente na tabela `mysql.gtid_executed`. O MySQL adiciona uma instrução à transação para inserir o GTID na tabela. Nessa situação, a tabela `mysql.gtid_executed` é um registro completo das transações aplicadas na replica. Observe que, no MySQL 5.7, a operação de inserir o GTID na tabela é atômica para instruções DML, mas não para instruções DDL, portanto, se o servidor sair inesperadamente após uma transação que envolva instruções DDL, o estado do GTID pode se tornar inconsistente. A partir do MySQL 8.0, a operação é atômica tanto para instruções DDL quanto para instruções DML.

9. Muito pouco tempo após a transação replicada ser confirmada na replica, o GTID é externalizado não-atômico adicionando-o ao conjunto de GTIDs na variável de sistema `gtid_executed` para a replica. Quanto à fonte, este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID confirmadas. Se o registro binário estiver desativado na replica, a tabela `mysql.gtid_executed` também é um registro completo das transações aplicadas na replica. Se o registro binário estiver ativado na replica, o que significa que alguns GTIDs são registrados apenas no log binário, o conjunto de GTIDs na variável de sistema `gtid_executed` é o único registro completo.

As transações do cliente que são completamente filtradas na fonte não recebem um GTID, portanto, não são adicionadas ao conjunto de transações na variável de sistema `gtid_executed` ou adicionadas à tabela `mysql.gtid_executed`. No entanto, os GTIDs das transações replicadas que são completamente filtradas na replica são preservados. Se o registro binário estiver habilitado na replica, a transação filtrada é escrita no log binário como um `Gtid_log_event` seguido por uma transação vazia contendo apenas as instruções `BEGIN` e `COMMIT`. Se o registro binário estiver desabilitado, o GTID da transação filtrada é escrito na tabela `mysql.gtid_executed`. Preservar os GTIDs para as transações filtradas garante que a tabela `mysql.gtid_executed` e o conjunto de GTIDs na variável de sistema `gtid_executed` possam ser compactados. Isso também garante que as transações filtradas não sejam recuperadas novamente se a replica se reconectar à fonte, conforme explicado na Seção 16.1.3.3, “GTID Auto-Posicionamento”.

Em uma replica multisserial (com `slave_parallel_workers > 0`), as transações podem ser aplicadas em paralelo, portanto, as transações replicadas podem ser confirmadas fora de ordem (a menos que `slave_preserve_commit_order=1` esteja definido). Quando isso acontece, o conjunto de GTIDs na variável de sistema `gtid_executed` contém múltiplos intervalos de GTIDs com lacunas entre eles. (Em uma replica de origem ou de um único thread, há GTIDs que aumentam de forma monótona sem lacunas entre os números.) As lacunas em replicações multisserial ocorrem apenas entre as transações mais recentemente aplicadas e são preenchidas à medida que a replicação avança. Quando os threads de replicação são interrompidos de forma limpa usando a instrução `STOP SLAVE`, as transações em andamento são aplicadas para preencher as lacunas. No caso de um desligamento, como uma falha no servidor ou o uso da instrução `KILL` para interromper os threads de replicação, as lacunas podem permanecer.

##### Quais mudanças recebem um GTID?

O cenário típico é que o servidor gere um novo GTID para uma transação comprometida. No entanto, GTIDs também podem ser atribuídos a outras alterações além de transações, e, em alguns casos, uma única transação pode receber vários GTIDs.

Cada alteração no banco de dados (DDL ou DML) que é escrita no log binário recebe um GTID. Isso inclui alterações que são automaticamente confirmadas e alterações confirmadas usando as instruções `BEGIN` e `COMMIT` ou `START TRANSACTION`. Um GTID também é atribuído à criação, alteração ou exclusão de um banco de dados e de um objeto não-tabela, como um procedimento, função, gatilho, evento, visualização, usuário, papel ou concessão.

Atualizações não transacionais, assim como as transacionais, recebem GTIDs. Além disso, para uma atualização não transacional, se ocorrer uma falha de escrita em disco ao tentar gravar no cache do log binário e, portanto, for criado um intervalo no log binário, o evento de registro de incidente resultante recebe um GTID.

Quando uma tabela é automaticamente removida por uma instrução gerada no log binário, um GTID é atribuído à instrução. As tabelas temporárias são removidas automaticamente quando uma réplica começa a aplicar eventos de uma fonte que acabou de ser iniciada, e quando a replicação baseada em instruções está em uso (`binlog_format=STATEMENT`) e uma sessão do usuário que tem tabelas temporárias abertas se desconecta. As tabelas que usam o mecanismo de armazenamento `[MEMORY]` são excluídas automaticamente na primeira vez que são acessadas após o servidor ser iniciado, porque as linhas podem ter sido perdidas durante o desligamento.

Quando uma transação não é escrita no log binário no servidor de origem, o servidor não atribui um GTID a ela. Isso inclui transações que são revertidas e transações que são executadas enquanto o registro binário está desativado no servidor de origem, seja globalmente (com `--skip-log-bin` especificado na configuração do servidor) ou para a sessão (`SET @@SESSION.sql_log_bin = 0`). Isso também inclui transações sem efeito quando a replicação baseada em linhas está em uso (`binlog_format=ROW`).

As transações XA recebem GTIDs separados para a fase `XA PREPARE` da transação e para a fase `XA COMMIT` ou `XA ROLLBACK` da transação. As transações XA são preparadas de forma persistente para que os usuários possam comprometer ou reverter elas em caso de falha (o que, em uma topologia de replicação, pode incluir uma transição para outro servidor). As duas partes da transação são, portanto, replicadas separadamente, portanto, devem ter seus próprios GTIDs, mesmo que uma transação que não é XA e que é revertida não tenha um GTID.

Nos seguintes casos especiais, uma única declaração pode gerar múltiplas transações e, portanto, ser atribuída a múltiplos GTIDs:

- É invocada uma procedura armazenada que executa múltiplas transações. Um GTID é gerado para cada transação que a procedura executa.

- Uma instrução `DROP TABLE` de várias tabelas (drop-table.html) exclui tabelas de diferentes tipos.

- Uma declaração `CREATE TABLE ... SELECT` é emitida quando a replicação baseada em linhas está em uso (`binlog_format=ROW`). Um GTID é gerado para a ação `CREATE TABLE` e um GTID é gerado para as ações de inserção de linhas.

##### A variável de sistema `gtid_next`

Por padrão, para novas transações realizadas em sessões de usuário, o servidor gera e atribui automaticamente um novo GTID. Quando a transação é aplicada em uma replica, o GTID do servidor de origem é preservado. Você pode alterar esse comportamento configurando o valor da sessão da variável de sistema `gtid_next`:

- Quando [`gtid_next`](https://pt.wikipedia.org/wiki/Replicação_de_transações#sysvar_gtid_next) está definido como `AUTOMATIC`, que é o padrão, e uma transação é confirmada e escrita no log binário, o servidor gera e atribui automaticamente um novo GTID. Se uma transação for revertida ou não escrita no log binário por outro motivo, o servidor não gera e atribui um GTID.

- Se você definir `gtid_next` para um GTID válido (composto por um UUID e um número de sequência de transação, separados por um colon), o servidor atribui esse GTID à sua transação. Esse GTID é atribuído e adicionado a `gtid_executed` mesmo quando a transação não é escrita no log binário ou quando a transação está vazia.

Observe que, após definir o `gtid_next` para um GTID específico, e a transação ter sido confirmada ou revertida, uma declaração explícita `SET @@SESSION.gtid_next` deve ser emitida antes de qualquer outra declaração. Você pode usar isso para definir o valor do GTID de volta para `AUTOMATIC` se você não quiser atribuir mais GTIDs explicitamente.

Quando os threads do aplicativo de replicação aplicam transações replicadas, eles usam essa técnica, definindo explicitamente `@@SESSION.gtid_next` para o GTID da transação replicada, conforme atribuído no servidor de origem. Isso significa que o GTID do servidor de origem é mantido, em vez de um novo GTID ser gerado e atribuído pela replica. Isso também significa que o GTID é adicionado a `gtid_executed` na replica, mesmo quando o registro binário ou o registro de atualização da replica estão desativados na replica, ou quando a transação é uma operação sem efeito ou é filtrada na replica.

É possível que um cliente simule uma transação replicada ao definir `@@SESSION.gtid_next` para um GTID específico antes de executar a transação. Essa técnica é usada pelo **mysqlbinlog** para gerar um dump do log binário que o cliente pode reproduzir para preservar os GTIDs. Uma transação replicada simulada comprometida por um cliente é completamente equivalente a uma transação replicada comprometida por um thread do aplicador de replicação, e não podem ser distinguidas após o fato.

##### A variável de sistema `gtid_purged`

O conjunto de GTIDs na variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) contém os GTIDs de todas as transações que foram comprometidas no servidor, mas não existem em nenhum arquivo de log binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

- GTIDs de transações replicadas que foram comprometidas com o registro binário desativado na replica.

- GTIDs das transações que foram escritas em um arquivo de log binário que agora foi apagado.

- GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

Você pode alterar o valor de `gtid_purged` para registrar no servidor que as transações de um determinado conjunto de GTID foram aplicadas, embora não existam em nenhum log binário no servidor. Quando você adiciona GTIDs a `gtid_purged`, eles também são adicionados a `gtid_executed`. Um exemplo de uso para essa ação é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os logs binários relevantes contendo as transações no servidor. No MySQL 5.7, você só pode alterar o valor de `gtid_purged` quando `gtid_executed` (e, portanto, `gtid_purged`) está vazio. Para obter detalhes sobre como fazer isso, consulte a descrição de `gtid_purged`.

Os conjuntos de GTIDs nas variáveis de sistema `gtid_executed` e `gtid_purged` são inicializados quando o servidor é iniciado. Cada arquivo de log binário começa com o evento `Previous_gtids_log_event`, que contém o conjunto de GTIDs em todos os arquivos de log binário anteriores (composto pelos GTIDs no `Previous_gtids_log_event` do arquivo anterior e pelos GTIDs de cada `Gtid_log_event` no próprio arquivo anterior). O conteúdo do `Previous_gtids_log_event` nos arquivos de log binário mais antigos e mais recentes é usado para calcular os conjuntos `gtid_executed` e `gtid_purged` ao iniciar o servidor:

- `gtid_executed` é calculado como a união dos GTIDs em `Previous_gtids_log_event` no arquivo de log binário mais recente, os GTIDs das transações nesse arquivo de log binário e os GTIDs armazenados na tabela `mysql.gtid_executed`. Este conjunto de GTIDs contém todos os GTIDs que foram usados (ou adicionados explicitamente a `gtid_purged` no servidor, independentemente de estarem ou não atualmente em um arquivo de log binário no servidor. Ele não inclui os GTIDs para transações que estão atualmente sendo processadas no servidor (`@@GLOBAL.gtid_owned`).

- `gtid_purged` é calculado somando primeiro os GTIDs nos `Previous_gtids_log_event` no arquivo de log binário mais recente e os GTIDs das transações nesse arquivo de log binário. Essa etapa fornece o conjunto de GTIDs que estão atualmente, ou que já estiveram, registrados em um log binário no servidor (`gtids_in_binlog`). Em seguida, os GTIDs nos `Previous_gtids_log_event` no arquivo de log binário mais antigo são subtraídos de `gtids_in_binlog`. Essa etapa fornece o conjunto de GTIDs que estão atualmente registrados em um log binário no servidor (`gtids_in_binlog_not_purged`). Finalmente, `gtids_in_binlog_not_purged` é subtraído de `gtid_executed`. O resultado é o conjunto de GTIDs que foram usados no servidor, mas que atualmente não estão registrados em um arquivo de log binário no servidor, e esse resultado é usado para inicializar `gtid_purged`.

Se os logs binários do MySQL 5.7.7 ou versões anteriores estiverem envolvidos nesses cálculos, é possível que conjuntos de GTID incorretos sejam calculados para `gtid_executed` e `gtid_purged`, e eles permaneçam incorretos mesmo se o servidor for reiniciado posteriormente. Para obter detalhes, consulte a descrição da variável de sistema `binlog_gtid_simple_recovery`, que controla como os logs binários são iterados para calcular os conjuntos de GTID. Se uma das situações descritas lá se aplicar a um servidor, defina `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de iniciá-lo. Essa configuração faz com que o servidor itere todos os arquivos de log binário (não apenas os mais novos e mais antigos) para encontrar onde os eventos de GTID começam a aparecer. Esse processo pode levar muito tempo se o servidor tiver um grande número de arquivos de log binário sem eventos de GTID.

##### Reinicializar o histórico de execução do GTID

Se você precisar reiniciar o histórico de execução do GTID em um servidor, use a instrução `RESET MASTER`. Por exemplo, você pode precisar fazer isso após realizar consultas de teste para verificar uma configuração de replicação em novos servidores habilitados para GTID, ou quando você deseja adicionar um novo servidor a um grupo de replicação, mas ele contém algumas transações locais indesejadas que não são aceitas pela Replicação de Grupo.

Aviso

Use `RESET MASTER` com cautela para evitar perder o histórico de execução do GTID e os arquivos de log binário desejados.

Antes de emitir `RESET MASTER`, certifique-se de ter backups dos arquivos de log binário do servidor e do arquivo de índice de log binário, se houver, e obtenha e salve o GTID definido na variável de sistema global `[gtid_executed]` (por exemplo, emitindo uma instrução `SELECT @@GLOBAL.gtid_executed` e salvando os resultados). Se você está removendo transações indesejadas desse conjunto de GTID, use **mysqlbinlog** para examinar o conteúdo das transações para garantir que elas não tenham valor, não contenham dados que devam ser salvos ou replicados e não tenham resultado em alterações de dados no servidor.

Quando você emite `RESET MASTER`, as seguintes operações de reinicialização são realizadas:

- O valor da variável de sistema `gtid_purged` está definido como uma string vazia (`''`).

- O valor global (mas não o valor da sessão) da variável de sistema `gtid_executed` está definido como uma string vazia.

- A tabela `mysql.gtid_executed` é limpa (consulte tabela mysql.gtid_executed).

- Se o servidor tiver o registro binário habilitado, os arquivos de registro binário existentes serão excluídos e o arquivo de índice do registro binário será limpo.

Observe que `RESET MASTER` é o método para redefinir o histórico de execução do GTID, mesmo que o servidor seja uma replica onde o registro binário esteja desativado. `RESET SLAVE` não tem efeito no histórico de execução do GTID.
