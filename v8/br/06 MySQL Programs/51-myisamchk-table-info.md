#### 6.6.4.5 Obtenção de informações de tabela com myisamchk

Para obter uma descrição de uma tabela `MyISAM` ou estatísticas sobre ela, use os comandos mostrados aqui. A saída desses comandos é explicada mais adiante nesta seção.

- - Não, não, não,

  Se você iniciar o servidor MySQL com bloqueio externo desativado, `myisamchk` pode relatar um erro para uma tabela que é atualizada enquanto ela é executada. No entanto, como `myisamchk` não muda a tabela no modo de descrição, não há risco de destruir dados.
- - O que é que se passa?

  Adicionar `-v` executa `myisamchk` no modo verbose para que ele produza mais informações sobre a tabela. Adicionar `-v` uma segunda vez produz ainda mais informações.
- O meu "samchk" é "`tbl_name`"

  Mostra apenas as informações mais importantes de uma tabela. Esta operação é lenta porque deve ler toda a tabela.
- - Não, não, não,

  Isto é como `-eis`, mas diz o que está sendo feito.

O argumento `tbl_name` pode ser o nome de uma tabela `MyISAM` ou o nome de seu arquivo de índice, conforme descrito na Seção 6.6.4, myisamchk  MyISAM Table-Maintenance Utility. Vários argumentos `tbl_name` podem ser dados.

Suponha que uma tabela chamada `person` tenha a seguinte estrutura. (A opção de tabela `MAX_ROWS` está incluída para que no exemplo de saída de `myisamchk` mostrado mais tarde, alguns valores sejam menores e se encaixem no formato de saída mais facilmente.)

```
CREATE TABLE person
(
  id         INT NOT NULL AUTO_INCREMENT,
  last_name  VARCHAR(20) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  birth      DATE,
  death      DATE,
  PRIMARY KEY (id),
  INDEX (last_name, first_name),
  INDEX (birth)
) MAX_ROWS = 1000000 ENGINE=MYISAM;
```

Suponha também que a tabela tenha esses tamanhos de arquivo de dados e índice:

```
-rw-rw----  1 mysql  mysql  9347072 Aug 19 11:47 person.MYD
-rw-rw----  1 mysql  mysql  6066176 Aug 19 11:47 person.MYI
```

Exemplo de saída **myisamchk -dvv**:

```
MyISAM file:         person
Record format:       Packed
Character set:       utf8mb4_0900_ai_ci (255)
File-version:        1
Creation time:       2017-03-30 21:21:30
Status:              checked,analyzed,optimized keys,sorted index pages
Auto increment key:              1  Last value:                306688
Data records:               306688  Deleted blocks:                 0
Datafile parts:             306688  Deleted data:                   0
Datafile pointer (bytes):        4  Keyfile pointer (bytes):        3
Datafile length:           9347072  Keyfile length:           6066176
Max datafile length:    4294967294  Max keyfile length:   17179868159
Recordlength:                   54

table description:
Key Start Len Index   Type                     Rec/key         Root  Blocksize
1   2     4   unique  long                           1                    1024
2   6     80  multip. varchar prefix                 0                    1024
    87    80          varchar                        0
3   168   3   multip. uint24 NULL                    0                    1024

Field Start Length Nullpos Nullbit Type
1     1     1
2     2     4                      no zeros
3     6     81                     varchar
4     87    81                     varchar
5     168   3      1       1       no zeros
6     171   3      1       2       no zeros
```

Explicações para os tipos de informações que `myisamchk` produz são dadas aqui. Keyfile refere-se ao arquivo de índice. Record e row são sinônimos, assim como field e column.

A parte inicial da descrição do quadro contém os seguintes valores:

- `MyISAM file`

  Nome do ficheiro (índice) `MyISAM`.
- `Record format`

  O formato usado para armazenar linhas de tabela. Os exemplos anteriores usam `Fixed length`. Outros valores possíveis são `Compressed` e `Packed`. (`Packed` corresponde ao que `SHOW TABLE STATUS` informa como `Dynamic`.)
- `Chararacter set`

  O conjunto de caracteres padrão da tabela.
- `File-version`

  Versão do formato `MyISAM` Sempre 1.
- `Creation time`

  Quando o ficheiro de dados foi criado.
- `Recover time`

  Data da última reconstrução do ficheiro de índice/dados.
- `Status`

  Bandeiras de status de tabela. Os possíveis valores são `crashed`, `open`, `changed`, `analyzed`, `optimized keys`, e `sorted index pages`.
