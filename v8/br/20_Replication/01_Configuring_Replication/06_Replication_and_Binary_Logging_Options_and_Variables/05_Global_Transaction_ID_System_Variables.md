#### 19.1.6.5 Variáveis do Sistema de ID de Transação Global

As variáveis de sistema do MySQL Server descritas nesta seção são usadas para monitorar e controlar Identificadores de Transações Globais (GTIDs). Para obter informações adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”.

- `binlog_gtid_simple_recovery`

  <table summary="Propriedades para binlog_gtid_simple_recovery"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-gtid-simple-recovery[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>binlog_gtid_simple_recovery</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Essa variável controla a forma como os arquivos de log binários são iterados durante a busca por GTIDs quando o MySQL é iniciado ou reiniciado.

  Quando `binlog_gtid_simple_recovery=TRUE`, que é o padrão no MySQL 8.0, os valores de `gtid_executed` e `gtid_purged` são calculados no início, com base nos valores de `Previous_gtids_log_event` nos arquivos de log binários mais recentes e mais antigos. Para uma descrição da computação, consulte a variável de sistema `gtid_purged`. Esta configuração acessa apenas dois arquivos de log binários durante o reinício do servidor. Se todos os logs binários no servidor forem gerados usando o MySQL 5.7.8 ou versões posteriores, `binlog_gtid_simple_recovery=TRUE` pode ser usado com segurança sempre.

  Se houver registros binários do MySQL 5.7.7 ou versões anteriores no servidor (por exemplo, após uma atualização de um servidor mais antigo para o MySQL 8.0), os valores `binlog_gtid_simple_recovery=TRUE`, `gtid_executed` e `gtid_purged` podem ser inicializados incorretamente nas seguintes duas situações:

  - O log binário mais recente foi gerado pelo MySQL 5.7.5 ou versões anteriores, e `gtid_mode` foi `ON` para alguns logs binários, mas `OFF` para o log binário mais recente.

  - Foi emitida uma declaração `SET @@GLOBAL.gtid_purged` sobre o MySQL 5.7.7 ou versões anteriores, e o log binário que estava ativo no momento da declaração `SET @@GLOBAL.gtid_purged` ainda não foi apagado.

  Se um conjunto de GTID incorreto for calculado em qualquer uma dessas situações, ele permanecerá incorreto mesmo se o servidor for reiniciado posteriormente com `binlog_gtid_simple_recovery=FALSE`. Se uma dessas situações se aplicar ou possa se aplicar no servidor, defina `binlog_gtid_simple_recovery=FALSE` antes de iniciar ou reiniciar o servidor.

  Quando `binlog_gtid_simple_recovery=FALSE` está definido, o método de cálculo de `gtid_executed` e `gtid_purged` conforme descrito no sistema de variáveis `gtid_purged` é alterado para iterar pelos arquivos de log binário da seguinte forma:

  - Em vez de usar o valor de `Previous_gtids_log_event` e os eventos de log GTID do arquivo de log binário mais recente, a computação para `gtid_executed` itera a partir do arquivo de log binário mais recente e usa o valor de `Previous_gtids_log_event` e quaisquer eventos de log GTID do primeiro arquivo de log binário onde encontrar um valor de `Previous_gtids_log_event`. Se os arquivos de log binário mais recentes do servidor não tiverem eventos de log GTID, por exemplo, se `gtid_mode=ON` foi usado, mas o servidor foi alterado para `gtid_mode=OFF` mais tarde, esse processo pode levar muito tempo.

  - Em vez de usar o valor de `Previous_gtids_log_event` do arquivo de log binário mais antigo, o cálculo para `gtid_purged` itera a partir do arquivo de log binário mais antigo e usa o valor de `Previous_gtids_log_event` do primeiro arquivo de log binário onde encontra um valor não vazio de `Previous_gtids_log_event` ou pelo menos um evento de log GTID (indicando que o uso de GTIDs começa nesse ponto). Se os arquivos de log binário mais antigos do servidor não tiverem eventos de log GTID, por exemplo, se `gtid_mode=ON` foi definido recentemente no servidor, esse processo pode levar muito tempo.

- `enforce_gtid_consistency`

  <table summary="Propriedades para enforce_gtid_consistency"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enforce-gtid-consistency[=valu<code>enforce_gtid_consistency</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>enforce_gtid_consistency</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>WARN</code>]]</p></td> </tr></tbody></table>

  Dependendo do valor dessa variável, o servidor garante a consistência do GTID, permitindo a execução apenas de instruções que podem ser registradas com segurança usando um GTID. Você *deve* definir essa variável para `ON` antes de habilitar a replicação baseada em GTID.

  Os valores que o `enforce_gtid_consistency` pode ser configurado para são:

  - `OFF`: todas as transações são permitidas para violar a consistência do GTID.

  - `ON`: nenhuma transação é permitida para violar a consistência do GTID.

  - `WARN`: todas as transações são permitidas para violar a consistência do GTID, mas um aviso é gerado neste caso.

  `--enforce-gtid-consistency` só tem efeito se o registro binário ocorrer para uma declaração. Se o registro binário estiver desativado no servidor ou se as declarações não forem escritas no log binário porque são removidas por um filtro, a consistência do GTID não será verificada ou aplicada para as declarações que não são registradas.

  Apenas declarações que podem ser registradas usando declarações seguras GTID podem ser registradas quando `enforce_gtid_consistency` está definido como `ON`, portanto, as operações listadas aqui não podem ser usadas com esta opção:

  - `CREATE TEMPORARY TABLE` ou `DROP TEMPORARY TABLE` dentro de transações.

  - Transações ou declarações que atualizam tabelas tanto transacionais quanto não transacionais. Há uma exceção: a DML não transacional é permitida na mesma transação ou na mesma declaração que a DML transacional, desde que todas as tabelas *não transacionais* sejam temporárias.

  - `CREATE TABLE ... SELECT` declarações, antes do MySQL 8.0.21. A partir do MySQL 8.0.21, as declarações `CREATE TABLE ... SELECT` são permitidas para os motores de armazenamento que suportam DDL atômico.

  Para obter mais informações, consulte a Seção 19.1.3.7, “Restrições à replicação com GTIDs”.

  Antes do MySQL 5.7 e nas versões iniciais dessa série de lançamentos, o boolean `enforce_gtid_consistency` tinha como padrão `OFF`. Para manter a compatibilidade com esses lançamentos anteriores, a enumeração tem como padrão `OFF`, e definir `--enforce-gtid-consistency` sem um valor é interpretado como definir o valor para `ON`. A variável também tem múltiplos aliases textuais para os valores: `0=OFF=FALSE`, `1=ON=TRUE`, `2=WARN`. Isso difere de outros tipos de enumeração, mas mantém a compatibilidade com o tipo booleano usado em lançamentos anteriores. Essas mudanças impactam no que é retornado pela variável. Usando `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'` e `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, todos retornam a forma textual, não a forma numérica. Essa é uma mudança incompatível, pois `@@ENFORCE_GTID_CONSISTENCY` retorna a forma numérica para booleanos, mas retorna a forma textual para `SHOW` e o Schema de Informações.

- `gtid_executed`

  <table summary="Propriedades para gtid_executed"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_executed</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Quando usado com escopo global, essa variável contém uma representação do conjunto de todas as transações executadas no servidor e dos GTIDs definidos por uma declaração `SET` `gtid_purged`. Isso é o mesmo que o valor da coluna `Executed_Gtid_Set` no resultado de `SHOW MASTER STATUS` e `SHOW REPLICA STATUS`. O valor dessa variável é um conjunto de GTIDs, consulte Conjuntos de GTIDs para mais informações.

  Quando o servidor for iniciado, o `@@GLOBAL.gtid_executed` será inicializado. Consulte `binlog_gtid_simple_recovery` para obter mais informações sobre como os logs binários são iterados para preencher o `gtid_executed`. Os GTIDs são então adicionados ao conjunto à medida que as transações são executadas ou se qualquer declaração `SET` `gtid_purged` for executada.

  O conjunto de transações que podem ser encontradas nos logs binários a qualquer momento é igual a `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`; ou seja, a todas as transações no log binário que ainda não foram eliminadas.

  A emissão de `RESET MASTER` faz com que o valor global (mas não o valor da sessão) desta variável seja redefinido para uma string vazia. Os GTIDs não são removidos deste conjunto, exceto quando o conjunto é limpo devido a `RESET MASTER`.

- `gtid_executed_compression_period`

  <table summary="Propriedades para gtid_executed_compression_period"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--gtid-executed-compression-period=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>gtid_executed_compression_period</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.23)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.22)</th> <td>[[<code>1000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Compreenda a tabela `mysql.gtid_executed` a cada número especificado de transações processadas. Quando o registro binário está habilitado no servidor, esse método de compressão não é usado, e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do log binário. Quando o registro binário está desabilitado no servidor, o thread de compressão dorme até que o número especificado de transações seja executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Definir o valor dessa variável de sistema para 0 significa que o thread nunca acorda, então esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

  A partir do MySQL 8.0.17, as transações `InnoDB` são escritas na tabela `mysql.gtid_executed` por um processo separado para as transações não `InnoDB`. Se o servidor tiver uma mistura de transações `InnoDB` e transações não `InnoDB`, a compressão controlada por essa variável do sistema interfere no trabalho desse processo e pode desacelerá-lo significativamente. Por essa razão, a partir dessa versão, recomenda-se que você defina `gtid_executed_compression_period` para 0.

  A partir do MySQL 8.0.23, as transações `InnoDB` e não `InnoDB` são escritas na tabela `mysql.gtid_executed` pelo mesmo processo, e o valor padrão `gtid_executed_compression_period` é 0.

  Consulte a tabela Compressão de compressão de tabelas mysql.gtid\_executed para obter mais informações.

- `gtid_mode`

  <table summary="Propriedades para gtid_mode"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--gtid-mode=MODE</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>gtid_mode</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>OFF_PERMISSIVE</code>]]</p><p class="valid-value">[[<code>ON_PERMISSIVE</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p></td> </tr></tbody></table>

  Controla se o registro baseado em GTID está habilitado e que tipo de transações os registros podem conter. Você deve ter privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. `enforce_gtid_consistency` deve ser definido como `ON` antes que você possa definir `gtid_mode=ON`. Antes de modificar essa variável, consulte a Seção 19.1.4, “Mudando o Modo GTID em Servidores Online”.

  As transações registradas podem ser anônimas ou usar GTIDs. As transações anônimas dependem de arquivos de registro binário e da posição para identificar transações específicas. As transações GTID têm um identificador único que é usado para referenciar transações. Os diferentes modos são:

  - `OFF`: As transações novas e replicadas devem ser anônimas.

  - `OFF_PERMISSIVE`: Novas transações são anônimas. Transações replicadas podem ser anônimas ou transações GTID.

  - `ON_PERMISSIVE`: Novas transações são transações GTID. Transações replicadas podem ser anônimas ou transações GTID.

  - `ON`: As transações novas e replicadas devem ser transações GTID.

  As mudanças de um valor para outro só podem ser feitas de forma gradual. Por exemplo, se `gtid_mode` está atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`.

  Os valores de `gtid_purged` e `gtid_executed` são persistentes, independentemente do valor de `gtid_mode`. Portanto, mesmo após a alteração do valor de `gtid_mode`, essas variáveis contêm os valores corretos.

