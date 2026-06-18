#### 4.6.3.5 Obter informações da tabela com myisamchk

Para obter uma descrição de uma tabela `MyISAM` ou estatísticas sobre ela, use os comandos mostrados aqui. A saída desses comandos é explicada mais adiante nesta seção.

- **myisamchk -d *`nome_tabela`***

  Execute o **myisamchk** no modo "descrever" para gerar uma descrição da sua tabela. Se você iniciar o servidor MySQL com o bloqueio externo desativado, o **myisamchk** pode exibir um erro para uma tabela que está sendo atualizada enquanto ele está em execução. No entanto, como o **myisamchk** não altera a tabela no modo "descrever", não há risco de destruir dados.

- **myisamchk -dv *`tbl_name`***

  A adição de `-v` executa o **myisamchk** no modo verbose, para que ele produza mais informações sobre a tabela. A adição de `-v` uma segunda vez produz ainda mais informações.

- **myisamchk -eis *`tbl_name`***

  Mostra apenas as informações mais importantes de uma tabela. Essa operação é lenta porque deve ler toda a tabela.

- **myisamchk -eiv *`tbl_name`***

  Isto é como `-eis`, mas diz-lhe o que está a ser feito.

O argumento *`tbl_name`* pode ser o nome de uma tabela `MyISAM` ou o nome de seu arquivo de índice, conforme descrito na Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”. Pode-se fornecer vários argumentos *`tbl_name`*.

Suponha que uma tabela chamada `pessoa` tenha a seguinte estrutura. (A opção `MAX_ROWS` da tabela é incluída para que, no exemplo de saída do **myisamchk** mostrado mais adiante, alguns valores sejam menores e se encaixem mais facilmente no formato de saída.)

```sql
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

Suponha também que a tabela tenha esses tamanhos de dados e de arquivo de índice:

```sql
-rw-rw----  1 mysql  mysql  9347072 Aug 19 11:47 person.MYD
-rw-rw----  1 mysql  mysql  6066176 Aug 19 11:47 person.MYI
```

Exemplo de saída do **myisamchk -dvv**:

```sql
MyISAM file:         person
Record format:       Packed
Character set:       latin1_swedish_ci (8)
File-version:        1
Creation time:       2009-08-19 16:47:41
Recover time:        2009-08-19 16:47:56
Status:              checked,analyzed,optimized keys
Auto increment key:              1  Last value:                306688
Data records:               306688  Deleted blocks:                 0
Datafile parts:             306688  Deleted data:                   0
Datafile pointer (bytes):        4  Keyfile pointer (bytes):        3
Datafile length:           9347072  Keyfile length:           6066176
Max datafile length:    4294967294  Max keyfile length:   17179868159
Recordlength:                   54

table description:
Key Start Len Index   Type                 Rec/key         Root  Blocksize
1   2     4   unique  long                       1        99328       1024
2   6     20  multip. varchar prefix           512      3563520       1024
    27    20          varchar                  512
3   48    3   multip. uint24 NULL           306688      6065152       1024

