### 10.4.7 Limites de contagem de colunas de tabela e tamanho de linha

Esta seção descreve os limites para o número de colunas em tabelas e o tamanho das linhas individuais.

- Limites de contagem de colunas
- Limites de tamanho das linhas

#### Limites de contagem de colunas

O MySQL tem um limite rígido de 4096 colunas por tabela, mas o limite máximo efetivo pode ser menor para uma determinada tabela. O limite exato das colunas depende de vários fatores:

- O tamanho máximo de linha para uma tabela limita o número (e, possivelmente, o tamanho) de colunas, pois o comprimento total de todas as colunas não pode exceder esse tamanho. Veja Limites de Tamanho de Linha.

- Os requisitos de armazenamento de colunas individuais restringem o número de colunas que cabem dentro de um tamanho máximo de linha dado. Os requisitos de armazenamento para alguns tipos de dados dependem de fatores como o mecanismo de armazenamento, o formato de armazenamento e o conjunto de caracteres. Consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

- Os motores de armazenamento podem impor restrições adicionais que limitam o número de colunas de uma tabela. Por exemplo, `InnoDB` tem um limite de 1017 colunas por tabela. Consulte a Seção 17.22, “Limites do InnoDB”. Para informações sobre outros motores de armazenamento, consulte o Capítulo 18, *Motores de Armazenamento Alternativos*.

- As partes-chave funcionais (consulte a Seção 15.1.15, “Instrução CREATE INDEX”) são implementadas como colunas armazenadas virtuais geradas em segundo plano, portanto, cada parte-chave funcional em um índice de tabela conta para o limite da coluna total da tabela.

#### Limites de tamanho das linhas

O tamanho máximo de uma linha para uma tabela específica é determinado por vários fatores:

- A representação interna de uma tabela do MySQL tem um limite máximo de tamanho de linha de 65.535 bytes, mesmo que o mecanismo de armazenamento seja capaz de suportar linhas maiores. As colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o limite de tamanho de linha, porque seus conteúdos são armazenados separadamente do resto da linha. `BLOB` e `TEXT` columns only contribute 9 to 12 bytes toward the row size limit because their contents are stored separately from the rest of the row.

- O tamanho máximo de linha para uma tabela `InnoDB`, que se aplica aos dados armazenados localmente dentro de uma página do banco de dados, é ligeiramente inferior a meia página para configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo de linha é ligeiramente inferior a 8KB para o tamanho de página padrão de 16KB `InnoDB`. Para páginas de 64KB, o tamanho máximo de linha é ligeiramente inferior a 16KB. Veja a Seção 17.22, “Limites do InnoDB”.

  Se uma linha contendo colunas de comprimento variável exceder o tamanho máximo de linha `InnoDB`, `InnoDB` seleciona colunas de comprimento variável para armazenamento externo fora da página até que a linha se encaixe dentro do limite de tamanho de linha `InnoDB`. A quantidade de dados armazenados localmente para colunas de comprimento variável que são armazenadas fora da página difere conforme o formato da linha. Para mais informações, consulte a Seção 17.10, “Formatos de Linha InnoDB”.

- Diferentes formatos de armazenamento utilizam quantidades diferentes de dados de cabeçalho e trailer da página, o que afeta a quantidade de armazenamento disponível para as linhas.

  - Para obter informações sobre os formatos de linha `InnoDB`, consulte a Seção 17.10, “Formatos de Linha InnoDB”.

  - Para obter informações sobre os formatos de armazenamento `MyISAM`, consulte a Seção 18.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

##### Limite de tamanho da linha Exemplos

- O limite máximo de tamanho de linha do MySQL de 65.535 bytes é demonstrado nos seguintes exemplos `InnoDB` e `MyISAM`. O limite é aplicado independentemente do mecanismo de armazenamento, mesmo que o mecanismo de armazenamento possa suportar linhas maiores.

  ```
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g VARCHAR(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  ```
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g VARCHAR(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  No exemplo `MyISAM` a seguir, ao alterar uma coluna para `TEXT`, é possível evitar o limite de tamanho de linha de 65.535 bytes e permitir que a operação seja concluída, pois as colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o tamanho da linha.

  ```
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

  A operação é bem-sucedida para uma tabela `InnoDB` porque alterar uma coluna para `TEXT` evita o limite de tamanho de linha de 65.535 bytes do MySQL, e o armazenamento fora da página de colunas de comprimento variável `InnoDB` evita o limite de tamanho de linha `InnoDB`.

  ```
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

- O armazenamento para colunas de comprimento variável inclui bytes de comprimento, que são contados para o tamanho da linha. Por exemplo, uma coluna `VARCHAR(255) CHARACTER SET utf8mb3` ocupa dois bytes para armazenar o comprimento do valor, então cada valor pode ocupar até 767 bytes.

  A declaração para criar a tabela `t1` é bem-sucedida porque as colunas exigem 32.765 + 2 bytes e 32.766 + 2 bytes, o que está dentro do tamanho máximo da linha de 65.535 bytes:

  ```
  mysql> CREATE TABLE t1
         (c1 VARCHAR(32765) NOT NULL, c2 VARCHAR(32766) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

  A declaração para criar a tabela `t2` falha porque, embora o comprimento da coluna esteja dentro do comprimento máximo de 65.535 bytes, são necessários dois bytes adicionais para registrar o comprimento, o que faz com que o tamanho da linha exceda 65.535 bytes:

  ```
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65535) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  Reduzir o comprimento da coluna para 65.533 ou menos permite que a declaração seja bem-sucedida.

  ```
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65533) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.01 sec)
  ```

- Para as tabelas `MyISAM`, as colunas `NULL` exigem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` consome um bit extra, arredondado para o byte mais próximo.

  A declaração para criar a tabela `t3` falha porque `MyISAM` requer espaço para as colunas `NULL` além do espaço necessário para os bytes de comprimento de coluna de comprimento variável, fazendo com que o tamanho da linha exceda 65.535 bytes:

  ```
  mysql> CREATE TABLE t3
         (c1 VARCHAR(32765) NULL, c2 VARCHAR(32766) NULL)
         ENGINE = MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  Para obter informações sobre o armazenamento de colunas `InnoDB` `NULL`, consulte a Seção 17.10, “Formatos de Linhas InnoDB”.

- `InnoDB` limita o tamanho da linha (para dados armazenados localmente dentro da página do banco de dados) para um pouco menos de meio banco de dados para configurações de 4KB, 8KB, 16KB e 32KB `innodb_page_size` e para um pouco menos de 16KB para páginas de 64KB.

  A declaração para criar a tabela `t4` falha porque as colunas definidas excedem o limite de tamanho de linha para uma página de 16 KB `InnoDB`.

  ```
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
         ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARSET latin1;
  ERROR 1118 (42000): Row size too large (> 8126). Changing some columns to TEXT or BLOB may help.
  In current row format, BLOB prefix of 0 bytes is stored inline.
  ```
