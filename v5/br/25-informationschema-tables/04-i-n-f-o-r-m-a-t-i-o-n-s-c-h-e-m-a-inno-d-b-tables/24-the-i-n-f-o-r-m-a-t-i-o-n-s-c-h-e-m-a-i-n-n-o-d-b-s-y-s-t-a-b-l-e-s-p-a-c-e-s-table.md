### 24.4.24 A tabela INFORMATION_SCHEMA INNODB_SYS_TABLESPACES

A tabela [`INNODB_SYS_TABLESPACES`](https://docs.oracle.com/en/database/sql/information-schema/sql/innodb_sys_tablespaces.html) fornece metadados sobre os espaços de tabelas `InnoDB` por arquivo e espaços de tabelas gerais, equivalentes às informações na tabela `SYS_TABLESPACES` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para todos os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário e os espaços de tabela de rollback, se presentes.

A tabela [`INNODB_SYS_TABLESPACES`](https://docs.oracle.com/en/database/sql/information-schema/sql/innodb_sys_tablespaces.html) tem as seguintes colunas:

- `ESPACO`

  O ID do espaço de tabelas.

- `NOME`

  O esquema (banco de dados) e o nome da tabela.

- `FLAG`

  Um valor numérico que representa informações de nível de bits sobre o formato do espaço de tabela e as características de armazenamento.

- `FORMATO_ARQUIVO`

  O formato do arquivo de tablespace. Por exemplo, Antelope, Barracuda ou `Any` (espaços de tabelas gerais suportam qualquer formato de linha). Os dados neste campo são interpretados a partir das informações das flags do tablespace que residem no arquivo .ibd. Para obter mais informações sobre os formatos de arquivo do `InnoDB`, consulte Seção 14.10, “Gestão de Formatos de Arquivo InnoDB”.

- `ROW_FORMAT`

  O formato da linha do espaço de tabelas (`Compacto ou Redundante`, `Dinâmico` ou `Compactado`). Os dados nesta coluna são interpretados a partir das informações das bandeiras do espaço de tabelas que residem no arquivo `.ibd`.

- `PAGE_SIZE`

  O tamanho da página do espaço de tabelas. Os dados nesta coluna são interpretados a partir das informações das flags do espaço de tabelas que residem no arquivo `.ibd`.

- `ZIP_PAGE_SIZE`

  Tamanho da página do tablespace zip. Os dados nesta coluna são interpretados a partir das informações das flags do tablespace que residem no arquivo `.ibd`.

- `TIPO_ESPACO`

  O tipo de espaço de tabela. Os valores possíveis incluem `General` para espaços de tabela gerais e `Single` para espaços de tabela por arquivo.

- `FS_BLOCK_SIZE`

  O tamanho do bloco do sistema de arquivos, que é o tamanho da unidade usada para perfuração de furos. Esta coluna diz respeito ao recurso `InnoDB` compactação transparente da página.

- `FILE_SIZE`

  O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, não compactado. Esta coluna refere-se ao recurso `InnoDB` compressão de página transparente.

- `ALLOCATED_SIZE`

  O tamanho real do arquivo, que é a quantidade de espaço alocado no disco. Esta coluna diz respeito ao recurso `InnoDB` compressão transparente de páginas.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 26\G
*************************** 1. row ***************************
         SPACE: 26
          NAME: test/t1
          FLAG: 0
   FILE_FORMAT: Antelope
    ROW_FORMAT: Compact or Redundant
     PAGE_SIZE: 16384
 ZIP_PAGE_SIZE: 0
    SPACE_TYPE: Single
 FS_BLOCK_SIZE: 4096
     FILE_SIZE: 98304
ALLOCATED_SIZE: 65536
```

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Como as bandeiras do espaço de tabela são sempre zero para todos os formatos de arquivo Antelope (ao contrário das bandeiras da tabela), não há como determinar, a partir desse inteiro da bandeira, se o formato de linha do espaço de tabela é Redundante ou Compacto. Como resultado, os valores possíveis para o campo `ROW_FORMAT` são “Compacto ou Redundante”, “Compresso” ou “Dinâmico”.

- Com a introdução dos espaços de tabela gerais, os dados dos espaços de tabela do sistema `InnoDB` (para o ESPAÇO 0) são exibidos no `INNODB_SYS_TABLESPACES`.
