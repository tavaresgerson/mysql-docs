#### 4.6.3.5 Obtendo Informações da Tabela com myisamchk

Para obter uma descrição de uma tabela `MyISAM` ou estatísticas sobre ela, use os comandos mostrados aqui. A saída desses comandos é explicada mais adiante nesta seção.

* **myisamchk -d *`nome_da_tabela`***

  Executa o **myisamchk** em “describe mode” (modo de descrição) para produzir uma descrição da sua tabela. Se você iniciar o servidor MySQL com o external locking desabilitado, o **myisamchk** pode reportar um erro para uma tabela que esteja sendo atualizada enquanto ele é executado. No entanto, como o **myisamchk** não altera a tabela no describe mode, não há risco de destruição de dados.

* **myisamchk -dv *`nome_da_tabela`***

  Adicionar `-v` executa o **myisamchk** em modo verbose (detalhado) para que ele produza mais informações sobre a tabela. Adicionar `-v` uma segunda vez produz ainda mais informações.

* **myisamchk -eis *`nome_da_tabela`***

  Mostra apenas as informações mais importantes de uma tabela. Esta operação é lenta porque deve ler a tabela inteira.

* **myisamchk -eiv *`nome_da_tabela`***

  Isso é semelhante a `-eis`, mas informa o que está sendo feito.

O argumento *`nome_da_tabela`* pode ser tanto o nome de uma tabela `MyISAM` quanto o nome do seu arquivo Index, conforme descrito na Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabela MyISAM”. Vários argumentos *`nome_da_tabela`* podem ser fornecidos.

Suponha que uma tabela chamada `person` tenha a seguinte estrutura. (A opção de tabela `MAX_ROWS` está incluída para que, no exemplo de saída do **myisamchk** mostrado mais tarde, alguns valores sejam menores e se ajustem mais facilmente ao formato de saída.)

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

Suponha também que a tabela tenha estes tamanhos de arquivo de dados e Index:

```sql
-rw-rw----  1 mysql  mysql  9347072 Aug 19 11:47 person.MYD
-rw-rw----  1 mysql  mysql  6066176 Aug 19 11:47 person.MYI
```

Exemplo de saída de **myisamchk -dvv**:

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

As explicações para os tipos de informação que o **myisamchk** produz são fornecidas aqui. "Keyfile" (Arquivo de Key) refere-se ao arquivo Index. "Record" (Registro) e "row" (linha) são sinônimos, assim como "field" (campo) e "column" (coluna).

A parte inicial da descrição da tabela contém os seguintes valores:

* `MyISAM file`

  Nome do arquivo `MyISAM` (Index).

* `Record format`

  O formato usado para armazenar as rows da tabela. Os exemplos anteriores usam `Fixed length` (Comprimento fixo). Outros valores possíveis são `Compressed` (Comprimido) e `Packed` (Empacotado). (`Packed` corresponde ao que `SHOW TABLE STATUS` reporta como `Dynamic`.)

* `Chararacter set`

  O character set padrão da tabela.

* `File-version`

  Versão do formato `MyISAM`. Sempre 1.

* `Creation time`

  Quando o arquivo de dados foi criado.

* `Recover time`

  Quando o arquivo Index/dados foi reconstruído pela última vez.

* `Status`

  Flags de status da tabela. Valores possíveis são `crashed` (travada), `open` (aberta), `changed` (alterada), `analyzed` (analisada), `optimized keys` (Keys otimizadas) e `sorted index pages` (páginas de Index ordenadas).

* `Auto increment key`, `Last value`

  O número da Key associada à coluna `AUTO_INCREMENT` da tabela e o valor gerado mais recentemente para esta coluna. Esses campos não aparecem se não houver tal coluna.

* `Data records`

  O número de rows na tabela.

* `Deleted blocks`

  Quantos blocos deletados ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar este espaço. Consulte a Seção 7.6.4, “Otimização de Tabela MyISAM”.

