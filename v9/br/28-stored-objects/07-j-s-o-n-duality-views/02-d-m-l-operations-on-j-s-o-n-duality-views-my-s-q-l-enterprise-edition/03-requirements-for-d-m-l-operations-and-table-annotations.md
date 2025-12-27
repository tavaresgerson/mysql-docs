#### 27.7.2.3 Requisitos para Operações DML e Annotações de Tabelas

Revise os seguintes requisitos e restrições para anotações de tabelas e operações DML em visualizações de dualidade JSON.

##### Requisitos e Restrições para Inserir Anotações

O objeto raiz e os objetos subseqüentes de um documento devem ter a anotação `INSERT`. Qualquer objeto subseqüente referenciado deve existir.

Se um objeto subseqüente for atualizado como parte de uma operação de inserção, esse objeto subseqüente deve ter a anotação `UPDATE`. *Exceção*: Se um objeto subseqüente já existir e for referenciado no objeto sendo inserido ou atualizado, nenhuma verificação de anotação é realizada.

Tentar inserir `NULL` ou um objeto vazio é rejeitado com um erro.

As operações de inserção não devem resultar em violações de restrições. Isso inclui restrições `NULL`, chave primária, chave única, verificação e chave estrangeira.

Os valores das colunas de chave primária devem ser especificados. Em alguns casos, é possível deduzir um valor de coluna de chave primária a partir de uma `JOIN`. Se os valores de chave primária não forem fornecidos e não puderem ser deduzidos a partir de uma condição de junção, a inserção é rejeitada com um erro.

Os valores de colunas que não são chaves primárias podem ser omitidos. Nesses casos, o valor padrão da coluna, se aplicável, ou `NULL` é armazenado nessas colunas.

Quando os valores das colunas usadas na condição de junção de objetos e objetos subseqüentes são especificados, os valores das colunas usadas na condição de junção devem ser os mesmos.

Se o valor para uma coluna não for especificado e fazer parte da condição de junção de um objeto subseqüente, o valor do outro operando é usado no seu lugar. Na declaração `INSERT` mostrada neste exemplo, o valor da coluna `t2.f3` não é especificado. `t2.f3` é usado na condição de junção para `ChildNode`, especificando o valor como `t1.f1`. Neste caso, `t2.f3` é copiado de `t1.f1`.

```
CREATE TABLE t1 (f1 INT PRIMARY KEY, f2 INT);
CREATE TABLE t2 (f3 INT PRIMARY KEY REFERENCES t1(f1), f4 INT);

INSERT INTO t1 VALUES (1, 2);
INSERT INTO t2 VALUES (1, 200);

CREATE OR REPLACE JSON DUALITY VIEW dv1
AS
  SELECT JSON_DUALITY_OBJECT(
    WITH(INSERT, UPDATE, DELETE)
    "_id" : f3,
    "f4" : f4,
    "ChildNode" , (SELECT JSON_DUALITY_OBJECT
                    (WITH(INSERT, UPDATE)
                    "f1" : f1,
                    "f2" : f2
                      )
                   FROM t1 WHERE t1.f1 = t2.f3)
) FROM t2;

INSERT INTO dv1 VALUES('{ "f4" : 400, "ChildNode" : { "f1" : 3,  "f2" : 4 } }');
```

Como, de acordo com a definição de visão para `dv1`, as colunas usadas na condição de junção devem corresponder, o valor para `t1.f1` é copiado de `t2.f3`. Se nenhum valor for especificado para nenhuma das colunas usadas na condição de junção, a operação de inserção é rejeitada com um erro.

Da mesma forma, se uma coluna usada em uma condição de junção não for projetada na visão de dualidade JSON, o valor para a coluna que não é projetada é copiado de outra coluna usada na condição de junção.

Em alguns casos, não é permitido especificar um subobjeto completo para um objeto. Isso ocorre se uma das seguintes condições for verdadeira:

* Linhas que correspondem à condição de junção já existem na tabela do subobjeto

* Ignorar a inserção deste subobjeto não viola nenhuma restrição da tabela.

