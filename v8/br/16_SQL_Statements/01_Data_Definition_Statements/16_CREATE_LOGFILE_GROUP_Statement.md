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

Essa declaração cria um novo grupo de arquivo de registro com o nome `logfile_group` e um único arquivo `UNDO` com o nome '`undo_file`'. Uma declaração `CREATE LOGFILE GROUP` tem uma e apenas uma cláusula `ADD UNDOFILE`. Para regras que cobrem a nomeação de grupos de arquivos de registro, consulte a Seção 11.2, “Nomes de Objetos do Esquema”.

Nota

Todos os objetos de disco de dados do NDB Cluster compartilham o mesmo namespace. Isso significa que *cada objeto de dados de disco* deve ter um nome único (e não apenas cada objeto de dados de disco de um determinado tipo). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de log com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Há apenas um grupo de arquivos de registro por instância do NDB Cluster a qualquer momento.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO`; se não for especificado, ele tem como padrão `128M` (128 megabytes). O parâmetro opcional `UNDO_BUFFER_SIZE` define o tamanho usado pelo buffer `UNDO` para o grupo de arquivos de log; o valor padrão para `UNDO_BUFFER_SIZE` é `8M` (oito megabytes); esse valor não pode exceder a quantidade de memória do sistema disponível. Ambos esses parâmetros são especificados em bytes. Você pode opcionalmente seguir um ou ambos desses com uma abreviação de uma letra para uma ordem de grandeza, semelhante às usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

A memória usada para `UNDO_BUFFER_SIZE` vem do pool global, cujo tamanho é determinado pelo valor do parâmetro de configuração do nó de dados `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pelo ajuste do parâmetro de configuração do nó de dados `InitialLogFileGroup`.

O máximo permitido para `UNDO_BUFFER_SIZE` é 629145600 (600 MB).

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB).

A opção `ENGINE` determina o mecanismo de armazenamento a ser utilizado por este grupo de arquivos de log, sendo `engine_name` o nome do mecanismo de armazenamento. No MySQL 8.0, isso deve ser `NDB` (ou `NDBCLUSTER`). Se `ENGINE` não for definido, o MySQL tenta usar o mecanismo especificado pela variável de sistema do servidor `default_storage_engine` (anteriormente `storage_engine`). Em qualquer caso, se o mecanismo não for especificado como `NDB` ou `NDBCLUSTER`, a instrução `CREATE LOGFILE GROUP` parece ter sucesso, mas na verdade falha ao criar o grupo de arquivos de log, como mostrado aqui:

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

O fato de a declaração `CREATE LOGFILE GROUP` não retornar realmente um erro quando um motor de armazenamento que não é `NDB` é nomeado, mas sim parecer ter sucesso, é um problema conhecido que esperamos resolver em uma futura versão do NDB Cluster.

`REDO_BUFFER_SIZE`, `NODEGROUP`, `WAIT` e `COMMENT` são analisados, mas ignorados, e, portanto, não têm efeito no MySQL 8.0. Essas opções são destinadas à expansão futura.

Quando usado com `ENGINE [=] NDB`, um grupo de arquivos de log e o arquivo de log associado `UNDO` são criados em cada nó de dados do cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`. Por exemplo:

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

`CREATE LOGFILE GROUP` é útil apenas com o armazenamento de dados de disco para o NDB Cluster. Veja a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”.
