## 32.2 Visão Geral da Segurança da Edição Empresarial do MySQL

A Edição Empresarial do MySQL oferece plugins que implementam recursos de segurança usando serviços externos:

* A Edição Empresarial do MySQL inclui um plugin de autenticação que permite que o MySQL Server use o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL. As autenticações LDAP suportam métodos de autenticação de nome de usuário e senha, SASL e GSSAPI/Kerberos para serviços LDAP. Para mais informações, consulte a Seção 8.4.1.6, “Autenticação Personalizável LDAP”.

* A Edição Empresarial do MySQL inclui um plugin de autenticação que permite que o MySQL Server use o Kerberos nativo para autenticar usuários do MySQL usando seus Principais Kerberos. Para mais informações, consulte a Seção 8.4.1.7, “Autenticação Personalizável Kerberos”.

* A Edição Empresarial do MySQL inclui um plugin de autenticação que permite que o MySQL Server use o PAM (Pluggable Authentication Modules) para autenticar usuários do MySQL. O PAM permite que um sistema use uma interface padrão para acessar vários tipos de métodos de autenticação, como senhas Unix ou um diretório LDAP. Para mais informações, consulte a Seção 8.4.1.4, “Autenticação Personalizável PAM”.

* A Edição Empresarial do MySQL inclui um plugin de autenticação que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que fizeram login no Windows podem se conectar a partir de programas clientes do MySQL ao servidor com base nas informações de seu ambiente sem especificar uma senha adicional. Para mais informações, consulte a Seção 8.4.1.5, “Autenticação Personalizável Windows”.

* A Edição Empresarial do MySQL inclui um conjunto de funções de mascaramento e desidentificação que realizam subseção, geração aleatória e substituição de dicionário para desidentificar strings, números, números de telefone, e-mails e mais. Essas funções permitem o mascaramento de dados existentes usando vários métodos, como ofuscação (remoção de características identificadoras), geração de dados aleatórios formatados e substituição ou substituição de dados. Para mais informações, consulte a Seção 8.5, “MySQL Enterprise Data Masking”.

* A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia baseadas na biblioteca OpenSSL que expõem as capacidades da OpenSSL no nível SQL. Para mais informações, consulte a Seção 32.3, “MySQL Enterprise Encryption Overview”.

* A Edição Empresarial do MySQL 5.7 e superior inclui um plugin de chaveira que usa o Oracle Key Vault como backend para armazenamento de chaveira. Para mais informações, consulte a Seção 8.4.5, “O MySQL Keyring”.

* A MySQL Transparent Data Encryption (TDE) fornece criptografia em repouso para o MySQL Server para todos os arquivos que possam conter dados sensíveis. Para mais informações, consulte a Seção 17.13, “InnoDB Data-at-Rest Encryption”, a Seção 19.3.2, “Encrypting Binary Log Files and Relay Log Files” e Encrypting Audit Log Files.

Para outras características de segurança Empresarial relacionadas, consulte a Seção 32.3, “MySQL Enterprise Encryption Overview”.