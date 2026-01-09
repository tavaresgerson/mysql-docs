### 17.12.2 Desempenho e Concorrência do DDL Online

O DDL online melhora vários aspectos do funcionamento do MySQL:

* As aplicações que acessam a tabela são mais responsivas, pois as consultas e operações DML na tabela podem prosseguir enquanto a operação de DDL está em andamento. A redução do bloqueio e da espera por recursos do servidor MySQL leva a uma maior escalabilidade, mesmo para operações que não estão envolvidas na operação de DDL.

* As operações instantâneas modificam apenas os metadados no dicionário de dados. Pode ser tomado um bloqueio exclusivo de metadados na tabela por um breve período durante a fase de execução da operação. Os dados da tabela não são afetados, tornando as operações instantâneas. A DML concorrente é permitida.

* As operações online evitam o I/O de disco e os ciclos de CPU associados ao método de cópia da tabela, o que minimiza a carga geral no banco de dados. Minimizar a carga ajuda a manter um bom desempenho e alto rendimento durante a operação de DDL.

* As operações online leem menos dados no pool de buffers do que as operações de cópia da tabela, o que reduz a purga de dados acessados com frequência da memória. A purga de dados acessados com frequência pode causar uma queda temporária no desempenho após uma operação de DDL.

#### A cláusula LOCK

Por padrão, o MySQL usa o menor bloqueio possível durante uma operação de DDL. A cláusula `LOCK` pode ser especificada para operações in-place e algumas operações de cópia para impor um bloqueio mais restritivo, se necessário. Se a cláusula `LOCK` especificar um nível de bloqueio menos restritivo do que o permitido para uma operação de DDL particular, a instrução falha com um erro. As cláusulas `LOCK` são descritas abaixo, em ordem de menos restritiva a mais restritiva:

* `LOCK=NONE`:

  Permite consultas e DML concorrentes.

Por exemplo, use esta cláusula para tabelas que envolvem inscrições ou compras de clientes, para evitar indisponibilidade das tabelas durante operações DDL prolongadas.

* `LOCK=SHARED`:

  Permite consultas concorrentes, mas bloqueia a DML.

  Por exemplo, use esta cláusula em tabelas de armazém de dados, onde você pode adiar operações de carregamento de dados até que a operação DDL esteja concluída, mas as consultas não podem ser adiadas por longos períodos.

* `LOCK=DEFAULT`:

  Permite a maior concorrência possível (consultas concorrentes, DML ou ambas). Omitindo a cláusula `LOCK` é o mesmo que especificar `LOCK=DEFAULT`.

  Use esta cláusula quando você não espera que o nível de bloqueio padrão da instrução DDL cause problemas de disponibilidade para a tabela.

* `LOCK=EXCLUSIVE`:

  Bloqueia consultas concorrentes e DML.

  Use esta cláusula se a principal preocupação for terminar a operação DDL no menor tempo possível, e o acesso a consultas concorrentes e DML não for necessário. Você também pode usar esta cláusula se o servidor estiver supostamente inativo, para evitar acessos inesperados à tabela.

#### Lâminas DDL e Lâminas de Metadados Online

As operações DDL online podem ser vistas como tendo três fases:

* *Fase 1: Inicialização*

  Na fase de inicialização, o servidor determina o nível de concorrência permitido durante a operação, levando em conta as capacidades do motor de armazenamento, as operações especificadas na instrução e as opções `ALGORITHM` e `LOCK` especificadas pelo usuário. Durante esta fase, uma lã de metadados compartilhada e atualizável é adquirida para proteger a definição atual da tabela.

* *Fase 2: Execução*

Nesta fase, a declaração é preparada e executada. Se o bloqueio de metadados for atualizado para exclusivo, isso depende dos fatores avaliados na fase de inicialização. Se for necessário um bloqueio de metadados exclusivo, ele é concedido apenas por um breve período durante a preparação da declaração.

* *Fase 3: Definição da Tabela de Commit*

  Na fase de definição da tabela de commit, o bloqueio de metadados é atualizado para exclusivo para expulsar a antiga definição da tabela e comprometer a nova. Uma vez concedido, a duração do bloqueio de metadados exclusivo é breve.

Devido aos requisitos de bloqueio de metadados exclusivo descritos acima, uma operação DDL online pode ter que esperar por transações concorrentes que mantêm blocos de metadados na tabela para comprometer ou reverter. Transações iniciadas antes ou durante a operação DDL podem manter blocos de metadados na tabela que está sendo alterada. No caso de uma transação em execução ou inativa, uma operação DDL online pode expirar enquanto espera por um bloqueio de metadados exclusivo. Além disso, um bloqueio de metadados exclusivo pendente solicitado por uma operação DDL online bloqueia transações subsequentes na tabela.

