#### 7.6.7.4 Clonagem e DDL Concorrente

Antes do MySQL 8.0.27, as operações de DDL nas instâncias do servidor MySQL doador e receptor, incluindo `TRUNCATE TABLE`, não são permitidas durante uma operação de clonagem. Essa limitação deve ser considerada ao selecionar as fontes de dados. Uma solução é usar instâncias doadoras dedicadas, que podem acomodar operações de DDL bloqueadas enquanto os dados estão sendo clonados.

Para evitar DDL concorrente durante uma operação de clonagem, um bloqueio de backup exclusivo é adquirido no doador e no receptor. A variável `clone_ddl_timeout` define o tempo em segundos no doador e no receptor que uma operação de clonagem espera por um bloqueio de backup. O ajuste padrão é de 300 segundos. Se um bloqueio de backup não for obtido com o limite de tempo especificado, a operação de clonagem falhará com um erro.

A partir do MySQL 8.0.27, o DDL concorrente é permitido no doador por padrão. O suporte ao DDL concorrente no doador é controlado pela variável `clone_block_ddl`. O suporte ao DDL concorrente pode ser ativado e desativado dinamicamente usando uma instrução `SET`.

```
SET GLOBAL clone_block_ddl={OFF|ON}
```

A configuração padrão é `clone_block_ddl=OFF`, que permite DDL concorrente no doador.

Se o efeito de uma operação de DDL concorrente é clonado ou não, depende se a operação de DDL termina antes que o instantâneo dinâmico seja feito pela operação de clonagem.

As operações DDL que não são permitidas durante uma operação de clonagem, independentemente da configuração `clone_block_ddl`, incluem:

- `ALTER TABLE tbl_name DISCARD TABLESPACE;`

- `ALTER TABLE tbl_name IMPORT TABLESPACE;`

- `ALTER INSTANCE DISABLE INNODB REDO_LOG;`
