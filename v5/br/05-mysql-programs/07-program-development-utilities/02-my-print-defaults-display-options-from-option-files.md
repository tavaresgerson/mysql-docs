### 4.7.2 my_print_defaults — Opções de exibição a partir de arquivos de opção

**my_print_defaults** exibe as opções presentes nos grupos de opções dos arquivos de opções. A saída indica quais opções são usadas pelos programas que leem os grupos de opções especificados. Por exemplo, o programa **mysqlcheck** lê os grupos de opções `[mysqlcheck]` e `[client]`. Para ver quais opções estão presentes nesses grupos nos arquivos de opções padrão, inicie **my_print_defaults** da seguinte maneira:

```sql
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

A saída consiste em opções, uma por linha, na forma como seriam especificadas na linha de comando.

**my_print_defaults** suporta as seguintes opções.

- `--help`, `-?`

  Exiba uma mensagem de ajuda e saia.

- `--config-file=nome_do_arquivo`, `--defaults-file=nome_do_arquivo`, `-c nome_do_arquivo`

  Leia apenas o arquivo de opção fornecido.

- `--debug=opções_de_depuração`, `-# opções_de_depuração`

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/my_print_defaults.trace`.

- `--defaults-extra-file=nome_do_arquivo`, `--extra-file=nome_do_arquivo`, `-e nome_do_arquivo`

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=suffix`, `-g suffix`

  Além dos grupos mencionados na linha de comando, leia grupos que tenham o sufixo especificado.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--login-path=nome`, `-l nome`

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`, `-n`

  Retorne uma string vazia.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--show`, `-s`

  A partir do MySQL 5.7.8, **my_print_defaults** mascara as senhas por padrão. Use esta opção para exibir as senhas em texto claro.

- `--verbose`, `-v`

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `--version`, `-V`

  Exibir informações da versão e sair.
