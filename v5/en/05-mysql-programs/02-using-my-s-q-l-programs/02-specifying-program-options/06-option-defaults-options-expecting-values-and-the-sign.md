#### 4.2.2.6 Valores Padrão de Opções, Opções que Esperam Valores e o Sinal =

Por convenção, as formas longas das opções que atribuem um valor são escritas com um sinal de igualdade (`=`), assim:

```sql
mysql --host=tonfisk --user=jon
```

Para opções que exigem um valor (ou seja, que não possuem um valor padrão), o sinal de igual não é obrigatório, e, portanto, o seguinte também é válido:

```sql
mysql --host tonfisk --user jon
```

Em ambos os casos, o cliente **mysql** tenta se conectar a um MySQL server em execução no host denominado “tonfisk”, usando uma conta com o nome de user “jon”.

Devido a esse comportamento, problemas podem surgir ocasionalmente quando nenhum valor é fornecido para uma opção que espera um. Considere o exemplo a seguir, onde um user se conecta a um MySQL server em execução no host `tonfisk` como user `jon`:

```sql
$> mysql --host 85.224.35.45 --user jon
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| jon@%          |
+----------------+
1 row in set (0.00 sec)
```

Omitir o valor obrigatório para uma dessas opções gera um error, como o mostrado aqui:

```sql
$> mysql --host 85.224.35.45 --user
mysql: option '--user' requires an argument
```

Neste caso, o **mysql** não conseguiu encontrar um valor após a opção `--user` porque nada a seguia na command line. No entanto, se você omitir o valor para uma opção que *não* é a última opção a ser usada, você obterá um error diferente que talvez não esteja esperando:

```sql
$> mysql --host --user jon
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

Como o **mysql** assume que qualquer string que siga `--host` na command line é um nome de host, `--host --user` é interpretado como `--host=--user`, e o client tenta se conectar a um MySQL server em execução em um host chamado “--user”.

Opções que possuem valores padrão sempre exigem um sinal de igual ao atribuir um valor; não fazer isso causa um error. Por exemplo, a opção `--log-error` do MySQL server tem o valor padrão `host_name.err`, onde *`host_name`* é o nome do host no qual o MySQL está em execução. Suponha que você esteja executando o MySQL em um computador cujo nome de host é “tonfisk”, e considere a seguinte invocação de **mysqld_safe**:

```sql
$> mysqld_safe &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

Após desligar o server, reinicie-o da seguinte forma:

```sql
$> mysqld_safe --log-error &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

O resultado é o mesmo, visto que `--log-error` não é seguido por mais nada na command line e fornece seu próprio valor padrão. (O caractere `&` informa ao sistema operacional para executar o MySQL em background; ele é ignorado pelo próprio MySQL.) Agora suponha que você deseja registrar errors em um file chamado `my-errors.err`. Você pode tentar iniciar o server com `--log-error my-errors`, mas isso não tem o efeito pretendido, como mostrado aqui:

```sql
$> mysqld_safe --log-error my-errors &
[1] 31357
$> 080111 22:53:31 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080111 22:53:32 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
080111 22:53:34 mysqld_safe mysqld from pid file /usr/local/mysql/var/tonfisk.pid ended

[1]+  Done                    ./mysqld_safe --log-error my-errors
```

O server tentou iniciar usando `/usr/local/mysql/var/tonfisk.err` como o log de error, mas depois foi desligado. Examinar as últimas linhas deste file mostra o motivo:

```sql
$> tail /usr/local/mysql/var/tonfisk.err
2013-09-24T15:36:22.278034Z 0 [ERROR] Too many arguments (first extra is 'my-errors').
2013-09-24T15:36:22.278059Z 0 [Note] Use --verbose --help to get a list of available options!
2013-09-24T15:36:22.278076Z 0 [ERROR] Aborting
2013-09-24T15:36:22.279704Z 0 [Note] InnoDB: Starting shutdown...
2013-09-24T15:36:23.777471Z 0 [Note] InnoDB: Shutdown completed; log sequence number 2319086
2013-09-24T15:36:23.780134Z 0 [Note] mysqld: Shutdown complete
```

Como a opção `--log-error` fornece um valor padrão, você deve usar um sinal de igual para atribuir um valor diferente a ela, conforme mostrado aqui:

```sql
$> mysqld_safe --log-error=my-errors &
[1] 31437
$> 080111 22:54:15 mysqld_safe Logging to '/usr/local/mysql/var/my-errors.err'.
080111 22:54:15 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var

$>
```

Agora o server foi iniciado com sucesso e está registrando errors no file `/usr/local/mysql/var/my-errors.err`.

Problemas semelhantes podem surgir ao especificar valores de opções em option files. Por exemplo, considere um file `my.cnf` que contém o seguinte:

```sql
[mysql]

host
user
```

Quando o client **mysql** lê este file, essas entradas são analisadas como `--host --user` ou `--host=--user`, com o resultado mostrado aqui:

```sql
$> mysql
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

No entanto, em option files, um sinal de igual não é assumido. Suponha que o file `my.cnf` seja conforme mostrado aqui:

```sql
[mysql]

user jon
```

Tentar iniciar o **mysql** neste caso causa um error diferente:

```sql
$> mysql
mysql: unknown option '--user jon'
```

Um error semelhante ocorreria se você escrevesse `host tonfisk` no option file em vez de `host=tonfisk`. Em vez disso, você deve usar o sinal de igual:

```sql
[mysql]

user=jon
```

Agora a tentativa de login é bem-sucedida:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
1 row in set (0.00 sec)
```

Este não é o mesmo comportamento que ocorre na command line, onde o sinal de igual não é obrigatório:

```sql
$> mysql --user jon --host tonfisk
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 6
Server version: 5.7.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@tonfisk   |
+---------------+
1 row in set (0.00 sec)
```

Especificar uma opção que exige um valor sem fornecê-lo em um option file faz com que o server aborte com um error.