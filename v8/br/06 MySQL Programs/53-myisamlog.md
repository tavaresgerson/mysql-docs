### 6.6.5 `myisamlog` — Exibir o conteúdo do arquivo de log MyISAM

O `myisamlog` processa o conteúdo de um arquivo de log `MyISAM`. Para criar tal arquivo, inicie o servidor com a opção `--log-isam=log_file`.

Invoque `myisamlog` da seguinte forma:

```
myisamlog [options] [file_name [tbl_name] ...]
```

A operação padrão é a atualização (`-u`). Se uma recuperação for realizada (`-r`), todas as escritas e, possivelmente, atualizações e exclusões são realizadas e os erros são contados apenas. O nome padrão do arquivo de log é `myisam.log` se nenhum argumento `*log_file*` for fornecido. Se as tabelas forem nomeadas na linha de comando, apenas essas tabelas são atualizadas.

O `myisamlog` suporta as seguintes opções:

* `-?`, `-I`

  Exibir uma mensagem de ajuda e sair.
* `-c N`

  Executar apenas *`N`* comandos.
* `-f N`

  Especificar o número máximo de arquivos abertos.
* `-F filepath/`

  Especificar o caminho do arquivo com uma barra invertida no final.
* `-i`

  Exibir informações extras antes de sair.
* `-o offset`

  Especificar o deslocamento inicial.
* `-p N`

  Remover *`N`* componentes do caminho.
* `-r`

  Realizar uma operação de recuperação.
* `-R record_pos_file record_pos`

  Especificar o arquivo de posição de registro e a posição de registro.
* `-u`

  Realizar uma operação de atualização.
* `-v`

  Modo verbose. Imprimir mais saída sobre o que o programa faz. Esta opção pode ser fornecida várias vezes para produzir mais e mais saída.
* `-w write_file`

  Especificar o arquivo de escrita.
* `-V`

  Exibir informações de versão.