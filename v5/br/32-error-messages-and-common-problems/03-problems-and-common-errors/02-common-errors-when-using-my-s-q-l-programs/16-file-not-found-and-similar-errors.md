#### B.3.2.16 File Not Found e Erros Semelhantes

Se você receber `ERROR 'file_name' not found (errno: 23)`, `Can't open file: file_name (errno: 24)`, ou qualquer outro erro com `errno 23` ou `errno 24` do MySQL, isso significa que você não alocou `file descriptors` suficientes para o servidor MySQL. Você pode usar o utilitário **perror** para obter uma descrição do que o número do erro significa:

```sql
$> perror 23
OS error code  23:  File table overflow
$> perror 24
OS error code  24:  Too many open files
$> perror 11
OS error code  11:  Resource temporarily unavailable
```

O problema aqui é que o **mysqld** está tentando manter muitos arquivos abertos simultaneamente. Você pode instruir o **mysqld** a não abrir tantos arquivos de uma vez ou aumentar o número de `file descriptors` disponíveis para o **mysqld**.

Para instruir o **mysqld** a manter menos arquivos abertos por vez, você pode reduzir o tamanho do `table cache` diminuindo o valor da `system variable` `table_open_cache` (o valor padrão é 64). Isso pode não impedir totalmente o esgotamento de `file descriptors` porque, em algumas circunstâncias, o servidor pode tentar estender o tamanho do `cache` temporariamente, conforme descrito na Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tables”. A redução do valor de `max_connections` também diminui o número de arquivos abertos (o valor padrão é 100).

Para alterar o número de `file descriptors` disponíveis para o **mysqld**, você pode usar a `option` `--open-files-limit` para o **mysqld_safe** ou definir a `system variable` `open_files_limit`. Consulte a Seção 5.1.7, “Server System Variables”. A maneira mais fácil de definir esses valores é adicionar uma `option` ao seu `option file`. Consulte a Seção 4.2.2.2, “Using Option Files”. Se você tiver uma versão antiga do **mysqld** que não oferece suporte à configuração do limite de arquivos abertos, você pode editar o script **mysqld_safe**. Existe uma linha comentada **ulimit -n 256** no script. Você pode remover o caractere `#` para descomentar esta linha e alterar o número `256` para definir o número de `file descriptors` a serem disponibilizados para o **mysqld**.

`--open-files-limit` e **ulimit** podem aumentar o número de `file descriptors`, mas apenas até o limite imposto pelo sistema operacional. Há também um limite "hard" (rígido) que só pode ser substituído se você iniciar o **mysqld_safe** ou o **mysqld** como `root` (apenas lembre-se de que, neste caso, você também precisa iniciar o servidor com a `option` `--user` para que ele não continue a ser executado como `root` após a inicialização). Se você precisar aumentar o limite do sistema operacional no número de `file descriptors` disponíveis para cada processo, consulte a documentação do seu sistema.

Note

Se você executar o `shell` **tcsh**, o **ulimit** não funciona! O **tcsh** também reporta valores incorretos quando você solicita os limites atuais. Neste caso, você deve iniciar o **mysqld_safe** usando **sh**.