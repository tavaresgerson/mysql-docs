### 24.3.25 A tabela INFORMATION\_SCHEMA TABLES

A tabela `TABLES` fornece informações sobre as tabelas nos bancos de dados.

A tabela `TABLES` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `NOME_TABELA`

  O nome da tabela.

- `TABLE_TYPE`

  `BASE TABLE` para uma tabela, `VIEW` para uma visualização ou `SYSTEM VIEW` para uma tabela do `INFORMATION_SCHEMA`.

  A tabela `TABLES` não lista tabelas `TEMPORARY`.

- `MOTOR`

  O mecanismo de armazenamento para a tabela. Veja Capítulo 14, *O Mecanismo de Armazenamento InnoDB* e Capítulo 15, *Mecanismos de Armazenamento Alternativos*.

  Para tabelas particionadas, o `ENGINE` mostra o nome do mecanismo de armazenamento usado por todas as partições.

- `VERSÃO`

  O número da versão do arquivo `.frm` da tabela.

- `ROW_FORMAT`

  O formato de armazenamento em linha (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para as tabelas `MyISAM`, `Dynamic` corresponde ao que o **myisamchk -dvv** relata como `Packed`. O formato de tabela `InnoDB` é `Redundant` ou `Compact` ao usar o formato de arquivo `Antelope`, ou `Compressed` ou `Dynamic` ao usar o formato de arquivo `Barracuda`.

- `TABELA_LINHAS`

  O número de linhas. Alguns motores de armazenamento, como `MyISAM`, armazenam o número exato. Para outros motores de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar de até 40% a 50% do valor real. Nesses casos, use `SELECT COUNT(*)` para obter um contagem precisa.

  `TABLE_ROWS` é `NULL` para as tabelas do `INFORMATION_SCHEMA`.

  Para as tabelas de `InnoDB`, o número de linhas é apenas uma estimativa aproximada usada na otimização do SQL. (Isso também é verdadeiro se a tabela de `InnoDB` estiver particionada.)

- `AVG_ROW_LENGTH`

  O comprimento médio da linha.

  Consulte as notas no final desta seção para obter informações relacionadas.

- `DATA_LENGTH`

  Para `MyISAM`, `DATA_LENGTH` é o comprimento do arquivo de dados, em bytes.

  Para o `InnoDB`, `DATA_LENGTH` é a quantidade aproximada de espaço alocada para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `MAX_DATA_LENGTH`

  Para `MyISAM`, `MAX_DATA_LENGTH` é o comprimento máximo do arquivo de dados. Esse é o número total de bytes de dados que podem ser armazenados na tabela, considerando o tamanho do ponteiro de dados utilizado.

  Não utilizado para `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `INDEX_LENGTH`

  Para `MyISAM`, `INDEX_LENGTH` é o tamanho do arquivo de índice, em bytes.

  Para o `InnoDB`, `INDEX_LENGTH` é a quantidade aproximada de espaço alocada para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `DATA_FREE`

  O número de bytes alocados, mas não utilizados.

  As tabelas `InnoDB` relatam o espaço livre do tablespace ao qual a tabela pertence. Para uma tabela localizada no tablespace compartilhado, esse é o espaço livre do tablespace compartilhado. Se você estiver usando vários tablespaces e a tabela tiver seu próprio tablespace, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, pode ser possível inserir linhas, desde que novas extensões não precisem ser alocadas.

  Para o NDB Cluster, `DATA_FREE` indica o espaço alocado no disco para uma tabela ou fragmento de dados de disco, mas não utilizado por ela. (O uso do recurso de dados na memória é relatado pela coluna `DATA_LENGTH`.)

  Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essas informações nesses casos é consultar a tabela `INFORMATION_SCHEMA [`PARTITIONS\`]\(information-schema-partitions-table.html), conforme mostrado neste exemplo:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  Para mais informações, consulte Seção 24.3.16, “A Tabela INFORMATION\_SCHEMA PARTITIONS”.

- `AUTO_INCREMENT`

  O próximo valor `AUTO_INCREMENT`.

- `CREATE_TIME`

  Quando a tabela foi criada.

- `UPDATE_TIME`

  Quando o arquivo de dados foi atualizado pela última vez. Para alguns motores de armazenamento, esse valor é `NULL`. Por exemplo, o `InnoDB` armazena várias tabelas em seu espaço de tabelas do sistema e o timestamp do arquivo de dados não se aplica. Mesmo com o modo arquivo por tabela com cada tabela `InnoDB` em um arquivo `.ibd` separado, a alteração de bufferização pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do tempo da última inserção, atualização ou exclusão. Para o `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

  `UPDATE_TIME` exibe um valor de marca d'água para a última atualização (`UPDATE`) realizada nas tabelas `InnoDB` que não estão particionadas. Para o MVCC, o valor de marca d'água reflete o horário do `COMMIT`, que é considerado o último horário de atualização. Os valores de marca d'água não são persistentes quando o servidor é reiniciado ou quando a tabela é removida do cache do dicionário de dados `InnoDB`.

  A coluna `UPDATE_TIME` também exibe essa informação para tabelas `InnoDB` particionadas.

- `CHECK_TIME`

  Quando a tabela foi verificada pela última vez. Nem todos os motores de armazenamento são atualizados dessa vez, caso contrário, o valor é sempre `NULL`.

  Para tabelas particionadas de `InnoDB`, `CHECK_TIME` é sempre `NULL`.

- `TABLE_COLLATION`

  A collation padrão da tabela. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

- `CHECKSUM`

  O valor do checksum ao vivo, se houver.

- `CREATE_OPTIONS`

  Opções extras usadas com `CREATE TABLE`.

  `CREATE_OPTIONS` mostra `partitioned` se a tabela estiver particionada.

  `CREATE_OPTIONS` mostra a cláusula `ENCRYPTION` especificada para tabelas criadas em espaços de tabelas por arquivo.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `ROW_FORMAT`. `CREATE_OPTIONS` mostra o formato de linha que foi especificado na instrução `CREATE TABLE`.

  Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. A coluna `CREATE_OPTIONS` pode exibir opções retidas.

- `TABELA_COMENTÁRIO`

  O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

#### Notas

- Para as tabelas `NDB`, o resultado desta declaração mostra valores apropriados para as colunas `AVG_ROW_LENGTH` e `DATA_LENGTH`, com a exceção de que as colunas `BLOB` não são consideradas.

- Para as tabelas ``NDB`, `DATA\_LENGTH`inclui dados armazenados apenas na memória principal; as colunas`MAX\_DATA\_LENGTH`e`DATA\_FREE\` se aplicam aos dados em disco.

- Para as tabelas de dados de disco do NDB Cluster, o `MAX_DATA_LENGTH` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento de Dados de Disco. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.)

- Para as tabelas `MEMORY`, os valores `DATA_LENGTH`, `MAX_DATA_LENGTH` e `INDEX_LENGTH` aproximam a quantidade real de memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

- Para as visualizações, todas as colunas do `TABLES` são `NULL`, exceto que `TABLE_NAME` indica o nome da visualização e `TABLE_COMMENT` diz `VIEW`.

As informações sobre a tabela também estão disponíveis nas declarações `SHOW TABLE STATUS` e `SHOW TABLES`. Veja Seção 13.7.5.36, “Declaração SHOW TABLE STATUS” e Seção 13.7.5.37, “Declaração SHOW TABLES”. As seguintes declarações são equivalentes:

```sql
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

```sql
SELECT
  TABLE_NAME, TABLE_TYPE
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW FULL TABLES
  FROM db_name
  [LIKE 'wild']
```