Field Start Length Nullpos Nullbit Type
1     1     1
2     2     4                      no zeros
3     6     21                     varchar
4     27    21                     varchar
5     48    3      1       1       no zeros
6     51    3      1       2       no zeros
```

Aqui estão as explicações sobre os tipos de informações que o **myisamchk** gera. “Keyfile” refere-se ao arquivo de índice. “Registro” e “linha” são sinônimos, assim como “campo” e “coluna”.

A parte inicial da descrição da tabela contém esses valores:

- Arquivo `MyISAM`

  Nome do arquivo `MyISAM` (índice).

- `Formato de gravação`

  O formato usado para armazenar linhas de tabela. Os exemplos anteriores usam `Comprimento fixo`. Outros valores possíveis são `Compactado` e `Embalado`. (`Embalado` corresponde ao que o `SHOW TABLE STATUS` relata como `Dinâmico`.)

- `Conjunto de personagens`

  O conjunto de caracteres padrão da tabela.

- `Versão do arquivo`

  Versão do formato `MyISAM`. Sempre 1.

- "Tempo de criação"

  Quando o arquivo de dados foi criado.

- Tempo de recuperação

  Quando o arquivo de índice/dados foi reconstruído pela última vez.

- `Status`

  Bandeiras de status da tabela. Os valores possíveis são `crashed`, `open`, `changed`, `analyzed`, `optimized keys` e `sorted index pages`.

- Chave de incremento automático, `Último valor`

  O número chave associado à coluna `AUTO_INCREMENT` da tabela e o valor gerado mais recentemente para essa coluna. Esses campos não aparecem se não houver uma coluna desse tipo.

- `Registros de dados`

  O número de linhas na tabela.

- "Blocos excluídos"

  Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 7.6.4, “Otimização da Tabela MyISAM”.

- `partes do arquivo de dados`

  Para o formato de linha dinâmica, isso indica quantos blocos de dados existem. Para uma tabela otimizada sem linhas fragmentadas, isso é o mesmo que "Registros de dados".

- Dados excluídos

  Quantos bytes de dados excluídos não recuperados existem. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 7.6.4, “Otimização da Tabela MyISAM”.

- Indicador de arquivo de dados

  O tamanho do ponteiro do arquivo de dados, em bytes. Geralmente é de 2, 3, 4 ou 5 bytes. A maioria das tabelas consegue lidar com 2 bytes, mas isso ainda não pode ser controlado pelo MySQL. Para tabelas fixas, este é um endereço de linha. Para tabelas dinâmicas, este é um endereço de byte.

- `Indicador do arquivo de chave`

  O tamanho do ponteiro do arquivo de índice, em bytes. Geralmente é de 1, 2 ou 3 bytes. A maioria das tabelas consegue com 2 bytes, mas isso é calculado automaticamente pelo MySQL. É sempre um endereço de bloco.

- `Tamanho máximo do arquivo de dados`

  Quanto tempo o arquivo de dados da tabela pode ficar, em bytes.

- `Max keyfile length`

  Quanto tempo o arquivo de índice da tabela pode ficar, em bytes.

- `Recordlength`

  Quanto espaço cada linha ocupa, em bytes.

A parte `descrição da tabela` do resultado inclui uma lista de todas as chaves na tabela. Para cada chave, **myisamchk** exibe algumas informações de nível baixo:

- `Chave`

  Este é o número da chave. Este valor é exibido apenas para a primeira coluna da chave. Se este valor estiver ausente, a linha corresponde à segunda ou a coluna posterior de uma chave de múltiplas colunas. Para a tabela mostrada no exemplo, há duas linhas de `descrição da tabela` para o segundo índice. Isso indica que é um índice de múltiplas partes com duas partes.

- `Iniciar`

  Onde na linha essa parte do índice começa.

- `Len`

  Quanto tempo essa parte do índice dura. Para números compactados, isso deve ser sempre o comprimento total da coluna. Para strings, pode ser mais curto que o comprimento total da coluna indexada, porque você pode indexar um prefixo de uma coluna de strings. O comprimento total de uma chave de múltiplas partes é a soma dos valores `Len` para todas as partes da chave.

- `Índice`

  Se um valor chave pode existir várias vezes no índice. Os valores possíveis são `unique` ou `multip.` (múltiplo).

- `Tipo`

  Que tipo de dado essa parte do índice tem. Este é um tipo de dado `MyISAM` com os valores possíveis `packed`, `stripped` ou `empty`.

- Raiz

  Endereço do bloco de índice raiz.

- `Blocksize`

  O tamanho de cada bloco do índice. Por padrão, este é 1024, mas o valor pode ser alterado no momento da compilação quando o MySQL é construído a partir da fonte.

- `Rec/chave`

  Este é um valor estatístico usado pelo otimizador. Ele indica quantas linhas há por valor para este índice. Um índice único sempre tem um valor de 1. Este valor pode ser atualizado após a tabela ser carregada (ou muito alterada) com **myisamchk -a**. Se este valor não for atualizado, será dado um valor padrão de 30.

A última parte do resultado fornece informações sobre cada coluna:

- Campo

  O número da coluna.

- `Iniciar`

  A posição do byte da coluna dentro das linhas da tabela.

- `Comprimento`

  O comprimento da coluna em bytes.

- `Nullpos`, `Nullbit`

  Para colunas que podem ser `NULL`, o `MyISAM` armazena valores `NULL` como uma bandeira em um byte. Dependendo de quantos colunas nulas existem, pode haver um ou mais bytes usados para esse propósito. Os valores `Nullpos` e `Nullbit`, se não estiverem vazios, indicam qual byte e bit contêm aquela bandeira, indicando se a coluna é `NULL`.

  A posição e o número de bytes usados para armazenar as flags `NULL` são mostrados na linha do campo

  1. É por isso que existem seis linhas de `Campo` para a tabela `pessoa`, mesmo que ela tenha apenas cinco colunas.

- `Tipo`

  O tipo de dado. O valor pode conter qualquer um dos seguintes descritores:

  - `constante`

    Todas as linhas têm o mesmo valor.

  - `sem espaço de término`

    Não armazene o espaço final.

  - `sem espaço final, não_sempre`

    Não armazene o espaço final e não faça compressão de espaço final para todos os valores.

  - `sem espaço final, sem vazio`

    Não armazene o espaço final. Não armazene valores vazios.

  - `tabela de consulta`

    A coluna foi convertida em `ENUM`.

  - `zerofill(N)`

    Os bytes *`N`* mais significativos no valor são sempre 0 e não são armazenados.

  - `sem zeros`

    Não armazene zeros.

  - "sempre zero"

    Os valores zero são armazenados usando um bit.

- "árvore de hifas"

  O número da árvore de Huffman associada à coluna.

- "Bits"

  O número de bits utilizados na árvore de Huffman.

Os campos `Huff tree` e `Bits` são exibidos se a tabela tiver sido compactada com **myisampack**. Veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM compactadas e somente de leitura”, para um exemplo dessas informações.

Exemplo de saída do comando **myisamchk -eiv**:

```sql
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

