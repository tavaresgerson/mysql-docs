#### 17.9.1.7 Avisos e Erros de Sintaxe de Compressão SQL

Esta seção descreve os avisos e erros de sintaxe que você pode encontrar ao usar o recurso de compressão de tabelas com espaços de tabelas por arquivo e espaços de tabelas gerais.

##### Avisos e Erros de Sintaxe de Compressão SQL para Espaços de Tabelas por Arquivo

Quando o `innodb_strict_mode` está habilitado (o padrão), especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` nas instruções `CREATE TABLE` ou `ALTER TABLE` produz o seguinte erro se `innodb_file_per_table` estiver desativado.

```
ERROR 1031 (HY000): Table storage engine for 't1' doesn't have this option
```

Nota

A tabela não é criada se a configuração atual não permitir o uso de tabelas comprimidas.

Quando o `innodb_strict_mode` está desativado, especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` nas instruções `CREATE TABLE` ou `ALTER TABLE` produz os seguintes avisos se `innodb_file_per_table` estiver desativado.

```
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

Nota

Esses avisos são apenas avisos, não erros, e a tabela é criada sem compressão, como se as opções não tivessem sido especificadas.

O comportamento "não estrito" permite que você importe um arquivo `mysqldump` em um banco de dados que não suporte tabelas comprimidas, mesmo que o banco de dados de origem contenha tabelas comprimidas. Nesse caso, o MySQL cria a tabela em `ROW_FORMAT=DYNAMIC` em vez de impedir a operação.

Para importar o arquivo de dump em um novo banco de dados e recriar as tabelas conforme estão no banco de dados original, certifique-se de que o servidor tenha a configuração adequada para o parâmetro de configuração `innodb_file_per_table`.

O atributo `KEY_BLOCK_SIZE` é permitido apenas quando `ROW_FORMAT` é especificado como `COMPRESSED` ou é omitido. Especificar um `KEY_BLOCK_SIZE` com qualquer outra `ROW_FORMAT` gera uma mensagem de aviso que você pode visualizar com `SHOW WARNINGS`. No entanto, a tabela não é compactada; o `KEY_BLOCK_SIZE` especificado é ignorado).

<table summary="Nível de aviso, código de erro e texto da mensagem para mensagens que podem ser geradas ao usar cláusulas conflitantes para a compactação de tabelas InnoDB."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Nível</th> <th scope="col">Código</th> <th scope="col">Mensagem</th> </tr></thead><tbody><tr> <th scope="row">Aviso</th> <td>1478</td> <td><code class="literal"> InnoDB: ignorando KEY_BLOCK_SIZE=<em class="replaceable"><code>n</code></em> a menos que ROW_FORMAT=COMPRESSED. </code></td> </tr></tbody></table>

Se você estiver executando com `innodb_strict_mode` habilitado, a combinação de um `KEY_BLOCK_SIZE` com qualquer `ROW_FORMAT` diferente de `COMPRESSED` gera um erro, não um aviso, e a tabela não é criada.

A Tabela 17.9, “Opções de ROW_FORMAT e KEY_BLOCK_SIZE”, fornece uma visão geral das opções `ROW_FORMAT` e `KEY_BLOCK_SIZE` que são usadas com `CREATE TABLE` ou `ALTER TABLE`.

**Tabela 17.9 Opções de ROW_FORMAT e KEY_BLOCK_SIZE**

<table summary="Notas e descrições sobre o uso das opções <col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col">Opção</th> <th scope="col">Notas de Uso</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">ROW_FORMAT=​REDUNDANT</code></th> <td>Formato de armazenamento usado antes do MySQL 5.0.3</td> <td>Menos eficiente que <code class="literal">ROW_FORMAT=COMPACT</code>; para compatibilidade reversa</td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT=​COMPACT</code></th> <td>Formato de armazenamento padrão desde o MySQL 5.0.3</td> <td>Armazena um prefixo de 768 bytes de valores de coluna longa na página do índice agrupado, com os bytes restantes armazenados em uma página de overflow</td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT=​DYNAMIC</code></th> <td></td> <td>Armazena valores dentro da página do índice agrupado se eles cabem; se não cabem, armazena apenas um ponteiro de 20 bytes para uma página de overflow (sem prefixo)</td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT=​COMPRESSED</code></th> <td></td> <td>Compacta a tabela e os índices usando zlib</td> </tr><tr> <th scope="row"><code class="literal">KEY_BLOCK_​SIZE=<em class="replaceable"><code>n</code></em></code></th> <td></td> <td>Especifica o tamanho da página compactada de 1, 2, 4, 8 ou 16 kilobytes; implica <code class="literal">ROW_FORMAT=COMPRESSED</code>. Para espaços de tabela gerais, um valor de <code class="literal">KEY_BLOCK_SIZE</code> igual ao tamanho da página do <code class="literal">InnoDB</code> não é permitido.</td> </tr></tbody></table>

A Tabela 17.10, “Avisos e Erros de Criação/Alteração de Tabela quando o Modo Rigor InnoDB está DESATIVADO”, resume as condições de erro que ocorrem com certas combinações de parâmetros e opções de configuração nas instruções `CREATE TABLE` ou `ALTER TABLE`, e como as opções aparecem na saída do `SHOW TABLE STATUS`.

Quando `innodb_strict_mode` está `OFF`, o MySQL cria ou altera a tabela, mas ignora certas configurações, conforme mostrado abaixo. Você pode ver os mensagens de aviso no log de erro do MySQL. Quando `innodb_strict_mode` está `ON`, essas combinações especificadas de opções geram erros, e a tabela não é criada ou alterada. Para ver a descrição completa da condição de erro, execute a instrução `SHOW ERRORS`: exemplo:

```
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

