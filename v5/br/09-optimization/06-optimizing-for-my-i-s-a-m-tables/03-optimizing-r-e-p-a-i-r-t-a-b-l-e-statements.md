### 8.6.3 Otimizando as declarações da Tabela de Reparo

A opção `REPAIR TABLE` para tabelas `MyISAM` é semelhante ao uso do **myisamchk** para operações de reparo, e algumas das mesmas otimizações de desempenho se aplicam:

- O **myisamchk** possui variáveis que controlam a alocação de memória. Você pode melhorar o desempenho configurando essas variáveis, conforme descrito na Seção 4.6.3.6, “Uso de Memória do myisamchk”.

- Para `REPAIR TABLE`, o mesmo princípio se aplica, mas, como a reparação é feita pelo servidor, você define variáveis do sistema do servidor em vez das variáveis **myisamchk**. Além disso, além de definir variáveis de alocação de memória, aumentar a variável do sistema `myisam_max_sort_file_size` aumenta a probabilidade de que a reparação use o método de filesort mais rápido e evite a reparação mais lenta pelo método de cache de chave. Defina a variável para o tamanho máximo de arquivo do seu sistema, após verificar se há espaço livre suficiente para conter uma cópia dos arquivos da tabela. O espaço livre deve estar disponível no sistema de arquivos que contém os arquivos originais da tabela.

Suponha que uma operação de reparo da tabela **myisamchk** seja realizada usando as seguintes opções para definir suas variáveis de alocação de memória:

```sql
--key_buffer_size=128M --myisam_sort_buffer_size=256M
--read_buffer_size=64M --write_buffer_size=64M
```

Algumas dessas variáveis **myisamchk** correspondem a variáveis do sistema do servidor:

<table summary="variáveis myisamchk e as variáveis do sistema do servidor correspondentes."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><span><strong>myisamchk</strong></span>Variável</th> <th>Variável do sistema</th> </tr></thead><tbody><tr> <td>[[<code>key_buffer_size</code>]]</td> <td>[[<code>key_buffer_size</code>]]</td> </tr><tr> <td>[[<code>myisam_sort_buffer_size</code>]]</td> <td>[[<code>myisam_sort_buffer_size</code>]]</td> </tr><tr> <td>[[<code>read_buffer_size</code>]]</td> <td>[[<code>read_buffer_size</code>]]</td> </tr><tr> <td>[[<code>write_buffer_size</code>]]</td> <td>nenhum</td> </tr></tbody></table>

Cada uma das variáveis do sistema do servidor pode ser definida em tempo de execução, e algumas delas (`myisam_sort_buffer_size`, `read_buffer_size`) têm um valor de sessão além de um valor global. Definir um valor de sessão limita o efeito da mudança à sua sessão atual e não afeta outros usuários. Alterar uma variável apenas global (`key_buffer_size`, `myisam_max_sort_file_size`) afeta também outros usuários. Para `key_buffer_size`, você deve levar em consideração que o buffer é compartilhado com esses usuários. Por exemplo, se você definir a variável `key_buffer_size` do **myisamchk** para 128 MB, você poderia definir a variável de sistema `key_buffer_size` correspondente maior que isso (se ela não já estiver maior), para permitir o uso do buffer de chaves por atividades em outras sessões. No entanto, alterar o tamanho global do buffer de chaves invalida o buffer, causando aumento do I/O no disco e lentidão para outras sessões. Uma alternativa que evita esse problema é usar um cache de chaves separado, atribuir a ele os índices da tabela a ser reparada e realocar quando a reparação estiver completa. Veja a Seção 8.10.2.2, “Múltiplos Caches de Chaves”.

Com base nas observações anteriores, uma operação `REPAIR TABLE` pode ser realizada da seguinte forma para usar configurações semelhantes ao comando **myisamchk**. Aqui, um buffer de chave separado de 128 MB é alocado e o sistema de arquivos é assumido para permitir um tamanho de arquivo de pelo menos 100 GB.

```sql
SET SESSION myisam_sort_buffer_size = 256*1024*1024;
SET SESSION read_buffer_size = 64*1024*1024;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
SET GLOBAL repair_cache.key_buffer_size = 128*1024*1024;
CACHE INDEX tbl_name IN repair_cache;
LOAD INDEX INTO CACHE tbl_name;
REPAIR TABLE tbl_name ;
SET GLOBAL repair_cache.key_buffer_size = 0;
```

Se você pretende alterar uma variável global, mas deseja fazer isso apenas durante a execução de uma operação `REPAIR TABLE`, para afetar o mínimo possível outros usuários, salve seu valor em uma variável de usuário e restaure-o posteriormente. Por exemplo:

```sql
SET @old_myisam_sort_buffer_size = @@GLOBAL.myisam_max_sort_file_size;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
REPAIR TABLE tbl_name ;
SET GLOBAL myisam_max_sort_file_size = @old_myisam_max_sort_file_size;
```

As variáveis de sistema que afetam o `REPAIR TABLE` podem ser definidas globalmente no início do servidor se você quiser que os valores sejam aplicados por padrão. Por exemplo, adicione essas linhas ao arquivo `my.cnf` do servidor:

```sql
[mysqld]
myisam_sort_buffer_size=256M
key_buffer_size=1G
myisam_max_sort_file_size=100G
```

Esses ajustes não incluem `read_buffer_size`. Definir `read_buffer_size` globalmente para um valor grande para todas as sessões pode causar problemas de desempenho devido à alocação excessiva de memória para um servidor com muitas sessões simultâneas.
