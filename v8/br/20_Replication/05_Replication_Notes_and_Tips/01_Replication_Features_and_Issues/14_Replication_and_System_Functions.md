#### 19.5.1.14 Replicação e funções do sistema

Algumas funções não se replicam bem sob certas condições:

- As funções `USER()`, `CURRENT_USER()` (ou `CURRENT_USER`), `UUID()`, `VERSION()` e `LOAD_FILE()` são replicadas sem alterações e, portanto, não funcionam de forma confiável na replica, a menos que a replicação baseada em linhas seja habilitada. (Consulte a Seção 19.2.1, “Formatos de Replicação”.)

  `USER()` e `CURRENT_USER()` são replicados automaticamente usando a replicação baseada em linhas quando o modo `MIXED` é usado, e geram um aviso no modo `STATEMENT`. (Veja também a Seção 19.5.1.8, “Replicação de CURRENT\_USER()”). Isso também é verdadeiro para `VERSION()` e `RAND()`.

- Para `NOW()`, o log binário inclui o timestamp. Isso significa que o valor *como retornado pela chamada a essa função na fonte* é replicado para a replica. Para evitar resultados inesperados ao replicar entre servidores MySQL em diferentes fusos horários, defina o fuso horário tanto na fonte quanto na replica. Para mais informações, consulte a Seção 19.5.1.33, “Replicação e Fusos Horários”.

  Para explicar os possíveis problemas ao replicar entre servidores que estão em fusos horários diferentes, vamos supor que a fonte esteja localizada em Nova York, a replica esteja localizada em Estocolmo e ambos os servidores estejam usando o horário local. Suponha também que, na fonte, você crie uma tabela `mytable`, execute uma instrução `INSERT` nesta tabela e, em seguida, selecione a partir da tabela, como mostrado aqui:

  ```
  mysql> CREATE TABLE mytable (mycol TEXT);
  Query OK, 0 rows affected (0.06 sec)

  mysql> INSERT INTO mytable VALUES ( NOW() );
  Query OK, 1 row affected (0.00 sec)

  mysql> SELECT * FROM mytable;
  +---------------------+
  | mycol               |
  +---------------------+
  | 2009-09-01 12:00:00 |
  +---------------------+
  1 row in set (0.00 sec)
  ```

  A hora local em Estocolmo está 6 horas à frente da hora de Nova York; portanto, se você emitir `SELECT NOW()` na réplica nesse mesmo instante exato, o valor `2009-09-01 18:00:00` será retornado. Por essa razão, se você selecionar a cópia da réplica de `mytable` após as instruções `CREATE TABLE` e `INSERT` mostradas anteriormente terem sido replicadas, você pode esperar que `mycol` contenha o valor `2009-09-01 18:00:00`. No entanto, isso não é o caso; quando você seleciona a cópia da réplica de `mytable`, você obtém exatamente o mesmo resultado que na fonte:

  ```
  mysql> SELECT * FROM mytable;
  +---------------------+
  | mycol               |
  +---------------------+
  | 2009-09-01 12:00:00 |
  +---------------------+
  1 row in set (0.00 sec)
  ```

  Ao contrário do `NOW()`, a função `SYSDATE()` não é segura para replicação porque não é afetada por instruções `SET TIMESTAMP` no log binário e é não determinística se o registro baseado em instruções for usado. Isso não é um problema se o registro baseado em linhas for usado.

  Uma alternativa é usar a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um alias para `NOW()`. Isso deve ser feito na fonte e na replica para que funcione corretamente. Nesse caso, a função ainda emite um aviso, mas ele pode ser ignorado com segurança, desde que `--sysdate-is-now` seja usado tanto na fonte quanto na replica.

  `SYSDATE()` é replicado automaticamente usando a replicação baseada em linhas quando o modo `MIXED` é usado, e gera um aviso no modo `STATEMENT`.

  Veja também a Seção 19.5.1.33, “Replicação e Fuso Horários”.

- *A seguinte restrição se aplica apenas à replicação baseada em declarações, e não à replicação baseada em linhas.* As funções `GET_LOCK()`, `RELEASE_LOCK()`, `IS_FREE_LOCK()` e `IS_USED_LOCK()` que lidam com bloqueios no nível do usuário são replicadas sem que a réplica saiba o contexto de concorrência na fonte. Portanto, essas funções não devem ser usadas para inserir em uma tabela de origem, porque o conteúdo na réplica seria diferente. Por exemplo, não execute uma declaração como `INSERT INTO mytable VALUES(GET_LOCK(...))`.

  Essas funções são replicadas automaticamente usando a replicação baseada em linhas quando o modo `MIXED` é usado, e geram um aviso no modo `STATEMENT`.

Como solução para as limitações anteriores quando a replicação baseada em declarações está em vigor, você pode usar a estratégia de salvar o resultado da função problemática em uma variável do usuário e referenciar a variável em uma declaração posterior. Por exemplo, a seguinte única linha `INSERT` é problemática devido à referência à função `UUID()`:

```
INSERT INTO t VALUES(UUID());
```

Para resolver o problema, faça o seguinte:

```
SET @my_uuid = UUID();
INSERT INTO t VALUES(@my_uuid);
```

Essa sequência de declarações é replicada porque o valor de `@my_uuid` é armazenado no log binário como um evento de variável do usuário antes da declaração `INSERT` e está disponível para uso na declaração `INSERT`.

A mesma ideia se aplica a inserções de várias linhas, mas é mais complicada de usar. Para uma inserção de duas linhas, você pode fazer isso:

```
SET @my_uuid1 = UUID(); @my_uuid2 = UUID();
INSERT INTO t VALUES(@my_uuid1),(@my_uuid2);
```

No entanto, se o número de linhas for grande ou desconhecido, a solução alternativa é difícil ou inviável. Por exemplo, você não pode converter a seguinte declaração em uma em que uma variável de usuário específica é associada a cada linha:

```
INSERT INTO t2 SELECT UUID(), * FROM t1;
```

Dentro de uma função armazenada, `RAND()` é replicado corretamente, desde que seja invocado apenas uma vez durante a execução da função. (Você pode considerar o timestamp de execução da função e a semente de número aleatório como entradas implícitas que são idênticas na fonte e na réplica.)

As funções `FOUND_ROWS()` e `ROW_COUNT()` não são replicadas de forma confiável usando a replicação baseada em instruções. Uma solução é armazenar o resultado da chamada à função em uma variável do usuário e, em seguida, usar esse resultado na instrução `INSERT`. Por exemplo, se você deseja armazenar o resultado em uma tabela chamada `mytable`, você pode fazer isso normalmente assim:

```
SELECT SQL_CALC_FOUND_ROWS FROM mytable LIMIT 1;
INSERT INTO mytable VALUES( FOUND_ROWS() );
```

No entanto, se você estiver replicando `mytable`, você deve usar `SELECT ... INTO` e, em seguida, armazenar a variável na tabela, da seguinte forma:

```
SELECT SQL_CALC_FOUND_ROWS INTO @found_rows FROM mytable LIMIT 1;
INSERT INTO mytable VALUES(@found_rows);
```

Dessa forma, a variável de usuário é replicada como parte do contexto e aplicada corretamente na replica.

Essas funções são replicadas automaticamente usando a replicação baseada em linhas quando o modo `MIXED` é usado, e geram um aviso no modo `STATEMENT`. (Bug #12092, Bug #30244)
