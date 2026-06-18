#### 15.7.7.10 Mostrar a declaração CREATE TABLE

```
SHOW CREATE TABLE tbl_name
```

Mostra a declaração `CREATE TABLE` que cria a tabela nomeada. Para usar essa declaração, você deve ter algum privilégio para a tabela. Essa declaração também funciona com visualizações.

```
mysql> SHOW CREATE TABLE t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int NOT NULL AUTO_INCREMENT,
  `s` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

A partir do MySQL 8.0.16, o MySQL implementa as restrições `CHECK` e as exibe `SHOW CREATE TABLE`. Todas as restrições `CHECK` são exibidas como restrições de tabela. Ou seja, uma restrição `CHECK` especificada originalmente como parte da definição de uma coluna é exibida como uma cláusula separada que não faz parte da definição da coluna. Exemplo:

```
mysql> CREATE TABLE t1 (
         i1 INT CHECK (i1 <> 0),      -- column constraint
         i2 INT,
         CHECK (i2 > i1),             -- table constraint
         CHECK (i2 <> 0) NOT ENFORCED -- table constraint, not enforced
       );

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i1` int DEFAULT NULL,
  `i2` int DEFAULT NULL,
  CONSTRAINT `t1_chk_1` CHECK ((`i1` <> 0)),
  CONSTRAINT `t1_chk_2` CHECK ((`i2` > `i1`)),
  CONSTRAINT `t1_chk_3` CHECK ((`i2` <> 0)) /*!80016 NOT ENFORCED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

A tabela e os nomes das colunas são citados pelo `SHOW CREATE TABLE` de acordo com o valor da opção `sql_quote_show_create`. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. Por exemplo, ao alterar o motor de armazenamento de `InnoDB` para `MyISAM`, as opções específicas de `InnoDB`, como `ROW_FORMAT=COMPACT`, são mantidas, como mostrado aqui:

```
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) ROW_FORMAT=COMPACT ENGINE=InnoDB;
mysql> ALTER TABLE t1 ENGINE=MyISAM;
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int NOT NULL,
  PRIMARY KEY (`c1`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPACT
```

Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format` em resposta ao `SHOW TABLE STATUS`. `SHOW CREATE TABLE` mostra o formato de linha que foi especificado na declaração `CREATE TABLE`.

No MySQL 8.0.30 e versões posteriores, `SHOW CREATE TABLE` inclui a definição da chave primária gerada e invisível da tabela, se essa chave existir, por padrão. Você pode evitar que essa informação seja exibida na saída do comando configurando `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Geradas e Invisíveis”.
