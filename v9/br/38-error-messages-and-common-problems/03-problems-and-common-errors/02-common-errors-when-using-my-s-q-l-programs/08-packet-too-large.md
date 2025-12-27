#### B.3.2.8 Pacote Muito Grande

Um pacote de comunicação é uma única instrução SQL enviada ao servidor MySQL, uma única linha enviada ao cliente ou um evento de log binário enviado de um servidor de origem de replicação para uma réplica.

O pacote mais grande possível que pode ser transmitido para ou a partir de um servidor ou cliente MySQL 9.5 é de 1 GB.

Quando um cliente MySQL ou o servidor **mysqld** recebe um pacote maior que `max_allowed_packet` bytes, ele emite um erro `ER_NET_PACKET_TOO_LARGE` e fecha a conexão. Com alguns clientes, você também pode receber um erro `Lost connection to MySQL server during query` se o pacote de comunicação for muito grande.

Tanto o cliente quanto o servidor têm sua própria variável `max_allowed_packet`, então, se você quiser lidar com pacotes grandes, deve aumentar essa variável tanto no cliente quanto no servidor.

Se você estiver usando o programa cliente **mysql**, sua variável `max_allowed_packet` padrão é de 16 MB. Para definir um valor maior, inicie o **mysql** da seguinte forma:

```
$> mysql --max_allowed_packet=32M
```

Isso define o tamanho do pacote para 32 MB.

O valor padrão de `max_allowed_packet` do servidor é de 64 MB. Você pode aumentá-lo se o servidor precisar lidar com consultas grandes (por exemplo, se você estiver trabalhando com colunas `BLOB` grandes). Por exemplo, para definir a variável para 128 MB, inicie o servidor da seguinte forma:

```
$> mysqld --max_allowed_packet=128M
```

Você também pode usar um arquivo de opção para definir `max_allowed_packet`. Por exemplo, para definir o tamanho para o servidor ser de 128 MB, adicione as seguintes linhas em um arquivo de opção:

```
[mysqld]
max_allowed_packet=128M
```

É seguro aumentar o valor desta variável, pois a memória extra é alocada apenas quando necessário. Por exemplo, o **mysqld** aloca mais memória apenas quando você emite uma consulta longa ou quando o **mysqld** deve retornar uma grande linha de resultado. O pequeno valor padrão da variável é uma precaução para capturar pacotes incorretos entre o cliente e o servidor e também para garantir que você não se esgote de memória ao usar pacotes grandes acidentalmente.

Você também pode ter problemas estranhos com pacotes grandes se estiver usando valores grandes de `BLOB` mas não tiver dado ao **mysqld** acesso a memória suficiente para lidar com a consulta. Se você suspeitar que este é o caso, tente adicionar **ulimit -d 256000** no início do script **mysqld\_safe** e reiniciar o **mysqld**.