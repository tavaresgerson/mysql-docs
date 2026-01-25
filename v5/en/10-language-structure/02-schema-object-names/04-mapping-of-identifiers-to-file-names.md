### 9.2.4 Mapeamento de Identificadores para Nomes de Arquivos

Existe uma correspondência entre os *identifiers* de *database* e *table* e os nomes no *file system*. Para a estrutura básica, o MySQL representa cada *database* como um diretório no diretório de dados, e cada *table* por um ou mais arquivos no diretório de *database* apropriado. Para os arquivos de formato de *table* (`.FRM`), os dados são sempre armazenados nesta estrutura e local.

Para os arquivos de dados e *index*, a representação exata em disco é específica do *storage engine*. Esses arquivos podem ser armazenados no mesmo local que os arquivos `FRM`, ou a informação pode ser armazenada em um arquivo separado. Os dados do `InnoDB` são armazenados nos arquivos de dados do InnoDB. Se você estiver usando *tablespaces* com `InnoDB`, os arquivos de *tablespace* específicos que você cria são usados em vez disso.

Qualquer caractere é legal em *identifiers* de *database* ou *table*, exceto ASCII NUL (`X'00'`). O MySQL codifica quaisquer caracteres que sejam problemáticos nos objetos do *file system* correspondentes ao criar diretórios de *database* ou arquivos de *table*:

* Letras Latinas Básicas (`a..zA..Z`), dígitos (`0..9`) e *underscore* (`_`) são codificados como estão. Consequentemente, sua sensibilidade a maiúsculas/minúsculas depende diretamente das características do *file system*.

* Todas as outras letras nacionais de alfabetos que possuem mapeamento entre maiúsculas/minúsculas são codificadas conforme mostrado na tabela a seguir. Os valores na coluna Code Range (Intervalo de Código) são valores UCS-2.

  <table summary="A codificação para letras nacionais de alfabetos que possuem mapeamento entre maiúsculas/minúsculas, excluindo letras Latinas Básicas (a..zA..Z), dígitos (0..9) e underscore (_), que são codificados como estão."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 25%"/><thead><tr> <th>Intervalo de Código</th> <th>Padrão</th> <th>Número</th> <th>Usado</th> <th>Não Usado</th> <th>Blocos</th> </tr></thead><tbody><tr> <th>00C0..017F</th> <td>[@][0..4][g..z]</td> <td>5*20= 100</td> <td>97</td> <td>3</td> <td>Suplemento Latin-1 + Latim Estendido-A</td> </tr><tr> <th>0370..03FF</th> <td>[@][5..9][g..z]</td> <td>5*20= 100</td> <td>88</td> <td>12</td> <td>Grego e Copta</td> </tr><tr> <th>0400..052F</th> <td>[@][g..z][0..6]</td> <td>20*7= 140</td> <td>137</td> <td>3</td> <td>Cirílico + Suplemento Cirílico</td> </tr><tr> <th>0530..058F</th> <td>[@][g..z][7..8]</td> <td>20*2= 40</td> <td>38</td> <td>2</td> <td>Armênio</td> </tr><tr> <th>2160..217F</th> <td>[@][g..z][9]</td> <td>20*1= 20</td> <td>16</td> <td>4</td> <td>Formas Numéricas</td> </tr><tr> <th>0180..02AF</th> <td>[@][g..z][a..k]</td> <td>20*11=220</td> <td>203</td> <td>17</td> <td>Latim Estendido-B + Extensões IPA</td> </tr><tr> <th>1E00..1EFF</th> <td>[@][g..z][l..r]</td> <td>20*7= 140</td> <td>136</td> <td>4</td> <td>Latim Estendido Adicional</td> </tr><tr> <th>1F00..1FFF</th> <td>[@][g..z][s..z]</td> <td>20*8= 160</td> <td>144</td> <td>16</td> <td>Grego Estendido</td> </tr><tr> <th>.... ....</th> <td>[@][a..f][g..z]</td> <td>6*20= 120</td> <td>0</td> <td>120</td> <td>RESERVADO</td> </tr><tr> <th>24B6..24E9</th> <td>[@][@][a..z]</td> <td>26</td> <td>26</td> <td>0</td> <td>Alfanuméricos Inclusos</td> </tr><tr> <th>FF21..FF5A</th> <td>[@][a..z][@]</td> <td>26</td> <td>26</td> <td>0</td> <td>Formas de Meia Largura e Largura Total</td> </tr> </tbody></table>

  Um dos bytes na sequência codifica a caixa da letra (*lettercase*). Por exemplo: `LATIN CAPITAL LETTER A WITH GRAVE` é codificado como `@0G`, enquanto `LATIN SMALL LETTER A WITH GRAVE` é codificado como `@0g`. Aqui, o terceiro byte (`G` ou `g`) indica a caixa da letra. (Em um *file system* não sensível a maiúsculas/minúsculas, ambas as letras são tratadas como as mesmas.)

  Para alguns blocos, como Cirílico, o segundo byte determina a caixa da letra. Para outros blocos, como Suplemento Latin1, o terceiro byte determina a caixa da letra. Se dois bytes na sequência forem letras (como em Grego Estendido), o caractere de letra mais à esquerda representa a caixa da letra. Todos os outros bytes de letras devem estar em minúsculas.

