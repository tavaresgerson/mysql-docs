#### 13.1.18.1 Arquivos criados por CREATE TABLE

MySQL representa cada tabela por um arquivo de formato `.frm` (definição) no diretório do banco de dados. O mecanismo de armazenamento da tabela pode criar outros arquivos também.

Para uma tabela `InnoDB` criada em um espaço de tabelas por arquivo ou espaço de tabelas geral, os dados da tabela e os índices associados são armazenados em um arquivo .ibd no diretório do banco de dados. Quando uma tabela `InnoDB` é criada no espaço de tabelas do sistema, os dados da tabela e os índices são armazenados nos arquivos ibdata\* que representam o espaço de tabelas do sistema. A opção `TABLESPACE` pode ser usada para colocar uma tabela em um espaço de tabelas por arquivo, espaço de tabelas geral ou espaço de tabelas do sistema, independentemente da configuração da variável de sistema `innodb_file_per_table` (innodb-parameters.html#sysvar\_innodb\_file\_per\_table).

Para as tabelas `MyISAM`, o mecanismo de armazenamento cria arquivos de dados e índices. Assim, para cada tabela `MyISAM *` `tbl_name *`, existem três arquivos no disco.

<table summary="O propósito dos arquivos de disco da tabela MyISAM tbl_name."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Arquivo</th> <th>Objetivo</th> </tr></thead><tbody><tr> <td>[[<code class="filename"><em class="replaceable"><code>tbl_name</code>]]</em>.frm</code></td> <td>Arquivo de formato de tabela (definição)</td> </tr><tr> <td>[[<code class="filename"><em class="replaceable"><code>tbl_name</code>]]</em>.MYD</code></td> <td>Arquivo de dados</td> </tr><tr> <td>[[<code class="filename"><em class="replaceable"><code>tbl_name</code>]]</em>.MYI</code></td> <td>Arquivo de índice</td> </tr></tbody></table>

\[Capítulo 15, *Motores de Armazenamento Alternativos*] (storage-engines.html), descreve quais arquivos cada motor de armazenamento cria para representar tabelas. Se o nome de uma tabela contiver caracteres especiais, os nomes dos arquivos da tabela contêm versões codificadas desses caracteres, conforme descrito em Seção 9.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”.

##### Limitações impostas pela estrutura do arquivo .frm

Como descrito anteriormente, cada tabela tem um arquivo `.frm` que contém a definição da tabela. O servidor usa a seguinte expressão para verificar algumas das informações da tabela armazenadas no arquivo contra um limite máximo de 64 KB:

```sql
if (info_length+(ulong) create_fields.elements*FCOMP+288+
    n_length+int_length+com_length > 65535L || int_count > 255)
```

A porção da informação armazenada no arquivo `.frm` que é verificada contra a expressão não pode ultrapassar o limite de 64 KB, portanto, se a definição da tabela atingir esse tamanho, não será possível adicionar mais colunas.

Os fatores relevantes na expressão são:

- `info_length` é o espaço necessário para "ecrans". Isso está relacionado à herança Unireg do MySQL.

- `create_fields.elements` é o número de colunas.

- `FCOMP` é 17.

- `n_length` é o comprimento total de todos os nomes de coluna, incluindo um byte por nome como separador.

- `int_length` está relacionado à lista de valores das colunas `ENUM` (enum.html) e `SET` (set.html). Nesse contexto, “int” não significa “inteiro”. Significa “intervalo”, um termo que se refere coletivamente às colunas `ENUM` (enum.html) e `SET` (set.html).

- `int_count` é o número de definições únicas de `ENUM` e `SET`.

- `com_length` é o comprimento total dos comentários da coluna.

A expressão descrita acima tem várias implicações para as definições de tabelas permitidas:

- O uso de nomes de colunas longos pode reduzir o número máximo de colunas, assim como a inclusão de colunas `[ENUM]` (enum.html) ou `[SET]` (set.html), ou o uso de comentários nas colunas.

- Uma tabela não pode ter mais de 255 definições únicas de `ENUM` e `SET`. Colunas com listas de elementos idênticas são consideradas iguais para este limite. Por exemplo, se uma tabela contiver estas duas colunas, elas contam como uma (e não duas) para este limite, porque as definições são idênticas:

  ```sql
  e1 ENUM('a','b','c')
  e2 ENUM('a','b','c')
  ```

- A soma da extensão dos nomes dos elementos nas definições únicas de `ENUM` e `SET` conta para o limite de 64 KB, então, embora o limite teórico de número de elementos em uma coluna específica de `ENUM` seja de 65.535, o limite prático é menor que 3000.
