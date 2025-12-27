### 25.5.23 ndb_restore — Restaurar um backup de um cluster NDB

O programa de restauração de um cluster NDB é implementado como um utilitário separado de linha de comando **ndb_restore**, que normalmente pode ser encontrado no diretório `bin` do MySQL. Este programa lê os arquivos criados como resultado do backup e insere as informações armazenadas no banco de dados.

**ndb_restore** deve ser executado uma vez para cada um dos arquivos de backup que foram criados pelo comando `START BACKUP` usado para criar o backup (veja a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento de Clusters NDB para Criar um Backup”). Isso é igual ao número de nós de dados no cluster no momento em que o backup foi criado.

Observação

Antes de usar **ndb_restore**, é recomendável que o cluster esteja em modo de usuário único, a menos que você esteja restaurando vários nós de dados em paralelo. Consulte a Seção 25.6.6, “Modo de Usuário Único de Clusters NDB”, para obter mais informações.

As opções que podem ser usadas com **ndb_restore** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--allow-pk-changes`

  <table frame="box" rules="all" summary="Propriedades para allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">1</code></td> </tr></tbody></table>

Quando esta opção é definida como `1`, o **ndb\_restore** permite que as chaves primárias em uma definição de tabela diferem daquelas da mesma tabela no backup. Isso pode ser desejável ao fazer backup e restaurar entre diferentes versões do esquema com alterações nas chaves primárias de uma ou mais tabelas, e parece que realizar a operação de restauração usando o **ndb\_restore** é mais simples ou mais eficiente do que emitir muitas instruções `ALTER TABLE` após restaurar os esquemas e dados das tabelas.

As seguintes alterações nas definições de chave primária são suportadas pelo `--allow-pk-changes`:

+ **Extensão da chave primária**: Uma coluna não nula que existe no esquema da tabela no backup torna-se parte da chave primária da tabela no banco de dados.

Importante

Ao estender a chave primária de uma tabela, quaisquer colunas que se tornem parte da chave primária devem não ser atualizadas enquanto o backup estiver sendo feito; quaisquer atualizações descobertas pelo **ndb\_restore** causam o falhar da operação de restauração, mesmo quando não ocorre alteração no valor. Em alguns casos, pode ser possível sobrepor esse comportamento usando a opção `--ignore-extended-pk-updates`; consulte a descrição dessa opção para mais informações.

+ **Contração da chave primária (1)**: Uma coluna que já faz parte da chave primária da tabela no esquema do backup não faz mais parte da chave primária, mas permanece na tabela.

+ **Contração da chave primária (2)**: Uma coluna que já faz parte da chave primária da tabela no esquema do backup é removida da tabela completamente.

Essas diferenças podem ser combinadas com outras diferenças de esquema suportadas pelo **ndb\_restore**, incluindo alterações em colunas blob e texto que requerem o uso de tabelas de preparação.

Os passos básicos em um cenário típico usando alterações no esquema da chave primária são listados aqui:

1. Restaure os esquemas da tabela usando **ndb\_restore** `--restore-meta`

  2. Altere o esquema para o desejado ou crie-o
  3. Faça backup do esquema desejado
  4. Execute **ndb\_restore** `--disable-indexes` usando o backup do passo anterior, para descartar índices e restrições

  5. Execute **ndb\_restore** `--allow-pk-changes` (possível junto com `--ignore-extended-pk-updates`, `--disable-indexes` e possivelmente outras opções conforme necessário) para restaurar todos os dados

  6. Execute **ndb\_restore** `--rebuild-indexes` usando o backup feito com o esquema desejado, para reconstruir índices e restrições

  Ao estender a chave primária, pode ser necessário que **ndb\_restore** use um índice secundário único temporário durante a operação de restauração para mapear a antiga chave primária para a nova. Esse índice é criado apenas quando necessário para aplicar eventos do log de backup a uma tabela que tem uma chave primária estendida. Esse índice é chamado `NDB$RESTORE_PK_MAPPING` e é criado em cada tabela que o requer; ele pode ser compartilhado, se necessário, por múltiplas instâncias da instância **ndb\_restore** em execução em paralelo. (Executar **ndb\_restore** `--rebuild-indexes` no final do processo de restauração faz com que esse índice seja descartado.)

* `--append`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>

  Quando usado com as opções `--tab` e `--print-data`, isso faz com que os dados sejam anexados a quaisquer arquivos existentes com os mesmos nomes.

* `--backup-path=*``dir_name`*

<table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>

  O caminho para o diretório de backup é obrigatório; ele é fornecido ao **ndb\_restore** usando a opção `--backup-path`, e deve incluir o subdiretório correspondente ao backup de ID do backup a ser restaurado. Por exemplo, se o `DataDir` do nó de dados for `/var/lib/mysql-cluster`, então o diretório de backup é `/var/lib/mysql-cluster/BACKUP`, e os arquivos de backup do backup com o ID 3 podem ser encontrados em `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. O caminho pode ser absoluto ou relativo ao diretório em que o executável **ndb\_restore** está localizado, e pode ser opcionalmente prefixado com `backup-path=`.

  É possível restaurar um backup para um banco de dados com uma configuração diferente daquela em que foi criado. Por exemplo, suponha que um backup com o ID de backup `12`, criado em um cluster com dois nós de armazenamento com os IDs de nó `2` e `3`, deve ser restaurado para um cluster com quatro nós. Então, o **ndb\_restore** deve ser executado duas vezes — uma vez para cada nó de armazenamento no cluster onde o backup foi feito. No entanto, o **ndb\_restore** nem sempre pode restaurar backups feitos de um cluster executando uma versão do MySQL para um cluster executando uma versão diferente do MySQL. Consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para obter mais informações.

  Importante

Não é possível restaurar um backup feito a partir de uma versão mais recente do NDB Cluster usando uma versão mais antiga do **ndb\_restore**. Você pode restaurar um backup feito a partir de uma versão mais recente do MySQL para um cluster mais antigo, mas você deve usar uma cópia do **ndb\_restore** da versão mais recente do NDB Cluster para fazer isso.

