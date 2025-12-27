### 17.7.1 Bloqueio do InnoDB

Esta seção descreve os tipos de bloqueio usados pelo `InnoDB`.

* Bloqueios Compartilhados e Exclusivos
* Bloqueios de Intenção
* Bloqueios de Registro
* Bloqueios de Lacuna
* Bloqueios de Próxima Chave
* Bloqueios de Intenção de Inserção
* Bloqueios AUTO-INC
* Bloqueios de Predicado para Índices Espaciais

#### Bloqueios Compartilhados e Exclusivos

O `InnoDB` implementa o bloqueio padrão em nível de linha, onde existem dois tipos de bloqueios, bloqueios compartilhados (`S`) e bloqueios exclusivos (`X`).

* Um bloqueio compartilhado (`S`) permite que a transação que detém o bloqueio leia uma linha.

* Um bloqueio exclusivo (`X`) permite que a transação que detém o bloqueio atualize ou exclua uma linha.

Se a transação `T1` detém um bloqueio compartilhado (`S`) na linha `r`, então as solicitações de algumas transações distintas `T2` para um bloqueio na linha `r` são tratadas da seguinte forma:

* Uma solicitação da `T2` para um bloqueio `S` pode ser concedida imediatamente. Como resultado, tanto `T1` quanto `T2` detêm um bloqueio `S` na `r`.

* Uma solicitação da `T2` para um bloqueio `X` não pode ser concedida imediatamente.

Se uma transação `T1` detém um bloqueio exclusivo (`X`) na linha `r`, uma solicitação de alguma transação distinta `T2` para um bloqueio de qualquer tipo na `r` não pode ser concedida imediatamente. Em vez disso, a transação `T2` tem que esperar que a transação `T1` libere seu bloqueio na linha `r`.

#### Bloqueios de Intenção

O `InnoDB` suporta o bloqueio de *diversas granularidades*, que permite a coexistência de bloqueios de linha e bloqueios de tabela. Por exemplo, uma instrução como `LOCK TABLES ... WRITE` assume um bloqueio exclusivo (um bloqueio `X`) na tabela especificada. Para tornar o bloqueio em múltiplas granularidades práticas, o `InnoDB` usa bloqueios de intenção. Bloqueios de intenção são bloqueios de nível de tabela que indicam que tipo de bloqueio (compartilhado ou exclusivo) uma transação requer mais tarde para uma linha em uma tabela. Existem dois tipos de bloqueios de intenção:

* Uma trava de intenção compartilhada (`IS`) indica que uma transação pretende definir uma *trava compartilhada* em linhas individuais de uma tabela.

* Uma trava de intenção exclusiva (`IX`) indica que uma transação pretende definir uma trava exclusiva em linhas individuais de uma tabela.

Por exemplo, `SELECT ... FOR SHARE` define uma trava `IS`, e `SELECT ... FOR UPDATE` define uma trava `IX`.

O protocolo de trava de intenção é o seguinte:

* Antes que uma transação possa adquirir uma trava compartilhada em uma linha de uma tabela, ela deve primeiro adquirir uma trava `IS` ou mais forte na tabela.

* Antes que uma transação possa adquirir uma trava exclusiva em uma linha de uma tabela, ela deve primeiro adquirir uma trava `IX` na tabela.

A compatibilidade do tipo de trava em nível de tabela é resumida na seguinte matriz.

Uma tranqüilidade é concedida a uma transação solicitante se ela for compatível com as tranqüilidades existentes, mas não se ela entrar em conflito com as tranqüilidades existentes. Uma transação aguarda até que a tranqüilidade existente em conflito seja liberada. Se um pedido de tranqüilidade entrar em conflito com uma tranqüilidade existente e não puder ser concedido porque isso causaria um impasse, ocorre um erro.

As tranqüilidades de intenção não bloqueiam nada, exceto solicitações de tabela completa (por exemplo, `LOCK TABLES ... WRITE`). O principal propósito das tranqüilidades de intenção é mostrar que alguém está bloqueando uma linha ou vai bloquear uma linha na tabela.

Os dados da transação para uma tranqüilidade de intenção aparecem de forma semelhante ao seguinte em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```
TABLE LOCK table `test`.`t` trx id 10080 lock mode IX
```

#### Bloqueios de Registro

Um bloqueio de registro é um bloqueio em um registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transação insira, atualize ou exclua linhas onde o valor de `t.c1` é `10`.

Bloqueios de registro sempre bloqueiam registros de índice, mesmo que uma tabela seja definida sem índices. Para esses casos, o `InnoDB` cria um índice agrupado oculto e usa esse índice para o bloqueio de registro. Veja a Seção 17.6.2.1, “Indekses Agrupados e Secundários”.

Os dados da transação para um bloqueio de registro aparecem de forma semelhante ao seguinte em `SHOW ENGINE INNODB STATUS` e na saída do monitor do InnoDB:

