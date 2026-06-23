# Glossário do MySQL

Esses termos são comumente usados em informações sobre o servidor de banco de dados MySQL.

### A

.ARM arquivo: Metadados para as tabelas `ARCHIVE`. Contrasta com o arquivo **.ARZ**. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

Veja também o arquivo .ARZ, o MySQL Enterprise Backup e o comando mysqlbackup.

.ARZ arquivo: Dados para tabelas ARCHIVE. Contrasta com o arquivo **.ARM**. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

Veja também o arquivo .ARM, MySQL Enterprise Backup, comando mysqlbackup.

ACID: Um acrônimo que significa atomicidade, consistência, isolamento e durabilidade. Essas propriedades são todas desejáveis em um sistema de banco de dados, e estão todas intimamente ligadas à noção de uma **transação**. As características transacionais do `InnoDB` aderem aos princípios ACID.

As transações são unidades **atómicas** de trabalho que podem ser **comprometidas** ou **desfeitas**. Quando uma transação faz múltiplas alterações no banco de dados, todas as alterações têm sucesso quando a transação é comprometida, ou todas as alterações são desfeitas quando a transação é desfeita.

O banco de dados permanece em um estado consistente em todos os momentos — após cada commit ou rollback e enquanto as transações estão em andamento. Se os dados relacionados estão sendo atualizados em várias tabelas, as consultas veem todos os valores antigos ou todos os novos, não uma mistura de valores antigos e novos.

As transações são protegidas (isoladas) umas das outras enquanto estão em andamento; elas não podem interferir umas nas outras ou ver os dados não comprometidos das outras. Esse isolamento é alcançado através do mecanismo de **bloqueio**. Usuários experientes podem ajustar o **nível de isolamento**, trocando menos proteção em favor de maior desempenho e **concorrência**, quando podem ter certeza de que as transações realmente não interferem umas nas outras.

Os resultados das transações são duráveis: uma vez que uma operação de commit tenha sucesso, as alterações feitas por essa transação estão seguras contra falhas de energia, falhas do sistema, condições de corrida ou outros perigos potenciais aos quais muitas aplicações que não são de banco de dados são vulneráveis. A durabilidade geralmente envolve a escrita em armazenamento em disco, com uma certa quantidade de redundância para proteger contra falhas de energia ou falhas de software durante operações de escrita. (Em `InnoDB`, o **buffer de dupla escrita** auxilia na durabilidade.)

Veja também atomic, commit, concorrência, buffer de escrita dupla, nível de isolamento, bloqueio, rollback, transação.

varredura adaptativa: Um algoritmo para tabelas do **InnoDB** que suaviza o overhead de I/O introduzido pelos **pontos de verificação**. Em vez de **varrer** todas as **páginas** modificadas do **pool de buffer** para os **arquivos de dados** de uma vez, o MySQL varre periodicamente pequenos conjuntos de páginas modificadas. O algoritmo de varredura adaptativa estende esse processo, estimando a taxa ótima para realizar essas varreduras periódicas, com base na taxa de varredura e na rapidez com que as informações de **redo** são geradas.

Veja também: buffer pool, ponto de verificação, arquivos de dados, esvaziar, InnoDB, página, registro redo.

índice de hash adaptável: Uma otimização para as tabelas `InnoDB` que pode acelerar as pesquisas usando operadores `=` e `IN`, construindo um **índice de hash** em memória. O MySQL monitora as pesquisas de índice para as tabelas `InnoDB`, e se as consultas podem se beneficiar de um índice de hash, ele constrói automaticamente um para **páginas** de índice que são frequentemente acessadas. Em certo sentido, o índice de hash adaptável configura o MySQL em tempo de execução para aproveitar a ampla memória principal, aproximando-se da arquitetura de bancos de memória principal. Esta funcionalidade é controlada pela opção de configuração `innodb_adaptive_hash_index`. Como esta funcionalidade beneficia algumas cargas de trabalho e não outras, e a memória usada para o índice de hash é reservada na **pool de buffer**, normalmente você deve fazer uma benchmark com esta funcionalidade habilitada e desabilitada.

O índice de hash é sempre construído com base em um índice **B-tree** existente na tabela. O MySQL pode construir um índice de hash em um prefixo de qualquer comprimento da chave definida para o B-tree, dependendo do padrão de pesquisas contra o índice. Um índice de hash pode ser parcial; o índice inteiro do B-tree não precisa ser armazenado na memória de buffer.

Veja também B-tree, pool de buffer, índice de hash, página, índice secundário.

ADO.NET: Um framework de mapeamento objeto-relacional (ORM) para aplicações construídas usando tecnologias .NET, como **ASP.NET**. Tais aplicações podem interagir com o MySQL através do componente **Connector/NET**.

Veja também .NET, ASP.net, Connector/NET, Mono, Visual Studio.

AIO: Abreviação de **I/O assíncrono**. Você pode ver essa abreviação em mensagens ou palavras-chave do `InnoDB`.

Veja também I/O assíncrono.

ANSI: Em **ODBC**, um método alternativo para suportar conjuntos de caracteres e outros aspectos de internacionalização. Contrasta com **Unicode**. O **Connector/ODBC** 3.51 é um driver ANSI, enquanto o **Connector/ODBC** 5.1 é um driver Unicode.

Veja também Conector/ODBC, ODBC, Unicode.

API: As APIs fornecem acesso de nível baixo ao protocolo MySQL e aos recursos do MySQL a partir de programas **de cliente**. Contrasta com o acesso de nível superior fornecido por um **Conectador**.

Veja também C API, cliente, conector, API nativa em C, Perl API, PHP API, Python API, Ruby API.

interface de programação de aplicativos (API): Um conjunto de funções ou procedimentos. Uma API fornece um conjunto estável de nomes e tipos para funções, procedimentos, parâmetros e valores de retorno.

aplicar: Quando um backup produzido pelo produto **MySQL Enterprise Backup** não inclui as alterações mais recentes que ocorreram enquanto o backup estava em andamento, o processo de atualização dos arquivos de backup para incluir essas alterações é conhecido como a etapa de **aplicar**. É especificado pela opção `apply-log` do comando `mysqlbackup`.

Antes das alterações serem aplicadas, referimo-nos aos arquivos como um **backup bruto**. Após as alterações serem aplicadas, referimo-nos aos arquivos como um **backup preparado**. As alterações são registradas no arquivo **ibbackup_logfile; uma vez que a etapa de aplicação é concluída, este arquivo não é mais necessário.

Veja também backup quente, ibbackup_logfile, MySQL Enterprise Backup, backup preparado, backup bruto.

AS: Um servidor de autenticação Kerberos. AS também pode se referir ao serviço de autenticação fornecido por um servidor de autenticação.

Veja também servidor de autenticação.

ASP.net: Uma estrutura para o desenvolvimento de aplicações baseadas na web usando tecnologias e linguagens **.NET**. Essas aplicações podem interagir com o MySQL através do componente **Connector/NET**.

Outra tecnologia para escrever páginas da web no lado do servidor com MySQL é o **PHP**.

Veja também .NET, ADO.NET, Connector/NET, Mono, PHP, Visual Studio.

assembramento: Uma biblioteca de código compilado em um sistema **.NET**, acessada através do **Connector/NET**. Armazenada no **GAC** para permitir a versionamento sem conflitos de nomeação.

Veja também .NET, GAC.

I/O assíncrono: Um tipo de operação de E/S que permite que outros processos prossigam antes de o E/S ser concluído. Também conhecido como **E/S não bloqueante** e abreviado como **AIO**. `InnoDB` utiliza este tipo de E/S para determinadas operações que podem ser executadas em paralelo sem afetar a confiabilidade do banco de dados, como a leitura de páginas no **buffer pool** que não foram solicitadas, mas que podem ser necessárias em breve.

Historicamente, `InnoDB` usava I/O assíncrono apenas em sistemas Windows. A partir do Plugin InnoDB 1.1 e do MySQL 5.5, `InnoDB` usa I/O assíncrono em sistemas Linux. Essa mudança introduz uma dependência em `libaio`. O I/O assíncrono em sistemas Linux é configurado usando a opção `innodb_use_native_aio`, que é habilitada por padrão. Em outros sistemas semelhantes ao Unix, o InnoDB usa apenas I/O síncrono.

Veja também buffer pool, I/O não bloqueável.

atômico: No contexto SQL, as **transações** são unidades de trabalho que ou têm sucesso totalmente (quando **comprometidas**) ou não têm efeito algum (quando **revertidas**). A propriedade indivisível ("atômica") das transações é o “A” no acrônimo **ACID**.

Veja também ACID, commit, rollback, transação.

DDL atômico: Uma declaração *DDL* atômica é aquela que combina as atualizações do *dicionário de dados*, as operações do *motor de armazenamento* e os escritos no *registro binário* associados a uma operação de DDL em uma única transação atômica. A transação é totalmente comprometida ou desfeita, mesmo que o servidor pare durante a operação. O suporte a DDL atômico foi adicionado no MySQL 8.0. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômica”.

Veja também: log binário, dicionário de dados, DDL, motor de armazenamento.

instrução atômica: instruções especiais fornecidas pela CPU, para garantir que operações críticas de baixo nível não possam ser interrompidas.

servidor de autenticação: Em Kerberos, um serviço que fornece o ingresso inicial necessário para obter um ingresso de concessão de ingresso (TGT), que é necessário para obter outros ingressos do servidor de concessão de ingresso (TGS). O servidor de autenticação (AS), combinado com um TGS, compõem um centro de distribuição de chaves (KDC).

Veja também o centro de distribuição de chaves e o servidor de concessão de ingressos.

auto-incremento: Uma propriedade de uma coluna de tabela (especificada pelo termo-chave `AUTO_INCREMENT`) que adiciona automaticamente uma sequência ascendente de valores na coluna.

Isso economiza trabalho para o desenvolvedor, pois não precisa produzir novos valores únicos ao inserir novas linhas. Isso fornece informações úteis para o otimizador de consulta, porque a coluna é conhecida por não ser nula e com valores únicos. Os valores de uma coluna desse tipo podem ser usados como chaves de busca em vários contextos, e, como são gerados automaticamente, não há motivo para alterá-los; por essa razão, as colunas de chave primária são frequentemente especificadas como auto-incrementadas.

As colunas de autoincremento podem ser problemáticas com a replicação baseada em declarações, porque a reprodução das declarações em uma replica pode não produzir o mesmo conjunto de valores de coluna que na fonte, devido a problemas de sincronização. Quando você tem uma chave primária de autoincremento, você pode usar a replicação baseada em declarações apenas com a configuração `innodb_autoinc_lock_mode=1`. Se você tiver `innodb_autoinc_lock_mode=2`, que permite maior concorrência para operações de inserção, use **replicação baseada em linhas** em vez de **replicação baseada em declarações**. A configuração `innodb_autoinc_lock_mode=0` não deve ser usada, exceto por motivos de compatibilidade.

O modo de bloqueio consecutivo (`innodb_autoinc_lock_mode=1`) é o ajuste padrão antes do MySQL 8.0.3. A partir do MySQL 8.0.3, o modo de bloqueio interlaçado (`innodb_autoinc_lock_mode=2`) é o padrão, o que reflete a mudança de replicação baseada em declarações para replicação baseada em linhas como o tipo de replicação padrão.

Veja também bloqueio de autoincremento, innodb_autoinc_lock_mode, chave primária, replicação baseada em linha, replicação baseada em declaração.

bloqueio de autoincremento: A conveniência de uma chave primária de **autoincremento** implica em algum compromisso com a concorrência. No caso mais simples, se uma transação está inserindo valores na tabela, qualquer outra transação deve esperar para fazer suas próprias inserções naquela tabela, para que as linhas inseridas pela primeira transação recebam valores consecutivos da chave primária. `InnoDB` inclui otimizações e a opção `innodb_autoinc_lock_mode` para que você possa configurar um equilíbrio ótimo entre sequências previsíveis de valores de autoincremento e **concorrência** máxima para operações de inserção.

Veja também auto-incremento, concorrência, innodb_autoinc_lock_mode.

autocommit: Uma configuração que causa uma operação de **commit** após cada **SQL** declaração. Este modo não é recomendado para trabalhar com tabelas `InnoDB` com **transações** que abrangem várias declarações. Pode ajudar no desempenho de **transações apenas de leitura** em tabelas `InnoDB`, onde minimiza o custo de **bloqueio** e geração de dados de **undo**, especialmente no MySQL 5.6.4 e superior. Também é apropriado para trabalhar com tabelas `MyISAM`, onde as transações não são aplicáveis.

Veja também commit, bloqueio, transação somente de leitura, SQL, transação, desfazer.

disponibilidade: A capacidade de lidar com e, se necessário, recuperar de falhas no host, incluindo falhas do MySQL, do sistema operacional ou do hardware, e a atividade de manutenção que, de outra forma, pode causar tempo de inatividade. Frequentemente associada à **escalabilidade** como aspectos críticos de uma implantação em larga escala.

Veja também escalabilidade.

MySQL Enterprise Backup: Um produto licenciado que realiza backups quentes de bancos de dados MySQL. Ele oferece a maior eficiência e flexibilidade ao fazer backups de tabelas `InnoDB`, mas também pode fazer backups de `MyISAM` e outros tipos de tabelas.

Veja também backup quente, InnoDB.

### B

B-tree: Uma estrutura de dados em forma de árvore que é popular para uso em índices de banco de dados. A estrutura é mantida ordenada em todos os momentos, permitindo busca rápida para correspondências exatas (operador igual) e intervalos (por exemplo, maior que, menor que e operadores `BETWEEN`). Esse tipo de índice está disponível para a maioria dos motores de armazenamento, como `InnoDB` e `MyISAM`.

Como os nós de árvore B podem ter muitas crianças, uma árvore B não é a mesma coisa que uma árvore binária, que é limitada a 2 crianças por nó.

Compare com o **índice de hash**, que está disponível apenas no motor de armazenamento `MEMORY`. O motor de armazenamento `MEMORY` também pode usar índices de B-tree, e você deve escolher índices de B-tree para as tabelas `MEMORY` se algumas consultas usarem operadores de intervalo.

O uso do termo B-tree é destinado como referência à classe geral de design de índice. As estruturas B-tree usadas pelos motores de armazenamento do MySQL podem ser consideradas como variantes devido a sofisticações que não estão presentes em um design clássico de B-tree. Para informações relacionadas, consulte a seção `InnoDB` Página Estrutura [Fil Header](/doc/internals/en/innodb-fil-header.html) do [Manual de Interno do MySQL](/doc/internals/en/index.html).

Veja também o índice de hash.

