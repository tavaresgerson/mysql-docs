### 8.11.1 Métodos de Bloqueio Interno

Esta seção discute o bloqueio interno; ou seja, o bloqueio realizado dentro do próprio servidor MySQL para gerenciar a contenção pelo conteúdo da tabela por múltiplas sessões. Este tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Para bloqueio realizado em arquivos MySQL por outros programas, consulte a Seção 8.11.5, “External Locking”.

* Row-Level Locking
* Table-Level Locking
* Escolhendo o Tipo de Bloqueio

#### Row-Level Locking

O MySQL usa Row-Level Locking (bloqueio em nível de linha) para tabelas `InnoDB` para suportar acesso de escrita simultâneo por múltiplas sessões, tornando-as adequadas para aplicações multiusuário, de alta concorrência e OLTP.

Para evitar deadlocks ao realizar múltiplas operações de escrita concorrentes em uma única tabela `InnoDB`, adquira os Locks necessários no início da Transaction, emitindo uma instrução `SELECT ... FOR UPDATE` para cada grupo de linhas que se espera modificar, mesmo que as instruções de alteração de dados venham mais tarde na Transaction. Se as Transactions modificarem ou bloquearem mais de uma tabela, emita as instruções aplicáveis na mesma ordem dentro de cada Transaction. Deadlocks afetam o desempenho em vez de representar um erro grave, porque o `InnoDB` detecta automaticamente as condições de deadlock e reverte (rollback) uma das Transactions afetadas.

Em sistemas de alta concorrência, a detecção de deadlock pode causar uma lentidão quando numerosos Threads esperam pelo mesmo Lock. Às vezes, pode ser mais eficiente desabilitar a detecção de deadlock e confiar na configuração `innodb_lock_wait_timeout` para o rollback da Transaction quando um deadlock ocorrer. A detecção de deadlock pode ser desabilitada usando a opção de configuração `innodb_deadlock_detect`.

Vantagens do Row-Level Locking:

* Menos conflitos de Lock quando diferentes sessões acessam diferentes linhas.

* Menos alterações para rollbacks.
* Possibilidade de bloquear uma única linha por um longo tempo.

#### Table-Level Locking

O MySQL usa Table-Level Locking (bloqueio em nível de tabela) para tabelas `MyISAM`, `MEMORY` e `MERGE`, permitindo que apenas uma Session atualize essas tabelas por vez. Este nível de bloqueio torna esses Storage Engines mais adequados para aplicações somente leitura, predominantemente de leitura ou *single-user*.

Esses Storage Engines evitam deadlocks solicitando sempre todos os Locks necessários de uma vez no início de uma Query e bloqueando sempre as tabelas na mesma ordem. A compensação é que essa estratégia reduz a concorrência; outras sessões que desejam modificar a tabela devem esperar até que a instrução de alteração de dados atual termine.

Vantagens do Table-Level Locking:

* Memória relativamente baixa necessária (o bloqueio de linha requer memória por linha ou grupo de linhas bloqueadas).

* Rápido quando usado em uma grande parte da tabela, pois envolve apenas um único Lock.

* Rápido se você frequentemente executa operações `GROUP BY` em uma grande parte dos dados ou precisa varrer a tabela inteira frequentemente.

O MySQL concede Locks de escrita de tabela da seguinte forma:

1. Se não houver Locks na tabela, aplica-se um Lock de escrita nela.

2. Caso contrário, a solicitação de Lock é colocada na fila de Lock de escrita.

O MySQL concede Locks de leitura de tabela da seguinte forma:

1. Se não houver Locks de escrita na tabela, aplica-se um Lock de leitura nela.

2. Caso contrário, a solicitação de Lock é colocada na fila de Lock de leitura.

As atualizações de tabela recebem prioridade mais alta do que as recuperações de tabela. Portanto, quando um Lock é liberado, ele é disponibilizado para as requisições na fila de Lock de escrita e, em seguida, para as requisições na fila de Lock de leitura. Isso garante que as atualizações em uma tabela não sofram “starvation” (inanição), mesmo quando há intensa atividade de `SELECT` para a tabela. No entanto, se houver muitas atualizações para uma tabela, as instruções `SELECT` esperam até que não haja mais atualizações.

Para informações sobre como alterar a prioridade de leituras e escritas, consulte a Seção 8.11.2, “Table Locking Issues”.

