#### 14.6.1.3 Importando Tabelas InnoDB

Esta seção descreve como importar tabelas usando o recurso *Transportable Tablespaces*, que permite a importação de tabelas, tabelas particionadas ou partições de tabela individuais que residem em tablespaces do tipo file-per-table. Existem muitas razões pelas quais você pode querer importar tabelas:

* Executar relatórios em uma instância de servidor MySQL não-produção para evitar sobrecarregar um servidor de produção.
* Copiar dados para um novo servidor replica.
* Restaurar uma tabela a partir de um arquivo de tablespace de backup.
* Como uma forma mais rápida de mover dados do que importar um arquivo de dump, o que exige a reinserção de dados e a reconstrução de Indexes.
* Mover dados para um servidor com mídia de armazenamento mais adequada aos seus requisitos de armazenamento. Por exemplo, você pode mover tabelas muito utilizadas para um dispositivo SSD, ou mover tabelas grandes para um dispositivo HDD de alta capacidade.

O recurso *Transportable Tablespaces* é descrito sob os seguintes tópicos nesta seção:

* Pré-requisitos
* Importando Tabelas
* Importando Tabelas Particionadas
* Importando Partições de Tabela
* Limitações
* Notas de Uso
* Detalhes Internos

##### Pré-requisitos

* A variável `innodb_file_per_table` deve estar ativada, o que é o padrão.

* O page size do tablespace deve corresponder ao page size da instância de servidor MySQL de destino. O page size do `InnoDB` é definido pela variável `innodb_page_size`, que é configurada ao inicializar uma instância de servidor MySQL.

* Se a tabela tiver um relacionamento de Foreign Key, `foreign_key_checks` deve ser desativado antes de executar `DISCARD TABLESPACE`. Além disso, você deve exportar todas as tabelas relacionadas a Foreign Keys no mesmo ponto lógico no tempo, pois `ALTER TABLE ... IMPORT TABLESPACE` não impõe restrições de Foreign Key nos dados importados. Para fazer isso, pare de atualizar as tabelas relacionadas, faça o commit de todas as transações, adquira Locks compartilhados nas tabelas e execute as operações de exportação.

* Ao importar uma tabela de outra instância de servidor MySQL, ambas as instâncias de servidor MySQL devem ter status de General Availability (GA) e devem ser da mesma versão. Caso contrário, a tabela deve ser criada na mesma instância de servidor MySQL para a qual está sendo importada.

* Se a tabela foi criada em um diretório externo especificando a cláusula `DATA DIRECTORY` na instrução `CREATE TABLE`, a tabela que você substitui na instância de destino deve ser definida com a mesma cláusula `DATA DIRECTORY`. Um erro de Schema Mismatch é relatado se as cláusulas não coincidirem. Para determinar se a tabela de origem foi definida com uma cláusula `DATA DIRECTORY`, use `SHOW CREATE TABLE` para visualizar a definição da tabela. Para obter informações sobre como usar a cláusula `DATA DIRECTORY`, consulte a Seção 14.6.1.2, “Criando Tabelas Externamente”.

* Se uma opção `ROW_FORMAT` não for definida explicitamente na definição da tabela ou se `ROW_FORMAT=DEFAULT` for usado, a configuração `innodb_default_row_format` deve ser a mesma nas instâncias de origem e destino. Caso contrário, um erro de Schema Mismatch é relatado quando você tenta a operação de importação. Use `SHOW CREATE TABLE` para verificar a definição da tabela. Use `SHOW VARIABLES` para verificar a configuração `innodb_default_row_format`. Para informações relacionadas, consulte Definindo o Row Format de uma Tabela.

##### Importando Tabelas

Este exemplo demonstra como importar uma tabela regular não particionada que reside em um tablespace file-per-table.

1. Na instância de destino, crie uma tabela com a mesma definição da tabela que você pretende importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`.) Se a definição da tabela não coincidir, um erro de Schema Mismatch é relatado quando você tenta a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   ```

