#### 14.6.1.3 Impor tabelas InnoDB

Esta seção descreve como importar tabelas usando o recurso *Transportable Tablespaces*, que permite importar tabelas, tabelas particionadas ou partições individuais de tabelas que residem em espaços de tabelas por arquivo. Existem várias razões pelas quais você pode querer importar tabelas:

- Para executar relatórios em uma instância de servidor MySQL não produtiva para evitar sobrecarregar um servidor produtivo.

- Para copiar dados para um novo servidor de replicação.

- Para restaurar uma tabela a partir de um arquivo de espaço de tabela protegido.

- Como uma maneira mais rápida de mover dados do que importar um arquivo de dump, que requer a reinserção de dados e a reconstrução de índices.

- Para transferir dados para um servidor com um meio de armazenamento mais adequado às suas necessidades de armazenamento. Por exemplo, você pode transferir tabelas com muitas linhas para um dispositivo SSD ou transferir tabelas grandes para um dispositivo de HD de alta capacidade.

O recurso *Tabelasespaços Transportadoras* é descrito nos seguintes tópicos desta seção:

- Pré-requisitos
- Importar tabelas
- Importar tabelas particionadas
- Impor Partições de Mesa
- Limitações
- Observações de uso
- Interiores

##### Pré-requisitos

- A variável `innodb_file_per_table` deve estar habilitada, o que é o caso por padrão.

- O tamanho da página do espaço de tabelas deve corresponder ao tamanho da página da instância do servidor MySQL de destino. O tamanho da página do `InnoDB` é definido pela variável `innodb_page_size`, que é configurada ao inicializar uma instância do servidor MySQL.

- Se a tabela tiver uma relação de chave estrangeira, `foreign_key_checks` deve ser desativado antes de executar `DISCARD TABLESPACE`. Além disso, você deve exportar todas as tabelas relacionadas à chave estrangeira no mesmo ponto lógico, pois `ALTER TABLE ... IMPORT TABLESPACE` não aplica restrições de chave estrangeira aos dados importados. Para fazer isso, pare de atualizar as tabelas relacionadas, commit todas as transações, adquira bloqueios compartilhados nas tabelas e realize as operações de exportação.

- Ao importar uma tabela de outra instância do servidor MySQL, ambas as instâncias do servidor MySQL devem ter o status de Disponibilidade Geral (GA) e devem ser da mesma versão. Caso contrário, a tabela deve ser criada na mesma instância do servidor MySQL na qual está sendo importada.

- Se a tabela foi criada em um diretório externo especificando a cláusula `DATA DIRECTORY` na instrução `CREATE TABLE`, a tabela que você substitui na instância de destino deve ser definida com a mesma cláusula `DATA DIRECTORY`. Um erro de incompatibilidade de esquema é exibido se as cláusulas não corresponderem. Para determinar se a tabela de origem foi definida com uma cláusula `DATA DIRECTORY`, use `SHOW CREATE TABLE` para visualizar a definição da tabela. Para obter informações sobre o uso da cláusula `DATA DIRECTORY`, consulte a Seção 14.6.1.2, “Criando Tabelas Externamente”.

- Se uma opção `ROW_FORMAT` não for definida explicitamente na definição da tabela ou se `ROW_FORMAT=DEFAULT` for usada, o ajuste `innodb_default_row_format` deve ser o mesmo nas instâncias de origem e destino. Caso contrário, um erro de incompatibilidade de esquema será relatado quando você tentar a operação de importação. Use `SHOW CREATE TABLE` para verificar a definição da tabela. Use `SHOW VARIABLES` para verificar o ajuste `innodb_default_row_format`. Para informações relacionadas, consulte Definindo o Formato de Linha de uma Tabela.

##### Importar tabelas

Este exemplo demonstra como importar uma tabela comum não particionada que reside em um espaço de tabelas por arquivo.

