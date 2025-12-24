### 6.6.10 mysqldumpslow  Resumir arquivos de registo de consultas lentas

O MySQL slow query log contém informações sobre consultas que levam muito tempo para serem executadas (ver Seção 7.4.5, The Slow Query Log). **mysqldumpslow** analisa os arquivos de log de consultas lentas do MySQL e resume seu conteúdo.

Normalmente, **mysqldumpslow** agrupa consultas que são semelhantes, exceto para os valores particulares de valores de dados de número e string. Ele  abstrai esses valores para `N` e `'S'` ao exibir a saída de resumo. Para modificar o comportamento de abstração de valores, use as opções `-a` e `-n`.

Invocar **mysqldumpslow** assim:

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

**mysqldumpslow** suporta as seguintes opções.

**Tabela 6.21 mysqldumpslow Opções**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>- Um.</td> <td>Não abstrair todos os números para N e cadeias de caracteres para "S"</td> </tr><tr><td></td> <td>Números abstratos com pelo menos os dígitos especificados</td> </tr><tr><td>--debug</td> <td>Escrever informações de depuração</td> </tr><tr><td>- G</td> <td>Considere apenas as afirmações que correspondem ao padrão</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td></td> <td>Nome do servidor no nome do ficheiro de registo</td> </tr><tr><td>- Eu...</td> <td>Nome da instância do servidor</td> </tr><tr><td>- Eu...</td> <td>Não subtrair o tempo de bloqueio do tempo total</td> </tr><tr><td></td> <td>Inverter a ordem de classificação</td> </tr><tr><td>-S</td> <td>Como classificar a saída</td> </tr><tr><td></td> <td>Mostrar apenas as primeiras consultas numéricas</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr></tbody></table>

- `--help`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `-a`

  Não abstrair todos os números para `N` e strings para `'S'`.
- `--debug`, `-d`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug</code>]]</td> </tr></tbody></table>

Funciona em modo de depuração.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `-g pattern`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

  Considere apenas as consultas que correspondem ao padrão (de estilo grep).
- `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  Nome do host do servidor MySQL para o nome do arquivo `*-slow.log`. O valor pode conter um wildcard. O padrão é `*` (match all).
- `-i name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

  Nome da instância do servidor (se usar o script de inicialização `mysql.server`).
- `-l`

  Não subtraia o tempo de bloqueio do tempo total.
- `-n N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

  Números abstratos com pelo menos `N` dígitos dentro dos nomes.
- `-r`

  Inverte a ordem de classificação.
- `-s sort_type`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>at</code>]]</td> </tr></tbody></table>

  Como classificar a saída. O valor de `sort_type` deve ser escolhido da seguinte lista:

  - `t`, `at`: Classificar por tempo de consulta ou tempo médio de consulta
  - `l`, `al`: Ordenar por tempo de bloqueio ou tempo de bloqueio médio
  - `r`, `ar`: Classificar por linhas enviadas ou linhas médias enviadas
  - `c`: Classificar por contagem

  Por padrão, **mysqldumpslow** classifica por tempo médio de consulta (equivalente a `-s at`).
- `-t N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

  Exibir apenas as primeiras consultas `N` na saída.
- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Imprima mais informações sobre o que o programa faz.
