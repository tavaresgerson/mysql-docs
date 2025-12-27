### 25.5.12 ndb\_error\_reporter — Ferramenta de Relatório de Erros do NDB

O **ndb\_error\_reporter** cria um arquivo a partir dos arquivos de log do nó de gerenciamento e do nó de dados, que podem ser usados para ajudar a diagnosticar bugs ou outros problemas no cluster. **É altamente recomendado que você utilize essa ferramenta ao registrar relatórios de bugs no NDB Cluster**.

As opções que podem ser usadas com o **ndb\_error\_reporter** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

#### Uso

```
ndb_error_reporter path/to/config-file [username] [options]
```

Essa ferramenta é destinada ao uso em um host do nó de gerenciamento e requer o caminho para o arquivo de configuração do host de gerenciamento (geralmente chamado `config.ini`). Opcionalmente, você pode fornecer o nome de um usuário que possa acessar os nós de dados do cluster usando SSH, para copiar os arquivos de log do nó de dados. O **ndb\_error\_reporter** inclui então todos esses arquivos no arquivo que é criado no mesmo diretório em que é executado. O arquivo é chamado `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, onde *`YYYYMMDDhhmmss`* é uma string de data e hora.

O **ndb\_error\_reporter** também aceita as opções listadas aqui:

* `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Propriedades para connection-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connection-timeout=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  Aguarde esses segundos ao tentar se conectar aos nós antes de expirar o tempo de conexão.

* `--dry-scp`

<table frame="box" rules="all" summary="Propriedades para dry-scp">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--dry-scp</code></td> </tr>
</table>

  Execute o **ndb_error_reporter** sem usar o scp de hosts remotos. Usado apenas para testes.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr>
  </table>

  Exibir texto de ajuda e sair.

* `--fs`

  <table frame="box" rules="all" summary="Propriedades para fs">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--fs</code></td> </tr>
  </table>

  Copiar os sistemas de arquivos do nó de dados para o host de gerenciamento e incluí-los no arquivo.

  Como os sistemas de arquivos dos nós de dados podem ser extremamente grandes, mesmo após serem comprimidos, pedimos que você não envie arquivos criados usando essa opção para a Oracle, a menos que você seja especificamente solicitado a fazer isso.

* `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Propriedades para timeout_de_conexão">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connection-timeout=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr>
  </table>

  Ignorar todos os nós pertencentes ao grupo de nós que possuem o ID de grupo de nós fornecido.