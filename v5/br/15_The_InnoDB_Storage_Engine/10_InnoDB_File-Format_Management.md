## 14.10 Gerenciamento do formato de arquivo InnoDB

À medida que o `InnoDB` evolui, os formatos de arquivo de dados que não são compatíveis com versões anteriores do `InnoDB` são, às vezes, necessários para suportar novos recursos. Para ajudar a gerenciar a compatibilidade em situações de atualização e downgrade, e em sistemas que executam diferentes versões do MySQL, o `InnoDB` utiliza formatos de arquivo com nomes. O `InnoDB` atualmente suporta dois formatos de arquivo com nomes, Antelope e Barracuda.

* O Antelope é o formato original de arquivo `InnoDB`, que anteriormente não tinha um nome. Ele suporta os formatos de linha COMPACT e REDUNDANT para tabelas `InnoDB`.

* O Barracuda é o formato de arquivo mais recente. Ele suporta todos os formatos de linha `InnoDB`, incluindo os novos formatos COMPRESSED e DYNAMIC. As características associadas aos formatos de linha COMPRESSED e DYNAMIC incluem tabelas compactadas, armazenamento eficiente de colunas fora da página e prefixos de chave de índice de até 3072 bytes (`innodb_large_prefix`). Veja a Seção 14.11, “Formatos de linha InnoDB”.

Esta seção discute a habilitação dos formatos de arquivo `InnoDB` para novas tabelas `InnoDB`, verificando a compatibilidade dos diferentes formatos de arquivo entre as versões do MySQL e identificando o formato de arquivo em uso.

As configurações do formato de arquivo InnoDB não se aplicam a tabelas armazenadas em espaços de tabela gerais. Os espaços de tabela gerais fornecem suporte para todos os formatos de linha e recursos associados. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabela geral”.

Nota

Os seguintes parâmetros de configuração do formato de arquivo têm novos valores padrão:

* O valor padrão do `innodb_file_format` foi alterado para `Barracuda`. O valor padrão anterior era `Antelope`.

* O valor padrão do `innodb_large_prefix` foi alterado para `ON`. O valor padrão anterior era `OFF`.

Os seguintes parâmetros de configuração de formato de arquivo são desatualizados e podem ser removidos em uma versão futura:

* `innodb_file_format`
* `innodb_file_format_check`
* `innodb_file_format_max`
* `innodb_large_prefix`

Os parâmetros de configuração do formato de arquivo foram fornecidos para criar tabelas compatíveis com versões anteriores do `InnoDB` no MySQL 5.1. Agora que o MySQL 5.1 atingiu o fim de seu ciclo de vida do produto, os parâmetros não são mais necessários.

### 14.10.1 Habilitar formatos de arquivo

A opção de configuração `innodb_file_format` permite um formato de arquivo `InnoDB` para espaços de tabela por tabela.

`Barracuda` é o padrão `innodb_file_format`. Em versões anteriores, o formato de arquivo padrão era `Antelope`.

Nota

A opção de configuração `innodb_file_format` é desatualizada e pode ser removida em uma versão futura. Para mais informações, consulte a Seção 14.10, “Gestão do formato de arquivo InnoDB”.

Você pode definir o valor de `innodb_file_format` na linha de comando quando você inicia o `mysqld`, ou no arquivo de opções (`my.cnf` em Unix, `my.ini` em Windows). Você também pode alterá-lo dinamicamente com uma declaração `SET GLOBAL`.

```sql
SET GLOBAL innodb_file_format=Barracuda;
```

#### Notas de uso

* As configurações do formato de arquivo `InnoDB` não se aplicam a tabelas armazenadas em espaços de tabela gerais. Os espaços de tabela gerais fornecem suporte para todos os formatos de linha e recursos associados. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabela Geral”.

* O ajuste `innodb_file_format` não é aplicável ao usar a opção de tabela `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE` para armazenar uma tabela `DYNAMIC` no espaço de tabelas do sistema.

