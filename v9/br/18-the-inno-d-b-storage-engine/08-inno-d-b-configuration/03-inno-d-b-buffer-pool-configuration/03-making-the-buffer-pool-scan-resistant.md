#### 17.8.3.3 Tornando o Scan do Pool de Buffer Resistente

Em vez de usar um algoritmo LRU rigoroso, o `InnoDB` utiliza uma técnica para minimizar a quantidade de dados que são trazidos para o pool de buffer e nunca mais acessados. O objetivo é garantir que as páginas acessadas com frequência (“quentes”) permaneçam no pool de buffer, mesmo quando scans de leitura à frente e scans completos da tabela trazem novos blocos que podem ou não serem acessados posteriormente.

Blocos recém-lidos são inseridos no meio da lista LRU. Todas as páginas recém-lidas são inseridas em uma localização que, por padrão, é `3/8` da extremidade da lista LRU. As páginas são movidas para a frente da lista (a extremidade mais recentemente usada) quando são acessadas no pool de buffer pela primeira vez. Assim, as páginas que nunca são acessadas nunca chegam à parte frontal da lista LRU e “desaparecem” mais cedo do que com uma abordagem LRU rigorosa. Essa disposição divide a lista LRU em dois segmentos, onde as páginas a jusante do ponto de inserção são consideradas “antigas” e são vítimas desejáveis para a expulsão LRU.

Para uma explicação sobre o funcionamento interno do pool de buffer do `InnoDB` e especificidades sobre o algoritmo LRU, consulte a Seção 17.5.1, “Pool de Buffer”.

Você pode controlar o ponto de inserção na lista LRU e escolher se o `InnoDB` aplica a mesma otimização aos blocos trazidos para o pool de buffer por scans de tabela ou índice. O parâmetro de configuração `innodb_old_blocks_pct` controla a porcentagem de blocos “antigos” na lista LRU. O valor padrão de `innodb_old_blocks_pct` é `37`, correspondendo à proporção fixa original de 3/8. A faixa de valores é `5` (novas páginas no pool de buffer desaparecem muito rapidamente) a `95` (apenas 5% do pool de buffer é reservado para páginas quentes, fazendo com que o algoritmo se aproxime da estratégia LRU familiar).

A otimização que impede que o pool de tampão seja removido devido a leituras antecipadas pode evitar problemas semelhantes devido a varreduras de tabelas ou índices. Nessas varreduras, uma página de dados é tipicamente acessada algumas vezes em rápida sucessão e nunca é tocada novamente. O parâmetro de configuração `innodb_old_blocks_time` especifica a janela de tempo (em milissegundos) após o primeiro acesso a uma página durante a qual ela pode ser acessada sem ser movida para a frente (extremo mais recentemente usado) da lista LRU. O valor padrão de `innodb_old_blocks_time` é `1000`. Aumentar esse valor torna cada vez mais provável que blocos envelheçam mais rapidamente do pool de tampão.

Tanto `innodb_old_blocks_pct` quanto `innodb_old_blocks_time` podem ser especificados no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou alterados em tempo de execução com a instrução `SET GLOBAL`. Alterar o valor em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Para ajudá-lo a avaliar o efeito da configuração desses parâmetros, a instrução `SHOW ENGINE INNODB STATUS` relata estatísticas do pool de tampão. Para detalhes, consulte Monitoramento do Pool de Tampão Usando o Monitor Padrão InnoDB.

Como os efeitos desses parâmetros podem variar amplamente com base na sua configuração de hardware, nos seus dados e nos detalhes da sua carga de trabalho, sempre realize uma medição para verificar a eficácia antes de alterar essas configurações em qualquer ambiente de produção ou crítico de desempenho.

Em cargas de trabalho mistas onde a maior parte da atividade é do tipo OLTP com consultas de relatórios em lote periódicos que resultam em varreduras grandes, definir o valor de `innodb_old_blocks_time` durante as execuções em lote pode ajudar a manter o conjunto de trabalho da carga de trabalho normal no pool de tampão.

Ao digitalizar tabelas grandes que não cabem inteiramente no pool de buffers, definir `innodb_old_blocks_pct` para um valor pequeno mantém os dados que são lidos apenas uma vez, evitando o consumo de uma parte significativa do pool de buffers. Por exemplo, definir `innodb_old_blocks_pct=5` restringe esses dados que são lidos apenas uma vez a 5% do pool de buffers.

Ao digitalizar tabelas pequenas que cabem na memória, há menos sobrecarga para mover páginas dentro do pool de buffers, então você pode deixar `innodb_old_blocks_pct` no seu valor padrão, ou até mesmo maior, como `innodb_old_blocks_pct=50`.

O efeito do parâmetro `innodb_old_blocks_time` é mais difícil de prever do que o parâmetro `innodb_old_blocks_pct`, é relativamente pequeno e varia mais com a carga de trabalho. Para chegar a um valor ótimo, realize seus próprios benchmarks se a melhoria de desempenho ajustando `innodb_old_blocks_pct` não for suficiente.