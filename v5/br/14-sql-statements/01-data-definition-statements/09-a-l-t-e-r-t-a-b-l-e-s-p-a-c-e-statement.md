### 13.1.9 Declaração ALTER TABLESPACE

```sql
ALTER TABLESPACE tablespace_name
    {ADD | DROP} DATAFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Essa declaração é usada para adicionar um novo arquivo de dados ou para excluir um arquivo de dados de um espaço de tabelas.

A variante `ADD DATAFILE` permite que você especifique um tamanho inicial usando uma cláusula `INITIAL_SIZE`, onde *`size`* é medido em bytes; o valor padrão é 134217728 (128 MB). Você pode opcionalmente seguir *`size`* com uma abreviação de uma letra para uma ordem de grandeza, semelhante às usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (megabytes) ou `G` (gigabytes).

Nota

Todos os objetos de disco de dados do NDB Cluster compartilham o mesmo namespace. Isso significa que *cada objeto de disco de dados* deve ter um nome único (e não apenas cada objeto de disco de dados de um determinado tipo). Por exemplo, você não pode ter um espaço de tabelas e um arquivo de dados com o mesmo nome, ou um arquivo de log de desfazer e um espaço de tabelas com o mesmo nome.

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` é arredondado, explicitamente, como para `CREATE TABLESPACE`.

Uma vez que um arquivo de dados tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados ao tablespace usando as instruções adicionais `ALTER TABLESPACE ... ADD DATAFILE`.

Usando `DROP DATAFILE` com `ALTER TABLESPACE` (alter-tablespace.html), você pode excluir o arquivo de dados '*`file_name`*' do tablespace. Você não pode excluir um arquivo de dados de um tablespace que esteja sendo usado por qualquer tabela; em outras palavras, o arquivo de dados deve estar vazio (sem extensões usadas). Veja Seção 21.6.11.1, “Objetos de dados de disco de cluster NDB”. Além disso, qualquer arquivo de dados que será excluído deve ter sido previamente adicionado ao tablespace com `CREATE TABLESPACE` (create-tablespace.html) ou `ALTER TABLESPACE` (alter-tablespace.html).

Tanto `ALTER TABLESPACE ... ADD DATAFILE` quanto `ALTER TABLESPACE ... DROP DATAFILE` exigem uma cláusula `ENGINE` que especifica o mecanismo de armazenamento usado pelo tablespace. Atualmente, os únicos valores aceitos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

`WAIT` é analisado, mas ignorado, e, portanto, não tem efeito no MySQL 5.7. Ele é destinado para expansão futura.

Quando o comando `ALTER TABLESPACE ... ADD DATAFILE` é usado com `ENGINE = NDB`, um arquivo de dados é criado em cada nó de dados do cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`. Por exemplo, a seguinte consulta mostra todos os arquivos de dados pertencentes ao tablespace chamado `newts`:

```sql
mysql> SELECT LOGFILE_GROUP_NAME, FILE_NAME, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE TABLESPACE_NAME = 'newts' AND FILE_TYPE = 'DATAFILE';
+--------------------+--------------+----------------+
| LOGFILE_GROUP_NAME | FILE_NAME    | EXTRA          |
+--------------------+--------------+----------------+
| lg_3               | newdata.dat  | CLUSTER_NODE=3 |
| lg_3               | newdata.dat  | CLUSTER_NODE=4 |
| lg_3               | newdata2.dat | CLUSTER_NODE=3 |
| lg_3               | newdata2.dat | CLUSTER_NODE=4 |
+--------------------+--------------+----------------+
2 rows in set (0.03 sec)
```

Veja Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”.

`ALTER TABLESPACE` é útil apenas com o armazenamento de dados em disco para o NDB Cluster. Veja Seção 21.6.11, “Tabelas de Dados em Disco do NDB Cluster”.