* O ajuste `innodb_file_format` é ignorado ao criar tabelas que utilizam o formato de linha `DYNAMIC`. Para mais informações, consulte o formato de linha dinâmico.

### 14.10.1 Verificar a compatibilidade do formato de arquivo

O InnoDB incorpora vários verificações para proteger contra possíveis falhas e corrupções de dados que podem ocorrer se você executar uma versão antiga do servidor MySQL em arquivos de dados do InnoDB que utilizam um formato de arquivo mais recente. Essas verificações ocorrem quando o servidor é iniciado e quando você acessa pela primeira vez uma tabela. Esta seção descreve essas verificações, como você pode controlá-las e as condições de erro e aviso que podem surgir.

#### Compatibilidade Retroativa

Você só precisa considerar a compatibilidade com o formato de arquivo antigo ao usar uma versão recente do InnoDB (MySQL 5.5 e superior com InnoDB) ao lado de uma versão mais antiga (MySQL 5.1 ou anterior, com o InnoDB embutido em vez do Plugin InnoDB). Para minimizar a chance de problemas de compatibilidade, você pode padronizar o Plugin InnoDB para todos os servidores de banco de dados MySQL 5.1 e anteriores.

Em geral, uma versão mais recente do InnoDB pode criar uma tabela ou índice que não pode ser lida ou escrita com segurança com uma versão mais antiga do InnoDB sem o risco de falhas, travamentos, resultados errados ou corrupções. O InnoDB inclui um mecanismo para proteger contra essas condições e ajudar a preservar a compatibilidade entre os arquivos do banco de dados e as versões do InnoDB. Esse mecanismo permite que você aproveite algumas novas funcionalidades de uma versão do InnoDB (como melhorias de desempenho e correções de bugs) e ainda preserve a opção de usar seu banco de dados com uma versão antiga do InnoDB, impedindo o uso acidental de novas funcionalidades que criam arquivos de disco incompatíveis.

Se uma versão do InnoDB suportar um determinado formato de arquivo (se esse formato for o padrão ou não), você pode consultar e atualizar qualquer tabela que exija esse formato ou um formato anterior. Apenas a criação de novas tabelas usando novos recursos é limitada com base no formato de arquivo específico habilitado. Por outro lado, se um espaço de tabelas contiver uma tabela ou índice que use um formato de arquivo que não é suportado, ele não pode ser acessado, mesmo para acesso de leitura.

A única maneira de "desvalorizar" um espaço de tabela InnoDB para o formato de arquivo Antelope anterior é copiar os dados para uma nova tabela, em um espaço de tabela que use o formato anterior.

A maneira mais fácil de determinar o formato do arquivo de um espaço de tabelas existente do InnoDB é examinar as propriedades da tabela que ele contém, usando o comando `SHOW TABLE STATUS` ou consultando a tabela `INFORMATION_SCHEMA.TABLES`. Se o `Row_format` da tabela for relatado como `'Compressed'` ou `'Dynamic'`, o espaço de tabelas que contém a tabela suporta o formato Barracuda.

#### Detalhes Internos

Cada espaço de tabela InnoDB por tabela (representado por um arquivo `*.ibd`) é marcado com um identificador de formato de arquivo. O espaço de tabela do sistema (representado pelos arquivos `ibdata`) é marcado com o formato de arquivo “mais alto” em uso em um grupo de arquivos de banco de dados InnoDB, e essa marcação é verificada quando os arquivos são abertos.

Criar uma tabela compactada, ou uma tabela com `ROW_FORMAT=DYNAMIC`, atualiza o cabeçalho do arquivo do arquivo correspondente por tabela por arquivo `.ibd` e o tipo de tabela no dicionário de dados InnoDB com o identificador do formato de arquivo Barracuda. A partir desse ponto, a tabela não pode ser usada com uma versão do InnoDB que não suporte o formato de arquivo Barracuda. Para proteger contra comportamento anômalo, o InnoDB realiza uma verificação de compatibilidade quando a tabela é aberta. (Em muitos casos, a declaração `ALTER TABLE` recria uma tabela e, portanto, altera suas propriedades. O caso especial de adicionar ou remover índices sem reconstruir a tabela é descrito na Seção 14.13.1, “Operações DDL Online”.)

