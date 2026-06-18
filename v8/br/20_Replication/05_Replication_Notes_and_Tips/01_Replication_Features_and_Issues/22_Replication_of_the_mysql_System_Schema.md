#### 19.5.1.22 Replicação do esquema do sistema MySQL

As declarações de modificação de dados feitas em tabelas no esquema `mysql` são replicadas de acordo com o valor de `binlog_format`; se esse valor for `MIXED`, essas declarações são replicadas usando o formato baseado em linha. No entanto, declarações que normalmente atualizariam essas informações indiretamente — como `GRANT`, `REVOKE` e declarações que manipulam gatilhos, rotinas armazenadas e visualizações — são replicadas para réplicas usando a replicação baseada em declarações.
