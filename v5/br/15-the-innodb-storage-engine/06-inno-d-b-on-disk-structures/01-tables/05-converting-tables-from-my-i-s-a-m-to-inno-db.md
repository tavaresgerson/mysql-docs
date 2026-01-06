#### 14.6.1.5 Converter tabelas de MyISAM para InnoDB

Se você tem tabelas `MyISAM` que deseja converter para `InnoDB` para maior confiabilidade e escalabilidade, revise as seguintes diretrizes e dicas antes de converter.

- Ajustando o uso de memória para MyISAM e InnoDB
- Tratamento de transações muito longas ou muito curtas
- Lidando com Deadlocks
- Organização de Armazenamento
- Converter uma tabela existente
- Clonar a estrutura de uma tabela
- Transferir dados
- Requisitos de Armazenamento
- Definindo Chaves Primárias
- Considerações sobre o desempenho da aplicação
- Entendendo os arquivos associados às tabelas InnoDB

##### Ajustando o uso de memória para MyISAM e InnoDB

À medida que você passa a usar tabelas `MyISAM`, reduza o valor da opção de configuração `key_buffer_size` para liberar a memória que não é mais necessária para o cache de resultados. Aumente o valor da opção de configuração `innodb_buffer_pool_size`, que desempenha um papel semelhante ao alocar memória de cache para tabelas `InnoDB`. O buffer pool do `InnoDB` armazena tanto os dados da tabela quanto os dados do índice, acelerando as consultas e mantendo os resultados das consultas na memória para uso posterior. Para obter orientações sobre a configuração do tamanho do buffer pool, consulte a Seção 8.12.4.1, “Como o MySQL Usa a Memória”.

Em um servidor ocupado, execute benchmarks com o cache de consultas desativado. O pool de buffers do `InnoDB` oferece benefícios semelhantes, então o cache de consultas pode estar consumindo memória desnecessariamente. Para obter informações sobre o cache de consultas, consulte a Seção 8.10.3, “O Cache de Consultas do MySQL”.

##### Tratamento de transações muito longas ou muito curtas

Como as tabelas `MyISAM` não suportam transações, você pode não ter prestado muita atenção à opção de configuração `autocommit` e às instruções `COMMIT` e `ROLLBACK`. Essas palavras-chave são importantes para permitir que múltiplas sessões leiam e escrevam em tabelas `InnoDB` simultaneamente, proporcionando benefícios substanciais em termos de escalabilidade em cargas de trabalho com muitos registros escritos.

Enquanto uma transação estiver aberta, o sistema mantém um instantâneo dos dados conforme visto no início da transação, o que pode causar um grande overhead se o sistema inserir, atualizar e excluir milhões de linhas enquanto uma transação desnecessária continua em execução. Portanto, tenha cuidado para evitar transações que demoram muito tempo:

- Se você estiver usando uma sessão **mysql** para experimentos interativos, sempre `COMMIT` (para finalizar as alterações) ou `ROLLBACK` (para desfazer as alterações) quando terminar. Feche as sessões interativas em vez de deixá-las abertas por longos períodos, para evitar manter transações abertas por longos períodos acidentalmente.

- Certifique-se de que qualquer manipulador de erros em sua aplicação também faça `ROLLBACK` para alterações incompletas ou `COMMIT` para alterações concluídas.

- `ROLLBACK` é uma operação relativamente cara, porque as operações `INSERT`, `UPDATE` e `DELETE` são escritas nas tabelas do `InnoDB` antes do `COMMIT`, com a expectativa de que a maioria das alterações seja confirmada com sucesso e que os `ROLLBACK` sejam raros. Ao experimentar com grandes volumes de dados, evite fazer alterações em um grande número de linhas e, em seguida, reverter essas alterações.

- Ao carregar grandes volumes de dados com uma sequência de instruções `INSERT`, realize periodicamente o `COMMIT` dos resultados para evitar transações que duram horas. Em operações de carregamento típicas para data warehousing, se algo der errado, você pode truncar a tabela (usando `TRUNCATE TABLE`) e começar tudo de novo, em vez de fazer um `ROLLBACK`.

As dicas anteriores economizam memória e espaço em disco que podem ser desperdiçados durante transações muito longas. Quando as transações são mais curtas do que deveriam ser, o problema é o excesso de I/O. Com cada `COMMIT`, o MySQL garante que cada alteração seja registrada com segurança no disco, o que envolve algum I/O.

- Para a maioria das operações nas tabelas do `InnoDB`, você deve usar a configuração `autocommit=0`. Do ponto de vista de eficiência, isso evita o I/O desnecessário quando você emite um grande número de instruções consecutivas de `INSERT`, `UPDATE` ou `DELETE`. Do ponto de vista de segurança, isso permite emitir uma instrução `ROLLBACK` para recuperar dados perdidos ou distorcidos se você cometer um erro na linha de comando do **mysql** ou em um manipulador de exceções em sua aplicação.

