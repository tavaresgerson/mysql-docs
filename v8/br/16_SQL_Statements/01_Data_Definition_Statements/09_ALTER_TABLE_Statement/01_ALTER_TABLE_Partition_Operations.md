#### 15.1.9.1 Operações de Partição em Tabelas ALTER

As cláusulas relacionadas à partição para `ALTER TABLE` podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, combinar e dividir partições, além de realizar a manutenção da partição.

- Basta usar uma cláusula `partition_options` com `ALTER TABLE` em uma tabela particionada para particionar a tabela de acordo com o esquema de particionamento definido por `partition_options`. Esta cláusula sempre começa com `PARTITION BY` e segue a mesma sintaxe e outras regras que se aplicam à cláusula `partition_options` para `CREATE TABLE` (para informações mais detalhadas, consulte a Seção 15.1.20, “Instrução CREATE TABLE”), e também pode ser usada para particionar uma tabela existente que ainda não está particionada. Por exemplo, considere uma tabela (não particionada) definida como mostrado aqui:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

  Essa tabela pode ser particionada por `HASH`, usando a coluna `id` como chave de particionamento, em 8 partições por meio desta declaração:

  ```
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

  O MySQL suporta a opção `ALGORITHM` com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chaves que o MySQL 5.1 ao calcular a colocação de linhas em partições; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chaves implementadas e usadas por padrão para novas tabelas particionadas `KEY` no MySQL 5.5 e versões posteriores. (Tabelas particionadas criadas com as funções de hashing de chaves empregadas no MySQL 5.5 e versões posteriores não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada principalmente para uso ao atualizar ou desatualizar tabelas particionadas `[LINEAR] KEY` entre as versões do MySQL 5.1 e versões posteriores do MySQL, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1.

  A tabela resultante do uso de uma declaração `ALTER TABLE ... PARTITION BY` deve seguir as mesmas regras que uma criada usando `CREATE TABLE ... PARTITION BY`. Isso inclui as regras que regem a relação entre quaisquer chaves únicas (incluindo qualquer chave primária) que a tabela possa ter, e as colunas ou colunas usadas na expressão de particionamento, conforme discutido na Seção 26.6.1, “Chaves de Particionamento, Chaves Primárias e Chaves Únicas”. As regras `CREATE TABLE ... PARTITION BY` para especificar o número de particionamentos também se aplicam a `ALTER TABLE ... PARTITION BY`.

  A cláusula `partition_definition` para `ALTER TABLE ADD PARTITION` suporta as mesmas opções que a cláusula do mesmo nome para a instrução `CREATE TABLE`. (Consulte a Seção 15.1.20, “Instrução CREATE TABLE”, para a sintaxe e descrição.) Suponha que você tenha a tabela particionada criada conforme mostrado aqui:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999)
  );
  ```

  Você pode adicionar uma nova partição `p3` a esta tabela para armazenar valores menores que `2002` da seguinte forma:

  ```
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

  `DROP PARTITION` pode ser usado para excluir uma ou mais partições `RANGE` ou `LIST`. Esta declaração não pode ser usada com partições `HASH` ou `KEY`; em vez disso, use `COALESCE PARTITION` (consulte mais adiante nesta seção). Quaisquer dados armazenados nas partições excluídas nomeadas na lista `partition_names` são descartados. Por exemplo, dado a tabela `t1` definida anteriormente, você pode excluir as partições nomeadas `p0` e `p1` conforme mostrado aqui:

  ```
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

  Nota

  `DROP PARTITION` não funciona com tabelas que utilizam o mecanismo de armazenamento `NDB`. Consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”, e a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster”.

  `ADD PARTITION` e `DROP PARTITION` não suportam atualmente `IF [NOT] EXISTS`.

  As opções `DISCARD PARTITION ... TABLESPACE` e `IMPORT PARTITION ... TABLESPACE` estendem o recurso de Espaço de Tabela Transporável para partições de tabela individuais `InnoDB`. Cada partição de tabela `InnoDB` tem seu próprio arquivo de espaço de tabela (arquivo `.ibd`). O recurso de Espaço de Tabela Transporável facilita a cópia dos espaços de tabela de uma instância de servidor MySQL em execução para outra instância em execução, ou para realizar uma restauração na mesma instância. Ambas as opções aceitam uma lista de separação por vírgula de um ou mais nomes de partição. Por exemplo:

  ```
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

  Ao executar `DISCARD PARTITION ... TABLESPACE` e `IMPORT PARTITION ... TABLESPACE` em tabelas subpartidas, tanto os nomes de partição quanto os de subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas.

  O recurso Transportable Tablespace também suporta a cópia ou restauração de tabelas particionadas `InnoDB`. Para obter mais informações, consulte a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

  Os nomes de renomeação de tabelas particionadas são suportados. Você pode renomear particionações individuais indiretamente usando `ALTER TABLE ... REORGANIZE PARTITION`; no entanto, essa operação copia os dados da particionação.

  Para excluir linhas de partições selecionadas, use a opção `TRUNCATE PARTITION`. Esta opção aceita uma lista de um ou mais nomes de partições separados por vírgula. Considere a tabela `t1` criada por esta declaração:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2003),
      PARTITION p4 VALUES LESS THAN (2007)
  );
  ```

  Para excluir todas as linhas da partição `p0`, use a seguinte instrução:

  ```
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

  A declaração mostrada agora tem o mesmo efeito que a seguinte declaração `DELETE`:

  ```
  DELETE FROM t1 WHERE year_col < 1991;
  ```

  Ao truncar múltiplas partições, as partições não precisam ser contínuas: isso pode simplificar muito as operações de exclusão em tabelas particionadas que, caso fossem feitas com instruções `DELETE`, exigiriam condições muito complexas `WHERE`. Por exemplo, esta instrução exclui todas as linhas das partições `p1` e `p3`:

  ```
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

  Aqui é exibida uma declaração equivalente ao `DELETE`:

  ```
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

  Se você usar a palavra-chave `ALL` no lugar da lista de nomes de partições, a instrução atua em todas as partições da tabela.

  `TRUNCATE PARTITION` apenas exclui linhas; não altera a definição da própria tabela ou de qualquer uma de suas partições.

  Para verificar se as linhas foram excluídas, verifique a tabela `INFORMATION_SCHEMA.PARTITIONS`, usando uma consulta como esta:

  ```
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

  O `COALESCE PARTITION` pode ser usado com uma tabela que está particionada por `HASH` ou `KEY` para reduzir o número de particionamentos por `number`. Suponha que você tenha criado a tabela `t2` da seguinte forma:

  ```
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

  Para reduzir o número de partições usadas pelo `t2` de 6 para 4, use a seguinte declaração:

  ```
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

  Os dados contidos nas últimas partições `number` são reunidos nas partições restantes. Neste caso, as partições 4 e 5 são reunidas nas primeiras 4 partições (as partições numeradas 0, 1, 2 e 3).

  Para alterar algumas, mas não todas, das partições usadas por uma tabela particionada, você pode usar `REORGANIZE PARTITION`. Essa declaração pode ser usada de várias maneiras:

  - Para fundir um conjunto de partições em uma única partição. Isso é feito nomeando várias partições na lista `partition_names` e fornecendo uma única definição para `partition_definition`.

  - Para dividir uma partição existente em várias partições. Para isso, nomeie uma única partição para `partition_names` e forneça várias `partition_definitions`.

  - Para alterar os intervalos para um subconjunto de partições definidas usando `VALUES LESS THAN` ou as listas de valores para um subconjunto de partições definidas usando `VALUES IN`.

  Nota

  Para partições que não foram explicitamente nomeadas, o MySQL fornece automaticamente os nomes padrão `p0`, `p1`, `p2` e assim por diante. O mesmo vale para as subpartições.

  Para obter informações mais detalhadas sobre as declarações `ALTER TABLE ... REORGANIZE PARTITION` e exemplos, consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”.

