#### 14.8.3.4 Configurando o Prefetching (leitura antecipada) do Pool de Buffer do InnoDB

Um pedido de leitura antecipada é um pedido de E/S para pré-carregar várias páginas no pool de buffer de forma assíncrona, antecipando que essas páginas serão necessárias em breve. Os pedidos trazem todas as páginas em um mesmo intervalo. O `InnoDB` utiliza dois algoritmos de leitura antecipada para melhorar o desempenho do E/S:

O **linear** read-ahead é uma técnica que prevê quais páginas podem ser necessárias em breve com base nas páginas no pool de buffer sendo acessadas sequencialmente. Você controla quando o `InnoDB` realiza uma operação de leitura antecipada ajustando o número de acessos sequenciais de páginas necessários para desencadear uma solicitação de leitura assíncrona, usando o parâmetro de configuração `innodb_read_ahead_threshold`. Antes que este parâmetro fosse adicionado, o `InnoDB` só calculava se emitiria uma solicitação de pré-carga assíncrona para todo o próximo intervalo quando lia a última página do intervalo atual.

O parâmetro de configuração `innodb_read_ahead_threshold` controla a sensibilidade do `InnoDB` ao detectar padrões de acesso sequencial de páginas. Se o número de páginas lidas sequencialmente de um intervalo for maior ou igual a `innodb_read_ahead_threshold`, o `InnoDB` inicia uma operação de leitura antecipada assíncrona de todo o intervalo seguinte. `innodb_read_ahead_threshold` pode ser definido para qualquer valor entre 0 e 64. O valor padrão é 56. Quanto maior o valor, mais rigoroso será o controle do padrão de acesso. Por exemplo, se você definir o valor para 48, o `InnoDB` aciona um pedido de leitura antecipada linear apenas quando 48 páginas no intervalo atual foram acessadas sequencialmente. Se o valor for 8, o `InnoDB` aciona uma leitura antecipada assíncrona mesmo que apenas 8 páginas no intervalo sejam acessadas sequencialmente. Você pode definir o valor deste parâmetro no arquivo de configuração do MySQL ou alterá-lo dinamicamente com a instrução `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

O **leitura antecipada aleatória** é uma técnica que prevê quando as páginas podem ser necessárias em breve com base nas páginas já no pool de buffer, independentemente da ordem em que essas páginas foram lidas. Se 13 páginas consecutivas da mesma extensão forem encontradas no pool de buffer, o `InnoDB` emite um pedido assíncrono para pré-carregar as páginas restantes da extensão. Para habilitar essa funcionalidade, defina a variável de configuração `innodb_random_read_ahead` para `ON`.

O comando `SHOW ENGINE INNODB STATUS` exibe estatísticas para ajudá-lo a avaliar a eficácia do algoritmo de leitura antecipada. As estatísticas incluem informações de contador para as seguintes variáveis de status globais:

- `Innodb_buffer_pool_read_ahead`
- `Innodb_buffer_pool_read_ahead_evicted`
- `Innodb_buffer_pool_read_ahead_rnd`

Essas informações podem ser úteis ao ajustar o ajuste `innodb_random_read_ahead`.

Para obter mais informações sobre o desempenho de E/S, consulte a Seção 8.5.8, “Otimizando E/S de Disco InnoDB” e a Seção 8.12.2, “Otimizando E/S de Disco”.
