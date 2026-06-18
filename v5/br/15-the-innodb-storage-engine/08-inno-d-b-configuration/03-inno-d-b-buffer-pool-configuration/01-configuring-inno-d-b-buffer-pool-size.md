#### 14.8.3.1 Configurando o Tamanho do Buffer Pool do InnoDB

Você pode configurar o tamanho do `InnoDB` Buffer Pool offline ou enquanto o servidor está em execução. O comportamento descrito nesta seção se aplica a ambos os métodos. Para informações adicionais sobre a configuração do tamanho do Buffer Pool online, consulte Configurando o Tamanho do Buffer Pool do InnoDB Online.

Ao aumentar ou diminuir o `innodb_buffer_pool_size`, a operação é realizada em *chunks*. O tamanho do Chunk é definido pela opção de configuração `innodb_buffer_pool_chunk_size`, que tem um valor padrão de `128M`. Para mais informações, consulte Configurando o Tamanho do Chunk do Buffer Pool do InnoDB.

O tamanho do Buffer Pool deve ser sempre igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você configurar o `innodb_buffer_pool_size` para um valor que não é igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do Buffer Pool é ajustado automaticamente para um valor que é igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

No exemplo a seguir, `innodb_buffer_pool_size` é definido como `8G`, e `innodb_buffer_pool_instances` é definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão.

`8G` é um valor válido para `innodb_buffer_pool_size` porque `8G` é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, que é `2G`.

```sql
$> mysqld --innodb-buffer-pool-size=8G --innodb-buffer-pool-instances=16
```

```sql
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                           8.000000000000 |
+------------------------------------------+
```

Neste exemplo, `innodb_buffer_pool_size` é definido como `9G`, e `innodb_buffer_pool_instances` é definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão. Neste caso, `9G` não é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, então `innodb_buffer_pool_size` é ajustado para `10G`, que é um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

```sql
$> mysqld --innodb-buffer-pool-size=9G --innodb-buffer-pool-instances=16
```

```sql
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                          10.000000000000 |
+------------------------------------------+
```

##### Configurando o Tamanho do Chunk do Buffer Pool do InnoDB

O `innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1MB (1048576 bytes), mas só pode ser modificado na inicialização, em uma string de linha de comando ou em um arquivo de configuração do MySQL.

Linha de comando:

```sql
$> mysqld --innodb-buffer-pool-chunk-size=134217728
```

Arquivo de configuração:

```sql
[mysqld]
innodb_buffer_pool_chunk_size=134217728
```

As seguintes condições se aplicam ao alterar `innodb_buffer_pool_chunk_size`:

* Se o novo valor de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances` for maior do que o tamanho atual do Buffer Pool quando o Buffer Pool é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

  Por exemplo, se o Buffer Pool for inicializado com um tamanho de `2GB` (2147483648 bytes), `4` Buffer Pool Instances e um tamanho de Chunk de `1GB` (1073741824 bytes), o tamanho do Chunk é truncado para um valor igual a `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`, conforme mostrado abaixo:

  ```sql
  $> mysqld --innodb-buffer-pool-size=2147483648 --innodb-buffer-pool-instances=4
  --innodb-buffer-pool-chunk-size=1073741824;
  ```

  ```sql
  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                2147483648 |
  +---------------------------+

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              4 |
  +--------------------------------+

  # Chunk size was set to 1GB (1073741824 bytes) on startup but was
  # truncated to innodb_buffer_pool_size / innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       536870912 |
  +---------------------------------+
  ```

