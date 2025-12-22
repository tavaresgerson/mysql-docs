#### 6.2.2.6 Opções por defeito, Opções com valores a esperar e o sinal =

Por convenção, formas longas de opções que atribuem um valor são escritas com um sinal de igual (`=`), como este:

```
mysql --host=tonfisk --user=jon
```

Para as opções que exigem um valor (ou seja, que não tenham um valor padrão), o sinal de igual não é necessário e, portanto, o seguinte também é válido:

```
mysql --host tonfisk --user jon
```

Em ambos os casos, o cliente `mysql` tenta se conectar a um servidor MySQL em execução no host chamado tonfisk usando uma conta com o nome de usuário jon.

Devido a esse comportamento, ocasionalmente podem surgir problemas quando nenhum valor é fornecido para uma opção que espera um. Considere o seguinte exemplo, onde um usuário se conecta a um servidor MySQL em execução no host `tonfisk` como usuário `jon`:

```
$> mysql --host 85.224.35.45 --user jon
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 8.4.6 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| jon@%          |
+----------------+
1 row in set (0.00 sec)
```

Omitir o valor necessário para uma dessas opções produz um erro, como o mostrado aqui:

```
$> mysql --host 85.224.35.45 --user
mysql: option '--user' requires an argument
```

Neste caso, `mysql` não conseguiu encontrar um valor após a opção `--user` porque nada veio depois dela na linha de comando. No entanto, se você omitir o valor de uma opção que é \* não \* a última opção a ser usada, você obtém um erro diferente que você pode não estar esperando:

```
$> mysql --host --user jon
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

Como `mysql` assume que qualquer string após `--host` na linha de comando é um nome de host, `--host` `--user` é interpretado como `--host=--user`, e o cliente tenta se conectar a um servidor MySQL em execução em um host chamado --user.

As opções que têm valores padrão sempre exigem um sinal de igual ao atribuir um valor; não fazê-lo causa um erro. Por exemplo, a opção do servidor MySQL `--log-error` tem o valor padrão `host_name.err`, onde \* `host_name` \* é o nome do host no qual o MySQL está sendo executado.

```
$> mysqld_safe &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

Depois de desligar o servidor, reinicie-o da seguinte forma:

```
$> mysqld_safe --log-error &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

O resultado é o mesmo, uma vez que `--log-error` não é seguido por nada mais na linha de comando, e ele fornece seu próprio valor padrão. (O personagem `&` diz ao sistema operacional para executar o MySQL em segundo plano; ele é ignorado pelo próprio MySQL.) Agora suponha que você deseja registrar erros em um arquivo chamado `my-errors.err`. Você pode tentar iniciar o servidor com `--log-error my-errors`, mas isso não tem o efeito pretendido, como mostrado aqui:

```
$> mysqld_safe --log-error my-errors &
[1] 31357
$> 080111 22:53:31 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080111 22:53:32 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
080111 22:53:34 mysqld_safe mysqld from pid file /usr/local/mysql/var/tonfisk.pid ended

[1]+  Done                    ./mysqld_safe --log-error my-errors
```

O servidor tentou começar a usar `/usr/local/mysql/var/tonfisk.err` como o registro de erros, mas depois desligou. Examinando as últimas linhas deste arquivo mostra o motivo:

```
$> tail /usr/local/mysql/var/tonfisk.err
2013-09-24T15:36:22.278034Z 0 [ERROR] Too many arguments (first extra is 'my-errors').
2013-09-24T15:36:22.278059Z 0 [Note] Use --verbose --help to get a list of available options!
2013-09-24T15:36:22.278076Z 0 [ERROR] Aborting
2013-09-24T15:36:22.279704Z 0 [Note] InnoDB: Starting shutdown...
2013-09-24T15:36:23.777471Z 0 [Note] InnoDB: Shutdown completed; log sequence number 2319086
2013-09-24T15:36:23.780134Z 0 [Note] mysqld: Shutdown complete
```

Como a opção `--log-error` fornece um valor padrão, você deve usar um sinal de igual para atribuir um valor diferente a ele, como mostrado aqui:

```
$> mysqld_safe --log-error=my-errors &
[1] 31437
$> 080111 22:54:15 mysqld_safe Logging to '/usr/local/mysql/var/my-errors.err'.
080111 22:54:15 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var

$>
```

Agora o servidor foi iniciado com sucesso, e está registrando erros no arquivo `/usr/local/mysql/var/my-errors.err`.

Problemas semelhantes podem surgir ao especificar valores de opção em arquivos de opção. Por exemplo, considere um arquivo `my.cnf` que contém o seguinte:

```
[mysql]

host
user
```

Quando o cliente `mysql` lê este arquivo, essas entradas são analisadas como `--host` `--user` ou `--host=--user`, com o resultado mostrado aqui:

```
$> mysql
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

No entanto, em arquivos de opção, um sinal de igual não é assumido.

```
[mysql]

user jon
```

Tentando iniciar `mysql` neste caso causa um erro diferente:

```
$> mysql
mysql: unknown option '--user jon'
```

Um erro semelhante ocorreria se você escrevesse `host tonfisk` no arquivo de opções em vez de `host=tonfisk`.

```
[mysql]

user=jon
```

Agora a tentativa de login é bem sucedida:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 8.4.6 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
1 row in set (0.00 sec)
```

Este não é o mesmo comportamento que com a linha de comando, onde o sinal de igual não é necessário:

```
$> mysql --user jon --host tonfisk
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 6
Server version: 8.4.6 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@tonfisk   |
+---------------+
1 row in set (0.00 sec)
```

Especificar uma opção que requer um valor sem um valor em um arquivo de opções faz com que o servidor para abortar com um erro.
