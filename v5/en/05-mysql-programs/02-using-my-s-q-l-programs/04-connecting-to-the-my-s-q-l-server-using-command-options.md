### 4.2.4 Conectando ao MySQL Server Usando Opções de Comando

Esta seção descreve o uso de opções de linha de comando (command-line options) para especificar como estabelecer conexões com o MySQL Server, para Clients como **mysql** ou **mysqldump**. Para informações adicionais, caso você não consiga se conectar, consulte a Seção 6.2.17, “Troubleshooting Problems Connecting to MySQL”.

Para que um programa Client se conecte ao MySQL Server, ele deve usar os parâmetros de conexão apropriados, como o nome do Host onde o Server está em execução e o User Name e Password da sua conta MySQL. Cada parâmetro de conexão possui um valor default, mas você pode sobrescrever os valores default conforme necessário usando opções de programa especificadas na Command Line ou em um Option File.

Os exemplos aqui utilizam o programa Client **mysql**, mas os princípios se aplicam a outros Clients como **mysqldump**, **mysqladmin** ou **mysqlshow**.

Este comando invoca o **mysql** sem especificar quaisquer parâmetros de conexão explícitos:

```sql
mysql
```

Como não há opções de parâmetro, os valores default se aplicam:

* O Host Name default é `localhost`. No Unix, isso tem um significado especial, conforme descrito adiante.

* O User Name default é `ODBC` no Windows ou o seu nome de login Unix no Unix.

* Nenhuma Password é enviada porque nem `--password` nem `-p` são fornecidas.

* Para o **mysql**, o primeiro argumento que não é uma opção é considerado o nome do Database default. Como não há tal argumento, o **mysql** não seleciona nenhum Database default.

Para especificar explicitamente o Host Name e o User Name, bem como uma Password, forneça as opções apropriadas na Command Line. Para selecionar um Database default, adicione um argumento de nome do Database. Exemplos:

```sql
mysql --host=localhost --user=myname --password=password mydb
mysql -h localhost -u myname -ppassword mydb
```

Para opções de Password, o valor da Password é opcional:

* Se você usar uma opção `--password` ou `-p` e especificar um valor de Password, *não deve haver espaço* entre `--password=` ou `-p` e a Password que a segue.

* Se você usar `--password` ou `-p`, mas não especificar um valor de Password, o programa Client solicitará que você insira a Password. A Password não é exibida enquanto você a insere. Isso é mais seguro do que fornecer a Password na Command Line, o que pode permitir que outros usuários em seu sistema vejam a linha da Password executando um comando como **ps**. Consulte a Seção 6.1.2.1, “End-User Guidelines for Password Security”.

* Para especificar explicitamente que não há Password e que o programa Client não deve solicitá-la, use a opção `--skip-password`.

Conforme mencionado, incluir o valor da Password na Command Line é um risco de segurança. Para evitar esse risco, especifique a opção `--password` ou `-p` sem nenhum valor de Password a seguir:

```sql
mysql --host=localhost --user=myname --password mydb
mysql -h localhost -u myname -p mydb
```

Quando a opção `--password` ou `-p` é fornecida sem um valor de Password, o programa Client exibe um prompt e aguarda que você insira a Password. (Nestes exemplos, `mydb` *não* é interpretado como uma Password porque está separado da opção de Password anterior por um espaço.)

Em alguns sistemas, a rotina de biblioteca que o MySQL usa para solicitar uma Password limita automaticamente a Password a oito caracteres. Essa limitação é uma propriedade da biblioteca do sistema, não do MySQL. Internamente, o MySQL não possui limite para o comprimento da Password. Para contornar a limitação em sistemas afetados, especifique sua Password em um Option File (consulte a Seção 4.2.2.2, “Using Option Files”). Outra solução alternativa é alterar sua Password do MySQL para um valor que tenha oito ou menos caracteres, mas isso tem a desvantagem de que Passwords mais curtas tendem a ser menos seguras.

Os programas Client determinam o tipo de conexão a ser estabelecida da seguinte forma:

* Se o Host não for especificado ou for `localhost`, ocorre uma conexão com o Host local:

  + No Windows, o Client se conecta usando Shared Memory, se o Server foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de Shared Memory.

  + No Unix, os programas MySQL tratam o Host Name `localhost` de forma especial, de um modo que provavelmente difere do que você espera em comparação com outros programas baseados em rede: o Client se conecta usando um arquivo Unix Socket. A opção `--socket` ou a Environment Variable `MYSQL_UNIX_PORT` pode ser usada para especificar o nome do Socket.

