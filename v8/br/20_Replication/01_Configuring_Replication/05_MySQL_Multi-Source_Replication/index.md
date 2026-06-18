### 19.1.5 Replicação de múltiplas fontes do MySQL

19.1.5.1 Configurando a Replicação de Múltiplas Fontes

19.1.5.2 Configuração de uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID

19.1.5.3 Adicionando fontes baseadas em GTID a uma réplica de múltiplas fontes

19.1.5.4 Adicionando fontes de replicação baseadas em log binário a uma replica de múltiplas fontes

19.1.5.5 Começar réplicas de múltiplas fontes

19.1.5.6 Parar as Replicas de Múltiplos Fontes

19.1.5.7 Redefinindo Replicas de Multi-Fonte

19.1.5.8 Monitoramento da Replicação de Múltiplas Fontes

A replicação multi-fonte do MySQL permite que uma replica receba transações de múltiplas fontes imediatas em paralelo. Em uma topologia de replicação multi-fonte, uma replica cria um canal de replicação para cada fonte da qual deve receber transações. Para obter mais informações sobre como os canais de replicação funcionam, consulte a Seção 19.2.2, “Canais de Replicação”.

Você pode optar por implementar a replicação de múltiplas fontes para alcançar objetivos como esses:

- Fazer backup de vários servidores para um único servidor.
- Unindo fragmentos de mesa.
- Consolidação de dados de vários servidores para um único servidor.

A replicação de múltiplas fontes não implementa detecção ou resolução de conflitos ao aplicar transações, e essas tarefas são deixadas para o aplicativo, se necessário.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Você não pode configurar múltiplos canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então ela não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica de múltiplas fontes também pode ser configurada como uma replica multisserial, definindo a variável de sistema `replica_parallel_workers` (a partir do MySQL 8.0.26) ou `slave_parallel_workers` para um valor maior que 0. Quando você faz isso em uma replica de múltiplas fontes, cada canal na replica tem o número especificado de threads de aplicável, além de um thread de coordenador para gerenciá-los. Você não pode configurar o número de threads de aplicável para canais individuais.

A partir do MySQL 8.0, as réplicas de múltiplas fontes podem ser configuradas com filtros de replicação em canais de replicação específicos. Os filtros de replicação específicos de canal podem ser usados quando o mesmo banco de dados ou tabela está presente em múltiplas fontes e você precisa apenas que a réplica o replique de uma fonte. Para a replicação baseada em GTID, se a mesma transação pode chegar de múltiplas fontes (como em uma topologia em forma de diamante), você deve garantir que a configuração de filtragem seja a mesma em todos os canais. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

Esta seção fornece tutoriais sobre como configurar fontes e réplicas para replicação de múltiplas fontes, como iniciar, parar e reiniciar réplicas de múltiplas fontes e como monitorar a replicação de múltiplas fontes.
