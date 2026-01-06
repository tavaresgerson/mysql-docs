#### 13.7.5.10 Mostrar a declaração CREATE TABLE

```sql
SHOW CREATE TABLE tbl_name
```

Mostra a instrução `CREATE TABLE` que cria a tabela nomeada. Para usar essa instrução, você deve ter algum privilégio para a tabela. Essa instrução também funciona com visualizações.

```sql
mysql> SHOW CREATE TABLE t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `s` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

`SHOW CREATE TABLE` cita os nomes da tabela e das colunas de acordo com o valor da opção `sql_quote_show_create`. Veja Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. Por exemplo, ao alterar o motor de armazenamento de InnoDB para MyISAM, as opções específicas do InnoDB, como `ROW_FORMAT=COMPACT`, são mantidas.

```sql
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) ROW_FORMAT=COMPACT ENGINE=InnoDB;
mysql> ALTER TABLE t1 ENGINE=MyISAM;
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) NOT NULL,
  PRIMARY KEY (`c1`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT
```

Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format` em resposta à consulta `SHOW TABLE STATUS` (show-table-status.html). A consulta `SHOW CREATE TABLE` (show-create-table.html) mostra o formato de linha que foi especificado na instrução `CREATE TABLE` (create-table.html).