Por exemplo, para restaurar um backup de cluster feito de um cluster que está executando o NDB Cluster 8.4.7 para um cluster que está executando o NDB Cluster 8.0.44, você deve usar o **ndb\_restore** que vem com a distribuição do NDB Cluster 8.0.44.

Para uma restauração mais rápida, os dados podem ser restaurados em paralelo, desde que haja um número suficiente de conexões de cluster disponíveis. Ou seja, ao restaurar para múltiplos nós em paralelo, você deve ter uma seção `[api]` ou `[mysqld]` no arquivo `config.ini` do cluster disponível para cada processo de **ndb\_restore** concorrente. No entanto, os arquivos de dados devem ser aplicados sempre antes dos logs.

* `--backup-password=password`

  <table frame="box" rules="all" summary="Propriedades para backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Esta opção especifica uma senha para ser usada ao descriptografar um backup criptografado com a opção `--decrypt`. Esta deve ser a mesma senha que foi usada para criptografar o backup.

A senha deve ter de 1 a 256 caracteres e deve estar entre aspas simples ou duplas. Ela pode conter qualquer um dos caracteres ASCII com códigos de caracteres 32, 35, 38, 40-91, 93, 95 e 97-126; em outras palavras, pode usar qualquer caractere ASCII imprimível, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`.

É possível omitir a senha, caso em que o **ndb\_restore** aguarda por ela ser fornecida pelo `stdin`, como ao usar `--backup-password-from-stdin`.

* `--backup-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr></tbody></table>

  Quando usada no lugar de `--backup-password`, esta opção permite a entrada da senha de backup a partir da shell do sistema (`stdin`), de forma semelhante à como isso é feito ao fornecer a senha interativamente ao **mysql** ao usar `--password` sem fornecer a senha na linha de comando.

* `--backupid`=*`#`*, `-b`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>

  Esta opção é obrigatória; é usada para especificar o ID ou número de sequência do backup, e é o mesmo número exibido pelo cliente de gerenciamento do NDB na mensagem `Backup backup_id completed` exibida após a conclusão de um backup. (Veja a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”.)

  Importante

Ao restaurar backups de cluster, você deve ter certeza de que restaura todos os nós de dados a partir de backups com o mesmo ID de backup. Usar arquivos de backups diferentes resulta, no máximo, em restaurar o cluster a um estado inconsistente e provavelmente falhará completamente.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório que contém conjuntos de caracteres.

* `--connect`, `-c`

  <table frame="box" rules="all" summary="Propriedades para connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect=string_de_conexão</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost:1186</code></td> </tr></tbody></table>

  Alias para `--ndb-connectstring`.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>0

  O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>1

  Escrever o arquivo de núcleo em caso de erro; usado em depuração.

* `--decrypt`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>2

  Descriptar um backup criptografado usando a senha fornecida pela opção `--backup-password`.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>3

  Ler o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>4

  Leia as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>5

  Leia também grupos com concatenação de `group` e `suffix`.

* `--disable-indexes`

  <table frame="box" rules="all" summary="Propriedades para append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--append</code></td> </tr></tbody></table>6

  Desative a restauração de índices durante a restauração dos dados de um backup nativo `NDB`. Depois, você pode restaurar os índices para todas as tabelas de uma vez com a construção de índices multithread usando `--rebuild-indexes`, o que deve ser mais rápido do que reconstruir índices simultaneamente para tabelas muito grandes.

  Esta opção também exclui quaisquer chaves estrangeiras especificadas no backup.

  O MySQL pode abrir uma tabela `NDB` para a qual não puder ser encontrado um ou mais índices, desde que a consulta não use nenhum dos índices afetados; caso contrário, a consulta é rejeitada com `ER_NOT_KEYFILE`. No último caso, você pode trabalhar temporariamente em torno do problema executando uma declaração `ALTER TABLE` como esta:

  ```
  ALTER TABLE tbl ALTER INDEX idx INVISIBLE;
  ```

  Isso faz com que o MySQL ignore o índice `idx` na tabela `tbl`. Veja Chave Primária e Índices, para mais informações, bem como a Seção 10.3.12, “Índices Invisíveis”.

* `--dont-ignore-systab-0`, `-f`

<table frame="box" rules="all" summary="Propriedades para anexar">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--append</code></td>
  </tr>
</table>7

  Normalmente, ao restaurar dados e metadados de uma tabela, o **ndb_restore** ignora a cópia da tabela do sistema `NDB` presente no backup. A opção `--dont-ignore-systab-0` faz com que a tabela do sistema seja restaurada. *Esta opção é destinada apenas para uso experimental e de desenvolvimento e não é recomendada em um ambiente de produção*.

* `--exclude-databases=*``db-list`*

  <table frame="box" rules="all" summary="Propriedades para anexar">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--append</code></td>
    </tr>
  </table>8

  Lista de um ou mais bancos de dados separados por vírgula que não devem ser restaurados.

  Esta opção é frequentemente usada em combinação com `--exclude-tables`; consulte a descrição daquela opção para obter mais informações e exemplos.

* [`--exclude-intermediate-sql-tables=*``TRUE|FALSE`]*

  <table frame="box" rules="all" summary="Propriedades para anexar">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--append</code></td>
    </tr>
  </table>9

  Ao realizar operações de cópia `ALTER TABLE`, o **mysqld** cria tabelas intermediárias (cujos nomes são prefixados com `#sql-`). Quando `TRUE`, a opção `--exclude-intermediate-sql-tables` impede que o **ndb_restore** restaurasse essas tabelas que podem ter sido deixadas para trás por essas operações. Esta opção está definida como `TRUE` por padrão.

* `--exclude-missing-columns`

<table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>0

  É possível restaurar apenas as colunas da tabela selecionadas usando essa opção, o que faz com que o **ndb\_restore** ignore quaisquer colunas ausentes das tabelas que estão sendo restauradas em comparação com as versões dessas tabelas encontradas no backup. Essa opção se aplica a todas as tabelas que estão sendo restauradas. Se você deseja aplicar essa opção apenas a tabelas ou bancos de dados selecionados, pode usá-la em combinação com uma ou mais das opções `--include-*` ou `--exclude-*` descritas em outra parte desta seção para fazer isso, e depois restaurar os dados para as tabelas restantes usando um conjunto complementar dessas opções.

