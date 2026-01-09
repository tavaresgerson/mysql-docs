# Capítulo 18 Motores de Armazenamento Alternativos

**Índice**

18.1 Configurando o Motor de Armazenamento

18.2 O Motor de Armazenamento MyISAM:   18.2.1 Opções de Inicialização do MyISAM

    18.2.2 Espaço Necessário para Chaves

    18.2.3 Formatos de Armazenamento de Tabelas MyISAM

    18.2.4 Problemas com Tabelas MyISAM

18.3 O Motor de Armazenamento MEMORY

18.4 O Motor de Armazenamento CSV:   18.4.1 Reparo e Verificação de Tabelas CSV

    18.4.2 Limitações do CSV

18.5 O Motor de Armazenamento ARCHIVE

18.6 O Motor de Armazenamento BLACKHOLE

18.7 O Motor de Armazenamento MERGE:   18.7.1 Vantagens e Desvantagens das Tabelas MERGE

    18.7.2 Problemas com Tabelas MERGE

18.8 O Motor de Armazenamento FEDERATED:   18.8.1 Visão Geral do Motor de Armazenamento FEDERATED

    18.8.2 Como Criar Tabelas FEDERATED

    18.8.3 Notas e Dicas sobre o Motor de Armazenamento FEDERATED

    18.8.4 Recursos do Motor de Armazenamento FEDERATED

18.9 O Motor de Armazenamento EXAMPLE

18.10 Outros Motores de Armazenamento

18.11 Visão Geral da Arquitetura do Motor de Armazenamento MySQL:   18.11.1 Arquitetura de Motores de Armazenamento Pluggable

    18.11.2 A Cama de Servidor de Banco de Dados Comum

Os motores de armazenamento são componentes do MySQL que gerenciam as operações SQL para diferentes tipos de tabelas. O `InnoDB` é o motor de armazenamento padrão e de propósito geral, e a Oracle recomenda usá-lo para tabelas, exceto em casos de uso especializados. (A instrução `CREATE TABLE` no MySQL 9.5 cria tabelas `InnoDB` por padrão.)

O MySQL Server utiliza uma arquitetura de motor de armazenamento pluggable que permite que os motores de armazenamento sejam carregados e descarregados de um servidor MySQL em execução.

Para determinar quais motores de armazenamento seu servidor suporta, use a instrução `SHOW ENGINES`. O valor na coluna `Support` indica se um motor pode ser usado. Um valor de `YES`, `NO` ou `DEFAULT` indica que um motor está disponível, não está disponível ou está disponível e atualmente configurado como o motor de armazenamento padrão.

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

Este capítulo aborda casos de uso para motores de armazenamento MySQL de propósito especial. Ele não aborda o motor de armazenamento padrão `InnoDB` ou o motor de armazenamento `NDB`, que são abordados no Capítulo 17, *O Motor de Armazenamento InnoDB* e no Capítulo 25, *MySQL NDB Cluster 9.5*. Para usuários avançados, também contém uma descrição da arquitetura de motores de armazenamento plugáveis (veja Seção 18.11, “Visão Geral da Arquitetura do Motor de Armazenamento MySQL”).

