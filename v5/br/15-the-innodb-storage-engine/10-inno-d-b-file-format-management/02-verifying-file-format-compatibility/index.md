### 14.10.2 Verificando a Compatibilidade do File Format

14.10.2.1 Verificação de Compatibilidade Quando o InnoDB é Iniciado

14.10.2.2 Verificação de Compatibilidade Quando uma Table é Aberta

O InnoDB incorpora várias verificações para proteger contra possíveis crashes e corrupções de dados que podem ocorrer se você executar uma release antiga do servidor MySQL em arquivos de dados do InnoDB que usam um File Format mais novo. Essas verificações ocorrem quando o servidor é iniciado e quando você acessa uma Table pela primeira vez. Esta seção descreve essas verificações, como você pode controlá-las e as condições de erro e aviso que podem surgir.

#### Compatibilidade Retroativa

Você só precisa considerar a compatibilidade retroativa do File Format ao usar uma versão recente do InnoDB (MySQL 5.5 e superior com InnoDB) juntamente com uma versão mais antiga (MySQL 5.1 ou anterior, usando o InnoDB integrado em vez do InnoDB Plugin). Para minimizar a chance de problemas de compatibilidade, você pode padronizar o uso do InnoDB Plugin em todos os seus servidores Database MySQL 5.1 e anteriores.

Em geral, uma versão mais nova do InnoDB pode criar uma Table ou Index que não pode ser lida ou escrita com segurança por uma versão mais antiga do InnoDB sem risco de crashes, travamentos (hangs), resultados incorretos ou corrupções. O InnoDB inclui um mecanismo para proteger contra essas condições e para ajudar a preservar a compatibilidade entre arquivos de Database e versões do InnoDB. Esse mecanismo permite que você aproveite alguns novos recursos de uma release do InnoDB (como melhorias de performance e correções de bug), e ainda preserve a opção de usar seu Database com uma versão antiga do InnoDB, prevenindo o uso acidental de novos recursos que criam arquivos de disco incompatíveis com versões anteriores.

Se uma versão do InnoDB suporta um File Format específico (independentemente de esse formato ser o padrão ou não), você pode realizar Query e Update em qualquer Table que exija esse formato ou um formato anterior. Somente a criação de novas Tables usando novos recursos é limitada com base no File Format específico habilitado. Por outro lado, se um Tablespace contém uma Table ou Index que usa um File Format não suportado, ele não poderá ser acessado de forma alguma, nem mesmo para acesso de leitura (read access).

A única maneira de fazer o “downgrade” de um Tablespace do InnoDB para o File Format Antelope anterior é copiando os dados para uma nova Table, em um Tablespace que use o formato anterior.

A maneira mais fácil de determinar o File Format de um Tablespace InnoDB existente é examinar as propriedades da Table que ele contém, usando o comando `SHOW TABLE STATUS` ou consultando a Table `INFORMATION_SCHEMA.TABLES`. Se o `Row_format` da Table for reportado como `'Compressed'` ou `'Dynamic'`, o Tablespace que contém a Table suporta o formato Barracuda.

#### Detalhes Internos

Cada Tablespace *file-per-table* do InnoDB (representado por um arquivo `*.ibd`) é rotulado com um identificador de File Format. O system tablespace (representado pelos arquivos `ibdata`) é marcado com o File Format “mais alto” em uso em um grupo de arquivos Database do InnoDB, e essa marca é verificada quando os arquivos são abertos.

A criação de uma Table compactada, ou de uma Table com `ROW_FORMAT=DYNAMIC`, atualiza o file header do arquivo `.ibd` *file-per-table* correspondente e o tipo de Table no data dictionary do InnoDB com o identificador para o File Format Barracuda. A partir desse ponto, a Table não pode ser usada com uma versão do InnoDB que não suporte o File Format Barracuda. Para proteger contra comportamento anômalo, o InnoDB realiza uma verificação de compatibilidade quando a Table é aberta. (Em muitos casos, o comando `ALTER TABLE` recria uma Table e, portanto, altera suas propriedades. O caso especial de adicionar ou remover Indexes sem reconstruir a Table é descrito na Seção 14.13.1, “Online DDL Operations”.)

Os General Tablespaces, que também são representados por um arquivo `*.ibd`, suportam os File Formats Antelope e Barracuda. Para obter mais informações sobre General Tablespaces, consulte a Seção 14.6.3.3, “General Tablespaces”.

#### Definição de ib-file set

Para evitar confusão, para os propósitos desta discussão, definimos o termo “ib-file set” como o conjunto de arquivos do sistema operacional que o InnoDB gerencia como uma unidade. O ib-file set inclui os seguintes arquivos:

* O system tablespace (um ou mais arquivos `ibdata`) que contêm informações internas do sistema (incluindo catálogos internos e informações de undo) e podem incluir dados de usuário e Indexes.
* Zero ou mais single-table tablespaces (também chamados de arquivos “file per table”, nomeados arquivos `*.ibd`).
* Arquivos de Log do InnoDB; geralmente dois, `ib_logfile0` e `ib_logfile1`. Usados para crash recovery e em Backups.

Um “ib-file set” não inclui os arquivos `.frm` correspondentes que contêm Metadata sobre Tables do InnoDB. Os arquivos `.frm` são criados e gerenciados pelo MySQL e, às vezes, podem ficar dessincronizados com o Metadata interno no InnoDB.

Múltiplas Tables, mesmo de mais de um Database, podem ser armazenadas em um único “ib-file set”. (No MySQL, um “database” é uma coleção lógica de Tables, o que outros sistemas se referem como um “schema” ou “catalog”.)