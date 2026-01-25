### 8.6.3 Otimizando Declarações REPAIR TABLE

O comando `REPAIR TABLE` para tabelas `MyISAM` é semelhante ao uso do **myisamchk** para operações de reparo, e algumas das mesmas otimizações de performance se aplicam:

* O **myisamchk** possui variáveis que controlam a alocação de memória. Você pode melhorar sua performance configurando essas variáveis, conforme descrito na Seção 4.6.3.6, “myisamchk Memory Usage”.

* Para `REPAIR TABLE`, o mesmo princípio se aplica, mas como o reparo é feito pelo server, você configura variáveis de sistema do server em vez de variáveis do **myisamchk**. Além disso, além de configurar variáveis de alocação de memória, aumentar a variável de sistema `myisam_max_sort_file_size` aumenta a probabilidade de que o reparo use o método `filesort`, que é mais rápido, e evite o método mais lento de reparo por `key cache`. Defina a variável para o tamanho máximo de arquivo para o seu sistema, após verificar se há espaço livre suficiente para armazenar uma cópia dos arquivos da table. O espaço livre deve estar disponível no file system que contém os arquivos de table originais.

Suponha que uma operação de reparo de table **myisamchk** seja executada usando as seguintes opções para configurar suas variáveis de alocação de memória:

```sql
--key_buffer_size=128M --myisam_sort_buffer_size=256M
--read_buffer_size=64M --write_buffer_size=64M
```

Algumas dessas variáveis **myisamchk** correspondem a variáveis de sistema do server:

<table summary="myisamchk variables and corresponding server system variables."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><span><strong>Variável myisamchk</strong></span></th> <th>Variável de Sistema</th> </tr></thead><tbody><tr> <td><code>key_buffer_size</code></td> <td><code>key_buffer_size</code></td> </tr><tr> <td><code>myisam_sort_buffer_size</code></td> <td><code>myisam_sort_buffer_size</code></td> </tr><tr> <td><code>read_buffer_size</code></td> <td><code>read_buffer_size</code></td> </tr><tr> <td><code>write_buffer_size</code></td> <td>nenhuma</td> </tr></tbody></table>

Cada uma das variáveis de sistema do server pode ser configurada em runtime, e algumas delas (`myisam_sort_buffer_size`, `read_buffer_size`) possuem um valor de session além de um valor global. Configurar um valor de session limita o efeito da alteração à sua session atual e não afeta outros usuários. Alterar uma variável apenas global (`key_buffer_size`, `myisam_max_sort_file_size`) afeta outros usuários também. Para `key_buffer_size`, você deve considerar que o Buffer é compartilhado com esses usuários. Por exemplo, se você configurar a variável **myisamchk** `key_buffer_size` para 128MB, você poderia configurar a variável de sistema `key_buffer_size` correspondente maior do que isso (se ainda não estiver configurada como maior), para permitir o uso do key Buffer pela atividade em outras sessions. No entanto, alterar o tamanho global do key Buffer invalida o Buffer, causando aumento de I/O em disco e lentidão para outras sessions. Uma alternativa que evita esse problema é usar um `key cache` separado, atribuir a ele os Indexes da table a ser reparada e desativá-lo quando o reparo estiver completo. Consulte a Seção 8.10.2.2, “Multiple Key Caches”.

Com base nas observações precedentes, uma operação `REPAIR TABLE` pode ser feita da seguinte maneira para usar configurações semelhantes ao comando **myisamchk**. Aqui, um key Buffer separado de 128MB é alocado, e presume-se que o file system permita um tamanho de arquivo de pelo menos 100GB.

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

Se você pretende alterar uma variável global, mas deseja fazê-lo apenas durante a duração de uma operação `REPAIR TABLE` para afetar minimamente outros usuários, salve seu valor em uma variável de usuário e restaure-o depois. Por exemplo:

```sql
SET @old_myisam_sort_buffer_size = @@GLOBAL.myisam_max_sort_file_size;
SET GLOBAL myisam_max_sort_file_size = 100*1024*1024*1024;
REPAIR TABLE tbl_name ;
SET GLOBAL myisam_max_sort_file_size = @old_myisam_max_sort_file_size;
```

As variáveis de sistema que afetam `REPAIR TABLE` podem ser configuradas globalmente na inicialização do server se você quiser que os valores estejam em vigor por padrão. Por exemplo, adicione estas linhas ao arquivo `my.cnf` do server:

```sql
[mysqld]
myisam_sort_buffer_size=256M
key_buffer_size=1G
myisam_max_sort_file_size=100G
```

Essas configurações não incluem `read_buffer_size`. Definir `read_buffer_size` globalmente para um valor grande o faz para todas as sessions e pode fazer com que a performance seja prejudicada devido à alocação excessiva de memória para um server com muitas sessions simultâneas.