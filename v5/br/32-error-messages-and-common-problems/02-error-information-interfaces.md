## B.2 Interfaces de informações de erro

Os erros podem ocorrer no lado do servidor ou no lado do cliente, e cada mensagem de erro inclui um código de erro, valor SQLSTATE e uma string de mensagem, conforme descrito na [Seção B.1, “Fontes e elementos da mensagem de erro”](error-message-elements.html). Para listas de erros no lado do servidor, no lado do cliente e globais (compartilhadas entre o servidor e os clientes), consulte [Referência de Mensagens de Erro do MySQL 5.7](/doc/mysql-errors/5.7/pt_BR/).

Para verificar erros dentro dos programas, use números ou símbolos de código de erro, e não cadeias de mensagens de erro. As cadeias de mensagens de erro não mudam com frequência, mas é possível. Além disso, se o administrador do banco de dados alterar a configuração de idioma, isso afetará o idioma das cadeias de mensagens de erro; consulte [Seção 10.12, “Definindo o Idioma da Mensagem de Erro”](error-message-language.html).

As informações de erro no MySQL estão disponíveis no log de erro do servidor, no nível SQL, dentro dos programas cliente e na linha de comando.

- [Registro de Erros](error-interfaces.html#error-interface-log)
- [Interface de Mensagem de Erro SQL](error-interfaces.html#error-interface-sql)
- [Interface de Mensagem de Erro do Cliente](error-interfaces.html#error-interface-client)
- [Interface de Mensagem de Erro de Linha de Comando](error-interfaces.html#error-interface-command)

### Registro de erros

No lado do servidor, algumas mensagens são destinadas ao log de erros. Para obter informações sobre como configurar onde e como o servidor escreve o log, consulte [Seção 5.4.2, “O Log de Erros”](error-log.html).

Outras mensagens de erro do servidor são destinadas a serem enviadas para os programas do cliente e estão disponíveis conforme descrito em [Interface de Mensagem de Erro do Cliente](error-interfaces.html#error-interface-client).

### Interface de Mensagem de Erro SQL

No nível SQL, existem várias fontes de informações de erro no MySQL:

- As informações de avisos e erros de instruções SQL estão disponíveis através das instruções [`SHOW WARNINGS`](show-warnings.html) e [`SHOW ERRORS`](show-errors.html). A variável de sistema [`warning_count`](server-system-variables.html#sysvar_warning_count) indica o número de erros, avisos e notas (excluindo as notas se a variável de sistema [`sql_notes`](server-system-variables.html#sysvar_sql_notes) estiver desativada). A variável de sistema [`error_count`](server-system-variables.html#sysvar_error_count) indica o número de erros. Seu valor exclui avisos e notas.

- A declaração [`GET DIAGNOSTICS`](get-diagnostics.html) pode ser usada para inspecionar as informações de diagnóstico na área de diagnóstico. Veja [Seção 13.6.7.3, “Declaração GET DIAGNOSTICS”](get-diagnostics.html).

- A saída da declaração [`SHOW SLAVE STATUS`](show-slave-status.html) inclui informações sobre erros de replicação que ocorrem nos servidores replicados.

- A saída da instrução [`SHOW ENGINE INNODB STATUS`](show-engine.html) inclui informações sobre o erro mais recente de chave estrangeira, caso uma instrução [`CREATE TABLE`](create-table.html) para uma tabela de [`InnoDB`](innodb-storage-engine.html) falhe.

### Interface de Mensagem de Erro do Cliente

Os programas de clientes recebem erros de duas fontes:

- Erros que se originam no lado do cliente, dentro da biblioteca do cliente MySQL.

- Erros que se originam no lado do servidor e são enviados ao cliente pelo servidor. Eles são recebidos dentro da biblioteca do cliente, o que os torna disponíveis para o programa cliente hospedeiro.

Independentemente de um erro ser gerado pela biblioteca do cliente ou recebido do servidor, um programa cliente MySQL obtém o código de erro, o valor SQLSTATE, a string de mensagem e outras informações relacionadas ao chamar funções da API C na biblioteca do cliente:

- [`mysql_errno()`](/doc/c-api/5.7/pt-BR/mysql-errno.html) retorna o código de erro do MySQL.

- [`mysql_sqlstate()`](/doc/c-api/5.7/pt-BR/mysql-sqlstate.html) retorna o valor SQLSTATE.

- [`mysql_error()`](/doc/c-api/5.7/pt-BR/mysql-error.html) retorna a string de mensagem.

- [`mysql_stmt_errno()`](/doc/c-api/5.7/pt_BR/mysql-stmt-errno.html), [`mysql_stmt_sqlstate()`](/doc/c-api/5.7/pt_BR/mysql-stmt-sqlstate.html) e [`mysql_stmt_error()`](/doc/c-api/5.7/pt_BR/mysql-stmt-error.html) são as funções de erro correspondentes para instruções preparadas.

- [`mysql_warning_count()`](/doc/c-api/5.7/pt-BR/mysql-warning-count.html) retorna o número de erros, avisos e notas para a declaração mais recente.

Para descrições das funções de erro da biblioteca do cliente, consulte [Guia do desenvolvedor da API C do MySQL 5.7](/doc/c-api/5.7/pt_BR/).

Um programa cliente do MySQL pode responder a um erro de maneiras variadas. O cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas, tentar resolver internamente ou tentar novamente uma operação falha ou tomar outras ações. Por exemplo, (usando o cliente [**mysql**](mysql.html), uma falha na conexão com o servidor pode resultar na seguinte mensagem:

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

### Interface de Mensagem de Erro de Linha de Comando

O programa [**perror**](perror.html) fornece informações da linha de comando sobre números de erro. Veja [Seção 4.8.2, “perror — Exibir informações do erro do MySQL”](perror.html).

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

Para erros do MySQL NDB Cluster, use [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html). Veja [Seção 21.5.17, “ndb\_perror — Obter informações de mensagem de erro NDB”](mysql-cluster-programs-ndb-perror.html).

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```
