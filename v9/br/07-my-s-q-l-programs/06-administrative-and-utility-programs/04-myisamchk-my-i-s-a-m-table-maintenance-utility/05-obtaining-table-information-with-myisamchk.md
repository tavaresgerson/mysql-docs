#### 6.6.4.5 Obter informações da tabela com myisamchk

Para obter uma descrição de uma tabela `MyISAM` ou estatísticas sobre ela, use os comandos mostrados aqui. A saída desses comandos é explicada mais adiante nesta seção.

* **myisamchk -d *`nome_tabela`***

  Executa **myisamchk** no modo "descrever" para produzir uma descrição da sua tabela. Se você iniciar o servidor MySQL com o bloqueio externo desativado, **myisamchk** pode reportar um erro para uma tabela que está sendo atualizada enquanto ele está em execução. No entanto, como **myisamchk** não altera a tabela no modo descrever, não há risco de destruir dados.

* **myisamchk -dv *`nome_tabela`***

  Adicionar `-v` executa **myisamchk** no modo verbose para produzir mais informações sobre a tabela. Adicionar `-v` uma segunda vez produz ainda mais informações.

* **myisamchk -eis *`nome_tabela`***

  Mostra apenas as informações mais importantes de uma tabela. Essa operação é lenta porque deve ler toda a tabela.

* **myisamchk -eiv *`nome_tabela`***

  Isto é como `-eis`, mas informa o que está sendo feito.

O argumento *`nome_tabela`* pode ser o nome de uma tabela `MyISAM` ou o nome de seu arquivo de índice, conforme descrito na Seção 6.6.4, "myisamchk — Ferramenta de manutenção de tabelas MyISAM". Podem ser fornecidos vários argumentos *`nome_tabela`*.

Suponha que uma tabela chamada `pessoa` tenha a seguinte estrutura. (A opção de tabela `MAX_ROWS` é incluída para que, no exemplo de saída do **myisamchk** mostrado mais adiante, alguns valores sejam menores e se encaixem mais facilmente no formato de saída.)

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

Suponha também que a tabela tenha esses tamanhos de dados e de arquivo de índice:

```
-rw-rw----  1 mysql  mysql  9347072 Aug 19 11:47 person.MYD
-rw-rw----  1 mysql  mysql  6066176 Aug 19 11:47 person.MYI
```

Exemplo de saída de **myisamchk -dvv**:

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

Aqui estão as explicações para os tipos de informações que o **myisamchk** produz. “Arquivo de chave” refere-se ao arquivo de índice. “Registro” e “linha” são sinônimos, assim como “campo” e “coluna”.

A parte inicial da descrição da tabela contém esses valores:

* `Arquivo de MyISAM`

  Nome do arquivo de `MyISAM` (índice).

* `Formato de registro`

  O formato usado para armazenar linhas da tabela. Os exemplos anteriores usam `Com comprimento fixo`. Outros valores possíveis são `Compactado` e `Embalado`. (`Embalado` corresponde ao que o `SHOW TABLE STATUS` reporta como `Dinâmico`.)

* `Conjunto de caracteres`

  Conjunto de caracteres padrão da tabela.

* `Versão do arquivo`

  Versão do formato `MyISAM`. Sempre 1.

* `Tempo de criação`

  Quando o arquivo de dados foi criado.

* `Tempo de recuperação`

  Quando o arquivo de índice/dados foi reconstruído pela última vez.

* `Status`

  Indicadores de status da tabela. Os valores possíveis são `quebrado`, `aberto`, `alterado`, `analisado`, `chave otimizada` e `páginas de índice ordenadas`.

* `Chave de incremento automático`, `Último valor`

  O número da chave associado à coluna `AUTO_INCREMENT` da tabela, e o valor gerado mais recentemente para essa coluna. Esses campos não aparecem se não houver tal coluna.

* `Registros de dados`

  O número de linhas na tabela.

* `Blocos excluídos`

  Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 9.6.4, “Otimização de Tabelas MyISAM”.

