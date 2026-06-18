#### 15.2.7.1 INSERIR ... Instrução SELECT

```
INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {   SELECT ...
      | TABLE table_name
      | VALUES row_constructor_list
    }
    [ON DUPLICATE KEY UPDATE assignment_list]


value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name =
          value
        | [row_alias.]col_name
        | [tbl_name.]col_name
        | [row_alias.]col_alias

assignment_list:
    assignment [, assignment] ...
```

Com `INSERT ... SELECT`, você pode inserir rapidamente muitas linhas em uma tabela a partir do resultado de uma instrução `SELECT`, que pode selecionar de uma ou mais tabelas. Por exemplo:

```
INSERT INTO tbl_temp2 (fld_id)
  SELECT tbl_temp1.fld_order_id
  FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

A partir do MySQL 8.0.19, você pode usar uma declaração `TABLE` no lugar de `SELECT`, conforme mostrado aqui:

```
INSERT INTO ta TABLE tb;
```

`TABLE tb` é equivalente a `SELECT * FROM tb`. Pode ser útil ao inserir todas as colunas da tabela de origem na tabela de destino, e não é necessário filtrar com WHERE. Além disso, as linhas de `TABLE` podem ser ordenadas por uma ou mais colunas usando `ORDER BY`, e o número de linhas inseridas pode ser limitado usando uma cláusula `LIMIT`. Para mais informações, consulte a Seção 15.2.16, “Instrução TABLE”.

As seguintes condições se aplicam às declarações `INSERT ... SELECT` e, salvo indicação em contrário, também às declarações `INSERT ... TABLE`:

- Especifique `IGNORE` para ignorar linhas que causariam violações de chave duplicada.

- A tabela-alvo da declaração `INSERT` pode aparecer na cláusula `FROM` da parte `SELECT` da consulta, ou como a tabela nomeada por `TABLE`. No entanto, você não pode inserir em uma tabela e selecionar dela na mesma tabela em uma subconsulta.

  Ao selecionar e inserir na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas da tabela `SELECT` e, em seguida, insere essas linhas na tabela de destino. No entanto, você não pode usar `INSERT INTO t ... SELECT ... FROM t` quando `t` é uma tabela `TEMPORARY`, porque as tabelas `TEMPORARY` não podem ser referenciadas duas vezes na mesma instrução. Por essa mesma razão, você não pode usar `INSERT INTO t ... TABLE t` quando `t` é uma tabela temporária. Veja a Seção 10.4.4, “Uso de Tabela Temporária Interna no MySQL”, e a Seção B.3.6.2, “Problemas com Tabela TEMPORARY”.

- As colunas `AUTO_INCREMENT` funcionam normalmente.

- Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes para as instruções `INSERT ... SELECT` ou `INSERT ... TABLE` (consulte a Seção 10.11.3, “Inserções Concorrentes”).

- Para evitar problemas de referência ambígua de colunas quando os `SELECT` e os `INSERT` se referem à mesma tabela, forneça um alias único para cada tabela usada na parte `SELECT` e qualifique os nomes das colunas nessa parte com o alias apropriado.

  A declaração `TABLE` não suporta aliases.

Você pode selecionar explicitamente quais partições ou subpartições (ou ambas) da tabela de origem ou destino (ou ambas) serão usadas com uma cláusula `PARTITION` após o nome da tabela. Quando `PARTITION` é usado com o nome da tabela de origem na parte `SELECT` da declaração, as linhas são selecionadas apenas das partições ou subpartições nomeadas em sua lista de partições. Quando `PARTITION` é usado com o nome da tabela de destino para a parte `INSERT` da declaração, deve ser possível inserir todas as linhas selecionadas nas partições ou subpartições nomeadas na lista de partições após a opção. Caso contrário, a declaração `INSERT ... SELECT` falha. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

`TABLE` não suporta uma cláusula `PARTITION`.

Para as declarações `INSERT ... SELECT`, consulte a Seção 15.2.7.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE” para as condições sob as quais as colunas `SELECT` podem ser referenciadas em uma cláusula `ON DUPLICATE KEY UPDATE`. Isso também funciona para `INSERT ... TABLE`.

A ordem em que uma declaração `SELECT` ou `TABLE` sem cláusula `ORDER BY` retorna linhas é não determinística. Isso significa que, ao usar a replicação, não há garantia de que uma declaração `SELECT` retorne linhas na mesma ordem na fonte e na replica, o que pode levar a inconsistências entre elas. Para evitar que isso ocorra, sempre escreva declarações `INSERT ... SELECT` ou `INSERT ... TABLE` que devem ser replicadas usando uma cláusula `ORDER BY` que produza a mesma ordem de linha na fonte e na replica. Veja também a Seção 19.5.1.18, “Replicação e LIMIT”.

Devido a esse problema, as declarações `INSERT ... SELECT ON DUPLICATE KEY UPDATE` e `INSERT IGNORE ... SELECT` são marcadas como inseguras para replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linhas ao usar o modo `MIXED`. (Bug #11758262, Bug #50439)

Veja também a Seção 19.2.1.1, “Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas”.