Os espaços de tabela gerais, que também são representados por um arquivo `*.ibd`, suportam tanto os formatos de arquivo Antelope quanto Barracuda. Para mais informações sobre espaços de tabela gerais, consulte a Seção 14.6.3.3, “Espaços de tabela gerais”.

#### Definição do conjunto de arquivos ib

Para evitar confusão, para os propósitos desta discussão, definimos o termo "conjunto de arquivos ib" como o conjunto de arquivos do sistema operacional que o InnoDB gerencia como uma unidade. O conjunto de arquivos ib inclui os seguintes arquivos:

* O espaço de tabela do sistema (um ou mais arquivos `ibdata`) que contêm informações internas do sistema (incluindo catálogos internos e informações de desfazer) e podem incluir dados e índices do usuário.

* Espaços de tabela única (também chamados de "arquivos por tabela", com o nome de arquivos `*.ibd`).

* Arquivos de registro do InnoDB; geralmente dois, `ib_logfile0` e `ib_logfile1`. Usados para recuperação em caso de falha e em backups.

Um conjunto de arquivos ib não inclui os arquivos correspondentes `.frm` que contêm metadados sobre as tabelas InnoDB. Os arquivos `.frm` são criados e gerenciados pelo MySQL e, às vezes, podem ficar fora de sincronia com os metadados internos no InnoDB.

