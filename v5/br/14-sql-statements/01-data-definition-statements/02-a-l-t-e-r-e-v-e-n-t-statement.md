### 13.1.2 Declaração de ALTER EVENT

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

A instrução `ALTER EVENT` altera uma ou mais características de um evento existente sem a necessidade de excluí-lo e recriá-lo. A sintaxe para cada uma das cláusulas `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE` e `DO` é exatamente a mesma quando usada com a instrução `CREATE EVENT`. (Veja Seção 13.1.12, “Instrução CREATE EVENT”.)

Qualquer usuário pode alterar um evento definido em um banco de dados para o qual esse usuário tenha o privilégio `EVENT`. Quando um usuário executa uma declaração bem-sucedida de `ALTER EVENT`, esse usuário se torna o definidor do evento afetado.

`ALTERAR EVENTO` funciona apenas com um evento existente:

```sql
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

Em cada um dos exemplos a seguir, vamos assumir que o evento chamado `myevent` está definido conforme mostrado aqui:

```sql
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A seguinte declaração altera o cronograma do `myevent` de uma vez a cada seis horas, começando imediatamente, para uma vez a cada doze horas, começando quatro horas após a execução da declaração:

```sql
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

É possível alterar várias características de um evento em uma única declaração. Este exemplo altera a declaração SQL executada por `myevent` para uma que exclui todos os registros da `mytable`; também altera o cronograma do evento para que ele seja executado uma vez, um dia após a execução da declaração `ALTER EVENT` (alter-event.html).

```sql
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Especifique as opções em uma declaração `ALTER EVENT` apenas para as características que você deseja alterar; as opções omitidas mantêm seus valores existentes. Isso inclui quaisquer valores padrão para `CREATE EVENT`]\(create-event.html), como `ENABLE`.

Para desabilitar `myevent`, use esta declaração `ALTER EVENT`:

```sql
ALTER EVENT myevent
    DISABLE;
```

A cláusula `ON SCHEDULE` pode usar expressões que envolvem funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Você não pode usar rotinas armazenadas ou funções carregáveis nessas expressões, e não pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as instruções `ALTER EVENT` quanto para as instruções `CREATE EVENT`. Referências a rotinas armazenadas, funções carregáveis e tabelas nesses casos não são especificamente permitidas e falham com um erro (veja o bug
\#22830).

Embora uma declaração `ALTER EVENT` (alter-event.html) que contém outra declaração `ALTER EVENT` (alter-event.html) em sua cláusula `DO` (do.html) pareça ter sucesso, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Para renomear um evento, use a cláusula `RENAME TO` da instrução `ALTER EVENT` (alter-event.html). Esta instrução renomeia o evento `myevent` para `yourevent`:

```sql
ALTER EVENT myevent
    RENAME TO yourevent;
```

Você também pode mover um evento para um banco de dados diferente usando `ALTER EVENT ... RENAME TO ...` e a notação `db_name.event_name`, como mostrado aqui:

```sql
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

Para executar a declaração anterior, o usuário que a executa deve ter o privilégio `EVENT` nas bases de dados `olddb` e `newdb`.

Nota

Não há a declaração `RENAME EVENT`.

O valor `DESABILITAR EM ESCRAVO` é usado em uma réplica em vez de `ATIVAR` ou `DESATIVAR` para indicar um evento que foi criado na fonte e replicado para a réplica, mas que não é executado na réplica. Normalmente, `DESABILITAR EM ESCRAVO` é definido automaticamente conforme necessário; no entanto, há algumas circunstâncias em que você pode querer ou precisar alterá-lo manualmente. Consulte Seção 16.4.1.16, “Replicação de Recursos Convocados” para obter mais informações.
