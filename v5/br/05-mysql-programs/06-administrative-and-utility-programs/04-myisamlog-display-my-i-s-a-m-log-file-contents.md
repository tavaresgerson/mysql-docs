### 4.6.4 myisamlog — Exibir o conteúdo do arquivo de log MyISAM

O **myisamlog** processa o conteúdo de um arquivo de log `MyISAM`. Para criar um arquivo desse tipo, inicie o servidor com a opção `--log-isam=log_file`.

Invoque **myisamlog** da seguinte forma:

```sh
myisamlog [options] [file_name [tbl_name] ...]
```

A operação padrão é a atualização (`-u`). Se uma recuperação for realizada (`-r`), todas as escritas e, possivelmente, atualizações e exclusões são realizadas e os erros são apenas contados. O nome padrão do arquivo de log é `myisam.log` se nenhum argumento `*log_file` for fornecido. Se as tabelas forem nomeadas na linha de comando, apenas essas tabelas serão atualizadas.

O **myisamlog** suporta as seguintes opções:

- `-?`, `-I`

  Exiba uma mensagem de ajuda e saia.

- `-c N`

  Execute apenas *`N`* comandos.

- `-f N`

  Especifique o número máximo de arquivos abertos.

- `-F caminho/`

  Especifique o caminho do arquivo com uma barra final.

- `-i`

  Exibir informações extras antes de sair.

- `-o offset`

  Especifique o deslocamento inicial.

- `-p N`

  Remova os componentes *`N`* do caminho.

- `-r`

  Realize uma operação de recuperação.

- `-R record_pos_file record_pos`

  Especifique o arquivo de posição de registro e a posição de registro.

- `-u`

  Realize uma operação de atualização.

- `-v`

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais saída.

- `-w write_file`

  Especifique o arquivo de escrita.

- `-V`

  Exibir informações da versão.
