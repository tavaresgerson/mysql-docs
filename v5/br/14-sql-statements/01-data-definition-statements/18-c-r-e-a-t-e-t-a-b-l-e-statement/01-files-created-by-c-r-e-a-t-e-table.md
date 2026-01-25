#### 13.1.18.1 Arquivos Criados por CREATE TABLE

O MySQL representa cada tabela por um arquivo de formato (definição) de tabela `.frm` no diretório do Database. O Storage Engine para a tabela pode criar outros arquivos também.

Para uma tabela `InnoDB` criada em um tablespace file-per-table ou general tablespace, os dados da tabela e os Indexes associados são armazenados em um [.ibd file](glossary.html#glos_ibd_file ".ibd file") no diretório do Database. Quando uma tabela `InnoDB` é criada no system tablespace, os dados da tabela e os Indexes são armazenados nos [ibdata\* files](glossary.html#glos_ibdata_file "ibdata file") que representam o system tablespace. A opção [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) controla se as tabelas são criadas em tablespaces file-per-table ou no system tablespace, por padrão. A opção `TABLESPACE` pode ser usada para colocar uma tabela em um tablespace file-per-table, general tablespace, ou no system tablespace, independentemente da configuração de [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table).

Para tabelas `MyISAM`, o Storage Engine cria arquivos de dados e de Index. Assim, para cada tabela `MyISAM` *`tbl_name`*, existem três arquivos em disco.

<table summary="A finalidade dos arquivos em disco da tabela MyISAM tbl_name."><thead><tr> <th>Arquivo</th> <th>Finalidade</th> </tr></thead><tbody><tr> <td><code><em><code>tbl_name</code></em>.frm</code></td> <td>Arquivo de formato (definição) da Tabela</td> </tr><tr> <td><code><em><code>tbl_name</code></em>.MYD</code></td> <td>Arquivo de Dados</td> </tr><tr> <td><code><em><code>tbl_name</code></em>.MYI</code></td> <td>Arquivo de Index</td> </tr></tbody></table>

[Capítulo 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines"), descreve quais arquivos cada Storage Engine cria para representar tabelas. Se um nome de tabela contiver caracteres especiais, os nomes dos arquivos da tabela contêm versões codificadas desses caracteres, conforme descrito na [Seção 9.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”](identifier-mapping.html "9.2.4 Mapping of Identifiers to File Names").

##### Limites Impostos pela Estrutura do Arquivo .frm

Conforme descrito anteriormente, cada tabela possui um arquivo `.frm` que contém a definição da tabela. O Server usa a seguinte expressão para verificar algumas das informações da tabela armazenadas no arquivo em relação a um limite superior de 64KB:

```sql
if (info_length+(ulong) create_fields.elements*FCOMP+288+
    n_length+int_length+com_length > 65535L || int_count > 255)
```

A porção das informações armazenadas no arquivo `.frm` que é verificada em relação à expressão não pode ultrapassar o limite de 64KB; portanto, se a definição da tabela atingir esse tamanho, nenhuma coluna adicional poderá ser adicionada.

Os fatores relevantes na expressão são:

* `info_length` é o espaço necessário para "screens". Isso está relacionado à herança Unireg do MySQL.

* `create_fields.elements` é o número de colunas.

* `FCOMP` é 17.
* `n_length` é o comprimento total de todos os nomes de colunas, incluindo um byte por nome como separador.

* `int_length` está relacionado à lista de valores para colunas [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type"). Neste contexto, “int” não significa “integer”. Significa “intervalo” (interval), um termo que se refere coletivamente às colunas [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type").

* `int_count` é o número de definições únicas de [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type").

* `com_length` é o comprimento total dos comentários de coluna.

A expressão descrita acima tem várias implicações para as definições de tabela permitidas:

* Usar nomes de coluna longos pode reduzir o número máximo de colunas, assim como a inclusão de colunas [`ENUM`](enum.html "11.3.5 The ENUM Type") ou [`SET`](set.html "11.3.6 The SET Type"), ou o uso de comentários de coluna.

* Uma tabela não pode ter mais de 255 definições únicas de [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type"). Colunas com listas de elementos idênticas são consideradas iguais contra este limite. Por exemplo, se uma tabela contiver estas duas colunas, elas contam como uma (não duas) para este limite porque as definições são idênticas:

  ```sql
  e1 ENUM('a','b','c')
  e2 ENUM('a','b','c')
  ```

* A soma do comprimento dos nomes dos elementos nas definições únicas de [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type") é contabilizada no limite de 64KB, então, embora o limite teórico no número de elementos em uma determinada coluna [`ENUM`](enum.html "11.3.5 The ENUM Type") seja 65.535, o limite prático é inferior a 3.000.
