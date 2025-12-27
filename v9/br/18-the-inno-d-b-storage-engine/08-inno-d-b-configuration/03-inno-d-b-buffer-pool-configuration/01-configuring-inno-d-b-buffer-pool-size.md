#### 17.8.3.1 Configurando o Tamanho do Pool de Armazenamento de Buffer do InnoDB

Você pode configurar o tamanho do pool de armazenamento de buffer do `InnoDB` offline ou enquanto o servidor estiver em execução. O comportamento descrito nesta seção se aplica a ambos os métodos. Para obter informações adicionais sobre a configuração do tamanho do pool de armazenamento de buffer online, consulte Configurando o Tamanho do Pool de Armazenamento de Buffer do InnoDB Online.

Ao aumentar ou diminuir o `innodb_buffer_pool_size`, a operação é realizada em partes. O tamanho da parte é definido pela opção de configuração `innodb_buffer_pool_chunk_size`, que tem um valor padrão de `128M`. Para mais informações, consulte Configurando o Tamanho da Parte do Pool de Armazenamento de Buffer do InnoDB.

O tamanho do pool de armazenamento de buffer deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você configurar o `innodb_buffer_pool_size` para um valor que não é igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`, o tamanho do pool de armazenamento de buffer é ajustado automaticamente para um valor que é igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

No exemplo a seguir, `innodb_buffer_pool_size` é definido para `8G`, e `innodb_buffer_pool_instances` é definido para `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão.

`8G` é um valor válido de `innodb_buffer_pool_size` porque `8G` é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, que é `2G`.

```
$> mysqld --innodb-buffer-pool-size=8G --innodb-buffer-pool-instances=16
```

```
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                           8.000000000000 |
+------------------------------------------+
```

Neste exemplo, `innodb_buffer_pool_size` está definido como `9G`, e `innodb_buffer_pool_instances` está definido como `16`. `innodb_buffer_pool_chunk_size` é `128M`, que é o valor padrão. Neste caso, `9G` não é um múltiplo de `innodb_buffer_pool_instances=16` \* `innodb_buffer_pool_chunk_size=128M`, então `innodb_buffer_pool_size` é ajustado para `10G`, que é um múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`.

```
$> mysqld --innodb-buffer-pool-size=9G --innodb-buffer-pool-instances=16
```

```
mysql> SELECT @@innodb_buffer_pool_size/1024/1024/1024;
+------------------------------------------+
| @@innodb_buffer_pool_size/1024/1024/1024 |
+------------------------------------------+
|                          10.000000000000 |
+------------------------------------------+
```

##### Configurando o Tamanho do Bloco do Banco de Armazenamento InnoDB

`innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1MB (1048576 bytes), mas só pode ser modificado no momento do inicialização, em uma string de linha de comando ou em um arquivo de configuração do MySQL.

Linha de comando:

```
$> mysqld --innodb-buffer-pool-chunk-size=134217728
```

Arquivo de configuração:

```
[mysqld]
innodb_buffer_pool_chunk_size=134217728
```

As seguintes condições se aplicam ao alterar `innodb_buffer_pool_chunk_size`:

* Se o novo valor de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances` for maior que o tamanho atual do pool de buffer quando o pool de buffer é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

Por exemplo, se o pool de buffer for inicializado com um tamanho de `2GB` (2147483648 bytes), `4` instâncias de pool de buffer e um tamanho de bloco de `1GB` (1073741824 bytes), o tamanho do bloco é truncado para um valor igual a `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`, como mostrado abaixo:

```
  $> mysqld --innodb-buffer-pool-size=2147483648 --innodb-buffer-pool-instances=4
  --innodb-buffer-pool-chunk-size=1073741824;
  ```

```
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

* O tamanho do pool de tampão deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` será automaticamente ajustado para um valor que é igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. O ajuste ocorre quando o pool de tampão é inicializado. Esse comportamento é demonstrado no exemplo a seguir:

  ```
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

  Este exemplo demonstra o mesmo comportamento, mas com múltiplas instâncias do pool de tampão:

  ```
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

  Cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar o tamanho do pool de tampão, como mostrado nos exemplos acima. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule o efeito em `innodb_buffer_pool_size` para garantir que o tamanho resultante do pool de tampão seja aceitável.

Nota

Para evitar potenciais problemas de desempenho, o número de blocos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

##### Configurando o Tamanho do Pool de Tampão InnoDB Online

A opção de configuração `innodb_buffer_pool_size` pode ser definida dinamicamente usando uma instrução `SET`, permitindo que você redimensione o pool de tampão sem reiniciar o servidor. Por exemplo:

```
mysql> SET GLOBAL innodb_buffer_pool_size=402653184;
```

Nota

O tamanho do pool de tampão deve ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` \* `innodb_buffer_pool_instances`. Alterar esses ajustes de variáveis requer reiniciar o servidor.

