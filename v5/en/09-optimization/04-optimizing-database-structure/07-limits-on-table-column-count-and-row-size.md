### 8.4.7 Limites na Contagem de Colunas da Tabela e Tamanho da Linha

Esta seção descreve os limites no número de colunas em tabelas e no tamanho das linhas individuais.

* Limites de Contagem de Colunas
* Limites de Tamanho de Linha

#### Limites de Contagem de Colunas

O MySQL tem um limite rígido de 4096 colunas por tabela, mas o máximo efetivo pode ser menor para uma determinada tabela. O limite exato de colunas depende de vários fatores:

* O tamanho máximo de linha para uma tabela restringe o número (e possivelmente o tamanho) das colunas, pois o comprimento total de todas as colunas não pode exceder esse tamanho. Consulte Limites de Tamanho de Linha.

* Os requisitos de armazenamento de colunas individuais restringem o número de colunas que cabem dentro de um determinado tamanho máximo de linha. Os requisitos de armazenamento para alguns tipos de dados dependem de fatores como storage engine, formato de armazenamento e conjunto de caracteres (character set). Consulte a Seção 11.7, “Data Type Storage Requirements”.

* Os storage engines podem impor restrições adicionais que limitam a contagem de colunas da tabela. Por exemplo, o `InnoDB` tem um limite de 1017 colunas por tabela. Consulte a Seção 14.23, “InnoDB Limits”. Para obter informações sobre outros storage engines, consulte o Capítulo 15, *Alternative Storage Engines*.

* Cada tabela possui um arquivo `.frm` que contém a definição da tabela. A definição afeta o conteúdo deste arquivo de maneiras que podem influenciar o número de colunas permitidas na tabela. Consulte Limits Imposed by .frm File Structure.

#### Limites de Tamanho de Linha

O tamanho máximo de linha para uma determinada tabela é determinado por vários fatores:

* A representação interna de uma tabela MySQL tem um limite máximo de tamanho de linha de 65.535 bytes, mesmo que o storage engine seja capaz de suportar linhas maiores. Colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o limite de tamanho da linha porque seus conteúdos são armazenados separadamente do restante da linha.

* O tamanho máximo de linha para uma tabela `InnoDB`, que se aplica aos dados armazenados localmente dentro de uma database page, é ligeiramente inferior à metade de uma página para as configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo da linha é ligeiramente inferior a 8KB para o tamanho de página `InnoDB` padrão de 16KB. Para páginas de 64KB, o tamanho máximo da linha é ligeiramente inferior a 16KB. Consulte a Seção 14.23, “InnoDB Limits”.

  Se uma linha contendo colunas de comprimento variável exceder o tamanho máximo de linha do `InnoDB`, o `InnoDB` seleciona colunas de comprimento variável para armazenamento externo fora da página (off-page storage) até que a linha se ajuste ao limite de tamanho de linha do `InnoDB`. A quantidade de dados armazenados localmente para colunas de comprimento variável que são armazenadas fora da página difere por row format. Para mais informações, consulte a Seção 14.11, “InnoDB Row Formats”.

* Diferentes formatos de armazenamento usam diferentes quantidades de dados de page header e trailer, o que afeta a quantidade de armazenamento disponível para as linhas.

  + Para obter informações sobre os row formats do `InnoDB`, consulte a Seção 14.11, “InnoDB Row Formats”.

  + Para obter informações sobre os formatos de armazenamento `MyISAM`, consulte a Seção 15.2.3, “MyISAM Table Storage Formats”.

##### Exemplos de Limite de Tamanho de Linha

