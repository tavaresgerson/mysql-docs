### 8.5.5 Carregamento de dados em lote para tabelas InnoDB

Esses conselhos de desempenho complementam as diretrizes gerais para inserções rápidas na Seção 8.2.4.1, “Otimizando instruções INSERT”.

- Ao importar dados no `InnoDB`, desative o modo de autocommit, pois ele realiza um esvaziamento do log no disco para cada inserção. Para desabilitar o autocommit durante a operação de importação, rode-o com as instruções `SET autocommit` e `COMMIT`:

  ```sql
  SET autocommit=0;
  ... SQL import statements ...
  COMMIT;
  ```

  A opção `--opt` do **mysqldump** cria arquivos de dump que são rápidos de importar em uma tabela `InnoDB`, mesmo sem envolvê-los nas instruções `SET autocommit` e `COMMIT`.

- Se você tiver restrições `UNIQUE` em chaves secundárias, você pode acelerar a importação da tabela desativando temporariamente as verificações de unicidade durante a sessão de importação:

  ```sql
  SET unique_checks=0;
  ... SQL import statements ...
  SET unique_checks=1;
  ```

  Para tabelas grandes, isso economiza muito I/O de disco, pois o `InnoDB` pode usar seu buffer de alterações para escrever registros de índice secundário em lote. Certifique-se de que os dados não contenham chaves duplicadas.

- Se você tiver restrições de `FOREIGN KEY` em suas tabelas, você pode acelerar a importação das tabelas desativando as verificações de chave estrangeira durante a sessão de importação:

  ```sql
  SET foreign_key_checks=0;
  ... SQL import statements ...
  SET foreign_key_checks=1;
  ```

  Para tabelas grandes, isso pode economizar muito I/O de disco.

- Use a sintaxe de inserção de várias linhas para reduzir o overhead de comunicação entre o cliente e o servidor, se você precisar inserir muitas linhas:

  ```sql
  INSERT INTO yourtable VALUES (1,2), (5,5), ...;
  ```

  Essa dica é válida para inserções em qualquer tabela, não apenas em tabelas `InnoDB`.

- Ao realizar inserções em massa em tabelas com colunas de autoincremento, defina `innodb_autoinc_lock_mode` para 2, em vez do valor padrão 1. Consulte a Seção 14.6.1.6, “Tratamento do AUTO_INCREMENT no InnoDB”, para obter detalhes.

- Ao realizar inserções em massa, é mais rápido inserir linhas na ordem do `PRIMARY KEY`. As tabelas do `InnoDB` usam um índice agrupado, o que torna relativamente rápido o uso dos dados na ordem do `PRIMARY KEY`. Realizar inserções em massa na ordem do `PRIMARY KEY` é particularmente importante para tabelas que não cabem inteiramente no pool de buffers.

- Para obter o melhor desempenho ao carregar dados em um índice `FULLTEXT` do `InnoDB`, siga este conjunto de etapas:

  1. Defina uma coluna `FTS_DOC_ID` no momento da criação da tabela, do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único chamado `FTS_DOC_ID_INDEX`. Por exemplo:

     ```sql
     CREATE TABLE t1 (
     FTS_DOC_ID BIGINT unsigned NOT NULL AUTO_INCREMENT,
     title varchar(255) NOT NULL DEFAULT '',
     text mediumtext NOT NULL,
     PRIMARY KEY (`FTS_DOC_ID`)
     ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
     CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on t1(FTS_DOC_ID);
     ```

  2. Carregue os dados na tabela.

  3. Crie o índice `FULLTEXT` após o carregamento dos dados.

  Nota

  Ao adicionar a coluna `FTS_DOC_ID` no momento da criação da tabela, certifique-se de que a coluna `FTS_DOC_ID` seja atualizada quando a coluna indexada `FULLTEXT` for atualizada, pois o `FTS_DOC_ID` deve aumentar de forma monótona em cada `INSERT` ou `UPDATE`. Se você optar por não adicionar o `FTS_DOC_ID` no momento da criação da tabela e permitir que o `InnoDB` gerencie os IDs de DOC para você, o `InnoDB` adicionará o `FTS_DOC_ID` como uma coluna oculta na próxima chamada de `CREATE FULLTEXT INDEX`. Essa abordagem, no entanto, requer a reconstrução da tabela, o que pode impactar o desempenho.
