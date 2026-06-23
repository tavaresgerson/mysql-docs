## 9.6 Manutenção e recuperação em caso de falha de tabelas MyISAM

Esta seção discute como usar o **myisamchk** para verificar ou reparar as tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenamento de dados e índices). Para informações gerais sobre o **myisamchk**, consulte a Seção 6.6.4, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”. Outras informações sobre reparo de tabelas podem ser encontradas na Seção 3.14, “Reestruturação ou reparo de tabelas ou índices”.

Você pode usar **myisamchk** para verificar, reparar ou otimizar as tabelas do banco de dados. As seções a seguir descrevem como realizar essas operações e como configurar um cronograma de manutenção de tabela. Para informações sobre como usar **myisamchk** para obter informações sobre suas tabelas, consulte a Seção 6.6.4.5, “Obtenção de Informações de Tabela com myisamchk”.

Embora a reparação de tabela com **myisamchk** seja bastante segura, é sempre uma boa ideia fazer um backup *antes* de realizar uma reparação ou qualquer operação de manutenção que possa fazer muitas alterações em uma tabela.

As operações de **myisamchk** que afetam índices podem fazer com que os índices `MyISAM` `FULLTEXT` sejam reconstruídos com parâmetros de texto completo que são incompatíveis com os valores usados pelo servidor MySQL. Para evitar esse problema, siga as diretrizes na Seção 6.6.4.1, “Opções Gerais de myisamchk”.

A manutenção da tabela `MyISAM` também pode ser feita usando as instruções SQL que realizam operações semelhantes às que o **myisamchk** pode realizar:

* Para verificar as tabelas `MyISAM`, use `CHECK TABLE`.

* Para reparar as tabelas `MyISAM`, use `REPAIR TABLE`.

* Para otimizar as tabelas `MyISAM`, use `OPTIMIZE TABLE`.

* Para analisar as tabelas `MyISAM`, use `ANALYZE TABLE`.

Para informações adicionais sobre essas declarações, consulte a Seção 15.7.3, “Declarações de Manutenção de Tabela”.

Essas declarações podem ser usadas diretamente ou por meio do programa cliente **mysqlcheck**. Uma vantagem dessas declarações em relação ao **myisamchk** é que o servidor faz todo o trabalho. Com o **myisamchk**, você deve garantir que o servidor não use as tabelas ao mesmo tempo, para que não haja interação indesejada entre o **myisamchk** e o servidor.

### 9.6.1 Usando myisamchk para recuperação em caso de falha

Esta seção descreve como verificar e lidar com a corrupção de dados em bancos de dados MySQL. Se suas tabelas forem corrompidas com frequência, você deve tentar descobrir a razão disso. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Para uma explicação sobre como as tabelas `MyISAM` podem se corromper, consulte a Seção 18.2.4, “Problemas com as tabelas MyISAM”.

Se você executar o **mysqld** com o bloqueio externo desativado (o que é o padrão), não pode usar confiável o **myisamchk** para verificar uma tabela quando o **mysqld** está usando a mesma tabela. Se você pode ter certeza de que ninguém pode acessar as tabelas usando o **mysqld** enquanto você executa o **myisamchk**, você só precisa executar **mysqladmin flush-tables** antes de começar a verificar as tabelas. Se você não pode garantir isso, você deve parar o **mysqld** enquanto você verifica as tabelas. Se você executar o **myisamchk** para verificar tabelas que o **mysqld** está atualizando ao mesmo tempo, você pode receber um aviso de que uma tabela está corrompida, mesmo quando não está.

Se o servidor for executado com o bloqueio externo habilitado, você pode usar **myisamchk** para verificar as tabelas a qualquer momento. Nesse caso, se o servidor tentar atualizar uma tabela que o **myisamchk** esteja usando, o servidor aguarda que o **myisamchk** termine antes de continuar.

Se você usar **myisamchk** para reparar ou otimizar tabelas, *você* *deve* sempre garantir que o servidor **mysqld** não esteja usando a tabela (isso também se aplica se o bloqueio externo estiver desativado). Se você não parar o **mysqld**, pelo menos faça um **mysqladmin flush-tables** antes de executar **myisamchk**. Se o servidor e **myisamchk** acessarem as tabelas simultaneamente, as *tabelas podem ficar corrompidas*.

Ao realizar a recuperação de falhas, é importante entender que cada tabela `MyISAM` *`tbl_name`* em um banco de dados corresponde aos três arquivos no diretório do banco de dados mostrados na tabela a seguir.

<table summary="The two files in the database directory that correspond to each MyISAM table."><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code><em class="replaceable"><code>tbl_name</code></em>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

