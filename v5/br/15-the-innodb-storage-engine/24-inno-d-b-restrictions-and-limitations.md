## 14.24 Restrições e Limitações do InnoDB

Esta seção descreve as restrições e limitações do storage engine `InnoDB`.

* Você não pode criar uma tabela com um nome de coluna que corresponda ao nome de uma coluna interna do `InnoDB` (incluindo `DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). Esta restrição se aplica ao uso dos nomes, independentemente da capitalização (lettercase).

  ```sql
  mysql> CREATE TABLE t1 (c1 INT, db_row_id INT) ENGINE=INNODB;
  ERROR 1166 (42000): Incorrect column name 'db_row_id'
  ```

* `SHOW TABLE STATUS` não fornece statistics precisas para tabelas `InnoDB`, exceto pelo tamanho físico reservado pela tabela. A contagem de linhas (row count) é apenas uma estimativa aproximada usada na SQL optimization.

* O `InnoDB` não mantém uma contagem interna de linhas em uma tabela porque transactions concorrentes podem “ver” números diferentes de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transaction atual.

  Para informações sobre como o `InnoDB` processa instruções `SELECT COUNT(*)`, consulte a descrição de `COUNT()` na Seção 12.19.1, “Aggregate Function Descriptions”.

* `ROW_FORMAT=COMPRESSED` não é suportado para page sizes maiores que 16KB.

* Uma instance MySQL que utiliza um determinado `InnoDB` page size (`innodb_page_size`) não pode usar data files ou log files de uma instance que utiliza um page size diferente.

* Para limitações associadas à importação de tabelas usando o recurso *Transportable Tablespaces*, consulte Limitações de Importação de Tabela.

* Para limitações associadas ao online DDL, consulte a Seção 14.13.6, “Online DDL Limitations”.

* Para limitações associadas a general tablespaces, consulte General Tablespace Limitations.

* Para limitações associadas à data-at-rest encryption (criptografia de dados em repouso), consulte Encryption Limitations.