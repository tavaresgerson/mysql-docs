### 15.1.13 Declaração de Criação de Evento

```
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

Essa declaração cria e agende um novo evento. O evento não será executado a menos que o Agendamento de Eventos esteja habilitado. Para obter informações sobre como verificar o status do Agendamento de Eventos e habilitá-lo, se necessário, consulte a Seção 27.4.2, “Configuração do Agendamento de Eventos”.

`CREATE EVENT` exige o privilégio `EVENT` para o esquema no qual o evento deve ser criado. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor `user`, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”.

Os requisitos mínimos para uma declaração válida `CREATE EVENT` são os seguintes:

- As palavras-chave `CREATE EVENT` mais o nome de um evento, que identifica de forma única o evento em um esquema de banco de dados.

- Uma cláusula `ON SCHEDULE`, que determina quando e com que frequência o evento é executado.

- Uma cláusula `DO`, que contém a instrução SQL a ser executada por um evento.

Este é um exemplo de uma declaração mínima `CREATE EVENT`:

```
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A declaração anterior cria um evento chamado `myevent`. Esse evento é executado uma vez — uma hora após sua criação — executando uma instrução SQL que incrementa o valor da coluna `mycol` da tabela `myschema.mytable` em 1.

O `event_name` deve ser um identificador válido do MySQL com um comprimento máximo de 64 caracteres. Os nomes dos eventos não são sensíveis ao caso, portanto, não é possível ter dois eventos com os nomes `myevent` e `MyEvent` no mesmo esquema. Em geral, as regras que regem os nomes dos eventos são as mesmas que as que regem os nomes das rotinas armazenadas. Veja a Seção 11.2, “Nomes de Objetos do Esquema”.

Um evento está associado a um esquema. Se nenhum esquema for indicado como parte de `event_name`, o esquema padrão (atual) é assumido. Para criar um evento em um esquema específico, qualifique o nome do evento com um esquema usando a sintaxe `schema_name.event_name`.

A cláusula `DEFINER` especifica a conta do MySQL a ser usada ao verificar os privilégios de acesso no momento da execução do evento. Se a cláusula `DEFINER` estiver presente, o valor de `user` deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores permitidos de `user` dependem dos privilégios que você possui, conforme discutido na Seção 27.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança do evento.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a instrução `CREATE EVENT`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro do corpo de um evento, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da execução do evento, que é o usuário `DEFINER`. Para obter informações sobre auditoria de usuários dentro de eventos, consulte a Seção 8.2.23, “Auditorização de Atividades de Conta Baseada em SQL”.

`IF NOT EXISTS` tem o mesmo significado para `CREATE EVENT` e para `CREATE TABLE`: Se um evento chamado `event_name` já existir no mesmo esquema, nenhuma ação é realizada e não há erro. (No entanto, um aviso é gerado nesses casos.)

A cláusula `ON SCHEDULE` determina quando, com que frequência e por quanto tempo o `event_body` definido para o evento é repetido. Essa cláusula assume uma das duas formas:

