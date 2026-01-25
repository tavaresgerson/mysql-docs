## B.2 Interfaces de Informações de Erro

Mensagens de erro podem se originar no lado do servidor ou do lado do cliente, e cada mensagem de erro inclui um código de erro, valor SQLSTATE e uma *string* de mensagem, conforme descrito na [Seção B.1, “Fontes e Elementos de Mensagens de Erro”](error-message-elements.html "B.1 Fontes e Elementos de Mensagens de Erro"). Para listas de erros do lado do servidor, do lado do cliente e globais (compartilhados entre o servidor e clientes), consulte [Referência de Mensagens de Erro do MySQL 5.7](/doc/mysql-errors/5.7/en/).

Para a verificação de erros dentro de programas, use números ou símbolos de códigos de erro, e não *strings* de mensagens de erro. As *strings* de mensagens não mudam com frequência, mas é possível que isso ocorra. Além disso, se o administrador do *Database* alterar a configuração de idioma, isso afetará o idioma das *strings* de mensagem; consulte a [Seção 10.12, “Configurando o Idioma da Mensagem de Erro”](error-message-language.html "10.12 Configurando o Idioma da Mensagem de Erro").

As informações de erro no MySQL estão disponíveis no *error log* do servidor, no nível SQL, em programas cliente e na linha de comando.

* [Error Log](error-interfaces.html#error-interface-log "Error Log")
* [Interface de Mensagem de Erro SQL](error-interfaces.html#error-interface-sql "SQL Error Message Interface")
* [Interface de Mensagem de Erro do Cliente](error-interfaces.html#error-interface-client "Client Error Message Interface")
* [Interface de Mensagem de Erro da Linha de Comando](error-interfaces.html#error-interface-command "Command-Line Error Message Interface")

### Error Log

No lado do servidor, algumas mensagens são destinadas ao *error log*. Para obter informações sobre como configurar onde e como o servidor escreve o *log*, consulte a [Seção 5.4.2, “O Error Log”](error-log.html "5.4.2 O Error Log").

Outras mensagens de erro do servidor são destinadas a serem enviadas para programas cliente e estão disponíveis conforme descrito em [Interface de Mensagem de Erro do Cliente](error-interfaces.html#error-interface-client "Client Error Message Interface").

### Interface de Mensagem de Erro SQL

No nível SQL, há várias fontes de informação de erro no MySQL:

* As informações de *warning* e erro de *statements* SQL estão disponíveis através dos *statements* [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") e [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement"). A variável de sistema [`warning_count`](server-system-variables.html#sysvar_warning_count) indica o número de erros, *warnings* e notas (com notas excluídas se a variável de sistema [`sql_notes`](server-system-variables.html#sysvar_sql_notes) estiver desabilitada). A variável de sistema [`error_count`](server-system-variables.html#sysvar_error_count) indica o número de erros. Seu valor exclui *warnings* e notas.

* O *statement* [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") pode ser usado para inspecionar as informações de diagnóstico na área de diagnóstico. Consulte a [Seção 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement").

* A saída do *statement* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") inclui informações sobre erros de replicação que ocorrem em servidores *replica*.

* A saída do *statement* [`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") inclui informações sobre o erro de *foreign key* mais recente se um *statement* [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") para uma tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") falhar.

### Interface de Mensagem de Erro do Cliente

Programas cliente recebem erros de duas fontes:

* Erros que se originam no lado do cliente dentro da biblioteca cliente do MySQL.

* Erros que se originam no lado do servidor e são enviados ao cliente pelo servidor. Estes são recebidos dentro da biblioteca cliente, que os disponibiliza para o programa cliente *host*.

Independentemente de um erro se originar dentro da biblioteca cliente ou ser recebido do servidor, um programa cliente MySQL obtém o código de erro, o valor SQLSTATE, a *string* de mensagem e outras informações relacionadas chamando funções da C API na biblioteca cliente:

* [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html) retorna o código de erro do MySQL.

* [`mysql_sqlstate()`](/doc/c-api/5.7/en/mysql-sqlstate.html) retorna o valor SQLSTATE.

* [`mysql_error()`](/doc/c-api/5.7/en/mysql-error.html) retorna a *string* de mensagem.

* [`mysql_stmt_errno()`](/doc/c-api/5.7/en/mysql-stmt-errno.html), [`mysql_stmt_sqlstate()`](/doc/c-api/5.7/en/mysql-stmt-sqlstate.html) e [`mysql_stmt_error()`](/doc/c-api/5.7/en/mysql-stmt-error.html) são as funções de erro correspondentes para *prepared statements*.

* [`mysql_warning_count()`](/doc/c-api/5.7/en/mysql-warning-count.html) retorna o número de erros, *warnings* e notas para o *statement* mais recente.

Para descrições das funções de erro da biblioteca cliente, consulte [Guia do Desenvolvedor C API do MySQL 5.7](/doc/c-api/5.7/en/).

Um programa cliente MySQL pode responder a um erro de várias maneiras. O cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas, tentar resolver internamente ou repetir uma operação com falha, ou tomar outra ação. Por exemplo, (usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")), uma falha ao conectar-se ao servidor pode resultar nesta mensagem:

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

### Interface de Mensagem de Erro da Linha de Comando

O programa [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") fornece informações sobre números de erro a partir da linha de comando. Consulte a [Seção 4.8.2, “perror — Display MySQL Error Message Information”](perror.html "4.8.2 perror — Display MySQL Error Message Information").

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

Para erros do MySQL NDB Cluster, use [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information"). Consulte a [Seção 21.5.17, “ndb_perror — Obtain NDB Error Message Information”](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information").

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```