## 14.13 InnoDB e DDL Online

14.13.1 Operações DDL Online

14.13.2 Desempenho e Concorrência DDL Online

14.13.3 Requisitos de Espaço para DDL Online

14.13.4 Simplificando Instruções DDL com DDL Online

14.13.5 Condições de Falha DDL Online

14.13.6 Limitações do DDL Online

O recurso DDL online oferece suporte para alterações de tabela *in-place* e DML concorrente. Os benefícios desse recurso incluem:

* Melhoria da capacidade de resposta e disponibilidade em ambientes de produção ocupados, onde tornar uma tabela indisponível por minutos ou horas não é prático.

* A capacidade de ajustar o equilíbrio entre performance e concorrência durante operações DDL usando a cláusula `LOCK`. Consulte A cláusula LOCK.

* Menor uso de espaço em disco e sobrecarga de I/O do que o método de cópia de tabela.

Tipicamente, você não precisa fazer nada de especial para habilitar o DDL online. Por padrão, o MySQL executa a operação *in place*, conforme permitido, com o mínimo de *locking* possível.

Você pode controlar aspectos de uma operação DDL usando as cláusulas `ALGORITHM` e `LOCK` da instrução `ALTER TABLE`. Essas cláusulas são colocadas no final da instrução, separadas da tabela e das especificações de coluna por vírgulas. Por exemplo:

```sql
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
```

A cláusula `LOCK` é útil para ajustar o grau de acesso concorrente à tabela. A cláusula `ALGORITHM` destina-se principalmente a comparações de performance e como um recurso de *fallback* para o comportamento mais antigo de cópia de tabela, caso você encontre algum problema. Por exemplo:

* Para evitar acidentalmente tornar a tabela indisponível para leituras (*reads*), escritas (*writes*) ou ambos, especifique uma cláusula na instrução `ALTER TABLE` como `LOCK=NONE` (permite *reads* e *writes*) ou `LOCK=SHARED` (permite *reads*). A operação é interrompida imediatamente se o nível de concorrência solicitado não estiver disponível.

* Para comparar performance entre *algorithms*, execute uma instrução com `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Alternativamente, execute uma instrução com a opção de configuração `old_alter_table` desabilitada e habilitada.

* Para evitar sobrecarregar o servidor com uma operação `ALTER TABLE` que copia a tabela, inclua `ALGORITHM=INPLACE`. A instrução é interrompida imediatamente se não puder usar o mecanismo *in-place*.