* `--exclude-tables`

  <table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>1

  É possível restaurar apenas as tabelas selecionadas usando essa opção, o que faz com que o **ndb\_restore** ignore quaisquer tabelas do backup que não estão no banco de dados de destino.

* `--exclude-tables=*``table-list`*

<table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>2

  Lista de uma ou mais tabelas a serem excluídas; cada referência de tabela deve incluir o nome do banco de dados. Frequentemente usada em conjunto com `--exclude-databases`.

  Quando `--exclude-databases` ou `--exclude-tables` é usado, apenas esses bancos de dados ou tabelas nomeados pela opção são excluídos; todos os outros bancos de dados e tabelas são restaurados pelo **ndb\_restore**.

  Esta tabela mostra várias invocações do **ndb\_restore** usando as opções `--exclude-*` (outras opções possivelmente necessárias foram omitidas para clareza), e os efeitos que essas opções têm na restauração a partir de um backup de NDB Cluster:

  **Tabela 25.23 Várias invocações do ndb\_restore usando as opções `--exclude-\*`, e os efeitos que essas opções têm na restauração a partir de um backup de NDB Cluster.**

  <table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>3

  Você pode usar essas duas opções juntas. Por exemplo, o seguinte faz com que todas as tabelas em todos os bancos de dados *exceto* os bancos de dados `db1` e `db2`, e as tabelas `t1` e `t2` no banco de dados `db3`, sejam restauradas:

  ```
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

  (Novamente, optamos por omitir outras opções possivelmente necessárias no interesse da clareza e brevidade do exemplo mostrado.)

Você pode usar as opções `--include-*` e `--exclude-*` juntas, sujeito às seguintes regras:

+ As ações de todas as opções `--include-*` e `--exclude-*` são cumulativas.

+ Todas as opções `--include-*` e `--exclude-*` são avaliadas na ordem passada para ndb\_restore, de direita para esquerda.

+ Em caso de opções conflitantes, a primeira (mais à direita) tem precedência. Em outras palavras, a primeira opção (da direita para a esquerda) que corresponder a um banco de dados ou tabela específica "gana".

Por exemplo, o seguinte conjunto de opções faz com que **ndb\_restore** restaure todas as tabelas do banco de dados `db1`, exceto `db1.t1`, enquanto não restaura nenhuma outra tabela de nenhum outro banco de dados:

```
  --include-databases=db1 --exclude-tables=db1.t1
  ```

No entanto, reverter a ordem das opções acima simplesmente faz com que todas as tabelas do banco de dados `db1` sejam restauradas (incluindo `db1.t1`, mas sem tabelas de nenhum outro banco de dados), porque a opção `--include-databases`, sendo a mais à direita, é a primeira correspondência com o banco de dados `db1` e, portanto, tem precedência sobre qualquer outra opção que corresponda a `db1` ou qualquer tabela em `db1`:

```
  --exclude-tables=db1.t1 --include-databases=db1
  ```

* `--fields-enclosed-by`=*`char`*

<table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>4

Cada valor da coluna é encerrado pela string passada para esta opção (independentemente do tipo de dados; veja a descrição da opção `--fields-optionally-enclosed-by`).

* `--fields-optionally-enclosed-by`

<table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>5

  A string passada para esta opção é usada para envolver os valores das colunas que contêm dados de caracteres (como `CHAR`, `VARCHAR`, `BINARY`, `TEXT` ou `ENUM`).

* `--fields-terminated-by=*``char`*

  <table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>6

  A string passada para esta opção é usada para separar os valores das colunas. O valor padrão é um caractere de tabulação (`\t`).

* `--help`

  <table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>7

  Exibir texto de ajuda e sair.

* `--hex`

<table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>8

  Se esta opção for usada, todos os valores binários serão exibidos no formato hexadecimal.

* `--ignore-extended-pk-updates`

  <table frame="box" rules="all" summary="Propriedades para backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">./</code></td> </tr></tbody></table>9

  Ao usar `--allow-pk-changes`, as colunas que se tornam parte da chave primária de uma tabela não devem ser atualizadas durante a realização do backup; essas colunas devem manter os mesmos valores do momento em que os valores são inseridos nelas até que as linhas que contêm os valores sejam excluídas. Se o **ndb\_restore** encontrar atualizações nessas colunas ao restaurar um backup, a restauração falha. Como alguns aplicativos podem definir valores para todas as colunas ao atualizar uma linha, mesmo quando alguns valores das colunas não são alterados, o backup pode incluir eventos de log que parecem atualizar colunas que, na verdade, não são modificadas. Nesses casos, você pode definir `--ignore-extended-pk-updates` para `1`, forçando o **ndb\_restore** a ignorar tais atualizações.

  Importante

  Ao fazer com que essas atualizações sejam ignoradas, o usuário é responsável por garantir que não haja atualizações nos valores de quaisquer colunas que se tornem parte da chave primária.

  Para mais informações, consulte a descrição de `--allow-pk-changes`.

* `--include-databases=*`db-list*

  <table frame="box" rules="all" summary="Propriedades para backup-password">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=password</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>0

  Lista de um ou mais bancos de dados para restauração, separados por vírgulas. Frequentemente usado junto com `--include-tables`; veja a descrição daquela opção para mais informações e exemplos.

* `--include-stored-grants`

  <table frame="box" rules="all" summary="Propriedades para backup-password">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=password</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>1

  O **ndb_restore** não restaura, por padrão, usuários e concessões compartilhadas (veja a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”) para a tabela `ndb_sql_metadata`. Especificar essa opção faz com que ele faça isso.

* `--include-tables=*`table-list*

  <table frame="box" rules="all" summary="Propriedades para backup-password">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=password</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>2

  Lista de tabelas para restauração, separadas por vírgulas; cada referência de tabela deve incluir o nome do banco de dados.

Quando `--include-databases` ou `--include-tables` é usado, apenas os bancos de dados ou tabelas nomeados pela opção são restaurados; todos os outros bancos de dados e tabelas são excluídos pelo **ndb\_restore** e não são restaurados.

A tabela a seguir mostra várias invocações do **ndb\_restore** usando as opções `--include-*` (outras opções possivelmente necessárias foram omitidas para clareza), e os efeitos que elas têm na restauração a partir de um backup de NDB Cluster:

**Tabela 25.24 Várias invocações do ndb\_restore usando as opções `--include-\*`, e seus efeitos na restauração a partir de um backup de NDB Cluster.**

<table frame="box" rules="all" summary="Propriedades para backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>3

  Você também pode usar essas duas opções juntas. Por exemplo, o seguinte faz com que todas as tabelas nos bancos de dados `db1` e `db2`, juntamente com as tabelas `t1` e `t2` no banco de dados `db3`, sejam restauradas (e nenhum outro banco de dados ou tabela):

  ```
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

  (Novamente, optamos por omitir outras, possivelmente necessárias, opções no exemplo mostrado.)

  Também é possível restaurar apenas bancos de dados selecionados, ou tabelas selecionadas de um único banco de dados, sem nenhuma opção `--include-*` (ou `--exclude-*`), usando a sintaxe mostrada aqui:

  ```
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...]]
  ```

  Em outras palavras, você pode especificar qualquer uma das seguintes para serem restauradas:

  + Todas as tabelas de um ou mais bancos de dados
  + Uma ou mais tabelas de um único banco de dados

