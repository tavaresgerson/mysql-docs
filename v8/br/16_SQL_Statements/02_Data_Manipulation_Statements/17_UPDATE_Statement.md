### 15.2.17 Atualização da declaração

`UPDATE` é uma instrução DML que modifica linhas em uma tabela.

Uma declaração `UPDATE` pode começar com uma cláusula `WITH`") para definir expressões de tabela comuns acessíveis dentro do `UPDATE`. Veja a Seção 15.2.20, “Com (Expressões de Tabela Comuns”)”).

Sintaxe de tabela única:

```
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

Sintaxe de múltiplas tabelas:

```
UPDATE [LOW_PRIORITY] [IGNORE] table_references
    SET assignment_list
    [WHERE where_condition]
```

Para a sintaxe de tabela única, a declaração `UPDATE` atualiza as colunas das linhas existentes na tabela nomeada com novos valores. A cláusula `SET` indica quais colunas devem ser modificadas e os valores que devem ser atribuídos. Cada valor pode ser fornecido como uma expressão ou a palavra-chave `DEFAULT` para definir uma coluna explicitamente para seu valor padrão. A cláusula `WHERE`, se fornecida, especifica as condições que identificam quais linhas devem ser atualizadas. Sem a cláusula `WHERE`, todas as linhas são atualizadas. Se a cláusula `ORDER BY` for especificada, as linhas são atualizadas na ordem especificada. A cláusula `LIMIT` coloca um limite no número de linhas que podem ser atualizadas.

Para a sintaxe de múltiplas tabelas, `UPDATE` atualiza linhas em cada tabela nomeada em `table_references` que satisfazem as condições. Cada linha correspondente é atualizada uma vez, mesmo que ela corresponda às condições várias vezes. Para a sintaxe de múltiplas tabelas, `ORDER BY` e `LIMIT` não podem ser usados.

Para tabelas particionadas, tanto o formato de uma única tabela quanto o formato de várias tabelas desta declaração suportam o uso de uma cláusula `PARTITION` como parte de uma referência de tabela. Esta opção aceita uma lista de uma ou mais partições ou subpartições (ou ambas). Apenas as partições (ou subpartições) listadas são verificadas quanto a correspondências, e uma linha que não está em nenhuma dessas partições ou subpartições não é atualizada, independentemente de atender ao `where_condition` ou

Nota

Ao contrário do caso em que se usa `PARTITION` com uma declaração `INSERT` ou `REPLACE`, uma declaração `UPDATE ... PARTITION` válida, mesmo que nenhuma linha nas partições listadas (ou subpartições) corresponda ao `where_condition`, é considerada bem-sucedida.

Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partição”.

`where_condition` é uma expressão que avalia como verdadeira para cada linha a ser atualizada. Para a sintaxe da expressão, consulte a Seção 11.5, “Expressões”.

`table_references` e `where_condition` são especificados conforme descrito na Seção 15.2.13, “Instrução SELECT”.

Você precisa do privilégio `UPDATE` apenas para as colunas referenciadas em um `UPDATE` que são realmente atualizadas. Você precisa apenas do privilégio `SELECT` para quaisquer colunas que sejam lidas, mas não modificadas.

A declaração `UPDATE` suporta os seguintes modificadores:

- Com o modificador `LOW_PRIORITY`, a execução do `UPDATE` é adiada até que nenhum outro cliente esteja lendo a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

- Com o modificador `IGNORE`, a instrução de atualização não é interrompida, mesmo que ocorram erros durante a atualização. As linhas para as quais conflitos de chave duplicada ocorrem em um valor de chave único não são atualizadas. As linhas atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores válidos mais próximos, em vez disso. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

As declarações `UPDATE IGNORE` (incluindo aquelas com uma cláusula `ORDER BY`) são marcadas como inseguras para replicação baseada em declarações. (Isso ocorre porque a ordem em que as linhas são atualizadas determina quais linhas são ignoradas.) Tais declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linhas ao usar o modo `MIXED`. (Bug #11758262, Bug #50439) Consulte a Seção 19.2.1.3, “Determinação de declarações seguras e inseguras no registro binário”, para obter mais informações.

Se você acessar uma coluna da tabela que será atualizada em uma expressão, o `UPDATE` usa o valor atual da coluna. Por exemplo, a seguinte declaração define o `col1` como um valor maior que seu valor atual:

```
UPDATE t1 SET col1 = col1 + 1;
```

A segunda atribuição na seguinte declaração define `col2` com o valor atual (atualizado) de `col1`, e não o valor original de `col1`. O resultado é que `col1` e `col2` têm o mesmo valor. Esse comportamento difere do SQL padrão.

```
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```

As atribuições de tabela única `UPDATE` são geralmente avaliadas da esquerda para a direita. Para atualizações de múltiplas tabelas, não há garantia de que as atribuições sejam realizadas em qualquer ordem específica.

Se você definir uma coluna para o valor que ela tem atualmente, o MySQL percebe isso e não a atualiza.

Se você atualizar uma coluna que foi declarada como `NOT NULL` definindo-a como `NULL`, um erro ocorrerá se o modo SQL rigoroso estiver ativado; caso contrário, a coluna será definida pelo valor padrão implícito para o tipo de dados da coluna e a contagem de avisos será incrementada. O valor padrão implícito é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor “zero” para tipos de data e hora. Veja a Seção 13.6, “Valores padrão de tipo de dados”.

Se uma coluna gerada for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

`UPDATE` retorna o número de linhas que foram realmente alteradas. A função API C `mysql_info()` retorna o número de linhas que foram correspondidas e atualizadas, além do número de avisos que ocorreram durante o `UPDATE`.

Você pode usar `LIMIT row_count` para restringir o escopo do `UPDATE`. Uma cláusula `LIMIT` é uma restrição de correspondência de linhas. A instrução para de quando encontrar `row_count` linhas que satisfazem a cláusula `WHERE`, independentemente de elas terem sido realmente alteradas ou

Se uma declaração `UPDATE` incluir uma cláusula `ORDER BY`, as linhas são atualizadas na ordem especificada pela cláusula. Isso pode ser útil em certas situações que, de outra forma, poderiam resultar em um erro. Suponha que uma tabela `t` contenha uma coluna `id` que tem um índice único. A seguinte declaração poderia falhar com um erro de chave duplicada, dependendo da ordem em que as linhas são atualizadas:

```
UPDATE t SET id = id + 1;
```

Por exemplo, se a tabela contiver 1 e 2 na coluna `id` e 1 for atualizado para 2 antes de 2 ser atualizado para 3, ocorrerá um erro. Para evitar esse problema, adicione uma cláusula `ORDER BY` para fazer com que as linhas com valores maiores de `id` sejam atualizadas antes daquelas com valores menores:

```
UPDATE t SET id = id + 1 ORDER BY id DESC;
```

Você também pode realizar operações `UPDATE` que abrangem várias tabelas. No entanto, você não pode usar `ORDER BY` ou `LIMIT` com uma tabela múltipla `UPDATE`. A cláusula `table_references` lista as tabelas envolvidas na junção. Sua sintaxe é descrita na Seção 15.2.13.2, “Cláusula JOIN”. Aqui está um exemplo:

```
UPDATE items,month SET items.price=month.price
WHERE items.id=month.id;
```

O exemplo anterior mostra uma junção interna que usa o operador vírgula, mas as instruções de múltiplas tabelas `UPDATE` podem usar qualquer tipo de junção permitido nas instruções `SELECT`, como `LEFT JOIN`.

Se você usar uma instrução múltipla `UPDATE` que envolve tabelas `InnoDB` para as quais existem restrições de chave estrangeira, o otimizador do MySQL pode processar as tabelas em uma ordem diferente daquela de sua relação pai/filho. Nesse caso, a instrução falha e é revertida. Em vez disso, atualize uma única tabela e confie nas capacidades do `ON UPDATE` que o `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas conforme necessário. Veja a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

