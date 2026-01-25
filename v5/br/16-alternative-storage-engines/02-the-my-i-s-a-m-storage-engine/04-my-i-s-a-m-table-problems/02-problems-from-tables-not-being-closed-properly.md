#### 15.2.4.2 Problemas Causados por Tabelas Não Fechadas Corretamente

Cada arquivo de Index `MyISAM` (arquivo `.MYI`) possui um counter no header que pode ser usado para verificar se uma table foi fechada corretamente. Se você receber o seguinte aviso do `CHECK TABLE` ou do **myisamchk**, isso significa que este counter ficou dessincronizado:

```sql
clients are using or haven't closed the table properly
```

Este aviso não significa necessariamente que a table esteja corrompida, mas você deve, pelo menos, verificar a table.

O counter funciona da seguinte forma:

* Na primeira vez que uma table é atualizada no MySQL, um counter no header dos Index files é incrementado.

* O counter não é alterado durante atualizações subsequentes.
* Quando a última instância de uma table é fechada (porque uma operação `FLUSH TABLES` foi executada ou porque não há espaço no cache da table), o counter é decrementado se a table tiver sido atualizada em algum momento.

* Quando você realiza o repair da table ou o check da table e ela é considerada OK, o counter é zerado.

* Para evitar problemas de interação com outros processos que possam verificar a table, o counter não é decrementado ao fechar se ele já estava zero.

Em outras palavras, o counter pode se tornar incorreto apenas sob estas condições:

* Uma table `MyISAM` é copiada sem antes emitir `LOCK TABLES` e `FLUSH TABLES`.

* O MySQL travou (crashed) entre uma atualização e o fechamento final. (A table pode ainda estar OK porque o MySQL sempre emite writes para tudo entre cada statement.)

* Uma table foi modificada por **myisamchk --recover** ou **myisamchk --update-state** ao mesmo tempo em que estava em uso pelo **mysqld**.

* Múltiplos servers **mysqld** estão usando a table, e um server executou um `REPAIR TABLE` ou `CHECK TABLE` na table enquanto ela estava em uso por outro server. Nesta configuração, é seguro usar `CHECK TABLE`, embora você possa receber o aviso de outros servers. No entanto, `REPAIR TABLE` deve ser evitado, porque quando um server substitui o data file por um novo, isso não é do conhecimento dos outros servers.

  Em geral, é uma má ideia compartilhar um data directory entre múltiplos servers. Consulte a Seção 5.7, “Running Multiple MySQL Instances on One Machine”, para discussão adicional.