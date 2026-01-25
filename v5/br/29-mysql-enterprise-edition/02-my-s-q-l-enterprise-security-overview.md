## 28.2 Visão Geral do MySQL Enterprise Security

O MySQL Enterprise Edition fornece plugins que implementam recursos de segurança utilizando serviços externos:

* O MySQL Enterprise Edition inclui um plugin de authentication que permite ao MySQL Server utilizar LDAP (Lightweight Directory Access Protocol) para autenticar usuários MySQL. A authentication LDAP suporta métodos de authentication de nome de usuário e senha, SASL e GSSAPI/Kerberos para serviços LDAP. Para mais informações, consulte a Seção 6.4.1.9, “Authentication Plugável LDAP”.

* O MySQL Enterprise Edition inclui um plugin de authentication que permite ao MySQL Server utilizar Kerberos Nativo para autenticar usuários MySQL usando seus Principals Kerberos. Para mais informações, consulte Authentication Plugável Kerberos.

* O MySQL Enterprise Edition inclui um plugin de authentication que permite ao MySQL Server utilizar PAM (Pluggable Authentication Modules) para autenticar usuários MySQL. O PAM permite que um sistema utilize uma interface padrão para acessar vários tipos de métodos de authentication, como senhas Unix ou um diretório LDAP. Para mais informações, consulte a Seção 6.4.1.7, “Authentication Plugável PAM”.

* O MySQL Enterprise Edition inclui um plugin de authentication que realiza authentication externa no Windows, permitindo ao MySQL Server usar serviços nativos do Windows para autenticar conexões client. Usuários que fizeram login no Windows podem se conectar de programas client MySQL ao server com base nas informações em seu ambiente sem especificar uma senha adicional. Para mais informações, consulte a Seção 6.4.1.8, “Authentication Plugável Windows”.

* O MySQL Enterprise Edition inclui um conjunto de funções de masking (mascaramento) e desidentificação que realizam subsetting, geração aleatória e substituição de dicionário para desidentificar strings, numéricos, números de telefone, emails e muito mais. Essas funções permitem o masking de dados existentes usando vários métodos, como ofuscação (remoção de características de identificação), geração de dados aleatórios formatados e substituição ou permuta de dados. Para mais informações, consulte a Seção 6.5, “MySQL Enterprise Data Masking and De-Identification”.

* O MySQL Enterprise Edition inclui um conjunto de funções de criptografia baseadas na biblioteca OpenSSL que expõem as capacidades do OpenSSL no nível SQL. Para mais informações, consulte a Seção 28.3, “Visão Geral do MySQL Enterprise Encryption”.

* O MySQL Enterprise Edition 5.7 e superior inclui um plugin de keyring que utiliza o Oracle Key Vault como backend para armazenamento de keyring. Para mais informações, consulte a Seção 6.4.4, “O Keyring do MySQL”.

* O MySQL Transparent Data Encryption (TDE) fornece criptografia at-rest para o MySQL Server para todos os arquivos que possam conter dados sensíveis. Para mais informações, consulte a Seção 14.14, “Criptografia Data-at-Rest do InnoDB”, Criptografando Arquivos de Binary Log e Arquivos de Relay Log, e Criptografando Arquivos de Audit Log.

Para outros recursos de segurança Enterprise relacionados, consulte a Seção 28.3, “Visão Geral do MySQL Enterprise Encryption”.