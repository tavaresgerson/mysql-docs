#### B.3.2.8 Pacote muito grande

Um pacote de comunicação é uma única instrução SQL enviada ao servidor MySQL, uma única linha enviada ao cliente ou um evento de log binário enviado de um servidor de origem de replicação para uma réplica.

O pacote maior possível que pode ser transmitido para ou a partir de um servidor ou cliente MySQL 5.7 é de 1 GB.

Quando um cliente MySQL ou o servidor [**mysqld**](mysqld.html) recebe um pacote maior que \[`max_allowed_packet`]\(server-system-variables.html#sysvar\_max\_allowed\_packet] bytes, ele emite um erro [`ER_NET_PACKET_TOO_LARGE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_net_packet_too_large) e fecha a conexão. Com alguns clientes, você também pode receber um erro `Lost connection to MySQL server during query` se o pacote de comunicação for muito grande.

Tanto o cliente quanto o servidor têm sua própria variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet), então, se você quiser lidar com pacotes grandes, você deve aumentar essa variável tanto no cliente quanto no servidor.

Se você estiver usando o programa cliente [**mysql**](mysql.html), sua variável padrão [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) é de 16 MB. Para definir um valor maior, inicie o [**mysql**](mysql.html) da seguinte forma:

```sql
$> mysql --max_allowed_packet=32M
```

Isso define o tamanho do pacote para 32 MB.

O valor padrão do servidor [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) é de 4 MB. Você pode aumentá-lo se o servidor precisar lidar com consultas grandes (por exemplo, se você estiver trabalhando com colunas grandes de `BLOB`). Por exemplo, para definir a variável para 16 MB, inicie o servidor da seguinte forma:

```sql
$> mysqld --max_allowed_packet=16M
```

Você também pode usar um arquivo de opção para definir [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet). Por exemplo, para definir o tamanho do servidor para 16 MB, adicione as seguintes linhas em um arquivo de opção:

```sql
[mysqld]
max_allowed_packet=16M
```

É seguro aumentar o valor desta variável, pois a memória extra é alocada apenas quando necessário. Por exemplo, o [**mysqld**](mysqld.html) aloca mais memória apenas quando você emite uma consulta longa ou quando o [**mysqld**](mysqld.html) deve retornar uma grande linha de resultado. O pequeno valor padrão da variável é uma precaução para capturar pacotes incorretos entre o cliente e o servidor e também para garantir que você não fique sem memória ao usar pacotes grandes acidentalmente.

Você também pode ter problemas estranhos com pacotes grandes se estiver usando valores grandes de [`BLOB`](blob.html) e não tiver dado ao [**mysqld**](mysqld.html) acesso a memória suficiente para lidar com a consulta. Se você suspeitar que isso seja o caso, tente adicionar **ulimit -d 256000** no início do script [**mysqld\_safe**](mysqld-safe.html) e reiniciar o [**mysqld**](mysqld.html).
