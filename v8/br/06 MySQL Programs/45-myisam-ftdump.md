### 6.6.3 `myisam_ftdump` — Exibir informações do índice de texto completo

`myisam_ftdump` exibe informações sobre índices `FULLTEXT` em tabelas `MyISAM`. Ele lê o arquivo de índice `MyISAM` diretamente, portanto, deve ser executado no host do servidor onde a tabela está localizada. Antes de usar `myisam_ftdump`, certifique-se de emitir primeiro uma declaração `FLUSH TABLES` se o servidor estiver em execução.

`myisam_ftdump` escaneia e exibe todo o índice, o que não é particularmente rápido. Por outro lado, a distribuição das palavras muda com pouca frequência, portanto, não precisa ser executado com frequência.

Invoque `myisam_ftdump` da seguinte forma:

```
myisam_ftdump [options] tbl_name index_num
```

O argumento *`tbl_name`* deve ser o nome de uma tabela `MyISAM`. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Se você não invocar `myisam_ftdump` no diretório onde os arquivos da tabela estão localizados, o nome da tabela ou do arquivo de índice deve ser precedido pelo nome do caminho para o diretório de banco de dados da tabela. Os números de índice começam com 0.

Exemplo: Suponha que o banco de dados `test` contenha uma tabela chamada `mytexttable` que tem a seguinte definição:

```
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

O índice em `id` é o índice 0 e o índice `FULLTEXT` em `txt` é o índice 1. Se o seu diretório de trabalho for o diretório do banco de dados `test`, invocar `myisam_ftdump` da seguinte forma:

```
myisam_ftdump mytexttable 1
```

Se o nome do caminho para o diretório do banco de dados `test` for `/usr/local/mysql/data/test`, você também pode especificar o argumento de nome da tabela usando esse nome de caminho. Isso é útil se você não invocar `myisam_ftdump` no diretório do banco de dados:

```
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

Você pode usar `myisam_ftdump` para gerar uma lista de entradas de índice em ordem de frequência de ocorrência assim em sistemas Unix-like:

```
myisam_ftdump -c mytexttable 1 | sort -r
```

Em Windows, use:

```
myisam_ftdump -c mytexttable 1 | sort /R
```

`myisam_ftdump` suporta as seguintes opções:

*  `--help`, `-h` `-?`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--count`, `-c`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--count</code></td> </tr></tbody></table>

  Calcular estatísticas por palavra (contagem e pesos globais).
*  `--dump`, `-d`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--dump</code></td> </tr></tbody></table>

  Exibir o índice, incluindo deslocamentos de dados e pesos das palavras.
*  `--length`, `-l`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--length</code></td> </tr></tbody></table>

  Relatar a distribuição do comprimento.
*  `--stats`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--stats</code></td> </tr></tbody></table>

  Relatar estatísticas globais do índice. Esta é a operação padrão se nenhuma outra operação for especificada.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprimir mais informações sobre o que o programa faz.