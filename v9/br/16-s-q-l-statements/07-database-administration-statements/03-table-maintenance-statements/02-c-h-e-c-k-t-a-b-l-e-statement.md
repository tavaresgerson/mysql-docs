#### 15.7.3.2 Instrução `CHECK TABLE`

```
CHECK TABLE tbl_name [, tbl_name] ... [option] ...

option: {
    FOR UPGRADE
  | QUICK
  | FAST
  | MEDIUM
  | EXTENDED
  | CHANGED
}
```

`CHECK TABLE` verifica uma tabela ou tabelas em busca de erros. `CHECK TABLE` também pode verificar problemas em visualizações, como tabelas que são referenciadas na definição da visualização e que não existem mais.

Para verificar uma tabela, você deve ter algum privilégio para isso.

`CHECK TABLE` funciona para tabelas `InnoDB`, `MyISAM`, `ARCHIVE` e `CSV`.

Antes de executar `CHECK TABLE` em tabelas `InnoDB`, consulte as Notas de Uso de `CHECK TABLE` para Tabelas `InnoDB`.

`CHECK TABLE` é suportado para tabelas particionadas e você pode usar `ALTER TABLE ... CHECK PARTITION` para verificar uma ou mais partições; para mais informações, consulte a Seção 15.1.11, “Instrução `ALTER TABLE`” e a Seção 26.3.4, “Manutenção de Partições”.

`CHECK TABLE` ignora colunas geradas virtualmente que não estão indexadas.

* Saída de `CHECK TABLE`
* Verificação de Compatibilidade de Versão
* Verificação de Consistência de Dados
* Notas de Uso de `CHECK TABLE` para Tabelas `InnoDB`
* Notas de Uso de `CHECK TABLE` para Tabelas `MyISAM`

##### Saída de `CHECK TABLE`

`CHECK TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados de `CHECK TABLE`."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>check</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A declaração pode gerar muitas linhas de informações para cada tabela verificada. A última linha tem um valor de `Msg_type` de `status` e o `Msg_text` normalmente deve ser `OK`. `A tabela já está atualizada` significa que o mecanismo de armazenamento da tabela indicou que não era necessário verificar a tabela.

##### Verificação de Compatibilidade de Versão

A opção `FOR UPGRADE` verifica se as tabelas nomeadas são compatíveis com a versão atual do MySQL. Com `FOR UPGRADE`, o servidor verifica cada tabela para determinar se houve alterações incompatíveis em nenhum dos tipos de dados ou índices da tabela desde que a tabela foi criada. Se não houver, a verificação é bem-sucedida. Caso contrário, se houver uma possível incompatibilidade, o servidor executa uma verificação completa na tabela (o que pode levar algum tempo).

As incompatibilidades podem ocorrer porque o formato de armazenamento de um tipo de dado mudou ou porque sua ordem de classificação mudou. Nosso objetivo é evitar essas mudanças, mas ocasionalmente elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre versões.

`FOR UPGRADE` descobre essas incompatibilidades:

* A ordem de indexação para end-space em colunas `TEXT` para tabelas `InnoDB` e `MyISAM` mudou entre MySQL 4.1 e 5.0.

* O método de armazenamento do novo tipo de dado `DECIMAL` - DECIMAL, NUMERIC") mudou entre MySQL 5.0.3 e 5.0.5.

* Alterações são feitas às vezes em conjuntos de caracteres ou colatações que exigem que os índices da tabela sejam reconstruídos. Para detalhes sobre tais alterações, consulte a Seção 3.5, “Alterações no MySQL 9.5”. Para informações sobre a reconstrução de tabelas, consulte a Seção 3.14, “Reconstrução ou Reparo de Tabelas ou Índices”.

* O MySQL 9.5 não suporta o tipo de dado `YEAR(2)` de 2 dígitos permitido em versões mais antigas do MySQL. Para tabelas que contêm colunas `YEAR(2)`, o `CHECK TABLE` recomenda `REPAIR TABLE`, que converte colunas `YEAR(2)` de 2 dígitos em colunas `YEAR` de 4 dígitos.

* O tempo de criação de gatilhos é mantido.
* Uma tabela é relatada como precisando de uma reconstrução se contiver colunas temporais antigas no formato pré-5.6.4 (`TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo). Isso ajuda o procedimento de atualização do MySQL a detectar e atualizar tabelas que contêm colunas temporais antigas.

* Alertas são emitidos para tabelas que usam particionamento não nativo, pois o particionamento não nativo é removido no MySQL 9.5. Veja o Capítulo 26, *Particionamento*.

