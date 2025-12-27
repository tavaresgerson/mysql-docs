### 27.3.5 Programas Armazenados em JavaScript — Informações e Opções da Sessão

Para informações gerais sobre rotinas armazenadas no MySQL, consulte a Seção 27.2, “Usando Rotinas Armazenadas”.

O componente MLE fornece uma série de funções carregáveis para trabalhar com sessões de usuários MLE. Essas funções são listadas e descritas aqui:

* `mle_session_reset()`

  Chamar essa função sem argumentos limpa o estado atual da sessão MLE, removendo qualquer saída observável de `mle_session_state()`. Também redefere o fuso horário da sessão, para que chamadas subsequentes a rotinas armazenadas em JavaScript usem o fuso horário definido mais recentemente na sessão.

  Essa função aceita um argumento de string opcional. Os valores possíveis e seus efeitos são listados aqui:

  + `"stdout"`: Limpa `stdout`.

  + `"stderr"`: Limpa `stderr`.

  + `"output"`: Limpa tanto `stdout` quanto `stderr`.

  Chamar essa função sem argumentos continua a funcionar como fazia nas versões anteriores do MySQL, limpando tanto `stderr` quanto `stdout`, além de limpar a traça de pilha e redefinir o fuso horário da sessão.

* `mle_session_state()`

  Use essa função carregável para obter informações sobre a sessão da rotina armazenada MLE que foi executada mais recentemente. `mle_session_state()` aceita um argumento, uma chave de estado de sessão (uma string), e exibe um valor de estado de sessão. Um valor de estado de sessão é limitado a um tamanho máximo de 64K (equivalente a 16000 caracteres de 4 bytes). Esse é um buffer cíclico; quando o espaço disponível for usado, uma nova entrada substitui a mais antiga. As chaves possíveis de estado de sessão são listadas aqui, com suas descrições:

  + `is_active`: Retorna `1` se a sessão atual do usuário MySQL for uma sessão MLE, caso contrário, `0`.

  + `stdout`: Exiba qualquer coisa escrita pelo programa armazenado usando `console.log()`.

