### 9.2.4 Mapeamento de Identificadores para Nomes de Arquivos

Existe uma correspondência entre os identificadores e os nomes de bancos de dados e tabelas no sistema de arquivos. Para a estrutura básica, o MySQL representa cada banco de dados como um diretório no diretório de dados, e cada tabela por um ou mais arquivos no diretório do banco de dados apropriado. Para os arquivos de formato de tabela (`.FRM`), os dados são sempre armazenados nesta estrutura e localização.

Para os arquivos de dados e índices, a representação exata no disco é específica do mecanismo de armazenamento. Esses arquivos podem ser armazenados na mesma localização que os arquivos `FRM`, ou as informações podem ser armazenadas em um arquivo separado. Os dados do `InnoDB` são armazenados nos arquivos de dados do InnoDB. Se você estiver usando tablespaces com `InnoDB`, então os arquivos de tablespace específicos que você criar serão usados em vez disso.

Qualquer caractere é válido para identificadores de banco de dados ou tabelas, exceto o ASCII NUL (`X'00'`). O MySQL codifica quaisquer caracteres problemáticos nos objetos correspondentes do sistema de arquivos ao criar diretórios de banco de dados ou arquivos de tabela:

- As letras latinas básicas (`a..zA..Z`), dígitos (`0..9`) e sublinhado (`_`) são codificadas como estão. Consequentemente, sua sensibilidade ao caso depende diretamente das características do sistema de arquivos.

- Todas as outras letras nacionais de alfabetos que possuem mapeamento maiúsculo/minúsculo são codificadas conforme mostrado na tabela a seguir. Os valores na coluna Código de intervalo são valores UCS-2.

  <table summary="A codificação para letras nacionais de alfabetos que possuem mapeamento de maiúsculas/minúsculas, excluindo letras latinas básicas (a..zA..Z), dígitos (0..9) e sublinhado (_), que são codificados como estão."><thead><tr><th>Code Range</th><th>Pattern</th><th>Number</th><th>Used</th><th>Unused</th><th>Blocks</th></tr></thead><tbody><tr><th>00C0..017F</th><td>[@][0..4][g..z]</td><td>5*20= 100</td><td>97</td><td>3</td><td>Latin-1 Supplement + Latin Extended-A</td></tr><tr><th>0370..03FF</th><td>[@][5..9][g..z]</td><td>5*20= 100</td><td>88</td><td>12</td><td>Greek and Coptic</td></tr><tr><th>0400..052F</th><td>[@][g..z][0..6]</td><td>20*7= 140</td><td>137</td><td>3</td><td>Cyrillic + Cyrillic Supplement</td></tr><tr><th>0530..058F</th><td>[@][g..z][7..8]</td><td>20*2= 40</td><td>38</td><td>2</td><td>Armenian</td></tr><tr><th>2160..217F</th><td>[@][g..z][9]</td><td>20*1= 20</td><td>16</td><td>4</td><td>Number Forms</td></tr><tr><th>0180..02AF</th><td>[@][g..z][a..k]</td><td>20*11=220</td><td>203</td><td>17</td><td>Latin Extended-B + IPA Extensions</td></tr><tr><th>1E00..1EFF</th><td>[@][g..z][l..r]</td><td>20*7= 140</td><td>136</td><td>4</td><td>Latin Extended Additional</td></tr><tr><th>1F00..1FFF</th><td>[@][g..z][s..z]</td><td>20*8= 160</td><td>144</td><td>16</td><td>Greek Extended</td></tr><tr><th>.... ....</th><td>[@][a..f][g..z]</td><td>6*20= 120</td><td>0</td><td>120</td><td>RESERVED</td></tr><tr><th>24B6..24E9</th><td>[@][@][a..z]</td><td>26</td><td>26</td><td>0</td><td>Enclosed Alphanumerics</td></tr><tr><th>FF21..FF5A</th><td>[@][a..z][@]</td><td>26</td><td>26</td><td>0</td><td>Halfwidth and Fullwidth forms</td></tr></tbody></table>

  Um dos bytes na sequência codifica a maiúscula. Por exemplo: `LATIN CAPITAL LETTER A WITH GRAVE` é codificado como `@0G`, enquanto `LATIN SMALL LETTER A WITH GRAVE` é codificado como `@0g`. Aqui, o terceiro byte (`G` ou `g`) indica a maiúscula. (Em um sistema de arquivos que não é case-sensitive, ambas as letras são tratadas como a mesma.)

  Para alguns blocos, como o cirílico, o segundo byte determina a maiúscula das letras. Para outros blocos, como o Latin1 Supplement, o terceiro byte determina a maiúscula das letras. Se dois bytes na sequência forem letras (como no grego estendido), o caractere da letra mais à esquerda representa a maiúscula. Todos os outros bytes de letras devem estar em minúsculas.