- `Auto increment key`, `Last value`

  O número de chave associado à coluna `AUTO_INCREMENT` da tabela, e o valor gerado mais recentemente para esta coluna. Estes campos não aparecem se não houver tal coluna.
- `Data records`

  O número de linhas na tabela.
- `Deleted blocks`

  Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 9.6.4, Otimização de Tabela MyISAM.
- `Datafile parts`

  Para o formato de linha dinâmica, isso indica quantos blocos de dados existem. Para uma tabela otimizada sem linhas fragmentadas, isso é o mesmo que `Data records`.
- `Deleted data`

  Quantos bytes de dados excluídos não recuperados existem. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 9.6.4, "Otimização de Tabela MyISAM".
- `Datafile pointer`

  O tamanho do ponteiro do arquivo de dados, em bytes. É geralmente 2, 3, 4 ou 5 bytes. A maioria das tabelas gerencia com 2 bytes, mas isso não pode ser controlado pelo MySQL ainda. Para tabelas fixas, este é um endereço de linha. Para tabelas dinâmicas, este é um endereço de byte.
- `Keyfile pointer`

  O tamanho do ponteiro do arquivo de índice, em bytes. Geralmente é de 1, 2 ou 3 bytes. A maioria das tabelas gerencia com 2 bytes, mas isso é calculado automaticamente pelo MySQL. É sempre um endereço de bloco.
- `Max datafile length`

  O comprimento do arquivo de dados da tabela pode ser, em bytes.
- `Max keyfile length`

  O comprimento do arquivo de índice de tabela pode se tornar, em bytes.
- `Recordlength`

  Quanto espaço cada linha ocupa, em bytes.

A parte `table description` da saída inclui uma lista de todas as chaves na tabela. Para cada chave, `myisamchk` exibe algumas informações de baixo nível:

- `Key`

  O número desta chave. Este valor é mostrado apenas para a primeira coluna da chave. Se este valor estiver faltando, a linha corresponde à segunda ou mais tarde coluna de uma chave de múltiplas colunas. Para a tabela mostrada no exemplo, há duas linhas `table description` para o segundo índice. Isso indica que é um índice de múltiplas partes com duas partes.
- `Start`

  Em que linha começa esta parte do índice?
- `Len`

  Qual é o comprimento desta parte do índice. Para números embalados, este deve ser sempre o comprimento total da coluna. Para strings, pode ser menor do que o comprimento total da coluna indexada, porque você pode indexar um prefixo de uma coluna de string. O comprimento total de uma chave de múltiplas partes é a soma dos valores `Len` para todas as partes da chave.
- `Index`

  Se um valor de chave pode existir várias vezes no índice. Os valores possíveis são `unique` ou `multip.` (múltiplo).
- `Type`

  Que tipo de dados esta parte do índice tem. Este é um tipo de dados `MyISAM` com os possíveis valores `packed`, `stripped`, ou `empty`.
- `Root`

  Endereço do bloco de índice raiz.
- `Blocksize`

  O tamanho de cada bloco de índice. Por padrão, este é 1024, mas o valor pode ser alterado no momento da compilação quando o MySQL é construído a partir do código-fonte.
- `Rec/key`

  Este é um valor estatístico usado pelo otimizador. Ele diz quantas linhas há por valor para este índice. Um índice único sempre tem um valor de 1.

A última parte da saída fornece informações sobre cada coluna:

- `Field`

  O número da coluna.
- `Start`

  A posição em bytes da coluna dentro das linhas da tabela.
- `Length`

  O comprimento da coluna em bytes.
- `Nullpos`, `Nullbit`

  Para colunas que podem ser `NULL`, `MyISAM` armazena `NULL` valores como uma bandeira em um byte. Dependendo de quantas colunas nulláveis existem, pode haver um ou mais bytes usados para este propósito. Os valores `Nullpos` e `Nullbit`, se não estiverem vazios, indicam qual byte e bit contém essa bandeira indicando se a coluna é `NULL`.

  A posição e o número de bytes usados para armazenar os sinais de `NULL` são mostrados na linha para o campo

  1. É por isso que há seis linhas de `Field` para a tabela de `person` mesmo que ela tenha apenas cinco colunas.
- `Type`

  O tipo de dados. O valor pode conter qualquer um dos seguintes descritores:

  - `constant`

    Todas as linhas têm o mesmo valor.
  - `no endspace`

    Não armazene endspace.
  - `no endspace, not_always`

    Não armazenar endspace e não fazer compressão de endspace para todos os valores.
  - `no endspace, no empty`

    Não armazenar endspace. Não armazenar valores vazios.
  - `table-lookup`

    A coluna foi convertida para um `ENUM`.
  - `zerofill(N)`

    Os bytes mais significativos `N` no valor são sempre 0 e não são armazenados.
  - `no zeros`

    Não guarde zeros.
  - `always zero`

    Os valores nulos são armazenados usando um bit.
