#### 1.7.2.3 Diferenças nas Restrições de Chave Estrangeira

A implementação do MySQL de restrições de chave estrangeira difere do padrão SQL nos seguintes aspectos-chave:

* Se houver várias linhas na tabela pai com o mesmo valor da chave referenciada, o `InnoDB` realiza uma verificação de chave estrangeira como se as outras linhas pai com o mesmo valor de chave não existissem. Por exemplo, se você definir uma restrição de tipo `RESTRICT`, e houver uma linha filha com várias linhas pai, o `InnoDB` não permite a exclusão de nenhuma das linhas pai. Isso é mostrado no exemplo seguinte:

  ```
  mysql> CREATE TABLE parent (
      ->     id INT,
      ->     INDEX (id)
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.04 sec)

  mysql> CREATE TABLE child (
      ->     id INT,
      ->     parent_id INT,
      ->     INDEX par_ind (parent_id),
      ->     FOREIGN KEY (parent_id)
      ->         REFERENCES parent(id)
      ->         ON DELETE RESTRICT
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.02 sec)

  mysql> INSERT INTO parent (id)
      ->     VALUES ROW(1), ROW(2), ROW(3), ROW(1);
  Query OK, 4 rows affected (0.01 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> INSERT INTO child (id,parent_id)
      ->     VALUES ROW(1,1), ROW(2,2), ROW(3,3);
  Query OK, 3 rows affected (0.01 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> DELETE FROM parent WHERE id=1;
  ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key
  constraint fails (`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY
  (`parent_id`) REFERENCES `parent` (`id`) ON DELETE RESTRICT)
  ```

* Se `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` recurre para atualizar a *mesma tabela* que foi previamente atualizada durante a mesma casca, age como `RESTRICT`. Isso significa que você não pode usar operações `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` auto-referenciadas. Isso é para evitar loops infinitos resultantes de atualizações em cascata. Uma `ON DELETE SET NULL` auto-referenciada, por outro lado, é possível, assim como uma `ON DELETE CASCADE` auto-referenciada. As operações em cascata podem não ser aninhadas mais do que 15 níveis de profundidade.

* Em uma declaração SQL que insere, exclui ou atualiza muitas linhas, as restrições de chave estrangeira (como restrições únicas) são verificadas linha por linha. Ao realizar verificações de chave estrangeira, o `InnoDB` define bloqueios compartilhados em nível de linha em registros filhos ou pai que ele deve examinar. O MySQL verifica as restrições de chave estrangeira imediatamente; a verificação não é adiada para o commit da transação. De acordo com o padrão SQL, o comportamento padrão deve ser a verificação adiada. Isso significa que as restrições são verificadas apenas após o *todo a declaração SQL* ter sido processada. Isso significa que não é possível excluir uma linha que se refere a si mesma usando uma chave estrangeira.

* Nenhum motor de armazenamento, incluindo o `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrições de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. A especificação da `MATCH` deve ser evitada.

  A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com múltiplas colunas) são tratados ao serem comparados a uma chave primária na tabela referenciada. O MySQL implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja `NULL` total ou parcialmente. Nesse caso, uma linha (de uma tabela filha) que contenha tal chave estrangeira pode ser inserida, mesmo que não corresponda a nenhuma linha na tabela referenciada (pai). (É possível implementar outras semânticas usando gatilhos.)

* Uma restrição `FOREIGN KEY` que faz referência a uma chave não `UNIQUE` não é SQL padrão, mas sim uma extensão do `InnoDB` que agora está desatualizada e deve ser habilitada definindo `restrict_fk_on_non_standard_key`. Você deve esperar que o suporte para o uso de chaves não padrão seja removido em uma versão futura do MySQL e migrar para elas agora.

  O motor de armazenamento `NDB` requer uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira, conforme o padrão SQL.

* Para motores de armazenamento que não suportam chaves estrangeiras (como `MyISAM`), o MySQL Server analisa e ignora as especificações de chaves estrangeiras.

* Versões anteriores do MySQL analisavam, mas ignoravam as especificações de `inline `REFERENCES` (conforme definido no padrão SQL) quando as referências eram definidas como parte da especificação da coluna. O MySQL 9.5 aceita tais cláusulas `REFERENCES` e aplica as chaves estrangeiras criadas dessa forma. Além disso, o MySQL 9.5 permite referências implícitas à chave primária da tabela pai. Isso significa que a seguinte sintaxe é válida:

  ```
  CREATE TABLE person (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name CHAR(60) NOT NULL,
      PRIMARY KEY (id)
  );

  CREATE TABLE shirt (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      style ENUM('tee', 'polo', 'dress') NOT NULL,
      color ENUM('red', 'blue', 'yellow', 'white', 'black') NOT NULL,
      owner SMALLINT UNSIGNED NOT NULL REFERENCES person,
      PRIMARY KEY (id)
  );
  ```

  Você pode ver que isso funciona verificando a saída de `SHOW CREATE TABLE` ou `DESCRIBE`, assim:

  ```
  mysql> SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
         Table: shirt
  Create Table: CREATE TABLE `shirt` (
    `id` smallint unsigned NOT NULL AUTO_INCREMENT,
    `style` enum('tee','polo','dress') NOT NULL,
    `color` enum('red','blue','yellow','white','black') NOT NULL,
    `owner` smallint unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `owner` (`owner`),
    CONSTRAINT `shirt_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `person` (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

Para obter mais informações sobre restrições de chaves estrangeiras, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.