### 25.12.2 Tabelas de Configuração do Performance Schema

[25.12.2.1 A Tabela setup_actors](performance-schema-setup-actors-table.html)

[25.12.2.2 A Tabela setup_consumers](performance-schema-setup-consumers-table.html)

[25.12.2.3 A Tabela setup_instruments](performance-schema-setup-instruments-table.html)

[25.12.2.4 A Tabela setup_objects](performance-schema-setup-objects-table.html)

[25.12.2.5 A Tabela setup_timers](performance-schema-setup-timers-table.html)

As tabelas de configuração (setup tables) fornecem informações sobre a instrumentação atual e permitem que a configuração de monitoramento seja alterada. Por essa razão, algumas colunas nessas tabelas podem ser modificadas se você tiver o privilégio [`UPDATE`](privileges-provided.html#priv_update).

O uso de tabelas em vez de variáveis individuais para informações de configuração oferece um alto grau de flexibilidade na modificação da configuração do Performance Schema. Por exemplo, você pode usar uma única instrução com sintaxe SQL padrão para realizar múltiplas alterações de configuração simultâneas.

Estas tabelas de configuração estão disponíveis:

* [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 A Tabela setup_actors"): Como inicializar o monitoramento para novos *foreground threads*

* [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers"): Os destinos para os quais as informações de evento podem ser enviadas e armazenadas

* [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments"): As classes de objetos instrumentados para as quais os eventos podem ser coletados

* [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 A Tabela setup_objects"): Quais objetos devem ser monitorados

* [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 A Tabela setup_timers"): O *timer* de evento atual