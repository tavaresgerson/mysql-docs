#### 14.6.1.5 Convertendo Tabelas de MyISAM para InnoDB

Se você possui tabelas `MyISAM` que deseja converter para `InnoDB` para obter melhor confiabilidade e escalabilidade, revise as seguintes diretrizes e dicas antes da conversão.

* Ajustando o Uso de Memória para MyISAM e InnoDB
* Lidando com Transactions Muito Longas ou Muito Curtas
* Lidando com Deadlocks
* Layout de Armazenamento
* Convertendo uma Tabela Existente
* Clonando a Estrutura de uma Tabela
* Transferindo Dados
* Requisitos de Armazenamento
* Definindo Primary Keys
* Considerações de Performance de Aplicação
* Entendendo Arquivos Associados a Tabelas InnoDB

##### Ajustando o Uso de Memória para MyISAM e InnoDB

À medida que você faz a transição das tabelas `MyISAM`, diminua o valor da opção de configuração `key_buffer_size` para liberar memória que não é mais necessária para cache de resultados. Aumente o valor da opção de configuração `innodb_buffer_pool_size`, que desempenha um papel semelhante na alocação de memória cache para tabelas `InnoDB`. O Buffer Pool do `InnoDB` armazena em cache dados de tabela e dados de Index, acelerando as buscas para Queries e mantendo os resultados das Queries na memória para reutilização. Para obter orientação sobre a configuração do tamanho do Buffer Pool, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”.

Em um servidor com alto volume de tráfego, execute benchmarks com o Query Cache desativado. O Buffer Pool do `InnoDB` oferece benefícios semelhantes, portanto, o Query Cache pode estar prendendo memória desnecessariamente. Para obter informações sobre o Query Cache, consulte a Seção 8.10.3, “O Cache de Query do MySQL”.

##### Lidando com Transactions Muito Longas ou Muito Curtas

Como as tabelas `MyISAM` não suportam transactions, você pode não ter dado muita atenção à opção de configuração `autocommit` e às instruções `COMMIT` e `ROLLBACK`. Essas palavras-chave são importantes para permitir que múltiplas sessões leiam e escrevam em tabelas `InnoDB` concorrentemente, proporcionando benefícios substanciais de escalabilidade em workloads com alta intensidade de escrita (write-heavy).

Enquanto uma transaction estiver aberta, o sistema mantém um snapshot dos dados vistos no início da transaction, o que pode causar uma sobrecarga substancial se o sistema inserir, atualizar e excluir milhões de linhas enquanto uma transaction perdida continua em execução. Assim, tome cuidado para evitar transactions que demorem muito:

* Se você estiver usando uma sessão **mysql** para experimentos interativos, sempre execute `COMMIT` (para finalizar as alterações) ou `ROLLBACK` (para desfazer as alterações) quando terminar. Feche as sessões interativas em vez de deixá-las abertas por longos períodos, para evitar manter transactions abertas por engano por muito tempo.

* Certifique-se de que quaisquer handlers de erro em sua aplicação também executem `ROLLBACK` em alterações incompletas ou `COMMIT` em alterações concluídas.

* `ROLLBACK` é uma operação relativamente cara, porque as operações `INSERT`, `UPDATE` e `DELETE` são escritas nas tabelas `InnoDB` antes do `COMMIT`, com a expectativa de que a maioria das alterações seja commitada com sucesso e que os rollbacks sejam raros. Ao experimentar com grandes volumes de dados, evite fazer alterações em um grande número de linhas e depois reverter essas alterações.

* Ao carregar grandes volumes de dados com uma sequência de instruções `INSERT`, comite periodicamente os resultados com `COMMIT` para evitar transactions que durem horas. Em operações típicas de carga para data warehousing, se algo der errado, você trunca a tabela (usando `TRUNCATE TABLE`) e recomeça do início, em vez de fazer um `ROLLBACK`.

As dicas anteriores economizam memória e espaço em disco que podem ser desperdiçados durante transactions muito longas. Quando as transactions são mais curtas do que deveriam, o problema é o I/O excessivo. A cada `COMMIT`, o MySQL garante que cada alteração seja registrada com segurança no disco, o que envolve algum I/O.

* Para a maioria das operações em tabelas `InnoDB`, você deve usar a configuração `autocommit=0`. De uma perspectiva de eficiência, isso evita I/O desnecessário quando você emite um grande número de instruções `INSERT`, `UPDATE` ou `DELETE` consecutivas. De uma perspectiva de segurança, isso permite que você emita uma instrução `ROLLBACK` para recuperar dados perdidos ou corrompidos se você cometer um erro na linha de comando **mysql** ou em um handler de exceção na sua aplicação.