Quando o objeto raiz sendo inserido referencia apenas subobjetos existentes, então apenas o objeto raiz é inserido.

Quando o objeto raiz sendo inserido referencia apenas alguns dos subobjetos existentes, então apenas o objeto raiz é inserido. Subobjetos que não são especificados não são excluídos.

Quando o objeto raiz sendo inserido referencia subobjetos existentes e modifica algumas colunas que não fazem parte da chave primária da tabela, o objeto raiz é inserido e quaisquer subobjetos são atualizados.

Se um objeto ou subobjeto for definido na mesma tabela em qualquer nível da definição da visão de dualidade JSON, os valores das colunas devem ser os mesmos; se não forem, a operação é rejeitada com um erro.

Inserções de múltiplos objetos não são permitidas em visões de dualidade JSON.

Os seguintes tipos de declarações `INSERT` não são permitidos em visões de dualidade JSON:

* Declarações que usam `HIGH_PRIORITY` ou `DELAYED`

* Declaração `INSERT ... ON DUPLICATE KEY UPDATE`

* Declaração `INSERT ... SELECT`

##### Requisitos e Restrições para Annotações de Atualização

As operações de atualização no objeto raiz e seus subobjetos requerem a anotação `UPDATE`, e são rejeitadas com um erro sem ela. Os subobjetos referenciados devem existir.

Se um subobjeto for inserido como parte de uma operação de atualização, então o objeto deve ter a anotação `INSERT`. Caso contrário, a operação é rejeitada com um erro, com as seguintes exceções:

* Se um subobjeto já existir e for referenciado no objeto sendo atualizado, ou se for substituído por outro subobjeto existente na tabela, não é realizada uma verificação de anotações.

* Se um subobjeto for modificado e a anotação `UPDATE` não for especificada, apenas a existência do subobjeto é verificada. Não é relatado um erro por uma anotação ausente.

Se um subobjeto for um descendente de um elemento que é excluído, então o subobjeto deve ter a anotação `DELETE`.

Atualizar objetos JSON para um objeto vazio ou `NULL` não é permitido. As atualizações dos valores das colunas de chave primária do objeto raiz e subobjetos não são permitidas.

Qualquer operação de atualização que resulta em uma violação de restrição é rejeitada com um erro. Tais restrições incluem restrições `NULL`, chave primária, chave única, verificação e restrições de chave estrangeira.

Para operações de atualização, todos os valores das colunas projetadas devem ser especificados. Quaisquer subobjetos ou elementos ausentes nos subobjetos são excluídos.

Se um objeto e suas colunas de subobjetos não forem modificadas, as tabelas base são atualizadas.

Se um objeto for modificado, mas as colunas de subobjetos não forem modificadas, então apenas a tabela base do objeto é atualizada.

Se as colunas de objeto e subobjetos forem modificadas, então as tabelas base para ambos os objetos são atualizadas.

Se um novo subobjeto for inserido pela atualização, então uma nova linha é inserida na tabela do subobjeto.

Se um subobjeto existente estiver ausente (ou excluído), a linha desse subobjeto será excluída.

Se a exclusão de um objeto resultar em uma violação de restrição de tabela, a atualização será rejeitada com um erro.

A substituição de um subobjeto existente por um subobjeto existente na tabela base é suportada.

Se vários subobjetos forem projetados da mesma tabela, o mesmo valor deve ser especificado para todos esses subobjetos.

O `etag` fornecido para uma operação de atualização deve corresponder ao `etag` gerado para o mesmo objeto.

##### Requisitos e Restrições para a Exclusão de Annotações

Se um objeto raiz precisar ser excluído, então um objeto de um documento deve ter uma anotação `DELETE`.

Um subobjeto único não pode ser excluído.

Subobjetos aninhados não podem ser excluídos se a anotação `DELETE` não for especificada.

Se o subobjeto tiver uma anotação `DELETE`, todos os elementos do subobjeto aninhado devem ser excluídos.

Uma operação de exclusão será rejeitada com um erro se a restrição referencial falhar.

Subobjetos únicos não são excluídos.