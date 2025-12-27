### 15.1.15 Declaração de Criação de Evento

```
CREATE
    [DEFINER = user]
    EVENT
    [IF NOT EXISTS]
    event_name
    ON SCHEDULE schedule
    [ON COMPLETION [NOT] PRESERVE]
    [ENABLE | DISABLE | DISABLE ON {REPLICA | SLAVE}]
    [COMMENT 'string']
    DO event_body

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

Esta declaração cria e agrupa um novo evento. O evento não será executado a menos que o Agendamento de Eventos esteja habilitado. Para obter informações sobre como verificar o status do Agendamento de Eventos e habilitá-lo, se necessário, consulte a Seção 27.5.2, “Configuração do Agendamento de Eventos”.

A declaração `CREATE EVENT` requer o privilégio `EVENT` para o esquema no qual o evento deve ser criado. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor do *`user`*, conforme discutido na Seção 27.8, “Controle de Acesso a Objetos Armazenados”.

Os requisitos mínimos para uma declaração `CREATE EVENT` válida são os seguintes:

* As palavras-chave `CREATE EVENT` mais um nome de evento, que identifica de forma única o evento em um esquema de banco de dados.

* Uma cláusula `ON SCHEDULE`, que determina quando e com que frequência o evento será executado.

* Uma cláusula `DO`, que contém a instrução SQL a ser executada por um evento.

Este é um exemplo de uma declaração `CREATE EVENT` mínima:

```
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A declaração anterior cria um evento chamado `myevent`. Este evento será executado uma vez — uma hora após sua criação — executando uma instrução SQL que incrementa o valor da coluna `mycol` da tabela `mytable` do esquema `myschema` em 1.

O *`event_name`* deve ser um identificador MySQL válido com um comprimento máximo de 64 caracteres. Os nomes de eventos não são case-sensitive, portanto, não é possível ter dois eventos com os nomes `myevent` e `MyEvent` no mesmo esquema. Em geral, as regras que regem os nomes de eventos são as mesmas das regras para nomes de rotinas armazenadas. Consulte a Seção 11.2, “Nomes de Objetos de Esquema”.

Um evento está associado a um esquema. Se nenhum esquema for indicado como parte de *`event_name`*, o esquema padrão (atual) é assumido. Para criar um evento em um esquema específico, qualifique o nome do evento com um esquema usando a sintaxe `schema_name.event_name`.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar os privilégios de acesso no momento da execução do evento. Se a cláusula `DEFINER` estiver presente, o valor de *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores de *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 27.8, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança dos eventos.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE EVENT`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro do corpo de um evento, a função `CURRENT_USER` retorna a conta usada para verificar os privilégios no momento da execução do evento, que é o usuário `DEFINER`. Para obter informações sobre auditoria de usuários dentro dos eventos, consulte a Seção 8.2.23, “Auditorias de Atividade de Conta Baseadas em SQL”.

A cláusula `ON SCHEDULE` determina quando, com que frequência e por quanto tempo o *`event_body`* definido para o evento é repetido. Esta cláusula assume uma das duas formas:

* `AT timestamp` é usado para um evento único. Especifica que o evento é executado apenas uma vez na data e hora fornecidas por `timestamp`, que deve incluir tanto a data quanto a hora, ou deve ser uma expressão que resolva para um valor datetime. Você pode usar um valor do tipo `DATETIME` ou `TIMESTAMP` para esse propósito. Se a data for no passado, uma mensagem de aviso ocorre, como mostrado aqui:

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

  As instruções `CREATE EVENT` que são inválidas por qualquer motivo falham com um erro.

  Você pode usar `CURRENT_TIMESTAMP` para especificar a data e hora atuais. Nesse caso, o evento atua assim que é criado.

  Para criar um evento que ocorra em algum ponto no futuro em relação à data e hora atuais — como a expressa pela frase “três semanas daqui” — você pode usar a cláusula opcional `+ INTERVAL interval`. A parte `interval` consiste de duas partes, uma quantidade e uma unidade de tempo, e segue as regras de sintaxe descritas em Intervalos Temporais, exceto que você não pode usar palavras-chave de unidades que envolvam microsegundos ao definir um evento. Com alguns tipos de intervalo, unidades de tempo complexas podem ser usadas. Por exemplo, “dois minutos e dez segundos” pode ser expresso como `+ INTERVAL '2:10' MINUTE_SECOND`.

  Você também pode combinar intervalos. Por exemplo, `AT CURRENT_TIMESTAMP + INTERVAL 3 WEEK + INTERVAL 2 DAY` é equivalente a “três semanas e dois dias daqui”. Cada parte de tal cláusula deve começar com `+ INTERVAL`.

* Para repetir ações em um intervalo regular, use uma cláusula `EVERY`. A palavra-chave `EVERY` é seguida por um *`interval`* como descrito na discussão anterior da palavra-chave `AT`. (`+ INTERVAL` não é usado com `EVERY`. ) Por exemplo, `EVERY 6 WEEK` significa “a cada seis semanas”.

Embora as cláusulas `+ INTERVAL` não sejam permitidas em uma cláusula `EVERY`, você pode usar as mesmas unidades de tempo complexas permitidas em uma `+ INTERVAL`.

Uma cláusula `EVERY` pode conter uma cláusula `STARTS` opcional. `STARTS` é seguido por um valor de `timestamp` que indica quando a ação deve começar a se repetir, e também pode usar `+ INTERVAL intervalo` para especificar uma quantidade de tempo “a partir de agora”. Por exemplo, `EVERY 3 MONTH STARTS CURRENT_TIMESTAMP + INTERVAL 1 WEEK` significa “a cada três meses, começando uma semana a partir de agora”. Da mesma forma, você pode expressar “a cada duas semanas, começando seis horas e quinze minutos a partir de agora” como `EVERY 2 WEEK STARTS CURRENT_TIMESTAMP

