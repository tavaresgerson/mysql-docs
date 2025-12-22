### 6.7.2 `my_print_defaults`  Opções de exibição de arquivos de opções

`my_print_defaults` exibe as opções que estão presentes em grupos de opções de arquivos de opções. A saída indica quais opções são usadas por programas que lêem os grupos de opções especificados. Por exemplo, o programa `mysqlcheck` lê os grupos de opções `[mysqlcheck]` e `[client]`. Para ver quais opções estão presentes nesses grupos nos arquivos de opções padrão, invoque **my\_print\_defaults** assim:

```
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

A saída consiste em opções, uma por linha, na forma que seriam especificadas na linha de comando.

`my_print_defaults` suporta as seguintes opções.

- `--help`, `-?`

Mostra uma mensagem de ajuda e sai.

- `--config-file=file_name`, `--defaults-file=file_name`, `-c file_name`

Leia apenas o ficheiro de opção dado.

- `--debug=debug_options`, `-# debug_options`

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/my_print_defaults.trace`.

- `--defaults-extra-file=file_name`, `--extra-file=file_name`, `-e file_name`

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=suffix`, `-g suffix`

Além dos grupos nomeados na linha de comando, leia os grupos que têm o sufixo dado.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--login-path=name`, `-l name`

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-defaults`, `-n`

Devolva uma cadeia vazia.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--show`, `-s`

  **my\_print\_defaults** mascara senhas por padrão. Use esta opção para exibir senhas como texto claro.
- `--verbose`, `-v`

Imprima mais informações sobre o que o programa faz.

- `--version`, `-V`

Informações de versão e saída.