* Todos os caracteres não literais, exceto *underscore* (`_`), bem como letras de alfabetos que não possuem mapeamento entre maiúsculas/minúsculas (como Hebraico) são codificados usando representação hexadecimal, utilizando letras minúsculas para os dígitos hexadecimais `a..f`:

  ```sql
  0x003F -> @003f
  0xFFFF -> @ffff
  ```

  Os valores hexadecimais correspondem aos valores dos caracteres no conjunto de caracteres de byte duplo `ucs2`.

No Windows, alguns nomes, como `nul`, `prn` e `aux`, são codificados anexando `@@@` ao nome quando o servidor cria o arquivo ou diretório correspondente. Isso ocorre em todas as plataformas para garantir a portabilidade do objeto de *database* correspondente entre plataformas.

Se você tiver *databases* ou *tables* de uma versão do MySQL anterior à 5.1.6 que contenham caracteres especiais e para os quais os nomes de diretório ou nomes de arquivo subjacentes não foram atualizados para usar a nova codificação, o servidor exibe seus nomes com um prefixo `#mysql50#` na saída das *tables* `INFORMATION_SCHEMA` ou comandos `SHOW`. Por exemplo, se você tiver uma *table* chamada `a@b` e sua codificação de nome não tiver sido atualizada, `SHOW TABLES` a exibirá assim:

```sql
mysql> SHOW TABLES;
+----------------+
| Tables_in_test |
+----------------+
| #mysql50#a@b   |
+----------------+
```

Para se referir a um nome cuja codificação não foi atualizada, você deve fornecer o prefixo `#mysql50#`:

```sql
mysql> SHOW COLUMNS FROM `a@b`;
ERROR 1146 (42S02): Table 'test.a@b' doesn't exist

mysql> SHOW COLUMNS FROM `#mysql50#a@b`;
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| i     | int(11) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
```

Para atualizar nomes antigos e eliminar a necessidade de usar o prefixo especial para se referir a eles, recodifique-os com **mysqlcheck**. Os seguintes comandos atualizam todos os nomes para a nova codificação:

```sql
mysqlcheck --check-upgrade --all-databases
mysqlcheck --fix-db-names --fix-table-names --all-databases
```

Para verificar apenas *databases* ou *tables* específicas, omita `--all-databases` e forneça os argumentos de *database* ou *table* apropriados. Para obter informações sobre a sintaxe de invocação do **mysqlcheck**, consulte a Seção 4.5.3, “mysqlcheck — Um Programa de Manutenção de Table”.

Note

O prefixo `#mysql50#` destina-se apenas a ser usado internamente pelo servidor. Você não deve criar *databases* ou *tables* com nomes que utilizem este prefixo.

Além disso, o **mysqlcheck** não pode corrigir nomes que contenham instâncias literais do caractere `@` que é usado para codificar caracteres especiais. Se você tiver *databases* ou *tables* que contenham este caractere, use o **mysqldump** para despejá-los antes de fazer o *upgrade* para o MySQL 5.1.6 ou posterior, e então recarregue o arquivo de *dump* após o *upgrade*.

Note

A conversão de nomes de *databases* anteriores ao MySQL 5.1 que contêm caracteres especiais para o formato 5.1 com a adição de um prefixo `#mysql50#` está obsoleta (*deprecated*); espere que seja removida em uma futura versão do MySQL. Como tais conversões estão obsoletas, as opções `--fix-db-names` e `--fix-table-names` para o **mysqlcheck** e a cláusula `UPGRADE DATA DIRECTORY NAME` para a instrução `ALTER DATABASE` também estão obsoletas.

*Upgrades* são suportados apenas de uma série de lançamento para outra (por exemplo, 5.0 para 5.1, ou 5.1 para 5.5), portanto, deve haver pouca necessidade remanescente de conversão de nomes de *database* mais antigos da versão 5.0 para as versões atuais do MySQL. Como solução alternativa (*workaround*), faça o *upgrade* de uma instalação do MySQL 5.0 para o MySQL 5.1 antes de fazer o *upgrade* para um lançamento mais recente.