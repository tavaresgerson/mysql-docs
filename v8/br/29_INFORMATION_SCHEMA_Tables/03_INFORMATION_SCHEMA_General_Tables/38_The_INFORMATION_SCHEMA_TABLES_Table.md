### 28.3.38 A tabela INFORMATION\_SCHEMA TABLES

A tabela `TABLES` fornece informações sobre as tabelas nos bancos de dados.

As colunas no `TABLES` que representam estatísticas de tabela armazenam valores armazenados em cache. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabela armazenadas expirem. O padrão é de 86400 segundos (24 horas). Se não houver estatísticas armazenadas ou se as estatísticas expiraram, as estatísticas são recuperadas dos mecanismos de armazenamento ao fazer uma consulta às colunas de estatísticas de tabela. Para atualizar os valores armazenados em cache a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`. Para sempre recuperar as estatísticas mais recentes diretamente dos mecanismos de armazenamento, defina `information_schema_stats_expiry` para `0`. Para obter mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

Nota

Se a variável de sistema `innodb_read_only` estiver habilitada, o `ANALYZE TABLE` pode falhar porque ele não pode atualizar as tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, o erro pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

A tabela `TABLES` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `TABLE_NAME`

  O nome da tabela.

- `TABLE_TYPE`

  `BASE TABLE` para uma tabela, `VIEW` para uma visualização ou `SYSTEM VIEW` para uma tabela `INFORMATION_SCHEMA`.

  A tabela `TABLES` não lista as tabelas `TEMPORARY`.

- `ENGINE`

  O mecanismo de armazenamento para a tabela. Veja o Capítulo 17, *O Mecanismo de Armazenamento InnoDB*, e o Capítulo 18, *Mecanismos de Armazenamento Alternativos*.

  Para tabelas particionadas, `ENGINE` mostra o nome do motor de armazenamento usado por todas as partições.

- `VERSION`

  Esta coluna não é usada. Com a remoção dos arquivos `.frm` no MySQL 8.0, esta coluna agora reporta um valor hardcoded de `10`, que é a última versão do arquivo `.frm` usada no MySQL 5.7.

- `ROW_FORMAT`

  O formato de armazenamento em linha (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para as tabelas de `MyISAM`, `Dynamic` corresponde ao que o **myisamchk -dvv** relata como `Packed`.

- `TABLE_ROWS`

  O número de linhas. Alguns motores de armazenamento, como `MyISAM`, armazenam o número exato. Para outros motores de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar de até 40% a 50% do valor real. Nesses casos, use `SELECT COUNT(*)` para obter um contagem precisa.

  `TABLE_ROWS` é `NULL` para tabelas `INFORMATION_SCHEMA`.

  Para as tabelas `InnoDB`, o número de linhas é apenas uma estimativa aproximada usada na otimização do SQL. (Isso também é verdadeiro se a tabela `InnoDB` estiver particionada.)

- `AVG_ROW_LENGTH`

  O comprimento médio da linha.

- `DATA_LENGTH`

  Para `MyISAM`, `DATA_LENGTH` é o comprimento do arquivo de dados, em bytes.

  Para `InnoDB`, `DATA_LENGTH` é a quantidade aproximada de espaço alocado para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `MAX_DATA_LENGTH`

  Para `MyISAM`, `MAX_DATA_LENGTH` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, considerando o tamanho do ponteiro de dados utilizado.

  Não utilizado para `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `INDEX_LENGTH`

  Para `MyISAM`, `INDEX_LENGTH` é o comprimento do arquivo de índice, em bytes.

  Para `InnoDB`, `INDEX_LENGTH` é a quantidade aproximada de espaço alocado para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `DATA_FREE`

  O número de bytes alocados, mas não utilizados.

  As tabelas `InnoDB` relatam o espaço livre do tablespace ao qual a tabela pertence. Para uma tabela localizada no tablespace compartilhado, esse é o espaço livre do tablespace compartilhado. Se você estiver usando vários tablespaces e a tabela tiver seu próprio tablespace, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, pode ser possível inserir linhas, desde que novas extensões não precisem ser alocadas.

  Para o NDB Cluster, `DATA_FREE` indica o espaço alocado no disco para uma tabela ou fragmento de dados de disco, mas não utilizado por ela. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.)

  Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essas informações nesses casos é consultar a tabela `INFORMATION_SCHEMA` `PARTITIONS`, conforme mostrado neste exemplo:

  ```
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  Para obter mais informações, consulte a Seção 28.3.21, “A Tabela INFORMATION\_SCHEMA PARTITIONS”.

- `AUTO_INCREMENT`

  O próximo valor `AUTO_INCREMENT`.

- `CREATE_TIME`

  Quando a tabela foi criada.

- `UPDATE_TIME`

  Quando a tabela foi atualizada pela última vez. Para alguns motores de armazenamento, esse valor é `NULL`. Mesmo com o modo arquivo por tabela, cada tabela `InnoDB` em um arquivo `.ibd` separado, a mudança de buffer pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do tempo do último inserção, atualização ou exclusão. Para `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

  `UPDATE_TIME` exibe um valor de timestamp para o último `UPDATE`, `INSERT` ou `DELETE` realizado em tabelas `InnoDB` que não estão particionadas. Para MVCC, o valor do timestamp reflete o tempo `COMMIT`, que é considerado o último horário de atualização. Os timestamps não são persistentes quando o servidor é reiniciado ou quando a tabela é removida do cache do dicionário de dados `InnoDB`.

