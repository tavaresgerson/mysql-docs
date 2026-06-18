#### 30.4.4.14 O procedimento ps\_setup\_save()

Salva a configuração atual do Schema de Desempenho. Isso permite que você altere a configuração temporariamente para depuração ou outros fins, e depois a restaure ao estado anterior, invocando o procedimento `ps_setup_reload_saved()`".

Para evitar outras chamadas simultâneas para salvar a configuração, o procedimento `ps_setup_save()` ("Obter bloqueio") adquire um bloqueio de aconselhamento chamado `sys.ps_setup_save` ao chamar a função `GET_LOCK()`. O procedimento `ps_setup_save()` ("Obter bloqueio") recebe um parâmetro de tempo de espera para indicar quantos segundos esperar se o bloqueio já existir (o que indica que outra sessão tem uma configuração salva pendente). Se o tempo de espera expirar sem obter o bloqueio, o procedimento `ps_setup_save()` ("Obter bloqueio") falha.

É intencional que você chame o procedimento `ps_setup_reload_saved()`") mais tarde na *mesma* sessão do procedimento `ps_setup_save()`") porque a configuração é salva nas tabelas `TEMPORARY`". O procedimento `ps_setup_save()`") exclui as tabelas temporárias e libera o bloqueio. Se você encerrar a sessão sem invocar o procedimento `ps_setup_save()`"), as tabelas e o bloqueio desaparecerão automaticamente.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

##### Parâmetros

- `in_timeout INT`: Quantos segundos esperar para obter o bloqueio `sys.ps_setup_save`. Um valor de tempo de espera negativo significa tempo de espera infinito.

##### Exemplo

```
mysql> CALL sys.ps_setup_save(10);

... make Performance Schema configuration changes ...

mysql> CALL sys.ps_setup_reload_saved();
```