- `gtid_next`

  <table summary="Propriedades para gtid_next"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_next</code>]]</td> </tr><tr><th>Âmbito</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTOMATIC</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTOMATIC</code>]]</p><p class="valid-value">[[<code>ANONYMOUS</code>]]</p><p class="valid-value">[[<code>&lt;UUID&gt;:&lt;NUMBER&gt;</code>]]</p></td> </tr></tbody></table>

  Esta variável é usada para especificar se e como o próximo GTID é obtido.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”).

  `gtid_next` pode assumir qualquer um dos seguintes valores:

  - `AUTOMATIC`: Use o próximo ID de transação global gerado automaticamente.

  - `ANONYMOUS`: As transações não possuem identificadores globais e são identificadas apenas pelo arquivo e pela posição.

  - Um ID de transação global no formato `UUID`:`NUMBER`.

  A validade de uma das opções acima depende da configuração de `gtid_mode`, veja a Seção 19.1.4.1, “Conceitos de Modo de Replicação” para mais informações. A configuração desta variável não tem efeito se `gtid_mode` for `OFF`.

  Depois que essa variável tiver sido definida para `UUID`:`NUMBER`, e uma transação tiver sido confirmada ou revertida, uma declaração explícita de `SET GTID_NEXT` deve ser emitida novamente antes de qualquer outra declaração.

  `DROP TABLE` ou `DROP TEMPORARY TABLE` falha com um erro explícito quando usado em uma combinação de tabelas não temporárias com tabelas temporárias, ou de tabelas temporárias usando motores de armazenamento transacionais com tabelas temporárias usando motores de armazenamento não transacionais.

