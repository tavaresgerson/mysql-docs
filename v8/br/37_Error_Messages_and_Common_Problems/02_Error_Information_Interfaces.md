## B.2 Interfaces de informações de erro

Os erros podem ocorrer no lado do servidor ou no lado do cliente, e cada mensagem de erro inclui um código de erro, valor SQLSTATE e uma string de mensagem, conforme descrito na Seção B.1, “Fontes e elementos da mensagem de erro”. Para listas de erros no lado do servidor, no lado do cliente e globais (compartilhadas entre o servidor e os clientes), consulte o Referência de Mensagens de Erro do MySQL 8.0.

Para verificar erros dentro dos programas, use números ou símbolos de código de erro, e não cadeias de mensagens de erro. As cadeias de mensagens não mudam com frequência, mas é possível. Além disso, se o administrador do banco de dados alterar a configuração de idioma, isso afetará o idioma das cadeias de mensagens; veja a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

As informações de erro no MySQL estão disponíveis no log de erro do servidor, no nível SQL, dentro dos programas cliente e na linha de comando.

- Registro de erros
- Interface de Mensagem de Erro SQL
- Interface de Mensagem de Erro do Cliente
- Interface de Mensagem de Erro de Linha de Comando

### Registro de erros

No lado do servidor, algumas mensagens são destinadas ao log de erros. Para obter informações sobre como configurar onde e como o servidor grava o log, consulte a Seção 7.4.2, “O Log de Erros”.

Outras mensagens de erro do servidor são destinadas a serem enviadas para os programas do cliente e estão disponíveis conforme descrito na Interface de Mensagem de Erro do Cliente.

A faixa dentro da qual um código de erro específico está localizado determina se o servidor escreve uma mensagem de erro no log de erros ou a envia para os clientes. Para obter informações sobre essas faixas, consulte Faixas de Códigos de Erro.

### Interface de Mensagem de Erro SQL

No nível SQL, existem várias fontes de informações de erro no MySQL:

- As informações sobre avisos e erros de declaração SQL estão disponíveis através das declarações `SHOW WARNINGS` e `SHOW ERRORS`. A variável de sistema `warning_count` indica o número de erros, avisos e notas (excluindo as notas se a variável de sistema `sql_notes` estiver desativada). A variável de sistema `error_count` indica o número de erros. Seu valor exclui avisos e notas.

- A declaração `GET DIAGNOSTICS` pode ser usada para inspecionar as informações de diagnóstico na área de diagnóstico. Veja a Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”.

- A saída da declaração `SHOW SLAVE STATUS` inclui informações sobre erros de replicação que ocorrem nos servidores replicados.

- A saída da declaração `SHOW ENGINE INNODB STATUS` inclui informações sobre o erro mais recente de chave estrangeira, se uma declaração `CREATE TABLE` para uma tabela `InnoDB` falhar.

### Interface de Mensagem de Erro do Cliente

Os programas de clientes recebem erros de duas fontes:

- Erros que se originam no lado do cliente, dentro da biblioteca do cliente MySQL.

- Erros que se originam no lado do servidor e são enviados ao cliente pelo servidor. Eles são recebidos dentro da biblioteca do cliente, o que os torna disponíveis para o programa cliente hospedeiro.

A faixa dentro da qual um código de erro específico está localizado determina se ele se originou dentro da biblioteca do cliente ou foi recebido pelo cliente do servidor. Para obter informações sobre essas faixas, consulte Faixas de Códigos de Erro.

Independentemente de um erro ser gerado pela biblioteca do cliente ou recebido do servidor, um programa cliente MySQL obtém o código de erro, o valor SQLSTATE, a string de mensagem e outras informações relacionadas ao chamar funções da API C na biblioteca do cliente:

- `mysql_errno()` retorna o código de erro do MySQL.

- `mysql_sqlstate()` retorna o valor SQLSTATE.

- `mysql_error()` retorna a string de mensagem.

- `mysql_stmt_errno()`, `mysql_stmt_sqlstate()` e `mysql_stmt_error()` são as funções de erro correspondentes para instruções preparadas.

- `mysql_warning_count()` retorna o número de erros, avisos e notas para a declaração mais recente.

Para descrições das funções de erro da biblioteca do cliente, consulte o Guia do Desenvolvedor da API C do MySQL 8.0.

Um programa cliente do MySQL pode responder a um erro de maneiras variadas. O cliente pode exibir a mensagem de erro para que o usuário possa tomar medidas corretivas, tentar resolver ou tentar novamente uma operação falha internamente, ou tomar outras ações. Por exemplo, (usando o cliente **mysql**), uma falha na conexão com o servidor pode resultar na seguinte mensagem:

```
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (-2)
```

### Interface de Mensagem de Erro de Linha de Comando

O programa **perror** fornece informações da linha de comando sobre números de erro. Veja a Seção 6.8.2, “perror — Exibir informações do erro do MySQL”.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

Para erros do MySQL NDB Cluster, use **ndb\_perror**. Veja a Seção 25.5.16, “ndb\_perror — Obter informações de mensagem de erro do NDB”.

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```
