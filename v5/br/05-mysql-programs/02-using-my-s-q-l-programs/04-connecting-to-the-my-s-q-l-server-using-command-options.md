### 4.2.4 Conectando ao servidor MySQL usando opções de comando

Esta seção descreve o uso das opções de linha de comando para especificar como estabelecer conexões com o servidor MySQL, para clientes como **mysql** ou **mysqldump**. Para obter informações adicionais se você não conseguir se conectar, consulte a Seção 6.2.17, “Soluções de problemas para conectar-se ao MySQL”.

Para que um programa cliente se conecte ao servidor MySQL, ele deve usar os parâmetros de conexão adequados, como o nome do host onde o servidor está sendo executado e o nome de usuário e senha da sua conta MySQL. Cada parâmetro de conexão tem um valor padrão, mas você pode substituir os valores padrão conforme necessário, usando opções de programa especificadas na linha de comando ou em um arquivo de opções.

Os exemplos aqui usam o programa cliente **mysql**, mas os princípios se aplicam a outros clientes, como **mysqldump**, **mysqladmin** ou **mysqlshow**.

Este comando invoca o **mysql** sem especificar nenhum parâmetro de conexão explícito:

```sh
mysql
```

Como não há opções de parâmetros, os valores padrão são aplicados:

- O nome de host padrão é `localhost`. No Unix, isso tem um significado especial, conforme descrito mais adiante.

- O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

- Nenhuma senha é enviada porque nem `--password` nem `-p` foram fornecidos.

- Para o **mysql**, o primeiro argumento não opcional é considerado o nome do banco de dados padrão. Como não há tal argumento, o **mysql** não seleciona nenhum banco de dados padrão.

Para especificar o nome do host e o nome do usuário explicitamente, além de uma senha, forneça as opções apropriadas na linha de comando. Para selecionar um banco de dados padrão, adicione um argumento de nome do banco de dados. Exemplos:

```sh
mysql --host=localhost --user=myname --password=password mydb
mysql -h localhost -u myname -ppassword mydb
```

Para as opções de senha, o valor da senha é opcional:

- Se você usar a opção `--password` ou `-p` e especificar um valor de senha, não deve haver *espaço* entre `--password=` ou `-p` e a senha que segue.

- Se você usar `--password` ou `-p`, mas não especificar um valor de senha, o programa cliente solicitará que você insira a senha. A senha não será exibida enquanto você a digita. Isso é mais seguro do que fornecer a senha na linha de comando, o que pode permitir que outros usuários do seu sistema vejam a linha da senha ao executar um comando como **ps**. Veja a Seção 6.1.2.1, “Diretrizes para Usuários Finais sobre Segurança de Senhas”.

- Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma senha, use a opção `--skip-password`.

Como mencionado, incluir o valor da senha na linha de comando é um risco à segurança. Para evitar esse risco, especifique a opção `--password` ou `-p` sem nenhum valor de senha subsequente:

```sh
mysql --host=localhost --user=myname --password mydb
mysql -h localhost -u myname -p mydb
```

Quando a opção `--password` ou `-p` é fornecida sem um valor de senha, o programa cliente exibe uma solicitação e aguarda que você insira a senha. (Nesses exemplos, `mydb` *não* é interpretado como uma senha porque está separado da opção de senha anterior por um espaço.)

Em alguns sistemas, a rotina da biblioteca que o MySQL usa para solicitar uma senha limita automaticamente a senha a oito caracteres. Essa limitação é uma propriedade da biblioteca do sistema, não do MySQL. Internamente, o MySQL não tem nenhum limite para o comprimento da senha. Para contornar a limitação em sistemas afetados, especifique sua senha em um arquivo de opção (consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”). Outra solução é alterar sua senha do MySQL para um valor que tenha oito ou menos caracteres, mas isso tem a desvantagem de que senhas mais curtas tendem a ser menos seguras.

Os programas do cliente determinam o tipo de conexão a ser feita da seguinte forma:

- Se o host não for especificado ou for `localhost`, ocorrerá uma conexão com o host local:
  - No Windows, o cliente se conecta usando memória compartilhada, se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
  - No Unix, os programas do MySQL tratam o nome do host `localhost` de maneira especial, de uma forma que provavelmente é diferente do que você espera em comparação com outros programas baseados em rede: o cliente se conecta usando um arquivo de socket Unix. A opção `--socket` ou a variável de ambiente `MYSQL_UNIX_PORT` podem ser usadas para especificar o nome do socket.
