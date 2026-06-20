## 16.2 Implementação da Replicação

A replicação é baseada no servidor de origem de replicação que mantém um controle de todas as alterações em seus bancos de dados (atualizações, exclusões, etc.) em seu log binário. O log binário serve como um registro escrito de todos os eventos que modificam a estrutura ou o conteúdo (dados) do banco de dados a partir do momento em que o servidor foi iniciado. Tipicamente, as declarações `SELECT` não são registradas porque elas não modificam a estrutura ou o conteúdo do banco de dados.

Cada réplica que se conecta à fonte solicita uma cópia do log binário. Ou seja, ela extrai os dados da fonte, em vez de a fonte empurrar os dados para a réplica. A réplica também executa os eventos do log binário que ela recebe. Isso tem o efeito de repetir as alterações originais, exatamente como foram feitas na fonte. As tabelas são criadas ou sua estrutura modificada, e os dados são inseridos, excluídos e atualizados de acordo com as alterações que foram originalmente feitas na fonte.

Como cada réplica é independente, a reprodução das alterações do log binário da fonte ocorre de forma independente em cada réplica conectada à fonte. Além disso, como cada réplica recebe uma cópia do log binário apenas solicitando-a da fonte, a réplica é capaz de ler e atualizar a cópia do banco de dados no seu próprio ritmo e pode iniciar e parar o processo de replicação conforme desejar, sem afetar a capacidade de atualização para o estado mais recente do banco de dados, seja no lado da fonte ou da réplica.

Para mais informações sobre os detalhes da implementação da replicação, consulte a Seção 16.2.3, “Eixos de replicação”.

Fontes e réplicas relatam seu status em relação ao processo de replicação regularmente, para que você possa monitorá-las. Consulte a Seção 8.14, “Examinando Informações de Fuso de Servidor (Processo) (Informações)”, para descrições de todos os estados relacionados à replicação.

O log binário da fonte é escrito em um log de relé local na réplica antes de ser processado. A réplica também registra informações sobre a posição atual com o log binário da fonte e o log de relé da réplica. Veja a Seção 16.2.4, “Repositórios de Log de Relé e Metadados de Replicação”.

As alterações do banco de dados são filtradas na replica de acordo com um conjunto de regras que são aplicadas de acordo com as várias opções de configuração e variáveis que controlam a avaliação de eventos. Para obter detalhes sobre como essas regras são aplicadas, consulte a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

### 16.2.1 Formas de Replicação

A replicação funciona porque os eventos escritos no log binário são lidos da fonte e, em seguida, processados na replica. Os eventos são registrados dentro do log binário em diferentes formatos de acordo com o tipo de evento. Os diferentes formatos de replicação utilizados correspondem ao formato de registro binário usado quando os eventos foram registrados no log binário da fonte. A correlação entre os formatos de registro binário e os termos utilizados durante a replicação são:

* Ao usar o registro binário baseado em declarações, a fonte escreve declarações SQL no log binário. A replicação da fonte para a replica funciona executando as declarações SQL na replica. Isso é chamado de replicação baseada em declarações (que pode ser abreviado como SBR), que corresponde ao formato de registro binário baseado em declarações do MySQL.

* Ao usar o registro baseado em strings, a fonte escreve eventos no log binário que indicam como as strings individuais da tabela são alteradas. A replicação da fonte para a replica funciona copiando os eventos que representam as alterações nas strings da tabela para a replica. Isso é chamado de replicação baseada em strings (que pode ser abreviado como RBR).

* Você também pode configurar o MySQL para usar uma combinação de registro baseado em declarações e baseado em strings, dependendo de qual é mais apropriado para a mudança ser registrada. Isso é chamado de registro de formato misto. Ao usar o registro de formato misto, um registro baseado em declarações é usado por padrão. Dependendo de certas declarações e também do mecanismo de armazenamento sendo usado, o registro é automaticamente alterado para baseado em strings em casos específicos. A replicação usando o formato misto é referida como replicação baseada em formato misto ou replicação de formato misto. Para mais informações, consulte a Seção 5.4.4.3, “Formato de Registro Binário Misto”.

Antes do MySQL 5.7.7, o formato baseado em declaração era o padrão. No MySQL 5.7.7 e versões posteriores, o formato baseado em string é o padrão.

**Grupo NDB.** O formato de registro binário padrão no NDB Cluster MySQL 7.5 é `MIXED`. Você deve notar que a Replicação do NDB Cluster sempre usa replicação baseada em string e que o mecanismo de armazenamento `NDB` é incompatível com replicação baseada em declaração. Consulte a Seção 21.7.2, “Requisitos gerais para a replicação do NDB Cluster”, para obter mais informações.

Ao usar o formato `MIXED`, o formato de registro binário é determinado em parte pelo mecanismo de armazenamento que está sendo usado e pela declaração que está sendo executada. Para mais informações sobre registro de formato misto e as regras que regem o suporte a diferentes formatos de registro, consulte a Seção 5.4.4.3, “Formato de Registro Binário Misto”.

O formato de registro em um servidor MySQL em execução é controlado definindo a variável de sistema do servidor `binlog_format`. Essa variável pode ser definida com escopo de sessão ou global. As regras que regem quando e como o novo ajuste entra em vigor são as mesmas para outras variáveis de sistema do servidor MySQL. Definir a variável para a sessão atual dura apenas até o final dessa sessão, e a mudança não é visível para outras sessões. Definir a variável globalmente tem efeito para clientes que se conectam após a mudança, mas não para quaisquer sessões de clientes atuais, incluindo a sessão onde a definição da variável foi alterada. Para tornar a definição da variável de sistema global permanente, de modo que ela se aplique em reinicializações do servidor, você deve defini-la em um arquivo de opção. Para mais informações, consulte a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variável”.

Existem condições em que você não pode alterar o formato de registro binário no tempo real ou que isso faz com que a replicação falhe. Veja a Seção 5.4.4.2, “Definindo o Formato de Registro Binário”.

