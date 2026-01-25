### 8.11.4 Metadata Locking

O MySQL usa *metadata locking* para gerenciar o acesso concorrente a objetos do Database e garantir a consistência dos dados. O *metadata locking* se aplica não apenas a Tables, mas também a Schemas, programas armazenados (*procedures*, *functions*, *triggers*, *scheduled events*), *tablespaces*, User Locks adquiridos com a função `GET_LOCK()` (consulte a Seção 12.14, “Locking Functions”), e Locks adquiridos com o serviço de *locking* descrito na Seção 5.5.6.1, “The Locking Service”.

A Table `metadata_locks` do Performance Schema expõe informações sobre *metadata locks*, o que pode ser útil para ver quais Sessions detêm Locks, estão bloqueadas esperando por Locks, e assim por diante. Para detalhes, consulte a Seção 25.12.12.1, “The metadata_locks Table”.

O *metadata locking* envolve alguma sobrecarga (*overhead*), que aumenta à medida que o volume de Queries cresce. A contenção de Metadata aumenta quanto mais múltiplas Queries tentam acessar os mesmos objetos.

O *metadata locking* não é um substituto para o *table definition cache*, e seus *mutexes* e Locks diferem do *mutex* `LOCK_open`. A discussão a seguir fornece algumas informações sobre como o *metadata locking* funciona.

* Aquisição de Metadata Lock
* Liberação de Metadata Lock

#### Aquisição de Metadata Lock

Se houver múltiplos *waiters* para um determinado Lock, a solicitação de Lock de maior prioridade é satisfeita primeiro, com uma exceção relacionada à variável de sistema `max_write_lock_count`. As solicitações de Write Lock têm prioridade maior do que as solicitações de Read Lock. No entanto, se `max_write_lock_count` for definido para um valor baixo (por exemplo, 10), as solicitações de Read Lock podem ser preferidas em relação às solicitações de Write Lock pendentes se as solicitações de Read Lock já tiverem sido ignoradas em favor de 10 solicitações de Write Lock. Normalmente, esse comportamento não ocorre porque `max_write_lock_count` por padrão tem um valor muito grande.

As Statements adquirem *metadata locks* um por um, não simultaneamente, e realizam detecção de Deadlock no processo.

Statements DML normalmente adquirem Locks na ordem em que as Tables são mencionadas na Statement.

Statements DDL, `LOCK TABLES`, e outras Statements semelhantes tentam reduzir o número de Deadlocks possíveis entre Statements DDL concorrentes adquirindo Locks em Tables explicitamente nomeadas na ordem alfabética do nome. Locks podem ser adquiridos em uma ordem diferente para Tables usadas implicitamente (como Tables em relacionamentos de Foreign Key que também devem ser bloqueadas).

Por exemplo, `RENAME TABLE` é uma Statement DDL que adquire Locks na ordem do nome:

* Esta Statement `RENAME TABLE` renomeia `tbla` para outra coisa, e renomeia `tblc` para `tbla`:

  ```sql
  RENAME TABLE tbla TO tbld, tblc TO tbla;
  ```

  A Statement adquire *metadata locks*, em ordem, em `tbla`, `tblc` e `tbld` (porque `tbld` segue `tblc` na ordem do nome):

* Esta Statement ligeiramente diferente também renomeia `tbla` para outra coisa, e renomeia `tblc` para `tbla`:

  ```sql
  RENAME TABLE tbla TO tblb, tblc TO tbla;
  ```

  Neste caso, a Statement adquire *metadata locks*, em ordem, em `tbla`, `tblb` e `tblc` (porque `tblb` precede `tblc` na ordem do nome):

Ambas as Statements adquirem Locks em `tbla` e `tblc`, nessa ordem, mas diferem se o Lock no nome da Table restante é adquirido antes ou depois de `tblc`.

A ordem de aquisição de *metadata lock* pode fazer diferença no resultado da operação quando múltiplas Transactions são executadas concorrentemente, como ilustra o exemplo a seguir.

Comece com duas Tables `x` e `x_new` que têm estrutura idêntica. Três Clients emitem Statements que envolvem estas Tables:

Client 1:

```sql
LOCK TABLE x WRITE, x_new WRITE;
```

A Statement solicita e adquire Write Locks na ordem do nome em `x` e `x_new`.

Client 2:

```sql
INSERT INTO x VALUES(1);
```

A Statement solicita e bloqueia esperando por um Write Lock em `x`.

Client 3:

```sql
RENAME TABLE x TO x_old, x_new TO x;
```

A Statement solicita Exclusive Locks na ordem do nome em `x`, `x_new` e `x_old`, mas bloqueia esperando pelo Lock em `x`.

Client 1:

```sql
UNLOCK TABLES;
```

