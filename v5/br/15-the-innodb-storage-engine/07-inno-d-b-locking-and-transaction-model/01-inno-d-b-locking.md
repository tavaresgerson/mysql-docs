### 14.7.1 Bloqueio do InnoDB

Esta seção descreve os tipos de bloqueio usados pelo `InnoDB`.

- Lâminas de fechamento compartilhadas e exclusivas
- Bloqueios de intenção
- Bloqueios de gravação
- Fechaduras de lacuna
- Fechaduras Next-Key
- Insira bloqueios de intenção
- Auto-Inc Locks
- Lås de predicado para índices espaciais

#### Lâminas de fechamento compartilhadas e exclusivas

O `InnoDB` implementa o bloqueio padrão em nível de linha, onde existem dois tipos de bloqueios: bloqueios compartilhados (`S`) e bloqueios exclusivos (`X`).

- Uma trava compartilhada (`S`) permite que a transação que mantém a trava leia uma linha.

- Um bloqueio exclusivo (`X`) permite que a transação que mantém o bloqueio atualize ou exclua uma linha.

Se a transação `T1` tiver um bloqueio compartilhado (`S`) na linha `r`, os pedidos de algumas transações distintas `T2` para um bloqueio na linha `r` serão tratados da seguinte forma:

- Um pedido do `T2` para um bloqueio `S` pode ser concedido imediatamente. Como resultado, tanto o `T1` quanto o `T2` possuem um bloqueio `S` em `r`.

- Um pedido do `T2` para um bloqueio `X` não pode ser concedido imediatamente.

Se uma transação `T1` tiver um bloqueio exclusivo (`X`) na linha `r`, um pedido de algum tipo de bloqueio de transação `T2` na `r` não pode ser concedido imediatamente. Em vez disso, a transação `T2` tem que esperar que a transação `T1` libere seu bloqueio na linha `r`.

#### Bloqueios de intenção

O `InnoDB` suporta o bloqueio de *diversas granularidades*, o que permite a coexistência de bloqueios de linhas e bloqueios de tabelas. Por exemplo, uma instrução como `LOCK TABLES ... WRITE` obtém um bloqueio exclusivo (um bloqueio `X`) na tabela especificada. Para tornar o bloqueio em vários níveis de granularidade prático, o `InnoDB` usa bloqueios de intenção. Bloqueios de intenção são bloqueios de nível de tabela que indicam que tipo de bloqueio (compartilhado ou exclusivo) uma transação requer posteriormente para uma linha em uma tabela. Existem dois tipos de bloqueios de intenção:

- Uma intenção de bloqueio compartilhado (`IS`) indica que uma transação pretende definir um *bloqueio compartilhado* em linhas individuais de uma tabela.

- Um bloqueio de intenção exclusiva (`IX`) indica que uma transação pretende definir um bloqueio exclusivo em linhas individuais de uma tabela.

Por exemplo, `SELECT ... LOCK IN SHARE MODE` define um bloqueio `IS` e `SELECT ... FOR UPDATE` define um bloqueio `IX`.

O protocolo de bloqueio de intenção é o seguinte:

- Antes que uma transação possa adquirir um bloqueio compartilhado em uma linha de uma tabela, ela deve primeiro adquirir um bloqueio `IS` ou um bloqueio mais forte na tabela.

- Antes que uma transação possa obter um bloqueio exclusivo em uma linha de uma tabela, ela deve primeiro obter um bloqueio `IX` na tabela.

A compatibilidade do tipo de bloqueio de nível de tabela é resumida na seguinte matriz.

<table summary='A matrix showing table-level lock type compatibility. Each cell in the matrix is marked as either "Compatible" or "Conflict".'><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col"></th> <th scope="col">[[<code>X</code>]]</th> <th scope="col">[[<code>IX</code>]]</th> <th scope="col">[[<code>S</code>]]</th> <th scope="col">[[<code>IS</code>]]</th> </tr></thead><tbody><tr> <th scope="row">[[<code>X</code>]]</th> <td>Conflitos</td> <td>Conflitos</td> <td>Conflitos</td> <td>Conflitos</td> </tr><tr> <th scope="row">[[<code>IX</code>]]</th> <td>Conflitos</td> <td>Compatível</td> <td>Conflitos</td> <td>Compatível</td> </tr><tr> <th scope="row">[[<code>S</code>]]</th> <td>Conflitos</td> <td>Conflitos</td> <td>Compatível</td> <td>Compatível</td> </tr><tr> <th scope="row">[[<code>IS</code>]]</th> <td>Conflitos</td> <td>Compatível</td> <td>Compatível</td> <td>Compatível</td> </tr></tbody></table>

Um bloqueio é concedido a uma transação solicitante se for compatível com os bloqueios existentes, mas não se houver conflito com eles. A transação aguarda até que o bloqueio existente em conflito seja liberado. Se um pedido de bloqueio entrar em conflito com um bloqueio existente e não puder ser concedido porque causaria um impasse, ocorrerá um erro.

