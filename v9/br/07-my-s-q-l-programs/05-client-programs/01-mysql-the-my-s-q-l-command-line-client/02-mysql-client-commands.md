#### 6.5.1.2 Comandos do Cliente do **mysql**

O **mysql** envia cada instrução SQL que você emite para o servidor a ser executada. Há também um conjunto de comandos que o próprio **mysql** interpreta. Para obter uma lista desses comandos, digite `help` ou `\h` no prompt do **mysql**:

```
mysql> help

List of all MySQL commands:
Note that all text commands must be first on line and end with ';'
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input statement.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set statement delimiter.
edit      (\e) Edit command with $EDITOR.
ego       (\G) Send command to mysql server, display result vertically.
exit      (\q) Exit mysql. Same as quit.
go        (\g) Send command to mysql server.
help      (\h) Display this help.
nopager   (\n) Disable pager, print to stdout.
notee     (\t) Don't write into outfile.
pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
print     (\p) Print current command.
prompt    (\R) Change your mysql prompt.
quit      (\q) Quit mysql.
rehash    (\#) Rebuild completion hash.
source    (\.) Execute an SQL script file. Takes a file name as an argument.
status    (\s) Get status information from the server.
system    (\!) Execute a system shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given
               outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing
               binlog with multi-byte charsets.
warnings  (\W) Show warnings after every statement.
nowarning (\w) Don't show warnings after every statement.
resetconnection(\x) Clean session context.
query_attributes Sets string parameters (name1 value1 name2 value2 ...)
for the next query to pick up.
ssl_session_data_print Serializes the current SSL session data to stdout
or file.

For server side help, type 'help contents'
```

Se o **mysql** for invocado com a opção `--binary-mode`, todos os comandos do **mysql** são desabilitados, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`). A opção `--commands` pode ser usada para habilitar ou desabilitar todos os comandos, exceto `/C`, `delimiter` e `use`.

Cada comando tem uma forma longa e curta. A forma longa não é case-sensitive; a forma curta é. A forma longa pode ser seguida por um terminator opcional por ponto e vírgula, mas a forma curta não deve.

O uso de comandos de forma curta dentro de comentários de várias linhas `/* ... */` não é suportado. Os comandos de forma curta funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como os comentários de dica de otimizador `/*+ ... */`, que são armazenados nas definições de objeto. Se houver preocupação de que os comentários de dica de otimizador possam ser armazenados em definições de objeto de modo que os arquivos de dump, ao serem carregados novamente com o **mysql**, resultem na execução desses comandos, invoque o **mysql** com a opção `--binary-mode` ou use um cliente de recarga diferente do **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Exibir uma mensagem de ajuda listando os comandos do **mysql** disponíveis.

  Se você fornecer um argumento para o comando `help`, o **mysql** usa-o como uma string de busca para acessar a ajuda do lado do servidor a partir do conteúdo do Manual de Referência do MySQL. Para mais informações, consulte a Seção 6.5.1.4, “Ajuda do Lado do Servidor do Cliente do **mysql**”.

* `charset charset_name`, `\C charset_name`

Altere o conjunto de caracteres padrão e execute uma declaração `SET NAMES`. Isso permite que o conjunto de caracteres permaneça sincronizado no cliente e no servidor se o **mysql** for executado com o auto-reconexão habilitada (o que não é recomendado), porque o conjunto de caracteres especificado é usado para reconexões.

* `clear`, `\c`

  Limpe a entrada atual. Use isso se você mudar de ideia sobre a execução da declaração que está inserindo.

* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Reconecte-se ao servidor. Os argumentos opcionais de nome de banco de dados e nome do host podem ser fornecidos para especificar o banco de dados padrão ou o host onde o servidor está em execução. Se omitidos, os valores atuais são usados.

  Se o comando `connect` especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` dada no **mysql** ao iniciar para especificar um registro DNS SRV.

* `delimiter str`, `\d str`

  Altere a string que o **mysql** interpreta como o separador entre as declarações SQL. O padrão é o caractere ponto e vírgula (`;`).

  A string de delimitador pode ser especificada como um argumento não citado ou citado na linha de comando do comando `delimiter`. A citação pode ser feita com caracteres de aspas simples (`'`), aspas duplas (`"`) ou aspas retas (```
  mysql> SELECT LAST_INSERT_ID(3);
  +-------------------+
  | LAST_INSERT_ID(3) |
  +-------------------+
  |                 3 |
  +-------------------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                3 |
  +------------------+

  mysql> resetconnection;

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                0 |
  +------------------+
  ```rQnq0QkXgx```
  mysql> pager cat > /tmp/log.txt
  ```0dhAdZfOsG```
  mysql> pager less -n -i -S
  ```uGsDnuSJoe```
  man less
  ```3NMZKG0fzG```
  mysql> pager less -n -i -S -F -X
  ```EE3hV7pJHn```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```9rA38RYXVE```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```KzCxe32GMX```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```66UT7XLFTC```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\\_
  ```kYSsVpOEfW```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```IrpiELX1Jw```
  mysql> prompt (\u@\h) [\d]>\_
  PROMPT set to '(\u@\h) [\d]>\_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```e8insmm1Go```