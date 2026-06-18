#### 19.2.5.3 Interações entre as opções de filtragem de replicação

Se você usar uma combinação de opções de filtragem de replicação de nível de banco de dados e de nível de tabela, a replica primeiro aceita ou ignora eventos usando as opções do banco de dados, e depois avalia todos os eventos permitidos por essas opções de acordo com as opções da tabela. Isso pode, às vezes, levar a resultados que parecem contraintuitivos. Também é importante notar que os resultados variam dependendo se a operação é registrada usando o formato de registro binário baseado em instruções ou baseado em linhas. Se você quiser ter certeza de que seus filtros de replicação sempre operam da mesma maneira, independentemente do formato de registro binário, o que é particularmente importante se você estiver usando um formato de registro binário misto, siga as orientações neste tópico.

O efeito das opções de filtragem de replicação difere entre os formatos de registro binário devido à maneira como o nome do banco de dados é identificado. Com o formato baseado em declarações, as instruções DML são tratadas com base no banco de dados atual, conforme especificado pela declaração `USE`. Com o formato baseado em linhas, as instruções DML são tratadas com base no banco de dados onde a tabela modificada existe. As instruções DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela declaração `USE`, independentemente do formato de registro binário.

Uma operação que envolve várias tabelas também pode ser afetada de maneira diferente pelas opções de filtragem de replicação, dependendo do formato de registro binário. As operações a serem observadas incluem transações que envolvem declarações multitabela `UPDATE` (código `UPDATE`), gatilhos, chaves estrangeiras em cascata, funções armazenadas que atualizam várias tabelas e instruções DML que invocam funções armazenadas que atualizam uma ou mais tabelas. Se essas operações atualizarem tanto as tabelas filtradas quanto as tabelas filtradas, os resultados podem variar com o formato de registro binário.

Se você precisa garantir que seus filtros de replicação funcionem de forma consistente, independentemente do formato de registro binário, especialmente se você estiver usando um formato de registro binário misto (`binlog_format=MIXED`), use apenas opções de filtragem de replicação de nível de tabela e não use opções de filtragem de replicação de nível de banco de dados. Além disso, não use instruções DML de várias tabelas que atualizem tanto as tabelas filtradas quanto as tabelas filtradas.

Se você precisar usar filtros de replicação de nível de banco de dados e de nível de tabela e quiser que eles funcionem de forma o mais consistente possível, escolha uma das seguintes estratégias:

1. Se você estiver usando o formato de registro binário baseado em linhas (`binlog_format=ROW`), para instruções DDL, confie na instrução `USE` para definir o banco de dados e não especifique o nome do banco de dados. Você pode considerar a mudança para o formato de registro binário baseado em linhas para melhorar a consistência com o filtro de replicação. Consulte a Seção 7.4.4.2, “Definindo o Formato do Registro Binário”, para as condições que se aplicam à mudança do formato de registro binário.

2. Se você estiver usando o formato de registro binário baseado em declarações ou misto (`binlog_format=STATEMENT` ou `MIXED`), para declarações de DML e DDL, confie na declaração `USE` e não use o nome do banco de dados. Além disso, não use declarações de DML de várias tabelas que atualizem tanto as tabelas filtradas quanto as tabelas filtradas.

**Exemplo 19.7 Uma opção `--replicate-ignore-db` e uma opção `--replicate-do-table`**

No servidor de origem da replicação, as seguintes declarações são emitidas:

```
USE db1;
CREATE TABLE t2 LIKE t1;
INSERT INTO db2.t3 VALUES (1);
```

A réplica tem as seguintes opções de filtragem de replicação definidas:

```
replicate-ignore-db = db1
replicate-do-table = db2.t3
```

A declaração DDL `CREATE TABLE` cria a tabela em `db1`, conforme especificado pela declaração anterior `USE`. A replica filtra essa declaração de acordo com sua opção `--replicate-ignore-db = db1`, porque `db1` é o banco de dados atual. Esse resultado é o mesmo, independentemente do formato de registro binário no servidor de origem da replicação. No entanto, o resultado da declaração DML `INSERT` é diferente dependendo do formato de registro binário:

- Se o formato de registro binário baseado em linhas estiver em uso na fonte (`binlog_format=ROW`), a replica avalia a operação `INSERT` usando o banco de dados onde a tabela existe, que é nomeado como `db2`. A opção de nível de banco de dados `--replicate-ignore-db = db1`, que é avaliada primeiro, portanto, não se aplica. A opção de nível de tabela `--replicate-do-table = db2.t3` se aplica, então a replica aplica a mudança à tabela `t3`.

- Se o formato de registro binário baseado em declarações estiver em uso na fonte (`binlog_format=STATEMENT`), a replica avalia a operação `INSERT` usando o banco de dados padrão, que foi definido pela declaração `USE` para `db1` e não foi alterado. De acordo com sua opção de nível de banco de dados `--replicate-ignore-db = db1`, ela, portanto, ignora a operação e não aplica a mudança à tabela `t3`. A opção de nível de tabela `--replicate-do-table = db2.t3` não é verificada, porque a declaração já correspondia a uma opção de nível de banco de dados e foi ignorada.

Se a opção `--replicate-ignore-db = db1` na replica for necessária e o uso do formato de registro binário baseado em declarações (ou misto) na fonte também for necessário, os resultados podem ser consistentes omitindo o nome do banco de dados da declaração `INSERT` e confiando em uma declaração `USE` em vez disso, conforme segue:

```
USE db1;
CREATE TABLE t2 LIKE t1;
USE db2;
INSERT INTO t3 VALUES (1);
```

Nesse caso, a replica sempre avalia a declaração `INSERT` com base no banco de dados `db2`. Se a operação for registrada no formato binário baseado em declaração ou baseado em linha, os resultados permanecem os mesmos.
