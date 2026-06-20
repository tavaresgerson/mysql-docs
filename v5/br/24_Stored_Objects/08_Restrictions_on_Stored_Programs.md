## 23.8 Restrições a Programas Armazenados

* Declarações SQL não permitidas em rotinas armazenadas
* Restrições para funções armazenadas
* Restrições para gatilhos
* Conflitos de nome em rotinas armazenadas
* Considerações sobre replicação
* Considerações sobre depuração
* Sintaxe não suportada do padrão SQL:2003
* Considerações sobre concorrência em rotinas armazenadas
* Restrições do Agendamento de Eventos
* Programas armazenados no NDB Cluster

Essas restrições se aplicam às características descritas no Capítulo 23, *Objetos Armazenados*.

Algumas das restrições mencionadas aqui se aplicam a todas as rotinas armazenadas; ou seja, tanto aos procedimentos armazenados quanto às funções armazenadas. Há também algumas restrições específicas para funções armazenadas, mas não para procedimentos armazenados.

As restrições para funções armazenadas também se aplicam a gatilhos. Há também algumas restrições específicas para gatilhos.

As restrições para procedimentos armazenados também se aplicam à cláusula `DO` das definições de eventos do Gerenciador de eventos. Há também algumas restrições específicas para eventos.

### Declarações SQL não permitidas em rotinas armazenadas

As rotinas armazenadas não podem conter instruções SQL arbitrárias. As seguintes instruções não são permitidas:

* As declarações de bloqueio `LOCK TABLES` e `UNLOCK TABLES`.

* `ALTER VIEW`.
* `LOAD DATA` e `LOAD XML`.

* As instruções preparadas do SQL (`PREPARE`, `EXECUTE`, `DEALLOCATE PREPARE`) podem ser usadas em procedimentos armazenados, mas não em funções armazenadas ou gatilhos. Assim, funções e gatilhos armazenados não podem usar SQL dinâmico (onde você constrói instruções como strings e as executa).

* Geralmente, as declarações que não são permitidas em declarações preparadas do SQL também não são permitidas em programas armazenados. Para uma lista de declarações suportadas como declarações preparadas, consulte a Seção 13.5, “Declarações Preparadas”. As exceções são `SIGNAL`, `RESIGNAL` e `GET DIAGNOSTICS`, que não são permitidas como declarações preparadas, mas são permitidas em programas armazenados.

* Como as variáveis locais estão no escopo apenas durante a execução do programa armazenado, as referências a elas não são permitidas em declarações preparadas criadas dentro de um programa armazenado. O escopo da declaração preparada é a sessão atual, não o programa armazenado, então a declaração pode ser executada após o término do programa, momento em que as variáveis não estarão mais no escopo. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como uma declaração preparada. Esta restrição também se aplica aos parâmetros de procedimentos armazenados e funções. Veja a Seção 13.5.1, “Declaração PREPARE”.

* Dentro de todos os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`.

Para iniciar uma transação dentro de um procedimento armazenado ou evento, use `START TRANSACTION` em vez disso.

`START TRANSACTION` não pode ser usado dentro de uma função ou gatilho armazenado.

### Restrições para Funções Armazenadas

As seguintes declarações ou operações adicionais não são permitidas dentro de funções armazenadas. Elas são permitidas dentro de procedimentos armazenados, exceto procedimentos armazenados que são invocados dentro de uma função ou gatilho armazenado. Por exemplo, se você usar `FLUSH` em um procedimento armazenado, esse procedimento armazenado não pode ser chamado a partir de uma função ou gatilho armazenado.

* Declarações que realizam comprometimento ou rollback explícito ou implícito. O suporte para essas declarações não é exigido pelo padrão SQL, que afirma que cada fornecedor de DBMS pode decidir se deseja permitir essas declarações.

* Declarações que retornam um conjunto de resultados. Isso inclui declarações `SELECT` que não possuem uma cláusula `INTO var_list` e outras declarações, como `SHOW`, `EXPLAIN` e `CHECK TABLE`. Uma função pode processar um conjunto de resultados com `SELECT ... INTO var_list` ou usando um cursor e declarações `FETCH`. Veja Seção 13.2.9.1, “Declaração SELECT ... INTO”, e Seção 13.6.6, “Cursors”.

* `FLUSH` declarações.
* Funções armazenadas não podem ser usadas recursivamente.
* Uma função ou gatilho armazenado não pode modificar uma tabela que já está sendo usada (para leitura ou escrita) pelo comando que invocou a função ou gatilho.

* Se você se referir a uma tabela temporária várias vezes em uma função armazenada sob diferentes aliases, uma `Can't reopen table: 'tbl_name'` ocorre, mesmo que as referências ocorram em diferentes declarações dentro da função.

