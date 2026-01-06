### 22.3.4 Manutenção de Partições

Várias tarefas de manutenção de tabelas e partições podem ser realizadas usando instruções SQL destinadas a esse fim em tabelas particionadas no MySQL 5.7.

A manutenção de tabelas particionadas pode ser realizada usando as instruções `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE`, que são suportadas para tabelas particionadas.

Você pode usar várias extensões para `ALTER TABLE` para realizar operações desse tipo em uma ou mais partições diretamente, conforme descrito na lista a seguir:

- **Reestruturação de partições.** Reestrutura a partição; isso tem o mesmo efeito que excluir todos os registros armazenados na partição e, em seguida, reintroduzi-los. Isso pode ser útil para fins de desfragmentação.

  Exemplo:

  ```sql
  ALTER TABLE t1 REBUILD PARTITION p0, p1;
  ```

- **Otimização de partições.** Se você tiver excluído um grande número de linhas de uma partição ou se tiver feito muitas alterações em uma tabela particionada com linhas de comprimento variável (ou seja, com colunas `VARCHAR`, `BLOB` ou `TEXT`, você pode usar `ALTER TABLE ... OPTIMIZE PARTITION` para recuperar qualquer espaço não utilizado e para defragmentar o arquivo de dados da partição.

  Exemplo:

  ```sql
  ALTER TABLE t1 OPTIMIZE PARTITION p0, p1;
  ```

  Usar `OPTIMIZE PARTITION` em uma partição específica é equivalente a executar `CHECK PARTITION`, `ANALYZE PARTITION` e `REPAIR PARTITION` nessa partição.

  Alguns motores de armazenamento do MySQL, incluindo o `InnoDB`, não suportam a otimização por partição; nesses casos, `ALTER TABLE ... OPTIMIZE PARTITION` analisa e reconstrui toda a tabela, e emite um aviso apropriado. (Bug #11751825, Bug #42822) Use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso, para evitar esse problema.

- **Analisando partições.** Isso lê e armazena as distribuições de chaves para as partições.

  Exemplo:

  ```sql
  ALTER TABLE t1 ANALYZE PARTITION p3;
  ```

- **Reparando partições.** Isso conserta partições corrompidas.

  Exemplo:

  ```sql
  ALTER TABLE t1 REPAIR PARTITION p0,p1;
  ```

  Normalmente, o comando `REPAIR PARTITION` falha quando a partição contém erros de chave duplicada. No MySQL 5.7.2 e versões posteriores, você pode usar `ALTER IGNORE TABLE` com essa opção, caso em que todas as linhas que não podem ser movidas devido à presença de chaves duplicadas são removidas da partição (Bug #16900947).

- **Verificação de partições.** Você pode verificar as partições em busca de erros da mesma maneira que pode usar o comando `CHECK TABLE` com tabelas não particionadas.

  Exemplo:

  ```sql
  ALTER TABLE trb3 CHECK PARTITION p1;
  ```

  Este comando informa se os dados ou índices na partição `p1` da tabela `t1` estão corrompidos. Se esse for o caso, use `ALTER TABLE ... REPAIR PARTITION` para reparar a partição.

  Normalmente, o comando `CHECK PARTITION` falha quando a partição contém erros de chave duplicada. No MySQL 5.7.2 e versões posteriores, você pode usar `ALTER IGNORE TABLE` com essa opção, caso em que a instrução retorna o conteúdo de cada linha na partição onde uma violação de chave duplicada é encontrada. Apenas os valores das colunas na expressão de partição da tabela são relatados. (Bug #16900947)

Cada uma das declarações na lista mostrada anteriormente também suporta a palavra-chave `ALL` no lugar da lista de nomes de partições. Usar `ALL` faz com que a declaração atue em todas as partições da tabela.

O uso de **mysqlcheck** e **myisamchk** não é suportado com tabelas particionadas.

No MySQL 5.7, você também pode truncar partições usando `ALTER TABLE ... TRUNCATE PARTITION`. Essa instrução pode ser usada para excluir todas as linhas de uma ou mais partições da mesma maneira que a instrução `TRUNCATE TABLE` exclui todas as linhas de uma tabela.

`ALTER TABLE ... TRUNCATE PARTITION ALL` truncata todas as partições da tabela.

Antes do MySQL 5.7.2, as operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REBUILD`, `REPAIR` e `TRUNCATE` não eram permitidas em subpartições (Bug #14028340, Bug #65184).
