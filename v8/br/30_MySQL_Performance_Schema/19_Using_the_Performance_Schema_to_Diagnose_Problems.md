## 29.19 Usando o Schema de Desempenho para Diagnosticar Problemas

O Schema de Desempenho é uma ferramenta que ajuda o DBA a realizar o ajuste de desempenho, obtendo medições reais em vez de "suposições casuais". Esta seção demonstra algumas maneiras de usar o Schema de Desempenho para esse propósito. A discussão aqui se baseia no uso da filtragem de eventos, que é descrita na Seção 29.4.2, "Filtragem de Eventos do Schema de Desempenho".

O exemplo a seguir fornece uma metodologia que você pode usar para analisar um problema repetitivo, como investigar um gargalo de desempenho. Para começar, você deve ter um caso de uso repetitivo onde o desempenho é considerado “demasiado lento” e precisa de otimização, e você deve habilitar toda a instrumentação (sem pré-filtragem).

1. Execute o caso de uso. 2. Usando as tabelas do Schema de desempenho, analise a causa raiz do problema de desempenho. Essa análise depende fortemente do pós-filtragem.

3. Para áreas problemáticas que são excluídas, desative os instrumentos correspondentes. Por exemplo, se a análise mostrar que o problema não está relacionado ao I/O de arquivos em um motor de armazenamento específico, desative os instrumentos de I/O de arquivos para esse motor. Em seguida, trunque as tabelas de histórico e resumo para remover eventos previamente coletados.

4. Repita o processo no passo 1.

Com cada iteração, a saída do Schema de Desempenho, particularmente a tabela `events_waits_history_long`, contém cada vez menos "ruído" causado por instrumentos não significativos, e, dado que essa tabela tem um tamanho fixo, contém cada vez mais dados relevantes para a análise do problema em questão.

Em cada iteração, a investigação deve se aproximar cada vez mais da causa raiz do problema, à medida que a relação "sinal/ruído" melhora, facilitando a análise.

5. Uma vez identificada a causa raiz do gargalo de desempenho, tome a ação corretiva apropriada, como:

* Ajuste os parâmetros do servidor (tamanhos de cache, memória, etc.).

* Ajuste uma consulta escrevendo-a de outra forma,
* Ajuste o esquema do banco de dados (tabelas, índices, etc.).
* Ajuste o código (este se aplica apenas aos desenvolvedores do mecanismo de armazenamento ou do servidor).

6. Comece novamente no passo 1, para ver os efeitos das mudanças no desempenho.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Isso é possível graças à instrumentação do Performance Schema, conforme descrito a seguir:

1. Suponha que o fio 1 esteja preso, esperando por um mutex.
2. Você pode determinar o que o fio está esperando:

   ```
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_1;
   ```

Digamos que o resultado da consulta identifique que o thread está esperando pelo mutex A, encontrado em `events_waits_current.OBJECT_INSTANCE_BEGIN`.

3. Você pode determinar qual fio está segurando o mutex A:

   ```
   SELECT * FROM performance_schema.mutex_instances
   WHERE OBJECT_INSTANCE_BEGIN = mutex_A;
   ```

Diga que o resultado da consulta indica que é o fio 2 que detém o mutex A, conforme encontrado em `mutex_instances.LOCKED_BY_THREAD_ID`.

4. Você pode ver o que o fio 2 está fazendo:

   ```
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_2;
   ```

### 29.19.1 Perguntas sobre perfilamento de desempenho usando o Gerador de desempenho

O exemplo a seguir demonstra como usar eventos de declaração do Gerador de Desempenho e eventos de estágio para recuperar dados comparáveis às informações de perfilamento fornecidas pelas declarações `SHOW PROFILES` (show-profiles.html "15.7.7.31 SHOW PROFILES Statement") e `SHOW PROFILE` (show-profile.html "15.7.7.30 SHOW PROFILE Statement").

A tabela `setup_actors` pode ser usada para limitar a coleta de eventos históricos por host, usuário ou conta, para reduzir o sobrecarga de tempo de execução e a quantidade de dados coletados nas tabelas de histórico. O primeiro passo do exemplo mostra como limitar a coleta de eventos históricos para um usuário específico.

O Schema de desempenho exibe informações do temporizador de eventos em picossegundos (trilhões de um segundo) para normalizar os dados de temporização em uma unidade padrão. No exemplo a seguir, os valores `TIMER_WAIT` são divididos por 1000000000000 para mostrar os dados em unidades de segundos. Os valores também são truncados para 6 casas decimais para exibir os dados no mesmo formato que as declarações `SHOW PROFILES` e `SHOW PROFILE`.

