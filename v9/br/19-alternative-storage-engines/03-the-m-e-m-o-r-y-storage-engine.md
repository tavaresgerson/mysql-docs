## 18.3 O Motor de Armazenamento MEMÓRIA

O motor de armazenamento `MEMÓRIA` (anteriormente conhecido como `HEAP`) cria tabelas de propósito especial com conteúdos armazenados na memória. Como os dados são vulneráveis a falhas, problemas de hardware ou quedas de energia, use essas tabelas apenas como áreas de trabalho temporárias ou caches de leitura apenas para dados extraídos de outras tabelas.

**Tabela 18.4 Características do Motor de Armazenamento MEMÓRIA**

<table frame="box" rules="all" summary="Recursos suportados pelo mecanismo de armazenamento MEMORY."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span class="bold"><strong>Indekses B-tree</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Recuperação de ponto no tempo</strong></span> (Implementado no servidor, e não no mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Indekses agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Dados comprimidos</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Caches de dados</strong></span></td> <td>N/A</td> </tr><tr><td><span class="bold"><strong>Dados criptografados</strong></span></td> <td>Sim (Implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span class="bold"><strong>Suporte a chaves estrangeiras</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Indekses de busca full-text</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Tipo de dados geográficos</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Suporte a indexação geográficos</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Indekses de hash</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Caches de índice</strong></span></td> <td>N/A</td> </tr><tr><td><span class="bold"><strong>Granularidade de bloqueio</strong></span></td> <td>Tabela</td> </tr><tr><td><span class="bold"><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Suporte a replicação</strong></span> (Implementado no servidor, e não no mecanismo de armazenamento.)</td> <td>Limitado (Veja a discussão mais adiante nesta seção.)</td> </tr><tr><td><span class="bold"><strong>Limites de armazenamento</strong></span></td> <td>RAM</td> </tr><tr><td><span class="bold"><strong>Indekses T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Estatísticas de atualização para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

* Quando usar MEMÓRIA ou NDB Cluster
* Partição
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

Desenvolvedores que desejam implantar aplicações que utilizam o mecanismo de armazenamento `MEMORY` para dados importantes, altamente disponíveis ou frequentemente atualizados devem considerar se o NDB Cluster é uma escolha melhor. Um caso de uso típico para o motor `MEMORY` envolve essas características:

* Operações que envolvem dados transitórios e não críticos, como gerenciamento de sessões ou cache. Quando o servidor MySQL pára ou reinicia, os dados nas tabelas de `MEMORY` são perdidos.

* Armazenamento em memória para acesso rápido e baixa latência. O volume de dados pode caber inteiramente na memória sem causar o swap de páginas de memória virtual pelo sistema operacional.

* Modelo de acesso a dados de leitura apenas ou quase exclusiva (atualizações limitadas).

O NDB Cluster oferece as mesmas funcionalidades do motor `MEMORY` com níveis de desempenho mais altos e fornece recursos adicionais não disponíveis com `MEMORY`:

* Bloqueio em nível de linha e operação em múltiplos threads para baixa concorrência entre clientes.

* Escalabilidade mesmo com misturas de instruções que incluem escritas.
* Operação com suporte opcional a disco para durabilidade dos dados.
* Arquitetura shared-nothing e operação em múltiplos hosts sem um único ponto de falha, possibilitando uma disponibilidade de 99,999%.

* Distribuição automática de dados entre nós; os desenvolvedores de aplicativos não precisam criar soluções personalizadas de particionamento ou divisão.

* Suporte para tipos de dados de comprimento variável (incluindo `BLOB` e `TEXT`) que não são suportados por `MEMORY`.

### Partição

As tabelas de `MEMORY` não podem ser particionadas.

### Características de desempenho

O desempenho da `MEMORY` é limitado pela concorrência resultante da execução em um único fio e pelo overhead do bloqueio de tabelas ao processar atualizações. Isso limita a escalabilidade quando a carga aumenta, especialmente para misturas de instruções que incluem escritas.

Apesar do processamento em memória para tabelas `MEMORY`, elas não são necessariamente mais rápidas que as tabelas `InnoDB` em um servidor ocupado, para consultas de propósito geral, ou sob uma carga de trabalho de leitura/escrita. Em particular, o bloqueio de tabelas envolvido na realização de atualizações pode atrasar o uso concorrente de tabelas `MEMORY` por várias sessões.

Dependendo do tipo de consulta realizada em uma tabela `MEMORY`, você pode criar índices como a estrutura de dados hash padrão (para procurar valores únicos com base em uma chave única) ou uma estrutura de dados B-tree de propósito geral (para todas as consultas que envolvem operadores de igualdade, desigualdade ou intervalo, como menor que ou maior que). As seções seguintes ilustram a sintaxe para criar ambos os tipos de índices. Um problema comum de desempenho é o uso dos índices hash padrão em cargas de trabalho onde os índices B-tree são mais eficientes.

### Características das Tabelas MEMORY

O mecanismo de armazenamento `MEMORY` não cria nenhum arquivo no disco. A definição da tabela é armazenada no dicionário de dados do MySQL.

As tabelas `MEMORY` têm as seguintes características:

* O espaço para tabelas `MEMORY` é alocado em blocos pequenos. As tabelas usam hashing dinâmico 100% para inserções. Não é necessário área de overflow ou espaço de chave extra. Não é necessário espaço extra para listas livres. As linhas excluídas são colocadas em uma lista encadeada e reutilizadas quando você insere novos dados na tabela. As tabelas `MEMORY` também não têm nenhum dos problemas comumente associados a exclusões mais inserções em tabelas hash.

* As tabelas `MEMORY` usam um formato de armazenamento de linha de comprimento fixo. Tipos de comprimento variável, como `VARCHAR`, são armazenados com um comprimento fixo.

* As tabelas `MEMORY` não podem conter colunas `BLOB` ou `TEXT`.

* `MEMORY` inclui suporte para colunas `AUTO_INCREMENT`.

* As tabelas `MEMORY` não `TEMPORARY` são compartilhadas entre todos os clientes, assim como qualquer outra tabela não `TEMPORARY`.

### Operações DDL para Tabelas `MEMORY`

Para criar uma tabela `MEMORY`, especifique a cláusula `ENGINE=MEMORY` na instrução `CREATE TABLE`.

```
CREATE TABLE t (i INT) ENGINE = MEMORY;
```

Como indicado pelo nome do motor, as tabelas `MEMORY` são armazenadas na memória. Elas usam índices hash por padrão, o que as torna muito rápidas para consultas de valor único, e muito úteis para criar tabelas temporárias. No entanto, quando o servidor é desligado, todas as linhas armazenadas nas tabelas `MEMORY` são perdidas. As tabelas mesmas continuam a existir porque suas definições são armazenadas no dicionário de dados do MySQL, mas estão vazias quando o servidor é reiniciado.

Este exemplo mostra como você pode criar, usar e remover uma tabela `MEMORY`:

```
mysql> CREATE TABLE test ENGINE=MEMORY
           SELECT ip,SUM(downloads) AS down
           FROM log_table GROUP BY ip;

mysql> SELECT COUNT(ip),AVG(down) FROM test;

mysql> DROP TABLE test;
```

O tamanho máximo das tabelas `MEMORY` é limitado pela variável de sistema `max_heap_table_size`, que tem um valor padrão de 16MB. Para impor limites de tamanho diferentes para as tabelas `MEMORY`, mude o valor dessa variável. O valor em vigor para `CREATE TABLE`, ou uma subsequente `ALTER TABLE` ou `TRUNCATE TABLE`, é o valor usado durante a vida da tabela. Um reinício do servidor também define o tamanho máximo das tabelas `MEMORY` para o valor global `max_heap_table_size`. Você pode definir o tamanho para tabelas individuais conforme descrito mais adiante nesta seção.

### Índices

O motor de armazenamento `MEMORY` suporta tanto índices `HASH` quanto `BTREE`. Você pode especificar um ou outro para um índice dado adicionando uma cláusula `USING` como mostrado aqui:

```
CREATE TABLE lookup
    (id INT, INDEX USING HASH (id))
    ENGINE = MEMORY;
CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
```

Para características gerais de índices de árvore B e hash, consulte a Seção 10.3.1, “Como o MySQL Usa Índices”.

As tabelas `MEMORY` podem ter até 64 índices por tabela, 16 colunas por índice e um comprimento máximo de chave de 3072 bytes.

Se um índice hash de tabela `MEMORY` tiver um alto grau de duplicação de chaves (muitas entradas de índice contendo o mesmo valor), as atualizações na tabela que afetam os valores das chaves e todas as exclusões são significativamente mais lentas. O grau dessa redução de desempenho é proporcional ao grau de duplicação (ou, inversamente proporcional à cardinalidade do índice). Você pode usar um índice `BTREE` para evitar esse problema.

As tabelas `MEMORY` podem ter chaves não únicas. (Essa é uma característica incomum para implementações de índices hash.)

Colunas indexadas podem conter valores `NULL`.

### Tabelas Criadas pelo Usuário e Temporárias

O conteúdo das tabelas `MEMORY` é armazenado na memória, o que é uma propriedade que as tabelas `MEMORY` compartilham com tabelas temporárias internas que o servidor cria instantaneamente enquanto processa consultas. No entanto, os dois tipos de tabelas diferem na medida em que as tabelas `MEMORY` não estão sujeitas à conversão de armazenamento, enquanto as tabelas temporárias internas estão:

* Se uma tabela temporária interna ficar muito grande, o servidor a converte automaticamente para armazenamento em disco, conforme descrito na Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

* As tabelas `MEMORY` criadas pelo usuário nunca são convertidas em tabelas de disco.

### Carregamento de Dados

Para popolar uma tabela `MEMORY` quando o servidor MySQL iniciar, você pode usar a variável de sistema `init_file`. Por exemplo, você pode colocar instruções como `INSERT INTO ... SELECT` ou `LOAD DATA` em um arquivo para carregar a tabela de uma fonte de dados persistente e usar `init_file` para nomear o arquivo. Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”, e a Seção 15.2.9, “Instrução LOAD DATA”.

### Tabelas de MEMÓRIA e Replicação

Quando um servidor de origem de replicação é desligado e reiniciado, suas tabelas de `MEMÓRIA` ficam vazias. Para replicar esse efeito nas réplicas, na primeira vez que a fonte usar uma tabela de `MEMÓRIA` específica após a inicialização, ela registra um evento que notifica as réplicas de que a tabela deve ser esvaziada, escrevendo uma instrução `TRUNCATE TABLE` para essa tabela no log binário. Quando um servidor de réplica é desligado e reiniciado, suas tabelas de `MEMÓRIA` também ficam vazias, e ele escreve uma instrução `TRUNCATE TABLE` em seu próprio log binário, que é passado para quaisquer réplicas subsequentes.

Quando você usa tabelas de `MEMÓRIA` em uma topologia de replicação, em algumas situações, a tabela na fonte e a tabela na réplica podem diferir. Para obter informações sobre como lidar com cada uma dessas situações para evitar leituras desatualizadas ou erros, consulte a Seção 19.5.1.22, “Replicação e Tabelas de MEMÓRIA”.

### Gerenciamento do Uso da Memória

O servidor precisa de memória suficiente para manter todas as tabelas de `MEMÓRIA` que estão em uso ao mesmo tempo.

A memória não é recuperada se você excluir linhas individuais de uma tabela de `MEMÓRIA`. A memória é recuperada apenas quando toda a tabela é excluída. A memória que foi previamente usada para linhas excluídas é reutilizada para novas linhas dentro da mesma tabela. Para liberar toda a memória usada por uma tabela de `MEMÓRIA` quando você não precisar mais de seu conteúdo, execute `DELETE` ou `TRUNCATE TABLE` para remover todas as linhas, ou remova a tabela completamente usando `DROP TABLE`. Para liberar a memória usada por linhas excluídas, use `ALTER TABLE ENGINE=MEMORY` para forçar a reconstrução da tabela.

A memória necessária para uma linha em uma tabela de `MEMÓRIA` é calculada usando a seguinte expressão:

```
SUM_OVER_ALL_BTREE_KEYS(max_length_of_key + sizeof(char*) * 4)
+ SUM_OVER_ALL_HASH_KEYS(sizeof(char*) * 2)
+ ALIGN(length_of_row+1, sizeof(char*))
```

`ALIGN()` representa um fator de arredondamento para fazer com que o comprimento da linha seja um múltiplo exato do tamanho do ponteiro `char`. `sizeof(char*)` é 4 em máquinas de 32 bits e 8 em máquinas de 64 bits.

Como mencionado anteriormente, a variável de sistema `max_heap_table_size` define o limite do tamanho máximo das tabelas `MEMORY`. Para controlar o tamanho máximo para tabelas individuais, defina o valor da sessão desta variável antes de criar cada tabela. (Não altere o valor global `max_heap_table_size` a menos que pretenda que o valor seja usado para tabelas `MEMORY` criadas por todos os clientes.) O exemplo a seguir cria duas tabelas `MEMORY`, com um tamanho máximo de 1 MB e 2 MB, respectivamente:

```
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

Você também pode especificar uma opção de tabela `MAX_ROWS` nas instruções `CREATE TABLE` para tabelas `MEMORY` para fornecer uma dica sobre o número de linhas que você planeja armazenar nelas. Isso não permite que a tabela cresça além do valor `max_heap_table_size`, que ainda atua como uma restrição sobre o tamanho máximo da tabela. Para máxima flexibilidade na utilização de `MAX_ROWS`, defina `max_heap_table_size` pelo menos tão alto quanto o valor para o qual cada tabela `MEMORY` deve ser capaz de crescer.

### Recursos Adicionais

Um fórum dedicado ao mecanismo de armazenamento `MEMORY` está disponível em <https://forums.mysql.com/list.php?92>.