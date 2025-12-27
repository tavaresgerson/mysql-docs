### 28.4.24 A Tabela `INFORMATION_SCHEMA INNODB_TABLESPACES`

A tabela `INNODB_TABLESPACES` fornece metadados sobre os espaços de tabelas `InnoDB` por arquivo por tabela, gerais e de recuperação.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de esquema do esquema `INFORMATION_SCHEMA`”.

Observação

A tabela `FILES` do `INFORMATION_SCHEMA` relata metadados para tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário global e espaços de tabela de recuperação.

A tabela `INNODB_TABLESPACES` tem as seguintes colunas:

* `SPACE`

  O ID do espaço de tabela.

* `NAME`

  O nome do esquema (banco de dados) e da tabela.

* `FLAG`

  Um valor numérico que representa informações de nível de bit sobre o formato do espaço de tabela e as características de armazenamento.

* `ROW_FORMAT`

  O formato de linha do espaço de tabela (`Compact ou Redundant`, `Dynamic` ou `Compressed`, ou `Undo`). Os dados nesta coluna são interpretados a partir das informações do sinalizador de espaço de tabela que residem no arquivo de dados.

Não há como determinar a partir dessas informações do sinalizador se o formato de linha do espaço de tabela é `Redundant` ou `Compact`, é por isso que um dos valores possíveis de `ROW_FORMAT` é `Compact ou Redundant`.

* `PAGE_SIZE`

  O tamanho da página do espaço de tabela. Os dados nesta coluna são interpretados a partir das informações dos sinais do espaço de tabela que residem no arquivo `.ibd`.

* `ZIP_PAGE_SIZE`

  O tamanho da página de zip do espaço de tabela. Os dados nesta coluna são interpretados a partir das informações dos sinais do espaço de tabela que residem no arquivo `.ibd`.

* `SPACE_TYPE`

  O tipo de espaço de tabela. Os valores possíveis incluem `General` para espaços de tabela gerais, `Single` para espaços de tabela por arquivo, `System` para o espaço de tabela do sistema e `Undo` para espaços de tabela de recuperação.

* `FS_BLOCK_SIZE`

O tamanho do bloco do sistema de arquivos, que é o tamanho da unidade usado para perfuração de furos. Esta coluna diz respeito ao recurso de compressão transparente de páginas do `InnoDB`.

* `FILE_SIZE`

  O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, não comprimido. Esta coluna diz respeito ao recurso de compressão transparente de páginas do `InnoDB`.

* `ALLOCATED_SIZE`

  O tamanho real do arquivo, que é a quantidade de espaço alocado no disco. Esta coluna diz respeito ao recurso de compressão transparente de páginas do `InnoDB`.

* `AUTOEXTEND_SIZE`

  O tamanho de autoextensão do espaço de tabelas.

* `SERVER_VERSION`

  A versão do MySQL que criou o espaço de tabelas, ou a versão do MySQL na qual o espaço de tabelas foi importado, ou a versão da última atualização importante da versão do MySQL. O valor não é alterado por uma atualização da série de lançamento, como uma atualização de MySQL 8.4.*`x`* para 8.4.*`y`*. O valor pode ser considerado um marcador de "criação" ou um marcador de "certificado" para o espaço de tabelas.

* `SPACE_VERSION`

  A versão do espaço de tabelas, usada para rastrear alterações no formato do espaço de tabelas.

* `ENCRYPTION`

  Se o espaço de tabelas está criptografado.

* `STATE`

  O estado do espaço de tabelas.

  Para espaços de tabelas por arquivo e espaços de tabelas gerais, os estados incluem:

  + `normal`: O espaço de tabelas está normal e ativo.

  + `discarded`: O espaço de tabelas foi descartado por uma declaração `ALTER TABLE ... DISCARD TABLESPACE`.

  + `corrupted`: O espaço de tabelas é identificado pelo `InnoDB` como corrompido.

  Para espaços de tabelas de desfazer, os estados incluem:

  + `active`: Segmentos de rollback no espaço de tabelas de desfazer podem ser alocados para novas transações.

+ `inactive`: Os segmentos de rollback no espaço de tabelas de desfazer deixam de ser usados por novas transações. O processo de truncação está em andamento. O espaço de tabelas de desfazer foi selecionado implicitamente pelo fio de purga ou foi tornado inativo por uma instrução `ALTER UNDO TABLESPACE ... SET INACTIVE`.

+ `empty`: O espaço de tabelas de desfazer foi truncado e deixou de ser ativo. Está pronto para ser removido ou reativado por uma instrução `ALTER UNDO TABLESPACE ... SET INACTIVE`.

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
SERVER_VERSION: 8.4.0
 SPACE_VERSION: 1
    ENCRYPTION: N
         STATE: normal
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.