1. Limite a coleta de eventos históricos ao usuário que executa a consulta. Por padrão, `setup_actors` é configurado para permitir o monitoramento e a coleta de eventos históricos para todos os threads de primeiro plano:

   ```
   mysql> SELECT * FROM performance_schema.setup_actors;
   +------+------+------+---------+---------+
   | HOST | USER | ROLE | ENABLED | HISTORY |
   +------+------+------+---------+---------+
   | %    | %    | %    | YES     | YES     |
   +------+------+------+---------+---------+
   ```

Atualize a linha padrão na tabela `setup_actors` para desabilitar a coleta e monitoramento de eventos históricos para todos os threads de plano de fundo e insira uma nova linha que habilite o monitoramento e a coleta de eventos históricos para o usuário que executa a consulta:

   ```
   mysql> UPDATE performance_schema.setup_actors
          SET ENABLED = 'NO', HISTORY = 'NO'
          WHERE HOST = '%' AND USER = '%';

   mysql> INSERT INTO performance_schema.setup_actors
          (HOST,USER,ROLE,ENABLED,HISTORY)
          VALUES('localhost','test_user','%','YES','YES');
   ```

Os dados na tabela `setup_actors` devem agora aparecer semelhantes aos seguintes:

   ```
   mysql> SELECT * FROM performance_schema.setup_actors;
   +-----------+-----------+------+---------+---------+
   | HOST      | USER      | ROLE | ENABLED | HISTORY |
   +-----------+-----------+------+---------+---------+
   | %         | %         | %    | NO      | NO      |
   | localhost | test_user | %    | YES     | YES     |
   +-----------+-----------+------+---------+---------+
   ```

2. Certifique-se de que a declaração e a instrumentação de estágio estão habilitadas, atualizando a tabela `setup_instruments`. Alguns instrumentos podem estar habilitados por padrão.

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%statement/%';

   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%stage/%';
   ```

3. Certifique-se de que os consumidores `events_statements_*` e `events_stages_*` estejam habilitados. Alguns consumidores podem estar habilitados por padrão.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_statements_%';

   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_stages_%';
   ```

4. Sob a conta de usuário que você está monitorando, execute a declaração que você deseja perfilar. Por exemplo:

   ```
   mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
   +--------+------------+------------+-----------+--------+------------+
   | emp_no | birth_date | first_name | last_name | gender | hire_date |
   +--------+------------+------------+-----------+--------+------------+
   |  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
   +--------+------------+------------+-----------+--------+------------+
   ```

