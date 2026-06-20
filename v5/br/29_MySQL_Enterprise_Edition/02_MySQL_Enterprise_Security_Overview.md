## 28.2 Visão geral da segurança empresarial do MySQL

A Edição Empresarial do MySQL oferece plugins que implementam recursos de segurança usando serviços externos:

* A Edição Empresarial do MySQL inclui um plugin de autenticação que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL. As autenticações LDAP suportam métodos de autenticação de nome de usuário e senha, SASL e GSSAPI/Kerberos para serviços LDAP. Para mais informações, consulte a Seção 6.4.1.9, “Autenticação de Autenticação Conectada”.

* A Edição Empresarial do MySQL inclui um plugin de autenticação que permite ao MySQL Server usar o Kerberos nativo para autenticar usuários do MySQL usando seus Princípios Kerberos. Para mais informações, consulte Autenticação de Autônoma do Kerberos.

* A Edição Empresarial do MySQL inclui um plugin de autenticação que permite ao MySQL Server usar os módulos de autenticação configuráveis (PAM - Pluggable Authentication Modules) para autenticar os usuários do MySQL. O PAM permite que um sistema use uma interface padrão para acessar vários tipos de métodos de autenticação, como senhas Unix ou um diretório LDAP. Para mais informações, consulte a Seção 6.4.1.7, “Autenticação Configurável PAM”.

* A Edição Empresarial do MySQL inclui um plugin de autenticação que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Os usuários que se cadastraram no Windows podem se conectar ao servidor a partir de programas cliente do MySQL com base nas informações de seu ambiente, sem especificar uma senha adicional. Para mais informações, consulte a Seção 6.4.1.8, “Autenticação Plugável do Windows”.

* A Edição Empresarial do MySQL inclui um conjunto de funções de mascaramento e desidentificação que realizam subconjunto, geração aleatória e substituição de dicionário para desidentificar strings, numerais, números de telefone, e-mails e outros. Essas funções permitem o mascaramento de dados existentes usando vários métodos, como ofuscamento (removendo características identificáveis), geração de dados aleatórios formatados e substituição ou substituição de dados. Para mais informações, consulte a Seção 6.5, “Mascaramento e Desidentificação de Dados Empresariais do MySQL”.

* A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia com base na biblioteca OpenSSL, que expõem as capacidades da OpenSSL no nível SQL. Para mais informações, consulte a Seção 28.3, “Visão geral da criptografia empresarial do MySQL”.

* A Edição Empresarial do MySQL 5.7 e superior inclui um plugin de chave que utiliza o Oracle Key Vault como um banco de dados de armazenamento de chave. Para mais informações, consulte a Seção 6.4.4, “O Keyring do MySQL”.

* A Encriptação de Dados Transparente do MySQL (TDE) oferece encriptação em repouso para o MySQL Server para todos os arquivos que possam conter dados sensíveis. Para mais informações, consulte a Seção 14.14, “Encriptação de Dados em Repouso do InnoDB”, Encriptar Arquivos de Registro Binário e Arquivos de Registro de Relay e Encriptar Arquivos de Registro de Auditoria.

Para outras funcionalidades de segurança da Empresa relacionadas, consulte a Seção 28.3, “Visão geral da criptografia da MySQL Enterprise”.