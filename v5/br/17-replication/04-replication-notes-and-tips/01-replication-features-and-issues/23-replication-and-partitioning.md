#### 16.4.1.23 Replicação e Partição

A replicação é suportada entre tabelas particionadas, desde que utilizem o mesmo esquema de particionamento e, de outra forma, tenham a mesma estrutura, exceto quando uma exceção é especificamente permitida (consulte Seção 16.4.1.10, “Replicação com Definições de Tabelas Diferentes na Fonte e na Replicação”).

A replicação entre tabelas com particionamento diferente geralmente não é suportada. Isso ocorre porque instruções (como `ALTER TABLE ... DROP PARTITION`) que atuam diretamente nas particionações nesses casos podem produzir resultados diferentes na fonte e na replica. No caso em que uma tabela é particionada na fonte, mas não na replica, quaisquer instruções que operam nas particionações na cópia da fonte da replica falham na replica. Quando a cópia da replica da tabela está particionada, mas a cópia da fonte não, as instruções que atuam nas particionações não podem ser executadas na fonte sem causar erros.

Devido a esses perigos de causar o fracasso total da replicação (devido a declarações falhas) e de inconsistências (quando o resultado de uma instrução SQL de nível de partição produz resultados diferentes na fonte e na replica), recomendamos que você garanta que a partição de quaisquer tabelas a serem replicadas da fonte seja correspondida pelas versões dessas tabelas da replica.
