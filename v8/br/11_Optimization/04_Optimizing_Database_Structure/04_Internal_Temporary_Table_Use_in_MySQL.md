### 10.4.4 Uso de Tabela Temporária Interna no MySQL

Em alguns casos, o servidor cria tabelas temporárias internas durante o processamento de instruções. Os usuários não têm controle direto sobre quando isso ocorre.

O servidor cria tabelas temporárias em condições como essas:

- Avaliação das declarações `UNION`, com algumas exceções descritas mais adiante.

- Avaliação de algumas visualizações, como as que utilizam o algoritmo `TEMPTABLE`, `UNION` ou agregação.

- Avaliação de tabelas derivadas (consulte a Seção 15.2.15.8, “Tabelas Derivadas”).

- Avaliação de expressões de tabela comuns (consulte a Seção 15.2.20, “Com (Expressões de Tabela Comuns”)”).

- Tabelas criadas para materialização de subconsultas ou junções parciais (consulte a Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visualizações e expressões de tabela comuns”).

- Avaliação de declarações que contêm uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou para as quais a `ORDER BY` ou `GROUP BY` contém colunas de tabelas diferentes da primeira tabela na fila de junção.

- A avaliação de `DISTINCT` combinada com `ORDER BY` pode exigir uma tabela temporária.

- Para consultas que utilizam o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária de memória, a menos que a consulta também contenha elementos (descritos mais adiante) que exijam armazenamento em disco.

- Para avaliar as instruções `INSERT ... SELECT` que selecionam e inserem na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas do `SELECT`, e depois insere essas linhas na tabela de destino. Veja a Seção 15.2.7.1, “Instrução INSERT ... SELECT”.

- Avaliação de declarações de múltiplas tabelas `UPDATE`.

- Avaliação das expressões `GROUP_CONCAT()` ou `COUNT(DISTINCT)`.

- A avaliação de funções de janela (consulte a Seção 14.20, “Funções de Janela”) utiliza tabelas temporárias quando necessário.

Para determinar se uma declaração requer uma tabela temporária, use `EXPLAIN` e verifique a coluna `Extra` para ver se ela diz `Using temporary` (veja a Seção 10.8.1, “Otimizando Consultas com EXPLAIN”). `EXPLAIN` não necessariamente diz `Using temporary` para tabelas temporárias derivadas ou materializadas. Para declarações que usam funções de janela, `EXPLAIN` com `FORMAT=JSON` sempre fornece informações sobre os passos de janela. Se as funções de janela usarem tabelas temporárias, isso é indicado para cada passo.

Algumas condições de consulta impedem o uso de uma tabela temporária de memória, caso em que o servidor usa uma tabela em disco em vez disso:

- Presença de uma coluna `BLOB` ou `TEXT` na tabela. No entanto, o mecanismo de armazenamento `TempTable`, que é o mecanismo de armazenamento padrão para tabelas temporárias internas em memória no MySQL 8.0, suporta tipos de objetos grandes binários a partir do MySQL 8.0.13. Veja Mecanismo de Armazenamento de Tabelas Temporárias Internas.

- Presença de qualquer coluna de string com comprimento máximo maior que 512 (bytes para strings binárias, caracteres para strings não binárias) na lista `SELECT`, se `UNION` ou `UNION ALL` for usado.

- As instruções `SHOW COLUMNS` e `DESCRIBE` usam `BLOB` como o tipo para algumas colunas, portanto, a tabela temporária usada para os resultados é uma tabela em disco.

O servidor não usa uma tabela temporária para as instruções `UNION` que atendem a certas qualificações. Em vez disso, ele retém da criação da tabela temporária apenas as estruturas de dados necessárias para realizar a tipificação das colunas do resultado. A tabela não é totalmente instanciada e nenhuma linha é escrita nela ou lida dela; as linhas são enviadas diretamente ao cliente. O resultado é a redução da memória e dos requisitos de disco, e um atraso menor antes que a primeira linha seja enviada ao cliente, porque o servidor não precisa esperar até que o último bloco de consulta seja executado. A saída do registro de rastreamento `EXPLAIN` e do otimizador reflete essa estratégia de execução: O bloco de consulta `UNION RESULT` não está presente porque esse bloco corresponde à parte que lê da tabela temporária.

