# Capítulo 7: Administração do Servidor MySQL

**Índice**

7.1 O Servidor MySQL:   7.1.1 Configurando o Servidor

```
7.1.2 Server Configuration Defaults

7.1.3 Server Configuration Validation

7.1.4 Server Option, System Variable, and Status Variable Reference

7.1.5 Server System Variable Reference

7.1.6 Server Status Variable Reference

7.1.7 Server Command Options

7.1.8 Server System Variables

7.1.9 Using System Variables

7.1.10 Server Status Variables

7.1.11 Server SQL Modes

7.1.12 Connection Management

7.1.13 IPv6 Support

7.1.14 Network Namespace Support

7.1.15 MySQL Server Time Zone Support

7.1.16 Resource Groups

7.1.17 Server-Side Help Support

7.1.18 Server Tracking of Client Session State

7.1.19 The Server Shutdown Process
```

7.2 O diretório de dados MySQL

7.3 O esquema do sistema MySQL

7.4 Registros do servidor MySQL:   7.4.1 Selecionando destinos de saída do registro de consultas gerais e do registro de consultas lentas

```
7.4.2 The Error Log

7.4.3 The General Query Log

7.4.4 The Binary Log

7.4.5 The Slow Query Log

7.4.6 Server Log Maintenance
```

7.5 Componentes do MySQL:   7.5.1 Instalação e Desinstalação de Componentes

```
7.5.2 Obtaining Component Information

7.5.3 Error Log Components

7.5.4 Query Attribute Components

7.5.5 Scheduler Component
```

7.6 Plugins do MySQL Server:   7.6.1 Instalação e Desinstalação de Plugins

```
7.6.2 Obtaining Server Plugin Information

7.6.3 MySQL Enterprise Thread Pool

7.6.4 The Rewriter Query Rewrite Plugin

7.6.5 The ddl_rewriter Plugin

7.6.6 Version Tokens

7.6.7 The Clone Plugin

7.6.8 The Keyring Proxy Bridge Plugin

7.6.9 MySQL Plugin Services
```

7.7 Funções carregáveis do MySQL Server:   7.7.1 Instalação e desinstalação de funções carregáveis

```
7.7.2 Obtaining Information About Loadable Functions
```

7.8 Executando múltiplas instâncias do MySQL em uma única máquina:   7.8.1 Configurando diretórios de dados múltiplos

```
7.8.2 Running Multiple MySQL Instances on Windows

7.8.3 Running Multiple MySQL Instances on Unix

7.8.4 Using Client Programs in a Multiple-Server Environment
```

7.9 Depuração do MySQL:   7.9.1 Depuração de um servidor MySQL

```
7.9.2 Debugging a MySQL Client

7.9.3 The LOCK_ORDER Tool

7.9.4 The DBUG Package
```

O MySQL Server (**mysqld**) é o programa principal que realiza a maior parte do trabalho em uma instalação do MySQL. Este capítulo fornece uma visão geral do MySQL Server e aborda a administração geral do servidor:

- Configuração do servidor

- O diretório de dados, particularmente o esquema do sistema `mysql`

- Os arquivos de registro do servidor

- Gestão de múltiplos servidores em uma única máquina

Para obter informações adicionais sobre tópicos administrativos, consulte também:

- Capítulo 8, *Segurança*
- Capítulo 9, *Backup e Recuperação*
- Capítulo 19, *Replicação*
