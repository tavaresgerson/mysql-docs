#### 29.12.14.3 Variáveis do Schema de Desempenho _info Table

A tabela `variables_info` mostra, para cada variável do sistema, a fonte de onde ela foi definida mais recentemente e sua faixa de valores.

A tabela `variables_info` tem as seguintes colunas:

* `VARIABLE_NAME`

  O nome da variável.

* `VARIABLE_SOURCE`

  A fonte de onde a variável foi definida mais recentemente:

  + `COMMAND_LINE`

    A variável foi definida na linha de comando.

  + `COMPILED`

    A variável tem seu valor padrão embutido. `COMPILED` é o valor usado para variáveis não definidas de outra forma.

  + `DYNAMIC`

    A variável foi definida em tempo de execução. Isso inclui variáveis definidas dentro de arquivos especificados usando a variável de sistema `init_file`.

  + `EXPLICIT`

    A variável foi definida a partir de um arquivo de opções com o nome especificado pela opção `--defaults-file`.

  + `EXTRA`

    A variável foi definida a partir de um arquivo de opções com o nome especificado pela opção `--defaults-extra-file`.

  + `GLOBAL`

    A variável foi definida a partir de um arquivo de opções global. Isso inclui arquivos de opções não cobertos por `EXPLICIT`, `EXTRA`, `LOGIN`, `PERSISTED`, `SERVER` ou `USER`.

  + `LOGIN`

    A variável foi definida a partir de um arquivo de caminho de login específico do usuário (`~/.mylogin.cnf`).

  + `PERSISTED`

    A variável foi definida a partir de um arquivo de opção `mysqld-auto.cnf` específico do servidor. Nenhuma linha tem esse valor se o servidor foi iniciado com `persisted_globals_load` desativado.

  + `SERVER`

    A variável foi definida a partir de um arquivo de opção `$MYSQL_HOME/my.cnf` específico do servidor. Para detalhes sobre como o `MYSQL_HOME` é definido, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

  + `USER`

    A variável foi definida a partir de um arquivo de opção `~/.my.cnf` específico do usuário.

* `MIN_VALUE`

  O valor mínimo permitido para a variável. Para uma variável cujo tipo não é numérico, este é sempre 0.

  Esta coluna é desatualizada e está sujeita à remoção em uma futura versão; em vez disso, use a coluna `MIN_VALUE` da tabela `variables_metadata` para obter essas informações.

* `MAX_VALUE`

  O valor máximo permitido para a variável. Para uma variável cujo tipo não é numérico, este é sempre 0.

  Esta coluna é desatualizada e está sujeita à remoção em uma futura versão; em vez disso, use a coluna `MAX_VALUE` da tabela `variables_metadata` para obter essas informações.

* `SET_TIME`

  A hora em que a variável foi definida pela última vez. O padrão é a hora em que o servidor iniciou as variáveis de sistema globais durante a inicialização.

* `SET_USER`, `SET_HOST`

  O nome do usuário e o nome do host do usuário cliente que definiu a variável pela última vez. Se um cliente se conectar como `user17` a partir do host `host34.example.com` usando a conta `'user17'@'%.example.com`, `SET_USER` e `SET_HOST` são `user17` e `host34.example.com`, respectivamente. Para conexões de usuários proxy, esses valores correspondem ao usuário externo (proxy), e não ao usuário proxy contra o qual a verificação de privilégios é realizada. O padrão para cada coluna é a string vazia, indicando que a variável não foi definida desde a inicialização do servidor.

A tabela `variables_info` não tem índices.

A `TRUNCATE TABLE` não é permitida para a tabela `variables_info`.

Se uma variável com um valor de `VARIABLE_SOURCE` diferente de `DYNAMIC` for definida em tempo de execução, `VARIABLE_SOURCE` se torna `DYNAMIC` e `VARIABLE_PATH` se torna a string vazia.

Uma variável de sistema que tem apenas um valor de sessão (como `debug_sync`) não pode ser definida na inicialização ou persistente. Para variáveis de sistema que têm apenas valor de sessão, `VARIABLE_SOURCE` pode ser apenas `COMPILED` ou `DYNAMIC`.

Se uma variável de sistema tiver um valor inesperado de `VARIABLE_SOURCE`, considere o método de inicialização do seu servidor. Por exemplo, **mysqld_safe** lê arquivos de opções e passa certas opções que encontra lá como parte da linha de comando que ele usa para iniciar **mysqld**. Consequentemente, algumas variáveis de sistema que você define em arquivos de opções podem ser exibidas em `variables_info` como `COMMAND_LINE`, em vez de como `GLOBAL` ou `SERVER`, conforme você poderia esperar.

Algumas consultas de exemplo que usam a tabela `variables_info`, com saída representativa:

* Exibir variáveis definidas na linha de comando:

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

* Exibir variáveis definidas a partir de armazenamento persistente:

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

* Conectar `variables_info` com a tabela `global_variables` para exibir os valores atuais das variáveis persistentes, juntamente com sua faixa de valores:

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