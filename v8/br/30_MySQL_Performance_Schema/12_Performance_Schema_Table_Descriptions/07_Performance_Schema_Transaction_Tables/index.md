### 29.12.7 Tabelas de Transações do Schema de Desempenho

29.12.7.1 A tabela events\_transactions\_current

29.12.7.2 A tabela events\_transactions\_history

29.12.7.3 A tabela events\_transactions\_history\_long

Os instrumentos do Schema de Desempenho transacionam. Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de transação:

- `events_transactions_current`: O evento de transação atual para cada fio.

- `events_transactions_history`: Os eventos de transação mais recentes que terminaram por fio.

- `events_transactions_history_long`: Os eventos de transação mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de transação. Há também tabelas resumidas que agregam informações sobre eventos de transação; veja a Seção 29.12.20.5, “Tabelas de Resumo de Transação”.

Para obter mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

- Configurando a Coleta de Eventos de Transação
- Limites de transação
- Instrumentação de transações
- Transações e Eventos Aninhados
- Transações e Programas Armazenados
- Transações e pontos de salvamento
- Transações e Erros

#### Configurando a Coleta de Eventos de Transação

Para controlar se os eventos de transação devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

- A tabela `setup_instruments` contém um instrumento chamado `transaction`. Use este instrumento para habilitar ou desabilitar a coleta de classes de eventos de transação individuais.

- A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes das tabelas de eventos de transação atuais e históricos. Use esses consumidores para filtrar a coleção de eventos de transação.

Os instrumentos `transaction` e os consumidores de transações `events_transactions_current` e `events_transactions_history` estão habilitados por padrão:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME = 'transaction';
+-------------+---------+-------+
| NAME        | ENABLED | TIMED |
+-------------+---------+-------+
| transaction | YES     | YES   |
+-------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_transactions%';
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
+----------------------------------+---------+
```

Para controlar a coleta de eventos de transação ao iniciar o servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```
  [mysqld]
  performance-schema-instrument='transaction=ON'
  performance-schema-consumer-events-transactions-current=ON
  performance-schema-consumer-events-transactions-history=ON
  performance-schema-consumer-events-transactions-history-long=ON
  ```

- Desativar:

  ```
  [mysqld]
  performance-schema-instrument='transaction=OFF'
  performance-schema-consumer-events-transactions-current=OFF
  performance-schema-consumer-events-transactions-history=OFF
  performance-schema-consumer-events-transactions-history-long=OFF
  ```

Para controlar a coleta de eventos de transação em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

- Ativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_transactions%';
  ```

- Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_transactions%';
  ```

Para coletar eventos de transação apenas para tabelas específicas de eventos de transação, habilite o instrumento `transaction`, mas apenas os consumidores de transação que correspondem às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 29.4, “Configuração de execução do Schema de desempenho”.

#### Limites de transação

No MySQL Server, as transações começam explicitamente com essas instruções:

```
START TRANSACTION | BEGIN | XA START | XA BEGIN
```

As transações também começam implicitamente. Por exemplo, quando a variável de sistema `autocommit` é habilitada, o início de cada instrução inicia uma nova transação.

Quando o `autocommit` é desativado, a primeira instrução após uma transação confirmada marca o início de uma nova transação. As instruções subsequentes fazem parte da transação até que ela seja confirmada.

As transações terminam explicitamente com essas declarações:

```
COMMIT | ROLLBACK | XA COMMIT | XA ROLLBACK
```

As transações também terminam implicitamente com a execução de instruções DDL, instruções de bloqueio e instruções de administração do servidor.

Na discussão a seguir, as referências a `START TRANSACTION` também se aplicam a `BEGIN`, `XA START` e `XA BEGIN`. Da mesma forma, as referências a `COMMIT` e `ROLLBACK` se aplicam a `XA COMMIT` e `XA ROLLBACK`, respectivamente.

O Schema de Desempenho define os limites das transações de forma semelhante ao do servidor. O início e o fim de um evento de transação correspondem de perto às transições de estado correspondentes no servidor:

- Para uma transação explicitamente iniciada, o evento de transação começa durante o processamento da declaração `START TRANSACTION`.

- Para uma transação iniciada implicitamente, o evento da transação começa na primeira declaração que utiliza um mecanismo de transação após a conclusão da transação anterior.

- Para qualquer transação, seja explicitamente ou implicitamente encerrada, o evento da transação termina quando o servidor sai do estado de transação ativa durante o processamento de `COMMIT` ou `ROLLBACK`.

Há implicações sutis nessa abordagem:

- Os eventos de transação no Gerenciamento de Desempenho não incluem totalmente os eventos de declaração associados às declarações correspondentes `START TRANSACTION`, `COMMIT` ou `ROLLBACK`. Há uma pequena quantidade de sobreposição de tempo entre o evento de transação e essas declarações.

- As declarações que trabalham com motores não transacionais não têm efeito no estado da transação da conexão. Para transações implícitas, o evento da transação começa com a primeira declaração que usa um motor transacional. Isso significa que as declarações que operam exclusivamente em tabelas não transacionais são ignoradas, mesmo após `START TRANSACTION`.

Para ilustrar, considere o seguinte cenário:

```
1. SET autocommit = OFF;
2. CREATE TABLE t1 (a INT) ENGINE = InnoDB;
3. START TRANSACTION;                       -- Transaction 1 START
4. INSERT INTO t1 VALUES (1), (2), (3);
5. CREATE TABLE t2 (a INT) ENGINE = MyISAM; -- Transaction 1 COMMIT
                                            -- (implicit; DDL forces commit)
