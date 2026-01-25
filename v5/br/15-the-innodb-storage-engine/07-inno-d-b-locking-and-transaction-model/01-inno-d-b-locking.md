### 14.7.1 Bloqueio do InnoDB

Esta seção descreve os tipos de lock usados pelo `InnoDB`.

* Locks Compartilhados e Exclusivos
* Locks de Intenção
* Locks de Registro (Record Locks)
* Locks de Gap (Gap Locks)
* Locks de Próxima Chave (Next-Key Locks)
* Locks de Intenção de Inserção
* Locks AUTO-INC
* Locks de Predicado para Indexes Espaciais

#### Locks Compartilhados e Exclusivos

O `InnoDB` implementa o locking padrão de nível de linha, onde existem dois tipos de locks: locks compartilhados (`S`) e locks exclusivos (`X`).

* Um lock compartilhado (`S`) permite que a transaction que detém o lock leia uma linha.

* Um lock exclusivo (`X`) permite que a transaction que detém o lock atualize ou exclua uma linha.

Se a transaction `T1` detém um lock compartilhado (`S`) na linha `r`, as solicitações de alguma transaction distinta `T2` por um lock na linha `r` são tratadas da seguinte forma:

* Uma solicitação de `T2` por um lock `S` pode ser concedida imediatamente. Como resultado, tanto `T1` quanto `T2` detêm um lock `S` em `r`.

* Uma solicitação de `T2` por um lock `X` não pode ser concedida imediatamente.

Se uma transaction `T1` detém um lock exclusivo (`X`) na linha `r`, uma solicitação de alguma transaction distinta `T2` por um lock de qualquer tipo em `r` não pode ser concedida imediatamente. Em vez disso, a transaction `T2` deve esperar que a transaction `T1` libere seu lock na linha `r`.

#### Locks de Intenção

O `InnoDB` suporta *locking de granularidade múltipla*, o que permite a coexistência de locks de linha e locks de tabela. Por exemplo, uma instrução como `LOCK TABLES ... WRITE` adquire um lock exclusivo (um lock `X`) na tabela especificada. Para tornar o locking em múltiplos níveis de granularidade prático, o `InnoDB` usa locks de intenção. Locks de intenção são locks de nível de tabela que indicam qual tipo de lock (compartilhado ou exclusivo) uma transaction exigirá posteriormente para uma linha na tabela. Existem dois tipos de locks de intenção:

* Um lock de intenção compartilhada (`IS`) indica que uma transaction pretende definir um lock *compartilhado* em linhas individuais de uma tabela.

* Um lock de intenção exclusiva (`IX`) indica que uma transaction pretende definir um lock exclusivo em linhas individuais de uma tabela.

Por exemplo, `SELECT ... LOCK IN SHARE MODE` define um lock `IS`, e `SELECT ... FOR UPDATE` define um lock `IX`.

O protocolo de locking de intenção é o seguinte:

* Antes que uma transaction possa adquirir um lock compartilhado em uma linha de uma tabela, ela deve primeiro adquirir um lock `IS` ou mais forte na tabela.

* Antes que uma transaction possa adquirir um lock exclusivo em uma linha de uma tabela, ela deve primeiro adquirir um lock `IX` na tabela.

A compatibilidade do tipo de lock em nível de tabela é resumida na matriz a seguir.

<table summary='Uma matriz mostrando a compatibilidade do tipo de lock em nível de tabela. Cada célula na matriz é marcada como "Compatível" ou "Conflito".'><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th></th> <th><code>X</code></th> <th><code>IX</code></th> <th><code>S</code></th> <th><code>IS</code></th> </tr></thead><tbody><tr> <th><code>X</code></th> <td>Conflito</td> <td>Conflito</td> <td>Conflito</td> <td>Conflito</td> </tr><tr> <th><code>IX</code></th> <td>Conflito</td> <td>Compatível</td> <td>Conflito</td> <td>Compatível</td> </tr><tr> <th><code>S</code></th> <td>Conflito</td> <td>Conflito</td> <td>Compatível</td> <td>Compatível</td> </tr><tr> <th><code>IS</code></th> <td>Conflito</td> <td>Compatível</td> <td>Compatível</td> <td>Compatível</td> </tr></tbody></table>

Um lock é concedido a uma transaction solicitante se for compatível com os locks existentes, mas não se entrar em conflito com os locks existentes. Uma transaction espera até que o lock existente conflitante seja liberado. Se uma solicitação de lock conflitar com um lock existente e não puder ser concedida porque causaria um deadlock, ocorrerá um erro.

Locks de intenção não bloqueiam nada, exceto solicitações de tabela inteira (por exemplo, `LOCK TABLES ... WRITE`). O principal objetivo dos locks de intenção é mostrar que alguém está bloqueando uma linha, ou irá bloquear uma linha na tabela.

