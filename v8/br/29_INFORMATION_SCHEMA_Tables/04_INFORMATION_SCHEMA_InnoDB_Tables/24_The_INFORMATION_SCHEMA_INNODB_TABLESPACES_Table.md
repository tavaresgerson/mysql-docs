### 28.4.24 A tabela INFORMATION\_SCHEMA INNODB\_TABLESPACES

A tabela `INNODB_TABLESPACES` fornece metadados sobre os espaços de tabela `InnoDB` de arquivo por tabela, gerais e de desfazer.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Tabelas de Objetos do Schema InnoDB INFORMATION\_SCHEMA”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário global e os espaços de tabela de desfazer.

A tabela `INNODB_TABLESPACES` tem essas colunas:

- `SPACE`

  O ID do espaço de tabelas.

- `NAME`

  O esquema (banco de dados) e o nome da tabela.

- `FLAG`

  Um valor numérico que representa informações de nível de bits sobre o formato do espaço de tabela e as características de armazenamento.

- `ROW_FORMAT`

  O formato da linha do espaço de tabelas (`Compact or Redundant`, `Dynamic` ou `Compressed`, ou `Undo`). Os dados nesta coluna são interpretados a partir das informações da bandeira do espaço de tabelas que residem no arquivo de dados.

  Não é possível determinar, a partir dessa informação da bandeira, se o formato da linha do tablespace é `Redundant` ou `Compact`, e é por isso que um dos possíveis valores de `ROW_FORMAT` é `Compact or Redundant`.

- `PAGE_SIZE`

  O tamanho da página do espaço de tabelas. Os dados nesta coluna são interpretados a partir das informações das flags do espaço de tabelas que residem no arquivo `.ibd`.

- `ZIP_PAGE_SIZE`

  Tamanho da página do tablespace zip. Os dados nesta coluna são interpretados a partir das informações das flags do tablespace que residem no arquivo `.ibd`.

- `SPACE_TYPE`

  O tipo de espaço de tabelas. Os valores possíveis incluem `General` para espaços de tabelas gerais, `Single` para espaços de tabelas por arquivo, `System` para o espaço de tabelas do sistema e `Undo` para espaços de tabelas de desfazer.

- `FS_BLOCK_SIZE`

  O tamanho do bloco do sistema de arquivos, que é o tamanho da unidade usada para perfuração de furos. Esta coluna diz respeito ao recurso de `InnoDB` de compressão transparente da página.

- `FILE_SIZE`

  O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, não compactado. Esta coluna refere-se ao recurso de compressão transparente da página `InnoDB`.

- `ALLOCATED_SIZE`

  O tamanho real do arquivo, que é a quantidade de espaço alocado no disco. Esta coluna se refere ao recurso de compressão de página transparente `InnoDB`.

- `AUTOEXTEND_SIZE`

  O tamanho automático de expansão do espaço de tabela. Esta coluna foi adicionada no MySQL 8.0.23.

- `SERVER_VERSION`

  A versão do MySQL que criou o espaço de tabelas ou a versão do MySQL na qual o espaço de tabelas foi importado ou a versão da última atualização importante da versão do MySQL. O valor não é alterado por uma atualização da série de lançamentos, como uma atualização do MySQL 8.0.`x` para 8.0.`y`. O valor pode ser considerado um marcador de "criação" ou um marcador "certificado" para o espaço de tabelas.

- `SPACE_VERSION`

  A versão do tablespace, usada para acompanhar as alterações no formato do tablespace.

- `ENCRYPTION`

  Se o espaço de tabelas está criptografado. Esta coluna foi adicionada no MySQL 8.0.13.

- `STATE`

  O estado do espaço de tabela. Esta coluna foi adicionada no MySQL 8.0.14.

  Para arquivos por tabela e espaços de tabela gerais, os estados incluem:

  - `normal`: O espaço de tabelas está normal e ativo.

  - `discarded`: O tablespace foi descartado por uma declaração `ALTER TABLE ... DISCARD TABLESPACE`.

  - `corrupted`: O tablespace é identificado pelo `InnoDB` como corrompido.

  Para tabelas espaços de desfazer, os estados incluem:

  - `active`: Os segmentos de rollback no espaço de tabela de desfazer podem ser alocados para novas transações.

  - `inactive`: Os segmentos de rollback no espaço de tabelas de desfazer não são mais usados por novas transações. O processo de truncar está em andamento. O espaço de tabelas de desfazer foi selecionado pelo fio de purga implicitamente ou foi tornado inativo por uma declaração `ALTER UNDO TABLESPACE ... SET INACTIVE`.

  - `empty`: O espaço de tabela de desfazer foi truncado e não está mais ativo. Está pronto para ser excluído ou reativado novamente por uma instrução `ALTER UNDO TABLESPACE ... SET INACTIVE`.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE SPACE = 26\G
*************************** 1. row ***************************
         SPACE: 26
          NAME: test/t1
          FLAG: 0
    ROW_FORMAT: Compact or Redundant
     PAGE_SIZE: 16384
 ZIP_PAGE_SIZE: 0
    SPACE_TYPE: Single
 FS_BLOCK_SIZE: 4096
     FILE_SIZE: 98304
ALLOCATED_SIZE: 65536
AUTOEXTEND_SIZE: 0
SERVER_VERSION: 8.0.23
 SPACE_VERSION: 1
    ENCRYPTION: N
         STATE: normal
```

#### Notas

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
