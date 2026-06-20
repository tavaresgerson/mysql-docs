## 8.12 Otimizando o servidor MySQL

Esta seção discute técnicas de otimização para o servidor de banco de dados, lidando principalmente com a configuração do sistema, e não com o ajuste de declarações SQL. As informações nesta seção são apropriadas para DBAs que desejam garantir desempenho e escalabilidade nos servidores que gerenciam; para desenvolvedores que constroem scripts de instalação que incluem a configuração do banco de dados; e pessoas que executam o MySQL por si mesmas para desenvolvimento, testes, etc., e que desejam maximizar sua própria produtividade.

### 8.12.1 Fatores do sistema

Alguns fatores de nível de sistema podem afetar o desempenho de maneira significativa:

* Se você tiver RAM suficiente, poderá remover todos os dispositivos de troca. Alguns sistemas operacionais utilizam um dispositivo de troca em alguns contextos, mesmo que você tenha memória livre.

* Evite o bloqueio externo para as tabelas `MyISAM`. O padrão é que o bloqueio externo seja desativado. As opções `--external-locking` e `--skip-external-locking` habilitam e desabilitam explicitamente o bloqueio externo.

Desativar o bloqueio externo não afeta a funcionalidade do MySQL, desde que você esteja executando apenas um servidor. Apenas lembre-se de desligar o servidor (ou bloquear e esvaziar as tabelas relevantes) antes de executar o **myisamchk**. Em alguns sistemas, é obrigatório desativar o bloqueio externo, pois ele não funciona de qualquer maneira.

O único caso em que você não pode desativar o bloqueio externo é quando você executa vários servidores MySQL * (não clientes) * no mesmo banco de dados, ou se você executar **myisamchk** para verificar (não reparar) uma tabela sem dizer ao servidor para esvaziar e bloquear as tabelas primeiro. Note que usar vários servidores MySQL para acessar os mesmos dados simultaneamente geralmente *não* é recomendado, exceto quando usando o NDB Cluster.

As declarações `LOCK TABLES` e `UNLOCK TABLES` utilizam bloqueio interno, portanto, você pode usá-las mesmo se o bloqueio externo estiver desativado.

### 8.12.2 Otimizando o I/O de disco

Esta seção descreve as maneiras de configurar dispositivos de armazenamento quando você pode dedicar mais e mais rápido ao hardware de armazenamento para o servidor de banco de dados. Para informações sobre a otimização de uma configuração de `InnoDB` para melhorar o desempenho de E/S, consulte a Seção 8.5.8, “Otimizando a E/S de disco do InnoDB”.

* As buscas em disco são um gargalo de desempenho enorme. Esse problema se torna mais evidente quando a quantidade de dados começa a crescer de forma tão grande que o cache efetivo se torna impossível. Para grandes bancos de dados onde você acessa os dados de forma mais ou menos aleatória, você pode ter certeza de que precisa de pelo menos uma busca em disco para ler e algumas buscas em disco para escrever coisas. Para minimizar esse problema, use discos com tempos de busca baixos.

* Aumente o número de eixos de disco disponíveis (e, assim, reduza o tempo de busca) ao vincular os arquivos a diferentes discos ou ao estender os discos:

+ Usando links simbólicos

Isso significa que, para as tabelas `MyISAM`, você faz um symlink do arquivo de índice e dos arquivos de dados de sua localização usual no diretório de dados para outro disco (que também pode ser em estratificação). Isso melhora tanto os tempos de busca quanto de leitura, assumindo que o disco não é usado para outros propósitos também. Veja a Seção 8.12.3, “Usando Links Simbólicos”.

Os links simbólicos não são suportados para uso com as tabelas `InnoDB`. No entanto, é possível colocar os dados e arquivos de registro `InnoDB` em discos físicos diferentes. Para mais informações, consulte a Seção 8.5.8, “Otimizando o I/O de disco do InnoDB”.

+ Estrias

A faixa significa que você tem muitos discos e coloca o primeiro bloco no primeiro disco, o segundo bloco no segundo disco e o *`N`*-º bloco no (`N MOD number_of_disks`) disco, e assim por diante. Isso significa que, se o tamanho normal dos seus dados for menor que o tamanho da faixa (ou perfeitamente alinhado), você obterá um desempenho muito melhor. A faixa é muito dependente do sistema operacional e do tamanho da faixa, então faça uma comparação de desempenho com diferentes tamanhos de faixa. Veja a Seção 8.13.2, “Usando seus próprios benchmarks”.

A diferença de velocidade para striping é *muito* dependente dos parâmetros. Dependendo da forma como você define os parâmetros de striping e o número de discos, você pode obter diferenças medidas em ordens de magnitude. Você tem que escolher para otimizar o acesso aleatório ou sequencial.

* Para confiabilidade, você pode querer usar RAID 0+1 (estratificação mais espelhamento), mas, neste caso, você precisa de 2 × *`N`* drives para segurar *`N`* drives de dados. Esta é provavelmente a melhor opção se você tiver o dinheiro para isso. No entanto, você também pode ter que investir em algum software de gerenciamento de volume para lidar com isso de forma eficiente.

