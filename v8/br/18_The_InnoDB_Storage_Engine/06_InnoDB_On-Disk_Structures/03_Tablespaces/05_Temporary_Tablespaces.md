#### 17.6.3.5 Tabelasespaces temporários

O `InnoDB` utiliza espaços de tabelas temporárias de sessão e um espaço de tabelas temporárias globais.

##### Tabelas temporárias de sessão

Os espaços temporários de tabelas de sessão armazenam tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador quando `InnoDB` é configurado como o mecanismo de armazenamento para tabelas temporárias internas em disco. A partir do MySQL 8.0.16, o mecanismo de armazenamento usado para tabelas temporárias internas em disco é `InnoDB`. (Anteriormente, o mecanismo de armazenamento era determinado pelo valor de `internal_tmp_disk_storage_engine`.)

Os espaços de tabelas temporários de sessão são alocados a uma sessão a partir de um conjunto de espaços de tabelas temporárias no primeiro pedido para criar uma tabela temporária em disco. No máximo, dois espaços de tabelas são alocados a uma sessão, um para tabelas temporárias criadas pelo usuário e outro para tabelas temporárias internas criadas pelo otimizador. Os espaços de tabelas temporárias alocados a uma sessão são usados para todas as tabelas temporárias em disco criadas pela sessão. Quando uma sessão se desconecta, seus espaços de tabelas temporárias são truncados e liberados de volta ao conjunto. Um conjunto de 10 espaços de tabelas temporárias é criado quando o servidor é iniciado. O tamanho do conjunto nunca diminui e os espaços de tabelas são adicionados ao conjunto automaticamente conforme necessário. O conjunto de espaços de tabelas temporárias é removido em uma parada normal ou em uma inicialização aborrecida. Os arquivos de espaço de tabela temporária de sessão têm cinco páginas de tamanho quando criados e têm a extensão de nome de arquivo `.ibt`.

Uma faixa de 400 mil IDs de espaço é reservada para os espaços de tabelas temporárias de sessão. Como o conjunto de espaços de tabelas temporárias de sessão é recriado toda vez que o servidor é iniciado, os IDs de espaço para os espaços de tabelas temporárias de sessão não são persistentes quando o servidor é desligado e podem ser reutilizados.

A variável `innodb_temp_tablespaces_dir` define o local onde as tabelas temporárias de sessão são criadas. O local padrão é o diretório `#innodb_temp` no diretório de dados. O inicialização é recusada se o pool de tabelas temporárias não puder ser criado.

```
$> cd BASEDIR/data/#innodb_temp
$> ls
temp_10.ibt  temp_2.ibt  temp_4.ibt  temp_6.ibt  temp_8.ibt
temp_1.ibt   temp_3.ibt  temp_5.ibt  temp_7.ibt  temp_9.ibt
```

No modo de replicação com declaração baseada (SBR), as tabelas temporárias criadas em uma replica residem em um espaço de tabelas temporárias de sessão única que é truncado apenas quando o servidor MySQL é desligado.

A tabela `INNODB_SESSION_TEMP_TABLESPACES` fornece metadados sobre os espaços de tabelas temporárias de sessão.

A tabela Schema de Informações `INNODB_TEMP_TABLE_INFO` fornece metadados sobre tabelas temporárias criadas por usuários que estão ativas em uma instância `InnoDB`.

##### Espaço de tabela temporário global

O espaço de tabela temporário global (`ibtmp1`) armazena segmentos de rollback para as alterações feitas em tabelas temporárias criadas pelo usuário.

A variável `innodb_temp_data_file_path` define o caminho relativo, o nome, o tamanho e os atributos dos arquivos de dados do espaço de tabela temporário global. Se não for especificado um valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensível com o nome `ibtmp1` no diretório `innodb_data_home_dir`. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

O espaço de tabela temporário global é removido durante o desligamento normal ou durante uma inicialização aborrecida e recriado toda vez que o servidor é iniciado. O espaço de tabela temporário global recebe um ID de espaço gerado dinamicamente quando é criado. O início é negado se o espaço de tabela temporário global não puder ser criado. O espaço de tabela temporário global não é removido se o servidor parar inesperadamente. Nesse caso, um administrador de banco de dados pode remover o espaço de tabela temporário global manualmente ou reiniciar o servidor MySQL. A reinicialização do servidor MySQL remove e recria o espaço de tabela temporário global automaticamente.

O espaço de tabela temporário global não pode residir em um dispositivo bruto.

A tabela Schema de Informações `FILES` fornece metadados sobre o espaço de tabela temporário global. Emite uma consulta semelhante a esta para visualizar os metadados do espaço de tabela temporária global:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='innodb_temporary'\G
```

Por padrão, o arquivo de dados do espaço de tabela temporário global é autoextensivo e aumenta de tamanho conforme necessário.

Para determinar se um arquivo de dados de espaço de tabela temporário global está sendo autoextendido, verifique a configuração `innodb_temp_data_file_path`:

```
mysql> SELECT @@innodb_temp_data_file_path;
+------------------------------+
| @@innodb_temp_data_file_path |
+------------------------------+
| ibtmp1:12M:autoextend        |
+------------------------------+
```

Para verificar o tamanho dos arquivos de dados do espaço de tabela temporário global, examine a tabela Schema de Informações `FILES` usando uma consulta semelhante à seguinte:

```
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

`TotalSizeBytes` mostra o tamanho atual do arquivo de dados do espaço de tabela temporário global. Para obter informações sobre outros valores de campo, consulte a Seção 28.3.15, “A Tabela INFORMATION\_SCHEMA FILES”.

Alternativamente, verifique o tamanho do arquivo de dados do espaço de tabela temporário global no seu sistema operacional. O arquivo de dados do espaço de tabela temporário global está localizado no diretório definido pela variável `innodb_temp_data_file_path`.

Para recuperar o espaço em disco ocupado por um arquivo de dados do espaço de tabelas temporárias globais, reinicie o servidor MySQL. A reinicialização do servidor remove e recria o arquivo de dados do espaço de tabelas temporárias globais de acordo com os atributos definidos por `innodb_temp_data_file_path`.

Para limitar o tamanho do arquivo de dados do espaço de tabela temporário global, configure `innodb_temp_data_file_path` para especificar um tamanho máximo de arquivo. Por exemplo:

```
[mysqld]
innodb_temp_data_file_path=ibtmp1:12M:autoextend:max:500M
```

A configuração do `innodb_temp_data_file_path` requer o reinício do servidor.