O exemplo seguinte demonstra uma operação DDL online esperando por um bloqueio de metadados exclusivo e como um bloqueio de metadados pendente bloqueia transações subsequentes na tabela.

Sessão 1:

```
mysql> CREATE TABLE t1 (c1 INT) ENGINE=InnoDB;
mysql> START TRANSACTION;
mysql> SELECT * FROM t1;
```

A declaração `SELECT` da sessão 1 assume um bloqueio de metadados compartilhado na tabela t1.

Sessão 2:

```
mysql> ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE;
```

A operação DDL online na sessão 2, que requer um bloqueio de metadados exclusivo na tabela t1 para comprometer as alterações na definição da tabela, deve esperar para que a transação da sessão 1 seja comprometida ou revertida.

Sessão 3:

```
mysql> SELECT * FROM t1;
```

A declaração `SELECT` emitida na sessão 3 é bloqueada enquanto espera pelo bloqueio de metadados exclusivo solicitado pela operação `ALTER TABLE` na sessão 2 ser concedido.

Você pode usar `SHOW FULL PROCESSLIST` para determinar se as transações estão aguardando uma bloqueio de metadados.

```
mysql> SHOW FULL PROCESSLIST\G
...
*************************** 2. row ***************************
     Id: 5
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 44
  State: Waiting for table metadata lock
   Info: ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE
...
*************************** 4. row ***************************
     Id: 7
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 5
  State: Waiting for table metadata lock
   Info: SELECT * FROM t1
4 rows in set (0.00 sec)
```

As informações sobre bloqueio de metadados também são exibidas na tabela do Schema de Desempenho `metadata_locks`, que fornece informações sobre as dependências de bloqueio de metadados entre as sessões, o bloqueio de metadados que uma sessão está aguardando e a sessão que atualmente detém o bloqueio de metadados. Para mais informações, consulte a Seção 29.12.13.3, “A tabela metadata_locks”.

#### Desempenho de DDL Online

O desempenho de uma operação de DDL é em grande parte determinado se a operação é realizada instantaneamente, no local e se ela reconstrui a tabela.

Para avaliar o desempenho relativo de uma operação de DDL, você pode comparar os resultados usando `ALGORITHM=INSTANT`, `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Uma declaração também pode ser executada com `old_alter_table` habilitado para forçar o uso de `ALGORITHM=COPY`.

Para operações de DDL que modificam os dados da tabela, você pode determinar se uma operação de DDL realiza alterações no local ou realiza uma cópia da tabela olhando para o valor “rows affected” exibido após o comando terminar. Por exemplo:

* Alterar o valor padrão de uma coluna (rápido, não afeta os dados da tabela):

  ```
  Query OK, 0 rows affected (0.07 sec)
  ```

* Adicionar um índice (leva tempo, mas `0 rows affected` mostra que a tabela não é copiada):

  ```
  Query OK, 0 rows affected (21.42 sec)
  ```

* Alterar o tipo de dados de uma coluna (leva tempo substancial e requer a reconstrução de todas as linhas da tabela):

  ```
  Query OK, 1671168 rows affected (1 min 35.54 sec)
  ```

Antes de executar uma operação de DDL em uma tabela grande, verifique se a operação é rápida ou lenta da seguinte forma:

1. Faça uma cópia da estrutura da tabela.
2. Encha a tabela copiada com uma pequena quantidade de dados.
3. Execute a operação DDL na tabela copiada.
4. Verifique se o valor "linhas afetadas" é zero ou não. Um valor diferente de zero significa que a operação copia os dados da tabela, o que pode exigir um planejamento especial. Por exemplo, você pode realizar a operação DDL durante um período de indisponibilidade planejada ou em cada servidor replica um de cada vez.

Observação

Para uma melhor compreensão do processamento do MySQL associado a uma operação DDL, examine as tabelas do Schema de Desempenho e `INFORMATION_SCHEMA` relacionadas ao `InnoDB` antes e depois das operações DDL para ver o número de leituras físicas, escritas, alocações de memória, etc.

Os eventos de estágio do Schema de Desempenho podem ser usados para monitorar o progresso da operação `ALTER TABLE`. Veja a Seção 17.16.1, “Monitoramento do Progresso da ALTER TABLE para Tabelas InnoDB Usando o Schema de Desempenho”.

Como há algum trabalho de processamento envolvido na gravação das alterações feitas por operações DML concorrentes, e depois na aplicação dessas alterações no final, uma operação DDL online pode levar mais tempo no geral do que o mecanismo de cópia da tabela que bloqueia o acesso à tabela de outras sessões. A redução no desempenho bruto é compensada pela melhor capacidade de resposta para aplicativos que usam a tabela. Ao avaliar as técnicas para alterar a estrutura da tabela, considere a percepção do usuário final sobre o desempenho, com base em fatores como tempos de carregamento de páginas da web.