As transações e operações ativas realizadas por meio das APIs do `InnoDB` devem ser concluídas antes de redimensionar o pool de buffers. Ao iniciar uma operação de redimensionamento, a operação não começa até que todas as transações ativas sejam concluídas. Uma vez que a operação de redimensionamento estiver em andamento, novas transações e operações que exigem acesso ao pool de buffers devem esperar até que a operação de redimensionamento termine. A exceção à regra é que o acesso concorrente ao pool de buffers é permitido enquanto o pool de buffers está sendo desfragmentado e as páginas são retiradas quando o tamanho do pool de buffers é reduzido. Uma desvantagem de permitir o acesso concorrente é que isso pode resultar em uma escassez temporária de páginas disponíveis enquanto as páginas estão sendo retiradas.

Nota

Transações aninhadas podem falhar se iniciadas após o início da operação de redimensionamento do pool de buffers.

##### Monitoramento do Progresso da Redimensionamento Online do Pool de Buffers

A variável `Innodb_buffer_pool_resize_status` reporta um valor de string indicando o progresso da redimensionamento do pool de buffers; por exemplo:

```
mysql> SHOW STATUS WHERE Variable_name='InnoDB_buffer_pool_resize_status';
+----------------------------------+----------------------------------+
| Variable_name                    | Value                            |
+----------------------------------+----------------------------------+
| Innodb_buffer_pool_resize_status | Resizing also other hash tables. |
+----------------------------------+----------------------------------+
```

Você também pode monitorar uma operação de redimensionamento online do pool de buffers usando as variáveis de status `Innodb_buffer_pool_resize_status_code` e `Innodb_buffer_pool_resize_status_progress`, que reportam valores numéricos, preferíveis para monitoramento programático.

A variável de status `Innodb_buffer_pool_resize_status_code` reporta um código de status indicando a fase de uma operação de redimensionamento online do pool de buffers. Os códigos de status incluem:

* 0: Nenhuma operação de redimensionamento em andamento
* 1: Iniciando o redimensionamento
* 2: Desabilitando AHI (Índice Hash Adaptativo)
* 3: Retirando Blocos
* 4: Adquirindo Bloqueio Global
* 5: Redimensionando o Pool
* 6: Redimensionando Hash
* 7: Redimensionamento Falhou

A variável de status `Innodb_buffer_pool_resize_status_progress` reporta um valor percentual que indica o progresso de cada etapa. O valor percentual é atualizado após cada instância do pool de buffers ser processada. À medida que o status (relatado por `Innodb_buffer_pool_resize_status_code`) muda de um status para outro, o valor percentual é redefinido para 0.

A seguinte consulta retorna um valor de string que indica o progresso da redimensionamento do pool de buffers, um código que indica a etapa atual da operação e o progresso atual dessa etapa, expresso como um valor percentual:

```
SELECT variable_name, variable_value
 FROM performance_schema.global_status
 WHERE LOWER(variable_name) LIKE "innodb_buffer_pool_resize%";
```

O progresso da redimensionamento do pool de buffers também é visível no log de erros do servidor. Este exemplo mostra notas que são registradas ao aumentar o tamanho do pool de buffers:

```
[Note] InnoDB: Resizing buffer pool from 134217728 to 4294967296. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was added.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 134217728 to 4294967296.
[Note] InnoDB: re-enabled adaptive hash index.
```

Este exemplo mostra notas que são registradas ao diminuir o tamanho do pool de buffers:

```
[Note] InnoDB: Resizing buffer pool from 4294967296 to 134217728. (unit=134217728)
[Note] InnoDB: disabled adaptive hash index.
[Note] InnoDB: buffer pool 0 : start to withdraw the last 253952 blocks.
[Note] InnoDB: buffer pool 0 : withdrew 253952 blocks from free list. tried to relocate
0 pages. (253952/253952)
[Note] InnoDB: buffer pool 0 : withdrawn target 253952 blocks.
[Note] InnoDB: buffer pool 0 : 31 chunks (253952 blocks) was freed.
[Note] InnoDB: buffer pool 0 : hash tables were resized.
[Note] InnoDB: Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] InnoDB: completed to resize buffer pool from 4294967296 to 134217728.
[Note] InnoDB: re-enabled adaptive hash index.
```

