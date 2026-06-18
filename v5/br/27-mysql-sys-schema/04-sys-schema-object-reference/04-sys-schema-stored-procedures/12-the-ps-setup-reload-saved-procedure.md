#### 26.4.4.12 O Procedure ps_setup_reload_saved()

Recarrega uma configuração do Performance Schema salva anteriormente dentro da mesma session usando o `ps_setup_save() Procedure`). Para mais informações, veja a descrição do `ps_setup_save() Procedure`).

Este procedure desabilita o binary logging durante sua execução ao manipular o valor de session da system variable `sql_log_bin`. Essa é uma operação restrita, portanto, o procedure requer privileges suficientes para definir system variables de session restritas. Veja a Seção 5.1.8.1, “System Variable Privileges”.

##### Parâmetros

Nenhum.