- `autocommit=1` é adequado para tabelas `InnoDB` ao executar uma sequência de consultas para gerar relatórios ou analisar estatísticas. Nessa situação, não há penalidade de I/O relacionada a `COMMIT` ou `ROLLBACK`, e o `InnoDB` pode otimizar automaticamente o trabalho de leitura somente.

- Se você fizer uma série de alterações relacionadas, finalize todas as alterações de uma vez com um único `COMMIT` no final. Por exemplo, se você inserir informações relacionadas em várias tabelas, faça um único `COMMIT` após fazer todas as alterações. Ou se você executar muitas declarações `INSERT` consecutivas, faça um único `COMMIT` após todos os dados serem carregados; se você estiver fazendo milhões de declarações `INSERT`, talvez divida a enorme transação emitindo um `COMMIT` a cada dez mil ou cem mil registros, para que a transação não fique muito grande.

- Lembre-se de que até mesmo uma instrução `SELECT` abre uma transação, então, após executar algum relatório ou depurar consultas em uma sessão interativa do **mysql**, execute um `COMMIT` ou feche a sessão do **mysql**.

Para informações relacionadas, consulte a Seção 14.7.2.2, “autocommit, Commit e Rollback”.

##### Lidando com Deadlocks

Você pode ver mensagens de aviso referindo-se a “bloqueios” no log de erro do MySQL, ou a saída do `SHOW ENGINE INNODB STATUS`. Um bloqueio não é um problema sério para as tabelas `InnoDB`, e muitas vezes não requer nenhuma ação corretiva. Quando duas transações começam a modificar várias tabelas, acessando as tabelas em uma ordem diferente, elas podem chegar a um estado em que cada transação está esperando a outra e nenhuma pode prosseguir. Quando a detecção de bloqueio é habilitada (o padrão), o MySQL detecta imediatamente essa condição e cancela (reverte) a transação “menor”, permitindo que a outra prossiga. Se a detecção de bloqueio é desabilitada usando a opção de configuração `innodb_deadlock_detect`, o `InnoDB` depende do ajuste `innodb_lock_wait_timeout` para reverter transações em caso de bloqueio.

De qualquer forma, suas aplicações precisam de lógica de tratamento de erros para reiniciar uma transação que seja cancelada forçadamente devido a um deadlock. Quando você emitir novamente as mesmas instruções SQL do antes, o problema de sincronização original não se aplica mais. Ou a outra transação já terminou e a sua pode prosseguir, ou a outra transação ainda está em andamento e sua transação aguarda até ela terminar.

Se os avisos de impasse ocorrerem constantemente, você pode revisar o código do aplicativo para reorganizar as operações SQL de maneira consistente ou para encurtar as transações. Você pode testar com a opção `innodb_print_all_deadlocks` habilitada para ver todos os avisos de impasse no log de erro do MySQL, em vez de apenas o último aviso na saída do `SHOW ENGINE INNODB STATUS`.

Para obter mais informações, consulte a Seção 14.7.5, "Bloqueios em InnoDB".

##### Organização de Armazenamento

Para obter o melhor desempenho das tabelas do `InnoDB`, você pode ajustar vários parâmetros relacionados ao layout de armazenamento.

Quando você converte tabelas `MyISAM` que são grandes, acessadas com frequência e contêm dados importantes, investigue e considere as variáveis `innodb_file_per_table`, `innodb_file_format` e `innodb_page_size`, além das cláusulas `ROW_FORMAT` e `KEY_BLOCK_SIZE` da instrução `CREATE TABLE`.

Durante seus experimentos iniciais, o ajuste mais importante é `innodb_file_per_table`. Quando este ajuste é habilitado, o que é o padrão a partir do MySQL 5.6.6, novas tabelas `InnoDB` são criadas implicitamente nos espaços de tabelas por arquivo. Em contraste com o espaço de tabelas do sistema `InnoDB`, os espaços de tabelas por arquivo permitem que o espaço em disco seja recuperado pelo sistema operacional quando uma tabela é truncada ou excluída. Os espaços de tabelas por arquivo também suportam o formato de arquivo Barracuda e recursos associados, como compressão de tabela, armazenamento eficiente fora da página para colunas de comprimento variável longo e prefixos de índice grandes. Para mais informações, consulte a Seção 14.6.3.2, “Espaços de Tabelas por Arquivo”.

Você também pode armazenar tabelas do `InnoDB` em um espaço de tabelas geral compartilhado. Os espaços de tabelas gerais suportam o formato de arquivo Barracuda e podem conter várias tabelas. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

