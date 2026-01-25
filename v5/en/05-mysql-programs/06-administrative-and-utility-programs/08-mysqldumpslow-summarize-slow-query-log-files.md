### 4.6.8 mysqldumpslow — Resumir Arquivos de Slow Query Log

O Slow Query Log do MySQL contém informações sobre Queries que demoram muito tempo para serem executadas (consulte Seção 5.4.5, “O Slow Query Log”). O **mysqldumpslow** analisa arquivos de Slow Query Log do MySQL e resume seus conteúdos.

Normalmente, o **mysqldumpslow** agrupa Queries que são semelhantes, exceto pelos valores específicos de dados numéricos e de string. Ele "abstrai" esses valores para `N` e `'S'` ao exibir a saída resumida. Para modificar o comportamento de abstração de valores, use as opções `-a` e `-n`.

Invoque o **mysqldumpslow** desta forma:

```sql
mysqldumpslow [options] [log_file ...]
```

Exemplo de saída sem opções fornecidas:

```sql
Reading mysql slow query log from /usr/local/mysql/data/mysqld57-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

O **mysqldumpslow** suporta as seguintes opções.

**Tabela 4.24 Opções do mysqldumpslow**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqldumpslow."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>-a</td> <td>Não abstrai todos os números para N e strings para 'S'</td> </tr><tr><td>-n</td> <td>Abstrai números com pelo menos os dígitos especificados</td> </tr><tr><td>--debug</td> <td>Escreve informações de Debug</td> </tr><tr><td>-g</td> <td>Considera apenas comandos que correspondem ao Pattern</td> </tr><tr><td>--help</td> <td>Exibe mensagem de ajuda e sai</td> </tr><tr><td>-h</td> <td>Host name do servidor no nome do log file</td> </tr><tr><td>-i</td> <td>Nome da instância do servidor</td> </tr><tr><td>-l</td> <td>Não subtrai o Lock time do tempo total</td> </tr><tr><td>-r</td> <td>Inverte a ordem de classificação (sort order)</td> </tr><tr><td>-s</td> <td>Como classificar (sort) a saída</td> </tr><tr><td>-t</td> <td>Exibe apenas as primeiras num queries</td> </tr><tr><td>--verbose</td> <td>Modo Verbose</td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `-a`

  Não abstrai todos os números para `N` e strings para `'S'`.

* `--debug`, `-d`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug</code></td> </tr></tbody></table>

  Executa em modo Debug.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `-g pattern`

  <table frame="box" rules="all" summary="Propriedades para grep"><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Considera apenas Queries que correspondem ao Pattern (estilo **grep**).

* `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  Host name do servidor MySQL para o nome do arquivo `*-slow.log`. O valor pode conter um wildcard. O padrão é `*` (corresponder a todos).

* `-i name`

  <table frame="box" rules="all" summary="Propriedades para instance"><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Nome da instância do servidor (se estiver usando o script de inicialização **mysql.server**).

* `-l`

  Não subtrai o Lock time do tempo total.

* `-n N`

  <table frame="box" rules="all" summary="Propriedades para abstract-numbers"><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Abstrai números com pelo menos *`N`* dígitos dentro dos nomes.

* `-r`

  Inverte a ordem de classificação (sort order).

* `-s sort_type`

  <table frame="box" rules="all" summary="Propriedades para sort"><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>at</code></td> </tr></tbody></table>

  Como classificar (sort) a saída. O valor de *`sort_type`* deve ser escolhido na seguinte lista:

  + `t`, `at`: Classifica por tempo de Query ou tempo médio de Query

  + `l`, `al`: Classifica por Lock time ou Lock time médio

  + `r`, `ar`: Classifica por rows enviadas ou média de rows enviadas

  + `c`: Classifica por contagem

  Por padrão, o **mysqldumpslow** classifica por tempo médio de Query (equivalente a `-s at`).

* `-t N`

  <table frame="box" rules="all" summary="Propriedades para top"><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Exibe apenas as primeiras *`N`* Queries na saída.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo Verbose. Imprime mais informações sobre o que o programa faz.