* `Partes do arquivo de dados`

  Para o formato de linha dinâmica, isso indica quantos blocos de dados existem. Para uma tabela otimizada sem linhas fragmentadas, isso é o mesmo que `Registros de dados`.

* `Dados excluídos`

  Quantos bytes de dados excluídos não recuperados existem. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 9.6.4, “Otimização de Tabelas MyISAM”.

* `Ponteiro do arquivo de dados`

O tamanho do ponteiro do arquivo de dados, em bytes. Geralmente é de 2, 3, 4 ou 5 bytes. A maioria das tabelas gerencia com 2 bytes, mas isso ainda não pode ser controlado pelo MySQL. Para tabelas fixas, este é um endereço de linha. Para tabelas dinâmicas, este é um endereço de byte.

* `Ponteiro do arquivo de chave`

  O tamanho do ponteiro do arquivo de índice, em bytes. Geralmente é de 1, 2 ou 3 bytes. A maioria das tabelas gerencia com 2 bytes, mas isso é calculado automaticamente pelo MySQL. É sempre um endereço de bloco.

* `Tamanho máximo do arquivo de dados`

  Quanto tempo o arquivo de dados da tabela pode se tornar, em bytes.

* `Tamanho máximo do arquivo de chave`

  Quanto tempo o arquivo de índice da tabela pode se tornar, em bytes.

* `Tamanho de registro`

  Quanto espaço cada linha ocupa, em bytes.

A parte `descrição da tabela` do resultado inclui uma lista de todas as chaves na tabela. Para cada chave, **myisamchk** exibe algumas informações de baixo nível:

* `Chave`

  O número dessa chave. Esse valor é mostrado apenas para a primeira coluna da chave. Se esse valor estiver ausente, a linha corresponde à segunda ou coluna posterior de uma chave de múltiplas colunas. Para a tabela mostrada no exemplo, há duas linhas de `descrição da tabela` para o segundo índice. Isso indica que é um índice de múltiplas partes com duas partes.

* `Início`

  Onde na linha essa parte do índice começa.

* `Len`

  Quanto tempo essa parte do índice é. Para números compactados, isso deve ser sempre o comprimento total da coluna. Para strings, pode ser mais curto que o comprimento total da coluna indexada, porque você pode indexar um prefixo de uma coluna de string. O comprimento total de uma chave de múltiplas partes é a soma dos valores `Len` para todas as partes da chave.

* `Índice`

  Se um valor de chave pode existir várias vezes no índice. Os valores possíveis são `único` ou `multip.` (múltiplo).

* `Tipo`

Qual tipo de dado essa parte do índice tem. Este é um tipo de dado `MyISAM` com os valores possíveis `packed`, `stripped` ou `empty`.

* `Root`

  Endereço do bloco de índice raiz.

* `Blocksize`

  O tamanho de cada bloco de índice. Por padrão, este é 1024, mas o valor pode ser alterado no tempo de compilação quando o MySQL é compilado a partir da fonte.

* `Rec/key`

  Este é um valor estatístico usado pelo otimizador. Ele indica quantos registros há por valor para este índice. Um índice único sempre tem um valor de 1. Este valor pode ser atualizado após uma tabela ser carregada (ou muito alterada) com **myisamchk -a**. Se este valor não for atualizado de forma alguma, um valor padrão de 30 é dado.

A última parte do resultado fornece informações sobre cada coluna:

* `Field`

  O número da coluna.

* `Start`

  A posição em bytes da coluna dentro das linhas da tabela.

* `Length`

  O comprimento da coluna em bytes.

* `Nullpos`, `Nullbit`

  Para colunas que podem ser `NULL`, o `MyISAM` armazena valores `NULL` como um sinalizador em um byte. Dependendo de quantos colunas nulos existem, pode haver um ou mais bytes usados para esse propósito. Os valores `Nullpos` e `Nullbit`, se não estiverem vazios, indicam qual byte e bit contêm esse sinalizador indicando se a coluna é `NULL`.

  A posição e o número de bytes usados para armazenar os sinais `NULL` são mostrados na linha para o campo

  1. É por isso que existem seis linhas `Field` para a tabela `person`, mesmo que ela tenha apenas cinco colunas.

