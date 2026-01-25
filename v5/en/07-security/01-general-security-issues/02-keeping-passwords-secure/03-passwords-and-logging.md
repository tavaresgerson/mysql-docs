#### 6.1.2.3 Senhas e Logging

Senhas podem ser escritas como *plain text* (texto simples) em comandos SQL como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), e comandos que invocam a função [`PASSWORD()`](encryption-functions.html#function_password). Se tais comandos são registrados (*logged*) pelo servidor MySQL da forma como são escritos, as senhas neles se tornam visíveis para qualquer pessoa com acesso aos Logs.

O *Statement Logging* evita escrever senhas como *cleartext* (texto não criptografado) para os seguintes comandos:

```sql
CREATE USER ... IDENTIFIED BY ...
ALTER USER ... IDENTIFIED BY ...
GRANT ... IDENTIFIED BY ...
SET PASSWORD ...
SLAVE START ... PASSWORD = ...
CREATE SERVER ... OPTIONS(... PASSWORD ...)
ALTER SERVER ... OPTIONS(... PASSWORD ...)
```

As senhas nesses comandos são reescritas para não aparecerem literalmente no texto do comando registrado no general query log, slow query log e binary log. A reescrita não se aplica a outros comandos. Em particular, comandos [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement") para a tabela de sistema `mysql.user` que referenciam senhas literais são registrados como estão, então você deve evitar tais comandos. (A modificação direta de *grant tables* é desaconselhada, de qualquer forma.)

Para o general query log, a reescrita de senha pode ser suprimida iniciando o servidor com a opção [`--log-raw`](server-options.html#option_mysqld_log-raw). Por razões de segurança, esta opção não é recomendada para uso em produção. Para fins de diagnóstico, pode ser útil ver o texto exato dos comandos conforme recebidos pelo servidor.

O conteúdo do arquivo *audit log* produzido pelo *audit log plugin* não é criptografado. Por razões de segurança, este arquivo deve ser gravado em um diretório acessível apenas ao servidor MySQL e a usuários com um motivo legítimo para visualizar o Log. Consulte [Seção 6.4.5.3, “Considerações de Segurança do MySQL Enterprise Audit”](audit-log-security.html "6.4.5.3 MySQL Enterprise Audit Security Considerations").

Comandos recebidos pelo servidor podem ser reescritos se um *query rewrite plugin* estiver instalado (consulte [Query Rewrite Plugins](/doc/extending-mysql/5.7/en/plugin-types.html#query-rewrite-plugin-type)). Neste caso, a opção [`--log-raw`](server-options.html#option_mysqld_log-raw) afeta o *statement logging* da seguinte forma:

* Sem [`--log-raw`](server-options.html#option_mysqld_log-raw), o servidor registra o comando retornado pelo *query rewrite plugin*. Isso pode diferir do comando conforme recebido.

* Com [`--log-raw`](server-options.html#option_mysqld_log-raw), o servidor registra o comando original conforme recebido.

Uma implicação da reescrita de senha é que os comandos que não podem ser *parsed* (analisados sintaticamente) (devido, por exemplo, a erros de sintaxe) não são escritos no general query log porque não se pode garantir que estejam livres de senhas. Casos de uso que exigem o Logging de todos os comandos, incluindo aqueles com erros, devem usar a opção [`--log-raw`](server-options.html#option_mysqld_log-raw), lembrando que isso também ignora a reescrita de senha.

A reescrita de senha ocorre apenas quando senhas em *plain text* são esperadas. Para comandos com sintaxe que espera um valor de *password hash*, nenhuma reescrita ocorre. Se uma senha em *plain text* for fornecida erroneamente para tal sintaxe, a senha é registrada conforme fornecida, sem reescrita. Por exemplo, o seguinte comando é registrado conforme exibido porque um valor de *password hash* é esperado:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

Para proteger os *log files* contra exposição indevida, localize-os em um diretório que restrinja o acesso ao servidor e ao administrador do Database. Se o servidor registra Logs em tabelas no Database `mysql`, conceda acesso a essas tabelas apenas ao administrador do Database.

Replicas armazenam a senha para a fonte de *replication* no repositório de informações da fonte, que pode ser um arquivo ou uma tabela (consulte [Seção 16.2.4, “Repositórios de Relay Log e Metadados de Replication”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")). Garanta que o repositório possa ser acessado apenas pelo administrador do Database. Uma alternativa para armazenar a senha em um arquivo é usar o comando [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") para especificar credenciais para conexão com a fonte.

Use um modo de acesso restrito para proteger backups de Database que incluem tabelas de Log ou *log files* contendo senhas.