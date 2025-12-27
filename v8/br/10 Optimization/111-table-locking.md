### 10.11.2 Problemas com o Bloqueio de Tabelas

As tabelas do `InnoDB` usam o bloqueio de nível de linha para que múltiplas sessões e aplicativos possam ler e escrever na mesma tabela simultaneamente, sem fazer com que uma espere enquanto a outra realiza a operação, e sem produzir resultados inconsistentes. Para este mecanismo de armazenamento, evite usar a instrução `LOCK TABLES`, pois ela não oferece nenhuma proteção extra, mas, em vez disso, reduz a concorrência. O bloqueio automático de nível de linha torna essas tabelas adequadas para seus bancos de dados mais movimentados com seus dados mais importantes, além de simplificar a lógica da aplicação, já que você não precisa bloquear e desbloquear tabelas. Consequentemente, o mecanismo de armazenamento `InnoDB` é o padrão no MySQL.

O MySQL usa o bloqueio de tabelas (em vez de bloqueio de página, linha ou coluna) para todos os mecanismos de armazenamento, exceto o `InnoDB`. As próprias operações de bloqueio não têm muito overhead. Mas, como apenas uma sessão pode escrever em uma tabela de cada vez, para obter o melhor desempenho com esses outros mecanismos de armazenamento, use-os principalmente para tabelas que são consultadas com frequência e raramente inseridas ou atualizadas.

*  Considerações de desempenho que favorecem o InnoDB
*  Solução para problemas de desempenho de bloqueio

* O bloqueio de tabelas permite que várias sessões leiam uma tabela ao mesmo tempo, mas se uma sessão quiser escrever em uma tabela, ela deve primeiro obter acesso exclusivo, o que pode significar que ela terá que esperar para que outras sessões terminem de usar a tabela primeiro. Durante a atualização, todas as outras sessões que quiserem acessar essa tabela específica devem esperar até que a atualização seja concluída.
* O bloqueio de tabelas causa problemas quando uma sessão está esperando porque o disco está cheio e o espaço livre precisa se tornar disponível antes que a sessão possa prosseguir. Nesse caso, todas as sessões que quiserem acessar a tabela problema também são colocadas em estado de espera até que mais espaço no disco seja disponibilizado.
* Uma instrução `SELECT` que leva muito tempo para ser executada impede que outras sessões atualizem a tabela enquanto isso, fazendo com que as outras sessões pareçam lentas ou não respondem. Enquanto uma sessão está esperando para obter acesso exclusivo à tabela para atualizações, outras sessões que emitem instruções `SELECT` ficam na fila atrás dela, reduzindo a concorrência mesmo para sessões de leitura apenas.

#### Soluções para Problemas de Desempenho de Bloqueio

Os seguintes itens descrevem algumas maneiras de evitar ou reduzir a concorrência causada pelo bloqueio de tabelas:
* Use o `LOCK TABLES` para bloquear uma tabela por um período de tempo específico. Isso permite que outras sessões acessem a tabela enquanto a sessão atual está bloqueando.
* Use o `SELECT ... FOR UPDATE` para garantir que uma sessão tenha acesso exclusivo à tabela enquanto estiver executando uma instrução `UPDATE`. Isso evita que outras sessões acessem a tabela enquanto a atualização estiver em andamento.
* Use o `SELECT ... FOR SHARE` para permitir que várias sessões acessem a tabela simultaneamente, mas com acesso compartilhado. Isso reduz a concorrência, mas ainda pode ser um problema em sistemas com muitos usuários.
* Use o `SELECT ... FOR SHARE` com o parâmetro `WITH (NOLOCK)` para permitir que várias sessões acessem a tabela simultaneamente sem bloqueá-la. Isso é útil em sistemas com muitos usuários, mas pode ser menos eficiente do que o `SELECT ... FOR UPDATE`.

* Considere a possibilidade de mudar o mecanismo de armazenamento para o `InnoDB`, seja usando `CREATE TABLE ... ENGINE=INNODB` durante a configuração, ou usando `ALTER TABLE ... ENGINE=INNODB` para uma tabela existente. Veja o Capítulo 17, *O Mecanismo de Armazenamento InnoDB* para mais detalhes sobre este mecanismo de armazenamento.
* Otimize as instruções `SELECT` para que elas sejam executadas mais rapidamente, para que elas bloqueiem tabelas por um tempo menor. Você pode precisar criar algumas tabelas resumidas para fazer isso.
* Inicie o `mysqld` com `--low-priority-updates`. Para mecanismos de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`), isso dá prioridade mais baixa a todas as instruções que atualizam (modificam) uma tabela do que às instruções `SELECT`. Neste caso, a segunda instrução `SELECT` no cenário anterior seria executada antes da instrução `UPDATE`, e não aguardaria o término da primeira `SELECT`.
* Para especificar que todas as atualizações emitidas em uma conexão específica devem ser feitas com baixa prioridade, defina a variável de sistema `low_priority_updates` igual a 1.
* Para dar prioridade mais baixa a uma instrução `INSERT`, `UPDATE` ou `DELETE` específica, use o atributo `LOW_PRIORITY`.
* Para dar prioridade mais alta a uma instrução `SELECT` específica, use o atributo `HIGH_PRIORITY`. Veja a Seção 15.2.13, “Instrução SELECT”.
* Inicie o `mysqld` com um valor baixo para a variável de sistema `max_write_lock_count` para forçar o MySQL a elevar temporariamente a prioridade de todas as instruções `SELECT` que estão esperando por uma tabela após um número específico de bloqueios de escrita na tabela ocorrerem (por exemplo, para operações de inserção). Isso permite bloqueios de leitura após um certo número de bloqueios de escrita.
* Se você tiver problemas com instruções `SELECT` e `DELETE` mistas, a opção `LIMIT` para `DELETE` pode ajudar. Veja a Seção 15.2.2, “Instrução DELETE”.
* Usar `SQL_BUFFER_RESULT` com instruções `SELECT` pode ajudar a reduzir a duração dos bloqueios de tabela. Veja a Seção 15.2.13, “Instrução SELECT”.
* Dividir o conteúdo da tabela em tabelas separadas pode ajudar, permitindo que consultas sejam executadas contra colunas em uma tabela, enquanto as atualizações são confinadas a colunas em uma tabela diferente.
* Você poderia alterar o código de bloqueio em `mysys/thr_lock.c` para usar uma única fila. Neste caso, bloqueios de escrita e bloqueios de leitura teriam a mesma prioridade, o que pode ajudar algumas aplicações.

Português (Brasil):