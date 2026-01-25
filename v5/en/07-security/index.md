# Capítulo 6 Segurança

**Índice**

[6.1 Problemas Gerais de Segurança](general-security-issues.html) :   [6.1.1 Diretrizes de Segurança](security-guidelines.html)

    [6.1.2 Mantendo Senhas Seguras](password-security.html)

    [6.1.3 Tornando o MySQL Seguro Contra Atacantes](security-against-attack.html)

    [6.1.4 Opções e Variáveis do mysqld Relacionadas à Segurança](security-options.html)

    [6.1.5 Como Executar o MySQL como um Usuário Normal](changing-mysql-user.html)

    [6.1.6 Considerações de Segurança para LOAD DATA LOCAL](load-data-local-security.html)

    [6.1.7 Diretrizes de Segurança para Programação de Clientes](secure-client-programming.html)

[6.2 Controle de Acesso e Gerenciamento de Contas](access-control.html) :   [6.2.1 Nomes de Usuário e Senhas de Contas](user-names.html)

    [6.2.2 Privilégios Fornecidos pelo MySQL](privileges-provided.html)

    [6.2.3 Grant Tables](grant-tables.html)

    [6.2.4 Especificando Nomes de Contas](account-names.html)

    [6.2.5 Controle de Acesso, Estágio 1: Verificação de Conexão](connection-access.html)

    [6.2.6 Controle de Acesso, Estágio 2: Verificação de Request](request-access.html)

    [6.2.7 Adicionando Contas, Atribuindo Privilégios e Removendo Contas](creating-accounts.html)

    [6.2.8 Contas Reservadas](reserved-accounts.html)

    [6.2.9 Quando as Mudanças de Privilégio Entram em Vigor](privilege-changes.html)

    [6.2.10 Atribuindo Senhas de Contas](assigning-passwords.html)

    [6.2.11 Gerenciamento de Senhas](password-management.html)

    [6.2.12 Tratamento de Senhas Expiradas pelo Servidor](expired-password-handling.html)

    [6.2.13 Autenticação Pluggable](pluggable-authentication.html)

    [6.2.14 Usuários Proxy](proxy-users.html)

    [6.2.15 Bloqueio de Contas (Account Locking)](account-locking.html)

    [6.2.16 Configurando Limites de Recurso de Conta](user-resources.html)

    [6.2.17 Solucionando Problemas de Conexão ao MySQL](problems-connecting.html)

    [6.2.18 Auditoria de Atividade de Conta Baseada em SQL](account-activity-auditing.html)

[6.3 Usando Conexões Criptografadas](encrypted-connections.html) :   [6.3.1 Configurando o MySQL para Usar Conexões Criptografadas](using-encrypted-connections.html)

    [6.3.2 Protocolos TLS e Ciphers de Conexão Criptografada](encrypted-connection-protocols-ciphers.html)

    [6.3.3 Criando Certificados e Chaves SSL e RSA](creating-ssl-rsa-files.html)

    [6.3.4 Capacidades Dependentes da Biblioteca SSL](ssl-libraries.html)

    [6.3.5 Conectando-se ao MySQL Remotamente a partir do Windows com SSH](windows-and-ssh.html)

[6.4 Plugins de Segurança](security-plugins.html) :   [6.4.1 Plugins de Autenticação](authentication-plugins.html)

    [6.4.2 Plugins de Controle de Conexão](connection-control-plugin.html)

    [6.4.3 O Plugin de Validação de Senha](validate-password.html)

    [6.4.4 O Keyring do MySQL](keyring.html)

    [6.4.5 MySQL Enterprise Audit](audit-log.html)

    [6.4.6 MySQL Enterprise Firewall](firewall.html)

