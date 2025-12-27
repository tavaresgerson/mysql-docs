# Glossário do MySQL

Esses termos são comumente usados em informações sobre o servidor de banco de dados MySQL.

### A

.ARM arquivo:   Metadados para as tabelas `ARCHIVE`. Contrasta com o **arquivo .ARZ**. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja também  arquivo .ARZ,  MySQL Enterprise Backup,  comando mysqlbackup.

.ARZ arquivo:   Dados para as tabelas `ARCHIVE`. Contrasta com o **arquivo .ARM**. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja também  arquivo .ARM,  MySQL Enterprise Backup,  comando mysqlbackup.

ACID:   Um acrônimo que significa atomicidade, consistência, isolamento e durabilidade. Essas propriedades são todas desejáveis em um sistema de banco de dados e estão todas intimamente ligadas à noção de **transação**. As características transacionais do `InnoDB` aderem aos princípios ACID.

    As transações são **unidades de trabalho** **atomizadas** que podem ser **comprometidas** ou **revertidas**. Quando uma transação faz múltiplas alterações no banco de dados, todas as alterações têm sucesso quando a transação é comprometida ou todas as alterações são desfeitas quando a transação é revertida.

    O banco de dados permanece em um estado consistente em todos os momentos — após cada comprometimento ou reversão, e enquanto as transações estão em andamento. Se dados relacionados estão sendo atualizados em várias tabelas, as consultas veem ou todos os valores antigos ou todos os novos valores, não uma mistura de valores antigos e novos.

    As transações são protegidas (isoladas) umas das outras enquanto estão em andamento; elas não podem interferir umas nas outras ou ver os dados não comprometidos das outras. Essa isolação é alcançada através do **mecanismo de bloqueio**. Usuários experientes podem ajustar o **nível de isolamento**, trocando menos proteção em favor de maior desempenho e **concorrência**, quando podem ter certeza de que as transações realmente não interferem umas nas outras.

Os resultados das transações são duráveis: uma vez que uma operação de commit tenha sucesso, as alterações feitas por essa transação ficam protegidas contra falhas de energia, falhas do sistema, condições de corrida ou outros perigos potenciais aos quais muitas aplicações que não são de banco de dados são vulneráveis. A durabilidade geralmente envolve a gravação no armazenamento em disco, com uma certa quantidade de redundância para proteger contra falhas de energia ou falhas de software durante operações de escrita. (No `InnoDB`, o **buffer de dupla escrita** auxilia na durabilidade.)

Veja também  atômico,  commit,  concorrência,  buffer de dupla escrita,  nível de isolamento,  bloqueio,  rollback,  transação.

varredura adaptativa:   Um algoritmo para tabelas `InnoDB` que suaviza o overhead de I/O introduzido pelos **pontos de verificação**. Em vez de **varrer** todas as **páginas** modificadas do **pool de buffer** para os **arquivos de dados** de uma vez, o MySQL varre periodicamente pequenos conjuntos de páginas modificadas. O algoritmo de varredura adaptativa estende esse processo estimulando a taxa ótima para realizar essas varreduras periódicas, com base na taxa de varredura e na velocidade com que a **informação de refazer** é gerada.

Veja também  pool de buffer,  ponto de verificação,  arquivos de dados,  varredura,  InnoDB,  página,  log de refazer.

índice de hash adaptável:   Uma otimização para tabelas `InnoDB` que pode acelerar as consultas usando os operadores `=` e `IN`, construindo um **índice de hash** na memória. O MySQL monitora as pesquisas de índice para tabelas `InnoDB` e, se as consultas pudessem se beneficiar de um índice de hash, ele constrói automaticamente um para as **páginas de índice** que são acessadas com frequência. Em certo sentido, o índice de hash adaptável configura o MySQL em tempo de execução para aproveitar a ampla memória principal, se aproximando da arquitetura de bancos de dados de memória principal. Essa funcionalidade é controlada pela opção de configuração  `innodb_adaptive_hash_index`. Como essa funcionalidade beneficia algumas cargas de trabalho e não outras, e a memória usada para o índice de hash é reservada no **pool de buffer**, você geralmente deve fazer benchmarks com essa funcionalidade habilitada e desabilitada.

O índice hash é sempre construído com base em um índice **B-tree** existente na tabela. O MySQL pode construir um índice hash em um prefixo de qualquer comprimento da chave definida para o B-tree, dependendo do padrão de buscas no índice. Um índice hash pode ser parcial; todo o índice B-tree não precisa ser armazenado na memória cache do pool de buffers.

Veja também  B-tree,  pool de buffers,  índice hash,  página,  índice secundário.

ADO.NET:   Um framework de mapeamento objeto-relacional (ORM) para aplicações construídas usando tecnologias .NET, como **ASP.NET**. Tais aplicações podem interagir com o MySQL através do componente **Connector/NET**.

Veja também  .NET,  ASP.net,  Connector/NET,  Mono,  Visual Studio.

AIO:   Abreviação de **I/O assíncrono**. Você pode ver essa abreviação em mensagens ou palavras-chave do `InnoDB`.

Veja também  I/O assíncrono.

ANSI:   No **ODBC**, um método alternativo de suporte a conjuntos de caracteres e outros aspectos de internacionalização. Contrasta com **Unicode**. O **Connector/ODBC** 3.51 é um driver ANSI, enquanto o Connector/ODBC 5.1 é um driver Unicode.

Veja também  Connector/ODBC,  ODBC,  Unicode.

API:   As APIs fornecem acesso de nível baixo ao protocolo MySQL e aos recursos MySQL a partir de programas **cliente**. Contrasta com o acesso de nível superior fornecido por um **Connector**.

Veja também  C API,  cliente,  conector,  API nativa em C,  API em Perl,  API em PHP,  API em Python,  API em Ruby.

interface de programação de aplicativos (API):   Um conjunto de funções ou procedimentos. Uma API fornece um conjunto estável de nomes e tipos para funções, procedimentos, parâmetros e valores de retorno.

aplicar:   Quando um backup produzido pelo produto **MySQL Enterprise Backup** não inclui as alterações mais recentes que ocorreram enquanto o backup estava em andamento, o processo de atualização dos arquivos do backup para incluir essas alterações é conhecido como a etapa de **aplicação**. É especificado pela opção `apply-log` do comando `mysqlbackup`.

Antes que as alterações sejam aplicadas, referimo-nos aos arquivos como um **backup bruto**. Após as alterações serem aplicadas, referimo-nos aos arquivos como um **backup preparado**. As alterações são registradas no arquivo **ibbackup\_logfile**. Uma vez que a etapa de aplicação for concluída, este arquivo deixa de ser necessário.

Veja também  backup quente,  ibbackup\_logfile,  MySQL Enterprise Backup,  backup preparado,  backup bruto.

AS :   O servidor de autenticação Kerberos. AS também pode se referir ao serviço de autenticação fornecido por um servidor de autenticação.

    Veja também  servidor de autenticação.

ASP.net :   Um framework para o desenvolvimento de aplicações baseadas na web usando tecnologias e linguagens **.NET**. Tais aplicações podem interagir com o MySQL através do componente **Connector/NET**.

    Outra tecnologia para escrever páginas da web no lado do servidor com MySQL é o **PHP**.

    Veja também  .NET,  ADO.NET,  Connector/NET,  Mono,  PHP,  Visual Studio.

assembly :   Uma biblioteca de código compilado em um sistema **.NET**, acessada através do **Connector/NET**. Armazenada no **GAC** para permitir a versionamento sem conflitos de nomeação.

    Veja também  .NET,  GAC.

I/O assíncrono :   Um tipo de operação de I/O que permite que outros processos prossigam antes que o I/O seja concluído. Também conhecido como **I/O não bloqueante** e abreviado como **AIO**. O `InnoDB` usa esse tipo de I/O para certas operações que podem ser executadas em paralelo sem afetar a confiabilidade do banco de dados, como ler páginas no **buffer pool** que não foram realmente solicitadas, mas podem ser necessárias em breve.

    Historicamente, o `InnoDB` usava I/O assíncrono apenas em sistemas Windows. A partir do Plugin InnoDB 1.1 e do MySQL 5.5, o `InnoDB` usa I/O assíncrono em sistemas Linux. Essa mudança introduz uma dependência do `libaio`. O I/O assíncrono em sistemas Linux é configurado usando a opção  `innodb_use_native_aio`, que está habilitada por padrão. Em outros sistemas Unix-like, o `InnoDB` usa apenas I/O síncrono.

    Veja também  buffer pool,  I/O não bloqueante.

atômico:   No contexto do SQL, as **transações** são unidades de trabalho que ou têm sucesso totalmente (quando **comprometidas**) ou não têm efeito algum (quando **revertidas**). A propriedade indivisível ("atômica") das transações é o “A” no acrônimo **ACID**.

    Veja também  ACID,  comprometer,  reverter,  transação.

atomic DDL:   Uma instrução DDL **atômica** é aquela que combina as atualizações do **dicionário de dados**, as operações do **motor de armazenamento** e os escritos no **log binário** associados a uma operação DDL em uma única transação atômica. A transação é totalmente comprometida ou revertida, mesmo que o servidor pare durante a operação. O suporte a DDL atômico foi adicionado no MySQL 8.0. Para mais informações, consulte  Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômica”.

    Veja também  log binário,  dicionário de dados,  DDL,  motor de armazenamento.

instrução atômica:   Instruções especiais fornecidas pela CPU para garantir que operações críticas de nível baixo não possam ser interrompidas.

servidor de autenticação:   No Kerberos, um serviço que fornece o ticket inicial necessário para obter um ticket de concessão de ticket (TGT) que é necessário para obter outros tickets do servidor de concessão de ticket (TGS). O servidor de autenticação (AS) combinado com um TGS formam um centro de distribuição de chaves (KDC).

    Veja também  centro de distribuição de chaves,  servidor de concessão de ticket.

auto-incremento:   Uma propriedade de uma coluna de tabela (especificada pela palavra-chave `AUTO_INCREMENT`) que adiciona automaticamente uma sequência crescente de valores na coluna.

    Isso economiza trabalho para o desenvolvedor, evitando a necessidade de gerar novos valores únicos ao inserir novas linhas. Isso fornece informações úteis para o otimizador de consultas, porque a coluna é conhecida por não ser nula e ter valores únicos. Os valores de uma coluna desse tipo podem ser usados como chaves de busca em vários contextos, e, como são gerados automaticamente, não há motivo para alterá-los; por essa razão, colunas de chave primária são frequentemente especificadas como de auto-incremento.

As colunas de autoincremento podem ser problemáticas com a replicação baseada em declarações, pois a reprodução das declarações em uma replica pode não produzir o mesmo conjunto de valores de colunas que na fonte, devido a problemas de sincronização. Quando você tem uma chave primária de autoincremento, você pode usar a replicação baseada em declarações apenas com a configuração  `innodb_autoinc_lock_mode=1`. Se você tiver  `innodb_autoinc_lock_mode=2`, que permite maior concorrência para operações de inserção, use **replicação baseada em linhas** em vez de **replicação baseada em declarações**. A configuração  `innodb_autoinc_lock_mode=0` não deve ser usada, exceto para fins de compatibilidade.

O modo de bloqueio consecutivo ( `innodb_autoinc_lock_mode=1`) é a configuração padrão antes do MySQL 8.0.3. A partir do MySQL 8.0.3, o modo de bloqueio intercalado ( `innodb_autoinc_lock_mode=2`) é a configuração padrão, o que reflete a mudança da replicação baseada em declarações para replicação baseada em linhas como o tipo de replicação padrão.

Veja também  bloqueio de autoincremento,  innodb\_autoinc\_lock\_mode,  chave primária,  replicação baseada em linhas,  replicação baseada em declarações.

bloqueio de autoincremento :   A conveniência de uma **chave primária de autoincremento** envolve algum compromisso com a concorrência. No caso mais simples, se uma transação está inserindo valores na tabela, qualquer outra transação deve esperar para fazer suas próprias inserções naquela tabela, para que as linhas inseridas pela primeira transação recebam valores consecutivos da chave primária. O  `InnoDB` inclui otimizações e a opção  `innodb_autoinc_lock_mode` para que você possa configurar um equilíbrio ótimo entre sequências previsíveis de valores de autoincremento e **concorrência** máxima para operações de inserção.

Veja também  autoincremento,  concorrência,  innodb\_autoinc\_lock\_mode.

autocommit:   Uma configuração que realiza uma operação de **commit** após cada **SQL** (instrução SQL). Esse modo não é recomendado para trabalhar com tabelas `InnoDB` com **transações** que abrangem várias instruções. Ele pode ajudar no desempenho de **transações de leitura apenas** em tabelas `InnoDB`, minimizando o overhead do **bloqueio** e a geração de dados de **undo**, especialmente no MySQL 5.6.4 e versões posteriores. Também é apropriado para trabalhar com tabelas `MyISAM`, onde as transações não são aplicáveis.

Veja também  commit,  bloqueio,  transação de leitura apenas,  SQL,  transação,  undo.

disponibilidade:   A capacidade de lidar com e, se necessário, recuperar de falhas no host, incluindo falhas do MySQL, do sistema operacional ou do hardware e atividades de manutenção que possam causar tempo de inatividade. Muitas vezes associada à **escalabilidade** como aspectos críticos de uma implantação em larga escala.

Veja também  escalabilidade.

MySQL Enterprise Backup:   Um produto licenciado que realiza **backups quentes** de bancos de dados MySQL. Ele oferece a maior eficiência e flexibilidade ao fazer backups de tabelas `InnoDB`, mas também pode fazer backups de tabelas `MyISAM` e outros tipos de tabelas.

Veja também  backup quente,  InnoDB.

### B

B-tree:   Uma estrutura de dados em forma de árvore que é popular para uso em índices de banco de dados. A estrutura é mantida ordenada em todos os momentos, permitindo uma busca rápida por correspondências exatas (operador igual) e faixas (por exemplo, maior que, menor que e operadores `BETWEEN`). Esse tipo de índice está disponível para a maioria dos motores de armazenamento, como `InnoDB` e `MyISAM`.

Como os nós da B-tree podem ter muitos filhos, uma B-tree não é a mesma coisa que uma árvore binária, que é limitada a 2 filhos por nó.

Compare com o **índice de hash**, que está disponível apenas no motor de armazenamento  `MEMORY`. O motor de armazenamento  `MEMORY` também pode usar índices B-tree, e você deve escolher índices B-tree para tabelas `MEMORY` se algumas consultas usarem operadores de intervalo.

O uso do termo B-tree é uma referência à classe geral de design de índices. As estruturas B-tree usadas pelos mecanismos de armazenamento do MySQL podem ser consideradas variantes devido a sofisticações que não estão presentes em um design B-tree clássico. Para informações relacionadas, consulte a seção `Estrutura de Página do `InnoDB` Fil Header` do Manual Interno do MySQL.

Veja também índice de hash.

backticks:   Os identificadores dentro das instruções SQL do MySQL devem ser citados usando o caractere backtick (` `` `) se contiverem caracteres especiais ou palavras reservadas. Por exemplo, para referir-se a uma tabela chamada `FOO#BAR` ou a uma coluna chamada `SELECT`, você especificaria os identificadores como `` `FOO#BAR` `` e `` `SELECT` ``. Como os backticks fornecem um nível extra de segurança, eles são amplamente usados em instruções SQL geradas por programas, onde os nomes dos identificadores podem não ser conhecidos antecipadamente.

Muitos outros sistemas de banco de dados usam aspas duplas (`"`) ao redor de tais nomes especiais. Para a portabilidade, você pode habilitar o modo `ANSI_QUOTES` no MySQL e usar aspas duplas em vez de backticks para qualificar os nomes dos identificadores.

Veja também SQL.

backup:   O processo de copiar alguns ou todos os dados e metadados de uma instância do MySQL, para conservação. Também pode se referir ao conjunto de arquivos copiados. Esta é uma tarefa crucial para os DBA. O oposto desse processo é a operação de **restauração**.

Com o MySQL, os **backups físicos** são realizados pelo produto **MySQL Enterprise Backup**, e os **backups lógicos** são realizados pelo comando `mysqldump`. Essas técnicas têm características diferentes em termos de tamanho e representação dos dados do backup, e velocidade (especialmente a velocidade da operação de restauração).

Os backups são classificados ainda mais como **quentes**, **quentes** ou **frios**, dependendo de quão interferem na operação normal do banco de dados. (Os backups quentes têm a menor interferência, os backups frios a maior.)

Veja também  backup frio,  backup quente,  backup lógico,  MySQL Enterprise Backup,  mysqldump,  backup físico,  backup quente.

coluna base :   Uma coluna da tabela que não foi gerada e que serve de base para uma coluna gerada ou coluna gerada virtual. Em outras palavras, uma coluna base é uma coluna da tabela que não foi gerada e que faz parte da definição de uma coluna gerada.

    Veja também  coluna gerada,  coluna gerada armazenada,  coluna gerada virtual.

beta :   Uma fase inicial na vida de um produto de software, quando ele está disponível apenas para avaliação, tipicamente sem um número de lançamento definido ou um número menor que 1. O `InnoDB` não usa a designação beta, preferindo uma fase de **adotante inicial** que pode se estender por várias versões pontualmente, levando a uma versão **GA**.

    Veja também  adotante inicial,  GA.

log binário :   Um arquivo que contém um registro de todas as instruções ou alterações de linha que tentam alterar os dados da tabela. O conteúdo do log binário pode ser reexaminado para atualizar as réplicas em um cenário de **replicação** ou para atualizar um banco de dados após restaurar os dados da tabela a partir de um backup. A funcionalidade de log binário pode ser ativada ou desativada, embora a Oracle recommende sempre ativá-la se você usar a replicação ou realizar backups.

    Você pode examinar o conteúdo do log binário ou reexaminá-lo durante a replicação ou recuperação, usando o comando   `mysqlbinlog`. Para obter informações completas sobre o log binário, consulte  Seção 7.4.4, “O Log Binário”. Para opções de configuração do MySQL relacionadas ao log binário, consulte  Seção 19.1.6.4, “Opções e variáveis de log binário”.

    Para o produto **MySQL Enterprise Backup**, o nome do arquivo do log binário e a posição atual dentro do arquivo são detalhes importantes. Para registrar essa informação da fonte ao fazer um backup em um contexto de replicação, você pode especificar a opção `--slave-info`.

Antes do MySQL 5.0, uma funcionalidade semelhante estava disponível, conhecida como log de atualização. No MySQL 5.0 e versões posteriores, o log binário substitui o log de atualização.

Veja também  binlog,  MySQL Enterprise Backup,  replicação.

binlog :   Um nome informal para o **arquivo de log binário**. Por exemplo, você pode ver essa abreviação sendo usada em mensagens de e-mail ou discussões em fóruns.

Veja também  log binário.

expansão de consultas cegas :   Um modo especial de **pesquisa de texto completo** habilitado pela cláusula `WITH QUERY EXPANSION`. Ele realiza a pesquisa duas vezes, onde a frase de pesquisa para a segunda pesquisa é a frase de pesquisa original concatenada com os poucos documentos mais relevantes dos primeiros resultados. Essa técnica é principalmente aplicável para frases de pesquisa curtas, talvez apenas uma palavra. Ela pode descobrir correspondências relevantes onde o termo de pesquisa preciso não ocorre no documento.

Veja também  pesquisa de texto completo.

BLOB :   Um tipo de dado SQL (`TINYBLOB`,  `BLOB`,  `MEDIUMBLOB` e  `LONGBLOB`) para objetos que contêm qualquer tipo de dados binários, de tamanho arbitrário. Usado para armazenar documentos, imagens, arquivos de som e outros tipos de informações que não podem ser facilmente decompostos em linhas e colunas dentro de uma tabela MySQL. As técnicas para lidar com BLOBs dentro de uma aplicação MySQL variam com cada **conector** e **API**. O MySQL `Connector/ODBC` define valores `BLOB` como `LONGVARBINARY`. Para grandes coleções livres de formato de dados de caracteres, o termo da indústria é **CLOB**, representado pelos tipos de dados `TEXT` do MySQL.

Veja também  API,  CLOB,  conector,  Connector/ODBC.

bottleneck:   Uma parte de um sistema que está limitada em tamanho ou capacidade, o que tem o efeito de limitar o desempenho geral. Por exemplo, uma área de memória pode ser menor do que o necessário; o acesso a um único recurso necessário pode impedir que múltiplos núcleos da CPU funcionem simultaneamente; ou esperar que o I/O do disco seja concluído pode impedir que a CPU funcione na capacidade máxima. Remover os gargalos tende a melhorar a **concorrência**. Por exemplo, a capacidade de ter múltiplas instâncias do **pool de buffers** do `InnoDB` reduz a concorrência quando múltiplas sessões leem e escrevem no pool de buffers simultaneamente.

    Veja também  pool de buffers,  concorrência.

bounce:   Uma operação de **shutdown** seguida imediatamente por um reinício. Idealmente, com um período de **aquecimento** relativamente curto para que o desempenho e o desempenho rapidamente retornem a um alto nível.

    Veja também  shutdown.

allocador de amigos:   Um mecanismo para gerenciar **páginas** de diferentes tamanhos no **pool de buffers** do `InnoDB`.

    Veja também  pool de buffers,  página,  tamanho da página.

buffer:   Uma área de memória ou disco usada para armazenamento temporário. Os dados são armazenados em memória para que possam ser escritos no disco de forma eficiente, com poucas operações de I/O grandes em vez de muitas pequenas. Os dados são armazenados em disco para maior confiabilidade, para que possam ser recuperados mesmo quando ocorre um **crash** ou outra falha no momento mais inoportuno. Os principais tipos de buffers usados pelo `InnoDB` são o **pool de buffers**, o **buffer de escrita dupla** e o **buffer de alterações**.

    Veja também  pool de buffers,  buffer de escrita dupla,  crash,  buffer de alterações.

pool de buffers:   A área de memória que armazena os dados `InnoDB` cacheados para tabelas e índices. Para melhorar a eficiência das operações de leitura de alto volume, o pool de buffers é dividido em **páginas** que podem potencialmente armazenar múltiplas linhas. Para melhorar a eficiência da gestão do cache, o pool de buffers é implementado como uma lista encadeada de páginas; os dados que raramente são usados são eliminados do cache, usando uma variação do algoritmo **LRU** (Least Recently Used). Em sistemas com grande memória, você pode melhorar a concorrência dividindo o pool de buffers em múltiplas **instâncias do pool de buffers**.

    Várias variáveis de status do `InnoDB`, tabelas do `INFORMATION_SCHEMA` e tabelas do `performance_schema` ajudam a monitorar o funcionamento interno do pool de buffers. A partir do MySQL 5.6, você pode evitar um longo período de aquecimento após o reinício do servidor, especialmente para instâncias com grandes pools de buffers, salvando o estado do pool de buffers ao desligar o servidor e restaurando o pool de buffers ao mesmo estado ao iniciar o servidor. Veja  Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffers”.

    Veja também  instância do pool de buffers,  LRU,  página,  aquecimento.

incorporado:   O mecanismo de armazenamento `InnoDB` incorporado no MySQL é a forma original de distribuição para o mecanismo de armazenamento. Em contraste com o **Plugin InnoDB**. A partir do MySQL 5.5, o Plugin InnoDB é incorporado de volta à base de código do MySQL como o mecanismo de armazenamento `InnoDB` incorporado (conhecido como InnoDB 1.1).

Essa distinção é importante principalmente no MySQL 5.1, onde uma funcionalidade ou correção de bug pode se aplicar ao Plugin InnoDB, mas não ao `InnoDB` incorporado, ou vice-versa.

Veja também  InnoDB.

regras de negócios:   As relações e sequências de ações que formam a base do software comercial, usado para administrar uma empresa comercial. Às vezes, essas regras são ditadas por lei, outras vezes por políticas da empresa. Um planejamento cuidadoso garante que as relações codificadas e aplicadas pelo banco de dados, e as ações realizadas por meio da lógica da aplicação, reflitam com precisão as políticas reais da empresa e possam lidar com situações da vida real.

Por exemplo, um funcionário que deixa uma empresa pode desencadear uma sequência de ações do departamento de recursos humanos. O banco de dados de recursos humanos também pode precisar da flexibilidade para representar dados sobre uma pessoa que foi contratada, mas ainda não começou a trabalhar. Fechar uma conta em um serviço online pode resultar na remoção de dados de um banco de dados, ou os dados podem ser movidos ou marcados para que possam ser recuperados se a conta for reaberta. Uma empresa pode estabelecer políticas sobre máximos, mínimos e ajustes salariais, além de verificações básicas de integridade, como o salário não ser um número negativo. Um banco de dados de varejo pode não permitir que uma compra com o mesmo número de série seja devolvida mais de uma vez, ou pode não permitir compras com cartão de crédito acima de um certo valor, enquanto um banco de dados usado para detectar fraudes pode permitir esse tipo de coisa.

Veja também  relacional.

Arquivo .cfg:   Um arquivo de metadados usado com o recurso **espaço de tabela transponível** do **InnoDB**. Ele é gerado pelo comando `FLUSH TABLES ... FOR EXPORT`, coloca uma ou mais tabelas em um estado consistente que pode ser copiado para outro servidor. O arquivo `.cfg` é copiado junto com o arquivo `.ibd` correspondente e é usado para ajustar os valores internos do arquivo `.ibd`, como o **ID de espaço**, durante a etapa `ALTER TABLE ... IMPORT TABLESPACE`.

Veja também  arquivo .ibd,  ID de espaço,  espaço transponível.

C:   Uma linguagem de programação que combina portabilidade com desempenho e acesso a recursos de hardware de nível baixo, tornando-a uma escolha popular para escrever sistemas operacionais, drivers e outros tipos de software de sistema. Muitas aplicações complexas, linguagens e módulos reutilizáveis possuem partes escritas em C, unidas com componentes de alto nível escritos em outras linguagens. Sua sintaxe central é familiar para desenvolvedores de **C++**, **Java** e **C#**.

Veja também  API C,  C++,  C#,  Java.

API C:   O código **API C** é distribuído com o MySQL. Ele está incluído na biblioteca **libmysqlclient** e permite que programas em **C** acessem um banco de dados.

Veja também  API,  C,  libmysqlclient.

C#:   Uma linguagem de programação que combina tipificação forte e recursos orientada a objetos, executando dentro da estrutura **.NET** da Microsoft ou de sua contraparte de código aberto **Mono**. Muitas vezes usada para criar aplicações com a estrutura **ASP.net**. Sua sintaxe é familiar para desenvolvedores de **C**, **C++** e **Java**.

Veja também  .NET,  ASP.net,  C,  Connector/NET,  C++,  Java,  Mono.

C++:   Uma linguagem de programação com sintaxe central familiar para desenvolvedores de **C**. Fornece acesso a operações de nível baixo para desempenho, combinadas com tipos de dados de nível superior, recursos orientada a objetos e coleta de lixo. Para escrever aplicações em C++ para MySQL, você usa o componente **Connector/C++**.

Veja também  C,  Connector/C++.

cache:   O termo geral para qualquer área de memória que armazena cópias de dados para recuperação rápida ou de alta velocidade. No `InnoDB`, o tipo principal de estrutura de cache é o **pool de buffers**.

Veja também  buffer,  pool de buffers.

cardinalidade:   O número de valores diferentes em um **coluna** de uma tabela. Quando as consultas referem-se a colunas com um **índice** associado, a cardinalidade de cada coluna influencia o método de acesso mais eficiente. Por exemplo, para uma coluna com uma **restrição única**, o número de valores diferentes é igual ao número de linhas na tabela. Se uma tabela tiver um milhão de linhas, mas apenas 10 valores diferentes para uma coluna específica, cada valor ocorre (em média) 100.000 vezes. Uma consulta como `SELECT c1 FROM t1 WHERE c1 = 50;` pode, portanto, retornar 1 linha ou um número enorme de linhas, e o servidor de banco de dados pode processar a consulta de maneira diferente, dependendo da cardinalidade de `c1`.

    Se os valores em uma coluna tiverem uma distribuição muito irregular, a cardinalidade pode não ser uma boa maneira de determinar o melhor plano de consulta. Por exemplo, `SELECT c1 FROM t1 WHERE c1 = x;` pode retornar 1 linha quando `x=50` e um milhão de linhas quando `x=30`. Nesse caso, você pode precisar usar **dicas de índice** para passar informações sobre qual método de busca é mais eficiente para uma consulta específica.

    A cardinalidade também pode se aplicar ao número de valores distintos presentes em múltiplas colunas, como em um **índice composto**.

    Veja também  coluna,  índice composto,  índice,  dica de índice,  estatísticas persistentes,  dive aleatório,  seletividade,  restrição única.

change buffer:   Uma estrutura de dados especial que registra alterações em **páginas** em **índices secundários**. Esses valores podem resultar de instruções SQL  `INSERT`,  `UPDATE` ou  `DELETE` (**DML**). O conjunto de recursos envolvendo o buffer de mudanças é conhecido coletivamente como **buffering de mudanças**, consistindo em **buffering de inserção**, **buffering de exclusão** e **buffering de purga**.

As alterações são registradas apenas no buffer de alterações quando a página relevante do índice secundário não está no **pool de buffer**. Quando a página relevante do índice é trazida para o pool de buffer enquanto as alterações associadas ainda estão no buffer de alterações, as alterações para essa página são aplicadas no pool de buffer (**fusão**) usando os dados do buffer de alterações. Periodicamente, a operação de **purga** que é executada durante os momentos em que o sistema está quase parado ou durante uma desligamento lento, escreve as novas páginas do índice no disco. A operação de purga pode escrever os blocos de disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse escrito no disco imediatamente.

Fisicamente, o buffer de alterações faz parte do **espaço de tabelas do sistema**, para que as alterações do índice permaneçam em buffer após reinicializações do banco de dados. As alterações são aplicadas (**fusão**) apenas quando as páginas são trazidas para o pool de buffer devido a alguma outra operação de leitura.

Os tipos e a quantidade de dados armazenados no buffer de alterações são regidos pelas opções de configuração  `innodb_change_buffering` e  `innodb_change_buffer_max_size`. Para ver informações sobre os dados atuais no buffer de alterações, execute o comando  `SHOW ENGINE INNODB STATUS`.

Anteriormente conhecido como **buffer de inserção**.

Veja também  pool de buffer,  bufferização de alterações,  bufferização de exclusão,  DML,  buffer de inserção,  bufferização de inserção,  fusão,  página,  purga,  bufferização de purga,  índice secundário,  espaço de tabelas do sistema.

alterar bufferização:   O termo geral para as funcionalidades que envolvem o **buffer de alteração**, composto por **bufferização de inserção**, **bufferização de exclusão** e **bufferização de purga**. As alterações de índice resultantes de instruções SQL, que normalmente poderiam envolver operações aleatórias de E/S, são remanescentes e realizadas periodicamente por um **thread** de segundo plano. Essa sequência de operações pode gravar os blocos de disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse gravado no disco imediatamente. Controlado pelas opções de configuração  `innodb_change_buffering` e  `innodb_change_buffer_max_size`.

    Veja também  bufferização,  bufferização de exclusão,  bufferização de inserção,  bufferização de purga.