6. INSERT INTO t2 VALUES (1), (2), (3);     -- Update nontransactional table
7. UPDATE t2 SET a = a + 1;                 -- ... and again
8. INSERT INTO t1 VALUES (4), (5), (6);     -- Write to transactional table
                                            -- Transaction 2 START (implicit)
9. COMMIT;                                  -- Transaction 2 COMMIT
```

Do ponto de vista do servidor, a Transação 1 termina quando a tabela `t2` é criada. A Transação 2 não começa até que uma tabela transacional seja acessada, apesar das atualizações intermédias em tabelas não transacionais.

Do ponto de vista do Schema de Desempenho, a Transação 2 começa quando o servidor passa para um estado de transação ativa. As instruções 6 e 7 não estão incluídas nos limites da Transação 2, o que está de acordo com a forma como o servidor registra as transações no log binário.

#### Instrumentação de transações

Três atributos definem as transações:

- Modo de acesso (somente leitura, leitura e escrita)

- Nível de isolamento (`SERIALIZABLE`, `REPEATABLE READ` e assim por diante)

- Implícito (`autocommit` ativado) ou explícito (`autocommit` desativado)

Para reduzir a complexidade da instrumentação das transações e garantir que os dados coletados das transações forneçam resultados completos e significativos, todas as transações são instrumentadas independentemente do modo de acesso, do nível de isolamento ou do modo de autocommit.

Para examinar seletivamente o histórico de transações, use as colunas de atributos nas tabelas de eventos de transação: `ACCESS_MODE`, `ISOLATION_LEVEL` e `AUTOCOMMIT`.

O custo da instrumentação de transações pode ser reduzido de várias maneiras, como ativar ou desativar a instrumentação de transações de acordo com o usuário, a conta, o host ou o thread (conexão do cliente).

#### Transações e Eventos Aninhados

O progenitor de um evento de transação é o evento que iniciou a transação. Para uma transação explicitamente iniciada, isso inclui as instruções `START TRANSACTION` e `COMMIT AND CHAIN`. Para uma transação implicitamente iniciada, é a primeira instrução que usa um mecanismo de transação após a conclusão da transação anterior.

Em geral, uma transação é o elemento pai de nível superior de todos os eventos iniciados durante a transação, incluindo declarações que encerram explicitamente a transação, como `COMMIT` e `ROLLBACK`. As exceções são declarações que encerram implicitamente uma transação, como declarações DDL, no qual caso a transação atual deve ser comprometida antes que a nova declaração seja executada.

#### Transações e Programas Armazenados

As transações e os eventos de programas armazenados estão relacionados da seguinte forma:

- Procedimentos Armazenados

  Os procedimentos armazenados funcionam de forma independente das transações. Um procedimento armazenado pode ser iniciado dentro de uma transação, e uma transação pode ser iniciada ou encerrada dentro de um procedimento armazenado. Se chamado dentro de uma transação, um procedimento armazenado pode executar instruções que forçam o commit da transação pai e, em seguida, iniciar uma nova transação.

  Se um procedimento armazenado for iniciado dentro de uma transação, essa transação é a origem do evento do procedimento armazenado.

  Se uma transação é iniciada por um procedimento armazenado, o procedimento armazenado é o pai do evento de transação.

- Funções Armazenadas

  As funções armazenadas não podem causar um commit ou rollback explícito ou implícito. Os eventos de função armazenada podem residir dentro de um evento de transação pai.

- Descobrir os gatilhos

  Os gatilhos são ativados como parte de uma declaração que acessa a tabela com a qual está associado, portanto, o pai de um evento de gatilho é sempre a declaração que o ativa.

  Os gatilhos não podem emitir declarações que causem um compromisso explícito ou implícito ou um rollback de uma transação.

- Eventos agendados

  A execução das instruções no corpo de um evento agendado ocorre em uma nova conexão. A criação de um evento agendado dentro de uma transação pai não é aplicável.

#### Transações e pontos de salvamento

As declarações de Savepoint são registradas como eventos de declaração separados. Os eventos de transação incluem contadores separados para as declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e `RELEASE SAVEPOINT` emitidas durante a transação.

#### Transações e Erros

Erros e avisos que ocorrem durante uma transação são registrados em eventos de declaração, mas não nos eventos de transação correspondentes. Isso inclui erros e avisos específicos da transação, como um rollback em uma tabela não transacional ou erros de consistência GTID.
