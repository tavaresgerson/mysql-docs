### 10.5.9 Otimizando as Variáveis de Configuração do InnoDB

Diferentes configurações funcionam melhor para servidores com cargas leves e previsíveis, em comparação com servidores que estão funcionando com quase toda a capacidade ou que experimentam picos de alta atividade.

Como o motor de armazenamento `InnoDB` realiza muitas de suas otimizações automaticamente, muitas tarefas de ajuste de desempenho envolvem monitoramento para garantir que o banco de dados esteja funcionando bem e alterar as opções de configuração quando o desempenho cair. Consulte a Seção 17.16, “Integração InnoDB com o Schema de Desempenho do MySQL” para obter informações sobre o monitoramento detalhado do desempenho do `InnoDB`.

Os principais passos de configuração que você pode realizar incluem:

* Controlar os tipos de operações de mudança de dados para as quais o `InnoDB` armazena os dados alterados, para evitar escritas frequentes de pequenos discos. Consulte Configurando o Armazenamento de Mudanças. Ativação do armazenamento de mudanças pode proporcionar melhor desempenho em cargas de trabalho dependentes de I/O, mas pode causar problemas durante a recuperação, carga em massa ou durante o redimensionamento do pool de buffers. Desativá-lo (padrão a partir do MySQL 8.4) ajuda a garantir a estabilidade, mesmo que possa reduzir o desempenho.

* Acionar e desativar a funcionalidade de indexação hash adaptativa usando a opção `innodb_adaptive_hash_index`. Consulte a Seção 17.5.3, “Índice Hash Adaptativo” para obter mais informações. Você pode alterar essa configuração durante períodos de atividade incomum, e depois restaurá-la para a configuração original.

* Definir um limite para o número de threads concorrentes que o `InnoDB` processa, se a troca de contexto for um gargalo. Consulte a Seção 17.8.4, “Configurando a Concorrência de Threads para o InnoDB”.

* Controlar a quantidade de prefetching que o `InnoDB` faz com suas operações de leitura à frente. Quando o sistema tem capacidade de E/S não utilizada, mais leituras à frente podem melhorar o desempenho das consultas. Muito leitura à frente pode causar quedas periódicas de desempenho em um sistema com alta carga. Veja a Seção 17.8.3.4, “Configurando o Prefetching do Pool de Buffer do InnoDB (Leitura à Frente”)”).

* Aumentar o número de threads de segundo plano para operações de leitura ou escrita, se você tiver um subsistema de E/S de ponta que não é totalmente utilizado pelos valores padrão. Veja a Seção 17.8.5, “Configurando o Número de Threads de E/S InnoDB de Segundo Plano”.

* Controlar quanto o `InnoDB` realiza em segundo plano. Veja a Seção 17.8.7, “Configurando a Capacidade de E/S do InnoDB”. Você pode reduzir esse ajuste se observar quedas periódicas de desempenho.

* Controlar o algoritmo que determina quando o `InnoDB` realiza certos tipos de escritas em segundo plano. Veja a Seção 17.8.3.5, “Configurando a Limpeza do Pool de Buffer”. O algoritmo funciona para alguns tipos de cargas de trabalho, mas não para outros, então você pode desabilitar essa funcionalidade se observar quedas periódicas de desempenho.

* Aproveitar os processadores multicore e sua configuração de memória cache, para minimizar os atrasos na troca de contexto. Veja a Seção 17.8.8, “Configurando a Pesquisa de Spin Lock”.

* Prevenir operações únicas, como varreduras de tabelas, de interferir com os dados frequentemente acessados armazenados no cache de buffer do `InnoDB`. Veja a Seção 17.8.3.3, “Tornando a Varredura do Pool de Buffer Resistente”.

* Ajustar os arquivos de registro para um tamanho que faça sentido para a confiabilidade e recuperação de falhas. Os arquivos de registro do `InnoDB` frequentemente foram mantidos pequenos para evitar tempos de inicialização longos após uma falha. As otimizações introduzidas no MySQL 5.5 aceleram certos passos do processo de recuperação de falhas. Em particular, a varredura do log redo e a aplicação do log redo são mais rápidas devido a algoritmos aprimorados para gerenciamento de memória. Se você manteve seus arquivos de registro artificialmente pequenos para evitar tempos de inicialização longos, agora você pode considerar aumentar o tamanho do arquivo de registro para reduzir o I/O que ocorre devido ao reciclagem de registros do log redo.

* Configurar o tamanho e o número de instâncias para o `InnoDB` buffer pool, especialmente importante para sistemas com buffer pools de vários gigabytes. Veja a Seção 17.8.3.2, “Configurando Múltiplas Instâncias de Buffer Pool”.

* Aumentar o número máximo de transações concorrentes, o que melhora drasticamente a escalabilidade para os bancos de dados mais movimentados. Veja a Seção 17.6.6, “Logs de Undo”.

* Mover as operações de purga (um tipo de coleta de lixo) para um thread de fundo. Veja a Seção 17.8.9, “Configuração de Purga”. Para medir efetivamente os resultados dessa configuração, ajuste primeiro as outras configurações relacionadas ao I/O e ao thread.

* Reduzir a quantidade de alternância que o `InnoDB` faz entre os threads concorrentes, para que as operações SQL em um servidor ocupado não fiquem na fila e não formem um "congestionamento de tráfego". Defina um valor para a opção `innodb_thread_concurrency`, até aproximadamente 32 para um sistema moderno de alta potência. Aumente o valor para a opção `innodb_concurrency_tickets`, geralmente para cerca de 5000. Essa combinação de opções define um limite para o número de threads que o `InnoDB` processa de cada vez e permite que cada thread faça um trabalho substancial antes de ser substituído, para que o número de threads em espera permaneça baixo e as operações possam ser concluídas sem alternância excessiva de contexto.