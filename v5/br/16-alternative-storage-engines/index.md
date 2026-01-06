# Capítulo 15 Motores de Armazenamento Alternativos

**Índice**

15.1 Configurando o Motor de Armazenamento

15.2 O Motor de Armazenamento MyISAM:   15.2.1 Opções de Inicialização do MyISAM

```
15.2.2 Space Needed for Keys

15.2.3 MyISAM Table Storage Formats

15.2.4 MyISAM Table Problems
```

15.3 O Motor de Armazenamento de MEMÓRIA

15.4 O Motor de Armazenamento CSV:   15.4.1 Reparo e verificação de tabelas CSV

```
15.4.2 CSV Limitations
```

15.5 O Motor de Armazenamento ARCHIVE

15.6 O Motor de Armazenamento BLACKHOLE

15.7 O Motor de Armazenamento MERGE:   15.7.1 Vantagens e Desvantagens da Tabela MERGE

```
15.7.2 MERGE Table Problems
```

15.8 O Motor de Armazenamento FEDERATED:   15.8.1 Visão Geral do Motor de Armazenamento FEDERATED

```
15.8.2 How to Create FEDERATED Tables

15.8.3 FEDERATED Storage Engine Notes and Tips

15.8.4 FEDERATED Storage Engine Resources
```

15.9 O Motor de Armazenamento EXAMPLE

15.10 Outros motores de armazenamento

15.11 Visão geral da arquitetura do mecanismo de armazenamento do MySQL:   15.11.1 Arquitetura de mecanismo de armazenamento plugável

```
15.11.2 The Common Database Server Layer
```

Os motores de armazenamento são componentes do MySQL que gerenciam as operações SQL para diferentes tipos de tabelas. O `InnoDB` é o motor de armazenamento padrão e de propósito geral, e a Oracle recomenda usá-lo para tabelas, exceto em casos de uso especializados. (A instrução `CREATE TABLE` no MySQL 5.7 cria tabelas `InnoDB` por padrão.)

O MySQL Server utiliza uma arquitetura de mecanismo de armazenamento plugável que permite que os mecanismos de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

Para determinar quais motores de armazenamento seu servidor suporta, use a instrução `SHOW ENGINES`. O valor na coluna `Support` indica se um motor pode ser usado. Um valor de `YES`, `NO` ou `DEFAULT` indica que um motor está disponível, não está disponível ou está disponível e atualmente configurado como o motor de armazenamento padrão.

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

Este capítulo aborda casos de uso para motores de armazenamento MySQL de propósito especial. Ele não aborda o motor de armazenamento padrão `InnoDB` ou o motor de armazenamento `NDB`, que são abordados no Capítulo 14, *O Motor de Armazenamento InnoDB*, e no Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*. Para usuários avançados, este capítulo também contém uma descrição da arquitetura de motor de armazenamento plugável (veja a Seção 15.11, “Visão Geral da Arquitetura do Motor de Armazenamento MySQL”).

