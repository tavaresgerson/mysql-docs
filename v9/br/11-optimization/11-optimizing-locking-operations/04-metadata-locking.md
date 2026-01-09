### 10.11.4 Bloqueio de Metadados

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos do banco de dados e garantir a consistência dos dados. O bloqueio de metadados aplica-se não apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabelas, bloqueios de usuário adquiridos com a função `GET_LOCK()` (consulte a Seção 14.14, “Funções de Bloqueio”), e bloqueios adquiridos com o serviço de bloqueio descrito na Seção 7.6.8.1, “O Serviço de Bloqueio”.

A tabela `metadata_locks` do Schema de Desempenho exibe informações sobre bloqueios de metadados, o que pode ser útil para ver quais sessões mantêm bloqueios, estão bloqueadas esperando por bloqueios, e assim por diante. Para detalhes, consulte a Seção 29.12.13.3, “A Tabela metadata_locks”.

O bloqueio de metadados envolve algum overhead, que aumenta à medida que o volume de consultas aumenta. A concorrência de metadados aumenta quanto mais múltiplas consultas tentam acessar os mesmos objetos.

O bloqueio de metadados não é um substituto para o cache de definição de tabela, e seus mutexes e bloqueios diferem do mutex `LOCK_open`. A discussão a seguir fornece algumas informações sobre como o bloqueio de metadados funciona.

* Aquisição de Bloqueio de Metadados
* Liberação de Bloqueio de Metadados

#### Aquisição de Bloqueio de Metadados

Se houver vários atendentes para um determinado bloqueio, o pedido de bloqueio de maior prioridade é atendido primeiro, com uma exceção relacionada à variável de sistema `max_write_lock_count`. Os pedidos de bloqueio de escrita têm prioridade maior do que os pedidos de bloqueio de leitura. No entanto, se `max_write_lock_count` for definido para um valor baixo (digamos, 10), os pedidos de bloqueio de leitura podem ser preferidos sobre os pedidos de bloqueio de escrita pendentes se os pedidos de bloqueio de leitura já tiverem sido atendidos em favor de 10 pedidos de bloqueio de escrita. Normalmente, esse comportamento não ocorre porque `max_write_lock_count` tem um valor muito grande por padrão.

As declarações de Múltiplos Leitores (DML) adquirem blocos de acesso um a um, não simultaneamente, e realizam a detecção de impasses no processo.

As declarações de Manipulação de Dados de Linguagem Estruturada (DDL), `LOCK TABLES` e outras declarações semelhantes tentam reduzir o número de impasses possíveis entre declarações DDL concorrentes ao adquirir blocos de acesso em tabelas nomeadas explicitamente na ordem de nome. Os blocos de acesso podem ser adquiridos em uma ordem diferente para tabelas usadas implicitamente (como tabelas em relações de chave estrangeira que também devem ser bloqueadas).

Por exemplo, `RENAME TABLE` é uma declaração DDL que adquire blocos de acesso na ordem de nome:

* Esta declaração `RENAME TABLE` renomeia `tbla` para outra coisa e renomeia `tblc` para `tbla`:

  ```
  RENAME TABLE tbla TO tbld, tblc TO tbla;
  ```

  A declaração adquire blocos de acesso, na ordem, em `tbla`, `tblc` e `tbld` (porque `tbld` vem depois de `tblc` na ordem de nome):

* Esta declaração ligeiramente diferente também renomeia `tbla` para outra coisa e renomeia `tblc` para `tbla`:

  ```
  RENAME TABLE tbla TO tblb, tblc TO tbla;
  ```

  Neste caso, a declaração adquire blocos de acesso, na ordem, em `tbla`, `tblb` e `tblc` (porque `tblb` precede `tblc` na ordem de nome):

Ambas as declarações adquirem blocos de acesso em `tbla` e `tblc`, nessa ordem, mas diferem em se o bloqueio na restante tabela é adquirido antes ou depois de `tblc`.

A ordem de aquisição de blocos de acesso de metadados pode fazer a diferença no resultado da operação quando múltiplas transações são executadas concorrentemente, como o exemplo a seguir ilustra.

Comece com duas tabelas `x` e `x_new` que têm estrutura idêntica. Três clientes emitem declarações que envolvem essas tabelas:

Cliente 1:

```
LOCK TABLE x WRITE, x_new WRITE;
```

A declaração solicita e adquire blocos de escrita na ordem de nome em `x` e `x_new`.

Cliente 2:

```
INSERT INTO x VALUES(1);
```

A declaração solicita e bloqueia aquisições de bloqueio de escrita em `x`.

Cliente 3:

```
RENAME TABLE x TO x_old, x_new TO x;
```

A declaração solicita bloqueios exclusivos em ordem de nome em `x`, `x_new` e `x_old`, mas bloqueia aquisições de bloqueio de escrita em `x`.

Cliente 1:

```
UNLOCK TABLES;
```

A declaração libera os bloqueios de escrita em `x` e `x_new`. O pedido de bloqueio exclusivo para `x` pelo Cliente 3 tem prioridade maior do que o pedido de bloqueio de escrita pelo Cliente 2, então o Cliente 3 adquire seu bloqueio em `x`, depois também em `x_new` e `x_old`, realiza a renomeação e libera seus bloqueios. O Cliente 2 então adquire seu bloqueio em `x`, realiza a inserção e libera seu bloqueio.

A ordem de aquisição de bloqueios resulta na execução da instrução `RENAME TABLE` antes da instrução `INSERT`. O `x` no qual a inserção ocorre é a tabela que foi renomeada para `x_new` quando o Cliente 2 emitiu a inserção e foi renomeada para `x` pelo Cliente 3:

