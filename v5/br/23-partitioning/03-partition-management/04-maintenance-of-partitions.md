### 22.3.4 Manutenção de Partitions

Várias tarefas de manutenção de Table e Partition podem ser realizadas usando comandos SQL destinados a esses propósitos em Tables particionadas no MySQL 5.7.

A manutenção de Tables particionadas pode ser realizada usando os comandos `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE`, que são suportados para Tables particionadas.

Você pode usar várias extensões para `ALTER TABLE` para executar operações desse tipo diretamente em uma ou mais Partitions, conforme descrito na lista a seguir:

* **Rebuilding partitions (Reconstruindo Partitions).** Reconstrói a Partition; isso tem o mesmo efeito que descartar todos os registros armazenados na Partition e, em seguida, reinseri-los. Isso pode ser útil para fins de desfragmentação.

  Exemplo:

  ```sql
  ALTER TABLE t1 REBUILD PARTITION p0, p1;
  ```

* **Optimizing partitions (Otimizando Partitions).** Se você excluiu um grande número de linhas de uma Partition ou se fez muitas alterações em uma Table particionada com linhas de comprimento variável (ou seja, tendo colunas `VARCHAR`, `BLOB` ou `TEXT`), você pode usar `ALTER TABLE ... OPTIMIZE PARTITION` para recuperar qualquer espaço não utilizado e desfragmentar o arquivo de dados da Partition.

  Exemplo:

  ```sql
  ALTER TABLE t1 OPTIMIZE PARTITION p0, p1;
  ```

  Usar `OPTIMIZE PARTITION` em uma determinada Partition é equivalente a executar `CHECK PARTITION`, `ANALYZE PARTITION` e `REPAIR PARTITION` nessa Partition.

  Alguns Storage Engines do MySQL, incluindo o `InnoDB`, não suportam otimização por Partition; nesses casos, `ALTER TABLE ... OPTIMIZE PARTITION` analisa e reconstrói a Table inteira e faz com que um Warning apropriado seja emitido. (Bug #11751825, Bug #42822) Use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso, para evitar esse problema.

* **Analyzing partitions (Analisando Partitions).** Isso lê e armazena as distribuições de Key para as Partitions.

  Exemplo:

  ```sql
  ALTER TABLE t1 ANALYZE PARTITION p3;
  ```

* **Repairing partitions (Reparando Partitions).** Isso repara Partitions corrompidas.

  Exemplo:

  ```sql
  ALTER TABLE t1 REPAIR PARTITION p0,p1;
  ```

  Normalmente, `REPAIR PARTITION` falha quando a Partition contém erros de Duplicate Key. No MySQL 5.7.2 e posterior, você pode usar `ALTER IGNORE TABLE` com esta opção, caso em que todas as linhas que não puderem ser movidas devido à presença de Duplicate Keys são removidas da Partition (Bug #16900947).

* **Checking partitions (Verificando Partitions).** Você pode verificar se há erros nas Partitions da mesma forma que pode usar `CHECK TABLE` com Tables não particionadas.

  Exemplo:

  ```sql
  ALTER TABLE trb3 CHECK PARTITION p1;
  ```

  Este comando informa se os dados ou Indexes na Partition `p1` da Table `t1` estão corrompidos. Se for o caso, use `ALTER TABLE ... REPAIR PARTITION` para reparar a Partition.

  Normalmente, `CHECK PARTITION` falha quando a Partition contém erros de Duplicate Key. No MySQL 5.7.2 e posterior, você pode usar `ALTER IGNORE TABLE` com esta opção, caso em que o comando retorna o conteúdo de cada linha na Partition onde uma violação de Duplicate Key é encontrada. Apenas os valores para as colunas na expressão de Partitioning para a Table são reportados. (Bug #16900947)

Cada um dos comandos listados acima também suporta a palavra-chave `ALL` no lugar da lista de nomes de Partitions. O uso de `ALL` faz com que o comando atue em todas as Partitions da Table.

O uso de **mysqlcheck** e **myisamchk** não é suportado com Tables particionadas.

No MySQL 5.7, você também pode truncar Partitions usando `ALTER TABLE ... TRUNCATE PARTITION`. Este comando pode ser usado para excluir todas as linhas de uma ou mais Partitions, da mesma forma que `TRUNCATE TABLE` exclui todas as linhas de uma Table.

`ALTER TABLE ... TRUNCATE PARTITION ALL` trunca todas as Partitions na Table.

Antes do MySQL 5.7.2, as operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REBUILD`, `REPAIR` e `TRUNCATE` não eram permitidas em Subpartitions (Bug #14028340, Bug #65184).