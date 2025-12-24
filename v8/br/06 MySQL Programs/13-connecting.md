### 6.2.4 Conexão ao servidor MySQL usando opções de comando

Esta seção descreve o uso de opções de linha de comando para especificar como estabelecer conexões com o servidor MySQL, para clientes como `mysql` ou `mysqldump`. Para informações sobre como estabelecer conexões usando strings de conexão semelhantes a URI ou pares de chave-valor, para clientes como o MySQL Shell, consulte a Seção 6.2.5, Conectando ao servidor usando strings semelhantes a URI ou pares de chave-valor. Para informações adicionais se você não conseguir se conectar, consulte a Seção 8.2.22, Solução de problemas conectando ao MySQL.

Para que um programa cliente se conecte ao servidor MySQL, ele deve usar os parâmetros de conexão apropriados, como o nome do host onde o servidor está sendo executado e o nome de usuário e senha da sua conta MySQL. Cada parâmetro de conexão tem um valor padrão, mas você pode substituir valores padrão conforme necessário usando as opções de programa especificadas na linha de comando ou em um arquivo de opções.

Os exemplos aqui usam o programa cliente `mysql`, mas os princípios se aplicam a outros clientes, como `mysqldump`, `mysqladmin` ou `mysqlshow`.

Este comando invoca `mysql` sem especificar quaisquer parâmetros de conexão explícitos:

```
mysql
```

Uma vez que não existem opções de parâmetros, aplicam-se os valores por defeito:

- O nome do host padrão é `localhost`. No Unix, isso tem um significado especial, como descrito mais adiante.
- O nome de usuário padrão é `ODBC` no Windows ou seu nome de login no Unix.
- Nenhuma senha é enviada porque nem `--password` nem `-p` é dado.
- Para `mysql`, o primeiro argumento de não opção é tomado como o nome do banco de dados padrão.

Para especificar o nome do host e o nome do usuário explicitamente, bem como uma senha, forneça as opções apropriadas na linha de comando. Para selecionar um banco de dados padrão, adicione um argumento de nome do banco de dados.

```
mysql --host=localhost --user=myname --password=password mydb
mysql -h localhost -u myname -ppassword mydb
```

Para as opções de senha, o valor da senha é opcional:

