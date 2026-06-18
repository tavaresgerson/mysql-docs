### 15.1.1 Declaração de Definição de Dados Atômicos de Suporte

O MySQL 8.0 suporta declarações atômicas do Data Definition Language (DDL). Esse recurso é conhecido como *DDL atômico*. Uma declaração DDL atômica combina as atualizações do dicionário de dados, as operações do mecanismo de armazenamento e os registros binários associados a uma operação DDL em uma única operação atômica. A operação é confirmada, com as alterações aplicáveis persistidas no dicionário de dados, no mecanismo de armazenamento e no registro binário, ou é revertida, mesmo que o servidor seja interrompido durante a operação.

Nota

*DDL atômico* não é *DDL transacional*. As instruções DDL, sejam elas atômicas ou não, encerram implicitamente qualquer transação ativa na sessão atual, como se você tivesse executado um `COMMIT` antes de executar a instrução. Isso significa que as instruções DDL não podem ser executadas dentro de outra transação, dentro de instruções de controle de transação como `START TRANSACTION ... COMMIT`, ou combinadas com outras instruções dentro da mesma transação.

O DDL atômico é possível graças à introdução do dicionário de dados MySQL no MySQL 8.0. Em versões anteriores do MySQL, os metadados eram armazenados em arquivos de metadados, tabelas não transacionais e dicionários específicos do mecanismo de armazenamento, o que exigia commits intermediários. O armazenamento centralizado e transacional de metadados fornecido pelo dicionário de dados MySQL removeu essa barreira, tornando possível reestruturar as operações das declarações DDL para serem atômicas.

O recurso DDL atômico é descrito nos seguintes tópicos nesta seção:

- Declarações DDL suportadas
- Características do DDL Atômico
- Mudanças no comportamento da declaração DDL
- Suporte ao Motor de Armazenamento
- Visualizar logs de DDL

#### Declarações DDL suportadas

O recurso DDL atômico suporta tanto declarações DDL de tabela quanto não de tabela. As operações DDL relacionadas a tabelas requerem suporte do mecanismo de armazenamento, enquanto as operações DDL não relacionadas a tabelas não o fazem. Atualmente, apenas o mecanismo de armazenamento `InnoDB` suporta DDL atômico.

- As declarações DDL suportadas incluem as declarações `CREATE`, `ALTER`, e `DROP` para bancos de dados, espaços de tabelas, tabelas e índices, e a declaração `TRUNCATE TABLE`.

- As declarações DDL não tabelárias suportadas incluem:

  - As declarações `CREATE` e `DROP` e, se aplicável, as declarações `ALTER` para programas armazenados, gatilhos, visualizações e funções carregáveis.

  - Declarações de gerenciamento de contas: declarações `CREATE`, `ALTER`, `DROP` e, se aplicável, declarações `RENAME` para usuários e papéis, bem como declarações `GRANT` e `REVOKE`.

As seguintes declarações não são suportadas pelo recurso DDL atômico:

- Declarações DDL relacionadas a tabelas que envolvem um mecanismo de armazenamento diferente de `InnoDB`.

