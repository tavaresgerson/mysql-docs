### 14.13.2 Desempenho e Concorrência de DDL Online

O DDL online melhora vários aspectos do funcionamento do MySQL:

- As aplicações que acessam a tabela são mais responsivas porque as consultas e operações de manipulação de dados (DML) na tabela podem prosseguir enquanto a operação de definição de dados (DDL) está em andamento. A redução do bloqueio e a espera por recursos do servidor MySQL levam a uma maior escalabilidade, mesmo para operações que não estão envolvidas na operação de DDL.

- As operações in-place evitam o I/O de disco e os ciclos de CPU associados ao método de cópia de tabela, o que minimiza a carga geral no banco de dados. Minimizar a carga ajuda a manter um bom desempenho e alto desempenho durante a operação de DDL.

- As operações in-place leem menos dados no pool de buffer do que as operações de cópia de tabela, o que reduz a limpeza de dados acessados com frequência da memória. A limpeza de dados acessados com frequência pode causar uma queda temporária no desempenho após uma operação de DDL.

#### A cláusula LOCK

Por padrão, o MySQL usa o mínimo de bloqueio possível durante uma operação de DDL. A cláusula `LOCK` pode ser especificada para impor um bloqueio mais restritivo, se necessário. Se a cláusula `LOCK` especificar um nível de bloqueio menos restritivo do que o permitido para uma operação específica de DDL, a instrução falhará com um erro. As cláusulas `LOCK` são descritas abaixo, em ordem de menos restritiva para a mais restritiva:

- `LOCK=NONE`:

  Permite consultas concorrentes e DML.

  Por exemplo, use esta cláusula para tabelas que envolvem inscrições ou compras de clientes, para evitar que as tabelas fiquem indisponíveis durante operações DDL longas.

- `LOCK=SHARED`:

  Permite consultas concorrentes, mas bloqueia DML.

  Por exemplo, use esta cláusula em tabelas de armazém de dados, onde você pode adiar operações de carregamento de dados até que a operação de DDL esteja concluída, mas as consultas não podem ser adiadas por longos períodos.

- `LOCK=DEFAULT`:

  Permite a concorrência o máximo possível (consultas concorrentes, DML ou ambas). Ignorar a cláusula `LOCK` é o mesmo que especificar `LOCK=DEFAULT`.

  Use esta cláusula quando você sabe que o nível de bloqueio padrão da instrução DDL não causa problemas de disponibilidade para a tabela.

- `LOCK=EXCLUSIVE`:

  Bloqueia consultas concorrentes e DML.

  Use esta cláusula se a principal preocupação for terminar a operação DDL no menor tempo possível e se o acesso simultâneo a consultas e DML não for necessário. Você também pode usar esta cláusula se o servidor estiver supostamente inativo, para evitar acessos inesperados à tabela.

#### Bloqueios de DDL e metadados online

As operações de DDL online podem ser vistas como tendo três fases:

- *Fase 1: Inicialização*

  Na fase de inicialização, o servidor determina o nível de concorrência permitido durante a operação, levando em consideração as capacidades do mecanismo de armazenamento, as operações especificadas na instrução e as opções `ALGORITHM` e `LOCK` especificadas pelo usuário. Durante essa fase, uma bloqueador de metadados compartilhado e atualizável é tomado para proteger a definição atual da tabela.

- *Fase 2: Execução*

  Nesta fase, a declaração é preparada e executada. Se a restrição de metadados for atualizada para exclusiva, isso depende dos fatores avaliados na fase de inicialização. Se for necessário um bloqueio de metadados exclusivo, ele é apenas temporariamente tomado durante a preparação da declaração.

- *Fase 3: Definição da Tabela de Compromissos*

  Na fase de definição da tabela de commit, o bloqueio de metadados é atualizado para exclusivo para expulsar a definição antiga da tabela e confirmar a nova. Uma vez concedido, a duração do bloqueio exclusivo de metadados é breve.

Devido aos requisitos exclusivos de bloqueio de metadados descritos acima, uma operação online de DDL pode ter que esperar por transações concorrentes que mantêm bloqueios de metadados na tabela para serem concluídas ou revertidas. Transações iniciadas antes ou durante a operação de DDL podem manter bloqueios de metadados na tabela que está sendo alterada. No caso de uma transação em execução ou inativa, uma operação online de DDL pode expirar enquanto espera por um bloqueio de metadados exclusivo. Além disso, um bloqueio de metadados exclusivo pendente solicitado por uma operação online de DDL bloqueia transações subsequentes na tabela.