Cada um desses três tipos de arquivo está sujeito a corrupção de várias maneiras, mas os problemas ocorrem com mais frequência em arquivos de dados e arquivos de índice.

**myisamchk** funciona criando uma cópia da linha do arquivo de dados `.MYD` linha a linha. Ele termina a etapa de reparo removendo o arquivo antigo `.MYD` e renomeando o novo arquivo para o nome original do arquivo. Se você usar `--quick`, **myisamchk** não cria um arquivo temporário `.MYD`, mas, em vez disso, assume que o arquivo `.MYD` está correto e gera apenas um novo arquivo de índice sem tocar no arquivo `.MYD`. Isso é seguro, porque **myisamchk** detecta automaticamente se o arquivo `.MYD` está corrompido e interrompe o reparo se estiver. Você também pode especificar a opção `--quick` duas vezes para **myisamchk**. Neste caso, **myisamchk** não interrompe em alguns erros (como erros de chave duplicada) mas, em vez disso, tenta resolvê-los modificando o arquivo `.MYD`. Normalmente, o uso de duas opções `--quick` é útil apenas se você tem muito pouco espaço em disco livre para realizar um reparo normal. Neste caso, você deve, pelo menos, fazer um backup da tabela antes de executar **myisamchk**.

### 9.6.2 Como verificar as tabelas MyISAM em busca de erros

Para verificar uma tabela `MyISAM`, use os seguintes comandos:

