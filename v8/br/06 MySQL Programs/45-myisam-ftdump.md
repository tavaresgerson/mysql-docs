### 6.6.3 myisam\_ftdump  Visualizar informações de índice em texto completo

**myisam\_ftdump** exibe informações sobre os índices `FULLTEXT` nas tabelas `MyISAM`. Ele lê o arquivo de índice `MyISAM` diretamente, então ele deve ser executado no host do servidor onde a tabela está localizada. Antes de usar **myisam\_ftdump**, certifique-se de emitir uma instrução `FLUSH TABLES` primeiro se o servidor estiver em execução.

**myisam\_ftdump** digitaliza e descarrega todo o índice, o que não é particularmente rápido. Por outro lado, a distribuição de palavras muda com pouca frequência, por isso não precisa ser executado com frequência.

Invocar **myisam\_ftdump** assim:

```
myisam_ftdump [options] tbl_name index_num
```

O argumento `tbl_name` deve ser o nome de uma tabela `MyISAM`. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Se você não invocar **myisam\_ftdump** no diretório onde os arquivos de tabela estão localizados, o nome da tabela ou arquivo de índice deve ser precedido pelo nome do caminho para o diretório do banco de dados da tabela. Os números de índice começam com 0.

Exemplo: Suponha que o banco de dados `test` contém uma tabela chamada `mytexttable` que tem a seguinte definição:

```
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

O índice em `id` é o índice 0 e o índice `FULLTEXT` em `txt` é o índice 1. Se o seu diretório de trabalho é o diretório da base de dados `test`, invoque **myisam\_ftdump** da seguinte forma:

```
myisam_ftdump mytexttable 1
```

Se o nome do caminho para o diretório de banco de dados `test` for `/usr/local/mysql/data/test`, você também pode especificar o argumento de nome da tabela usando esse nome de caminho. Isso é útil se você não invocar **myisam\_ftdump** no diretório do banco de dados:

```
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

Você pode usar **myisam\_ftdump** para gerar uma lista de entradas de índice em ordem de freqüência de ocorrência assim em sistemas semelhantes ao Unix:

```
myisam_ftdump -c mytexttable 1 | sort -r
```

No Windows, use:

```
myisam_ftdump -c mytexttable 1 | sort /R
```

**myisam\_ftdump** suporta as seguintes opções:

- `--help`, `-h` `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--count`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--count</code>]]</td> </tr></tbody></table>

Calcular estatísticas por palavra (contas e pesos globais).

- `--dump`, `-d`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dump</code>]]</td> </tr></tbody></table>

Descarregar o índice, incluindo os deslocamentos de dados e os pesos das palavras.

- `--length`, `-l`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--length</code>]]</td> </tr></tbody></table>

Relata a distribuição longitudinal.

- `--stats`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stats</code>]]</td> </tr></tbody></table>

Relatar estatísticas de índices globais. Esta é a operação por defeito se não for especificada outra operação.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Imprima mais informações sobre o que o programa faz.