Para obter informações sobre as funcionalidades oferecidas nos binários comerciais do MySQL Server, consulte [*Edições do MySQL*](https://www.mysql.com/products/), no site do MySQL. Os motores de armazenamento disponíveis podem depender da edição do MySQL que você está usando.

Para respostas a perguntas frequentes sobre os motores de armazenamento do MySQL, consulte a Seção A.2, “Perguntas Frequentes do MySQL 5.7: Motores de Armazenamento”.

## Motores de Armazenamento Suportado pelo MySQL 5.7

- `InnoDB`: O mecanismo de armazenamento padrão no MySQL 5.7. `InnoDB` é um mecanismo de armazenamento seguro para transações (compatível com ACID) para o MySQL que possui recursos de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. O bloqueio de nível de linha `InnoDB` (sem escalonamento para bloqueios de granularidade mais grosseira) e as leituras consistentes sem bloqueio no estilo Oracle aumentam a concorrência e o desempenho em multiusuário. O `InnoDB` armazena os dados do usuário em índices agrupados para reduzir o I/O para consultas comuns baseadas em chaves primárias. Para manter a integridade dos dados, o `InnoDB` também suporta restrições de integridade referencial `FOREIGN KEY`. Para obter mais informações sobre o `InnoDB`, consulte o Capítulo 14, *O Mecanismo de Armazenamento InnoDB*.

- `MyISAM`: Essas tabelas têm um pequeno espaço de armazenamento. O bloqueio de nível de tabela limita o desempenho em cargas de trabalho de leitura/escrita, portanto, é frequentemente usado em cargas de trabalho de leitura apenas ou de leitura predominante em configurações de Web e data warehousing.

- `Memória`: Armazena todos os dados na RAM, para acesso rápido em ambientes que exigem consultas rápidas de dados não críticos. Este motor era anteriormente conhecido como o motor `HEAP`. Seus casos de uso estão diminuindo; o `InnoDB`, com sua área de memória do pool de buffers, oferece uma maneira geral e durável de manter a maioria ou todos os dados na memória, e o `NDBCLUSTER` fornece consultas rápidas de chave-valor para grandes conjuntos de dados distribuídos.

- `CSV`: Suas tabelas são arquivos de texto com valores separados por vírgula. As tabelas CSV permitem importar ou exportar dados no formato CSV, para trocar dados com scripts e aplicativos que leem e escrevem esse mesmo formato. Como as tabelas CSV não são indexadas, você geralmente mantém os dados nas tabelas `InnoDB` durante o funcionamento normal e usa apenas as tabelas CSV durante a etapa de importação ou exportação.

- `Arquivo`: Essas tabelas compactas e não indexadas são destinadas a armazenar e recuperar grandes quantidades de informações históricas, arquivadas ou de auditoria de segurança, que raramente são acessadas.

- `Blackhole`: O motor de armazenamento Blackhole aceita, mas não armazena dados, semelhante ao dispositivo Unix `/dev/null`. As consultas sempre retornam um conjunto vazio. Essas tabelas podem ser usadas em configurações de replicação onde as instruções DML são enviadas para servidores replicados, mas o servidor de origem não mantém sua própria cópia dos dados.

- `NDB` (também conhecido como `NDBCLUSTER`): Este motor de banco de dados em cluster é particularmente adequado para aplicações que exigem o maior grau possível de tempo de atividade e disponibilidade.

- `Merge`: Permite que um DBA ou desenvolvedor MySQL agrupe logicamente uma série de tabelas `MyISAM` idênticas e as refira como um único objeto. Bom para ambientes VLDB, como data warehousing.

- `Federado`: Oferece a capacidade de vincular servidores MySQL separados para criar um banco de dados lógico a partir de muitos servidores físicos. Muito bom para ambientes distribuídos ou de data mart.

- `Exemplo`: Este motor serve como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos motores de armazenamento. Ele é principalmente de interesse para desenvolvedores. O motor de armazenamento é um "esqueleto" que não faz nada. Você pode criar tabelas com este motor, mas nenhum dado pode ser armazenado neles ou recuperado deles.

Você não está limitado a usar o mesmo mecanismo de armazenamento para todo o servidor ou esquema. Você pode especificar o mecanismo de armazenamento para qualquer tabela. Por exemplo, um aplicativo pode usar principalmente tabelas `InnoDB`, com uma tabela `CSV` para exportar dados para uma planilha e algumas tabelas `MEMORY` para espaços de trabalho temporários.

**Escolhendo um Motor de Armazenamento**

Os vários motores de armazenamento fornecidos com o MySQL foram projetados com diferentes casos de uso em mente. A tabela a seguir fornece uma visão geral de alguns motores de armazenamento fornecidos com o MySQL, com notas explicativas após a tabela.

**Tabela 15.1 Resumo das características das unidades de armazenamento**

<table frame="box" rules="all" summary="Resumo das funcionalidades suportadas por motor de armazenamento."><col style="width: 10%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><thead><tr><th scope="col">Característica</th> <th scope="col">MyISAM</th> <th scope="col">Memória</th> <th scope="col">InnoDB</th> <th scope="col">Arquivo</th> <th scope="col">NDB</th> </tr></thead><tbody><tr><th scope="row">Índices de árvores B</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th scope="row">Backup/recuperação em ponto no tempo (nota 1)</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th scope="row">Suporte a bancos de dados em cluster</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Índices agrupados</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th scope="row">Dados comprimidos</th> <td>Sim (nota 2)</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr><th scope="row">Caches de dados</th> <td>Não</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Dados criptografados</th> <td>Sim (nota 3)</td> <td>Sim (nota 3)</td> <td>Sim (nota 4)</td> <td>Sim (nota 3)</td> <td>Sim (nota 5)</td> </tr><tr><th scope="row">Suporte para chave estrangeira</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Índices de pesquisa de texto completo</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 6)</td> <td>Não</td> <td>Não</td> </tr><tr><th scope="row">Suporte ao tipo de dados geográficos</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th scope="row">Suporte de indexação geospacial</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 7)</td> <td>Não</td> <td>Não</td> </tr><tr><th scope="row">Índices de hash</th> <td>Não</td> <td>Sim</td> <td>Não (nota 8)</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Caches de índice</th> <td>Sim</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Granularidade de bloqueio</th> <td>Tabela</td> <td>Tabela</td> <td>Linha</td> <td>Linha</td> <td>Linha</td> </tr><tr><th scope="row">MVCC</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th scope="row">Suporte à replicação (nota 1)</th> <td>Sim</td> <td>Limpadas (nota 9)</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th scope="row">Limites de armazenamento</th> <td>256 TB</td> <td>RAM</td> <td>64 TB</td> <td>Nenhum</td> <td>384EB</td> </tr><tr><th scope="row">Índices de T-tree</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Transações</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row">Atualizar estatísticas para o dicionário de dados</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

**Observações:**

1. Implementado no servidor, e não no motor de armazenamento.

2. As tabelas MyISAM compactadas são suportadas apenas quando o formato de linha compactado é usado. As tabelas que usam o formato de linha compactada com MyISAM são apenas de leitura.

3. Implementado no servidor por meio de funções de criptografia.

4. Implementado no servidor por meio de funções de criptografia; No MySQL 5.7 e versões posteriores, a criptografia de dados em repouso é suportada.

5. Implementado no servidor por meio de funções de criptografia; backups criptografados do NDB a partir do NDB 8.0.22; criptografia transparente do sistema de arquivos do NDB suportada no NDB 8.0.29 e versões posteriores.

6. O suporte para índices FULLTEXT está disponível no MySQL 5.6 e versões posteriores.

7. O suporte para indexação georreferenciada está disponível no MySQL 5.7 e versões posteriores.

8. O InnoDB utiliza índices de hash internamente para sua funcionalidade de Índice Hash Adaptativo.

9. Veja a discussão mais adiante nesta seção.
