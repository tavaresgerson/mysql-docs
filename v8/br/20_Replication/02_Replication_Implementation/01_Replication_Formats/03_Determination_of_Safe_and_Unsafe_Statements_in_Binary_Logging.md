#### 19.2.1.3 Determinação de declarações seguras e inseguras no registro binário

A "segurança" de uma declaração na replicação do MySQL refere-se a se a declaração e seus efeitos podem ser replicados corretamente usando o formato baseado em declarações. Se isso for verdade para a declaração, a chamamos de segura; caso contrário, a chamamos de insegura.

Em geral, uma declaração é segura se for determinística e insegura se não o for. No entanto, certas funções não determinísticas **não** são consideradas inseguras (consulte Funções não determinísticas não consideradas inseguras, mais adiante nesta seção). Além disso, declarações que utilizam resultados de funções matemáticas de ponto flutuante — que dependem do hardware — são sempre consideradas inseguras (consulte Seção 19.5.1.12, “Replicação e Valores de Ponto Flutuante”).

**Tratamento de declarações seguras e inseguras.** Uma declaração é tratada de maneira diferente dependendo se a declaração é considerada segura e em relação ao formato de registro binário (ou seja, o valor atual de `binlog_format`).

- Ao usar o registro baseado em linhas, não há distinção no tratamento de declarações seguras e inseguras.

- Ao usar o registro de formato misto, as declarações marcadas como inseguras são registradas no formato baseado em linha; as declarações consideradas seguras são registradas no formato baseado em declaração.

- Ao usar o registro baseado em declarações, as declarações marcadas como inseguras geram um aviso nesse sentido. As declarações seguras são registradas normalmente.

Cada declaração marcada como insegura gera um aviso. Se um grande número dessas declarações fosse executado na fonte, isso poderia levar a arquivos de log de erro excessivamente grandes. Para evitar isso, o MySQL tem um mecanismo de supressão de avisos. Sempre que os 50 avisos mais recentes `ER_BINLOG_UNSAFE_STATEMENT` forem gerados mais de 50 vezes em qualquer período de 50 segundos, a supressão de avisos é ativada. Quando ativado, isso faz com que esses avisos não sejam escritos no log de erro; em vez disso, para cada 50 avisos desse tipo, uma nota `The last warning was repeated N times in last S seconds` é escrita no log de erro. Isso continua enquanto os 50 avisos mais recentes forem emitidos em 50 segundos ou menos; uma vez que a taxa tenha diminuído abaixo desse limite, os avisos são novamente registrados normalmente. A supressão de avisos não afeta como a segurança das declarações para o registro baseado em declarações é determinada, nem como os avisos são enviados ao cliente. Os clientes do MySQL ainda recebem um aviso para cada declaração desse tipo.

Para obter mais informações, consulte a Seção 19.2.1, “Formatos de replicação”.

**Declarações consideradas inseguras.** Declarações com as seguintes características são consideradas inseguras:

- **Declarações que contêm funções do sistema que podem retornar um valor diferente na replica.** Essas funções incluem `FOUND_ROWS()`, `GET_LOCK()`, `IS_FREE_LOCK()`, `IS_USED_LOCK()`, `LOAD_FILE()`, `MASTER_POS_WAIT()`, `RAND()`, `RELEASE_LOCK()`, `ROW_COUNT()`, `SESSION_USER()`, `SLEEP()`, `SOURCE_POS_WAIT()`, `SYSDATE()`, `SYSTEM_USER()`, `USER()`, `UUID()` e `UUID_SHORT()`.

  **Funções não determinísticas não consideradas inseguras.** Embora essas funções não sejam determinísticas, elas são tratadas como seguras para fins de registro e replicação: `CONNECTION_ID()`, `CURDATE()`, `CURRENT_DATE()`, `CURRENT_TIME()`, `CURRENT_TIMESTAMP()`, `CURTIME()`, `LAST_INSERT_ID()`, `LOCALTIME()`, `LOCALTIMESTAMP()`, `NOW()`, `UNIX_TIMESTAMP()`, `UTC_DATE()`, `UTC_TIME()` e `UTC_TIMESTAMP()`.

  Para obter mais informações, consulte a Seção 19.5.1.14, “Replicação e Funções do Sistema”.

- **Referências a variáveis do sistema.** A maioria das variáveis do sistema não é replicada corretamente usando o formato baseado em instruções. Consulte a Seção 19.5.1.39, “Replicação e Variáveis”. Para exceções, consulte a Seção 7.4.4.3, “Formato de Registro Binário Misto”.