- `gtid_owned`

  <table summary="Propriedades para gtid_owned"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_owned</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Essa variável somente de leitura é utilizada principalmente para uso interno. Seu conteúdo depende de seu escopo.

  - Quando usado com escopo global, `gtid_owned` contém uma lista de todos os GTIDs que estão atualmente em uso no servidor, com os IDs dos threads que os possuem. Esta variável é principalmente útil para uma replica multi-thread para verificar se uma transação já está sendo aplicada em outro thread. Um thread aplicante assume a propriedade de um GTID de uma transação o tempo todo que está processando a transação, então `@@global.gtid_owned` mostra o GTID e o proprietário durante a duração do processamento. Quando uma transação é comprometida (ou revertida), o thread aplicante libera a propriedade do GTID.

  - Quando usado com escopo de sessão, `gtid_owned` contém um único GTID que está atualmente em uso e pertence a esta sessão. Esta variável é principalmente útil para testar e depurar o uso de GTIDs quando o cliente atribuiu explicitamente um GTID para a transação, definindo `gtid_next`. Neste caso, `@@session.gtid_owned` exibe o GTID o tempo todo que o cliente está processando a transação, até que a transação seja confirmada (ou revertida). Quando o cliente tiver terminado de processar a transação, a variável é zerada. Se `gtid_next=AUTOMATIC` for usado para a sessão, `gtid_owned` é preenchido apenas brevemente durante a execução da declaração de confirmação da transação, portanto, não pode ser observado a partir da sessão em questão, embora seja listado se `@@global.gtid_owned` for lido no ponto certo. Se você tiver a necessidade de rastrear os GTIDs que são manipulados por um cliente em uma sessão, você pode habilitar o rastreador de estado de sessão controlado pela variável de sistema `session_track_gtids`.

