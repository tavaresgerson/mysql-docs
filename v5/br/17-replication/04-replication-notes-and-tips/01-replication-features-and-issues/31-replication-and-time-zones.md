#### 16.4.1.31 Replication e Time Zones

Por padrão, servidores Source e Replica assumem que estão no mesmo time zone. Se você estiver realizando Replication entre servidores em diferentes time zones, o time zone deve ser configurado tanto no Source quanto no Replica. Caso contrário, comandos que dependem da hora local no Source não são replicados corretamente, como comandos que usam as funções [`NOW()`](date-and-time-functions.html#function_now) ou [`FROM_UNIXTIME()`](date-and-time-functions.html#function_from-unixtime).

Verifique se a sua combinação de configurações para o system time zone ([`system_time_zone`](server-system-variables.html#sysvar_system_time_zone)), o time zone atual do servidor (o valor global de [`time_zone`](server-system-variables.html#sysvar_time_zone)) e os time zones por Session (o valor de Session de [`time_zone`](server-system-variables.html#sysvar_time_zone)) no Source e no Replica está produzindo os resultados corretos. Em particular, se a variável de sistema [`time_zone`](server-system-variables.html#sysvar_time_zone) estiver configurada com o valor `SYSTEM`, indicando que o time zone do servidor é o mesmo que o system time zone, isso pode fazer com que o Source e o Replica apliquem diferentes time zones. Por exemplo, um Source pode gravar o seguinte comando no Binary Log:

```sql
SET @@session.time_zone='SYSTEM';
```

Se este Source e seu Replica tiverem uma configuração diferente para seus system time zones, este comando pode produzir resultados inesperados no Replica, mesmo que o valor global de [`time_zone`](server-system-variables.html#sysvar_time_zone) do Replica tenha sido configurado para coincidir com o do Source. Para uma explicação das configurações de time zone do MySQL Server e como alterá-las, consulte [Seção 5.1.13, “Suporte a Time Zone do MySQL Server”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

Veja também [Seção 16.4.1.15, “Replication e System Functions”](replication-features-functions.html "16.4.1.15 Replication and System Functions").