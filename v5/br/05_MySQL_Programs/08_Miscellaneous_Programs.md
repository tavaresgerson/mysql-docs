## 4.8 Programas Diversos

### 4.8.1 lz4_decompress — Descomprima saída mysqlpump comprimida por LZ4

A utilidade **lz4\_decompress** descomprime a saída do **mysqlpump** que foi criada usando compressão LZ4. **lz4\_decompress** foi adicionada no MySQL 5.7.10.

Invoque **lz4_decompress** da seguinte forma:

```sql
lz4_decompress input_file output_file
```

Exemplo:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

Para ver uma mensagem de ajuda, invoque **lz4_decompress** sem argumentos.

Para descomprimir a saída comprimida por ZLIB do **mysqlpump**, use **zlib\_decompress**. Veja a Seção 4.8.5, “zlib\_decompress — Descomprima a saída comprimida por ZLIB do mysqlpump”.

### 4.8.2 perror — Exibir informações do erro do MySQL

Para a maioria dos erros do sistema, o MySQL exibe, além de uma mensagem de texto interna, o código do erro do sistema em um dos seguintes estilos:

```sql
message ... (errno: #)
message ... (Errcode: #)
```

Você pode descobrir o que o código de erro significa examinando a documentação do seu sistema ou usando o utilitário **perror**.

**perror** imprime uma descrição para um código de erro do sistema ou para um código de erro do motor de armazenamento (manipulador de tabela).

Invoque o **perror** da seguinte forma:

```sql
perror [options] errorcode ...
```

Exemplos:

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

```sql
$> perror 13 64
OS error code  13:  Permission denied
OS error code  64:  Machine is not on the network
```

Para obter a mensagem de erro para um código de erro do MySQL Cluster, use o utilitário **ndb\_perror**.

O significado das mensagens de erro do sistema pode depender do seu sistema operacional. Um código de erro específico pode significar coisas diferentes em diferentes sistemas operacionais.

O **perror** suporta as seguintes opções.

* `--help`, `--info`, `-I`, `-?`

Exibir uma mensagem de ajuda e sair.

* `--ndb`

Imprima a mensagem de erro para um código de erro do NDB Cluster.

Essa opção é desatualizada no NDB 7.6.4 e posterior, onde o **perror** exibe um aviso se for usado e é removido no NDB Cluster 8.0. Use o utilitário **ndb\_perror** em vez disso.

* `--silent`, `-s`

Modo silencioso. Imprima apenas a mensagem de erro.

* `--verbose`, `-v`

Modo detalhado. Imprimir código de erro e mensagem. Este é o comportamento padrão.

* `--version`, `-V`

Exibir informações da versão e sair.

### 4.8.3 substituir — Uma Ferramenta de Substituição de Texto

O programa de utilitário **replace** altera as strings no local dos arquivos ou na entrada padrão.

Nota

A ferramenta **replace** é descontinuada a partir do MySQL 5.7.18 e é removida no MySQL 8.0.

Invoque **replace** de uma das seguintes maneiras:

```sql
replace from to [from to] ... -- file_name [file_name] ...
replace from to [from to] ... < file_name
```

*`from`* representa uma cadeia de caracteres a ser procurada e *`to`* representa sua substituição. Pode haver um ou mais pares de cadeias de caracteres.

Use a opção `--` para indicar onde a lista de substituição de strings termina e onde os nomes dos arquivos começam. Neste caso, qualquer arquivo nomeado na string de comando é modificado no local, então você pode querer fazer uma cópia do original antes de convertê-lo. *`replace`* imprime uma mensagem indicando quais dos arquivos de entrada ele realmente modifica.

Se a opção `--` não for fornecida, **replace** lê a entrada padrão e escreve na saída padrão.

**replace** utiliza uma máquina de estado finito para corresponder a strings mais longas primeiro. Pode ser usado para trocar strings. Por exemplo, o seguinte comando troca `a` e `b` nos arquivos dados, `file1` e `file2`:

```sql
replace a b b a -- file1 file2 ...
```

**replace** suporta as seguintes opções.

* `-?`, `-I`

Exibir uma mensagem de ajuda e sair.

* `-#debug_options`

Ative o depuração.

* `-s`

Modo silencioso. Imprima menos informações sobre o que o programa faz.

* `-v`

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `-V`

Exibir informações da versão e sair.

### 4.8.4 resolveip — Resolva o nome do host para o endereço IP ou vice-versa

A utilidade **resolveip** resolve nomes de host em endereços IP e vice-versa.

Nota

**resolveip** é desatualizado e será removido no MySQL 8.0. **nslookup**, **host** ou **dig** podem ser usados em seu lugar.

Invoque o **resolveip** da seguinte forma:

```sql
resolveip [options] {host_name|ip-addr} ...
```

O **resolveip** suporta as seguintes opções.

* `--help`, `--info`, `-?`, `-I`

Exibir uma mensagem de ajuda e sair.

* `--silent`, `-s`

Modo silencioso. Produza menos saída.

* `--version`, `-V`

Exibir informações da versão e sair.

### 4.8.5 zlib_decompress — Descomprima o resultado comprimido ZLIB do mysqlpump

O utilitário **zlib\_decompress** descomprime a saída do **mysqlpump** que foi criada usando compressão ZLIB. O **zlib\_decompress** foi adicionado no MySQL 5.7.10.

Invoque **zlib\_decompress** da seguinte forma:

```sql
zlib_decompress input_file output_file
```

Exemplo:

```sql
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

Para ver uma mensagem de ajuda, invoque **zlib\_decompress** sem argumentos.

Para descomprimir a saída comprimida com LZ4 do **mysqlpump**, use **lz4\_decompress**. Veja a Seção 4.8.1, “lz4\_decompress — Descomprima saída comprimida mysqlpump com LZ4”.

