#### 16.4.1.16 Replicação de recursos solicitados

A replicação de recursos invocados, como funções carregáveis e programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), oferece as seguintes características:

- Os efeitos do recurso são sempre replicados.

- As seguintes declarações são replicadas usando a replicação baseada em declarações:

  - `Crie evento`
  - `ALTERAR EVENTO`
  - `DROP EVENT`
  - `CREATE PROCEDURE`
  - `DROP PROCEDURE`
  - `Crie função`
  - `DROP FUNCTION`
  - `CREATE TRIGGER`
  - `DROP TRIGGER`

  No entanto, os *efeitos* das funcionalidades criadas, modificadas ou excluídas usando essas declarações são replicados usando a replicação baseada em linhas.

  Nota

  Tentar replicar recursos invocados usando replicação baseada em declarações gera o aviso "A declaração não é segura para ser registrada no formato de declaração". Por exemplo, ao tentar replicar uma função carregável com replicação baseada em declarações, esse aviso é gerado porque, atualmente, o servidor MySQL não pode determinar se a função é determinística. Se você tem certeza absoluta de que os efeitos do recurso invocado são determinísticos, pode ignorar esses avisos com segurança.

- No caso de `CREATE EVENT` e `ALTER EVENT`:

  - O status do evento está definido como `SLAVESIDE_DISABLED` na replica, independentemente do estado especificado (isso não se aplica a `DROP EVENT`).

  - A fonte da qual o evento foi criado é identificada na replica por seu ID de servidor. A coluna `ORIGINATOR` na tabela do Schema de Informações `EVENTS` e a coluna `originator` na loja `mysql.event` armazenam essas informações. Consulte Seção 24.3.8, “A Tabela INFORMATION_SCHEMA EVENTS” e Seção 13.7.5.18, “Instrução SHOW EVENTS” para obter mais informações.

- A implementação do recurso reside na replica em um estado renovável, para que, caso a fonte falhe, a replica possa ser usada como fonte sem perda do processamento de eventos.

Para determinar se há eventos agendados em um servidor MySQL que foram criados em um servidor diferente (que estava atuando como servidor de origem de replicação), consulte a tabela Schema de Informações `EVENTS` de uma maneira semelhante à mostrada aqui:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Alternativamente, você pode usar a instrução `SHOW EVENTS`, assim:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Ao promover uma réplica com esses eventos para um servidor de origem de replicação, você deve habilitar cada evento usando `ALTER EVENT event_name ENABLE`, onde *`event_name`* é o nome do evento.

Se mais de uma fonte estiver envolvida na criação de eventos nesta réplica e você deseja identificar eventos criados apenas em uma fonte específica com o ID do servidor *`source_id`*, modifique a consulta anterior na tabela `EVENTS` para incluir a coluna `ORIGINATOR`, conforme mostrado aqui:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME, ORIGINATOR
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Você pode usar `ORIGINATOR` com a instrução `SHOW EVENTS` de uma maneira semelhante:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Antes de habilitar eventos que foram replicados da fonte, você deve desabilitar o Cronômetro de Eventos do MySQL na replica (usando uma declaração como `SET GLOBAL event_scheduler = OFF;`), executar quaisquer declarações necessárias de `ALTER EVENT` (alter-event.html), reiniciar o servidor e, em seguida, reativar o Cronômetro de Eventos na replica posteriormente (usando uma declaração como `SET GLOBAL event_scheduler = ON;`)

Se você posteriormente descer a nova fonte para ser uma replica, você deve desabilitar manualmente todos os eventos habilitados pelas instruções `ALTER EVENT`. Você pode fazer isso armazenando em uma tabela separada os nomes dos eventos da instrução `SELECT` mostrada anteriormente, ou usando instruções `ALTER EVENT` para renomear os eventos com um prefixo comum, como `replicated_`, para identificá-los.

Se você renomear os eventos, então, ao degradar esse servidor de volta a ser uma réplica, você pode identificar os eventos consultando a tabela `EVENTS`, como mostrado aqui:

```sql
SELECT CONCAT(EVENT_SCHEMA, '.', EVENT_NAME) AS 'Db.Event'
      FROM INFORMATION_SCHEMA.EVENTS
      WHERE INSTR(EVENT_NAME, 'replicated_') = 1;
```
