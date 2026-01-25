### 8.5.5 Carregamento em Massa de Dados para Tabelas InnoDB

Estas dicas de performance complementam as diretrizes gerais para `INSERT`s rápidos na Seção 8.2.4.1, “Otimizando Declarações INSERT”.

* Ao importar dados para o `InnoDB`, desative o modo `autocommit`, pois ele executa um log flush para o disco a cada `INSERT`. Para desativar o `autocommit` durante a operação de importação, envolva-a com as declarações `SET autocommit` e `COMMIT`:

  ```sql
  SET autocommit=0;
  ... SQL import statements ...
  COMMIT;
  ```

  A opção `--opt` do **mysqldump** cria arquivos dump que são rápidos de importar para uma tabela `InnoDB`, mesmo sem envolvê-los com as declarações `SET autocommit` e `COMMIT`.

* Se você tiver `UNIQUE` constraints em secondary keys, pode acelerar a importação de tabelas desativando temporariamente as verificações de unicidade durante a sessão de importação:

  ```sql
  SET unique_checks=0;
  ... SQL import statements ...
  SET unique_checks=1;
  ```

  Para tabelas grandes, isso economiza muito I/O de disco porque o `InnoDB` pode usar seu change buffer para escrever secondary index records em lote. Certifique-se de que os dados não contêm chaves duplicadas.

* Se você tiver `FOREIGN KEY` constraints em suas tabelas, pode acelerar a importação de tabelas desativando as verificações de foreign key durante a duração da sessão de importação:

  ```sql
  SET foreign_key_checks=0;
  ... SQL import statements ...
  SET foreign_key_checks=1;
  ```

  Para tabelas grandes, isso pode economizar muito I/O de disco.

* Use a sintaxe de `INSERT` de múltiplas linhas para reduzir a sobrecarga de comunicação entre o client e o server se você precisar inserir muitas linhas:

  ```sql
  INSERT INTO yourtable VALUES (1,2), (5,5), ...;
  ```

  Esta dica é válida para `INSERT`s em qualquer tabela, não apenas em tabelas `InnoDB`.

* Ao realizar bulk inserts em tabelas com colunas auto-increment, defina `innodb_autoinc_lock_mode` como 2 em vez do valor padrão 1. Consulte a Seção 14.6.1.6, “AUTO_INCREMENT Handling in InnoDB” para detalhes.

* Ao executar bulk inserts, é mais rápido inserir linhas na ordem da `PRIMARY KEY`. As tabelas `InnoDB` usam um clustered index, o que torna relativamente rápido usar os dados na ordem da `PRIMARY KEY`. A realização de bulk inserts na ordem da `PRIMARY KEY` é particularmente importante para tabelas que não cabem inteiramente no buffer pool.

* Para performance ideal ao carregar dados em um `FULLTEXT` index do `InnoDB`, siga este conjunto de passos:

  1. Defina uma coluna `FTS_DOC_ID` no momento da criação da tabela, do tipo `BIGINT UNSIGNED NOT NULL`, com um unique index chamado `FTS_DOC_ID_INDEX`. Por exemplo:

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
  3. Crie o `FULLTEXT` index depois que os dados forem carregados.

  Nota

  Ao adicionar a coluna `FTS_DOC_ID` no momento da criação da tabela, certifique-se de que a coluna `FTS_DOC_ID` seja atualizada quando a coluna indexada `FULLTEXT` for atualizada, pois o `FTS_DOC_ID` deve aumentar monotonicamente a cada `INSERT` ou `UPDATE`. Se você optar por não adicionar o `FTS_DOC_ID` no momento da criação da tabela e permitir que o `InnoDB` gerencie os DOC IDs para você, o `InnoDB` adicionará o `FTS_DOC_ID` como uma coluna oculta na próxima chamada `CREATE FULLTEXT INDEX`. No entanto, esta abordagem requer um table rebuild que pode impactar a performance.