### 8.3.7 Coleta de Estatísticas de Index de InnoDB e MyISAM

Storage engines coletam estatísticas sobre tabelas para uso pelo optimizer. As estatísticas de tabela são baseadas em grupos de valores (*value groups*), onde um grupo de valores é um conjunto de linhas com o mesmo prefixo de chave (*key prefix*) de valor. Para fins do optimizer, uma estatística importante é o tamanho médio do grupo de valores.

O MySQL usa o tamanho médio do grupo de valores das seguintes maneiras:

* Para estimar quantas linhas devem ser lidas para cada acesso `ref`

* Para estimar quantas linhas um JOIN parcial produz; ou seja, o número de linhas que uma operação deste formato produz:

  ```sql
  (...) JOIN tbl_name ON tbl_name.key = expr
  ```

À medida que o tamanho médio do grupo de valores para um Index aumenta, o Index se torna menos útil para esses dois propósitos, pois o número médio de linhas por pesquisa (*lookup*) aumenta: Para que o Index seja bom para fins de otimização, é melhor que cada valor do Index vise um pequeno número de linhas na tabela. Quando um determinado valor de Index resulta em um grande número de linhas, o Index é menos útil e o MySQL tem menos probabilidade de usá-lo.

O tamanho médio do grupo de valores está relacionado à *cardinality* da tabela, que é o número de grupos de valores. A instrução `SHOW INDEX` exibe um valor de *cardinality* baseado em *`N/S`*, onde *`N`* é o número de linhas na tabela e *`S`* é o tamanho médio do grupo de valores. Essa razão fornece um número aproximado de grupos de valores na tabela.

Para um JOIN baseado no operador de comparação `<=>`, `NULL` não é tratado de forma diferente de qualquer outro valor: `NULL <=> NULL`, assim como `N <=> N` para qualquer outro *`N`*.

No entanto, para um JOIN baseado no operador `=`, `NULL` é diferente de valores não-`NULL`: `expr1 = expr2` não é verdadeiro quando *`expr1`* ou *`expr2`* (ou ambos) são `NULL`. Isso afeta os acessos `ref` para comparações do formato `tbl_name.key = expr`: O MySQL não acessa a tabela se o valor atual de *`expr`* for `NULL`, porque a comparação não pode ser verdadeira.

Para comparações de `=`, não importa quantos valores `NULL` existam na tabela. Para fins de otimização, o valor relevante é o tamanho médio dos grupos de valores não-`NULL`. No entanto, o MySQL atualmente não permite que esse tamanho médio seja coletado ou usado.

Para tabelas `InnoDB` e `MyISAM`, você tem algum controle sobre a coleta de estatísticas da tabela por meio das variáveis de sistema `innodb_stats_method` e `myisam_stats_method`, respectivamente. Essas variáveis têm três valores possíveis, que diferem da seguinte forma:

* Quando a variável é definida como `nulls_equal`, todos os valores `NULL` são tratados como idênticos (ou seja, todos formam um único grupo de valores).

  Se o tamanho do grupo de valores `NULL` for muito maior do que o tamanho médio do grupo de valores não-`NULL`, este método distorce o tamanho médio do grupo de valores para cima. Isso faz com que o Index pareça ser menos útil para o optimizer do que realmente é para JOINs que procuram valores não-`NULL`. Consequentemente, o método `nulls_equal` pode fazer com que o optimizer não use o Index para acessos `ref` quando deveria.

* Quando a variável é definida como `nulls_unequal`, os valores `NULL` não são considerados iguais. Em vez disso, cada valor `NULL` forma um grupo de valores separado de tamanho 1.

  Se houver muitos valores `NULL`, este método distorce o tamanho médio do grupo de valores para baixo. Se o tamanho médio do grupo de valores não-`NULL` for grande, contar cada valor `NULL` como um grupo de tamanho 1 faz com que o optimizer superestime o valor do Index para JOINs que procuram valores não-`NULL`. Consequentemente, o método `nulls_unequal` pode fazer com que o optimizer use este Index para pesquisas `ref` quando outros métodos podem ser melhores.

* Quando a variável é definida como `nulls_ignored`, os valores `NULL` são ignorados.

Se você tende a usar muitos JOINs que utilizam `<=>` em vez de `=`, os valores `NULL` não são especiais nas comparações e um `NULL` é igual ao outro. Neste caso, `nulls_equal` é o método de estatística apropriado.

A variável de sistema `innodb_stats_method` tem um valor global; a variável de sistema `myisam_stats_method` tem valores globais e de sessão. Definir o valor global afeta a coleta de estatísticas para tabelas do storage engine correspondente. Definir o valor da sessão afeta a coleta de estatísticas apenas para a conexão cliente atual. Isso significa que você pode forçar a regeneração das estatísticas de uma tabela com um determinado método sem afetar outros clientes, definindo o valor de sessão de `myisam_stats_method`.

Para regenerar as estatísticas da tabela `MyISAM`, você pode usar qualquer um dos seguintes métodos:

* Execute **myisamchk --stats_method=*`method_name`* --analyze**

* Altere a tabela para que suas estatísticas se tornem desatualizadas (por exemplo, insira uma linha e depois a exclua) e, em seguida, defina `myisam_stats_method` e emita uma instrução `ANALYZE TABLE`

Alguns alertas (*caveats*) sobre o uso de `innodb_stats_method` e `myisam_stats_method`:

* Você pode forçar a coleta explícita de estatísticas da tabela, conforme descrito. No entanto, o MySQL também pode coletar estatísticas automaticamente. Por exemplo, se durante a execução de instruções para uma tabela, algumas dessas instruções modificarem a tabela, o MySQL pode coletar estatísticas. (Isso pode ocorrer, por exemplo, para inserções ou exclusões em massa, ou algumas instruções `ALTER TABLE`.) Se isso acontecer, as estatísticas serão coletadas usando o valor que `innodb_stats_method` ou `myisam_stats_method` tiver naquele momento. Portanto, se você coletar estatísticas usando um método, mas a variável de sistema estiver definida para o outro método quando as estatísticas da tabela forem coletadas automaticamente mais tarde, o outro método será usado.

* Não há como saber qual método foi usado para gerar estatísticas para uma determinada tabela.

* Essas variáveis se aplicam apenas a tabelas `InnoDB` e `MyISAM`. Outros storage engines têm apenas um método para coletar estatísticas de tabela. Geralmente, ele é mais próximo do método `nulls_equal`.