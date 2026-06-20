## 15.3 O Motor de Armazenamento de MEMÓRIA

O motor de armazenamento `MEMORY` (anteriormente conhecido como `HEAP`) cria tabelas de propósito especial com conteúdos que são armazenados na memória. Como os dados são vulneráveis a falhas, problemas de hardware ou interrupções de energia, use apenas essas tabelas como áreas de trabalho temporárias ou caches somente de leitura para dados extraídos de outras tabelas.

**Tabela 15.4 Características do Motor de Armazenamento de MEMÓRIA**

<table frame="box" rules="all" summary="Features supported by the MEMORY storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Support</th> </tr></thead><tbody><tr><td><strong>Índices de árvore B</strong></td> <td>Yes</td> </tr><tr><td><strong>Backup/recuperação em ponto no tempo</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Suporte para banco de dados em cluster</strong></td> <td>No</td> </tr><tr><td><strong>Índices agrupados</strong></td> <td>No</td> </tr><tr><td><strong>Dados comprimidos</strong></td> <td>No</td> </tr><tr><td><strong>Caches de dados</strong></td> <td>N/A</td> </tr><tr><td><strong>Dados criptografados</strong></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><strong>Suporte para chave estrangeira</strong></td> <td>No</td> </tr><tr><td><strong>Indekses de pesquisa de texto completo</strong></td> <td>No</td> </tr><tr><td><strong>Suporte ao tipo de dados geográficos</strong></td> <td>No</td> </tr><tr><td><strong>Suporte para indexação geospacial</strong></td> <td>No</td> </tr><tr><td><strong>Indekses de hash</strong></td> <td>Yes</td> </tr><tr><td><strong>Cache do índice</strong></td> <td>N/A</td> </tr><tr><td><strong>Granularidade de bloqueio</strong></td> <td>Table</td> </tr><tr><td><strong>MVCC</strong></td> <td>No</td> </tr><tr><td><strong>Suporte para replicação</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Limited (See the discussion later in this section.)</td> </tr><tr><td><strong>Limites de armazenamento</strong></td> <td>RAM</td> </tr><tr><td><strong>Índices T-tree</strong></td> <td>No</td> </tr><tr><td><strong>Transações</strong></td> <td>No</td> </tr><tr><td><strong>Atualize as estatísticas do dicionário de dados</strong></td> <td>Yes</td> </tr></tbody></table>

* Quando usar MEMÓRIA ou NDB Cluster
* Características de desempenho
* Características das tabelas de MEMÓRIA
* Operações DDL para tabelas de MEMÓRIA
* Índices
* Tabelas criadas pelo usuário e temporárias
* Carregamento de dados
* Tabelas de MEMÓRIA e replicação
* Gerenciamento do uso da memória
* Recursos adicionais

### Quando usar MEMÓRIA ou NDB Cluster

Os desenvolvedores que pretendem implantar aplicativos que utilizam o motor de armazenamento `MEMORY` para dados importantes, altamente disponíveis ou frequentemente atualizados devem considerar se o NDB Cluster é a melhor escolha. Um caso típico de uso para o motor `MEMORY` envolve essas características:

* Operações que envolvem dados transitórios e não críticos, como gerenciamento de sessão ou cache. Quando o servidor MySQL é interrompido ou reiniciado, os dados nas tabelas `MEMORY` são perdidos.

* Armazenamento em memória para acesso rápido e baixa latência. O volume de dados pode caber inteiramente na memória sem causar que o sistema operacional troque páginas de memória virtual.

* Um padrão de acesso a dados apenas de leitura ou quase apenas de leitura (atualizações limitadas).

O NDB Cluster oferece as mesmas funcionalidades do motor `MEMORY`, com níveis de desempenho mais elevados, e fornece funcionalidades adicionais que não estão disponíveis no `MEMORY`:

* Bloqueio em nível de string e operação em múltiplos threads para baixa concorrência entre clientes.

* Escalabilidade mesmo com misturas de declarações que incluem gravações. * Operação opcional com suporte a disco para durabilidade dos dados. * Arquitetura não compartilhada e operação em múltiplos hosts sem um único ponto de falha, permitindo uma disponibilidade de 99,999%.

* Distribuição automática de dados entre os nós; os desenvolvedores de aplicativos não precisam criar soluções personalizadas de fragmentação ou particionamento.

* O suporte para tipos de dados de comprimento variável (incluindo `BLOB` e `TEXT`) não é suportado pelo `MEMORY`.

### Características de desempenho

O desempenho do `MEMORY` é limitado pela concorrência resultante da execução em único thread e pelo custo de bloqueio de tabela ao processar atualizações. Isso limita a escalabilidade quando a carga aumenta, especialmente para misturas de instruções que incluem escritas.

Apesar do processamento em memória para as tabelas `MEMORY`, elas não são necessariamente mais rápidas do que as tabelas `InnoDB` em um servidor ocupado, para consultas de propósito geral ou sob uma carga de trabalho de leitura/escrita. Em particular, o bloqueio de tabela envolvido na realização de atualizações pode atrasar o uso concorrente das tabelas `MEMORY` de várias sessões.