- declarações `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

- declarações `INSTALL COMPONENT` e `UNINSTALL COMPONENT`.

- `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`

#### Características do DDL Atômico

As características das declarações DDL atômicas incluem o seguinte:

- As atualizações de metadados, as gravações no log binário e as operações do mecanismo de armazenamento, quando aplicável, são combinadas em uma única operação atômica.

- Não há commits intermediários na camada SQL durante a operação DDL.

- Quando aplicável:

  - O estado dos cachês de dicionário de dados, rotinas, eventos e funções carregáveis é consistente com o status da operação DDL, o que significa que os cachês são atualizados para refletir se a operação DDL foi concluída com sucesso ou revertida.

  - Os métodos do mecanismo de armazenamento envolvidos em uma operação de DDL não realizam commits intermediários, e o mecanismo de armazenamento se registra como parte da operação de DDL.

  - O mecanismo de armazenamento suporta o redo e o rollback de operações de DDL, que são executadas na fase *Post-DDL* da operação de DDL.

- O comportamento visível das operações DDL é atômico, o que altera o comportamento de algumas instruções DDL. Veja Mudanças no comportamento das instruções DDL.

#### Mudanças no comportamento da declaração DDL

Esta seção descreve as mudanças no comportamento das declarações DDL devido à introdução do suporte DDL atômico.

- As operações `DROP TABLE` são totalmente atômicas se todas as tabelas nomeadas usarem um mecanismo de armazenamento que suporte DDL atômico. A instrução ou descarta todas as tabelas com sucesso ou é revertida.

  `DROP TABLE` falha com um erro se uma tabela nomeada não existir e nenhuma alteração for feita, independentemente do mecanismo de armazenamento. Essa mudança de comportamento é demonstrada no exemplo seguinte, onde a instrução `DROP TABLE` falha porque uma tabela nomeada não existe:

  ```
  mysql> CREATE TABLE t1 (c1 INT);
  mysql> DROP TABLE t1, t2;
  ERROR 1051 (42S02): Unknown table 'test.t2'
  mysql> SHOW TABLES;
  +----------------+
  | Tables_in_test |
  +----------------+
  | t1             |
  +----------------+
  ```

  Antes da introdução do DDL atômico, o `DROP TABLE` relata um erro para a tabela nomeada que não existe, mas consegue sucesso para a tabela nomeada que existe:

  ```
  mysql> CREATE TABLE t1 (c1 INT);
  mysql> DROP TABLE t1, t2;
  ERROR 1051 (42S02): Unknown table 'test.t2'
  mysql> SHOW TABLES;
  Empty set (0.00 sec)
  ```

  Nota

  Devido a essa mudança no comportamento, uma declaração `DROP TABLE` parcialmente concluída em um servidor de origem de replicação do MySQL 5.7 falha quando replicada em uma replica do MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` em declarações `DROP TABLE` para evitar que erros ocorram para tabelas que não existem.

- `DROP DATABASE` é atômico se todas as tabelas usarem um mecanismo de armazenamento que suporte DDL atômico. A instrução ou descarta todos os objetos com sucesso ou é revertida. No entanto, a remoção do diretório do banco de dados do sistema de arquivos ocorre por último e não faz parte da operação atômica. Se a remoção do diretório do banco de dados falhar devido a um erro no sistema de arquivos ou ao desligamento do servidor, a transação `DROP DATABASE` não é revertida.

- Para tabelas que não utilizam um mecanismo de armazenamento que suporte DDL atômico, a exclusão da tabela ocorre fora da transação `DROP TABLE` ou `DROP DATABASE` atômica. Essas exclusões de tabela são escritas no log binário individualmente, o que limita a discrepância entre o mecanismo de armazenamento, o dicionário de dados e o log binário a, no máximo, uma tabela no caso de uma operação `DROP TABLE` ou `DROP DATABASE` interrompida. Para operações que excluem múltiplas tabelas, as tabelas que não utilizam um mecanismo de armazenamento que suporte DDL atômico são excluídas antes das tabelas que o fazem.

- As operações `CREATE TABLE`, `ALTER TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`, `CREATE TABLESPACE` e `DROP TABLESPACE` para tabelas que utilizam um mecanismo de armazenamento que suporta DDL atômico são totalmente comprometidas ou revertidas se o servidor interromper durante sua operação. Em versões anteriores do MySQL, a interrupção dessas operações poderia causar discrepâncias entre o mecanismo de armazenamento, o dicionário de dados e o log binário, ou deixar arquivos órfãos. As operações `RENAME TABLE` são apenas atômicas se todas as tabelas nomeadas utilizarem um mecanismo de armazenamento que suporte DDL atômico.

