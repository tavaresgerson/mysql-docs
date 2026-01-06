#### 13.2.5.1 Inserir ... Instrução SELECT

```sql
INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

Com `INSERT ... SELECT`, você pode inserir rapidamente muitas linhas em uma tabela a partir do resultado de uma instrução `SELECT`, que pode selecionar de uma ou mais tabelas. Por exemplo:

```sql
INSERT INTO tbl_temp2 (fld_id)
  SELECT tbl_temp1.fld_order_id
  FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

As seguintes condições se aplicam às instruções `INSERT ... SELECT`:

- Especifique `IGNORE` para ignorar linhas que causariam violações de chave duplicada.

- A tabela de destino da instrução `INSERT` pode aparecer na cláusula `FROM` da parte `SELECT` da consulta. No entanto, você não pode inserir em uma tabela e selecionar dela na mesma tabela em uma subconsulta.

  Ao selecionar e inserir na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas do `SELECT` e, em seguida, insere essas linhas na tabela de destino. No entanto, você não pode usar `INSERT INTO t ... SELECT ... FROM t` quando `t` é uma tabela `TEMPORARY`, porque as tabelas `TEMPORARY` não podem ser referenciadas duas vezes na mesma instrução. Veja Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL” e Seção B.3.6.2, “Problemas com Tabela TEMPORARY”.

- As colunas `AUTO_INCREMENT` funcionam normalmente.

- Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes para instruções `INSERT ... SELECT` (consulte Seção 8.11.3, “Inserções Concorrentes”).

- Para evitar problemas de referência ambígua de colunas quando o `SELECT` e o `INSERT` se referem à mesma tabela, forneça um alias único para cada tabela usada na parte `SELECT` e qualifique os nomes das colunas nessa parte com o alias apropriado.

Você pode selecionar explicitamente quais partições ou subpartições (ou ambas) da tabela de origem ou destino (ou ambas) serão usadas com uma cláusula `PARTITION` após o nome da tabela. Quando `PARTITION` é usado com o nome da tabela de origem na parte `SELECT` da declaração, as linhas são selecionadas apenas das partições ou subpartições nomeadas em sua lista de partições. Quando `PARTITION` é usado com o nome da tabela de destino para a parte `INSERT` da declaração, deve ser possível inserir todas as linhas selecionadas nas partições ou subpartições nomeadas na lista de partições que segue a opção. Caso contrário, a declaração `INSERT ... SELECT` falha. Para mais informações e exemplos, consulte Seção 22.5, “Seleção de Partição”.

Para as instruções `INSERT ... SELECT`, consulte Seção 13.2.5.2, “Instrução `INSERT ... ON DUPLICATE KEY UPDATE`” para as condições sob as quais as colunas do `SELECT` podem ser referenciadas em uma cláusula `ON DUPLICATE KEY UPDATE`.

A ordem em que uma instrução `SELECT` sem cláusula `ORDER BY` retorna as linhas é não determinística. Isso significa que, ao usar a replicação, não há garantia de que essa instrução `SELECT` retorne as linhas na mesma ordem na fonte e na replica, o que pode levar a inconsistências entre elas. Para evitar que isso ocorra, sempre escreva instruções `INSERT ... SELECT` que devem ser replicadas usando uma cláusula `ORDER BY` que produza a mesma ordem de linha na fonte e na replica. Veja também Seção 16.4.1.17, “Replicação e LIMIT”.

Devido a esse problema, as instruções `INSERT ... SELECT ON DUPLICATE KEY UPDATE` e `INSERT IGNORE ... SELECT` são marcadas como inseguras para a replicação baseada em instruções. Essas instruções produzem um aviso no log de erro ao usar o modo baseado em instruções e são escritas no log binário usando o formato baseado em linhas quando o modo `MIXED` é usado. (Bug #11758262, Bug #50439)

Veja também Seção 16.2.1.1, “Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas”.

Uma instrução `INSERT ... SELECT` que afeta tabelas particionadas usando um mecanismo de armazenamento como `MyISAM` que emprega bloqueios de nível de tabela bloqueia todas as partições da tabela de destino; no entanto, apenas as partições que são realmente lidas da tabela de origem são bloqueadas. (Isso não ocorre com tabelas que usam mecanismos de armazenamento como `InnoDB` que emprega bloqueios de nível de linha.) Para mais informações, consulte Seção 22.6.4, “Particionamento e Bloqueio”.
