### 16.1.5 Replicação de múltiplas fontes do MySQL

16.1.5.1 Configurando a Replicação de Múltiplas Fontes

16.1.5.2 Configuração de uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID

16.1.5.3 Adicionando fontes baseadas em GTID a uma réplica de múltiplas fontes

16.1.5.4 Adicionando uma Fonte de Log de Binário a uma Replicação de Múltiplas Fontes

16.1.5.5 Começar Replicas de Múltiplos Fontes

16.1.5.6 Parar réplicas de múltiplas fontes

16.1.5.7 Redefinindo Replicas de Múltiplas Fontes

16.1.5.8 Monitoramento da Replicação de Múltiplas Fontes

A replicação multi-fonte do MySQL permite que uma replica receba transações de múltiplas fontes imediatas em paralelo. Em uma topologia de replicação multi-fonte, uma replica cria um canal de replicação para cada fonte da qual deve receber transações. Para mais informações sobre como os canais de replicação funcionam, consulte Seção 16.2.2, “Canais de Replicação”.

Você pode optar por implementar a replicação de múltiplas fontes para alcançar objetivos como esses:

- Fazer backup de vários servidores para um único servidor.
- Unindo fragmentos de mesa.
- Consolidação de dados de vários servidores para um único servidor.

A replicação de múltiplas fontes não implementa detecção ou resolução de conflitos ao aplicar transações, e essas tarefas são deixadas para o aplicativo, se necessário.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Você não pode configurar múltiplos canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então ela não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica de múltiplas fontes também pode ser configurada como uma replica multisserial, definindo a variável de sistema `slave_parallel_workers` para um valor maior que 0. Quando você faz isso em uma replica de múltiplas fontes, cada canal da replica tem o número especificado de threads do aplicável, além de uma thread de coordenador para gerenciá-las. Você não pode configurar o número de threads do aplicável para canais individuais.

Esta seção fornece tutoriais sobre como configurar fontes e réplicas para replicação de múltiplas fontes, como iniciar, parar e reiniciar réplicas de múltiplas fontes e como monitorar a replicação de múltiplas fontes.
