## B.2 Interfaces de Informações de Erro

Mensagens de erro podem se originar no lado do servidor ou do lado do cliente, e cada mensagem de erro inclui um código de erro, valor SQLSTATE e uma *string* de mensagem, conforme descrito na Seção B.1, “Fontes e Elementos de Mensagens de Erro”. Para listas de erros do lado do servidor, do lado do cliente e globais (compartilhados entre o servidor e clientes), consulte Referência de Mensagens de Erro do MySQL 5.7.

Para a verificação de erros dentro de programas, use números ou símbolos de códigos de erro, e não *strings* de mensagens de erro. As *strings* de mensagens não mudam com frequência, mas é possível que isso ocorra. Além disso, se o administrador do *Database* alterar a configuração de idioma, isso afetará o idioma das *strings* de mensagem; consulte a Seção 10.12, “Configurando o Idioma da Mensagem de Erro”.

As informações de erro no MySQL estão disponíveis no *error log* do servidor, no nível SQL, em programas cliente e na linha de comando.

* Error Log
* Interface de Mensagem de Erro SQL
* Interface de Mensagem de Erro do Cliente
* Interface de Mensagem de Erro da Linha de Comando

### Error Log

No lado do servidor, algumas mensagens são destinadas ao *error log*. Para obter informações sobre como configurar onde e como o servidor escreve o *log*, consulte a Seção 5.4.2, “O Error Log”.

Outras mensagens de erro do servidor são destinadas a serem enviadas para programas cliente e estão disponíveis conforme descrito em Interface de Mensagem de Erro do Cliente.

### Interface de Mensagem de Erro SQL

No nível SQL, há várias fontes de informação de erro no MySQL:

* As informações de *warning* e erro de *statements* SQL estão disponíveis através dos *statements* `SHOW WARNINGS` e `SHOW ERRORS`. A variável de sistema `warning_count` indica o número de erros, *warnings* e notas (com notas excluídas se a variável de sistema `sql_notes` estiver desabilitada). A variável de sistema `error_count` indica o número de erros. Seu valor exclui *warnings* e notas.

* O *statement* `GET DIAGNOSTICS` pode ser usado para inspecionar as informações de diagnóstico na área de diagnóstico. Consulte a Seção 13.6.7.3, “GET DIAGNOSTICS Statement”.

* A saída do *statement* `SHOW SLAVE STATUS` inclui informações sobre erros de replicação que ocorrem em servidores *replica*.

* A saída do *statement* `SHOW ENGINE INNODB STATUS` inclui informações sobre o erro de *foreign key* mais recente se um *statement* `CREATE TABLE` para uma tabela `InnoDB` falhar.

### Interface de Mensagem de Erro do Cliente

Programas cliente recebem erros de duas fontes:

* Erros que se originam no lado do cliente dentro da biblioteca cliente do MySQL.

* Erros que se originam no lado do servidor e são enviados ao cliente pelo servidor. Estes são recebidos dentro da biblioteca cliente, que os disponibiliza para o programa cliente *host*.

Independentemente de um erro se originar dentro da biblioteca cliente ou ser recebido do servidor, um programa cliente MySQL obtém o código de erro, o valor SQLSTATE, a *string* de mensagem e outras informações relacionadas chamando funções da C API na biblioteca cliente:

* `mysql_errno()` retorna o código de erro do MySQL.

* `mysql_sqlstate()` retorna o valor SQLSTATE.

* `mysql_error()` retorna a *string* de mensagem.

* `mysql_stmt_errno()`, `mysql_stmt_sqlstate()` e `mysql_stmt_error()` são as funções de erro correspondentes para *prepared statements*.

* `mysql_warning_count()` retorna o número de erros, *warnings* e notas para o *statement* mais recente.

Para descrições das funções de erro da biblioteca cliente, consulte Guia do Desenvolvedor C API do MySQL 5.7.

Um programa cliente MySQL pode responder a um erro de várias maneiras. O cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas, tentar resolver internamente ou repetir uma operação com falha, ou tomar outra ação. Por exemplo, (usando o cliente **mysql**), uma falha ao conectar-se ao servidor pode resultar nesta mensagem:

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

### Interface de Mensagem de Erro da Linha de Comando

O programa **perror** fornece informações sobre números de erro a partir da linha de comando. Consulte a Seção 4.8.2, “perror — Display MySQL Error Message Information”.

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

Para erros do MySQL NDB Cluster, use **ndb_perror**. Consulte a Seção 21.5.17, “ndb_perror — Obtain NDB Error Message Information”.

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```