+ INTERVAL '6:15' HOUR_MINUTE`. Não especificar `STARTS` é o mesmo que usar `STARTS CURRENT_TIMESTAMP`—ou seja, a ação especificada para o evento começa a se repetir imediatamente após a criação do evento.

Uma cláusula `EVERY` pode conter uma cláusula `ENDS` opcional. A palavra-chave `ENDS` é seguida por um valor de `timestamp` que informa ao MySQL quando o evento deve parar de se repetir. Você também pode usar `+ INTERVAL intervalo` com `ENDS`; por exemplo, `EVERY 12 HOUR STARTS CURRENT_TIMESTAMP + INTERVAL 30 MINUTE ENDS CURRENT_TIMESTAMP + INTERVAL 4 WEEK` é equivalente a “a cada doze horas, começando trinta minutos a partir de agora, e terminando quatro semanas a partir de agora”. Não usar `ENDS` significa que o evento continua sendo executado indefinidamente.

`ENDS` suporta a mesma sintaxe para unidades de tempo complexas que `STARTS` faz.

Você pode usar `STARTS`, `ENDS`, ambos ou nenhum deles em uma cláusula `EVERY`.

Se um evento repetitivo não for encerrado dentro do intervalo de agendamento, o resultado pode ser várias instâncias do evento executando simultaneamente. Se isso não for desejado, você deve instituir um mecanismo para impedir instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()` ou o bloqueio de linhas ou tabelas.