- A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômico, a instrução `CREATE TABLE ... SELECT` é registrada como uma transação no log binário quando a replicação baseada em linhas está em uso. Anteriormente, ela era registrada como duas transações, uma para criar a tabela e outra para inserir dados. Uma falha no servidor entre as duas transações ou durante a inserção de dados poderia resultar na replicação de uma tabela vazia. Com a introdução do suporte a DDL atômico, as instruções `CREATE TABLE ... SELECT` agora são seguras para a replicação baseada em linhas e permitidas para uso com replicação baseada em GTID.

  Em motores de armazenamento que suportam tanto DDL atômico quanto restrições de chave estrangeira, a criação de chaves estrangeiras não é permitida em declarações `CREATE TABLE ... SELECT` quando a replicação baseada em linhas está em uso. As restrições de chave estrangeira podem ser adicionadas posteriormente usando `ALTER TABLE`.

  Quando o `CREATE TABLE ... SELECT` é aplicado como uma operação atômica, uma trava de metadados é mantida na tabela enquanto os dados são inseridos, o que impede o acesso concorrente à tabela durante a duração da operação.

- `DROP VIEW` falha se uma visualização nomeada não existir e nenhuma alteração for feita. O comportamento alterado é demonstrado neste exemplo, onde a instrução `DROP VIEW` falha porque uma visualização nomeada não existe:

  ```
  mysql> CREATE VIEW test.viewA AS SELECT * FROM t;
  mysql> DROP VIEW test.viewA, test.viewB;
  ERROR 1051 (42S02): Unknown table 'test.viewB'
  mysql> SHOW FULL TABLES IN test WHERE TABLE_TYPE LIKE 'VIEW';
  +----------------+------------+
  | Tables_in_test | Table_type |
  +----------------+------------+
  | viewA          | VIEW       |
  +----------------+------------+
  ```

  Antes da introdução do DDL atômico, `DROP VIEW` retorna um erro para a visão nomeada que não existe, mas tem sucesso para a visão nomeada que existe:

  ```
  mysql> CREATE VIEW test.viewA AS SELECT * FROM t;
  mysql> DROP VIEW test.viewA, test.viewB;
  ERROR 1051 (42S02): Unknown table 'test.viewB'
  mysql> SHOW FULL TABLES IN test WHERE TABLE_TYPE LIKE 'VIEW';
  Empty set (0.00 sec)
  ```

  Nota

  Devido a essa mudança no comportamento, uma operação `DROP VIEW` parcialmente concluída em um servidor de origem de replicação do MySQL 5.7 falha quando replicada em uma replica do MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` nas instruções `DROP VIEW` para evitar que um erro ocorra para visualizações que não existem.

- A execução parcial das declarações de gerenciamento de contas não é mais permitida. As declarações de gerenciamento de contas ou têm sucesso para todos os usuários nomeados ou são revertidas e não têm efeito se ocorrer um erro. Em versões anteriores do MySQL, as declarações de gerenciamento de contas que nomeiam vários usuários podiam ter sucesso para alguns usuários e falhar para outros.

  A mudança de comportamento é demonstrada neste exemplo, onde a segunda declaração `CREATE USER` retorna um erro, mas falha porque não pode ser concluída para todos os usuários nomeados.

  ```
  mysql> CREATE USER userA;
  mysql> CREATE USER userA, userB;
  ERROR 1396 (HY000): Operation CREATE USER failed for 'userA'@'%'
  mysql> SELECT User FROM mysql.user WHERE User LIKE 'user%';
  +-------+
  | User  |
  +-------+
  | userA |
  +-------+
  ```

  Antes da introdução do DDL atômico, a segunda instrução `CREATE USER` retorna um erro para o usuário nomeado que não existe, mas tem sucesso para o usuário nomeado que existe:

  ```
  mysql> CREATE USER userA;
  mysql> CREATE USER userA, userB;
  ERROR 1396 (HY000): Operation CREATE USER failed for 'userA'@'%'
  mysql> SELECT User FROM mysql.user WHERE User LIKE 'user%';
  +-------+
  | User  |
  +-------+
  | userA |
  | userB |
  +-------+
  ```

  Nota

  Devido a essa mudança no comportamento, os extratos de gerenciamento de contas parcialmente concluídos em um servidor de origem de replicação MySQL 5.7 falham ao serem replicados em uma replica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` ou `IF NOT EXISTS`, conforme apropriado, nos extratos de gerenciamento de contas para evitar erros relacionados a usuários nomeados.

