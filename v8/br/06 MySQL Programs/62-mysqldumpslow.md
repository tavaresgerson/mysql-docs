### 6.6.10 mysqldumpslow — Resumir Arquivos de Registro de Perguntas Lentas

O registro de consultas lentas do MySQL contém informações sobre consultas que levam muito tempo para serem executadas (veja a Seção 7.4.5, “O Registro de Consultas Lentas”). O `mysqldumpslow` analisa os arquivos de registro de consultas lentas do MySQL e resume seu conteúdo.

Normalmente, o `mysqldumpslow` agrupa consultas que são semelhantes, exceto pelos valores específicos de dados numéricos e de string. Ele “abstrai” esses valores para `N` e `'S'` ao exibir a saída resumida. Para modificar o comportamento de abstração de valor, use as opções `-a` e `-n`.

Inicie o `mysqldumpslow` da seguinte forma:

```
mysqldumpslow [options] [log_file ...]
```

Exemplo de saída sem opções:

```
Reading mysql slow query log from /usr/local/mysql/data/mysqld84-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

O `mysqldumpslow` suporta as seguintes opções.

**Tabela 6.21 Opções do `mysqldumpslow`**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>-a</td> <td>Não abstraia todos os números para `N` e strings para `'S'</td> </tr><tr><td>-n</td> <td>Abstraia números com pelo menos os dígitos especificados</td> </tr><tr><td>--debug</td> <td>Escreva informações de depuração</td> </tr><tr><td>-g</td> <td>Considera apenas instruções que correspondem ao padrão</td> </tr><tr><td>--help</td> <td>Exiba mensagem de ajuda e saia</td> </tr><tr><td>-h</td> <td>Nome do host do servidor no nome do arquivo de log</td> </tr><tr><td>-i</td> <td>Nome da instância do servidor</td> </tr><tr><td>-l</td> <td>Não subtraia o tempo de bloqueio do tempo total</td> </tr><tr><td>-r</td> <td>Reverter a ordem de classificação</td> </tr><tr><td>-s</td> <td>Como classificar a saída</td> </tr><tr><td>-t</td> <td>Exibir apenas as primeiras `num` consultas</td> </tr><tr><td>--verbose</td> <td>Modo verbose</td> </tr></tbody></table>

* `--help`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
* `-a`

  Não abstraia todos os números para `N` e strings para `'S'`.
* `--debug`, `-d`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug</code></td> </tr></tbody></table>

  Executar em modo de depuração.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `-g padrão`

  <table><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Considere apenas as consultas que correspondem ao padrão (`grep`) estilo.
* `-h nome_do_host`

  <table><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>*</code></td> </tr></tbody></table>

  Nome do host do servidor MySQL para o nome do arquivo `*-slow.log`. O valor pode conter um caractere curinga. O padrão é `*` (concordar com tudo).
* `-i nome`

  <table><tbody><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Nome da instância do servidor (se estiver usando o script de inicialização `mysql.server`).
* `-l`

  Não subtraia o tempo de bloqueio do tempo total.
* `-n N`

  <table><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Números abstratos com pelo menos *`N`* dígitos dentro dos nomes.
* `-r`

  Reverter a ordem de classificação.
* `-s tipo_de_classificação`

  <table><tbody><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>at</code></td> </tr></tbody></table>

  Como classificar a saída. O valor de *`tipo_de_classificação`* deve ser escolhido da seguinte lista:

  + `t`, `at`: Classificar pelo tempo da consulta ou pelo tempo médio da consulta
  + `l`, `al`: Classificar pelo tempo de bloqueio ou pelo tempo médio de bloqueio
  + `r`, `ar`: Classificar pelo número de linhas enviadas ou pelo número médio de linhas enviadas
  + `c`: Classificar pelo número de consultas

  Por padrão, o `mysqldumpslow` classifica pelo tempo médio da consulta (equivalente a `-s at`).
* `-t N`

  <table><tbody><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Exibir apenas as primeiras *`N`* consultas na saída.
* `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo de exibição detalhada. Imprima mais informações sobre o que o programa faz.