# Capítulo 18 Motores de Armazenamento Alternativos

**Índice**

18.1 Configurando o Motor de Armazenamento

18.2 O Motor de Armazenamento MyISAM:   18.2.1 Opções de Inicialização do MyISAM

```
18.2.2 Space Needed for Keys

18.2.3 MyISAM Table Storage Formats

18.2.4 MyISAM Table Problems
```

18.3 O Motor de Armazenamento de MEMÓRIA

18.4 O Motor de Armazenamento CSV:   18.4.1 Reparo e verificação de tabelas CSV

```
18.4.2 CSV Limitations
```

18.5 O Motor de Armazenamento ARCHIVE

18.6 O Motor de Armazenamento BLACKHOLE

18.7 O Motor de Armazenamento MERGE:   18.7.1 Vantagens e Desvantagens da Tabela MERGE

```
18.7.2 MERGE Table Problems
```

18.8 O Motor de Armazenamento FEDERATED:   18.8.1 Visão Geral do Motor de Armazenamento FEDERATED

```
18.8.2 How to Create FEDERATED Tables

18.8.3 FEDERATED Storage Engine Notes and Tips

18.8.4 FEDERATED Storage Engine Resources
```

18.9 O Motor de Armazenamento EXAMPLE

18.10 Outros motores de armazenamento

18.11 Visão geral da arquitetura do mecanismo de armazenamento do MySQL:   18.11.1 Arquitetura de mecanismo de armazenamento plugável

```
18.11.2 The Common Database Server Layer
```

Os motores de armazenamento são componentes do MySQL que gerenciam as operações SQL para diferentes tipos de tabelas. `InnoDB` é o motor de armazenamento padrão e de propósito geral, e a Oracle recomenda usá-lo para tabelas, exceto em casos de uso especializados. (A declaração `CREATE TABLE` no MySQL 8.0 cria tabelas `InnoDB` por padrão.)

O MySQL Server utiliza uma arquitetura de mecanismo de armazenamento plugável que permite que os mecanismos de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

Para determinar quais motores de armazenamento seu servidor suporta, use a declaração `SHOW ENGINES`. O valor na coluna `Support` indica se um motor pode ser usado. Um valor de `YES`, `NO` ou `DEFAULT` indica que um motor está disponível, não está disponível ou está disponível e atualmente configurado como o motor de armazenamento padrão.

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

Este capítulo aborda casos de uso para motores de armazenamento MySQL de propósito especial. Ele não aborda o motor de armazenamento padrão `InnoDB` ou o motor de armazenamento `NDB`, que são abordados no Capítulo 17, *O Motor de Armazenamento InnoDB* e no Capítulo 25, *MySQL NDB Cluster 8.0*. Para usuários avançados, ele também contém uma descrição da arquitetura de motores de armazenamento plugáveis (veja a Seção 18.11, “Visão Geral da Arquitetura do Motor de Armazenamento MySQL”).

Para obter informações sobre as funcionalidades oferecidas nos binários comerciais do MySQL Server, consulte *Edições do MySQL*, no site do MySQL. Os motores de armazenamento disponíveis podem depender da edição do MySQL que você está usando.

Para respostas a perguntas frequentes sobre os motores de armazenamento do MySQL, consulte a Seção A.2, “Perguntas Frequentes do MySQL 8.0: Motores de Armazenamento”.

## Motores de Armazenamento Suportado pelo MySQL 8.0

- `InnoDB`: O motor de armazenamento padrão no MySQL 8.0. `InnoDB` é um motor de armazenamento seguro para transações (compatível com ACID) para o MySQL que possui recursos de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. O bloqueio a nível de linha `InnoDB` (sem escalonamento para bloqueios de granularidade mais grosseira) e as leituras consistentes sem bloqueio no estilo Oracle aumentam a concorrência e o desempenho em multiusuário. `InnoDB` armazena os dados do usuário em índices agrupados para reduzir o I/O para consultas comuns baseadas em chaves primárias. Para manter a integridade dos dados, `InnoDB` também suporta restrições de integridade referencial `FOREIGN KEY`. Para obter mais informações sobre `InnoDB`, consulte o Capítulo 17, *O Motor de Armazenamento InnoDB*.

- `MyISAM`: Essas tabelas têm uma pequena pegada. O bloqueio de nível de tabela limita o desempenho em cargas de trabalho de leitura/escrita, portanto, é frequentemente usado em cargas de trabalho de leitura apenas ou de leitura predominante em configurações de armazenamento de dados e Web.

- `Memory`: Armazena todos os dados na RAM, para acesso rápido em ambientes que exigem consultas rápidas de dados não críticos. Este motor era anteriormente conhecido como o motor `HEAP`. Seus casos de uso estão diminuindo; `InnoDB` com sua área de memória de pool de buffers fornece uma maneira geral e durável de manter a maioria ou todos os dados na memória, e `NDBCLUSTER` fornece buscas rápidas de chave-valor para grandes conjuntos de dados distribuídos.