* Uma boa opção é variar o nível do RAID de acordo com a importância de um tipo de dados. Por exemplo, armazene dados semiimportantes que podem ser regenerados em um disco RAID 0, mas armazene dados realmente importantes, como informações do host e logs, em um disco RAID 0+1 ou RAID *`N`*. O RAID *`N`* pode ser um problema se você tiver muitas gravações, devido ao tempo necessário para atualizar os bits de paridade.

* Você também pode definir os parâmetros do sistema de arquivos que o banco de dados utiliza:

Se você não precisa saber quando os arquivos foram acessados pela última vez (o que não é realmente útil em um servidor de banco de dados), você pode montar seus sistemas de arquivos com a opção `-o noatime`. Isso ignora as atualizações do último horário de acesso nos inodes do sistema de arquivos, o que evita alguns buscas no disco.

Em muitos sistemas operacionais, você pode configurar um sistema de arquivos para ser atualizado de forma assíncrona, montando-o com a opção `-o async`. Se o seu computador estiver razoavelmente estável, isso deve lhe proporcionar um melhor desempenho sem sacrificar muita confiabilidade. (Essa bandeira está ativada por padrão no Linux.)

#### Usando NFS com MySQL

Você deve ser cauteloso ao considerar se deve usar NFS com MySQL. Problemas potenciais, que variam de acordo com o sistema operacional e a versão do NFS, incluem os seguintes:

* Arquivos de dados e logs do MySQL colocados em volumes NFS ficam bloqueados e indisponíveis para uso. Problemas de bloqueio podem ocorrer em casos em que múltiplas instâncias do MySQL acessam o mesmo diretório de dados ou quando o MySQL é desligado indevidamente, devido a uma falta de energia, por exemplo. A versão 4 do NFS aborda problemas de bloqueio subjacentes com a introdução de bloqueio baseado em aconselhamento e arrendamento. No entanto, compartilhar um diretório de dados entre instâncias do MySQL não é recomendado.

* Inconsistências de dados introduzidas devido a mensagens recebidas fora de ordem ou tráfego de rede perdido. Para evitar esse problema, use o TCP com as opções de montagem `hard` e `intr`.

* Limitações de tamanho de arquivo máximo. Os clientes da versão 2 do NFS só podem acessar os primeiros 2 GB de um arquivo (deslocamento assinado de 32 bits). Os clientes da versão 3 do NFS suportam arquivos maiores (até deslocamentos de 64 bits). O tamanho máximo de arquivo suportado também depende do sistema de arquivos local do servidor NFS.

Utilizar o NFS em um ambiente SAN profissional ou em outro sistema de armazenamento tende a oferecer maior confiabilidade do que utilizar o NFS fora de um ambiente desse tipo. No entanto, o NFS em um ambiente SAN pode ser mais lento do que o armazenamento não rotativo diretamente conectado ou conectado por bus.

Se você optar por usar NFS, recomenda-se a versão 4 ou posterior do NFS, assim como testar o seu conjunto de NFS cuidadosamente antes de implantá-lo em um ambiente de produção.

### 8.12.3 Usando Links Simbólicos

Você pode mover bancos de dados ou tabelas do diretório do banco de dados para outros locais e substituí-los por links simbólicos para os novos locais. Você pode querer fazer isso, por exemplo, para mover um banco de dados para um sistema de arquivos com mais espaço livre ou aumentar a velocidade do seu sistema, espalhando suas tabelas em diferentes discos.

Para as tabelas `InnoDB`, use a cláusula `DATA DIRECTORY` da declaração `CREATE TABLE` em vez de links simbólicos, conforme explicado na Seção 14.6.1.2, “Criando tabelas externamente”. Esta nova funcionalidade é uma técnica compatível com várias plataformas.

A maneira recomendada para fazer isso é criar um symlink para diretórios inteiros de banco de dados em um disco diferente. Crie um symlink para as tabelas `MyISAM` apenas como último recurso.

Para determinar a localização do diretório de seus dados, use esta declaração:

```sql
SHOW VARIABLES LIKE 'datadir';
```

#### 8.12.3.1 Usando Links Simbólicos para Bancos de Dados no Unix

Em Unix, a maneira de criar um symlink para um banco de dados é, primeiro, criar um diretório em algum disco onde você tenha espaço livre e, em seguida, criar um link mole para ele a partir do diretório de dados do MySQL.

```sql
$> mkdir /dr1/databases/test
$> ln -s /dr1/databases/test /path/to/datadir
```

O MySQL não suporta a vinculação de um diretório a múltiplos bancos de dados. Substituir um diretório de banco de dados por um link simbólico funciona desde que você não faça um link simbólico entre os bancos de dados. Suponha que você tenha um banco de dados `db1` sob o diretório de dados do MySQL, e depois faça um symlink `db2` que aponte para `db1`:

```sql
$> cd /path/to/datadir
$> ln -s db1 db2
```

O resultado é que, para qualquer tabela `tbl_a` em `db1`, também parece haver uma tabela `tbl_a` em `db2`. Se um cliente atualizar `db1.tbl_a` e outro cliente atualizar `db2.tbl_a`, problemas provavelmente ocorrerão.

