### 29.12.7 Tabelas de Transações do Schema de Desempenho

29.12.7.1 A tabela `events_transactions_current`

29.12.7.2 A tabela `events_transactions_history`

29.12.7.3 A tabela `events_transactions_history_long`

O Schema de Desempenho registra as transações. Dentro da hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de transação:

* `events_transactions_current`: O evento de transação atual para cada thread.

* `events_transactions_history`: Os eventos de transação mais recentes que terminaram por thread.

* `events_transactions_history_long`: Os eventos de transação mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de transação. Há também tabelas resumidas que agregam informações sobre eventos de transação; veja a Seção 29.12.20.5, “Tabelas de Resumo de Transações”.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, veja a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configurando a Coleta de Eventos de Transação
* Limites de Transação
* Instrumentação de Transações
* Transações e Eventos Aninhados
* Transações e Programas Armazenados
* Transações e Pontos de Salvação
* Transações e Erros

* A tabela `setup_consumers` contém valores de consumidores com nomes correspondentes aos nomes das tabelas de eventos de transação atuais e históricas. Use esses consumidores para filtrar a coleção de eventos de transação.

Os instrumentos `transaction` e os consumidores de transação `events_transactions_current` e `events_transactions_history` são ativados por padrão:

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

Para controlar a coleta de eventos de transação na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Ativado:

  ```
  [mysqld]
  performance-schema-instrument='transaction=ON'
  performance-schema-consumer-events-transactions-current=ON
  performance-schema-consumer-events-transactions-history=ON
  performance-schema-consumer-events-transactions-history-long=ON
  ```

* Desativado:

  ```
  [mysqld]
  performance-schema-instrument='transaction=OFF'
  performance-schema-consumer-events-transactions-current=OFF
  performance-schema-consumer-events-transactions-history=OFF
  performance-schema-consumer-events-transactions-history-long=OFF
  ```

Para controlar a coleta de eventos de transação no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Ativado:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_transactions%';
  ```

* Desativado:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_transactions%';
  ```

Para coletar eventos de transação apenas para tabelas específicas de eventos de transação, ative o instrumento `transaction`, mas apenas os consumidores de transação correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”, e a Seção 29.4, “Configuração de Tempo de Execução do Schema de Desempenho”.

#### Limites de Transação

No MySQL Server, as transações começam explicitamente com estas instruções:

```
START TRANSACTION | BEGIN | XA START | XA BEGIN
```

As transações também começam implicitamente. Por exemplo, quando a variável de sistema `autocommit` é habilitada, o início de cada instrução inicia uma nova transação.

Quando `autocommit` é desativado, o primeiro comando após uma transação confirmada marca o início de uma nova transação. Os comandos subsequentes fazem parte da transação até que ela seja confirmada.

As transações terminam explicitamente com estas instruções:

```
COMMIT | ROLLBACK | XA COMMIT | XA ROLLBACK
```

As transações também terminam implicitamente, pela execução de instruções DDL, instruções de bloqueio e instruções de administração do servidor.

Na discussão a seguir, as referências a `START TRANSACTION` também se aplicam a `BEGIN`, `XA START` e `XA BEGIN`. Da mesma forma, as referências a `COMMIT` e `ROLLBACK` se aplicam a `XA COMMIT` e `XA ROLLBACK`, respectivamente.

O Schema de Desempenho define os limites das transações de forma semelhante ao do servidor. O início e o fim de um evento de transação correspondem de perto às transições de estado correspondentes no servidor:

* Para uma transação explicitamente iniciada, o evento de transação começa durante o processamento da instrução `START TRANSACTION`.

* Para uma transação implicitamente iniciada, o evento de transação começa na primeira instrução que usa um motor transacional após a transação anterior ter terminado.

* Para qualquer transação, explicitamente ou implicitamente encerrada, o evento de transação termina quando o servidor transita para fora do estado de transação ativa durante o processamento de `COMMIT` ou `ROLLBACK`.

Há implicações sutis nessa abordagem:

* Os eventos de transação no Schema de Desempenho não incluem totalmente os eventos das instruções associados às correspondentes instruções `START TRANSACTION`, `COMMIT` ou `ROLLBACK`. Há uma pequena sobreposição de tempo entre o evento de transação e essas instruções.