- Todos os caracteres não alfanuméricos, exceto o sublinhado (`_`), bem como as letras de alfabetos que não têm mapeamento de maiúsculas/minúsculas (como o hebraico), são codificados usando representação hexadecimal, com letras minúsculas para os algarismos hexadecimais `a..f`:

  ```sql
  0x003F -> @003f
  0xFFFF -> @ffff
  ```

  Os valores hexadecimais correspondem aos valores de caracteres no conjunto de caracteres de dois bytes `ucs2`.

Em Windows, alguns nomes, como `nul`, `prn` e `aux`, são codificados anexando `@@@` ao nome quando o servidor cria o arquivo ou diretório correspondente. Isso ocorre em todas as plataformas para garantir a portabilidade do objeto de banco de dados correspondente entre as plataformas.

Se você tiver bancos de dados ou tabelas de uma versão do MySQL mais antiga que 5.1.6 que contenham caracteres especiais e para as quais os nomes dos diretórios ou arquivos subjacentes não tenham sido atualizados para usar o novo codificação, o servidor exibe seus nomes com um prefixo de `#mysql50#` na saída das tabelas do `INFORMATION_SCHEMA` ou nas declarações `SHOW`. Por exemplo, se você tiver uma tabela chamada `a@b` e seu nome de codificação não tiver sido atualizado, o `SHOW TABLES` a exibe assim:

```sql
mysql> SHOW TABLES;
+----------------+
| Tables_in_test |
+----------------+
| #mysql50#a@b   |
+----------------+
```

Para se referir a um nome para o qual a codificação não tenha sido atualizada, você deve fornecer o prefixo `#mysql50#`:

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

Para atualizar os nomes antigos e eliminar a necessidade de usar o prefixo especial para referenciá-los, re-encode-os com **mysqlcheck**. Os seguintes comandos atualizam todos os nomes para a nova codificação:

```sql
mysqlcheck --check-upgrade --all-databases
mysqlcheck --fix-db-names --fix-table-names --all-databases
```

Para verificar apenas bancos de dados ou tabelas específicos, omita `--all-databases` e forneça os argumentos apropriados para o banco de dados ou tabela. Para obter informações sobre a sintaxe de invocação do **mysqlcheck**, consulte a Seção 4.5.3, “mysqlcheck — Um Programa de Manutenção de Tabelas”.

Nota

O prefixo `#mysql50#` é destinado apenas para uso interno pelo servidor. Você não deve criar bancos de dados ou tabelas com nomes que utilizem este prefixo.

Além disso, o **mysqlcheck** não pode corrigir nomes que contenham instâncias literais do caractere `@`, que é usado para codificar caracteres especiais. Se você tiver bancos de dados ou tabelas que contenham esse caractere, use **mysqldump** para fazer o dump deles antes de atualizar para o MySQL 5.1.6 ou uma versão posterior, e depois recarregue o arquivo de dump após a atualização.

Nota

A conversão de nomes de bancos de dados anteriores ao MySQL 5.1 que contêm caracteres especiais para o formato 5.1, com a adição do prefixo `#mysql50#`, está desaconselhada; espera-se que seja removida em uma versão futura do MySQL. Como essas conversões estão desaconselhadas, as opções `--fix-db-names` e `--fix-table-names` para o **mysqlcheck** e a cláusula `UPGRADE DATA DIRECTORY NAME` para a instrução `ALTER DATABASE` também estão desaconselhadas.

As atualizações são suportadas apenas de uma série de lançamentos para outra (por exemplo, 5.0 para 5.1 ou 5.1 para 5.5), portanto, deve haver pouca necessidade de conversão de nomes de bancos de dados mais antigos de 5.0 para as versões atuais do MySQL. Como solução alternativa, atualize uma instalação do MySQL 5.0 para o MySQL 5.1 antes de fazer a atualização para uma versão mais recente.
