### 22.2.6 Subpartitioning

O Subpartitioning — também conhecido como composite partitioning — é a divisão adicional de cada PARTITION em uma tabela particionada. Considere o seguinte comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"):

```sql
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) )
    SUBPARTITIONS 2 (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (2000),
        PARTITION p2 VALUES LESS THAN MAXVALUE
    );
```

A tabela `ts` tem 3 PARTITIONs de `RANGE`. Cada uma dessas PARTITIONs — `p0`, `p1` e `p2` — é posteriormente dividida em 2 subpartitions. Na prática, a tabela inteira é dividida em `3 * 2 = 6` PARTITIONs. No entanto, devido à ação da cláusula `PARTITION BY RANGE`, as primeiras 2 armazenam apenas os registros com um valor inferior a 1990 na coluna `purchased`.

No MySQL 5.7, é possível aplicar Subpartitioning a tabelas que são particionadas por `RANGE` ou `LIST`. Subpartitions podem usar PARTITIONing por `HASH` ou `KEY`. Isso também é conhecido como composite partitioning.

Note

`SUBPARTITION BY HASH` e `SUBPARTITION BY KEY` geralmente seguem as mesmas regras de sintaxe que `PARTITION BY HASH` e `PARTITION BY KEY`, respectivamente. Uma exceção a isso é que `SUBPARTITION BY KEY` (diferente de `PARTITION BY KEY`) atualmente não suporta uma coluna default, então a coluna usada para esse fim deve ser especificada, mesmo que a tabela tenha uma Primary Key explícita. Este é um problema conhecido que estamos trabalhando para resolver; consulte [Issues with subpartitions](partitioning-limitations.html#partitioning-limitations-subpartitions "Issues with subpartitions"), para mais informações e um exemplo.

Também é possível definir subpartitions explicitamente usando cláusulas `SUBPARTITION` para especificar opções para subpartitions individuais. Por exemplo, uma forma mais detalhada de criar a mesma tabela `ts` mostrada no exemplo anterior seria:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0,
            SUBPARTITION s1
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s2,
            SUBPARTITION s3
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s4,
            SUBPARTITION s5
        )
    );
```

Alguns itens sintáticos notáveis estão listados aqui:

* Cada PARTITION deve ter o mesmo número de subpartitions.
* Se você definir explicitamente qualquer subpartition usando `SUBPARTITION` em qualquer PARTITION de uma tabela particionada, você deve definir todas elas. Em outras palavras, o seguinte comando falha:

  ```sql
  CREATE TABLE ts (id INT, purchased DATE)
      PARTITION BY RANGE( YEAR(purchased) )
      SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
          PARTITION p0 VALUES LESS THAN (1990) (
              SUBPARTITION s0,
              SUBPARTITION s1
          ),
          PARTITION p1 VALUES LESS THAN (2000),
          PARTITION p2 VALUES LESS THAN MAXVALUE (
              SUBPARTITION s2,
              SUBPARTITION s3
          )
      );
  ```

  Este comando ainda falharia mesmo que incluísse uma cláusula `SUBPARTITIONS 2`.

* Cada cláusula `SUBPARTITION` deve incluir (no mínimo) um nome para a subpartition. Caso contrário, você pode definir qualquer opção desejada para a subpartition ou permitir que ela assuma sua configuração default para essa opção.

* Os nomes das Subpartitions devem ser únicos em toda a tabela. Por exemplo, o seguinte comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") é válido no MySQL 5.7:

```sql
  CREATE TABLE ts (id INT, purchased DATE)
      PARTITION BY RANGE( YEAR(purchased) )
      SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
          PARTITION p0 VALUES LESS THAN (1990) (
              SUBPARTITION s0,
              SUBPARTITION s1
          ),
          PARTITION p1 VALUES LESS THAN (2000) (
              SUBPARTITION s2,
              SUBPARTITION s3
          ),
          PARTITION p2 VALUES LESS THAN MAXVALUE (
              SUBPARTITION s4,
              SUBPARTITION s5
          )
      );
  ```

Subpartitions podem ser usadas com tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") especialmente grandes para distribuir dados e Indexes por vários discos. Suponha que você tenha 6 discos montados como `/disk0`, `/disk1`, `/disk2`, e assim por diante. Agora considere o seguinte exemplo:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    ENGINE = MYISAM
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0
                DATA DIRECTORY = '/disk0/data'
                INDEX DIRECTORY = '/disk0/idx',
            SUBPARTITION s1
                DATA DIRECTORY = '/disk1/data'
                INDEX DIRECTORY = '/disk1/idx'
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s2
                DATA DIRECTORY = '/disk2/data'
                INDEX DIRECTORY = '/disk2/idx',
            SUBPARTITION s3
                DATA DIRECTORY = '/disk3/data'
                INDEX DIRECTORY = '/disk3/idx'
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s4
                DATA DIRECTORY = '/disk4/data'
                INDEX DIRECTORY = '/disk4/idx',
            SUBPARTITION s5
                DATA DIRECTORY = '/disk5/data'
                INDEX DIRECTORY = '/disk5/idx'
        )
    );
```

