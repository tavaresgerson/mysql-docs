### 19.1.5 Replicação de Múltiplos Fontes

19.1.5.1 Configurando a Replicação de Múltiplas Fontes

19.1.5.2 Provisionando uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID

19.1.5.3 Adicionando Fontes Baseadas em Log Binário à uma Replicação de Múltiplas Fontes

19.1.5.4 Adicionando Fontes de Replicação Baseada em Log Binário à uma Replicação de Múltiplas Fontes

19.1.5.5 Iniciando Replicações de Múltiplas Fontes

19.1.5.6 Parando Replicações de Múltiplas Fontes

19.1.5.7 Reiniciando Replicações de Múltiplas Fontes

19.1.5.8 Monitorando a Replicação de Múltiplas Fontes

A replicação de múltiplas fontes no MySQL 9.5 permite que uma replica receba transações de múltiplas fontes imediatas em paralelo. Em uma topologia de replicação de múltiplas fontes, uma replica cria um canal de replicação para cada fonte da qual deve receber transações. Para mais informações sobre como os canais de replicação funcionam, consulte a Seção 19.2.2, “Canais de Replicação”.

Você pode optar por implementar a replicação de múltiplas fontes para alcançar objetivos como:

* Fazer backup de múltiplos servidores para um único servidor.
* Combinar fragmentos de tabela.
* Consolidar dados de múltiplos servidores para um único servidor.

A replicação de múltiplas fontes não implementa detecção ou resolução de conflitos ao aplicar transações, e essas tarefas são deixadas para o aplicativo, se necessário.

Nota

Cada canal em uma replicação de múltiplas fontes deve replicar de uma fonte diferente. Não é possível configurar múltiplos canais de replicação de uma única replica para uma única fonte. Isso ocorre porque os IDs de servidor das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então não pode reconhecer diferentes canais de replicação da mesma replica.

Quando uma replica de múltiplas fontes também está configurada como uma replica multi-threaded, cada canal da replica tem o número especificado de threads de aplicável, além de um canal de coordenador para gerenciá-los. Você não pode configurar o número de threads de aplicável para canais individuais.

O MySQL 9.5 também suporta filtros de replicação em canais específicos de replicação com replicas de múltiplas fontes. Filtros de replicação específicos de canal podem ser usados quando o mesmo banco de dados ou tabela está presente em múltiplas fontes e você precisa apenas que a replica o replique de uma fonte. Para replicação baseada em GTID, se a mesma transação pode chegar de múltiplas fontes (como em uma topologia em forma de diamante), você deve garantir que a configuração de filtragem seja a mesma em todos os canais. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

Esta seção fornece tutoriais sobre como configurar fontes e replicas para replicação de múltiplas fontes, como iniciar, parar e reiniciar replicas de múltiplas fontes e como monitorar a replicação de múltiplas fontes.