* `Type`

  O tipo de dado. O valor pode conter qualquer um dos seguintes descritores:

  + `constant`

    Todas as linhas têm o mesmo valor.

  + `no endspace`

    Não armazene espaço de finalização.

  + `no endspace, not_always`

    Não armazene espaço de finalização e não faça compressão de espaço de finalização para todos os valores.

  + `no endspace, no empty`

    Não armazene espaço de finalização. Não armazene valores vazios.

+ `table-lookup`

A coluna foi convertida para um `ENUM`.

+ `zerofill(N)`

Os *`N`* bytes mais significativos no valor são sempre 0 e não são armazenados.

+ `no zeros`

Não armazene zeros.

+ `always zero`

Os valores nulos são armazenados usando um bit.

* `árvore de Huffman`

O número da árvore de Huffman associada à coluna.

* `Bits`

O número de bits usados na árvore de Huffman.

Os campos `árvore de Huffman` e `Bits` são exibidos se a tabela tiver sido comprimida com **myisampack**. Veja a Seção 6.6.6, “myisampack — Gerar tabelas MyISAM comprimidas, somente leitura”, para um exemplo dessas informações.

Exemplo de saída do **myisamchk -eiv**:

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

A saída do **myisamchk -eiv** inclui as seguintes informações:

* `Registros de dados`

O número de linhas na tabela.

* `Blocos excluídos`

Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 9.6.4, “Otimização de tabelas MyISAM”.

* `Chave`

O número da chave.

* `Blocos de chave usados`

Que porcentagem dos blocos de chave está sendo usada. Quando uma tabela é reorganizada com **myisamchk**, os valores são muito altos (muito próximos do máximo teórico).

* `Embalado`

O MySQL tenta embalar os valores da chave que têm um sufixo comum. Isso só pode ser usado para índices em colunas `CHAR` e `VARCHAR`. Para strings indexadas longas que têm partes mais à esquerda semelhantes, isso pode reduzir significativamente o espaço usado. No exemplo anterior, a segunda chave tem 40 bytes de comprimento e uma redução de 97% no espaço é alcançada.

* `Níveis máximos`

Quão profundo é o B-tree para essa chave. Tabelas grandes com valores de chave longos obtêm valores altos.

* `Registros`

Quantas linhas estão na tabela.

* `M.recordlength`

O comprimento médio da linha. Este é o comprimento exato da linha para tabelas com linhas de comprimento fixo, porque todas as linhas têm o mesmo comprimento.

* `Embalado`

  O MySQL remove espaços do final das strings. O valor `Embalado` indica a porcentagem de economia obtida ao fazer isso.

* `Espaço de registros usado`

  Que porcentagem do arquivo de dados é usada.

* `Espaço vazio`

  Que porcentagem do arquivo de dados é inutilizada.

* `Blocos/Registro`

  Número médio de blocos por linha (ou seja, quantos links uma linha fragmentada é composta). Este valor é sempre 1,0 para tabelas de formato fixo. Este valor deve ficar o mais próximo possível de 1,0. Se ficar muito grande, você pode reorganizar a tabela. Veja a Seção 9.6.4, “Otimização da Tabela MyISAM”.

* `Blocos de registro`

  Quantos blocos (links) são usados. Para tabelas de formato fixo, este é o mesmo que o número de linhas.

* `Blocos de exclusão`

  Quantos blocos (links) são excluídos.

* `Dados de registro`

  Quantos bytes no arquivo de dados são usados.

* `Dados excluídos`

  Quantos bytes no arquivo de dados são excluídos (inutilizados).

* `Espaço perdido`

  Se uma linha for atualizada para um comprimento menor, algum espaço é perdido. Este é a soma de todas essas perdas, em bytes.

* `Dados de link`

  Quando o formato de tabela dinâmico é usado, os fragmentos de linha são vinculados com ponteiros (4 a 7 bytes cada). `Dados de link` é a soma da quantidade de armazenamento usada por todos esses ponteiros.