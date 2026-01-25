### 6.4.1 Plugins de Autenticação

[6.4.1.1 Autenticação Pluggable Nativa](native-pluggable-authentication.html)

[6.4.1.2 Autenticação Pluggable Nativa Antiga](old-native-pluggable-authentication.html)

[6.4.1.3 Migrando do Hash de Senha Pré-4.1 e do Plugin mysql_old_password](account-upgrades.html)

[6.4.1.4 Autenticação Pluggable Caching SHA-2](caching-sha2-pluggable-authentication.html)

[6.4.1.5 Autenticação Pluggable SHA-256](sha256-pluggable-authentication.html)

[6.4.1.6 Autenticação Pluggable Cleartext no Lado do Cliente](cleartext-pluggable-authentication.html)

[6.4.1.7 Autenticação Pluggable PAM](pam-pluggable-authentication.html)

[6.4.1.8 Autenticação Pluggable Windows](windows-pluggable-authentication.html)

[6.4.1.9 Autenticação Pluggable LDAP](ldap-pluggable-authentication.html)

[6.4.1.10 Autenticação Pluggable Sem Login (No-Login)](no-login-pluggable-authentication.html)

[6.4.1.11 Autenticação Pluggable de Credencial Peer por Socket](socket-pluggable-authentication.html)

[6.4.1.12 Autenticação Pluggable de Teste](test-pluggable-authentication.html)

[6.4.1.13 Variáveis de Sistema de Autenticação Pluggable](pluggable-authentication-system-variables.html)

As seções a seguir descrevem os métodos de autenticação pluggable disponíveis no MySQL e os plugins que implementam esses métodos. Para uma discussão geral do processo de autenticação, consulte [Seção 6.2.13, “Autenticação Pluggable”](pluggable-authentication.html "6.2.13 Autenticação Pluggable").

O plugin padrão é indicado pelo valor da variável de sistema [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin).