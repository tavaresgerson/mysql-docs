### 24.6.2 A tabela INFORMATION\_SCHEMA CONNECTION\_CONTROL\_FAILED\_LOGIN\_ATTEMPTS

Esta tabela fornece informações sobre o número atual de tentativas de conexão consecutivas falhas por conta (combinação de usuário/host). A tabela foi adicionada no MySQL 5.7.17.

A tabela [`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`](https://pt.wikipedia.org/wiki/T%C3%A2bua_de_informa%C3%A7%C3%A3o-schema-de_conex%C3%A3o_falha_de_tentativas_de_login) tem essas colunas:

- `USERHOST`

  A combinação de usuário/host que indica uma conta que teve tentativas de conexão malsucedidas, no formato `'user_name'@'host_name'`.

- `TENTATIVAS_FALHADAS`

  O número atual de tentativas consecutivas de conexão falhas para o valor `USERHOST`. Este número conta todas as tentativas falhas, independentemente de elas terem sido atrasadas ou não. O número de tentativas para as quais o servidor adicionou um atraso à sua resposta é a diferença entre o valor `FAILED_ATTEMPTS` e o valor da variável de sistema `connection_control_failed_connections_threshold`.

#### Notas

- O plugin `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` deve estar ativado para que essa tabela esteja disponível, e o plugin `CONNECTION_CONTROL` deve estar ativado ou o conteúdo da tabela ficará sempre vazio. Consulte Seção 6.4.2, “Plugins de Controle de Conexão”.

- A tabela contém linhas apenas para contas que tiveram uma ou mais tentativas de conexão falhas consecutivas sem uma tentativa subsequente bem-sucedida. Quando uma conta se conecta com sucesso, sua contagem de tentativas de conexão falhas é zerada e o servidor remove qualquer linha correspondente à conta.

- Atribuir um valor à variável de sistema `connection_control_failed_connections_threshold` no momento da execução reinicia todos os contadores acumulados de conexões falhas para zero, o que faz com que a tabela fique vazia.
