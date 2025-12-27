### 15.2.17 Atualização de declaração

`UPDATE` é uma declaração DML que modifica linhas em uma tabela.

Uma declaração `UPDATE` pode começar com uma cláusula `WITH`) para definir expressões de tabela comuns acessíveis dentro do `UPDATE`. Veja a Seção 15.2.20, “WITH (Expressões de Tabela Comuns”)”).

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

Para a sintaxe de tabela única, a declaração `UPDATE` atualiza colunas de linhas existentes na tabela nomeada com novos valores. A cláusula `SET` indica quais colunas devem ser modificadas e os valores que devem ser atribuídos. Cada valor pode ser dado como uma expressão ou a palavra-chave `DEFAULT` para definir explicitamente uma coluna para seu valor padrão. A cláusula `WHERE`, se fornecida, especifica as condições que identificam quais linhas devem ser atualizadas. Sem a cláusula `WHERE`, todas as linhas são atualizadas. Se a cláusula `ORDER BY` for especificada, as linhas são atualizadas na ordem especificada. A cláusula `LIMIT` coloca um limite no número de linhas que podem ser atualizadas.

Para a sintaxe de múltiplas tabelas, `UPDATE` atualiza linhas em cada tabela nomeada em *`table_references`* que satisfazem as condições. Cada linha correspondente é atualizada uma vez, mesmo que corresponda às condições várias vezes. Para a sintaxe de múltiplas tabelas, `ORDER BY` e `LIMIT` não podem ser usados.

Para tabelas particionadas, tanto a forma de tabela única quanto a de múltiplas tabelas desta declaração suportam o uso de uma cláusula `PARTITION` como parte de uma referência de tabela. Esta opção recebe uma lista de uma ou mais partições ou subpartições (ou ambas). Apenas as partições (ou subpartições) listadas são verificadas para correspondências, e uma linha que não está em nenhuma dessas partições ou subpartições não é atualizada, seja ela satisfatória ou não para a *`where_condition`*.

Nota

Ao contrário do caso em que se usa `PARTITION` com uma instrução `INSERT` ou `REPLACE`, uma instrução `UPDATE ... PARTITION` que, de outra forma, é válida, é considerada bem-sucedida mesmo que nenhuma linha nas partições listadas (ou subpartições) corresponda à *`where_condition`*.

Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

*`where_condition`* é uma expressão que avalia como verdadeira para cada linha a ser atualizada. Para a sintaxe da expressão, consulte a Seção 11.5, “Expressões”.

*`table_references`* e *`where_condition`* são especificados conforme descrito na Seção 15.2.13, “Instrução SELECT”.

Você precisa do privilégio `UPDATE` apenas para as colunas referenciadas em uma `UPDATE` que são realmente atualizadas. Você precisa apenas do privilégio `SELECT` para quaisquer colunas que sejam lidas, mas não modificadas.

A instrução `UPDATE` suporta os seguintes modificadores:

* Com o modificador `LOW_PRIORITY`, a execução da `UPDATE` é adiada até que nenhum outro cliente esteja lendo da tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Com o modificador `IGNORE`, a instrução de atualização não é interrompida mesmo que ocorram erros durante a atualização. Linhas para as quais conflitos de chave duplicada ocorram em um valor de chave único não são atualizadas. Linhas atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores válidos mais próximos. Para mais informações, consulte O Efeito de IGNORE na Execução da Instrução.

