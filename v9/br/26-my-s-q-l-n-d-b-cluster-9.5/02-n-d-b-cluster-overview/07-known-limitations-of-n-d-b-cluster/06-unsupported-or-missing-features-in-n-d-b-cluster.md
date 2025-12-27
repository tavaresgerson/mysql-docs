#### 25.2.7.6 Funcionalidades Não Suportadas ou Ausentes no NDB Cluster

Várias funcionalidades suportadas por outros motores de armazenamento não são suportadas para tabelas `NDB`. Tentar usar qualquer uma dessas funcionalidades no NDB Cluster não causa erros por si só; no entanto, erros podem ocorrer em aplicações que esperam que as funcionalidades sejam suportadas ou aplicadas. Declarações que fazem referência a essas funcionalidades, mesmo que efetivamente ignoradas pelo `NDB`, devem ser sintaticamente e de outra forma válidas.

* **Prefixos de índice.** Prefixos em índices não são suportados para tabelas `NDB`. Se um prefixo for usado como parte de uma especificação de índice em uma declaração como `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, o prefixo não é criado pelo `NDB`.

  Uma declaração que contém um prefixo de índice e cria ou modifica uma tabela `NDB` ainda deve ser sintaticamente válida. Por exemplo, a seguinte declaração sempre falha com Erro 1089 Chave de prefixo incorreta; a parte da chave usada não é uma string, a comprimento usado é maior que a parte da chave ou o motor de armazenamento não suporta chaves de prefixo únicas, independentemente do motor de armazenamento:

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

  Isso acontece devido à regra de sintaxe SQL de que nenhum índice pode ter um prefixo maior que ele mesmo.

* **Savepoints e rollback.** Savepoints e rollback para savepoints são ignorados como no `MyISAM`.

* **Durabilidade dos commits.** Não há commits duráveis no disco. Os commits são replicados, mas não há garantia de que os logs sejam descarregados no disco no commit.

* **Replicação.** A replicação baseada em declarações não é suportada. Use `--binlog-format=ROW` (ou `--binlog-format=MIXED`) ao configurar a replicação do cluster. Consulte a Seção 25.7, “Replicação do NDB Cluster”, para mais informações.

A replicação usando identificadores de transação global (GTIDs) não é compatível com o NDB Cluster e não é suportada no NDB Cluster 9.5. Os GTIDs devem ser desativados ao usar o mecanismo de armazenamento `NDB`, pois isso provavelmente causará problemas até a falha da replicação do NDB Cluster.

Para desativar os GTIDs, defina as variáveis `gtid_mode` e `enforce_gtid_consistency` para `OFF`.

A replicação semi-sincronizada não é suportada no NDB Cluster.

* **Colunas geradas.** O mecanismo de armazenamento `NDB` não suporta índices em colunas geradas virtuais.

  Como em outros mecanismos de armazenamento, você pode criar um índice em uma coluna gerada armazenada, mas deve ter em mente que o `NDB` usa `DataMemory` para o armazenamento da coluna gerada, bem como `IndexMemory` para o índice. Veja colunas JSON e indexação indireta no NDB Cluster, para um exemplo.

  O NDB Cluster escreve as alterações em colunas geradas armazenadas no log binário, mas não registra as feitas em colunas virtuais. Isso não deve afetar a replicação do NDB Cluster ou a replicação entre o `NDB` e outros mecanismos de armazenamento MySQL.

Nota

Consulte a Seção 25.2.7.3, “Limitações Relacionadas ao Tratamento de Transações no NDB Cluster”, para obter mais informações sobre as limitações no tratamento de transações no `NDB`.