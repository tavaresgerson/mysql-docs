#### 13.7.5.16 Instrução SHOW ENGINES

```sql
SHOW [STORAGE] ENGINES
```

A instrução [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") exibe informações de status sobre os storage engines do servidor. Isso é particularmente útil para verificar se um storage engine é suportado ou para ver qual é o default engine.

Para obter informações sobre os storage engines do MySQL, consulte [Capítulo 14, *O Storage Engine InnoDB*](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), e [Capítulo 15, *Storage Engines Alternativos*](storage-engines.html "Chapter 15 Alternative Storage Engines").

```sql
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 2. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: FEDERATED
     Support: YES
     Comment: Federated MySQL storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
```

A saída da instrução [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") pode variar de acordo com a versão do MySQL utilizada e outros fatores.

A saída de [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") possui as seguintes colunas:

* `Engine`

  O nome do storage engine.

* `Support`

  O nível de suporte do servidor para o storage engine, conforme mostrado na tabela a seguir.

  <table summary="Valores para a coluna Support na saída da instrução SHOW ENGINES."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>O engine é suportado e está ativo</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Semelhante a <code>YES</code>, além de ser o default engine</td> </tr><tr> <td><code>NO</code></td> <td>O engine não é suportado</td> </tr><tr> <td><code>DISABLED</code></td> <td>O engine é suportado, mas foi desabilitado</td> </tr></tbody></table>

  Um valor de `NO` significa que o servidor foi compilado sem suporte para o engine, portanto, ele não pode ser habilitado em tempo de execução (runtime).

  Um valor de `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desabilita o engine, ou porque nem todas as opções necessárias para habilitá-lo foram fornecidas. Neste último caso, o error log deve conter um motivo indicando por que a opção está desabilitada. Consulte [Seção 5.4.2, “O Error Log”](error-log.html "5.4.2 The Error Log").

  Você também pode ver `DISABLED` para um storage engine se o servidor foi compilado para suportá-lo, mas foi iniciado com a opção `--skip-engine_name`. Para o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), `DISABLED` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster).

  Todos os servidores MySQL suportam tabelas `MyISAM`. Não é possível desabilitar o `MyISAM`.

* `Comment`

  Uma breve descrição do storage engine.

* `Transactions`

  Se o storage engine suporta Transactions.

* `XA`

  Se o storage engine suporta XA transactions.

* `Savepoints`

  Se o storage engine suporta Savepoints.

Informações sobre storage engines também estão disponíveis na tabela [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") do `INFORMATION_SCHEMA`. Consulte [Seção 24.3.7, “A Tabela INFORMATION_SCHEMA ENGINES”](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table").