### 8.11.4 Bloqueio de metadados

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos de banco de dados e garantir a consistência dos dados. O bloqueio de metadados não se aplica apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabelas, bloqueios de usuário adquiridos com a função `GET_LOCK()` (consulte a Seção 12.14, “Funções de Bloqueio”) e bloqueios adquiridos com o serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

A tabela `metadata_locks` do Schema de Desempenho exibe informações de bloqueio de metadados, o que pode ser útil para ver quais sessões estão segurando bloqueios, estão bloqueadas esperando por bloqueios, e assim por diante. Para detalhes, consulte a Seção 25.12.12.1, “A Tabela metadata_locks”.

O bloqueio de metadados envolve algum overhead, que aumenta à medida que o volume de consultas aumenta. A concorrência por metadados aumenta à medida que múltiplas consultas tentam acessar os mesmos objetos.

O bloqueio de metadados não substitui o cache de definição de tabela, e seus mútues e bloqueios diferem do mútuo `LOCK_open`. A discussão a seguir fornece algumas informações sobre como o bloqueio de metadados funciona.

- Aquisição de bloqueio de metadados
- Liberação da Bloqueio de Metadados

#### Aquisição de bloqueio de metadados

Se houver vários garçons para um determinado bloqueio, o pedido de bloqueio de maior prioridade é atendido primeiro, com uma exceção relacionada à variável de sistema `max_write_lock_count`. Os pedidos de bloqueio de escrita têm prioridade maior do que os pedidos de bloqueio de leitura. No entanto, se `max_write_lock_count` for definido para um valor baixo (digamos, 10), os pedidos de bloqueio de leitura podem ser preferidos em relação aos pedidos de bloqueio de escrita pendentes se os pedidos de bloqueio de leitura já tiverem sido atendidos em favor de 10 pedidos de bloqueio de escrita. Normalmente, esse comportamento não ocorre porque, por padrão, `max_write_lock_count` tem um valor muito grande.

As declarações adquirem travamentos de metadados um por um, não simultaneamente, e realizam a detecção de impasse no processo.

As instruções DML normalmente obtêm bloqueios na ordem em que as tabelas são mencionadas na instrução.

As declarações DDL, `LOCK TABLES` e outras declarações semelhantes tentam reduzir o número de possíveis deadlocks entre declarações DDL concorrentes ao adquirir bloqueios em tabelas explicitamente nomeadas em ordem alfabética. Os bloqueios podem ser adquiridos em uma ordem diferente para tabelas usadas implicitamente (como tabelas em relações de chave estrangeira que também devem ser bloqueadas).

Por exemplo, `RENAME TABLE` é uma instrução DDL que adquire bloqueios em ordem alfabética de nomes:

- Essa instrução `RENAME TABLE` renomeia `tbla` para outra coisa e renomeia `tblc` para `tbla`:

  ```sql
  RENAME TABLE tbla TO tbld, tblc TO tbla;
  ```

  A declaração adquire bloqueios de metadados, em ordem, em `tbla`, `tblc` e `tbld` (porque `tbld` vem depois de `tblc` na ordem de nome):

- Essa declaração ligeiramente diferente também renomeia `tbla` para algo mais, e renomeia `tblc` para `tbla`:

  ```sql
  RENAME TABLE tbla TO tblb, tblc TO tbla;
  ```

  Neste caso, a declaração adquire bloqueios de metadados, em ordem, em `tbla`, `tblb` e `tblc` (porque `tblb` precede `tblc` na ordem de nome):

Ambas as declarações adquirem bloqueios em `tbla` e `tblc`, nessa ordem, mas diferem quanto à questão de saber se o bloqueio no nome do restante da tabela é adquirido antes ou depois de `tblc`.

A ordem de aquisição de bloqueio de metadados pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente, como o exemplo a seguir ilustra.

Comece com duas tabelas `x` e `x_new` que tenham estrutura idêntica. Três clientes emitem declarações que envolvem essas tabelas:

Cliente 1:

```sql
LOCK TABLE x WRITE, x_new WRITE;
```

A declaração solicita e obtém bloqueios de escrita na ordem do nome em `x` e `x_new`.

Cliente 2:

```sql
INSERT INTO x VALUES(1);
```

A declaração solicita e bloqueia as operações de espera por um bloqueio de escrita em `x`.

Cliente 3:

```sql
RENAME TABLE x TO x_old, x_new TO x;
```

A declaração solicita bloqueios exclusivos na ordem de nome em `x`, `x_new` e `x_old`, mas bloqueia as esperas por bloqueio em `x`.

Cliente 1:

```sql
UNLOCK TABLES;
```

A declaração libera as bloqueadoras de escrita em `x` e `x_novo`. O pedido de bloqueio exclusivo para `x` pelo Cliente 3 tem prioridade maior do que o pedido de bloqueio de escrita pelo Cliente 2, então o Cliente 3 adquire seu bloqueio em `x`, depois também em `x_novo` e `x_antigo`, realiza a renomeação e libera seus bloqueios. O Cliente 2 então adquire seu bloqueio em `x`, realiza a inserção e libera seu bloqueio.

