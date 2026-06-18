#### 14.9.1.7 Advertências e Erros de Sintaxe de Compressão SQL

Esta seção descreve as advertências e erros de sintaxe que você pode encontrar ao usar o recurso de compressão de tabela com file-per-table tablespaces e general tablespaces.

##### Advertências e Erros de Sintaxe de Compressão SQL para File-Per-Table Tablespaces

Quando `innodb_strict_mode` está habilitado (o padrão), especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` nas instruções `CREATE TABLE` ou `ALTER TABLE` produz o seguinte erro se `innodb_file_per_table` estiver desabilitado ou se `innodb_file_format` estiver definido como `Antelope` em vez de `Barracuda`.

```sql
ERROR 1031 (HY000): Table storage engine for 't1' does not have this option
```

Nota

A tabela não é criada se a configuração atual não permitir o uso de tabelas compactadas.

Quando `innodb_strict_mode` está desabilitado, especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` nas instruções `CREATE TABLE` ou `ALTER TABLE` produz as seguintes advertências se `innodb_file_per_table` estiver desabilitado.

```sql
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------------------------+
| Level   | Code | Message                                                       |
+---------+------+---------------------------------------------------------------+
| Warning | 1478 | InnoDB: KEY_BLOCK_SIZE requires innodb_file_per_table.        |
| Warning | 1478 | InnoDB: ignoring KEY_BLOCK_SIZE=4.                            |
| Warning | 1478 | InnoDB: ROW_FORMAT=COMPRESSED requires innodb_file_per_table. |
| Warning | 1478 | InnoDB: assuming ROW_FORMAT=DYNAMIC.                          |
+---------+------+---------------------------------------------------------------+
```

Advertências semelhantes são emitidas se `innodb_file_format` estiver definido como `Antelope` em vez de `Barracuda`.

Nota

Estas mensagens são apenas advertências, não erros, e a tabela é criada sem compressão, como se as opções não tivessem sido especificadas.

O comportamento “não estrito” permite importar um arquivo `mysqldump` para um Database que não suporta tabelas compactadas, mesmo que o Database de origem contivesse tabelas compactadas. Nesse caso, o MySQL cria a tabela em `ROW_FORMAT=COMPACT` em vez de impedir a operação.

Para importar o dump file para um novo Database e ter as tabelas recriadas como existem no Database original, certifique-se de que o servidor tenha as configurações apropriadas para os parâmetros de configuração `innodb_file_format` e `innodb_file_per_table`.

O atributo `KEY_BLOCK_SIZE` é permitido apenas quando `ROW_FORMAT` é especificado como `COMPRESSED` ou é omitido. A especificação de um `KEY_BLOCK_SIZE` com qualquer outro `ROW_FORMAT` gera uma advertência que pode ser visualizada com `SHOW WARNINGS`. No entanto, a tabela não é compactada; o `KEY_BLOCK_SIZE` especificado é ignorado).

<table summary="Tabela de resumo: Nível de advertência, código de erro e texto da mensagem para mensagens que podem ser geradas ao usar cláusulas conflitantes para a compressão de tabela InnoDB."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Nível</th> <th>Código</th> <th>Mensagem</th> </tr></thead><tbody><tr> <th>Warning</th> <td>1478</td> <td><code> InnoDB: ignoring KEY_BLOCK_SIZE=<em><code>n</code></em> unless ROW_FORMAT=COMPRESSED. </code></td> </tr></tbody></table>

Se você estiver executando com `innodb_strict_mode` habilitado, a combinação de um `KEY_BLOCK_SIZE` com qualquer `ROW_FORMAT` diferente de `COMPRESSED` gera um erro, não uma advertência, e a tabela não é criada.

A Tabela 14.6, “Opções ROW_FORMAT e KEY_BLOCK_SIZE”, fornece uma visão geral das opções `ROW_FORMAT` e `KEY_BLOCK_SIZE` que são usadas com `CREATE TABLE` ou `ALTER TABLE`.

**Tabela 14.6 Opções ROW_FORMAT e KEY_BLOCK_SIZE**

