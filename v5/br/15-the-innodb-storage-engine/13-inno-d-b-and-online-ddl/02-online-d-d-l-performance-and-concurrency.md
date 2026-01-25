### 14.13.2 Desempenho e Concorrência do DDL Online

DDL Online melhora diversos aspectos da operação do MySQL:

* Aplicações que acessam a table ficam mais responsivas porque as queries e operações DML na table podem prosseguir enquanto a operação DDL está em andamento. A redução de locking e da espera por recursos do servidor MySQL leva a uma maior escalabilidade, mesmo para operações que não estão envolvidas na operação DDL.

* Operações *in-place* (no local) evitam o I/O de disco e os ciclos de CPU associados ao método de cópia de table, o que minimiza a carga geral no Database. A minimização da carga ajuda a manter um bom desempenho e alto *throughput* durante a operação DDL.

* Operações *in-place* leem menos dados para o Buffer Pool do que as operações de cópia de table, o que reduz a remoção (*purging*) de dados acessados frequentemente da memória. A remoção de dados acessados frequentemente pode causar uma queda temporária de desempenho após uma operação DDL.

#### A cláusula LOCK

Por padrão, o MySQL usa o mínimo de locking possível durante uma operação DDL. A cláusula `LOCK` pode ser especificada para impor um locking mais restritivo, se necessário. Se a cláusula `LOCK` especificar um nível de locking menos restritivo do que o permitido para uma operação DDL específica, o statement falhará com um erro. As cláusulas `LOCK` são descritas abaixo, em ordem da menos para a mais restritiva:

* `LOCK=NONE`:

  Permite queries e DML concorrentes.

  Por exemplo, use esta cláusula para tables envolvendo cadastros ou compras de clientes, para evitar que as tables fiquem indisponíveis durante operações DDL demoradas.

* `LOCK=SHARED`:

  Permite queries concorrentes, mas bloqueia DML.

  Por exemplo, use esta cláusula em tables de *data warehouse*, onde você pode atrasar as operações de carregamento de dados até que a operação DDL seja concluída, mas as queries não podem ser atrasadas por longos períodos.

* `LOCK=DEFAULT`:

  Permite o máximo de concorrência possível (queries concorrentes, DML, ou ambos). Omitir a cláusula `LOCK` é o mesmo que especificar `LOCK=DEFAULT`.

  Use esta cláusula quando souber que o nível de locking padrão do statement DDL não causará problemas de disponibilidade para a table.

* `LOCK=EXCLUSIVE`:

  Bloqueia queries e DML concorrentes.

  Use esta cláusula se a principal preocupação for concluir a operação DDL no menor tempo possível, e o acesso concorrente de query e DML não for necessário. Você também pode usar esta cláusula se o servidor estiver supostamente ocioso, para evitar acessos inesperados à table.

#### DDL Online e Metadata Locks

As operações DDL Online podem ser vistas como tendo três fases:

* *Fase 1: Inicialização*

  Na fase de inicialização, o servidor determina quanta concorrência é permitida durante a operação, levando em consideração os recursos do storage engine, as operações especificadas no statement e as opções `ALGORITHM` e `LOCK` especificadas pelo usuário. Durante esta fase, um *shared upgradeable Metadata Lock* é obtido para proteger a definição atual da table.

* *Fase 2: Execução*

  Nesta fase, o statement é preparado e executado. Se o Metadata Lock é atualizado para *exclusive* depende dos fatores avaliados na fase de inicialização. Se um Metadata Lock exclusivo for necessário, ele é obtido apenas brevemente durante a preparação do statement.

* *Fase 3: Commit da Definição da Table*

  Na fase de commit da definição da table, o Metadata Lock é atualizado para *exclusive* para despejar a antiga definição da table e realizar o commit da nova. Uma vez concedido, a duração do Metadata Lock exclusivo é breve.

Devido aos requisitos de Metadata Lock exclusivo descritos acima, uma operação DDL online pode ter que esperar que as transações concorrentes que detêm Metadata Locks na table façam commit ou rollback. Transações iniciadas antes ou durante a operação DDL podem manter Metadata Locks na table que está sendo alterada. No caso de uma transação de longa duração ou inativa, uma operação DDL online pode atingir o tempo limite (*time out*) enquanto espera por um Metadata Lock exclusivo. Além disso, um Metadata Lock exclusivo pendente solicitado por uma operação DDL online bloqueia transações subsequentes na table.

O exemplo a seguir demonstra uma operação DDL online esperando por um Metadata Lock exclusivo e como um Metadata Lock pendente bloqueia transações subsequentes na table.