A cláusula `ON SCHEDULE` pode usar expressões que envolvem funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Você não pode usar funções armazenadas ou funções carregáveis nessas expressões, nem pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as instruções `CREATE EVENT` quanto `ALTER EVENT`. Referências a funções armazenadas, funções carregáveis e tabelas nessas situações não são especificamente permitidas e falham com um erro (veja o Bug
#22830).

Os tempos na cláusula `ON SCHEDULE` são interpretados usando o valor da sessão atual `time_zone`. Isso se torna o fuso horário do evento; ou seja, o fuso horário usado para agendamento de eventos e que está em vigor dentro do evento conforme ele é executado. Esses tempos são convertidos para UTC e armazenados junto com o fuso horário do evento internamente. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. Para informações adicionais sobre a representação dos tempos dos eventos, consulte a Seção 27.5.4, “Metadados do Evento”. Veja também a Seção 15.7.7.20, “Instrução SHOW EVENTS”, e a Seção 28.3.14, “A Tabela INFORMATION_SCHEMA EVENTS”.

Normalmente, uma vez que um evento expirou, ele é imediatamente descartado. Você pode sobrepor esse comportamento especificando `ON COMPLETION PRESERVE`. Usar `ON COMPLETION NOT PRESERVE` apenas torna o comportamento padrão não persistente explícito.

Você pode criar um evento, mas impedir que ele esteja ativo usando a palavra-chave `DISABLE`. Alternativamente, você pode usar `ENABLE` para tornar explícito o status padrão, que é ativo. Isso é mais útil em conjunto com `ALTER EVENT` (veja Seção 15.1.3, “Instrução ALTER EVENT”).

Um terceiro valor também pode aparecer no lugar de `ENABLE` ou `DISABLE`; `DISABLE ON REPLICA` é definido para o status de um evento em uma replica para indicar que o evento foi criado no servidor de origem da replicação e replicado para a replica, mas não é executado na replica. Veja Seção 19.5.1.16, “Replicação de Recursos Convocados”.

`DISABLE ON REPLICA` substitui `DISABLE ON SLAVE`, que está desatualizado e, portanto, sujeito à remoção em uma versão futura do MySQL.

Você pode fornecer um comentário para um evento usando uma cláusula `COMMENT`. *`comment`* pode ser qualquer string de até 64 caracteres que você deseja usar para descrever o evento. O texto do comentário, sendo uma literal de string, deve ser rodeado por aspas.

A cláusula `DO` especifica uma ação realizada pelo evento e consiste em uma instrução SQL. Quase qualquer instrução MySQL válida que possa ser usada em uma rotina armazenada também pode ser usada como a instrução de ação para um evento agendado. (Veja Seção 27.10, “Restrições em Programas Armazenados”.) Por exemplo, o seguinte evento `e_hourly` exclui todas as linhas da tabela `sessions` uma vez por hora, onde esta tabela faz parte do esquema `site_activity`:

```
CREATE EVENT e_hourly
    ON SCHEDULE
      EVERY 1 HOUR
    COMMENT 'Clears out sessions table each hour.'
    DO
      DELETE FROM site_activity.sessions;
```

O MySQL armazena o ajuste da variável de sistema `sql_mode` em vigor quando um evento é criado ou alterado, e sempre executa o evento com esse ajuste em vigor, *independentemente do modo SQL do servidor atual quando o evento começa a ser executado*.

Uma declaração `CREATE EVENT` que contém uma declaração `ALTER EVENT` na sua cláusula `DO` parece ter sucesso; no entanto, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Observação

Declarações como `SELECT` ou `SHOW` que apenas retornam um conjunto de resultados não têm efeito quando usadas em um evento; a saída desses não é enviada para o MySQL Monitor, nem é armazenada em nenhum lugar. No entanto, você pode usar declarações como `SELECT ... INTO` e `INSERT INTO ... SELECT` que armazenam um resultado. (Veja o próximo exemplo nesta seção para uma instância deste último.)

O esquema ao qual um evento pertence é o esquema padrão para referências de tabela na cláusula `DO`. Quaisquer referências a tabelas em outros esquemas devem ser qualificadas com o nome do esquema apropriado.

Assim como as rotinas armazenadas, você pode usar a sintaxe de declarações compostas na cláusula `DO` usando as palavras-chave `BEGIN` e `END`, como mostrado aqui:

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

Este exemplo usa o comando `delimiter` para alterar o delimitador da declaração. Veja a Seção 27.1, “Definindo Programas Armazenados”.

Declarações compostas mais complexas, como as usadas em rotinas armazenadas, são possíveis em um evento. Este exemplo usa variáveis locais, um manipulador de erros e uma construção de controle de fluxo:

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

Não há como passar parâmetros diretamente para ou a partir de eventos; no entanto, é possível invocar uma rotina armazenada com parâmetros dentro de um evento:

```
CREATE EVENT e_call_myproc
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO CALL myproc(5, 27);
```

No MySQL 9.5, uma declaração `CREATE EVENT` pode ser preparada, mas o texto da declaração não pode conter nenhum marcador (`?`). Uma maneira de contornar essa restrição é montar o texto da declaração, prepará-la e executá-la dentro de um procedimento armazenado; partes variáveis da declaração `CREATE EVENT` podem ser passadas para o procedimento armazenado como parâmetros. Demonstramos isso no exemplo seguinte, que assume que já existe uma tabela `t` no banco de dados `d` criada como mostrado aqui:

```
USE d;

CREATE TABLE t (
  c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c2 VARCHAR(20),
  c3 INT
);
```

Queremos criar um evento que insere linhas nesta tabela em intervalos determinados no momento da criação, semelhante ao evento definido pela declaração mostrada aqui:

```
CREATE EVENT e
  ON SCHEDULE EVERY interval SECOND
  STARTS CURRENT_TIMESTAMP + INTERVAL 10 SECOND
  ENDS CURRENT_TIMESTAMP + INTERVAL 2 MINUTE
  ON COMPLETION PRESERVE
  DO
    INSERT INTO d.t1 VALUES ROW(NULL, NOW(), FLOOR(RAND()*100));
```

Não podemos usar `?` como marcador para *`intervalo`*, mas podemos passar um valor de parâmetro para um procedimento armazenado assim:

```
delimiter |

CREATE PROCEDURE sp(n INT)
BEGIN
  SET @s1 = "CREATE EVENT e ON SCHEDULE EVERY ";
  SET @s2 = " SECOND
       STARTS CURRENT_TIMESTAMP + INTERVAL 10 SECOND
       ENDS CURRENT_TIMESTAMP + INTERVAL 2 MINUTE
       ON COMPLETION PRESERVE
       DO
       INSERT INTO d.t VALUES ROW(NULL, NOW(), FLOOR(RAND()*100))";

  SET @s = CONCAT(@s1, n, @s2);
  PREPARE ps FROM @s;
  EXECUTE ps;
  DEALLOCATE PREPARE ps;
END |

delimiter ;
```

```
mysql> TABLE t;
Empty set (0.00 sec)

mysql> CALL sp(5);
Query OK, 0 rows affected (0.01 sec)

# Wait 2 minutes...

mysql> TABLE t;
+----+---------------------+------+
| c1 | c2                  | c3   |
+----+---------------------+------+
|  1 | 2024-06-12 15:53:36 |   41 |
|  2 | 2024-06-12 15:53:41 |   84 |
|  3 | 2024-06-12 15:53:46 |   71 |
|  4 | 2024-06-12 15:53:51 |   78 |
|  5 | 2024-06-12 15:53:56 |   53 |
|  6 | 2024-06-12 15:54:01 |    6 |
|  7 | 2024-06-12 15:54:06 |   48 |
|  8 | 2024-06-12 15:54:11 |   98 |
|  9 | 2024-06-12 15:54:16 |   22 |
| 10 | 2024-06-12 15:54:21 |   88 |
| 11 | 2024-06-12 15:54:26 |   53 |
| 12 | 2024-06-12 15:54:31 |   75 |
| 13 | 2024-06-12 15:54:36 |   93 |
| 14 | 2024-06-12 15:54:41 |   13 |
| 15 | 2024-06-12 15:54:46 |   62 |
| 16 | 2024-06-12 15:54:51 |   47 |
| 17 | 2024-06-12 15:54:56 |   22 |
| 18 | 2024-06-12 15:55:01 |   47 |
| 19 | 2024-06-12 15:55:06 |   43 |
| 20 | 2024-06-12 15:55:11 |   50 |
| 21 | 2024-06-12 15:55:16 |   98 |
| 22 | 2024-06-12 15:55:21 |   15 |
| 23 | 2024-06-12 15:55:26 |   56 |
+----+---------------------+------+
23 rows in set (0.00 sec)
```

Após invocar `sp` com o valor do argumento `5`, como mostrado, e esperar 2 minutos até que o evento `e` tenha concluído sua execução, podemos ver que a tabela `t` foi atualizada a cada 5 segundos. Como `e` foi criado com `ON COMPLETION PRESERVE`, podemos vê-lo na tabela `EVENTS` do Schema de Informações e verificar que foi criado conforme esperado:

```
mysql> SELECT EVENT_NAME, EVENT_SCHEMA, EVENT_DEFINITION, EVENT_TYPE
     > FROM INFORMATION_SCHEMA.EVENTS WHERE EVENT_NAME='e'\G
*************************** 1. row ***************************
      EVENT_NAME: e
    EVENT_SCHEMA: d
EVENT_DEFINITION: INSERT INTO d.t VALUES ROW(NULL, NOW(), FLOOR(RAND()*100))
      EVENT_TYPE: RECURRING
1 row in set (0.00 sec)
```

Se o definidor de um evento tiver privilégios suficientes para definir variáveis de sistema globais (veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”), o evento pode ler e escrever variáveis globais. Como conceder tais privilégios implica em um potencial de abuso, deve-se ter extrema cautela ao fazê-lo.

Geralmente, quaisquer declarações válidas em rotinas armazenadas podem ser usadas para declarações de ação executadas por eventos. Para obter mais informações sobre declarações permitidas dentro de rotinas armazenadas, consulte a Seção 27.2.1, “Sintaxe de Rotina Armazenada”. Não é possível criar um evento como parte de uma rotina armazenada ou criar um evento por outro evento.