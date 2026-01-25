#### 14.8.3.3 Tornando o Buffer Pool Resistente a Scans

Em vez de usar um algoritmo LRU estrito, o `InnoDB` utiliza uma técnica para minimizar a quantidade de dados que é trazida para o Buffer Pool e nunca mais acessada. O objetivo é garantir que as páginas frequentemente acessadas ("hot") permaneçam no Buffer Pool, mesmo que operações de read-ahead e full table Scans tragam novos blocos que podem ou não ser acessados posteriormente.

Blocos recém-lidos são inseridos no meio da lista LRU. Todas as páginas recém-lidas são inseridas em um local que, por padrão, está a `3/8` do final (tail) da lista LRU. As páginas são movidas para o início da lista (o lado mais recentemente usado) quando são acessadas no Buffer Pool pela primeira vez. Assim, as páginas que nunca são acessadas nunca chegam à porção frontal da lista LRU e "envelhecem" (age out) mais rapidamente do que com uma abordagem LRU estrita. Este arranjo divide a lista LRU em dois segmentos, onde as páginas a jusante do ponto de inserção são consideradas "old" e são vítimas desejáveis para a remoção (eviction) por LRU.

Para uma explicação do funcionamento interno do Buffer Pool do `InnoDB` e detalhes sobre o algoritmo LRU, consulte a Seção 14.5.1, “Buffer Pool”.

Você pode controlar o ponto de inserção na lista LRU e escolher se o `InnoDB` aplica a mesma otimização a blocos trazidos para o Buffer Pool por Scans de tabela ou Index. O parâmetro de configuração `innodb_old_blocks_pct` controla a porcentagem de blocos "old" na lista LRU. O valor padrão de `innodb_old_blocks_pct` é `37`, correspondendo à proporção fixa original de 3/8. O intervalo de valores é de `5` (páginas novas no Buffer Pool envelhecem muito rapidamente) a `95` (apenas 5% do Buffer Pool é reservado para páginas hot, tornando o algoritmo próximo da estratégia LRU familiar).

A otimização que impede o Buffer Pool de ser esvaziado (churned) pelo read-ahead pode evitar problemas semelhantes causados por Scans de tabela ou Index. Nestes Scans, uma página de dados é tipicamente acessada algumas vezes em rápida sucessão e nunca mais é tocada. O parâmetro de configuração `innodb_old_blocks_time` especifica a janela de tempo (em milissegundos) após o primeiro acesso a uma página durante a qual ela pode ser acessada sem ser movida para o início (lado mais recentemente usado) da lista LRU. O valor padrão de `innodb_old_blocks_time` é `1000`. Aumentar este valor torna mais e mais blocos propensos a envelhecer mais rapidamente para fora do Buffer Pool.

Tanto `innodb_old_blocks_pct` quanto `innodb_old_blocks_time` podem ser especificados no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou alterados em tempo de execução com a instrução `SET GLOBAL`. Alterar o valor em tempo de execução requer privilégios suficientes para definir System Variables globais. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

Para ajudar a avaliar o efeito da configuração desses parâmetros, o comando `SHOW ENGINE INNODB STATUS` reporta estatísticas do Buffer Pool. Para obter detalhes, consulte Monitoring the Buffer Pool Using the InnoDB Standard Monitor.

Visto que os efeitos desses parâmetros podem variar amplamente com base na sua configuração de hardware, seus dados e os detalhes da sua workload, sempre realize um benchmark para verificar a eficácia antes de alterar essas configurações em qualquer ambiente de produção ou crítico em termos de performance.

Em workloads mistas, onde a maior parte da atividade é do tipo OLTP com Queries periódicas de relatórios em lote que resultam em Scans grandes, definir o valor de `innodb_old_blocks_time` durante as execuções em lote pode ajudar a manter o conjunto de trabalho (working set) da workload normal no Buffer Pool.

Ao escanear (scanning) tabelas grandes que não cabem inteiramente no Buffer Pool, definir `innodb_old_blocks_pct` para um valor pequeno evita que os dados lidos apenas uma vez consumam uma porção significativa do Buffer Pool. Por exemplo, definir `innodb_old_blocks_pct=5` restringe esses dados que são lidos apenas uma vez a 5% do Buffer Pool.

Ao escanear tabelas pequenas que cabem na memória, há menos overhead para mover páginas dentro do Buffer Pool, então você pode deixar `innodb_old_blocks_pct` em seu valor padrão, ou até mais alto, como `innodb_old_blocks_pct=50`.

O efeito do parâmetro `innodb_old_blocks_time` é mais difícil de prever do que o parâmetro `innodb_old_blocks_pct`, é relativamente pequeno e varia mais com a workload. Para chegar a um valor ideal, realize seus próprios benchmarks se a melhoria de performance ao ajustar `innodb_old_blocks_pct` não for suficiente.