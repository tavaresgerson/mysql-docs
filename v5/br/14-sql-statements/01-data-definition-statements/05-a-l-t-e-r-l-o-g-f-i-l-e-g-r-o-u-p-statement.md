### 13.1.5 Instrução ALTER LOGFILE GROUP

```sql
ALTER LOGFILE GROUP logfile_group
    ADD UNDOFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Esta instrução adiciona um arquivo `UNDO` chamado '*`file_name`*' a um log file group *`logfile_group`* existente. Uma instrução `ALTER LOGFILE GROUP` possui uma e apenas uma cláusula `ADD UNDOFILE`. Nenhuma cláusula `DROP UNDOFILE` é suportada atualmente.

Nota

Todos os objetos Disk Data do NDB Cluster compartilham o mesmo namespace. Isso significa que *cada objeto Disk Data* deve ter um nome exclusivo (e não apenas cada objeto Disk Data de um determinado tipo). Por exemplo, você não pode ter um tablespace e um undo log file com o mesmo nome, nem um undo log file e um data file com o mesmo nome.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO` em bytes; se não for especificado, o tamanho inicial padrão é 134217728 (128 MB). Opcionalmente, você pode seguir *`size`* com uma abreviação de uma letra para uma ordem de magnitude, semelhante às usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes). (Bug #13116514, Bug #16104705, Bug #62858)

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB). (Bug #29574)

Nota

O `WAIT` é analisado (parsed), mas ignorado. Atualmente, esta keyword não tem efeito e destina-se a expansões futuras.

O parâmetro `ENGINE` (obrigatório) determina o storage engine que é usado por este log file group, sendo *`engine_name`* o nome do storage engine. Atualmente, os únicos valores aceitos para *`engine_name`* são “`NDBCLUSTER`” e “`NDB`”. Os dois valores são equivalentes.

Aqui está um exemplo, que pressupõe que o log file group `lg_3` já foi criado usando `CREATE LOGFILE GROUP` (veja Section 13.1.15, “CREATE LOGFILE GROUP Statement”):

```sql
ALTER LOGFILE GROUP lg_3
    ADD UNDOFILE 'undo_10.dat'
    INITIAL_SIZE=32M
    ENGINE=NDBCLUSTER;
```

Quando `ALTER LOGFILE GROUP` é usado com `ENGINE = NDBCLUSTER` (alternativamente, `ENGINE = NDB`), um `UNDO` log file é criado em cada data node do NDB Cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles ao realizar uma Query na tabela `FILES` do Information Schema. Por exemplo:

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

(Veja Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”.)

A memória usada para `UNDO_BUFFER_SIZE` provém do pool global cujo tamanho é determinado pelo valor do parâmetro de configuração de data node `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração de data node `InitialLogFileGroup`.

`ALTER LOGFILE GROUP` é útil apenas com Disk Data storage para NDB Cluster. Para mais informações, consulte Section 21.6.11, “NDB Cluster Disk Data Tables”.