#### 19.5.1.34 Replicação e Fuso Horário

Por padrão, os servidores fonte e replica assumem que estão no mesmo fuso horário. Se você estiver replicando entre servidores em fusos horários diferentes, o fuso horário deve ser definido tanto no servidor fonte quanto no replica. Caso contrário, as declarações que dependem da hora local no servidor fonte não serão replicadas corretamente, como as declarações que usam as funções `NOW()` ou `FROM_UNIXTIME()`.

Verifique se a combinação de configurações para o fuso horário do sistema (`system_time_zone`), o fuso horário atual do servidor (o valor global de `time_zone`) e os fusos horários por sessão (o valor de sessão de `time_zone`) no servidor fonte e replica está produzindo os resultados corretos. Em particular, se a variável de sistema `time_zone` estiver definida como o valor `SYSTEM`, indicando que o fuso horário do servidor é o mesmo do fuso horário do sistema, isso pode fazer com que o servidor fonte e o replica apliquem fusos horários diferentes. Por exemplo, um servidor fonte pode escrever a seguinte declaração no log binário:

```
SET @@session.time_zone='SYSTEM';
```

Se este servidor fonte e seu replica tiverem uma configuração diferente para seus fusos horários de sistema, essa declaração pode produzir resultados inesperados no replica, mesmo que o valor global de `time_zone` do replica tenha sido definido para corresponder ao do servidor fonte. Para uma explicação sobre as configurações de fuso horário do MySQL Server e como alterá-las, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Veja também a Seção 19.5.1.14, “Replicação e Funções do Sistema”.