<table frame="box" rules="all" summary="Propriedades para senha de backup">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=senha</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr>
</table>4

  Especifica a string usada para encerrar cada linha de saída. O padrão é um caractere de nova linha (`\n`).

* `--caminho-de-login`

  <table frame="box" rules="all" summary="Propriedades para senha de backup">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=senha</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr>
  </table>5

  Leia o caminho dado a partir do arquivo de login.

* `--sem-caminhos-de-login`

  <table frame="box" rules="all" summary="Propriedades para senha de backup">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=senha</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr>
  </table>6

  Ignora a leitura de opções a partir do arquivo de caminho de login.

* `--conversões-perdidas`, `-L`

  <table frame="box" rules="all" summary="Propriedades para senha de backup">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=senha</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr>
  </table>7

Esta opção é destinada a complementar a opção `--promote-attributes`. O uso de `--lossy-conversions` permite conversões não-perfeitas de valores de coluna (tipos de degradação ou mudanças de sinal) ao restaurar dados a partir de backups. Com algumas exceções, as regras que regem a degradação são as mesmas da replicação do MySQL; consulte a Seção 19.5.1.9.2, “Replicação de Colunas com Tipos de Dados Diferentes”, para obter informações sobre as conversões de tipos específicas atualmente suportadas pela degradação de atributos.

Esta opção também permite restaurar uma coluna `NULL` como `NOT NULL`. A coluna não deve conter nenhuma entrada `NULL`; caso contrário, o **ndb\_restore** pára com um erro.

O **ndb\_restore** relata qualquer truncação de dados que ele realiza durante as conversões não-perfeitas uma vez por atributo e coluna.

* `--no-binlog`

  <table frame="box" rules="all" summary="Propriedades para senha de backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>8

  Esta opção impede que quaisquer nós SQL conectados escrevam dados restaurados pelo **ndb\_restore** em seus logs binários.

* `--no-restore-disk-objects`, `-d`

  <table frame="box" rules="all" summary="Propriedades para senha de backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup-password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>9

Essa opção impede que o **ndb\_restore** recupere objetos de dados de disco do NDB Cluster, como espaços de tabelas e grupos de arquivos de log; consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”, para obter mais informações sobre essas tabelas.

* `--no-upgrade`, `-u`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr></tbody></table>0

  Ao usar o **ndb\_restore** para restaurar um backup, as colunas `VARCHAR` criadas usando o antigo formato fixo são redimensionadas e recriadas usando o formato de largura variável agora empregado. Esse comportamento pode ser ignorado especificando `--no-upgrade`.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrescreve entradas no `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr></tbody></table>2

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos valores `relaxed` ou `strict`. `relaxed` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `strict` significa que TLS é necessário para se conectar.

* `--ndb-mgmd-host`

<table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr>
</table>
3

O mesmo que `--ndb-connectstring`.

* `--ndb-nodegroup-map=*``map`, `-z`

<table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr>
</table>
4

Qualquer valor definido para esta opção é ignorado, e a própria opção não faz nada.

* `--ndb-nodeid`

<table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr>
</table>
5

Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr>
</table>
6

Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

<table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr>
</table>
7

Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes do uso.

A busca começa com o diretório mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr></tbody></table>8

  Não leia opções padrão de nenhum arquivo de opção diferente do arquivo de login.

* `--nodeid`=*`#`*, `-n`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backup-password-from-stdin</code></td> </tr></tbody></table>9

  Especifique o ID do nó do nó de dados em que o backup foi feito; obrigatório.

Ao restaurar um cluster com um número diferente de nós de dados daquele em que o backup foi feito, essas informações ajudam a identificar o conjunto ou conjuntos de arquivos corretos a serem restaurados em um determinado nó. (Nesses casos, geralmente é necessário restaurar vários arquivos para um único nó de dados.) Veja Restaurar em um número diferente de nós de dados, para obter informações e exemplos adicionais.

