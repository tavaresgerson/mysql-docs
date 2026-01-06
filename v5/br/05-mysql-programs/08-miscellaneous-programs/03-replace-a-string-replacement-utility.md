### 4.8.3 replace — Uma Ferramenta de Substituição de Texto

O programa de utilitário **replace** altera as strings no local em arquivos ou na entrada padrão.

Nota

O utilitário **replace** foi descontinuado a partir do MySQL 5.7.18 e foi removido no MySQL 8.0.

Invoque **substituir** de uma das seguintes maneiras:

```sql
replace from to [from to] ... -- file_name [file_name] ...
replace from to [from to] ... < file_name
```

*`from`* representa uma string para procurar e *`to`* representa sua substituição. Pode haver um ou mais pares de strings.

Use a opção `--` para indicar onde a lista de substituição de strings termina e os nomes dos arquivos começam. Neste caso, qualquer arquivo nomeado na linha de comando é modificado no local, então você pode querer fazer uma cópia do original antes de convertê-lo. *`replace`* exibe uma mensagem indicando quais dos arquivos de entrada ele realmente modifica.

Se a opção `--` não for fornecida, o comando **replace** lê a entrada padrão e escreve na saída padrão.

O **replace** usa uma máquina de estados finitos para combinar strings mais longas primeiro. Ele pode ser usado para trocar strings. Por exemplo, o seguinte comando troca `a` e `b` nos arquivos fornecidos, `file1` e `file2`:

```sql
replace a b b a -- file1 file2 ...
```

**replace** suporta as seguintes opções.

- `-?`, `-I`

  Exiba uma mensagem de ajuda e saia.

- `-#debug_options`

  Ative a depuração.

- `-s`

  Modo silencioso. Imprima menos informações sobre o que o programa faz.

- `-v`

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `-V`

  Exibir informações da versão e sair.
