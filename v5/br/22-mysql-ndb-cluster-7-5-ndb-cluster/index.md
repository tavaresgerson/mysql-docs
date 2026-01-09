# Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6

**Índice**

21.1 Informações Gerais

Visão geral do cluster NDB 21.2:   21.2.1 Conceitos básicos do NDB Cluster

```
21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions

21.2.3 NDB Cluster Hardware, Software, and Networking Requirements

21.2.4 What is New in MySQL NDB Cluster

21.2.5 NDB: Added, Deprecated, and Removed Options, Variables, and Parameters

21.2.6 MySQL Server Using InnoDB Compared with NDB Cluster

21.2.7 Known Limitations of NDB Cluster
```

Instalação do NDB Cluster:   21.3.1 Instalação do NDB Cluster no Linux

```
21.3.2 Installing NDB Cluster on Windows

21.3.3 Initial Configuration of NDB Cluster

21.3.4 Initial Startup of NDB Cluster

21.3.5 NDB Cluster Example with Tables and Data

21.3.6 Safe Shutdown and Restart of NDB Cluster

21.3.7 Upgrading and Downgrading NDB Cluster

21.3.8 The NDB Cluster Auto-Installer (NDB 7.5) (NO LONGER SUPPORTED)

21.3.9 The NDB Cluster Auto-Installer (NO LONGER SUPPORTED)
```

21.4 Configuração do NDB Cluster :   21.4.1 Configuração Rápida do NDB Cluster

```
21.4.2 Overview of NDB Cluster Configuration Parameters, Options, and Variables

21.4.3 NDB Cluster Configuration Files

21.4.4 Using High-Speed Interconnects with NDB Cluster
```

Programas de clúster NDB 21.5:   21.5.1 ndbd — O daemon do nó de dados do clúster NDB

```
21.5.2 ndbinfo_select_all — Select From ndbinfo Tables

21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)

21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon

21.5.5 ndb_mgm — The NDB Cluster Management Client

21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables

21.5.7 ndb_config — Extract NDB Cluster Configuration Information

21.5.8 ndb_cpcd — Automate Testing for NDB Development

21.5.9 ndb_delete_all — Delete All Rows from an NDB Table

21.5.10 ndb_desc — Describe NDB Tables

21.5.11 ndb_drop_index — Drop Index from an NDB Table

21.5.12 ndb_drop_table — Drop an NDB Table

21.5.13 ndb_error_reporter — NDB Error-Reporting Utility

21.5.14 ndb_import — Import CSV Data Into NDB

21.5.15 ndb_index_stat — NDB Index Statistics Utility

21.5.16 ndb_move_data — NDB Data Copy Utility

21.5.17 ndb_perror — Obtain NDB Error Message Information

21.5.18 ndb_print_backup_file — Print NDB Backup File Contents

21.5.19 ndb_print_file — Print NDB Disk Data File Contents

21.5.20 ndb_print_frag_file — Print NDB Fragment List File Contents

21.5.21 ndb_print_schema_file — Print NDB Schema File Contents

21.5.22 ndb_print_sys_file — Print NDB System File Contents

21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log

21.5.24 ndb_restore — Restore an NDB Cluster Backup

21.5.25 ndb_select_all — Print Rows from an NDB Table

21.5.26 ndb_select_count — Print Row Counts for NDB Tables

21.5.27 ndb_show_tables — Display List of NDB Tables

21.5.28 ndb_size.pl — NDBCLUSTER Size Requirement Estimator

21.5.29 ndb_top — View CPU usage information for NDB threads

21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status
```

21.6 Gerenciamento do NDB Cluster:   21.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster

```
21.6.2 NDB Cluster Log Messages

21.6.3 Event Reports Generated in NDB Cluster

21.6.4 Summary of NDB Cluster Start Phases

21.6.5 Performing a Rolling Restart of an NDB Cluster

21.6.6 NDB Cluster Single User Mode

21.6.7 Adding NDB Cluster Data Nodes Online

21.6.8 Online Backup of NDB Cluster

21.6.9 Importing Data Into MySQL Cluster

21.6.10 MySQL Server Usage for NDB Cluster

21.6.11 NDB Cluster Disk Data Tables

21.6.12 Online Operations with ALTER TABLE in NDB Cluster

21.6.13 Distributed Privileges Using Shared Grant Tables

21.6.14 NDB API Statistics Counters and Variables

21.6.15 ndbinfo: The NDB Cluster Information Database

21.6.16 INFORMATION_SCHEMA Tables for NDB Cluster

21.6.17 Quick Reference: NDB Cluster SQL Statements

21.6.18 NDB Cluster Security Issues
```

Replicação de cluster NDB 21.7:   21.7.1 Replicação de cluster NDB: Abreviações e Símbolos

```
21.7.2 General Requirements for NDB Cluster Replication

21.7.3 Known Issues in NDB Cluster Replication

21.7.4 NDB Cluster Replication Schema and Tables

21.7.5 Preparing the NDB Cluster for Replication

21.7.6 Starting NDB Cluster Replication (Single Replication Channel)

21.7.7 Using Two Replication Channels for NDB Cluster Replication

21.7.8 Implementing Failover with NDB Cluster Replication

21.7.9 NDB Cluster Backups With NDB Cluster Replication

21.7.10 NDB Cluster Replication: Bidirectional and Circular Replication

21.7.11 NDB Cluster Replication Conflict Resolution
```

Notas de lançamento do cluster NDB 21.8

Este capítulo fornece informações sobre o MySQL NDB Cluster, uma versão de alta disponibilidade e alta redundância do MySQL adaptada para o ambiente de computação distribuída, que permite o funcionamento de vários computadores com servidores MySQL e outros softwares em um clúster. Este capítulo também fornece informações específicas para as versões do NDB Cluster 7.5, desde a 5.7.44-ndb-7.5.36 até a 5.7.44-ndb-7.6.36, e para as versões do NDB Cluster 7.6, desde a 5.7.44-ndb-7.6.35 até a 5.7.44-ndb-7.6.35, ambas versões anteriores de Disponibilidade Geral (GA) ainda suportadas em produção. As versões mais recentes disponíveis dessas são, respectivamente, a 5.7.44-ndb-7.5.36 e a 5.7.44-ndb-7.6.35. Uma série de versões estáveis mais recente do NDB Cluster usa a versão 8.0 do motor de armazenamento `NDB` (também conhecido como `NDBCLUSTER`). O NDB Cluster 8.0, agora disponível como uma versão de Disponibilidade Geral (GA) a partir da versão 8.0.19, incorpora a versão 8.0 do motor de armazenamento `NDB`; consulte MySQL NDB Cluster 8.0 para mais informações sobre o NDB 8.0. O NDB Cluster 8.4 (NDB 8.4.7), baseado na versão 8.4 do motor de armazenamento NDB, também está disponível como uma versão LTS. Consulte O que há de novo no MySQL NDB Cluster 8.4 para informações sobre as diferenças do NDB 8.4 em comparação com as versões anteriores. As versões anteriores de Disponibilidade Geral (GA) do NDB Cluster 7.4 e NDB Cluster 7.3 incorporaram as versões `NDB` 7.4 e 7.3, respectivamente. *As séries de versões `NDB` 7.4 e anteriores não são mais suportadas ou mantidas*. Tanto o NDB 8.0 quanto o NDB 8.1 são suportados em produção e são recomendados para novas implantações.
