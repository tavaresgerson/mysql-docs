### 4.6.2 myisam\_ftdump — Exibir informações do índice de texto completo

O **myisam\_ftdump** exibe informações sobre os índices `FULLTEXT` nas tabelas `MyISAM`. Ele lê o arquivo do índice `MyISAM` diretamente, portanto, ele deve ser executado no host do servidor onde a tabela está localizada. Antes de usar o **myisam\_ftdump**, certifique-se de emitir primeiro uma declaração `FLUSH TABLES` se o servidor estiver em execução.

O **myisam\_ftdump** analisa e grava todo o índice, o que não é particularmente rápido. Por outro lado, a distribuição das palavras muda com pouca frequência, então não precisa ser executado com frequência.

Invoque **myisam\_ftdump** da seguinte forma:

```sql
myisam_ftdump [options] tbl_name index_num
```

O argumento *`tbl_name`* deve ser o nome de uma tabela `MyISAM`. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Se você não invocar **myisam\_ftdump** no diretório onde os arquivos da tabela estão localizados, o nome do arquivo da tabela ou do índice deve ser precedido pelo nome do caminho para o diretório do banco de dados da tabela. Os números de índice começam com 0.

Exemplo: Suponha que o banco de dados `test` contenha uma tabela chamada `mytexttable` que tem a seguinte definição:

```sql
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

O índice sobre `id` tem índice 0 e o índice `FULLTEXT` sobre `txt` tem índice 1. Se o diretório de trabalho for o diretório do banco de dados `test`, invocando **myisam\_ftdump** da seguinte forma:

```sql
myisam_ftdump mytexttable 1
```

Se o nome do caminho para o diretório do banco de dados `test` for `/usr/local/mysql/data/test`, você também pode especificar o argumento do nome da tabela usando esse nome de caminho. Isso é útil se você não invocar o **myisam\_ftdump** no diretório do banco de dados:

```sql
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

Você pode usar **myisam\_ftdump** para gerar uma lista de entradas de índice em ordem de frequência de ocorrência, da seguinte forma, em sistemas semelhantes ao Unix:

```sql
myisam_ftdump -c mytexttable 1 | sort -r
```

No Windows, use:

```sql
myisam_ftdump -c mytexttable 1 | sort /R
```

O **myisam\_ftdump** suporta as seguintes opções:

- `--help`, `-h`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--count`, `-c`

  <table frame="box" rules="all" summary="Propriedades para contagem"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--count</code>]]</td> </tr></tbody></table>

  Calcule estatísticas por palavra (contagem e pesos globais).

- `--dump`, `-d`

  <table frame="box" rules="all" summary="Propriedades para aterro"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--dump</code>]]</td> </tr></tbody></table>

  Descarte o índice, incluindo os deslocamentos de dados e os pesos das palavras.

- `--length`, `-l`

  <table frame="box" rules="all" summary="Propriedades para comprimento"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--length</code>]]</td> </tr></tbody></table>

  Relacione a distribuição do comprimento.

- `--stats`, `-s`

  <table frame="box" rules="all" summary="Propriedades para estatísticas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--stats</code>]]</td> </tr></tbody></table>

  Relatório estatísticas do índice global. Esta é a operação padrão se nenhuma outra operação for especificada.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--verbose</code>]]</td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz.