Para alterar o valor global `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de variáveis de sistema”.

Os formatos de replicação baseados em declarações e baseados em strings têm diferentes problemas e limitações. Para uma comparação de suas vantagens e desvantagens relativas, consulte a Seção 16.2.1.1, “Vantagens e desvantagens da replicação baseada em declarações e baseada em strings”.

Com a replicação baseada em declarações, você pode encontrar problemas ao replicar rotinas ou gatilhos armazenados. Você pode evitar esses problemas usando a replicação baseada em strings, em vez disso. Para mais informações, consulte a Seção 23.7, “Registro binário de programas armazenados”.

#### 16.2.1.1 Vantagens e Desvantagens da Replicação Baseada em Declaração e Baseada em String

Cada formato de registro binário tem vantagens e desvantagens. Para a maioria dos usuários, o formato de replicação mista deve oferecer a melhor combinação de integridade de dados e desempenho. No entanto, se você deseja aproveitar as características específicas do formato de replicação baseado em declarações ou baseado em strings ao realizar certas tarefas, você pode usar as informações nesta seção, que fornece um resumo de suas vantagens e desvantagens relativas, para determinar qual é a melhor para suas necessidades.

* Vantagens da replicação baseada em declarações

* Desvantagens da replicação baseada em declarações

* Vantagens da replicação baseada em string

* Desvantagens da replicação baseada em string

##### Vantagens da replicação baseada em declarações

* Tecnologia comprovada. * Menos dados escritos em arquivos de registro. Quando as atualizações ou exclusões afetam muitas strings, isso resulta em *muito* menos espaço de armazenamento necessário para os arquivos de registro. Isso também significa que a realização e a restauração de backups podem ser realizadas de forma mais rápida.

* Os arquivos de registro contêm todas as declarações que fizeram alterações, portanto, podem ser usados para auditar o banco de dados.

##### Desvantagens da replicação baseada em declarações

* **Declarações que não são seguras para SBR.** Nem todas as declarações que modificam dados (como as declarações `INSERT`, `DELETE`, `UPDATE` e `REPLACE` `INSERT` e `DELETE`, `UPDATE` e `REPLACE` `INSERT` e `DELETE`, `UPDATE` e `REPLACE` podem ser replicadas usando replicação baseada em declarações. Qualquer comportamento não determinístico é difícil de replicar ao usar replicação baseada em declarações. Exemplos de tais declarações de Linguagem de Modificação de Dados (DML) incluem os seguintes:

+ Uma declaração que depende de uma função carregável ou de um programa armazenado que é não determinístico, uma vez que o valor retornado por tal função ou programa armazenado depende de fatores que não os parâmetros fornecidos a ele. (A replicação baseada em strings, no entanto, simplesmente replica o valor retornado pela função ou programa armazenado, portanto, seu efeito em strings e dados da tabela é o mesmo tanto na fonte quanto na replica.) Consulte a Seção 16.4.1.16, “Replicação de Recursos Convocados”, para mais informações.

As declarações `DELETE` e `UPDATE` que utilizam uma cláusula `LIMIT` sem uma `ORDER BY` são não determinísticas. Veja a Seção 16.4.1.17, “Replicação e LIMIT”.

Funções determinísticas carregáveis devem ser aplicadas nas réplicas.

+ As declarações que utilizam qualquer uma das seguintes funções não podem ser replicadas corretamente usando a replicação baseada em declarações:

- `LOAD_FILE()`
- `UUID()`, `UUID_SHORT()`

- `USER()`
- `FOUND_ROWS()`
- `SYSDATE()` (a menos que tanto a fonte quanto a réplica sejam iniciadas com a opção `--sysdate-is-now`)

- `GET_LOCK()`
- `IS_FREE_LOCK()`
- `IS_USED_LOCK()`
- `MASTER_POS_WAIT()`
- `RAND()`
- `RELEASE_LOCK()`
- `SLEEP()`
- `VERSION()`

No entanto, todas as outras funções são replicadas corretamente usando replicação baseada em declarações, incluindo `NOW()` e assim por diante.

Para mais informações, consulte a Seção 16.4.1.15, “Replicação e Funções do Sistema”.

As declarações que não podem ser replicadas corretamente usando replicação baseada em declarações são registradas com um aviso como o mostrado aqui:

  ```sql
  [Warning] Statement is not safe to log in statement format.
  ```

Um aviso semelhante também é emitido ao cliente nesses casos. O cliente pode exibí-lo usando `SHOW WARNINGS`.

* `INSERT ... SELECT` requer um número maior de bloqueios em nível de string do que com replicação baseada em string.

* As declarações `UPDATE` que exigem uma varredura de tabela (porque nenhum índice é usado na cláusula `WHERE`) devem bloquear um número maior de strings do que com replicação baseada em string.

* Para `InnoDB`: Uma declaração `INSERT` que usa blocos `AUTO_INCREMENT` exclui outras declarações `INSERT` que não estão em conflito.

* Para declarações complexas, a declaração deve ser avaliada e executada na réplica antes de as strings serem atualizadas ou inseridas. Com a replicação baseada em strings, a réplica só precisa modificar as strings afetadas, não executar a declaração completa.

* Se houver um erro na avaliação da réplica, especialmente ao executar instruções complexas, a replicação baseada em instruções pode aumentar lentamente a margem de erro nas strings afetadas ao longo do tempo. Consulte a Seção 16.4.1.27, “Erros na Réplica Durante a Replicação”.

* As funções armazenadas são executadas com o mesmo valor `NOW()` que a instrução que as chama. No entanto, isso não é verdade para procedimentos armazenados.

As definições da tabela devem ser (quase) idênticas na fonte e na réplica. Consulte a Seção 16.4.1.10, “Replicação com definições de tabela diferentes na fonte e na réplica”, para mais informações.

##### Vantagens da replicação baseada em string

* Todas as alterações podem ser replicadas. Esta é a forma mais segura de replicação.

Nota

As declarações que atualizam as informações no banco de dados do sistema `mysql`, como `GRANT`, `REVOKE` e a manipulação de gatilhos, rotinas armazenadas (incluindo procedimentos armazenados) e visualizações, são todas replicadas para réplicas usando replicação baseada em declarações.

Para declarações como `CREATE TABLE ... SELECT`, uma declaração `CREATE` é gerada a partir da definição da tabela e replicada usando o formato baseado em declaração, enquanto as inserções de string são replicadas usando o formato baseado em string.

* São necessários menos bloqueios de string na fonte, o que permite maior concorrência, para os seguintes tipos de declarações:

+ `INSERT ... SELECT`

+ `INSERT` com `AUTO_INCREMENT`

+ `UPDATE` ou `DELETE` com cláusulas `WHERE` que não utilizam chaves ou que não alteram a maioria das strings examinadas.

* São necessários menos bloqueios de string na replica para qualquer declaração `INSERT`, `UPDATE` ou `DELETE`.

##### Desvantagens da replicação baseada em string

* O RBR pode gerar mais dados que devem ser registrados. Para replicar uma declaração DML (como uma declaração `UPDATE` ou `DELETE`, a replicação baseada em declaração escreve apenas a declaração no log binário. Em contraste, a replicação baseada em string escreve cada string alterada no log binário. Se a declaração alterar muitas strings, a replicação baseada em string pode escrever significativamente mais dados no log binário; isso é verdadeiro mesmo para declarações que são revertidas. Isso também significa que fazer e restaurar um backup pode exigir mais tempo. Além disso, o log binário é bloqueado por um período de tempo mais longo para escrever os dados, o que pode causar problemas de concorrência. Use `binlog_row_image=minimal` para reduzir a desvantagem consideravelmente.

* Funções carregáveis determinísticas que geram grandes valores de `BLOB` demoram mais para ser replicadas com replicação baseada em string do que com replicação baseada em declaração. Isso ocorre porque o valor da coluna `BLOB` é registrado, em vez de a declaração gerando os dados.

* Não é possível ver na réplica quais declarações foram recebidas da fonte e executadas. No entanto, é possível ver quais dados foram alterados usando **mysqlbinlog** com as opções `--base64-output=DECODE-ROWS` e `--verbose`.

Alternativamente, use a variável `binlog_rows_query_log_events`, que, se habilitada, adiciona um evento `Rows_query` com a declaração para a saída do **mysqlbinlog** quando a opção `-vv` é usada.

* Para tabelas que utilizam o mecanismo de armazenamento `MyISAM`, é necessário um bloqueio mais forte na replica para as declarações `INSERT` ao aplicá-las como eventos baseados em string no log binário do que ao aplicá-las como declarações. Isso significa que inserções concorrentes em tabelas `MyISAM` não são suportadas ao usar replicação baseada em string.

#### 16.2.1.2 Uso de Registro e Replicação Baseado em String

O MySQL utiliza o registro baseado em declarações (SBL), registro baseado em strings (RBL) ou registro de formato misto. O tipo de registro binário utilizado afeta o tamanho e a eficiência do registro. Portanto, a escolha entre replicação baseada em strings (RBR) ou replicação baseada em declarações (SBR) depende da sua aplicação e do ambiente. Esta seção descreve os problemas conhecidos ao usar um registro em formato baseado em strings e descreve algumas melhores práticas ao usá-lo na replicação.

Para informações adicionais, consulte a Seção 16.2.1, “Formatos de Replicação”, e a Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declaração e Baseada em String”.

Para informações sobre problemas específicos da Replicação de NDB Cluster (que depende da replicação baseada em string), consulte a Seção 21.7.3, “Problemas Conhecidos na Replicação de NDB Cluster”.

* **Registro baseado em strings de tabelas temporárias.** Como observado na Seção 16.4.1.29, “Replicação e Tabelas Temporárias”, as tabelas temporárias não são replicadas quando se usa o formato baseado em strings. Quando se usa o registro de formato misto, as declarações “seguras” que envolvem tabelas temporárias são registradas usando o formato baseado em declarações. Para mais informações, consulte a Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Strings”.

As tabelas temporárias não são replicadas ao usar o formato baseado em string, porque não há necessidade. Além disso, como as tabelas temporárias podem ser lidas apenas pelo thread que as criou, raramente, ou nunca, há algum benefício obtido ao replicá-las, mesmo quando usando o formato baseado em declaração.

Você pode mudar do formato de registro binário baseado em declaração para o baseado em string no tempo real, mesmo quando tabelas temporárias já foram criadas. A partir do MySQL 5.7.25, o servidor MySQL registra o modo de registro que estava em vigor quando cada tabela temporária foi criada. Quando uma sessão de cliente específica termina, o servidor registra uma declaração `DROP TEMPORARY TABLE IF EXISTS` para cada tabela temporária que ainda existe e foi criada quando o registro binário baseado em declaração estava em uso. Se o registro binário baseado em string ou misto estava em uso quando a tabela foi criada, a declaração `DROP TEMPORARY TABLE IF EXISTS` não é registrada. Em versões anteriores, a declaração `DROP TEMPORARY TABLE IF EXISTS` era registrada independentemente do modo de registro que estava em vigor.

As declarações DML não transacionais que envolvem tabelas temporárias são permitidas ao usar `binlog_format=ROW`, desde que quaisquer tabelas não transacionais afetadas pelas declarações sejam tabelas temporárias (Bug #14272672).

* **RBL e sincronização de tabelas não transacionais.** Quando muitas strings são afetadas, o conjunto de alterações é dividido em vários eventos; quando a declaração é confirmada, todos esses eventos são escritos no log binário. Ao executar na replica, uma bloqueio de tabela é tomado em todas as tabelas envolvidas, e então as strings são aplicadas em modo em lote. Dependendo do motor usado para a cópia da tabela da replica, isso pode ou não ser eficaz.

* **Latência e tamanho do log binário.** O RBL escreve as alterações para cada string no log binário, e, portanto, seu tamanho pode aumentar rapidamente. Isso pode aumentar significativamente o tempo necessário para fazer alterações na replica que correspondem às do banco de dados fonte. Você deve estar ciente do potencial desse atraso em seus aplicativos.

* **Leitura do log binário.** O **mysqlbinlog** exibe eventos baseados em strings no log binário usando a declaração `BINLOG` (consulte Seção 13.7.6.1, “Declaração BINLOG”). Esta declaração exibe um evento como uma string codificada em base 64, cujo significado não é evidente. Quando invocado com as opções `--base64-output=DECODE-ROWS` e `--verbose`, o **mysqlbinlog** formata o conteúdo do log binário para ser legível para humanos. Quando eventos de log binário foram escritos em formato baseado em strings e você deseja ler ou recuperar de uma falha de replicação ou de banco de dados, pode usar este comando para ler o conteúdo do log binário. Para mais informações, consulte Seção 4.6.7.2, “Exibição de Evento de String mysqlbinlog”.

* **Erros de execução de log binário e modo de execução de replica.** O uso de `slave_exec_mode=IDEMPOTENT` é geralmente útil apenas com replicação do MySQL NDB Cluster, para a qual `IDEMPOTENT` é o valor padrão. (Veja a Seção 21.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular”). Quando `slave_exec_mode` é `IDEMPOTENT`, a falha em aplicar alterações do RBL porque a string original não pode ser encontrada não desencadeia um erro ou faz com que a replicação falhe. Isso significa que é possível que as atualizações não sejam aplicadas na replica, de modo que a fonte e a replica não sejam mais sincronizadas. Problemas de latência e uso de tabelas não transacionais com RBR quando `slave_exec_mode` é `IDEMPOTENT` podem fazer com que a fonte e a replica se desviem ainda mais. Para mais informações sobre `slave_exec_mode`, consulte a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Para outros cenários, definir `slave_exec_mode` para `STRICT` é normalmente suficiente; esse é o valor padrão para motores de armazenamento que não são `NDB`.

* **Filtragem com base no ID do servidor não é suportada.** Você pode filtrar com base no ID do servidor usando a opção `IGNORE_SERVER_IDS` para a declaração `CHANGE MASTER TO`. Esta opção funciona com formatos de registro baseados em declaração e baseados em string. Outro método para excluir alterações em algumas réplicas é usar uma cláusula `WHERE` que inclui a cláusula de relação `@@server_id <> id_value` com as declarações `UPDATE` e `DELETE`. Por exemplo, `WHERE @@server_id <> 1`. No entanto, isso não funciona corretamente com registro baseado em string. Para usar a variável de sistema `server_id` para filtragem de declaração, use o registro baseado em declaração.

* **Tabelas RBL, não transacionais e réplicas paralisadas.** Ao usar o registro baseado em string, se o servidor de réplica for parado enquanto um thread de replicação está atualizando uma tabela não transacional, o banco de dados da réplica pode atingir um estado inconsistente. Por esse motivo, é recomendável que você use um motor de armazenamento transacional, como `InnoDB`, para todas as tabelas replicadas usando o formato baseado em string. O uso de `STOP SLAVE` ou `STOP SLAVE SQL_THREAD` antes de desligar o servidor de réplica ajuda a evitar problemas e é sempre recomendado, independentemente do formato de registro ou do motor de armazenamento que você usa.

#### 16.2.1.3 Determinação de declarações seguras e inseguras em registro binário

A “segurança” de uma declaração na Replicação do MySQL refere-se ao fato de que a declaração e seus efeitos podem ser replicados corretamente usando o formato baseado em declaração. Se isso for verdade para a declaração, referimo-nos à declaração como segura; caso contrário, referimo-nos a ela como insegura.

Em geral, uma declaração é segura se for determinada, e insegura se não o for. No entanto, certas funções não determinísticas *não* são consideradas inseguras (consulte Funções não determinísticas não consideradas inseguras, mais adiante nesta seção). Além disso, declarações que utilizam resultados de funções matemáticas de ponto flutuante — que dependem do hardware — são sempre consideradas inseguras (consulte Seção 16.4.1.12, “Replicação e Valores de Ponto Flutuante”).

**Tratamento de declarações seguras e inseguras.** Uma declaração é tratada de maneira diferente, dependendo se a declaração é considerada segura e em relação ao formato de registro binário (ou seja, o valor atual de `binlog_format`).

* Ao usar o registro baseado em string, não se faz distinção no tratamento de declarações seguras e inseguras.

* Ao usar o registro de formato misto, as declarações marcadas como inseguras são registradas usando o formato baseado em string; as declarações consideradas seguras são registradas usando o formato baseado em declaração.

* Ao usar o registro baseado em declarações, as declarações marcadas como inseguras geram um aviso nesse sentido. As declarações seguras são registradas normalmente.

Cada declaração marcada como insegura gera um aviso. Anteriormente, se um grande número dessas declarações fosse executado na fonte, isso poderia levar a arquivos de registro de erro excessivamente grandes. Para evitar isso, o MySQL 5.7 fornece um mecanismo de supressão de avisos, que funciona da seguinte forma: Sempre que as 50 últimas `ER_BINLOG_UNSAFE_STATEMENT` avisos tenham sido gerados mais de 50 vezes em qualquer período de 50 segundos, a supressão de avisos é habilitada. Quando ativado, isso faz com que esses avisos não sejam escritos no registro de erro; em vez disso, para cada 50 avisos desse tipo, uma nota `The last warning was repeated N times in last S seconds` é escrita no registro de erro. Isso continua enquanto as 50 últimas declarações desse tipo forem emitidas em 50 segundos ou menos; uma vez que a taxa tenha diminuído abaixo desse limite, os avisos são novamente registrados normalmente. A supressão de avisos não afeta a forma como a segurança das declarações para o registro baseado em declarações é determinada, nem a forma como os avisos são enviados ao cliente. Os clientes do MySQL ainda recebem um aviso para cada declaração desse tipo.

Para mais informações, consulte a Seção 16.2.1, “Formatos de Replicação”.

**Declarações consideradas inseguras.** As declarações com as seguintes características são consideradas inseguras:

* **Declarações que contêm funções do sistema que podem retornar um valor diferente em uma réplica.** Essas funções incluem `FOUND_ROWS()`, `GET_LOCK()`, `IS_FREE_LOCK()`, `IS_USED_LOCK()`, `LOAD_FILE()`, `MASTER_POS_WAIT()`, `PASSWORD()`, `RAND()`, `RELEASE_LOCK()`, `ROW_COUNT()`, `SESSION_USER()`, `SLEEP()`, `SYSDATE()`, `SYSTEM_USER()`, `USER()`, `UUID()` e `UUID_SHORT()`.

As funções não determinísticas não são consideradas inseguras. Embora essas funções não sejam determinísticas, elas são tratadas como seguras para fins de registro e replicação: `CONNECTION_ID()`, `CURDATE()`, `CURRENT_DATE()`, `CURRENT_TIME()`, `CURRENT_TIMESTAMP()`, `CURTIME()`, `LAST_INSERT_ID()`, `LOCALTIME()`, `LOCALTIMESTAMP()`, `NOW()`, `UNIX_TIMESTAMP()`, `UTC_DATE()`, `UTC_TIME()` e `UTC_TIMESTAMP()`.

Para mais informações, consulte a Seção 16.4.1.15, “Replicação e Funções do Sistema”.

* **Referências a variáveis do sistema.** A maioria das variáveis do sistema não é replicada corretamente usando o formato baseado em declarações. Consulte a Seção 16.4.1.37, “Replicação e Variáveis”. Para exceções, consulte a Seção 5.4.4.3, “Formato de registro binário misto”.

* **Funções carregáveis. Como não temos controle sobre o que uma função carregável faz, devemos assumir que ela está executando declarações inseguras.

* **Plugin de texto completo.** Este plugin pode se comportar de maneira diferente em diferentes servidores MySQL; portanto, as declarações que dependem dele podem ter resultados diferentes. Por essa razão, todas as declarações que dependem do plugin de texto completo são tratadas como inseguras (Bug #11756280, Bug #48183).

* **Atualizações de programas armazenados ou desencadeadas em uma tabela com uma coluna AUTO_INCREMENT.** Isso é inseguro porque a ordem em que as strings são atualizadas pode diferir entre a fonte e a réplica.

Além disso, uma `INSERT` em uma tabela que possui uma chave primária composta contendo uma coluna `AUTO_INCREMENT` que não é a primeira coluna dessa chave composta é insegura.

Para mais informações, consulte a Seção 16.4.1.1, “Replicação e AUTO_INCREMENT”.

* **INSERIR ... ON DUPLICATE KEY UPDATE em tabelas com múltiplas chaves primárias ou únicas.** Quando executado em uma tabela que contém mais de uma chave primária ou única, essa declaração é considerada insegura, pois é sensível à ordem em que o motor de armazenamento verifica as chaves, que não é determinística, e na qual a escolha das strings atualizadas pelo MySQL Server depende.

Uma declaração `INSERT ... ON DUPLICATE KEY UPDATE` contra uma tabela que tem mais de uma chave única ou primária é marcada como insegura para replicação baseada em declaração. (Bug #11765650, Bug #58637)

* **Atualizações usando LIMIT.** A ordem em que as strings são recuperadas não é especificada e, portanto, é considerada insegura. Veja a Seção 16.4.1.17, “Replicação e LIMIT”.

* **Registros de acessos ou referências em tabelas de log.** O conteúdo da tabela de log do sistema pode diferir entre a fonte e a replica.

* **Operações não transacionais após operações transacionais.** Dentro de uma transação, permitir que quaisquer leituras ou escritas não transacionais sejam executadas após quaisquer leituras ou escritas transacionais é considerado inseguro.

Para mais informações, consulte a Seção 16.4.1.33, “Replicação e Transações”.

* **Acesse ou faça referência a tabelas de autoregistro.** Todas as leituras e escritas em tabelas de autoregistro são consideradas inseguras. Dentro de uma transação, qualquer declaração que siga uma leitura ou escrita em tabelas de autoregistro também é considerada insegura.

* **declarações LOAD DATA.** `LOAD DATA` é tratado como inseguro e, quando `binlog_format=mixed` a declaração é registrada no formato baseado em string. Quando `binlog_format=statement` `LOAD DATA` não gera uma advertência, ao contrário de outras declarações inseguras.

* **Transações XA.** Se duas transações XA comprometidas em paralelo na fonte estão sendo preparadas na replica na ordem inversa, podem ocorrer dependências de bloqueio com replicação baseada em declarações que não podem ser resolvidas com segurança, e é possível que a replicação falhe com um impasse na replica. Quando `binlog_format=STATEMENT` está definido, as declarações DML dentro das transações XA são marcadas como inseguras e geram um aviso. Quando `binlog_format=MIXED` ou `binlog_format=ROW` está definido, as declarações DML dentro das transações XA são registradas usando replicação baseada em strings, e o problema potencial não está presente.

Para informações adicionais, consulte a Seção 16.4.1, “Recursos e problemas de replicação”.

### 16.2.2 Canais de Replicação

Na replicação multifonte do MySQL, uma réplica abre vários canais de replicação, um para cada servidor de fonte de replicação. Os canais de replicação representam o caminho das transações que fluem de uma fonte para a réplica. Cada canal de replicação tem seu próprio thread de receptor (I/O), um ou mais threads de aplicação (SQL) e um log de releio. Quando as transações de uma fonte são recebidas pelo thread de receptor de um canal, elas são adicionadas ao arquivo de log de releio do canal e passadas para os threads de aplicação do canal. Isso permite que cada canal funcione de forma independente.

Esta seção descreve como os canais podem ser usados em uma topologia de replicação e o impacto que eles têm na replicação de fonte única. Para obter instruções sobre como configurar fontes e réplicas para replicação de múltiplas fontes, iniciar, parar e reiniciar réplicas de múltiplas fontes, e monitorar a replicação de múltiplas fontes, consulte a Seção 16.1.5, “Replicação de Múltiplas Fontes MySQL”.

O número máximo de canais que podem ser criados em uma replica em uma topologia de replicação de múltiplas fontes é de 256. Cada canal de replicação deve ter um nome único (não vazio), conforme explicado na Seção 16.2.2.4, "Convenções de Nomenclatura de Canais de Replicação". Os códigos de erro e as mensagens que são emitidos quando a replicação de múltiplas fontes é habilitada especificam o canal que gerou o erro.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Não é possível configurar vários canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, portanto, não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica multigeradora também pode ser configurada como uma replica multifiltrada, definindo a variável de sistema `slave_parallel_workers` para um valor maior que 0. Quando você faz isso em uma replica multigeradora, cada canal na replica tem o número especificado de threads de aplicador, além de uma thread de coordenador para gerenciá-las. Não é possível configurar o número de threads de aplicador para canais individuais.

Para garantir compatibilidade com versões anteriores, o servidor MySQL automaticamente cria, no início, um canal padrão cujo nome é a string vazia (`""`). Esse canal está sempre presente; ele não pode ser criado ou destruído pelo usuário. Se não houver outros canais (com nomes não vazios) criados, as declarações de replicação atuam apenas no canal padrão, de modo que todas as declarações de replicação das réplicas anteriores funcionam conforme o esperado (ver Seção 16.2.2.2, “Compatibilidade com Declarações de Replicação Prévias”. As declarações que se aplicam a canais de replicação, conforme descrito nesta seção, podem ser usadas apenas quando há pelo menos um canal com nome.

#### 16.2.2.1 Comandos para operações em um único canal

Para permitir que as operações de replicação do MySQL atuem em canais de replicação individuais, use a cláusula `FOR CHANNEL channel` com as seguintes declarações de replicação:

* `CHANGE MASTER TO`
* `START SLAVE`
* `STOP SLAVE`
* `SHOW RELAYLOG EVENTS`
* `FLUSH RELAY LOGS`

* `SHOW SLAVE STATUS`
* `RESET SLAVE`

Da mesma forma, um parâmetro adicional `channel` é introduzido para as seguintes funções:

* `MASTER_POS_WAIT()`
* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`