1. Na instância de destino, crie uma tabela com a mesma definição da tabela que você pretende importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será exibido quando você tentar a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   ```

2. Na instância de destino, descarte o tablespace da tabela que você acabou de criar. (Antes de importar, você deve descartar o tablespace da tabela receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela em estado de repouso, que você pretende importar. Quando uma tabela é colocada em estado de repouso, apenas transações de leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... PARA EXPOR` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária da tabela possa ser feita enquanto o servidor estiver em execução. Quando `FLUSH TABLES ... PARA EXPOR` é executado, o `InnoDB` gera um arquivo de metadados `.cfg` no diretório do esquema da tabela. O arquivo `.cfg` contém metadados que são usados para verificação do esquema durante a operação de importação.

   Nota

   A conexão que executa `FLUSH TABLES ... FOR EXPORT` deve permanecer aberta enquanto a operação estiver em execução; caso contrário, o arquivo `.cfg` será removido, pois os bloqueios são liberados ao fechar a conexão.

4. Copie o arquivo `.ibd` e o arquivo de metadados `.cfg` da instância de origem para a instância de destino. Por exemplo:

   ```sql
   $> scp /path/to/datadir/test/t1.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

   O arquivo `.ibd` e o arquivo `.cfg` devem ser copiados antes de liberar as bloquagens compartilhadas, conforme descrito no próximo passo.

   Nota

   Se você estiver importando uma tabela de um espaço de tabelas criptografado, o `InnoDB` gera um arquivo `.cfp` além de um arquivo de metadados `.cfg`. O arquivo `.cfp` deve ser copiado para a instância de destino junto com o arquivo `.cfg`. O arquivo `.cfp` contém uma chave de transferência e uma chave de espaço de tabelas criptografada. Durante a importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabelas. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de Dados em Repouso do \`InnoDB’”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as bloqueadas adquiridas pela instrução `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

   A operação `UNLOCK TABLES` também remove o arquivo `.cfg`.

6. Na instância de destino, importe o espaço de tabelas:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Importar tabelas particionadas

Este exemplo demonstra como importar uma tabela particionada, onde cada partição da tabela reside em um espaço de tabelas por arquivo.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada que você deseja importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será exibido quando você tentar a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 3;
   ```

   No diretório `/datadir/test`, há um arquivo `.ibd` de espaço de tabelas para cada uma das três partições.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd
   ```

