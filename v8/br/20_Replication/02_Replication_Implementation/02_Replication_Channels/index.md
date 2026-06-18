### 19.2.2 Canais de replicação

19.2.2.1 Comandos para operações em um único canal

19.2.2.2 Compatibilidade com declarações de replicação anteriores

19.2.2.3 Opções de inicialização e canais de replicação

19.2.2.4 Convenções de Nomenclatura de Canais de Replicação

Na replicação de múltiplas fontes no MySQL, uma replica abre vários canais de replicação, um para cada servidor de origem. Os canais de replicação representam o caminho das transações que fluem de uma fonte para a replica. Cada canal de replicação tem seu próprio fio de receptor (I/O), um ou mais fios de aplicador (SQL) e um log de relevo. Quando as transações de uma fonte são recebidas pelo fio de receptor de um canal, elas são adicionadas ao arquivo de log de relevo do canal e passadas para os fios de aplicador do canal. Isso permite que cada canal funcione de forma independente.

Esta seção descreve como os canais podem ser usados em uma topologia de replicação e o impacto que eles têm na replicação de fonte única. Para obter instruções sobre como configurar fontes e réplicas para replicação de múltiplas fontes, para iniciar, parar e reiniciar réplicas de múltiplas fontes e para monitorar a replicação de múltiplas fontes, consulte a Seção 19.1.5, “Replicação de Múltiplas Fontes do MySQL”.

O número máximo de canais que podem ser criados em um servidor replicador em uma topologia de replicação de múltiplas fontes é de 256. Cada canal de replicação deve ter um nome único (não vazio), conforme explicado na Seção 19.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”. Os códigos de erro e as mensagens emitidas quando a replicação de múltiplas fontes está habilitada especificam o canal que gerou o erro.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Você não pode configurar múltiplos canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então ela não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica de múltiplas fontes também pode ser configurada como uma replica multisserial, definindo a variável de sistema `replica_parallel_workers` (a partir do MySQL 8.0.26) ou `slave_parallel_workers` (antes do MySQL 8.0.26) para um valor maior que 0. Quando você faz isso em uma replica de múltiplas fontes, cada canal na replica tem o número especificado de threads de aplicável, além de um thread de coordenador para gerenciá-los. Você não pode configurar o número de threads de aplicável para canais individuais.

A partir do MySQL 8.0, as réplicas de múltiplas fontes podem ser configuradas com filtros de replicação em canais de replicação específicos. Os filtros de replicação específicos de canal podem ser usados quando o mesmo banco de dados ou tabela está presente em múltiplas fontes e você precisa apenas que a réplica o replique de uma fonte. Para a replicação baseada em GTID, se a mesma transação pode chegar de múltiplas fontes (como em uma topologia em forma de diamante), você deve garantir que a configuração de filtragem seja a mesma em todos os canais. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

Para garantir compatibilidade com versões anteriores, o servidor MySQL cria automaticamente, ao iniciar, um canal padrão cujo nome é a string vazia (`""`). Esse canal está sempre presente; ele não pode ser criado ou destruído pelo usuário. Se nenhum outro canal (com nomes não vazios) tiver sido criado, as instruções de replicação atuam apenas no canal padrão, de modo que todas as instruções de replicação das réplicas mais antigas funcionam conforme o esperado (consulte a Seção 19.2.2.2, “Compatibilidade com Instruções de Replicação Prévias”). As instruções que se aplicam aos canais de replicação, conforme descrito nesta seção, só podem ser usadas quando há pelo menos um canal com nome.
