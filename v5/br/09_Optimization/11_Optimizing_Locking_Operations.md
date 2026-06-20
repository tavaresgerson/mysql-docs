## 8.11 Otimizando operações de bloqueio

O MySQL gerencia a disputa pelo conteúdo da tabela usando bloqueio:

* O bloqueio interno é realizado dentro do próprio servidor MySQL para gerenciar a disputa por conteúdo de tabela por vários threads. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Veja a Seção 8.11.1, “Métodos de bloqueio interno”.

* O bloqueio externo ocorre quando o servidor e outros programas bloqueiam os arquivos da tabela `MyISAM` para coordenar entre si qual programa pode acessar as tabelas em que momento. Veja a Seção 8.11.5, “Bloqueio Externo”.

### 8.11.1 Métodos de bloqueio interno

Esta seção discute o bloqueio interno; ou seja, o bloqueio realizado dentro do próprio servidor MySQL para gerenciar a concorrência por conteúdo de tabela por várias sessões. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Para o bloqueio realizado em arquivos MySQL por outros programas, consulte a Seção 8.11.5, “Bloqueio Externo”.

* Fechamento de nível de string
* Fechamento de nível de tabela
* Escolhendo o tipo de fechamento

#### Bloqueio de Nível de String

O MySQL utiliza o bloqueio em nível de string para as tabelas `InnoDB` para suportar acesso de escrita simultâneo por múltiplas sessões, tornando-as adequadas para aplicações multiusuário, altamente concorrentes e OLTP.

Para evitar bloqueios quando realiza várias operações de escrita concorrentes em uma única tabela `InnoDB`, adquira as chaves necessárias no início da transação, emitindo uma declaração `SELECT ... FOR UPDATE` para cada grupo de strings que espera ser modificado, mesmo que as declarações de alteração de dados venham mais tarde na transação. Se as transações modificam ou bloqueiam mais de uma tabela, emita as declarações aplicáveis na mesma ordem dentro de cada transação. Os bloqueios afetam o desempenho e não representam um erro grave, porque `InnoDB` detecta automaticamente as condições de bloqueio e desfaz uma das transações afetadas.

Em sistemas de alta concorrência, a detecção de bloqueio pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de bloqueio e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um bloqueio. A detecção de bloqueio pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

Vantagens do bloqueio em nível de string:

* Menos conflitos de bloqueio quando diferentes sessões acessam diferentes strings.

* Menos mudanças para rollbacks. * Possível bloquear uma única string por um longo período de tempo.

#### Bloqueio em nível de tabela

O MySQL utiliza o bloqueio de nível de tabela para as tabelas `MyISAM`, `MEMORY` e `MERGE`, permitindo que apenas uma sessão atualize essas tabelas de cada vez. Esse nível de bloqueio torna esses motores de armazenamento mais adequados para aplicações de leitura apenas, leitura na maioria dos casos ou de um único usuário.

Esses motores de armazenamento evitam deadlocks ao solicitar sempre todas as chaves necessárias de uma vez no início de uma consulta e sempre bloqueando as tabelas na mesma ordem. O compromisso é que essa estratégia reduz a concorrência; outras sessões que desejam modificar a tabela devem esperar até que o atual comando de alteração de dados termine.

Vantagens do bloqueio em nível de tabela:

* Necessita de uma memória relativamente pequena (o bloqueio de string requer memória por string ou grupo de strings bloqueadas)

* Rápido quando usado em uma grande parte da mesa, pois apenas um único bloqueio é envolvido.

* Rápido se você realiza frequentemente operações `GROUP BY` em uma grande parte dos dados ou precisa digitalizar a tabela inteira com frequência.

MySQL concede bloqueios de escrita de tabela da seguinte forma:

1. Se não houver bloqueios na mesa, coloque um bloqueio de escrita nela.

2. Caso contrário, coloque o pedido de bloqueio na fila de bloqueio de escrita.

MySQL concede bloqueios de leitura de tabela da seguinte forma:

1. Se não houver bloqueios de escrita na tabela, coloque um bloqueio de leitura nela.

