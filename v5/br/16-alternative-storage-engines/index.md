# Capítulo 15 Storage Engines Alternativos

**Sumário**

15.1 Configurando o Storage Engine

15.2 O Storage Engine MyISAM : 15.2.1 Opções de Inicialização do MyISAM

    15.2.2 Espaço Necessário para Keys

    15.2.3 Formatos de Armazenamento de Tabelas MyISAM

    15.2.4 Problemas em Tabelas MyISAM

15.3 O Storage Engine MEMORY

15.4 O Storage Engine CSV : 15.4.1 Reparando e Verificando Tabelas CSV

    15.4.2 Limitações do CSV

15.5 O Storage Engine ARCHIVE

15.6 O Storage Engine BLACKHOLE

15.7 O Storage Engine MERGE : 15.7.1 Vantagens e Desvantagens das Tabelas MERGE

    15.7.2 Problemas em Tabelas MERGE

15.8 O Storage Engine FEDERATED : 15.8.1 Visão Geral do Storage Engine FEDERATED

    15.8.2 Como Criar Tabelas FEDERATED

    15.8.3 Notas e Dicas sobre o Storage Engine FEDERATED

    15.8.4 Recursos do Storage Engine FEDERATED

15.9 O Storage Engine EXAMPLE

15.10 Outros Storage Engines

15.11 Visão Geral da Arquitetura de Storage Engine do MySQL : 15.11.1 Arquitetura Pluggable Storage Engine

    15.11.2 A Camada Comum do Servidor Database

Os storage engines são componentes do MySQL que lidam com as operações SQL para diferentes tipos de tabela. `InnoDB` é o storage engine padrão e de propósito geral, e a Oracle recomenda usá-lo para tabelas, exceto em casos de uso especializados. (A instrução `CREATE TABLE` no MySQL 5.7 cria tabelas `InnoDB` por padrão.)

O MySQL Server usa uma arquitetura pluggable storage engine que permite que os storage engines sejam carregados e descarregados de um servidor MySQL em execução.

Para determinar quais storage engines seu servidor suporta, use a instrução `SHOW ENGINES`. O valor na coluna `Support` indica se um engine pode ser usado. Um valor de `YES`, `NO` ou `DEFAULT` indica que um engine está disponível, não está disponível ou está disponível e atualmente definido como o default storage engine.

```sql
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 3. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
...
```

Este capítulo aborda casos de uso para storage engines MySQL de propósito especial. Ele não cobre o default storage engine `InnoDB` ou o storage engine `NDB`, que são abordados no Capítulo 14, *O Storage Engine InnoDB*, e no Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*. Para usuários avançados, este capítulo também contém uma descrição da arquitetura pluggable storage engine (consulte a Seção 15.11, “Visão Geral da Arquitetura de Storage Engine do MySQL”).