ponto de verificação:   Quando as alterações são feitas em páginas de dados que estão armazenadas no **pool de buffer**, essas alterações são escritas nos **arquivos de dados** em algum momento mais tarde, um processo conhecido como **flushing**. O ponto de verificação é um registro das últimas alterações (representado por um valor **LSN**) que foram escritas com sucesso nos arquivos de dados.

    Veja também  pool de buffer,  arquivos de dados,  flush,  verificação fuzzy de ponto de verificação,  LSN.

checksum:   No `InnoDB`, um mecanismo de validação para detectar corrupção quando uma **página** em um **tablespace** é lida do disco para o **pool de buffer** do `InnoDB`. Esta funcionalidade é controlada pela opção de configuração `innodb_checksums` no MySQL 5.5. `innodb_checksums` é desatualizada no MySQL 5.6.3, substituída por  `innodb_checksum_algorithm`.

    O comando `innochecksum` ajuda a diagnosticar problemas de corrupção testando os valores de checksum para um arquivo de **tablespace** especificado enquanto o servidor MySQL está desligado.

    O MySQL também usa checksums para fins de replicação. Para detalhes, consulte as opções de configuração  `binlog_checksum`,  `source_verify_checksum` ou  `master_verify_checksum`, e  `replica_sql_verify_checksum` ou  `slave_sql_verify_checksum`.

    Veja também  pool de buffer,  página,  tablespace.

tabela de cliente:   Em uma relação de **chave estrangeira**, uma tabela de cliente é aquela cujas linhas referenciam (ou apontam) para linhas de outra tabela com um valor idêntico para uma coluna específica. Esta é a tabela que contém a cláusula `FOREIGN KEY ... REFERENCES` e, opcionalmente, as cláusulas `ON UPDATE` e `ON DELETE`. A linha correspondente na **tabela pai** deve existir antes que a linha possa ser criada na tabela de cliente. Os valores na tabela de cliente podem impedir operações de exclusão ou atualização na tabela pai ou podem causar exclusão ou atualização automática na tabela de cliente, com base na opção `ON CASCADE` usada ao criar a chave estrangeira.

Veja também  chave estrangeira,  tabela pai.

página limpa:   Uma **página** no **pool de buffer** do `InnoDB` onde todas as alterações feitas na memória também foram escritas (**flushadas**) nos arquivos de dados. O oposto de uma **página suja**.

Veja também  pool de buffer,  arquivos de dados,  página suja,  flush,  página.

parada limpa:   Uma **parada** que completa sem erros e aplica todas as alterações nas tabelas do `InnoDB` antes de terminar, ao contrário de uma **falha** ou uma **parada rápida**. Sinônimo de **parada lenta**.

Veja também  falha,  parada rápida,  parada,  parada lenta.

cliente:   Um programa que funciona fora do servidor de banco de dados, comunicando-se com o banco de dados enviando solicitações através de um **conector** ou uma **API** disponibilizada por meio de **bibliotecas de cliente**. Ele pode ser executado na mesma máquina física do servidor de banco de dados ou em uma máquina remota conectada via rede. Pode ser um aplicativo de banco de dados de propósito especial ou um programa de propósito geral, como o processador de linha de comando `mysql`.

Veja também  API,  bibliotecas de cliente,  conector,  mysql,  servidor.

bibliotecas de cliente:   Arquivos que contêm coleções de funções para trabalhar com bancos de dados. Ao compilar seu programa com essas bibliotecas ou instalá-las no mesmo sistema que sua aplicação, você pode executar uma aplicação de banco de dados (conhecida como **cliente**) em uma máquina que não tenha o servidor MySQL instalado; a aplicação acessa o banco de dados via rede. Com o MySQL, você pode usar a biblioteca **libmysqlclient** do próprio servidor MySQL.

    Veja também  cliente,  libmysqlclient.

declaração preparada do lado do cliente:   Um tipo de **declaração preparada** onde o cache e a reutilização são gerenciados localmente, emulando a funcionalidade das **declarações preparadas do lado do servidor**. Historicamente, usado por alguns desenvolvedores de **Connector/J**, **Connector/ODBC** e **Connector/PHP** para resolver problemas com procedimentos armazenados do lado do servidor. Com versões modernas do servidor MySQL, as declarações preparadas do lado do servidor são recomendadas para desempenho, escalabilidade e eficiência de memória.

    Veja também  Connector/J,  Connector/ODBC,  Connector/PHP,  declaração preparada.

CLOB:   Um tipo de dado SQL (`TINYTEXT`, `TEXT`, `MEDIUMTEXT` ou `LONGTEXT`) para objetos que contêm qualquer tipo de dados de caracteres, de tamanho arbitrário. Usado para armazenar documentos baseados em texto, com conjunto de caracteres e ordem de ordenação associados. As técnicas para lidar com CLOBs dentro de uma aplicação MySQL variam com cada **Connector** e **API**. O MySQL Connector/ODBC define valores `TEXT` como `LONGVARCHAR`. Para armazenar dados binários, o equivalente é o tipo **BLOB**.

    Veja também  API,  BLOB,  connector,  Connector/ODBC.

índice agrupado:   O termo `InnoDB` para um índice de **chave primária**. O armazenamento de tabelas `InnoDB` é organizado com base nos valores das colunas da chave primária, para acelerar consultas e ordenamentos envolvendo as colunas da chave primária. Para obter o melhor desempenho, escolha as colunas da chave primária com cuidado, com base nas consultas mais críticas em termos de desempenho. Como modificar as colunas do índice agrupado é uma operação cara, escolha colunas que sejam raramente ou nunca atualizadas.

    No produto Oracle Database, esse tipo de tabela é conhecido como **tabela organizada por índice**.

    Veja também  índice,  chave primária,  índice secundário.

backup frio:   Um **backup** feito enquanto o banco de dados está desligado. Para aplicações e sites movimentados, isso pode não ser prático, e você pode preferir um **backup quente** ou um **backup quente**.

    Veja também  backup,  backup quente,  backup quente.

coluna:   Um item de dados dentro de uma **linha**, cujo armazenamento e semântica são definidos por um tipo de dado. Cada **tabela** e **índice** são em grande parte definidos pelo conjunto de colunas que contêm.

    Cada coluna tem um valor de **cardinalidade**. Uma coluna pode ser a **chave primária** de sua tabela, ou parte da chave primária. Uma coluna pode estar sujeita a uma **restrição única**, uma **restrição NOT NULL**, ou ambas. Valores em diferentes colunas, mesmo em tabelas diferentes, podem ser vinculados por uma relação de **chave estrangeira**.

    Em discussões sobre operações internas do MySQL, às vezes **campo** é usado como sinônimo.

    Veja também  cardinalidade,  chave estrangeira,  índice,  restrição NOT NULL,  chave primária,  linha,  tabela,  restrição única.

índice de coluna:   Um **índice** em uma única coluna.

    Veja também  índice composto,  índice.

prefixo da coluna:   Quando um **índice** é criado com uma especificação de comprimento, como `CREATE INDEX idx ON t1 (c1(N))`, apenas os primeiros N caracteres do valor da coluna são armazenados no índice. Manter o prefixo do índice pequeno torna o índice compacto, e as economias de memória e I/O de disco ajudam no desempenho. (Embora fazer o prefixo do índice muito pequeno possa prejudicar a otimização de consultas, fazendo com que linhas com valores diferentes pareçam duplicatas para o otimizador de consultas.)

    Para colunas que contêm valores binários ou strings de texto longo, onde a classificação não é uma consideração importante e armazenar todo o valor no índice desperdiçaria espaço, o índice usa automaticamente os primeiros N (tipicamente 768) caracteres do valor para fazer buscas e classificações.

    Veja também  índice.

interceptador de comando:   Sinônimo de **interceptador de declaração**. Um aspecto do padrão de design **interceptador** disponível tanto para **Connector/NET** quanto para **Connector/J**. O que o Connector/NET chama de comando, o Connector/J chama de declaração. Em contraste com o **interceptador de exceção**.

    Veja também  Connector/J,  Connector/NET,  interceptador de exceção,  interceptador,  interceptador de declaração.

commit:   Uma **declaração SQL** que termina uma **transação**, tornando permanentes quaisquer alterações feitas pela transação. É o oposto de **rollback**, que desfaz quaisquer alterações feitas na transação.

`InnoDB` usa um mecanismo **opositor** para commits, para que as alterações possam ser escritas nos arquivos de dados antes que o commit ocorra realmente. Essa técnica torna o commit em si mais rápido, com o contrapeso de que mais trabalho é necessário em caso de um rollback.

Por padrão, o MySQL usa o **configuração autocommit**, que emite automaticamente um commit após cada declaração SQL.

    Veja também  autocommit,  opositor,  rollback,  SQL,  transação.

formato de linha compacto:   Um **formato de linha** para tabelas InnoDB. Foi o formato de linha padrão do MySQL 5.0.3 ao MySQL 5.7.8. Em MySQL 8.0, o formato de linha padrão é definido pela opção de configuração `innodb_default_row_format`, que tem um ajuste padrão de **DINÂMICO**. O **formato de linha COMPACT** oferece uma representação mais compacta para colunas nulos e de comprimento variável do que o **formato de linha REDUNDANTE**.

Para informações adicionais sobre o **formato de linha COMPACT** de **InnoDB**, consulte a Seção 17.10, “Formatos de Linha InnoDB”.

Veja também  formato de linha dinâmico,  formato de arquivo,  formato de linha redundante,  formato de linha.

índice composto:   Um **índice** que inclui múltiplas colunas.

Veja também  índice.

backup comprimido:   O recurso de compressão do produto **MySQL Enterprise Backup** faz uma cópia comprimida de cada espaço de tabelas, alterando a extensão de `.ibd` para `.ibz`. A compressão dos dados do backup permite que você mantenha mais backups à mão e reduz o tempo para transferir os backups para outro servidor. Os dados são descompactados durante a operação de restauração. Quando uma operação de backup comprimido processa uma tabela que já está comprimida, ela ignora o passo de compressão para aquela tabela, porque comprimir novamente resultaria em pouca ou nenhuma economia de espaço.

Um conjunto de arquivos produzidos pelo produto **MySQL Enterprise Backup**, onde cada **espaço de tabelas** é comprimido. Os arquivos comprimidos são renomeados com a extensão de arquivo `.ibz`.

Aplicar **compressão** no início do processo de backup ajuda a evitar o overhead de armazenamento durante o processo de compressão e a evitar o overhead de rede ao transferir os arquivos de backup para outro servidor. O processo de **aplicação** do **log binário** leva mais tempo e requer a descompactação dos arquivos de backup.

Veja também  aplicar,  log binário,  compressão,  backup quente,  MySQL Enterprise Backup,  espaço de tabelas.

formato de linha compactado:   Um **formato de linha** que permite a **compactação** de dados e índices para tabelas `InnoDB`. Campos grandes são armazenados longe da página que contém o restante dos dados da linha, como no **formato de linha dinâmico**. Tanto as páginas de índice quanto os campos grandes são compactados, resultando em economia de memória e disco. Dependendo da estrutura dos dados, a redução no uso de memória e disco pode ou não superar o overhead de desempenho da descompactação dos dados conforme eles são usados. Consulte  Seção 17.9, “Compactação de Tabelas e Páginas de `InnoDB” para detalhes de uso.

    Para informações adicionais sobre o formato de linha `COMPRESSED` de `InnoDB`, consulte  Formato de Linha Dinâmico.

    Veja também  compactação,  formato de linha dinâmico,  formato de linha.

compactação:   Uma funcionalidade com benefícios amplos, como usar menos espaço em disco, realizar menos I/O e usar menos memória para cache.

`InnoDB` suporta compactação em nível de tabela e em nível de página. A compactação de página de `InnoDB` também é referida como **compactação de página transparente**. Para mais informações sobre compactação de `InnoDB`, consulte  Seção 17.9, “Compactação de Tabelas e Páginas de `InnoDB”.

    Outro tipo de compactação é a **backup compactado** da **MySQL Enterprise Backup**.

    Veja também  buffer pool,  backup compactado,  formato de linha compactado,  DML,  compactação de página transparente.

falha de compressão:   Na verdade, não é um erro, mas sim uma operação cara que pode ocorrer ao usar a **compressão** em combinação com operações **DML**. Isso ocorre quando: as atualizações de uma **página** comprimida ultrapassam a área na página reservada para registrar as modificações; a página é comprimida novamente, com todas as alterações aplicadas aos dados da tabela; os dados recompressados não cabem na página original, exigindo que o MySQL divida os dados em duas novas páginas e comprima cada uma separadamente. Para verificar a frequência dessa condição, execute a consulta na tabela  `INFORMATION_SCHEMA.INNODB_CMP` e verifique quanto o valor da coluna `COMPRESS_OPS` excede o valor da coluna `COMPRESS_OPS_OK`. Idealmente, as falhas de compressão não ocorrem com frequência; quando ocorrem, você pode ajustar as opções de configuração  `innodb_compression_level`,  `innodb_compression_failure_threshold_pct` e  `innodb_compression_pad_pct_max`.

Veja também  compressão,  DML,  página.

índice concatenado:   Veja  índice composto.

concorrência:   A capacidade de múltiplas operações (na terminologia de banco de dados, **transações**) executarem simultaneamente, sem interferir uma na outra. A concorrência também está envolvida com o desempenho, porque idealmente, a proteção para múltiplas transações simultâneas funciona com um mínimo de sobrecarga de desempenho, usando mecanismos eficientes para **bloqueio**.

Veja também  ACID,  bloqueio,  transação.

arquivo de configuração:   O arquivo que contém os valores das **opções** usados pelo MySQL no início. Tradicionalmente, no Linux e Unix, esse arquivo é chamado `my.cnf`, e no Windows, é chamado `my.ini`. Você pode definir várias opções relacionadas ao InnoDB na seção  `[mysqld]` do arquivo.

Veja  Seção 6.2.2.2, “Usando Arquivos de Opção” para obter informações sobre onde o MySQL busca arquivos de configuração.

Ao usar o produto **MySQL Enterprise Backup**, você normalmente usa dois arquivos de configuração: um que especifica de onde os dados vêm e como estão estruturados (que pode ser o arquivo de configuração original do seu servidor) e um simplificado que contém apenas um pequeno conjunto de opções que especificam para onde os dados do backup vão e como estão estruturados. Os arquivos de configuração usados com o produto **MySQL Enterprise Backup** devem conter certas opções que normalmente não estão presentes nos arquivos de configuração regulares, então você pode precisar adicionar opções ao seu arquivo de configuração existente para uso com **MySQL Enterprise Backup**.

Veja também  my.cnf,  MySQL Enterprise Backup,  opção,  arquivo de opção.

conexão :   O canal de comunicação entre uma aplicação e um servidor MySQL. O desempenho e a escalabilidade de uma aplicação de banco de dados são influenciados por quão rapidamente uma conexão de banco de dados pode ser estabelecida, quantos podem ser feitos simultaneamente e por quanto tempo persistem. Os parâmetros como **host**, **port** e assim por diante são representados como uma **string de conexão** no **Connector/NET** e como um **DSN** no **Connector/ODBC**. Sistemas de alto tráfego utilizam uma otimização conhecida como **pool de conexões**.

Veja também  pool de conexões,  string de conexão,  Connector/NET,  Connector/ODBC,  DSN,  host,  port.

pool de conexões :   Uma área de cache que permite que as **conexões** do banco de dados sejam reutilizadas dentro da mesma aplicação ou entre diferentes aplicações, em vez de configurar e desativar uma nova conexão para cada operação de banco de dados. Essa técnica é comum com os servidores de aplicações **J2EE**. Aplicações **Java** que usam **Connector/J** podem usar as funcionalidades de pool de conexões do **Tomcat** e outros servidores de aplicações. A reutilização é transparente para as aplicações; a aplicação ainda abre e fecha a conexão como de costume.

Veja também  conexão,  Connector/J,  J2EE,  Tomcat.

string de conexão:   Uma representação dos parâmetros para uma **conexão** com um banco de dados, codificada como uma literal de string para que possa ser usada no código do programa. As partes da string representam parâmetros de conexão, como **host** e **port**. Uma string de conexão contém vários pares chave-valor, separados por vírgulas. Cada par chave-valor é unido com um sinal de igual. Frequentemente usado com aplicações **Connector/NET**: veja  Criando uma String de Conexão Connector/NET para detalhes.

Veja também  conexão,  Connector/NET,  host,  port.

conector:   Os Conectores MySQL fornecem conectividade ao servidor MySQL para programas **cliente**. Várias linguagens de programação e frameworks têm seus próprios Conectores associados. Em contraste com o acesso de nível mais baixo fornecido por uma **API**.

Veja também  API,  cliente,  Connector/C++,  Connector/J,  Connector/NET,  Connector/ODBC.

Connector/C++:   O Connector/C++ 8.0 pode ser usado para acessar servidores MySQL que implementam um  armazenamento de documentos, ou de maneira tradicional usando consultas SQL. Permite o desenvolvimento de aplicações em C++ usando X DevAPI, ou aplicações em C comuns usando X DevAPI para C. Também permite o desenvolvimento de aplicações em C++ que usam a API baseada em legado JDBC do Connector/C++ 1.1. Para mais informações, veja  Guia do Desenvolvedor do MySQL Connector/C++ 9.5.

Veja também  cliente,  conector,  JDBC.

Connector/J:   Um **driver JDBC** que fornece conectividade para aplicações **cliente** desenvolvidas na linguagem de programação **Java**. O MySQL Connector/J é um driver do tipo 4 JDBC: uma implementação pura em Java do protocolo MySQL que não depende das bibliotecas do cliente MySQL. Para detalhes completos, veja  Guia do Desenvolvedor do MySQL Connector/J.

Veja também  cliente,  bibliotecas do cliente,  conector,  Java,  JDBC.

Connector/NET:   Um **conector MySQL** para desenvolvedores que escrevem aplicações usando linguagens, tecnologias e frameworks como **C#**, **.NET**, **Mono**, **Visual Studio**, **ASP.net** e **ADO.net**.

Veja também  ADO.NET,  ASP.net,  conector,  C#,  Mono,  Visual Studio.

Connector/ODBC :   A família de drivers ODBC do MySQL que fornece acesso a um banco de dados MySQL usando a API de Conectividade de Banco de Dados Aberta (**ODBC**) padrão da indústria. Anteriormente chamados de drivers MyODBC. Para detalhes completos, consulte o Guia do Desenvolvedor MySQL Connector/ODBC.

    Veja também  conector,  ODBC.

Connector/PHP :   Uma versão das **APIs** `mysql` e `mysqli` para **PHP** otimizada para o sistema operacional Windows.

    Veja também  conector,  PHP,  API PHP.

leitura consistente :   Uma operação de leitura que usa informações de **instantâneo** para apresentar os resultados da consulta com base em um ponto no tempo, independentemente das alterações realizadas por outras transações em execução ao mesmo tempo. Se os dados solicitados tiverem sido alterados por outra transação, os dados originais são reconstruídos com base no conteúdo do **registro de desfazer**. Essa técnica evita alguns dos problemas de **bloqueio** que podem reduzir a **concorrência** ao forçar as transações a esperar que outras transações terminem.

    Com o nível de isolamento **CONSISTENTE COM LEITURA**, o instantâneo é baseado no momento em que a primeira operação de leitura é realizada. Com o nível de isolamento **LEITURA COM PROMESSA**, o instantâneo é redefinido para o momento de cada operação de leitura consistente.

    A leitura consistente é o modo padrão no qual o `InnoDB` processa as instruções `SELECT` nos níveis de isolamento **LEITURA COM PROMESSA** e **CONSISTENTE COM LEITURA**. Como uma leitura consistente não configura nenhum bloqueio nas tabelas a que acessa, outras sessões estão livres para modificar essas tabelas enquanto uma leitura consistente está sendo realizada na tabela.

    Para detalhes técnicos sobre os níveis de isolamento aplicáveis, consulte a Seção 17.7.2.3, “Leitura Não Bloqueada Consistente”.

    Veja também  concorrência,  nível de isolamento,  bloqueio,  LEITURA COM PROMESSA,  CONSISTENTE COM LEITURA,  instantâneo,  transação,  registro de desfazer.

restrição:   Um teste automático que pode bloquear as alterações no banco de dados para evitar que os dados se tornem inconsistentes. (Em termos de ciência da computação, um tipo de asserção relacionada a uma condição invariante.) As restrições são um componente crucial da filosofia **ACID**, para manter a consistência dos dados. As restrições suportadas pelo MySQL incluem **restrições de chave estrangeira** e **restrições de unicidade**.

Veja também  ACID,  chave estrangeira,  restrição de unicidade.

contador:   Um valor que é incrementado por um tipo específico de operação do `InnoDB`. Útil para medir o quão ocupado está um servidor, solucionar problemas de desempenho e testar se as alterações (por exemplo, em configurações ou índices usados por consultas) têm os efeitos desejados em nível baixo. Diferentes tipos de contadores estão disponíveis através das tabelas do **Schema de Desempenho** e das tabelas do **`INFORMATION_SCHEMA`**, particularmente o `INFORMATION_SCHEMA.INNODB_METRICS`.

Veja também  `INFORMATION_SCHEMA`,  contador de métricas,  Schema de Desempenho.

índice coberto:   Um **índice** que inclui todas as colunas recuperadas por uma consulta. Em vez de usar os valores do índice como ponteiros para encontrar as linhas completas da tabela, a consulta retorna valores da estrutura do índice, economizando o I/O de disco. O `InnoDB` pode aplicar essa técnica de otimização a mais índices do que o MyISAM pode, porque os **índices secundários** do `InnoDB` também incluem as colunas da **chave primária**. O `InnoDB` não pode aplicar essa técnica para consultas contra tabelas modificadas por uma transação, até que essa transação termine.

Qualquer **índice de coluna** ou **índice composto** pode atuar como um índice coberto, dado a consulta certa. Projete seus índices e consultas para aproveitar essa técnica de otimização sempre que possível.

Veja também  índice de coluna,  índice composto,  índice,  chave primária,  índice secundário.

CPU-bound:   Um tipo de **carga de trabalho** onde o principal **bottleneck** são as operações de CPU na memória. Tipicamente envolve operações intensivas em leitura onde os resultados podem ser todos cacheados na **pool de buffers**.

Veja também  obstáculo,  pool de buffer,  carga de trabalho.

crash :   O MySQL usa o termo “crash” para se referir, de forma geral, a qualquer operação de **parada** inesperada em que o servidor não consegue realizar sua limpeza normal. Por exemplo, um crash pode ocorrer devido a uma falha de hardware na máquina do servidor de banco de dados ou no dispositivo de armazenamento; uma falha de energia; uma possível incompatibilidade de dados que faz o servidor MySQL parar; um **shutdown rápido** iniciado pelo DBA; ou muitas outras razões. A robusta **recuperação automática de crash** para tabelas **InnoDB** garante que os dados sejam tornados consistentes quando o servidor é reiniciado, sem nenhum trabalho extra para o DBA.

    Veja também  recuperação de crash,  shutdown rápido,  InnoDB,  parada.

recuperação de crash :   As atividades de limpeza que ocorrem quando o MySQL é reiniciado após um **crash**. Para tabelas **InnoDB**, as alterações de transações incompletas são regravadas usando dados do **log de reescrita**. Alterações que foram **comprometidas** antes do crash, mas ainda não escritas nos **arquivos de dados**, são reconstruídas a partir do **buffer de dupla escrita**. Quando o banco de dados é desligado normalmente, esse tipo de atividade é realizado durante o desligamento pela operação de **purga**.

    Durante o funcionamento normal, os dados comprometidos podem ser armazenados no **buffer de alterações** por um período de tempo antes de serem escritos nos arquivos de dados. Há sempre um compromisso entre manter os arquivos de dados atualizados, o que introduz sobrecarga de desempenho durante o funcionamento normal, e o bufferamento dos dados, o que pode fazer com que a recuperação de crash e shutdown demore mais.

    Veja também  buffer de alterações,  comprometer,  crash,  arquivos de dados,  buffer de dupla escrita,  InnoDB,  purga,  log de reescrita.

CRUD :   Abreviação de “criar, ler, atualizar, excluir”, uma sequência comum de operações em aplicativos de banco de dados. Muitas vezes denota uma classe de aplicativos com uso relativamente simples do banco de dados (declarações básicas de **DDL**, **DML** e **consulta** em **SQL**) que podem ser implementadas rapidamente em qualquer linguagem.

    Veja também  DDL,  DML,  consulta,  SQL.

cursor:   Uma estrutura de dados interna do MySQL que representa o conjunto de resultados de uma instrução SQL. Muitas vezes usada com **instruções preparadas** e **SQL dinâmico**. Funciona como um iterador em outros linguagens de alto nível, produzindo cada valor do conjunto de resultados conforme solicitado.

Embora o SQL geralmente gere o processamento dos cursors para você, você pode se aprofundar no funcionamento interno ao lidar com código crítico em termos de desempenho.

Veja também  SQL dinâmico,  instrução preparada,  consulta.

### D

linguagem de definição de dados:   Veja  DDL.

dicionário de dados:   Metadados que acompanham objetos do banco de dados, como **tabelas**, **índice** e **colunas** de **tabelas**. Para o dicionário de dados do MySQL, introduzido no MySQL 8.0, os metadados estão fisicamente localizados em arquivos de **espaço de tabela por arquivo** no diretório do banco de dados `mysql`. Para o dicionário de dados do `InnoDB`, os metadados estão fisicamente localizados no **espaço de tabela do sistema** do `InnoDB`.

Como o produto **MySQL Enterprise Backup** sempre faz backup do espaço de tabela do sistema do `InnoDB`, todos os backups incluem o conteúdo do dicionário de dados do `InnoDB`.

Veja também  coluna,  espaço de tabela por arquivo,  arquivo .frm,  índice,  MySQL Enterprise Backup,  espaço de tabela do sistema,  tabela.

diretório de dados:   O diretório sob o qual cada **instância** do MySQL mantém os **arquivos de dados** para o `InnoDB` e os diretórios que representam bancos de dados individuais. Controlado pela opção de configuração  `datadir`.

Veja também  arquivos de dados,  instância.

arquivos de dados:   Os arquivos que fisicamente contêm dados de **tabela** e **índice**.

O **espaço de tabela do sistema** do `InnoDB`, que contém o **dicionário de dados do InnoDB** e é capaz de armazenar dados para múltiplas tabelas do `InnoDB`, é representado por um ou mais arquivos de dados `.ibdata`.

Os espaços de tabela por arquivo, que armazenam dados para uma única tabela do `InnoDB`, são representados por um arquivo de dados `.ibd`.

Os espaços de tabela gerais (introduzidos no MySQL 5.7.6), que podem armazenar dados para múltiplas tabelas do `InnoDB`, também são representados por um arquivo de dados `.ibd`.

Veja também  dicionário de dados,  arquivo por tabela,  espaço de tabelas geral,  arquivo .ibd,  arquivo ibdata,  índice,  espaço de tabelas do sistema,  tabela,  espaço de tabelas.

linguagem de manipulação de dados :   Veja  DML.

armazém de dados :   Um sistema de banco de dados ou aplicativo que executa principalmente **consultas** grandes. Os dados de leitura apenas ou quase apenas podem ser organizados em forma **denormalizada** para eficiência de consulta. Pode se beneficiar das otimizações para **transações de leitura apenas** no MySQL 5.6 e versões posteriores. Contrasta com **OLTP**.

Veja também  denormalizado,  OLTP,  consulta,  transação de leitura apenas.

banco de dados :   Dentro do **diretório de dados** do MySQL, cada banco de dados é representado por um diretório separado. O **espaço de tabelas do sistema** de InnoDB, que pode armazenar dados de tabelas de vários bancos de dados dentro de uma **instância** do MySQL, é mantido em **arquivos de dados** que residem fora dos diretórios de banco de dados individuais. Quando o modo **arquivo por tabela** é habilitado, os arquivos .ibd que representam as tabelas individuais de InnoDB são armazenados dentro dos diretórios de banco de dados, a menos que sejam criados em outro lugar usando a cláusula `DIRETÓRIO DE DADOS`. Os espaços de tabelas gerais, introduzidos no MySQL 5.7.6, também armazenam dados de tabelas em arquivos .ibd. Ao contrário dos arquivos .ibd de **arquivo por tabela**, os arquivos .ibd de espaço de tabelas gerais podem armazenar dados de tabelas de vários bancos de dados dentro de uma **instância** do MySQL e podem ser atribuídos a diretórios relativos ou independentes do diretório de dados do MySQL.

Para usuários de longo prazo do MySQL, um banco de dados é uma noção familiar. Usuários que vêm de um ambiente do Oracle Database podem achar que o significado de banco de dados do MySQL está mais próximo do que o Oracle Database chama de **esquema**.

Veja também  arquivos de dados,  arquivo por tabela,  arquivo .ibd,  instância,  esquema,  espaço de tabelas do sistema.

DCL :   Linguagem de controle de dados, um conjunto de **instruções SQL** para gerenciar privilégios. No MySQL, consiste nas instruções  `GRANT` e  `REVOKE`. Contrasta com **DDL** e **DML**.

Veja também  DDL,  DML,  SQL.

Fornecedor DDEX:   Uma funcionalidade que permite usar as ferramentas de design de dados no **Visual Studio** para manipular o esquema e os objetos dentro de um banco de dados MySQL. Para aplicações MySQL que utilizam o **Connector/NET**, o Plugin do Visual Studio para MySQL atua como um fornecedor DDEX com o MySQL 5.0 e versões posteriores.

Veja também  Visual Studio.

DDL:   Linguagem de definição de dados, um conjunto de **SQL** para manipular o próprio banco de dados em vez das linhas individuais de uma tabela. Inclui todas as formas das instruções `CREATE`, `ALTER` e `DROP`. Também inclui a instrução `TRUNCATE`, porque funciona de maneira diferente de uma instrução `DELETE FROM nome_tabela`, embora o efeito final seja semelhante.

As instruções DDL **confirmam automaticamente** a **transação** atual; elas não podem ser **anuladas**.

A funcionalidade DDL online `InnoDB` melhora o desempenho para operações de `CREATE INDEX`, `DROP INDEX` e muitos tipos de operações `ALTER TABLE`. Consulte a Seção 17.12, “InnoDB e DDL Online” para mais informações. Além disso, a configuração `file-per-table` do `InnoDB` pode afetar o comportamento das operações `DROP TABLE` e `TRUNCATE TABLE`.

Compare com **DML** e **DCL**.

Veja também  commit,  DCL,  DML,  file-per-table,  rollback,  SQL,  transação.

