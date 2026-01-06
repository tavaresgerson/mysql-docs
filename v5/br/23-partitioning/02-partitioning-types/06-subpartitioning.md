### 22.2.6 Subpartição

A subpartição, também conhecida como partição composta, é a divisão adicional de cada partição em uma tabela particionada. Considere a seguinte instrução `CREATE TABLE`:

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

A tabela `ts` tem 3 partições `RANGE`. Cada uma dessas partições — `p0`, `p1` e `p2` — é dividida em 2 subpartições. Na verdade, toda a tabela é dividida em `3 * 2 = 6` partições. No entanto, devido à ação da cláusula `PARTITION BY RANGE`, as primeiras 2 dessas armazenam apenas os registros com um valor menor que 1990 na coluna `purchased`.

No MySQL 5.7, é possível subparticionar tabelas que são particionadas por `RANGE` ou `LIST`. As subpartições podem usar particionamento `HASH` ou `KEY`. Isso também é conhecido como particionamento composto.

Nota

`SUBPARTITION BY HASH` e `SUBPARTITION BY KEY` geralmente seguem as mesmas regras de sintaxe que `PARTITION BY HASH` e `PARTITION BY KEY`, respectivamente. Uma exceção a isso é que `SUBPARTITION BY KEY` (ao contrário de `PARTITION BY KEY`) atualmente não suporta uma coluna padrão, então a coluna usada para esse propósito deve ser especificada, mesmo que a tabela tenha uma chave primária explícita. Esse é um problema conhecido que estamos trabalhando para resolver; veja Problemas com subpartições, para mais informações e um exemplo.

Também é possível definir subpartições explicitamente usando cláusulas `SUBPARTITION` para especificar opções para subpartições individuais. Por exemplo, uma maneira mais detalhada de criar a mesma tabela `ts` como mostrado no exemplo anterior seria:

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

Alguns itens sintáticos de destaque estão listados aqui:

- Cada partição deve ter o mesmo número de subpartições.

- Se você definir explicitamente quaisquer subpartições usando `SUBPARTITION` em qualquer partição de uma tabela particionada, você deve defini-las todas. Em outras palavras, a seguinte declaração falha:

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

  Essa declaração ainda falharia mesmo se incluísse uma cláusula `SUBPARTITIONS 2`.

- Cada cláusula `SUBPARTITION` deve incluir (como mínimo) um nome para a subpartição. Caso contrário, você pode definir qualquer opção desejada para a subpartição ou permitir que ela assuma a configuração padrão para essa opção.

- Os nomes das subpartições devem ser únicos em toda a tabela. Por exemplo, a seguinte instrução `CREATE TABLE` é válida no MySQL 5.7:

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

As subpartições podem ser usadas com tabelas especialmente grandes do tipo `MyISAM` para distribuir dados e índices por vários discos. Suponha que você tenha 6 discos montados como `/disk0`, `/disk1`, `/disk2`, e assim por diante. Agora, considere o seguinte exemplo:

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

Nesse caso, um disco separado é usado para os dados e para os índices de cada `RANGE`. Muitas outras variações são possíveis; outro exemplo pode ser:

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

- As linhas com datas de compra anteriores a 1990 ocupam uma quantidade enorme de espaço, então são divididas em 4 partes, com um disco separado dedicado aos dados e aos índices para cada uma das duas subpartições (`s0a` e `s0b`), que compõem a partição `p0`. Em outras palavras:

  - Os dados da subpartição `s0a` são armazenados em `/disk0`.

  - Os índices para a subpartição `s0a` são armazenados em `/disk1`.

  - Os dados da subpartição `s0b` são armazenados em `/disk2`.

  - Os índices para a subpartição `s0b` são armazenados em `/disk3`.

- As linhas que contêm datas entre 1990 e 1999 (partição `p1`) não exigem tanto espaço quanto as de antes de 1990. Essas são divididas entre 2 discos (`/disk4` e `/disk5`) em vez de 4 discos, como os registros antigos armazenados em `p0`:

  - Os dados e índices pertencentes à primeira subpartição de `p1` (`s1a`) são armazenados em `/disk4` — os dados em `/disk4/data` e os índices em `/disk4/idx`.

  - Os dados e índices pertencentes à segunda subpartição de `p1` (`s1b`) são armazenados em `/disk5` — os dados em `/disk5/data` e os índices em `/disk5/idx`.

- As linhas que refletem datas do ano 2000 até o presente (partição `p2`) não ocupam tanto espaço quanto o necessário para qualquer uma das duas faixas anteriores. Atualmente, é suficiente armazenar todas essas informações na localização padrão.

  No futuro, quando o número de compras para a década que começa com o ano de 2000 crescer para um ponto em que a localização padrão não fornecer mais espaço suficiente, as linhas correspondentes podem ser movidas usando uma declaração `ALTER TABLE ... REORGANIZE PARTITION`. Veja Seção 22.3, “Gestão de Partições”, para uma explicação de como isso pode ser feito.

As opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são permitidas nas definições de partições quando o modo SQL do servidor `NO_DIR_IN_CREATE` está em vigor. No MySQL 5.7, essas opções também não são permitidas ao definir subpartições (Bug #42954).