Essas condições qualificam um `UNION` para avaliação sem uma tabela temporária:

- A união é `UNION ALL`, não `UNION` ou `UNION DISTINCT`.

- Não há cláusula global `ORDER BY`.

- A união não é o bloco de consulta de nível superior de uma declaração `{INSERT | REPLACE} ... SELECT ...`.

#### Motor de Armazenamento Temporário de Tabelas Internas

Uma tabela temporária interna pode ser mantida na memória e processada pelo mecanismo de armazenamento `TempTable` ou `MEMORY` ou armazenada em disco pelo mecanismo de armazenamento `InnoDB`.

##### Motor de Armazenamento para Tabelas Temporárias Internas em Memória

A variável `internal_tmp_mem_storage_engine` define o mecanismo de armazenamento usado para tabelas temporárias internas de memória. Os valores permitidos são `TempTable` (o padrão) e `MEMORY`.

Nota

A partir do MySQL 8.0.27, a configuração de um ajuste de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

O mecanismo de armazenamento `TempTable` oferece armazenamento eficiente para as colunas `VARCHAR` e `VARBINARY` e outros tipos de objetos grandes binários a partir do MySQL 8.0.13.

As seguintes variáveis controlam os limites e o comportamento do mecanismo de armazenamento TempTable:

- `tmp_table_size`: A partir do MySQL 8.0.28, `tmp_table_size` define o tamanho máximo de qualquer tabela temporária interna em memória criada pelo mecanismo de armazenamento TempTable. Quando o limite `tmp_table_size` é atingido, o MySQL converte automaticamente a tabela temporária interna em memória para uma tabela temporária interna em disco `InnoDB`. O valor padrão de `tmp_table_size` é de 16777216 bytes (16 MiB).

  O limite `tmp_table_size` é destinado a impedir que consultas individuais consumam uma quantidade excessiva de recursos globais da TempTable, o que pode afetar o desempenho de consultas concorrentes que requerem recursos da TempTable. Os recursos globais da TempTable são controlados pelas configurações `temptable_max_ram` e `temptable_max_mmap`.

  Se o limite `tmp_table_size` for menor que o limite `temptable_max_ram`, não é possível que uma tabela temporária em memória contenha mais dados do que o permitido pelo limite `tmp_table_size`. Se o limite `tmp_table_size` for maior que a soma dos limites `temptable_max_ram` e `temptable_max_mmap`, não é possível que uma tabela temporária em memória contenha mais do que a soma dos limites `temptable_max_ram` e `temptable_max_mmap`.

- `temptable_max_ram`: Define a quantidade máxima de RAM que pode ser usada pelo motor de armazenamento `TempTable` antes que ele comece a alocar espaço a partir de arquivos mapeados na memória ou antes que o MySQL comece a usar as tabelas temporárias internas no disco `InnoDB`, dependendo da sua configuração. O valor padrão de `temptable_max_ram` é de 1073741824 bytes (1GiB).

  Nota

  A configuração `temptable_max_ram` não leva em conta o bloco de memória local de cada thread que utiliza o mecanismo de armazenamento `TempTable`. O tamanho do bloco de memória local de cada thread depende do tamanho da primeira solicitação de alocação de memória da thread. Se a solicitação for menor que 1 MB, o que ocorre na maioria dos casos, o tamanho do bloco de memória local é de 1 MB. Se a solicitação for maior que 1 MB, o tamanho do bloco de memória local é aproximadamente o mesmo do pedido inicial de memória. O bloco de memória local é mantido no armazenamento local de cada thread até a saída da thread.

- `temptable_use_mmap`: Controla se o mecanismo de armazenamento `TempTable` aloca espaço a partir de arquivos mapeados na memória ou se o MySQL usa tabelas temporárias internas no disco `InnoDB` quando o limite `temptable_max_ram` é excedido. O ajuste padrão é `temptable_use_mmap=ON`.

  Nota

  A variável `temptable_use_mmap` foi introduzida no MySQL 8.0.16 e descontinuada no MySQL 8.0.26; espere que o suporte a ela seja removido em uma versão futura do MySQL. Definir `temptable_max_mmap=0` é equivalente a definir `temptable_use_mmap=OFF`.

