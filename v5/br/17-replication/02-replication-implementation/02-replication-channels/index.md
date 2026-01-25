### 16.2.2 Canais de Replicação

[16.2.2.1 Comandos para Operações em um Único Canal](channels-commands-single-channel.html)

[16.2.2.2 Compatibilidade com Declarações de Replicação Anteriores](channels-with-prev-replication.html)

[16.2.2.3 Opções de Inicialização e Canais de Replicação](channels-startup-options.html)

[16.2.2.4 Convenções de Nomenclatura para Canais de Replicação](channels-naming-conventions.html)

Na replicação multi-source do MySQL, uma réplica abre múltiplos canais de replicação, um para cada servidor source de replicação. Os canais de replicação representam o caminho das transações que fluem de um source para a réplica. Cada canal de replicação tem sua própria Thread receiver (I/O), uma ou mais Threads applier (SQL) e um relay log. Quando as transações de um source são recebidas pela Thread receiver de um canal, elas são adicionadas ao arquivo relay log do canal e passadas para as Threads applier do canal. Isso permite que cada canal funcione de forma independente.

Esta seção descreve como os canais podem ser usados em uma topologia de replicação e o impacto que eles têm na replicação single-source. Para instruções sobre como configurar sources e réplicas para replicação multi-source, iniciar, parar e redefinir réplicas multi-source, e monitorar a replicação multi-source, consulte [Seção 16.1.5, “MySQL Multi-Source Replication”](replication-multi-source.html "16.1.5 MySQL Multi-Source Replication").

O número máximo de canais que podem ser criados em uma réplica em uma topologia de replicação multi-source é 256. Cada canal de replicação deve ter um nome exclusivo (não vazio), conforme explicado em [Seção 16.2.2.4, “Replication Channel Naming Conventions”](channels-naming-conventions.html "16.2.2.4 Convenções de Nomenclatura para Canais de Replicação"). Os códigos de erro e mensagens emitidas quando a replicação multi-source está habilitada especificam o canal que gerou o erro.

Nota

Cada canal em uma réplica multi-source deve replicar de um source diferente. Não é possível configurar múltiplos canais de replicação de uma única réplica para um único source. Isso ocorre porque os Server IDs das réplicas devem ser exclusivos em uma topologia de replicação. O source distingue as réplicas apenas por seus Server IDs, e não pelos nomes dos canais de replicação, de modo que ele não pode reconhecer diferentes canais de replicação da mesma réplica.

Uma réplica multi-source também pode ser configurada como uma réplica multi-threaded, definindo a variável de sistema [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) para um valor maior que 0. Ao fazer isso em uma réplica multi-source, cada canal na réplica tem o número especificado de Threads applier, mais uma Thread coordenadora para gerenciá-las. Não é possível configurar o número de Threads applier para canais individuais.

Para fornecer compatibilidade com versões anteriores, o servidor MySQL cria automaticamente na inicialização um canal padrão cujo nome é a string vazia (`""`). Este canal está sempre presente; ele não pode ser criado ou destruído pelo usuário. Se nenhum outro canal (com nomes não vazios) tiver sido criado, as declarações de replicação atuarão apenas no canal padrão, de modo que todas as declarações de replicação de réplicas mais antigas funcionem conforme o esperado (consulte [Seção 16.2.2.2, “Compatibility with Previous Replication Statements”](channels-with-prev-replication.html "16.2.2.2 Compatibilidade com Declarações de Replicação Anteriores"). As declarações aplicáveis aos canais de replicação, conforme descrito nesta seção, só podem ser usadas quando há pelo menos um canal nomeado.