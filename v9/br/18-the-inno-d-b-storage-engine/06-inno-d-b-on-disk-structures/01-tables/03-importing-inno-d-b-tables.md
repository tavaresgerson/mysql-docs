#### 17.6.1.3 Impor tabelas InnoDB

Esta seção descreve como importar tabelas usando o recurso *Espaços de Tabela Transportabilidade*, que permite importar tabelas, tabelas particionadas ou partições individuais de tabelas que residem em espaços de tabela por arquivo. Há várias razões pelas quais você pode querer importar tabelas:

* Para executar relatórios em uma instância do servidor MySQL não de produção para evitar sobrecarregar um servidor de produção.
* Para copiar dados para um novo servidor de replica.
* Para restaurar uma tabela de um arquivo de espaço de tabela protegido.
* Como uma maneira mais rápida de mover dados do que importar um arquivo de dump, que requer a reinserção de dados e a reconstrução de índices.
* Para mover dados para um servidor com mídia de armazenamento mais adequada às suas necessidades de armazenamento. Por exemplo, você pode mover tabelas ocupadas para um dispositivo SSD ou mover tabelas grandes para um dispositivo de HDD de alta capacidade.

O recurso *Espaços de Tabela Transportabilidade* é descrito nos seguintes tópicos nesta seção:

* Pré-requisitos
* Importar tabelas
* Importar tabelas particionadas
* Importar partições de tabela
* Limitações
* Notas de uso
* Interiores

##### Pré-requisitos

* A variável `innodb_file_per_table` deve estar habilitada, o que é o caso por padrão.
* O tamanho da página do espaço de tabela deve corresponder ao tamanho da página do servidor MySQL de destino. O tamanho da página do `InnoDB` é definido pela variável `innodb_page_size`, que é configurada ao inicializar uma instância do servidor MySQL.

* Se a tabela tiver uma relação de chave estrangeira, `foreign_key_checks` deve ser desativado antes de executar `DISCARD TABLESPACE`. Além disso, você deve exportar todas as tabelas relacionadas à chave estrangeira no mesmo ponto lógico no tempo, pois `ALTER TABLE ... IMPORT TABLESPACE` não impõe restrições de chave estrangeira nos dados importados. Para fazer isso, pare de atualizar as tabelas relacionadas, commit todas as transações, adquira bloqueios compartilhados nas tabelas e realize as operações de exportação.

* Ao importar uma tabela de outra instância do servidor MySQL, ambas as instâncias do servidor MySQL devem ter o status de Disponibilidade Geral (GA) e devem ser da mesma versão. Caso contrário, a tabela deve ser criada na mesma instância do servidor MySQL na qual está sendo importada.

* Se a tabela foi criada em um diretório externo especificando a cláusula `DATA DIRECTORY` na instrução `CREATE TABLE`, a tabela que você substitui na instância de destino deve ser definida com a mesma cláusula `DATA DIRECTORY`. Um erro de incompatibilidade de esquema é relatado se as cláusulas não corresponderem. Para determinar se a tabela de origem foi definida com uma cláusula `DATA DIRECTORY`, use `SHOW CREATE TABLE` para visualizar a definição da tabela. Para informações sobre o uso da cláusula `DATA DIRECTORY`, consulte a Seção 17.6.1.2, “Criando Tabelas Externamente”.

* Se uma opção `ROW_FORMAT` não for definida explicitamente na definição da tabela ou `ROW_FORMAT=DEFAULT` for usada, o ajuste `innodb_default_row_format` deve ser o mesmo nas instâncias de origem e destino. Caso contrário, um erro de incompatibilidade de esquema é relatado quando você tenta a operação de importação. Use `SHOW CREATE TABLE` para verificar a definição da tabela. Use `SHOW VARIABLES` para verificar o ajuste `innodb_default_row_format`. Para informações relacionadas, consulte Definindo o Formato de Linha de uma Tabela.

##### Importando Tabelas

Este exemplo demonstra como importar uma tabela regular não particionada que reside em um espaço de tabelas por arquivo.

1. Na instância de destino, crie uma tabela com a mesma definição da tabela que você pretende importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será exibido quando você tentar a operação de importação.)

   ```
   mysql> USE test;
   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   ```

