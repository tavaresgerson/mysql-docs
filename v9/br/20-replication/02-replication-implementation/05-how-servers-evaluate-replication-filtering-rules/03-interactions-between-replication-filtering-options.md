#### 19.2.5.3 Interações entre as Opções de Filtragem de Replicação

Se você usar uma combinação de opções de filtragem de replicação de nível de banco de dados e de nível de tabela, a replicação primeiro aceita ou ignora eventos usando as opções do banco de dados, e depois avalia todos os eventos permitidos por essas opções de acordo com as opções da tabela. Isso pode, às vezes, levar a resultados que parecem contraintuitivos. Também é importante notar que os resultados variam dependendo se a operação é registrada usando o formato de registro binário baseado em instruções ou baseado em linhas. Se você quiser ter certeza de que seus filtros de replicação sempre operam da mesma maneira, independentemente do formato de registro binário, o que é particularmente importante se você estiver usando um formato de registro binário misto, siga as orientações neste tópico.

O efeito das opções de filtragem de replicação difere entre os formatos de registro binário devido à maneira como o nome do banco de dados é identificado. Com o formato baseado em instruções, as instruções DML são tratadas com base no banco de dados atual, conforme especificado pela instrução `USE`. Com o formato baseado em linhas, as instruções DML são tratadas com base no banco de dados onde a tabela modificada existe. As instruções DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela instrução `USE`, independentemente do formato de registro binário.

Uma operação que envolve várias tabelas também pode ser afetada de maneira diferente pelas opções de filtragem de replicação, dependendo do formato de registro binário. As operações a serem observadas incluem transações que envolvem declarações `UPDATE` de várias tabelas, gatilhos, chaves estrangeiras em cascata, funções armazenadas que atualizam várias tabelas e declarações DML que invocam funções armazenadas que atualizam uma ou mais tabelas. Se essas operações atualizarem tanto as tabelas filtradas quanto as tabelas filtradas, os resultados podem variar com o formato de registro binário.

Se você precisar garantir que seus filtros de replicação operem de forma consistente, independentemente do formato de registro binário, especialmente se estiver usando um formato de registro binário misto (`binlog_format=MIXED`), use apenas as opções de filtragem de replicação de nível de tabela e não use as opções de filtragem de replicação de nível de banco de dados. Além disso, não use declarações DML de várias tabelas que atualizem tanto as tabelas filtradas quanto as tabelas filtradas.

Se você precisar usar uma combinação de filtros de replicação de nível de banco de dados e de nível de tabela e quiser que eles operem o mais consistentemente possível, escolha uma das seguintes estratégias:

1. Se você usar o formato de registro binário baseado em linha (`binlog_format=ROW`), para declarações DDL, confie na declaração `USE` para definir o banco de dados e não especifique o nome do banco de dados. Você pode considerar a mudança para o formato de registro binário baseado em linha para melhorar a consistência com a filtragem de replicação. Consulte a Seção 7.4.4.2, “Definindo o Formato do Registro Binário” para as condições que se aplicam à mudança do formato de registro binário.

2. Se você usar o formato de registro binário baseado em instruções ou misto (`binlog_format=STATEMENT` ou `MIXED`), para instruções de DML e DDL, confie na instrução `USE` e não use o nome do banco de dados. Além disso, não use instruções DML de múltiplas tabelas que atualizem tabelas filtradas e não filtradas.

**Exemplo 19.7 Opção `--replicate-ignore-db` e opção `--replicate-do-table`**

No servidor de origem da replicação, as seguintes instruções são emitidas:

```
USE db1;
CREATE TABLE t2 LIKE t1;
INSERT INTO db2.t3 VALUES (1);
```

A replica tem as seguintes opções de filtragem de replicação definidas:

```
replicate-ignore-db = db1
replicate-do-table = db2.t3
```

A instrução DDL `CREATE TABLE` cria a tabela em `db1`, conforme especificado pela instrução `USE` anterior. A replica filtra essa instrução de acordo com sua opção `--replicate-ignore-db = db1`, porque `db1` é o banco de dados atual. Esse resultado é o mesmo, independentemente do formato de registro binário no servidor de origem da replicação. No entanto, o resultado da instrução DML `INSERT` é diferente dependendo do formato de registro binário:

* Se o formato de registro binário baseado em linhas estiver em uso na fonte (`binlog_format=ROW`), a replica avalia a operação `INSERT` usando o banco de dados onde a tabela existe, que é nomeado como `db2`. A opção de nível de banco de dados `--replicate-ignore-db = db1`, que é avaliada primeiro, portanto, não se aplica. A opção de nível de tabela `--replicate-do-table = db2.t3` se aplica, então a replica aplica a mudança à tabela `t3`.

* Se o formato de registro binário baseado em instruções `*` estiver em uso na fonte (`binlog_format=STATEMENT`), a replica avalia a operação `INSERT` usando o banco de dados padrão, que foi definido pela instrução `USE` para `db1` e não foi alterado. De acordo com sua opção de nível de banco de dados `--replicate-ignore-db = db1`, ela, portanto, ignora a operação e não aplica a mudança à tabela `t3`. A opção de nível de tabela `--replicate-do-table = db2.t3` não é verificada, porque a instrução já correspondia a uma opção de nível de banco de dados e foi ignorada.

Se a opção `--replicate-ignore-db = db1` na replica for necessária e o uso do formato de registro binário baseado em instruções (ou misto) na fonte também for necessário, os resultados podem ser consistentes omitindo o nome do banco de dados da instrução `INSERT` e confiando em uma instrução `USE` em vez disso, conforme segue:

```
USE db1;
CREATE TABLE t2 LIKE t1;
USE db2;
INSERT INTO t3 VALUES (1);
```

Neste caso, a replica sempre avalia a instrução `INSERT` com base no banco de dados `db2`. Se a operação for registrada no formato binário baseado em instruções ou baseado em linhas, os resultados permanecem os mesmos.