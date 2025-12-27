### 15.2.2 Instrução `DELETE`

A instrução `DELETE` é uma instrução DML que remove linhas de uma tabela.

A instrução `DELETE` pode começar com uma cláusula `WITH`") para definir expressões de tabela comum acessíveis dentro do `DELETE`. Veja a Seção 15.2.20, “WITH (Expressões de Tabela Comum”)").

#### Sintaxe de Tabela Única

```
DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name [[AS] tbl_alias]
    [PARTITION (partition_name [, partition_name] ...)]
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]
```

A instrução `DELETE` exclui linhas de *`tbl_name`* e retorna o número de linhas excluídas. Para verificar o número de linhas excluídas, chame a função `ROW_COUNT()` descrita na Seção 14.15, “Funções de Informação”.

#### Cláusulas Principais

As condições na cláusula opcional `WHERE` identificam quais linhas serão excluídas. Sem a cláusula `WHERE`, todas as linhas são excluídas.

*`where_condition`* é uma expressão que avalia como verdadeiro para cada linha a ser excluída. É especificado como descrito na Seção 15.2.13, “Instrução SELECT”.

Se a cláusula `ORDER BY` for especificada, as linhas são excluídas na ordem especificada. A cláusula `LIMIT` coloca um limite no número de linhas que podem ser excluídas. Essas cláusulas se aplicam a exclusiões de uma única tabela, mas não a exclusiões de múltiplas tabelas.

#### Sintaxe de Múltiplas Tabelas

