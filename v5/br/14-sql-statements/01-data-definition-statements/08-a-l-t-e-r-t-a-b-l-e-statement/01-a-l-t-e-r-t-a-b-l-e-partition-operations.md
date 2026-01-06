#### 13.1.8.1 Operações de Partição em Tabelas ALTER

As cláusulas relacionadas à partição para `ALTER TABLE` podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, combinar e dividir partições, além de realizar a manutenção da partição.

- Basta usar uma cláusula *`partition_options`* com `ALTER TABLE` em uma tabela particionada para particionar a tabela de acordo com o esquema de particionamento definido pela *`partition_options`*. Esta cláusula sempre começa com `PARTITION BY` e segue a mesma sintaxe e outras regras que se aplicam à cláusula *`partition_options`* para `CREATE TABLE` (para informações mais detalhadas, consulte Seção 13.1.18, “Instrução CREATE TABLE”), e também pode ser usada para particionar uma tabela existente que ainda não está particionada. Por exemplo, considere uma tabela (não particionada) definida como mostrado aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

  Essa tabela pode ser particionada por `HASH`, usando a coluna `id` como chave de particionamento, em 8 partições por meio desta declaração:

  ```sql
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

  O MySQL suporta a opção `ALGORITHM` com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chaves que o MySQL 5.1 ao calcular o posicionamento das linhas nas partições; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chaves implementadas e usadas por padrão para novas tabelas `KEY` particionadas no MySQL 5.5 e versões posteriores. (Tabelas particionadas criadas com as funções de hashing de chaves empregadas no MySQL 5.5 e versões posteriores não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada principalmente para uso ao atualizar ou desatualizar tabelas `[LINEAR] KEY` particionadas entre versões do MySQL 5.1 e versões posteriores do MySQL, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1.

  Para atualizar uma tabela `KEY` particionada criada no MySQL 5.1, execute primeiro `SHOW CREATE TABLE` e anote as colunas exatas e o número de particionamentos mostrados. Agora, execute uma instrução `ALTER TABLE` usando exatamente a mesma lista de colunas e número de particionamentos que na instrução `CREATE TABLE`, adicionando `ALGORITHM=2` imediatamente após as palavras-chave `PARTITION BY`. (Você também deve incluir a palavra-chave `LINEAR` se ela foi usada na definição original da tabela.) Um exemplo de uma sessão no cliente **mysql** é mostrado aqui:

  ```sql
  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)

  mysql> ALTER TABLE p PARTITION BY LINEAR KEY ALGORITHM=2 (id) PARTITIONS 32;
  Query OK, 0 rows affected (5.34 sec)
  Records: 0  Duplicates: 0  Warnings: 0

  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)
  ```

  A degradação de uma tabela criada usando a hashing de chave padrão usada no MySQL 5.5 e versões posteriores para permitir seu uso por um servidor MySQL 5.1 é semelhante, exceto que, neste caso, você deve usar `ALGORITHM=1` para forçar a reconstrução das partições da tabela usando as funções de hashing de chave do MySQL 5.1. Recomenda-se que você não faça isso, exceto quando necessário para a compatibilidade com um servidor MySQL 5.1, pois as funções de hashing de chave `KEY` aprimoradas usadas por padrão no MySQL 5.5 e versões posteriores fornecem correções para vários problemas encontrados na implementação mais antiga.

  Nota

  Uma tabela atualizada por meio de `ALTER TABLE ... PARTITION BY ALGORITHM=2 [LINEAR] KEY ...` não pode mais ser usada por um servidor MySQL 5.1. (Tal tabela precisaria ser despromovida com `ALTER TABLE ... PARTITION BY ALGORITHM=1 [LINEAR] KEY ...` antes que pudesse ser usada novamente por um servidor MySQL 5.1.)

  A tabela resultante do uso de uma declaração `ALTER TABLE ... PARTITION BY` deve seguir as mesmas regras que uma criada usando `CREATE TABLE ... PARTITION BY`. Isso inclui as regras que regem a relação entre quaisquer chaves únicas (incluindo qualquer chave primária) que a tabela possa ter, e as colunas ou colunas usadas na expressão de particionamento, conforme discutido em Seção 22.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”. As regras de `CREATE TABLE ... PARTITION BY` para especificar o número de particionamentos também se aplicam a `ALTER TABLE ... PARTITION BY`.

  A cláusula *`partition_definition`* para `ALTER TABLE ADD PARTITION` suporta as mesmas opções que a cláusula do mesmo nome para a instrução `CREATE TABLE`. (Veja Seção 13.1.18, “Instrução CREATE TABLE”, para a sintaxe e descrição.) Suponha que você tenha a tabela particionada criada conforme mostrado aqui:

  ```sql
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

  Você pode adicionar uma nova partição `p3` a esta tabela para armazenar valores menores que `2002`, conforme descrito a seguir:

  ```sql
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

  `DROP PARTITION` pode ser usado para descartar uma ou mais partições `RANGE` ou `LIST`. Esta declaração não pode ser usada com partições `HASH` ou `KEY`; em vez disso, use `COALESCE PARTITION` (consulte abaixo). Qualquer dado que foi armazenado nas partições descartadas nomeadas na lista *`partition_names`* é descartado. Por exemplo, dado a tabela `t1` definida anteriormente, você pode descartar as partições nomeadas `p0` e `p1` conforme mostrado aqui:

  ```sql
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

  Nota

  A instrução `DROP PARTITION` não funciona com tabelas que utilizam o mecanismo de armazenamento `NDB`. Consulte Seção 22.3.1, “Gestão de Partições RANGE e LIST” e Seção 21.2.7, “Limitações Conhecidas do NDB Cluster”.

  `ADD PARTITION` e `DROP PARTITION` não suportam atualmente `IF [NOT] EXISTS`.

  As opções `DISCARD PARTITION ... TABLESPACE` e `IMPORT PARTITION ... TABLESPACE` estendem o recurso Transportable Tablespace para partições individuais de tabelas `InnoDB`. Cada partição de tabela `InnoDB` tem seu próprio arquivo de espaço de tabelas (arquivo `.ibd`). O recurso Transportable Tablespace facilita a cópia dos espaços de tabelas de uma instância de servidor MySQL em execução para outra instância em execução, ou a realização de uma restauração na mesma instância. Ambas as opções aceitam uma lista de um ou mais nomes de partição separados por vírgula. Por exemplo:

  ```sql
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```sql
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

  Ao executar `DISCARD PARTITION ... TABLESPACE` e `IMPORT PARTITION ... TABLESPACE` em tabelas subpartidas, tanto os nomes de partição quanto os de subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas.

  O recurso Transportable Tablespace também suporta a cópia ou restauração de tabelas `InnoDB` particionadas. Para mais informações, consulte Seção 14.6.1.3, “Importando Tabelas InnoDB”.

  Os nomes de renomeação de tabelas particionadas são suportados. Você pode renomear particionações individuais indiretamente usando `ALTER TABLE ... REORGANIZE PARTITION`; no entanto, essa operação copia os dados da particionação.

  Para excluir linhas de partições selecionadas, use a opção `TRUNCATE PARTITION`. Essa opção aceita uma lista de um ou mais nomes de partições separados por vírgula. Por exemplo, considere a tabela `t1` conforme definida aqui:

  ```sql
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

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

  A declaração mostrada acima tem o mesmo efeito que a seguinte declaração `DELETE`:

  ```sql
  DELETE FROM t1 WHERE year_col < 1991;
  ```

  Ao truncar múltiplas partições, as partições não precisam ser contínuas: isso pode simplificar muito as operações de exclusão em tabelas particionadas que, de outra forma, exigiriam condições `WHERE` muito complexas se feitas com instruções `DELETE`. Por exemplo, esta instrução exclui todas as linhas das partições `p1` e `p3`:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

  Aqui está uma declaração equivalente `DELETE`:

  ```sql
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

  Se você usar a palavra-chave `ALL` no lugar da lista de nomes de partições, a instrução atua em todas as partições da tabela.

  A opção `TRUNCATE PARTITION` apenas exclui as linhas; ela não altera a definição da própria tabela ou de nenhuma de suas partições.

  Para verificar se as linhas foram excluídas, verifique a tabela `INFORMATION_SCHEMA.PARTITIONS`, usando uma consulta como esta:

  ```sql
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

  A opção `TRUNCATE PARTITION` só é suportada para tabelas particionadas que utilizam os motores de armazenamento `MyISAM`, `InnoDB` ou `MEMORY`. Ela também funciona em tabelas de armazenamento \[`BLACKHOLE`]\(blackhole-storage-engine.html] (mas não tem efeito). Não é suportada para tabelas de armazenamento `ARCHIVE`.

  `COALESCE PARTITION` pode ser usado com uma tabela que está particionada por `HASH` ou `KEY` para reduzir o número de particionações em *`número`*. Suponha que você criou a tabela `t2` da seguinte forma:

  ```sql
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

  Para reduzir o número de partições usadas pelo `t2` de 6 para 4, use a seguinte declaração:

  ```sql
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

  Os dados contidos nas últimas *`número`* partições são reunidos nas partições restantes. Neste caso, as partições 4 e 5 são reunidas nas primeiras 4 partições (as partições numeradas 0, 1, 2 e 3).

  Para alterar algumas, mas não todas, das partições usadas por uma tabela particionada, você pode usar `REORGANIZE PARTITION`. Essa instrução pode ser usada de várias maneiras:

  - Para fundir um conjunto de partições em uma única partição. Isso é feito nomeando várias partições na lista *`partition_names`* e fornecendo uma única definição para *`partition_definition`*.

  - Para dividir uma partição existente em várias partições. Para isso, nomeie uma única partição para *`partition_names`* e forneça várias *`partition_definitions`*.

  - Para alterar os intervalos para um subconjunto de partições definidas usando `MENOS QUE` ou as listas de valores para um subconjunto de partições definidas usando `IN`.

  - Esta declaração também pode ser usada sem a opção `partition_names INTO (partition_definitions)` em tabelas que são automaticamente particionadas usando a particionamento `HASH` para forçar a redistribuição dos dados. (Atualmente, apenas as tabelas `NDB` são automaticamente particionadas dessa maneira.) Isso é útil no NDB Cluster, onde, após você ter adicionado novos nós de dados do NDB Cluster online a um NDB Cluster existente, você deseja redistribuir os dados das tabelas do NDB Cluster existentes para os novos nós de dados. Nesses casos, você deve invocar a declaração com a opção `ALGORITHM=INPLACE`; em outras palavras, como mostrado aqui:

    ```sql
    ALTER TABLE table ALGORITHM=INPLACE, REORGANIZE PARTITION;
    ```

    Você não pode executar outros DDL simultaneamente com a reorganização online da tabela, ou seja, nenhuma outra instrução DDL pode ser emitida enquanto uma instrução `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` estiver sendo executada. Para obter mais informações sobre como adicionar nós de dados do NDB Cluster online, consulte Seção 21.6.7, “Adicionar nós de dados do NDB Cluster Online”.

    Nota

    `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona com tabelas criadas usando a opção `MAX_ROWS`, porque ele usa o valor constante `MAX_ROWS` especificado na declaração original de `CREATE TABLE` para determinar o número de partições necessárias, então nenhuma nova partição é criada. Em vez disso, você pode usar `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=rows` para aumentar o número máximo de linhas para essa tabela; nesse caso, `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não é necessário (e causa um erro se executado). O valor de *`rows`* deve ser maior que o valor especificado para `MAX_ROWS` na declaração original de `CREATE TABLE` para que isso funcione.

    O uso de `MAX_ROWS` para forçar o número de partições da tabela é desaconselhável no NDB 7.5.4 e versões posteriores; use `PARTITION_BALANCE` (consulte Definindo opções do NDB\_TABLE).

    Tentar usar `REORGANIZE PARTITION` sem a opção `partition_names INTO (partition_definitions)` em tabelas explicitamente particionadas resulta no erro REORGANIZE PARTITION without parameters só pode ser usado em tabelas auto-particionadas usando particionamento HASH.

  Nota

  Para partições que não foram explicitamente nomeadas, o MySQL fornece automaticamente os nomes padrão `p0`, `p1`, `p2`, e assim por diante. O mesmo vale para as subpartições.

  Para obter informações mais detalhadas sobre as instruções `ALTER TABLE ... REORGANIZE PARTITION` e exemplos, consulte Seção 22.3.1, “Gestão de Partições RANGE e LIST”.

- Para trocar uma partição ou subpartição de uma tabela por outra, use a instrução `ALTER TABLE ... EXCHANGE PARTITION` — ou seja, para mover quaisquer linhas existentes na partição ou subpartição para a tabela não particionada e quaisquer linhas existentes na tabela não particionada para a partição ou subpartição da tabela.

  Para informações sobre uso e exemplos, consulte Seção 22.3.3, “Troca de Partições e Subpartições com Tabelas”.

- Várias opções fornecem funcionalidades de manutenção e reparo de partições análogas à implementada para tabelas não particionadas por instruções como `CHECK TABLE` e `REPAIR TABLE` (que também são suportadas para tabelas particionadas; para mais informações, consulte Seção 13.7.2, “Instruções de Manutenção de Tabelas”). Essas incluem `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION` e `REPAIR PARTITION`. Cada uma dessas opções aceita uma cláusula *`partition_names`* composta por um ou mais nomes de partições, separados por vírgulas. As partições devem já existir na tabela a ser alterada. Você também pode usar a palavra-chave `ALL` no lugar de *`partition_names`*, caso em que a instrução atua em todas as partições da tabela. Para mais informações e exemplos, consulte Seção 22.3.4, “Manutenção de Partições”.

  Alguns motores de armazenamento do MySQL, como o `InnoDB`, não suportam a otimização por partição. Para uma tabela particionada usando um motor de armazenamento desse tipo, a instrução `ALTER TABLE ... OPTIMIZE PARTITION` faz com que toda a tabela seja reconstruída e analisada, e um aviso apropriado é emitido. (Bug #11751825, Bug #42822)

  Para contornar esse problema, use as instruções `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso.

  As opções `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION` e `REPAIR PARTITION` não são permitidas para tabelas que não estão particionadas.

