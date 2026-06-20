## 8.4 Otimizando a Estrutura do Banco de Dados

No seu papel como projetista de banco de dados, procure a maneira mais eficiente de organizar seus esquemas, tabelas e colunas. Assim como ao ajustar o código de aplicativos, você minimiza o I/O, mantém itens relacionados juntos e planeja com antecedência para que o desempenho permaneça alto à medida que o volume de dados aumenta. Começar com um projeto de banco de dados eficiente facilita para os membros da equipe escrever código de aplicativo de alto desempenho e torna o banco de dados mais provável de suportar à medida que os aplicativos evoluem e são reescritos.

### 8.4.1 Otimizando o tamanho dos dados

Projete suas tabelas para minimizar seu espaço no disco. Isso pode resultar em melhorias enormes, reduzindo a quantidade de dados escritos e lidos do disco. Tabelas menores normalmente requerem menos memória principal, enquanto seus conteúdos estão sendo processados ativamente durante a execução da consulta. Qualquer redução de espaço para dados de tabela também resulta em índices menores que podem ser processados mais rapidamente.

O MySQL suporta muitos tipos de motores de armazenamento (tipos de tabela) e formatos de string. Para cada tabela, você pode decidir qual método de armazenamento e indexação usar. Escolher o formato de tabela adequado para sua aplicação pode lhe proporcionar um grande ganho de desempenho. Veja o Capítulo 14, *O Motor de Armazenamento InnoDB*, e o Capítulo 15, *Motores de Armazenamento Alternativos*.

Você pode obter um desempenho melhor para uma tabela e minimizar o espaço de armazenamento usando as técnicas listadas aqui:

* Colunas da tabela
* Formato de string
* Índices
* Conexões
* Normalização

#### Colunas da tabela

* Use os tipos de dados mais eficientes (menores) possíveis. O MySQL tem muitos tipos especializados que economizam espaço em disco e memória. Por exemplo, use os tipos de inteiro menores possível para obter tabelas menores. `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é frequentemente uma escolha melhor do que `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") porque uma coluna `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") usa 25% menos espaço.

* Declare as colunas como `NOT NULL` se possível. Isso torna as operações SQL mais rápidas, permitindo um melhor uso de índices e eliminando o overhead para testar se cada valor é `NULL`. Você também economiza um pouco de espaço de armazenamento, um bit por coluna. Se você realmente precisar de valores de `NULL` em suas tabelas, use-os. Apenas evite a configuração padrão que permite valores de `NULL` em todas as colunas.

#### Formato de string

As tabelas `InnoDB` são criadas usando o formato de string `DYNAMIC` por padrão. Para usar um formato de string diferente de `DYNAMIC`, configure `innodb_default_row_format`, ou especifique explicitamente a opção `ROW_FORMAT` em uma declaração `CREATE TABLE` ou `ALTER TABLE`.

A família compacta de formatos de string, que inclui `COMPACT`, `DYNAMIC` e `COMPRESSED`, diminui o espaço de armazenamento de string em detrimento do aumento do uso da CPU para algumas operações. Se sua carga de trabalho é típica e limitada pelas taxas de acerto de cache e velocidade do disco, é provável que seja mais rápida. Se for um caso raro que é limitado pela velocidade da CPU, pode ser mais lento.

A família compacta de formatos de string também otimiza o armazenamento de coluna `CHAR` quando se usa um conjunto de caracteres de comprimento variável, como `utf8mb3` ou `utf8mb4`. Com `ROW_FORMAT=REDUNDANT`, `CHAR(N)` ocupa *`N`* × o comprimento máximo de byte do conjunto de caracteres. Muitas linguagens podem ser escritas principalmente usando caracteres `utf8` de único byte, então um comprimento de armazenamento fixo muitas vezes desperdiça espaço. Com a família compacta de formatos de string, `InnoDB` aloca uma quantidade variável de armazenamento na faixa de *`N`* a *`N`* × o comprimento máximo de byte do conjunto de caracteres para essas colunas, removendo espaços finais. O comprimento mínimo de armazenamento é *`N`* bytes para facilitar atualizações no local em casos típicos. Para mais informações, consulte a Seção 14.11, “Formatos de String InnoDB”.

* Para minimizar ainda mais o espaço, armazenando os dados da tabela em forma comprimida, especifique `ROW_FORMAT=COMPRESSED` ao criar tabelas `InnoDB`, ou execute o comando **myisampack** em uma tabela `MyISAM` existente. (Tabelas comprimidas `InnoDB` são legíveis e modificáveis, enquanto as tabelas comprimidas `MyISAM` são somente de leitura.)

* Para as tabelas `MyISAM`, se você não tiver colunas de comprimento variável (colunas `VARCHAR`, `TEXT` ou `BLOB`), um formato de string de tamanho fixo é usado. Isso é mais rápido, mas pode desperdiçar algum espaço. Veja a Seção 15.2.3, “Formatos de Armazenamento de Tabelas MyISAM”. Você pode indicar que deseja ter strings de comprimento fixo, mesmo que tenha colunas `VARCHAR` com a opção `CREATE TABLE` `ROW_FORMAT=FIXED`.

#### Índices

