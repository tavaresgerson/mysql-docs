### 8.5.9 Otimizando as variáveis de configuração do InnoDB

Diferentes configurações funcionam melhor para servidores com cargas leves e previsíveis, em comparação com servidores que estão funcionando quase na capacidade máxima o tempo todo ou que experimentam picos de alta atividade.

Como o mecanismo de armazenamento `InnoDB` realiza muitas de suas otimizações automaticamente, muitas tarefas de ajuste de desempenho envolvem monitoramento para garantir que o banco de dados esteja funcionando bem e alterar as opções de configuração quando o desempenho cair. Consulte a Seção 14.17, “Integração do `InnoDB` com o Schema de Desempenho do MySQL”, para obter informações sobre o monitoramento detalhado do desempenho do `InnoDB`.

Os principais passos de configuração que você pode realizar incluem:

- Ative o uso de alocadores de memória de alto desempenho no sistema que os inclui. Consulte a Seção 14.8.4, “Configurando o Alocador de Memória para InnoDB”.

- Controle os tipos de operações de alteração de dados para as quais os buffers do `InnoDB` armazenam os dados alterados, para evitar escritas frequentes em disco de pequeno porte. Veja Configurar o Bufferamento de Alterações. Como o padrão é armazenar todos os tipos de operações de alteração de dados, altere essa configuração apenas se precisar reduzir a quantidade de buffer.

- Ative e desative a funcionalidade de indexação hash adaptativa usando a opção `innodb_adaptive_hash_index`. Consulte a Seção 14.5.3, “Índice Hash Adaptativo”, para obter mais informações. Você pode alterar essa configuração durante períodos de atividade incomum e, em seguida, restaurá-la para a configuração original.

- Estabelecer um limite para o número de threads concorrentes que o `InnoDB` processa, caso a alternância de contexto seja um gargalo. Veja a Seção 14.8.5, “Configurando Concorrência de Threads para InnoDB”.

- Controlar a quantidade de prefetching que o `InnoDB` faz com suas operações de leitura à frente. Quando o sistema tem capacidade de E/S não utilizada, mais leituras à frente podem melhorar o desempenho das consultas. Muito prefetching à frente pode causar quedas periódicas no desempenho em um sistema muito carregado. Veja a Seção 14.8.3.4, “Configurando o prefetching do Pool de Buffer do InnoDB (Leitura à Frente”)”).

- Aumente o número de threads de plano de fundo para operações de leitura ou escrita, se você tiver um subsistema de E/S de ponta que não seja totalmente utilizado pelos valores padrão. Consulte a Seção 14.8.6, “Configurando o Número de Threads de E/S InnoDB de Plano de Fundo”.

- Controlar a quantidade de operações de E/S que o `InnoDB` realiza em segundo plano. Consulte a Seção 14.8.8, “Configurando a Capacidade de E/S do InnoDB”. Você pode reduzir esse ajuste se observar quedas periódicas no desempenho.

- Controle o algoritmo que determina quando o `InnoDB` realiza certos tipos de escritas em segundo plano. Consulte a Seção 14.8.3.5, “Configurar o esvaziamento do pool de buffers”. O algoritmo funciona para alguns tipos de cargas de trabalho, mas não para outros, então você pode desativar essa configuração se observar quedas periódicas de desempenho.

- Aproveitando os processadores multicore e sua configuração de memória cache, para minimizar os atrasos na troca de contexto. Veja a Seção 14.8.9, “Configurando a Pesquisa de Bloqueio Spin”.

- Evite que operações únicas, como varreduras de tabelas, interfiram com os dados frequentemente acessados armazenados no cache de buffer do `InnoDB`. Veja a Seção 14.8.3.3, “Tornando a varredura do Pool de Buffer Resistente”.

- Ajustar os arquivos de registro para um tamanho que faça sentido para a confiabilidade e a recuperação de falhas. Os arquivos de registro do `InnoDB` muitas vezes foram mantidos pequenos para evitar tempos de inicialização longos após uma falha. As otimizações introduzidas no MySQL 5.5 aceleram certos passos do processo de recuperação de falhas. Em particular, a varredura do log redo e a aplicação do log redo são mais rápidas devido a algoritmos aprimorados para gerenciamento de memória. Se você manteve seus arquivos de registro artificialmente pequenos para evitar tempos de inicialização longos, agora você pode considerar aumentar o tamanho do arquivo de registro para reduzir o I/O que ocorre devido ao reciclagem de registros do log redo.

- Configurar o tamanho e o número de instâncias do pool de buffer do `InnoDB`, especialmente importante para sistemas com pools de buffer de vários gigabytes. Veja a Seção 14.8.3.2, “Configurando múltiplas instâncias de pool de buffer”.

- Aumentar o número máximo de transações simultâneas, o que melhora drasticamente a escalabilidade para os bancos de dados mais movimentados. Veja a Seção 14.6.7, "Logs de Anulação".

- Mova as operações de purga em segundo plano (um tipo de coleta de lixo) para uma thread de segundo plano. Consulte a Seção 14.8.10, “Configuração de Purga”. Para medir efetivamente os resultados dessa configuração, ajuste primeiro as outras configurações relacionadas ao I/O e ao thread.

- Reduzir a quantidade de alternância que o `InnoDB` faz entre os threads concorrentes, para que as operações SQL em um servidor ocupado não fiquem na fila e não forme um "congestionamento de tráfego". Defina um valor para a opção `innodb_thread_concurrency`, até aproximadamente 32 para um sistema moderno de alta potência. Aumente o valor para a opção `innodb_concurrency_tickets`, geralmente para cerca de 5000. Essa combinação de opções define um limite para o número de threads que o `InnoDB` processa de cada vez e permite que cada thread faça um trabalho substancial antes de ser substituído, para que o número de threads em espera permaneça baixo e as operações possam ser concluídas sem alternância excessiva de contexto.