2. Caso contrário, coloque o pedido de bloqueio na fila de bloqueio de leitura.

As atualizações de tabela são dadas prioridade mais alta do que os retretiens de tabela. Portanto, quando um bloqueio é liberado, o bloqueio é disponibilizado para os pedidos na fila de bloqueio de escrita e, em seguida, para os pedidos na fila de bloqueio de leitura. Isso garante que as atualizações de uma tabela não sejam "sofridas" mesmo quando há uma atividade `SELECT` pesada para a tabela. No entanto, se houver muitas atualizações para uma tabela, as declarações `SELECT` aguardam até não haver mais atualizações.

Para obter informações sobre a alteração da prioridade de leituras e escritas, consulte a Seção 8.11.2, “Problemas de bloqueio de tabela”.

Você pode analisar a disputa por bloqueio de tabela em seu sistema, verificando as variáveis de status `Table_locks_immediate` e `Table_locks_waited`, que indicam o número de vezes em que solicitações de bloqueio de tabela puderam ser concedidas imediatamente e o número que teve que esperar, respectivamente:

```sql
mysql> SHOW STATUS LIKE 'Table%';
+-----------------------+---------+
| Variable_name         | Value   |
+-----------------------+---------+
| Table_locks_immediate | 1151552 |
| Table_locks_waited    | 15324   |
+-----------------------+---------+
```

As tabelas de bloqueio do Schema de Desempenho também fornecem informações de bloqueio. Veja a Seção 25.12.12, “Tabelas de Bloqueio do Schema de Desempenho”.

O motor de armazenamento `MyISAM` suporta inserções concorrentes para reduzir a concorrência entre leitores e escritores para uma determinada tabela: Se uma tabela `MyISAM` não tiver blocos livres no meio do arquivo de dados, as strings são sempre inseridas no final do arquivo de dados. Nesse caso, você pode misturar livremente as declarações concorrentes `INSERT` e `SELECT` para uma tabela `MyISAM` sem bloqueios. Ou seja, você pode inserir strings em uma tabela `MyISAM` ao mesmo tempo em que outros clientes estão lendo dela. Há possibilidade de haver lacunas devido a strings que foram excluídas ou atualizadas no meio da tabela. Se houver lacunas, as inserções concorrentes são desativadas, mas são ativadas novamente automaticamente quando todos os buracos são preenchidos com novos dados. Para controlar esse comportamento, use a variável de sistema `concurrent_insert`. Veja a Seção 8.11.3, “Inserções Concorrentes”.

Se você adquirir um bloqueio de tabela explicitamente com `LOCK TABLES`, pode solicitar um bloqueio de `READ LOCAL` em vez de um bloqueio de `READ` para permitir que outras sessões realizem inserções concorrentes enquanto você mantém o bloqueio da tabela.

Para realizar muitas operações `INSERT` e `SELECT` em uma tabela `t1`, quando inserções concorrentes não são possíveis, você pode inserir strings em uma tabela temporária `temp_t1` e atualizar a tabela real com as strings da tabela temporária:

```sql
mysql> LOCK TABLES t1 WRITE, temp_t1 WRITE;
mysql> INSERT INTO t1 SELECT * FROM temp_t1;
mysql> DELETE FROM temp_t1;
mysql> UNLOCK TABLES;
```

#### Escolhendo o Tipo de Fechamento

Geralmente, as bloqueadoras de tabela são superiores às bloqueadoras de nível de string nos seguintes casos:

* A maioria das declarações para a tabela são leituras.
* As declarações para a tabela são uma mistura de leituras e escritas, onde as escritas são atualizações ou exclusões para uma única string que podem ser obtidas com uma única leitura de chave:

  ```sql
  UPDATE tbl_name SET column=value WHERE unique_key_col=key_value;
  DELETE FROM tbl_name WHERE unique_key_col=key_value;
  ```

* `SELECT` combinado com declarações simultâneas `INSERT`, e muito poucas declarações `UPDATE` ou `DELETE`.

* Muitas varreduras ou `GROUP BY` de operações em toda a mesa sem nenhum escritor.

