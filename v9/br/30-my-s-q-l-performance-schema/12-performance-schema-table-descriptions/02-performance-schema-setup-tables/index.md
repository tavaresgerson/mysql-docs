### 29.12.2 Configurações das tabelas do Schema de Desempenho

29.12.2.1 Tabela setup_actors

29.12.2.2 Tabela setup_consumers

29.12.2.3 Tabela setup_instruments

29.12.2.4 Tabela setup_objects

29.12.2.5 Tabela setup_threads

As tabelas de configuração fornecem informações sobre a instrumentação atual e permitem que a configuração de monitoramento seja alterada. Por essa razão, algumas colunas nessas tabelas podem ser alteradas se você tiver o privilégio de `UPDATE`.

O uso de tabelas em vez de variáveis individuais para informações de configuração do Schema de Desempenho oferece um alto grau de flexibilidade na modificação da configuração do Schema de Desempenho. Por exemplo, você pode usar uma única instrução com sintaxe SQL padrão para fazer múltiplas alterações de configuração simultâneas.

Essas tabelas de configuração estão disponíveis:

* `setup_actors`: Como inicializar o monitoramento para novos threads em primeiro plano

* `setup_consumers`: Os destinos para os quais as informações dos eventos podem ser enviadas e armazenadas

* `setup_instruments`: As classes de objetos instrumentados para os quais os eventos podem ser coletados

* `setup_objects`: Quais objetos devem ser monitorados

* `setup_threads`: Nomes e atributos de threads instrumentadas