* `autocommit=1` é adequado para tabelas `InnoDB` ao executar uma sequência de Queries para gerar relatórios ou analisar estatísticas. Nesta situação, não há penalidade de I/O relacionada a `COMMIT` ou `ROLLBACK`, e o `InnoDB` pode otimizar automaticamente o workload de somente leitura.

* Se você fizer uma série de alterações relacionadas, finalize todas as alterações de uma só vez com um único `COMMIT` no final. Por exemplo, se você inserir informações relacionadas em várias tabelas, faça um único `COMMIT` após realizar todas as alterações. Ou se você executar muitas instruções `INSERT` consecutivas, faça um único `COMMIT` depois que todos os dados forem carregados; se estiver fazendo milhões de instruções `INSERT`, talvez divida a Transaction enorme emitindo um `COMMIT` a cada dez mil ou cem mil registros, para que a transaction não cresça demais.

* Lembre-se de que mesmo uma instrução `SELECT` abre uma transaction, portanto, após executar alguns relatórios ou Queries de depuração em uma sessão interativa **mysql**, emita um `COMMIT` ou feche a sessão **mysql**.

Para informações relacionadas, consulte a Seção 14.7.2.2, “autocommit, Commit e Rollback”.

##### Lidando com Deadlocks

Você pode ver mensagens de aviso referindo-se a “deadlocks” no log de erros do MySQL, ou na saída de `SHOW ENGINE INNODB STATUS`. Um Deadlock não é um problema grave para tabelas `InnoDB` e, muitas vezes, não requer nenhuma ação corretiva. Quando duas transactions começam a modificar múltiplas tabelas, acessando-as em uma ordem diferente, elas podem atingir um estado em que cada transaction está esperando pela outra e nenhuma pode prosseguir. Quando a detecção de Deadlock está habilitada (o padrão), o MySQL detecta imediatamente esta condição e cancela (rollback) a transaction “menor”, permitindo que a outra prossiga. Se a detecção de Deadlock estiver desabilitada usando a opção de configuração `innodb_deadlock_detect`, o `InnoDB` depende da configuração `innodb_lock_wait_timeout` para fazer o Rollback das transactions em caso de Deadlock.

De qualquer forma, suas aplicações precisam de lógica de tratamento de erros para reiniciar uma transaction que é cancelada à força devido a um Deadlock. Ao reemitir as mesmas instruções SQL de antes, o problema de timing original não se aplica mais. Ou a outra transaction já terminou e a sua pode prosseguir, ou a outra transaction ainda está em andamento e a sua transaction espera até que ela termine.

Se os avisos de Deadlock ocorrerem constantemente, você pode revisar o código da aplicação para reordenar as operações SQL de forma consistente, ou para encurtar as transactions. Você pode testar com a opção `innodb_print_all_deadlocks` habilitada para ver todos os avisos de Deadlock no log de erros do MySQL, em vez de apenas o último aviso na saída de `SHOW ENGINE INNODB STATUS`.

Para mais informações, consulte a Seção 14.7.5, “Deadlocks em InnoDB”.

##### Layout de Armazenamento

Para obter o melhor desempenho das tabelas `InnoDB`, você pode ajustar vários parâmetros relacionados ao layout de armazenamento.

Ao converter tabelas `MyISAM` que são grandes, acessadas frequentemente e contêm dados vitais, investigue e considere as variáveis `innodb_file_per_table`, `innodb_file_format` e `innodb_page_size`, bem como as cláusulas `ROW_FORMAT` e `KEY_BLOCK_SIZE` da instrução `CREATE TABLE`.

Durante seus experimentos iniciais, a configuração mais importante é `innodb_file_per_table`. Quando essa configuração está habilitada, o que é o padrão a partir do MySQL 5.6.6, novas tabelas `InnoDB` são criadas implicitamente em Tablespaces por tabela (file-per-table tablespaces). Em contraste com o system Tablespace do `InnoDB`, os Tablespaces por tabela permitem que o espaço em disco seja recuperado pelo sistema operacional quando uma tabela é truncada ou descartada (dropped). Os Tablespaces por tabela também suportam o formato de arquivo Barracuda e recursos associados, como compressão de tabela, armazenamento eficiente fora da página para colunas longas de tamanho variável e grandes prefixos de Index. Para obter mais informações, consulte a Seção 14.6.3.2, “Tablespaces por Tabela (File-Per-Table Tablespaces)”.

Você também pode armazenar tabelas `InnoDB` em um Tablespace geral compartilhado. Os Tablespaces gerais suportam o formato de arquivo Barracuda e podem conter múltiplas tabelas. Para obter mais informações, consulte a Seção 14.6.3.3, “Tablespaces Gerais”.