- `temptable_max_mmap`: Introduzido no MySQL 8.0.23. Define a quantidade máxima de memória que o mecanismo de armazenamento TempTable é permitido alocar a partir de arquivos mapeados em memória antes que o MySQL comece a usar as tabelas temporárias internas `InnoDB` no disco. O ajuste padrão é de 1073741824 bytes (1GiB). O limite visa mitigar o risco de arquivos mapeados em memória usarem muito espaço no diretório temporário (`tmpdir`). Um ajuste `temptable_max_mmap=0` desabilita a alocação a partir de arquivos mapeados em memória, desabilitando efetivamente seu uso, independentemente do ajuste `temptable_use_mmap`.

O uso de arquivos mapeados na memória pelo motor de armazenamento `TempTable` é regido por essas regras:

- Os arquivos temporários são criados no diretório definido pela variável `tmpdir`.

- Os arquivos temporários são excluídos imediatamente após serem criados e abertos, e, portanto, não permanecem visíveis no diretório `tmpdir`. O espaço ocupado pelos arquivos temporários é mantido pelo sistema operacional enquanto os arquivos temporários estiverem abertos. O espaço é recuperado quando os arquivos temporários são fechados pelo mecanismo de armazenamento `TempTable` ou quando o processo `mysqld` é encerrado.

- Os dados nunca são movidos entre a RAM e os arquivos temporários, dentro da RAM ou entre os arquivos temporários.

- Novos dados são armazenados na RAM se houver espaço disponível dentro do limite definido por `temptable_max_ram`. Caso contrário, novos dados são armazenados em arquivos temporários.

- Se o espaço disponível na RAM ficar disponível após alguns dados de uma tabela serem escritos em arquivos temporários, é possível que os dados restantes da tabela sejam armazenados na RAM.