Os dados de transaction para um lock de intenção aparecem de forma semelhante ao seguinte no `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
TABLE LOCK table `test`.`t` trx id 10080 lock mode IX
```

#### Locks de Registro (Record Locks)

Um lock de registro é um lock em um registro de Index. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transaction insira, atualize ou exclua linhas onde o valor de `t.c1` seja `10`.

Os locks de registro sempre bloqueiam registros de Index, mesmo que uma tabela seja definida sem Indexes. Nesses casos, o `InnoDB` cria um Index clusterizado oculto e usa este Index para locking de registro. Consulte a Seção 14.6.2.1, “Indexes Clusterizados e Secundários”.

Os dados de transaction para um lock de registro aparecem de forma semelhante ao seguinte no `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
RECORD LOCKS space id 58 page no 3 n bits 72 index `PRIMARY` of table `test`.`t`
trx id 10078 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 8000000a; asc     ;;
 1: len 6; hex 00000000274f; asc     'O;;
 2: len 7; hex b60000019d0110; asc        ;;
```

#### Locks de Gap (Gap Locks)

Um gap lock é um lock em um gap entre registros de Index, ou um lock no gap antes do primeiro ou depois do último registro de Index. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;` impede que outras transactions insiram um valor de `15` na coluna `t.c1`, independentemente de já existir tal valor na coluna, porque os gaps entre todos os valores existentes no range são bloqueados.

Um gap pode abranger um único valor de Index, múltiplos valores de Index, ou até mesmo estar vazio.

Gap locks fazem parte da compensação entre performance e concurrency e são usados em alguns níveis de isolation de transaction e não em outros.

O Gap locking não é necessário para instruções que bloqueiam linhas usando um Index único para procurar uma linha única. (Isso não inclui o caso em que a condição de busca inclui apenas algumas colunas de um Index único de múltiplas colunas; nesse caso, o Gap locking ocorre.) Por exemplo, se a coluna `id` tiver um Index único, a instrução a seguir usa apenas um lock de registro de Index para a linha com valor `id` 100 e não importa se outras sessions inserem linhas no gap precedente:

```sql
SELECT * FROM child WHERE id = 100;
```

Se `id` não for indexado ou tiver um Index não exclusivo, a instrução bloqueia o gap precedente.

Vale a pena notar também que locks conflitantes podem ser mantidos em um gap por transactions diferentes. Por exemplo, a transaction A pode manter um shared gap lock (gap S-lock) em um gap enquanto a transaction B detém um exclusive gap lock (gap X-lock) no mesmo gap. O motivo pelo qual locks de gap conflitantes são permitidos é que, se um registro for purgado de um Index, os gap locks mantidos no registro por transactions diferentes devem ser mesclados.

Os gap locks no `InnoDB` são “puramente inibitórios”, o que significa que seu único propósito é impedir que outras transactions insiram no gap. Os gap locks podem coexistir. Um gap lock adquirido por uma transaction não impede que outra transaction adquira um gap lock no mesmo gap. Não há diferença entre gap locks compartilhados e exclusivos. Eles não entram em conflito entre si e executam a mesma função.

O Gap locking pode ser desativado explicitamente. Isso ocorre se você alterar o nível de isolation de transaction para `READ COMMITTED` ou habilitar a variável de sistema `innodb_locks_unsafe_for_binlog` (que agora está obsoleta). Neste caso, o Gap locking é desativado para buscas e Index scans e é usado apenas para verificação de restrições de Foreign Key e verificação de chaves duplicadas.

Existem também outros efeitos do uso do nível de isolation `READ COMMITTED` ou da habilitação de `innodb_locks_unsafe_for_binlog`. Locks de registro para linhas não correspondentes são liberados depois que o MySQL avaliou a condição `WHERE`. Para instruções `UPDATE`, o `InnoDB` faz uma leitura “semi-consistente”, de modo que retorna a versão mais recente confirmada (committed) ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`.

#### Locks de Próxima Chave (Next-Key Locks)

Um next-key lock é uma combinação de um lock de registro no registro de Index e um gap lock no gap antes do registro de Index.

O `InnoDB` executa o locking no nível de linha de tal forma que, ao buscar ou escanear um Index de tabela, ele define locks compartilhados ou exclusivos nos registros de Index que encontra. Assim, os locks de nível de linha são, na verdade, locks de registro de Index. Um next-key lock em um registro de Index também afeta o “gap” antes desse registro de Index. Ou seja, um next-key lock é um lock de registro de Index mais um gap lock no gap que precede o registro de Index. Se uma session tiver um lock compartilhado ou exclusivo no registro `R` em um Index, outra session não poderá inserir um novo registro de Index no gap imediatamente anterior a `R` na ordem do Index.