bloqueio:   Uma situação em que diferentes **transações** não conseguem prosseguir, porque cada uma detém um **bloqueio** que a outra precisa. Como ambas as transações estão esperando por um recurso ficar disponível, nenhuma delas libera os bloqueios que detém.

Um bloqueio pode ocorrer quando as transações bloqueiam linhas em múltiplas tabelas (através de instruções como `UPDATE` ou `SELECT ... FOR UPDATE`), mas na ordem inversa. Um bloqueio também pode ocorrer quando tais instruções bloqueiam faixas de registros de índice e **lacunas**, com cada transação adquirindo alguns bloqueios, mas não outros devido a um problema de sincronização.

Para informações de fundo sobre como os bloqueios são detectados e tratados automaticamente, consulte a Seção 17.7.5.2, “Detecção de Bloqueios”. Para dicas sobre como evitar e recuperar de condições de bloqueio, consulte a Seção 17.7.5.3, “Como Minimizar e Gerenciar Bloqueios”.

Veja também  gap,  lock,  transação.

detecção de bloqueio :   Um mecanismo que detecta automaticamente quando ocorre um **bloqueio** e **reverte automaticamente** uma das **transações** envolvidas (a **vítima**). A detecção de bloqueio pode ser desativada usando a opção de configuração  `innodb_deadlock_detect`.

Veja também  bloqueio,  rollback,  transação,  vítima.

delete :   Quando o `InnoDB` processa uma instrução `DELETE`, as linhas são marcadas imediatamente para exclusão e não são mais retornadas por consultas. O armazenamento é recuperado em algum momento mais tarde, durante a coleta periódica de lixo conhecida como operação de **purga**. Para remover grandes quantidades de dados, operações relacionadas com suas próprias características de desempenho são **TRUNCATE** e **DROP**.

Veja também  drop,  purge,  truncate.

bufferamento de delete :   A técnica de armazenar as alterações em páginas de índice secundário, resultantes de operações `DELETE`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas e minimizar o I/O aleatório. (Como as operações de delete são um processo de duas etapas, essa operação armazena a escrita que normalmente marca um registro de índice para exclusão.) É um dos tipos de **bufferamento de alterações**: os outros são **bufferamento de inserção** e **bufferamento de purga**.

Veja também  buffer de alterações,  bufferamento de alterações,  buffer de inserção,  bufferamento de inserção,  bufferamento de purga.

desnormalizado:   Uma estratégia de armazenamento de dados que duplica os dados em diferentes tabelas, em vez de vincular as tabelas com **chaves estrangeiras** e consultas de **join**. Tipicamente usada em aplicações de **data warehouse**, onde os dados não são atualizados após o carregamento. Nessas aplicações, o desempenho das consultas é mais importante do que tornar simples a manutenção de dados consistentes durante as atualizações. Contrasta com **normalizado**.

Veja também  data warehouse,  chave estrangeira,  join,  normalizado.

índice em ordem decrescente:   Um tipo de **índice** onde o armazenamento do índice é otimizado para processar cláusulas `ORDER BY coluna DESC`.

Veja também  índice.

cache de objeto do dicionário:   O cache de objeto do dicionário armazena objetos do **dicionário de dados** acessados anteriormente na memória para permitir a reutilização de objetos e minimizar o I/O de disco. Uma estratégia de evicção baseada em **LRU** é usada para evocar os objetos menos recentemente usados da memória. O cache é composto por várias partições que armazenam diferentes tipos de objetos.

Para mais informações, consulte  Seção 16.4, “Cache de Objeto do Dicionário”.

Veja também  dicionário de dados,  LRU.

página suja:   Uma **página** no **pool de buffer** do `InnoDB` que foi atualizada na memória, onde as alterações ainda não foram escritas (**flushadas**) nos **arquivos de dados**. O oposto de uma **página limpa**.

Veja também  pool de buffer,  página limpa,  arquivos de dados,  flush,  página.

leitura suja:   Uma operação que recupera dados não confiáveis, dados que foram atualizados por outra transação, mas ainda não **confirmados**. É possível apenas com o **nível de isolamento** conhecido como **leitura não comprometida**.

Esse tipo de operação não segue o **princípio ACID** do design de banco de dados. É considerado muito arriscado, porque os dados podem ser **revertidos** ou atualizados ainda mais antes de serem confirmados; então, a transação que faz a leitura suja usaria dados que nunca foram confirmados como precisos.

O oposto é a **leitura consistente**, onde o `InnoDB` garante que uma transação não leia informações atualizadas por outra transação, mesmo que a outra transação se commit (confirme) no meio do caminho.

Veja também  ACID,  commit,  leitura consistente,  nível de isolamento,  LEITURA NÃO COMMITIDA,  rollback.

baseada em disco:   Um tipo de banco de dados que organiza os dados principalmente em armazenamento em disco (discos rígidos ou equivalentes). Os dados são trazidos e trazidos de volta entre o disco e a memória para serem operados. É o oposto de um **banco de dados em memória**. Embora o `InnoDB` seja baseado em disco, ele também contém recursos como o **pool de buffers**, múltiplas instâncias do pool de buffers e o **índice de hash adaptativo** que permitem que certos tipos de cargas de trabalho trabalhem principalmente a partir da memória.

Veja também  índice de hash adaptativo,  pool de buffers,  banco de dados em memória.

baseada em disco:   Um tipo de **carga de trabalho** onde o principal **bottleneck** é o I/O de disco. (Também conhecida como **bound por I/O**.) Tipicamente envolve escritas frequentes no disco ou leituras aleatórias de mais dados do que podem caber no **pool de buffers**.

Veja também  bottleneck,  pool de buffers,  carga de trabalho.

DML:   Linguagem de manipulação de dados, um conjunto de **instruções SQL** para realizar operações de  INSERT,  UPDATE e  DELETE. A instrução  SELECT  é às vezes considerada como uma instrução DML, porque a forma  SELECT ... FOR UPDATE  está sujeita às mesmas considerações de **bloqueio** que  INSERT,  UPDATE e  DELETE.

As instruções DML para uma tabela `InnoDB` operam no contexto de uma **transação**, então seus efeitos podem ser **commitados** ou **descartáveis** como uma única unidade.

Contrastando com  DDL  e  DCL.

Veja também  commit,  DCL,  DDL,  bloqueio,  rollback,  SQL,  transação.

ID do documento:  No recurso de **pesquisa de texto completo** do `InnoDB`, uma coluna especial na tabela que contém o **índice FULLTEXT**, para identificar de forma única o documento associado a cada valor de **ilist**. Seu nome é `FTS_DOC_ID` (o uso de maiúsculas é obrigatório). A própria coluna deve ser do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único chamado `FTS_DOC_ID_INDEX`. Preferencialmente, você define essa coluna ao criar a tabela. Se o `InnoDB` precisar adicionar a coluna à tabela enquanto cria um **índice FULLTEXT**, a operação de indexação é consideravelmente mais cara.

Veja também  pesquisa de texto completo,  índice FULLTEXT,  ilist.

Buffer de dupla escrita:  O `InnoDB` usa uma técnica de varredura de arquivos chamada dupla escrita. Antes de escrever **páginas** nos **arquivos de dados**, o `InnoDB` as escreve primeiro para uma área de armazenamento chamada buffer de dupla escrita. Somente após a escrita e a varredura para o buffer de dupla escrita serem concluídas, o `InnoDB` escreve as páginas em suas posições apropriadas no arquivo de dados. Se houver um crash do sistema operacional, do subsistema de armazenamento ou do processo `mysqld` durante a escrita de uma página, o `InnoDB` pode encontrar uma boa cópia da página do buffer de dupla escrita durante a **recuperação após o crash**.

Embora os dados sejam sempre escritos duas vezes, o buffer de dupla escrita não requer o dobro do overhead de I/O ou o dobro das operações de I/O. Os dados são escritos no próprio buffer como um grande bloco sequencial, com uma única chamada `fsync()` ao sistema operacional.

Veja também  recuperação após o crash,  arquivos de dados,  página,  purga.

drop:   Um tipo de operação **DDL** que remove um objeto do esquema, por meio de uma declaração como `DROP TABLE` ou `DROP INDEX`. Internamente, é mapeado para uma declaração `ALTER TABLE`. Do ponto de vista do **InnoDB**, as considerações de desempenho dessas operações envolvem o tempo que o **dicionário de dados** é bloqueado para garantir que todos os objetos interrelacionados sejam atualizados e o tempo para atualizar estruturas de memória, como o **pool de buffers**. Para uma **tabela**, a operação de drop tem características um pouco diferentes da operação de **truncate** (declaração `TRUNCATE TABLE`).

Veja também buffer pool, dicionário de dados, DDL, tabela, truncate.

DSN:   Abreviação de “Nome da Fonte do Banco de Dados”. É a codificação para as informações de **conexão** dentro do **Connector/ODBC**. Consulte Configurando um DSN do Connector/ODBC no Windows para obter detalhes completos. É o equivalente à **string de conexão** usada pelo **Connector/NET**.

Veja também conexão, string de conexão, Connector/NET, Connector/ODBC.

cursor dinâmico:   Um tipo de **cursor** suportado pelo **ODBC** que pode recuperar novos e alterados resultados quando as linhas são lidas novamente. Se e como rapidamente as alterações são visíveis para o cursor dependem do tipo de tabela envolvida (transacional ou não transacional) e do nível de isolamento para tabelas transacionais. O suporte a cursors dinâmicos deve ser habilitado explicitamente.

Veja também cursor, ODBC.

formato de linha dinâmico:   Um formato de linha `InnoDB`. Como os valores de coluna de comprimento variável são armazenados fora da página que contém os dados da linha, é muito eficiente para linhas que incluem objetos grandes. Como os campos grandes normalmente não são acessados para avaliar as condições da consulta, eles não são trazidos para o **pool de buffers** com tanta frequência, resultando em menos operações de I/O e melhor utilização da memória cache.

A partir do MySQL 5.7.9, o formato de linha padrão é definido por `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`.

Para obter informações adicionais sobre o formato de linha **DINÂMICO** do **InnoDB**, consulte o formato de linha dinâmica.

Veja também  pool de buffers,  formato de arquivo,  formato de linha.

SQL dinâmico:  Uma funcionalidade que permite criar e executar **instruções preparadas** usando métodos mais robustos, seguros e eficientes para substituir os valores dos parâmetros do que a técnica ingênua de concatenar as partes da instrução em uma variável de string.

Veja também  instrução preparada.

instrução dinâmica:  Uma **instrução preparada** criada e executada por meio do **SQL dinâmico**.

Veja também  SQL dinâmico,  instrução preparada.

### E

adotante precoce:  Uma fase semelhante ao **beta**, quando um produto de software é tipicamente avaliado quanto ao desempenho, funcionalidade e compatibilidade em um ambiente não crítico para a missão.

Veja também  beta.

Eiffel:  Uma linguagem de programação que inclui muitas características orientada a objetos. Alguns de seus conceitos são familiares aos desenvolvedores de **Java** e **C#**. Para a API de código aberto Eiffel para MySQL, consulte a Seção 31.13, “MySQL Eiffel Wrapper”.

Veja também  API,  C#,  Java.

incorporado:  A biblioteca do servidor MySQL incorporada (**libmysqld**) permite executar um servidor MySQL completo dentro de uma **aplicação cliente**. Os principais benefícios são o aumento da velocidade e a gestão mais simples para aplicações incorporadas.

Veja também  cliente,  libmysqld.

log de erro:  Um tipo de **log** que mostra informações sobre o inicialização do MySQL e erros críticos de tempo de execução e informações sobre **quebra**. Para detalhes, consulte a Seção 7.4.2, “O Log de Erro”.

Veja também  quebra,  log.

expulsão:  O processo de remover um item de um cache ou de outra área de armazenamento temporário, como o **pool de buffers** do **InnoDB**. Muitas vezes, mas nem sempre, usa o algoritmo **LRU** para determinar qual item deve ser removido. Quando uma **página suja** é expulsa, seus conteúdos são **flushados** para o disco, e quaisquer páginas **vizinhas sujas** também podem ser flushadas.

Veja também  pool de buffers,  página suja,  flush,  LRU,  página vizinha.

interceptador de exceções:   Um tipo de **interceptador** para rastrear, depurar ou ampliar erros SQL encontrados por uma aplicação de banco de dados. Por exemplo, o código do interceptor pode emitir uma declaração `SHOW WARNINGS` para recuperar informações adicionais e adicionar texto descritivo ou até mesmo alterar o tipo da exceção retornada para a aplicação. Como o código do interceptor é chamado apenas quando os comandos SQL retornam erros, ele não impõe nenhuma penalidade de desempenho à aplicação durante a operação normal (sem erros).

    Em aplicações **Java** que utilizam **Connector/J**, configurar esse tipo de interceptor envolve a implementação da interface `com.mysql.jdbc.ExceptionInterceptor` e a adição de uma propriedade `exceptionInterceptors` à **string de conexão**.

    Em aplicações **Visual Studio** que utilizam **Connector/NET**, configurar esse tipo de interceptor envolve a definição de uma classe que herda da classe `BaseExceptionInterceptor` e a especificação do nome dessa classe como parte da string de conexão.

    Veja também  Connector/J,  Connector/NET,  interceptador,  Java,  Visual Studio.

bloqueio exclusivo:   Um tipo de **bloqueio** que impede que qualquer outra **transação** bloqueie a mesma linha. Dependendo do nível de **isolamento** da transação, esse tipo de bloqueio pode bloquear outras transações de escrita na mesma linha ou também pode bloquear outras transações de leitura na mesma linha. O nível de isolamento padrão `InnoDB`, **REPEATABLE READ**, permite maior **concorrência** ao permitir que as transações leiam linhas que têm bloqueios exclusivos, uma técnica conhecida como **leitura consistente**.

    Veja também  concorrência,  leitura consistente,  nível de isolamento,  bloqueio,  REPEATABLE READ,  bloqueio compartilhado,  transação.

extensão:   Um grupo de **páginas** dentro de um **espaço de tabelas**. Para o tamanho padrão de **página** de 16KB, uma extensão contém 64 páginas. No MySQL 5.6, o tamanho da página para uma instância `InnoDB` pode ser de 4KB, 8KB ou 16KB, controlado pela opção de configuração `innodb_page_size`. Para tamanhos de páginas de 4KB, 8KB e 16KB, o tamanho da extensão é sempre de 1MB (ou 1048576 bytes).

    O suporte para tamanhos de página `InnoDB` de 32KB e 64KB foi adicionado no MySQL 5.7.6. Para um tamanho de página de 32KB, o tamanho da extensão é de 2MB. Para um tamanho de página de 64KB, o tamanho da extensão é de 4MB.

    Recursos do `InnoDB`, como **segmentos**, **pedidos de pré-leitura** e o **buffer de escrita dupla**, usam operações de E/S que leem, escrevem, alocam ou liberam dados uma extensão de cada vez.

    Veja também buffer de escrita dupla, página, tamanho de página, pré-leitura, segmento, espaço de tabelas.

### F

arquivo .frm:   Um arquivo que contém os metadados, como a definição da tabela, de uma tabela MySQL. Os arquivos `.frm` foram removidos no MySQL 8.0, mas ainda são usados em versões anteriores do MySQL. No MySQL 8.0, os dados anteriormente armazenados em arquivos `.frm` são armazenados em tabelas do **dicionário de dados**.

    Veja também dicionário de dados, Backup Empresarial do MySQL, espaço de tabelas do sistema.

failover:   A capacidade de alternar automaticamente para um servidor de standby em caso de falha. No contexto do MySQL, o failover envolve um servidor de banco de dados de standby. Muitas vezes suportado dentro de ambientes **J2EE** pelo servidor ou framework de aplicação.

    Veja também Connector/J, J2EE.

Criação Rápida de Índices:   Uma capacidade introduzida pela primeira vez no Plugin InnoDB, agora parte do MySQL a partir da versão 5.5 e superior, que acelera a criação de **índices secundários** do `InnoDB` evitando a necessidade de reescrever completamente a tabela associada. A aceleração se aplica à remoção de índices secundários também.

Como a manutenção de índices pode adicionar sobrecarga de desempenho a muitas operações de transferência de dados, considere realizar operações como `ALTER TABLE ... ENGINE=INNODB` ou `INSERT INTO ... SELECT * FROM ...` sem quaisquer índices secundários, e criar os índices posteriormente.

No MySQL 5.6, essa funcionalidade se torna mais geral. Você pode ler e escrever em tabelas enquanto um índice está sendo criado, e muitos outros tipos de operações `ALTER TABLE` podem ser realizadas sem copiar a tabela, sem bloquear operações **DML** ou ambas. Assim, no MySQL 5.6 e versões superiores, esse conjunto de funcionalidades é referido como **DDL online** em vez de Criação Rápida de Índices.

Para informações relacionadas, consulte  Seção 17.12, “InnoDB e DDL Online”.

Veja também  DML,  índice,  DDL online,  índice secundário.

desligamento rápido :   O procedimento de **desligamento** padrão para `InnoDB`, baseado na configuração  `innodb_fast_shutdown=1`. Para economizar tempo, certas operações de **flush** são ignoradas. Esse tipo de desligamento é seguro durante o uso normal, porque as operações de flush são realizadas durante a próxima inicialização, usando o mesmo mecanismo que na **recuperação de falhas**. Em casos em que o banco de dados está sendo desligado para uma atualização ou downgrade, faça um **desligamento lento** em vez disso para garantir que todas as alterações relevantes sejam aplicadas aos **arquivos de dados** durante o desligamento.

Veja também  recuperação de falhas,  arquivos de dados,  flush,  desligamento,  desligamento lento.

formato de arquivo :   O formato de arquivo para tabelas `InnoDB`.

Veja também  arquivo por tabela,  arquivo .ibd,  arquivo ibdata,  formato de linha.

arquivo por tabela :   Um nome geral para o ajuste controlado pela opção  `innodb_file_per_table`, que é uma opção de configuração importante que afeta aspectos do armazenamento de arquivos `InnoDB`, disponibilidade de recursos e características de I/O. A partir do MySQL 5.6.7,  `innodb_file_per_table` está habilitado por padrão.

Com a opção `innodb_file_per_table` habilitada, você pode criar uma tabela em seu próprio **arquivo .ibd** em vez dos arquivos compartilhados **ibdata** do **espaço de tabelas do sistema**. Quando os dados da tabela são armazenados em um arquivo **.ibd** individual, você tem mais flexibilidade para escolher os **formatos de linha** necessários para recursos como a **compressão de dados**. A operação `TRUNCATE TABLE` também é mais rápida, e o espaço recuperado pode ser usado pelo sistema operacional em vez de permanecer reservado para o `InnoDB`.

O produto **MySQL Enterprise Backup** é mais flexível para tabelas que estão em seus próprios arquivos. Por exemplo, as tabelas podem ser excluídas de um backup, mas apenas se estiverem em arquivos separados. Assim, este ajuste é adequado para tabelas que são backupadas com menos frequência ou em um cronograma diferente.

Veja também  formato de linha compactado,  compressão,  formato de arquivo,  arquivo .ibd,  arquivo ibdata,  innodb_file_per_table,  MySQL Enterprise Backup,  formato de linha,  espaço de tabelas do sistema.

fill factor :  Em um **índice InnoDB**, a proporção de uma **página** que é ocupada por dados do índice antes que a página seja dividida. O espaço não utilizado quando os dados do índice são divididos pela primeira vez entre páginas permite que as linhas sejam atualizadas com valores de string mais longos sem exigir operações caras de manutenção do índice. Se o fill factor for muito baixo, o índice consome mais espaço do que necessário, causando sobrecarga de I/O extra ao ler o índice. Se o fill factor for muito alto, qualquer atualização que aumente o comprimento dos valores das colunas pode causar sobrecarga de I/O extra para a manutenção do índice. Veja  Seção 17.6.2.2, “A Estrutura Física de um Índex InnoDB” para mais informações.

Veja também  índice,  página.

formato de linha fixo:   Este formato de linha é usado pelo mecanismo de armazenamento `MyISAM`, e não pelo `InnoDB`. Se você criar uma tabela `InnoDB` com a opção `ROW_FORMAT=FIXED` no MySQL 5.7.6 ou versões anteriores, o `InnoDB` usa o **formato de linha compactado** em vez disso, embora o valor `FIXED` ainda possa aparecer na saída, como em relatórios do `SHOW TABLE STATUS`. A partir do MySQL 5.7.7, o `InnoDB` retorna um erro se `ROW_FORMAT=FIXED` for especificado.

Veja também  formato de linha compactado,  formato de linha.

flush:   Para escrever as alterações nos arquivos do banco de dados, que foram armazenados em uma área de memória ou em uma área de armazenamento em disco temporária. As estruturas de armazenamento `InnoDB` que são esvaziadas periodicamente incluem o **log de refazer**, o **log de desfazer** e o **pool de buffers**.

O esvaziamento pode ocorrer porque uma área de memória fica cheia e o sistema precisa liberar algum espaço, porque uma **operação de commit** significa que as alterações de uma transação podem ser finalizadas, ou porque uma **operação de desligamento lento** significa que todo o trabalho pendente deve ser finalizado. Quando não é crítico esvaziar todos os dados armazenados de uma vez, o `InnoDB` pode usar uma técnica chamada **checkpointing fuzzy** para esvaziar pequenos lotes de páginas para espalhar o overhead de I/O.

Veja também  pool de buffers,  commit,  checkpointing fuzzy,  log de refazer,  desligamento lento,  log de desfazer.

flush list:   Uma estrutura de dados interna do `InnoDB` que rastreia **páginas sujas** no **pool de buffers**: ou seja, **páginas** que foram alteradas e precisam ser escritas de volta para o disco. Esta estrutura de dados é atualizada frequentemente pelas **mini-transações** internas do `InnoDB`, e, portanto, é protegida por seu próprio **mutex** para permitir acesso concorrente ao pool de buffers.

Veja também  pool de buffers,  página suja,  LRU,  mini-transação,  mutex,  página,  limpeza de página.

chave estrangeira:   Um tipo de relação de ponteiro, entre linhas em tabelas `InnoDB` separadas. A relação de chave estrangeira é definida em uma coluna na **tabela pai** e na **tabela filho**.

Além de permitir a busca rápida por informações relacionadas, as chaves estrangeiras ajudam a impor a **integridade referencial**, impedindo que qualquer um desses ponteiros se torne inválido à medida que os dados são inseridos, atualizados e excluídos. Esse mecanismo de enforcement é um tipo de **restrição**. Uma linha que aponta para outra tabela não pode ser inserida se o valor da chave estrangeira associada não existir na outra tabela. Se uma linha for excluída ou seu valor da chave estrangeira for alterado, e linhas em outra tabela apontarem para esse valor da chave estrangeira, a chave estrangeira pode ser configurada para impedir a exclusão, fazer com que os valores das colunas correspondentes na outra tabela se tornem **nulos** ou excluir automaticamente as linhas correspondentes na outra tabela.

Uma das etapas na concepção de um **banco de dados normalizado** é identificar dados duplicados, separar esses dados em uma nova tabela e configurar uma relação de chave estrangeira para que as múltiplas tabelas possam ser consultadas como uma única tabela, usando uma operação de **join**.

Veja também  tabela filho,  restrição de chave estrangeira,  join,  normalizado,  NULL,  tabela pai,  integridade referencial,  relacional.

Restrição de chave estrangeira :   O tipo de **restrição** que mantém a consistência do banco de dados através de uma relação de **chave estrangeira**. Como outros tipos de restrições, ela pode impedir que dados sejam inseridos ou atualizados se os dados se tornassem inconsistentes; nesse caso, a inconsistência sendo impedida é entre dados em múltiplas tabelas. Alternativamente, quando uma operação **DML** é realizada, as restrições de **chave estrangeira** podem fazer com que os dados em **linhas filhas** sejam excluídos, alterados para valores diferentes ou definidos como **nulos**, com base na opção `ON CASCADE` especificada ao criar a chave estrangeira.

Veja também  tabela filho,  restrição,  DML,  chave estrangeira,  NULL.

FTS :   Na maioria dos contextos, um acrônimo para **pesquisa de texto completo**. Às vezes, em discussões de desempenho, um acrônimo para **pesquisa de tabela completa**.

Veja também  pesquisa de tabela completa,  pesquisa de texto completo.

backup completo:   Um **backup** que inclui todas as **tabelas** em cada **banco de dados** MySQL e todos os bancos de dados em uma **instância** MySQL. Contrasta com o **backup parcial**.

Veja também  backup,  banco de dados,  instância,  backup parcial,  tabela.

escaneamento completo de tabela:   Uma operação que requer a leitura de todo o conteúdo de uma tabela, em vez de apenas porções selecionadas usando um **índice**. Normalmente realizada com tabelas de busca pequenas ou em situações de data warehousing com tabelas grandes, onde todos os dados disponíveis são agregados e analisados. A frequência com que essas operações ocorrem e o tamanho das tabelas em relação à memória disponível têm implicações para os algoritmos usados na otimização de consultas e na gestão do **pool de buffers**.

O propósito dos índices é permitir buscas por valores específicos ou faixas de valores dentro de uma grande tabela, evitando assim escaneamentos completos da tabela quando possível.

Veja também  pool de buffers,  índice.

pesquisa full-text:   A funcionalidade do MySQL para encontrar palavras, frases, combinações lógicas de palavras, e assim por diante, nos dados de uma tabela, de uma maneira mais rápida, conveniente e flexível do que usar o operador `LIKE` do SQL ou escrever seu próprio algoritmo de busca de nível de aplicação. Utiliza a função SQL `MATCH()` e **índice FULLTEXT**.

Veja também  índice FULLTEXT.

índice FULLTEXT:   O tipo especial de **índice** que contém o **índice de busca** no mecanismo de **pesquisa full-text** do MySQL. Representa as palavras dos valores de uma coluna, omitindo quaisquer que sejam especificadas como **palavras-stop**. Originalmente, disponível apenas para tabelas `MyISAM`. A partir do MySQL 5.6.4, também está disponível para tabelas **InnoDB**.

Veja também  pesquisa full-text,  índice,  InnoDB,  índice de busca,  palavra-stop.

checkpointing fuzzy:   Uma técnica que **limpa** pequenos lotes de **páginas sujas** do **pool de buffers**, em vez de limpar todas as páginas sujas de uma vez, o que interromperia o processamento do banco de dados.

Veja também  pool de buffers,  página suja,  limpeza.

GA:   "Geralmente disponível", a fase em que um produto de software sai da **beta** e está disponível para venda, suporte oficial e uso em produção.

    Veja também  beta.

GAC:   Abreviação para "Cache de Montagem Global". Uma área central para armazenar bibliotecas (**montagens**) em um sistema **.NET**. Fisicamente consiste em pastas aninhadas, tratadas como uma única pasta virtual pelo **.NET** CLR.

    Veja também  .NET,  montagem.

gap:   Um local em uma estrutura de dados de **índice** de `InnoDB` onde novos valores podem ser inseridos. Quando você bloqueia um conjunto de linhas com uma instrução como `SELECT ... FOR UPDATE`, o **InnoDB** pode criar blocos que se aplicam aos gaps, bem como aos valores reais no índice. Por exemplo, se você selecionar todos os valores maiores que 10 para atualização, um bloqueio de gap impede que outra transação insira um novo valor maior que 10. O **registro máximo** e o **registro mínimo** representam os gaps que contêm todos os valores maiores ou menores que todos os valores atuais do índice.

    Veja também  concorrência,  bloqueio de gap,  índice,  registro mínimo,  nível de isolamento,  registro máximo.

gap lock:   Um **bloqueio** em um **gap** entre registros de índice, ou um bloqueio no gap antes do primeiro ou após o último registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;` impede que outras transações insiram um valor de 15 na coluna `t.c1`, independentemente de já existir algum valor desse tipo na coluna, porque os gaps entre todos os valores existentes na faixa estão bloqueados. Contrasta com **bloqueio de registro** e **bloqueio de próxima chave**.

    Os bloqueios de gap fazem parte da compensação entre desempenho e **concorrência**, e são usados em alguns **níveis de isolamento de transação** e não em outros.

    Veja também  gap,  registro mínimo,  bloqueio,  bloqueio de próxima chave,  registro de bloqueio,  registro máximo.

log geral:   Veja  log de consulta geral.

registro de consultas gerais:   Um tipo de **registro** usado para diagnóstico e solução de problemas de instruções SQL processadas pelo servidor MySQL. Pode ser armazenado em um arquivo ou em uma tabela de banco de dados. Você deve habilitar essa funcionalidade através da opção de configuração  `general_log` para usá-la. Você pode desabilitá-la para uma conexão específica através da opção de configuração  `sql_log_off`.

Registra uma gama mais ampla de consultas do que o **registro de consultas lentas**. Ao contrário do **registro binário**, que é usado para replicação, o registro geral de consultas contém instruções  `SELECT` e não mantém uma ordem rigorosa. Para mais informações, consulte  Seção 7.4.3, “O Registro Geral de Consultas”.

Veja também  registro binário,  registro,  registro de consultas lentas.

espaço de tabelas geral:   Um espaço de tabelas compartilhado  `InnoDB` criado usando a sintaxe  `CREATE TABLESPACE`. Espaços de tabelas gerais podem ser criados fora do diretório de dados do MySQL, podem armazenar múltiplas **tabelas** e suportar tabelas de todos os formatos de linha. Espaços de tabelas gerais foram introduzidos no MySQL 5.7.6.

As tabelas são adicionadas a um espaço de tabelas geral usando a sintaxe  `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou  `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`.

Contrastam com o **espaço de tabelas do sistema** e o **espaço de tabelas por arquivo**.

Para mais informações, consulte  Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

Veja também  arquivo por tabela,  espaço de tabelas do sistema,  tabela,  espaço de tabelas.

coluna gerada:   Uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Uma coluna gerada pode ser **virtual** ou **armazenada**.

Veja também  coluna base,  coluna gerada armazenada,  coluna gerada virtual.

coluna gerada armazenada:   Veja  coluna gerada armazenada.

coluna gerada virtual:   Veja  coluna gerada virtual.

Glassfish:   Veja também  J2EE.

espaço de tabelas temporárias globais:   Um *espaço de tabelas temporárias* que armazena *segmentos de rollback* para alterações feitas em tabelas temporárias criadas pelo usuário.

Veja também  espaço de tabelas temporárias.

transação global:   Um tipo de **transação** envolvida em operações **XA**. Ela consiste em várias ações que são transacionais por si mesmas, mas que todas devem ser concluídas com sucesso como um grupo ou todas devem ser revertidas como um grupo. Em essência, isso estende as propriedades **ACID** "para cima" para que múltiplas transações ACID possam ser executadas em conjunto como componentes de uma operação global que também possui propriedades ACID.

Veja também  ACID,  transação,  XA.

commit de grupo:   Uma otimização do `InnoDB` que realiza algumas operações de I/O de baixo nível (escrita no log) uma vez para um conjunto de operações de **commit**, em vez de esvaziar e sincronizar separadamente para cada commit.

Veja também  log binário,  commit.

