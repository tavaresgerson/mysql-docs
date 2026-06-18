#### 26.4.4.14 O Procedure ps_setup_save()

Salva a configuração atual do Performance Schema. Isso permite que você altere a configuration temporariamente para fins de debugging ou outros propósitos, e então a restaure ao estado anterior invocando o `Procedure ps_setup_reload_saved()`.

Para prevenir outras chamadas simultâneas para salvar a configuration, o `Procedure ps_setup_save()` adquire um advisory lock chamado `sys.ps_setup_save` através da chamada da função `GET_LOCK()`. O `Procedure ps_setup_save()` aceita um parâmetro de timeout para indicar quantos segundos deve esperar caso o lock já exista (o que indica que alguma outra session tem uma configuração salva pendente). Se o timeout expirar sem obter o lock, o `Procedure ps_setup_save()` falha.

Pretende-se que você chame o `Procedure ps_setup_reload_saved()` posteriormente dentro da *mesma* session do `Procedure ps_setup_save()`, pois a configuração é salva em `TEMPORARY` tables. O `Procedure ps_setup_save()` descarta as temporary tables e libera o lock. Se você encerrar sua session sem invocar o `Procedure ps_setup_save()`, as tables e o lock desaparecem automaticamente.

Este procedure desabilita o binary logging durante sua execução manipulando o valor da session da system variable `sql_log_bin`. Essa é uma operação restrita, portanto, o procedure requer privilégios suficientes para definir restricted session variables. Consulte a Seção 5.1.8.1, “Privilégios de System Variables”.

##### Parâmetros

* `in_timeout INT`: Quantos segundos esperar para obter o lock `sys.ps_setup_save`. Um valor de timeout negativo significa timeout infinito.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_save(10);

... make Performance Schema configuration changes ...

mysql> CALL sys.ps_setup_reload_saved();
```