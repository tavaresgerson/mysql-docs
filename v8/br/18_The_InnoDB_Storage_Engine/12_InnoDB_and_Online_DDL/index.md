## 17.12 InnoDB e DDL Online

17.12.1 Operações de DDL Online

17.12.1 Desempenho e Concorrência de DDL Online

17.12.3 Requisitos de Espaço para DDL Online

17.12.4 Gerenciamento de Memória DDL Online

17.12.5 Configurando Threads Paralelas para Operações DDL Online

17.12.6 Simplificando declarações DDL com DDL online

17.12.7 Condições de falha do DDL online

17.12.8 Limitações do DDL online

O recurso DDL online oferece suporte para alterações instantâneas e in loco de tabelas e DML concorrente. Os benefícios desse recurso incluem:

- Melhor resposta e disponibilidade em ambientes de produção movimentados, onde deixar uma tabela indisponível por minutos ou horas não é prático.

- Para operações em tempo real, a capacidade de ajustar o equilíbrio entre desempenho e concorrência durante operações DDL usando a cláusula `LOCK`. Veja a cláusula LOCK.

- Menos uso de espaço em disco e sobrecarga de I/O do que o método de cópia de tabela.

Nota

O suporte ao `ALGORITHM=INSTANT` está disponível para `ADD COLUMN` e outras operações no MySQL 8.0.12.

Normalmente, você não precisa fazer nada de especial para habilitar o DDL online. Por padrão, o MySQL executa a operação instantaneamente ou no local, conforme permitido, com o menor bloqueio possível.

Você pode controlar aspectos de uma operação DDL usando as cláusulas `ALGORITHM` e `LOCK` da instrução `ALTER TABLE`. Essas cláusulas são colocadas no final da instrução, separadas das especificações da tabela e das colunas por vírgulas. Por exemplo:

```
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE;
```

A cláusula `LOCK` pode ser usada para operações que são realizadas no local e é útil para ajustar o grau de acesso concorrente à tabela durante as operações. Apenas `LOCK=DEFAULT` é suportado para operações que são realizadas instantaneamente. A cláusula `ALGORITHM` é destinada principalmente para comparações de desempenho e como uma opção de fallback para o comportamento mais antigo de cópia de tabela, caso você encontre algum problema. Por exemplo:

- Para evitar que a tabela seja indisponível para leituras, escritas ou ambas durante uma operação `ALTER TABLE` em local, especifique uma cláusula na instrução `ALTER TABLE`, como `LOCK=NONE` (permitir leituras e escritas) ou `LOCK=SHARED` (permitir leituras). A operação é interrompida imediatamente se o nível de concorrência solicitado não estiver disponível.

- Para comparar o desempenho entre os algoritmos, execute uma declaração com `ALGORITHM=INSTANT`, `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Você também pode executar uma declaração com a opção de configuração `old_alter_table` habilitada para forçar o uso de `ALGORITHM=COPY`.

- Para evitar sobrecarregar o servidor com uma operação `ALTER TABLE` que copia a tabela, inclua `ALGORITHM=INSTANT` ou `ALGORITHM=INPLACE`. A instrução é interrompida imediatamente se não puder usar o algoritmo especificado.