* [**myisamchk *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

Isso encontra 99,99% de todos os erros. O que ele não consegue encontrar é corrupção que envolve *apenas* o arquivo de dados (o que é muito incomum). Se você deseja verificar uma tabela, normalmente deve executar o **myisamchk** sem opções ou com a opção `-s` (silenciosa).

* [**myisamchk -m *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

Isso encontra 99,999% de todos os erros. Primeiro, ele verifica todas as entradas de índice em busca de erros e, em seguida, lê todas as linhas. Ele calcula um checksum para todos os valores de chave nas linhas e verifica se o checksum corresponde ao checksum das chaves na árvore de índice.

* [**myisamchk -e *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")]

Isso realiza uma verificação completa e minuciosa de todos os dados (`-e` significa “verificação estendida”). Ele realiza uma leitura de verificação de todas as chaves de cada linha para verificar se elas realmente apontam para a linha correta. Isso pode levar um longo tempo para uma tabela grande que tem muitos índices. Normalmente, **myisamchk** para após o primeiro erro que ele encontra. Se você deseja obter mais informações, pode adicionar a opção `-v` (verbose). Isso faz com que **myisamchk** continue, até um máximo de 20 erros.

* [**myisamchk -e -i *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")

Isto é semelhante ao comando anterior, mas a opção `-i` informa ao **myisamchk** para imprimir informações estatísticas adicionais.

Na maioria dos casos, um comando simples **myisamchk** sem argumentos além do nome da tabela é suficiente para verificar uma tabela.

### 9.6.3 Como reparar as tabelas MyISAM

A discussão nesta seção descreve como usar o **myisamchk** em tabelas `MyISAM` (extensões `.MYI` e `.MYD`).

Você também pode usar as declarações `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar as tabelas `MyISAM`. Veja a Seção 15.7.3.2, “Declaração CHECK TABLE”, e a Seção 15.7.3.5, “Declaração REPAIR TABLE”.

Os sintomas de tabelas corrompidas incluem consultas que são interrompidas inesperadamente e erros observáveis, como estes:

* Não consigo encontrar o arquivo `tbl_name.MYI` (Código de erro: *`nnn`*)

* Fim inesperado do arquivo
* O arquivo de registro está quebrado
* Recebi o erro *`nnn`* do manipulador de tabela

Para obter mais informações sobre o erro, execute **perror *`nnn`**, onde *`nnn`* é o número do erro. O exemplo a seguir mostra como usar **perror** para encontrar os significados dos números de erro mais comuns que indicam um problema com uma tabela:

```
$> perror 126 127 132 134 135 136 141 144 145
MySQL error code 126 = Index file is crashed
MySQL error code 127 = Record-file is crashed
MySQL error code 132 = Old database file
MySQL error code 134 = Record was already deleted (or record file crashed)
MySQL error code 135 = No more room in record file
MySQL error code 136 = No more room in index file
MySQL error code 141 = Duplicate unique key or constraint on write or update
MySQL error code 144 = Table is crashed and last repair failed
MySQL error code 145 = Table was marked as crashed and should be repaired
```

Observe que o erro 135 (não há mais espaço no arquivo de registro) e o erro 136 (não há mais espaço no arquivo de índice) não são erros que podem ser corrigidos por uma simples reparação. Neste caso, você deve usar `ALTER TABLE` para aumentar os valores das opções da tabela `MAX_ROWS` e `AVG_ROW_LENGTH`:

```
ALTER TABLE tbl_name MAX_ROWS=xxx AVG_ROW_LENGTH=yyy;
```

Se você não conhece os valores atuais das opções da tabela, use `SHOW CREATE TABLE`.

Para os outros erros, você deve reparar suas tabelas. O **myisamchk** geralmente pode detectar e corrigir a maioria dos problemas que ocorrem.

O processo de reparo envolve até três etapas, descritas aqui. Antes de começar, você deve mudar a localização para o diretório do banco de dados e verificar as permissões dos arquivos da tabela. Em Unix, certifique-se de que eles sejam legíveis pelo usuário pelo qual o **mysqld** é executado (e pelo seu, porque você precisa acessar os arquivos que está verificando). Se descobrir que você precisa modificar os arquivos, eles também devem ser legíveis por você.

Esta seção é para os casos em que uma verificação de tabela falha (como os descritos na Seção 9.6.2, “Como verificar as tabelas MyISAM em busca de erros”), ou você deseja usar os recursos extensos que o **myisamchk** oferece.

As opções do **myisamchk** usadas para a manutenção de tabelas estão descritas na Seção 6.6.4, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”. O **myisamchk** também tem variáveis que você pode definir para controlar a alocação de memória, o que pode melhorar o desempenho. Veja a Seção 6.6.4.6, “Uso de memória do **myisamchk”**.

Se você vai reparar uma tabela a partir da linha de comando, você deve primeiro parar o servidor **mysqld**. Observe que, quando você faz **mysqladmin shutdown** em um servidor remoto, o servidor **mysqld** ainda está disponível por um tempo após o **mysqladmin** retornar, até que todo o processamento de declarações tenha parado e todas as alterações de índice tenham sido descarregadas no disco.

**Etapa 1: Verificação de suas tabelas**

Execute **myisamchk \*.MYI** ou [**myisamchk -e \*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") se você tiver mais tempo. Use a opção `-s` (silenciosa) para suprimir informações desnecessárias.

Se o servidor **mysqld** estiver parado, você deve usar a opção `--update-state` para informar ao **myisamchk** que marque a tabela como "verificada".

Você só precisa reparar as tabelas para as quais o **myisamchk** anuncia um erro. Para essas tabelas, prossiga para a Etapa 2.

Se você receber erros inesperados ao verificar (como os erros `out of memory`), ou se o **myisamchk** falhar, vá para a Etapa 3.

**Etapa 2: Reparo seguro fácil**

Primeiro, tente [**myisamchk -r -q *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") (`-r -q` significa “modo de recuperação rápida”). Isso tenta reparar o arquivo de índice sem tocar no arquivo de dados. Se o arquivo de dados contiver tudo o que deve e os links de exclusão apontarem para os locais corretos dentro do arquivo de dados, isso deve funcionar e a tabela será corrigida. Comece a reparar a próxima tabela. Caso contrário, use o procedimento a seguir:

1. Faça um backup do arquivo de dados antes de continuar. 2. Use [**myisamchk -r *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") (`-r` significa “modo de recuperação”). Isso remove as linhas incorretas e as linhas excluídas do arquivo de dados e reconstrui o arquivo de índice.

3. Se a etapa anterior falhar, use [**myisamchk --safe-recover *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). O modo de recuperação segura usa um método de recuperação antigo que lida com alguns casos que o modo de recuperação regular não lida (mas é mais lento).

Nota

Se você deseja que a operação de reparo seja muito mais rápida, deve definir os valores das variáveis `sort_buffer_size` e `key_buffer_size` em cerca de 25% da sua memória disponível ao executar o **myisamchk**.

Se você receber erros inesperados durante a reparação (como os erros `out of memory`), ou se o **myisamchk** falhar, vá para a Etapa 3.

**Fase 3: Reparo difícil**

Você deve chegar a essa etapa apenas se o primeiro bloco de 16 KB no arquivo de índice for destruído ou contiver informações incorretas, ou se o arquivo de índice estiver faltando. Nesse caso, é necessário criar um novo arquivo de índice. Faça isso da seguinte forma:

1. Mova o arquivo de dados para um local seguro.
2. Use o arquivo de descrição da tabela para criar novos (vazi) arquivos de dados e índice:

   ```
   $> mysql db_name
   ```

   ```
   mysql> SET autocommit=1;
   mysql> TRUNCATE TABLE tbl_name;
   mysql> quit
   ```

3. Copie o arquivo de dados antigo de volta para o arquivo de dados recém-criado. (Não apenas mova o arquivo antigo de volta para o novo arquivo. Você quer manter uma cópia em caso de algo dar errado.)

Importante

Se você estiver usando replicação, você deve interromper essa operação antes de realizar o procedimento acima, pois envolve operações no sistema de arquivos, e essas operações não são registradas pelo MySQL.

Volte para a Etapa 2. **myisamchk -r -q** deve funcionar. (Isso não deve ser um loop sem fim.)

Você também pode usar a instrução SQL `REPAIR TABLE tbl_name USE_FRM`, que realiza todo o procedimento automaticamente. Não há também possibilidade de interação indesejada entre uma ferramenta e o servidor, porque o servidor faz todo o trabalho quando você usa `REPAIR TABLE`. Veja a Seção 15.7.3.5, “Instrução de REPAIR TABLE”.

### 9.6.4 Otimização de Tabelas MyISAM

Para coalescer linhas fragmentadas e eliminar o espaço desperdiçado que resulta da exclusão ou atualização de linhas, execute o **myisamchk** no modo de recuperação:

```
$> myisamchk -r tbl_name
```

Você pode otimizar uma tabela da mesma maneira, usando a instrução SQL `OPTIMIZE TABLE`. `OPTIMIZE TABLE` realiza uma reparação de tabela e uma análise de chave, e também ordena a árvore de índice para que as consultas de chave sejam mais rápidas. Não há também possibilidade de interação indesejada entre uma ferramenta e o servidor, porque o servidor faz todo o trabalho quando você usa [`OPTIMIZE TABLE`(optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"). Veja a Seção 15.7.3.4, “Instrução de Otimização de Tabela”.

**myisamchk** tem várias outras opções que você pode usar para melhorar o desempenho de uma tabela:

* `--analyze` ou `-a`: Realize a análise da distribuição de chaves. Isso melhora o desempenho da junção, permitindo que o otimizador de junção escolha melhor a ordem em que unir as tabelas e quais índices deve usar.

* `--sort-index` ou `-S`: Organize os blocos do índice. Isso otimiza os buscas e torna os varreduras de tabela que utilizam índices mais rápidos.

* `--sort-records=index_num` ou `-R index_num`: Classifique as linhas de dados de acordo com um índice dado. Isso torna seus dados muito mais localizados e pode acelerar as operações de `SELECT` e `ORDER BY` baseadas em intervalo que utilizam este índice.

Para uma descrição completa de todas as opções disponíveis, consulte a Seção 6.6.4, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”.

### 9.6.5 Configurando um cronograma de manutenção de tabela MyISAM

É uma boa ideia realizar verificações de tabela regularmente, em vez de esperar que os problemas ocorram. Uma maneira de verificar e reparar as tabelas `MyISAM` é com as declarações `CHECK TABLE` e `REPAIR TABLE`. Veja a Seção 15.7.3, “Declarações de Manutenção de Tabela”.

Outra maneira de verificar as tabelas é usar o **myisamchk**. Para fins de manutenção, você pode usar o **myisamchk -s**. A opção `-s` (abreviação de `--silent`) faz com que o **myisamchk** execute em modo silencioso, imprimindo mensagens apenas quando ocorrem erros.

Também é uma boa ideia habilitar o controle automático da tabela `MyISAM`. Por exemplo, sempre que a máquina tiver feito um reinício durante um processo de atualização, geralmente é necessário verificar cada tabela que poderia ter sido afetada antes de usá-la novamente. (Estas são as "tabelas que esperávamos que caíssem".) Para fazer com que o servidor verifique as tabelas `MyISAM` automaticamente, inicie-o com a variável de sistema `myisam_recover_options` definida. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Você também deve verificar suas tabelas regularmente durante o funcionamento normal do sistema. Por exemplo, você pode executar um **cron** para verificar tabelas importantes uma vez por semana, usando uma linha como esta em um arquivo `crontab`:

```
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

Isso exibe informações sobre as tabelas que foram descartadas, para que você possa examiná-las e repará-las conforme necessário.

Para começar, execute **myisamchk -s** todas as noites em todas as tabelas que foram atualizadas nas últimas 24 horas. Como você vê que os problemas ocorrem raramente, você pode reduzir a frequência de verificação para uma vez por semana ou assim.

Normalmente, as tabelas do MySQL precisam de pouca manutenção. Se você está realizando muitas atualizações nas tabelas `MyISAM` com linhas de tamanho dinâmico (tabelas com colunas `VARCHAR`, `BLOB` ou `TEXT`) ou tem tabelas com muitas linhas excluídas, você pode querer defragmentar/recapturar espaço das tabelas de tempos em tempos. Você pode fazer isso usando `OPTIMIZE TABLE` nas tabelas em questão. Alternativamente, se você puder parar o servidor **mysqld** por um tempo, mude a localização para o diretório de dados e use este comando enquanto o servidor está parado:

```
$> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```
