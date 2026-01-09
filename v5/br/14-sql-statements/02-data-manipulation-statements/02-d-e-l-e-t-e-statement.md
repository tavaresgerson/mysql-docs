### 13.2.2 Declaração DELETE

`DELETE` é uma instrução DML que remove linhas de uma tabela.

#### Sintaxe de tabela única

```sql
DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]
```

A instrução `DELETE` exclui linhas de *`tbl_name`* e retorna o número de linhas excluídas. Para verificar o número de linhas excluídas, chame a função `ROW_COUNT()` descrita em Seção 12.15, "Funções de Informação".

#### Cláusulas Principais

As condições na cláusula `WHERE` opcional identificam quais linhas serão excluídas. Sem a cláusula `WHERE`, todas as linhas serão excluídas.

*`where_condition`* é uma expressão que avalia como verdadeira para cada linha a ser excluída. É especificada conforme descrito na Seção 13.2.9, “Instrução SELECT”.

Se a cláusula `ORDER BY` for especificada, as linhas serão excluídas na ordem especificada. A cláusula `LIMIT` define um limite para o número de linhas que podem ser excluídas. Essas cláusulas se aplicam a excluições de uma única tabela, mas não a excluições de múltiplas tabelas.

#### Sintaxe de múltiplas tabelas

```sql
DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    tbl_name[.*] [, tbl_name[.*]] ...
    FROM table_references
    [WHERE where_condition]

DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    FROM tbl_name[.*] [, tbl_name[.*]] ...
    USING table_references
    [WHERE where_condition]
```

#### Privilegios

Você precisa do privilégio `DELETE` em uma tabela para excluí-la. Você precisa apenas do privilégio `SELECT` para quaisquer colunas que sejam apenas de leitura, como as nomeadas na cláusula `WHERE`.

#### Desempenho

Quando você não precisa saber o número de linhas excluídas, a instrução `TRUNCATE TABLE` é uma maneira mais rápida de esvaziar uma tabela do que uma instrução `DELETE` sem a cláusula `WHERE`. Ao contrário de `DELETE`, `TRUNCATE TABLE` não pode ser usada dentro de uma transação ou se você tiver um bloqueio na tabela. Veja Seção 13.1.34, “Instrução `TRUNCATE TABLE`” e Seção 13.3.5, “Instruções `LOCK TABLES` e `UNLOCK TABLES`”.

A velocidade das operações de exclusão também pode ser afetada por fatores discutidos em Seção 8.2.4.3, “Otimização de Declarações DELETE”.

Para garantir que uma determinada instrução `DELETE` (delete.html) não demore muito tempo, a cláusula específica do MySQL `LIMIT row_count` para `DELETE` especifica o número máximo de linhas a serem excluídas. Se o número de linhas a serem excluídas for maior que o limite, repita a instrução `DELETE` até que o número de linhas afetadas seja menor que o valor do `LIMIT`.

#### Subconsultas

Você não pode excluir de uma tabela e selecionar da mesma tabela em uma subconsulta.

#### Suporte para Tabelas Partidas