- `CHECK_TIME`

  Quando a tabela foi verificada pela última vez. Nem todos os motores de armazenamento são atualizados dessa vez, caso contrário, o valor é sempre `NULL`.

  Para tabelas `InnoDB` particionadas, `CHECK_TIME` é sempre `NULL`.

- `TABLE_COLLATION`

  A collation padrão da tabela. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

- `CHECKSUM`

  O valor do checksum ao vivo, se houver.

- `CREATE_OPTIONS`

  Opções extras usadas com `CREATE TABLE`.

  `CREATE_OPTIONS` mostra `partitioned` para uma tabela particionada.

  Antes do MySQL 8.0.16, `CREATE_OPTIONS` mostra a cláusula `ENCRYPTION` especificada para tabelas criadas em espaços de tabelas por arquivo. A partir do MySQL 8.0.16, ele mostra a cláusula de criptografia para espaços de tabelas por arquivo se a tabela estiver criptografada ou se a criptografia especificada for diferente da criptografia do esquema. A cláusula de criptografia não é mostrada para tabelas criadas em espaços de tabelas gerais. Para identificar espaços de tabelas criptografados por arquivo e gerais, consulte a coluna `INNODB_TABLESPACES` `ENCRYPTION`.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é reportado na coluna `ROW_FORMAT`. `CREATE_OPTIONS` mostra o formato de linha que foi especificado na declaração `CREATE TABLE`.

  Ao alterar o mecanismo de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo mecanismo de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o mecanismo de armazenamento original, se necessário. A coluna `CREATE_OPTIONS` pode exibir opções mantidas.

- `TABLE_COMMENT`

  O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

#### Notas

- Para as tabelas `NDB`, o resultado desta declaração mostra valores apropriados para as colunas `AVG_ROW_LENGTH` e `DATA_LENGTH`, com a exceção de que as colunas `BLOB` não são consideradas.

- Para as tabelas `NDB`, `DATA_LENGTH` inclui dados armazenados apenas na memória principal; as colunas `MAX_DATA_LENGTH` e `DATA_FREE` se aplicam aos dados em disco.

- Para as tabelas de dados de disco do NDB Cluster, `MAX_DATA_LENGTH` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento de Dados de Disco. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.)

- Para as tabelas `MEMORY`, os valores `DATA_LENGTH`, `MAX_DATA_LENGTH` e `INDEX_LENGTH` aproximam a quantidade real de memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

- Em relação às visualizações, a maioria das colunas `TABLES` é 0 ou `NULL`, exceto que `TABLE_NAME` indica o nome da visualização, `CREATE_TIME` indica a hora de criação e `TABLE_COMMENT` diz `VIEW`.

As informações sobre a tabela também estão disponíveis nas declarações `SHOW TABLE STATUS` e `SHOW TABLES`. Veja a Seção 15.7.7.38, “Declaração SHOW TABLE STATUS”, e a Seção 15.7.7.39, “Declaração SHOW TABLES”. As seguintes declarações são equivalentes:

```
SELECT
    TABLE_NAME, ENGINE, VERSION, ROW_FORMAT, TABLE_ROWS, AVG_ROW_LENGTH,
    DATA_LENGTH, MAX_DATA_LENGTH, INDEX_LENGTH, DATA_FREE, AUTO_INCREMENT,
    CREATE_TIME, UPDATE_TIME, CHECK_TIME, TABLE_COLLATION, CHECKSUM,
    CREATE_OPTIONS, TABLE_COMMENT
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW TABLE STATUS
  FROM db_name
  [LIKE 'wild']
```

As seguintes afirmações são equivalentes:

```
SELECT
  TABLE_NAME, TABLE_TYPE
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW FULL TABLES
  FROM db_name
  [LIKE 'wild']
```