Para informações sobre as funcionalidades oferecidas nos binários comerciais do MySQL Server, consulte [*Edições MySQL*](https://www.mysql.com/products/), no site do MySQL. Os motores de armazenamento disponíveis podem depender da edição do MySQL que você está usando.

Para respostas a perguntas frequentes sobre motores de armazenamento MySQL, consulte a Seção A.2, “MySQL 9.5 FAQ: Motores de Armazenamento”.

## Motores de Armazenamento Compatíveis com o MySQL 9.5


* `InnoDB`: O motor de armazenamento padrão no MySQL 9.5. `InnoDB` é um motor de armazenamento seguro para transações (compatível com ACID) para o MySQL que possui recursos de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. O bloqueio de nível de linha `InnoDB` (sem escalonamento para blocos de granularidade mais grosseira) e as leituras consistentes sem bloqueio no estilo Oracle aumentam a concorrência e o desempenho em múltiplos usuários. `InnoDB` armazena os dados do usuário em índices agrupados para reduzir o I/O para consultas comuns baseadas em chaves primárias. Para manter a integridade dos dados, `InnoDB` também suporta restrições de integridade referencial `FOREIGN KEY`. Para mais informações sobre `InnoDB`, consulte o Capítulo 17, *O Motor de Armazenamento InnoDB*.

* `MyISAM`: Essas tabelas têm um pequeno espaço. O bloqueio de nível de tabela limita o desempenho em cargas de trabalho de leitura/escrita, então é frequentemente usado em cargas de trabalho de leitura apenas ou leitura predominante em configurações de Web e data warehousing.

* `Memory`: Armazena todos os dados na RAM, para acesso rápido em ambientes que requerem pesquisas rápidas de dados não críticos. Esse motor era anteriormente conhecido como o motor `HEAP`. Seus casos de uso estão diminuindo; `InnoDB`, com sua área de memória do pool de buffers, oferece uma maneira geral e durável de manter a maioria ou todos os dados na memória, e `NDBCLUSTER` fornece pesquisas rápidas de valores-chave para grandes conjuntos de dados distribuídos.

* `CSV`: Suas tabelas são realmente arquivos de texto com valores separados por vírgula. As tabelas CSV permitem que você importe ou exija dados no formato CSV, para trocar dados com scripts e aplicativos que leem e escrevem esse mesmo formato. Como as tabelas CSV não são indexadas, você geralmente mantém os dados nas tabelas `InnoDB` durante a operação normal e usa apenas as tabelas CSV durante a etapa de importação ou exportação.

* `Arquivo`: Essas tabelas compactas e não indexadas são destinadas para armazenar e recuperar grandes quantidades de informações históricas, arquivadas ou de auditoria de segurança, que são raramente referenciadas.

* `Blackhole`: O motor de armazenamento Blackhole aceita, mas não armazena dados, semelhante ao dispositivo Unix `/dev/null`. As consultas sempre retornam um conjunto vazio. Essas tabelas podem ser usadas em configurações de replicação onde as instruções DML são enviadas para servidores replicados, mas o servidor fonte não mantém sua própria cópia dos dados.

* `NDB` (também conhecido como `NDBCLUSTER`): Este motor de banco de dados clonado é particularmente adequado para aplicações que exigem o maior grau possível de tempo de atividade e disponibilidade.

* `Merge`: Permite que um DBA ou desenvolvedor MySQL agrupe logicamente uma série de tabelas `MyISAM` idênticas e as refira como um único objeto. Bom para ambientes VLDB, como data warehousing.

* `Federado`: Oferece a capacidade de vincular servidores MySQL separados para criar um único banco de dados lógico a partir de muitos servidores físicos. Muito bom para ambientes distribuídos ou de data mart.

* `Exemplo`: Este motor serve como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos motores de armazenamento. É principalmente de interesse para desenvolvedores. O motor de armazenamento é um “espelho” que não faz nada. Você pode criar tabelas com este motor, mas nenhum dado pode ser armazenado nelas ou recuperado delas.

Você não está restrito a usar o mesmo motor de armazenamento para um servidor ou esquema inteiro. Você pode especificar o motor de armazenamento para qualquer tabela. Por exemplo, um aplicativo pode usar principalmente tabelas `InnoDB`, com uma tabela `CSV` para exportar dados para uma planilha e algumas tabelas `MEMORY` para espaços de trabalho temporários.

**Escolhendo um Motor de Armazenamento**

Os vários motores de armazenamento fornecidos com o MySQL foram projetados com diferentes casos de uso em mente. A tabela a seguir fornece uma visão geral de alguns motores de armazenamento fornecidos com o MySQL, com notas explicativas após a tabela.

**Tabela 18.1 Resumo das Características dos Motores de Armazenamento**

<table frame="box" rules="all" summary="Resumo das funcionalidades suportadas por cada mecanismo de armazenamento.">
<tr><th>Característica</th> <th>MyISAM</th> <th>Memória</th> <th>InnoDB</th> <th>Arquivamento</th> <th>NDB</th> </tr>
<tr><th>Indekses B-tree</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr>
<tr><th>Recuperação de backup/ponto no tempo (nota 1)</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr>
<tr><th>Suporte a bancos de dados agrupados</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Indekses agrupados</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr>
<tr><th>Dados comprimidos</th> <td>Sim (nota 2)</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr>
<tr><th>Caches de dados</th> <td>Não</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Dados criptografados</th> <td>Sim (nota 3)</td> <td>Sim (nota 3)</td> <td>Sim (nota 4)</td> <td>Sim (nota 3)</td> <td>Sim (nota 5)</td> </tr>
<tr><th>Suporte a chaves estrangeiras</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Indekses de busca full-text</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 6)</td> <td>Não</td> <td>Não</td> </tr>
<tr><th>Suporte a tipos de dados geográficos</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr>
<tr><th>Suporte a indexação geográficos</th> <td>Sim</td> <td>Não</td> <td>Sim (nota 7)</td> <td>Não</td> <td>Não</td> </tr>
<tr><th>Indekses de hash</th> <td>Não</td> <td>Sim</td> <td>Não (nota 8)</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Caches de índices</th> <td>Sim</td> <td>N/A</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Granularidade de bloqueio</th> <td>Tabela</td> <td>Tabela</td> <td>Linha</td> <td>Linha</td> <td>Linha</td> </tr>
<tr><th>MVCC</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr>
<tr><th>Suporte a replicação (nota 1)</th> <td>Sim</td> <td>Limitado (nota 9)</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr>
<tr><th>Limites de armazenamento</th> <td>256TB</td> <td>RAM</td> <td>64TB</td> <td>Nenhum</td> <td>384EB</td> </tr>
<tr><th>Indekses T-tree</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Transações</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> </tr>
<tr><th>Estatísticas de atualização para o dicionário de dados</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

**Notas:**

1. Implementado no servidor, em vez do motor de armazenamento.

2. As tabelas MyISAM compactadas são suportadas apenas quando o formato de linha compactado é usado. As tabelas que usam o formato de linha compactada com MyISAM são apenas de leitura.

3. Implementado no servidor por meio de funções de criptografia.

4. Implementado no servidor por meio de funções de criptografia; no MySQL 5.7 e versões posteriores, a criptografia de dados em repouso é suportada.

5. Implementado no servidor por meio de funções de criptografia; backups NDB criptografados a partir do NDB 8.0.22; criptografia transparente do sistema de arquivos NDB é suportada no NDB 8.0.29 e versões posteriores.

6. O suporte para índices FULLTEXT está disponível no MySQL 5.6 e versões posteriores.

7. O suporte para indexação geospacial está disponível no MySQL 5.7 e versões posteriores.

8. O InnoDB utiliza índices hash internamente para sua funcionalidade de Índice Hash Adaptativo.

9. Consulte a discussão mais adiante nesta seção.