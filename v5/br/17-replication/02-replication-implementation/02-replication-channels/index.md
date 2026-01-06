### 16.2.2 Canais de replicação

16.2.2.1 Comandos para operações em um único canal

16.2.2.2 Compatibilidade com declarações de replicação anteriores

16.2.2.3 Opções de inicialização e canais de replicação

16.2.2.4 Convenções de Nomenclatura de Canais de Replicação

Na replicação multi-fonte do MySQL, uma replica abre múltiplos canais de replicação, um para cada servidor de fonte de replicação. Os canais de replicação representam o caminho das transações que fluem de uma fonte para a replica. Cada canal de replicação tem seu próprio fio de receptor (I/O), um ou mais fios de aplicador (SQL) e um log de relevo. Quando as transações de uma fonte são recebidas pelo fio de receptor de um canal, elas são adicionadas ao arquivo de log de relevo do canal e passadas para os fios de aplicador do canal. Isso permite que cada canal funcione de forma independente.

Esta seção descreve como os canais podem ser usados em uma topologia de replicação e o impacto que eles têm na replicação de fonte única. Para obter instruções sobre como configurar fontes e réplicas para replicação de múltiplas fontes, para iniciar, parar e reiniciar réplicas de múltiplas fontes e para monitorar a replicação de múltiplas fontes, consulte Seção 16.1.5, “Replicação de Múltiplas Fontes do MySQL”.

O número máximo de canais que podem ser criados em uma replica em uma topologia de replicação de múltiplas fontes é de 256. Cada canal de replicação deve ter um nome (não vazio) único, conforme explicado na Seção 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”. Os códigos de erro e as mensagens emitidas quando a replicação de múltiplas fontes está habilitada especificam o canal que gerou o erro.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Você não pode configurar múltiplos canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, então ela não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica de múltiplas fontes também pode ser configurada como uma replica multisserial, definindo a variável de sistema `slave_parallel_workers` para um valor maior que 0. Quando você faz isso em uma replica de múltiplas fontes, cada canal da replica tem o número especificado de threads do aplicável, além de uma thread de coordenador para gerenciá-las. Você não pode configurar o número de threads do aplicável para canais individuais.

Para garantir compatibilidade com versões anteriores, o servidor MySQL cria automaticamente, ao iniciar, um canal padrão cujo nome é a string vazia (`""`). Esse canal está sempre presente; ele não pode ser criado ou destruído pelo usuário. Se nenhum outro canal (com nomes não vazios) tiver sido criado, as instruções de replicação atuam apenas no canal padrão, de modo que todas as instruções de replicação das réplicas mais antigas funcionam conforme o esperado (veja Seção 16.2.2.2, “Compatibilidade com Instruções de Replicação Prévias”. As instruções que se aplicam aos canais de replicação, conforme descrito nesta seção, só podem ser usadas quando há pelo menos um canal nomeado.