* As declarações `HANDLER ... READ` que invocam funções armazenadas podem causar erros de replicação e são desaconselhadas.

### Restrições para gatilhos

Para os gatilhos, as seguintes restrições adicionais se aplicam:

* Os gatilhos não são ativados por ações de chave estrangeira. * Ao usar replicação baseada em linha, os gatilhos na replica não são ativados por declarações que têm origem na fonte. Os gatilhos na replica são ativados ao usar replicação baseada em declaração. Para mais informações, consulte a Seção 16.4.1.34, “Replicação e gatilhos”.

* A declaração `RETURN` não é permitida em gatilhos, que não podem retornar um valor. Para sair de um gatilho imediatamente, use a declaração `LEAVE`.

* Não são permitidos gatilhos em tabelas do banco de dados `mysql`. Também não são permitidos em tabelas de `INFORMATION_SCHEMA` ou `performance_schema`. Essas tabelas são, na verdade, vistas e gatilhos não são permitidos em vistas.

* O cache do gatilho não detecta quando os metadados dos objetos subjacentes mudaram. Se um gatilho usa uma tabela e a tabela mudou desde que o gatilho foi carregado no cache, o gatilho opera com os metadados desatualizados.

### Conflitos de Nome em Rotinas Armazenadas

O mesmo identificador pode ser usado para um parâmetro de rotina, uma variável local e uma coluna de tabela. Além disso, o mesmo nome de variável local pode ser usado em blocos aninhados. Por exemplo:

```sql
CREATE PROCEDURE p (i INT)
BEGIN
  DECLARE i INT DEFAULT 0;
  SELECT i FROM t;
  BEGIN
    DECLARE i INT DEFAULT 1;
    SELECT i FROM t;
  END;
END;
```

Nesses casos, o identificador é ambíguo e as seguintes regras de precedência se aplicam:

* Uma variável local tem precedência sobre um parâmetro de rotina ou coluna de tabela.

* Um parâmetro de rotina tem precedência sobre uma coluna de tabela. * Uma variável local em um bloco interno tem precedência sobre uma variável local em um bloco externo.

O comportamento de que as variáveis têm precedência sobre as colunas da tabela não é padrão.

### Considerações sobre a replicação

O uso de rotinas armazenadas pode causar problemas de replicação. Esse problema é discutido mais detalhadamente na Seção 23.7, “Registro binário de programas armazenados”.

A opção `--replicate-wild-do-table=db_name.tbl_name` se aplica a tabelas, visualizações e gatilhos. Não se aplica a procedimentos e funções armazenadas ou eventos. Para filtrar declarações que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

### Considerações sobre depuração

Não há instalações de depuração de rotina armazenadas.

### Sintaxe não suportada do padrão SQL:2003

A sintaxe da rotina armazenada do MySQL é baseada no padrão SQL:2003. Os seguintes itens desse padrão não são suportados atualmente:

* `UNDO` manipuladores
* `FOR` loops

### Considerações sobre a Concorrência de Rotinas Armazenadas

Para evitar problemas de interação entre as sessões, quando um cliente emite uma declaração, o servidor utiliza um instantâneo de rotinas e gatilhos disponíveis para execução da declaração. Ou seja, o servidor calcula uma lista de procedimentos, funções e gatilhos que podem ser utilizados durante a execução da declaração, carrega-os e, em seguida, procede à execução da declaração. Enquanto a declaração é executada, ela não vê alterações em rotinas realizadas por outras sessões.

Para obter a máxima concorrência, as funções armazenadas devem minimizar seus efeitos colaterais; em particular, atualizar uma tabela dentro de uma função armazenada pode reduzir operações concorrentes nessa tabela. Uma função armazenada adquire bloqueios de tabela antes de executar, para evitar inconsistências no log binário devido à falta de correspondência na ordem em que as declarações são executadas e quando aparecem no log. Quando o registro binário baseado em declarações é usado, as declarações que invocam uma função são registradas, em vez das declarações executadas dentro da função. Consequentemente, as funções armazenadas que atualizam as mesmas tabelas subjacentes não são executadas em paralelo. Em contraste, os procedimentos armazenados não adquirem bloqueios em nível de tabela. Todos os registros executados dentro dos procedimentos armazenados são escritos no log binário, mesmo para o registro binário baseado em declarações. Veja a Seção 23.7, “Registro Binário de Programa Armazenado”.

