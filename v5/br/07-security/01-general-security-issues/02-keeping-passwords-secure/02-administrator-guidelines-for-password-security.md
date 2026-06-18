#### 6.1.2.2 Diretrizes do administrador para a segurança da senha

Os administradores de banco de dados devem seguir as diretrizes a seguir para manter as senhas seguras.

O MySQL armazena senhas para contas de usuário na tabela `mysql.user` do sistema. O acesso a essa tabela nunca deve ser concedido a contas não administrativas.

As senhas das contas podem expirar, portanto os usuários devem redefiní-las. Consulte Seção 6.2.11, “Gestão de Senhas” e Seção 6.2.12, “Tratamento de Senhas Expirantes pelo Servidor”.

O plugin `validate_password` pode ser usado para impor uma política sobre a senha aceitável. Veja Seção 6.4.3, “O Plugin de Validação de Senha”.

Um usuário que tenha acesso para modificar o diretório do plugin (o valor da variável de sistema `plugin_dir` ou o arquivo `my.cnf` que especifica a localização do diretório do plugin) pode substituir plugins e modificar as capacidades fornecidas pelos plugins, incluindo plugins de autenticação.

Arquivos, como arquivos de registro, para os quais as senhas podem ser escritas, devem ser protegidos. Consulte Seção 6.1.2.3, “Senhas e Registro de Eventos”.