* O limite máximo de tamanho de linha do MySQL de 65.535 bytes é demonstrado nos seguintes exemplos `InnoDB` e `MyISAM`. O limite é imposto independentemente do storage engine, mesmo que o storage engine possa ser capaz de suportar linhas maiores.

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g VARCHAR(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g VARCHAR(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  No exemplo `MyISAM` a seguir, alterar uma coluna para `TEXT` evita o limite de tamanho de linha de 65.535 bytes e permite que a operação seja bem-sucedida, pois as colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o tamanho da linha.

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

  A operação é bem-sucedida para uma tabela `InnoDB` porque a alteração de uma coluna para `TEXT` evita o limite de tamanho de linha de 65.535 bytes do MySQL, e o armazenamento fora da página (off-page storage) do `InnoDB` para colunas de comprimento variável evita o limite de tamanho de linha do `InnoDB`.

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

* O armazenamento para colunas de comprimento variável inclui bytes de comprimento (length bytes), que são contabilizados no tamanho da linha. Por exemplo, uma coluna `VARCHAR(255) CHARACTER SET utf8mb3` requer dois bytes para armazenar o comprimento do valor, então cada valor pode ocupar até 767 bytes.

  A instrução para criar a tabela `t1` é bem-sucedida porque as colunas requerem 32.765 + 2 bytes e 32.766 + 2 bytes, o que está dentro do tamanho máximo de linha de 65.535 bytes:

  ```sql
  mysql> CREATE TABLE t1
         (c1 VARCHAR(32765) NOT NULL, c2 VARCHAR(32766) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

  A instrução para criar a tabela `t2` falha porque, embora o comprimento da coluna esteja dentro do comprimento máximo de 65.535 bytes, dois bytes adicionais são necessários para registrar o comprimento, o que faz com que o tamanho da linha exceda 65.535 bytes:

  ```sql
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65535) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  Reduzir o comprimento da coluna para 65.533 ou menos permite que a instrução seja bem-sucedida.

  ```sql
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65533) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.01 sec)
  ```

* Para tabelas `MyISAM`, colunas `NULL` requerem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` ocupa um bit extra, arredondado para o byte mais próximo.

  A instrução para criar a tabela `t3` falha porque o `MyISAM` requer espaço para colunas `NULL` além do espaço necessário para os bytes de comprimento de coluna de comprimento variável, fazendo com que o tamanho da linha exceda 65.535 bytes:

  ```sql
  mysql> CREATE TABLE t3
         (c1 VARCHAR(32765) NULL, c2 VARCHAR(32766) NULL)
         ENGINE = MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  Para obter informações sobre o armazenamento de colunas `NULL` no `InnoDB`, consulte a Seção 14.11, “InnoDB Row Formats”.

* O `InnoDB` restringe o tamanho da linha (para dados armazenados localmente dentro da database page) a um pouco menos da metade de uma database page para as configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB, e a um pouco menos de 16KB para páginas de 64KB.

  A instrução para criar a tabela `t4` falha porque as colunas definidas excedem o limite de tamanho de linha para uma página `InnoDB` de 16KB.

  ```sql
  mysql> CREATE TABLE t4 (
         c1 CHAR(255),c2 CHAR(255),c3 CHAR(255),
         c4 CHAR(255),c5 CHAR(255),c6 CHAR(255),
         c7 CHAR(255),c8 CHAR(255),c9 CHAR(255),
         c10 CHAR(255),c11 CHAR(255),c12 CHAR(255),
         c13 CHAR(255),c14 CHAR(255),c15 CHAR(255),
         c16 CHAR(255),c17 CHAR(255),c18 CHAR(255),
         c19 CHAR(255),c20 CHAR(255),c21 CHAR(255),
         c22 CHAR(255),c23 CHAR(255),c24 CHAR(255),
         c25 CHAR(255),c26 CHAR(255),c27 CHAR(255),
         c28 CHAR(255),c29 CHAR(255),c30 CHAR(255),
         c31 CHAR(255),c32 CHAR(255),c33 CHAR(255)
         ) ENGINE=InnoDB ROW_FORMAT=COMPACT DEFAULT CHARSET latin1;
  ERROR 1118 (42000): Row size too large (> 8126). Changing some columns to TEXT or BLOB or using
  ROW_FORMAT=DYNAMIC or ROW_FORMAT=COMPRESSED may help. In current row format, BLOB prefix of 768
  bytes is stored inline.
  ```
