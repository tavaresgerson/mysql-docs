# Capítulo 6 Segurança

**Índice**

6.1 Questões Gerais de Segurança :   6.1.1 Diretrizes de Segurança

```
6.1.2 Keeping Passwords Secure

6.1.3 Making MySQL Secure Against Attackers

6.1.4 Security-Related mysqld Options and Variables

6.1.5 How to Run MySQL as a Normal User

6.1.6 Security Considerations for LOAD DATA LOCAL

6.1.7 Client Programming Security Guidelines
```

6.2 Controle de Acesso e Gerenciamento de Contas :   6.2.1 Nomes de Usuários e Senhas de Contas

```
6.2.2 Privileges Provided by MySQL

6.2.3 Grant Tables

6.2.4 Specifying Account Names

6.2.5 Access Control, Stage 1: Connection Verification

6.2.6 Access Control, Stage 2: Request Verification

6.2.7 Adding Accounts, Assigning Privileges, and Dropping Accounts

6.2.8 Reserved Accounts

6.2.9 When Privilege Changes Take Effect

6.2.10 Assigning Account Passwords

6.2.11 Password Management

6.2.12 Server Handling of Expired Passwords

6.2.13 Pluggable Authentication

6.2.14 Proxy Users

6.2.15 Account Locking

6.2.16 Setting Account Resource Limits

6.2.17 Troubleshooting Problems Connecting to MySQL

6.2.18 SQL-Based Account Activity Auditing
```

6.3 Usando Conexões Encriptadas:   6.3.1 Configurando o MySQL para Usar Conexões Encriptadas

```
6.3.2 Encrypted Connection TLS Protocols and Ciphers

6.3.3 Creating SSL and RSA Certificates and Keys

6.3.4 SSL Library-Dependent Capabilities

6.3.5 Connecting to MySQL Remotely from Windows with SSH
```

6.4 Plugins de segurança:   6.4.1 Plugins de autenticação

```
6.4.2 Connection Control Plugins

6.4.3 The Password Validation Plugin

6.4.4 The MySQL Keyring

6.4.5 MySQL Enterprise Audit

6.4.6 MySQL Enterprise Firewall
```

6.5 Máscara de dados e desidentificação do MySQL Enterprise :   6.5.1 Elementos de Máscara de dados e desidentificação do MySQL Enterprise

```
6.5.2 Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification

6.5.3 Using MySQL Enterprise Data Masking and De-Identification

6.5.4 MySQL Enterprise Data Masking and De-Identification Function Reference

6.5.5 MySQL Enterprise Data Masking and De-Identification Function Descriptions
```

6.6 Criptografia do MySQL Enterprise :   6.6.1 Instalação da Criptografia do MySQL Enterprise

```
6.6.2 MySQL Enterprise Encryption Usage and Examples

6.6.3 MySQL Enterprise Encryption Function Reference

6.6.4 MySQL Enterprise Encryption Function Descriptions
```

6.7 SELinux :   6.7.1 Verifique se o SELinux está habilitado

```
6.7.2 Changing the SELinux Mode

6.7.3 MySQL Server SELinux Policies

6.7.4 SELinux File Context

6.7.5 SELinux TCP Port Context

6.7.6 Troubleshooting SELinux
```

Ao pensar em segurança dentro de uma instalação MySQL, você deve considerar uma ampla gama de tópicos possíveis e como eles afetam a segurança do seu servidor MySQL e das aplicações relacionadas:

- Fatores gerais que afetam a segurança. Esses incluem a escolha de senhas boas, não conceder privilégios desnecessários aos usuários, garantir a segurança das aplicações, impedindo injeções SQL e corrupção de dados, entre outros. Veja Seção 6.1, “Problemas Gerais de Segurança”.

- Segurança da própria instalação. Os arquivos de dados, os arquivos de log e todos os arquivos da aplicação da sua instalação devem ser protegidos para garantir que não sejam legíveis ou modificáveis por partes não autorizadas. Para obter mais informações, consulte Seção 2.9, “Configuração e Teste Pós-Instalação”.

- Controle de acesso e segurança dentro do próprio sistema de banco de dados, incluindo os usuários e bancos de dados que têm acesso aos bancos de dados, visualizações e programas armazenados em uso dentro do banco de dados. Para mais informações, consulte Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”.

- As funcionalidades oferecidas pelos plugins relacionados à segurança. Consulte Seção 6.4, “Plugins de Segurança”.

- Segurança da rede do MySQL e do seu sistema. A segurança está relacionada às permissões para usuários individuais, mas você também pode querer restringir o MySQL para que ele esteja disponível apenas localmente no host do servidor MySQL ou para um conjunto limitado de outros hosts.

- Certifique-se de ter backups adequados e apropriados de seus arquivos de banco de dados, arquivos de configuração e arquivos de log. Além disso, certifique-se de que você tem uma solução de recuperação em vigor e teste se você consegue recuperar com sucesso as informações de seus backups. Veja \[Capítulo 7, *Backup e Recuperação*] (backup-and-recovery.html).

Nota

Vários tópicos deste capítulo também são abordados no Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.
