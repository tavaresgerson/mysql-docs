#### 7.6.7.4 Clonagem e DDL Concorrente

No MySQL 8.4, o DDL concorrente é permitido por padrão no doador. O suporte ao DDL concorrente no doador é controlado pela variável `clone_block_ddl`. O suporte ao DDL concorrente pode ser habilitado e desabilitado dinamicamente usando uma instrução `SET` como esta:

```
SET GLOBAL clone_block_ddl={OFF|ON}
```

A configuração padrão é `clone_block_ddl=OFF`, que permite o DDL concorrente no doador. Se o efeito de uma operação de DDL concorrente é clonado ou não, depende se a operação de DDL termina antes da captura de instantâneos dinâmicos pela operação de clonagem.

As operações de DDL que não são permitidas durante uma operação de clonagem, independentemente da configuração de `clone_block_ddl`, incluem:

* `ALTER TABLE tbl_name DISCARD TABLESPACE;`
* `ALTER TABLE tbl_name IMPORT TABLESPACE;`
* `ALTER INSTANCE DISABLE INNODB REDO_LOG;`