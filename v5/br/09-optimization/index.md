# Capítulo 8: Otimização

**Índice**

8.1 Visão geral da otimização

8.2 Otimização de instruções SQL:   8.2.1 Otimização de instruções SELECT

```
8.2.2 Optimizing Subqueries, Derived Tables, and View References

8.2.3 Optimizing INFORMATION_SCHEMA Queries

8.2.4 Optimizing Data Change Statements

8.2.5 Optimizing Database Privileges

8.2.6 Other Optimization Tips
```

8.3 Otimização e índices:   8.3.1 Como o MySQL usa índices

```
8.3.2 Primary Key Optimization

8.3.3 Foreign Key Optimization

8.3.4 Column Indexes

8.3.5 Multiple-Column Indexes

8.3.6 Verifying Index Usage

8.3.7 InnoDB and MyISAM Index Statistics Collection

8.3.8 Comparison of B-Tree and Hash Indexes

8.3.9 Use of Index Extensions

8.3.10 Optimizer Use of Generated Column Indexes

8.3.11 Indexed Lookups from TIMESTAMP Columns
```

8.4 Otimização da Estrutura do Banco de Dados:   8.4.1 Otimização do Tamanho dos Dados

```
8.4.2 Optimizing MySQL Data Types

8.4.3 Optimizing for Many Tables

8.4.4 Internal Temporary Table Use in MySQL

8.4.5 Limits on Number of Databases and Tables

8.4.6 Limits on Table Size

8.4.7 Limits on Table Column Count and Row Size
```

8.5 Otimização para tabelas InnoDB:   8.5.1 Otimização do layout de armazenamento para tabelas InnoDB

```
8.5.2 Optimizing InnoDB Transaction Management

8.5.3 Optimizing InnoDB Read-Only Transactions

8.5.4 Optimizing InnoDB Redo Logging

8.5.5 Bulk Data Loading for InnoDB Tables

8.5.6 Optimizing InnoDB Queries

8.5.7 Optimizing InnoDB DDL Operations

8.5.8 Optimizing InnoDB Disk I/O

8.5.9 Optimizing InnoDB Configuration Variables

8.5.10 Optimizing InnoDB for Systems with Many Tables
```

8.6 Otimização para tabelas MyISAM:   8.6.1 Otimização de consultas MyISAM

```
8.6.2 Bulk Data Loading for MyISAM Tables

8.6.3 Optimizing REPAIR TABLE Statements
```

8.7 Otimização para tabelas de MEMORY

8.8 Entendendo o Plano de Execução da Consulta:   8.8.1 Otimizando Consultas com EXPLAIN

```
8.8.2 EXPLAIN Output Format

8.8.3 Extended EXPLAIN Output Format

8.8.4 Obtaining Execution Plan Information for a Named Connection

8.8.5 Estimating Query Performance
```

8.9 Controlar o otimizador de consultas:   8.9.1 Controlar a avaliação do plano de consulta

```
8.9.2 Switchable Optimizations

8.9.3 Optimizer Hints

8.9.4 Index Hints

8.9.5 The Optimizer Cost Model
```

8.10 Bufferamento e Caching:   8.10.1 Otimização do Pool de Buffer do InnoDB

```
8.10.2 The MyISAM Key Cache

8.10.3 The MySQL Query Cache

8.10.4 Caching of Prepared Statements and Stored Programs
```

8.11 Otimização das operações de bloqueio:   8.11.1 Métodos de bloqueio interno

```
8.11.2 Table Locking Issues

8.11.3 Concurrent Inserts

8.11.4 Metadata Locking

8.11.5 External Locking
```

8.12 Otimização do servidor MySQL:   8.12.1 Fatores do sistema

```
8.12.2 Optimizing Disk I/O

8.12.3 Using Symbolic Links

8.12.4 Optimizing Memory Use
```

8.13 Medição de Desempenho (Benchmarking):   8.13.1 Medição da Velocidade de Expressões e Funções

```
8.13.2 Using Your Own Benchmarks

8.13.3 Measuring Performance with performance_schema
```

8.14 Exame das informações do thread (processo) do servidor:   8.14.1 Acesso à lista de processos

```
8.14.2 Thread Command Values

8.14.3 General Thread States

8.14.4 Query Cache Thread States

8.14.5 Replication Source Thread States

8.14.6 Replication Replica I/O Thread States

8.14.7 Replication Replica SQL Thread States

8.14.8 Replication Replica Connection Thread States

8.14.9 NDB Cluster Thread States

8.14.10 Event Scheduler Thread States
```

8.15 Rastreamento do otimizador:   8.15.1 Uso típico

```
8.15.2 System Variables Controlling Tracing

8.15.3 Traceable Statements

8.15.4 Tuning Trace Purging

8.15.5 Tracing Memory Usage

8.15.6 Privilege Checking

8.15.7 Interaction with the --debug Option

8.15.8 The optimizer_trace System Variable

8.15.9 The end_markers_in_json System Variable

8.15.10 Selecting Optimizer Features to Trace

8.15.11 Trace General Structure

8.15.12 Example

8.15.13 Displaying Traces in Other Applications

8.15.14 Preventing the Use of Optimizer Trace

8.15.15 Testing Optimizer Trace

8.15.16 Optimizer Trace Implementation
```

Este capítulo explica como otimizar o desempenho do MySQL e fornece exemplos. A otimização envolve a configuração, o ajuste e a medição do desempenho, em vários níveis. Dependendo do seu papel (desenvolvedor, DBA ou uma combinação dos dois), você pode otimizar no nível de instruções SQL individuais, aplicações inteiras, um único servidor de banco de dados ou múltiplos servidores de banco de dados em rede. Às vezes, você pode ser proativo e planejar com antecedência para o desempenho, enquanto outras vezes você pode solucionar um problema de configuração ou código após o problema ocorrer. A otimização do uso da CPU e da memória também pode melhorar a escalabilidade, permitindo que o banco de dados lide com mais carga sem desacelerar.
