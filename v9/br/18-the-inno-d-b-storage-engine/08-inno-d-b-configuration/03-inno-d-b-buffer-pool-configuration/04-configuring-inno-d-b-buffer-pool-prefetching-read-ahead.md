#### 17.8.3.4 Configurando o Prefetching (Leitura Antecipada) do Pool de Buffer de InnoDB

A solicitação de leitura antecipada é uma solicitação de E/S para prever as páginas do pool de buffer de forma assíncrona, antecipando a necessidade futura dessas páginas. As solicitações trazem todas as páginas em um intervalo. O `InnoDB` utiliza dois algoritmos de leitura antecipada para melhorar o desempenho de E/S:

A leitura antecipada **linear** é uma técnica que prevê quais páginas podem ser necessárias em breve com base nas páginas do pool de buffer sendo acessadas sequencialmente. Você controla quando o `InnoDB` realiza uma operação de leitura antecipada ajustando o número de acessos sequenciais de páginas necessários para desencadear uma solicitação de leitura assíncrona, usando o parâmetro de configuração `innodb_read_ahead_threshold`. Antes que este parâmetro fosse adicionado, o `InnoDB` só calculava se emitiria uma solicitação de pré-carga assíncrona para todo o próximo intervalo quando lia a última página do intervalo atual.

O parâmetro de configuração `innodb_read_ahead_threshold` controla a sensibilidade do `InnoDB` ao detectar padrões de acesso sequencial a páginas. Se o número de páginas lidas sequencialmente de um intervalo for maior ou igual a `innodb_read_ahead_threshold`, o `InnoDB` inicia uma operação de leitura antecipada assíncrona de todo o intervalo seguinte. `innodb_read_ahead_threshold` pode ser definido para qualquer valor entre 0 e 64. O valor padrão é 56. Quanto maior o valor, mais rigoroso será o controle do padrão de acesso. Por exemplo, se você definir o valor para 48, o `InnoDB` aciona um pedido de leitura antecipada linear apenas quando 48 páginas no intervalo atual foram acessadas sequencialmente. Se o valor for 8, o `InnoDB` aciona uma leitura antecipada assíncrona mesmo que apenas 8 páginas no intervalo sejam acessadas sequencialmente. Você pode definir o valor deste parâmetro no arquivo de configuração do MySQL ou alterá-lo dinamicamente com a instrução `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

A leitura antecipada **aleatória** é uma técnica que prevê quando as páginas podem ser necessárias em breve com base em páginas já no buffer pool, independentemente da ordem em que essas páginas foram lidas. Se 13 páginas consecutivas do mesmo intervalo forem encontradas no buffer pool, o `InnoDB` emite de forma assíncrona um pedido para pré-carregar as páginas restantes do intervalo. Para habilitar essa funcionalidade, defina a variável de configuração `innodb_random_read_ahead` para `ON`.

A instrução `SHOW ENGINE INNODB STATUS` exibe estatísticas para ajudá-lo a avaliar a eficácia do algoritmo de leitura antecipada. As estatísticas incluem informações de contador para as seguintes variáveis de status globais:

* `Innodb_buffer_pool_read_ahead`
* `Innodb_buffer_pool_read_ahead_evicted`
* `Innodb_buffer_pool_read_ahead_rnd`

Esta informação pode ser útil ao ajustar o ajuste `innodb_random_read_ahead`.

Para mais informações sobre o desempenho de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de disco do InnoDB” e a Seção 10.12.1, “Otimizando o E/S de disco”.