- No MySQL 5.7.9 e versões posteriores, você pode usar `ALTER TABLE ... UPGRADE PARTITIONING` para atualizar uma tabela particionada `InnoDB` que foi criada com o antigo manipulador de particionamento genérico para a particionamento nativo do `InnoDB` empregado no MySQL 5.7.6 e versões posteriores. Além disso, a partir do MySQL 5.7.9, o utilitário **mysql\_upgrade** verifica essas tabelas `InnoDB` particionadas e tenta atualizá-las para o particionamento nativo como parte de suas operações normais.

  Importante

  Tabelas `InnoDB` particionadas que não utilizam o manipulador de particionamento nativo do `InnoDB` não podem ser usadas no MySQL 8.0 ou posterior. O `ALTER TABLE ... UPGRADE PARTITIONING` não é suportado no MySQL 8.0 ou posterior; portanto, quaisquer tabelas `InnoDB` particionadas que utilizem o manipulador genérico *devem* ser atualizadas para o manipulador nativo do \`InnoDB *antes* de atualizar sua instalação do MySQL para o MySQL 8.0 ou posterior.

- A opção `REMOVE PARTITIONING` permite que você remova a partição de uma tabela sem afetar a tabela ou seus dados. Essa opção pode ser combinada com outras opções de `ALTER TABLE` (alter-table.html), como aquelas usadas para adicionar, excluir ou renomear colunas ou índices.

- Usar a opção `ENGINE` com `ALTER TABLE` altera o mecanismo de armazenamento usado pela tabela sem afetar a partição.

Quando a instrução `ALTER TABLE ... EXCHANGE PARTITION` ou `ALTER TABLE ... TRUNCATE PARTITION` é executada em uma tabela particionada que usa `MyISAM` (ou outro mecanismo de armazenamento que utiliza bloqueio em nível de tabela), apenas as partições que são realmente lidas são bloqueadas. (Isso não se aplica a tabelas particionadas que usam um mecanismo de armazenamento que emprega bloqueio em nível de linha, como `InnoDB`.) Veja Seção 22.6.4, “Particionamento e Bloqueio”.

É possível que uma instrução `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após quaisquer outras especificações.

As opções `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em uma única `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais. Para mais informações, consulte Seção 13.1.8.1, “Operações de Partição ALTER TABLE”.

Apenas uma única instância de qualquer uma das seguintes opções pode ser usada em uma declaração específica de `ALTER TABLE`: `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

Por exemplo, as seguintes duas declarações são inválidas:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

No primeiro caso, você pode analisar as partições `p1` e `p2` da tabela `t1` simultaneamente usando uma única instrução com uma única opção `ANALYZE PARTITION` que lista ambas as partições a serem analisadas, como este:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

No segundo caso, não é possível realizar operações `ANALYZE` e `CHECK` em diferentes partições da mesma tabela simultaneamente. Em vez disso, você deve emitir duas declarações separadas, como esta:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

As operações `REBUILD` não são suportadas atualmente para subpartições. A palavra-chave `REBUILD` é expressamente desaconselhada com subpartições e faz com que a operação `ALTER TABLE` falhe com um erro se usada dessa forma.

As operações `CHECK PARTITION` e `REPAIR PARTITION` falham quando a partição a ser verificada ou reparada contém erros de chave duplicada.

Para obter mais informações sobre essas declarações, consulte Seção 22.3.4, “Manutenção de Partições”.
