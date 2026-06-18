# Capítulo 8 Segurança

**Índice**

8.1 Questões Gerais de Segurança:   8.1.1 Diretrizes de Segurança

```
8.1.2 Keeping Passwords Secure

8.1.3 Making MySQL Secure Against Attackers

8.1.4 Security-Related mysqld Options and Variables

8.1.5 How to Run MySQL as a Normal User

8.1.6 Security Considerations for LOAD DATA LOCAL

8.1.7 Client Programming Security Guidelines
```

8.2 Controle de Acesso e Gerenciamento de Contas:   8.2.1 Nomes de Usuários e Senhas de Conta

```
8.2.2 Privileges Provided by MySQL

8.2.3 Grant Tables

8.2.4 Specifying Account Names

8.2.5 Specifying Role Names

8.2.6 Access Control, Stage 1: Connection Verification

8.2.7 Access Control, Stage 2: Request Verification

8.2.8 Adding Accounts, Assigning Privileges, and Dropping Accounts

8.2.9 Reserved Accounts

8.2.10 Using Roles

8.2.11 Account Categories

8.2.12 Privilege Restriction Using Partial Revokes

8.2.13 When Privilege Changes Take Effect

8.2.14 Assigning Account Passwords

8.2.15 Password Management

8.2.16 Server Handling of Expired Passwords

8.2.17 Pluggable Authentication

8.2.18 Multifactor Authentication

8.2.19 Proxy Users

8.2.20 Account Locking

8.2.21 Setting Account Resource Limits

8.2.22 Troubleshooting Problems Connecting to MySQL

8.2.23 SQL-Based Account Activity Auditing
```

8.3 Usando Conexões Encriptadas:   8.3.1 Configurando o MySQL para Usar Conexões Encriptadas

```
8.3.2 Encrypted Connection TLS Protocols and Ciphers

8.3.3 Creating SSL and RSA Certificates and Keys

8.3.4 Connecting to MySQL Remotely from Windows with SSH

8.3.5 Reusing SSL Sessions
```

8.4 Componentes de segurança e plugins:   8.4.1 Plugins de autenticação

```
8.4.2 Connection Control Plugins

8.4.3 The Password Validation Component

8.4.4 The MySQL Keyring

8.4.5 MySQL Enterprise Audit

8.4.6 The Audit Message Component

8.4.7 MySQL Enterprise Firewall
```

8.5 Mascagem e Desidentificação de Dados do MySQL Enterprise:   8.5.1 Componentes de Mascagem de Dados versus o Plugin de Mascagem de Dados

```
8.5.2 MySQL Enterprise Data Masking and De-Identification Components

8.5.3 MySQL Enterprise Data Masking and De-Identification Plugin
```

8.6 Criptografia do MySQL Enterprise:   8.6.1 Instalação e atualização da criptografia do MySQL Enterprise

```
8.6.2 Configuring MySQL Enterprise Encryption

8.6.3 MySQL Enterprise Encryption Usage and Examples

8.6.4 MySQL Enterprise Encryption Function Reference

8.6.5 MySQL Enterprise Encryption Component Function Descriptions

8.6.6 MySQL Enterprise Encryption Legacy Function Descriptions
```

8.7 SELinux:   8.7.1 Verifique se o SELinux está habilitado

```
8.7.2 Changing the SELinux Mode

8.7.3 MySQL Server SELinux Policies

8.7.4 SELinux File Context

8.7.5 SELinux TCP Port Context

8.7.6 Troubleshooting SELinux
```

8.8 Suporte FIPS

Ao pensar em segurança dentro de uma instalação MySQL, você deve considerar uma ampla gama de tópicos possíveis e como eles afetam a segurança do seu servidor MySQL e das aplicações relacionadas:

- Fatores gerais que afetam a segurança. Esses incluem a escolha de senhas boas, não conceder privilégios desnecessários aos usuários, garantir a segurança dos aplicativos, impedindo injeções SQL e corrupção de dados, entre outros. Veja a Seção 8.1, “Problemas Gerais de Segurança”.

- Segurança da própria instalação. Os arquivos de dados, os arquivos de log e todos os arquivos da aplicação da sua instalação devem ser protegidos para garantir que não sejam legíveis ou modificáveis por partes não autorizadas. Para obter mais informações, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

- Controle de acesso e segurança dentro do próprio sistema de banco de dados, incluindo os usuários e bancos de dados que têm acesso aos bancos de dados, visualizações e programas armazenados em uso dentro do banco de dados. Para mais informações, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”.

- As funcionalidades oferecidas pelos plugins relacionados à segurança. Veja a Seção 8.4, “Componentes e Plugins de Segurança”.

- Segurança da rede do MySQL e do seu sistema. A segurança está relacionada às permissões para usuários individuais, mas você também pode querer restringir o MySQL para que ele esteja disponível apenas localmente no host do servidor MySQL ou para um conjunto limitado de outros hosts.

- Certifique-se de ter backups adequados e apropriados de seus arquivos de banco de dados, arquivos de configuração e arquivos de log. Além disso, certifique-se de que você tem uma solução de recuperação em vigor e teste se você consegue recuperar com sucesso as informações de seus backups. Veja o Capítulo 9, *Backup e Recuperação*.

Nota

Vários tópicos deste capítulo também são abordados no Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.