Com bloqueios de nível superior, é mais fácil ajustar as aplicações, pois os bloqueios de diferentes tipos são suportados, pois o overhead do bloqueio é menor do que o de bloqueios de nível de string.

Outras opções além do bloqueio de nível de string:

* Versionamento (como o utilizado no MySQL para inserções concorrentes), onde é possível ter um escritor ao mesmo tempo que muitos leitores. Isso significa que o banco de dados ou a tabela suporta diferentes visualizações dos dados dependendo de quando o acesso começa. Outros termos comuns para isso são “viagem no tempo”, “cópia no momento da escrita” ou “cópia sob demanda”.

* A cópia sob demanda é, em muitos casos, superior ao bloqueio de nível de string. No entanto, no pior dos casos, pode consumir muito mais memória do que usar bloqueios normais.

* Em vez de usar bloqueios de nível de string, você pode empregar bloqueios de nível de aplicativo, como os fornecidos por `GET_LOCK()` e `RELEASE_LOCK()` no MySQL. Estes são bloqueios consultivos, portanto, eles funcionam apenas com aplicativos que cooperam entre si. Veja a Seção 12.14, “Funções de bloqueio”.

### 8.11.2 Problemas com o bloqueio de tabelas

As tabelas `InnoDB` utilizam bloqueio a nível de string, de modo que múltiplas sessões e aplicações possam ler e escrever na mesma tabela simultaneamente, sem fazer com que uma espere a outra ou produzir resultados inconsistentes. Para este mecanismo de armazenamento, evite usar a declaração `LOCK TABLES`, porque ela não oferece nenhuma proteção extra, mas, em vez disso, reduz a concorrência. O bloqueio automático a nível de string torna essas tabelas adequadas para seus bancos de dados mais movimentados com seus dados mais importantes, ao mesmo tempo em que simplifica a lógica da aplicação, uma vez que você não precisa bloquear e desbloquear tabelas. Consequentemente, o mecanismo de armazenamento `InnoDB` é o padrão no MySQL.

O MySQL utiliza bloqueio de tabela (em vez de bloqueio de página, string ou coluna) para todos os motores de armazenamento, exceto `InnoDB`. As próprias operações de bloqueio não têm muito sobrecarregamento. Mas, como apenas uma sessão pode escrever em uma tabela de cada vez, para obter o melhor desempenho com esses outros motores de armazenamento, use-os principalmente para tabelas que são consultadas frequentemente e raramente inseridas ou atualizadas.

* Considerações de desempenho que favorecem o InnoDB
* Soluções alternativas para problemas de desempenho relacionados a bloqueio

#### Considerações de desempenho que favorecem o InnoDB

Ao decidir se deve criar uma tabela usando `InnoDB` ou outro mecanismo de armazenamento, lembre-se das seguintes desvantagens do bloqueio de tabela:

* O bloqueio de tabela permite que muitas sessões leiam uma tabela ao mesmo tempo, mas se uma sessão quiser escrever em uma tabela, ela deve obter primeiro acesso exclusivo, o que significa que ela pode ter que esperar para que outras sessões terminem com a tabela primeiro. Durante a atualização, todas as outras sessões que desejam acessar essa tabela específica devem esperar até que a atualização seja concluída.

* O bloqueio de tabela causa problemas quando uma sessão está esperando porque o disco está cheio e o espaço livre precisa se tornar disponível antes que a sessão possa prosseguir. Nesse caso, todas as sessões que desejam acessar a tabela problema também são colocadas em estado de espera até que mais espaço no disco seja disponibilizado.

* Uma declaração `SELECT` que leva muito tempo para ser executada impede que outras sessões atualizem a tabela no mesmo momento, fazendo com que as outras sessões pareçam lentas ou não responsivas. Enquanto uma sessão está esperando para obter acesso exclusivo à tabela para atualizações, outras sessões que emitem declarações `SELECT` ficam em fila atrás dela, reduzindo a concorrência mesmo para sessões de leitura somente.