* O tamanho do Buffer Pool deve ser sempre igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` é ajustado automaticamente para um valor que seja igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o Buffer Pool é inicializado. Este comportamento é demonstrado no exemplo a seguir:

  ```sql
  # The buffer pool has a default size of 128MB (134217728 bytes)

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                 134217728 |
  +---------------------------+

  # The chunk size is also 128MB (134217728 bytes)

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       134217728 |
  +---------------------------------+

  # There is a single buffer pool instance

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              1 |
  +--------------------------------+

  # Chunk size is decreased by 1MB (1048576 bytes) at startup
  # (134217728 - 1048576 = 133169152):

  $> mysqld --innodb-buffer-pool-chunk-size=133169152

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       133169152 |
  +---------------------------------+

  # Buffer pool size increases from 134217728 to 266338304
  # Buffer pool size is automatically adjusted to a value that is equal to
  # or a multiple of innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                 266338304 |
  +---------------------------+
  ```

  Este exemplo demonstra o mesmo comportamento, mas com múltiplos Buffer Pool Instances:

  ```sql
  # The buffer pool has a default size of 2GB (2147483648 bytes)

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                2147483648 |
  +---------------------------+

  # The chunk size is .5 GB (536870912 bytes)

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       536870912 |
  +---------------------------------+

  # There are 4 buffer pool instances

  mysql> SELECT @@innodb_buffer_pool_instances;
  +--------------------------------+
  | @@innodb_buffer_pool_instances |
  +--------------------------------+
  |                              4 |
  +--------------------------------+

  # Chunk size is decreased by 1MB (1048576 bytes) at startup
  # (536870912 - 1048576 = 535822336):

  $> mysqld --innodb-buffer-pool-chunk-size=535822336

  mysql> SELECT @@innodb_buffer_pool_chunk_size;
  +---------------------------------+
  | @@innodb_buffer_pool_chunk_size |
  +---------------------------------+
  |                       535822336 |
  +---------------------------------+

  # Buffer pool size increases from 2147483648 to 4286578688
  # Buffer pool size is automatically adjusted to a value that is equal to
  # or a multiple of innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances

  mysql> SELECT @@innodb_buffer_pool_size;
  +---------------------------+
  | @@innodb_buffer_pool_size |
  +---------------------------+
  |                4286578688 |
  +---------------------------+
  ```

É preciso ter cautela ao alterar `innodb_buffer_pool_chunk_size`, pois mudar este valor pode aumentar o tamanho do Buffer Pool, conforme demonstrado nos exemplos acima. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule o efeito sobre `innodb_buffer_pool_size` para garantir que o tamanho resultante do Buffer Pool seja aceitável.

Nota

Para evitar possíveis problemas de performance, o número de *chunks* (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

##### Configurando o Tamanho do Buffer Pool do InnoDB Online

A opção de configuração `innodb_buffer_pool_size` pode ser definida dinamicamente usando uma instrução `SET`, permitindo redimensionar o Buffer Pool sem reiniciar o servidor. Por exemplo:

```sql
mysql> SET GLOBAL innodb_buffer_pool_size=402653184;
```

Nota

O tamanho do Buffer Pool deve ser igual ou um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Alterar essas configurações de variável exige a reinicialização do servidor.

Transações ativas e operações executadas através de APIs do `InnoDB` devem ser concluídas antes de redimensionar o Buffer Pool. Ao iniciar uma operação de redimensionamento, a operação não começa até que todas as transações ativas sejam concluídas. Uma vez que a operação de redimensionamento esteja em andamento, novas transações e operações que exijam acesso ao Buffer Pool devem esperar até que a operação de redimensionamento termine. A exceção à regra é que o acesso concorrente ao Buffer Pool é permitido enquanto o Buffer Pool é desfragmentado e as pages são retiradas quando o tamanho do Buffer Pool é diminuído. Uma desvantagem de permitir o acesso concorrente é que isso pode resultar em uma escassez temporária de pages disponíveis enquanto as pages estão sendo retiradas.

Nota

Transações aninhadas (nested transactions) podem falhar se iniciadas após o início da operação de redimensionamento do Buffer Pool.

##### Monitorando o Progresso do Redimensionamento Online do Buffer Pool

O `Innodb_buffer_pool_resize_status` informa o progresso do redimensionamento do Buffer Pool. Por exemplo:

```sql
mysql> SHOW STATUS WHERE Variable_name='InnoDB_buffer_pool_resize_status';
+----------------------------------+----------------------------------+
| Variable_name                    | Value                            |
+----------------------------------+----------------------------------+
| Innodb_buffer_pool_resize_status | Resizing also other hash tables. |
+----------------------------------+----------------------------------+
```

O progresso do redimensionamento do Buffer Pool também é registrado no log de erros do servidor. Este exemplo mostra notas que são registradas ao aumentar o tamanho do Buffer Pool:

```sql
[Note] InnoDB: Resizing buffer pool from 134217728 to 4294967296. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was added.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 134217728 to 4294967296.
[Note] InnoDB: re-enabled adaptive hash index.
```

Este exemplo mostra notas que são registradas ao diminuir o tamanho do Buffer Pool:

```sql
[Note] InnoDB: Resizing buffer pool from 4294967296 to 134217728. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : start to withdraw the last 253952 blocks.
[Note] InnoDB: buffer pool 0 : withdrew 253952 blocks from free list. tried to relocate 0 pages.
(253952/253952)
[Note] InnoDB: buffer pool 0 : withdrawn target 253952 blocks.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was freed.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 4294967296 to 134217728.
[Note] InnoDB: re-enabled adaptive hash index.
```

##### Detalhes Internos do Redimensionamento Online do Buffer Pool

A operação de redimensionamento é realizada por um Background Thread. Ao aumentar o tamanho do Buffer Pool, a operação de redimensionamento:

* Adiciona pages em *chunks* (o tamanho do Chunk é definido por `innodb_buffer_pool_chunk_size`)

* Converte Hash Tables, listas e ponteiros para usar novos endereços na memória

* Adiciona novas pages à Free List

Enquanto essas operações estão em andamento, outros Threads são bloqueados de acessar o Buffer Pool.

Ao diminuir o tamanho do Buffer Pool, a operação de redimensionamento:

* Desfragmenta o Buffer Pool e retira (libera) pages
* Remove pages em *chunks* (o tamanho do Chunk é definido por `innodb_buffer_pool_chunk_size`)

* Converte Hash Tables, listas e ponteiros para usar novos endereços na memória

Dessas operações, apenas a desfragmentação do Buffer Pool e a retirada de pages permitem que outros Threads acessem o Buffer Pool concorrentemente.