GUID:   Abreviação de "identificador globalmente único", um valor de ID que pode ser usado para associar dados em diferentes bancos de dados, idiomas, sistemas operacionais, etc. (Como alternativa ao uso de inteiros sequenciais, onde os mesmos valores poderiam aparecer em diferentes tabelas, bancos de dados, etc., referenciando dados diferentes.) Versões mais antigas do MySQL o representavam como `BINARY(16)`. Atualmente, é representado como `CHAR(36)`. O MySQL tem uma função `UUID()` que retorna valores GUID em formato de caractere, e uma função `UUID_SHORT()` que retorna valores GUID em formato de inteiro. Como os valores GUID sucessivos não são necessariamente em ordem de classificação ascendente, não é um valor eficiente para usar como chave primária para grandes tabelas `InnoDB`.

### H

índice de hash:   Um tipo de **índice** destinado a consultas que usam operadores de igualdade, em vez de operadores de intervalo, como maior que ou `BETWEEN`. Ele está disponível para tabelas  `MEMORY`. Embora os índices de hash sejam o padrão para tabelas  `MEMORY` por razões históricas, esse mecanismo de armazenamento também suporta índices **B-tree**, que são frequentemente uma melhor escolha para consultas de propósito geral.

O MySQL inclui uma variante deste tipo de índice, o **índice de hash adaptativo**, que é construído automaticamente para tabelas `InnoDB` se necessário com base em condições de tempo de execução.

Veja também  índice de hash adaptável,  árvore B,  índice,  InnoDB.

HDD:  Abreviação para "disco rígido". Refere-se a mídia de armazenamento que utiliza pratos giratórios, geralmente ao comparar e contrastar com **SSD**. Suas características de desempenho podem influenciar o desempenho de uma **carga de trabalho baseada em disco**.

Veja também  baseada em disco,  SSD.

heartbeat:  Uma mensagem periódica enviada para indicar que um sistema está funcionando corretamente. Em um contexto de **replicação**, se o **fonte** parar de enviar tais mensagens, uma das **replica**s pode assumir seu lugar. Técnicas semelhantes podem ser usadas entre os servidores em um ambiente de cluster, para confirmar que todos estão operando corretamente.

Veja também  replicação,  fonte.

marca-cheia:  Um valor que representa um limite superior, seja um limite rígido que não deve ser excedido durante a execução, ou um registro do valor máximo que foi realmente alcançado. Contrasta com **marca-baixa**.

Veja também  marca-baixa.

lista de histórico:  Uma lista de **transações** com registros marcados para exclusão agendados para serem processados pela operação de **purga** do **InnoDB**. Registrada no **log de desfazer**. O comprimento da lista de histórico é relatado pelo comando `SHOW ENGINE INNODB STATUS`. Se a lista de histórico crescer mais do que o valor da opção de configuração  `innodb_max_purge_lag`, cada operação **DML** é ligeiramente adiada para permitir que a operação de purga termine **flushing** os registros excluídos.

Também conhecido como **lag de purga**.

Veja também  DML,  flush,  purga,  lag de purga,  segmento de rollback,  transação,  log de desfazer.

punção de buracos:  Liberar blocos vazios de uma página. O recurso de **compressão de página transparente** do **InnoDB** depende do suporte à punção de buracos. Para mais informações, consulte  Seção 17.9.2, “Compressão de Página InnoDB”.

Veja também  arquivo esparso,  compressão de página transparente.

anfitrião:   O nome da rede de um servidor de banco de dados, usado para estabelecer uma **conexão**. Muitas vezes especificado em conjunto com uma **porta**. Em alguns contextos, o endereço IP `127.0.0.1` funciona melhor do que o nome especial `localhost` para acessar um banco de dados no mesmo servidor que o aplicativo.

    Veja também  conexão,  localhost,  porta.

hot:   Uma condição em que uma linha, tabela ou estrutura de dados interna é acessada com tanta frequência, exigindo alguma forma de bloqueio ou exclusão mútua, que resulta em um problema de desempenho ou escalabilidade.

    Embora "hot" geralmente indique uma condição indesejável, um **backup quente** é o tipo de backup preferido.

    Veja também  backup quente.

backup quente:   Um backup feito enquanto o banco de dados está em execução e os aplicativos estão lendo e escrevendo nele. O backup envolve mais do que simplesmente copiar arquivos de dados: ele deve incluir quaisquer dados que foram inseridos ou atualizados durante o processo de backup; ele deve excluir quaisquer dados que foram excluídos durante o processo de backup; e ele deve ignorar quaisquer alterações que não foram comprometidas.

    O produto Oracle que realiza backups quentes, especialmente de tabelas `InnoDB`, mas também de tabelas de `MyISAM` e outros motores de armazenamento, é conhecido como **MySQL Enterprise Backup**.

    O processo de backup quente consiste em duas etapas. A cópia inicial dos arquivos de dados produz um **backup bruto**. A etapa **aplicar** incorpora quaisquer alterações no banco de dados que ocorreram enquanto o backup estava em execução. Aplicar as alterações produz um **backup preparado**: esses arquivos estão prontos para serem restaurados sempre que necessário.

    Veja também  aplicar,  MySQL Enterprise Backup,  backup preparado,  backup bruto.

### I

.ibd arquivo:   O arquivo de dados para **tablespaces por arquivo de tabela** e tablespaces gerais. Os arquivos `.ibd` de tablespace por arquivo de tabela contêm uma única tabela e dados de índice associados. Os arquivos `.ibd` de tablespace geral podem conter dados de tabela e índice para múltiplas tabelas.

A extensão de arquivo `.ibd` não se aplica ao **espaço de tabelas do sistema**, que consiste em um ou mais **arquivos ibdata**.

Se um espaço de tabelas por arquivo ou espaço de tabelas geral for criado com a cláusula `DATA DIRECTORY =`, o arquivo `.ibd` está localizado no caminho especificado, fora do diretório de dados normal.

Quando um arquivo `.ibd` é incluído em um backup comprimido pelo produto **MySQL Enterprise Backup**, o equivalente comprimido é um arquivo `.ibz`.

Veja também  database,  file-per-table,  general tablespace,  arquivo ibdata,  arquivo .ibz,  innodb\_file\_per\_table,  MySQL Enterprise Backup,  espaço de tabelas do sistema.

.ibz file :   Quando o produto **MySQL Enterprise Backup** realiza um **backup comprimido**, ele transforma cada **arquivo de espaço de tabelas** que é criado usando a configuração **file-per-table** de uma extensão `.ibd` para uma extensão `.ibz`.

A compressão aplicada durante o backup é distinta do **formato de linha comprimido** que mantém os dados da tabela comprimidos durante o funcionamento normal. Uma operação de backup comprimido ignora a etapa de compressão para um espaço de tabelas que já está no formato de linha comprimida, pois comprimir uma segunda vez desaceleraria o backup, mas produziria pouca ou nenhuma economia de espaço.

Veja também  backup comprimido,  formato de linha comprimido,  file-per-table,  arquivo ibdata,  MySQL Enterprise Backup,  espaço de tabelas.

I/O-bound :   Veja  disk-bound.

conjunto de arquivos ib-file :   O conjunto de arquivos gerenciados pelo `InnoDB` dentro de um banco de dados MySQL: o **espaço de tabelas do sistema**, arquivos de espaço de tabelas por arquivo, e arquivos de **log de revisão**. Dependendo da versão do MySQL e da configuração do `InnoDB`, também pode incluir arquivos de **espaço de tabelas geral**, **espaço de tabelas temporário** e **espaço de revisão** do **undo**. Este termo é às vezes usado em discussões detalhadas sobre as estruturas e formatos de arquivos do `InnoDB` para se referir ao conjunto de arquivos gerenciados pelo `InnoDB` dentro de um banco de dados MySQL.

Veja também  database,  file-per-table,  general tablespace,  log de revisão,  espaço de tabelas do sistema,  espaço de tabelas temporário,  espaço de revisão do **undo**.

ibbackup_logfile:   Um arquivo de backup suplementar criado pelo produto **MySQL Enterprise Backup** durante uma operação de **backup quente**. Ele contém informações sobre quaisquer alterações de dados que ocorreram enquanto o backup estava sendo executado. Os arquivos de backup iniciais, incluindo o `ibbackup_logfile`, são conhecidos como **backup bruto**, porque as alterações que ocorreram durante a operação de backup ainda não foram incorporadas. Após você realizar a etapa **aplicar** aos arquivos de backup brutos, os arquivos resultantes incluem essas alterações de dados finais e são conhecidos como **backup preparado**. Nesta etapa, o arquivo `ibbackup_logfile` não é mais necessário.

Veja também  aplicar,  backup quente,  MySQL Enterprise Backup,  backup preparado,  backup bruto.

arquivo ibdata:   Um conjunto de arquivos com nomes como `ibdata1`, `ibdata2` e assim por diante, que compõem o **espaço de tabelas do sistema** do **InnoDB**. Para informações sobre as estruturas e dados que residem nos arquivos `ibdata`, consulte a **Seção 17.6.3.1**, “O Espaço de Tabelas do Sistema”.

    O crescimento dos arquivos `ibdata` é influenciado pela opção de configuração **`innodb_autoextend_increment`**.

    Veja também  buffer de mudança,  dicionário de dados,  buffer de escrita dupla,  arquivo por tabela,  arquivo .ibd,  innodb_file_per_table,  espaço de tabelas do sistema,  registro de desfazer.

arquivo ibtmp:   O **arquivo de dados do espaço de tabelas temporário** do **InnoDB** para **tabelas temporárias** não compactadas e objetos relacionados. A opção de arquivo de configuração, **`innodb_temp_data_file_path`**, permite que os usuários definam um caminho relativo para o arquivo de dados do espaço de tabelas temporário. Se **`innodb_temp_data_file_path`** não for especificado, o comportamento padrão é criar um único arquivo de dados auto-extensível de 12 MB chamado `ibtmp1` no diretório de dados, ao lado do `ibdata1`.

    Veja também  arquivos de dados,  tabela temporária,  espaço de tabelas temporário.

ib\_logfile:   Um conjunto de arquivos, tipicamente nomeados `ib_logfile0` e `ib_logfile1`, que formam o **log de refazer**. Também às vezes referidos como o **grupo de log**. Esses arquivos registram declarações que tentam alterar dados em tabelas do `InnoDB`. Essas declarações são regravadas automaticamente para corrigir dados escritos por transações incompletas, ao inicializar após um crash.

Este dado não pode ser usado para recuperação manual; para esse tipo de operação, use o **log binário**.

Veja também  log binário,  grupo de log,  log de refazer.

ilist:   Dentro de um **índice FULLTEXT** do `InnoDB`, a estrutura de dados que consiste em um ID de documento e informações posicionais para um token (ou seja, uma palavra específica).

Veja também  índice FULLTEXT.

bloqueio de linha implícito:   Um bloqueio de linha que o `InnoDB` adquire para garantir a consistência, sem que você o solicite especificamente.

Veja também  bloqueio de linha.

banco de dados em memória:   Um tipo de sistema de banco de dados que mantém os dados na memória, para evitar o overhead devido ao I/O de disco e à tradução entre blocos de disco e áreas de memória. Alguns bancos de dados em memória sacrificam a durabilidade (o “D” na filosofia de design **ACID**) e são vulneráveis a falhas de hardware, energia e outros tipos de falhas, tornando-os mais adequados para operações de leitura apenas. Outros bancos de dados em memória usam mecanismos de durabilidade, como registrar alterações no disco ou usar memória não volátil.

Características do MySQL que abordam os mesmos tipos de processamento intensivos em memória incluem o **pool de buffers** do `InnoDB`, o **índice hash adaptativo** e a **otimização de transação de leitura apenas**, o **motor de armazenamento MEMORY**, o cache de chaves `MyISAM` e o cache de consultas MySQL.

Veja também  ACID,  índice hash adaptativo,  pool de buffers,  baseado em disco,  transação de leitura apenas.

backup incremental:   Um tipo de **backup quente**, realizado pelo produto **MySQL Enterprise Backup**, que apenas salva os dados alterados desde um determinado ponto no tempo. Ter um backup completo e uma sucessão de backups incrementais permite reconstruir os dados de backup por um longo período, sem o overhead de armazenamento de manter vários backups completos à mão. Você pode restaurar o backup completo e, em seguida, aplicar cada um dos backups incrementais em sucessão, ou pode manter o backup completo atualizado aplicando cada backup incremental a ele, e depois realizar uma única operação de restauração.

A granularidade dos dados alterados está no nível da **página**. Uma página pode, na verdade, cobrir mais de uma linha. Cada página alterada é incluída no backup.

Veja também  backup quente,  MySQL Enterprise Backup,  página.

índice:   Uma estrutura de dados que fornece uma capacidade de busca rápida para **linhas** de uma **tabela**, tipicamente formando uma estrutura de árvore (**árvore B**) que representa todos os valores de uma coluna específica ou conjunto de colunas.

As tabelas `InnoDB` sempre têm um **índice agrupado** que representa a **chave primária**. Elas também podem ter um ou mais **índices secundários** definidos em uma ou mais colunas. Dependendo de sua estrutura, os índices secundários podem ser classificados como **índices parciais**, **coluna** ou **compostos**.

Os índices são um aspecto crucial do **desempenho** da consulta. Os arquitetos de banco de dados projetam tabelas, consultas e índices para permitir buscas rápidas pelos dados necessários pelas aplicações. O design de banco de dados ideal usa um **índice coletor** onde é prático; os resultados da consulta são calculados inteiramente a partir do índice, sem ler os dados da tabela real. Cada **construtor de chave estrangeira** também requer um índice, para verificar eficientemente se os valores existem nas tabelas **pai** e **filho**.

Embora o índice em forma de árvore B seja o mais comum, um tipo diferente de estrutura de dados é usado para **índices de hash**, como no mecanismo de armazenamento `MEMORY` e no **índice de hash adaptativo** do `InnoDB`. Os índices **R-tree** são usados para indexação espacial de informações multidimensionais.

Veja também  índice de hash adaptativo,  índice em forma de árvore B,  tabela filho,  índice agrupado,  índice de coluna,  índice composto,  índice coberto,  chave estrangeira,  índice de hash,  tabela pai,  índice parcial,  chave primária,  consulta,  R-tree,  linha,  índice secundário,  tabela.

cache de índice:   Uma área de memória que armazena os dados do token para a pesquisa **full-text** completa do `InnoDB`. Ele armazena os dados para minimizar o I/O de disco quando os dados são inseridos ou atualizados em colunas que fazem parte de um **índice FULLTEXT**. Os dados do token são escritos no disco quando o cache de índice fica cheio. Cada índice `FULLTEXT` do `InnoDB` tem seu próprio cache de índice separado, cujo tamanho é controlado pela opção de configuração  `innodb_ft_cache_size`.

Veja também  pesquisa full-text,  índice FULLTEXT.

empurrar para baixo a condição do índice:  O empurrar para baixo da condição do índice (ICP) é uma otimização que empurra parte da condição `WHERE` para o mecanismo de armazenamento se partes da condição puderem ser avaliadas usando campos do **índice**. O ICP pode reduzir o número de vezes que o **mecanismo de armazenamento** deve acessar a tabela base e o número de vezes que o servidor MySQL deve acessar o mecanismo de armazenamento. Para mais informações, consulte  Seção 10.2.1.6, “Otimização de Empurrar para Baixo a Condição do Índice”.

Veja também  índice,  mecanismo de armazenamento.

sinal do índice:  Sintaxe SQL estendida para substituir os **índices** recomendados pelo otimizador. Por exemplo, as cláusulas `FORCE INDEX`, `USE INDEX` e `IGNORE INDEX`. Tipicamente usado quando as colunas indexadas têm valores distribuídos de forma desigual, resultando em estimativas de **cardinalidade** imprecisas.

Veja também  cardinalidade,  índice.

prefixo do índice:   Em um **índice** que se aplica a várias colunas (conhecido como **índice composto**), as colunas iniciais ou principais do índice. Uma consulta que faça referência às primeiras 1, 2, 3 e assim por diante colunas de um índice composto pode usar o índice, mesmo que a consulta não faça referência a todas as colunas do índice.

    Veja também  índice composto,  índice.

estatísticas do índice:   Veja  estatísticas.

registro mínimo:   Um **registro pseudo** em um **índice**, representando o **gap** abaixo do menor valor nesse índice. Se uma transação tiver uma instrução como `SELECT ... FROM ... WHERE col < 10 FOR UPDATE;`, e o menor valor na coluna for 5, é um bloqueio no registro mínimo que impede outras transações de inserir valores ainda menores, como 0, -10 e assim por diante.

    Veja também  gap,  índice,  registro pseudo,  registro máximo.

`INFORMATION_SCHEMA`:   O nome do **banco de dados** que fornece uma interface de consulta ao **dicionário de dados** do MySQL. (Esse nome é definido pelo padrão ANSI SQL.) Para examinar informações (metadados) sobre o banco de dados, você pode fazer consultas em tabelas como `INFORMATION_SCHEMA.TABLES` e `INFORMATION_SCHEMA.COLUMNS`, em vez de usar comandos `SHOW` que produzem saída não estruturada.

    O banco de dados `INFORMATION_SCHEMA` também contém tabelas específicas para **InnoDB** que fornecem uma interface de consulta ao dicionário de dados do `InnoDB`. Você usa essas tabelas não para ver como o banco de dados está estruturado, mas para obter informações em tempo real sobre o funcionamento das tabelas do `InnoDB` para ajudar no monitoramento de desempenho, ajuste e solução de problemas.

    Veja também  dicionário de dados,  banco de dados,  InnoDB.

InnoDB:   Um componente do MySQL que combina alto desempenho com capacidade **transacional** para confiabilidade, robustez e acesso concorrente. Ele incorpora a filosofia de design **ACID**. Representado como um **motor de armazenamento**, ele lida com tabelas criadas ou alteradas com a cláusula `ENGINE=INNODB`. Consulte o Capítulo 17, *O Motor de Armazenamento InnoDB* para detalhes arquitetônicos e procedimentos de administração, e a Seção 10.5, “Otimizando para Tabelas InnoDB” para conselhos de desempenho.

    Em MySQL 5.5 e superior, o `InnoDB` é o motor de armazenamento padrão para novas tabelas e a cláusula `ENGINE=INNODB` não é necessária.

    As tabelas `InnoDB` são idealmente adequadas para **backups rápidos**. Consulte a Seção 32.1, “Visão Geral do Backup Empresarial do MySQL” para informações sobre o produto **MySQL Enterprise Backup** para fazer backup de servidores MySQL sem interromper o processamento normal.

    Veja também ACID, backup rápido, MySQL Enterprise Backup, motor de armazenamento, transação.

innodb\_autoinc\_lock\_mode:   A opção `innodb_autoinc_lock_mode` controla o algoritmo usado para **bloqueio de autoincremento**. Quando você tem uma chave primária com autoincremento, você pode usar a replicação baseada em declarações apenas com o ajuste `innodb_autoinc_lock_mode=1`. Esse ajuste é conhecido como modo de bloqueio *consecutivo*, porque as inserções de múltiplas linhas dentro de uma transação recebem valores de autoincremento consecutivos. Se você tiver `innodb_autoinc_lock_mode=2`, que permite maior concorrência para operações de inserção, use a replicação baseada em linhas em vez da replicação baseada em declarações. Esse ajuste é conhecido como modo de bloqueio *intercalado*, porque múltiplas declarações de inserção de múltiplas linhas em execução ao mesmo tempo podem receber valores de **autoincremento** que são intercalados. O ajuste `innodb_autoinc_lock_mode=0` não deve ser usado, exceto por motivos de compatibilidade.

O modo de bloqueio consecutivo ( `innodb_autoinc_lock_mode=1`) é a configuração padrão antes do MySQL 8.0.3. A partir do MySQL 8.0.3, o modo de bloqueio intercalado ( `innodb_autoinc_lock_mode=2`) é a configuração padrão, o que reflete a mudança do tipo de replicação baseado em declarações para o baseado em linhas como o tipo de replicação padrão.

Veja também  auto-incremento,  bloqueio de auto-incremento,  inserção em modo misto,  chave primária.

innodb\_file\_per\_table :   Uma opção de configuração importante que afeta muitos aspectos do armazenamento de arquivos do `InnoDB`, da disponibilidade de recursos e das características de I/O. No MySQL 5.6.7 e versões posteriores, ela é habilitada por padrão. A opção  `innodb_file_per_table` habilita o modo **file-per-table**. Com esse modo habilitado, uma tabela `InnoDB` recém-criada e os índices associados podem ser armazenados em um arquivo **.ibd** por tabela, fora do **espaço de tabelas do sistema**.

Esta opção afeta o desempenho e as considerações de armazenamento para vários comandos SQL, como  `DROP TABLE` e  `TRUNCATE TABLE`.

Habilitar a opção  `innodb_file_per_table` permite que você aproveite recursos como a **compressão** de tabelas e backups de tabelas nomeadas no **MySQL Enterprise Backup**.

Para mais informações, consulte  `innodb_file_per_table` e  Seção 17.6.3.2, “Espaços de Tabelas File-Per-Table”.

Veja também  compressão,  file-per-table,  arquivo .ibd,  MySQL Enterprise Backup,  espaço de tabelas do sistema.

innodb\_lock\_wait\_timeout :   A opção  `innodb_lock_wait_timeout` define o equilíbrio entre **esperar** que os recursos compartilhados fiquem disponíveis ou **desistir** e lidar com o erro, tentar novamente ou realizar processamento alternativo em sua aplicação. Reverte qualquer transação `InnoDB` que espera mais de um tempo especificado para adquirir um **bloqueio**. Especialmente útil se **bloqueios** forem causados por atualizações em múltiplas tabelas controladas por diferentes motores de armazenamento; tais bloqueios não são **detectados** automaticamente.

Veja também  bloqueio,  detecção de bloqueio,  bloqueio,  espera.

innodb\_strict\_mode:   A opção `innodb_strict_mode` controla se o `InnoDB` opera no **modo estrito**, onde condições que normalmente são tratadas como avisos causam erros (e as instruções subjacentes falham).

Veja também  modo estrito.

Série de inovação:   As versões de lançamento com a mesma versão principal formam uma série de inovação. Por exemplo, MySQL 8.1 a 8.3 formam a série de inovação MySQL 8.

Veja também  Série LTS.

insert:   Uma das operações **DML** primárias em **SQL**. O desempenho das inserções é um fator chave em sistemas de **data warehouse** que carregam milhões de linhas em tabelas e em sistemas **OLTP** onde muitas conexões concorrentes podem inserir linhas na mesma tabela, em ordem arbitrária. Se o desempenho das inserções é importante para você, você deve aprender sobre os recursos do **InnoDB**, como o **buffer de inserção** usado no **bufferamento de alterações** e colunas de **auto-incremento**.

Veja também  auto-incremento,  bufferamento de alterações,  data warehouse,  DML,  InnoDB,  buffer de inserção,  OLTP,  SQL.

buffer de inserção:   O antigo nome do **buffer de alterações**. No MySQL 5.5, foi adicionado suporte para o bufferamento de alterações em páginas de índice secundário para operações de  `DELETE` e  `UPDATE`. Anteriormente, apenas as alterações resultantes de operações de  `INSERT` eram bufferadas. O termo preferido agora é *buffer de alterações*.

Veja também  buffer de alterações,  bufferamento de alterações.

bufferamento de inserção:   A técnica de armazenar alterações em páginas de índice secundário, resultantes de operações de  `INSERT`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O aleatório. É um dos tipos de **bufferamento de alterações**: os outros são **bufferamento de exclusão** e **bufferamento de purga**.

O bufferamento de inserção não é usado se o índice secundário for **único**, porque a unicidade dos novos valores não pode ser verificada antes que as novas entradas sejam escritas. Outros tipos de bufferamento de alterações funcionam para índices únicos.

Veja também  alterar buffer,  alterar bufferização,  deletar bufferização,  inserir buffer,  limpar bufferização,  índice único.

bloqueio de intenção de inserção:   Um tipo de **bloqueio de lacuna** que é definido pelas operações `INSERT` antes da inserção de uma linha. Esse tipo de **bloqueio** sinaliza a intenção de inserir de tal forma que várias transações que inserem no mesmo intervalo do índice não precisam esperar uma da outra se não estiverem inserindo na mesma posição dentro da lacuna. Para mais informações, consulte  Seção 17.7.1, “Bloqueio InnoDB”.

Veja também  bloqueio de lacuna,  bloqueio,  bloqueio de chave seguinte.

instância:   Um único daemon `mysqld` que gerencia um **diretório de dados** que representa um ou mais **bancos de dados** com um conjunto de **tabelas**. É comum em cenários de desenvolvimento, teste e **replicação** ter várias instâncias na mesma máquina **servidor**, cada uma gerenciando seu próprio diretório de dados e ouvindo em seu próprio port ou soquete. Com uma instância executando uma carga de trabalho **ligada a disco**, o servidor ainda pode ter capacidade de CPU e memória extra para executar instâncias adicionais.

Veja também  diretório de dados,  banco de dados,  ligado a disco,  mysqld,  replicação,  servidor,  tabela.

instrumentação:   Modificações no nível do código-fonte para coletar dados de desempenho para ajuste e depuração. No MySQL, os dados coletados pela instrumentação são expostos por meio de uma interface SQL usando as bases de dados `INFORMATION_SCHEMA` e `PERFORMANCE_SCHEMA`.

Veja também  `INFORMATION_SCHEMA`,  Performance Schema.

bloqueio de intenção exclusiva:   Veja  bloqueio de intenção.

bloqueio de intenção:   Um tipo de **bloqueio** que se aplica à tabela, usado para indicar o tipo de bloqueio que a **transação** pretende adquirir nas linhas da tabela. Diferentes transações podem adquirir diferentes tipos de bloqueios de intenção na mesma tabela, mas a primeira transação a adquirir um bloqueio *exclusivo de intenção* (IX) na tabela impede que outras transações adquiram quaisquer bloqueamentos S ou X na tabela. Por outro lado, a primeira transação a adquirir um bloqueio *compartilhado de intenção* (IS) na tabela impede que outras transações adquiram quaisquer bloqueamentos X na tabela. O processo de duas fases permite que os pedidos de bloqueio sejam resolvidos em ordem, sem bloquear bloqueamentos e operações correspondentes que sejam compatíveis. Para mais informações sobre esse mecanismo de bloqueio, consulte  Seção 17.7.1, “Bloqueio InnoDB”.

    Veja também  bloqueio,  modo de bloqueio,  bloqueio,  transação.

bloqueio de intenção compartilhado:   Veja  bloqueio de intenção.

intérprete:   Código para instrurar ou depurar algum aspecto de uma aplicação, que pode ser ativado sem recompilar ou alterar a fonte da própria aplicação.

    Veja também  intérprete de comando,  Connector/J,  Connector/NET,  intérprete de exceção.

tabela temporária intrínseca:   Uma tabela temporária interna otimizada do *InnoDB* usada pelo *opinião*.

    Veja também  opinião.

índice invertido:   Uma estrutura de dados otimizada para sistemas de recuperação de documentos, usada na implementação da **pesquisa de texto completo** do *InnoDB*. O **índice FULLTEXT** do *InnoDB*, implementado como um índice invertido, registra a posição de cada palavra dentro de um documento, em vez da localização de uma linha da tabela. Um único valor de coluna (um documento armazenado como uma string de texto) é representado por muitas entradas no índice invertido.

    Veja também  pesquisa de texto completo,  índice FULLTEXT,  ilist.

IOPS:  Abreviação para **operações de E/S por segundo**. Uma medida comum para sistemas ocupados, especialmente para aplicações **OLTP**. Se esse valor estiver próximo do máximo que os dispositivos de armazenamento podem lidar, o aplicativo pode se tornar **ligado ao disco**, limitando a **escalabilidade**.

Veja também  ligado ao disco,  OLTP,  escalabilidade.

nível de isolamento:  Um dos fundamentos do processamento de bancos de dados. O isolamento é o **I** na sigla **ACID**. O nível de isolamento é a configuração que ajusta o equilíbrio entre desempenho e confiabilidade, consistência e reprodutibilidade dos resultados quando múltiplas **transações** estão fazendo alterações e executando consultas ao mesmo tempo.

Da maior quantidade de consistência e proteção à menor, os níveis de isolamento suportados pelo InnoDB são: **SERIALIZÁVEL**, **LEIA COMITADA**, **LEIA COMITADA** e **LEIA NÃO COMITADA**.

Com tabelas de `InnoDB`, muitos usuários podem manter o nível de isolamento padrão (*LEIA COMITADA*) para todas as operações. Usuários experientes podem escolher o nível **LEIA COMITADA** à medida que ultrapassam os limites da escalabilidade com o processamento **OLTP**, ou durante operações de data warehousing onde inconsistências menores não afetam os resultados agregados de grandes quantidades de dados. Os níveis nas bordas (**SERIALIZÁVEL** e **LEIA NÃO COMITADA**) alteram o comportamento do processamento de tal forma que raramente são usados.

Veja também  ACID,  OLTP,  LEIA COMITADA,  LEIA NÃO COMITADA,  LEIA COMITADA,  SERIALIZÁVEL,  transação.

J2EE:   Plataforma Java, Edição Empresarial: A plataforma Java empresarial da Oracle. Ela consiste em uma API e um ambiente de execução para aplicações Java de classe empresarial. Para obter detalhes completos, consulte <http://www.oracle.com/technetwork/java/javaee/overview/index.html>. Com aplicações MySQL, você normalmente usa o **Connector/J** para acesso ao banco de dados e um servidor de aplicação como **Tomcat** ou **JBoss** para lidar com o trabalho do nível intermediário, e opcionalmente um framework como **Spring**. As funcionalidades relacionadas ao banco de dados frequentemente oferecidas dentro de uma pilha J2EE incluem um **pool de conexões** e suporte a **failover**.

Veja também  pool de conexões,  Connector/J,  failover,  Java,  JBoss,  Spring,  Tomcat.

Java:   Uma linguagem de programação que combina alto desempenho, recursos embutidos ricos e tipos de dados, mecanismos orientados a objetos, uma extensa biblioteca padrão e uma ampla gama de módulos de terceiros reutilizáveis. O desenvolvimento empresarial é suportado por muitos frameworks, servidores de aplicação e outras tecnologias. Grande parte de sua sintaxe é familiar para desenvolvedores de **C** e **C++**. Para escrever aplicações Java com MySQL, você usa o driver **JDBC** conhecido como **Connector/J**.

Veja também  C,  Connector/J,  C++,  JDBC.

JBoss:   Veja também  J2EE.

JDBC:   Abreviação de “Java Database Connectivity”, uma **API** para acesso ao banco de dados a partir de aplicações **Java**. Desenvolvedores Java que escrevem aplicações MySQL usam o componente **Connector/J** como seu driver JDBC.

Veja também  API,  Connector/J,  J2EE,  Java.

JNDI:   Veja também  Java.

