### 17.5.2 Buffer de Mudança

O buffer de mudança é uma estrutura de dados especial que armazena alterações em páginas de índice secundário quando essas páginas não estão no pool de buffer. As mudanças armazenadas, que podem resultar de operações de inserção, atualização ou exclusão (DML), são mescladas posteriormente quando as páginas são carregadas no pool de buffer por outras operações de leitura.

**Figura 17.3 Buffer de Mudança**

![Conteúdo é descrito no texto ao redor.](images/innodb-change-buffer.png)

Ao contrário dos índices agrupados, os índices secundários geralmente são não-unícos, e as inserções em índices secundários ocorrem em uma ordem relativamente aleatória. Da mesma forma, exclusões e atualizações podem afetar páginas de índice secundário que não estão adjacentes em uma árvore de índice. Mesclar as mudanças armazenadas em um momento posterior, quando as páginas afetadas são lidas no pool de buffer por outras operações, evita um acesso aleatório de I/O substancial que seria necessário para ler as páginas de índice secundário no pool de buffer a partir do disco.

Periodicamente, a operação de purga que é executada quando o sistema está quase parado ou durante uma parada lenta, escreve as páginas de índice atualizadas no disco. A operação de purga pode escrever blocos de disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse escrito no disco imediatamente.

A mesclagem do buffer de mudança pode levar várias horas quando há muitas linhas afetadas e vários índices secundários a serem atualizados. Durante esse tempo, o I/O de disco é aumentado, o que pode causar um desaceleração significativa para consultas dependentes de disco. A mesclagem do buffer de mudança também pode continuar a ocorrer após a transação ser confirmada e até mesmo após o desligamento e reinício do servidor (consulte a Seção 17.20.3, “Forçar a Recuperação do InnoDB” para mais informações).

Em memória, o buffer de alterações ocupa parte do pool de buffers. No disco, o buffer de alterações faz parte do espaço de tabela do sistema, onde as alterações de índices são armazenadas em cache quando o servidor de banco de dados é desligado.

O tipo de dados armazenado no buffer de alterações é regido pela variável `innodb_change_buffering`. Para mais informações, consulte Configurando o Bufferamento de Alterações. Você também pode configurar o tamanho máximo do buffer de alterações. Para mais informações, consulte Configurando o Tamanho Máximo do Buffer de Alterações.

O bufferamento de alterações não é suportado para um índice secundário se o índice contiver uma coluna de índice descendente ou se a chave primária incluir uma coluna de índice descendente.

Para respostas a perguntas frequentes sobre o buffer de alterações, consulte a Seção A.16, “MySQL 9.5 FAQ: Bufferamento de Alterações InnoDB”.

#### Configurando o Bufferamento de Alterações

Quando operações `INSERT`, `UPDATE` e `DELETE` são realizadas em uma tabela, os valores das colunas indexadas (particularmente os valores das chaves secundárias) muitas vezes estão em ordem não ordenada, exigindo um I/O substancial para atualizar os índices secundários. O buffer de alterações armazena as alterações nas entradas dos índices secundários quando a página relevante não está no pool de buffers, evitando assim operações I/O caras ao não ler a página imediatamente do disco. As alterações armazenadas no buffer são mescladas quando a página é carregada no pool de buffers e a página atualizada é posteriormente descarregada no disco. O principal thread do `InnoDB` mescla as alterações armazenadas no buffer quando o servidor está quase parado e durante uma desligada lenta.

Como pode resultar em menos leituras e escritas no disco, o bufferamento de alterações é mais valioso para cargas de trabalho que são limitadas por I/O; por exemplo, aplicativos com um alto volume de operações DML, como inserções em massa, se beneficiam do bufferamento de alterações.

No entanto, o buffer de alterações ocupa uma parte do pool de buffers, reduzindo a memória disponível para as páginas de cache de dados. Se o conjunto de trabalho quase cabe no pool de buffers ou se suas tabelas tiverem índices secundários relativamente poucos, pode ser útil desativar o bufferamento de alterações. Se o conjunto de dados em uso cabe inteiramente no pool de buffers, o bufferamento de alterações não impõe sobrecarga extra, pois ele só se aplica a páginas que não estão no pool de buffers.

A variável `innodb_change_buffering` controla a extensão em que o `InnoDB` realiza o bufferamento de alterações. Você pode habilitar ou desabilitar o bufferamento para inserções, operações de exclusão (quando os registros de índice são marcados inicialmente para exclusão) e operações de purga (quando os registros de índice são excluídos fisicamente). Uma operação de atualização é uma combinação de uma inserção e uma exclusão. O valor padrão de `innodb_change_buffering` é `none`, e os valores permitidos são descritos na documentação da `innodb_change_buffering`.

