#### 14.6.3.5 O Temporary Tablespace

Temporary tables não compactadas criadas pelo usuário e temporary tables internas em disco são criadas em um shared temporary tablespace. A variável `innodb_temp_data_file_path` define o caminho relativo, nome, tamanho e atributos para os Data Files do temporary tablespace. Se nenhum valor for especificado para `innodb_temp_data_file_path`, o comportamento padrão é criar um Data File com auto-extensão chamado `ibtmp1` no diretório `innodb_data_home_dir` que é ligeiramente maior que 12MB.

Nota

No MySQL 5.6, temporary tables não compactadas são criadas em tablespaces individuais *file-per-table* no diretório de arquivos temporários, ou no system tablespace do `InnoDB` no diretório de dados se `innodb_file_per_table` estiver desabilitado. A introdução de um shared temporary tablespace no MySQL 5.7 remove custos de performance associados à criação e remoção de um tablespace *file-per-table* para cada temporary table. Um temporary tablespace dedicado também significa que não é mais necessário salvar Metadata de temporary tables nas System Tables do `InnoDB`.

Temporary tables compactadas, que são temporary tables criadas usando o atributo `ROW_FORMAT=COMPRESSED`, são criadas em tablespaces *file-per-table* no diretório de arquivos temporários.

O temporary tablespace é removido em um `shutdown` normal ou em uma inicialização abortada, e é recriado sempre que o servidor é iniciado (started). O temporary tablespace recebe um Space ID gerado dinamicamente quando é criado. O Startup é recusado se o temporary tablespace não puder ser criado. O temporary tablespace não é removido se o servidor parar inesperadamente. Neste caso, um administrador de Database pode remover o temporary tablespace manualmente ou reiniciar (restart) o servidor, o que remove e recria o temporary tablespace automaticamente.

O temporary tablespace não pode residir em um *raw device*.

A tabela `FILES` do Information Schema fornece Metadata sobre o temporary tablespace do `InnoDB`. Execute uma Query semelhante a esta para visualizar o Metadata do temporary tablespace:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='innodb_temporary'\G
```

A tabela `INNODB_TEMP_TABLE_INFO` do Information Schema fornece Metadata sobre temporary tables criadas pelo usuário que estão atualmente ativas em uma instância `InnoDB`.

##### Gerenciando o Tamanho do Data File do Temporary Tablespace

Por padrão, o Data File do temporary tablespace é autoextending (com auto-extensão) e aumenta de tamanho conforme necessário para acomodar temporary tables em disco. Por exemplo, se uma operação cria uma temporary table de 20MB, o Data File do temporary tablespace, que por padrão tem 12MB quando criado, se estende em tamanho para acomodá-la. Quando temporary tables são descartadas (dropped), o espaço liberado pode ser reutilizado para novas temporary tables, mas o Data File permanece no tamanho estendido.

Um Data File de temporary tablespace com auto-extensão pode se tornar grande em ambientes que usam temporary tables grandes ou que as utilizam extensivamente. Um Data File grande também pode resultar de Queries de longa duração que utilizam temporary tables.

Para determinar se um Data File de temporary tablespace é autoextending, verifique a configuração `innodb_temp_data_file_path`:

```sql
mysql> SELECT @@innodb_temp_data_file_path;
+------------------------------+
| @@innodb_temp_data_file_path |
+------------------------------+
| ibtmp1:12M:autoextend        |
+------------------------------+
```

Para verificar o tamanho dos Data Files do temporary tablespace, execute uma Query na tabela `FILES` do Information Schema usando uma Query semelhante a esta:

```sql
mysql> SELECT FILE_NAME, TABLESPACE_NAME, ENGINE, INITIAL_SIZE, TOTAL_EXTENTS*EXTENT_SIZE
       AS TotalSizeBytes, DATA_FREE, MAXIMUM_SIZE FROM INFORMATION_SCHEMA.FILES
       WHERE TABLESPACE_NAME = 'innodb_temporary'\G
*************************** 1. row ***************************
      FILE_NAME: ./ibtmp1
TABLESPACE_NAME: innodb_temporary
         ENGINE: InnoDB
   INITIAL_SIZE: 12582912
 TotalSizeBytes: 12582912
      DATA_FREE: 6291456
   MAXIMUM_SIZE: NULL
```

O valor de `TotalSizeBytes` informa o tamanho atual do Data File do temporary tablespace. Para obter informações sobre outros valores de campo, consulte a Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”.

Alternativamente, verifique o tamanho do Data File do temporary tablespace em seu sistema operacional. Por padrão, o Data File do temporary tablespace está localizado no diretório definido pela opção de configuração `innodb_temp_data_file_path`. Se um valor não tiver sido especificado explicitamente para esta opção, um Data File de temporary tablespace chamado `ibtmp1` será criado em `innodb_data_home_dir`, que tem como padrão o diretório de dados do MySQL se não for especificado.

Para recuperar o espaço em disco ocupado por um Data File de temporary tablespace, reinicie o servidor MySQL. Reiniciar o servidor remove e recria o Data File do temporary tablespace de acordo com os atributos definidos por `innodb_temp_data_file_path`.

Para evitar que o Data File temporário se torne muito grande, você pode configurar a variável `innodb_temp_data_file_path` para especificar um tamanho máximo de arquivo. Por exemplo:

```sql
[mysqld]
innodb_temp_data_file_path=ibtmp1:12M:autoextend:max:500M
```

Quando o Data File atinge o tamanho máximo, as Queries falham com um erro indicando que a table está cheia. A configuração de `innodb_temp_data_file_path` requer o restart do servidor.

Alternativamente, configure as variáveis `default_tmp_storage_engine` e `internal_tmp_disk_storage_engine`, que definem o Storage Engine a ser usado para temporary tables internas em disco e criadas pelo usuário, respectivamente. Ambas as variáveis são definidas como `InnoDB` por padrão. O Storage Engine `MyISAM` usa um arquivo individual para cada temporary table, que é removido quando a temporary table é descartada (dropped).