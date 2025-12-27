### 17.5.4 Buffer de Log

O buffer de log é a área de memória que armazena os dados a serem escritos nos arquivos de log no disco. O tamanho do buffer de log é definido pela variável `innodb_log_buffer_size`. O tamanho padrão é de 64 MB. O conteúdo do buffer de log é periodicamente descarregado no disco. Um buffer de log grande permite que transações grandes sejam executadas sem a necessidade de escrever dados do log de refazer no disco antes do commit das transações. Assim, se você tiver transações que atualizam, inserem ou excluem muitas linhas, aumentar o tamanho do buffer de log economiza o I/O no disco.

A variável `innodb_flush_log_at_trx_commit` controla como o conteúdo do buffer de log é escrito e descarregado no disco. A variável `innodb_flush_log_at_timeout` controla a frequência de descarregamento do log.

Para informações relacionadas, consulte Configuração de Memória e Seção 10.5.4, “Otimizando o Registro de Redo do InnoDB”.