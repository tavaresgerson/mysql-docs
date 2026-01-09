### 8.3.7 Coleta de estatísticas de índices InnoDB e MyISAM

Os motores de armazenamento coletam estatísticas sobre as tabelas para serem usadas pelo otimizador. As estatísticas da tabela são baseadas em grupos de valores, onde um grupo de valores é um conjunto de linhas com o mesmo valor do prefixo da chave. Para fins de otimização, uma estatística importante é o tamanho médio do grupo de valores.

O MySQL utiliza o tamanho médio do grupo de valores das seguintes maneiras:

- Para estimar quantas linhas devem ser lidas para cada acesso `ref`

- Para estimar quantas linhas uma junção parcial produz; ou seja, o número de linhas que uma operação dessa forma produz:

  ```sql
  (...) JOIN tbl_name ON tbl_name.key = expr
  ```

À medida que o tamanho médio do grupo de um índice aumenta, o índice se torna menos útil para esses dois propósitos, pois o número médio de linhas por consulta aumenta: para que o índice seja útil para fins de otimização, é melhor que cada valor do índice direcione para um pequeno número de linhas na tabela. Quando um determinado valor do índice gera um grande número de linhas, o índice se torna menos útil e é menos provável que o MySQL o use.

O tamanho médio do grupo de valores está relacionado à cardinalidade da tabela, que é o número de grupos de valores. A instrução `SHOW INDEX` exibe um valor de cardinalidade com base em *`N/S`*, onde *`N`* é o número de linhas na tabela e *`S`* é o tamanho médio do grupo de valores. Essa proporção fornece um número aproximado de grupos de valores na tabela.

Para uma junção baseada no operador de comparação `<=>`, o `NULL` não é tratado de forma diferente de qualquer outro valor: `NULL <=> NULL`, assim como `N <=> N` para qualquer outro `N`.

No entanto, para uma junção baseada no operador `=` , `NULL` é diferente de valores que não são `NULL`: `expr1 = expr2` não é verdadeiro quando *`expr1`* ou *`expr2`* (ou ambos) são `NULL`. Isso afeta os acessos `ref` para comparações da forma `tbl_name.key = expr`: o MySQL não acessa a tabela se o valor atual de *`expr`* for `NULL`, porque a comparação não pode ser verdadeira.

Para comparações de `=` não importa quantos valores `NULL` estão na tabela. Para fins de otimização, o valor relevante é o tamanho médio dos grupos de valores que não são `NULL`. No entanto, o MySQL atualmente não permite que esse tamanho médio seja coletado ou usado.

Para as tabelas `InnoDB` e `MyISAM`, você tem algum controle sobre a coleta de estatísticas da tabela por meio das variáveis de sistema `innodb_stats_method` e `myisam_stats_method`, respectivamente. Essas variáveis têm três valores possíveis, que diferem da seguinte forma:

- Quando a variável estiver definida como `nulls_equal`, todos os valores `NULL` serão tratados como idênticos (ou seja, todos formarão um único grupo de valores).

  Se o tamanho do grupo de valores `NULL` for muito maior que o tamanho médio do grupo de valores não `NULL`, esse método distorcerá o tamanho médio do grupo de valores, fazendo com que o índice pareça menos útil do que realmente é para junções que buscam valores não `NULL`. Consequentemente, o método `nulls_equal` pode fazer com que o otimizador não use o índice para acessos `ref` quando deveria.

- Quando a variável estiver definida como `nulls_unequal`, os valores `NULL` não serão considerados iguais. Em vez disso, cada valor `NULL` formará um grupo de valores separados com tamanho 1.

  Se você tiver muitos valores `NULL`, esse método distorcerá o tamanho do grupo de valores não `NULL` para baixo. Se o tamanho médio do grupo de valores não `NULL` for grande, contar os valores `NULL` como um grupo de tamanho 1 faz com que o otimizador superestime o valor do índice para junções que buscam valores não `NULL`. Consequentemente, o método `nulls_unequal` pode fazer com que o otimizador use esse índice para buscas `ref` quando outros métodos podem ser melhores.

- Quando a variável estiver definida como `nulls_ignored`, os valores `NULL` serão ignorados.

Se você tende a usar muitas junções que utilizam `<=>` em vez de `=`, os valores `NULL` não são especiais em comparações e um `NULL` é igual a outro. Nesse caso, `nulls_equal` é o método estatístico apropriado.

A variável de sistema `innodb_stats_method` tem um valor global; a variável de sistema `myisam_stats_method` tem valores globais e de sessão. Definir o valor global afeta a coleta de estatísticas para tabelas do motor de armazenamento correspondente. Definir o valor de sessão afeta apenas a coleta de estatísticas para a conexão atual do cliente. Isso significa que você pode forçar a regeneração das estatísticas de uma tabela com um método específico sem afetar outros clientes, definindo o valor de sessão de `myisam_stats_method`.

Para regenerar as estatísticas da tabela `MyISAM`, você pode usar qualquer um dos seguintes métodos:

- Execute **myisamchk --stats_method=*`método_nome`* --analyze**

- Altere a tabela para que suas estatísticas fiquem desatualizadas (por exemplo, insira uma linha e depois exclua-a), e, em seguida, defina `myisam_stats_method` e execute uma instrução `ANALYZE TABLE`

Alguns cuidados com o uso de `innodb_stats_method` e `myisam_stats_method`:

- Você pode forçar a coleta explícita de estatísticas de tabela, conforme descrito anteriormente. No entanto, o MySQL também pode coletar estatísticas automaticamente. Por exemplo, se, durante a execução de instruções para uma tabela, algumas dessas instruções modificarem a tabela, o MySQL pode coletar estatísticas. Isso pode ocorrer em inserções ou exclusões em massa ou em algumas instruções `ALTER TABLE`, por exemplo. Se isso acontecer, as estatísticas são coletadas usando o valor atual de `innodb_stats_method` ou `myisam_stats_method`. Assim, se você coletar estatísticas usando um método, mas a variável do sistema estiver configurada para o outro método quando as estatísticas da tabela forem coletadas automaticamente posteriormente, o outro método será usado.

- Não é possível determinar qual método foi usado para gerar estatísticas para uma tabela específica.

- Essas variáveis se aplicam apenas às tabelas `InnoDB` e `MyISAM`. Outros motores de armazenamento têm apenas um método para coletar estatísticas de tabelas. Geralmente, ele está mais próximo do método `nulls_equal`.
