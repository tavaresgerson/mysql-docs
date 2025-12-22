### 6.6.5 myisamlog  Mostrar o conteúdo do arquivo de registro MyISAM

**myisamlog** processa o conteúdo de um `MyISAM` arquivo de log. Para criar tal arquivo, inicie o servidor com uma `--log-isam=log_file` opção.

Invocar **myisamlog** assim:

```
myisamlog [options] [file_name [tbl_name] ...]
```

A operação padrão é atualizar (`-u`). Se uma recuperação for feita (`-r`), todas as gravações e, possivelmente, atualizações e exclusões são feitas e apenas os erros são contados. O nome do arquivo de log padrão é `myisam.log` se nenhum argumento `log_file` for dado. Se as tabelas forem nomeadas na linha de comando, apenas essas tabelas são atualizadas.

**myisamlog** suporta as seguintes opções:

- `-?`, `-I`

  Mostra uma mensagem de ajuda e sai.
- `-c N`

  Executar apenas comandos `N`.
- `-f N`

  Especificar o número máximo de ficheiros abertos.
- `-F filepath/`

  Especifique o caminho do arquivo com uma barra final.
- `-i`

  Exibir informações adicionais antes de sair.
- `-o offset`

  Especificar o deslocamento inicial.
- `-p N`

  Remover os componentes `N` do caminho.
- `-r`

  Realizar uma operação de recuperação.
- `-R record_pos_file record_pos`

  Especificar arquivo de posição de registo e posição de registo.
- `-u`

  Realizar uma operação de actualização.
- `-v`

  Imprima mais output sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais output.
- `-w write_file`

  Especifique o arquivo de gravação.
- `-V`

  Informações de versão de exibição.