* No Windows, se o `host` for `.` (ponto), ou o TCP/IP não estiver habilitado e `--socket` não for especificado ou o Host estiver vazio, o Client se conecta usando um Named Pipe, se o Server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões Named Pipe. Se as conexões Named Pipe não forem suportadas ou se o usuário que está fazendo a conexão não for membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorrerá um erro.

* Caso contrário, a conexão utiliza TCP/IP.

A opção `--protocol` permite que você use um Protocol de transporte específico mesmo quando outras opções normalmente resultariam no uso de um Protocol diferente. Ou seja, `--protocol` especifica o Protocol de transporte explicitamente e sobrescreve as regras anteriores, mesmo para `localhost`.

Apenas as opções de conexão que são relevantes para o Protocol de transporte selecionado são usadas ou verificadas. Outras opções de conexão são ignoradas. Por exemplo, com `--host=localhost` no Unix, o Client tenta se conectar ao Server local usando um arquivo Unix Socket, mesmo que uma opção `--port` ou `-P` seja fornecida para especificar um número de porta TCP/IP.

Para garantir que o Client estabeleça uma conexão TCP/IP com o Server local, use `--host` ou `-h` para especificar um valor de Host Name de `127.0.0.1` (em vez de `localhost`), ou o IP address ou nome do Server local. Você também pode especificar o Protocol de transporte explicitamente, mesmo para `localhost`, usando a opção `--protocol=TCP`. Exemplos:

```sql
mysql --host=127.0.0.1
mysql --protocol=TCP
```

Se o Server estiver configurado para aceitar conexões IPv6, os Clients podem se conectar ao Server local por IPv6 usando `--host=::1`. Consulte a Seção 5.1.12, “IPv6 Support”.

No Windows, para forçar um Client MySQL a usar uma conexão Named Pipe, especifique a opção `--pipe` ou `--protocol=PIPE`, ou especifique `.` (ponto) como o Host Name. Se o Server não foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões Named Pipe ou se o usuário que está fazendo a conexão não for membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorrerá um erro. Use a opção `--socket` para especificar o nome do Pipe se você não quiser usar o nome de Pipe default.

Conexões a Servers remotos usam TCP/IP. Este comando se conecta ao Server em execução em `remote.example.com` usando o número de porta default (3306):

```sql
mysql --host=remote.example.com
```

Para especificar um número de porta explicitamente, use a opção `--port` ou `-P`:

```sql
mysql --host=remote.example.com --port=13306
```

Você também pode especificar um número de porta para conexões a um Server local. No entanto, conforme indicado anteriormente, as conexões a `localhost` no Unix usam um arquivo Socket por default, então, a menos que você force uma conexão TCP/IP conforme descrito anteriormente, qualquer opção que especifique um número de porta será ignorada.

Para este comando, o programa usa um arquivo Socket no Unix e a opção `--port` é ignorada:

```sql
mysql --port=13306 --host=localhost
```

Para fazer com que o número da porta seja usado, force uma conexão TCP/IP. Por exemplo, invoque o programa de uma destas maneiras:

```sql
mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP
```

Para informações adicionais sobre opções que controlam como os programas Client estabelecem conexões com o Server, consulte a Seção 4.2.3, “Command Options for Connecting to the Server”.

É possível especificar parâmetros de conexão sem inseri-los na Command Line toda vez que você invocar um programa Client:

* Especifique os parâmetros de conexão na seção `[client]` de um Option File. A seção relevante do arquivo pode se parecer com isto:

  ```sql
  [client]
  host=host_name
  user=user_name
  password=password
  ```

  Para mais informações, consulte a Seção 4.2.2.2, “Using Option Files”.

* Alguns parâmetros de conexão podem ser especificados usando Environment Variables. Exemplos:

  + Para especificar o Host para o **mysql**, use `MYSQL_HOST`.

  + No Windows, para especificar o User Name do MySQL, use `USER`.

  + Para especificar a Password, use `MYSQL_PWD`. No entanto, isso não é seguro; consulte a Seção 6.1.2.1, “End-User Guidelines for Password Security”.

Para uma lista de Environment Variables suportadas, consulte a Seção 4.9, “Environment Variables”.