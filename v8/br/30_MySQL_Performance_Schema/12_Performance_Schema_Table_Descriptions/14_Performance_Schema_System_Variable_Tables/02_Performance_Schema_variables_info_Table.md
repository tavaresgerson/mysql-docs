#### 29.12.14.2 Tabela de variáveis do esquema de desempenho \_info

A tabela `variables_info` mostra, para cada variável do sistema, a fonte de onde ela foi definida mais recentemente e sua faixa de valores.

A tabela `variables_info` tem essas colunas:

- `VARIABLE_NAME`

  O nome da variável.

- `VARIABLE_SOURCE`

  A fonte da qual a variável foi definida mais recentemente:

  - `COMMAND_LINE`

    A variável foi definida na linha de comando.

  - `COMPILED`

    A variável tem seu valor padrão embutido. `COMPILED` é o valor usado para variáveis que não foram definidas de outra forma.

  - `DYNAMIC`

    A variável foi definida durante a execução. Isso inclui variáveis definidas dentro de arquivos especificados usando a variável de sistema `init_file`.

  - `EXPLICIT`

    A variável foi definida a partir de um arquivo de opções com o nome `--defaults-file`.

  - `EXTRA`

    A variável foi definida a partir de um arquivo de opções com o nome `--defaults-extra-file`.

  - `GLOBAL`

    A variável foi definida a partir de um arquivo de opção global. Isso inclui arquivos de opção não cobertos por `EXPLICIT`, `EXTRA`, `LOGIN`, `PERSISTED`, `SERVER` ou `USER`.

  - `LOGIN`

    A variável foi definida a partir de um arquivo de caminho de login específico do usuário (`~/.mylogin.cnf`).

  - `PERSISTED`

    A variável foi definida a partir de um arquivo de opção `mysqld-auto.cnf` específico do servidor. Nenhuma linha tem esse valor se o servidor foi iniciado com `persisted_globals_load` desativado.

  - `SERVER`

    A variável foi definida a partir de um arquivo de opção específico do servidor `$MYSQL_HOME/my.cnf`. Para obter detalhes sobre como o `MYSQL_HOME` é definido, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

  - `USER`

    A variável foi definida a partir de um arquivo de opção `~/.my.cnf` específico do usuário.

- `VARIABLE_PATH`

  Se a variável foi definida a partir de um arquivo de opções, `VARIABLE_PATH` é o nome do caminho desse arquivo. Caso contrário, o valor é a string vazia.

- `MIN_VALUE`

  O valor mínimo permitido para a variável. Para uma variável cujo tipo não é numérico, este é sempre 0.

- `MAX_VALUE`

  O valor máximo permitido para a variável. Para uma variável cujo tipo não é numérico, este é sempre 0.

- `SET_TIME`

  O horário em que a variável foi definida pela última vez. O padrão é o horário em que o servidor inicializou as variáveis de sistema globais durante a inicialização.

- `SET_USER`, `SET_HOST`

  O nome de usuário e o nome do host do usuário cliente que definiu a variável mais recentemente. Se um cliente se conectar como `user17` do host `host34.example.com` usando as contas `'user17'@'%.example.com`, `SET_USER` e `SET_HOST`, os valores correspondentes são `user17` e `host34.example.com`, respectivamente. Para conexões de usuários proxy, esses valores correspondem ao usuário externo (proxy), e não ao usuário proxy contra o qual a verificação de privilégios é realizada. O valor padrão de cada coluna é a string vazia, indicando que a variável não foi definida desde o início do servidor.

A tabela `variables_info` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `variables_info`.

Se uma variável com um valor `VARIABLE_SOURCE` diferente de `DYNAMIC` for definida em tempo de execução, `VARIABLE_SOURCE` se torna `DYNAMIC` e `VARIABLE_PATH` se torna a string vazia.

Uma variável de sistema que tem apenas um valor de sessão (como `debug_sync`) não pode ser definida na inicialização ou persistente. Para variáveis de sistema apenas para sessão, `VARIABLE_SOURCE` pode ser apenas `COMPILED` ou `DYNAMIC`.

Se uma variável de sistema tiver um valor inesperado `VARIABLE_SOURCE`, considere o método de inicialização do seu servidor. Por exemplo, o **mysqld\_safe** lê arquivos de opções e passa certas opções que encontra lá como parte do comando que ele usa para iniciar o **mysqld**. Consequentemente, algumas variáveis de sistema que você define em arquivos de opções podem aparecer em `variables_info` como `COMMAND_LINE`, em vez de como `GLOBAL` ou `SERVER` como você poderia esperar.

Algumas consultas de exemplo que utilizam a tabela `variables_info`, com saída representativa:

- Exibir variáveis definidas na linha de comando:

  ```
  mysql> SELECT VARIABLE_NAME
         FROM performance_schema.variables_info
         WHERE VARIABLE_SOURCE = 'COMMAND_LINE'
         ORDER BY VARIABLE_NAME;
  +---------------+
  | VARIABLE_NAME |
  +---------------+
  | basedir       |
  | datadir       |
  | log_error     |
  | pid_file      |
  | plugin_dir    |
  | port          |
  +---------------+
  ```

- Exibir variáveis exibidas a partir do armazenamento persistente:

  ```
  mysql> SELECT VARIABLE_NAME
         FROM performance_schema.variables_info
         WHERE VARIABLE_SOURCE = 'PERSISTED'
         ORDER BY VARIABLE_NAME;
  +--------------------------+
  | VARIABLE_NAME            |
  +--------------------------+
  | event_scheduler          |
  | max_connections          |
  | validate_password.policy |
  +--------------------------+
  ```

- Conecte a tabela `variables_info` com a tabela `global_variables` para exibir os valores atuais das variáveis persistentes, juntamente com sua faixa de valores:

  ```
  mysql> SELECT
           VI.VARIABLE_NAME, GV.VARIABLE_VALUE,
           VI.MIN_VALUE,VI.MAX_VALUE
         FROM performance_schema.variables_info AS VI
           INNER JOIN performance_schema.global_variables AS GV
           USING(VARIABLE_NAME)
         WHERE VI.VARIABLE_SOURCE = 'PERSISTED'
         ORDER BY VARIABLE_NAME;
  +--------------------------+----------------+-----------+-----------+
  | VARIABLE_NAME            | VARIABLE_VALUE | MIN_VALUE | MAX_VALUE |
  +--------------------------+----------------+-----------+-----------+
  | event_scheduler          | ON             | 0         | 0         |
  | max_connections          | 200            | 1         | 100000    |
  | validate_password.policy | STRONG         | 0         | 0         |
  +--------------------------+----------------+-----------+-----------+
  ```
