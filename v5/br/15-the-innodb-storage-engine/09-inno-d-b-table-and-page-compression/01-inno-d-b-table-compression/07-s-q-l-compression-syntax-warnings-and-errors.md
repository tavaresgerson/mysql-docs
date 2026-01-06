#### 14.9.1.7 Avisos e erros de sintaxe de compressão de SQL

Esta seção descreve os avisos e erros de sintaxe que você pode encontrar ao usar o recurso de compressão de tabelas com espaços de tabelas por arquivo e espaços de tabelas gerais.

##### Avisos e erros de sintaxe de compressão SQL para espaços de tabelas por arquivo

Quando o modo `innodb_strict_mode` está ativado (o padrão), especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` nas instruções `CREATE TABLE` ou `ALTER TABLE` produz o seguinte erro se `innodb_file_per_table` estiver desativado ou se `innodb_file_format` estiver definido como `Antelope` em vez de `Barracuda`.

```sql
ERROR 1031 (HY000): Table storage engine for 't1' does not have this option
```

Nota

A tabela não é criada se a configuração atual não permitir o uso de tabelas compactadas.

Quando o `innodb_strict_mode` é desativado, especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` nas instruções `CREATE TABLE` ou `ALTER TABLE` produz os seguintes avisos se o `innodb_file_per_table` estiver desativado.

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

Avisos semelhantes são emitidos se `innodb_file_format` estiver definido como `Antelope` em vez de `Barracuda`.

Nota

Essas mensagens são apenas avisos, não erros, e a tabela é criada sem compressão, como se as opções não fossem especificadas.

O comportamento "não estrito" permite que você importe um arquivo `mysqldump` em um banco de dados que não suporte tabelas compactadas, mesmo que o banco de dados de origem contenha tabelas compactadas. Nesse caso, o MySQL cria a tabela em `ROW_FORMAT=COMPACT` em vez de impedir a operação.

Para importar o arquivo de dump em um novo banco de dados e recriar as tabelas conforme estão no banco de dados original, certifique-se de que o servidor tenha as configurações adequadas para os parâmetros de configuração `innodb_file_format` e `innodb_file_per_table`.

O atributo `KEY_BLOCK_SIZE` é permitido apenas quando `ROW_FORMAT` é especificado como `COMPRESSED` ou é omitido. Especificar um `KEY_BLOCK_SIZE` com qualquer outro `ROW_FORMAT` gera uma mensagem de aviso que você pode visualizar com `SHOW WARNINGS`. No entanto, a tabela não é compactada; o `KEY_BLOCK_SIZE` especificado é ignorado).

<table summary="Nível de alerta, código de erro e texto da mensagem para mensagens que podem ser geradas ao usar cláusulas conflitantes para a compressão de tabelas InnoDB."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Nível</th> <th scope="col">Código</th> <th scope="col">Mensagem</th> </tr></thead><tbody><tr> <th scope="row">Aviso</th> <td>1478</td> <td>[[<code class="literal"> InnoDB: ignoring KEY_BLOCK_SIZE=<em class="replaceable"><code>n</code>]]</em>a menos que ROW_FORMAT=COMPRESSED.</code></td> </tr></tbody></table>

Se você estiver rodando com o `innodb_strict_mode` habilitado, a combinação de um `KEY_BLOCK_SIZE` com qualquer `ROW_FORMAT` diferente de `COMPRESSED` gera um erro, não um aviso, e a tabela não é criada.

A Tabela 14.6, “Opções ROW\_FORMAT e KEY\_BLOCK\_SIZE”, fornece uma visão geral das opções `ROW_FORMAT` e `KEY_BLOCK_SIZE` que são usadas com `CREATE TABLE` ou `ALTER TABLE`.

**Tabela 14.6 Opções ROW\_FORMAT e KEY\_BLOCK\_SIZE**

