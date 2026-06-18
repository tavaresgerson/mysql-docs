# Capítulo 17 O Motor de Armazenamento InnoDB

**Índice**

17.1 Introdução ao InnoDB:   17.1.1 Benefícios de usar tabelas InnoDB

```
17.1.2 Best Practices for InnoDB Tables

17.1.3 Verifying that InnoDB is the Default Storage Engine

17.1.4 Testing and Benchmarking with InnoDB
```

17.2 InnoDB e o Modelo ACID

17.3 Multiversão InnoDB

17.4 Arquitetura InnoDB

17.5 Estruturas em Memória Dinâmica do InnoDB:   17.5.1 Pool de Buffer

```
17.5.2 Change Buffer

17.5.3 Adaptive Hash Index

17.5.4 Log Buffer
```

17.6 Estruturas de disco do InnoDB:   17.6.1 Tabelas

```
17.6.2 Indexes

17.6.3 Tablespaces

17.6.4 Doublewrite Buffer

17.6.5 Redo Log

17.6.6 Undo Logs
```

17.7 Modelo de bloqueio e transação do InnoDB:   17.7.1 Bloqueio do InnoDB

```
17.7.2 InnoDB Transaction Model

17.7.3 Locks Set by Different SQL Statements in InnoDB

17.7.4 Phantom Rows

17.7.5 Deadlocks in InnoDB

17.7.6 Transaction Scheduling
```

17.8 Configuração do InnoDB:   17.8.1 Configuração de inicialização do InnoDB

```
17.8.2 Configuring InnoDB for Read-Only Operation

17.8.3 InnoDB Buffer Pool Configuration

17.8.4 Configuring Thread Concurrency for InnoDB

17.8.5 Configuring the Number of Background InnoDB I/O Threads

17.8.6 Using Asynchronous I/O on Linux

17.8.7 Configuring InnoDB I/O Capacity

17.8.8 Configuring Spin Lock Polling

17.8.9 Purge Configuration

17.8.10 Configuring Optimizer Statistics for InnoDB

17.8.11 Configuring the Merge Threshold for Index Pages

17.8.12 Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server
```

17.9 Compressão de Tabelas e Páginas do InnoDB:   17.9.1 Compressão de Tabelas do InnoDB

```
17.9.2 InnoDB Page Compression
```

17.10 Formatos de Linhas do InnoDB

17.11 Gerenciamento de I/O de disco e espaço de arquivo do InnoDB:   17.11.1 I/O de disco do InnoDB

```
17.11.2 File Space Management

17.11.3 InnoDB Checkpoints

17.11.4 Defragmenting a Table

17.11.5 Reclaiming Disk Space with TRUNCATE TABLE
```

17.12 InnoDB e DDL Online:   17.12.1 Operações de DDL Online

```
17.12.2 Online DDL Performance and Concurrency

17.12.3 Online DDL Space Requirements

17.12.4 Online DDL Memory Management

17.12.5 Configuring Parallel Threads for Online DDL Operations

17.12.6 Simplifying DDL Statements with Online DDL

17.12.7 Online DDL Failure Conditions

17.12.8 Online DDL Limitations
```

17.13 Criptografia de Dados em Repouso do InnoDB

17.14 Opções de inicialização do InnoDB e variáveis do sistema

17.15 Tabelas do esquema de informações InnoDB:   17.15.1 Tabelas do esquema de informações InnoDB sobre compressão

```
17.15.2 InnoDB INFORMATION_SCHEMA Transaction and Locking Information

17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables

17.15.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables

17.15.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables

17.15.6 InnoDB INFORMATION_SCHEMA Metrics Table

17.15.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table

17.15.8 Retrieving InnoDB Tablespace Metadata from INFORMATION_SCHEMA.FILES
```

17.16 Integração InnoDB com o MySQL Performance Schema:   17.16.1 Monitoramento do progresso da alteração de tabela para tabelas InnoDB usando o Performance Schema

```
17.16.2 Monitoring InnoDB Mutex Waits Using Performance Schema
```

17.17 Monitores InnoDB:   17.17.1 Tipos de Monitor InnoDB

```
17.17.2 Enabling InnoDB Monitors

17.17.3 InnoDB Standard Monitor and Lock Monitor Output
```

17.18 Backup e recuperação do InnoDB:   17.18.1 Backup do InnoDB

```
17.18.2 InnoDB Recovery
```

17.19 InnoDB e replicação do MySQL

17.20 Plugin InnoDB memcached:   17.20.1 Benefícios do Plugin InnoDB memcached

```
17.20.2 InnoDB memcached Architecture

17.20.3 Setting Up the InnoDB memcached Plugin

17.20.4 InnoDB memcached Multiple get and Range Query Support

17.20.5 Security Considerations for the InnoDB memcached Plugin

17.20.6 Writing Applications for the InnoDB memcached Plugin

17.20.7 The InnoDB memcached Plugin and Replication

17.20.8 InnoDB memcached Plugin Internals

17.20.9 Troubleshooting the InnoDB memcached Plugin
```

17.21 Solução de problemas do InnoDB:   17.21.1 Solução de problemas de I/O do InnoDB

```
17.21.2 Troubleshooting Recovery Failures

17.21.3 Forcing InnoDB Recovery

17.21.4 Troubleshooting InnoDB Data Dictionary Operations

17.21.5 InnoDB Error Handling
```

17.22 Limites do InnoDB

17.23 Restrições e Limitações do InnoDB