As seguintes declarações são proibidas para o canal `group_replication_recovery`:

* `START SLAVE`
* `STOP SLAVE`

As seguintes declarações são proibidas para o canal `group_replication_applier`:

* `START SLAVE`
* `STOP SLAVE`
* `SHOW SLAVE STATUS`
* `FLUSH RELAY LOGS`

#### 16.2.2.2 Compatibilidade com declarações de replicação anteriores

Quando uma réplica tem vários canais e a opção `FOR CHANNEL channel` não é especificada, uma declaração válida geralmente atua em todos os canais disponíveis, com algumas exceções específicas.

Por exemplo, as seguintes declarações se comportam conforme o esperado para todos, exceto para certos canais de Replicação de Grupo:

* `START SLAVE` inicia os threads de replicação para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

* `STOP SLAVE` para de replicar os threads para todos os canais, exceto os canais `group_replication_recovery` e `group_replication_applier`.

* `SHOW SLAVE STATUS` reporta o status para todos os canais, exceto o canal `group_replication_applier`.

* `FLUSH RELAY LOGS` limpa os registros do relé para todos os canais, exceto o canal `group_replication_applier`.

* `RESET SLAVE` redefiniu todos os canais.

Aviso

Use `RESET SLAVE` com cautela, pois essa declaração exclui todos os canais existentes, limpa seus arquivos de registro de relevo e recria apenas o canal padrão.

