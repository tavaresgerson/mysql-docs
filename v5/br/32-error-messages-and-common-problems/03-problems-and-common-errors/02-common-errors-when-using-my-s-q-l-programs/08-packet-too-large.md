#### B.3.2.8 Packet Too Large

Um communication Packet é uma única instrução SQL enviada ao servidor MySQL, uma única row que é enviada ao client, ou um evento de binary log enviado de um servidor de replicação de origem para uma réplica.

O maior Packet possível que pode ser transmitido para ou de um servidor ou client MySQL 5.7 é 1GB.

Quando um client MySQL ou o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") recebe um Packet maior que [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) bytes, ele emite um erro [`ER_NET_PACKET_TOO_LARGE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_net_packet_too_large) e fecha a connection. Com alguns clients, você também pode receber o erro `Lost connection to MySQL server during query` se o communication Packet for muito grande.

Tanto o client quanto o server possuem sua própria variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet), então se você deseja lidar com Packets grandes, você deve aumentar esta variável tanto no client quanto no server.

Se você estiver usando o programa client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), sua variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) padrão é 16MB. Para definir um valor maior, inicie o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") desta forma:

```sql
$> mysql --max_allowed_packet=32M
```

Isso define o tamanho do Packet para 32MB.

O valor padrão [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) do server é 4MB. Você pode aumentar este valor se o server precisar lidar com Queries grandes (por exemplo, se você estiver trabalhando com colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") grandes). Por exemplo, para definir a variável como 16MB, inicie o server desta forma:

```sql
$> mysqld --max_allowed_packet=16M
```

Você também pode usar um arquivo de option para definir [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet). Por exemplo, para definir o tamanho para o server como 16MB, adicione as seguintes linhas em um arquivo de option:

```sql
[mysqld]
max_allowed_packet=16M
```

É seguro aumentar o valor desta variável porque a memória extra é alocada apenas quando necessário. Por exemplo, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") aloca mais memória somente quando você emite uma Query longa ou quando o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve retornar uma result row grande. O pequeno valor padrão da variável é uma precaução para detectar Packets incorretos entre o client e o server e também para garantir que você não esgote a memória utilizando Packets grandes acidentalmente.

Você também pode encontrar problemas estranhos com Packets grandes se estiver usando valores [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") grandes, mas não tiver fornecido acesso a memória suficiente para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") lidar com a Query. Se você suspeitar que este é o caso, tente adicionar **ulimit -d 256000** no início do script [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") e reinicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").