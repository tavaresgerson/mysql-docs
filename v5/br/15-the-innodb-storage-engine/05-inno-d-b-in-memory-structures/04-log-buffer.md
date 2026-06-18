### 14.5.4 Log Buffer

O log buffer é a área de memória que armazena dados a serem escritos nos arquivos de log no disk. O tamanho do log buffer é definido pela variável `innodb_log_buffer_size`. O tamanho padrão é de 16MB. O conteúdo do log buffer é periodicamente despejado no disk. Um log buffer grande permite que grandes transactions sejam executadas sem a necessidade de escrever dados do redo log no disk antes que as transactions façam commit. Assim, se você tem transactions que fazem update, insert ou delete de muitas linhas, aumentar o tamanho do log buffer economiza I/O de disk.

A variável `innodb_flush_log_at_trx_commit` controla como o conteúdo do log buffer é escrito e despejado no disk. A variável `innodb_flush_log_at_timeout` controla a frequência do despejo do log.

Para informações relacionadas, consulte Configuração de Memória, e Seção 8.5.4, “Otimizando o Redo Logging do InnoDB”.