Iniciar o servidor com `--log-error-verbosity=3` registra informações adicionais no log de erros durante uma operação de redimensionamento online do pool de buffers. As informações adicionais incluem os códigos de status relatados por `Innodb_buffer_pool_resize_status_code` e o valor de progresso percentual relatado por `Innodb_buffer_pool_resize_status_progress`.

```
[Note] [MY-012398] [InnoDB] Requested to resize buffer pool. (new size: 1073741824 bytes)
[Note] [MY-013954] [InnoDB] Status code 1: Resizing buffer pool from 134217728 to 1073741824
(unit=134217728).
[Note] [MY-013953] [InnoDB] Status code 1: 100% complete
[Note] [MY-013952] [InnoDB] Status code 1: Completed
[Note] [MY-013954] [InnoDB] Status code 2: Disabling adaptive hash index.
[Note] [MY-011885] [InnoDB] disabled adaptive hash index.
[Note] [MY-013953] [InnoDB] Status code 2: 100% complete
[Note] [MY-013952] [InnoDB] Status code 2: Completed
[Note] [MY-013954] [InnoDB] Status code 3: Withdrawing blocks to be shrunken.
[Note] [MY-013953] [InnoDB] Status code 3: 100% complete
[Note] [MY-013952] [InnoDB] Status code 3: Completed
[Note] [MY-013954] [InnoDB] Status code 4: Latching whole of buffer pool.
[Note] [MY-013953] [InnoDB] Status code 4: 14% complete
[Note] [MY-013953] [InnoDB] Status code 4: 28% complete
[Note] [MY-013953] [InnoDB] Status code 4: 42% complete
[Note] [MY-013953] [InnoDB] Status code 4: 57% complete
[Note] [MY-013953] [InnoDB] Status code 4: 71% complete
[Note] [MY-013953] [InnoDB] Status code 4: 85% complete
[Note] [MY-013953] [InnoDB] Status code 4: 100% complete
[Note] [MY-013952] [InnoDB] Status code 4: Completed
[Note] [MY-013954] [InnoDB] Status code 5: Starting pool resize
[Note] [MY-013954] [InnoDB] Status code 5: buffer pool 0 : resizing with chunks 1 to 8.
[Note] [MY-011891] [InnoDB] buffer pool 0 : 7 chunks (57339 blocks) were added.
[Note] [MY-013953] [InnoDB] Status code 5: 100% complete
[Note] [MY-013952] [InnoDB] Status code 5: Completed
[Note] [MY-013954] [InnoDB] Status code 6: Resizing hash tables.
[Note] [MY-011892] [InnoDB] buffer pool 0 : hash tables were resized.
[Note] [MY-013953] [InnoDB] Status code 6: 100% complete
[Note] [MY-013954] [InnoDB] Status code 6: Resizing also other hash tables.
[Note] [MY-011893] [InnoDB] Resized hash tables at lock_sys, adaptive hash index, dictionary.
[Note] [MY-011894] [InnoDB] Completed to resize buffer pool from 134217728 to 1073741824.
[Note] [MY-011895] [InnoDB] Re-enabled adaptive hash index.
[Note] [MY-013952] [InnoDB] Status code 6: Completed
[Note] [MY-013954] [InnoDB] Status code 0: Completed resizing buffer pool at 220826  6:25:46.
[Note] [MY-013953] [InnoDB] Status code 0: 100% complete
```

##### Internos da Redimensionamento Online do Pool de Buffers

A operação de redimensionamento é realizada por um thread em segundo plano. Ao aumentar o tamanho do pool de buffers, a operação de redimensionamento:

* Adiciona páginas em `chunks` (o tamanho do bloco é definido por `innodb_buffer_pool_chunk_size`)

* Converte tabelas hash, listas e ponteiros para usar novos endereços na memória

* Adiciona novas páginas à lista de buffers livres

Enquanto essas operações estão em andamento, outros threads são bloqueados de acessar o pool de buffers.

Ao diminuir o tamanho do pool de buffers, a operação de redimensionamento:

* Desfragmenta o pool de buffer e retira (libera) páginas
* Remove páginas em "pedaços" (o tamanho do pedaço é definido por `innodb_buffer_pool_chunk_size`)

* Converte tabelas de hash, listas e ponteiros para usar novos endereços na memória

Destas operações, apenas a desfragmentação do pool de buffer e a retirada de páginas permitem que outros threads acessem o pool de buffer simultaneamente.