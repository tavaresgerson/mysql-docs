#### 17.6.3.5 Tabelasespaces Temporários

O `InnoDB` utiliza tabelasespaces temporários de sessão e um tabelaspaces temporários globais.

##### Tabelasespaces Temporários de Sessão

As tabelasespaces temporários de sessão armazenam tabelas temporárias criadas pelo usuário e tabelaspaces temporários internos criados pelo otimizador quando o `InnoDB` é configurado como o motor de armazenamento para tabelaspaces temporários internos em disco. As tabelaspaces temporários internos em disco usam o motor de armazenamento `InnoDB`.

As tabelasespaces temporários de sessão são alocadas a uma sessão a partir de um conjunto de tabelasespaces temporários na primeira solicitação para criar uma tabela temporária em disco. Um máximo de dois tabelaspaces são alocados a uma sessão, um para tabelaspaces temporárias criadas pelo usuário e outro para tabelaspaces temporários internos criados pelo otimizador. As tabelasespaces temporários alocadas a uma sessão são usadas para todas as tabelaspaces temporárias em disco criadas pela sessão. Quando uma sessão se desconecta, seus tabelaspaces temporários são truncados e liberados de volta ao conjunto. Um conjunto de 10 tabelaspaces temporários é criado quando o servidor é iniciado. O tamanho do conjunto nunca diminui e tabelaspaces são adicionados ao conjunto automaticamente conforme necessário. O conjunto de tabelaspaces temporários é removido em uma parada normal ou em uma inicialização abortada. Os arquivos de tabelaspaces temporários de sessão têm cinco páginas de tamanho quando criados e têm a extensão de nome de arquivo `.ibt`.

Uma faixa de 400 mil IDs de espaço é reservada para tabelaspaces temporários de sessão. Como o conjunto de tabelaspaces temporários de sessão é recriado cada vez que o servidor é iniciado, as IDs de espaço para tabelaspaces temporários de sessão não são persistidas quando o servidor é desligado e podem ser reutilizadas.

A variável `innodb_temp_tablespaces_dir` define o local onde os espaços de tabelas temporárias de sessão são criados. O local padrão é o diretório `#innodb_temp` no diretório de dados. O inicialização é recusado se o pool de espaços de tabelas temporárias não puder ser criado.

No modo de replicação baseada em declarações (SBR), as tabelas temporárias criadas em uma replica residem em um único espaço de tabelas temporárias de sessão que é truncado apenas quando o servidor MySQL é desligado.

A tabela `INNODB_SESSION_TEMP_TABLESPACES` fornece metadados sobre os espaços de tabelas temporárias de sessão.

A tabela do esquema de informações `INNODB_TEMP_TABLE_INFO` fornece metadados sobre tabelas temporárias criadas por usuários que estão ativas em uma instância `InnoDB`.

##### Espaço de Tabelas Temporárias Globais

O espaço de tabelas temporárias globais (`ibtmp1`) armazena segmentos de rollback para alterações feitas em tabelas temporárias criadas por usuários.

A variável `innodb_temp_data_file_path` define o caminho relativo, nome, tamanho e atributos dos arquivos de dados do espaço de tabelas temporárias globais. Se não for especificado um valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extencível chamado `ibtmp1` no diretório `innodb_data_home_dir`. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

O espaço de tabela temporário global é removido durante o desligamento normal ou durante uma inicialização aborrecida e recriado toda vez que o servidor é iniciado. O espaço de tabela temporário global recebe um ID de espaço gerado dinamicamente quando é criado. A inicialização é recusada se o espaço de tabela temporário global não puder ser criado. O espaço de tabela temporário global não é removido se o servidor parar inesperadamente. Nesse caso, um administrador de banco de dados pode remover o espaço de tabela temporário global manualmente ou reiniciar o servidor MySQL. A reinicialização do servidor MySQL remove e recria automaticamente o espaço de tabela temporário global.

O espaço de tabela temporário global não pode residir em um dispositivo bruto.

A tabela do Esquema de Informações `FILES` fornece metadados sobre o espaço de tabela temporário global. Emita uma consulta semelhante a esta para visualizar os metadados do espaço de tabela temporário global:

```
$> cd BASEDIR/data/#innodb_temp
$> ls
temp_10.ibt  temp_2.ibt  temp_4.ibt  temp_6.ibt  temp_8.ibt
temp_1.ibt   temp_3.ibt  temp_5.ibt  temp_7.ibt  temp_9.ibt
```

Por padrão, o arquivo de dados do espaço de tabela temporário global é autoextensivo e aumenta de tamanho conforme necessário.

Para determinar se um arquivo de dados de espaço de tabela temporário global está sendo autoextendido, verifique a configuração `innodb_temp_data_file_path`:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='innodb_temporary'\G
```

Para verificar o tamanho dos arquivos de dados do espaço de tabela temporário global, examine a tabela do Esquema de Informações `FILES` usando uma consulta semelhante a esta:

```
mysql> SELECT @@innodb_temp_data_file_path;
+------------------------------+
| @@innodb_temp_data_file_path |
+------------------------------+
| ibtmp1:12M:autoextend        |
+------------------------------+
```

`TotalSizeBytes` mostra o tamanho atual do arquivo de dados do espaço de tabela temporário global. Para informações sobre outros valores de campo, consulte a Seção 28.3.15, “O Tabela do Esquema de Informações FILES”.

Alternativamente, verifique o tamanho do arquivo de dados do espaço de tabela temporário global no seu sistema operacional. O arquivo de dados do espaço de tabela temporário global está localizado no diretório definido pela variável `innodb_temp_data_file_path`.

Para recuperar o espaço em disco ocupado por um arquivo de dados do espaço de tabelas temporárias globais, reinicie o servidor MySQL. A reinicialização do servidor remove e recria o arquivo de dados do espaço de tabelas temporárias globais de acordo com os atributos definidos por `innodb_temp_data_file_path`.

Para limitar o tamanho do arquivo de dados do espaço de tabelas temporárias globais, configure `innodb_temp_data_file_path` para especificar um tamanho máximo de arquivo. Por exemplo:

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

A configuração de `innodb_temp_data_file_path` requer a reinicialização do servidor.