Os bloqueios de intenção não bloqueiam nada, exceto solicitações de tabela completa (por exemplo, `LOCK TABLES ... WRITE`). O principal objetivo dos bloqueios de intenção é mostrar que alguém está bloqueando uma linha ou vai bloquear uma linha na tabela.

Os dados de transação para uma bloqueio de intenção parecem semelhantes ao seguinte em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
TABLE LOCK table `test`.`t` trx id 10080 lock mode IX
```

#### Bloqueios de gravação

Um bloqueio de registro é um bloqueio em um registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transação insira, atualize ou exclua linhas onde o valor de `t.c1` é `10`.

Os registros de bloqueio sempre bloqueiam os registros de índice, mesmo que uma tabela seja definida sem índices. Para esses casos, o `InnoDB` cria um índice agrupado oculto e usa esse índice para o bloqueio de registros. Veja a Seção 14.6.2.1, “Indekses Agrupados e Secundários”.

Os dados de transação para um bloqueio de registro aparecem semelhantes ao seguinte em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
RECORD LOCKS space id 58 page no 3 n bits 72 index `PRIMARY` of table `test`.`t`
trx id 10078 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 8000000a; asc     ;;
 1: len 6; hex 00000000274f; asc     'O;;
 2: len 7; hex b60000019d0110; asc        ;;
```

#### Fechaduras de lacuna

Um bloqueio de lacuna é um bloqueio em uma lacuna entre registros de índice ou um bloqueio na lacuna antes do primeiro ou após o último registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 e 20 FOR UPDATE;` impede que outras transações insiram um valor de `15` na coluna `t.c1`, independentemente de já existir algum valor nesse intervalo, porque as lacunas entre todos os valores existentes no intervalo estão bloqueadas.

Uma lacuna pode abranger um único valor de índice, vários valores de índice ou até mesmo estar vazia.

Os bloqueios de lacuna fazem parte da troca entre desempenho e concorrência e são usados em alguns níveis de isolamento de transações e não em outros.

O bloqueio de lacuna não é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única. (Isso não inclui o caso em que a condição de busca inclui apenas algumas colunas de um índice único de múltiplas colunas; nesse caso, o bloqueio de lacuna ocorre.) Por exemplo, se a coluna `id` tiver um índice único, a seguinte declaração usa apenas um bloqueio de registro de índice para a linha com o valor `id` 100 e não importa se outras sessões inserem linhas no intervalo anterior:

```sql
SELECT * FROM child WHERE id = 100;
```

Se o `id` não estiver indexado ou tiver um índice não único, a instrução bloqueia a lacuna anterior.

Vale ressaltar aqui que tranças conflitantes podem ser mantidas em uma lacuna por diferentes transações. Por exemplo, a transação A pode manter uma trança de lacuna compartilhada (trança S) na lacuna, enquanto a transação B mantém uma trança de lacuna exclusiva (trança X) na mesma lacuna. A razão pela qual tranças de lacuna conflitantes são permitidas é que, se um registro for purgado de um índice, as tranças de lacuna mantidas no registro por diferentes transações devem ser unificadas.

Os bloqueios de lacuna em `InnoDB` são “pura e simplesmente inibidores”, o que significa que seu único propósito é impedir que outras transações insiram na lacuna. Bloqueios de lacuna podem coexistir. Um bloqueio de lacuna tomado por uma transação não impede que outra transação tome um bloqueio de lacuna na mesma lacuna. Não há diferença entre bloqueios de lacuna compartilhados e exclusivos. Eles não se contradizem e desempenham a mesma função.

O bloqueio de lacunas pode ser desativado explicitamente. Isso ocorre se você alterar o nível de isolamento de transação para `READ COMMITTED` ou ativar a variável de sistema `innodb_locks_unsafe_for_binlog` (que agora está desatualizada). Nesse caso, o bloqueio de lacunas é desativado para pesquisas e varreduras de índices e é usado apenas para verificação de restrições de chave estrangeira e verificação de chaves duplicadas.

Há também outros efeitos ao usar o nível de isolamento `READ COMMITTED` ou ao habilitar `innodb_locks_unsafe_for_binlog`. As bloqueadoras de registro para linhas não correspondentes são liberadas após o MySQL ter avaliado a condição `WHERE`. Para as instruções `UPDATE`, o `InnoDB` realiza uma leitura “semi-consistente”, de modo que ele retorna a versão mais recente comprometida ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` da instrução `UPDATE`.

#### Fechaduras Next-Key

Uma trava de próxima chave é uma combinação de uma trava de registro no registro do índice e uma trava de lacuna na lacuna antes do registro do índice.

O `InnoDB` realiza o bloqueio de nível de linha de maneira que, ao pesquisar ou percorrer um índice de tabela, ele define bloqueios compartilhados ou exclusivos nos registros do índice que encontrar. Assim, os bloqueios de nível de linha são, na verdade, bloqueios de registro de índice. Um bloqueio de próxima chave em um registro de índice também afeta o "espaço" antes desse registro de índice. Ou seja, um bloqueio de próxima chave é um bloqueio de registro de índice mais um bloqueio de espaço no espaço que precede o registro de índice. Se uma sessão tiver um bloqueio compartilhado ou exclusivo no registro `R` em um índice, outra sessão não pode inserir um novo registro de índice no espaço imediatamente antes de `R` na ordem do índice.