* Instruções que trabalham com motores não transacionais não têm efeito no estado de transação da conexão. Para transações implícitas, o evento de transação começa com a primeira instrução que usa um motor transacional. Isso significa que instruções que operam exclusivamente em tabelas não transacionais são ignoradas, mesmo após `START TRANSACTION`.

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

Do ponto de vista do Schema de Desempenho, a Transação 2 começa quando o servidor transita para um estado de transação ativa. As instruções 6 e 7 não estão incluídas nos limites da Transação 2, o que é consistente com a forma como o servidor escreve transações no log binário.

#### Instrumentação de Transações

Três atributos definem as transações:

* Modo de acesso (leitura apenas, leitura/escrita)
* Nível de isolamento (`SERIALIZABLE`, `REPEATABLE READ`, e assim por diante)

* Implícito (`autocommit` habilitado) ou explícito (`autocommit` desabilitado)

Para reduzir a complexidade da instrumentação de transações e garantir que os dados de transação coletados forneçam resultados completos e significativos, todas as transações são instrumentadas de forma independente do modo de acesso, nível de isolamento ou modo `autocommit`.

Para examinar seletivamente o histórico de transações, use as colunas de atributos nas tabelas de eventos de transação: `ACCESS_MODE`, `ISOLATION_LEVEL` e `AUTOCOMMIT`.

O custo da instrumentação de transações pode ser reduzido de várias maneiras, como habilitando ou desabilitando a instrumentação de transações de acordo com o usuário, conta, host ou thread (conexão do cliente).

#### Transações e Eventos Aninhados

O pai de um evento de transação é o evento que iniciou a transação. Para uma transação iniciada explicitamente, isso inclui as instruções `START TRANSACTION` e `COMMIT AND CHAIN`. Para uma transação iniciada implicitamente, é a primeira instrução que usa um motor transacional após o término da transação anterior.

Em geral, uma transação é o pai de nível superior de todos os eventos iniciados durante a transação, incluindo declarações que explicitamente encerram a transação, como `COMMIT` e `ROLLBACK`. As exceções são declarações que encerram implicitamente uma transação, como declarações DDL, no caso, a transação atual deve ser comprometida antes que a nova declaração seja executada.

#### Transações e Programas Armazenados

Transações e eventos de programas armazenados estão relacionados da seguinte forma:

* Procedimentos Armazenados

  Os procedimentos armazenados operam independentemente das transações. Um procedimento armazenado pode ser iniciado dentro de uma transação, e uma transação pode ser iniciada ou encerrada dentro de um procedimento armazenado. Se chamado dentro de uma transação, um procedimento armazenado pode executar declarações que forçam o comprometimento da transação pai e, em seguida, iniciar uma nova transação.

  Se um procedimento armazenado for iniciado dentro de uma transação, essa transação é o pai do evento do procedimento armazenado.

  Se uma transação for iniciada por um procedimento armazenado, o procedimento armazenado é o pai do evento da transação.

* Funções Armazenadas

  As funções armazenadas são restritas a causar um comprometimento ou rollback explícito ou implícito. Eventos de função armazenada podem residir dentro de um evento de transação pai.

* Gatilhos

  Os gatilhos são ativados como parte de uma declaração que acessa a tabela com a qual está associado, então o pai de um evento de gatilho é sempre a declaração que o ativa.

  Os gatilhos não podem emitir declarações que causem um comprometimento ou rollback explícito ou implícito de uma transação.

* Eventos Agendados

  A execução das declarações no corpo de um evento agendado ocorre em uma nova conexão. A ninhada de um evento agendado dentro de uma transação pai não é aplicável.

As declarações de ponto de salvamento são registradas como eventos de declaração separados. Os eventos de transação incluem contadores separados para as declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e `RELEASE SAVEPOINT` emitidas durante a transação.

#### Transações e Erros

Erros e avisos que ocorrem dentro de uma transação são registrados em eventos de declaração, mas não nos eventos de transação correspondentes. Isso inclui erros e avisos específicos da transação, como um rollback em uma tabela não transakcional ou erros de consistência GTID.