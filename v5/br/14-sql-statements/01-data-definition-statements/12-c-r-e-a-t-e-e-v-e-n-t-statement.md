### 13.1.12 Instrução CREATE EVENT

```sql
CREATE
    [DEFINER = user]
    EVENT
    [IF NOT EXISTS]
    event_name
    ON SCHEDULE schedule
    [ON COMPLETION [NOT] PRESERVE]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    DO event_body;

schedule: {
    AT timestamp [+ INTERVAL interval] ...
  | EVERY interval
    [STARTS timestamp [+ INTERVAL interval] ...]
    [ENDS timestamp [+ INTERVAL interval] ...]
}

interval:
    quantity {YEAR | QUARTER | MONTH | DAY | HOUR | MINUTE |
              WEEK | SECOND | YEAR_MONTH | DAY_HOUR | DAY_MINUTE |
              DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND}
```

Esta instrução cria e agenda um novo *event*. O *event* não é executado a menos que o Event Scheduler esteja habilitado. Para obter informações sobre como verificar o status do Event Scheduler e habilitá-lo, se necessário, consulte [Section 23.4.2, “Event Scheduler Configuration”](events-configuration.html "23.4.2 Event Scheduler Configuration").

[`CREATE EVENT`] requer o privilégio [`EVENT`] para o *schema* no qual o *event* deve ser criado. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido em [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").

Os requisitos mínimos para uma instrução [`CREATE EVENT`] válida são os seguintes:

* As palavras-chave [`CREATE EVENT`] mais um nome de *event*, que identifica o *event* de forma exclusiva em um *schema* de Database.

* Uma cláusula `ON SCHEDULE`, que determina quando e com que frequência o *event* é executado.

* Uma cláusula [`DO`], que contém a instrução SQL a ser executada por um *event*.

Este é um exemplo de uma instrução [`CREATE EVENT`] mínima:

```sql
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A instrução anterior cria um *event* chamado `myevent`. Este *event* é executado uma única vez — uma hora após a sua criação — ao executar uma instrução SQL que incrementa o valor da coluna `mycol` da tabela `myschema.mytable` em 1.

O *`event_name`* deve ser um identificador MySQL válido com um comprimento máximo de 64 caracteres. Os nomes de *events* não diferenciam maiúsculas de minúsculas (*case-sensitive*), então você não pode ter dois *events* chamados `myevent` e `MyEvent` no mesmo *schema*. Em geral, as regras que regem os nomes de *events* são as mesmas que as para nomes de stored routines. Consulte [Section 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names").

Um *event* é associado a um *schema*. Se nenhum *schema* for indicado como parte do *`event_name`*, o *schema* padrão (atual) é assumido. Para criar um *event* em um *schema* específico, qualifique o nome do *event* com um *schema* usando a sintaxe `schema_name.event_name`.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar os privilégios de acesso no momento da execução do *event*. Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, [`CURRENT_USER`], ou [`CURRENT_USER()`]. Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido em [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control"). Consulte também essa seção para obter informações adicionais sobre segurança de *event*.

Se a cláusula `DEFINER` for omitida, o *definer* padrão é o usuário que executa a instrução [`CREATE EVENT`]. Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

Dentro do corpo de um *event*, a função [`CURRENT_USER`] retorna a conta usada para verificar privilégios no momento da execução do *event*, que é o usuário `DEFINER`. Para obter informações sobre auditoria de usuários em *events*, consulte [Section 6.2.18, “SQL-Based Account Activity Auditing”](account-activity-auditing.html "6.2.18 SQL-Based Account Activity Auditing").

`IF NOT EXISTS` tem o mesmo significado para [`CREATE EVENT`] que para [`CREATE TABLE`]: Se um *event* chamado *`event_name`* já existir no mesmo *schema*, nenhuma ação é tomada e nenhum *error* resulta. (No entanto, um *warning* é gerado nesses casos.)

A cláusula `ON SCHEDULE` determina quando, com que frequência e por quanto tempo o *`event_body`* definido para o *event* se repete. Esta cláusula assume uma de duas formas:

* `AT timestamp` é usado para um *event* de execução única. Ele especifica que o *event* é executado apenas uma vez na data e hora fornecidas por *`timestamp`*, que deve incluir tanto a data quanto a hora, ou deve ser uma expressão que resolva para um valor *datetime*. Você pode usar um valor do tipo [`DATETIME`] ou [`TIMESTAMP`] para essa finalidade. Se a data estiver no passado, ocorre um *warning*, conforme mostrado aqui:

  ```sql
  mysql> SELECT NOW();
  +---------------------+
  | NOW()               |
  +---------------------+
  | 2006-02-10 23:59:01 |
  +---------------------+
  1 row in set (0.04 sec)

  mysql> CREATE EVENT e_totals
      ->     ON SCHEDULE AT '2006-02-10 23:59:00'
      ->     DO INSERT INTO test.totals VALUES (NOW());
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1588
  Message: Event execution time is in the past and ON COMPLETION NOT
           PRESERVE is set. The event was dropped immediately after
           creation.
  ```

  Instruções [`CREATE EVENT`] que são inválidas por si mesmas — por qualquer motivo — falham com um *error*.

  Você pode usar [`CURRENT_TIMESTAMP`] para especificar a data e hora atuais. Nesse caso, o *event* age assim que é criado.

  Para criar um *event* que ocorra em algum momento no futuro em relação à data e hora atuais — como o expresso pela frase “três semanas a partir de agora” — você pode usar a cláusula opcional `+ INTERVAL interval`. A porção *`interval`* consiste em duas partes, uma quantidade e uma unidade de tempo, e segue as regras de sintaxe descritas em [Temporal Intervals](expressions.html#temporal-intervals "Temporal Intervals"), exceto que você não pode usar nenhuma palavra-chave de unidade que envolva microssegundos ao definir um *event*. Com alguns tipos de *interval*, unidades de tempo complexas podem ser usadas. Por exemplo, “dois minutos e dez segundos” pode ser expresso como `+ INTERVAL '2:10' MINUTE_SECOND`.

  Você também pode combinar *intervals*. Por exemplo, `AT CURRENT_TIMESTAMP + INTERVAL 3 WEEK + INTERVAL 2 DAY` é equivalente a “três semanas e dois dias a partir de agora”. Cada porção de tal cláusula deve começar com `+ INTERVAL`.

* Para repetir ações em um *interval* regular, use uma cláusula `EVERY`. A palavra-chave `EVERY` é seguida por um *`interval`* conforme descrito na discussão anterior sobre a palavra-chave `AT`. (`+ INTERVAL` *não* é usado com `EVERY`.) Por exemplo, `EVERY 6 WEEK` significa “a cada seis semanas”.

  Embora as cláusulas `+ INTERVAL` não sejam permitidas em uma cláusula `EVERY`, você pode usar as mesmas unidades de tempo complexas permitidas em um `+ INTERVAL`.

  Uma cláusula `EVERY` pode conter uma cláusula `STARTS` opcional. `STARTS` é seguido por um valor *`timestamp`* que indica quando a ação deve começar a se repetir, e também pode usar `+ INTERVAL interval` para especificar uma quantidade de tempo “a partir de agora”. Por exemplo, `EVERY 3 MONTH STARTS CURRENT_TIMESTAMP + INTERVAL 1 WEEK` significa “a cada três meses, começando daqui a uma semana”. Da mesma forma, você pode expressar “a cada duas semanas, começando daqui a seis horas e quinze minutos” como `EVERY 2 WEEK STARTS CURRENT_TIMESTAMP + INTERVAL '6:15' HOUR_MINUTE`. Não especificar `STARTS` é o mesmo que usar `STARTS CURRENT_TIMESTAMP` — ou seja, a ação especificada para o *event* começa a se repetir imediatamente após a criação do *event*.

  Uma cláusula `EVERY` pode conter uma cláusula `ENDS` opcional. A palavra-chave `ENDS` é seguida por um valor *`timestamp`* que informa ao MySQL quando o *event* deve parar de se repetir. Você também pode usar `+ INTERVAL interval` com `ENDS`; por exemplo, `EVERY 12 HOUR STARTS CURRENT_TIMESTAMP + INTERVAL 30 MINUTE ENDS CURRENT_TIMESTAMP + INTERVAL 4 WEEK` é equivalente a “a cada doze horas, começando trinta minutos a partir de agora, e terminando daqui a quatro semanas”. Não usar `ENDS` significa que o *event* continua executando indefinidamente.

  `ENDS` suporta a mesma sintaxe para unidades de tempo complexas que `STARTS`.

  Você pode usar `STARTS`, `ENDS`, ambos, ou nenhum em uma cláusula `EVERY`.

  Se um *event* repetitivo não terminar dentro do seu *interval* de agendamento, o resultado pode ser múltiplas instâncias do *event* executando simultaneamente. Se isso for indesejável, você deve instituir um mecanismo para prevenir instâncias simultâneas. Por exemplo, você poderia usar a função [`GET_LOCK()`], ou *locking* de linha ou de tabela.

A cláusula `ON SCHEDULE` pode usar expressões envolvendo funções MySQL built-in e variáveis de usuário para obter qualquer um dos valores *`timestamp`* ou *`interval`* que ela contém. Você não pode usar *stored functions* ou *loadable functions* em tais expressões, nem pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as instruções [`CREATE EVENT`] quanto para [`ALTER EVENT`]. Referências a *stored functions*, *loadable functions* e tabelas em tais casos são especificamente não permitidas e falham com um *error* (veja Bug #22830).

Os tempos na cláusula `ON SCHEDULE` são interpretados usando o valor [`time_zone`] da sessão atual. Isso se torna o *event time zone*; ou seja, o *time zone* que é usado para o agendamento do *event* e que está em vigor dentro do *event* enquanto ele executa. Esses tempos são convertidos para UTC e armazenados junto com o *event time zone* na tabela `mysql.event`. Isso permite que a execução do *event* prossiga conforme definido, independentemente de quaisquer mudanças subsequentes no *time zone* do server ou efeitos de horário de verão (*daylight saving time*). Para informações adicionais sobre a representação dos tempos de *event*, consulte [Section 23.4.4, “Event Metadata”](events-metadata.html "23.4.4 Event Metadata"). Consulte também [Section 13.7.5.18, “SHOW EVENTS Statement”](show-events.html "13.7.5.18 SHOW EVENTS Statement") e [Section 24.3.8, “The INFORMATION_SCHEMA EVENTS Table”](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table").

Normalmente, uma vez que um *event* expira, ele é imediatamente *dropped* (removido). Você pode substituir esse comportamento especificando `ON COMPLETION PRESERVE`. Usar `ON COMPLETION NOT PRESERVE` apenas torna explícito o comportamento padrão não persistente.

Você pode criar um *event* mas impedir que ele esteja ativo usando a palavra-chave `DISABLE`. Alternativamente, você pode usar `ENABLE` para tornar explícito o status padrão, que é ativo. Isso é mais útil em conjunto com [`ALTER EVENT`] (consulte [Section 13.1.2, “ALTER EVENT Statement”](alter-event.html "13.1.2 ALTER EVENT Statement")).

Um terceiro valor também pode aparecer no lugar de `ENABLE` ou `DISABLE`; `DISABLE ON SLAVE` é definido para o status de um *event* em uma réplica para indicar que o *event* foi criado na origem (*source*) e replicado para a réplica, mas não é executado na réplica. Consulte [Section 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

Você pode fornecer um *comment* para um *event* usando uma cláusula `COMMENT`. *`comment`* pode ser qualquer *string* de até 64 caracteres que você deseja usar para descrever o *event*. O texto do *comment*, sendo um literal de *string*, deve ser cercado por aspas.

A cláusula [`DO`] especifica uma ação realizada pelo *event* e consiste em uma instrução SQL. Quase qualquer instrução MySQL válida que possa ser usada em uma *stored routine* também pode ser usada como a instrução de ação para um *event* agendado. (Consulte [Section 23.8, “Restrictions on Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").) Por exemplo, o seguinte *event* `e_hourly` exclui todas as linhas da tabela `sessions` uma vez por hora, onde esta tabela faz parte do *schema* `site_activity`:

```sql
CREATE EVENT e_hourly
    ON SCHEDULE
      EVERY 1 HOUR
    COMMENT 'Clears out sessions table each hour.'
    DO
      DELETE FROM site_activity.sessions;
```

O MySQL armazena a configuração da variável de sistema [`sql_mode`] em vigor quando um *event* é criado ou alterado e sempre executa o *event* com essa configuração em vigor, *independentemente do SQL mode atual do server quando o event começa a ser executado*.

Uma instrução [`CREATE EVENT`] que contém uma instrução [`ALTER EVENT`] em sua cláusula [`DO`] parece ser bem-sucedida; no entanto, quando o *server* tenta executar o *event* agendado resultante, a execução falha com um *error*.

Note

Instruções como [`SELECT`] ou [`SHOW`] que apenas retornam um *result set* não têm efeito quando usadas em um *event*; a saída delas não é enviada para o MySQL Monitor, nem é armazenada em lugar nenhum. No entanto, você pode usar instruções como [`SELECT ... INTO`] e [`INSERT INTO ... SELECT`] que armazenam um resultado. (Veja o próximo exemplo nesta seção para uma instância deste último.)

O *schema* ao qual um *event* pertence é o *schema* padrão para referências de tabela na cláusula [`DO`]. Quaisquer referências a tabelas em outros *schemas* devem ser qualificadas com o nome do *schema* apropriado.

Assim como em *stored routines*, você pode usar a sintaxe de *compound-statement* na cláusula [`DO`] usando as palavras-chave `BEGIN` e `END`, conforme mostrado aqui:

```sql
delimiter |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

delimiter ;
```

Este exemplo usa o comando `delimiter` para alterar o delimitador de instrução. Consulte [Section 23.1, “Defining Stored Programs”](stored-programs-defining.html "23.1 Defining Stored Programs").

*Compound statements* mais complexas, como as usadas em *stored routines*, são possíveis em um *event*. Este exemplo usa variáveis locais, um *error handler* e uma construção de controle de fluxo:

```sql
delimiter |

CREATE EVENT e
    ON SCHEDULE
      EVERY 5 SECOND
    DO
      BEGIN
        DECLARE v INTEGER;
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;

        SET v = 0;

        WHILE v < 5 DO
          INSERT INTO t1 VALUES (0);
          UPDATE t2 SET s1 = s1 + 1;
          SET v = v + 1;
        END WHILE;
    END |

delimiter ;
```

Não há como passar *parameters* diretamente para ou de *events*; no entanto, é possível invocar uma *stored routine* com *parameters* dentro de um *event*:

```sql
CREATE EVENT e_call_myproc
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO CALL myproc(5, 27);
```

Se o *definer* de um *event* tiver privilégios suficientes para definir variáveis de sistema globais (consulte [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges")), o *event* pode ler e escrever variáveis globais. Como a concessão de tais privilégios implica um potencial de abuso, deve-se tomar extremo cuidado ao fazê-lo.

Geralmente, quaisquer instruções válidas em *stored routines* podem ser usadas como instruções de ação executadas por *events*. Para obter mais informações sobre instruções permitidas em *stored routines*, consulte [Section 23.2.1, “Stored Routine Syntax”](stored-routines-syntax.html "23.2.1 Stored Routine Syntax"). Você pode criar um *event* como parte de uma *stored routine*, mas um *event* não pode ser criado por outro *event*.