```
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

Quando você não precisa saber o número de linhas excluídas, a instrução `TRUNCATE TABLE` é uma maneira mais rápida de esvaziar uma tabela do que uma instrução `DELETE` sem a cláusula `WHERE`. Ao contrário de `DELETE`, `TRUNCATE TABLE` não pode ser usado dentro de uma transação ou se você tiver um bloqueio na tabela. Veja a Seção 15.1.42, “Instrução TRUNCATE TABLE” e a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”.

A velocidade das operações de exclusão também pode ser afetada por fatores discutidos na Seção 10.2.5.3, “Otimização de Declarações DELETE”.

Para garantir que uma determinada declaração `DELETE` não demore muito tempo, a cláusula específica do MySQL `LIMIT row_count` para `DELETE` especifica o número máximo de linhas a serem excluídas. Se o número de linhas a serem excluídas for maior que o limite, repita a declaração `DELETE` até que o número de linhas afetadas seja menor que o valor do `LIMIT`.

#### Subconsultas

Você não pode excluir de uma tabela e selecionar de mesma tabela em uma subconsulta.

#### Suporte a Tabelas Partidas

`DELETE` suporta a seleção explícita de partições usando a cláusula `PARTITION`, que recebe uma lista dos nomes separados por vírgula de uma ou mais partições ou subpartições (ou ambas) a partir das quais as linhas a serem excluídas são selecionadas. Partições não incluídas na lista são ignoradas. Dado uma tabela dividida `t` com uma partição chamada `p0`, a execução da declaração `DELETE FROM t PARTITION (p0)` tem o mesmo efeito na tabela que a execução de `ALTER TABLE t TRUNCATE PARTITION (p0)`; em ambos os casos, todas as linhas na partição `p0` são excluídas.

`PARTITION` pode ser usado junto com uma condição `WHERE`, na qual caso a condição é testada apenas em linhas nas partições listadas. Por exemplo, `DELETE FROM t PARTITION (p0) WHERE c < 5` exclui linhas apenas da partição `p0` para a qual a condição `c < 5` é verdadeira; linhas em quaisquer outras partições não são verificadas e, portanto, não são afetadas pelo `DELETE`.

A cláusula `PARTITION` também pode ser usada em declarações `DELETE` de múltiplas tabelas. Você pode usar até uma dessas opções por tabela nomeada na opção `FROM`.

Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

#### Colunas de Incremento Automático

Se você excluir a linha que contém o valor máximo para uma coluna `AUTO_INCREMENT`, o valor não será reutilizado para uma tabela `MyISAM` ou `InnoDB`. Se você excluir todas as linhas da tabela com `DELETE FROM tbl_name` (sem uma cláusula `WHERE`) no modo `autocommit`, a sequência será reiniciada para todos os motores de armazenamento, exceto `InnoDB` e `MyISAM`. Há algumas exceções a esse comportamento para tabelas `InnoDB`, conforme discutido na Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT em InnoDB”.

Para tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos colunas. Nesse caso, o reuso de valores excluídos do topo da sequência ocorre mesmo para tabelas `MyISAM`. Veja a Seção 5.6.9, “Usando AUTO\_INCREMENT”.

#### Modificadores

A instrução `DELETE` suporta os seguintes modificadores:

* Se você especificar o modificador `LOW_PRIORITY`, o servidor adiará a execução da `DELETE` até que nenhum outro cliente esteja lendo da tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Para tabelas `MyISAM`, se você usar o modificador `QUICK`, o motor de armazenamento não mescla folhas de índice durante a exclusão, o que pode acelerar alguns tipos de operações de exclusão.

* O modificador `IGNORE` faz com que o MySQL ignore erros ignoráveis durante o processo de exclusão de linhas. (Erros encontrados durante a fase de análise são processados da maneira usual.) Erros ignorados devido ao uso de `IGNORE` são retornados como avisos. Para mais informações, consulte O Efeito de IGNORE na Execução da Instrução.

#### Ordem de Exclusão

Se a instrução `DELETE` incluir uma cláusula `ORDER BY`, as linhas serão excluídas na ordem especificada pela cláusula. Isso é útil principalmente em conjunto com `LIMIT`. Por exemplo, a seguinte instrução encontra linhas que correspondem à cláusula `WHERE`, as ordena pelo `timestamp_column` e exclui a primeira (mais antiga):

```
DELETE FROM somelog WHERE user = 'jcole'
ORDER BY timestamp_column LIMIT 1;
```

A cláusula `ORDER BY` também ajuda a excluir linhas em uma ordem necessária para evitar violações de integridade referencial.

#### Tabelas InnoDB

Se você estiver excluindo muitas linhas de uma tabela grande, pode exceder o tamanho de bloqueio de uma tabela `InnoDB`. Para evitar esse problema ou simplesmente para minimizar o tempo em que a tabela permanece bloqueada, a seguinte estratégia (que não usa `DELETE`) pode ser útil:

1. Selecione as linhas *não* a serem excluídas em uma tabela vazia que tenha a mesma estrutura da tabela original:

   ```
   INSERT INTO t_copy SELECT * FROM t WHERE ... ;
   ```

2. Use `RENAME TABLE` para mover ativamente a tabela original para o lado e renomear a cópia para o nome original:

   ```
   RENAME TABLE t TO t_old, t_copy TO t;
   ```

3. Exclua a tabela original:

   ```
   DROP TABLE t_old;
   ```

Nenhuma outra sessão pode acessar as tabelas envolvidas enquanto a operação `RENAME TABLE` é executada, então a operação de renomeação não está sujeita a problemas de concorrência. Veja a Seção 15.1.41, “Instrução RENAME TABLE”.

#### Tabelas MyISAM

Em tabelas `MyISAM`, as linhas excluídas são mantidas em uma lista enlaçada e operações `INSERT` subsequentes reutilizam as posições de linha antigas. Para recuperar espaço não utilizado e reduzir os tamanhos dos arquivos, use a instrução `OPTIMIZE TABLE` ou a utilitário **myisamchk** para reorganizar as tabelas. `OPTIMIZE TABLE` é mais fácil de usar, mas **myisamchk** é mais rápido. Veja a Seção 15.7.3.4, “Instrução OPTIMIZE TABLE”, e a Seção 6.6.4, “myisamchk — Utilitário de Manutenção de Tabelas MyISAM”.

O modificador `QUICK` afeta se as folhas de índice são unidas para operações de exclusão. `DELETE QUICK` é mais útil para aplicações em que os valores de índice para linhas excluídas são substituídos por valores de índice semelhantes de linhas inseridas posteriormente. Nesse caso, os buracos deixados pelos valores excluídos são reutilizados.

`DELETE QUICK` não é útil quando os valores excluídos resultam em blocos de índice subcheios que abrangem uma faixa de valores de índice para os quais novas inserções ocorrem novamente. Nesse caso, o uso de `QUICK` pode levar ao desperdício de espaço no índice que permanece não recuperado. Aqui está um exemplo de tal cenário:

1. Crie uma tabela que contenha uma coluna com `AUTO_INCREMENT` indexada.

2. Insira muitas linhas na tabela. Cada inserção resulta em um valor de índice que é adicionado à extremidade alta do índice.

3. Exclua um bloco de linhas na extremidade baixa da faixa de colunas usando `DELETE QUICK`.

Nesse cenário, os blocos de índice associados aos valores de índice excluídos tornam-se subcheios, mas não são unidos com outros blocos de índice devido ao uso de `QUICK`. Eles permanecem subcheios quando novas inserções ocorrem, porque as novas linhas não têm valores de índice na faixa excluída. Além disso, eles permanecem subcheios mesmo se você usar `DELETE` posteriormente sem `QUICK`, a menos que alguns dos valores de índice excluídos estejam em blocos de índice dentro ou adjacentes aos blocos subcheios. Para recuperar o espaço de índice não utilizado nessas circunstâncias, use `OPTIMIZE TABLE`.

Se você vai excluir muitas linhas de uma tabela, pode ser mais rápido usar `DELETE QUICK` seguido por `OPTIMIZE TABLE`. Isso reconstrui o índice em vez de realizar muitas operações de união de blocos de índice.

#### Excluições de Múltiplas Tabelas

Você pode especificar várias tabelas em uma instrução `DELETE` para excluir linhas de uma ou mais tabelas, dependendo da condição na cláusula `WHERE`. Você não pode usar `ORDER BY` ou `LIMIT` em uma instrução `DELETE` de várias tabelas. A cláusula `*``table_references`* lista as tabelas envolvidas na junção, conforme descrito na Seção 15.2.13.2, “Cláusula JOIN”.

Para a primeira sintaxe de várias tabelas, apenas as linhas que correspondem às tabelas listadas antes da cláusula `FROM` são excluídas. Para a segunda sintaxe de várias tabelas, apenas as linhas que correspondem às tabelas listadas na cláusula `FROM` (antes da cláusula `USING`) são excluídas. O efeito é que você pode excluir linhas de muitas tabelas ao mesmo tempo e ter tabelas adicionais que são usadas apenas para pesquisa:

```
DELETE t1, t2 FROM t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Ou:

