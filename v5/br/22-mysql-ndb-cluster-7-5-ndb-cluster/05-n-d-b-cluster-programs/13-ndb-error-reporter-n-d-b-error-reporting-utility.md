### 21.5.13 ndb_error_reporter — Ferramenta de Relatório de Erros do NDB

**ndb_error_reporter** cria um arquivo de logs dos arquivos de log do nó de dados e do nó de gerenciamento que podem ser usados para ajudar a diagnosticar bugs ou outros problemas com um clúster. *É altamente recomendado que você utilize este utilitário ao registrar relatórios de bugs no NDB Cluster*.

As opções que podem ser usadas com **ndb_error_reporter** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.32 Opções de linha de comando usadas com o programa ndb_error_reporter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --connection-timeout=# </code> </p></th> <td>Número de segundos para esperar ao se conectar aos nós antes de expirar o tempo de espera</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --dry-scp </code> </p></th> <td>Desative o scp com hosts remotos; usado apenas para testes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --fs </code> </p></th> <td>Incluir dados do sistema de arquivos no relatório de erro; pode usar uma grande quantidade de espaço em disco</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--help</code>,</p><p> <code> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-nodegroup=# </code> </p></th> <td>Pular todos os nós no grupo de nós com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

#### Uso

```sql
ndb_error_reporter path/to/config-file [username] [options]
```

Este utilitário é destinado ao uso em um nó de gerenciamento e requer o caminho para o arquivo de configuração do host de gerenciamento (geralmente chamado de `config.ini`). Opcionalmente, você pode fornecer o nome de um usuário que possa acessar os nós de dados do clúster usando SSH, para copiar os arquivos de log dos nós de dados. **ndb_error_reporter** inclui então todos esses arquivos em um arquivo compactado que é criado no mesmo diretório em que é executado. O arquivo é chamado de `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, onde *`YYYYMMDDhhmmss`* é uma string de data e hora.

**ndb_error_reporter** também aceita as opções listadas aqui:

- `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Propriedades para o timeout de conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Aguarde esses segundos ao tentar se conectar aos nós antes de expirar o tempo.

- `--dry-scp`

  <table frame="box" rules="all" summary="Propriedades para dry-scp"><tbody><tr><th>Formato de linha de comando</th> <td><code>--dry-scp</code></td> </tr></tbody></table>

  Execute **ndb_error_reporter** sem usar scp de hosts remotos. Usado apenas para testes.

- `--fs`

  <table frame="box" rules="all" summary="Propriedades para fs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--fs</code></td> </tr></tbody></table>

  Copie os sistemas de arquivos do nó de dados para o host de gerenciamento e inclua-os no arquivo.

  Como os sistemas de arquivos de nós de dados podem ser extremamente grandes, mesmo após serem comprimidos, pedimos que você não envie arquivos criados usando essa opção para a Oracle, a menos que você seja especificamente solicitado a fazer isso.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Propriedades para o timeout de conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Pule todos os nós que pertencem ao grupo de nós com o ID de grupo de nós fornecido.
