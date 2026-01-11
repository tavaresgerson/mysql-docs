#### 13.7.2.2. Declaração de tabela de verificação

```sql
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

`CHECK TABLE` verifica uma tabela ou tabelas em busca de erros. Para tabelas `MyISAM`, as estatísticas-chave também são atualizadas. O `CHECK TABLE` também pode verificar se há problemas em vistas, como tabelas que são referenciadas na definição da vista e que não existem mais.

Para verificar uma tabela, você deve ter algum privilégio para isso.

O botão `CHECK TABLE` funciona para tabelas de `InnoDB`, `MyISAM`, `ARCHIVE` e `CSV`.

Antes de executar `CHECK TABLE` em tabelas `InnoDB`, consulte as Observações de uso de CHECK TABLE para tabelas InnoDB.

A opção `CHECK TABLE` é suportada para tabelas particionadas, e você pode usar `ALTER TABLE ... CHECK PARTITION` para verificar uma ou mais partições; para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE” e Seção 22.3.4, “Manutenção de Partições”.

`CHECK TABLE` ignora as colunas geradas virtualmente que não estão indexadas.

- VER A TABELA de Saída
- Verificar compatibilidade da versão
- Verificar Consistência dos Dados
- VER NOTAS DE USO DA Tabela para Tabelas InnoDB
- VER NOTAS DE USO DA Tabela para Tabelas MyISAM

##### VER TABELA de Saída

`CHECK TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da consulta CHECK TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>check</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code> ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A declaração pode gerar muitas linhas de informações para cada tabela verificada. A última linha tem um valor de `Msg_type` de `status` e o `Msg_text` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não receber `OK` ou `A tabela já está atualizada`, você normalmente deve executar uma reparação da tabela. Veja Seção 7.6, “Manutenção e Recuperação de Falhas de Tabela MyISAM”. `A tabela já está atualizada` significa que o mecanismo de armazenamento da tabela indicou que não era necessário verificar a tabela.

##### Verificar a compatibilidade da versão

A opção `FOR UPGRADE` verifica se as tabelas nomeadas são compatíveis com a versão atual do MySQL. Com `FOR UPGRADE`, o servidor verifica cada tabela para determinar se houve alterações incompatíveis em algum dos tipos de dados ou índices da tabela desde que a tabela foi criada. Se não houver incompatibilidades, a verificação é bem-sucedida. Caso contrário, se houver uma possível incompatibilidade, o servidor executa uma verificação completa na tabela (o que pode levar algum tempo). Se a verificação completa for bem-sucedida, o servidor marca o arquivo `.frm` da tabela com o número da versão atual do MySQL. Marcar o arquivo `.frm` garante que futuras verificações para a tabela com a mesma versão do servidor sejam rápidas.

Pode ocorrer incompatibilidade porque o formato de armazenamento de um tipo de dado foi alterado ou porque a ordem de classificação foi alterada. Nosso objetivo é evitar essas alterações, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões.

`PARA O MÚLTIPLO` descobre essas incompatibilidades:

- A ordem de indexação para o espaço final nas colunas `TEXT` (`blob.html`) para as tabelas `InnoDB` e `MyISAM` mudou entre o MySQL 4.1 e 5.0.

- O método de armazenamento do novo tipo de dados `DECIMAL` mudou entre o MySQL 5.0.3 e 5.0.5.

