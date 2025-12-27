## 17.12 DDL Online

17.12.1 Operações de DDL Online

17.12.2 Desempenho e Concorrência do DDL Online

17.12.3 Requisitos de Espaço do DDL Online

17.12.4 Gerenciamento de Memória do DDL Online

17.12.5 Configuração de Threads Paralelos para Operações de DDL Online

17.12.6 Simplificação de Declarações de DDL com DDL Online

17.12.7 Condições de Falha do DDL Online

17.12.8 Limitações do DDL Online

O recurso DDL online oferece suporte para alterações instantâneas e in-place de tabelas e DML concorrente. Os benefícios dessa funcionalidade incluem:

* Melhoria da capacidade de resposta e disponibilidade em ambientes de produção movimentados, onde tornar uma tabela indisponível por minutos ou horas não é prático.

* Para operações in-place, a capacidade de ajustar o equilíbrio entre desempenho e concorrência durante as operações de DDL usando a cláusula `LOCK`. Consulte a cláusula LOCK.

* Menos uso de espaço em disco e overhead de I/O do que o método de cópia de tabela.

Normalmente, você não precisa fazer nada especial para habilitar o DDL online. Por padrão, o MySQL executa a operação instantaneamente ou in-place, conforme permitido, com o menor bloqueio possível.

Você pode controlar aspectos de uma operação de DDL usando as cláusulas `ALGORITHM` e `LOCK` da instrução `ALTER TABLE`. Essas cláusulas são colocadas no final da instrução, separadas das especificações da tabela e das colunas por vírgulas. Por exemplo:

```
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE;
```

A cláusula `LOCK` pode ser usada para operações que são executadas in-place e é útil para ajustar o grau de acesso concorrente à tabela durante as operações. Apenas `LOCK=DEFAULT` é suportado para operações que são executadas instantaneamente. A cláusula `ALGORITHM` é principalmente destinada para comparações de desempenho e como fallback para o comportamento mais antigo de cópia de tabela, caso você encontre algum problema. Por exemplo:

* Para evitar que a tabela seja indisponível para leituras, escritas ou ambas durante uma operação de `ALTER TABLE` in-place, especifique uma cláusula na instrução `ALTER TABLE`, como `LOCK=NONE` (permitir leituras e escritas) ou `LOCK=SHARED` (permitir leituras). A operação é interrompida imediatamente se o nível de concorrência solicitado não estiver disponível.

* Para comparar o desempenho entre algoritmos, execute uma instrução com `ALGORITHM=INSTANT`, `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Você também pode executar uma instrução com a opção de configuração `old_alter_table` habilitada para forçar o uso de `ALGORITHM=COPY`.

* Para evitar o bloqueio do servidor com uma operação de `ALTER TABLE` que copia a tabela, inclua `ALGORITHM=INSTANT` ou `ALGORITHM=INPLACE`. A instrução é interrompida imediatamente se não puder usar o algoritmo especificado.