**Tabela 17.10 Avisos e Erros de Criação/Alteração de Tabela quando o Modo Rigor InnoDB está DESATIVADO**

<table summary="Avisos e erros de criação e alteração de tabelas quando o modo rigoroso do InnoDB está DESATIVADO."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Sintaxe</th> <th scope="col">Condição de Aviso ou Erro</th> <th scope="col"><code class="literal">ROW_FORMAT</code> resultante, conforme mostrado em <code class="literal">SHOW TABLE STATUS</code></th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">ROW_FORMAT=REDUNDANT</code></th> <td>Nenhum</td> <td><code class="literal">REDUNDANT</code></td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT=COMPACT</code></th> <td>Nenhum</td> <td><code class="literal">COMPACT</code></td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT=COMPRESSED</code> ou <code class="literal">ROW_FORMAT=DYNAMIC</code> ou <code class="literal">KEY_BLOCK_SIZE</code> é especificado</th> <td>Ignorado para espaços de tabelas por arquivo, a menos que <a class="link" href="innodb-parameters.html#sysvar_innodb_file_per_table"><code class="literal">innodb_file_per_table</code></a> esteja habilitado. Espaços de tabelas gerais suportam todos os formatos de linha. Veja <a class="xref" href="general-tablespaces.html" title="17.6.3.3 Espaços de Tabelas Gerais">Seção 17.6.3.3, “Espaços de Tabelas Gerais”</a>.</td> <td><code class="literal">o formato de linha padrão para espaços de tabelas por arquivo; o formato de linha especificado para espaços de tabelas gerais</code></td> </tr><tr> <th scope="row">Formato de <code class="literal">KEY_BLOCK_SIZE</code> inválido é especificado (não 1, 2, 4, 8 ou 16)</th> <td><code class="literal">KEY_BLOCK_SIZE</code> é ignorado</td> <td>o formato de linha especificado ou o formato de linha padrão</td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT=COMPRESSED</code> e <code class="literal">KEY_BLOCK_SIZE</code> válidos são especificados</th> <td>Nenhum; <code class="literal">KEY_BLOCK_SIZE</code> especificado é usado</td> <td><code class="literal">COMPRESSED</code></td> </tr><tr> <th scope="row"><code class="literal">KEY_BLOCK_SIZE</code> é especificado com <code class="literal">REDUNDANT</code>, <code class="literal">COMPACT</code> ou <code class="literal">DYNAMIC</code> formato de linha</th> <td><code class="literal">KEY_BLOCK_SIZE</code> é ignorado</td> <td><code class="literal">REDUNDANT</code>, <code class="literal">COMPACT</code> ou <code class="literal">DYNAMIC</code></td> </tr><tr> <th scope="row"><code class="literal">ROW_FORMAT</code> não é um dos formatos de linha <code class="literal">REDUNDANT</code>, <code class="literal">COMPACT</code>, <code class="literal">DYNAMIC</code> ou <code class="literal">COMPRESSED</code></th> <td>Ignorado se reconhecido pelo analisador MySQL. Caso contrário, um erro é emitido.</td> <td>o formato de linha padrão ou N/A</td> </tr></tbody></table>

