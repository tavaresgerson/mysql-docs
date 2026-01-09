#### 7.4.2.4 Tipos de Filtro de Log de Erros

A configuração do log de erros normalmente inclui um componente de filtro de log e um ou mais componentes de canal de saída de log. Para o filtro de log de erros, o MySQL oferece uma escolha de componentes:

* `log_filter_internal`: Este componente de filtro fornece o filtro de log de erros com base na prioridade do evento de log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. `log_filter_internal` é integrado e ativado por padrão. Veja a Seção 7.4.2.5, “Filtro de Log de Erros Baseado em Prioridade (log_filter_internal”)”).

* `log_filter_dragnet`: Este componente de filtro fornece o filtro de log de erros com base em regras fornecidas pelo usuário, em combinação com a variável de sistema `dragnet.log_error_filter_rules`. Veja a Seção 7.4.2.6, “Filtro de Log de Erros Baseado em Regras (log_filter_dragnet”)”).