* `Datafile parts`

  Para o formato de row dinâmico, isso indica quantos blocos de dados existem. Para uma tabela otimizada sem rows fragmentadas, isso é o mesmo que `Data records`.

* `Deleted data`

  Quantos bytes de dados deletados não recuperados existem. Você pode otimizar sua tabela para minimizar este espaço. Consulte a Seção 7.6.4, “Otimização de Tabela MyISAM”.

* `Datafile pointer`

  O tamanho do ponteiro do arquivo de dados, em bytes. Geralmente é de 2, 3, 4 ou 5 bytes. A maioria das tabelas funciona com 2 bytes, mas isso ainda não pode ser controlado a partir do MySQL. Para tabelas fixas, este é um endereço de row. Para tabelas dinâmicas, este é um endereço de byte.

* `Keyfile pointer`

  O tamanho do ponteiro do arquivo Index, em bytes. Geralmente é de 1, 2 ou 3 bytes. A maioria das tabelas funciona com 2 bytes, mas isso é calculado automaticamente pelo MySQL. É sempre um endereço de bloco.

* `Max datafile length`

  O quão longo o arquivo de dados da tabela pode se tornar, em bytes.

* `Max keyfile length`

  O quão longo o arquivo Index da tabela pode se tornar, em bytes.

* `Recordlength`

  Quanto espaço cada row ocupa, em bytes.

A parte de `table description` (descrição da tabela) da saída inclui uma lista de todas as Keys na tabela. Para cada Key, o **myisamchk** exibe algumas informações de baixo nível:

* `Key`

  O número desta Key. Este valor é exibido apenas para a primeira coluna da Key. Se este valor estiver ausente, a linha corresponde à segunda ou a uma coluna posterior de uma Key de múltiplas colunas. Para a tabela mostrada no exemplo, existem duas linhas de `table description` para o segundo Index. Isso indica que é um Index de múltiplas partes com duas partes.

* `Start`

  Onde, na row, esta porção do Index começa.

* `Len`

  O comprimento desta porção do Index. Para números empacotados, este deve ser sempre o comprimento total da coluna. Para strings, pode ser menor que o comprimento total da coluna indexada, pois você pode indexar um prefixo de uma coluna string. O comprimento total de uma Key de múltiplas partes é a soma dos valores `Len` para todas as partes da Key.

* `Index`

  Se um valor de Key pode existir múltiplas vezes no Index. Os valores possíveis são `unique` (único) ou `multip.` (múltiplo).

* `Type`

  Qual Data Type esta porção do Index possui. Este é um Data Type `MyISAM` com os valores possíveis `packed` (empacotado), `stripped` (removido) ou `empty` (vazio).

* `Root`

  Endereço do bloco de Index raiz.

* `Blocksize`

  O tamanho de cada bloco de Index. Por padrão, é 1024, mas o valor pode ser alterado no momento da compilação, quando o MySQL é construído a partir do código-fonte.

* `Rec/key`

  Este é um valor estatístico usado pelo optimizer. Ele informa quantas rows existem por valor para este Index. Um Index unique (único) sempre tem o valor 1. Isso pode ser atualizado após o carregamento (ou grande alteração) de uma tabela com **myisamchk -a**. Se não for atualizado, um valor padrão de 30 é fornecido.

A última parte da saída fornece informações sobre cada coluna:

* `Field`

  O número da coluna.

* `Start`

  A posição do byte da coluna dentro das rows da tabela.

* `Length`

  O comprimento da coluna em bytes.

* `Nullpos`, `Nullbit`

  Para colunas que podem ser `NULL`, o `MyISAM` armazena valores `NULL` como uma flag em um byte. Dependendo de quantas colunas anuláveis existem, pode haver um ou mais bytes usados para esse fim. Os valores `Nullpos` e `Nullbit`, se não estiverem vazios, indicam qual byte e bit contêm essa flag que sinaliza se a coluna é `NULL`.

  A posição e o número de bytes usados para armazenar flags `NULL` são mostrados na linha para o `Field` 1. É por isso que existem seis linhas `Field` para a tabela `person`, embora ela tenha apenas cinco colunas.

