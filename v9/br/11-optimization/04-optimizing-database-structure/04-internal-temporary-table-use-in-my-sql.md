### 10.4.4 Uso de Tabelas Temporárias Internas no MySQL

Em alguns casos, o servidor cria tabelas temporárias internas durante o processamento de instruções. Os usuários não têm controle direto sobre quando isso ocorre.

O servidor cria tabelas temporárias sob condições como estas:

* Avaliação de instruções `UNION`, com algumas exceções descritas mais adiante.

* Avaliação de algumas visualizações, como aquelas que usam o algoritmo `TEMPTABLE`, `UNION` ou agregação.

* Avaliação de tabelas derivadas (consulte a Seção 15.2.15.8, “Tabelas Derivadas”).

* Avaliação de expressões de tabela comum (consulte a Seção 15.2.20, “Com (Expressões de Tabela Comum”)”).

* Tabelas criadas para materialização de subconsultas ou semijoin (consulte a Seção 10.2.2, “Otimizando Subconsultas, Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela Comum”).

* Avaliação de instruções que contêm uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou para as quais a cláusula `ORDER BY` ou `GROUP BY` contém colunas de tabelas diferentes da primeira tabela na fila de junção.

* A avaliação de `DISTINCT` combinada com `ORDER BY` pode exigir uma tabela temporária.

* Para consultas que usam o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária em memória, a menos que a consulta também contenha elementos (descritos mais adiante) que requerem armazenamento em disco.

* Para avaliar instruções `INSERT ... SELECT` que selecionam e inserem na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas do `SELECT`, e depois insere essas linhas na tabela de destino. Consulte a Seção 15.2.7.1, “Instrução INSERT ... SELECT”.

* Avaliação de múltiplas instruções `UPDATE` de tabela.

* Avaliação de expressões `GROUP_CONCAT()` ou `COUNT(DISTINCT)`.

* A avaliação de funções de janela (consulte a Seção 14.20, “Funções de Janela”) usa tabelas temporárias conforme necessário.

Para determinar se uma declaração requer uma tabela temporária, use `EXPLAIN` e verifique a coluna `Extra` para ver se diz `Usando temporária` (veja a Seção 10.8.1, “Otimizando consultas com EXPLAIN”). `EXPLAIN` não necessariamente diz `Usando temporária` para tabelas temporárias derivadas ou materializadas. Para declarações que usam funções de janela, `EXPLAIN` com `FORMAT=JSON` sempre fornece informações sobre as etapas de janela. Se as funções de janela usarem tabelas temporárias, isso é indicado para cada etapa.

Algumas condições de consulta impedem o uso de uma tabela temporária em memória, caso em que o servidor usa uma tabela em disco em vez disso:

* Presença de uma coluna `BLOB` ou `TEXT` na tabela. O mecanismo de armazenamento `TempTable`, que é o mecanismo de armazenamento padrão para tabelas temporárias internas em memória no MySQL 9.5, suporta tipos de objetos grandes binários. Veja Mecanismo de Armazenamento de Tabela Temporária Interna.

* Presença de qualquer coluna de string com um comprimento máximo maior que 512 (bytes para strings binárias, caracteres para strings não binárias) na lista `SELECT`, se `UNION` ou `UNION ALL` for usado.

* As declarações `SHOW COLUMNS` e `DESCRIBE` usam `BLOB` como o tipo para algumas colunas, portanto, a tabela temporária usada para os resultados é uma tabela em disco.

O servidor não usa uma tabela temporária para declarações `UNION` que atendem a certas qualificações. Em vez disso, ele retém da criação da tabela temporária apenas as estruturas de dados necessárias para realizar a conversão de tipos das colunas do resultado. A tabela não é totalmente instanciada e nenhuma linha é escrita nela ou lida dela; as linhas são enviadas diretamente ao cliente. O resultado é a redução da memória e dos requisitos de disco, e um atraso menor antes que a primeira linha seja enviada ao cliente, porque o servidor não precisa esperar até que o último bloco de consulta seja executado. A saída do bloco de consulta `EXPLAIN` e do rastreador do otimizador reflete essa estratégia de execução: O bloco de consulta `UNION RESULT` não está presente porque esse bloco corresponde à parte que lê da tabela temporária.

Essas condições qualificam uma `UNION` para avaliação sem uma tabela temporária:

* A união é `UNION ALL`, não `UNION` ou `UNION DISTINCT`.
* Não há cláusula `ORDER BY` global.
* A união não é o bloco de consulta de nível superior de uma declaração `{INSERT | REPLACE} ... SELECT ...`.

#### Motor de Armazenamento de Tabela Temporária Interna

Uma tabela temporária interna pode ser mantida na memória e processada pelo motor de armazenamento `TempTable` ou `MEMORY`, ou armazenada em disco pelo motor de armazenamento `InnoDB`.