```
DELETE FROM t1, t2 USING t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Essas instruções usam todas as três tabelas ao procurar linhas para excluir, mas excluem apenas as linhas que correspondem das tabelas `t1` e `t2`.

Os exemplos anteriores usam `INNER JOIN`, mas instruções `DELETE` de várias tabelas podem usar outros tipos de junção permitidos em instruções `SELECT`, como `LEFT JOIN`. Por exemplo, para excluir linhas que existem em `t1` e não têm correspondência em `t2`, use um `LEFT JOIN`:

```
DELETE t1 FROM t1 LEFT JOIN t2 ON t1.id=t2.id WHERE t2.id IS NULL;
```

A sintaxe permite `.*` após cada `tbl_name` para compatibilidade com o **Access**.

Se você usar uma instrução `DELETE` de várias tabelas que envolve tabelas `InnoDB` para as quais existem restrições de chave estrangeira, o otimizador do MySQL pode processar as tabelas em uma ordem que difere da relação pai/filho. Nesse caso, a instrução falha e é revertida. Em vez disso, você deve excluir de uma única tabela e confiar nas capacidades `ON DELETE` que o `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas conforme necessário.

Nota

Se você declarar um alias para uma tabela, você deve usar o alias ao referir-se à tabela:

```
DELETE t1 FROM test AS t1, test2 WHERE ...
```

Os aliases de tabela em uma `DELETE` de múltiplas tabelas devem ser declarados apenas na parte *`table_references`* da instrução. Em outros lugares, as referências de alias são permitidas, mas não as declarações de alias.

Correto:

```
DELETE a1, a2 FROM t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;

DELETE FROM a1, a2 USING t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;
```

Incorreto:

```
DELETE t1 AS a1, t2 AS a2 FROM t1 INNER JOIN t2
WHERE a1.id=a2.id;

DELETE FROM t1 AS a1, t2 AS a2 USING t1 INNER JOIN t2
WHERE a1.id=a2.id;
```

Os aliases de tabela também são suportados para instruções `DELETE` de uma única tabela.