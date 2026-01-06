#### 14.6.3.5. O Espaço de Memória Temporário

Tabelas temporárias não compactadas, criadas pelo usuário, e tabelas temporárias internas no disco são criadas em um espaço de tabelas temporárias compartilhado. A variável `innodb_temp_data_file_path` define o caminho relativo, o nome, o tamanho e os atributos dos arquivos de dados do espaço de tabelas temporárias. Se não for especificado um valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um arquivo de dados auto-extensível chamado `ibtmp1` no diretório `innodb_data_home_dir` que é ligeiramente maior que 12 MB.

Nota

No MySQL 5.6, as tabelas temporárias não compactadas são criadas em espaços de arquivos individuais por tabela no diretório de arquivos temporários, ou no espaço de tabelas do sistema `InnoDB` no diretório de dados, se `innodb_file_per_table` estiver desativado. A introdução de um espaço de tabelas temporárias compartilhado no MySQL 5.7 elimina os custos de desempenho associados à criação e remoção de um espaço de arquivos por tabela para cada tabela temporária. Um espaço de tabelas temporárias dedicado também significa que não é mais necessário salvar o metadados das tabelas temporárias no espaço de tabelas do sistema `InnoDB`.

As tabelas temporárias compactadas, que são tabelas temporárias criadas usando o atributo `ROW_FORMAT=COMPRESSED`, são criadas em espaços de tabelas por arquivo no diretório de arquivos temporários.

O espaço de tabela temporário é removido durante o desligamento normal ou durante uma inicialização aborrecida e é recriado toda vez que o servidor é iniciado. O espaço de tabela temporário recebe um ID de espaço gerado dinamicamente quando é criado. A inicialização é recusada se o espaço de tabela temporário não puder ser criado. O espaço de tabela temporário não é removido se o servidor parar inesperadamente. Nesse caso, um administrador de banco de dados pode remover o espaço de tabela temporário manualmente ou reiniciar o servidor, o que remove e recria o espaço de tabela temporário automaticamente.

O espaço de tabela temporário não pode residir em um dispositivo bruto.

A tabela do esquema de informações `FILES` fornece metadados sobre o espaço de tabela temporário `InnoDB`. Execute uma consulta semelhante à seguinte para visualizar os metadados do espaço de tabela temporário:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='innodb_temporary'\G
```

A tabela do esquema de informações `INNODB_TEMP_TABLE_INFO` fornece metadados sobre tabelas temporárias criadas pelo usuário que estão atualmente ativas em uma instância `InnoDB`.

##### Gerenciamento do tamanho do arquivo de dados do espaço de tabela temporário

Por padrão, o arquivo de dados do espaço de tabela temporário é autoextensibile e aumenta de tamanho conforme necessário para acomodar tabelas temporárias no disco. Por exemplo, se uma operação cria uma tabela temporária de 20 MB de tamanho, o arquivo de dados do espaço de tabela temporária, que tem 12 MB de tamanho por padrão ao ser criado, se expande para acomodá-la. Quando as tabelas temporárias são excluídas, o espaço liberado pode ser reutilizado para novas tabelas temporárias, mas o arquivo de dados permanece no tamanho aumentado.

Um arquivo de dados de espaço de tabela temporário autoextensibile pode se tornar grande em ambientes que utilizam grandes tabelas temporárias ou que utilizam tabelas temporárias extensivamente. Um grande arquivo de dados também pode resultar de consultas de longa duração que utilizam tabelas temporárias.

Para determinar se um arquivo de dados de espaço de tabela temporário está sendo autoextendido, verifique a configuração `innodb_temp_data_file_path`:

```sql
mysql> SELECT @@innodb_temp_data_file_path;
+------------------------------+
| @@innodb_temp_data_file_path |
+------------------------------+
| ibtmp1:12M:autoextend        |
+------------------------------+
```

Para verificar o tamanho dos arquivos de dados do espaço de tabela temporário, execute uma consulta na tabela do esquema de informações `FILES` usando uma consulta semelhante a esta:

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

O valor `TotalSizeBytes` indica o tamanho atual do arquivo de dados do espaço de tabela temporário. Para obter informações sobre outros valores de campo, consulte a Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”.

Alternativamente, verifique o tamanho do arquivo de dados do espaço de tabelas temporário no seu sistema operacional. Por padrão, o arquivo de dados do espaço de tabelas temporário está localizado no diretório definido pela opção de configuração `innodb_temp_data_file_path`. Se um valor não foi especificado explicitamente para essa opção, um arquivo de dados do espaço de tabelas temporário chamado `ibtmp1` é criado em `innodb_data_home_dir`, que é definido como o diretório de dados do MySQL, se não for especificado.

Para recuperar o espaço em disco ocupado por um arquivo de dados de espaço de tabelas temporário, reinicie o servidor MySQL. A reinicialização do servidor remove e recria o arquivo de dados de espaço de tabelas temporário de acordo com os atributos definidos por `innodb_temp_data_file_path`.

Para evitar que o arquivo de dados temporário fique muito grande, você pode configurar a variável `innodb_temp_data_file_path` para especificar um tamanho máximo de arquivo. Por exemplo:

```sql
[mysqld]
innodb_temp_data_file_path=ibtmp1:12M:autoextend:max:500M
```

Quando o arquivo de dados atinge o tamanho máximo, as consultas falham com um erro indicando que a tabela está cheia. A configuração de `innodb_temp_data_file_path` requer o reinício do servidor.

Alternativamente, configure as variáveis `default_tmp_storage_engine` e `internal_tmp_disk_storage_engine`, que definem o mecanismo de armazenamento a ser usado para tabelas temporárias internas criadas pelo usuário e em disco, respectivamente. Ambas as variáveis são definidas como `InnoDB` por padrão. O mecanismo de armazenamento `MyISAM` usa um arquivo individual para cada tabela temporária, que é removido quando a tabela temporária é excluída.
