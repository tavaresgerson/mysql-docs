### 10.5.4 Otimizando o registro de reinicialização do InnoDB

Considere as seguintes diretrizes para otimizar o registro de refazer:

- Aumente o tamanho dos arquivos de log de refazer. Quando o `InnoDB` tiver escrito os arquivos de log de refazer completos, ele deve gravar o conteúdo modificado do pool de buffers no disco em um ponto de verificação. Arquivos de log de refazer pequenos causam muitos escritos desnecessários no disco.

  A partir do MySQL 8.0.30, o tamanho do arquivo de registro de revisão é determinado pelo ajuste `innodb_redo_log_capacity`. `InnoDB` tenta manter 32 arquivos de registro de revisão do mesmo tamanho, com cada arquivo igual a 1/32 \* `innodb_redo_log_capacity`. Portanto, alterar o ajuste `innodb_redo_log_capacity` altera o tamanho dos arquivos de registro de revisão.

  Antes do MySQL 8.0.30, o tamanho e o número de arquivos de log de refazer são configurados usando as variáveis `innodb_log_file_size` e `innodb_log_files_in_group`.

  Para obter informações sobre a modificação da configuração do arquivo de log de retificação, consulte a Seção 17.6.5, “Log de retificação”.

- Considere aumentar o tamanho do buffer de log. Um buffer de log grande permite que transações grandes sejam executadas sem a necessidade de gravar o log no disco antes de as transações serem confirmadas. Portanto, se você tiver transações que atualizam, inserem ou excluem muitas linhas, aumentar o tamanho do buffer de log economiza o I/O do disco. O tamanho do buffer de log é configurado usando a opção de configuração `innodb_log_buffer_size`, que pode ser configurada dinamicamente no MySQL 8.0.

- Configure a opção de configuração `innodb_log_write_ahead_size` para evitar a opção “leitura durante a gravação”. Esta opção define o tamanho do bloco de pré-gravação para o log de refazer. Defina `innodb_log_write_ahead_size` para corresponder ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos. A leitura durante a gravação ocorre quando os blocos do log de refazer não são totalmente armazenados no cache do sistema operacional ou do sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco de pré-gravação do log de refazer e o tamanho do bloco de cache do sistema operacional ou do sistema de arquivos.

  Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco de arquivo de log `InnoDB` (2n). O valor mínimo é o tamanho do bloco de arquivo de log `InnoDB` (512). O pré-armazenamento não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor de `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que é maior que o valor de `innodb_page_size`, o ajuste `innodb_log_write_ahead_size` é truncado para o valor de `innodb_page_size`.

  Definir o valor `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos resulta em leitura-gravação. Definir o valor muito alto pode ter um pequeno impacto no desempenho do `fsync` para gravações de arquivos de log devido a vários blocos serem escritos de uma só vez.

- O MySQL 8.0.11 introduziu threads dedicados para gravação de registros de log redo, permitindo que esses registros sejam escritos do buffer de log para os buffers do sistema e que os buffers do sistema sejam descarregados nos arquivos de log redo. Anteriormente, essas tarefas eram realizadas por threads individuais de usuários. A partir do MySQL 8.0.22, você pode habilitar ou desabilitar threads de gravação de log usando a variável `innodb_log_writer_threads`. Threads dedicados para gravação de log podem melhorar o desempenho em sistemas de alta concorrência, mas, para sistemas de baixa concorrência, desabilitar threads dedicados para gravação de log oferece um melhor desempenho.

- Otimize o uso do atraso de rotação por threads do usuário aguardando o refazer esvaziado. O atraso de rotação ajuda a reduzir a latência. Durante períodos de baixa concorrência, reduzir a latência pode não ser uma prioridade tão grande, e evitar o uso do atraso de rotação durante esses períodos pode reduzir o consumo de energia. Durante períodos de alta concorrência, você pode querer evitar gastar poder de processamento no atraso de rotação para que ele possa ser usado para outros trabalhos. As seguintes variáveis de sistema permitem definir valores de linha de água altos e baixos que definem limites para o uso do atraso de rotação.

  - `innodb_log_wait_for_flush_spin_hwm`: Define o tempo médio máximo de esvaziamento do log, após o qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. O valor padrão é de 400 microsegundos.

  - `innodb_log_spin_cpu_abs_lwm`: Define o valor mínimo de uso da CPU abaixo do qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. O valor é expresso como a soma do uso de núcleos da CPU. Por exemplo, o valor padrão de 80 é 80% de um único núcleo da CPU. Em um sistema com um processador multi-core, um valor de 150 representa 100% de uso de um núcleo da CPU mais 50% de uso de um segundo núcleo da CPU.

  - `innodb_log_spin_cpu_pct_hwm`: Define o valor máximo de uso da CPU acima do qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado. O valor é expresso como uma porcentagem do poder de processamento total combinado de todos os núcleos da CPU. O valor padrão é de 50%. Por exemplo, o uso de 100% de dois núcleos da CPU é de 50% do poder de processamento da CPU combinado em um servidor com quatro núcleos da CPU.

    A opção de configuração `innodb_log_spin_cpu_pct_hwm` respeita a afinidade do processador. Por exemplo, se um servidor tiver 48 núcleos, mas o processo **mysqld** estiver vinculado a apenas quatro núcleos da CPU, os outros 44 núcleos da CPU serão ignorados.