- Se a sua tabela foi criada por uma versão diferente do servidor MySQL daquela que você está executando atualmente, `FOR UPGRADE` indica que a tabela tem um arquivo `.frm` com uma versão incompatível. Nesse caso, o conjunto de resultados retornado pelo `CHECK TABLE` contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `Upgrade da tabela necessário. Por favor, faça "REPAIR TABLE `tbl_name\`" para corrigir isso!

- Às vezes, são feitas alterações nos conjuntos de caracteres ou nas ordenações que exigem a reconstrução dos índices da tabela. Para obter detalhes sobre essas alterações, consulte Seção 2.10.3, “Alterações no MySQL 5.7”. Para obter informações sobre a reconstrução de tabelas, consulte Seção 2.10.12, “Reconstrução ou reparo de tabelas ou índices”.

- O tipo de dados `YEAR(2)` está desatualizado e o suporte a ele foi removido no MySQL 5.7.5. Para tabelas que contêm colunas `YEAR(2)`, `CHECK TABLE` recomenda `REPAIR TABLE`, que converte colunas de dois dígitos de `YEAR(2)` em colunas de quatro dígitos de `YEAR`.

- A partir do MySQL 5.7.2, o tempo de criação de gatilhos é mantido. Se executado contra uma tabela que possui gatilhos, `CHECK TABLE ... FOR UPGRADE` exibe este aviso para cada gatilho criado antes do MySQL 5.7.2:

  ```sql
  Trigger db_name.tbl_name.trigger_name does not have CREATED attribute.
  ```

  O aviso é apenas informativo. Não há alteração no gatilho.

- A partir do MySQL 5.7.7, uma tabela é relatada como precisando ser reconstruída se contiver colunas temporais antigas no formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo) e a variável de sistema `avoid_temporal_upgrade` estiver desabilitada. Isso ajuda o procedimento de atualização do MySQL a detectar e atualizar tabelas que contêm colunas temporais antigas. Se `avoid_temporal_upgrade` estiver habilitado, o `FOR UPGRADE` ignora as colunas temporais antigas presentes na tabela; consequentemente, o procedimento de atualização não as atualiza.

  Para verificar tabelas que contêm colunas temporais e precisam ser reconstruídas, desative `avoid_temporal_upgrade` antes de executar `CHECK TABLE ... FOR UPGRADE`.

- As advertências são emitidas para tabelas que utilizam particionamento não nativo, pois o particionamento não nativo é desaconselhável no MySQL 5.7 e será removido no MySQL 8.0. Consulte [Capítulo 22, *Particionamento*] (partitioning.html).

##### Verificar a Consistência dos Dados

A tabela a seguir mostra as outras opções de verificação que podem ser fornecidas. Essas opções são passadas para o mecanismo de armazenamento, que pode usá-las ou ignorá-las.

<table summary="Outras opções de CHECK TABLE."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Tipo</th> <th>Significado</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>InnoDB</code>]</td> <td>Não escaneie as linhas para verificar se há links incorretos. Aplica-se às tabelas e visualizações PH_HTML_CODE_<code>InnoDB</code>] e PH_HTML_CODE_<code>EXTENDED</code>].</td> </tr><tr> <td>PH_HTML_CODE_<code>InnoDB</code>]</td> <td>Verifique apenas as tabelas que não foram fechadas corretamente. Ignorado para PH_HTML_CODE_<code>MyISAM</code>]; aplica-se apenas às tabelas e visualizações <code>MyISAM</code>.</td> </tr><tr> <td><code>CHANGED</code></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente. Ignorado para <code>InnoDB</code>; aplica-se apenas às tabelas e visualizações <code>MyISAM</code>.</td> </tr><tr> <td><code>MEDIUM</code></td> <td>Faça uma varredura das linhas para verificar se os links excluídos são válidos. Isso também calcula um checksum de chave para as linhas e verifica isso com um checksum calculado para as chaves. Ignorado para <code>InnoDB</code>; aplica-se apenas às tabelas e visualizações <code>InnoDB</code><code>InnoDB</code>].</td> </tr><tr> <td><code>EXTENDED</code></td> <td>Realize uma pesquisa completa de chaves para todas as chaves de cada linha. Isso garante que a tabela seja 100% consistente, mas leva muito tempo. Ignorado para <code>InnoDB</code>; aplica-se apenas às tabelas e visualizações <code>MyISAM</code>.</td> </tr></tbody></table>

Se nenhuma das opções `QUÍNCIO`, `MÉDIO` ou `EXTENSIVO` for especificada, o tipo de verificação padrão para tabelas `MyISAM` com formato dinâmico é `MÉDIO`. Isso tem o mesmo resultado que executar **myisamchk --medium-check `tbl_name`**\* na tabela. O tipo de verificação padrão também é `MÉDIO` para tabelas `MyISAM` com formato estático, a menos que `ALTERADO` ou `RÁPIDO` seja especificado. Nesse caso, o padrão é `QUÍNCIO`. A varredura de linha é ignorada para `ALTERADO` e `RÁPIDO` porque as linhas são raramente corrompidas.

Você pode combinar as opções de verificação, como no exemplo a seguir, que faz uma verificação rápida na tabela para determinar se ela foi fechada corretamente:

```sql
CHECK TABLE test_table FAST QUICK;
```

Nota

Se o `CHECK TABLE` não encontrar problemas com uma tabela marcada como “corrompida” ou “não fechada corretamente”, o `CHECK TABLE` pode remover a marcação.

Se uma tabela estiver corrompida, o problema provavelmente está nos índices e não na parte de dados. Todos os tipos de verificação anteriores verificam os índices minuciosamente e, portanto, devem encontrar a maioria dos erros.

Para verificar uma tabela que você acredita estar correta, use as opções sem verificação ou a opção `QUICK`. Esta última deve ser usada quando você está com pressa e pode arriscar o pequeno risco de que o `QUICK` não encontre um erro no arquivo de dados. (Na maioria dos casos, em uso normal, o MySQL deve encontrar qualquer erro no arquivo de dados. Se isso acontecer, a tabela é marcada como “corrompida” e não pode ser usada até que seja reparada.)

`FAST` e `CHANGED` são, na maioria das vezes, destinados a serem usados a partir de um script (por exemplo, para serem executados pelo **cron**) para verificar as tabelas periodicamente. Na maioria dos casos, `FAST` deve ser preferido em vez de `CHANGED`. (O único caso em que isso não é preferível é quando você suspeita que encontrou um bug no código `MyISAM`.)

`EXTENDED` deve ser usado apenas após você ter executado uma verificação normal, mas ainda receber erros de uma tabela quando o MySQL tenta atualizar uma linha ou encontrar uma linha por chave. Isso é muito improvável se uma verificação normal tiver sido bem-sucedida.

O uso de `CHECK TABLE ... EXTENDED` pode influenciar os planos de execução gerados pelo otimizador de consultas.

Alguns problemas relatados por `CHECK TABLE` não podem ser corrigidos automaticamente:

- "Encontrou uma linha onde a coluna auto_increment tem o valor 0".

  Isso significa que você tem uma linha na tabela onde a coluna do índice `AUTO_INCREMENT` contém o valor 0. (É possível criar uma linha onde a coluna `AUTO_INCREMENT` é 0, definindo explicitamente a coluna para 0 com uma instrução `[UPDATE]` (update.html).)

  Isso não é um erro em si, mas pode causar problemas se você decidir descartar a tabela e restaurá-la ou realizar uma alteração no `ALTER TABLE` da tabela. Nesse caso, o valor da coluna `AUTO_INCREMENT` muda de acordo com as regras das colunas `AUTO_INCREMENT`, o que pode causar problemas como um erro de chave duplicada.

  Para eliminar a mensagem de aviso, execute uma instrução `UPDATE` para definir a coluna para um valor diferente de 0.

##### VER TABELA Notas de uso para tabelas InnoDB

As seguintes notas se aplicam às tabelas de `InnoDB`:

- Se o `CHECK TABLE` encontrar uma página corrompida, o servidor sai para evitar a propagação do erro (Bug #10132). Se a corrupção ocorrer em um índice secundário, mas os dados da tabela forem legíveis, a execução do `CHECK TABLE` ainda pode causar a saída do servidor.

- Se o `CHECK TABLE` encontrar um campo `DB_TRX_ID` ou `DB_ROLL_PTR` corrompido em um índice agrupado, o `CHECK TABLE` pode fazer com que o `InnoDB` acesse um registro inválido do log de desfazer, resultando em uma saída do servidor relacionada ao MVCC.

- Se o `CHECK TABLE` encontrar erros nas tabelas ou índices do `InnoDB`, ele relata um erro e, geralmente, marca o índice e, às vezes, a tabela como corrompida, impedindo o uso adicional do índice ou da tabela. Esses erros incluem um número incorreto de entradas em um índice secundário ou links incorretos.

- Se o `CHECK TABLE` encontrar um número incorreto de entradas em um índice secundário, ele reportará um erro, mas não causará a saída do servidor ou impedirá o acesso ao arquivo.

- `CHECK TABLE` examina a estrutura da página de índice, depois examina cada entrada de chave. Ele não valida o ponteiro de chave para um registro agrupado ou segue o caminho para os ponteiros de `BLOB`.

- Quando uma tabela `InnoDB` é armazenada em seu próprio arquivo `.ibd` (glossary.html#glos_ibd_file), as primeiras 3 páginas do arquivo `.ibd` contêm informações de cabeçalho em vez de dados de tabela ou índice. A instrução `CHECK TABLE` não detecta inconsistências que afetam apenas os dados de cabeçalho. Para verificar todo o conteúdo de um arquivo `.ibd` `InnoDB`, use o comando **innochecksum**.

- Ao executar `CHECK TABLE` em tabelas grandes do `InnoDB`, outros threads podem ser bloqueados durante a execução de `CHECK TABLE`. Para evitar tempos de espera, o limiar de espera do semaforo (600 segundos) é estendido por 2 horas (7200 segundos) para as operações de `CHECK TABLE`. Se o `InnoDB` detectar espera de semaforo de 240 segundos ou mais, ele começa a imprimir a saída do monitor do `InnoDB` no log de erro. Se uma solicitação de bloqueio exceder o limiar de espera do semaforo, o `InnoDB` interrompe o processo. Para evitar completamente a possibilidade de um tempo de espera de espera do semaforo, execute `CHECK TABLE QUICK` em vez de `CHECK TABLE`.

- A funcionalidade `VER TABELA` para índices `SPATIAL` do `InnoDB` inclui uma verificação de validade do R-tree e uma verificação para garantir que o número de linhas do R-tree corresponda ao índice agrupado.

- O `CHECK TABLE` suporta índices secundários em colunas geradas virtualmente, que são suportadas pelo `InnoDB`.

##### VER TÁBUA Notas de uso para tabelas MyISAM

As seguintes notas se aplicam às tabelas `MyISAM`:

- `CHECK TABLE` atualiza as estatísticas principais para as tabelas `MyISAM`.

- Se a saída do comando `CHECK TABLE` não retornar `OK` ou `A tabela já está atualizada`, você normalmente deve executar uma reparação da tabela. Veja Seção 7.6, “Manutenção e Recuperação de Falhas da Tabela MyISAM”.

- Se nenhuma das opções `QUICK`, `MEDIUM` ou `EXTENDED` do `CHECK TABLE` for especificada, o tipo de verificação padrão para tabelas `MyISAM` com formato dinâmico é `MEDIUM`. Isso tem o mesmo resultado que executar **myisamchk --medium-check *`tbl_name`*** na tabela. O tipo de verificação padrão também é `MEDIUM` para tabelas `MyISAM` com formato estático, a menos que `CHANGED` ou `FAST` seja especificado. Nesse caso, o padrão é `QUICK`. A varredura de linha é ignorada para `CHANGED` e `FAST` porque as linhas são raramente corrompidas.
