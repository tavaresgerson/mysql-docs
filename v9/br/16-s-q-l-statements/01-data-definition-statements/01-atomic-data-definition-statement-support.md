### 15.1.1 Suporte à Declaração de Definição de Dados Atômicos

O MySQL 9.5 suporta declarações de Linguagem de Definição de Dados (DDL) atômicas. Esse recurso é conhecido como *DDL atômica*. Uma declaração de DDL atômica combina as atualizações do dicionário de dados, as operações do mecanismo de armazenamento e os registros binários de escrita associados a uma operação de DDL em uma única operação atômica. A operação é confirmada, com as alterações aplicáveis persistidas no dicionário de dados, no mecanismo de armazenamento e no registro binário, ou é revertida, mesmo que o servidor seja interrompido durante a operação.

Nota

*DDL atômica* não é *DDL transacional*. As declarações de DDL, atômicas ou não, encerram implicitamente qualquer transação ativa na sessão atual, como se você tivesse feito um `COMMIT` antes de executar a declaração. Isso significa que as declarações de DDL não podem ser executadas dentro de outra transação, dentro de declarações de controle de transação como `START TRANSACTION ... COMMIT`, ou combinadas com outras declarações dentro da mesma transação.

O DDL atômico é possível graças ao dicionário de dados do MySQL, que fornece armazenamento centralizado e transacional de metadados.

O recurso DDL atômico é descrito nos seguintes tópicos nesta seção:

* Declarações de DDL suportadas
* Características do DDL atômico
* Comportamento das declarações de DDL
* Suporte ao mecanismo de armazenamento
* Visualização de logs de DDL

#### Declarações de DDL suportadas

O recurso DDL atômico suporta tanto declarações de DDL de tabelas quanto não de tabelas. As operações de DDL relacionadas a tabelas requerem suporte do mecanismo de armazenamento, enquanto as operações de DDL não de tabelas não o requerem. Atualmente, apenas o mecanismo de armazenamento `InnoDB` suporta DDL atômico.

* As declarações de DDL de tabelas suportadas incluem as declarações `CREATE`, `ALTER` e `DROP` para bancos de dados, espaços de armazenamento de tabelas, tabelas e índices, e a declaração `TRUNCATE TABLE`.

* As declarações de DDL não de tabelas suportadas incluem:

+ As instruções `CREATE` e `DROP`, e, se aplicável, as instruções `ALTER` para programas armazenados, gatilhos, visualizações e funções carregáveis.

+ As instruções de gerenciamento de contas: as instruções `CREATE`, `ALTER`, `DROP` e, se aplicável, as instruções `RENAME` para usuários e papéis, bem como as instruções `GRANT` e `REVOKE`.

As seguintes instruções não são suportadas pela funcionalidade DDL atômica:

* Instruções DDL relacionadas a tabelas que envolvem um mecanismo de armazenamento diferente de `InnoDB`.