<table summary="Observações e descrições sobre o uso das opções ROW_FORMAT e KEY_BLOCK_SIZE."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col">Opção</th> <th scope="col">Observações de uso</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th scope="row">[[PH_HTML_CODE_<code class="literal">KEY_BLOCK_SIZE</code>]</th> <td>Formato de armazenamento usado antes do MySQL 5.0.3</td> <td>Menos eficiente que [[PH_HTML_CODE_<code class="literal">KEY_BLOCK_SIZE</code>]; para compatibilidade reversa</td> </tr><tr> <th scope="row">[[<code class="literal">ROW_FORMAT=​COMPACT</code>]]</th> <td>Formato de armazenamento padrão desde o MySQL 5.0.3</td> <td>Armazena um prefixo de 768 bytes de valores de coluna longa na página do índice agrupado, com os bytes restantes armazenados em uma página de sobreposição</td> </tr><tr> <th scope="row">[[<code class="literal">ROW_FORMAT=​DYNAMIC</code>]]</th> <td>Os espaços de tabela por arquivo exigem [[<code class="literal">innodb_file​_format=Barracuda</code>]]</td> <td>Armazene os valores dentro da página do índice agrupado se eles se encaixarem; caso contrário, armazene apenas um ponteiro de 20 bytes para uma página de sobreposição (sem prefixo)</td> </tr><tr> <th scope="row">[[<code class="literal">ROW_FORMAT=​COMPRESSED</code>]]</th> <td>Os espaços de tabela por arquivo exigem [[<code class="literal">innodb_file​_format=Barracuda</code>]]</td> <td>Compreende a tabela e os índices usando zlib</td> </tr><tr> <th scope="row">[[<code class="literal">KEY_BLOCK_​SIZE=<em class="replaceable"><code>n</code>]]</em></code></th> <td>Os espaços de tabela por arquivo exigem [[<code class="literal">innodb_file​_format=Barracuda</code>]]</td> <td>Especifica o tamanho de página compactada de 1, 2, 4, 8 ou 16 kilobytes; implica em [[<code class="literal">ROW_FORMAT=COMPRESSED</code>]]. Para espaços de tabelas gerais, um valor [[<code class="literal">KEY_BLOCK_SIZE</code>]] igual ao tamanho de página [[<code class="literal">ROW_FORMAT=COMPACT</code><code class="literal">KEY_BLOCK_SIZE</code>] não é permitido.</td> </tr></tbody></table>

A Tabela 14.7, “Avisos e Erros de Criação/Alteração de Tabela quando o Modo Rigor do InnoDB está DESATIVADO”, resume as condições de erro que ocorrem com certas combinações de parâmetros e opções de configuração nas instruções `CREATE TABLE` ou `ALTER TABLE`, e como as opções aparecem na saída do `SHOW TABLE STATUS`.

Quando `innodb_strict_mode` é `OFF`, o MySQL cria ou altera a tabela, mas ignora certas configurações, conforme mostrado abaixo. Você pode ver as mensagens de aviso no log de erro do MySQL. Quando `innodb_strict_mode` é `ON`, essas combinações especificadas de opções geram erros, e a tabela não é criada ou alterada. Para ver a descrição completa da condição de erro, execute a instrução `SHOW ERRORS`: exemplo:

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

**Tabela 14.7: Avisos e Erros de Criação/Alteração de Tabelas quando o Modo Estrito do InnoDB está DESATIVADO**