backticks: Os identificadores dentro das declarações SQL do MySQL devem ser citados usando o caractere backtick (`` ` ``) if they contain special characters or reserved words. For example, to refer to a table named `FOO#BAR` or a column named `SELECT`, you would specify the identifiers as `` `FOO#BAR` `` and `` `SELECT` ``. Como os backticks fornecem um nível extra de segurança, eles são usados extensivamente em declarações SQL geradas por programas, onde os nomes dos identificadores podem não ser conhecidos antecipadamente.

Muitos outros sistemas de banco de dados usam aspas duplas (`"`) em torno de tais nomes especiais. Para a portabilidade, você pode habilitar o modo `ANSI_QUOTES` no MySQL e usar aspas duplas em vez de barras de retorno para qualificar os nomes dos identificadores.

Veja também SQL.

backup: O processo de copiar alguns ou todos os dados e metadados de uma instância MySQL, para segurança. Também pode se referir ao conjunto de arquivos copiados. Esta é uma tarefa crucial para os DBAs. O oposto deste processo é a operação de **restauração**.

Com o MySQL, os **backup físicos** são realizados pelo produto **MySQL Enterprise Backup**, e os **backup lógicos** são realizados pelo comando `mysqldump`. Essas técnicas têm características diferentes em termos de tamanho e representação dos dados do backup, e velocidade (especialmente a velocidade da operação de restauração).

Os backups são classificados como **quentes**, **quentes** ou **frios**, dependendo de quão interferem na operação normal do banco de dados. (Os backups quentes têm a menor interferência, os backups frios a maior.)

Veja também backup frio, backup quente, backup lógico, MySQL Enterprise Backup, mysqldump, backup físico, backup quente.

coluna base: Uma coluna de tabela não gerada sobre a qual uma coluna gerada armazenada ou uma coluna gerada virtual é baseada. Em outras palavras, uma coluna base é uma coluna de tabela não gerada que faz parte de uma definição de coluna gerada.

Veja também coluna gerada, coluna gerada armazenada, coluna gerada virtual.

beta: Uma fase inicial da vida de um produto de software, quando ele está disponível apenas para avaliação, tipicamente sem um número de lançamento definido ou um número menor que 1. [[`InnoDB`] não usa a designação beta, preferindo uma fase de **adotante precoce** que pode se estender por várias versões pontuais, levando a um lançamento **GA**.

Veja também o termo adotante precoce, GA.

registro binário: Um arquivo que contém um registro de todas as declarações ou alterações de linha que tentam alterar os dados da tabela. O conteúdo do registro binário pode ser reexecutado para atualizar as réplicas em um cenário de **replicação**, ou para atualizar um banco de dados após restaurar os dados da tabela a partir de um backup. O recurso de registro binário pode ser ativado e desativado, embora a Oracle recomenda sempre ativá-lo se você usar replicação ou realizar backups.

Você pode examinar o conteúdo do log binário ou reproduzi-lo durante a replicação ou recuperação, usando o comando **mysqlbinlog**. Para obter informações completas sobre o log binário, consulte a Seção 7.4.4, “O Log Binário”. Para opções de configuração do MySQL relacionadas ao log binário, consulte a Seção 19.1.6.4, “Opções e variáveis de registro binário”.

Para o produto **MySQL Enterprise Backup**, o nome do arquivo do log binário e a posição atual dentro do arquivo são detalhes importantes. Para registrar essas informações da fonte ao fazer um backup em um contexto de replicação, você pode especificar a opção `--slave-info`.

Antes do MySQL 5.0, uma capacidade semelhante estava disponível, conhecida como registro de atualização. No MySQL 5.0 e versões posteriores, o log binário substitui o registro de atualização.

Veja também binlog, MySQL Enterprise Backup, replicação.

binlog: Um nome informal para o arquivo de **registro binário**. Por exemplo, você pode ver essa abreviação sendo usada em mensagens de e-mail ou discussões em fóruns.

Veja também o log binário.

expansão de consulta cega: um modo especial de **pesquisa de texto completo** habilitado pela cláusula `WITH QUERY EXPANSION`. Ele realiza a pesquisa duas vezes, onde a frase de pesquisa para a segunda pesquisa é a frase de pesquisa original concatenada com os poucos documentos mais altamente relevantes da primeira pesquisa. Essa técnica é principalmente aplicável para frases de pesquisa curtas, talvez apenas uma palavra. Ela pode descobrir correspondências relevantes onde o termo de pesquisa preciso não ocorre no documento.

Veja também a pesquisa de texto completo.

BLOB: Um tipo de dados SQL (`TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`) para objetos que contêm qualquer tipo de dados binários, de tamanho arbitrário. Usado para armazenar documentos, imagens, arquivos de som e outros tipos de informações que não podem ser facilmente decompostos em linhas e colunas dentro de uma tabela MySQL. As técnicas para lidar com BLOBs dentro de uma aplicação MySQL variam com cada **Conectivo** e **API**. O MySQL `Connector/ODBC` define os valores de `BLOB` como `LONGVARBINARY`. Para coleções grandes e de formato livre de dados de caracteres, o termo da indústria é **CLOB**, representado pelos tipos de dados MySQL `TEXT`.

Veja também API, CLOB, conector, Connector/ODBC.

ponto crítico: Uma parte de um sistema que é limitada em tamanho ou capacidade, que tem o efeito de limitar o desempenho geral. Por exemplo, uma área de memória pode ser menor do que o necessário; o acesso a um único recurso necessário pode impedir que múltiplos núcleos da CPU funcionem simultaneamente; ou esperar que o I/O de disco seja completado pode impedir que a CPU funcione na capacidade máxima. Remover pontos críticos tende a melhorar a **concorrência**. Por exemplo, a capacidade de ter múltiplas instâncias de `InnoDB` **pool de buffers** reduz a concorrência quando múltiplas sessões leem e escrevem no pool de buffers simultaneamente.

Veja também buffer pool, concorrência.

rebote: Uma operação de **shutdown** seguida imediatamente por um reinício. Idealmente, com um período de **aquecimento** relativamente curto, para que o desempenho e a produtividade voltem rapidamente a um alto nível.

Veja também desligamento.

allocador de amigos: Um mecanismo para gerenciar **páginas** de diferentes tamanhos no **pool de buffers** do InnoDB.

Veja também buffer pool, página, tamanho de página.

buffer: Uma área de memória ou disco usada para armazenamento temporário. Os dados são armazenados em memória para que possam ser escritos em disco de forma eficiente, com algumas operações de grande I/O em vez de muitas pequenas. Os dados são armazenados em disco para maior confiabilidade, para que possam ser recuperados mesmo quando ocorre um **crash** ou outra falha no momento mais inoportuno. Os principais tipos de buffers usados pelo InnoDB são o **buffer pool**, o **buffer doublewrite** e o **buffer de mudança**.

Veja também: buffer pool, alterar buffer, falha, buffer de escrita dupla.

pool de buffer: A área de memória que armazena dados `InnoDB` em cache para ambas as tabelas e índices. Para a eficiência de operações de leitura de alto volume, o pool de buffer é dividido em **páginas** que podem potencialmente conter várias linhas. Para a eficiência da gestão de cache, o pool de buffer é implementado como uma lista enlaçada de páginas; os dados que são raramente usados são eliminados da cache, usando uma variação do algoritmo **LRU**. Em sistemas com grande memória, você pode melhorar a concorrência dividindo o pool de buffer em várias **instâncias de pool de buffer**.

Várias variáveis de status `InnoDB`, tabelas `INFORMATION_SCHEMA` e tabelas `performance_schema` ajudam a monitorar o funcionamento interno do pool de buffers. A partir do MySQL 5.6, você pode evitar um longo período de aquecimento após o reinício do servidor, especialmente para instâncias com grandes pools de buffers, salvando o estado do pool de buffers na parada do servidor e restaurando o pool de buffers ao mesmo estado na inicialização do servidor. Veja a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

Veja também: instância do buffer pool, LRU, página, aquecimento.

instância do pool de buffer: Qualquer uma das múltiplas regiões nas quais o **pool de buffer** pode ser dividido, controlada pela opção de configuração `innodb_buffer_pool_instances`. O tamanho total da memória especificado por `innodb_buffer_pool_size` é dividido entre todas as instâncias do pool de buffer. Tipicamente, ter múltiplas instâncias do pool de buffer é apropriado para sistemas que alocam vários gigabytes para o pool de buffer `InnoDB`, com cada instância sendo de um gigabyte ou maior. Em sistemas que carregam ou procuram grandes quantidades de dados no pool de buffer de muitas sessões concorrentes, ter múltiplas instâncias do pool de buffer reduz a disputa por acesso exclusivo às estruturas de dados que gerenciam o pool de buffer.

Veja também o buffer pool.

built-in: O motor de armazenamento built-in `InnoDB` dentro do MySQL é a forma original de distribuição para o motor de armazenamento. Em contraste com o **Plugin InnoDB**. A partir do MySQL 5.5, o Plugin InnoDB é incorporado de volta à base de código do MySQL como o motor de armazenamento built-in `InnoDB` (conhecido como InnoDB 1.1).

Essa distinção é importante principalmente no MySQL 5.1, onde uma correção de recurso ou bug pode se aplicar ao Plugin InnoDB, mas não ao `InnoDB` embutido, ou vice-versa.

Veja também InnoDB.

regras de negócios: As relações e sequências de ações que formam a base do software de negócios, usado para gerir uma empresa comercial. Às vezes, essas regras são ditadas por lei, outras vezes por política da empresa. Um planejamento cuidadoso garante que as relações codificadas e aplicadas pelo banco de dados, e as ações realizadas por meio da lógica de aplicação, reflitam com precisão as verdadeiras políticas da empresa e possam lidar com situações da vida real.

Por exemplo, um funcionário que deixa uma empresa pode desencadear uma sequência de ações do departamento de recursos humanos. O banco de dados de recursos humanos também pode precisar da flexibilidade para representar dados sobre uma pessoa que foi contratada, mas ainda não começou a trabalhar. Fechar uma conta em um serviço online pode resultar na remoção de dados de um banco de dados, ou os dados podem ser movidos ou marcados para que possam ser recuperados se a conta for reaberta. Uma empresa pode estabelecer políticas em relação aos máximos, mínimos e ajustes salariais, além de verificações básicas de sanidade, como o salário não ser um número negativo. Um banco de dados de varejo pode não permitir que uma compra com o mesmo número de série seja devolvida mais de uma vez, ou pode não permitir compras com cartão de crédito acima de um certo valor, enquanto um banco de dados usado para detectar fraudes pode permitir esse tipo de coisa.

Veja também relational.

### C

.cfg arquivo: Um arquivo de metadados usado com o recurso `InnoDB` **espaço de tabela transportable**. É produzido pelo comando `FLUSH TABLES ... FOR EXPORT`, coloca uma ou mais tabelas em um estado consistente que pode ser copiado para outro servidor. O arquivo `.cfg` é copiado juntamente com o arquivo correspondente **.ibd**, e usado para ajustar os valores internos do arquivo `.ibd`, como o **ID de espaço**, durante a etapa `ALTER TABLE ... IMPORT TABLESPACE`.

Veja também o arquivo .ibd, ID de espaço, espaço de tabela transportable.

C: Uma linguagem de programação que combina portabilidade com desempenho e acesso a recursos de hardware de nível baixo, tornando-a uma escolha popular para escrever sistemas operacionais, drivers e outros tipos de software de sistema. Muitas aplicações complexas, linguagens e módulos reutilizáveis apresentam partes escritas em C, unidas com componentes de alto nível escritos em outras linguagens. Sua sintaxe central é familiar para desenvolvedores de **C++**, **Java** e **C#**.

Veja também C API, C++, C#, Java.

C API: O código **API** C é distribuído com o MySQL. Ele está incluído na biblioteca **libmysqlclient** e permite que os programas em **C** acessem um banco de dados.

Veja também API, C, libmysqlclient.

C#: Uma linguagem de programação que combina tipos fortes e recursos orientada a objetos, executando dentro da estrutura **.NET** da Microsoft ou de sua versão de código aberto **Mono**. Frequentemente usada para criar aplicativos com a estrutura **ASP.net**. Sua sintaxe é familiar para desenvolvedores de **C**, **C++** e **Java**.

Veja também .NET, ASP.net, C, Connector/NET, C++, Java, Mono.

C++: Um idioma de programação com sintaxe básica familiar aos desenvolvedores de **C**. Fornece acesso a operações de nível baixo para desempenho, combinadas com tipos de dados de nível superior, recursos orientado a objetos e coleta de lixo. Para escrever aplicativos C++ para MySQL, você usa o componente **Connector/C++**.

Veja também C, Connector/C++.

cache: O termo geral para qualquer área de memória que armazena cópias de dados para recuperação frequente ou de alta velocidade. Em `InnoDB`, o tipo primário de estrutura de cache é o **pool de buffer**.

Veja também buffer, buffer pool.

cardinalidade: O número de valores diferentes em uma **coluna** de uma tabela. Quando as consultas referem-se a colunas que têm um **índice** associado, a cardinalidade de cada coluna influencia qual método de acesso é o mais eficiente. Por exemplo, para uma coluna com uma **restrição única**, o número de valores diferentes é igual ao número de linhas na tabela. Se uma tabela tiver um milhão de linhas, mas apenas 10 valores diferentes para uma coluna específica, cada valor ocorre (em média) 100.000 vezes. Uma consulta como `SELECT c1 FROM t1 WHERE c1 = 50;` pode, portanto, retornar 1 linha ou um número enorme de linhas, e o servidor de banco de dados pode processar a consulta de maneira diferente, dependendo da cardinalidade de `c1`.

Se os valores em uma coluna tiverem uma distribuição muito irregular, a cardinalidade pode não ser uma boa maneira de determinar o melhor plano de consulta. Por exemplo, `SELECT c1 FROM t1 WHERE c1 = x;` pode retornar 1 linha quando `x=50` e um milhão de linhas quando `x=30`. Nesse caso, você pode precisar usar **dicas de índice** para fornecer conselhos sobre qual método de busca é mais eficiente para uma consulta específica.

A cardinalidade também pode se aplicar ao número de valores distintos presentes em várias colunas, como em um **índice composto**.

Veja também, índice composto, índice, dica de índice, estatísticas persistentes, mergulho aleatório, seletividade, restrição única.

buffer de alterações: uma estrutura de dados especial que registra as alterações em **páginas** em **índices secundários**. Esses valores podem resultar de declarações SQL `INSERT`, `UPDATE` ou `DELETE` (**DML**). O conjunto de recursos envolvendo o buffer de alterações é conhecido coletivamente como **bufferamento de alterações**, consistindo em **bufferamento de inserção**, **bufferamento de exclusão** e **bufferamento de purga**.

As alterações são registradas apenas no buffer de alterações quando a página relevante do índice secundário não está no **buffer de pool**. Quando a página relevante do índice é trazida para o buffer de pool enquanto as alterações associadas ainda estão no buffer de alterações, as alterações para essa página são aplicadas no buffer de pool (**fusionadas**) usando os dados do buffer de alterações. Periodicamente, a operação de **purga** que é executada em momentos em que o sistema está principalmente parado ou durante uma parada lenta, escreve as novas páginas do índice no disco. A operação de purga pode escrever os blocos do disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse escrito no disco imediatamente.

Fisicamente, o buffer de mudanças faz parte do **espaço de tabelas do sistema**, de modo que as mudanças dos índices permaneçam bufferizadas durante os reinício do banco de dados. As mudanças são aplicadas (**fusionadas**) apenas quando as páginas são trazidas para o pool de buffer devido a alguma outra operação de leitura.

Os tipos e a quantidade de dados armazenados no buffer de alterações são regidos pelas opções de configuração `innodb_change_buffering` e `innodb_change_buffer_max_size`. Para obter informações sobre os dados atuais no buffer de alterações, execute o comando [[`SHOW ENGINE INNODB STATUS`][(show-engine.html "15.7.7.15 SHOW ENGINE Statement")]].

Anteriormente conhecido como o **inserido buffer**.

Veja também: buffer pool, alterar buffer, excluir buffer, DML, buffer de inserção, inserção de buffer, mesclar, página, purgar, purgar buffer, índice secundário, espaço de tabela do sistema.

alterar o buffer: O termo geral para as funcionalidades que envolvem o **buffer de alteração**, que consiste em **bufferamento de inserção**, **bufferamento de exclusão** e **bufferamento de purga**. As alterações de índice resultantes de declarações SQL, que normalmente poderiam envolver operações aleatórias de E/S, são retidas e realizadas periodicamente por um **thread** de fundo. Esta sequência de operações pode escrever os blocos de disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse escrito no disco imediatamente. Controlada pelas opções de configuração `innodb_change_buffering` e `innodb_change_buffer_max_size`.

Veja também alterar buffer, excluir buffer, inserir buffer, purgar buffer.

ponto de verificação: Quando alterações são feitas em páginas de dados que estão armazenadas no **buffer pool**, essas alterações são escritas nos **arquivos de dados** em algum momento posterior, um processo conhecido como **flushing**. O ponto de verificação é um registro das últimas alterações (representado por um valor **LSN**) que foram escritas com sucesso nos arquivos de dados.

Veja também: buffer pool, arquivos de dados, esvaziar, checkpointing difuso, LSN.

checksum: Em `InnoDB`, um mecanismo de validação para detectar corrupção quando uma **página** em um **espaço de tabelas** é lida do disco para o **buffer pool** do `InnoDB`. Esse recurso é controlado pela opção de configuração `innodb_checksums` no MySQL 5.5. `innodb_checksums` é descontinuado no MySQL 5.6.3, substituído por `innodb_checksum_algorithm`.

O comando **innochecksum** ajuda a diagnosticar problemas de corrupção, testando os valores de verificação de checksum de um arquivo de **tablespace** especificado, enquanto o servidor MySQL está desligado.

O MySQL também utiliza verificações de checksum para fins de replicação. Para obter detalhes, consulte as opções de configuração `binlog_checksum`, `source_verify_checksum` ou `master_verify_checksum` e `replica_sql_verify_checksum` ou `slave_sql_verify_checksum`.

Veja também buffer pool, página, tablespace.

tabela de filho: Em uma relação de **chave estrangeira**, uma tabela de filho é aquela cujas linhas referem (ou apontam) para linhas em outra tabela com um valor idêntico para uma coluna específica. Esta é a tabela que contém a cláusula `FOREIGN KEY ... REFERENCES` e, opcionalmente, as cláusulas `ON UPDATE` e `ON DELETE`. A linha correspondente na **tabela pai** deve existir antes de a linha poder ser criada na tabela de filho. Os valores na tabela de filho podem impedir operações de exclusão ou atualização na tabela pai, ou podem causar exclusão ou atualizações automáticas na tabela de filho, com base na opção `ON CASCADE` usada ao criar a chave estrangeira.

Veja também chave estrangeira, tabela pai.

Uma **página** no **buffer pool** `InnoDB` onde todas as alterações feitas na memória também foram escritas (**limpa**) nos arquivos de dados. O oposto de uma **página suja**.

Veja também: buffer pool, arquivos de dados, página suja, esvaziar, página.

desativação limpa: Uma **desativação** que é concluída sem erros e aplica todas as alterações às tabelas de `InnoDB` antes de terminar, ao contrário de um **crash** ou uma **desativação rápida**. Sinônimo de **desativação lenta**.

Veja também: acidente de avião, desligamento rápido, desligamento, desligamento lento.

cliente: Um programa que funciona fora do servidor de banco de dados, comunicando-se com o banco de dados enviando solicitações através de um **Conector**, ou uma **API** disponibilizada através de **bibliotecas de cliente**. Pode funcionar na mesma máquina física do servidor de banco de dados, ou em uma máquina remota conectada através de uma rede. Pode ser um aplicativo de banco de dados de propósito específico, ou um programa de propósito geral como o processador de linha de comando **mysql**.

Veja também API, bibliotecas de cliente, conector, mysql, servidor.

bibliotecas de cliente: Arquivos que contêm coleções de funções para trabalhar com bancos de dados. Ao compilar seu programa com essas bibliotecas ou instalá-las no mesmo sistema que sua aplicação, você pode executar um aplicativo de banco de dados (conhecido como **cliente**) em uma máquina que não tenha o servidor MySQL instalado; o aplicativo acessa o banco de dados através de uma rede. Com o MySQL, você pode usar a biblioteca **libmysqlclient** do próprio servidor MySQL.

Veja também cliente, libmysqlclient.

declaração preparada do lado do cliente: Um tipo de **declaração preparada** em que o armazenamento e a reutilização são gerenciados localmente, emulando a funcionalidade das **declarações preparadas do lado do servidor**. Historicamente, utilizado por alguns desenvolvedores de **Connector/J**, **Connector/ODBC** e **Connector/PHP** para resolver problemas com procedimentos armazenados do lado do servidor. Com as versões modernas do servidor MySQL, as declarações preparadas do lado do servidor são recomendadas para desempenho, escalabilidade e eficiência de memória.

Veja também Conector/J, Conector/ODBC, Conector/PHP, declaração preparada.

CLOB: Um tipo de dados SQL (`TINYTEXT`, `TEXT`, `MEDIUMTEXT` ou `LONGTEXT`) para objetos que contêm qualquer tipo de dados de caracteres, de tamanho arbitrário. Usado para armazenar documentos baseados em texto, com conjunto de caracteres e ordem de ordenação associados. As técnicas para lidar com CLOBs dentro de uma aplicação MySQL variam com cada **Conectador** e **API**. O MySQL Connector/ODBC define os valores `TEXT` como `LONGVARCHAR`. Para armazenar dados binários, o equivalente é o tipo **BLOB**.

Veja também API, BLOB, conector, Conector/ODBC.

índice agrupado: O termo `InnoDB` para um índice de **chave primária**. O armazenamento de tabela `InnoDB` é organizado com base nos valores das colunas da chave primária, para acelerar consultas e ordenamentos que envolvam as colunas da chave primária. Para obter o melhor desempenho, escolha as colunas da chave primária com cuidado, com base nas consultas mais críticas em termos de desempenho. Como modificar as colunas do índice agrupado é uma operação cara, escolha colunas primárias que raramente ou nunca sejam atualizadas.

No produto Oracle Database, esse tipo de tabela é conhecido como **tabela organizada por índice**.

Veja também índice, chave primária, índice secundário.

backup frio: Um **backup** realizado enquanto o banco de dados está desligado. Para aplicações e sites com muitas atividades, isso pode não ser prático, e você pode preferir um **backup quente** ou um **backup quente**.

Veja também backup, backup quente e backup quente.

coluna: Um item de dados dentro de uma **linha**, cujo armazenamento e semântica são definidos por um tipo de dados. Cada **tabela** e **índice** é amplamente definido pelo conjunto de colunas que contém.

Cada coluna tem um valor de **cardinalidade**. Uma coluna pode ser a **chave primária** de sua tabela ou parte da chave primária. Uma coluna pode estar sujeita a uma **restrição única**, uma **restrição NOT NULL** ou ambas. Os valores em diferentes colunas, mesmo entre diferentes tabelas, podem ser vinculados por uma **relação de chave estrangeira**.

Em discussões sobre operações internas do MySQL, às vezes **campo** é usado como sinônimo.

Veja também cardinalidade, chave estrangeira, índice, restrição NOT NULL, chave primária, linha, tabela, restrição única.

índice de coluna: Um **índice** em uma única coluna.

Veja também índice composto, índice.

prefixo da coluna: Quando um **índice** é criado com uma especificação de comprimento, como `CREATE INDEX idx ON t1 (c1(N))`, apenas os primeiros N caracteres do valor da coluna são armazenados no índice. Manter o prefixo do índice pequeno torna o índice compacto, e as economias de memória e I/O de disco ajudam no desempenho. (Embora fazer o prefixo do índice muito pequeno possa dificultar a otimização da consulta, fazendo com que as linhas com valores diferentes pareçam duplicatas para o otimizador de consulta.)

Para colunas que contêm valores binários ou cadeias de texto longas, onde o ordenamento não é uma consideração importante e o armazenamento de todo o valor no índice desperdiçaria espaço, o índice usa automaticamente os primeiros N (tipicamente 768) caracteres do valor para fazer pesquisas e ordenamentos.

Veja também o índice.

interceptador de comando: Sinônimo de **interceptador de declaração**. Um aspecto do padrão de design **interceptor** disponível tanto para **Connector/NET** quanto para **Connector/J**. O que o Connector/NET chama de comando, o Connector/J chama de declaração. Em contraste com o **interceptador de exceção**.

Veja também Conector/J, Conector/NET, interceptor de exceção, interceptor, interceptor de declaração.

commit: Uma declaração **SQL** que termina uma **transação**, tornando permanentes quaisquer alterações feitas pela transação. É o oposto de **rollback**, que desfaz quaisquer alterações feitas na transação.

`InnoDB` utiliza um mecanismo **optimistico** para os commits, de modo que as alterações podem ser escritas nos arquivos de dados antes de o commit ocorrer realmente. Essa técnica torna o próprio commit mais rápido, com o contraponto de que é necessário mais trabalho no caso de um rollback.

Por padrão, o MySQL usa a configuração **autocommit**, que emite automaticamente um commit após cada declaração SQL.

Veja também autocommit, otimista, rollback, SQL, transação.

formato de linha compacto: Um **formato de linha** para tabelas InnoDB. Foi o formato de linha padrão do MySQL 5.0.3 ao MySQL 5.7.8. No MySQL 8.0, o formato de linha padrão é definido pela opção de configuração `innodb_default_row_format`, que tem um ajuste padrão de **DINÂMICO**. O formato de linha **COMPACT** oferece uma representação mais compacta para nulos e colunas de comprimento variável do que o formato de linha **REDUNDANTE**.

Para informações adicionais sobre o formato da linha `InnoDB` `COMPACT`, consulte a Seção 17.10, “Formatos de linha InnoDB”.

Veja também formato de linha dinâmico, formato de arquivo, formato de linha redundante, formato de linha.

índice composto: Um **índice** que inclui várias colunas.

Veja também o índice.

backup comprimido: O recurso de compressão do produto **MySQL Enterprise Backup** faz uma cópia comprimida de cada espaço de tabela, alterando a extensão de `.ibd` para `.ibz`. A compressão dos dados do backup permite que você mantenha mais backups disponíveis e reduz o tempo para transferir backups para um servidor diferente. Os dados não são descompactados durante a operação de restauração. Quando uma operação de backup comprimido processa uma tabela que já está comprimida, ela ignora o passo de compressão para essa tabela, porque a compressão novamente resultaria em pouca ou nenhuma economia de espaço.

Um conjunto de arquivos produzidos pelo produto **MySQL Enterprise Backup**, onde cada [[tablespace]] é comprimido. Os arquivos comprimidos são renomeados com a extensão de arquivo `.ibz`.

Aplicar **compressão** no início do processo de backup ajuda a evitar o desperdício de armazenamento durante o processo de compressão e evitar o desperdício de rede ao transferir os arquivos de backup para outro servidor. O processo de **aplicar** o **registro binário** leva mais tempo e exige a descomprimagem dos arquivos de backup.

Veja também aplicar, log binário, compressão, backup quente, MySQL Enterprise Backup, tablespace.

formato de linha compactada: um **formato de linha** que permite a **comprimentos** de dados e índices para as tabelas `InnoDB`. Campos grandes são armazenados longe da página que contém o resto dos dados da linha, como no **formato de linha dinâmica**. Tanto as páginas de índice quanto os campos grandes são compactados, resultando em economia de memória e disco. Dependendo da estrutura dos dados, a diminuição da memória e do uso do disco pode ou não superar o custo de desempenho da descompressão dos dados conforme eles são usados. Consulte a Seção 17.9, “Compressão de Tabela e Página InnoDB”, para detalhes de uso.

Para informações adicionais sobre o formato da linha `InnoDB` `COMPRESSED`, consulte o Formato de linha dinâmico.

Veja também compressão, formato dinâmico de linha, formato de linha.

tabela compactada: uma tabela para a qual os dados são armazenados em forma compactada. Para `InnoDB`, é uma tabela criada com `ROW_FORMAT=COMPRESSED`. Consulte a Seção 17.9, “Compactação de tabela e página InnoDB”, para obter mais informações.

Veja também o formato de linha compactada, compressão.

comprimidos: Uma característica com benefícios amplos, que resultam no uso de menos espaço em disco, com menos operações de E/S e menos memória para cache.

`InnoDB` suporta compressão tanto em nível de tabela quanto em nível de página. A compressão de página `InnoDB` também é conhecida como **compressão transparente de página**. Para mais informações sobre a compressão `InnoDB`, consulte a Seção 17.9, “Compressão de Tabela e Página do InnoDB”.

Outro tipo de compressão é a função de **backup comprimido** do produto **MySQL Enterprise Backup**.

Veja também: buffer pool, backup comprimido, formato de linha comprimido, DML, compressão transparente de página.

falha de compressão: Na verdade, não é um erro, mas sim uma operação cara que pode ocorrer ao usar **compressão** em combinação com operações **DML**. Ocorre quando: as atualizações de uma **página** comprimida ultrapassam a área na página reservada para gravação de modificações; a página é comprimida novamente, com todas as alterações aplicadas aos dados da tabela; os dados recompressados não cabem na página original, exigindo que o MySQL divida os dados em duas novas páginas e comprima cada uma separadamente. Para verificar a frequência dessa condição, consulte a tabela `INFORMATION_SCHEMA.INNODB_CMP` e verifique quanto o valor da coluna `COMPRESS_OPS` excede o valor da coluna `COMPRESS_OPS_OK`. Idealmente, as falhas de compressão não ocorrem com frequência; quando ocorrem, você pode ajustar as opções de configuração dos `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`.

Veja também compressão, DML, página.

índice concatenado: Veja índice composto.

concorrência: A capacidade de várias operações (na terminologia de banco de dados, **transações**) serem executadas simultaneamente, sem interferir umas nas outras. A concorrência também está envolvida com o desempenho, porque idealmente, a proteção para várias transações simultâneas funciona com um mínimo de sobrecarga de desempenho, usando mecanismos eficientes para **bloqueio**.

Veja também ACID, bloqueio, transação.

arquivo de configuração: O arquivo que contém os valores da **opção** usados pelo MySQL no início. Tradicionalmente, no Linux e no Unix, este arquivo é chamado `my.cnf`, e no Windows, é chamado `my.ini`. Você pode definir vários parâmetros relacionados ao InnoDB na seção `[mysqld]` do arquivo.

Veja a Seção 6.2.2.2, “Usando arquivos de opção”, para obter informações sobre onde o MySQL procura por arquivos de configuração.

Quando você usa o produto **MySQL Enterprise Backup**, você normalmente usa dois arquivos de configuração: um que especifica de onde os dados vêm e como eles são estruturados (que poderia ser o arquivo de configuração original para seu servidor), e um simplificado que contém apenas um pequeno conjunto de opções que especificam para onde os dados do backup vão e como eles são estruturados. Os arquivos de configuração usados com o produto **MySQL Enterprise Backup** devem conter certas opções que normalmente são excluídas dos arquivos de configuração regulares, então você pode precisar adicionar opções ao seu arquivo de configuração existente para uso com **MySQL Enterprise Backup**.

Veja também my.cnf, MySQL Enterprise Backup, opção, arquivo de opção.

conexão: O canal de comunicação entre uma aplicação e um servidor MySQL. O desempenho e a escalabilidade de uma aplicação de banco de dados são influenciados pela rapidez com que uma conexão de banco de dados pode ser estabelecida, quantos podem ser feitos simultaneamente e por quanto tempo persistem. Os parâmetros, como **host**, **port**, entre outros, são representados como uma **string de conexão** no **Connector/NET** e como um **DSN** no **Connector/ODBC**. Sistemas de alto tráfego utilizam uma otimização conhecida como **pool de conexão**.

Veja também: conjunto de conexões, string de conexão, Conector/NET, Conector/ODBC, DSN, host, porta.

pool de conexões: Uma área de cache que permite que as **conexões** do banco de dados sejam reutilizadas dentro do mesmo aplicativo ou entre diferentes aplicativos, em vez de configurar e desmontar uma nova conexão para cada operação do banco de dados. Essa técnica é comum com servidores de aplicativos **J2EE**. Aplicativos **Java** que utilizam **Connector/J** podem usar as características do pool de conexões do **Tomcat** e outros servidores de aplicativos. A reutilização é transparente para as aplicações; o aplicativo ainda abre e fecha a conexão como de costume.

Veja também conexão, Connector/J, J2EE, Tomcat.

string de conexão: Uma representação dos parâmetros para uma **conexão** de banco de dados, codificada como um literal de string para que possa ser usada no código do programa. As partes da string representam parâmetros de conexão, como **host** e **port**. Uma string de conexão contém vários pares chave-valor, separados por pontos e virgulas. Cada par chave-valor é unido com um sinal de igual. Frequentemente usada com aplicativos **Connector/NET**. Veja Criando uma string de conexão Connector/NET para detalhes.

Veja também conexão, Conector/NET, host, porta.

Conectores: Os Conectores MySQL fornecem conectividade ao servidor MySQL para programas **de cliente**. Vários idiomas de programação e frameworks têm seus próprios Conectores associados. Em contraste com o acesso de nível mais baixo fornecido por uma **API**.

Veja também API, cliente, Conector/C++, Conector/J, Conector/NET, Conector/ODBC.

Conector/C++: O Connector/C++ 8.0 pode ser usado para acessar servidores MySQL que implementam um banco de documentos, ou de maneira tradicional usando consultas SQL. Permite o desenvolvimento de aplicativos C++ usando X DevAPI, ou aplicativos em C simples usando X DevAPI para C. Também permite o desenvolvimento de aplicativos C++ que utilizam a API com base em JDBC do Connector/C++ 1.1. Para mais informações, consulte o Guia do Desenvolvedor do MySQL Connector/C++ 9.5.

Veja também cliente, conector, JDBC.

Conector/J: Um **driver JDBC** que oferece conectividade para aplicações **cliente** desenvolvidas na linguagem de programação **Java**. O MySQL Connector/J é um driver do tipo 4 JDBC: uma implementação pura em Java do protocolo MySQL que não depende das **bibliotecas de cliente** do MySQL. Para obter detalhes completos, consulte o Guia do Desenvolvedor do MySQL Connector/J.

Veja também cliente, bibliotecas de cliente, conector, Java, JDBC.

Connector/NET: Um **conectivo** MySQL para desenvolvedores que escrevem aplicações usando linguagens, tecnologias e frameworks como **C#**, **.NET**, **Mono**, **Visual Studio**, **ASP.net** e **ADO.net**.

Veja também ADO.NET, ASP.net, conector, C#, Mono, Visual Studio.

Conector/ODBC: A família de drivers ODBC do MySQL que fornece acesso a um banco de dados MySQL usando a API de Conectividade de Banco de Dados Aberto (**ODBC**) padrão da indústria. Anteriormente chamados de drivers MyODBC. Para obter detalhes completos, consulte o Guia do Desenvolvedor do Conector/ODBC do MySQL.

Veja também conector, ODBC.

Conector/PHP: Uma versão das `mysql` e `mysqli` **APIs** para **PHP** otimizada para o sistema operacional Windows.

Veja também conector, PHP, API PHP.

leitura consistente: Uma operação de leitura que utiliza informações de **instantâneo** para apresentar os resultados da consulta com base em um ponto no tempo, independentemente das alterações realizadas por outras transações que estão sendo executadas ao mesmo tempo. Se os dados solicitados tiverem sido alterados por outra transação, os dados originais são reconstruídos com base no conteúdo do **registro de desfazer**. Essa técnica evita alguns dos problemas de **bloqueio** que podem reduzir a **concorrência**, forçando as transações a esperar que outras transações terminem.

Com o nível de isolamento **REPETÍVEL LEITURA**, o instantâneo é baseado no momento em que a primeira operação de leitura é realizada. Com o nível de isolamento **COMITADO LEITURA**, o instantâneo é redefinido para o momento de cada operação de leitura consistente.

A leitura consistente é o modo padrão no qual o `InnoDB` processa as declarações do `SELECT` nos níveis de isolamento **LEIA COM COMPROMISSO** e **LEIA REPEATÁVEL**. Como uma leitura consistente não define quaisquer bloqueios nas tabelas a que acessa, outras sessões estão livres para modificar essas tabelas enquanto uma leitura consistente está sendo realizada na tabela.

Para obter informações técnicas sobre os níveis de isolamento aplicáveis, consulte a Seção 17.7.2.3, “Leitura consistente sem bloqueio”.

Veja também concorrência, nível de isolamento, bloqueio, COMITADO DE LEITURA, LEITURA REPEATÁVEL, instantâneo, transação, registro de desfazer.

restrição: Um teste automático que pode bloquear as alterações no banco de dados para evitar que os dados se tornem inconsistentes. (Em termos de ciência da computação, um tipo de afirmação relacionada a uma condição invariável.) As restrições são um componente crucial da filosofia **ACID**, para manter a consistência dos dados. As restrições suportadas pelo MySQL incluem **restrições de chave estrangeira** e **restrições únicas**.

Veja também ACID, chave estrangeira, restrição única.

contador: Um valor que é incrementado por um tipo específico de operação `InnoDB`. Útil para medir a ocupação de um servidor, solucionar as fontes de problemas de desempenho e testar se as alterações (por exemplo, nas configurações ou índices usados por consultas) têm os efeitos desejados a nível baixo. Diferentes tipos de contadores estão disponíveis através das tabelas do **Performance Schema** e das tabelas do **INFORMATION_SCHEMA**, particularmente `INFORMATION_SCHEMA.INNODB_METRICS`.

Veja também INFORMATION_SCHEMA, contador de métricas, Schema de desempenho.

Índice de cobertura: Um **índice** que inclui todas as colunas recuperadas por uma consulta. Em vez de usar os valores do índice como ponteiros para encontrar as linhas completas da tabela, a consulta retorna valores da estrutura do índice, economizando I/O de disco. `InnoDB` pode aplicar essa técnica de otimização a mais índices do que o MyISAM pode, porque os **índices secundários** `InnoDB` também incluem as colunas da **chave primária**. `InnoDB` não pode aplicar essa técnica para consultas contra tabelas modificadas por uma transação, até que essa transação termine.

Qualquer **índice de coluna** ou **índice composto** pode atuar como um índice de cobertura, dado a consulta correta. Projete seus índices e consultas para aproveitar essa técnica de otimização sempre que possível.

Veja também índice de coluna, índice composto, índice, chave primária, índice secundário.

CPU-bound: Um tipo de **carga de trabalho** onde o principal **bottleneck** são as operações de CPU na memória. Geralmente envolve operações intensivas em leitura, onde todos os resultados podem ser cacheados na **pool de buffer**.

Veja também gargalo, conjunto de buffer, carga de trabalho.

crash: O MySQL usa o termo “crash” para se referir, de forma geral, a qualquer operação de **shutdown** inesperada em que o servidor não pode realizar sua limpeza normal. Por exemplo, um crash pode ocorrer devido a uma falha de hardware na máquina do servidor de banco de dados ou no dispositivo de armazenamento; uma falha de energia; uma possível incompatibilidade de dados que faz o servidor MySQL parar; um **shutdown rápido** iniciado pelo DBA; ou muitas outras razões. A robusta **recuperação automática de crash** para tabelas **InnoDB** garante que os dados sejam consistentes quando o servidor é reiniciado, sem qualquer trabalho adicional para o DBA.

Veja também recuperação de falhas, desligamento rápido, InnoDB, desligamento.

recuperação de falhas: As atividades de limpeza que ocorrem quando o MySQL é iniciado novamente após uma **falha**. Para as tabelas **InnoDB**, as alterações de transações incompletas são regravadas usando dados do **registro de refazer**. As alterações que foram **comprometidas** antes da falha, mas ainda não escritas nos **arquivos de dados**, são reconstruídas a partir do **buffer de dupla gravação**. Quando o banco de dados é desligado normalmente, esse tipo de atividade é realizado durante o desligamento pela operação **purga**.

Durante o funcionamento normal, os dados comprometidos podem ser armazenados no **buffer de mudança** por um período de tempo antes de serem escritos nos arquivos de dados. Sempre há um compromisso entre manter os arquivos de dados atualizados, o que introduz sobrecarga de desempenho durante o funcionamento normal, e o bufferamento dos dados, o que pode fazer com que a recuperação de desligamento e falha leve mais tempo.

Veja também buffer de mudança, commit, crash, arquivos de dados, buffer de escrita dupla, InnoDB, purgar, log de refazer.

CRUD: Abreviação de “criar, ler, atualizar e excluir”, uma sequência comum de operações em aplicativos de banco de dados. Muitas vezes denota uma classe de aplicativos com uso de banco de dados relativamente simples (declarações básicas **DDL**, **DML** e **consulta** em **SQL**) que podem ser implementadas rapidamente em qualquer idioma.

Veja também DDL, DML, consulta, SQL.

cursor: Uma estrutura de dados interna do MySQL que representa o conjunto de resultados de uma declaração SQL. Frequentemente usada com **declarações preparadas** e **SQL dinâmico**. Funciona como um iterador em outros idiomas de alto nível, produzindo cada valor do conjunto de resultados conforme solicitado.

Embora o SQL geralmente gere o processamento de cursor para você, você pode se aprofundar nos detalhes internos quando estiver lidando com código crítico em termos de desempenho.

Veja também SQL dinâmico, declaração preparada, consulta.

### D

linguagem de definição de dados: Veja DDL.

dicionário de dados: Metadados que acompanham objetos do banco de dados, como **tabelas**, **índices** e **colunas** de tabela. Para o dicionário de dados MySQL, introduzido no MySQL 8.0, os metadados estão fisicamente localizados nos arquivos de **espaço de arquivo por tabela** no diretório do banco de dados `InnoDB`. Para o dicionário de dados `InnoDB`, os metadados estão fisicamente localizados no **espaço de tabela do sistema** no `InnoDB`.

Como o produto **MySQL Enterprise Backup** sempre faz backup dos espaços de tabela do sistema `InnoDB`, todos os backups incluem o conteúdo do dicionário de dados `InnoDB`.

Veja também a coluna, arquivo por tabela, arquivo .frm, índice, MySQL Enterprise Backup, espaço de tabela do sistema, tabela.

diretório de dados: O diretório sob o qual cada instância do MySQL mantém os arquivos de dados para `InnoDB` e os diretórios que representam as bases de dados individuais. Controlado pela opção de configuração `datadir`.

Veja também arquivos de dados, instance.

arquivos de dados: Os arquivos que fisicamente contêm dados de **tabela** e **índice**.

O espaço de tabela `InnoDB` **`InnoDB`**, que contém o `InnoDB` **dicionário de dados** e é capaz de armazenar dados para várias tabelas `InnoDB`, é representado por um ou mais arquivos de dados `.ibdata`.

Os espaços de tabela por tabela, que armazenam dados para uma única tabela `InnoDB`, são representados por um arquivo de dados `.ibd`.

Os espaços de tabela gerais (introduzidos no MySQL 5.7.6), que podem armazenar dados para múltiplas tabelas `InnoDB`, também são representados por um arquivo de dados `.ibd`.

Veja também o dicionário de dados, arquivo por tabela, espaço de tabela geral, arquivo .ibd, arquivo ibdata, índice, espaço de tabela do sistema, tabela, espaço de tabela.

linguagem de manipulação de dados: Veja DML.

armazém de dados: Um sistema ou aplicativo de banco de dados que executa principalmente grandes **consultas**. Os dados que são apenas de leitura ou quase exclusivamente de leitura podem ser organizados em forma **desenorizada** para eficiência de consulta. Pode se beneficiar das otimizações para **transações de leitura** em MySQL 5.6 e versões posteriores. Contrasta com **OLTP**.

Veja também denormalizado, OLTP, consulta, transação somente de leitura.

banco de dados: Dentro do diretório de dados do MySQL, cada banco de dados é representado por um diretório separado. O espaço de sistema InnoDB, que pode conter dados de tabela de vários bancos de dados dentro de uma instância do MySQL, é mantido em **arquivos de dados** que residem fora dos diretórios de banco de dados individuais. Quando o modo **arquivo por tabela** é habilitado, os **arquivos .ibd** que representam as tabelas individuais do InnoDB são armazenados dentro dos diretórios do banco de dados, a menos que sejam criados em outro lugar usando a cláusula `DATA DIRECTORY`. Os espaços de tabela gerais, introduzidos no MySQL 5.7.6, também armazenam dados de tabela em **arquivos .ibd**. Ao contrário dos arquivos .ibd de arquivo por tabela, os arquivos .ibd de espaço de tabela geral podem conter dados de tabela de vários bancos de dados dentro de uma instância do MySQL e podem ser atribuídos a diretórios relativos ou independentes do diretório de dados do MySQL.

Para usuários de longa data do MySQL, um banco de dados é uma noção familiar. Usuários que vêm de um ambiente do Oracle Database podem achar que o significado de banco de dados do MySQL está mais próximo do que o Oracle Database chama de **esquema**.

Veja também arquivos de dados, arquivo por tabela, arquivo .ibd, instância, esquema, espaço de tabela do sistema.

DCL: Linguagem de controle de dados, um conjunto de declarações **SQL** para gerenciar privilégios. Em MySQL, consiste nas declarações `GRANT` e `REVOKE`. Contrasta com **DDL** e **DML**.

Veja também DDL, DML e SQL.

Fornecedor DDEX: Uma funcionalidade que permite usar as ferramentas de design de dados dentro do **Visual Studio** para manipular o esquema e os objetos dentro de um banco de dados MySQL. Para aplicações MySQL que utilizam o **Connector/NET**, o Plugin MySQL do Visual Studio atua como um fornecedor DDEX com MySQL 5.0 e versões posteriores.

Veja também Visual Studio.

DDL: Linguagem de definição de dados, um conjunto de declarações de **SQL** para manipular o próprio banco de dados em vez das linhas individuais de tabela. Inclui todas as formas das declarações `CREATE`, `ALTER` e `DROP`. Também inclui a declaração `TRUNCATE`, porque ela funciona de maneira diferente de uma declaração `DELETE FROM table_name`, embora o efeito final seja semelhante.

As instruções DDL automaticamente **confirmam** a **transação** atual; elas não podem ser **desfeitas**.

O recurso DDL online `InnoDB` melhora o desempenho para as operações `CREATE INDEX`, `DROP INDEX` e muitos tipos de operações `ALTER TABLE`. Consulte a Seção 17.12, “InnoDB e DDL Online”, para mais informações. Além disso, o ajuste de arquivo por tabela `InnoDB` pode afetar o comportamento das operações `DROP TABLE`, `TRUNCATE TABLE` e `UPDATE` (ver [(drop-table.html "15.1.32 DROP TABLE Statement")] e [(truncate-table.html "15.1.37 TRUNCATE TABLE Statement")]).

Contrastando com **DML** e **DCL**.

Veja também commit, DCL, DML, arquivo por tabela, rollback, SQL, transação.

deadlock: Uma situação em que diferentes **transações** não conseguem prosseguir, porque cada uma delas possui um **bloqueio** que a outra precisa. Como ambas as transações estão esperando que um recurso se torne disponível, nenhuma delas libera os bloqueios que detém.

Um impasse pode ocorrer quando as transações bloqueiam linhas em múltiplas tabelas (através de declarações como `UPDATE` ou `SELECT ... FOR UPDATE`, mas em ordem oposta. Um impasse também pode ocorrer quando tais declarações bloqueiam faixas de registros de índice e **lacunas**, com cada transação adquirindo alguns bloqueios, mas não outros devido a um problema de sincronização.

Para informações de fundo sobre como os deadlocks são detectados e tratados automaticamente, consulte a Seção 17.7.5.2, “Detecção de Deadlocks”. Para dicas sobre como evitar e recuperar de condições de deadlocks, consulte a Seção 17.7.5.3, “Como minimizar e lidar com deadlocks”.

Veja também gap, bloqueio, transação.

Detecção de ponto morto: Um mecanismo que detecta automaticamente quando ocorre um **ponto morto** e **reverte automaticamente** uma das **transações** envolvidas (a **vítima**). A detecção de ponto morto pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

Veja também: impasse, rollback, transação, vítima.

Excluir: Quando o `InnoDB` processa uma declaração `DELETE`, as linhas são marcadas imediatamente para exclusão e não são mais devolvidas por consultas. O armazenamento é recuperado em algum momento posterior, durante a coleta periódica de lixo conhecida como operação de **purga**. Para a remoção de grandes quantidades de dados, operações relacionadas com suas próprias características de desempenho são **TRUNCATE** e **DROP**.

Veja também drop, purge e truncate.

excluir o bufferamento: A técnica de armazenar as alterações nas páginas de índice secundário, resultantes das operações de `DELETE`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas e minimizar o I/O aleatório. (Como as operações de exclusão são um processo de duas etapas, esta operação armazena a escrita que normalmente marca um registro de índice para exclusão.) É um dos tipos de **bufferamento de alterações**: os outros são **bufferamento de inserção** e **bufferamento de purga**.

Veja também alterar buffer, alterar bufferização, inserir buffer, inserir bufferização, purgar bufferização.

denormalizado: Uma estratégia de armazenamento de dados que duplica os dados em diferentes tabelas, em vez de vincular as tabelas com **chaves estrangeiras** e consultas de **join**. Tipicamente usado em aplicações de **data warehouse**, onde os dados não são atualizados após o carregamento. Nessas aplicações, o desempenho da consulta é mais importante do que tornar simples a manutenção de dados consistentes durante as atualizações. Contrasta com **normalizado**.

Veja também armazém de dados, chave estrangeira, junção, normalizado.

índice descendente: Um tipo de **índice** em que o armazenamento do índice é otimizado para processar cláusulas `ORDER BY column DESC`.

Veja também o índice.

cache de objetos do dicionário: O cache de objetos do dicionário armazena objetos de **dicionário de dados** previamente acessados na memória para permitir a reutilização de objetos e minimizar o I/O de disco. Uma estratégia de expulsão baseada em **LRU** é usada para expulsar os objetos menos recentemente utilizados da memória. O cache é composto por várias partições que armazenam diferentes tipos de objetos.

Para mais informações, consulte a Seção 16.4, “Cache de Objeto do Dicionário”.

Veja também o dicionário de dados, LRU.

página suja: Uma **página** no `InnoDB` **buffer pool** que foi atualizada na memória, onde as alterações ainda não foram escritas (**limpa**) nos **arquivos de dados**. O oposto de uma **página limpa**.

Veja também: buffer pool, página limpa, arquivos de dados, esvaziar, página.

leitura suja: Uma operação que recupera dados não confiáveis, dados que foram atualizados por outra transação, mas ainda não foram **comprometidos**. É possível apenas com o **nível de isolamento** conhecido como **leitura não comprometida**.

Esse tipo de operação não segue o princípio **ACID** do design de banco de dados. É considerado muito arriscado, porque os dados podem ser **revertidos** ou atualizados ainda mais antes de serem comprometidos; então, a transação que faz o **dirty read** estará usando dados que nunca foram confirmados como precisos.

Seu oposto é a leitura consistente, onde `InnoDB` garante que uma transação não leia informações atualizadas por outra transação, mesmo que a outra transação se comprometa no meio do caminho.

Veja também ACID, commit, leitura consistente, nível de isolamento, READ UNCOMMITTED, rollback.

baseada em disco: Um tipo de banco de dados que organiza principalmente os dados em armazenamento em disco (discos rígidos ou equivalentes). Os dados são trazidos para frente e para trás entre o disco e a memória para serem operados. É o oposto de um **banco de dados em memória**. Embora o `InnoDB` seja baseado em disco, ele também contém recursos como o **pool de buffers**, múltiplas instâncias de pool de buffers e o **índice de hash adaptativo** que permitem que certos tipos de cargas de trabalho trabalhem principalmente a partir da memória.

Veja também índice de hash adaptável, pool de buffer, banco de dados em memória.

disk-bound: Um tipo de **carga de trabalho** em que o principal **bottleneck** é o I/O de disco. (Também conhecido como **bound I/O**.) Geralmente envolve escritas frequentes no disco, ou leituras aleatórias de mais dados do que o que pode caber na **pool de buffer**.

Veja também gargalo, conjunto de buffer, carga de trabalho.

DML: Linguagem de manipulação de dados, um conjunto de declarações **SQL** para realizar operações de `INSERT`, `UPDATE` e `DELETE`. A declaração `SELECT` é, às vezes, considerada uma declaração DML, porque o formulário `SELECT ... FOR UPDATE` está sujeito às mesmas considerações para **bloqueio** que `INSERT`, `UPDATE` e `DELETE`.

As declarações DML para uma tabela `InnoDB` operam no contexto de uma **transação**, portanto, seus efeitos podem ser **comprometidos** ou **revertidos** como uma única unidade.

Contrastando com **DDL** e **DCL**.

Veja também commit, DCL, DDL, bloqueio, rollback, SQL, transação.

id do documento: Na funcionalidade de **pesquisa de texto completo** do `InnoDB`, uma coluna especial na tabela que contém o **índice FULLTEXT**, para identificar de forma única o documento associado a cada valor de **ilist**. Seu nome é `FTS_DOC_ID` (requer maiúsculas). A própria coluna deve ser do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único denominado `FTS_DOC_ID_INDEX`. Preferencialmente, você define essa coluna ao criar a tabela. Se `InnoDB` deve adicionar a coluna à tabela ao criar um índice `FULLTEXT`, a operação de indexação é consideravelmente mais cara.

Veja também pesquisa de texto completo, índice FULLTEXT, ilist.

buffer de escrita dupla: `InnoDB` utiliza uma técnica de varredura de arquivo chamada escrita dupla. Antes de escrever **páginas** nos **arquivos de dados**, `InnoDB` as escreve primeiro em uma área de armazenamento chamada buffer de escrita dupla. Somente após a escrita e a varredura para o buffer de escrita dupla terem sido concluídas, `InnoDB` escreve as páginas em suas posições apropriadas no arquivo de dados. Se houver um sistema operacional, subsistema de armazenamento ou processo do **mysqld** que falhe no meio de uma escrita de página, `InnoDB` pode encontrar uma boa cópia da página do buffer de escrita dupla durante a **recuperação de falha**.

Embora os dados sejam sempre escritos duas vezes, o buffer de escrita dupla não requer o dobro do overhead de E/S ou o dobro das operações de E/S. Os dados são escritos no próprio buffer como um grande bloco sequencial, com uma única chamada `fsync()` ao sistema operacional.

Veja também recuperação de falhas, arquivos de dados, página, purga.

drop: Um tipo de operação de **DDL** que remove um objeto de esquema, através de uma declaração como `DROP TABLE` ou `DROP INDEX`. Internamente, mapeia para uma declaração `ALTER TABLE`. Do ponto de vista de `InnoDB`, as considerações de desempenho dessas operações envolvem o tempo em que o **dicionário de dados** é bloqueado para garantir que os objetos inter-relacionados estejam todos atualizados e o tempo para atualizar estruturas de memória, como o **pool de buffers**. Para uma **tabela**, a operação de drop tem características um pouco diferentes de uma operação de **truncate** (declaração `TRUNCATE TABLE`).

Veja também: buffer pool, dicionário de dados, DDL, tabela, truncar.

DSN: Abreviação de "Database Source Name" (Nome da Fonte do Banco de Dados). É o codificação para as informações de **conexão** dentro do **Connector/ODBC**. Veja Configurando um DSN de Connector/ODBC no Windows para obter detalhes completos. É o equivalente à **string de conexão** usada pelo **Connector/NET**.

Veja também conexão, string de conexão, Conector/NET, Conector/ODBC.

cursor dinâmico: Um tipo de **cursor** suportado pelo **ODBC** que pode capturar novos e alterados resultados quando as linhas são lidas novamente. Se e como rapidamente as alterações são visíveis para o cursor depende do tipo de tabela envolvida (transacional ou não transacional) e do nível de isolamento para tabelas transacionais. O suporte para cursors dinâmicos deve ser explicitamente habilitado.

Veja também cursor, ODBC.

formato de linha dinâmico: um formato de linha `InnoDB`. Como os valores de coluna de comprimento variável são armazenados fora da página que contém os dados da linha, é muito eficiente para linhas que incluem grandes objetos. Como os campos grandes normalmente não são acessados para avaliar as condições da consulta, eles não são trazidos para o **buffer pool** com tanta frequência, resultando em menos operações de E/S e melhor utilização da memória de cache.

A partir do MySQL 5.7.9, o formato padrão da linha é definido por `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`.

Para informações adicionais sobre o formato da linha `InnoDB` `DYNAMIC`, consulte o Formato de linha dinâmico.

Veja também: buffer pool, formato de arquivo, formato de linha.

SQL dinâmico: Uma funcionalidade que permite criar e executar **declarações preparadas** usando métodos mais robustos, seguros e eficientes para substituir os valores dos parâmetros do que a técnica ingênua de concatenar as partes da declaração em uma variável de string.

Veja também a declaração preparada.

declaração dinâmica: Uma **declaração preparada** criada e executada através de **SQL dinâmico**.

Veja também SQL dinâmico, declaração preparada.

### E

adotante precoce: Uma fase semelhante à **beta**, quando um produto de software é tipicamente avaliado quanto ao desempenho, funcionalidade e compatibilidade em um ambiente não crítico para a missão.

Veja também beta.

Eiffel: Uma linguagem de programação que inclui muitas características orientadas a objetos. Alguns de seus conceitos são familiares aos desenvolvedores de **Java** e **C#**. Para a API Eiffel de código aberto para MySQL, consulte a Seção 31.13, “MySQL Eiffel Wrapper”.

Veja também API, C#, Java.

incorporado: A biblioteca do servidor MySQL incorporada (**libmysqld**) permite executar um servidor MySQL completo dentro de uma aplicação **cliente**. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações incorporadas.

Veja também cliente, libmysqld.

registro de erros: um tipo de **registro** que mostra informações sobre o início do MySQL e erros críticos durante o runtime e informações sobre **quebra**. Para detalhes, consulte a Seção 7.4.2, “O Registro de Erros”.

Veja também o crash, o log.

expulsão: O processo de remoção de um item de um cache ou de outra área de armazenamento temporário, como o **pool de buffer `InnoDB`**. Muitas vezes, mas nem sempre, utiliza o algoritmo **LRU** para determinar qual item deve ser removido. Quando uma **página suja** é expulsa, seus conteúdos são **flush** no disco, e quaisquer páginas **vizinhas sujas** também podem ser flush.

Veja também: buffer pool, página suja, esvaziar, LRU, página vizinha.

interceptador de exceção: Um tipo de **interceptador** para rastrear, depurar ou ampliar erros SQL encontrados por uma aplicação de banco de dados. Por exemplo, o código do interceptor pode emitir uma declaração `SHOW WARNINGS` para recuperar informações adicionais e adicionar texto descritivo ou até mesmo alterar o tipo da exceção devolvida à aplicação. Como o código do interceptor é chamado apenas quando as declarações SQL retornam erros, ele não impõe nenhuma penalidade de desempenho na aplicação durante a operação normal (sem erros).

Em aplicações **Java** que utilizam o **Connector/J**, configurar esse tipo de interceptor envolve a implementação da interface `com.mysql.jdbc.ExceptionInterceptor` e a adição de uma propriedade `exceptionInterceptors` à **string de conexão**.

Em aplicativos do **Visual Studio** que utilizam o **Connector/NET**, configurar esse tipo de interceptor envolve definir uma classe que herda da classe `BaseExceptionInterceptor` e especificar esse nome de classe como parte da string de conexão.

Veja também Connector/J, Connector/NET, interceptor, Java, Visual Studio.

bloqueio exclusivo: Um tipo de **bloqueio** que impede qualquer outra **transação** de bloquear a mesma linha. Dependendo do nível de **isolamento** da transação, esse tipo de bloqueio pode bloquear outras transações de escrever na mesma linha, ou também pode bloquear outras transações de ler a mesma linha. O nível de isolamento padrão `InnoDB`, **LEIA REPEATÁVEL**, permite maior **concorrência** ao permitir que as transações leiam linhas que têm bloqueios exclusivos, uma técnica conhecida como **leitura consistente**.

Veja também concorrência, leitura consistente, nível de isolamento, bloqueio, LEITURA REPEATÁVEL, bloqueio compartilhado, transação.

extensão: Um grupo de **páginas** dentro de um **espaço de tabelas**. Para o tamanho padrão de página de 16 KB, uma extensão contém 64 páginas. No MySQL 5.6, o tamanho da página para uma instância `InnoDB` pode ser de 4 KB, 8 KB ou 16 KB, controlado pela opção de configuração `innodb_page_size`. Para tamanhos de páginas de 4 KB, 8 KB e 16 KB, o tamanho da extensão é sempre 1 MB (ou 1048576 bytes).

O suporte para tamanhos de página de 32 KB e 64 KB `InnoDB` foi adicionado no MySQL 5.7.6. Para um tamanho de página de 32 KB, o tamanho do escopo é de 2 MB. Para um tamanho de página de 64 KB, o tamanho do escopo é de 4 MB.

`InnoDB` recursos como **segmentos**, **pedidos de leitura antecipada** e o **buffer de escrita dupla** utilizam operações de E/S que leem, escrevem, alocam ou liberam dados um a um.

Veja também buffer de escrita dupla, página, tamanho de página, leitura antecipada, segmento, tablespace.

### F

.frm arquivo: Um arquivo que contém os metadados, como a definição da tabela, de uma tabela MySQL. Os arquivos `.frm` foram removidos no MySQL 8.0, mas ainda são usados em versões anteriores do MySQL. No MySQL 8.0, os dados anteriormente armazenados nos arquivos `.frm` são armazenados em tabelas do **dicionário de dados**.

Veja também o dicionário de dados, o MySQL Enterprise Backup e o espaço de tabela do sistema.

failover: A capacidade de alternar automaticamente para um servidor de espera em caso de falha. No contexto do MySQL, o failover envolve um servidor de banco de dados de espera. Frequentemente suportado dentro de ambientes **J2EE** pelo servidor ou framework de aplicação.

Veja também Connector/J, J2EE.

Criação rápida de índice: Uma capacidade que foi introduzida pela primeira vez no Plugin InnoDB, agora parte do MySQL a partir da versão 5.5 e superior, que acelera a criação de índices secundários `InnoDB` **, evitando a necessidade de reescrever completamente a tabela associada. A aceleração também se aplica à remoção de índices secundários.

Como a manutenção de índices pode adicionar sobrecarga de desempenho a muitas operações de transferência de dados, considere realizar operações como `ALTER TABLE ... ENGINE=INNODB` ou `INSERT INTO ... SELECT * FROM ...` sem quaisquer índices secundários, e criar os índices posteriormente.

Em MySQL 5.6, esse recurso se torna mais geral. Você pode ler e escrever em tabelas enquanto um índice está sendo criado, e muitos outros tipos de operações `ALTER TABLE` podem ser realizadas sem copiar a tabela, sem bloquear operações **DML**, ou ambas. Assim, em MySQL 5.6 e superior, esse conjunto de recursos é referido como **DDL online** em vez de Criação de índice rápido.

Para informações relacionadas, consulte a Seção 17.12, “InnoDB e DDL Online”.

Veja também DML, índice, DDL online, índice secundário.

desativação rápida: O procedimento de **desativação** padrão para `InnoDB`, com base na configuração `innodb_fast_shutdown=1`, é executado. Para economizar tempo, certas operações de **limpeza** são ignoradas. Esse tipo de desativação é seguro durante o uso normal, porque as operações de limpeza são realizadas durante a próxima inicialização, usando o mesmo mecanismo que na **recuperação de falhas**. Em casos em que o banco de dados está sendo desativado para uma atualização ou downgrade, faça uma **desativação lenta** em vez disso, para garantir que todas as alterações relevantes sejam aplicadas aos **arquivos de dados** durante a desativação.

Veja também recuperação de falhas, arquivos de dados, esvaziamento, desligamento, desligamento lento.

formato de arquivo: O formato de arquivo para as tabelas `InnoDB`.

Veja também arquivo por tabela, arquivo .ibd, arquivo ibdata, formato de linha.

file-per-table: Um nome geral para a configuração controlada pela opção `innodb_file_per_table`, que é uma opção de configuração importante que afeta aspectos do armazenamento de arquivos `InnoDB`, disponibilidade de recursos e características de E/S. A partir do MySQL 5.6.7, `innodb_file_per_table` é habilitado por padrão.

Com a opção `innodb_file_per_table` habilitada, você pode criar uma tabela em seu próprio arquivo **.ibd** em vez dos arquivos compartilhados **ibdata** do **espaço de tabela do sistema**. Quando os dados da tabela são armazenados em um arquivo **.ibd** individual, você tem mais flexibilidade para escolher os **formatos de linha** necessários para recursos como **compressão de dados**. A operação `TRUNCATE TABLE` também é mais rápida, e o espaço recuperado pode ser usado pelo sistema operacional em vez de permanecer reservado para `InnoDB`.

O produto **MySQL Enterprise Backup** é mais flexível para tabelas que estão em seus próprios arquivos. Por exemplo, as tabelas podem ser excluídas de um backup, mas apenas se estiverem em arquivos separados. Assim, essa configuração é adequada para tabelas que são respaldadas com menos frequência ou em um cronograma diferente.

Veja também formato de linha compactada, compressão, formato de arquivo, arquivo .ibd, arquivo ibdata, innodb_file_per_table, MySQL Enterprise Backup, formato de linha, espaço de tabela do sistema.

coeficiente de preenchimento: Em um índice `InnoDB`, a proporção de uma **página** que é ocupada por dados de índice antes de a página ser dividida. O espaço não utilizado quando os dados de índice são divididos pela primeira vez entre páginas permite que as linhas sejam atualizadas com valores de cadeia mais longos sem exigir operações caras de manutenção de índice. Se o coeficiente de preenchimento for muito baixo, o índice consome mais espaço do que o necessário, causando sobrecarga de E/S extra ao ler o índice. Se o coeficiente de preenchimento for muito alto, qualquer atualização que aumente o comprimento dos valores das colunas pode causar sobrecarga de E/S extra para a manutenção do índice. Consulte a Seção 17.6.2.2, “A Estrutura Física de um Índice InnoDB”, para mais informações.

Veja também o índice, página.

formato de linha fixo: Este formato de linha é usado pelo mecanismo de armazenamento `MyISAM`, não pelo `InnoDB`. Se você criar uma tabela `InnoDB` com a opção `ROW_FORMAT=FIXED` no MySQL 5.7.6 ou versões anteriores, o `InnoDB` usa o **formato de linha compacta**, embora o valor do `FIXED` ainda possa aparecer em saídas como relatórios `SHOW TABLE STATUS`. A partir do MySQL 5.7.7, o `InnoDB` retorna um erro se `ROW_FORMAT=FIXED` for especificado.

Veja também o formato de linha compacta, formato de linha.

flush: Para escrever as alterações nos arquivos do banco de dados, que haviam sido armazenados em uma área de memória ou em uma área de armazenamento temporária em disco. As estruturas de armazenamento `InnoDB` que são periodicamente limpas incluem o **registro de refazer**, o **registro de desfazer** e o **pool de buffer**.

O término pode ocorrer porque uma área de memória fica cheia e o sistema precisa liberar algum espaço, porque uma operação de **commit** significa que as alterações de uma transação podem ser finalizadas, ou porque uma operação de **desativação lenta** significa que todo o trabalho pendente deve ser finalizado. Quando não é crítico esvaziar todos os dados armazenados de uma vez, `InnoDB` pode usar uma técnica chamada **ponto de verificação difuso** para esvaziar pequenos lotes de páginas para espalhar o overhead de I/O.

Veja também: buffer pool, commit, checkpointing difuso, log de refazer, desligamento lento, log de desfazer.

lista de limpeza: Uma estrutura de dados interna `InnoDB` que rastreia **páginas sujas** no **buffer pool**: ou seja, **páginas** que foram alteradas e precisam ser escritas de volta no disco. Essa estrutura de dados é atualizada frequentemente por `InnoDB` **mini-transações** internas, e, portanto, é protegida por seu próprio **mutex** para permitir acesso concorrente ao buffer pool.

Veja também: buffer pool, página suja, LRU, mini-transação, mutex, página, limpador de página.

chave estrangeira: Um tipo de relação de ponteiro, entre linhas em tabelas separadas `InnoDB`. A relação de chave estrangeira é definida em uma coluna tanto na **tabela pai** quanto na **tabela filho**.

Além de permitir a busca rápida de informações relacionadas, as chaves estrangeiras ajudam a impor a **integridade referencial**, impedindo que qualquer um desses ponteiros se torne inválido à medida que os dados são inseridos, atualizados e excluídos. Esse mecanismo de aplicação é um tipo de **restrição**. Uma linha que aponta para outra tabela não pode ser inserida se o valor da chave estrangeira associada não existir na outra tabela. Se uma linha for excluída ou seu valor de chave estrangeira for alterado, e linhas em outra tabela apontarem para esse valor da chave estrangeira, a chave estrangeira pode ser configurada para impedir a exclusão, fazer com que os valores das colunas correspondentes na outra tabela se tornem **nulos** ou excluir automaticamente as linhas correspondentes na outra tabela.

Uma das etapas na concepção de um banco de dados **normalizado** é identificar os dados que estão duplicados, separar esses dados em uma nova tabela e configurar uma relação de chave estrangeira para que as múltiplas tabelas possam ser consultadas como uma única tabela, utilizando uma operação de **join**.

Veja também tabela de crianças, restrição FOREIGN KEY, junção, normalizada, NULL, tabela pai, integridade referencial, relacional.

Restrição de CHAVE ESTÁVEL: O tipo de **restrição** que mantém a consistência do banco de dados através de uma **chave estável** (foreign key). Como outros tipos de restrições, ela pode impedir que dados sejam inseridos ou atualizados se os dados se tornassem inconsistentes; nesse caso, a inconsistência que está sendo impedida é entre dados em múltiplas tabelas. Alternativamente, quando uma operação de **DML** é realizada, as restrições `FOREIGN KEY` podem fazer com que os dados em **linhas filhas** sejam excluídos, alterados para valores diferentes ou definidos como **nulos**, com base na opção `ON CASCADE` especificada ao criar a chave estável.

Veja também tabela infantil, restrição, DML, chave estrangeira, NULL.

FTS: Na maioria dos contextos, um acrônimo para **pesquisa de texto completo**. Às vezes, em discussões de desempenho, um acrônimo para **escaneamento completo da tabela**.

Veja também varredura completa da tabela, pesquisa de texto completo.

backup completo: Um **backup** que inclui todas as **tabuletas** em cada **banco de dados** MySQL e todos os bancos de dados em uma **instância** MySQL. Contrasta com o **backup parcial**.

Veja também backup, banco de dados, instância, backup parcial, tabela.

escaneamento completo da tabela: Uma operação que exige a leitura de todo o conteúdo de uma tabela, em vez de apenas porções selecionadas, utilizando um **índice**. Tipicamente, realizada com tabelas de busca pequenas ou em situações de data warehousing com tabelas grandes, onde todos os dados disponíveis são agregados e analisados. A frequência com que essas operações ocorrem e o tamanho das tabelas em relação à memória disponível têm implicações para os algoritmos utilizados na otimização de consultas e no gerenciamento do **pool de buffers**.

O propósito dos índices é permitir pesquisas por valores específicos ou faixas de valores dentro de uma grande tabela, evitando, assim, a varredura completa da tabela quando possível.

Veja também buffer pool, index.

pesquisa de texto completo: O recurso MySQL para encontrar palavras, frases, combinações lógicas de palavras, etc., nos dados da tabela, de uma maneira mais rápida, conveniente e flexível do que usar o operador `LIKE` do SQL ou escrever seu próprio algoritmo de pesquisa de nível de aplicação. Ele usa a função SQL `MATCH()` e **índices FULLTEXT**.

Veja também o índice FULLTEXT.

ÍNDICE FULLTEXT: O tipo especial de **índice** que contém o **índice de pesquisa** no mecanismo de **pesquisa full-text** do MySQL. Representa as palavras dos valores de uma coluna, omitindo quaisquer que sejam especificados como **stopwords**. Originalmente, disponível apenas para as tabelas `MyISAM`. A partir do MySQL 5.6.4, também está disponível para tabelas **InnoDB**.

Veja também pesquisa de texto completo, índice, InnoDB, índice de pesquisa, stopword.

checkpointing borrado: Uma técnica que **limpa** pequenos lotes de **páginas sujas** do **pool de buffer**, em vez de limpar todas as páginas sujas de uma vez, o que interromperia o processamento do banco de dados.

Veja também: buffer pool, página suja, esvaziar.

### G

GA: “Geralmente disponível”, é a fase em que um produto de software sai da fase **beta** e está disponível para venda, suporte oficial e uso produtivo.

Veja também beta.

GAC: Abreviação de “Cache de Assembleia Global”. Uma área central para armazenar bibliotecas (**assemblies**) em um sistema **.NET**. Fisicamente consiste em pastas aninhadas, tratadas como uma única pasta virtual pelo **.NET** CLR.

Veja também .NET, assembly.

lacuna: Um local em uma estrutura de dados de índice do `InnoDB` **onde novos valores poderiam ser inseridos. Quando você bloqueia um conjunto de linhas com uma declaração como `SELECT ... FOR UPDATE`, o `InnoDB` pode criar bloqueios que se aplicam às lacunas, bem como aos valores reais no índice. Por exemplo, se você selecionar todos os valores maiores que 10 para atualização, um bloqueio de lacuna impede que outra transação insira um novo valor maior que 10. O **registro máximo** e **registro mínimo** representam as lacunas que contêm todos os valores maiores que ou menores que todos os valores atuais do índice.

Veja também concorrência, bloqueio de lacuna, índice, mínimo de registro, nível de isolamento, máximo de registro.

bloqueio de lacuna: um **bloqueio** em um **espaço** entre os registros do índice, ou um bloqueio na lacuna antes do primeiro ou após o último registro do índice. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;` impede que outras transações insiram um valor de 15 na coluna `t.c1`, independentemente de já existir algum valor desse tipo na coluna, porque as lacunas entre todos os valores existentes na faixa estão bloqueadas. Em contraste com o **bloqueio de registro** e o **bloqueio de próxima chave**.

As chaves de lacuna fazem parte do compromisso entre desempenho e **concorrência**, e são usadas em alguns níveis de **isolamento de transação** e não em outros.

Veja também gap, registro mínimo, bloqueio, bloqueio da próxima chave, bloqueio de registro, registro máximo.

registro geral: Veja o registro de consulta geral.

registro de consulta geral: Um tipo de **registro** usado para diagnóstico e solução de problemas de declarações SQL processadas pelo servidor MySQL. Pode ser armazenado em um arquivo ou em uma tabela de banco de dados. Você deve habilitar essa funcionalidade através da opção de configuração `general_log` para usá-la. Você pode desativá-la para uma conexão específica através da opção de configuração `sql_log_off`.

Registra uma gama mais ampla de consultas do que o **registro de consultas lentas**. Ao contrário do **registro binário**, que é usado para replicação, o registro de consultas geral contém `SELECT` e não mantém uma ordem estrita. Para mais informações, consulte a Seção 7.4.3, “O registro de consultas geral”.

Veja também: log binário, log, log de consultas lentas.

espaço de tabelas geral: Um espaço de tabelas compartilhado `InnoDB` **criado usando a sintaxe `CREATE TABLESPACE`. Espaços de tabelas gerais podem ser criados fora do diretório de dados do MySQL, são capazes de conter múltiplas **tabelas** e suportam tabelas de todos os formatos de linha. Espaços de tabelas gerais foram introduzidos no MySQL 5.7.6.

As tabelas são adicionadas a um espaço de tabelas geral usando a sintaxe `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` (create-table.html "15.1.20 CREATE TABLE Statement") ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` (alter-table.html "15.1.9 ALTER TABLE Statement").

Contrastando com o **espaço de tabela do sistema** e o **espaço de tabela por arquivo**.

Para mais informações, consulte a Seção 17.6.3.3, “Tabelas gerais”.

Veja também arquivo por tabela, espaço de tabela do sistema, tabela, espaço de tabela.

coluna gerada: Uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Uma coluna gerada pode ser **virtual** ou **armazenada**.

Veja também a coluna base, coluna gerada armazenada, coluna gerada virtual.

coluna gerada armazenada: Veja a coluna gerada armazenada.

Veja a coluna virtual gerada.

Glassfish: Veja também J2EE.

espaço de tabelas temporário global: Um *espaço de tabelas temporário* que armazena *segmentos de rollback* para as alterações feitas em tabelas temporárias criadas pelo usuário.

Veja também o espaço de tabela temporário.

transação global: Um tipo de **transação** envolvida em operações **XA**. Ela consiste em várias ações que são transacionais em si mesmas, mas que todas devem completar com sucesso como um grupo, ou todas devem ser revertidas como um grupo. Em essência, isso estende as propriedades **ACID** “a um nível superior” para que múltiplas transações ACID possam ser executadas em conjunto como componentes de uma operação global que também possui propriedades ACID.

Veja também ACID, transação, XA.

grupo de compromisso: Uma otimização `InnoDB` que realiza algumas operações de E/S de baixo nível (escrita de log) uma vez para um conjunto de operações de **compromisso**, em vez de esvaziar e sincronizar separadamente para cada compromisso.

Veja também log binário, commit.

GUID: Abreviação de “identificador globalmente único”, um valor de ID que pode ser usado para associar dados em diferentes bancos de dados, idiomas, sistemas operacionais, etc. (Como alternativa ao uso de números sequenciais, onde os mesmos valores poderiam aparecer em diferentes tabelas, bancos de dados, etc., referenciando dados diferentes). As versões mais antigas do MySQL o representavam como `BINARY(16)`. Atualmente, é representado como `CHAR(36)`. O MySQL tem uma função `UUID()` que retorna valores GUID em formato de caracteres e uma função `UUID_SHORT()` que retorna valores GUID em formato de inteiro. Como os valores de GUID consecutivos não são necessariamente em ordem de classificação ascendente, não é um valor eficiente para usar como chave primária para grandes tabelas InnoDB.

### H

índice hash: um tipo de **índice** destinado a consultas que utilizam operadores de igualdade, em vez de operadores de intervalo, como maior que ou `BETWEEN`. Está disponível para tabelas `MEMORY`. Embora os índices hash sejam o padrão para tabelas `MEMORY` por razões históricas, esse mecanismo de armazenamento também suporta índices de **árvore B**, que são frequentemente uma escolha melhor para consultas de propósito geral.

O MySQL inclui uma variante deste tipo de índice, o **índice de hash adaptável**, que é construído automaticamente para as tabelas `InnoDB` se necessário, com base em condições de execução.

Veja também índice de hash adaptável, árvore B, índice, InnoDB.

HDD: Abreviação de “disco rígido”. Refere-se a mídia de armazenamento que utiliza discos giratórios, geralmente quando se compara e contrasta com **SSD**. Suas características de desempenho podem influenciar o desempenho de uma carga de trabalho **baseada em disco**.

Veja também disco-based, SSD.

batida do coração: Uma mensagem periódica que é enviada para indicar que um sistema está funcionando corretamente. Em um contexto de **replicação**, se a **fonte** parar de enviar essas mensagens, uma das **replicas** pode assumir seu lugar. Técnicas semelhantes podem ser usadas entre os servidores em um ambiente de clúster, para confirmar que todos estão operando corretamente.

Veja também replicação, fonte.

limite máximo: Um valor que representa um limite superior, seja um limite rígido que não deve ser excedido durante a execução, ou um registro do valor máximo que foi realmente alcançado. Contrasta com **limite mínimo**.

Veja também o nível mínimo de água.

lista de histórico: Uma lista de **transações** com registros marcados para exclusão, programados para serem processados pela operação de **limpeza** `InnoDB`. Registrada no **registro de desfazer**. O comprimento da lista de histórico é reportado pelo comando `SHOW ENGINE INNODB STATUS`. Se a lista de histórico crescer mais do que o valor da opção de configuração `innodb_max_purge_lag`, cada operação **DML** é adiada ligeiramente para permitir que a operação de limpeza **limpe** os registros excluídos.

Também conhecida como **lag de purga**.

Veja também DML, esvaziar, purgar, purgar atraso, segmento de rollback, transação, registro de desfazer.

perforação de buracos: Liberação de blocos vazios de uma página. O recurso de `InnoDB` **compressão transparente de página** depende do suporte à perfuração de buracos. Para mais informações, consulte a Seção 17.9.2, “Compressão de página InnoDB”.

Veja também o arquivo esparso, compressão transparente da página.

hospedeiro: O nome da rede de um servidor de banco de dados, usado para estabelecer uma **conexão**. Frequentemente especificado em conjunto com uma **porta**. Em alguns contextos, o endereço IP `127.0.0.1` funciona melhor do que o nome especial `localhost` para acessar um banco de dados no mesmo servidor que o aplicativo.

Veja também conexão, localhost, porta.

hot: Uma condição em que uma linha, tabela ou estrutura de dados interna é acessada com tanta frequência, exigindo alguma forma de bloqueio ou exclusão mútua, que resulta em um problema de desempenho ou escalabilidade.

Embora "quente" geralmente indique uma condição indesejável, um **backup quente** é o tipo preferido de backup.

Veja também backup quente.

backup quente: Um backup realizado enquanto o banco de dados está em execução e as aplicações estão lendo e escrevendo nele. O backup envolve mais do que simplesmente copiar arquivos de dados: ele deve incluir quaisquer dados que foram inseridos ou atualizados enquanto o backup estava em processo; deve excluir quaisquer dados que foram excluídos enquanto o backup estava em processo; e deve ignorar quaisquer alterações que não foram comprometidas.

O produto da Oracle que realiza backups quentes, especialmente das tabelas do `InnoDB`, mas também das tabelas do `MyISAM` e de outros motores de armazenamento, é conhecido como **MySQL Enterprise Backup**.

O processo de backup quente consiste em duas etapas. A cópia inicial dos arquivos de dados produz um **backup bruto**. A etapa de **aplicação** incorpora quaisquer alterações no banco de dados que ocorreram enquanto o backup estava em execução. A aplicação das alterações produz um **backup preparado**. Esses arquivos estão prontos para serem restaurados sempre que necessário.

Veja também aplicar, MySQL Enterprise Backup, backup preparado, backup bruto.

### I

.ibd arquivo: O arquivo de dados para os espaços de tabela **file-per-table** e espaços de tabela gerais. Os arquivos de espaço de tabela por tabela `.ibd` contêm uma única tabela e dados de índice associados. Os arquivos de espaço de tabela geral `.ibd` podem conter dados de tabela e índice para várias tabelas.

A extensão do arquivo `.ibd` não se aplica ao **espaço de tabela do sistema**, que consiste em um ou mais **arquivos ibdata**.

Se um espaço de tabela por arquivo ou um espaço de tabela geral for criado com a cláusula `DATA DIRECTORY =`, o arquivo `.ibd` está localizado no caminho especificado, fora do diretório de dados normal.

Quando um arquivo `.ibd` é incluído em um backup comprimido pelo produto **MySQL Enterprise Backup**, o equivalente comprimido é um arquivo `.ibz`.

Veja também banco de dados, arquivo por tabela, espaço de tabela geral, arquivo ibdata, arquivo .ibz, innodb_file_per_table, MySQL Enterprise Backup, espaço de tabela do sistema.

.ibz arquivo: Quando o produto **MySQL Enterprise Backup** realiza um **backup comprimido**, ele transforma cada arquivo de **tablespace** que é criado usando a configuração **file-per-table** (arquivo por tabela) de uma extensão `.ibd` para uma extensão `.ibz`.

A compressão aplicada durante o backup é distinta do **formato de linha comprimido** que mantém os dados da tabela comprimidos durante o funcionamento normal. Uma operação de backup comprimida ignora o passo de compressão para um espaço de tabela que já está no formato de linha comprimido, pois comprimir uma segunda vez atrasaria o backup, mas produziria pouca ou nenhuma economia de espaço.

Veja também: backup comprimido, formato de linha comprimido, arquivo por tabela, arquivo .ibd, MySQL Enterprise Backup, espaço de tabela.

Bound I/O: Veja disco-bound.

conjunto de arquivos gerenciado por `InnoDB` dentro de um banco de dados MySQL: os **espaços de sistema**, os arquivos de **arquivo por tabela** e os arquivos de **registro de revisão**. Dependendo da versão do MySQL e da configuração de `InnoDB`, também pode incluir **espaços de tabela gerais**, **espaços de tabela temporários** e **espaços de desfazer**. Este termo é usado às vezes em discussões detalhadas sobre as estruturas e formatos de arquivos de `InnoDB` para se referir ao conjunto de arquivos gerenciado por `InnoDB` dentro de um banco de dados MySQL.

Veja também banco de dados, arquivo por tabela, espaço de tabela geral, log de refazer, espaço de tabela do sistema, espaço de tabela temporário, espaço de tabela de desfazer.

ibbackup_logfile: Um arquivo de backup suplementar criado pelo produto **MySQL Enterprise Backup** durante uma operação de **backup quente**. Ele contém informações sobre quaisquer alterações de dados que ocorreram enquanto o backup estava sendo executado. Os arquivos de backup inicial, incluindo `ibbackup_logfile`, são conhecidos como um **backup bruto**, porque as alterações que ocorreram durante a operação de backup ainda não foram incorporadas. Após realizar a etapa de **aplicação** aos arquivos de backup bruto, os arquivos resultantes incluem essas alterações finais e são conhecidos como um **backup preparado**. Nesta etapa, o arquivo `ibbackup_logfile` não é mais necessário.

Veja também aplicar, backup quente, MySQL Enterprise Backup, backup preparado, backup bruto.

arquivo ibdata: Um conjunto de arquivos com nomes como `ibdata1`, `ibdata2`, e assim por diante, que compõem o **espaço de tabelas do sistema** `InnoDB`. Para informações sobre as estruturas e os dados que residem nos arquivos do espaço de tabelas do sistema `ibdata`, consulte a Seção 17.6.3.1, “O Espaço de Tabelas do Sistema”.

O crescimento dos arquivos `ibdata` é influenciado pela opção de configuração `innodb_autoextend_increment`.

Veja também: buffer de alteração, dicionário de dados, buffer de escrita dupla, arquivo por tabela, arquivo .ibd, innodb_file_per_table, espaço de sistema, registro de desfazer.

arquivo ibtmp: O arquivo de dados do **espaço de tabelas temporário** `InnoDB` **para tabelas temporárias não comprimidas** e objetos relacionados. A opção do arquivo de configuração, `innodb_temp_data_file_path`, permite que os usuários definam um caminho relativo para o arquivo de dados do espaço de tabelas temporário. Se `innodb_temp_data_file_path` não for especificado, o comportamento padrão é criar um arquivo de dados auto-extensibile de 12 MB chamado `ibtmp1` no diretório de dados, juntamente com `ibdata1`.

Veja também arquivos de dados, tabela temporária, espaço de tabela temporária.

ib_logfile: Um conjunto de arquivos, tipicamente nomeados `ib_logfile0` e `ib_logfile1`, que formam o **registro de refazer**. Também às vezes referido como o **grupo de registro**. Esses arquivos registram declarações que tentam alterar dados nas tabelas `InnoDB`. Essas declarações são reexecutadas automaticamente para corrigir dados escritos por transações incompletas, na inicialização após um acidente.

Esses dados não podem ser usados para recuperação manual; para esse tipo de operação, use o **registro binário**.

Veja também: log binário, grupo de log, log redo.

ilist: Dentro de um índice `InnoDB` **FULLTEXT**, a estrutura de dados consiste em um ID de documento e informações posicionais para um token (ou seja, uma palavra específica).

Veja também o índice FULLTEXT.

bloqueio implícito de linha: um bloqueio de linha que o `InnoDB` adquire para garantir a consistência, sem que você o solicite especificamente.

Veja também o bloqueio de linha de verticais.

banco de dados em memória: um tipo de sistema de banco de dados que mantém os dados na memória, para evitar o overhead devido ao I/O de disco e à tradução entre blocos de disco e áreas de memória. Alguns bancos de dados em memória sacrificam a durabilidade (o “D” na filosofia de projeto **ACID**) e são vulneráveis a falhas de hardware, de energia e outros tipos de falhas, tornando-os mais adequados para operações de leitura apenas. Outros bancos de dados em memória utilizam mecanismos de durabilidade, como o registro de alterações no disco ou o uso de memória não volátil.

As funcionalidades do MySQL que abordam os mesmos tipos de processamento intensivo de memória incluem o `InnoDB` **buffer pool**, **índice hash adaptável** e **transação somente leitura** de otimização, o mecanismo de armazenamento `MEMORY`, o cache de chave `MyISAM` e o cache de consulta MySQL.

Veja também ACID, índice de hash adaptável, conjunto de buffers, baseado em disco, transação somente de leitura.

backup incremental: Um tipo de **backup quente**, realizado pelo produto **MySQL Enterprise Backup**, que apenas salva dados alterados desde algum ponto no tempo. Ter um backup completo e uma sucessão de backups incrementais permite que você reconstrua os dados do backup em um longo período, sem o custo de armazenamento de manter vários backups completos à mão. Você pode restaurar o backup completo e, em seguida, aplicar cada um dos backups incrementais em sucessão, ou você pode manter o backup completo atualizado aplicando cada backup incremental a ele, e então realizar uma única operação de restauração.

A granularidade dos dados alterados está no nível de **página**. Uma página pode, na verdade, cobrir mais de uma linha. Cada página alterada é incluída no backup.

Veja também backup quente, MySQL Enterprise Backup, página.

índice: Uma estrutura de dados que oferece uma capacidade de busca rápida para **linhas** de uma **tabela**, tipicamente formando uma estrutura em árvore (**árvore B**) que representa todos os valores de uma **coluna** ou conjunto de colunas específicas.

As tabelas `InnoDB` sempre têm um **índice agrupado** que representa a **chave primária**. Elas também podem ter um ou mais **índices secundários** definidos em uma ou mais colunas. Dependendo de sua estrutura, os índices secundários podem ser classificados como **parciais**, **coluna** ou **compostos**.

Os índices são um aspecto crucial do desempenho das consultas. Os arquitetos de banco de dados projetam tabelas, consultas e índices para permitir buscas rápidas pelos dados necessários pelas aplicações. O projeto de banco de dados ideal utiliza um **índice coberto** onde é prático; os resultados das consultas são calculados inteiramente a partir do índice, sem ler os dados reais da tabela. Cada **constrangimento de chave estrangeira** também requer um índice, para verificar eficientemente se os valores existem tanto nas tabelas **pai** quanto na **filha**.

Embora um índice de árvore B seja o mais comum, um tipo diferente de estrutura de dados é usado para índices de **hash**, como no motor de armazenamento `MEMORY` e no **índice de hash adaptativo** `InnoDB`. Índices de **R-tree** são usados para indexação espacial de informações multidimensionais.

Veja também índice de hash adaptável, árvore B, tabela filho, índice agrupado, índice de coluna, índice composto, índice coberto, chave estrangeira, índice de hash, tabela pai, índice parcial, chave primária, consulta, árvore R, linha, índice secundário, tabela.

cache de índice: Uma área de memória que armazena os dados do token para a pesquisa de **texto completo** de `InnoDB`. O cache de dados armazena os dados para minimizar o I/O de disco quando os dados são inseridos ou atualizados em colunas que fazem parte de um **índice FULLTEXT**. Os dados do token são escritos em disco quando o cache de índice se esgota. Cada índice `InnoDB` `FULLTEXT` tem seu próprio cache de índice separado, cujo tamanho é controlado pela opção de configuração `innodb_ft_cache_size`.

Veja também pesquisa de texto completo, índice FULLTEXT.

index condition pushdown: O index condition pushdown (ICP) é uma otimização que empurra parte de uma condição `WHERE` para o motor de armazenamento se partes da condição puderem ser avaliadas usando campos do **índice**. O ICP pode reduzir o número de vezes que o **motor de armazenamento** deve acessar a tabela base e o número de vezes que o servidor MySQL deve acessar o motor de armazenamento. Para mais informações, consulte a Seção 10.2.1.6, “Otimização de Index Condition Pushdown”.

Veja também o índice de indexação e o mecanismo de armazenamento.

Dica de índice: Sintaxe SQL estendida para sobrepor os **índices** recomendados pelo otimizador. Por exemplo, as cláusulas `FORCE INDEX`, `USE INDEX` e `IGNORE INDEX`. Tipicamente usada quando as colunas indexadas têm valores distribuídos de forma desigual, resultando em estimativas de **cardinalidade** imprecisas.

Veja também cardinalidade, índice.

prefixo do índice: Em um **índice** que se aplica a várias colunas (conhecido como **índice composto**), as colunas iniciais ou de liderança do índice. Uma consulta que faz referência às primeiras 1, 2, 3, e assim por diante, colunas de um índice composto pode usar o índice, mesmo que a consulta não faça referência a todas as colunas do índice.

Veja também índice composto, índice.

estatísticas de índice: Veja as estatísticas.

registro infimum: Um **pseudo-registro** em um **índice**, representando o **gap** abaixo do menor valor nesse índice. Se uma transação tiver uma declaração como `SELECT ... FROM ... WHERE col < 10 FOR UPDATE;`, e o menor valor na coluna for 5, é um bloqueio no registro infimum que impede que outras transações insiram valores ainda menores, como 0, -10, e assim por diante.

Veja também gap, índice, registro pseudo, registro supremum.

INFORMATION_SCHEMA: O nome do **banco de dados** que fornece uma interface de consulta ao **dicionário de dados** do MySQL. (Esse nome é definido pelo padrão ANSI SQL.) Para examinar informações (metadados) sobre o banco de dados, você pode consultar tabelas como `INFORMATION_SCHEMA.TABLES` e `INFORMATION_SCHEMA.COLUMNS`, em vez de usar comandos `SHOW` que produzem saída não estruturada.

O banco de dados `INFORMATION_SCHEMA` também contém tabelas específicas para **InnoDB** que fornecem uma interface de consulta ao dicionário de dados `InnoDB`. Você não usa essas tabelas para ver como o banco de dados está estruturado, mas para obter informações em tempo real sobre o funcionamento das tabelas `InnoDB` para ajudar no monitoramento de desempenho, ajuste e solução de problemas.

Veja também o dicionário de dados, banco de dados, InnoDB.

InnoDB: Um componente do MySQL que combina alto desempenho com capacidade **transacional** para confiabilidade, robustez e acesso concorrente. Ele incorpora a filosofia de design **ACID**. Representado como um **motor de armazenamento**, ele lida com tabelas criadas ou alteradas com a cláusula `ENGINE=INNODB`. Veja o Capítulo 17, *O Motor de Armazenamento InnoDB*, para detalhes arquitetônicos e procedimentos de administração, e a Seção 10.5, “Otimizando para Tabelas InnoDB”, para conselhos de desempenho.

Em MySQL 5.5 e superior, `InnoDB` é o mecanismo de armazenamento padrão para novas tabelas e a cláusula `ENGINE=INNODB` não é necessária.

As tabelas `InnoDB` são ideais para **backup quente**. Consulte a Seção 32.1, “Visão Geral do Backup Empresarial do MySQL”, para obter informações sobre o produto **Backup Empresarial do MySQL** para fazer backup de servidores MySQL sem interromper o processamento normal.

Veja também ACID, backup quente, MySQL Enterprise Backup, mecanismo de armazenamento, transação.

innodb_autoinc_lock_mode: A opção `innodb_autoinc_lock_mode` controla o algoritmo usado para **bloqueio de autoincremento**. Quando você tem uma chave primária com autoincremento, você pode usar a replicação baseada em declarações apenas com a configuração `innodb_autoinc_lock_mode=1`. Esta configuração é conhecida como modo de bloqueio *consecutivo*, porque as inserções de várias linhas dentro de uma transação recebem valores consecutivos de autoincremento. Se você tiver `innodb_autoinc_lock_mode=2`, que permite maior concorrência para operações de inserção, use a replicação baseada em linhas em vez da replicação baseada em declarações. Esta configuração é conhecida como modo de bloqueio *interlaçado*, porque múltiplas declarações de inserção de várias linhas que são executadas ao mesmo tempo podem receber valores de **autoincremento** que são interligados. A configuração `innodb_autoinc_lock_mode=0` não deve ser usada, exceto por motivos de compatibilidade.

O modo de bloqueio consecutivo (`innodb_autoinc_lock_mode=1`) é o ajuste padrão antes do MySQL 8.0.3. A partir do MySQL 8.0.3, o modo de bloqueio interlaçado (`innodb_autoinc_lock_mode=2`) é o padrão, o que reflete a mudança de replicação baseada em declarações para replicação baseada em linhas como o tipo de replicação padrão.

Veja também auto-incremento, bloqueio de auto-incremento, inserção em modo misto, chave primária.

innodb_file_per_table: Uma opção de configuração importante que afeta muitos aspectos do armazenamento de arquivos do `InnoDB`, disponibilidade de recursos e características de I/O. No MySQL 5.6.7 e superior, ela é habilitada por padrão. A opção `innodb_file_per_table` ativa o modo **file-per-table**. Com este modo habilitado, uma tabela recém-criada do `InnoDB` e índices associados podem ser armazenados em um arquivo por tabela **.ibd**, fora do **espaço de tabelas do sistema**.

Esta opção afeta as considerações de desempenho e armazenamento para uma série de declarações SQL, como `DROP TABLE` e `TRUNCATE TABLE`.

Ativação da opção `innodb_file_per_table` permite que você aproveite recursos como a **compressão de tabela** e backups de tabelas nomeadas no **MySQL Enterprise Backup**.

Para mais informações, consulte `innodb_file_per_table`, e a Seção 17.6.3.2, “File-Per-Table Tablespaces”.

Veja também compressão, arquivo por tabela, arquivo .ibd, MySQL Enterprise Backup, espaço de tabela do sistema.

innodb_lock_wait_timeout: A opção `innodb_lock_wait_timeout` define o equilíbrio entre **esperar** que os recursos compartilhados se tornem disponíveis, ou desistir e lidar com o erro, tentar novamente ou realizar processamento alternativo em sua aplicação. Reverte qualquer transação `InnoDB` que espera mais de um tempo especificado para adquirir um **bloqueio**. Especialmente útil se **deadlocks** são causados por atualizações em várias tabelas controladas por diferentes motores de armazenamento; tais deadlocks não são **detectados** automaticamente.

Veja também: impasse, detecção de impasse, bloqueio, espera.

innodb_strict_mode: A opção `innodb_strict_mode` controla se o `InnoDB` opera no modo **estendido**, onde as condições que normalmente são tratadas como avisos causam erros (e as declarações subjacentes falham).

Veja também o modo rigoroso.

Série de inovação: As versões de inovação com a mesma versão principal formam uma série de inovação. Por exemplo, MySQL 8.1 a 8.3 formam a série de inovação MySQL 8.

Veja também a Série LTS.

inserir: Uma das operações **DML** primárias em **SQL**. O desempenho das inserções é um fator chave em sistemas de **data warehouse** que carregam milhões de linhas em tabelas, e em sistemas **OLTP** onde muitas conexões concorrentes podem inserir linhas na mesma tabela, em ordem arbitrária. Se o desempenho das inserções é importante para você, você deve aprender sobre as características do **InnoDB**, como o **buffer de inserção** usado no **bufferamento de alterações** e colunas de **auto-incremento**.

Veja também auto-incremento, alteração de buffer, armazém de dados, DML, InnoDB, buffer de inserção, OLTP, SQL.

inserir buffer: O nome anterior do *buffer de mudança*. No MySQL 5.5, foi adicionado suporte para bufferar mudanças em páginas de índice secundário para as operações `DELETE` e `UPDATE`. Anteriormente, apenas as mudanças resultantes das operações `INSERT` eram bufferadas. O termo preferido é agora *buffer de mudança*.

Veja também alterar buffer, alterar buffer.

inserir buffer: A técnica de armazenar as alterações nas páginas de índice secundário, resultantes das operações de `INSERT`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas e minimizar o I/O aleatório. É um dos tipos de **buffering de alterações**: os outros são **buffering de exclusão** e **buffering de purga**.

O buffer de inserção não é usado se o índice secundário for **único**, porque a unicidade dos novos valores não pode ser verificada antes de as novas entradas serem escritas. Outros tipos de buffer de mudança funcionam para índices únicos.

Veja também alterar buffer, alterar bufferização, excluir bufferização, inserir bufferização, purgar bufferização, índice único.

inserir bloqueio de intenção: Um tipo de **bloqueio de lacuna** que é definido pelas operações de `INSERT` antes da inserção da linha. Esse tipo de **bloqueio** sinaliza a intenção de inserir de tal forma que várias transações que inserem no mesmo intervalo do índice não precisam esperar uma da outra se elas não estão inserindo na mesma posição dentro da lacuna. Para mais informações, consulte a Seção 17.7.1, “Bloqueio InnoDB”.

Veja também bloqueio de lacuna, bloqueio, bloqueio da próxima chave.

Por exemplo: um único **mysqld** daemon gerenciando um **diretório de dados** que representa um ou mais **bancos de dados** com um conjunto de **tabelas**. É comum em cenários de desenvolvimento, testes e **replicação**, ter várias instâncias na mesma máquina **servidor**, cada uma gerenciando seu próprio diretório de dados e ouvindo em sua própria porta ou soquete. Com uma instância executando uma carga de trabalho **ligada a disco**, o servidor ainda pode ter capacidade de CPU e memória extra para executar instâncias adicionais.

Veja também diretório de dados, banco de dados, vinculado ao disco, mysqld, replicação, servidor, tabela.

instrumentação: Modificações no nível do código-fonte para coletar dados de desempenho para ajustes e depuração. No MySQL, os dados coletados pela instrumentação são expostos por meio de uma interface SQL usando as bases de dados `INFORMATION_SCHEMA` e `PERFORMANCE_SCHEMA`.

Veja também INFORMATION_SCHEMA, Schema de desempenho.

bloqueio exclusivo de intenção: Veja bloqueio de intenção.

bloqueio de intenção: Um tipo de **bloqueio** que se aplica à tabela, usado para indicar o tipo de bloqueio que a **transação** pretende adquirir sobre as linhas na tabela. Diferentes transações podem adquirir diferentes tipos de bloqueios de intenção na mesma tabela, mas a primeira transação a adquirir um bloqueio de intenção exclusivo (IX) em uma tabela impede que outras transações adquiram quaisquer blocos S ou X na tabela. Por outro lado, a primeira transação a adquirir um bloqueio de intenção compartilhada (IS) em uma tabela impede que outras transações adquiram quaisquer blocos X na tabela. O processo de duas fases permite que as solicitações de bloqueio sejam resolvidas em ordem, sem bloquear blocos e operações correspondentes que são compatíveis. Para mais informações sobre esse mecanismo de bloqueio, consulte a Seção 17.7.1, “Bloqueio InnoDB”.

Veja também bloqueio, modo de bloqueio, bloqueio, transação.

bloqueio de intenção compartilhado: Veja bloqueio de intenção.

interceptador: Código para instrurar ou depurar algum aspecto de uma aplicação, que pode ser ativado sem recompilar ou alterar a fonte da própria aplicação.

Veja também o comando interceptor de See Also, Connector/J, Connector/NET, interceptor de exceção.

tabela temporária intrínseca: Uma tabela temporária interna otimizada `InnoDB` usada pelo * otimizador*.

Veja também o otimizador.

índice invertido: uma estrutura de dados otimizada para sistemas de recuperação de documentos, usada na implementação da pesquisa de **texto completo** `InnoDB`. O índice `InnoDB` **FULLTEXT**, implementado como um índice invertido, registra a posição de cada palavra dentro de um documento, em vez da localização de uma linha de tabela. Um único valor de coluna (um documento armazenado como uma string de texto) é representado por muitas entradas no índice invertido.

Veja também pesquisa de texto completo, índice FULLTEXT, ilist.

IOPS: Abreviação de **operações de I/O por segundo**. Uma medida comum para sistemas ocupados, especialmente para aplicações **OLTP**. Se esse valor estiver próximo do máximo que os dispositivos de armazenamento podem lidar, o aplicativo pode se tornar **ligado ao disco**, limitando a **escalabilidade**.

Veja também disco-bound, OLTP, escalabilidade.

nível de isolamento: Um dos fundamentos do processamento de bancos de dados. O isolamento é o **I** do acrônimo **ACID**; o nível de isolamento é o ajuste que refina o equilíbrio entre desempenho e confiabilidade, consistência e reprodutibilidade dos resultados quando várias **transações** estão fazendo alterações e realizando consultas ao mesmo tempo.

Da maior quantidade de consistência e proteção à menor, os níveis de isolamento suportados pelo InnoDB são: **SERIALIZABLE**, **REPEATABLE READ**, **READ COMMITTED** e **READ UNCOMMITTED**.

Com as tabelas `InnoDB`, muitos usuários podem manter o nível de isolamento padrão (*REPEATABLE READ*) para todas as operações. Os usuários especialistas podem optar pelo nível **READ COMMITTED** ao ultrapassar os limites da escalabilidade com o processamento **OLTP**, ou durante operações de data warehousing, onde inconsistências menores não afetam os resultados agregados de grandes quantidades de dados. Os níveis nas bordas (**SERIALIZABLE** e **READ UNCOMMITTED**) alteram o comportamento do processamento a um ponto em que eles são raramente usados.

Veja também ACID, OLTP, COMITADO LEITURA, LEITURA NÃO COMITADA, LEITURA REPEATÁVEL, SERIALIZÁVEL, transação.

### J

J2EE: Plataforma Java, Edição Empresarial: A plataforma Java empresarial da Oracle. Ela consiste em uma API e um ambiente de execução para aplicações Java de classe empresarial. Para obter detalhes completos, consulte <http://www.oracle.com/technetwork/java/javaee/overview/index.html>. Com aplicações MySQL, você normalmente usa **Connector/J** para acesso ao banco de dados e um servidor de aplicação, como **Tomcat** ou **JBoss**, para lidar com o trabalho do nível intermediário, e opcionalmente um framework, como **Spring**. As funcionalidades relacionadas ao banco de dados frequentemente oferecidas dentro de uma pilha J2EE incluem um **pool de conexões** e suporte a **failover**.

Veja também: pool de conexões, Connector/J, failover, Java, JBoss, Spring, Tomcat.

Java: Uma linguagem de programação que combina alto desempenho, recursos embutidos ricos e tipos de dados, mecanismos orientado a objetos, extensa biblioteca padrão e ampla gama de módulos reutilizáveis de terceiros. O desenvolvimento empresarial é suportado por muitos frameworks, servidores de aplicativos e outras tecnologias. Grande parte de sua sintaxe é familiar para desenvolvedores de **C** e **C++**. Para escrever aplicativos Java com MySQL, você usa o driver **JDBC** conhecido como **Connector/J**.

Veja também C, Connector/J, C++, JDBC.

JBoss: Veja também J2EE.

JDBC: Abreviação de “Java Database Connectivity”, uma **API** para acesso a bancos de dados a partir de aplicações **Java**. Desenvolvedores Java que escrevem aplicações MySQL utilizam o componente **Connector/J** como seu driver JDBC.

Veja também API, Connector/J, J2EE, Java.

JNDI: Veja também Java.

join: Uma **consulta** que recupera dados de mais de uma tabela, referenciando colunas nas tabelas que possuem valores idênticos. Idealmente, essas colunas fazem parte de uma relação de **chave estrangeira** `InnoDB`, o que garante a **integridade referencial** e que as colunas de junção estejam **indexadas**. Muitas vezes, é usada para economizar espaço e melhorar o desempenho da consulta, substituindo strings repetidas por IDs numéricos, em um **projeto de dados normalizado**.

Veja também chave estrangeira, índice, normalizado, consulta, integridade referencial.

### K

KDC: Veja o centro de distribuição principal.

centro de distribuição de chaves: Em Kerberos, o centro de distribuição de chaves compreende um servidor de autenticação (AS) e um servidor de concessão de ingressos (TGS).

Veja também servidor de autenticação, bilhete de concessão de bilhetes.

keystore: Veja também SSL.

KEY_BLOCK_SIZE: Uma opção para especificar o tamanho das páginas de dados dentro de uma tabela `InnoDB` que utiliza **formato de linha comprimido**. O padrão é de 8 kilobytes. Valores menores correm o risco de atingir limites internos que dependem da combinação do tamanho da linha e do percentual de compressão.

Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos da chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor de nível de tabela `KEY_BLOCK_SIZE`.

Veja também o formato de linha compactada.

### L

latch: Uma estrutura leve usada por `InnoDB` para implementar um **bloqueio** para suas próprias estruturas de memória interna, tipicamente mantidas por um breve período medido em milissegundos ou microssegundos. Um termo geral que inclui tanto **mutexes** (para acesso exclusivo) quanto **rw-locks** (para acesso compartilhado). Certos latches são o foco do `InnoDB` de ajuste de desempenho. Estatísticas sobre o uso e a concorrência de latches estão disponíveis através da interface **Performance Schema**.

Veja também bloqueio, bloqueio, mutex, Schema de desempenho, rw-lock.

libmysql: Nome informal para a biblioteca **libmysqlclient**.

Veja também libmysqlclient.

libmysqlclient: O arquivo da biblioteca, denominado `libmysqlclient.a` ou `libmysqlclient.so`, que é tipicamente vinculado em programas **client** escritos em **C**. Às vezes conhecido informalmente como **libmysql** ou a biblioteca **mysqlclient**.

Veja também cliente, libmysql, mysqlclient.

libmysqld: Esta biblioteca de servidor MySQL **incorporada** permite executar um servidor MySQL completo dentro de uma aplicação **cliente**. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações incorporadas. Você vincula com a biblioteca `libmysqld` em vez de **libmysqlclient**. A API é idêntica entre as três bibliotecas.

Veja também cliente, embutido, libmysql, libmysqlclient.

interceptador de ciclo de vida: Um tipo de **interceptador** suportado pelo **Connector/J**. Envolve a implementação da interface `com.mysql.jdbc.ConnectionLifecycleInterceptor`.

Veja também Connector/J, interceptor.

lista: O **buffer pool** `InnoDB` é representado como uma lista de **páginas** de memória. A lista é reorganizada à medida que novas páginas são acessadas e entram no buffer pool, pois as páginas dentro do buffer pool são acessadas novamente e são consideradas mais recentes, e as páginas que não são acessadas por um longo período são **expulsas** do buffer pool. O buffer pool é dividido em **sublistas**, e a política de substituição é uma variação da técnica familiar **LRU**.

Veja também buffer pool, expulsão, LRU, página, sublista.

balanceamento de carga: Uma técnica para escalar conexões de leitura exclusiva enviando solicitações de consulta para diferentes servidores escravos em uma configuração de replicação ou Cluster. Com o **Connector/J**, o balanceamento de carga é ativado através da classe `com.mysql.jdbc.ReplicationDriver` e controlado pela propriedade de configuração `loadBalanceStrategy`.

Veja também Connector/J, J2EE.

localhost: Veja também conexão.

bloqueio: A noção de alto nível de um objeto que controla o acesso a um recurso, como uma tabela, linha ou estrutura de dados interna, como parte de uma estratégia de **bloqueio**. Para ajustes intensivos de desempenho, você pode se aprofundar nas estruturas reais que implementam bloqueios, como **mutexes** e **latches**.

Veja também trava, modo de bloqueio, bloqueio, mútuo.

escalonamento de bloqueio: Uma operação usada em alguns sistemas de banco de dados que converte muitos **bloqueios de linha** em um único **bloqueio de tabela**, economizando espaço de memória, mas reduzindo o acesso concorrente à tabela. `InnoDB` utiliza uma representação eficiente em termos de espaço para bloqueios de linha, de modo que o escalonamento de **bloqueio** não seja necessário.

Veja também bloqueio, bloqueio de linha, bloqueio de tabela.

Modo de bloqueio: Um **bloqueio** compartilhado (S) permite que uma **transação** leia uma linha. Múltiplas transações podem adquirir um bloqueio S na mesma linha ao mesmo tempo.

Uma chave (X) exclusiva permite que uma transação atualize ou exclua uma linha. Nenhuma outra transação pode adquirir qualquer tipo de chave na mesma linha ao mesmo tempo.

Os **bloqueios de intenção** se aplicam à tabela e são usados para indicar que tipo de bloqueio a transação pretende adquirir em relação às linhas da tabela. Diferentes transações podem adquirir diferentes tipos de bloqueios de intenção na mesma tabela, mas a primeira transação a adquirir um bloqueio exclusivo (IX) em uma tabela impede que outras transações adquiram quaisquer blocos S ou X na tabela. Por outro lado, a primeira transação a adquirir um bloqueio compartilhado (IS) em uma tabela impede que outras transações adquiram quaisquer blocos X na tabela. O processo de duas fases permite que os pedidos de bloqueio sejam resolvidos em ordem, sem bloquear blocos e operações correspondentes que sejam compatíveis.

Veja também bloqueio de intenção, bloqueio, bloqueio, transação.

bloqueio: O sistema de proteção de uma **transação** para não ver ou alterar dados que estão sendo consultados ou alterados por outras transações. A estratégia de **bloqueio** deve equilibrar a confiabilidade e a consistência das operações de banco de dados (os princípios da filosofia **ACID**) contra o desempenho necessário para uma boa **concorrência**. A afinação da estratégia de bloqueio geralmente envolve a escolha de um **nível de isolamento** e garantir que todas as suas operações de banco de dados sejam seguras e confiáveis para esse nível de isolamento.

Veja também ACID, concorrência, nível de isolamento, bloqueio, transação.

bloqueio de leitura: Uma declaração `SELECT` que também realiza uma operação de **bloqueio** em uma tabela `InnoDB`. Ou `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. Tem o potencial de produzir um **bloqueio de espera**, dependendo do **nível de isolamento** da transação. O oposto de uma **leitura não bloqueável**. Não permitido para tabelas globais em uma **transação apenas de leitura**.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja a Seção 17.7.2.4, “Leitura bloqueada”.

Veja também: impasse, nível de isolamento, bloqueio, leitura não bloqueável, transação somente de leitura.

log: No contexto do `InnoDB`, “log” ou “arquivos de log” geralmente se refere ao **registro de refazer** representado pelos arquivos **ib_logfile*`N`***. Outro tipo de log do `InnoDB` é o **registro de desfazer**, que é uma área de armazenamento que contém cópias dos dados modificados por transações ativas.

Outros tipos de logs que são importantes no MySQL são o **log de erro** (para diagnóstico de problemas de inicialização e execução), o **log binário** (para trabalhar com replicação e realizar restaurações em um ponto específico no tempo), o **log de consulta geral** (para diagnóstico de problemas de aplicação) e o **log de consulta lenta** (para diagnóstico de problemas de desempenho).

Veja também: log binário, log de erro, log de consulta geral, ib_logfile, log de refazer, log de consulta lenta, log de desfazer.

buffer de registro: A área de memória que armazena os dados que serão escritos nos **arquivos de registro** que compõem o **registro de refazer**. É controlada pela opção de configuração `innodb_log_buffer_size`.

Veja também o arquivo de registro, o registro de refazer.

arquivo de registro: Um dos arquivos **ib_logfile*`N`*** que compõem o **registro de refazer**. Os dados são escritos nesses arquivos a partir da área de memória **buffer de registro**.

Veja também ib_logfile, buffer de log, log redo.

grupo de registro: O conjunto de arquivos que compõem o **registro de refazer**, tipicamente nomeados `ib_logfile0` e `ib_logfile1`. (Por esse motivo, às vezes referidos coletivamente como **ib_logfile**.

Veja também ib_logfile, log de refazer.

lógico: Um tipo de operação que envolve aspectos abstratos de alto nível, como tabelas, consultas, índices e outros conceitos SQL. Tipicamente, os aspectos lógicos são importantes para tornar a administração de banco de dados e o desenvolvimento de aplicações convenientes e utilizáveis. Contrasta com **física**.

Veja também backup lógico, físico.

backup lógico: Um **backup** que reproduz a estrutura e os dados da tabela, sem copiar os arquivos de dados reais. Por exemplo, o comando **`mysqldump`** produz um backup lógico, porque sua saída contém declarações como `CREATE TABLE` e `INSERT` que podem recriar os dados. Contrasta com o **backup físico**. Um backup lógico oferece flexibilidade (por exemplo, você pode editar definições de tabela ou inserir declarações antes de restaurar), mas pode levar substancialmente mais tempo para **restaurar** do que um backup físico.

Veja também backup, mysqldump, backup físico, restaurar.

loose_: Um prefixo adicionado às opções de configuração de `InnoDB` após o **inicialização** do servidor, para que quaisquer novas opções de configuração não reconhecidas pelo nível atual do MySQL não causem uma falha de inicialização. O MySQL processa opções de configuração que começam com este prefixo, mas emite um aviso em vez de uma falha se a parte após o prefixo não for uma opção reconhecida.

Veja também startup.

linha de baixa água: Um valor que representa um limite inferior, tipicamente um valor de referência em que alguma ação corretiva começa ou se torna mais agressiva. Contrasta com a **linha de alta água**.

Veja também o nível máximo.

LRU: Um acrônimo para “menos recentemente usado”, um método comum para gerenciar áreas de armazenamento. Os itens que não foram usados recentemente são **expulsos** quando é necessário espaço para cachear itens mais recentes. O `InnoDB` usa o mecanismo LRU por padrão para gerenciar as **páginas** dentro do **buffer pool**, mas faz exceções nos casos em que uma página pode ser lida apenas uma única vez, como durante um **escaneamento completo da tabela**. Esta variação do algoritmo LRU é chamada de **estratégia de inserção no ponto médio**. Para mais informações, consulte a Seção 17.5.1, “Buffer Pool”.

Veja também: buffer pool, expulsão, varredura completa da tabela, estratégia de inserção no ponto médio, página.

LSN: Abreviação de "número de sequência de registro". Esse valor arbitrário e sempre crescente representa um ponto no tempo correspondente às operações registradas no **registro de refazer** (**redo log**). (Esse ponto no tempo não depende dos limites das **transações; ele pode ocorrer no meio de uma ou mais transações). Ele é usado internamente pelo `InnoDB` durante a **recuperação em caso de falha** e para gerenciar o **buffer pool**.

Antes do MySQL 5.6.3, o LSN era um inteiro não assinado de 4 bytes. O LSN se tornou um inteiro não assinado de 8 bytes no MySQL 5.6.3 quando o limite do tamanho do arquivo de registro de revisão aumentou de 4 GB para 512 GB, pois bytes adicionais eram necessários para armazenar informações de tamanho extra. Aplicações construídas no MySQL 5.6.3 ou posterior que utilizam valores de LSN devem usar variáveis de 64 bits em vez de 32 bits para armazenar e comparar valores de LSN.

No produto **MySQL Enterprise Backup**, você pode especificar um LSN para representar o ponto no tempo a partir do qual deve ser feito um **backup incremental**. O LSN relevante é exibido pelo resultado do comando **mysqlbackup**. Uma vez que você tenha o LSN correspondente ao momento de um backup completo, você pode especificar esse valor para fazer um backup incremental subsequente, cuja saída contém outro LSN para o próximo backup incremental.

Veja também: buffer pool, recuperação de falhas, backup incremental, MySQL Enterprise Backup, log de redo, transação.

Série LTS: As versões LTS com o mesmo número de versão principal formam uma série LTS. Por exemplo, todas as versões do MySQL 8.4.x formam a série LTS MySQL 8.4.

Nota: O MySQL 8.0 é uma série de correções de bugs que precedeu o modelo de lançamento LTS.

Veja também a Série de Inovação.

### M

.MRG arquivo: Um arquivo que contém referências a outras tabelas, utilizado pelo mecanismo de armazenamento `MERGE`. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

Veja também MySQL Enterprise Backup, comando mysqlbackup.

.MYD arquivo: Um arquivo que o MySQL usa para armazenar dados para uma tabela `MyISAM`.

Veja também o arquivo .MYI, o MySQL Enterprise Backup e o comando mysqlbackup.

.MYI arquivo: Um arquivo que o MySQL usa para armazenar índices para uma tabela `MyISAM`.

Veja também o arquivo .MYD, o MySQL Enterprise Backup e o comando mysqlbackup.

mestre: Veja a fonte.

thread mestre: Um **thread** `InnoDB` que realiza várias tarefas em segundo plano. A maioria dessas tarefas está relacionada a I/O, como a escrita de alterações do **buffer de alterações** nos índices secundários apropriados.

Para melhorar a **concorrência**, às vezes as ações são movidas do thread principal para threads de fundo separadas. Por exemplo, no MySQL 5.6 e versões posteriores, as **páginas sujas** são **limpadas** do **pool de buffer** pelo thread **limpador de páginas**, em vez do thread principal.

Veja também: buffer pool, alterar buffer, concorrência, página suja, esvaziar, limpador de página, thread.

MDL: Abreviação de “bloqueio de metadados”.

Veja também bloqueio de metadados.

confiança média: Sinônimo de **confiança parcial**. Como a faixa de configurações de confiança é tão ampla, a “confiança parcial” é preferida, para evitar a implicação de que existem apenas três níveis (baixo, médio e total).

Veja também Conectivo/NET, confiança parcial.

memcached: Um componente popular de muitos pacotes de software MySQL e **NoSQL**, permitindo leituras e escritas rápidas para valores únicos e armazenando os resultados inteiramente na memória. Tradicionalmente, as aplicações exigiam lógica adicional para escrever os mesmos dados em um banco de dados MySQL para armazenamento permanente, ou para ler dados de um banco de dados MySQL quando não estavam cacheados ainda na memória. Agora, as aplicações podem usar o simples protocolo **memcached**, suportado por bibliotecas de cliente para muitas linguagens, para se comunicar diretamente com servidores MySQL usando tabelas `InnoDB` ou `NDB`. Essas interfaces **NoSQL** para tabelas MySQL permitem que as aplicações alcancem um desempenho de leitura e escrita maior do que ao emitir declarações SQL diretamente, e podem simplificar a lógica e as configurações de implantação das aplicações para sistemas que já incorporam **memcached** para cacheamento em memória.

Veja também NoSQL.

fusão: Aplicar alterações aos dados armazenados em cache na memória, como quando uma página é colocada no **buffer pool**, e quaisquer alterações aplicáveis registradas no **buffer de alterações** são incorporadas à página no buffer pool. Os dados atualizados são, eventualmente, escritos no **tablespace** pelo mecanismo de **flush**.

Veja também: buffer pool, alterar buffer, varredura, tablespace.

bloqueio de metadados: Um tipo de **bloqueio** que impede operações **DDL** em uma tabela que está sendo usada ao mesmo tempo por outra **transação**. Para detalhes, consulte a Seção 10.11.4, “Bloqueio de Metadados”.

As melhorias nas operações **online**, particularmente no MySQL 5.6 e versões posteriores, focam na redução da quantidade de bloqueio de metadados. O objetivo é que as operações de DDL que não alterem a estrutura da tabela (como `CREATE INDEX` e `DROP INDEX` para as tabelas `InnoDB`) prossigam enquanto a tabela está sendo consultada, atualizada, etc., por outras transações.

Veja também DDL, bloqueio, online, transação.

contador de métricas: Uma funcionalidade implementada pela tabela `INNODB_METRICS` no **INFORMATION_SCHEMA**, no MySQL 5.6 e versões posteriores. Você pode consultar **contagem** e totais para operações de nível baixo `InnoDB`, e usar os resultados para ajuste de desempenho em combinação com dados do **Performance Schema**.

Veja também contador, INFORMATION_SCHEMA, Schema de desempenho.

Estratégia de inserção no ponto médio: A técnica de inicialmente trazer **páginas** para o `InnoDB` **buffer pool** não no extremo “mais novo” da lista, mas sim em algum lugar no meio. O local exato desse ponto pode variar, com base na configuração da opção `innodb_old_blocks_pct`. O objetivo é que as páginas que são lidas apenas uma vez, como durante um **escaneamento completo da tabela**, possam ser eliminadas do buffer pool mais cedo do que com um algoritmo estrito **LRU**. Para mais informações, consulte a Seção 17.5.1, “Buffer Pool”.

Veja também buffer pool, varredura completa da tabela, LRU, página.

mini-transação: Uma fase interna do processamento do `InnoDB`, ao fazer alterações no nível **físico** das estruturas de dados internas durante operações de **DML**. Uma mini-transação (mtr) não tem noção de **roll-back (desfazer)**; várias mini-transações podem ocorrer dentro de uma única **transação**. Mini-transações escrevem informações no **registro de revisão** que é usado durante a **recuperação em caso de falha**. Uma mini-transação também pode ocorrer fora do contexto de uma transação regular, por exemplo, durante o processamento de **purga** por threads de fundo.

Veja também commit, recuperação de falha, DML, físico, purgar, registro redo, rollback, transação.

inserto de modo misto: Uma declaração `INSERT` onde os valores de **auto-incremento** são especificados para algumas, mas não para todas, das novas linhas. Por exemplo, um multi-valor `INSERT` pode especificar um valor para a coluna de auto-incremento em alguns casos e `NULL` em outros casos. `InnoDB` gera valores de auto-incremento para as linhas onde o valor da coluna foi especificado como `NULL`. Outro exemplo é uma declaração `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), onde os valores de auto-incremento podem ser gerados, mas não utilizados, para quaisquer linhas duplicadas que sejam processadas como `UPDATE` em vez de declarações `INSERT`.

Pode causar problemas de consistência entre os servidores **fonte** e **replica** em uma configuração de **replicação**. Pode ser necessário ajustar o valor da opção de configuração **innodb_autoinc_lock_mode**.

Veja também auto-incremento, innodb_autoinc_lock_mode, replica, replicação, fonte.

MM.MySQL: Um driver JDBC mais antigo para MySQL que evoluiu para **Connector/J** quando foi integrado ao produto MySQL.

Veja também o conector/J.

Mono: Uma estrutura de código aberto desenvolvida pela Novell, que funciona com aplicativos **Connector/NET** e **C#** em plataformas Linux.

Veja também Connector/NET, C#.

mtr: Veja mini-transação.

multi-core: Um tipo de processador que pode aproveitar programas multithread, como o servidor MySQL.

controle de concorrência multiversão: Veja MVCC.

mutex: Abreviação informal para "variável de mutex". (O próprio mutex é uma abreviação de "exclusão mútua".) O objeto de nível baixo que `InnoDB` usa para representar e impor **bloqueios** de acesso exclusivo a estruturas de dados internas em memória. Uma vez que o bloqueio é adquirido, qualquer outro processo, thread, etc., é impedido de adquirir o mesmo bloqueio. Em contraste com **rw-locks**, que `InnoDB` usa para representar e impor **bloqueios** de acesso compartilhado a estruturas de dados internas em memória. Mutexes e rw-locks são conhecidos coletivamente como **latches**.

Veja também latch, lock, Schema de desempenho, Pthreads, rw-lock.

MVCC: Abreviação de “controle de concorrência multiversão”. Essa técnica permite que as `InnoDB` **transações** com certos **níveis de isolamento** realizem operações de **leitura consistente**, ou seja, para consultar linhas que estão sendo atualizadas por outras transações e ver os valores antes dessas atualizações ocorrerem. Essa é uma técnica poderosa para aumentar a **concorrência**, permitindo que as consultas prossigam sem esperar devido aos **bloqueios** mantidos pelas outras transações.

Essa técnica não é universal no mundo dos bancos de dados. Alguns outros produtos de banco de dados e alguns outros motores de armazenamento do MySQL não a suportam.

Veja também ACID, concorrência, leitura consistente, nível de isolamento, bloqueio, transação.

my.cnf: O nome, em sistemas Unix ou Linux, do arquivo de **opção** do MySQL.

Veja também meu.ini, arquivo de opção.

my.ini: O nome, em sistemas Windows, do arquivo de **opção** do MySQL.

Veja também o arquivo my.cnf.

Drivers MyODBC: Nome obsoleto para **Connector/ODBC**.

Veja também Conector/ODBC.

mysql: O programa **mysql** é o interpretador de linha de comando para o banco de dados MySQL. Ele processa instruções **SQL**, e também comandos específicos do MySQL, como `SHOW TABLES`](show-tables.html "15.7.7.39 SHOW TABLES Statement"), enviando solicitações ao daemon **mysqld**.

Veja também mysqld, SQL.

comando mysqlbackup: uma ferramenta de linha de comando do produto **MySQL Enterprise Backup**. Realiza uma operação de backup `InnoDB` e um backup quente para as tabelas `MyISAM` e outros tipos de tabelas. Consulte a Seção 32.1, “MySQL Enterprise Backup Overview” para obter mais informações sobre este comando.

Veja também backup quente, MySQL Enterprise Backup, backup quente.

mysqlclient: O nome informal da biblioteca que é implementada pelo arquivo **libmysqlclient**, com extensão `.a` ou `.so`.

Veja também libmysqlclient.

mysqld: **mysqld**, também conhecido como MySQL Server, é um único programa multithread que faz a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL que contém bancos de dados, tabelas e outras informações, como arquivos de log e arquivos de status.

O **mysqld** funciona como um daemon Unix ou serviço do Windows, aguardando constantemente por solicitações e realizando trabalhos de manutenção em segundo plano.

Veja também, mysql.

MySQLdb: O nome do módulo de código aberto **Python** que forma a base da **API Python** do MySQL.

Veja também Python, API do Python.

mysqldump: Um comando que realiza um **backup lógico** de uma combinação de bancos de dados, tabelas e dados de tabela. Os resultados são declarações SQL que reproduzem os objetos do esquema original, dados ou ambos. Para quantidades substanciais de dados, uma solução de **backup físico**, como o **MySQL Enterprise Backup**, é mais rápida, especialmente para a operação de **restauração**.

Veja também backup lógico, MySQL Enterprise Backup, backup físico, restauração.

### N

.NET: Veja também ADO.NET, ASP.net, Connector/NET, Mono, Visual Studio.

API nativa C: Sinônimo de **libmysqlclient**.

Veja também libmysql.

chave natural: Uma coluna indexada, tipicamente uma **chave primária**, onde os valores têm algum significado no mundo real. Geralmente é desaconselhada porque:

* Se o valor mudar, é possível que seja necessário realizar uma série de manutenções no índice para reorganizar o **índice agrupado** e atualizar as cópias do valor da chave primária que são repetidas em cada **índice secundário**.

* Mesmo valores aparentemente estáveis podem mudar de maneiras imprevisíveis, que são difíceis de representar corretamente no banco de dados. Por exemplo, um país pode mudar para dois ou vários, tornando o código original do país obsoleto. Ou, as regras sobre valores únicos podem ter exceções. Por exemplo, mesmo que os IDs dos contribuintes sejam destinados a serem únicos para uma única pessoa, um banco de dados pode ter que lidar com registros que violam essa regra, como nos casos de roubo de identidade. Os IDs dos contribuintes e outros números de identificação sensíveis também não são boas chaves primárias, porque eles podem precisar ser protegidos, criptografados e tratados de outra forma diferente de outras colunas.

Assim, é geralmente melhor usar valores numéricos arbitrários para formar uma **chave sintética**, por exemplo, usando uma coluna de **auto-incremento**.

Veja também auto-incremento, índice agrupado, chave primária, índice secundário, chave sintética.

página vizinha: Qualquer **página** na mesma **extensão** que uma página específica. Quando uma página é selecionada para ser **limpa**, as páginas vizinhas que estão **sujas** são normalmente limpas também, como uma otimização de I/O para discos rígidos tradicionais. Em MySQL 5.6 e superior, esse comportamento pode ser controlado pela variável de configuração `innodb_flush_neighbors`; você pode desativar essa configuração para unidades SSD, que não têm o mesmo overhead para escrever lotes menores de dados em locais aleatórios.

Veja também página suja, extensão, varrer, página.

bloqueio de chave próxima: uma combinação de um **bloqueio de registro** no registro do índice e um bloqueio de lacuna (glossary.html#glos_gap_lock "gap lock") na lacuna antes do registro do índice.

Veja também bloqueio de lacuna, bloqueio, bloqueio de registro.

leitura não bloqueável: Uma **consulta** que não utiliza as cláusulas `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. O único tipo de consulta permitido para tabelas globais em uma **transação somente leitura**. O oposto de uma **leitura não bloqueável**. Veja a Seção 17.7.2.3, “Leitura Não Bloqueável Consistente”.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja também bloqueio de leitura, consulta, transação somente de leitura.

leitura não repetida: A situação em que uma consulta recupera dados, e uma consulta posterior, dentro da mesma **transação**, recupera os mesmos dados, mas as consultas retornam resultados diferentes (alterados por outra transação que se comprometeu no mesmo momento).

Esse tipo de operação vai contra o princípio **ACID** do design de banco de dados. Dentro de uma transação, os dados devem ser consistentes, com relações previsíveis e estáveis.

Entre os diferentes **níveis de isolamento**, as leituras não repetidas são impedidas pelos níveis de **leitura serializável** e **leitura repetida**, e permitidas pelos níveis de **leitura consistente** e **leitura não comprometida**.

Veja também ACID, leitura consistente, nível de isolamento, LEITURA NÃO COMPROMETIDA, LEITURA REPEATÁVEL, SERIALIZÁVEL, transação.

I/O não bloqueante: Um termo da indústria que significa o mesmo que **I/O assíncrono**.

Veja também I/O assíncrono.

Uma estratégia de projeto de banco de dados onde os dados são divididos em várias tabelas e os valores duplicados são condensados em linhas únicas representadas por uma ID, para evitar o armazenamento, consulta e atualização de valores redundantes ou extensos. É tipicamente usado em aplicações **OLTP**.

Por exemplo, um endereço pode receber um ID único, de modo que um banco de dados de censo possa representar a relação **mora em este endereço**, associando esse ID a cada membro de uma família, em vez de armazenar múltiplas cópias de um valor complexo, como **123 Main Street, Anytown, EUA**.

Como outro exemplo, embora um aplicativo simples de catálogo de endereços possa armazenar cada número de telefone na mesma tabela que o nome e o endereço de uma pessoa, um banco de dados de uma empresa telefônica pode dar a cada número de telefone uma ID especial e armazenar os números e IDs em uma tabela separada. Essa representação normalizada pode simplificar as atualizações em larga escala quando os códigos de área se separam.

A normalização não é sempre recomendada. Dados que são principalmente consultados e apenas atualizados por meio da exclusão total e do recarregamento são frequentemente mantidos em menos tabelas maiores, com cópias redundantes de valores duplicados. Essa representação de dados é conhecida como **denormalizada** e é frequentemente encontrada em aplicativos de data warehousing.

Veja também denormalizado, chave estrangeira, OLTP, relacional.

NoSQL: Um termo amplo para um conjunto de tecnologias de acesso a dados que não utilizam a linguagem **SQL** como seu mecanismo primário para leitura e escrita de dados. Algumas tecnologias NoSQL atuam como bancos de valores chave, aceitando apenas leituras e escritas de um único valor; outras relaxam as restrições da metodologia **ACID**; outras ainda não requerem um **esquema** pré-planejado. Usuários do MySQL podem combinar o processamento estilo NoSQL para velocidade e simplicidade com operações SQL para flexibilidade e conveniência, usando a **memcached** API para acessar diretamente alguns tipos de tabelas do MySQL.

Veja também ACID, memcached, esquema, SQL.

Restrição NOT NULL: Um tipo de **restrição** que especifica que uma **coluna** não pode conter quaisquer valores **NULL**. Ajuda a preservar a **integridade referencial**, pois o servidor de banco de dados pode identificar dados com valores ausentes errados. Também ajuda na aritmética envolvida na otimização de consultas, permitindo que o otimizador preveja o número de entradas em um índice naquela coluna.

Veja também coluna, restrição, NULL, chave primária, integridade referencial.

NULL: Um valor especial em **SQL**, indicando a ausência de dados. Qualquer operação aritmética ou teste de igualdade que envolva um valor de `NULL`, por sua vez, produz um resultado de `NULL`. (Assim, é semelhante ao conceito de NaN (”not a number” ou “não um número”) do IEEE em relação a números flutuantes.) Qualquer cálculo agregado, como `AVG()`, ignora as linhas com valores de `NULL`, ao determinar quantas linhas devem ser divididas. O único teste que funciona com valores de `NULL` usa os ditos SQL `IS NULL` ou `IS NOT NULL`.

Os valores de `NULL` desempenham um papel em operações de **índice**, porque, para o desempenho, um banco de dados deve minimizar o overhead de manter o controle de valores de dados ausentes. Tipicamente, os valores de `NULL` não são armazenados em um índice, porque uma consulta que testa uma coluna indexada usando um operador de comparação padrão nunca poderia corresponder a uma linha com um valor de `NULL` para aquela coluna. Por esse mesmo motivo, índices únicos não impedem valores de `NULL`; esses valores simplesmente não são representados no índice. Declarar uma restrição de `NOT NULL` em uma coluna fornece a garantia de que não há linhas excluídas do índice, permitindo uma melhor otimização da consulta (contagem precisa de linhas e estimativa de se usar o índice).

Como a **chave primária** deve ser capaz de identificar de forma única cada linha da tabela, uma chave primária de uma única coluna não pode conter quaisquer valores de `NULL`, e uma chave primária de várias colunas não pode conter quaisquer linhas com valores de `NULL` em todas as colunas.

Embora o banco de dados Oracle permita que um valor `NULL` seja concatenado com uma string, `InnoDB` trata o resultado de tal operação como `NULL`.

Veja também índice, chave primária, SQL.

### O

.OPT arquivo: Um arquivo que contém informações de configuração do banco de dados. Arquivos com essa extensão são incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

Veja também MySQL Enterprise Backup, comando mysqlbackup.

ODBC: Abreviação de Open Database Connectivity, uma API padrão da indústria. Tipicamente usada com servidores baseados em Windows, ou aplicações que exigem ODBC para se comunicar com MySQL. O driver ODBC do MySQL é chamado de **Connector/ODBC**.

Veja também Conector/ODBC.

coluna off-page: Uma coluna que contém dados de comprimento variável (como `BLOB` e `VARCHAR`) que é muito longa para caber em uma página de **árvore B**. Os dados são armazenados em páginas de **overflow**. O formato de linha **DINÂMICO** é mais eficiente para esse armazenamento do que o formato de linha **COMPACT** mais antigo.

Veja também B-tree, formato de linha compacta, formato de linha dinâmica, página de excesso.

OLTP: Abreviação de “Processamento de Transações Online”. Um sistema de banco de dados ou uma aplicação de banco de dados que executa uma carga de trabalho com muitas **transações**, com leituras e escritas frequentes, geralmente afetando pequenas quantidades de dados de cada vez. Por exemplo, um sistema de reserva de uma companhia aérea ou uma aplicação que processa depósitos bancários. Os dados podem ser organizados em forma **normalizada** para um equilíbrio entre a eficiência da **DML** (inserir/atualizar/deletar) e a eficiência da **consulta**. Contrasta com **data warehouse**.

Com sua capacidade de **bloqueio de nível de linha** e **transacional**, o **InnoDB** é o motor de armazenamento ideal para tabelas do MySQL utilizadas em aplicações OLTP.

Veja também armazém de dados, DML, InnoDB, consulta, bloqueio de linha, transação.

online: Um tipo de operação que não envolve tempo de inatividade, bloqueio ou operação restrita para o banco de dados. Tipicamente aplicado a **DDL**. Operações que reduzem os períodos de operação restrita, como a **criação rápida de índices**, evoluíram para um conjunto mais amplo de operações **DDL online** no MySQL 5.6.

No contexto de backups, um **backup quente** é uma operação online e um **backup quente** é parcialmente uma operação online.

Veja também DDL, criação rápida de índice, backup quente, DDL online e backup quente.

DDL online: Uma funcionalidade que melhora o desempenho, a concorrência e a disponibilidade das tabelas do `InnoDB` durante operações de **DDL** (principalmente `ALTER TABLE`). Consulte a Seção 17.12, “InnoDB e DDL online”, para obter detalhes.

Os detalhes variam de acordo com o tipo de operação. Em alguns casos, a tabela pode ser modificada simultaneamente enquanto o `ALTER TABLE` está em andamento. A operação pode ser realizada sem uma cópia da tabela, ou usando um tipo especialmente otimizado de cópia de tabela. O uso do espaço de log de DML para operações in-place é controlado pela opção de configuração `innodb_online_alter_log_max_size`.

Este recurso é uma melhoria do recurso **Criação Rápida de Índice** no MySQL 5.5.

Veja também DDL, Criação rápida de índice, online.

optimismo: Uma metodologia que orienta decisões de implementação de nível baixo para um sistema de banco de dados relacional. Os requisitos de desempenho e **concorrência** em um banco de dados relacional significam que as operações devem ser iniciadas ou enviadas rapidamente. Os requisitos de consistência e **integridade referencial** significam que qualquer operação pode falhar: uma transação pode ser revertida, uma operação **DML** pode violar uma restrição, uma solicitação de bloqueio pode causar um impasse, um erro de rede pode causar um tempo de espera. Uma estratégia otimista é aquela que assume que a maioria das solicitações ou tentativas é bem-sucedida, de modo que relativamente pouco trabalho é feito para se preparar para o caso de falha. Quando essa suposição é verdadeira, o banco de dados faz pouco trabalho desnecessário; quando as solicitações falham, trabalho extra deve ser feito para limpar e desfazer as alterações.

`InnoDB` utiliza estratégias otimistas para operações como **bloqueio** e **comitês**. Por exemplo, dados alterados por uma transação podem ser escritos nos arquivos de dados antes do commit ocorrer, tornando o próprio commit muito rápido, mas exigindo mais trabalho para desfazer as alterações se a transação for revertida.

O oposto de uma estratégia otimista é uma **pessimista**, onde um sistema é otimizado para lidar com operações que são pouco confiáveis e frequentemente infrutíferas. Essa metodologia é rara em um sistema de banco de dados, porque há muito cuidado na escolha de hardware, redes e algoritmos confiáveis.

Veja também commit, concorrência, DML, bloqueio, pessimista, integridade referencial.

opinião otimista: O componente MySQL que determina os melhores **índices** e **join** a serem utilizados para uma **consulta**, com base nas características e na distribuição dos dados das **tabelas** relevantes.

Veja também índice, junta, consulta, tabela.

opção: Um parâmetro de configuração para o MySQL, armazenado no arquivo **option** ou passado na linha de comando.

Para as **opções** que se aplicam a tabelas de **InnoDB**, cada nome de opção começa com o prefixo `innodb_`.

Veja também InnoDB, opção, arquivo de opção.

arquivo de opção: O arquivo que contém as **opções** de configuração para a instância do MySQL. Tradicionalmente, no Linux e no Unix, este arquivo é denominado `my.cnf`, e no Windows, é denominado `my.ini`.

Veja também o arquivo de configuração See Also, my.cnf, my.ini, opção.

página de sobreposição: Páginas de disco alocadas separadamente que retêm colunas de comprimento variável (como `BLOB` e `VARCHAR`) que são muito longas para caber em uma página de **árvore B**. As colunas associadas são conhecidas como colunas fora da página.

Veja também B-tree, coluna fora da página, página.

### P

.par arquivo: Um arquivo que contém definições de partição. Arquivos com essa extensão são incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

Com a introdução do suporte nativo de particionamento para tabelas `InnoDB` no MySQL 5.7.6, os arquivos `.par` deixam de ser criados para tabelas `InnoDB` particionadas. As tabelas `MyISAM` particionadas continuam a usar arquivos `.par` no MySQL 5.7. No MySQL 8.0, o suporte de particionamento é fornecido apenas pelo mecanismo de armazenamento `InnoDB`. Como tal, os arquivos `.par` deixam de ser usados a partir do MySQL 8.0.

Veja também MySQL Enterprise Backup, comando mysqlbackup.

uma unidade que representa a quantidade de dados que a `InnoDB` transfere a qualquer momento entre o disco (os **arquivos de dados**) e a memória (o **pool de buffer**). Uma página pode conter uma ou mais **linhas**, dependendo de quanto dados estão em cada linha. Se uma linha não cabe inteiramente em uma única página, a `InnoDB` configura estruturas de dados em estilo ponteiro adicionais para que as informações sobre a linha possam ser armazenadas em uma página.

Uma maneira de caber mais dados em cada página é usar o **formato de linha compactada**. Para tabelas que utilizam BLOBs ou campos de texto grandes, o **formato de linha compacta** permite que essas colunas grandes sejam armazenadas separadamente do resto da linha, reduzindo o sobrecarga de I/O e o uso de memória para consultas que não fazem referência a essas colunas.

Quando o `InnoDB` lê ou escreve conjuntos de páginas como um lote para aumentar o desempenho de E/S, ele lê ou escreve um **extent** de cada vez.

Todas as estruturas de disco `InnoDB` dentro de uma instância do MySQL compartilham o mesmo tamanho de página.

Veja também: buffer pool, formato de linha compacta, formato de linha comprimida, arquivos de dados, extensão, tamanho de página, linha.

limpeza de página: Um **thread** de `InnoDB` de fundo que **limpa** **páginas sujas** do **buffer pool**. Antes do MySQL 5.6, essa atividade era realizada pelo **thread mestre**. O número de threads de limpeza de página é controlado pela opção de configuração `innodb_page_cleaners`, introduzida no MySQL 5.7.4.

Veja também: buffer pool, página suja, esvaziar, thread mestre, thread.

tamanho da página: Para lançamentos até e incluindo o MySQL 5.5, o tamanho de cada `InnoDB` **página** é fixo em 16 kilobytes. Esse valor representa um equilíbrio: grande o suficiente para conter os dados da maioria das linhas, mas pequeno o suficiente para minimizar o overhead de desempenho da transferência de dados desnecessários para a memória. Outros valores não são testados ou suportados.

A partir do MySQL 5.6, o tamanho da página para uma `InnoDB` **instância]] pode ser de 4KB, 8KB ou 16KB, controlado pela opção de configuração `innodb_page_size`. A partir do MySQL 5.7.6, o `InnoDB` também suporta tamanhos de página de 32KB e 64KB. Para tamanhos de página de 32KB e 64KB, o `ROW_FORMAT=COMPRESSED` não é suportado e o tamanho máximo do registro é de 16KB.

O tamanho da página é definido ao criar a instância do MySQL e permanece constante posteriormente. O mesmo tamanho da página se aplica a todos os **tablespaces** `InnoDB` **, incluindo o tablespace do sistema, tablespaces de arquivo por tabela e tablespaces gerais.

Tamanhos menores de página podem ajudar no desempenho com dispositivos de armazenamento que utilizam tamanhos de bloco pequenos, especialmente para dispositivos **SSD** em cargas de trabalho **ligadas a disco**, como para aplicações **OLTP**. À medida que as linhas individuais são atualizadas, menos dados são copiados para a memória, escritos em disco, reorganizados, bloqueados, e assim por diante.

Veja também disco-ligado, arquivo por tabela, espaço de tabela geral, instância, OLTP, página, SSD, espaço de tabela do sistema, espaço de tabela.

tabela pai: A tabela em uma relação de **chave estrangeira** que contém os valores iniciais dos campos apontados a partir da **tabela filho**. As consequências da exclusão ou atualização de linhas na tabela pai dependem das cláusulas `ON UPDATE` e `ON DELETE` na definição da chave estrangeira. As linhas com valores correspondentes na tabela filho podem ser automaticamente excluídas ou atualizadas por sua vez, ou essas colunas podem ser definidas como `NULL`, ou a operação pode ser impedida.

Veja também tabela de crianças, chave estrangeira.

backup parcial: Um **backup** que contém algumas das **tabuletas** em um banco de dados MySQL, ou algumas das bases de dados em uma instância MySQL. Contrasta com **backup completo**.

Veja também backup, backup completo, tabela.

índice parcial: Um **índice** que representa apenas uma parte do valor de uma coluna, tipicamente os primeiros N caracteres (o **prefixo**) de um valor longo do `VARCHAR`.

Veja também o índice, prefixo do índice.

confiança parcial: Um ambiente de execução tipicamente usado por provedores de hospedagem, onde as aplicações têm algumas permissões, mas outras não. Por exemplo, as aplicações podem ter acesso a um servidor de banco de dados através de uma rede, mas estar "sandboxadas" em relação à leitura e escrita de arquivos locais.

Veja também Connector/NET.

Schema de desempenho: O esquema `performance_schema`, no MySQL 5.5 e superior, apresenta um conjunto de tabelas que você pode consultar para obter informações detalhadas sobre as características de desempenho de muitas partes internas do servidor MySQL. Veja o Capítulo 29, *Schema de desempenho do MySQL*.

Veja também INFORMATION_SCHEMA, latch, mutex, rw-lock.

Perl: Um idioma de programação com raízes em scripts Unix e geração de relatórios. Incorpora expressões regulares de alto desempenho e entrada/saída de arquivos. Grande coleção de módulos reutilizáveis disponíveis através de repositórios como CPAN.

Veja também a API Perl.

Perl API: Uma **API** de código aberto para aplicações MySQL escritas na linguagem **Perl**. Implementada através dos módulos `DBI` e `DBD::mysql`. Para detalhes, consulte a Seção 31.9, “Perl API MySQL”.

Veja também API, Perl.

estatísticas persistentes: um recurso que armazena estatísticas de índice para as tabelas de `InnoDB` no disco, proporcionando melhor **estabilidade do plano** para **consultas**. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

Veja também índice, otimizador, estabilidade do plano, consulta, tabela.

pessimista: Uma metodologia que sacrifica o desempenho ou a concorrência em prol da segurança. É apropriado se uma alta proporção de solicitações ou tentativas possa falhar, ou se as consequências de uma solicitação falha forem graves. `InnoDB` utiliza o que é conhecido como uma estratégia de **bloqueio** pessimista, para minimizar a chance de **deadlocks**. No nível da aplicação, você pode evitar deadlocks usando uma estratégia pessimista de adquirir todas as chaves necessárias por uma transação no início.

Muitos mecanismos de banco de dados integrados utilizam a metodologia **opositora** (oposta).

Veja também: impasse, bloqueio, otimista.

fantasma: Uma linha que aparece no conjunto de resultados de uma consulta, mas não no conjunto de resultados de uma consulta anterior. Por exemplo, se uma consulta for executada duas vezes dentro de uma **transação**, e, nesse meio tempo, outra transação é confirmada após inserir uma nova linha ou atualizar uma linha para que ela corresponda à cláusula `WHERE` da consulta.

Esse tipo de ocorrência é conhecido como leitura fantasma. É mais difícil de evitar do que uma **leitura não repetida**, porque o bloqueio de todas as linhas do primeiro conjunto de resultados da consulta não impede as alterações que causam a ocorrência do fantasma.

Entre os diferentes **níveis de isolamento**, as leituras fantasmas são prevenidas pelo nível de leitura serializável e permitidas pelos níveis de leitura **repetiível**, **consistente** e **não comprometido**.

Veja também leitura consistente, nível de isolamento, leitura não repetida, LEITURA NÃO COMPROMETIDA, LEITURA REPEATÁVEL, SERIALIZÁVEL, transação.

PHP: Um idioma de programação que surgiu com aplicações web. O código é tipicamente incorporado como blocos dentro da fonte de uma página web, com a saída substituída na página conforme ela é transmitida pelo servidor web. Isso contrasta com aplicações como scripts CGI que imprimem a saída na forma de uma página web inteira. O estilo de codificação PHP é usado para páginas web altamente interativas e dinâmicas. Programas modernos de PHP também podem ser executados como aplicações de linha de comando ou GUI.

As aplicações MySQL são escritas usando uma das **APIs do PHP**. Módulos reutilizáveis podem ser escritos em **C** e chamados a partir do PHP.

Outra tecnologia para escrever páginas da web no lado do servidor com MySQL é **ASP.net**.

Veja também ASP.net, C, API de PHP.

API do PHP: Várias **APIs** estão disponíveis para escrever aplicações MySQL no idioma **PHP**: a API original do MySQL (`Mysql`) a Extensão MySQL Melhorada (`Mysqli`) o Driver Nativo MySQL (`Mysqlnd`) as funções MySQL (`PDO_MYSQL`) e o Connector/PHP. Para detalhes, consulte MySQL e PHP.

Veja também API, PHP.

física: Um tipo de operação que envolve aspectos relacionados ao hardware, como blocos de disco, páginas de memória, arquivos, bits, leituras de disco, e assim por diante. Tipicamente, os aspectos físicos são importantes durante o ajuste de desempenho de nível de especialista e diagnóstico de problemas. Contrasta com **lógico**.

Veja também backup lógico e físico.

backup físico: Um **backup** que copia os arquivos de dados reais. Por exemplo, o comando **`mysqlbackup`** do produto **MySQL Enterprise Backup** produz um backup físico, porque sua saída contém arquivos de dados que podem ser usados diretamente pelo servidor `mysqld`, resultando em uma operação de **restauração** mais rápida. Contrasta com o **backup lógico**.

Veja também backup, backup lógico, MySQL Enterprise Backup, restauração.

PITR: Abreviação para **recuperação em ponto de tempo**.

Veja também recuperação em ponto de tempo.

estabilidade do plano: Uma propriedade de um **plano de execução de consulta**, onde o otimizador faz as mesmas escolhas cada vez para uma consulta dada, de modo que o desempenho seja consistente e previsível.

Veja também consulta, plano de execução da consulta.

recuperação em ponto de tempo: O processo de restaurar um **backup** para recriar o estado do banco de dados em uma data e hora específicas. Comumente abreviado como "PITR". Como é improvável que o horário especificado corresponda exatamente ao horário de um backup, essa técnica geralmente requer uma combinação de um **backup físico** e um **backup lógico**. Por exemplo, com o produto **MySQL Enterprise Backup**, você restaura o último backup que você fez antes do ponto de tempo especificado, e depois reinterpreta as alterações do **registro binário** entre o horário do backup e o horário do PITR.

Veja também backup, registro binário, backup lógico, MySQL Enterprise Backup, backup físico.

port: O número do soquete TCP/IP pelo qual o servidor de banco de dados escuta, usado para estabelecer uma **conexão**. Frequentemente especificado em conjunto com um **host**. Dependendo do seu uso de criptografia de rede, pode haver uma porta para tráfego não criptografado e outra porta para conexões **SSL**.

Veja também conexão, host, SSL.

prefixo: Veja o prefixo do índice.

backup preparado: Um conjunto de arquivos de backup, produzido pelo produto **MySQL Enterprise Backup**, após todas as etapas de aplicação de **logs binários** e **backup incremental** serem concluídas. Os arquivos resultantes estão prontos para serem **restaurados**. Antes das etapas de aplicação, os arquivos são conhecidos como um **backup bruto**.

Veja também: log binário, backup quente, backup incremental, MySQL Enterprise Backup, backup bruto, restauração.

declaração preparada: Uma declaração SQL que é analisada antecipadamente para determinar um plano de execução eficiente. Ela pode ser executada várias vezes, sem o custo adicional de análise e interpretação a cada vez. Diferentes valores podem ser substituídos para literais na cláusula `WHERE` a cada vez, através do uso de marcadores. Essa técnica de substituição melhora a segurança, protegendo contra alguns tipos de ataques de injeção SQL. Você também pode reduzir o custo adicional de conversão e cópia de valores de retorno para variáveis de programa.

Embora você possa usar declarações preparadas diretamente através da sintaxe SQL, os vários **Conectores** têm interfaces de programação para manipulação de declarações preparadas, e essas APIs são mais eficientes do que passar por SQL.

Veja também declaração preparada do lado do cliente, conector, declaração preparada do lado do servidor.

chave primária: Um conjunto de colunas — e, por implicação, o índice baseado neste conjunto de colunas — que pode identificar de forma única cada linha em uma tabela. Como tal, deve ser um índice único que não contenha quaisquer valores de `NULL`.

`InnoDB` exige que cada tabela tenha um índice desse tipo (também chamado de **índice agrupado** ou **índice de agrupamento**) e organiza o armazenamento da tabela com base nos valores das colunas da chave primária.

Ao escolher valores para a chave primária, considere usar valores arbitrários (uma **chave sintética**) em vez de confiar em valores derivados de alguma outra fonte (uma **chave natural**).

Veja também índice agrupado, índice, chave natural, chave sintética.

principal: O termo Kerberos para uma entidade nomeada, como um usuário ou servidor.

Veja também o nome do principal do serviço, nome do principal do usuário.

processo: Uma instância de um programa em execução. O sistema operacional troca entre vários processos em execução, permitindo um certo grau de **concorrência**. Na maioria dos sistemas operacionais, os processos podem conter múltiplos **threads** de execução que compartilham recursos. A troca de contexto entre os threads é mais rápida do que a troca equivalente entre processos.

Veja também concorrência, thread.

pseudo-registro: Um registro artificial em um índice, usado para **bloquear** valores ou intervalos de chave que atualmente não existem.

Veja também registro infimum, bloqueio, registro supremum.

Pthreads: O padrão POSIX de threads, que define uma API para operações de threads e bloqueio em sistemas Unix e Linux. Em sistemas Unix e Linux, `InnoDB` usa essa implementação para **mutexes**.

Veja também mutex.

purga: Um tipo de coleta de lixo realizada por um ou mais threads de fundo separados (controlados por `innodb_purge_threads`) que funciona em um cronograma periódico. A purga analisa e processa páginas do **registro de desfazer** da **lista de histórico** com o propósito de remover registros de índice secundário e agrupados que foram marcados para exclusão (por declarações anteriores de `DELETE`) e que não são mais necessários para **MVCC** ou **rollback**. A purga libera páginas de registro de desfazer da lista de histórico após as processar.

Veja também a lista de histórico, MVCC, rollback, registro de desfazer.

purgar o buffer: A técnica de armazenar as alterações nas páginas de índice secundário, resultantes das operações de `DELETE`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas e minimizar o I/O aleatório. (Como as operações de exclusão são um processo de duas etapas, esta operação armazena a escrita que normalmente exclui um registro de índice que foi previamente marcado para exclusão.) É um dos tipos de **buffering de alterações**: os outros são **buffering de inserção** e **buffering de exclusão**.

Veja também alterar buffer, alterar bufferização, excluir bufferização, inserir buffer, inserir bufferização.

purga de atraso: Outro nome para a lista de histórico `InnoDB` **. Relacionado à opção de configuração `innodb_max_purge_lag`.

Veja também a lista de histórico, purga.

purga de fio: Um **fio** dentro do processo `InnoDB` que é dedicado a realizar a operação de **purga** periódica. No MySQL 5.6 e superior, vários fios de purga são habilitados pela opção de configuração `innodb_purge_threads`.

Veja também purge, rosca.

Python: Uma linguagem de programação usada em uma ampla gama de áreas, desde scripts Unix até aplicações em larga escala. Inclui tipificação dinâmica, tipos de dados integrados de alto nível, recursos orientado a objetos e uma extensa biblioteca padrão. Muitas vezes usada como uma linguagem de "cola" entre componentes escritos em outros idiomas. A **API Python do MySQL** é o módulo MySQLdb de código aberto.

Veja também MySQLdb, API do Python.

API do Python: Veja também API, Python.

### Q

pergunta: Em **SQL**, uma operação que lê informações de uma ou mais **tabelas**. Dependendo da organização dos dados e dos parâmetros da consulta, a pesquisa pode ser otimizada consultando um **índice**. Se várias tabelas estão envolvidas, a consulta é conhecida como **join**.

Por razões históricas, às vezes, as discussões sobre processamento interno para declarações usam a palavra “consulta” em um sentido mais amplo, incluindo outros tipos de declarações MySQL, como **DDL** e **DML**.

Veja também DDL, DML, índice, junção, SQL, tabela.

plano de execução de consulta: O conjunto de decisões tomadas pelo otimizador sobre como realizar uma consulta de forma mais eficiente, incluindo quais índices ou índices utilizar e a ordem em que realizar a junção das tabelas. A estabilidade do plano envolve a mesma escolha sendo feita consistentemente para uma consulta dada.

Veja também índice, associação, plano de estabilidade, consulta.

registro de consultas: Veja o registro geral de consultas.

quieto: Para reduzir a quantidade de atividade do banco de dados, muitas vezes em preparação para uma operação como uma `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement"), um **backup** ou um **shutdown**. Pode ou não envolver fazer o máximo de **limpeza** possível, para que o **InnoDB** não continue realizando I/O de fundo.

Em MySQL 5.6 e versões posteriores, a sintaxe `FLUSH TABLES ... FOR EXPORT` escreve alguns dados no disco para as tabelas `InnoDB` que facilitam o backup dessas tabelas, copiando os arquivos de dados.

Veja também backup, flush, InnoDB, shutdown.

### R

R-tree: Uma estrutura de dados em forma de árvore usada para indexação espacial de dados multidimensionais, como coordenadas geográficas, retângulos ou polígonos.

Veja também B-tree.

RAID: Abreviação de “Array Redundante de Unidades Inexpensive”. Distribuir operações de E/S em múltiplos discos permite maior **concorrência** ao nível do hardware e melhora a eficiência das operações de escrita de baixo nível que, de outra forma, seriam realizadas em sequência.

Veja também concorrência.

mergulho aleatório: Uma técnica para estimar rapidamente o número de diferentes valores em uma coluna (a **cardinalidade** da coluna). As amostras `InnoDB` das páginas são coletadas aleatoriamente do índice e esses dados são usados para estimar o número de diferentes valores.

Veja também cardinalidade.

backup bruto: O conjunto inicial de arquivos de backup produzidos pelo produto **MySQL Enterprise Backup**, antes das alterações refletidas no **registro binário** e de quaisquer **backup incrementais** serem aplicados. Nesta fase, os arquivos não estão prontos para **restaurar**. Após essas alterações serem aplicadas, os arquivos são conhecidos como um **backup preparado**.

Veja também: log binário, backup quente, ibbackup_logfile, backup incremental, MySQL Enterprise Backup, backup preparado, restauração.

LEIA COM PROMESSA: Um **nível de isolamento** que utiliza uma estratégia de **bloqueio** que relaxa parte da proteção entre as **transações**, no interesse do desempenho. As transações não podem ver dados não comprometidos de outras transações, mas podem ver dados que são comprometidos por outra transação após a transação atual ter começado. Assim, uma transação nunca vê nenhum dado ruim, mas os dados que ela vê podem, em certa medida, depender do momento das outras transações.

Quando uma transação com esse nível de isolamento realiza operações `UPDATE ... WHERE` ou `DELETE ... WHERE`, outras transações podem ter que esperar. A transação pode realizar operações `SELECT ... FOR UPDATE` e `LOCK IN SHARE MODE` sem fazer com que outras transações esperem.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja também ACID, nível de isolamento, bloqueio, REPEATABLE READ, SERIALIZABLE, transação.

fenômenos de leitura: Fenômenos como **leitura suja**, **leitura não repetida** e **leitura fantasma** que podem ocorrer quando uma transação lê dados que outra transação modificou.

Veja também leitura suja, leitura não repetida e fantasma.

LEIA NÃO COMITADA: O **nível de isolamento** que oferece a menor quantidade de proteção entre as transações. As consultas empregam uma estratégia de **bloqueio** que lhes permite prosseguir em situações em que normalmente esperariam por outra transação. No entanto, esse desempenho adicional é pago ao custo de resultados menos confiáveis, incluindo dados que foram alterados por outras transações e ainda não foram comprometidos (conhecido como **leitura suja**). Use este nível de isolamento com grande cautela e esteja ciente de que os resultados podem não ser consistentes ou reproduzíveis, dependendo do que outras transações estão fazendo ao mesmo tempo. Tipicamente, as transações com este nível de isolamento realizam apenas consultas, não inserções, atualizações ou operações de exclusão.

Veja também ACID, leitura suja, nível de isolamento, bloqueio, transação.

visualização de leitura: Um instantâneo interno utilizado pelo mecanismo de **MVCC** de `InnoDB`. Certas **transações**, dependendo do seu **nível de isolamento**, veem os valores dos dados como estavam na época em que a transação (ou em alguns casos, a declaração) começou. Os níveis de isolamento que utilizam uma visualização de leitura são **LEIA REPEATÁVEL**, **LEIA COM COMPROMISSO** e **LEIA NÃO COMPROMISSO**.

Veja também nível de isolamento, MVCC, COMITADO DE LEITURA, LEITURA NÃO COMITADA, LEITURA REPEATÁVEL, transação.

leitura antecipada: Um tipo de solicitação de E/S que pré-prefere um grupo de **páginas** (um **extensão** inteiro) no **pool de buffer** de forma assíncrona, no caso de essas páginas serem necessárias em breve. A técnica de leitura antecipada linear pré-prefere todas as páginas de uma extensão com base nos padrões de acesso das páginas na extensão anterior. A técnica de leitura antecipada aleatória pré-prefere todas as páginas de uma extensão assim que um certo número de páginas da mesma extensão estão no pool de buffer. A leitura antecipada aleatória não faz parte do MySQL 5.5, mas é reintroduzida no MySQL 5.6 sob o controle da opção de configuração `innodb_random_read_ahead`.

Veja também buffer pool, extensão, página.

transação de leitura: Um tipo de **transação** que pode ser otimizada para tabelas `InnoDB` eliminando algumas das tarefas contábeis envolvidas na criação de uma **visualização de leitura** para cada transação. Pode realizar apenas consultas de leitura **não bloqueio**. Pode ser iniciada explicitamente com a sintaxe [[`START TRANSACTION READ ONLY`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")], ou automaticamente sob certas condições. Veja a Seção 10.5.3, “Otimizando Transações de Leitura Não Bloqueadas” para detalhes.

Veja também leitura não bloqueável, visualização de leitura, transação.

bloqueio de registro: um bloqueio em um registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transação insira, atualize ou exclua linhas onde o valor de `t.c1` é 10. Contrasta com **bloqueio de lacuna** e **bloqueio de próxima chave**.

Veja também bloqueio de lacuna, bloqueio, bloqueio da próxima chave.

redo: Os dados, em unidades de registros, registrados no **registro de refazer** quando as declarações DML fazem alterações nas tabelas de `InnoDB`. É usado durante a **recuperação de falhas** para corrigir os dados escritos por **transações** incompletas. O valor sempre crescente do **LSN** representa a quantidade cumulativa de dados de refazer que passaram pelo registro de refazer.

Veja também recuperação de falhas, DML, LSN, registro de refazer, transação.

registro de refazer: uma estrutura de dados baseada em disco usada durante a **recuperação em caso de falha**, para corrigir dados escritos por **transações** incompletas. Durante o funcionamento normal, ela codifica solicitações para alterar os dados da tabela `InnoDB`, que resultam de declarações SQL ou chamadas de API de baixo nível. As modificações que não terminaram a atualização dos **arquivos de dados** antes de uma **interrupção inesperada** são regravadas automaticamente.

O log de refazer é representado fisicamente no disco como um conjunto de arquivos de log de refazer. Os dados do log de refazer são codificados em termos de registros afetados; esses dados são coletivamente referidos como **redo**. A passagem dos dados pelo log de refazer é representada por um valor **LSN** cada vez maior.

Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”

Veja também recuperação de falhas, arquivos de dados, ib_logfile, buffer de log, LSN, redo, desligamento, transação.

arquivamento de log de refazer: Uma característica `InnoDB` que, quando habilitada, escreve sequencialmente registros de log de refazer em um arquivo de arquivo para evitar uma possível perda de dados que pode ocorrer quando uma ferramenta de backup não consegue acompanhar a geração de log de refazer enquanto uma operação de backup está em andamento. Para mais informações, consulte Arquivo de Log de Redo.

Veja também o registro de refazer.

formato de linha redundante: o formato de linha mais antigo `InnoDB` **. Antes do MySQL 5.0.3, era o único formato de linha disponível em `InnoDB`. De MySQL 5.0.3 a MySQL 5.7.8, o formato de linha padrão é **COMPACT**. A partir do MySQL 5.7.9, o formato de linha padrão é definido pela opção de configuração `innodb_default_row_format`, que tem um ajuste padrão de **DINÂMICA**. Você ainda pode especificar o formato de linha **REDUNDANTE** para compatibilidade com tabelas mais antigas de `InnoDB`.

Para mais informações, consulte a Seção 17.10, “Formatos de linha InnoDB”.

Veja também formato de linha compacta, formato de linha dinâmica, formato de linha.

integridade referencial: A técnica de manter os dados sempre em um formato consistente, parte da filosofia **ACID**. Em particular, os dados em diferentes tabelas são mantidos consistentes através do uso de **restrições de chave estrangeira**, que podem impedir que mudanças ocorram ou propagar automaticamente essas mudanças para todas as tabelas relacionadas. Mecanismos relacionados incluem a **restrição única**, que impede que valores duplicados sejam inseridos por engano, e a **restrição NOT NULL**, que impede que valores em branco sejam inseridos por engano.

Veja também ACID, restrição de chave estrangeira, restrição NOT NULL, restrição única.

relacional: Um aspecto importante dos sistemas de banco de dados modernos. O servidor de banco de dados codifica e reforça relações como um para um, um para muitos, muitos para um e unicidade. Por exemplo, uma pessoa pode ter zero, um ou vários números de telefone em um banco de dados de endereços; um único número de telefone pode ser associado a vários membros da família. Em um banco de dados financeiro, uma pessoa pode ser exigida para ter exatamente um número de identificação de contribuinte, e qualquer número de identificação de contribuinte só pode ser associado a uma pessoa.

O servidor de banco de dados pode usar essas relações para impedir que dados ruins sejam inseridos e para encontrar maneiras eficientes de procurar informações. Por exemplo, se um valor for declarado como único, o servidor pode parar de procurar assim que a primeira correspondência for encontrada e pode rejeitar tentativas de inserir uma segunda cópia do mesmo valor.

No nível do banco de dados, essas relações são expressas por meio de recursos SQL, como **colunas** dentro de uma tabela, restrições únicas e `NOT NULL` **, chaves estrangeiras e diferentes tipos de operações de junção. Relações complexas geralmente envolvem dados divididos entre mais de uma tabela. Muitas vezes, os dados são **normalizados**, de modo que os valores duplicados em relações de um para muitos são armazenados apenas uma vez.

Em um contexto matemático, as relações dentro de um banco de dados são derivadas da teoria dos conjuntos. Por exemplo, os operadores `OR` e `AND` de uma cláusula `WHERE` representam as noções de união e interseção.

Veja também ACID, coluna, restrição, chave estrangeira, normalizado.

relevancia: Na funcionalidade de **pesquisa de texto completo**, um número que indica a similaridade entre a cadeia de busca e os dados no **índice FULLTEXT**. Por exemplo, quando você busca uma palavra única, essa palavra é tipicamente mais relevante para uma linha onde ocorre várias vezes no texto do que para uma linha onde aparece apenas uma vez.

Veja também pesquisa de texto completo, índice FULLTEXT.

REPEATABLE READ: O nível de isolamento padrão para `InnoDB`. Ele impede que quaisquer linhas que estejam sendo consultadas sejam alteradas por outras **transações**, bloqueando assim **leitura não repetida**, mas não **leitura fantasma**. Ele utiliza uma estratégia de **bloqueio** moderadamente rigorosa, de modo que todas as consultas dentro de uma transação vejam dados do mesmo instantâneo, ou seja, os dados como estavam no momento em que a transação começou.

Quando uma transação com esse nível de isolamento realiza as operações `UPDATE ... WHERE`, `DELETE ... WHERE`, `SELECT ... FOR UPDATE` e `LOCK IN SHARE MODE`, outras transações podem ter que esperar.

`SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

Veja também ACID, leitura consistente, nível de isolamento, bloqueio, fantasma, transação.

repertório: Repertório é um termo aplicado a conjuntos de caracteres. Um repertório de conjuntos de caracteres é a coleção de caracteres no conjunto. Veja a Seção 12.2.1, “Repertório de Conjunto de Caracteres”.

Um servidor de banco de dados em uma topologia de **replicação** que recebe alterações de outro servidor (a **fonte**) e aplica essas mesmas alterações. Assim, ele mantém os mesmos conteúdos que a fonte, embora possa estar um pouco atrasado.

Em MySQL, as réplicas são comumente usadas na recuperação em caso de desastre, para substituir uma fonte que falha. Elas também são comumente usadas para testar atualizações de software e novas configurações, para garantir que as mudanças na configuração do banco de dados não causem problemas de desempenho ou confiabilidade.

As réplicas geralmente têm cargas de trabalho elevadas, pois processam todas as operações **DML** (escrita) retransmitidas da fonte, além de consultas de usuários. Para garantir que as réplicas possam aplicar mudanças da fonte o suficiente, elas frequentemente possuem dispositivos de I/O rápidos e memória e CPU suficientes para executar múltiplas instâncias do banco de dados no mesmo servidor. Por exemplo, a fonte pode usar armazenamento em disco rígido, enquanto as réplicas usam **SSD**.

Veja também DML, replicação, servidor, fonte, SSD.

replicação: A prática de enviar alterações de uma **fonte**, para uma ou mais **replicas**, de modo que todos os bancos de dados tenham os mesmos dados. Essa técnica tem uma ampla gama de usos, como balanceamento de carga para melhor escalabilidade, recuperação em caso de desastre e teste de atualizações e alterações de configuração de software. As alterações podem ser enviadas entre os bancos de dados por métodos chamados **replicação baseada em linha** e **replicação baseada em declaração**.

Veja também replica, replicação baseada em linha, fonte, replicação baseada em declaração.

restaurar: O processo de colocar um conjunto de arquivos de backup do produto **MySQL Enterprise Backup** no lugar para uso pelo MySQL. Esta operação pode ser realizada para corrigir um banco de dados corrompido, para retornar a algum ponto anterior no tempo ou (em um contexto de **replicação**), para configurar uma nova **replica**. No produto **MySQL Enterprise Backup**, esta operação é realizada pela opção `copy-back` do comando `mysqlbackup`.

Veja também backup quente, MySQL Enterprise Backup, comando mysqlbackup, backup preparado, replica, replicação.

rollback: Uma declaração **SQL** que termina uma **transação**, anulando quaisquer alterações feitas pela transação. É o oposto de **commit**, que torna permanentes quaisquer alterações feitas na transação.

Por padrão, o MySQL usa a configuração **autocommit**, que emite automaticamente um compromisso após cada declaração SQL. Você deve alterar essa configuração antes de poder usar a técnica de rollback.

Veja também ACID, autocommit, commit, SQL, transação.

segmento de recuo: A área de armazenamento que contém os **registros de desfazer**. Os segmentos de recuo tradicionalmente residiam no **espaço de tabela do sistema**. A partir do MySQL 5.6, os segmentos de recuo podem residir nos **espaços de tabela de desfazer**. A partir do MySQL 5.7, os segmentos de recuo também são alocados no *espaço de tabela temporária global*.

Veja também: espaço de tabela temporário global, espaço de tabela do sistema, registro de desfazer, espaço de tabela de desfazer.

linha: A estrutura de dados lógica definida por um conjunto de **colunas**. Um conjunto de linhas compõe uma **tabela**. Dentro dos arquivos de dados `InnoDB`, cada **página** pode conter uma ou mais linhas.

Embora o `InnoDB` use o termo **formato de linha** para manter a consistência com a sintaxe do MySQL, o formato de linha é uma propriedade de cada tabela e se aplica a todas as linhas dessa tabela.

Veja também coluna, arquivos de dados, página, formato de linha, tabela.

Formato de linha: O formato de armazenamento em disco para **linhas** de uma tabela do `InnoDB` **. À medida que o `InnoDB` ganha novas capacidades, como **compressão**, novos formatos de linha são introduzidos para suportar as melhorias resultantes na eficiência e desempenho do armazenamento.

O formato de linha de uma tabela `InnoDB` é especificado pela opção `ROW_FORMAT` ou pela opção de configuração `innodb_default_row_format` (introduzida no MySQL 5.7.9). Os formatos de linha incluem `REDUNDANT`, `COMPACT`, `COMPRESSED` e `DYNAMIC`. Para visualizar o formato de linha de uma tabela `InnoDB`, execute a declaração `SHOW TABLE STATUS` ou consulte os metadados da tabela `InnoDB` no `INFORMATION_SCHEMA`.

Veja também formato de linha compacta, formato de linha comprimida, compressão, formato de linha dinâmica, formato de linha redundante, linha, tabela.

bloqueio de linha: Um **bloqueio** que impede que uma linha seja acessada de uma maneira incompatível por outra **transação**. Outras linhas da mesma tabela podem ser escritas livremente por outras transações. Esse é o tipo de **bloqueio** realizado por operações **DML** em tabelas **InnoDB**.

Em contraste com as **bloqueadoras de tabela** usadas por `MyISAM`, ou durante operações de **DDL** em tabelas de `InnoDB` que não podem ser feitas com **DDL online**; essas bloqueadoras bloqueiam o acesso concorrente à tabela.

Veja também DDL, DML, InnoDB, bloqueio, bloqueio, DDL online, bloqueio de tabela, transação.

replicação baseada em linha: Uma forma de **replicação** em que os eventos são propagados a partir da **fonte**, especificando como alterar as linhas individuais na **replica**. É seguro usar para todas as configurações da opção `innodb_autoinc_lock_mode`.

Veja também bloqueio de autoincremento, innodb_autoinc_lock_mode, replica, replicação, fonte, replicação baseada em declaração.

bloqueio de nível de linha: O mecanismo de **bloqueio** utilizado para as tabelas **InnoDB**, que depende de **blocos de linha** em vez de **blocos de tabela**. Múltiplas **transações** podem modificar a mesma tabela simultaneamente. Apenas se duas transações tentarem modificar a mesma linha, uma das transações aguarda a outra para completar (e liberar seus blocos de linha).

Veja também InnoDB, bloqueio, bloqueio de linha, bloqueio de tabela, transação.

Ruby: Um idioma de programação que enfatiza a tipificação dinâmica e a programação orientada a objetos. Algumas sintaxes são familiares aos desenvolvedores de **Perl**.

Veja também API, Perl, Ruby API.

A API Ruby `mysql2`, baseada na biblioteca de API **libmysqlclient**, está disponível para programadores Ruby que desenvolvem aplicativos MySQL. Para mais informações, consulte a Seção 31.11, “APIs Ruby MySQL”.

Veja também libmysql, Ruby.

rw-lock: O objeto de baixo nível que `InnoDB` usa para representar e impor **bloqueios** de acesso compartilhado a estruturas de dados internas em memória, seguindo certas regras. Em contraste com os **mutexes**, que `InnoDB` usa para representar e impor acesso exclusivo a estruturas de dados internas em memória. Mutexes e rw-locks são conhecidos coletivamente como **latches**.

Os tipos de `rw-lock` incluem `s-locks` (lås compartilhados), `x-locks` (lås exclusivos) e `sx-locks` (lås compartilhados-exclusivos).

* Um `s-lock` fornece acesso de leitura a um recurso comum.

* Um `x-lock` fornece acesso de escrita a um recurso comum, sem permitir leituras inconsistentes por outros threads.

* Um `sx-lock` fornece acesso de escrita a um recurso comum, permitindo leituras inconsistentes por outros threads. `sx-locks` foram introduzidos no MySQL 5.7 para otimizar a concorrência e melhorar a escalabilidade para cargas de trabalho de leitura e escrita.

A matriz a seguir resume a compatibilidade do tipo rw-lock.

    <table summary="Compatibility matrix for rw-lock types. Each cell in the matrix is marked as either Compatible or Conflict."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col"></th> <th scope="col"><em class="replaceable"><code>S</code></em></th> <th scope="col"><em class="replaceable"><code>SX</code></em></th> <th scope="col"><em class="replaceable"><code>X</code></em></th> </tr></thead><tbody><tr> <th scope="row"><em class="replaceable"><code>S</code></em></th> <td>Compatible</td> <td>Compatible</td> <td>Conflict</td> </tr><tr> <th scope="row"><em class="replaceable"><code>SX</code></em></th> <td>Compatible</td> <td>Conflict</td> <td>Conflict</td> </tr><tr> <th scope="row"><em class="replaceable"><code>X</code></em></th> <td>Conflict</td> <td>Conflict</td> <td>Conflict</td> </tr></tbody></table>

Veja também trava, bloqueio, mutex, Schema de desempenho.

### S

savepoint: Os pontos de salvamento ajudam a implementar **transações aninhadas**. Eles podem ser usados para fornecer escopo para operações em tabelas que fazem parte de uma transação maior. Por exemplo, agendar uma viagem em um sistema de reservas pode envolver a reserva de vários voos diferentes; se um voo desejado estiver indisponível, você pode **reverter** as alterações envolvidas na reserva daquele trecho, sem reverter os voos anteriores que foram reservados com sucesso.

Veja também rollback, transação.

escalabilidade: A capacidade de adicionar mais trabalho e emitir mais solicitações simultâneas a um sistema, sem uma queda súbita no desempenho devido ao excedente dos limites da capacidade do sistema. A arquitetura de software, a configuração de hardware, a codificação de aplicativos e o tipo de carga de trabalho desempenham um papel na escalabilidade. Quando o sistema atinge sua capacidade máxima, as técnicas populares para aumentar a escalabilidade são **escalar para cima** (aumentar a capacidade do hardware ou software existente) e **escalar para fora** (adicionar novos servidores e mais instâncias do MySQL). Frequentemente associadas à **disponibilidade** como aspectos críticos de uma implantação em larga escala.

Veja também disponibilidade, escalar para fora, escalar para cima.

escalar: Uma técnica para aumentar a **escalabilidade** adicionando novos servidores e mais instâncias do MySQL. Por exemplo, configurar replicação, NDB Cluster, pool de conexões ou outras funcionalidades que espalham o trabalho por um grupo de servidores. Contrasta com **escalar para cima**.

Veja também escalabilidade, escala em expansão.

escalar: Uma técnica para aumentar a **escalabilidade** aumentando a capacidade do hardware ou software existente. Por exemplo, aumentar a memória em um servidor e ajustar parâmetros relacionados à memória, como `innodb_buffer_pool_size` e `innodb_buffer_pool_instances`. Contrasta com **escalar para fora**.

Veja também escalabilidade, escala para fora.

Conceitualmente, um esquema é um conjunto de objetos relacionados do banco de dados, como tabelas, colunas de tabela, tipos de dados das colunas, índices, chaves estrangeiras, etc. Esses objetos são conectados através da sintaxe SQL, porque as colunas compõem as tabelas, as chaves estrangeiras referem-se a tabelas e colunas, etc. Idealmente, eles também são conectados logicamente, trabalhando juntos como parte de uma aplicação unificada ou estrutura flexível. Por exemplo, os bancos de dados **INFORMATION_SCHEMA** e **performance_schema** usam “esquema” em seus nomes para enfatizar as relações próximas entre as tabelas e colunas que contêm.

Em MySQL, fisicamente, um **esquema** é sinônimo de um **banco de dados**. Você pode substituir a palavra-chave `SCHEMA` em vez de `DATABASE` na sintaxe SQL do MySQL, por exemplo, usando `CREATE SCHEMA` em vez de `CREATE DATABASE`.

Alguns outros produtos de banco de dados fazem uma distinção. Por exemplo, no produto Oracle Database, um **esquema** representa apenas uma parte de um banco de dados: as tabelas e outros objetos de propriedade de um único usuário.

Veja também banco de dados, INFORMATION_SCHEMA, Schema de desempenho.

SDI: Abreviação de “informações de dicionário serializado”.

Veja também informações do dicionário em série (SDI).

índice de pesquisa: Nas consultas de pesquisa de texto completo do MySQL, os índices especiais são os índices FULLTEXT. Nos MySQL 5.6.4 e versões posteriores, as tabelas `InnoDB` e `MyISAM` suportam índices `FULLTEXT`; anteriormente, esses índices estavam disponíveis apenas para as tabelas `MyISAM`.

Veja também pesquisa de texto completo, índice FULLTEXT.

índice secundário: um tipo de índice `InnoDB` **que representa um subconjunto de colunas da tabela. Uma tabela `InnoDB` pode ter zero, um ou vários índices secundários. (Compare com o **índice agrupado**, que é necessário para cada tabela `InnoDB`, e armazena os dados para todas as colunas da tabela.)

Um índice secundário pode ser usado para satisfazer consultas que exigem apenas valores das colunas indexadas. Para consultas mais complexas, ele pode ser usado para identificar as linhas relevantes na tabela, que são então recuperadas por meio de consultas usando o índice agrupado.

Criar e descartar índices secundários tradicionalmente envolve um custo significativo devido à cópia de todos os dados na tabela `InnoDB`. O recurso de **criação rápida de índices** torna as declarações de `CREATE INDEX` e `DROP INDEX` muito mais rápidas para os índices secundários `InnoDB`.

Veja também índice agrupado, criação rápida de índice, index.

segmento: Uma divisão dentro de um **espaço de tabelas** `InnoDB`. Se um espaço de tabelas é análogo a um diretório, os segmentos são análogos aos arquivos dentro desse diretório. Um segmento pode crescer. Novos segmentos podem ser criados.

Por exemplo, em um espaço de tabela por arquivo, os dados da tabela estão em um segmento e cada índice associado está em seu próprio segmento. O espaço de tabela do sistema contém muitos segmentos diferentes, porque pode conter muitas tabelas e seus índices associados. Antes do MySQL 8.0, o espaço de tabela do sistema também inclui um ou mais segmentos de **retorno** usados para **registros de desfazimento**.

Os segmentos crescem e encolhem à medida que os dados são inseridos e excluídos. Quando um segmento precisa de mais espaço, ele é estendido por um **extensão** (1 megabyte) de cada vez. Da mesma forma, um segmento libera o espaço correspondente a uma extensão quando todos os dados nessa extensão deixam de ser necessários.

Veja também extensão, arquivo por tabela, segmento de rollback, espaço de tabela do sistema, espaço de tabela, registro de desfazer.

seletividade: Uma propriedade da distribuição de dados, o número de valores distintos em uma coluna (sua **cardinalidade**) dividido pelo número de registros na tabela. Alta seletividade significa que os valores da coluna são relativamente únicos e podem ser recuperados eficientemente por meio de um índice. Se você (ou o otimizador de consulta) pode prever que um teste em uma cláusula `WHERE` só corresponde a um pequeno número (ou proporção) de linhas em uma tabela, a **consulta** geral tende a ser eficiente se avaliar esse teste primeiro, usando um índice.

Veja também cardinalidade, consulta.

leitura semi-consistente: Um tipo de operação de leitura usada para as declarações `UPDATE` que é uma combinação de **LEITURA COM PROMESSA** e **leitura consistente**. Quando uma declaração `UPDATE` examina uma linha que já está bloqueada, `InnoDB` retorna a versão mais recente comprometida ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente, e desta vez `InnoDB` a bloqueia ou espera por um bloqueio nela. Este tipo de operação de leitura só pode ocorrer quando a transação tem o nível de isolamento **LEITURA COM PROMESSA**.

Veja também leitura consistente, nível de isolamento, READ COMMITTED.

SERIALIZÁVEL: O **nível de isolamento** que utiliza a estratégia de bloqueio mais conservadora, para evitar que outras **transações** insiram ou modifiquem dados que foram lidos por esta transação, até que ela seja concluída. Dessa forma, a mesma consulta pode ser executada várias vezes dentro de uma transação e ter certeza de obter o mesmo conjunto de resultados cada vez. Qualquer tentativa de alterar dados que foram comprometidos por outra transação desde o início da transação atual fará com que a transação atual espere.

Este é o nível de isolamento padrão especificado pelo padrão SQL. Na prática, esse grau de estrictura raramente é necessário, portanto, o nível de isolamento padrão para `InnoDB` é o próximo mais estrito, **REPEATABLE READ**.

Veja também ACID, leitura consistente, nível de isolamento, bloqueio, leitura repetida, transação.

informações serializadas do dicionário (SDI): metadados do objeto do dicionário em forma serializada. O SDI é armazenado no formato `JSON`.

A partir do MySQL 8.0.3, o SDI está presente em todos os arquivos de espaço de tabela `InnoDB`, exceto para arquivos de espaço de tabela temporário e espaço de tabela de desfazer. A presença do SDI em arquivos de espaço de tabela fornece redundância de metadados. Por exemplo, os metadados do objeto do dicionário podem ser extraídos dos arquivos de espaço de tabela usando o utilitário **ibd2sdi** se o dicionário de dados se tornar indisponível.

Para uma tabela `MyISAM`, o SDI é armazenado em um arquivo de metadados `.sdi` no diretório do esquema. Um arquivo de metadados SDI é necessário para realizar uma operação `IMPORT TABLE`.

Veja também arquivo por tabela, espaço de tabela geral, espaço de tabela do sistema, espaço de tabela.

servidor: Um tipo de programa que funciona continuamente, esperando para receber e agir em relação a solicitações de outro programa (o **cliente**). Como muitas vezes um computador inteiro é dedicado para executar um ou mais programas de servidor (como um servidor de banco de dados, um servidor web, um servidor de aplicação ou alguma combinação desses), o termo **servidor** também pode se referir ao computador que executa o software do servidor.

Veja também cliente, mysqld.

declaração preparada do lado do servidor: Uma **declaração preparada** gerenciada pelo servidor MySQL. Historicamente, os problemas com declarações preparadas do lado do servidor levaram os desenvolvedores do **Connector/J** e do **Connector/PHP** a, às vezes, usar declarações preparadas do lado do cliente. Com as versões modernas do servidor MySQL, declarações preparadas do lado do servidor são recomendadas para desempenho, escalabilidade e eficiência de memória.

Veja também declaração preparada do lado do cliente, Connector/J, Connector/PHP, declaração preparada.

nome do principal do serviço: O nome para uma entidade com nome Kerberos que representa um serviço.

Veja também principal.

bilhete de serviço: Um bilhete Kerberos que fornece acesso a um serviço de aplicação, como o serviço fornecido por um servidor web ou de banco de dados.

servlet: Veja também Connector/J.

espaço de tabela temporário de sessão: Um *espaço de tabela temporário* que armazena tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo *opinião de otimização* quando `InnoDB` é configurado como o motor de armazenamento em disco para tabelas temporárias internas.

Veja também otimizador, tabela temporária, espaço de tabela temporária.

bloqueio compartilhado: Um tipo de **bloqueio** que permite que outras **transações** leiam o objeto bloqueado e também adquira outros **blocos** compartilhados sobre ele, mas não o escreva. O oposto de **bloqueio exclusivo**.

Veja também bloqueio exclusivo, bloqueio, transação.

espaço de tabela compartilhado: Outra maneira de se referir ao **espaço de tabela do sistema** ou a um **espaço de tabela geral**. Os espaços de tabela gerais foram introduzidos no MySQL 5.7. Mais de uma tabela pode residir em um espaço de tabela compartilhado. Apenas uma única tabela pode residir em um espaço de tabela *por arquivo por tabela*.

Veja também as tabelas gerais de espaço de armazenamento e o espaço de armazenamento de tabelas do sistema.

ponto de verificação agudo: O processo de **lavagem** para disco de todas as páginas do **buffer** **sujas** cujas entradas de refazer estão contidas em uma certa porção do **registro de refazer**. Ocorre antes de `InnoDB` reutilizar uma porção de um arquivo de registro; os arquivos de registro são usados de forma circular. Tipicamente ocorre com cargas de trabalho **intensivas de escrita**.

Veja também página suja, limpeza, registro de refazer, carga de trabalho.

shutdown: O processo de parada do servidor MySQL. Por padrão, este processo limpa as operações para as tabelas **InnoDB**, portanto, `InnoDB` pode ser **lento** para ser desligado, mas rápido para ser iniciado posteriormente. Se você pular as operações de limpeza, é **rápido** para desligar, mas a limpeza deve ser realizada durante o próximo reinício.

O modo de desligamento para `InnoDB` é controlado pela opção `innodb_fast_shutdown`.

Veja também: desligamento rápido, InnoDB, desligamento lento, inicialização.

escravo: Veja réplica.

registro de consultas lentas: Um tipo de **registro** usado para o ajuste de desempenho de declarações SQL processadas pelo servidor MySQL. As informações do registro são armazenadas em um arquivo. Você deve habilitar essa funcionalidade para usá-la. Você controla quais categorias de declarações SQL "lentas" são registradas. Para mais informações, consulte a Seção 7.4.5, "O registro de consultas lentas".

Veja também o registro de consulta geral, log.

desligamento lento: Um tipo de **desligamento** que realiza operações adicionais de limpeza `InnoDB` antes de completar. Também conhecido como **desligamento limpo**. Especificado pelo parâmetro de configuração `innodb_fast_shutdown=0` ou pelo comando `SET GLOBAL innodb_fast_shutdown=0;`. Embora o desligamento em si possa levar mais tempo, esse tempo deve ser economizado na subsequente inicialização.

Veja também desligamento limpo, desligamento rápido, desligamento.

instantâneo: Uma representação dos dados em um momento específico, que permanece a mesma mesmo quando as alterações são **comprometidas** por outras **transações**. Utilizado por certos **níveis de isolamento** para permitir **leitura consistente**.

Veja também commit, leitura consistente, nível de isolamento, transação.

buffer de ordenação: O buffer usado para ordenar dados durante a criação de um índice `InnoDB`. O tamanho do buffer de ordenação é configurado usando a opção de configuração `innodb_sort_buffer_size`.

fonte: Um servidor de banco de dados em um cenário de **replicação** que processa as solicitações iniciais de inserção, atualização e exclusão de dados. Essas alterações são propagadas e repetidas em outros servidores conhecidos como **replicas**.

Veja também réplica, replicação.

ID de espaço: Um identificador usado para identificar de forma única um **tablespace** `InnoDB` dentro de uma instância do MySQL. O ID de espaço para o **tablespace de sistema** é sempre zero; esse mesmo ID se aplica a todas as tabelas dentro do **tablespace de sistema** ou dentro de um **tablespace geral**. Cada **tablespace por arquivo** e **tablespace geral** tem seu próprio ID de espaço.

Antes do MySQL 5.6, esse valor codificado apresentou dificuldades na transferência dos arquivos do espaço de `InnoDB` entre instâncias do MySQL. A partir do MySQL 5.6, você pode copiar arquivos de espaço de tabela entre instâncias usando o recurso de **espaço de tabela transponível**, envolvendo as declarações `FLUSH TABLES ... FOR EXPORT`, `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE`. As informações necessárias para ajustar o ID de espaço são transmitidas no **arquivo .cfg**, que você copia junto com o espaço de tabela. Veja a Seção 17.6.1.3, “Importando Tabelas InnoDB”, para detalhes.

Veja também o arquivo .cfg, arquivo por tabela, espaço de tabela geral, arquivo .ibd, espaço de tabela do sistema, espaço de tabela, espaço de tabela transportable.

arquivo esparso: Um tipo de arquivo que utiliza o espaço do sistema de arquivos de forma mais eficiente, escrevendo metadados que representam blocos vazios no disco em vez de escrever o espaço vazio real. O recurso de **comprimentos de página transparentes `InnoDB`** depende do suporte a arquivos esparsos. Para mais informações, consulte a Seção 17.9.2, “Compressão de página InnoDB”.

Veja também perfuração de buracos, compressão transparente de página.

spin: Um tipo de operação de **espera** que continuamente testa se um recurso se torna disponível. Essa técnica é usada para recursos que são tipicamente mantidos apenas por curtos períodos, onde é mais eficiente esperar em um "loop ocupado" do que colocar o thread para dormir e realizar uma troca de contexto. Se o recurso não se tornar disponível em um curto período de tempo, o loop de espera cessa e outra técnica de espera é usada.

Veja também gatilho, bloqueio, mútuo, espera.

SPN: Veja o nome do principal do serviço.

Primavera: Um framework de aplicação baseado em Java projetado para auxiliar no projeto de aplicações, fornecendo uma maneira de configurar componentes.

Veja também J2EE.

SQL: O Linguagem de Consulta Estruturada que é padrão para realizar operações de banco de dados. Frequentemente dividido nas categorias **DDL**, **DML** e **consultas**. O MySQL inclui algumas categorias de declarações adicionais, como **replicação**. Veja o Capítulo 11, *Estrutura da Linguagem* para os blocos de construção da sintaxe SQL, o Capítulo 13, *Tipos de Dados* para os tipos de dados a serem usados para as colunas das tabelas do MySQL, o Capítulo 15, *Declarações SQL* para detalhes sobre as declarações SQL e suas categorias associadas, e o Capítulo 14, *Funções e Operadores* para funções padrão e específicas do MySQL a serem usadas em consultas.

Veja também DDL, DML, consulta, replicação.

SQLState: Um código de erro definido pelo padrão **JDBC**, para o tratamento de exceções por aplicações que utilizam **Connector/J**.

Veja também Connector/J, JDBC.

SSD: Abreviação de “unidade de estado sólido”. Um tipo de dispositivo de armazenamento com características de desempenho diferentes de um disco rígido tradicional (**HDD**): menor capacidade de armazenamento, mais rápido para leituras aleatórias, sem partes móveis e com uma série de considerações que afetam o desempenho de escrita. Suas características de desempenho podem influenciar o desempenho de uma **carga de disco**.

Veja também disco-ligado, HDD.

SSL: Abreviação de “Secure Sockets Layer”. Fornece a camada de criptografia para a comunicação de rede entre uma aplicação e um servidor de banco de dados MySQL.

Veja também keystore, truststore.

ST: Veja o ticket de serviço.

startup: O processo de inicialização do servidor MySQL. Normalmente feito por um dos programas listados na Seção 6.3, “Programas de servidor e de inicialização do servidor”. O oposto de **shutdown**.

Veja também desligamento.

interceptador de declarações: Um tipo de **interceptador** para rastrear, depurar ou ampliar declarações SQL emitidas por um aplicativo de banco de dados. Às vezes também conhecido como **interceptador de comandos**.

Em aplicações **Java** que utilizam o **Connector/J**, configurar esse tipo de interceptor envolve a implementação da interface `com.mysql.jdbc.StatementInterceptorV2` e a adição de uma propriedade `statementInterceptors` à **string de conexão**.

Em aplicativos do **Visual Studio** que utilizam o **Connector/NET**, configurar esse tipo de interceptor envolve definir uma classe que herda da classe `BaseCommandInterceptor` e especificar o nome dessa classe como parte da string de conexão.

Veja também o comando interceptor, string de conexão, Conector/J, Conector/NET, interceptor, Java, Visual Studio.

replicação baseada em declarações: Uma forma de **replicação** em que declarações SQL são enviadas a partir da **fonte** e retransmitidas na **replica**. Requer algum cuidado com a configuração da opção `innodb_autoinc_lock_mode`, para evitar potenciais problemas de temporização com **bloqueio de auto-incremento**.

Veja também bloqueio de autoincremento, innodb_autoinc_lock_mode, replica, replicação, replicação baseada em linha, fonte.

estatísticas: Valores estimados relacionados a cada tabela e **índice** `InnoDB` **, usados para construir um plano de execução de consulta eficiente. Os principais valores são a **cardinalidade** (número de valores distintos) e o número total de linhas da tabela ou entradas de índice. As estatísticas da tabela representam os dados em seu **índice de chave primária**. As estatísticas de um **índice secundário** representam as linhas cobertas por esse índice.

Os valores são estimados em vez de contados com precisão, porque, em qualquer momento, diferentes **transações** podem inserir e excluir linhas da mesma tabela. Para evitar que os valores sejam recalculados frequentemente, você pode habilitar **estatísticas persistentes**, onde os valores são armazenados em tabelas do sistema `InnoDB` e atualizados apenas quando você emite uma declaração `ANALYZE TABLE`.

Você pode controlar como os valores **NULL** são tratados ao calcular estatísticas por meio da opção de configuração `innodb_stats_method`.

Outros tipos de estatísticas estão disponíveis para objetos de banco de dados e atividade de banco de dados através das tabelas **INFORMATION_SCHEMA** e **PERFORMANCE_SCHEMA**.

Veja também cardinalidade, índice, INFORMATION_SCHEMA, NULL, Performance Schema, estatísticas persistentes, chave primária, plano de execução de consulta, índice secundário, tabela, transação.

stemming: A capacidade de procurar diferentes variações de uma palavra com base em uma palavra raiz comum, como singular e plural, ou em tempos verbais do passado, presente e futuro. Esta funcionalidade é atualmente suportada na funcionalidade de **pesquisa de texto completo** em `MyISAM` **, mas não em índices FULLTEXT** para as tabelas em `InnoDB`.

Veja também pesquisa de texto completo, índice FULLTEXT.

stopword: Em um índice **FULLTEXT**, uma palavra que é considerada comum ou trivial o suficiente para ser omitida do **índice de pesquisa** e ignorada em consultas de pesquisa. Diferentes configurações controlam o processamento de stopwords para as tabelas `InnoDB` e `MyISAM`. Veja a Seção 14.9.4, “Stopwords Full-Text”, para detalhes.

Veja também índice FULLTEXT, índice de pesquisa.

motor de armazenamento: Um componente do banco de dados MySQL que realiza o trabalho de baixo nível de armazenamento, atualização e consulta de dados. Em MySQL 5.5 e superior, o **InnoDB** é o motor de armazenamento padrão para novas tabelas, substituindo `MyISAM`. Diferentes motores de armazenamento são projetados com diferentes compromissos entre fatores, como uso de memória versus uso de disco, velocidade de leitura versus velocidade de escrita e velocidade versus robustez. Cada motor de armazenamento gerencia tabelas específicas, então referenciamos as tabelas `InnoDB`, `MyISAM` e assim por diante.

O produto **MySQL Enterprise Backup** é otimizado para fazer backup de tabelas `InnoDB`. Ele também pode fazer backup de tabelas gerenciadas por `MyISAM` e outros motores de armazenamento.

Veja também InnoDB, MySQL Enterprise Backup, tipo de tabela.

coluna gerada armazenada: uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Os valores da coluna são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna gerada armazenada requer espaço de armazenamento e pode ser indexada.

Contrastando com a **coluna gerada virtualmente**.

Veja também coluna base, coluna gerada, coluna virtual gerada.

objeto armazenado: um programa ou visual armazenado.

programa armazenado: uma rotina armazenada (procedimento ou função), um gatilho ou um evento do Cronograma de Eventos.

procedimento armazenado: um procedimento ou função armazenada.

modo rigoroso: O nome geral para o ajuste controlado pela opção `innodb_strict_mode`. Ativação deste ajuste faz com que certas condições que normalmente são tratadas como avisos sejam consideradas erros. Por exemplo, certas combinações inválidas de opções relacionadas ao **formato do arquivo** e **formato da linha**, que normalmente produzem um aviso e continuam com os valores padrão, agora causam o `CREATE TABLE` falhar. `innodb_strict_mode` é ativado por padrão no MySQL 5.7.

O MySQL também tem algo chamado modo estrito. Veja a Seção 7.1.11, “Modos SQL do servidor”.

Veja também o formato de arquivo . See Also, innodb_strict_mode e formato de linha.

sublista: Dentro da estrutura da lista que representa o **buffer pool**, as páginas que são relativamente antigas e relativamente novas são representadas por diferentes partes da **lista**. Um conjunto de parâmetros controla o tamanho dessas partes e o ponto de divisão entre as páginas novas e antigas.

Veja também buffer pool, despejo, lista, LRU.

registro supremo: Um **pseudo-registro** em um índice, representando o **gap** acima do maior valor nesse índice. Se uma transação tiver uma declaração como `SELECT ... FROM ... WHERE col > 10 FOR UPDATE;`, e o maior valor na coluna for 20, é um bloqueio no registro supremo que impede outras transações de inserir valores ainda maiores, como 50, 100, e assim por diante.

Veja também gap, registro mínimo, pseudoregistro.

chave surogada: Nome sinônimo para **chave sintética**.

Veja também a chave sintética.

chave sintética: Uma coluna indexada, tipicamente uma **chave primária**, onde os valores são atribuídos arbitrariamente. Muitas vezes, isso é feito usando uma coluna de **auto-incremento**. Ao tratar o valor como completamente arbitrário, você pode evitar regras excessivamente restritivas e suposições de aplicação incorretas. Por exemplo, uma sequência numérica que representa os números de funcionários pode ter uma lacuna se um funcionário foi aprovado para contratação, mas nunca realmente se juntou. Ou o número de funcionários 100 pode ter uma data de contratação mais recente do que o número de funcionários 500, se eles saíram da empresa e mais tarde se juntaram novamente. Os valores numéricos também produzem valores mais curtos de comprimento previsível. Por exemplo, armazenar códigos numéricos que significam “Rodovia”, “Boulevard”, “Expressway”, e assim por diante é mais eficiente em termos de espaço do que repetir essas strings várias vezes.

Também conhecida como **chave suplente**. Contrasta com **chave natural**.

Veja também auto-incremento, chave natural, chave primária, chave surogada.

tabela do sistema: Um ou mais arquivos de dados (arquivos **ibdata**) que contêm os metadados para os objetos relacionados ao `InnoDB` e as áreas de armazenamento para o **buffer de mudança** e o **buffer de dupla escrita**. Também pode conter dados de tabela e índice para as tabelas `InnoDB` se as tabelas foram criadas no espaço de tabelas do sistema em vez de **espaços de tabela por arquivo** ou **espaços de tabelas gerais**. Os dados e metadados no espaço de tabelas do sistema aplicam-se a todos os **bancos de dados** em uma **instância** do MySQL.

Antes do MySQL 5.6.7, o padrão era manter todas as tabelas e índices `InnoDB` dentro do espaço de tabelas do sistema, o que frequentemente fazia com que esse arquivo se tornasse muito grande. Como o espaço de tabelas do sistema nunca se reduz, problemas de armazenamento poderiam surgir se grandes quantidades de dados temporários fossem carregados e depois excluídos. No MySQL 8.0, o padrão é o modo **arquivo por tabela**, onde cada tabela e seus índices associados são armazenados em um arquivo separado **.ibd**. Esse padrão facilita o uso das funcionalidades `InnoDB` que dependem dos formatos de linha `DYNAMIC` e `COMPRESSED`, como a compressão de tabela, o armazenamento eficiente de colunas fora da página e grandes prefixos de chaves de índice.

Manter todos os dados da tabela nos espaços de armazenamento de tabelas do sistema ou em arquivos separados `.ibd` tem implicações para a gestão de armazenamento em geral. O produto **MySQL Enterprise Backup** pode fazer backup de um pequeno conjunto de arquivos grandes ou muitos arquivos menores. Em sistemas com milhares de tabelas, as operações do sistema de arquivos para processar milhares de arquivos `.ibd` podem causar gargalos.

`InnoDB` introduziu espaços de tabelas gerais no MySQL 5.7.6, que também são representados por arquivos `.ibd`. Os espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe [`CREATE TABLESPACE`(create-tablespace.html "15.1.21 CREATE TABLESPACE Statement")]. Eles podem ser criados fora do diretório de dados, são capazes de conter múltiplas tabelas e suportam tabelas de todos os formatos de linha.

Veja também: buffer de alteração, compressão, dicionário de dados, banco de dados, buffer de escrita dupla, formato de linha dinâmico, arquivo por tabela, espaço de tabela geral, arquivo .ibd, arquivo ibdata, innodb_file_per_table, instância, MySQL Enterprise Backup, coluna fora da página, espaço de tabela, registro de desfazer.

### T

tabela: Cada tabela do MySQL está associada a um **motor de armazenamento** específico. As tabelas **InnoDB** têm características **físicas** e **lógicas** específicas que afetam o desempenho, a **escalabilidade**, o **backup**, a administração e o desenvolvimento de aplicações.

Em termos de armazenamento de arquivos, uma tabela `InnoDB` pertence a um dos seguintes tipos de espaço de tabela:

* O espaço de tabela `InnoDB` **compartilhado**, que é composto por um ou mais **arquivos ibdata**.

* Um espaço de tabela por arquivo, composto por um arquivo .ibd individual.

* Um espaço de tabela **geral compartilhado**, composto por um arquivo individual `.ibd`. Os espaços de tabela gerais foram introduzidos no MySQL 5.7.6.

Os arquivos de dados **`.ibd`** contêm dados de tabela e **índice**.

As tabelas `InnoDB` criadas em espaços de tabela por arquivo podem usar o formato de linha **DINÂMICO** ou **COMPREENSO**. Esses formatos de linha permitem recursos como `InnoDB`, como **compressão**, armazenamento eficiente de colunas **fora da página** e grandes prefixos de chaves de índice. Os espaços de tabela gerais suportam todos os formatos de linha.

O espaço de tabela do sistema suporta tabelas que utilizam os formatos de linha **REDUNDANTE**, **COMPACT** e **DINÂMICA**. O suporte para o formato de linha **DINÂMICA** foi adicionado no MySQL 5.7.6.

As **linhas** de uma tabela `InnoDB` são organizadas em uma estrutura de índice conhecida como **índice agrupado**, com entradas ordenadas com base nas colunas da chave primária da tabela. O acesso aos dados é otimizado para consultas que filtram e ordenam com base nas colunas da chave primária, e cada índice contém uma cópia das colunas da chave primária associadas a cada entrada. Modificar os valores de qualquer uma das colunas da chave primária é uma operação cara. Assim, um aspecto importante do projeto da tabela `InnoDB` é escolher uma chave primária com colunas que são usadas nas consultas mais importantes e manter a chave primária curta, com valores que raramente mudam.

Veja também backup, índice agrupado, formato de linha compacta, formato de linha comprimida, compressão, formato de linha dinâmico, criação de índice rápida, arquivo por tabela, arquivo .ibd, índice, coluna fora da página, chave primária, formato de linha redundante, linha, espaço de tabela do sistema, espaço de tabela.

bloqueio de tabela: um bloqueio que impede qualquer outra **transação** de acessar uma tabela. `InnoDB` faz um esforço considerável para tornar esses bloqueios desnecessários, usando técnicas como **DDL online**, **bloqueios de linha** e **leitura consistente** para processar **DML** e **consultas**. Você pode criar esse bloqueio através do SQL usando a declaração `LOCK TABLE`; um dos passos na migração de outros sistemas de banco de dados ou motores de armazenamento MySQL é remover essas declarações sempre que for possível.

Veja também leituras consistentes, DML, bloqueio, bloqueio de acesso, DDL online, consulta, bloqueio de linha, tabela, transação.

varredura de tabela: Veja a varredura completa da tabela.

estatísticas da tabela: Veja as estatísticas.

Tipo de tabela: Símbolo obsoleto para **motor de armazenamento**. Nos referimos às tabelas `InnoDB` e `MyISAM`, e assim por diante.

Veja também InnoDB, motor de armazenamento.

tablespace: Um arquivo de dados que pode armazenar dados para uma ou mais tabelas `InnoDB` e índices associados.

O **espaço de tabela do sistema** contém o dicionário de dados `InnoDB` e, antes do MySQL 5.6, contém todas as outras tabelas `InnoDB` por padrão.

A opção `innodb_file_per_table`, habilitada por padrão no MySQL 5.6 e superior, permite que as tabelas sejam criadas em seus próprios espaços de tabela. Os espaços de tabela por arquivo suportam recursos como armazenamento eficiente de colunas fora da página, compressão de tabela e espaços de tabela transportable. Veja a Seção 17.6.3.2, “Espaços de tabela por arquivo”, para detalhes.

`InnoDB` introduziu espaços de tabelas gerais no MySQL 5.7.6. Espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, são capazes de conter múltiplas tabelas e suportam tabelas de todos os formatos de linha.

O MySQL NDB Cluster também agrupa suas tabelas em espaços de tabela. Consulte a Seção 25.6.11.1, “Objetos de dados de disco do NDB Cluster”, para obter detalhes.

Veja também formato de linha compactada, dicionário de dados, arquivos de dados, arquivo por tabela, espaço de tabela geral, índice, innodb_file_per_table, espaço de tabela do sistema, tabela.

Tcl: Uma linguagem de programação originária do mundo de scripts Unix. Às vezes, estendida por código escrito em **C**, **C++** ou **Java**. Para a API de código aberto Tcl para MySQL, consulte a Seção 31.12, “API Tcl de MySQL”.

Veja também API.

tabela temporária: Uma **tabela** cujos dados não precisam ser verdadeiramente permanentes. Por exemplo, as tabelas temporárias podem ser usadas como áreas de armazenamento para resultados intermediários em cálculos ou transformações complicadas; esses dados intermediários não precisam ser recuperados após um acidente. Os produtos de banco de dados podem tomar vários atalhos para melhorar o desempenho das operações em tabelas temporárias, sendo menos escrupulosos sobre a escrita de dados em disco e outras medidas para proteger os dados em reinicializações.

Às vezes, os próprios dados são removidos automaticamente em um horário definido, como quando a transação termina ou quando a sessão termina. Com alguns produtos de banco de dados, a própria tabela é removida automaticamente também.

Veja também a tabela.

espaço de tabela temporário: `InnoDB` utiliza dois tipos de espaço de tabela temporário. *espaços de tabela temporários de sessão* armazenam tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador. O *espaço de tabela temporário global* armazena *segmentos de rollback* para alterações feitas em tabelas temporárias criadas pelo usuário.

Veja também global temporary tablespace, session temporary tablespace, tabela temporária.

coleção de texto: O conjunto de colunas incluído em um índice **FULLTEXT**.

Veja também o índice FULLTEXT.

TGS: Um servidor de concessão de ingressos Kerberos. TGS também pode se referir ao serviço de concessão de ingressos fornecido por um servidor de concessão de ingressos.

Veja também o servidor de concessão de ingressos.

TGT: Veja bilhete de concessão de bilhete.

unidade de processamento que, normalmente, é mais leve do que um **processo**, permitindo maior **concorrência**.

Veja também concorrência, thread mestre, processo, Pthreads.

servidor de emissão de ingressos: Em Kerberos, um servidor que fornece ingressos. O servidor de emissão de ingressos (TGS) combinado com um servidor de autenticação (AS) compõem um centro de distribuição de chaves (KDC).

TGS também pode se referir ao serviço de concessão de ingressos fornecido pelo servidor de concessão de ingressos.

Veja também servidor de autenticação, centro de distribuição de chaves.

bilhete de concessão de ticket: Em Kerberos, um bilhete de concessão de ticket é apresentado ao servidor de concessão de ticket (TGS) para obter tickets de serviço para o acesso ao serviço.

Veja também o servidor de concessão de ingressos.

Tomcat: Um servidor de aplicação **J2EE** de código aberto, que implementa as tecnologias de programação Java Servlet e JavaServer Pages. Composto por um servidor web e um contêiner de servlet Java. Com MySQL, tipicamente utilizado em conjunto com **Connector/J**.

Veja também J2EE.

página rasgada: Uma condição de erro que pode ocorrer devido a uma combinação de configuração do dispositivo de E/S e falha de hardware. Se os dados forem escritos em partes menores que o tamanho da página `InnoDB` (padrão, 16KB), uma falha de hardware durante a escrita pode resultar em apenas parte de uma página sendo armazenada no disco. O **buffer de dupla escrita** `InnoDB` protege contra essa possibilidade.

Veja também o buffer de escrita dupla.

TPS: Abreviação de “**transações** por segundo”, uma unidade de medida que às vezes é usada em benchmarks. Seu valor depende do **carga de trabalho** representado por um teste de benchmark específico, combinado com fatores que você controla, como a capacidade do hardware e a configuração do banco de dados.

Veja também transação, carga de trabalho.

transação: Transações são unidades atômicas de trabalho que podem ser **comprometidas** ou **desfeitas**. Quando uma transação faz múltiplas alterações no banco de dados, todas as alterações têm sucesso quando a transação é comprometida, ou todas as alterações são desfeitas quando a transação é desfeita.

As transações de banco de dados, conforme implementadas por `InnoDB`, possuem propriedades que são coletivamente conhecidas pelo acrônimo **ACID**, para atorodomia, consistência, isolamento e durabilidade.

Veja também ACID, commit, nível de isolamento, bloqueio, rollback.

ID da transação: Um campo interno associado a cada **linha**. Este campo é alterado fisicamente pelas operações `INSERT`, `UPDATE` e `DELETE` para registrar qual **transação** bloqueou a linha.

Veja também bloqueio implícito de linha, linha, transação.

compressão transparente da página: Uma característica adicionada no MySQL 5.7.8 que permite a compressão de nível de página para as tabelas `InnoDB` que residem em espaços de tabela por arquivo. A compressão de página é habilitada especificando o atributo `COMPRESSION` com `CREATE TABLE` ou `ALTER TABLE`. Para mais informações, consulte a Seção 17.9.2, “Compressão de Página InnoDB”.

Veja também arquivo por tabela, perfuração de buracos, arquivo esparso.

espaço de tabela transportable: Uma característica que permite que um **espaço de tabela** seja movido de uma instância para outra. Tradicionalmente, isso não foi possível para os espaços de tabela `InnoDB` porque todos os dados da tabela faziam parte do **espaço de tabela do sistema**. No MySQL 5.6 e versões posteriores, a sintaxe `FLUSH TABLES ... FOR EXPORT`(flush.html#flush-tables-for-export-with-list) prepara uma tabela `InnoDB` para cópia em outro servidor; executar `ALTER TABLE ... DISCARD TABLESPACE`(alter-table.html "15.1.9 ALTER TABLE Statement") e `ALTER TABLE ... IMPORT TABLESPACE`(alter-table.html "15.1.9 ALTER TABLE Statement") no outro servidor traz o arquivo de dados copiado para a outra instância. Um arquivo **.cfg** separado, copiado juntamente com o **.ibd**, é usado para atualizar o metadados da tabela (por exemplo, o **ID de espaço**) à medida que o espaço de tabela é importado. Consulte a Seção 17.6.1.3, “Importando Tabelas InnoDB”, para informações de uso.

Veja também o arquivo .cfg, o arquivo .ibd, o ID de espaço, o espaço de tabela do sistema, o espaço de tabela.

solução de problemas: O processo de determinar a origem de um problema. Alguns dos recursos para solucionar problemas do MySQL incluem:

* Seção 2.9.2.1, “Soluções para problemas ao iniciar o servidor MySQL”
* Seção 8.2.22, “Soluções para problemas ao se conectar ao MySQL”
* Seção B.3.3.2, “Como redefinir a senha do usuário root”
* Seção B.3.2, “Erros comuns ao usar programas MySQL”
* Seção 17.21, “Soluções para problemas do InnoDB”.

truncate: Uma operação de **DDL** que remove todo o conteúdo de uma tabela, mantendo a tabela e os índices relacionados intactos. Contrasta com **drop**. Embora conceitualmente tenha o mesmo resultado que uma declaração `DELETE` sem cláusula `WHERE`, opera de maneira diferente nos bastidores: `InnoDB` cria uma nova tabela vazia, exclui a tabela antiga e, em seguida, renomeia a nova tabela para ocupar o lugar da antiga. Como se trata de uma operação de DDL, não pode ser **desfeita**.

Se a tabela que está sendo truncada contiver **chaves estrangeiras** que fazem referência a outra tabela, a operação de truncação utiliza um método de operação mais lento, excluindo uma linha de cada vez, para que as linhas correspondentes na tabela referenciada possam ser excluídas conforme necessário por qualquer cláusula `ON DELETE CASCADE`. (O MySQL 5.5 e superior não permitem essa forma mais lenta de truncar e, em vez disso, retornam um erro se chaves estrangeiras estiverem envolvidas. Nesses casos, use uma declaração `DELETE` em vez disso.

Veja também DDL, drop, chave estrangeira, rollback.

truststore: Veja também SSL.

tupla: Um termo técnico que designa um conjunto ordenado de elementos. É uma noção abstrata, usada em discussões formais sobre a teoria de bancos de dados. No campo de bancos de dados, as tuplas são geralmente representadas pelas colunas de uma linha de tabela. Elas também podem ser representadas pelos conjuntos de resultados de consultas, por exemplo, consultas que recuperaram apenas algumas colunas de uma tabela, ou colunas de tabelas unidas.

Veja também cursor.

commit de dois estágios: Uma operação que faz parte de uma **transação distribuída**, de acordo com a especificação **XA**. (Às vezes abreviado como 2PC.) Quando várias bases de dados participam da transação, todas as bases de dados **commit** as alterações, ou todas as bases de dados **reverter** as alterações.

Veja também commit, rollback, transação, XA.

### U

desfazer: Dados que são mantidos ao longo da vida de uma **transação**, registrando todas as alterações para que possam ser desfeitas em caso de uma operação de **retorno**. Eles são armazenados em **registros de desfazer**, seja dentro do **espaço de tabelas do sistema** (no MySQL 5.7 ou versões anteriores) ou em espaços de tabelas de desfazer separados. A partir do MySQL 8.0, os registros de desfazer residem em espaços de tabelas de desfazer por padrão.

Veja também rollback, segmento de rollback, espaço de tabela do sistema, transação, registro de desfazer, espaço de tabela de desfazer.

desfazer buffer: Veja o registro de desfazer.

registro de desfazer: Uma área de armazenamento que contém cópias dos dados modificados por **transações ativas**. Se outra transação precisar ver os dados originais (como parte de uma operação de **leitura consistente**), os dados não modificados são recuperados dessa área de armazenamento.

Em MySQL 5.6 e MySQL 5.7, você pode usar a variável `innodb_undo_tablespaces` para que os registros de desfazer residam em **espaços de tabelas de desfazer**, que podem ser colocados em outro dispositivo de armazenamento, como um **SSD**. Em MySQL 8.0, os registros de desfazer residem em dois espaços de tabelas de desfazer padrão que são criados quando o MySQL é inicializado, e espaços de tabelas de desfazer adicionais podem ser criados usando a sintaxe [[`CREATE UNDO TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement")].

O registro de desfazer é dividido em porções separadas, o **buffer de desfazer de inserção** e o **buffer de desfazer de atualização**.

Veja também segmento de leitura consistente, segmento de desfazimento, SSD, espaço de tabela do sistema, transação, espaço de tabela de desfazer.

segmento de registro de desfazer: Uma coleção de **registros de desfazer**. Segmentos de registro de desfazer existem dentro de **segmentos de desfazimento**. Um segmento de registro de desfazer pode conter registros de desfazer de várias transações. Um segmento de registro de desfazer só pode ser usado por uma transação de cada vez, mas pode ser reutilizado após ser liberado na transação **commit** ou **desfazimento**. Também pode ser referido como um "segmento de desfazer".

Veja também commit, rollback, segmento de rollback, registro de desfazer.

undo tablespace: Um espaço de desfazer contém **registros de desfazer**. Os registros de desfazer existem dentro de **segmentos de registro de desfazer**, que estão contidos em **segmentos de rollback**. Os segmentos de rollback tradicionalmente residiram no espaço de tabelas do sistema. A partir do MySQL 5.6, os segmentos de rollback podem residir em espaços de desfazer. No MySQL 5.6 e no MySQL 5.7, o número de espaços de desfazer é controlado pela opção de configuração `innodb_undo_tablespaces`. No MySQL 8.0, dois espaços de desfazer padrão são criados quando a instância do MySQL é inicializada, e espaços de desfazer adicionais podem ser criados usando a sintaxe [[`CREATE UNDO TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement")].

Para mais informações, consulte a Seção 17.6.3.4, “Refazer Espaços de Tabela”.

Veja também segmento de rollback, espaço de tabela do sistema, registro de desfazer, segmento de registro de desfazer.

Unicode: Um sistema para suportar caracteres nacionais, conjuntos de caracteres, páginas de código e outros aspectos de internacionalização de forma flexível e padronizada.

O suporte a Unicode é um aspecto importante do padrão **ODBC**. O **Connector/ODBC** 5.1 é um driver Unicode, ao contrário do **Connector/ODBC** 3.51, que é um driver **ANSI**.

Veja também ANSI, Conector/ODBC, ODBC.

restrição única: Um tipo de **restrição** que afirma que uma coluna não pode conter quaisquer valores duplicados. Em termos de álgebra **relacional**, é usada para especificar relações 1-a-1. Para eficiência na verificação de se um valor pode ser inserido (ou seja, o valor não existe já na coluna), uma restrição única é suportada por um **índice único** subjacente.

Veja também restrição, índice relacional, índice único.

índice único: Um índice em uma coluna ou conjunto de colunas que possui uma **restrição única**. Como o índice é conhecido por não conter quaisquer valores duplicados, certos tipos de consultas e operações de contagem são mais eficientes do que no tipo normal de índice. A maioria das consultas contra este tipo de índice é simplesmente para determinar se um determinado valor existe ou não. O número de valores no índice é o mesmo que o número de linhas na tabela, ou pelo menos o número de linhas com valores não nulos para as colunas associadas.

A otimização de **alteração do buffer** não se aplica a índices únicos. Como uma solução alternativa, você pode definir temporariamente `unique_checks=0` enquanto realiza uma carga de dados em massa em uma tabela `InnoDB`.

Veja também cardinalidade, alteração de buffer, restrição única, chave única.

chave única: O conjunto de colunas (uma ou mais) que compõem um **índice único**. Quando você pode definir uma condição `WHERE` que corresponde exatamente a uma única linha, e a consulta pode usar um índice único associado, a pesquisa e o tratamento de erros podem ser realizados de forma muito eficiente.

Veja também cardinalidade, restrição única, índice único.

UPN: Veja o nome principal do usuário.

nome principal do usuário: O nome para uma entidade nomeada Kerberos que representa um usuário.

Veja também principal.

### V

tipo de comprimento variável: um tipo de dados de comprimento variável. Os tipos `VARCHAR`, `VARBINARY` e `BLOB` e `TEXT` são tipos de comprimento variável.

`InnoDB` trata campos de comprimento fixo maiores ou iguais a 768 bytes como campos de comprimento variável, que podem ser armazenados **fora da página**. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

Veja também a coluna fora da página, página de excesso.

vítima: A **transação** que é automaticamente escolhida para ser **desfeita** quando um **bloqueio** é detectado. `InnoDB` desfaz a transação que atualizou o menor número de linhas.

A detecção de ponto morto pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

Veja também: bloqueio, detecção de bloqueio, innodb_lock_wait_timeout, transação.

visão: Uma consulta armazenada que, quando invocada, produz um conjunto de resultados. Uma visão age como uma tabela virtual.

coluna virtual: Veja a coluna virtual gerada.

coluna gerada virtualmente: Uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Os valores da coluna não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna gerada virtualmente não requer armazenamento. `InnoDB` suporta índices secundários em colunas geradas virtualmente.

Contrastando com a **coluna gerada armazenada**.

Veja também coluna base, coluna gerada, coluna gerada armazenada.

índice virtual: um índice virtual é um **índice secundário** em uma ou mais **colunas geradas virtualmente** ou em uma combinação de colunas geradas virtualmente e colunas regulares ou colunas geradas armazenadas. Para mais informações, consulte a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

Veja também índice secundário, coluna gerada armazenada, coluna gerada virtual.

Visual Studio: Para as versões compatíveis do Visual Studio, consulte as referências a seguir:

* Connector/NET: Versões do Connector/NET
* Connector/C++ 8.0: Suporte à plataforma e pré-requisitos

Veja também Connector/C++, Connector/NET.

### W

esperar: Quando uma operação, como a aquisição de um **bloqueio**, **mutex** ou **latch**, não pode ser concluída imediatamente, `InnoDB` pausa e tenta novamente. O mecanismo para a pausa é elaborado o suficiente para que essa operação tenha seu próprio nome, o **esperar**. Os threads individuais são pausados usando uma combinação de agendamento interno `InnoDB`, chamadas do sistema operacional `wait()` e loops de **rotação** de curta duração.

Em sistemas com carga pesada e muitas transações, você pode usar o resultado do comando `SHOW INNODB STATUS` ou o **Performance Schema** para determinar se os threads estão gastando muito tempo esperando e, se sim, como você pode melhorar a **concorrência**.

Veja também concorrência, trava, bloqueio, mútuo, Schema de desempenho, spin.

backup quente: Um **backup** feito enquanto o banco de dados está em execução, mas que restringe algumas operações do banco de dados durante o processo de backup. Por exemplo, as tabelas podem tornar-se somente de leitura. Para aplicações e sites ocupados, você pode preferir um **backup quente**.

Veja também backup, backup frio e backup quente.

aquecer: Para executar um sistema sob uma carga de trabalho típica por algum tempo após a inicialização, para que o **buffer pool** e outras regiões de memória sejam preenchidas como o que aconteceria em condições normais. Esse processo acontece naturalmente ao longo do tempo quando um servidor MySQL é reiniciado ou submetido a uma nova carga de trabalho.

Normalmente, você executa uma carga de trabalho por algum tempo para aquecer o pool de buffer antes de executar testes de desempenho, para garantir resultados consistentes em várias execuções; caso contrário, o desempenho pode ser artificialmente baixo durante a primeira execução.

Em MySQL 5.6, você pode acelerar o processo de aquecimento ao habilitar as opções de configuração `innodb_buffer_pool_dump_at_shutdown` e `innodb_buffer_pool_load_at_startup`, para trazer o conteúdo do buffer pool de volta à memória após um reinício. Essas opções são habilitadas por padrão no MySQL 5.7. Veja a Seção 17.8.3.6, “Salvar e restaurar o estado do buffer pool”.

Veja também buffer pool, carga de trabalho.

carga de trabalho: A combinação e o volume de operações **SQL** e outras operações de banco de dados, realizadas por um aplicativo de banco de dados durante o uso típico ou de pico. Você pode submeter o banco de dados a uma carga de trabalho específica durante testes de desempenho para identificar **obstáculos**, ou durante o planejamento de capacidade.

Veja também gargalo, CPU-bound, disco-bound, SQL.

escrever combinando: Uma técnica de otimização que reduz as operações de escrita quando as **páginas sujas** são **limpadas** do **buffer pool** do `InnoDB`. Se uma linha em uma página for atualizada várias vezes ou várias linhas na mesma página forem atualizadas, todas essas alterações são armazenadas nos arquivos de dados em uma única operação de escrita, em vez de uma escrita para cada alteração.

Veja também: buffer pool, página suja, esvaziar.

### X

XA: Uma interface padrão para coordenar **transações distribuídas**, permitindo que múltiplos bancos de dados participem de uma transação enquanto mantêm a conformidade **ACID**. Para obter detalhes completos, consulte a Seção 15.3.8, “Transações XA”.

O suporte a Transação Distribuída XA é ativado por padrão.

Veja também ACID, log binário, compromisso, transação, compromisso de duas fases.

### Y

jovem: Uma característica de uma **página** no `InnoDB` **buffer pool**, o que significa que ela foi acessada recentemente, e, portanto, é movida dentro da estrutura de dados do buffer pool, para que não seja **limpa** muito cedo pelo algoritmo **LRU**. Este termo é usado em alguns nomes de colunas do **INFORMATION_SCHEMA** de tabelas relacionadas ao buffer pool.

Veja também buffer pool, esvaziar, INFORMATION_SCHEMA, LRU, página.