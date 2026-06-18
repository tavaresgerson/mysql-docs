# Capítulo 10 Otimização

**Índice**

10.1 Visão geral da otimização

10.2 Otimização de instruções SQL:   10.2.1 Otimização de instruções SELECT

```
10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions

10.2.3 Optimizing INFORMATION_SCHEMA Queries

10.2.4 Optimizing Performance Schema Queries

10.2.5 Optimizing Data Change Statements

10.2.6 Optimizing Database Privileges

10.2.7 Other Optimization Tips
```

10.3 Otimização e índices: 10.3.1 Como o MySQL usa índices

```
10.3.2 Primary Key Optimization

10.3.3 SPATIAL Index Optimization

10.3.4 Foreign Key Optimization

10.3.5 Column Indexes

10.3.6 Multiple-Column Indexes

10.3.7 Verifying Index Usage

10.3.8 InnoDB and MyISAM Index Statistics Collection

10.3.9 Comparison of B-Tree and Hash Indexes

10.3.10 Use of Index Extensions

10.3.11 Optimizer Use of Generated Column Indexes

10.3.12 Invisible Indexes

10.3.13 Descending Indexes

10.3.14 Indexed Lookups from TIMESTAMP Columns
```

10.4 Otimização da Estrutura do Banco de Dados:   10.4.1 Otimização do Tamanho dos Dados

```
10.4.2 Optimizing MySQL Data Types

10.4.3 Optimizing for Many Tables

10.4.4 Internal Temporary Table Use in MySQL

10.4.5 Limits on Number of Databases and Tables

10.4.6 Limits on Table Size

10.4.7 Limits on Table Column Count and Row Size
```

10.5 Otimização para tabelas InnoDB:   10.5.1 Otimização do layout de armazenamento para tabelas InnoDB

```
10.5.2 Optimizing InnoDB Transaction Management

10.5.3 Optimizing InnoDB Read-Only Transactions

10.5.4 Optimizing InnoDB Redo Logging

10.5.5 Bulk Data Loading for InnoDB Tables

10.5.6 Optimizing InnoDB Queries

10.5.7 Optimizing InnoDB DDL Operations

10.5.8 Optimizing InnoDB Disk I/O

10.5.9 Optimizing InnoDB Configuration Variables

10.5.10 Optimizing InnoDB for Systems with Many Tables
```

10.6 Otimização para tabelas MyISAM:   10.6.1 Otimização de consultas MyISAM

```
10.6.2 Bulk Data Loading for MyISAM Tables

10.6.3 Optimizing REPAIR TABLE Statements
```

10.7 Otimização para tabelas de MEMÓRIA

10.8 Entendendo o Plano de Execução da Consulta:   10.8.1 Otimizando Consultas com EXPLAIN

```
10.8.2 EXPLAIN Output Format

10.8.3 Extended EXPLAIN Output Format

10.8.4 Obtaining Execution Plan Information for a Named Connection

10.8.5 Estimating Query Performance
```

10.9 Controlar o otimizador de consultas:   10.9.1 Controlar a avaliação do plano de consulta

```
10.9.2 Switchable Optimizations

10.9.3 Optimizer Hints

10.9.4 Index Hints

10.9.5 The Optimizer Cost Model

10.9.6 Optimizer Statistics
```

10.10 Bufferamento e Caching:   10.10.1 Otimização do Pool de Buffer do InnoDB

```
10.10.2 The MyISAM Key Cache

10.10.3 Caching of Prepared Statements and Stored Programs
```

10.11 Otimização das Operações de Fechamento:   10.11.1 Métodos de Fechamento Interno

```
10.11.2 Table Locking Issues

10.11.3 Concurrent Inserts

10.11.4 Metadata Locking

10.11.5 External Locking
```

10.12 Otimização do servidor MySQL:   10.12.1 Otimização do I/O de disco

```
10.12.2 Using Symbolic Links

10.12.3 Optimizing Memory Use
```

10.13 Medição de Desempenho (Benchmarking):   10.13.1 Medição da Velocidade de Expressões e Funções

```
10.13.2 Using Your Own Benchmarks

10.13.3 Measuring Performance with performance_schema
```

10.14 Exame das informações do fio (processo) do servidor:   10.14.1 Acesso à lista de processos

```
10.14.2 Thread Command Values

10.14.3 General Thread States

10.14.4 Replication Source Thread States

10.14.5 Replication I/O (Receiver) Thread States

10.14.6 Replication SQL Thread States

10.14.7 Replication Connection Thread States

10.14.8 NDB Cluster Thread States

10.14.9 Event Scheduler Thread States
```

10.15 Rastreamento do otimizador:   10.15.1 Uso típico

```
10.15.2 System Variables Controlling Tracing

10.15.3 Traceable Statements

10.15.4 Tuning Trace Purging

10.15.5 Tracing Memory Usage

10.15.6 Privilege Checking

10.15.7 Interaction with the --debug Option

10.15.8 The optimizer_trace System Variable

10.15.9 The end_markers_in_json System Variable

10.15.10 Selecting Optimizer Features to Trace

10.15.11 Trace General Structure

10.15.12 Example

10.15.13 Displaying Traces in Other Applications

10.15.14 Preventing the Use of Optimizer Trace

10.15.15 Testing Optimizer Trace

10.15.16 Optimizer Trace Implementation
```

Este capítulo explica como otimizar o desempenho do MySQL e fornece exemplos. A otimização envolve a configuração, o ajuste e a medição do desempenho, em vários níveis. Dependendo do seu papel (desenvolvedor, DBA ou uma combinação dos dois), você pode otimizar no nível de instruções SQL individuais, aplicações inteiras, um único servidor de banco de dados ou múltiplos servidores de banco de dados em rede. Às vezes, você pode ser proativo e planejar com antecedência para o desempenho, enquanto outras vezes você pode solucionar um problema de configuração ou código após o problema ocorrer. A otimização do uso da CPU e da memória também pode melhorar a escalabilidade, permitindo que o banco de dados lide com mais carga sem desacelerar.
