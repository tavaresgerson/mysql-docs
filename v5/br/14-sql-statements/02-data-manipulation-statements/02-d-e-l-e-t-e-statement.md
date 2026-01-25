### 13.2.2 Declaração DELETE

[`DELETE`](delete.html "13.2.2 DELETE Statement") é uma declaração DML que remove linhas de uma tabela.

#### Sintaxe de Tabela Única

```sql
DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]
```

A declaração `DELETE` apaga linhas de *`tbl_name`* e retorna o número de linhas apagadas. Para verificar o número de linhas apagadas, chame a função [`ROW_COUNT()`](information-functions.html#function_row-count) descrita na [Seção 12.15, “Funções de Informação”](information-functions.html "12.15 Information Functions").

#### Cláusulas Principais

As condições na cláusula opcional `WHERE` identificam quais linhas apagar. Sem a cláusula `WHERE`, todas as linhas são apagadas.

*`where_condition`* é uma expressão que é avaliada como verdadeira para cada linha a ser apagada. Ela é especificada conforme descrito na [Seção 13.2.9, “Declaração SELECT”](select.html "13.2.9 SELECT Statement").

Se a cláusula `ORDER BY` for especificada, as linhas são apagadas na ordem especificada. A cláusula `LIMIT` impõe um limite no número de linhas que podem ser apagadas. Essas cláusulas se aplicam a DELETEs de tabela única, mas não a DELETEs de múltiplas tabelas.

#### Sintaxe de Múltiplas Tabelas

```sql
DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    tbl_name[.*] [, tbl_name[.* ...
    FROM table_references
    [WHERE where_condition]

DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    FROM tbl_name[.*] [, tbl_name[.* ...
    USING table_references
    [WHERE where_condition]
```

#### Privilégios

Você precisa do privilégio [`DELETE`](privileges-provided.html#priv_delete) em uma tabela para apagar linhas dela. Você precisa apenas do privilégio [`SELECT`](privileges-provided.html#priv_select) para quaisquer colunas que são somente lidas, como aquelas nomeadas na cláusula `WHERE`.

#### Desempenho

Quando você não precisa saber o número de linhas apagadas, a declaração [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é uma maneira mais rápida de esvaziar uma tabela do que uma declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") sem a cláusula `WHERE`. Diferente de [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não pode ser usada dentro de uma transaction ou se houver um Lock na tabela. Consulte a [Seção 13.1.34, “Declaração TRUNCATE TABLE”](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") e a [Seção 13.3.5, “Declarações LOCK TABLES e UNLOCK TABLES”](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

A velocidade das operações de DELETE também pode ser afetada por fatores discutidos na [Seção 8.2.4.3, “Otimizando Declarações DELETE”](delete-optimization.html "8.2.4.3 Optimizing DELETE Statements").

Para garantir que uma determinada declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") não demore muito, a cláusula `LIMIT row_count`, específica do MySQL para [`DELETE`](delete.html "13.2.2 DELETE Statement"), especifica o número máximo de linhas a serem apagadas. Se o número de linhas a serem apagadas for maior que o limite, repita a declaração `DELETE` até que o número de linhas afetadas seja menor que o valor do `LIMIT`.

#### Subqueries

Você não pode apagar de uma tabela e selecionar da mesma tabela em uma subquery.

#### Suporte para Tabelas Particionadas

`DELETE` suporta seleção de partition explícita usando a cláusula `PARTITION`, que aceita uma lista de nomes separados por vírgula de uma ou mais partitions ou subpartitions (ou ambas) das quais as linhas a serem eliminadas serão selecionadas. Partitions não incluídas na lista são ignoradas. Dada uma tabela particionada `t` com uma partition chamada `p0`, a execução da declaração `DELETE FROM t PARTITION (p0)` tem o mesmo efeito na tabela que a execução de [`ALTER TABLE t TRUNCATE PARTITION (p0)`](alter-table.html "13.1.8 ALTER TABLE Statement"); em ambos os casos, todas as linhas na partition `p0` são eliminadas.

`PARTITION` pode ser usada juntamente com uma condição `WHERE`, caso em que a condição é testada apenas nas linhas das partitions listadas. Por exemplo, `DELETE FROM t PARTITION (p0) WHERE c < 5` apaga linhas apenas da partition `p0` para as quais a condição `c < 5` é verdadeira; linhas em quaisquer outras partitions não são verificadas e, portanto, não são afetadas pelo `DELETE`.

A cláusula `PARTITION` também pode ser usada em declarações `DELETE` de múltiplas tabelas. Você pode usar até uma opção como essa por tabela nomeada na opção `FROM`.

Para mais informações e exemplos, consulte a [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Partition Selection").

#### Colunas AUTO_INCREMENT

Se você apagar a linha contendo o valor máximo para uma coluna `AUTO_INCREMENT`, o valor não é reutilizado para uma tabela `MyISAM` ou `InnoDB`. Se você apagar todas as linhas na tabela com `DELETE FROM tbl_name` (sem uma cláusula `WHERE`) no modo [`autocommit`](server-system-variables.html#sysvar_autocommit), a sequência recomeça para todos os storage engines, exceto `InnoDB` e `MyISAM`. Existem algumas exceções a este comportamento para tabelas `InnoDB`, conforme discutido na [Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”](innodb-auto-increment-handling.html "14.6.1.6 AUTO_INCREMENT Handling in InnoDB").

Para tabelas `MyISAM`, você pode especificar uma coluna `AUTO_INCREMENT` secundária em uma chave de múltiplas colunas. Neste caso, a reutilização de valores apagados do topo da sequência ocorre mesmo para tabelas `MyISAM`. Consulte a [Seção 3.6.9, “Usando AUTO_INCREMENT”](example-auto-increment.html "3.6.9 Using AUTO_INCREMENT").

#### Modificadores

A declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") suporta os seguintes modificadores:

* Se você especificar o modificador `LOW_PRIORITY`, o servidor atrasa a execução do [`DELETE`](delete.html "13.2.2 DELETE Statement") até que nenhum outro cliente esteja lendo a tabela. Isso afeta apenas os storage engines que usam apenas table-level locking (como `MyISAM`, `MEMORY` e `MERGE`).

* Para tabelas `MyISAM`, se você usar o modificador `QUICK`, o storage engine não mescla Index leaves durante o DELETE, o que pode acelerar alguns tipos de operações de DELETE.

* O modificador `IGNORE` faz com que o MySQL ignore erros que podem ser ignorados durante o processo de apagar linhas. (Erros encontrados durante a fase de parsing são processados da maneira usual.) Erros que são ignorados devido ao uso de `IGNORE` são retornados como warnings. Para mais informações, consulte [O Efeito de IGNORE na Execução de Declarações](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution").

#### Ordem de Exclusão

Se a declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") incluir uma cláusula `ORDER BY`, as linhas são apagadas na ordem especificada pela cláusula. Isso é útil principalmente em conjunto com `LIMIT`. Por exemplo, a seguinte declaração encontra linhas que correspondem à cláusula `WHERE`, as ordena por `timestamp_column` e apaga a primeira (mais antiga):

```sql
DELETE FROM somelog WHERE user = 'jcole'
ORDER BY timestamp_column LIMIT 1;
```

`ORDER BY` também ajuda a apagar linhas em uma ordem necessária para evitar violações de integridade referencial.

#### Tabelas InnoDB

Se você estiver apagando muitas linhas de uma tabela grande, você pode exceder o tamanho da tabela de Lock para uma tabela `InnoDB`. Para evitar este problema, ou simplesmente para minimizar o tempo que a tabela permanece com Lock, a seguinte estratégia (que não usa [`DELETE`](delete.html "13.2.2 DELETE Statement")) pode ser útil:

1. Selecione as linhas *que não* devem ser apagadas para uma tabela vazia que tenha a mesma estrutura da tabela original:

   ```sql
   INSERT INTO t_copy SELECT * FROM t WHERE ... ;
   ```

2. Use [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") para mover atomicamente a tabela original e renomear a cópia para o nome original:

   ```sql
   RENAME TABLE t TO t_old, t_copy TO t;
   ```

3. Elimine (Drop) a tabela original:

   ```sql
   DROP TABLE t_old;
   ```

Nenhuma outra session pode acessar as tabelas envolvidas enquanto [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") é executado, portanto, a operação de renomeação não está sujeita a problemas de concorrência. Consulte a [Seção 13.1.33, “Declaração RENAME TABLE”](rename-table.html "13.1.33 RENAME TABLE Statement").

#### Tabelas MyISAM

Em tabelas `MyISAM`, as linhas apagadas são mantidas em uma linked list e as operações [`INSERT`](insert.html "13.2.5 INSERT Statement") subsequentes reutilizam as posições antigas das linhas. Para recuperar espaço não utilizado e reduzir o tamanho dos arquivos, use a declaração [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") ou a utility [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") para reorganizar tabelas. [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") é mais fácil de usar, mas [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") é mais rápido. Consulte a [Seção 13.7.2.4, “Declaração OPTIMIZE TABLE”](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") e a [Seção 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

O modificador `QUICK` afeta se os Index leaves são mesclados para operações de DELETE. `DELETE QUICK` é mais útil para aplicações onde os valores de Index para linhas apagadas são substituídos por valores de Index semelhantes de linhas inseridas posteriormente. Neste caso, os espaços deixados pelos valores apagados são reutilizados.

`DELETE QUICK` não é útil quando valores apagados levam a blocos de Index insuficientemente preenchidos abrangendo um range de valores de Index para os quais novas inserções ocorrem novamente. Neste caso, o uso de `QUICK` pode levar a espaço desperdiçado no Index que permanece não recuperado. Aqui está um exemplo de tal cenário:

1. Crie uma tabela que contenha uma coluna `AUTO_INCREMENT` indexada.

2. Insira muitas linhas na tabela. Cada INSERT resulta em um valor de Index que é adicionado à extremidade superior do Index.

3. Apague um bloco de linhas na extremidade inferior do range da coluna usando `DELETE QUICK`.

Neste cenário, os blocos de Index associados aos valores de Index apagados ficam insuficientemente preenchidos, mas não são mesclados com outros blocos de Index devido ao uso de `QUICK`. Eles permanecem insuficientemente preenchidos quando novas inserções ocorrem, porque as novas linhas não possuem valores de Index no range apagado. Além disso, eles permanecem insuficientemente preenchidos mesmo se você usar posteriormente [`DELETE`](delete.html "13.2.2 DELETE Statement") sem `QUICK`, a menos que alguns dos valores de Index apagados estejam em blocos de Index dentro ou adjacentes aos blocos insuficientemente preenchidos. Para recuperar o espaço de Index não utilizado nessas circunstâncias, use [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement").

Se você for apagar muitas linhas de uma tabela, pode ser mais rápido usar `DELETE QUICK` seguido por [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"). Isso reconstrói o Index em vez de realizar muitas operações de mesclagem de blocos de Index.

#### DELETEs de Múltiplas Tabelas

Você pode especificar múltiplas tabelas em uma declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") para apagar linhas de uma ou mais tabelas, dependendo da condição na cláusula `WHERE`. Você não pode usar `ORDER BY` ou `LIMIT` em um `DELETE` de múltiplas tabelas. A cláusula *`table_references`* lista as tabelas envolvidas no JOIN, conforme descrito na [Seção 13.2.9.2, “Cláusula JOIN”](join.html "13.2.9.2 JOIN Clause").

Para a primeira sintaxe de múltiplas tabelas, apenas as linhas correspondentes das tabelas listadas antes da cláusula `FROM` são apagadas. Para a segunda sintaxe de múltiplas tabelas, apenas as linhas correspondentes das tabelas listadas na cláusula `FROM` (antes da cláusula `USING`) são apagadas. O efeito é que você pode apagar linhas de muitas tabelas ao mesmo tempo e ter tabelas adicionais que são usadas apenas para busca:

```sql
DELETE t1, t2 FROM t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Ou:

```sql
DELETE FROM t1, t2 USING t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Essas declarações usam todas as três tabelas ao buscar linhas para apagar, mas apagam linhas correspondentes apenas das tabelas `t1` e `t2`.

Os exemplos anteriores usam `INNER JOIN`, mas as declarações [`DELETE`](delete.html "13.2.2 DELETE Statement") de múltiplas tabelas podem usar outros tipos de JOIN permitidos nas declarações [`SELECT`](select.html "13.2.9 SELECT Statement"), como `LEFT JOIN`. Por exemplo, para apagar linhas que existem em `t1` que não têm correspondência em `t2`, use um `LEFT JOIN`:

```sql
DELETE t1 FROM t1 LEFT JOIN t2 ON t1.id=t2.id WHERE t2.id IS NULL;
```

A sintaxe permite `.*` após cada *`tbl_name`* para compatibilidade com o **Access**.

Se você usar uma declaração [`DELETE`](delete.html "13.2.2 DELETE Statement") de múltiplas tabelas envolvendo tabelas `InnoDB` para as quais existem constraints de Foreign Key, o optimizer do MySQL pode processar as tabelas em uma ordem que difere da sua relação pai/filho. Neste caso, a declaração falha e faz o rollback. Em vez disso, você deve apagar de uma única tabela e confiar nos recursos `ON DELETE` que o `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas de acordo.

Nota

Se você declarar um alias para uma tabela, você deve usar o alias ao se referir à tabela:

```sql
DELETE t1 FROM test AS t1, test2 WHERE ...
```

Aliases de tabela em um [`DELETE`](delete.html "13.2.2 DELETE Statement") de múltiplas tabelas devem ser declarados apenas na parte *`table_references`* da declaração. Em outros lugares, referências de alias são permitidas, mas não declarações de alias.

Correto:

```sql
DELETE a1, a2 FROM t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;

DELETE FROM a1, a2 USING t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;
```

Incorreto:

```sql
DELETE t1 AS a1, t2 AS a2 FROM t1 INNER JOIN t2
WHERE a1.id=a2.id;

DELETE FROM t1 AS a1, t2 AS a2 USING t1 INNER JOIN t2
WHERE a1.id=a2.id;
```