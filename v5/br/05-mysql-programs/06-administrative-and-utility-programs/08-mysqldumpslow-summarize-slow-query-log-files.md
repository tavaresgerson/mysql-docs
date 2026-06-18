### 4.6.8 mysqldumpslow — Resumir arquivos de registro de consultas lentas

O log de consultas lentas do MySQL contém informações sobre consultas que levam muito tempo para serem executadas (consulte a Seção 5.4.5, “O Log de Consultas Lentas”). O **mysqldumpslow** analisa os arquivos de log de consultas lentas do MySQL e resume seu conteúdo.

Normalmente, o **mysqldumpslow** agrupa as consultas que são semelhantes, exceto pelos valores específicos dos dados numéricos e de texto. Ele "abstrai" esses valores para `N` e `'S'` ao exibir o resultado resumido. Para modificar o comportamento de abstração de valores, use as opções `-a` e `-n`.

Invoque o **mysqldumpslow** da seguinte forma:

```sh
mysqldumpslow [options] [log_file ...]
```

Exemplo de saída sem opções fornecidas:

```sh
Reading mysql slow query log from /usr/local/mysql/data/mysqld57-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

O **mysqldumpslow** suporta as seguintes opções.

**Tabela 4.24 Opções de mysqldumpslow**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqldumpslow."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>-a</td> <td>Não abstraia todos os números para N e strings para 'S'</td> </tr><tr><td>-n</td> <td>Números abstratos com pelo menos os dígitos especificados</td> </tr><tr><td>--debug</td> <td>Escreva informações de depuração</td> </tr><tr><td>-g</td> <td>Considere apenas as declarações que correspondem ao padrão</td> </tr><tr><td>--help</td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td>-h</td> <td>Nome do host do servidor no nome do arquivo de log</td> </tr><tr><td>-i</td> <td>Nome da instância do servidor</td> </tr><tr><td>-l</td> <td>Não subtraia o tempo de bloqueio do tempo total</td> </tr><tr><td>-r</td> <td>Reverter a ordem de classificação</td> </tr><tr><td>-s</td> <td>Como classificar a saída</td> </tr><tr><td>-t</td> <td>Exibir apenas as primeiras n consultas</td> </tr><tr><td>--verbose</td> <td>Modo verbosos</td> </tr></tbody></table>

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `-a`

  Não abstraia todos os números para `N` e strings para `'S'`.

- `--debug`, `-d`

  <table frame="box" rules="all" summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug</code></td> </tr></tbody></table>

  Execute em modo de depuração.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `-g pattern`

  <table frame="box" rules="all" summary="Propriedades para grep"><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Considere apenas as consultas que correspondem ao padrão (estilo **grep**).

- `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>*</code></td> </tr></tbody></table>

  Nome do host do servidor MySQL para o nome do arquivo `*-slow.log`. O valor pode conter um caractere curinga. O padrão é `*` (concorda com tudo).

- `-i name`

  <table frame="box" rules="all" summary="Propriedades, por exemplo"><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Nome da instância do servidor (se estiver usando o script de inicialização **mysql.server**).

- `-l`

  Não subtraia o tempo de bloqueio do tempo total.

- `-n N`

  <table frame="box" rules="all" summary="Propriedades para números abstratos"><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Números abstratos com pelo menos *`N`* dígitos dentro dos nomes.

- `-r`

  Reverter a ordem de classificação.

- `-s sort_type`

  <table frame="box" rules="all" summary="Propriedades para classificação"><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>at</code></td> </tr></tbody></table>

  Como ordenar a saída. O valor de *`sort_type`* deve ser escolhido da seguinte lista:

  - `t`, `at`: Classificar por tempo de consulta ou tempo médio de consulta

  - `l`, `al`: Classificar por tempo de bloqueio ou tempo médio de bloqueio

  - `r`, `ar`: Classificar por linhas enviadas ou por linhas enviadas em média

  - `c`: Ordenar por contagem

  Por padrão, o **mysqldumpslow** ordena por tempo médio de consulta (equivalente a `-s at`).

- `-t N`

  <table frame="box" rules="all" summary="Propriedades para topo"><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Exiba apenas as primeiras *`N`* consultas na saída.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz.
