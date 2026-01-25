#### 14.8.3.4 Configurando o Prefetching do Buffer Pool do InnoDB (Read-Ahead)

Uma solicitação de *read-ahead* (leitura antecipada) é uma solicitação de I/O para buscar múltiplas páginas no Buffer Pool assincronamente (*prefetch*), antecipando que essas páginas serão necessárias em breve. As solicitações trazem todas as páginas em uma única extensão (*extent*). O `InnoDB` utiliza dois algoritmos de *read-ahead* para melhorar o desempenho de I/O:

O **Linear** *read-ahead* é uma técnica que prevê quais páginas podem ser necessárias em breve com base nas páginas no Buffer Pool que estão sendo acessadas sequencialmente. Você controla quando o `InnoDB` executa uma operação de *read-ahead* ajustando o número de acessos sequenciais de página necessários para acionar uma solicitação de leitura assíncrona, usando o parâmetro de configuração `innodb_read_ahead_threshold`. Antes de este parâmetro ser adicionado, o `InnoDB` só calculava se deveria emitir uma solicitação assíncrona de *prefetch* para toda a próxima extensão quando lia a última página da extensão atual.

O parâmetro de configuração `innodb_read_ahead_threshold` controla o quão sensível o `InnoDB` é na detecção de padrões de acesso sequencial de página. Se o número de páginas lidas sequencialmente de uma extensão for maior ou igual a `innodb_read_ahead_threshold`, o `InnoDB` inicia uma operação assíncrona de *read-ahead* de toda a extensão seguinte. O `innodb_read_ahead_threshold` pode ser definido para qualquer valor de 0 a 64. O valor padrão é 56. Quanto maior o valor, mais rigorosa é a verificação do padrão de acesso. Por exemplo, se você definir o valor como 48, o `InnoDB` aciona uma solicitação de *linear read-ahead* somente quando 48 páginas na extensão atual tiverem sido acessadas sequencialmente. Se o valor for 8, o `InnoDB` aciona um *read-ahead* assíncrono mesmo que apenas 8 páginas na extensão sejam acessadas sequencialmente. Você pode definir o valor deste parâmetro no arquivo de configuração do MySQL, ou alterá-lo dinamicamente com a instrução `SET GLOBAL`, o que exige privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

O **Random** *read-ahead* é uma técnica que prevê quando as páginas podem ser necessárias em breve com base nas páginas que já estão no Buffer Pool, independentemente da ordem em que essas páginas foram lidas. Se 13 páginas consecutivas da mesma extensão forem encontradas no Buffer Pool, o `InnoDB` emite assincronamente uma solicitação para buscar (*prefetch*) as páginas restantes da extensão. Para habilitar esse recurso, defina a variável de configuração `innodb_random_read_ahead` como `ON`.

O comando `SHOW ENGINE INNODB STATUS` exibe estatísticas para ajudar você a avaliar a eficácia do algoritmo de *read-ahead*. As estatísticas incluem informações de contador para as seguintes variáveis de status globais:

* `Innodb_buffer_pool_read_ahead`
* `Innodb_buffer_pool_read_ahead_evicted`
* `Innodb_buffer_pool_read_ahead_rnd`

Essa informação pode ser útil ao ajustar a configuração de `innodb_random_read_ahead`.

Para mais informações sobre o desempenho de I/O, consulte a Seção 8.5.8, “Optimizing InnoDB Disk I/O” e a Seção 8.12.2, “Optimizing Disk I/O”.