#### 8.12.3.2 Usando Links Simbólicos para Tabelas MyISAM em Unix

Os links simbólicos são totalmente suportados apenas para as tabelas `MyISAM`. Para arquivos usados por tabelas para outros motores de armazenamento, você pode obter problemas estranhos se tentar usar links simbólicos. Para as tabelas `InnoDB`, use a técnica alternativa explicada na Seção 14.6.1.2, “Criando Tabelas Externamente” em vez disso.

Não crie symlinks em sistemas que não possuem uma chamada totalmente operacional do `realpath()`. (Linux e Solaris suportam `realpath()`). Para determinar se seu sistema suporta links simbólicos, verifique o valor da variável de sistema `have_symlink` usando esta declaração:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

O manuseio de links simbólicos para as tabelas `MyISAM` funciona da seguinte forma:

* No diretório de dados, você sempre tem o arquivo de formato de tabela (`.frm`) o arquivo de dados (`.MYD`) e o arquivo de índice (`.MYI`) . O arquivo de dados e o arquivo de índice podem ser movidos para outro lugar e substituídos no diretório de dados por sinônimos. O arquivo de formato não pode.

* Você pode criar um symlink para o arquivo de dados e o arquivo de índice de forma independente em diretórios diferentes.

* Para instruir um servidor MySQL em execução a realizar o symlink, use as opções `DATA DIRECTORY` e `INDEX DIRECTORY` para `CREATE TABLE`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”. Alternativamente, se `mysqld` não estiver em execução, o symlink pode ser realizado manualmente usando **ln -s** a partir da linha de comando.

Nota

