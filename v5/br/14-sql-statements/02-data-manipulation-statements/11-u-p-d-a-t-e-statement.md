### 13.2.11 Declaração UPDATE

[`UPDATE`](update.html "13.2.11 UPDATE Statement") é uma declaração DML que modifica linhas em uma tabela.

Sintaxe para tabela única:

```sql
UPDATE [LOW_PRIORITY] [IGNORE] table_reference
    SET assignment_list
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]

value:
    {expr | DEFAULT}

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

Sintaxe para múltiplas tabelas:

```sql
UPDATE [LOW_PRIORITY] [IGNORE] table_references
    SET assignment_list
    [WHERE where_condition]
```

Para a sintaxe de tabela única, a declaração [`UPDATE`](update.html "13.2.11 UPDATE Statement") atualiza colunas de linhas existentes na tabela nomeada com novos valores. A cláusula `SET` indica quais colunas modificar e os valores que devem receber. Cada valor pode ser fornecido como uma expression, ou a keyword `DEFAULT` para definir explicitamente uma coluna para seu valor default. A cláusula `WHERE`, se fornecida, especifica as condições que identificam quais linhas devem ser atualizadas. Sem uma cláusula `WHERE`, todas as linhas são atualizadas. Se a cláusula `ORDER BY` for especificada, as linhas são atualizadas na ordem que é especificada. A cláusula `LIMIT` impõe um limite no número de linhas que podem ser atualizadas.

Para a sintaxe de múltiplas tabelas, [`UPDATE`](update.html "13.2.11 UPDATE Statement") atualiza linhas em cada tabela nomeada em *`table_references`* que satisfazem as condições. Cada linha correspondente é atualizada uma vez, mesmo que corresponda às condições múltiplas vezes. Para a sintaxe de múltiplas tabelas, `ORDER BY` e `LIMIT` não podem ser usados.

Para tabelas particionadas, tanto a forma de tabela única quanto a de múltiplas tabelas desta declaração suportam o uso de uma cláusula `PARTITION` como parte de uma referência de tabela. Esta opção aceita uma lista de uma ou mais partitions ou subpartitions (ou ambas). Apenas as partitions (ou subpartitions) listadas são verificadas quanto a correspondências, e uma linha que não está em nenhuma dessas partitions ou subpartitions não é atualizada, satisfaça ela ou não a *`where_condition`*.

Nota

Diferentemente do caso em que se usa `PARTITION` com uma declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), uma declaração `UPDATE ... PARTITION` que seja válida é considerada bem-sucedida mesmo que nenhuma linha nas partitions (ou subpartitions) listadas corresponda à *`where_condition`*.

Para mais informações e exemplos, consulte [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Partition Selection").

*`where_condition`* é uma expression que avalia como true para cada linha a ser atualizada. Para a sintaxe de expression, consulte [Seção 9.5, “Expressions”](expressions.html "9.5 Expressions").

*`table_references`* e *`where_condition`* são especificados conforme descrito na [Seção 13.2.9, “Declaração SELECT”](select.html "13.2.9 SELECT Statement").

Você precisa do privilégio [`UPDATE`](privileges-provided.html#priv_update) apenas para colunas referenciadas em um [`UPDATE`] que são efetivamente atualizadas. Você precisa apenas do privilégio [`SELECT`](privileges-provided.html#priv_select) para quaisquer colunas que são lidas, mas não modificadas.

A declaração [`UPDATE`](update.html "13.2.11 UPDATE Statement") suporta os seguintes modificadores:

* Com o modificador `LOW_PRIORITY`, a execução do [`UPDATE`](update.html "13.2.11 UPDATE Statement") é adiada até que nenhum outro client esteja lendo a tabela. Isso afeta apenas storage engines que usam somente locking de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Com o modificador `IGNORE`, a declaração de update não aborta mesmo que ocorram erros durante a atualização. Linhas para as quais ocorrem conflitos de duplicate-key em um valor de unique key não são atualizadas. Linhas atualizadas para valores que causariam erros de conversão de dados são, em vez disso, atualizadas para os valores válidos mais próximos. Para mais informações, consulte [O Efeito de IGNORE na Execução de Declarações](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution").

Declarações [`UPDATE IGNORE`](update.html "13.2.11 UPDATE Statement"), incluindo aquelas que possuem uma cláusula `ORDER BY`, são sinalizadas como inseguras para replication baseada em declaração (statement-based replication). (Isso ocorre porque a ordem em que as linhas são atualizadas determina quais linhas são ignoradas.) Tais declarações produzem um warning no error log ao usar o modo statement-based e são escritas no binary log usando o formato row-based quando se usa o modo `MIXED`. (Bug #11758262, Bug #50439) Consulte [Seção 16.2.1.3, “Determinação de Declarações Seguras e Inseguras no Binary Logging”](replication-rbr-safe-unsafe.html "16.2.1.3 Determination of Safe and Unsafe Statements in Binary Logging"), para mais informações.

Se você acessar uma coluna da tabela a ser atualizada em uma expression, [`UPDATE`](update.html "13.2.11 UPDATE Statement") usa o valor current da coluna. Por exemplo, a seguinte declaração define `col1` para um a mais do que seu valor current:

```sql
UPDATE t1 SET col1 = col1 + 1;
```

A segunda atribuição na declaração a seguir define `col2` para o valor current (atualizado) de `col1`, e não para o valor original de `col1`. O resultado é que `col1` e `col2` terão o mesmo valor. Este comportamento difere do SQL padrão.

```sql
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```

Atribuições de [`UPDATE`](update.html "13.2.11 UPDATE Statement") em tabela única são geralmente avaliadas da esquerda para a direita. Para updates de múltiplas tabelas, não há garantia de que as atribuições sejam realizadas em qualquer ordem específica.

Se você definir uma coluna para o valor que ela atualmente possui, o MySQL nota isso e não a atualiza.

Se você atualizar uma coluna que foi declarada `NOT NULL` definindo-a como `NULL`, um erro ocorre se o strict SQL mode estiver habilitado; caso contrário, a coluna é definida para o valor default implícito para o data type da coluna e a contagem de warnings é incrementada. O valor default implícito é `0` para tipos numéricos, a string vazia (`''`) para tipos string e o valor “zero” para tipos date e time. Consulte [Seção 11.6, “Valores Default de Tipos de Dados”](data-type-defaults.html "11.6 Data Type Default Values").

Se uma generated column for explicitamente atualizada, o único valor permitido é `DEFAULT`. Para informações sobre generated columns, consulte [Seção 13.1.18.7, “CREATE TABLE e Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

[`UPDATE`](update.html "13.2.11 UPDATE Statement") retorna o número de linhas que foram efetivamente alteradas. A função C API [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html) retorna o número de linhas que foram correspondidas e atualizadas e o número de warnings que ocorreram durante o [`UPDATE`](update.html "13.2.11 UPDATE Statement").

Você pode usar `LIMIT row_count` para restringir o escopo do [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Uma cláusula `LIMIT` é uma restrição de linhas correspondidas. A declaração para assim que encontrar *`row_count`* linhas que satisfaçam a cláusula `WHERE`, independentemente de terem sido realmente alteradas ou não.

Se uma declaração [`UPDATE`](update.html "13.2.11 UPDATE Statement") incluir uma cláusula `ORDER BY`, as linhas são atualizadas na ordem especificada pela cláusula. Isso pode ser útil em certas situações que, de outra forma, poderiam resultar em um erro. Suponha que uma tabela `t` contenha uma coluna `id` que possui um unique index. A seguinte declaração pode falhar com um erro de duplicate-key, dependendo da ordem em que as linhas são atualizadas:

```sql
UPDATE t SET id = id + 1;
```

Por exemplo, se a tabela contém 1 e 2 na coluna `id` e 1 é atualizado para 2 antes que 2 seja atualizado para 3, ocorre um erro. Para evitar este problema, adicione uma cláusula `ORDER BY` para fazer com que as linhas com valores `id` maiores sejam atualizadas antes daquelas com valores menores:

```sql
UPDATE t SET id = id + 1 ORDER BY id DESC;
```

Você também pode realizar operações [`UPDATE`](update.html "13.2.11 UPDATE Statement") cobrindo múltiplas tabelas. No entanto, você não pode usar `ORDER BY` ou `LIMIT` com um [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas tabelas. A cláusula *`table_references`* lista as tabelas envolvidas no join. Sua sintaxe é descrita na [Seção 13.2.9.2, “Cláusula JOIN”](join.html "13.2.9.2 JOIN Clause"). Aqui está um exemplo:

```sql
UPDATE items,month SET items.price=month.price
WHERE items.id=month.id;
```

O exemplo anterior mostra um inner join que usa o operador de vírgula, mas declarações [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas tabelas podem usar qualquer tipo de join permitido em declarações [`SELECT`](select.html "13.2.9 SELECT Statement"), como `LEFT JOIN`.

Se você usar uma declaração [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas tabelas envolvendo tabelas `InnoDB` para as quais existem foreign key constraints, o optimizer do MySQL pode processar as tabelas em uma ordem que difere da ordem de seu relacionamento pai/filho. Neste caso, a declaração falha e é revertida (roll back). Em vez disso, atualize uma única tabela e confie nas capacidades `ON UPDATE` que o `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas de acordo. Consulte [Seção 13.1.18.5, “Restrições FOREIGN KEY”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

Você não pode atualizar uma tabela e selecionar diretamente da mesma tabela em uma subquery. Você pode contornar isso usando um update de múltiplas tabelas no qual uma das tabelas é derivada da tabela que você realmente deseja atualizar, e referenciando a tabela derivada usando um alias. Suponha que você deseje atualizar uma tabela chamada `items` que é definida usando a declaração mostrada aqui:

```sql
CREATE TABLE items (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    wholesale DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    retail DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    quantity BIGINT NOT NULL DEFAULT 0
);
```

Para reduzir o retail price (preço de varejo) de quaisquer itens para os quais o markup é de 30% ou mais e dos quais você tem menos de cem em stock, você pode tentar usar uma declaração `UPDATE` como a seguinte, que usa uma subquery na cláusula `WHERE`. Conforme mostrado aqui, esta declaração não funciona:

```sql
mysql> UPDATE items
     > SET retail = retail * 0.9
     > WHERE id IN
     >     (SELECT id FROM items
     >         WHERE retail / wholesale >= 1.3 AND quantity > 100);
ERROR 1093 (HY000): You can't specify target table 'items' for update in FROM clause
```

Em vez disso, você pode empregar um update de múltiplas tabelas no qual a subquery é movida para a lista de tabelas a serem atualizadas, usando um alias para referenciá-la na cláusula `WHERE` mais externa, assim:

```sql
UPDATE items,
       (SELECT id FROM items
        WHERE id IN
            (SELECT id FROM items
             WHERE retail / wholesale >= 1.3 AND quantity < 100))
        AS discounted
SET items.retail = items.retail * 0.9
WHERE items.id = discounted.id;
```

Como o optimizer tenta por default mesclar a derived table `discounted` no query block mais externo, isso só funciona se você forçar a materialization da tabela derivada. Você pode fazer isso definindo o flag [`derived_merge`](switchable-optimizations.html#optflag_derived-merge) da variável de sistema [`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch) como `off` antes de executar o update, ou usando o optimizer hint [`NO_MERGE`](optimizer-hints.html#optimizer-hints-table-level "Table-Level Optimizer Hints"), conforme mostrado aqui:

```sql
UPDATE /*+ NO_MERGE(discounted) */ items,
       (SELECT id FROM items
        WHERE retail / wholesale >= 1.3 AND quantity < 100)
        AS discounted
    SET items.retail = items.retail * 0.9
    WHERE items.id = discounted.id;
```

A vantagem de usar o optimizer hint em tal caso é que ele se aplica apenas dentro do query block onde é usado, de modo que não é necessário alterar o valor de `optimizer_switch` novamente após executar o `UPDATE`.

Outra possibilidade é reescrever a subquery para que ela não use `IN` ou `EXISTS`, assim:

```sql
UPDATE items,
       (SELECT id, retail / wholesale AS markup, quantity FROM items)
       AS discounted
    SET items.retail = items.retail * 0.9
    WHERE discounted.markup >= 1.3
    AND discounted.quantity < 100
    AND items.id = discounted.id;
```

Neste caso, a subquery é materializada por default em vez de mesclada, portanto não é necessário desabilitar a mesclagem da derived table.