- **Funções carregáveis.** Como não temos controle sobre o que uma função carregável faz, devemos assumir que ela está executando instruções inseguras.

- **Plugin de texto completo.** Este plugin pode se comportar de maneira diferente em diferentes servidores MySQL; portanto, as instruções que dependem dele podem ter resultados diferentes. Por essa razão, todas as instruções que dependem do plugin de texto completo são tratadas como inseguras no MySQL.

- **O trigger ou a atualização de programas armazenados atualizam uma tabela que possui uma coluna AUTO\_INCREMENT.** Isso é inseguro porque a ordem em que as linhas são atualizadas pode diferir entre a fonte e a réplica.

  Além disso, uma `INSERT` em uma tabela que possui uma chave primária composta contendo uma coluna `AUTO_INCREMENT` que não é a primeira coluna dessa chave composta é insegura.

  Para obter mais informações, consulte a Seção 19.5.1.1, “Replicação e AUTO\_INCREMENT”.

- **INSERIR ... na cláusula UPDATE para tabelas com múltiplas chaves primárias ou únicas.** Quando executada em uma tabela que contém mais de uma chave primária ou única, essa cláusula é considerada insegura, pois é sensível à ordem em que o mecanismo de armazenamento verifica as chaves, que não é determinística, e da qual depende a escolha das linhas atualizadas pelo MySQL Server.

  Uma declaração `INSERT ... ON DUPLICATE KEY UPDATE` contra uma tabela que tenha mais de uma chave primária ou única é marcada como insegura para replicação baseada em declarações. (Bug #11765650, Bug #58637)

- **Atualizações usando LIMIT.** A ordem em que as linhas são recuperadas não é especificada e, portanto, é considerada insegura. Veja a Seção 19.5.1.18, “Replicação e LIMIT”.

- **Registro de acessos ou referências às tabelas de log.** O conteúdo da tabela de log do sistema pode diferir entre a fonte e a replica.

- **Operações não transacionais após operações transacionais.** Dentro de uma transação, permitir que quaisquer leituras ou escritas não transacionais sejam executadas após leituras ou escritas transacionais é considerado inseguro.

  Para mais informações, consulte a Seção 19.5.1.35, “Replicação e Transações”.

- **Acesse ou faça referência a tabelas de autoregistro.** Todas as leituras e escritas em tabelas de autoregistro são consideradas inseguras. Dentro de uma transação, qualquer declaração que siga uma leitura ou escrita em tabelas de autoregistro também é considerada insegura.

- **Instruções de LOAD DATA.** `LOAD DATA` é tratado como inseguro e, quando `binlog_format=MIXED` a instrução é registrada no formato de linha. Quando `binlog_format=STATEMENT` `LOAD DATA` não gera uma mensagem de alerta, ao contrário de outras instruções inseguras.

- **Transações XA.** Se duas transações XA comprometidas em paralelo na fonte estiverem sendo preparadas na replica na ordem inversa, podem ocorrer dependências de bloqueio com a replicação baseada em declarações que não podem ser resolvidas com segurança, e é possível que a replicação falhe com um impasse na replica. Quando `binlog_format=STATEMENT` é definido, as declarações DML dentro das transações XA são marcadas como inseguras e geram um aviso. Quando `binlog_format=MIXED` ou `binlog_format=ROW` é definido, as declarações DML dentro das transações XA são registradas usando a replicação baseada em linhas, e o problema potencial não está presente.

- Cláusula `DEFAULT` que se refere a uma função não determinística. Se o valor padrão de uma expressão se referir a uma função não determinística, qualquer instrução que faça com que a expressão seja avaliada é insegura para a replicação baseada em instruções. Isso inclui instruções como `INSERT`, `UPDATE` e `ALTER TABLE`. Ao contrário da maioria das outras instruções inseguras, essa categoria de instrução não pode ser replicada com segurança no formato baseado em linhas. Quando `binlog_format` é definido como `STATEMENT`, a instrução é registrada e executada, mas uma mensagem de aviso é escrita no log de erros. Quando `binlog_format` é definido como `MIXED` ou `ROW`, a instrução não é executada e uma mensagem de erro é escrita no log de erros. Para mais informações sobre o tratamento de padrões explícitos, consulte o tratamento de padrões explícitos a partir do MySQL 8.0.13.

Para obter informações adicionais, consulte a Seção 19.5.1, “Recursos e problemas de replicação”.