+ `stderr`: Exiba qualquer coisa escrita pelo programa armazenado usando `console.error()`.

  + `stack_trace`: Se a execução do programa armazenado MLE não for bem-sucedida, este contém uma traça de pilha que pode ajudar a identificar a origem do erro.

    Erros de sintaxe e erros semelhantes encontrados por uma declaração `CREATE FUNCTION` ou `CREATE PROCEDURE` não são escritos aqui, apenas erros de tempo de execução levantados durante a execução de uma função armazenada ou procedimento armazenado.

  + `stored_functions`: Retorna o número de funções armazenadas atualmente em cache na sessão atual.

  + `stored_procedures`: Retorna o número de procedimentos armazenados atualmente em cache na sessão atual.

  + `stored_programs`: Retorna o número de programas armazenados atualmente em cache (funções armazenadas e procedimentos armazenados) na sessão atual.

  A chave de estado da sessão é um valor literal de string e deve ser citado.

  Antes da invocação de quaisquer programas armazenados MLE, todos esses três valores de estado da sessão estão vazios. Sair do cliente e reiniciar a sessão limpa todos eles.

  Os dois exemplos seguintes ilustram a recuperação dos valores do estado da sessão. Começamos criando um procedimento armazenado `mle_states()` que exibe todos os valores do estado da sessão, assim:

  ```
  mysql> delimiter //
  mysql> CREATE PROCEDURE mle_states()
      -> BEGIN
      ->   SELECT
      ->     mle_session_state("is_active") AS '-ACTIVE-',
      ->     mle_session_state("stdout") AS '-STDOUT-',
      ->     mle_session_state("stderr") AS '-STDERR-',
      ->     mle_session_state("stack_trace") AS '-STACK-',
      ->     mle_session_state("stored_functions") AS '-FUNCS-',
      ->     mle_session_state("stored_procedures") AS '-PROCS-',
      ->     mle_session_state("stored_programs") AS '-PROGS-';
      -> END//
  Query OK, 0 rows affected (0.02 sec)

  mysql> delimiter ;
  ```

  Antes de executar quaisquer programas armazenados MLE, todos os valores na saída de `mle_states()` são `0` ou vazios, como mostrado aqui:

  ```
  mysql> CALL mle_states();
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 0        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Agora, criamos um procedimento armazenado JavaScript `pc1()` que usa `console.log()` e `console.error()` em um loop curto para escrever várias vezes em `stdout` e em `stderr`, assim:

  ```
  mysql> CREATE PROCEDURE pc1()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>
      $>   do  {
      $>     console.log(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

Após a execução da instrução `CREATE PROCEDURE` mostrada anteriormente, `mle_states()` mostra uma sessão MLE ativa. Ainda não foram executados programas armazenados, portanto, nenhum foi armazenado; isso significa que as colunas que refletem funções, procedimentos e programas armazenados em JavaScript mostram todos `0`. A saída é mostrada aqui:

```
  mysql> CALL mle_states;
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 1        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ``` ``) nos permite usar a interpolação de variáveis na saída. Se você não estiver familiarizado com esse mecanismo de citação, consulte [Literais de Template](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Template_literals) no Mozilla Developer para mais informações.

A invocação de `pc1()` seguida por `mle_states()` produz o resultado mostrado aqui:

```
  mysql> CALL pc1();
  Query OK, 0 rows affected (0.00 sec)

  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

   -STACK-:
   -FUNCS-: 0
   -PROCS-: 1
   -PROGS-: 1
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```cLrTcf8qBT
Como nenhum erro foi produzido por `pc1()`, a traça de pilha permanece vazia. Para testar a traça de pilha, podemos criar uma cópia modificada de `pc1()` na qual alteramos a referência para `console.log()` para a função indefinida `console.lob()`, assim:

```
  mysql> CALL pc1();
  Query OK, 0 rows affected (0.00 sec)

  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.
  This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.
  This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

   -STACK-:
   -FUNCS-: 0
   -PROCS-: 1
   -PROGS-: 1
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

```
  mysql> CREATE PROCEDURE pc2()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>   do  {
      $>     console.lob(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

```
  CREATE PROCEDURE pc2()
  LANGUAGE JAVASCRIPT AS
    $$
     let x = 0
     do  {
       console.lob(`This is message #${++x} to stdout.`)
       console.error(`This is message #${x} to stderr.`)
     }
     while(x < 3)
    $$
  ;
  ```W5jtpQAMHP
```
  mysql> CREATE PROCEDURE pc2()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>   do  {
      $>     console.lob(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```j3Fsl18qgF```
  mysql> CALL pc2();
  ERROR 6113 (HY000): JavaScript> TypeError: (intermediate value).lob is not a function
  ```wsWpuV9EXC```
  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.
  This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.
  This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

  -STACK-: <js> pc2:3:6-54

  -FUNCS-: 0
  -PROCS-: 2
  -PROGS-: 2
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```blxevheobR```
  mysql> SELECT mle_session_reset();
  mysql> SELECT mle_session_reset();
  +------------------------------------------+
  | mle_session_reset()                      |
  +------------------------------------------+
  | The session state is successfully reset. |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```4cTAESqdAL```
  mysql> CALL mle_states;
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 0        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```J7ZGKhb1Aj```
  mysql> SELECT gcd(536, 1676); // Call JS stored function
  +----------------+
  | gcd(536, 1676) |
  +----------------+
  |              4 |
  +----------------+
  1 row in set (0.00 sec)

  mysql> SELECT mle_set_session_state('{"integer_type":"BIGINT"}');
  ERROR 1123 (HY000): Can't initialize function 'mle_set_session_state'; Cannot
  set options of an active session. Please reset the session first.
  ```pyYf7gJIaS```
  mysql> SELECT mle_session_reset();
  +------------------------------------------+
  | mle_session_reset()                      |
  +------------------------------------------+
  | The session state is successfully reset. |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```BUrIi6Y9Zr```
  mysql> SELECT mle_set_session_state('{"integer_type":"BIGINT"}');
  +----------------------------------------------------+
  | mle_set_session_state('{"integer_type":"BIGINT"}') |
  +----------------------------------------------------+
  |                                                  1 |
  +----------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT mle_set_session_state('{"decimal_type":"Number"}');
  +----------------------------------------------------+
  | mle_set_session_state('{"decimal_type":"Number"}') |
  +----------------------------------------------------+
  |                                                  1 |
  +----------------------------------------------------+
  1 row in set (0.00 sec)
  ```PcyDSci3GT```
mysql> SELECT * FROM performance_schema.setup_instruments
     > WHERE NAME LIKE '%language_component%'\G
*************************** 1. row ***************************
         NAME: memory/language_component/session
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: controlled_by_default
        FLAGS: controlled
   VOLATILITY: 0
DOCUMENTATION: Session-specific allocations for the Language component
1 row in set (0.00 sec)
```Exz5RCjFme```

Para obter mais informações sobre essas e tabelas relacionadas do Schema de Desempenho, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

O uso de memória pelo componente MLE em uma sessão de usuário específica está sujeito ao limite imposto pela variável de sistema `connection_memory_limit`. Consulte a descrição dessa variável para obter mais informações.