## 17.22 Restrições e Limitações do InnoDB

Esta seção descreve as restrições e limitações do mecanismo de armazenamento `InnoDB`.

* Você não pode criar uma tabela com um nome de coluna que coincida com o nome de uma coluna interna do `InnoDB` (incluindo `DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`. Esta restrição se aplica ao uso dos nomes em qualquer caso de letra).

```
  mysql> CREATE TABLE t1 (c1 INT, db_row_id INT) ENGINE=INNODB;
  ERROR 1166 (42000): Incorrect column name 'db_row_id'
  ```

* O `SHOW TABLE STATUS` não fornece estatísticas precisas para tabelas `InnoDB`, exceto pelo tamanho físico reservado pela tabela. O número de linhas é apenas uma estimativa aproximada usada na otimização do SQL.

* O `InnoDB` não mantém um contagem interna de linhas em uma tabela porque transações concorrentes podem "ver" diferentes números de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis à transação atual.

Para informações sobre como o `InnoDB` processa as instruções `SELECT COUNT(*)`, consulte a descrição do `COUNT()` na Seção 14.19.1, "Descrição de Funções Agregadas".

* `ROW_FORMAT=COMPRESSED` não é suportado para tamanhos de página maiores que 16KB.

* Uma instância MySQL que usa um tamanho de página `InnoDB` específico (`innodb_page_size`) não pode usar arquivos de dados ou arquivos de log de uma instância que usa um tamanho de página diferente.

* Para limitações associadas à importação de tabelas usando o recurso *Transportable Tablespaces*, consulte Limitações de Importação de Tabelas.

* Para limitações associadas ao DDL online, consulte a Seção 17.12.8, "Limitações de DDL Online".

* Para limitações associadas a espaços de tabelas gerais, consulte Limitações de Espaço de Tabela Geral.

* Para limitações associadas à criptografia de dados em repouso, consulte Limitações de Criptografia.