```
RECORD LOCKS space id 58 page no 3 n bits 72 index `PRIMARY` of table `test`.`t`
trx id 10078 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 8000000a; asc     ;;
 1: len 6; hex 00000000274f; asc     'O;;
 2: len 7; hex b60000019d0110; asc        ;;
```

#### Bloqueios de Lacuna

Um bloqueio de lacuna é um bloqueio em uma lacuna entre registros de índice, ou um bloqueio na lacuna antes do primeiro ou após o último registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 e 20 FOR UPDATE;` impede que outras transações insiram um valor de `15` na coluna `t.c1`, independentemente de já haver algum valor desse tipo na coluna, porque as lacunas entre todos os valores existentes na faixa estão bloqueadas.

Uma lacuna pode abranger um único valor de índice, múltiplos valores de índice ou até mesmo estar vazia.

Bloqueios de lacuna fazem parte da compensação entre desempenho e concorrência e são usados em alguns níveis de isolamento de transação e não em outros.

O bloqueio de lacuna não é necessário para instruções que bloqueiam linhas usando um índice único para buscar uma linha única. (Isso não inclui o caso em que a condição de busca inclui apenas algumas colunas de um índice único de múltiplas colunas; nesse caso, o bloqueio de lacuna ocorre.) Por exemplo, se a coluna `id` tiver um índice único, a seguinte instrução usa apenas um bloqueio de registro de índice para a linha com o valor de `id` 100 e não importa se outras sessões inserem linhas na lacuna anterior:

```
SELECT * FROM child WHERE id = 100;
```

Se o `id` não estiver indexado ou tiver um índice não único, a instrução bloqueia o intervalo anterior.

Vale ressaltar aqui que bloqueios conflitantes podem ser mantidos em um intervalo por diferentes transações. Por exemplo, a transação A pode manter um bloqueio de intervalo compartilhado (bloqueio S do intervalo) em um intervalo, enquanto a transação B mantém um bloqueio de intervalo exclusivo (bloqueio X do intervalo) no mesmo intervalo. A razão pela qual bloqueios de intervalo conflitantes são permitidos é que, se um registro for excluído de um índice, os bloqueios de intervalo mantidos no registro por diferentes transações devem ser unidos.

Os bloqueios de intervalo em `InnoDB` são “puramente inibitivos”, o que significa que seu único propósito é impedir que outras transações insiram no intervalo. Os bloqueios de intervalo podem coexistir. Um bloqueio de intervalo tomado por uma transação não impede que outra transação tome um bloqueio de intervalo no mesmo intervalo. Não há diferença entre bloqueios de intervalo compartilhados e exclusivos. Eles não se conflituam entre si e desempenham a mesma função.

O bloqueio de intervalo pode ser desativado explicitamente. Isso ocorre se você alterar o nível de isolamento da transação para `READ COMMITTED`. Nesse caso, o bloqueio de intervalo é desativado para pesquisas e varreduras de índice e é usado apenas para verificar restrições de chave estrangeira e verificação de chave duplicada.

Há também outros efeitos do uso do nível de isolamento `READ COMMITTED`. Os bloqueios de registro para linhas não correspondentes são liberados após o MySQL ter avaliado a condição `WHERE`. Para as instruções `UPDATE`, o `InnoDB` realiza uma leitura “semi-consistente”, de modo que ele retorna a versão mais recente comprometida ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` da `UPDATE`.

#### Bloqueios de Próxima Chave

Um bloqueio de próxima chave é uma combinação de um bloqueio de registro em um registro de índice e um bloqueio de intervalo no intervalo antes do registro de índice.

O `InnoDB` realiza o bloqueio a nível de linha de forma que, ao pesquisar ou percorrer um índice de tabela, ele define bloqueios compartilhados ou exclusivos nos registros do índice que encontrar. Assim, os bloqueios a nível de linha são, na verdade, bloqueios de registro de índice. Um bloqueio de próxima chave em um registro de índice também afeta o "gap" antes desse registro de índice. Ou seja, um bloqueio de próxima chave é um bloqueio de registro de índice mais um bloqueio de gap no gap que precede o registro de índice. Se uma sessão tiver um bloqueio compartilhado ou exclusivo no registro `R` em um índice, outra sessão não pode inserir um novo registro de índice no gap imediatamente antes de `R` na ordem do índice.

Suponha que um índice contenha os valores 10, 11, 13 e 20. Os possíveis bloqueios de próxima chave para esse índice cobrem os seguintes intervalos, onde um parêntese redondo denota a exclusão do ponto final do intervalo e um parêntese quadrado denota a inclusão do ponto final:

```
(negative infinity, 10]
(10, 11]
(11, 13]
(13, 20]
(20, positive infinity)
```