Quando `innodb_strict_mode` está ativado, o MySQL rejeita parâmetros `ROW_FORMAT` ou `KEY_BLOCK_SIZE` inválidos e emite erros. O modo rigoroso está ativado por padrão. Quando `innodb_strict_mode` está desativado, o MySQL emite avisos em vez de erros para parâmetros inválidos ignorados.

Não é possível ver o `KEY_BLOCK_SIZE` escolhido usando `SHOW TABLE STATUS`. A instrução `SHOW CREATE TABLE` exibe o `KEY_BLOCK_SIZE` (mesmo que tenha sido ignorado ao criar a tabela). O tamanho real da página compactada da tabela não pode ser exibido pelo MySQL.

##### Sintaxe de Aviso e Erros de Compressão SQL para Espaços de Tabelas Gerais

* Se `FILE_BLOCK_SIZE` não foi definido para o espaço de tabelas geral quando o espaço de tabelas foi criado, o espaço de tabelas não pode conter tabelas compactadas. Se você tentar adicionar uma tabela compactada, um erro é retornado, como mostrado no exemplo a seguir:

  ```
  mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

  mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=8;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts1` cannot contain a COMPRESSED table
  ```

* Tentar adicionar uma tabela com um `KEY_BLOCK_SIZE` inválido a um espaço de tabelas geral retorna um erro, como mostrado no exemplo a seguir:

  ```
  mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=4;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts2` uses block size 8192 and cannot
  contain a table with physical page size 4096
  ```

  Para espaços de tabelas gerais, o `KEY_BLOCK_SIZE` da tabela deve ser igual ao `FILE_BLOCK_SIZE` do espaço de tabelas dividido por 1024. Por exemplo, se o `FILE_BLOCK_SIZE` do espaço de tabelas é 8192, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

* Tentar adicionar uma tabela com um formato de linha não compactado a um espaço de tabelas geral configurado para armazenar tabelas compactadas retorna um erro, como mostrado no exemplo a seguir:

  ```
  mysql> CREATE TABLESPACE `ts3` ADD DATAFILE 'ts3.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts3 ROW_FORMAT=COMPACT;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts3` uses block size 8192 and cannot
  contain a table with physical page size 16384
  ```

`innodb_strict_mode` não é aplicável a espaços de tabelas gerais. As regras de gerenciamento de espaço de tabelas para espaços de tabelas gerais são rigorosamente aplicadas independentemente de `innodb_strict_mode`. Para mais informações, consulte a Seção 15.1.25, “Instrução CREATE TABLESPACE”.

Para obter mais informações sobre o uso de tabelas compactadas com espaços de tabelas gerais, consulte a Seção 17.6.3.3, “Espaços de tabelas gerais”.