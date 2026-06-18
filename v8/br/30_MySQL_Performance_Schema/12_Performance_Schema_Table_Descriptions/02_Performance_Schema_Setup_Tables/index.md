### 29.12.1 Tabelas de configuração do esquema de desempenho

29.12.2.1 A tabela setup\_actors

29.12.2.2 A tabela setup\_consumers

29.12.2.3 A tabela setup\_instruments

29.12.2.4 A tabela setup\_objects

29.12.2.5 A tabela setup\_threads

As tabelas de configuração fornecem informações sobre a instrumentação atual e permitem que a configuração de monitoramento seja alterada. Por essa razão, algumas colunas nessas tabelas podem ser alteradas se você tiver o privilégio `UPDATE`.

O uso de tabelas em vez de variáveis individuais para informações de configuração oferece um alto grau de flexibilidade na modificação da configuração do Performance Schema. Por exemplo, você pode usar uma única instrução com sintaxe SQL padrão para fazer várias alterações de configuração simultâneas.

Estes são os modelos de configuração disponíveis:

- `setup_actors`: Como iniciar o monitoramento para novos threads em primeiro plano

- `setup_consumers`: Os destinos para os quais as informações do evento podem ser enviadas e armazenadas

- `setup_instruments`: As classes de objetos instrumentados para os quais eventos podem ser coletados

- `setup_objects`: Quais objetos devem ser monitorados

- `setup_threads`: Nomes e atributos de fios instrumentados