A ordem de aquisição de bloqueio faz com que a instrução `RENAME TABLE` seja executada antes da instrução `INSERT`. O `x` no qual o insert ocorre é a tabela que foi renomeada para `x_new` quando o Cliente 2 emitiu o insert e foi renomeada para `x` pelo Cliente 3:

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

Agora, comece, em vez disso, com tabelas chamadas `x` e `new_x` que têm estrutura idêntica. Novamente, três clientes emitem declarações que envolvem essas tabelas:

Cliente 1:

```sql
LOCK TABLE x WRITE, new_x WRITE;
```

A declaração solicita e obtém bloqueios de escrita na ordem de nome em `new_x` e `x`.

Cliente 2:

```sql
INSERT INTO x VALUES(1);
```

A declaração solicita e bloqueia as operações de espera por um bloqueio de escrita em `x`.

Cliente 3:

```sql
RENAME TABLE x TO old_x, new_x TO x;
```

A declaração solicita bloqueios exclusivos na ordem de nome em `new_x`, `old_x` e `x`, mas bloqueia as esperas pelo bloqueio em `new_x`.

Cliente 1:

```sql
UNLOCK TABLES;
```

A declaração libera as bloqueadoras de escrita em `x` e `new_x`. Para `x`, o único pedido pendente é do Cliente 2, então o Cliente 2 adquire sua bloqueadora, realiza a inserção e libera a bloqueadora. Para `new_x`, o único pedido pendente é do Cliente 3, que tem permissão para adquirir essa bloqueadora (e também a bloqueadora em `old_x`). A operação de renomeação ainda bloqueia para a bloqueadora em `x` até que a inserção do Cliente 2 termine e ele libere sua bloqueadora. Então, o Cliente 3 adquire a bloqueadora em `x`, realiza o renome e libera sua bloqueadora.

Neste caso, a ordem de aquisição de bloqueios resulta na execução do `INSERT` antes da `RENAME TABLE`. O `x` no qual o insert ocorre é o `x` original, agora renomeado para `old_x` pela operação de renomeação:

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

Se a ordem de aquisição de bloqueio em declarações concorrentes fizer diferença no resultado da aplicação, como no exemplo anterior, você pode ajustar os nomes das tabelas para afetar a ordem de aquisição de bloqueio.

#### Liberação do Bloqueio de Metadados

Para garantir a serializabilidade das transações, o servidor não deve permitir que uma sessão execute uma instrução de linguagem de definição de dados (DDL) em uma tabela que é usada em uma transação iniciada explicitamente ou implicitamente incompleta em outra sessão. O servidor alcança isso ao adquirir bloqueios de metadados em tabelas usadas dentro de uma transação e adiando a liberação desses bloqueios até que a transação termine. Um bloqueio de metadados em uma tabela impede alterações na estrutura da tabela. Essa abordagem de bloqueio implica que uma tabela que está sendo usada por uma transação em uma sessão não pode ser usada em instruções DDL por outras sessões até que a transação termine.

Este princípio se aplica não apenas a tabelas transacionais, mas também a tabelas não transacionais. Suponha que uma sessão comece uma transação que usa a tabela transacional `t` e a tabela não transacional `nt` da seguinte forma:

```sql
START TRANSACTION;
SELECT * FROM t;
SELECT * FROM nt;
```

O servidor mantém bloqueios de metadados em `t` e `nt` até que a transação termine. Se outra sessão tentar uma operação de bloqueio DDL ou de escrita em qualquer uma das tabelas, ela será bloqueada até a liberação do bloqueio de metadados no final da transação. Por exemplo, uma segunda sessão será bloqueada se tentar qualquer uma dessas operações:

```sql
DROP TABLE t;
ALTER TABLE t ...;
DROP TABLE nt;
ALTER TABLE nt ...;
LOCK TABLE t ... WRITE;
```

O mesmo comportamento se aplica ao comando `LOCK TABLES ... READ`. Ou seja, transações iniciadas explicitamente ou implicitamente que atualizam qualquer bloco de tabela (transacional ou não) e são bloqueadas pelo `LOCK TABLES ... READ` para essa tabela.

Se o servidor adquirir bloqueios de metadados para uma instrução que é sintaticamente válida, mas falha durante a execução, ele não libera os bloqueios precocemente. A liberação dos bloqueios ainda é adiada até o final da transação, porque a instrução falha é escrita no log binário e os bloqueios protegem a consistência do log.

No modo de autocommit, cada instrução é, na verdade, uma transação completa, portanto, as bloqueadoras de metadados adquiridas para a instrução são mantidas apenas até o final da instrução.

As bloquagens de metadados adquiridas durante uma instrução `PREPARE` são liberadas assim que a instrução é preparada, mesmo que a preparação ocorra dentro de uma transação com múltiplas instruções.
