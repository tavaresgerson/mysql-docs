### 25.12.10 Tabelas de variáveis definidas pelo usuário do esquema de desempenho

O Schema de Desempenho fornece uma tabela `user_variables_by_thread` que expõe variáveis definidas pelo usuário. Essas são variáveis definidas dentro de uma sessão específica e incluem um caractere `@` antes do nome; veja Seção 9.4, “Variáveis Definidas pelo Usuário”.

A tabela `user_variables_by_thread` tem as seguintes colunas:

- `THREAD_ID`

  O identificador do thread da sessão em que a variável é definida.

- `VARIAVEL_NOME`

  O nome da variável, sem o caractere inicial `@`.

- `VARIABLE_VALUE`

  O valor variável.

A operação `TRUNCATE TABLE` não é permitida para a tabela `user_variables_by_thread`.