<table summary="Notas de uso e descrições das opções ROW_FORMAT e KEY_BLOCK_SIZE."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Opção</th> <th>Notas de Uso</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>ROW_FORMAT=​REDUNDANT</code></th> <td>Formato de armazenamento usado antes do MySQL 5.0.3</td> <td>Menos eficiente que <code>ROW_FORMAT=COMPACT</code>; para compatibilidade com versões anteriores</td> </tr><tr> <th><code>ROW_FORMAT=​COMPACT</code></th> <td>Formato de armazenamento padrão desde o MySQL 5.0.3</td> <td>Armazena um prefixo de 768 bytes de valores de colunas longas na página do clustered index, com os bytes restantes armazenados em uma overflow page</td> </tr><tr> <th><code>ROW_FORMAT=​DYNAMIC</code></th> <td>File-per-table tablespaces requerem <code>innodb_file​_format=Barracuda</code></td> <td>Armazena valores dentro da página do clustered index se couberem; caso contrário, armazena apenas um ponteiro de 20 bytes para uma overflow page (sem prefixo)</td> </tr><tr> <th><code>ROW_FORMAT=​COMPRESSED</code></th> <td>File-per-table tablespaces requerem <code>innodb_file​_format=Barracuda</code></td> <td>Compacta a tabela e os Indexes usando zlib</td> </tr><tr> <th><code>KEY_BLOCK_​SIZE=<em><code>n</code></em></code></th> <td>File-per-table tablespaces requerem <code>innodb_file​_format=Barracuda</code></td> <td>Especifica o tamanho da página compactada como 1, 2, 4, 8 ou 16 kilobytes; implica <code>ROW_FORMAT=COMPRESSED</code>. Para general tablespaces, um valor de <code>KEY_BLOCK_SIZE</code> igual ao page size do <code>InnoDB</code> não é permitido.</td> </tr></tbody></table>

A Tabela 14.7, “Advertências e Erros de CREATE/ALTER TABLE quando o Modo Estrito do InnoDB está DESLIGADO” resume as condições de erro que ocorrem com certas combinações de parâmetros de configuração e opções nas instruções `CREATE TABLE` ou `ALTER TABLE`, e como as opções aparecem na saída de `SHOW TABLE STATUS`.

Quando `innodb_strict_mode` está `OFF`, o MySQL cria ou altera a tabela, mas ignora certas configurações, conforme mostrado abaixo. Você pode ver as mensagens de advertência no log de erros do MySQL. Quando `innodb_strict_mode` está `ON`, essas combinações de opções especificadas geram erros, e a tabela não é criada nem alterada. Para ver a descrição completa da condição de erro, execute a instrução `SHOW ERRORS`: exemplo:

```sql
mysql> CREATE TABLE x (id INT PRIMARY KEY, c INT)

-> ENGINE=INNODB KEY_BLOCK_SIZE=33333;

ERROR 1005 (HY000): Can't create table 'test.x' (errno: 1478)

mysql> SHOW ERRORS;
+-------+------+-------------------------------------------+
| Level | Code | Message                                   |
+-------+------+-------------------------------------------+
| Error | 1478 | InnoDB: invalid KEY_BLOCK_SIZE=33333.     |
| Error | 1005 | Can't create table 'test.x' (errno: 1478) |
+-------+------+-------------------------------------------+
```

**Tabela 14.7 Advertências e Erros de CREATE/ALTER TABLE quando o Modo Estrito do InnoDB está DESLIGADO**