2. Na instância de destino, descarte o espaço de tabelas da tabela que você acabou de criar. (Antes de importar, você deve descartar o espaço de tabelas da tabela receptora.)

   ```
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela que você pretende importar em estado de repouso. Quando uma tabela é colocada em estado de repouso, apenas transações de leitura são permitidas na tabela.

   ```
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco para que uma cópia binária da tabela possa ser feita enquanto o servidor estiver em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera um arquivo de metadados `.cfg` no diretório do esquema da tabela. O arquivo `.cfg` contém metadados que são usados para verificação de esquema durante a operação de importação.

   Observação

   A conexão que está executando `FLUSH TABLES ... FOR EXPORT` deve permanecer aberta enquanto a operação estiver em execução; caso contrário, o arquivo `.cfg` será removido quando os bloqueios forem liberados após o fechamento da conexão.

4. Copie o arquivo `.ibd` e o arquivo de metadados `.cfg` da instância de origem para a instância de destino. Por exemplo:

   ```
   $> scp /path/to/datadir/test/t1.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

   O arquivo `.ibd` e o arquivo `.cfg` devem ser copiados antes de liberar os bloqueios compartilhados, conforme descrito no próximo passo.

   Observação

Se você estiver importando uma tabela de um espaço de tabelas criptografado, o `InnoDB` gera um arquivo `.cfp` além de um arquivo de metadados `.cfg`. O arquivo `.cfp` deve ser copiado para a instância de destino junto com o arquivo `.cfg`. O arquivo `.cfp` contém uma chave de transferência e uma chave de espaço de tabelas criptografado. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabelas. Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do `InnoDB’”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as chaves adquiridas pela instrução `FLUSH TABLES ... FOR EXPORT`:

   ```
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

   A operação `UNLOCK TABLES` também remove o arquivo `.cfg`.

6. Na instância de destino, importe o espaço de tabelas:

   ```
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Importando Tabelas Partidas

Este exemplo demonstra como importar uma tabela dividida, onde cada partição da tabela reside em um espaço de tabelas por arquivo.

1. Na instância de destino, crie uma tabela dividida com a mesma definição da tabela dividida que você deseja importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será relatado quando você tentar a operação de importação.)

   ```
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 3;
   ```

   No diretório `/datadir/test`, há um arquivo `.ibd` do espaço de tabelas para cada uma das três partições.

   ```
   mysql> \! ls /path/to/datadir/test/
   t1#p#p0.ibd  t1#p#p1.ibd  t1#p#p2.ibd
   ```

2. Na instância de destino, descarte o espaço de tabelas para a tabela dividida. (Antes da operação de importação, você deve descartar o espaço de tabelas da tabela receptora.)

   ```
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

   Os três arquivos `.ibd` do espaço de tabelas da tabela dividida são descartados do diretório `/datadir/test`.

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada que você pretende importar em estado de repouso. Quando uma tabela é colocada em estado de repouso, apenas transações de leitura são permitidas na tabela.

   ```
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária da tabela possa ser feita enquanto o servidor estiver em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera arquivos de metadados `.cfg` no diretório do esquema da tabela para cada um dos arquivos do espaço de tabela da tabela.

   ```
   mysql> \! ls /path/to/datadir/test/
   t1#p#p0.ibd  t1#p#p1.ibd  t1#p#p2.ibd
   t1#p#p0.cfg  t1#p#p1.cfg  t1#p#p2.cfg
   ```

   Os arquivos `.cfg` contêm metadados que são usados para verificação do esquema ao importar o espaço de tabela. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, não em partições individuais da tabela.

