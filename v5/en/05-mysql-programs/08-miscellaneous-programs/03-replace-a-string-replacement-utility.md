### 4.8.3 replace — Um Utilitário de Substituição de String

O programa utilitário **replace** altera strings diretamente em arquivos ou na entrada padrão (*standard input*).

Nota

O utilitário **replace** foi descontinuado (deprecated) a partir do MySQL 5.7.18 e foi removido no MySQL 8.0.

Invoque **replace** de uma das seguintes maneiras:

```sql
replace from to [from to] ... -- file_name [file_name] ...
replace from to [from to] ... < file_name
```

*`from`* representa uma string a ser procurada e *`to`* representa sua substituição. Pode haver um ou mais pares de strings.

Use a opção `--` para indicar onde a lista de substituição de string termina e onde os nomes dos arquivos começam. Neste caso, qualquer arquivo nomeado na linha de comando (*command line*) é modificado no local (in place), portanto, você pode querer fazer uma cópia do original antes de convertê-lo. O *`replace`* exibe uma mensagem indicando quais dos arquivos de entrada ele realmente modifica.

Se a opção `--` não for fornecida, **replace** lê a entrada padrão (*standard input*) e escreve na saída padrão (*standard output*).

O **replace** utiliza uma máquina de estado finito (*finite state machine*) para fazer a correspondência das strings mais longas primeiro. Ele pode ser usado para trocar (*swap*) strings. Por exemplo, o comando a seguir troca `a` e `b` nos arquivos fornecidos, `file1` e `file2`:

```sql
replace a b b a -- file1 file2 ...
```

O **replace** suporta as seguintes opções.

* `-?`, `-I`

  Exibe uma mensagem de ajuda e sai.

* `-#debug_options`

  Habilita o debugging.

* `-s`

  Modo silencioso. Imprime menos informações sobre o que o programa faz.

* `-v`

  Modo verboso. Imprime mais informações sobre o que o programa faz.

* `-V`

  Exibe informações de versão e sai.