<table summary="Advertências e erros de CREATE e ALTER TABLE quando o modo estrito do InnoDB está DESLIGADO."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Sintaxe</th> <th>Condição de Advertência ou Erro</th> <th><code>ROW_FORMAT</code> resultante, conforme mostrado em <code>SHOW TABLE STATUS</code></th> </tr></thead><tbody><tr> <th><code>ROW_FORMAT=REDUNDANT</code></th> <td>Nenhum</td> <td><code>REDUNDANT</code></td> </tr><tr> <th><code>ROW_FORMAT=COMPACT</code></th> <td>Nenhum</td> <td><code>COMPACT</code></td> </tr><tr> <th><code>ROW_FORMAT=COMPRESSED</code> ou <code>ROW_FORMAT=DYNAMIC</code> ou <code>KEY_BLOCK_SIZE</code> é especificado</th> <td>Ignorado para file-per-table tablespaces, a menos que ambos <code>innodb_file_format</code><code>=Barracuda</code> e <code>innodb_file_per_table</code> estejam habilitados. General tablespaces suportam todos os row formats (com algumas restrições), independentemente das configurações de <code>innodb_file_format</code> e <code>innodb_file_per_table</code>. Consulte a Seção 14.6.3.3, “General Tablespaces”.</td> <td><code>o default row format para file-per-table tablespaces; o row format especificado para general tablespaces</code></td> </tr><tr> <th>Um <code>KEY_BLOCK_SIZE</code> inválido é especificado (não 1, 2, 4, 8 ou 16)</th> <td><code>KEY_BLOCK_SIZE</code> é ignorado</td> <td>o row format especificado, ou o default row format</td> </tr><tr> <th><code>ROW_FORMAT=COMPRESSED</code> e um <code>KEY_BLOCK_SIZE</code> válido são especificados</th> <td>Nenhum; o <code>KEY_BLOCK_SIZE</code> especificado é usado</td> <td><code>COMPRESSED</code></td> </tr><tr> <th><code>KEY_BLOCK_SIZE</code> é especificado com row format <code>REDUNDANT</code>, <code>COMPACT</code> ou <code>DYNAMIC</code></th> <td><code>KEY_BLOCK_SIZE</code> é ignorado</td> <td><code>REDUNDANT</code>, <code>COMPACT</code> ou <code>DYNAMIC</code></td> </tr><tr> <th><code>ROW_FORMAT</code> não é um de <code>REDUNDANT</code>, <code>COMPACT</code>, <code>DYNAMIC</code> ou <code>COMPRESSED</code></th> <td>Ignorado se reconhecido pelo parser do MySQL. Caso contrário, um erro é emitido.</td> <td>o default row format ou N/A</td> </tr></tbody></table>

Quando `innodb_strict_mode` está `ON`, o MySQL rejeita parâmetros `ROW_FORMAT` ou `KEY_BLOCK_SIZE` inválidos e emite erros. Quando `innodb_strict_mode` está `OFF`, o MySQL emite advertências em vez de erros para parâmetros inválidos ignorados. `innodb_strict_mode` está `ON` por padrão.

Quando `innodb_strict_mode` está `ON`, o MySQL rejeita parâmetros `ROW_FORMAT` ou `KEY_BLOCK_SIZE` inválidos. Para compatibilidade com versões anteriores do MySQL, o strict mode não está habilitado por padrão; em vez disso, o MySQL emite advertências (não erros) para parâmetros inválidos ignorados.

Não é possível ver o `KEY_BLOCK_SIZE` escolhido usando `SHOW TABLE STATUS`. A instrução `SHOW CREATE TABLE` exibe o `KEY_BLOCK_SIZE` (mesmo que tenha sido ignorado ao criar a tabela). O tamanho real da página compactada da tabela não pode ser exibido pelo MySQL.

##### Advertências e Erros de Sintaxe de Compressão SQL para General Tablespaces

* Se `FILE_BLOCK_SIZE` não foi definido para o general tablespace quando o tablespace foi criado, o tablespace não pode conter tabelas compactadas. Se você tentar adicionar uma tabela compactada, um erro será retornado, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

  mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=8;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts1` cannot contain a COMPRESSED table
  ```

* Tentar adicionar uma tabela com um `KEY_BLOCK_SIZE` inválido a um general tablespace retorna um erro, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=4;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts2` uses block size 8192 and cannot
  contain a table with physical page size 4096
  ```

  Para general tablespaces, o `KEY_BLOCK_SIZE` da tabela deve ser igual ao `FILE_BLOCK_SIZE` do tablespace dividido por 1024. Por exemplo, se o `FILE_BLOCK_SIZE` do tablespace for 8192, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

* Tentar adicionar uma tabela com um row format não compactado a um general tablespace configurado para armazenar tabelas compactadas retorna um erro, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts3` ADD DATAFILE 'ts3.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts3 ROW_FORMAT=COMPACT;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts3` uses block size 8192 and cannot
  contain a table with physical page size 16384
  ```

`innodb_strict_mode` não é aplicável a general tablespaces. As regras de gerenciamento de tablespace para general tablespaces são estritamente impostas independentemente de `innodb_strict_mode`. Para mais informações, consulte a Seção 13.1.19, “CREATE TABLESPACE Statement”.

Para mais informações sobre o uso de tabelas compactadas com general tablespaces, consulte a Seção 14.6.3.3, “General Tablespaces”.