Algumas declarações de replicação não podem operar em todos os canais. Neste caso, é gerado o erro 1964 Múltiplos canais existem no escravo. Por favor, forneça o nome do canal como argumento. As seguintes declarações e funções geram este erro quando utilizadas em uma topologia de replicação de múltiplas fontes e uma opção `FOR CHANNEL channel` não é usada para especificar em qual canal agir:

* `SHOW RELAYLOG EVENTS`
* `CHANGE MASTER TO`
* `MASTER_POS_WAIT()`
* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`

Observe que um canal padrão sempre existe em uma topologia de replicação de uma única fonte, onde as declarações e funções se comportam como nas versões anteriores do MySQL.

#### 16.2.2.3 Opções de inicialização e canais de replicação

Esta seção descreve as opções de inicialização que são afetadas pela adição de canais de replicação.

Os seguintes ajustes de inicialização *devem* ser configurados corretamente para usar a replicação de múltiplas fontes.

* `relay_log_info_repository`.

Isso deve ser definido como `TABLE`. Se essa variável for definida como `FILE`, a tentativa de adicionar mais fontes a uma replica falha com `ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`.

* `master_info_repository`

Isso deve ser definido como `TABLE`. Se essa variável for definida como `FILE`, a tentativa de adicionar mais fontes a uma replica falha com `ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`.

As seguintes opções de inicialização agora afetam *todos* os canais em uma topologia de replicação.

* `--log-slave-updates`

Todas as transações recebidas pela réplica (mesmo de várias fontes) são escritas no log binário.

* `--relay-log-purge`

Quando configurado, cada canal limpa seu próprio registro de relé automaticamente.

* `--slave_transaction_retries`

Aplique threads de todos os canais para repetir as transações.

* `--skip-slave-start`

Nenhum thread de replicação é iniciado em nenhum canal.

* `--slave-skip-errors`

A execução continua e os erros são ignorados para todos os canais.

Os valores definidos para as seguintes opções de inicialização se aplicam em cada canal; como essas são opções de inicialização `mysqld`, elas são aplicadas em todos os canais.

* `--max-relay-log-size=size`

Tamanho máximo do arquivo de registro individual do relé para cada canal; após atingir esse limite, o arquivo é rotado.

* `--relay-log-space-limit=size`

Limite superior para o tamanho total de todos os registros de relé combinados, para cada canal individual. Para os canais *`N`*, o tamanho combinado desses registros é limitado a `relay_log_space_limit * N`.

* `--slave-parallel-workers=value`

Número de threads de trabalho por canal.

* `slave_checkpoint_group`

Tempo de espera por uma thread de E/S para cada fonte.

* `--relay-log-index=filename`

Nome de base para o índice de log de releio de cada canal. Veja a Seção 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

* `--relay-log=filename`

Indica o nome de base do arquivo de registro de releio de cada canal. Veja a Seção 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

* `--slave_net-timeout=N`

Esse valor é definido por canal, de modo que cada canal espere *`N`* segundos para verificar se há uma conexão quebrada.

* `--slave-skip-counter=N`

Esse valor é definido por canal, de modo que cada canal ignore os eventos de *`N`* de sua fonte.

#### 16.2.2.4 Convenções de Nomenclatura de Canais de Replicação

Esta seção descreve como as convenções de nomenclatura são impactadas pelos canais de replicação.

Cada canal de replicação tem um nome único, que é uma cadeia com um comprimento máximo de 64 caracteres e que é sensível a maiúsculas e minúsculas. Como os nomes dos canais são usados em repositórios de metadados de replicação, o conjunto de caracteres usado para esses é sempre UTF-8. Embora você geralmente possa usar qualquer nome para os canais, os seguintes nomes são reservados:

* `group_replication_applier`
* `group_replication_recovery`

O nome que você escolhe para um canal de replicação também influencia os nomes dos arquivos usados por uma replica de várias fontes. Os arquivos de registro de releio e os arquivos de índice para cada canal são nomeados `relay_log_basename-channel.xxxxxx`, onde *`relay_log_basename`* é um nome base especificado usando a variável de sistema `relay_log`, e *`channel`* é o nome do canal registrado neste arquivo. Se você não especificar a variável de sistema `relay_log`, um nome de arquivo padrão é usado que também inclui o nome do canal.

### 16.2.3 Ferramentas de replicação de threads

As capacidades de replicação do MySQL são implementadas usando três threads principais, um no servidor fonte e dois na replica:

* **Spool de dados do log binário.** A fonte cria um thread para enviar o conteúdo do log binário para uma réplica quando a réplica se conecta. Esse thread pode ser identificado na saída do `SHOW PROCESSLIST` na fonte como o thread `Binlog Dump`.

O thread de exclusão binária do log adquire um bloqueio no log binário da fonte para leitura de cada evento que deve ser enviado para a réplica. Assim que o evento é lido, o bloqueio é liberado, mesmo antes do evento ser enviado para a réplica.

* **Ferramenta de I/O de replicação.** Quando uma declaração `START SLAVE` é emitida em um servidor de replicação, a replicação cria uma thread de I/O, que se conecta à fonte e pede-lhe para enviar as atualizações registradas nos seus logs binários.

O thread de I/O de replicação lê as atualizações que o thread [[`Binlog Dump`] da fonte envia (veja o item anterior) e as copia para arquivos locais que compõem o log de retransmissão da replica.

O estado deste thread é mostrado como `Slave_IO_running` na saída de `SHOW SLAVE STATUS`.

* **Fuso de replicação SQL.** A replica cria um fuso de SQL para ler o log de retransmissão que é escrito pelo fuso de I/O de replicação e executar as transações contidas nele.

Há três threads principais para cada conexão de fonte/replica. Uma fonte que tem múltiplas réplicas cria um thread de exibição de dados binários para cada replica conectada atualmente, e cada replica tem seus próprios threads de I/O de replicação e SQL.

Uma replica usa dois threads para separar as atualizações de leitura da fonte e executá-las em tarefas independentes. Assim, a tarefa de leitura das transações não é retardada se o processo de aplicação delas for lento. Por exemplo, se o servidor de replica não estiver em execução há algum tempo, seu thread de I/O pode rapidamente obter todos os conteúdos do log binário da fonte quando a replica começa, mesmo que o thread de SQL esteja muito atrasado. Se a replica parar antes de o thread de SQL ter executado todas as declarações obtidas, o thread de I/O pelo menos obteve tudo, de modo que uma cópia segura das transações seja armazenada localmente nos logs de relevo da replica, pronta para execução na próxima vez que a replica começar.

Você pode habilitar a paralelização adicional para tarefas em uma replica, definindo a variável de sistema `slave_parallel_workers` para um valor maior que 0 (o padrão). Quando essa variável de sistema é definida, a replica cria o número especificado de threads de trabalho para aplicar transações, além de um thread de coordenador para gerenciá-las. Se você estiver usando vários canais de replicação, cada canal tem esse número de threads. Uma replica com `slave_parallel_workers` definida para um valor maior que 0 é chamada de replica multithread. Com essa configuração, as transações que falham podem ser retestadas.

Nota

As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração para essa variável. Consulte a Seção 21.7.3, “Problemas Conhecidos na Replicação do NDB Cluster”, para obter mais informações.

#### 16.2.3.1 Monitoramento das principais threads de replicação

A declaração `SHOW PROCESSLIST` fornece informações que informam o que está acontecendo na fonte e na réplica em relação à replicação. Para informações sobre os estados da fonte, consulte a Seção 8.14.5, “Estados de Fuso de Replicação da Fonte”. Para estados da réplica, consulte a Seção 8.14.6, “Estados de E/S de Replicação da Réplica”, e a Seção 8.14.7, “Estados de E/S de Replicação SQL da Réplica”.

O exemplo a seguir ilustra como os três principais threads de replicação, o thread de exclusão binária, o thread de I/O de replicação e o thread de SQL de replicação aparecem na saída do `SHOW PROCESSLIST`.

No servidor de origem, a saída do `SHOW PROCESSLIST` parece assim:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 2
   User: root
   Host: localhost:32931
     db: NULL
Command: Binlog Dump
   Time: 94
  State: Has sent all binlog to slave; waiting for binlog to
         be updated
   Info: NULL
```

Aqui, o thread 2 é um thread `Binlog Dump` que atende a uma replica conectada. As informações `State` indicam que todas as atualizações pendentes foram enviadas para a replica e que a fonte está esperando por mais atualizações. Se você não ver nenhum thread `Binlog Dump` em um servidor de origem, isso significa que a replicação não está sendo executada; ou seja, nenhuma replica está conectada atualmente.

Em um servidor de replicação, a saída do `SHOW PROCESSLIST` parece assim:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 10
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 11
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Has read all relay log; waiting for the slave I/O
         thread to update it
   Info: NULL
