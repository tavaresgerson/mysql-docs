#### 16.2.1.1 Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas

Cada formato de registro binário tem vantagens e desvantagens. Para a maioria dos usuários, o formato de replicação mista deve oferecer a melhor combinação de integridade de dados e desempenho. No entanto, se você quiser aproveitar as características específicas do formato de replicação baseado em declarações ou baseado em linhas ao realizar certas tarefas, você pode usar as informações nesta seção, que fornece um resumo de suas vantagens e desvantagens relativas, para determinar qual é a melhor para suas necessidades.

- [Vantagens da replicação baseada em declarações](replication-sbr-rbr.html#replication-sbr-rbr-sbr-vantagens)

- [Desvantagens da replicação baseada em declarações](replication-sbr-rbr.html#replication-sbr-rbr-sbr-desvantagens)

- [Vantagens da replicação baseada em linhas](replication-sbr-rbr.html#replication-sbr-rbr-rbr-advantages)

- [Desvantagens da replicação baseada em linhas](replication-sbr-rbr.html#replication-sbr-rbr-rbr-desvantagens)

##### Vantagens da replicação baseada em declarações

- Tecnologia comprovada.

- Menos dados escritos nos arquivos de registro. Quando as atualizações ou exclusões afetam muitas linhas, isso resulta em *muito* menos espaço de armazenamento necessário para os arquivos de registro. Isso também significa que a criação e restauração de backups podem ser realizadas mais rapidamente.

- Os arquivos de registro contêm todas as declarações que fizeram alterações, portanto, podem ser usados para auditar o banco de dados.

##### Desvantagens da replicação baseada em declarações

- **Declarações que não são seguras para SBR.** Nem todas as declarações que modificam dados (como as declarações `INSERT` (insert.html), `DELETE` (delete.html), `UPDATE` (update.html) e `REPLACE` (replace.html)) podem ser replicadas usando a replicação baseada em declarações. Qualquer comportamento não determinístico é difícil de replicar ao usar a replicação baseada em declarações. Exemplos de tais declarações do Data Modification Language (DML) incluem as seguintes:

  - Uma declaração que depende de uma função carregável ou de um programa armazenado que é não-determinístico, uma vez que o valor retornado por essa função ou programa armazenado depende de fatores além dos parâmetros fornecidos a ele. (A replicação baseada em linhas, no entanto, simplesmente replica o valor retornado pela função ou programa armazenado, portanto, seu efeito nas linhas e dados da tabela é o mesmo tanto na fonte quanto na replica). Consulte [Seção 16.4.1.16, “Replicação de Recursos Convocados”](replication-features-invoked.html) para obter mais informações.

  - As instruções [`DELETE`](delete.html) e [`UPDATE`](update.html) que usam uma cláusula `LIMIT` sem uma cláusula `ORDER BY` são não determinísticas. Veja [Seção 16.4.1.17, “Replicação e LIMIT”](replication-features-limit.html).

  - As funções carregáveis determinísticas devem ser aplicadas nas réplicas.

  - As declarações que utilizam qualquer uma das seguintes funções não podem ser replicadas corretamente usando a replicação baseada em declarações:

    - [`LOAD_FILE()`](string-functions.html#function_load-file)

    - [`UUID()`](https://pt.random.org/misc/functions.html#function_uuid), [`UUID_SHORT()`](https://pt.random.org/misc/functions.html#function_uuid-short)

    - [`USER()`](informação-funções.html#função_user)

    - [`FOUND_ROWS()`](https://pt.wikibooks.org/wiki/Funções_de_informação/Função_FOUND_ROWS)

    - [`SYSDATE()`](date-and-time-functions.html#function_sysdate) (a menos que tanto a fonte quanto a réplica sejam iniciadas com a opção [`--sysdate-is-now`](server-options.html#option_mysqld_sysdate-is-now)

    - [`GET_LOCK()`](locking-functions.html#function_get-lock)

    - [`IS_FREE_LOCK()`](https://www.arduino.cc/en/Reference/IsFreeLock)

    - [`IS_USED_LOCK()`](funções-de-bloqueio.html#função_is_used_lock)

    - [`MASTER_POS_WAIT()`](misc-functions.html#function_master-pos-wait)

    - [`RAND()`](https://pt.math-functions.com/pt/function_rand)

    - [`RELEASE_LOCK()`](locking-functions.html#function_release-lock)

    - [`SLEEP()`](misc_functions.html#function_sleep)

    - [`VERSÃO()`](information-functions.html#function_version)

    No entanto, todas as outras funções são replicadas corretamente usando a replicação baseada em instruções, incluindo [`NOW()`](date-and-time-functions.html#function_now) e assim por diante.

    Para obter mais informações, consulte [Seção 16.4.1.15, “Replicação e Funções do Sistema”](replication-features-functions.html).

  As declarações que não podem ser replicadas corretamente usando a replicação baseada em declarações são registradas com um aviso como o mostrado aqui:

  ```sql
  [Warning] Statement is not safe to log in statement format.
  ```

  Nesses casos, um aviso semelhante é emitido ao cliente. O cliente pode exibí-lo usando [`SHOW WARNINGS`](show-warnings.html).

- [`INSERT ... SELECT`](insert.html) requer um número maior de bloqueios em nível de linha do que com replicação baseada em linha.

- As declarações de [`UPDATE`](update.html) que exigem uma varredura da tabela (porque nenhum índice é usado na cláusula `WHERE`) devem bloquear um número maior de linhas do que com a replicação baseada em linhas.

- Para [`InnoDB`](innodb-storage-engine.html): Uma instrução [`INSERT`](insert.html) que usa `AUTO_INCREMENT` bloqueia outras instruções [`INSERT`](insert.html) que não estejam em conflito.

- Para declarações complexas, a declaração deve ser avaliada e executada na replica antes que as linhas sejam atualizadas ou inseridas. Com a replicação baseada em linhas, a replica só precisa modificar as linhas afetadas, não executar a declaração completa.

- Se houver um erro na avaliação da replica, especialmente ao executar instruções complexas, a replicação baseada em instruções pode aumentar lentamente a margem de erro nas linhas afetadas ao longo do tempo. Consulte [Seção 16.4.1.27, “Erros na Replicação Durante a Replicação”](replication-features-errors.html).

- As funções armazenadas são executadas com o mesmo valor de [`NOW()`](date-and-time-functions.html#function_now) que a instrução que as chama. No entanto, isso não é verdade para os procedimentos armazenados.

- As definições das tabelas devem ser (quase) idênticas na fonte e na réplica. Consulte [Seção 16.4.1.10, “Replicação com definições de tabelas diferentes na fonte e na réplica”](replication-features-differing-tables.html) para obter mais informações.

##### Vantagens da replicação baseada em linhas

- Todas as alterações podem ser replicadas. Esta é a forma mais segura de replicação.

  Nota

  As declarações que atualizam as informações no banco de dados do sistema `mysql`, como `GRANT` (grant.html), `REVOKE` (revoke.html) e a manipulação de gatilhos, rotinas armazenadas (incluindo procedimentos armazenados) e visualizações, são replicadas para réplicas usando a replicação baseada em declarações.

  Para declarações como [`CREATE TABLE ... SELECT`](create-table.html), uma declaração `CREATE` é gerada a partir da definição da tabela e replicada usando o formato baseado em declarações, enquanto as inserções de linhas são replicadas usando o formato baseado em linhas.

- São necessários menos bloqueios de linha na fonte, o que permite maior concorrência para os seguintes tipos de instruções:

  - [`INSERT ... SELECT`](insert-select.html)

  - `[`INSERT`](insert.html) declarações com `AUTO_INCREMENT\`

  - `[`UPDATE`](update.html) ou `[`DELETE`](delete.html) com cláusulas `WHERE` que não utilizam chaves ou não alteram a maioria das linhas examinadas.

- São necessários menos bloqueios de linha na replica para qualquer instrução de `[`INSERT`](insert.html), `[`UPDATE`](update.html) ou `[`DELETE\`]\(delete.html).

##### Desvantagens da replicação baseada em linhas

- O RBR pode gerar mais dados que precisam ser registrados. Para replicar uma instrução DML (como uma instrução [`UPDATE`](update.html) ou [`DELETE`](delete.html), a replicação baseada em instruções escreve apenas a instrução no log binário. Em contraste, a replicação baseada em linhas escreve cada linha alterada no log binário. Se a instrução alterar muitas linhas, a replicação baseada em linhas pode escrever significativamente mais dados no log binário; isso é verdadeiro mesmo para instruções que são revertidas. Isso também significa que fazer e restaurar um backup pode exigir mais tempo. Além disso, o log binário é bloqueado por um tempo mais longo para escrever os dados, o que pode causar problemas de concorrência. Use [`binlog_row_image=minimal`](replication-options-binary-log.html#sysvar_binlog_row_image) para reduzir a desvantagem consideravelmente.

- As funções carregáveis determinísticas que geram grandes valores de [`BLOB`](blob.html) levam mais tempo para ser replicadas com replicação baseada em linhas do que com replicação baseada em instruções. Isso ocorre porque o valor da coluna [`BLOB`](blob.html) é registrado, em vez de a instrução que gera os dados.

- Você não pode ver na réplica quais declarações foram recebidas da fonte e executadas. No entanto, você pode ver quais dados foram alterados usando [**mysqlbinlog**](mysqlbinlog.html) com as opções [`--base64-output=DECODE-ROWS`](mysqlbinlog.html#option_mysqlbinlog_base64-output) e [`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose).

  Alternativamente, use a variável [`binlog_rows_query_log_events`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_de_log_bin%C3%A1rio#sysvar_binlog_rows_query_log_events), que, se habilitada, adiciona um evento `Rows_query` com a saída do comando [**mysqlbinlog**](https://pt.wikipedia.org/wiki/mysqlbinlog) quando a opção `-vv` é usada.

- Para tabelas que utilizam o mecanismo de armazenamento [`MyISAM`](myisam-storage-engine.html), é necessário um bloqueio mais forte na replica para as instruções [`INSERT`](insert.html) quando elas são aplicadas como eventos baseados em linhas no log binário do que quando elas são aplicadas como instruções. Isso significa que as inserções concorrentes em tabelas de [`MyISAM`](myisam-storage-engine.html) não são suportadas ao usar a replicação baseada em linhas.