Para obter informações sobre os recursos oferecidos nos binários comerciais do MySQL Server, consulte [*MySQL Editions*](https://www.mysql.com/products/), no site do MySQL. Os storage engines disponíveis podem depender da edição do MySQL que você está usando.

Para respostas a perguntas frequentes sobre storage engines do MySQL, consulte a Seção A.2, “FAQ do MySQL 5.7: Storage Engines”.

## Storage Engines Suportados pelo MySQL 5.7

* `InnoDB`: O default storage engine no MySQL 5.7. `InnoDB` é um storage engine transacionalmente seguro (compatível com ACID) para MySQL que possui recursos de commit, rollback e recuperação de falhas para proteger os dados do usuário. O row-level locking do `InnoDB` (sem escalonamento para Locks de granularidade mais grossa) e as consistent nonlocking reads estilo Oracle aumentam a concorrência multiusuário e o desempenho. O `InnoDB` armazena dados do usuário em clustered indexes para reduzir o I/O em Queries comuns baseadas em Primary Keys. Para manter a integridade dos dados, o `InnoDB` também suporta restrições de integridade referencial `FOREIGN KEY`. Para obter mais informações sobre `InnoDB`, consulte o Capítulo 14, *O Storage Engine InnoDB*.

* `MyISAM`: Estas tabelas têm um footprint pequeno. O table-level locking limita o desempenho em workloads de leitura/escrita, por isso é frequentemente usado em workloads somente leitura ou majoritariamente leitura em configurações Web e de data warehousing.

* `Memory`: Armazena todos os dados na RAM, para acesso rápido em ambientes que exigem lookups rápidos de dados não críticos. Este engine era anteriormente conhecido como engine `HEAP`. Seus casos de uso estão diminuindo; `InnoDB` com sua área de memória Buffer Pool fornece uma maneira geral e durável de manter a maioria ou todos os dados na memória, e `NDBCLUSTER` fornece fast key-value lookups para enormes conjuntos de dados distribuídos.

* `CSV`: Suas tabelas são realmente arquivos de texto com valores separados por vírgula. As tabelas CSV permitem importar ou despejar dados no formato CSV, para trocar dados com scripts e aplicações que leem e escrevem nesse mesmo formato. Como as tabelas CSV não são indexed, você geralmente mantém os dados em tabelas `InnoDB` durante a operação normal e usa tabelas CSV apenas durante a fase de importação ou exportação.

* `Archive`: Estas tabelas compactas e unindexed são destinadas a armazenar e recuperar grandes quantidades de informações históricas, arquivadas ou de auditoria de segurança raramente referenciadas.

* `Blackhole`: O storage engine Blackhole aceita, mas não armazena dados, semelhante ao dispositivo Unix `/dev/null`. Queries sempre retornam um conjunto vazio. Estas tabelas podem ser usadas em configurações de replication onde instruções DML são enviadas para servidores replica, mas o servidor source não mantém sua própria cópia dos dados.

* `NDB` (também conhecido como `NDBCLUSTER`): Este database engine clustered é particularmente adequado para aplicações que exigem o mais alto grau possível de uptime e disponibilidade.

* `Merge`: Permite que um DBA ou desenvolvedor MySQL agrupe logicamente uma série de tabelas `MyISAM` idênticas e as referencie como um único objeto. Bom para ambientes VLDB, como data warehousing.

* `Federated`: Oferece a capacidade de vincular servidores MySQL separados para criar um database lógico a partir de muitos servidores físicos. Muito bom para ambientes distribuídos ou data mart.

* `Example`: Este engine serve como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos storage engines. É de interesse primário para desenvolvedores. O storage engine é um “stub” que não faz nada. Você pode criar tabelas com este engine, mas nenhum dado pode ser armazenado ou recuperado delas.

Você não está restrito a usar o mesmo storage engine para um servidor ou schema inteiro. Você pode especificar o storage engine para qualquer tabela. Por exemplo, uma aplicação pode usar principalmente tabelas `InnoDB`, com uma tabela `CSV` para exportar dados para uma planilha e algumas tabelas `MEMORY` para workspaces temporários.

**Escolhendo um Storage Engine**

Os vários storage engines fornecidos com o MySQL são projetados com diferentes casos de uso em mente. A tabela a seguir fornece uma visão geral de alguns storage engines fornecidos com o MySQL, com notas esclarecedoras após a tabela.

**Tabela 15.1 Resumo dos Recursos do Storage Engine**

<table frame="box" rules="all" summary="Resumo dos recursos suportados por storage engine."><col style="width: 10%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><thead><tr><th>Recurso</th> <th>MyISAM</th> <th>Memory</th> <th>InnoDB</th> <th>Archive</th> <th>NDB</th> </tr></thead><tbody><tr><th>B-tree indexes</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th>Backup/point-in-time recovery (nota 1)</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th>Cluster database support</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Clustered indexes</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th>Compressed data</th> <td>Sim (nota 2)</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr><th>Data caches</th> <td>Não</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Encrypted data</th> <td>Sim (nota 3)</td> <td>Sim (nota 3)</td> <td>Sim (nota 4)</td> <td>Sim (nota 3)</td> <td>Sim (nota 5)</td> </tr><tr><th>Foreign key support</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Full-text search indexes</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 6)</td> <td>Não</td> <td>Não</td> </tr><tr><th>Geospatial data type support</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th>Geospatial indexing support</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 7)</td> <td>Não</td> <td>Não</td> </tr><tr><th>Hash indexes</th> <td>Não</td> <td>Sim</td> <td>Não (nota 8)</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Index caches</th> <td>Sim</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Locking granularity</th> <td>Table</td> <td>Table</td> <td>Row</td> <td>Row</td> <td>Row</td> </tr><tr><th>MVCC</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th>Replication support (nota 1)</th> <td>Sim</td> <td>Limitado (nota 9)</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th>Storage limits</th> <td>256TB</td> <td>RAM</td> <td>64TB</td> <td>Nenhum</td> <td>384EB</td> </tr><tr><th>T-tree indexes</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Transactions</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Update statistics for data dictionary</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr> </tbody></table>

**Notas:**

1. Implementado no server, em vez de no storage engine.

2. Compressed MyISAM tables são suportadas apenas ao usar o formato de Row comprimido. Tabelas que usam o formato de Row comprimido com MyISAM são somente leitura.

3. Implementado no server via funções de encryption.

4. Implementado no server via funções de encryption; No MySQL 5.7 e posterior, data-at-rest encryption é suportado.

5. Implementado no server via funções de encryption; NDB backups encrypted a partir do NDB 8.0.22; transparent NDB file system encryption suportado no NDB 8.0.29 e posterior.

6. O suporte para FULLTEXT indexes está disponível no MySQL 5.6 e posterior.

7. O suporte para geospatial indexing está disponível no MySQL 5.7 e posterior.

8. O InnoDB utiliza hash indexes internamente para seu recurso Adaptive Hash Index.

9. Consulte a discussão mais adiante nesta seção.