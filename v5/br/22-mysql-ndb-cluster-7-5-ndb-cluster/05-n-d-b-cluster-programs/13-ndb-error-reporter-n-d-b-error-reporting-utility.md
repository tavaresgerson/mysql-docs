### 21.5.13 ndb_error_reporter — Utilitário de Relatório de Erros NDB

[**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") cria um archive a partir de log files de data nodes e management nodes que podem ser usados para ajudar a diagnosticar bugs ou outros problemas em um cluster. *É altamente recomendável que você utilize este utilitário ao registrar relatórios de bugs no NDB Cluster*.

As opções que podem ser usadas com [**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.32 Opções de linha de comando usadas com o programa ndb_error_reporter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --connection-timeout=# </code> </p></th> <td>Número de segundos a esperar ao conectar-se a nodes antes de ocorrer timeout</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --dry-scp </code> </p></th> <td>Desabilita scp com hosts remotos; usado apenas em testes</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fs </code> </p></th> <td>Inclui dados do file system no relatório de erro; pode usar uma grande quantidade de espaço em disco</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-nodegroup=# </code> </p></th> <td>Pula todos os nodes no node group que possui este ID</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

#### Uso

```sql
ndb_error_reporter path/to/config-file [username] [options]
```

Este utilitário é destinado para uso em um host de management node e requer o caminho para o arquivo de configuração do host de gerenciamento (geralmente chamado `config.ini`). Opcionalmente, você pode fornecer o nome de um usuário que seja capaz de acessar os data nodes do cluster usando SSH, para copiar os log files dos data nodes. O [**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") então inclui todos esses arquivos no archive que é criado no mesmo diretório em que é executado. O archive é nomeado `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, onde *`YYYYMMDDhhmmss`* é uma string de data e hora.

[**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") também aceita as opções listadas aqui:

* `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr> </tbody></table>

  Espera este número de segundos ao tentar conectar-se a nodes antes de atingir o timeout.

* `--dry-scp`

  <table frame="box" rules="all" summary="Properties for dry-scp"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--dry-scp</code></td> </tr> </tbody></table>

  Executa [**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") sem usar scp de hosts remotos. Usado apenas para testes.

* `--fs`

  <table frame="box" rules="all" summary="Properties for fs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--fs</code></td> </tr> </tbody></table>

  Copia os file systems dos data nodes para o management host e os inclui no archive.

  Como os file systems dos data nodes podem ser extremamente grandes, mesmo após serem compactados, solicitamos que você *não* envie archives criados usando esta opção para a Oracle, a menos que seja especificamente solicitado.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr> </tbody></table>

  Exibe o texto de ajuda e sai.

* `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr> </tbody></table>

  Pula todos os nodes pertencentes ao node group que possui o ID de node group fornecido.