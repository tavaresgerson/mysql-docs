## 14.7 Modelo de bloqueio e transação do InnoDB

Para implementar um aplicativo de banco de dados em larga escala, com muitas atividades ou altamente confiável, para transferir código substancial de outro sistema de banco de dados ou para ajustar o desempenho do MySQL, é importante entender o bloqueio `InnoDB` e o modelo de transação `InnoDB`.

Esta seção discute vários tópicos relacionados ao bloqueio do `InnoDB` e ao modelo de transação `InnoDB` com o qual você deve estar familiarizado.

* A Seção 14.7.1, “Bloqueio InnoDB”, descreve os tipos de bloqueio utilizados pelo `InnoDB`.

* A Seção 14.7.2, “Modelo de Transação InnoDB”, descreve os níveis de isolamento de transação e as estratégias de bloqueio utilizadas por cada um. Também discute o uso de `autocommit`, leituras consistentes sem bloqueio e leituras com bloqueio.

* A seção 14.7.3, "Bloqueios definidos por diferentes declarações SQL no InnoDB", discute tipos específicos de bloqueios definidos em `InnoDB` para várias declarações.

* A seção 14.7.4, “Linhas Fantasma”, descreve como o `InnoDB` usa o bloqueio de próxima chave para evitar linhas fantasmas.

* A Seção 14.7.5, "Bloqueios em InnoDB", fornece um exemplo de bloqueio, discute a detecção de bloqueios e oferece dicas para minimizar e lidar com bloqueios em `InnoDB`.

### 14.7.1 Bloqueio InnoDB

Esta seção descreve os tipos de fechadura utilizados por `InnoDB`.

* Fechaduras compartilhadas e exclusivas
* Fechaduras de intenção
* Fechaduras de registro
* Fechaduras de lacuna
* Fechaduras Next-Key
* Inserir fechaduras de intenção
* Fechaduras AUTO-INC
* Fechaduras para índices espaciais

#### Chaves Compartilhadas e Exclusivas

`InnoDB` implementa o bloqueio padrão em nível de linha, onde existem dois tipos de bloqueios, bloqueios compartilhados (`S`) e bloqueios exclusivos (`X`).

* Um bloqueio compartilhado (`S`) permite que a transação que detém o bloqueio leia uma linha.

* Uma chave exclusiva (`X`) permite a transação que mantém a chave para atualizar ou excluir uma linha.

Se a transação `T1` possuir um bloqueio compartilhado (`S`) na linha `r`, então os pedidos de algumas transações distintas `T2` para um bloqueio na linha `r` são tratados da seguinte forma:

* Um pedido do `T2` para um bloqueio do `S` pode ser concedido imediatamente. Como resultado, tanto o `T1` quanto o `T2` possuem um bloqueio do `S` em `r`.

* Um pedido do `T2` para um bloqueio do `X` não pode ser concedido imediatamente.

Se uma transação `T1` possuir um bloqueio exclusivo (`X`) na linha `r`, um pedido de alguma transação `T2` para um bloqueio de qualquer tipo na `r` não pode ser concedido imediatamente. Em vez disso, a transação `T2` tem que esperar que a transação `T1` libere seu bloqueio na linha `r`.

#### Fechaduras de Intenção

`InnoDB` suporta *bloqueio de múltiplas granularidades*, que permite a coexistência de bloqueios de linha e bloqueios de tabela. Por exemplo, uma declaração como `LOCK TABLES ... WRITE` obtém um bloqueio exclusivo (um bloqueio `X` na tabela especificada). Para tornar o bloqueio em múltiplos níveis de granularidade prático, `InnoDB` usa bloqueios de intenção. Bloqueios de intenção são bloqueios de nível de tabela que indicam que tipo de bloqueio (compartilhado ou exclusivo) uma transação requer posteriormente para uma linha em uma tabela. Existem dois tipos de bloqueios de intenção:

* Uma chave de bloqueio compartilhada (`IS`) indica que uma transação pretende definir um *bloqueio* compartilhado em linhas individuais de uma tabela.

* Um bloqueio de intenção exclusiva (`IX`) indica que uma transação pretende definir um bloqueio exclusivo em linhas individuais de uma tabela.

Por exemplo, `SELECT ... LOCK IN SHARE MODE` define um bloqueio `IS`, e `SELECT ... FOR UPDATE` define um bloqueio `IX`.

O protocolo de bloqueio de intenção é o seguinte:

* Antes que uma transação possa adquirir um bloqueio compartilhado em uma linha em uma tabela, ela deve primeiro adquirir um bloqueio `IS` ou mais forte na tabela.

* Antes que uma transação possa adquirir um bloqueio exclusivo em uma linha em uma tabela, ela deve primeiro adquirir um bloqueio `IX` na tabela.

A compatibilidade do tipo de bloqueio de nível de tabela é resumida na matriz a seguir.

<table summary='A matrix showing table-level lock type compatibility. Each cell in the matrix is marked as either "Compatible" or "Conflict".'><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th></th> <th><code>X</code></th> <th><code>IX</code></th> <th><code>S</code></th> <th><code>IS</code></th> </tr></thead><tbody><tr> <th><code>X</code></th> <td>Conflict</td> <td>Conflict</td> <td>Conflict</td> <td>Conflict</td> </tr><tr> <th><code>IX</code></th> <td>Conflict</td> <td>Compatible</td> <td>Conflict</td> <td>Compatible</td> </tr><tr> <th><code>S</code></th> <td>Conflict</td> <td>Conflict</td> <td>Compatible</td> <td>Compatible</td> </tr><tr> <th><code>IS</code></th> <td>Conflict</td> <td>Compatible</td> <td>Compatible</td> <td>Compatible</td> </tr></tbody></table>

Um bloqueio é concedido a uma transação solicitante se for compatível com os bloqueios existentes, mas não se houver conflito com os bloqueios existentes. A transação aguarda até que o bloqueio existente em conflito seja liberado. Se um pedido de bloqueio entrar em conflito com um bloqueio existente e não puder ser concedido porque causaria um impasse, ocorre um erro.

Os bloqueios de intenção não bloqueiam nada, exceto solicitações de tabela completa (por exemplo, `LOCK TABLES ... WRITE`). O principal propósito dos bloqueios de intenção é mostrar que alguém está bloqueando uma linha ou vai bloquear uma linha na tabela.

Os dados de transação para uma bloqueio de intenção parecem semelhantes aos seguintes em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
TABLE LOCK table `test`.`t` trx id 10080 lock mode IX
```

#### Bloqueios de gravação

Um bloqueio de registro é um bloqueio em um registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transação insira, atualize ou exclua linhas onde o valor de `t.c1` é `10`.

Os registros de bloqueio sempre bloqueiam os registros do índice, mesmo que uma tabela seja definida sem índices. Para tais casos, o `InnoDB` cria um índice agrupado oculto e usa este índice para o bloqueio de registros. Veja a Seção 14.6.2.1, “Indizes Agrupados e Secundários”.

Os dados de transação para um bloqueio de registro aparecem semelhantes aos seguintes na saída do monitor `SHOW ENGINE INNODB STATUS` e do InnoDB:

```sql
RECORD LOCKS space id 58 page no 3 n bits 72 index `PRIMARY` of table `test`.`t`
trx id 10078 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 8000000a; asc     ;;
 1: len 6; hex 00000000274f; asc     'O;;
 2: len 7; hex b60000019d0110; asc        ;;
```

#### Fechaduras de Lacunas

Um bloqueio de lacuna é um bloqueio em uma lacuna entre registros de índice, ou um bloqueio na lacuna antes do primeiro ou após o último registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;` impede que outras transações insiram um valor de `15` na coluna `t.c1`, independentemente de já existir algum valor desse tipo na coluna, porque as lacunas entre todos os valores existentes na faixa estão bloqueadas.

Uma lacuna pode abranger um único valor de índice, vários valores de índice ou até mesmo estar vazia.

As trancas de lacuna fazem parte do compromisso entre desempenho e concorrência, e são utilizadas em alguns níveis de isolamento de transação e não em outros.

O bloqueio de lacuna não é necessário para declarações que bloqueiam linhas usando um índice único para pesquisar uma linha única. (Isso não inclui o caso em que a condição de pesquisa inclui apenas algumas colunas de um índice único de múltiplas colunas; nesse caso, o bloqueio de lacuna ocorre.) Por exemplo, se a coluna `id` tiver um índice único, a seguinte declaração usa apenas um bloqueio de registro de índice para a linha com o valor `id` 100 e não importa se outras sessões inserem linhas no espaço anterior:

```sql
SELECT * FROM child WHERE id = 100;
```

Se o `id` não estiver indexado ou tiver um índice não exclusivo, a declaração bloqueia a lacuna anterior.