* O índice primário de uma tabela deve ser o mais curto possível. Isso facilita e torna eficiente a identificação de cada string. Para as tabelas `InnoDB`, as colunas da chave primária são duplicadas em cada entrada do índice secundário, portanto, uma chave primária curta economiza um espaço considerável se você tiver muitos índices secundários.

* Crie apenas os índices que você precisa para melhorar o desempenho da consulta. Os índices são bons para recuperação, mas desaceleram as operações de inserção e atualização. Se você acessar uma tabela principalmente pesquisando em uma combinação de colunas, crie um único índice composto sobre elas, em vez de um índice separado para cada coluna. A primeira parte do índice deve ser a coluna mais usada. Se você *sempre* usar muitas colunas ao selecionar da tabela, a primeira coluna no índice deve ser a que tem mais duplicatas, para obter uma melhor compressão do índice.

* Se é muito provável que uma coluna de cadeia longa tenha um prefixo único no primeiro número de caracteres, é melhor indexar apenas esse prefixo, usando o suporte do MySQL para criar um índice na parte mais à esquerda da coluna (consulte Seção 13.1.14, “Instrução CREATE INDEX”). Índices mais curtos são mais rápidos, não apenas porque exigem menos espaço em disco, mas também porque também lhe dão mais acertos na cache do índice, e assim menos buscas em disco. Veja Seção 5.1.1, “Configurando o servidor”.

#### Conexões

* Em algumas circunstâncias, pode ser benéfico dividir uma tabela que é verificada com frequência em duas partes. Isso é especialmente verdadeiro se for uma tabela de formato dinâmico e é possível usar uma tabela de formato estático menor que pode ser usada para encontrar as strings relevantes ao verificar a tabela.

* Declare colunas com informações idênticas em diferentes tabelas com tipos de dados idênticos, para acelerar as junções com base nas colunas correspondentes.

* Mantenha os nomes das colunas simples, para que você possa usar o mesmo nome em diferentes tabelas e simplificar as consultas de junção. Por exemplo, em uma tabela chamada `customer`, use um nome de coluna de `name` em vez de `customer_name`. Para tornar seus nomes portáteis para outros servidores SQL, considere mantê-los mais curtos que 18 caracteres.

#### Normalização

* Normalmente, tente manter todos os dados não redundantes (observando o que é referido na teoria de banco de dados como terceira forma normal). Em vez de repetir valores extensos, como nomes e endereços, atribua-lhes IDs exclusivos, repita esses IDs conforme necessário em várias tabelas menores e faça a junção das tabelas em consultas, referenciando os IDs na cláusula de junção.

* Se a velocidade for mais importante do que o espaço em disco e os custos de manutenção de várias cópias de dados, por exemplo, em um cenário de inteligência empresarial onde você analisa todos os dados de grandes tabelas, você pode relaxar as regras de normalização, duplicando informações ou criando tabelas resumidas para obter mais velocidade.

### 8.4.2 Otimizando os tipos de dados do MySQL

#### 8.4.2.1 Otimização para dados numéricos

* Para IDs únicos ou outros valores que podem ser representados como strings ou números, prefira colunas numéricas em vez de colunas de texto. Como valores numéricos grandes podem ser armazenados em menos bytes do que as strings correspondentes, é mais rápido e consome menos memória para transferi-los e compará-los.

* Se você estiver usando dados numéricos, em muitos casos é mais rápido acessar informações de um banco de dados (usando uma conexão ao vivo) do que acessar um arquivo de texto. As informações no banco de dados provavelmente serão armazenadas em um formato mais compacto do que no arquivo de texto, então acessar isso envolve menos acessos ao disco. Você também economiza código em sua aplicação porque pode evitar analisar o arquivo de texto para encontrar limites de string e coluna.

#### 8.4.2.2 Otimizando para tipos de caracteres e strings

Para colunas de caracteres e de string, siga estas diretrizes:

* Use a ordem de ordenação binária para operações de comparação e ordenação rápidas, quando você não precisa de recursos de ordenação específicos para o idioma. Você pode usar o operador `BINARY` para usar ordenação binária em uma consulta específica.

* Ao comparar valores de diferentes colunas, declare essas colunas com o mesmo conjunto de caracteres e ordenação sempre que possível, para evitar conversões de cadeia ao executar a consulta.

* Para valores de coluna menores que 8 KB, use `VARCHAR` binário em vez de `BLOB`. As cláusulas `GROUP BY` e `ORDER BY` podem gerar tabelas temporárias, e essas tabelas temporárias podem usar o mecanismo de armazenamento `MEMORY` se a tabela original não contiver quaisquer colunas `BLOB`.

* Se uma tabela contiver colunas de texto, como nome e endereço, mas muitas consultas não recuperem essas colunas, considere dividir as colunas de texto em uma tabela separada e usar consultas de junção com uma chave estrangeira, quando necessário. Quando o MySQL recupera qualquer valor de uma string, ele lê um bloco de dados que contém todas as colunas daquela string (e possivelmente outras strings adjacentes). Manter cada string pequena, com apenas as colunas mais utilizadas, permite que mais strings se encaixem em cada bloco de dados. Tais tabelas compactas reduzem o I/O e o uso de memória para consultas comuns.

