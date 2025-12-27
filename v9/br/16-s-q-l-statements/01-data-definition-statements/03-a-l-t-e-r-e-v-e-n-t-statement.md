### 15.1.3 Declaração de ALTER EVENT

```
ALTER
    [DEFINER = user]
    EVENT event_name
    [ON SCHEDULE schedule]
    [ON COMPLETION [NOT] PRESERVE]
    [RENAME TO new_event_name]
    [ENABLE | DISABLE | DISABLE ON {REPLICA | SLAVE}]
    [COMMENT 'string']
    [DO event_body]
```

A declaração `ALTER EVENT` altera uma ou mais características de um evento existente sem a necessidade de excluí-lo e recriá-lo. A sintaxe para cada uma das cláusulas `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE` e `DO` é exatamente a mesma quando usada com a declaração `CREATE EVENT`. (Veja a Seção 15.1.15, “Declaração CREATE EVENT”.)

Qualquer usuário pode alterar um evento definido em um banco de dados para o qual esse usuário tenha o privilégio `EVENT`. Quando um usuário executa uma declaração `ALTER EVENT` bem-sucedida, esse usuário se torna o definidor do evento afetado.

`ALTER EVENT` funciona apenas com um evento existente:

```
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

Em cada um dos seguintes exemplos, vamos assumir que o evento chamado `myevent` está definido como mostrado aqui:

```
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A seguinte declaração altera o cronograma para `myevent` de uma vez a cada seis horas, começando imediatamente, para uma vez a cada doze horas, começando quatro horas após o momento em que a declaração é executada:

```
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

É possível alterar várias características de um evento em uma única declaração. Este exemplo altera a declaração SQL executada por `myevent` para uma que exclui todos os registros de `mytable`; também altera o cronograma do evento para que ele seja executado uma vez, um dia após a execução da declaração `ALTER EVENT`.

```
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Especifique as opções em uma declaração `ALTER EVENT` apenas para as características que você deseja alterar; as opções omitidas mantêm seus valores existentes. Isso inclui quaisquer valores padrão para `CREATE EVENT`, como `ENABLE`.

Para desabilitar `myevent`, use esta declaração `ALTER EVENT`:

```
ALTER EVENT myevent
    DISABLE;
```

A cláusula `ON SCHEDULE` pode usar expressões que envolvem funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Você não pode usar rotinas armazenadas ou funções carregáveis nessas expressões, e não pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as instruções `ALTER EVENT` quanto `CREATE EVENT`. Referências a rotinas armazenadas, funções carregáveis e tabelas nesses casos não são permitidas especificamente e falham com um erro (veja o Bug
#22830).

Embora uma instrução `ALTER EVENT` que contém outra instrução `ALTER EVENT` em sua cláusula `DO` pareça ter sucesso, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Para renomear um evento, use a cláusula `RENAME TO` da instrução `ALTER EVENT`. Essa instrução renomeia o evento `myevent` para `yourevent`:

```
ALTER EVENT myevent
    RENAME TO yourevent;
```

Você também pode mover um evento para um banco de dados diferente usando a notação `ALTER EVENT ... RENAME TO ...` e `db_name.event_name`, como mostrado aqui:

```
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

Para executar a instrução anterior, o usuário que a executa deve ter o privilégio `EVENT` nos bancos de dados `olddb` e `newdb`.

Nota

Não existe uma instrução `RENAME EVENT`.

O valor `DISABLE ON REPLICA` é usado em uma replica em vez de `ENABLE` ou `DISABLE` para indicar um evento que foi criado no servidor de origem da replicação e replicado para a replica, mas que não é executado na replica. Normalmente, `DISABLE ON REPLICA` é definido automaticamente conforme necessário; no entanto, há algumas circunstâncias em que você pode querer ou precisar alterá-lo manualmente. Consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”, para obter mais informações.

`DESABILITAR EM REPLICA` substitui `DESABILITAR EM ESCRAVO`, que está desatualizado e está sujeito à remoção em uma versão futura do MySQL.