### 19.2.2 Canais de Replicação

19.2.2.1 Comandos para Operações em um único canal

19.2.2.2 Compatibilidade com Declarações de Replicação Prévias

19.2.2.3 Opções de Inicialização e Canais de Replicação

19.2.2.4 Convenções de Nomenclatura de Canais de Replicação

Na replicação multi-fonte do MySQL, uma replica abre vários canais de replicação, um para cada servidor de origem. Os canais de replicação representam o caminho das transações que fluem de uma origem para a replica. Cada canal de replicação tem seu próprio fio de receptor (I/O), um ou mais fios de aplicador (SQL) e um log de relevo. Quando as transações de uma origem são recebidas pelo fio de receptor de um canal, elas são adicionadas ao arquivo de log de relevo do canal e passadas para os fios de aplicador do canal. Isso permite que cada canal funcione de forma independente.

Esta seção descreve como os canais podem ser usados em uma topologia de replicação e o impacto que eles têm na replicação de uma única origem. Para instruções de configuração de fontes e réplicas para replicação multi-fonte, para iniciar, parar e reiniciar réplicas multi-fonte e para monitorar a replicação multi-fonte, consulte a Seção 19.1.5, “Replicação Multi-Fonte do MySQL”.

O número máximo de canais que podem ser criados em um servidor de replica em uma topologia de replicação multi-fonte é de 256. Cada canal de replicação deve ter um nome (não vazio) único, conforme explicado na Seção 19.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”. Os códigos de erro e mensagens emitidos quando a replicação multi-fonte é habilitada especificam o canal que gerou o erro.

Nota

Cada canal em uma replica de múltiplas fontes deve replicar a partir de uma fonte diferente. Você não pode configurar múltiplos canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então ela não pode reconhecer diferentes canais de replicação da mesma replica.

Quando uma replica de múltiplas fontes também é configurada como uma replica multisserial, cada canal na replica tem o número especificado de threads de aplicável, além de uma thread de coordenador para gerenciá-las. Você não pode configurar o número de threads de aplicável para canais individuais.

As réplicas de múltiplas fontes podem ser configuradas com filtros de replicação em canais específicos. Filtros de replicação específicos de canal podem ser usados quando o mesmo banco de dados ou tabela está presente em múltiplas fontes, e você só precisa que a replica o replique de uma fonte. Para a replicação baseada em GTID, se a mesma transação pode chegar de múltiplas fontes (como em uma topologia de diamante), você deve garantir que a configuração de filtragem seja a mesma em todos os canais. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

Para garantir compatibilidade com versões anteriores, o servidor MySQL cria automaticamente, ao iniciar, um canal padrão cujo nome é a string vazia (`""`). Esse canal está sempre presente; ele não pode ser criado ou destruído pelo usuário. Se nenhum outro canal (com nomes não vazios) tiver sido criado, as instruções de replicação atuam apenas no canal padrão, de modo que todas as instruções de replicação das réplicas mais antigas funcionam conforme o esperado (consulte a Seção 19.2.2.2, “Compatibilidade com Instruções de Replicação Prévias”). As instruções que se aplicam a canais de replicação, conforme descrito nesta seção, só podem ser usadas quando há pelo menos um canal com nome.