O caminho usado com uma das opções `DATA DIRECTORY` ou ambas `INDEX DIRECTORY` e `data` do MySQL pode não incluir o diretório `data` do MySQL. (Bug #32167)

* **myisamchk** não substitui um symlink pelo arquivo de dados ou arquivo de índice. Ele funciona diretamente no arquivo ao qual o symlink aponta. Quaisquer arquivos temporários são criados no diretório onde o arquivo de dados ou arquivo de índice está localizado. O mesmo vale para as declarações `ALTER TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* Nota

Quando você exclui uma tabela que está usando symlinks, *tanto o symlink quanto o arquivo ao qual o symlink aponta são excluídos*. Esse é um motivo extremamente bom para *não* executar `mysqld` como usuário do sistema operacional `root` ou permitir que usuários do sistema operacional tenham acesso de escrita aos diretórios do banco de dados MySQL.

* Se você renomear uma tabela com `ALTER TABLE ... RENAME` ou `RENAME TABLE` e não mover a tabela para outro banco de dados, os symlinks no diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

* Se você usar `ALTER TABLE ... RENAME` ou `RENAME TABLE` para mover uma tabela para outro banco de dados, a tabela é movida para o diretório do outro banco de dados. Se o nome da tabela foi alterado, os symlinks no novo diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

* Se você não estiver usando symlinks, comece `mysqld` com a opção `--skip-symbolic-links` para garantir que ninguém possa usar `mysqld` para excluir ou renomear um arquivo fora do diretório de dados.

Essas operações de symlink de tabela não são suportadas:

* `ALTER TABLE` ignora as opções da tabela `DATA DIRECTORY` e `INDEX DIRECTORY`.

* Como indicado anteriormente, apenas os arquivos de dados e de índice podem ser links simbólicos. O arquivo `.frm` *nunca* deve ser um link simbólico. Tentar fazer isso (por exemplo, para fazer um nome de tabela ser sinônimo de outro) produz resultados incorretos. Suponha que você tenha um banco de dados `db1` sob o diretório de dados do MySQL, uma tabela `tbl1` neste banco de dados, e no diretório `db1` você faça um symlink `tbl2` que aponta para `tbl1`:

  ```sql
  $> cd /path/to/datadir/db1
  $> ln -s tbl1.frm tbl2.frm
  $> ln -s tbl1.MYD tbl2.MYD
  $> ln -s tbl1.MYI tbl2.MYI
  ```

Há problemas se um fio de execução lê `db1.tbl1` e outro fio de execução atualiza `db1.tbl2`:

+ O cache de consulta é "enganado" (não tem como saber que `tbl1` não foi atualizado, então ele retorna resultados desatualizados).

As declarações `ALTER` sobre `tbl2` falham.

#### 8.12.3.3 Usando Links Simbólicos para Bancos de Dados no Windows

Em Windows, os links simbólicos podem ser usados para diretórios de banco de dados. Isso permite que você coloque um diretório de banco de dados em um local diferente (por exemplo, em um disco diferente) configurando um link simbólico para ele. O uso de links simbólicos de banco de dados em Windows é semelhante ao seu uso em Unix, embora o procedimento para configurar o link difira.

Suponha que você queira colocar o diretório do banco de dados para um banco de dados chamado `mydb` em `D:\data\mydb`. Para fazer isso, crie um link simbólico no diretório de dados do MySQL que aponte para `D:\data\mydb`. No entanto, antes de criar o link simbólico, certifique-se de que o diretório `D:\data\mydb` existe, criando-o, se necessário. Se você já tem um diretório de banco de dados chamado `mydb` no diretório de dados, mova-o para `D:\data`. Caso contrário, o link simbólico será ineficaz. Para evitar problemas, certifique-se de que o servidor não esteja em execução quando você mover o diretório do banco de dados.

Em Windows, você pode criar um symlink usando o comando **mklink**. Esse comando requer privilégios administrativos.

1. Certifique-se de que o caminho desejado para o banco de dados existe. Para este exemplo, usamos `D:\data\mydb`, e um banco de dados chamado `mydb`.

2. Se o banco de dados ainda não existir, emita `CREATE DATABASE mydb` no cliente **mysql** para criá-lo.

3. Parar o serviço MySQL. 4. Usando o Explorador do Windows ou a linha de comando, mova o diretório `mydb` do diretório de dados para `D:\data`, substituindo o diretório do mesmo nome.

5. Se você ainda não estiver usando o prompt de comando, abra-o e mude a localização para o diretório de dados, assim:

   ```sql
   C:\> cd \path\to\datadir
   ```

Se a sua instalação do MySQL estiver no local padrão, você pode usar isso:

   ```sql
   C:\> cd C:\ProgramData\MySQL\MySQL Server 5.7\Data
   ```

6. No diretório de dados, crie um symlink chamado `mydb` que aponte para a localização do diretório do banco de dados:

   ```sql
   C:\> mklink /d mydb D:\data\mydb
   ```

7. Inicie o serviço do MySQL.

Após isso, todas as tabelas criadas no banco de dados `mydb` são criadas em `D:\data\mydb`.

Como alternativa, em qualquer versão do Windows suportada pelo MySQL, você pode criar um link simbólico para um banco de dados MySQL criando um arquivo `.sym` no diretório de dados que contém o caminho do diretório de destino. O arquivo deve ser chamado `db_name.sym`, onde *`db_name`* é o nome do banco de dados.

O suporte para links simbólicos de banco de dados no Windows usando arquivos `.sym` é habilitado por padrão. Se você não precisa de links simbólicos de arquivos `.sym`, pode desativar o suporte para eles, iniciando `mysqld` com a opção `--skip-symbolic-links`. Para determinar se o seu sistema suporta links simbólicos de arquivos `.sym`, verifique o valor da variável de sistema `have_symlink` usando esta declaração:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

Para criar um symlink de arquivo `.sym`, use este procedimento:

1. Mude a localização para o diretório de dados:

   ```sql
   C:\> cd \path\to\datadir
   ```

2. No diretório de dados, crie um arquivo de texto com o nome `mydb.sym` que contenha este nome de caminho: `D:\data\mydb\`

Nota

O nome do caminho para o novo banco de dados e tabelas deve ser absoluto. Se você especificar um caminho relativo, a localização é relativa ao arquivo `mydb.sym`.

Após isso, todas as tabelas criadas no banco de dados `mydb` são criadas em `D:\data\mydb`.

Nota

Como o suporte para arquivos `.sym` é redundante, com suporte nativo a sylinks disponível usando **mklink**, o uso de arquivos `.sym` é desaconselhado; espera-se que o suporte para eles seja removido em uma versão futura do MySQL.

As seguintes limitações se aplicam ao uso dos arquivos `.sym` para vinculação simbólica de banco de dados no Windows. Essas limitações não se aplicam a symlinks criados usando **mklink**.

* O link simbólico não é usado se um diretório com o mesmo nome que o banco de dados existir no diretório de dados do MySQL.

* A opção `--innodb_file_per_table` não pode ser usada.

* Se você executar `mysqld` como um serviço, não pode usar uma unidade mapeada em um servidor remoto como destino do link simbólico. Como uma solução alternativa, você pode usar o caminho completo (`\\servername\path\`).

### 8.12.4 Otimizando o uso da memória

#### 8.12.4.1 Como o MySQL usa memória

O MySQL aloca buffers e caches para melhorar o desempenho das operações do banco de dados. A configuração padrão é projetada para permitir que um servidor MySQL comece em uma máquina virtual que tenha aproximadamente 512 MB de RAM. Você pode melhorar o desempenho do MySQL aumentando os valores de determinadas variáveis de sistema relacionadas a cache e buffers. Você também pode modificar a configuração padrão para executar o MySQL em sistemas com memória limitada.

A lista a seguir descreve algumas das maneiras pelas quais o MySQL utiliza a memória. Quando aplicável, as variáveis do sistema relevantes são referenciadas. Alguns itens são específicos do mecanismo de armazenamento ou recursos.

* O pool de memória `InnoDB` é uma área de memória que armazena dados `InnoDB` cacheados para tabelas, índices e outros buffers auxiliares. Para a eficiência de operações de leitura de alto volume, o pool de memória é dividido em páginas que podem potencialmente conter várias linhas. Para a eficiência da gestão de cache, o pool de memória é implementado como uma lista enlaçada de páginas; os dados que são raramente usados são eliminados da cache, usando uma variação do algoritmo LRU. Para mais informações, consulte a Seção 14.5.1, “Pool de Memória”.

O tamanho do pool de buffer é importante para o desempenho do sistema:

+ `InnoDB` aloca memória para todo o conjunto de buffers na inicialização do servidor, usando operações de `malloc()`. A variável de sistema `innodb_buffer_pool_size` define o tamanho do conjunto de buffers. Tipicamente, um valor recomendado de `innodb_buffer_pool_size` é de 50 a 75 por cento da memória do sistema. `innodb_buffer_pool_size` pode ser configurado dinamicamente, enquanto o servidor está em execução. Para mais informações, consulte a Seção 14.8.3.1, “Configurando o Tamanho do Conjunto de Buffers de InnoDB”.

+ Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o conjunto de buffers em várias instâncias do conjunto de buffers. A variável de sistema `innodb_buffer_pool_instances` define o número de instâncias do conjunto de buffers.

+ Um pool de buffer que é muito pequeno pode causar um movimento excessivo, pois as páginas são descartadas do pool de buffer e, pouco tempo depois, são necessárias novamente.

+ Um pool de buffer que é muito grande pode causar troca devido à competição por memória.

* Todos os fios compartilham o buffer de chave `MyISAM`. A variável de sistema `key_buffer_size` determina seu tamanho.

Para cada tabela `MyISAM` que o servidor abre, o arquivo de índice é aberto uma vez; o arquivo de dados é aberto uma vez para cada thread que acessa a tabela simultaneamente. Para cada thread concorrente, uma estrutura de tabela, estruturas de coluna para cada coluna e um buffer do tamanho `3 * N` são alocados (onde *`N`* é o comprimento máximo da linha, não contando as colunas `BLOB`). Uma coluna `BLOB` requer de cinco a oito bytes mais o comprimento dos dados `BLOB`. O mecanismo de armazenamento `MyISAM` mantém um buffer de linha extra para uso interno.

* A variável de sistema `myisam_use_mmap` pode ser definida como 1 para habilitar a mapeo de memória para todas as tabelas `MyISAM`.

* Se uma tabela temporária interna de memória se tornar muito grande (determinada usando as variáveis de sistema `tmp_table_size` e `max_heap_table_size`, o MySQL automaticamente converte a tabela de memória para o formato de disco. As tabelas temporárias de disco usam o mecanismo de armazenamento definido pela variável de sistema `internal_tmp_disk_storage_engine`. Você pode aumentar o tamanho permitido da tabela temporária conforme descrito na Seção 8.4.4, "Uso de Tabela Temporária Interna no MySQL".

Para as tabelas `MEMORY` explicitamente criadas com `CREATE TABLE`, apenas a variável de sistema `max_heap_table_size` determina o tamanho que uma tabela pode crescer, e não há conversão para formato em disco.

* O Schema de Desempenho do MySQL é uma funcionalidade para monitorar a execução do servidor MySQL em um nível baixo. O Schema de Desempenho aloca dinamicamente a memória incrementalmente, escalando seu uso de memória para a carga real do servidor, em vez de alocar a memória necessária durante o início do servidor. Uma vez que a memória é alocada, ela não é liberada até que o servidor seja reiniciado. Para mais informações, consulte a Seção 25.17, “O Modelo de Alocação de Memória do Schema de Desempenho”.

* Cada fio que o servidor usa para gerenciar conexões de clientes requer algum espaço específico para fio. A lista a seguir indica esses e quais variáveis do sistema controlam seu tamanho:

+ Uma pilha (`thread_stack`)

+ Um buffer de conexão (`net_buffer_length`)

+ Um buffer de resultado (`net_buffer_length`)

O buffer de conexão e o buffer de resultado começam cada um com um tamanho igual a `net_buffer_length` bytes, mas são ampliados dinamicamente até `max_allowed_packet` bytes conforme necessário. O buffer de resultado encolhe para `net_buffer_length` bytes após cada declaração SQL. Enquanto uma declaração está sendo executada, uma cópia da string atual da declaração também é alocada.

Cada fio de conexão usa memória para calcular os resumos das declarações. O servidor aloca `max_digest_length` bytes por sessão. Veja a Seção 25.10, “Resumo de declarações do Schema de desempenho”.

* Todos os fios compartilham a mesma memória básica. * Quando um fio não é mais necessário, a memória alocada para ele é liberada e devolvida ao sistema, a menos que o fio volte para a cache de fios. Nesse caso, a memória permanece alocada.

* Cada solicitação que realiza uma varredura sequencial de uma tabela aloca um buffer de leitura. A variável de sistema `read_buffer_size` determina o tamanho do buffer.

* Ao ler linhas em uma sequência arbitrária (por exemplo, após uma ordenação), um buffer de leitura aleatória pode ser alocado para evitar buscas no disco. A variável de sistema `read_rnd_buffer_size` determina o tamanho do buffer.

* Todos os junções são executados em uma única passagem, e a maioria das junções pode ser feita sem usar uma tabela temporária. A maioria das tabelas temporárias são tabelas de hash baseadas em memória. As tabelas temporárias com um comprimento de linha grande (calculado como a soma de todos os comprimentos das colunas) ou que contêm colunas `BLOB` são armazenadas em disco.

* A maioria dos pedidos que realizam uma classificação aloca um buffer de classificação e de zero a dois arquivos temporários, dependendo do tamanho do conjunto de resultados. Veja a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

* Quase todo o processamento e cálculo são feitos em pools de memória locais e reutilizáveis. Não é necessário sobrecarga de memória para itens pequenos, evitando assim a alocação e liberação de memória lenta. A memória é alocada apenas para strings inesperadamente grandes.

* Para cada tabela com colunas `BLOB`, um buffer é ampliado dinamicamente para ler valores maiores de `BLOB`. Se você digitalizar uma tabela, o buffer cresce até o tamanho do maior valor de `BLOB`.

* O MySQL requer memória e descritores para o cache de tabela. As estruturas de manipulador para todas as tabelas em uso são salvas no cache de tabela e gerenciadas como "Primeiro a Entrar, Primeiro a Saiar" (FIFO). A variável de sistema `table_open_cache` define o tamanho inicial do cache de tabela; veja Seção 8.4.3.1, "Como o MySQL Abre e Fecha Tabelas".

O MySQL também requer memória para o cache de definição de tabela. A variável de sistema `table_definition_cache` define o número de definições de tabela (dos arquivos `.frm`) que podem ser armazenadas no cache de definição de tabela. Se você usar um grande número de tabelas, pode criar um cache de definição de tabela grande para acelerar a abertura das tabelas. O cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache de tabela.

Uma declaração `FLUSH TABLES` ou o comando **mysqladmin flush-tables** fecha todas as tabelas que não estão em uso de uma vez e marca todas as tabelas em uso para serem fechadas quando o thread atualmente em execução terminar. Isso libera efetivamente a maioria da memória em uso. `FLUSH TABLES` não retorna até que todas as tabelas tenham sido fechadas.

* O servidor armazena informações na memória como resultado das declarações `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas declarações correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das declarações que causam cache, o uso de memória cacheada é muito provável que aumente, a menos que seja liberado com `FLUSH PRIVILEGES`.

**ps** e outros programas de status do sistema podem relatar que `mysqld` usa muita memória. Isso pode ser causado por pilhas de threads em diferentes endereços de memória. Por exemplo, a versão Solaris do **ps** conta a memória não usada entre as pilhas como memória usada. Para verificar isso, verifique a troca disponível com `swap -s`. Testamos `mysqld` com vários detectores de vazamento de memória (tanto comerciais quanto de código aberto), então não deve haver vazamentos de memória.

#### 8.12.4.2 Monitoramento do uso de memória do MySQL

O exemplo a seguir demonstra como usar o Schema de Desempenho e o esquema sys para monitorar o uso de memória do MySQL.

A maioria dos instrumentos de memória do Schema de desempenho é desativada por padrão. Os instrumentos podem ser ativados atualizando a coluna `ENABLED` da tabela do Schema de desempenho `setup_instruments`. Os instrumentos de memória têm nomes na forma de `memory/code_area/instrument_name`, onde *`code_area`* é um valor como `sql` ou `innodb`, e *`instrument_name`* é o detalhe do instrumento.

1. Para visualizar os instrumentos de memória MySQL disponíveis, consulte a tabela do Gerador de Desempenho `setup_instruments`. A seguinte consulta retorna centenas de instrumentos de memória para todas as áreas de código.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory%';
   ```

Você pode restringir os resultados especificando uma área de código. Por exemplo, você pode limitar os resultados aos instrumentos de memória `InnoDB`, especificando `innodb` como a área de código.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory/innodb%';
   +-------------------------------------------+---------+-------+
   | NAME                                      | ENABLED | TIMED |
   +-------------------------------------------+---------+-------+
   | memory/innodb/adaptive hash index         | NO      | NO    |
   | memory/innodb/buf_buf_pool                | NO      | NO    |
   | memory/innodb/dict_stats_bg_recalc_pool_t | NO      | NO    |
   | memory/innodb/dict_stats_index_map_t      | NO      | NO    |
   | memory/innodb/dict_stats_n_diff_on_level  | NO      | NO    |
   | memory/innodb/other                       | NO      | NO    |
   | memory/innodb/row_log_buf                 | NO      | NO    |
   | memory/innodb/row_merge_sort              | NO      | NO    |
   | memory/innodb/std                         | NO      | NO    |
   | memory/innodb/trx_sys_t::rw_trx_ids       | NO      | NO    |
   ...
   ```

Dependendo da sua instalação do MySQL, as áreas de código podem incluir `performance_schema`, `sql`, `client`, `innodb`, `myisam`, `csv`, `memory`, `blackhole`, `archive`, `partition` e outras.

2. Para habilitar os instrumentos de memória, adicione uma regra `performance-schema-instrument` ao seu arquivo de configuração do MySQL. Por exemplo, para habilitar todos os instrumentos de memória, adicione esta regra ao seu arquivo de configuração e reinicie o servidor:

   ```sql
   performance-schema-instrument='memory/%=COUNTED'
   ```

Nota

Habilitar os instrumentos de memória no início garante que as alocações de memória que ocorrem no início sejam contadas.

Após reiniciar o servidor, a coluna `ENABLED` da tabela do Gerador de Desempenho `setup_instruments` deve relatar `YES` para os instrumentos de memória que você habilitou. A coluna `TIMED` na tabela `setup_instruments` é ignorada para instrumentos de memória porque as operações de memória não são temporizadas.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory/innodb%';
   +-------------------------------------------+---------+-------+
   | NAME                                      | ENABLED | TIMED |
   +-------------------------------------------+---------+-------+
   | memory/innodb/adaptive hash index         | NO      | NO    |
   | memory/innodb/buf_buf_pool                | NO      | NO    |
   | memory/innodb/dict_stats_bg_recalc_pool_t | NO      | NO    |
   | memory/innodb/dict_stats_index_map_t      | NO      | NO    |
   | memory/innodb/dict_stats_n_diff_on_level  | NO      | NO    |
   | memory/innodb/other                       | NO      | NO    |
   | memory/innodb/row_log_buf                 | NO      | NO    |
   | memory/innodb/row_merge_sort              | NO      | NO    |
   | memory/innodb/std                         | NO      | NO    |
   | memory/innodb/trx_sys_t::rw_trx_ids       | NO      | NO    |
   ...
   ```

3. Consultar dados do instrumento de memória. Neste exemplo, os dados do instrumento de memória são consultados na tabela do Schema de desempenho `memory_summary_global_by_event_name`, que resume os dados por `EVENT_NAME`. O `EVENT_NAME` é o nome do instrumento.

A consulta a seguir retorna dados de memória para o pool de buffers `InnoDB`. Para descrições de colunas, consulte a Seção 25.12.15.9, “Tabelas de Resumo de Memória”.

   ```sql
   mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
          WHERE EVENT_NAME LIKE 'memory/innodb/buf_buf_pool'\G
                     EVENT_NAME: memory/innodb/buf_buf_pool
                    COUNT_ALLOC: 1
                     COUNT_FREE: 0
      SUM_NUMBER_OF_BYTES_ALLOC: 137428992
       SUM_NUMBER_OF_BYTES_FREE: 0
                 LOW_COUNT_USED: 0
             CURRENT_COUNT_USED: 1
                HIGH_COUNT_USED: 1
       LOW_NUMBER_OF_BYTES_USED: 0
   CURRENT_NUMBER_OF_BYTES_USED: 137428992
      HIGH_NUMBER_OF_BYTES_USED: 137428992
   ```

Os mesmos dados subjacentes podem ser consultados usando o esquema `sys` da tabela `memory_global_by_current_bytes`, que mostra o uso atual da memória dentro do servidor globalmente, detalhado por tipo de alocação.

   ```sql
   mysql> SELECT * FROM sys.memory_global_by_current_bytes
          WHERE event_name LIKE 'memory/innodb/buf_buf_pool'\G
   *************************** 1. row ***************************
          event_name: memory/innodb/buf_buf_pool
       current_count: 1
       current_alloc: 131.06 MiB
   current_avg_alloc: 131.06 MiB
          high_count: 1
          high_alloc: 131.06 MiB
      high_avg_alloc: 131.06 MiB
   ```

Essa consulta do esquema `sys` agrega a memória atualmente alocada (`current_alloc`) por área de código:

   ```sql
   mysql> SELECT SUBSTRING_INDEX(event_name,'/',2) AS
          code_area, sys.format_bytes(SUM(current_alloc))
          AS current_alloc
          FROM sys.x$memory_global_by_current_bytes
          GROUP BY SUBSTRING_INDEX(event_name,'/',2)
          ORDER BY SUM(current_alloc) DESC;
   +---------------------------+---------------+
   | code_area                 | current_alloc |
   +---------------------------+---------------+
   | memory/innodb             | 843.24 MiB    |
   | memory/performance_schema | 81.29 MiB     |
   | memory/mysys              | 8.20 MiB      |
   | memory/sql                | 2.47 MiB      |
   | memory/memory             | 174.01 KiB    |
   | memory/myisam             | 46.53 KiB     |
   | memory/blackhole          | 512 bytes     |
   | memory/federated          | 512 bytes     |
   | memory/csv                | 512 bytes     |
   | memory/vio                | 496 bytes     |
   +---------------------------+---------------+
   ```

Para mais informações sobre o esquema `sys`, consulte o Capítulo 26, *Schema sys de MySQL*.

#### 8.12.4.3 Habilitar o suporte para páginas grandes

Algumas arquiteturas de hardware e sistemas operacionais suportam páginas de memória maiores do que o padrão (geralmente 4 KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacente. Aplicativos que realizam muitos acessos de memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

Em MySQL, as páginas grandes podem ser usadas pelo `InnoDB`, para alocar memória para seu conjunto de buffers e um conjunto de memória adicional.

O uso padrão de páginas grandes no MySQL tenta usar o tamanho maior suportado, até 4 MB. Sob o Solaris, um recurso de "páginas super grandes" permite o uso de páginas de até 256 MB. Esse recurso está disponível para plataformas SPARC recentes. Ele pode ser habilitado ou desabilitado usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

O MySQL também suporta a implementação do Linux para suporte a páginas grandes (que é chamada de HugeTLB no Linux).

Antes que páginas grandes possam ser usadas no Linux, o kernel deve ser habilitado para suportá-las e é necessário configurar o pool de memória HugeTLB. Para referência, a API HugeTBL é documentada no arquivo `Documentation/vm/hugetlbpage.txt` de suas fontes do Linux.

Os núcleos de alguns sistemas recentes, como o Red Hat Enterprise Linux, podem ter a funcionalidade de páginas grandes habilitada por padrão. Para verificar se isso é verdade para o seu núcleo, use o seguinte comando e procure por linhas de saída que contenham “huge”:

```sql
$> grep -i huge /proc/meminfo
AnonHugePages:   2658304 kB
ShmemHugePages:        0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:               0 kB
```

A saída de comando não vazia indica que o suporte para páginas grandes está presente, mas os valores nulos indicam que nenhuma página está configurada para uso.

Se o seu kernel precisar ser reconfigurado para suportar páginas grandes, consulte o arquivo `hugetlbpage.txt` para obter instruções.

Supondo que seu kernel Linux tenha suporte a páginas grandes habilitado, configure-o para uso pelo MySQL usando os seguintes passos:

1. Determine o número de páginas grandes necessárias. Este é o tamanho do pool de buffers InnoDB dividido pelo tamanho da página grande, que podemos calcular como `innodb_buffer_pool_size` / `Hugepagesize`. Admitindo o valor padrão para o `innodb_buffer_pool_size` (128 MB) e usando o valor `Hugepagesize` obtido a partir de `/proc/meminfo` (2 MB), isso é 128 MB / 2 MB, ou 64 Páginas Imensa. Chamamos esse valor de *`P`*.

2. Como raiz do sistema, abra o arquivo `/etc/sysctl.conf` em um editor de texto e adicione a linha mostrada aqui, onde *`P`* é o número de páginas grandes obtidas no passo anterior:

   ```sql
   vm.nr_hugepages=P
   ```

Usando o valor real obtido anteriormente, a linha adicional deve parecer assim:

   ```sql
   vm.nr_hugepages=66
   ```

Salve o arquivo atualizado.

3. Como raiz do sistema, execute o seguinte comando:

   ```sql
   $> sudo sysctl -p
   ```

Nota

Em alguns sistemas, o arquivo de páginas grandes pode ter um nome ligeiramente diferente; por exemplo, algumas distribuições o chamam de `nr_hugepages`. No caso em que o **sysctl** retorna um erro relacionado ao nome do arquivo, verifique o nome do arquivo correspondente em `/proc/sys/vm` e use esse nome em vez disso.

Para verificar a configuração da página grande, verifique novamente `/proc/meminfo` conforme descrito anteriormente. Agora, você deve ver alguns valores adicionais não nulos na saída, semelhantes a este:

   ```sql
   $> grep -i huge /proc/meminfo
   AnonHugePages:   2686976 kB
   ShmemHugePages:        0 kB
   HugePages_Total:     233
   HugePages_Free:      233
   HugePages_Rsvd:        0
   HugePages_Surp:        0
   Hugepagesize:       2048 kB
   Hugetlb:          477184 kB
   ```

4. Opcionalmente, você pode querer compactar a VM Linux. Você pode fazer isso usando uma sequência de comandos, possivelmente em um arquivo de script, semelhante ao que é mostrado aqui:

   ```sql
   sync
   sync
   sync
   echo 3 > /proc/sys/vm/drop_caches
   echo 1 > /proc/sys/vm/compact_memory
   ```

Consulte a documentação da sua plataforma operacional para obter mais informações sobre como fazer isso.

5. Verifique quaisquer arquivos de configuração, como `my.cnf`, usados pelo servidor, e certifique-se de que `innodb_buffer_pool_chunk_size` esteja definido maior que o tamanho enorme da página. O padrão para essa variável é 128 M.

O suporte a páginas grandes no servidor MySQL é desativado por padrão. Para ativá-lo, inicie o servidor com `--large-pages`. Também pode fazer isso adicionando a seguinte linha à seção `[mysqld]` do arquivo do servidor `my.cnf`:

   ```sql
   large-pages=ON
   ```

Com essa opção ativada, `InnoDB` usa páginas grandes automaticamente para seu buffer pool e pool de memória adicional. Se `InnoDB` não puder fazer isso, ele volta a usar memória tradicional e escreve um aviso no log de erro: Aviso: Usando pool de memória convencional.

Você pode verificar que o MySQL está usando páginas grandes verificando `/proc/meminfo` novamente após reiniciar `mysqld`, da seguinte forma:

```sql
$> grep -i huge /proc/meminfo
AnonHugePages:   2516992 kB
ShmemHugePages:        0 kB
HugePages_Total:     233
HugePages_Free:      222
HugePages_Rsvd:       55
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:          477184 kB
```