```

A informação `State` indica que o thread 10 é o thread de I/O de replicação que está se comunicando com o servidor de origem, e o thread 11 é o thread de SQL de replicação que está processando as atualizações armazenadas nos registros do relé. No momento em que o `SHOW PROCESSLIST` foi executado, ambos os threads estavam inativos, aguardando atualizações adicionais.

O valor na coluna `Time` pode mostrar o quão atrasada a replica está em relação à fonte. Veja a Seção A.14, “Perguntas Frequentes do MySQL 5.7: Replicação”. Se passar tempo suficiente no lado da fonte sem atividade no thread `Binlog Dump`, a fonte determina que a replica não está mais conectada. Quanto a qualquer outra conexão do cliente, os tempos de espera para isso dependem dos valores de `net_write_timeout` e `net_retry_count`; para mais informações sobre esses valores, veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

A declaração `SHOW SLAVE STATUS` fornece informações adicionais sobre o processamento de replicação em um servidor de replicação. Veja a Seção 16.1.7.1, “Verificar o status da replicação”.

#### 16.2.3.2 Trabalhadores do aplicativo de aplicação de replicação de monitoramento

Em uma replica multithread, as tabelas do Schema de desempenho `replication_applier_status_by_coordinator` e `replication_applier_status_by_worker` mostram informações de status para os threads do coordenador da replica e, respectivamente, os threads do trabalhador do aplicador. Para uma replica com vários canais, os threads de cada canal são identificados.

O thread de coordenação de uma replica multithread também imprime estatísticas no log de erro da replica regularmente, se a configuração de verbosidade estiver definida para exibir mensagens informativas. As estatísticas são impressas dependendo do volume de eventos que o thread de coordenação atribuiu aos threads de trabalhador do aplicável, com uma frequência máxima de uma vez a cada 120 segundos. A mensagem lista as seguintes estatísticas para o canal de replicação relevante, ou o canal de replicação padrão (que não é nomeado):

Segundos decorridos: A diferença em segundos entre a hora atual e a última vez que essas informações foram impressas no log de erro.

Eventos atribuídos: O número total de eventos que o thread do coordenador colocou em fila para todos os threads do trabalhador aplicável desde que o thread do coordenador foi iniciado.

As filas de trabalhadores estão cheias acima do nível de sobreposição: O número atual de eventos que estão em fila em qualquer um dos threads de trabalhadores do aplicador, em excesso do nível de sobreposição, que é definido em 90% do comprimento máximo da fila de 16.384 eventos. Se esse valor for zero, nenhum thread de trabalhadores do aplicador está operando no limite superior de sua capacidade.

Esperou devido à fila de trabalhadores cheia:   O número de vezes que o thread de coordenação teve que esperar para agendar um evento porque a fila de um thread de trabalhador aplicando estava cheia. Se esse valor for zero, nenhum thread de trabalhador aplicando esgotou sua capacidade.

Esperou devido ao tamanho total:   O número de vezes que o thread do coordenador teve que esperar para agendar um evento porque o limite `slave_pending_jobs_size_max` havia sido atingido. Esta variável do sistema define a quantidade máxima de memória (em bytes) disponível para as filas de threads de trabalhador do aplicador que retêm eventos ainda não aplicados. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads de trabalhador do aplicador tenham filas vazias, e então processada. Todas as transações subsequentes são suspensas até que a grande transação tenha sido concluída.

Esperou em conflitos de relógio:   O número de nanosegundos que o thread do coordenador teve que esperar para agendar um evento porque uma transação da qual o evento dependia ainda não havia sido comprometida. Se `slave_parallel_type` está definido como `DATABASE` (em vez de `LOGICAL_CLOCK`), esse valor é sempre zero.

Esperou (contar) quando os trabalhadores estavam ocupados: O número de vezes que o thread de coordenador dormiu por um curto período, o que ele poderia fazer em duas situações. A primeira situação é quando o thread de coordenador atribui um evento e descobre que a fila do thread de trabalhador aplicante está cheia além do nível de não-derramamento de 10% do comprimento máximo da fila, nesse caso, ele dorme por um máximo de 1 milissegundo. A segunda situação é quando `slave_parallel_type` está definido como `LOGICAL_CLOCK` e o thread de coordenador precisa atribuir o primeiro evento de uma transação para a fila de um thread de trabalhador aplicante, ele só faz isso com um trabalhador com uma fila vazia, então, se nenhuma fila estiver vazia, o thread de coordenador dorme até que uma fique vazia.

Esperou quando os trabalhadores ocuparam: O número de nanosegundos que o thread de coordenação dormiu enquanto aguardava uma fila de trabalhadores de aplicação de aplicativo vazia (ou seja, na segunda situação descrita acima, onde `slave_parallel_type` é definido como `LOGICAL_CLOCK` e o primeiro evento de uma transação precisa ser atribuído).

### 16.2.4 Repositórios de metadados do log e replicação de relé

Um servidor de replicação cria vários repositórios de informações para uso no processo de replicação:

* O *registro de relé*, que é escrito pela thread de I/O de replicação, contém as transações lidas do log binário do servidor de origem de replicação. As transações no registro de relé são aplicadas na replica pela thread SQL de replicação. Para informações sobre o registro de relé, consulte a Seção 16.2.4.1, “O Registro de Relé”.

* O repositório de metadados de conexão da réplica contém informações que a thread de I/O de replicação precisa para se conectar ao servidor de origem da replicação e recuperar transações do log binário da fonte. O repositório de metadados de conexão é escrito na tabela `mysql.slave_master_info` ou em um arquivo.

* O repositório de metadados do aplicador *applier* contém informações que o thread de SQL de replicação precisa ler e aplicar transações do log de relevo da réplica. O repositório de metadados do aplicador é escrito na tabela `mysql.slave_relay_log_info` ou em um arquivo.

O repositório de metadados de conexão e o repositório de metadados do aplicativo são conhecidos coletivamente como repositórios de metadados de replicação. Para informações sobre esses, consulte a Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

**Tornando a replicação resistente a interrupções inesperadas.** As tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o mecanismo de armazenamento transacional `InnoDB`. As atualizações no repositório de metadados do aplicável da replica são comprometidas juntamente com as transações, o que significa que as informações de progresso da replica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma interrupção inesperada do servidor. Para informações sobre a combinação de configurações na replica que é mais resistente a interrupções inesperadas, consulte a Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Replica”.

#### 16.2.4.1 O Log de Relé

O registro de relé, assim como o registro binário, consiste em um conjunto de arquivos numerados que contêm eventos que descrevem as alterações no banco de dados, e um arquivo de índice que contém os nomes de todos os arquivos de registro de relé utilizados.

O termo "arquivo de registro de relé" geralmente denota um arquivo numerado individual que contém eventos de banco de dados. O termo "registro de relé" coletivamente denota o conjunto de arquivos de registro de relé numerados, além do arquivo de índice.

Os arquivos de registro de relé têm o mesmo formato que os arquivos de registro binários e podem ser lidos usando **mysqlbinlog** (consulte Seção 4.6.7, “mysqlbinlog — Utilitário para processamento de arquivos de registro binários”).

Por padrão, os nomes dos arquivos de registro de releio têm a forma `host_name-relay-bin.nnnnnn` no diretório de dados, onde *`host_name`* é o nome do host do servidor de replicação e *`nnnnnn`* é um número de sequência. Os arquivos de registro de releio sucessivos são criados usando números de sequência sucessivos, começando com `000001`. A replica usa um arquivo de índice para rastrear os arquivos de registro de releio atualmente em uso. O nome padrão do arquivo de índice de registro de releio é `host_name-relay-bin.index` no diretório de dados.

Os nomes dos arquivos de registro de releio padrão e do índice de registro de releio podem ser substituídos, respectivamente, pelas variáveis de sistema `relay_log` e `relay_log_index` (consulte a Seção 16.1.6, “Opções e variáveis de registro binário e replicação”).

Se uma réplica usar os nomes padrão de arquivo de registro de retransmissão baseado em host, alterar o nome do host de uma réplica após a configuração da replicação pode causar o fracasso da replicação com os erros "Não foi possível abrir o registro de retransmissão" e "Não foi possível encontrar o log de destino durante a inicialização do registro de retransmissão". Esse é um problema conhecido (consulte o Bug #2122). Se você antecipar que o nome do host de uma réplica pode mudar no futuro (por exemplo, se a rede for configurada na réplica de forma que seu nome de host possa ser modificado usando DHCP), você pode evitar esse problema completamente usando as variáveis de sistema `relay_log` e `relay_log_index` para especificar nomes de arquivos de registro de retransmissão explicitamente quando configurar a réplica inicialmente. Isso torna os nomes independentes das mudanças no nome do host do servidor.

Se você encontrar o problema depois que a replicação já começou, uma maneira de contornar isso é parar o servidor de replicação, prependicar o conteúdo do arquivo de índice do log do relé antigo ao novo e, em seguida, reiniciar a replicação. Em um sistema Unix, isso pode ser feito conforme mostrado aqui:

```sql
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

Um servidor replicador cria um novo arquivo de registro de retransmissão nas seguintes condições:

* Toda vez que a thread de I/O de replicação é iniciada. * Quando os logs são limpos (por exemplo, com `FLUSH LOGS` ou **mysqladmin flush-logs**).

* Quando o tamanho do arquivo de registro do relé atual se torna muito grande, determinado da seguinte forma:

+ Se o valor de `max_relay_log_size` for maior que 0, isso é o tamanho máximo do arquivo de registro do relé.

+ Se o valor de `max_relay_log_size` for 0, `max_binlog_size` determina o tamanho máximo do arquivo de registro do relé.

O thread de SQL de replicação exclui automaticamente cada arquivo de registro do relé após executar todos os eventos no arquivo e não precisar mais dele. Não há um mecanismo explícito para excluir logs de relé, porque o thread de SQL de replicação cuida disso. No entanto, `FLUSH LOGS` rola logs de relé, o que influencia quando o thread de SQL de replicação os exclui.

#### 16.2.4.2 Repositórios de metadados de replicação

Um servidor de replicação cria dois repositórios de metadados de replicação, o repositório de metadados de conexão e o repositório de metadados do aplicável. Os repositórios de metadados de replicação sobrevivem ao desligamento de um servidor de replicação. Se a replicação com base na posição do arquivo de registro binário estiver em uso, quando a replicação for reiniciada, ela lê os dois repositórios para determinar até onde ela havia progredido anteriormente na leitura do registro binário da fonte e no processamento de seu próprio registro de relevo. Se a replicação com base no GTID estiver em uso, a replicação não usa os repositórios de metadados de replicação para esse propósito, mas precisa deles para o outro metadados que eles contêm.

* O repositório de metadados de conexão da réplica contém informações que a thread de I/O de replicação precisa para se conectar ao servidor de origem da replicação e recuperar transações do log binário da fonte. Os metadados neste repositório incluem a configuração de conexão, os detalhes da conta de usuário de replicação, as configurações SSL para a conexão e o nome do arquivo e a posição onde a thread de I/O de replicação está atualmente lendo do log binário da fonte.

