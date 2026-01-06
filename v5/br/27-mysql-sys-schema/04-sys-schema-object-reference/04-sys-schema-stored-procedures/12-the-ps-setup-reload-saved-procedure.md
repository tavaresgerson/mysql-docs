#### 26.4.4.12 O procedimento ps\_setup\_reload\_saved()

Recarrega uma configuração do Schema de Desempenho salva anteriormente na mesma sessão usando o procedimento `ps_setup_save()`. Para mais informações, consulte a descrição do procedimento `ps_setup_save()`).

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

##### Parâmetros

Nenhum.
