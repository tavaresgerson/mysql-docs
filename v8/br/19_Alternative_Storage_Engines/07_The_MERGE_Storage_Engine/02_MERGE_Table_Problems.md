### 18.7.2 Problemas com a tabela MERGE

Os problemas conhecidos com as tabelas `MERGE` são os seguintes:

- As tabelas filho são bloqueadas através da tabela pai. Se o pai for uma tabela temporária, ela não é bloqueada, e, portanto, as tabelas filho também não são bloqueadas; isso significa que o uso paralelo das tabelas subjacentes `MyISAM` as corrompe.

- Se você usar `ALTER TABLE` para alterar uma tabela `MERGE` para outro mecanismo de armazenamento, o mapeamento para as tabelas subjacentes é perdido. Em vez disso, as linhas das tabelas subjacentes `MyISAM` são copiadas para a tabela alterada, que então usa o mecanismo de armazenamento especificado.

- A opção de tabela `INSERT_METHOD` para uma tabela `MERGE` indica qual tabela `MyISAM` subjacente deve ser usada para inserções na tabela `MERGE`. No entanto, o uso da opção de tabela `AUTO_INCREMENT` para aquela tabela `MyISAM` não tem efeito para inserções na tabela `MERGE` até que pelo menos uma linha tenha sido inserida diretamente na tabela `MyISAM`.

- Uma tabela `MERGE` não pode manter restrições de unicidade sobre toda a tabela. Quando você executa um `INSERT`, os dados são inseridos na primeira ou última tabela `MyISAM` (conforme determinado pela opção `INSERT_METHOD`). O MySQL garante que os valores de chave únicos permaneçam únicos dentro dessa tabela `MyISAM`, mas não em todas as tabelas subjacentes da coleção.

- Como o motor `MERGE` não pode garantir a unicidade sobre o conjunto de tabelas subjacentes, o `REPLACE` não funciona conforme o esperado. Os dois fatos principais são:

  - `REPLACE` pode detectar violações de chave únicas apenas na tabela subjacente para a qual ele está prestes a escrever (o que é determinado pela opção `INSERT_METHOD`). Isso difere das violações na própria tabela `MERGE`.

  - Se o `REPLACE` detectar uma violação de chave única, ele altera apenas a linha correspondente na tabela subjacente a qual está escrevendo; ou seja, a primeira ou a última tabela, conforme determinado pela opção `INSERT_METHOD`.

  Considerações semelhantes se aplicam para `INSERT ... ON DUPLICATE KEY UPDATE`.

- As tabelas `MERGE` não suportam particionamento. Isso significa que você não pode particionar uma tabela `MERGE`, nem nenhuma das tabelas `MyISAM` subjacentes de uma tabela `MERGE` pode ser particionada.

- Você não deve usar `ANALYZE TABLE`, `REPAIR TABLE`, `OPTIMIZE TABLE`, `ALTER TABLE`, `DROP TABLE`, `DELETE` sem uma cláusula `WHERE`, ou `TRUNCATE TABLE` em qualquer uma das tabelas mapeadas para uma tabela `MERGE` aberta. Se você fizer isso, a tabela `MERGE` ainda pode se referir à tabela original e produzir resultados inesperados. Para contornar esse problema, certifique-se de que nenhuma tabela `MERGE` permaneça aberta emitindo uma declaração `FLUSH TABLES` antes de realizar qualquer uma das operações nomeadas.

  Os resultados inesperados incluem a possibilidade de que a operação na tabela `MERGE` informe corrupção de tabela. Se isso ocorrer após uma das operações nomeadas nas tabelas subjacentes `MyISAM`, a mensagem de corrupção é falsa. Para lidar com isso, execute uma declaração `FLUSH TABLES` após modificar as tabelas `MyISAM`.

- `DROP TABLE` em uma tabela que está sendo usada por uma tabela `MERGE` não funciona no Windows porque o mapeamento de tabela do mecanismo de armazenamento `MERGE` é oculto para a camada superior do MySQL. O Windows não permite que arquivos abertos sejam excluídos, então você deve primeiro esvaziar todas as tabelas `MERGE` (com `FLUSH TABLES`) ou excluir a tabela `MERGE` antes de excluir a tabela.

- A definição das tabelas `MyISAM` e da tabela `MERGE` é verificada quando as tabelas são acessadas (por exemplo, como parte de uma instrução `SELECT` ou `INSERT`). As verificações garantem que as definições das tabelas e a definição da tabela pai `MERGE` coincidam, comparando a ordem das colunas, os tipos, os tamanhos e os índices associados. Se houver uma diferença entre as tabelas, um erro é retornado e a instrução falha. Como essas verificações ocorrem quando as tabelas são abertas, quaisquer alterações na definição de uma única tabela, incluindo alterações de coluna, ordem de coluna e alterações no motor, fazem com que a instrução falhe.

- A ordem dos índices na tabela `MERGE` e em suas tabelas subjacentes deve ser a mesma. Se você usar `ALTER TABLE` para adicionar um índice `UNIQUE` a uma tabela usada em uma tabela `MERGE`, e depois usar `ALTER TABLE` para adicionar um índice não exclusivo na tabela `MERGE`, a ordem dos índices das tabelas será diferente se já houvesse um índice não exclusivo na tabela subjacente. (Isso acontece porque `ALTER TABLE` coloca os índices `UNIQUE` antes dos índices não exclusivos para facilitar a rápida detecção de chaves duplicadas.) Consequentemente, as consultas em tabelas com tais índices podem retornar resultados inesperados.

- Se você encontrar uma mensagem de erro semelhante ao ERRO 1017 (HY000): Não é possível encontrar o arquivo: '`tbl_name`.MRG' (errno: 2), geralmente isso indica que algumas das tabelas subjacentes não usam o mecanismo de armazenamento `MyISAM`. Confirme que todas essas tabelas são `MyISAM`.

- O número máximo de linhas em uma tabela `MERGE` é de 264 (\~1,844E+19; o mesmo que para uma tabela `MyISAM`). Não é possível combinar várias tabelas `MyISAM` em uma única tabela `MERGE` que tenha mais de esse número de linhas.

- O uso de tabelas subjacentes `MyISAM` com formatos de linha diferentes e uma tabela pai `MERGE` atualmente é conhecido por falhar. Veja o Bug #32364.

- Você não pode alterar a lista de união de uma tabela não temporária `MERGE` quando o `LOCK TABLES` estiver em vigor. O seguinte *não* funciona:

  ```
  CREATE TABLE m1 ... ENGINE=MRG_MYISAM ...;
  LOCK TABLES t1 WRITE, t2 WRITE, m1 WRITE;
  ALTER TABLE m1 ... UNION=(t1,t2) ...;
  ```

  No entanto, você pode fazer isso com uma tabela temporária `MERGE`.

- Você não pode criar uma tabela `MERGE` com `CREATE ... SELECT`, nem como uma tabela temporária `MERGE`, nem como uma tabela não temporária `MERGE`. Por exemplo:

  ```
  CREATE TABLE m1 ... ENGINE=MRG_MYISAM ... SELECT ...;
  ```

  Tentativas de fazer isso resultam em um erro: `tbl_name` não é `BASE TABLE`.

- Em alguns casos, valores diferentes das opções da tabela `PACK_KEYS` entre as tabelas `MERGE` e as tabelas subjacentes causam resultados inesperados se as tabelas subjacentes contiverem as colunas `CHAR` ou `BINARY`. Como solução alternativa, use `ALTER TABLE` para garantir que todas as tabelas envolvidas tenham o mesmo valor de `PACK_KEYS`. (Bug
  \#50646)