- `gtid_purged`

  <table summary="Propriedades para gtid_purged"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_purged</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  O valor global da variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) é um conjunto de GTIDs que consiste nos GTIDs de todas as transações que foram comprometidas no servidor, mas não existem em nenhum arquivo de log binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

  - GTIDs de transações replicadas que foram comprometidas com o registro binário desativado na replica.

  - GTIDs das transações que foram escritas em um arquivo de log binário que agora foi apagado.

  - GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

  Quando o servidor for iniciado, o valor global de `gtid_purged` será inicializado com um conjunto de GTIDs. Para obter informações sobre como esse conjunto de GTIDs é calculado, consulte a variável de sistema `gtid_purged`. Se houver logs binários do MySQL 5.7.7 ou versões anteriores no servidor, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor para obter a computação correta. Consulte a descrição de `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária.

  A emissão de `RESET MASTER` faz com que o valor de `gtid_purged` seja redefinido para uma string vazia.

  Você pode definir o valor de `gtid_purged` para registrar no servidor que as transações de um determinado conjunto de GTID foram aplicadas, embora não existam em nenhum log binário no servidor. Um caso de uso para essa ação é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os logs binários relevantes contendo as transações no servidor.

  Importante

  O número máximo de GTIDs disponíveis em uma instância de servidor é igual ao número de valores não negativos para um inteiro de 64 bits assinado (263 - 1). Se você definir o valor de `gtid_purged` para um número que se aproxime desse limite, os commits subsequentes podem fazer com que o servidor se esgote de GTIDs e, assim, tome a ação especificada por `binlog_error_action`. A partir do MySQL 8.0.23, uma mensagem de aviso é emitida quando o servidor se aproxima desse limite.

  Existem duas maneiras de definir o valor de `gtid_purged`. Você pode substituir o valor de `gtid_purged` por um conjunto de GTID especificado ou pode anexar um conjunto de GTID especificado ao conjunto de GTID já mantido por `gtid_purged`.

  Se o servidor não tiver GTIDs existentes, como no caso de um servidor vazio que você está provisionando com um backup de um banco de dados existente, ambos os métodos têm o mesmo resultado. Se você estiver restaurando um backup que sobrepõe as transações que já estão no servidor, por exemplo, substituindo uma tabela corrompida por um dump parcial da fonte feito usando **mysqldump** (que inclui os GTIDs de todas as transações no servidor, mesmo que o dump seja parcial), use o primeiro método para substituir o valor de `gtid_purged`. Se você estiver restaurando um backup que é disjuntado das transações que já estão no servidor, por exemplo, provisionando uma replica de múltiplas fontes usando dumps de dois servidores diferentes, use o segundo método para adicionar ao valor de `gtid_purged`.

  - Para substituir o valor de `gtid_purged` pelo conjunto de GTID especificado, use a seguinte instrução:

    ```
    SET @@GLOBAL.gtid_purged = 'gtid_set';
    ```

    A replicação em grupo deve ser interrompida antes de alterar o valor de `gtid_purged`.

    `gtid_set` deve ser um superconjunto do valor atual de `gtid_purged`, e não deve se sobrepor a `gtid_subtract(gtid_executed,gtid_purged)`. Em outras palavras, o novo conjunto de GTID **deve** incluir quaisquer GTIDs que já estivessem em `gtid_purged`, e **não deve** incluir quaisquer GTIDs em `gtid_executed` que ainda não tenham sido eliminados. `gtid_set` também não pode incluir quaisquer GTIDs que estejam em `@@global.gtid_owned`, ou seja, os GTIDs para transações que estão atualmente sendo processadas no servidor.

    O resultado é que o valor global de `gtid_purged` é definido como igual a `gtid_set`, e o valor de `gtid_executed` torna-se a união de `gtid_set` e o valor anterior de `gtid_executed`.

  - Para adicionar o conjunto de GTID especificado a `gtid_purged`, use a seguinte declaração com um sinal de mais (+) antes do conjunto de GTID:

    ```
    SET @@GLOBAL.gtid_purged = '+gtid_set';
    ```

    `gtid_set` **não deve** se sobrepor ao valor atual de `gtid_executed`. Em outras palavras, o novo conjunto de GTID não deve incluir nenhum GTID em `gtid_executed`, incluindo transações que já estão também em `gtid_purged`. `gtid_set` também não pode incluir nenhum GTID que esteja em `@@global.gtid_owned`, ou seja, os GTID para transações que estão atualmente sendo processadas no servidor.

    O resultado é que `gtid_set` é adicionado tanto a `gtid_executed` quanto a `gtid_purged`.

Nota

Se houver registros binários do MySQL 5.7.7 ou versões anteriores no servidor (por exemplo, após uma atualização de um servidor mais antigo para o MySQL 8.0), após emitir uma declaração `SET @@GLOBAL.gtid_purged`, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de reiniciar o servidor; caso contrário, `gtid_purged` pode ser calculado incorretamente. Consulte a descrição para `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária.
