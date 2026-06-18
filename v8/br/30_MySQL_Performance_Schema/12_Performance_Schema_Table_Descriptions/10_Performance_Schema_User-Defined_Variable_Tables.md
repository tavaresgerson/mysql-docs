### 29.12.10 Tabelas de variáveis definidas pelo usuário do esquema de desempenho

O Schema de Desempenho fornece uma tabela `user_variables_by_thread` que expõe variáveis definidas pelo usuário. Essas são variáveis definidas dentro de uma sessão específica e incluem um caractere `@` antes do nome; veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

A tabela `user_variables_by_thread` tem essas colunas:

- `THREAD_ID`

  O identificador do fio da sessão em que a variável é definida.

- `VARIABLE_NAME`

  O nome da variável, sem o caractere inicial `@`.

- `VARIABLE_VALUE`

  O valor variável.

A tabela `user_variables_by_thread` tem esses índices:

- Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `user_variables_by_thread`.
