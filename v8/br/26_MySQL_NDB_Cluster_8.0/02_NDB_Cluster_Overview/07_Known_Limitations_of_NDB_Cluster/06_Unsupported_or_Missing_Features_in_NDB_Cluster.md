#### 25.2.7.6 Recursos não suportados ou ausentes no NDB Cluster

Várias funcionalidades suportadas por outros motores de armazenamento não são suportadas para tabelas `NDB`. Tentar usar qualquer uma dessas funcionalidades no NDB Cluster não causa erros por si só; no entanto, erros podem ocorrer em aplicativos que esperam que as funcionalidades sejam suportadas ou aplicadas. Declarações que fazem referência a essas funcionalidades, mesmo que efetivamente ignoradas por `NDB`, devem ser sintaticamente e de outra forma válidas.

- **Prefixos de índice.** Prefixos em índices não são suportados para tabelas `NDB`. Se um prefixo for usado como parte de uma especificação de índice em uma declaração como `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`, o prefixo não é criado por `NDB`.

  Uma declaração que contenha um prefixo de índice e crie ou modifique uma tabela `NDB` ainda deve ser sintaticamente válida. Por exemplo, a seguinte declaração sempre falha com o erro 1089 Chave de prefixo incorreta; a parte da chave usada não é uma string, a extensão usada é maior que a parte da chave ou o mecanismo de armazenamento não suporta chaves de prefixo únicas, independentemente do mecanismo de armazenamento:

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

  Isso acontece devido à regra de sintaxe SQL de que nenhum índice pode ter um prefixo maior que ele mesmo.

- **Pontos de salvamento e recuos.** Pontos de salvamento e recuos para pontos de salvamento são ignorados como em `MyISAM`.

- **Durabilidade dos commits.** Não há commits duráveis no disco. Os commits são replicados, mas não há garantia de que os logs sejam descarregados no disco ao commit.

- **Replicação.** A replicação baseada em declarações não é suportada. Use `--binlog-format=ROW` (ou `--binlog-format=MIXED`) ao configurar a replicação de cluster. Consulte a Seção 25.7, “Replicação de Cluster NDB”, para obter mais informações.

  A replicação usando identificadores de transação global (GTIDs) não é compatível com o NDB Cluster e não é suportada no NDB Cluster 8.0. Não habilite GTIDs ao usar o mecanismo de armazenamento `NDB`, pois isso provavelmente causará problemas até o falhar da replicação do NDB Cluster.

  A replicação semiesincronizada não é suportada no NDB Cluster.

- **Colunas geradas.** O mecanismo de armazenamento `NDB` não suporta índices em colunas geradas virtualmente.

  Assim como em outros motores de armazenamento, você pode criar um índice em uma coluna gerada armazenada, mas você deve ter em mente que o `NDB` usa o `DataMemory` para o armazenamento da coluna gerada, assim como o `IndexMemory` para o índice. Veja colunas JSON e indexação indireta no NDB Cluster, para um exemplo.

  O NDB Cluster grava as alterações nas colunas geradas armazenadas no log binário, mas não grava as alterações feitas em colunas virtuais. Isso não deve afetar a replicação do NDB Cluster ou a replicação entre `NDB` e outros motores de armazenamento MySQL.

Nota

Consulte a Seção 25.2.7.3, “Limitações relacionadas ao processamento de transações no NDB Cluster”, para obter mais informações sobre as limitações no processamento de transações em `NDB`.