- `CSV`: Suas tabelas são, na verdade, arquivos de texto com valores separados por vírgula. As tabelas CSV permitem importar ou exportar dados no formato CSV, para trocar dados com scripts e aplicativos que leem e escrevem esse mesmo formato. Como as tabelas CSV não são indexadas, você geralmente mantém os dados nas tabelas `InnoDB` durante o funcionamento normal e usa apenas as tabelas CSV durante a etapa de importação ou exportação.

- `Archive`: Essas tabelas compactas e não indexadas são destinadas a armazenar e recuperar grandes quantidades de informações históricas, arquivadas ou de auditoria de segurança, que são raramente referenciadas.

- `Blackhole`: O motor de armazenamento Blackhole aceita, mas não armazena dados, semelhante ao dispositivo Unix `/dev/null`. As consultas sempre retornam um conjunto vazio. Essas tabelas podem ser usadas em configurações de replicação onde as instruções DML são enviadas para servidores replicados, mas o servidor de origem não mantém sua própria cópia dos dados.

- `NDB` (também conhecido como `NDBCLUSTER`): Este motor de banco de dados em cluster é particularmente adequado para aplicações que exigem o maior grau possível de tempo de atividade e disponibilidade.

- `Merge`: Permite que um DBA ou desenvolvedor do MySQL agrupe logicamente uma série de tabelas `MyISAM` idênticas e as refira como um único objeto. É útil em ambientes VLDB, como data warehousing.

- `Federated`: Oferece a capacidade de vincular servidores MySQL separados para criar um banco de dados lógico a partir de muitos servidores físicos. Muito bom para ambientes distribuídos ou de data mart.

- `Example`: Este motor serve como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos motores de armazenamento. Ele é principalmente de interesse para desenvolvedores. O motor de armazenamento é um "esqueleto" que não faz nada. Você pode criar tabelas com este motor, mas nenhum dado pode ser armazenado neles ou recuperado deles.

Você não está limitado a usar o mesmo mecanismo de armazenamento para todo o servidor ou esquema. Você pode especificar o mecanismo de armazenamento para qualquer tabela. Por exemplo, um aplicativo pode usar principalmente tabelas `InnoDB` e uma tabela `CSV` para exportar dados para uma planilha e algumas tabelas `MEMORY` para espaços de trabalho temporários.

**Escolhendo um Motor de Armazenamento**

Os vários motores de armazenamento fornecidos com o MySQL foram projetados com diferentes casos de uso em mente. A tabela a seguir fornece uma visão geral de alguns motores de armazenamento fornecidos com o MySQL, com notas explicativas após a tabela.

**Tabela 18.1 Resumo das características das unidades de armazenamento**

<table summary="Resumo das funcionalidades suportadas por motor de armazenamento."><thead><tr><th scope="col">Característica</th> <th scope="col">MyISAM</th> <th scope="col">Memória</th> <th scope="col">InnoDB</th> <th scope="col">Arquivo</th> <th scope="col">NDB</th> </tr></thead><tbody><tr><th>Índices de árvores B</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th>Backup/recuperação em ponto no tempo (nota 1)</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th>Suporte a bancos de dados em cluster</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Índices agrupados</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th>Dados comprimidos</th> <td>Sim (nota 2)</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr><th>Caches de dados</th> <td>Não</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Dados criptografados</th> <td>Sim (nota 3)</td> <td>Sim (nota 3)</td> <td>Sim (nota 4)</td> <td>Sim (nota 3)</td> <td>Sim (nota 5)</td> </tr><tr><th>Suporte para chave estrangeira</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Índices de pesquisa de texto completo</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 6)</td> <td>Não</td> <td>Não</td> </tr><tr><th>Suporte ao tipo de dados geográficos</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th>Suporte de indexação geospacial</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 7)</td> <td>Não</td> <td>Não</td> </tr><tr><th>Índices de hash</th> <td>Não</td> <td>Sim</td> <td>Não (nota 8)</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Caches de índice</th> <td>Sim</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Granularidade de bloqueio</th> <td>Tabela</td> <td>Tabela</td> <td>Linha</td> <td>Linha</td> <td>Linha</td> </tr><tr><th>MVCC</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr><th>Suporte à replicação (nota 1)</th> <td>Sim</td> <td>Limpadas (nota 9)</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr><th>Limites de armazenamento</th> <td>256 TB</td> <td>RAM</td> <td>64 TB</td> <td>Nenhum</td> <td>384EB</td> </tr><tr><th>Índices de T-tree</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Transações</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr><tr><th>Atualizar estatísticas para o dicionário de dados</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

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