[6.5 Mascaramento e Desidentificação de Dados do MySQL Enterprise](data-masking.html) :   [6.5.1 Elementos de Mascaramento e Desidentificação de Dados do MySQL Enterprise](data-masking-elements.html)

    [6.5.2 Instalando ou Desinstalando o Mascaramento e Desidentificação de Dados do MySQL Enterprise](data-masking-installation.html)

    [6.5.3 Usando o Mascaramento e Desidentificação de Dados do MySQL Enterprise](data-masking-usage.html)

    [6.5.4 Referência de Função de Mascaramento e Desidentificação de Dados do MySQL Enterprise](data-masking-function-reference.html)

    [6.5.5 Descrições de Função de Mascaramento e Desidentificação de Dados do MySQL Enterprise](data-masking-functions.html)

[6.6 Criptografia do MySQL Enterprise (Enterprise Encryption)](enterprise-encryption.html) :   [6.6.1 Instalação da Criptografia do MySQL Enterprise](enterprise-encryption-installation.html)

    [6.6.2 Uso e Exemplos da Criptografia do MySQL Enterprise](enterprise-encryption-usage.html)

    [6.6.3 Referência de Função da Criptografia do MySQL Enterprise](enterprise-encryption-function-reference.html)

    [6.6.4 Descrições de Função da Criptografia do MySQL Enterprise](enterprise-encryption-functions.html)

[6.7 SELinux](selinux.html) :   [6.7.1 Verificando se o SELinux Está Ativado](selinux-checking.html)

    [6.7.2 Alterando o Modo SELinux](selinux-mode.html)

    [6.7.3 Políticas SELinux do MySQL Server](selinux-policies.html)

    [6.7.4 Contexto de Arquivo SELinux](selinux-file-context.html)

    [6.7.5 Contexto de Porta TCP SELinux](selinux-context-tcp-port.html)

    [6.7.6 Solução de Problemas do SELinux](selinux-troubleshooting.html)

Ao pensar sobre segurança em uma instalação MySQL, você deve considerar uma ampla gama de tópicos possíveis e como eles afetam a segurança do seu MySQL Server e aplicações relacionadas:

* Fatores gerais que afetam a segurança. Estes incluem a escolha de boas senhas, não conceder Privileges desnecessários aos usuários, garantir a segurança da aplicação prevenindo SQL injections e corrupção de dados, entre outros. Consulte [Seção 6.1, “Problemas Gerais de Segurança”](general-security-issues.html "6.1 Problemas Gerais de Segurança").

* Segurança da própria instalação. Os arquivos de dados, arquivos de log e todos os arquivos de aplicação da sua instalação devem ser protegidos para garantir que não possam ser lidos ou escritos por partes não autorizadas. Para mais informações, consulte [Seção 2.9, “Configuração e Teste Pós-instalação”](postinstallation.html "2.9 Configuração e Teste Pós-instalação").

* Controle de acesso e segurança dentro do próprio sistema Database, incluindo os usuários e Databases com acesso concedido aos Databases, views e stored programs em uso. Para mais informações, consulte [Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”](access-control.html "6.2 Controle de Acesso e Gerenciamento de Contas").

* Os recursos oferecidos pelos plugins relacionados à segurança. Consulte [Seção 6.4, “Plugins de Segurança”](security-plugins.html "6.4 Plugins de Segurança").

* Segurança de rede do MySQL e do seu sistema. A segurança está relacionada aos grants para usuários individuais, mas você também pode desejar restringir o MySQL para que ele esteja disponível apenas localmente no host do MySQL Server, ou para um conjunto limitado de outros hosts.

* Certifique-se de ter backups adequados e apropriados dos seus arquivos Database, de configuração e log files. Certifique-se também de ter uma solução de recuperação em vigor e teste se você é capaz de recuperar com sucesso as informações de seus backups. Consulte [Capítulo 7, *Backup and Recovery*](backup-and-recovery.html "Capítulo 7 Backup and Recovery").

**Nota**

Vários tópicos neste capítulo também são abordados no [Secure Deployment Guide](/doc/mysql-secure-deployment-guide/5.7/en/), que fornece procedimentos para deploy de uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação MySQL.