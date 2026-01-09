### 25.5.18 ndb_print_file — Imprimir conteúdo de um arquivo de dados de disco do NDB Cluster

**ndb_print_file** obtém informações de um arquivo de dados de disco do NDB Cluster.

#### Uso

```
ndb_print_file [-v] [-q] file_name+
```

* `file_name` é o nome de um arquivo de dados de disco do NDB Cluster. Vários nomes de arquivos são aceitos, separados por espaços.

Assim como **ndb_print_schema_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um host do servidor de gerenciamento ou para se conectar a um servidor de gerenciamento) **ndb_print_file** deve ser executado em um nó de dados do NDB Cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções

**ndb_print_file** suporta as seguintes opções:

* `--file-key`, `-K`

  <table frame="box" rules="all" summary="Propriedades para file-key"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--file-key=hex_data</code></td> </tr></tbody></table>

  Forneça a chave de criptografia ou descriptografia do sistema de arquivos a partir de `stdin`, `tty` ou um arquivo `my.cnf`.

* `--file-key-from-stdin`

  <table frame="box" rules="all" summary="Propriedades para file-key-from-stdin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--file-key-from-stdin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr><tr><th>Valores Válidos</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Forneça a chave de criptografia ou descriptografia do sistema de arquivos a partir de `stdin`.

* `--help`, `-h`, `-?`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr>
</table>

  Imprima a mensagem de ajuda e saia.

* `--quiet`, `-q`

  <table frame="box" rules="all" summary="Propriedades para modo silencioso">
    <tr><th>Formato de Linha de Comando</th> <td><code>--quiet</code></td> </tr>
  </table>

  Suprima a saída (modo silencioso).

* `--usage`, `-?`

  <table frame="box" rules="all" summary="Propriedades para uso">
    <tr><th>Formato de Linha de Comando</th> <td><code>--usage</code></td> </tr>
  </table>

  Imprima a mensagem de ajuda e saia.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose">
    <tr><th>Formato de Linha de Comando</th> <td><code>--verbose</code></td> </tr>
  </table>

  Torne a saída verbose.

* `--version`, `-v`

  <table frame="box" rules="all" summary="Propriedades para versão">
    <tr><th>Formato de Linha de Comando</th> <td><code>--version</code></td> </tr>
  </table>

  Imprima as informações da versão e saia.

Para mais informações, consulte a Seção 25.6.11, “Tabelas de Dados de Disco do Clúster NDB”.