O exemplo a seguir demonstra uma operação DDL online aguardando uma bloqueio exclusivo de metadados e como um bloqueio de metadados pendente bloqueia transações subsequentes na tabela.

Sessão 1:

```sql
mysql> CREATE TABLE t1 (c1 INT) ENGINE=InnoDB;
mysql> START TRANSACTION;
mysql> SELECT * FROM t1;
```

A instrução `SELECT` da sessão 1 obtém uma bloqueio de metadados compartilhado na tabela t1.

Sessão 2:

```sql
mysql> ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE;
```

A operação DDL online na sessão 2, que requer um bloqueio exclusivo de metadados na tabela t1 para confirmar as alterações na definição da tabela, deve esperar que a transação da sessão 1 seja confirmada ou revertida.

Sessão 3:

```sql
mysql> SELECT * FROM t1;
```

A instrução `SELECT` emitida na sessão 3 está bloqueada enquanto espera que a restrição exclusiva de metadados solicitada pela operação `ALTER TABLE` na sessão 2 seja concedida.

Você pode usar `SHOW FULL PROCESSLIST` para determinar se as transações estão aguardando uma restrição de metadados.

```sql
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

As informações de bloqueio de metadados também são exibidas na tabela do Schema de Desempenho `metadata_locks`, que fornece informações sobre as dependências de bloqueio de metadados entre as sessões, o bloqueio de metadados que uma sessão está aguardando e a sessão que atualmente detém o bloqueio de metadados. Para mais informações, consulte a Seção 25.12.12.1, “A Tabela metadata\_locks”.

#### Desempenho de DDL online

O desempenho de uma operação DDL é muito influenciado pela execução local e pela reconstrução da tabela.

Para avaliar o desempenho relativo de uma operação DDL, você pode comparar os resultados usando `ALGORITHM=INPLACE` com os resultados usando `ALGORITHM=COPY`. Alternativamente, você pode comparar os resultados com `old_alter_table` desativado e ativado.

Para operações de DDL que modificam dados de tabelas, você pode determinar se uma operação de DDL realiza alterações no local ou realiza uma cópia da tabela observando o valor "linhas afetadas" exibido após o comando terminar. Por exemplo:

- Alterar o valor padrão de uma coluna (rápido, não afeta os dados da tabela):

  ```sql
  Query OK, 0 rows affected (0.07 sec)
  ```

- Adicionar um índice (leva tempo, mas `0 linhas afetadas` mostra que a tabela não foi copiada):

  ```sql
  Query OK, 0 rows affected (21.42 sec)
  ```

- Alterar o tipo de dados de uma coluna (leva tempo substancial e exige a reconstrução de todas as linhas da tabela):

  ```sql
  Query OK, 1671168 rows affected (1 min 35.54 sec)
  ```

Antes de executar uma operação DDL em uma grande tabela, verifique se a operação é rápida ou lenta da seguinte forma:

1. Clone a estrutura da tabela.
2. Popule a tabela clonada com uma pequena quantidade de dados.
3. Execute a operação DDL na tabela clonada.
4. Verifique se o valor "linhas afetadas" é zero ou não. Um valor diferente de zero significa que a operação copia os dados da tabela, o que pode exigir um planejamento especial. Por exemplo, você pode realizar a operação DDL durante um período de indisponibilidade programada ou em cada servidor replica um de cada vez.

Nota

Para uma melhor compreensão do processamento do MySQL associado a uma operação DDL, examine o Gerenciador de Desempenho e as tabelas `INFORMATION_SCHEMA` relacionadas ao `InnoDB` antes e depois das operações DDL para ver o número de leituras físicas, escritas, alocações de memória, etc.

Os eventos de estágio do esquema de desempenho podem ser usados para monitorar o progresso da instrução `ALTER TABLE`. Consulte a Seção 14.17.1, “Monitorando o progresso da instrução ALTER TABLE para tabelas InnoDB usando o esquema de desempenho”.

Como há algum trabalho de processamento envolvido na gravação das alterações feitas por operações DML concorrentes e na aplicação dessas alterações no final, uma operação DDL online pode levar mais tempo no geral do que o mecanismo de cópia de tabela que bloqueia o acesso à tabela de outras sessões. A redução no desempenho bruto é compensada pela melhor capacidade de resposta para aplicativos que usam a tabela. Ao avaliar as técnicas para alterar a estrutura da tabela, considere a percepção do usuário final sobre o desempenho, com base em fatores como tempos de carregamento de páginas da web.
