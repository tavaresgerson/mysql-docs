### 6.6.10 mysqldumpslow — Resumir arquivos de registro de consultas lentas

O registro de consultas lentas do MySQL contém informações sobre consultas que levam muito tempo para serem executadas (veja a Seção 7.4.5, “O Registro de Consultas Lentas”). O **mysqldumpslow** analisa os arquivos de registro de consultas lentas do MySQL e resume seu conteúdo.

Normalmente, o **mysqldumpslow** agrupa as consultas que são semelhantes, exceto pelos valores específicos dos dados numéricos e de cadeia. Ele “abstrai” esses valores para `N` e `'S'` ao exibir a saída resumida. Para modificar o comportamento de abstração de valor, use as opções `-a` e `-n`.

Inicie o **mysqldumpslow** da seguinte forma:

```
mysqldumpslow [options] [log_file ...]
```

Exemplo de saída sem opções fornecidas:

```
Reading mysql slow query log from /usr/local/mysql/data/mysqld95-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

O **mysqldumpslow** suporta as seguintes opções.

**Tabela 6.22 Opções do mysqldumpslow**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqldumpslow."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_abstract">-a</a></td> <td>Não abstraia todos os números para N e strings para 'S</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_abstract-numbers">-n</a></td> <td>Abstraia números com pelo menos os dígitos especificados</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_debug">--debug</a></td> <td>Escreva informações de depuração</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_grep">-g</a></td> <td>Considere apenas as declarações que correspondem ao padrão</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_help">--help</a></td> <td>Exiba a mensagem de ajuda e saia</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_host">-h</a></td> <td>Nome do host do servidor no nome do arquivo de log</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_instance">-i</a></td> <td>Nome da instância do servidor</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_lock">-l</a></td> <td>Não subtraia o tempo de bloqueio do tempo total</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_reverse">-r</a></td> <td>Reverte a ordem de classificação</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_sort">-s</a></td> <td>Como classificar a saída</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_top">-t</a></td> <td>Exiba apenas as primeiras <span class="number">num</span> consultas</td> </tr><tr><td><a class="link" href="mysqldumpslow.html#option_mysqldumpslow_verbose">--verbose</a></td> <td>Modo verbose</td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.

* `-a`

  Não abstraia todos os números para `N` e strings para `'S'`.

* `--debug`, `-d`

  <table frame="box" rules="all" summary="Propriedades para debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--debug</code></td> </tr></tbody></table>

  Executar no modo de depuração.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `-g pattern`

  <table frame="box" rules="all" summary="Propriedades para grep"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Considerar apenas consultas que correspondem ao padrão (estilo **grep**).

* `-h nome_do_host`

  <table frame="box" rules="all" summary="Propriedades para host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">*</code></td> </tr></tbody></table>

  Nome do host do servidor MySQL para o nome do arquivo `*-slow.log`. O valor pode conter um caractere curinga. O padrão é `*` (concordar com tudo).

* `-i nome`

  <table frame="box" rules="all" summary="Propriedades para instância"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Nome da instância do servidor (se estiver usando o script de inicialização **mysql.server**).

* `-l`

  Não subtraia o tempo de bloqueio do tempo total.

* `-n N`

<table frame="box" rules="all" summary="Propriedades para números abstratos"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Números abstratos com pelo menos *`N`* dígitos nos nomes.

* `-r`

  Reverter a ordem de classificação.

* `-s sort_type`

  <table frame="box" rules="all" summary="Propriedades para classificação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">at</code></td> </tr></tbody></table>

  Como classificar a saída. O valor de *`sort_type`* deve ser escolhido da seguinte lista:

  + `t`, `at`: Classificar pelo tempo de consulta ou tempo médio de consulta

  + `l`, `al`: Classificar pelo tempo de bloqueio ou tempo médio de bloqueio

  + `r`, `ar`: Classificar pelo número de linhas enviadas ou tempo médio de envio de linhas

  + `c`: Classificar por contagem

  Por padrão, o **mysqldumpslow** classifica pelo tempo médio de consulta (equivalente a `-s at`).

* `-t N`

  <table frame="box" rules="all" summary="Propriedades para top"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Exibir apenas as primeiras *`N`* consultas na saída.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprimir mais informações sobre o que o programa faz.