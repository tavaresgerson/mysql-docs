### 13.1.5 Declaração ALTER LOGFILE GROUP

```sql
ALTER LOGFILE GROUP logfile_group
    ADD UNDOFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Esta declaração adiciona um arquivo `UNDO` com o nome '*`file_name`*' a um grupo de arquivos de log existente *`logfile_group`*. Uma declaração `ALTER LOGFILE GROUP` (alter-logfile-group.html) tem uma e apenas uma cláusula `ADD UNDOFILE`. A cláusula `DROP UNDOFILE` não é atualmente suportada.

Nota

Todos os objetos de disco de dados do NDB Cluster compartilham o mesmo namespace. Isso significa que *cada objeto de disco de dados* deve ter um nome único (e não apenas cada objeto de disco de dados de um determinado tipo). Por exemplo, você não pode ter um espaço de tabelas e um arquivo de log de desfazer com o mesmo nome, ou um arquivo de log de desfazer e um arquivo de dados com o mesmo nome.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO` em bytes; se não for especificado, o tamanho inicial é definido como 134217728 (128 MB). Você pode opcionalmente seguir *`size`* com uma abreviação de uma letra para indicar uma ordem de grandeza, semelhante às usadas no `my.cnf`. Geralmente, essa é uma das letras `M` (megabytes) ou `G` (gigabytes). (Bug #13116514, Bug #16104705, Bug #62858)

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB). (Bug #29574)

Nota

`WAIT` é analisado, mas ignorado. Esta palavra-chave atualmente não tem efeito e é destinada para expansão futura.

O parâmetro `ENGINE` (obrigatório) determina o motor de armazenamento utilizado por este grupo de arquivos de registro, com `engine_name` sendo o nome do motor de armazenamento. Atualmente, os únicos valores aceitos para `engine_name` são “`NDBCLUSTER`” e “`NDB`”. Os dois valores são equivalentes.

Aqui está um exemplo, que assume que o grupo de arquivo de registro `lg_3` já foi criado usando `CREATE LOGFILE GROUP` (veja Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”):

```sql
ALTER LOGFILE GROUP lg_3
    ADD UNDOFILE 'undo_10.dat'
    INITIAL_SIZE=32M
    ENGINE=NDBCLUSTER;
```

Quando o comando `ALTER LOGFILE GROUP` é usado com `ENGINE = NDBCLUSTER` (ou `ENGINE = NDB`), um arquivo de log `UNDO` é criado em cada nó de dados do NDB Cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`. Por exemplo:

```sql
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

(Veja Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”.)

A memória usada para `UNDO_BUFFER_SIZE` vem do pool global, cujo tamanho é determinado pelo valor do parâmetro de configuração do nó de dados `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pelo ajuste do parâmetro de configuração do nó de dados `InitialLogFileGroup`.

`ALTER LOGFILE GROUP` é útil apenas com o armazenamento de dados de disco para o NDB Cluster. Para mais informações, consulte Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster”.
