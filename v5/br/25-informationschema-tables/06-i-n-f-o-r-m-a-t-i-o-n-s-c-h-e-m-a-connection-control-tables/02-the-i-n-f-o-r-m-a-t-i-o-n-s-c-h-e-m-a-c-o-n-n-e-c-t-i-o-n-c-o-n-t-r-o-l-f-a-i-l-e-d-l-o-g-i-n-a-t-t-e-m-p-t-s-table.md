### 24.6.2 A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS

Esta tabela fornece informações sobre o número atual de tentativas de *connection* falhas consecutivas por conta (combinação *user*/host). A tabela foi adicionada no MySQL 5.7.17.

A [`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`](information-schema-connection-control-failed-login-attempts-table.html "24.6.2 The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table") possui estas colunas:

* `USERHOST`

  A combinação *user*/host indicando uma conta que teve tentativas de *connection* falhas, no formato `'user_name'@'host_name'`.

* `FAILED_ATTEMPTS`

  O número atual de tentativas de *connection* falhas consecutivas para o valor `USERHOST`. Isso contabiliza todas as tentativas falhas, independentemente de terem sido atrasadas. O número de tentativas para as quais o servidor adicionou um atraso (*delay*) à sua resposta é a diferença entre o valor de `FAILED_ATTEMPTS` e o valor da variável de sistema [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold).

#### Notas

* O *plugin* `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` deve estar ativado para que esta tabela esteja disponível, e o *plugin* `CONNECTION_CONTROL` deve estar ativado ou o conteúdo da tabela estará sempre vazio. Consulte [Seção 6.4.2, “Connection Control Plugins”](connection-control-plugin.html "6.4.2 Connection Control Plugins").

* A tabela contém linhas apenas para contas que tiveram uma ou mais tentativas de *connection* falhas consecutivas sem uma tentativa de sucesso subsequente. Quando uma conta se conecta com sucesso, seu *count* de *connections* falhas é redefinido para zero e o servidor remove qualquer linha correspondente à conta.

* A atribuição de um valor à variável de sistema [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) em tempo de execução (*runtime*) redefine todos os *counters* acumulados de *connections* falhas para zero, o que faz com que a tabela fique vazia.