Suponha que um índice contenha os valores 10, 11, 13 e 20. As possíveis chaves subsequentes para este índice cobrem os seguintes intervalos, onde um parêntese redondo denota a exclusão do ponto final do intervalo e um parêntese quadrado denota a inclusão do ponto final:

```sql
(negative infinity, 10]
(10, 11]
(11, 13]
(13, 20]
(20, positive infinity)
```

Para o último intervalo, o bloqueio de chave seguinte fecha a lacuna acima do maior valor no índice e o pseudorecord "supremum" com um valor maior que qualquer valor realmente no índice. O supremum não é um registro real do índice, então, na verdade, este bloqueio de chave seguinte fecha apenas a lacuna após o maior valor do índice.

Por padrão, o `InnoDB` opera no nível de isolamento de transação `REPEATABLE READ`. Nesse caso, o `InnoDB` usa bloqueios de próximo-chave para pesquisas e varreduras de índices, o que impede linhas fantasmas (veja a Seção 14.7.4, “Linhas Fantasmas”).

Os dados de transação para um bloqueio de próxima chave parecem semelhantes aos seguintes em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

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

#### Insira bloqueios de intenção

Um bloqueio de intenção de inserção é um tipo de conjunto de bloqueios de lacuna definido por operações `INSERT` antes da inserção de linha. Esse bloqueio sinaliza a intenção de inserir de tal forma que múltiplas transações que inserem no mesmo intervalo de índice não precisam esperar umas pelas outras se não estiverem inserindo na mesma posição dentro da lacuna. Suponha que existam registros de índice com valores de 4 e 7. Transações separadas que tentam inserir valores de 5 e 6, respectivamente, bloqueiam a lacuna entre 4 e 7 com bloqueios de intenção de inserção antes de obter o bloqueio exclusivo da linha inserida, mas não se bloqueiam umas às outras porque as linhas não são conflitantes.

O exemplo a seguir demonstra uma transação que assume uma bloqueadora de intenção de inserção antes de obter uma bloqueadora exclusiva no registro inserido. O exemplo envolve dois clientes, A e B.

O cliente A cria uma tabela contendo dois registros de índice (90 e 102) e, em seguida, inicia uma transação que coloca um bloqueio exclusivo nos registros de índice com uma ID maior que 100. O bloqueio exclusivo inclui um bloqueio de lacuna antes do registro 102:

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

O cliente B inicia uma transação para inserir um registro na lacuna. A transação assume um bloqueio de intenção de inserção enquanto aguarda para obter um bloqueio exclusivo.

```sql
mysql> START TRANSACTION;
mysql> INSERT INTO child (id) VALUES (101);
```

Os dados de transação para uma intenção de bloqueio de inserção aparecem semelhantes aos seguintes em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
RECORD LOCKS space id 31 page no 3 n bits 72 index `PRIMARY` of table `test`.`child`
trx id 8731 lock_mode X locks gap before rec insert intention waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000066; asc    f;;
 1: len 6; hex 000000002215; asc     " ;;
 2: len 7; hex 9000000172011c; asc     r  ;;...
```

#### Auto-Inc Locks

Um bloqueio `AUTO-INC` é um bloqueio especial de nível de tabela tomado por transações que inserem valores em tabelas com colunas `AUTO_INCREMENT`. No caso mais simples, se uma transação está inserindo valores na tabela, qualquer outra transação deve esperar para fazer suas próprias inserções naquela tabela, para que as linhas inseridas pela primeira transação recebam valores consecutivos da chave primária.

A variável `innodb_autoinc_lock_mode` controla o algoritmo usado para o bloqueio de autoincremento. Ela permite que você escolha como equilibrar entre sequências previsíveis de valores de autoincremento e a concorrência máxima para operações de inserção.

Para obter mais informações, consulte a Seção 14.6.1.6, “Tratamento do AUTO\_INCREMENT no InnoDB”.

#### Lås de predicado para índices espaciais

O `InnoDB` suporta a indexação `SPATIAL` de colunas que contêm dados espaciais (veja a Seção 11.4.8, “Otimizando Análise Espacial”).

Para lidar com o bloqueio de operações que envolvem índices `SPATIAL`, o bloqueio de próxima chave não funciona bem para suportar os níveis de isolamento de transação `REPEATABLE READ` ou `SERIALIZABLE`. Não há um conceito de ordem absoluta em dados multidimensionais, então não está claro qual é a chave “próxima”.

Para permitir o suporte a níveis de isolamento para tabelas com índices `SPATIAL`, o `InnoDB` utiliza bloqueios de predicado. Um índice `SPATIAL` contém valores de retângulo de delimitação mínima (MBR), portanto, o `InnoDB` impõe uma leitura consistente no índice ao definir um bloqueio de predicado no valor do MBR usado para uma consulta. Outras transações não podem inserir ou modificar uma linha que corresponda à condição da consulta.