- `AT timestamp` é usado para um evento único. Ele especifica que o evento é executado apenas uma vez na data e hora fornecidas por `timestamp`, que deve incluir tanto a data quanto a hora, ou deve ser uma expressão que resolva para um valor datetime. Você pode usar um valor do tipo `DATETIME` ou `TIMESTAMP` para esse propósito. Se a data estiver no passado, um aviso ocorre, como mostrado aqui:

  ```
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

  As declarações `CREATE EVENT` que, por qualquer motivo, são inválidas, falham com um erro.

  Você pode usar `CURRENT_TIMESTAMP` para especificar a data e hora atuais. Nesse caso, o evento é executado assim que ele é criado.

  Para criar um evento que ocorra em algum momento no futuro em relação à data e hora atuais — como a expressão “três semanas daqui” —, você pode usar a cláusula opcional `+ INTERVAL interval`. A parte `interval` consiste em duas partes: uma quantidade e uma unidade de tempo, e segue as regras de sintaxe descritas em Intervalos Temporais, exceto que você não pode usar palavras-chave de unidades que envolvam microsegundos ao definir um evento. Com alguns tipos de intervalo, unidades de tempo complexas podem ser usadas. Por exemplo, “dois minutos e dez segundos” pode ser expresso como `+ INTERVAL '2:10' MINUTE_SECOND`.

  Você também pode combinar intervalos. Por exemplo, `AT CURRENT_TIMESTAMP + INTERVAL 3 WEEK + INTERVAL 2 DAY` é equivalente a “três semanas e dois dias a partir de agora”. Cada parte de uma cláusula desse tipo deve começar com `+ INTERVAL`.

- Para repetir ações em intervalos regulares, use uma cláusula `EVERY`. A palavra-chave `EVERY` é seguida por um `interval`, conforme descrito na discussão anterior sobre a palavra-chave `AT`. (`+ INTERVAL` *não* é usado com `EVERY`.). Por exemplo, `EVERY 6 WEEK` significa “a cada seis semanas”.

  Embora as cláusulas `+ INTERVAL` não sejam permitidas em uma cláusula `EVERY`, você pode usar as mesmas unidades de tempo complexas permitidas em uma `+ INTERVAL`.

  Uma cláusula `EVERY` pode conter uma cláusula opcional `STARTS`. `STARTS` é seguida por um valor `timestamp` que indica quando a ação deve começar a se repetir, e também pode usar `+ INTERVAL interval` para especificar um período de tempo “a partir de agora”. Por exemplo, `EVERY 3 MONTH STARTS CURRENT_TIMESTAMP + INTERVAL 1 WEEK` significa “a cada três meses, começando uma semana a partir de agora”. Da mesma forma, você pode expressar “a cada duas semanas, começando seis horas e quinze minutos a partir de agora” como \`EVERY 2 WEEK STARTS CURRENT\_TIMESTAMP

  - INTERVAL '6:15' HOUR\_MINUTE`. Not specifying `STARTS`is the same as using`STARTS CURRENT\_TIMESTAMP — ou seja, a ação especificada para o evento começa a se repetir imediatamente após a criação do evento.

  Uma cláusula `EVERY` pode conter uma cláusula `ENDS` opcional. A palavra-chave `ENDS` é seguida por um valor `timestamp` que informa ao MySQL quando o evento deve parar de se repetir. Você também pode usar `+ INTERVAL interval` com `ENDS`; por exemplo, `EVERY 12 HOUR STARTS CURRENT_TIMESTAMP + INTERVAL 30 MINUTE ENDS CURRENT_TIMESTAMP + INTERVAL 4 WEEK` é equivalente a “a cada doze horas, começando trinta minutos a partir de agora e terminando quatro semanas a partir de agora”. Não usar `ENDS` significa que o evento continua sendo executado indefinidamente.

  O `ENDS` suporta a mesma sintaxe para unidades de tempo complexas que o `STARTS` faz.

  Você pode usar `STARTS`, `ENDS`, ambos ou nenhum deles em uma cláusula `EVERY`.

  Se um evento repetitivo não terminar dentro do intervalo de agendamento, o resultado pode ser várias instâncias do evento executando simultaneamente. Se isso não for desejado, você deve instituir um mecanismo para impedir instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()` ou o bloqueio de linhas ou tabelas.