2. Na instância de destino, descarte o tablespace da tabela que você acabou de criar. (Antes de importar, você deve descartar o tablespace da tabela receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar em repouso (quiesce) a tabela que você pretende importar. Quando uma tabela é colocada em repouso, apenas transações somente leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas (flushed) para o disco, para que uma cópia binária da tabela possa ser feita enquanto o servidor está em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera um arquivo de metadados `.cfg` no diretório de Schema da tabela. O arquivo `.cfg` contém metadados que são usados para verificação de Schema durante a operação de importação.

   Note

   A conexão que executa `FLUSH TABLES ... FOR EXPORT` deve permanecer aberta enquanto a operação estiver em execução; caso contrário, o arquivo `.cfg` será removido, pois os Locks são liberados ao fechar a conexão.

4. Copie o arquivo `.ibd` e o arquivo de metadados `.cfg` da instância de origem para a instância de destino. Por exemplo:

   ```sql
   $> scp /path/to/datadir/test/t1.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

   O arquivo `.ibd` e o arquivo `.cfg` devem ser copiados antes de liberar os Locks compartilhados, conforme descrito na próxima etapa.

   Note

   Se você estiver importando uma tabela de um tablespace criptografado, o `InnoDB` gera um arquivo `.cfp` além de um arquivo de metadados `.cfg`. O arquivo `.cfp` deve ser copiado para a instância de destino junto com o arquivo `.cfg`. O arquivo `.cfp` contém uma chave de transferência e uma chave de tablespace criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do tablespace. Para informações relacionadas, consulte a Seção 14.14, “InnoDB Data-at-Rest Encryption”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar os Locks adquiridos pela instrução `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

   A operação `UNLOCK TABLES` também remove o arquivo `.cfg`.

6. Na instância de destino, importe o tablespace:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Importando Tabelas Particionadas

Este exemplo demonstra como importar uma tabela particionada, onde cada partition de tabela reside em um tablespace file-per-table.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada que você deseja importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`.) Se a definição da tabela não coincidir, um erro de Schema Mismatch é relatado quando você tenta a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 3;
   ```

   No diretório `/datadir/test`, há um arquivo `.ibd` de tablespace para cada uma das três partições.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd
   ```

2. Na instância de destino, descarte o tablespace da tabela particionada. (Antes da operação de importação, você deve descartar o tablespace da tabela receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

   Os três arquivos `.ibd` de tablespace da tabela particionada são descartados do diretório `/datadir/test`, deixando os seguintes arquivos:

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar em repouso (quiesce) a tabela particionada que você pretende importar. Quando uma tabela é colocada em repouso, apenas transações somente leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas para o disco, para que a cópia binária da tabela possa ser feita enquanto o servidor está em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera arquivos de metadados `.cfg` no diretório de Schema da tabela para cada um dos arquivos de tablespace da tabela.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd
   t1.frm  t1#P#p0.cfg  t1#P#p1.cfg  t1#P#p2.cfg
   ```

   Os arquivos `.cfg` contêm metadados que são usados para verificação de Schema ao importar o tablespace. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, e não em partições de tabela individuais.

4. Copie os arquivos `.ibd` e `.cfg` do diretório de Schema da instância de origem para o diretório de Schema da instância de destino. Por exemplo:

   ```sql
   $>scp /path/to/datadir/test/t1*.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

   Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar os Locks compartilhados, conforme descrito na próxima etapa.

   Note

   Se você estiver importando uma tabela de um tablespace criptografado, o `InnoDB` gera arquivos `.cfp` além de arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino junto com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de tablespace criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do tablespace. Para informações relacionadas, consulte a Seção 14.14, “InnoDB Data-at-Rest Encryption”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar os Locks adquiridos por `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe o tablespace da tabela particionada:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Importando Partições de Tabela

Este exemplo demonstra como importar partições de tabela individuais, onde cada partition reside em um arquivo de tablespace file-per-table.

No exemplo a seguir, duas partições (`p2` e `p3`) de uma tabela de quatro partições são importadas.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada da qual você deseja importar partições. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`.) Se a definição da tabela não coincidir, um erro de Schema Mismatch é relatado quando você tenta a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 4;
   ```

   No diretório `/datadir/test`, há um arquivo `.ibd` de tablespace para cada uma das quatro partições.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd t1#P#p3.ibd
   ```

2. Na instância de destino, descarte as partições que você pretende importar da instância de origem. (Antes de importar partições, você deve descartar as partições correspondentes da tabela particionada receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
   ```

   Os arquivos `.ibd` de tablespace para as duas partições descartadas são removidos do diretório `/datadir/test` na instância de destino, deixando os seguintes arquivos:

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd
   ```

   Note

   Quando `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` é executado em tabelas subparticionadas, ambos os nomes de tabela de partition e subpartition são permitidos. Quando um nome de partition é especificado, as subpartitions dessa partition são incluídas na operação.

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada em repouso (quiesce). Quando uma tabela é colocada em repouso, apenas transações somente leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas para o disco, para que a cópia binária da tabela possa ser feita enquanto a instância está em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera um arquivo de metadados `.cfg` para cada um dos arquivos de tablespace da tabela no diretório de Schema da tabela.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd t1#P#p3.ibd
   t1.frm  t1#P#p0.cfg  t1#P#p1.cfg  t1#P#p2.cfg t1#P#p3.cfg
   ```

   Os arquivos `.cfg` contêm metadados que são usados para verificação de Schema durante a operação de importação. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, e não em partições de tabela individuais.

4. Copie os arquivos `.ibd` e `.cfg` para as partições `p2` e `p3` do diretório de Schema da instância de origem para o diretório de Schema da instância de destino.

   ```sql
   $> scp t1#P#p2.ibd t1#P#p2.cfg t1#P#p3.ibd t1#P#p3.cfg destination-server:/path/to/datadir/test
   ```

   Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar os Locks compartilhados, conforme descrito na próxima etapa.

   Note

   Se você estiver importando partições de um tablespace criptografado, o `InnoDB` gera arquivos `.cfp` além de arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino junto com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de tablespace criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do tablespace. Para informações relacionadas, consulte a Seção 14.14, “InnoDB Data-at-Rest Encryption”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar os Locks adquiridos por `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe as partições de tabela `p2` e `p3`:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
   ```

   Note

   Quando `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` é executado em tabelas subparticionadas, ambos os nomes de tabela de partition e subpartition são permitidos. Quando um nome de partition é especificado, as subpartitions dessa partition são incluídas na operação.

##### Limitações

* O recurso *Transportable Tablespaces* é suportado apenas para tabelas que residem em tablespaces file-per-table. Não é suportado para tabelas que residem no system tablespace ou em general tablespaces. Tabelas em tablespaces compartilhados não podem ser colocadas em repouso (quiesced).

* `FLUSH TABLES ... FOR EXPORT` não é suportado em tabelas com um Index `FULLTEXT`, pois as tabelas auxiliares de busca full-text não podem ser descarregadas (flushed). Após importar uma tabela com um Index `FULLTEXT`, execute `OPTIMIZE TABLE` para reconstruir os Indexes `FULLTEXT`. Alternativamente, descarte os Indexes `FULLTEXT` antes da operação de exportação e recrie os Indexes após importar a tabela na instância de destino.

* Devido a uma limitação do arquivo de metadados `.cfg`, as incompatibilidades de Schema (Schema Mismatches) não são relatadas para diferenças no tipo de partition ou na definição da partition ao importar uma tabela particionada. As diferenças de coluna são relatadas.

##### Notas de Uso

* `ALTER TABLE ... IMPORT TABLESPACE` não requer um arquivo de metadados `.cfg` para importar uma tabela. No entanto, verificações de metadados não são realizadas ao importar sem um arquivo `.cfg`, e um aviso semelhante ao seguinte é emitido:

  ```sql
  Message: InnoDB: IO Read error: (2, No such file or directory) Error opening '.\
  test\t.cfg', will attempt to import without schema verification
  1 row in set (0.00 sec)
  ```

  A importação de uma tabela sem um arquivo de metadados `.cfg` deve ser considerada apenas se não houver expectativa de Schema Mismatches. A capacidade de importar sem um arquivo `.cfg` pode ser útil em cenários de recuperação de falhas onde os metadados não estão acessíveis.

* No Windows, o `InnoDB` armazena nomes de Database, tablespace e tabela internamente em letras minúsculas. Para evitar problemas de importação em sistemas operacionais sensíveis a maiúsculas e minúsculas, como Linux e Unix, crie todos os Databases, tablespaces e tabelas usando nomes em letras minúsculas. Uma maneira conveniente de fazer isso é adicionar `lower_case_table_names=1` à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar Databases, tablespaces ou tabelas:

  ```sql
  [mysqld]
  lower_case_table_names=1
  ```

* Ao executar `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` e `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` em tabelas subparticionadas, ambos os nomes de tabela de partition e subpartition são permitidos. Quando um nome de partition é especificado, as subpartitions dessa partition são incluídas na operação.

##### Detalhes Internos

As informações a seguir descrevem detalhes internos e mensagens escritas no error log durante um procedimento de importação de tabela.

Quando `ALTER TABLE ... DISCARD TABLESPACE` é executado na instância de destino:

* A tabela é bloqueada no modo X.
* O tablespace é desvinculado da tabela.

Quando `FLUSH TABLES ... FOR EXPORT` é executado na instância de origem:

* A tabela sendo descarregada para exportação é bloqueada no modo compartilhado.
* A Thread coordenadora de Purge é interrompida.
* Páginas sujas são sincronizadas para o disco.
* Os metadados da tabela são escritos no arquivo binário `.cfg`.

Mensagens esperadas no error log para esta operação:

```sql
[Note] InnoDB: Sync to disk of '"test"."t1"' started.
[Note] InnoDB: Stopping purge
[Note] InnoDB: Writing table metadata to './test/t1.cfg'
[Note] InnoDB: Table '"test"."t1"' flushed to disk
```

Quando `UNLOCK TABLES` é executado na instância de origem:

* O arquivo binário `.cfg` é excluído.
* O Lock compartilhado na tabela ou tabelas sendo importadas é liberado e a Thread coordenadora de Purge é reiniciada.

Mensagens esperadas no error log para esta operação:

```sql
[Note] InnoDB: Deleting the meta-data file './test/t1.cfg'
[Note] InnoDB: Resuming purge
```

Quando `ALTER TABLE ... IMPORT TABLESPACE` é executado na instância de destino, o algoritmo de importação executa as seguintes operações para cada tablespace que está sendo importado:

* Cada page do tablespace é verificada quanto à corrupção.
* O ID do espaço e os LSNs (Log Sequence Numbers) em cada page são atualizados.
* Flags são validados e o LSN é atualizado para a page de cabeçalho (header page).
* Btree pages são atualizadas.
* O page state é definido como dirty para que seja escrito no disco.

Mensagens esperadas no error log para esta operação:

```sql
[Note] InnoDB: Importing tablespace for table 'test/t1' that was exported
from host 'host_name'
[Note] InnoDB: Phase I - Update all pages
[Note] InnoDB: Sync to disk
[Note] InnoDB: Sync to disk - done!
[Note] InnoDB: Phase III - Flush changes to disk
[Note] InnoDB: Phase IV - Flush complete
```

Note

Você também pode receber um aviso de que um tablespace foi descartado (se você descartou o tablespace para a tabela de destino) e uma mensagem indicando que as estatísticas não puderam ser calculadas devido à falta de um arquivo `.ibd`:

```sql
[Warning] InnoDB: Table "test"."t1" tablespace is set as discarded.
7f34d9a37700 InnoDB: cannot calculate statistics for table
"test"."t1" because the .ibd file is missing. For help, please refer to
http://dev.mysql.com/doc/refman/5.7/en/innodb-troubleshooting.html
```