## 15.1 Declarações de Definição de Dados

### 15.1.1 Declaração de Definição de Dados Atômicos de Suporte

O MySQL 8.0 suporta declarações atômicas de Definição de Dados (DDL) (Data Definition Language). Esse recurso é conhecido como *DDL atômico*. Uma declaração DDL atômica combina as atualizações do dicionário de dados, as operações do mecanismo de armazenamento e os registros binários associados a uma operação DDL em uma única operação atômica. A operação é comprometida, com as alterações aplicáveis persistidas no dicionário de dados, no mecanismo de armazenamento e no registro binário, ou é revertida, mesmo que o servidor pare durante a operação.

Nota

*DDL atômico* não é *DDL transacional*. As declarações DDL, atômicas ou não, implicitamente encerram qualquer transação que esteja ativa na sessão atual, como se você tivesse feito um `COMMIT` antes de executar a declaração. Isso significa que as declarações DDL não podem ser realizadas dentro de outra transação, dentro de declarações de controle de transação, como `START TRANSACTION ... COMMIT` ou (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), ou combinadas com outras declarações dentro da mesma transação.

O DDL atômico é possível graças à introdução do dicionário de dados MySQL no MySQL 8.0. Em versões anteriores do MySQL, os metadados eram armazenados em arquivos de metadados, tabelas não transacionais e dicionários específicos do mecanismo de armazenamento, o que exigia compromissos intermediários. O armazenamento centralizado e transacional de metadados fornecido pelo dicionário de dados MySQL removeu essa barreira, tornando possível reestruturar as operações das declarações DDL para serem atômicas.

O recurso DDL atômico é descrito nos seguintes tópicos desta seção:

* Declarações DDL suportadas
* Características DDL atômicas
* Alterações no comportamento das declarações DDL
* Suporte ao motor de armazenamento
* Visualização de logs DDL

#### Declarações DDL suportadas

O recurso DDL atômico suporta tanto declarações DDL de tabela quanto não de tabela. As operações DDL relacionadas a tabelas requerem suporte do mecanismo de armazenamento, enquanto as operações DDL não relacionadas a tabelas não o fazem. Atualmente, apenas o mecanismo de armazenamento `InnoDB` suporta DDL atômico.

As declarações DDL suportadas incluem as declarações `CREATE`, `ALTER` e `DROP` para bancos de dados, espaços de tabelas, tabelas e índices, e a declaração `TRUNCATE TABLE`.

* As declarações DDL não tabeladas suportadas incluem:

+ as declarações `CREATE` e `DROP` e, se aplicável, as declarações `ALTER` para programas armazenados, gatilhos, visualizações e funções carregáveis.

+ Declarações de gerenciamento de contas: `CREATE`, `ALTER`, `DROP` e, se aplicável, `RENAME` para usuários e papéis, bem como declarações de `GRANT` e `REVOKE`.

As seguintes declarações não são suportadas pelo recurso DDL atômico:

* Declarações DDL relacionadas a tabelas que envolvem um mecanismo de armazenamento diferente de `InnoDB`.

* as declarações `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* as declarações `INSTALL COMPONENT` e `UNINSTALL COMPONENT`.

* as declarações `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`.

#### Características do DDL Atômico

As características das declarações DDL atômicas incluem as seguintes:

* As atualizações de metadados, as gravações de log binário e as operações do motor de armazenamento, quando aplicável, são combinadas em uma única operação atômica.

* Não há commits intermediários na camada SQL durante a operação de DDL.

* Quando aplicável:

+ O estado dos dicionários de dados, rotinas, eventos e caches de funções carregáveis é consistente com o status da operação DDL, o que significa que os caches são atualizados para refletir se a operação DDL foi concluída com sucesso ou revertida.

+ Os métodos do mecanismo de armazenamento envolvidos em uma operação de DDL não realizam commits intermediários, e o mecanismo de armazenamento se registra como parte da operação de DDL.

+ O mecanismo de armazenamento suporta refazer e rollback de operações de DDL, que é realizado na fase *Post-DDL* da operação de DDL.

* O comportamento visível das operações DDL é atômico, o que altera o comportamento de algumas declarações DDL. Veja Alterações no comportamento das declarações DDL.

#### Alterações no comportamento da declaração DDL

Esta seção descreve as mudanças no comportamento das declarações DDL devido à introdução do suporte DDL atômico.

As operações `DROP TABLE` são totalmente atômicas se todas as tabelas nomeadas utilizarem um mecanismo de armazenamento que suporte DDL atômico. A declaração ou descarta todas as tabelas com sucesso ou é revertida.

`DROP TABLE` falha com um erro se uma tabela nomeada não existir e não forem feitas alterações, independentemente do mecanismo de armazenamento. Essa mudança de comportamento é demonstrada no exemplo a seguir, onde a declaração `DROP TABLE` falha porque uma tabela nomeada não existe:

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

Antes da introdução do DDL atômico, o `DROP TABLE` relata um erro para a tabela nomeada que não existe, mas tem sucesso para a tabela nomeada que existe:

  ```
  mysql> CREATE TABLE t1 (c1 INT);
  mysql> DROP TABLE t1, t2;
  ERROR 1051 (42S02): Unknown table 'test.t2'
  mysql> SHOW TABLES;
  Empty set (0.00 sec)
  ```

Nota

Devido a essa mudança de comportamento, uma declaração parcialmente concluída `DROP TABLE` em um servidor de origem de replicação do MySQL 5.7 falha quando replicada em uma réplica do MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` em declarações `DROP TABLE` para evitar que erros ocorram para tabelas que não existem.

* `DROP DATABASE` é atômico se todas as tabelas utilizarem um mecanismo de armazenamento que suporte DDL atômico. A declaração ou descarta todos os objetos com sucesso ou é revertida. No entanto, a remoção do diretório do banco de dados do sistema de arquivos ocorre por último e não faz parte da operação atômica. Se a remoção do diretório do banco de dados falhar devido a um erro no sistema de arquivos ou parada do servidor, a transação `DROP DATABASE` não é revertida.

* Para tabelas que não utilizam um mecanismo de armazenamento que suporte DDL atômico, a exclusão de tabela ocorre fora da transação `DROP TABLE` ou `DROP DATABASE` atômica. Essas exclusões de tabela são escritas no log binário individualmente, o que limita a discrepância entre o mecanismo de armazenamento, o dicionário de dados e o log binário a, no máximo, uma tabela no caso de uma operação interrompida `DROP TABLE` ou `DROP DATABASE`. Para operações que excluem várias tabelas, as tabelas que não utilizam um mecanismo de armazenamento que suporte DDL atômico são excluídas antes das tabelas que o utilizam.

As operações `CREATE TABLE`, `ALTER TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`, `CREATE TABLESPACE` e `DROP TABLESPACE` para tabelas que utilizam um mecanismo de armazenamento que suporta DDL atômica são totalmente comprometidas ou revertidas se o servidor interromper durante sua operação. Em versões anteriores do MySQL, a interrupção dessas operações pode causar discrepâncias entre o mecanismo de armazenamento, o dicionário de dados e o log binário, ou deixar arquivos órfãos. As operações `RENAME TABLE`(rename-table.html "15.1.36 RENAME TABLE Statement") são atômicas apenas se todas as tabelas nomeadas utilizarem um mecanismo de armazenamento que suporte DDL atômica.

* A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômico, a declaração `CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") é registrada como uma transação no log binário quando a replicação baseada em linha está em uso. Anteriormente, ela era registrada como duas transações, uma para criar a tabela e a outra para inserir dados. Uma falha no servidor entre as duas transações ou durante a inserção de dados poderia resultar na replicação de uma tabela vazia. Com a introdução do suporte a DDL atômico, as declarações `CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") agora são seguras para replicação baseada em linha e permitidas para uso com replicação baseada em GTID.

Em motores de armazenamento que suportam tanto DDL atômico quanto restrições de chave estrangeira, a criação de chaves estrangeiras não é permitida em declarações `CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") quando a replicação baseada em linha está em uso. Restrições de chave estrangeira podem ser adicionadas posteriormente usando `ALTER TABLE`.

Quando `CREATE TABLE ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") é aplicado como uma operação atômica, uma chave de metadados é mantida na tabela enquanto os dados são inseridos, o que impede o acesso concorrente à tabela durante a duração da operação.

* `DROP VIEW` falha se uma visão nomeada não existir e nenhuma alteração for feita. A mudança de comportamento é demonstrada neste exemplo, onde a declaração `DROP VIEW` falha porque uma visão nomeada não existe:

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

Devido a essa mudança de comportamento, uma operação `DROP VIEW` parcialmente concluída em um servidor fonte de replicação MySQL 5.7 falha quando replicada em uma réplica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` em declarações `DROP VIEW` para evitar que um erro ocorra para visualizações que não existem.

* A execução parcial das declarações de gerenciamento de conta não é mais permitida. As declarações de gerenciamento de conta ou têm sucesso para todos os usuários nomeados ou são revertidas e não têm efeito se ocorrer um erro. Em versões anteriores do MySQL, as declarações de gerenciamento de conta que nomeiam vários usuários podem ter sucesso para alguns usuários e falhar para outros.

A mudança de comportamento é demonstrada neste exemplo, onde a segunda declaração `CREATE USER` retorna um erro, mas falha porque não pode ter sucesso para todos os usuários nomeados.

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

Antes da introdução do DDL atômico, a segunda declaração `CREATE USER` retorna um erro para o usuário nomeado que não existe, mas tem sucesso para o usuário nomeado que existe:

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

Devido a essa mudança de comportamento, os extratos de gerenciamento de conta parcialmente completos em um servidor de origem de replicação MySQL 5.7 falham quando replicados em uma replica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` ou `IF NOT EXISTS`, conforme apropriado, nos extratos de gerenciamento de conta para evitar erros relacionados a usuários nomeados.

#### Suporte ao Motor de Armazenamento

Atualmente, apenas o motor de armazenamento `InnoDB` suporta DDL atômico. Os motores de armazenamento que não suportam DDL atômico são isentos da atinência DDL. As operações de DDL que envolvem motores de armazenamento isentos continuam capazes de introduzir inconsistências que podem ocorrer quando as operações são interrompidas ou apenas parcialmente concluídas.

Para suportar operações de DDL de refazer e reverter, `InnoDB` escreve logs de DDL na tabela `mysql.innodb_ddl_log`, que é uma tabela de dicionário de dados oculta que reside no espaço de tabelas de dicionário de dados `mysql.ibd`.

Para visualizar os registros DDL que são escritos na tabela `mysql.innodb_ddl_log` durante uma operação de DDL, habilite a opção de configuração `innodb_print_ddl_logs`. Para mais informações, consulte Visualizando logs DDL.

Nota

Os registros de refazer para as alterações na tabela `mysql.innodb_ddl_log` são descarregados no disco imediatamente, independentemente da configuração do `innodb_flush_log_at_trx_commit`. Descarregar os registros de refazer imediatamente evita situações em que os arquivos de dados são modificados por operações de DDL, mas os registros de refazer para as alterações na tabela `mysql.innodb_ddl_log` resultantes dessas operações não são persistidos no disco. Tal situação pode causar erros durante o rollback ou recuperação.

O motor de armazenamento `InnoDB` executa operações DDL em fases. Operações DDL, como `ALTER TABLE`, podem realizar as fases *Prepare* e *Perform* várias vezes antes da fase *Commit*.

1. *Prepare*: Crie os objetos necessários e escreva os registros DDL na tabela `mysql.innodb_ddl_log`. Os registros DDL definem como realizar operações DDL em avanço e reversão.

2. *Realizar*: Realize a operação DDL. Por exemplo, realize uma rotina de criação para uma operação `CREATE TABLE`.

3. *Comunique-se*: Atualize o dicionário de dados e comunique a transação do dicionário de dados.

4. *Pós-DDL*: Repita e remova os registros DDL da tabela `mysql.innodb_ddl_log`. Para garantir que o rollback possa ser realizado de forma segura sem introduzir inconsistências, operações de arquivo, como renomear ou remover arquivos de dados, são realizadas nesta fase final. Esta fase também remove metadados dinâmicos da tabela do dicionário de dados `mysql.innodb_dynamic_metadata` para [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement"), [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement"), e outras operações DDL que reconstruem a tabela.

Os registros de DDL são regravados e removidos da tabela `mysql.innodb_ddl_log` durante a fase *Post-DDL*, independentemente de a operação de DDL ter sido confirmada ou revertida. Os registros de DDL devem permanecer apenas na tabela `mysql.innodb_ddl_log` se o servidor for interrompido durante uma operação de DDL. Neste caso, os registros de DDL são regravados e removidos após a recuperação.

Em uma situação de recuperação, uma operação de DDL pode ser realizada ou desfeita quando o servidor é reiniciado. Se a transação do dicionário de dados que foi realizada durante a fase *Commit* de uma operação de DDL estiver presente no log de reversão e no log binário, a operação é considerada bem-sucedida e é avançada. Caso contrário, a transação incompleta do dicionário de dados é desfeita quando o `InnoDB` reinterpreta os logs de reversão do dicionário de dados, e a operação de DDL é desfeita.

#### Visualizando logs de DDL

Para visualizar os registros de DDL que são escritos na tabela do dicionário de dados `mysql.innodb_ddl_log` durante operações atômicas de DDL que envolvem o mecanismo de armazenamento `InnoDB`, habilite o `innodb_print_ddl_logs` para que o MySQL escreva os registros de DDL em `stderr`. Dependendo do sistema operacional do host e da configuração do MySQL, `stderr` pode ser o log de erro, o terminal ou a janela do console. Veja a Seção 7.4.2.2, “Configuração padrão do destino do log de erro”.

`InnoDB` escreve logs de DDL na tabela `mysql.innodb_ddl_log` para suportar refazer e rollback de operações de DDL. A tabela `mysql.innodb_ddl_log` é uma tabela de dicionário de dados oculta que reside no espaço de dados do dicionário de dados `mysql.ibd`. Como outras tabelas de dicionário de dados ocultas, a tabela `mysql.innodb_ddl_log` não pode ser acessada diretamente em versões não de depuração do MySQL. (Veja a Seção 16.1, “Esquema do Dicionário de Dados”). A estrutura da tabela `mysql.innodb_ddl_log` corresponde a esta definição:

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

* `id`: Um identificador único para um registro de log de DDL.

* `thread_id`: Cada registro de registro DDL é atribuído um `thread_id`, que é usado para reproduzir e remover registros de DDL que pertencem a uma operação específica de DDL. Operações DDL que envolvem múltiplas operações de arquivo de dados geram múltiplos registros de registro DDL.

* `type`: O tipo de operação DDL. Os tipos incluem `FREE` (retirar uma árvore de índices), `DELETE` (deletar um arquivo), `RENAME` (renomear um arquivo) ou `DROP` (retirar metadados da tabela do dicionário de dados `mysql.innodb_dynamic_metadata`).

* `space_id`: O ID do tablespace.  
* `page_no`: Uma página que contém informações de alocação; uma página raiz de uma árvore de índice, por exemplo.

* `index_id`: O ID do índice.
* `table_id`: O ID da tabela.
* `old_file_path`: O caminho do arquivo do espaço de tabela antigo. Usado por operações DDL que criam ou excluem arquivos de espaço de tabela; também usado por operações DDL que renomeiam um espaço de tabela.

* `new_file_path`: O novo caminho do arquivo do espaço de tabela. Usado por operações DDL que renomeiam arquivos de espaço de tabela.

Este exemplo demonstra como habilitar o `innodb_print_ddl_logs` para visualizar os registros DDL escritos no `strderr` para uma operação de `CREATE TABLE`.

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

### 15.1.2 Declaração ALTER DATABASE

```
ALTER {DATABASE | SCHEMA} [db_name]
    alter_option ...

alter_option: {
    [DEFAULT] CHARACTER SET [=] charset_name
  | [DEFAULT] COLLATE [=] collation_name
  | [DEFAULT] ENCRYPTION [=] {'Y' | 'N'}
  | READ ONLY [=] {DEFAULT | 0 | 1}
}
```

`ALTER DATABASE` permite que você mude as características gerais de um banco de dados. Essas características são armazenadas no dicionário de dados. Essa declaração requer o privilégio `ALTER` no banco de dados. [`ALTER SCHEMA`(alter-database.html "15.1.2 ALTER DATABASE Statement") é sinônimo de [`ALTER DATABASE`(alter-database.html "15.1.2 ALTER DATABASE Statement")].

Se o nome do banco de dados for omitido, a declaração se aplica ao banco de dados padrão. Nesse caso, ocorrerá um erro se não houver um banco de dados padrão.

Para qualquer *`alter_option`* omitido na declaração, o banco de dados mantém seu valor de opção atual, com a exceção de que a alteração do conjunto de caracteres pode alterar a agregação e vice-versa.

* Opções de Conjunto de Caracteres e Colaboração
* Opção de Encriptação
* Opção de Apenas Leitura

#### Conjunto de caracteres e opções de codificação

A opção `CHARACTER SET` altera o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` altera a agregação de caracteres padrão do banco de dados. Para informações sobre os nomes dos conjuntos de caracteres e agregações, consulte o Capítulo 12, * Conjuntos de caracteres, agregações, Unicode *.

Para ver os conjuntos de caracteres e as codificações disponíveis, use as declarações `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 15.7.7.3, “Declaração SHOW CHARACTER SET”, e a Seção 15.7.7.4, “Declaração SHOW COLLATION”.

Uma rotina armazenada que usa os padrões do banco de dados quando a rotina é criada inclui esses padrões como parte de sua definição. (Em uma rotina armazenada, as variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou a correção não forem especificados explicitamente. Veja a Seção 15.1.17, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.) Se você alterar o conjunto de caracteres padrão ou a correção de um banco de dados, todas as rotinas armazenadas que devem usar os novos padrões devem ser excluídas e recriadas.

#### Opção de Encriptação

A opção `ENCRYPTION`, introduzida no MySQL 8.0.16, define a criptografia padrão do banco de dados, que é herdada por tabelas criadas no banco de dados. Os valores permitidos são `'Y'` (criptografia habilitada) e `'N'` (criptografia desativada).

O esquema do sistema `mysql` não pode ser configurado para criptografia padrão. As tabelas existentes nele fazem parte do espaço de tabelas geral `mysql`, que pode ser criptografado. O `information_schema` contém apenas visualizações. Não é possível criar quaisquer tabelas nele. Não há nada no disco para criptografar. Todas as tabelas no `performance_schema` usam o motor `PERFORMANCE_SCHEMA`, que é puramente de memória. Não é possível criar quaisquer outras tabelas nele. Não há nada no disco para criptografar.

Somente as tabelas recém-criadas herdam a criptografia padrão do banco de dados. Para tabelas existentes associadas ao banco de dados, sua criptografia permanece inalterada. Se a variável de sistema `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para especificar uma configuração de criptografia padrão que difere do valor da variável de sistema `default_table_encryption`. Para mais informações, consulte Definindo um padrão de criptografia para esquemas e espaços de tabela gerais.

#### Opção de Leitura Apenas

A opção `READ ONLY`, introduzida no MySQL 8.0.22, controla se é permitido modificar o banco de dados e os objetos dentro dele. Os valores permitidos são `DEFAULT` ou `0` (não apenas de leitura) e `1` (somente de leitura). Esta opção é útil para migração de banco de dados, pois um banco de dados para o qual `READ ONLY` está habilitado pode ser migrado para outra instância do MySQL sem preocupação de que o banco de dados possa ser alterado durante a operação.

Com o NDB Cluster, tornar um banco de dados somente leitura em um servidor **mysqld** é sincronizado com outros servidores **mysqld** no mesmo clúster, de modo que o banco de dados se torne somente leitura em todos os servidores **mysqld**.

A opção `READ ONLY`, se habilitada, é exibida na tabela `INFORMATION_SCHEMA` `SCHEMATA_EXTENSIONS`. Veja a Seção 28.3.32, “A tabela INFORMATION_SCHEMA SCHEMATA_EXTENSIONS”.

A opção `READ ONLY` não pode ser habilitada para esses esquemas do sistema: `mysql`, `information_schema`, `performance_schema`.

Nas declarações `ALTER DATABASE`, a opção `READ ONLY` interage com outras instâncias da mesma e com outras opções da seguinte forma:

* Um erro ocorre se várias instâncias de `READ ONLY` entrarem em conflito (por exemplo, `READ ONLY = 1 READ ONLY = 0`).

* Uma declaração `ALTER DATABASE` que contém apenas opções `READ ONLY` (não conflitantes) é permitida mesmo para um banco de dados somente de leitura.

* Uma combinação de opções (não conflitantes) de `READ ONLY` com outras opções é permitida se o estado de leitura somente do banco de dados, antes ou depois da declaração, permitir modificações. Se o estado de leitura somente antes e depois proibir mudanças, ocorrerá um erro.

Essa declaração funciona independentemente de o banco de dados ser somente de leitura ou não:

  ```
  ALTER DATABASE mydb READ ONLY = 0 DEFAULT COLLATE utf8mb4_bin;
  ```

Essa declaração é válida se o banco de dados não for somente de leitura, mas falha se já estiver somente de leitura:

  ```
  ALTER DATABASE mydb READ ONLY = 1 DEFAULT COLLATE utf8mb4_bin;
  ```

Ativação de `READ ONLY` afeta todos os usuários do banco de dados, com essas exceções que não estão sujeitas a verificações de leitura somente:

* Declarações executadas pelo servidor como parte da inicialização, reinício, atualização ou replicação do servidor.

* Declarações em um arquivo nomeado na inicialização do servidor pela variável de sistema `init_file`.

* tabelas `TEMPORARY`; é possível criar, alterar, excluir e escrever em tabelas `TEMPORARY` em um banco de dados somente leitura.

* Inserções e atualizações não SQL do NDB Cluster.

Além das operações excecionais listadas acima, a habilitação de `READ ONLY` proíbe operações de escrita no banco de dados e em seus objetos, incluindo suas definições, dados e metadados. A lista a seguir detalha as declarações e operações SQL afetadas:

* O próprio banco de dados:

+ `CREATE DATABASE`
  + `ALTER DATABASE` (exceto para alterar a opção `READ ONLY`)

+ `DROP DATABASE` * Visões:

+ `CREATE VIEW`
  + `ALTER VIEW`
  + `DROP VIEW`
  + Selecionando vistas que invocam funções com efeitos colaterais.

+ Atualizações de visualizações atualizáveis.  + Declarações que criam ou excluem objetos em um banco de dados gravável são rejeitadas se afetarem o metadados de uma visualização em um banco de dados somente leitura (por exemplo, tornando a visualização válida ou inválida).

* Rotinas armazenadas:

+ `CREATE PROCEDURE`
  + `DROP PROCEDURE`
  + `CALL` (de procedimentos com efeitos colaterais)

+ `CREATE FUNCTION`
  + `DROP FUNCTION`
  + `SELECT` (de funções com efeitos colaterais)

+ Para procedimentos e funções, as verificações de leitura seguem o comportamento de pré-bloqueio. Para as declarações `CALL`, as verificações de leitura são feitas por declaração, portanto, se alguma declaração executada condicionalmente escrever em um banco de dados de leitura e não for executada, a chamada ainda terá sucesso. Por outro lado, para uma função chamada dentro de `SELECT`, a execução do corpo da função acontece em modo pré-bloqueado. Enquanto uma declaração dentro da função escreve em um banco de dados de leitura, a execução da função falha com um erro, independentemente de a declaração ser executada ou

* Gatilhos:

+ `CREATE TRIGGER`
  + `DROP TRIGGER`
  + Invocação do gatilho. * Eventos:

+ `CREATE EVENT`
  + `ALTER EVENT`
  + `DROP EVENT`
  + Execução do evento:

- A execução de um evento no banco de dados falha porque isso mudaria o timestamp da última execução, que é o metadados do evento armazenados no dicionário de dados. A falha na execução do evento também tem o efeito de fazer com que o cronograma de eventos pare.

- Se um evento escrever em um banco de dados somente leitura, a execução do evento falha com um erro, mas o cronograma do evento não é interrompido.

* Tabelas:

+ `CREATE TABLE`
  + `ALTER TABLE`
  + `CREATE INDEX`
  + `DROP INDEX`
  + `RENAME TABLE`
  + `TRUNCATE TABLE`
  + `DROP TABLE`
  + `DELETE`
  + `INSERT`
  + `IMPORT TABLE`
  + `LOAD DATA`
  + `LOAD XML`
  + `REPLACE`
  + `UPDATE`
  + Para chaves estrangeiras em cascata onde a tabela secundária está em um banco de dados somente leitura, as atualizações e exclusões na tabela principal são rejeitadas mesmo que a tabela secundária não seja diretamente afetada.

+ Para uma tabela `MERGE` como a `CREATE TABLE s1.t(i int) ENGINE MERGE UNION (s2.t, s3.t), INSERT_METHOD=...`, o seguinte comportamento se aplica:

- Inserir na tabela `MERGE` (`INSERT into s1.t`) falha se pelo menos um dos `s1`, `s2`, `s3` for somente leitura, independentemente do método de inserção. A inserção é recusada mesmo que, na verdade, acabe em uma tabela gravável.

- A eliminação da tabela `MERGE` (`DROP TABLE s1.t`) é bem-sucedida, desde que `s1` não seja somente de leitura. É permitido eliminar uma tabela `MERGE` que se refere a um banco de dados somente de leitura.

Uma declaração `ALTER DATABASE` é bloqueada até que todas as transações concorrentes que já acessaram um objeto no banco de dados que está sendo alterado tenham sido confirmadas. Por outro lado, uma transação de escrita que acessa um objeto em um banco de dados que está sendo alterado em uma transação concorrente `ALTER DATABASE` é bloqueada até que a `ALTER DATABASE` tenha sido confirmada.

Se o plugin Clone for usado para clonar um diretório de dados local ou remoto, os bancos de dados no clone manterão o estado de leitura somente que tinham no diretório de dados de origem. O estado de leitura somente não afeta o próprio processo de clonagem. Se não for desejável ter o mesmo estado de leitura somente do banco de dados no clone, a opção deve ser alterada explicitamente para o clone após o processo de clonagem ter sido concluído, usando operações `ALTER DATABASE` no clone.

Quando se faz uma clonagem de um banco de dados de um doador para um receptor, se o receptor tiver um banco de dados que é apenas de leitura, a clonagem falha com uma mensagem de erro. A clonagem pode ser repetida após tornar o banco de dados legível.

`READ ONLY` é permitido para `ALTER DATABASE`, mas não para `CREATE DATABASE`. No entanto, para um banco de dados somente leitura, a declaração produzida por `SHOW CREATE DATABASE` inclui `READ ONLY=1` dentro de um comentário para indicar seu status somente leitura:

```
mysql> ALTER DATABASE mydb READ ONLY = 1;
mysql> SHOW CREATE DATABASE mydb\G
*************************** 1. row ***************************
       Database: mydb
Create Database: CREATE DATABASE `mydb`
                 /*!40100 DEFAULT CHARACTER SET utf8mb4
                          COLLATE utf8mb4_0900_ai_ci */
                 /*!80016 DEFAULT ENCRYPTION='N' */
                 /* READ ONLY = 1 */
```

Se o servidor executar uma declaração `CREATE DATABASE` contendo um comentário desse tipo, o servidor ignora o comentário e a opção `READ ONLY` não é processada. Isso tem implicações para **mysqldump** e **mysqlpump**, que usam `SHOW CREATE DATABASE` para produzir declarações `CREATE DATABASE` na saída do dump:

* Em um arquivo de descarte, a declaração `CREATE DATABASE`(create-database.html "15.1.12 CREATE DATABASE Statement") para um banco de dados somente leitura contém a opção comentada `READ ONLY`.

* O arquivo de implantação pode ser restaurado como de costume, mas, como o servidor ignora a opção comentada `READ ONLY`, o banco de dados restaurado *não* é somente leitura. Se o banco de dados deve ser somente leitura após ser restaurado, você deve executar manualmente `ALTER DATABASE` para torná-lo assim.

Suponha que `mydb` seja somente de leitura e você o descarte da seguinte forma:

```
$> mysqldump --databases mydb > mydb.sql
```

Uma operação de restauração posterior deve ser seguida por `ALTER DATABASE` se `mydb` ainda deve ser lido apenas:

```
$> mysql
mysql> SOURCE mydb.sql;
mysql> ALTER DATABASE mydb READ ONLY = 1;
```

O MySQL Enterprise Backup não está sujeito a esse problema. Ele faz backup e restaura um banco de dados somente de leitura como qualquer outro, mas permite a opção `READ ONLY` no momento da restauração, se ela foi habilitada no momento do backup.

`ALTER DATABASE` é escrito no log binário, portanto, uma alteração na opção `READ ONLY` em um servidor de fonte de replicação também afeta as réplicas. Para evitar que isso aconteça, o registro binário deve ser desativado antes da execução da declaração `ALTER DATABASE`. Por exemplo, para se preparar para migrar um banco de dados sem afetar as réplicas, realize essas operações:

1. Em uma única sessão, desative o registro binário e habilite `READ ONLY` para o banco de dados:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 1;
   ```

2. Descarte o banco de dados, por exemplo, com **mysqldump** ou **mysqlpump**:

   ```
   $> mysqldump --databases mydb > mydb.sql
   ```

3. Em uma única sessão, desative o registro binário e desative `READ ONLY` para o banco de dados:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 0;
   ```

### 15.1.3 Declaração de ALTER EVENT

```
ALTER
    [DEFINER = user]
    EVENT event_name
    [ON SCHEDULE schedule]
    [ON COMPLETION [NOT] PRESERVE]
    [RENAME TO new_event_name]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    [DO event_body]
```

A declaração `ALTER EVENT` altera uma ou mais características de um evento existente sem a necessidade de descartá-lo e recriá-lo. A sintaxe para cada uma das cláusulas `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE` e `DO` é exatamente a mesma quando usada com `CREATE EVENT`. (Veja a Seção 15.1.13, “Declaração de Evento CREATE”).

Qualquer usuário pode alterar um evento definido em um banco de dados para o qual esse usuário tenha o privilégio `EVENT`. Quando um usuário executa uma declaração `ALTER EVENT`(alter-event.html "15.1.3 ALTER EVENT Statement") com sucesso, esse usuário se torna o definidor do evento afetado.

`ALTER EVENT` funciona apenas com um evento existente:

```
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

Em cada um dos exemplos a seguir, vamos assumir que o evento denominado `myevent` é definido conforme mostrado aqui:

```
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A seguinte declaração altera o cronograma para `myevent` de uma vez a cada seis horas, começando imediatamente, para uma vez a cada doze horas, começando quatro horas após o momento em que a declaração é executada:

```
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

É possível alterar várias características de um evento em uma única declaração. Este exemplo altera a declaração SQL executada por `myevent` para uma que exclui todos os registros de `mytable`; também altera o cronograma do evento de modo que ele seja executado uma vez, um dia após a execução desta declaração `ALTER EVENT`.

```
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Especificar as opções em uma declaração `ALTER EVENT`(alter-event.html "15.1.3 ALTER EVENT Statement") apenas para as características que você deseja alterar; as opções omitidas mantêm seus valores existentes. Isso inclui quaisquer valores padrão para `CREATE EVENT`(create-event.html "15.1.13 CREATE EVENT Statement") como `ENABLE`.

Para desabilitar `myevent`, use esta declaração `ALTER EVENT`:

```
ALTER EVENT myevent
    DISABLE;
```

A cláusula `ON SCHEDULE` pode utilizar expressões que envolvam funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Não é possível usar rotinas armazenadas ou funções carregáveis nessas expressões, e não é possível usar referências a tabelas; no entanto, é possível usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as declarações `ALTER EVENT` quanto `CREATE EVENT`. Referências a rotinas armazenadas, funções carregáveis e tabelas nessas situações não são especificamente permitidas e falham com um erro (veja o Bug #22830).

Embora uma declaração `ALTER EVENT` que contém outra declaração `ALTER EVENT` em sua cláusula `DO` pareça ter sucesso, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Para renomear um evento, use a cláusula `RENAME TO` da declaração (alter-event.html "15.1.3 ALTER EVENT Statement"). Esta declaração renomeia o evento `myevent` para `yourevent`:

```
ALTER EVENT myevent
    RENAME TO yourevent;
```

Você também pode mover um evento para um banco de dados diferente usando a notação `ALTER EVENT ... RENAME TO ...` e `db_name.event_name`, conforme mostrado aqui:

```
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

Para executar a declaração anterior, o usuário que a executa deve ter o privilégio `EVENT` nos bancos de dados `olddb` e `newdb`.

Nota

Não há nenhuma declaração `RENAME EVENT`.

O valor `DISABLE ON SLAVE` é usado em uma réplica em vez de `ENABLE` ou `DISABLE` para indicar um evento que foi criado no servidor da fonte de replicação e replicado para a réplica, mas que não é executado na réplica. Normalmente, `DISABLE ON SLAVE` é definido automaticamente conforme necessário; no entanto, há algumas circunstâncias em que você pode querer ou precisar alterá-lo manualmente. Consulte a Seção 19.5.1.16, “Replicação de Recursos Invocáveis”, para obter mais informações.

### 15.1.4 Declaração ALTER FUNCTION

```
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Essa declaração pode ser usada para alterar as características de uma função armazenada. Mais de uma alteração pode ser especificada em uma declaração `ALTER FUNCTION`. No entanto, você não pode alterar os parâmetros ou o corpo de uma função armazenada usando essa declaração; para fazer essas alterações, você deve descartar e recriar a função usando [[`DROP FUNCTION`](drop-function.html "15.1.26 DROP FUNCTION Statement") e [[`CREATE FUNCTION`](create-function.html "15.1.14 CREATE FUNCTION Statement")].

Você deve ter o privilégio `ALTER ROUTINE` para a função. (Esse privilégio é concedido automaticamente ao criador da função.) Se o registro binário estiver habilitado, a declaração `ALTER FUNCTION` também pode exigir o privilégio `SUPER`, conforme descrito na Seção 27.7, “Registro Binário de Programa Armazenado”.

### 15.1.5 Declaração ALTER INSTANCE

```
ALTER INSTANCE instance_action

instance_action: {
  | {ENABLE|DISABLE} INNODB REDO_LOG
  | ROTATE INNODB MASTER KEY
  | ROTATE BINLOG MASTER KEY
  | RELOAD TLS
      [FOR CHANNEL {mysql_main | mysql_admin}]
      [NO ROLLBACK ON ERROR]
  | RELOAD KEYRING
}
```

`ALTER INSTANCE` define ações aplicáveis a uma instância do servidor MySQL. A declaração suporta essas ações:

* `ALTER INSTANCE {ENABLE | DISABLE} INNODB REDO_LOG`

Essa ação habilita ou desabilita o registro de refazer `InnoDB`. O registro de refazer é habilitado por padrão. Esse recurso é destinado apenas para carregar dados em uma nova instância do MySQL. A declaração não é escrita no log binário. Essa ação foi introduzida no MySQL 8.0.21.

Aviso

*Não desative o registro de refazer em um sistema de produção.* Embora seja permitido desligar e reiniciar o servidor enquanto o registro de refazer está desativado, uma parada inesperada do servidor enquanto o registro de refazer está desativado pode causar perda de dados e corrupção da instância.

Uma operação `ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG`(alter-instance.html "15.1.5 ALTER INSTANCE Statement") requer um bloqueio de backup exclusivo, que impede que outras operações `ALTER INSTANCE` sejam executadas simultaneamente. Outras operações `ALTER INSTANCE`(alter-instance.html "15.1.5 ALTER INSTANCE Statement") devem esperar que o bloqueio seja liberado antes de ser executado.

Para mais informações, consulte Desabilitar o registro de refazer.

* `ALTER INSTANCE ROTATE INNODB MASTER KEY`

Essa ação roda a chave de criptografia mestre usada para a criptografia do espaço de tabela `InnoDB`. A rotação da chave requer o privilégio `ENCRYPTION_KEY_ADMIN` ou `SUPER`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para obter instruções, consulte a Seção 8.4.4, “O Keyring do MySQL”.

`ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta operações DML concorrentes. No entanto, não pode ser executado concorrentemente com as operações de `CREATE TABLE ... ENCRYPTION`(create-table.html "15.1.20 CREATE TABLE Statement") ou `ALTER TABLE ... ENCRYPTION`(alter-table.html "15.1.9 ALTER TABLE Statement") e são tomadas assegurações para evitar conflitos que poderiam surgir da execução concorrente dessas declarações. Se uma das declarações em conflito estiver em execução, ela deve ser concluída antes que outra possa prosseguir.

As declarações `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para que possam ser executadas em servidores replicados.

Para informações adicionais sobre o uso do `ALTER INSTANCE ROTATE INNODB MASTER KEY`, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”.

* `ALTER INSTANCE ROTATE BINLOG MASTER KEY`

Essa ação roda a chave mestre do log binário usada para criptografia do log binário. A rotação da chave mestre do log binário requer o privilégio `BINLOG_ENCRYPTION_ADMIN` ou `SUPER`. A declaração não pode ser usada se a variável de sistema `binlog_encryption` estiver definida como `OFF`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para obter instruções, consulte a Seção 8.4.4, “O Keyring MySQL”.

As ações `ALTER INSTANCE ROTATE BINLOG MASTER KEY` não são escritas no log binário e não são executadas em réplicas. A rotação da chave mestre do log binário pode, portanto, ser realizada em ambientes de replicação, incluindo uma mistura de versões do MySQL. Para agendar a rotação regular da chave mestre do log binário em todos os servidores aplicáveis de origem e réplica, você pode habilitar o Cronograma de Eventos do MySQL em cada servidor e emitir a declaração `ALTER INSTANCE ROTATE BINLOG MASTER KEY` usando uma declaração `CREATE EVENT`. Se você rotular a chave mestre do log binário porque suspeita que a chave atual ou qualquer uma das chaves anteriores da chave mestre do log binário tenha sido comprometida, emita a declaração em todos os servidores aplicáveis de origem e réplica, o que permite verificar a conformidade imediata.

Para informações adicionais sobre o uso do `ALTER INSTANCE ROTATE BINLOG MASTER KEY`, incluindo o que fazer se o processo não for concluído corretamente ou for interrompido por uma parada inesperada do servidor, consulte a Seção 19.3.2, “Criptografando arquivos de registro binários e arquivos de registro de retransmissão”.

* `ALTER INSTANCE RELOAD TLS`

Essa ação reconfigura um contexto TLS a partir dos valores atuais das variáveis do sistema que definem o contexto. Também atualiza as variáveis de status que refletem os valores do contexto ativo. Essa ação requer o privilégio `CONNECTION_ADMIN`. Para informações adicionais sobre a reconfiguração do contexto TLS, incluindo quais variáveis do sistema e de status estão relacionadas ao contexto, consulte [Configuração e monitoramento do runtime do lado do servidor para conexões criptografadas][(using-encrypted-connections.html#using-encrypted-connections-server-side-runtime-configuration "Server-Side Runtime Configuration and Monitoring for Encrypted Connections")].

Por padrão, a declaração recarrega o contexto TLS para a interface de conexão principal. Se a cláusula `FOR CHANNEL` (disponível a partir do MySQL 8.0.21) for fornecida, a declaração recarrega o contexto TLS para o canal nomeado: `mysql_main` para a interface de conexão principal, `mysql_admin` para a interface de conexão administrativa. Para informações sobre as diferentes interfaces, consulte a Seção 7.1.12.1, “Interfaces de Conexão”. As propriedades atualizadas do contexto TLS são exibidas na tabela do Gerador de Desempenho `tls_channel_status`. Consulte a Seção 29.12.21.9, “A tabela tls_channel_status”.

Atualizar o contexto TLS para a interface principal também pode afetar a interface administrativa, pois, a menos que algum valor TLS não padrão seja configurado para essa interface, ela utiliza o mesmo contexto TLS que a interface principal.

Nota

Quando você recarregar o contexto TLS, o OpenSSL recarrega o arquivo que contém a CRL (lista de revogação de certificados) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é dobrado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. A memória residente do processo não é reduzida imediatamente após uma grande alocação ser liberada, então se você emitir a declaração `ALTER INSTANCE RELOAD TLS` repetidamente com um grande arquivo CRL, o uso da memória residente do processo pode crescer como resultado disso.

Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores dos contextos anteriores continuam a ser usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for dada e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desativada para novas conexões na interface à qual a declaração se aplica.

As declarações `ALTER INSTANCE RELOAD TLS` não são escritas no log binário (e, portanto, não são replicadas). A configuração do TLS é local e depende de arquivos locais que não necessariamente estão presentes em todos os servidores envolvidos.

* `ALTER INSTANCE RELOAD KEYRING`

Se um componente de chave de segurança for instalado, essa ação informa ao componente para reler seu arquivo de configuração e reiniciar quaisquer dados de chave de segurança em memória. Se você modificar a configuração do componente no tempo de execução, a nova configuração não terá efeito até que você realize essa ação. A recarga da chave de segurança requer o privilégio `ENCRYPTION_KEY_ADMIN`. Essa ação foi adicionada no MySQL 8.0.24.

Essa ação permite a recalibração apenas do componente de chave de segurança instalado atualmente. Não permite a alteração do componente instalado. Por exemplo, se você alterar a configuração do componente de chave de segurança instalado, `ALTER INSTANCE RELOAD KEYRING` (alter-instance.html#alter-instance-reload-keyring) faz com que a nova configuração entre em vigor. Por outro lado, se você alterar o componente de chave de segurança nomeado no arquivo de manifesto do servidor, `ALTER INSTANCE RELOAD KEYRING` não tem efeito e o componente atual permanece instalado.

As declarações `ALTER INSTANCE RELOAD KEYRING` não são escritas no log binário (e, portanto, não são replicadas).

### 15.1.6 Declaração ALTER LOGFILE GROUP

```
ALTER LOGFILE GROUP logfile_group
    ADD UNDOFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Essa declaração adiciona um arquivo `UNDO` chamado '*`file_name`*' a um grupo de arquivos de registro existente *`logfile_group`*. Uma declaração `ALTER LOGFILE GROUP` tem uma e apenas uma cláusula `ADD UNDOFILE`. A cláusula `DROP UNDOFILE` atualmente não é suportada.

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um arquivo de log de desfazer com o mesmo nome, ou um arquivo de log de desfazer e um arquivo de dados com o mesmo nome.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO` em bytes; se não especificado, o tamanho inicial é definido como padrão em 134217728 (128 MB). Você pode opcionalmente seguir *`size`* com uma abreviação de uma ordem de grandeza, semelhante àquelas usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes). (Bug #13116514, Bug #16104705, Bug #62858)

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB). (Bug #29574)

Nota

`WAIT` é analisado, mas ignorado de outra forma. Este termo-chave atualmente não tem efeito e é destinado para expansão futura.

O parâmetro `ENGINE` (requerido) determina o motor de armazenamento que é usado por este grupo de arquivos de registro, com *`engine_name`* sendo o nome do motor de armazenamento. Atualmente, os únicos valores aceitos para *`engine_name`* são “`NDBCLUSTER`” e “`NDB`”. Os dois valores são equivalentes.

Aqui está um exemplo, que assume que o grupo de arquivo de registro `lg_3` já foi criado usando `CREATE LOGFILE GROUP` (consulte Seção 15.1.16, “Instrução CREATE LOGFILE GROUP”):

```
ALTER LOGFILE GROUP lg_3
    ADD UNDOFILE 'undo_10.dat'
    INITIAL_SIZE=32M
    ENGINE=NDBCLUSTER;
```

Quando o `ALTER LOGFILE GROUP` é usado com o `ENGINE = NDBCLUSTER` (alternativamente, `ENGINE = NDB`), um arquivo de registro `UNDO` é criado em cada nó de dados do NDB Cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles, fazendo uma consulta à tabela do Esquema de Informações `FILES`. Por exemplo:

```
mysql> SELECT FILE_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE LOGFILE_GROUP_NAME = 'lg_3';
+-------------+----------------------+----------------+
| FILE_NAME   | LOGFILE_GROUP_NUMBER | EXTRA          |
+-------------+----------------------+----------------+
| newdata.dat |                    0 | CLUSTER_NODE=3 |
| newdata.dat |                    0 | CLUSTER_NODE=4 |
| undo_10.dat |                   11 | CLUSTER_NODE=3 |
| undo_10.dat |                   11 | CLUSTER_NODE=4 |
+-------------+----------------------+----------------+
4 rows in set (0.01 sec)
```

(Veja a Seção 28.3.15, “A Tabela INFORMATION_SCHEMA FILES”.)

A memória usada para `UNDO_BUFFER_SIZE` vem do pool global, cujo tamanho é determinado pelo valor do parâmetro de configuração do nó de dados `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`.

`ALTER LOGFILE GROUP` é útil apenas com armazenamento de dados de disco para NDB Cluster. Para mais informações, consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”.

### 15.1.7 Declaração de Procedimento ALTER PROCEDURE

```
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Essa declaração pode ser usada para alterar as características de um procedimento armazenado. Mais de uma alteração pode ser especificada em uma declaração `ALTER PROCEDURE`. No entanto, você não pode alterar os parâmetros ou o corpo de um procedimento armazenado usando essa declaração; para fazer essas alterações, você deve descartar e recriar o procedimento usando `DROP PROCEDURE` (drop-procedure.html "15.1.29 DROP PROCEDURE and DROP FUNCTION Statements") e `CREATE PROCEDURE` (create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements").

Você deve ter o privilégio `ALTER ROUTINE` para o procedimento. Por padrão, esse privilégio é concedido automaticamente ao criador do procedimento. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja a Seção 27.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

### 15.1.8 Declaração ALTER SERVER

```
ALTER SERVER  server_name
    OPTIONS (option [, option] ...)
```

Altera as informações do servidor para `server_name`, ajustando qualquer uma das opções permitidas na declaração `CREATE SERVER`. Os campos correspondentes na tabela `mysql.servers` são atualizados conforme necessário. Esta declaração requer o privilégio `SUPER`.

Por exemplo, para atualizar a opção `USER`:

```
ALTER SERVER s OPTIONS (USER 'sally');
```

`ALTER SERVER` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

`ALTER SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo utilizado.

### 15.1.9 Declaração ALTER TABLE

```
ALTER TABLE tbl_name
    [alter_option [, alter_option] ...]
    [partition_options]

alter_option: {
    table_options
  | ADD [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ADD [COLUMN] (col_name column_definition,...)
  | ADD {INDEX | KEY} [index_name]
        [index_type] (key_part,...) [index_option] ...
  | ADD {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name]
        (key_part,...) [index_option] ...
  | ADD [CONSTRAINT [symbol]] PRIMARY KEY
        [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
        [index_name] [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] FOREIGN KEY
        [index_name] (col_name,...)
        reference_definition
  | ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
  | DROP {CHECK | CONSTRAINT} symbol
  | ALTER {CHECK | CONSTRAINT} symbol [NOT] ENFORCED
  | ALGORITHM [=] {DEFAULT | INSTANT | INPLACE | COPY}
  | ALTER [COLUMN] col_name {
        SET DEFAULT {literal | (expr)}
      | SET {VISIBLE | INVISIBLE}
      | DROP DEFAULT
    }
  | ALTER INDEX index_name {VISIBLE | INVISIBLE}
  | CHANGE [COLUMN] old_col_name new_col_name column_definition
        [FIRST | AFTER col_name]
  | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
  | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
  | {DISABLE | ENABLE} KEYS
  | {DISCARD | IMPORT} TABLESPACE
  | DROP [COLUMN] col_name
  | DROP {INDEX | KEY} index_name
  | DROP PRIMARY KEY
  | DROP FOREIGN KEY fk_symbol
  | FORCE
  | LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
  | MODIFY [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ORDER BY col_name [, col_name] ...
  | RENAME COLUMN old_col_name TO new_col_name
  | RENAME {INDEX | KEY} old_index_name TO new_index_name
  | RENAME [TO | AS] new_tbl_name
  | {WITHOUT | WITH} VALIDATION
}

partition_options:
    partition_option [partition_option] ...

partition_option: {
    ADD PARTITION (partition_definition)
  | DROP PARTITION partition_names
  | DISCARD PARTITION {partition_names | ALL} TABLESPACE
  | IMPORT PARTITION {partition_names | ALL} TABLESPACE
  | TRUNCATE PARTITION {partition_names | ALL}
  | COALESCE PARTITION number
  | REORGANIZE PARTITION partition_names INTO (partition_definitions)
  | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH | WITHOUT} VALIDATION]
  | ANALYZE PARTITION {partition_names | ALL}
  | CHECK PARTITION {partition_names | ALL}
  | OPTIMIZE PARTITION {partition_names | ALL}
  | REBUILD PARTITION {partition_names | ALL}
  | REPAIR PARTITION {partition_names | ALL}
  | REMOVE PARTITIONING
}

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
}

table_options:
    table_option [[,] table_option] ...

table_option: {
    AUTOEXTEND_SIZE [=] value
  | AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | ENGINE_ATTRIBUTE [=] 'string'
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | TABLESPACE tablespace_name [STORAGE {DISK | MEMORY}]
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    (see CREATE TABLE options)
```

`ALTER TABLE` altera a estrutura de uma tabela. Por exemplo, você pode adicionar ou excluir colunas, criar ou destruir índices, alterar o tipo de colunas existentes ou renomear colunas ou a própria tabela. Você também pode alterar características como o mecanismo de armazenamento usado para a tabela ou o comentário da tabela.

* Para usar `ALTER TABLE`, você precisa de `ALTER`, `CREATE` e `INSERT` privilégios para a tabela. Renomear uma tabela requer `ALTER` e `DROP` na tabela antiga, `ALTER`, `CREATE` e `INSERT` na nova tabela.

* Após o nome da tabela, especifique as alterações a serem feitas. Se nenhuma for dada, `ALTER TABLE` não faz nada.

* A sintaxe para muitas das alterações permitidas é semelhante às cláusulas da declaração `CREATE TABLE`. *`column_definition`* As cláusulas usam a mesma sintaxe para `ADD` e `CHANGE` como para [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"). Para mais informações, consulte a Seção 15.1.20, “Declaração CREATE TABLE”.

* A palavra `COLUMN` é opcional e pode ser omitida, exceto para `RENAME COLUMN` (para distinguir uma operação de renomeação de coluna da operação de renomeação de tabela `RENAME`).

* Múltiplas cláusulas `ADD`, `ALTER`, `DROP` e `CHANGE` são permitidas em uma única declaração [`ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement")], separadas por vírgulas. Esta é uma extensão do MySQL ao SQL padrão, que permite apenas uma cláusula de cada uma por declaração `ALTER TABLE`. Por exemplo, para descartar múltiplas colunas em uma única declaração, faça isso:

  ```
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

* Se um mecanismo de armazenamento não suportar uma operação `ALTER TABLE` tentativa, pode resultar em um aviso. Tais avisos podem ser exibidos com `SHOW WARNINGS`. Consulte a Seção 15.7.7.42, “Declaração SHOW WARNINGS”. Para informações sobre a solução de problemas de `ALTER TABLE`, consulte a Seção B.3.6.1, “Problemas com ALTER TABLE”.

* Para informações sobre colunas geradas, consulte a Seção 15.1.9.2, “ALTER TABLE e Colunas Geradas”.

* Para exemplos de uso, consulte a Seção 15.1.9.3, “Exemplos de ALTER TABLE”.

* `InnoDB` no MySQL 8.0.17 e versões posteriores suporta a adição de índices de múltiplos valores em colunas JSON usando uma especificação *`key_part`* pode ter a forma `(CAST json_path AS type ARRAY)`. Consulte Índices de Múltiplos Valores, para informações detalhadas sobre a criação e uso de índices de múltiplos valores, bem como restrições e limitações em índices de múltiplos valores.

* Com a função API `mysql_info()` C, você pode descobrir quantas linhas foram copiadas por `ALTER TABLE`. Veja mysql_info().

Existem vários aspectos adicionais à declaração `ALTER TABLE`, descritos nos seguintes tópicos desta seção:

* Opções de tabela
* Requisitos de desempenho e espaço
* Controle de concorrência
* Adicionar e remover colunas
* Renomear, redefinir e reorganizar colunas
* Chaves primárias e índices
* Chaves estrangeiras e outras restrições
* Alterar o conjunto de caracteres
* Importar tabelas InnoDB
* Ordem de linha para tabelas MyISAM
* Opções de particionamento

#### Opções de tabela

*`table_options`* indica opções de tabela do tipo que podem ser usadas na declaração `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement"), como `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT` ou `TABLESPACE`.

Para descrições de todas as opções de tabela, consulte a Seção 15.1.20, “Instrução CREATE TABLE”. No entanto, `ALTER TABLE` ignora `DATA DIRECTORY` e `INDEX DIRECTORY` quando fornecidos como opções de tabela. `ALTER TABLE` permite que eles sejam usados apenas como opções de particionamento, e exige que você tenha o privilégio `FILE`.

O uso de opções de tabela com `ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") oferece uma maneira conveniente de alterar características de uma única tabela. Por exemplo:

* Se `t1` atualmente não for uma tabela `InnoDB`, esta declaração altera seu mecanismo de armazenamento para `InnoDB`:

  ```
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

+ Veja a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”, para considerações ao mudar as tabelas para o mecanismo de armazenamento `InnoDB`.

+ Quando você especifica uma cláusula `ENGINE`, `ALTER TABLE` reconstrui a tabela. Isso é verdade mesmo que a tabela já tenha o motor de armazenamento especificado.

Executar `ALTER TABLE tbl_name ENGINE=INNODB` em uma tabela existente (alter-table.html "15.1.9 ALTER TABLE Statement") realiza uma operação de “nulo” `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement"), que pode ser usada para desfragmentar uma tabela `InnoDB`, conforme descrito na Seção 17.11.4, “Desfragmentando uma Tabela”. Executar `ALTER TABLE tbl_name FORCE` em uma tabela (alter-table.html "15.1.9 ALTER TABLE Statement") `InnoDB` realiza a mesma função.

+ `ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "15.1.9 ALTER TABLE Statement") e `ALTER TABLE tbl_name FORCE`](alter-table.html "15.1.9 ALTER TABLE Statement") utilizam DDL online. Para mais informações, consulte a Seção 17.12, “InnoDB e DDL Online”.

+ O resultado do tentativa de alterar o motor de armazenamento de uma tabela é afetado pela disponibilidade do motor de armazenamento desejado e pela configuração do modo `NO_ENGINE_SUBSTITUTION` SQL, conforme descrito na Seção 7.1.11, "Modos SQL do servidor".

+ Para evitar a perda acidental de dados, `ALTER TABLE` não pode ser usado para alterar o mecanismo de armazenamento de uma tabela para `MERGE` ou `BLACKHOLE`.

* Para alterar a tabela `InnoDB` para usar o formato de armazenamento de linha comprimido:

  ```
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

* A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para uma tabela `InnoDB`. Um plugin de chave deve ser instalado e configurado para habilitar a criptografia.

Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para usar uma cláusula `ENCRYPTION` com uma configuração que difere da configuração de criptografia do esquema padrão.

Antes do MySQL 8.0.16, a cláusula `ENCRYPTION` era apenas suportada ao alterar tabelas que residem em espaços de tabela por arquivo. A partir do MySQL 8.0.16, a cláusula `ENCRYPTION` também é suportada para tabelas que residem em espaços de tabela gerais.

Para tabelas que residem em espaços de tabela gerais, a criptografia de tabela e do espaço de tabela deve corresponder.

Alterar a criptografia de uma tabela, movendo-a para um espaço de tabelas diferente ou alterando o mecanismo de armazenamento, não é permitido sem especificar explicitamente uma cláusula `ENCRYPTION`.

A opção `ENCRYPTION` é suportada apenas pelo mecanismo de armazenamento `InnoDB`; portanto, ela só funciona se a tabela já estiver usando `InnoDB` (e você não alterar o mecanismo de armazenamento da tabela), ou se a declaração `ALTER TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a declaração é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

A partir do MySQL 8.0.16, especificar uma cláusula `ENCRYPTION` com um valor diferente de `'N'` ou `''` não é permitido se a tabela usa um mecanismo de armazenamento que não suporte criptografia. Anteriormente, a cláusula era aceita. Tentar criar uma tabela sem uma cláusula `ENCRYPTION` em um esquema habilitado para criptografia usando um mecanismo de armazenamento que não suporte criptografia também não é permitido.

Para mais informações, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”.

* Para redefinir o valor atual de auto-incremento:

  ```
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

Você não pode redefinir o contador para um valor menor ou igual ao valor que está atualmente em uso. Para ambos os `InnoDB` e `MyISAM`, se o valor for menor ou igual ao valor máximo atualmente na coluna `AUTO_INCREMENT`, o valor é redefinido para o valor atual da coluna `AUTO_INCREMENT` mais um.

* Para alterar o conjunto de caracteres padrão da tabela:

  ```
  ALTER TABLE t1 CHARACTER SET = utf8mb4;
  ```

Veja também Alterar o conjunto de caracteres.

* Para adicionar (ou alterar) um comentário em uma tabela:

  ```
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

* Use `ALTER TABLE` com a opção `TABLESPACE` para mover as tabelas `InnoDB` entre as tabelas existentes [espaços de tabelas gerais](glossary.html#glos_general_tablespace "general tablespace"), espaços de tabelas por arquivo e o [espaço de tabelas do sistema](glossary.html#glos_system_tablespace "system tablespace"). Veja Movimentando tabelas entre espaços de tabelas usando ALTER TABLE.

As operações do `ALTER TABLE ... TABLESPACE` sempre causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

+ A sintaxe do `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

+ A cláusula `DATA DIRECTORY`, que é suportada com `CREATE TABLE ... TABLESPACE`(create-table.html "15.1.20 CREATE TABLE Statement"), não é suportada com `ALTER TABLE ... TABLESPACE`, e é ignorada se especificada.

+ Para mais informações sobre as capacidades e limitações da opção `TABLESPACE`, consulte `CREATE TABLE`.

* O MySQL NDB Cluster 8.0 suporta a definição das opções `NDB_TABLE` para controlar o equilíbrio de partição de uma tabela (tipo de contagem de fragmentos), capacidade de leitura a partir de qualquer réplica, replicação completa ou qualquer combinação dessas opções, como parte do comentário da tabela para uma declaração `ALTER TABLE` na mesma maneira que para `CREATE TABLE`, conforme mostrado neste exemplo:

  ```
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

É também possível definir opções de `NDB_COMMENT` para colunas de tabelas de `NDB` como parte de uma declaração de `ALTER TABLE`, como esta:

  ```
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=BLOB_INLINE_SIZE=4096,MAX_BLOB_PART_SIZE';
  ```

Definir o tamanho do blob inline dessa forma é suportado pelo NDB 8.0.30 e versões posteriores. Tenha em mente que `ALTER TABLE ... COMMENT ...` descarta qualquer comentário existente para a tabela. Consulte Configurando opções NDB_TABLE, para obter informações adicionais e exemplos.

As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de tabela, coluna e índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro. Os atributos de índice não podem ser alterados. Um índice deve ser descartado e adicionado novamente com a mudança desejada, o que pode ser realizado em uma única declaração `ALTER TABLE`.

Para verificar se as opções da tabela foram alteradas conforme o esperado, use `SHOW CREATE TABLE`, ou consulte a tabela do esquema de informações `TABLES`.

#### Requisitos de desempenho e espaço

As operações `ALTER TABLE` são processadas usando um dos seguintes algoritmos:

* `COPY`: As operações são realizadas em uma cópia da tabela original, e os dados da tabela são copiados da tabela original para a nova linha de tabela linha a linha. O DML concorrente não é permitido.

* `INPLACE`: As operações não evitam copiar os dados da tabela, mas podem reconstruí-la no local. Uma bloqueio exclusivo de metadados na tabela pode ser tomado brevemente durante as fases de preparação e execução da operação. Normalmente, o DML concorrente é suportado.

* `INSTANT`: As operações apenas modificam metadados no dicionário de dados. Uma bloqueio exclusivo de metadados na tabela pode ser tomado brevemente durante a fase de execução da operação. Os dados da tabela não são afetados, tornando as operações instantâneas. O DML concorrente é permitido. (Introduzido no MySQL 8.0.12)

Para tabelas que utilizam o mecanismo de armazenamento `NDB`, esses algoritmos funcionam da seguinte forma:

* `COPY`: `NDB` cria uma cópia da tabela e a altera; o manipulador do NDB Cluster então copia os dados entre as versões antigas e novas da tabela. Posteriormente, `NDB` exclui a tabela antiga e renomeia a nova.

Isso é, por vezes, referido como uma "cópia" ou `ALTER TABLE` "offline".

* `INPLACE`: Os nós de dados fazem as alterações necessárias; o manipulador do NDB Cluster não copia dados ou não participa de outra forma.

Isso é, por vezes, referido como uma `ALTER TABLE` "não copiada" ou "online".

* `INSTANT`: Não é suportado por `NDB`.

Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

A cláusula `ALGORITHM` é opcional. Se a cláusula `ALGORITHM` for omitida, o MySQL usa `ALGORITHM=INSTANT` para motores de armazenamento e as cláusulas `ALTER TABLE` que a suportam. Caso contrário, é usada a cláusula `ALGORITHM=INPLACE`. Se `ALGORITHM=INPLACE` não for suportada, é usada a cláusula `ALGORITHM=COPY`.

Nota

Após adicionar uma coluna a uma tabela particionada usando `ALGORITHM=INSTANT`, não é mais possível realizar `ALTER TABLE ... EXCHANGE PARTITION` em relação à tabela.

Especificar uma cláusula `ALGORITHM` exige que a operação use o algoritmo especificado para cláusulas e motores de armazenamento que o suportam, ou falhe com um erro caso contrário. Especificar `ALGORITHM=DEFAULT` é o mesmo que omitir a cláusula `ALGORITHM`.

`ALTER TABLE` as operações que utilizam o algoritmo `COPY` aguardam a conclusão de outras operações que estão modificando a tabela. Após as alterações serem aplicadas à cópia da tabela, os dados são copiados, a tabela original é excluída e a cópia da tabela é renomeada para o nome da tabela original. Enquanto a operação `ALTER TABLE` é executada, a tabela original é legível por outras sessões (com a exceção mencionada brevemente). As atualizações e escritas na tabela iniciadas após a operação (alter-table.html "15.1.9 ALTER TABLE Statement") começarem são travadas até que a nova tabela esteja pronta, e então são automaticamente redirecionadas para a nova tabela. A cópia temporária da tabela é criada no diretório do banco de dados da tabela original, a menos que seja uma operação `RENAME TO` que move a tabela para um banco de dados que reside em um diretório diferente.

A exceção mencionada anteriormente é que os blocos `ALTER TABLE` leem (não apenas escrevem) no ponto em que estão prontos para limpar estruturas de tabela desatualizadas da tabela e dos caches de definição de tabela. Neste ponto, ele deve adquirir um bloqueio exclusivo. Para isso, ele espera que os leitores atuais terminem e bloqueia novas leituras e escritas.

Uma operação `ALTER TABLE` que utiliza o algoritmo `COPY` prevê operações DML concorrentes. Perguntas concorrentes ainda são permitidas. Isso significa que uma operação de cópia de tabela sempre inclui pelo menos as restrições de concorrência de `LOCK=SHARED` (permitir consultas, mas não DML). Você pode restringir ainda mais a concorrência para operações que suportam a cláusula `LOCK`, especificando `LOCK=EXCLUSIVE`, que impede DML e consultas. Para mais informações, consulte Controle de Concorrência.

Para forçar o uso do algoritmo `COPY` para uma operação `ALTER TABLE` que, de outra forma, não a usaria, especifique `ALGORITHM=COPY` ou habilite a variável de sistema `old_alter_table`. Se houver um conflito entre o ajuste do `old_alter_table` e uma cláusula `ALGORITHM` com um valor diferente de `DEFAULT`, a cláusula `ALGORITHM` tem precedência.

Para as tabelas `InnoDB`, uma operação `ALTER TABLE` que utiliza o algoritmo `COPY` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações requerem tanto espaço adicional quanto os dados na tabela mais os índices. Para uma tabela que reside em um espaço de tabelas compartilhado, o espaço adicional usado durante a operação não é liberado de volta ao sistema operacional, como é o caso de uma tabela que reside em um espaço de tabelas por tabela.

Para informações sobre os requisitos de espaço para operações DDL online, consulte a Seção 17.12.3, “Requisitos de espaço DDL online”.

As operações que suportam o algoritmo `INPLACE` incluem:

* As operações `ALTER TABLE` suportadas pelo recurso DDL online `InnoDB`. Veja a Seção 17.12.1, “Operações DDL Online”.

* Renomear uma tabela. O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a declaração `RENAME TABLE`(rename-table.html "15.1.36 RENAME TABLE Statement") para renomear tabelas. Veja Seção 15.1.36, “Declaração RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

* Operações que modificam apenas o metadados da tabela. Essas operações são imediatas, pois o servidor não toca no conteúdo da tabela. As operações que modificam apenas o metadados incluem:

+ Renomear uma coluna. No NDB Cluster 8.0.18 e versões posteriores, essa operação também pode ser realizada online.

+ Alterar o valor padrão de uma coluna (exceto para as tabelas `NDB`).

+ Modificando a definição de uma coluna `ENUM` ou `SET` ao adicionar novos membros de enumeração ou conjunto ao *final* da lista de valores de membro válidos, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

+ Alterar a definição de uma coluna espacial para remover o atributo `SRID`. (Adicionar ou alterar um atributo `SRID` requer uma reconstrução e não pode ser feito no local, porque o servidor deve verificar que todos os valores têm o valor especificado `SRID`.

+ A partir do MySQL 8.0.14, alterar o conjunto de caracteres de uma coluna, quando essas condições forem aplicadas:

- O tipo de dados da coluna é `CHAR`, `VARCHAR`, um tipo `TEXT` ou `ENUM`.

- A mudança no conjunto de caracteres é de `utf8mb3` para `utf8mb4`, ou qualquer conjunto de caracteres para `binary`.

- Não há índice na coluna.
+ A partir do MySQL 8.0.14, ao alterar uma coluna gerada, quando essas condições forem aplicadas:

- Para as tabelas `InnoDB`, as declarações que modificam colunas armazenadas geradas, mas não alteram seu tipo, expressão ou nulidade.

- Para tabelas que não são `InnoDB`, declarações que modificam colunas armazenadas ou virtuais geradas, mas que não alteram seu tipo, expressão ou nulidade.

Um exemplo de tal mudança é a alteração do comentário da coluna.

* Renomear um índice. * Adicionar ou remover um índice secundário, para as tabelas `InnoDB` e `NDB`. Ver Seção 17.12.1, “Operações DDL online”.

* Para as tabelas `NDB`, operações que adicionam e excluem índices em colunas de largura variável. Essas operações ocorrem online, sem cópia da tabela e sem bloquear ações DML concorrentes durante a maior parte de sua duração. Veja a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

* Modificando a visibilidade do índice com uma operação `ALTER INDEX`.

* Modificações de coluna de tabelas que contêm colunas geradas que dependem de colunas com um valor `DEFAULT`, se as colunas modificadas não estiverem envolvidas nas expressões de coluna gerada. Por exemplo, alterar a propriedade `NULL` de uma coluna separada pode ser feito in loco sem uma reconstrução da tabela.

As `ALTER TABLE` operações que suportam o algoritmo `INSTANT` incluem:

* Adicionando uma coluna. Essa funcionalidade é conhecida como “Instant [[`ADD COLUMN`] ]”. Limitações aplicam-se. Consulte a Seção 17.12.1, “Operações DDL Online”.

* Deixar uma coluna. Esse recurso é denominado “Instant [[`DROP COLUMN`] ]”. Limitações aplicam-se. Consulte a Seção 17.12.1, “Operações DDL Online”.

* Adicionar ou remover uma coluna virtual. * Adicionar ou remover um valor padrão de coluna. * Modificar a definição de uma coluna `ENUM` ou `SET`. As mesmas restrições se aplicam como descritas acima para `ALGORITHM=INSTANT`.

* Alterar o tipo de índice. * Renomear uma tabela. As mesmas restrições se aplicam conforme descrito acima para `ALGORITHM=INSTANT`.

Para mais informações sobre operações que suportam `ALGORITHM=INSTANT`, consulte a Seção 17.12.1, “Operações DDL Online”.

`ALTER TABLE` atualiza as colunas temporais do MySQL 5.5 para o formato 5.6 para as operações `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX` e `FORCE`. Essa conversão não pode ser feita usando o algoritmo `INPLACE`, porque a tabela deve ser reconstruída, então especificar `ALGORITHM=INPLACE` nesses casos resulta em um erro. Especifique `ALGORITHM=COPY` se necessário.

Se uma operação `ALTER TABLE` em um índice multicoluna que foi usada para particionar uma tabela por `KEY` alterar a ordem das colunas, ela só pode ser realizada usando `ALGORITHM=COPY`.

As cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION` afetam se a cláusula `ALTER TABLE` realiza uma operação in-place para modificações de [coluna gerada virtualmente](glossary.html#glos_virtual_generated_column "virtual generated column"). Veja a Seção 15.1.9.2, “ALTER TABLE e Colunas Geradas”.

O NDB Cluster 8.0 suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. `NDB` não suporta a alteração de um espaço de tabela online; a partir do NDB 8.0.21, isso é desaconselhado. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

No NDB 8.0.27 e versões posteriores, ao realizar uma cópia `ALTER TABLE`, o sistema verifica se não foram feitas quaisquer escritas concorrentes na tabela afetada. Se for constatado que alguma foi feita, o `NDB` rejeita a declaração `ALTER TABLE` e gera `ER_TABLE_DEF_CHANGED`.

`ALTER TABLE` com `DISCARD ... PARTITION ... TABLESPACE` ou `IMPORT ... PARTITION ... TABLESPACE` não cria nenhuma tabela temporária ou arquivos de partição temporária.

`ALTER TABLE` com `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION` ou `REORGANIZE PARTITION` não cria tabelas temporárias (exceto quando usado com tabelas `NDB`; no entanto, essas operações podem e criam arquivos de partição temporários.

As operações `ADD` ou `DROP` para as partições `RANGE` ou `LIST` são operações imediatas ou quase imediatas. As operações `ADD` ou `COALESCE` para as partições `HASH` ou `KEY` copiam dados entre todas as partições, a menos que `LINEAR HASH` ou `LINEAR KEY` tenha sido usado; isso é efetivamente o mesmo que criar uma nova tabela, embora a operação `ADD` ou `COALESCE` seja realizada partição por partição. As operações `REORGANIZE` copiam apenas as partições alteradas e não tocam nas não alteradas.

Para as tabelas `MyISAM`, você pode acelerar a recriação do índice (a parte mais lenta do processo de alteração) definindo a variável de sistema `myisam_sort_buffer_size` para um valor alto.

#### Controle de Concorrência

Para operações que a suportam, como as `ALTER TABLE`, você pode usar a cláusula `LOCK` para controlar o nível de leituras e escritas concorrentes em uma tabela enquanto ela está sendo alterada. Especificar um valor não padrão para essa cláusula permite que você exija um determinado nível de acesso ou exclusividade concorrente durante a operação de alteração, e interrompe a operação se o grau de bloqueio solicitado não estiver disponível.

Apenas `LOCK = DEFAULT` é permitido para operações que utilizam `ALGORITHM=INSTANT`. Os outros parâmetros da cláusula `LOCK` não são aplicáveis.

Os parâmetros para a cláusula `LOCK` são:

* `LOCK = DEFAULT`

Nível máximo de concorrência para a cláusula `ALGORITHM` (se houver) e operação `ALTER TABLE`: Permita leituras e escritas concorrentes se estiverem suportadas. Se não estiverem, permita leituras concorrentes se estiverem suportadas. Se não estiverem, implemente acesso exclusivo.

* `LOCK = NONE`

Se for suportado, permita leituras e escritas concorrentes. Caso contrário, ocorrerá um erro.

* `LOCK = SHARED`

Se for suportada, permita leituras concorrentes, mas bloqueie as escritas. As escritas são bloqueadas mesmo que as escritas concorrentes sejam suportadas pelo motor de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`. Se as leituras concorrentes não forem suportadas, ocorre um erro.

* `LOCK = EXCLUSIVE`

Forçar acesso exclusivo. Isso é feito mesmo que leituras/escritas concorrentes sejam suportadas pelo motor de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`.

#### Adicionando e removendo colunas

Use `ADD` para adicionar novas colunas a uma tabela e `DROP` para remover colunas existentes. `DROP col_name` é uma extensão do MySQL para SQL padrão.

Para adicionar uma coluna em uma posição específica dentro de uma linha de tabela, use `FIRST` ou `AFTER col_name`. O padrão é adicionar a coluna por último.

Se uma tabela contiver apenas uma coluna, a coluna não pode ser removida. Se o que você pretende é remover a tabela, use a declaração `DROP TABLE` em vez disso.

Se as colunas forem excluídas de uma tabela, elas também serão removidas de qualquer índice do qual fazem parte. Se todas as colunas que compõem um índice forem excluídas, o índice também será excluído. Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento resultante da coluna for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para `ALTER TABLE ... ADD`, se a coluna tiver um valor padrão de expressão que utiliza uma função não determinística, a declaração pode produzir um aviso ou erro. Para obter mais informações, consulte a Seção 13.6, “Valores padrão de tipo de dados”, e a Seção 19.1.3.7, “Restrições sobre a replicação com GTIDs”.

#### Renomear, redefinir e reorganizar colunas

As cláusulas `CHANGE`, `MODIFY`, `RENAME COLUMN` e `ALTER` permitem que os nomes e definições das colunas existentes sejam alterados. Elas possuem essas características comparativas:

* `CHANGE`:

+ Pode renomear uma coluna e alterar sua definição, ou ambas.
+ Tem mais capacidade do que `MODIFY` ou `RENAME COLUMN`, mas às custas da conveniência para algumas operações. `CHANGE` exige o nomear a coluna duas vezes, se não renomeá-la, e exige a respecificação da definição da coluna se apenas renomeá-la.

+ Com `FIRST` ou `AFTER`, pode reorganizar as colunas.

* `MODIFY`:

+ Pode alterar a definição de uma coluna, mas não seu nome.
+ Mais conveniente do que `CHANGE` para alterar a definição de uma coluna sem renomeá-la.

+ Com `FIRST` ou `AFTER`, pode reorganizar as colunas.

* `RENAME COLUMN`:

+ Pode alterar o nome de uma coluna, mas não sua definição.
+ Mais conveniente do que `CHANGE` para renomear uma coluna sem alterar sua definição.

* `ALTER`: Usado apenas para alterar o valor padrão de uma coluna.

`CHANGE` é uma extensão do MySQL para SQL padrão. `MODIFY` e `RENAME COLUMN` são extensões do MySQL para compatibilidade com Oracle.

Para alterar uma coluna e alterar tanto seu nome quanto sua definição, use `CHANGE`, especificando os nomes antigos e novos e a nova definição. Por exemplo, para renomear uma coluna `INT NOT NULL` de `a` para `b` e alterar sua definição para usar o tipo de dados `BIGINT`, mantendo o atributo `NOT NULL`, faça o seguinte:

```
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

Para alterar a definição de uma coluna, mas não seu nome, use `CHANGE` ou `MODIFY`. Com `CHANGE`, a sintaxe exige dois nomes de coluna, então você deve especificar o mesmo nome duas vezes para não alterar o nome. Por exemplo, para alterar a definição da coluna `b`, faça isso:

```
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`MODIFY` é mais conveniente para alterar a definição sem alterar o nome, pois requer o nome da coluna apenas uma vez:

```
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

Para alterar o nome de uma coluna, mas não sua definição, use `CHANGE` ou `RENAME COLUMN`. Com `CHANGE`, a sintaxe exige uma definição de coluna, então, para não alterar a definição, você deve redefinir a definição que a coluna atualmente tem. Por exemplo, para renomear uma coluna `INT NOT NULL` de `b` para `a`, faça o seguinte:

```
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

`RENAME COLUMN` é mais conveniente para alterar o nome sem alterar a definição, pois requer apenas os nomes antigo e novo:

```
ALTER TABLE t1 RENAME COLUMN b TO a;
```

De modo geral, você não pode renomear uma coluna para um nome que já exista na tabela. No entanto, isso nem sempre é o caso, como quando você troca nomes ou os move através de um ciclo. Se uma tabela tiver colunas com os nomes `a`, `b` e `c`, essas são operações válidas:

```
-- swap a and b
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO a;
-- "rotate" a, b, c through a cycle
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO c,
               RENAME COLUMN c TO a;
```

Para mudanças na definição de coluna usando `CHANGE` ou `MODIFY`, a definição deve incluir o tipo de dados e todos os atributos que devem ser aplicados à nova coluna, exceto atributos de índice, como `PRIMARY KEY` ou `UNIQUE`. Os atributos presentes na definição original, mas não especificados para a nova definição, não são transportados. Suponha que uma coluna `col1` seja definida como `INT UNSIGNED DEFAULT 1 COMMENT 'my column'` e você modifique a coluna da seguinte forma, com a intenção de alterar apenas `INT` para `BIGINT`:

```
ALTER TABLE t1 MODIFY col1 BIGINT;
```

Essa declaração muda o tipo de dados de `INT` para `BIGINT`, mas também exclui os atributos `UNSIGNED`, `DEFAULT` e `COMMENT`. Para mantê-los, a declaração deve incluí-los explicitamente:

```
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

Para mudanças de tipo de dados usando `CHANGE` ou `MODIFY`, o MySQL tenta converter os valores existentes das colunas para o novo tipo da melhor maneira possível.

Aviso

Essa conversão pode resultar em alteração dos dados. Por exemplo, se você encurtar uma coluna de cadeia, os valores podem ser truncados. Para evitar que a operação tenha sucesso se as conversões para o novo tipo de dados resultassem na perda de dados, habilite o modo SQL rigoroso antes de usar `ALTER TABLE` (consulte Seção 7.1.11, “Modos SQL do servidor”).

Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para colunas renomeadas por `CHANGE` ou `RENAME COLUMN`, o MySQL renomeia automaticamente essas referências para a coluna renomeada:

* Índices que se referem à coluna antiga, incluindo índices invisíveis e índices desativados `MyISAM`.

* Chaves estrangeiras que se referem à coluna antiga.

Para colunas renomeadas por `CHANGE` ou `RENAME COLUMN`, o MySQL não renomeia automaticamente essas referências para a coluna renomeada:

* Expressões de coluna e partição geradas que se referem à coluna renomeada. Você deve usar `CHANGE` para redefinir tais expressões na mesma declaração `ALTER TABLE` que a que renomeia a coluna.

* Visões e programas armazenados que se referem à coluna renomeada. Você deve alterar manualmente a definição desses objetos para se referir ao novo nome da coluna.

Para reorganizar as colunas dentro de uma tabela, use `FIRST` e `AFTER` nas operações de `CHANGE` ou `MODIFY`.

`ALTER ... SET DEFAULT` ou `ALTER ... DROP DEFAULT` especifica um novo valor padrão para uma coluna ou remove o valor padrão antigo, respectivamente. Se o valor antigo for removido e a coluna possa ser `NULL`, o novo valor padrão é `NULL`. Se a coluna não puder ser `NULL`, o MySQL atribui um valor padrão conforme descrito na Seção 13.6, “Valores padrão de tipo de dados”.

A partir do MySQL 8.0.23, `ALTER ... SET VISIBLE` e `ALTER ... SET INVISIBLE` permitem que a visibilidade da coluna seja alterada. Veja a Seção 15.1.20.10, “Colunas invisíveis”.

#### Chaves Primárias e Índices

`DROP PRIMARY KEY` elimina a chave primária. Se não houver chave primária, ocorrerá um erro. Para informações sobre as características de desempenho das chaves primárias, especialmente para as tabelas `InnoDB`, consulte a Seção 10.3.2, “Otimização da Chave Primária”.

Se a variável de sistema `sql_require_primary_key` estiver habilitada, a tentativa de descartar uma chave primária produz um erro.

Se você adicionar um `UNIQUE INDEX` ou `PRIMARY KEY` a uma tabela, o MySQL armazena-o antes de qualquer índice não exclusivo para permitir a detecção de chaves duplicadas o mais cedo possível.

`DROP INDEX` remove um índice. Esta é uma extensão do MySQL para o SQL padrão. Veja a Seção 15.1.27, “Declaração DROP INDEX”. Para determinar os nomes dos índices, use `SHOW INDEX FROM tbl_name`.

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING type_name`. Para detalhes sobre `USING`, consulte a Seção 15.1.15, “Declaração CREATE INDEX”. A posição preferida é após a lista de colunas. Espere o suporte para o uso da opção antes da lista de colunas ser removida em um lançamento futuro do MySQL.

Os valores de *`index_option`* especificam opções adicionais para um índice. `USING` é uma dessas opções. Para obter detalhes sobre os valores *`index_option`* permitidos, consulte a Seção 15.1.15, “Instrução CREATE INDEX”.

`RENAME INDEX old_index_name TO new_index_name` renomeia um índice. Esta é uma extensão do MySQL ao SQL padrão. O conteúdo da tabela permanece inalterado. *`old_index_name`* deve ser o nome de um índice existente na tabela que não seja descartado pela mesma declaração `ALTER TABLE`. *`new_index_name`* é o novo nome do índice, que não pode duplicar o nome de um índice na tabela resultante após as alterações terem sido aplicadas. Nenhum nome de índice pode ser `PRIMARY`.

Se você usar `ALTER TABLE` em uma tabela `MyISAM`, todos os índices não exclusivos são criados em um lote separado (como no caso de [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement")). Isso deve tornar [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") muito mais rápido quando você tem muitos índices.

Para as tabelas `MyISAM`, a atualização de chaves pode ser controlada explicitamente. Use `ALTER TABLE ... DISABLE KEYS` para dizer ao MySQL para parar de atualizar índices não exclusivos. Em seguida, use `ALTER TABLE ... ENABLE KEYS` para recriar índices ausentes. `MyISAM` faz isso com um algoritmo especial que é muito mais rápido do que inserir chaves uma a uma, então desabilitar chaves antes de realizar operações de inserção em massa deve proporcionar um aumento considerável na velocidade. Usar `ALTER TABLE ... DISABLE KEYS` requer o privilégio `INDEX`, além dos privilégios mencionados anteriormente.

Embora os índices não exclusivos estejam desativados, eles são ignorados para declarações como `SELECT` e `EXPLAIN`, que, de outra forma, os utilizariam.

Após uma declaração `ALTER TABLE`, pode ser necessário executar `ANALYZE TABLE` para atualizar as informações de cardinalidade do índice. Veja a Seção 15.7.7.22, “Declaração SHOW INDEX”.

A operação `ALTER INDEX` permite que um índice seja tornado visível ou invisível. Um índice invisível não é utilizado pelo otimizador. A modificação da visibilidade do índice aplica-se a índices que não são chaves primárias (explícitos ou implícitos), e não pode ser realizada usando `ALGORITHM=INSTANT`. Este recurso é neutro em relação ao mecanismo de armazenamento (suportando qualquer motor). Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

#### Chaves Estrangeiras e Outras Restrições

As cláusulas `FOREIGN KEY` e `REFERENCES` são suportadas pelos motores de armazenamento `InnoDB` e `NDB`, que implementam `ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (...) REFERENCES ... (...)`. Veja a Seção 15.1.20.5, “Restrições de CHAVE ESTÁVEL”. Para outros motores de armazenamento, as cláusulas são analisadas, mas ignoradas.

Para `ALTER TABLE`, ao contrário de `CREATE TABLE`, `ADD FOREIGN KEY` ignora *`index_name`* se fornecido e usa um nome de chave estrangeira gerado automaticamente. Como uma solução alternativa, inclua a cláusula `CONSTRAINT` para especificar o nome da chave estrangeira:

```
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Importante

O MySQL ignora silenciosamente as especificações em linha `REFERENCES`, onde as referências são definidas como parte da especificação da coluna. O MySQL aceita apenas as cláusulas `REFERENCES` definidas como parte de uma especificação `FOREIGN KEY` separada.

Nota

As tabelas `InnoDB` particionadas não suportam chaves estrangeiras. Essa restrição não se aplica às tabelas `NDB`, incluindo aquelas explicitamente particionadas por `[LINEAR] KEY`. Para mais informações, consulte a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

O MySQL Server e o NDB Cluster ambos suportam o uso de `ALTER TABLE` para descartar chaves estrangeiras:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

A adição e a remoção de uma chave estrangeira na mesma declaração `ALTER TABLE` são suportadas para `ALTER TABLE ... ALGORITHM=INPLACE`(alter-table.html "15.1.9 ALTER TABLE Statement"), mas não para `ALTER TABLE ... ALGORITHM=COPY`(alter-table.html "15.1.9 ALTER TABLE Statement").

O servidor proíbe alterações em colunas de chave estrangeira que possam causar perda de integridade referencial. Uma solução é usar `ALTER TABLE ... DROP FOREIGN KEY`(alter-table.html "15.1.9 ALTER TABLE Statement") antes de alterar a definição da coluna e `ALTER TABLE ... ADD FOREIGN KEY`(alter-table.html "15.1.9 ALTER TABLE Statement") depois. Exemplos de alterações proibidas incluem:

* Alterações no tipo de dados das colunas de chave estrangeira que podem ser inseguras. Por exemplo, alterar `VARCHAR(20)` para `VARCHAR(30)` é permitido, mas alterá-lo para `VARCHAR(1024)` não é permitido, pois isso altera o número de bytes de comprimento necessários para armazenar valores individuais.

* Alterar uma coluna `NULL` para `NOT NULL` no modo não estrito é proibido para evitar a conversão de valores de `NULL` para valores padrão não `NULL`, para os quais não existem valores correspondentes na tabela referenciada. A operação é permitida no modo estrito, mas um erro é retornado se qualquer conversão desse tipo for necessária.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera os nomes das restrições de chave estrangeira geradas internamente e os nomes das restrições de chave estrangeira definidas pelo usuário que começam com a string “*`tbl_name`*_ibfk_” para refletir o novo nome da tabela. `InnoDB` interpreta os nomes das restrições de chave estrangeira que começam com a string “*`tbl_name`*_ibfk_” como nomes gerados internamente.

Antes do MySQL 8.0.16, `ALTER TABLE` permite apenas a seguinte versão limitada da sintaxe de adição de restrições `CHECK`, que é analisada e ignorada:

```
ADD CHECK (expr)
```

A partir do MySQL 8.0.16, `ALTER TABLE` permite que restrições `CHECK` para tabelas existentes sejam adicionadas, excluídas ou alteradas:

* Adicione uma nova restrição `CHECK`:

  ```
  ALTER TABLE tbl_name
      ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED];
  ```

O significado dos elementos de sintaxe de restrição é o mesmo que para `CREATE TABLE`. Veja a Seção 15.1.20.6, “Restrições CHECK”.

* Descarte a restrição existente `CHECK` com o nome *`symbol`*:

  ```
  ALTER TABLE tbl_name
      DROP CHECK symbol;
  ```

* Alterar se uma restrição existente `CHECK` chamada *`symbol`* é aplicada:

  ```
  ALTER TABLE tbl_name
      ALTER CHECK symbol [NOT] ENFORCED;
  ```

As cláusulas `DROP CHECK` e `ALTER CHECK` são extensões do MySQL para SQL padrão.

A partir do MySQL 8.0.19, `ALTER TABLE` permite uma sintaxe mais geral (e padrão SQL) para a remoção e alteração de restrições existentes de qualquer tipo, onde o tipo da restrição é determinado a partir do nome da restrição:

* Remova uma restrição existente com o nome *`symbol`*:

  ```
  ALTER TABLE tbl_name
      DROP CONSTRAINT symbol;
  ```

Se a variável de sistema `sql_require_primary_key` estiver habilitada, a tentativa de excluir uma chave primária produz um erro.

* Alterar se uma restrição existente chamada *`symbol`* é aplicada:

  ```
  ALTER TABLE tbl_name
      ALTER CONSTRAINT symbol [NOT] ENFORCED;
  ```

Apenas as restrições `CHECK` podem ser alteradas para não serem aplicadas. Todos os outros tipos de restrição são sempre aplicados.

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo espaço de nomes. No MySQL, cada tipo de restrição tem seu próprio espaço de nomes por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema, mas as restrições de diferentes tipos podem ter o mesmo nome. Quando várias restrições têm o mesmo nome, `DROP CONSTRAINT` e `ADD CONSTRAINT` são ambíguos e ocorre um erro. Nesses casos, a sintaxe específica da restrição deve ser usada para modificar a restrição. Por exemplo, use `DROP PRIMARY KEY` ou DROP FOREIGN KEY para descartar uma chave primária ou chave estrangeira.

Se uma alteração de tabela causar uma violação de uma restrição imposta pelo `CHECK`, um erro ocorre e a tabela não é modificada. Exemplos de operações para as quais ocorre um erro:

* Tentativas de adicionar o atributo `AUTO_INCREMENT` a uma coluna que é usada em uma restrição `CHECK`.

* Tentativas de adicionar uma restrição `CHECK` imposta ou aplicar uma restrição `CHECK` não imposta para a qual as linhas existentes violam a condição da restrição.

* Tente modificar, renomear ou excluir uma coluna que é usada em uma restrição `CHECK`, a menos que essa restrição também seja excluída na mesma declaração. Exceção: Se uma restrição `CHECK` se refere apenas a uma única coluna, a exclusão da coluna exclui automaticamente a restrição.

`ALTER TABLE tbl_name RENAME new_tbl_name` as alterações de nomes de restrição internamente gerados e definidos pelo usuário `CHECK` que começam com a string “*`tbl_name`*_chk_” para refletir o novo nome da tabela. O MySQL interpreta os nomes de restrição `CHECK` que começam com a string “*`tbl_name`*_chk_” como nomes gerados internamente.

#### Alterando o Conjunto de Caracteres

Para alterar o conjunto de caracteres padrão da tabela e todas as colunas de caracteres (`CHAR`, `VARCHAR`, `TEXT`) para um novo conjunto de caracteres, use uma declaração como esta:

```
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

A declaração também altera a correção de todos os campos de caracteres. Se você especificar nenhuma cláusula `COLLATE` para indicar qual correção usar, a declaração usa a correção padrão para o conjunto de caracteres. Se essa correção for inadequada para o uso pretendido da tabela (por exemplo, se ela mudaria de uma correção sensível ao caso para uma correção insensível ao caso), especifique uma correção explicitamente.

Para uma coluna que tem um tipo de dados de `VARCHAR` ou um dos tipos `TEXT`, `CONVERT TO CHARACTER SET` altera o tipo de dados conforme necessário para garantir que a nova coluna seja longa o suficiente para armazenar tantos caracteres quanto a coluna original. Por exemplo, uma coluna `TEXT` tem dois bytes de comprimento, que armazenam o comprimento em bytes dos valores na coluna, até um máximo de 65.535. Para uma coluna `latin1` `TEXT`, cada caractere requer um único byte, então a coluna pode armazenar até 65.535 caracteres. Se a coluna for convertida para `utf8mb4`, cada caractere pode requerer até 4 bytes, para um comprimento possível máximo de 4 × 65.535 = 262.140 bytes. Esse comprimento não cabe nos bytes de comprimento de uma coluna `TEXT`, então o MySQL converte o tipo de dados para `MEDIUMTEXT`, que é o menor tipo de string para o qual os bytes de comprimento podem registrar um valor de 262.140. Da mesma forma, uma coluna `VARCHAR` pode ser convertida para `MEDIUMTEXT`.

Para evitar mudanças no tipo de dados do tipo descrito acima, não use `CONVERT TO CHARACTER SET`. Em vez disso, use `MODIFY` para alterar colunas individuais. Por exemplo:

```
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8mb4;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8mb4;
```

Se você especificar `CONVERT TO CHARACTER SET binary`, as colunas `CHAR`, `VARCHAR` e `TEXT` são convertidas para seus tipos correspondentes de string binária (`BINARY`, `VARBINARY`, `BLOB`). Isso significa que as colunas não têm mais um conjunto de caracteres e uma operação subsequente `CONVERT TO` não se aplica a elas.

Se *`charset_name`* for `DEFAULT` em uma operação `CONVERT TO CHARACTER SET`, o conjunto de caracteres nomeado pela variável de sistema `character_set_database` é utilizado.

Aviso

A operação `CONVERT TO` converte os valores das colunas entre os conjuntos de caracteres originais e nomeados. Isso *não* é o que você quer se tiver uma coluna em um conjunto de caracteres (como `latin1`) mas os valores armazenados realmente usam algum outro conjunto de caracteres incompatível (como `utf8mb4`). Neste caso, você tem que fazer o seguinte para cada coluna desse tipo:

```
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8mb4;
```

A razão pela qual isso funciona é que não há conversão quando você converte para ou a partir das colunas `BLOB`.

Para alterar apenas o conjunto de caracteres *padrão* de uma tabela, use esta declaração:

```
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

A palavra `DEFAULT` é opcional. O conjunto de caracteres padrão é o conjunto de caracteres que é usado se você não especificar o conjunto de caracteres para as colunas que você adicionar a uma tabela posteriormente (por exemplo, com `ALTER TABLE ... ADD column`).

Quando a variável de sistema `foreign_key_checks` é habilitada, que é a configuração padrão, a conversão de conjuntos de caracteres não é permitida em tabelas que incluem uma coluna de cadeia de caracteres usada em uma restrição de chave estrangeira. A solução é desabilitar `foreign_key_checks` antes de realizar a conversão de conjuntos de caracteres. Você deve realizar a conversão em ambas as tabelas envolvidas na restrição de chave estrangeira antes de reativar `foreign_key_checks`. Se você reativar `foreign_key_checks` após converter apenas uma das tabelas, uma operação de `ON DELETE CASCADE` ou `ON UPDATE CASCADE` pode corromper os dados na tabela de referência devido à conversão implícita que ocorre durante essas operações (Bug #45290, Bug #74816).

#### Importando tabelas InnoDB

Uma tabela `InnoDB` criada em seu próprio espaço de tabelas por arquivo pode ser importada a partir de um backup ou de outra instância do servidor MySQL usando as cláusulas `DISCARD TABLEPACE` e `IMPORT TABLESPACE`. Veja a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

#### Ordem de linha para tabelas MyISAM

`ORDER BY` permite que você crie a nova tabela com as linhas em um determinado ordem. Esta opção é útil principalmente quando você sabe que consulta as linhas em um determinado ordem a maior parte do tempo. Ao usar esta opção após alterações importantes na tabela, você pode conseguir um desempenho mais alto. Em alguns casos, isso pode tornar o ordenamento mais fácil para o MySQL se a tabela estiver em ordem pela coluna pela qual você deseja ordená-la mais tarde.

Nota

A tabela não permanece na ordem especificada após inserções e excluções.

A sintaxe `ORDER BY` permite que um ou mais nomes de coluna sejam especificados para ordenação, sendo que cada um deles, opcionalmente, pode ser seguido por `ASC` ou `DESC` para indicar a ordem de classificação ascendente ou descendente, respectivamente. O padrão é a ordem ascendente. Apenas nomes de coluna são permitidos como critérios de ordenação; expressões arbitrárias não são permitidas. Esta cláusula deve ser dada por último após qualquer outra cláusula.

`ORDER BY` não faz sentido para as tabelas `InnoDB` porque `InnoDB` sempre ordena as linhas da tabela de acordo com o índice agrupado.

Quando usado em uma tabela dividida, `ALTER TABLE ... ORDER BY` ordena as linhas apenas dentro de cada partição.

#### Opções de Partição

*`partition_options`* indica opções que podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, mesclar e dividir particionamentos, além de realizar manutenção de particionamento.

É possível que uma declaração `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após qualquer outra especificação. As opções `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, uma vez que as opções listadas acima atuam em partições individuais.

Para mais informações sobre as opções de partição, consulte a Seção 15.1.20, “Instrução CREATE TABLE”, e a Seção 15.1.9.1, “Operações de Partição ALTER TABLE”. Para informações e exemplos sobre as instruções `ALTER TABLE ... EXCHANGE PARTITION`, consulte a Seção 26.3.3, “Trocando Partições e Subpartições com Tabelas”.

#### 15.1.9.1 Operações de Partição em Tabela ALTER

As cláusulas relacionadas à partição para `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") podem ser usadas com tabelas particionadas para repartir, adicionar, descartar, importar, mesclar e dividir partições, além de realizar manutenção de partição.

* Simplesmente usar uma cláusula *`partition_options`* com `ALTER TABLE` em uma tabela particionada redistribui a tabela de acordo com o esquema de particionamento definido por *`partition_options`*. Esta cláusula sempre começa com `PARTITION BY`, e segue a mesma sintaxe e outras regras que se aplicam à cláusula *`partition_options`* para `CREATE TABLE` (para informações mais detalhadas, consulte Seção 15.1.20, “Declaração CREATE TABLE”), e também pode ser usada para particionar uma tabela existente que não esteja já particionada. Por exemplo, considere uma tabela (não particionada) definida como mostrado aqui:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

Essa tabela pode ser particionada por `HASH`, usando a coluna `id` como chave de particionamento, em 8 partições por meio desta declaração:

  ```
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

O MySQL suporta a opção `ALGORITHM` com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chave que o MySQL 5.1 ao calcular a colocação de linhas em partições; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chave implementadas e usadas por padrão para novas tabelas particionadas `KEY` no MySQL 5.5 e versões posteriores. (Tabelas particionadas criadas com as funções de hashing de chave empregadas no MySQL 5.5 e versões posteriores não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada ao uso principalmente ao atualizar ou desatualizar tabelas particionadas `[LINEAR] KEY` entre as versões MySQL 5.1 e posteriores, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1.

A tabela que resulta do uso de uma declaração `ALTER TABLE ... PARTITION BY` deve seguir as mesmas regras que uma criada usando `CREATE TABLE ... PARTITION BY`. Isso inclui as regras que regem a relação entre quaisquer chaves únicas (incluindo qualquer chave primária) que a tabela possa ter, e as colunas ou colunas usadas na expressão de particionamento, conforme discutido na Seção 26.6.1, "Chaves de particionamento, chaves primárias e chaves únicas". As regras `CREATE TABLE ... PARTITION BY` para especificar o número de particionamentos também se aplicam a `ALTER TABLE ... PARTITION BY`.

A cláusula *`partition_definition`* para `ALTER TABLE ADD PARTITION` suporta as mesmas opções que a cláusula do mesmo nome para a declaração `CREATE TABLE` (Veja Seção 15.1.20, “Declaração CREATE TABLE”, para a sintaxe e descrição). Suponha que você tenha a tabela particionada criada como mostrado aqui:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999)
  );
  ```

Você pode adicionar uma nova partição `p3` a esta tabela para armazenar valores menores que `2002` da seguinte forma:

  ```
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

`DROP PARTITION` pode ser usado para descartar uma ou mais partições `RANGE` ou `LIST`. Esta declaração não pode ser usada com as partições `HASH` ou `KEY`; em vez disso, use `COALESCE PARTITION` (consulte mais tarde nesta seção). Quaisquer dados que foram armazenados nas partições descartadas, nomeadas na lista *`partition_names`*, são descartados. Por exemplo, dado o quadro `t1` definido anteriormente, você pode descartar as partições nomeadas `p0` e `p1` como mostrado aqui:

  ```
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

Nota

`DROP PARTITION` não funciona com tabelas que utilizam o mecanismo de armazenamento `NDB`. Consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”, e a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster”.

`ADD PARTITION` e `DROP PARTITION` não suportam atualmente `IF [NOT] EXISTS`.

As opções `DISCARD PARTITION ... TABLESPACE`(alter-table.html "15.1.9 ALTER TABLE Statement") e `IMPORT PARTITION ... TABLESPACE`(alter-table.html "15.1.9 ALTER TABLE Statement") estendem a funcionalidade do [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") para partições individuais de tabela `InnoDB`. Cada partição de tabela `InnoDB` tem seu próprio arquivo de tablespace (arquivo `.ibd`). A funcionalidade [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") facilita a cópia dos tablespace de uma instância de servidor MySQL em execução para outra instância em execução, ou para realizar uma restauração na mesma instância. Ambas as opções aceitam uma lista de nomes de partição separados por vírgula de uma ou mais partições. Por exemplo:

  ```
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

Quando você executa `DISCARD PARTITION ... TABLESPACE`](alter-table.html "15.1.9 ALTER TABLE Statement") e `IMPORT PARTITION ... TABLESPACE`](alter-table.html "15.1.9 ALTER TABLE Statement") em tabelas subpartidas, tanto os nomes de partição quanto os de subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas.

O recurso [Transportable Tablespace][(glossary.html#glos_transportable_tablespace "transportable tablespace")] também suporta a cópia ou restauração de tabelas particionadas `InnoDB`. Para mais informações, consulte a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

Os nomes renomeados de tabelas particionadas são suportados. Você pode renomear diretamente as partições individuais usando `ALTER TABLE ... REORGANIZE PARTITION`; no entanto, essa operação copia os dados da partição.

Para excluir linhas de partições selecionadas, use a opção `TRUNCATE PARTITION`. Esta opção recebe uma lista de um ou mais nomes de partição separados por vírgula. Considere a tabela `t1` criada por esta declaração:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2003),
      PARTITION p4 VALUES LESS THAN (2007)
  );
  ```

Para excluir todas as linhas da partição `p0`, use a seguinte declaração:

  ```
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

A declaração que acabou de ser mostrada tem o mesmo efeito que a seguinte declaração `DELETE`:

  ```
  DELETE FROM t1 WHERE year_col < 1991;
  ```

Ao truncar múltiplas partições, as partições não precisam ser contínuas: Isso pode simplificar muito as operações de exclusão em tabelas particionadas que, caso contrário, exigiriam condições muito complexas `WHERE` se feitas com declarações `DELETE`. Por exemplo, esta declaração exclui todas as linhas das partições `p1` e `p3`:

  ```
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

Aqui está uma declaração equivalente `DELETE`:

  ```
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

Se você usar a palavra-chave `ALL` no lugar da lista de nomes de partição, a declaração atua em todas as partições da tabela.

`TRUNCATE PARTITION` apenas exclui linhas; não altera a definição da própria tabela ou de qualquer uma de suas partições.

Para verificar se as linhas foram excluídas, verifique a tabela `INFORMATION_SCHEMA.PARTITIONS`, usando uma consulta como esta:

  ```
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

`COALESCE PARTITION` pode ser usado com uma tabela que é particionada por `HASH` ou `KEY` para reduzir o número de particionamentos por *`number`*. Suponha que você tenha criado a tabela `t2` da seguinte forma:

  ```
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

Para reduzir o número de partições usadas por `t2` de 6 para 4, use a seguinte declaração:

  ```
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

Os dados contidos nas últimas partições *`number`* são agregados nas partições restantes. Neste caso, as partições 4 e 5 são agregadas nas primeiras 4 partições (as partições numeradas 0, 1, 2 e 3).

Para alterar algumas, mas não todas, as partições usadas por uma tabela particionada, você pode usar `REORGANIZE PARTITION`. Essa declaração pode ser usada de várias maneiras:

+ Para fundir um conjunto de partições em uma única partição. Isso é feito ao nomear várias partições na lista *`partition_names`* e fornecendo uma única definição para *`partition_definition`*.

+ Para dividir uma partição existente em várias partições. Para isso, dê um nome a uma única partição para *`partition_names`* e forneça várias *`partition_definitions`*.

+ Para alterar os intervalos para um subconjunto de partições definidas usando `VALUES LESS THAN` ou as listas de valores para um subconjunto de partições definidas usando `VALUES IN`.

Nota

Para partições que não foram explicitamente nomeadas, o MySQL fornece automaticamente os nomes padrão `p0`, `p1`, `p2`, e assim por diante. O mesmo vale para as subpartições.

Para informações mais detalhadas sobre as declarações `ALTER TABLE ... REORGANIZE PARTITION` e exemplos, consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”.

* Para trocar uma partição de tabela ou subpartição por uma tabela, use a declaração `ALTER TABLE ... EXCHANGE PARTITION` — ou seja, para mover quaisquer linhas existentes na partição ou subpartição para a tabela não particionada e quaisquer linhas existentes na tabela não particionada para a partição ou subpartição da tabela.

Uma vez que uma ou mais colunas tenham sido adicionadas a uma tabela particionada usando `ALGORITHM=INSTANT`, não é mais possível trocar as particionamentos com essa tabela.

Para informações de uso e exemplos, consulte a Seção 26.3.3, “Trocando Partições e Subpartições com Tabelas”.

* Várias opções oferecem manutenção e reparo de partições análoga àquela implementada para tabelas não particionadas por declarações como `CHECK TABLE` e `REPAIR TABLE` (que também são suportadas para tabelas particionadas; para mais informações, consulte Seção 15.7.3, “Declarações de Manutenção de Tabelas”). Essas incluem `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION` e `REPAIR PARTITION`. Cada uma dessas opções leva uma cláusula *`partition_names`* composta por um ou mais nomes de partições, separados por vírgulas. As partições devem já existir na tabela de destino. Você também pode usar a palavra-chave `ALL` no lugar de *`partition_names`*, nesse caso, a declaração atua em todas as partições da tabela. Para mais informações e exemplos, consulte Seção 26.3.4, “Manutenção de Partições”.

`InnoDB` atualmente não suporta otimização por partição; `ALTER TABLE ... OPTIMIZE PARTITION` faz com que toda a tabela seja reconstruída e analisada, e um aviso apropriado seja emitido. (Bug #11751825, Bug #42822) Para contornar esse problema, use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso.

As opções `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION` e `REPAIR PARTITION` não são suportadas para tabelas que não estão particionadas.

* `REMOVE PARTITIONING` permite que você remova a partição de uma tabela sem afetar a tabela ou seus dados de outra forma. Esta opção pode ser combinada com outras opções `ALTER TABLE`, como aquelas usadas para adicionar, excluir ou renomear colunas ou índices.

* O uso da opção `ENGINE` com `ALTER TABLE` altera o mecanismo de armazenamento utilizado pela tabela sem afetar a partição. O mecanismo de armazenamento alvo deve fornecer seu próprio manipulador de partição. Apenas os mecanismos de armazenamento `InnoDB` e `NDB` têm manipuladores de partição nativos; `NDB` não é atualmente suportado no MySQL 8.0.

É possível que uma declaração `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após qualquer outra especificação.

As opções `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais. Para mais informações, consulte a Seção 15.1.9.1, “Operações de Partição de ALTER TABLE”.

Apenas uma única instância de qualquer uma das seguintes opções pode ser usada em uma declaração específica do `ALTER TABLE`: `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION`, ou `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

Por exemplo, as seguintes duas afirmações são inválidas:

```
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

No primeiro caso, você pode analisar as partições `p1` e `p2` da tabela `t1` simultaneamente usando uma única declaração com uma única opção `ANALYZE PARTITION` que lista ambas as partições a serem analisadas, como este:

```
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

No segundo caso, não é possível realizar as operações `ANALYZE` e `CHECK` em diferentes partições da mesma tabela simultaneamente. Em vez disso, você deve emitir duas declarações separadas, como esta:

```
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

As operações `REBUILD` não são suportadas atualmente para subpartições. A palavra-chave `REBUILD` é expressamente proibida com subpartições e faz com que `ALTER TABLE` falhe com um erro se assim for usada.

As operações `CHECK PARTITION` e `REPAIR PARTITION` falham quando a partição a ser verificada ou reparada contém quaisquer erros de chave duplicada.

Para mais informações sobre essas declarações, consulte a Seção 26.3.4, “Manutenção de Partições”.

#### 15.1.9.2 ALTER TABLE e Colunas Geradas

As operações permitidas para colunas geradas são `ALTER TABLE`, `ADD`, e `CHANGE`.

* Colunas geradas podem ser adicionadas.

  ```
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* O tipo de dados e a expressão das colunas geradas podem ser modificados.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

* As colunas geradas podem ser renomeadas ou excluídas, desde que nenhuma outra coluna as refira.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

* As colunas geradas virtualmente não podem ser alteradas para colunas geradas armazenadas, ou vice-versa. Para contornar isso, descarte a coluna e, em seguida, adicione-a com a nova definição.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas não geradas podem ser alteradas para armazenadas, mas não para colunas geradas virtualmente.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas armazenadas, mas não geradas virtualmente, podem ser alteradas para colunas não geradas. Os valores gerados armazenados se tornam os valores da coluna não gerada.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

* `ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor. Para colunas armazenadas, as alterações de indexação são feitas in-place, e as alterações de expressão não são feitas in-place. As alterações nos comentários das colunas são feitas in-place.

* Para tabelas não particionadas, `ADD COLUMN` e `DROP COLUMN` são operações in-place para colunas virtuais. No entanto, não é possível adicionar ou remover uma coluna virtual in-place em combinação com outras operações `ALTER TABLE`.

Para tabelas particionadas, `ADD COLUMN` e `DROP COLUMN` não são operações in-place para colunas virtuais.

* `InnoDB` suporta índices secundários em colunas geradas virtualmente. Adicionar ou remover um índice secundário em uma coluna gerada virtualmente é uma operação in-place. Para mais informações, consulte a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

* Quando uma coluna gerada por `VIRTUAL` é adicionada a uma tabela ou modificada, não se garante que os dados calculados pela expressão da coluna gerada não estejam fora do intervalo da coluna. Isso pode levar ao retorno de dados inconsistentes e a declarações inesperadamente falhadas. Para permitir o controle sobre se a validação ocorre para essas colunas, o `ALTER TABLE` suporta as cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION`:

+ Com `WITHOUT VALIDATION` (o padrão se nenhuma das cláusulas for especificada), uma operação in-place é realizada (se possível), a integridade dos dados não é verificada e a declaração termina mais rapidamente. No entanto, leituras posteriores da tabela podem relatar avisos ou erros para a coluna se os valores estiverem fora do intervalo.

+ Com `WITH VALIDATION`, `ALTER TABLE` copia a tabela. Se ocorrer um erro fora do intervalo ou qualquer outro erro, a declaração falha. Como uma cópia da tabela é realizada, a declaração leva mais tempo.

`WITHOUT VALIDATION` e `WITH VALIDATION` são permitidos apenas com operações de `ADD COLUMN`, `CHANGE COLUMN` e `MODIFY COLUMN`. Caso contrário, ocorre um erro de `ER_WRONG_USAGE`.

* Se a avaliação da expressão causar truncação ou fornecer entrada incorreta para uma função, a declaração `ALTER TABLE` termina com um erro e a operação DDL é rejeitada.

* Uma declaração `ALTER TABLE` que altera o valor padrão de uma coluna *`col_name`* também pode alterar o valor de uma expressão de coluna gerada que se refere à coluna usando *`col_name`*, o que pode alterar o valor de uma expressão de coluna gerada que se refere à coluna usando `DEFAULT(col_name)`. Por essa razão, as operações `ALTER TABLE` que alteram a definição de uma coluna causam uma reconstrução da tabela se alguma expressão de coluna gerada usar `DEFAULT()`.

#### 15.1.9.3 Exemplos de ALTER TABLE

Comece com uma tabela `t1` criada conforme mostrado aqui:

```
CREATE TABLE t1 (a INTEGER, b CHAR(10));
```

Para renomear a tabela de `t1` para `t2`:

```
ALTER TABLE t1 RENAME t2;
```

Para alterar a coluna `a` de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) para `TINYINT NOT NULL` (mantendo o mesmo nome), e para alterar a coluna `b` de `CHAR(10)` para `CHAR(20)`, além de renomeá-la de `b` para `c`:

```
ALTER TABLE t2 MODIFY a TINYINT NOT NULL, CHANGE b c CHAR(20);
```

Para adicionar uma nova coluna `TIMESTAMP` chamada `d`:

```
ALTER TABLE t2 ADD d TIMESTAMP;
```

Para adicionar um índice na coluna `d` e um índice `UNIQUE` na coluna `a`:

```
ALTER TABLE t2 ADD INDEX (d), ADD UNIQUE (a);
```

Para remover a coluna `c`:

```
ALTER TABLE t2 DROP COLUMN c;
```

Para adicionar uma nova coluna inteira `AUTO_INCREMENT` com o nome `c`:

```
ALTER TABLE t2 ADD c INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (c);
```

Indexamos `c` (como `PRIMARY KEY`) porque as colunas `AUTO_INCREMENT` devem ser indexadas, e declaramos `c` como `NOT NULL` porque as colunas da chave primária não podem ser `NULL`.

Para as tabelas `NDB`, também é possível alterar o tipo de armazenamento usado para uma tabela ou coluna. Por exemplo, considere uma tabela `NDB` criada conforme mostrado aqui:

```
mysql> CREATE TABLE t1 (c1 INT) TABLESPACE ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.27 sec)
```

Para converter esta tabela para armazenamento baseado em disco, você pode usar a seguinte declaração `ALTER TABLE`:

```
mysql> ALTER TABLE t1 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (2.99 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

Não é necessário que o tablespace tenha sido referenciado quando a tabela foi originalmente criada; no entanto, o tablespace deve ser referenciado pelo `ALTER TABLE`:

```
mysql> CREATE TABLE t2 (c1 INT) ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.00 sec)

mysql> ALTER TABLE t2 STORAGE DISK;
ERROR 1005 (HY000): Can't create table 'c.#sql-1750_3' (errno: 140)
mysql> ALTER TABLE t2 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (3.42 sec)
Records: 0  Duplicates: 0  Warnings: 0
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t2` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

Para alterar o tipo de armazenamento de uma coluna individual, você pode usar `ALTER TABLE ... MODIFY [COLUMN]`. Por exemplo, suponha que você crie uma tabela de dados de disco de clúster NDB com duas colunas, usando esta declaração `CREATE TABLE`:

```
mysql> CREATE TABLE t3 (c1 INT, c2 INT)
    ->     TABLESPACE ts_1 STORAGE DISK ENGINE NDB;
Query OK, 0 rows affected (1.34 sec)
```

Para alterar a coluna `c2` de armazenamento baseado em disco para armazenamento em memória, inclua uma cláusula de MEMÓRIA DE ARQUIVO na definição da coluna usada pelo comando ALTER TABLE, conforme mostrado aqui:

```
mysql> ALTER TABLE t3 MODIFY c2 INT STORAGE MEMORY;
Query OK, 0 rows affected (3.14 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode transformar uma coluna de memória em uma coluna baseada em disco usando `STORAGE DISK` de uma maneira semelhante.

A coluna `c1` utiliza armazenamento baseado em disco, uma vez que essa é a opção padrão para a tabela (determinada pela cláusula de nível de tabela `STORAGE DISK` na declaração `CREATE TABLE`). No entanto, a coluna `c2` utiliza armazenamento em memória, como pode ser visto aqui na saída do comando SHOW [`CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement")]:

```
mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) /*!50120 STORAGE MEMORY */ DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.02 sec)
```

Quando você adiciona uma coluna `AUTO_INCREMENT`, os valores da coluna são preenchidos automaticamente com números de sequência. Para as tabelas `MyISAM`, você pode definir o primeiro número de sequência executando `SET INSERT_ID=value` antes de `ALTER TABLE` ou usando a opção da tabela `AUTO_INCREMENT=value`.

Com as tabelas `MyISAM`, se você não alterar a coluna `AUTO_INCREMENT`, o número de sequência não será afetado. Se você excluir uma coluna `AUTO_INCREMENT` e, em seguida, adicionar outra coluna `AUTO_INCREMENT`, os números serão resequenciados, começando com o número 1.

Quando a replicação é usada, adicionar uma coluna `AUTO_INCREMENT` a uma tabela pode não produzir a mesma ordem das linhas na replica e na fonte. Isso ocorre porque a ordem em que as linhas são numeradas depende do motor de armazenamento específico usado para a tabela e da ordem em que as linhas foram inseridas. Se é importante ter a mesma ordem na fonte e na replica, as linhas devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Supondo que você queira adicionar uma coluna `AUTO_INCREMENT` à tabela `t1`, as seguintes declarações produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

```
CREATE TABLE t2 (id INT AUTO_INCREMENT PRIMARY KEY)
SELECT * FROM t1 ORDER BY col1, col2;
```

Isso pressupõe que a tabela `t1` tenha as colunas `col1` e `col2`.

Este conjunto de declarações também produz uma nova tabela `t2` idêntica a `t1`, com a adição de uma coluna `AUTO_INCREMENT`:

```
CREATE TABLE t2 LIKE t1;
ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
```

Importante

Para garantir a mesma ordem tanto na fonte quanto na replica, *todas* as colunas de `t1` devem ser referenciadas na cláusula `ORDER BY`.

Independentemente do método usado para criar e povoar a cópia com a coluna `AUTO_INCREMENT`, a etapa final é descartar a tabela original e, em seguida, renomear a cópia:

```
DROP TABLE t1;
ALTER TABLE t2 RENAME t1;
```

### 15.1.10 Declaração ALTER TABLESPACE

```
ALTER [UNDO] TABLESPACE tablespace_name
  NDB only:
    {ADD | DROP} DATAFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
  InnoDB and NDB:
    [RENAME TO tablespace_name]
  InnoDB only:
    [AUTOEXTEND_SIZE [=] 'value']
    [SET {ACTIVE | INACTIVE}]
    [ENCRYPTION [=] {'Y' | 'N'}]
  InnoDB and NDB:
    [ENGINE [=] engine_name]
  Reserved for future use:
    [ENGINE_ATTRIBUTE [=] 'string']
```

Esta declaração é usada com os espaços de tabelas `NDB` e `InnoDB`. Pode ser usada para adicionar um novo arquivo de dados a, ou para descartar um arquivo de dados de um espaço de tabelas `NDB`. Também pode ser usada para renomear um espaço de dados de disco de NDB Cluster, renomear um espaço de tabelas geral `InnoDB`, criptografar um espaço de tabelas geral `InnoDB`, ou marcar um espaço de tabelas de desfazer `InnoDB` como ativo ou inativo.

A palavra-chave `UNDO`, introduzida no MySQL 8.0.14, é usada com a cláusula `SET {ACTIVE | INACTIVE}` para marcar um espaço de tabela de desfazer `InnoDB` como ativo ou inativo. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Tabela de Desfazer”.

A variante `ADD DATAFILE` permite especificar um tamanho inicial para um espaço de dados de disco `NDB` usando uma cláusula `INITIAL_SIZE`, onde *`size`* é medido em bytes; o valor padrão é 134217728 (128 MB). Você pode, opcionalmente, seguir *`size`* com uma abreviação de uma ordem de magnitude, semelhante àquelas usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes).

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` é arredondado, explicitamente, como para `CREATE TABLESPACE`.

Uma vez que um arquivo de dados tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados a um espaço de tabelas NDB usando declarações adicionais `ALTER TABLESPACE ... ADD DATAFILE`.

Quando o `ALTER TABLESPACE ... ADD DATAFILE` é usado com o `ENGINE = NDB`, um arquivo de dados é criado em cada nó de dados do Cluster, mas apenas uma linha é gerada na tabela do Esquema de Informação `FILES`. Consulte a descrição desta tabela, bem como a Seção 25.6.11.1, “Objetos de Dados de Disco do Cluster NDB”, para obter mais informações. O `ADD DATAFILE` não é suportado com os espaços de tabelas `InnoDB`.

Usando `DROP DATAFILE` com `ALTER TABLESPACE`, o arquivo de dados '*`file_name`*' é excluído de um espaço de tabelas NDB. Não é possível excluir um arquivo de dados de um espaço de tabelas que esteja sendo usado por qualquer tabela; em outras palavras, o arquivo de dados deve estar vazio (sem extensões utilizadas). Veja a Seção 25.6.11.1, “Objetos de dados de disco do cluster NDB”. Além disso, qualquer arquivo de dados que será excluído deve ter sido previamente adicionado ao espaço de tabelas com `CREATE TABLESPACE` ou `ALTER TABLESPACE`. `DROP DATAFILE` não é suportado com espaços de tabelas `InnoDB`.

`WAIT` é analisado, mas ignorado, pois é destinado para expansão futura.

A cláusula `ENGINE`, que especifica o mecanismo de armazenamento usado pelo tablespace, é desatualizada; espera-se que ela seja removida em uma versão futura. O mecanismo de armazenamento do tablespace é conhecido pelo dicionário de dados, tornando a cláusula `ENGINE` obsoleta. Se o mecanismo de armazenamento for especificado, ele deve corresponder ao mecanismo de armazenamento do tablespace definido no dicionário de dados. Os únicos valores para *`engine_name`* compatíveis com os tablespaces `NDB` são `NDB` e `NDBCLUSTER`.

As operações `RENAME TO` são realizadas implicitamente no modo `autocommit`, independentemente da configuração do `autocommit`.

Uma operação `RENAME TO` não pode ser realizada enquanto `LOCK TABLES` ou `FLUSH TABLES WITH READ LOCK` (flush.html "15.7.8.3 FLUSH Statement") está em vigor para tabelas que residem no espaço de tabelas.

As chaves de bloqueio de metadados exclusivas são aplicadas em tabelas que residem em um espaço de tabelas geral enquanto o espaço de tabelas é renomeado, o que impede a DDL concorrente. O DML concorrente é suportado.

O privilégio `CREATE TABLESPACE` é necessário para renomear um espaço de tabela geral `InnoDB`.

A opção `AUTOEXTEND_SIZE` define a quantidade pela qual `InnoDB` estende o tamanho de um espaço de tabela quando ele se torna cheio. Introduzido no MySQL 8.0.23. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o espaço de tabela seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração do tamanho AUTOEXTEND_SIZE do espaço de tabela”.

A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para um espaço de tabelas geral `InnoDB` ou o espaço de tabelas do sistema `mysql`. O suporte à criptografia para espaços de tabelas gerais foi introduzido no MySQL 8.0.13. O suporte à criptografia para o espaço de tabelas do sistema `mysql` foi introduzido no MySQL 8.0.16.

Um plugin de chave de acesso deve ser instalado e configurado antes que a criptografia possa ser habilitada.

A partir do MySQL 8.0.16, se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para alterar um espaço de tabela geral com uma definição da cláusula `ENCRYPTION` que difere da definição do `default_table_encryption`.

A habilitação da criptografia para um espaço de tabelas geral falha se qualquer tabela no espaço de tabelas pertencer a um esquema definido com [`DEFAULT ENCRYPTION='N'`](create-database.html "15.1.12 CREATE DATABASE Statement"). Da mesma forma, a desativação da criptografia falha se qualquer tabela no espaço de tabelas geral pertencer a um esquema definido com [`DEFAULT ENCRYPTION='Y'`](create-database.html "15.1.12 CREATE DATABASE Statement"). A opção de esquema [`DEFAULT ENCRYPTION`](create-database.html "15.1.12 CREATE DATABASE Statement") foi introduzida no MySQL 8.0.16.

Se uma declaração `ALTER TABLESPACE` executada em um espaço de tabela geral não incluir uma cláusula `ENCRYPTION`, o espaço de tabela mantém seu status de criptografia atual, independentemente da configuração `default_table_encryption`.

Quando um espaço de tabela geral ou o espaço de tabela do sistema `mysql` é criptografado, todas as tabelas que residem no espaço de tabela são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabela criptografado é criptografada.

O algoritmo `INPLACE` é utilizado ao alterar o atributo `ENCRYPTION` de um espaço de tabela geral ou do espaço de tabelas do sistema `mysql`. O algoritmo `INPLACE` permite DML concorrente em tabelas que residem no espaço de tabela. O DDL concorrente é bloqueado.

Para mais informações, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”.

A opção `ENGINE_ATTRIBUTE` (disponível a partir do MySQL 8.0.21) é usada para especificar atributos do espaço de tabela para os motores de armazenamento primário. A opção é reservada para uso futuro.

Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

```
ALTER TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
```

Os valores de `ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Neste caso, o último valor especificado é utilizado.

Os valores de `ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

Não é permitido alterar um elemento individual de um valor de atributo JSON. Você só pode adicionar ou substituir um atributo.

### 15.1.11 Declaração de ALTER VIEW

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

Essa declaração altera a definição de uma visão, que deve existir. A sintaxe é semelhante àquela para `CREATE VIEW` (create-view.html "15.1.23 CREATE VIEW Statement") veja Seção 15.1.23, “Declaração CREATE VIEW”). Essa declaração requer os privilégios `CREATE VIEW` e `DROP` para a visão, e alguns privilégios para cada coluna referenciada na declaração `SELECT`. `ALTER VIEW` é permitido apenas ao definidor ou usuários com o privilégio `SET_USER_ID` (ou o privilégio descontinuado `SUPER`).

### 15.1.12 Declaração CREATE DATABASE

```
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
  | ENCRYPTION [=] {'Y' | 'N'}
}
```

`CREATE DATABASE` cria um banco de dados com o nome dado. Para usar esta declaração, você precisa do privilégio `CREATE` para o banco de dados. [`CREATE SCHEMA`(create-database.html "15.1.12 CREATE DATABASE Statement") é sinônimo de [`CREATE DATABASE`(create-database.html "15.1.12 CREATE DATABASE Statement")].

Um erro ocorre se o banco de dados existir e você não especificar `IF NOT EXISTS`.

`CREATE DATABASE` não é permitido em uma sessão que tenha uma declaração ativa `LOCK TABLES`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements").

Cada *`create_option`* especifica uma característica de banco de dados. As características de banco de dados são armazenadas no dicionário de dados.

* A opção `CHARACTER SET` especifica o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` especifica a agregação padrão do banco de dados. Para informações sobre os nomes dos conjuntos de caracteres e agregações, consulte o Capítulo 12, * Conjuntos de caracteres, agregações, Unicode*.

Para ver os conjuntos de caracteres e as codificações disponíveis, use as declarações `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 15.7.7.3, “Declaração SHOW CHARACTER SET”, e a Seção 15.7.7.4, “Declaração SHOW COLLATION”.

A opção `ENCRYPTION`, introduzida no MySQL 8.0.16, define a criptografia padrão do banco de dados, que é herdada por tabelas criadas no banco de dados. Os valores permitidos são `'Y'` (criptografia habilitada) e `'N'` (criptografia desativada). Se a opção `ENCRYPTION` não for especificada, o valor da variável de sistema `default_table_encryption` define a criptografia padrão do banco de dados. Se a variável de sistema `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para especificar uma configuração de criptografia padrão que difere da configuração `default_table_encryption`. Para mais informações, consulte Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabela Geral.

Um banco de dados no MySQL é implementado como um diretório que contém arquivos que correspondem a tabelas no banco de dados. Como não há tabelas em um banco de dados quando ele é criado inicialmente, a declaração `CREATE DATABASE` cria apenas um diretório sob o diretório de dados do MySQL. As regras para nomes de bancos de dados permitidos são dadas na Seção 11.2, “Nomes de Objetos do Esquema”. Se um nome de banco de dados contiver caracteres especiais, o nome do diretório do banco de dados contém versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”.

Criar um diretório de banco de dados criando manualmente um diretório sob o diretório de dados (por exemplo, com **mkdir**) não é suportado no MySQL 8.0.

Quando você criar um banco de dados, deixe o servidor gerenciar o diretório e os arquivos nele. Manipular diretórios e arquivos de banco de dados diretamente pode causar inconsistências e resultados inesperados.

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

Você também pode usar o programa **mysqladmin** para criar bancos de dados. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

### 15.1.13 Declaração de Criação de Evento

```
CREATE
    [DEFINER = user]
    EVENT
    [IF NOT EXISTS]
    event_name
    ON SCHEDULE schedule
    [ON COMPLETION [NOT] PRESERVE]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    DO event_body;

schedule: {
    AT timestamp [+ INTERVAL interval] ...
  | EVERY interval
    [STARTS timestamp [+ INTERVAL interval] ...]
    [ENDS timestamp [+ INTERVAL interval] ...]
}

interval:
    quantity {YEAR | QUARTER | MONTH | DAY | HOUR | MINUTE |
              WEEK | SECOND | YEAR_MONTH | DAY_HOUR | DAY_MINUTE |
              DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND}
```

Essa declaração cria e agrupa um novo evento. O evento não é executado a menos que o Agendamento de Eventos esteja habilitado. Para obter informações sobre como verificar o status do Agendamento de Eventos e habilitá-lo, se necessário, consulte a Seção 27.4.2, “Configuração do Agendamento de Eventos”.

`CREATE EVENT` exige o privilégio `EVENT` para o esquema no qual o evento deve ser criado. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 27.6, “Controle de Acesso a Objeto Armazenado”.

Os requisitos mínimos para uma declaração válida `CREATE EVENT`(create-event.html "15.1.13 CREATE EVENT Statement") são os seguintes:

* As palavras-chave `CREATE EVENT` mais o nome de um evento, que identifica de forma única o evento em um esquema de banco de dados.

* Uma cláusula `ON SCHEDULE`, que determina quando e com que frequência o evento é executado.

* Uma cláusula `DO`, que contém a declaração SQL a ser executada por um evento.

Este é um exemplo de uma declaração mínima `CREATE EVENT`(create-event.html "15.1.13 CREATE EVENT Statement"):

```
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A declaração anterior cria um evento chamado `myevent`. Esse evento é executado uma vez — uma hora após sua criação — executando uma declaração SQL que incrementa o valor da coluna `mycol` da tabela `myschema.mytable` em 1.

O *`event_name`* deve ser um identificador válido do MySQL com um comprimento máximo de 64 caracteres. Os nomes dos eventos não são sensíveis ao caso, portanto, não é possível ter dois eventos com os nomes `myevent` e `MyEvent` no mesmo esquema. Em geral, as regras que regem os nomes dos eventos são as mesmas que as que regem os nomes das rotinas armazenadas. Veja a Seção 11.2, “Nomes de Objetos do Esquema”.

Um evento está associado a um esquema. Se nenhum esquema for indicado como parte de *`event_name`*, o esquema padrão (atual) é assumido. Para criar um evento em um esquema específico, qualifique o nome do evento com um esquema usando a sintaxe `schema_name.event_name`.

A cláusula `DEFINER` especifica a conta do MySQL a ser usada ao verificar os privilégios de acesso no momento da execução do evento. Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança do evento.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE EVENT`(create-event.html "15.1.13 CREATE EVENT Statement"). Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro do corpo de um evento, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da execução do evento, que é o usuário `DEFINER`. Para informações sobre auditoria de usuários dentro de eventos, consulte a Seção 8.2.23, “Auditorização de atividade de conta baseada em SQL”.

`IF NOT EXISTS` tem o mesmo significado para `CREATE EVENT` e para `CREATE TABLE`: Se um evento chamado *`event_name`* já existir no mesmo esquema, nenhuma ação é realizada e não há erro. (No entanto, em tais casos, é gerado um aviso.)

A cláusula `ON SCHEDULE` determina quando, com que frequência e por quanto tempo o *`event_body`* definido para o evento se repete. Essa cláusula assume uma das duas formas:

* `AT timestamp` é usado para um evento único. Especifica que o evento é executado apenas uma vez na data e hora fornecidas por *`timestamp`*, que deve incluir tanto a data quanto a hora, ou deve ser uma expressão que resolva em um valor datetime. Você pode usar um valor do tipo `DATETIME` ou `TIMESTAMP` para esse propósito. Se a data estiver no passado, uma mensagem de aviso ocorre, como mostrado aqui:

  ```
  mysql> SELECT NOW();
  +---------------------+
  | NOW()               |
  +---------------------+
  | 2006-02-10 23:59:01 |
  +---------------------+
  1 row in set (0.04 sec)

  mysql> CREATE EVENT e_totals
      ->     ON SCHEDULE AT '2006-02-10 23:59:00'
      ->     DO INSERT INTO test.totals VALUES (NOW());
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1588
  Message: Event execution time is in the past and ON COMPLETION NOT
           PRESERVE is set. The event was dropped immediately after
           creation.
  ```

As declarações `CREATE EVENT` que, por qualquer motivo, são inválidas, falham com um erro.

Você pode usar `CURRENT_TIMESTAMP` para especificar a data e hora atuais. Nesse caso, o evento é executado assim que é criado.

Para criar um evento que ocorra em algum momento no futuro em relação à data e hora atuais, como a expressão "três semanas a partir de agora", você pode usar a cláusula opcional `+ INTERVAL interval`. A parte *`interval`* consiste em duas partes, uma quantidade e uma unidade de tempo, e segue as regras de sintaxe descritas em Intervalos Temporais, exceto que você não pode usar nenhuma palavra-chave de unidade que envolva microssegundos ao definir um evento. Com alguns tipos de intervalo, unidades de tempo complexas podem ser usadas. Por exemplo, "dois minutos e dez segundos" pode ser expresso como `+ INTERVAL '2:10' MINUTE_SECOND`.

Você também pode combinar intervalos. Por exemplo, `AT CURRENT_TIMESTAMP + INTERVAL 3 WEEK + INTERVAL 2 DAY` é equivalente a “três semanas e dois dias a partir de agora”. Cada parte de uma cláusula desse tipo deve começar com `+ INTERVAL`.

* Para repetir ações em um intervalo regular, use uma cláusula `EVERY`. A palavra-chave `EVERY` é seguida por um *`interval`* como descrito na discussão anterior da palavra-chave `AT`. (`+ INTERVAL` (*não*) é usado com `EVERY`.)* Por exemplo, `EVERY 6 WEEK` significa “a cada seis semanas”.

Embora as cláusulas `+ INTERVAL` não sejam permitidas em uma cláusula `EVERY`, você pode usar as mesmas unidades de tempo complexas permitidas em uma `+ INTERVAL`.

Uma cláusula `EVERY` pode conter uma cláusula opcional `STARTS`. `STARTS` é seguida por um valor *`timestamp`* que indica quando a ação deve começar a se repetir, e também pode usar `+ INTERVAL interval` para especificar um período de tempo “a partir de agora”. Por exemplo, `EVERY 3 MONTH STARTS CURRENT_TIMESTAMP + INTERVAL 1 WEEK` significa “a cada três meses, começando uma semana a partir de agora”. Da mesma forma, você pode expressar “a cada duas semanas, começando seis horas e quinze minutos a partir de agora” como `EVERY 2 WEEK STARTS CURRENT_TIMESTAMP

+ INTERVAL '6:15' HOUR_MINUTE`. Not specifying `STARTS` is the same as using `STARTS CURRENT_TIMESTAMP—ou seja, a ação especificada para o evento começa a se repetir imediatamente após a criação do evento.

Uma cláusula `EVERY` pode conter uma cláusula opcional `ENDS`. A palavra-chave `ENDS` é seguida por um valor *`timestamp`* que indica ao MySQL quando o evento deve parar de se repetir. Você também pode usar `+ INTERVAL interval` com `ENDS`; por exemplo, `EVERY 12 HOUR STARTS CURRENT_TIMESTAMP + INTERVAL 30 MINUTE ENDS CURRENT_TIMESTAMP + INTERVAL 4 WEEK` é equivalente a “a cada doze horas, começando trinta minutos a partir de agora e terminando quatro semanas a partir de agora”. Não usar `ENDS` significa que o evento continua sendo executado indefinidamente.

`ENDS` suporta a mesma sintaxe para unidades de tempo complexas que `STARTS` faz.

Você pode usar `STARTS`, `ENDS`, ambos ou nenhum deles em uma cláusula `EVERY`.

Se um evento repetitivo não terminar dentro do seu intervalo de programação, o resultado pode ser várias instâncias do evento executando simultaneamente. Se isso não for desejado, você deve instituir um mecanismo para impedir instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()` ou o bloqueio de linha ou tabela.

A cláusula `ON SCHEDULE` pode utilizar expressões que envolvam funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Você não pode usar funções armazenadas ou funções carregáveis nessas expressões, nem pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as declarações `CREATE EVENT` quanto `ALTER EVENT`. Referências a funções armazenadas, funções carregáveis e tabelas, nesses casos, não são especificamente permitidas e falham com um erro (veja o Bug #22830).

Os horários na cláusula `ON SCHEDULE` são interpretados usando o valor atual da sessão `time_zone`. Isso se torna o fuso horário do evento; ou seja, o fuso horário que é usado para a programação de eventos e que está em vigor dentro do evento conforme ele é executado. Esses horários são convertidos para UTC e armazenados internamente junto com o fuso horário do evento. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. Para informações adicionais sobre a representação dos horários dos eventos, consulte a Seção 27.4.4, “Metadados do Evento”. Veja também a Seção 15.7.7.18, “Declaração SHOW EVENTS”, e a Seção 28.3.14, “A Tabela INFORMATION_SCHEMA EVENTS”.

Normalmente, uma vez que um evento tenha expirado, ele é imediatamente descartado. Você pode sobrepor esse comportamento especificando `ON COMPLETION PRESERVE`. Usando `ON COMPLETION NOT PRESERVE`, apenas torna o comportamento não persistente padrão explícito.

Você pode criar um evento, mas impedir que ele seja ativo usando a palavra-chave `DISABLE`. Alternativamente, você pode usar `ENABLE` para tornar explícito o status padrão, que é ativo. Isso é mais útil em conjunto com `ALTER EVENT` (consulte Seção 15.1.3, “Instrução ALTER EVENT”).

Um terceiro valor também pode aparecer no lugar de `ENABLE` ou `DISABLE`; `DISABLE ON SLAVE` é definido para o status de um evento em uma réplica para indicar que o evento foi criado no servidor de origem da replicação e replicado para a réplica, mas não é executado na réplica. Veja a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Você pode fornecer um comentário para um evento usando uma cláusula `COMMENT`. *`comment`* pode ser qualquer string de até 64 caracteres que você deseja usar para descrever o evento. O texto do comentário, sendo uma literal de string, deve ser rodeado por aspas.

A cláusula `DO` especifica uma ação realizada pelo evento e consiste em uma declaração SQL. Quase qualquer declaração válida do MySQL que possa ser usada em uma rotina armazenada também pode ser usada como a declaração de ação para um evento agendado. (Veja a Seção 27.8, “Restrições em Programas Armazenados”.) Por exemplo, o seguinte evento `e_hourly` exclui todas as linhas da tabela `sessions` uma vez por hora, onde esta tabela faz parte do esquema `site_activity`:

```
CREATE EVENT e_hourly
    ON SCHEDULE
      EVERY 1 HOUR
    COMMENT 'Clears out sessions table each hour.'
    DO
      DELETE FROM site_activity.sessions;
```

O MySQL armazena a configuração da variável de sistema `sql_mode` em vigor quando um evento é criado ou alterado, e sempre executa o evento com essa configuração em vigor, * independentemente do modo SQL do servidor atual quando o evento começa a ser executado*.

Uma declaração `CREATE EVENT` que contém uma declaração `ALTER EVENT` na sua cláusula `DO` parece ter sucesso; no entanto, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Nota

Declarações como `SELECT` ou `SHOW` que simplesmente retornam um conjunto de resultados não têm efeito quando usadas em um evento; a saída dessas declarações não é enviada para o Monitor MySQL, nem é armazenada em nenhum lugar. No entanto, você pode usar declarações como `SELECT ... INTO`(select.html "15.2.13 SELECT Statement") e `INSERT INTO ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") que armazenam um resultado. (Veja o próximo exemplo nesta seção para uma instância do último.)

O esquema ao qual um evento pertence é o esquema padrão para referências de tabela na cláusula `DO`. Quaisquer referências a tabelas em outros esquemas devem ser qualificadas com o nome do esquema apropriado.

Assim como nas rotinas armazenadas, você pode usar a sintaxe de declaração composta na cláusula `DO` usando as palavras-chave `BEGIN` e `END`, conforme mostrado aqui:

```
delimiter |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

delimiter ;
```

Este exemplo usa o comando `delimiter` para alterar o delimitador de declaração. Veja a Seção 27.1, “Definindo programas armazenados”.

É possível criar declarações compostas mais complexas, como as utilizadas em rotinas armazenadas, em um evento. Este exemplo utiliza variáveis locais, um manipulador de erro e uma construção de controle de fluxo:

```
delimiter |

CREATE EVENT e
    ON SCHEDULE
      EVERY 5 SECOND
    DO
      BEGIN
        DECLARE v INTEGER;
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;

        SET v = 0;

        WHILE v < 5 DO
          INSERT INTO t1 VALUES (0);
          UPDATE t2 SET s1 = s1 + 1;
          SET v = v + 1;
        END WHILE;
    END |

delimiter ;
```

Não é possível passar parâmetros diretamente para ou a partir de eventos; no entanto, é possível invocar uma rotina armazenada com parâmetros dentro de um evento:

```
CREATE EVENT e_call_myproc
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO CALL myproc(5, 27);
```

Se o definidor de um evento tiver privilégios suficientes para definir variáveis de sistema global (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”), o evento pode ler e escrever variáveis globais. Como a concessão desses privilégios implica em um potencial de abuso, é necessário ter extremo cuidado ao fazê-lo.

Geralmente, quaisquer declarações que sejam válidas em rotinas armazenadas podem ser usadas para declarações de ação executadas por eventos. Para mais informações sobre declarações permitidas dentro de rotinas armazenadas, consulte a Seção 27.2.1, “Sintaxe de Rotina Armazenada”. Não é possível criar um evento como parte de uma rotina armazenada ou criar um evento por outro evento.

### 15.1.14 Declaração de Função CREATE

### 15.1.15 Declarar uma Função
### 15.1.16 Chamar uma Função
### 15.1.17 Remover uma Função
### 15.1.18 Alterar o Nome de uma Função
### 15.1.19 Remover uma Função de uma Tabela
### 15.1.20 Alterar o Nome de uma Função de uma Tabela
### 15.1.21 Remover uma Função de uma Tabela
### 15.1.22 Alterar o Nome de uma Função de uma Tabela

A declaração `CREATE FUNCTION` é usada para criar funções armazenadas e funções carregáveis:

* Para informações sobre a criação de funções armazenadas, consulte a Seção 15.1.17, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.

* Para informações sobre a criação de funções carregáveis, consulte a Seção 15.7.4.1, “Instrução CREATE FUNCTION para Funções Carregáveis”.

### 15.1.15 Declaração CREATE INDEX

```
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  | ENGINE_ATTRIBUTE [=] 'string'
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

Normalmente, você cria todos os índices em uma tabela no momento em que a própria tabela é criada com `CREATE TABLE` (create-table.html "15.1.20 CREATE TABLE Statement"). Veja a Seção 15.1.20, “Declaração CREATE TABLE”. Esta diretriz é especialmente importante para as tabelas `InnoDB`, onde a chave primária determina o layout físico das linhas no arquivo de dados. `CREATE INDEX` permite que você adicione índices a tabelas existentes.

`CREATE INDEX` é mapeado para uma declaração `ALTER TABLE` para criar índices. Veja a Seção 15.1.9, “Declaração ALTER TABLE”. `CREATE INDEX` não pode ser usado para criar um `PRIMARY KEY`; use `ALTER TABLE` em vez disso. Para mais informações sobre índices, veja a Seção 10.3.1, “Como o MySQL usa índices”.

`InnoDB` suporta índices secundários em colunas virtuais. Para mais informações, consulte a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

Quando a configuração `innodb_stats_persistent` estiver habilitada, execute a instrução `ANALYZE TABLE` (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") para uma tabela `InnoDB` após criar um índice nessa tabela.

Começando com o MySQL 8.0.17, o *`expr`* para uma especificação *`key_part`* pode assumir a forma `(CAST json_expression AS type ARRAY)` para criar um índice de múltiplos valores em uma coluna `JSON`. Veja Índices de Múltiplos Valores.

Uma especificação de índice na forma `(key_part1, key_part2, ...)` cria um índice com várias partes de chave. Os valores da chave do índice são formados pela concatenação dos valores das partes de chave fornecidas. Por exemplo, `(col1, col2, col3)` especifica um índice de múltiplos colunas com chaves de índice consistindo em valores de `col1`, `col2` e `col3`.

Uma especificação *`key_part`* pode terminar com `ASC` ou `DESC` para especificar se os valores do índice são armazenados em ordem crescente ou decrescente. O padrão é crescente se nenhum especificador de ordem for fornecido. `ASC` e `DESC` não são permitidos para índices `HASH`. `ASC` e `DESC` também não são suportados para índices de múltiplos valores. A partir do MySQL 8.0.12, `ASC` e `DESC` não são permitidos para índices `SPATIAL`.

As seções a seguir descrevem diferentes aspectos da declaração `CREATE INDEX`:

* Prefix de coluna Chaves de partes
* Chaves funcionais de partes
* Índices únicos
* Índices de texto completo
* Índices de múltiplos valores
* Índices espaciais
* Opções de índice
* Opções de cópia e bloqueio de tabela

#### Coluna Prefixo Chave Peças Essenciais

Para colunas de texto, é possível criar índices que utilizem apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice:

* Prefixos podem ser especificados para as partes principais `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

* Os prefixos *devem* ser especificados para as partes de chave `BLOB` e `TEXT`. Além disso, as colunas `BLOB` e `TEXT` podem ser indexadas apenas para as tabelas `InnoDB`, `MyISAM` e `BLACKHOLE`.

* Os prefixos *limites* são medidos em bytes. No entanto, os prefixos *longos* para especificações de índice nas declarações de `CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"), `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em conta ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

O suporte a prefixos e as comprimentos dos prefixos (quando suportados) dependem do mecanismo de armazenamento. Por exemplo, um prefixo pode ter até 767 bytes de comprimento para as tabelas `InnoDB` que utilizam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para as tabelas `InnoDB` que utilizam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para as tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes. O mecanismo de armazenamento `NDB` não suporta prefixos (consulte a Seção 25.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”).

Se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, `CREATE INDEX` trata o índice da seguinte forma:

* Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver habilitado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dados da coluna e uma advertência é gerada (se o modo SQL rigoroso não estiver habilitado).

* Para um índice único, ocorre um erro independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

A declaração mostrada aqui cria um índice usando os primeiros 10 caracteres da coluna `name` (assumindo que `name` tenha um tipo de string não binária):

```
CREATE INDEX part_of_name ON customer (name(10));
```

Se os nomes na coluna geralmente diferirem nos primeiros 10 caracteres, as pesquisas realizadas usando este índice não devem ser muito mais lentas do que usando um índice criado a partir de toda a coluna `name`. Além disso, usar prefixos de coluna para índices pode tornar o arquivo do índice muito menor, o que pode economizar muito espaço em disco e também acelerar as operações do `INSERT`.

#### Peças-chave funcionais

Um índice “normal” indexa os valores das colunas ou prefixos dos valores das colunas. Por exemplo, na tabela a seguir, a entrada do índice para uma determinada linha `t1` inclui o valor completo `col1` e um prefixo do valor `col2`, consistindo em seus primeiros 10 caracteres:

```
CREATE TABLE t1 (
  col1 VARCHAR(10),
  col2 VARCHAR(20),
  INDEX (col1, col2(10))
);
```

O MySQL 8.0.13 e versões posteriores suportam partes de chave funcional que indexam valores de expressão em vez de valores de coluna ou prefixo de coluna. O uso de partes de chave funcional permite a indexação de valores que não são armazenados diretamente na tabela. Exemplos:

```
CREATE TABLE t1 (col1 INT, col2 INT, INDEX func_index ((ABS(col1))));
CREATE INDEX idx1 ON t1 ((col1 + col2));
CREATE INDEX idx2 ON t1 ((col1 + col2), (col1 - col2), col1);
ALTER TABLE t1 ADD INDEX ((col1 * 40) DESC);
```

Um índice com várias partes-chave pode misturar partes-chave não funcionais e funcionais.

`ASC` e `DESC` são suportados para peças-chave funcionais.

As partes-chave funcionais devem seguir as regras a seguir. Um erro ocorre se uma definição de parte-chave contiver construções não permitidas.

* Nas definições de índice, coloque expressões entre parênteses para distingui-las de colunas ou prefixos de coluna. Por exemplo, isso é permitido; as expressões estão encerradas entre parênteses:

  ```
  INDEX ((col1 + col2), (col3 - col4))
  ```

Isso produz um erro; as expressões não estão encerradas entre parênteses:

  ```
  INDEX (col1 + col2, col3 - col4)
  ```

* Uma chave funcional não pode consistir exclusivamente em um nome de coluna. Por exemplo, isso não é permitido:

  ```
  INDEX ((col1), (col2))
  ```

Em vez disso, escreva as partes-chave como partes-chave não funcionais, sem parênteses:

  ```
  INDEX (col1, col2)
  ```

* Uma expressão de chave funcional não pode se referir a prefixos de coluna. Para uma solução alternativa, consulte a discussão de `SUBSTRING()` e `CAST()` mais adiante nesta seção.

* As partes-chave funcionais não são permitidas nas especificações de chave estrangeira.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as partes de chave funcional da tabela original.

Os índices funcionais são implementados como colunas virtuais ocultas geradas, o que tem essas implicações:

* Cada peça funcional da chave conta contra o limite do número total de colunas da tabela; consulte a Seção 10.4.7, “Limites sobre o número de colunas da tabela e tamanho da linha”.

* As partes-chave funcionais herdam todas as restrições que se aplicam às colunas geradas. Exemplos:

+ Apenas as funções permitidas para colunas geradas são permitidas para partes de chave funcional.

+ Subconsultas, parâmetros, variáveis, funções armazenadas e funções carregáveis não são permitidos.

Para mais informações sobre as restrições aplicáveis, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”, e a Seção 15.1.9.2, “ALTER TABLE e Colunas Geradas”.

* A própria coluna gerada virtualmente não requer armazenamento. O próprio índice ocupa espaço de armazenamento como qualquer outro índice.

`UNIQUE` é suportado para índices que incluem partes de chave funcional. No entanto, as chaves primárias não podem incluir partes de chave funcional. Uma chave primária exige que a coluna gerada seja armazenada, mas as partes de chave funcional são implementadas como colunas geradas virtuais, não colunas geradas armazenadas.

Os índices `SPATIAL` e `FULLTEXT` não podem ter partes de chave funcional.

Se uma tabela não contiver uma chave primária, o `InnoDB` automaticamente promove o primeiro índice `UNIQUE NOT NULL` à chave primária. Isso não é suportado para índices `UNIQUE NOT NULL` que possuem partes de chave funcional.

Os índices não funcionais alertam se houver índices duplicados. Os índices que contêm partes de chave funcional não possuem essa característica.

Para remover uma coluna que é referenciada por uma parte da chave funcional, o índice deve ser removido primeiro. Caso contrário, ocorrerá um erro.

Embora as partes de chave não funcionais suportem uma especificação de comprimento de prefixo, isso não é possível para as partes de chave funcionais. A solução é usar `SUBSTRING()` (ou `CAST()`, conforme descrito mais adiante nesta seção). Para uma parte de chave funcional que contenha a função `SUBSTRING()` ser usada em uma consulta, a cláusula `WHERE` deve conter `SUBSTRING()` com os mesmos argumentos. No exemplo a seguir, apenas o segundo `SELECT` é capaz de usar o índice porque é a única consulta na qual os argumentos de `SUBSTRING()` correspondem à especificação do índice:

```
CREATE TABLE tbl (
  col1 LONGTEXT,
  INDEX idx1 ((SUBSTRING(col1, 1, 10)))
);
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 9) = '123456789';
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 10) = '1234567890';
```

As partes-chave funcionais permitem a indexação de valores que não podem ser indexados de outra forma, como os valores `JSON`. No entanto, isso deve ser feito corretamente para obter o efeito desejado. Por exemplo, essa sintaxe não funciona:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((data->>'$.name'))
);
```

A sintaxe falha porque:

* O operador `->>` se traduz em `JSON_UNQUOTE(JSON_EXTRACT(...))`.

* `JSON_UNQUOTE()` retorna um valor com um tipo de dados de `LONGTEXT`, e a coluna gerada oculta é, portanto, atribuída ao mesmo tipo de dados.

* O MySQL não pode indexar as colunas `LONGTEXT` especificadas sem um comprimento de prefixo na parte da chave, e os comprimentos de prefixo não são permitidos em partes da chave funcional.

Para indexar a coluna `JSON`, você pode tentar usar a função `CAST()` da seguinte forma:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((CAST(data->>'$.name' AS CHAR(30))))
);
```

A coluna gerada oculta é atribuída ao tipo de dados `VARCHAR(30)`, que pode ser indexado. Mas essa abordagem gera um novo problema ao tentar usar o índice:

* `CAST()` retorna uma string com a correção de texto `utf8mb4_0900_ai_ci` (a correção de texto padrão do servidor).

* `JSON_UNQUOTE()` retorna uma string com a codificação `utf8mb4_bin` (codificada manualmente).

Como resultado, há uma incompatibilidade de correspondência entre a expressão indexada na definição de tabela anterior e a expressão da cláusula `WHERE` na consulta seguinte:

```
SELECT * FROM employees WHERE data->>'$.name' = 'James';
```

O índice não é usado porque as expressões na consulta e no índice diferem. Para suportar esse tipo de cenário para partes de chave funcional, o otimizador remove automaticamente `CAST()` ao procurar um índice a ser usado, mas *apenas* se a collation da expressão indexada corresponder à do da expressão da consulta. Para que uma parte de chave funcional seja usada em um índice, uma das duas soluções a seguir funciona (embora elas difiram em algum grau):

* Solução 1. Atribua à expressão indexada a mesma codificação de caracteres que `JSON_UNQUOTE()`:

  ```
  CREATE TABLE employees (
    data JSON,
    INDEX idx ((CAST(data->>"$.name" AS CHAR(30)) COLLATE utf8mb4_bin))
  );
  INSERT INTO employees VALUES
    ('{ "name": "james", "salary": 9000 }'),
    ('{ "name": "James", "salary": 10000 }'),
    ('{ "name": "Mary", "salary": 12000 }'),
    ('{ "name": "Peter", "salary": 8000 }');
  SELECT * FROM employees WHERE data->>'$.name' = 'James';
  ```

O operador `->>` é o mesmo que `JSON_UNQUOTE(JSON_EXTRACT(...))`, e `JSON_UNQUOTE()` retorna uma string com a collation `utf8mb4_bin`. A comparação, portanto, é sensível ao caso e apenas uma linha corresponde:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

* Solução 2. Especifique a expressão completa na consulta:

  ```
  CREATE TABLE employees (
    data JSON,
    INDEX idx ((CAST(data->>"$.name" AS CHAR(30))))
  );
  INSERT INTO employees VALUES
    ('{ "name": "james", "salary": 9000 }'),
    ('{ "name": "James", "salary": 10000 }'),
    ('{ "name": "Mary", "salary": 12000 }'),
    ('{ "name": "Peter", "salary": 8000 }');
  SELECT * FROM employees WHERE CAST(data->>'$.name' AS CHAR(30)) = 'James';
  ```

`CAST()` retorna uma string com a collation `utf8mb4_0900_ai_ci`, portanto, a comparação é case-insensitive e duas linhas correspondem:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "james", "salary": 9000}  |
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

Tenha em atenção que, embora o otimizador suporte a remoção automática de `CAST()` com colunas geradas indexadas, a abordagem seguinte não funciona porque produz um resultado diferente com e sem índice (Bug#27337092):

```
mysql> CREATE TABLE employees (
         data JSON,
         generated_col VARCHAR(30) AS (CAST(data->>'$.name' AS CHAR(30)))
       );
Query OK, 0 rows affected, 1 warning (0.03 sec)

mysql> INSERT INTO employees (data)
       VALUES ('{"name": "james"}'), ('{"name": "James"}');
Query OK, 2 rows affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 1

mysql> SELECT * FROM employees WHERE data->>'$.name' = 'James';
+-------------------+---------------+
| data              | generated_col |
+-------------------+---------------+
| {"name": "James"} | James         |
+-------------------+---------------+
1 row in set (0.00 sec)

mysql> ALTER TABLE employees ADD INDEX idx (generated_col);
Query OK, 0 rows affected, 1 warning (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 1

mysql> SELECT * FROM employees WHERE data->>'$.name' = 'James';
+-------------------+---------------+
| data              | generated_col |
+-------------------+---------------+
| {"name": "james"} | james         |
| {"name": "James"} | James         |
+-------------------+---------------+
2 rows in set (0.01 sec)
```

#### Índices Únicos

Um índice `UNIQUE` cria uma restrição de tal forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Se você especificar um valor prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo. Um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com um tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada nas declarações `SELECT`, conforme a seguir:

* `_rowid` refere-se à coluna `PRIMARY KEY` se houver um `PRIMARY KEY` composto por uma única coluna de número inteiro. Se houver um `PRIMARY KEY`, mas ele não consista em uma única coluna de número inteiro, `_rowid` não pode ser usado.

* Caso contrário, `_rowid` se refere à coluna no primeiro índice `UNIQUE NOT NULL` se esse índice consistir em uma única coluna de inteiro. Se o primeiro índice `UNIQUE NOT NULL` não consistir em uma única coluna de inteiro, `_rowid` não pode ser usado.

#### Índices de texto completo

Os índices `FULLTEXT` são suportados apenas para as tabelas `InnoDB` e `MyISAM` e podem incluir apenas as colunas `CHAR`, `VARCHAR` e `TEXT`. O indexação sempre ocorre sobre toda a coluna; a indexação com prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Consulte a Seção 14.9, “Funções de Pesquisa de Texto Completo”, para detalhes da operação.

#### Índices Multivalorados

A partir do MySQL 8.0.17, `InnoDB` suporta índices de múltiplos valores. Um índice de múltiplos valores é um índice secundário definido em uma coluna que armazena uma matriz de valores. Um índice “normal” tem um registro de índice para cada registro de dados (1:1). Um índice de múltiplos valores pode ter múltiplos registros de índice para um único registro de dados (N:1). Os índices de múltiplos valores são destinados à indexação de matrizes `JSON`. Por exemplo, um índice de múltiplos valores definido na matriz de códigos postais no seguinte documento JSON cria um registro de índice para cada código postal, com cada registro de índice referenciando o mesmo registro de dados.

```
{
    "user":"Bob",
    "user_id":31,
    "zipcode":[94477,94536]
}
```

##### Criando índices de múltiplos valores

Você pode criar um índice de múltiplos valores em uma declaração `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`. Isso requer o uso de `CAST(... AS ... ARRAY)` (cast-functions.html#function_cast) na definição do índice, que converte valores escalares do mesmo tipo em um `JSON` matriz em um array de tipos de dados SQL. Uma coluna virtual é então gerada de forma transparente com os valores na matriz de tipos de dados SQL; finalmente, um índice funcional (também referido como índice virtual) é criado na coluna virtual. É o índice funcional definido na coluna virtual dos valores da matriz de tipos de dados SQL que forma o índice de múltiplos valores.

Os exemplos na lista a seguir mostram as três diferentes maneiras pelas quais um índice multivalorado `zips` pode ser criado em um array `$.zipcode` em uma coluna `JSON` `custinfo` em uma tabela chamada `customers`. Em cada caso, o array JSON é convertido em um array de tipos de dados SQL de `UNSIGNED` valores inteiros.

* `CREATE TABLE` apenas:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON,
      INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) )
      );
  ```

* `CREATE TABLE` mais `ALTER TABLE`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  ALTER TABLE customers ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

* `CREATE TABLE` mais `CREATE INDEX`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  CREATE INDEX zips ON customers ( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

Um índice de múltiplos valores também pode ser definido como parte de um índice composto. Este exemplo mostra um índice composto que inclui duas partes de valor único (para as colunas `id` e `modified`) e uma parte de múltiplos valores (para a coluna `custinfo`):

```
CREATE TABLE customers (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    custinfo JSON
    );

ALTER TABLE customers ADD INDEX comp(id, modified,
    (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
```

Apenas uma parte da chave multivalorada pode ser usada em um índice composto. A parte da chave multivalorada pode ser usada em qualquer ordem em relação às outras partes da chave. Em outras palavras, a declaração `ALTER TABLE` que acabou de ser mostrada poderia ter usado `comp(id, (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY), modified))` (ou qualquer outra ordem) e ainda ter sido válida.

##### Usando índices de múltiplos valores

O otimizador utiliza um índice de múltiplos valores para buscar registros quando as seguintes funções são especificadas em uma cláusula `WHERE`:

* `MEMBER OF()`
* `JSON_CONTAINS()`
* `JSON_OVERLAPS()`

Podemos demonstrar isso criando e preenchendo a tabela `customers` usando as seguintes declarações `CREATE TABLE` e `INSERT`:

```
mysql> CREATE TABLE customers (
    ->     id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ->     custinfo JSON
    ->     );
Query OK, 0 rows affected (0.51 sec)

mysql> INSERT INTO customers VALUES
    ->     (NULL, NOW(), '{"user":"Jack","user_id":37,"zipcode":[94582,94536]}'),
    ->     (NULL, NOW(), '{"user":"Jill","user_id":22,"zipcode":[94568,94507,94582]}'),
    ->     (NULL, NOW(), '{"user":"Bob","user_id":31,"zipcode":[94477,94507]}'),
    ->     (NULL, NOW(), '{"user":"Mary","user_id":72,"zipcode":[94536]}'),
    ->     (NULL, NOW(), '{"user":"Ted","user_id":56,"zipcode":[94507,94582]}');
Query OK, 5 rows affected (0.07 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Primeiro, executamos três consultas na tabela `customers`, uma para cada uma das consultas usando `MEMBER OF()`, `JSON_CONTAINS()` e `JSON_OVERLAPS()`, com o resultado de cada consulta mostrado aqui:

```
mysql> SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  3 | 2019-06-29 22:23:12 | {"user": "Bob", "user_id": 31, "zipcode": [94477, 94507]}         |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
3 rows in set (0.00 sec)

mysql> SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  1 | 2019-06-29 22:23:12 | {"user": "Jack", "user_id": 37, "zipcode": [94582, 94536]}        |
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  3 | 2019-06-29 22:23:12 | {"user": "Bob", "user_id": 31, "zipcode": [94477, 94507]}         |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
4 rows in set (0.00 sec)
```

Em seguida, executamos `EXPLAIN` em cada uma das três consultas anteriores:

```
mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

Nenhuma das três consultas mostradas acima consegue usar qualquer chave. Para resolver esse problema, podemos adicionar um índice de múltiplos valores à matriz `zipcode` na coluna `JSON` (`custinfo`), da seguinte forma:

```
mysql> ALTER TABLE customers
    ->     ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Quando executamos as declarações anteriores `EXPLAIN` novamente, agora podemos observar que as consultas podem (e fazem) usar o índice `zips` que acabou de ser criado:

```
mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ref  | zips          | zips | 9       | const |    1 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | range | zips          | zips | 9       | NULL |    6 |   100.00 | Using where |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | range | zips          | zips | 9       | NULL |    6 |   100.00 | Using where |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

Um índice de múltiplos valores pode ser definido como uma chave única. Se definido como uma chave única, tentar inserir um valor já presente no índice de múltiplos valores retorna um erro de chave duplicada. Se valores duplicados já estiverem presentes, tentar adicionar um índice de múltiplos valores único falha, como mostrado aqui:

```
mysql> ALTER TABLE customers DROP INDEX zips;
Query OK, 0 rows affected (0.55 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE customers
    ->     ADD UNIQUE INDEX zips((CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)));
ERROR 1062 (23000): Duplicate entry '[94507, ' for key 'customers.zips'
mysql> ALTER TABLE customers
    ->     ADD INDEX zips((CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)));
Query OK, 0 rows affected (0.36 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

##### Características dos índices de múltiplos valores

Os índices de múltiplos valores possuem as características adicionais listadas aqui:

As operações DML que afetam índices multivalorados são tratadas da mesma maneira que as operações DML que afetam um índice normal, com a única diferença de que pode haver mais de um inserção ou atualização para um único registro de índice agrupado.

* Nullabilidade e índices de múltiplos valores:

+ Se uma parte de chave de múltiplos valores tiver um array vazio, não serão adicionadas entradas ao índice e o registro de dados não será acessível por meio de uma varredura de índice.

+ Se a geração de uma parte de chave de múltiplos valores retornar um valor `NULL`, uma única entrada contendo `NULL` é adicionada ao índice de múltiplos valores. Se a parte da chave for definida como `NOT NULL`, um erro é relatado.

+ Se a coluna do array de texto digitado estiver definida como `NULL`, o motor de armazenamento armazena um único registro contendo `NULL` que aponta para o registro de dados.

+ Valores nulos do `JSON` não são permitidos em arrays indexados. Se qualquer valor retornado for `NULL`, ele é tratado como um JSON nulo e um erro de valor JSON inválido é relatado.

* Como os índices de múltiplos valores são índices virtuais em colunas virtuais, eles devem seguir as mesmas regras que os índices secundários em colunas geradas virtualmente.

* Os registros do índice não são adicionados para arrays vazios.

##### Limitações e restrições em índices de múltiplos valores

Os índices de múltiplos valores estão sujeitos às limitações e restrições listadas aqui:

* Apenas uma parte de chave multivalorada é permitida por índice multivalorado. No entanto, a expressão `CAST(... AS ... ARRAY)`(cast-functions.html#function_cast) pode se referir a vários arrays dentro de um documento `JSON`, como mostrado aqui:

  ```
  CAST(data->'$.arr[*][*]' AS UNSIGNED ARRAY)
  ```

Neste caso, todos os valores que correspondem à expressão JSON são armazenados no índice como um único array plano.

* Um índice com uma parte de chave de múltiplos valores não suporta a ordenação e, portanto, não pode ser usado como chave primária. Por motivos semelhantes, um índice de múltiplos valores não pode ser definido usando as palavras-chave `ASC` ou `DESC`.

* Um índice de múltiplos valores não pode ser um índice de cobertura. * O número máximo de valores por registro para um índice de múltiplos valores é determinado pela quantidade de dados que podem ser armazenados em uma única página de log de desfazer, que é de 65221 bytes (64K menos 315 bytes de sobrecarga), o que significa que o comprimento total máximo dos valores da chave também é de 65221 bytes. O número máximo de chaves depende de vários fatores, o que impede a definição de um limite específico. Testes mostraram que um índice de múltiplos valores permite até 1604 chaves inteiras por registro, por exemplo. Quando o limite é atingido, é relatado um erro semelhante ao seguinte: ERRO 3905 (HY000): Excedido o número máximo de valores por registro para o índice de múltiplos valores 'idx' por 1 valor(es).

* O único tipo de expressão permitido em uma parte de chave de múltiplos valores é uma expressão `JSON`. A expressão não precisa referenciar um elemento existente em um documento JSON inserido na coluna indexada, mas deve ser sintaticamente válida por si mesma.

* Como os registros de índice para o mesmo registro do índice agrupado estão dispersos em um índice de múltiplos valores, um índice de múltiplos valores não suporta varreduras de intervalo ou varreduras apenas de índice.

* Os índices de múltiplos valores não são permitidos nas especificações de chave estrangeira.

* Prefixo de índice não pode ser definido para índices de múltiplos valores. * Indíces de múltiplos valores não podem ser definidos em dados classificados como `BINARY` (consulte a descrição da função `CAST()`).

* A criação online de um índice de múltiplos valores não é suportada, o que significa que a operação utiliza `ALGORITHM=COPY`. Veja Requisitos de desempenho e espaço.

* Conjuntos de caracteres e codificações que não sejam as seguintes combinações de conjunto de caracteres e codificação não são suportadas para índices de múltiplos valores:

1. O conjunto de caracteres `binary` com a collation padrão `binary`

2. O conjunto de caracteres `utf8mb4` com a agregação de coluna padrão `utf8mb4_0900_as_cs`.

* Assim como outros índices em colunas de tabelas de `InnoDB`, um índice de múltiplos valores não pode ser criado com `USING HASH`; tentando fazer isso resulta em um aviso: Este mecanismo de armazenamento não suporta o algoritmo de índice HASH, o mecanismo de armazenamento padrão foi usado em vez disso. (`USING BTREE` é suportado como de costume.)

#### Índices Espaciais

Os motores de armazenamento `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE` suportam colunas espaciais, como `POINT` e `GEOMETRY`. (A seção 13.4, “Tipos de dados espaciais”, descreve os tipos de dados espaciais.) No entanto, o suporte para indexação de colunas espaciais varia entre os motores. Índices espaciais e não espaciais em colunas espaciais estão disponíveis de acordo com as seguintes regras.

Os índices espaciais em colunas espaciais têm essas características:

* Disponível apenas para as tabelas `InnoDB` e `MyISAM`. Especificar `SPATIAL INDEX` para outros motores de armazenamento resulta em um erro.

* a partir do MySQL 8.0.12, um índice em uma coluna espacial *deve* ser um índice `SPATIAL`. A palavra-chave `SPATIAL` é, portanto, opcional, mas implícita para criar um índice em uma coluna espacial.

* Disponível apenas para colunas espaciais individuais. Um índice espacial não pode ser criado sobre múltiplas colunas espaciais.

* As colunas indexadas devem ser `NOT NULL`. * As extensões de prefixo da coluna são proibidas. A largura total de cada coluna é indexada.

* Não é permitido para uma chave primária ou índice único.

Os índices não espaciais em colunas espaciais (criados com `INDEX`, `UNIQUE` ou `PRIMARY KEY`) têm essas características:

* Permitido para qualquer motor de armazenamento que suporte colunas espaciais, exceto `ARCHIVE`.

* As colunas podem ser `NULL` a menos que o índice seja uma chave primária.

* O tipo de índice para um índice não `SPATIAL` depende do motor de armazenamento. Atualmente, a árvore B é usada.

* Permitido para uma coluna que pode ter valores de `NULL` apenas para as tabelas `InnoDB`, `MyISAM` e `MEMORY`.

#### Opções de índice

Após a lista de partes-chave, as opções de índice podem ser fornecidas. Um valor *`index_option`* pode ser qualquer um dos seguintes:

* `KEY_BLOCK_SIZE [=] value`

Para as tabelas de `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para blocos de chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor de nível de tabela de `KEY_BLOCK_SIZE`.

`KEY_BLOCK_SIZE` não é suportado no nível do índice para as tabelas `InnoDB`. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

* *`index_type`*

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. Por exemplo:

  ```
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

A Tabela 15.1, “Tipos de índice por motor de armazenamento”, mostra os valores de tipo de índice permitidos suportados por diferentes motores de armazenamento. Quando vários tipos de índice são listados, o primeiro é o padrão quando não é especificado um especificador de tipo de índice. Motores de armazenamento não listados na tabela não suportam uma cláusula *`index_type`* em definições de índice.

**Tabela 15.1 Tipos de índice por motor de armazenamento**

  <table summary="Permissible index types by storage engine."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Storage Engine</th> <th>Tipos de índice permitidos</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MyISAM</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MEMORY</code>/<code>HEAP</code></td> <td><code>HASH</code>,<code>BTREE</code></td> </tr><tr> <td><code>NDB</code></td> <td><code>HASH</code>,<code>BTREE</code>(ver nota no texto)</td> </tr></tbody></table>

A cláusula *`index_type`* não pode ser usada para especificações de `FULLTEXT INDEX` ou (antes do MySQL 8.0.12) `SPATIAL INDEX`. A implementação de índice de texto completo depende do mecanismo de armazenamento. Índices espaciais são implementados como índices R-tree.

Se você especificar um tipo de índice que não é válido para um motor de armazenamento específico, mas outro tipo de índice está disponível e o motor pode usar sem afetar os resultados das consultas, o motor usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo. A partir do MySQL 8.0.12, isso é permitido apenas para índices `SPATIAL`. Antes do 8.0.12, `RTREE` não pode ser especificado para qualquer motor de armazenamento.

Os índices `BTREE` são implementados pelo mecanismo de armazenamento `NDB` como índices T-tree.

Nota

Para índices nas colunas da tabela `NDB`, a opção `USING` pode ser especificada apenas para um índice único ou chave primária. `USING HASH` impede a criação de um índice ordenado; caso contrário, a criação de um índice único ou chave primária em uma tabela `NDB` resulta automaticamente na criação tanto de um índice ordenado quanto de um índice de hash, cada um dos quais indexa o mesmo conjunto de colunas.

Para índices únicos que incluem uma ou mais colunas `NULL` de uma tabela `NDB`, o índice de hash pode ser usado apenas para procurar valores literais, o que significa que as condições `IS [NOT] NULL` exigem uma varredura completa da tabela. Uma solução é garantir que um índice único que use uma ou mais colunas `NULL` em tal tabela seja sempre criado de tal forma que inclua o índice ordenado; ou seja, evitar empregar `USING HASH` ao criar o índice.

Se você especificar um tipo de índice que não é válido para um determinado motor de armazenamento, mas outro tipo de índice está disponível e o motor pode usar sem afetar os resultados das consultas, o motor usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo, mas atualmente isso não pode ser especificado para qualquer motor de armazenamento.

Nota

O uso da opção *`index_type`* antes da cláusula `ON tbl_name` é desaconselhável; espera-se que o suporte para o uso da opção nessa posição seja removido em uma versão futura do MySQL. Se uma opção *`index_type`* for dada em ambas as posições anteriores e posteriores, a opção final se aplica.

`TYPE type_name` é reconhecido como sinônimo de `USING type_name`. No entanto, `USING` é a forma preferida.

As tabelas a seguir mostram as características do índice para os motores de armazenamento que suportam a opção *`index_type`*.

**Tabela 15.2 Características do Engate de Armazenamento InnoDB**

  <table summary="Index characteristics of the InnoDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazenar valores NULL</th> <th scope="col">Permite múltiplos valores nulos</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row"><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th scope="row"><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

**Tabela 15.3 Características do motor de armazenamento MyISAM**

  <table summary="Index characteristics of the MyISAM storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazenar valores NULL</th> <th scope="col">Permite múltiplos valores nulos</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row"><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th scope="row"><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

**Tabela 15.4 Características do Índice do Motor de Armazenamento de MEMÓRIA**

  <table summary="Index characteristics of the Memory storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazenar valores NULL</th> <th scope="col">Permite múltiplos valores nulos</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr></tbody></table>

**Tabela 15.5 Características do Índice do Engate de Armazenamento NDB**

  <table summary="Index characteristics of the NDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazenar valores NULL</th> <th scope="col">Permite múltiplos valores nulos</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th scope="row">Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th scope="row">Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr></tbody></table>

Nota da tabela:

1. `USING HASH` impede a criação de um índice ordenado implícito.

* `WITH PARSER parser_name`

Essa opção só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de análise a índice se as operações de indexação e busca de texto completo necessitam de tratamento especial. `InnoDB` e `MyISAM` suportam plugins de análise de texto completo. Se você tem uma tabela `MyISAM` com um plugin de análise de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`. Consulte Plugins de Análise de Texto Completo e Escrita de Plugins de Análise de Texto Completo para mais informações.

* `COMMENT 'string'`

As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

O `MERGE_THRESHOLD` para páginas de índice pode ser configurado para índices individuais usando a cláusula *`index_option`* `COMMENT` da declaração `CREATE INDEX`. Por exemplo:

  ```
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

Se a porcentagem de página para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, `InnoDB` tenta combinar a página de índice com uma página de índice vizinha. O valor padrão `MERGE_THRESHOLD` é 50, que é o valor previamente codificado.

`MERGE_THRESHOLD` também pode ser definido no nível do índice e no nível da tabela usando as declarações `CREATE TABLE` e `ALTER TABLE`. Para mais informações, consulte a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

* `VISIBLE`, `INVISIBLE`

Especifique a visibilidade do índice. Os índices são visíveis por padrão. Um índice invisível não é utilizado pelo otimizador. A especificação da visibilidade do índice se aplica a índices que não são chaves primárias (explícitas ou implícitas). Para mais informações, consulte a Seção 10.3.12, “Indizes invisíveis”.

As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE INDEX i1 ON t1 (c1) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Nesse caso, o último valor especificado é utilizado.

Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, e também não são apagados quando o mecanismo de armazenamento da tabela é alterado.

#### Opções de Copiar e Acelerar a Tabela
#### Opções de Copiar e Acelerar a Tabela

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que para a declaração `ALTER TABLE`. Para mais informações, consulte a Seção 15.1.9, “Declaração ALTER TABLE”

O NDB Cluster suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

### 15.1.16 Declaração CREATE LOGFILE GROUP

```
CREATE LOGFILE GROUP logfile_group
    ADD UNDOFILE 'undo_file'
    [INITIAL_SIZE [=] initial_size]
    [UNDO_BUFFER_SIZE [=] undo_buffer_size]
    [REDO_BUFFER_SIZE [=] redo_buffer_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']
    ENGINE [=] engine_name
```

Essa declaração cria um novo grupo de arquivo de registro denominado *`logfile_group`* com um único arquivo `UNDO` denominado '*`undo_file`*. Uma declaração `CREATE LOGFILE GROUP` tem uma única cláusula `ADD UNDOFILE`. Para regras que cobrem a nomeação de grupos de arquivos de registro, consulte a Seção 11.2, “Nomes de Objetos do Esquema”.

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de registro com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Só pode haver um grupo de arquivos de registro por instância do NDB Cluster em qualquer momento.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO`; se não especificado, ele é predefinido como `128M` (128 megabytes). O parâmetro opcional `UNDO_BUFFER_SIZE` define o tamanho usado pelo buffer `UNDO` para o grupo de arquivos de log; O valor padrão para `UNDO_BUFFER_SIZE` é `8M` (oito megabytes); esse valor não pode exceder a quantidade de memória do sistema disponível. Ambos esses parâmetros são especificados em bytes. Você pode opcionalmente seguir um ou ambos desses com uma abreviação de uma letra para uma ordem de magnitude, semelhante àquelas usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

A memória usada para `UNDO_BUFFER_SIZE` vem do pool global, cujo tamanho é determinado pelo valor do parâmetro de configuração do nó de dados `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`.

O máximo permitido para `UNDO_BUFFER_SIZE` é 629145600 (600 MB).

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB).

A opção `ENGINE` determina o motor de armazenamento a ser utilizado por este grupo de arquivos de registro, com *`engine_name`* sendo o nome do motor de armazenamento. No MySQL 8.0, isso deve ser `NDB` (ou `NDBCLUSTER`). Se `ENGINE` não estiver definido, o MySQL tenta usar o motor especificado pela variável de sistema do servidor `default_storage_engine` (anteriormente `storage_engine`). Em qualquer caso, se o motor não for especificado como `NDB` ou `NDBCLUSTER`, a declaração `CREATE LOGFILE GROUP` parece ter sucesso, mas na verdade falha em criar o grupo de arquivos de registro, como mostrado aqui:

```
mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------------------------------------------------------------------+
| Level | Code | Message                                                                                        |
+-------+------+------------------------------------------------------------------------------------------------+
| Error | 1478 | Table storage engine 'InnoDB' does not support the create option 'TABLESPACE or LOGFILE GROUP' |
+-------+------+------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> DROP LOGFILE GROUP lg1 ENGINE = NDB;
ERROR 1529 (HY000): Failed to drop LOGFILE GROUP

mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M
    ->     ENGINE = NDB;
Query OK, 0 rows affected (2.97 sec)
```

O fato de que a declaração `CREATE LOGFILE GROUP` não retorna realmente um erro quando um motor de armazenamento não `NDB` é nomeado, mas sim parece ter sucesso, é um problema conhecido que esperamos resolver em um lançamento futuro do NDB Cluster.

*`REDO_BUFFER_SIZE`*, `NODEGROUP`, `WAIT` e `COMMENT` são analisados, mas ignorados, e, portanto, não têm efeito no MySQL 8.0. Essas opções são destinadas à expansão futura.

Quando usado com `ENGINE [=] NDB`, um grupo de arquivos de registro e o arquivo de registro associado `UNDO` são criados em cada nó de dados do cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles, fazendo uma consulta à tabela do esquema de informações `FILES`. Por exemplo:

```
mysql> SELECT LOGFILE_GROUP_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE FILE_NAME = 'undo_10.dat';
+--------------------+----------------------+----------------+
| LOGFILE_GROUP_NAME | LOGFILE_GROUP_NUMBER | EXTRA          |
+--------------------+----------------------+----------------+
| lg_3               |                   11 | CLUSTER_NODE=3 |
| lg_3               |                   11 | CLUSTER_NODE=4 |
+--------------------+----------------------+----------------+
2 rows in set (0.06 sec)
```

`CREATE LOGFILE GROUP` é útil apenas com armazenamento de dados de disco para NDB Cluster. Veja a Seção 25.6.11, “Tabelas de dados de disco do NDB Cluster”.

### 15.1.17 Estruturas de declaração CREATE PROCEDURE e CREATE FUNCTION

```
CREATE
    [DEFINER = user]
    PROCEDURE [IF NOT EXISTS] sp_name ([proc_parameter[,...]])
    [characteristic ...] routine_body

CREATE
    [DEFINER = user]
    FUNCTION [IF NOT EXISTS] sp_name ([func_parameter[,...]])
    RETURNS type
    [characteristic ...] routine_body

proc_parameter:
    [ IN | OUT | INOUT ] param_name type

func_parameter:
    param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

routine_body:
    Valid SQL routine statement
```

Essas declarações são usadas para criar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada se torna conhecida pelo servidor. Por padrão, uma rotina armazenada é associada ao banco de dados padrão. Para associar explicitamente a rotina a um banco de dados específico, especifique o nome como *`db_name.sp_name`* ao criá-la.

A declaração `CREATE FUNCTION` também é usada no MySQL para suportar funções carregáveis. Veja a Seção 15.7.4.1, “Declaração CREATE FUNCTION para Funções Carregáveis”. Uma função carregável pode ser considerada uma função armazenada externa. As funções armazenadas compartilham seu espaço de nome com as funções carregáveis. Veja a Seção 11.2.5, “Parágrafo de Nomes de Função e Resolução”, para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções.

Para invocar um procedimento armazenado, use a declaração `CALL` (consulte Seção 15.2.1, “Declaração CALL”). Para invocar uma função armazenada, consulte-a em uma expressão. A função retorna um valor durante a avaliação da expressão.

`CREATE PROCEDURE` e `CREATE FUNCTION` exigem o privilégio `CREATE ROUTINE`. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor de *`user`*, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, `CREATE FUNCTION` pode exigir o privilégio `SUPER`, conforme discutido na Seção 27.7, “Registro Binário de Programas Armazenados”.

Por padrão, o MySQL concede automaticamente os privilégios `ALTER ROUTINE` e `EXECUTE` ao criador da rotina. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja a Seção 27.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da execução rotineira, conforme descrito mais adiante nesta seção.

Se o nome da rotina for o mesmo que o nome de uma função SQL embutida, ocorrerá um erro de sintaxe, a menos que você use um espaço entre o nome e os parênteses subsequentes ao definir a rotina ou invocá-la posteriormente. Por essa razão, evite usar os nomes de funções SQL existentes para suas próprias rotinas armazenadas.

O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a rotinas armazenadas. É sempre permitido ter espaços após o nome de uma rotina armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

`IF NOT EXISTS` previne que um erro ocorra se já existir uma rotina com o mesmo nome. Esta opção é suportada tanto com `CREATE FUNCTION` quanto com `CREATE PROCEDURE`, a partir do MySQL 8.0.29.

Se uma função embutida com o mesmo nome já existir, tentar criar uma função armazenada com `CREATE FUNCTION ... IF NOT EXISTS` terá sucesso com um aviso indicando que ela tem o mesmo nome que uma função nativa; isso não é diferente quando se executa a mesma declaração `CREATE FUNCTION` sem especificar `IF NOT EXISTS`.

Se uma função carregável com o mesmo nome já existir, tentar criar uma função armazenada usando `IF NOT EXISTS` terá sucesso com um aviso. Isso é o mesmo que sem especificar `IF NOT EXISTS`.

Veja Resolução de Nome de Função, para mais informações.

A lista de parâmetros fechada entre parênteses deve estar sempre presente. Se não houver parâmetros, deve-se usar uma lista de parâmetros vazia de `()`. Os nomes dos parâmetros não são sensíveis ao caso.

Cada parâmetro é um parâmetro `IN` por padrão. Para especificar de outra forma para um parâmetro, use a palavra-chave `OUT` ou `INOUT` antes do nome do parâmetro.

Nota

Especificar um parâmetro como `IN`, `OUT` ou `INOUT` é válido apenas para um `PROCEDURE`. Para um `FUNCTION`, os parâmetros são sempre considerados parâmetros `IN`.

Um parâmetro `IN` passa um valor para um procedimento. O procedimento pode modificar o valor, mas a modificação não é visível para o solicitante quando o procedimento retorna. Um parâmetro `OUT` passa um valor do procedimento de volta para o solicitante. Seu valor inicial é `NULL` dentro do procedimento, e seu valor é visível para o solicitante quando o procedimento retorna. Um parâmetro `INOUT` é inicializado pelo solicitante, pode ser modificado pelo procedimento e qualquer alteração feita pelo procedimento é visível para o solicitante quando o procedimento retorna.

Para cada parâmetro `OUT` ou `INOUT`, passe uma variável definida pelo usuário na declaração `CALL` que invoca o procedimento para que você possa obter seu valor quando o procedimento retornar. Se você estiver chamando o procedimento de dentro de outro procedimento ou função armazenada, também pode passar um parâmetro de rotina ou uma variável de rotina local como um parâmetro `OUT` ou [[`INOUT`]. Se você estiver chamando o procedimento de dentro de um gatilho, também pode passar `NEW.col_name` como um parâmetro `OUT` ou `INOUT`.

Para informações sobre o efeito das condições não tratadas nos parâmetros do procedimento, consulte a Seção 15.6.7.8, “Tratamento de condições e parâmetros OUT ou INOUT”.

Os parâmetros de rotina não podem ser referenciados em declarações preparadas dentro da rotina; veja a Seção 27.8, “Restrições sobre programas armazenados”.

O exemplo a seguir mostra um procedimento armazenado simples que, dado um código de país, conta o número de cidades desse país que aparecem na tabela `city` do banco de dados `world`. O código de país é passado usando um parâmetro `IN`, e o número de cidades é retornado usando um parâmetro `OUT`:

```
mysql> delimiter //

mysql> CREATE PROCEDURE citycount (IN country CHAR(3), OUT cities INT)
       BEGIN
         SELECT COUNT(*) INTO cities FROM world.city
         WHERE CountryCode = country;
       END//
Query OK, 0 rows affected (0.01 sec)

mysql> delimiter ;

mysql> CALL citycount('JPN', @cities); -- cities in Japan
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|     248 |
+---------+
1 row in set (0.00 sec)

mysql> CALL citycount('FRA', @cities); -- cities in France
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|      40 |
+---------+
1 row in set (0.00 sec)
```

O exemplo utiliza o comando do cliente **mysql** `delimiter` para alterar o delimitador de declaração de `;` para `//` enquanto o procedimento está sendo definido. Isso permite que o delimitador `;` usado no corpo do procedimento seja passado para o servidor em vez de ser interpretado pelo próprio **mysql**. Veja a Seção 27.1, “Definindo programas armazenados”.

A cláusula `RETURNS` pode ser especificada apenas para um `FUNCTION`, para o qual é obrigatória. Ela indica o tipo de retorno da função, e o corpo da função deve conter uma declaração `RETURN value`. Se a declaração `RETURN` retornar um valor de um tipo diferente, o valor é coercido para o tipo apropriado. Por exemplo, se uma função especifica um valor de `ENUM` ou `SET` na cláusula `RETURNS`, mas a declaração `RETURN` retorna um inteiro, o valor retornado da função é a string para o membro correspondente `ENUM` do conjunto de membros `SET`.

A função a seguir recebe um parâmetro, realiza uma operação usando uma função SQL e retorna o resultado. Neste caso, não é necessário usar `delimiter`, porque a definição da função não contém delimitadores internos de `;`:

```
mysql> CREATE FUNCTION hello (s CHAR(20))
    ->   RETURNS CHAR(50) DETERMINISTIC
    ->   RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)
```

Os tipos de parâmetros e os tipos de retorno de função podem ser declarados para usar qualquer tipo de dado válido. O atributo `COLLATE` pode ser usado se precedido por uma especificação `CHARACTER SET`.

O *`routine_body` consiste em uma declaração válida de rotina SQL. Isso pode ser uma declaração simples, como `SELECT` ou `INSERT`, ou uma declaração composta escrita usando `BEGIN` e `END`. As declarações compostas podem conter declarações, laços e outras declarações de estrutura de controle. A sintaxe dessas declarações é descrita na Seção 15.6, “Sintaxe de Declaração Composta”. Na prática, as funções armazenadas tendem a usar declarações compostas, a menos que o corpo consista em uma única declaração `RETURN`.

O MySQL permite que rotinas contenham declarações DDL, como `CREATE` e `DROP`. O MySQL também permite que procedimentos armazenados (mas não funções armazenadas) contenham declarações de transação SQL, como `COMMIT`. As funções armazenadas não podem conter declarações que realizem um commit ou rollback explícito ou implícito. O suporte para essas declarações não é exigido pelo padrão SQL, que afirma que cada fornecedor de SGBD pode decidir se as permite.

As declarações que retornam um conjunto de resultados podem ser usadas em um procedimento armazenado, mas não em uma função armazenada. Essa proibição inclui as declarações `SELECT` que não possuem uma cláusula `INTO var_list` e outras declarações, como `SHOW`, `EXPLAIN` e `CHECK TABLE`. Para declarações que podem ser determinadas no momento da definição da função como retornando um conjunto de resultados, ocorre um erro `Not allowed to return a result set from a function` (`ER_SP_NO_RETSET`). Para declarações que podem ser determinadas apenas no momento da execução como retornando um conjunto de resultados, ocorre um erro `PROCEDURE %s can't return a result set in the given context` (`ER_SP_BADSELECT`).

`USE` declarações dentro de rotinas armazenadas não são permitidas. Quando uma rotina é invocada, uma `USE db_name` implícita é realizada (e desfazida quando a rotina termina). Isso faz com que a rotina tenha o banco de dados padrão especificado enquanto está sendo executada. Referências a objetos em bancos de dados que não são o banco de dados padrão da rotina devem ser qualificadas com o nome do banco de dados apropriado.

Para informações adicionais sobre declarações que não são permitidas em rotinas armazenadas, consulte a Seção 27.8, “Restrições em Programas Armazenados”.

Para obter informações sobre como invocar procedimentos armazenados a partir de programas escritos em uma linguagem que tem uma interface MySQL, consulte a Seção 15.2.1, “Instrução CALL”.

O MySQL armazena a configuração da variável de sistema `sql_mode` em vigor quando uma rotina é criada ou alterada, e sempre executa a rotina com essa configuração em vigor, * independentemente do modo SQL do servidor atual quando a rotina começa a ser executada*.

A mudança do modo SQL do invocador para o modo da rotina ocorre após a avaliação dos argumentos e a atribuição dos valores resultantes aos parâmetros da rotina. Se você definir uma rotina em modo SQL estrito, mas a invocar em modo não estrito, a atribuição dos argumentos aos parâmetros da rotina não ocorre em modo estrito. Se você precisar que as expressões passadas para uma rotina sejam atribuídas em modo SQL estrito, você deve invocar a rotina com o modo estrito em vigor.

A característica `COMMENT` é uma extensão do MySQL e pode ser usada para descrever a rotina armazenada. Essa informação é exibida pelas declarações `SHOW CREATE PROCEDURE` e `SHOW CREATE FUNCTION` (show-create-procedure.html "15.7.7.9 SHOW CREATE PROCEDURE Statement") e (show-create-function.html "15.7.7.8 SHOW CREATE FUNCTION Statement").

A característica `LANGUAGE` indica o idioma em que a rotina foi escrita. O servidor ignora essa característica; apenas as rotinas SQL são suportadas.

Uma rotina é considerada “determinística” se sempre produzir o mesmo resultado para os mesmos parâmetros de entrada, e “não determinística” caso contrário. Se nem `DETERMINISTIC` nem `NOT DETERMINISTIC` é dado na definição da rotina, o padrão é `NOT DETERMINISTIC`. Para declarar que uma função é determinística, você deve especificar explicitamente `DETERMINISTIC`.

A avaliação da natureza de uma rotina é baseada na "honestidade" do criador: o MySQL não verifica se uma rotina declarada `DETERMINISTIC` está livre de declarações que produzem resultados não determinísticos. No entanto, declarar uma rotina incorretamente pode afetar os resultados ou o desempenho. Declarar uma rotina não determinística como `DETERMINISTIC` pode levar a resultados inesperados, pois o otimizador pode tomar escolhas incorretas de plano de execução. Declarar uma rotina determinística como `NONDETERMINISTIC` pode diminuir o desempenho, pois pode impedir que otimizações disponíveis sejam usadas.

Se o registro binário estiver habilitado, a característica `DETERMINISTIC` afeta quais definições de rotina o MySQL aceita. Veja a Seção 27.7, “Registro Binário de Programa Armazenado”.

Uma rotina que contém a função `NOW()` (ou seus sinônimos) ou `RAND()` é não determinística, mas ainda pode ser segura para replicação. Para `NOW()`, o log binário inclui o timestamp e replica corretamente. `RAND()` também replica corretamente, desde que seja chamado apenas uma única vez durante a execução de uma rotina. (Você pode considerar o timestamp da execução da rotina e a semente de número aleatório como entradas implícitas que são idênticas na fonte e na replica.)

Várias características fornecem informações sobre a natureza do uso dos dados pela rotina. No MySQL, essas características são apenas indicativas. O servidor não as usa para restringir os tipos de declarações que uma rotina é permitida para executar.

* `CONTAINS SQL` indica que a rotina não contém declarações que leem ou escrevem dados. Este é o padrão se nenhuma dessas características for dada explicitamente. Exemplos de tais declarações são `SET @x = 1` ou `DO RELEASE_LOCK('abc')`, que executam, mas não leem nem escrevem dados.

* `NO SQL` indica que a rotina não contém nenhuma declaração SQL.

* `READS SQL DATA` indica que a rotina contém declarações que leem dados (por exemplo, `SELECT`, mas não declarações que escrevem dados.

* `MODIFIES SQL DATA` indica que a rotina contém declarações que podem escrever dados (por exemplo, `INSERT` ou `DELETE`).

A característica `SQL SECURITY` pode ser `DEFINER` ou `INVOKER` para especificar o contexto de segurança, ou seja, se a rotina executa usando os privilégios da conta nomeada na cláusula da rotina `DEFINER` ou do usuário que a invoca. Essa conta deve ter permissão para acessar o banco de dados com o qual a rotina está associada. O valor padrão é `DEFINER`. O usuário que invoca a rotina deve ter o privilégio `EXECUTE` para isso, assim como a conta `DEFINER` se a rotina for executada em um contexto de segurança definido.

A cláusula `DEFINER` especifica a conta do MySQL a ser utilizada ao verificar privilégios de acesso no momento da execução de rotina para rotinas que possuem a característica `SQL SECURITY DEFINER`.

Se a cláusula `DEFINER` estiver presente, o valor do *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores permitidos do *`user`* dependem dos privilégios que você possui, conforme discutido na Seção 27.6, “Controle de acesso a objetos armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança de rotinas armazenadas.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração [`CREATE PROCEDURE`](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements") ou [`CREATE FUNCTION`](create-function.html "15.1.14 CREATE FUNCTION Statement"). Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro do corpo de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, a função `CURRENT_USER` retorna o valor da rotina `DEFINER`. Para informações sobre auditoria de usuários dentro de rotinas armazenadas, consulte a Seção 8.2.23, “Auditorização de atividade de conta baseada em SQL”.

Considere o procedimento a seguir, que exibe um contador do número de contas do MySQL listadas na tabela do sistema `mysql.user`:

```
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento é atribuído à conta `DEFINER` de `'admin'@'localhost'`, independentemente de qual usuário o defina. Ele é executado com os privilégios dessa conta, independentemente de qual usuário o invoque (porque a característica de segurança padrão é `DEFINER`). O procedimento tem sucesso ou falha dependendo se o invocador tem o privilégio `EXECUTE` para ele e `'admin'@'localhost'` tem o privilégio `SELECT` para a tabela `mysql.user`.

Agora, suponha que o procedimento seja definido com a característica `SQL SECURITY INVOKER`:

```
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento ainda tem um `DEFINER` de `'admin'@'localhost'`, mas, neste caso, ele é executado com os privilégios do usuário que o invoca. Assim, o procedimento tem sucesso ou falha dependendo se o invocador tem o privilégio `EXECUTE` para ele e o privilégio `SELECT` para a tabela `mysql.user`.

Por padrão, quando uma rotina com a característica `SQL SECURITY DEFINER` é executada, o MySQL Server não define nenhum papel ativo para a conta MySQL nomeada na cláusula `DEFINER`, apenas os papéis padrão. A exceção é se a variável de sistema `activate_all_roles_on_login` estiver habilitada, caso em que o MySQL Server define todos os papéis concedidos ao usuário `DEFINER`, incluindo os papéis obrigatórios. Quaisquer privilégios concedidos por meio de papéis não são, portanto, verificados por padrão quando a declaração `CREATE PROCEDURE` ou `CREATE FUNCTION` é emitida. Para programas armazenados, se a execução deve ocorrer com papéis diferentes dos padrão, o corpo do programa pode executar `SET ROLE` para ativar os papéis necessários. Isso deve ser feito com cautela, pois os privilégios atribuídos aos papéis podem ser alterados.

O servidor lida com o tipo de dados de um parâmetro de rotina, variável local de rotina criada com `DECLARE`, ou o valor de retorno de uma função da seguinte forma:

* As atribuições são verificadas quanto a desalinhamentos de tipo de dados e sobrecarga. Problemas de conversão e sobrecarga resultam em avisos ou erros no modo SQL rigoroso.

* Apenas valores escalares podem ser atribuídos. Por exemplo, uma declaração como `SET x = (SELECT 1, 2)` é inválida.

* Para os tipos de dados de caracteres, se `CHARACTER SET` está incluído na declaração, o conjunto de caracteres especificado e sua ordenação padrão são usados. Se o atributo `COLLATE` também estiver presente, essa ordenação é usada em vez da ordenação padrão.

Se `CHARACTER SET` e `COLLATE` não estiverem presentes, o conjunto de caracteres e a correção de dados do banco de dados em vigor no momento da criação rotineira são utilizados. Para evitar que o servidor use o conjunto de caracteres e a correção de dados do banco de dados, forneça um atributo explícito `CHARACTER SET` e `COLLATE` para os parâmetros de dados de caracteres.

Se você alterar o conjunto de caracteres ou a agregação padrão do banco de dados, as rotinas armazenadas que devem usar os novos padrões do banco de dados devem ser excluídas e recriadas.

O conjunto de caracteres e a correção de dados do banco de dados são determinados pelo valor das variáveis de sistema `character_set_database` e `collation_database`. Para mais informações, consulte a Seção 12.3.3, “Conjunto de caracteres e correção de dados do banco de dados”.

### 15.1.18 Declaração de CREATE SERVER

```
CREATE SERVER server_name
    FOREIGN DATA WRAPPER wrapper_name
    OPTIONS (option [, option] ...)

option: {
    HOST character-literal
  | DATABASE character-literal
  | USER character-literal
  | PASSWORD character-literal
  | SOCKET character-literal
  | OWNER character-literal
  | PORT numeric-literal
}
```

Essa declaração cria a definição de um servidor para uso com o mecanismo de armazenamento `FEDERATED`. A declaração `CREATE SERVER` cria uma nova linha na tabela `servers` no banco de dados `mysql`. Essa declaração requer o privilégio `SUPER`.

O `server_name` deve ser uma referência única ao servidor. As definições do servidor são globais no escopo do servidor, não é possível qualificar a definição do servidor para um banco de dados específico. `server_name` tem um comprimento máximo de 64 caracteres (os nomes mais longos que 64 caracteres são silenciosamente truncados) e é sensível a maiúsculas e minúsculas. Você pode especificar o nome como uma string citada.

O `wrapper_name` é um identificador e pode ser citado com aspas simples.

Para cada `option`, você deve especificar um literal de caractere ou um literal numérico. Os literais de caracteres são UTF-8, suportam um comprimento máximo de 64 caracteres e têm como padrão uma string em branco (vazia). Os literais de string são silenciosamente truncados para 64 caracteres. Os literais numéricos devem ser um número entre 0 e 9999, o valor padrão é 0.

Nota

A opção `OWNER` atualmente não é aplicada e não tem efeito sobre a propriedade ou operação da conexão do servidor que é criada.

A declaração `CREATE SERVER` cria uma entrada na tabela `mysql.servers` que pode ser usada posteriormente com a declaração `CREATE TABLE` ao criar uma tabela `FEDERATED`. As opções que você especifica são usadas para preencher as colunas na tabela `mysql.servers`. As colunas da tabela são `Server_name`, `Host`, `Db`, `Username`, `Password`, `Port` e `Socket`.

Por exemplo:

```
CREATE SERVER s
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'Remote', HOST '198.51.100.106', DATABASE 'test');
```

Certifique-se de especificar todas as opções necessárias para estabelecer uma conexão com o servidor. O nome de usuário, o nome do host e o nome do banco de dados são obrigatórios. Pode ser necessário outros tipos de opções, como senha.

Os dados armazenados na tabela podem ser utilizados ao criar uma conexão com uma tabela `FEDERATED`:

```
CREATE TABLE t (s1 INT) ENGINE=FEDERATED CONNECTION='s';
```

Para mais informações, consulte a Seção 18.8, “O motor de armazenamento FEDERATED”.

`CREATE SERVER` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

`CREATE SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo utilizado.

### 15.1.19 Declaração do Sistema de Referência Espacial CREATE

```
CREATE OR REPLACE SPATIAL REFERENCE SYSTEM
    srid srs_attribute ...

CREATE SPATIAL REFERENCE SYSTEM
    [IF NOT EXISTS]
    srid srs_attribute ...

srs_attribute: {
    NAME 'srs_name'
  | DEFINITION 'definition'
  | ORGANIZATION 'org_name' IDENTIFIED BY org_id
  | DESCRIPTION 'description'
}

srid, org_id: 32-bit unsigned integer
```

Essa declaração cria uma definição de [sistema de referência espacial][(spatial-reference-systems.html "13.4.5 Spatial Reference System Support")](SRS) (SRS) e armazena-a no dicionário de dados. Ela requer o privilégio `SUPER`. A entrada do dicionário de dados resultante pode ser inspecionada usando a tabela [[`INFORMATION_SCHEMA`][`ST_SPATIAL_REFERENCE_SYSTEMS`]].

Os valores SRID devem ser únicos, portanto, se nem `OR REPLACE` nem `IF NOT EXISTS` for especificado, ocorrerá um erro se uma definição de SRS com o valor *`srid`* já existir.

Com a sintaxe `CREATE OR REPLACE`, qualquer definição de SRS existente com o mesmo valor de SRID é substituída, a menos que o valor de SRID seja usado por alguma coluna em uma tabela existente. Nesse caso, ocorre um erro. Por exemplo:

```
mysql> CREATE OR REPLACE SPATIAL REFERENCE SYSTEM 4326 ...;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

Para identificar qual coluna ou colunas utilizam o SRID, use esta consulta, substituindo 4326 pelo SRID da definição que você está tentando criar:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

Com a sintaxe `CREATE ... IF NOT EXISTS`, qualquer definição de SRS existente com o mesmo valor de SRID faz com que a nova definição seja ignorada e ocorre um aviso.

Os valores de SRID devem estar na faixa de inteiros sem sinal de 32 bits, com essas restrições:

* SRID 0 é um SRID válido, mas não pode ser usado com `CREATE SPATIAL REFERENCE SYSTEM`(create-spatial-reference-system.html "15.1.19 CREATE SPATIAL REFERENCE SYSTEM Statement").

* Se o valor estiver em um intervalo de SRID reservado, uma mensagem de alerta é exibida. Os intervalos reservados são [0, 32767] (reservado pelo EPSG), [60.000.000, 69.999.999] (reservado pelo EPSG) e [2.000.000.000, 2.147.483.647] (reservado pelo MySQL). EPSG significa [European Petroleum Survey Group][(http://epsg.org)].

* Os usuários não devem criar SRSs com SRIDs nas faixas de uso reservado. Isso corre o risco de os SRIDs entrarem em conflito com definições futuras de SRS distribuídas com o MySQL, resultando no fato de que os novos SRS fornecidos pelo sistema não são instalados para atualizações do MySQL ou que os SRS definidos pelo usuário são sobrescritos.

Os atributos para a declaração devem satisfazer essas condições:

* Os atributos podem ser dados em qualquer ordem, mas nenhum atributo pode ser dado mais de uma vez.

Os atributos `NAME` e `DEFINITION` são obrigatórios.

* O valor do atributo `NAME` *`srs_name`* deve ser único. A combinação dos valores dos atributos `ORGANIZATION` *`org_name`* e *`org_id`* deve ser única.

O valor do atributo `NAME` *`srs_name`* e o valor do atributo `ORGANIZATION` *`org_name`* não podem ser vazios ou começar ou terminar com espaços em branco.

* Os valores de cadeia nas especificações de atributos não podem conter caracteres de controle, incluindo nova linha.

* A tabela a seguir mostra as longitudes máximas para os valores do atributo de string.

**Tabela 15.6 Sistema de Referência Espacial CREATE Atributos de comprimento**

  <table summary="Maximum string attribute lengths for CREATE SPATIAL REFERENCE SYSTEM"><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Attribute</th> <th>Maximum Length (characters)</th> </tr></thead><tbody><tr> <td><code>NAME</code></td> <td>80</td> </tr><tr> <td><code>DEFINITION</code></td> <td>4096</td> </tr><tr> <td><code>ORGANIZATION</code></td> <td>256</td> </tr><tr> <td><code>DESCRIPTION</code></td> <td>2048</td> </tr></tbody></table>

Aqui está um exemplo de declaração `CREATE SPATIAL REFERENCE SYSTEM`(create-spatial-reference-system.html "15.1.19 CREATE SPATIAL REFERENCE SYSTEM Statement"). O valor `DEFINITION` é reformatado em várias linhas para melhor legibilidade. (Para que a declaração seja legal, o valor deve ser dado na verdade em uma única linha.)

```
CREATE SPATIAL REFERENCE SYSTEM 4120
NAME 'Greek'
ORGANIZATION 'EPSG' IDENTIFIED BY 4120
DEFINITION
  'GEOGCS["Greek",DATUM["Greek",SPHEROID["Bessel 1841",
  6377397.155,299.1528128,AUTHORITY["EPSG","7004"]],
  AUTHORITY["EPSG","6120"]],PRIMEM["Greenwich",0,
  AUTHORITY["EPSG","8901"]],UNIT["degree",0.017453292519943278,
  AUTHORITY["EPSG","9122"]],AXIS["Lat",NORTH],AXIS["Lon",EAST],
  AUTHORITY["EPSG","4120"]]';
```

A gramática para as definições SRS é baseada na gramática definida no *Especificação de Implementação OpenGIS: Serviços de Transformação de Coordenadas*, Revisão 1.00, OGC 01-009, 12 de janeiro de 2001, Seção 7.2. Esta especificação está disponível em <http://www.opengeospatial.org/standards/ct>.

MySQL incorpora essas mudanças na especificação:

* Apenas a regra de produção `<horz cs>` é implementada (ou seja, SRSs geográficas e projetadas).

* Existe uma cláusula opcional, não padronizada `<authority>` para `<parameter>`. Isso permite reconhecer os parâmetros de projeção por autoridade em vez de nome.

* A especificação não torna as cláusulas `AXIS` obrigatórias nas definições do sistema de referência espacial `GEOGCS`. No entanto, se não houver cláusulas `AXIS`, o MySQL não pode determinar se uma definição tem eixos em ordem de latitude-longitude ou longitude-latitude. O MySQL exige o requisito não padrão de que cada definição `GEOGCS` deve incluir duas cláusulas `AXIS`. Uma deve ser `NORTH` ou `SOUTH`, e a outra `EAST` ou `WEST`. A ordem das cláusulas `AXIS` determina se a definição tem eixos em ordem de latitude-longitude ou longitude-latitude.

* As definições do SRS podem não conter novas linhas.

Se uma definição de SRS especificar um código de autoridade para a projeção (o que é recomendado), ocorrerá um erro se a definição estiver faltando parâmetros obrigatórios. Neste caso, a mensagem de erro indica qual é o problema. Os métodos de projeção e os parâmetros obrigatórios que o MySQL suporta estão mostrados na Tabela 15.7, “Métodos de Projeção de Sistema de Referência Espacial Apoiado” e na Tabela 15.8, “Parâmetros de Projeção de Sistema de Referência Espacial”.

Para obter informações adicionais sobre a escrita de definições de SRS para MySQL, consulte [Sistemas de Referência Espacial Geográfica no MySQL 8.0][(https://mysqlserverteam.com/geographic-spatial-reference-systems-in-mysql-8-0/)] e [Sistemas de Referência Espacial Projetada no MySQL 8.0][(https://mysqlserverteam.com/projected-spatial-reference-systems-in-mysql-8-0/)]

A tabela a seguir mostra os métodos de projeção que o MySQL suporta. O MySQL permite métodos de projeção desconhecidos, mas não pode verificar a definição dos parâmetros obrigatórios e não pode converter dados espaciais para ou a partir de uma projeção desconhecida. Para explicações detalhadas de como cada projeção funciona, incluindo fórmulas, consulte [EPSG Guidance Note 7-2][(http://www.epsg.org/Portals/0/373-07-2.pdf)].

**Tabela 15.7 Métodos de projeção de sistemas de referência espaciais suportados**

<table summary="Supported spatial reference system projection codes, names, and mandatory EPSG parameters."><col style="width: 10%"/><col style="width: 45%"/><col style="width: 35%"/><thead><tr> <th scope="col">Código EPSG</th> <th scope="col">Nome da Projeção</th> <th scope="col">Parâmetros obrigatórios (Códigos EPSG)</th> </tr></thead><tbody><tr> <th scope="row">1024</th> <td>Visualização popular Pseudo Mercator</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th scope="row">1027</th> <td>Lambert Azimutal de Área Igual (Esférico)</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th scope="row">1028</th> <td>Equidistant Cylindrical</td> <td>8823, 8802, 8806, 8807</td> </tr><tr> <th scope="row">1029</th> <th>Cilíndrico (esférico) equidistante</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th scope="row">1041</th> <th>Krovak (Orientado ao Norte)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th scope="row">1042</th> <th>Krovak Modificado</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th scope="row">1043</th> <th>Krovak Modificado (Orientado ao Norte)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th scope="row">1051</th> <th>Lambert Conic Conformal (2SP Michigan)</th> <th>8821, 8822, 8823, 8824, 8826, 8827, 1038</th> </tr><tr> <th scope="row">1052</th> <th>Colômbia Urbana</th> <th>8801, 8802, 8806, 8807, 1039</th> </tr><tr> <th scope="row">9801</th> <th>Lambert Conic Conformal (1SP)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9802</th> <th>Lambert Conic Conformal (2SP)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th scope="row">9803</th> <th>Lambert Conic Conformal (2SP Bélgica)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th scope="row">9804</th> <th>Mercator (variante A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9805</th> <th>Mercator (variante B)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9806</th> <th>Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9807</th> <th>Mercator transversal</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9808</th> <th>Transversal Mercator (Orientado ao Sul)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9809</th> <th>Estéreo oblíquo</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9810</th> <th>Polar Stereográfica (variante A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9811</th> <th>Mapa de grade da Nova Zelândia</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9812</th> <th>Hotine Oblique Mercator (variante A)</th> <th>8811, 8812, 8813, 8814, 8815, 8806, 8807</th> </tr><tr> <th scope="row">9813</th> <th>Laborde Oblique Mercator</th> <th>8811, 8812, 8813, 8815, 8806, 8807</th> </tr><tr> <th scope="row">9815</th> <th>Hotine Oblique Mercator (variante B)</th> <th>8811, 8812, 8813, 8814, 8815, 8816, 8817</th> </tr><tr> <th scope="row">9816</th> <th>Rede de mineração da Tunísia</th> <th>8821, 8822, 8826, 8827</th> </tr><tr> <th scope="row">9817</th> <th>Lambert Conic Near-Conformal</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9818</th> <th>American Polyconic</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9819</th> <th>Krovak</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th scope="row">9820</th> <th>Lambert Azimutal de Área Igual</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9822</th> <th>Albers Equal Area</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th scope="row">9824</th> <th>Sistema de grade em zonas transversais do sistema Mercator</th> <th>8801, 8830, 8831, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9826</th> <th>Lambert Conic Conformal (Orientado a Oeste)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9828</th> <th>Bonne (Orientada ao sul)</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9829</th> <th>Polar Stereográfica (variante B)</th> <th>8832, 8833, 8806, 8807</th> </tr><tr> <th scope="row">9830</th> <th>Polar Stereográfica (variante C)</th> <th>8832, 8833, 8826, 8827</th> </tr><tr> <th scope="row">9831</th> <th>Guam Projection</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9832</th> <th>Azimutal equidistante modificado</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9833</th> <th>Hyperbolic Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9834</th> <th>Lambert Cylindrical Equal Area (esférico)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9835</th> <td>Lambert Cilíndrico de Área Igual</td> <td>8823, 8802, 8806, 8807</td> </tr></tbody></table>

A tabela a seguir mostra os parâmetros de projeção que o MySQL reconhece. O reconhecimento ocorre principalmente pelo código de autoridade. Se não houver código de autoridade, o MySQL recorre à correspondência de string insensível ao caso na nome do parâmetro. Para obter detalhes sobre cada parâmetro, consulte-o pelo código no [Registro Online EPSG][(https://www.epsg-registry.org)].

**Tabela 15.8 Parâmetros de projeção do Sistema de Referência Espacial**

<table summary="Spatial reference system projection codes, fallback names, and EPSG names."><col style="width: 10%"/><col style="width: 45%"/><col style="width: 35%"/><thead><tr> <th scope="col">Código EPSG</th> <th scope="col">Nome de fallback (reconhecido pelo MySQL)</th> <th scope="col">EPSG Nome</th> </tr></thead><tbody><tr> <th scope="row">1026</th> <th>c1</th> <th>C1</th> </tr><tr> <th scope="row">1027</th> <th>c2</th> <th>C2</th> </tr><tr> <th scope="row">1028</th> <th>c3</th> <th>C3</th> </tr><tr> <th scope="row">1029</th> <th>c4</th> <th>C4</th> </tr><tr> <th scope="row">1030</th> <th>c5</th> <th>C5</th> </tr><tr> <th scope="row">1031</th> <th>c6</th> <th>C6</th> </tr><tr> <th scope="row">1032</th> <th>c7</th> <th>C7</th> </tr><tr> <th scope="row">1033</th> <th>c8</th> <th>C8</th> </tr><tr> <th scope="row">1034</th> <th>c9</th> <th>C9</th> </tr><tr> <th scope="row">1035</th> <th>c10</th> <th>C10</th> </tr><tr> <th scope="row">1036</th> <th>azimuth</th> <th>Co-latitude of cone axis</th> </tr><tr> <th scope="row">1038</th> <th>ellipsoid_scale_factor</th> <th>Ellipsoid scaling factor</th> </tr><tr> <th scope="row">1039</th> <th>projection_plane_height_at_origin</th> <th>Projection plane origin height</th> </tr><tr> <th scope="row">8617</th> <th>evaluation_point_ordinate_1</th> <th>Ordinate 1 of evaluation point</th> </tr><tr> <th scope="row">8618</th> <th>evaluation_point_ordinate_2</th> <th>Ordinate 2 of evaluation point</th> </tr><tr> <th scope="row">8801</th> <th>latitude_of_origin</th> <th>Latitude of natural origin</th> </tr><tr> <th scope="row">8802</th> <th>central_meridian</th> <th>Longitude of natural origin</th> </tr><tr> <th scope="row">8805</th> <th>scale_factor</th> <th>Scale factor at natural origin</th> </tr><tr> <th scope="row">8806</th> <th>false_easting</th> <th>False easting</th> </tr><tr> <th scope="row">8807</th> <th>false_northing</th> <th>False northing</th> </tr><tr> <th scope="row">8811</th> <th>latitude_of_center</th> <th>Latitude of projection centre</th> </tr><tr> <th scope="row">8812</th> <th>longitude_of_center</th> <th>Longitude of projection centre</th> </tr><tr> <th scope="row">8813</th> <th>azimuth</th> <th>Azimuth of initial line</th> </tr><tr> <th scope="row">8814</th> <th>rectified_grid_angle</th> <th>Ângulo de Rectificação para Rede Esférica</th> </tr><tr> <th scope="row">8815</th> <th>scale_factor</th> <th>Scale factor on initial line</th> </tr><tr> <th scope="row">8816</th> <th>false_easting</th> <th>Easting at projection centre</th> </tr><tr> <th scope="row">8817</th> <th>false_northing</th> <th>Northing at projection centre</th> </tr><tr> <th scope="row">8818</th> <th>pseudo_standard_parallel_1</th> <th>Latitude of pseudo standard parallel</th> </tr><tr> <th scope="row">8819</th> <th>scale_factor</th> <th>Fator de escala em pseudo padrão paralelo</th> </tr><tr> <th scope="row">8821</th> <th>latitude_of_origin</th> <th>Latitude of false origin</th> </tr><tr> <th scope="row">8822</th> <th>central_meridian</th> <th>Longitude of false origin</th> </tr><tr> <th scope="row">8823</th> <th>padrão_paralelo_1, padrão_paralelo1</th> <th>Latitude da 1ª paralela padrão</th> </tr><tr> <th scope="row">8824</th> <th>padrão_paralelo_2, padrão_paralelo2</th> <th>Latitude do 2º paralelo padrão</th> </tr><tr> <th scope="row">8826</th> <th>false_easting</th> <th>Easting at false origin</th> </tr><tr> <th scope="row">8827</th> <th>false_northing</th> <th>Northing at false origin</th> </tr><tr> <th scope="row">8830</th> <th>initial_longitude</th> <th>Initial longitude</th> </tr><tr> <th scope="row">8831</th> <th>zone_width</th> <th>Zone width</th> </tr><tr> <th scope="row">8832</th> <th>standard_parallel</th> <th>Latitude of standard parallel</th> </tr><tr> <th scope="row">8833</th> <td>longitude_of_center</td> <td>Longitude of origin</td> </tr></tbody></table>

### 15.1.20 Declaração CREATE TABLE

```
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    (create_definition,...)
    [table_options]
    [partition_options]

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    [(create_definition,...)]
    [table_options]
    [partition_options]
    [IGNORE | REPLACE]
    [AS] query_expression

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    { LIKE old_tbl_name | (LIKE old_tbl_name) }

create_definition: {
    col_name column_definition
  | {INDEX | KEY} [index_name] [index_type] (key_part,...)
      [index_option] ...
  | {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | check_constraint_definition
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT {literal | (expr)} ]
      [VISIBLE | INVISIBLE]
      [AUTO_INCREMENT] [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [ENGINE_ATTRIBUTE [=] 'string']
      [SECONDARY_ENGINE_ATTRIBUTE [=] 'string']
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
      [check_constraint_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [VISIBLE | INVISIBLE]
      [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [reference_definition]
      [check_constraint_definition]
}

data_type:
    (see Chapter 13, Data Types)

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  |ENGINE_ATTRIBUTE [=] 'string'
  |SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

check_constraint_definition:
    [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]

reference_definition:
    REFERENCES tbl_name (key_part,...)
      [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
      [ON DELETE reference_option]
      [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT

table_options:
    table_option [[,] table_option] ...

table_option: {
    AUTOEXTEND_SIZE [=] value
  | AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | ENGINE_ATTRIBUTE [=] 'string'
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | START TRANSACTION
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | tablespace_option
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    PARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list)
        | RANGE{(expr) | COLUMNS(column_list)}
        | LIST{(expr) | COLUMNS(column_list)} }
    [PARTITIONS num]
    [SUBPARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list) }
      [SUBPARTITIONS num]
    ]
    [(partition_definition [, partition_definition] ...)]

partition_definition:
    PARTITION partition_name
        [VALUES
            {LESS THAN {(expr | value_list) | MAXVALUE}
            |
            IN (value_list)}]
        [[STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]
        [(subpartition_definition [, subpartition_definition] ...)]

subpartition_definition:
    SUBPARTITION logical_name
        [[STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]

tablespace_option:
    TABLESPACE tablespace_name [STORAGE DISK]
  | [TABLESPACE tablespace_name] STORAGE MEMORY

query_expression:
    SELECT ...   (Some valid select or union statement)
```

`CREATE TABLE` cria uma tabela com o nome fornecido. Você deve ter o privilégio `CREATE` para a tabela.

Por padrão, as tabelas são criadas no banco de dados padrão, usando o mecanismo de armazenamento `InnoDB`. Um erro ocorre se a tabela existir, se não houver um banco de dados padrão ou se o banco de dados não existir.

O MySQL não tem limite no número de tabelas. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam as tabelas. Motores de armazenamento individuais podem impor restrições específicas ao motor. `InnoDB` permite até 4 bilhões de tabelas.

Para informações sobre a representação física de uma tabela, consulte a Seção 15.1.20.1, “Arquivos criados por CREATE TABLE”.

Há vários aspectos da declaração `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement"), descritos nos seguintes tópicos desta seção:

* Nome da tabela
* Tabelas temporárias
* Clonagem e cópia de tabela
* Tipos de dados e atributos de coluna
* Índices, chaves estrangeiras e restrições CHECK
* Opções da tabela
* Partição da tabela

#### Nome da Tabela

* `tbl_name`

O nome da tabela pode ser especificado como *`db_name.tbl_name`* para criar a tabela em um banco de dados específico. Isso funciona independentemente de haver um banco de dados padrão, assumindo que o banco de dados exista. Se você usar identificadores com aspas, cite os nomes do banco de dados e da tabela separadamente. Por exemplo, escreva `` `mydb`.`mytbl` ``, not `` `mydb.mytbl` ``.

As regras para nomes de tabelas permitidos estão descritas na Seção 11.2, "Nomes de Objetos do Esquema".

* `IF NOT EXISTS`

Previne ocorrência de um erro se a tabela existir. No entanto, não há verificação de que a tabela existente tenha uma estrutura idêntica àquela indicada pela declaração `CREATE TABLE`.

#### Tabelas Temporárias

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é descartada automaticamente quando a sessão é fechada. Para mais informações, consulte a Seção 15.1.20.2, “Declaração CREATE TEMPORARY TABLE”.

#### Clonagem e cópia de tabela

* `LIKE`

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

  ```
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

Para mais informações, consulte a Seção 15.1.20.3, “Instrução CREATE TABLE ... LIKE”.

* `[AS] query_expression`

Para criar uma tabela a partir de outra, adicione uma declaração `SELECT` no final da declaração `CREATE TABLE`:

  ```
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

Para mais informações, consulte a Seção 15.1.20.4, “CREATE TABLE ... Statement SELECT”.

* `IGNORE | REPLACE`

As opções `IGNORE` e `REPLACE` indicam como lidar com linhas que duplicam valores de chave única ao copiar uma tabela usando uma declaração `SELECT`.

Para mais informações, consulte a Seção 15.1.20.4, “CREATE TABLE ... Statement SELECT”.

#### Tipos de dados de coluna e atributos

Há um limite rígido de 4096 colunas por tabela, mas o máximo efetivo pode ser menor para uma tabela específica e depende dos fatores discutidos na Seção 10.4.7, “Limites do número de colunas e tamanho de linha da tabela”.

* `data_type`

*`data_type`* representa o tipo de dados em uma definição de coluna. Para uma descrição completa da sintaxe disponível para especificar tipos de dados de coluna, bem como informações sobre as propriedades de cada tipo, consulte o Capítulo 13, *Tipos de Dados*.

+ Alguns atributos não se aplicam a todos os tipos de dados. `AUTO_INCREMENT` se aplica apenas a tipos inteiros e de ponto flutuante. O uso de `AUTO_INCREMENT` com `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") colunas é desaconselhável a partir do MySQL 8.0.17; espera-se que o suporte para isso seja removido em uma versão futura do MySQL.

Antes do MySQL 8.0.13, `DEFAULT` não se aplica aos tipos `BLOB`, `TEXT`, `GEOMETRY` e `JSON`.

Os tipos de dados de caracteres (os tipos `CHAR`, `VARCHAR`, `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem incluir `CHARACTER SET` para especificar o conjunto de caracteres para a coluna. `CHARSET` é um sinônimo de `CHARACTER SET`. Uma codificação para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Para obter detalhes, consulte o Capítulo 12, * Conjuntos de caracteres, Codificações, Unicode *. Exemplo:

    ```
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
    ```

O MySQL 8.0 interpreta as especificações de comprimento nas definições de colunas de caracteres em caracteres. As longitudes para `BINARY` e `VARBINARY` estão em bytes.

+ Para as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`, podem ser criados índices que utilizam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice. As colunas `BLOB` e `TEXT` também podem ser indexadas, mas um comprimento de prefixo *deve* ser dado. Os comprimentos de prefixo são dados em caracteres para tipos de string não binários e em bytes para tipos de string binários. Isso significa que as entradas do índice consistem nos primeiros *`length`* caracteres de cada valor de coluna para as colunas `CHAR`, `VARCHAR` e `TEXT`, e os primeiros *`length`* bytes de cada valor de coluna para as colunas `BINARY`, `VARBINARY` e `BLOB`. Indexar apenas um prefixo de valores de coluna dessa forma pode tornar o arquivo de índice muito menor. Para informações adicionais sobre prefixos de índice, consulte a Seção 15.1.15, “Declaração CREATE INDEX”.

Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam indexação nas colunas `BLOB` e `TEXT`. Por exemplo:

    ```
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

Se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, `CREATE TABLE` (create-table.html "15.1.20 CREATE TABLE Statement") lida com o índice da seguinte forma:

- Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver habilitado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dados da coluna e uma advertência é gerada (se o modo SQL rigoroso não estiver habilitado).

- Para um índice único, ocorre um erro, independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

As colunas `JSON` não podem ser indexadas. Você pode contornar essa restrição criando um índice em uma coluna gerada que extraia um valor escalar da coluna `JSON`. Consulte "Indexação de uma coluna gerada para fornecer um índice de coluna JSON", para um exemplo detalhado.

* `NOT NULL | NULL`

Se nem `NULL` nem `NOT NULL` for especificado, a coluna é tratada como se `NULL` tivesse sido especificado.

Em MySQL 8.0, apenas os motores de armazenamento `InnoDB`, `MyISAM` e `MEMORY` suportam índices em colunas que podem ter valores de `NULL`. Em outros casos, você deve declarar colunas indexadas como `NOT NULL` ou ocorrerá um erro.

* `DEFAULT`

Especifica um valor padrão para uma coluna. Para mais informações sobre o tratamento do valor padrão, incluindo o caso em que uma definição de coluna não inclui explicitamente o valor `DEFAULT`, consulte a Seção 13.6, “Valores padrão do tipo de dados”.

Se o modo SQL `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE` estiver habilitado e um valor de data padrão não estiver correto de acordo com esse modo, o `CREATE TABLE` produz um aviso se o modo SQL rigoroso não estiver habilitado e um erro se o modo rigoroso estiver habilitado. Por exemplo, com `NO_ZERO_IN_DATE` habilitado, o `c1 DATE DEFAULT '2010-00-00'` produz um aviso.

* `VISIBLE`, `INVISIBLE`

Especifique a visibilidade da coluna. O padrão é `VISIBLE` se nenhum dos termos-chave estiver presente. Uma tabela deve ter pelo menos uma coluna visível. Tentar tornar todas as colunas invisíveis produz um erro. Para mais informações, consulte a Seção 15.1.20.10, “Colunas invisíveis”.

As palavras-chave `VISIBLE` e `INVISIBLE` estão disponíveis a partir do MySQL 8.0.23. Antes do MySQL 8.0.23, todas as colunas são visíveis.

* `AUTO_INCREMENT`

Uma coluna de número inteiro ou ponto flutuante pode ter o atributo adicional `AUTO_INCREMENT`. Quando você insere um valor de `NULL` (recomendado) ou `0` em uma coluna indexada `AUTO_INCREMENT`, a coluna é definida para o próximo valor da sequência. Tipicamente, isso é `value+1`, onde *`value`* é o maior valor para a coluna atualmente na tabela. As sequências de `AUTO_INCREMENT` começam com `1`.

Para recuperar um valor de `AUTO_INCREMENT` após inserir uma linha, use a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Veja a Seção 14.15, “Funções de Informação”, e mysql_insert_id().

Se o modo SQL `NO_AUTO_VALUE_ON_ZERO` estiver habilitado, você pode armazenar `0` nas colunas `AUTO_INCREMENT` como `0` sem gerar um novo valor de sequência. Veja a Seção 7.1.11, “Modos SQL do servidor”.

Só pode haver uma única coluna `AUTO_INCREMENT` por tabela, ela deve ser indexada e não pode ter um valor `DEFAULT`. Uma coluna `AUTO_INCREMENT` funciona corretamente apenas se contiver apenas valores positivos. Inserir um número negativo é considerado como inserir um número muito grande positivo. Isso é feito para evitar problemas de precisão quando os números "transbordam" de positivo para negativo e também para garantir que você não obtenha acidentalmente uma coluna `AUTO_INCREMENT` que contenha `0`.

Para as tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos campos. Veja a Seção 5.6.9, “Usando AUTO_INCREMENT”.

Para tornar o MySQL compatível com algumas aplicações ODBC, você pode encontrar o valor `AUTO_INCREMENT` para a última linha inserida com a seguinte consulta:

  ```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

Este método exige que a variável `sql_auto_is_null` não esteja definida como 0. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Para informações sobre `InnoDB` e `AUTO_INCREMENT`, consulte a Seção 17.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”. Para informações sobre `AUTO_INCREMENT` e a Replicação do MySQL, consulte a Seção 19.5.1.1, “Replicação e AUTO_INCREMENT”.

* `COMMENT`

Um comentário para uma coluna pode ser especificado com a opção `COMMENT`, com até 1024 caracteres. O comentário é exibido pelas declarações (show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement") e `SHOW FULL COLUMNS` (show-columns.html "15.7.7.5 SHOW COLUMNS Statement") e também é mostrado na coluna `COLUMN_COMMENT` da tabela do Esquema de Informações `COLUMNS`.

* `COLUMN_FORMAT`

No NDB Cluster, também é possível especificar um formato de armazenamento de dados para colunas individuais das tabelas `NDB` usando `COLUMN_FORMAT`. Os formatos de coluna permitidos são `FIXED`, `DYNAMIC` e `DEFAULT`. `FIXED` é usado para especificar armazenamento de largura fixa, `DYNAMIC` permite que a coluna seja de largura variável e `DEFAULT` faz com que a coluna use armazenamento de largura fixa ou variável, conforme determinado pelo tipo de dados da coluna (possivelmente sobrescrito por um especificador `ROW_FORMAT`).

Para as tabelas `NDB`, o valor padrão para `COLUMN_FORMAT` é `FIXED`.

No NDB Cluster, o deslocamento máximo possível para uma coluna definida com `COLUMN_FORMAT=FIXED` é de 8188 bytes. Para mais informações e possíveis soluções, consulte a Seção 25.2.7.5, “Limites associados aos objetos de banco de dados no NDB Cluster”.

`COLUMN_FORMAT` atualmente não tem efeito sobre as colunas de tabelas que utilizam motores de armazenamento, exceto `NDB`. O MySQL 8.0 ignora silenciosamente `COLUMN_FORMAT`.

As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de coluna para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE TABLE t1 (c1 INT ENGINE_ATTRIBUTE='{"key":"value"}');
  ```

Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Nesse caso, o último valor especificado é utilizado.

Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, e também não são apagados quando o mecanismo de armazenamento da tabela é alterado.

* `STORAGE`

Para as tabelas `NDB`, é possível especificar se a coluna é armazenada em disco ou na memória usando uma cláusula `STORAGE`. `STORAGE DISK` faz com que a coluna seja armazenada em disco, e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. A declaração `CREATE TABLE` usada ainda deve incluir uma cláusula `TABLESPACE`:

  ```
  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) ENGINE NDB;
  ERROR 1005 (HY000): Can't create table 'c.t1' (errno: 140)

  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) TABLESPACE ts_1 ENGINE NDB;
  Query OK, 0 rows affected (1.06 sec)
  ```

Para as tabelas `NDB`, `STORAGE DEFAULT` é equivalente a `STORAGE MEMORY`.

A cláusula `STORAGE` não tem efeito em tabelas que utilizam motores de armazenamento diferentes de `NDB`. A palavra-chave `STORAGE` é suportada apenas na versão do **mysqld** que é fornecida com o NDB Cluster; ela não é reconhecida em nenhuma outra versão do MySQL, onde qualquer tentativa de usar a palavra-chave `STORAGE` causa um erro de sintaxe.

* `GENERATED ALWAYS`

Usado para especificar uma expressão de coluna gerada. Para informações sobre [colunas geradas][(glossary.html#glos_generated_column "generated column")], consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

As colunas geradas armazenadas podem ser indexadas. (glossary.html#glos_stored_generated_column "stored generated column") pode ser indexado. `InnoDB` suporta índices secundários em colunas geradas virtuais (glossary.html#glos_virtual_generated_column "virtual generated column"). Veja a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

#### Índices, Chaves Estrangeiras e Restrições CHECK

Vários termos-chave se aplicam à criação de índices, chaves estrangeiras e restrições `CHECK`. Para informações gerais, além das descrições a seguir, consulte a Seção 15.1.15, “Declaração CREATE INDEX”, a Seção 15.1.20.5, “Restrições de chave estrangeira” e a Seção 15.1.20.6, “Restrições CHECK”.

* `CONSTRAINT symbol`

A cláusula `CONSTRAINT symbol` pode ser usada para nomear uma restrição. Se a cláusula não for fornecida, ou se um *`symbol`* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de restrição, com a exceção mencionada abaixo. O valor *`symbol`*, se usado, deve ser único por esquema (banco de dados), por tipo de restrição. Um *`symbol`* duplicado resulta em um erro. Veja também a discussão sobre os limites de comprimento dos identificadores de restrição gerados na Seção 11.2.1, “Limites de comprimento do identificador”.

Nota

Se a cláusula `CONSTRAINT symbol` não for fornecida em uma definição de chave estrangeira, ou se um *`symbol`* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL usa o nome do índice da chave estrangeira até o MySQL 8.0.15 e gera automaticamente um nome de restrição posteriormente.

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo espaço de nomes. No MySQL, cada tipo de restrição tem seu próprio espaço de nomes por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema, mas as restrições de diferentes tipos podem ter o mesmo nome.

* `PRIMARY KEY`

Um índice único onde todas as colunas principais devem ser definidas como `NOT NULL`. Se elas não forem explicitamente declaradas como `NOT NULL`, o MySQL as declara implicitamente (e silenciosamente). Uma tabela pode ter apenas um `PRIMARY KEY`. O nome de um `PRIMARY KEY` é sempre `PRIMARY`, que, portanto, não pode ser usado como o nome para qualquer outro tipo de índice.

Se você não tiver um `PRIMARY KEY` e um aplicativo solicitar o `PRIMARY KEY` em suas tabelas, o MySQL retorna o primeiro índice `UNIQUE` que não tenha colunas `NULL` como o `PRIMARY KEY`.

Nas tabelas `InnoDB`, mantenha o `PRIMARY KEY` curto para minimizar o overhead de armazenamento para índices secundários. Cada entrada de índice secundário contém uma cópia das colunas da chave primária para a linha correspondente. (Veja a Seção 17.6.2.1, “Indekses agrupados e secundários”.)

Na tabela criada, um `PRIMARY KEY` é colocado primeiro, seguido de todos os índices `UNIQUE`, e depois os índices não exclusivos. Isso ajuda o otimizador do MySQL a priorizar qual índice usar e também a detectar mais rapidamente chaves duplicadas de `UNIQUE`.

Um `PRIMARY KEY` pode ser um índice de múltiplas colunas. No entanto, você não pode criar um índice de múltiplas colunas usando o atributo de chave `PRIMARY KEY` em uma especificação de coluna. Fazer isso apenas marca essa única coluna como primária. Você deve usar uma cláusula separada `PRIMARY KEY(key_part, ...)`.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com um tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em declarações `SELECT`, conforme descrito em Índices Únicos.

Em MySQL, o nome de um `PRIMARY KEY` é `PRIMARY`. Para outros índices, se você não atribuir um nome, o índice recebe o mesmo nome da primeira coluna indexada, com um sufixo opcional (`_2`, `_3`, `...`) para torná-lo único. Você pode ver os nomes dos índices de uma tabela usando `SHOW INDEX FROM tbl_name`. Veja a Seção 15.7.7.22, “Declaração SHOW INDEX”.

* `KEY | INDEX`

`KEY` é normalmente sinônimo de `INDEX`. O atributo chave `PRIMARY KEY` também pode ser especificado como apenas `KEY` quando fornecido em uma definição de coluna. Isso foi implementado para compatibilidade com outros sistemas de banco de dados.

* `UNIQUE`

Um índice `UNIQUE` cria uma restrição de tal forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Para todos os motores, um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`. Se você especificar um valor prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com um tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada nas declarações `SELECT`, conforme descrito em Índices Únicos.

* `FULLTEXT`

Um índice `FULLTEXT` é um tipo especial de índice usado para pesquisas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT`. Eles podem ser criados apenas a partir das colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna; a indexação de prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Consulte a Seção 14.9, “Funções de Pesquisa de Texto Completo”, para detalhes da operação. Uma cláusula `WITH PARSER` pode ser especificada como um *`index_option`* para associar um plugin de análise a índice, se as operações de indexação e pesquisa de texto completo necessitarem de tratamento especial. Esta cláusula é válida apenas para índices `FULLTEXT`. `InnoDB` e `MyISAM` suportam plugins de análise de texto completo. Consulte Plugins de Análise de Texto Completo e Escrita de Plugins de Análise de Texto Completo para mais informações.

* `SPATIAL`

Você pode criar índices `SPATIAL` em tipos de dados espaciais. Os tipos espaciais são suportados apenas para as tabelas `InnoDB` e `MyISAM`, e as colunas indexadas devem ser declaradas como `NOT NULL`. Veja a Seção 13.4, “Tipos de Dados Espaciais”.

* `FOREIGN KEY`

O MySQL suporta chaves estrangeiras, que permitem a referência cruzada de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter esses dados dispersos consistentes. Para informações sobre definição e opções, consulte *`reference_definition`* e *`reference_option`*.

As tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Consulte a Seção 26.6, “Restrições e Limitações na Particionamento”, para obter mais informações.

* `CHECK`

A cláusula `CHECK` permite a criação de restrições a serem verificadas para valores de dados em linhas de tabela. Veja a Seção 15.1.20.6, “Restrições CHECK”.

* `key_part`

Uma especificação *`key_part`* pode terminar com `ASC` ou `DESC` para especificar se os valores do índice são armazenados em ordem ascendente ou descendente. O padrão é ascendente se não for especificado nenhum especificador de ordem.

Os prefixos, definidos pelo atributo *`length`*, podem ter até 767 bytes de comprimento para as tabelas `InnoDB` que utilizam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para as tabelas `InnoDB` que utilizam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para as tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes.

Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas declarações de `CREATE TABLE` (create-table.html "15.1.20 CREATE TABLE Statement"), `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") e `CREATE INDEX` (create-index.html "15.1.15 CREATE INDEX Statement") são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tome isso em consideração ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

+ A partir do MySQL 8.0.17, o *`expr`* para uma especificação *`key_part`* pode assumir a forma `(CAST json_path AS type ARRAY)` para criar um índice de múltiplos valores em uma coluna `JSON`. Índices de Múltiplos Valores, fornece informações detalhadas sobre a criação, uso e restrições e limitações de índices de múltiplos valores.

* `index_type`

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING type_name`.

Exemplo:

  ```
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
  ```

A posição preferida para `USING` é após a lista de colunas de índice. Ela pode ser dada antes da lista de colunas, mas o suporte para o uso da opção nessa posição é descontinuado e você deve esperar que ela seja removida em uma versão futura do MySQL.

* `index_option`

Os valores de *`index_option`* especificam opções adicionais para um índice.

+ `KEY_BLOCK_SIZE`

Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos da chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor do nível de tabela `KEY_BLOCK_SIZE`.

Para informações sobre o atributo `KEY_BLOCK_SIZE` de nível de tabela, consulte Opções de tabela.

+ `WITH PARSER`

A opção `WITH PARSER` pode ser usada apenas com índices `FULLTEXT`. Ela associa um plugin de análise de texto ao índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. Os `InnoDB` e `MyISAM` suportam plugins de análise de texto de texto completo. Se você tem uma tabela `MyISAM` com um plugin de analisador de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`.

+ `COMMENT`

As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

Você pode definir o valor `InnoDB` `MERGE_THRESHOLD` para um índice individual usando a cláusula `index_option` `COMMENT`. Veja a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

+ `VISIBLE`, `INVISIBLE`

Especifique a visibilidade do índice. Os índices são visíveis por padrão. Um índice invisível não é utilizado pelo otimizador. A especificação da visibilidade do índice se aplica a índices que não são chaves primárias (explícitas ou implícitas). Para mais informações, consulte a Seção 10.3.12, “Indizes invisíveis”.

As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

Para mais informações sobre os valores *`index_option`* permitidos, consulte a Seção 15.1.15, “Instrução CREATE INDEX”. Para mais informações sobre índices, consulte a Seção 10.3.1, “Como o MySQL usa índices”.

* `reference_definition`

Para detalhes e exemplos de sintaxe de *`reference_definition`*, consulte a Seção 15.1.20.5, “Restrições de CHAVE ESTÁVEL”.

As tabelas `InnoDB` e `NDB` permitem a verificação de restrições de chave estrangeira. As colunas da tabela referenciada devem sempre ser explicitamente nomeadas. As ações `ON DELETE` e `ON UPDATE` sobre chaves estrangeiras são suportadas. Para informações mais detalhadas e exemplos, consulte a Seção 15.1.20.5, “Restrições de chave estrangeira”.

Para outros motores de armazenamento, o MySQL Server analisa e ignora a sintaxe `FOREIGN KEY` nas declarações `CREATE TABLE`.

Importante

Para usuários familiarizados com o Padrão ANSI/ISO SQL, observe que nenhum mecanismo de armazenamento, incluindo `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada em definições de restrição de integridade referencial. O uso de uma cláusula explícita `MATCH` não tem o efeito especificado e também faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Por essas razões, especificar `MATCH` deve ser evitado.

A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com várias colunas) são tratados ao serem comparados com uma chave primária. `InnoDB` implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja totalmente ou parcialmente `NULL`. Nesse caso, a linha (da tabela filha) contendo tal chave estrangeira é permitida para ser inserida e não corresponde a nenhuma linha na tabela referenciada (matriz). É possível implementar outras semânticas usando gatilhos.

Além disso, o MySQL exige que as colunas referenciadas sejam indexadas para desempenho. No entanto, o `InnoDB` não exige que as colunas referenciadas sejam declaradas como `UNIQUE` ou `NOT NULL`. O tratamento de referências de chave estrangeira para chaves não únicas ou chaves que contêm valores de `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. É aconselhável usar chaves estrangeiras que referenciem apenas chaves que sejam tanto `UNIQUE` (ou `PRIMARY`) quanto `NOT NULL`.

O MySQL analisa, mas ignora as especificações "inline `REFERENCES`" (conforme definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL aceita as cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada. Para mais informações, consulte a Seção 1.6.2.3, "Diferenças da restrição FOREIGN KEY".

* `reference_option`

Para informações sobre as opções `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION` e `SET DEFAULT`, consulte a Seção 15.1.20.5, “Restrições de CHAVE ESTÁVEL”.

#### Opções de tabela

As opções de tabela são usadas para otimizar o comportamento da tabela. Na maioria dos casos, você não precisa especificar nenhuma delas. Essas opções se aplicam a todos os motores de armazenamento, a menos que indicado de outra forma. Opções que não se aplicam a um determinado motor de armazenamento podem ser aceitas e lembradas como parte da definição da tabela. Essas opções, então, se aplicam se você usar posteriormente `ALTER TABLE` para converter a tabela para usar um motor de armazenamento diferente.

* `ENGINE`

Especifica o motor de armazenamento para a tabela, usando um dos nomes mostrados na tabela a seguir. O nome do motor pode ser não citado ou citado. O nome citado `'DEFAULT'` é reconhecido, mas ignorado.

  <table summary="Storage engine names permitted for the ENGINE table option and a description of each engine."><col style="width: 25%"/><col style="width: 70%"/><thead><tr> <th>Storage Engine</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td>Tabelas seguras para transações com bloqueio de linha e chaves externas. O mecanismo de armazenamento padrão para novas tabelas. Veja o Capítulo 17.<i>O motor de armazenamento InnoDB</i>, e, em particular, a Seção 17.1, “Introdução ao InnoDB”, se você tem experiência com MySQL, mas é novo<code>InnoDB</code>.</td> </tr><tr> <td><code>MyISAM</code></td> <td>O motor de armazenamento portátil binário que é utilizado principalmente para cargas de trabalho de leitura somente ou de leitura predominantemente. Veja a Seção 18.2, “O motor de armazenamento MyISAM”.</td> </tr><tr> <td><code>MEMORY</code></td> <td>Os dados deste motor de armazenamento são armazenados apenas na memória. Veja a Seção 18.3, “O Motor de Armazenamento de MEMÓRIA”.</td> </tr><tr> <td><code>CSV</code></td> <td>Tabelas que armazenam linhas em formato de valores separados por vírgula. Veja a Seção 18.4, “O mecanismo de armazenamento CSV”.</td> </tr><tr> <td><code>ARCHIVE</code></td> <td>O mecanismo de armazenamento de arquivamento. Veja a Seção 18.5, “O Mecanismo de Armazenamento ARCHIVE”.</td> </tr><tr> <td><code>EXAMPLE</code></td> <td>Um exemplo de motor. Veja a Seção 18.9, “O MOTOR DE Armazenamento EXAMPLE”.</td> </tr><tr> <td><code>FEDERATED</code></td> <td>Motor de armazenamento que acessa tabelas remotas. Veja a Seção 18.8, “O motor de armazenamento FEDERATED”.</td> </tr><tr> <td><code>HEAP</code></td> <td>Isto é sinônimo de<code>MEMORY</code>.</td> </tr><tr> <td><code>MERGE</code></td> <td>Uma coleção de<code>MyISAM</code>mesas usadas como uma mesa. Também conhecidas como<code>MRG_MyISAM</code>Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.</td> </tr><tr> <td><code>NDB</code></td> <td>Tabelas agrupadas, tolerantes a falhas, baseadas em memória, que suportam transações e chaves estrangeiras. Também conhecidas como<code>NDBCLUSTER</code>Veja o Capítulo 25.<i>MySQL NDB Cluster 8.0</i>.</td> </tr></tbody></table>

Por padrão, se um mecanismo de armazenamento for especificado que não está disponível, a declaração falha com um erro. Você pode sobrepor esse comportamento removendo `NO_ENGINE_SUBSTITUTION` do modo SQL do servidor (consulte Seção 7.1.11, “Modos SQL do servidor”) para que o MySQL permita a substituição do mecanismo especificado pelo mecanismo de armazenamento padrão, em vez disso. Normalmente, nesse caso, é `InnoDB`, que é o valor padrão para a variável de sistema `default_storage_engine`. Quando `NO_ENGINE_SUBSTITUTION` é desativado, uma mensagem de aviso ocorre se a especificação do mecanismo de armazenamento não for respeitada.

* `AUTOEXTEND_SIZE`

Define a quantidade pela qual `InnoDB` estende o tamanho do espaço de tabela quando ele se torna cheio. Introduzido no MySQL 8.0.23. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o espaço de tabela seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND_SIZE do espaço de tabela”.

* `AUTO_INCREMENT`

O valor inicial `AUTO_INCREMENT` para a tabela. No MySQL 8.0, isso funciona para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `ARCHIVE`. Para definir o primeiro valor de auto-incremento para motores que não suportam a opção de tabela `AUTO_INCREMENT`, insira uma linha “falsa” com um valor menor que o desejado após a criação da tabela, e depois exclua a linha falsa.

Para motores que suportam a opção da tabela `AUTO_INCREMENT` nas declarações de `CREATE TABLE`, você também pode usar `ALTER TABLE tbl_name AUTO_INCREMENT = N` para redefinir o valor de `AUTO_INCREMENT`. O valor não pode ser definido como menor que o valor máximo atualmente na coluna.

* `AVG_ROW_LENGTH`

Uma aproximação do comprimento médio da linha para sua tabela. Você precisa definir isso apenas para tabelas grandes com linhas de tamanho variável.

Quando você cria uma tabela `MyISAM`, o MySQL usa o produto das opções `MAX_ROWS` e `AVG_ROW_LENGTH` para decidir quão grande será a tabela resultante. Se você não especificar nenhuma dessas opções, o tamanho máximo para os arquivos de dados e índice `MyISAM` é 256TB por padrão. (Se o seu sistema operacional não suporta arquivos desse tamanho, os tamanhos das tabelas são limitados pelo limite de tamanho do arquivo.) Se você deseja manter os tamanhos dos ponteiros baixos para fazer o índice menor e mais rápido e não precisa realmente de grandes arquivos, você pode diminuir o tamanho padrão do ponteiro definindo a variável de sistema `myisam_data_pointer_size`. (Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.) Se você deseja que todas as suas tabelas possam crescer acima do limite padrão e está disposto a ter suas tabelas ligeiramente mais lentas e maiores do que o necessário, você pode aumentar o tamanho padrão do ponteiro definindo essa variável. Definir o valor para 7 permite tamanhos de tabela de até 65.536TB.

* `[DEFAULT] CHARACTER SET`

Especifica um conjunto de caracteres padrão para a tabela. `CHARSET` é sinônimo de `CHARACTER SET`. Se o nome do conjunto de caracteres for `DEFAULT`, o conjunto de caracteres do banco de dados é usado.

* `CHECKSUM`

Defina este valor em 1 se quiser que o MySQL mantenha um checksum em tempo real para todas as linhas (ou seja, um checksum que o MySQL atualiza automaticamente à medida que a tabela muda). Isso torna a tabela um pouco mais lenta para atualização, mas também facilita a localização de tabelas corrompidas. A declaração `CHECKSUM TABLE` (checksum-table.html "15.7.3.3 CHECKSUM TABLE Statement") relata o checksum. (Apenas `MyISAM`.)

* `[DEFAULT] COLLATE`

Especifica uma agregação padrão para a tabela.

* `COMMENT`

Um comentário para a tabela, com até 2048 caracteres.

Você pode definir o valor `InnoDB` da tabela usando a cláusula `MERGE_THRESHOLD` `table_option`. Veja a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

**Definindo as opções de NDB_TABLE.**

O comentário da tabela em um `CREATE TABLE` que cria uma tabela `NDB` ou uma declaração `ALTER TABLE` que pode ser alterada também pode ser usado para especificar de um a quatro dos `NDB_TABLE` opções `NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE` ou `FULLY_REPLICATED` como um conjunto de pares nome-valor, separados por vírgulas, se necessário, imediatamente após a string `NDB_TABLE=` que começa o texto do comentário citado. Um exemplo de declaração usando essa sintaxe é mostrado aqui (texto destacado):

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

Espaços não são permitidos na string citada. A string é sensível a maiúsculas e minúsculas.

O comentário é exibido como parte da saída de `SHOW CREATE TABLE`. O texto do comentário também está disponível como a coluna TABLE_COMMENT da tabela Schema de Informações MySQL `TABLES`.

Essa sintaxe de comentário também é suportada com declarações `ALTER TABLE` para tabelas `NDB`. Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter tido anteriormente.

Definir a opção `MERGE_THRESHOLD` nos comentários da tabela não é suportada para as tabelas `NDB` (é ignorada).

Para informações completas sobre sintaxe e exemplos, consulte a Seção 15.1.20.12, “Definindo opções de comentário NDB”.

* `COMPRESSION`

O algoritmo de compressão utilizado para a compressão de nível de página para as tabelas `InnoDB`. Os valores suportados incluem `Zlib`, `LZ4` e `None`. O atributo `COMPRESSION` foi introduzido com a característica de compressão transparente de página. A compressão de página só é suportada com tabelas `InnoDB` que residem em espaços de tabela por arquivo, e está disponível apenas em plataformas Linux e Windows que suportam arquivos esparsos e perfuração de buracos. Para mais informações, consulte a Seção 17.9.2, “Compressão de Página InnoDB”.

* `CONNECTION`

A cadeia de conexão para uma tabela `FEDERATED`.

Nota

Versões mais antigas do MySQL usavam uma opção `COMMENT` para a string de conexão.

* `DATA DIRECTORY`, `INDEX DIRECTORY`

Para `InnoDB`, a cláusula `DATA DIRECTORY='directory'` permite a criação de tabelas fora do diretório de dados. A variável `innodb_file_per_table` deve ser habilitada para usar a cláusula `DATA DIRECTORY`. O caminho completo do diretório deve ser especificado. A partir do MySQL 8.0.21, o diretório especificado deve ser conhecido por `InnoDB`. Para mais informações, consulte a Seção 17.6.1.2, “Criando Tabelas Externamente”.

Ao criar as tabelas `MyISAM`, você pode usar a cláusula `DATA DIRECTORY='directory'`, a cláusula `INDEX DIRECTORY='directory'` ou ambas. Elas especificam onde colocar o arquivo de dados e o arquivo de índice da tabela `MyISAM`, respectivamente. Ao contrário das tabelas `InnoDB`, o MySQL não cria subdiretórios que correspondam ao nome do banco de dados ao criar uma tabela `MyISAM` com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY`. Os arquivos são criados no diretório especificado.

Você deve ter o privilégio `FILE` para usar a opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`.

Importante

As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas para tabelas particionadas. (Bug #32091)

Essas opções funcionam apenas quando você não está usando a opção `--skip-symbolic-links`. Seu sistema operacional também deve ter uma chamada `realpath()` segura e confiável em relação aos threads. Consulte a Seção 10.12.2.2, “Usando Links Simbólicos para Tabelas MyISAM em Unix”, para obter informações mais completas.

Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se `MyISAM` encontrar um arquivo `.MYD` existente neste caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, inicie o servidor com a opção `--keep_files_on_create`, caso em que `MyISAM` não sobrescreverá os arquivos existentes e retornará um erro em vez disso.

Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo existente `.MYD` ou `.MYI` for encontrado, `MyISAM` sempre retorna um erro e não sobrescreve um arquivo no diretório especificado.

Importante

Você não pode usar nomes de caminho que contenham o diretório de dados MySQL com `DATA DIRECTORY` ou `INDEX DIRECTORY`. Isso inclui tabelas particionadas e particionamentos de tabelas individuais. (Veja o Bug #32167.)

* `DELAY_KEY_WRITE`

Defina este valor em 1 se deseja adiar as atualizações principais da tabela até que a tabela seja fechada. Consulte a descrição da variável de sistema `delay_key_write` na Seção 7.1.8, “Variáveis do sistema do servidor”. (Apenas `MyISAM`).

* `ENCRYPTION`

A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para uma tabela `InnoDB`. Um plugin de chave deve ser instalado e configurado antes que a criptografia possa ser habilitada. Antes do MySQL 8.0.16, a cláusula `ENCRYPTION` só pode ser especificada ao criar uma tabela em um espaço de tabela por arquivo. A partir do MySQL 8.0.16, a cláusula `ENCRYPTION` também pode ser especificada ao criar uma tabela em um espaço de tabela geral.

A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, ela só funciona se o motor de armazenamento padrão for `InnoDB`, ou se a declaração `CREATE TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a declaração é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

A partir do MySQL 8.0.16, uma tabela herda a criptografia de esquema padrão se uma cláusula `ENCRYPTION` não for especificada. Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para criar uma tabela com uma configuração da cláusula `ENCRYPTION` que difere da criptografia de esquema padrão. Ao criar uma tabela em um espaço de tabelas geral, a criptografia da tabela e do espaço de tabelas deve corresponder.

A partir do MySQL 8.0.16, especificar uma cláusula `ENCRYPTION` com um valor diferente de `'N'` ou `''` não é permitido ao usar um mecanismo de armazenamento que não suporte criptografia. Anteriormente, a cláusula era aceita.

Para mais informações, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”.

As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de tabela para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE TABLE t1 (c1 INT) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Nesse caso, o último valor especificado é utilizado.

Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, e também não são apagados quando o mecanismo de armazenamento da tabela é alterado.

* `INSERT_METHOD`

Se você deseja inserir dados em uma tabela `MERGE`, deve especificar com `INSERT_METHOD` a tabela na qual a linha deve ser inserida. `INSERT_METHOD` é uma opção útil apenas para tabelas `MERGE`. Use um valor de `FIRST` ou `LAST` para que as inserções sejam feitas na primeira ou última tabela, ou um valor de `NO` para impedir inserções. Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.

* `KEY_BLOCK_SIZE`

Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos da chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor do nível de tabela `KEY_BLOCK_SIZE`.

Para as tabelas `InnoDB`, `KEY_BLOCK_SIZE` especifica o tamanho da página em kilobytes a ser usado para as tabelas `InnoDB` comprimidas. O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; um tamanho diferente pode ser usado por `InnoDB`, se necessário. `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor `innodb_page_size`. Um valor de 0 representa o tamanho de página comprimida padrão, que é metade do valor `innodb_page_size`. Dependendo de `innodb_page_size`, os possíveis valores `KEY_BLOCK_SIZE` incluem 0, 1, 2, 4, 8 e 16. Consulte a Seção 17.9.1, “Compressão de Tabela InnoDB”, para obter mais informações.

A Oracle recomenda habilitar `innodb_strict_mode` ao especificar `KEY_BLOCK_SIZE` para tabelas de `InnoDB`. Quando `innodb_strict_mode` está habilitado, especificar um valor inválido de `KEY_BLOCK_SIZE` retorna um erro. Se `innodb_strict_mode` estiver desativado, um valor inválido de `KEY_BLOCK_SIZE` resulta em um aviso, e a opção `KEY_BLOCK_SIZE` é ignorada.

A coluna `Create_options`, em resposta a `SHOW TABLE STATUS`, relata o `KEY_BLOCK_SIZE` real utilizado pela tabela, assim como a `SHOW CREATE TABLE`.

`InnoDB` só suporta `KEY_BLOCK_SIZE` no nível da tabela.

`KEY_BLOCK_SIZE` não é suportado com valores de 32KB e 64KB `innodb_page_size`. A compressão da tabela `InnoDB` não suporta esses tamanhos de página.

`InnoDB` não suporta a opção `KEY_BLOCK_SIZE` ao criar tabelas temporárias.

* `MAX_ROWS`

O número máximo de linhas que você planeja armazenar na tabela. Esse não é um limite rígido, mas sim uma dica para o mecanismo de armazenamento de que a tabela deve ser capaz de armazenar pelo menos esse número de linhas.

Importante

O uso de `MAX_ROWS` com as tabelas `NDB` para controlar o número de partições de tabela é descontinuado. Ele continua sendo suportado em versões posteriores para compatibilidade reversa, mas está sujeito à remoção em uma versão futura. Use PARTITION_BALANCE em vez disso; veja Configurando opções de NDB_TABLE.

O motor de armazenamento `NDB` trata esse valor como máximo. Se você planeja criar tabelas muito grandes do NDB Cluster (contendo milhões de linhas), você deve usar essa opção para garantir que `NDB` aloque um número suficiente de slots de índice na tabela hash usada para armazenar os hashes das chaves primárias da tabela, definindo `MAX_ROWS = 2 * rows`, onde *`rows`* é o número de linhas que você espera inserir na tabela.

O valor máximo do `MAX_ROWS` é 4294967295; valores maiores são truncados até esse limite.

* `MIN_ROWS`

O número mínimo de linhas que você planeja armazenar na tabela. O mecanismo de armazenamento `MEMORY` usa essa opção como uma dica sobre o uso de memória.

* `PACK_KEYS`

É eficaz apenas com as tabelas `MyISAM`. Defina esta opção para 1 se desejar índices menores. Isso geralmente torna as atualizações mais lentas e as leituras mais rápidas. Definir a opção para 0 desativa todos os pacotes de chaves. Definir para `DEFAULT` indica ao motor de armazenamento que apenas pacotes colunas longas `CHAR`, `VARCHAR`, `BINARY` ou `VARBINARY` devem ser pacotadas.

Se você não usar `PACK_KEYS`, o padrão é embalar strings, mas não números. Se você usar `PACK_KEYS=1`, os números também são embalados.

Ao embalar chaves de número binário, o MySQL usa compressão prefixada:

+ Cada chave precisa de um byte extra para indicar quantos bytes da chave anterior são iguais para a próxima chave.

+ O ponteiro para a linha é armazenado em ordem de alto byte primeiro, diretamente após a chave, para melhorar a compressão.

Isso significa que, se você tiver muitas chaves iguais em duas linhas consecutivas, todas as chaves seguintes geralmente levam apenas dois bytes (incluindo o ponteiro para a linha). Compare isso com o caso comum em que as chaves seguintes levam `storage_size_for_key + pointer_size` (onde o tamanho do ponteiro geralmente é 4). Por outro lado, você obtém um benefício significativo da compressão prefixal apenas se tiver muitas números iguais. Se todas as chaves forem totalmente diferentes, você usa um byte a mais por chave, se a chave não for uma chave que pode ter valores de `NULL` (Neste caso, o comprimento da chave compactada é armazenado no mesmo byte que é usado para marcar se uma chave é `NULL`.).

* `PASSWORD`

Esta opção não é utilizada.

* `ROW_FORMAT`

Define o formato físico no qual as linhas são armazenadas.

Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do motor de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format` em resposta ao `SHOW TABLE STATUS`(show-table-status.html "15.7.7.38 SHOW TABLE STATUS Statement"). A coluna `Create_options` mostra o formato de linha que foi especificado na declaração `CREATE TABLE`, assim como o `SHOW CREATE TABLE`.

As opções de formato de linha variam dependendo do mecanismo de armazenamento utilizado para a tabela.

Para as tabelas `InnoDB`:

+ O formato de linha padrão é definido por `innodb_default_row_format`, que tem um ajuste padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção `ROW_FORMAT` não é definida ou quando `ROW_FORMAT=DEFAULT` é usado.

Se a opção `ROW_FORMAT` não for definida, ou se `ROW_FORMAT=DEFAULT` for usado, as operações que reconstroem uma tabela também alteram silenciosamente o formato da linha da tabela para o padrão definido por `innodb_default_row_format`. Para mais informações, consulte Definindo o Formato da Linha de uma Tabela.

+ Para um armazenamento mais eficiente dos tipos de dados, especialmente os tipos `BLOB`, use o `DYNAMIC`. Veja o Formato Dinâmico de Linha para requisitos associados ao formato de linha `DYNAMIC`.

+ Para habilitar a compressão para as tabelas `InnoDB`, especifique `ROW_FORMAT=COMPRESSED`. A opção `ROW_FORMAT=COMPRESSED` não é suportada ao criar tabelas temporárias. Consulte a Seção 17.9, “Compressão de Tabela e Página InnoDB”, para requisitos associados ao formato da linha `COMPRESSED`.

+ O formato de linha usado em versões mais antigas do MySQL ainda pode ser solicitado especificando o formato de linha `REDUNDANT`.

+ Quando especificar uma cláusula não padrão do `ROW_FORMAT`, considere também habilitar a opção de configuração do `innodb_strict_mode`.

+ `ROW_FORMAT=FIXED` não é suportado. Se `ROW_FORMAT=FIXED` é especificado enquanto `innodb_strict_mode` está desativado, `InnoDB` emite um aviso e assume `ROW_FORMAT=DYNAMIC`. Se `ROW_FORMAT=FIXED` é especificado enquanto `innodb_strict_mode` está habilitado, que é o padrão, `InnoDB` retorna um erro.

+ Para informações adicionais sobre os formatos de linha do registro `InnoDB`, consulte a Seção 17.10, “Formatos de linha do InnoDB”.

Para as tabelas `MyISAM`, o valor da opção pode ser `FIXED` ou `DYNAMIC` para formato de linha estático ou de comprimento variável. **myisampack** define o tipo como `COMPRESSED`. Veja a Seção 18.2.3, “Formatos de Armazenamento de Tabela MyISAM”.

Para as tabelas de `NDB`, o padrão de `ROW_FORMAT` é `DYNAMIC`.

* `START TRANSACTION`

Esta é uma opção de tabela para uso interno. Foi introduzida no MySQL 8.0.21 para permitir que `CREATE TABLE ... SELECT` seja registrado como uma transação única e atômica no log binário ao usar replicação baseada em linha com um mecanismo de armazenamento que suporte DDL atômico. Somente as declarações `CREATE TABLE ... START TRANSACTION`, `STATS_AUTO_RECALC`, e [[PH_ICD_2884]] são permitidas após `CREATE TABLE ... START TRANSACTION`. Para informações relacionadas, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômica”.

* `STATS_AUTO_RECALC`

Especifica se a recálculo automático de [estatísticas persistentes][(glossary.html#glos_persistent_statistics "persistent statistics")] para uma tabela `InnoDB` deve ser realizado. O valor `DEFAULT` faz com que o ajuste das estatísticas persistentes para a tabela seja determinado pela opção de configuração `innodb_stats_auto_recalc`. O valor `1` faz com que as estatísticas sejam recálculado quando 10% dos dados na tabela forem alterados. O valor `0` impede o recálculo automático para esta tabela; com este ajuste, emita uma declaração `ANALYZE TABLE` para recálculo das estatísticas após fazer alterações substanciais na tabela. Para mais informações sobre o recurso de estatísticas persistentes, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Optimizer Pessoalizado”.

* `STATS_PERSISTENT`

Especifica se deve habilitar as estatísticas persistentes para uma tabela (glossary.html#glos_persistent_statistics "persistent statistics"). O valor `InnoDB` faz com que o ajuste das estatísticas persistentes para a tabela seja determinado pela opção de configuração `DEFAULT`. O valor `innodb_stats_persistent` habilita estatísticas persistentes para a tabela, enquanto o valor `1` desativa essa funcionalidade. Após habilitar as estatísticas persistentes por meio de uma declaração `CREATE TABLE` ou `ALTER TABLE`, emita uma declaração `ANALYZE TABLE` para calcular as estatísticas, após carregar dados representativos na tabela. Para mais informações sobre a funcionalidade de estatísticas persistentes, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Optimizer Persistente”.

* `STATS_SAMPLE_PAGES`

O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"). Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Optimizer Persistente”.

* `TABLESPACE`

A cláusula `TABLESPACE` pode ser usada para criar uma tabela `InnoDB` em um espaço de tabelas geral existente, um espaço de tabelas por arquivo ou o espaço de tabelas do sistema.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

O espaço de tabela geral que você especificar deve existir antes de usar a cláusula `TABLESPACE`. Para informações sobre espaços de tabela gerais, consulte a Seção 17.6.3.3, “Espaços de tabela geral”.

O `tablespace_name` é um identificador sensível a maiúsculas e minúsculas. Ele pode ser citado ou não citado. O caractere lombo ("/") não é permitido. Os nomes que começam com "innodb_" são reservados para uso especial.

Para criar uma tabela no espaço de tabelas do sistema, especifique `innodb_system` como o nome do espaço de tabelas.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

Usando `TABLESPACE [=] innodb_system`, você pode colocar uma tabela de qualquer formato de linha não compactada no espaço de tabelas do sistema, independentemente da configuração do `innodb_file_per_table`. Por exemplo, você pode adicionar uma tabela com `ROW_FORMAT=DYNAMIC` ao espaço de tabelas do sistema usando `TABLESPACE [=] innodb_system`.

Para criar uma tabela em um espaço de tabela por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabela.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

Nota

Se `innodb_file_per_table` estiver habilitado, você não precisa especificar `TABLESPACE=innodb_file_per_table` para criar um espaço de tabela por tabela `InnoDB`. As tabelas `InnoDB` são criadas em espaços de tabela por tabela por padrão quando `innodb_file_per_table` está habilitado.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas, de outra forma, não é suportada para uso em combinação com a cláusula `TABLESPACE`. A partir do MySQL 8.0.21, o diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido por `InnoDB`. Para mais informações, consulte o uso da cláusula DATA DIRECTORY.

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com [`CREATE TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") é descontinuado a partir do MySQL 8.0.13; espere que ele seja removido em uma versão futura do MySQL.

A opção de tabela `STORAGE` é empregada apenas com tabelas `NDB`. `STORAGE` determina o tipo de armazenamento utilizado e pode ser de `DISK` ou `MEMORY`.

`TABLESPACE ... STORAGE DISK` atribui uma tabela a um espaço de dados de disco de NDB Cluster. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por *`tablespace_name`*.

Para `STORAGE MEMORY`, o nome do tablespace é opcional, portanto, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está em memória.

Consulte a Seção 25.6.11, “Tabelas de dados de disco do cluster NDB”, para obter mais informações.

* `UNION`

Usado para acessar uma coleção de tabelas `MyISAM` idênticas como uma única. Isso funciona apenas com tabelas `MERGE`. Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.

Você deve ter os privilégios `SELECT`, `UPDATE` e `DELETE` para as tabelas que você mapeia para uma tabela `MERGE`.

Nota

Anteriormente, todas as tabelas utilizadas tinham que estar no mesmo banco de dados que a própria tabela `MERGE`. Essa restrição não se aplica mais.

#### Partição de tabela

*`partition_options`* pode ser usado para controlar a partição da tabela criada com `CREATE TABLE`.

Nem todas as opções exibidas na sintaxe para *`partition_options`* no início desta seção estão disponíveis para todos os tipos de particionamento. Consulte as listas dos seguintes tipos individuais para informações específicas a cada tipo, e consulte o Capítulo 26, *Particionamento*, para obter informações mais completas sobre o funcionamento e os usos do particionamento no MySQL, bem como exemplos adicionais de criação de tabelas e outras declarações relacionadas ao particionamento do MySQL.

As partições podem ser modificadas, unidas, adicionadas a tabelas e removidas de tabelas. Para informações básicas sobre as declarações MySQL para realizar essas tarefas, consulte a Seção 15.1.9, “Declaração ALTER TABLE”. Para descrições e exemplos mais detalhados, consulte a Seção 26.3, “Gestão de Partições”.

* `PARTITION BY`

Se utilizada, uma cláusula *`partition_options`* começa com `PARTITION BY`. Esta cláusula contém a função que é usada para determinar a partição; a função retorna um valor inteiro variando de 1 a *`num`*, onde *`num`* é o número de partições. (O número máximo de partições definidas pelo usuário que uma tabela pode conter é 1024; o número de subpartições—discutido mais tarde nesta seção—está incluído neste máximo.)

Nota

A expressão (*`expr`*) usada em uma cláusula `PARTITION BY` não pode se referir a quaisquer colunas que não estejam na tabela que está sendo criada; tais referências não são especificamente permitidas e causam o erro na declaração. (Bug #29444)

* `HASH(expr)`

Hashar uma ou mais colunas para criar uma chave para posicionar e localizar linhas. *`expr`* é uma expressão que usa uma ou mais colunas da tabela. Isso pode ser qualquer expressão válida do MySQL (incluindo funções do MySQL) que produza um único valor inteiro. Por exemplo, estas são ambas as declarações válidas `CREATE TABLE` usando `PARTITION BY HASH`:

  ```
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

Você não pode usar nenhuma das cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY HASH`.

`PARTITION BY HASH` utiliza o resto de *`expr`* dividido pelo número de partições (ou seja, o módulo). Para exemplos e informações adicionais, consulte a Seção 26.2.4, “Partitionamento HASH”.

A palavra-chave `LINEAR` implica em um algoritmo um pouco diferente. Neste caso, o número da partição na qual uma linha é armazenada é calculado como o resultado de uma ou mais operações lógicas `AND`. Para discussão e exemplos de hashing linear, consulte a Seção 26.2.4.1, “Partitionamento de Hash Linear”.

* `KEY(column_list)`

Isso é semelhante ao `HASH`, exceto que o MySQL fornece a função de hashing para garantir uma distribuição de dados uniforme. O argumento *`column_list`* é simplesmente uma lista de 1 ou mais colunas da tabela (máximo: 16). Este exemplo mostra uma tabela simples dividida por chave, com 4 partições:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```

Para tabelas que são particionadas por chave, você pode empregar particionamento linear usando a palavra-chave `LINEAR`. Isso tem o mesmo efeito que com tabelas que são particionadas por `HASH`. Ou seja, o número da partição é encontrado usando o operador `&` em vez do módulo (consulte a Seção 26.2.4.1, “Particionamento HASH Linear”, e a Seção 26.2.5, “Particionamento por Chave”, para detalhes). Este exemplo usa particionamento linear por chave para distribuir dados entre 5 partições:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```

A opção `ALGORITHM={1 | 2}` é compatível com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chave que o MySQL 5.1; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chave implementadas e usadas por padrão para novas tabelas particionadas `KEY` no MySQL 5.5 e versões posteriores. (Tabelas particionadas criadas com as funções de hashing de chave empregadas no MySQL 5.5 e versões posteriores não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada ao uso principalmente ao atualizar ou desatualizar tabelas particionadas `[LINEAR] KEY` entre as versões MySQL 5.1 e posteriores, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1. Para mais informações, consulte a Seção 15.1.9.1, “Operações de Partição de Tabela”.

**mysqldump** escreve essa opção em comentários versionados.

`ALGORITHM=1` é exibido quando necessário na saída de `SHOW CREATE TABLE`, usando comentários versionados da mesma maneira que o **mysqldump**. `ALGORITHM=2` é sempre omitido na saída de `SHOW CREATE TABLE`, mesmo que essa opção tenha sido especificada ao criar a tabela original.

Você não pode usar nenhuma das cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY KEY`.

* `RANGE(expr)`

Neste caso, *`expr`* exibe uma faixa de valores usando um conjunto de operadores `VALUES LESS THAN`. Ao usar a partição de faixa, você deve definir pelo menos uma partição usando `VALUES LESS THAN`. Não é possível usar `VALUES IN` com partição de faixa.

Nota

Para tabelas particionadas por `RANGE`, `VALUES LESS THAN` deve ser usado com um valor literal inteiro ou uma expressão que avalie a um único valor inteiro. No MySQL 8.0, você pode superar essa limitação em uma tabela que é definida usando `PARTITION BY RANGE COLUMNS`, conforme descrito mais adiante nesta seção.

Suponha que você tenha uma tabela que deseja particionar em uma coluna contendo valores de ano, de acordo com o esquema a seguir.

  <table summary="A table partitioning scheme based on a column containing year values, as described in the preceding text. The table lists partition numbers and corresponding range of years."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Partition Number:</th> <th>Ano de produção:</th> </tr></thead><tbody><tr> <td>0</td> <td>1990 e anteriores</td> </tr><tr> <td>1</td> <td>1991 a 1994</td> </tr><tr> <td>2</td> <td>1995 a 1998</td> </tr><tr> <td>3</td> <td>1999 a 2002</td> </tr><tr> <td>4</td> <td>2003 a 2005</td> </tr><tr> <td>5</td> <td>2006 e posterior</td> </tr></tbody></table>

Uma tabela que implemente um esquema de particionamento desse tipo pode ser realizada pela declaração `CREATE TABLE` mostrada aqui:

  ```
  CREATE TABLE t1 (
      year_col  INT,
      some_data INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2002),
      PARTITION p4 VALUES LESS THAN (2006),
      PARTITION p5 VALUES LESS THAN MAXVALUE
  );
  ```

As declarações `PARTITION ... VALUES LESS THAN ...` funcionam de forma consecutiva. `VALUES LESS THAN MAXVALUE` trabalha para especificar valores "remanescentes" que são maiores que o valor máximo especificado de outra forma.

As cláusulas `VALUES LESS THAN` funcionam sequencialmente de uma maneira semelhante às partes `case` de um bloco `switch ... case` (como encontrado em muitos linguagens de programação, como C, Java e PHP). Isso significa que as cláusulas devem ser organizadas de tal forma que o limite superior especificado em cada `VALUES LESS THAN` sucessivo seja maior que o do anterior, com a que faz referência a `MAXVALUE` sendo a última de todas na lista.

* `RANGE COLUMNS(column_list)`

Esta variante de `RANGE` facilita o recorte de partições para consultas que utilizam condições de intervalo em várias colunas (ou seja, com condições como `WHERE a = 1 AND b < 10` ou `WHERE a = 1 AND b = 10 AND c < 10`). Permite que você especifique intervalos de valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES LESS THAN (value_list)`. (No caso mais simples, este conjunto consiste em uma única coluna.) O número máximo de colunas que podem ser referenciadas nos *`column_list`* e *`value_list`* é 16.

O *`column_list` utilizado na cláusula `COLUMNS` pode conter apenas nomes de colunas; cada coluna na lista deve ser um dos seguintes tipos de dados do MySQL: os tipos de inteiro; os tipos de cadeia; e os tipos de coluna de hora ou data. Colunas que utilizam `BLOB`, `TEXT`, `SET`, `ENUM`, `BIT` ou tipos de dados espaciais não são permitidas; colunas que utilizam tipos de número de ponto flutuante também não são permitidas. Além disso, você não pode usar funções ou expressões aritméticas na cláusula `COLUMNS`.

A cláusula `VALUES LESS THAN` usada em uma definição de partição deve especificar um valor literal para cada coluna que aparece na cláusula `COLUMNS()`; ou seja, a lista de valores usada para cada cláusula `VALUES LESS THAN` deve conter o mesmo número de valores que o número de colunas listadas na cláusula `COLUMNS`. Uma tentativa de usar mais ou menos valores em uma cláusula `VALUES LESS THAN` do que o número de valores na cláusula `COLUMNS` causa a declaração falhar com o erro Incoerência no uso de listas de colunas para particionamento.... Não é possível usar `NULL` para qualquer valor que apareça em `VALUES LESS THAN`. É possível usar `MAXVALUE` mais de uma vez para uma coluna dada, exceto a primeira, como mostrado neste exemplo:

  ```
  CREATE TABLE rc (
      a INT NOT NULL,
      b INT NOT NULL
  )
  PARTITION BY RANGE COLUMNS(a,b) (
      PARTITION p0 VALUES LESS THAN (10,5),
      PARTITION p1 VALUES LESS THAN (20,10),
      PARTITION p2 VALUES LESS THAN (50,MAXVALUE),
      PARTITION p3 VALUES LESS THAN (65,MAXVALUE),
      PARTITION p4 VALUES LESS THAN (MAXVALUE,MAXVALUE)
  );
  ```

Cada valor utilizado em uma lista de valores de `VALUES LESS THAN` deve corresponder exatamente ao tipo da coluna correspondente; nenhuma conversão é feita. Por exemplo, você não pode usar a string `'1'` para um valor que corresponda a uma coluna que usa um tipo de número inteiro (você deve usar o numeral `1` em vez disso), e também não pode usar o numeral `1` para um valor que corresponda a uma coluna que usa um tipo de string (nesse caso, você deve usar uma string citada: `'1'`).

Para mais informações, consulte a Seção 26.2.1, “Particionamento de RANG”, e a Seção 26.4, “Rutura de Partição”.

* `LIST(expr)`

Isso é útil ao atribuir partições com base em uma coluna de tabela com um conjunto restrito de valores possíveis, como um código de estado ou país. Nesse caso, todas as linhas relacionadas a um determinado estado ou país podem ser atribuídas a uma única partição, ou uma partição pode ser reservada para um determinado conjunto de estados ou países. É semelhante ao `RANGE`, exceto que apenas `VALUES IN` pode ser usado para especificar valores permitidos para cada partição.

`VALUES IN` é usado com uma lista de valores a serem correspondidos. Por exemplo, você pode criar um esquema de partição como o seguinte:

  ```
  CREATE TABLE client_firms (
      id   INT,
      name VARCHAR(35)
  )
  PARTITION BY LIST (id) (
      PARTITION r0 VALUES IN (1, 5, 9, 13, 17, 21),
      PARTITION r1 VALUES IN (2, 6, 10, 14, 18, 22),
      PARTITION r2 VALUES IN (3, 7, 11, 15, 19, 23),
      PARTITION r3 VALUES IN (4, 8, 12, 16, 20, 24)
  );
  ```

Ao usar a partição de lista, você deve definir pelo menos uma partição usando `VALUES IN`. Não é possível usar `VALUES LESS THAN` com `PARTITION BY LIST`.

Nota

Para tabelas particionadas por `LIST`, a lista de valores usada com `VALUES IN` deve consistir apenas em valores inteiros. No MySQL 8.0, você pode superar essa limitação usando a particionamento por `LIST COLUMNS`, que é descrito mais adiante nesta seção.

* `LIST COLUMNS(column_list)`

Esta variante de `LIST` facilita o recorte de partições para consultas que utilizam condições de comparação em várias colunas (ou seja, com condições como `WHERE a = 5 AND b = 5` ou `WHERE a = 1 AND b = 10 AND c = 5`). Permite especificar valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES IN (value_list)`.

As regras que regem os tipos de dados para a lista de colunas usadas em `LIST COLUMNS(column_list)` e a lista de valores usados em `VALUES IN(value_list)` são as mesmas que as usadas para a lista de colunas em `RANGE COLUMNS(column_list)` e a lista de valores em `VALUES LESS THAN(value_list)`, respectivamente, exceto que na cláusula de `VALUES IN`, `MAXVALUE` não é permitido e você pode usar `NULL`.

Há uma diferença importante entre a lista de valores usada para `VALUES IN` em oposição a quando é usada com `PARTITION BY LIST COLUMNS`, em oposição a quando é usada com `PARTITION BY LIST`. Quando usada com `PARTITION BY LIST COLUMNS`, cada elemento na cláusula `VALUES IN` deve ser um *conjunto* de valores de coluna; o número de valores em cada conjunto deve ser o mesmo que o número de colunas usadas na cláusula `COLUMNS`, e os tipos de dados desses valores devem corresponder aos dos colunas (e ocorrer no mesmo ordem). No caso mais simples, o conjunto consiste em uma única coluna. O número máximo de colunas que podem ser usadas no *`column_list`* e nos elementos que compõem o *`value_list`* é 16.

A tabela definida pela seguinte declaração `CREATE TABLE` fornece um exemplo de uma tabela que utiliza a partição `LIST COLUMNS`:

  ```
  CREATE TABLE lc (
      a INT NULL,
      b INT NULL
  )
  PARTITION BY LIST COLUMNS(a,b) (
      PARTITION p0 VALUES IN( (0,0), (NULL,NULL) ),
      PARTITION p1 VALUES IN( (0,1), (0,2), (0,3), (1,1), (1,2) ),
      PARTITION p2 VALUES IN( (1,0), (2,0), (2,1), (3,0), (3,1) ),
      PARTITION p3 VALUES IN( (1,3), (2,2), (2,3), (3,2), (3,3) )
  );
  ```

* `PARTITIONS num`

O número de divisões pode ser especificado opcionalmente com uma cláusula `PARTITIONS num`, onde *`num`* é o número de divisões. Se ambas as cláusulas *e* quaisquer cláusulas `PARTITION` forem usadas, *`num`* deve ser igual ao número total de quaisquer divisões declaradas usando cláusulas `PARTITION`.

Nota

Se você usa ou não uma cláusula `PARTITIONS` ao criar uma tabela que é particionada por `RANGE` ou `LIST`, você ainda deve incluir pelo menos uma cláusula `PARTITION VALUES` na definição da tabela (veja abaixo).

* `SUBPARTITION BY`

Uma partição pode ser dividida opcionalmente em vários subpartições. Isso pode ser indicado usando a cláusula opcional `SUBPARTITION BY`. A subpartição pode ser feita por `HASH` ou `KEY`. Qualquer uma dessas pode ser `LINEAR`. Essas funcionam da mesma maneira que as descritas anteriormente para os tipos de partição equivalentes. (Não é possível subpartição por `LIST` ou `RANGE`).

O número de subdivisões pode ser indicado usando a palavra-chave `SUBPARTITIONS` seguida de um valor numérico.

* É aplicada uma verificação rigorosa do valor utilizado nas cláusulas `PARTITIONS` ou `SUBPARTITIONS`, e esse valor deve atender às seguintes regras:

+ O valor deve ser um número inteiro positivo e não nulo.
+ Não são permitidas zeros no início.
+ O valor deve ser um literal inteiro e não pode ser uma expressão. Por exemplo, `PARTITIONS 0.2E+01` não é permitido, embora `0.2E+01` avalie a `2`. (Bug #15890)

* `partition_definition`

Cada partição pode ser definida individualmente usando uma cláusula *`partition_definition`*. As partes individuais que compõem essa cláusula são as seguintes:

+ `PARTITION partition_name`

Especifica um nome lógico para a partição.

+ `VALUES`

Para a partição por faixa, cada partição deve incluir uma cláusula `VALUES LESS THAN`; para a partição por lista, você deve especificar uma cláusula `VALUES IN` para cada partição. Isso é usado para determinar quais linhas devem ser armazenadas nesta partição. Consulte as discussões sobre os tipos de partição no Capítulo 26, *Partição*, para exemplos de sintaxe.

+ `[STORAGE] ENGINE`

O MySQL aceita a opção `[STORAGE] ENGINE` tanto para `PARTITION` quanto para `SUBPARTITION`. Atualmente, a única maneira de usar essa opção é definir todas as partições ou todas as subpartições no mesmo mecanismo de armazenamento, e uma tentativa de definir diferentes mecanismos de armazenamento para partições ou subpartições na mesma tabela gera o erro ERROR 1469 (HY000): A mistura de manipuladores nas partições não é permitida nesta versão do MySQL.

+ `COMMENT`

Uma cláusula opcional `COMMENT` pode ser usada para especificar uma string que descreva a partição. Exemplo:

    ```
    COMMENT = 'Data for the years previous to 1999'
    ```

O comprimento máximo para um comentário de partição é de 1024 caracteres.

+ `DATA DIRECTORY` e `INDEX DIRECTORY`

`DATA DIRECTORY` e `INDEX DIRECTORY` podem ser usados para indicar o diretório onde, respectivamente, os dados e os índices para esta partição devem ser armazenados. Tanto o `data_dir` quanto o `index_dir` devem ser nomes de caminho absoluto do sistema.

A partir do MySQL 8.0.21, o diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido por `InnoDB`. Para mais informações, consulte o uso da cláusula DATA DIRECTORY.

Você deve ter o privilégio `FILE` para usar a opção de partição `DATA DIRECTORY` ou `INDEX DIRECTORY`.

Exemplo:

    ```
    CREATE TABLE th (id INT, name VARCHAR(30), adate DATE)
    PARTITION BY LIST(YEAR(adate))
    (
      PARTITION p1999 VALUES IN (1995, 1999, 2003)
        DATA DIRECTORY = '/var/appdata/95/data'
        INDEX DIRECTORY = '/var/appdata/95/idx',
      PARTITION p2000 VALUES IN (1996, 2000, 2004)
        DATA DIRECTORY = '/var/appdata/96/data'
        INDEX DIRECTORY = '/var/appdata/96/idx',
      PARTITION p2001 VALUES IN (1997, 2001, 2005)
        DATA DIRECTORY = '/var/appdata/97/data'
        INDEX DIRECTORY = '/var/appdata/97/idx',
      PARTITION p2002 VALUES IN (1998, 2002, 2006)
        DATA DIRECTORY = '/var/appdata/98/data'
        INDEX DIRECTORY = '/var/appdata/98/idx'
    );
    ```

`DATA DIRECTORY` e `INDEX DIRECTORY` se comportam da mesma maneira que na cláusula *`table_option`* da declaração `CREATE TABLE` como utilizado para as tabelas `MyISAM`.

Um diretório de dados e um diretório de índice podem ser especificados por partição. Se não forem especificados, os dados e índices são armazenados, por padrão, no diretório do banco de dados da tabela.

As opções `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas ao criar tabelas particionadas se `NO_DIR_IN_CREATE` estiver em vigor.

+ `MAX_ROWS` e `MIN_ROWS`

Pode ser usado para especificar, respectivamente, o número máximo e mínimo de linhas a serem armazenadas na partição. Os valores para *`max_number_of_rows`* e *`min_number_of_rows`* devem ser números inteiros positivos. Assim como as opções de nível de tabela com os mesmos nomes, essas atuam apenas como “sugestões” para o servidor e não são limites rígidos.

+ `TABLESPACE`

Pode ser usado para designar um espaço de tabela por arquivo `InnoDB` para a partição, especificando `` TABLESPACE `innodb_file_per_table` ``. Todas as partições devem pertencer ao mesmo mecanismo de armazenamento.

A colocação de partições de tabelas `InnoDB` em espaços de tabela `InnoDB` compartilhados não é suportada. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais.

* `subpartition_definition`

A definição de partição pode opcionalmente conter uma ou mais cláusulas *`subpartition_definition`*. Cada uma dessas consiste, no mínimo, no `SUBPARTITION name`, onde *`name`* é um identificador para a subpartição. Exceto pela substituição da palavra-chave `PARTITION` pelo `SUBPARTITION`, a sintaxe para uma definição de subpartição é idêntica à de uma definição de partição.

A subpartição deve ser feita por `HASH` ou `KEY`, e só pode ser feita em partições de `RANGE` ou `LIST`. Veja a Seção 26.2.6, “Subpartição”.

**Divisão por Colunas Geradas**

A partição por colunas geradas é permitida. Por exemplo:

```
CREATE TABLE t1 (
  s1 INT,
  s2 INT AS (EXP(s1)) STORED
)
PARTITION BY LIST (s2) (
  PARTITION p1 VALUES IN (1)
);
```

A partição vê uma coluna gerada como uma coluna regular, o que permite contornar as limitações em funções que não são permitidas para partição (consulte a Seção 26.6.3, “Limitações de Partição Relativas a Funções”). O exemplo anterior demonstra essa técnica: `EXP()` não pode ser usado diretamente na cláusula `PARTITION BY`, mas uma coluna gerada definida usando `EXP()` é permitida.

#### 15.1.20.1 Arquivos criados por CREATE TABLE

Para uma tabela `InnoDB` criada em um espaço de tabelas por arquivo ou espaço de tabelas geral, os dados da tabela e os índices associados são armazenados em um arquivo .ibd no diretório do banco de dados. Quando uma tabela `InnoDB` é criada no espaço de tabelas do sistema, os dados da tabela e os índices são armazenados nos arquivos ibdata\* que representam o espaço de tabelas do sistema. A opção `innodb_file_per_table` controla se as tabelas são criadas em espaços de tabelas por arquivo ou no espaço de tabelas do sistema, por padrão. A opção `TABLESPACE` pode ser usada para colocar uma tabela em um espaço de tabelas por arquivo, espaço de tabelas geral ou no espaço de tabelas do sistema, independentemente da configuração `innodb_file_per_table`.

Para as tabelas `MyISAM`, o mecanismo de armazenamento cria arquivos de dados e índices. Assim, para cada tabela `MyISAM` *`tbl_name`*, existem dois arquivos de disco.

<table summary="The purpose of MyISAM table tbl_name disk files."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

O Capítulo 18, *Motores de Armazenamento Alternativos*, descreve quais arquivos cada motor de armazenamento cria para representar tabelas. Se o nome de uma tabela contiver caracteres especiais, os nomes dos arquivos da tabela contêm versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores a Nomes de Arquivo”.

#### 15.1.20.2 Declaração de criação de tabela temporária

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é descartada automaticamente quando a sessão é fechada. Isso significa que duas sessões diferentes podem usar o mesmo nome de tabela temporária sem conflitar entre si ou com uma tabela não `TEMPORARY` existente do mesmo nome. (A tabela existente é oculta até que a tabela temporária seja descartada.)

`InnoDB` não suporta tabelas temporárias compactadas. Quando `innodb_strict_mode` está habilitado (o padrão), `CREATE TEMPORARY TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") retorna um erro se `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` for especificado. Se `innodb_strict_mode` estiver desativado, avisos são emitidos e a tabela temporária é criada usando um formato de linha não compactado. A opção `innodb_file_per-table` não afeta a criação de tabelas temporárias `InnoDB`.

`CREATE TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

As tabelas `TEMPORARY` têm uma relação muito laxa com bancos de dados (esquemas). A eliminação de um banco de dados não elimina automaticamente quaisquer tabelas `TEMPORARY` criadas dentro desse banco de dados.

Para criar uma tabela temporária, você deve ter o privilégio `CREATE TEMPORARY TABLES`. Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégio na tabela. A sessão que está criando pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`.

Uma implicação desse comportamento é que uma sessão pode manipular suas tabelas temporárias mesmo que o usuário atual não tenha privilégio para criá-las. Suponha que o usuário atual não tenha o privilégio `CREATE TEMPORARY TABLES`, mas seja capaz de executar um procedimento armazenado de contexto definidor que é executado com os privilégios de um usuário que tem `CREATE TEMPORARY TABLES` e que cria uma tabela temporária. Enquanto o procedimento é executado, a sessão usa os privilégios do usuário definidor. Após o procedimento retornar, os privilégios efetivos retornam para os do usuário atual, que ainda pode ver a tabela temporária e realizar qualquer operação nela.

Você não pode usar `CREATE TEMPORARY TABLE ... LIKE` para criar uma tabela vazia com base na definição de uma tabela que reside no espaço de tabelas `mysql`, espaço de tabelas do sistema `InnoDB` (`innodb_system`), ou em um espaço de tabelas geral. A definição do espaço de tabelas para tal tabela inclui um atributo `TABLESPACE` que define o espaço de tabelas onde a tabela reside, e os espaços de tabelas mencionados anteriormente não suportam tabelas temporárias. Para criar uma tabela temporária com base na definição de tal tabela, use a seguinte sintaxe:

```
CREATE TEMPORARY TABLE new_tbl SELECT * FROM orig_tbl LIMIT 0;
```

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") é descontinuado a partir do MySQL 8.0.13; espere que ele seja removido em uma versão futura do MySQL.

#### 15.1.20.3 Declaração CREATE TABLE ... LIKE

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

```
CREATE TABLE new_tbl LIKE orig_tbl;
```

A cópia é criada usando a mesma versão do formato de armazenamento de tabela do mesmo que a tabela original. O privilégio `SELECT` é necessário na tabela original.

`LIKE` funciona apenas para tabelas básicas, não para visualizações.

Importante

Você não pode executar `CREATE TABLE` ou `CREATE TABLE ... LIKE` enquanto uma declaração `LOCK TABLES` estiver em vigor.

`CREATE TABLE ... LIKE` (create-table.html "15.1.20 CREATE TABLE Statement") faz os mesmos verificações que `CREATE TABLE`. Isso significa que, se o modo SQL atual for diferente do modo em vigor quando a tabela original foi criada, a definição da tabela pode ser considerada inválida para o novo modo e causar o falha da declaração.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações da coluna gerada da tabela original.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as restrições de `CHECK` da tabela original, exceto que todos os nomes das restrições são gerados.

`CREATE TABLE ... LIKE` não preserva nenhuma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` que foram especificadas para a tabela original, ou qualquer definição de chave estrangeira.

Se a tabela original for uma tabela `TEMPORARY`, a tabela `CREATE TABLE ... LIKE` não preserva `TEMPORARY`. Para criar uma tabela de destino `TEMPORARY`, use `CREATE TEMPORARY TABLE ... LIKE`.

As tabelas criadas no espaço de tabelas `mysql` (`InnoDB`), no espaço de tabelas do sistema `innodb_system` (`innodb_system`) ou em espaços de tabelas gerais incluem um atributo `TABLESPACE` na definição da tabela, que define o espaço de tabelas onde a tabela reside. Devido a uma regressão temporária, `CREATE TABLE ... LIKE` preserva o atributo `TABLESPACE` e cria a tabela no espaço de tabelas definido, independentemente da configuração do `innodb_file_per_table`. Para evitar o atributo `TABLESPACE` ao criar uma tabela vazia com base na definição de uma tabela desse tipo, use a seguinte sintaxe:

```
CREATE TABLE new_tbl SELECT * FROM orig_tbl LIMIT 0;
```

As operações `CREATE TABLE ... LIKE`](create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement") aplicam todos os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` à nova tabela.

#### 15.1.20.4 Criação da instrução SELECT para a tabela ...

Você pode criar uma tabela a partir de outra adicionando uma declaração `SELECT` no final da declaração `CREATE TABLE`:

```
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

O MySQL cria novas colunas para todos os elementos no `SELECT`. Por exemplo:

```
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

Isso cria uma tabela `InnoDB` com três colunas, `a`, `b` e `c`. A opção `ENGINE` faz parte da declaração `CREATE TABLE`, e não deve ser usada após o `SELECT`; isso resultaria em um erro de sintaxe. O mesmo vale para outras opções `CREATE TABLE`, como `CHARSET`.

Observe que as colunas da declaração `SELECT` são anexadas ao lado direito da tabela, e não sobrepostas sobre ela. Tome o seguinte exemplo:

```
mysql> SELECT * FROM foo;
+---+
| n |
+---+
| 1 |
+---+

mysql> CREATE TABLE bar (m INT) SELECT n FROM foo;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM bar;
+------+---+
| m    | n |
+------+---+
| NULL | 1 |
+------+---+
1 row in set (0.00 sec)
```

Para cada linha da tabela `foo`, uma linha é inserida na tabela `bar` com os valores da tabela `foo` e valores padrão para as novas colunas.

Em uma tabela resultante de `CREATE TABLE ... SELECT`(create-table.html "15.1.20 CREATE TABLE Statement"), as colunas nomeadas apenas na parte `CREATE TABLE` vêm primeiro. As colunas nomeadas em ambas as partes ou apenas na parte `SELECT` vêm depois. O tipo de dados das colunas `SELECT` pode ser sobrescrito especificando também a coluna na parte `CREATE TABLE`.

Se ocorrerem erros ao copiar dados para a tabela, a tabela será automaticamente descartada e não criada. No entanto, antes do MySQL 8.0.21, quando a replicação baseada em linha está em uso, uma declaração `CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") é registrada no log binário como duas transações, uma para criar a tabela e a outra para inserir dados. Quando a declaração aplicada a partir do log binário, uma falha entre as duas transações ou durante a cópia de dados pode resultar na replicação de uma tabela vazia. Essa limitação é removida no MySQL 8.0.21. Em motores de armazenamento que suportam DDL atômica, `CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") agora é registrado e aplicado como uma transação quando a replicação baseada em linha está em uso. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômico e restrições de chave estrangeira, a criação de chaves estrangeiras não é permitida em declarações `CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") quando a replicação baseada em linha está em uso. Restrições de chave estrangeira podem ser adicionadas posteriormente usando `ALTER TABLE`.

Você pode preceder o `SELECT` com `IGNORE` ou `REPLACE` para indicar como lidar com linhas que duplicam valores de chave única. Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. Com `REPLACE`, as novas linhas substituem as linhas que têm o mesmo valor de chave única. Se nem `IGNORE` nem `REPLACE` for especificado, valores de chave única duplicados resultam em um erro. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

No MySQL 8.0.19 e versões posteriores, você também pode usar uma declaração `VALUES` na parte `SELECT` de `CREATE TABLE ... SELECT`; a parte `VALUES` da declaração deve incluir um alias de tabela usando uma cláusula `AS`. Para nomear as colunas que vêm de `VALUES`, forneça aliases de coluna com o alias da tabela; caso contrário, os nomes de coluna padrão `column_0`, `column_1`, `column_2`, ..., são usados.

Caso contrário, o nome dos colunas na tabela criada segue as mesmas regras descritas anteriormente nesta seção. Exemplos:

```
mysql> CREATE TABLE tv1
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v;
mysql> TABLE tv1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |        3 |        5 |
|        2 |        4 |        6 |
+----------+----------+----------+

mysql> CREATE TABLE tv2
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv2;
+---+---+---+
| x | y | z |
+---+---+---+
| 1 | 3 | 5 |
| 2 | 4 | 6 |
+---+---+---+

mysql> CREATE TABLE tv3 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv3;
+------+------+------+----------+----------+----------+
| a    | b    | c    |        x |        y |        z |
+------+------+------+----------+----------+----------+
| NULL | NULL | NULL |        1 |        3 |        5 |
| NULL | NULL | NULL |        2 |        4 |        6 |
+------+------+------+----------+----------+----------+

mysql> CREATE TABLE tv4 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv4;
+------+------+------+---+---+---+
| a    | b    | c    | x | y | z |
+------+------+------+---+---+---+
| NULL | NULL | NULL | 1 | 3 | 5 |
| NULL | NULL | NULL | 2 | 4 | 6 |
+------+------+------+---+---+---+

mysql> CREATE TABLE tv5 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(a,b,c);
mysql> TABLE tv5;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 |    3 |    5 |
|    2 |    4 |    6 |
+------+------+------+
```

Ao selecionar todas as colunas e usar os nomes de colunas padrão, você pode omitir `SELECT *`, de modo que a declaração usada para criar a tabela `tv1` também pode ser escrita como mostrado aqui:

```
mysql> CREATE TABLE tv1 VALUES ROW(1,3,5), ROW(2,4,6);
mysql> TABLE tv1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |        3 |        5 |
|        2 |        4 |        6 |
+----------+----------+----------+
```

Ao usar `VALUES` como fonte do `SELECT`, todas as colunas são sempre selecionadas na nova tabela, e colunas individuais não podem ser selecionadas, pois podem ser quando selecionadas a partir de uma tabela nomeada; cada uma das seguintes declarações produz um erro (`ER_OPERAND_COLUMNS`):

```
CREATE TABLE tvx
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);

CREATE TABLE tvx (a INT, c INT)
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
```

Da mesma forma, você pode usar uma declaração `TABLE` em vez da declaração `SELECT`. Isso segue as mesmas regras que com a declaração `VALUES`; todas as colunas da tabela de origem e seus nomes na tabela de origem são sempre inseridos na nova tabela. Exemplos:

```
mysql> TABLE t1;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
| 10 | -4 |
| 14 |  6 |
+----+----+

mysql> CREATE TABLE tt1 TABLE t1;
mysql> TABLE tt1;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
| 10 | -4 |
| 14 |  6 |
+----+----+

mysql> CREATE TABLE tt2 (x INT) TABLE t1;
mysql> TABLE tt2;
+------+----+----+
| x    | a  | b  |
+------+----+----+
| NULL |  1 |  2 |
| NULL |  6 |  7 |
| NULL | 10 | -4 |
| NULL | 14 |  6 |
+------+----+----+
```

Como a ordem das linhas nas declarações subjacentes `SELECT` nem sempre pode ser determinada, as declarações `CREATE TABLE ... IGNORE SELECT` e `CREATE TABLE ... REPLACE SELECT` são marcadas como inseguras para replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Veja também [Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linha”][(replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication")].

`CREATE TABLE ... SELECT`](create-table.html "15.1.20 CREATE TABLE Statement") não cria automaticamente nenhum índice para você. Isso é feito intencionalmente para tornar a declaração o mais flexível possível. Se você deseja ter índices na tabela criada, deve especificar esses índices antes da declaração `SELECT`:

```
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada foram geradas. A parte `SELECT` da declaração não pode atribuir valores às colunas geradas na tabela de destino.

Para `CREATE TABLE ... SELECT`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Pode ocorrer alguma conversão de tipos de dados. Por exemplo, o atributo `AUTO_INCREMENT` não é preservado, e as colunas `VARCHAR` podem se tornar colunas `CHAR`. Os atributos retreinados são `NULL` (ou `NOT NULL`) e, para as colunas que os possuem, `CHARACTER SET`, `COLLATION`, `COMMENT` e a cláusula `DEFAULT`.

Ao criar uma tabela com `CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"), certifique-se de aliar quaisquer chamadas de função ou expressões na consulta. Se você não fizer isso, a declaração `CREATE` pode falhar ou resultar em nomes de colunas indesejados.

```
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

Você também pode especificar explicitamente o tipo de dados para uma coluna na tabela criada:

```
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

Para `CREATE TABLE ... SELECT`, se (create-table.html "15.1.20 CREATE TABLE Statement") for fornecido e a tabela de destino exista, nada é inserido na tabela de destino e a declaração não é registrada.

Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes durante o `CREATE TABLE ... SELECT` (create-table.html "15.1.20 CREATE TABLE Statement"). No entanto, antes do MySQL 8.0.21, quando uma operação `CREATE TABLE ... SELECT` (create-table.html "15.1.20 CREATE TABLE Statement") é aplicada a partir do log binário quando a replicação baseada em linha está em uso, inserções concorrentes são permitidas na tabela replicada durante a cópia de dados. Essa limitação é removida no MySQL 8.0.21 em motores de armazenamento que suportam DDL atômico. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

Você não pode usar `FOR UPDATE` como parte do `SELECT` em uma declaração como [`CREATE TABLE new_table SELECT ... FROM old_table ...`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"). Se você tentar fazer isso, a declaração falha.

As operações `CREATE TABLE ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") aplicam os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` apenas às colunas. Os valores de tabela e índice `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são aplicados à nova tabela, a menos que seja especificado explicitamente.

#### 15.1.20.5 Restrições de Chave Estrangeira

O MySQL suporta chaves estrangeiras, que permitem a correlação de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter os dados relacionados consistentes.

Uma relação de chave estrangeira envolve uma tabela pai que contém os valores iniciais da coluna e uma tabela filho com valores de coluna que fazem referência aos valores da coluna pai. Uma restrição de chave estrangeira é definida na tabela filho.

A sintaxe essencial para definir uma restrição de chave estrangeira em uma declaração `CREATE TABLE` ou `ALTER TABLE` inclui o seguinte:

```
[CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

O uso de restrição de chave estrangeira é descrito nos seguintes tópicos desta seção:

* Identificadores
* Condições e Restrições
* Ações Referenciais
* Exemplos de Restrições de Chave Estrangeira
* Adicionando Restrições de Chave Estrangeira
* Arrastando Restrições de Chave Estrangeira
* Verificações de Chave Estrangeira
* Bloqueio
* Definições e Metadados da Chave Estrangeira
* Erros de Chave Estrangeira

##### Identificadores

A nomenclatura das restrições de chave estrangeira é regida pelas seguintes regras:

O valor `CONSTRAINT` *`symbol`* é utilizado, se definido.

* Se a cláusula `CONSTRAINT` *`symbol`* não for definida, ou se um símbolo não for incluído após a palavra-chave `CONSTRAINT`, um nome de nome de restrição é gerado automaticamente.

Antes do MySQL 8.0.16, se a cláusula `CONSTRAINT` *`symbol`* não fosse definida ou se um símbolo não fosse incluído após a palavra-chave `CONSTRAINT`, os motores de armazenamento `InnoDB` e `NDB` usariam o `FOREIGN_KEY index_name` se definido. No MySQL 8.0.16 e versões posteriores, o `FOREIGN_KEY index_name` é ignorado.

* O valor `CONSTRAINT symbol`, se definido, deve ser único no banco de dados. Um duplicado *`symbol`* resulta em um erro semelhante ao seguinte: ERRO 1005 (HY000): Não é possível criar a tabela 'test.fk1' (erro de número 121).

* Os bancos de dados NDB armazenam nomes estrangeiros usando a mesma grafia que foram criados. Antes da versão 8.0.20, ao processar `SELECT` e outras declarações SQL, `NDB` comparava os nomes das chaves estrangeiras nessas declarações com os nomes armazenados de forma sensível à grafia quando `lower_case_table_names` era igual a 0. No NDB 8.0.20 e posterior, esse valor não tem mais efeito sobre como essas comparações são feitas, e elas são sempre feitas sem considerar a grafia. (Bug #30512043)

Os identificadores de tabela e coluna em uma cláusula `FOREIGN KEY ... REFERENCES` podem ser citados dentro de backticks (`` ` ``). Alternatively, double quotation marks (`"`) can be used if the `ANSI_QUOTES` SQL mode is enabled. The `O ajuste da variável de sistema lower_case_table_names também é levado em conta.

##### Condições e Restrições

As restrições de chave estrangeira estão sujeitas às seguintes condições e restrições:

As tabelas de pais e filhos devem usar o mesmo mecanismo de armazenamento e não podem ser definidas como tabelas temporárias.

* Para criar uma restrição de chave estrangeira, é necessário o privilégio `REFERENCES` na tabela principal.

* As colunas correspondentes na chave estrangeira e na chave referenciada devem ter tipos de dados semelhantes. * O tamanho e o sinal dos tipos de precisão fixa, como `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DECIMAL` - DECIMAL, NUMERIC") devem ser os mesmos. O comprimento dos tipos de string não precisa ser o mesmo. Para colunas de string não binárias (caracteres), o conjunto de caracteres e a correção devem ser os mesmos.

* O MySQL suporta referências de chave estrangeira entre uma coluna e outra dentro de uma tabela. (Uma coluna não pode ter uma referência de chave estrangeira para si mesma.) Nesses casos, um "registro de tabela de filho" refere-se a um registro dependente na mesma tabela.

* O MySQL requer índices em chaves estrangeiras e chaves referenciadas para que as verificações de chave estrangeira possam ser rápidas e não exijam uma varredura da tabela. Na tabela de referência, deve haver um índice onde as colunas da chave estrangeira estão listadas como as *primeiras* colunas na mesma ordem. Esse índice é criado na tabela de referência automaticamente se não existir. Esse índice pode ser silenciosamente descartado mais tarde se você criar outro índice que possa ser usado para impor a restrição da chave estrangeira. *`index_name`*, se fornecido, é usado conforme descrito anteriormente.

* `InnoDB` permite que uma chave estrangeira faça referência a qualquer coluna de índice ou grupo de colunas. No entanto, na tabela referenciada, deve haver um índice onde as colunas referenciadas sejam as *primeiras* colunas na mesma ordem. Colunas ocultas que `InnoDB` adiciona a um índice também são consideradas (consulte Seção 17.6.2.1, “Indekses agrupados e secundários”).

`NDB` exige uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira. `InnoDB` não exige, o que é uma extensão do SQL padrão.

* Prefixo de índice em colunas de chave estrangeira não são suportados. Consequentemente, as colunas `BLOB` e `TEXT` não podem ser incluídas em uma chave estrangeira porque os índices nessas colunas devem sempre incluir um comprimento de prefixo.

* `InnoDB` atualmente não suporta chaves estrangeiras para tabelas com particionamento definido pelo usuário. Isso inclui tanto as tabelas pai quanto as tabelas filho.

Essa restrição não se aplica às tabelas `NDB` que são particionadas por `KEY` ou `LINEAR KEY` (os únicos tipos de particionamento de usuário suportados pelo motor de armazenamento `NDB`); essas podem ter referências de chave estrangeira ou serem os alvos de tais referências.

* Uma tabela em uma relação de chave estrangeira não pode ser alterada para usar outro mecanismo de armazenamento. Para alterar o mecanismo de armazenamento, você deve primeiro descartar quaisquer restrições de chave estrangeira.

* Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

Para informações sobre como a implementação do MySQL de restrições de chave estrangeira difere do padrão SQL, consulte a Seção 1.6.2.3, “Diferenças da Restrição de Chave Estrangeira”.

##### Ações Referenciais

Quando uma operação `UPDATE` ou `DELETE` afeta um valor chave na tabela principal que tem linhas correspondentes na tabela secundária, o resultado depende da *ação referencial* especificada pelos subcláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. As ações referenciais incluem:

* `CASCADE`: Exclua ou atualize a linha da tabela principal e exclua ou atualize automaticamente as linhas correspondentes na tabela secundária. Ambos `ON DELETE CASCADE` e `ON UPDATE CASCADE` são suportados. Entre duas tabelas, não defina várias cláusulas `ON UPDATE CASCADE` que atuem na mesma coluna na tabela principal ou na tabela secundária.

Se uma cláusula `FOREIGN KEY` for definida em ambas as tabelas em uma relação de chave estrangeira, tornando ambas as tabelas pais e filhos, uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` definida para uma cláusula `FOREIGN KEY` deve ser definida para a outra para que as operações em cascata sejam bem-sucedidas. Se uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` for definida apenas para uma cláusula `FOREIGN KEY`, as operações em cascata falham com um erro.

Nota

As ações de chave estrangeira em cascata não ativam gatilhos.

* `SET NULL`: Exclua ou atualize a linha da tabela principal e defina a coluna ou colunas da chave estrangeira na tabela secundária para `NULL`. As cláusulas `ON DELETE SET NULL` e `ON UPDATE SET NULL` são suportadas.

Se você especificar uma ação `SET NULL`, *assegure-se de que não tenha declarado as colunas na tabela secundária como [[`NOT NULL`]*.

* `RESTRICT`: Rejeita a operação de exclusão ou atualização para a tabela principal. Especificar `RESTRICT` (ou `NO ACTION`) é o mesmo que omitir a cláusula `ON DELETE` ou `ON UPDATE`.

* `NO ACTION`: Uma palavra-chave do SQL padrão. Para `InnoDB`, isso é equivalente a `RESTRICT`; a operação de exclusão ou atualização para a tabela pai é imediatamente rejeitada se houver um valor de chave estrangeira relacionado na tabela referenciada. `NDB` suporta verificações diferidas, e `NO ACTION` especifica uma verificação diferida; quando isso é usado, os verificações de restrição não são realizadas até o momento do commit. Note que, para tabelas de `NDB`, isso faz com que todas as verificações de chave estrangeira feitas tanto para a tabela pai quanto para a tabela filho sejam diferidas.

* `SET DEFAULT`: Esta ação é reconhecida pelo analisador MySQL, mas tanto `InnoDB` quanto `NDB` rejeitam definições de tabela que contêm cláusulas `ON DELETE SET DEFAULT` ou `ON UPDATE SET DEFAULT`.

Para motores de armazenamento que suportam chaves estrangeiras, o MySQL rejeita qualquer operação `INSERT` ou `UPDATE` que tente criar um valor de chave estrangeira em uma tabela secundária se não houver nenhum valor de chave candidata correspondente na tabela principal.

Para um `ON DELETE` ou `ON UPDATE` que não é especificado, a ação padrão é sempre `NO ACTION`.

Como padrão, uma cláusula `ON DELETE NO ACTION` ou `ON UPDATE NO ACTION` especificada explicitamente não aparece na saída `SHOW CREATE TABLE` ou em tabelas descarregadas com **mysqldump**. `RESTRICT`, que é uma palavra-chave equivalente não padrão, aparece na saída (show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement") e em tabelas descarregadas com **mysqldump**.

Para as tabelas `NDB`, `ON UPDATE CASCADE` não é suportada quando a referência é à chave primária da tabela pai.

A partir da NDB 8.0.16: Para as tabelas `NDB`, `ON DELETE CASCADE` não é suportada quando a tabela secundária contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

`InnoDB` realiza operações em cascata usando um algoritmo de pesquisa de primeira profundidade nos registros do índice que corresponde à restrição de chave estrangeira.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

##### Exemplos de restrição de chave estrangeira

Este exemplo simples relaciona as tabelas `parent` e `child` por meio de uma chave estrangeira de uma única coluna:

```
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON DELETE CASCADE
) ENGINE=INNODB;
```

Este é um exemplo mais complexo, em que uma tabela `product_order` possui chaves estrangeiras para outras duas tabelas. Uma chave estrangeira faz referência a um índice de duas colunas na tabela `product`. A outra faz referência a um índice de uma coluna na tabela `customer`:

```
CREATE TABLE product (
    category INT NOT NULL, id INT NOT NULL,
    price DECIMAL,
    PRIMARY KEY(category, id)
)   ENGINE=INNODB;

CREATE TABLE customer (
    id INT NOT NULL,
    PRIMARY KEY (id)
)   ENGINE=INNODB;

CREATE TABLE product_order (
    no INT NOT NULL AUTO_INCREMENT,
    product_category INT NOT NULL,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,

    PRIMARY KEY(no),
    INDEX (product_category, product_id),
    INDEX (customer_id),

    FOREIGN KEY (product_category, product_id)
      REFERENCES product(category, id)
      ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (customer_id)
      REFERENCES customer(id)
)   ENGINE=INNODB;
```

##### Adicionando restrições de chave estrangeira

Você pode adicionar uma restrição de chave estrangeira a uma tabela existente usando a seguinte sintaxe `ALTER TABLE`:

```
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

A chave estrangeira pode ser autoreferencial (referindo à mesma tabela). Quando você adiciona uma restrição de chave estrangeira a uma tabela usando `ALTER TABLE`, *não se esqueça de criar um índice primeiro nas colunas referenciadas pela chave estrangeira.*

##### Deixar as restrições de chave estrangeira em branco

Você pode descartar uma restrição de chave estrangeira usando a seguinte sintaxe `ALTER TABLE`:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Se a cláusula `FOREIGN KEY` definiu um nome `CONSTRAINT` quando você criou a restrição, você pode se referir a esse nome para descartar a restrição de chave estrangeira. Caso contrário, um nome de restrição foi gerado internamente, e você deve usar esse valor. Para determinar o nome da restrição de chave estrangeira, use [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement"):

```
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

mysql> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
```

A adição e a remoção de uma chave estrangeira na mesma declaração `ALTER TABLE` é suportada para `ALTER TABLE ... ALGORITHM=INPLACE` (alter-table.html "15.1.9 ALTER TABLE Statement"). Não é suportada para `ALTER TABLE ... ALGORITHM=COPY` (alter-table.html "15.1.9 ALTER TABLE Statement").

##### Verificações de Chave Estrangeira

Nas tabelas MySQL, as tabelas InnoDB e NDB suportam a verificação de restrições de chave estrangeira. A verificação de chave estrangeira é controlada pela variável `foreign_key_checks`, que é habilitada por padrão. Normalmente, você deixa essa variável habilitada durante o funcionamento normal para impor a integridade referencial. A variável `foreign_key_checks` tem o mesmo efeito nas tabelas `NDB` que nas tabelas `InnoDB`.

A variável `foreign_key_checks` é dinâmica e suporta escopos globais e de sessão. Para informações sobre o uso de variáveis do sistema, consulte a Seção 7.1.9, “Usando Variáveis do Sistema”.

Desabilitar a verificação de chave estrangeira é útil quando:

* Deixar de lado uma tabela que é referenciada por uma restrição de chave estrangeira. Uma tabela referenciada só pode ser deixada de lado após `foreign_key_checks` ser desativado. Ao deixar de lado uma tabela, as restrições definidas na tabela também são deixadas de lado.

* Recarregar tabelas em uma ordem diferente daquela exigida por suas relações de chave estrangeira. Por exemplo, **mysqldump** produz definições corretas das tabelas no arquivo de dump, incluindo restrições de chave estrangeira para tabelas secundárias. Para facilitar o recarregamento de arquivos de dump para tabelas com relações de chave estrangeira, **mysqldump** inclui automaticamente uma declaração na saída do dump que desativa `foreign_key_checks`. Isso permite que você importe as tabelas em qualquer ordem, caso o arquivo de dump contenha tabelas que não estejam corretamente ordenadas para chaves estrangeiras. Desabilitar `foreign_key_checks` também acelera a operação de importação, evitando verificações de chave estrangeira.

* Executando operações `LOAD DATA`, para evitar verificação de chave estrangeira.

* Realizar uma operação `ALTER TABLE` em uma tabela que possui uma relação de chave estrangeira.

Quando o `foreign_key_checks` é desativado, as restrições de chave estrangeira são ignoradas, com as seguintes exceções:

* Recriar uma tabela que foi previamente excluída retorna um erro se a definição da tabela não atender às restrições de chave estrangeira que fazem referência à tabela. A tabela deve ter os nomes e tipos de coluna corretos. Deve também ter índices nas chaves referenciadas. Se esses requisitos não forem atendidos, o MySQL retorna o erro 1005 que se refere ao erro: 150 na mensagem de erro, o que significa que uma restrição de chave estrangeira não foi formada corretamente.

* Altering uma tabela retorna um erro (errno: 150) se uma definição de chave estrangeira estiver incorretamente formada para a tabela alterada.

* A remoção de um índice exigido por uma restrição de chave estrangeira. A restrição de chave estrangeira deve ser removida antes da remoção do índice.

* Criar uma restrição de chave estrangeira onde uma coluna faz referência a um tipo de coluna que não corresponde.

Desativar `foreign_key_checks` tem essas implicações adicionais:

* É permitido descartar um banco de dados que contém tabelas com chaves estrangeiras que são referenciadas por tabelas fora do banco de dados.

* É permitido descartar uma tabela com chaves estrangeiras referenciadas por outras tabelas.

* A habilitação de `foreign_key_checks` não desencadeia uma varredura dos dados da tabela, o que significa que as linhas adicionadas a uma tabela enquanto `foreign_key_checks` está desativado não são verificadas quanto à consistência quando `foreign_key_checks` é reativado.

##### Bloqueio

O MySQL estende as bloqueadoras de metadados, conforme necessário, para tabelas que estão relacionadas por uma restrição de chave estrangeira. A extensão das bloqueadoras de metadados impede que operações DML e DDL conflitantes sejam executadas concorrentemente em tabelas relacionadas. Esse recurso também permite atualizações do metadado da chave estrangeira quando uma tabela pai é modificada. Em versões anteriores do MySQL, o metadado da chave estrangeira, que é de propriedade da tabela filho, não podia ser atualizado com segurança.

Se uma tabela for explicitamente bloqueada com `LOCK TABLES`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"), todas as tabelas relacionadas por uma restrição de chave estrangeira são abertas e bloqueadas implicitamente. Para verificações de chave estrangeira, uma bloqueio compartilhado de leitura somente (`LOCK TABLES READ`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements")) é tomado em tabelas relacionadas. Para atualizações em cascata, um bloqueio de escrita não-compartilhado (`LOCK TABLES WRITE`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements")) é tomado em tabelas relacionadas que estão envolvidas na operação.

##### Definições de Chave Estrangeira e Metadados

Para visualizar uma definição de chave estrangeira, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Você pode obter informações sobre chaves estrangeiras da tabela do esquema de informações `KEY_COLUMN_USAGE`. Um exemplo de consulta contra essa tabela é mostrado aqui:

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+------------+-------------+-----------------+
| test         | child      | parent_id   | child_ibfk_1    |
+--------------+------------+-------------+-----------------+
```

Você pode obter informações específicas para as chaves estrangeiras `InnoDB` das tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS`. Exemplos de consultas são mostrados aqui:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
*************************** 1. row ***************************
      ID: test/child_ibfk_1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS \G
*************************** 1. row ***************************
          ID: test/child_ibfk_1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

##### Erros de Chave Estrangeira

Em caso de erro de chave estrangeira envolvendo as tabelas `InnoDB` (geralmente o Erro 150 no MySQL Server), as informações sobre o último erro de chave estrangeira podem ser obtidas verificando a saída [[`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement")].

```
mysql> SHOW ENGINE INNODB STATUS\G
...
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2018-04-12 14:57:24 0x7f97a9c91700 Transaction:
TRANSACTION 7717, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 8, OS thread handle 140289365317376, query id 14 localhost root update
INSERT INTO child VALUES (NULL, 1), (NULL, 2), (NULL, 3), (NULL, 4), (NULL, 5), (NULL, 6)
Foreign key constraint fails for table `test`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`) ON DELETE
  CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `test`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 000000001e19; asc       ;;
 2: len 7; hex 81000001110137; asc       7;;
...
```

Aviso

Se um usuário tiver privilégios de nível de tabela para todas as tabelas pai, as mensagens de erro `ER_NO_REFERENCED_ROW_2` e `ER_ROW_IS_REFERENCED_2` para operações de chave estrangeira exibem informações sobre as tabelas pai. Se um usuário não tiver privilégios de nível de tabela para todas as tabelas pai, mensagens de erro mais genéricas são exibidas em vez disso (`ER_NO_REFERENCED_ROW` e `ER_ROW_IS_REFERENCED`).

Uma exceção é que, para programas armazenados definidos para executar com privilégios `DEFINER`, o usuário contra o qual os privilégios são avaliados é o usuário na cláusula do programa `DEFINER`, e não o usuário que está invocando. Se esse usuário tiver privilégios de tabela em uma tabela pai, as informações da tabela pai ainda são exibidas. Neste caso, é responsabilidade do criador do programa armazenado ocultar as informações, incluindo os manipuladores de condição apropriados.

#### 15.1.20.6 Restrições de verificação

Antes do MySQL 8.0.16, `CREATE TABLE` (create-table.html "15.1.20 CREATE TABLE Statement") permite apenas a seguinte versão limitada da sintaxe de restrição da tabela `CHECK`, que é analisada e ignorada:

```
CHECK (expr)
```

A partir do MySQL 8.0.16, `CREATE TABLE` permite as principais características das restrições de tabela e coluna `CHECK`, para todos os motores de armazenamento. `CREATE TABLE` permite a sintaxe da restrição `CHECK`, tanto para restrições de tabela quanto para restrições de coluna:

```
[CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
```

O opcional *`symbol`* especifica um nome para a restrição. Se omitido, o MySQL gera um nome a partir do nome da tabela, um literal `_chk_` e um número ordinal (1, 2, 3, etc.). Os nomes das restrições têm um comprimento máximo de 64 caracteres. Eles são sensíveis ao caso, mas não ao acento.

*`expr` especifica a condição de restrição como uma expressão booleana que deve avaliar-se a `TRUE` ou `UNKNOWN` (para valores de `NULL`) para cada linha da tabela. Se a condição avaliar-se a `FALSE`, ela falha e ocorre uma violação de restrição. O efeito de uma violação depende da declaração sendo executada, conforme descrito mais adiante nesta seção.

A cláusula de execução opcional indica se a restrição é executada:

* Se omitido ou especificado como `ENFORCED`, a restrição é criada e aplicada.

* Se especificado como `NOT ENFORCED`, a restrição é criada, mas não aplicada.

Uma restrição `CHECK` é especificada como uma restrição de tabela ou uma restrição de coluna:

* Uma restrição de tabela não aparece dentro de uma definição de coluna e pode se referir a qualquer coluna ou colunas de tabela. Referências para frente são permitidas para colunas que aparecem mais tarde na definição da tabela.

* Uma restrição de coluna aparece dentro de uma definição de coluna e pode se referir apenas a essa coluna.

Considere esta definição de tabela:

```
CREATE TABLE t1
(
  CHECK (c1 <> c2),
  c1 INT CHECK (c1 > 10),
  c2 INT CONSTRAINT c2_positive CHECK (c2 > 0),
  c3 INT CHECK (c3 < 100),
  CONSTRAINT c1_nonzero CHECK (c1 <> 0),
  CHECK (c1 > c3)
);
```

A definição inclui restrições de tabela e restrições de coluna, em formatos nomeados e não nomeados:

* A primeira restrição é uma restrição de tabela: ocorre fora de qualquer definição de coluna, portanto, pode (e faz) se referir a várias colunas da tabela. Essa restrição contém referências para colunas que ainda não foram definidas. Não há nome de restrição especificado, então o MySQL gera um nome.

* As três restrições seguintes são restrições de coluna: Cada uma ocorre dentro de uma definição de coluna e, portanto, pode se referir apenas à coluna que está sendo definida. Uma das restrições é nomeada explicitamente. O MySQL gera um nome para cada uma das outras duas.

* As duas últimas restrições são restrições de tabela. Uma delas é nomeada explicitamente. O MySQL gera um nome para a outra.

Como mencionado, o MySQL gera um nome para qualquer restrição `CHECK` especificada sem uma. Para ver os nomes gerados para a definição de tabela anterior, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),
  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),
  CONSTRAINT `t1_chk_1` CHECK ((`c1` <> `c2`)),
  CONSTRAINT `t1_chk_2` CHECK ((`c1` > 10)),
  CONSTRAINT `t1_chk_3` CHECK ((`c3` < 100)),
  CONSTRAINT `t1_chk_4` CHECK ((`c1` > `c3`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo espaço de nomes. No MySQL, cada tipo de restrição tem seu próprio espaço de nomes por esquema (banco de dados). Consequentemente, os nomes das restrições `CHECK` devem ser únicos por esquema; nenhuma das duas tabelas do mesmo esquema pode compartilhar o nome de uma restrição `CHECK`. (Exceção: uma tabela `TEMPORARY` oculta uma tabela não `TEMPORARY` do mesmo nome, portanto, pode ter os mesmos nomes de restrição `CHECK` também.)

Começar a gerar nomes de restrições com o nome da tabela ajuda a garantir a unicidade do esquema, pois os nomes das tabelas também devem ser únicos dentro do esquema.

`CHECK` as expressões de condição devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Colunas não geradas e geradas são permitidas, exceto as colunas com o atributo `AUTO_INCREMENT` e as colunas em outras tabelas.

* Literais, funções internas determinísticas e operadores são permitidos. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocações produzem o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Funções armazenadas e funções carregáveis não são permitidas. * Procedimentos armazenados e parâmetros de função não são permitidos. * Variáveis (variáveis de sistema, variáveis definidas pelo usuário e variáveis locais de programa armazenadas) não são permitidas.

* Subconsultas não são permitidas.

As ações referenciais de chave estrangeira (`ON UPDATE`, `ON DELETE`) são proibidas em colunas utilizadas em restrições de `CHECK`. Da mesma forma, as restrições de `CHECK` são proibidas em colunas utilizadas em ações referenciais de chave estrangeira.

As restrições `CHECK` são avaliadas para as declarações `INSERT`, `UPDATE`, `REPLACE`, `LOAD DATA` e `LOAD XML`, e um erro ocorre se uma restrição for avaliada como `FALSE`. Se ocorrer um erro, o tratamento das alterações já aplicadas difere entre os motores de armazenamento transacional e não transacional, e também depende se o modo SQL estrito está em vigor, conforme descrito no Modo SQL Estrito.

As restrições `CHECK` são avaliadas para as declarações `INSERT IGNORE`, `UPDATE IGNORE`, [`LOAD DATA ... IGNORE`](load-data.html "15.2.9 LOAD DATA Statement"), e [`LOAD XML ... IGNORE`](load-xml.html "15.2.10 LOAD XML Statement"), e um aviso ocorre se uma restrição for avaliada como `FALSE`. O inserimento ou atualização para qualquer linha infratora é ignorado.

Se a expressão de restrição avaliar um tipo de dados que difere do tipo de coluna declarado, a coerção implícita para o tipo declarado ocorre de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”. Se a conversão de tipo falhar ou resultar em perda de precisão, um erro ocorre.

Nota

A avaliação da expressão de restrição utiliza o modo SQL em vigor no momento da avaliação. Se qualquer componente da expressão depender do modo SQL, podem ocorrer resultados diferentes para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

A tabela do esquema de informação `CHECK_CONSTRAINTS` fornece informações sobre as restrições `CHECK` definidas em tabelas. Veja a Seção 28.3.5, “A tabela CHECK_CONSTRAINTS do esquema de informação INFORMATION_SCHEMA”.

#### 15.1.20.7 Alterações nas especificações da coluna silenciosa

Em alguns casos, o MySQL muda silenciosamente as especificações de coluna das fornecidas em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Essas mudanças podem ser de um tipo de dado, de atributos associados a um tipo de dado ou de uma especificação de índice.

Todas as alterações estão sujeitas ao limite interno de tamanho de linha de 65.535 bytes, o que pode fazer com que algumas tentativas de alteração do tipo de dados falhem. Consulte a Seção 10.4.7, “Limites de contagem de colunas de tabela e tamanho de linha”.

* Colunas que fazem parte de um `PRIMARY KEY` são feitas `NOT NULL` mesmo que não sejam declaradas dessa forma.

* Espaços em branco são automaticamente excluídos dos valores dos membros `ENUM` e `SET` quando a tabela é criada.

* O MySQL mapeia certos tipos de dados usados por outros fornecedores de bancos de dados SQL para tipos MySQL. Veja a Seção 13.9, “Usando tipos de dados de outros motores de banco de dados”.

* Se você incluir uma cláusula `USING` para especificar um tipo de índice que não é permitido para um determinado motor de armazenamento, mas há outro tipo de índice disponível que o motor pode usar sem afetar os resultados da consulta, o motor usa o tipo disponível.

* Se o modo SQL rigoroso não estiver habilitado, uma coluna `VARCHAR` com uma especificação de comprimento maior que 65535 é convertida para `TEXT`, e uma coluna `VARBINARY` com uma especificação de comprimento maior que 65535 é convertida para `BLOB`. Caso contrário, ocorre um erro em qualquer um desses casos.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dados de caracteres faz com que a coluna seja criada como o tipo de dados binário correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY` e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando esta definição:

  ```
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

A tabela resultante tem esta definição:

  ```
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

Para verificar se o MySQL usou um tipo de dado diferente do especificado, execute uma declaração `DESCRIBE` ou `SHOW CREATE TABLE` após criar ou alterar a tabela.

Certos outros tipos de alterações de dados podem ocorrer se você comprimir uma tabela usando **myisampack**. Veja a Seção 18.2.3.3, “Características da tabela comprimida”.

#### 15.1.20.8 CRIAR Tabela e Colunas Geradas

`CREATE TABLE` suporta a especificação de colunas geradas. Os valores de uma coluna gerada são calculados a partir de uma expressão incluída na definição da coluna.

As colunas geradas também são suportadas pelo mecanismo de armazenamento `NDB`.

O exemplo simples a seguir mostra uma tabela que armazena as medidas dos lados dos triângulos retângulos nas colunas `sidea` e `sideb`, e calcula o comprimento da hipotenusa em `sidec` (a raiz quadrada das somas dos quadrados dos outros lados):

```
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

Selecionando da tabela, obtém-se este resultado:

```
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Qualquer aplicativo que utilize a tabela `triangle` tem acesso aos valores da hipotenusa sem precisar especificar a expressão que os calcula.

As definições de coluna geradas têm essa sintaxe:

```
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY]] [[PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indica que a coluna é gerada e define a expressão usada para calcular os valores da coluna. `AS` pode ser precedido por `GENERATED ALWAYS` para tornar a natureza gerada da coluna mais explícita. Os construtos permitidos ou proibidos na expressão são discutidos mais adiante.

A palavra-chave `VIRTUAL` ou `STORED` indica como os valores das colunas são armazenados, o que tem implicações para o uso da coluna:

* `VIRTUAL`: Os valores das colunas não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna virtual não ocupa armazenamento.

`InnoDB` suporta índices secundários em colunas virtuais. Veja a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

* `STORED`: Os valores das colunas são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna armazenada requer espaço de armazenamento e pode ser indexada.

O padrão é `VIRTUAL` se nenhum dos termos-chave for especificado.

É permitido misturar as colunas `VIRTUAL` e `STORED` dentro de uma tabela.

Outros atributos podem ser fornecidos para indicar se a coluna está indexada ou pode ser `NULL`, ou fornecer um comentário.

As expressões de coluna geradas devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Literais, funções internas determinísticas e operadores são permitidos. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocações produzem o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Funções armazenadas e funções carregáveis não são permitidas. * Procedimentos armazenados e parâmetros de função não são permitidos. * Variáveis (variáveis de sistema, variáveis definidas pelo usuário e variáveis locais de programa armazenadas) não são permitidas.

* Subconsultas não são permitidas. * Uma definição de coluna gerada pode se referir a outras colunas geradas, mas apenas aquelas que ocorrem anteriormente na definição da tabela. Uma definição de coluna gerada pode se referir a qualquer coluna base (não gerada) na tabela, independentemente de sua definição ocorrer anteriormente ou posteriormente.

* O atributo `AUTO_INCREMENT` não pode ser usado em uma definição de coluna gerada.

* Uma coluna `AUTO_INCREMENT` não pode ser usada como uma coluna base em uma definição de coluna gerada.

* Se a avaliação da expressão causar truncação ou fornecer entrada incorreta para uma função, a declaração `CREATE TABLE` termina com um erro e a operação DDL é rejeitada.

Se a expressão avaliar um tipo de dados que difere do tipo de coluna declarado, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

Se uma coluna gerada usar o tipo de dados `TIMESTAMP`, o ajuste para `explicit_defaults_for_timestamp` é ignorado. Nesses casos, se essa variável for desativada, `NULL` não é convertido para `CURRENT_TIMESTAMP`. Em MySQL 8.0.22 e versões posteriores, se a coluna também for declarada como `NOT NULL`, tentar inserir `NULL` é explicitamente rejeitado com `ER_BAD_NULL_ERROR`.

Nota

A avaliação de expressão utiliza o modo SQL em vigor no momento da avaliação. Se qualquer componente da expressão depender do modo SQL, podem ocorrer resultados diferentes para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

Para `CREATE TABLE ... LIKE`(create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement"), a tabela de destino preserva as informações da coluna gerada da tabela original.

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada foram geradas. A parte `SELECT` da declaração não pode atribuir valores às colunas geradas na tabela de destino.

A partição por colunas geradas é permitida. Veja Partição de tabela.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais de `ON UPDATE` ou `ON DELETE`.

Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para se referir a colunas geradas.

Para `INSERT`, `REPLACE` e `UPDATE`, se uma coluna gerada for inserida, substituída ou atualizada explicitamente, o único valor permitido é `DEFAULT`.

Uma coluna gerada em uma visualização é considerada atualizável, pois é possível atribuí-la. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`.

As colunas geradas têm vários casos de uso, como estes:

* Colunas geradas virtualmente podem ser usadas como uma maneira de simplificar e unificar consultas. Uma condição complicada pode ser definida como uma coluna gerada e referenciada em várias consultas na tabela para garantir que todas elas usem exatamente a mesma condição.

* Colunas geradas armazenadas podem ser usadas como um cache materializado para condições complicadas que são custosas de calcular rapidamente.

* Colunas geradas podem simular índices funcionais: Use uma coluna gerada para definir uma expressão funcional e indexá-la. Isso pode ser útil para trabalhar com colunas de tipos que não podem ser indexados diretamente, como as colunas `JSON`; veja Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

Para colunas geradas armazenadas, a desvantagem dessa abordagem é que os valores são armazenados duas vezes: uma vez como o valor da coluna gerada e uma vez no índice.

* Se uma coluna gerada estiver indexada, o otimizador reconhece expressões de consulta que correspondem à definição da coluna e utiliza índices da coluna conforme apropriado durante a execução da consulta, mesmo que uma consulta não faça referência direta à coluna pelo nome. Para detalhes, consulte a Seção 10.3.11, “Uso do Otimizador de Índices de Coluna Gerada”.

Exemplo:

Suponha que uma tabela `t1` contenha as colunas `first_name` e `last_name` e que as aplicações frequentemente construam o nome completo usando uma expressão como esta:

```
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

Uma maneira de evitar a escrita da expressão é criar uma visão `v1` em `t1`, o que simplifica as aplicações, permitindo que elas selecionem diretamente `full_name` sem usar uma expressão:

```
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

Uma coluna gerada também permite que as aplicações selecionem `full_name` diretamente, sem a necessidade de definir uma visão:

```
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```

#### 15.1.20.9 Índices secundários e colunas geradas

`InnoDB` suporta índices secundários em colunas geradas virtualmente. Outros tipos de índice não são suportados. Um índice secundário definido em uma coluna virtual é às vezes referido como um "índice virtual".

Um índice secundário pode ser criado em uma ou mais colunas virtuais ou em uma combinação de colunas virtuais e colunas regulares ou colunas geradas armazenadas. Índices secundários que incluem colunas virtuais podem ser definidos como `UNIQUE`.

Quando um índice secundário é criado em uma coluna gerada virtualmente, os valores da coluna gerada são materializados nos registros do índice. Se o índice for um índice coberto (um que inclui todas as colunas recuperadas por uma consulta), os valores da coluna gerada são recuperados de valores materializados na estrutura do índice, em vez de serem calculados “on the fly”.

Há custos adicionais de escrita a serem considerados ao usar um índice secundário em uma coluna virtual devido à computação realizada ao materializar os valores da coluna virtual em registros de índice secundário durante as operações `INSERT` e `UPDATE`. Mesmo com custos adicionais de escrita, índices secundários em colunas virtuais podem ser preferíveis a colunas *armazenadas* geradas, que são materializadas no índice agrupado, resultando em tabelas maiores que requerem mais espaço em disco e memória. Se um índice secundário não for definido em uma coluna virtual, há custos adicionais para leituras, pois os valores da coluna virtual devem ser calculados cada vez que a linha da coluna é examinada.

Os valores de uma coluna virtual indexada são registrados no MVCC para evitar a recomputação desnecessária dos valores da coluna gerada durante o rollback ou durante uma operação de purga. O comprimento dos dados dos valores registrados é limitado pelo limite da chave de índice de 767 bytes para os formatos de linha `COMPACT` e `REDUNDANT` e 3072 bytes para os formatos de linha `DYNAMIC` e `COMPRESSED`.

Adicionar ou excluir um índice secundário em uma coluna virtual é uma operação in-place.

##### Indicar uma coluna gerada para fornecer um índice de coluna JSON

Como mencionado em outro lugar, as colunas `JSON` não podem ser indexadas diretamente. Para criar um índice que faça referência a uma coluna desse tipo indiretamente, você pode definir uma coluna gerada que extraia as informações que devem ser indexadas, e, em seguida, criar um índice na coluna gerada, conforme mostrado neste exemplo:

```
mysql> CREATE TABLE jemp (
    ->     c JSON,
    ->     g INT GENERATED ALWAYS AS (c->"$.id"),
    ->     INDEX i (g)
    -> );
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO jemp (c) VALUES
     >   ('{"id": "1", "name": "Fred"}'), ('{"id": "2", "name": "Wilma"}'),
     >   ('{"id": "3", "name": "Barney"}'), ('{"id": "4", "name": "Betty"}');
Query OK, 4 rows affected (0.04 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c->>"$.name" AS name
     >     FROM jemp WHERE g > 2;
+--------+
| name   |
+--------+
| Barney |
| Betty  |
+--------+
2 rows in set (0.00 sec)

mysql> EXPLAIN SELECT c->>"$.name" AS name
     >    FROM jemp WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name'))
AS `name` from `test`.`jemp` where (`test`.`jemp`.`g` > 2)
1 row in set (0.00 sec)
```

(Nós envolvemos a saída da última declaração neste exemplo para caber na área de visualização.)

Quando você usa `EXPLAIN` em uma `SELECT` ou outra declaração SQL que contém uma ou mais expressões que utilizam o operador `->` ou `->>`, essas expressões são traduzidas em seus equivalentes usando `JSON_EXTRACT()` e (se necessário) `JSON_UNQUOTE()` em vez disso, como mostrado aqui na saída de [`SHOW WARNINGS`](show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") imediatamente após esta declaração `EXPLAIN`:

```
mysql> EXPLAIN SELECT c->>"$.name"
     > FROM jemp WHERE g > 2 ORDER BY c->"$.name"\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where; Using filesort
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name')) AS
`c->>"$.name"` from `test`.`jemp` where (`test`.`jemp`.`g` > 2) order by
json_extract(`test`.`jemp`.`c`,'$.name')
1 row in set (0.00 sec)
```

Consulte as descrições dos operadores `->` e `->>`, bem como as dos `JSON_EXTRACT()` e `JSON_UNQUOTE()` funções, para obter informações adicionais e exemplos.

Essa técnica também pode ser usada para fornecer índices que fazem referência indireta a colunas de outros tipos que não podem ser indexadas diretamente, como as colunas `GEOMETRY`.

Em MySQL 8.0.21 e versões posteriores, também é possível criar um índice em uma coluna `JSON` usando a função `JSON_VALUE()` com uma expressão que pode ser usada para otimizar consultas que empregam a expressão. Consulte a descrição daquela função para obter mais informações e exemplos.

Colunas JSON e indexação indireta no NDB Cluster

É também possível usar indexação indireta de colunas JSON no MySQL NDB Cluster, sujeito às seguintes condições:

1. `NDB` lida internamente com o valor da coluna `JSON` como um `BLOB`. Isso significa que qualquer tabela `NDB` que tenha uma ou mais colunas JSON deve ter uma chave primária, caso contrário, não pode ser registrada no log binário.

2. O motor de armazenamento `NDB` não suporta indexação de colunas virtuais. Como o padrão para as colunas geradas é `VIRTUAL`, você deve especificar explicitamente a coluna gerada à qual se deseja aplicar o índice indireto como `STORED`.

A declaração **`CREATE TABLE`** usada para criar a tabela `jempn` mostrada aqui é uma versão da tabela `jemp` mostrada anteriormente, com modificações que a tornam compatível com `NDB`:

```
CREATE TABLE jempn (
  a BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c JSON DEFAULT NULL,
  g INT GENERATED ALWAYS AS (c->"$.id") STORED,
  INDEX i (g)
) ENGINE=NDB;
```

Podemos preencher esta tabela usando a seguinte declaração `INSERT`:

```
INSERT INTO jempn (c) VALUES
  ('{"id": "1", "name": "Fred"}'),
  ('{"id": "2", "name": "Wilma"}'),
  ('{"id": "3", "name": "Barney"}'),
  ('{"id": "4", "name": "Betty"}');
```

Agora o `NDB` pode usar o índice `i`, conforme mostrado aqui:

```
mysql> EXPLAIN SELECT c->>"$.name" AS name
    ->           FROM jempn WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jempn
   partitions: p0,p1,p2,p3
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using pushed condition (`test`.`jempn`.`g` > 2)
1 row in set, 1 warning (0.01 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select
json_unquote(json_extract(`test`.`jempn`.`c`,'$.name')) AS `name` from
`test`.`jempn` where (`test`.`jempn`.`g` > 2)
1 row in set (0.00 sec)
```

Você deve ter em mente que uma coluna gerada armazenada, assim como qualquer índice em uma coluna desse tipo, usa `DataMemory`.

#### 15.1.20.10 Colunas invisíveis

O MySQL suporta colunas invisíveis a partir do MySQL 8.0.23. Uma coluna invisível é normalmente oculta para consultas, mas pode ser acessada se referida explicitamente. Antes do MySQL 8.0.23, todas as colunas são visíveis.

Como ilustração de quando colunas invisíveis podem ser úteis, suponha que um aplicativo use consultas `SELECT *` para acessar uma tabela e precise continuar funcionando sem modificações, mesmo se a tabela for alterada para adicionar uma nova coluna que o aplicativo não espera que esteja lá. Em uma consulta `SELECT *`, o `*` avalia todas as colunas da tabela, exceto aquelas que são invisíveis, então a solução é adicionar a nova coluna como uma coluna invisível. A coluna permanece "oculta" das consultas `SELECT *`, e o aplicativo continua funcionando como anteriormente. Uma versão mais recente do aplicativo pode se referir à coluna invisível, se necessário, referenciando-a explicitamente.

As seções a seguir detalham como o MySQL trata as colunas invisíveis.

* Declarações DDL e Colunas Invisíveis
* Declarações DML e Colunas Invisíveis
* Metadados da Coluna Invisível
* O Log Binário e Colunas Invisíveis

##### Declarações DDL e Colunas Invisíveis

As colunas são visíveis por padrão. Para especificar explicitamente a visibilidade de uma nova coluna, use uma palavra-chave `VISIBLE` ou `INVISIBLE` como parte da definição da coluna para `CREATE TABLE` ou `ALTER TABLE`:

```
CREATE TABLE t1 (
  i INT,
  j DATE INVISIBLE
) ENGINE = InnoDB;
ALTER TABLE t1 ADD COLUMN k INT INVISIBLE;
```

Para alterar a visibilidade de uma coluna existente, use uma palavra-chave `VISIBLE` ou `INVISIBLE` com uma das cláusulas de modificação de coluna `ALTER TABLE`:

```
ALTER TABLE t1 CHANGE COLUMN j j DATE VISIBLE;
ALTER TABLE t1 MODIFY COLUMN j DATE INVISIBLE;
ALTER TABLE t1 ALTER COLUMN j SET VISIBLE;
```

Uma tabela deve ter pelo menos uma coluna visível. Tentar tornar todas as colunas invisíveis produz um erro.

Colunas invisíveis suportam os atributos usuais das colunas: `NULL`, `NOT NULL`, `AUTO_INCREMENT`, e assim por diante.

As colunas geradas podem ser invisíveis.

As definições de índice podem nomear colunas invisíveis, incluindo definições para os índices `PRIMARY KEY` e `UNIQUE`. Embora uma tabela deva ter pelo menos uma coluna visível, uma definição de índice não precisa ter nenhuma coluna visível.

Uma coluna invisível que cai de uma tabela é descartada da forma usual de qualquer definição de índice que nomeie a coluna.

As restrições de chave estrangeira podem ser definidas em colunas invisíveis, e as restrições de chave estrangeira podem referenciar colunas invisíveis.

As restrições `CHECK` podem ser definidas em colunas invisíveis. Para novas ou modificadas linhas, a violação de uma restrição `CHECK` em uma coluna invisível produz um erro.

`CREATE TABLE ... LIKE`(create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement") inclui colunas invisíveis, e elas são invisíveis na nova tabela.

`CREATE TABLE ... SELECT` (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") não inclui colunas invisíveis, a menos que sejam explicitamente referenciadas na parte `SELECT`. No entanto, mesmo que explicitamente referenciada, uma coluna que é invisível na tabela existente é visível na nova tabela:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Se a invisibilidade deve ser preservada, forneça uma definição para a coluna invisível na parte `CREATE TABLE` do `CREATE TABLE ... SELECT` da declaração:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 (col2 INT INVISIBLE) AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

As visões podem se referir a colunas invisíveis, referenciando-as explicitamente na declaração `SELECT` que define a visão. Alterar a visibilidade de uma coluna após definir uma visão que faz referência à coluna não altera o comportamento da visão.

##### Declarações DML e Colunas Invisíveis

Para as declarações `SELECT`, uma coluna invisível não faz parte do conjunto de resultados, a menos que seja explicitamente referenciada na lista de seleção. Em uma lista de seleção, as abreviações `*` e `tbl_name.*` não incluem colunas invisíveis. As junções naturais não incluem colunas invisíveis.

Considere a seguinte sequência de afirmações:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> INSERT INTO t1 (col1, col2) VALUES(1, 2), (3, 4);

mysql> SELECT * FROM t1;
+------+
| col1 |
+------+
|    1 |
|    3 |
+------+

mysql> SELECT col1, col2 FROM t1;
+------+------+
| col1 | col2 |
+------+------+
|    1 |    2 |
|    3 |    4 |
+------+------+
```

O primeiro `SELECT` não faz referência à coluna invisível `col2` na lista de seleção (porque `*` não inclui colunas invisíveis), então `col2` não aparece no resultado da declaração. O segundo `SELECT` faz referência explícita a `col2`, então a coluna aparece no resultado.

A declaração `TABLE t1` (table.html "15.2.16 TABLE Statement") produz o mesmo resultado que a primeira declaração `SELECT`. Como não há como especificar colunas em uma declaração `TABLE`, `TABLE` nunca exibe colunas invisíveis.

Para declarações que criam novas linhas, uma coluna invisível é atribuída seu valor padrão implícito, a menos que seja explicitamente referenciada e atribuída um valor. Para informações sobre o tratamento de valores padrão implícitos, consulte Gerenciamento de valores padrão implícitos.

Para `INSERT` (e `REPLACE`, para linhas não substituídas), a atribuição padrão implícita ocorre com uma lista de colunas ausente, uma lista de colunas vazia ou uma lista de colunas não vazia que não inclui a coluna invisível:

```
CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
INSERT INTO t1 VALUES(...);
INSERT INTO t1 () VALUES(...);
INSERT INTO t1 (col1) VALUES(...);
```

Para as primeiras duas declarações `INSERT`, a lista `VALUES()` deve fornecer um valor para cada coluna visível e nenhuma coluna invisível. Para a terceira declaração `INSERT`, a lista `VALUES()` deve fornecer o mesmo número de valores que o número de colunas nomeadas; o mesmo é verdadeiro quando você usa [`VALUES ROW()`](values.html "15.2.19 VALUES Statement") em vez de `VALUES()`.

Para `LOAD DATA` e `LOAD XML`, a atribuição implicitamente padrão ocorre com uma lista de colunas ausente ou uma lista de colunas não vazia que não inclui a coluna invisível. As linhas de entrada não devem incluir um valor para a coluna invisível.

Para atribuir um valor diferente do padrão implícito para as declarações anteriores, nomeie explicitamente a coluna invisível na lista de colunas e forneça um valor para ela.

`INSERT INTO ... SELECT *` e (insert-select.html "15.2.7.1 INSERT ... SELECT Statement") não incluem colunas invisíveis porque `REPLACE INTO ... SELECT *` não inclui colunas invisíveis. A atribuição padrão implícita ocorre conforme descrito anteriormente.

Para declarações que inserem ou ignoram novas linhas, ou que substituem ou modificam linhas existentes, com base em valores em um índice `PRIMARY KEY` ou `UNIQUE`, o MySQL trata as colunas invisíveis da mesma forma que as colunas visíveis: As colunas invisíveis participam de comparações de valores chave. Especificamente, se uma nova linha tiver o mesmo valor que uma linha existente para um valor de chave única, esses comportamentos ocorrem independentemente de as colunas do índice serem visíveis ou invisíveis:

* Com o modificador `IGNORE`, `INSERT`, `LOAD DATA` e `LOAD XML`, ignore a nova linha.

* `REPLACE` substitui a linha existente pela nova linha. Com o modificador `REPLACE`, `LOAD DATA` e `LOAD XML` fazem o mesmo.

* `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") atualiza a linha existente.

Para atualizar colunas invisíveis para as declarações `UPDATE`, nomeie-as e atribua um valor, assim como para as colunas visíveis.

##### Metadados da coluna invisível

Informações sobre se uma coluna é visível ou invisível estão disponíveis na coluna `EXTRA` do esquema de informações da tabela `COLUMNS` ou na saída `SHOW COLUMNS`. Por exemplo:

```
mysql> SELECT TABLE_NAME, COLUMN_NAME, EXTRA
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
+------------+-------------+-----------+
| TABLE_NAME | COLUMN_NAME | EXTRA     |
+------------+-------------+-----------+
| t1         | i           |           |
| t1         | j           |           |
| t1         | k           | INVISIBLE |
+------------+-------------+-----------+
```

As colunas são visíveis por padrão, portanto, no caso de `EXTRA`, não há informações de visibilidade. Para colunas invisíveis, `EXTRA` exibe `INVISIBLE`.

`SHOW CREATE TABLE` exibe colunas invisíveis na definição da tabela, com a palavra-chave `INVISIBLE` em um comentário específico para a versão:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i` int DEFAULT NULL,
  `j` int DEFAULT NULL,
  `k` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

O **mysqldump** e `mysqlpump` utilizam `SHOW CREATE TABLE`, portanto, incluem colunas invisíveis nas definições de tabelas descarregadas. Eles também incluem valores de coluna invisíveis nos dados descarregados.

Ao recarregar um arquivo de dump em uma versão mais antiga do MySQL que não suporta colunas invisíveis, o comentário específico para a versão é ignorado, o que torna as colunas invisíveis visíveis.

##### O Log Binário e Colunas Invisíveis

O MySQL trata as colunas invisíveis da seguinte forma em relação aos eventos no log binário:

* Os eventos de criação de tabela incluem o atributo `INVISIBLE` para colunas invisíveis.

* Colunas invisíveis são tratadas como colunas visíveis em eventos de linha. Elas são incluídas, se necessário, de acordo com a configuração da variável de sistema `binlog_row_image`.

* Quando eventos de linha são aplicados, as colunas invisíveis são tratadas como colunas visíveis em eventos de linha. Em particular, o algoritmo e o índice a serem utilizados são escolhidos de acordo com a configuração da variável de sistema `slave_rows_search_algorithms`.

* Colunas invisíveis são tratadas como colunas visíveis ao calcular sets de escrita. Em particular, os sets de escrita incluem índices definidos em colunas invisíveis.

* O comando **mysqlbinlog** inclui visibilidade nos metadados da coluna.

#### 15.1.20.11 Chaves primárias invisíveis geradas

A partir do MySQL 8.0.30, o MySQL suporta chaves primárias geradas invisíveis para qualquer tabela `InnoDB` que seja criada sem uma chave primária explícita. Quando a variável de sistema do servidor `sql_generate_invisible_primary_key` é definida como `ON`, o servidor MySQL adiciona automaticamente uma chave primária invisível gerada (GIPK) a qualquer tabela desse tipo. Esse ajuste não tem efeito em tabelas criadas usando qualquer outro mecanismo de armazenamento que não `InnoDB`.

Por padrão, o valor de `sql_generate_invisible_primary_key` é `OFF`, o que significa que a adição automática de GIPKs está desativada. Para ilustrar como isso afeta a criação de tabelas, começamos criando duas tabelas idênticas, nenhuma das quais tem uma chave primária, a única diferença sendo que a primeira (tabela `auto_0`) é criada com `sql_generate_invisible_primary_key` definido como `OFF`, e a segunda (`auto_1`) após defini-la como `ON`, conforme mostrado aqui:

```
mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    0 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_0 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> SET sql_generate_invisible_primary_key=ON;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_1 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.04 sec)
```

Compare a saída dessas declarações `SHOW CREATE TABLE`](show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement") para ver a diferença na forma como as tabelas foram realmente criadas:

```
mysql> SHOW CREATE TABLE auto_0\G
*************************** 1. row ***************************
       Table: auto_0
Create Table: CREATE TABLE `auto_0` (
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT /*!80023 INVISIBLE */,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Como o `auto_1` não tinha uma chave primária especificada pela declaração `CREATE TABLE` usada para criá-lo, definir o `sql_generate_invisible_primary_key = ON` faz com que o MySQL adicione tanto a coluna invisível `my_row_id` a esta tabela quanto uma chave primária nessa coluna. Como o `sql_generate_invisible_primary_key` era `OFF` no momento em que o `auto_0` foi criado, não foram realizadas tais adições naquela tabela.

Quando uma chave primária é adicionada a uma tabela pelo servidor, o nome da coluna e da chave é sempre `my_row_id`. Por essa razão, ao habilitar chaves primárias invisíveis geradas dessa maneira, você não pode criar uma tabela com uma coluna chamada `my_row_id`, a menos que a declaração de criação da tabela também especifique uma chave primária explícita. (Você não é obrigado a nomear a coluna ou chave `my_row_id` nessas situações.)

`my_row_id` é uma coluna invisível, o que significa que ela não é exibida na saída de `SELECT *` ou `TABLE`; a coluna deve ser selecionada explicitamente pelo nome. Veja a Seção 15.1.20.10, “Colunas Invisíveis”.

Quando os GIPKs estão habilitados, uma chave primária gerada não pode ser alterada senão para alterná-la entre `VISIBLE` e `INVISIBLE`. Para tornar a chave primária gerada invisível em `auto_1` visível, execute esta declaração `ALTER TABLE`:

```
mysql> ALTER TABLE auto_1 ALTER COLUMN my_row_id SET VISIBLE;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

Para tornar essa chave primária gerada invisível novamente, emita `ALTER TABLE auto_1 ALTER COLUMN my_row_id SET INVISIBLE`.

Uma chave primária invisível gerada sempre é invisível por padrão.

Sempre que os GIPKs estiverem habilitados, você não pode descartar uma chave primária gerada se uma das seguintes 2 condições resultar:

* A tabela é deixada sem chave primária. * A chave primária é descartada, mas não a coluna da chave primária.

Os efeitos de `sql_generate_invisible_primary_key` se aplicam apenas a tabelas que utilizam o mecanismo de armazenamento `InnoDB`. Você pode usar uma declaração `ALTER TABLE` para alterar o mecanismo de armazenamento usado por uma tabela que possui uma chave primária invisível gerada; nesse caso, a chave primária e a coluna permanecem no lugar, mas a tabela e a chave não recebem mais nenhum tratamento especial.

Por padrão, as GIPKs são exibidas na saída de `SHOW CREATE TABLE`, `SHOW COLUMNS` e `SHOW INDEX`, e são visíveis nas tabelas do esquema de informações `COLUMNS` e `STATISTICS`. Você pode fazer com que as chaves primárias geradas invisíveis sejam escondidas, em vez disso, configurando a variável de sistema `show_gipk_in_create_table_and_information_schema` para `OFF`. Por padrão, essa variável é `ON`, conforme mostrado aqui:

```
mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
1 row in set (0.00 sec)
```

Como pode ser visto na consulta a seguir contra a tabela `COLUMNS`, `my_row_id` é visível entre as colunas de `auto_1`:

```
mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| my_row_id   |                1 | bigint    | PRI        |
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
3 rows in set (0.01 sec)
```

Depois que `show_gipk_in_create_table_and_information_schema` é definido como `OFF`, `my_row_id` não pode mais ser visto na tabela `COLUMNS`, conforme mostrado aqui:

```
mysql> SET show_gipk_in_create_table_and_information_schema = OFF;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  0 |
+----------------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
2 rows in set (0.00 sec)
```

O cenário para `sql_generate_invisible_primary_key` não é replicado e é ignorado pelas threads do aplicativo de replicação. Isso significa que a definição desta variável na fonte não tem efeito na replica. No MySQL 8.0.32 e versões posteriores, você pode fazer com que a replica adicione um GIPK para tabelas replicadas sem chaves primárias em um determinado canal de replicação usando `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement").

Os GIPKs trabalham com replicação baseada em linha do `CREATE TABLE ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"); as informações escritas no log binário para esta declaração, nesses casos, incluem a definição do GIPK e, portanto, são replicadas corretamente. A replicação baseada em declaração do `CREATE TABLE ... SELECT` não é suportada com o `sql_generate_invisible_primary_key = ON`.

Ao criar ou importar backups de instalações onde GIPKs estão em uso, é possível excluir as colunas e valores primárias invisíveis gerados. A opção `--skip-generated-invisible-primary-key` para **mysqldump** faz com que as informações do GIPK sejam excluídas na saída do programa. Se você está importando um arquivo de dump que contém chaves primárias invisíveis e valores gerados, também pode usar `--skip-generated-invisible-primary-key` com **mysqlpump** para supri-los (e, assim, não serem importados).

#### 15.1.20.12 Configurando as Opções de Comentário NDB

* Opções de NDB_COLUMN
* Opções de NDB_TABLE

É possível definir uma série de opções específicas para o NDB Cluster na tabela de comentários ou comentários de coluna de uma tabela `NDB`. Opções de nível de tabela para controlar a leitura de qualquer replica e equilíbrio de partição podem ser incorporadas em um comentário de tabela usando `NDB_TABLE`.

`NDB_COLUMN` pode ser usado em um comentário de coluna para definir o tamanho da coluna da tabela de partes do blob usada para armazenar partes dos valores do blob por `NDB` até seu máximo. Isso funciona para as colunas `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT` e `JSON`. A partir do NDB 8.0.30, um comentário de coluna também pode ser usado para controlar o tamanho inline de uma coluna de blob. Os comentários `NDB_COLUMN` não suportam as colunas `TINYBLOB` ou `TINYTEXT`, uma vez que estas têm uma parte inline (apenas) de tamanho fixo e nenhuma parte separada para armazenar em outro lugar.

`NDB_TABLE` pode ser usado em um comentário de tabela para definir opções relacionadas ao equilíbrio da partição e se a tabela é totalmente replicada, entre outras coisas.

O restante desta seção descreve essas opções e seu uso.

##### Opções de NDB_COLUMN

No NDB Cluster, um comentário de coluna em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_COLUMN`. A partir da versão 8.0.30, `NDB` suporta duas opções de comentário de coluna `BLOB_INLINE_SIZE` e `MAX_BLOB_PART_SIZE`. (Antes do NDB 8.0.30, apenas `MAX_BLOB_PART_SIZE` é suportada.) A sintaxe para esta opção é mostrada aqui:

```
COMMENT 'NDB_COLUMN=speclist'

speclist := spec[,spec]

spec :=
    BLOB_INLINE_SIZE=value
  | MAX_BLOB_PART_SIZE[={0|1}]
```

`BLOB_INLINE_SIZE` especifica o número de bytes a serem armazenados inline pelo colunado; seu valor esperado é um inteiro no intervalo de 1 a 29980, inclusive. Definir um valor maior que 29980 gera um erro; definir um valor menor que 1 é permitido, mas causa o uso do tamanho inline padrão para o tipo de coluna.

Você deve estar ciente de que o valor máximo para esta opção é, na verdade, o número máximo de bytes que podem ser armazenados em uma única linha de uma tabela `NDB`; cada coluna na linha contribui para esse total.

Você também deve ter em mente, especialmente ao trabalhar com colunas `TEXT`, que o valor definido por `MAX_BLOB_PART_SIZE` ou `BLOB_INLINE_SIZE` representa o tamanho da coluna em bytes. Isso não indica o número de caracteres, que varia de acordo com o conjunto de caracteres e a ordenação utilizados pela coluna.

Para ver os efeitos desta opção, primeiro crie uma tabela com duas colunas `BLOB`, uma (`b1`) sem opções adicionais e outra (`b2`) com um ajuste para `BLOB_INLINE_SIZE`, conforme mostrado aqui:

```
mysql> CREATE TABLE t1 (
    ->    a INT NOT NULL PRIMARY KEY,
    ->    b1 BLOB,
    ->    b2 BLOB COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=8000'
    ->  ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

Você pode ver as configurações do `BLOB_INLINE_SIZE` para as colunas do `BLOB` fazendo uma consulta à tabela `ndbinfo.blobs`, da seguinte forma:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't1';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| b1          |         256 |           2000 |
| b2          |        8000 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.01 sec)
```

Você também pode verificar a saída do utilitário **ndb_desc**, como mostrado aqui, com as linhas relevantes exibidas usando texto em negrito:

```
$> ndb_desc -d test t1
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 945
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
a Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
b1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_1
b2 Blob(8000,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_2
-- Indexes --
PRIMARY KEY(a) - UniqueHashIndex
PRIMARY(a) - OrderedIndex
```

`BLOB_INLINE_SIZE` não afeta as colunas `TINYBLOB`. No NDB 8.0.41 e versões posteriores, ele é desativado com `TINYBLOB`, e causa um aviso se usado.

Para `MAX_BLOB_PART_SIZE`, o sinal `=` e o valor que o segue são opcionais. O uso de qualquer valor diferente de 0 ou 1 resulta em um erro de sintaxe.

O efeito de usar `MAX_BLOB_PART_SIZE` em um comentário de coluna é definir o tamanho da parte do blob de uma coluna `TEXT` ou `BLOB` para o número máximo de bytes suportados por isso pela `NDB` (13948). Esta opção pode ser aplicada a qualquer tipo de coluna de blob suportada pelo MySQL, exceto `TINYBLOB` ou `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). Ao contrário de `BLOB_INLINE_SIZE`, `MAX_BLOB_PART_SIZE` não tem efeito sobre as colunas `JSON`.

Para ver os efeitos desta opção, primeiro executamos a seguinte instrução SQL no cliente **mysql** para criar uma tabela com duas colunas `BLOB`, uma (`c1`) sem opções adicionais e outra (`c2`) com `MAX_BLOB_PART_SIZE`:

```
mysql> CREATE TABLE test.t2 (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

Do shell do sistema, execute o utilitário **ndb_desc** para obter informações sobre a tabela recém criada, conforme mostrado neste exemplo:

```
$> ndb_desc -d test t2
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_1
c2 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

As informações das colunas na saída estão listadas em `Attributes`; para as colunas `c1` e `c2`, elas são exibidas aqui em texto destacado. Para `c1`, o tamanho da parte do blob é 2000, o valor padrão; para `c2`, é 13948, conforme definido por `MAX_BLOB_PART_SIZE`.

Você também pode consultar a tabela `ndbinfo.blobs` para ver isso, como mostrado aqui:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |           2000 |
| c2          |         256 |          13948 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

Você pode alterar o tamanho da parte do blob para uma coluna de blob específica de uma tabela `NDB` usando uma declaração `ALTER TABLE` como esta, e verificar as alterações posteriormente usando [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement"):

```
mysql> ALTER TABLE test.t2
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t2\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t2` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

A saída do **ndb_desc** mostra que os tamanhos das partes de blob das colunas foram alterados conforme esperado:

```
$> ndb_desc -d test t2
-- t --
Version: 16777220
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_1
c2 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

Você também pode ver a mudança executando a consulta novamente contra `ndbinfo.blobs`:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |          13948 |
| c2          |         256 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

É possível definir tanto `BLOB_INLINE_SIZE` quanto `MAX_BLOB_PART_SIZE` para uma coluna de blob, conforme mostrado nesta declaração `CREATE TABLE`:

```
mysql> CREATE TABLE test.t3 (
    ->   p INT NOT NULL PRIMARY KEY,
    ->   c1 JSON,
    ->   c2 JSON COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=5000,MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.28 sec)
```

A consulta à tabela `blobs` nos mostra que a declaração funcionou conforme o esperado:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't3';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |        4000 |           8100 |
| c2          |        5000 |           8100 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

Você também pode verificar se a declaração funcionou, verificando a saída do **ndb_desc**.

A alteração do tamanho da parte blob de uma coluna deve ser feita usando uma cópia `ALTER TABLE`; essa operação não pode ser realizada online (consulte Seção 25.6.12, “Operações online com ALTER TABLE em NDB Cluster”).

Para mais informações sobre como o `NDB` armazena colunas de tipos blob, consulte os Requisitos de Armazenamento de Tipo de String.

##### Opções da Tabela NDB

Para uma tabela de NDB Cluster, o comentário da tabela em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_TABLE`, que consiste em um ou mais pares nome-valor, separados por vírgulas, se necessário, seguindo a string `NDB_TABLE=`. A sintaxe completa para nomes e valores é mostrada aqui:

```
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,...]]"

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Espaços não são permitidos na string citada. A string é sensível a maiúsculas e minúsculas.

As quatro opções da tabela `NDB` que podem ser definidas como parte de um comentário dessa forma são descritas com mais detalhes nos próximos parágrafos.

`NOLOGGING`: Por padrão, as tabelas `NDB` são registradas e verificadas. Isso as torna resistentes a falhas em todo o clúster. Ao usar `NOLOGGING` ao criar ou alterar uma tabela, significa que essa tabela não é registrada novamente ou incluída em pontos de verificação locais. Neste caso, a tabela ainda é replicada nos nós de dados para alta disponibilidade e atualizada usando transações, mas as alterações nela feitas não são registradas nos logs de redo do nó de dados e seu conteúdo não é verificado em disco; ao recuperar de uma falha no clúster, o clúster retém a definição da tabela, mas nenhuma de suas linhas — ou seja, a tabela está vazia.

O uso de tabelas sem registro dessas reduz as demandas do nó de dados em I/O de disco e armazenamento, bem como na CPU para o checkpointing da CPU. Isso pode ser adequado para dados de curta duração que são frequentemente atualizados e onde a perda de todos os dados no improvável caso de falha total do clúster é aceitável.

É também possível usar a variável de sistema `ndb_table_no_logging` para fazer com que quaisquer tabelas NDB criadas ou alteradas enquanto essa variável estiver em vigor se comportem como se tivessem sido criadas com o comentário `NOLOGGING`. Ao contrário do que acontece ao usar o comentário diretamente, não há nada nesse caso na saída de `SHOW CREATE TABLE` que indique que é uma tabela não registrada. Recomenda-se usar a abordagem de comentário de tabela, pois oferece controle por tabela da funcionalidade, e esse aspecto do esquema da tabela está embutido na declaração de criação da tabela, onde pode ser encontrado facilmente por ferramentas baseadas em SQL.

`READ_BACKUP`: Definir esta opção para 1 tem o mesmo efeito como se `ndb_read_backup` estivesse habilitado; habilita a leitura de qualquer réplica. Isso melhora muito o desempenho das leituras da tabela a um custo relativamente baixo para o desempenho de escrita. A partir do NDB 8.0.19, 1 é o padrão para `READ_BACKUP`, e o padrão para `ndb_read_backup` é `ON` (anteriormente, a leitura de qualquer réplica era desativada por padrão).

Você pode definir `READ_BACKUP` para uma tabela existente online, usando uma declaração `ALTER TABLE` semelhante àquela mostrada aqui:

```
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

Para mais informações sobre a opção `ALGORITHM` para `ALTER TABLE`, consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

`PARTITION_BALANCE`: Fornece controle adicional sobre a atribuição e o posicionamento das partições. Os seguintes quatro esquemas são suportados:

1. `FOR_RP_BY_NODE`: Uma partição por nó.

Apenas um LDM em cada nó armazena uma partição primária. Cada partição é armazenada no mesmo LDM (mesma ID) em todos os nós.

2. `FOR_RA_BY_NODE`: Uma partição por grupo de nós.

Cada nó armazena uma única partição, que pode ser uma replica primária ou uma replica de backup. Cada partição é armazenada no mesmo LDM em todos os nós.

3. `FOR_RP_BY_LDM`: Uma partição para cada LDM em cada nó; o padrão.

Este é o cenário utilizado se `READ_BACKUP` estiver definido como 1.

4. `FOR_RA_BY_LDM`: Uma partição por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

5. `FOR_RA_BY_LDM_X_2`: Duas partições por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

6. `FOR_RA_BY_LDM_X_3`: Três partições por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

7. `FOR_RA_BY_LDM_X_4`: Quatro partições por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

`PARTITION_BALANCE` é a interface preferida para definir o número de partições por tabela. O uso de `MAX_ROWS` para forçar o número de partições é desaconselhado, mas continua sendo suportado para compatibilidade reversa; está sujeito à remoção em uma versão futura do MySQL NDB Cluster. (Bug #81759, Bug #23544301)

`FULLY_REPLICATED` controla se a tabela é totalmente replicada, ou seja, se cada nó de dados tem uma cópia completa da tabela. Para habilitar a replicação total da tabela, use `FULLY_REPLICATED=1`.

Essa configuração também pode ser controlada usando a variável de sistema `ndb_fully_replicated`. Definindo-a como `ON`, a opção é ativada por padrão para todas as novas tabelas `NDB`; o padrão é `OFF`. A variável de sistema `ndb_data_node_neighbour` também é usada para tabelas totalmente replicadas, para garantir que, quando uma tabela totalmente replicada é acessada, acesse o nó de dados que é local deste servidor MySQL.

Um exemplo de uma declaração `CREATE TABLE` que utiliza um comentário desse tipo ao criar uma tabela `NDB` é mostrado aqui:

```
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

O comentário é exibido como parte da saída de `SHOW CREATE TABLE`. O texto do comentário também está disponível ao consultar o esquema de informações do MySQL `TABLES`, como neste exemplo:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

Essa sintaxe de comentário também é suportada com declarações `ALTER TABLE` para tabelas `NDB`, como mostrado aqui:

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

A partir do NDB 8.0.21, a coluna `TABLE_COMMENT` exibe o comentário necessário para recriar a tabela, pois está seguindo a declaração `ALTER TABLE`, da seguinte forma:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter.

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Antes do NDB 8.0.21, o comentário da tabela usado com `ALTER TABLE` substituía qualquer comentário existente que a tabela pudesse ter tido. Isso significava que (por exemplo) o valor `READ_BACKUP` não era carregado para o novo comentário definido pela declaração `ALTER TABLE`, e que quaisquer valores não especificados retornavam aos seus valores padrão. (BUG#30428829) Assim, não havia mais nenhuma maneira de usar SQL para recuperar o valor previamente definido para o comentário. Para evitar que os valores do comentário retornem aos seus valores padrão, era necessário preservar quaisquer desses valores da string de comentário existente e incluí-los no comentário passado para `ALTER TABLE`.

Você também pode ver o valor da opção `PARTITION_BALANCE` na saída do **ndb_desc**. **ndb_desc** também mostra se as opções `READ_BACKUP` e `FULLY_REPLICATED` estão definidas para a tabela. Consulte a descrição deste programa para obter mais informações.

### 15.1.21 Declaração de CREATE TABLESPACE

```
CREATE [UNDO] TABLESPACE tablespace_name

  InnoDB and NDB:
    [ADD DATAFILE 'file_name']
    [AUTOEXTEND_SIZE [=] value]

  InnoDB only:
    [FILE_BLOCK_SIZE = value]
    [ENCRYPTION [=] {'Y' | 'N'}]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]

  Reserved for future use:
    [ENGINE_ATTRIBUTE [=] 'string']
```

Essa declaração é usada para criar um tablespace. A sintaxe e a semântica precisas dependem do mecanismo de armazenamento utilizado. Em versões padrão do MySQL, essa é sempre uma `InnoDB` tablespace. O MySQL NDB Cluster também suporta tablespaces usando o mecanismo de armazenamento `NDB`.

* Considerações para InnoDB
* Considerações para NDB Cluster
* Opções
* Notas
* Exemplos de InnoDB
* Exemplo de NDB

#### Considerações para InnoDB

A sintaxe `CREATE TABLESPACE` é usada para criar espaços de tabela gerais ou espaços de desfazer. A palavra-chave `UNDO`, introduzida no MySQL 8.0.14, deve ser especificada para criar um espaço de desfazer.

Um espaço de tabela geral é um espaço de tabela compartilhado. Ele pode conter várias tabelas e suporta todos os formatos de linha de tabela. Os espaços de tabela gerais podem ser criados em um local relativo ao diretório de dados ou independente dele.

Após criar um espaço de tabela geral `InnoDB`, use `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` para adicionar tabelas ao espaço de tabela. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

Os espaços de tabela de desfazer contêm registros de desfazer. Os espaços de tabela de desfazer podem ser criados em um local escolhido, especificando um caminho de arquivo de dados totalmente qualificado. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de tabela de desfazer”.

#### Considerações para o NDB Cluster

Essa declaração é usada para criar um tablespace, que pode conter um ou mais arquivos de dados, fornecendo espaço de armazenamento para tabelas de dados do NDB Cluster Disk (ver Seção 25.6.11, “Tabelas de Dados do NDB Cluster Disk”). Um arquivo de dados é criado e adicionado ao tablespace usando essa declaração. Arquivos de dados adicionais podem ser adicionados ao tablespace usando a declaração `ALTER TABLESPACE` (ver Seção 15.1.10, “Declaração ALTER TABLESPACE”).

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de registro com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Um grupo de arquivos de registro de um ou mais arquivos de registro `UNDO` deve ser atribuído ao tablespace que será criado com a cláusula `USE LOGFILE GROUP`. *`logfile_group`* deve ser um grupo de arquivos de registro existente criado com [`CREATE LOGFILE GROUP`](create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement") (consulte Seção 15.1.16, “Declaração CREATE LOGFILE GROUP”). Múltiplos tablespaces podem usar o mesmo grupo de arquivos de registro para o registro `UNDO`.

Ao definir `EXTENT_SIZE` ou `INITIAL_SIZE`, você pode, opcionalmente, seguir o número com uma abreviação de uma ordem de grandeza, semelhante àquelas usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

`INITIAL_SIZE` e `EXTENT_SIZE` estão sujeitos à arredondamento conforme a seguir:

* `EXTENT_SIZE` é arredondado para o múltiplo inteiro mais próximo de 32K.

* `INITIAL_SIZE` é arredondado *para baixo* para o múltiplo inteiro mais próximo de 32K; este resultado é arredondado para cima para o múltiplo inteiro mais próximo de `EXTENT_SIZE` (após qualquer arredondamento).

Nota

`NDB` reserva 4% de um espaço de tabela para operações de reinício do nó de dados. Esse espaço reservado não pode ser usado para armazenamento de dados.

O arredondamento descrito acima é feito explicitamente, e o MySQL Server emite um aviso quando qualquer arredondamento é realizado. Os valores arredondados também são usados pelo kernel NDB para calcular os valores da coluna `INFORMATION_SCHEMA.FILES` e para outros propósitos. No entanto, para evitar um resultado inesperado, sugerimos que você sempre use múltiplos inteiros de 32K ao especificar essas opções.

Quando o `CREATE TABLESPACE` é usado com o `ENGINE [=] NDB`, um espaço de tabela e um arquivo de dados associado são criados em cada nó de dados do Cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles, fazendo uma consulta à tabela do esquema de informações `FILES` (Veja o exemplo mais adiante nesta seção).

(Veja a Seção 28.3.15, “A Tabela INFORMATION_SCHEMA FILES”.)

#### Opções

* `ADD DATAFILE`: Define o nome de um arquivo de dados de espaço de tabela. Esta opção é sempre necessária ao criar um espaço de tabela `NDB`; para `InnoDB` no MySQL 8.0.14 e versões posteriores, é necessária apenas ao criar um espaço de tabela de desfazer. O `file_name`, incluindo qualquer caminho especificado, deve ser citado com aspas simples ou duplas. Os nomes de arquivo (não contando a extensão do arquivo) e os nomes de diretório devem ter pelo menos um byte de comprimento. Nomes de arquivo e nomes de diretório de comprimento zero não são suportados.

Como há diferenças consideráveis na forma como os arquivos de dados são tratados pelos `InnoDB` e pelos `NDB`, os dois motores de armazenamento são abordados separadamente na discussão a seguir.

**Arquivos de dados do InnoDB.** Um espaço de tabela `InnoDB` suporta apenas um único arquivo de dados, cujo nome deve incluir uma extensão `.ibd`.

Para colocar um arquivo de dados de espaço de tabela geral `InnoDB` em um local fora do diretório de dados, inclua um caminho totalmente qualificado ou um caminho relativo ao diretório de dados. Apenas um caminho totalmente qualificado é permitido para espaços de tabela de desfazer. Se você não especificar um caminho, um espaço de tabela geral é criado no diretório de dados. Um espaço de tabela de desfazer criado sem especificar um caminho é criado no diretório definido pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` não for definida, os espaços de tabela de desfazer são criados no diretório de dados.

Para evitar conflitos com espaços de tabela criados implicitamente por arquivo por tabela, não é suportada a criação de um espaço de tabela geral `InnoDB` em um subdiretório sob o diretório de dados. Ao criar um espaço de tabela geral ou um espaço de desfazer fora do diretório de dados, o diretório deve existir e deve ser conhecido por `InnoDB` antes de criar o espaço de tabela. Para tornar um diretório conhecido por `InnoDB`, adicione-o ao valor `innodb_directories` ou a uma das variáveis cujos valores são anexados ao valor `innodb_directories`. `innodb_directories` é uma variável somente leitura. Configurar isso requer o reinício do servidor.

Se a cláusula `ADD DATAFILE` não for especificada ao criar um espaço de dados `InnoDB`, um arquivo de dados de espaço de dados com um nome de arquivo único é criado implicitamente. O nome de arquivo único é um UUID de 128 bits formatado em cinco grupos de números hexadecimais separados por traços (*`aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`*). Uma extensão de arquivo é adicionada, se necessário, pelo motor de armazenamento. Uma extensão de arquivo `.ibd` é adicionada para arquivos de dados de espaço de dados geral `InnoDB`. Em um ambiente de replicação, o nome do arquivo de dados criado no servidor de origem da replicação não é o mesmo que o nome do arquivo de dados criado na replica.

A partir do MySQL 8.0.17, a cláusula `ADD DATAFILE` não permite referências circulares de diretório ao criar um espaço de tabela `InnoDB`. Por exemplo, a referência circular de diretório (`/../`) na seguinte declaração não é permitida:

  ```
  CREATE TABLESPACE ts1 ADD DATAFILE ts1.ibd 'any_directory/../ts1.ibd';
  ```

Uma exceção a essa restrição existe no Linux, onde uma referência circular de diretório é permitida se o diretório anterior for um link simbólico. Por exemplo, o caminho do arquivo de dados no exemplo acima é permitido se *`any_directory`* for um link simbólico. (Ainda é permitido que os caminhos dos arquivos de dados comecem com '`../`'.

**Arquivos de dados NDB.** Um espaço de tabelas `NDB` suporta vários arquivos de dados que podem ter quaisquer nomes de arquivo legais; mais arquivos de dados podem ser adicionados a um espaço de tabelas NDB Cluster após sua criação usando uma declaração `ALTER TABLESPACE` (alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement").

Um arquivo de dados de espaço de tabela `NDB` é criado por padrão no diretório do sistema de arquivos do nó de dados — ou seja, o diretório denominado `ndb_nodeid_fs/TS` sob o diretório de dados do nó de dados (`DataDir`), onde *`nodeid`* é o `NodeId` do nó de dados. Para colocar o arquivo de dados em um local diferente do padrão, inclua um caminho de diretório absoluto ou um caminho relativo à localização padrão. Se o diretório especificado não existir, `NDB` tenta criá-lo; a conta de usuário do sistema sob a qual o processo do nó de dados está em execução deve ter as permissões apropriadas para fazer isso.

Nota

Ao determinar o caminho usado para um arquivo de dados, `NDB` não expande o caractere `~` (tilde).

Quando vários nós de dados são executados no mesmo host físico, as seguintes considerações se aplicam:

+ Não é possível especificar um caminho absoluto ao criar um arquivo de dados.

+ Não é possível criar arquivos de dados do espaço de tabela fora do diretório do sistema de arquivos do nó de dados, a menos que cada nó de dados tenha um diretório de dados separado.

+ Se cada nó de dados tiver seu próprio diretório de dados, os arquivos de dados podem ser criados em qualquer lugar dentro desse diretório.

+ Se cada nó de dados tiver seu próprio diretório de dados, também é possível criar um arquivo de dados fora do diretório de dados do nó usando um caminho relativo, desde que esse caminho resolva a um local único no sistema de arquivos do host para cada nó de dados que está sendo executado nesse host.

* `FILE_BLOCK_SIZE`: Esta opção, que é específica para as tabelas espaços `InnoDB` gerais, e é ignorada por `NDB`, define o tamanho do bloco para o arquivo de dados do espaço de tabelas. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um tamanho de bloco de arquivo de 8 kilobytes pode ser especificado como 8192 ou 8K. Se você não especificar esta opção, `FILE_BLOCK_SIZE` tem como padrão o valor de `innodb_page_size`. `FILE_BLOCK_SIZE` é necessário quando você pretende usar o espaço de tabelas para armazenar tabelas `InnoDB` comprimidas (`ROW_FORMAT=COMPRESSED`). Neste caso, você deve definir o espaço de tabelas `FILE_BLOCK_SIZE` ao criar o espaço de tabelas.

Se `FILE_BLOCK_SIZE` for igual ao valor de `innodb_page_size`, o tablespace pode conter apenas tabelas com um formato de linha não compactado (`COMPACT`, `REDUNDANT` e `DYNAMIC`). As tabelas com um formato de linha `COMPRESSED` têm um tamanho de página física diferente das tabelas não compactadas. Portanto, as tabelas compactadas não podem coexistir no mesmo tablespace com tabelas não compactadas.

Para que um espaço de tabelas geral possa conter tabelas comprimidas, deve ser especificado `FILE_BLOCK_SIZE`, e o valor de `FILE_BLOCK_SIZE` deve ser um tamanho de página comprimida válido em relação ao valor de `innodb_page_size`. Além disso, o tamanho de página física da tabela comprimida (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16K`, e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de tabelas gerais”.

* `USE LOGFILE GROUP`: Requerido para `NDB`, este é o nome de um grupo de arquivos de registro previamente criado usando `CREATE LOGFILE GROUP`(create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement"). Não é suportado para `InnoDB`, onde falha com um erro.

* `EXTENT_SIZE`: Esta opção é específica para NDB e não é suportada pelo InnoDB, onde falha com um erro. `EXTENT_SIZE` define o tamanho, em bytes, dos extensões usados por quaisquer arquivos pertencentes ao espaço de tabelas. O valor padrão é de 1M. O tamanho mínimo é de 32K e o tamanho máximo teórico é de 2G, embora o tamanho máximo prático dependa de vários fatores. Na maioria dos casos, alterar o tamanho da extensão não tem nenhum efeito mensurável no desempenho, e o valor padrão é recomendado para todas as situações, exceto as mais incomuns.

Uma extensão é uma unidade de alocação de espaço em disco. Uma extensão é preenchida com tanto dados quanto essa extensão pode conter antes que outra extensão seja usada. Teoricamente, até 65.535 (64K) extensões podem ser usadas por arquivo de dados; no entanto, o tamanho máximo recomendado é de 32.768 (32K). O tamanho máximo recomendado para um único arquivo de dados é de 32G — ou seja, 32K extensões × 1 MB por extensão. Além disso, uma vez que uma extensão é alocada em uma partição específica, ela não pode ser usada para armazenar dados de uma partição diferente; uma extensão não pode armazenar dados de mais de uma partição. Isso significa, por exemplo, que um espaço de tabelas que tem um único arquivo de dados cujo `INITIAL_SIZE` (descrito no item a seguir) é de 256 MB e cujo `EXTENT_SIZE` é de 128M tem apenas duas extensões, e, portanto, pode ser usado para armazenar dados de no máximo duas partições diferentes da tabela de dados do disco.

Você pode ver quantos extensões permanecem livres em um arquivo de dados específico, consultando a tabela do esquema de informações `FILES`, e, assim, derivar uma estimativa de quanto espaço permanece livre no arquivo. Para mais discussão e exemplos, consulte a Seção 28.3.15, “A tabela de INFORMATION_SCHEMA FILES”.

* `INITIAL_SIZE`: Esta opção é específica para `NDB`, e não é suportada por `InnoDB`, onde ela falha com um erro.

O parâmetro `INITIAL_SIZE` define o tamanho total em bytes do arquivo de dados que foi especificado usando `ADD DATATFILE`. Uma vez que este arquivo tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados ao tablespace usando `ALTER TABLESPACE ... ADD DATAFILE`(alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement").

`INITIAL_SIZE` é opcional; seu valor padrão é 134217728 (128 MB).

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB).

* `AUTOEXTEND_SIZE`: Ignorado pelo MySQL antes do MySQL 8.0.23; a partir do MySQL 8.0.23, define a quantidade pela qual `InnoDB` estende o tamanho do tablespace quando ele se torna cheio. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o tablespace seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND_SIZE do tablespace”.

Não tem efeito em qualquer versão do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

* `MAX_SIZE`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

* `NODEGROUP`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

* `WAIT`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

* `COMMENT`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

* A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para um `InnoDB` espaço de tabela geral. O suporte à criptografia para espaços de tabela gerais foi introduzido no MySQL 8.0.13.

A partir do MySQL 8.0.16, se a cláusula `ENCRYPTION` não for especificada, o ajuste `default_table_encryption` controla se a criptografia está habilitada. A cláusula `ENCRYPTION` substitui o ajuste `default_table_encryption`. No entanto, se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para usar um ajuste da cláusula `ENCRYPTION` que difere do ajuste da cláusula `default_table_encryption`.

Um plugin de chave de acesso deve ser instalado e configurado antes que um espaço de tabela habilitado para criptografia possa ser criado.

Quando um espaço de tabela geral é criptografado, todas as tabelas que residem nesse espaço de tabela são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabela criptografado é criptografada.

Para mais informações, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”

* `ENGINE`: Define o motor de armazenamento que utiliza o tablespace, onde *`engine_name`* é o nome do motor de armazenamento. Atualmente, apenas o motor de armazenamento `InnoDB` é suportado pelas versões padrão do MySQL 8.0. O MySQL NDB Cluster suporta tanto os tablespace `NDB` quanto `InnoDB`. O valor da variável de sistema `default_storage_engine` é usado para `ENGINE` se a opção não for especificada.

* A opção `ENGINE_ATTRIBUTE` (disponível a partir do MySQL 8.0.21) é usada para especificar atributos do espaço de tabela para motores de armazenamento primário. A opção é reservada para uso futuro.

Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

Os valores de `ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Neste caso, o último valor especificado é utilizado.

Os valores de `ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

#### Notas

* Para as regras que cobrem o nome dos espaços de tabela do MySQL, consulte a Seção 11.2, “Nomes de Objetos do Esquema”. Além dessas regras, o caractere barra (“/”) não é permitido, e você também não pode usar nomes que comecem com `innodb_`, pois esse prefixo é reservado para uso do sistema.

* A criação de espaços de tabelas gerais temporários não é suportada.
* Os espaços de tabelas gerais não suportam tabelas temporárias.
* A opção `TABLESPACE` pode ser usada com `CREATE TABLE` ou `ALTER TABLE` para atribuir uma partição de tabela `InnoDB` ou subpartição a um espaço de tabelas por arquivo. Todas as partições devem pertencer ao mesmo mecanismo de armazenamento. Não é suportada a atribuição de partições de tabela a espaços de tabelas compartilhados `InnoDB`. Os espaços de tabelas compartilhados incluem o espaço de tabelas do sistema `InnoDB` e os espaços de tabelas gerais.

* As tabelas gerais suportam a adição de tabelas de qualquer formato de linha usando `CREATE TABLE ... TABLESPACE` (create-table.html "15.1.20 CREATE TABLE Statement"). `innodb_file_per_table` não precisa ser habilitado.

* `innodb_strict_mode` não é aplicável a espaços de tabela gerais. As regras de gerenciamento de espaços de tabela são rigorosamente aplicadas independentemente de `innodb_strict_mode`. Se os parâmetros de `CREATE TABLESPACE` estiverem incorretos ou incompatíveis, a operação falha, independentemente da configuração de `innodb_strict_mode`. Quando uma tabela é adicionada a um espaço de tabela geral usando [`CREATE TABLE ... TABLESPACE`(create-table.html "15.1.20 CREATE TABLE Statement") ou [`ALTER TABLE ... TABLESPACE`(alter-table.html "15.1.9 ALTER TABLE Statement"), `innodb_strict_mode` é ignorado, mas a declaração é avaliada como se `innodb_strict_mode` estivesse habilitado.

* Use `DROP TABLESPACE` para remover um espaço de tabelas. Todas as tabelas devem ser excluídas de um espaço de tabelas usando `DROP TABLE` antes de excluir o espaço de tabelas. Antes de excluir um espaço de tabelas NDB Cluster, também é necessário remover todos os seus arquivos de dados usando uma ou mais declarações [`ALTER TABLESPACE ... DROP DATATFILE`](alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement"). Veja a Seção 25.6.11.1, “Objetos de dados de disco do NDB Cluster”.

* Todas as partes de uma tabela `InnoDB` adicionadas a um espaço de tabela geral `InnoDB` residem no espaço de tabela geral, incluindo índices e páginas `BLOB`.

Para uma tabela `NDB` atribuída a um espaço de tabelas, apenas as colunas que não são indexadas são armazenadas em disco e, na verdade, utilizam os arquivos de dados do espaço de tabelas. Os índices e as colunas indexadas para todas as tabelas `NDB` são mantidos sempre na memória.

* Assim como as tabelas de espaço de sistema, a truncação ou eliminação de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados ibd do espaço de tabelas geral, que só pode ser usado para novos dados do `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

* Um espaço de tabela geral não está associado a nenhum banco de dados ou esquema.

* `ALTER TABLE ... DISCARD TABLESPACE` e (alter-table.html "15.1.9 ALTER TABLE Statement") e `ALTER TABLE ...IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um espaço de tabelas geral.

* O servidor utiliza bloqueio de metadados de nível de espaço de tabela para DDL que faz referência a espaços de tabela gerais. Em comparação, o servidor utiliza bloqueio de metadados de nível de tabela para DDL que faz referência a espaços de tabela por arquivo.

* Um espaço de tabela gerado ou existente não pode ser alterado para um espaço de tabela geral.

* Não há conflito entre os nomes de espaço de tabela geral e os nomes de espaço de tabela por arquivo. O caractere “/”, que está presente nos nomes de espaço de tabela por arquivo, não é permitido nos nomes de espaço de tabela geral.

* **mysqldump** e **mysqlpump** não fazem dump das declarações `InnoDB` `CREATE TABLESPACE`.

#### Exemplos de InnoDB

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de três tabelas não compactadas de diferentes formatos de linha.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela comprimida. O exemplo assume um valor padrão de `innodb_page_size` de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

Este exemplo demonstra a criação de um espaço de tabelas geral sem especificar a cláusula `ADD DATAFILE`, que é opcional a partir do MySQL 8.0.14.

```
mysql> CREATE TABLESPACE `ts3` ENGINE=INNODB;
```

Este exemplo demonstra a criação de um espaço de tabelas de desfazer.

```
mysql> CREATE UNDO TABLESPACE undo_003 ADD DATAFILE 'undo_003.ibu';
```

#### Exemplo de NDB

Suponha que você queira criar um espaço de dados de disco de NDB Cluster chamado `myts` usando um arquivo de dados chamado `mydata-1.dat`. Um espaço de dados `NDB` sempre requer o uso de um grupo de arquivos de log que consistem em um ou mais arquivos de log de desfazer. Para este exemplo, primeiro criamos um grupo de arquivos de log chamado `mylg` que contém um arquivo de longo de desfazer chamado `myundo-1.dat`, usando a declaração `CREATE LOGFILE GROUP` mostrada aqui:

```
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Agora, você pode criar o espaço de tabela descrito anteriormente usando a seguinte declaração:

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

Agora, você pode criar uma tabela de dados de disco usando uma declaração `CREATE TABLE` com as opções `TABLESPACE` e `STORAGE DISK`, semelhante ao que é mostrado aqui:

```
mysql> CREATE TABLE mytable (
    ->     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     lname VARCHAR(50) NOT NULL,
    ->     fname VARCHAR(50) NOT NULL,
    ->     dob DATE NOT NULL,
    ->     joined DATE NOT NULL,
    ->     INDEX(last_name, first_name)
    -> )
    ->     TABLESPACE myts STORAGE DISK
    ->     ENGINE=NDB;
Query OK, 0 rows affected (1.41 sec)
```

É importante notar que apenas as colunas `dob` e `joined` de `mytable` são armazenadas na verdade no disco, devido ao fato de que as colunas `id`, `lname` e `fname` estão todas indexadas.

Como mencionado anteriormente, quando o `CREATE TABLESPACE` é usado com o `ENGINE [=] NDB`, um espaço de tabela e um arquivo de dados associado são criados em cada nó de dados do NDB Cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles, fazendo uma consulta à tabela do Esquema de Informações `FILES`, conforme mostrado aqui:

```
mysql> SELECT FILE_NAME, FILE_TYPE, LOGFILE_GROUP_NAME, STATUS, EXTRA
    ->     FROM INFORMATION_SCHEMA.FILES
    ->     WHERE TABLESPACE_NAME = 'myts';

+--------------+------------+--------------------+--------+----------------+
| file_name    | file_type  | logfile_group_name | status | extra          |
+--------------+------------+--------------------+--------+----------------+
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=5 |
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=6 |
| NULL         | TABLESPACE | mylg               | NORMAL | NULL           |
+--------------+------------+--------------------+--------+----------------+
3 rows in set (0.01 sec)
```

Para informações adicionais e exemplos, consulte a Seção 25.6.11.1, “Objetos de dados de disco de cluster NDB”.

### 15.1.22 Declaração CREATE TRIGGER

```
CREATE
    [DEFINER = user]
    TRIGGER [IF NOT EXISTS] trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

trigger_time: { BEFORE | AFTER }

trigger_event: { INSERT | UPDATE | DELETE }

trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

Essa declaração cria um novo gatilho. Um gatilho é um objeto de banco de dados com nome que está associado a uma tabela e que é ativado quando um evento específico ocorre para a tabela. O gatilho se torna associado à tabela denominada *`tbl_name`*, que deve se referir a uma tabela permanente. Você não pode associar um gatilho a uma tabela `TEMPORARY` ou a uma visão.

Os nomes dos gatilhos existem no espaço de nome do esquema, o que significa que todos os gatilhos devem ter nomes únicos dentro de um esquema. Os gatilhos em diferentes esquemas podem ter o mesmo nome.

`IF NOT EXISTS` impede que um erro ocorra se um gatilho com o mesmo nome, na mesma tabela, existe no mesmo esquema. Esta opção é suportada com `CREATE TRIGGER` a partir do MySQL 8.0.29.

Esta seção descreve a sintaxe de `CREATE TRIGGER`](create-trigger.html "15.1.22 CREATE TRIGGER Statement"). Para uma discussão adicional, consulte a Seção 27.3.1, “Sintaxe e Exemplos de Trigêmeo”.

`CREATE TRIGGER` exige o privilégio `TRIGGER` para a tabela associada ao gatilho. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, `CREATE TRIGGER` pode exigir o privilégio `SUPER`, conforme discutido na Seção 27.7, “Registro Binário de Programas Armazenados”.

A cláusula `DEFINER` determina o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da ativação do gatilho, conforme descrito mais adiante nesta seção.

*`trigger_time`* é o tempo de ação do gatilho. Pode ser `BEFORE` ou `AFTER` para indicar que o gatilho é ativado antes ou depois de cada linha a ser modificada.

Os verificações básicas de valor de coluna ocorrem antes da ativação do gatilho, portanto, você não pode usar gatilhos `BEFORE` para converter valores inadequados para o tipo de coluna em valores válidos.

*`trigger_event`* indica o tipo de operação que ativa o gatilho. Esses valores *`trigger_event`* são permitidos:

* `INSERT`: O gatilho é ativado sempre que uma nova linha é inserida na tabela (por exemplo, através das declarações `INSERT`, `LOAD DATA` e `REPLACE`).

* `UPDATE`: O gatilho é ativado sempre que uma linha é modificada (por exemplo, através das instruções `UPDATE`).

* `DELETE`: O gatilho é ativado sempre que uma linha é excluída da tabela (por exemplo, através das instruções `DELETE` e `REPLACE`). As instruções `DROP TABLE` e `TRUNCATE TABLE` na tabela *não* ativam este gatilho, porque elas não utilizam `DELETE`. A eliminação de uma partição também não ativa os gatilhos `DELETE`.

O *`trigger_event` não representa um tipo literal de declaração SQL que ativa o gatilho tanto quanto representa um tipo de operação de tabela. Por exemplo, um gatilho `INSERT` não se ativa apenas para declarações `INSERT`, mas também para declarações `LOAD DATA`, porque ambas as declarações inserem linhas em uma tabela.

Um exemplo potencialmente confuso disso é a sintaxe do `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`: um gatilho `BEFORE INSERT` é ativado para cada linha, seguido por um gatilho `AFTER INSERT` ou ambos os gatilhos `BEFORE UPDATE` e `AFTER UPDATE`, dependendo se havia uma chave duplicada para a linha.

Nota

As ações de chave estrangeira em cascata não ativam gatilhos.

É possível definir múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e tempo de ação. Por exemplo, é possível ter dois `BEFORE UPDATE` gatilhos para uma tabela. Por padrão, os gatilhos que têm o mesmo evento de gatilho e tempo de ação são ativados na ordem em que foram criados. Para afetar a ordem do gatilho, especifique uma cláusula *`trigger_order`* que indique `FOLLOWS` ou `PRECEDES` e o nome de um gatilho existente que também tenha o mesmo evento de gatilho e tempo de ação. Com `FOLLOWS`, o novo gatilho é ativado após o gatilho existente. Com `PRECEDES`, o novo gatilho é ativado antes do gatilho existente.

*`trigger_body`* é a declaração a ser executada quando o gatilho é ativado. Para executar várias declarações, use a construção de declaração composta `BEGIN ... END`. Isso também permite que você use as mesmas declarações que são permitidas dentro de rotinas armazenadas. Veja a Seção 15.6.1, “BEGIN ... END Declaração Composta”. Algumas declarações não são permitidas em gatilhos; veja a Seção 27.8, “Restrições em Programas Armazenados”.

Dentro do corpo do gatilho, você pode se referir a colunas na tabela do assunto (a tabela associada ao gatilho) usando os aliases `OLD` e `NEW`. `OLD.col_name` refere-se a uma coluna de uma linha existente antes de ser atualizada ou excluída. `NEW.col_name` refere-se à coluna de uma nova linha a ser inserida ou a uma linha existente após ser atualizada.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para se referir a colunas geradas. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

O MySQL armazena a configuração da variável de sistema `sql_mode` em vigor quando um gatilho é criado e sempre executa o corpo do gatilho com essa configuração em vigor, * independentemente do modo SQL do servidor atual quando o gatilho começa a ser executado*.

A cláusula `DEFINER` especifica a conta do MySQL a ser usada ao verificar os privilégios de acesso no momento da ativação do gatilho. Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 27.6, “Controle de Acesso a Objeto Armazenado”. Veja também essa seção para obter informações adicionais sobre a segurança do gatilho.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração [`CREATE TRIGGER`](create-trigger.html "15.1.22 CREATE TRIGGER Statement"). Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

O MySQL leva em consideração o usuário `DEFINER` ao verificar os privilégios do gatilho da seguinte forma:

* No momento `CREATE TRIGGER`, o usuário que emite a declaração deve ter o privilégio `TRIGGER`.

* No momento da ativação do gatilho, os privilégios são verificados em relação ao usuário `DEFINER`. Esse usuário deve ter esses privilégios:

+ O privilégio `TRIGGER` para a tabela do sujeito.

+ O privilégio `SELECT` para a tabela do sujeito se as referências às colunas da tabela ocorrerem usando `OLD.col_name` ou `NEW.col_name` no corpo do gatilho.

+ O privilégio `UPDATE` para a tabela do sujeito, se as colunas da tabela forem alvos de atribuições `SET NEW.col_name = value` no corpo do gatilho.

+ Quaisquer outros privilégios que normalmente são necessários para as declarações executadas pelo gatilho.

Dentro de um corpo de gatilho, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da ativação do gatilho. Esse é o usuário `DEFINER`, não o usuário cujas ações causaram a ativação do gatilho. Para informações sobre auditoria de usuários dentro de gatilhos, consulte a Seção 8.2.23, “Auditorização de atividade de conta baseada em SQL”.

Se você usar `LOCK TABLES` para bloquear uma tabela que tenha gatilhos, as tabelas usadas dentro do gatilho também serão bloqueadas, conforme descrito em LOCK TABLES e Gatilhos.

Para uma discussão adicional sobre o uso de gatilho, consulte a Seção 27.3.1, “Sintaxe e Exemplos de Gatilho”.

### 15.1.23 Declaração de CREATE VIEW

```
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

A declaração `CREATE VIEW` cria uma nova visualização ou substitui uma visualização existente, se a cláusula `OR REPLACE` for fornecida. Se a visualização não existir, [`CREATE OR REPLACE VIEW`](create-view.html "15.1.23 CREATE VIEW Statement") é o mesmo que [`CREATE VIEW`](create-view.html "15.1.23 CREATE VIEW Statement"). Se a visualização existir, [`CREATE OR REPLACE VIEW`](create-view.html "15.1.23 CREATE VIEW Statement") a substitui.

Para informações sobre as restrições de uso de visualizações, consulte a Seção 27.9, “Restrições em visualizações”.

O *`select_statement` é uma declaração `SELECT` que fornece a definição da visão. (Selecionar a partir da visão seleciona, na verdade, usando a declaração `SELECT`. O *`select_statement` pode selecionar de tabelas de base ou de outras visões. A partir do MySQL 8.0.19, a declaração `SELECT` pode usar uma declaração `VALUES` como sua fonte, ou pode ser substituída por uma declaração `TABLE`, como com [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement").

A definição de visão é "congelada" no momento da criação e não é afetada por alterações subsequentes nas definições das tabelas subjacentes. Por exemplo, se uma visão é definida como `SELECT *` em uma tabela, novas colunas adicionadas à tabela posteriormente não se tornam parte da visão, e as colunas excluídas da tabela resultam em um erro ao selecionar a partir da visão.

A cláusula `ALGORITHM` afeta a forma como o MySQL processa a visão. As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da invocação da visão. A cláusula `WITH CHECK OPTION` pode ser usada para restringir inserções ou atualizações em linhas de tabelas referenciadas pela visão. Essas cláusulas são descritas mais adiante nesta seção.

A declaração `CREATE VIEW` exige o privilégio `CREATE VIEW` para a visão, e alguns privilégios para cada coluna selecionada pela declaração `SELECT`. Para as colunas usadas em outros lugares na declaração `SELECT`, você deve ter o privilégio `SELECT`. Se a cláusula `OR REPLACE` estiver presente, você também deve ter o privilégio `DROP` para a visão. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 27.6, “Controle de Acesso a Objeto Armazenado”.

Quando uma visão é referenciada, o controle de privilégios ocorre conforme descrito mais adiante nesta seção.

Uma visão pertence a um banco de dados. Por padrão, uma nova visão é criada no banco de dados padrão. Para criar a visão explicitamente em um determinado banco de dados, use a sintaxe *`db_name.view_name`* para qualificar o nome da visão com o nome do banco de dados:

```
CREATE VIEW test.v AS SELECT * FROM t;
```

Os nomes de tabela ou de visão não qualificados na declaração `SELECT` também são interpretados em relação ao banco de dados padrão. Uma visão pode se referir a tabelas ou visões em outros bancos de dados, qualificando o nome da tabela ou da visão com o nome do banco de dados apropriado.

Dentro de um banco de dados, as tabelas de base e os pontos de vista compartilham o mesmo espaço de nome, portanto, uma tabela de base e um ponto de vista não podem ter o mesmo nome.

As colunas recuperadas pela declaração `SELECT` podem ser referências simples para colunas de tabela, ou expressões que utilizam funções, valores constantes, operadores, etc.

Uma visão deve ter nomes de coluna únicos, sem duplicatas, assim como uma tabela base. Por padrão, os nomes das colunas recuperados pela declaração `SELECT` são usados para os nomes das colunas da visão. Para definir nomes explícitos para as colunas da visão, especifique a cláusula opcional *`column_list`* como uma lista de identificadores separados por vírgula. O número de nomes em *`column_list`* deve ser o mesmo número de colunas recuperadas pela declaração `SELECT`.

Uma visão pode ser criada a partir de muitos tipos de declarações `SELECT`. Ela pode se referir a tabelas base ou outras visões. Ela pode usar junções, `UNION` e subconsultas. A `SELECT` não precisa nem mesmo se referir a nenhuma tabela:

```
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

O exemplo a seguir define uma visão que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

```
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
+------+-------+-------+
```

Uma definição de visualização está sujeita às seguintes restrições:

* A declaração `SELECT` não pode se referir a variáveis de sistema ou variáveis definidas pelo usuário.

* Dentro de um programa armazenado, a declaração `SELECT` não pode se referir a parâmetros de programa ou variáveis locais.

* A declaração `SELECT` não pode se referir a parâmetros de declaração preparados.

* Qualquer tabela ou visão referida na definição deve existir. Se, após a criação da visão, uma tabela ou visão a que a definição se refere for excluída, o uso da visão resulta em um erro. Para verificar uma definição de visão em relação a problemas desse tipo, use a declaração `CHECK TABLE`.

* A definição não pode se referir a uma tabela `TEMPORARY`, e você não pode criar uma visão `TEMPORARY`.

* Você não pode associar um gatilho a uma visão. * Alias para os nomes de colunas na declaração `SELECT` são verificados contra o comprimento máximo da coluna de 64 caracteres (não o comprimento máximo do alias de 256 caracteres).

`ORDER BY` é permitido em uma definição de visualização, mas é ignorado se você selecionar de uma visualização usando uma declaração que tem sua própria `ORDER BY`.

Para outras opções ou cláusulas na definição, elas são adicionadas às opções ou cláusulas da declaração que faz referência à visão, mas o efeito é indefinido. Por exemplo, se uma definição de visão inclui uma cláusula `LIMIT`, e você seleciona a partir da visão usando uma declaração que tem sua própria cláusula `LIMIT`, é indefinido qual limite se aplica. Esse mesmo princípio se aplica a opções como `ALL`, `DISTINCT` ou `SQL_SMALL_RESULT` que seguem a palavra-chave `SELECT`, e a cláusulas como `INTO`, `FOR UPDATE`, `FOR SHARE`, `LOCK IN SHARE MODE` e `PROCEDURE`.

Os resultados obtidos a partir de uma visão podem ser afetados se você alterar o ambiente de processamento de consulta ao alterar as variáveis do sistema:

```
mysql> CREATE VIEW v (mycol) AS SELECT 'abc';
Query OK, 0 rows affected (0.01 sec)

mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| mycol |
+-------+
1 row in set (0.01 sec)

mysql> SET sql_mode = 'ANSI_QUOTES';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| abc   |
+-------+
1 row in set (0.00 sec)
```

As cláusulas `DEFINER` e `SQL SECURITY` determinam qual conta do MySQL usar ao verificar os privilégios de acesso para a visão quando uma declaração é executada que faz referência à visão. Os valores característicos válidos `SQL SECURITY` são `DEFINER` (o padrão) e `INVOKER`. Esses indicam que os privilégios necessários devem ser mantidos pelo usuário que definiu ou invocou a visão, respectivamente.

Se a cláusula `DEFINER` estiver presente, o valor do *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores permitidos do *`user`* dependem dos privilégios que você possui, conforme discutido na Seção 27.6, “Controle de acesso a objetos armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança da visualização.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração [`CREATE VIEW`(create-view.html "15.1.23 CREATE VIEW Statement")]. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro de uma definição de visão, a função `CURRENT_USER` retorna o valor `DEFINER` da visão por padrão. Para visões definidas com a característica `SQL SECURITY INVOKER`, `CURRENT_USER` retorna a conta do invocador da visão. Para informações sobre auditoria de usuários dentro de visões, consulte a Seção 8.2.23, “Auditorização de atividade de conta baseada em SQL”.

Dentro de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, `CURRENT_USER` retorna o valor da rotina `DEFINER`. Isso também afeta uma visualização definida dentro de tal rotina, se a definição da visualização contiver um valor `DEFINER` de `CURRENT_USER`.

O MySQL verifica os privilégios de visualização da seguinte forma:

* No momento da definição da visão, o criador da visão deve ter os privilégios necessários para usar os objetos de nível superior acessados pela visão. Por exemplo, se a definição da visão se refere a colunas de tabela, o criador deve ter algum privilégio para cada coluna na lista de seleção da definição, e o privilégio `SELECT` para cada coluna usada em outro lugar na definição. Se a definição se refere a uma função armazenada, apenas os privilégios necessários para invocar a função podem ser verificados. Os privilégios necessários no momento da invocação da função podem ser verificados apenas conforme ela é executada: para diferentes invocações, podem ser tomadas diferentes caminhos de execução dentro da função.

* O usuário que faz referência a uma visão deve ter privilégios apropriados para acessá-la (`SELECT` para selecioná-la, `INSERT` para inseri-la, e assim por diante.)

* Quando uma visão foi referenciada, os privilégios dos objetos acessados pela visão são verificados em relação aos privilégios da conta ou invocante da conta `DEFINER`, dependendo se a característica `SQL SECURITY` é `DEFINER` ou `INVOKER`, respectivamente.

* Se a referência a uma visão causar a execução de uma função armazenada, a verificação de privilégios para declarações executadas dentro da função depende se a característica `SQL SECURITY` da função é `DEFINER` ou `INVOKER`. Se a característica de segurança for `DEFINER`, a função é executada com os privilégios da conta `DEFINER`. Se a característica for `INVOKER`, a função é executada com os privilégios determinados pela característica `SQL SECURITY` da visão.

Exemplo: Uma visão pode depender de uma função armazenada, e essa função pode invocar outras rotinas armazenadas. Por exemplo, a seguinte visão invoca uma função armazenada `f()`:

```
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suponha que `f()` contenha uma declaração como esta:

```
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

Os privilégios necessários para executar declarações dentro de `f()` precisam ser verificados quando `f()` é executado. Isso pode significar que privilégios são necessários para `p1()` ou `p2()`, dependendo do caminho de execução dentro de `f()`. Esses privilégios devem ser verificados em tempo de execução, e o usuário que deve possuir os privilégios é determinado pelos valores de `SQL SECURITY` da vista `v` e da função `f()`.

As cláusulas `DEFINER` e `SQL SECURITY` para vistas são extensões do SQL padrão. No SQL padrão, as vistas são manipuladas usando as regras para `SQL SECURITY DEFINER`. O padrão diz que o definidor da vista, que é o mesmo que o proprietário do esquema da vista, obtém privilégios aplicáveis à vista (por exemplo, `SELECT`) e pode concedê-los. O MySQL não tem conceito de "proprietário" de um esquema, então o MySQL adiciona uma cláusula para identificar o definidor. A cláusula `DEFINER` é uma extensão onde a intenção é ter o que o padrão tem; ou seja, um registro permanente de quem definiu a vista. É por isso que o valor padrão `DEFINER` é a conta do criador da vista.

A cláusula opcional `ALGORITHM` é uma extensão do MySQL ao SQL padrão. Ela afeta a forma como o MySQL processa a visão. `ALGORITHM` assume três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`. Para mais informações, consulte a Seção 27.5.2, “Algoritmos de Processamento de Visões”, bem como [Seção 10.2.2.4, “Otimizando Tabelas Derivadas, Referências de Visão e Expressões de Tabela Comuns com Fusão ou Materialização”](derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization").

Alguns pontos de vista são atualizáveis. Isso significa que você pode usá-los em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Para que um ponto de vista seja atualizável, deve haver uma relação um-para-um entre as linhas do ponto de vista e as linhas da tabela subjacente. Existem também certos outros construtos que tornam um ponto de vista não atualizável.

Uma coluna gerada em uma visualização é considerada atualizável, pois é possível atribuí-la. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

A cláusula `WITH CHECK OPTION` pode ser aplicada a uma visão atualizável para impedir inserções ou atualizações em linhas, exceto aquelas para as quais a cláusula `WHERE` no *`select_statement`* é verdadeira.

Em uma cláusula `WITH CHECK OPTION` para uma visão atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo dos testes de verificação quando a visão é definida em termos de outra visão. A palavra-chave `LOCAL` restringe o `CHECK OPTION` apenas à visão que está sendo definida. `CASCADED` faz com que os controles para visões subjacentes sejam avaliados também. Quando nenhuma das palavras-chave é dada, o padrão é `CASCADED`.

Para mais informações sobre vistas atualizáveis e a cláusula `WITH CHECK OPTION`, consulte a Seção 27.5.3, “Vistas atualizáveis e inseríveis”, e a Seção 27.5.4, “Cláusula VIEW com opção CHECK”.

### 15.1.24 Declaração DROP DATABASE

```
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

`DROP DATABASE` elimina todas as tabelas do banco de dados e exclui o banco de dados. Tenha *muito cuidado* com essa declaração! Para usar `DROP DATABASE`, você precisa do privilégio `DROP` no banco de dados. [`DROP SCHEMA`(drop-database.html "15.1.24 DROP DATABASE Statement") é sinônimo de [`DROP DATABASE`(drop-database.html "15.1.24 DROP DATABASE Statement")].

Importante

Quando um banco de dados é excluído, os privilégios concedidos especificamente para o banco de dados não são excluídos automaticamente. Eles devem ser excluídos manualmente. Veja a Seção 15.7.1.6, “Declaração GRANT”.

`IF EXISTS` é usado para evitar que um erro ocorra se o banco de dados não existir.

Se o banco de dados padrão for excluído, o banco de dados padrão será desativado (a função `DATABASE()` retorna `NULL`).

Se você usar `DROP DATABASE` em um banco de dados vinculado de forma simbólica, tanto o link quanto o banco de dados original serão excluídos.

`DROP DATABASE` retorna o número de tabelas que foram removidas.

A declaração `DROP DATABASE` remove do diretório do banco de dados dado aqueles arquivos e diretórios que o próprio MySQL pode criar durante o funcionamento normal. Isso inclui todos os arquivos com as extensões mostradas na lista a seguir:

* `.BAK`
* `.DAT`
* `.HSH`
* `.MRG`
* `.MYD`
* `.MYI`
* `.cfg`
* `.db`
* `.ibd`
* `.ndb`

Se outros arquivos ou diretórios permanecerem no diretório do banco de dados após o MySQL remover os que foram listados, o diretório do banco de dados não pode ser removido. Nesse caso, você deve remover manualmente quaisquer arquivos ou diretórios restantes e emitir a declaração `DROP DATABASE` novamente.

A eliminação de um banco de dados não remove quaisquer `TEMPORARY` que foram criados nesse banco de dados. As tabelas `TEMPORARY` são removidas automaticamente quando a sessão que as criou termina. Veja a Seção 15.1.20.2, “Instrução CREATE TEMPORARY TABLE”.

Você também pode excluir bancos de dados com o **mysqladmin**. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

### 15.1.25 Declaração de Evento de RETIREAMENTO

```
DROP EVENT [IF EXISTS] event_name
```

Essa declaração exclui o evento denominado *`event_name`*. O evento imediatamente deixa de ser ativo e é completamente excluído do servidor.

Se o evento não existir, o erro ERROR 1517 (HY000) resulta. Você pode ignorar isso e fazer com que a declaração gere um aviso para eventos inexistentes, em vez disso, usando `IF EXISTS`.

Essa declaração exige o privilégio `EVENT` para o esquema ao qual o evento a ser excluído pertence.

### 15.1.26 Declaração da função DROP

A declaração `DROP FUNCTION` é usada para descartar funções armazenadas e funções carregáveis:

* Para informações sobre a eliminação de funções armazenadas, consulte a Seção 15.1.29, “Instruções DROP PROCEDURE e DROP FUNCTION”.

* Para informações sobre a eliminação de funções carregáveis, consulte a Seção 15.7.4.2, “Instrução DROP FUNCTION para Funções Carregáveis”.

### 15.1.27 Declaração DROP INDEX

```
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

`DROP INDEX` elimina o índice denominado *`index_name`* da tabela *`tbl_name`. Esta declaração é mapeada para uma declaração `ALTER TABLE` para eliminar o índice. Veja a Seção 15.1.9, “Declaração ALTER TABLE”.

Para descartar uma chave primária, o nome do índice é sempre `PRIMARY`, que deve ser especificado como um identificador citado porque `PRIMARY` é uma palavra reservada:

```
DROP INDEX `PRIMARY` ON t;
```

Os índices em colunas de largura variável das tabelas de `NDB` são removidos online, ou seja, sem qualquer cópia de tabela. A tabela não é bloqueada contra acesso de outros nós da API do NDB Cluster, embora seja bloqueada contra outras operações no *mesmo* nó da API durante a duração da operação. Isso é feito automaticamente pelo servidor sempre que ele determinar que é possível fazê-lo; você não precisa usar qualquer sintaxe SQL especial ou opções do servidor para fazer isso acontecer.

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que a declaração `ALTER TABLE`. Para mais informações, consulte a Seção 15.1.9, “Declaração ALTER TABLE”

O MySQL NDB Cluster suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` que é suportada no servidor MySQL padrão. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

### 15.1.28 Declaração DROP LOGFILE GROUP

```
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

Essa declaração exclui o grupo de arquivos de registro denominado *`logfile_group`*. O grupo de arquivos de registro deve já existir ou ocorrerá um erro. (Para informações sobre a criação de grupos de arquivos de registro, consulte a Seção 15.1.16, “Declaração CREATE LOGFILE GROUP”.)

Importante

Antes de descartar um grupo de arquivos de registro, você deve descartar todos os espaços de tabela que utilizam esse grupo de arquivos de registro para o registro `UNDO`.

A cláusula `ENGINE` necessária fornece o nome do motor de armazenamento usado pelo grupo de arquivos de registro a ser excluído. Atualmente, os únicos valores permitidos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

`DROP LOGFILE GROUP` é útil apenas com armazenamento de dados de disco para NDB Cluster. Veja a Seção 25.6.11, “Tabelas de dados de disco do NDB Cluster”.

### 15.1.29 Declarações de DROP PROCEDURE e DROP FUNCTION

```
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para descartar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada é removida do servidor. (`DROP FUNCTION` também é usado para descartar funções carregáveis; veja Seção 15.7.4.2, “Declaração DROP FUNCTION para Funções Carregáveis”.)

Para descartar uma rotina armazenada, você deve ter o privilégio `ALTER ROUTINE` para isso. (Se a variável de sistema `automatic_sp_privileges` estiver habilitada, esse privilégio e `EXECUTE` são concedidos automaticamente ao criador da rotina quando a rotina é criada e descartada pelo criador quando a rotina é descartada. Veja a Seção 27.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.)

Além disso, se o definidor da rotina tiver o privilégio `SYSTEM_USER`, o usuário que a exclua também deve ter esse privilégio. Isso é exigido no MySQL 8.0.16 e versões posteriores.

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela previne que um erro ocorra se o procedimento ou a função não existir. Um aviso é produzido que pode ser visualizado com `SHOW WARNINGS`.

`DROP FUNCTION` também é usado para descartar funções carregáveis (consulte a Seção 15.7.4.2, “Declaração DROP FUNCTION para Funções Carregáveis”).

### 15.1.30 Declaração DROP SERVER

```
DROP SERVER [ IF EXISTS ] server_name
```

Descarta a definição do servidor para o servidor denominado `server_name`. A linha correspondente na tabela `mysql.servers` é excluída. Esta declaração requer o privilégio `SUPER`.

A eliminação de um servidor para uma tabela não afeta quaisquer tabelas `FEDERATED` que utilizaram essas informações de conexão quando foram criadas. Veja a Seção 15.1.18, “Declaração CREATE SERVER”.

`DROP SERVER` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

`DROP SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo utilizado.

### 15.1.31 SISTEMA DE REFERÊNCIA ESPACIAL DROP Declaração

```
DROP SPATIAL REFERENCE SYSTEM
    [IF EXISTS]
    srid

srid: 32-bit unsigned integer
```

Essa declaração remove uma definição de [sistema de referência espacial][(spatial-reference-systems.html "13.4.5 Spatial Reference System Support")](SRS) do dicionário de dados. Ela exige o privilégio `SUPER`.

Exemplo:

```
DROP SPATIAL REFERENCE SYSTEM 4120;
```

Se não existir uma definição de SRS com o valor SRID, ocorrerá um erro, a menos que `IF EXISTS` seja especificado. Nesse caso, ocorrerá um aviso em vez de um erro.

Se o valor SRID for usado por alguma coluna em uma tabela existente, ocorrerá um erro. Por exemplo:

```
mysql> DROP SPATIAL REFERENCE SYSTEM 4326;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

Para identificar qual coluna ou colunas utilizam o SRID, use esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

Os valores de SRID devem estar na faixa de inteiros sem sinal de 32 bits, com essas restrições:

* SRID 0 é um SRID válido, mas não pode ser usado com `DROP SPATIAL REFERENCE SYSTEM`.

* Se o valor estiver em um intervalo de SRID reservado, uma mensagem de alerta é exibida. Os intervalos reservados são [0, 32767] (reservado pelo EPSG), [60.000.000, 69.999.999] (reservado pelo EPSG) e [2.000.000.000, 2.147.483.647] (reservado pelo MySQL). EPSG significa [European Petroleum Survey Group][(http://epsg.org)].

* Os usuários não devem excluir SRSs com SRIDs nas faixas reservadas. Se SRSs instalados pelo sistema forem excluídos, as definições do SRS podem ser recriadas para atualizações do MySQL.

### 15.1.32 Declaração DROP TABLE

```
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

`DROP TABLE` remove uma ou mais tabelas. Você deve ter o privilégio `DROP` para cada tabela.

*Cuidado* com essa declaração! Para cada tabela, ela remove a definição da tabela e todos os dados da tabela. Se a tabela estiver particionada, a declaração remove a definição da tabela, todas as suas partições, todos os dados armazenados nessas partições e todas as definições de partição associadas à tabela eliminada.

Ao descartar uma tabela, você também descartará quaisquer gatilhos para a tabela.

`DROP TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

Importante

Quando uma tabela é eliminada, os privilégios concedidos especificamente para a tabela não são eliminados automaticamente. Eles devem ser eliminados manualmente. Veja a Seção 15.7.1.6, “Declaração GRANT”.

Se quaisquer tabelas mencionadas na lista de argumentos não existirem, o comportamento do `DROP TABLE` depende de se a cláusula `IF EXISTS` é dada:

* Sem `IF EXISTS`, a declaração falha com um erro indicando quais tabelas não existentes não conseguiu descartar, e não são feitas alterações.

* Com `IF EXISTS`, não ocorre erro para tabelas não existentes. A declaração elimina todas as tabelas nomeadas que existem e gera um diagnóstico `NOTE` para cada tabela inexistente. Essas notas podem ser exibidas com `SHOW WARNINGS`. Veja a Seção 15.7.7.42, “Declaração SHOW WARNINGS”.

`IF EXISTS` também pode ser útil para descartar tabelas em circunstâncias incomuns, em que há uma entrada no dicionário de dados, mas nenhuma tabela gerenciada pelo motor de armazenamento. (Por exemplo, se uma saída anormal do servidor ocorrer após a remoção da tabela do motor de armazenamento, mas antes da remoção da entrada do dicionário de dados.)

A palavra-chave `TEMPORARY` tem os seguintes efeitos:

* A declaração exclui apenas as tabelas `TEMPORARY`.
* A declaração não causa um compromisso implícito.
* Não são verificados direitos de acesso. Uma tabela `TEMPORARY` é visível apenas com a sessão que a criou, portanto, não é necessária nenhuma verificação.

Incluir a palavra-chave `TEMPORARY` é uma boa maneira de evitar a queda acidental de tabelas que não são `TEMPORARY`.

As palavras-chave `RESTRICT` e `CASCADE` não fazem nada. Elas são permitidas para facilitar a portar de outros sistemas de banco de dados.

`DROP TABLE` não é suportado com todas as configurações de `innodb_force_recovery`. Veja a Seção 17.21.3, “Forçando a recuperação do InnoDB”.

### 15.1.33 Declaração DROP TABLESPACE

```
DROP [UNDO] TABLESPACE tablespace_name
    [ENGINE [=] engine_name]
```

Essa declaração exclui um tablespace que foi criado anteriormente usando `CREATE TABLESPACE`. É suportada pelos motores de armazenamento `NDB` e `InnoDB`.

A palavra-chave `UNDO`, introduzida no MySQL 8.0.14, deve ser especificada para descartar um espaço de desfazer. Somente os espaços de desfazer criados usando a sintaxe (create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") podem ser descartados. Um espaço de desfazer deve estar em um estado `empty` antes de poder ser descartado. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Desfazer”.

`ENGINE` define o motor de armazenamento que utiliza o tablespace, onde *`engine_name`* é o nome do motor de armazenamento. Atualmente, os valores `InnoDB` e `NDB` são suportados. Se não for definido, o valor de `default_storage_engine` é usado. Se não for o mesmo que o motor de armazenamento usado para criar o tablespace, a declaração `DROP TABLESPACE` falha.

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

Para um espaço de tabela geral `InnoDB`, todas as tabelas devem ser excluídas do espaço de tabela antes de uma operação `DROP TABLESPACE`. Se o espaço de tabela não estiver vazio, `DROP TABLESPACE` retorna um erro.

Um espaço de tabelas `NDB` que deve ser excluído não pode conter quaisquer arquivos de dados; em outras palavras, antes de poder excluir um espaço de tabelas `NDB`, você deve primeiro excluir cada um de seus arquivos de dados usando `ALTER TABLESPACE ... DROP DATAFILE`(alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement").

#### Notas

* Um espaço de `InnoDB` geral não é excluído automaticamente quando a última tabela do espaço de tabelas é excluída. O espaço de tabelas deve ser excluído explicitamente usando `DROP TABLESPACE tablespace_name`.

* Uma operação `DROP DATABASE` pode descartar tabelas que pertencem a um espaço de tabelas geral, mas não pode descartar o espaço de tabelas, mesmo que a operação descarte todas as tabelas que pertencem ao espaço de tabelas. O espaço de tabelas deve ser descartado explicitamente usando `DROP TABLESPACE tablespace_name`.

* Assim como as tabelas de espaço de sistema, a truncação ou eliminação de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados ibd do espaço de tabelas geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

#### Exemplos de InnoDB

Este exemplo demonstra como descartar um espaço de tabela geral `InnoDB`. O espaço de tabela geral `ts1` é criado com uma única tabela. Antes de descartar o espaço de tabela, a tabela deve ser descartada.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Este exemplo demonstra a eliminação de um espaço de desfazer. Um espaço de desfazer deve estar em um estado `empty` antes de poder ser eliminado. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de desfazer”.

```
mysql> DROP UNDO TABLESPACE undo_003;
```

#### Exemplo de NDB

Este exemplo mostra como descartar um espaço de tabela `NDB` `myts`, com um arquivo de dados denominado `mydata-1.dat`, após criar primeiro o espaço de tabela, e assume a existência de um grupo de arquivos de registro denominado `mylg` (consulte Seção 15.1.16, “Instrução CREATE LOGFILE GROUP”).

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

Você deve remover todos os arquivos de dados dos espaços de tabela usando `ALTER TABLESPACE`, conforme mostrado aqui, antes que ele possa ser descartado:

```
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat'
    ->     ENGINE=NDB;

mysql> DROP TABLESPACE myts;
```

### 15.1.34 Declaração de DROP TRIGGER

```
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

Essa declaração elimina um gatilho. O nome do esquema (banco de dados) é opcional. Se o esquema for omitido, o gatilho será eliminado do esquema padrão. `DROP TRIGGER` requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

Use `IF EXISTS` para evitar que um erro ocorra para um gatilho que não existe. Um `NOTE` é gerado para um gatilho inexistente quando se usa `IF EXISTS`. Veja a Seção 15.7.7.42, “Declaração SHOW WARNINGS”.

Os gatilhos de uma tabela também são eliminados se você eliminar a tabela.

### 15.1.35 Declaração de DROP VIEW

```
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

`DROP VIEW` remove uma ou mais visualizações. Você deve ter o privilégio `DROP` para cada visualização.

Se quaisquer vistas nomeadas na lista de argumentos não existirem, a declaração falha com um erro indicando, pelo nome, quais vistas não existentes não conseguiu descartar, e não são feitas alterações.

Nota

Em MySQL 5.7 e versões anteriores, `DROP VIEW` retorna um erro se quaisquer vistas nomeadas na lista de argumentos não existirem, mas também elimina todas as vistas na lista que existem. Devido à mudança de comportamento no MySQL 8.0, uma operação parcialmente concluída `DROP VIEW` em um servidor de origem de replicação MySQL 5.7 falha quando replicada em uma réplica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` nas instruções `DROP VIEW` para evitar que um erro ocorra para vistas que não existem. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

A cláusula `IF EXISTS` previne que um erro ocorra em visualizações que não existem. Quando essa cláusula é fornecida, um `NOTE` é gerado para cada visualização inexistente. Veja a Seção 15.7.7.42, “Declaração SHOW WARNINGS”.

`RESTRICT` e `CASCADE`, se forem fornecidos, são analisados e ignorados.

### 15.1.36 Declaração de RENOMEAR Tabela

```
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

`RENAME TABLE` renomeia uma ou mais tabelas. Você deve ter os privilégios `ALTER` e `DROP` para a tabela original e os privilégios `CREATE` e `INSERT` para a nova tabela.

Por exemplo, para renomear uma tabela chamada `old_table` para `new_table`, use esta declaração:

```
RENAME TABLE old_table TO new_table;
```

Essa declaração é equivalente à seguinte declaração `ALTER TABLE`:

```
ALTER TABLE old_table RENAME new_table;
```

`RENAME TABLE`, ao contrário de [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"), pode renomear várias tabelas em uma única declaração:

```
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

As operações de renomeação são realizadas de esquerda para direita. Assim, para trocar dois nomes de tabela, faça isso (assumindo que uma tabela com o nome intermediário `tmp_table` não exista já):

```
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

As chaves de metadados em tabelas são adquiridas em ordem de nome, o que, em alguns casos, pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente. Veja a Seção 10.11.4, “Bloqueio de Metadados”.

A partir do MySQL 8.0.13, você pode renomear tabelas bloqueadas com uma declaração `LOCK TABLES`, desde que elas estejam bloqueadas com um bloqueio `WRITE` ou sejam o produto da renomeação de tabelas bloqueadas por `WRITE` de etapas anteriores em uma operação de renomeação de múltiplas tabelas. Por exemplo, isso é permitido:

```
LOCK TABLE old_table1 WRITE;
RENAME TABLE old_table1 TO new_table1,
             new_table1 TO new_table2;
```

Isso não é permitido:

```
LOCK TABLE old_table1 READ;
RENAME TABLE old_table1 TO new_table1,
             new_table1 TO new_table2;
```

Antes do MySQL 8.0.13, para executar `RENAME TABLE`, não deve haver tabelas bloqueadas com `LOCK TABLES`.

Com as condições de bloqueio da tabela de transação satisfeitas, a operação de renomeação é realizada de forma atômica; nenhuma outra sessão pode acessar nenhuma das tabelas enquanto o renomeamento estiver em andamento.

Se houver algum erro durante um `RENAME TABLE`, a declaração falha e não são feitas alterações.

Você pode usar `RENAME TABLE` para mover uma tabela de um banco de dados para outro:

```
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Usar esse método para mover todas as tabelas de um banco de dados para outro, na verdade, renomeia o banco de dados (uma operação para a qual o MySQL não tem uma única declaração), exceto que o banco de dados original continua a existir, embora sem tabelas.

Assim como `RENAME TABLE`, `ALTER TABLE ... RENAME` também pode ser usado para mover uma tabela para um banco de dados diferente. Independentemente da declaração usada, se a operação de renomeamento mover a tabela para um banco de dados localizado em um sistema de arquivos diferente, o sucesso do resultado é específico da plataforma e depende das chamadas de sistema operacional subjacentes usadas para mover arquivos de tabela.

Se uma tabela tiver gatilhos, as tentativas de renomear a tabela para um banco de dados diferente falham com um erro de Trigger no esquema errado (`ER_TRG_IN_WRONG_SCHEMA`).

Uma tabela não criptografada pode ser movida para um banco de dados com criptografia habilitada e vice-versa. No entanto, se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário se o ajuste de criptografia da tabela for diferente da criptografia padrão do banco de dados.

Para renomear as tabelas de `TEMPORARY`, o `RENAME TABLE` não funciona. Use `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") em vez disso.

`RENAME TABLE` funciona para visualizações, exceto que as visualizações não podem ser renomeadas em um banco de dados diferente.

Quaisquer privilégios concedidos especificamente para uma tabela ou visão renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

`RENAME TABLE tbl_name TO new_tbl_name` altera os nomes internos de restrições de chave estrangeira e os nomes de restrições de chave estrangeira definidos pelo usuário que começam com a string “*`tbl_name`*_ibfk_” para refletir o novo nome da tabela. `InnoDB` interpreta os nomes de restrições de chave estrangeira que começam com a string “*`tbl_name`*_ibfk_” como nomes gerados internamente.

Os nomes das restrições de chave estrangeira que apontam para a tabela renomeada são atualizados automaticamente, a menos que haja um conflito, caso em que a declaração falha com um erro. Um conflito ocorre se o nome da restrição renomeada já existir. Nesses casos, você deve descartar e recriar as chaves estrangeiras para que elas funcionem corretamente.

`RENAME TABLE tbl_name TO new_tbl_name` muda os nomes de restrição internamente gerados e definidos pelo usuário `CHECK` que começam com a string “*`tbl_name`*_chk_” para refletir o novo nome da tabela. O MySQL interpreta os nomes de restrição `CHECK` que começam com a string “*`tbl_name`*_chk_” como nomes gerados internamente. Exemplo:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i1` int(11) DEFAULT NULL,
  `i2` int(11) DEFAULT NULL,
  CONSTRAINT `t1_chk_1` CHECK ((`i1` > 0)),
  CONSTRAINT `t1_chk_2` CHECK ((`i2` < 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.02 sec)

mysql> RENAME TABLE t1 TO t3;
Query OK, 0 rows affected (0.03 sec)

mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `i1` int(11) DEFAULT NULL,
  `i2` int(11) DEFAULT NULL,
  CONSTRAINT `t3_chk_1` CHECK ((`i1` > 0)),
  CONSTRAINT `t3_chk_2` CHECK ((`i2` < 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

### 15.1.37 Declaração `TRUNCATE TABLE`

```
TRUNCATE [TABLE] tbl_name
```

`TRUNCATE TABLE` esvazia uma tabela completamente. Requer o privilégio `DROP`. Lógico, `TRUNCATE TABLE`(truncate-table.html "15.1.37 TRUNCATE TABLE Statement") é semelhante a uma declaração `DELETE` que exclui todas as linhas, ou uma sequência de declarações `DROP TABLE` e `CREATE TABLE`.

Para alcançar alto desempenho, `TRUNCATE TABLE` evita o método DML de exclusão de dados. Assim, ele não causa `ON DELETE` para disparar gatilhos, não pode ser realizado para tabelas de `InnoDB` com relações de chave estrangeira pai-filho, e não pode ser desfeito como uma operação DML. No entanto, as operações de `TRUNCATE TABLE` em tabelas que utilizam um mecanismo de armazenamento que suporta DDL atômico são totalmente comprometidas ou desfeitas se o servidor interromper durante sua operação. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

Embora `TRUNCATE TABLE` seja semelhante a `DELETE`, é classificado como uma declaração DDL em vez de uma declaração DML. Difere de `DELETE` nas seguintes maneiras:

* Operações de truncar e recriar a tabela são muito mais rápidas do que a exclusão de linhas uma a uma, especialmente para tabelas grandes.

As operações de truncação causam um compromisso implícito e, portanto, não podem ser revertidas. Veja a Seção 15.3.3, “Declarações que causam um compromisso implícito”.

* As operações de truncação não podem ser realizadas se a sessão tiver um bloqueio de tabela ativo.

* `TRUNCATE TABLE` falha para uma tabela `InnoDB` ou tabela `NDB` se houver quaisquer restrições `FOREIGN KEY` de outras tabelas que fazem referência à tabela. Restrições de chave estrangeira entre colunas da mesma tabela são permitidas.

* As operações de truncação não retornam um valor significativo para o número de linhas excluídas. O resultado usual é "0 linhas afetadas", que deve ser interpretado como "nenhuma informação".

* Enquanto a definição da tabela for válida, a tabela pode ser recriada como uma tabela vazia com `TRUNCATE TABLE`, mesmo que os arquivos de dados ou de índice tenham se corrompido.

* Qualquer valor de `AUTO_INCREMENT` é redefinido para seu valor inicial. Isso é verdadeiro mesmo para `MyISAM` e `InnoDB`, que normalmente não reutilizam valores de sequência.

* Quando usado com tabelas particionadas, `TRUNCATE TABLE` preserva a partição; ou seja, os arquivos de dados e de índice são eliminados e recriados, enquanto as definições de partição não são afetadas.

* A declaração `TRUNCATE TABLE` não invoca gatilhos `ON DELETE`.

* O truncamento de uma tabela `InnoDB` corrompida é suportado.

`TRUNCATE TABLE` é tratado para fins de registro binário e replicação como DDL e não DML, e é sempre registrado como uma declaração.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Em MySQL 5.7 e versões anteriores, em um sistema com um grande pool de buffers e `innodb_adaptive_hash_index` habilitado, uma operação `TRUNCATE TABLE` poderia causar uma queda temporária no desempenho do sistema devido a uma varredura LRU que ocorreu ao remover as entradas do índice de hash adaptativo da tabela (Bug #68184). A remapeamento de `TRUNCATE TABLE`(truncate-table.html "15.1.37 TRUNCATE TABLE Statement") para `DROP TABLE` e `CREATE TABLE` em MySQL 8.0 evita a varredura LRU problemática.

`TRUNCATE TABLE` pode ser usado com as tabelas de resumo do Schema de Desempenho, mas o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Veja a Seção 29.12.20, “Tabelas de Resumo do Schema de Desempenho”.

O truncamento de uma tabela `InnoDB` que reside em um espaço de tabelas por arquivo elimina o espaço de tabelas existente e cria um novo. A partir do MySQL 8.0.21, se o espaço de tabelas foi criado com uma versão anterior e reside em um diretório desconhecido, `InnoDB` cria o novo espaço de tabelas na localização padrão e escreve o seguinte aviso no log de erro: O local do DATA DIRECTORY deve estar em um diretório conhecido. O local do DATA DIRECTORY será ignorado e o arquivo será colocado na localização padrão do datadir. Diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`. Para fazer com que `TRUNCATE TABLE` crie o espaço de tabelas na sua localização atual, adicione o diretório à configuração `innodb_directories` antes de executar `TRUNCATE TABLE`.