### 16.1.1 Configuração de Replicação Baseada na Posição do Arquivo de Registro Binário

Esta seção descreve a replicação entre servidores MySQL com base no método de posição do arquivo de log binário, onde a instância MySQL que opera como a fonte (onde as alterações no banco de dados são originadas) escreve atualizações e alterações como “eventos” no log binário. As informações no log binário são armazenadas em diferentes formatos de registro de acordo com as alterações no banco de dados que estão sendo registradas. As réplicas são configuradas para ler o log binário da fonte e para executar os eventos no log binário no banco de dados local da replica.

Cada replica recebe uma cópia de todo o conteúdo do log binário. Cabe à replica decidir quais declarações no log binário devem ser executadas. A menos que você especifique o contrário, todos os eventos no log binário da fonte são executados na replica. Se necessário, você pode configurar a replica para processar apenas eventos que se aplicam a bancos de dados ou tabelas específicas.

Importante

Você não pode configurar a fonte para registrar apenas certos eventos.

Cada réplica mantém um registro das coordenadas do log binário: o nome do arquivo e a posição dentro do arquivo que ela leu e processou da fonte. Isso significa que múltiplas réplicas podem ser conectadas à fonte e executar diferentes partes do mesmo log binário. Como as réplicas controlam esse processo, réplicas individuais podem ser conectadas e desconectadas do servidor sem afetar o funcionamento da fonte. Além disso, como cada réplica registra a posição atual dentro do log binário, é possível desconectar, reconectar e, em seguida, retomar o processamento das réplicas.

A fonte e cada réplica devem ser configuradas com um ID único (usando a variável de sistema `server_id`). Além disso, cada réplica deve ser configurada com informações sobre o nome do host da fonte, o nome do arquivo de log e a posição dentro desse arquivo. Esses detalhes podem ser controlados dentro de uma sessão MySQL usando a instrução `CHANGE MASTER TO` na réplica. Os detalhes são armazenados no repositório de metadados de conexão da réplica, que pode ser um arquivo ou uma tabela (veja Seção 16.2.4, “Repositórios de Metadados de Log e Replicação”).