#### Suporte ao Motor de Armazenamento

Atualmente, apenas o motor de armazenamento `InnoDB` suporta DDL atômico. Os motores de armazenamento que não suportam DDL atômico estão isentos da atinência DDL. As operações DDL que envolvem motores de armazenamento isentos podem introduzir inconsistências que podem ocorrer quando as operações são interrompidas ou apenas parcialmente concluídas.

Para suportar a refazer e o reverter de operações de DDL, o `InnoDB` escreve logs de DDL na tabela `mysql.innodb_ddl_log`, que é uma tabela oculta do dicionário de dados que reside no espaço de tabelas de dicionário de dados `mysql.ibd`.

Para visualizar os registros de DDL escritos na tabela `mysql.innodb_ddl_log` durante uma operação de DDL, habilite a opção de configuração `innodb_print_ddl_logs`. Para obter mais informações, consulte Visualizar registros de DDL.

Nota

Os registros de refazer para as alterações na tabela `mysql.innodb_ddl_log` são descarregados no disco imediatamente, independentemente da configuração `innodb_flush_log_at_trx_commit`. Descarregar os registros de refazer imediatamente evita situações em que os arquivos de dados são modificados por operações de DDL, mas os registros de refazer para as alterações na tabela `mysql.innodb_ddl_log` resultantes dessas operações não são persistidos no disco. Uma situação como essa pode causar erros durante o rollback ou a recuperação.

O mecanismo de armazenamento `InnoDB` executa operações de DDL em fases. Operações de DDL, como `ALTER TABLE`, podem realizar as fases *Prepare* e *Perform* várias vezes antes da fase *Commit*.

1. *Prepare*: Crie os objetos necessários e escreva os logs de DDL na tabela `mysql.innodb_ddl_log`. Os logs de DDL definem como realizar o avanço e o recuo da operação de DDL.

2. *Realizar*: Realize a operação DDL. Por exemplo, execute uma rotina de criação para uma operação `CREATE TABLE`.

3. *Comunique-se*: Atualize o dicionário de dados e comunique a transação do dicionário de dados.

4. *Pós-DDL*: Repita e remova os registros DDL da tabela `mysql.innodb_ddl_log`. Para garantir que o rollback possa ser realizado de forma segura sem introduzir inconsistências, operações de arquivo, como renomear ou remover arquivos de dados, são realizadas nesta fase final. Esta fase também remove metadados dinâmicos da tabela do dicionário de dados `mysql.innodb_dynamic_metadata` para `DROP TABLE`, `TRUNCATE TABLE` e outras operações DDL que reconstruem a tabela.

Os registros de DDL são regravados e removidos da tabela `mysql.innodb_ddl_log` durante a fase *Post-DDL*, independentemente de a operação de DDL ter sido confirmada ou revertida. Os registros de DDL só devem permanecer na tabela `mysql.innodb_ddl_log` se o servidor for interrompido durante uma operação de DDL. Nesse caso, os registros de DDL são regravados e removidos após a recuperação.

Em uma situação de recuperação, uma operação de DDL pode ser realizada ou revertida quando o servidor é reiniciado. Se a transação do dicionário de dados que foi realizada durante a fase *Commit* de uma operação de DDL estiver presente no log de reversão e no log binário, a operação é considerada bem-sucedida e é revertida. Caso contrário, a transação incompleta do dicionário de dados é revertida quando o `InnoDB` retransmite os logs de reversão do dicionário de dados, e a operação de DDL é revertida.

#### Visualizar logs de DDL

