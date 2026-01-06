#### 16.4.1.31 Replicação e Fuso Horários

Por padrão, os servidores de origem e replica assumem que estão na mesma zona horária. Se você estiver replicando entre servidores em diferentes zonas horárias, a zona horária deve ser definida tanto no servidor de origem quanto no servidor de replica. Caso contrário, as declarações que dependem da hora local no servidor de origem não serão replicadas corretamente, como as declarações que usam as funções `NOW()` ou `FROM_UNIXTIME()`.

Verifique se a combinação de configurações do fuso horário do sistema (`system_time_zone`), o fuso horário atual do servidor (o valor global de `time_zone`) e os fusos horários por sessão (o valor de sessão de `time_zone`) na fonte e na replica estão produzindo os resultados corretos. Em particular, se a variável de sistema `time_zone` estiver definida como `SYSTEM`, indicando que o fuso horário do servidor é o mesmo do fuso horário do sistema, isso pode fazer com que a fonte e a replica apliquem fusos horários diferentes. Por exemplo, uma fonte pode escrever a seguinte declaração no log binário:

```sql
SET @@session.time_zone='SYSTEM';
```

Se essa fonte e sua réplica tiverem configurações diferentes para seus fusos horários do sistema, essa declaração pode produzir resultados inesperados na réplica, mesmo que o valor global do `time_zone` da réplica tenha sido ajustado para corresponder ao da fonte. Para uma explicação sobre as configurações de fuso horário do MySQL Server e como alterá-las, consulte Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

Veja também Seção 16.4.1.15, “Replicação e Funções do Sistema”.