<table summary="Criar e alterar avisos e erros de tabela quando o modo rigoroso do InnoDB está desativado."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Sintaxe</th> <th scope="col">Condição de Aviso ou Erro</th> <th scope="col">Resultado [[PH_HTML_CODE_<code class="literal">=Barracuda</code>], conforme mostrado em [[PH_HTML_CODE_<code class="literal">=Barracuda</code>]</th> </tr></thead><tbody><tr> <th scope="row">[[PH_HTML_CODE_<code class="literal">innodb_file_format</code>]</th> <td>Nenhum</td> <td>[[PH_HTML_CODE_<code class="literal">innodb_file_per_table</code>]</td> </tr><tr> <th scope="row">[[PH_HTML_CODE_<code class="literal">the default row format for file-per-table tablespaces; the specified row format for general tablespaces</code>]</th> <td>Nenhum</td> <td>[[PH_HTML_CODE_<code class="literal">KEY_BLOCK_SIZE</code>]</td> </tr><tr> <th scope="row">É especificado [[PH_HTML_CODE_<code class="literal">KEY_BLOCK_SIZE</code>] ou [[PH_HTML_CODE_<code class="literal">ROW_FORMAT=COMPRESSED</code>] ou [[PH_HTML_CODE_<code class="literal">KEY_BLOCK_SIZE</code>]</th> <td>Ignorado para tabelas de espaços de arquivo por tabela, a menos que ambos<a class="link" href="innodb-parameters.html#sysvar_innodb_file_format">[[PH_HTML_CODE_<code class="literal">KEY_BLOCK_SIZE</code>]</a>[[<code class="literal">=Barracuda</code>]] e<a class="link" href="innodb-parameters.html#sysvar_innodb_file_per_table">[[<code class="literal">SHOW TABLE STATUS</code><code class="literal">=Barracuda</code>]</a>As tabelas gerais suportam todos os formatos de linha (com algumas restrições), independentemente<a class="link" href="innodb-parameters.html#sysvar_innodb_file_format">[[<code class="literal">innodb_file_format</code>]]</a>e<a class="link" href="innodb-parameters.html#sysvar_innodb_file_per_table">[[<code class="literal">innodb_file_per_table</code>]]</a>configurações. Veja<a class="xref" href="general-tablespaces.html" title="14.6.3.3 Tabelaspaces Gerais">Seção 14.6.3.3, “Tabelas gerais”</a>.</td> <td>[[<code class="literal">the default row format for file-per-table tablespaces; the specified row format for general tablespaces</code>]]</td> </tr><tr> <th scope="row">O código [[<code class="literal">KEY_BLOCK_SIZE</code>]] inválido foi especificado (não 1, 2, 4, 8 ou 16)</th> <td>[[<code class="literal">KEY_BLOCK_SIZE</code>]] é ignorado</td> <td>o formato de linha especificado ou o formato de linha padrão</td> </tr><tr> <th scope="row">[[<code class="literal">ROW_FORMAT=COMPRESSED</code>]] e [[<code class="literal">KEY_BLOCK_SIZE</code>]] válidos são especificados</th> <td>Nenhum; [[<code class="literal">KEY_BLOCK_SIZE</code>]] especificado é usado</td> <td>[[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">=Barracuda</code>]</td> </tr><tr> <th scope="row">O formato de linha [[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">=Barracuda</code>] é especificado com os formatos de linha [[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">innodb_file_format</code>], [[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">innodb_file_per_table</code>] ou [[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">the default row format for file-per-table tablespaces; the specified row format for general tablespaces</code>]</th> <td>[[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">KEY_BLOCK_SIZE</code>] é ignorado</td> <td>[[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">KEY_BLOCK_SIZE</code>], [[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">ROW_FORMAT=COMPRESSED</code>] ou [[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">KEY_BLOCK_SIZE</code>]</td> </tr><tr> <th scope="row">[[<code class="literal">ROW_FORMAT=REDUNDANT</code><code class="literal">KEY_BLOCK_SIZE</code>] não é um dos [[<code class="literal">REDUNDANT</code><code class="literal">=Barracuda</code>], [[<code class="literal">REDUNDANT</code><code class="literal">=Barracuda</code>], [[<code class="literal">REDUNDANT</code><code class="literal">innodb_file_format</code>] ou [[<code class="literal">REDUNDANT</code><code class="literal">innodb_file_per_table</code>]</th> <td>Ignorado se reconhecido pelo analisador MySQL. Caso contrário, um erro é emitido.</td> <td>o formato padrão da linha ou N/A</td> </tr></tbody></table>

Quando `innodb_strict_mode` está ativado, o MySQL rejeita parâmetros `ROW_FORMAT` ou `KEY_BLOCK_SIZE` inválidos e emite erros. Quando `innodb_strict_mode` está desativado, o MySQL emite avisos em vez de erros para parâmetros inválidos ignorados. `innodb_strict_mode` está ativado por padrão.

Quando `innodb_strict_mode` está ativado, o MySQL rejeita parâmetros `ROW_FORMAT` ou `KEY_BLOCK_SIZE` inválidos. Para compatibilidade com versões anteriores do MySQL, o modo rigoroso não é ativado por padrão; em vez disso, o MySQL emite avisos (não erros) para parâmetros inválidos ignorados.

Não é possível ver o `KEY_BLOCK_SIZE` escolhido usando `SHOW TABLE STATUS`. A instrução `SHOW CREATE TABLE` exibe o `KEY_BLOCK_SIZE` (mesmo que ele tenha sido ignorado ao criar a tabela). O tamanho real da página comprimida da tabela não pode ser exibido pelo MySQL.

##### Avisos e erros de sintaxe de compressão SQL para espaços de tabelas gerais

- Se o `FILE_BLOCK_SIZE` não foi definido para o espaço de tabela geral quando o espaço de tabela foi criado, o espaço de tabela não pode conter tabelas compactadas. Se você tentar adicionar uma tabela compactada, um erro será retornado, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

  mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=8;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts1` cannot contain a COMPRESSED table
  ```

- Tentar adicionar uma tabela com um `KEY_BLOCK_SIZE` inválido a um espaço de tabelas geral retorna um erro, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=4;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts2` uses block size 8192 and cannot
  contain a table with physical page size 4096
  ```

  Para tabelas gerais, o `KEY_BLOCK_SIZE` da tabela deve ser igual ao `FILE_BLOCK_SIZE` do tablespace dividido por 1024. Por exemplo, se o `FILE_BLOCK_SIZE` do tablespace for 8192, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

- Tentar adicionar uma tabela com um formato de linha não compactada a um espaço de tabelas geral configurado para armazenar tabelas compactadas retorna um erro, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts3` ADD DATAFILE 'ts3.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts3 ROW_FORMAT=COMPACT;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts3` uses block size 8192 and cannot
  contain a table with physical page size 16384
  ```

O `innodb_strict_mode` não é aplicável a espaços de tabelas gerais. As regras de gerenciamento de espaços de tabelas para espaços de tabelas gerais são rigorosamente aplicadas independentemente do `innodb_strict_mode`. Para mais informações, consulte a Seção 13.1.19, “Instrução CREATE TABLESPACE”.

Para obter mais informações sobre o uso de tabelas compactadas com espaços de tabelas gerais, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.
