# Capítulo 18 Motores de Armazenamento Alternativos

Os motores de armazenamento são componentes do MySQL que lidam com as operações SQL para diferentes tipos de tabela. `InnoDB` é o motor de armazenamento padrão e de propósito geral, e a Oracle recomenda usá-lo para tabelas, exceto em casos de uso especializados. (A declaração `CREATE TABLE` no MySQL 8.0 cria tabelas `InnoDB` por padrão.)

O MySQL Server utiliza uma arquitetura de motor de armazenamento plugável que permite que os motores de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

Para determinar quais motores de armazenamento o seu servidor suporta, use a declaração `SHOW ENGINES`. O valor na coluna `Support` indica se um motor pode ser usado. Um valor de `YES`, `NO` ou `DEFAULT` indica que um motor está disponível, não disponível ou disponível e atualmente definido como o motor de armazenamento padrão.

```
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

Este capítulo abrange casos de uso para motores de armazenamento de propósito especial do MySQL. Não abrange o motor de armazenamento padrão `InnoDB` ou o motor de armazenamento `NDB`, que são abordados no Capítulo 17, *O Motor de Armazenamento InnoDB* e no Capítulo 25, *MySQL NDB Cluster 8.0*. Para usuários avançados, também contém uma descrição da arquitetura do motor de armazenamento plugável (consulte Seção 18.11, “Visão geral da arquitetura do motor de armazenamento MySQL”).

Para obter informações sobre as funcionalidades oferecidas nos binários comerciais do MySQL Server, consulte [*MySQL Editions][(https://www.mysql.com/products/)], no site do MySQL. Os motores de armazenamento disponíveis podem depender da edição do MySQL que você está usando.

Para respostas a perguntas comumente feitas sobre os motores de armazenamento do MySQL, consulte a Seção A.2, “Perguntas Frequentes do MySQL 8.0: Motores de Armazenamento”.

## Motores de Armazenamento Compatíveis com o MySQL 8.0

* `InnoDB`: O mecanismo de armazenamento padrão no MySQL 8.0. `InnoDB` é um mecanismo de armazenamento seguro para transações (compatível com ACID) para o MySQL que possui capacidades de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. `InnoDB` o bloqueio em nível de linha (sem escalonamento para blocos de granularidade mais grosseira) e as leituras consistentes não bloqueantes ao estilo Oracle aumentam a concorrência e o desempenho multiusuário. `InnoDB` armazena dados do usuário em índices agrupados para reduzir o I/O para consultas comuns com base em chaves primárias. Para manter a integridade dos dados, `InnoDB` também suporta `FOREIGN KEY` restrições de integridade referencial. Para mais informações sobre `InnoDB`, consulte o Capítulo 17, *O Engenheiro de Armazenamento InnoDB*.

* `MyISAM`: Essas tabelas têm uma pequena pegada. O bloqueio de nível de tabela limita o desempenho em cargas de trabalho de leitura/escrita, portanto, é frequentemente usado em cargas de trabalho de leitura ou quase exclusivamente de leitura em configurações de Web e armazenamento de dados.

* `Memory`: Armazena todos os dados na RAM, para acesso rápido em ambientes que exigem pesquisas rápidas de dados não críticos. Este motor era anteriormente conhecido como o motor `HEAP`. Seus casos de uso estão diminuindo; `InnoDB`, com sua área de memória de pool de tampão, oferece uma maneira geral e durável para manter a maioria ou todos os dados na memória, e `NDBCLUSTER` oferece pesquisas rápidas de chave-valor para grandes conjuntos de dados distribuídos.

* `CSV`: Seus quadros são, na verdade, arquivos de texto com valores separados por vírgula. As tabelas CSV permitem importar ou exportar dados no formato CSV, para trocar dados com scripts e aplicativos que leem e escrevem esse mesmo formato. Como as tabelas CSV não são indexadas, você normalmente mantém os dados nas tabelas `InnoDB` durante o funcionamento normal e usa apenas as tabelas CSV durante a etapa de importação ou exportação.

* `Archive`: Essas tabelas compactas, não indexadas, são destinadas a armazenar e recuperar grandes quantidades de informações históricas, arquivadas ou de auditoria de segurança, que raramente são referenciadas.

* `Blackhole`: O motor de armazenamento Blackhole aceita, mas não armazena dados, semelhante ao dispositivo Unix `/dev/null`. As consultas sempre retornam um conjunto vazio. Essas tabelas podem ser usadas em configurações de replicação onde as declarações DML são enviadas para servidores replicados, mas o servidor fonte não mantém sua própria cópia dos dados.

* `NDB` (também conhecido como `NDBCLUSTER`): Este motor de banco de dados agrupado é particularmente adequado para aplicações que exigem o maior grau possível de tempo de atividade e disponibilidade.

* `Merge`: Permite que um DBA ou desenvolvedor MySQL agrupe logicamente uma série de tabelas `MyISAM` idênticas e as refira como um único objeto. É útil em ambientes VLDB, como data warehousing.

* `Federated`: Oferece a capacidade de vincular servidores MySQL separados para criar um banco de dados lógico a partir de muitos servidores físicos. Muito bom para ambientes distribuídos ou de data mart.

* `Example`: Este motor serve como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos motores de armazenamento. É principalmente de interesse para desenvolvedores. O motor de armazenamento é um "stub" que não faz nada. Você pode criar tabelas com este motor, mas nenhum dado pode ser armazenado neles ou recuperado deles.

Você não está restrito a usar o mesmo mecanismo de armazenamento para um servidor ou esquema inteiro. Você pode especificar o mecanismo de armazenamento para qualquer tabela. Por exemplo, um aplicativo pode usar principalmente tabelas `InnoDB`, com uma tabela `CSV` para exportar dados para uma planilha e algumas tabelas `MEMORY` para espaços de trabalho temporários.

**Escolhendo um motor de armazenamento**

Os vários motores de armazenamento fornecidos com o MySQL são projetados com diferentes casos de uso em mente. O quadro a seguir fornece uma visão geral de alguns motores de armazenamento fornecidos com o MySQL, com notas esclarecendo o quadro.

**Tabela 18.1 Resumo das características das unidades de armazenamento**

<table frame="box" rules="all" summary="Summary of features supported per storage engine."><col style="width: 10%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><thead><tr><th scope="col">Feature</th> <th scope="col">MyISAM</th> <th scope="col">Memory</th> <th scope="col">InnoDB</th> <th scope="col">Archive</th> <th scope="col">NDB</th> </tr></thead><tbody><tr><th scope="row">B-tree indexes</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr><th scope="row">Backup/point-in-time recovery (note 1)</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr><th scope="row">Cluster database support</th> <td>No</td> <td>No</td> <td>No</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Clustered indexes</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr><th scope="row">Compressed data</th> <td>Yes (note 2)</td> <td>No</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr><th scope="row">Data caches</th> <td>No</td> <td>N/A</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Dados criptografados</th> <td>Sim (nota 3)</td> <td>Sim (nota 3)</td> <td>Sim (nota 4)</td> <td>Sim (nota 3)</td> <td>Sim (nota 5)</td> </tr><tr><th scope="row">Foreign key support</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Full-text search indexes</th> <td>Yes</td> <td>No</td> <td>Yes (note 6)</td> <td>No</td> <td>No</td> </tr><tr><th scope="row">Geospatial data type support</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr><th scope="row">Geospatial indexing support</th> <td>Yes</td> <td>No</td> <td>Yes (note 7)</td> <td>No</td> <td>No</td> </tr><tr><th scope="row">Hash indexes</th> <td>No</td> <td>Yes</td> <td>No (note 8)</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Index caches</th> <td>Yes</td> <td>N/A</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Locking granularity</th> <td>Table</td> <td>Table</td> <td>Row</td> <td>Row</td> <td>Row</td> </tr><tr><th scope="row">MVCC</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr><th scope="row">Replication support (note 1)</th> <td>Yes</td> <td>Limited (note 9)</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr><th scope="row">Storage limits</th> <td>256TB</td> <td>RAM</td> <td>64TB</td> <td>None</td> <td>384EB</td> </tr><tr><th scope="row">T-tree indexes</th> <td>No</td> <td>No</td> <td>No</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Transactions</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th scope="row">Update statistics for data dictionary</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

**Notas:**

1. Implementado no servidor, e não no motor de armazenamento.

2. As tabelas MyISAM compactadas são suportadas apenas quando se usa o formato de linha compactado. As tabelas que usam o formato de linha compactada com MyISAM são somente de leitura.

3. Implementado no servidor através de funções de criptografia.

4. Implementado no servidor por meio de funções de criptografia; No MySQL 5.7 e versões posteriores, a criptografia de dados em repouso é suportada.

5. Implementado no servidor por meio de funções de criptografia; backups NDB criptografados a partir do NDB 8.0.22; criptografia transparente do sistema de arquivos NDB suportada no NDB 8.0.29 e versões posteriores.

6. O suporte para índices FULLTEXT está disponível no MySQL 5.6 e versões posteriores.

7. O suporte para indexação geospacial está disponível no MySQL 5.7 e versões posteriores.

8. O InnoDB utiliza índices de hash internamente para sua funcionalidade de Índice Hash Adaptável.

9. Veja a discussão mais adiante nesta seção.