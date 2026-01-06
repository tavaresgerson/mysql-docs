# Capítulo 5: Administração do Servidor MySQL

**Índice**

5.1 O Servidor MySQL:   5.1.1 Configurando o Servidor

```
5.1.2 Server Configuration Defaults

5.1.3 Server Option, System Variable, and Status Variable Reference

5.1.4 Server System Variable Reference

5.1.5 Server Status Variable Reference

5.1.6 Server Command Options

5.1.7 Server System Variables

5.1.8 Using System Variables

5.1.9 Server Status Variables

5.1.10 Server SQL Modes

5.1.11 Connection Management

5.1.12 IPv6 Support

5.1.13 MySQL Server Time Zone Support

5.1.14 Server-Side Help Support

5.1.15 Server Tracking of Client Session State

5.1.16 The Server Shutdown Process
```

5.2 O diretório de dados do MySQL

5.3 Banco de Dados do Sistema MySQL

5.4 Registros do Servidor MySQL :   5.4.1 Selecionando destinos de saída do log de consultas gerais e do log de consultas lentas

```
5.4.2 The Error Log

5.4.3 The General Query Log

5.4.4 The Binary Log

5.4.5 The Slow Query Log

5.4.6 The DDL Log

5.4.7 Server Log Maintenance
```

5.5 Plugins do Servidor MySQL:   5.5.1 Instalando e Desinstalando Plugins

```
5.5.2 Obtaining Server Plugin Information

5.5.3 MySQL Enterprise Thread Pool

5.5.4 The Rewriter Query Rewrite Plugin

5.5.5 Version Tokens

5.5.6 MySQL Plugin Services
```

5.6 Funções carregáveis do servidor MySQL:   5.6.1 Instalando e desinstalando funções carregáveis

```
5.6.2 Obtaining Information About Loadable Functions
```

5.7 Executando múltiplas instâncias do MySQL em uma única máquina :   5.7.1 Configurando diretórios de dados múltiplos

```
5.7.2 Running Multiple MySQL Instances on Windows

5.7.3 Running Multiple MySQL Instances on Unix

5.7.4 Using Client Programs in a Multiple-Server Environment
```

5.8 Depuração do MySQL :   5.8.1 Depuração de um servidor MySQL

```
5.8.2 Debugging a MySQL Client

5.8.3 The DBUG Package

5.8.4 Tracing mysqld Using DTrace
```

O MySQL Server (**mysqld**) é o programa principal que realiza a maior parte do trabalho em uma instalação do MySQL. Este capítulo fornece uma visão geral do MySQL Server e aborda a administração geral do servidor:

- Configuração do servidor

- O diretório de dados, particularmente o banco de dados do sistema `mysql`

- Os arquivos de registro do servidor

- Gestão de múltiplos servidores em uma única máquina

Para obter informações adicionais sobre tópicos administrativos, consulte também:

- \[Capítulo 6, *Segurança*] (security.html)
- \[Capítulo 7, *Backup e Recuperação*] (backup-e-recuperacao.html)
- \[Capítulo 16, *Replicação*] (replication.html)