Vale ressaltar aqui que bloqueios conflitantes podem ser mantidos em um intervalo por diferentes transações. Por exemplo, a transação A pode manter um bloqueio de intervalo compartilhado (bloqueio S-lock) em um intervalo, enquanto a transação B mantém um bloqueio exclusivo de intervalo (bloqueio X-lock) no mesmo intervalo. A razão pela qual os bloqueios de intervalo conflitantes são permitidos é que, se um registro for excluído de um índice, os bloqueios de intervalo mantidos no registro por diferentes transações devem ser unidos.

As bloqueadoras de lacuna em `InnoDB` são “pura e simplesmente inibidoras”, o que significa que seu único propósito é impedir que outras transações inseram na lacuna. Bloqueadoras de lacuna podem coexistir. Uma bloqueadora de lacuna tomada por uma transação não impede que outra transação tome uma bloqueadora de lacuna na mesma lacuna. Não há diferença entre bloqueadoras de lacuna compartilhadas e exclusivas. Elas não se contradizem e desempenham a mesma função.

O bloqueio de lacunas pode ser desativado explicitamente. Isso ocorre se você alterar o nível de isolamento de transação para `READ COMMITTED` ou ativar a variável de sistema `innodb_locks_unsafe_for_binlog` (que agora é descontinuada). Neste caso, o bloqueio de lacunas é desativado para pesquisas e varreduras de índice e é usado apenas para verificação de restrição de chave estrangeira e verificação de chave duplicada.

Há também outros efeitos de usar o nível de isolamento `READ COMMITTED` ou habilitando `innodb_locks_unsafe_for_binlog`. As bloqueadoras de registro para linhas não correspondentes são liberadas depois que o MySQL avalia a condição `WHERE`. Para as declarações `UPDATE`, `InnoDB` realiza uma leitura “semi-consistente”, de modo que retorna a versão mais recente comprometida ao MySQL, para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`.

#### Chaves Next-Key

Um bloqueio de próxima chave é uma combinação de um bloqueio de registro no registro do índice e um bloqueio de lacuna na lacuna antes do registro do índice.

`InnoDB` realiza o bloqueio de nível de linha de tal forma que, quando ele pesquisa ou examina um índice de tabela, ele define bloqueios compartilhados ou exclusivos nos registros do índice que ele encontra. Assim, os bloqueios de nível de linha são, na verdade, bloqueios de registro de índice. Um bloqueio de próxima chave em um registro de índice também afeta o "espaço" antes desse registro de índice. Isso significa que um bloqueio de próxima chave é um bloqueio de registro de índice mais um bloqueio de espaço sobre o espaço que precede o registro de índice. Se uma sessão tiver um bloqueio compartilhado ou exclusivo no registro `R` em um índice, outra sessão não pode inserir um novo registro de índice no espaço imediatamente antes de `R` na ordem do índice.

Suponha que um índice contenha os valores 10, 11, 13 e 20. As possíveis chaves próximas para este índice cobrem os seguintes intervalos, onde um parêntese redondo denota a exclusão do ponto final do intervalo e um parêntese quadrado denota a inclusão do ponto final:

```sql
(negative infinity, 10]
(10, 11]
(11, 13]
(13, 20]
(20, positive infinity)
```

Para o último intervalo, o bloqueio da próxima chave fecha a lacuna acima do maior valor no índice e o pseudorecord do "supremum" que tem um valor superior a qualquer valor realmente no índice. O supremum não é um registro real do índice, portanto, na prática, este bloqueio da próxima chave fecha apenas a lacuna que segue o maior valor do índice.

Por padrão, `InnoDB` opera no nível de isolamento de transação `REPEATABLE READ`. Neste caso, `InnoDB` utiliza bloqueios de próxima chave para pesquisas e varreduras de índice, o que previne linhas fantasmas (ver Seção 14.7.4, “Linhas fantasmas”).

Os dados de transação para um bloqueio de próxima chave aparecem semelhantes aos seguintes em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
RECORD LOCKS space id 58 page no 3 n bits 72 index `PRIMARY` of table `test`.`t`
trx id 10080 lock_mode X
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;

Record lock, heap no 2 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 8000000a; asc     ;;
 1: len 6; hex 00000000274f; asc     'O;;
 2: len 7; hex b60000019d0110; asc        ;;
```

#### Inserir bloqueios de intenção

Um bloqueio de inserção de intenção é um tipo de bloqueio de lacuna definido pelas operações de `INSERT` antes da inserção de linha. Esse bloqueio sinaliza a intenção de inserir de tal forma que várias transações que inserem no mesmo intervalo de índice não precisam esperar uma da outra se não estiverem inserindo na mesma posição dentro da lacuna. Suponha que haja registros de índice com valores de 4 e 7. Transações separadas que tentam inserir valores de 5 e 6, respectivamente, bloqueiam a lacuna entre 4 e 7 com bloqueios de intenção de inserção antes de obter o bloqueio exclusivo da linha inserida, mas não se bloqueiam uma à outra porque as linhas não são conflitantes.

O exemplo a seguir demonstra uma transação que realiza uma bloqueio de intenção de inserção antes de obter um bloqueio exclusivo no registro inserido. O exemplo envolve dois clientes, A e B.

O cliente A cria uma tabela contendo dois registros de índice (90 e 102) e, em seguida, inicia uma transação que coloca um bloqueio exclusivo em registros de índice com uma ID maior que 100. O bloqueio exclusivo inclui um bloqueio de lacuna antes do registro 102:

```sql
mysql> CREATE TABLE child (id int(11) NOT NULL, PRIMARY KEY(id)) ENGINE=InnoDB;
mysql> INSERT INTO child (id) values (90),(102);

mysql> START TRANSACTION;
mysql> SELECT * FROM child WHERE id > 100 FOR UPDATE;
+-----+
| id  |
+-----+
| 102 |
+-----+
```

O cliente B inicia uma transação para inserir um registro na lacuna. A transação assume uma intenção de bloqueio de inserção enquanto espera obter um bloqueio exclusivo.

```sql
mysql> START TRANSACTION;
mysql> INSERT INTO child (id) VALUES (101);
```

Os dados de transação para uma intenção de bloqueio de inserção parecem semelhantes aos seguintes em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
RECORD LOCKS space id 31 page no 3 n bits 72 index `PRIMARY` of table `test`.`child`
trx id 8731 lock_mode X locks gap before rec insert intention waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000066; asc    f;;
 1: len 6; hex 000000002215; asc     " ;;
 2: len 7; hex 9000000172011c; asc     r  ;;...
```

#### Auto-Incs Locks

Um bloqueio `AUTO-INC` é um bloqueio especial de nível de tabela tomado por transações que inserem tabelas com colunas `AUTO_INCREMENT`. No caso mais simples, se uma transação está inserindo valores na tabela, qualquer outra transação deve esperar para fazer suas próprias inserções naquela tabela, para que as linhas inseridas pela primeira transação recebam valores consecutivos de chave primária.

A variável `innodb_autoinc_lock_mode` controla o algoritmo utilizado para o bloqueio de auto-incremento. Ela permite que você escolha como equilibrar entre sequências previsíveis de valores de auto-incremento e a concorrência máxima para operações de inserção.

Para mais informações, consulte a Seção 14.6.1.6, “Tratamento de AUTO\_INCREMENT em InnoDB”.

#### Lâminas preditivas para índices espaciais

`InnoDB` suporta a indexação de colunas que contêm dados espaciais por meio de `SPATIAL` (consulte a Seção 11.4.8, “Otimizando a Análise Espacial”).

Para lidar com o bloqueio para operações que envolvem índices `SPATIAL`, o bloqueio de próxima chave não funciona bem para suportar os níveis de isolamento de transação `REPEATABLE READ` ou `SERIALIZABLE`. Não há um conceito absoluto de ordenação em dados multidimensionais, então não está claro qual é a chave “próxima”.

Para permitir o suporte a níveis de isolamento para tabelas com índices `SPATIAL`, o `InnoDB` utiliza bloqueios de predicado. Um índice `SPATIAL` contém valores de retângulo mínimo de delimitação (MBR), portanto, o `InnoDB` impõe uma leitura consistente no índice, definindo um bloqueio de predicado no valor MBR usado para uma consulta. Outras transações não podem inserir ou modificar uma linha que corresponderia à condição da consulta.

### 14.7.2 Modelo de Transação InnoDB

O modelo de transação `InnoDB` visa combinar as melhores propriedades de um banco de dados de múltiplas versões com o bloqueio tradicional de duas fases. `InnoDB` realiza o bloqueio no nível da linha e executa consultas como leituras consistentes não bloqueantes por padrão, no estilo do Oracle. As informações de bloqueio em `InnoDB` são armazenadas de forma eficiente em termos de espaço, de modo que a escalada de bloqueio não seja necessária. Tipicamente, vários usuários são autorizados a bloquear cada linha em tabelas de `InnoDB`, ou qualquer subconjunto aleatório das linhas, sem causar o esgotamento da memória de `InnoDB`.

#### 14.7.2.1 Níveis de Isolamento de Transação

A isolação de transação é um dos fundamentos do processamento de banco de dados. A isolação é a I do acrônimo ACID; o nível de isolamento é o ajuste que refina o equilíbrio entre desempenho e confiabilidade, consistência e reprodutibilidade dos resultados quando múltiplas transações estão fazendo alterações e realizando consultas ao mesmo tempo.

`InnoDB` oferece todos os quatro níveis de isolamento de transação descritos pelo padrão SQL:1992: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`. O nível de isolamento padrão para `InnoDB` é `REPEATABLE READ`.