* O repositório de metadados do *aplicativo* da réplica contém informações que o thread de SQL de replicação precisa ler e aplicar transações do log de relevo da réplica. Os metadados neste repositório incluem o nome do arquivo e a posição até a qual o thread de SQL de replicação executou as transações no log de relevo, e a posição equivalente no log binário da fonte. Também inclui metadados para o processo de aplicação de transações, como o número de threads de trabalho.

Por padrão, os repositórios de metadados de replicação são criados como arquivos no diretório de dados com os nomes `master.info` e `relay-log.info`, ou com nomes e locais alternativos especificados pela opção `--master-info-file` e pela variável de sistema `relay_log_info_file`. Para criar os repositórios de metadados de replicação como tabelas, especifique `master_info_repository=TABLE` e `relay_log_info_repository=TABLE` na inicialização do servidor. Nesse caso, o repositório de metadados de conexão da replica é escrito na tabela `slave_master_info` no esquema do sistema `mysql`, e o repositório de metadados do aplicável da replica é escrito na tabela `slave_relay_log_info` no esquema do sistema `mysql`. Uma mensagem de aviso é emitida se `mysqld` não conseguir inicializar as tabelas para os repositórios de metadados de replicação, mas a replica é permitida para continuar iniciando. Essa situação provavelmente ocorrerá quando se está atualizando de uma versão do MySQL que não suporta o uso de tabelas para os repositórios para uma em que eles são suportados.

Importante

1. Não tente atualizar ou inserir strings nas tabelas `mysql.slave_master_info` ou `mysql.slave_relay_log_info` manualmente. Fazer isso pode causar comportamento indefinido e não é suportado. A execução de qualquer declaração que exija um bloqueio de escrita em uma das tabelas `slave_master_info` ou `slave_relay_log_info` ou em ambas é desaconselhada enquanto a replicação estiver em andamento (embora declarações que realizam apenas leituras sejam permitidas a qualquer momento).

2. O acesso ao arquivo ou tabela do repositório de metadados de conexão da réplica deve ser restrito ao administrador do banco de dados, pois ele contém o nome da conta de usuário de replicação e a senha para se conectar à fonte. Use um modo de acesso restrito para proteger os backups do banco de dados que incluem esse repositório.

`RESET SLAVE` limpa os dados nos repositórios de metadados de replicação, com exceção dos parâmetros de conexão de replicação (dependendo da versão do MySQL Server e do tipo de repositório). Para detalhes, consulte a descrição para `RESET SLAVE`.

Se você definir `master_info_repository` e `relay_log_info_repository` para `TABLE`, as tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` são criadas usando o motor de armazenamento transacional `InnoDB`. As atualizações no repositório de metadados do aplicável da réplica são comprometidas juntamente com as transações, o que significa que as informações de progresso da réplica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma parada inesperada do servidor. A opção `--relay-log-recovery` deve ser habilitada na réplica para garantir resiliência. Para mais detalhes, consulte a Seção 16.3.2, “Tratamento de uma Parada Inesperada de uma Réplica”.

Quando você faz o backup dos dados da réplica ou transfere um instantâneo de seus dados para criar uma nova réplica, certifique-se de incluir as tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` que contêm os repositórios de metadados de replicação, ou os arquivos equivalentes (`master.info` e `relay-log.info` no diretório de dados, a menos que você tenha especificado nomes e locais alternativos). Quando a replicação com base na posição do arquivo de registro binário está em uso, os repositórios de metadados de replicação são necessários para retomar a replicação após o reinício da réplica restaurada ou copiada. Se você não tiver os arquivos de registro de relevo, mas ainda tiver o repositório de metadados do aplicável da réplica, você pode verificá-lo para determinar até que ponto o thread SQL de replicação já foi executado no registro binário da fonte. Em seguida, você pode usar uma declaração `CHANGE MASTER TO` com as opções `MASTER_LOG_FILE` e `MASTER_LOG_POS` para dizer à réplica para reler os registros binários da fonte a partir desse ponto (desde que os registros binários necessários ainda existam na fonte).

Um repositório adicional, o repositório de metadados do trabalhador aplicável, é criado principalmente para uso interno e contém informações de status sobre os threads do trabalhador em uma replica multithread. O repositório de metadados do trabalhador aplicável inclui os nomes e posições do arquivo de registro de releio e o arquivo de registro binário da fonte para cada thread do trabalhador. Se o repositório de metadados do aplicável da replica for criado como uma tabela, que é o padrão, o repositório de metadados do trabalhador aplicável é escrito na tabela `mysql.slave_worker_info`. Se o repositório de metadados do aplicável for escrito em um arquivo, o repositório de metadados do trabalhador aplicável é escrito no arquivo `worker-relay-log.info`. Para uso externo, as informações de status para os threads do trabalhador são apresentadas na tabela do Schema de Desempenho `replication_applier_status_by_worker`.

Os repositórios de metadados de replicação originalmente continham informações semelhantes às mostradas na saída da declaração `SHOW SLAVE STATUS`, que é discutida na Seção 13.4.2, “Declarações SQL para controle de servidores de replicação”. Posteriormente, foram adicionadas informações adicionais aos repositórios de metadados de replicação que não são exibidas pela declaração `SHOW SLAVE STATUS`.

Para o repositório de metadados de conexão, a tabela a seguir mostra a correspondência entre as colunas da tabela `mysql.slave_master_info`, as colunas exibidas por `SHOW SLAVE STATUS` e as strings no arquivo `master.info`.

<table summary="The correspondence between the lines in the master.info file, the columns in the mysql.slave_master_info table, and the columns displayed by SHOW SLAVE STATUS."><col style="width: 16%"/><col style="width: 31%"/><col style="width: 40%"/><col style="width: 18%"/><thead><tr> <th><code>master.info</code>String de arquivo</th> <th><code>slave_master_info</code>Coluna da tabela</th> <th><code>SHOW SLAVE STATUS</code>Coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>1</th> <td><code>Number_of_lines</code></td> <td>[None]</td> <td>Number of lines in the file, or columns in the table</td> </tr><tr> <th>2</th> <td><code>Master_log_name</code></td> <td><code>Master_Log_File</code></td> <td>The name of the binary log currently being read from the source</td> </tr><tr> <th>3</th> <td><code>Master_log_pos</code></td> <td><code>Read_Master_Log_Pos</code></td> <td>The current position within the binary log that has been read from the source</td> </tr><tr> <th>4</th> <td><code>Host</code></td> <td><code>Master_Host</code></td> <td>The host name of the source server</td> </tr><tr> <th>5</th> <td><code>User_name</code></td> <td><code>Master_User</code></td> <td>The replication user name used to connect to the source</td> </tr><tr> <th>6</th> <td><code>User_password</code></td> <td>Senha (não mostrada por<code>SHOW SLAVE STATUS</code>)</td> <td>A senha usada para se conectar à fonte</td> </tr><tr> <th>7</th> <td><code>Port</code></td> <td><code>Master_Port</code></td> <td>The network port used to connect to the source</td> </tr><tr> <th>8</th> <td><code>Connect_retry</code></td> <td><code>Connect_Retry</code></td> <td>The period (in seconds) that the replica waits before trying to reconnect to the source</td> </tr><tr> <th>9</th> <td><code>Enabled_ssl</code></td> <td><code>Master_SSL_Allowed</code></td> <td>Indicates whether the server supports SSL connections</td> </tr><tr> <th>10</th> <td><code>Ssl_ca</code></td> <td><code>Master_SSL_CA_File</code></td> <td>The file used for the Certificate Authority (CA) certificate</td> </tr><tr> <th>11</th> <td><code>Ssl_capath</code></td> <td><code>Master_SSL_CA_Path</code></td> <td>The path to the Certificate Authority (CA) certificates</td> </tr><tr> <th>12</th> <td><code>Ssl_cert</code></td> <td><code>Master_SSL_Cert</code></td> <td>The name of the SSL certificate file</td> </tr><tr> <th>13</th> <td><code>Ssl_cipher</code></td> <td><code>Master_SSL_Cipher</code></td> <td>The list of possible ciphers used in the handshake for the SSL connection</td> </tr><tr> <th>14</th> <td><code>Ssl_key</code></td> <td><code>Master_SSL_Key</code></td> <td>The name of the SSL key file</td> </tr><tr> <th>15</th> <td><code>Ssl_verify_server_cert</code></td> <td><code>Master_SSL_Verify_Server_Cert</code></td> <td>Whether to verify the server certificate</td> </tr><tr> <th>16</th> <td><code>Heartbeat</code></td> <td>[None]</td> <td>Interval between replication heartbeats, in seconds</td> </tr><tr> <th>17</th> <td><code>Bind</code></td> <td><code>Master_Bind</code></td> <td>Which of the replica's network interfaces should be used for connecting to the source</td> </tr><tr> <th>18</th> <td><code>Ignored_server_ids</code></td> <td><code>Replicate_Ignore_Server_Ids</code></td> <td>The list of server IDs to be ignored. Note that for <code>Ignored_server_ids</code> the list of server IDs is preceded by the total number of server IDs to ignore.</td> </tr><tr> <th>19</th> <td><code>Uuid</code></td> <td><code>Master_UUID</code></td> <td>The source's unique ID</td> </tr><tr> <th>20</th> <td><code>Retry_count</code></td> <td><code>Master_Retry_Count</code></td> <td>Maximum number of reconnection attempts permitted</td> </tr><tr> <th>21</th> <td><code>Ssl_crl</code></td> <td>[None]</td> <td>Path to an SSL certificate revocation-list file</td> </tr><tr> <th>22</th> <td><code>Ssl_crlpath</code></td> <td>[None]</td> <td>Path to a directory containing SSL certificate revocation-list files</td> </tr><tr> <th>23</th> <td><code>Enabled_auto_position</code></td> <td><code>Auto_position</code></td> <td>If autopositioning is in use or not</td> </tr><tr> <th>24</th> <td><code>Channel_name</code></td> <td><code>Channel_name</code></td> <td>The name of the replication channel</td> </tr><tr> <th>25</th> <td><code>Tls_version</code></td> <td><code>Master_TLS_Version</code></td> <td>TLS version on source</td> </tr></tbody></table>

Para o repositório de metadados do aplicativo, a tabela a seguir mostra a correspondência entre as colunas da tabela `mysql.slave_relay_log_info`, as colunas exibidas pelo `SHOW SLAVE STATUS` e as strings no arquivo `relay-log.info`.

