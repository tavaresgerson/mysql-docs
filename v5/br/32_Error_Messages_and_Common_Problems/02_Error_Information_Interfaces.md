## B.2 Interfaces de Informação de Erro

Os erros podem ser gerados no lado do servidor ou no lado do cliente, e cada mensagem de erro inclui um código de erro, valor SQLSTATE e uma string de mensagem, conforme descrito na Seção B.1, “Fontes e elementos da mensagem de erro”. Para listas de erros no lado do servidor, no lado do cliente e globais (compartilhadas entre servidor e clientes), consulte o Referência de Mensagem de Erro do MySQL 5.7.

Para verificação de erros dentro dos programas, use números ou símbolos de código de erro, não cadeias de mensagens de erro. As cadeias de mensagens não mudam com frequência, mas é possível. Além disso, se o administrador do banco de dados alterar a configuração de idioma, isso afeta o idioma das cadeias de mensagens; veja Seção 10.12, “Definindo o idioma da mensagem de erro”.

As informações de erro no MySQL estão disponíveis no log de erro do servidor, no nível SQL, dentro dos programas de cliente e na string de comando.

* Diário de erros
* Interface de mensagem de erro SQL
* Interface de mensagem de erro do cliente
* Interface de mensagem de erro de string de comando

### Diário de Erros

Do lado do servidor, algumas mensagens são destinadas ao log de erro. Para obter informações sobre como e onde o servidor escreve o log, consulte a Seção 5.4.2, “O Log de Erro”.

Outras mensagens de erro do servidor são destinadas a serem enviadas para programas de cliente e estão disponíveis conforme descrito na Interface de Mensagem de Erro do Cliente.

### Mensagem de erro do SQL Interface

No nível SQL, existem várias fontes de informações de erro no MySQL:

As informações sobre avisos e erros de declaração SQL estão disponíveis através das declarações `SHOW WARNINGS` e `SHOW ERRORS`. A variável de sistema `warning_count` indica o número de erros, avisos e notas (excluindo as notas se a variável de sistema `sql_notes` estiver desativada). A variável de sistema `error_count` indica o número de erros. Seu valor exclui avisos e notas.

* A declaração `GET DIAGNOSTICS` pode ser usada para inspecionar as informações de diagnóstico na área de diagnóstico. Veja a Seção 13.6.7.3, “Declaração GET DIAGNOSTICS”.

* A saída da declaração `SHOW SLAVE STATUS` inclui informações sobre erros de replicação que ocorrem nos servidores replicados.

* A saída da declaração `SHOW ENGINE INNODB STATUS` inclui informações sobre o erro mais recente de chave estrangeira, se uma declaração `CREATE TABLE` para uma tabela `InnoDB` falhar.

### Mensagem de erro do cliente Interface

Os programas de clientes recebem erros de duas fontes:

* Erros que se originam do lado do cliente, dentro da biblioteca do cliente MySQL.

* Erros que se originam no lado do servidor e são enviados ao cliente pelo servidor. Esses erros são recebidos dentro da biblioteca do cliente, o que os torna disponíveis para o programa cliente hospedeiro.

Independentemente de um erro originar-se dentro da biblioteca do cliente ou ser recebido do servidor, um programa cliente MySQL obtém o código de erro, o valor SQLSTATE, a string de mensagem e outras informações relacionadas, chamando funções da API C na biblioteca do cliente:

* `mysql_errno()` retorna o código de erro do MySQL.

* `mysql_sqlstate()` retorna o valor SQLSTATE.

* `mysql_error()` retorna a string de mensagem.

* `mysql_stmt_errno()`, `mysql_stmt_sqlstate()` e `mysql_stmt_error()` são as funções de erro correspondentes para instruções preparadas.

* `mysql_warning_count()` retorna o número de erros, avisos e notas para a declaração mais recente.

Para descrições das funções de erro da biblioteca de clientes, consulte o Guia do Desenvolvedor da API C do MySQL 5.7.

Um programa cliente do MySQL pode responder a um erro de várias maneiras. O cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas, tentar resolver internamente ou repetir uma operação falha, ou tomar outras ações. Por exemplo, (usando o cliente **mysql**), uma falha na conexão com o servidor pode resultar na seguinte mensagem:

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

### Interface de Mensagem de Erro de String de Comando

O programa **perror** fornece informações da string de comando sobre números de erro. Veja a Seção 4.8.2, “perror — Exibir informações de mensagem de erro do MySQL”.

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

Para erros do MySQL NDB Cluster, use **ndb_perror**. Veja a Seção 21.5.17, “ndb_perror — Obtenha informações sobre o erro do NDB”.

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```