* Quando você usa um valor gerado aleatoriamente como chave primária em uma tabela `InnoDB`, prefixe-o com um valor ascendente, como a data e hora atuais, se possível. Quando valores primários consecutivos são armazenados fisicamente próximos uns dos outros, o `InnoDB` pode inserir e recuperar-los mais rapidamente.

* Veja a Seção 8.4.2.1, “Otimizando para Dados Numéricos”, para entender as razões pelas quais uma coluna numérica é geralmente preferível a uma coluna equivalente de texto.

#### 8.4.2.3 Otimização para tipos BLOB

* Ao armazenar um grande blob contendo dados textuais, considere comprimí-lo primeiro. Não use essa técnica quando toda a tabela é comprimida por `InnoDB` ou `MyISAM`.

* Para uma tabela com várias colunas, para reduzir os requisitos de memória para consultas que não utilizam a coluna BLOB, considere dividir a coluna BLOB em uma tabela separada e referenciá-la com uma consulta de junção quando necessário.

* Como os requisitos de desempenho para recuperar e exibir um valor BLOB podem ser muito diferentes de outros tipos de dados, você pode colocar a tabela específica para BLOB em um dispositivo de armazenamento diferente ou até mesmo em uma instância de banco de dados separada. Por exemplo, para recuperar um BLOB, pode ser necessário um grande leio sequencial em disco, que é mais adequado para um disco rígido tradicional do que para um dispositivo SSD.

* Veja a Seção 8.4.2.2, “Otimizando para Tipos de Caracteres e Strings”, para entender as razões pelas quais uma coluna `VARCHAR` binária é, às vezes, preferível a uma coluna BLOB equivalente.

* Em vez de testar a igualdade contra uma cadeia de texto muito longa, você pode armazenar um hash do valor da coluna em uma coluna separada, indexar essa coluna e testar o valor hashado em consultas. (Use a função `MD5()` ou `CRC32()` para produzir o valor do hash.) Como as funções de hash podem produzir resultados duplicados para diferentes entradas, você ainda inclui uma cláusula `AND blob_column = long_string_value` na consulta para evitar falsos resultados; o benefício de desempenho vem do índice menor e facilmente explorável para os valores hashedeados.

#### 8.4.2.4 Usando a ANÁLISE DE PROCEDIMENTO

`ANALYSE([max_elements[,max_memory]])`

Nota

`PROCEDURE ANALYSE()` é descontinuado a partir do MySQL 5.7.18 e é removido no MySQL 8.0.

`ANALYSE()` examina o resultado de uma consulta e retorna uma análise dos resultados que sugere os tipos de dados ótimos para cada coluna que pode ajudar a reduzir o tamanho da tabela. Para obter essa análise, adicione `PROCEDURE ANALYSE` ao final de uma declaração `SELECT`:

```sql
SELECT ... FROM ... WHERE ... PROCEDURE ANALYSE([max_elements,[max_memory]])
```

Por exemplo:

```sql
SELECT col1, col2 FROM table1 PROCEDURE ANALYSE(10, 2000);
```

Os resultados mostram algumas estatísticas para os valores retornados pela consulta e propõem um tipo de dado ótimo para as colunas. Isso pode ser útil para verificar suas tabelas existentes ou após a importação de novos dados. Você pode precisar experimentar diferentes configurações para os argumentos para que `PROCEDURE ANALYSE()` não sugira o tipo de dado `ENUM` quando não é apropriado.

Os argumentos são opcionais e são usados da seguinte forma:

* *`max_elements`* (padrão 256) é o número máximo de valores distintos que o `ANALYSE()` detecta por coluna. Isso é usado pelo `ANALYSE()` para verificar se o tipo de dados ótimo deve ser do tipo `ENUM`; se houver mais de *`max_elements`* valores distintos, então o `ENUM` não é um tipo sugerido.

* *`max_memory`* (padrão 8192) é a quantidade máxima de memória que o `ANALYSE()` deve alocar por coluna ao tentar encontrar todos os valores distintos.

Uma cláusula `PROCEDURE` não é permitida em uma declaração `UNION`.

### 8.4.3 Otimizando para muitas tabelas

Algumas técnicas para manter consultas individuais rápidas envolvem a divisão dos dados em várias tabelas. Quando o número de tabelas atinge milhares ou até milhões, o custo de lidar com todas essas tabelas se torna uma nova consideração de desempenho.

#### 8.4.3.1 Como o MySQL abre e fecha tabelas

Quando você executa o comando **mysqladmin status**, você deve ver algo como este:

```sql
Uptime: 426 Running threads: 1 Questions: 11082
Reloads: 1 Open tables: 12
```

O valor `Open tables` de 12 pode ser um pouco intrigante se você tiver menos de 12 tabelas.

O MySQL é multithread, então pode haver muitos clientes emitindo consultas para uma tabela dada simultaneamente. Para minimizar o problema de várias sessões de clientes com estados diferentes na mesma tabela, a tabela é aberta de forma independente por cada sessão concorrente. Isso utiliza memória adicional, mas normalmente aumenta o desempenho. Com as tabelas `MyISAM`, um descritor de arquivo adicional é necessário para o arquivo de dados para cada cliente que tem a tabela aberta. (Em contraste, o descritor de arquivo do índice é compartilhado entre todas as sessões.)

