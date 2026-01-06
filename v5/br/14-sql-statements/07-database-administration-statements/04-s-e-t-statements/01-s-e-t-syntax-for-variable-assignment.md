#### 13.7.4.1 Sintaxe de definição de variáveis para atribuição

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

A sintaxe `SET` para atribuição de variáveis permite que você atribua valores a diferentes tipos de variáveis que afetam o funcionamento do servidor ou dos clientes:

- Variáveis definidas pelo usuário. Consulte Seção 9.4, “Variáveis Definidas pelo Usuário”.

- Parâmetros de procedimentos e funções armazenados, e variáveis locais de programas armazenados. Consulte Seção 13.6.4, “Variáveis em Programas Armazenados”.

- Variáveis do sistema. Consulte Seção 5.1.7, “Variáveis do sistema do servidor”. As variáveis do sistema também podem ser definidas durante o início do servidor, conforme descrito na Seção 5.1.8, “Uso de variáveis do sistema”.

Uma declaração `SET` que atribui valores variáveis não é escrita no log binário, portanto, em cenários de replicação, ela afeta apenas o host no qual você a executa. Para afetar todos os hosts de replicação, execute a declaração em cada host.

As seções a seguir descrevem a sintaxe de `SET` para definir variáveis. Elas usam o operador de atribuição `=`, mas o operador de atribuição `:=` também é permitido para esse propósito.

- Atribuição de variável definida pelo usuário
- Atribuição de Parâmetros e Variáveis Locais
- Atribuição de variáveis do sistema
- Tratamento de Erros do SET
- Atribuição de variáveis múltiplas
- Referências de variáveis de sistema em expressões

##### Atribuição de variáveis definidas pelo usuário

As variáveis definidas pelo usuário são criadas localmente dentro de uma sessão e existem apenas dentro do contexto dessa sessão; veja Seção 9.4, “Variáveis Definidas pelo Usuário”.

Uma variável definida pelo usuário é escrita como `@var_name` e recebe um valor de expressão da seguinte forma:

```sql
SET @var_name = expr;
```

Exemplos:

```sql
SET @name = 43;
SET @total_tax = (SELECT SUM(tax) FROM taxable_transactions);
```

Como demonstrado por essas declarações, *`expr`* pode variar de simples (um valor literal) a mais complexo (o valor retornado por uma subconsulta escalar).

A tabela do Schema de Desempenho `user_variables_by_thread` contém informações sobre variáveis definidas pelo usuário. Veja Seção 25.12.10, “Tabelas de Variáveis Definidas pelo Usuário do Schema de Desempenho”.

##### Atribuição de parâmetros e variáveis locais

`SET` se aplica a parâmetros e variáveis locais no contexto do objeto armazenado no qual são definidos. O procedimento a seguir usa o parâmetro de procedimento `increment` e a variável local `counter`:

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

##### Atribuição de variáveis do sistema

O servidor MySQL mantém variáveis de sistema que configuram sua operação. Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual ou ambos. Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a instrução `SET` para afetar a operação da instância atual do servidor. (Para tornar uma configuração de variável de sistema global permanente, para que ela seja aplicada em reinicializações do servidor, você também deve configurá-la em um arquivo de opções.)

Se você alterar uma variável de sistema de sessão, o valor permanecerá em vigor dentro da sua sessão até que você altere a variável para um valor diferente ou a sessão termine. A alteração não tem efeito em outras sessões.

Se você alterar uma variável de sistema global, o valor é lembrado e usado para inicializar o valor da sessão para novas sessões até que você altere a variável para um valor diferente ou o servidor saia. A mudança é visível para qualquer cliente que acesse o valor global. No entanto, a mudança afeta o valor da sessão correspondente apenas para clientes que se conectam após a mudança. A alteração da variável global não afeta o valor da sessão para nenhuma sessão de cliente atual (nem mesmo a sessão na qual a alteração do valor global ocorre).

Nota

Definir o valor de uma variável de sistema global sempre requer privilégios especiais. Definir o valor de uma variável de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora existam exceções. Para mais informações, consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

A discussão a seguir descreve as opções de sintaxe para definir variáveis do sistema:

- Para atribuir um valor a uma variável de sistema global, preceda o nome da variável com a palavra-chave `GLOBAL` ou o qualificador `@@GLOBAL.`:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