4. Copie os arquivos `.ibd` e `.cfg` do diretório do esquema da instância de origem para o diretório do esquema da instância de destino. Por exemplo:

   ```
   $>scp /path/to/datadir/test/t1*.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

   Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar as bloqueadoras compartilhadas, conforme descrito no passo seguinte.

   Nota

   Se você está importando uma tabela de um espaço de tabela criptografado, o `InnoDB` gera arquivos `.cfp` além de arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino junto com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de espaço de tabela criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabela. Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as bloqueadoras adquiridas por `FLUSH TABLES ... FOR EXPORT`:

   ```
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe o espaço de tabela da tabela particionada:

   ```
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Importando Partições de Tabela


Este exemplo demonstra como importar partições individuais de uma tabela, onde cada partição reside em um arquivo por tabela no espaço de tabelas.

No exemplo a seguir, duas partições (`p2` e `p3`) de uma tabela de quatro partições são importadas.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada da qual você deseja importar as partições. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será exibido quando você tentar a operação de importação.)

```
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 4;
   ```

No diretório `/datadir/test`, há um arquivo `.ibd` para cada uma das quatro partições.

```
   mysql> \! ls /path/to/datadir/test/
   t1#p#p0.ibd  t1#p#p1.ibd  t1#p#p2.ibd t1#p#p3.ibd
   ```

2. Na instância de destino, descarte as partições que você pretende importar da instância de origem. (Antes de importar as partições, você deve descartar as partições correspondentes da tabela particionada receptora.)

```
   mysql> ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
   ```

Os arquivos `.ibd` para as duas partições descartadas são removidos do diretório `/datadir/test` na instância de destino, deixando os seguintes arquivos:

```
   mysql> \! ls /path/to/datadir/test/
   t1#p#p0.ibd  t1#p#p1.ibd
   ```

Observação

Quando `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` é executado em tabelas subparticionadas, os nomes de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada em estado de repouso. Quando uma tabela é colocada em estado de repouso, apenas transações de leitura são permitidas na tabela.

```
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

`FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco para que uma cópia binária da tabela possa ser feita enquanto a instância estiver em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera um arquivo de metadados `.cfg` para cada um dos arquivos de espaço de tabela da tabela no diretório do esquema da tabela.

```
   mysql> \! ls /path/to/datadir/test/
   t1#p#p0.ibd  t1#p#p1.ibd  t1#p#p2.ibd t1#p#p3.ibd
   t1#p#p0.cfg  t1#p#p1.cfg  t1#p#p2.cfg t1#p#p3.cfg
   ```

Os arquivos `.cfg` contêm metadados usados para verificação do esquema durante a operação de importação. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, não em partições individuais da tabela.

4. Copie os arquivos `.ibd` e `.cfg` para as partições `p2` e `p3` do diretório do esquema da instância de origem para o diretório do esquema da instância de destino.

```
   $> scp t1#p#p2.ibd t1#p#p2.cfg t1#p#p3.ibd t1#p#p3.cfg destination-server:/path/to/datadir/test
   ```

Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar as bloqueadoras compartilhadas, conforme descrito no próximo passo.

Observação

Se você está importando partições de um espaço de tabela criptografado, o `InnoDB` gera arquivos `.cfp` além de arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino junto com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de espaço de tabela criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave de espaço de tabela. Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as bloqueadoras adquiridas por `FLUSH TABLES ... FOR EXPORT`:

```
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe as partições da tabela `p2` e `p3`:

```
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
   ```

Observação

Quando `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` é executado em tabelas subpartidas, os nomes de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

##### Limitações

* O recurso *Transportable Tablespaces* é suportado apenas para tabelas que residem em tablespaces de arquivo por tabela. Não é suportado para tabelas que residem no tablespace de sistema ou nos tablespaces gerais. Tabelas em tablespaces compartilhados não podem ser quiescedas.

* A opção `FLUSH TABLES ... FOR EXPORT` não é suportada em tabelas com um índice `FULLTEXT`, pois as tabelas auxiliares de pesquisa de texto completo não podem ser limpas. Após importar uma tabela com um índice `FULLTEXT`, execute `OPTIMIZE TABLE` para reconstruir os índices `FULLTEXT`. Alternativamente, exclua os índices `FULLTEXT` antes da operação de exportação e recree os índices após importar a tabela na instância de destino.

* Devido a uma limitação do arquivo de metadados `.cfg`, desalinhamentos de esquema não são relatados para diferenças no tipo de partição ou na definição de partição ao importar uma tabela particionada. Diferenças de colunas são relatadas.

##### Notas de Uso