##### Convertendo uma Tabela Existente

Para converter uma tabela que não seja `InnoDB` para usar `InnoDB`, use `ALTER TABLE`:

```sql
ALTER TABLE table_name ENGINE=InnoDB;
```

Aviso

*Não* converta as tabelas do sistema MySQL no Database `mysql` de tabelas `MyISAM` para `InnoDB`. Esta é uma operação não suportada. Se você fizer isso, o MySQL não será reiniciado até que você restaure as tabelas antigas do sistema a partir de um backup ou as regenere reinicializando o diretório de dados (consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”).

##### Clonando a Estrutura de uma Tabela

Você pode criar uma tabela `InnoDB` que seja um clone de uma tabela MyISAM, em vez de usar `ALTER TABLE` para realizar a conversão, a fim de testar as tabelas antiga e nova lado a lado antes de fazer a troca.

Crie uma tabela `InnoDB` vazia com colunas e definições de Index idênticas. Use `SHOW CREATE TABLE table_name\G` para ver a instrução `CREATE TABLE` completa a ser usada. Altere a cláusula `ENGINE` para `ENGINE=INNODB`.

##### Transferindo Dados

Para transferir um grande volume de dados para uma tabela `InnoDB` vazia criada conforme mostrado na seção anterior, insira as linhas com `INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns`.

Você também pode criar os Indexes para a tabela `InnoDB` após a inserção dos dados. Historicamente, a criação de novos Indexes secundários era uma operação lenta para o `InnoDB`, mas agora você pode criar os Indexes após o carregamento dos dados com relativamente pouca sobrecarga na etapa de criação de Index.

Se você tiver constraints `UNIQUE` em Keys secundárias, pode acelerar uma importação de tabela desativando as verificações de exclusividade temporariamente durante a operação de importação:

```sql
SET unique_checks=0;
... import operation ...
SET unique_checks=1;
```

Para tabelas grandes, isso economiza I/O de disco porque o `InnoDB` pode usar seu change buffer para escrever registros de Index secundário em lotes. Certifique-se de que os dados não contenham Keys duplicadas. `unique_checks` permite, mas não exige que os storage engines ignorem Keys duplicadas.

Para melhor controle sobre o processo de inserção, você pode inserir tabelas grandes em partes:

```sql
INSERT INTO newtable SELECT * FROM oldtable
   WHERE yourkey > something AND yourkey <= somethingelse;
```

Depois que todos os registros forem inseridos, você pode renomear as tabelas.

Durante a conversão de tabelas grandes, aumente o tamanho do Buffer Pool do `InnoDB` para reduzir o I/O de disco. Normalmente, o tamanho recomendado do Buffer Pool é de 50 a 75% da memória do sistema. Você também pode aumentar o tamanho dos arquivos de log do `InnoDB`.

##### Requisitos de Armazenamento

Se você pretende fazer várias cópias temporárias de seus dados em tabelas `InnoDB` durante o processo de conversão, é recomendável que você crie as tabelas em Tablespaces por tabela para que possa recuperar o espaço em disco quando descartar as tabelas. Quando a opção de configuração `innodb_file_per_table` está habilitada (o padrão), as tabelas `InnoDB` recém-criadas são implicitamente criadas em Tablespaces por tabela.

Se você converter a tabela `MyISAM` diretamente ou criar uma tabela `InnoDB` clonada, certifique-se de ter espaço em disco suficiente para manter as tabelas antiga e nova durante o processo. **As tabelas `InnoDB` exigem mais espaço em disco do que as tabelas `MyISAM`.** Se uma operação `ALTER TABLE` ficar sem espaço, ela iniciará um Rollback, o que pode levar horas se estiver limitada pelo disco. Para inserts, o `InnoDB` usa o insert buffer para mesclar registros de Index secundário a Indexes em lotes. Isso economiza muito I/O de disco. Para o Rollback, nenhum mecanismo desse tipo é usado, e o Rollback pode levar 30 vezes mais tempo do que a inserção.

No caso de um Rollback descontrolado, se você não tiver dados valiosos no seu Database, pode ser aconselhável encerrar (kill) o processo do Database em vez de esperar que milhões de operações de I/O de disco sejam concluídas. Para o procedimento completo, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”.

##### Definindo Primary Keys

A cláusula `PRIMARY KEY` é um fator crítico que afeta a performance das Queries MySQL e o uso de espaço para tabelas e Indexes. A Primary Key identifica exclusivamente uma linha em uma tabela. Cada linha na tabela deve ter um valor de Primary Key, e nenhuma linha pode ter o mesmo valor de Primary Key.

Estas são diretrizes para a Primary Key, seguidas de explicações mais detalhadas.

