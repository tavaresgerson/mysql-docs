### 15.7.2 Problemas com Tabelas MERGE

Os seguintes são problemas conhecidos com tabelas `MERGE`:

*   As tabelas filhas `MERGE` são travadas (locked) através da tabela pai. Se a tabela pai for uma tabela temporária, ela não é travada e, portanto, as tabelas filhas também não são; isso significa que o uso paralelo das tabelas `MyISAM` subjacentes as corrompe.

*   Se você usar `ALTER TABLE` para mudar uma tabela `MERGE` para outro Storage Engine, o mapeamento para as tabelas subjacentes é perdido. Em vez disso, as linhas das tabelas `MyISAM` subjacentes são copiadas para a tabela alterada, que então usa o Storage Engine especificado.

*   A opção de tabela `INSERT_METHOD` para uma tabela `MERGE` indica qual tabela `MyISAM` subjacente deve ser usada para `INSERT`s na tabela `MERGE`. No entanto, o uso da opção de tabela `AUTO_INCREMENT` para essa tabela `MyISAM` não tem efeito para `INSERT`s na tabela `MERGE` até que pelo menos uma linha tenha sido inserida diretamente na tabela `MyISAM`.

*   Uma tabela `MERGE` não pode manter Constraints de unicidade (uniqueness constraints) sobre a tabela inteira. Quando você executa um `INSERT`, os dados vão para a primeira ou última tabela `MyISAM` (conforme determinado pela opção `INSERT_METHOD`). O MySQL garante que os valores de Unique Key permaneçam únicos dentro dessa tabela `MyISAM`, mas não sobre todas as tabelas subjacentes na coleção.

*   Como o Engine `MERGE` não pode impor a unicidade sobre o conjunto de tabelas subjacentes, o `REPLACE` não funciona como esperado. Os dois fatos principais são:

    + O `REPLACE` pode detectar violações de Unique Key apenas na tabela subjacente para a qual ele vai escrever (o que é determinado pela opção `INSERT_METHOD`). Isso difere das violações na própria tabela `MERGE`.

    + Se o `REPLACE` detectar uma violação de Unique Key, ele altera apenas a linha correspondente na tabela subjacente para a qual está escrevendo; ou seja, a primeira ou a última tabela, conforme determinado pela opção `INSERT_METHOD`.

  Considerações semelhantes se aplicam para `INSERT ... ON DUPLICATE KEY UPDATE`.

*   Tabelas `MERGE` não suportam Partitioning. Ou seja, você não pode particionar uma tabela `MERGE`, nem quaisquer das tabelas `MyISAM` subjacentes de uma tabela `MERGE` podem ser particionadas.

*   Você não deve usar `ANALYZE TABLE`, `REPAIR TABLE`, `OPTIMIZE TABLE`, `ALTER TABLE`, `DROP TABLE`, `DELETE` sem uma cláusula `WHERE`, ou `TRUNCATE TABLE` em nenhuma das tabelas que estão mapeadas em uma tabela `MERGE` aberta. Se o fizer, a tabela `MERGE` pode ainda referenciar a tabela original e gerar resultados inesperados. Para contornar este problema, garanta que nenhuma tabela `MERGE` permaneça aberta emitindo uma instrução `FLUSH TABLES` antes de executar qualquer uma das operações mencionadas.

  Os resultados inesperados incluem a possibilidade de que a operação na tabela `MERGE` relate corrupção da tabela. Se isso ocorrer após uma das operações mencionadas nas tabelas `MyISAM` subjacentes, a mensagem de corrupção é espúria. Para lidar com isso, emita uma instrução `FLUSH TABLES` após modificar as tabelas `MyISAM`.

*   `DROP TABLE` em uma tabela que está em uso por uma tabela `MERGE` não funciona no Windows porque o mapeamento de tabela do Storage Engine `MERGE` está oculto da camada superior do MySQL. O Windows não permite que arquivos abertos sejam excluídos, então você deve primeiro realizar um "flush" em todas as tabelas `MERGE` (com `FLUSH TABLES`) ou descartar a tabela `MERGE` antes de descartar a tabela.

*   A definição das tabelas `MyISAM` e da tabela `MERGE` é verificada quando as tabelas são acessadas (por exemplo, como parte de uma instrução `SELECT` ou `INSERT`). As verificações garantem que as definições das tabelas e a definição da tabela `MERGE` pai correspondam, comparando a ordem das Column, tipos, tamanhos e Indexes associados. Se houver uma diferença entre as tabelas, um erro é retornado e a instrução falha. Como essas verificações ocorrem quando as tabelas são abertas, quaisquer alterações na definição de uma única tabela, incluindo alterações de Column, ordenação de Column e alterações de Engine, fazem com que a instrução falhe.

*   A ordem dos Indexes na tabela `MERGE` e nas suas tabelas subjacentes deve ser a mesma. Se você usar `ALTER TABLE` para adicionar um Index `UNIQUE` a uma tabela usada em uma tabela `MERGE`, e depois usar `ALTER TABLE` para adicionar um Index não-único na tabela `MERGE`, a ordenação dos Indexes será diferente para as tabelas se já houvesse um Index não-único na tabela subjacente. (Isso ocorre porque `ALTER TABLE` coloca Indexes `UNIQUE` antes dos Indexes não-únicos para facilitar a detecção rápida de chaves duplicadas). Consequentemente, Queries em tabelas com tais Indexes podem retornar resultados inesperados.

*   Se você encontrar uma mensagem de erro semelhante a ERROR 1017 (HY000): Can't find file: '*`tbl_name`*.MRG' (errno: 2), isso geralmente indica que algumas das tabelas subjacentes não usam o Storage Engine `MyISAM`. Confirme que todas essas tabelas são `MyISAM`.

*   O número máximo de linhas em uma tabela `MERGE` é 264 (~1.844E+19; o mesmo que para uma tabela `MyISAM`). Não é possível unir múltiplas tabelas `MyISAM` em uma única tabela `MERGE` que teria mais do que este número de linhas.

*   Atualmente, sabe-se que o uso de tabelas `MyISAM` subjacentes com formatos de linha diferentes em uma tabela `MERGE` pai falha. Veja Bug #32364.

*   Você não pode alterar a lista de união de uma tabela `MERGE` não temporária quando `LOCK TABLES` está em vigor. O seguinte *não* funciona:

  ```sql
  CREATE TABLE m1 ... ENGINE=MRG_MYISAM ...;
  LOCK TABLES t1 WRITE, t2 WRITE, m1 WRITE;
  ALTER TABLE m1 ... UNION=(t1,t2) ...;
  ```

  No entanto, você pode fazer isso com uma tabela `MERGE` temporária.

*   Você não pode criar uma tabela `MERGE` com `CREATE ... SELECT`, nem como uma tabela `MERGE` temporária, nem como uma tabela `MERGE` não temporária. Por exemplo:

  ```sql
  CREATE TABLE m1 ... ENGINE=MRG_MYISAM ... SELECT ...;
  ```

  Tentativas de fazer isso resultam em um erro: *`tbl_name`* is not `BASE TABLE`.

*   Em alguns casos, valores diferentes da opção de tabela `PACK_KEYS` entre a `MERGE` e as tabelas subjacentes causam resultados inesperados se as tabelas subjacentes contiverem Columns `CHAR` ou `BINARY`. Como Workaround, use `ALTER TABLE` para garantir que todas as tabelas envolvidas tenham o mesmo valor `PACK_KEYS`. (Bug #50646)