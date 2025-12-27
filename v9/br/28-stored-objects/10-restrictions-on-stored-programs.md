## 27.10 Restrições para Programas Armazenados

* Instruções SQL não permitidas em rotinas armazenadas
* Restrições para funções armazenadas
* Restrições para gatilhos
* Conflitos de nomes dentro de rotinas armazenadas
* Considerações sobre replicação
* Considerações sobre depuração
* Sintaxe não suportada do padrão SQL:2003
* Considerações sobre concorrência de rotinas armazenadas
* Restrições do Agendamento de Eventos
* Rotinas armazenadas e gatilhos no NDB Cluster

Essas restrições se aplicam às funcionalidades descritas no Capítulo 27, *Objetos Armazenados*.

Algumas das restrições mencionadas aqui se aplicam a todas as rotinas armazenadas; ou seja, tanto a procedimentos armazenados quanto a funções armazenadas. Há também algumas restrições específicas para funções armazenadas, mas não para procedimentos armazenados.

As restrições para funções armazenadas também se aplicam a gatilhos. Há também algumas restrições específicas para gatilhos.

As restrições para procedimentos armazenados também se aplicam à cláusula `DO` das definições de eventos do Agendamento de Eventos. Há também algumas restrições específicas para eventos.

### Instruções SQL Não Permitidas em Rotinas Armazenadas

Rotinas armazenadas não podem conter instruções SQL arbitrárias. As seguintes instruções não são permitidas:

* As instruções de bloqueio `LOCK TABLES` e `UNLOCK TABLES`.
* `ALTER VIEW`.
* `LOAD DATA` e `LOAD XML`.

* As instruções preparadas SQL (`PREPARE`, `EXECUTE`, `DEALLOCATE PREPARE`) podem ser usadas em procedimentos armazenados, mas não em funções armazenadas ou gatilhos. Assim, funções armazenadas e gatilhos não podem usar SQL dinâmico (onde você constrói instruções como strings e as executa).

* Geralmente, as instruções que não são permitidas em instruções preparadas do SQL também não são permitidas em programas armazenados. Para uma lista de instruções suportadas como instruções preparadas, consulte a Seção 15.5, “Instruções Preparadas”. As exceções são `SIGNAL`, `RESIGNAL` e `GET DIAGNOSTICS`, que não são permitidas como instruções preparadas, mas são permitidas em programas armazenados.

* Como as variáveis locais estão no escopo apenas durante a execução do programa armazenado, referências a elas não são permitidas em instruções preparadas criadas dentro de um programa armazenado. O escopo da instrução preparada é a sessão atual, não o programa armazenado, então a instrução poderia ser executada após o término do programa, momento em que as variáveis não estariam mais no escopo. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como uma instrução preparada. Esta restrição também se aplica aos parâmetros de procedimentos armazenados e funções. Veja a Seção 15.5.1, “Instrução PREPARE”.

* Dentro de todos os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`.

  Para iniciar uma transação dentro de um procedimento armazenado ou evento, use `START TRANSACTION` em vez disso.

  `START TRANSACTION` não pode ser usado dentro de uma função ou gatilho armazenado.

### Restrições para Funções Armazenadas

As seguintes instruções ou operações adicionais não são permitidas dentro de funções armazenadas. Elas são permitidas dentro de procedimentos armazenados, exceto procedimentos armazenados que são invocados dentro de uma função ou gatilho armazenado. Por exemplo, se você usar `FLUSH` em um procedimento armazenado, esse procedimento armazenado não pode ser chamado a partir de uma função ou gatilho armazenado.

* Declarações que realizam commit ou rollback explícito ou implícito. O suporte para essas declarações não é exigido pelo padrão SQL, que afirma que cada fornecedor de SGBD pode decidir se permite.

* Declarações que retornam um conjunto de resultados. Isso inclui declarações `SELECT` que não têm uma cláusula `INTO var_list` e outras declarações como `SHOW`, `EXPLAIN` e `CHECK TABLE`. Uma função pode processar um conjunto de resultados com `SELECT ... INTO var_list` ou usando um cursor e declarações `FETCH`. Veja a Seção 15.2.13.1, “Declaração SELECT ... INTO”, e a Seção 15.6.6, “Cursors”.

* Declarações `FLUSH`.
* Funções armazenadas não podem ser usadas recursivamente.
* Uma função armazenada ou um gatilho não pode modificar uma tabela que já está sendo usada (para leitura ou escrita) pelo comando que invocou a função ou gatilho.

* Se você se referir a uma tabela temporária várias vezes em uma função armazenada sob diferentes aliases, ocorrerá um erro `Can't reopen table: 'tbl_name'`, mesmo que as referências ocorram em diferentes declarações dentro da função.