* As instruções `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* As instruções `INSTALL COMPONENT` e `UNINSTALL COMPONENT`.

* As instruções `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`.

#### Características DDL Atômico

As características das instruções DDL atômicas incluem o seguinte:

* As atualizações de metadados, escritas no log binário e operações do mecanismo de armazenamento, quando aplicável, são combinadas em uma única operação atômica.

* Não há compromissos intermediários na camada SQL durante a operação DDL.

* Quando aplicável:

  + O estado dos caches do dicionário de dados, rotinas, eventos e funções carregáveis é consistente com o status da operação DDL, o que significa que os caches são atualizados para refletir se a operação DDL foi concluída com sucesso ou revertida.

  + Os métodos do mecanismo de armazenamento envolvidos em uma operação DDL não realizam compromissos intermediários, e o mecanismo de armazenamento se registra como parte da operação DDL.

  + O mecanismo de armazenamento suporta refazer e reverter operações DDL, que é realizado na fase *Post-DDL* da operação DDL.

* O comportamento visível das operações DDL é atômico.

#### Comportamento das Instruções DDL

Esta seção descreve alguns aspectos importantes do comportamento das instruções DDL ao usar um mecanismo de armazenamento que suporta DDL atômico, como `InnoDB`.

As operações `DROP TABLE` são totalmente atômicas se todas as tabelas nomeadas usarem um mecanismo de armazenamento que suporte DDL atômico. A instrução ou exclui todas as tabelas com sucesso ou é revertida.

A operação `DROP TABLE` falha com um erro se uma tabela nomeada não existir e nenhuma alteração for feita, independentemente do mecanismo de armazenamento.

* As operações `CREATE DATABASE` e `DROP DATABASE` são totalmente atômicas e seguras em caso de falha, desde que todas as tabelas no banco de dados nomeado usem um mecanismo de armazenamento que suporte DDL atômico, caso em que a instrução exclui ou adiciona todos os objetos com sucesso, ou é revertida.

* Para tabelas que não usam um mecanismo de armazenamento que suporte DDL atômico, a exclusão de uma tabela ocorre fora da transação `DROP TABLE` ou `DROP DATABASE` atômica. Essas exclusões de tabelas são escritas no log binário individualmente, o que limita a discrepância entre o mecanismo de armazenamento, o dicionário de dados e o log binário a, no máximo, uma tabela no caso de uma operação de `DROP TABLE` ou `DROP DATABASE` interrompida. Para operações que excluem várias tabelas, todas as tabelas que não usam um mecanismo de armazenamento que suporte DDL atômico são excluídas antes das que o fazem.

* As operações `CREATE TABLE`, `ALTER TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`, `CREATE TABLESPACE` e `DROP TABLESPACE` para tabelas que usam um mecanismo de armazenamento que suporte DDL atômico são totalmente comprometidas ou revertidas se o servidor interromper durante sua operação. As operações `RENAME TABLE` são atômicas apenas se todas as tabelas nomeadas usarem um mecanismo de armazenamento que suporte DDL atômico.

* Para mecanismos de armazenamento que suportam DDL atômico, a instrução `CREATE TABLE ... SELECT` é registrada como uma transação no log binário quando a replicação baseada em linhas está em uso.

Em motores de armazenamento que suportam DDL atômico e restrições de chave estrangeira, a criação de chaves estrangeiras não é permitida em declarações `CREATE TABLE ... SELECT` quando a replicação baseada em linhas está em uso. As restrições de chave estrangeira podem ser adicionadas posteriormente usando `ALTER TABLE`.

Quando a `CREATE TABLE ... SELECT` é aplicada como uma operação atômica, um bloqueio de metadados é mantido na tabela enquanto os dados são inseridos, o que impede o acesso concorrente à tabela durante a duração da operação.

* A `DROP VIEW` falha se uma visão nomeada não existir e nenhuma alteração for feita.

* As declarações de gerenciamento de contas têm sucesso para todos os usuários nomeados ou são revertidas e não têm efeito se ocorrer um erro.

#### Suporte ao Motor de Armazenamento

Atualmente, apenas o motor de armazenamento `InnoDB` suporta DDL atômico. Motores de armazenamento que não suportam DDL atômico estão isentos da atinência DDL. As operações DDL que envolvem motores de armazenamento isentos permanecem capazes de introduzir inconsistências que podem ocorrer quando as operações são interrompidas ou apenas parcialmente concluídas.

Para suportar a reescrita e o rollback de operações DDL, o `InnoDB` escreve logs de DDL na tabela `mysql.innodb_ddl_log`, que é uma tabela de dicionário de dados oculta que reside no espaço de tabelas de dicionário `mysql.ibd`.

Para visualizar os logs de DDL escritos na tabela `mysql.innodb_ddl_log` durante uma operação de DDL, habilite a opção de configuração `innodb_print_ddl_logs`. Para mais informações, consulte Visualizando Logs de DDL.

Nota

Os registros de refazer para alterações na tabela `mysql.innodb_ddl_log` são descarregados no disco imediatamente, independentemente da configuração `innodb_flush_log_at_trx_commit`. Descarregar os registros de refazer imediatamente evita situações em que os arquivos de dados são modificados por operações de DDL, mas os registros de refazer para alterações na tabela `mysql.innodb_ddl_log` resultantes dessas operações não são persistidos no disco. Uma situação como essa pode causar erros durante o rollback ou a recuperação.

O mecanismo de armazenamento `InnoDB` executa operações de DDL em fases. Operações de DDL como `ALTER TABLE` podem realizar as fases *Prepare* e *Perform* várias vezes antes da fase *Commit*.

1. *Prepare*: Crie os objetos necessários e escreva os logs de DDL na tabela `mysql.innodb_ddl_log`. Os logs de DDL definem como avançar e reverter a operação de DDL.

2. *Perform*: Realize a operação de DDL. Por exemplo, execute uma rotina de criação para uma operação `CREATE TABLE`.

3. *Commit*: Atualize o dicionário de dados e commit a transação do dicionário de dados.

4. *Post-DDL*: Replayer e remova os logs de DDL da tabela `mysql.innodb_ddl_log`. Para garantir que o rollback possa ser realizado de forma segura sem introduzir inconsistências, operações de arquivo, como renomear ou remover arquivos de dados, são realizadas nesta fase final. Esta fase também remove metadados dinâmicos da tabela `mysql.innodb_dynamic_metadata` para operações de DDL como `DROP TABLE`, `TRUNCATE TABLE` e outras operações de DDL que reconstruem a tabela.

Os registros de DDL são regravados e removidos da tabela `mysql.innodb_ddl_log` durante a fase *Post-DDL*, independentemente de a operação de DDL ter sido confirmada ou revertida. Os registros de DDL devem permanecer apenas na tabela `mysql.innodb_ddl_log` se o servidor for interrompido durante uma operação de DDL. Nesse caso, os registros de DDL são regraváveis e removidos após a recuperação.

Em uma situação de recuperação, uma operação de DDL pode ser confirmada ou revertida quando o servidor for reiniciado. Se a transação do dicionário de dados que foi realizada durante a fase *Confirmar* de uma operação de DDL estiver presente no log de refazer e no log binário, a operação é considerada bem-sucedida e é avançada. Caso contrário, a transação incompleta do dicionário de dados é revertida quando o `InnoDB` regrava os logs de refazer do dicionário de dados e a operação de DDL é revertida.

#### Visualização dos Registros de DDL

Para visualizar os registros de DDL que são escritos na tabela `mysql.innodb_ddl_log` do dicionário de dados durante operações de DDL atômicas que envolvem o motor de armazenamento `InnoDB`, habilite `innodb_print_ddl_logs` para que o MySQL escreva os logs de DDL no `stderr`. Dependendo do sistema operacional do host e da configuração do MySQL, o `stderr` pode ser o log de erro, o terminal ou a janela de console. Consulte a Seção 7.4.2.2, “Configuração Padrão do Destino do Log de Erro”.

O `InnoDB` escreve os logs de DDL na tabela `mysql.innodb_ddl_log` para suportar a refazer e o revertido de operações de DDL. A tabela `mysql.innodb_ddl_log` é uma tabela oculta do dicionário de dados que reside no espaço de tabelas de dicionário `mysql.ibd`. Como outras tabelas ocultas do dicionário de dados, a tabela `mysql.innodb_ddl_log` não pode ser acessada diretamente em versões não de debug do MySQL. (Consulte a Seção 16.1, “Esquema do Dicionário de Dados”.) A estrutura da tabela `mysql.innodb_ddl_log` corresponde a essa definição:

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

* `thread_id`: Cada registro de log de DDL recebe um `thread_id`, que é usado para reproduzir e remover logs de DDL que pertencem a uma operação de DDL específica. As operações de DDL que envolvem múltiplas operações de arquivo de dados geram múltiplos registros de log de DDL.

* `type`: O tipo da operação de DDL. Os tipos incluem `FREE` (remover uma árvore de índice), `DELETE` (deletar um arquivo), `RENAME` (renomear um arquivo) ou `DROP` (remover metadados da tabela `mysql.innodb_dynamic_metadata`).

* `space_id`: O ID do tablespace.

* `page_no`: Uma página que contém informações de alocação; uma página raiz de uma árvore de índice, por exemplo.

* `index_id`: O ID do índice.

* `table_id`: O ID da tabela.

* `old_file_path`: O caminho do arquivo do tablespace antigo. Usado por operações de DDL que criam ou removem arquivos de tablespace; também usado por operações de DDL que renomeiam arquivos de tablespace.

* `new_file_path`: O caminho do arquivo do tablespace novo. Usado por operações de DDL que renomeiam arquivos de tablespace.

Este exemplo demonstra como habilitar `innodb_print_ddl_logs` para visualizar logs de DDL escritos em `strderr` para uma operação `CREATE TABLE`.

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