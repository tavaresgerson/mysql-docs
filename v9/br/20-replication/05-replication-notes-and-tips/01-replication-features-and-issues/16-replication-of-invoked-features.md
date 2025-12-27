#### 19.5.1.16 Replicação de Recursos Ativados

A replicação de recursos ativados, como funções carregáveis e programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), oferece as seguintes características:

* Os efeitos do recurso são sempre replicados.
* As seguintes declarações são replicadas usando a replicação baseada em declarações:

  + `CREATE EVENT`
  + `ALTER EVENT`
  + `DROP EVENT`
  + `CREATE PROCEDURE`
  + `DROP PROCEDURE`
  + `CREATE FUNCTION`
  + `DROP FUNCTION`
  + `CREATE TRIGGER`
  + `DROP TRIGGER`

  No entanto, os *efeitos* dos recursos criados, modificados ou excluídos usando essas declarações são replicados usando a replicação baseada em linhas.

  Nota

  Tentar replicar recursos ativados usando a replicação baseada em declarações produz o aviso A declaração não é segura para ser registrada no formato de declaração. Por exemplo, tentar replicar uma função carregável com a replicação baseada em declarações gera esse aviso porque, atualmente, o servidor MySQL não pode determinar se a função é determinística. Se você tem certeza absoluta de que os efeitos do recurso ativado são determinísticos, pode ignorar esses avisos com segurança.

* No caso de `CREATE EVENT` e `ALTER EVENT`:

  + O status do evento é definido como `REPLICA_SIDE_DISABLED` na replica, independentemente do estado especificado (isso não se aplica a `DROP EVENT`).

  + A fonte na qual o evento foi criado é identificada na replica por seu ID de servidor. A coluna `ORIGINATOR` no `INFORMATION_SCHEMA.EVENTS` armazena essa informação. Veja a Seção 15.7.7.20, “Declaração SHOW EVENTS”, para mais informações.

* A implementação do recurso reside na replica em um estado renovável, para que, se a fonte falhar, a replica possa ser usada como fonte sem perda do processamento do evento.

Para determinar se há eventos agendados em um servidor MySQL que foram criados em um servidor diferente (que estava atuando como fonte), consulte a tabela do Schema de Informações `EVENTS`. Faça isso de uma maneira semelhante à mostrada aqui:

```
SELECT EVENT_SCHEMA, EVENT_NAME
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'REPLICA_SIDE_DISABLED';
```

Alternativamente, você pode usar a declaração `SHOW EVENTS`, assim:

```
SHOW EVENTS
    WHERE STATUS = 'REPLICA_SIDE_DISABLED';
```

Ao promover uma replica que possui esses eventos para uma fonte, você deve habilitar cada evento usando `ALTER EVENT nome_do_evento ENABLE`, onde *`nome_do_evento`* é o nome do evento.

Se mais de uma fonte estiver envolvida na criação de eventos nesta replica, e você deseja identificar eventos que foram criados apenas em uma fonte específica com o ID do servidor *`source_id`*, modifique a consulta anterior na tabela `EVENTS` para incluir a coluna `ORIGINATOR`, conforme mostrado aqui:

```
SELECT EVENT_SCHEMA, EVENT_NAME, ORIGINATOR
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'REPLICA_SIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Você pode usar `ORIGINATOR` com a declaração `SHOW EVENTS` de uma maneira semelhante:

```
SHOW EVENTS
    WHERE STATUS = 'REPLICA_SIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Observação

`REPLICA_SIDE_DISABLED` substitui `SLAVESIDE_DISABLED`, que está desatualizado.

Antes de habilitar eventos que foram replicados da fonte, você deve desabilitar o Cronômetro de Eventos MySQL na replica (usando uma declaração como `SET GLOBAL event_scheduler = OFF;`), executar quaisquer declarações `ALTER EVENT` necessárias, reiniciar o servidor e, em seguida, reativar o Cronômetro de Eventos na replica posteriormente (usando uma declaração como `SET GLOBAL event_scheduler = ON;`)

Se você posteriormente desativar a nova fonte de volta a ser uma replica, você deve desabilitar manualmente todos os eventos habilitados pelas declarações `ALTER EVENT`. Você pode fazer isso armazenando em uma tabela separada os nomes dos eventos da declaração `SELECT` mostrada anteriormente, ou usando declarações `ALTER EVENT` para renomear os eventos com um prefixo comum, como `replicated_`, para identificá-los.

Se você renomear os eventos, então, ao degradar esse servidor de volta a ser uma réplica, você pode identificar os eventos consultando a tabela `EVENTS`, como mostrado aqui: