#### 13.7.4.1 Sintaxe SET para Atribuição de Variáveis

```sql
SET variable = expr [, variable = expr] ...

variable: {
    user_var_name
  | param_name
  | local_var_name
  | {GLOBAL | @@GLOBAL.} system_var_name
  | [SESSION | @@SESSION. | @@] system_var_name
}
```

A sintaxe [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") para atribuição de variáveis permite atribuir valores a diferentes tipos de variáveis que afetam a operação do server ou dos clients:

* Variáveis definidas pelo usuário. Consulte [Seção 9.4, “Variáveis Definidas pelo Usuário”](user-variables.html "9.4 User-Defined Variables").

* Parâmetros de stored procedure e function, e variáveis locais de stored program. Consulte [Seção 13.6.4, “Variáveis em Stored Programs”](stored-program-variables.html "13.6.4 Variables in Stored Programs").

* System variables. Consulte [Seção 5.1.7, “System Variables do Servidor”](server-system-variables.html "5.1.7 Server System Variables"). As system variables também podem ser configuradas na inicialização do server, conforme descrito na [Seção 5.1.8, “Usando System Variables”](using-system-variables.html "5.1.8 Using System Variables").

Uma instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") que atribui valores de variáveis não é escrita no binary log, portanto, em cenários de replication, ela afeta apenas o host no qual você a executa. Para afetar todos os hosts de replication, execute a instrução em cada host.

As seções a seguir descrevem a sintaxe [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") para configurar variáveis. Elas usam o operador de atribuição [`=`](assignment-operators.html#operator_assign-equal), mas o operador de atribuição [`:=`](assignment-operators.html#operator_assign-value) também é permitido para essa finalidade.

* [Atribuição de Variável Definida pelo Usuário](set-variable.html#set-variable-user-variables "User-Defined Variable Assignment")
* [Atribuição de Parâmetro e Variável Local](set-variable.html#set-variable-parameters-local-variables "Parameter and Local Variable Assignment")
* [Atribuição de System Variable](set-variable.html#set-variable-system-variables "System Variable Assignment")
* [Tratamento de Erro do SET](set-variable.html#set-variable-error-handling "SET Error Handling")
* [Atribuição Múltipla de Variáveis](set-variable.html#set-variable-multiple-assignments "Multiple Variable Assignment")
* [Referências de System Variable em Expressões](set-variable.html#variable-references-in-expressions "System Variable References in Expressions")

##### Atribuição de Variável Definida pelo Usuário

Variáveis definidas pelo usuário são criadas localmente dentro de uma session e existem apenas dentro do contexto dessa session; consulte [Seção 9.4, “Variáveis Definidas pelo Usuário”](user-variables.html "9.4 User-Defined Variables").

Uma variável definida pelo usuário é escrita como `@var_name` e recebe um valor de expression da seguinte forma:

```sql
SET @var_name = expr;
```

Exemplos:

```sql
SET @name = 43;
SET @total_tax = (SELECT SUM(tax) FROM taxable_transactions);
```

Conforme demonstrado por essas instruções, *`expr`* pode variar de simples (um valor literal) a mais complexo (o valor retornado por uma subquery escalar).

A tabela [`user_variables_by_thread`](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables") do Performance Schema contém informações sobre variáveis definidas pelo usuário. Consulte [Seção 25.12.10, “Tabelas de Variáveis Definidas pelo Usuário do Performance Schema”](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables").

##### Atribuição de Parâmetro e Variável Local

[`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") se aplica a parâmetros e variáveis locais no contexto do objeto armazenado dentro do qual são definidos. O seguinte procedure usa o parâmetro do procedure `increment` e a variável local `counter`:

```sql
CREATE PROCEDURE p(increment INT)
BEGIN
  DECLARE counter INT DEFAULT 0;
  WHILE counter < 10 DO
    -- ... do work ...
    SET counter = counter + increment;
  END WHILE;
END;
```

##### Atribuição de System Variable

O MySQL server mantém system variables que configuram sua operação. Uma system variable pode ter um valor Global que afeta a operação do server como um todo, um valor de Session que afeta a session atual, ou ambos. Muitas system variables são dinâmicas e podem ser alteradas em runtime usando a instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") para afetar a operação da instância atual do server. (Para tornar uma configuração de system variable Global permanente, de modo que se aplique em reinicializações do server, você também deve configurá-la em um arquivo de opção.)

Se você alterar uma system variable de Session, o valor permanecerá em vigor em sua session até que você altere a variável para um valor diferente ou a session termine. A alteração não tem efeito sobre outras sessions.

Se você alterar uma system variable Global, o valor é lembrado e usado para inicializar o valor de Session para novas sessions até que você altere a variável para um valor diferente ou o server seja encerrado. A alteração é visível para qualquer client que acesse o valor Global. No entanto, a alteração afeta o valor de Session correspondente apenas para clients que se conectam após a alteração. A alteração da variável Global não afeta o valor de Session para nenhuma session de client atual (nem mesmo a session na qual ocorre a alteração do valor Global).

Note

A configuração de um valor de system variable Global sempre exige privilégios especiais. A configuração de um valor de system variable de Session normalmente não exige privilégios especiais e pode ser feita por qualquer usuário, embora existam exceções. Para mais informações, consulte [Seção 5.1.8.1, “Privilégios de System Variable”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

A discussão a seguir descreve as opções de sintaxe para configurar system variables:

* Para atribuir um valor a uma system variable Global, preceda o nome da variável pela palavra-chave `GLOBAL` ou pelo qualificador `@@GLOBAL.`:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* Para atribuir um valor a uma system variable de Session, preceda o nome da variável pela palavra-chave `SESSION` ou `LOCAL`, pelos qualificadores `@@SESSION.`, `@@LOCAL.`, ou `@@`, ou por nenhuma palavra-chave ou nenhum modificador:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET LOCAL sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@LOCAL.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  SET sql_mode = 'TRADITIONAL';
  ```

  Um client pode alterar suas próprias variáveis de Session, mas não as de qualquer outro client.

Para definir um valor de system variable Global para o valor Default do MySQL compilado ou uma system variable de Session para o valor Global correspondente atual, defina a variável para o valor `DEFAULT`. Por exemplo, as duas instruções a seguir são idênticas na configuração do valor de Session de [`max_join_size`](server-system-variables.html#sysvar_max_join_size) para o valor Global atual:

```sql
SET @@SESSION.max_join_size = DEFAULT;
SET @@SESSION.max_join_size = @@GLOBAL.max_join_size;
```

Para exibir nomes e valores de system variables:

* Use a instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"); consulte [Seção 13.7.5.39, “Instrução SHOW VARIABLES”](show-variables.html "13.7.5.39 SHOW VARIABLES Statement").

* Várias tabelas do Performance Schema fornecem informações de system variable. Consulte [Seção 25.12.13, “Tabelas de System Variable do Performance Schema”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables").

##### Tratamento de Erro do SET

Se qualquer atribuição de variável em uma instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") falhar, toda a instrução falhará e nenhuma variável será alterada.

[`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") produz um error nas circunstâncias descritas aqui. A maioria dos exemplos mostra instruções [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") que usam sintaxe de palavra-chave (por exemplo, `GLOBAL` ou `SESSION`), mas os princípios também são verdadeiros para instruções que usam os modificadores correspondentes (por exemplo, `@@GLOBAL.` ou `@@SESSION.`).

* Uso de [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") (qualquer variante) para configurar uma variável `read-only`:

  ```sql
  mysql> SET GLOBAL version = 'abc';
  ERROR 1238 (HY000): Variable 'version' is a read only variable
  ```

* Uso de `GLOBAL` para configurar uma variável que possui apenas um valor de Session:

  ```sql
  mysql> SET GLOBAL sql_log_bin = ON;
  ERROR 1231 (42000): Variable 'sql_log_bin' can't be
  set to the value of 'ON'
  ```

* Uso de `SESSION` para configurar uma variável que possui apenas um valor Global:

  ```sql
  mysql> SET SESSION max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Omissão de `GLOBAL` para configurar uma variável que possui apenas um valor Global:

  ```sql
  mysql> SET max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Os modificadores `@@GLOBAL.`, `@@SESSION.` e `@@` aplicam-se apenas a system variables. Ocorre um error em tentativas de aplicá-los a variáveis definidas pelo usuário, parâmetros de stored procedure ou function, ou variáveis locais de stored program.

* Nem todas as system variables podem ser configuradas para `DEFAULT`. Nesses casos, a atribuição de `DEFAULT` resulta em um error.

* Ocorre um error em tentativas de atribuir `DEFAULT` a variáveis definidas pelo usuário, parâmetros de stored procedure ou function, ou variáveis locais de stored program.

##### Atribuição Múltipla de Variáveis

Uma instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") pode conter múltiplas atribuições de variáveis, separadas por vírgulas. Esta instrução atribui um valor a uma variável definida pelo usuário e a uma system variable:

```sql
SET @x = 1, SESSION sql_mode = '';
```

Se você configurar múltiplas system variables em uma única instrução, a palavra-chave `GLOBAL` ou `SESSION` mais recente na instrução será usada para as atribuições seguintes que não tiverem uma palavra-chave especificada.

Exemplos de atribuição de múltiplas variáveis:

```sql
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@GLOBAL.sort_buffer_size = 1000000, @@LOCAL.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

Os modificadores `@@GLOBAL.`, `@@SESSION.` e `@@` aplicam-se apenas à system variable imediatamente seguinte, e não a quaisquer system variables remanescentes. Esta instrução define o valor Global de [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) para 50000 e o valor de Session para 1000000:

```sql
SET @@GLOBAL.sort_buffer_size = 50000, sort_buffer_size = 1000000;
```

##### Referências de System Variable em Expressões

Para se referir ao valor de uma system variable em expressions, use um dos modificadores `@@`. Por exemplo, você pode recuperar valores de system variables em uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") assim:

```sql
SELECT @@GLOBAL.sql_mode, @@SESSION.sql_mode, @@sql_mode;
```

Note

Uma referência a uma system variable em uma expression como `@@var_name` (com `@@` em vez de `@@GLOBAL.` ou `@@SESSION.`) retorna o valor de Session, se existir, e o valor Global, caso contrário. Isso difere de `SET @@var_name = expr`, que sempre se refere ao valor de Session.