##### Motor de Armazenamento para Tabelas Temporárias Internacionais em Memória

A variável `internal_tmp_mem_storage_engine` define o motor de armazenamento usado para tabelas temporárias internas em memória. Os valores permitidos são `TempTable` (o padrão) e `MEMORY`.

Observação

Configurar um ajuste de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

O motor de armazenamento `TempTable` fornece armazenamento eficiente para colunas `VARCHAR` e `VARBINARY` e outros tipos de objetos grandes binários.

As seguintes variáveis controlam os limites e o comportamento do mecanismo de armazenamento `TempTable`:

* `tmp_table_size`: Define o tamanho máximo de qualquer tabela temporária interna em memória criada usando o mecanismo de armazenamento `TempTable`. Quando o limite determinado por `tmp_table_size` é atingido, o MySQL converte automaticamente a tabela temporária interna em memória para uma tabela temporária interna `InnoDB` em disco, dependendo da sua configuração. O valor padrão é de 16777216 bytes (16 MiB).

  O limite `tmp_table_size` é destinado a impedir que consultas individuais consumam uma quantidade excessiva de recursos globais de `TempTable`, o que pode afetar o desempenho de consultas concorrentes que requerem tais recursos. Os recursos globais de `TempTable` são controlados por `temptable_max_ram` e `temptable_max_mmap`.

  Se `tmp_table_size` for menor que `temptable_max_ram`, não é possível que uma tabela temporária em memória use mais que `tmp_table_size`. Se `tmp_table_size` for maior que a soma de `temptable_max_ram` e `temptable_max_mmap`, uma tabela temporária em memória não pode usar mais que a soma dos limites `temptable_max_ram` e `temptable_max_mmap`.

* `temptable_max_ram`: Define a quantidade máxima de RAM que pode ser usada pelo mecanismo de armazenamento `TempTable` antes que ele comece a alocar espaço a partir de arquivos mapeados em memória ou antes que o MySQL comece a usar tabelas temporárias internas `InnoDB` em disco, dependendo da sua configuração. Se não for definido explicitamente, o valor de `temptable_max_ram` é de 3% da memória total disponível no servidor, com um mínimo de 1 GB e um máximo de 4 GB.

  Nota

`temptable_max_ram` não leva em conta o bloco de memória local de cada thread alocado para cada thread que usa o mecanismo de armazenamento `TempTable`. O tamanho do bloco de memória local de cada thread depende do tamanho da primeira solicitação de alocação de memória da thread. Se a solicitação for menor que 1 MB, o que é a maioria dos casos, o tamanho do bloco de memória local de cada thread é de 1 MB. Se a solicitação for maior que 1 MB, o tamanho do bloco de memória local de cada thread é aproximadamente o mesmo tamanho da solicitação inicial de memória. O bloco de memória local de cada thread é mantido no armazenamento local de cada thread até a saída da thread.

* `temptable_max_mmap`: Define a quantidade máxima de memória que o mecanismo de armazenamento `TempTable` é permitido alocar a partir de arquivos mapeados em memória antes que o MySQL comece a usar as tabelas temporárias internas `InnoDB` em disco. O valor padrão é `0` (desativado). O limite é destinado a evitar o risco de arquivos mapeados em memória usarem muito espaço no diretório temporário (`tmpdir`). `temptable_max_mmap = 0` desativa a alocação a partir de arquivos mapeados em memória, desativando efetivamente seu uso.

O uso de arquivos mapeados em memória pelo mecanismo de armazenamento `TempTable` é regido por essas regras:

* Arquivos temporários são criados no diretório definido pela variável `tmpdir`.

* Arquivos temporários são excluídos imediatamente após serem criados e abertos, e, portanto, não permanecem visíveis no diretório `tmpdir`. O espaço ocupado por arquivos temporários é mantido pelo sistema operacional enquanto os arquivos temporários estão abertos. O espaço é recuperado quando os arquivos temporários são fechados pelo mecanismo de armazenamento `TempTable`, ou quando o processo `mysqld` é encerrado.

* Os dados nunca são movidos entre a RAM e os arquivos temporários, dentro da RAM ou entre os arquivos temporários.

* Novos dados são armazenados na RAM se houver espaço disponível dentro do limite definido por `temptable_max_ram`. Caso contrário, novos dados são armazenados em arquivos temporários.

* Se houver espaço disponível na RAM após alguns dos dados de uma tabela serem escritos em arquivos temporários, é possível que os dados restantes da tabela sejam armazenados na RAM.

