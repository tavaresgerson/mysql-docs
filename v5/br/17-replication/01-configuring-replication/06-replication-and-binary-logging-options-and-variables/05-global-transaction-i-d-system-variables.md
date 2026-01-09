#### 16.1.6.5 Variáveis do Sistema de ID de Transação Global

As variáveis de sistema do MySQL Server descritas nesta seção são usadas para monitorar e controlar Identificadores de Transações Globais (GTIDs). Para obter informações adicionais, consulte Seção 16.1.3, “Replicação com Identificadores de Transações Globais”.

- [`binlog_gtid_simple_recovery`](https://replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery)

  <table frame="box" rules="all" summary="Propriedades para binlog_gtid_simple_recovery"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-gtid-simple-recovery[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>binlog_gtid_simple_recovery</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Essa variável controla a forma como os arquivos de log binários são iterados durante a busca por GTIDs quando o MySQL é iniciado ou reiniciado.

  Quando `binlog_gtid_simple_recovery=TRUE`, que é o padrão, os valores de `gtid_executed` e `gtid_purged` são calculados no início, com base nos valores de `Previous_gtids_log_event` nos arquivos de log binário mais recentes e mais antigos. Para uma descrição da computação, consulte A variável de sistema `gtid_purged`. Esta configuração acessa apenas dois arquivos de log binário durante o reinício do servidor. Se todos os logs binários no servidor foram gerados usando o MySQL 5.7.8 ou posterior e você está usando o MySQL 5.7.8 ou posterior, `binlog_gtid_simple_recovery=TRUE` pode ser usado com segurança sempre.

  Com [`binlog_gtid_simple_recovery=TRUE`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_binlog_gtid_simple_recovery), [`gtid_executed`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_gtid_executed) e [`gtid_purged`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_gtid_purged) podem ser inicializados incorretamente nas seguintes duas situações:

  - O log binário mais recente foi gerado pelo MySQL 5.7.5 ou versões anteriores, e [`gtid_mode`](https://pt.wikipedia.org/wiki/gtid_mode) estava `ON` para alguns logs binários, mas `OFF` para o log binário mais recente.

  - Uma declaração `SET @@GLOBAL.gtid_purged` foi emitida no MySQL 5.7.7 ou versões anteriores, e o log binário que estava ativo no momento da declaração `SET @@GLOBAL.gtid_purged` ainda não foi apagado.

  Se um conjunto de GTID incorreto for calculado em qualquer uma dessas situações, ele permanecerá incorreto mesmo se o servidor for reiniciado posteriormente com `binlog_gtid_simple_recovery=FALSE`. Se uma dessas situações se aplicar ao servidor, defina `binlog_gtid_simple_recovery=FALSE` antes de iniciar ou reiniciar o servidor. Para verificar a segunda situação, se você estiver usando o MySQL 5.7.7 ou versões anteriores, após emitir a instrução `SET @@GLOBAL.gtid_purged`, anote o nome atual do arquivo de log binário, que pode ser verificado usando `SHOW MASTER STATUS`. Se o servidor for reiniciado antes que esse arquivo seja purgado, você deve definir `binlog_gtid_simple_recovery=FALSE`.

  Quando `binlog_gtid_simple_recovery=FALSE` é definido, o método de cálculo de `gtid_executed` e `gtid_purged` conforme descrito em A variável de sistema `gtid_purged` é alterado para iterar os arquivos do log binário da seguinte forma:

  - Em vez de usar o valor de `Previous_gtids_log_event` e eventos de log GTID do arquivo de log binário mais recente, a computação para `gtid_executed` itera a partir do arquivo de log binário mais recente e usa o valor de `Previous_gtids_log_event` e quaisquer eventos de log GTID do primeiro arquivo de log binário onde ele encontrar um valor de `Previous_gtids_log_event`. Se os arquivos de log binário mais recentes do servidor não tiverem eventos de log GTID, por exemplo, se `gtid_mode=ON` foi usado, mas o servidor foi alterado para `gtid_mode=OFF` mais tarde, esse processo pode levar muito tempo.

  - Em vez de usar o valor de `Previous_gtids_log_event` do arquivo de log binário mais antigo, o cálculo para `gtid_purged` itera a partir do arquivo de log binário mais antigo e usa o valor de `Previous_gtids_log_event` do primeiro arquivo de log binário onde ele encontrar um valor não vazio de `Previous_gtids_log_event` ou pelo menos um evento de log GTID (indicando que o uso de GTIDs começa nesse ponto). Se os arquivos de log binário mais antigos do servidor não tiverem eventos de log GTID, por exemplo, se `gtid_mode=ON` foi definido recentemente no servidor, esse processo pode levar muito tempo.

  Na versão 5.7.5 do MySQL, essa variável foi adicionada como `simplified_binlog_gtid_recovery` e, na versão 5.7.6 do MySQL, foi renomeada para `binlog_gtid_simple_recovery`.

- `enforce_gtid_consistency`

  <table frame="box" rules="all" summary="Propriedades para enforce_gtid_consistency"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enforce-gtid-consistency[=valu<code>enforce_gtid_consistency</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>enforce_gtid_consistency</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>ON</code>]]</p><p>[[<code>WARN</code>]]</p></td> </tr></tbody></table>

  Dependendo do valor dessa variável, o servidor garante a consistência do GTID, permitindo a execução apenas de instruções que podem ser registradas com segurança usando um GTID. Você *deve* definir essa variável para `ON` antes de habilitar a replicação baseada em GTID.

  Os valores que podem ser configurados para [`enforce_gtid_consistency`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%B5es_de_gtids) são:

  - `OFF`: todas as transações são permitidas para violar a consistência do GTID.

  - `ON`: nenhuma transação é permitida para violar a consistência do GTID.

  - `WARN`: todas as transações são permitidas para violar a consistência do GTID, mas um aviso é gerado neste caso. `WARN` foi adicionado no MySQL 5.7.6.

  Apenas as declarações que podem ser registradas usando declarações seguras GTID podem ser registradas quando [`enforce_gtid_consistency`](https://pt.wikipedia.org/wiki/GTID) está definido como `ON`, portanto, as operações listadas aqui não podem ser usadas com essa opção:

  - `CREATE TABLE ... SELECT` (crie-tabela-selecionar.html)

  - As instruções `CREATE TEMPORARY TABLE` ou `DROP TEMPORARY TABLE` dentro de transações

  - Transações ou declarações que atualizam tabelas tanto transacionais quanto não transacionais. Há uma exceção: a DML não transacional é permitida na mesma transação ou na mesma declaração que a DML transacional, desde que todas as tabelas *não transacionais* sejam temporárias.

  `--enforce-gtid-consistency` só tem efeito se a log de binário ocorrer para uma declaração. Se a log de binário estiver desativada no servidor ou se as declarações não forem escritas no log de binário porque são removidas por um filtro, a consistência do GTID não será verificada ou aplicada para as declarações que não foram registradas.

  Para mais informações, consulte Seção 16.1.3.6, “Restrições à replicação com GTIDs”.

  Antes do MySQL 5.7.6, o booleano `enforce_gtid_consistency` tinha o valor padrão `OFF`. Para manter a compatibilidade com versões anteriores, no MySQL 5.7.6, a enumeração tem o valor padrão `OFF`, e definir `--enforce-gtid-consistency` sem um valor é interpretado como definir o valor para `ON`. A variável também tem múltiplos aliases textuais para os valores: `0=OFF=FALSE`, `1=ON=TRUE`,`2=WARN`. Isso difere de outros tipos de enumeração, mas mantém a compatibilidade com o tipo booleano usado em versões anteriores. Essas mudanças impactam no que é retornado pela variável. Usando `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'` e `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, todos retornam a forma textual, não a forma numérica. Essa é uma mudança incompatível, pois `@@ENFORCE_GTID_CONSISTENCY` retorna a forma numérica para booleanos, mas retorna a forma textual para `SHOW` e o Schema de Informações.

- [`gtid_executed`](https://replication-options-gtids.html#sysvar_gtid_executed)

  <table frame="box" rules="all" summary="Propriedades para gtid_executed"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_executed</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Quando usada com escopo global, essa variável contém uma representação do conjunto de todas as transações executadas no servidor e dos GTIDs definidos por uma instrução `SET` `gtid_purged`. Isso é o mesmo que o valor da coluna `Executed_Gtid_Set` na saída de `SHOW MASTER STATUS` e `SHOW SLAVE STATUS`. O valor dessa variável é um conjunto de GTIDs, consulte GTID Sets para mais informações.

  Quando o servidor é iniciado, o `@@GLOBAL.gtid_executed` é inicializado. Consulte [`binlog_gtid_simple_recovery`](https://pt.wikipedia.org/wiki/Binlog_gtid_simple_recovery) para obter mais informações sobre como os logs binários são iterados para preencher o `@@GLOBAL.gtid_executed` (<https://pt.wikipedia.org/wiki/Gtid_executed>). Os GTIDs são então adicionados ao conjunto à medida que as transações são executadas ou se qualquer declaração `SET` (<https://pt.wikipedia.org/wiki/Set_variable>) `@@GLOBAL.gtid_purged` (<https://pt.wikipedia.org/wiki/Gtid_purged>) for executada.

  O conjunto de transações que podem ser encontradas nos logs binários em qualquer momento é igual a `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`; ou seja, a todas as transações no log binário que ainda não foram purgadas.

  A emissão de `RESET MASTER` faz com que o valor global (mas não o valor da sessão) desta variável seja redefinido para uma string vazia. Os GTIDs não são removidos deste conjunto de outra forma, exceto quando o conjunto é limpo devido ao `RESET MASTER`.

  Antes do MySQL 5.7.7, essa variável também poderia ser usada com escopo de sessão, onde continha uma representação do conjunto de transações que são escritas no cache na sessão atual. O escopo de sessão foi descontinuado no MySQL 5.7.7.

- `gtid_executed_compression_period`

  <table frame="box" rules="all" summary="Propriedades para gtid_executed_compression_period"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--gtid-executed-compression-period=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>gtid_executed_compression_period</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Compressar a tabela `mysql.gtid_executed` a cada número especificado de transações processadas. Quando o registro binário está habilitado no servidor, esse método de compressão não é usado, e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do log binário. Quando o registro binário está desabilitado no servidor, o thread de compressão dorme até que o número especificado de transações seja executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Definir o valor dessa variável de sistema para 0 significa que o thread nunca acorda, então esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

  Consulte [Tabela de compressão de Gtid executado do MySQL](https://pt.wikibooks.org/wiki/Replicação_de_Gtids/Conceitos_de_Gtids/Tabela_de_compressão_de_Gtid_executado) para obter mais informações.

  Essa variável foi adicionada na versão 5.7.5 do MySQL como `executed_gtids_compression_period` e renomeada na versão 5.7.6 do MySQL para `gtid_executed_compression_period`.

- `gtid_mode`

  <table frame="box" rules="all" summary="Propriedades para gtid_mode"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--gtid-mode=MODE</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>gtid_mode</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>OFF</code>]]</p><p>[[<code>OFF_PERMISSIVE</code>]]</p><p>[[<code>ON_PERMISSIVE</code>]]</p><p>[[<code>ON</code>]]</p></td> </tr></tbody></table>

  Controla se o registro baseado em GTID está habilitado e que tipo de transações os registros podem conter. Antes do MySQL 5.7.6, essa variável era somente de leitura e era definida usando `--gtid-mode` apenas no início do servidor. Antes do MySQL 5.7.5, iniciar o servidor com `--gtid-mode=ON` exigia que o servidor também fosse iniciado com as opções `--log-bin` e `--log-slave-updates`. A partir do MySQL 5.7.5, isso não é mais uma exigência. Veja tabela mysql.gtid_executed.

  O MySQL 5.7.6 permite que essa variável seja definida dinamicamente. Você deve ter privilégios suficientes para definir variáveis de sistema globais. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. O `enforce_gtid_consistency` deve estar definido como `ON` antes que você possa definir `gtid_mode=ON`. Antes de modificar essa variável, consulte Seção 16.1.4, “Mudando Modos de Replicação em Servidores Online”.

  As transações registradas no MySQL 5.7.6 e versões posteriores podem ser anônimas ou usar GTIDs. As transações anônimas dependem de um arquivo de log binário e da posição para identificar transações específicas. As transações GTID têm um identificador único que é usado para referenciar transações. Os modos `OFF_PERMISSIVE` e `ON_PERMISSIVE`, adicionados no MySQL 5.7.6, permitem uma mistura desses tipos de transações na topologia. Os diferentes modos são agora:

  - `OFF`: As novas e as transações replicadas devem ser anônimas.

  - `OFF_PERMISSIVE`: Novas transações são anônimas. Transações replicadas podem ser anônimas ou transações GTID.

  - `ON_PERMISSIVE`: Novas transações são transações GTID. Transações replicadas podem ser anônimas ou transações GTID.

  - `ON`: As transações novas e replicadas devem ser transações GTID.

  As mudanças de um valor para outro só podem ser feitas de forma gradual. Por exemplo, se `gtid_mode` estiver atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`.

  No MySQL 5.7.6 e versões posteriores, os valores de `gtid_purged` e `gtid_executed` são persistentes, independentemente do valor de `gtid_mode`. Portanto, mesmo após alterar o valor de `gtid_mode`, essas variáveis contêm os valores corretos. No MySQL 5.7.5 e versões anteriores, os valores de `gtid_purged` e `gtid_executed` não são persistentes quando `gtid_mode=OFF`. Portanto, após alterar `gtid_mode` para `OFF`, uma vez que todos os logs binários que contêm GTIDs sejam purgados, os valores dessas variáveis são perdidos.

- `gtid_next`

  <table frame="box" rules="all" summary="Propriedades para gtid_next"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_next</code>]]</td> </tr><tr><th>Âmbito</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTOMATIC</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p>[[<code>AUTOMATIC</code>]]</p><p>[[<code>ANONYMOUS</code>]]</p><p>[[<code>&lt;UUID&gt;:&lt;NUMBER&gt;</code>]]</p></td> </tr></tbody></table>

  Esta variável é usada para especificar se e como o próximo GTID é obtido.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

  `gtid_next` pode assumir qualquer um dos seguintes valores:

  - `AUTOMATIC`: Use a próxima ID de transação global gerada automaticamente.

  - `ANÔNIMO`: As transações não possuem identificadores globais e são identificadas apenas pelo arquivo e pela posição.

  - Um ID de transação global no formato *`UUID`:*`NUMBER`\*.

  A opção exata entre as acima mencionadas é válida depende da configuração de `gtid_mode`, consulte Seção 16.1.4.1, "Conceitos de Modo de Replicação" para mais informações. A configuração desta variável não tem efeito se `gtid_mode` estiver em `OFF`.

  Depois que essa variável for definida como *`UUID`*:*`NUMBER`*, e uma transação for confirmada ou revertida, uma declaração explícita de `SET GTID_NEXT` deve ser emitida novamente antes de qualquer outra declaração.

  No MySQL 5.7.5 e versões posteriores, o comando `DROP TABLE` ou `DROP TEMPORARY TABLE` falha com um erro explícito quando usado em uma combinação de tabelas não temporárias com tabelas temporárias, ou de tabelas temporárias usando motores de armazenamento transacionais com tabelas temporárias usando motores de armazenamento não transacionais. Antes do MySQL 5.7.5, quando os GTIDs estavam habilitados, mas `gtid_next` não era `AUTOMATIC`, o comando `DROP TABLE` (drop-table.html) não funcionava corretamente quando usado com qualquer uma dessas combinações de tabelas. (Bug #17620053)

  No MySQL 5.7.1, você não pode executar nenhuma das instruções `CHANGE MASTER TO`, `START SLAVE`, `STOP SLAVE`, `REPAIR TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE SERVER`, `ALTER SERVER`, `DROP SERVER`, `CACHE INDEX`, `LOAD INDEX INTO CACHE`, `FLUSH`, ou `RESET` quando `gtid_next` (replication-options-gtids.html#sysvar_gtid_next) está definido para qualquer valor diferente de `AUTOMATIC`; nesses casos, a instrução falha com um erro. Tais instruções não são *desativadas* no MySQL 5.7.2 e versões posteriores. (Bug #16062608, Bug #16715809, Bug #69045) (Bug #16062608)

- [`gtid_owned`](https://replication-options-gtids.html#sysvar_gtid_owned)

  <table frame="box" rules="all" summary="Propriedades para gtid_owned"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_owned</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Essa variável somente de leitura é utilizada principalmente para uso interno. Seu conteúdo depende de seu escopo.

  - Quando usado com escopo global, `gtid_owned` contém uma lista de todos os GTIDs que estão atualmente em uso no servidor, com os IDs dos threads que os possuem. Essa variável é principalmente útil para uma replica multi-thread para verificar se uma transação já está sendo aplicada em outro thread. Um thread aplicante assume a propriedade de um GTID de uma transação o tempo todo que ele está processando a transação, então `@@global.gtid_owned` mostra o GTID e o proprietário durante a duração do processamento. Quando uma transação é comprometida (ou revertida), o thread aplicante libera a propriedade do GTID.

  - Quando usado com escopo de sessão, `gtid_owned` contém um único GTID que está atualmente em uso e pertence a esta sessão. Esta variável é principalmente útil para testar e depurar o uso de GTIDs quando o cliente atribuiu explicitamente um GTID para a transação, definindo `gtid_next`. Neste caso, `@@session.gtid_owned` exibe o GTID o tempo todo que o cliente está processando a transação, até que a transação seja confirmada (ou revertida). Quando o cliente termina de processar a transação, a variável é zerada. Se `gtid_next=AUTOMATIC` for usado para a sessão, `gtid_owned` é preenchido brevemente apenas durante a execução da declaração de confirmação da transação, então não pode ser observado a partir da sessão em questão, embora seja listado se `@@global.gtid_owned` for lido no ponto certo. Se você tiver a necessidade de rastrear os GTIDs que são manipulados por um cliente em uma sessão, você pode habilitar o rastreador de estado da sessão controlado pela variável de sistema `[session_track_gtids`]\(server-system-variables.html#sysvar_session_track_gtids).

- `gtid_purged`

  <table frame="box" rules="all" summary="Propriedades para gtid_purged"><tbody><tr><th>Variável do sistema</th> <td>[[<code>gtid_purged</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  O valor global da variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) é um conjunto de GTIDs que consiste nos GTIDs de todas as transações que foram comprometidas no servidor, mas não existem em nenhum arquivo de log binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

  - GTIDs de transações replicadas que foram comprometidas com o registro binário desativado na replica.

  - GTIDs das transações que foram escritas em um arquivo de log binário que agora foi apagado.

  - GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

  Quando o servidor é iniciado ou reiniciado, o valor global de `gtid_purged` é inicializado com um conjunto de GTIDs. Para obter informações sobre como esse conjunto de GTIDs é calculado, consulte A variável de sistema `gtid_purged`. Se houver logs binários do MySQL 5.7.7 ou versões anteriores no servidor, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor para produzir a computação correta. Consulte a descrição de `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária.

  A emissão de `RESET MASTER` faz com que o valor de `gtid_purged` seja redefinido para uma string vazia.

  Você pode definir o valor de `gtid_purged` para registrar no servidor que as transações de um determinado conjunto de GTID foram aplicadas, embora não existam em nenhum log binário no servidor. Um caso de uso para essa ação é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os logs binários relevantes contendo as transações no servidor.

  Importante

  Os GTIDs estão disponíveis apenas em uma instância do servidor até o número de valores não negativos para um inteiro de 64 bits assinado (2 elevado à potência de 63, menos 1). Se você definir o valor de `gtid_purged` para um número que se aproxime desse limite, os commits subsequentes podem fazer com que o servidor fique sem GTIDs e execute a ação especificada por `binlog_error_action`.

  No MySQL 5.7, é possível atualizar o valor de `gtid_purged` apenas quando `gtid_executed` é uma string vazia, e, portanto, `gtid_purged` é uma string vazia. Esse é o caso quando a replicação não foi iniciada anteriormente ou quando a replicação não usou GTIDs anteriormente. Antes do MySQL 5.7.6, `gtid_purged` também só podia ser definido quando `gtid_mode=ON`. No MySQL 5.7.6 e versões posteriores, `gtid_purged` pode ser definido independentemente do valor de `gtid_mode`.

  Para substituir o valor de `gtid_purged` pelo conjunto de GTID especificado, use a seguinte declaração:

  ```sql
  SET @@GLOBAL.gtid_purged = 'gtid_set'
  ```

  Nota

  Se você estiver usando o MySQL 5.7.7 ou versões anteriores, após emitir uma declaração `SET @@GLOBAL.gtid_purged`, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de reiniciar o servidor, caso contrário, `gtid_purged` pode ser calculado incorretamente. Veja a descrição de `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária. Se todos os logs binários no servidor foram gerados usando o MySQL 5.7.8 ou versões posteriores e você estiver usando o MySQL 5.7.8 ou versões posteriores, `binlog_gtid_simple_recovery=TRUE` (que é o ajuste padrão a partir do MySQL 5.7.7) pode ser usado com segurança sempre.
