#### 6.1.2.2 Diretrizes do Administrador para Segurança de Senhas

Administradores de Database devem usar as seguintes diretrizes para manter as senhas seguras.

O MySQL armazena senhas para contas de usuário na tabela de sistema `mysql.user`. O acesso a esta tabela nunca deve ser concedido a nenhuma conta não administrativa.

As senhas de contas podem ser expiradas para que os usuários precisem redefini-las. Consulte [Section 6.2.11, “Gerenciamento de Senhas”](password-management.html "6.2.11 Password Management"), e [Section 6.2.12, “Tratamento de Senhas Expiradas pelo Server”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords").

O `validate_password` plugin pode ser usado para impor uma política de senhas aceitáveis. Consulte [Section 6.4.3, “O Plugin de Validação de Senha”](validate-password.html "6.4.3 The Password Validation Plugin").

Um usuário que tem acesso para modificar o diretório de plugin (o valor da variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)) ou o arquivo `my.cnf` que especifica a localização do diretório de plugin pode substituir plugins e modificar as capacidades fornecidas pelos plugins, incluindo authentication plugins.

Arquivos como Log files nos quais as senhas podem ser escritas devem ser protegidos. Consulte [Section 6.1.2.3, “Senhas e Logging”](password-logging.html "6.1.2.3 Passwords and Logging").