join:   Uma **consulta** que recupera dados de mais de uma tabela, referenciando colunas nas tabelas que contêm valores idênticos. Idealmente, essas colunas fazem parte de uma relação de **chave estrangeira** `InnoDB`, que garante **integridade referencial** e que as colunas de junção estejam **indexadas**. Muitas vezes usada para economizar espaço e melhorar o desempenho da consulta, substituindo strings repetidas por IDs numéricos, em um design de dados **normalizado**.

Veja também  chave estrangeira,  índice,  normalizado,  consulta,  integridade referencial.

### K

KDC :   Veja  centro de distribuição de chaves.

centro de distribuição de chaves :   No Kerberos, o centro de distribuição de chaves compreende um servidor de autenticação (AS) e um servidor de emissão de ingressos (TGS).

    Veja também  servidor de autenticação,  ingressos de ticket.

keystore :   Veja também  SSL.

KEY\_BLOCK\_SIZE :   Uma opção para especificar o tamanho das páginas de dados dentro de uma tabela `InnoDB` que usa o **formato de linha compactado**. O padrão é de 8 kilobytes. Valores menores correm o risco de atingir limites internos que dependem da combinação do tamanho da linha e da porcentagem de compressão.

    Para tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para blocos de chaves de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor de `KEY_BLOCK_SIZE` em nível de tabela.

    Veja também  formato de linha compactado.

### L

latch :   Uma estrutura leve usada pelo `InnoDB` para implementar um **bloqueio** para suas próprias estruturas de memória interna, tipicamente mantido por um breve período medido em milissegundos ou microsegundos. Um termo geral que inclui tanto **mutxos** (para acesso exclusivo) quanto **bloqueios de leitura/escrita** (para acesso compartilhado). Certos latches são o foco do ajuste de desempenho do `InnoDB`. Estatísticas sobre o uso de latches e contenda estão disponíveis através da interface **Performance Schema**.

    Veja também  bloqueio,  bloqueio,  mutex,  Performance Schema,  rw-lock.

libmysql :   Nome informal para a biblioteca **libmysqlclient**.

    Veja também  libmysqlclient.

libmysqlclient :   O arquivo da biblioteca, nomeado `libmysqlclient.a` ou `libmysqlclient.so`, que é tipicamente vinculado em programas **cliente** escritos em **C**. Às vezes conhecido informalmente como **libmysql** ou a biblioteca **mysqlclient**.

    Veja também  cliente,  libmysql,  mysqlclient.

libmysqld:   Esta biblioteca de servidor MySQL **incorporada** permite executar um servidor MySQL completo dentro de uma **aplicação cliente**. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações incorporadas. Você se vincula com a biblioteca `libmysqld` em vez de **libmysqlclient**. A API é idêntica entre essas três bibliotecas.

Veja também  cliente,  incorporado,  libmysql,  libmysqlclient.

interceptor de ciclo de vida:   Um tipo de **interceptor** suportado pelo **Connector/J**. Envolve a implementação da interface `com.mysql.jdbc.ConnectionLifecycleInterceptor`.

Veja também  Connector/J,  interceptor.

lista:   O **pool de buffers** do **InnoDB** é representado como uma lista de **páginas** de memória. A lista é reorganizada à medida que novas páginas são acessadas e entram no pool de buffers, à medida que páginas dentro do pool de buffers são acessadas novamente e são consideradas mais recentes, e à medida que páginas que não são acessadas por um longo tempo são **expulsas** do pool de buffers. O pool de buffers é dividido em **sublistas**, e a política de substituição é uma variação da técnica familiar **LRU** (Least Recently Used).

Veja também  pool de buffers,  expulsão,  LRU,  página,  sublista.

balanceamento de carga:   Uma técnica para escalar conexões de leitura apenas enviando solicitações de consulta para diferentes servidores escravos em uma configuração de replicação ou Cluster. Com o **Connector/J**, o balanceamento de carga é ativado através da classe `com.mysql.jdbc.ReplicationDriver` e controlado pela propriedade de configuração `loadBalanceStrategy`.

Veja também  Connector/J,  J2EE.

localhost:   Veja também  conexão.

bloqueio:   A noção de alto nível de um objeto que controla o acesso a um recurso, como uma tabela, linha ou estrutura de dados interna, como parte de uma **estratégia de bloqueio**. Para o ajuste de desempenho intensivo, você pode se aprofundar nas estruturas reais que implementam bloqueios, como **mutexos** e **latches**.

Veja também  latch,  modo de bloqueio,  bloqueio,  mutex.

escalonamento de bloqueio:   Uma operação usada em alguns sistemas de banco de dados que converte muitos **bloques de linha** em um único **bloqueio de tabela**, economizando espaço de memória, mas reduzindo o acesso concorrente à tabela. O `InnoDB` usa uma representação eficiente em termos de espaço para blocos de linha, de modo que o **escalonamento de bloqueio** não é necessário.

Veja também  bloqueio,  bloqueio de linha,  bloqueio de tabela.

modo de bloqueio:   Um **bloqueio compartilhado (S)** permite que uma **transação** leia uma linha. Múltiplas transações podem adquirir um bloqueio S na mesma linha ao mesmo tempo.

Um **bloqueio exclusivo (X)** permite que uma transação atualize ou exclua uma linha. Nenhuma outra transação pode adquirir qualquer tipo de bloqueio na mesma linha ao mesmo tempo.

Os **blocos de intenção** se aplicam à tabela e são usados para indicar que tipo de bloqueio a transação pretende adquirir nas linhas da tabela. Diferentes transações podem adquirir diferentes tipos de blocos de intenção na mesma tabela, mas a primeira transação a adquirir um bloqueio exclusivo de intenção (IX) na tabela impede que outras transações adquiram quaisquer blocos S ou X na tabela. Por outro lado, a primeira transação a adquirir um bloqueio de intenção compartilhado (IS) na tabela impede que outras transações adquiram quaisquer blocos X na tabela. O processo de duas fases permite que as solicitações de bloqueio sejam resolvidas em ordem, sem bloquear blocos e operações correspondentes que sejam compatíveis.

Veja também  bloqueio de intenção,  bloqueio,  bloqueio,  transação.

bloqueio:   O sistema de proteção de uma **transação** para não ver ou alterar dados que estão sendo consultados ou alterados por outras transações. A estratégia de **bloqueio** deve equilibrar a confiabilidade e a consistência das operações de banco de dados (os princípios da filosofia **ACID**) contra o desempenho necessário para uma boa **concorrência**. O ajuste fino da estratégia de bloqueio muitas vezes envolve a escolha de um **nível de isolamento** e garantir que todas as suas operações de banco de dados sejam seguras e confiáveis para esse nível de isolamento.

Veja também  ACID,  concorrência,  nível de isolamento,  bloqueio,  transação.

bloqueio de leitura:   Uma instrução `SELECT` que também realiza uma operação de **bloqueio** em uma tabela `InnoDB`. Pode ser `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. Tem o potencial de gerar um **empatiamento**, dependendo do **nível de isolamento** da transação. O oposto de uma **leitura não bloqueante**. Não é permitido para tabelas globais em uma **transação apenas de leitura**.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja  Seção 17.7.2.4, “Bloqueios de Leitura”.

Veja também  empatiamento,  nível de isolamento,  bloqueio,  leitura não bloqueante,  transação apenas de leitura.

buffer de log:   A área de memória que contém dados para serem escritos nos **arquivos de log** que compõem o **arquivo de log de reescrita**. É controlada pela opção de configuração  `innodb_log_buffer_size`.

Veja também  arquivo de log,  arquivo de log de reescrita.

arquivo de log:   Um dos arquivos **ib\_logfile*`N`*** que compõem o **arquivo de log de reescrita**. Os dados são escritos nesses arquivos a partir da área de memória **buffer de log**.

Veja também  ib\_logfile,  buffer de log,  arquivo de log de reescrita.

grupo de logs:   O conjunto de arquivos que compõem o **log de refazer**, tipicamente nomeados `ib_logfile0` e `ib_logfile1`. (Por esse motivo, às vezes referidos coletivamente como **ib\_logfile**.)

    Veja também  ib\_logfile,  log de refazer.

lógico:   Um tipo de operação que envolve aspectos de alto nível e abstratos, como tabelas, consultas, índices e outros conceitos SQL. Tipicamente, os aspectos lógicos são importantes para tornar a administração de bancos de dados e o desenvolvimento de aplicações convenientes e utilizáveis. Contrasta com **físico**.

    Veja também  backup lógico,  físico.

backup lógico:   Um **backup** que reproduz a estrutura e os dados da tabela, sem copiar os arquivos de dados reais. Por exemplo, o comando **`mysqldump`** produz um backup lógico, porque sua saída contém instruções como  `CREATE TABLE` e  `INSERT` que podem recriar os dados. Contrasta com **backup físico**. Um backup lógico oferece flexibilidade (por exemplo, você poderia editar definições de tabelas ou inserir instruções antes de restaurar), mas pode levar substancialmente mais tempo para **restaurar** do que um backup físico.

    Veja também  backup,  mysqldump,  backup físico,  restaurar.

loose_:   Um prefixo adicionado às opções de configuração do `InnoDB` após o **início do servidor**, para que quaisquer novas opções de configuração não reconhecidas pelo nível atual do MySQL não causem uma falha de inicialização. O MySQL processa opções de configuração que começam com este prefixo, mas emite um aviso em vez de uma falha se a parte após o prefixo não for uma opção reconhecida.

    Veja também  início.

limite de vazão:   Um valor que representa um limite inferior, tipicamente um valor de threshold em que alguma ação corretiva começa ou se torna mais agressiva. Contrasta com **limite máximo**.

    Veja também  limite máximo.

LRU: Um acrônimo para "menos recentemente usado", um método comum para gerenciar áreas de armazenamento. Os itens que não foram usados recentemente são **expulsos** quando há espaço necessário para cachear itens mais recentes. O `InnoDB` usa o mecanismo LRU por padrão para gerenciar as **páginas** dentro do **pool de buffers**, mas faz exceções em casos em que uma página pode ser lida apenas uma única vez, como durante uma **pesquisa completa de tabela**. Essa variação do algoritmo LRU é chamada de **estratégia de inserção no ponto médio**. Para mais informações, consulte a Seção 17.5.1, “Pool de Buffers”.

Veja também  pool de buffers,  expulsão,  pesquisa completa de tabela,  estratégia de inserção no ponto médio,  página.

LSN: Um acrônimo para “número de sequência de log”. Esse valor arbitrário e sempre crescente representa um ponto no tempo correspondente às operações registradas no **log de refazer**. (Esse ponto no tempo é independente dos limites da **transação**: pode ocorrer no meio de uma ou mais transações.) Ele é usado internamente pelo `InnoDB` durante a **recuperação após falha** e para gerenciar o **pool de buffers**.

Antes do MySQL 5.6.3, o LSN era um inteiro unsigned de 4 bytes. O LSN se tornou um inteiro unsigned de 8 bytes no MySQL 5.6.3 quando o limite do tamanho do arquivo de log de refazer aumentou de 4GB para 512GB, pois bytes adicionais eram necessários para armazenar informações de tamanho extra. Aplicações construídas no MySQL 5.6.3 ou posterior que usam valores de LSN devem usar variáveis de 64 bits em vez de 32 bits para armazenar e comparar valores de LSN.

No produto **MySQL Enterprise Backup**, você pode especificar um LSN para representar o ponto no tempo a partir do qual fazer um **backup incremental**. O LSN relevante é exibido pelo resultado do comando `mysqlbackup`. Uma vez que você tenha o LSN correspondente ao momento de um backup completo, você pode especificar esse valor para fazer um backup incremental subsequente, cuja saída contém outro LSN para o próximo backup incremental.

Veja também  pool de buffers,  recuperação após falha,  backup incremental,  MySQL Enterprise Backup,  log de refazer,  transação.

Série LTS: As versões LTS (Long Term Support) com o mesmo número de versão principal formam uma série LTS. Por exemplo, todas as versões do MySQL 8.4.x formam a série MySQL 8.4 LTS.

    Nota: O MySQL 8.0 é uma série Bugfix que precediu o modelo de lançamento LTS.

    Veja também  Série de Inovação.

### M

.MRG arquivo:   Um arquivo que contém referências a outras tabelas, usado pelo motor de armazenamento `MERGE`. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja também  MySQL Enterprise Backup,  comando mysqlbackup.

.MYD arquivo:   Um arquivo que o MySQL usa para armazenar dados para uma tabela `MyISAM`.

    Veja também  arquivo .MYI,  MySQL Enterprise Backup,  comando mysqlbackup.

.MYI arquivo:   Um arquivo que o MySQL usa para armazenar índices para uma tabela `MyISAM`.

    Veja também  arquivo .MYD,  MySQL Enterprise Backup,  comando mysqlbackup.

master:   Veja  fonte.

thread master:   Um **thread** `InnoDB` que realiza várias tarefas em segundo plano. A maioria dessas tarefas são relacionadas a I/O, como escrever alterações do **buffer de alterações** para os índices secundários apropriados.

    Para melhorar a **concorrência**, às vezes as ações são movidas do thread master para threads de segundo plano separados. Por exemplo, no MySQL 5.6 e versões superiores, as **páginas sujas** são **limpos** do **pool de buffers** pelo thread **limpeza de páginas**, em vez do thread master.

    Veja também  pool de buffers,  buffer de alterações,  concorrência,  página suja,  limpeza,  thread.

MDL:   Abreviação de “bloco de metadados”.

    Veja também  bloco de metadados.

medium trust:   Símbolo de **confiança parcial**. Como a gama de configurações de confiança é tão ampla, a expressão "confiança parcial" é preferida, para evitar a implicação de que existem apenas três níveis (baixo, médio e total).

    Veja também  Connector/NET,  confiança parcial.

memcached:   Um componente popular de muitos conjuntos de software MySQL e **NoSQL**, permitindo leituras e escritas rápidas para valores únicos e armazenando os resultados inteiramente na memória. Tradicionalmente, as aplicações precisavam de lógica adicional para escrever os mesmos dados em um banco de dados MySQL para armazenamento permanente, ou para ler dados de um banco de dados MySQL quando ainda não estavam em cache na memória. Agora, as aplicações podem usar o simples protocolo **memcached**, suportado por bibliotecas de cliente para muitos idiomas, para se comunicar diretamente com servidores MySQL usando tabelas `NDB`. Essas interfaces **NoSQL** para tabelas MySQL permitem que as aplicações alcancem um desempenho de leitura e escrita maior do que ao emitir instruções SQL diretamente, e podem simplificar a lógica da aplicação e as configurações de implantação para sistemas que já incorporam **memcached** para cacheamento em memória.

    Veja também  NoSQL.

merge:   Para aplicar alterações aos dados armazenados em cache na memória, como quando uma página é trazida para o **pool de buffers**, e quaisquer alterações aplicáveis gravadas no **buffer de alterações** são incorporadas à página no pool de buffers. Os dados atualizados são eventualmente escritos ao **tablespace** pelo mecanismo de **flush**.

    Veja também  pool de buffers,  buffer de alterações,  flush,  tablespace.

bloqueio de metadados:   Um tipo de **bloqueio** que impede operações **DDL** em uma tabela que está sendo usada ao mesmo tempo por outra **transação**. Para detalhes, consulte  Seção 10.11.4, “Bloqueio de Metadados”.

    As melhorias nas operações **online**, particularmente no MySQL 5.6 e versões superiores, focam em reduzir a quantidade de bloqueio de metadados. O objetivo é que as operações DDL que não alterem a estrutura da tabela (como `CREATE INDEX` e `DROP INDEX` para tabelas `InnoDB`) possam prosseguir enquanto a tabela está sendo consultada, atualizada, etc., por outras transações.

    Veja também  DDL,  bloqueio,  online,  transação.

métrica de contagem:   Uma funcionalidade implementada na tabela `INNODB_METRICS` no **`INFORMATION_SCHEMA`**, no MySQL 5.6 e versões posteriores. Você pode consultar **contagens** e totais para operações de nível baixo do `InnoDB` e usar os resultados para ajustes de desempenho em combinação com dados do **`Performance Schema`**.

Veja também  contagem,  `INFORMATION_SCHEMA`,  `Performance Schema`.

estratégia de inserção de ponto médio:   A técnica de trazer inicialmente **páginas** para o **pool de buffers** do `InnoDB` não no extremo "mais novo" da lista, mas em algum lugar no meio. O local exato desse ponto pode variar, com base na configuração da opção `innodb_old_blocks_pct`. A intenção é que páginas que são lidas apenas uma vez, como durante uma **pesquisa completa de tabela**, possam ser excluídas do pool de buffers mais cedo do que com um algoritmo **LRU** estrito. Para mais informações, consulte a Seção 17.5.1, “Pool de Buffers”.

Veja também  pool de buffers,  pesquisa completa de tabela,  LRU,  página.

mini-transação:   Uma fase interna do processamento do `InnoDB`, quando são feitas alterações no nível **físico** das estruturas de dados durante operações de **DML**. Uma mini-transação (mtr) não tem noção de **rollback**; várias mini-transações podem ocorrer dentro de uma única **transação**. Mini-transações escrevem informações no **log de recuperação de falha** que são usadas durante a **recuperação de falha**. Uma mini-transação também pode ocorrer fora do contexto de uma transação regular, por exemplo, durante o processamento de **purga** por threads de segundo plano.

Veja também  commit,  recuperação de falha,  DML,  físico,  purga,  log de recuperação de falha,  rollback,  transação.

inserção em modo misto:   Uma instrução `INSERT` onde os valores de **auto-incremento** são especificados para algumas, mas não para todas, das novas linhas. Por exemplo, uma `INSERT` de múltiplos valores pode especificar um valor para a coluna de auto-incremento em alguns casos e `NULL` em outros casos. O `InnoDB` gera valores de auto-incremento para as linhas onde o valor da coluna foi especificado como `NULL`. Outro exemplo é uma instrução `INSERT ... ON DUPLICATE KEY UPDATE`, onde os valores de auto-incremento podem ser gerados, mas não utilizados, para quaisquer linhas duplicadas que sejam processadas como instruções `UPDATE` em vez de `INSERT`.

Pode causar problemas de consistência entre os **servidores de origem** e **replica** em uma **configuração de replicação**. Pode exigir ajustes no valor da opção de configuração **innodb\_autoinc\_lock\_mode**.

Veja também  auto-incremento,  innodb\_autoinc\_lock\_mode,  replica,  replicação,  origem.

MM.MySQL :   Um driver JDBC mais antigo para MySQL que evoluiu para o **Connector/J** quando foi integrado ao produto MySQL.

Veja também  Connector/J.

Mono :   Uma estrutura de código aberto desenvolvida pela Novell, que funciona com aplicações **Connector/NET** e **C#** em plataformas Linux.

Veja também  Connector/NET,  C#.

mtr :   Veja  mini-transaction.

multi-core :   Um tipo de processador que pode aproveitar programas multithread, como o servidor MySQL.

controle de concorrência multiversão :   Veja  MVCC.

mutex :   Abreviação informal para “variável de mutex”. (O próprio mutex é a abreviação de “exclusão mútua”.) O objeto de nível baixo que o `InnoDB` usa para representar e impor **blocos de acesso exclusivo** a estruturas de dados internas em memória. Uma vez que o bloqueio é adquirido, qualquer outro processo, thread, etc., é impedido de adquirir o mesmo bloqueio. Em contraste com os **blocos de leitura/escrita** (rw-locks), que o `InnoDB` usa para representar e impor **blocos de acesso compartilhado** a estruturas de dados internas em memória. Os mutexes e os blocos de leitura/escrita são conhecidos coletivamente como **latches**.

Veja também  latch,  lock,  Schema de desempenho,  Pthreads,  rw-lock.

MVCC :   Abreviação de “controle de concorrência multiversão”. Essa técnica permite que as **transações** do `InnoDB` com certos **níveis de isolamento** realizem operações de **leitura consistente**, ou seja, para consultar linhas que estão sendo atualizadas por outras transações e ver os valores antes que essas atualizações ocorressem. Essa é uma técnica poderosa para aumentar a **concorrência**, permitindo que as consultas prossigam sem esperar devido aos **lås** mantidos pelas outras transações.

Essa técnica não é universal no mundo dos bancos de dados. Alguns outros produtos de banco de dados e outros motores de armazenamento do MySQL não a suportam.

Veja também  ACID,  concorrência,  leitura consistente,  nível de isolamento,  lås,  transação.

my.cnf :   O nome, em sistemas Unix ou Linux, do **arquivo de opções** do MySQL.

    Veja também  my.ini,  arquivo de opções.

my.ini :   O nome, em sistemas Windows, do **arquivo de opções** do MySQL.

    Veja também  my.cnf,  arquivo de opções.

Drivers MyODBC :   Nome obsoleto para **Connector/ODBC**.

    Veja também  Connector/ODBC.

mysql :   O programa `mysql` é o interpretador de linha de comando para o banco de dados MySQL. Ele processa **instruções SQL** e também comandos específicos do MySQL, como  `SHOW TABLES`, enviando solicitações ao daemon  `mysqld`.

    Veja também  mysqld,  SQL.

comando mysqlbackup :   Uma ferramenta de linha de comando do produto **MySQL Enterprise Backup**. Ele realiza uma operação de **backup quente** para tabelas do `InnoDB` e um backup **quente** para tabelas do  `MyISAM` e outros tipos de tabelas. Veja a Seção 32.1, “Visão geral do MySQL Enterprise Backup” para mais informações sobre esse comando.

    Veja também  backup quente,  MySQL Enterprise Backup,  backup quente.

mysqlclient :   O nome informal para a biblioteca implementada pelo arquivo **libmysqlclient**, com extensão `.a` ou `.so`.

    Veja também  libmysqlclient.

mysqld:    `mysqld`, também conhecido como MySQL Server, é um único programa multithread que realiza a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL, que contém bancos de dados, tabelas e outras informações, como arquivos de log e arquivos de status.

`mysqld` funciona como um daemon Unix ou serviço do Windows, aguardando constantemente por solicitações e realizando tarefas de manutenção em segundo plano.

Veja também  instance,  mysql.

MySQLdb:   O nome do módulo **Python** de código aberto que forma a base da **API Python** do MySQL.

Veja também  Python,  API Python.

mysqldump:   Um comando que realiza um **backup lógico** de uma combinação de bancos de dados, tabelas e dados de tabelas. Os resultados são instruções SQL que reproduzem os objetos de esquema originais, os dados ou ambos. Para grandes quantidades de dados, uma solução de **backup físico**, como o **MySQL Enterprise Backup**, é mais rápida, especialmente para a operação de **restauração**.

Veja também  backup lógico,  MySQL Enterprise Backup,  backup físico,  restauração.

### N

.NET:   Veja também  ADO.NET,  ASP.net,  Connector/NET,  Mono,  Visual Studio.

API C nativa:   Sinônimo de **libmysqlclient**.

Veja também  libmysql.

chave natural:   Uma coluna indexada, tipicamente uma **chave primária**, onde os valores têm algum significado no mundo real. Geralmente é desaconselhável porque:

* Se o valor mudar, pode haver uma grande quantidade de manutenção de índice para reposicionar o **índice agrupado** e atualizar as cópias do valor da chave primária que são repetidas em cada **índice secundário**.
* Mesmo valores aparentemente estáveis podem mudar de maneiras imprevisíveis, que são difíceis de representar corretamente no banco de dados. Por exemplo, um país pode se tornar dois ou vários, tornando o código original do país obsoleto. Ou, as regras sobre valores únicos podem ter exceções. Por exemplo, mesmo que os IDs dos contribuintes sejam destinados a serem únicos para uma única pessoa, um banco de dados pode ter que lidar com registros que violam essa regra, como em casos de roubo de identidade. Os IDs dos contribuintes e outros números de identificação sensíveis também não são boas chaves primárias, porque podem precisar ser protegidos, criptografados e tratados de maneira diferente de outras colunas.

Assim, é geralmente melhor usar valores numéricos arbitrários para formar uma **chave sintética**, por exemplo, usando uma coluna de **autoincremento**.

Veja também  autoincremento,  índice agrupado,  chave primária,  índice secundário,  chave sintética.

página vizinha:  Qualquer **página** na mesma **extensão** que uma página específica. Quando uma página é selecionada para ser **flush**, quaisquer páginas vizinhas que estejam **sujas** são tipicamente flushadas também, como uma otimização de I/O para discos rígidos tradicionais. Em MySQL 5.6 e superior, esse comportamento pode ser controlado pela variável de configuração  `innodb_flush_neighbors`; você pode desativar essa configuração para unidades SSD, que não têm o mesmo overhead para escrever lotes menores de dados em locais aleatórios.

Veja também  página suja,  extensão,  flush,  página.

bloqueio de próxima chave:  Uma combinação de um **bloqueio de registro** no registro do índice e um **bloqueio de lacuna** antes do registro do índice.

Veja também  bloqueio de lacuna,  bloqueio,  bloqueio de registro.

leitura não bloqueante:   Uma **consulta** que não utiliza as cláusulas `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. O único tipo de consulta permitido para tabelas globais em uma **transação apenas de leitura**. O oposto de uma **leitura bloqueante**. Veja  Seção 17.7.2.3, “Leitura Não Bloqueante Consistente”.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja também  leitura bloqueante,  consulta,  transação apenas de leitura.

leitura não repetitiva:   A situação em que uma consulta recupera dados, e uma consulta posterior dentro da mesma **transação** recupera os mesmos dados, mas as consultas retornam resultados diferentes (alterados por outra transação que se compromete no meio do caminho).

Esse tipo de operação vai contra o princípio **ACID** do design de banco de dados. Dentro de uma transação, os dados devem ser consistentes, com relações previsíveis e estáveis.

Entre os diferentes **níveis de isolamento**, as leituras não repetitivas são impedidas pelos níveis **leitura serializável** e **leitura repetitiva**, e permitidas pelos níveis **leitura consistente** e **leitura não comprometida**.

Veja também  ACID,  leitura consistente,  nível de isolamento,  LEITURA NÃO COMPROMETIDA,  LEITURA REPETÍVEL,  SERIALIZÁVEL,  transação.

I/O não bloqueante:   Um termo da indústria que significa o mesmo que **I/O assíncrono**.

Veja também  I/O assíncrono.

normalizado:   Uma estratégia de design de banco de dados onde os dados são divididos em múltiplas tabelas, e os valores duplicados condensados em linhas únicas representadas por um ID, para evitar armazenar, consultar e atualizar valores redundantes ou longos. É tipicamente usado em aplicações **OLTP**.

Por exemplo, um endereço pode receber um ID único, para que um banco de dados de censo possa representar a relação **mora no endereço** associando esse ID a cada membro de uma família, em vez de armazenar múltiplas cópias de um valor complexo como **123 Main Street, Anytown, USA**.

Para outro exemplo, embora um aplicativo simples de catálogo de endereços possa armazenar cada número de telefone na mesma tabela que o nome e o endereço de uma pessoa, um banco de dados de uma empresa de telefonia pode atribuir a cada número de telefone uma ID especial e armazenar os números e as IDs em uma tabela separada. Essa representação normalizada pode simplificar as atualizações em larga escala quando os códigos de área se separam.

A normalização nem sempre é recomendada. Dados que são principalmente consultados e atualizados apenas excluindo e recarregando completamente são frequentemente mantidos em tabelas menores e maiores com cópias redundantes de valores duplicados. Essa representação de dados é referida como **denormalizada** e é frequentemente encontrada em aplicações de data warehousing.

Veja também  denormalizada,  chave estrangeira,  OLTP,  relacional.

NoSQL:   Um termo amplo para um conjunto de tecnologias de acesso a dados que não usam a linguagem **SQL** como seu mecanismo primário para leitura e escrita de dados. Algumas tecnologias NoSQL atuam como lojas de valores chave-valor, aceitando apenas leituras e escritas de um valor único; outras relaxam as restrições da metodologia **ACID**; outras ainda não requerem um **esquema** pré-planejado. Usuários do MySQL podem combinar o processamento em estilo NoSQL para velocidade e simplicidade com operações SQL para flexibilidade e conveniência, usando a API **memcached** para acessar diretamente alguns tipos de tabelas do MySQL.

Veja também  ACID,  memcached,  esquema,  SQL.

Restrição NOT NULL:   Um tipo de **contingência** que especifica que uma **coluna** não pode conter quaisquer valores **NULL**. Ela ajuda a preservar a **integridade referencial**, pois o servidor de banco de dados pode identificar dados com valores ausentes errôneos. Ela também ajuda na aritmética envolvida na otimização de consultas, permitindo que o otimizador preveja o número de entradas em um índice naquela coluna.

Veja também  coluna,  contingência,  NULL,  chave primária,  integridade referencial.

NULL:   Um valor especial em **SQL**, indicando a ausência de dados. Qualquer operação aritmética ou teste de igualdade envolvendo um valor `NULL`, por sua vez, produz um resultado `NULL`. (Assim, é semelhante ao conceito de NaN (Not a Number) do IEEE, "não é um número".) Qualquer cálculo agregado, como `AVG()`, ignora linhas com valores `NULL`, ao determinar quantos registros dividir. O único teste que funciona com valores `NULL` usa os idiomas SQL `IS NULL` ou `IS NOT NULL`.

Os valores `NULL` desempenham um papel nas operações de **índice**, porque, para o desempenho, um banco de dados deve minimizar o overhead de manter o rastreamento de valores de dados ausentes. Tipicamente, valores `NULL` não são armazenados em um índice, porque uma consulta que testa uma coluna indexada usando um operador de comparação padrão nunca poderia corresponder a uma linha com um valor `NULL` para aquela coluna. Por essa mesma razão, índices únicos não impedem valores `NULL`; esses valores simplesmente não são representados no índice. Declarar uma restrição `NOT NULL` em uma coluna fornece a garantia de que não há linhas excluídas do índice, permitindo uma melhor otimização de consultas (contagem precisa de linhas e estimativa de se usar o índice).

Como a **chave primária** deve ser capaz de identificar de forma única cada linha na tabela, uma chave primária de uma única coluna não pode conter quaisquer valores `NULL`, e uma chave primária de múltiplas colunas não pode conter quaisquer linhas com valores `NULL` em todas as colunas.

Embora o banco de dados Oracle permita que um valor `NULL` seja concatenado com uma string, o **InnoDB** trata o resultado de tal operação como `NULL`.

Veja também  índice,  chave primária,  SQL.

### O

.OPT arquivo:   Um arquivo contendo informações de configuração do banco de dados. Arquivos com essa extensão são incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

Veja também  MySQL Enterprise Backup,  comando mysqlbackup.

ODBC: Abreviação para Conectividade de Banco de Dados Aberto, uma API padrão da indústria. Tipicamente usada com servidores baseados em Windows ou aplicações que exigem ODBC para se comunicar com o MySQL. O driver ODBC do MySQL é chamado de **Connector/ODBC**.

Veja também  Connector/ODBC.