#### Soluções alternativas para problemas de desempenho de bloqueio

Os itens a seguir descrevem algumas maneiras de evitar ou reduzir a contenção causada pelo bloqueio de tabelas:

* Considere a possibilidade de mudar a tabela para o mecanismo de armazenamento `InnoDB`, usando `CREATE TABLE ... ENGINE=INNODB` durante a configuração, ou usando `ALTER TABLE ... ENGINE=INNODB` para uma tabela existente. Consulte o Capítulo 14, *O Mecanismo de Armazenamento InnoDB*, para mais detalhes sobre este mecanismo de armazenamento.

* Otimize as declarações `SELECT` para que elas funcionem mais rápido, de modo que elas bloqueiem as tabelas por um período de tempo mais curto. Você pode precisar criar algumas tabelas resumidas para fazer isso.

Inicie `mysqld` com `--low-priority-updates`. Para motores de armazenamento que utilizam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`, isso dá a todas as declarações que atualizam (modificam) uma tabela uma prioridade menor do que as declarações de `SELECT`. Neste caso, a segunda declaração de `SELECT` no cenário anterior seria executada antes da declaração de `UPDATE`, e não aguardaria o término do primeiro `SELECT`.

* Para especificar que todas as atualizações emitidas em uma conexão específica devem ser feitas com baixa prioridade, defina a variável de sistema do servidor `low_priority_updates` igual a 1.

Para dar uma declaração específica de `INSERT`, `UPDATE` ou `DELETE` menor prioridade, use o atributo `LOW_PRIORITY`.

* Para dar prioridade a uma declaração específica do `SELECT`, use o atributo `HIGH_PRIORITY`. Veja a Seção 13.2.9, “Instrução SELECT”.

* Inicie `mysqld` com um valor baixo para a variável de sistema `max_write_lock_count` para forçar o MySQL a elevar temporariamente a prioridade de todas as instruções `SELECT` que estão esperando por uma tabela após um número específico de bloqueios de escrita na tabela ocorrer (por exemplo, para operações de inserção). Isso permite bloqueios de leitura após um certo número de bloqueios de escrita.

* Se você tiver problemas com declarações mistas de `SELECT` e `DELETE`, a opção `LIMIT` para `DELETE` pode ajudar. Veja a Seção 13.2.2, “Declaração DELETE”.

* O uso de `SQL_BUFFER_RESULT` com declarações `SELECT` pode ajudar a tornar a duração dos bloqueios de tabela mais curta. Veja a Seção 13.2.9, “Declaração SELECT”.

* Dividir o conteúdo da tabela em tabelas separadas pode ajudar, permitindo que consultas sejam executadas contra colunas de uma tabela, enquanto as atualizações são confinadas a colunas de uma tabela diferente.

* Você poderia alterar o código de bloqueio em `mysys/thr_lock.c` para usar uma única fila. Nesse caso, as chaves de bloqueio e as chaves de leitura teriam a mesma prioridade, o que pode ajudar algumas aplicações.

### 8.11.3 Inserções Concorrentes

O motor de armazenamento `MyISAM` suporta inserções concorrentes para reduzir a concorrência entre leitores e escritores para uma determinada tabela: Se uma tabela `MyISAM` não tiver buracos no arquivo de dados (strings excluídas no meio), uma declaração `INSERT` pode ser executada para adicionar strings à extremidade da tabela ao mesmo tempo em que as declarações `SELECT` estão lendo strings da tabela. Se houver várias declarações `INSERT`, elas são colocadas em fila e executadas sequencialmente, concorrentemente com as declarações `SELECT`. Os resultados de uma `INSERT` concorrente podem não ser visíveis imediatamente.

A variável de sistema `concurrent_insert` pode ser definida para modificar o processamento de inserção concorrente. Por padrão, a variável é definida como `AUTO` (ou 1) e as inserções concorrentes são tratadas como descrito acima. Se `concurrent_insert` for definido como `NEVER` (ou 0), as inserções concorrentes são desativadas. Se a variável for definida como `ALWAYS` (ou 2), as inserções concorrentes no final da tabela são permitidas mesmo para tabelas que possuem strings excluídas. Veja também a descrição da variável de sistema `concurrent_insert`.

Se você estiver usando o log binário, as inserções concorrentes são convertidas em inserções normais para as declarações `CREATE ... SELECT` ou `INSERT ... SELECT`. Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas, aplicando o log durante uma operação de backup. Veja a Seção 5.4.4, “O Log Binário”. Além disso, para essas declarações, uma restrição de leitura é colocada na tabela selecionada de modo que as inserções nessa tabela sejam bloqueadas. O efeito é que as inserções concorrentes para essa tabela também devem esperar.

Com `LOAD DATA`, se você especificar `CONCURRENT` com uma tabela `MyISAM` que satisfaça a condição para inserções concorrentes (ou seja, que não contenha blocos livres no meio), outras sessões podem recuperar dados da tabela enquanto `LOAD DATA` está sendo executado. O uso da opção `CONCURRENT` afeta um pouco o desempenho de `LOAD DATA`, mesmo que nenhuma outra sessão esteja usando a tabela ao mesmo tempo.

Se você especificar `HIGH_PRIORITY`, ele substitui o efeito da opção `--low-priority-updates` se o servidor foi iniciado com essa opção. Ele também faz com que as inserções concorrentes não sejam usadas.

Para `LOCK TABLE`, a diferença entre `READ LOCAL` e `READ` é que `READ LOCAL` permite que declarações `INSERT` não conflitantes (inserções concorrentes) sejam executadas enquanto o bloqueio é mantido. No entanto, isso não pode ser usado se você vai manipular o banco de dados usando processos externos ao servidor enquanto mantém o bloqueio.

### 8.11.4 Bloqueio de metadados

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos do banco de dados e garantir a consistência dos dados. O bloqueio de metadados não se aplica apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabela, bloqueios de usuário adquiridos com a função `GET_LOCK()` (consulte Seção 12.14, “Funções de Bloqueio”) e bloqueios adquiridos com o serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

A tabela do Schema de Desempenho `metadata_locks` exibe informações de bloqueio de metadados, o que pode ser útil para ver quais sessões possuem blocos, estão bloqueadas esperando por blocos, e assim por diante. Para detalhes, consulte a Seção 25.12.12.1, “A tabela de metadados\_locks”.

O bloqueio de metadados envolve algum overhead, que aumenta à medida que o volume de consultas aumenta. A concorrência de metadados aumenta quanto mais múltiplas consultas tentam acessar os mesmos objetos.

O bloqueio de metadados não é uma substituição para o cache de definição de tabela, e seus mutxes e bloqueios diferem do mutxo `LOCK_open`. A discussão a seguir fornece algumas informações sobre como o bloqueio de metadados funciona.

* Aquisição de bloqueio de metadados
* Liberação de bloqueio de metadados

#### Aquisição de bloqueio de metadados

Se houver vários garçons para um determinado bloqueio, o pedido de bloqueio de maior prioridade é atendido primeiro, com uma exceção relacionada à variável de sistema `max_write_lock_count`. Os pedidos de escrita têm prioridade maior do que os pedidos de leitura de bloqueio. No entanto, se `max_write_lock_count` estiver definido com um valor baixo (digamos, 10), os pedidos de leitura de bloqueio podem ser preferidos em relação aos pedidos de bloqueio de escrita pendentes, se os pedidos de leitura de bloqueio já tiverem sido passados em favor de 10 pedidos de bloqueio de escrita. Normalmente, esse comportamento não ocorre porque `max_write_lock_count`, por padrão, tem um valor muito grande.

As declarações adquirem travamentos de metadados um a um, não simultaneamente, e realizam detecção de travamento no processo.

As declarações DML normalmente obtêm bloqueios na ordem em que as tabelas são mencionadas na declaração.

As declarações DDL, `LOCK TABLES`, e outras declarações semelhantes tentam reduzir o número de possíveis deadlocks entre declarações DDL concorrentes ao adquirir bloqueios em tabelas explicitamente nomeadas em ordem de nome. Os bloqueios podem ser adquiridos em uma ordem diferente para tabelas implicitamente usadas (como tabelas em relações de chave estrangeira que também devem ser bloqueadas).

Por exemplo, `RENAME TABLE` é uma declaração DDL que adquire bloqueios em ordem de nome:

* Esta declaração `RENAME TABLE` renomeia `tbla` para outra coisa e renomeia `tblc` para `tbla`:

  ```sql
  RENAME TABLE tbla TO tbld, tblc TO tbla;
  ```

A declaração adquire bloqueios de metadados, em ordem, em `tbla`, `tblc` e `tbld` (porque `tbld` segue `tblc` na ordem de nome):

* Essa declaração ligeiramente diferente também renomeia `tbla` para algo mais, e renomeia `tblc` para `tbla`:

  ```sql
  RENAME TABLE tbla TO tblb, tblc TO tbla;
  ```

Neste caso, a declaração adquire bloqueios de metadados, em ordem, em `tbla`, `tblb` e `tblc` (porque `tblb` precede `tblc` na ordem de nome):

Ambas as declarações adquirem bloqueios em `tbla` e `tblc`, nessa ordem, mas diferem em saber se o bloqueio no nome da tabela restante é adquirido antes ou depois de `tblc`.

A ordem de aquisição de bloqueio de metadados pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente, como o exemplo a seguir ilustra.

Comece com duas tabelas `x` e `x_new` que tenham estrutura idêntica. Três clientes fazem declarações que envolvem essas tabelas:

Cliente 1:

```sql
LOCK TABLE x WRITE, x_new WRITE;
```

A declaração solicita e obtém bloqueios de escrita na ordem do nome em `x` e `x_new`.

Cliente 2:

```sql
INSERT INTO x VALUES(1);
```

A declaração solicita e bloqueia as solicitações de espera para um bloqueio de escrita em `x`.

Cliente 3:

```sql
RENAME TABLE x TO x_old, x_new TO x;
```

A declaração solicita bloqueios exclusivos em ordem de nome em `x`, `x_new` e `x_old`, mas bloqueia as esperas pelo bloqueio em `x`.

Cliente 1:

```sql
UNLOCK TABLES;
```

A declaração libera os bloqueios de escrita em `x` e `x_new`. O pedido exclusivo de bloqueio para `x` do Cliente 3 tem prioridade superior ao pedido de bloqueio de escrita do Cliente 2, então o Cliente 3 adquire seu bloqueio em `x`, depois também em `x_new` e `x_old`, realiza o renomeamento e libera seus bloqueios. O Cliente 2 então adquire seu bloqueio em `x`, realiza a inserção e libera seu bloqueio.

A ordem de aquisição de bloqueio resulta na execução do `RENAME TABLE` antes do `INSERT`. O `x` no qual o inserto ocorre é a tabela que foi nomeada como `x_new` quando o Cliente 2 emitiu o inserto e foi renomeada para `x` pelo Cliente 3:

```sql
mysql> SELECT * FROM x;
+------+
| i    |
+------+
|    1 |
+------+