##### Converter uma tabela existente

Para converter uma tabela que não é do tipo `InnoDB` para usar o `InnoDB`, use `ALTER TABLE`:

```sql
ALTER TABLE table_name ENGINE=InnoDB;
```

Aviso

*Não* converta as tabelas do sistema MySQL no banco de dados `mysql` de `MyISAM` para tabelas `InnoDB`. Esta é uma operação não suportada. Se você fizer isso, o MySQL não será reiniciado até que você restaure as tabelas do sistema antigas de um backup ou as gere novamente reiniciando o diretório de dados (consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”).

##### Clonar a estrutura de uma tabela

Você pode criar uma tabela `InnoDB` que seja um clone de uma tabela MyISAM, em vez de usar `ALTER TABLE` para realizar a conversão, para testar as tabelas antiga e nova lado a lado antes de fazer a mudança.

Crie uma tabela `InnoDB` vazia com definições de coluna e índice idênticas. Use `SHOW CREATE TABLE table_name\G` para ver a declaração completa `CREATE TABLE` a ser usada. Mude a cláusula `ENGINE` para `ENGINE=INNODB`.

##### Transferir dados

Para transferir um grande volume de dados para uma tabela `InnoDB` vazia criada conforme mostrado na seção anterior, insira as linhas com `INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns`.

Você também pode criar os índices para a tabela `InnoDB` após inserir os dados. Historicamente, criar novos índices secundários era uma operação lenta para o `InnoDB`, mas agora você pode criar os índices após o carregamento dos dados com um custo relativamente baixo em relação à etapa de criação do índice.

Se você tiver restrições `UNIQUE` em chaves secundárias, você pode acelerar a importação de uma tabela desativando temporariamente as verificações de unicidade durante a operação de importação:

```sql
SET unique_checks=0;
... import operation ...
SET unique_checks=1;
```

Para tabelas grandes, isso economiza o I/O de disco porque o `InnoDB` pode usar seu buffer de alterações para escrever registros de índice secundário em lote. Certifique-se de que os dados não contenham chaves duplicadas. `unique_checks` permite, mas não exige, que os mecanismos de armazenamento ignorem chaves duplicadas.

Para ter um melhor controle sobre o processo de inserção, você pode inserir grandes tabelas em partes:

```sql
INSERT INTO newtable SELECT * FROM oldtable
   WHERE yourkey > something AND yourkey <= somethingelse;
```

Depois que todos os registros forem inseridos, você pode renomear as tabelas.

Durante a conversão de grandes tabelas, aumente o tamanho do pool de buffers do `InnoDB` para reduzir o I/O de disco. Normalmente, o tamanho recomendado do pool de buffers é de 50% a 75% da memória do sistema. Você também pode aumentar o tamanho dos arquivos de log do `InnoDB`.

##### Requisitos de Armazenamento

Se você pretende fazer várias cópias temporárias de seus dados nas tabelas `InnoDB` durante o processo de conversão, é recomendável que você crie as tabelas em espaços de tabelas por arquivo para que possa recuperar o espaço em disco quando você excluir as tabelas. Quando a opção de configuração `innodb_file_per_table` está habilitada (o padrão), as tabelas `InnoDB` recém-criadas são criadas implicitamente em espaços de tabelas por arquivo.

Se você converter a tabela `MyISAM` diretamente ou criar uma tabela `InnoDB` clonada, certifique-se de que você tem espaço suficiente no disco para armazenar tanto as tabelas antigas quanto as novas durante o processo. **As tabelas `InnoDB` requerem mais espaço no disco do que as tabelas `MyISAM`.** Se uma operação `ALTER TABLE` ficar sem espaço, ela inicia um rollback, e isso pode levar horas se estiver vinculado ao disco. Para inserções, o `InnoDB` usa o buffer de inserção para combinar registros de índice secundário com índices em lotes. Isso economiza muito I/O no disco. Para rollback, não é usado nenhum mecanismo desse tipo, e o rollback pode levar 30 vezes mais tempo do que a inserção.

No caso de um rollback inesperado, se você não tiver dados valiosos em seu banco de dados, pode ser aconselhável interromper o processo do banco de dados em vez de esperar que milhões de operações de E/S de disco sejam concluídas. Para o procedimento completo, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”.

##### Definindo Chaves Primárias

A cláusula `PRIMARY KEY` é um fator crítico que afeta o desempenho das consultas do MySQL e o uso de espaço para tabelas e índices. A chave primária identifica de forma única uma linha em uma tabela. Cada linha da tabela deve ter um valor de chave primária e nenhuma linha pode ter o mesmo valor de chave primária.