Dependendo dos tipos de consultas realizadas em uma tabela `MEMORY`, você pode criar índices como a estrutura de dados de hash padrão (para procurar valores únicos com base em uma chave única) ou uma estrutura de dados de B-tree de propósito geral (para todos os tipos de consultas que envolvem operadores de igualdade, desigualdade ou intervalo, como menos que ou maior que). As seções a seguir ilustram a sintaxe para criar ambos os tipos de índices. Um problema comum de desempenho é o uso dos índices de hash padrão em cargas de trabalho onde os índices de B-tree são mais eficientes.

### Características das Tabelas de MEMÓRIA

O motor de armazenamento `MEMORY` associa cada tabela a um arquivo de disco, que armazena a definição da tabela (não os dados). O nome do arquivo começa com o nome da tabela e tem uma extensão de `.frm`.

As tabelas `MEMORY` têm as seguintes características:

* O espaço para as tabelas `MEMORY` é alocado em blocos pequenos. As tabelas utilizam hashing dinâmico 100% para inserções. Não é necessário espaço de overflow ou espaço de chave extra. Não é necessário espaço extra para listas livres. As strings excluídas são colocadas em uma lista vinculada e reutilizadas quando você insere novos dados na tabela. As tabelas `MEMORY` também não apresentam nenhum dos problemas comumente associados a excluírem e inserirem em tabelas com hashing.

* As tabelas `MEMORY` utilizam um formato de armazenamento de fila de comprimento fixo. Tipos de comprimento variável, como `VARCHAR`, são armazenados com um comprimento fixo.

* As tabelas `MEMORY` não podem conter as colunas `BLOB` ou `TEXT`.

* `MEMORY` inclui suporte para colunas `AUTO_INCREMENT`.

As tabelas não `TEMPORARY` `MEMORY` são compartilhadas entre todos os clientes, assim como qualquer outra tabela não `TEMPORARY`.

### Operações DDL para tabelas de MEMÓRIA

Para criar uma tabela `MEMORY`, especifique a cláusula `ENGINE=MEMORY` na declaração `CREATE TABLE`.

```sql
CREATE TABLE t (i INT) ENGINE = MEMORY;
```

Como indicado pelo nome do motor, as tabelas `MEMORY` são armazenadas na memória. Elas usam índices de hash por padrão, o que as torna muito rápidas para consultas de valor único e muito úteis para criar tabelas temporárias. No entanto, quando o servidor é desligado, todas as strings armazenadas nas tabelas `MEMORY` são perdidas. As próprias tabelas continuam a existir porque suas definições são armazenadas em arquivos `.frm` no disco, mas elas estão vazias quando o servidor é reiniciado.

Este exemplo mostra como você pode criar, usar e remover uma tabela `MEMORY`:

```sql
mysql> CREATE TABLE test ENGINE=MEMORY
           SELECT ip,SUM(downloads) AS down
           FROM log_table GROUP BY ip;
mysql> SELECT COUNT(ip),AVG(down) FROM test;
mysql> DROP TABLE test;
```

