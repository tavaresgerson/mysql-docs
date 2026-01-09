#### 29.12.22.2 Tabela `connection_control_failed_login_attempts`

Esta tabela fornece informações sobre o número atual de tentativas de conexão falhas consecutivas por conta.

A tabela `connection_control_failed_login_attempts` possui as seguintes colunas:

* `USERHOST`

  Nome da conta de usuário MySQL no formato `user@host`.

* `FAILED_ATTEMPTS`

  Número de tentativas de conexão falhas por esse usuário.

Esta tabela é criada e atualizada pelo componente de Controle de Conexão. Ela substitui a tabela do Esquema de Informações `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`, que, assim como os plugins de Controle de Conexão, agora está desatualizada e sujeita à remoção em uma versão futura do MySQL. Para mais informações, consulte a Seção 8.4.2, “O Componente de Controle de Conexão”.