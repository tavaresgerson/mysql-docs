#### 7.4.2.4 Tipos de filtragem do log de erros

A configuração do log de erro normalmente inclui um componente de filtro de log e um ou mais componentes de destino de log. Para a filtragem do log de erro, o MySQL oferece uma escolha de componentes:

- `log_filter_internal`: Este componente de filtro fornece filtragem de log de erros com base na prioridade do evento de log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. `log_filter_internal` está integrado e ativado por padrão. Veja a Seção 7.4.2.5, “Filtragem de Log de Erros Baseada em Prioridade (log\_filter\_internal)”.

- `log_filter_dragnet`: Este componente de filtro fornece filtragem de log de erros com base em regras fornecidas pelo usuário, em combinação com a variável de sistema `dragnet.log_error_filter_rules`. Consulte a Seção 7.4.2.6, “Filtragem de Log de Erros Baseada em Regras (log\_filter\_dragnet)”.