As declarações `UPDATE IGNORE`, incluindo aquelas com uma cláusula `ORDER BY`, são marcadas como inseguras para a replicação baseada em declarações. (Isso ocorre porque a ordem em que as linhas são atualizadas determina quais linhas são ignoradas.) Tais declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. (Bug #11758262, Bug #50439) Veja a Seção 19.2.1.3, “Determinação de Declarações Seguras e Inseguras no Registro Binário”, para mais informações.

Se você acessar uma coluna da tabela a ser atualizada em uma expressão, o `UPDATE` usa o valor atual da coluna. Por exemplo, a seguinte declaração define `col1` como um valor maior que seu valor atual:

```
UPDATE t1 SET col1 = col1 + 1;
```

A segunda atribuição na seguinte declaração define `col2` como o valor atual (atualizado) de `col1`, e não o valor original de `col1`. O resultado é que `col1` e `col2` têm o mesmo valor. Esse comportamento difere do SQL padrão.

```
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```

Atribuições de `UPDATE` para uma única tabela são geralmente avaliadas da esquerda para a direita. Para atualizações em múltiplas tabelas, não há garantia de que as atribuições sejam realizadas em qualquer ordem específica.

Se você definir uma coluna para o valor que ela atualmente tem, o MySQL percebe isso e não a atualiza.

Se você atualizar uma coluna que foi declarada `NOT NULL` definindo-a como `NULL`, um erro ocorre se o modo SQL rigoroso estiver habilitado; caso contrário, a coluna é definida para o valor padrão implícito para o tipo de dados da coluna e a contagem de avisos é incrementada. O valor padrão implícito é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor “zero” para tipos de data e hora. Veja a Seção 13.6, “Valores Padrão de Tipo de Dados”.

Se uma coluna gerada for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

A função `mysql_info()` da API C retorna o número de linhas que foram correspondidas e atualizadas e o número de avisos que ocorreram durante a atualização.

Você pode usar `LIMIT row_count` para restringir o escopo da atualização. Uma cláusula `LIMIT` é uma restrição de correspondência de linhas. A instrução para de assim que encontrar *`row_count`* linhas que satisfazem a cláusula `WHERE`, independentemente de elas terem sido ou não atualizadas.

Se uma instrução `UPDATE` incluir uma cláusula `ORDER BY`, as linhas são atualizadas na ordem especificada pela cláusula. Isso pode ser útil em certas situações que, de outra forma, poderiam resultar em um erro. Suponha que uma tabela `t` contenha uma coluna `id` que tem um índice único. A seguinte instrução poderia falhar com um erro de chave duplicada, dependendo da ordem em que as linhas são atualizadas:

```
UPDATE t SET id = id + 1;
```

Por exemplo, se a tabela contiver 1 e 2 na coluna `id` e 1 for atualizado para 2 antes de 2 ser atualizado para 3, ocorre um erro. Para evitar esse problema, adicione uma cláusula `ORDER BY` para fazer com que as linhas com valores de `id` maiores sejam atualizadas antes daquelas com valores menores:

```
UPDATE t SET id = id + 1 ORDER BY id DESC;
```

Você também pode realizar operações de `UPDATE` cobrindo várias tabelas. No entanto, você não pode usar `ORDER BY` ou `LIMIT` com uma atualização de várias tabelas. A cláusula *`table_references`* lista as tabelas envolvidas na junção. Sua sintaxe é descrita na Seção 15.2.13.2, “Cláusula JOIN”. Aqui está um exemplo:

```
UPDATE items,month SET items.price=month.price
WHERE items.id=month.id;
```

O exemplo anterior mostra uma junção interna que usa o operador de vírgula, mas declarações `UPDATE` de múltiplas tabelas podem usar qualquer tipo de junção permitido em declarações `SELECT`, como `LEFT JOIN`.

Se você usar uma declaração `UPDATE` de múltiplas tabelas que envolve tabelas `InnoDB` para as quais existem restrições de chave estrangeira, o otimizador do MySQL pode processar as tabelas em uma ordem que difere da relação pai/filho. Nesse caso, a declaração falha e é revertida. Em vez disso, atualize uma única tabela e confie nas capacidades de `ON UPDATE` que o `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas conforme necessário. Veja a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

Você não pode atualizar uma tabela e selecionar diretamente da mesma tabela em uma subconsulta. Você pode contornar isso usando uma atualização de múltiplas tabelas na qual uma das tabelas é derivada da tabela que você realmente deseja atualizar e referenciar a tabela derivada usando um alias. Suponha que você queira atualizar uma tabela chamada `items` que é definida usando a declaração mostrada aqui:

```
CREATE TABLE items (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    wholesale DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    retail DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    quantity BIGINT NOT NULL DEFAULT 0
);
```

Para reduzir o preço de varejo de quaisquer itens para os quais a margem de lucro é de 30% ou mais e dos quais você tem menos de cem em estoque, você pode tentar usar uma declaração `UPDATE` como a seguinte, que usa uma subconsulta na cláusula `WHERE`. Como mostrado aqui, essa declaração não funciona:

```
mysql> UPDATE items
     > SET retail = retail * 0.9
     > WHERE id IN
     >     (SELECT id FROM items
     >         WHERE retail / wholesale >= 1.3 AND quantity > 100);
ERROR 1093 (HY000): You can't specify target table 'items' for update in FROM clause
```

Em vez disso, você pode usar uma atualização de múltiplas tabelas na qual a subconsulta é movida para a lista de tabelas a serem atualizadas, usando um alias para referenciá-la na cláusula `WHERE` mais externa, assim:

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

Como o otimizador tenta, por padrão, mesclar a tabela derivada `discounted` no bloco de consulta mais externo, isso só funciona se você forçar a materialização da tabela derivada. Você pode fazer isso definindo a bandeira `derived_merge` da variável de sistema `optimizer_switch` para `off` antes de executar a atualização, ou usando a dica de otimizador `NO_MERGE`, como mostrado aqui:

```
UPDATE /*+ NO_MERGE(discounted) */ items,
       (SELECT id FROM items
        WHERE retail / wholesale >= 1.3 AND quantity < 100)
        AS discounted
    SET items.retail = items.retail * 0.9
    WHERE items.id = discounted.id;
```

A vantagem de usar a dica de otimizador nesse caso é que ela só se aplica dentro do bloco de consulta onde é usada, para que não seja necessário alterar o valor de `optimizer_switch` novamente após executar o `UPDATE`.

Outra possibilidade é reescrever a subconsulta para que ela não use `IN` ou `EXISTS`, como este:

```
UPDATE items,
       (SELECT id, retail / wholesale AS markup, quantity FROM items)
       AS discounted
    SET items.retail = items.retail * 0.9
    WHERE discounted.markup >= 1.3
    AND discounted.quantity < 100
    AND items.id = discounted.id;
```

Neste caso, a subconsulta é materializada por padrão em vez de ser mesclada, então não é necessário desabilitar a mesclagem da tabela derivada.