### 6.7.2 my\_print\_defaults — Opções de Exibição a partir de Arquivos de Opções

**my\_print\_defaults** exibe as opções presentes nos grupos de opções dos arquivos de opções. A saída indica quais opções são usadas pelos programas que leem os grupos de opções especificados. Por exemplo, o programa **mysqlcheck** lê os grupos de opções `[mysqlcheck]` e `[client]`. Para ver quais opções estão presentes nesses grupos nos arquivos de opções padrão, inicie **my\_print\_defaults** da seguinte forma:

```
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

A saída consiste em opções, uma por linha, na forma como seriam especificadas na linha de comando.

**my\_print\_defaults** suporta as seguintes opções.

* `--help`, `-?`

  Exibe uma mensagem de ajuda e encerra.

* `--config-file=file_name`, `--defaults-file=file_name`, `-c file_name`

  Leia apenas o arquivo de opções fornecido.

* `--debug=debug_options`, `-# debug_options`

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/my_print_defaults.trace`.

* `--defaults-extra-file=file_name`, `--extra-file=file_name`, `-e file_name`

  Leia este arquivo de opções após o arquivo de opções global, mas (no Unix) antes do arquivo de opções do usuário.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=suffix`, `-g suffix`

  Além dos grupos nomeados na linha de comando, leia grupos que tenham o sufixo fornecido.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--login-path=name`, `-l name`

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e com qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-login-paths`

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-defaults`, `-n`

  Retorna uma string vazia.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--show`, `-s`

  O **my\_print\_defaults** mascara as senhas por padrão. Use esta opção para exibir as senhas como texto claro.

* `--verbose`, `-v`

  Modo verbose. Imprima mais informações sobre o que o programa faz.

* `--version`, `-V`

  Exiba informações de versão e saia.