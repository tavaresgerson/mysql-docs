### 10.4.1 Otimizando o Tamanho dos Dados

Projete suas tabelas para minimizar o espaço delas no disco. Isso pode resultar em melhorias significativas ao reduzir a quantidade de dados escritos e lidos do disco. Tabelas menores normalmente requerem menos memória principal enquanto seus conteúdos estão sendo processados ativamente durante a execução da consulta. Qualquer redução de espaço para os dados da tabela também resulta em índices menores que podem ser processados mais rapidamente.

O MySQL suporta muitos tipos de armazenamento (tipos de tabela) e formatos de linha. Para cada tabela, você pode decidir qual método de armazenamento e indexação usar. Escolher o formato de tabela adequado para sua aplicação pode lhe proporcionar um grande ganho de desempenho. Veja o Capítulo 17, *O Motor de Armazenamento InnoDB*, e o Capítulo 18, *Motores de Armazenamento Alternativos*.

Você pode obter um melhor desempenho para uma tabela e minimizar o espaço de armazenamento usando as técnicas listadas aqui:

* Colunas da Tabela
* Formato da Linha
* Índices
* Conexões
* Normalização

#### Colunas da Tabela

* Use os tipos de dados mais eficientes (menores) possíveis. O MySQL tem muitos tipos especializados que economizam espaço no disco e memória. Por exemplo, use os tipos de inteiro menores se possível para obter tabelas menores. `MEDIUMINT` - (`INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) é frequentemente uma melhor escolha do que `INT` - (`INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) porque uma coluna `MEDIUMINT` - (`INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) usa 25% menos espaço.
* Declare as colunas como `NOT NULL` se possível. Isso torna as operações SQL mais rápidas, permitindo um melhor uso de índices e eliminando o overhead para testar se cada valor é `NULL`. Você também economiza algum espaço de armazenamento, um bit por coluna. Se você realmente precisar de valores `NULL` em suas tabelas, use-os. Apenas evite a configuração padrão que permite valores `NULL` em todas as colunas.

#### Formato da Linha

As tabelas `InnoDB` são criadas usando o formato de linha `DYNAMIC` por padrão. Para usar um formato de linha diferente de `DYNAMIC`, configure `innodb_default_row_format` ou especifique a opção `ROW_FORMAT` explicitamente em uma instrução `CREATE TABLE` ou `ALTER TABLE`.

A família compacta de formatos de linha, que inclui `COMPACT`, `DYNAMIC` e `COMPRESSED`, diminui o espaço de armazenamento de linhas em detrimento do aumento do uso da CPU para algumas operações. Se sua carga de trabalho for típica e limitada pelas taxas de acerto de cache e pela velocidade do disco, provavelmente será mais rápida. Se for um caso raro que é limitado pela velocidade da CPU, pode ser mais lento.

A família compacta de formatos de linhas também otimiza o armazenamento de colunas `CHAR` ao usar um conjunto de caracteres de comprimento variável, como `utf8mb3` ou `utf8mb4`. Com `ROW_FORMAT=REDUNDANT`, `CHAR(N)` ocupa *`N`* × o comprimento máximo de byte do conjunto de caracteres. Muitas línguas podem ser escritas principalmente usando caracteres `utf8mb3` ou `utf8mb4` de um único byte, então um comprimento de armazenamento fixo muitas vezes desperdiça espaço. Com a família compacta de formatos de linhas, o `InnoDB` aloca uma quantidade variável de armazenamento na faixa de *`N`* a *`N`* × o comprimento máximo de byte do conjunto de caracteres para essas colunas, removendo espaços finais. O comprimento mínimo de armazenamento é de *`N`* bytes para facilitar atualizações in-place em casos típicos. Para mais informações, consulte a Seção 17.10, “Formatos de Linha InnoDB”.
* Para minimizar ainda mais o espaço, armazenando os dados da tabela em formato comprimido, especifique `ROW_FORMAT=COMPRESSED` ao criar tabelas `InnoDB`, ou execute o comando  `myisampack` em uma tabela `MyISAM` existente. (`Tabelas `InnoDB` comprimidas são legíveis e graváveis, enquanto tabelas `MyISAM` comprimidas são apenas de leitura.`)
* Para tabelas `MyISAM`, se você não tiver colunas de comprimento variável (colunas `VARCHAR`, `TEXT` ou `BLOB`), um formato de linha de tamanho fixo é usado. Isso é mais rápido, mas pode desperdiçar algum espaço. Veja a Seção 18.2.3, “Formatos de Armazenamento de Tabelas `MyISAM`”. Você pode indicar que deseja ter linhas de comprimento fixo, mesmo que tenha colunas `VARCHAR` com a opção `CREATE TABLE` `ROW_FORMAT=FIXED`.

#### Índices

* O índice primário de uma tabela deve ser o mais curto possível. Isso facilita e torna eficiente a identificação de cada linha. Para tabelas `InnoDB`, as colunas da chave primária são duplicadas em cada entrada do índice secundário, portanto, um índice primário curto economiza um espaço considerável se você tiver muitos índices secundários.
* Crie apenas os índices que você precisa para melhorar o desempenho das consultas. Os índices são bons para a recuperação, mas desaceleram as operações de inserção e atualização. Se você acessar uma tabela principalmente pesquisando em uma combinação de colunas, crie um único índice composto sobre elas, em vez de um índice separado para cada coluna. A primeira parte do índice deve ser a coluna mais usada. Se você *sempre* usar muitas colunas ao selecionar da tabela, a primeira coluna no índice deve ser a que tem mais duplicatas, para obter uma melhor compressão do índice.
* Se é muito provável que uma coluna de string longa tenha um prefixo único no primeiro número de caracteres, é melhor indexar apenas esse prefixo, usando o suporte do MySQL para criar um índice na parte mais à esquerda da coluna (veja  Seção 15.1.15, “Instrução CREATE INDEX”). Índices mais curtos são mais rápidos, não apenas porque requerem menos espaço em disco, mas também porque também lhe dão mais hits no cache do índice, e assim menos buscas em disco. Veja Seção 7.1.1, “Configurando o Servidor”.
#### Joins
*

* Em algumas circunstâncias, pode ser benéfico dividir uma tabela que é escaneada com frequência. Isso é especialmente verdadeiro se for uma tabela de formato dinâmico e for possível usar uma tabela de formato estático menor que possa ser usada para encontrar as linhas relevantes ao escanear a tabela.
* Declare colunas com informações idênticas em diferentes tabelas com tipos de dados idênticos, para acelerar as junções baseadas nas colunas correspondentes.
* Mantenha os nomes das colunas simples, para que você possa usar o mesmo nome em diferentes tabelas e simplificar as consultas de junção. Por exemplo, em uma tabela chamada `cliente`, use um nome de coluna de `nome` em vez de `cliente_nome`. Para tornar seus nomes portáteis para outros servidores SQL, considere mantê-los mais curtos que 18 caracteres.

#### Normalização

* Normalmente, tente manter todos os dados não redundantes (observando o que é referido na teoria de bancos de dados como terceira forma normal). Em vez de repetir valores longos como nomes e endereços, atribua-lhes IDs únicos, repita esses IDs conforme necessário em múltiplas tabelas menores e faça a junção das tabelas em consultas referenciando os IDs na cláusula de junção.
* Se a velocidade for mais importante que o espaço em disco e os custos de manutenção de múltiplas cópias de dados, por exemplo, em um cenário de business intelligence onde você analisa todos os dados de grandes tabelas, você pode relaxar as regras de normalização, duplicando informações ou criando tabelas resumidas para ganhar mais velocidade.