* Declarações `HANDLER ... READ` que invocam funções armazenadas podem causar erros de replicação e são desativadas.

### Restrições para Gatilhos

Para gatilhos, as seguintes restrições adicionais se aplicam:

* Gatilhos não são ativados por ações de chave estrangeira.
* Ao usar replicação baseada em linhas, gatilhos na replica não são ativados por declarações originadas na fonte. Os gatilhos na replica são ativados ao usar replicação baseada em declarações. Para mais informações, consulte a Seção 19.5.1.37, “Replicação e Gatilhos”.

* A declaração `RETURN` não é permitida em gatilhos, que não podem retornar um valor. Para sair de um gatilho imediatamente, use a declaração `LEAVE`.

* Não são permitidos gatilhos em tabelas no banco de dados `mysql`. Também não são permitidos em tabelas de `INFORMATION_SCHEMA` ou `performance_schema`. Essas tabelas são, na verdade, visualizações e gatilhos não são permitidos em visualizações.

* O cache de gatilhos não detecta quando os metadados dos objetos subjacentes foram alterados. Se um gatilho usa uma tabela e a tabela foi alterada desde que o gatilho foi carregado no cache, o gatilho opera com os metadados desatualizados.

### Conflitos de Nome em Rotinas Armazenadas

O mesmo identificador pode ser usado para um parâmetro de rotina, uma variável local e uma coluna de tabela. Além disso, o mesmo nome de variável local pode ser usado em blocos aninhados. Por exemplo:

```
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
* Um parâmetro de rotina tem precedência sobre uma coluna de tabela.
* Uma variável local em um bloco interno tem precedência sobre uma variável local em um bloco externo.
O comportamento de que as variáveis têm precedência sobre colunas de tabela é não padrão.

### Considerações de Replicação

O uso de rotinas armazenadas pode causar problemas de replicação. Esse problema é discutido mais detalhadamente na Seção 27.9, “Registro de Binário de Programa Armazenado”.

A opção `--replicate-wild-do-table=db_name.tbl_name` se aplica a tabelas, visualizações e gatilhos. Não se aplica a procedimentos e funções armazenadas ou eventos. Para filtrar instruções que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

### Considerações de Depuração

Não há facilidades de depuração de rotinas armazenadas.

### Sintaxe Não Suportada pelo Padrão SQL:2003

A sintaxe da rotina armazenada MySQL é baseada no padrão SQL:2003. Os seguintes itens desse padrão não são atualmente suportados:

* Manipuladores `UNDO`
* Loops `FOR`

### Considerações sobre Concorrência de Rotinas Armazenadas

Para evitar problemas de interação entre sessões, quando um cliente emite uma instrução, o servidor usa um instantâneo das rotinas e gatilhos disponíveis para execução da instrução. Ou seja, o servidor calcula uma lista de procedimentos, funções e gatilhos que podem ser usados durante a execução da instrução, carrega-os e, em seguida, procede à execução da instrução. Enquanto a instrução é executada, ela não vê alterações nas rotinas realizadas por outras sessões.

Para a máxima concorrência, as funções armazenadas devem minimizar seus efeitos colaterais; em particular, atualizar uma tabela dentro de uma função armazenada pode reduzir operações concorrentes nessa tabela. Uma função armazenada adquire bloqueios de tabela antes de executar, para evitar inconsistências no log binário devido à falta de correspondência na ordem em que as instruções são executadas e quando aparecem no log. Quando o registro binário baseado em instruções é usado, as instruções que invocam uma função são registradas, em vez das instruções executadas dentro da função. Consequentemente, as funções armazenadas que atualizam as mesmas tabelas subjacentes não são executadas em paralelo. Em contraste, os procedimentos armazenados não adquirem bloqueios de nível de tabela. Todas as instruções executadas dentro de procedimentos armazenados são escritas no log binário, mesmo para o registro binário baseado em instruções. Veja a Seção 27.9, “Registro Binário de Programas Armazenados”.

### Restrições do Cronômetro de Eventos

As seguintes limitações são específicas para o Cronômetro de Eventos:

* Os nomes dos eventos são tratados de forma case-insensitive. Por exemplo, você não pode ter dois eventos na mesma base de dados com os nomes `anEvent` e `AnEvent`.

* Um evento não pode ser criado a partir de um programa armazenado. Um evento não pode ser alterado ou excluído a partir de um programa armazenado, se o nome do evento for especificado por meio de uma variável. Além disso, um evento não pode criar, alterar ou excluir rotinas ou gatilhos armazenados.

* As instruções DDL sobre eventos são proibidas enquanto uma instrução `LOCK TABLES` estiver em vigor.

* Os tempos de eventos usando os intervalos `YEAR`, `QUARTER`, `MONTH` e `YEAR_MONTH` são resolvidos em meses; aqueles que usam qualquer outro intervalo são resolvidos em segundos. Não há como fazer com que eventos agendados para ocorrer no mesmo segundo sejam executados em uma ordem específica. Além disso, devido à arredondamento, à natureza das aplicações em fio e ao fato de que é necessário um tempo não nulo para criar eventos e sinalizar sua execução, os eventos podem ser atrasados em até 1 ou 2 segundos. No entanto, o tempo mostrado na coluna `LAST_EXECUTED` da tabela do esquema de informações `EVENTS` é sempre preciso dentro de um segundo do tempo real de execução do evento. (Veja também o Bug #16522.)

* Cada execução das instruções contidas no corpo de um evento ocorre em uma nova conexão; assim, essas instruções não têm efeito em uma sessão de usuário específica na contagem de instruções do servidor, como `Com_select` e `Com_insert` que são exibidas por `SHOW STATUS`. No entanto, essas contagens *são* atualizadas no escopo global. (Bug #16422)

* Os eventos não suportam tempos posteriores ao final da Era Unix; isso é aproximadamente o início do ano 2038. Tais datas não são especificamente permitidas pelo Agendamento de Eventos. (Bug #16396)

* As referências a funções armazenadas, funções carregáveis e tabelas nas cláusulas `ON SCHEDULE` das instruções `CREATE EVENT` e `ALTER EVENT` não são suportadas. Esse tipo de referência não é permitido. (Consulte o bug #22830 para obter mais informações.)

### Rotinas armazenadas e gatilhos no NDB Cluster

Embora procedimentos armazenados, funções armazenadas, gatilhos e eventos agendados sejam todos suportados por tabelas usando o motor de armazenamento `NDB`, você deve ter em mente que eles *não* se propagam automaticamente entre Servidores MySQL que atuam como nós SQL do Cluster. Isso ocorre porque as definições de rotinas armazenadas e gatilhos são armazenadas em tabelas no banco de dados do sistema `mysql` usando tabelas `InnoDB`, que não são copiadas entre os nós do Cluster.

Qualquer rotina armazenada ou gatilho que interaja com tabelas do MySQL Cluster deve ser recriado executando as instruções apropriadas `CREATE PROCEDURE`, `CREATE FUNCTION` ou `CREATE TRIGGER` em cada Servidor MySQL que participa do cluster onde você deseja usar a rotina ou gatilho armazenado. Da mesma forma, quaisquer alterações em rotinas ou gatilhos armazenados existentes devem ser realizadas explicitamente em todos os nós SQL do Cluster, usando as instruções apropriadas `ALTER` ou `DROP` em cada Servidor MySQL que acessa o cluster.

Aviso

*Não tente contornar o problema descrito apenas convertendo quaisquer tabelas do banco de dados `mysql` para usar o motor de armazenamento `NDB`. *Alterar as tabelas do sistema no banco de dados `mysql` não é suportado* e provavelmente produzirá resultados indesejáveis.