Para visualizar os registros de DDL escritos na tabela do dicionário de dados `mysql.innodb_ddl_log` durante operações DDL atômicas que envolvem o mecanismo de armazenamento `InnoDB`, habilite `innodb_print_ddl_logs` para que o MySQL escreva os registros de DDL em `stderr`. Dependendo do sistema operacional do host e da configuração do MySQL, `stderr` pode ser o log de erro, o terminal ou a janela do console. Consulte a Seção 7.4.2.2, “Configuração padrão do destino do log de erro”.

`InnoDB` escreve logs de DDL na tabela `mysql.innodb_ddl_log` para suportar o redo e o rollback de operações de DDL. A tabela `mysql.innodb_ddl_log` é uma tabela de dicionário de dados oculta que reside no espaço de dados do dicionário de dados `mysql.ibd`. Como outras tabelas de dicionário de dados ocultas, a tabela `mysql.innodb_ddl_log` não pode ser acessada diretamente em versões não de depuração do MySQL. (Veja a Seção 16.1, “Esquema do Dicionário de Dados”.) A estrutura da tabela `mysql.innodb_ddl_log` corresponde a essa definição:

```
CREATE TABLE mysql.innodb_ddl_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL,
  type INT UNSIGNED NOT NULL,
  space_id INT UNSIGNED,
  page_no INT UNSIGNED,
  index_id BIGINT UNSIGNED,
  table_id BIGINT UNSIGNED,
  old_file_path VARCHAR(512) COLLATE utf8mb4_bin,
  new_file_path VARCHAR(512) COLLATE utf8mb4_bin,
  KEY(thread_id)
);
```

- `id`: Um identificador único para um registro de log de DDL.

- `thread_id`: Cada registro de log de DDL é atribuído um `thread_id`, que é usado para reproduzir e remover logs de DDL que pertencem a uma operação específica de DDL. Operações de DDL que envolvem múltiplas operações de arquivo de dados geram múltiplos registros de log de DDL.

- `type`: O tipo de operação DDL. Os tipos incluem `FREE` (remover uma árvore de índices), `DELETE` (deletar um arquivo), `RENAME` (renomear um arquivo) ou `DROP` (remover metadados da tabela do dicionário de dados `mysql.innodb_dynamic_metadata`).

- `space_id`: O ID do espaço de tabelas.

- `page_no`: Uma página que contém informações de alocação; uma página raiz de árvore de índice, por exemplo.

- `index_id`: O ID do índice.

- `table_id`: O ID da tabela.

- `old_file_path`: O caminho antigo do arquivo do espaço de tabelas. Usado por operações DDL que criam ou excluem arquivos de espaço de tabelas; também usado por operações DDL que renomeiam um espaço de tabela.

- `new_file_path`: O novo caminho do arquivo do espaço de tabelas. Usado por operações DDL que renomeiam arquivos de espaço de tabelas.

Este exemplo demonstra como habilitar o `innodb_print_ddl_logs` para visualizar os registros de DDL escritos no `strderr` para uma operação de `CREATE TABLE`.

```
mysql> SET GLOBAL innodb_print_ddl_logs=1;
mysql> CREATE TABLE t1 (c1 INT) ENGINE = InnoDB;
```

```
[Note] [000000] InnoDB: DDL log insert : [DDL record: DELETE SPACE, id=18, thread_id=7,
space_id=5, old_file_path=./test/t1.ibd]
[Note] [000000] InnoDB: DDL log delete : by id 18
[Note] [000000] InnoDB: DDL log insert : [DDL record: REMOVE CACHE, id=19, thread_id=7,
table_id=1058, new_file_path=test/t1]
[Note] [000000] InnoDB: DDL log delete : by id 19
[Note] [000000] InnoDB: DDL log insert : [DDL record: FREE, id=20, thread_id=7,
space_id=5, index_id=132, page_no=4]
[Note] [000000] InnoDB: DDL log delete : by id 20
[Note] [000000] InnoDB: DDL log post ddl : begin for thread id : 7
[Note] [000000] InnoDB: DDL log post ddl : end for thread id : 7
```