Coluna fora da página:   Uma coluna que contém dados de comprimento variável (como `BLOB` e `VARCHAR`) que são muito longos para caber em uma **árvore B** (B-tree). Os dados são armazenados em **páginas de overflow**. O formato de linha **DINÂMICO** é mais eficiente para esse armazenamento do que o formato de linha **COMPACT** mais antigo.

Veja também  árvore B,  formato de linha compacto,  formato de linha dinâmico,  página de overflow.

OLTP: Abreviação para "Processamento de Transações Online". Um sistema de banco de dados ou uma aplicação de banco de dados que executa uma carga de trabalho com muitas **transações**, com escritas e leituras frequentes, geralmente afetando pequenas quantidades de dados de cada vez. Por exemplo, um sistema de reserva de companhias aéreas ou uma aplicação que processa depósitos bancários. Os dados podem ser organizados em forma **normalizada** para um equilíbrio entre a eficiência da **DML** (inserção/atualização/exclusão) e a eficiência da **consulta**. Contrasta com **data warehouse**.

Com seu **bloqueio de nível de linha** e capacidade **transacional**, o **InnoDB** é o motor de armazenamento ideal para tabelas do MySQL usadas em aplicações OLTP.

Veja também  data warehouse,  DML,  InnoDB,  consulta,  bloqueio de linha,  transação.

online:   Um tipo de operação que não envolve tempo de inatividade, bloqueio ou operação restrita para o banco de dados. Tipicamente aplicado a **DDL**. Operações que reduzem os períodos de operação restrita, como a **criação rápida de índice**, evoluíram para um conjunto mais amplo de operações **DDL online** no MySQL 5.6.

No contexto de backups, um **backup online** é uma operação online e um **backup quente** é parcialmente uma operação online.

Veja também  DDL,  Criação Rápida de Índice,  backup online,  DDL online,  backup quente.

online DDL:   Uma funcionalidade que melhora o desempenho, a concorrência e a disponibilidade das tabelas `InnoDB` durante as operações **DDL** (principalmente `ALTER TABLE`). Consulte a Seção 17.12, “InnoDB e DDL Online” para obter detalhes.

Os detalhes variam de acordo com o tipo de operação. Em alguns casos, a tabela pode ser modificada de forma concorrente enquanto a operação `ALTER TABLE` está em andamento. A operação pode ser realizada sem uma cópia da tabela ou usando um tipo de cópia de tabela especialmente otimizado. O uso do espaço de log de DML para operações in-place é controlado pela opção de configuração `innodb_online_alter_log_max_size`.

Esta funcionalidade é uma melhoria da funcionalidade **Criação de Índices Rápida** no MySQL 5.5.

Veja também DDL, Criação de Índices Rápida, online.

optimistic:   Uma metodologia que orienta as decisões de implementação de baixo nível para um sistema de banco de dados relacional. Os requisitos de desempenho e **concorrência** em um banco de dados relacional significam que as operações devem ser iniciadas ou despachadas rapidamente. Os requisitos de consistência e **integridade referencial** significam que qualquer operação pode falhar: uma transação pode ser revertida, uma operação **DML** pode violar uma restrição, uma solicitação de bloqueio pode causar um impasse, um erro de rede pode causar um timeout. Uma estratégia otimista é aquela que assume que a maioria das solicitações ou tentativas terá sucesso, de modo que relativamente pouco trabalho é feito para se preparar para o caso de falha. Quando essa suposição é verdadeira, o banco de dados realiza pouco trabalho desnecessário; quando as solicitações falham, deve-se realizar mais trabalho para limpar e desfazer as alterações.

O `InnoDB` usa estratégias otimistas para operações como **bloqueio** e **commit**. Por exemplo, os dados alterados por uma transação podem ser escritos nos arquivos de dados antes de o commit ocorrer, tornando o commit em si muito rápido, mas exigindo mais trabalho para desfazer as alterações se a transação for revertida.

O oposto de uma estratégia otimista é uma **pessimista**, onde um sistema é otimizado para lidar com operações que são pouco confiáveis e frequentemente infrutíferas. Essa metodologia é rara em um sistema de banco de dados, porque há muito cuidado ao escolher hardware, redes e algoritmos confiáveis.

Veja também  commit,  concorrência,  DML,  bloqueio,  pessimista,  integridade referencial.

opinião :   Um parâmetro de configuração para o MySQL, armazenado no **arquivo de opções** ou passado na linha de comando.

    Para as **opções** que se aplicam a tabelas **InnoDB**, cada nome de opção começa com o prefixo `innodb_`.

    Veja também  InnoDB,  opção,  arquivo de opções.

arquivo de opções :   O arquivo que contém as **opções de configuração** para a instância do MySQL. Tradicionalmente, no Linux e Unix, esse arquivo é chamado `my.cnf`, e no Windows, é chamado `my.ini`.

    Veja também  arquivo de configuração,  my.cnf,  my.ini,  opção.

página de overflow :   Páginas de disco **separadamente alocadas** que contêm colunas de comprimento variável (como `BLOB` e `VARCHAR`) que são muito longas para caber em uma **página B-tree**. As colunas associadas são conhecidas como **colunas fora da página**.

    Veja também  B-tree,  coluna fora da página,  página.

### P

.par file :   Um arquivo que contém definições de partição. Arquivos com essa extensão são incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Com a introdução do suporte nativo para partição de tabelas **InnoDB** no MySQL 5.7.6, os arquivos `.par` não são mais criados para tabelas **InnoDB** particionadas. As tabelas **MyISAM** particionadas continuam a usar arquivos `.par` no MySQL 5.7. Em MySQL 8.0, o suporte para partição é fornecido apenas pelo mecanismo de armazenamento **InnoDB**. Como tal, os arquivos `.par` não são mais usados a partir do MySQL 8.0.

Veja também  Backup Empresarial do MySQL,  comando mysqlbackup.

página:  Uma unidade que representa a quantidade de dados que o `InnoDB` transfere de uma só vez entre o disco (os **arquivos de dados**) e a memória (o **pool de buffers**). Uma página pode conter uma ou mais **linhas**, dependendo da quantidade de dados em cada linha. Se uma linha não cabe inteiramente em uma única página, o `InnoDB` configura estruturas de dados adicionais em estilo ponteiro para que as informações sobre a linha possam ser armazenadas em uma página.

Uma maneira de caber mais dados em cada página é usar o **formato de linha compactado**. Para tabelas que usam BLOBs ou campos de texto grandes, o **formato de linha compactado** permite que essas colunas grandes sejam armazenadas separadamente do resto da linha, reduzindo o overhead de I/O e o uso de memória para consultas que não fazem referência a essas colunas.

Quando o `InnoDB` lê ou escreve conjuntos de páginas como um lote para aumentar o desempenho de I/O, ele lê ou escreve um **extensão** de cada vez.

Todas as estruturas de dados do disco do `InnoDB` dentro de uma instância do MySQL compartilham o mesmo **tamanho da página**.

Veja também  pool de buffers,  página suja,  varredura,  thread mestre,  thread.

tamanho da página:  Para versões até e incluindo o MySQL 5.5, o tamanho de cada **página do InnoDB** é fixo em 16 kilobytes. Esse valor representa um equilíbrio: grande o suficiente para armazenar os dados da maioria das linhas, mas pequeno o suficiente para minimizar o overhead de desempenho da transferência de dados desnecessários para a memória. Outros valores não são testados ou suportados.

A partir do MySQL 5.6, o tamanho da página para uma **instância** de `InnoDB` pode ser de 4KB, 8KB ou 16KB, controlado pela opção de configuração `innodb_page_size`. A partir do MySQL 5.7.6, o `InnoDB` também suporta tamanhos de página de 32KB e 64KB. Para tamanhos de página de 32KB e 64KB, o `ROW_FORMAT=COMPRESSED` não é suportado e o tamanho máximo do registro é de 16KB.

O tamanho da página é definido ao criar a **instância** MySQL e permanece constante depois disso. O mesmo tamanho de página se aplica a todos os **tablespaces** de `InnoDB`, incluindo o **tablespace de sistema**, **tablespaces de arquivo por tabela** e **tablespaces gerais**.

Tamanhos de página menores podem ajudar no desempenho com dispositivos de armazenamento que usam tamanhos de bloco pequenos, particularmente para **dispositivos SSD** em cargas de trabalho **ligadas a disco**, como para aplicações **OLTP**. À medida que as linhas individuais são atualizadas, menos dados são copiados para a memória, escritos no disco, reorganizados, bloqueados e assim por diante.

Veja também  ligado a disco,  arquivo por tabela,  tablespace geral,  instância,  OLTP,  página,  SSD,  tablespace de sistema,  tablespace.

tabela pai :   A tabela em uma relação de **chave estrangeira** que contém os valores iniciais da coluna apontados a partir da **tabela filha**. As consequências da exclusão ou atualização de linhas na tabela pai dependem das cláusulas `ON UPDATE` e `ON DELETE` na definição da chave estrangeira. Linhas com valores correspondentes na tabela filha podem ser excluídas ou atualizadas automaticamente, em ordem, ou essas colunas podem ser definidas como `NULL`, ou a operação pode ser impedida.

Veja também  tabela filha,  chave estrangeira.

backup parcial :   Um **backup** que contém alguns dos **tables** em um banco de dados MySQL ou alguns dos bancos de dados em uma **instância** MySQL. Contrasta com o **backup completo**.

Veja também  backup,  backup completo,  tabela.

índice parcial :   Um **índice** que representa apenas parte do valor de uma coluna, tipicamente os primeiros N caracteres (o **prefixo**) de um valor `VARCHAR` longo.

Veja também  índice,  prefixo de índice.

confiança parcial:   Um ambiente de execução tipicamente usado por provedores de hospedagem, onde as aplicações têm algumas permissões, mas não outras. Por exemplo, as aplicações podem ser capazes de acessar um servidor de banco de dados por meio de uma rede, mas estar "contenidas" em relação à leitura e escrita de arquivos locais.

    Veja também  Connector/NET.

Schema de desempenho:   O esquema `performance_schema`, no MySQL 5.5 e superior, apresenta um conjunto de tabelas que você pode consultar para obter informações detalhadas sobre as características de desempenho de muitas partes internas do servidor MySQL. Veja  Capítulo 29, *MySQL Performance Schema*.

    Veja também  `INFORMATION_SCHEMA`,  latch,  mutex,  rw-lock.

Perl:   Uma linguagem de programação com raízes em scripts Unix e geração de relatórios. Incorpora expressões regulares de alto desempenho e I/O de arquivos. Grande coleção de módulos reutilizáveis disponíveis através de repositórios como CPAN.

    Veja também  Perl API.

Perl API:   Uma **API** de código aberto para aplicações MySQL escritas na linguagem **Perl**. Implementada através dos módulos `DBI` e `DBD::mysql`. Para mais informações, consulte  Seção 31.9, “MySQL Perl API”.

    Veja também  API,  Perl.

estatísticas persistentes:   Uma funcionalidade que armazena estatísticas de **índice** para **tabelas** `InnoDB` no disco, proporcionando melhor **estabilidade do plano** para **consultas**. Para mais informações, consulte  Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

    Veja também  índice,  otimizador,  estabilidade do plano,  consulta,  tabela.

pessimista:   Uma metodologia que sacrifica o desempenho ou a concorrência em favor da segurança. É apropriada se uma alta proporção de solicitações ou tentativas possa falhar, ou se as consequências de uma solicitação falharem forem graves. O `InnoDB` usa o que é conhecido como uma estratégia de **bloqueio** pessimista, para minimizar a chance de **bloqueios**. No nível da aplicação, você pode evitar bloqueios usando uma estratégia pessimista de adquirir todas as chaves necessárias por uma transação no início.

Muitos mecanismos de banco de dados embutidos usam a metodologia **otimista** oposta.

Veja também  bloqueio,  bloqueio,  otimista.

fantasma :   Uma linha que aparece no conjunto de resultados de uma consulta, mas não no conjunto de resultados de uma consulta anterior. Por exemplo, se uma consulta for executada duas vezes dentro de uma **transação**, e, nesse meio tempo, outra transação for confirmada após inserir uma nova linha ou atualizar uma linha para que ela corresponda à cláusula `WHERE` da consulta.

Essa ocorrência é conhecida como leitura fantasma. É mais difícil de evitar do que uma **leitura não repetida**, porque bloquear todas as linhas do conjunto de resultados da primeira consulta não impede as alterações que causam o aparecimento do fantasma.

Entre os diferentes **níveis de isolamento**, as leituras fantasmas são prevenidas pelo nível de **leitura serializável**, e permitidas pelos níveis de **leitura repetida**, **leitura consistente** e **leitura não comprometida**.

Veja também  leitura consistente,  nível de isolamento,  leitura não repetida,  LEITURA NÃO COMPROMETIDA,  LEITURA REPETÍVEL,  SERIALIZÁVEL,  transação.

PHP :   Uma linguagem de programação originada de aplicações web. O código é tipicamente embutido como blocos dentro da fonte de uma página web, com a saída substituída na página à medida que é transmitida pelo servidor web. Isso está em contraste com aplicações como scripts CGI que imprimem a saída na forma de uma página web inteira. O estilo de codificação PHP é usado para páginas web altamente interativas e dinâmicas. Programas modernos em PHP também podem ser executados como aplicações de linha de comando ou GUI.

As aplicações MySQL são escritas usando uma das **APIs PHP**. Módulos reutilizáveis podem ser escritos em **C** e chamados a partir do PHP.

Outra tecnologia para escrever páginas web no lado do servidor com MySQL é **ASP.net**.

Veja também  ASP.net,  C,  API PHP.

API PHP: Várias **APIs** estão disponíveis para escrever aplicações MySQL na linguagem **PHP**: a API original do MySQL (`Mysql`), a Extensão Melhorada do MySQL (`Mysqli`), o Driver Nativo do MySQL (`Mysqlnd`), as funções do MySQL (`PDO_MYSQL`) e o Connector/PHP. Para detalhes, consulte MySQL e PHP.

Veja também  API,  PHP.

física:   Um tipo de operação que envolve aspectos relacionados ao hardware, como blocos de disco, páginas de memória, arquivos, bits, leituras de disco, e assim por diante. Tipicamente, os aspectos físicos são importantes durante o ajuste de desempenho e o diagnóstico de problemas em nível de especialista. Contrasta com **lógico**.

Veja também  lógico,  backup físico.

backup físico:   Um **backup** que copia os arquivos de dados reais. Por exemplo, o comando **`mysqlbackup`** do produto **MySQL Enterprise Backup** produz um backup físico, porque sua saída contém arquivos de dados que podem ser usados diretamente pelo servidor `mysqld`, resultando em uma operação de **restauração** mais rápida. Contrasta com **backup lógico**.

Veja também  backup,  backup lógico,  MySQL Enterprise Backup,  restauração.

PITR:   Abreviação de **recovery point-in-time**.

Veja também  recovery point-in-time.

estabilidade do plano:   Uma propriedade de um **plano de execução de consulta**, onde o otimizador faz as mesmas escolhas cada vez para uma consulta dada, para que o desempenho seja consistente e previsível.

Veja também  consulta,  plano de execução de consulta.

recovery point-in-time:   O processo de restaurar um **backup** para recriar o estado do banco de dados em uma data e hora específicas. Comumente abreviado “PITR”. Como é improvável que o horário especificado corresponda exatamente ao momento de um backup, essa técnica geralmente requer uma combinação de um **backup físico** e um **backup lógico**. Por exemplo, com o produto **MySQL Enterprise Backup**, você restaura o último backup que você fez antes do ponto em tempo especificado, e depois retransmite as alterações do **log binário** entre o momento do backup e o horário da PITR.

Veja também  backup,  registro binário,  backup lógico,  MySQL Enterprise Backup,  backup físico.

port :   O número do socket TCP/IP no qual o servidor de banco de dados escuta, usado para estabelecer uma **conexão**. Muitas vezes especificado em conjunto com um **host**. Dependendo do uso da criptografia de rede, pode haver uma porta para tráfego não criptografado e outra porta para conexões **SSL**.

    Veja também  conexão,  host,  SSL.

prefixo :   Veja  prefixo de índice.

backup preparado :   Um conjunto de arquivos de backup, produzidos pelo produto **MySQL Enterprise Backup**, após todas as etapas de aplicação de **registros binários** e **backups incrementais** serem concluídas. Os arquivos resultantes estão prontos para serem **restaurados**. Antes das etapas de aplicação, os arquivos são conhecidos como um **backup bruto**.

    Veja também  registro binário,  backup quente,  backup incremental,  MySQL Enterprise Backup,  backup bruto,  restauração.

declaração preparada :   Uma declaração SQL que é analisada antecipadamente para determinar um plano de execução eficiente. Pode ser executada várias vezes, sem o overhead para análise e análise cada vez. Diferentes valores podem ser substituídos pelos literais na cláusula `WHERE` cada vez, através do uso de marcadores. Essa técnica de substituição melhora a segurança, protegendo contra alguns tipos de ataques de injeção SQL. Você também pode reduzir o overhead para conversão e cópia de valores de retorno para variáveis de programa.

    Embora você possa usar declarações preparadas diretamente através da sintaxe SQL, os vários **Conectivos** têm interfaces de programação para manipular declarações preparadas, e essas APIs são mais eficientes do que passar por SQL.

    Veja também  declaração preparada no lado do cliente,  conector,  declaração preparada no lado do servidor.

chave primária :   Um conjunto de colunas—e, por implicação, o índice baseado neste conjunto de colunas—que pode identificar de forma única cada linha em uma tabela. Como tal, deve ser um índice único que não contenha quaisquer valores `NULL`.

`InnoDB` exige que cada tabela tenha um índice desse tipo (também chamado de **índice agrupado** ou **índice de agrupamento**), e organiza o armazenamento da tabela com base nos valores das colunas da chave primária.

Ao escolher valores para a chave primária, considere usar valores arbitrários (uma **chave sintética**) em vez de depender de valores derivados de alguma outra fonte (uma **chave natural**).

Veja também  índice agrupado,  índice,  chave natural,  chave sintética.

principal :   O termo Kerberos para uma entidade nomeada, como um usuário ou servidor.

Veja também  nome do principal do serviço,  nome do principal do usuário.

processo :   Uma instância de um programa em execução. O sistema operacional troca entre múltiplos processos em execução, permitindo um certo grau de **concorrência**. Na maioria dos sistemas operacionais, os processos podem conter múltiplos **threads** de execução que compartilham recursos. A troca de contexto entre threads é mais rápida do que a troca equivalente entre processos.

Veja também  concorrência,  thread.

registro pseudo :   Um registro artificial em um índice, usado para **bloquear** valores de chave ou intervalos que atualmente não existem.

Veja também  registro mínimo,  bloqueio,  registro máximo.

Pthreads :   O padrão de threads POSIX, que define uma API para operações de thread e bloqueio em sistemas Unix e Linux. Em sistemas Unix e Linux, o `InnoDB` usa essa implementação para **musexos**.

Veja também  mutex.

purga :   Um tipo de coleta de lixo realizada por um ou mais threads de fundo separados (controlados por  `innodb_purge_threads`) que é executada em um cronograma periódico. A purga analisa e processa páginas do **registro de desfazer** da **lista de histórico** com o propósito de remover registros de índices agrupados e secundários que foram marcados para exclusão (por declarações anteriores de  `DELETE`) e que não são mais necessários para **MVCC** ou **rollback**. A purga libera páginas do registro de desfazer da lista de histórico após processá-las.

Veja também  lista de histórico,  MVCC,  rollback,  registro de desfazer.

purga de buffer:   A técnica de armazenar as alterações em páginas de índice secundário, resultantes de operações `DELETE`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas e minimizar o I/O aleatório. (Como as operações de exclusão são um processo em duas etapas, essa operação armazena a escrita que normalmente exclui um registro de índice que foi previamente marcado para exclusão.) É um dos tipos de **purga de buffer**: os outros são **purga de inserção** e **purga de exclusão**.

Veja também  buffer de alterações,  purga de buffer,  purga de exclusão,  buffer de inserção,  purga de inserção.

purga de atraso:   Outro nome para a **lista de histórico** do **InnoDB**. Relacionado à opção de configuração  `innodb_max_purge_lag`.

Veja também  lista de histórico,  purga.

purga de thread:   Um **thread** dentro do processo do **InnoDB** dedicado a realizar a operação de **purga** periódica. No MySQL 5.6 e versões superiores, múltiplos threads de purga são habilitados pela opção de configuração  `innodb_purge_threads`.

Veja também  purga,  thread.

Python:   Uma linguagem de programação usada em uma ampla gama de áreas, desde scripts Unix até aplicações em grande escala. Inclui tipificação dinâmica, tipos de dados integrados de alto nível, recursos orientados a objetos e uma extensa biblioteca padrão. Muitas vezes usada como uma linguagem de "cola" entre componentes escritos em outras linguagens. A **API Python** do MySQL é o módulo de código aberto **MySQLdb**.

Veja também  MySQLdb,  API Python.

API Python:   Veja também  API,  Python.

Por razões históricas, às vezes as discussões sobre o processamento interno para declarações usam “consulta” em um sentido mais amplo, incluindo outros tipos de declarações MySQL, como **DDL** e **DML**.

Veja também  DDL,  DML,  índice,  join,  SQL,  tabela.

plano de execução da consulta:   O conjunto de decisões tomadas pelo otimizador sobre como executar uma **consulta** de forma mais eficiente, incluindo qual **índice** ou índices usar e a ordem em que **joinar** tabelas. A **estabilidade do plano** envolve as mesmas escolhas sendo feitas consistentemente para uma consulta dada.

Veja também  índice,  join,  estabilidade do plano,  consulta.

registro de consulta:   Veja  registro geral de consulta.

quiesce:   Para reduzir a quantidade de atividade do banco de dados, muitas vezes em preparação para uma operação como uma **alteração de tabela**, um **backup** ou um **shutdown**. Pode ou não envolver fazer o máximo de **flush** possível, para que o **InnoDB** não continue realizando I/O de fundo.

    Em MySQL 5.6 e versões superiores, a sintaxe `FLUSH TABLES ... FOR EXPORT` escreve alguns dados no disco para tabelas **InnoDB** que simplifica o backup dessas tabelas copiando os arquivos de dados.

    Veja também  backup,  flush,  InnoDB,  shutdown.

### R

R-tree:   Uma estrutura de dados em forma de árvore usada para indexação espacial de dados multidimensionais, como coordenadas geográficas, retângulos ou polígonos.

Veja também  B-tree.

RAID:   Abreviação para “Array Redundante de Unidades Inexpensive”. Distribuir operações de I/O em múltiplos discos permite maior **concorrência** no nível do hardware e melhora a eficiência das operações de escrita de baixo nível que, de outra forma, seriam realizadas em sequência.

Veja também  concorrência.

dive aleatório:   Uma técnica para estimar rapidamente o número de valores diferentes em uma coluna (a **cardinalidade** da coluna). O **InnoDB** amostra páginas aleatoriamente do índice e usa esses dados para estimar o número de valores diferentes.

Veja também  cardinalidade.

backup bruto:   O conjunto inicial de arquivos de backup produzidos pelo produto **MySQL Enterprise Backup**, antes que as alterações refletidas no **log binário** e quaisquer **backups incrementais** sejam aplicadas. Nesta fase, os arquivos não estão prontos para **restauração**. Após essas alterações serem aplicadas, os arquivos são conhecidos como um **backup preparado**.

Veja também  log binário,  backup quente,  ibbackup_logfile,  backup incremental,  MySQL Enterprise Backup,  backup preparado,  restauração.

READ COMMITTED:   Um **nível de isolamento** que utiliza uma estratégia de **bloqueio** que relaxa parte da proteção entre **transações**, no interesse do desempenho. As transações não podem ver dados não comprometidos de outras transações, mas podem ver dados que são comprometidos por outra transação após a transação atual ter começado. Assim, uma transação nunca vê nenhum dado ruim, mas os dados que ela vê podem depender, em certa medida, do momento das outras transações.

