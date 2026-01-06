### 6.4.1 Plugins de autenticação

6.4.1.1 Autenticação Pluggable Nativa

6.4.1.2 Autenticação Pluggable Native Antiga

6.4.1.3 Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql\_old\_password

6.4.1.4 Armazenamento de autenticação substituível SHA-2

6.4.1.5 Autenticação substituível SHA-256

6.4.1.6 Autenticação de texto em claro plugável no lado do cliente

6.4.1.7 Autenticação Pluggable PAM

6.4.1.8 Autenticação Pluggable no Windows

6.4.1.9 Autenticação Conectada a LDAP

6.4.1.10 Autenticação Pluggable sem Login

6.4.1.11 Autenticação de Peer de Soquete Pluggable

6.4.1.12 Testar Autenticação Pluggable

6.4.1.13 Variáveis do Sistema de Autenticação Conectable

As seções a seguir descrevem os métodos de autenticação plugáveis disponíveis no MySQL e os plugins que implementam esses métodos. Para uma discussão geral sobre o processo de autenticação, consulte Seção 6.2.13, “Autenticação Plugável”.

O plugin padrão é indicado pelo valor da variável de sistema `default_authentication_plugin`.
