### 28.6.2 A Tabela `INFORMATION_SCHEMA.CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`

Esta tabela fornece informações sobre o número atual de tentativas de conexão falhas consecutivas por conta (combinação de usuário/host).

Nota

Esta tabela está desatualizada, assim como os plugins de Controle de Conexão; os usuários são incentivados a migrar para o componente Controle de Conexão, que fornece uma tabela equivalente do Schema de Desempenho `connection_control_failed_login_attempts`. Consulte a Seção 8.4.2, “O Componente Controle de Conexão”.

`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` tem as seguintes colunas:

* `USERHOST`

  A combinação de usuário/host que indica uma conta que teve tentativas de conexão falhas, no formato `'user_name'@'host_name'`.

* `FAILED_ATTEMPTS`

  O número atual de tentativas de conexão falhas consecutivas para o valor `USERHOST`. Isso conta todas as tentativas falhas, independentemente de elas terem sido adiadas. O número de tentativas para as quais o servidor adicionou um atraso à sua resposta é a diferença entre o valor `FAILED_ATTEMPTS` e o valor da variável de sistema `connection_control_failed_connections_threshold`.

#### Notas

* O plugin `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` deve estar ativado para que esta tabela esteja disponível, e o plugin `CONNECTION_CONTROL` deve estar ativado ou o conteúdo da tabela estará sempre vazio. Consulte a Seção 8.4.3, “Plugins de Controle de Conexão”.

* A tabela contém linhas apenas para contas que tiveram uma ou mais tentativas de conexão falhas consecutivas sem uma tentativa de conexão bem-sucedida subsequente. Quando uma conta se conecta com sucesso, sua contagem de tentativas de conexão falhas é zerada e o servidor remove qualquer linha correspondente à conta.

* Atribuir um valor à variável de sistema `connection_control_failed_connections_threshold` no momento da execução reinicia todos os contadores acumulados de conexões falhas para zero, o que faz com que a tabela fique vazia.