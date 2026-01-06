## 14.13 InnoDB e DDL Online

14.13.1 Operações de DDL Online

14.13.2 Desempenho e Concorrência de DDL Online

14.13.3 Requisitos de Espaço para DDL Online

14.13.4 Simplificando declarações DDL com DDL online

14.13.5 Condições de falha do DDL online

14.13.6 Limitações do DDL online

O recurso DDL online oferece suporte para alterações de tabelas in-place e DML concorrente. Os benefícios desse recurso incluem:

- Melhor resposta e disponibilidade em ambientes de produção movimentados, onde deixar uma tabela indisponível por minutos ou horas não é prático.

- A capacidade de ajustar o equilíbrio entre desempenho e concorrência durante operações DDL usando a cláusula `LOCK`. Veja a cláusula LOCK.

- Menos uso de espaço em disco e sobrecarga de I/O do que o método de cópia de tabela.

Normalmente, você não precisa fazer nada de especial para habilitar o DDL online. Por padrão, o MySQL executa a operação no local, conforme permitido, com o menor bloqueio possível.

Você pode controlar aspectos de uma operação DDL usando as cláusulas `ALGORITHM` e `LOCK` da instrução `ALTER TABLE`. Essas cláusulas são colocadas no final da instrução, separadas das especificações da tabela e das colunas por vírgulas. Por exemplo:

```sql
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
```

A cláusula `LOCK` é útil para ajustar o grau de acesso concorrente à tabela. A cláusula `ALGORITHM` é destinada principalmente para comparações de desempenho e como uma opção de fallback para o comportamento mais antigo de cópia de tabela, caso você encontre algum problema. Por exemplo:

- Para evitar que a tabela seja indisponível para leituras, escritas ou ambas, especifique uma cláusula na instrução `ALTER TABLE`, como `LOCK=NONE` (permitir leituras e escritas) ou `LOCK=SHARED` (permitir leituras). A operação é interrompida imediatamente se o nível de concorrência solicitado não estiver disponível.

- Para comparar o desempenho entre algoritmos, execute uma instrução com `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Alternativamente, execute uma instrução com a opção de configuração `old_alter_table` desabilitada e habilitada.

- Para evitar o bloqueio do servidor com uma operação `ALTER TABLE` que copia a tabela, inclua `ALGORITHM=INPLACE`. A instrução pára imediatamente se não puder usar o mecanismo de implantação.
