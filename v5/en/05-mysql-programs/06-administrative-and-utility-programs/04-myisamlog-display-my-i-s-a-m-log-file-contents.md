### 4.6.4 myisamlog — Exibir Conteúdo do Arquivo de Log MyISAM

O **myisamlog** processa o conteúdo de um arquivo de log do `MyISAM`. Para criar tal arquivo, inicie o servidor com a opção `--log-isam=log_file`.

Invoque o **myisamlog** da seguinte forma:

```sql
myisamlog [options] [file_name [tbl_name] ...]
```

A operação padrão é update (atualização) (`-u`). Se uma recovery (recuperação) for realizada (`-r`), todas as gravações (writes) e, possivelmente, as atualizações (updates) e exclusões (deletes) são executadas, e os erros são apenas contabilizados. O nome padrão do log file é `myisam.log` se nenhum argumento *`log_file`* for fornecido. Se tabelas forem nomeadas na linha de comando, apenas essas tabelas serão updated.

O **myisamlog** suporta as seguintes options:

* `-?`, `-I`

  Exibir uma mensagem de ajuda e sair.

* `-c N`

  Executar apenas *`N`* comandos.

* `-f N`

  Especificar o número máximo de arquivos abertos.

* `-F filepath/`

  Especificar o file path (caminho do arquivo) com uma barra final.

* `-i`

  Exibir informações extras antes de sair.

* `-o offset`

  Especificar o offset (deslocamento) inicial.

* `-p N`

  Remover *`N`* componentes do path (caminho).

* `-r`

  Executar uma operação de recovery (recuperação).

* `-R record_pos_file record_pos`

  Especificar o arquivo de posição do registro e a posição do registro.

* `-u`

  Executar uma operação de update (atualização).

* `-v`

  Modo Verbose (detalhado). Imprime mais output (saída) sobre o que o programa está fazendo. Esta option pode ser fornecida múltiplas vezes para produzir cada vez mais output.

* `-w write_file`

  Especificar o write file (arquivo de gravação).

* `-V`

  Exibir informações de version (versão).