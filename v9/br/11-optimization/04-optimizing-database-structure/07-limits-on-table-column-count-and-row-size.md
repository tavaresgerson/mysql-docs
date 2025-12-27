### 10.4.7 Limites de Número de Colunas de uma Tabela e Tamanho de Linha

Esta seção descreve os limites de número de colunas em tabelas e tamanho de linhas individuais.

* Limites de Número de Colunas
* Limites de Tamanho de Linha

#### Limites de Número de Colunas

O MySQL tem um limite rígido de 4096 colunas por tabela, mas o limite máximo efetivo pode ser menor para uma determinada tabela. O limite exato de colunas depende de vários fatores:

* O tamanho máximo de linha para uma tabela limita o número (e possivelmente o tamanho) de colunas, pois o comprimento total de todas as colunas não pode exceder esse tamanho. Veja Limites de Tamanho de Linha.

* Os requisitos de armazenamento de colunas individuais limitam o número de colunas que cabem dentro de um determinado tamanho máximo de linha. Os requisitos de armazenamento para alguns tipos de dados dependem de fatores como o mecanismo de armazenamento, o formato de armazenamento e o conjunto de caracteres. Veja Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

* Mecanismos de armazenamento podem impor restrições adicionais que limitam o número de colunas de uma tabela. Por exemplo, o `InnoDB` tem um limite de 1017 colunas por tabela. Veja Seção 17.21, “Limites do InnoDB”. Para informações sobre outros mecanismos de armazenamento, veja Capítulo 18, *Mecanismos de Armazenamento Alternativos*.

* Partes funcionais da chave (veja Seção 15.1.18, “Instrução CREATE INDEX”) são implementadas como colunas armazenadas virtuais geradas ocultas, então cada parte funcional da chave em um índice de tabela conta contra o limite total de colunas da tabela.

#### Limites de Tamanho de Linha

O tamanho máximo de linha para uma determinada tabela é determinado por vários fatores:

* A representação interna de uma tabela MySQL tem um limite máximo de tamanho de linha de 65.535 bytes, mesmo que o mecanismo de armazenamento seja capaz de suportar linhas maiores. Colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o limite de tamanho de linha porque seus conteúdos são armazenados separadamente do resto da linha.

* O tamanho máximo de linha para uma tabela `InnoDB`, que se aplica aos dados armazenados localmente dentro de uma página do banco de dados, é ligeiramente inferior a meio de página para configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo de linha é ligeiramente inferior a 8KB para o tamanho de página padrão de 16KB do `InnoDB`. Para páginas de 64KB, o tamanho máximo de linha é ligeiramente inferior a 16KB. Veja a Seção 17.21, “Limites do InnoDB”.

  Se uma linha contendo colunas de comprimento variável exceder o tamanho máximo de linha do `InnoDB`, o `InnoDB` seleciona colunas de comprimento variável para armazenamento externo fora da página até que a linha se encaixe dentro do limite de tamanho de linha do `InnoDB`. A quantidade de dados armazenada localmente para colunas de comprimento variável que são armazenadas fora da página difere por formato de linha. Para mais informações, consulte a Seção 17.10, “Formatos de Linha do InnoDB”.

* Diferentes formatos de armazenamento usam diferentes quantidades de dados de cabeçalho e trailer da página, o que afeta a quantidade de armazenamento disponível para linhas.

  + Para informações sobre os formatos de linha do `InnoDB`, consulte a Seção 17.10, “Formatos de Linha do InnoDB”.

  + Para informações sobre os formatos de armazenamento do `MyISAM`, consulte a Seção 18.2.3, “Formatos de Armazenamento de Tabelas do MyISAM”.

##### Exemplos de Limite de Tamanho de Linha

* O limite máximo de tamanho de linha do MySQL de 65.535 bytes é demonstrado nos seguintes exemplos de `InnoDB` e `MyISAM`. O limite é aplicado independentemente do motor de armazenamento, mesmo que o motor de armazenamento possa suportar linhas maiores.

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

  No exemplo `MyISAM` a seguir, alterar uma coluna para `TEXT` evita o limite de tamanho de linha de 65.535 bytes e permite que a operação seja bem-sucedida porque as colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o tamanho da linha.

  ```
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

A operação é bem-sucedida para uma tabela `InnoDB` porque alterar uma coluna para `TEXT` evita o limite de tamanho de linha de 65.535 bytes do MySQL, e o armazenamento fora da página `InnoDB` de colunas de comprimento variável evita o limite de tamanho de linha do `InnoDB`.

```
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

* O armazenamento para colunas de comprimento variável inclui bytes de comprimento, que são contados para o tamanho da linha. Por exemplo, uma coluna `VARCHAR(255) CHARACTER SET utf8mb3` ocupa dois bytes para armazenar o comprimento do valor, então cada valor pode ocupar até 767 bytes.

  A instrução para criar a tabela `t1` é bem-sucedida porque as colunas requerem 32.765 + 2 bytes e 32.766 + 2 bytes, o que está dentro do tamanho máximo de linha de 65.535 bytes:

  ```
  mysql> CREATE TABLE t1
         (c1 VARCHAR(32765) NOT NULL, c2 VARCHAR(32766) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

  A instrução para criar a tabela `t2` falha porque, embora o comprimento da coluna esteja dentro do comprimento máximo de 65.535 bytes, são necessários dois bytes adicionais para registrar o comprimento, o que faz com que o tamanho da linha exceda 65.535 bytes:

  ```
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65535) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  Reduzir o comprimento da coluna para 65.533 ou menos permite que a instrução seja bem-sucedida.

  ```
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65533) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.01 sec)
  ```

* Para tabelas `MyISAM`, colunas `NULL` requerem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` ocupa um bit extra, arredondado para o byte mais próximo.

  A instrução para criar a tabela `t3` falha porque `MyISAM` requer espaço para colunas `NULL`, além do espaço necessário para os bytes de comprimento da coluna de comprimento variável, fazendo com que o tamanho da linha exceda 65.535 bytes:

  ```
  mysql> CREATE TABLE t3
         (c1 VARCHAR(32765) NULL, c2 VARCHAR(32766) NULL)
         ENGINE = MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

* Para informações sobre o armazenamento de colunas `NULL` do `InnoDB`, consulte a Seção 17.10, “Formatos de Linha do InnoDB”.

* O `InnoDB` restringe o tamanho da linha (para dados armazenados localmente dentro da página do banco de dados) para ligeiramente menos de meio página do banco de dados para configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB, e para ligeiramente menos de 16KB para páginas de 64KB.

A declaração para criar a tabela `t4` falha porque as colunas definidas excedem o limite de tamanho de linha para uma página `InnoDB` de 16 KB.