- Para atribuir um valor a uma variável de sistema de sessão, preceda o nome da variável com as palavras-chave `SESSION` ou `LOCAL`, com o qualificador `@@SESSION.`, `@@LOCAL.` ou `@@`, ou sem nenhuma palavra-chave ou modificador:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET LOCAL sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@LOCAL.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  SET sql_mode = 'TRADITIONAL';
  ```

  Um cliente pode alterar suas próprias variáveis de sessão, mas não as de outros clientes.

Para definir o valor de uma variável de sistema global para o valor padrão integrado do MySQL ou uma variável de sistema de sessão para o valor global correspondente atual, defina a variável para o valor `DEFAULT`. Por exemplo, as seguintes duas instruções são idênticas para definir o valor da sessão de `max_join_size` para o valor global atual:

```sql
SET @@SESSION.max_join_size = DEFAULT;
SET @@SESSION.max_join_size = @@GLOBAL.max_join_size;
```

Para exibir os nomes e valores das variáveis do sistema:

- Use a instrução `SHOW VARIABLES`; veja Seção 13.7.5.39, “Instrução SHOW VARIABLES”.

- Várias tabelas do Schema de Desempenho fornecem informações sobre variáveis do sistema. Veja Seção 25.12.13, “Tabelas de Variáveis do Sistema do Schema de Desempenho”.

##### Tratamento de Erros do SET

Se qualquer atribuição de variável em uma declaração de `[`SET\`]\(set-variable.html) falhar, toda a declaração falhará e nenhuma variável será alterada.

`SET` produz um erro nas circunstâncias descritas aqui. A maioria dos exemplos mostra instruções `SET` que usam a sintaxe de palavras-chave (por exemplo, `GLOBAL` ou `SESSION`), mas os princípios também são válidos para instruções que usam os modificadores correspondentes (por exemplo, `@@GLOBAL.` ou `@@SESSION.`).

- Uso de `SET` (qualquer variante) para definir uma variável somente de leitura:

  ```sql
  mysql> SET GLOBAL version = 'abc';
  ERROR 1238 (HY000): Variable 'version' is a read only variable
  ```

- Uso de `GLOBAL` para definir uma variável que tem apenas um valor de sessão:

  ```sql
  mysql> SET GLOBAL sql_log_bin = ON;
  ERROR 1231 (42000): Variable 'sql_log_bin' can't be
  set to the value of 'ON'
  ```

- Uso de `SESSION` para definir uma variável que tem apenas um valor global:

  ```sql
  mysql> SET SESSION max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

- Omissão de `GLOBAL` para definir uma variável que tem apenas um valor global:

  ```sql
  mysql> SET max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

- Os modificadores `@@GLOBAL.`, `@@SESSION.`, e `@@` aplicam-se apenas a variáveis do sistema. Um erro ocorre para tentativas de aplicá-los a variáveis definidas pelo usuário, parâmetros de procedimentos ou funções armazenados, ou variáveis locais de programas armazenados.

- Nem todas as variáveis do sistema podem ser definidas como `DEFAULT`. Nesse caso, atribuir `DEFAULT` resulta em um erro.

- Um erro ocorre para tentativas de atribuir `DEFAULT` a variáveis definidas pelo usuário, parâmetros de procedimentos ou funções armazenados ou variáveis locais de programas armazenados.

##### Atribuição de múltiplas variáveis

Uma declaração `SET` pode conter várias atribuições de variáveis, separadas por vírgulas. Esta declaração atribui um valor a uma variável definida pelo usuário e a uma variável do sistema:

```sql
SET @x = 1, SESSION sql_mode = '';
```

Se você definir várias variáveis de sistema em uma única instrução, a palavra-chave mais recente `GLOBAL` ou `SESSION` na instrução será usada para atribuições subsequentes que não tenham uma palavra-chave especificada.

Exemplos de atribuição de variáveis múltiplas:

```sql
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@GLOBAL.sort_buffer_size = 1000000, @@LOCAL.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

Os modificadores `@@GLOBAL.`, `@@SESSION.`, e `@@` aplicam-se apenas à variável de sistema imediatamente seguinte, e não a quaisquer variáveis de sistema restantes. Esta declaração define o valor global `sort_buffer_size` para 50000 e o valor da sessão para 1.000.000:

```sql
SET @@GLOBAL.sort_buffer_size = 50000, sort_buffer_size = 1000000;
```

##### Referências de variáveis do sistema em expressões

Para referenciar o valor de uma variável de sistema em expressões, use um dos modificadores `@@`. Por exemplo, você pode recuperar os valores das variáveis de sistema em uma instrução `SELECT` assim:

```sql
SELECT @@GLOBAL.sql_mode, @@SESSION.sql_mode, @@sql_mode;
```

Nota

Uma referência a uma variável de sistema em uma expressão como `@@var_name` (com `@@` em vez de `@@GLOBAL.` ou `@@SESSION.`) retorna o valor da sessão, se existir, e o valor global, caso contrário. Isso difere de `SET @@var_name = expr`, que sempre se refere ao valor da sessão.