Você não pode atualizar uma tabela e selecionar diretamente da mesma tabela em uma subconsulta. Você pode contornar isso usando uma atualização de várias tabelas, na qual uma das tabelas é derivada da tabela que você realmente deseja atualizar, e referenciando a tabela derivada usando um alias. Suponha que você queira atualizar uma tabela chamada `items`, que é definida usando a declaração mostrada aqui:

```
CREATE TABLE items (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    wholesale DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    retail DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    quantity BIGINT NOT NULL DEFAULT 0
);
```

Para reduzir o preço de varejo de qualquer item para o qual a margem de lucro seja de 30% ou mais e para o qual você tenha menos de cem unidades em estoque, você pode tentar usar uma declaração `UPDATE` como a seguinte, que utiliza uma subconsulta na cláusula `WHERE`. Como mostrado aqui, essa declaração não funciona:

```
mysql> UPDATE items
     > SET retail = retail * 0.9
     > WHERE id IN
     >     (SELECT id FROM items
     >         WHERE retail / wholesale >= 1.3 AND quantity > 100);
ERROR 1093 (HY000): You can't specify target table 'items' for update in FROM clause
```

Em vez disso, você pode usar uma atualização de múltiplas tabelas na qual a subconsulta é movida para a lista de tabelas a serem atualizadas, usando um alias para referenciá-la na cláusula mais externa `WHERE`, assim:

```
UPDATE items,
       (SELECT id FROM items
        WHERE id IN
            (SELECT id FROM items
             WHERE retail / wholesale >= 1.3 AND quantity < 100))
        AS discounted
SET items.retail = items.retail * 0.9
WHERE items.id = discounted.id;
```

Como o otimizador tenta, por padrão, combinar a tabela derivada `discounted` no bloco de consulta mais externo, isso só funciona se você forçar a materialização da tabela derivada. Você pode fazer isso definindo a bandeira `derived_merge` da variável de sistema `optimizer_switch` para `off` antes de executar a atualização, ou usando a dica de otimizador `NO_MERGE`, como mostrado aqui:

```
UPDATE /*+ NO_MERGE(discounted) */ items,
       (SELECT id FROM items
        WHERE retail / wholesale >= 1.3 AND quantity < 100)
        AS discounted
    SET items.retail = items.retail * 0.9
    WHERE items.id = discounted.id;
```

A vantagem de usar o hint de otimizador nesse caso é que ele se aplica apenas dentro do bloco de consulta onde é usado, para que não seja necessário alterar o valor de `optimizer_switch` novamente após a execução do `UPDATE`.

Outra possibilidade é reescrever a subconsulta para que ela não utilize `IN` ou `EXISTS`, como este:

```
UPDATE items,
       (SELECT id, retail / wholesale AS markup, quantity FROM items)
       AS discounted
    SET items.retail = items.retail * 0.9
    WHERE discounted.markup >= 1.3
    AND discounted.quantity < 100
    AND items.id = discounted.id;
```

Nesse caso, a subconsulta é materializada por padrão, em vez de ser mesclada, portanto, não é necessário desativar a mesclagem da tabela derivada.
