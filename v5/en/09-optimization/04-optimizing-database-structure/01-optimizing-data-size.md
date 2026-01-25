### 8.4.1 Otimizando o Tamanho dos Dados

Projete suas tabelas para minimizar seu espaço em disco. Isso pode resultar em grandes melhorias ao reduzir a quantidade de dados gravados e lidos do disco. Tabelas menores normalmente exigem menos memória principal enquanto seu conteúdo é ativamente processado durante a execução de Querys. Qualquer redução de espaço para dados de tabela também resulta em Indexes menores que podem ser processados mais rapidamente.

O MySQL suporta muitos *storage engines* (tipos de tabela) e formatos de linha diferentes. Para cada tabela, você pode decidir qual método de armazenamento (*storage*) e Indexação usar. Escolher o formato de tabela adequado para sua aplicação pode proporcionar um grande ganho de performance. Consulte o Capítulo 14, *The InnoDB Storage Engine*, e o Capítulo 15, *Alternative Storage Engines*.

Você pode obter melhor performance para uma tabela e minimizar o espaço de armazenamento usando as técnicas listadas aqui:

*   Colunas da Tabela
*   Formato de Linha (*Row Format*)
*   Indexes
*   Joins
*   Normalização

#### Colunas da Tabela

*   Use os tipos de dados mais eficientes (menores) possível. O MySQL possui muitos tipos especializados que economizam espaço em disco e memória. Por exemplo, use os tipos inteiros menores, se possível, para obter tabelas menores. `MEDIUMINT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) é frequentemente uma escolha melhor do que `INT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) porque uma coluna `MEDIUMINT` usa 25% menos espaço.

*   Declare colunas como `NOT NULL` se possível. Isso torna as operações SQL mais rápidas, permitindo um melhor uso de Indexes e eliminando a sobrecarga para testar se cada valor é `NULL`. Você também economiza algum espaço de armazenamento, um bit por coluna. Se você realmente precisa de valores `NULL` em suas tabelas, use-os. Apenas evite a configuração padrão que permite valores `NULL` em todas as colunas.

#### Formato de Linha (*Row Format*)

*   As tabelas `InnoDB` são criadas usando o formato de linha `DYNAMIC` por padrão. Para usar um formato de linha diferente de `DYNAMIC`, configure `innodb_default_row_format` ou especifique explicitamente a opção `ROW_FORMAT` em uma instrução `CREATE TABLE` ou `ALTER TABLE`.

*   A família compacta de formatos de linha, que inclui `COMPACT`, `DYNAMIC` e `COMPRESSED`, diminui o espaço de armazenamento da linha ao custo de aumentar o uso da CPU para algumas operações. Se sua carga de trabalho for típica e limitada pelas taxas de *cache hit* e velocidade do disco, é provável que seja mais rápida. Se for um caso raro limitado pela velocidade da CPU, pode ser mais lenta.

*   A família compacta de formatos de linha também otimiza o armazenamento de colunas `CHAR` ao usar um conjunto de caracteres de comprimento variável, como `utf8mb3` ou `utf8mb4`. Com `ROW_FORMAT=REDUNDANT`, `CHAR(N)` ocupa *`N`* × o comprimento máximo de byte do conjunto de caracteres. Muitos idiomas podem ser escritos principalmente usando caracteres `utf8` de byte único, portanto, um comprimento de armazenamento fixo frequentemente desperdiça espaço. Com a família compacta de formatos de linha, o `InnoDB` aloca uma quantidade variável de armazenamento no intervalo de *`N`* a *`N`* × o comprimento máximo de byte do conjunto de caracteres para essas colunas, removendo espaços à direita (*trailing spaces*). O comprimento mínimo de armazenamento é *`N`* bytes para facilitar atualizações *in-place* em casos típicos. Para mais informações, consulte a Seção 14.11, “InnoDB Row Formats”.

