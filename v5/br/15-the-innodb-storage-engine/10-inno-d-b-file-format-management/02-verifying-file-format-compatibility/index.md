### 14.10.1 Verificar a compatibilidade com o formato de arquivo

14.10.2.1 Verificação de compatibilidade quando o InnoDB é iniciado

14.10.2.2 Verificação de compatibilidade ao abrir uma tabela

O InnoDB incorpora vários mecanismos de verificação para evitar possíveis falhas e corrupções de dados que podem ocorrer se você executar uma versão antiga do servidor MySQL em arquivos de dados do InnoDB que utilizam um formato de arquivo mais recente. Esses mecanismos de verificação ocorrem quando o servidor é iniciado e quando você acessa uma tabela pela primeira vez. Esta seção descreve esses mecanismos de verificação, como você pode controlá-los e as condições de erro e aviso que podem surgir.

#### Compatibilidade Retroativa

Você só precisa considerar a compatibilidade com o formato de arquivo antigo ao usar uma versão recente do InnoDB (MySQL 5.5 e superior com InnoDB) ao lado de uma versão mais antiga (MySQL 5.1 ou anterior, com o InnoDB embutido em vez do Plugin InnoDB). Para minimizar a chance de problemas de compatibilidade, você pode padronizar o Plugin InnoDB para todos os servidores de banco de dados MySQL 5.1 e anteriores.

Em geral, uma versão mais recente do InnoDB pode criar uma tabela ou índice que não pode ser lida ou escrita com segurança com uma versão mais antiga do InnoDB sem o risco de falhas, travamentos, resultados errados ou corrupções. O InnoDB inclui um mecanismo para proteger contra essas condições e ajudar a preservar a compatibilidade entre arquivos de banco de dados e versões do InnoDB. Esse mecanismo permite que você aproveite algumas novas funcionalidades de uma versão do InnoDB (como melhorias de desempenho e correções de bugs) e ainda preserve a opção de usar seu banco de dados com uma versão antiga do InnoDB, impedindo o uso acidental de novas funcionalidades que criam arquivos de disco incompatíveis para versões anteriores.

Se uma versão do InnoDB suportar um determinado formato de arquivo (independentemente de esse formato ser o padrão ou não), você pode consultar e atualizar qualquer tabela que exija esse formato ou um formato anterior. Apenas a criação de novas tabelas usando novas funcionalidades é limitada com base no formato de arquivo específico habilitado. Por outro lado, se um espaço de tabelas contiver uma tabela ou índice que use um formato de arquivo que não é suportado, ele não poderá ser acessado, mesmo para acesso de leitura.

A única maneira de "baixar" o espaço de tabela InnoDB para o formato de arquivo Antelope anterior é copiar os dados para uma nova tabela, em um espaço de tabela que use o formato anterior.

A maneira mais fácil de determinar o formato de arquivo de um espaço de tabelas existente do InnoDB é examinar as propriedades da tabela que ele contém, usando o comando `SHOW TABLE STATUS` ou consultando a tabela `INFORMATION_SCHEMA.TABLES`. Se o `Row_format` da tabela for relatado como `'Compressed'` ou `'Dynamic'`, o espaço de tabelas que contém a tabela suporta o formato Barracuda.

#### Detalhes internos

Cada espaço de tabela InnoDB por arquivo (representado por um arquivo `*.ibd`) é rotulado com um identificador de formato de arquivo. O espaço de tabela do sistema (representado pelos arquivos `ibdata`) é marcado com o formato de arquivo “mais alto” em uso em um grupo de arquivos de banco de dados InnoDB, e essa marcação é verificada quando os arquivos são abertos.

Ao criar uma tabela compactada ou uma tabela com `ROW_FORMAT=DYNAMIC`, você atualiza o cabeçalho do arquivo do arquivo `.ibd` correspondente por tabela e o tipo de tabela no dicionário de dados do InnoDB com o identificador do formato de arquivo Barracuda. A partir desse ponto, a tabela não pode ser usada com uma versão do InnoDB que não suporte o formato de arquivo Barracuda. Para proteger contra comportamento anômalo, o InnoDB realiza uma verificação de compatibilidade quando a tabela é aberta. (Em muitos casos, a instrução `ALTER TABLE` recria uma tabela e, portanto, altera suas propriedades. O caso especial de adicionar ou excluir índices sem reconstruir a tabela é descrito na Seção 14.13.1, “Operações DDL Online”.)

Os espaços de tabelas gerais, que também são representados por um arquivo `*.ibd`, suportam tanto o formato de arquivo Antelope quanto o formato de arquivo Barracuda. Para obter mais informações sobre espaços de tabelas gerais, consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

#### Definição do conjunto de arquivos ib

Para evitar confusões, para os fins desta discussão, definimos o termo "conjunto de arquivos ib" como o conjunto de arquivos do sistema operacional que o InnoDB gerencia como uma unidade. O conjunto de arquivos ib inclui os seguintes arquivos:

- O espaço de tabela do sistema (um ou mais arquivos `ibdata`) que contêm informações internas do sistema (incluindo catálogos internos e informações de desfazer) e podem incluir dados de usuário e índices.

- Espaços de tabelas de uma única tabela (também chamados de "arquivos por tabela", com nomes de arquivos `*.ibd`).

- Arquivos de log do InnoDB; geralmente dois, `ib_logfile0` e `ib_logfile1`. Usados para recuperação em caso de falha e em backups.

Um conjunto de arquivos `ib` não inclui os arquivos `.frm` correspondentes que contêm metadados sobre as tabelas do InnoDB. Os arquivos `.frm` são criados e gerenciados pelo MySQL e, às vezes, podem ficar desatualizados em relação aos metadados internos do InnoDB.

Várias tabelas, mesmo de mais de um banco de dados, podem ser armazenadas em um único conjunto de arquivos ib. (No MySQL, um "banco de dados" é uma coleção lógica de tabelas, o que outros sistemas referem como um "esquema" ou "catálogo").