A Statement libera os Write Locks em `x` e `x_new`. A solicitação de Exclusive Lock para `x` pelo Client 3 tem prioridade mais alta do que a solicitação de Write Lock pelo Client 2, então o Client 3 adquire seu Lock em `x`, depois também em `x_new` e `x_old`, executa a renomeação, e libera seus Locks. O Client 2 então adquire seu Lock em `x`, executa o Insert, e libera seu Lock.

A ordem de aquisição de Lock resulta na execução do `RENAME TABLE` antes do `INSERT`. O `x` no qual o Insert ocorre é a Table que foi nomeada `x_new` quando o Client 2 emitiu o Insert e foi renomeada para `x` pelo Client 3:

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

Agora, comece em vez disso com Tables nomeadas `x` e `new_x` que têm estrutura idêntica. Novamente, três Clients emitem Statements que envolvem estas Tables:

Client 1:

```sql
LOCK TABLE x WRITE, new_x WRITE;
```

A Statement solicita e adquire Write Locks na ordem do nome em `new_x` e `x`.

Client 2:

```sql
INSERT INTO x VALUES(1);
```

A Statement solicita e bloqueia esperando por um Write Lock em `x`.

Client 3:

```sql
RENAME TABLE x TO old_x, new_x TO x;
```

A Statement solicita Exclusive Locks na ordem do nome em `new_x`, `old_x` e `x`, mas bloqueia esperando pelo Lock em `new_x`.

Client 1:

```sql
UNLOCK TABLES;
```

A Statement libera os Write Locks em `x` e `new_x`. Para `x`, a única solicitação pendente é a do Client 2, então o Client 2 adquire seu Lock, executa o Insert e libera o Lock. Para `new_x`, a única solicitação pendente é a do Client 3, que tem permissão para adquirir esse Lock (e também o Lock em `old_x`). A operação de renomeação ainda bloqueia para o Lock em `x` até que o Insert do Client 2 termine e libere seu Lock. Então o Client 3 adquire o Lock em `x`, executa a renomeação e libera seu Lock.

Neste caso, a ordem de aquisição de Lock resulta na execução do `INSERT` antes do `RENAME TABLE`. O `x` no qual o Insert ocorre é o `x` original, agora renomeado para `old_x` pela operação de renomeação:

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

Se a ordem de aquisição de Lock em Statements concorrentes fizer diferença no resultado da operação para uma aplicação, como no exemplo anterior, você pode ser capaz de ajustar os nomes das Tables para afetar a ordem de aquisição de Lock.

#### Liberação de Metadata Lock

Para garantir a serializabilidade da Transaction, o Server não deve permitir que uma Session execute uma Statement DDL (Data Definition Language) em uma Table que esteja sendo usada em uma Transaction iniciada explicitamente ou implicitamente, mas ainda não concluída, em outra Session. O Server alcança isso adquirindo *metadata locks* nas Tables usadas dentro de uma Transaction e adiando a liberação desses Locks até que a Transaction termine. Um *metadata lock* em uma Table impede alterações na estrutura da Table. Essa abordagem de *locking* implica que uma Table que está sendo usada por uma Transaction dentro de uma Session não pode ser usada em Statements DDL por outras Sessions até que a Transaction termine.

Este princípio se aplica não apenas a Tables transacionais, mas também a Tables não transacionais. Suponha que uma Session comece uma Transaction que usa a Table transacional `t` e a Table não transacional `nt` da seguinte forma:

```sql
START TRANSACTION;
SELECT * FROM t;
SELECT * FROM nt;
```

O Server retém *metadata locks* em ambas, `t` e `nt`, até que a Transaction termine. Se outra Session tentar uma Statement DDL ou uma operação de Write Lock em qualquer uma das Tables, ela será bloqueada até a liberação do *metadata lock* no final da Transaction. Por exemplo, uma segunda Session bloqueia se tentar qualquer uma destas operações:

```sql
DROP TABLE t;
ALTER TABLE t ...;
DROP TABLE nt;
ALTER TABLE nt ...;
LOCK TABLE t ... WRITE;
```

O mesmo comportamento se aplica ao `LOCK TABLES ... READ`. Ou seja, Transactions iniciadas explicitamente ou implicitamente que atualizam qualquer Table (transacional ou não transacional) bloqueiam e são bloqueadas por `LOCK TABLES ... READ` para essa Table.

Se o Server adquirir *metadata locks* para uma Statement que é sintaticamente válida, mas falha durante a execução, ele não libera os Locks precocemente. A liberação do Lock ainda é adiada para o final da Transaction porque a Statement com falha é escrita no Binary Log e os Locks protegem a consistência do Log.

No modo Autocommit, cada Statement é, de fato, uma Transaction completa, então os *metadata locks* adquiridos para a Statement são mantidos apenas até o fim da Statement.

Os *metadata locks* adquiridos durante uma Statement `PREPARE` são liberados assim que a Statement é preparada, mesmo que a preparação ocorra dentro de uma Transaction de múltiplas Statements.