O tamanho máximo das tabelas `MEMORY` é limitado pela variável de sistema `max_heap_table_size`, que tem um valor padrão de 16 MB. Para impor limites de tamanho diferentes para as tabelas `MEMORY`, mude o valor desta variável. O valor em vigor para `CREATE TABLE`, ou para um `ALTER TABLE` ou `TRUNCATE TABLE` subsequente, é o valor usado pelo tempo de vida da tabela. Uma reinicialização do servidor também define o tamanho máximo das tabelas `MEMORY` existentes no valor global [[`max_heap_table_size`]. Você pode definir o tamanho para tabelas individuais conforme descrito mais adiante nesta seção.

### Índices

O motor de armazenamento `MEMORY` suporta tanto os índices `HASH` quanto `BTREE`. Você pode especificar um ou outro para um índice dado, adicionando uma cláusula `USING` como mostrado aqui:

```sql
CREATE TABLE lookup
    (id INT, INDEX USING HASH (id))
    ENGINE = MEMORY;
CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
```

Para características gerais de índices de árvore B e de hash, consulte a Seção 8.3.1, “Como o MySQL usa índices”.

As tabelas `MEMORY` podem ter até 64 índices por tabela, 16 colunas por índice e um comprimento máximo de chave de 3072 bytes.

Se um índice de hash de tabela `MEMORY` tiver um alto grau de duplicação de chaves (muitas entradas de índice contendo o mesmo valor), as atualizações na tabela que afetam os valores das chaves e todas as exclusões são significativamente mais lentas. O grau desse atraso é proporcional ao grau de duplicação (ou, inversamente proporcional à cardinalidade do índice). Você pode usar um índice `BTREE` para evitar esse problema.

As tabelas `MEMORY` podem ter chaves não únicas. (Esse é um recurso incomum para implementações de índices de hash.)

Colunas que estão indexadas podem conter valores `NULL`.

### Tabelas criadas pelo usuário e temporárias

O conteúdo da tabela `MEMORY` é armazenado na memória, uma propriedade que as tabelas `MEMORY` compartilham com as tabelas temporárias internas que o servidor cria automaticamente durante o processamento de consultas. No entanto, os dois tipos de tabelas diferem na medida em que as tabelas `MEMORY` não estão sujeitas à conversão de armazenamento, enquanto as tabelas temporárias internas estão:

* Se uma tabela temporária interna se tornar muito grande, o servidor a converte automaticamente para armazenamento em disco, conforme descrito na Seção 8.4.4, "Uso de tabela temporária interna no MySQL".

* As tabelas `MEMORY` criadas pelo usuário nunca são convertidas em tabelas em disco.

### Carregando dados

Para popule uma tabela `MEMORY` quando o servidor MySQL começa, você pode usar a variável de sistema `init_file`. Por exemplo, você pode colocar declarações como `INSERT INTO ... SELECT`(insert-select.html "13.2.5.1 INSERT ... SELECT Statement") ou `LOAD DATA` em um arquivo para carregar a tabela de uma fonte de dados persistente, e usar `init_file` para nomear o arquivo. Veja a Seção 5.1.7, “Variáveis do sistema do servidor”, e a Seção 13.2.6, “Declaração LOAD DATA”.

### MEMÓRIA Tabelas e Replicação

Quando um servidor de fonte de replicação é desligado e reiniciado, suas tabelas `MEMORY` ficam vazias. Para replicar esse efeito nas réplicas, na primeira vez que a fonte usa uma tabela específica `MEMORY` após a inicialização, ela registra um evento que notifica as réplicas de que a tabela deve ser esvaziada, escrevendo uma declaração `DELETE` ou (a partir do MySQL 5.7.32) `TRUNCATE TABLE` (truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para que a tabela seja escrita no log binário. Quando um servidor de réplica é desligado e reiniciado, suas tabelas `MEMORY` também ficam vazias, e ele escreve uma declaração `DELETE` ou (a partir do MySQL 5.7.32) `TRUNCATE TABLE` em seu próprio log binário, que é passado para quaisquer réplicas subsequentes.

Quando você usa as tabelas `MEMORY` em uma topologia de replicação, em algumas situações, a tabela na fonte e a tabela na replica podem diferir. Para obter informações sobre como lidar com cada uma dessas situações para evitar leituras desatualizadas ou erros, consulte a Seção 16.4.1.20, “Replicação e Tabelas de MEMÓRIA”.

### Gerenciamento do uso da memória

O servidor precisa de memória suficiente para manter todas as tabelas `MEMORY` que estão em uso ao mesmo tempo.

A memória não é recuperada se você excluir strings individuais de uma tabela `MEMORY`. A memória é recuperada apenas quando toda a tabela é excluída. A memória que foi previamente usada para as strings excluídas é reutilizada para novas strings na mesma tabela. Para liberar toda a memória usada por uma tabela `MEMORY` quando você não precisa mais de seu conteúdo, execute `DELETE` ou `TRUNCATE TABLE` para remover todas as strings, ou exclua a tabela como um todo usando [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"). Para liberar a memória usada por strings excluídas, use `ALTER TABLE ENGINE=MEMORY` para forçar a reconstrução de uma tabela.

A memória necessária para uma string em uma tabela `MEMORY` é calculada usando a seguinte expressão:

```sql
SUM_OVER_ALL_BTREE_KEYS(max_length_of_key + sizeof(char*) * 4)
+ SUM_OVER_ALL_HASH_KEYS(sizeof(char*) * 2)
+ ALIGN(length_of_row+1, sizeof(char*))
```

`ALIGN()` representa um fator de agregação para fazer com que o comprimento da string seja um múltiplo exato do tamanho do ponteiro `char`. `sizeof(char*)` é 4 em máquinas de 32 bits e 8 em máquinas de 64 bits.

Como mencionado anteriormente, a variável de sistema `max_heap_table_size` define o limite do tamanho máximo das tabelas `MEMORY`. Para controlar o tamanho máximo para tabelas individuais, defina o valor da sessão desta variável antes de criar cada tabela. (Não altere o valor global `max_heap_table_size` a menos que pretenda que o valor seja usado para tabelas `MEMORY` criadas por todos os clientes.) O exemplo a seguir cria duas tabelas `MEMORY`, com um tamanho máximo de 1 MB e 2 MB, respectivamente:

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

Ambas as tabelas retornam ao valor global `max_heap_table_size` do servidor se o servidor for reiniciado.

Você também pode especificar uma opção de tabela `MAX_ROWS` em declarações `CREATE TABLE` para tabelas `MEMORY` para fornecer uma dica sobre o número de strings que você planeja armazenar nelas. Isso não permite que a tabela cresça além do valor `max_heap_table_size`, que ainda atua como uma restrição sobre o tamanho máximo da tabela. Para máxima flexibilidade na capacidade de usar `MAX_ROWS`, defina `max_heap_table_size` pelo menos tão alto quanto o valor ao qual cada tabela `MEMORY` deve ser capaz de crescer.

### Recursos adicionais

Um fórum dedicado ao motor de armazenamento `MEMORY` está disponível em <https://forums.mysql.com/list.php?92>.