#### 7.6.7.4 Clonagem e DDL simultânea

No MySQL 8.4, o DDL simultâneo é permitido no doador por padrão. O suporte ao DDL simultâneo no doador é controlado pela variável `clone_block_ddl`. O suporte ao DDL simultâneo pode ser ativado e desativado dinamicamente usando uma instrução `SET` como esta:

```
SET GLOBAL clone_block_ddl={OFF|ON}
```

A configuração padrão é `clone_block_ddl=OFF`, que permite DDL concorrente no doador.

Se o efeito de uma operação DDL simultânea é clonado ou não depende de a operação DDL terminar antes de a instantânea dinâmica ser obtida pela operação de clonagem.

As operações DDL que não são permitidas durante uma operação de clonagem, independentemente da configuração `clone_block_ddl` incluem:

- `ALTER TABLE tbl_name DISCARD TABLESPACE;`
- `ALTER TABLE tbl_name IMPORT TABLESPACE;`
- `ALTER INSTANCE DISABLE INNODB REDO_LOG;`
