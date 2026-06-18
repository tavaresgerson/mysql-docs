### 26.2.6 Subpartição

A subpartição, também conhecida como partição composta, é a divisão adicional de cada partição em uma tabela particionada. Considere a seguinte declaração `CREATE TABLE`:

```
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) )
    SUBPARTITIONS 2 (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (2000),
        PARTITION p2 VALUES LESS THAN MAXVALUE
    );
```

A tabela `ts` tem 3 `RANGE` divisões. Cada uma dessas divisões—`p0`, `p1` e `p2`—é dividida em 2 subdivisões. Na verdade, toda a tabela é dividida em `3 * 2 = 6` divisões. No entanto, devido à ação da cláusula `PARTITION BY RANGE`, os primeiros 2 desses armazenam apenas os registros com um valor menor que 1990 na coluna `purchased`.

É possível subparticionar tabelas que estão particionadas por `RANGE` ou `LIST`. As subpartições podem usar a particionamento `HASH` ou `KEY`. Isso também é conhecido como particionamento composto.

Nota

`SUBPARTITION BY HASH` e `SUBPARTITION BY KEY` geralmente seguem as mesmas regras de sintaxe que `PARTITION BY HASH` e `PARTITION BY KEY`, respectivamente. Uma exceção a isso é que `SUBPARTITION BY KEY` (ao contrário de `PARTITION BY KEY`) atualmente não suporta uma coluna padrão, então a coluna usada para esse propósito deve ser especificada, mesmo que a tabela tenha uma chave primária explícita. Esse é um problema conhecido que estamos trabalhando para resolver; veja Problemas com subpartições, para mais informações e um exemplo.

Também é possível definir subpartições explicitamente usando cláusulas `SUBPARTITION` para especificar opções para subpartições individuais. Por exemplo, uma maneira mais detalhada de criar a mesma tabela `ts` como mostrado no exemplo anterior seria:

```
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

  ```
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

  Essa declaração ainda falharia mesmo se usasse `SUBPARTITIONS 2`.

- Cada cláusula `SUBPARTITION` deve incluir (como mínimo) um nome para a subpartição. Caso contrário, você pode definir qualquer opção desejada para a subpartição ou permitir que ela assuma a configuração padrão para essa opção.

- Os nomes das subpartições devem ser únicos em toda a tabela. Por exemplo, a seguinte declaração `CREATE TABLE` é válida:

  ```
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
