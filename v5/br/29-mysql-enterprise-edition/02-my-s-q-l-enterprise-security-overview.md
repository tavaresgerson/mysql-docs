## 28.2 Visão geral da segurança empresarial do MySQL

A Edição Empresarial do MySQL oferece plugins que implementam recursos de segurança usando serviços externos:

- A Edição Empresarial do MySQL inclui um plugin de autenticação que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL. As autenticações LDAP suportam métodos de autenticação de nome de usuário e senha, SASL e GSSAPI/Kerberos para serviços LDAP. Para mais informações, consulte a Seção 6.4.1.9, “Autenticação Pluggable LDAP”.

- A Edição Empresarial do MySQL inclui um plugin de autenticação que permite que o MySQL Server use o Kerberos nativo para autenticar usuários do MySQL usando seus Princípios Kerberos. Para obter mais informações, consulte Autenticação de Autenticação de Pluggable Kerberos.

- A Edição Empresarial do MySQL inclui um plugin de autenticação que permite que o MySQL Server use o PAM (Módulos de Autenticação Conectam) para autenticar os usuários do MySQL. O PAM permite que um sistema use uma interface padrão para acessar vários tipos de métodos de autenticação, como senhas Unix ou um diretório LDAP. Para mais informações, consulte a Seção 6.4.1.7, “Autenticação Conectam do PAM”.

- A Edição Empresarial do MySQL inclui um plugin de autenticação que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que estiverem conectados ao Windows podem se conectar a partir de programas clientes do MySQL ao servidor com base nas informações de seu ambiente, sem precisar especificar uma senha adicional. Para obter mais informações, consulte a Seção 6.4.1.8, “Autenticação Conectada ao Windows”.

- A Edição Empresarial do MySQL inclui um conjunto de funções de mascaramento e desidentificação que realizam subseção, geração aleatória e substituição de dicionário para desidentificar strings, números, números de telefone, e-mails e muito mais. Essas funções permitem o mascaramento de dados existentes usando vários métodos, como ofuscação (remoção de características identificadoras), geração de dados aleatórios formatados e substituição ou substituição de dados. Para mais informações, consulte a Seção 6.5, “Mascaramento e Desidentificação de Dados do MySQL Empresarial”.

- A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia com base na biblioteca OpenSSL, que expõem as capacidades da OpenSSL no nível do SQL. Para mais informações, consulte a Seção 28.3, “Visão geral da criptografia empresarial do MySQL”.

- A Edição Empresarial do MySQL 5.7 e superior inclui um plugin de chaveira que utiliza o Oracle Key Vault como backend para armazenamento de chaveiras. Para mais informações, consulte a Seção 6.4.4, “A Chaveira MySQL”.

- O MySQL Transparent Data Encryption (TDE) oferece criptografia em repouso para o MySQL Server para todos os arquivos que possam conter dados sensíveis. Para obter mais informações, consulte a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”, Criptografando Arquivos de Log Binários e Arquivos de Log de Retransmissão e Criptografando Arquivos de Log de Auditoria.

Para obter informações sobre outras funcionalidades de segurança da empresa relacionadas, consulte a Seção 28.3, “Visão geral da criptografia da MySQL Enterprise”.