Ao usar o mecanismo de armazenamento `MEMORY` para tabelas temporárias em memória (`internal_tmp_mem_storage_engine=MEMORY`), o MySQL converte automaticamente uma tabela temporária em memória para uma tabela em disco se ela ficar muito grande. O tamanho máximo de uma tabela temporária em memória é definido pelo valor `tmp_table_size` ou `max_heap_table_size`, dependendo do menor valor. Isso difere das tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`. Para essas tabelas, apenas a variável `max_heap_table_size` determina o tamanho máximo que uma tabela pode crescer, e não há conversão para o formato em disco.

##### Motor de Armazenamento para Tabelas Temporárias Internas em Disco

No MySQL 8.0.15 e versões anteriores, a variável `internal_tmp_disk_storage_engine` definia o mecanismo de armazenamento usado para tabelas temporárias internas no disco. Os mecanismos de armazenamento suportados eram `InnoDB` e `MyISAM`.

A partir do MySQL 8.0.16, o MySQL usa apenas o mecanismo de armazenamento `InnoDB` para tabelas temporárias internas no disco. O mecanismo de armazenamento `MYISAM` não é mais suportado para esse propósito.

As tabelas internas temporárias on-disk `InnoDB` são criadas em espaços de tabelas temporárias de sessão que residem no diretório de dados por padrão. Para obter mais informações, consulte a Seção 17.6.3.5, “Espaços de tabelas temporárias”.

Em MySQL 8.0.15 e versões anteriores:

- Para expressões de tabela comuns (CTEs), o mecanismo de armazenamento usado para tabelas temporárias internas em disco não pode ser `MyISAM`. Se for `internal_tmp_disk_storage_engine=MYISAM`, ocorrerá um erro para qualquer tentativa de materializar uma CTE usando uma tabela temporária em disco.

- Ao usar `internal_tmp_disk_storage_engine=INNODB`, consultas que geram tabelas internas temporárias no disco que excedam os limites de linha ou coluna `InnoDB` retornam erros de Tamanho da linha muito grande ou Muitas colunas. A solução é definir `internal_tmp_disk_storage_engine` para `MYISAM`.

#### Formato de Armazenamento Temporário de Tabela Interna

Quando as tabelas internas temporárias de memória são gerenciadas pelo motor de armazenamento `TempTable`, as linhas que incluem as colunas `VARCHAR` e `VARBINARY` e outras colunas de tipo objeto grande binário (compatíveis a partir do MySQL 8.0.13) são representadas na memória por um array de células, com cada célula contendo uma bandeira NULL, o comprimento dos dados e um ponteiro de dados. Os valores das colunas são colocados em ordem consecutiva após o array, em uma única região de memória, sem preenchimento. Cada célula do array usa 16 bytes de armazenamento. O mesmo formato de armazenamento se aplica quando o motor de armazenamento `TempTable` aloca espaço a partir de arquivos mapeados na memória.

Quando as tabelas internas temporárias de memória são gerenciadas pelo motor de armazenamento `MEMORY`, o formato de linha de comprimento fixo é utilizado. Os valores das colunas `VARCHAR` e `VARBINARY` são preenchidos com o comprimento máximo da coluna, armazenando-os efetivamente como colunas `CHAR` e `BINARY`.

Antes do MySQL 8.0.16, as tabelas temporárias internas no disco eram gerenciadas pelo mecanismo de armazenamento `InnoDB` ou `MyISAM` (dependendo da configuração `internal_tmp_disk_storage_engine`). Ambos os mecanismos armazenam tabelas temporárias internas usando um formato de linha de largura dinâmica. As colunas ocupam apenas o armazenamento necessário, o que reduz o I/O de disco, os requisitos de espaço e o tempo de processamento em comparação com tabelas no disco que usam linhas de comprimento fixo. A partir do MySQL 8.0.16, o `internal_tmp_disk_storage_engine` não é suportado, e as tabelas temporárias internas no disco são sempre gerenciadas pelo `InnoDB`.

Ao usar o mecanismo de armazenamento `MEMORY`, as declarações podem inicialmente criar uma tabela temporária interna em memória e, em seguida, convertê-la em uma tabela em disco se a tabela se tornar muito grande. Nesse caso, um melhor desempenho pode ser alcançado ignorando a conversão e criando a tabela temporária interna em disco desde o início. A variável `big_tables` pode ser usada para forçar o armazenamento em disco das tabelas temporárias internas.

#### Monitoramento da Criação Interna de Tabelas Temporárias

Quando uma tabela temporária interna é criada na memória ou no disco, o servidor incrementa o valor `Created_tmp_tables`. Quando uma tabela temporária interna é criada no disco, o servidor incrementa o valor `Created_tmp_disk_tables`. Se forem criadas muitas tabelas temporárias internas no disco, considere ajustar os limites específicos do motor descritos em Armazenamento de motores de tabela temporária interna.

Nota

Devido a uma limitação conhecida, o `Created_tmp_disk_tables` não conta tabelas temporárias criadas em arquivos mapeados em memória. Por padrão, o mecanismo de overflow do mecanismo de armazenamento TempTable cria tabelas temporárias internas em arquivos mapeados em memória. Veja o mecanismo de armazenamento de tabelas temporárias internas.

Os instrumentos do esquema de desempenho `memory/temptable/physical_ram` e `memory/temptable/physical_disk` podem ser usados para monitorar a alocação de espaço `TempTable` da memória e do disco. `memory/temptable/physical_ram` relata a quantidade de RAM alocada. `memory/temptable/physical_disk` relata a quantidade de espaço alocado a partir do disco quando os arquivos mapeados na memória são usados como mecanismo de overflow da TempTable. Se o instrumento `physical_disk` relatar um valor diferente de 0 e os arquivos mapeados na memória forem usados como mecanismo de overflow da TempTable, um limite de memória da TempTable foi atingido em algum momento. Os dados podem ser consultados nas tabelas de resumo de memória do esquema de desempenho, como `memory_summary_global_by_event_name`. Veja a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.