O comando `DELETE` suporta a seleção explícita de partições usando a cláusula `PARTITION`, que aceita uma lista de nomes separados por vírgula de uma ou mais partições ou subpartições (ou ambas) a partir das quais as linhas a serem excluídas serão selecionadas. Partições não incluídas na lista são ignoradas. Dado uma tabela particionada `t` com uma partição chamada `p0`, a execução do comando `DELETE FROM t PARTITION (p0)` tem o mesmo efeito na tabela que a execução de \`ALTER TABLE t TRUNCATE PARTITION (p0); em ambos os casos, todas as linhas da partição `p0\` são excluídas.

`PARTITION` pode ser usado junto com uma condição `WHERE`, nesse caso, a condição é testada apenas nas linhas das partições listadas. Por exemplo, `DELETE FROM t PARTITION (p0) WHERE c < 5` exclui linhas apenas da partição `p0` para a qual a condição `c < 5` é verdadeira; as linhas de quaisquer outras partições não são verificadas e, portanto, não são afetadas pelo `DELETE`.

A cláusula `PARTITION` também pode ser usada em declarações `DELETE` de múltiplas tabelas. Você pode usar até uma dessas opções por tabela nomeada na opção `FROM`.

Para mais informações e exemplos, consulte Seção 22.5, “Seleção de Partição”.

#### Colunas de Autoincremento

Se você excluir a linha que contém o valor máximo para uma coluna `AUTO_INCREMENT`, o valor não será reutilizado para uma tabela `MyISAM` ou `InnoDB`. Se você excluir todas as linhas da tabela com `DELETE FROM tbl_name` (sem uma cláusula `WHERE` no modo `autocommit`, a sequência será reiniciada para todos os motores de armazenamento, exceto `InnoDB` e `MyISAM`. Existem algumas exceções a esse comportamento para tabelas `InnoDB`, conforme discutido em Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”.

Para tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos campos. Nesse caso, a reutilização de valores excluídos do topo da sequência ocorre mesmo para tabelas `MyISAM`. Veja Seção 3.6.9, “Usando AUTO_INCREMENT”.

#### Modificadores

A instrução `DELETE` suporta os seguintes modificadores:

- Se você especificar o modificador `LOW_PRIORITY`, o servidor adiará a execução da operação `DELETE` até que nenhum outro cliente esteja lendo a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

- Para as tabelas `MyISAM`, se você usar o modificador `QUICK`, o mecanismo de armazenamento não mescla as folhas do índice durante a exclusão, o que pode acelerar alguns tipos de operações de exclusão.

- O modificador `IGNORE` faz com que o MySQL ignore erros ignoráveis durante o processo de exclusão de linhas. (Os erros encontrados durante a fase de análise são processados da maneira usual.) Erros ignorados devido ao uso de `IGNORE` são retornados como avisos. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

#### Ordem de Exclusão

Se a instrução `DELETE` incluir uma cláusula `ORDER BY`, as linhas são excluídas na ordem especificada pela cláusula. Isso é útil principalmente em conjunto com `LIMIT`. Por exemplo, a seguinte instrução encontra linhas que correspondem à cláusula `WHERE`, as ordena pelo `timestamp_column` e exclui a primeira (mais antiga):

```sql
DELETE FROM somelog WHERE user = 'jcole'
ORDER BY timestamp_column LIMIT 1;
```

A cláusula `ORDER BY` também ajuda a excluir linhas em uma ordem necessária para evitar violações de integridade referencial.

#### Tabelas InnoDB

Se você estiver excluindo muitas linhas de uma tabela grande, pode exceder o tamanho de bloqueio de uma tabela `InnoDB`. Para evitar esse problema ou simplesmente para minimizar o tempo em que a tabela permanece bloqueada, a seguinte estratégia (que não usa `DELETE` de forma alguma) pode ser útil:

1. Selecione as linhas *não* a serem excluídas em uma tabela vazia que tenha a mesma estrutura da tabela original:

   ```sql
   INSERT INTO t_copy SELECT * FROM t WHERE ... ;
   ```

2. Use `RENAME TABLE` para mover a tabela original de forma atômica para longe e renomear a cópia para o nome original:

   ```sql
   RENAME TABLE t TO t_old, t_copy TO t;
   ```

3. Descarte a tabela original:

   ```sql
   DROP TABLE t_old;
   ```

Nenhuma outra sessão pode acessar as tabelas envolvidas enquanto o comando `RENAME TABLE` estiver sendo executado, portanto, a operação de renomeação não está sujeita a problemas de concorrência. Veja Seção 13.1.33, “Instrução RENAME TABLE”.

#### Tabelas MyISAM

Em tabelas `MyISAM`, as linhas excluídas são mantidas em uma lista enlaçada e operações subsequentes de `INSERT` reutilizam as posições das linhas antigas. Para recuperar espaço não utilizado e reduzir os tamanhos dos arquivos, use a instrução `OPTIMIZE TABLE` ou o utilitário **myisamchk** para reorganizar as tabelas. `OPTIMIZE TABLE` é mais fácil de usar, mas **myisamchk** é mais rápido. Veja Seção 13.7.2.4, “Instrução OPTIMIZE TABLE” e Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabelas MyISAM”.

O modificador `QUICK` afeta se as folhas do índice são unidas para operações de exclusão. `DELETE QUICK` é mais útil para aplicações em que os valores do índice de linhas excluídas são substituídos por valores de índice semelhantes de linhas inseridas posteriormente. Nesse caso, os buracos deixados pelos valores excluídos são reutilizados.

`DELETE QUICK` não é útil quando os valores excluídos resultam em blocos de índice com valores incompletos que abrangem uma faixa de valores de índice para os quais novas inserções ocorrem novamente. Nesse caso, o uso de `QUICK` pode levar ao desperdício de espaço no índice que permanece não recuperado. Aqui está um exemplo de tal cenário:

1. Crie uma tabela que contenha uma coluna `AUTO_INCREMENT` indexada.

2. Insira muitas linhas na tabela. Cada inserção resulta em um valor de índice que é adicionado ao extremo superior do índice.

3. Exclua um bloco de linhas na extremidade inferior da faixa de colunas usando `DELETE QUICK`.

Nesse cenário, os blocos de índice associados aos valores de índice excluídos ficam subcheios, mas não são mesclados com outros blocos de índice devido ao uso de `QUICK`. Eles permanecem subcheios quando ocorrem novas inserções, porque as novas linhas não têm valores de índice no intervalo excluído. Além disso, eles permanecem subcheios mesmo se você usar ``DELETE` posteriormente sem `QUICK`, a menos que alguns dos valores de índice excluídos estejam em blocos de índice dentro ou adjacentes aos blocos subcheios. Para recuperar o espaço de índice não utilizado nessas circunstâncias, use ``OPTIMIZE TABLE`.

Se você vai excluir muitas linhas de uma tabela, pode ser mais rápido usar `DELETE QUICK` seguido de `OPTIMIZE TABLE`. Isso reconstrui o índice em vez de realizar muitas operações de fusão de blocos de índice.

#### Exclui de mesa múltipla

Você pode especificar várias tabelas em uma instrução `DELETE` para excluir linhas de uma ou mais tabelas, dependendo da condição na cláusula `WHERE`. Você não pode usar `ORDER BY` ou `LIMIT` em uma `DELETE` de várias tabelas. A cláusula *`table_references`* lista as tabelas envolvidas na junção, conforme descrito na Seção 13.2.9.2, “Cláusula JOIN”.

Para a primeira sintaxe de múltiplas tabelas, apenas as linhas que correspondem às tabelas listadas antes da cláusula `FROM` são excluídas. Para a segunda sintaxe de múltiplas tabelas, apenas as linhas que correspondem às tabelas listadas na cláusula `FROM` (antes da cláusula `USING`) são excluídas. O efeito é que você pode excluir linhas de muitas tabelas ao mesmo tempo e ter tabelas adicionais que são usadas apenas para pesquisa:

```sql
DELETE t1, t2 FROM t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Ou:

