#### 30.4.4.12 O procedimento ps_setup_reload_saved()

Recarrega a configuração do Schema de Desempenho salva anteriormente na mesma sessão usando o procedimento `ps_setup_save()"`). Para mais informações, consulte a descrição do procedimento `ps_setup_save()"`).

Este procedimento desabilita o registro binário durante sua execução manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

##### Parâmetros

Nenhum.