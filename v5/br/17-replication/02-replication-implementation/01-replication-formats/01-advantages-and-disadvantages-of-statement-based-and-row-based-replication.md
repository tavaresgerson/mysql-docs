#### 16.2.1.1 Vantagens e Desvantagens da Replication Baseada em Statement e Baseada em Row

Cada formato de binary logging possui vantagens e desvantagens. Para a maioria dos usuários, o formato de Replication mista deve fornecer a melhor combinação de integridade de dados e performance. No entanto, se você deseja aproveitar os recursos específicos dos formatos de Replication baseada em Statement ou baseada em Row ao executar certas tarefas, você pode usar as informações desta seção, que fornece um resumo de suas vantagens e desvantagens relativas, para determinar qual é o melhor para suas necessidades.

* [Vantagens da Replication baseada em Statement](replication-sbr-rbr.html#replication-sbr-rbr-sbr-advantages "Vantagens da Replication baseada em Statement")

* [Desvantagens da Replication baseada em Statement](replication-sbr-rbr.html#replication-sbr-rbr-sbr-disadvantages "Desvantagens da Replication baseada em Statement")

* [Vantagens da Replication baseada em Row](replication-sbr-rbr.html#replication-sbr-rbr-rbr-advantages "Vantagens da Replication baseada em Row")

* [Desvantagens da Replication baseada em Row](replication-sbr-rbr.html#replication-sbr-rbr-rbr-disadvantages "Desvantagens da Replication baseada em Row")

##### Vantagens da Replication baseada em Statement

* Tecnologia comprovada.
* Menos dados gravados nos arquivos de log. Quando updates ou deletes afetam muitas rows, isso resulta em *muito* menos espaço de armazenamento necessário para os arquivos de log. Isso também significa que a realização e restauração de backups podem ser concluídas mais rapidamente.

* Os arquivos de log contêm todos os Statements que fizeram qualquer alteração, portanto, podem ser usados para auditar o Database.

##### Desvantagens da Replication baseada em Statement

* **Statements que não são seguros para SBR.** Nem todos os Statements que modificam dados (como [`INSERT`], [`DELETE`], [`UPDATE`] e [`REPLACE`]) podem ser replicados usando Replication baseada em Statement. Qualquer comportamento não determinístico é difícil de replicar ao usar Replication baseada em Statement. Exemplos de tais Statements DML (Data Modification Language) incluem o seguinte:

  + Um Statement que depende de uma função carregável ou stored program que é não determinístico, visto que o valor retornado por essa função ou stored program depende de fatores além dos parâmetros fornecidos a ele. (A Replication baseada em Row, no entanto, simplesmente replica o valor retornado pela função ou stored program, de modo que seu efeito nas rows da Table e nos dados seja o mesmo tanto na source quanto na replica.) Veja [Seção 16.4.1.16, “Replication de Recursos Invocados”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features"), para mais informações.

  + Statements [`DELETE`] e [`UPDATE`] que usam uma cláusula `LIMIT` sem um `ORDER BY` não são determinísticos. Veja [Seção 16.4.1.17, “Replication e LIMIT”](replication-features-limit.html "16.4.1.17 Replication and LIMIT").

  + Funções carregáveis determinísticas devem ser aplicadas nas replicas.

  + Statements que usam qualquer uma das seguintes funções não podem ser replicados corretamente usando Replication baseada em Statement:

    - [`LOAD_FILE()`](string-functions.html#function_load-file)
    - [`UUID()`](miscellaneous-functions.html#function_uuid), [`UUID_SHORT()`](miscellaneous-functions.html#function_uuid-short)

    - [`USER()`](information-functions.html#function_user)
    - [`FOUND_ROWS()`](information-functions.html#function_found-rows)
    - [`SYSDATE()`](date-and-time-functions.html#function_sysdate) (a menos que tanto a source quanto a replica sejam iniciadas com a opção [`--sysdate-is-now`])

    - [`GET_LOCK()`](locking-functions.html#function_get-lock)
    - [`IS_FREE_LOCK()`](locking-functions.html#function_is-free-lock)
    - [`IS_USED_LOCK()`](locking-functions.html#function_is-used-lock)
    - [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait)
    - [`RAND()`](mathematical-functions.html#function_rand)
    - [`RELEASE_LOCK()`](locking-functions.html#function_release-lock)
    - [`SLEEP()`](miscellaneous-functions.html#function_sleep)
    - [`VERSION()`](information-functions.html#function_version)

    No entanto, todas as outras funções são replicadas corretamente usando Replication baseada em Statement, incluindo [`NOW()`] e assim por diante.

    Para mais informações, veja [Seção 16.4.1.15, “Replication e Funções do Sistema”](replication-features-functions.html "16.4.1.15 Replication and System Functions").

  Statements que não podem ser replicados corretamente usando Replication baseada em Statement são logados com um warning como o mostrado aqui:

  ```sql
  [Warning] Statement is not safe to log in statement format.
  ```

  Um warning semelhante também é emitido para o client nesses casos. O client pode exibi-lo usando [`SHOW WARNINGS`].

* [`INSERT ... SELECT`] requer um número maior de row-level Locks do que com Replication baseada em Row.

* Statements [`UPDATE`] que requerem um table scan (porque nenhum Index é usado na cláusula `WHERE`) devem bloquear um número maior de rows do que com Replication baseada em Row.

* Para [`InnoDB`]: Um Statement [`INSERT`] que usa `AUTO_INCREMENT` bloqueia outros Statements [`INSERT`] não conflitantes.

* Para Statements complexos, o Statement deve ser avaliado e executado na replica antes que as rows sejam atualizadas ou inseridas. Com Replication baseada em Row, a replica só precisa modificar as rows afetadas, e não executar o Statement completo.

* Se houver um erro na avaliação na replica, particularmente ao executar Statements complexos, a Replication baseada em Statement pode aumentar lentamente a margem de erro nas rows afetadas ao longo do tempo. Veja [Seção 16.4.1.27, “Erros da Replica Durante a Replication”](replication-features-errors.html "16.4.1.27 Replica Errors During Replication").

* Stored functions são executadas com o mesmo valor de [`NOW()`] que o Statement de chamada. No entanto, isso não é verdade para stored procedures.

* As definições de Table devem ser (quase) idênticas na source e na replica. Veja [Seção 16.4.1.10, “Replication com Definições de Table Diferentes na Source e na Replica”](replication-features-differing-tables.html "16.4.1.10 Replication with Differing Table Definitions on Source and Replica"), para mais informações.

##### Vantagens da Replication baseada em Row

* Todas as alterações podem ser replicadas. Esta é a forma mais segura de Replication.

  Note

  Statements que atualizam as informações no Database do sistema `mysql`, como [`GRANT`], [`REVOKE`] e a manipulação de triggers, stored routines (incluindo stored procedures) e views, são todos replicados para as replicas usando Replication baseada em Statement.

  Para Statements como [`CREATE TABLE ... SELECT`], um Statement `CREATE` é gerado a partir da definição da Table e replicado usando o formato baseado em Statement, enquanto as inserções de row são replicadas usando o formato baseado em Row.

* Menos row Locks são necessários na source, o que, portanto, alcança maior concurrency, para os seguintes tipos de Statements:

  + [`INSERT ... SELECT`]

  + Statements [`INSERT`] com `AUTO_INCREMENT`

  + Statements [`UPDATE`] ou [`DELETE`] com cláusulas `WHERE` que não usam Keys ou não alteram a maioria das rows examinadas.

* Menos row Locks são necessários na replica para qualquer Statement [`INSERT`], [`UPDATE`] ou [`DELETE`].

##### Desvantagens da Replication baseada em Row

* A RBR (Row-Based Replication) pode gerar mais dados que devem ser logados. Para replicar um Statement DML (como um Statement [`UPDATE`] ou [`DELETE`]), a Replication baseada em Statement escreve apenas o Statement no Binary Log. Por outro lado, a Replication baseada em Row escreve cada row alterada no Binary Log. Se o Statement alterar muitas rows, a Replication baseada em Row pode escrever significativamente mais dados no Binary Log; isso é verdade mesmo para Statements que são revertidos (rolled back). Isso também significa que fazer e restaurar um backup pode exigir mais tempo. Além disso, o Binary Log é locked por um tempo maior para gravar os dados, o que pode causar problemas de concurrency. Use [`binlog_row_image=minimal`] para reduzir consideravelmente essa desvantagem.

* Funções carregáveis determinísticas que geram valores [`BLOB`] grandes demoram mais para replicar com Replication baseada em Row do que com Replication baseada em Statement. Isso ocorre porque o valor da coluna [`BLOB`] é logado, em vez do Statement que gera os dados.

* Você não pode ver na replica quais Statements foram recebidos da source e executados. No entanto, você pode ver quais dados foram alterados usando [**mysqlbinlog**] com as opções [`--base64-output=DECODE-ROWS`] e [`--verbose`].

  Alternativamente, use a variável [`binlog_rows_query_log_events`], que, se ativada, adiciona um evento `Rows_query` com o Statement à saída do [**mysqlbinlog**] quando a opção `-vv` é usada.

* Para Tables que usam o storage engine [`MyISAM`], um Lock mais forte é necessário na replica para Statements [`INSERT`] ao aplicá-los como eventos baseados em Row ao Binary Log do que ao aplicá-los como Statements. Isso significa que Inserts concorrentes em Tables [`MyISAM`] não são suportados ao usar Replication baseada em Row.