- Para trocar uma partição ou subpartição de uma tabela com uma tabela, use a instrução `ALTER TABLE ... EXCHANGE PARTITION` — ou seja, para mover quaisquer linhas existentes na partição ou subpartição para a tabela não particionada e quaisquer linhas existentes na tabela não particionada para a partição ou subpartição da tabela.

  Uma vez que uma ou mais colunas tenham sido adicionadas a uma tabela particionada usando `ALGORITHM=INSTANT`, não será mais possível trocar as partições com essa tabela.

  Para informações sobre o uso e exemplos, consulte a Seção 26.3.3, “Troca de Partições e Subpartições com Tabelas”.

- Várias opções fornecem a funcionalidade de manutenção e reparo de partições análoga à implementada para tabelas não particionadas por instruções como `CHECK TABLE` e `REPAIR TABLE` (que também são suportadas para tabelas particionadas; para mais informações, consulte a Seção 15.7.3, “Instruções de Manutenção de Tabelas”). Essas incluem `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION` e `REPAIR PARTITION`. Cada uma dessas opções aceita uma cláusula `partition_names` composta por um ou mais nomes de partições, separados por vírgulas. As partições devem já existir na tabela de destino. Você também pode usar a palavra-chave `ALL` no lugar de `partition_names`, nesse caso, a instrução atua em todas as partições da tabela. Para mais informações e exemplos, consulte a Seção 26.3.4, “Manutenção de Partições”.

  `InnoDB` atualmente não suporta otimização por partição; `ALTER TABLE ... OPTIMIZE PARTITION` faz com que toda a tabela seja reconstruída e analisada, e um aviso apropriado é emitido. (Bug #11751825, Bug #42822). Para contornar esse problema, use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso.

  As opções `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION` e `REPAIR PARTITION` não são suportadas para tabelas que não estão particionadas.

- O `REMOVE PARTITIONING` permite que você remova a partição de uma tabela sem afetar a tabela ou seus dados. Esta opção pode ser combinada com outras opções `ALTER TABLE` como aquelas usadas para adicionar, excluir ou renomear colunas ou índices.

- Usar a opção `ENGINE` com `ALTER TABLE` altera o mecanismo de armazenamento usado pela tabela sem afetar a partição. O mecanismo de armazenamento alvo deve fornecer seu próprio manipulador de partição. Apenas os mecanismos de armazenamento `InnoDB` e `NDB` têm manipuladores de partição nativos; `NDB` não é suportado atualmente no MySQL 8.0.

É possível que uma declaração `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após qualquer outra especificação.

As opções `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais. Para mais informações, consulte a Seção 15.1.9.1, “Operações de Partição ALTER TABLE”.

Apenas uma única instância de qualquer uma das seguintes opções pode ser usada em uma declaração específica do `ALTER TABLE`: `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

Por exemplo, as seguintes duas declarações são inválidas:

```
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

No primeiro caso, você pode analisar as partições `p1` e `p2` da tabela `t1` simultaneamente usando uma única instrução com uma única opção `ANALYZE PARTITION` que lista ambas as partições a serem analisadas, como este:

```
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

No segundo caso, não é possível realizar as operações `ANALYZE` e `CHECK` em diferentes partições da mesma tabela simultaneamente. Em vez disso, você deve emitir duas instruções separadas, como esta:

```
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

As operações `REBUILD` não são suportadas atualmente para subpartições. A palavra-chave `REBUILD` é expressamente desaconselhada com subpartições e faz com que `ALTER TABLE` falhe com um erro se usada dessa forma.

As operações `CHECK PARTITION` e `REPAIR PARTITION` falham quando a partição a ser verificada ou reparada contém erros de chave duplicada.

Para obter mais informações sobre essas declarações, consulte a Seção 26.3.4, “Manutenção de Partições”.