Sessão 1:

```sql
mysql> CREATE TABLE t1 (c1 INT) ENGINE=InnoDB;
mysql> START TRANSACTION;
mysql> SELECT * FROM t1;
```

O statement `SELECT` da sessão 1 obtém um Metadata Lock compartilhado na table t1.

Sessão 2:

```sql
mysql> ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE;
```

A operação DDL online na sessão 2, que requer um Metadata Lock exclusivo na table t1 para fazer commit das alterações de definição da table, deve esperar que a transação da sessão 1 faça commit ou roll back.

Sessão 3:

```sql
mysql> SELECT * FROM t1;
```

O statement `SELECT` emitido na sessão 3 é bloqueado esperando que o Metadata Lock exclusivo solicitado pela operação `ALTER TABLE` na sessão 2 seja concedido.

Você pode usar `SHOW FULL PROCESSLIST` para determinar se as transações estão esperando por um Metadata Lock.

```sql
mysql> SHOW FULL PROCESSLIST\G
...
*************************** 2. row ***************************
     Id: 5
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 44
  State: Waiting for table metadata lock
   Info: ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE
...
*************************** 4. row ***************************
     Id: 7
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 5
  State: Waiting for table metadata lock
   Info: SELECT * FROM t1
4 rows in set (0.00 sec)
```

As informações de Metadata Lock também são expostas através da tabela `metadata_locks` do Performance Schema, que fornece informações sobre dependências de Metadata Lock entre sessões, o Metadata Lock que uma sessão está esperando e a sessão que atualmente detém o Metadata Lock. Para mais informações, consulte a Seção 25.12.12.1, “The metadata_locks Table”.

#### Desempenho do DDL Online

O desempenho de uma operação DDL é em grande parte determinado pelo fato de a operação ser executada *in-place* (no local) e se ela reconstrói a table.

Para avaliar o desempenho relativo de uma operação DDL, você pode comparar os resultados usando `ALGORITHM=INPLACE` com os resultados usando `ALGORITHM=COPY`. Alternativamente, você pode comparar os resultados com `old_alter_table` desabilitado e habilitado.

Para operações DDL que modificam dados da table, você pode determinar se uma operação DDL executa alterações *in place* ou se realiza uma cópia da table observando o valor de “rows affected” (linhas afetadas) exibido após a conclusão do comando. Por exemplo:

* Alterando o valor padrão de uma coluna (rápido, não afeta os dados da table):

  ```sql
  Query OK, 0 rows affected (0.07 sec)
  ```

* Adicionando um Index (leva tempo, mas `0 rows affected` mostra que a table não é copiada):

  ```sql
  Query OK, 0 rows affected (21.42 sec)
  ```

* Alterando o tipo de dado de uma coluna (leva um tempo considerável e requer a reconstrução de todas as rows da table):

  ```sql
  Query OK, 1671168 rows affected (1 min 35.54 sec)
  ```

Antes de executar uma operação DDL em uma table grande, verifique se a operação é rápida ou lenta da seguinte forma:

1. Clone a estrutura da table.
2. Popule a table clonada com uma pequena quantidade de dados.
3. Execute a operação DDL na table clonada.
4. Verifique se o valor de “rows affected” é zero ou não. Um valor diferente de zero significa que a operação copia os dados da table, o que pode exigir um planejamento especial. Por exemplo, você pode realizar a operação DDL durante um período de inatividade programada ou em cada servidor replica, um de cada vez.

Nota

Para uma melhor compreensão do processamento do MySQL associado a uma operação DDL, examine as tabelas Performance Schema e `INFORMATION_SCHEMA` relacionadas ao `InnoDB` antes e depois das operações DDL para ver o número de leituras físicas, gravações, alocações de memória e assim por diante.

Eventos de estágio do Performance Schema podem ser usados para monitorar o progresso do `ALTER TABLE`. Consulte a Seção 14.17.1, “Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema”.

Como há algum trabalho de processamento envolvido no registro das alterações feitas pelas operações DML concorrentes e, em seguida, na aplicação dessas alterações no final, uma operação DDL online pode demorar mais no geral do que o mecanismo de cópia de table que bloqueia o acesso à table de outras sessões. A redução no desempenho bruto é equilibrada pela melhor responsividade para aplicações que usam a table. Ao avaliar as técnicas para alterar a estrutura da table, considere a percepção de desempenho do usuário final, com base em fatores como tempos de carregamento de páginas web.