* `--num-slices=*`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>0

  Ao restaurar um backup por fatias, essa opção define o número de fatias em que o backup será dividido. Isso permite que múltiplas instâncias do **ndb\_restore** restauram subconjuntos disjuntos em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

  Uma *fatia* é um subconjunto dos dados em um backup dado; ou seja, é um conjunto de fragmentos com o mesmo ID de fatia, especificado usando a opção `--slice-id`. As duas opções devem ser sempre usadas juntas, e o valor definido por `--slice-id` deve sempre ser menor que o número de fatias.

  O **ndb\_restore** encontra fragmentos e atribui a cada um um contador de fragmento. Ao restaurar por fatias, um ID de fatia é atribuído a cada fragmento; esse ID de fatia está no intervalo de 0 a 1 menos que o número de fatias. Para uma tabela que não é uma tabela `BLOB`, o fatiamento a que um determinado fragmento pertence é determinado usando a fórmula mostrada aqui:

  ```
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

Para uma tabela `BLOB`, um contador de fragmentos não é usado; o número do fragmento é usado em vez disso, juntamente com o ID da tabela principal para a tabela `BLOB` (lembre-se de que o `NDB` armazena valores de *`BLOB`* em uma tabela separada internamente). Neste caso, o ID do corte para um fragmento dado é calculado como mostrado aqui:

  ```
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

  Assim, restaurar por *`N`* cortes significa executar *`N`* instâncias de **ndb\_restore**, todas com `--num-slices=N` (junto com quaisquer outras opções necessárias) e uma cada com `--slice-id=1`, `--slice-id=2`, `--slice-id=3`, e assim por diante até `slice-id=N-1`.

  **Exemplo.** Suponha que você queira restaurar um backup chamado `BACKUP-1`, encontrado no diretório padrão `/var/lib/mysql-cluster/BACKUP/BACKUP-3` no sistema de arquivos do nó em cada nó de dados, para um cluster com quatro nós de dados com os IDs de nó 1, 2, 3 e 4. Para realizar essa operação usando cinco cortes, execute os conjuntos de comandos mostrados na lista a seguir:

  1. Restaure os metadados do cluster usando **ndb\_restore** como mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 -m --disable-indexes --backup-path=/home/ndbuser/backups
     ```

  2. Restaure os dados do cluster aos nós de dados invocando **ndb\_restore** como mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

     Todos os comandos mostrados neste passo podem ser executados em paralelo, desde que haja slots suficientes para conexões com o cluster (veja a descrição para a opção `--backup-path`).

  3. Restaure os índices como de costume, como mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 --rebuild-indexes --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

  4. Finalmente, restaure o epoch, usando o comando mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 --restore-epoch --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

Você deve usar o fatiamento para restaurar apenas os dados do cluster; não é necessário usar `--num-slices` ou `--slice-id` ao restaurar os metadados, índices ou informações de época. Se uma ou ambas essas opções forem usadas com as opções **ndb\_restore** controlando a restauração desses, o programa as ignora.

Os efeitos de usar a opção `--parallelism` na velocidade da restauração são independentes daqueles produzidos pelo fatiamento ou restauração paralela usando múltiplas instâncias de **ndb\_restore** (`--parallelism` especifica o número de transações paralelas executadas por um *único* **ndb\_restore** thread), mas pode ser usado junto com uma ou ambas. Você deve estar ciente de que aumentar `--parallelism` faz com que **ndb\_restore** imponha uma carga maior no cluster; se o sistema puder lidar com isso, a restauração deve ser concluída ainda mais rapidamente.

O valor de `--num-slices` não depende diretamente de valores relacionados ao hardware, como número de CPUs ou núcleos de CPU, quantidade de RAM, e assim por diante, nem depende do número de LDMs.

É possível usar diferentes valores para essa opção em diferentes nós de dados como parte da mesma restauração; fazer isso não deve, por si só, produzir quaisquer efeitos negativos.

* `--backupid=#`, `-p`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>1

O **ndb\_restore** usa transações de uma única linha para aplicar muitas linhas simultaneamente. Este parâmetro determina o número de transações paralelas (linhas concorrentes) que uma instância do **ndb\_restore** tenta usar. Por padrão, este é 128; o mínimo é 1 e o máximo é 1024.

O trabalho de realizar as inserções é paralelizado pelos threads nos nós de dados envolvidos. Esse mecanismo é empregado para restaurar dados em massa a partir do arquivo `.Data`, ou seja, o instantâneo desfocado dos dados; ele não é usado para construir ou reconstruir índices. O log de alterações é aplicado seriamente; as operações de criação e reconstrução de índices são operações DDL e são tratadas separadamente. Não há paralelismo em nível de thread no lado do cliente do restore.

* `--preserve-trailing-spaces`, `-P`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>2

  Preservar espaços finais quando se promove um tipo de dado de caracteres de largura fixa para seu equivalente de largura variável—ou seja, quando se promove um valor de coluna `CHAR` para `VARCHAR`, ou um valor de coluna `BINARY` para `VARBINARY`. Caso contrário, quaisquer espaços finais são removidos desses valores de coluna quando eles são inseridos nas novas colunas.

  Nota

  Embora você possa promover colunas `CHAR` para `VARCHAR` e colunas `BINARY` para `VARBINARY`, você não pode promover colunas `VARCHAR` para `CHAR` ou colunas `VARBINARY` para `BINARY`.

<table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>3

  Faz com que o **ndb\_restore** imprima todos os dados, metadados e logs no `stdout`. É equivalente ao uso das opções `--print-data`, `--print-meta` e `--print-log` juntas.

  Observação

  O uso de `--print` ou de qualquer uma das opções `--print_*` está efetuando uma execução em modo de teste. A inclusão de uma ou mais dessas opções faz com que qualquer saída seja redirecionada para o `stdout`; nesses casos, o **ndb\_restore** não tenta restaurar dados ou metadados em um NDB Cluster.

* `--print-data`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>4

  Faz com que o **ndb\_restore** direcione sua saída para o `stdout`. Frequentemente usado junto com uma ou mais das opções `--tab`, `--fields-enclosed-by`, `--fields-optionally-enclosed-by`, `--fields-terminated-by`, `--hex` e `--append`.

  Os valores das colunas `TEXT` e `BLOB` são sempre truncados. Esses valores são truncados para os primeiros 256 bytes na saída. Isso atualmente não pode ser sobrescrito ao usar `--print-data`.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">nenhum</code></td> </tr></tbody></table>5

  Imprimir a lista de argumentos do programa e sair.

* `--print-log`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">nenhum</code></td> </tr></tbody></table>6

  Fazer com que o **ndb\_restore** exiba seu log no `stdout`.

* `--print-meta`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">nenhum</code></td> </tr></tbody></table>7

  Imprimir todos os metadados no `stdout`.

* `print-sql-log`

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">nenhum</code></td> </tr></tbody></table>8

