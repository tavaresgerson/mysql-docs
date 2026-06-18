### 25.5.18 ndb\_print\_file — Imprimir o conteúdo do arquivo de dados do disco NDB

O **ndb\_print\_file** obtém informações de um arquivo de disco de dados do NDB Cluster.

#### Uso

```
ndb_print_file [-v] [-q] file_name+
```

`file_name` é o nome de um arquivo de dados de disco do NDB Cluster. Vários nomes de arquivos são aceitos, separados por espaços.

Assim como **ndb\_print\_schema\_file** e **ndb\_print\_sys\_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_print\_file** deve ser executado em um nó de dados do NDB Cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções

**Tabela 25.40 Opções de linha de comando usadas com o programa ndb\_print\_file**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -v </code>],</p><p> [[PH_HTML_CODE_<code> -v </code>] </p></th> <td>Fornecer a chave de criptografia usando stdin, tty ou arquivo my.cnf</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -V </code>] </p></th> <td>Fornecer a chave de criptografia usando stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --usage</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--quiet</code>]],</p><p> [[<code> -q </code>]] </p></th> <td>Reduzir a verbosidade da saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--usage</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--verbose</code>]],</p><p> [[<code> -v </code>]] </p></th> <td>Aumente a verbosidade da saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> -K hex_data </code><code> -v </code>],</p><p> [[<code> -V </code>]] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

O **ndb\_print\_file** suporta as seguintes opções:

- `--file-key`, `-K`

  <table summary="Propriedades para chave de arquivo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--file-key=hex_data</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Forneça a chave de criptografia ou descriptografia do sistema de arquivos a partir de um arquivo `stdin`, `tty` ou um arquivo `my.cnf`.

- `--file-key-from-stdin`

  <table summary="Propriedades para file-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--file-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr><tr><th>Valores válidos</th> <td>[[<code>TRUE</code>]]</td> </tr></tbody></table>

  Forneça a chave de criptografia ou descriptografia do sistema de arquivos a partir de `stdin`.

- `--help`, `-h`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Imprima a mensagem de ajuda e saia.

- `--quiet`, `-q`

  <table summary="Propriedades para um ambiente tranquilo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--quiet</code>]]</td> </tr></tbody></table>

  Suspender a saída (modo silencioso).

- `--usage`, `-?`

  <table summary="Propriedades para uso"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--usage</code>]]</td> </tr></tbody></table>

  Imprima a mensagem de ajuda e saia.

- `--verbose`, `-v`

  <table summary="Propriedades para verbose"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

  Faça a saída mais detalhada.

- `--version`, `-v`

  <table summary="Propriedades para a versão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

  Informações da versão impressa e saída.

Para obter mais informações, consulte a Seção 25.6.11, “Tabelas de dados de disco do cluster NDB”.