Um usuário pode alterar o nível de isolamento para uma única sessão ou para todas as conexões subsequentes com a declaração `SET TRANSACTION`. Para definir o nível de isolamento padrão do servidor para todas as conexões, use a opção `--transaction-isolation` na linha de comando ou em um arquivo de opções. Para informações detalhadas sobre os níveis de isolamento e a sintaxe de definição de nível, consulte a Seção 13.3.6, “Declaração SET TRANSACTION”.

`InnoDB` suporta cada um dos níveis de isolamento de transação descritos aqui usando diferentes estratégias de bloqueio. Você pode impor um alto grau de consistência com o nível padrão `REPEATABLE READ`, para operações em dados cruciais onde a conformidade ACID é importante. Ou você pode relaxar as regras de consistência com `READ COMMITTED` ou até mesmo `READ UNCOMMITTED`, em situações como relatórios em massa onde a consistência precisa e resultados repetidos são menos importantes do que minimizar a quantidade de sobrecarga para bloqueio. `SERIALIZABLE` impõe regras ainda mais estritas do que `REPEATABLE READ`, e é usado principalmente em situações especializadas, como com transações XA e para solucionar problemas com concorrência e bloqueios.

A lista a seguir descreve como o MySQL suporta os diferentes níveis de transação. A lista vai do nível mais comumente usado ao menos usado.

* `REPEATABLE READ`

Este é o nível de isolamento padrão para `InnoDB`. Leitura consistente dentro da mesma transação lê o instantâneo estabelecido pelo primeiro leia. Isso significa que, se você emitir várias declarações simples (não bloqueáveis) `SELECT` dentro da mesma transação, essas declarações `SELECT` são consistentes também em relação umas às outras. Veja a Seção 14.7.2.3, “Leitura Consistente Não Bloqueável”.

