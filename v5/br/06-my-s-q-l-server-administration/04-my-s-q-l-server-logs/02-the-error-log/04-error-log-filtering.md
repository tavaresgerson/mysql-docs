#### 5.4.2.4 Filtro do Log de Erros

A variável de sistema `log_error_verbosity` controla a verbosidade do servidor para gravar mensagens de erro, aviso e nota no log de erro. Os valores permitidos são 1 (apenas erros), 2 (erros e avisos), 3 (erros, avisos e notas), com um valor padrão de 3. Se o valor for maior que 2, o servidor registra conexões abortadas e erros de acesso negado para novas tentativas de conexão. Veja Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.