Ao usar o mecanismo de armazenamento `MEMORY` para tabelas temporárias em memória (`internal_tmp_mem_storage_engine=MEMORY`), o MySQL converte automaticamente uma tabela temporária em memória para uma tabela em disco se ela ficar muito grande. O tamanho máximo de uma tabela temporária em memória é definido pelo valor `tmp_table_size` ou `max_heap_table_size`, dependendo do menor valor. Isso difere das tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`. Para essas tabelas, apenas a variável `max_heap_table_size` determina o tamanho máximo que uma tabela pode crescer, e não há conversão para o formato em disco.

##### Mecanismo de Armazenamento para Tabelas Temporárias Internas em Disco

O MySQL 9.5 usa apenas o mecanismo de armazenamento `InnoDB` para tabelas temporárias internas em disco. (O mecanismo de armazenamento `MYISAM` não é mais suportado para esse propósito.)

As tabelas temporárias internas em disco do `InnoDB` são criadas em espaços temporários de sessões que residem no diretório de dados por padrão. Para mais informações, consulte a Seção 17.6.3.5, “Espaços Temporários de Tabelas”.

#### Formato de Armazenamento de Tabela Temporária Interna


Quando as tabelas temporárias internas de memória são gerenciadas pelo mecanismo de armazenamento `TempTable`, as linhas que incluem colunas `VARCHAR`, colunas `VARBINARY` e outras colunas de tipo objeto grande binário são representadas na memória por um array de células, com cada célula contendo uma bandeira `NULL`, o comprimento dos dados e um ponteiro de dados. Os valores das colunas são colocados em ordem consecutiva após o array, em uma única região de memória, sem preenchimento. Cada célula do array usa 16 bytes de armazenamento. O mesmo formato de armazenamento se aplica quando o mecanismo de armazenamento `TempTable` aloca espaço a partir de arquivos mapeados na memória.

Quando as tabelas temporárias internas de memória são gerenciadas pelo mecanismo de armazenamento `MEMORY`, o formato de linha de comprimento fixo é usado. Os valores das colunas `VARCHAR` e `VARBINARY` são preenchidos até o comprimento máximo da coluna, armazenando-os efetivamente como colunas `CHAR` e `BINARY`.

As tabelas temporárias internas no disco são sempre gerenciadas pelo `InnoDB`.

Ao usar o mecanismo de armazenamento `MEMORY`, as instruções podem inicialmente criar uma tabela temporária interna de memória e, em seguida, convertê-la em uma tabela em disco se a tabela se tornar muito grande. Nesse caso, pode-se obter um melhor desempenho ignorando a conversão e criando a tabela temporária interna no disco desde o início. A variável `big_tables` pode ser usada para forçar o armazenamento em disco das tabelas temporárias internas.

#### Monitoramento da Criação de Tabelas Temporárias Internas

Quando uma tabela temporária interna é criada na memória ou no disco, o servidor incrementa o valor `Created_tmp_tables`. Quando uma tabela temporária interna é criada no disco, o servidor incrementa o valor `Created_tmp_disk_tables`. Se muitas tabelas temporárias internas forem criadas no disco, considere ajustar os limites específicos do motor descritos em Mecanismo de Armazenamento de Tabelas Temporárias Internas.

Nota

Devido a uma limitação conhecida, o `Created_tmp_disk_tables` não contabiliza as tabelas temporárias on-disk criadas em arquivos mapeados em memória. Por padrão, o mecanismo de overflow do mecanismo de armazenamento TempTable cria tabelas temporárias internas em arquivos mapeados em memória. Veja o Mecanismo de Armazenamento de Tabela Temporária Interna.

Os instrumentos do Schema de Desempenho `memory/temptable/physical_ram` e `memory/temptable/physical_disk` podem ser usados para monitorar a alocação de espaço do `TempTable` da memória e do disco. `memory/temptable/physical_ram` relata a quantidade de RAM alocada. `memory/temptable/physical_disk` relata a quantidade de espaço alocado a partir do disco quando arquivos mapeados em memória são usados como o mecanismo de overflow do TempTable. Se o instrumento `physical_disk` relatar um valor diferente de 0 e arquivos mapeados em memória forem usados como o mecanismo de overflow do TempTable, um limite de memória do TempTable foi atingido em algum momento. Os dados podem ser consultados nas tabelas de resumo de memória do Schema de Desempenho, como `memory_summary_global_by_event_name`. Veja a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

#### Monitoramento da Conversão de Tabela Temporária Interna

Quando uma tabela temporária interna é convertida de memória para disco, o servidor incrementa as variáveis de status do sistema para rastrear essas mudanças:

* `TempTable_count_hit_max_ram` é incrementado quando o limite `temptable_max_ram` é atingido. Isso é específico para o mecanismo de armazenamento `TempTable` e é uma variável de status global.

* `Count_hit_tmp_table_size` é incrementado nessas condições:

  + Mecanismo de Armazenamento `TempTable`: se o limite `tmp_table_size` for atingido.

  + Mecanismo de Armazenamento `MEMORY`: se o valor menor do limite `tmp_table_size` ou `max_heap_table_size` for atingido.

Essa é uma variável de status global e de sessão.