mysql> SELECT * FROM x_old;
Empty set (0.01 sec)
```

Agora, comece, em vez disso, com tabelas com os nomes `x` e `new_x` que tenham uma estrutura idêntica. Novamente, três clientes fazem declarações que envolvem essas tabelas:

Cliente 1:

```sql
LOCK TABLE x WRITE, new_x WRITE;
```

A declaração solicita e obtém bloqueios de escrita na ordem do nome em `new_x` e `x`.

Cliente 2:

```sql
INSERT INTO x VALUES(1);
```

A declaração solicita e bloqueia as solicitações de espera para um bloqueio de escrita em `x`.

Cliente 3:

```sql
RENAME TABLE x TO old_x, new_x TO x;
```

A declaração solicita bloqueios exclusivos em ordem de nome em `new_x`, `old_x` e `x`, mas bloqueia as esperas pelo bloqueio em `new_x`.

Cliente 1:

```sql
UNLOCK TABLES;
```

A declaração libera as bloqueadoras de escrita em `x` e `new_x`. Para `x`, o único pedido pendente é do Cliente 2, então o Cliente 2 adquire sua bloqueadora, realiza o inserimento e libera a bloqueadora. Para `new_x`, o único pedido pendente é do Cliente 3, que é permitido adquirir essa bloqueadora (e também a bloqueadora em `old_x`). A operação de renome ainda bloqueia para a bloqueadora em `x` até que o inserimento do Cliente 2 termine e libere sua bloqueadora. Então, o Cliente 3 adquire a bloqueadora em `x`, realiza o renome e libera sua bloqueadora.

Neste caso, a ordem de aquisição de bloqueio resulta na execução do `INSERT` antes do `RENAME TABLE`. O `x` no qual o inserto ocorre é o original `x`, agora renomeado para `old_x` pela operação de renomeação:

```sql
mysql> SELECT * FROM x;
Empty set (0.01 sec)