Registre as instruções SQL no `stdout`. Use a opção para habilitar; normalmente, esse comportamento está desativado. A opção verifica se todas as tabelas sendo restauradas têm chaves primárias definidas explicitamente antes de tentar registrar; consultas em uma tabela que tenha apenas a chave primária oculta implementada pelo `NDB` não podem ser convertidas em SQL válido.

Esta opção não funciona com tabelas que têm colunas `BLOB`.

* `--progress-frequency=*``N`*

  <table frame="box" rules="all" summary="Propriedades para backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">none</code></td> </tr></tbody></table>9

  Imprima um relatório de status a cada *`N`* segundos enquanto o backup estiver em andamento. 0 (o padrão) não imprime relatórios de status. O máximo é 65535.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>0

O **ndb\_restore** suporta a promoção limitada de atributos da mesma forma que é suportado pela replicação do MySQL; ou seja, os dados salvos de uma coluna de um tipo específico geralmente podem ser restaurados para uma coluna usando um tipo "maior e semelhante". Por exemplo, dados de uma coluna `CHAR(20)` podem ser restaurados para uma coluna declarada como `VARCHAR(20)`, `VARCHAR(30)` ou `CHAR(30)`; dados de uma coluna `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") podem ser restaurados para uma coluna do tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Veja a Seção 19.5.1.9.2, "Replicação de Colunas com Diferentes Tipos de Dados", para uma tabela de conversões de tipos atualmente suportadas pela promoção de atributos.

Esta opção também permite restaurar uma coluna `NOT NULL` como `NULL`.

A promoção de atributos pelo **ndb\_restore** deve ser habilitada explicitamente, conforme segue:

1. Prepare a tabela para a qual o backup deve ser restaurado. O **ndb\_restore** não pode ser usado para recriar a tabela com uma definição diferente da original; isso significa que você deve criar a tabela manualmente ou alterar as colunas que deseja promover usando `ALTER TABLE` após restaurar os metadados da tabela, mas antes de restaurar os dados.

2. Inicie o **ndb\_restore** com a opção `--promote-attributes` (forma abreviada `-A`) ao restaurar os dados da tabela. A promoção de atributos não ocorre se essa opção não for usada; em vez disso, a operação de restauração falha com um erro.

Ao converter entre tipos de dados de caracteres e `TEXT` ou `BLOB`, apenas as conversões entre tipos de caracteres (`CHAR` e `VARCHAR`) e tipos binários (`BINARY` e `VARBINARY`) podem ser realizadas ao mesmo tempo. Por exemplo, você não pode promover uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") enquanto promove uma coluna `VARCHAR` para `TEXT` na mesma invocação do **ndb\_restore**.

A conversão entre colunas `TEXT` usando diferentes conjuntos de caracteres não é suportada e é expressamente proibida.

Ao realizar conversões de tipos de caracteres ou binários para `TEXT` ou `BLOB` com o **ndb\_restore**, você pode notar que ele cria e usa uma ou mais tabelas de preparação nomeadas `table_name$STnode_id`. Essas tabelas não são necessárias posteriormente e são normalmente excluídas pelo **ndb\_restore** após uma restauração bem-sucedida.

* `--rebuild-indexes`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>1

  Ative a reconstrução multisserial de índices ordenados durante a restauração de um backup nativo `NDB`. O número de threads usados para construir índices ordenados pelo **ndb\_restore** com esta opção é controlado pelo parâmetro de configuração do nó de dados `BuildIndexThreads` e pelo número de LDM.

É necessário usar essa opção apenas na primeira execução do **ndb\_restore**; isso faz com que todos os índices ordenados sejam reconstruídos sem usar novamente `--rebuild-indexes` ao restaurar nós subsequentes. Você deve usar essa opção antes de inserir novas linhas no banco de dados; caso contrário, é possível que uma linha seja inserida que, posteriormente, cause uma violação de restrição de unicidade ao tentar reconstruir os índices.

A construção de índices ordenados é paralela ao número de LDMs por padrão. A construção de índices offline realizada durante reinicializações de nós e sistemas pode ser feita mais rapidamente usando o parâmetro de configuração do nó de dados `BuildIndexThreads`; esse parâmetro não tem efeito na remoção e reconstrução de índices pelo **ndb\_restore**, que é realizado online.

A reconstrução de índices únicos usa a largura de banda de escrita no disco para registro de redo e checkpointing local. Uma quantidade insuficiente dessa largura de banda pode levar a erros de sobrecarga do buffer de redo ou de log. Nesses casos, você pode executar novamente o **ndb\_restore** `--rebuild-indexes`; o processo é retomado no ponto onde o erro ocorreu. Você também pode fazer isso quando encontrou erros temporários. Você pode repetir a execução do **ndb\_restore** `--rebuild-indexes` indefinidamente; você pode ser capaz de parar esses erros reduzindo o valor de `--parallelism`. Se o problema for espaço insuficiente, você pode aumentar o tamanho do log de redo (`FragmentLogFileSize` parâmetro de configuração do nó) ou pode aumentar a velocidade com que os LCPs são realizados (`MaxDiskWriteSpeed` e parâmetros relacionados), para liberar espaço mais rapidamente.

* `--remap-column=db.tbl.col:fn:args`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--character-sets-dir=caminho</code></td>
  </tr>
</table>
2

  Quando usado junto com `--restore-data`, esta opção aplica uma função ao valor da coluna indicada. Os valores na string de argumento são listados aqui:

  + *`db`*: Nome do banco de dados, seguindo quaisquer renomeações realizadas pelo `--rewrite-database`.

  + *`tbl`*: Nome da tabela.
  + *`col`*: Nome da coluna a ser atualizada. Esta coluna deve ser do tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT). A coluna também pode ser, mas não é obrigatório que seja `UNSIGNED`.

  + *`fn`*: Nome da função; atualmente, o único nome suportado é `offset`.

  + *`args`*: Argumentos fornecidos à função. Atualmente, apenas um argumento, o tamanho do deslocamento a ser adicionado pela função `offset`, é suportado. Valores negativos são suportados. O tamanho do argumento não pode exceder o da variante assinada do tipo da coluna; por exemplo, se *`col`* é uma coluna `INT`, então o intervalo permitido do argumento passado à função `offset` é `-2147483648` a `2147483647` (veja Seção 13.1.2, “Tipos Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT” - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

    Se a aplicação do valor do deslocamento à coluna causasse um estouro ou underflow, a operação de restauração falhará. Isso poderia acontecer, por exemplo, se a coluna for uma `BIGINT`, e a opção tentar aplicar um valor de deslocamento de 8 em uma linha em que o valor da coluna é 4294967291, pois `4294967291 + 8 = 4294967299 > 4294967295`.

Esta opção pode ser útil quando você deseja mesclar dados armazenados em múltiplas instâncias de origem do NDB Cluster (todas usando o mesmo esquema) em um único NDB Cluster de destino, usando o backup nativo do NDB (consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e **ndb\_restore** para mesclar os dados, onde os valores de chave primária e exclusiva estão sobrepostos entre os clusters de origem, e é necessário como parte do processo remapea-los para faixas que não se sobreponham. Também pode ser necessário preservar outras relações entre tabelas. Para atender a esses requisitos, é possível usar a opção várias vezes na mesma invocação de **ndb\_restore** para remapeaar colunas de tabelas diferentes, como mostrado aqui:

```
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```Qo0c37xWLg

Quando os backups de origem contêm tabelas duplicadas que não devem ser mescladas, você pode lidar com isso usando `--exclude-tables`, `--exclude-databases` ou por outros meios em sua aplicação.

Informações sobre a estrutura e outras características das tabelas a serem mescladas podem ser obtidas usando `SHOW CREATE TABLE`; a ferramenta **ndb\_desc**; e `MAX()`, `MIN()`, `LAST_INSERT_ID()` e outras funções MySQL.

A replicação de alterações de tabelas mescladas para tabelas não mescladas, ou de tabelas não mescladas para tabelas mescladas, em instâncias separadas do NDB Cluster não é suportada.
* `--restore-data`, `-r`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>3

  Mostre os dados e logs da tabela `NDB`.

* `--restore-epoch`, `-e`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>4

  Adicione (ou restaure) informações de época à tabela de status de replicação do NDB Cluster. Isso é útil para iniciar a replicação em uma replica do NDB Cluster. Quando esta opção é usada, a linha na tabela `mysql.ndb_apply_status` que tem `0` na coluna `id` é atualizada se já existir; uma linha é inserida se ainda não existir. (Veja a Seção 25.7.9, “Backup do NDB Cluster com Replicação do NDB Cluster”.)

* `--restore-meta`, `-m`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>5

  Esta opção faz com que o **ndb\_restore** imprima o metadados da tabela `NDB`.

  A primeira vez que você executar o programa de restauração **ndb\_restore**, também é necessário restaurar os metadados. Em outras palavras, você deve recriar as tabelas do banco de dados—isso pode ser feito executando-o com a opção `--restore-meta` (`-m`). A restauração dos metadados deve ser feita apenas em um único nó de dados; isso é suficiente para restaurá-los para todo o cluster.

**ndb\_restore** usa o número padrão de partições para o clúster de destino, a menos que o número de threads do gerenciador de dados local também seja alterado do que estava para os nós de dados no clúster original.

Ao usar essa opção, recomenda-se desabilitar a sincronização automática definindo `ndb_metadata_check=OFF` até que **ndb\_restore** tenha concluído a restauração dos metadados, após o que pode ser ativado novamente para sincronizar objetos recém-criados no dicionário NDB.

Nota

O clúster deve ter um banco de dados vazio ao iniciar a restauração de um backup. (Em outras palavras, você deve iniciar os nós de dados com `--initial` antes de realizar a restauração.)

* `--rewrite-database=*``olddb,newdb`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>6

  Essa opção permite restaurar para um banco de dados com um nome diferente daquele usado no backup. Por exemplo, se um backup for feito de um banco de dados chamado `products`, você pode restaurar os dados que ele contém para um banco de dados chamado `inventory`, usar essa opção conforme mostrado aqui (omitiendo quaisquer outras opções que possam ser necessárias):

  ```
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

  A opção pode ser usada várias vezes em uma única invocação de **ndb\_restore**. Assim, é possível restaurar simultaneamente de um banco de dados chamado `db1` para um banco de dados chamado `db2` e de um banco de dados chamado `db3` para um nome chamado `db4` usando `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Outras opções de **ndb\_restore** podem ser usadas entre múltiplas ocorrências de `--rewrite-database`.

Em caso de conflitos entre múltiplas opções de `--rewrite-database`, a última opção de `--rewrite-database` usada, lendo da esquerda para a direita, é a que tem efeito. Por exemplo, se `--rewrite-database=db1,db2 --rewrite-database=db1,db3` for usada, apenas `--rewrite-database=db1,db3` será atendida, e `--rewrite-database=db1,db2` será ignorada. Também é possível restaurar a partir de múltiplas bases de dados para uma única base de dados, de modo que `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restaura todas as tabelas e dados das bases de dados `db1` e `db2` para a base de dados `db3`.