Para o último intervalo, o bloqueio de próxima chave bloqueia o gap acima do maior valor no índice e o pseudo-registro "supremum" com um valor maior que qualquer valor realmente no índice. O supremum não é um registro de índice real, então, na verdade, este bloqueio de próxima chave bloqueia apenas o gap que segue o maior valor de índice.

Por padrão, o `InnoDB` opera no nível de isolamento de transação `REPEATABLE READ`. Neste caso, o `InnoDB` usa bloqueios de próxima chave para pesquisas e varreduras de índice, o que previne linhas fantasmas (veja a Seção 17.7.4, "Linhas Fantasmas").

Os dados da transação para um bloqueio de próxima chave aparecem de forma semelhante ao seguinte em `SHOW ENGINE INNODB STATUS` e na saída do monitor do InnoDB:

```
RECORD LOCKS space id 58 page no 3 n bits 72 index `PRIMARY` of table `test`.`t`
trx id 10080 lock_mode X
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;

Record lock, heap no 2 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 8000000a; asc     ;;
 1: len 6; hex 00000000274f; asc     'O;;
 2: len 7; hex b60000019d0110; asc        ;;
```

#### Bloqueios de Intenção de Inserção
```
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

Um bloqueio de intenção de inserção é um tipo de bloqueio de lacuna estabelecido por operações `INSERT` antes da inserção de linha. Esse bloqueio sinaliza a intenção de inserir de tal forma que várias transações que inserem no mesmo intervalo de índice não precisam esperar uma da outra se não estiverem inserindo na mesma posição dentro da lacuna. Suponha que existam registros de índice com valores de 4 e 7. Transações separadas que tentam inserir valores de 5 e 6, respectivamente, bloqueiam a lacuna entre 4 e 7 com bloqueios de intenção de inserção antes de obter o bloqueio exclusivo da linha inserida, mas não se bloqueiam uma à outra porque as linhas não são conflitantes.

O exemplo seguinte demonstra uma transação que toma um bloqueio de intenção de inserção antes de obter um bloqueio exclusivo do registro inserido. O exemplo envolve dois clientes, A e B.

O cliente A cria uma tabela contendo dois registros de índice (90 e 102) e então inicia uma transação que coloca um bloqueio exclusivo nos registros de índice com um ID maior que 100. O bloqueio exclusivo inclui um bloqueio de lacuna antes do registro 102:

```
mysql> START TRANSACTION;
mysql> INSERT INTO child (id) VALUES (101);
```

O cliente B começa uma transação para inserir um registro na lacuna. A transação toma um bloqueio de intenção de inserção enquanto espera obter um bloqueio exclusivo.

```
RECORD LOCKS space id 31 page no 3 n bits 72 index `PRIMARY` of table `test`.`child`
trx id 8731 lock_mode X locks gap before rec insert intention waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000066; asc    f;;
 1: len 6; hex 000000002215; asc     " ;;
 2: len 7; hex 9000000172011c; asc     r  ;;...
```

Os dados da transação para um bloqueio de intenção de inserção aparecem de forma semelhante ao seguinte em `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:



#### Bloqueios AUTO-INC

Um bloqueio `AUTO-INC` é um bloqueio especial de nível de tabela tomado por transações que inserem em tabelas com colunas `AUTO_INCREMENT`. No caso mais simples, se uma transação está inserindo valores na tabela, qualquer outra transação deve esperar para fazer suas próprias inserções naquela tabela, para que as linhas inseridas pela primeira transação recebam valores consecutivos da chave primária.

A variável `innodb_autoinc_lock_mode` controla o algoritmo usado para o bloqueio de autoincremento. Ela permite que você escolha como equilibrar entre sequências previsíveis de valores de autoincremento e concorrência máxima para operações de inserção.

Para mais informações, consulte a Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT no InnoDB”.

#### Bloqueios de Predicado para Índices Espaciais

O `InnoDB` suporta o índice `SPATIAL` de colunas que contêm dados espaciais (veja a Seção 13.4.9, “Otimização da Análise Espacial”).

Para lidar com o bloqueio de operações que envolvem índices `SPATIAL`, o bloqueio de próxima chave não funciona bem para suportar os níveis de isolamento de transação `REPEATABLE READ` ou `SERIALIZABLE`. Não há um conceito de ordem absoluta em dados multidimensionais, então não está claro qual é a chave “próxima”.

Para habilitar o suporte aos níveis de isolamento para tabelas com índices `SPATIAL`, o `InnoDB` usa bloqueios de predicado. Um índice `SPATIAL` contém valores de retângulo de delimitação mínima (MBR), então o `InnoDB` impõe uma leitura consistente no índice ao definir um bloqueio de predicado no valor MBR usado para uma consulta. Outras transações não podem inserir ou modificar uma linha que corresponderia à condição da consulta.