mysql> SELECT * FROM old_x;
+------+
| i    |
+------+
|    1 |
+------+
```

Se a ordem de aquisição de bloqueio em declarações concorrentes faz diferença no resultado de uma aplicação em operação, como no exemplo anterior, você pode ser capaz de ajustar os nomes da tabela para afetar a ordem de aquisição de bloqueio.

#### Liberação do Bloqueio de Metadados

Para garantir a serializabilidade das transações, o servidor não deve permitir que uma sessão realize uma declaração de linguagem de definição de dados (DDL) em uma tabela que é usada em uma transação incompleta iniciada explicitamente ou implicitamente em outra sessão. O servidor alcança isso ao adquirir bloqueios de metadados em tabelas usadas dentro de uma transação e adiando a liberação desses blocos até que a transação termine. Um bloqueio de metadados em uma tabela impede alterações na estrutura da tabela. Essa abordagem de bloqueio tem a implicação de que uma tabela que está sendo usada por uma transação em uma sessão não pode ser usada em declarações DDL por outras sessões até que a transação termine.

Este princípio não se aplica apenas a tabelas transacionais, mas também a tabelas não transacionais. Suponha que uma sessão comece uma transação que utiliza a tabela transacional `t` e a tabela não transacional `nt` da seguinte forma:

```sql
START TRANSACTION;
SELECT * FROM t;
SELECT * FROM nt;
```

O servidor mantém bloqueios de metadados em `t` e `nt` até o término da transação. Se outra sessão tentar uma operação de DDL ou bloqueio de escrita em qualquer uma das tabelas, ela será bloqueada até o desbloqueio do bloqueio de metadados no término da transação. Por exemplo, uma segunda sessão é bloqueada se tentar qualquer uma dessas operações:

```sql
DROP TABLE t;
ALTER TABLE t ...;
DROP TABLE nt;
ALTER TABLE nt ...;
LOCK TABLE t ... WRITE;
```

O mesmo comportamento se aplica ao `LOCK TABLES ... READ`. Ou seja, transações explicitamente ou implicitamente iniciadas que atualizam qualquer bloco de tabela (transacional ou não) e são bloqueadas pelo `LOCK TABLES ... READ` para essa tabela.

Se o servidor adquirir bloqueios de metadados para uma declaração que é sintaticamente válida, mas falha durante a execução, ele não libera os bloqueios precocemente. A liberação dos bloqueios ainda é adiada até o final da transação, porque a declaração falha é escrita no log binário e os bloqueios protegem a consistência do log.

No modo de autocommit, cada declaração é, na verdade, uma transação completa, portanto, as chaves de metadados adquiridas para a declaração são mantidas apenas até o final da declaração.

Os bloqueios de metadados adquiridos durante uma declaração `PREPARE` são liberados assim que a declaração é preparada, mesmo que a preparação ocorra dentro de uma transação com várias declarações.

### 8.11.5 Bloqueio Externo

O bloqueio externo é o uso do bloqueio do sistema de arquivos para gerenciar a concorrência para as tabelas do banco de dados `MyISAM` por vários processos. O bloqueio externo é usado em situações em que um único processo, como o servidor MySQL, não pode ser assumido como o único processo que requer acesso às tabelas. Aqui estão alguns exemplos:

* Se você executar vários servidores que utilizam o mesmo diretório de banco de dados (não recomendado), cada servidor deve ter o bloqueio externo habilitado.

* Se você usar **myisamchk** para realizar operações de manutenção de tabela nas tabelas `MyISAM`, você deve garantir que o servidor não esteja em execução ou que o servidor tenha o bloqueio externo habilitado, para que ele bloqueie os arquivos de tabela conforme necessário para coordenar com **myisamchk** para o acesso às tabelas. O mesmo vale para o uso de **myisampack** para embalar as tabelas `MyISAM`.

Se o servidor for executado com o bloqueio externo habilitado, você pode usar **myisamchk** a qualquer momento para operações de leitura, como verificar tabelas. Nesse caso, se o servidor tentar atualizar uma tabela que o **myisamchk** está usando, o servidor aguarda pelo **myisamchk** para terminar antes de continuar.

Se você usar **myisamchk** para operações de escrita, como reparar ou otimizar tabelas, ou se você usar **myisampack** para embalar tabelas, *você* *deve* sempre garantir que o servidor `mysqld` não esteja usando a tabela. Se você não parar `mysqld`, pelo menos faça um **mysqladmin flush-tables** antes de executar **myisamchk**. Se o servidor e o **myisamchk** acessarem as tabelas simultaneamente, *as tabelas podem ficar corrompidas*.

Com o bloqueio externo em vigor, cada processo que requer acesso a uma tabela adquire um bloqueio do sistema de arquivos para os arquivos da tabela antes de prosseguir para acessar a tabela. Se todos os bloqueios necessários não puderem ser adquiridos, o processo é bloqueado de acessar a tabela até que os bloqueios possam ser obtidos (após o processo que atualmente detém os bloqueios liberá-los).

O bloqueio externo afeta o desempenho do servidor, pois o servidor, às vezes, deve esperar por outros processos antes de poder acessar as tabelas.

O bloqueio externo não é necessário se você executar um único servidor para acessar um diretório de dados específico (que é o caso usual) e se nenhum outro programa, como **myisamchk**, precise modificar as tabelas enquanto o servidor estiver em execução. Se você apenas *ler* as tabelas com outros programas, o bloqueio externo não é necessário, embora **myisamchk** possa emitir avisos se o servidor alterar as tabelas enquanto **myisamchk** as está lendo.

Com o bloqueio externo desativado, para usar o **myisamchk**, você deve interromper o servidor enquanto o **myisamchk** está sendo executado ou, caso contrário, bloquear e esvaziar as tabelas antes de executar o **myisamchk**. (Veja a Seção 8.12.1, “Fatores do sistema”.) Para evitar essa exigência, use as declarações `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar as tabelas `MyISAM`.

Para `mysqld`, o bloqueio externo é controlado pelo valor da variável de sistema `skip_external_locking`. Quando essa variável é habilitada, o bloqueio externo é desativado e vice-versa. O bloqueio externo é desativado por padrão.

O uso de bloqueio externo pode ser controlado na inicialização do servidor usando a opção `--external-locking` ou `--skip-external-locking`.

Se você usar a opção de bloqueio externo para habilitar atualizações nas tabelas do `MyISAM` de muitos processos do MySQL, você deve garantir que as seguintes condições sejam atendidas:

* Não use o cache de consulta para consultas que utilizam tabelas que são atualizadas por outro processo.

* Não inicie o servidor com a variável de sistema `delay_key_write` definida como `ALL` ou use a opção de tabela `DELAY_KEY_WRITE=1` para quaisquer tabelas compartilhadas. Caso contrário, pode ocorrer corrupção de índice.

A maneira mais fácil de satisfazer essas condições é sempre usar `--external-locking` junto com `--delay-key-write=OFF` e `--query-cache-size=0`. (Isso não é feito por padrão, porque, em muitas configurações, é útil ter uma mistura das opções anteriores.)