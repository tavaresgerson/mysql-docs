### 10.5.5 Carregamento de dados em lote para tabelas InnoDB

Esses conselhos de desempenho complementam as diretrizes gerais para inserções rápidas na Seção 10.2.5.1, “Otimizando instruções INSERT”.

- Ao importar dados no `InnoDB`, desative o modo de autocommit, pois ele realiza um esvaziamento do log no disco para cada inserção. Para desabilitar o autocommit durante a operação de importação, rode-o com as instruções `SET autocommit` e `COMMIT`:

  ```
  SET autocommit=0;
  ... SQL import statements ...
  COMMIT;
  ```

  A opção **mysqldump** `--opt` cria arquivos de dump que são rápidos de importar em uma tabela `InnoDB`, mesmo sem serem envolvidos pelas instruções `SET autocommit` e `COMMIT`.

- Se você tiver restrições `UNIQUE` em chaves secundárias, você pode acelerar a importação da tabela desativando temporariamente as verificações de unicidade durante a sessão de importação:

  ```
  SET unique_checks=0;
  ... SQL import statements ...
  SET unique_checks=1;
  ```

  Para tabelas grandes, isso economiza muito I/O de disco, pois o `InnoDB` pode usar seu buffer de alterações para escrever registros de índice secundário em lote. Certifique-se de que os dados não contenham chaves duplicadas.

- Se você tiver restrições `FOREIGN KEY` em suas tabelas, você pode acelerar a importação da tabela desativando as verificações de chave estrangeira durante a sessão de importação:

  ```
  SET foreign_key_checks=0;
  ... SQL import statements ...
  SET foreign_key_checks=1;
  ```

  Para tabelas grandes, isso pode economizar muito I/O de disco.

- Use a sintaxe de várias linhas `INSERT` para reduzir o overhead de comunicação entre o cliente e o servidor, se você precisar inserir muitas linhas:

  ```
  INSERT INTO yourtable VALUES (1,2), (5,5), ...;
  ```

  Essa dica é válida para inserções em qualquer tabela, não apenas em tabelas `InnoDB`.

- Ao fazer inserções em massa em tabelas com colunas de autoincremento, defina `innodb_autoinc_lock_mode` para 2 (interligado) em vez de 1 (consecutivo). Consulte a Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT no InnoDB”, para obter detalhes.

- Ao realizar inserções em massa, é mais rápido inserir linhas na ordem `PRIMARY KEY`. As tabelas `InnoDB` usam um índice agrupado, o que torna relativamente rápido o uso dos dados na ordem da `PRIMARY KEY`. Realizar inserções em massa na ordem `PRIMARY KEY` é particularmente importante para tabelas que não cabem inteiramente no pool de buffers.

- Para obter o melhor desempenho ao carregar dados em um índice `InnoDB` `FULLTEXT`, siga este conjunto de etapas:

  1. Defina uma coluna `FTS_DOC_ID` no momento da criação da tabela, do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único chamado `FTS_DOC_ID_INDEX`. Por exemplo:

     ```
     CREATE TABLE t1 (
     FTS_DOC_ID BIGINT unsigned NOT NULL AUTO_INCREMENT,
     title varchar(255) NOT NULL DEFAULT '',
     text mediumtext NOT NULL,
     PRIMARY KEY (`FTS_DOC_ID`)
     ) ENGINE=InnoDB;
     CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on t1(FTS_DOC_ID);
     ```

  2. Carregue os dados na tabela.

  3. Crie o índice `FULLTEXT` após o carregamento dos dados.

  Nota

  Ao adicionar a coluna `FTS_DOC_ID` no momento da criação da tabela, certifique-se de que a coluna `FTS_DOC_ID` seja atualizada quando a coluna indexada `FULLTEXT` for atualizada, pois a `FTS_DOC_ID` deve aumentar de forma monótona com cada chamada de `INSERT` ou `UPDATE`. Se você optar por não adicionar a `FTS_DOC_ID` no momento da criação da tabela e permitir que o `InnoDB` gerencie os IDs do DOC, o `InnoDB` adiciona a `FTS_DOC_ID` como uma coluna oculta na próxima chamada de `CREATE FULLTEXT INDEX`. Essa abordagem, no entanto, requer a reconstrução da tabela, o que pode impactar o desempenho.

- Se estiver carregando dados em uma instância *nova* do MySQL, considere desabilitar o registro de redo usando a sintaxe `ALTER INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG`. Desabilitar o registro de redo ajuda a acelerar o carregamento de dados, evitando gravações no log de redo. Para mais informações, consulte Desabilitar o Registro de Redo.

  Aviso

  Este recurso é destinado apenas para carregar dados em uma nova instância do MySQL. *Não desative o registro de redo em um sistema de produção.* É permitido desligar e reiniciar o servidor enquanto o registro de redo está desativado, mas uma parada inesperada do servidor enquanto o registro de redo está desativado pode causar perda de dados e corrupção da instância.

- Use o MySQL Shell para importar dados. O utilitário de importação de tabelas paralela do MySQL Shell `util.importTable()` oferece uma rápida importação de dados para uma tabela relacional MySQL para arquivos de dados grandes. O utilitário de carregamento de dump do MySQL Shell `util.loadDump()` também oferece capacidades de carregamento paralela. Veja os utilitários do MySQL Shell.