* Declare uma `PRIMARY KEY` para cada tabela. Tipicamente, é a coluna mais importante à qual você se refere nas cláusulas `WHERE` ao buscar uma única linha.

* Declare a cláusula `PRIMARY KEY` na instrução `CREATE TABLE` original, em vez de adicioná-la posteriormente através de uma instrução `ALTER TABLE`.

* Escolha a coluna e seu tipo de dado cuidadosamente. Prefira colunas numéricas em vez de caracteres ou strings.

* Considere usar uma coluna AUTO_INCREMENT se não houver outra coluna numérica estável, única e não nula para usar.

* Uma coluna AUTO_INCREMENT também é uma boa escolha se houver qualquer dúvida se o valor da coluna Primary Key poderia mudar. Mudar o valor de uma coluna Primary Key é uma operação cara, possivelmente envolvendo reorganização de dados dentro da tabela e dentro de cada Index secundário.

Considere adicionar uma Primary Key a qualquer tabela que ainda não tenha uma. Use o tipo numérico prático mais pequeno com base no tamanho máximo projetado da tabela. Isso pode tornar cada linha ligeiramente mais compacta, o que pode gerar economias substanciais de espaço para tabelas grandes. A economia de espaço é multiplicada se a tabela tiver Indexes secundários, porque o valor da Primary Key é repetido em cada entrada do Index secundário. Além de reduzir o tamanho dos dados em disco, uma Primary Key pequena também permite que mais dados caibam no Buffer Pool, acelerando todos os tipos de operações e melhorando a concorrência.

Se a tabela já tiver uma Primary Key em alguma coluna mais longa, como um `VARCHAR`, considere adicionar uma nova coluna `AUTO_INCREMENT` unsigned e mudar a Primary Key para ela, mesmo que essa coluna não seja referenciada em Queries. Essa mudança de design pode produzir economias substanciais de espaço nos Indexes secundários. Você pode designar as colunas Primary Key anteriores como `UNIQUE NOT NULL` para impor as mesmas constraints que a cláusula `PRIMARY KEY`, ou seja, para evitar valores duplicados ou nulos em todas essas colunas.

Se você espalhar informações relacionadas por várias tabelas, tipicamente cada tabela usará a mesma coluna para sua Primary Key. Por exemplo, um Database de pessoal pode ter várias tabelas, cada uma com uma Primary Key de número de funcionário. Um Database de vendas pode ter algumas tabelas com uma Primary Key de número de cliente, e outras tabelas com uma Primary Key de número de pedido. Como as buscas usando a Primary Key são muito rápidas, você pode construir Queries JOIN eficientes para tais tabelas.

Se você omitir a cláusula `PRIMARY KEY` inteiramente, o MySQL criará uma invisível para você. É um valor de 6 bytes que pode ser mais longo do que você precisa, desperdiçando espaço. Como é oculto, você não pode se referir a ele em Queries.

##### Considerações de Performance de Aplicação

Os recursos de confiabilidade e escalabilidade do `InnoDB` exigem mais armazenamento em disco do que as tabelas `MyISAM` equivalentes. Você pode alterar ligeiramente as definições de coluna e Index, para melhor utilização do espaço, I/O reduzido e consumo de memória ao processar conjuntos de resultados, e melhores planos de otimização de Query que fazem uso eficiente das buscas de Index.

Se você configurar uma coluna de ID numérica para a Primary Key, use esse valor para referência cruzada com valores relacionados em quaisquer outras tabelas, particularmente para Queries JOIN. Por exemplo, em vez de aceitar um nome de país como entrada e fazer Queries buscando o mesmo nome, faça uma busca para determinar o ID do país e, em seguida, faça outras Queries (ou uma única Query JOIN) para buscar informações relevantes em várias tabelas. Em vez de armazenar um número de cliente ou item de catálogo como uma string de dígitos, potencialmente usando vários bytes, converta-o para um ID numérico para armazenamento e Query. Uma coluna `INT` unsigned (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) de 4 bytes pode indexar mais de 4 bilhões de itens (com o significado americano de billion: 1000 milhões). Para os intervalos dos diferentes tipos de inteiros, consulte a Seção 11.1.2, “Tipos de Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”.

##### Entendendo Arquivos Associados a Tabelas InnoDB

Os arquivos `InnoDB` exigem mais cuidado e planejamento do que os arquivos `MyISAM`.

* Você não deve excluir os arquivos `ibdata` que representam o system Tablespace do `InnoDB`.

* Os métodos de mover ou copiar tabelas `InnoDB` para um servidor diferente são descritos na Seção 14.6.1.4, “Movendo ou Copiando Tabelas InnoDB”.