A cláusula `ON SCHEDULE` pode usar expressões que envolvem funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de `timestamp` ou `interval` que ela contém. Você não pode usar funções armazenadas ou funções carregáveis nessas expressões, nem pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as instruções `CREATE EVENT` quanto `ALTER EVENT`. Referências a funções armazenadas, funções carregáveis e tabelas nesses casos não são especificamente permitidas e falham com um erro (veja o bug #22830).

Os horários na cláusula `ON SCHEDULE` são interpretados usando o valor atual da sessão `time_zone`. Isso se torna o fuso horário do evento; ou seja, o fuso horário usado para a programação de eventos e que está em vigor dentro do evento conforme ele é executado. Esses horários são convertidos para UTC e armazenados internamente junto com o fuso horário do evento. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. Para obter informações adicionais sobre a representação dos horários dos eventos, consulte a Seção 27.4.4, “Metadados do Evento”. Veja também a Seção 15.7.7.18, “Instrução SHOW EVENTS” e a Seção 28.3.14, “A Tabela INFORMATION\_SCHEMA EVENTS”.

Normalmente, uma vez que um evento expira, ele é imediatamente descartado. Você pode substituir esse comportamento especificando `ON COMPLETION PRESERVE`. Usar `ON COMPLETION NOT PRESERVE` apenas torna o comportamento não persistente padrão explícito.

Você pode criar um evento, mas impedir que ele esteja ativo usando a palavra-chave `DISABLE`. Alternativamente, você pode usar `ENABLE` para tornar explícito o status padrão, que é ativo. Isso é mais útil em conjunto com `ALTER EVENT` (veja a Seção 15.1.3, “Instrução ALTER EVENT”).

Um terceiro valor também pode aparecer no lugar de `ENABLE` ou `DISABLE`; `DISABLE ON SLAVE` é definido para o status de um evento em uma réplica para indicar que o evento foi criado no servidor de origem da replicação e replicado para a réplica, mas não é executado na réplica. Veja a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Você pode fornecer um comentário para um evento usando uma cláusula `COMMENT`. `comment` pode ser qualquer string de até 64 caracteres que você deseja usar para descrever o evento. O texto do comentário, sendo uma literal de string, deve ser rodeado por aspas.

A cláusula `DO` especifica uma ação realizada pelo evento e consiste em uma instrução SQL. Quase qualquer instrução MySQL válida que possa ser usada em uma rotina armazenada também pode ser usada como a instrução de ação para um evento agendado. (Veja a Seção 27.8, “Restrições sobre Programas Armazenados”.) Por exemplo, o seguinte evento `e_hourly` exclui todas as linhas da tabela `sessions` uma vez por hora, onde essa tabela faz parte do esquema `site_activity`:

```
CREATE EVENT e_hourly
    ON SCHEDULE
      EVERY 1 HOUR
    COMMENT 'Clears out sessions table each hour.'
    DO
      DELETE FROM site_activity.sessions;
```

O MySQL armazena o valor da variável de sistema `sql_mode` em vigor quando um evento é criado ou alterado, e sempre executa o evento com esse valor em vigor, *independentemente do modo SQL do servidor atual quando o evento começa a ser executado*.

Uma declaração `CREATE EVENT` que contém uma declaração `ALTER EVENT` na sua cláusula `DO` parece ter sucesso; no entanto, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Nota

Declarações como `SELECT` ou `SHOW` que simplesmente retornam um conjunto de resultados não têm efeito quando usadas em um evento; a saída dessas declarações não é enviada para o Monitor MySQL, nem é armazenada em nenhum lugar. No entanto, você pode usar declarações como `SELECT ... INTO` e `INSERT INTO ... SELECT` que armazenam um resultado. (Veja o próximo exemplo nesta seção para um exemplo do último.)

O esquema ao qual um evento pertence é o esquema padrão para referências de tabelas na cláusula `DO`. Quaisquer referências a tabelas em outros esquemas devem ser qualificadas com o nome do esquema apropriado.

Assim como nas rotinas armazenadas, você pode usar a sintaxe de declaração composta na cláusula `DO` usando as palavras-chave `BEGIN` e `END`, conforme mostrado aqui:

```
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

Este exemplo usa o comando `delimiter` para alterar o delimitador de declaração. Veja a Seção 27.1, “Definindo Programas Armazenados”.

Em um evento, é possível criar declarações compostas mais complexas, como as utilizadas em rotinas armazenadas. Esse exemplo utiliza variáveis locais, um manipulador de erros e uma construção de controle de fluxo:

```
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

Não é possível passar parâmetros diretamente para ou a partir de eventos; no entanto, é possível invocar uma rotina armazenada com parâmetros dentro de um evento:

```
CREATE EVENT e_call_myproc
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO CALL myproc(5, 27);
```

Se o definidor de um evento tiver privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”), o evento pode ler e escrever variáveis globais. Como a concessão desses privilégios implica em um potencial de abuso, é necessário tomar extremo cuidado ao fazê-lo.

Geralmente, quaisquer declarações válidas em rotinas armazenadas podem ser usadas para declarações de ação executadas por eventos. Para obter mais informações sobre declarações permitidas dentro de rotinas armazenadas, consulte a Seção 27.2.1, “Sintaxe de Rotina Armazenada”. Não é possível criar um evento como parte de uma rotina armazenada ou criar um evento por outro evento.
