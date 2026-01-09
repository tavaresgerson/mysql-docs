## 15.3 O Motor de Armazenamento de MEMÓRIA

O mecanismo de armazenamento `MEMORY` (anteriormente conhecido como `HEAP`) cria tabelas de propósito especial com conteúdos armazenados na memória. Como os dados são vulneráveis a falhas, problemas de hardware ou interrupções de energia, use essas tabelas apenas como áreas de trabalho temporárias ou caches de leitura apenas para dados extraídos de outras tabelas.

**Tabela 15.4 Características do Motor de Armazenamento de MEMÓRIA**

<table frame="box" rules="all" summary="Recursos suportados pelo motor de armazenamento MEMORY."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Índices de árvores B</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Backup/recuperação em ponto no tempo</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados comprimidos</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de dados</strong></span></td> <td>N/A</td> </tr><tr><td><span><strong>Dados criptografados</strong></span></td> <td>Sim (implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span><strong>Suporte para chave estrangeira</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices de pesquisa de texto completo</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte ao tipo de dados geográficos</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte de indexação geospacial</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices de hash</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Caches de índice</strong></span></td> <td>N/A</td> </tr><tr><td><span><strong>Granularidade de bloqueio</strong></span></td> <td>Tabela</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte à replicação</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Limita (veja a discussão mais adiante nesta seção.)</td> </tr><tr><td><span><strong>Limites de armazenamento</strong></span></td> <td>RAM</td> </tr><tr><td><span><strong>Índices de T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Atualizar estatísticas para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

- Quando usar MEMÓRIA ou NDB Cluster
- Características de desempenho
- Características das Tabelas de MEMÓRIA
- Operações DDL para tabelas de MEMÓRIA
- Índices
- Tabelas criadas pelo usuário e temporárias
- Carregando dados
- MEMÓRIA Tabelas e Replicação
- Gerenciamento do uso da memória
- Recursos adicionais

### Quando usar MEMÓRIA ou NDB Cluster

Os desenvolvedores que pretendem implantar aplicações que utilizam o motor de armazenamento `MEMORY` para dados importantes, altamente disponíveis ou frequentemente atualizados devem considerar se o NDB Cluster é uma escolha melhor. Um caso de uso típico do motor `MEMORY` envolve essas características:

- Operações que envolvem dados transitórios e não críticos, como gerenciamento de sessões ou cache. Quando o servidor MySQL é interrompido ou reiniciado, os dados nas tabelas `MEMORY` são perdidos.

- Armazenamento em memória para acesso rápido e baixa latência. O volume de dados pode caber inteiramente na memória sem que o sistema operacional precise trocar páginas de memória virtual.

- Um padrão de acesso a dados apenas de leitura ou quase apenas de leitura (atualizações limitadas).

O NDB Cluster oferece as mesmas funcionalidades do motor `MEMORY`, com níveis de desempenho mais elevados, e fornece funcionalidades adicionais que não estão disponíveis com o `MEMORY`:

- Bloqueio em nível de linha e operação em múltiplos threads para baixa concorrência entre os clientes.

- Escalabilidade mesmo com misturas de declarações que incluem gravações.

- Operação com disco como suporte opcional para a durabilidade dos dados.

- Arquitetura sem compartilhamento de nada e operação em múltiplos hosts, sem um único ponto de falha, permitindo uma disponibilidade de 99,999%.

- Distribuição automática de dados entre os nós; os desenvolvedores de aplicativos não precisam criar soluções personalizadas de fragmentação ou particionamento.

- O suporte para tipos de dados de comprimento variável (incluindo `BLOB` e `TEXT`) não é suportado pelo `MEMORY`.

### Características de desempenho

O desempenho da função `MEMORY` é limitado pela concorrência decorrente da execução em um único fio e pelo overhead de bloqueio de tabelas ao processar atualizações. Isso limita a escalabilidade quando a carga aumenta, especialmente para misturas de instruções que incluem escritas.

Apesar do processamento em memória para as tabelas `MEMORY`, elas não são necessariamente mais rápidas que as tabelas `InnoDB` em um servidor ocupado, para consultas de uso geral, ou sob uma carga de trabalho de leitura/escrita. Em particular, o bloqueio da tabela envolvido na realização de atualizações pode atrasar o uso concorrente das tabelas `MEMORY` por várias sessões.

Dependendo do tipo de consulta realizada em uma tabela `MEMORY`, você pode criar índices como a estrutura de dados hash padrão (para procurar valores únicos com base em uma chave única) ou uma estrutura de dados B-tree de propósito geral (para todos os tipos de consultas que envolvem operadores de igualdade, desigualdade ou intervalo, como menor que ou maior que). As seções a seguir ilustram a sintaxe para criar ambos os tipos de índices. Um problema comum de desempenho é o uso dos índices hash padrão em cargas de trabalho onde os índices B-tree são mais eficientes.

### Características das Tabelas de MEMÓRIA

O mecanismo de armazenamento `MEMORY` associa cada tabela a um arquivo de disco, que armazena a definição da tabela (não os dados). O nome do arquivo começa com o nome da tabela e tem a extensão `.frm`.

As tabelas `MEMÓRIA` têm as seguintes características:

- O espaço para as tabelas `MEMORY` é alocado em blocos pequenos. As tabelas usam hashing dinâmico de 100% para inserções. Não é necessário uma área de overflow ou espaço de chave extra. Não é necessário espaço extra para listas livres. As linhas excluídas são colocadas em uma lista encadeada e são reutilizadas quando você insere novos dados na tabela. As tabelas `MEMORY` também não apresentam nenhum dos problemas comumente associados a exclusões mais inserções em tabelas hash.

- As tabelas `MEMORY` usam um formato de armazenamento de linhas de comprimento fixo. Tipos de comprimento variável, como `VARCHAR`, são armazenados com um comprimento fixo.

- As tabelas `MEMORY` não podem conter colunas `BLOB` ou `TEXT`.

- `MEMORY` inclui suporte para colunas `AUTO_INCREMENT`.

- As tabelas que não são `TEMPORARY` são compartilhadas entre todos os clientes, assim como qualquer outra tabela que não seja `TEMPORARY`.

### Operações DDL para tabelas de MEMÓRIA

Para criar uma tabela `MEMORY`, especifique a cláusula `ENGINE=MEMORY` na instrução `CREATE TABLE`.

```sql
CREATE TABLE t (i INT) ENGINE = MEMORY;
```

Como indicado pelo nome do motor, as tabelas `MEMORY` são armazenadas na memória. Elas usam índices hash por padrão, o que as torna muito rápidas para consultas de um único valor e muito úteis para criar tabelas temporárias. No entanto, quando o servidor é desligado, todas as linhas armazenadas nas tabelas `MEMORY` são perdidas. As tabelas em si continuam a existir porque suas definições são armazenadas em arquivos `.frm` no disco, mas elas estão vazias quando o servidor é reiniciado.

Este exemplo mostra como você pode criar, usar e remover uma tabela `MEMORY`:

```sql
mysql> CREATE TABLE test ENGINE=MEMORY
           SELECT ip,SUM(downloads) AS down
           FROM log_table GROUP BY ip;
mysql> SELECT COUNT(ip),AVG(down) FROM test;
mysql> DROP TABLE test;
```

O tamanho máximo das tabelas `MEMORY` é limitado pela variável de sistema `max_heap_table_size`, que tem um valor padrão de 16 MB. Para impor limites de tamanho diferentes para as tabelas `MEMORY`, altere o valor dessa variável. O valor em vigor para `CREATE TABLE`, ou para uma `ALTER TABLE` ou `TRUNCATE TABLE` subsequente, é o valor usado durante a vida da tabela. Uma reinicialização do servidor também define o tamanho máximo das tabelas `MEMORY` para o valor global `max_heap_table_size`. Você pode definir o tamanho para tabelas individuais conforme descrito mais adiante nesta seção.

### Índices

O mecanismo de armazenamento `MEMORY` suporta tanto os índices `HASH` quanto `BTREE`. Você pode especificar um ou outro para um índice dado, adicionando uma cláusula `USING`, conforme mostrado aqui:

```sql
CREATE TABLE lookup
    (id INT, INDEX USING HASH (id))
    ENGINE = MEMORY;
CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
```

Para características gerais de índices B-tree e hash, consulte a Seção 8.3.1, “Como o MySQL usa índices”.

As tabelas `MEMORY` podem ter até 64 índices por tabela, 16 colunas por índice e um comprimento máximo de chave de 3072 bytes.

Se um índice de hash da tabela `MEMORY` tiver um alto grau de duplicação de chaves (muitas entradas do índice contendo o mesmo valor), as atualizações na tabela que afetam os valores das chaves e todas as exclusões são significativamente mais lentas. O grau desse retardo é proporcional ao grau de duplicação (ou, inversamente proporcional à cardinalidade do índice). Você pode usar um índice `BTREE` para evitar esse problema.

As tabelas `MEMORY` podem ter chaves não únicas. (Esse é um recurso incomum para implementações de índices de hash.)

Colunas que estão indexadas podem conter valores `NULL`.

### Tabelas criadas pelo usuário e temporárias

O conteúdo da tabela `MEMORY` é armazenado na memória, que é uma propriedade que as tabelas `MEMORY` compartilham com as tabelas temporárias internas que o servidor cria conforme o processamento das consultas. No entanto, os dois tipos de tabelas diferem na medida em que as tabelas `MEMORY` não estão sujeitas à conversão de armazenamento, enquanto as tabelas temporárias internas estão:

- Se uma tabela temporária interna ficar muito grande, o servidor a converte automaticamente para armazenamento em disco, conforme descrito na Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- As tabelas `MEMORY` criadas pelo usuário nunca são convertidas em tabelas de disco.

### Carregando dados

Para povoar uma tabela `MEMORY` quando o servidor MySQL for iniciado, você pode usar a variável de sistema `init_file`. Por exemplo, você pode colocar instruções como `INSERT INTO ... SELECT` ou `LOAD DATA` em um arquivo para carregar a tabela de uma fonte de dados persistente e usar `init_file` para nomear o arquivo. Veja a Seção 5.1.7, “Variáveis de Sistema do Servidor”, e a Seção 13.2.6, “Instrução LOAD DATA”.

### MEMÓRIA Tabelas e Replicação

Quando um servidor de origem de replicação é desligado e reiniciado, suas tabelas `MEMORY` ficam vazias. Para replicar esse efeito nas réplicas, na primeira vez que a fonte usar uma tabela `MEMORY` específica após a inicialização, ela registra um evento que notifica as réplicas de que a tabela deve ser esvaziada, escrevendo uma instrução `DELETE` ou (a partir do MySQL 5.7.32) `TRUNCATE TABLE` para que a tabela seja escrita no log binário. Quando um servidor de réplica é desligado e reiniciado, suas tabelas `MEMORY` também ficam vazias, e ele escreve uma instrução `DELETE` ou (a partir do MySQL 5.7.32) `TRUNCATE TABLE` em seu próprio log binário, que é passado para quaisquer réplicas subsequentes.

Quando você usa tabelas `MEMORY` em uma topologia de replicação, em algumas situações, a tabela na fonte e a tabela na replica podem diferir. Para obter informações sobre como lidar com cada uma dessas situações para evitar leituras desatualizadas ou erros, consulte a Seção 16.4.1.20, “Replicação e Tabelas MEMORY”.

### Gerenciamento do uso da memória

O servidor precisa de memória suficiente para manter todas as tabelas `MEMORY` que estão em uso ao mesmo tempo.

A memória não é recuperada se você excluir linhas individuais de uma tabela `MEMORY`. A memória é recuperada apenas quando toda a tabela é excluída. A memória que foi anteriormente usada para as linhas excluídas é reutilizada para novas linhas na mesma tabela. Para liberar toda a memória usada por uma tabela `MEMORY` quando você não precisar mais de seu conteúdo, execute `DELETE` ou `TRUNCATE TABLE` para remover todas as linhas, ou remova a tabela completamente usando `DROP TABLE`. Para liberar a memória usada por linhas excluídas, use `ALTER TABLE ENGINE=MEMORY` para forçar a reconstrução da tabela.

A memória necessária para uma linha em uma tabela `MEMORY` é calculada usando a seguinte expressão:

```sql
SUM_OVER_ALL_BTREE_KEYS(max_length_of_key + sizeof(char*) * 4)
+ SUM_OVER_ALL_HASH_KEYS(sizeof(char*) * 2)
+ ALIGN(length_of_row+1, sizeof(char*))
```

`ALIGN()` representa um fator de arredondamento para garantir que o comprimento da linha seja um múltiplo exato do tamanho do ponteiro `char`. `sizeof(char*)` é 4 em máquinas de 32 bits e 8 em máquinas de 64 bits.

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

Você também pode especificar uma opção de tabela `MAX_ROWS` nas instruções `CREATE TABLE` para tabelas `MEMORY` para fornecer uma dica sobre o número de linhas que você planeja armazenar nelas. Isso não permite que a tabela cresça além do valor `max_heap_table_size`, que ainda atua como uma restrição sobre o tamanho máximo da tabela. Para obter a máxima flexibilidade para usar `MAX_ROWS`, defina `max_heap_table_size` pelo menos tão alto quanto o valor para o qual você deseja que cada tabela `MEMORY` possa crescer.

### Recursos adicionais

Um fórum dedicado ao motor de armazenamento `MEMORY` está disponível em <https://forums.mysql.com/list.php?92>.