Você pode analisar a contenção de Lock de tabela no seu sistema verificando as variáveis de Status `Table_locks_immediate` e `Table_locks_waited`, que indicam o número de vezes que as requisições de Locks de tabela puderam ser concedidas imediatamente e o número que teve que esperar, respectivamente:

```sql
mysql> SHOW STATUS LIKE 'Table%';
+-----------------------+---------+
| Variable_name         | Value   |
+-----------------------+---------+
| Table_locks_immediate | 1151552 |
| Table_locks_waited    | 15324   |
+-----------------------+---------+
```

As tabelas de Lock do Performance Schema também fornecem informações de bloqueio. Consulte a Seção 25.12.12, “Performance Schema Lock Tables”.

O Storage Engine `MyISAM` suporta *Inserts* concorrentes para reduzir a contenção entre leitores e escritores para uma determinada tabela: Se uma tabela `MyISAM` não tiver blocos livres no meio do arquivo de dados, as linhas são sempre inseridas no final do arquivo de dados. Neste caso, você pode misturar livremente instruções `INSERT` e `SELECT` concorrentes para uma tabela `MyISAM` sem Locks. Ou seja, você pode inserir linhas em uma tabela `MyISAM` ao mesmo tempo em que outros clientes estão lendo dela. Lacunas (Holes) podem resultar de linhas que foram excluídas ou atualizadas no meio da tabela. Se houver lacunas, os Inserts concorrentes são desabilitados, mas são habilitados novamente automaticamente quando todas as lacunas forem preenchidas com novos dados. Para controlar esse comportamento, use a variável de sistema `concurrent_insert`. Consulte a Seção 8.11.3, “Concurrent Inserts”.

Se você adquirir um Lock de tabela explicitamente com `LOCK TABLES`, você pode solicitar um Lock `READ LOCAL` em vez de um Lock `READ` para permitir que outras sessões realizem Inserts concorrentes enquanto a tabela estiver bloqueada por você.

Para executar muitas operações `INSERT` e `SELECT` em uma tabela `t1` quando Inserts concorrentes não são possíveis, você pode inserir linhas em uma tabela temporária `temp_t1` e atualizar a tabela real com as linhas da tabela temporária:

```sql
mysql> LOCK TABLES t1 WRITE, temp_t1 WRITE;
mysql> INSERT INTO t1 SELECT * FROM temp_t1;
mysql> DELETE FROM temp_t1;
mysql> UNLOCK TABLES;
```

#### Escolhendo o Tipo de Bloqueio

Geralmente, Locks de tabela são superiores aos Locks em nível de linha nos seguintes casos:

* A maioria das instruções para a tabela são leituras.
* As instruções para a tabela são uma mistura de leituras e escritas, onde as escritas são Updates ou Deletes para uma única linha que pode ser recuperada com uma leitura de Key:

  ```sql
  UPDATE tbl_name SET column=value WHERE unique_key_col=key_value;
  DELETE FROM tbl_name WHERE unique_key_col=key_value;
  ```

* `SELECT` combinado com instruções `INSERT` concorrentes, e muito poucas instruções `UPDATE` ou `DELETE`.

* Muitas varreduras ou operações `GROUP BY` na tabela inteira sem quaisquer escritores.

Com Locks de nível superior, você pode ajustar (tune) as aplicações mais facilmente, suportando Locks de diferentes tipos, porque o overhead de Lock é menor do que para Locks em nível de linha.

Opções além do Row-Level Locking:

* Versionamento (como o usado no MySQL para Inserts concorrentes) onde é possível ter um escritor ao mesmo tempo que muitos leitores. Isso significa que o Database ou a tabela suporta diferentes visualizações para os dados, dependendo de quando o acesso começa. Outros termos comuns para isso são “time travel” (viagem no tempo), “copy on write” (cópia na escrita) ou “copy on demand” (cópia sob demanda).

* A cópia sob demanda é em muitos casos superior ao Row-Level Locking. No entanto, no pior caso, pode usar muito mais memória do que usar Locks normais.

* Em vez de usar Locks em nível de linha, você pode empregar Locks em nível de aplicação, como aqueles fornecidos por `GET_LOCK()` e `RELEASE_LOCK()` no MySQL. Estes são Locks consultivos (advisory locks), então eles funcionam apenas com aplicações que cooperam entre si. Consulte a Seção 12.14, “Locking Functions”.