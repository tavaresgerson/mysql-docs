### 11.2.4 Mapeamento de Identificadores para Nomes de Arquivos

Existe uma correspondência entre os identificadores de banco de dados e tabelas e os nomes dos arquivos no sistema de arquivos. Para a estrutura básica, o MySQL representa cada banco de dados como um diretório no diretório de dados, e, dependendo do mecanismo de armazenamento, cada tabela pode ser representada por um ou mais arquivos no diretório do banco de dados apropriado.

Para os arquivos de dados e índices, a representação exata no disco é específica do mecanismo de armazenamento. Esses arquivos podem ser armazenados no diretório do banco de dados ou as informações podem ser armazenadas em um arquivo separado. Os dados do `InnoDB` são armazenados nos arquivos de dados do InnoDB. Se você estiver usando tabelaspaces com `InnoDB`, então os arquivos específicos do tabelaspace que você criar são usados em vez disso.

Qualquer caractere é legal nos identificadores de banco de dados ou tabelas, exceto o ASCII NUL (`X'00'`). O MySQL codifica quaisquer caracteres problemáticos nos objetos correspondentes do sistema de arquivos ao criar diretórios de banco de dados ou arquivos de tabela:

* Letras latinas básicas (`a..zA..Z`), dígitos (`0..9`) e sublinhado (`_`) são codificados como estão. Consequentemente, sua sensibilidade ao caso depende diretamente das características do sistema de arquivos.

* Todos os outros caracteres das letras de alfabetos que têm mapeamento de maiúsculas/minúsculas são codificados conforme mostrado na tabela a seguir. Os valores na coluna Código de intervalo são valores UCS-2.

<table summary="O codificação para letras nacionais de alfabetos que possuem mapeamento de maiúsculas/minúsculas, excluindo letras latinas básicas (a..zA..Z), dígitos (0..9) e sublinhado (_), que são codificados como estão."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 25%"/><thead><tr> <th>Intervalo de Código</th> <th>Padrão</th> <th>Número</th> <th>Usado</th> <th>Não Usado</th> <th>Blocos</th> </tr></thead><tbody><tr> <th>00C0..017F</th> <td>[@][0..4][g..z]</td> <td>5*20= 100</td> <td>97</td> <td>3</td> <td>Suplimento Latin-1 + Latin Extended-A</td> </tr><tr> <th>0370..03FF</th> <td>[@][5..9][g..z]</td> <td>5*20= 100</td> <td>88</td> <td>12</td> <td>Grego e Copta</td> </tr><tr> <th>0400..052F</th> <td>[@][g..z][0..6]</td> <td>20*7= 140</td> <td>137</td> <td>3</td> <td>Cirílico + Suplimento Cirílico</td> </tr><tr> <th>0530..058F</th> <td>[@][g..z][7..8]</td> <td>20*2= 40</td> <td>38</td> <td>2</td> <td>Armênio</td> </tr><tr> <th>2160..217F</th> <td>[@][g..z][9]</td> <td>20*1= 20</td> <td>16</td> <td>4</td> <td>Formas de Número</td> </tr><tr> <th>0180..02AF</th> <td>[@][g..z][a..k]</td> <td>20*11=220</td> <td>203</td> <td>17</td> <td>Latin Extended-B + Extensões IPA</td> </tr><tr> <th>1E00..1EFF</th> <td>[@][g..z][l..r]</td> <td>20*7= 140</td> <td>136</td> <td>4</td> <td>Latin Extended Additional</td> </tr><tr> <th>1F00..1FFF</th> <td>[@][g..z][s..z]</td> <td>20*8= 160</td> <td>144</td> <td>16</td> <td>Grego Extendido</td> </tr><tr> <th>.... ....</th> <td>[@][a..f][g..z]</td> <td>6*20= 120</td> <td>0</td> <td>120</td> <td>RESERVADAS</td> </tr><tr> <th>24B6..24E9</th> <td>[@][@][a..z]</td> <td>26</td> <td>26</td> <td>0</td> <td>Alfanuméricos Encerrados</td> </tr><tr> <th>FF21..FF5A</th> <td>[@][a..z][@]</td> <td>26</td> <td>26</td> <td>0</td> <td>Formas de Halfwidth e Fullwidth</td> </tr></tbody></table>

Um dos bytes na sequência codifica a maiúscula. Por exemplo: `LATINA MAIÚSCOLA LETRA A COM ACENTUADO` é codificado como `@0G`, enquanto `LATINA MINÚSCOLA LETRA A COM ACENTUADO` é codificado como `@0g`. Aqui, o terceiro byte (`G` ou `g`) indica a maiúscula. (Em um sistema de arquivos case-insensitive, ambas as letras são tratadas como a mesma.)

Para alguns blocos, como o cirílico, o segundo byte determina a maiúscula. Para outros blocos, como o Suplemento Latin1, o terceiro byte determina a maiúscula. Se dois bytes na sequência forem letras (como no grego estendido), o caractere da letra mais à esquerda representa a maiúscula. Todos os outros bytes de letras devem estar em minúsculas.

* Todos os caracteres não-letras, exceto sublinhado (`_`), bem como letras de alfabetos que não têm mapeamento de maiúsculas/minúsculas (como o hebraico), são codificados usando representação hexadecimal com letras minúsculas para dígitos hexadecimais `a..f`:

  ```
  0x003F -> @003f
  0xFFFF -> @ffff
  ```

Os valores hexadecimais correspondem aos valores de caracteres no conjunto de caracteres de dois bytes `ucs2`.

No Windows, alguns nomes, como `nul`, `prn` e `aux`, são codificados anexando `@@@` ao nome quando o servidor cria o arquivo ou diretório correspondente. Isso ocorre em todas as plataformas para a portabilidade do objeto de banco de dados correspondente entre as plataformas.

Os seguintes nomes são reservados e anexados com `@@@` se usados em nomes de esquema ou tabela:

* CON
* PRN
* AUX
* NUL
* COM1 a COM9
* LPT1 a LPT9

CLOCK$ também é membro deste grupo de nomes reservados, mas não é anexado com `@@@`, mas sim `@0024`. Ou seja, se CLOCK$ for usado como nome de esquema ou tabela, ele é escrito no sistema de arquivos como `CLOCK@0024`. O mesmo vale para qualquer uso de `$` (símbolo de dólar) em um nome de esquema ou tabela; ele é substituído por `@0024` no sistema de arquivos.

Nota

Esses nomes também são escritos em `INNODB_TABLES` em suas formas anexadas, mas são escritos em `TABLES` em sua forma não anexada, conforme inserido pelo usuário.