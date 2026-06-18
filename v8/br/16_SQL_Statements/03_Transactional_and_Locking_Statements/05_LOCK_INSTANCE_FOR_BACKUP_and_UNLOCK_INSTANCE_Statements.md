### 15.3.5 Declarações para LOCK INSTANCE FOR BACKUP e UNLOCK INSTANCE

```
LOCK INSTANCE FOR BACKUP

UNLOCK INSTANCE
```

`LOCK INSTANCE FOR BACKUP` adquire um *bloqueio de backup* de nível de instância que permite operações de DML durante um backup online, impedindo operações que possam resultar em um instantâneo inconsistente.

Para executar a instrução `LOCK INSTANCE FOR BACKUP`, é necessário o privilégio `BACKUP_ADMIN`. O privilégio `BACKUP_ADMIN` é concedido automaticamente aos usuários com o privilégio `RELOAD` ao realizar uma atualização local para o MySQL 8.0 a partir de uma versão anterior.

Múltiplas sessões podem manter um bloqueio de backup simultaneamente.

`UNLOCK INSTANCE` libera um bloqueio de backup mantido pela sessão atual. Um bloqueio de backup mantido por uma sessão também é liberado se a sessão for encerrada.

`LOCK INSTANCE FOR BACKUP` impede a criação, renomeação ou remoção de arquivos. As declarações de gerenciamento de contas `REPAIR TABLE`, `TRUNCATE TABLE`, `OPTIMIZE TABLE` e `InnoDB` são bloqueadas. Consulte a Seção 15.7.1, “Declarações de Gerenciamento de Contas”. As operações que modificam arquivos `InnoDB` que não estão registrados no log de reversão `InnoDB` também são bloqueadas.

`LOCK INSTANCE FOR BACKUP` permite operações DDL que afetam apenas tabelas temporárias criadas pelo usuário. Na prática, arquivos que pertencem a tabelas temporárias criadas pelo usuário podem ser criados, renomeados ou removidos enquanto um bloqueio de backup estiver em vigor. A criação de arquivos de log binário também é permitida.

`PURGE BINARY LOGS` não deve ser emitido enquanto uma declaração `LOCK INSTANCE FOR BACKUP` estiver em vigor para a instância, porque isso viola as regras do bloqueio de backup ao remover arquivos do servidor. A partir do MySQL 8.0.28, isso é desaconselhado.

Um bloqueio de backup adquirido por `LOCK INSTANCE FOR BACKUP` é independente de bloqueios transacionais e bloqueios tomados por `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`, e as seguintes sequências de instruções são permitidas:

```
LOCK INSTANCE FOR BACKUP;
FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK;
UNLOCK TABLES;
UNLOCK INSTANCE;
```

```
FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK;
LOCK INSTANCE FOR BACKUP;
UNLOCK INSTANCE;
UNLOCK TABLES;
```

A configuração `lock_wait_timeout` define o tempo que uma declaração `LOCK INSTANCE FOR BACKUP` espera para adquirir um bloqueio antes de desistir.