* Com exceção das tabelas que contêm colunas adicionadas ou excluídas instantaneamente, `ALTER TABLE ... IMPORT TABLESPACE` não requer um arquivo de metadados `.cfg` para importar uma tabela. No entanto, verificações de metadados não são realizadas ao importar sem um arquivo `.cfg`, e é emitido um aviso semelhante ao seguinte:

  ```
  Message: InnoDB: IO Read error: (2, No such file or directory) Error opening '.\
  test\t.cfg', will attempt to import without schema verification
  1 row in set (0.00 sec)
  ```

  A importação de uma tabela sem um arquivo de metadados `.cfg` deve ser considerada apenas se não houver desalinhamentos de esquema esperados e a tabela não contiver colunas adicionadas ou excluídas instantaneamente. A capacidade de importar sem um arquivo `.cfg` pode ser útil em cenários de recuperação de falhas onde os metadados não são acessíveis.

  Tentar importar uma tabela com colunas que foram adicionadas ou excluídas usando `ALGORITHM=INSTANT` sem usar um arquivo `.cfg` pode resultar em comportamento indefinido.

* No Windows, o `InnoDB` armazena os nomes de banco de dados, espaços de tabela e tabelas internamente em minúsculas. Para evitar problemas de importação em sistemas operacionais case-sensitive, como Linux e Unix, crie todos os bancos de dados, espaços de tabela e tabelas usando nomes em minúsculas. Uma maneira conveniente de garantir que os nomes sejam criados em minúsculas é definir `lower_case_table_names` para 1 antes de inicializar o servidor. (É proibido iniciar o servidor com uma configuração `lower_case_table_names` diferente da configuração usada quando o servidor foi inicializado.)

```
  [mysqld]
  lower_case_table_names=1
  ```

* Ao executar `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` e `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` em tabelas subpartidas, os nomes de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

##### Internals

As seguintes informações descrevem os internals e os mensagens escritas no log de erro durante um procedimento de importação de tabela.

Quando `ALTER TABLE ... DISCARD TABLESPACE` é executado na instância de destino:

* A tabela é bloqueada no modo X.
* O espaço de tabela é desvinculado da tabela.

Quando `FLUSH TABLES ... FOR EXPORT` é executado na instância de origem:

* A tabela sendo esvaziada para exportação é bloqueada no modo compartilhado.
* O fio de coordenador de purga é interrompido.
* As páginas sujas são sincronizadas com o disco.
* Os metadados da tabela são escritos no arquivo binário `.cfg`.

Mensagens de log de erro esperadas para esta operação:

```
[Note] InnoDB: Sync to disk of '"test"."t1"' started.
[Note] InnoDB: Stopping purge
[Note] InnoDB: Writing table metadata to './test/t1.cfg'
[Note] InnoDB: Table '"test"."t1"' flushed to disk
```

Quando `UNLOCK TABLES` é executado na instância de origem:

* O arquivo binário `.cfg` é excluído.
* O bloqueio compartilhado na tabela ou tabelas sendo importadas é liberado e o fio de coordenador de purga é reiniciado.

Mensagens de log de erro esperadas para esta operação:

```
[Note] InnoDB: Deleting the meta-data file './test/t1.cfg'
[Note] InnoDB: Resuming purge
```

Quando a instrução `ALTER TABLE ... IMPORT TABLESPACE` é executada na instância de destino, o algoritmo de importação realiza as seguintes operações para cada tablespace sendo importado:

* Cada página do tablespace é verificada quanto à corrupção.
* O ID de espaço e os números de sequência de log (LSNs) em cada página são atualizados.

* Os flags são validados e o LSN é atualizado para a página de cabeçalho.
* As páginas Btree são atualizadas.
* O estado da página é definido como sujo para que seja escrito no disco.

Mensagens de log de erro esperadas para esta operação:

```
[Note] InnoDB: Importing tablespace for table 'test/t1' that was exported
from host 'host_name'
[Note] InnoDB: Phase I - Update all pages
[Note] InnoDB: Sync to disk
[Note] InnoDB: Sync to disk - done!
[Note] InnoDB: Phase III - Flush changes to disk
[Note] InnoDB: Phase IV - Flush complete
```

Nota

Você também pode receber um aviso de que um tablespace é descartado (se você descartou o tablespace para a tabela de destino) e uma mensagem indicando que as estatísticas não puderam ser calculadas devido a um arquivo `.ibd` ausente:

```
[Warning] InnoDB: Table "test"."t1" tablespace is set as discarded.
7f34d9a37700 InnoDB: cannot calculate statistics for table
"test"."t1" because the .ibd file is missing. For help, please refer to
http://dev.mysql.com/doc/refman/en/innodb-troubleshooting.html
```