- No Windows, se `host` for `.` (ponto) ou se o TCP/IP não estiver habilitado e `--socket` não for especificado ou se o host estiver vazio, o cliente se conecta usando um tubo nomeado, se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Se as conexões por tubo nomeado não forem suportadas ou se o usuário que está fazendo a conexão não for membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorrerá um erro.
- Caso contrário, a conexão usa TCP/IP.

A opção `--protocol` permite que você use um protocolo de transporte específico mesmo quando outras opções normalmente resultam no uso de um protocolo diferente. Isso significa que `--protocol` especifica explicitamente o protocolo de transporte e substitui as regras anteriores, mesmo para `localhost`.

Apenas as opções de conexão relevantes para o protocolo de transporte selecionado são usadas ou verificadas. Outras opções de conexão são ignoradas. Por exemplo, com `--host=localhost` no Unix, o cliente tenta se conectar ao servidor local usando um arquivo de socket Unix, mesmo que uma opção `--port` ou `-P` seja fornecida para especificar um número de porta TCP/IP.

Para garantir que o cliente estabeleça uma conexão TCP/IP com o servidor local, use `--host` ou `-h` para especificar um valor de nome de host de `127.0.0.1` (em vez de `localhost`) ou o endereço IP ou o nome do servidor local. Você também pode especificar explicitamente o protocolo de transporte, mesmo para `localhost`, usando a opção `--protocol=TCP`. Exemplos:

```sh
mysql --host=127.0.0.1
mysql --protocol=TCP
```

Se o servidor estiver configurado para aceitar conexões IPv6, os clientes podem se conectar ao servidor local via IPv6 usando `--host=::1`. Consulte a Seção 5.1.12, “Suporte IPv6”.

No Windows, para forçar um cliente MySQL a usar uma conexão de canal nomeado, especifique a opção `--pipe` ou `--protocol=PIPE`, ou especifique `.` (ponto) como o nome do host. Se o servidor não foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado ou se o usuário que está fazendo a conexão não é membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorre um erro. Use a opção `--socket` para especificar o nome do canal se você não quiser usar o nome padrão do canal.

As conexões com servidores remotos utilizam TCP/IP. Este comando conecta-se ao servidor que está em execução em `remote.example.com` usando o número de porta padrão (3306):

```sh
mysql --host=remote.example.com
```

Para especificar um número de porta explicitamente, use a opção `--port` ou `-P`:

```sh
mysql --host=remote.example.com --port=13306
```

Você também pode especificar um número de porta para conexões a um servidor local. No entanto, como indicado anteriormente, as conexões ao `localhost` no Unix usam um arquivo de soquete por padrão, então, a menos que você force uma conexão TCP/IP como descrito anteriormente, qualquer opção que especifique um número de porta será ignorada.

Para este comando, o programa usa um arquivo de soquete no Unix e a opção `--port` é ignorada:

```sh
mysql --port=13306 --host=localhost
```

Para que o número de porta seja usado, force uma conexão TCP/IP. Por exemplo, invocando o programa de uma das seguintes maneiras:

```sh
mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP
```

Para obter informações adicionais sobre as opções que controlam a forma como os programas do cliente estabelecem conexões com o servidor, consulte a Seção 4.2.3, “Opções de comando para conectar-se ao servidor”.

É possível especificar os parâmetros de conexão sem inseri-los na linha de comando cada vez que você invoca um programa cliente:

- Especifique os parâmetros de conexão na seção `[client]` de um arquivo de opção. A seção relevante do arquivo pode parecer assim:

  ```
  [client]
  host=host_name
  user=user_name
  password=password
  ```

  Para obter mais informações, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

- Alguns parâmetros de conexão podem ser especificados usando variáveis de ambiente. Exemplos:
  - Para especificar o host para **mysql**, use `MYSQL_HOST`.
  - Em Windows, para especificar o nome do usuário do MySQL, use `USER`.
  - Para especificar a senha, use `MYSQL_PWD`. No entanto, isso é inseguro; veja a Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para uma lista de variáveis de ambiente suportadas, consulte a Seção 4.9, “Variáveis de Ambiente”.
