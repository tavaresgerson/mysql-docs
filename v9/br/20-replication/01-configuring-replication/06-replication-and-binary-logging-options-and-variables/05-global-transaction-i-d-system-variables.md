#### 19.1.6.5 Variáveis do Sistema de Identificador de Transação Global

As variáveis de sistema do Servidor MySQL descritas nesta seção são usadas para monitorar e controlar Identificadores de Transação Global (GTIDs). Para obter informações adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores de Transação Global”.

* `binlog_gtid_simple_recovery`

  <table frame="box" rules="all" summary="Propriedades para binlog_gtid_simple_recovery"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--binlog-gtid-simple-recovery[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery">binlog_gtid_simple_recovery</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Hinta de Definição de Variável</th> <td>Não Aplica</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  Esta variável controla como os arquivos de log binário são iterados durante a busca por GTIDs quando o MySQL começa ou reinicia.

Quando `binlog_gtid_simple_recovery=TRUE` (o padrão), os valores de `gtid_executed` e `gtid_purged` são calculados ao inicializar com base nos valores de `Previous_gtids_log_event` nos arquivos de log binário mais recentes e mais antigos. Para uma descrição da computação, consulte A variável de sistema `gtid_purged`. Esta configuração acessa apenas dois arquivos de log binário durante o reinício do servidor. Se todos os logs binários no servidor foram gerados usando o MySQL 5.7.8 ou versões posteriores, `binlog_gtid_simple_recovery=TRUE` pode ser usado com segurança sempre.

Quando `binlog_gtid_simple_recovery=FALSE` é definido, o método de cálculo de `gtid_executed` e `gtid_purged` conforme descrito na variável de sistema `gtid_purged` é alterado para iterar pelos arquivos de log binário da seguinte forma:

+ Em vez de usar o valor de `Previous_gtids_log_event` e eventos de log GTID do arquivo de log binário mais recente, a computação para `gtid_executed` itera a partir do arquivo de log binário mais recente e usa o valor de `Previous_gtids_log_event` e quaisquer eventos de log GTID do primeiro arquivo de log binário onde ele encontrar um valor de `Previous_gtids_log_event`. Se os arquivos de log binário mais recentes do servidor não tiverem eventos de log GTID, por exemplo, se `gtid_mode=ON` foi usado, mas o servidor foi alterado para `gtid_mode=OFF` mais tarde, este processo pode levar muito tempo.

+ Em vez de usar o valor de `Previous_gtids_log_event` do arquivo de log binário mais antigo, o cálculo para `gtid_purged` itera a partir do arquivo de log binário mais antigo e usa o valor de `Previous_gtids_log_event` do primeiro arquivo de log binário onde ele encontrar um valor não vazio de `Previous_gtids_log_event` ou pelo menos um evento de log GTID (indicando que o uso de GTIDs começa nesse ponto). Se os arquivos de log binário mais antigos do servidor não tiverem eventos de log GTID, por exemplo, se `gtid_mode=ON` foi definido recentemente no servidor, esse processo pode levar muito tempo.

* `enforce_gtid_consistency`

  <table frame="box" rules="all" summary="Propriedades para enforce_gtid_consistency">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--enforce-gtid-consistency[=value]</code></td> </tr>
    <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_enforce_gtid_consistency">enforce_gtid_consistency</a></code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmico</th> <td>Sim</td> </tr>
    <tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code class="literal">SET_VAR</a></code> Hint Aplica</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>Enumeração</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr>
    <tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">WARN</code></p></td> </tr>
  </table>

Dependendo do valor dessa variável, o servidor garante a consistência do GTID permitindo a execução apenas de instruções que podem ser registradas com segurança usando um GTID. Você *deve* definir essa variável para `ON` antes de habilitar a replicação baseada em GTID.

Os valores que `enforce_gtid_consistency` pode ser configurado são:

+ `OFF`: todas as transações são permitidas para violar a consistência do GTID.

+ `ON`: nenhuma transação é permitida para violar a consistência do GTID.

+ `WARN`: todas as transações são permitidas para violar a consistência do GTID, mas um aviso é gerado nesse caso.

`--enforce-gtid-consistency` só tem efeito se o registro binário estiver ocorrendo para uma instrução. Se o registro binário estiver desativado no servidor ou se as instruções não forem escritas no log binário porque são removidas por um filtro, a consistência do GTID não é verificada ou aplicada para as instruções que não são registradas.

Somente instruções que podem ser registradas usando instruções GTID seguras podem ser registradas quando `enforce_gtid_consistency` está definido para `ON`, então as operações listadas aqui não podem ser usadas com essa opção:

+ Instruções `CREATE TEMPORARY TABLE` ou `DROP TEMPORARY TABLE` dentro de transações.

+ Transações ou instruções que atualizam tabelas tanto transacionais quanto não transacionais. Há uma exceção de que o DML não transacional é permitido na mesma transação ou na mesma instrução que o DDL transacional, se todas as tabelas *não transacionais* forem temporárias.

+ As instruções `CREATE TABLE ... SELECT` são suportadas para motores de armazenamento que suportam DDL atômico.

Para mais informações, consulte a Seção 19.1.3.7, “Restrições na replicação com GTIDs”.

Antes do MySQL 5.7 e em versões iniciais dessa série de lançamentos, o booleano `enforce_gtid_consistency` tinha o valor padrão `OFF`. Para manter a compatibilidade com esses lançamentos anteriores, a enumeração tem o valor padrão `OFF`, e definir `--enforce-gtid-consistency` sem um valor é interpretado como definir o valor para `ON`. A variável também tem múltiplos aliases textuais para os valores: `0=OFF=FALSE`, `1=ON=TRUE`,`2=WARN`. Isso difere de outros tipos de enumeração, mas mantém a compatibilidade com o tipo booleano usado em lançamentos anteriores. Essas mudanças impactam no que é retornado pela variável. Usando `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'` e `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, todos retornam a forma textual, não a forma numérica. Essa é uma mudança incompatível, pois `@@ENFORCE_GTID_CONSISTENCY` retorna a forma numérica para booleanos, mas retorna a forma textual para `SHOW` e o Schema de Informações.

* `gtid_executed`

  <table frame="box" rules="all" summary="Propriedades para gtid_executed"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_gtid_executed">gtid_executed</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sinal de Hint para Definição de Variável"><code class="literal">SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

Quando usado com escopo global, essa variável contém uma representação do conjunto de todas as transações executadas no servidor e GTIDs que foram definidos por uma declaração `SET` `gtid_purged`. Isso é o mesmo que o valor da coluna `Executed_Gtid_Set` na saída de `SHOW BINARY LOG STATUS` e `SHOW REPLICA STATUS`. O valor dessa variável é um conjunto de GTIDs, veja Conjuntos de GTIDs para mais informações.

Quando o servidor é iniciado, `@@GLOBAL.gtid_executed` é inicializado. Veja `binlog_gtid_simple_recovery` para mais informações sobre como os logs binários são iterados para preencher `gtid_executed`. Os GTIDs são então adicionados ao conjunto à medida que as transações são executadas ou se qualquer declaração `SET` `gtid_purged` for executada.

O conjunto de transações que podem ser encontradas nos logs binários em qualquer momento é igual a `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`; ou seja, a todas as transações no log binário que ainda não foram purgadas.

Executar `RESET BINARY LOGS AND GTIDS` faz com que essa variável seja redefinida para uma string vazia. Os GTIDs não são removidos desse conjunto, exceto quando o conjunto é limpo devido a `RESET BINARY LOGS AND GTIDS`.

* `gtid_executed_compression_period`

<table frame="box" rules="all" summary="Propriedades para gtid_executed_compression_period">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--gtid-executed-compression-period=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_gtid_executed_compression_period">gtid_executed_compression_period</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>

Compressar a tabela `mysql.gtid_executed` a cada número especificado de transações processadas. Quando o registro de log binário está habilitado no servidor, esse método de compressão não é usado, e sim, a tabela `mysql.gtid_executed` é comprimida em cada rotação do log binário. Quando o registro de log binário está desabilitado no servidor, o thread de compressão dorme até que o número especificado de transações tenha sido executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Definir o valor dessa variável de sistema para 0 significa que o thread nunca acorda, então esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

As transações do tipo `InnoDB` são escritas na tabela `mysql.gtid_executed` por um processo separado para as transações não do tipo `InnoDB`. Se o servidor tiver uma mistura de transações do tipo `InnoDB` e não do tipo `InnoDB`, a compressão controlada por essa variável do sistema interfere no trabalho desse processo e pode desacelerá-lo significativamente. Por essa razão, a partir dessa versão, recomenda-se que você defina `gtid_executed_compression_period` para 0.

Todas as transações (independentemente do mecanismo de armazenamento) são escritas na tabela `mysql.gtid_executed` pelo mesmo processo, e o valor padrão de `gtid_executed_compression_period` é 0.

Consulte Compressão da Tabela `mysql.gtid_executed` para obter mais informações.

* `gtid_mode`

<table frame="box" rules="all" summary="Propriedades para gtid_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--gtid-mode=MODE</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_gtid_mode">gtid_mode</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Definição de Variável Hint"><code class="literal">SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">OFF_PERMISSIVE</code></p><p class="valid-value"><code class="literal">ON_PERMISSIVE</code></p><p class="valid-value"><code class="literal">ON</code></p></td> </tr></tbody></table>

Controla se o registro baseado em GTID está habilitado e qual tipo de transação os logs podem conter. Você deve ter privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. `enforce_gtid_consistency` deve ser definido como `ON` antes que você possa definir `gtid_mode=ON`. Antes de modificar essa variável, veja a Seção 19.1.4, “Mudando o Modo GTID em Servidores Online”.

As transações registradas podem ser anônimas ou usar GTIDs. As transações anônimas dependem do arquivo de log binário e da posição para identificar transações específicas. As transações GTID têm um identificador único que é usado para referenciar transações. Os diferentes modos são:

+ `OFF`: Tanto as transações novas quanto as replicadas devem ser anônimas.

+ `OFF_PERMISSIVE`: As transações novas são anônimas. As transações replicadas podem ser anônimas ou transações GTID.

+ `ON_PERMISSIVE`: As transações novas são transações GTID. As transações replicadas podem ser anônimas ou transações GTID.

+ `ON`: Tanto as transações novas quanto as replicadas devem ser transações GTID.

As mudanças de um valor para outro só podem ser feitas de uma vez. Por exemplo, se `gtid_mode` está atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`.

Os valores de `gtid_purged` e `gtid_executed` são persistentes, independentemente do valor de `gtid_mode`. Portanto, mesmo após alterar o valor de `gtid_mode`, essas variáveis contêm os valores corretos.

* `gtid_next`

<table frame="box" rules="all" summary="Propriedades para gtid_next">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_gtid_next">gtid_next</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Sessão</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">AUTOMATIC</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">AUTOMATIC</code></p><p class="valid-value"><code class="literal">AUTOMATIC:&lt;TAG&gt;</code></p><p class="valid-value"><code class="literal">ANONYMOUS</code></p><p class="valid-value"><code class="literal">&lt;UUID&gt;:&lt;NUMBER&gt;</code></p><p class="valid-value"><code class="literal">&lt;UUID&gt;:&lt;TAG&gt;:&lt;NUMBER&gt;</code></p></td>
  </tr>
</table>

  Esta variável é usada para especificar se e como obter o próximo GTID (ver Seção 19.1.3, “Replicação com Identificadores Globais de Transação”).

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (ver Seção 19.3.3, “Verificações de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (ver Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”).

  `gtid_next` pode assumir qualquer um dos seguintes valores:

  + `AUTOMATIC`: Usar o próximo ID de transação global gerado automaticamente.

+ `AUTOMATIC:TAG`: Use o próximo ID de transação global gerado automaticamente, com a adição de uma tag especificada pelo usuário, no formato `UUID:*`TAG*`:NUMBER`.

A tag deve corresponder à expressão regular `[a-z_][a-z0-9_]{0,7}`;, ou seja, deve seguir as seguintes regras:

- A tag deve consistir de 1 a 8 caracteres (inclusivos).
- O primeiro caractere pode ser qualquer letra `a` a `z`, ou um underscore (`_`).

- Cada um dos caracteres restantes pode ser qualquer uma das letras `a` a `z`, os dígitos `0` a `9`, ou um underscore (`_`).

Definir `gtid_next` na fonte de replicação para `AUTOMATIC:TAG` ou `UUID:TAG:NUMBER` requer o privilégio `TRANSACTION_GTID_TAG` mais pelo menos um dos privilégios `SYSTEM_VARIABLES_ADMIN`, `SESSION_VARIABLES_ADMIN` ou `REPLICATION_APPLIER`. Para o `REPLICATION_CHECKS_APPLIER`, este privilégio também é necessário para definir `gtid_next` para qualquer um desses valores, além do privilégio `REPLICATION_APPLIER`; esses privilégios são verificados ao iniciar o thread do aplicador de replicação.

+ `ANONYMOUS`: As transações não têm identificadores globais e são identificadas apenas por arquivo e posição.

+ Um ID de transação global em qualquer um dos formatos *`UUID`*:*`NUMBER`* ou *`UUID`*:*`TAG`*:*`NUMBER`.

Exatamente quais das opções listadas são válidas depende da configuração de `gtid_mode`; consulte a Seção 19.1.4.1, “Conceitos de Modo de Replicação” para mais informações. Definir essa variável não tem efeito se `gtid_mode` estiver em `OFF`.

Após essa variável ter sido definida para `UUID:NUMBER` ou `UUID:TAG:NUMBER`, e uma transação ter sido confirmada ou revertida, uma declaração explícita `SET gtid_next` deve ser emitida novamente antes de qualquer outra declaração.

A instrução `DROP TABLE` ou `DROP TEMPORARY TABLE` falha com um erro explícito quando usada em uma combinação de tabelas não temporárias com tabelas temporárias, ou de tabelas temporárias usando motores de armazenamento transacionais com tabelas temporárias usando motores de armazenamento não transacionais.

Para obter mais informações, consulte a variável de sistema gtid_next, bem como a Seção 19.1.4, “Mudando o Modo GTID em Servidores Online”.

* `gtid_owned`

  <table frame="box" rules="all" summary="Propriedades para gtid_owned"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_gtid_owned">gtid_owned</a></code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Definição de Variáveis"><code class="literal">SET_VAR</a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Esta variável somente de leitura é principalmente para uso interno. Seu conteúdo depende de seu alcance.

+ Quando usada com alcance global, `gtid_owned` contém uma lista de todos os GTIDs que estão atualmente em uso no servidor, com os IDs dos threads que os possuem. Esta variável é principalmente útil para uma replica multi-thread verificar se uma transação já está sendo aplicada em outro thread. Um thread aplicante assume a propriedade de um GTID de uma transação o tempo todo que está processando a transação, então `@@global.gtid_owned` mostra o GTID e o proprietário para a duração do processamento. Quando uma transação é comprometida (ou revertida), o thread aplicante libera a propriedade do GTID.

+ Quando usado com escopo de sessão, `gtid_owned` contém um único GTID que está atualmente em uso e pertence a esta sessão. Esta variável é principalmente útil para testar e depurar o uso de GTIDs quando o cliente atribuiu explicitamente um GTID para a transação, definindo `gtid_next`. Neste caso, `@@session.gtid_owned` exibe o GTID o tempo todo que o cliente está processando a transação, até que a transação seja confirmada (ou revertida). Quando o cliente termina de processar a transação, a variável é zerada. Se `gtid_next=AUTOMATIC` for usado para a sessão, `gtid_owned` é preenchido apenas brevemente durante a execução da declaração de confirmação da transação, então não pode ser observado a partir da sessão em questão, embora seja listado se `@@global.gtid_owned` for lido no ponto certo. Se você tiver a necessidade de rastrear os GTIDs que são manipulados por um cliente em uma sessão, você pode habilitar o rastreador de estado da sessão controlado pela variável de sistema `session_track_gtids`.

* `gtid_purged`

  <table frame="box" rules="all" summary="Propriedades para gtid_purged"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="replication-options-gtids.html#sysvar_gtid_purged">gtid_purged</a></code></td> </tr><tr><th> escopo</th> <td>Global</td> </tr><tr><th> Dinâmica</th> <td>Sim</td> </tr><tr><th> <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sinal de sintaxe de definição de variável"><code class="literal">SET_VAR</code></a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th> Tipo</th> <td>String</td> </tr><tr><th> Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

O valor global da variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) é um conjunto de GTIDs que inclui os GTIDs de todas as transações que foram confirmadas no servidor, mas que não existem em nenhum arquivo de log binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

  + GTIDs de transações replicadas que foram confirmadas com o registro binário desativado na replica.

  + GTIDs de transações que foram escritas em um arquivo de log binário que agora foi purgado.

  + GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

  Quando o servidor é iniciado, o valor global de `gtid_purged` é inicializado com um conjunto de GTIDs. Para obter informações sobre como esse conjunto de GTIDs é calculado, consulte A variável de sistema `gtid_purged`.

  Você deve ter o `TRANSACTION_GTID_TAG` para definir `gtid_purged`.

  Executar `RESET BINARY LOGS AND GTIDS` faz com que o valor de `gtid_purged` seja redefinido para uma string vazia.

  Você pode definir o valor de `gtid_purged` para registrar no servidor que as transações em um determinado conjunto de GTIDs foram aplicadas, embora elas não existam em nenhum log binário no servidor. Um caso de uso para essa ação é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não possui os logs binários relevantes que contêm as transações no servidor.

  Importante

O número máximo de GTIDs disponíveis em uma instância de servidor é igual ao número de valores não negativos para um inteiro de 64 bits assinado (263 - 1). Se você definir o valor de `gtid_purged` para um número que se aproxime desse limite, os commits subsequentes podem fazer com que o servidor se esgote de GTIDs e, assim, tome a ação especificada por `binlog_error_action`. Uma mensagem de aviso é emitida quando o servidor se aproxima desse limite.

Existem duas maneiras de definir o valor de `gtid_purged`. Você pode substituir o valor de `gtid_purged` por um conjunto de GTIDs especificado ou pode anexar um conjunto de GTIDs especificado ao conjunto de GTIDs já mantido por `gtid_purged`.

Se o servidor não tiver GTIDs existentes, como no caso de um servidor vazio que você está provisionando com um backup de um banco de dados existente, ambos os métodos têm o mesmo resultado. Se você estiver restaurando um backup que sobrepõe as transações que já estão no servidor, por exemplo, substituindo uma tabela corrompida por um dump parcial da fonte feito usando **mysqldump** (que inclui os GTIDs de todas as transações no servidor, mesmo que o dump seja parcial), use o primeiro método de substituição do valor de `gtid_purged`. Se você estiver restaurando um backup que é disjuntado das transações que já estão no servidor, por exemplo, provisionando uma replica de múltiplas fontes usando dumps de dois servidores diferentes, use o segundo método de adição ao valor de `gtid_purged`.

+ Para substituir o valor de `gtid_purged` por um conjunto de GTIDs especificado, use a seguinte declaração:

    ```
    SET @@GLOBAL.gtid_purged = 'gtid_set';
    ```

    A Replicação em Grupo deve ser parada antes de alterar o valor de `gtid_purged`.

`gtid_set` deve ser um superconjunto do valor atual de `gtid_purged` e não deve se sobrepor a `gtid_subtract(gtid_executed, gtid_purged)`. Em outras palavras, o novo conjunto de GTID **deve** incluir quaisquer GTIDs que já estivessem em `gtid_purged` e **não deve** incluir quaisquer GTIDs em `gtid_executed` que ainda não tenham sido purgadas. `gtid_set` também não pode incluir quaisquer GTIDs que estejam em `@@global.gtid_owned`, ou seja, os GTIDs para transações que estão atualmente sendo processadas no servidor.

O resultado é que o valor global de `gtid_purged` é definido como igual a `gtid_set`, e o valor de `gtid_executed` se torna a união de `gtid_set` e o valor anterior de `gtid_executed`.

+ Para adicionar um conjunto de GTID especificado a `gtid_purged`, use a seguinte declaração com um sinal de mais (+) antes do conjunto de GTID:

```
    SET @@GLOBAL.gtid_purged = '+gtid_set';
    ```

`gtid_set` **não deve** se sobrepor ao valor atual de `gtid_executed`. Em outras palavras, o novo conjunto de GTID **não deve** incluir quaisquer GTIDs em `gtid_executed`, incluindo transações que já estejam também em `gtid_purged`. `gtid_set` também não pode incluir quaisquer GTIDs que estejam em `@@global.gtid_owned`, ou seja, os GTIDs para transações que estão atualmente sendo processadas no servidor.

O resultado é que `gtid_set` é adicionado tanto a `gtid_executed` quanto a `gtid_purged`.