#### 21.2.7.6 Recursos Não Suportados ou Ausentes no NDB Cluster

Vários recursos suportados por outros *storage engines* não são suportados para tabelas `NDB`. Tentar usar qualquer um desses recursos no NDB Cluster não causa erros em si; no entanto, podem ocorrer erros em aplicações que esperam que esses recursos sejam suportados ou aplicados. As instruções que fazem referência a tais recursos, mesmo que efetivamente ignoradas pelo `NDB`, devem ser sintaticamente e, de outras formas, válidas.

* **Prefixos de Index.** Prefixos em Indexes não são suportados para tabelas `NDB`. Se um prefixo for usado como parte de uma especificação de Index em uma instrução como `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, o prefixo não é criado pelo `NDB`.

  Uma instrução contendo um prefixo de Index, e que crie ou modifique uma tabela `NDB`, ainda deve ser sintaticamente válida. Por exemplo, a instrução a seguir sempre falha com o Erro 1089 Incorrect prefix key; the used key part isn't a string, the used length is longer than the key part, or the storage engine does not support unique prefix keys, independentemente do *storage engine*:

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

  Isso ocorre devido à regra de sintaxe SQL de que nenhum Index pode ter um prefixo maior que o próprio Index.

* **Savepoints e rollbacks.** *Savepoints* e *rollbacks* para *savepoints* são ignorados, como ocorre no `MyISAM`.

* **Durabilidade dos commits.** Não há *commits* duráveis em disco. Os *commits* são replicados, mas não há garantia de que os *logs* sejam descarregados em disco no momento do *commit*.

* **Replicação.** A Replicação baseada em instrução (*Statement-based replication*) não é suportada. Use `--binlog-format=ROW` (ou `--binlog-format=MIXED`) ao configurar a replicação do cluster. Consulte Section 21.7, “NDB Cluster Replication”, para obter mais informações.

  A Replicação usando identificadores de transação globais (GTIDs) não é compatível com NDB Cluster e não é suportada no NDB Cluster 7.5 ou NDB Cluster 7.6. Não ative GTIDs ao usar o *storage engine* `NDB`, pois isso é muito provável que cause problemas, incluindo a falha do NDB Cluster Replication.

  A replicação semissíncrona não é suportada no NDB Cluster.

  Ao replicar entre clusters, é possível usar endereços IPv6 entre SQL nodes em clusters diferentes, mas todas as conexões dentro de um determinado cluster devem usar endereçamento IPv4. Para mais informações, consulte NDB Cluster Replication and IPv6.

* **Generated columns.** O *storage engine* `NDB` não suporta Indexes em *virtual generated columns*.

  Assim como em outros *storage engines*, você pode criar um Index em uma *stored generated column*, mas deve ter em mente que o `NDB` utiliza `DataMemory` para o armazenamento da coluna gerada, bem como `IndexMemory` para o Index. Consulte JSON columns and indirect indexing in NDB Cluster, para um exemplo.

  O NDB Cluster escreve alterações em *stored generated columns* no *binary log*, mas não registra aquelas feitas em *virtual columns*. Isso não deve afetar o NDB Cluster Replication ou a replicação entre `NDB` e outros *storage engines* do MySQL.

Note

Consulte Section 21.2.7.3, “Limits Relating to Transaction Handling in NDB Cluster”, para obter mais informações relacionadas às limitações no tratamento de transações no `NDB`.