Para leituras de bloqueio (`SELECT` com `FOR UPDATE` ou `LOCK IN SHARE MODE`, as declarações `UPDATE` e `DELETE`, o bloqueio depende se a declaração usa um índice único com uma condição de pesquisa única ou uma condição de pesquisa de tipo intervalo.

+ Para um índice com uma condição de busca única, `InnoDB` bloqueia apenas o registro do índice encontrado, não o espaço antes dele.

+ Para outras condições de busca, `InnoDB` bloqueia o intervalo do índice que é examinado, usando bloqueios de lacuna ou bloqueios de próxima chave para bloquear inserções por outras sessões nos intervalos cobertos pelo intervalo. Para informações sobre bloqueios de lacuna e bloqueios de próxima chave, consulte a Seção 14.7.1, “Bloqueio InnoDB”.

Não é recomendado misturar declarações de bloqueio (`UPDATE`, `INSERT`, `DELETE` ou `SELECT ... FOR ...`) com declarações não bloqueadas `SELECT` em uma única transação `REPEATABLE READ`, porque, tipicamente, em tais casos, você deseja `SERIALIZABLE`. Isso ocorre porque uma declaração não bloquida `SELECT` apresenta o estado do banco de dados de uma visão de leitura que consiste em transações comprometidas antes da criação da visão de leitura e antes das próprias escritas da transação atual, enquanto as declarações de bloqueio veem e modificam o estado mais recente do banco de dados para uso de bloqueio. Em geral, esses dois estados de tabela diferentes são inconsistentes entre si e difíceis de analisar.

* `READ COMMITTED`

Cada leitura consistente, mesmo dentro da mesma transação, define e lê seu próprio instantâneo fresco. Para informações sobre leituras consistentes, consulte a Seção 14.7.2.3, “Leituras Não Bloqueadoras Consistentes”.

Para bloqueios de leituras (`SELECT` com `FOR UPDATE` ou `LOCK IN SHARE MODE`), declarações `UPDATE` e declarações `DELETE`, o bloqueio `InnoDB` bloqueia apenas os registros de índice, não os espaços antes deles, e, portanto, permite a inserção livre de novos registros ao lado dos registros bloqueados. O bloqueio de lacunas é usado apenas para verificação de restrição de chave estrangeira e verificação de chave duplicada.

Como o bloqueio de lacunas está desativado, podem ocorrer problemas com linhas fantasmas, pois outras sessões podem inserir novas linhas nas lacunas. Para informações sobre linhas fantasmas, consulte a Seção 14.7.4, “Linhas fantasmas”.

Apenas o registro binário baseado em linha é suportado com o nível de isolamento `READ COMMITTED`. Se você usar `READ COMMITTED` com `binlog_format=MIXED`, o servidor usa automaticamente o registro baseado em linha.

O uso de `READ COMMITTED` tem efeitos adicionais:

+ Para as declarações `UPDATE` ou `DELETE`, `InnoDB` mantém as chaves apenas para as linhas que ele atualiza ou exclui. As chaves de registro para linhas não correspondentes são liberadas após o MySQL ter avaliado a condição `WHERE`. Isso reduz significativamente a probabilidade de deadlocks, mas ainda podem ocorrer.

+ Para as declarações `UPDATE`, se uma linha já estiver bloqueada, `InnoDB` realiza uma leitura "semi-consistente", retornando a versão mais recente comprometida ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente e, desta vez, `InnoDB` a bloqueia ou aguarda um bloqueio nela.

Considere o exemplo a seguir, começando com esta tabela:

  ```sql
  CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
  COMMIT;
  ```

Neste caso, a tabela não possui índices, portanto, as pesquisas e varreduras de índice utilizam o índice agrupado oculto para o bloqueio de registros (ver Seção 14.6.2.1, "Indizes agrupados e secundários") em vez das colunas indexadas.

Suponha que uma sessão realize uma `UPDATE` usando essas declarações:

  ```sql
  # Session A
  START TRANSACTION;
  UPDATE t SET b = 5 WHERE b = 3;
  ```

Suponha também que uma segunda sessão realize uma `UPDATE` executando esta declaração após as da primeira sessão:

  ```sql
  # Session B
  UPDATE t SET b = 4 WHERE b = 2;
  ```

À medida que o `InnoDB` executa cada `UPDATE`, ele primeiro adquire um bloqueio exclusivo para cada linha que lê, e depois determina se a modificará. Se o `InnoDB` não modifica a linha, ele libera o bloqueio. Caso contrário, o `InnoDB` retém o bloqueio até o final da transação. Isso afeta o processamento da transação da seguinte forma.

Ao usar o nível de isolamento padrão `REPEATABLE READ`, o primeiro `UPDATE` adquire um x-lock em cada linha que lê e não libera nenhuma delas:

  ```sql
  x-lock(1,2); retain x-lock
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); retain x-lock
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); retain x-lock
  ```

O segundo bloco `UPDATE` bloqueia assim que tenta adquirir qualquer bloqueio (porque a primeira atualização retivou os bloqueios em todas as linhas), e não prossegue até que o primeiro `UPDATE` commit ou rollback:

  ```sql
  x-lock(1,2); block and wait for first UPDATE to commit or roll back
  ```

Se for usado `READ COMMITTED` em vez disso, o primeiro `UPDATE` adquire um x-lock em cada linha que lê e libera essas linhas que não modifica:

  ```sql
  x-lock(1,2); unlock(1,2)
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); unlock(3,2)
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); unlock(5,2)
  ```

Para o segundo `UPDATE`, o `InnoDB` realiza uma leitura “semi-consistente”, retornando a versão mais recente comprometida de cada linha que lê para o MySQL, para que o MySQL possa determinar se a linha corresponde à condição do `WHERE` do `UPDATE`:

  ```sql
  x-lock(1,2); update(1,2) to (1,4); retain x-lock
  x-lock(2,3); unlock(2,3)
  x-lock(3,2); update(3,2) to (3,4); retain x-lock
  x-lock(4,3); unlock(4,3)
  x-lock(5,2); update(5,2) to (5,4); retain x-lock
  ```

No entanto, se a condição `WHERE` incluir uma coluna indexada e o `InnoDB` utilizar o índice, apenas a coluna indexada é considerada ao realizar e manter bloqueios de registro. No exemplo a seguir, o primeiro `UPDATE` realiza e mantém um bloqueio x em cada linha onde b = 2. O segundo `UPDATE` bloqueia quando tenta adquirir blocos x nos mesmos registros, pois também utiliza o índice definido na coluna b.

  ```sql
  CREATE TABLE t (a INT NOT NULL, b INT, c INT, INDEX (b)) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2,3),(2,2,4);
  COMMIT;

  # Session A
  START TRANSACTION;
  UPDATE t SET b = 3 WHERE b = 2 AND c = 3;

  # Session B
  UPDATE t SET b = 4 WHERE b = 2 AND c = 4;
  ```

Os efeitos de usar o nível de isolamento `READ COMMITTED` são os mesmos que os de habilitar a variável descontinuada `innodb_locks_unsafe_for_binlog`, com essas exceções:

+ Habilitar `innodb_locks_unsafe_for_binlog` é um ajuste global e afeta todas as sessões, enquanto o nível de isolamento pode ser definido globalmente para todas as sessões, ou individualmente por sessão.

+ `innodb_locks_unsafe_for_binlog` pode ser definido apenas na inicialização do servidor, enquanto o nível de isolamento pode ser definido na inicialização ou alterado no runtime.

O `READ COMMITTED` oferece, portanto, um controle mais fino e flexível do que o `innodb_locks_unsafe_for_binlog`.

* `READ UNCOMMITTED`

As declarações `SELECT` são realizadas de forma não bloqueante, mas uma possível versão anterior de uma linha pode ser usada. Assim, usando esse nível de isolamento, essas leituras não são consistentes. Isso também é chamado de leitura suja. Caso contrário, esse nível de isolamento funciona como `READ COMMITTED`.

* `SERIALIZABLE`

Este nível é como `REPEATABLE READ`, mas `InnoDB` converte implicitamente todas as declarações simples de `SELECT` para `SELECT ... LOCK IN SHARE MODE` se `autocommit` estiver desativado. Se `autocommit` estiver ativado, o `SELECT` é sua própria transação. Portanto, é conhecido como somente leitura e pode ser serializado se realizado como uma leitura consistente (não bloqueio) e não precisa bloquear outras transações. (Para forçar uma declaração simples de `SELECT` a bloquear se outras transações tiverem modificado as linhas selecionadas, desative `autocommit`.).

#### 14.7.2.2 autocommit, Commit e Rollback

Em `InnoDB`, toda a atividade do usuário ocorre dentro de uma transação. Se o modo `autocommit` estiver habilitado, cada declaração SQL forma uma única transação por si só. Por padrão, o MySQL inicia a sessão para cada nova conexão com `autocommit` habilitado, então o MySQL realiza um compromisso após cada declaração SQL se essa declaração não retornar um erro. Se uma declaração retornar um erro, o comportamento de compromisso ou rollback depende do erro. Veja a Seção 14.22.4, “Tratamento de Erros InnoDB”.

Uma sessão que tenha `autocommit` habilitada pode realizar uma transação de múltiplos comandos iniciando-a com uma declaração explícita `START TRANSACTION` ou `BEGIN` e terminando-a com uma declaração `COMMIT` ou `ROLLBACK`. Veja a Seção 13.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

Se o modo `autocommit` for desativado em uma sessão com `SET autocommit = 0`, a sessão sempre terá uma transação aberta. Uma declaração `COMMIT` ou `ROLLBACK` termina a transação atual e uma nova começa.

Se uma sessão que tem `autocommit` desativado termina sem comprometer explicitamente a transação final, o MySQL desfaz essa transação.

Algumas declarações implicitamente encerram uma transação, como se você tivesse feito um `COMMIT` antes de executar a declaração. Para detalhes, consulte a Seção 13.3.3, “Declarações que causam um compromisso implícito”.

Um `COMMIT` significa que as alterações feitas na transação atual são feitas permanentemente e tornam-se visíveis para outras sessões. Uma declaração `ROLLBACK`, por outro lado, cancela todas as modificações feitas pela transação atual. Tanto o `COMMIT` quanto o `ROLLBACK` liberam todos os `InnoDB` blocos que foram definidos durante a transação atual.

##### Agrupamento de operações DML com transações

Por padrão, a conexão com o servidor MySQL começa com o modo de autocommit ativado, que automaticamente confirma cada declaração SQL conforme você a executa. Esse modo de operação pode ser desconhecido se você tiver experiência com outros sistemas de banco de dados, onde é prática padrão emitir uma sequência de declarações DML e compô-las ou desfazê-las todas juntas.

Para usar transações com múltiplos comandos, desative o autocommit com a declaração SQL `SET autocommit = 0` e termine cada transação com `COMMIT` ou `ROLLBACK`, conforme apropriado. Para deixar o autocommit ativado, comece cada transação com `START TRANSACTION` e termine-a com `COMMIT` ou `ROLLBACK`. O exemplo a seguir mostra duas transações. A primeira é comprometida; a segunda é revertida.

```sql
$> mysql test
```

```sql
mysql> CREATE TABLE customer (a INT, b CHAR (20), INDEX (a));
Query OK, 0 rows affected (0.00 sec)
mysql> -- Do a transaction with autocommit turned on.
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)
mysql> INSERT INTO customer VALUES (10, 'Heikki');
Query OK, 1 row affected (0.00 sec)
mysql> COMMIT;
Query OK, 0 rows affected (0.00 sec)
mysql> -- Do another transaction with autocommit turned off.
mysql> SET autocommit=0;
Query OK, 0 rows affected (0.00 sec)
mysql> INSERT INTO customer VALUES (15, 'John');
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO customer VALUES (20, 'Paul');
Query OK, 1 row affected (0.00 sec)
mysql> DELETE FROM customer WHERE b = 'Heikki';
Query OK, 1 row affected (0.00 sec)
mysql> -- Now we undo those last 2 inserts and the delete.
mysql> ROLLBACK;
Query OK, 0 rows affected (0.00 sec)
mysql> SELECT * FROM customer;
+------+--------+
| a    | b      |
+------+--------+
|   10 | Heikki |
+------+--------+
1 row in set (0.00 sec)
mysql>
```

###### Transações em Linguagens do Lado do Cliente

Em APIs como PHP, Perl DBI, JDBC, ODBC ou a interface de chamada padrão C do MySQL, você pode enviar declarações de controle de transação, como `COMMIT`, para o servidor MySQL como strings, assim como qualquer outra declaração SQL, como `SELECT` ou `INSERT`. Algumas APIs também oferecem funções ou métodos especiais separados para o compromisso e o rollback de transação.

#### 14.7.2.3 Leitura consistente sem bloqueio

Uma leitura consistente significa que `InnoDB` usa a multiversão para apresentar a uma consulta um instantâneo do banco de dados em um ponto no tempo. A consulta vê as alterações feitas por transações que foram confirmadas antes desse ponto no tempo, e nenhuma alteração feita por transações posteriores ou não confirmadas. A exceção a essa regra é que a consulta vê as alterações feitas por declarações anteriores dentro da mesma transação. Essa exceção causa a seguinte anomalia: Se você atualizar algumas linhas em uma tabela, um `SELECT` vê a versão mais recente das linhas atualizadas, mas também pode ver versões mais antigas de qualquer linha. Se outras sessões atualizarem simultaneamente a mesma tabela, a anomalia significa que você pode ver a tabela em um estado que nunca existiu no banco de dados.

Se o nível de isolamento de transação for `REPEATABLE READ` (o nível padrão), todas as leituras consistentes dentro da mesma transação leem o instantâneo estabelecido pelo primeiro desses leitores naquela transação. Você pode obter um instantâneo mais recente para suas consultas ao confirmar a transação atual e, em seguida, emitir novas consultas.

Com o nível de isolamento `READ COMMITTED`, cada leitura consistente dentro de um conjunto e leituras de transação define seu próprio instantâneo fresco.

A leitura consistente é o modo padrão pelo qual o `InnoDB` processa as declarações do `SELECT` nos níveis de isolamento `READ COMMITTED` e `REPEATABLE READ`. Uma leitura consistente não define quaisquer bloqueios nas tabelas a que ela acessa, e, portanto, outras sessões estão livres para modificar essas tabelas ao mesmo tempo em que uma leitura consistente está sendo realizada na tabela.

Suponha que você esteja executando o nível de isolamento padrão `REPEATABLE READ`. Quando você emite uma leitura consistente (ou seja, uma declaração comum `SELECT`, `InnoDB` atribui a sua transação um ponto de tempo de acordo com o qual sua consulta vê o banco de dados. Se outra transação excluir uma linha e confirmar após seu ponto de tempo ter sido atribuído, você não verá que a linha foi excluída. Inserções e atualizações são tratadas de forma semelhante.

Nota

O instantâneo do estado do banco de dados se aplica às declarações `SELECT` dentro de uma transação, não necessariamente às declarações DML. Se você inserir ou modificar algumas linhas e então confirmar essa transação, uma declaração `DELETE` ou `UPDATE` emitida a partir de outra transação `REPEATABLE READ` concorrente pode afetar essas linhas que foram confirmadas recentemente, mesmo que a sessão não as possa consultar. Se uma transação atualiza ou exclui linhas confirmadas por outra transação, essas alterações se tornam visíveis para a transação atual. Por exemplo, você pode encontrar uma situação como a seguinte:

```sql
SELECT COUNT(c1) FROM t1 WHERE c1 = 'xyz';
-- Returns 0: no rows match.
DELETE FROM t1 WHERE c1 = 'xyz';
-- Deletes several rows recently committed by other transaction.

SELECT COUNT(c2) FROM t1 WHERE c2 = 'abc';
-- Returns 0: no rows match.
UPDATE t1 SET c2 = 'cba' WHERE c2 = 'abc';
-- Affects 10 rows: another txn just committed 10 rows with 'abc' values.
SELECT COUNT(c2) FROM t1 WHERE c2 = 'cba';
-- Returns 10: this txn can now see the rows it just updated.
```

Você pode avançar seu ponto de tempo ao comprometê-se com sua transação e, em seguida, realizar outro `SELECT` ou `START TRANSACTION WITH CONSISTENT SNAPSHOT`.

Isso é chamado de controle de concorrência com múltiplas versões.

No exemplo a seguir, a sessão A vê a linha inserida por B apenas quando B comprometeu a inserção e A também comprometeu, de modo que o ponto de tempo é avançado além do comprometimento de B.

```sql
             Session A              Session B

           SET autocommit=0;      SET autocommit=0;
time
|          SELECT * FROM t;
|          empty set
|                                 INSERT INTO t VALUES (1, 2);
|
v          SELECT * FROM t;
           empty set
                                  COMMIT;

           SELECT * FROM t;
           empty set

           COMMIT;

           SELECT * FROM t;
           ---------------------
           |    1    |    2    |
           ---------------------
```

Se você quiser ver o estado mais recente do banco de dados, use o nível de isolamento `READ COMMITTED` ou uma leitura com bloqueio.

```sql
SELECT * FROM t LOCK IN SHARE MODE;
```

Com o nível de isolamento `READ COMMITTED`, cada leitura consistente dentro de uma transação define e lê seu próprio instantâneo fresco. Com `LOCK IN SHARE MODE`, ocorre uma leitura de bloqueio em vez disso: um `SELECT` bloqueia até que a transação contendo as linhas mais recentes termine (consulte Seção 14.7.2.4, “Leitura de Bloqueio”).

A leitura consistente não funciona em determinadas declarações DDL:

* A leitura consistente não funciona sobre `DROP TABLE`, porque o MySQL não pode usar uma tabela que tenha sido excluída e `InnoDB` destrói a tabela.

* A leitura consistente não funciona em operações `ALTER TABLE` que fazem uma cópia temporária da tabela original e excluem a tabela original quando a cópia temporária é construída. Quando você reemite uma leitura consistente dentro de uma transação, as linhas na nova tabela não são visíveis porque essas linhas não existiam quando o instantâneo da transação foi tomado. Neste caso, a transação retorna um erro: `ER_TABLE_DEF_CHANGED`, “A definição da tabela mudou, tente novamente a transação”.

O tipo de leitura varia para seleções em cláusulas como `INSERT INTO ... SELECT`, `UPDATE ... (SELECT)` e `CREATE TABLE ... SELECT` que não especificam `FOR UPDATE` ou `LOCK IN SHARE MODE`:

* Por padrão, `InnoDB` usa trancas mais fortes nessas declarações e a parte `SELECT` age como `READ COMMITTED`, onde cada leitura consistente, mesmo dentro da mesma transação, define e lê seu próprio instantâneo fresco.

* Para realizar uma leitura não bloqueável nesses casos, habilite a opção `innodb_locks_unsafe_for_binlog` e defina o nível de isolamento da transação para `READ UNCOMMITTED`, `READ COMMITTED` ou `REPEATABLE READ` para evitar definir bloqueios em linhas lidas da tabela selecionada.

#### 14.7.2.4 Leitura de bloqueio

Se você fizer uma consulta de dados e, em seguida, inserir ou atualizar dados relacionados na mesma transação, a declaração regular `SELECT` não oferece proteção suficiente. Outras transações podem atualizar ou excluir as mesmas linhas que você acabou de consultar. `InnoDB` suporta dois tipos de leituras de bloqueio que oferecem segurança extra:

* `SELECT ... LOCK IN SHARE MODE`

Define um bloqueio de modo compartilhado em quaisquer linhas que são lidas. Outras sessões podem ler as linhas, mas não as podem modificar até que sua transação seja confirmada. Se alguma dessas linhas foi alterada por outra transação que ainda não foi confirmada, sua consulta espera até que essa transação termine e, em seguida, usa os valores mais recentes.

* `SELECT ... FOR UPDATE`

Para registros de índice, a pesquisa encontra, bloqueia as linhas e quaisquer entradas de índice associadas, da mesma forma como se emitisse uma declaração `UPDATE` para essas linhas. Outras transações são bloqueadas para atualizar essas linhas, para fazer `SELECT ... LOCK IN SHARE MODE`, ou para ler os dados em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na visão de leitura. (Versões antigas de um registro não podem ser bloqueadas; elas são reconstruídas aplicando registros de desfazer em uma cópia de memória do registro.)

Essas cláusulas são principalmente úteis ao lidar com dados estruturados em árvore ou estruturados em gráficos, seja em uma única tabela ou dividida em várias tabelas. Você percorre arestas ou ramos da árvore de um lugar para outro, reservando o direito de voltar e alterar qualquer um desses valores de "ponteiro".

Todos os bloqueios definidos pelas consultas `LOCK IN SHARE MODE` e `FOR UPDATE` são liberados quando a transação é confirmada ou revertida.

Nota

As leituras de bloqueio só são possíveis quando o autocommit é desativado (iniciando a transação com `START TRANSACTION` ou definindo `autocommit` como 0.

Uma cláusula de leitura com bloqueio em uma declaração externa não bloqueia as linhas de uma tabela em uma subconsulta aninhada, a menos que uma cláusula de leitura com bloqueio também seja especificada na subconsulta. Por exemplo, a seguinte declaração não bloqueia as linhas da tabela `t2`.

```sql
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2) FOR UPDATE;
```

Para bloquear linhas na tabela `t2`, adicione uma cláusula de leitura de bloqueio à subconsulta:

```sql
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2 FOR UPDATE) FOR UPDATE;
```

##### Exemplos de bloqueio de leitura

Suponha que você queira inserir uma nova linha em uma tabela `child`, e certifique-se de que a linha secundária tenha uma linha principal na tabela `parent`. Seu código de aplicação pode garantir a integridade referencial ao longo dessa sequência de operações.

Primeiro, use uma leitura consistente para consultar a tabela `PARENT` e verifique se a linha pai existe. Você pode inserir com segurança a linha filho na tabela `CHILD`? Não, porque outra sessão pode excluir a linha pai no momento entre seus `SELECT` e seus `INSERT`, sem que você saiba disso.

Para evitar esse problema potencial, realize o `SELECT` usando o `LOCK IN SHARE MODE`:

```sql
SELECT * FROM parent WHERE NAME = 'Jones' LOCK IN SHARE MODE;
```

Após a consulta `LOCK IN SHARE MODE` retornar o registro pai `'Jones'`, você pode adicionar com segurança o registro filho à tabela `CHILD` e confirmar a transação. Qualquer transação que tente adquirir um bloqueio exclusivo na linha aplicável na tabela `PARENT` aguarda até que você termine, ou seja, até que os dados em todas as tabelas estejam em um estado consistente.

Para outro exemplo, considere um campo de contador inteiro em uma tabela `CHILD_CODES`, usado para atribuir um identificador único a cada criança adicionada à tabela `CHILD`. Não use leitura consistente ou leitura em modo compartilhado para ler o valor atual do contador, porque dois usuários do banco de dados poderiam ver o mesmo valor para o contador, e um erro de chave duplicada ocorre se duas transações tentarem adicionar linhas com o mesmo identificador à tabela `CHILD`.

Aqui, `LOCK IN SHARE MODE` não é uma boa solução, porque, se dois usuários leem o contador ao mesmo tempo, pelo menos um deles acaba em situação de bloqueio quando tenta atualizar o contador.

Para implementar a leitura e o incremento do contador, primeiro realize uma leitura de bloqueio do contador usando `FOR UPDATE`, e, em seguida, incremente o contador. Por exemplo:

```sql
SELECT counter_field FROM child_codes FOR UPDATE;
UPDATE child_codes SET counter_field = counter_field + 1;
```

Um `SELECT ... FOR UPDATE` lê os dados disponíveis mais recentes, definindo bloqueios exclusivos em cada linha que lê. Assim, ele define os mesmos bloqueios que um `UPDATE` SQL pesquisado definiria nas linhas.

A descrição anterior é apenas um exemplo de como o `SELECT ... FOR UPDATE` funciona. No MySQL, a tarefa específica de gerar um identificador único pode ser realizada usando apenas uma única consulta à tabela:

```sql
UPDATE child_codes SET counter_field = LAST_INSERT_ID(counter_field + 1);
SELECT LAST_INSERT_ID();
```

A declaração `SELECT` apenas recupera as informações de identificação (específicas para a conexão atual). Não acessa nenhuma tabela.

### 14.7.3 Lâminas definidas por diferentes declarações SQL no InnoDB

Um bloqueio de leitura, um `UPDATE`, ou um `DELETE` geralmente define blocos de registro em cada registro de índice que é analisado no processamento de uma declaração SQL. Não importa se existem condições `WHERE` na declaração que excluiriam a linha. O `InnoDB` não lembra a condição exata `WHERE`, mas apenas sabe quais faixas de índice foram analisadas. Os bloqueios são normalmente bloqueios de próxima chave que também bloqueiam inserções no “espaço” imediatamente antes do registro. No entanto, o bloqueio de espaço pode ser desativado explicitamente, o que faz com que o bloqueio de próxima chave não seja usado. Para mais informações, consulte a Seção 14.7.1, “Bloqueio InnoDB”. O nível de isolamento de transação também pode afetar quais blocos são definidos; consulte a Seção 14.7.2.1, “Níveis de Isolamento de Transação”.

Se um índice secundário for usado em uma pesquisa e os registros do índice a serem definidos forem exclusivos, `InnoDB` também recupera os registros do índice agrupado correspondentes e define bloqueios neles.

Se você não tiver índices adequados para sua declaração e o MySQL precisar percorrer toda a tabela para processar a declaração, cada linha da tabela é bloqueada, o que, por sua vez, bloqueia todas as inserções feitas por outros usuários na tabela. É importante criar bons índices para que suas consultas não percorram mais linhas do que o necessário.

`InnoDB` define os tipos específicos de fechaduras da seguinte forma.

* `SELECT ... FROM` é uma leitura consistente, que lê um instantâneo do banco de dados e não define bloqueios, a menos que o nível de isolamento de transação seja definido como `SERIALIZABLE`. Para o nível `SERIALIZABLE`, a pesquisa define blocos compartilhados de próxima chave nos registros do índice que ela encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para pesquisar uma linha única.

* Para `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`, as chaves são adquiridas para as linhas digitalizadas e esperadas para serem liberadas para as linhas que não se qualificam para inclusão no conjunto de resultados (por exemplo, se não atenderem aos critérios dados na cláusula `WHERE`). No entanto, em alguns casos, as linhas podem não ser desbloqueadas imediatamente porque a relação entre uma linha de resultado e sua fonte original é perdida durante a execução da consulta. Por exemplo, em um `UNION`, linhas digitalizadas (e bloqueadas) de uma tabela podem ser inseridas em uma tabela temporária antes de avaliar se se qualificam para o conjunto de resultados. Nessa circunstância, a relação das linhas na tabela temporária com as linhas na tabela original é perdida e as últimas linhas não são desbloqueadas até o final da execução da consulta.

* `SELECT ... LOCK IN SHARE MODE` define bloqueios de próxima chave compartilhada em todos os registros de índice que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para pesquisar uma linha única.

* `SELECT ... FOR UPDATE` define um bloqueio exclusivo de próxima chave em cada registro que o busca encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

Para registros de índice, a pesquisa encontra, `SELECT ... FOR UPDATE` impede que outras sessões realizem `SELECT ... LOCK IN SHARE MODE` ou leiam em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na visão de leitura.

* `UPDATE ... WHERE ...` define um bloqueio exclusivo de próxima chave em cada registro que o busca encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

* Quando o `UPDATE` modifica um registro de índice agrupado, assegura-se implicitamente que os registros secundários afetados estejam bloqueados. A operação `UPDATE` também assegura blocos compartilhados nos registros secundários afetados ao realizar verificações de verificação de duplicatas antes de inserir novos registros de índice secundário e ao inserir novos registros de índice secundário.

* `DELETE FROM ... WHERE ...` define um bloqueio de próxima chave exclusivo em cada registro que o busca encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

* `INSERT` estabelece um bloqueio exclusivo na linha inserida. Esse bloqueio é um bloqueio de registro de índice, não um bloqueio de próxima chave (ou seja, não há bloqueio de lacuna) e não impede que outras sessões insiram na lacuna antes da linha inserida.

Antes de inserir a linha, um tipo de bloqueio de lacuna chamado bloqueio de lacuna de intenção de inserção é definido. Esse bloqueio sinaliza a intenção de inserir de tal forma que várias transações que inserem no mesmo intervalo de índice não precisam esperar uma da outra se não estiverem inserindo na mesma posição dentro da lacuna. Suponha que haja registros de índice com valores de 4 e 7. Transações separadas que tentam inserir valores de 5 e 6 cada uma bloqueiam a lacuna entre 4 e 7 com bloqueios de intenção de inserção antes de obter o bloqueio exclusivo da linha inserida, mas não se bloqueiam uma à outra porque as linhas não são conflitantes.

Se ocorrer um erro de chave duplicada, um bloqueio compartilhado no registro do índice duplicado é definido. Esse uso de um bloqueio compartilhado pode resultar em um impasse se houver várias sessões tentando inserir a mesma linha se outra sessão já tiver um bloqueio exclusivo. Isso pode ocorrer se outra sessão excluir a linha. Suponha que uma tabela `InnoDB` `t1` tenha a seguinte estrutura:

  ```sql
  CREATE TABLE t1 (i INT, PRIMARY KEY (i)) ENGINE = InnoDB;
  ```

Agora, suponha que três sessões realizem as seguintes operações em ordem:

Sessão 1:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 2:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 3:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 1:

  ```sql
  ROLLBACK;
  ```

A primeira operação da sessão 1 adquire um bloqueio exclusivo para a linha. As operações das sessões 2 e 3 resultam em um erro de chave duplicada e ambas solicitam um bloqueio compartilhado para a linha. Quando a sessão 1 retorna, libera seu bloqueio exclusivo na linha e os pedidos de bloqueio compartilhado em fila para as sessões 2 e 3 são concedidos. Neste ponto, as sessões 2 e 3 entram em deadlock: nenhuma delas pode adquirir um bloqueio exclusivo para a linha devido ao bloqueio compartilhado mantido pela outra.

Uma situação semelhante ocorre se a tabela já contiver uma linha com o valor da chave 1 e três sessões realizarem as seguintes operações em ordem:

Sessão 1:

  ```sql
  START TRANSACTION;
  DELETE FROM t1 WHERE i = 1;
  ```

Sessão 2:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 3:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 1:

  ```sql
  COMMIT;
  ```

A primeira operação da sessão 1 adquire um bloqueio exclusivo para a linha. As operações das sessões 2 e 3 resultam em um erro de chave duplicada e ambas solicitam um bloqueio compartilhado para a linha. Quando a sessão 1 confirma, libera seu bloqueio exclusivo na linha e os pedidos de bloqueio compartilhado em fila para as sessões 2 e 3 são concedidos. Neste ponto, as sessões 2 e 3 entram em deadlock: nenhuma delas pode adquirir um bloqueio exclusivo para a linha devido ao bloqueio compartilhado mantido pela outra.

* `INSERT ... ON DUPLICATE KEY UPDATE` difere de um simples `INSERT` porque uma chave exclusiva é colocada na linha a ser atualizada quando ocorre um erro de chave duplicada. Um bloqueio exclusivo de registro de índice é tomado para um valor de chave primária duplicada. Um bloqueio exclusivo de próxima chave é tomado para um valor de chave única duplicado.

* `REPLACE` é feito como um `INSERT` se não houver colisão em uma chave única. Caso contrário, uma trava exclusiva de próxima chave é colocada na linha a ser substituída.

* `INSERT INTO T SELECT ... FROM S WHERE ...` define um registro de índice exclusivo com bloqueio (sem bloqueio de lacuna) em cada linha inserida em `T`. Se o nível de isolamento de transação é `READ COMMITTED`, ou `innodb_locks_unsafe_for_binlog` está habilitado e o nível de isolamento de transação não é `SERIALIZABLE`, `InnoDB` faz a pesquisa em `S` como uma leitura consistente (sem bloqueios). Caso contrário, `InnoDB` define bloqueios compartilhados de próxima chave em linhas de `S`. `InnoDB` tem que definir bloqueios no último caso: Durante a recuperação de rolagem usando um log binário baseado em declaração, cada declaração SQL deve ser executada exatamente da mesma maneira que foi feita originalmente.

`CREATE TABLE ... SELECT ...` realiza a `SELECT` com bloqueios de próxima chave compartilhados ou como leitura consistente, como para `INSERT ... SELECT`.

Quando um `SELECT` é usado nos construtos `REPLACE INTO t SELECT ... FROM s WHERE ...` ou `UPDATE t ... WHERE col IN (SELECT ... FROM s ...)`, o `InnoDB` define bloqueios compartilhados de próxima chave em linhas da tabela `s`.

* `InnoDB` define um bloqueio exclusivo no final do índice associado à coluna `AUTO_INCREMENT`, ao mesmo tempo em que inicializa uma coluna `AUTO_INCREMENT` especificada anteriormente em uma tabela.

Com `innodb_autoinc_lock_mode=0`, `InnoDB` utiliza um modo especial de bloqueio de tabela `AUTO-INC` onde o bloqueio é obtido e mantido até o final da declaração SQL atual (não até o final de toda a transação) ao acessar o contador de autoincremento. Outros clientes não podem inserir na tabela enquanto o bloqueio da tabela `AUTO-INC` é mantido. O mesmo comportamento ocorre para “inserções em massa” com `innodb_autoinc_lock_mode=1`. Bloqueios de nível de tabela `AUTO-INC` não são usados com `innodb_autoinc_lock_mode=2`. Para mais informações, consulte a Seção 14.6.1.6, “Tratamento de AUTO\_INCREMENT em InnoDB”.

`InnoDB` obtém o valor de uma coluna `AUTO_INCREMENT` previamente inicializada sem definir quaisquer bloqueios.

* Se uma restrição `FOREIGN KEY` for definida em uma tabela, qualquer inserção, atualização ou exclusão que exija que a condição da restrição seja verificada estabelece bloqueios compartilhados em nível de registro nos registros que ela examina para verificar a restrição. `InnoDB` também estabelece esses bloqueios no caso em que a restrição falhe.

* `LOCK TABLES` define bloqueios de tabela, mas é a camada MySQL superior à `InnoDB` que define esses bloqueios. `InnoDB` é consciente dos bloqueios de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada MySQL acima de `InnoDB` sabe sobre bloqueios de nível de linha.

Caso contrário, o detector automático de bloqueio `InnoDB` não consegue detectar bloqueios onde tais bloqueios de tabela estão envolvidos. Além disso, porque, neste caso, a camada superior do MySQL não sabe sobre bloqueios de nível de linha, é possível obter um bloqueio de tabela em uma tabela onde outra sessão atualmente tem bloqueios de nível de linha. No entanto, isso não coloca em risco a integridade da transação, conforme discutido na Seção 14.7.5.2, "Detecção de Bloqueio".

* `LOCK TABLES` adquire dois bloqueios em cada tabela se `innodb_table_locks=1` (padrão). Além de um bloqueio de tabela na camada MySQL, ele também adquire um bloqueio de tabela `InnoDB`. Para evitar adquirir blocos de tabela `InnoDB`, configure `innodb_table_locks=0`. Se nenhum bloqueio de tabela `InnoDB` for adquirido, `LOCK TABLES` é concluído mesmo se alguns registros das tabelas estiverem sendo bloqueados por outras transações.

Em MySQL 5.7, `innodb_table_locks=0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, através de gatilhos) ou por `LOCK TABLES ... READ`.

* Todos os bloqueios `InnoDB` mantidos por uma transação são liberados quando a transação é comprometida ou abortada. Assim, não faz muito sentido invocar `LOCK TABLES` em tabelas `InnoDB` no modo `autocommit=1` porque os bloqueios de tabela `InnoDB` adquiridos seriam liberados imediatamente.

* Não é possível bloquear tabelas adicionais no meio de uma transação, porque `LOCK TABLES` realiza um `COMMIT` e `UNLOCK TABLES` implícitos.

### 14.7.4 Linhas Fantasma

O chamado problema fantasma ocorre em uma transação quando a mesma consulta produz diferentes conjuntos de linhas em diferentes momentos. Por exemplo, se um `SELECT` é executado duas vezes, mas retorna uma linha na segunda vez que não foi retornada na primeira, a linha é uma linha "fantasma".

Suponha que haja um índice na coluna `id` da tabela `child` e que você queira ler e bloquear todas as linhas da tabela que tenham um valor de identificador maior que 100, com a intenção de atualizar alguma coluna nas linhas selecionadas mais tarde:

```sql
SELECT * FROM child WHERE id > 100 FOR UPDATE;
```

A consulta examina o índice a partir do primeiro registro onde `id` é maior que 100. Deixe a tabela conter linhas com valores de `id` de 90 e 102. Se as chaves definidas nos registros do índice no intervalo examinado não bloqueiam inserções feitas nos intervalos (neste caso, o intervalo entre 90 e 102), outra sessão pode inserir uma nova linha na tabela com um `id` de 101. Se você executasse o mesmo `SELECT` dentro da mesma transação, veria uma nova linha com um `id` de 101 (um “fantasma”) no conjunto de resultados retornado pela consulta. Se considerarmos um conjunto de linhas como um item de dados, a nova criança fantasma violaria o princípio de isolamento das transações, que uma transação deve ser capaz de executar para que os dados que ela leu não mudem durante a transação.

Para evitar fantasmas, `InnoDB` utiliza um algoritmo chamado bloqueio de próxima chave que combina o bloqueio de linha de índice com o bloqueio de lacuna. `InnoDB` realiza o bloqueio em nível de linha de forma que, ao pesquisar ou percorrer um índice de tabela, ele define bloqueios compartilhados ou exclusivos nos registros do índice que encontra. Assim, os bloqueios em nível de linha são, na verdade, bloqueios de registro de índice. Além disso, um bloqueio de próxima chave em um registro de índice também afeta a “lacuna” antes do registro de índice. Isso significa que um bloqueio de próxima chave é um bloqueio de registro de índice mais um bloqueio de lacuna na lacuna que precede o registro de índice. Se uma sessão tiver um bloqueio compartilhado ou exclusivo no registro `R` em um índice, outra sessão não pode inserir um novo registro de índice na lacuna imediatamente antes de `R` na ordem do índice.

Quando o `InnoDB` examina um índice, ele também pode bloquear a lacuna após o último registro no índice. Isso mesmo acontece no exemplo anterior: para evitar qualquer inserção na tabela onde o `id` seria maior que 100, os bloqueios definidos pelo `InnoDB` incluem um bloqueio na lacuna após o valor `id` de 102.

Você pode usar o bloqueio de próxima chave para implementar uma verificação de unicidade em sua aplicação: Se você ler seus dados no modo de compartilhamento e não ver um duplicado para uma linha que você vai inserir, então você pode inserir com segurança sua linha e saber que o bloqueio de próxima chave definido no sucessor de sua linha durante a leitura impede que alguém, entretanto, insira um duplicado para sua linha. Assim, o bloqueio de próxima chave permite que você "bloqueie" a não existência de algo em sua tabela.

O bloqueio de lacunas pode ser desativado conforme discutido na Seção 14.7.1, "Bloqueio InnoDB". Isso pode causar problemas fantásticos, pois outras sessões podem inserir novas linhas nas lacunas quando o bloqueio de lacunas é desativado.

### 14.7.5 Bloqueios em InnoDB

Um ponto morto é uma situação em que múltiplas transações não conseguem prosseguir porque cada transação detém um bloqueio que é necessário por outra. Como todas as transações envolvidas estão esperando que o mesmo recurso se torne disponível, nenhuma delas libera o bloqueio que detém.

Um bloqueio pode ocorrer quando as transações bloqueiam linhas em várias tabelas (através de declarações como `UPDATE` ou `SELECT ... FOR UPDATE`, mas na ordem oposta. Um bloqueio também pode ocorrer quando tais declarações bloqueiam intervalos de registros de índice e lacunas, com cada transação adquirindo alguns bloqueios, mas não outros devido a um problema de sincronização. Para um exemplo de bloqueio, consulte a Seção 14.7.5.1, “Um exemplo de bloqueio InnoDB”.

Para reduzir a possibilidade de deadlocks, use transações em vez de declarações `LOCK TABLES`; mantenha as transações que inserem ou atualizam dados pequenas o suficiente para não permanecerem abertas por longos períodos de tempo; quando diferentes transações atualizam múltiplas tabelas ou grandes intervalos de linhas, use a mesma ordem de operações (como `SELECT ... FOR UPDATE`) em cada transação; crie índices nas colunas usadas nas declarações `SELECT ... FOR UPDATE` e `UPDATE ... WHERE`. A possibilidade de deadlocks não é afetada pelo nível de isolamento, porque o nível de isolamento altera o comportamento das operações de leitura, enquanto os deadlocks ocorrem devido a operações de escrita. Para mais informações sobre como evitar e recuperar de condições de deadlocks, consulte a Seção 14.7.5.3, “Como minimizar e lidar com deadlocks”.

Quando a detecção de deadlock é habilitada (o padrão) e um deadlock ocorre, `InnoDB` detecta a condição e desfaz uma das transações (a vítima). Se a detecção de deadlock é desabilitada usando a variável `innodb_deadlock_detect`, `InnoDB` depende da configuração de `innodb_lock_wait_timeout` para desfazer as transações em caso de deadlock. Assim, mesmo que a lógica da sua aplicação esteja correta, você ainda deve lidar com o caso em que uma transação deve ser retornada. Para visualizar o último deadlock em uma transação de usuário `InnoDB`, use `SHOW ENGINE INNODB STATUS`. Se deadlocks frequentes destacam um problema com a estrutura da transação ou o tratamento de erros da aplicação, habilite `innodb_print_all_deadlocks` para imprimir informações sobre todos os deadlocks no `mysqld` log de erro. Para mais informações sobre como deadlocks são detectados e tratados automaticamente, consulte a Seção 14.7.5.2, “Detecção de Deadlock”.

#### 14.7.5.1 Um exemplo de bloqueio de InnoDB

O exemplo a seguir ilustra como um erro pode ocorrer quando um pedido de bloqueio causa um impasse. O exemplo envolve dois clientes, A e B.

Primeiro, o cliente A cria uma tabela contendo uma única linha e, em seguida, inicia uma transação. Dentro da transação, A obtém um bloqueio `S` na linha selecionando-a no modo de compartilhamento:

```sql
mysql> CREATE TABLE t (i INT) ENGINE = InnoDB;
Query OK, 0 rows affected (1.07 sec)

mysql> INSERT INTO t (i) VALUES(1);
Query OK, 1 row affected (0.09 sec)

mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM t WHERE i = 1 LOCK IN SHARE MODE;
+------+
| i    |
+------+
|    1 |
+------+
```

Em seguida, o cliente B inicia uma transação e tenta excluir a linha da tabela:

```sql
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> DELETE FROM t WHERE i = 1;
```

A operação de exclusão requer um bloqueio `X`. O bloqueio não pode ser concedido porque é incompatível com o bloqueio `S` que o cliente A possui, então o pedido fica na fila de solicitações de bloqueio para a linha e o cliente B bloqueia.

Por fim, o cliente A também tenta excluir a linha da tabela:

```sql
mysql> DELETE FROM t WHERE i = 1;
```

O bloqueio ocorre aqui porque o cliente A precisa de um bloqueio `X` para excluir a linha. No entanto, esse pedido de bloqueio não pode ser concedido porque o cliente B já tem um pedido para um bloqueio `X` e está esperando o cliente A liberar seu bloqueio `S`. Além disso, o bloqueio `S` mantido por A não pode ser atualizado para um bloqueio `X` devido ao pedido prévio do B para um bloqueio `X`. Como resultado, `InnoDB` gera um erro para um dos clientes e libera seus bloqueios. O cliente retorna esse erro:

```sql
ERROR 1213 (40001): Deadlock found when trying to get lock;
try restarting transaction
```

Nesse momento, o pedido de bloqueio para o outro cliente pode ser concedido e ele exclui a linha da tabela.

#### 14.7.5.2 Detecção de ponto morto

Quando o rastreamento de bloqueios é ativado (o padrão), `InnoDB` detecta automaticamente bloqueios de transações e desfaz uma transação ou transações para quebrar o bloqueio. `InnoDB` tenta escolher pequenas transações para desfazer, onde o tamanho de uma transação é determinado pelo número de linhas inseridas, atualizadas ou excluídas.

`InnoDB` é consciente das bloqueadoras de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada MySQL acima dela sabe sobre bloqueios em nível de linha. Caso contrário, `InnoDB` não pode detectar deadlocks onde um conjunto de bloqueio de tabela definido por uma declaração MySQL `LOCK TABLES` ou um bloqueio definido por um mecanismo de armazenamento diferente de `InnoDB` está envolvido. Resolva essas situações definindo o valor da variável de sistema `innodb_lock_wait_timeout`.

Se a seção `LATEST DETECTED DEADLOCK` do monitor de saída `InnoDB` incluir uma mensagem que afirma: “BUSCA DEVERIA SER MAIS PROFUNDA OU MAIS LONGA NA TABELA DE LOCK WAITS-FOR, REVERTIREMOS A TRANSACÇÃO”, isso indica que o número de transações na lista de espera atingiu um limite de 200. Uma lista de espera que exceda 200 transações é tratada como um impasse e a transação que tenta verificar a lista de espera é revertida. O mesmo erro também pode ocorrer se o thread de bloqueio precisar olhar para mais de 1.000.000 de bloqueios de propriedade de transações na lista de espera.

Para técnicas de organização de operações de banco de dados para evitar deadlocks, consulte a Seção 14.7.5, "Deadlocks em InnoDB".

##### Desativação da detecção de deadlocks

Em sistemas de alta concorrência, a detecção de bloqueio pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de bloqueio e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um bloqueio. A detecção de bloqueio pode ser desativada usando a variável `innodb_deadlock_detect`.

#### 14.7.5.3 Como minimizar e lidar com deadlocks

Esta seção baseia-se nas informações conceituais sobre bloqueios apresentadas na Seção 14.7.5.2, "Detecção de bloqueios". Ela explica como organizar as operações do banco de dados para minimizar bloqueios e o subsequente tratamento de erros necessário em aplicações.

Os deadlocks são um problema clássico em bancos de dados transacionais, mas não são perigosos a menos que sejam tão frequentes que você não possa executar determinadas transações. Normalmente, você deve escrever seus aplicativos para que eles estejam sempre preparados para reemitir uma transação se ela for revertida devido a um deadlock.

`InnoDB` utiliza bloqueio automático em nível de linha. Você pode obter deadlocks mesmo no caso de transações que apenas inserem ou excluem uma única linha. Isso ocorre porque essas operações não são realmente “atómicas”; elas automaticamente definem bloqueios nos (possíveis vários) registros de índice da linha inserida ou excluída.

Você pode lidar com bloqueios e reduzir a probabilidade de sua ocorrência com as seguintes técnicas:

* Em qualquer momento, emita `SHOW ENGINE INNODB STATUS` para determinar a causa do impasse mais recente. Isso pode ajudá-lo a ajustar seu aplicativo para evitar deadlocks.

* Se os avisos frequentes de bloqueio causarem preocupação, cole informações de depuração mais extensas, habilitando a variável `innodb_print_all_deadlocks`. As informações sobre cada bloqueio, não apenas o último, são registradas no log de erro do MySQL. Desabilite esta opção quando terminar a depuração.

* Sempre esteja preparado para emitir novamente uma transação se ela falhar devido a um impasse. Impasses não são perigosos. Apenas tente novamente.

* Mantenha as transações pequenas e de curta duração para torná-las menos propensas a colisões.

* Realize transações imediatamente após realizar um conjunto de alterações relacionadas para torná-las menos propensas a colisões. Em particular, não deixe uma sessão **mysql** interativa aberta por um longo período com uma transação não comprometida.

* Se você usa leituras de bloqueio (`SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`), tente usar um nível de isolamento mais baixo, como `READ COMMITTED`.

* Ao modificar várias tabelas dentro de uma transação ou diferentes conjuntos de linhas na mesma tabela, realize essas operações em uma ordem consistente cada vez. As transações formam filas bem definidas e não causam bloqueio. Por exemplo, organize as operações do banco de dados em funções dentro do seu aplicativo ou chame rotinas armazenadas, em vez de codificar várias sequências semelhantes de declarações `INSERT`, `UPDATE` e `DELETE` em diferentes lugares.

* Adicione índices bem escolhidos às suas tabelas para que suas consultas variem menos registros de índice e estabeleçam menos bloqueios. Use `EXPLAIN SELECT` para determinar quais índices o servidor MySQL considera os mais apropriados para suas consultas.

* Use menos bloqueio. Se você pode permitir que um `SELECT` retorne dados de um snapshot antigo, não adicione uma cláusula `FOR UPDATE` ou `LOCK IN SHARE MODE` a ele. Usar o nível de isolamento `READ COMMITTED` é bom aqui, porque cada leitura consistente dentro da mesma transação lê de seu próprio snapshot fresco.

* Se nada mais ajudar, realize a serialização das transações com bloqueios de nível de tabela. A maneira correta de usar `LOCK TABLES` com tabelas transacionais, como as tabelas `InnoDB`, é iniciar uma transação com `SET autocommit = 0` (não `START TRANSACTION`) seguido de `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você comunique explicitamente a transação. Por exemplo, se você precisa escrever na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```sql
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

As bloqueadoras de nível de tabela impedem atualizações concorrentes na tabela, evitando deadlocks em detrimento de uma menor capacidade de resposta em um sistema ocupado.

* Outra maneira de serializar transações é criar uma tabela auxiliar de "sinalização" que contenha apenas uma única linha. Faça com que cada transação atualize essa linha antes de acessar outras tabelas. Dessa forma, todas as transações ocorrem de forma serializada. Observe que o algoritmo de detecção de deadlock instantâneo `InnoDB` também funciona nesse caso, porque o bloqueio de serialização é um bloqueio de nível de linha. Com bloqueios de nível de tabela no MySQL, o método de tempo limite deve ser usado para resolver deadlocks.