<table summary="The correspondence between the lines in the relay-log.info file, the columns in the mysql.slave_relay_log_info table, and the columns displayed by SHOW SLAVE STATUS."><col style="width: 15%"/><col style="width: 30%"/><col style="width: 40%"/><col style="width: 20%"/><thead><tr> <th>String em<code>relay-log.info</code></th> <th><code>slave_relay_log_info</code>Coluna da tabela</th> <th><code>SHOW SLAVE STATUS</code>Coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>1</th> <td><code>Number_of_lines</code></td> <td>[None]</td> <td>Number of lines in the file or columns in the table</td> </tr><tr> <th>2</th> <td><code>Relay_log_name</code></td> <td><code>Relay_Log_File</code></td> <td>The name of the current relay log file</td> </tr><tr> <th>3</th> <td><code>Relay_log_pos</code></td> <td><code>Relay_Log_Pos</code></td> <td>The current position within the relay log file; events up to this position have been executed on the replica database</td> </tr><tr> <th>4</th> <td><code>Master_log_name</code></td> <td><code>Relay_Master_Log_File</code></td> <td>The name of the source's binary log file from which the events in the relay log file were read</td> </tr><tr> <th>5</th> <td><code>Master_log_pos</code></td> <td><code>Exec_Master_Log_Pos</code></td> <td>The equivalent position within the source's binary log file of events that have already been executed</td> </tr><tr> <th>6</th> <td><code>Sql_delay</code></td> <td><code>SQL_Delay</code></td> <td>The number of seconds that the replica must lag the source</td> </tr><tr> <th>7</th> <td><code>Number_of_workers</code></td> <td>[None]</td> <td>The number of worker threads on the replica for executing replication events (transactions) in parallel</td> </tr><tr> <th>8</th> <td><code>Id</code></td> <td>[None]</td> <td>ID used for internal purposes; currently this is always 1</td> </tr><tr> <th>9</th> <td><code>Channel_name</code></td> <td>Channel_name</td> <td>The name of the replication channel</td> </tr></tbody></table>

Em versões do MySQL anteriores ao MySQL 5.6, o arquivo `relay-log.info` não inclui uma contagem de strings ou um valor de atraso (e a tabela `slave_relay_log_info` não está disponível).

<table summary="The correspondence between lines in the relay-log.info file and items that appear in the Status column."><col style="width: 15%"/><col style="width: 35%"/><col style="width: 50%"/><thead><tr> <th>Line</th> <th>Status Column</th> <th>Description</th> </tr></thead><tbody><tr> <th>1</th> <td><code>Relay_Log_File</code></td> <td>O nome do arquivo de registro atual do relé</td> </tr><tr> <th>2</th> <td><code>Relay_Log_Pos</code></td> <td>A posição atual dentro do arquivo de registro do relé; os eventos até essa posição foram executados no banco de dados replica.</td> </tr><tr> <th>3</th> <td><code>Relay_Master_Log_File</code></td> <td>O nome do arquivo de registro binário da fonte a partir do qual os eventos no arquivo de registro do relé foram lidos</td> </tr><tr> <th>4</th> <td><code>Exec_Master_Log_Pos</code></td> <td>A posição equivalente dentro do arquivo de registro binário da fonte de eventos que já foram executados</td> </tr></tbody></table>

Nota

Se você desfazer uma réplica do servidor para uma versão mais antiga do MySQL 5.6, o servidor mais antigo não lê o arquivo `relay-log.info` corretamente. Para resolver isso, modifique o arquivo em um editor de texto, excluindo a string inicial que contém o número de strings.

Os conteúdos do arquivo `relay-log.info` e os estados mostrados pela declaração `SHOW SLAVE STATUS` podem não corresponder se o arquivo `relay-log.info` não tiver sido descarregado no disco. Idealmente, você deve visualizar apenas `relay-log.info` em uma replica que esteja offline (ou seja, `mysqld` não esteja em execução). Para um sistema em execução, você pode usar `SHOW SLAVE STATUS`, ou consultar as tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` se você estiver escrevendo os repositórios de metadados de replicação em tabelas.

### 16.2.5 Como os servidores avaliam as regras de filtragem de replicação

Se um servidor de fonte de replicação não escrever uma declaração em seu log binário, a declaração não é replicada. Se o servidor registra a declaração, a declaração é enviada para todas as réplicas e cada réplica determina se deve executá-la ou ignorá-la.

Na fonte, você pode controlar quais bancos de dados devem ser registrados para alterações usando as opções `--binlog-do-db` e `--binlog-ignore-db` para controlar o registro binário. Para uma descrição das regras que os servidores usam na avaliação dessas opções, consulte a Seção 16.2.5.1, “Avaliação das opções de replicação e registro binário em nível de banco de dados”. Você não deve usar essas opções para controlar quais bancos de dados e tabelas são replicados. Em vez disso, use o filtro na replica para controlar os eventos que são executados na replica.

Quanto à replica, as decisões sobre a execução ou ignorar declarações recebidas da fonte são tomadas de acordo com as opções do `--replicate-*` com as quais a replica foi iniciada. (Veja a Seção 16.1.6, “Opções e Variáveis de Replicação e Registro Binário”). Os filtros regidos por essas opções também podem ser definidos dinamicamente usando a declaração `CHANGE REPLICATION FILTER`. As regras que regem tais filtros são as mesmas, independentemente de serem criadas no início usando as opções `--replicate-*` ou enquanto o servidor de replica está em execução por `CHANGE REPLICATION FILTER`. Note que os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

No caso mais simples, quando não há opções de `--replicate-*`, a replica executa todas as instruções que recebe da fonte. Caso contrário, o resultado depende das opções específicas fornecidas.

As opções de nível de banco de dados (`--replicate-do-db`, `--replicate-ignore-db`) são verificadas primeiro; consulte a Seção 16.2.5.1, “Avaliação das opções de replicação e registro binário de nível de banco de dados”, para uma descrição desse processo. Se nenhuma opção de nível de banco de dados for usada, a verificação das opções prossegue para quaisquer opções de nível de tabela que possam estar em uso (consulte a Seção 16.2.5.2, “Avaliação das opções de replicação de nível de tabela”, para uma discussão sobre essas opções). Se uma ou mais opções de nível de banco de dados forem usadas, mas nenhuma for correspondida, a declaração não será replicada.

Para declarações que afetam apenas bancos de dados (ou seja, `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`, as opções de nível de banco de dados sempre têm precedência sobre quaisquer opções de `--replicate-wild-do-table`. Em outras palavras, para tais declarações, as opções de `--replicate-wild-do-table` são verificadas se e somente se não houver opções de nível de banco de dados que se apliquem. Esta é uma mudança de comportamento em relação às versões anteriores do MySQL, onde a declaração `CREATE DATABASE dbx` não era replicada se a replica tivesse sido iniciada com `--replicate-do-db=dbx` `--replicate-wild-do-table=db%.t1`. (Bug #46110)

Para facilitar a determinação do efeito de um conjunto de opções, é recomendável evitar misturar opções "do" e "ignore" ou opções com e sem asterisco.

Se houver sido especificada alguma opção do `--replicate-rewrite-db`, elas são aplicadas antes de as regras de filtragem do `--replicate-*` serem testadas.

Nota

Todas as opções de filtragem de replicação seguem as mesmas regras de sensibilidade de caso que se aplicam aos nomes de bancos de dados e tabelas em outros lugares no servidor MySQL, incluindo os efeitos da variável de sistema `lower_case_table_names`.

#### 16.2.5.1 Avaliação das opções de replicação e registro binário em nível de banco de dados

Ao avaliar as opções de replicação, a replicação começa verificando se existem quaisquer opções de `--replicate-do-db` ou `--replicate-ignore-db` que se aplicam. Ao usar `--binlog-do-db` ou `--binlog-ignore-db`, o processo é semelhante, mas as opções são verificadas na fonte.

O banco de dados que é verificado para uma correspondência depende do formato do log binário da declaração que está sendo tratada. Se a declaração tiver sido registrada usando o formato de string, o banco de dados onde os dados devem ser alterados é o banco de dados que é verificado. Se a declaração tiver sido registrada usando o formato de declaração, o banco de dados padrão (especificado com uma declaração `USE`) é o banco de dados que é verificado.

Nota

Somente as declarações DML podem ser registradas usando o formato de string. As declarações DDL são sempre registradas como declarações, mesmo quando `binlog_format=ROW`. Portanto, todas as declarações DDL são sempre filtradas de acordo com as regras para replicação baseada em declarações. Isso significa que você deve selecionar o banco de dados padrão explicitamente com uma declaração `USE` para que uma declaração DDL seja aplicada.

Para a replicação, os passos envolvidos estão listados aqui:

1. Qual é o formato de registro utilizado?

* **DECLARAÇÃO.** Teste o banco de dados padrão.

* **ROW.** Teste o banco de dados afetado pelas mudanças.

2. Há alguma opção de `--replicate-do-db`?

* **Sim.** O banco de dados corresponde a algum deles?

+ **Sim.** Continue para o Passo 4.

+ **Não.** Ignore a atualização e saia.

* **Não.** Continue para o passo 3.

3. Há alguma opção de `--replicate-ignore-db`?

* **Sim.** O banco de dados corresponde a algum deles?

+ **Sim.** Ignore a atualização e saia.

+ **Não.** Continue para o passo 4.

* **Não.** Continue para o passo 4.

4. Prossiga para verificar as opções de replicação de nível de tabela, se houver alguma. Para uma descrição de como essas opções são verificadas, consulte a Seção 16.2.5.2, “Avaliação das opções de replicação de nível de tabela”.

Importante

Uma declaração que ainda é permitida nesta fase não está sendo executada. A declaração não é executada até que todas as opções de nível de tabela (se houver) também tenham sido verificadas, e o resultado desse processo permita a execução da declaração.

Para o registro binário, os passos envolvidos estão listados aqui:

1. Há alguma opção de `--binlog-do-db` ou `--binlog-ignore-db`?

* **Sim.** Continue para o passo 2.

* **Não.** Registre a declaração e saia.

2. Há um banco de dados padrão (foi selecionado algum banco de dados por `USE`)?

* **Sim.** Continue para o passo 3.

* **Não.** Ignore a declaração e saia.

3. Há um banco de dados padrão. Há alguma opção de `--binlog-do-db`?

* **Sim.** Alguma delas correspondem ao banco de dados?

+ **Sim.** Registre a declaração e saia.

+ **Não.** Ignore a declaração e saia.

* **Não.** Continue para o passo 4.

4. Algumas das opções de `--binlog-ignore-db` correspondem ao banco de dados?

* **Sim.** Ignore a declaração e saia.

* **Não.** Registre a declaração e saia.

Importante

Para o registro baseado em declarações, uma exceção é feita nas regras fornecidas apenas para as declarações `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. Nesses casos, o banco de dados que está sendo *criado, alterado ou descartado* substitui o banco de dados padrão ao determinar se deve registrar ou ignorar as atualizações.

