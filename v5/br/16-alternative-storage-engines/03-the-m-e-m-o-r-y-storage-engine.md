## 15.3 O Storage Engine MEMORY

O storage engine `MEMORY` (anteriormente conhecido como `HEAP`) cria tabelas de propósito especial cujo conteúdo é armazenado em memória. Como os dados são vulneráveis a falhas, problemas de hardware ou quedas de energia, use essas tabelas apenas como áreas de trabalho temporárias ou caches somente leitura para dados extraídos de outras tabelas.

**Tabela 15.4 Recursos do Storage Engine MEMORY**

<table frame="box" rules="all" summary="Recursos suportados pelo storage engine MEMORY."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Recurso</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Indexes B-tree</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Backup/Recuperação point-in-time</strong></span> (Implementado no server, e não no storage engine.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Database Cluster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes Clustered</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados compactados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de Dados</strong></span></td> <td>N/A</td> </tr><tr><td><span><strong>Dados criptografados</strong></span></td> <td>Sim (Implementado no server via funções de criptografia.)</td> </tr><tr><td><span><strong>Suporte a Foreign Key</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes de busca Full-text</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte a tipos de dados Geoespaciais</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte a Indexing Geoespacial</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes Hash</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Caches de Index</strong></span></td> <td>N/A</td> </tr><tr><td><span><strong>Granularidade de Lock</strong></span></td> <td>Tabela</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte a Replication</strong></span> (Implementado no server, e não no storage engine.)</td> <td>Limitado (Consulte a discussão adiante nesta seção.)</td> </tr><tr><td><span><strong>Limites de Storage</strong></span></td> <td>RAM</td> </tr><tr><td><span><strong>Indexes T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transactions</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Atualização de estatísticas para dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

* Quando Usar MEMORY ou NDB Cluster
* Características de Performance
* Características das Tabelas MEMORY
* Operações DDL para Tabelas MEMORY
* Indexes
* Tabelas Criadas pelo Usuário e Temporárias
* Carregamento de Dados
* Tabelas MEMORY e Replication
* Gerenciamento do Uso de Memória
* Recursos Adicionais

### Quando Usar MEMORY ou NDB Cluster

Desenvolvedores que procuram implementar aplicações que usam o storage engine `MEMORY` para dados importantes, de alta disponibilidade ou frequentemente atualizados devem considerar se o NDB Cluster é uma opção melhor. Um caso de uso típico para o engine `MEMORY` envolve estas características:

* Operações que envolvem dados transitórios e não críticos, como gerenciamento de sessão ou caching. Quando o MySQL server para ou reinicia, os dados nas tabelas `MEMORY` são perdidos.

* Storage in-memory para acesso rápido e baixa latência. O volume de dados pode caber inteiramente na memória sem que o sistema operacional precise fazer swap de páginas de memória virtual.

* Um padrão de acesso a dados somente leitura ou predominantemente leitura (atualizações limitadas).

O NDB Cluster oferece os mesmos recursos que o engine `MEMORY` com níveis de performance mais altos e fornece recursos adicionais não disponíveis no `MEMORY`:

* Lock no nível da Row e operação multi-thread para baixa contenção entre clientes.

* Escalabilidade mesmo com misturas de Statement que incluem operações de escrita (writes).
* Operação opcional com suporte em disco para durabilidade dos dados.
* Arquitetura *shared-nothing* e operação multi-host sem um único ponto de falha, permitindo 99,999% de disponibilidade.

* Distribuição automática de dados entre os nodes; os desenvolvedores de aplicações não precisam criar soluções customizadas de *sharding* ou Partitioning.

* Suporte para tipos de dados de tamanho variável (incluindo `BLOB` e `TEXT`) não suportados pelo `MEMORY`.

### Características de Performance

A performance do `MEMORY` é limitada pela contenção resultante da execução single-thread e pela sobrecarga de Table Lock ao processar atualizações. Isso limita a escalabilidade quando a carga aumenta, particularmente para misturas de Statement que incluem operações de escrita (writes).

Apesar do processamento in-memory para tabelas `MEMORY`, elas não são necessariamente mais rápidas do que as tabelas `InnoDB` em um server ocupado, para Queries de propósito geral ou sob uma Workload de leitura/escrita. Em particular, o Table Lock envolvido na realização de atualizações pode retardar o uso concorrente de tabelas `MEMORY` a partir de múltiplas sessões.

Dependendo dos tipos de Queries executadas em uma tabela `MEMORY`, você pode criar Indexes usando a estrutura de dados hash padrão (para pesquisar valores únicos com base em uma Unique Key) ou uma estrutura de dados B-tree de propósito geral (para todos os tipos de Queries envolvendo operadores de igualdade, desigualdade ou Range, como *menor que* ou *maior que*). As seções a seguir ilustram a sintaxe para criar os dois tipos de Indexes. Um problema comum de performance é usar os Indexes hash padrão em Workloads onde os Indexes B-tree são mais eficientes.

### Características das Tabelas MEMORY

O storage engine `MEMORY` associa cada tabela a um arquivo de disco, que armazena a definição da tabela (não os dados). O nome do arquivo começa com o nome da tabela e tem uma extensão `.frm`.

As tabelas `MEMORY` têm as seguintes características:

* O espaço para as tabelas `MEMORY` é alocado em pequenos blocos. As tabelas usam 100% de *dynamic hashing* para Inserts. Nenhuma área de Overflow ou espaço de Key extra é necessária. Nenhum espaço extra é necessário para *free lists*. Rows excluídas são colocadas em uma lista encadeada e são reutilizadas quando novos dados são inseridos na tabela. As tabelas `MEMORY` também não apresentam os problemas comumente associados a Deletes mais Inserts em tabelas *hashed*.

* As tabelas `MEMORY` usam um formato de storage de Row de tamanho fixo. Tipos de tamanho variável, como `VARCHAR`, são armazenados usando um tamanho fixo.

* As tabelas `MEMORY` não podem conter colunas `BLOB` ou `TEXT`.

* `MEMORY` inclui suporte para colunas `AUTO_INCREMENT`.

* As tabelas `MEMORY` que não são `TEMPORARY` são compartilhadas entre todos os clientes, assim como qualquer outra tabela não `TEMPORARY`.

### Operações DDL para Tabelas MEMORY

Para criar uma tabela `MEMORY`, especifique a cláusula `ENGINE=MEMORY` na Statement `CREATE TABLE`.

```sql
CREATE TABLE t (i INT) ENGINE = MEMORY;
```

Como indicado pelo nome do engine, as tabelas `MEMORY` são armazenadas na memória. Elas usam Indexes hash por padrão, o que as torna muito rápidas para buscas de valor único e muito úteis para criar tabelas temporárias. No entanto, quando o server é desligado, todas as Rows armazenadas nas tabelas `MEMORY` são perdidas. As tabelas em si continuam a existir porque suas definições são armazenadas em arquivos `.frm` no disco, mas elas ficam vazias quando o server é reiniciado.

Este exemplo mostra como você pode criar, usar e remover uma tabela `MEMORY`:

```sql
mysql> CREATE TABLE test ENGINE=MEMORY
           SELECT ip,SUM(downloads) AS down
           FROM log_table GROUP BY ip;
mysql> SELECT COUNT(ip),AVG(down) FROM test;
mysql> DROP TABLE test;
```

O tamanho máximo das tabelas `MEMORY` é limitado pela variável de sistema `max_heap_table_size`, que tem um valor padrão de 16MB. Para aplicar limites de tamanho diferentes para tabelas `MEMORY`, altere o valor desta variável. O valor em vigor para `CREATE TABLE`, ou um `ALTER TABLE` ou `TRUNCATE TABLE` subsequente, é o valor usado durante a vida útil da tabela. Um restart do server também define o tamanho máximo das tabelas `MEMORY` existentes para o valor global de `max_heap_table_size`. Você pode definir o tamanho para tabelas individuais, conforme descrito posteriormente nesta seção.

### Indexes

O storage engine `MEMORY` suporta Indexes `HASH` e `BTREE`. Você pode especificar um ou outro para um determinado Index adicionando uma cláusula `USING`, conforme mostrado aqui:

```sql
CREATE TABLE lookup
    (id INT, INDEX USING HASH (id))
    ENGINE = MEMORY;
CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
```

Para características gerais dos Indexes B-tree e hash, consulte a Seção 8.3.1, “Como o MySQL Usa Indexes”.

As tabelas `MEMORY` podem ter até 64 Indexes por tabela, 16 colunas por Index e um comprimento máximo de Key de 3072 bytes.

Se um Index hash de tabela `MEMORY` tiver um alto grau de duplicação de Key (muitas entradas de Index contendo o mesmo valor), as atualizações na tabela que afetam os valores de Key e todos os Deletes serão significativamente mais lentos. O grau dessa lentidão é proporcional ao grau de duplicação (ou, inversamente proporcional à cardinalidade do Index). Você pode usar um Index `BTREE` para evitar esse problema.

As tabelas `MEMORY` podem ter Keys não únicas. (Esta é uma característica incomum para implementações de Indexes hash.)

As colunas que são indexadas podem conter valores `NULL`.

### Tabelas Criadas pelo Usuário e Temporárias

O conteúdo das tabelas `MEMORY` é armazenado na memória, uma propriedade que as tabelas `MEMORY` compartilham com as Internal Temporary Tables que o server cria dinamicamente durante o processamento de Queries. No entanto, os dois tipos de tabelas diferem, pois as tabelas `MEMORY` não estão sujeitas à conversão de storage, enquanto as Internal Temporary Tables estão:

* Se uma Internal Temporary Table se tornar muito grande, o server a converte automaticamente para storage em disco, conforme descrito na Seção 8.4.4, “Uso de Internal Temporary Table no MySQL”.

* As tabelas `MEMORY` criadas pelo usuário nunca são convertidas em tabelas em disco.

### Carregamento de Dados

Para popular uma tabela `MEMORY` quando o MySQL server inicia, você pode usar a variável de sistema `init_file`. Por exemplo, você pode colocar Statements como `INSERT INTO ... SELECT` ou `LOAD DATA` em um arquivo para carregar a tabela a partir de uma fonte de dados persistente, e usar `init_file` para nomear o arquivo. Consulte a Seção 5.1.7, “Variáveis de Sistema do Server”, e a Seção 13.2.6, “Statement LOAD DATA”.

### Tabelas MEMORY e Replication

Quando um Replication Source Server desliga e reinicia, suas tabelas `MEMORY` ficam vazias. Para replicar esse efeito para as replicas, na primeira vez que o Source usa uma determinada tabela `MEMORY` após a inicialização, ele registra um Event que notifica as replicas de que a tabela deve ser esvaziada, escrevendo uma Statement `DELETE` ou (a partir do MySQL 5.7.32) `TRUNCATE TABLE` para essa tabela no Binary Log. Quando um Replication Replica Server desliga e reinicia, suas tabelas `MEMORY` também ficam vazias e ele escreve uma Statement `DELETE` ou (a partir do MySQL 5.7.32) `TRUNCATE TABLE` no seu próprio Binary Log, que é transmitido a quaisquer replicas downstream.

Ao usar tabelas `MEMORY` em uma topologia de Replication, em algumas situações, a tabela no Source e a tabela na Replica podem diferir. Para obter informações sobre como lidar com cada uma dessas situações para evitar leituras obsoletas (stale reads) ou erros, consulte a Seção 16.4.1.20, “Replication e Tabelas MEMORY”.

### Gerenciamento do Uso de Memória

O server precisa de memória suficiente para manter todas as tabelas `MEMORY` que estão em uso ao mesmo tempo.

A memória não é recuperada se você excluir Rows individuais de uma tabela `MEMORY`. A memória é recuperada apenas quando a tabela inteira é excluída. A memória que foi usada anteriormente para Rows excluídas é reutilizada para novas Rows dentro da mesma tabela. Para liberar toda a memória usada por uma tabela `MEMORY` quando você não precisar mais de seu conteúdo, execute `DELETE` ou `TRUNCATE TABLE` para remover todas as Rows, ou remova a tabela completamente usando `DROP TABLE`. Para liberar a memória usada pelas Rows excluídas, use `ALTER TABLE ENGINE=MEMORY` para forçar a reconstrução da tabela.

A memória necessária para uma Row em uma tabela `MEMORY` é calculada usando a seguinte expressão:

```sql
SUM_OVER_ALL_BTREE_KEYS(max_length_of_key + sizeof(char*) * 4)
+ SUM_OVER_ALL_HASH_KEYS(sizeof(char*) * 2)
+ ALIGN(length_of_row+1, sizeof(char*))
```

`ALIGN()` representa um fator de arredondamento para cima para fazer com que o comprimento da Row seja um múltiplo exato do tamanho do ponteiro `char`. O `sizeof(char*)` é 4 em máquinas de 32 bits e 8 em máquinas de 64 bits.

Conforme mencionado anteriormente, a variável de sistema `max_heap_table_size` define o limite do tamanho máximo das tabelas `MEMORY`. Para controlar o tamanho máximo de tabelas individuais, defina o valor de sessão desta variável antes de criar cada tabela. (Não altere o valor global de `max_heap_table_size`, a menos que pretenda que esse valor seja usado para tabelas `MEMORY` criadas por todos os clientes.) O exemplo a seguir cria duas tabelas `MEMORY`, com um tamanho máximo de 1MB e 2MB, respectivamente:

```sql
mysql> SET max_heap_table_size = 1024*1024;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t1 (id INT, UNIQUE(id)) ENGINE = MEMORY;
Query OK, 0 rows affected (0.01 sec)

mysql> SET max_heap_table_size = 1024*1024*2;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t2 (id INT, UNIQUE(id)) ENGINE = MEMORY;
Query OK, 0 rows affected (0.00 sec)
```

Ambas as tabelas voltam ao valor global de `max_heap_table_size` do server se o server reiniciar.

Você também pode especificar uma opção de tabela `MAX_ROWS` nas Statements `CREATE TABLE` para tabelas `MEMORY` para fornecer uma dica sobre o número de Rows que você planeja armazenar nelas. Isso não permite que a tabela cresça além do valor de `max_heap_table_size`, que ainda atua como uma restrição no tamanho máximo da tabela. Para obter a máxima flexibilidade ao usar `MAX_ROWS`, defina `max_heap_table_size` pelo menos tão alto quanto o valor para o qual você deseja que cada tabela `MEMORY` possa crescer.

### Recursos Adicionais

Um fórum dedicado ao storage engine `MEMORY` está disponível em <https://forums.mysql.com/list.php?92>.