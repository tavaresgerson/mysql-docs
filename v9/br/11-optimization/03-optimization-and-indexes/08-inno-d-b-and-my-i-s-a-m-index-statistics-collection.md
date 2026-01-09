### 10.3.8 Coleta de Estatísticas de Índices InnoDB e MyISAM

Os motores de armazenamento coletam estatísticas sobre as tabelas para uso pelo otimizador. As estatísticas da tabela são baseadas em grupos de valores, onde um grupo de valores é um conjunto de linhas com o mesmo valor de prefixo de chave. Para fins de otimização, uma estatística importante é o tamanho médio do grupo de valores.

O MySQL usa o tamanho médio do grupo de valores da seguinte maneira:

* Para estimar quantas linhas devem ser lidas para cada acesso `ref`
* Para estimar quantas linhas um join parcial produz, ou seja, o número de linhas produzidas por uma operação da forma

```
  (...) JOIN tbl_name ON tbl_name.key = expr
  ```

À medida que o tamanho médio do grupo de valores de um índice aumenta, o índice é menos útil para esses dois propósitos porque o número médio de linhas por busca aumenta: Para que o índice seja útil para fins de otimização, é melhor que cada valor de índice aponte para um pequeno número de linhas na tabela. Quando um dado valor de índice produz um grande número de linhas, o índice é menos útil e o MySQL é menos propenso a usá-lo.

O tamanho médio do grupo de valores está relacionado à cardinalidade da tabela, que é o número de grupos de valores. A declaração `SHOW INDEX` exibe um valor de cardinalidade baseado em *`N/S`*, onde *`N`* é o número de linhas na tabela e *`S`* é o tamanho médio do grupo de valores. Essa proporção fornece um número aproximado de grupos de valores na tabela.

Para uma junção baseada no operador de comparação `<=>`, `NULL` não é tratado de maneira diferente de qualquer outro valor: `NULL <=> NULL`, assim como `N <=> N` para qualquer outro *`N`*.

No entanto, para uma junção baseada no operador `=` , `NULL` é diferente de valores não `NULL`: `expr1 = expr2` não é verdadeiro quando *`expr1`* ou *`expr2`* (ou ambos) são `NULL`. Isso afeta os acessos `ref` para comparações da forma `tbl_name.key = expr`: o MySQL não acessa a tabela se o valor atual de *`expr`* for `NULL`, porque a comparação não pode ser verdadeira.

Para comparações `=` , não importa quantos valores `NULL` estejam na tabela. Para fins de otimização, o valor relevante é o tamanho médio dos grupos de valores não `NULL`. No entanto, o MySQL atualmente não habilita que o tamanho médio seja coletado ou usado.

Para tabelas `InnoDB` e `MyISAM`, você tem algum controle sobre a coleta de estatísticas da tabela por meio das variáveis de sistema `innodb_stats_method` e `myisam_stats_method`, respectivamente. Essas variáveis têm três valores possíveis, que diferem da seguinte forma:

* Quando a variável é definida como `nulls_equal`, todos os valores `NULL` são tratados como idênticos (ou seja, todos formam um único grupo de valor).

  Se o tamanho do grupo de valores `NULL` for muito maior que o tamanho médio dos grupos de valores não `NULL`, esse método desvia o tamanho médio do grupo de valores para cima. Isso faz com que o índice pareça para o otimizador ser menos útil do que realmente é para junções que procuram valores não `NULL`. Consequentemente, o método `nulls_equal` pode fazer com que o otimizador não use o índice para acessos `ref` quando deveria.

* Quando a variável é definida como `nulls_unequal`, os valores `NULL` não são considerados iguais. Em vez disso, cada valor `NULL` forma um grupo de valor separado de tamanho 1.

Se você tiver muitos valores `NULL`, esse método distorcerá o tamanho do grupo de valores não `NULL`. Se o tamanho médio do grupo de valores não `NULL` for grande, contar os valores `NULL` como um grupo de tamanho 1 faz com que o otimizador superestime o valor do índice para junções que buscam valores não `NULL`. Consequentemente, o método `nulls_unequal` pode fazer com que o otimizador use esse índice para buscas `ref` quando outros métodos podem ser melhores.

* Quando a variável é definida como `nulls_ignored`, os valores `NULL` são ignorados.

Se você tende a usar muitas junções que usam `<=>` em vez de `=`, os valores `NULL` não são especiais em comparações e um `NULL` é igual a outro. Nesse caso, o método `nulls_equal` é o método estatístico apropriado.

A variável de sistema `innodb_stats_method` tem um valor global; a variável de sistema `myisam_stats_method` tem valores globais e de sessão. Definir o valor global afeta a coleta de estatísticas para tabelas do motor de armazenamento correspondente. Definir o valor de sessão afeta a coleta de estatísticas apenas para a conexão de cliente atual. Isso significa que você pode forçar a regeneração das estatísticas de uma tabela com um método específico sem afetar outros clientes definindo o valor de sessão de `myisam_stats_method`.

Para regenerar as estatísticas de tabelas `MyISAM`, você pode usar qualquer um dos seguintes métodos:

* Execute **myisamchk --stats_method=*`método_nome`* --analyze**

* Altere a tabela para fazer com que suas estatísticas fiquem desatualizadas (por exemplo, insira uma linha e depois exclua-a), e então defina `myisam_stats_method` e emita uma declaração `ANALYZE TABLE`

Algumas observações sobre o uso de `innodb_stats_method` e `myisam_stats_method`:

* Você pode forçar a coleta explícita de estatísticas de tabela, conforme descrito anteriormente. No entanto, o MySQL também pode coletar estatísticas automaticamente. Por exemplo, se, durante a execução de instruções para uma tabela, algumas dessas instruções modificarem a tabela, o MySQL pode coletar estatísticas. Isso pode ocorrer em inserções ou exclusões em massa ou em algumas instruções `ALTER TABLE`, por exemplo. Se isso acontecer, as estatísticas são coletadas usando o valor que `innodb_stats_method` ou `myisam_stats_method` tem no momento. Assim, se você coletar estatísticas usando um método, mas a variável de sistema estiver configurada para o outro método quando as estatísticas de uma tabela forem coletadas automaticamente mais tarde, o outro método será usado.

* Não há como saber qual método foi usado para gerar estatísticas para uma tabela específica.

* Essas variáveis se aplicam apenas a tabelas `InnoDB` e `MyISAM`. Outros motores de armazenamento têm apenas um método para coletar estatísticas de tabela. Geralmente, é mais próximo do método `nulls_equal`.