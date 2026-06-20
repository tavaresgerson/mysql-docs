## 14.24 Restrições e Limitações do InnoDB

Esta seção descreve as restrições e limitações do motor de armazenamento `InnoDB`.

* Você não pode criar uma tabela com um nome de coluna que corresponda ao nome de uma coluna interna `InnoDB` (incluindo `DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). Esta restrição se aplica ao uso dos nomes em qualquer caso de letra.

  ```sql
  mysql> CREATE TABLE t1 (c1 INT, db_row_id INT) ENGINE=INNODB;
  ERROR 1166 (42000): Incorrect column name 'db_row_id'
  ```

* `SHOW TABLE STATUS` não fornece estatísticas precisas para as tabelas `InnoDB`, exceto pelo tamanho físico reservado pela tabela. O número de linhas é apenas uma estimativa grosseira usada na otimização do SQL.

* `InnoDB` não mantém um contador interno de linhas em uma tabela, porque transações concorrentes podem "ver" diferentes números de linhas ao mesmo tempo. Consequentemente, as declarações `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

Para informações sobre como o `InnoDB` processa as declarações do `SELECT COUNT(*)`, consulte a descrição do `COUNT()` na Seção 12.19.1, “Descritores de função agregada”.

* `ROW_FORMAT=COMPRESSED` não é suportado para tamanhos de página maiores que 16 KB.

* Uma instância do MySQL que utiliza um tamanho de página `InnoDB` específico (`innodb_page_size`) não pode usar arquivos de dados ou arquivos de registro de uma instância que utiliza um tamanho de página diferente.

* Para as limitações associadas à importação de tabelas usando o recurso *Transportable Tablespaces*, consulte as Limitações de Importação de Tabelas.

* Para as limitações associadas ao DDL online, consulte a Seção 14.13.6, “Limitações do DDL online”.

* Para as limitações associadas aos espaços de tabela gerais, consulte as limitações gerais dos espaços de tabela.

* Para as limitações associadas à criptografia de dados em repouso, consulte as Limitações de Criptografia.