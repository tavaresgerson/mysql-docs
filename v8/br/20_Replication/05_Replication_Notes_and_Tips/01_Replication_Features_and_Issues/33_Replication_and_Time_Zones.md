#### 19.5.1.33 Replicação e Fuso Horários

Por padrão, os servidores de origem e replica assumem que estão na mesma zona horária. Se você estiver replicando entre servidores em diferentes zonas horárias, a zona horária deve ser definida tanto no servidor de origem quanto no servidor de replica. Caso contrário, as declarações que dependem da hora local no servidor de origem não serão replicadas corretamente, como as declarações que usam as funções `NOW()` ou `FROM_UNIXTIME()`.

Verifique se a combinação de configurações do fuso horário do sistema (`system_time_zone`), do fuso horário do servidor atual (o valor global de `time_zone`) e dos fusos horários por sessão (o valor da sessão de `time_zone`) na fonte e na replica estão produzindo os resultados corretos. Em particular, se a variável de sistema `time_zone` estiver definida para o valor `SYSTEM`, indicando que o fuso horário do servidor é o mesmo do fuso horário do sistema, isso pode fazer com que a fonte e a replica apliquem fusos horários diferentes. Por exemplo, uma fonte pode escrever a seguinte declaração no log binário:

```
SET @@session.time_zone='SYSTEM';
```

Se essa fonte e sua réplica tiverem configurações diferentes para seus fusos horários do sistema, essa declaração pode produzir resultados inesperados na réplica, mesmo que o valor global `time_zone` da réplica tenha sido configurado para corresponder ao da fonte. Para uma explicação sobre as configurações de fuso horário do MySQL Server e como configurá-las, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Veja também a Seção 19.5.1.14, “Replicação e Funções do Sistema”.