Você pode definir a variável `innodb_change_buffering` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou alterá-la dinamicamente com a instrução `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. A alteração do ajuste afeta o bufferamento de novas operações; a fusão de entradas bufferadas existentes não é afetada.

#### Configurando o Tamanho Máximo do Buffer de Alterações

A variável `innodb_change_buffer_max_size` permite configurar o tamanho máximo do buffer de alterações como uma porcentagem do tamanho total do pool de buffers. Por padrão, `innodb_change_buffer_max_size` está definido para 5. O ajuste máximo é 50.

Considere aumentar `innodb_change_buffer_max_size` em um servidor MySQL com alta atividade de inserção, atualização e exclusão, onde a fusão do buffer de alterações não acompanha as novas entradas no buffer de alterações, fazendo com que o buffer de alterações atinja seu limite máximo de tamanho.

Considere diminuir `innodb_change_buffer_max_size` em um servidor MySQL com dados estáticos usados para relatórios, ou se o buffer de alterações consumir muito do espaço de memória compartilhado com o pool de buffers, fazendo com que as páginas sejam eliminadas do pool de buffers mais cedo do que desejado.

Teste diferentes configurações com uma carga de trabalho representativa para determinar uma configuração ótima. A variável `innodb_change_buffer_max_size` é dinâmica, o que permite modificar a configuração sem reiniciar o servidor.

#### Monitoramento do Buffer de Alterações

As seguintes opções estão disponíveis para monitoramento do buffer de alterações:

* A saída do Monitor Padrão `InnoDB` inclui informações sobre o status do buffer de alterações. Para visualizar os dados do monitor, execute a instrução `SHOW ENGINE INNODB STATUS`.

  ```
  mysql> SHOW ENGINE INNODB STATUS\G
  ```

  As informações sobre o status do buffer de alterações estão localizadas sob o cabeçalho `INSERT BUFFER AND ADAPTIVE HASH INDEX` e aparecem de forma semelhante à seguinte:

  ```
  -------------------------------------
  INSERT BUFFER AND ADAPTIVE HASH INDEX
  -------------------------------------
  Ibuf: size 1, free list len 0, seg size 2, 0 merges
  merged operations:
   insert 0, delete mark 0, delete 0
  discarded operations:
   insert 0, delete mark 0, delete 0
  Hash table size 4425293, used cells 32, node heap has 1 buffer(s)
  13577.57 hash searches/s, 202.47 non-hash searches/s
  ```

  Para mais informações, consulte a Seção 17.17.3, “Monitor Padrão InnoDB e Monitor de Bloqueio”.

* A tabela do Esquema de Informações `INNODB_METRICS` fornece a maioria dos pontos de dados encontrados na saída do Monitor Padrão `InnoDB`, além de outros pontos de dados. Para visualizar as métricas do buffer de alterações e uma descrição de cada uma, execute a seguinte consulta:

  ```
  mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME LIKE '%ibuf%'\G
  ```

  Veja a Seção 17.15.6, “Tabela de Métricas do Esquema de Informações InnoDB”.

* A tabela do Esquema de Informações `INNODB_BUFFER_PAGE` fornece metadados sobre cada página no pool de buffers, incluindo páginas de índice de buffer de alterações e páginas de mapa de bits de buffer de alterações. As páginas de buffer de alterações são identificadas pelo `PAGE_TYPE`. `IBUF_INDEX` é o tipo de página para páginas de índice de buffer de alterações, e `IBUF_BITMAP` é o tipo de página para páginas de mapa de bits de buffer de alterações.

  Aviso

  A consulta à tabela `INNODB_BUFFER_PAGE` pode introduzir um sobrecarga significativa de desempenho. Para evitar impactar o desempenho, reproduza o problema que deseja investigar em uma instância de teste e execute suas consultas na instância de teste.

  Por exemplo, você pode consultar a tabela `INNODB_BUFFER_PAGE` para determinar o número aproximado de páginas `IBUF_INDEX` e `IBUF_BITMAP` como uma porcentagem do total de páginas do pool de buffers.

  ```
  mysql> SELECT (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
         WHERE PAGE_TYPE LIKE 'IBUF%') AS change_buffer_pages,
         (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE) AS total_pages,
         (SELECT ((change_buffer_pages/total_pages)*100))
         AS change_buffer_page_percentage;
  +---------------------+-------------+-------------------------------+
  | change_buffer_pages | total_pages | change_buffer_page_percentage |
  +---------------------+-------------+-------------------------------+
  |                  25 |        8192 |                        0.3052 |
  +---------------------+-------------+-------------------------------+
  ```

  Para obter informações sobre outros dados fornecidos pelo `INNODB_BUFFER_PAGE` table, consulte a Seção 28.4.2, “O Tabela do Esquema de Informações INNODB_BUFFER_PAGE”. Para informações sobre o uso relacionado, consulte a Seção 17.15.5, “Tabelas de Pool de Buffers do Esquema de Informações InnoDB”.

* O Esquema de Desempenho fornece instrumentação de espera por mutex de buffer de alterações para monitoramento avançado de desempenho. Para visualizar a instrumentação do buffer de alterações, execute a seguinte consulta:

  ```
  mysql> SELECT * FROM performance_schema.setup_instruments
         WHERE NAME LIKE '%wait/synch/mutex/innodb/ibuf%';
  +-------------------------------------------------------+---------+-------+
  | NAME                                                  | ENABLED | TIMED |
  +-------------------------------------------------------+---------+-------+
  | wait/synch/mutex/innodb/ibuf_bitmap_mutex             | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_mutex                    | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_pessimistic_insert_mutex | YES     | YES   |
  +-------------------------------------------------------+---------+-------+
  ```

  Para obter informações sobre o monitoramento das esperas por mutex do `InnoDB`, consulte a Seção 17.16.2, “Monitoramento das Esperas por Mutex do InnoDB Usando o Esquema de Desempenho”.