*   Para minimizar ainda mais o espaço, armazenando dados da tabela em formato compactado, especifique `ROW_FORMAT=COMPRESSED` ao criar tabelas `InnoDB`, ou execute o comando **myisampack** em uma tabela `MyISAM` existente. (Tabelas compactadas `InnoDB` são legíveis e graváveis, enquanto tabelas compactadas `MyISAM` são somente leitura.)

*   Para tabelas `MyISAM`, se você não tiver nenhuma coluna de comprimento variável (`VARCHAR`, `TEXT` ou `BLOB`), um formato de linha de tamanho fixo será usado. Isso é mais rápido, mas pode desperdiçar algum espaço. Consulte a Seção 15.2.3, “MyISAM Table Storage Formats”. Você pode sugerir que deseja ter linhas de comprimento fixo, mesmo que tenha colunas `VARCHAR`, usando a opção `CREATE TABLE` `ROW_FORMAT=FIXED`.

#### Indexes

*   O Primary Index de uma tabela deve ser o mais curto possível. Isso torna a identificação de cada linha fácil e eficiente. Para tabelas `InnoDB`, as colunas da Primary Key são duplicadas em cada entrada de Secondary Index, então uma Primary Key curta economiza um espaço considerável se você tiver muitos Secondary Indexes.

*   Crie apenas os Indexes de que você precisa para melhorar a performance da Query. Indexes são bons para recuperação, mas lentificam as operações de *insert* e *update*. Se você acessa uma tabela principalmente pesquisando em uma combinação de colunas, crie um único Index composto nelas, em vez de um Index separado para cada coluna. A primeira parte do Index deve ser a coluna mais utilizada. Se você *sempre* usa muitas colunas ao selecionar na tabela, a primeira coluna no Index deve ser aquela com mais duplicatas, para obter melhor compactação do Index.

*   Se for muito provável que uma coluna de string longa tenha um prefixo exclusivo no primeiro número de caracteres, é melhor indexar apenas este prefixo, usando o suporte do MySQL para criar um Index na parte mais à esquerda da coluna (consulte a Seção 13.1.14, “CREATE INDEX Statement”). Indexes mais curtos são mais rápidos, não apenas porque exigem menos espaço em disco, mas também porque fornecem mais *hits* no *index cache* e, consequentemente, menos *disk seeks*. Consulte a Seção 5.1.1, “Configuring the Server”.

#### Joins

*   Em algumas circunstâncias, pode ser benéfico dividir em duas uma tabela que é escaneada com muita frequência. Isso é especialmente verdadeiro se for uma tabela de formato dinâmico e for possível usar uma tabela de formato estático menor que possa ser usada para encontrar as linhas relevantes ao escanear a tabela.

*   Declare colunas com informações idênticas em tabelas diferentes com tipos de dados idênticos, para acelerar Joins baseados nas colunas correspondentes.

*   Mantenha os nomes das colunas simples, para que você possa usar o mesmo nome em diferentes tabelas e simplificar as Querys de Join. Por exemplo, em uma tabela chamada `customer`, use um nome de coluna `name` em vez de `customer_name`. Para tornar seus nomes portáteis para outros servidores SQL, considere mantê-los com menos de 18 caracteres.

#### Normalização

*   Normalmente, tente manter todos os dados não redundantes (observando o que é referido na teoria de Database como terceira forma normal). Em vez de repetir valores longos, como nomes e endereços, atribua-lhes IDs exclusivos, repita esses IDs conforme necessário em várias tabelas menores e faça o Join das tabelas em Querys referenciando os IDs na cláusula JOIN.

*   Se a velocidade for mais importante do que o espaço em disco e os custos de manutenção de manter múltiplas cópias de dados, por exemplo, em um cenário de *business intelligence* onde você analisa todos os dados de tabelas grandes, você pode flexibilizar as regras de normalização, duplicando informações ou criando tabelas de resumo para ganhar mais velocidade.