`--binlog-do-db` pode, às vezes, significar “ignorar outros bancos de dados”. Por exemplo, ao usar o registro baseado em declarações, um servidor que funciona apenas com `--binlog-do-db=sales` não escreve as declarações do registro binário para as quais o banco de dados padrão difere de `sales`. Ao usar o registro baseado em strings com a mesma opção, o servidor registra apenas as atualizações que alteram dados em `sales`.

#### 16.2.5.2 Avaliação das Opções de Replicação de Nível de Tabela

A replica verifica e avalia as opções de tabela apenas se uma das duas condições a seguir for verdadeira:

* Não foram encontradas opções de banco de dados correspondentes. * Foram encontradas uma ou mais opções de banco de dados e avaliadas para chegar a uma condição de "executar" de acordo com as regras descritas na seção anterior (ver Seção 16.2.5.1, "Avaliação das opções de replicação e registro binário de nível de banco de dados").

Primeiro, como uma condição preliminar, a replica verifica se a replicação baseada em declarações está habilitada. Se sim, e a declaração ocorre dentro de uma função armazenada, a replica executa a declaração e sai. Se a replicação baseada em strings está habilitada, a replica não sabe se uma declaração ocorreu dentro de uma função armazenada na fonte, então essa condição não se aplica.

Nota

Para a replicação baseada em declarações, os eventos de replicação representam declarações (todas as alterações que compõem um determinado evento estão associadas a uma única declaração SQL); para a replicação baseada em strings, cada evento representa uma alteração em uma única string de tabela (assim, uma única declaração, como `UPDATE mytable SET mycol = 1`, pode gerar muitos eventos baseados em strings). Quando analisada em termos de eventos, o processo de verificação das opções da tabela é o mesmo para a replicação baseada em strings e baseada em declarações.

Chegando a este ponto, se não houver opções de tabela, a replica simplesmente executa todos os eventos. Se houver quaisquer opções `--replicate-do-table` ou `--replicate-wild-do-table`, o evento deve corresponder a uma dessas opções se quiser ser executado; caso contrário, é ignorado. Se houver quaisquer opções `--replicate-ignore-table` ou `--replicate-wild-ignore-table`, todos os eventos são executados, exceto aqueles que correspondem a qualquer uma dessas opções.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de curinga.

Os passos a seguir descrevem essa avaliação com mais detalhes. O ponto de partida é o final da avaliação das opções de nível de banco de dados, conforme descrito na Seção 16.2.5.1, “Avaliação das opções de replicação de nível de banco de dados e registro binário”.

1. Há alguma opção de replicação de tabela?

* **Sim.** Continue para o passo 2.

* **Não.** Execute a atualização e saia.

2. Qual é o formato de registro utilizado?

* **DECLARAÇÃO.** Realize os passos restantes para cada declaração que realiza uma atualização.

* **LINHA.** Realize os passos restantes para cada atualização de uma string de tabela.

3. Há alguma opção de `--replicate-do-table`?

* **Sim.** A mesa combina com alguma delas?

+ **Sim.** Execute a atualização e saia.

+ **Não.** Continue para o passo 4.

* **Não.** Continue para o passo 4.

4. Há alguma opção de `--replicate-ignore-table`?

* **Sim.** A mesa combina com alguma delas?

+ **Sim.** Ignore a atualização e saia.

+ **Não.** Continue para o passo 5.

* **Não.** Continue para o passo 5.

5. Há alguma opção do `--replicate-wild-do-table`?

* **Sim.** A mesa combina com alguma delas?

+ **Sim.** Execute a atualização e saia.

+ **Não.** Continue para o passo 6.

* **Não.** Continue para o passo 6.

6. Há alguma opção de `--replicate-wild-ignore-table`?

* **Sim.** A mesa combina com alguma delas?

+ **Sim.** Ignore a atualização e saia.

+ **Não.** Continue até o passo 7.

* **Não.** Continue até o passo 7.

7. Há outra mesa que precisa ser testada?

* **Sim.** Volte para o passo 3.

* **Não.** Continue até o passo 8.

8. Há alguma opção de `--replicate-do-table` ou `--replicate-wild-do-table`?

* **Sim.** Ignore a atualização e saia.

* **Não.** Execute a atualização e saia.

Nota

A replicação baseada em declarações é interrompida se uma única declaração SQL opera em uma tabela que é incluída por uma opção `--replicate-do-table` ou `--replicate-wild-do-table`, e em outra tabela que é ignorada por uma opção `--replicate-ignore-table` ou `--replicate-wild-ignore-table`. A replicação deve executar ou ignorar a declaração completa (que forma um evento de replicação), e não pode logicamente fazer isso. Isso também se aplica à replicação baseada em strings para declarações DDL, porque as declarações DDL são sempre registradas como declarações, sem considerar o formato de registro em vigor. O único tipo de declaração que pode atualizar uma tabela incluída e uma tabela ignorada e ainda ser replicada com sucesso é uma declaração DML que foi registrada com `binlog_format=ROW`.

#### 16.2.5.3 Interações entre as Opções de Filtragem de Replicação

Se você usar uma combinação de opções de filtragem de nível de banco de dados e nível de tabela, a replica primeiro aceita ou ignora eventos usando as opções do banco de dados, depois avalia todos os eventos permitidos por essas opções de acordo com as opções da tabela. Isso às vezes pode levar a resultados que parecem contraintuitivos. Também é importante notar que os resultados variam dependendo se a operação é registrada usando o formato de registro binário baseado em declaração ou baseado em string. Se você deseja ter certeza de que seus filtros de replicação sempre operam da mesma maneira, independentemente do formato de registro binário, o que é particularmente importante se você estiver usando um formato de registro binário misto, siga as orientações neste tópico.

O efeito das opções de filtragem de replicação difere entre os formatos de registro binário devido à maneira como o nome do banco de dados é identificado. Com o formato baseado em declaração, as declarações DML são manipuladas com base no banco de dados atual, conforme especificado pela declaração `USE`. Com o formato baseado em string, as declarações DML são manipuladas com base no banco de dados onde a tabela modificada existe. As declarações DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela declaração `USE`, independentemente do formato de registro binário.

Uma operação que envolve várias tabelas também pode ser afetada de maneira diferente pelas opções de filtragem de replicação, dependendo do formato de registro binário. As operações a serem observadas incluem transações que envolvem declarações multi-tabela `UPDATE`, gatilhos, chaves estrangeiras em cascata, funções armazenadas que atualizam várias tabelas e declarações DML que invocam funções armazenadas que atualizam uma ou mais tabelas. Se essas operações atualizarem tanto as tabelas filtradas quanto as tabelas filtradas, os resultados podem variar com o formato de registro binário.

Se você precisa garantir que seus filtros de replicação funcionem de forma consistente, independentemente do formato de registro binário, especialmente se você estiver usando um formato de registro binário misto (`binlog_format=MIXED`), use apenas opções de filtragem de replicação de nível de tabela e não use opções de filtragem de replicação de nível de banco de dados. Além disso, não use declarações de Múltipla Tabela de DML que atualizem as tabelas filtradas e as tabelas filtradas.

Se você precisar usar uma combinação de filtros de replicação de nível de banco de dados e de nível de tabela e quiser que esses operem o mais consistentemente possível, escolha uma das seguintes estratégias:

1. Se você usa o formato de registro binário baseado em string (`binlog_format=ROW`), para declarações de DDL, confie na declaração `USE` para definir o banco de dados e não especifique o nome do banco de dados. Você pode considerar a mudança para o formato de registro binário baseado em string para melhorar a consistência com o filtro de replicação. Consulte a Seção 5.4.4.2, “Definindo o Formato do Registro Binário”, para as condições que se aplicam à mudança do formato de registro binário.

2. Se você estiver usando o formato de registro binário baseado em declarações ou misto (`binlog_format=STATEMENT` ou `MIXED`), para tanto DML quanto DDL, confie na declaração `USE` e não use o nome do banco de dados. Além disso, não use DML de várias tabelas que atualizem tanto as tabelas filtradas quanto as tabelas filtradas.

**Exemplo 16.7 Uma opção `--replicate-ignore-db` e uma opção `--replicate-do-table`**

Sobre a fonte, as seguintes declarações são emitidas:

```sql
USE db1;
CREATE TABLE t2 LIKE t1;
INSERT INTO db2.t3 VALUES (1);
```

A réplica tem as seguintes opções de filtragem de replicação definidas:

```sql
replicate-ignore-db = db1
replicate-do-table = db2.t3
```

A declaração DDL `CREATE TABLE` cria a tabela em `db1`, conforme especificado pela declaração anterior `USE`. O filtro de replicação exclui essa declaração de acordo com sua opção `--replicate-ignore-db = db1`, porque `db1` é o banco de dados atual. Esse resultado é o mesmo, independentemente do formato de registro binário na fonte. No entanto, o resultado da declaração DML `INSERT` é diferente, dependendo do formato de registro binário:

* Se o formato de registro binário baseado em string estiver em uso na fonte (`binlog_format=ROW`), a replica avalia a operação `INSERT` usando o banco de dados onde a tabela existe, que é nomeado como `db2`. A opção de nível de banco de dados `--replicate-ignore-db = db1`, que é avaliada primeiro, portanto, não se aplica. A opção de nível de tabela `--replicate-do-table = db2.t3` se aplica, portanto, a replica aplica a mudança à tabela `t3`.

* Se o formato de registro binário baseado em declarações estiver em uso na fonte (`binlog_format=STATEMENT`), a replica avalia a operação `INSERT` usando o banco de dados padrão, que foi definido pela declaração `USE` para `db1` e não foi alterado. De acordo com sua opção de nível de banco de dados `--replicate-ignore-db = db1`, portanto, ignora a operação e não aplica a mudança à tabela `t3`. A opção de nível de tabela `--replicate-do-table = db2.t3` não é verificada, porque a declaração já correspondeu a uma opção de nível de banco de dados e foi ignorada.

Se a opção `--replicate-ignore-db = db1` na réplica for necessária e o uso do formato de registro binário baseado em declaração (ou misto) na fonte também for necessário, os resultados podem ser consistentes omitindo o nome do banco de dados da declaração `INSERT` e confiando em uma declaração `USE` em vez disso, conforme segue:

```sql
USE db1;
CREATE TABLE t2 LIKE t1;
USE db2;
INSERT INTO t3 VALUES (1);
```

Neste caso, a replica sempre avalia a declaração `INSERT` com base no banco de dados `db2`. Se a operação for registrada no formato binário baseado em declaração ou baseado em string, os resultados permanecem os mesmos.