* `Type`

  O Data Type. O valor pode conter qualquer um dos seguintes descritores:

  + `constant`

    Todas as rows têm o mesmo valor.

  + `no endspace`

    Não armazena espaço final (`endspace`).

  + `no endspace, not_always`

    Não armazena espaço final e não realiza compressão de espaço final para todos os valores.

  + `no endspace, no empty`

    Não armazena espaço final. Não armazena valores vazios.

  + `table-lookup`

    A coluna foi convertida para um `ENUM`.

  + `zerofill(N)`

    Os *`N`* bytes mais significativos no valor são sempre 0 e não são armazenados.

  + `no zeros`

    Não armazena zeros.

  + `always zero`

    Valores zero são armazenados usando um bit.

* `Huff tree`

  O número da Huffman tree associada à coluna.

* `Bits`

  O número de bits usados na Huffman tree.

Os campos `Huff tree` e `Bits` são exibidos se a tabela foi compactada com **myisampack**. Consulte a Seção 4.6.5, “myisampack — Gerar Tabelas MyISAM Compactadas e Somente Leitura”, para um exemplo desta informação.

Exemplo de saída de **myisamchk -eiv**:

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

A saída de **myisamchk -eiv** inclui as seguintes informações:

* `Data records`

  O número de rows na tabela.

* `Deleted blocks`

  Quantos blocos deletados ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar este espaço. Consulte a Seção 7.6.4, “Otimização de Tabela MyISAM”.

* `Key`

  O número da Key.

* `Keyblocks used`

  Qual porcentagem dos keyblocks é usada. Quando uma tabela acaba de ser reorganizada com **myisamchk**, os valores são muito altos (muito próximos do máximo teórico).

* `Packed`

  O MySQL tenta empacotar valores de Key que possuem um sufixo comum. Isso só pode ser usado para Indexes em colunas `CHAR` e `VARCHAR`. Para strings longas indexadas que têm partes mais à esquerda semelhantes, isso pode reduzir significativamente o espaço usado. No exemplo anterior, a segunda Key tem 40 bytes de comprimento e é alcançada uma redução de 97% no espaço.

* `Max levels`

  A profundidade da B-tree para esta Key. Tabelas grandes com valores de Key longos obtêm valores altos.

* `Records`

  Quantas rows estão na tabela.

* `M.recordlength`

  O comprimento médio da row. Este é o comprimento exato da row para tabelas com rows de comprimento fixo, pois todas as rows têm o mesmo comprimento.

* `Packed`

  O MySQL remove espaços do final das strings. O valor `Packed` indica a porcentagem de economia alcançada ao fazer isso.

* `Recordspace used`

  Qual porcentagem do arquivo de dados é usada.

* `Empty space`

  Qual porcentagem do arquivo de dados está sem uso.

* `Blocks/Record`

  Número médio de blocos por row (ou seja, de quantos links uma row fragmentada é composta). Este valor é sempre 1.0 para tabelas de formato fixo. Este valor deve permanecer o mais próximo possível de 1.0. Se ficar muito grande, você pode reorganizar a tabela. Consulte a Seção 7.6.4, “Otimização de Tabela MyISAM”.

* `Recordblocks`

  Quantos blocos (links) são usados. Para tabelas de formato fixo, este é o mesmo que o número de rows.

* `Deleteblocks`

  Quantos blocos (links) são deletados.

* `Recorddata`

  Quantos bytes no arquivo de dados são usados.

* `Deleted data`

  Quantos bytes no arquivo de dados são deletados (não utilizados).

* `Lost space`

  Se uma row for atualizada para um comprimento menor, algum espaço é perdido. Esta é a soma de todas essas perdas, em bytes.

* `Linkdata`

  Quando o formato de tabela dinâmico é usado, fragmentos de row são ligados por ponteiros (4 a 7 bytes cada). `Linkdata` é a soma da quantidade de armazenamento usada por todos esses ponteiros.