Suponha que um Index contenha os valores 10, 11, 13 e 20. Os next-key locks possíveis para este Index cobrem os seguintes intervalos, onde um parêntese redondo denota exclusão do ponto final do intervalo e um colchete denota inclusão do ponto final:

```sql
(negative infinity, 10]
(10, 11]
(11, 13]
(13, 20]
(20, positive infinity)
```

Para o último intervalo, o next-key lock bloqueia o gap acima do maior valor no Index e o pseudo-registro “supremum” que tem um valor superior a qualquer valor realmente presente no Index. O supremum não é um registro de Index real, então, na verdade, este next-key lock bloqueia apenas o gap após o maior valor de Index.

Por padrão, o `InnoDB` opera no nível de isolation de transaction `REPEATABLE READ`. Neste caso, o `InnoDB` usa next-key locks para buscas e Index scans, o que evita linhas fantasma (consulte a Seção 14.7.4, “Linhas Fantasma”).

Os dados de transaction para um next-key lock aparecem de forma semelhante ao seguinte no `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

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

#### Locks de Intenção de Inserção

Um lock de intenção de inserção é um tipo de gap lock definido por operações `INSERT` antes da inserção da linha. Este lock sinaliza a intenção de inserir de tal forma que múltiplas transactions inserindo no mesmo gap de Index não precisam esperar umas pelas outras se não estiverem inserindo na mesma posição dentro do gap. Suponha que existam registros de Index com valores 4 e 7. Transactions separadas que tentam inserir valores 5 e 6, respectivamente, bloqueiam o gap entre 4 e 7 com locks de intenção de inserção antes de obter o exclusive lock na linha inserida, mas não se bloqueiam mutuamente porque as linhas não estão em conflito.

O exemplo a seguir demonstra uma transaction adquirindo um lock de intenção de inserção antes de obter um exclusive lock no registro inserido. O exemplo envolve dois clients, A e B.

O Client A cria uma tabela contendo dois registros de Index (90 e 102) e então inicia uma transaction que coloca um exclusive lock em registros de Index com um ID maior que 100. O exclusive lock inclui um gap lock antes do registro 102:

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

O Client B inicia uma transaction para inserir um registro no gap. A transaction adquire um lock de intenção de inserção enquanto espera para obter um exclusive lock.

```sql
mysql> START TRANSACTION;
mysql> INSERT INTO child (id) VALUES (101);
```

Os dados de transaction para um lock de intenção de inserção aparecem de forma semelhante ao seguinte no `SHOW ENGINE INNODB STATUS` e na saída do monitor InnoDB:

```sql
RECORD LOCKS space id 31 page no 3 n bits 72 index `PRIMARY` of table `test`.`child`
trx id 8731 lock_mode X locks gap before rec insert intention waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000066; asc    f;;
 1: len 6; hex 000000002215; asc     " ;;
 2: len 7; hex 9000000172011c; asc     r  ;;...
```

#### Locks AUTO-INC

Um lock `AUTO-INC` é um lock especial de nível de tabela adquirido por transactions que inserem em tabelas com colunas `AUTO_INCREMENT`. No caso mais simples, se uma transaction estiver inserindo valores na tabela, quaisquer outras transactions devem esperar para fazer suas próprias inserções nessa tabela, para que as linhas inseridas pela primeira transaction recebam valores de Primary Key consecutivos.

A variável `innodb_autoinc_lock_mode` controla o algoritmo usado para locking de auto-incremento. Ela permite que você escolha como equilibrar a previsibilidade das sequências de valores de auto-incremento e a concurrency máxima para operações de inserção.

Para mais informações, consulte a Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”.

#### Locks de Predicado para Indexes Espaciais

O `InnoDB` suporta indexing `SPATIAL` de colunas contendo dados espaciais (consulte a Seção 11.4.8, “Otimizando a Análise Espacial”).

Para lidar com o locking para operações que envolvem Indexes `SPATIAL`, o next-key locking não funciona bem para suportar os níveis de isolation de transaction `REPEATABLE READ` ou `SERIALIZABLE`. Não há um conceito de ordenação absoluta em dados multidimensionais, então não está claro qual é a “próxima” chave.

Para habilitar o suporte a níveis de isolation para tabelas com Indexes `SPATIAL`, o `InnoDB` usa locks de predicado. Um Index `SPATIAL` contém valores de minimum bounding rectangle (MBR), então o `InnoDB` impõe uma leitura consistente no Index definindo um lock de predicado no valor MBR usado para uma Query. Outras transactions não podem inserir ou modificar uma linha que corresponderia à condição da Query.