Várias tabelas, mesmo de mais de um banco de dados, podem ser armazenadas em um único “conjunto de arquivos ib”. (Em MySQL, um “banco de dados” é uma coleção lógica de tabelas, o que outros sistemas se referem como um “esquema” ou “catálogo”.

#### 14.10.2.1 Verificação de compatibilidade quando o InnoDB é iniciado

Para evitar possíveis falhas ou corrupções de dados quando o InnoDB abre um conjunto de arquivos ib, ele verifica se pode suportar totalmente os formatos de arquivo utilizados no conjunto de arquivos ib. Se o sistema for reiniciado após uma falha ou uma "desativação rápida" (ou seja, `innodb_fast_shutdown` é maior que zero), podem haver estruturas de dados no disco (como entradas de refazer ou desfazer ou páginas de escrita dupla) que estão em um formato "muito novo" para o software atual. Durante o processo de recuperação, danos graves podem ser causados aos seus arquivos de dados se essas estruturas de dados forem acessadas. O check de inicialização do formato de arquivo ocorre antes de qualquer processo de recuperação começar, impedindo assim problemas de consistência com as novas tabelas ou problemas de inicialização para o servidor MySQL.

Começando com a versão InnoDB 1.0.1, o espaço de tabelas do sistema registra um identificador ou marcação para o formato de arquivo “mais alto” usado por qualquer tabela em qualquer um dos espaços de tabelas que fazem parte do conjunto de arquivos ib. As verificações contra essa marcação de formato de arquivo são controladas pelo parâmetro de configuração `innodb_file_format_check`, que é `ON` por padrão.

Se a tag de formato de arquivo nas tabelas do sistema for mais nova ou superior à versão mais alta suportada pelo software que está atualmente em execução e se `innodb_file_format_check` é `ON`, o seguinte erro é emitido quando o servidor é iniciado:

```sql
InnoDB: Error: the system tablespace is in a
file format that this version doesn't support
```

Você também pode definir `innodb_file_format` para o nome de um formato de arquivo. Isso impede que o InnoDB seja iniciado se o software atual não suportar o formato de arquivo especificado. Também define o "limite máximo" para o valor que você especificar. A capacidade de definir `innodb_file_format_check` é útil (com futuras versões) se você "desfazer" manualmente todas as tabelas em um conjunto de ib-file. Você pode, então, confiar na verificação do formato de arquivo na inicialização se você usar posteriormente uma versão mais antiga do InnoDB para acessar o conjunto de ib-file.

Em algumas circunstâncias limitadas, você pode querer iniciar o servidor e usar um conjunto de arquivos ib em um novo formato de arquivo que não é suportado pelo software que você está usando. Se você definir o parâmetro de configuração `innodb_file_format_check` para `OFF`, o InnoDB abre o banco de dados, mas emite esta mensagem de aviso no log de erro:

```sql
InnoDB: Warning: the system tablespace is in a
file format that this version doesn't support
```

Nota

Este é um cenário perigoso, pois permite que o processo de recuperação seja executado, possivelmente corromprendo seu banco de dados se a interrupção anterior foi uma saída inesperada ou "interrupção rápida". Você deve definir `innodb_file_format_check` para `OFF` apenas se tiver certeza de que a interrupção anterior foi feita com `innodb_fast_shutdown=0`, para que, essencialmente, não ocorra nenhum processo de recuperação.

O parâmetro `innodb_file_format_check` afeta apenas o que acontece quando uma base de dados é aberta, não posteriormente. Por outro lado, o parâmetro `innodb_file_format` (que permite um formato específico) determina apenas se uma nova tabela pode ser criada no formato habilitado ou não e não tem efeito sobre o fato de uma base de dados pode ser aberta ou

A tag de formato de arquivo é uma “marca de água alta”, e, como tal, é aumentada após o servidor ser iniciado, se uma tabela em um formato “superior” for criada ou se uma tabela existente for acessada para leitura ou escrita (assumindo que seu formato é suportado). Se acessar uma tabela existente em um formato superior ao formato que o software em execução suporta, a tag de espaço de tabela do sistema não é atualizada, mas o controle de compatibilidade em nível de tabela é aplicado (e um erro é emitido), conforme descrito na Seção 14.10.2.2, “Verificação de Compatibilidade Quando uma Tabela é Aberta”. Toda vez que a marca de água alta é atualizada, o valor de `innodb_file_format_check` também é atualizado, de modo que o comando `SELECT @@innodb_file_format_check;` exibe o nome do último formato de arquivo conhecido que é usado por tabelas no conjunto de arquivos ib atualmente abertos e que é suportado pelo software que está sendo executado.

#### 14.10.2.2 Verificação de compatibilidade quando uma tabela é aberta

Quando uma tabela é acessada pela primeira vez, o InnoDB (incluindo algumas versões anteriores ao InnoDB 1.0) verifica se o formato de arquivo do espaço de tabela em que a tabela está armazenada é totalmente suportado. Esse controle previne falhas ou corrupções que, de outra forma, ocorreriam quando tabelas que utilizam uma estrutura de dados "demasiado nova" são encontradas.

Todas as tabelas que utilizam qualquer formato de arquivo suportado por uma versão podem ser lidas ou escritas (assumindo que o usuário tenha privilégios suficientes). A definição do parâmetro de configuração do sistema `innodb_file_format` pode impedir a criação de uma nova tabela que utilize um formato de arquivo específico, mesmo que o formato de arquivo seja suportado por uma determinada versão. Tal configuração pode ser usada para preservar a compatibilidade reversa, mas não impede o acesso a qualquer tabela que utilize um formato suportado.

Versões do MySQL mais antigas que 5.0.21 não podem usar confiavelmente arquivos de banco de dados criados por versões mais recentes se um novo formato de arquivo foi usado quando uma tabela foi criada. Para evitar várias condições de erro ou corrupções, o InnoDB verifica a compatibilidade do formato de arquivo quando abre um arquivo (por exemplo, ao primeiro acesso a uma tabela). Se a versão atualmente em execução do InnoDB não suporte o formato de arquivo identificado pelo tipo de tabela no dicionário de dados do InnoDB, o MySQL relata o seguinte erro:

```sql
ERROR 1146 (42S02): Table 'test.t1' doesn't exist
```

O InnoDB também escreve uma mensagem no log de erro:

```sql
InnoDB: table test/t1: unknown table type 33
```

O tipo de tabela deve ser igual às bandeiras do espaço de tabelas, que contém a versão do formato de arquivo conforme discutido na Seção 14.10.3, “Identificando o Formato de Arquivo em Uso”.

As versões do InnoDB anteriores ao MySQL 4.1 não incluíam identificadores de formato de tabela nos arquivos do banco de dados, e as versões anteriores ao MySQL 5.0.21 não incluíam uma verificação de compatibilidade de formato de tabela. Portanto, não é possível garantir operações adequadas se uma tabela em um formato de arquivo mais recente for usada com versões do InnoDB anteriores a 5.0.21.

A capacidade de gerenciamento de formato de arquivo no InnoDB 1.0 e versões posteriores (marcação de espaço de tabela e verificações de tempo de execução) permite que o InnoDB verifique o mais rapidamente possível se a versão em execução do software pode processar adequadamente as tabelas existentes no banco de dados.

Se você permitir que o InnoDB abra um banco de dados contendo arquivos em um formato que ele não suporta (definindo o parâmetro `innodb_file_format_check` para `OFF`), o controle de nível de tabela descrito nesta seção ainda se aplica.

Os usuários são **fortemente** incentivados a não usar arquivos de banco de dados que contenham tabelas do formato de arquivo Barracuda com versões do InnoDB mais antigas do que o MySQL 5.1 com o Plugin InnoDB. É possível reconstruir essas tabelas para usar o formato Antelope.

### 14.10.3 Identificando o formato de arquivo em uso

Se você ativar um formato de arquivo diferente usando a opção de configuração `innodb_file_format`, a mudança só se aplica a tabelas recém-criadas. Além disso, quando você cria uma nova tabela, o espaço de tabelas que contém a tabela é marcado com o formato de arquivo “mais antigo” ou “mais simples” que é necessário para suportar as características da tabela. Por exemplo, se você ativar o formato de arquivo `Barracuda`, e criar uma nova tabela que não use o formato de linha Dinâmico ou Compressa, o novo espaço de tabelas que contém a tabela é marcado como usando o formato de arquivo `Antelope`.

É fácil identificar o formato de arquivo utilizado por uma tabela específica. A tabela utiliza o formato de arquivo `Antelope` se o formato de linha relatado por `SHOW TABLE STATUS` for `Compact` ou `Redundant`. A tabela utiliza o formato de arquivo `Barracuda` se o formato de linha relatado por `SHOW TABLE STATUS` for `Compressed` ou `Dynamic`.

```sql
mysql> SHOW TABLE STATUS\G
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Compact
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 16384
      Data_free: 0
 Auto_increment: 1
    Create_time: 2014-11-03 13:32:10
    Update_time: NULL
     Check_time: NULL
      Collation: latin1_swedish_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Você também pode identificar o formato de arquivo usado por uma tabela ou espaço de tabela específico usando as tabelas `InnoDB` `INFORMATION_SCHEMA`. Por exemplo:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1'\G
*************************** 1. row ***************************
     TABLE_ID: 44
         NAME: test/t1
         FLAG: 1
       N_COLS: 6
        SPACE: 30
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='test/t1'\G
*************************** 1. row ***************************
        SPACE: 30
         NAME: test/t1
         FLAG: 0
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact or Redundant
    PAGE_SIZE: 16384
ZIP_PAGE_SIZE: 0
```

### 14.10.4 Modificando o formato do arquivo

Cada arquivo de espaço de tabela InnoDB (com um nome que corresponde a `*.ibd`) é marcado com o formato de arquivo usado para criar sua tabela e índices. A maneira de modificar o formato de arquivo é recriar a tabela e seus índices. A maneira mais fácil de recriar uma tabela e seus índices é usar o seguinte comando em cada tabela que você deseja modificar:

```sql
ALTER TABLE t ROW_FORMAT=format_name;
```

Se você estiver modificando o formato do arquivo para uma versão mais antiga do MySQL, pode haver incompatibilidades nos formatos de armazenamento de tabela que exigem etapas adicionais. Para obter informações sobre a desvantagem para uma versão anterior do MySQL, consulte a Seção 2.11, “Desvantagem do MySQL”.