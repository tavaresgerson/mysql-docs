#### 15.7.3.2. Declaração de tabela de verificação

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

O `CHECK TABLE` funciona para as tabelas `InnoDB`, `MyISAM`, `ARCHIVE` e `CSV`.

Antes de executar `CHECK TABLE` em tabelas `InnoDB`, consulte as Notas de uso de CHECK TABLE para tabelas InnoDB.

O `CHECK TABLE` é suportado para tabelas particionadas, e você pode usar `ALTER TABLE ... CHECK PARTITION` para verificar uma ou mais partições; para mais informações, consulte a Seção 15.1.9, “Instrução ALTER TABLE”, e a Seção 26.3.4, “Manutenção de Partições”.

`CHECK TABLE` ignora colunas geradas virtualmente que não estão indexadas.

- VER TABELA de Saída
- Verificar a compatibilidade da versão
- Verificar a Consistência dos Dados
- VER TABELA Notas de uso para tabelas InnoDB
- VER TÁBUA Notas de uso para tabelas MyISAM

##### VER TABELA de Saída

`CHECK TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da consulta CHECK TABLE."><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td>[[<code>Table</code>]]</td> <td>O nome da tabela</td> </tr><tr> <td>[[<code>Op</code>]]</td> <td>Sempre [[<code>check</code>]]</td> </tr><tr> <td>[[<code>Msg_type</code>]]</td> <td>[[<code>status</code>]], [[<code>error</code>]], [[<code>info</code>]], [[<code>note</code>]] ou [[<code>warning</code>]]</td> </tr><tr> <td>[[<code>Msg_text</code>]]</td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A declaração pode gerar muitas linhas de informações para cada tabela verificada. A última linha tem um valor `Msg_type` de `status` e o `Msg_text` normalmente deve ser `OK`. `Table is already up to date` significa que o mecanismo de armazenamento da tabela indicada que não era necessário verificar a tabela.

##### Verificar a compatibilidade da versão

A opção `FOR UPGRADE` verifica se as tabelas nomeadas são compatíveis com a versão atual do MySQL. Com `FOR UPGRADE`, o servidor verifica cada tabela para determinar se houve alterações incompatíveis em algum dos tipos de dados ou índices da tabela desde que a tabela foi criada. Se não houver incompatibilidade, a verificação é bem-sucedida. Caso contrário, se houver uma possível incompatibilidade, o servidor executa uma verificação completa na tabela (o que pode levar algum tempo).

Pode ocorrer incompatibilidade porque o formato de armazenamento de um tipo de dado foi alterado ou porque a ordem de classificação foi alterada. Nosso objetivo é evitar essas alterações, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões.

`FOR UPGRADE` descobre essas incompatibilidades:

- A ordem de indexação para o espaço final nas colunas `TEXT` das tabelas `InnoDB` e `MyISAM` mudou entre o MySQL 4.1 e 5.0.

- O método de armazenamento do novo tipo de dados `DECIMAL` - DECIMAL, NUMERIC") foi alterado entre o MySQL 5.0.3 e 5.0.5.

- Às vezes, são feitas alterações nos conjuntos de caracteres ou nas ordenações que exigem a reconstrução dos índices da tabela. Para obter detalhes sobre essas alterações, consulte a Seção 3.5, “Alterações no MySQL 8.0”. Para obter informações sobre a reconstrução de tabelas, consulte a Seção 3.14, “Reconstrução ou reparo de tabelas ou índices”.

- O MySQL 8.0 não suporta o tipo de dados de 2 dígitos `YEAR(2)` permitido em versões mais antigas do MySQL. Para tabelas que contêm colunas `YEAR(2)`, `CHECK TABLE` recomenda `REPAIR TABLE`, que converte colunas de 2 dígitos `YEAR(2)` em colunas de 4 dígitos `YEAR`.

- O tempo de criação do gatilho é mantido.

- Um quadro é relatado como necessitando de uma reconstrução se contiver colunas temporais antigas no formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo) e a variável de sistema `avoid_temporal_upgrade` estiver desativada. Isso ajuda o procedimento de atualização do MySQL a detectar e atualizar tabelas que contêm colunas temporais antigas. Se `avoid_temporal_upgrade` estiver habilitado, `FOR UPGRADE` ignora as colunas temporais antigas presentes na tabela; consequentemente, o procedimento de atualização não as atualiza.

  Para verificar as tabelas que contêm colunas temporais e precisam ser reconstruídas, desative `avoid_temporal_upgrade` antes de executar `CHECK TABLE ... FOR UPGRADE`.

- As advertências são emitidas para tabelas que utilizam particionamento não nativo, pois o particionamento não nativo é removido no MySQL 8.0. Veja o Capítulo 26, *Particionamento*.

##### Verificar a Consistência dos Dados

A tabela a seguir mostra as outras opções de verificação que podem ser fornecidas. Essas opções são passadas para o mecanismo de armazenamento, que pode usá-las ou ignorá-las.

<table summary="Outras opções de CHECK TABLE."><thead><tr> <th>Tipo</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>InnoDB</code>]</td> <td>Não escaneie as linhas para verificar se há links incorretos. Aplica-se às tabelas e visualizações [[PH_HTML_CODE_<code>InnoDB</code>] e [[PH_HTML_CODE_<code>EXTENDED</code>].</td> </tr><tr> <td>[[PH_HTML_CODE_<code>InnoDB</code>]</td> <td>Verifique apenas as tabelas que não foram fechadas corretamente. Ignorado para [[PH_HTML_CODE_<code>MyISAM</code>]; aplica-se apenas às tabelas e visualizações [[<code>MyISAM</code>]].</td> </tr><tr> <td>[[<code>CHANGED</code>]]</td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente. Ignorado para [[<code>InnoDB</code>]]; aplica-se apenas às tabelas e visualizações [[<code>MyISAM</code>]].</td> </tr><tr> <td>[[<code>MEDIUM</code>]]</td> <td>Faça uma varredura das linhas para verificar se os links excluídos são válidos. Isso também calcula um checksum de chave para as linhas e verifica isso com um checksum calculado para as chaves. Ignorado para [[<code>InnoDB</code>]]; aplica-se apenas às tabelas e visualizações [[<code>InnoDB</code><code>InnoDB</code>].</td> </tr><tr> <td>[[<code>EXTENDED</code>]]</td> <td>Realize uma pesquisa completa de chaves para todas as chaves de cada linha. Isso garante que a tabela seja 100% consistente, mas leva muito tempo. Ignorado para [[<code>InnoDB</code>]]; aplica-se apenas às tabelas e visualizações [[<code>MyISAM</code>]].</td> </tr></tbody></table>

Você pode combinar as opções de verificação, como no exemplo a seguir, que faz uma verificação rápida na tabela para determinar se ela foi fechada corretamente:

```
CHECK TABLE test_table FAST QUICK;
```

Nota

Se o `CHECK TABLE` não encontrar problemas com uma tabela marcada como "corrompida" ou "não fechada corretamente", o `CHECK TABLE` pode remover a marcação.

Se uma tabela estiver corrompida, o problema provavelmente está nos índices e não na parte de dados. Todos os tipos de verificação anteriores verificam os índices minuciosamente e, portanto, devem encontrar a maioria dos erros.

Para verificar uma tabela que você acredita estar correta, use as opções sem verificação ou a opção `QUICK`. Esta última deve ser usada quando você está com pressa e pode arriscar o pequeno risco de que `QUICK` não encontre um erro no arquivo de dados. (Na maioria dos casos, em uso normal, o MySQL deve encontrar qualquer erro no arquivo de dados. Se isso acontecer, a tabela é marcada como “corrompida” e não pode ser usada até que seja reparada.)

`FAST` e `CHANGED` são, na maioria das vezes, destinados a serem usados a partir de um script (por exemplo, para serem executados pelo **cron**) para verificar tabelas periodicamente. Na maioria dos casos, `FAST` deve ser preferido em detrimento de `CHANGED`. (O único caso em que não é preferido é quando você suspeita que encontrou um bug no código `MyISAM`.)

`EXTENDED` deve ser usado apenas após você ter executado uma verificação normal, mas ainda receber erros de uma tabela quando o MySQL tenta atualizar uma linha ou encontrar uma linha por chave. Isso é muito improvável se uma verificação normal tiver sido bem-sucedida.

O uso de `CHECK TABLE ... EXTENDED` pode influenciar os planos de execução gerados pelo otimizador de consultas.

Alguns problemas relatados pelo `CHECK TABLE` não podem ser corrigidos automaticamente:

- `Found row where the auto_increment column has the value 0`.

  Isso significa que você tem uma linha na tabela onde a coluna de índice `AUTO_INCREMENT` contém o valor 0. (É possível criar uma linha onde a coluna `AUTO_INCREMENT` é 0, definindo explicitamente a coluna para 0 com uma instrução `UPDATE`.

  Isso não é um erro em si, mas pode causar problemas se você decidir descartar a tabela e restaurá-la ou realizar uma `ALTER TABLE` na tabela. Nesse caso, a coluna `AUTO_INCREMENT` muda de valor de acordo com as regras das colunas `AUTO_INCREMENT`, o que pode causar problemas como um erro de chave duplicada.

  Para eliminar o aviso, execute uma instrução `UPDATE` para definir a coluna para algum valor diferente de 0.

##### VER TABELA Notas de uso para tabelas InnoDB

As seguintes notas se aplicam às tabelas `InnoDB`:

- Se o `CHECK TABLE` encontrar uma página corrompida, o servidor sai para evitar a propagação do erro (Bug #10132). Se a corrupção ocorrer em um índice secundário, mas os dados da tabela forem legíveis, a execução do `CHECK TABLE` ainda pode causar a saída do servidor.

- Se o `CHECK TABLE` encontrar um campo `DB_TRX_ID` ou `DB_ROLL_PTR` corrompido em um índice agrupado, o `CHECK TABLE` pode fazer com que o `InnoDB` acesse um registro inválido do log de desfazer, resultando em uma saída do servidor relacionada ao MVCC.

- Se o `CHECK TABLE` encontrar erros nas tabelas ou índices do `InnoDB`, ele relata um erro e, geralmente, marca o índice e, às vezes, a tabela como corrompida, impedindo o uso adicional do índice ou da tabela. Esses erros incluem um número incorreto de entradas em um índice secundário ou links incorretos.

- Se o `CHECK TABLE` encontrar um número incorreto de entradas em um índice secundário, ele reportará um erro, mas não causará a saída do servidor ou impedirá o acesso ao arquivo.

- `CHECK TABLE` examina a estrutura da página de índice, depois examina cada entrada de chave. Ele não valida o ponteiro de chave para um registro agrupado ou segue o caminho para os ponteiros `BLOB`.

- Quando uma tabela `InnoDB` é armazenada em seu próprio arquivo `.ibd`, as primeiras 3 páginas do arquivo `.ibd` contêm informações de cabeçalho em vez de dados de tabela ou índice. A instrução `CHECK TABLE` não detecta inconsistências que afetam apenas os dados de cabeçalho. Para verificar todo o conteúdo de um arquivo `InnoDB` `.ibd`, use o comando **innochecksum**.

- Ao executar `CHECK TABLE` em grandes tabelas `InnoDB`, outros threads podem ser bloqueados durante a execução de `CHECK TABLE`. Para evitar tempos de espera, o limiar de espera do semaforo (600 segundos) é estendido por 2 horas (7200 segundos) para operações de `CHECK TABLE`. Se `InnoDB` detectar espera de semaforo de 240 segundos ou mais, ele começa a imprimir a saída do monitor `InnoDB` no log de erros. Se uma solicitação de bloqueio for maior que o limiar de espera do semaforo, `InnoDB` interrompe o processo. Para evitar completamente a possibilidade de um tempo de espera de espera do semaforo, execute `CHECK TABLE QUICK` em vez de `CHECK TABLE`.

- A funcionalidade `CHECK TABLE` para os índices `InnoDB` `SPATIAL` inclui uma verificação de validade do R-tree e uma verificação para garantir que o número de linhas do R-tree corresponda ao índice agrupado.

- O `CHECK TABLE` suporta índices secundários em colunas geradas virtualmente, que são suportados pelo `InnoDB`.

- A partir do MySQL 8.0.14, o `InnoDB` suporta leituras paralelas de índices agrupados, o que pode melhorar o desempenho do `CHECK TABLE`. O `InnoDB` lê o índice agrupado duas vezes durante uma operação de `CHECK TABLE`. A segunda leitura pode ser realizada em paralelo. A variável de sessão `innodb_parallel_read_threads` deve ser definida para um valor maior que 1 para que as leituras paralelas de índices agrupados ocorram. O valor padrão é 4. O número real de threads usados para realizar uma leitura paralela de índice agrupado é determinado pelo ajuste `innodb_parallel_read_threads` ou pelo número de subárvores de índice a serem verificadas, o menor dos dois valores.

##### VER TÁBUA Notas de uso para tabelas MyISAM

As seguintes notas se aplicam às tabelas `MyISAM`:

- `CHECK TABLE` atualiza as estatísticas-chave para as tabelas `MyISAM`.

- Se a saída `CHECK TABLE` não retornar `OK` ou `Table is already up to date`, você normalmente deve executar uma reparação da tabela. Veja a Seção 9.6, “Manutenção e Recuperação de Falhas da Tabela MyISAM”.

- Se nenhuma das opções `CHECK TABLE` `QUICK`, `MEDIUM` ou `EXTENDED` for especificada, o tipo de verificação padrão para tabelas de formato dinâmico `MyISAM` é `MEDIUM`. Isso tem o mesmo resultado que executar **myisamchk --medium-check `tbl_name`** na tabela. O tipo de verificação padrão também é `MEDIUM` para tabelas de formato estático `MyISAM`, a menos que `CHANGED` ou `FAST` seja especificado. Nesse caso, o padrão é `QUICK`. A varredura de linha é ignorada para `CHANGED` e `FAST` porque as linhas são raramente corrompidas.
