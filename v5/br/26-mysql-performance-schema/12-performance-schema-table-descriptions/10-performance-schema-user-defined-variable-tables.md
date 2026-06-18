### 25.12.10 Tabelas de Variáveis Definidas pelo Usuário do Performance Schema

O Performance Schema fornece a Table `user_variables_by_thread` que expõe variáveis definidas pelo usuário. Essas são variáveis definidas dentro de uma Session específica e incluem o caractere `@` precedendo o nome; veja Seção 9.4, “Variáveis Definidas pelo Usuário”.

A Table `user_variables_by_thread` possui as seguintes colunas:

* `THREAD_ID`

  O identificador do Thread da Session na qual a variável é definida.

* `VARIABLE_NAME`

  O nome da variável, sem o caractere `@` inicial.

* `VARIABLE_VALUE`

  O valor da variável.

O uso de `TRUNCATE TABLE` não é permitido para a Table `user_variables_by_thread`.