### Restrições do Cronograma de Eventos

As seguintes limitações são específicas para o Agendamento de Eventos:

* Os nomes dos eventos são tratados de forma sensível ao caso. Por exemplo, você não pode ter dois eventos no mesmo banco de dados com os nomes `anEvent` e `AnEvent`.

* Um evento não pode ser criado, alterado ou excluído a partir de um programa armazenado, se o nome do evento for especificado por meio de uma variável. Além disso, um evento não pode criar, alterar ou excluir rotinas ou gatilhos armazenados.

* As declarações DDL sobre eventos são proibidas enquanto uma declaração `LOCK TABLES` estiver em vigor.

* Os horários dos eventos utilizando os intervalos `YEAR`, `QUARTER`, `MONTH` e `YEAR_MONTH` são resolvidos em meses; aqueles que utilizam qualquer outro intervalo são resolvidos em segundos. Não há como fazer com que eventos agendados para ocorrer no mesmo segundo sejam executados em uma ordem específica. Além disso, devido à arredondamento, à natureza das aplicações em fio e ao fato de que é necessário um tempo não nulo para criar eventos e sinalizar sua execução, os eventos podem ser atrasados em até 1 ou 2 segundos. No entanto, o tempo mostrado na coluna `LAST_EXECUTED` da tabela do Schema de Informações `EVENTS` ou na coluna `last_executed` da tabela `mysql.event` é sempre preciso dentro de um segundo do tempo real de execução do evento. (Veja também o Bug #16522.)

* Cada execução das declarações contidas no corpo de um evento ocorre em uma nova conexão; portanto, essas declarações não têm efeito em uma sessão de usuário dada nas contagens de declarações do servidor, como `Com_select` e `Com_insert` que são exibidas por `SHOW STATUS`. No entanto, tais contagens *são* atualizadas no escopo global. (Bug #16422)

* Os eventos não suportam tempos posteriores ao final do Epoch Unix; isso é aproximadamente o início do ano de 2038. Tais datas não são especificamente permitidas pelo Agendamento de Eventos. (Bug #16396)

* As referências a funções armazenadas, funções carregáveis e tabelas nas cláusulas `ON SCHEDULE` das declarações `CREATE EVENT` e `ALTER EVENT` não são suportadas. Esse tipo de referência não é permitido. (Consulte o Bug #22830 para mais informações.)

### Programas Armazenados no NDB Cluster

Embora procedimentos armazenados, funções armazenadas, gatilhos e eventos agendados sejam suportados por tabelas usando o mecanismo de armazenamento `NDB`, você deve ter em mente que esses recursos *não* se propagam automaticamente entre servidores MySQL que atuam como nós SQL de cluster. Isso ocorre devido ao seguinte:

As definições rotineiras armazenadas são mantidas em tabelas no banco de dados do sistema `mysql`, utilizando o mecanismo de armazenamento `MyISAM`, e, portanto, não participam do agrupamento.

* Os arquivos `.TRN` e `.TRG` que contêm definições de gatilho não são lidos pelo motor de armazenamento `NDB`, e não são copiados entre os nós do Cluster.

Qualquer rotina ou gatilho armazenado que interaja com as tabelas do NDB Cluster deve ser recriado executando as declarações apropriadas `CREATE PROCEDURE`, `CREATE FUNCTION` ou `CREATE TRIGGER` em cada servidor MySQL que participa do clúster onde você deseja usar a rotina ou gatilho armazenado. Da mesma forma, quaisquer alterações em rotinas ou gatilhos armazenados existentes devem ser realizadas explicitamente em todos os nós SQL do Cluster, usando as declarações apropriadas `ALTER` ou `DROP` em cada servidor MySQL que acessa o clúster.

Aviso

Não tente resolver o problema descrito no primeiro item mencionado anteriormente convertendo quaisquer tabelas de banco de dados `mysql` para usar o mecanismo de armazenamento `NDB`. *Alterar as tabelas do sistema no banco de dados `mysql` não é suportado* e é muito provável que produza resultados indesejados.