Quando uma transação com este nível de isolamento executa operações `UPDATE ... WHERE` ou `DELETE ... WHERE`, outras transações podem ter que esperar. A transação pode executar operações `SELECT ... FOR UPDATE` e `LOCK IN SHARE MODE` sem fazer outras transações esperar.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` em MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja também  ACID,  nível de isolamento,  bloqueio,  REPEATABLE READ,  SERIALIZABLE,  transação.

fenômenos de leitura:   Fenômenos como **leitura suja**, **leitura não repetitiva** e **leitura fantasma** que podem ocorrer quando uma transação lê dados que outra transação modificou.

Veja também  leitura suja,  leitura não repetitiva,  fantasma.

LEIA NÃO COMITADA:   O **nível de isolamento** que oferece a menor quantidade de proteção entre as transações. As consultas empregam uma estratégia de **bloqueio** que permite que elas prossigam em situações em que normalmente esperariam por outra transação. No entanto, esse desempenho extra vem ao custo de resultados menos confiáveis, incluindo dados que foram alterados por outras transações e ainda não foram comprometidos (conhecido como **leitura suja**). Use este nível de isolamento com grande cautela e esteja ciente de que os resultados podem não ser consistentes ou reproduzíveis, dependendo do que outras transações estão fazendo ao mesmo tempo. Tipicamente, as transações com este nível de isolamento realizam apenas consultas, não operações de inserção, atualização ou exclusão.

    Veja também  ACID,  leitura suja,  nível de isolamento,  bloqueio,  transação.

leitura vista:   Um instantâneo interno usado pelo mecanismo **MVCC** do `InnoDB`. Certas **transações**, dependendo de seu **nível de isolamento**, veem os valores dos dados como estavam na época em que a transação (ou, em alguns casos, a declaração) começou. Os níveis de isolamento que usam uma leitura vista são **LEIA COMITADA**, **LEIA COMITADA SEM REPETIÇÃO** e **LEIA NÃO COMITADA**.

    Veja também  nível de isolamento,  MVCC,  LEIA COMITADA,  LEIA NÃO COMITADA,  LEIA COMITADA SEM REPETIÇÃO,  transação.

leitura adiante:   Um tipo de solicitação de E/S que pré-prefere um grupo de **páginas** (um **extensão** inteiro) para o **pool de buffer** de forma assíncrona, caso essas páginas sejam necessárias em breve. A técnica de leitura linear adiante pré-prefere todas as páginas de uma extensão com base nos padrões de acesso para as páginas na extensão anterior. A técnica de leitura aleatória adiante pré-prefere todas as páginas de uma extensão assim que um certo número de páginas da mesma extensão estiverem no pool de buffer. A leitura aleatória adiante não faz parte do MySQL 5.5, mas é reintroduzida no MySQL 5.6 sob o controle da opção de configuração  `innodb_random_read_ahead`.

    Veja também  pool de buffer,  extensão,  página.

transação de leitura somente:   Um tipo de **transação** que pode ser otimizado para tabelas `InnoDB` eliminando parte da contabilidade envolvida na criação de uma **visualização de leitura** para cada transação. Pode realizar apenas consultas de **leitura sem bloqueio**. Pode ser iniciada explicitamente com a sintaxe  `START TRANSACTION READ ONLY`, ou automaticamente sob certas condições. Veja  Seção 10.5.3, “Otimizando Transações de Leitura Somente em InnoDB” para detalhes.

    Veja também  leitura sem bloqueio,  visualização de leitura,  transação.

bloqueio de registro:   Um  bloqueio em um registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transação insira, atualize ou exclua linhas onde o valor de `t.c1` é 10. Contrasta com **bloqueio de lacuna** e **bloqueio de próxima chave**.

    Veja também  bloqueio de lacuna,  bloqueio,  próxima chave.

redo:   Os dados, em unidades de registro, registrados no **log de redo** quando as instruções DML fazem alterações em tabelas `InnoDB`. É usado durante a **recuperação após falha** para corrigir dados escritos por **transações** incompletas. O valor crescente do **LSN** representa a quantidade cumulativa de dados de redo que passaram pelo log de redo.

    Veja também  recuperação após falha,  DML,  LSN,  log de redo,  transação.

log de redo:   Uma estrutura de dados baseada em disco usada durante a **recuperação após falha**, para corrigir dados escritos por **transações** incompletas. Durante o funcionamento normal, ela codifica solicitações para alterar os dados das tabelas `InnoDB`, que resultam de instruções SQL ou chamadas de API de baixo nível. As modificações que não terminaram de atualizar os **arquivos de dados** antes de um **shutdown** inesperado são replayadas automaticamente.

    O log de redo é representado fisicamente no disco como um conjunto de arquivos de log de redo. Os dados do log de redo são codificados em termos de registros afetados; esses dados são coletivamente referidos como **redo**. A passagem de dados pelo log de redo é representada por um valor **LSN** sempre crescente.

    Para mais informações, consulte  Seção 17.6.5, “Log de Redo”

Veja também  recuperação de falhas,  arquivos de dados,  ib\_logfile,  buffer de log,  LSN,  redo,  shutdown,  transação.

arquivamento de log de redo:   Uma funcionalidade do `InnoDB` que, quando habilitada, escreve sequencialmente registros do log de redo em um arquivo de arquivamento para evitar a perda potencial de dados que pode ocorrer quando uma ferramenta de backup não consegue acompanhar a geração do log de redo enquanto uma operação de backup está em andamento. Para mais informações, consulte  Arquivamento de Log de Redo.

    Veja também  log de redo.

formato de linha redundante:   O formato de linha mais antigo do `InnoDB`. Antes do MySQL 5.0.3, era o único formato de linha disponível no `InnoDB`. De MySQL 5.0.3 a MySQL 5.7.8, o formato de linha padrão é **COMPACT**. A partir do MySQL 5.7.9, o formato de linha padrão é definido pela opção de configuração  `innodb_default_row_format`, que tem um ajuste padrão de **DINÂMICO**. Você ainda pode especificar o formato de linha **REDUNDANTE** para compatibilidade com tabelas antigas do `InnoDB`.

    Para mais informações, consulte  Seção 17.10, “Formatos de Linha do InnoDB”.

    Veja também  formato de linha compactado,  formato de linha dinâmico,  formato de linha.

integridade referencial:   A técnica de manter os dados sempre em um formato consistente, parte da filosofia **ACID**. Em particular, os dados em diferentes tabelas são mantidos consistentes através do uso de **restrições de chave estrangeira**, que podem impedir que alterações ocorram ou propagam automaticamente essas alterações para todas as tabelas relacionadas. Mecanismos relacionados incluem a **restrição única**, que impede que valores duplicados sejam inseridos por engano, e a **restrição NOT NULL**, que impede que valores em branco sejam inseridos por engano.

    Veja também  ACID,  restrição de chave estrangeira,  restrição NOT NULL,  restrição única.

relacional:   Um aspecto importante dos sistemas de banco de dados modernos. O servidor de banco de dados codifica e impõe relações como um para um, um para muitos, muitos para um e unicidade. Por exemplo, uma pessoa pode ter zero, um ou vários números de telefone em um banco de dados de endereços; um único número de telefone pode estar associado a vários membros da família. Em um banco de dados financeiro, uma pessoa pode ser obrigada a ter exatamente um CPF, e qualquer CPF só pode ser associado a uma pessoa.

    O servidor de banco de dados pode usar essas relações para impedir que dados ruins sejam inseridos e para encontrar maneiras eficientes de buscar informações. Por exemplo, se um valor for declarado como único, o servidor pode parar de procurar assim que o primeiro correspondente for encontrado, e pode rejeitar tentativas de inserir uma segunda cópia do mesmo valor.

    No nível do banco de dados, essas relações são expressas por meio de recursos do SQL, como **colunas** dentro de uma tabela, restrições **unicidade** e `NOT NULL`, **chaves estrangeiras** e diferentes tipos de operações de junção. Relações complexas geralmente envolvem dados divididos entre mais de uma tabela. Muitas vezes, os dados são **normalizados**, de modo que valores duplicados em relações um para muitos são armazenados apenas uma vez.

    Em um contexto matemático, as relações dentro de um banco de dados são derivadas da teoria dos conjuntos. Por exemplo, os operadores `OR` e `AND` de uma cláusula `WHERE` representam as noções de união e interseção.

    Veja também  ACID,  coluna,  restrição,  chave estrangeira,  normalizado.

relevancia:   Na funcionalidade de **busca de texto completo**, um número que indica a similaridade entre a string de busca e os dados no **índice FULLTEXT**. Por exemplo, quando você busca uma única palavra, essa palavra é tipicamente mais relevante para uma linha onde ela ocorre várias vezes no texto do que para uma linha onde ela aparece apenas uma vez.

    Veja também  busca de texto completo,  índice FULLTEXT.

REPETIÇÃO DE LEITURA: O nível de isolamento padrão para o `InnoDB`. Ele impede que quaisquer linhas consultadas sejam alteradas por outras **transações**, bloqueando assim as **leitura não repetitiva**, mas não as **leitura fantasma**. Ele utiliza uma estratégia de **bloqueio** moderadamente rigorosa para que todas as consultas dentro de uma transação vejam dados do mesmo instantâneo, ou seja, os dados como estavam no momento em que a transação começou.

Quando uma transação com este nível de isolamento executa operações `UPDATE ... WHERE`, `DELETE ... WHERE`, `SELECT ... FOR UPDATE` e `LOCK IN SHARE MODE`, outras transações podem ter que esperar.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja também  ACID,  leitura consistente,  nível de isolamento,  bloqueio,  fantasma,  transação.

repertório: O repertório é um termo aplicado a conjuntos de caracteres. Um repertório de conjunto de caracteres é a coleção de caracteres no conjunto. Veja  Seção 12.2.1, “Repertório de Conjunto de Caracteres”.

replica: Uma máquina **servidor** de banco de dados em uma topologia de **replicação** que recebe alterações de outro servidor (a **fonte**) e aplica essas mesmas alterações. Assim, ela mantém o mesmo conteúdo que a fonte, embora possa estar um pouco atrasada.

No MySQL, as réplicas são comumente usadas na recuperação de desastres, para substituir um servidor que falha. Elas também são comumente usadas para testar atualizações de software e novos ajustes, para garantir que as alterações na configuração do banco de dados não causem problemas de desempenho ou confiabilidade.

As réplicas geralmente têm cargas de trabalho elevadas, pois processam todas as operações **DML** (escrita) transmitidas da fonte, além de consultas de usuários. Para garantir que as réplicas possam aplicar as alterações da fonte o mais rápido possível, elas geralmente possuem dispositivos de entrada/saída (I/O) rápidos e CPU e memória suficientes para executar várias instâncias do banco de dados no mesmo servidor. Por exemplo, a fonte pode usar armazenamento em disco rígido, enquanto as réplicas usam **SSD**.

Veja também  DML,  replicação,  servidor,  fonte,  SSD.

replicação :   A prática de enviar alterações de uma **fonte** para uma ou mais **réplicas**, de modo que todos os bancos de dados tenham os mesmos dados. Essa técnica tem uma ampla gama de usos, como balanceamento de carga para melhor escalabilidade, recuperação em caso de desastre e teste de atualizações de software e alterações de configuração. As alterações podem ser enviadas entre os bancos de dados por métodos chamados **replicação baseada em linhas** e **replicação baseada em declarações**.

Veja também  replica,  replicação baseada em linhas,  fonte,  replicação baseada em declarações.

restaurar :   O processo de colocar um conjunto de arquivos de backup do produto **MySQL Enterprise Backup** em uso pelo MySQL. Essa operação pode ser realizada para corrigir um banco de dados corrompido, para retornar a um ponto anterior no tempo ou (em um contexto de **replicação**) para configurar uma nova **replica**. No produto **MySQL Enterprise Backup**, essa operação é realizada pela opção `copy-back` do comando `mysqlbackup`.

Veja também  backup quente,  MySQL Enterprise Backup,  comando mysqlbackup,  backup preparado,  replica,  replicação.

rollback :   Uma declaração **SQL** que termina uma **transação**, anulando quaisquer alterações feitas pela transação. É o oposto de **commit**, que torna permanentes quaisquer alterações feitas na transação.

Por padrão, o MySQL usa o ajuste **autocommit**, que emite automaticamente um commit após cada declaração SQL. Você deve alterar esse ajuste antes de poder usar a técnica de rollback.

Veja também  ACID,  autocommit,  commit,  SQL,  transação.

segmento de rollback :   A área de armazenamento que contém os **registros de desfazer**. Os segmentos de rollback tradicionalmente residiam no **espaço de tabelas do sistema**. A partir do MySQL 5.6, os segmentos de rollback podem residir no **espaço de tabelas de desfazer**. A partir do MySQL 5.7, os segmentos de rollback também são alocados ao **espaço de tabelas temporárias globais**.

    Veja também  espaço de tabelas temporárias globais,  espaço de tabelas do sistema,  registro de desfazer,  espaço de tabelas de desfazer.

linha :   A estrutura de dados lógica definida por um conjunto de **colunas**. Um conjunto de linhas compõe uma **tabela**. Dentro dos **arquivos de dados do InnoDB**, cada **página** pode conter uma ou mais linhas.

    Embora o `InnoDB` use o termo **formato de linha** para manter a consistência com a sintaxe do MySQL, o formato de linha é uma propriedade de cada tabela e se aplica a todas as linhas dessa tabela.

    Veja também  coluna,  arquivos de dados,  página,  formato de linha,  tabela.

formato de linha :   O formato de armazenamento em disco para **linhas** de uma **tabela do InnoDB**. À medida que o `InnoDB` ganha novas capacidades, como **compressão**, novos formatos de linha são introduzidos para suportar as melhorias resultantes na eficiência de armazenamento e no desempenho.

O formato de linha de uma tabela do `InnoDB` é especificado pela opção `ROW_FORMAT` ou pela opção de configuração `innodb_default_row_format` (introduzida no MySQL 5.7.9). Os formatos de linha incluem `REDUNDANT`, `COMPACT`, `COMPRESSED` e `DYNAMIC`. Para visualizar o formato de linha de uma tabela do `InnoDB`, execute a declaração `SHOW TABLE STATUS` ou consulte os metadados da tabela `InnoDB` no  `INFORMATION_SCHEMA`.

    Veja também  formato de linha compactada,  formato de linha comprimida,  compressão,  formato de linha dinâmico,  linha,  tabela.

bloqueio de linha :   Um **bloqueio** que impede que uma linha seja acessada de maneira incompatível por outra **transação**. Outras linhas da mesma tabela podem ser escritas livremente por outras transações. Esse é o tipo de **bloqueio** realizado por operações **DML** em tabelas do `InnoDB`.

Contrastando com as **bloqueiras de tabela** usadas pelo `MyISAM`, ou durante as operações de **DDL** em tabelas do `InnoDB` que não podem ser feitas com **DDL online**, essas bloqueiam o acesso concorrente à tabela.

Veja também DDL, DML, InnoDB, bloqueio, bloqueio de acesso, DDL online, bloqueira de tabela, transação.

Replicação baseada em linhas:   Uma forma de **replicação** em que os eventos são propagados a partir da **fonte**, especificando como alterar linhas individuais na **replica**. É seguro usar para todas as configurações da opção `innodb_autoinc_lock_mode`.

Veja também auto-incremento de bloqueio, `innodb\_autoinc\_lock\_mode`, replica, fonte, replicação baseada em declarações.

Bloqueio de nível de linha:   O mecanismo de bloqueio usado para tabelas do `InnoDB`, que depende de **bloqueios de linha** em vez de **bloqueiras de tabela**. Múltiplas **transações** podem modificar a mesma tabela de forma concorrente. Somente se duas transações tentarem modificar a mesma linha, uma das transações aguarda a conclusão da outra (e libera seus bloqueios de linha).

Veja também InnoDB, bloqueio, bloqueio de linha, bloqueira de tabela, transação.

Ruby:   Uma linguagem de programação que enfatiza a tipificação dinâmica e a programação orientada a objetos. Algumas sintaxes são familiares aos desenvolvedores do **Perl**.

Veja também API, Perl, Ruby API.

Ruby API:   `mysql2`, baseado na biblioteca de API `libmysqlclient`, está disponível para programadores Ruby que desenvolvem aplicativos MySQL. Para mais informações, consulte a Seção 31.11, “APIs Ruby do MySQL”.

Veja também libmysql, Ruby.

rw-lock:   O objeto de baixo nível que o `InnoDB` usa para representar e impor bloqueios de acesso de acesso compartilhado a estruturas de dados internas em memória seguindo certas regras. Contrasta com **mutexes**, que o `InnoDB` usa para representar e impor acesso exclusivo a estruturas de dados internas em memória. Mutexes e rw-locks são conhecidos coletivamente como **latches**.

Os tipos de `rw-lock` incluem `s-locks` (bloqueios compartilhados), `x-locks` (bloqueios exclusivos) e `sx-locks` (bloqueios compartilhados-exclusivos).

* Um `s-lock` fornece acesso de leitura a um recurso comum.
* Um `x-lock` fornece acesso de escrita a um recurso comum, impedindo leituras inconsistentes por outros threads.
* Um `sx-lock` fornece acesso de escrita a um recurso comum, permitindo leituras inconsistentes por outros threads. Os `sx-locks` foram introduzidos no MySQL 5.7 para otimizar a concorrência e melhorar a escalabilidade para cargas de trabalho de leitura e escrita.

A seguinte matriz resume a compatibilidade do tipo `rw-lock`.

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th></th> <th><em><code>S</code></em></th> <th><em><code>SX</code></em></th> <th><em><code>X</code></em></th> </tr></thead><tbody><tr> <th><em><code>S</code></em></th> <td>Compatível</td> <td>Compatível</td> <td>Conflitos</td> </tr><tr> <th><em><code>SX</code></em></th> <td>Compatível</td> <td>Conflitos</td> <td>Conflitos</td> </tr><tr> <th><em><code>X</code></em></th> <td>Conflitos</td> <td>Conflitos</td> <td>Conflitos</td> </tr></tbody></table>

Veja também  latch,  lock,  mutex,  Performance Schema.

### S

savepoint :   Os savepoints ajudam a implementar **transações aninhadas**. Eles podem ser usados para fornecer escopo para operações em tabelas que fazem parte de uma transação maior. Por exemplo, agendar uma viagem em um sistema de reservas pode envolver a reserva de vários voos diferentes; se um voo desejado estiver indisponível, você pode **reverter** as alterações envolvidas na reserva desse voo, sem reverter os voos anteriores que foram reservados com sucesso.

Veja também  rollback,  transaction.

escalabilidade:   A capacidade de adicionar mais trabalho e emitir mais solicitações simultâneas a um sistema, sem uma queda súbita no desempenho devido ao excedente dos limites da capacidade do sistema. A arquitetura de software, a configuração do hardware, a codificação da aplicação e o tipo de carga de trabalho desempenham um papel na escalabilidade. Quando o sistema atinge sua capacidade máxima, as técnicas populares para aumentar a escalabilidade são **escalar para cima** (aumentar a capacidade do hardware ou software existente) e **escalar para fora** (adicionar novos servidores e mais instâncias do MySQL). Muitas vezes associadas à **disponibilidade** como aspectos críticos de uma implantação em grande escala.

    Veja também  disponibilidade,  escalar para fora,  escalar para cima.

escalar para fora:   Uma técnica para aumentar a **escalabilidade** adicionando novos servidores e mais instâncias do MySQL. Por exemplo, configurar replicação, NDB Cluster, pool de conexões ou outras funcionalidades que distribuem o trabalho entre um grupo de servidores. Em contraste com **escalar para cima**.

    Veja também  escalabilidade,  escalar para cima.

escalar para cima:   Uma técnica para aumentar a **escalabilidade** aumentando a capacidade do hardware ou software existente. Por exemplo, aumentar a memória em um servidor e ajustar parâmetros relacionados à memória, como  `innodb_buffer_pool_size` e  `innodb_buffer_pool_instances`. Em contraste com **escalar para fora**.

    Veja também  escalabilidade,  escalar para fora.

esquema:   Conceitualmente, um esquema é um conjunto de objetos de banco de dados interconectados, como tabelas, colunas de tabelas, tipos de dados das colunas, índices, chaves estrangeiras, e assim por diante. Esses objetos são conectados através da sintaxe SQL, porque as colunas compõem as tabelas, as chaves estrangeiras referenciam tabelas e colunas, e assim por diante. Idealmente, eles também estão conectados logicamente, trabalhando juntos como parte de uma aplicação unificada ou estrutura flexível. Por exemplo, as bases de dados **`INFORMATION_SCHEMA`** e **performance\_schema** usam “esquema” em seus nomes para enfatizar as relações próximas entre as tabelas e colunas que contêm.

No MySQL, fisicamente, um **esquema** é sinônimo de um **banco de dados**. Você pode substituir a palavra-chave `SCHEMA` pelo `DATABASE` na sintaxe do SQL do MySQL, por exemplo, usando `CREATE SCHEMA` em vez de `CREATE DATABASE`.

Alguns outros produtos de banco de dados fazem uma distinção. Por exemplo, no produto Oracle Database, um **esquema** representa apenas uma parte de um banco de dados: as tabelas e outros objetos de propriedade de um único usuário.

Veja também  banco de dados,  `INFORMATION_SCHEMA`,  Performance Schema.

SDI:  Abreviação para “informação de dicionário serializado”.

Veja também  informação de dicionário serializado (SDI).

índice de pesquisa:  No MySQL, as consultas de **pesquisa de texto completo** usam um tipo especial de índice, o **índice FULLTEXT**. No MySQL 5.6.4 e superior, as tabelas `InnoDB` e `MyISAM` suportam ambos os índices `FULLTEXT`; anteriormente, esses índices estavam disponíveis apenas para tabelas `MyISAM`.

Veja também  pesquisa de texto completo,  índice FULLTEXT.

índice secundário:  Um tipo de **índice InnoDB** que representa um subconjunto das colunas da tabela. Uma tabela `InnoDB` pode ter zero, um ou muitos índices secundários. (Em contraste com o **índice agrupado**, que é necessário para cada tabela `InnoDB`, e armazena os dados para todas as colunas da tabela.)

Um índice secundário pode ser usado para satisfazer consultas que requerem apenas valores das colunas indexadas. Para consultas mais complexas, ele pode ser usado para identificar as linhas relevantes na tabela, que são então recuperadas por meio de buscas usando o índice agrupado.

Criar e descartar índices secundários tradicionalmente envolvia um overhead significativo devido à cópia de todos os dados na tabela `InnoDB`. A funcionalidade de **criação rápida de índices** torna as instruções `CREATE INDEX` e `DROP INDEX` muito mais rápidas para índices secundários `InnoDB`.

Veja também  índice agrupado,  Criação Rápida de Índices,  índice.

segmento:   Uma divisão dentro de um **espaço de tabelas** de `InnoDB`. Se um espaço de tabelas é análogo a um diretório, os segmentos são análogos a arquivos dentro desse diretório. Um segmento pode crescer. Novos segmentos podem ser criados.

Por exemplo, dentro de um **espaço de tabelas por arquivo**, os dados da tabela estão em um segmento e cada índice associado está em seu próprio segmento. O **espaço de tabelas do sistema** contém muitos segmentos diferentes, porque pode armazenar muitas tabelas e seus índices associados. Antes do MySQL 8.0, o espaço de tabelas do sistema também inclui um ou mais **segmentos de rollback** usados para **registros de desfazimento**.

Os segmentos crescem e diminuem à medida que dados são inseridos e excluídos. Quando um segmento precisa de mais espaço, ele é estendido por um **extensão** (1 megabyte) de cada vez. Da mesma forma, um segmento libera o espaço de uma extensão quando todos os dados nessa extensão não são mais necessários.

Veja também  extensão,  tabela por arquivo,  segmento de rollback,  espaço de tabelas do sistema,  tabela,  registro de desfazimento.

seletividade:   Uma propriedade da distribuição de dados, o número de valores distintos em uma coluna (sua **cardinalidade**) dividido pelo número de registros na tabela. Alta seletividade significa que os valores da coluna são relativamente únicos e podem ser recuperados eficientemente por meio de um índice. Se você (ou o otimizador de consultas) puder prever que uma consulta em uma cláusula `WHERE` só corresponde a um pequeno número (ou proporção) de linhas em uma tabela, a consulta geral tende a ser eficiente se avaliar essa consulta primeiro, usando um índice.

Veja também  cardinalidade,  consulta.

leitura semi-consistente:   Um tipo de operação de leitura usado para instruções `UPDATE`, que é uma combinação de **leitura comprometida** e **leitura consistente**. Quando uma instrução `UPDATE` examina uma linha que já está bloqueada, o **InnoDB** retorna a versão comprometida mais recente para o MySQL, para que o MySQL possa determinar se a linha corresponde à condição `WHERE` da `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente, e desta vez o **InnoDB** a bloqueia ou aguarda por um bloqueio nela. Esse tipo de operação de leitura só pode ocorrer quando a transação tem o nível de isolamento **COMPROMETIDO**.

Veja também  leitura consistente,  nível de isolamento,  COMPROMETIDO.

SERIALIZÁVEL:   O **nível de isolamento** que usa a estratégia de bloqueio mais conservadora, para impedir que outras **transações** insiram ou modifiquem dados que foram lidos por essa transação, até que ela seja concluída. Dessa forma, a mesma consulta pode ser executada repetidamente dentro de uma transação, e ter certeza de recuperar o mesmo conjunto de resultados cada vez. Qualquer tentativa de alterar dados que foram comprometidos por outra transação desde o início da transação atual faz com que a transação atual espere.

Este é o nível de isolamento padrão especificado pelo padrão SQL. Na prática, esse grau de rigoridade raramente é necessário, então o nível de isolamento padrão para o **InnoDB** é o próximo mais rigoroso, **REPETÍVEL LEITURA**, (REPEATABLE READ).

Veja também  ACID,  leitura consistente,  nível de isolamento,  bloqueio,  REPETÍVEL LEITURA,  transação.

informação de dicionário serializado (SDI):   Metadados do objeto de dicionário em forma serializada. A SDI é armazenada no formato **JSON**.

A partir do MySQL 8.0.3, a SDI está presente em todos os arquivos de espaço de tabela **InnoDB**, exceto para arquivos de espaço de tabela temporário e espaço de tabela de undo. A presença de SDI em arquivos de espaço de tabela fornece redundância de metadados. Por exemplo, os metadados do objeto de dicionário podem ser extraídos dos arquivos de espaço de tabela usando o utilitário **ibd2sdi** se o dicionário de dados ficar indisponível.

Para uma tabela `MyISAM`, o SDI é armazenado em um arquivo de metadados `.sdi` no diretório do esquema. Um arquivo de metadados SDI é necessário para realizar uma operação de `IMPORT TABLE`.

Veja também  file-per-table,  tablespace geral,  tablespace de sistema,  tablespace.

server :   Um tipo de programa que funciona continuamente, aguardando para receber e agir sobre solicitações de outro programa (o **cliente**). Como muitas vezes um computador inteiro é dedicado para executar um ou mais programas de servidor (como um servidor de banco de dados, um servidor web, um servidor de aplicação ou uma combinação desses), o termo **servidor** também pode se referir ao computador que executa o software do servidor.

Veja também  cliente,  mysqld.

declaração preparada no lado do servidor :   Uma **declaração preparada** gerenciada pelo servidor MySQL. Historicamente, problemas com declarações preparadas no lado do servidor levaram os desenvolvedores do **Connector/J** e do **Connector/PHP** a, às vezes, usar declarações preparadas no lado do **cliente** em vez disso. Com versões modernas do servidor MySQL, declarações preparadas no lado do servidor são recomendadas para desempenho, escalabilidade e eficiência de memória.

Veja também  declaração preparada no lado do cliente,  Connector/J,  Connector/PHP,  declaração preparada.

nome do principal do serviço :   O nome para uma entidade nomeada Kerberos que representa um serviço.

Veja também  principal.

bilhete do serviço :   Um bilhete Kerberos que fornece acesso a um serviço de aplicativo, como o serviço fornecido por um servidor web ou de banco de dados.

servlet :   Veja também  Connector/J.

espaço de tabelas temporário de sessão :   Um *espaço de tabelas temporário* que armazena *tabelas temporárias* criadas pelo usuário e *tabelas temporárias* internas criadas pelo *optimizador* quando o `InnoDB` é configurado como o motor de armazenamento em disco para tabelas temporárias internas.

Veja também  optimizador,  tabela temporária,  espaço de tabelas temporário.

bloqueio compartilhado :   Um tipo de **bloqueio** que permite que outras **transações** leiam o objeto bloqueado e também adquiram outros bloqueios compartilhados nele, mas não escrevam nele. O oposto de **bloqueio exclusivo**.

Veja também  bloqueio exclusivo,  bloqueio,  transação.

espaço de tabelas compartilhado:  Outra maneira de se referir ao **espaço de tabelas do sistema** ou a um **espaço de tabelas geral**. Os espaços de tabelas gerais foram introduzidos no MySQL 5.7. Mais de uma tabela pode residir em um espaço de tabelas compartilhado. Apenas uma única tabela pode residir em um espaço de tabelas *file-per-table*.

Veja também  espaço de tabelas geral,  espaço de tabelas do sistema.

ponto de verificação rápido:   O processo de **esvaziar** para o disco todas as páginas do **pool de buffers** **sujas** cujas entradas de redo estão contidas em uma parte específica do **log de redo**. Ocorre antes de o `InnoDB` reutilizar uma parte de um arquivo de log; os arquivos de log são usados de forma circular. Tipicamente ocorre com cargas de trabalho **intensivas de escrita**.

Veja também  página suja,  esvaziar,  log de redo,  carga de trabalho.

shutdown:   O processo de parar o servidor MySQL. Por padrão, esse processo limpa as operações para as tabelas `InnoDB`, então o `InnoDB` pode ser **lento** para desligar, mas rápido para iniciar mais tarde. Se você pular as operações de limpeza, é **rápido** para desligar, mas a limpeza deve ser realizada durante o próximo reinício.

O modo de desligamento para o `InnoDB` é controlado pela opção  `innodb_fast_shutdown`.

Veja também  desligamento rápido,  InnoDB,  desligamento lento,  inicialização.

slave:   Veja  replica.

log de consultas lentas:   Um tipo de **log** usado para o ajuste de desempenho de instruções SQL processadas pelo servidor MySQL. As informações do log são armazenadas em um arquivo. Você deve habilitar essa funcionalidade para usá-la. Você controla quais categorias de instruções SQL "lentas" são registradas. Para mais informações, consulte  Seção 7.4.5, “O Log de Consultas Lentas”.

Veja também  log de consulta geral,  log.

desligamento lento:   Um tipo de **desligamento** que realiza operações adicionais de **esvaziamento** do `InnoDB` antes de completar. Também conhecido como **desligamento limpo**. Especificado pelo parâmetro de configuração  `innodb_fast_shutdown=0` ou pelo comando `SET GLOBAL innodb_fast_shutdown=0;`. Embora o desligamento em si possa levar mais tempo, esse tempo deve ser economizado no reinício subsequente.

Veja também  parada limpa,  parada rápida,  parada.

instantâneos:   Uma representação dos dados em um momento específico, que permanece igual mesmo quando as alterações são **comitadas** por outras **transações**. Utilizado por certos **níveis de isolamento** para permitir **leitura consistente**.

Veja também  comitar,  leitura consistente,  nível de isolamento,  transação.

buffer de ordenação:   O buffer utilizado para ordenar os dados durante a criação de um índice `InnoDB`. O tamanho do buffer de ordenação é configurado usando a opção de configuração  `innodb_sort_buffer_size`.

fonte:   Um servidor de banco de dados em um cenário de **replicação** que processa as solicitações iniciais de inserção, atualização e exclusão de dados. Essas alterações são propagadas e repetidas em outros servidores conhecidos como **replicas**.

Veja também  replica,  replicação.

ID de espaço:   Um identificador usado para identificar de forma única um **espaço de tabelas** `InnoDB` dentro de uma instância do MySQL. O ID de espaço para o **espaço de tabelas do sistema** é sempre zero; esse mesmo ID se aplica a todas as tabelas dentro do espaço de tabelas do sistema ou dentro de um espaço de tabelas geral. Cada **espaço de tabelas por arquivo** e **espaço de tabelas geral** tem seu próprio ID de espaço.

Anteriormente, no MySQL 5.6, esse valor codificado apresentou dificuldades na movimentação de arquivos de espaço `InnoDB` entre instâncias do MySQL. A partir do MySQL 5.6, você pode copiar arquivos de espaço entre instâncias usando a funcionalidade de **espaço transponível**, envolvendo as instruções `FLUSH TABLES ... FOR EXPORT`, `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE`. As informações necessárias para ajustar o ID de espaço são transmitidas no **arquivo .cfg**, que você copia junto com o espaço. Veja  Seção 17.6.1.3, “Importando Tabelas InnoDB” para detalhes.

Veja também  arquivo .cfg,  arquivo por tabela,  espaço geral,  arquivo .ibd,  espaço do sistema,  espaço,  espaço transponível.

arquivo esparso:   Um tipo de arquivo que utiliza o espaço do sistema de arquivos de forma mais eficiente, escrevendo metadados que representam blocos vazios no disco em vez de escrever o espaço vazio real. O recurso de **compressão transparente de páginas** do **InnoDB** depende do suporte a arquivos esparsos. Para mais informações, consulte a Seção 17.9.2, “Compressão de Páginas do InnoDB”.

Veja também  perforação,  compressão transparente de páginas.

spin:   Um tipo de **operação de espera** que testa continuamente se um recurso fica disponível. Essa técnica é usada para recursos que geralmente são mantidos por períodos breves, onde é mais eficiente esperar em um "loop ocupado" do que colocar o thread em sono e realizar uma troca de contexto. Se o recurso não ficar disponível em um curto período de tempo, o loop de espera cessa e outra técnica de espera é usada.

Veja também  latche,  bloqueio,  mutex,  espera.

SPN:   Veja  nome do principal do serviço.

Spring:   Um framework de aplicação baseado em Java projetado para auxiliar no design da aplicação, fornecendo uma maneira de configurar componentes.

Veja também  J2EE.

SQL:   O Linguagem de Consulta Estruturada padrão para realizar operações de banco de dados. Muitas vezes dividido nas categorias **DDL**, **DML** e **consultas**. O MySQL inclui algumas categorias de instruções adicionais, como **replicação**. Consulte o Capítulo 11, *Estrutura da Linguagem* para os blocos de construção da sintaxe do SQL, o Capítulo 13, *Tipos de Dados* para os tipos de dados a serem usados para as colunas das tabelas do MySQL, o Capítulo 15, *Instruções SQL* para detalhes sobre as instruções SQL e suas categorias associadas, e o Capítulo 14, *Funções e Operadores* para funções padrão e específicas do MySQL a serem usadas em consultas.

Veja também  DDL,  DML,  consulta,  replicação.

SQLState:   Um código de erro definido pelo padrão **JDBC**, para o tratamento de exceções por aplicações que usam o **Connector/J**.

Veja também  Connector/J,  JDBC.

SSD: Abreviação para "disco de estado sólido". Um tipo de dispositivo de armazenamento com características de desempenho diferentes de um disco rígido tradicional (**HDD**): menor capacidade de armazenamento, mais rápido para leituras aleatórias, sem partes móveis e com várias considerações que afetam o desempenho de escrita. Suas características de desempenho podem influenciar o desempenho de uma carga de trabalho **ligada a disco**.

Veja também  disco-ligado,  HDD.

SSL: Abreviação para "camada de sockets seguros". Fornece a camada de criptografia para a comunicação de rede entre uma aplicação e um servidor de banco de dados MySQL.

Veja também  keystore,  truststore.

ST: Veja  bilhete de serviço.

startup: O processo de inicialização do servidor MySQL. Normalmente feito por um dos programas listados em  Seção 6.3, “Programas de servidor e inicialização do servidor”. O oposto de **shutdown**.

Veja também  shutdown.

intérprete de declarações: Um tipo de **intérprete** para rastreamento, depuração ou ampliação de declarações SQL emitidas por uma aplicação de banco de dados. Às vezes também conhecido como **intérprete de comandos**.

Em aplicações **Java** que usam **Connector/J**, configurar esse tipo de intérprete envolve a implementação da interface `com.mysql.jdbc.StatementInterceptorV2` e a adição de uma propriedade `statementInterceptors` à **string de conexão**.

Em aplicações **Visual Studio** que usam **Connector/NET**, configurar esse tipo de intérprete envolve a definição de uma classe que herda da classe `BaseCommandInterceptor` e a especificação do nome dessa classe como parte da string de conexão.

Veja também  intérprete de comandos,  string de conexão,  Connector/J,  Connector/NET,  intérprete,  Java,  Visual Studio.

replicação baseada em declarações: Uma forma de **replicação** em que as declarações SQL são enviadas do **fonte** e regravadas no **replica**. Requer algum cuidado com a configuração da opção  `innodb_autoinc_lock_mode`, para evitar potenciais problemas de sincronização com o **bloqueio de autoincremento**.

Veja também  bloqueio de autoincremento,  innodb\_autoinc\_lock\_mode,  replica,  replicação,  replicação baseada em linha,  fonte.

estatísticas:   Valores estimados relacionados a cada **tabela** e **índice** do **InnoDB**, usados para construir um plano de execução de consultas eficiente. Os principais valores são a **cardinalidade** (número de valores distintos) e o número total de linhas da tabela ou entradas de índice. As estatísticas da tabela representam os dados em seu **índice de chave primária**. As estatísticas de um **índice secundário** representam as linhas cobertas por esse índice.

Os valores são estimados em vez de contados com precisão porque, em qualquer momento, diferentes **transações** podem estar inserindo e excluindo linhas da mesma tabela. Para evitar que os valores sejam recalculados frequentemente, você pode habilitar **estatísticas persistentes**, onde os valores são armazenados em tabelas do sistema do **InnoDB** e atualizados apenas quando você emitir uma declaração  `ANALYZE TABLE`.