Neste caso, um disco separado é usado para os dados e para os Indexes de cada `RANGE`. Muitas outras variações são possíveis; outro exemplo pode ser:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    ENGINE = MYISAM
    PARTITION BY RANGE(YEAR(purchased))
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0a
                DATA DIRECTORY = '/disk0'
                INDEX DIRECTORY = '/disk1',
            SUBPARTITION s0b
                DATA DIRECTORY = '/disk2'
                INDEX DIRECTORY = '/disk3'
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s1a
                DATA DIRECTORY = '/disk4/data'
                INDEX DIRECTORY = '/disk4/idx',
            SUBPARTITION s1b
                DATA DIRECTORY = '/disk5/data'
                INDEX DIRECTORY = '/disk5/idx'
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s2a,
            SUBPARTITION s2b
        )
    );
```

Aqui, o armazenamento é o seguinte:

* Linhas com datas `purchased` anteriores a 1990 ocupam uma vasta quantidade de espaço, então são divididas em 4 partes, com um disco separado dedicado aos dados e aos Indexes para cada uma das duas subpartitions (`s0a` e `s0b`) que compõem a PARTITION `p0`. Em outras palavras:

  + Os dados para a subpartition `s0a` são armazenados em `/disk0`.

  + Os Indexes para a subpartition `s0a` são armazenados em `/disk1`.

  + Os dados para a subpartition `s0b` são armazenados em `/disk2`.

  + Os Indexes para a subpartition `s0b` são armazenados em `/disk3`.

* Linhas contendo datas de 1990 a 1999 (PARTITION `p1`) não requerem tanto espaço quanto aquelas anteriores a 1990. Estas são divididas entre 2 discos (`/disk4` e `/disk5`) em vez de 4 discos, como ocorre com os registros legados armazenados em `p0`:

  + Dados e Indexes pertencentes à primeira subpartition de `p1` (`s1a`) são armazenados em `/disk4` — os dados em `/disk4/data` e os Indexes em `/disk4/idx`.

  + Dados e Indexes pertencentes à segunda subpartition de `p1` (`s1b`) são armazenados em `/disk5` — os dados em `/disk5/data` e os Indexes em `/disk5/idx`.

* Linhas refletindo datas do ano 2000 até o presente (PARTITION `p2`) não ocupam tanto espaço quanto o exigido pelas duas faixas anteriores. Atualmente, é suficiente armazenar tudo isso no local default.

  No futuro, quando o número de compras para a década iniciada no ano 2000 crescer a ponto de o local default não fornecer mais espaço suficiente, as linhas correspondentes poderão ser movidas usando um comando `ALTER TABLE ... REORGANIZE PARTITION`. Consulte [Section 22.3, “Partition Management”](partitioning-management.html "22.3 Partition Management"), para uma explicação de como isso pode ser feito.

As opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são permitidas em definições de PARTITION quando o SQL mode [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create) do servidor está em vigor. No MySQL 5.7, essas opções também não são permitidas ao definir subpartitions (Bug #42954).