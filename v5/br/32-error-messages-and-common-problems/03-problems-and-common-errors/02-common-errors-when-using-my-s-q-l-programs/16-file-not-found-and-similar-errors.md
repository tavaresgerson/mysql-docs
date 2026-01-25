#### B.3.2.16 File Not Found e Erros Semelhantes

Se você receber `ERROR 'file_name' not found (errno: 23)`, `Can't open file: file_name (errno: 24)`, ou qualquer outro erro com `errno 23` ou `errno 24` do MySQL, isso significa que você não alocou `file descriptors` suficientes para o servidor MySQL. Você pode usar o utilitário [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") para obter uma descrição do que o número do erro significa:

```sql
$> perror 23
OS error code  23:  File table overflow
$> perror 24
OS error code  24:  Too many open files
$> perror 11
OS error code  11:  Resource temporarily unavailable
```

O problema aqui é que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") está tentando manter muitos arquivos abertos simultaneamente. Você pode instruir o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") a não abrir tantos arquivos de uma vez ou aumentar o número de `file descriptors` disponíveis para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Para instruir o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") a manter menos arquivos abertos por vez, você pode reduzir o tamanho do `table cache` diminuindo o valor da `system variable` [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) (o valor padrão é 64). Isso pode não impedir totalmente o esgotamento de `file descriptors` porque, em algumas circunstâncias, o servidor pode tentar estender o tamanho do `cache` temporariamente, conforme descrito na [Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables"). A redução do valor de [`max_connections`](server-system-variables.html#sysvar_max_connections) também diminui o número de arquivos abertos (o valor padrão é 100).

Para alterar o número de `file descriptors` disponíveis para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), você pode usar a `option` [`--open-files-limit`](mysqld-safe.html#option_mysqld_safe_open-files-limit) para o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") ou definir a `system variable` [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit). Consulte a [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). A maneira mais fácil de definir esses valores é adicionar uma `option` ao seu `option file`. Consulte a [Seção 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files"). Se você tiver uma versão antiga do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que não oferece suporte à configuração do limite de arquivos abertos, você pode editar o script [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). Existe uma linha comentada **ulimit -n 256** no script. Você pode remover o caractere `#` para descomentar esta linha e alterar o número `256` para definir o número de `file descriptors` a serem disponibilizados para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

[`--open-files-limit`](mysqld-safe.html#option_mysqld_safe_open-files-limit) e **ulimit** podem aumentar o número de `file descriptors`, mas apenas até o limite imposto pelo sistema operacional. Há também um limite "hard" (rígido) que só pode ser substituído se você iniciar o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") ou o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como `root` (apenas lembre-se de que, neste caso, você também precisa iniciar o servidor com a `option` [`--user`](server-options.html#option_mysqld_user) para que ele não continue a ser executado como `root` após a inicialização). Se você precisar aumentar o limite do sistema operacional no número de `file descriptors` disponíveis para cada processo, consulte a documentação do seu sistema.

Note

Se você executar o `shell` **tcsh**, o **ulimit** não funciona! O **tcsh** também reporta valores incorretos quando você solicita os limites atuais. Neste caso, você deve iniciar o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") usando **sh**.