#### 13.7.5.10 Instrução SHOW CREATE TABLE

```sql
SHOW CREATE TABLE tbl_name
```

Mostra a instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") que cria a tabela nomeada. Para usar esta instrução, você deve ter algum privilégio para a tabela. Esta instrução também funciona com views.

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

[`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") coloca nomes de tabelas e colunas entre aspas (quotes) de acordo com o valor da opção [`sql_quote_show_create`](server-system-variables.html#sysvar_sql_quote_show_create). Consulte a [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

Ao alterar o storage engine de uma tabela, as opções de tabela que não são aplicáveis ao novo storage engine são retidas na definição da tabela para permitir reverter a tabela com suas opções definidas anteriormente para o storage engine original, se necessário. Por exemplo, ao mudar o storage engine de InnoDB para MyISAM, opções específicas do InnoDB, como `ROW_FORMAT=COMPACT`, são retidas.

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

Ao criar uma tabela com [strict mode](glossary.html#glos_strict_mode "strict mode") desabilitado, o default row format do storage engine é usado se o row format especificado não for suportado. O row format real da tabela é reportado na coluna `Row_format` em resposta a [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement"). [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") mostra o row format que foi especificado na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").