A saída **myisamchk -eiv** inclui as seguintes informações:

- `Registros de dados`

  O número de linhas na tabela.

- "Blocos excluídos"

  Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 7.6.4, “Otimização da Tabela MyISAM”.

- `Chave`

  O número chave.

- `Blocos-chave utilizados`

  Que porcentagem dos keyblocks está sendo usada. Quando uma tabela foi reorganizada com **myisamchk**, os valores são muito altos (muito próximos do máximo teórico).

- "Embalado"

  O MySQL tenta compactar os valores-chave que têm um sufixo comum. Isso só pode ser usado para índices em colunas `CHAR` e `VARCHAR`. Para strings indexadas longas que têm partes semelhantes na esquerda, isso pode reduzir significativamente o espaço usado. No exemplo anterior, a segunda chave tem 40 bytes de comprimento e uma redução de 97% no espaço é alcançada.

- "Níveis máximos"

  Quão profunda é a árvore B para esta chave. Tais tabelas grandes com valores de chave longos obtêm valores altos.

- `Registros`

  Quantas linhas há na tabela.

- `M.recordlength`

  O comprimento médio da linha. Este é o comprimento exato da linha para tabelas com linhas de comprimento fixo, porque todas as linhas têm o mesmo comprimento.

- "Embalado"

  O MySQL remove espaços do final das cadeias de caracteres. O valor `Packed` indica a porcentagem de economia obtida ao fazer isso.

- `Espaço de registro utilizado`

  Que porcentagem do arquivo de dados é usada.

- `Espaço vazio`

  Que porcentagem do arquivo de dados está inutilizada.

- Blocos/Registro

  Número médio de blocos por linha (ou seja, quantos links uma linha fragmentada é composta). Isso é sempre 1,0 para tabelas de formato fixo. Esse valor deve ficar o mais próximo possível de 1,0. Se ele ficar muito grande, você pode reorganizar a tabela. Veja a Seção 7.6.4, “Otimização da Tabela MyISAM”.

- `Recordblocks`

  Quantos blocos (links) são usados. Para tabelas de formato fixo, isso é o mesmo que o número de linhas.

- `Deleteblocks`

  Quantos blocos (links) foram excluídos.

- `Recorddata`

  Quantos bytes no arquivo de dados são usados.

- Dados excluídos

  Quantos bytes no arquivo de dados são excluídos (não utilizados).

- "Espaço perdido"

  Se uma linha for atualizada para um comprimento mais curto, parte do espaço é perdida. Essa é a soma de todas essas perdas, em bytes.

- `Linkdata`

  Quando o formato de tabela dinâmica é usado, os fragmentos de linha são vinculados com ponteiros (4 a 7 bytes cada). `Linkdata` é a soma da quantidade de armazenamento usada por todos esses ponteiros.