```
mysql> SELECT * FROM x;
+------+
| i    |
+------+
|    1 |
+------+

mysql> SELECT * FROM x_old;
Empty set (0.01 sec)
```

Agora comece, em vez disso, com tabelas nomeadas `x` e `new_x` que têm estrutura idêntica. Novamente, três clientes emitem declarações que envolvem essas tabelas:

Cliente 1:

```
LOCK TABLE x WRITE, new_x WRITE;
```

A declaração solicita e adquire bloqueios de escrita em ordem de nome em `new_x` e `x`.

Cliente 2:

```
INSERT INTO x VALUES(1);
```

A declaração solicita e bloqueia aquisições de bloqueio de escrita em `x`.

Cliente 3:

```
RENAME TABLE x TO old_x, new_x TO x;
```

A declaração solicita bloqueios exclusivos em ordem de nome em `new_x`, `old_x` e `x`, mas bloqueia aquisições de bloqueio de escrita em `new_x`.

Cliente 1:

```
UNLOCK TABLES;
```

A declaração libera as bloqueadoras de escrita em `x` e `new_x`. Para `x`, o único pedido pendente é do Cliente 2, então o Cliente 2 adquire sua bloqueadora, executa o inserimento e libera a bloqueadora. Para `new_x`, o único pedido pendente é do Cliente 3, que tem permissão para adquirir essa bloqueadora (e também a bloqueadora em `old_x`). A operação de renomeação ainda bloqueia para a bloqueadora em `x` até que o inserimento do Cliente 2 termine e ele libere sua bloqueadora. Então, o Cliente 3 adquire a bloqueadora em `x`, executa o renomeamento e libera sua bloqueadora.

Neste caso, a ordem de aquisição de bloqueadoras resulta na execução do `INSERT` antes do `RENAME TABLE`. O `x` para o qual o inserimento ocorre é o `x` original, agora renomeado para `old_x` pela operação de renomeação:

```
mysql> SELECT * FROM x;
Empty set (0.01 sec)

mysql> SELECT * FROM old_x;
+------+
| i    |
+------+
|    1 |
+------+
```

Se a ordem de aquisição de bloqueadoras em declarações concorrentes faz diferença no resultado da operação de uma aplicação, como no exemplo anterior, você pode ser capaz de ajustar os nomes das tabelas para afetar a ordem de aquisição de bloqueadoras.

As bloqueadoras de metadados são estendidas, conforme necessário, para tabelas relacionadas por uma restrição de chave estrangeira para evitar que operações DML e DDL conflitantes sejam executadas concorrentemente nas tabelas relacionadas. Ao atualizar uma tabela pai, uma bloqueadora de metadados é adquirida na tabela filho enquanto a metadados da chave estrangeira são atualizados. Os metadados da chave estrangeira são de propriedade da tabela filho.

#### Liberação da Bloqueadora de Metadados

Para garantir a serializabilidade das transações, o servidor não deve permitir que uma sessão execute uma instrução de linguagem de definição de dados (DDL) em uma tabela que seja usada em uma transação iniciada explicitamente ou implicitamente incompleta em outra sessão. O servidor alcança isso ao adquirir bloqueios de metadados em tabelas usadas dentro de uma transação e adiando a liberação desses bloqueios até o término da transação. Um bloqueio de metadados em uma tabela impede alterações na estrutura da tabela. Essa abordagem de bloqueio implica que uma tabela que está sendo usada por uma transação em uma sessão não pode ser usada em instruções DDL por outras sessões até o término da transação.

Este princípio não se aplica apenas a tabelas transacionais, mas também a tabelas não transacionais. Suponha que uma sessão inicie uma transação que use a tabela transacional `t` e a tabela não transacional `nt` da seguinte forma:

```
START TRANSACTION;
SELECT * FROM t;
SELECT * FROM nt;
```

O servidor mantém bloqueios de metadados em `t` e `nt` até o término da transação. Se outra sessão tentar uma operação de bloqueio DDL ou de escrita em qualquer uma das tabelas, ela é bloqueada até a liberação do bloqueio de metadados no término da transação. Por exemplo, uma segunda sessão é bloqueada se tentar qualquer uma dessas operações:

```
DROP TABLE t;
ALTER TABLE t ...;
DROP TABLE nt;
ALTER TABLE nt ...;
LOCK TABLE t ... WRITE;
```

O mesmo comportamento se aplica ao `LOCK TABLES ... READ`. Ou seja, transações iniciadas explicitamente ou implicitamente que atualizam qualquer tabela (transacional ou não) bloqueiam e são bloqueadas por `LOCK TABLES ... READ` para aquela tabela.

Se o servidor adquirir bloqueios de metadados para uma instrução que é sintaticamente válida, mas falha durante a execução, ele não libera os bloqueios precocemente. A liberação dos bloqueios ainda é adiada até o fim da transação porque a instrução falha é escrita no log binário e os bloqueios protegem a consistência do log.

No modo de autocommit, cada instrução é, na verdade, uma transação completa, então as bloqueadoras de metadados adquiridas para a instrução são mantidas apenas até o final da instrução.

As bloqueadoras de metadados adquiridas durante uma instrução `PREPARE` são liberadas assim que a instrução é preparada, mesmo que a preparação ocorra dentro de uma transação com várias instruções.

Para transações XA no estado `PREPARED`, as bloqueadoras de metadados são mantidas mesmo após desconexões do cliente e reinicializações do servidor, até que uma `XA COMMIT` ou `XA ROLLBACK` seja executada.