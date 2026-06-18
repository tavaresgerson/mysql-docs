### 8.11.2 Problemas com o bloqueio de tabelas

As tabelas do `InnoDB` usam o bloqueio de nível de linha para que várias sessões e aplicativos possam ler e escrever na mesma tabela simultaneamente, sem fazer com que um bloqueie o outro ou produzam resultados inconsistentes. Para este mecanismo de armazenamento, evite usar a instrução `LOCK TABLES`, pois ela não oferece nenhuma proteção extra, mas, em vez disso, reduz a concorrência. O bloqueio automático de nível de linha torna essas tabelas adequadas para seus bancos de dados mais movimentados com seus dados mais importantes, além de simplificar a lógica da aplicação, já que você não precisa bloquear e desbloquear tabelas. Consequentemente, o mecanismo de armazenamento `InnoDB` é o padrão no MySQL.

O MySQL usa o bloqueio de tabelas (em vez de bloqueio de páginas, linhas ou colunas) para todos os motores de armazenamento, exceto o `InnoDB`. As próprias operações de bloqueio não têm muito overhead. Mas, como apenas uma sessão pode escrever em uma tabela de cada vez, para obter o melhor desempenho com esses outros motores de armazenamento, use-os principalmente para tabelas que são consultadas com frequência e raramente inseridas ou atualizadas.

- Considerações de desempenho que favorecem o InnoDB
- Soluções alternativas para problemas de desempenho

#### Considerações de desempenho que favorecem o InnoDB

Ao decidir se deve criar uma tabela usando `InnoDB` ou outro mecanismo de armazenamento, lembre-se das seguintes desvantagens do bloqueio de tabelas:

- O bloqueio de uma tabela permite que várias sessões leiam uma tabela ao mesmo tempo, mas se uma sessão quiser escrever em uma tabela, ela deve primeiro obter acesso exclusivo, o que pode significar que ela terá que esperar que outras sessões terminem de usar a tabela primeiro. Durante a atualização, todas as outras sessões que quiserem acessar essa tabela específica devem esperar até que a atualização seja concluída.

- O bloqueio da tabela causa problemas quando uma sessão está aguardando porque o disco está cheio e o espaço livre precisa ficar disponível antes que a sessão possa prosseguir. Nesse caso, todas as sessões que desejam acessar a tabela com o problema também são colocadas em estado de espera até que mais espaço no disco esteja disponível.

- Uma instrução `SELECT` que leva muito tempo para ser executada impede que outras sessões atualizem a tabela enquanto isso, fazendo com que as outras sessões pareçam lentas ou não respondem. Enquanto uma sessão está esperando para obter acesso exclusivo à tabela para atualizações, outras sessões que emitem instruções `SELECT` ficam na fila atrás dela, reduzindo a concorrência mesmo para sessões de leitura apenas.

#### Soluções alternativas para problemas de desempenho

Os itens a seguir descrevem algumas maneiras de evitar ou reduzir a disputa causada pelo bloqueio de tabelas:

- Considere a possibilidade de mudar a tabela para o mecanismo de armazenamento `InnoDB`, usando `CREATE TABLE ... ENGINE=INNODB` durante a configuração ou usando `ALTER TABLE ... ENGINE=INNODB` para uma tabela existente. Consulte o Capítulo 14, *O Mecanismo de Armazenamento InnoDB* para obter mais detalhes sobre este mecanismo de armazenamento.

- Otimize as instruções `SELECT` para que elas sejam executadas mais rapidamente, garantindo que as tabelas sejam bloqueadas por um período menor. Você pode precisar criar algumas tabelas resumidas para isso.

- Inicie o **mysqld** com `--low-priority-updates`. Para os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`), isso dá a todas as instruções que atualizam (modificam) uma tabela uma prioridade menor do que as instruções `SELECT`. Neste caso, a segunda instrução `SELECT` no cenário anterior seria executada antes da instrução `UPDATE` e não aguardaria o término da primeira `SELECT`.

- Para especificar que todas as atualizações emitidas em uma conexão específica devem ser feitas com baixa prioridade, defina a variável de sistema do servidor `low_priority_updates` igual a 1.

- Para dar prioridade menor a uma instrução específica de `INSERT`, `UPDATE` ou `DELETE`, use o atributo `LOW_PRIORITY`.

- Para dar prioridade a uma instrução `SELECT` específica, use o atributo `HIGH_PRIORITY`. Veja a Seção 13.2.9, “Instrução SELECT”.

- Inicie o **mysqld** com um valor baixo para a variável de sistema `max_write_lock_count` para forçar o MySQL a elevar temporariamente a prioridade de todas as instruções `SELECT` que estão aguardando uma tabela após um número específico de bloqueios de escrita na tabela ocorrerem (por exemplo, para operações de inserção). Isso permite bloqueios de leitura após um certo número de bloqueios de escrita.

- Se você tiver problemas com instruções `SELECT` e `DELETE` mistas, a opção `LIMIT` para `DELETE` pode ajudar. Veja a Seção 13.2.2, “Instrução DELETE”.

- O uso de `SQL_BUFFER_RESULT` com instruções `SELECT` pode ajudar a reduzir a duração dos bloqueios de tabelas. Consulte a Seção 13.2.9, “Instrução SELECT”.

- Dividir o conteúdo da tabela em tabelas separadas pode ajudar, permitindo que consultas sejam executadas contra colunas de uma tabela, enquanto as atualizações são restritas a colunas de uma tabela diferente.

- Você poderia alterar o código de bloqueio em `mysys/thr_lock.c` para usar uma única fila. Nesse caso, as bloqueadas de escrita e as bloqueadas de leitura teriam a mesma prioridade, o que pode ajudar algumas aplicações.