Estas são as diretrizes para a chave primária, seguidas por explicações mais detalhadas.

- Declare uma `PRIMARY KEY` para cada tabela. Tipicamente, é a coluna mais importante que você se refere nas cláusulas `WHERE` ao buscar uma única linha.

- Declare a cláusula `PRIMARY KEY` na declaração original `CREATE TABLE`, em vez de adicioná-la mais tarde por meio de uma declaração `ALTER TABLE`.

- Escolha a coluna e seu tipo de dado com cuidado. Prefira colunas numéricas em vez de colunas de caracteres ou de strings.

- Considere usar uma coluna de autoincremento se não houver outra coluna estável, única, não nula e numérica para usar.

- Uma coluna de autoincremento também é uma boa escolha se houver alguma dúvida sobre se o valor da coluna da chave primária poderá mudar alguma vez. Alterar o valor de uma coluna da chave primária é uma operação cara, que pode envolver a reorganização de dados dentro da tabela e em cada índice secundário.

Considere adicionar uma chave primária a qualquer tabela que ainda não a tenha. Use o menor tipo numérico prático possível, com base no tamanho máximo projetado da tabela. Isso pode tornar cada linha um pouco mais compacta, o que pode resultar em economia de espaço substancial para tabelas grandes. A economia de espaço é multiplicada se a tabela tiver algum índice secundário, porque o valor da chave primária é repetido em cada entrada do índice secundário. Além de reduzir o tamanho dos dados no disco, uma chave primária pequena também permite que mais dados sejam armazenados no pool de buffers, acelerando todos os tipos de operações e melhorando a concorrência.

Se a tabela já tiver uma chave primária em uma coluna mais longa, como uma `VARCHAR`, considere adicionar uma nova coluna `AUTO_INCREMENT` não assinada e mudar a chave primária para essa coluna, mesmo que essa coluna não seja referenciada em consultas. Essa mudança de design pode produzir economias substanciais de espaço nos índices secundários. Você pode designar as colunas antigas da chave primária como `UNIQUE NOT NULL` para impor as mesmas restrições que a cláusula `PRIMARY KEY`, ou seja, para evitar valores duplicados ou nulos em todas essas colunas.

Se você espalhar informações relacionadas em várias tabelas, normalmente cada tabela usa a mesma coluna como chave primária. Por exemplo, um banco de dados de pessoal pode ter várias tabelas, cada uma com uma chave primária de número de funcionário. Um banco de dados de vendas pode ter algumas tabelas com uma chave primária de número de cliente e outras tabelas com uma chave primária de número de pedido. Como as consultas de junção usando a chave primária são muito rápidas, você pode construir consultas de junção eficientes para essas tabelas.

Se você omitir completamente a cláusula `PRIMARY KEY`, o MySQL criará uma invisível para você. É um valor de 6 bytes que pode ser mais longo do que você precisa, desperdiçando espaço. Como ele está oculto, você não pode referenciá-lo em consultas.

##### Considerações sobre o desempenho da aplicação

As características de confiabilidade e escalabilidade do `InnoDB` exigem mais armazenamento em disco do que as tabelas equivalentes do `MyISAM`. Você pode alterar as definições de colunas e índices levemente, para uma melhor utilização do espaço, redução do consumo de I/O e memória ao processar conjuntos de resultados e melhores planos de otimização de consultas que fazem uso eficiente das consultas de busca de índice.

Se você configurar uma coluna de ID numérico para a chave primária, use esse valor para fazer uma referência cruzada com valores relacionados em quaisquer outras tabelas, especialmente para consultas de junção. Por exemplo, em vez de aceitar um nome de país como entrada e fazer consultas que buscam o mesmo nome, faça uma consulta para determinar o ID do país, depois faça outras consultas (ou uma única consulta de junção) para buscar informações relevantes em várias tabelas. Em vez de armazenar um número de cliente ou item de catálogo como uma string de dígitos, potencialmente consumindo vários bytes, converta-o em um ID numérico para armazenamento e consulta. Uma coluna de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT" de 4 bytes pode indexar mais de 4 bilhões de itens (com o significado de bilhão nos EUA: 1.000 milhões). Para as faixas dos diferentes tipos de inteiros, consulte a Seção 11.1.2, “Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT” - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

##### Entendendo os arquivos associados às tabelas InnoDB

Os arquivos `InnoDB` exigem mais cuidado e planejamento do que os arquivos `MyISAM`.

- Você não deve excluir os arquivos ibdata que representam o espaço de tabela do sistema `InnoDB`.

- Os métodos para mover ou copiar tabelas do InnoDB para um servidor diferente estão descritos na Seção 14.6.1.4, "Movendo ou Copiando Tabelas InnoDB".