As variáveis de sistema `table_open_cache` e `max_connections` afetam o número máximo de arquivos que o servidor mantém abertos. Se você aumentar um ou ambos esses valores, pode encontrar um limite imposto pelo seu sistema operacional sobre o número de descritores de arquivo abertos por processo. Muitos sistemas operacionais permitem que você aumente o limite de arquivos abertos, embora o método varie muito de um sistema para outro. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso.

`table_open_cache` está relacionado a `max_connections`. Por exemplo, para 200 conexões em execução simultânea, especifique um tamanho de cache de tabela de pelo menos `200 * N`, onde *`N`* é o número máximo de tabelas por junção em qualquer das consultas que você executa. Você também deve reservar alguns descritores de arquivo extras para tabelas e arquivos temporários.

Certifique-se de que seu sistema operacional pode lidar com o número de descritores de arquivo abertos implícito pelo ajuste `table_open_cache`. Se `table_open_cache` estiver definido muito alto, o MySQL pode ficar sem descritores de arquivo e apresentar sintomas como recusar conexões ou não realizar consultas.

Além disso, tenha em conta que o motor de armazenamento `MyISAM` precisa de dois descritores de arquivo para cada tabela aberta de forma única. Para uma tabela `MyISAM` particionada, são necessários dois descritores de arquivo para cada partição da tabela aberta. (Quando o `MyISAM` abre uma tabela particionada, ele abre cada partição dessa tabela, independentemente de uma determinada partição ser ou não utilizada. Veja MyISAM e uso de descritores de arquivo de partição. Para aumentar o número de descritores de arquivo disponíveis para o MySQL, defina a variável de sistema `open_files_limit`. Veja Seção B.3.2.16, “Ficheiro Não Encontrado e Erros Similares”.

O cache de tabelas abertas é mantido em um nível de entradas `table_open_cache`. O servidor ajusta automaticamente o tamanho do cache no início. Para definir explicitamente o tamanho, defina a variável de sistema `table_open_cache` no início. O MySQL pode abrir temporariamente mais tabelas do que isso para executar consultas, conforme descrito mais adiante nesta seção.

O MySQL fecha uma tabela não utilizada e a remove do cache de tabela nas seguintes circunstâncias:

* Quando o cache está cheio e um thread tenta abrir uma tabela que não está no cache.

* Quando o cache contém mais de `table_open_cache` entradas e uma tabela no cache não está sendo usada por nenhum dos threads.

* Quando ocorre uma operação de limpeza de tabela. Isso acontece quando alguém emite uma declaração `FLUSH TABLES` ou executa um comando **mysqladmin flush-tables** ou **mysqladmin refresh**.

Quando a cache da tabela se enche, o servidor utiliza o seguinte procedimento para localizar uma entrada de cache a ser usada:

* As tabelas que não estão em uso atual são liberadas, começando com a tabela menos utilizada recentemente.

* Se uma nova tabela precisar ser aberta, mas o cache estiver cheio e não houver tabelas que possam ser liberadas, o cache é temporariamente estendido conforme necessário. Quando o cache estiver em estado temporariamente estendido e uma tabela passar de estado usado para não usado, a tabela é fechada e liberada do cache.

Uma tabela `MyISAM` é aberta para cada acesso concorrente. Isso significa que a tabela precisa ser aberta duas vezes se dois threads acessarem a mesma tabela ou se um thread acessar a tabela duas vezes na mesma consulta (por exemplo, ao unir a tabela a si mesma). Cada acesso concorrente requer uma entrada na cache da tabela. O primeiro acesso a qualquer tabela `MyISAM` leva dois descritores de arquivo: um para o arquivo de dados e outro para o arquivo de índice. Cada uso adicional da tabela leva apenas um descritor de arquivo para o arquivo de dados. O descritor de arquivo de índice é compartilhado entre todos os threads.

Se você estiver abrindo uma tabela com a declaração `HANDLER tbl_name OPEN`, um objeto de tabela dedicado é alocado para o thread. Esse objeto de tabela não é compartilhado por outros threads e não é fechado até que o thread chame `HANDLER tbl_name CLOSE` ou o thread termine. Quando isso acontece, a tabela é colocada de volta no cache de tabela (se o cache não estiver cheio). Veja a Seção 13.2.4, “Declaração HANDLER”.

Para determinar se sua cache de tabela é muito pequena, verifique a variável de status `Opened_tables`, que indica o número de operações de abertura de tabela desde que o servidor foi iniciado:

```sql
mysql> SHOW GLOBAL STATUS LIKE 'Opened_tables';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Opened_tables | 2741  |
+---------------+-------+
```

Se o valor for muito grande ou aumentar rapidamente, mesmo quando você não emitiu muitas declarações `FLUSH TABLES`, aumente o valor do `table_open_cache` ao iniciar o servidor.

#### 8.4.3.2 Desvantagens de criar muitas tabelas na mesma base de dados

Se você tem muitas tabelas `MyISAM` no mesmo diretório do banco de dados, as operações de abrir, fechar e criar são lentas. Se você executar as instruções `SELECT` em muitas tabelas diferentes, há um pouco de sobrecarga quando o cache da tabela está cheio, porque, para cada tabela que precisa ser aberta, outra deve ser fechada. Você pode reduzir essa sobrecarga aumentando o número de entradas permitidas no cache da tabela.

### 8.4.4 Uso de Tabela Temporária Interna no MySQL

Em alguns casos, o servidor cria tabelas temporárias internas durante o processamento de instruções. Os usuários não têm controle direto sobre quando isso ocorre.

O servidor cria tabelas temporárias em condições como essas:

* Avaliação das declarações de `UNION`, com algumas exceções descritas mais adiante.

* Avaliação de algumas visões, como as que utilizam o algoritmo `TEMPTABLE` `UNION`, ou agregação.

* Avaliação de tabelas derivadas (ver Seção 13.2.10.8, “Tabelas Derivadas”).

*Tabelas criadas para materialização de subconsulta ou semijoin (consulte a Seção 8.2.2, “Otimizando subconsultas, tabelas derivadas e referências de visão”).

* Avaliação de declarações que contenham uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou para as quais a `ORDER BY` ou `GROUP BY` contenha colunas de tabelas que não sejam a primeira tabela na fila de junção.

* A avaliação de `DISTINCT` combinada com `ORDER BY` pode exigir uma tabela temporária.

* Para consultas que utilizam o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária de memória, a menos que a consulta também contenha elementos (descritos mais adiante) que exijam armazenamento em disco.

* Para avaliar as declarações `INSERT ... SELECT` que selecionam e inserem na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as strings do `SELECT`, e, em seguida, insere essas strings na tabela de destino. Veja a Seção 13.2.5.1, “Declaração de INSERT ... SELECT”.

* Avaliação de declarações de múltiplas tabelas `UPDATE`.

* Avaliação das expressões `GROUP_CONCAT()` ou `COUNT(DISTINCT)`.

Para determinar se uma declaração requer uma tabela temporária, use `EXPLAIN` e verifique a coluna `Extra` para ver se ela diz `Using temporary` (consulte Seção 8.8.1, “Otimizando consultas com EXPLAIN”). `EXPLAIN` não necessariamente diz `Using temporary` para tabelas temporárias derivadas ou materializadas.

Algumas condições de consulta impedem o uso de uma tabela temporária de memória, nesse caso, o servidor usa uma tabela em disco em vez disso:

* Presença de uma coluna `BLOB` ou `TEXT` na tabela. Isso inclui variáveis definidas pelo usuário com um valor de string, pois são tratadas como colunas `BLOB` ou `TEXT`, dependendo se seu valor é uma string binária ou não binária, respectivamente.

* Presença de qualquer coluna de texto com comprimento máximo maior que 512 (bytes para strings binárias, caracteres para strings não binárias) na lista `SELECT`, se `UNION` ou `UNION ALL` for utilizado.

* As declarações `SHOW COLUMNS` e `DESCRIBE` utilizam `BLOB` como o tipo para algumas colunas, portanto, a tabela temporária usada para os resultados é uma tabela em disco.

O servidor não utiliza uma tabela temporária para as declarações `UNION` que atendem a certas qualificações. Em vez disso, ele retém da criação de tabela temporária apenas as estruturas de dados necessárias para realizar o tipificação da coluna de resultado. A tabela não é totalmente instanciada e nenhuma string é escrita nela ou lida nela; as strings são enviadas diretamente ao cliente. O resultado é a redução de memória e requisitos de disco, e um atraso menor antes da primeira string ser enviada ao cliente porque o servidor não precisa esperar até que o último bloco de consulta seja executado. A saída do rastreamento da consulta `UNION RESULT` e do otimizador reflete essa estratégia de execução: O bloco de consulta `UNION RESULT` não está presente porque esse bloco corresponde à parte que lê da tabela temporária.

Essas condições qualificam um `UNION` para avaliação sem uma tabela temporária:

* A associação é `UNION ALL`, não `UNION` ou `UNION DISTINCT`.

* Não há cláusula global `ORDER BY`. * A união não é o bloco de consulta de nível superior de uma declaração `{INSERT | REPLACE} ... SELECT ...`.

#### Engenho de Armazenamento Temporário de Tabela Interna

Uma tabela temporária interna pode ser mantida na memória e processada pelo mecanismo de armazenamento `MEMORY`, ou armazenada em disco pelo mecanismo de armazenamento `InnoDB` ou `MyISAM`.

Se uma tabela temporária interna for criada como uma tabela de memória, mas se tornar muito grande, o MySQL a converte automaticamente para uma tabela em disco. O tamanho máximo para tabelas temporárias de memória é definido pelo valor `tmp_table_size` ou `max_heap_table_size`, o menor dos dois. Isso difere das tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`. Para essas tabelas, apenas a variável `max_heap_table_size` determina o tamanho que uma tabela pode crescer, e não há conversão para o formato em disco.

A variável `internal_tmp_disk_storage_engine` define o mecanismo de armazenamento que o servidor usa para gerenciar tabelas internas temporárias no disco. Os valores permitidos são `INNODB` (o padrão) e `MYISAM`.

Nota

Ao usar `internal_tmp_disk_storage_engine=INNODB`, consultas que geram tabelas internas temporárias no disco que excedem os limites de string ou coluna de `InnoDB` retornam erros de Tamanho de string muito grande ou Muitas colunas. A solução é definir `internal_tmp_disk_storage_engine` para `MYISAM`.

Quando uma tabela temporária interna é criada na memória ou em disco, o servidor incrementa o valor `Created_tmp_tables`. Quando uma tabela temporária interna é criada em disco, o servidor incrementa o valor `Created_tmp_disk_tables`. Se forem criadas demasiadas tabelas temporárias internas em disco, considere aumentar as configurações dos valores `tmp_table_size` e `max_heap_table_size`.

#### Formato de Armazenamento de Tabela Temporária Interna

As tabelas temporárias de memória são gerenciadas pelo mecanismo de armazenamento `MEMORY`, que utiliza um formato de string de comprimento fixo. Os valores das colunas `VARCHAR` e `VARBINARY` são preenchidos com o comprimento máximo da coluna, armazenando-os efetivamente como colunas `CHAR` e `BINARY`.

As tabelas temporárias no disco são gerenciadas pelo mecanismo de armazenamento `InnoDB` ou `MyISAM` (dependendo da configuração do `internal_tmp_disk_storage_engine`). Ambos os motores armazenam tabelas temporárias usando o formato de string de largura dinâmica. As colunas ocupam apenas o armazenamento necessário, o que reduz o I/O de disco, os requisitos de espaço e o tempo de processamento em comparação com as tabelas no disco que usam strings de comprimento fixo.

Para declarações que inicialmente criam uma tabela temporária interna na memória e, em seguida, a convertem em uma tabela em disco, um melhor desempenho pode ser alcançado ignorando o passo de conversão e criando a tabela em disco desde o início. A variável `big_tables` pode ser usada para forçar o armazenamento em disco de tabelas temporárias internas.

### 8.4.5 Limites de número de bancos de dados e tabelas

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

O MySQL não tem limite no número de tabelas. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam as tabelas. Motores de armazenamento individuais podem impor restrições específicas do motor. `InnoDB` permite até 4 bilhões de tabelas.

### 8.4.6 Limites de tamanho da tabela

O tamanho máximo efetivo da tabela para bancos de dados MySQL é geralmente determinado pelas restrições do sistema operacional em relação ao tamanho dos arquivos, e não pelos limites internos do MySQL. Para obter informações atualizadas sobre os limites de tamanho de arquivo do sistema operacional, consulte a documentação específica do seu sistema operacional.

Usuários do Windows, por favor, note que o FAT e o VFAT (FAT32) não são considerados adequados para uso produtivo com o MySQL. Use o NTFS em vez disso.

Se você encontrar um erro de tabela cheia, há várias razões pelas quais isso pode ter ocorrido:

* O disco pode estar cheio. * Você está usando as tabelas `InnoDB` e esgotou o espaço em um arquivo de espaço de tabela [[`InnoDB`]. O tamanho máximo do espaço de tabela também é o tamanho máximo para uma tabela. Para limites de tamanho de espaço de tabela, consulte a Seção 14.23, “Limites do InnoDB”.

Geralmente, a partição de tabelas em vários arquivos de espaço de tabela é recomendada para tabelas maiores que 1 TB de tamanho.

* Você atingiu o limite de tamanho de arquivo do sistema operacional. Por exemplo, você está usando as tabelas `MyISAM` em um sistema operacional que suporta arquivos com tamanho máximo de 2 GB e você atingiu esse limite para o arquivo de dados ou o arquivo de índice.

* Você está usando uma tabela `MyISAM` e o espaço necessário para a tabela excede o que é permitido pelo tamanho do ponteiro interno. `MyISAM` permite que os arquivos de dados e índice cresçam até 256TB por padrão, mas esse limite pode ser alterado até o tamanho máximo permitido de 65.536TB (2567 − 1 bytes).

Se você precisa de uma tabela `MyISAM` que seja maior que o limite padrão e seu sistema operacional suporte arquivos grandes, a declaração `CREATE TABLE` suporta as opções `AVG_ROW_LENGTH` e `MAX_ROWS`. Veja a Seção 13.1.18, “Declaração CREATE TABLE”. O servidor usa essas opções para determinar o tamanho de uma tabela que deve ser permitida.

Se o tamanho do ponteiro for muito pequeno para uma tabela existente, você pode alterar as opções com `ALTER TABLE` para aumentar o tamanho máximo permitido de uma tabela. Veja a Seção 13.1.8, “Instrução ALTER TABLE”.

  ```sql
  ALTER TABLE tbl_name MAX_ROWS=1000000000 AVG_ROW_LENGTH=nnn;
  ```

Você deve especificar `AVG_ROW_LENGTH` apenas para tabelas com colunas `BLOB` ou `TEXT`; nesse caso, o MySQL não pode otimizar o espaço necessário com base apenas no número de strings.

Para alterar o limite de tamanho padrão para as tabelas `MyISAM`, defina o `myisam_data_pointer_size`, que define o número de bytes usados para ponteiros internos de string. O valor é usado para definir o tamanho do ponteiro para novas tabelas, se você não especificar a opção `MAX_ROWS`. O valor de `myisam_data_pointer_size` pode ser de 2 a 7. Por exemplo, para tabelas que usam o formato de armazenamento dinâmico, um valor de 4 permite tabelas de até 4 GB; um valor de 6 permite tabelas de até 256 TB. As tabelas que usam o formato de armazenamento fixo têm um comprimento máximo de dados maior. Para características de formato de armazenamento, consulte a Seção 15.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

Você pode verificar o tamanho máximo de dados e índices usando esta declaração:

  ```sql
  SHOW TABLE STATUS FROM db_name LIKE 'tbl_name';
  ```

Você também pode usar **myisamchk -dv /caminho/para/arquivo-de-índice-de-tabela**. Veja a Seção 13.7.5, “Declarações SHOW”, ou a Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabela MyISAM”.

Outras formas de contornar os limites de tamanho de arquivo para as tabelas do `MyISAM` são as seguintes:

+ Se a sua tabela grande for somente de leitura, você pode usar **myisampack** para comprá-la. **myisampack** geralmente comprime uma tabela em pelo menos 50%, então você pode, na verdade, ter tabelas muito maiores. **myisampack** também pode unir várias tabelas em uma única tabela. Veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura”.

+ O MySQL inclui uma biblioteca `MERGE` que permite que você manipule uma coleção de tabelas `MyISAM` que têm estrutura idêntica a uma única tabela `MERGE`. Veja a Seção 15.7, “O Motor de Armazenamento MERGE”.

* Você está usando o motor de armazenamento `MEMORY` (`HEAP`); nesse caso, você precisa aumentar o valor da variável do sistema `max_heap_table_size`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

### 8.4.7 Limites de contagem de colunas de tabela e tamanho de string

Esta seção descreve os limites sobre o número de colunas em tabelas e o tamanho das strings individuais.

* Limites de contagem de colunas * Limites de tamanho de string

#### Limites de contagem de colunas

O MySQL tem um limite rígido de 4096 colunas por tabela, mas o limite máximo efetivo pode ser menor para uma tabela específica. O limite exato das colunas depende de vários fatores:

* O tamanho máximo de uma string para uma tabela limita o número (e, possivelmente, o tamanho) de colunas, pois o comprimento total de todas as colunas não pode exceder esse tamanho. Veja Limites de tamanho de string.

* Os requisitos de armazenamento das colunas individuais restringem o número de colunas que cabem dentro de um tamanho máximo de string dado. Os requisitos de armazenamento para alguns tipos de dados dependem de fatores como o mecanismo de armazenamento, o formato de armazenamento e o conjunto de caracteres. Veja a Seção 11.7, “Requisitos de Armazenamento de Tipo de Dados”.

* Os motores de armazenamento podem impor restrições adicionais que limitam o número de colunas de uma tabela. Por exemplo, `InnoDB` tem um limite de 1017 colunas por tabela. Consulte a Seção 14.23, “Limites do InnoDB”. Para informações sobre outros motores de armazenamento, consulte o Capítulo 15, *Motores de Armazenamento Alternativos*.

* Cada tabela tem um arquivo `.frm` que contém a definição da tabela. A definição afeta o conteúdo deste arquivo de maneiras que podem afetar o número de colunas permitidas na tabela. Veja Limites impostos pela estrutura do arquivo .frm.

#### Limites de tamanho de string

O tamanho máximo de uma string para uma tabela específica é determinado por vários fatores:

* A representação interna de uma tabela do MySQL tem um limite máximo de tamanho de string de 65.535 bytes, mesmo que o mecanismo de armazenamento seja capaz de suportar strings maiores. As colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o limite de tamanho de string, porque seus conteúdos são armazenados separadamente do resto da string. `BLOB` e `TEXT`

* O tamanho máximo de string para uma tabela `InnoDB`, que se aplica aos dados armazenados localmente dentro de uma página do banco de dados, é ligeiramente menos de meio página para configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo de string é ligeiramente menos de 8KB para o tamanho de página padrão de 16KB `InnoDB`. Para páginas de 64KB, o tamanho máximo de string é ligeiramente menos de 16KB. Veja a Seção 14.23, “Limites do InnoDB”.

Se uma string que contém colunas de comprimento variável exceder o tamanho máximo de string `InnoDB`, `InnoDB` seleciona colunas de comprimento variável para armazenamento externo fora da página até que a string se encaixe no limite de tamanho de string `InnoDB`. A quantidade de dados armazenada localmente para colunas de comprimento variável que são armazenadas fora da página difere de acordo com o formato da string. Para mais informações, consulte a Seção 14.11, “Formatos de string InnoDB”.

* Diferentes formatos de armazenamento utilizam diferentes quantidades de dados de cabeçalho e trailer de página, o que afeta a quantidade de armazenamento disponível para as strings.

+ Para informações sobre os formatos de string de `InnoDB`, consulte a Seção 14.11, “Formatos de string InnoDB”.

+ Para informações sobre os formatos de armazenamento de `MyISAM`, consulte a Seção 15.2.3, “Formatos de Armazenamento de Tabela MyISAM”.

Limite de tamanho de string ##### Exemplos

O limite máximo de tamanho de string do MySQL de 65.535 bytes é demonstrado nos seguintes exemplos `InnoDB` e `MyISAM`. O limite é aplicado independentemente do mecanismo de armazenamento, embora o mecanismo de armazenamento possa ser capaz de suportar strings maiores.

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g VARCHAR(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g VARCHAR(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

No exemplo a seguir `MyISAM`, ao alterar uma coluna para `TEXT`, é possível evitar o limite de tamanho de string de 65.535 bytes e permitir que a operação seja bem-sucedida, pois as colunas `BLOB` e `TEXT` contribuem apenas com 9 a 12 bytes para o tamanho da string.

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=MyISAM CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

A operação é bem-sucedida para uma tabela `InnoDB` porque alterar uma coluna para `TEXT` evita o limite de tamanho de string de 65.535 bytes do MySQL, e o armazenamento fora da página `InnoDB` de colunas de comprimento variável evita o limite de tamanho de string `InnoDB`.

  ```sql
  mysql> CREATE TABLE t (a VARCHAR(10000), b VARCHAR(10000),
         c VARCHAR(10000), d VARCHAR(10000), e VARCHAR(10000),
         f VARCHAR(10000), g TEXT(6000)) ENGINE=InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

* O armazenamento para colunas de comprimento variável inclui bytes de comprimento, que são contados para o tamanho da string. Por exemplo, uma coluna `VARCHAR(255) CHARACTER SET utf8mb3` ocupa dois bytes para armazenar o comprimento do valor, então cada valor pode ocupar até 767 bytes.

A declaração para criar a tabela `t1` é bem-sucedida porque as colunas exigem 32.765 + 2 bytes e 32.766 + 2 bytes, o que está dentro do tamanho máximo da string de 65.535 bytes:

  ```sql
  mysql> CREATE TABLE t1
         (c1 VARCHAR(32765) NOT NULL, c2 VARCHAR(32766) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.02 sec)
  ```

A declaração para criar a tabela `t2` falha porque, embora o comprimento da coluna esteja dentro do comprimento máximo de 65.535 bytes, são necessários dois bytes adicionais para registrar o comprimento, o que faz com que o tamanho da string exceda 65.535 bytes:

  ```sql
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65535) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

Reduzir o comprimento da coluna para 65.533 ou menos permite que a declaração seja bem-sucedida.

  ```sql
  mysql> CREATE TABLE t2
         (c1 VARCHAR(65533) NOT NULL)
         ENGINE = InnoDB CHARACTER SET latin1;
  Query OK, 0 rows affected (0.01 sec)
  ```

* Para as tabelas `MyISAM`, as colunas `NULL` requerem espaço adicional na string para registrar se seus valores são `NULL`. Cada coluna `NULL` leva um bit extra, arredondado para o próximo byte.

A declaração para criar a tabela `t3` falha porque `MyISAM` requer espaço para as colunas `NULL`, além do espaço necessário para os bytes de comprimento de coluna de comprimento variável, fazendo com que o tamanho da string exceda 65.535 bytes:

  ```sql
  mysql> CREATE TABLE t3
         (c1 VARCHAR(32765) NULL, c2 VARCHAR(32766) NULL)
         ENGINE = MyISAM CHARACTER SET latin1;
  ERROR 1118 (42000): Row size too large. The maximum row size for the used
  table type, not counting BLOBs, is 65535. This includes storage overhead,
  check the manual. You have to change some columns to TEXT or BLOBs
  ```

Para informações sobre o armazenamento de colunas `InnoDB` `NULL`, consulte a Seção 14.11, “Formatos de string InnoDB”.

* `InnoDB` restringe o tamanho da string (para dados armazenados localmente dentro da página do banco de dados) a um pouco menos de meio banco de dados para configurações de 4KB, 8KB, 16KB e 32KB `innodb_page_size`, e a um pouco menos de 16KB para páginas de 64KB.

A declaração para criar a tabela `t4` falha porque as colunas definidas excedem o limite de tamanho de string para uma página de 16 KB `InnoDB`.

  ```sql
  mysql> CREATE TABLE t4 (
         c1 CHAR(255),c2 CHAR(255),c3 CHAR(255),
         c4 CHAR(255),c5 CHAR(255),c6 CHAR(255),
         c7 CHAR(255),c8 CHAR(255),c9 CHAR(255),
         c10 CHAR(255),c11 CHAR(255),c12 CHAR(255),
         c13 CHAR(255),c14 CHAR(255),c15 CHAR(255),
         c16 CHAR(255),c17 CHAR(255),c18 CHAR(255),
         c19 CHAR(255),c20 CHAR(255),c21 CHAR(255),
         c22 CHAR(255),c23 CHAR(255),c24 CHAR(255),
         c25 CHAR(255),c26 CHAR(255),c27 CHAR(255),
         c28 CHAR(255),c29 CHAR(255),c30 CHAR(255),
         c31 CHAR(255),c32 CHAR(255),c33 CHAR(255)
         ) ENGINE=InnoDB ROW_FORMAT=COMPACT DEFAULT CHARSET latin1;
  ERROR 1118 (42000): Row size too large (> 8126). Changing some columns to TEXT or BLOB or using
  ROW_FORMAT=DYNAMIC or ROW_FORMAT=COMPRESSED may help. In current row format, BLOB prefix of 768
  bytes is stored inline.
  ```
