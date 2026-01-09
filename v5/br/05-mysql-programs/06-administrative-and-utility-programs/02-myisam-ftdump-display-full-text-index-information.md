### 4.6.2 myisam_ftdump — Exibir informações do índice de texto completo

O **myisam_ftdump** exibe informações sobre os índices `FULLTEXT` nas tabelas `MyISAM`. Ele lê o arquivo do índice `MyISAM` diretamente, portanto, ele deve ser executado no host do servidor onde a tabela está localizada. Antes de usar o **myisam_ftdump**, certifique-se de emitir primeiro uma declaração `FLUSH TABLES` se o servidor estiver em execução.

O **myisam_ftdump** analisa e grava todo o índice, o que não é particularmente rápido. Por outro lado, a distribuição das palavras muda com pouca frequência, então não precisa ser executado com frequência.

Invoque **myisam_ftdump** da seguinte forma:

```sh
myisam_ftdump [options] tbl_name index_num
```

O argumento *`tbl_name`* deve ser o nome de uma tabela `MyISAM`. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Se você não invocar **myisam_ftdump** no diretório onde os arquivos da tabela estão localizados, o nome do arquivo da tabela ou do índice deve ser precedido pelo nome do caminho para o diretório do banco de dados da tabela. Os números de índice começam com 0.

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

O índice sobre `id` tem índice 0 e o índice `FULLTEXT` sobre `txt` tem índice 1. Se o diretório de trabalho for o diretório do banco de dados `test`, invocando **myisam_ftdump** da seguinte forma:

```sh
myisam_ftdump mytexttable 1
```

Se o nome do caminho para o diretório do banco de dados `test` for `/usr/local/mysql/data/test`, você também pode especificar o argumento do nome da tabela usando esse nome de caminho. Isso é útil se você não invocar o **myisam_ftdump** no diretório do banco de dados:

```sh
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

Você pode usar **myisam_ftdump** para gerar uma lista de entradas de índice em ordem de frequência de ocorrência, da seguinte forma, em sistemas semelhantes ao Unix:

```sh
myisam_ftdump -c mytexttable 1 | sort -r
```

No Windows, use:

```sh
myisam_ftdump -c mytexttable 1 | sort /R
```

O **myisam_ftdump** suporta as seguintes opções:

- `--help`, `-h`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--count`, `-c`

  <table frame="box" rules="all" summary="Propriedades para contagem"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--count</code>]]</td> </tr></tbody></table>

  Calcule estatísticas por palavra (contagem e pesos globais).

- `--dump`, `-d`

  <table frame="box" rules="all" summary="Propriedades para aterro"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--dump</code>]]</td> </tr></tbody></table>

  Descarte o índice, incluindo os deslocamentos de dados e os pesos das palavras.

- `--length`, `-l`

  <table frame="box" rules="all" summary="Propriedades para comprimento"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--length</code>]]</td> </tr></tbody></table>

  Relacione a distribuição do comprimento.

- `--stats`, `-s`

  <table frame="box" rules="all" summary="Propriedades para estatísticas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--stats</code>]]</td> </tr></tbody></table>

  Relatório estatísticas do índice global. Esta é a operação padrão se nenhuma outra operação for especificada.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz.
