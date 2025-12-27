### 10.5.5 Carregamento de Dados em Massa para Tabelas InnoDB

Esses conselhos de desempenho complementam as diretrizes gerais para inserções rápidas na Seção 10.2.5.1, “Otimização de Instruções INSERT”.

* Ao importar dados para `InnoDB`, desative o modo de autocommit, pois ele realiza um esvaziamento do log no disco para cada inserção. Para desabilitar o autocommit durante a operação de importação, rode-o com as instruções `SET autocommit` e `COMMIT`:

  ```
  SET autocommit=0;
  ... SQL import statements ...
  COMMIT;
  ```

  A opção `--opt` do **mysqldump** cria arquivos de dump que são rápidos de importar em uma tabela `InnoDB`, mesmo sem serem envolvidos pelas instruções `SET autocommit` e `COMMIT`.

* Se você tiver restrições `UNIQUE` em chaves secundárias, pode acelerar as importações de tabelas desativando temporariamente as verificações de unicidade durante a sessão de importação:

  ```
  SET unique_checks=0;
  ... SQL import statements ...
  SET unique_checks=1;
  ```

  Para tabelas grandes, isso economiza muito I/O de disco porque o `InnoDB` pode usar seu buffer de alterações para escrever registros de índice secundário em lote. Certifique-se de que os dados não contenham chaves duplicadas.

* Se você tiver restrições `FOREIGN KEY` em suas tabelas, pode acelerar as importações de tabelas desativando as verificações de chave estrangeira durante a sessão de importação:

  ```
  SET foreign_key_checks=0;
  ... SQL import statements ...
  SET foreign_key_checks=1;
  ```

  Para tabelas grandes, isso pode economizar muito I/O de disco.

* Use a sintaxe de inserção de múltiplas linhas para reduzir o overhead de comunicação entre o cliente e o servidor se você precisar inserir muitas linhas:

  ```
  INSERT INTO yourtable VALUES (1,2), (5,5), ...;
  ```

  Este conselho é válido para inserções em qualquer tabela, não apenas tabelas `InnoDB`.

* Ao fazer inserções em massa em tabelas com colunas de autoincremento, defina `innodb_autoinc_lock_mode` para 2 (interleaved) em vez de 1 (consecutive). Veja a Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT em InnoDB” para detalhes.

* Ao realizar inserções em massa, é mais rápido inserir linhas na ordem do `PRIMARY KEY`. As tabelas do `InnoDB` usam um índice agrupado, o que torna relativamente rápido usar os dados na ordem do `PRIMARY KEY`. Realizar inserções em massa na ordem do `PRIMARY KEY` é particularmente importante para tabelas que não cabem inteiramente no pool de buffers.

* Para obter o melhor desempenho ao carregar dados em um índice `FULLTEXT` do `InnoDB`, siga este conjunto de etapas:

  1. Defina uma coluna `FTS_DOC_ID` no momento da criação da tabela, do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único chamado `FTS_DOC_ID_INDEX`. Por exemplo:

     ```
     CREATE TABLE t1 (
         FTS_DOC_ID BIGINT unsigned NOT NULL AUTO_INCREMENT,
         title varchar(255) NOT NULL DEFAULT '',
         text mediumtext NOT NULL,
     PRIMARY KEY (`FTS_DOC_ID`)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

     CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on t1(FTS_DOC_ID);
     ```

  2. Carregue os dados para a tabela.
  3. Crie o índice `FULLTEXT` após o carregamento dos dados.

  Observação

  Ao adicionar a coluna `FTS_DOC_ID` no momento da criação da tabela, certifique-se de que a coluna `FTS_DOC_ID` seja atualizada quando a coluna indexada `FULLTEXT` for atualizada, pois o `FTS_DOC_ID` deve aumentar de forma monótona com cada `INSERT` ou `UPDATE`. Se você optar por não adicionar o `FTS_DOC_ID` no momento da criação da tabela e permitir que o `InnoDB` gerencie os IDs de DOC para você, o `InnoDB` adiciona o `FTS_DOC_ID` como uma coluna oculta na próxima chamada de `CREATE FULLTEXT INDEX`. Essa abordagem, no entanto, requer uma reconstrução da tabela, o que pode impactar o desempenho.

* Se estiver carregando dados em uma nova instância do MySQL, considere desabilitar o registro de redo usando a sintaxe `ALTER INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG`. Desabilitar o registro de redo ajuda a acelerar o carregamento de dados, evitando gravações no log de redo. Para mais informações, consulte Desabilitar o Registro de Redo.

  Aviso

Este recurso é destinado apenas para carregar dados em uma nova instância do MySQL. *Não desative o registro de redo em um sistema de produção.* É permitido desligar e reiniciar o servidor enquanto o registro de redo está desativado, mas uma parada inesperada do servidor enquanto o registro de redo está desativado pode causar perda de dados e corrupção da instância.

* Use o MySQL Shell para importar dados. O utilitário de importação de tabela paralela do MySQL Shell `util.importTable()` oferece importação rápida de dados para uma tabela relacional do MySQL para arquivos de dados grandes. O utilitário de carregamento de dump do MySQL Shell `util.loadDump()` também oferece capacidades de carregamento paralela. Veja MySQL Shell Utilities.