##### Verificação da Consistência dos Dados

A tabela a seguir mostra as outras opções de verificação que podem ser fornecidas. Essas opções são passadas ao motor de armazenamento, que pode usá-las ou ignorá-las.

<table summary="Outras opções de CHECK TABLE."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Tipo</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>RÁPIDO</code></td> <td>Não verifique as linhas para verificar se os links estão incorretos. Aplica-se a tabelas e visualizações <code>InnoDB</code> e <code>MyISAM</code>.</td> </tr><tr> <td><code>FAST</code></td> <td>Verifique apenas as tabelas que não foram fechadas corretamente. Ignorado para <code>InnoDB</code>; aplica-se apenas a tabelas e visualizações <code>MyISAM</code>.</td> </tr><tr> <td><code>ALTERADO</code></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente. Ignorado para <code>InnoDB</code>; aplica-se apenas a tabelas e visualizações <code>MyISAM</code>.</td> </tr><tr> <td><code>MÉDIO</code></td> <td>Verifique as linhas para verificar que os links excluídos são válidos. Isso também calcula um checksum de chave para as linhas e verifica isso com um checksum calculado para as chaves. Ignorado para <code>InnoDB</code>; aplica-se apenas a tabelas e visualizações <code>MyISAM</code>.</td> </tr><tr> <td><code>EXTENSIVO</code></td> <td>Realize uma busca de chave completa para todas as chaves de cada linha. Isso garante que a tabela seja 100% consistente, mas leva muito tempo. Ignorado para <code>InnoDB</code>; aplica-se apenas a tabelas e visualizações <code>MyISAM</code>.</td> </tr></tbody></table>

Você pode combinar opções de verificação, como no exemplo seguinte que faz uma verificação rápida na tabela para determinar se ela foi fechada corretamente:

```
CHECK TABLE test_table FAST QUICK;
```

Nota

Se a consulta `CHECK TABLE` não encontrar problemas em uma tabela marcada como “corrompida” ou “não fechada corretamente”, ela pode remover a marcação.

Se uma tabela estiver corrompida, o problema provavelmente está nos índices e não na parte de dados. Todos os tipos de verificação anteriores verificam os índices minuciosamente e, portanto, devem encontrar a maioria dos erros.

Para verificar uma tabela que você acredita estar em ordem, use sem opções de verificação ou a opção `QUICK`. Esta última deve ser usada quando você está com pressa e pode arriscar o pequeno risco de que o `QUICK` não encontre um erro no arquivo de dados. (Na maioria dos casos, em uso normal, o MySQL deve encontrar qualquer erro no arquivo de dados. Se isso acontecer, a tabela é marcada como “corrompida” e não pode ser usada até que seja reparada.)

`FAST` e `CHANGED` são destinados principalmente para serem usados a partir de um script (por exemplo, para serem executados pelo **cron**) para verificar tabelas periodicamente. Na maioria dos casos, `FAST` deve ser preferido em relação a `CHANGED`. (O único caso em que não é preferido é quando você suspeita de ter encontrado um bug no código `MyISAM`.)

`EXTENDED` deve ser usado apenas após você ter executado uma verificação normal, mas ainda receber erros de uma tabela quando o MySQL tenta atualizar uma linha ou encontrar uma linha por chave. Isso é muito improvável se uma verificação normal tiver sido bem-sucedida.

O uso de `CHECK TABLE ... EXTENDED` pode influenciar os planos de execução gerados pelo otimizador de consultas.

Alguns problemas relatados pela `CHECK TABLE` não podem ser corrigidos automaticamente:

* `Encontrou linha onde a coluna de auto_increment tem o valor 0`.

Isso significa que você tem uma linha na tabela onde a coluna de índice `AUTO_INCREMENT` contém o valor 0. (É possível criar uma linha onde a coluna `AUTO_INCREMENT` é 0 ao definir explicitamente a coluna para 0 com uma instrução `UPDATE`.)

Isso não é um erro em si, mas pode causar problemas se você decidir descartar a tabela e restaurá-la ou realizar uma alteração na tabela usando o comando `ALTER TABLE`. Nesse caso, o valor da coluna `AUTO_INCREMENT` muda de acordo com as regras das colunas `AUTO_INCREMENT`, o que pode causar problemas como um erro de chave duplicada.

Para se livrar do aviso, execute uma instrução `UPDATE` para definir a coluna para algum valor diferente de 0.

##### Notas de uso de CHECK TABLE para tabelas InnoDB

As seguintes notas se aplicam às tabelas `InnoDB`:

* Se o `CHECK TABLE` encontrar uma página corrompida, o servidor sai para evitar a propagação do erro (Bug #10132). Se a corrupção ocorrer em um índice secundário, mas os dados da tabela forem legíveis, executar o `CHECK TABLE` ainda pode causar a saída do servidor.

* Se o `CHECK TABLE` encontrar um campo `DB_TRX_ID` ou `DB_ROLL_PTR` corrompido em um índice agrupado, o `CHECK TABLE` pode fazer com que o `InnoDB` acesse um registro inválido do log de desfazer, resultando em uma saída do servidor relacionada ao MVCC.

* Se o `CHECK TABLE` encontrar erros nas tabelas ou índices `InnoDB`, ele relata um erro e geralmente marca o índice e, às vezes, a tabela como corrompida, impedindo o uso adicional do índice ou da tabela. Esses erros incluem um número incorreto de entradas em um índice secundário ou links incorretos.

* Se o `CHECK TABLE` encontrar um número incorreto de entradas em um índice secundário, ele relata um erro, mas não causa a saída do servidor nem impede o acesso ao arquivo.

* O `CHECK TABLE` examina a estrutura da página do índice e, em seguida, examina cada entrada de chave. Ele não valida o ponteiro de chave para um registro agrupado ou segue o caminho para ponteiros `BLOB`.

* Quando uma tabela `InnoDB` é armazenada em seu próprio arquivo `.ibd`, as primeiras 3 páginas do arquivo `.ibd` contêm informações de cabeçalho em vez de dados de tabela ou índice. A instrução `CHECK TABLE` não detecta inconsistências que afetam apenas os dados de cabeçalho. Para verificar todo o conteúdo de um arquivo `.ibd` `InnoDB`, use o comando **innochecksum**.

* Ao executar `CHECK TABLE` em tabelas `InnoDB` grandes, outros threads podem ser bloqueados durante a execução de `CHECK TABLE`. Para evitar tempos de espera, o limiar de espera do semaforo (600 segundos) é estendido por 2 horas (7200 segundos) para operações `CHECK TABLE`. Se o `InnoDB` detectar espera de semaforo de 240 segundos ou mais, ele começa a imprimir a saída do monitor `InnoDB` no log de erro. Se uma solicitação de bloqueio exceder o limiar de espera do semaforo, o `InnoDB` interrompe o processo. Para evitar completamente a possibilidade de um tempo de espera de espera do semaforo, execute `CHECK TABLE QUICK` em vez de `CHECK TABLE`.

* A funcionalidade `CHECK TABLE` para índices `SPATIAL` de `InnoDB` inclui uma verificação de validade de R-tree e uma verificação para garantir que o número de linhas da R-tree corresponda ao índice agrupado.

* `CHECK TABLE` suporta índices secundários em colunas geradas virtualmente, que são suportados pelo `InnoDB`.

* O `InnoDB` suporta leituras paralelas de índices agrupados, o que pode melhorar o desempenho da `CHECK TABLE`. O `InnoDB` lê o índice agrupado duas vezes durante uma operação `CHECK TABLE`. A segunda leitura pode ser realizada em paralelo. A variável de sessão `innodb_parallel_read_threads` deve ser definida para um valor maior que 1 para que as leituras paralelas de índices agrupados ocorram. O número real de threads usados para realizar uma leitura paralela de índice agrupado é determinado pelo ajuste `innodb_parallel_read_threads` ou pelo número de subárvores de índice a serem verificadas, o menor dos dois valores.

##### Notas de Uso de CHECK TABLE para Tabelas MyISAM

As seguintes notas se aplicam às tabelas `MyISAM`:

* A opção `CHECK TABLE` atualiza as estatísticas-chave para as tabelas `MyISAM`.

* Se a saída da opção `CHECK TABLE` não retornar `OK` ou `A tabela já está atualizada`, você deve normalmente executar a reparação da tabela. Consulte a Seção 9.6, “Manutenção e Recuperação após Falha de Tabela `MyISAM`”.

* Se nenhuma das opções de `CHECK TABLE` `QUICK`, `MEDIUM` ou `EXTENDED` for especificada, o tipo de verificação padrão para tabelas `MyISAM` com formato dinâmico é `MEDIUM`. Isso tem o mesmo resultado que executar **myisamchk --medium-check *`tbl_name`*** na tabela. O tipo de verificação padrão também é `MEDIUM` para tabelas `MyISAM` com formato estático, a menos que `CHANGED` ou `FAST` seja especificado. Nesse caso, o padrão é `QUICK`. A varredura de linha é ignorada para `CHANGED` e `FAST` porque as linhas são muito raramente corrompidas.