### 10/29/10 Tabelas de Variáveis Definidas pelo Usuário do Schema de Desempenho

O Schema de Desempenho fornece uma tabela `user_variables_by_thread` que expõe variáveis definidas pelo usuário. Essas são variáveis definidas dentro de uma sessão específica e incluem um caractere `@` antes do nome; veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

A tabela `user_variables_by_thread` tem as seguintes colunas:

* `THREAD_ID`

  O identificador do thread da sessão em que a variável é definida.

* `VARIABLE_NAME`

  O nome da variável, sem o caractere `@` inicial.

* `VARIABLE_VALUE`

  O valor da variável.

A tabela `user_variables_by_thread` tem esses índices:

* Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `user_variables_by_thread`.