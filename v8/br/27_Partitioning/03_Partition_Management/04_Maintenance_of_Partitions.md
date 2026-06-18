### 26.3.4 Manutenção de Partições

Várias tarefas de manutenção de tabelas e partições podem ser realizadas em tabelas particionadas usando instruções SQL destinadas a esse fim.

A manutenção de tabelas particionadas pode ser realizada usando as instruções `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE`, que são suportadas para tabelas particionadas.

Você pode usar várias extensões para `ALTER TABLE` para realizar operações desse tipo em uma ou mais partições diretamente, conforme descrito na lista a seguir:

- **Reestruturação de partições.** Reestrutura a partição; isso tem o mesmo efeito que excluir todos os registros armazenados na partição e, em seguida, reintroduzi-los. Isso pode ser útil para fins de desfragmentação.

  Exemplo:

  ```
  ALTER TABLE t1 REBUILD PARTITION p0, p1;
  ```

- **Otimização de partições.** Se você tiver excluído um grande número de linhas de uma partição ou se tiver feito muitas alterações em uma tabela particionada com linhas de comprimento variável (ou seja, com as colunas `VARCHAR`, `BLOB` ou `TEXT`), você pode usar `ALTER TABLE ... OPTIMIZE PARTITION` para recuperar qualquer espaço não utilizado e para defragmentar o arquivo de dados da partição.

  Exemplo:

  ```
  ALTER TABLE t1 OPTIMIZE PARTITION p0, p1;
  ```

  Usar `OPTIMIZE PARTITION` em uma partição específica é equivalente a executar `CHECK PARTITION`, `ANALYZE PARTITION` e `REPAIR PARTITION` nessa partição.

  Alguns motores de armazenamento do MySQL, incluindo `InnoDB`, não suportam a otimização por partição; nesses casos, `ALTER TABLE ... OPTIMIZE PARTITION` analisa e reconstrui toda a tabela, causando uma advertência apropriada a ser emitida. (Bug #11751825, Bug #42822) Use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso, para evitar esse problema.

- **Analisando partições.** Isso lê e armazena as distribuições de chaves para as partições.

  Exemplo:

  ```
  ALTER TABLE t1 ANALYZE PARTITION p3;
  ```

- **Reparando partições.** Isso conserta partições corrompidas.

  Exemplo:

  ```
  ALTER TABLE t1 REPAIR PARTITION p0,p1;
  ```

  Normalmente, `REPAIR PARTITION` falha quando a partição contém erros de chave duplicada. Você pode usar `ALTER IGNORE TABLE` com essa opção, caso em que todas as linhas que não podem ser movidas devido à presença de chaves duplicadas são removidas da partição (Bug #16900947).

- **Verificação de partições.** Você pode verificar as partições em busca de erros da mesma maneira que pode usar `CHECK TABLE` com tabelas não particionadas.

  Exemplo:

  ```
  ALTER TABLE trb3 CHECK PARTITION p1;
  ```

  Esta declaração informa se os dados ou índices na partição `p1` da tabela `t1` estão corrompidos. Se for esse o caso, use `ALTER TABLE ... REPAIR PARTITION` para reparar a partição.

  Normalmente, `CHECK PARTITION` falha quando a partição contém erros de chave duplicada. Você pode usar `ALTER IGNORE TABLE` com essa opção, caso em que a instrução retorna o conteúdo de cada linha na partição onde uma violação de chave duplicada é encontrada. Apenas os valores das colunas na expressão de particionamento da tabela são relatados. (Bug #16900947)

Cada uma das declarações na lista mostrada anteriormente também suporta a palavra-chave `ALL` no lugar da lista de nomes de partições. Usar `ALL` faz com que a declaração atue em todas as partições da tabela.

Você também pode truncar partições usando `ALTER TABLE ... TRUNCATE PARTITION`. Essa declaração pode ser usada para excluir todas as linhas de uma ou mais partições da mesma maneira que `TRUNCATE TABLE` exclui todas as linhas de uma tabela.

`ALTER TABLE ... TRUNCATE PARTITION ALL` trunca todas as partições na tabela.
