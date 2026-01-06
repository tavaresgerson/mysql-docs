#### 14.8.3.1 Configurando o tamanho do pool de buffers do InnoDB

Você pode configurar o tamanho do pool de buffers do InnoDB offline ou enquanto o servidor estiver em execução. O comportamento descrito nesta seção se aplica a ambos os métodos. Para obter informações adicionais sobre a configuração do tamanho do pool de buffers online, consulte Configurando o Tamanho do Pool de Buffers do InnoDB Online.

Ao aumentar ou diminuir o `innodb_buffer_pool_size`, a operação é realizada em partes. O tamanho da parte é definido pela opção de configuração `innodb_buffer_pool_chunk_size`, que tem um valor padrão de `128M`. Para mais informações, consulte Configurando o Tamanho da Parte do Pool de Buffer do InnoDB.

O tamanho do pool de tampão deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você configurar `innodb_buffer_pool_size` para um valor que não é igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do pool de tampão será ajustado automaticamente para um valor que é igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

No exemplo a seguir, `innodb_buffer_pool_size` está definido como `8G` e `innodb_buffer_pool_instances` está definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão.

`8G` é um valor válido para `innodb_buffer_pool_size`, pois `8G` é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, que é `2G`.

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

Neste exemplo, `innodb_buffer_pool_size` está definido como `9G`, e `innodb_buffer_pool_instances` está definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão. Neste caso, `9G` não é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, então `innodb_buffer_pool_size` é ajustado para `10G`, que é um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

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

##### Configurando o tamanho do bloco do pool de buffer do InnoDB

`innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1 MB (1048576 bytes), mas só pode ser modificado durante a inicialização, em uma string de linha de comando ou em um arquivo de configuração do MySQL.

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

- Se o novo valor de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances` for maior que o tamanho atual do buffer pool quando o buffer pool for inicializado, `innodb_buffer_pool_chunk_size` será truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

  Por exemplo, se o pool de buffers for inicializado com um tamanho de `2GB` (2147483648 bytes), `4` instâncias do pool de buffers e um tamanho de bloco de `1GB` (1073741824 bytes), o tamanho do bloco é truncado para um valor igual a `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`, conforme mostrado abaixo:

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

- O tamanho do pool de tampão deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` será automaticamente ajustado para um valor que é igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o pool de tampão é inicializado. Esse comportamento é demonstrado no exemplo a seguir:

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

  Este exemplo demonstra o mesmo comportamento, mas com múltiplas instâncias do pool de buffers:

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

  É preciso ter cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar o tamanho do pool de buffers, como mostrado nos exemplos acima. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule o efeito no `innodb_buffer_pool_size` para garantir que o tamanho do pool de buffers resultante seja aceitável.

Nota

Para evitar possíveis problemas de desempenho, o número de fragmentos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

##### Configurando o tamanho do pool de buffers do InnoDB online

A opção de configuração `innodb_buffer_pool_size` pode ser definida dinamicamente usando uma instrução `SET`, permitindo que você redimensione o pool de buffers sem precisar reiniciar o servidor. Por exemplo:

```sql
mysql> SET GLOBAL innodb_buffer_pool_size=402653184;
```

Nota

O tamanho do pool de tampão deve ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Para alterar esses ajustes de variáveis, é necessário reiniciar o servidor.

As transações e operações ativas realizadas por meio das APIs do `InnoDB` devem ser concluídas antes de redimensionar o pool de buffers. Ao iniciar uma operação de redimensionamento, a operação só começa quando todas as transações ativas são concluídas. Uma vez que a operação de redimensionamento estiver em andamento, novas transações e operações que exigem acesso ao pool de buffers devem esperar até que a operação de redimensionamento termine. A exceção à regra é que o acesso concorrente ao pool de buffers é permitido enquanto o pool de buffers estiver sendo desfragmentado e páginas forem retiradas quando o tamanho do pool de buffers for reduzido. Uma desvantagem de permitir o acesso concorrente é que isso pode resultar em uma escassez temporária de páginas disponíveis enquanto as páginas estão sendo retiradas.

Nota

As transações aninhadas podem falhar se iniciadas após o início da operação de redimensionamento do pool de buffers.

##### Monitoramento do progresso de redimensionamento do Pool de tampão online

O `Innodb_buffer_pool_resize_status` relata o progresso da redimensionamento do pool de buffers. Por exemplo:

```sql
mysql> SHOW STATUS WHERE Variable_name='InnoDB_buffer_pool_resize_status';
+----------------------------------+----------------------------------+
| Variable_name                    | Value                            |
+----------------------------------+----------------------------------+
| Innodb_buffer_pool_resize_status | Resizing also other hash tables. |
+----------------------------------+----------------------------------+
```

O progresso da redimensionamento do pool de buffers também é registrado no log de erros do servidor. Este exemplo mostra as notas registradas ao aumentar o tamanho do pool de buffers:

```sql
[Note] InnoDB: Resizing buffer pool from 134217728 to 4294967296. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was added.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 134217728 to 4294967296.
[Note] InnoDB: re-enabled adaptive hash index.
```

Este exemplo mostra as notas registradas quando o tamanho do pool de buffer é reduzido:

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

##### Interna do redimensionamento do Pool de Buffer Online

A operação de redimensionamento é realizada por uma thread em segundo plano. Ao aumentar o tamanho do pool de buffers, a operação de redimensionamento:

- Adiciona páginas em `chunks` (o tamanho do bloco é definido por `innodb_buffer_pool_chunk_size`)

- Converte tabelas de hash, listas e ponteiros para usar novos endereços na memória

- Adicione novas páginas à lista gratuita

Enquanto essas operações estão em andamento, outros threads são bloqueados de acessar o pool de buffers.

Ao diminuir o tamanho do pool de buffer, a operação de redimensionamento:

- Desfragmenta o pool de buffers e retira (libera) páginas

- Remove páginas em `chunks` (o tamanho do bloco é definido por `innodb_buffer_pool_chunk_size`)

- Converte tabelas de hash, listas e ponteiros para usar novos endereços na memória

Destas operações, apenas a desfragmentação do pool de buffers e a retirada de páginas permitem que outros threads acessem o pool de buffers simultaneamente.
