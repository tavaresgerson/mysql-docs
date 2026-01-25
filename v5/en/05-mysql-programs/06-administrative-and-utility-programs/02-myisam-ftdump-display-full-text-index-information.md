### 4.6.2 myisam_ftdump — Exibir informações do Index Full-Text

**myisam_ftdump** exibe informações sobre os Indexes `FULLTEXT` em tabelas `MyISAM`. Ele lê o arquivo de Index `MyISAM` diretamente, portanto, deve ser executado no host do servidor onde a tabela está localizada. Antes de usar o **myisam_ftdump**, certifique-se de emitir uma instrução `FLUSH TABLES` primeiro se o servidor estiver em execução.

**myisam_ftdump** escaneia e despeja (dump) o Index inteiro, o que não é particularmente rápido. Por outro lado, a distribuição das palavras muda com pouca frequência, portanto, não é necessário executá-lo frequentemente.

Invoque o **myisam_ftdump** da seguinte forma:

```sql
myisam_ftdump [options] tbl_name index_num
```

O argumento *`tbl_name`* deve ser o nome de uma tabela `MyISAM`. Você também pode especificar uma tabela nomeando seu arquivo de Index (o arquivo com o sufixo `.MYI`). Se você não invocar o **myisam_ftdump** no diretório onde os arquivos da tabela estão localizados, o nome do arquivo da tabela ou do Index deve ser precedido pelo nome do caminho para o diretório do Database da tabela. A numeração dos Indexes começa em 0.

Exemplo: Suponha que o Database `test` contenha uma tabela chamada `mytexttable` que tenha a seguinte definição:

```sql
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

O Index em `id` é o Index 0 e o Index `FULLTEXT` em `txt` é o Index 1. Se o seu diretório de trabalho for o diretório do Database `test`, invoque o **myisam_ftdump** da seguinte forma:

```sql
myisam_ftdump mytexttable 1
```

Se o nome do caminho para o diretório do Database `test` for `/usr/local/mysql/data/test`, você também pode especificar o argumento do nome da tabela usando esse nome de caminho. Isso é útil se você não invocar o **myisam_ftdump** no diretório do Database:

```sql
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

Você pode usar o **myisam_ftdump** para gerar uma lista de entradas do Index em ordem de frequência de ocorrência, desta forma, em sistemas tipo Unix:

```sql
myisam_ftdump -c mytexttable 1 | sort -r
```

No Windows, use:

```sql
myisam_ftdump -c mytexttable 1 | sort /R
```

**myisam_ftdump** suporta as seguintes opções:

* `--help`, `-h` `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--count`, `-c`

  <table frame="box" rules="all" summary="Propriedades para contagem"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--count</code></td> </tr></tbody></table>

  Calcula estatísticas por palavra (contagens e pesos globais).

* `--dump`, `-d`

  <table frame="box" rules="all" summary="Propriedades para dump"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--dump</code></td> </tr></tbody></table>

  Despeja o Index, incluindo offsets de dados e pesos de palavras.

* `--length`, `-l`

  <table frame="box" rules="all" summary="Propriedades para comprimento"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--length</code></td> </tr></tbody></table>

  Relata a distribuição de comprimento.

* `--stats`, `-s`

  <table frame="box" rules="all" summary="Propriedades para stats"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--stats</code></td> </tr></tbody></table>

  Relata estatísticas globais do Index. Esta é a operação padrão se nenhuma outra operação for especificada.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose (detalhado). Imprime mais saída sobre o que o programa está fazendo.