5. Identifique o `EVENT_ID` da declaração consultando a tabela `events_statements_history_long`. Esse passo é semelhante ao de executar `SHOW PROFILES` para identificar o `Query_ID`. A consulta a seguir produz um resultado semelhante ao [`SHOW PROFILES`(show-profiles.html "15.7.7.31 SHOW PROFILES Statement"):

   ```
   mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
          FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
   +----------+----------+--------------------------------------------------------+
   | event_id | duration | sql_text                                               |
   +----------+----------+--------------------------------------------------------+
   |       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
   +----------+----------+--------------------------------------------------------+
   ```

6. Consulte a tabela `events_stages_history_long` para recuperar os eventos de estágio da declaração. Os estágios estão vinculados às declarações usando o emendação de eventos. Cada registro de evento de estágio tem uma coluna `NESTING_EVENT_ID` que contém o `EVENT_ID` da declaração pai.

   ```
   mysql> SELECT event_name AS Stage, TRUNCATE(TIMER_WAIT/1000000000000,6) AS Duration
          FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=31;
   +--------------------------------+----------+
   | Stage                          | Duration |
   +--------------------------------+----------+
   | stage/sql/starting             | 0.000080 |
   | stage/sql/checking permissions | 0.000005 |
   | stage/sql/Opening tables       | 0.027759 |
   | stage/sql/init                 | 0.000052 |
   | stage/sql/System lock          | 0.000009 |
   | stage/sql/optimizing           | 0.000006 |
   | stage/sql/statistics           | 0.000082 |
   | stage/sql/preparing            | 0.000008 |
   | stage/sql/executing            | 0.000000 |
   | stage/sql/Sending data         | 0.000017 |
   | stage/sql/end                  | 0.000001 |
   | stage/sql/query end            | 0.000004 |
   | stage/sql/closing tables       | 0.000006 |
   | stage/sql/freeing items        | 0.000272 |
   | stage/sql/cleaning up          | 0.000001 |
   +--------------------------------+----------+
   ```

### 29.19.2 Obter informações sobre o evento principal

A tabela `data_locks` mostra os bloqueios de dados mantidos e solicitados. As linhas desta tabela têm uma coluna `THREAD_ID` que indica o ID do thread da sessão que possui o bloqueio, e uma coluna `EVENT_ID` que indica o evento do Schema de Desempenho que causou o bloqueio. Os tuplos de valores (`THREAD_ID`, `EVENT_ID`) identificam implicitamente um evento pai em outras tabelas do Schema de Desempenho:

* O evento de espera do pai nas tabelas `events_waits_xxx`

* O evento principal na tabela `events_stages_xxx`

* O evento de declaração principal nas tabelas `events_statements_xxx`

* O evento da transação principal na tabela `events_transactions_current`

Para obter detalhes sobre o evento principal, conecte as colunas `THREAD_ID` e `EVENT_ID` às colunas com o mesmo nome na tabela do evento principal apropriada. A relação é baseada em um modelo de dados de conjunto aninhado, portanto, a conexão tem várias cláusulas. Dado que as tabelas pai e filho são representadas por `parent`, respectivamente, a conexão parece assim:

```
WHERE
  parent.THREAD_ID = child.THREAD_ID        /* 1 */
  AND parent.EVENT_ID < child.EVENT_ID      /* 2 */
  AND (
    child.EVENT_ID <= parent.END_EVENT_ID   /* 3a */
    OR parent.END_EVENT_ID IS NULL          /* 3b */
  )
```

As condições para a adesão são:

1. Os eventos pai e filho estão na mesma thread. 2. O evento filho começa após o evento pai, portanto, seu valor `EVENT_ID` é maior do que o do pai.

O evento principal já completou ou ainda está em andamento.

Para encontrar informações sobre bloqueio, `data_locks` é a tabela que contém eventos infantis.

A tabela `data_locks` mostra apenas bloqueios existentes, portanto, essas considerações se aplicam em relação à qual tabela contém o evento pai:

* Para transações, a única opção é `events_transactions_current`. Se uma transação for concluída, ela pode estar nos registros de histórico de transação, mas as chaves já foram removidas.

* Para declarações, tudo depende de se a declaração que recebeu um bloqueio é uma declaração em uma transação que já foi concluída (use `events_statements_history`) ou se a declaração ainda está em execução (use `events_statements_current`).

* Para etapas, a lógica é semelhante àquela para declarações; use `events_stages_history` ou `events_stages_current`.

* Para as esperas, a lógica é semelhante àquela para as declarações; use `events_waits_history` ou `events_waits_current`. No entanto, há tantas esperas registradas que a espera que causou um bloqueio provavelmente já desapareceu das tabelas de histórico.

Eventos de espera, de estágio e de declaração desaparecem rapidamente do histórico. Se uma declaração que foi executada há muito tempo tomou um bloqueio, mas ainda está em uma transação aberta, pode não ser possível encontrar a declaração, mas é possível encontrar a transação.

É por isso que o modelo de dados de conjunto aninhado funciona melhor para localizar eventos parentais. Seguir links em uma relação pai/filho (bloqueio de dados -> espera do pai -> estágio do pai -> transação do pai) não funciona bem quando os nós intermediários já desaparecem das tabelas de histórico.

O seguinte cenário ilustra como encontrar a transação principal de uma declaração na qual foi realizada uma bloqueio:

Sessão A:

```
[1] START TRANSACTION;
[2] SELECT * FROM t1 WHERE pk = 1;
[3] SELECT 'Hello, world';
```

Sessão B:

```
SELECT ...
FROM performance_schema.events_transactions_current AS parent
  INNER JOIN performance_schema.data_locks AS child
WHERE
  parent.THREAD_ID = child.THREAD_ID
  AND parent.EVENT_ID < child.EVENT_ID
  AND (
    child.EVENT_ID <= parent.END_EVENT_ID
    OR parent.END_EVENT_ID IS NULL
  );
```

A consulta para a sessão B deve mostrar que a declaração [2] possui um bloqueio de dados no registro com `pk=1`.

Se a sessão A executar mais instruções, [2] desaparece da tabela de histórico.

A consulta deve mostrar a transação que começou em [1], independentemente de quantas declarações, etapas ou espera foram executadas.

Para ver mais dados, você também pode usar as tabelas `events_xxx_history_long`, exceto para transações, assumindo que nenhuma outra consulta está sendo executada no servidor (para que o histórico seja preservado).