2. Na instância de destino, descarte o tablespace da tabela particionada. (Antes da operação de importação, você deve descartar o tablespace da tabela receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

   Os três arquivos de espaço de tabela `.ibd` da tabela particionada são descartados do diretório `/datadir/test`, deixando os seguintes arquivos:

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada que você pretende importar em estado de repouso. Quando uma tabela é colocada em repouso, apenas transações de leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária do esquema possa ser feita enquanto o servidor estiver em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera arquivos de metadados `.cfg` no diretório do esquema do arquivo do espaço de tabela de cada tabela.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd
   t1.frm  t1#P#p0.cfg  t1#P#p1.cfg  t1#P#p2.cfg
   ```

   Os arquivos `.cfg` contêm metadados que são usados para verificação de esquema ao importar o espaço de tabelas. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, não nas partições individuais da tabela.

4. Copie os arquivos `.ibd` e `.cfg` do diretório do esquema da instância de origem para o diretório do esquema da instância de destino. Por exemplo:

   ```sql
   $>scp /path/to/datadir/test/t1*.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

   Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar as bloquagens compartilhadas, conforme descrito no próximo passo.

   Nota

   Se você estiver importando uma tabela de um espaço de tabelas criptografado, o `InnoDB` gera arquivos `.cfp` além dos arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino juntamente com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de espaço de tabelas criptografada. Durante a importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabelas. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de Dados em Repouso do \`InnoDB’”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as bloqueadas adquiridas por `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe o espaço de tabelas da tabela particionada:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Impor Partições de Mesa

Este exemplo demonstra como importar partições individuais de tabelas, onde cada partição reside em um arquivo de espaço de tabela por tabela.

No exemplo a seguir, duas partições (`p2` e `p3`) de uma tabela de quatro partições são importadas.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada da qual você deseja importar as partições. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`.) Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será exibido quando você tentar a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 4;
   ```

   No diretório `/datadir/test`, há um arquivo `.ibd` de espaço de tabelas para cada uma das quatro partições.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd t1#P#p3.ibd
   ```

2. Na instância de destino, descarte as partições que você pretende importar da instância de origem. (Antes de importar as partições, você deve descartar as partições correspondentes da tabela particionada de destino.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
   ```

   Os arquivos de espaço de tabela `.ibd` das duas partições descartadas são removidos do diretório `/datadir/test` na instância de destino, deixando os seguintes arquivos:

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd
   ```

   Nota

   Quando a instrução `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` é executada em tabelas subpartidas, os nomes de tabelas de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada em estado de repouso. Quando uma tabela é colocada em estado de repouso, apenas transações de leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

   `FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária do espaço de tabela possa ser feita enquanto a instância estiver em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, o `InnoDB` gera um arquivo de metadados `.cfg` para cada um dos arquivos de espaço de tabela da tabela no diretório do esquema da tabela.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd t1#P#p3.ibd
   t1.frm  t1#P#p0.cfg  t1#P#p1.cfg  t1#P#p2.cfg t1#P#p3.cfg
   ```

   Os arquivos `.cfg` contêm metadados que são usados para verificação de esquema durante a operação de importação. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, não nas partições individuais da tabela.

4. Copie os arquivos `.ibd` e `.cfg` para a partição `p2` e a partição `p3` do diretório do esquema da instância de origem para o diretório do esquema da instância de destino.

   ```sql
   $> scp t1#P#p2.ibd t1#P#p2.cfg t1#P#p3.ibd t1#P#p3.cfg destination-server:/path/to/datadir/test
   ```

   Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar as bloquagens compartilhadas, conforme descrito no próximo passo.

   Nota

   Se você estiver importando partições de um espaço de tabelas criptografado, o `InnoDB` gera arquivos `.cfp` além dos arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino juntamente com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de espaço de tabelas criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabelas. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de Dados em Repouso do \`InnoDB’”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as bloqueadas adquiridas por `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe as partições da tabela `p2` e `p3`:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
   ```

   Nota

   Quando a instrução `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` é executada em tabelas subpartidas, os nomes de tabelas de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

##### Limitações

- O recurso *Tabelas Transportadoras* só é suportado para tabelas que residem em espaços de tabelas por arquivo. Não é suportado para tabelas que residem no espaço de tabelas do sistema ou em espaços de tabelas gerais. Tabelas em espaços de tabelas compartilhados não podem ser colocadas em estado de repouso.

- `FLUSH TABLES ... FOR EXPORT` não é suportado em tabelas com um índice `FULLTEXT`, pois as tabelas auxiliares de pesquisa full-text não podem ser limpas. Após importar uma tabela com um índice `FULLTEXT`, execute `OPTIMIZE TABLE` para reconstruir os índices `FULLTEXT`. Como alternativa, exclua os índices `FULLTEXT` antes da operação de exportação e recree os índices após importar a tabela na instância de destino.

- Devido a uma limitação no arquivo de metadados `.cfg`, os desalinhamentos de esquema não são relatados para diferenças no tipo de partição ou na definição de partição ao importar uma tabela particionada. As diferenças de coluna são relatadas.

##### Observações de uso

- A instrução `ALTER TABLE ... IMPORT TABLESPACE` não requer um arquivo de metadados `.cfg` para importar uma tabela. No entanto, os verificações de metadados não são realizadas ao importar sem um arquivo `.cfg`, e um aviso semelhante ao seguinte é emitido:

  ```sql
  Message: InnoDB: IO Read error: (2, No such file or directory) Error opening '.\
  test\t.cfg', will attempt to import without schema verification
  1 row in set (0.00 sec)
  ```

  A importação de uma tabela sem um arquivo de metadados `.cfg` deve ser considerada apenas se não se espera nenhum desajuste no esquema. A capacidade de importar sem um arquivo `.cfg` pode ser útil em cenários de recuperação de falhas em que os metadados não estão acessíveis.

- No Windows, o `InnoDB` armazena os nomes de banco de dados, espaços de tabela e tabelas internamente em minúsculas. Para evitar problemas de importação em sistemas operacionais case-sensitive, como Linux e Unix, crie todos os bancos de dados, espaços de tabela e tabelas usando nomes em minúsculas. Uma maneira conveniente de realizar isso é adicionar `lower_case_table_names=1` à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar bancos de dados, espaços de tabela ou tabelas:

  ```sql
  [mysqld]
  lower_case_table_names=1
  ```

- Ao executar `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` e `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` em tabelas subpartidas, os nomes de tabelas de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

##### Interiores

As informações a seguir descrevem os elementos internos e as mensagens escritas no log de erro durante um procedimento de importação de tabela.

Quando a instrução `ALTER TABLE ... DISCARD TABLESPACE` é executada na instância de destino:

- A tabela está bloqueada no modo X.
- O espaço de tabela está desvinculado da tabela.

Quando o comando `FLUSH TABLES ... FOR EXPORT` é executado na instância de origem:

- A tabela que está sendo limpa para exportação está bloqueada no modo compartilhado.
- O fio do coordenador da purga foi interrompido.
- As páginas sujas são sincronizadas com o disco.
- Os metadados da tabela são escritos no arquivo binário `.cfg`.

Mensagens esperadas de log de erro para esta operação:

```sql
[Note] InnoDB: Sync to disk of '"test"."t1"' started.
[Note] InnoDB: Stopping purge
[Note] InnoDB: Writing table metadata to './test/t1.cfg'
[Note] InnoDB: Table '"test"."t1"' flushed to disk
```

Quando o comando `UNLOCK TABLES` é executado na instância de origem:

- O arquivo binário `.cfg` é excluído.
- O bloqueio compartilhado da(s) tabela(s) sendo importada(s) é liberado e o fio do coordenador de purga é reiniciado.

Mensagens esperadas de log de erro para esta operação:

```sql
[Note] InnoDB: Deleting the meta-data file './test/t1.cfg'
[Note] InnoDB: Resuming purge
```

Quando a instrução `ALTER TABLE ... IMPORT TABLESPACE` é executada na instância de destino, o algoritmo de importação realiza as seguintes operações para cada tablespace que está sendo importado:

- Cada página do espaço de tabela é verificada quanto à corrupção.

- Os IDs de espaço e os números de sequência de log (LSNs) em cada página são atualizados.

- As bandeiras são validadas e o LSN é atualizado para a página de cabeçalho.

- As páginas Btree foram atualizadas.

- O estado da página está definido como sujo para que ela seja escrita no disco.

Mensagens esperadas de log de erro para esta operação:

```sql
[Note] InnoDB: Importing tablespace for table 'test/t1' that was exported
from host 'host_name'
[Note] InnoDB: Phase I - Update all pages
[Note] InnoDB: Sync to disk
[Note] InnoDB: Sync to disk - done!
[Note] InnoDB: Phase III - Flush changes to disk
[Note] InnoDB: Phase IV - Flush complete
```

Nota

Você também pode receber um aviso de que um espaço de tabela foi descartado (se você descartou o espaço de tabela para a tabela de destino) e uma mensagem indicando que as estatísticas não puderam ser calculadas devido ao arquivo `.ibd` ausente:

```sql
[Warning] InnoDB: Table "test"."t1" tablespace is set as discarded.
7f34d9a37700 InnoDB: cannot calculate statistics for table
"test"."t1" because the .ibd file is missing. For help, please refer to
http://dev.mysql.com/doc/refman/5.7/en/innodb-troubleshooting.html
```
