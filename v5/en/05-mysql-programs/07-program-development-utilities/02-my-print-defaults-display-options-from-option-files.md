### 4.7.2 my_print_defaults — Exibir Opções de Arquivos de Opções

O **my_print_defaults** exibe as opções presentes em grupos de opções de arquivos de opções. A saída indica quais opções são usadas por programas que leem os grupos de opções especificados. Por exemplo, o programa **mysqlcheck** lê os grupos de opções `[mysqlcheck]` e `[client]`. Para ver quais opções estão presentes nesses grupos nos arquivos de opções padrão, invoque o **my_print_defaults** assim:

```sql
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

A saída consiste em opções, uma por linha, no formato em que seriam especificadas na command line.

O **my_print_defaults** suporta as seguintes opções.

* `--help`, `-?`

  Exibe uma mensagem de ajuda e sai.

* `--config-file=file_name`, `--defaults-file=file_name`, `-c file_name`

  Lê apenas o arquivo de opções fornecido.

* `--debug=debug_options`, `-# debug_options`

  Grava um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O default é `d:t:o,/tmp/my_print_defaults.trace`.

* `--defaults-extra-file=file_name`, `--extra-file=file_name`, `-e file_name`

  Lê este arquivo de opções após o arquivo de opções global, mas (no Unix) antes do arquivo de opções do usuário.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Command Line que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=suffix`, `-g suffix`

  Além dos grupos nomeados na command line, lê grupos que possuem o sufixo fornecido.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Command Line que Afetam o Tratamento de Arquivos de Opções”.

* `--login-path=name`, `-l name`

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções que contém opções que especificam a qual servidor MySQL conectar e com qual conta autenticar. Para criar ou modificar um arquivo de login path, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Command Line que Afetam o Tratamento de Arquivos de Opções”.

* `--no-defaults`, `-n`

  Retorna uma string vazia.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, consulte a Seção 4.2.2.3, “Opções de Command Line que Afetam o Tratamento de Arquivos de Opções”.

* `--show`, `-s`

  A partir do MySQL 5.7.8, o **my_print_defaults** mascara senhas por default. Use esta opção para exibir senhas em cleartext.

* `--verbose`, `-v`

  Modo Verbose. Imprime mais informações sobre o que o programa faz.

* `--version`, `-V`

  Exibe informações de versão e sai.