Importante

Ao restaurar a partir de múltiplas bases de dados de backup para uma única base de dados de destino usando `--rewrite-database`, não é feita nenhuma verificação para colisões entre nomes de tabelas ou outros objetos, e a ordem em que as linhas são restauradas não é garantida. Isso significa que, nesses casos, é possível que as linhas sejam sobrescritas e as atualizações sejam perdidas.

* `--skip-broken-objects`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>7

  Esta opção faz com que o **ndb\_restore** ignore tabelas corrompidas ao ler um backup nativo `NDB`, e continue restaurando quaisquer tabelas restantes (que também não estejam corrompidas). Atualmente, a opção `--skip-broken-objects` funciona apenas no caso de tabelas de partes de blob ausentes.

* `--skip-table-check`, `-s`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>8

É possível restaurar dados sem restaurar os metadados da tabela. Por padrão, ao fazer isso, o **ndb\_restore** falha com um erro se for encontrado um desajuste entre os dados da tabela e o esquema da tabela; essa opção desativa esse comportamento.

Algumas das restrições sobre desajustes nas definições de colunas ao restaurar dados usando o **ndb\_restore** são relaxadas; quando um desses tipos de desajustes é encontrado, o **ndb\_restore** não pára com um erro como fazia anteriormente, mas sim aceita os dados e os insere na tabela de destino, emitindo um aviso ao usuário de que isso está sendo feito. Esse comportamento ocorre independentemente de uma das opções `--skip-table-check` ou `--promote-attributes` estar em uso. Essas diferenças nas definições de colunas são dos seguintes tipos:

+ Diferentes configurações de `COLUMN_FORMAT` (`FIXED`, `DYNAMIC`, `DEFAULT`)

+ Diferentes configurações de `STORAGE` (`MEMORY`, `DISK`)

+ Diferentes valores padrão
+ Diferentes configurações de chave de distribuição

* `--skip-unknown-objects`

<table frame="box" rules="all" summary="Propriedades para conectar">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--connect=string_de_conexão</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">localhost:1186</code></td>
  </tr>
  </tbody>
</table>0

  Ao restaurar por fatias, este é o ID da fatia a ser restaurada. Esta opção é sempre usada juntamente com `--num-fatias`, e seu valor deve ser sempre menor que o de `--num-fatias`.

  Para mais informações, consulte a descrição da `--num-fatias` em outro lugar desta seção.

* `--tab=*``nome_diretorio`, `-T``nome_diretorio`

  <table frame="box" rules="all" summary="Propriedades para conectar">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--connect=string_de_conexão</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">localhost:1186</code></td>
    </tr>
  </tbody>
  </table>1

  Faz com que `--print-data` crie arquivos de depuração, um por tabela, cada um com o nome `tbl_name.txt`. Requer como argumento o caminho para o diretório onde os arquivos devem ser salvos; use `.` para o diretório atual.

* `--timestamp-printouts`

  <table frame="box" rules="all" summary="Propriedades para conectar">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--connect=string_de_conexão</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">localhost:1186</code></td>
    </tr>
  </tbody>
  </table>2

  Faz com que os mensagens de log de informações, erros e depuração sejam prefixadas com timestamps.

Essa opção está habilitada por padrão. Desabilite-a com `--timestamp-printouts=false`.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para conectar"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost:1186</code></td> </tr></tbody></table>3

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para conectar"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost:1186</code></td> </tr></tbody></table>4

  Define o nível de verbosidade da saída. O mínimo é 0; o máximo é 255. O valor padrão é 1.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para conectar"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost:1186</code></td> </tr></tbody></table>5

  Exibir informações da versão e sair.

* `--with-apply-status`

<table frame="box" rules="all" summary="Propriedades para formatação de linha de comando"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect=string_de_conexão</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">localhost:1186</code></td> </tr></tbody></table>6

  Restaure todas as linhas da tabela `ndb_apply_status` do backup (exceto a linha com `server_id = 0`, que é gerada usando `--restore-epoch`). Esta opção exige que a opção `--restore-data` também seja usada.

  Se a tabela `ndb_apply_status` do backup já contiver uma linha com `server_id = 0`, **ndb\_restore** `--with-apply-status` a exclui. Por esse motivo, recomendamos que você use **ndb\_restore** `--restore-epoch` após invocar **ndb\_restore** com a opção `--with-apply-status`. Você também pode usar `--restore-epoch` simultaneamente com a última de qualquer chamada de **ndb\_restore** `--with-apply-status` usada para restaurar o clúster.

  Para mais informações, consulte a tabela ndb\_apply\_status.

As opções típicas para este utilitário são mostradas aqui:

```
  $> ndb_restore --rewrite-database=product,inventory
  ```

Normalmente, ao restaurar de um backup do NDB Cluster, **ndb\_restore** requer, no mínimo, as opções `--nodeid` (forma abreviada: `-n`), `--backupid` (forma abreviada: `-b`) e `--backup-path`.

A opção `-c` é usada para especificar uma string de conexão que indica ao **ndb_restore** onde localizar o servidor de gerenciamento do cluster (veja a Seção 25.4.3.3, “Strings de Conexão de NDB Cluster”). Se essa opção não for usada, o **ndb\_restore** tentará se conectar a um servidor de gerenciamento em `localhost:1186`. Esse utilitário atua como um nó de API de cluster e, portanto, requer um “slot” de conexão livre para se conectar ao servidor de gerenciamento do cluster. Isso significa que deve haver pelo menos uma seção `[api]` ou `[mysqld]` que possa ser usada por ele no arquivo `config.ini` do cluster. É uma boa ideia manter pelo menos uma seção `[api]` ou `[mysqld]` vazia em `config.ini` que não esteja sendo usada por um servidor MySQL ou outra aplicação por essa razão (veja a Seção 25.4.3.7, “Definindo Nodos SQL e Outros Nodos API em um NDB Cluster”).

O **ndb\_restore** pode descriptografar um backup criptografado usando `--decrypt` e `--backup-password`. Ambas as opções devem ser especificadas para realizar a descriptografia. Consulte a documentação do comando de cliente de gerenciamento **START BACKUP** para obter informações sobre a criação de backups criptografados.

Você pode verificar se o **ndb\_restore** está conectado ao cluster usando o comando `SHOW` no cliente de gerenciamento **ndb\_mgm**. Você também pode realizar isso a partir de uma shell do sistema, como mostrado aqui:

**Relatório de erros.** O **ndb\_restore** relata erros temporários e permanentes. No caso de erros temporários, ele pode ser capaz de recuperá-los e relata “Restauração bem-sucedida, mas encontrou erro temporário, consulte a configuração” nesses casos.

Importante

Após usar o **ndb\_restore** para inicializar um NDB Cluster para uso na replicação circular, os logs binários no nó SQL que atua como replica não são criados automaticamente e você deve criar manualmente. Para fazer com que os logs binários sejam criados, execute uma instrução `SHOW TABLES` nesse nó SQL antes de executar `START REPLICA`. Esse é um problema conhecido no NDB Cluster.