- Se você usar uma opção `--password` ou `-p` e especificar um valor de senha, não deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue.
- Se você usar `--password` ou `-p` mas não especificar um valor de senha, o programa cliente solicita que você insira a senha. A senha não é exibida quando você a insere. Isso é mais seguro do que dar a senha na linha de comando, o que pode permitir que outros usuários em seu sistema vejam a linha de senha executando um comando como `ps`.
- Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password`.

Como acabamos de mencionar, incluir o valor da senha na linha de comando é um risco de segurança. Para evitar esse risco, especifique a opção `--password` ou `-p` sem qualquer dos seguintes valores de senha:

```
mysql --host=localhost --user=myname --password mydb
mysql -h localhost -u myname -p mydb
```

Quando a opção `--password` ou `-p` é dada sem valor de senha, o programa cliente imprime um prompt e espera que você insira a senha. (Nestes exemplos, `mydb` é *não* interpretado como uma senha porque é separado da opção de senha anterior por um espaço.)

Em alguns sistemas, a rotina de biblioteca que o MySQL usa para solicitar uma senha limita automaticamente a senha a oito caracteres. Essa limitação é uma propriedade da biblioteca do sistema, não do MySQL. Internamente, o MySQL não tem nenhum limite para o comprimento da senha. Para contornar a limitação em sistemas afetados por ela, especifique sua senha em um arquivo de opções (ver Seção 6.2.2.2, Using Option Files). Outra solução é alterar sua senha do MySQL para um valor que tenha oito ou menos caracteres, mas que tenha a desvantagem de que senhas mais curtas tendem a ser menos seguras.

Os programas de cliente determinam o tipo de conexão a fazer da seguinte forma:

- Se o host não for especificado ou for `localhost`, ocorre uma conexão com o host local:

  - No Windows, o cliente se conecta usando memória compartilhada, se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
  - No Unix, os programas MySQL tratam o nome de host `localhost` especialmente, de uma maneira que é provavelmente diferente do que você espera em comparação com outros programas baseados em rede: o cliente se conecta usando um arquivo de soquete Unix. A opção `--socket` ou a variável de ambiente `MYSQL_UNIX_PORT` podem ser usadas para especificar o nome do soquete.
- No Windows, se `host` é `.` (período), ou TCP/IP não está habilitado e `--socket` não é especificado ou o host está vazio, o cliente se conecta usando um tubo nomeado, se o servidor foi iniciado com a variável do sistema `named_pipe` habilitada para suportar conexões nomeadas-pipe. Se as conexões nomeadas-pipe não são suportadas ou se o usuário que faz a conexão não é um membro do grupo Windows especificado pela variável do sistema `named_pipe_full_access_group`, ocorre um erro.
- Caso contrário, a conexão utiliza TCP/IP.

A opção `--protocol` permite que você use um protocolo de transporte específico, mesmo quando outras opções normalmente resultam no uso de um protocolo diferente. Isto é, `--protocol` especifica o protocolo de transporte explicitamente e substitui as regras anteriores, mesmo para `localhost`.

Apenas as opções de conexão que são relevantes para o protocolo de transporte selecionado são usadas ou verificadas. Outras opções de conexão são ignoradas. Por exemplo, com `--host=localhost` no Unix, o cliente tenta se conectar ao servidor local usando um arquivo de soquete Unix, mesmo que uma `--port` ou `-P` opção seja dada para especificar um número de porta TCP/IP.

Para garantir que o cliente faça uma conexão TCP/IP com o servidor local, use `--host` ou `-h` para especificar um valor de nome de host de `127.0.0.1` (em vez de `localhost`), ou o endereço IP ou o nome do servidor local. Você também pode especificar o protocolo de transporte explicitamente, mesmo para `localhost`, usando a opção `--protocol=TCP`.

```
mysql --host=127.0.0.1
mysql --protocol=TCP
```

Se o servidor estiver configurado para aceitar conexões IPv6, os clientes podem se conectar ao servidor local por IPv6 usando `--host=::1`.

No Windows, para forçar um cliente MySQL a usar uma conexão nomeada, especifique a opção `--pipe` ou `--protocol=PIPE`, ou especifique `.` (período) como o nome do host. Se o servidor não foi iniciado com a variável do sistema `named_pipe` habilitada para suportar conexões nomeadas ou se o usuário que faz a conexão não é membro do grupo Windows especificado pela variável do sistema `named_pipe_full_access_group`, ocorre um erro. Use a opção `--socket` para especificar o nome do tubo se você não quiser usar o nome do tubo padrão.

As conexões com servidores remotos usam TCP/IP. Este comando conecta-se ao servidor em `remote.example.com` usando o número de porta padrão (3306):

```
mysql --host=remote.example.com
```

Para especificar um número de porta explicitamente, use a opção `--port` ou `-P`:

```
mysql --host=remote.example.com --port=13306
```

Você também pode especificar um número de porta para conexões com um servidor local. No entanto, como indicado anteriormente, as conexões com `localhost` no Unix usam um arquivo de soquete por padrão, então, a menos que você force uma conexão TCP/IP como descrito anteriormente, qualquer opção que especifique um número de porta é ignorada.

Para este comando, o programa usa um arquivo socket no Unix e a opção `--port` é ignorada:

```
mysql --port=13306 --host=localhost
```

Para fazer com que o número de porta seja usado, force uma conexão TCP/IP. Por exemplo, invoque o programa de uma das seguintes maneiras:

```
mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP
```

Para obter informações adicionais sobre as opções que controlam como os programas cliente estabelecem conexões com o servidor, consulte a Seção 6.2.3, "Opções de comando para conexão com o servidor".

É possível especificar parâmetros de conexão sem inserí-los na linha de comando cada vez que você invoca um programa cliente:

- Especifique os parâmetros de conexão na seção `[client]` de um arquivo de opções. A seção relevante do arquivo pode ser assim:

  ```
  [client]
  host=host_name
  user=user_name
  password=password
  ```

  Para mais informações, ver secção 6.2.2.2, "Utilização de ficheiros de opções".
- Alguns parâmetros de conexão podem ser especificados usando variáveis de ambiente.

  - Para especificar o host para `mysql`, use `MYSQL_HOST`.
  - No Windows, para especificar o nome de usuário do MySQL, use `USER`.

  Para uma lista de variáveis ambientais suportadas, ver Secção 6.9, "Variáveis ambientais".