Você pode controlar como os valores **NULL** são tratados ao calcular estatísticas por meio da opção de configuração  `innodb_stats_method`.

Outros tipos de estatísticas estão disponíveis para objetos de banco de dados e atividade do banco de dados por meio das tabelas **`INFORMATION_SCHEMA`** e **`PERFORMANCE_SCHEMA`**.

Veja também  cardinalidade,  índice,  `INFORMATION_SCHEMA`,  NULL,  Schema de desempenho,  estatísticas persistentes,  chave primária,  plano de execução de consultas,  índice secundário,  tabela,  transação.

stemming:   A capacidade de buscar diferentes variações de uma palavra com base em uma palavra raiz comum, como singular e plural, ou tempo verbal passado, presente e futuro. Esta funcionalidade é atualmente suportada na funcionalidade de **pesquisa de texto completo** do **MyISAM** mas não nos **índices FULLTEXT** para tabelas do **InnoDB**.

Veja também  pesquisa de texto completo,  índice FULLTEXT.

palavra-chave:   Em um **índice FULLTEXT**, uma palavra considerada comum ou trivial o suficiente para ser omitida do **índice de pesquisa** e ignorada em consultas de pesquisa. Diferentes configurações controlam o processamento de palavras-chave de stop no `InnoDB` e `MyISAM`. Consulte  Seção 14.9.4, “Palavras-chave de stop de FULLTEXT” para detalhes.

    Veja também  índice FULLTEXT,  índice de pesquisa.

motor de armazenamento:   Um componente do banco de dados MySQL que realiza o trabalho de baixo nível de armazenamento, atualização e consulta de dados. No MySQL 5.5 e versões superiores, o **InnoDB** é o motor de armazenamento padrão para novas tabelas, substituindo o `MyISAM`. Diferentes motores de armazenamento são projetados com diferentes compromissos entre fatores como uso de memória versus uso de disco, velocidade de leitura versus velocidade de escrita e velocidade versus robustez. Cada motor de armazenamento gerencia tabelas específicas, então nos referimos às tabelas `InnoDB`, `MyISAM` e assim por diante.

    O produto **MySQL Enterprise Backup** é otimizado para fazer backup de tabelas `InnoDB`. Ele também pode fazer backup de tabelas manipuladas pelo `MyISAM` e outros motores de armazenamento.

    Veja também  InnoDB,  MySQL Enterprise Backup,  tipo de tabela.

coluna gerada armazenada:   Uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Os valores da coluna são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna gerada armazenada requer espaço de armazenamento e pode ser indexada.

    Compare com **coluna gerada virtual**.

    Veja também  coluna base,  coluna gerada,  coluna gerada virtual.

objeto armazenado:   Um programa ou visual armazenado.

programa armazenado:   Uma rotina armazenada (procedimento ou função), gatilho ou evento do Agendamento de Eventos.

rotina armazenada:   Uma rotina ou função armazenada.

modo estrito:   O nome genérico para a configuração controlada pela opção `innodb_strict_mode`. Ativação desta configuração faz com que certas condições que normalmente são tratadas como avisos sejam consideradas erros. Por exemplo, certas combinações inválidas de opções relacionadas ao **formato de arquivo** e **formato de linha**, que normalmente produzem um aviso e continuam com valores padrão, agora causam o falhar da operação `CREATE TABLE`. `innodb_strict_mode` está habilitado por padrão no MySQL 5.7.

    O MySQL também tem algo chamado modo estrito. Veja  Seção 7.1.11, “Modos SQL do servidor”.

    Veja também  formato de arquivo,  innodb\_strict\_mode,  formato de linha.

registro máximo:   Um **registro pseudo** em um índice, representando o **gap** acima do maior valor nesse índice. Se uma transação tiver uma instrução como `SELECT ... FROM ... WHERE col > 10 FOR UPDATE;`, e o maior valor na coluna for 20, é um bloqueio no registro máximo que impede que outras transações insiram valores ainda maiores, como 50, 100, e assim por diante.

    Veja também  gap,  registro mínimo,  registro pseudo.

chave suplente:   Nome sinônimo para **chave sintética**.

    Veja também  chave sintética.

chave sintética:   Uma coluna indexada, tipicamente uma **chave primária**, onde os valores são atribuídos arbitrariamente. Muitas vezes, isso é feito usando uma coluna de **autoincremento**. Ao tratar o valor como completamente arbitrário, você pode evitar regras excessivamente restritivas e suposições de aplicação incorretas. Por exemplo, uma sequência numérica representando números de funcionários pode ter uma lacuna se um funcionário foi aprovado para contratação, mas nunca realmente se juntou. Ou o número de funcionário 100 pode ter uma data de contratação mais recente do que o número de funcionário 500, se ele deixou a empresa e depois voltou. Os valores numéricos também produzem valores mais curtos de comprimento previsível. Por exemplo, armazenar códigos numéricos que significam “Rodovia”, “Bulevar”, “Autoestrada”, e assim por diante é mais eficiente em termos de espaço do que repetir essas strings várias vezes.

    Também conhecida como **chave suplente**. Contrasta com **chave natural**.

    Veja também  autoincremento,  chave natural,  chave primária,  chave suplente.

system tablespace:   Um ou mais arquivos de dados (**arquivos ibdata**) contendo os metadados para objetos relacionados ao `InnoDB`, e as áreas de armazenamento para o **buffer de alterações** e o **buffer de dupla escrita**. Também pode conter dados de tabela e índice para tabelas `InnoDB` se as tabelas foram criadas no system tablespace em vez de **tablespaces por arquivo** ou **tablespaces gerais**. Os dados e metadados no system tablespace se aplicam a todos os **bancos de dados** em uma **instância** do MySQL.

Antes do MySQL 5.6.7, o padrão era manter todas as tabelas e índices `InnoDB` dentro do espaço de tabelas do sistema, o que frequentemente fazia com que esse arquivo se tornasse muito grande. Como o espaço de tabelas do sistema nunca diminui, problemas de armazenamento poderiam surgir se grandes quantidades de dados temporários fossem carregados e depois excluídos. No MySQL 8.0, o padrão é o modo **arquivo por tabela**, onde cada tabela e seus índices associados são armazenados em um arquivo **.ibd** separado. Esse padrão facilita o uso de recursos do `InnoDB` que dependem de formatos de linha **DINÂMICOS** e **COMPACTADOS**, como a compressão da tabela, o armazenamento eficiente de colunas **fora da página** e grandes prefixos de chaves de índice.

Manter todos os dados da tabela no espaço de tabelas do sistema ou em arquivos **.ibd** separados tem implicações para a gestão de armazenamento em geral. O produto **MySQL Enterprise Backup** pode fazer backup de um pequeno conjunto de arquivos grandes ou muitos arquivos menores. Em sistemas com milhares de tabelas, as operações do sistema de arquivos para processar milhares de arquivos **.ibd** podem causar gargalos.

O `InnoDB` introduziu espaços de tabelas gerais no MySQL 5.7.6, que também são representados por arquivos **.ibd**. Os espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados, são capazes de conter múltiplas tabelas e suportam tabelas de todos os formatos de linha.

Veja também  mudar buffer,  compressão,  dicionário de dados,  banco de dados,  buffer de escrita dupla,  formato de linha dinâmico,  arquivo por tabela,  espaço de tabelas geral,  arquivo .ibd,  arquivo ibdata,  innodb\_file\_per\_table,  instância,  MySQL Enterprise Backup,  coluna fora da página,  espaço de tabelas,  registro de desfazer.

* O espaço de sistema compartilhado `InnoDB`, que é composto por um ou mais arquivos `ibdata`.
* Um espaço de tabela por arquivo, composto por um arquivo `.ibd` individual.
* Um espaço de tabela geral compartilhado, composto por um arquivo `.ibd` individual. Os espaços de tabela gerais foram introduzidos no MySQL 5.7.6.

Os arquivos de dados `.ibd` contêm dados de tabela e **índice**.

As tabelas `InnoDB` criadas em espaços de tabela por arquivo podem usar o formato de linha **DINÂMICO** ou **COMPREENSO**. Esses formatos de linha permitem recursos do `InnoDB`, como **compressão**, armazenamento eficiente de colunas **fora da página** e grandes prefixos de chaves de índice. Os espaços de tabela gerais suportam todos os formatos de linha.

O espaço de sistema de tabelas suporta tabelas que usam os formatos de linha **REDUCIONANTE**, **COMPACT** e **DINÂMICO**. O suporte do espaço de sistema de tabelas para o formato de linha **DINÂMICO** foi adicionado no MySQL 5.7.6.

As **linhas** de uma tabela `InnoDB` são organizadas em uma estrutura de índice conhecida como **índice agrupado**, com entradas ordenadas com base nas colunas da chave primária da tabela. O acesso aos dados é otimizado para consultas que filtram e ordenam pelas colunas da chave primária, e cada índice contém uma cópia das colunas da chave primária associadas a cada entrada. Modificar valores de qualquer uma das colunas da chave primária é uma operação cara. Assim, um aspecto importante do design de tabelas `InnoDB` é escolher uma chave primária com colunas usadas nas consultas mais importantes e manter a chave primária curta, com valores que raramente mudam.

Veja também backup, índice agrupado, formato de linha compactado, formato de linha compreendido, compressão, formato de linha dinâmico, Criação de índice rápida, espaço de tabela por arquivo, arquivo `.ibd`, índice, coluna fora da página, chave primária, formato de linha redundante, linha, espaço de sistema de tabelas, tabela.

bloqueio de tabela:   Um bloqueio que impede qualquer outra **transação** de acessar uma tabela. O `InnoDB` faz um esforço considerável para tornar esses bloqueios desnecessários, usando técnicas como **DDL online**, **bloqueios de linha** e **leitura consistente** para processar **DML** e **consultas**. Você pode criar esse tipo de bloqueio através do SQL usando a instrução `LOCK TABLE`; um dos passos na migração de outros sistemas de banco de dados ou motores de armazenamento do MySQL é remover essas instruções sempre que possível.

Veja também  leitura consistente,  DML,  bloqueio,  bloqueio de tabela,  online DDL,  consulta,  bloqueio de linha,  tabela,  transação.

varredura de tabela:   Veja  varredura completa de tabela.

estatísticas de tabela:   Veja  estatísticas.

tipo de tabela:   Símbolo obsoleto para **motor de armazenamento**. Referenciamos as tabelas `InnoDB`, as tabelas `MyISAM`, e assim por diante.

Veja também  InnoDB,  motor de armazenamento.

espaço de tabelas:   Um arquivo de dados que pode armazenar dados para uma ou mais **tabelas** `InnoDB` e índices associados.

    O **espaço de tabelas do sistema** contém o **dicionário de dados** do `InnoDB`, e, antes do MySQL 5.6, contém todas as outras tabelas `InnoDB` por padrão.

    A opção `innodb_file_per_table`, habilitada por padrão no MySQL 5.6 e superior, permite que as tabelas sejam criadas em seus próprios espaços de tabelas. Os espaços de tabelas por arquivo permitem recursos como armazenamento eficiente de **colunas fora de página**, compressão de tabelas e espaços de tabelas transportabilidade. Veja  Seção 17.6.3.2, “Espaços de Tabelas por Arquivo” para detalhes.

    O `InnoDB` introduziu espaços de tabelas gerais no MySQL 5.7.6. Os espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, são capazes de armazenar múltiplas tabelas e suportam tabelas de todos os formatos de linha.

    O MySQL NDB Cluster também agrupa suas tabelas em espaços de tabelas. Veja  Seção 25.6.11.1, “Objetos de Dados de Disco do NDB Cluster” para detalhes.

Veja também formato de linha compactada, dicionário de dados, arquivos de dados, arquivo por tabela, espaço de tabela geral, índice, innodb\_file\_per\_table, espaço de tabela do sistema, tabela.

Tcl:   Uma linguagem de programação originária do mundo de scripts Unix. Às vezes, é estendida por código escrito em **C**, **C++** ou **Java**. Para a **API** de código aberto do Tcl para o MySQL, consulte  Seção 31.12, “API Tcl do MySQL”.

    Veja também API.

tabela temporária:   Uma **tabela** cujos dados não precisam ser verdadeiramente permanentes. Por exemplo, tabelas temporárias podem ser usadas como áreas de armazenamento para resultados intermediários em cálculos ou transformações complicados; esses dados intermediários não precisam ser recuperados após um travamento. Os produtos de banco de dados podem tomar vários atalhos para melhorar o desempenho das operações em tabelas temporárias, sendo menos escrupulosos sobre a gravação de dados no disco e outras medidas para proteger os dados em reinicializações.

    Às vezes, os próprios dados são removidos automaticamente em um horário definido, como quando a transação termina ou quando a sessão termina. Com alguns produtos de banco de dados, a própria tabela é removida automaticamente também.

    Veja também tabela.

espaço de tabela temporário:   O `InnoDB` usa dois tipos de espaço de tabela temporário. *Espaços de tabela temporários de sessão* armazenam tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador. O *espaço de tabela temporário global* armazena *segmentos de rollback* para alterações feitas em tabelas temporárias criadas pelo usuário.

    Veja também espaço de tabela temporário global, espaço de tabela temporária de sessão, tabela temporária.

coleção de texto:   O conjunto de colunas incluídas em um **índice FULLTEXT**.

    Veja também índice FULLTEXT.

TGS:   Um servidor de concessão de ingressos do Kerberos. TGS também pode se referir ao serviço de concessão de ingressos fornecido por um servidor de concessão de ingressos.

    Veja também servidor de concessão de ingressos.

TGT:   Veja  ingressos de concessão de ingressos.

thread:   Uma unidade de processamento que é tipicamente mais leve que um **processo**, permitindo maior **concorrência**.

Veja também  concorrência,  thread mestre,  processo,  Pthreads.

servidor de concessão de ingressos :   Em Kerberos, um servidor que fornece ingressos. O servidor de concessão de ingressos (TGS) combinado com um servidor de autenticação (AS) formam um centro de distribuição de chaves (KDC).

    TGS também pode se referir ao serviço de concessão de ingressos fornecido pelo servidor de concessão de ingressos.

    Veja também  servidor de autenticação,  centro de distribuição de chaves.

ingressos de concessão de ingressos :   Em Kerberos, um ingresso de concessão de ingressos é apresentado ao servidor de concessão de ingressos (TGS) para obter ingressos de serviço para o acesso ao serviço.

    Veja também  servidor de concessão de ingressos.

Tomcat :   Um servidor de aplicação **J2EE** de código aberto, que implementa as tecnologias de programação Java Servlet e JavaServer Pages. Consiste em um servidor web e um container de servlet Java. Com MySQL, tipicamente usado em conjunto com **Connector/J**.

    Veja também  J2EE.

página rasgada :   Uma condição de erro que pode ocorrer devido a uma combinação de configuração do dispositivo de E/S e falha de hardware. Se os dados forem escritos em partes menores que o tamanho da **página** do **InnoDB** (padrão, 16KB), uma falha de hardware durante a escrita pode resultar em apenas parte de uma página ser armazenada no disco. O **buffer de dupla escrita** do **InnoDB** protege contra essa possibilidade.

    Veja também  buffer de dupla escrita.

TPS :   Abreviação de “**transações** por segundo”, uma unidade de medida usada às vezes em benchmarks. Seu valor depende da **carga de trabalho** representada por um teste de benchmark específico, combinada com fatores que você controla, como a capacidade do hardware e a configuração do banco de dados.

    Veja também  transação,  carga de trabalho.

transação :   As transações são unidades de trabalho atômicas que podem ser **comprometidas** ou **desfeitas**. Quando uma transação realiza múltiplas alterações no banco de dados, todas as alterações têm sucesso quando a transação é comprometida ou todas as alterações são desfeitas quando a transação é desfeita.

As transações de banco de dados, conforme implementadas pelo `InnoDB`, possuem propriedades conhecidas coletivamente pelo acrônimo **ACID**, que representa atomicidade, consistência, isolamento e durabilidade.

Veja também  ACID,  commit,  nível de isolamento,  bloqueio,  reverter.

ID de transação:   Um campo interno associado a cada **linha**. Esse campo é alterado fisicamente pelas operações  INSERT,  UPDATE e  DELETE para registrar qual **transação** bloqueou a linha.

Veja também  bloqueio implícito de linha,  linha,  transação.

comprimentos de página transparentes:   Uma funcionalidade adicionada no MySQL 5.7.8 que permite a compressão em nível de página para tabelas `InnoDB` que residem em **espaços de tabelas por arquivo**. A compressão de página é habilitada especificando o atributo `COMPRESSION` com  CREATE TABLE ou  ALTER TABLE. Para mais informações, consulte  Seção 17.9.2, “Compressão de Página InnoDB”.

Veja também  espaço por arquivo,  ponta de agulha,  arquivo esparso.

espaço de tabelas transportable:   Uma funcionalidade que permite que um **espaço de tabelas** seja movido de uma instância para outra. Tradicionalmente, isso não tem sido possível para espaços de tabelas `InnoDB` porque todos os dados da tabela faziam parte do **espaço de tabelas do sistema**. No MySQL 5.6 e versões superiores, a sintaxe  FLUSH TABLES ... FOR EXPORT prepara uma tabela `InnoDB` para cópia para outro servidor; executar  ALTER TABLE ... DISCARD TABLESPACE e  ALTER TABLE ... IMPORT TABLESPACE no outro servidor traz o arquivo de dados copiado para a outra instância. Um arquivo **.cfg** separado, copiado junto com o arquivo **.ibd**, é usado para atualizar o metadados da tabela (por exemplo, o **ID de espaço**) à medida que o espaço de tabelas é importado. Consulte  Seção 17.6.1.3, “Importando Tabelas InnoDB” para informações de uso.

Veja também  arquivo .cfg,  arquivo .ibd,  ID de espaço,  espaço de tabelas,  espaço do sistema.

solução de problemas:   O processo de determinar a origem de um problema. Alguns dos recursos para solucionar problemas com o MySQL incluem:

*  Seção 2.9.2.1, “Soluções para Problemas ao Iniciar o Servidor MySQL”
*  Seção 8.2.22, “Soluções para Problemas ao Conectar-se ao MySQL”
*  Seção B.3.3.2, “Como Redefinir a Senha do Usuário Root”
*  Seção B.3.2, “Erros Comuns ao Usar Programas MySQL”
*  Seção 17.20, “Soluções para Problemas com o InnoDB”.

truncate :   Uma operação **DDL** que remove todo o conteúdo de uma tabela, mantendo a tabela e os índices relacionados intactos. Contrasta com **drop**. Embora conceitualmente tenha o mesmo resultado que uma instrução `DELETE` sem cláusula `WHERE`, opera de maneira diferente nos bastidores: o `InnoDB` cria uma nova tabela vazia, exclui a tabela antiga e, em seguida, renomeia a nova tabela para ocupar o lugar da antiga. Como se trata de uma operação **DDL**, não pode ser **revertida**.

Se a tabela que está sendo truncada contiver **chaves estrangeiras** que referenciam outra tabela, a operação de truncação usa um método de operação mais lento, excluindo uma linha de cada vez para que as linhas correspondentes na tabela referenciada possam ser excluídas conforme necessário por qualquer cláusula `ON DELETE CASCADE`. (O MySQL 5.5 e versões superiores não permitem essa forma mais lenta de truncar e retornam um erro se chaves estrangeiras estiverem envolvidas. Nesse caso, use uma instrução `DELETE` em vez disso.)

Veja também  DDL,  drop,  chave estrangeira,  reverter.

truststore :   Veja também  SSL.

tuple :   Um termo técnico que designa um conjunto ordenado de elementos. É uma noção abstrata, usada em discussões formais sobre a teoria de bancos de dados. No campo de bancos de dados, tuplos são geralmente representados pelas colunas de uma linha de tabela. Eles também podem ser representados pelos conjuntos de resultados de consultas, por exemplo, consultas que recuperaram apenas algumas colunas de uma tabela ou colunas de tabelas unidas.

Veja também  cursor.

commit:   Uma operação que faz parte de uma **transação** distribuída, conforme a especificação **XA**. (Às vezes abreviada como 2PC.) Quando várias bases de dados participam da transação, todas as bases de dados **confirmam** as alterações ou todas as bases de dados **anulam** as alterações.

Veja também  commit,  rollback,  transação,  XA.

### U

undo:   Dados que são mantidos ao longo da vida de uma **transação**, registrando todas as alterações para que possam ser desfeitas em caso de uma operação de **rollback**. Eles são armazenados em **logs de undo** ou dentro do **espaço de tabelas do sistema** (no MySQL 5.7 ou versões anteriores) ou em espaços de tabelas de undo separados. A partir do MySQL 8.0, os logs de undo residem em espaços de tabelas de undo por padrão.

Veja também  rollback,  rollback segment,  espaço de tabelas do sistema,  transação,  log de undo,  espaço de tabelas de undo.

undo buffer:  Veja  log de undo.

log de undo:   Uma área de armazenamento que contém cópias dos dados modificados por **transações** ativas. Se outra transação precisar ver os dados originais (como parte de uma operação de **leitura consistente**), os dados não modificados são recuperados dessa área de armazenamento.

No MySQL 5.6 e MySQL 5.7, você pode usar a variável  `innodb_undo_tablespaces` para que os logs de undo residam em **espaços de tabelas de undo**, que podem ser colocados em outro dispositivo de armazenamento, como um **SSD**. No MySQL 8.0, os logs de undo residem em dois espaços de tabelas de undo padrão que são criados quando o MySQL é inicializado, e espaços de tabelas de undo adicionais podem ser criados usando a sintaxe  `CREATE UNDO TABLESPACE`.

O log de undo é dividido em porções separadas, o **buffer de undo de inserção** e o **buffer de undo de atualização**.

Veja também  leitura consistente,  rollback segment,  SSD,  espaço de tabelas do sistema,  transação,  espaço de tabelas de undo.

segmento de log de desfazer:   Uma coleção de **logs de desfazer**. Segmentos de log de desfazer existem dentro de **segmentos de rollback**. Um segmento de log de desfazer pode conter logs de desfazer de várias transações. Um segmento de log de desfazer só pode ser usado por uma transação de cada vez, mas pode ser reutilizado após ser liberado na **comissão** ou **descomissão** da transação. Também pode ser referido como um "segmento de desfazer".

Veja também  comissão,  descomissão,  segmento de rollback,  log de desfazer.

espaço de tabelas de desfazer:   Um espaço de tabelas de desfazer contém **logs de desfazer**. Os logs de desfazer existem dentro de **segmentos de log de desfazer**, que estão contidos dentro de **segmentos de rollback**. Os segmentos de rollback tradicionalmente residiam no espaço de tabelas do sistema. A partir do MySQL 5.6, os segmentos de rollback podem residir em espaços de tabelas de desfazer. No MySQL 5.6 e MySQL 5.7, o número de espaços de tabelas de desfazer é controlado pela opção de configuração  `innodb_undo_tablespaces`. No MySQL 8.0, dois espaços de tabelas de desfazer padrão são criados quando a instância do MySQL é inicializada, e espaços de tabelas de desfazer adicionais podem ser criados usando a sintaxe  `CREATE UNDO TABLESPACE`.

    Para mais informações, consulte  Seção 17.6.3.4, “Espaços de tabelas de desfazer”.

    Veja também  segmento de rollback,  espaço de tabelas do sistema,  log de desfazer,  segmento de log de desfazer.

Unicode:   Um sistema para suportar caracteres nacionais, conjuntos de caracteres, páginas de código e outros aspectos de internacionalização de maneira flexível e padronizada.

O suporte Unicode é um aspecto importante do **padrão ODBC**. O **Connector/ODBC** 5.1 é um driver Unicode, ao contrário do **Connector/ODBC** 3.51, que é um driver **ANSI**.

Veja também  ANSI,  Connector/ODBC,  ODBC.

construtor exclusivo:   Um tipo de **construtor** que afirma que uma coluna não pode conter valores duplicados. Em termos de álgebra relacional, é usado para especificar relações 1-para-1. Para a eficiência na verificação de se um valor pode ser inserido (ou seja, o valor não existe já na coluna), um construtor exclusivo é suportado por um **índice exclusivo** subjacente.

Veja também restrição, índice relacional, índice exclusivo.

índice exclusivo:   Um índice em uma coluna ou conjunto de colunas que possui uma **restrição exclusiva**. Como o índice é conhecido por não conter valores duplicados, certos tipos de consultas e operações de contagem são mais eficientes do que no tipo normal de índice. A maioria das consultas contra esse tipo de índice é simplesmente para determinar se um determinado valor existe ou não. O número de valores no índice é o mesmo que o número de linhas na tabela, ou pelo menos o número de linhas com valores não nulos para as colunas associadas.

A otimização de **alteração de buffer** não se aplica a índices exclusivos. Como solução alternativa, você pode definir temporariamente `unique_checks=0` enquanto realiza uma carga de dados em massa em uma tabela `InnoDB`.

Veja também cardinalidade, alteração de buffer, restrição exclusiva, chave exclusiva.

chave exclusiva:   O conjunto de colunas (uma ou mais) que compõem um **índice exclusivo**. Quando você pode definir uma condição `WHERE` que corresponde exatamente a uma linha, e a consulta pode usar um índice exclusivo associado, a consulta e o tratamento de erros podem ser realizados de forma muito eficiente.

Veja também cardinalidade, restrição exclusiva, índice exclusivo.

UPN:   Veja  nome do principal do usuário.

nome do principal do usuário:   O nome de uma entidade nomeada do Kerberos que representa um usuário.

Veja também principal.

### V

tipo de comprimento variável:   Um tipo de dados de comprimento variável. Os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` são tipos de comprimento variável.

O `InnoDB` trata campos de comprimento fixo maiores ou iguais a 768 bytes como campos de comprimento variável, que podem ser armazenados **fora da página**. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Veja também coluna fora da página, página de overflow.

vítima:   A **transação** que é automaticamente escolhida para ser **revertida** quando um **bloqueio** é detectado. O `InnoDB` reverte a transação que atualizou o menor número de linhas.

A detecção de **bloqueio** pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

Veja também **bloqueio**, detecção de bloqueio, `innodb\_lock\_wait\_timeout`, transação.

**Consulta armazenada** que, quando invocada, produz um conjunto de resultados. Uma consulta armazenada atua como uma tabela virtual.

**Coluna virtual**: Veja **coluna gerada virtualmente**.

**Coluna gerada virtualmente**: Uma coluna cujo valor é calculado a partir de uma expressão incluída na definição da coluna. Os valores da coluna não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna gerada virtualmente não ocupa armazenamento. O `InnoDB` suporta índices secundários em colunas geradas virtualmente.

**Contrastando com** **coluna gerada armazenada**.

**Veja também** **coluna base**, **coluna gerada**, **coluna gerada armazenada**.

**Índice virtual**: Um índice virtual é um **índice secundário** em uma ou mais **colunas geradas virtualmente** ou em uma combinação de colunas geradas virtualmente e colunas regulares ou colunas geradas armazenadas. Para mais informações, consulte a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

**Veja também** **índice secundário**, **coluna gerada armazenada**, **coluna gerada virtualmente**.

**Visual Studio**: Para as versões suportadas do Visual Studio, consulte as seguintes referências:

* Connector/NET: **Versões do Connector/NET**
* Connector/C++ 8.0: **Suporte à plataforma e pré-requisitos**

**Veja também** **Connector/C++**, **Connector/NET**.

Em sistemas com carga pesada e muitas transações, você pode usar o resultado do comando `SHOW INNODB STATUS` ou o **Performance Schema** para determinar se os threads estão gastando muito tempo esperando, e, se sim, como você pode melhorar a **concorrência**.

Veja também  concorrência,  latche,  bloqueio,  mutex,  Performance Schema,  spin.

backup quente: Um **backup** feito enquanto o banco de dados está em execução, mas que restringe algumas operações do banco de dados durante o processo de backup. Por exemplo, as tabelas podem se tornar somente leitura. Para aplicações e sites ocupados, você pode preferir um **backup quente**.

Veja também  backup,  backup frio,  backup quente.

aquecer: Para executar um sistema sob uma **carga de trabalho** típica por algum tempo após o início, para que o **buffer pool** e outras regiões de memória sejam preenchidas como estariam em condições normais. Esse processo acontece naturalmente ao longo do tempo quando um servidor MySQL é reiniciado ou submetido a uma nova carga de trabalho.

Tipicamente, você executa uma carga de trabalho por algum tempo para aquecer o buffer pool antes de executar testes de desempenho, para garantir resultados consistentes em várias execuções; caso contrário, o desempenho pode ser artificialmente baixo durante a primeira execução.

No MySQL 5.6, você pode acelerar o processo de aquecimento habilitando as opções de configuração  `innodb_buffer_pool_dump_at_shutdown` e  `innodb_buffer_pool_load_at_startup`, para trazer o conteúdo do buffer pool de volta à memória após um reinício. Essas opções são habilitadas por padrão no MySQL 5.7. Veja  Seção 17.8.3.6, “Salvar e Restaurar o Estado do Buffer Pool”.

Veja também  buffer pool,  carga de trabalho.

carga de trabalho:   A combinação e o volume de **SQL** e outras operações do banco de dados, realizadas por um aplicativo de banco de dados durante o uso típico ou de pico. Você pode submeter o banco de dados a uma carga de trabalho específica durante testes de desempenho para identificar **obstáculos**, ou durante o planejamento de capacidade.

Veja também  obstáculo,  CPU-bound,  disk-bound,  SQL.

Escrever em combinação:   Uma técnica de otimização que reduz as operações de escrita quando as **páginas sujas** são **limpos** do **pool de buffer** do `InnoDB`. Se uma linha em uma página for atualizada várias vezes ou várias linhas na mesma página forem atualizadas, todas essas alterações são armazenadas nos arquivos de dados em uma única operação de escrita, em vez de uma única escrita para cada alteração.

Veja também  pool de buffer,  página suja,  limpeza.

### X

XA:   Uma interface padrão para coordenar **transações distribuídas**, permitindo que múltiplas bases de dados participem de uma transação enquanto mantêm a conformidade **ACID**. Para detalhes completos, consulte  Seção 15.3.8, “Transações XA”.

    O suporte a Transações XA Distribuídas está habilitado por padrão.

    Veja também  ACID,  registro binário,  commit,  transação,  commit de dois estágios.

### Y

jovem:   Uma característica de uma **página** no **pool de buffer** do `InnoDB`, indicando que foi acessada recentemente e, portanto, é movida dentro da estrutura de dados do pool de buffer, para que não seja **limpa** muito cedo pelo algoritmo **LRU**. Este termo é usado em alguns nomes de colunas do **`INFORMATION_SCHEMA`** de tabelas relacionadas ao pool de buffer.

    Veja também  pool de buffer,  limpeza,  `INFORMATION_SCHEMA`,  LRU,  página.