- `Huff tree`

  O número da árvore Huffman associado à coluna.
- `Bits`

  O número de bits usados na árvore de Huffman.

Os campos `Huff tree` e `Bits` são exibidos se a tabela foi comprimida com **myisampack**. Veja a Seção 6.6.6, myisampack  Gerar tabelas MyISAM comprimidas e somente leitura, para um exemplo dessa informação.

Exemplo de saída **myisamchk -eiv**:

```
Checking MyISAM file: person
Data records:  306688   Deleted blocks:       0
- check file-size
- check record delete-chain
No recordlinks
- check key delete-chain
block_size 1024:
- check index reference
- check data record references index: 1
Key:  1:  Keyblocks used:  98%  Packed:    0%  Max levels:  3
- check data record references index: 2
Key:  2:  Keyblocks used:  99%  Packed:   97%  Max levels:  3
- check data record references index: 3
Key:  3:  Keyblocks used:  98%  Packed:  -14%  Max levels:  3
Total:    Keyblocks used:  98%  Packed:   89%

- check records and index references
*** LOTS OF ROW NUMBERS DELETED ***

Records:            306688  M.recordlength:       25  Packed:            83%
Recordspace used:       97% Empty space:           2% Blocks/Record:   1.00
Record blocks:      306688  Delete blocks:         0
Record data:       7934464  Deleted data:          0
Lost space:         256512  Linkdata:        1156096

User time 43.08, System time 1.68
Maximum resident set size 0, Integral resident set size 0
Non-physical pagefaults 0, Physical pagefaults 0, Swaps 0
Blocks in 0 out 7, Messages in 0 out 0, Signals 0
Voluntary context switches 0, Involuntary context switches 0
Maximum memory usage: 1046926 bytes (1023k)
```

**myisamchk -eiv** a saída inclui as seguintes informações:

- `Data records`

  O número de linhas na tabela.
- `Deleted blocks`

  Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 9.6.4, Otimização de Tabela MyISAM.
- `Key`

  O número da chave.
- `Keyblocks used`

  Quando uma tabela acaba de ser reorganizada com `myisamchk`, os valores são muito altos (muito próximos do máximo teórico).
- `Packed`

  O MySQL tenta empacotar valores de chave que têm um sufixo comum. Isso só pode ser usado para índices nas colunas `CHAR` e `VARCHAR`. Para strings indexadas longas que têm partes mais à esquerda semelhantes, isso pode reduzir significativamente o espaço usado. No exemplo anterior, a segunda chave tem 40 bytes de comprimento e uma redução de 97% no espaço é alcançada.
- `Max levels`

  Quão profunda é a árvore B para esta chave.
- `Records`

  Quantas linhas há na tabela.
- `M.recordlength`

  O comprimento médio da linha. Este é o comprimento exato da linha para tabelas com linhas de comprimento fixo, porque todas as linhas têm o mesmo comprimento.
- `Packed`

  O MySQL retira espaços do final das strings. O valor `Packed` indica a porcentagem de economia obtida ao fazer isso.
- `Recordspace used`

  Que percentagem do ficheiro de dados é utilizada.
- `Empty space`

  Qual a percentagem do ficheiro de dados não utilizado?
- `Blocks/Record`

  Número médio de blocos por linha (ou seja, de quantos links uma linha fragmentada é composta). Este é sempre 1.0 para tabelas de formato fixo. Este valor deve ficar o mais próximo possível de 1.0. Se ficar muito grande, você pode reorganizar a tabela. Veja Seção 9.6.4, Otimização de Tabela MyISAM.
- `Recordblocks`

  Quantos blocos (ligações) são usados.
- `Deleteblocks`

  Quantos blocos (links) são eliminados.
- `Recorddata`

  Quantos bytes no arquivo de dados são usados.
- `Deleted data`

  Quantos bytes no ficheiro de dados são eliminados (não utilizados).
- `Lost space`

  Se uma linha é atualizada para um comprimento mais curto, algum espaço é perdido. Esta é a soma de todas essas perdas, em bytes.
- `Linkdata`

  Quando o formato de tabela dinâmica é usado, os fragmentos de linha são vinculados com ponteiros (de 4 a 7 bytes cada). `Linkdata` é a soma da quantidade de armazenamento usada por todos esses ponteiros.
