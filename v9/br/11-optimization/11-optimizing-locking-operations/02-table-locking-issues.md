### 10.11.2 Problemas com o Bloqueio de Tabelas

As tabelas do `InnoDB` usam o bloqueio de nível de linha para que várias sessões e aplicativos possam ler e escrever na mesma tabela simultaneamente, sem fazer com que uma espere a outra ou produzir resultados inconsistentes. Para este mecanismo de armazenamento, evite usar a instrução `LOCK TABLES`, pois ela não oferece nenhuma proteção extra, mas, em vez disso, reduz a concorrência. O bloqueio automático de nível de linha torna essas tabelas adequadas para seus bancos de dados mais movimentados com seus dados mais importantes, além de simplificar a lógica da aplicação, já que você não precisa bloquear e desbloquear tabelas. Consequentemente, o mecanismo de armazenamento `InnoDB` é o padrão no MySQL.

O MySQL usa o bloqueio de tabelas (em vez de bloqueio de página, linha ou coluna) para todos os mecanismos de armazenamento, exceto `InnoDB`. As próprias operações de bloqueio não têm muito overhead. Mas, como apenas uma sessão pode escrever em uma tabela de cada vez, para obter o melhor desempenho com esses outros mecanismos de armazenamento, use-os principalmente para tabelas que são consultadas com frequência e raramente inseridas ou atualizadas.

* Considerações de desempenho que favorecem o InnoDB
* Soluções para problemas de desempenho de bloqueio

#### Considerações de desempenho que favorecem o InnoDB

Ao escolher se deve criar uma tabela usando `InnoDB` ou outro mecanismo de armazenamento, tenha em mente as seguintes desvantagens do bloqueio de tabelas:

* O bloqueio de tabela permite que muitas sessões leiam uma tabela ao mesmo tempo, mas se uma sessão quiser escrever em uma tabela, ela deve primeiro obter acesso exclusivo, o que pode significar que ela terá que esperar para que outras sessões terminem com a tabela primeiro. Durante a atualização, todas as outras sessões que desejam acessar essa tabela específica devem esperar até que a atualização seja concluída.

* O bloqueio de uma tabela causa problemas quando uma sessão está aguardando porque o disco está cheio e o espaço livre precisa ficar disponível antes que a sessão possa prosseguir. Nesse caso, todas as sessões que desejam acessar a tabela com o problema também são colocadas em estado de espera até que mais espaço no disco esteja disponível.

* Uma instrução `SELECT` que leva muito tempo para ser executada impede que outras sessões atualizem a tabela enquanto isso, fazendo com que as outras sessões pareçam lentas ou não respondem. Enquanto uma sessão está aguardando para obter acesso exclusivo à tabela para atualizações, outras sessões que emitem instruções `SELECT` ficam na fila atrás dela, reduzindo a concorrência mesmo para sessões de leitura apenas.

#### Soluções para Problemas de Desempenho de Bloqueio

Os seguintes itens descrevem algumas maneiras de evitar ou reduzir a concorrência causada pelo bloqueio de tabelas:

* Considere mudar a tabela para o motor de armazenamento `InnoDB`, seja usando `CREATE TABLE ... ENGINE=INNODB` durante a configuração, ou usando `ALTER TABLE ... ENGINE=INNODB` para uma tabela existente. Veja o Capítulo 17, *O Motor de Armazenamento InnoDB* para mais detalhes sobre esse motor de armazenamento.

* Otimize as instruções `SELECT` para serem executadas mais rapidamente, para que elas bloqueiem as tabelas por um tempo menor. Você pode precisar criar algumas tabelas resumidas para fazer isso.

* Inicie o **mysqld** com `--low-priority-updates`. Para motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`), isso dá a todas as instruções que atualizam (modificam) uma tabela prioridade menor do que as instruções `SELECT`. Nesse caso, a segunda instrução `SELECT` no cenário anterior seria executada antes da instrução `UPDATE`, e não aguardaria o término da primeira `SELECT`.

* Para especificar que todas as atualizações emitidas em uma conexão específica devem ser feitas com prioridade baixa, defina a variável de sistema `low_priority_updates` igual a 1.

* Para dar prioridade mais baixa a uma declaração específica de `INSERT`, `UPDATE` ou `DELETE`, use o atributo `LOW_PRIORITY`.

* Para dar prioridade mais alta a uma declaração específica de `SELECT`, use o atributo `HIGH_PRIORITY`. Consulte a Seção 15.2.13, “Declaração SELECT”.

* Inicie o **mysqld** com um valor baixo para a variável de sistema `max_write_lock_count` para forçar o MySQL a elevar temporariamente a prioridade de todas as declarações `SELECT` que estão aguardando uma tabela após um número específico de bloqueios de escrita na tabela ocorrerem (por exemplo, para operações de inserção). Isso permite bloqueios de leitura após um certo número de bloqueios de escrita.

* Se você tiver problemas com declarações mistas de `SELECT` e `DELETE`, a opção `LIMIT` para `DELETE` pode ajudar. Consulte a Seção 15.2.2, “Declaração DELETE”.

* Usar `SQL_BUFFER_RESULT` com declarações `SELECT` pode ajudar a reduzir a duração dos bloqueios de tabela. Consulte a Seção 15.2.13, “Declaração SELECT”.

* Dividir o conteúdo da tabela em tabelas separadas pode ajudar, permitindo que consultas sejam executadas contra colunas em uma tabela, enquanto as atualizações são confinadas a colunas em uma tabela diferente.

* Você poderia alterar o código de bloqueio em `mysys/thr_lock.c` para usar uma única fila. Nesse caso, os bloqueios de escrita e de leitura teriam a mesma prioridade, o que pode ajudar algumas aplicações.