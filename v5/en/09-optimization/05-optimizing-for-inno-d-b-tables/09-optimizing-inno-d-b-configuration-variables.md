### 8.5.9 Otimizando Variáveis de Configuração do InnoDB

Diferentes configurações funcionam melhor para servidores com cargas leves e previsíveis, em contraste com servidores que estão rodando perto da capacidade total o tempo todo, ou que experimentam picos de alta atividade.

Como o storage engine `InnoDB` realiza muitas de suas otimizações automaticamente, muitas tarefas de performance-tuning envolvem monitoramento para garantir que o Database esteja funcionando bem, e a alteração de opções de configuração quando a performance cai. Consulte a Seção 14.17, “Integração do InnoDB com o MySQL Performance Schema” para obter informações sobre monitoramento detalhado da performance do `InnoDB`.

As principais etapas de configuração que você pode realizar incluem:

* Habilitar o `InnoDB` a usar alocadores de memória de alta performance em sistemas que os incluem. Consulte a Seção 14.8.4, “Configurando o Memory Allocator para InnoDB”.

* Controlar os tipos de operações de alteração de dados para as quais o `InnoDB` faz o Buffer dos dados alterados, a fim de evitar escritas de disco pequenas e frequentes. Consulte Configuring Change Buffering. Como o padrão é fazer o Buffer de todos os tipos de operações de alteração de dados, altere esta configuração apenas se precisar reduzir a quantidade de Buffering.

* Ligar e desligar o recurso Adaptive Hash Indexing usando a opção `innodb_adaptive_hash_index`. Consulte a Seção 14.5.3, “Adaptive Hash Index” para obter mais informações. Você pode alterar esta configuração durante períodos de atividade incomum e, em seguida, restaurá-la para sua configuração original.

* Definir um limite para o número de Threads concorrentes que o `InnoDB` processa, caso o context switching seja um bottleneck. Consulte a Seção 14.8.5, “Configurando Thread Concurrency para InnoDB”.

* Controlar a quantidade de prefetching que o `InnoDB` realiza com suas operações de read-ahead. Quando o sistema tem capacidade de I/O não utilizada, mais read-ahead pode melhorar a performance de Queries. Excesso de read-ahead pode causar quedas periódicas na performance em um sistema altamente carregado. Consulte a Seção 14.8.3.4, “Configurando InnoDB Buffer Pool Prefetching (Read-Ahead)”").

* Aumentar o número de Threads de background para operações de read ou write, se você tiver um subsistema de I/O de ponta que não esteja totalmente utilizado pelos valores padrão. Consulte a Seção 14.8.6, “Configurando o Número de Background InnoDB I/O Threads”.

* Controlar a quantidade de I/O que o `InnoDB` realiza em background. Consulte a Seção 14.8.8, “Configurando InnoDB I/O Capacity”. Você pode reduzir esta configuração se observar quedas periódicas na performance.

* Controlar o algoritmo que determina quando o `InnoDB` realiza certos tipos de writes em background. Consulte a Seção 14.8.3.5, “Configurando Buffer Pool Flushing”. O algoritmo funciona para alguns tipos de Workloads, mas não para outros, então você pode desativar esta configuração se observar quedas periódicas na performance.

* Aproveitar processadores multicore e suas configurações de cache memory, para minimizar atrasos no context switching. Consulte a Seção 14.8.9, “Configurando Spin Lock Polling”.

* Impedir que operações únicas, como table scans, interfiram nos dados frequentemente acessados armazenados no Buffer Cache do `InnoDB`. Consulte a Seção 14.8.3.3, “Tornando o Buffer Pool Resistente a Scans”.

* Ajustar os arquivos de log para um tamanho que faça sentido para confiabilidade e crash recovery. Os arquivos de log do `InnoDB` frequentemente têm sido mantidos pequenos para evitar longos tempos de inicialização após um crash. Otimizações introduzidas no MySQL 5.5 aceleram certas etapas do processo de crash recovery. Em particular, a leitura do redo log e a aplicação do redo log são mais rápidas devido a algoritmos aprimorados para gerenciamento de memória. Se você manteve seus arquivos de log artificialmente pequenos para evitar longos tempos de inicialização, agora pode considerar aumentar o tamanho do arquivo de log para reduzir o I/O que ocorre devido à reciclagem de registros do redo log.

* Configurar o tamanho e o número de instâncias para o Buffer Pool do `InnoDB`, especialmente importante para sistemas com Buffer Pools de múltiplos gigabytes. Consulte a Seção 14.8.3.2, “Configurando Múltiplas Buffer Pool Instances”.

* Aumentar o número máximo de transactions concorrentes, o que melhora drasticamente a escalabilidade para os Databases mais ocupados. Consulte a Seção 14.6.7, “Undo Logs”.

* Mover operações de purge (um tipo de garbage collection) para uma Thread de background. Consulte a Seção 14.8.10, “Purge Configuration”. Para medir efetivamente os resultados desta configuração, primeiro faça o tuning das outras configurações relacionadas a I/O e Thread.

* Reduzir a quantidade de switching que o `InnoDB` realiza entre Threads concorrentes, para que as operações SQL em um servidor ocupado não se enfileirem e formem um “engarrafamento” (traffic jam). Defina um valor para a opção `innodb_thread_concurrency`, de até aproximadamente 32 para um sistema moderno de alta potência. Aumente o valor para a opção `innodb_concurrency_tickets`, tipicamente para cerca de 5000. Esta combinação de opções define um limite máximo (cap) para o número de Threads que o `InnoDB` processa a qualquer momento, e permite que cada Thread execute um trabalho substancial antes de ser swapped out, de modo que o número de Threads em espera permaneça baixo e as operações possam ser concluídas sem context switching excessivo.