```sql
DELETE FROM t1, t2 USING t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Essas declarações usam todas as três tabelas ao procurar linhas para excluir, mas excluem apenas as linhas correspondentes das tabelas `t1` e `t2`.

Os exemplos anteriores usam `INNER JOIN`, mas as instruções de `DELETE` em múltiplas tabelas podem usar outros tipos de junção permitidos em instruções `SELECT`, como `LEFT JOIN`. Por exemplo, para excluir linhas que existem em `t1` e que não têm correspondência em `t2`, use uma `LEFT JOIN`:

```sql
DELETE t1 FROM t1 LEFT JOIN t2 ON t1.id=t2.id WHERE t2.id IS NULL;
```

A sintaxe permite `.*` após cada `tbl_name` para compatibilidade com o **Access**.

Se você usar uma instrução `DELETE` de múltiplas tabelas que envolve tabelas `InnoDB` para as quais existem restrições de chave estrangeira, o otimizador do MySQL pode processar as tabelas em uma ordem diferente daquela de sua relação pai/filho. Nesse caso, a instrução falha e é revertida. Em vez disso, você deve excluir de uma única tabela e confiar nas capacidades `ON DELETE` que o `InnoDB` fornece para modificar as outras tabelas conforme necessário.

Nota

Se você declarar um alias para uma tabela, você deve usar o alias ao se referir à tabela:

```sql
DELETE t1 FROM test AS t1, test2 WHERE ...
```

Os aliases de tabela em uma tabela múltipla `DELETE` devem ser declarados apenas na parte *`table_references`* da instrução. Em outros lugares, as referências de alias são permitidas, mas não as declarações de alias.

Correto:

```sql
DELETE a1, a2 FROM t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;

DELETE FROM a1, a2 USING t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;
```

Incorreto:
Português (brasileiro):

```sql
DELETE t1 AS a1, t2 AS a2 FROM t1 INNER JOIN t2
WHERE a1.id=a2.id;

DELETE FROM t1 AS a1, t2 AS a2 USING t1 INNER JOIN t2
WHERE a1.id=a2.id;
```
