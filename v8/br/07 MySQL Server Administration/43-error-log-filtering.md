#### 7.4.2.4 Tipos de filtragem do registo de erros

A configuração de log de erro normalmente inclui um componente de filtro de log e um ou mais componentes de sink de log. Para filtragem de log de erro, o MySQL oferece uma escolha de componentes:

- `log_filter_internal`: Este componente de filtro fornece filtragem de registro de erros com base na prioridade do evento de registro e no código de erro, em combinação com as variáveis do sistema `log_error_verbosity` e `log_error_suppression_list`. `log_filter_internal` é incorporado e habilitado por padrão. Veja Seção 7.4.2.5, "Filtragem de registro de erros baseada em prioridade (log\_filter\_internal) ").
- `log_filter_dragnet`: Este componente de filtro fornece filtragem de registro de erros com base em regras fornecidas pelo usuário, em combinação com a variável de sistema `dragnet.log_error_filter_rules`.
