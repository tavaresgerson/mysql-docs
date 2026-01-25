### 13.1.2 Declaração ALTER EVENT

```sql
ALTER
    [DEFINER = user]
    EVENT event_name
    [ON SCHEDULE schedule]
    [ON COMPLETION [NOT] PRESERVE]
    [RENAME TO new_event_name]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    [DO event_body]
```

A declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") altera uma ou mais das características de um event existente sem a necessidade de descartá-lo (drop) e recriá-lo. A sintaxe para cada uma das cláusulas `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE`, e [`DO`](do.html "13.2.3 DO Statement") é exatamente a mesma de quando usada com [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement"). (Veja [Seção 13.1.12, “Declaração CREATE EVENT”](create-event.html "13.1.12 CREATE EVENT Statement").)

Qualquer usuário pode alterar um event definido em um Database para o qual esse usuário possua o privilégio [`EVENT`](privileges-provided.html#priv_event). Quando um usuário executa uma declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") bem-sucedida, esse usuário se torna o definidor (definer) do event afetado.

[`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") funciona apenas com um event existente:

```sql
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

Em cada um dos exemplos a seguir, assuma que o event chamado `myevent` está definido como mostrado aqui:

```sql
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A seguinte declaração altera a schedule para `myevent` de uma vez a cada seis horas começando imediatamente para uma vez a cada doze horas, começando quatro horas a partir do momento em que a declaração é executada:

```sql
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

É possível alterar múltiplas características de um event em uma única declaração. Este exemplo altera a declaração SQL executada por `myevent` para uma que deleta todos os registros de `mytable`; ele também altera a schedule do event para que ele seja executado uma vez, um dia após esta declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") ser executada.

```sql
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Especifique as opções em uma declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") apenas para as características que você deseja alterar; opções omitidas mantêm seus valores existentes. Isso inclui quaisquer valores default para [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement"), como `ENABLE`.

Para desabilitar `myevent`, utilize esta declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement"):

```sql
ALTER EVENT myevent
    DISABLE;
```

A cláusula `ON SCHEDULE` pode usar expressions envolvendo funções built-in do MySQL e variáveis de usuário para obter qualquer um dos valores *`timestamp`* ou *`interval`* que ela contém. Você não pode usar stored routines ou loadable functions em tais expressions, e não pode usar nenhuma referência de table; no entanto, você pode usar `SELECT FROM DUAL`. Isso é válido tanto para as declarações [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") quanto para [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement"). Referências a stored routines, loadable functions e tables nesses casos não são especificamente permitidas e falham com um error (veja Bug #22830).

Embora uma declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") que contenha outra declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") em sua cláusula [`DO`](do.html "13.2.3 DO Statement") pareça ter sucesso, quando o server tenta executar o event agendado resultante, a execução falha com um error.

Para renomear um event, use a cláusula `RENAME TO` da declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement"). Esta declaração renomeia o event `myevent` para `yourevent`:

```sql
ALTER EVENT myevent
    RENAME TO yourevent;
```

Você também pode mover um event para um Database diferente usando a notação `ALTER EVENT ... RENAME TO ...` e `db_name.event_name`, como mostrado aqui:

```sql
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

Para executar a declaração anterior, o usuário que a está executando deve ter o privilégio [`EVENT`](privileges-provided.html#priv_event) em ambos os Databases, `olddb` e `newdb`.

Nota

Não existe uma declaração `RENAME EVENT`.

O valor `DISABLE ON SLAVE` é usado em uma replica em vez de `ENABLE` ou `DISABLE` para indicar um event que foi criado na source e replicado para a replica, mas que não é executado na replica. Normalmente, `DISABLE ON SLAVE` é definido automaticamente conforme necessário; no entanto, há algumas circunstâncias nas quais você pode querer ou precisar alterá-lo manualmente. Consulte [Seção 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features"), para obter mais informações.