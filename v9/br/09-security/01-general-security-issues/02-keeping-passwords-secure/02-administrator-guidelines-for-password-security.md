#### 8.1.2.2 Diretrizes do Administrador para Segurança de Senhas

Os administradores de banco de dados devem seguir as diretrizes a seguir para manter as senhas seguras.

O MySQL armazena as senhas dos usuários nas tabelas do sistema `mysql.user`. O acesso a essa tabela nunca deve ser concedido a contas não administrativas.

As senhas das contas podem expirar, portanto, os usuários devem redefiní-las. Consulte a Seção 8.2.15, “Gestão de Senhas”, e a Seção 8.2.16, “Tratamento de Senhas Expirantes pelo Servidor”.

O plugin `validate_password` pode ser usado para impor uma política de senhas aceitáveis. Consulte a Seção 8.4.4, “O Componente de Validação de Senhas”.

Um usuário que tenha acesso para modificar o diretório do plugin (o valor da variável de sistema `plugin_dir`) ou o arquivo `my.cnf` que especifica a localização do diretório do plugin pode substituir plugins e modificar as capacidades fornecidas pelos plugins, incluindo plugins de autenticação.

Arquivos como arquivos de log para os quais as senhas podem ser escritas devem ser protegidos. Consulte a Seção 8.1.2.3, “Senhas e Registro”.