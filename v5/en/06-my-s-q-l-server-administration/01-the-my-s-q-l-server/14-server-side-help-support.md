### 5.1.14 Suporte à Ajuda (Help) do Lado do Servidor

O MySQL Server suporta uma instrução [`HELP`](help.html "13.8.3 HELP Statement") que retorna informações do Manual de Referência do MySQL (consulte a [Seção 13.8.3, “HELP Statement”](help.html "13.8.3 HELP Statement")). Essa informação é armazenada em diversas tabelas no Database `mysql` (consulte a [Seção 5.3, “The mysql System Database”](system-schema.html "5.3 The mysql System Database")). A operação adequada da instrução [`HELP`](help.html "13.8.3 HELP Statement") exige que essas tabelas de ajuda sejam inicializadas.

Para uma nova instalação do MySQL usando uma distribution binária ou de source no Unix, a inicialização do conteúdo das tabelas de ajuda ocorre quando você inicializa o data directory (consulte a [Seção 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")). Para uma distribution RPM no Linux ou uma distribution binária no Windows, a inicialização do conteúdo ocorre como parte do processo de instalação do MySQL.

Para um upgrade do MySQL usando uma distribution binária, o conteúdo das tabelas de ajuda não é atualizado automaticamente, mas você pode atualizá-lo manualmente. Localize o arquivo `fill_help_tables.sql` no diretório `share` ou `share/mysql`. Mude para esse diretório e processe o arquivo com o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") Client da seguinte forma:

```sql
mysql -u root -p mysql < fill_help_tables.sql
```

O comando mostrado aqui pressupõe que você se conecta ao server usando uma conta como `root` que possui privilégios para modificar tabelas no Database `mysql`. Ajuste os parâmetros de conexão conforme necessário.

Se você estiver trabalhando com Git e uma árvore de source de desenvolvimento do MySQL, a árvore de source conterá apenas uma versão "stub" do `fill_help_tables.sql`. Para obter uma cópia que não seja "stub", use uma de uma distribution binária ou de source.

Nota

Cada série do MySQL possui seu próprio manual de referência específico da série, portanto, o conteúdo da tabela de ajuda também é específico da série. Isso tem implicações para Replication, pois o conteúdo da tabela de ajuda deve corresponder à série do MySQL. Se você carregar conteúdo de ajuda do MySQL 5.7 em um Source Server MySQL 5.7, não faz sentido replicar esse conteúdo para um Replica Server de uma série diferente do MySQL e para o qual esse conteúdo não é apropriado. Por esse motivo, ao realizar o upgrade de servers individuais em um cenário de Replication, você deve atualizar as tabelas de ajuda de cada server, utilizando as instruções fornecidas anteriormente.