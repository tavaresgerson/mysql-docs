#### 8.2.1.6 Algoritmos de Conjunção com Loop Aninhado

O MySQL executa junções entre tabelas usando um algoritmo de loop aninhado ou variações dele.

- Algoritmo de Conjunção com Loop Aninhado
- Algoritmo de Conclusão por Encadeamento de Laços Aninhados

##### Algoritmo de Conjunção com Loop Aninhado

Um algoritmo de junção por laço aninhado (NLJ) lê as linhas da primeira tabela em um loop, uma de cada vez, passando cada linha para um laço aninhado que processa a próxima tabela na junção. Esse processo é repetido tantas vezes quantas forem as tabelas que ainda precisam ser unidas.

Suponha que uma junção entre três tabelas `t1`, `t2` e `t3` deve ser executada usando os seguintes tipos de junção:

```sql
Table   Join Type
t1      range
t2      ref
t3      ALL
```

Se for utilizado um algoritmo NLJ simples, a junção é processada da seguinte forma:

```sql
for each row in t1 matching range {
  for each row in t2 matching reference key {
    for each row in t3 {
      if row satisfies join conditions, send to client
    }
  }
}
```

Como o algoritmo NLJ passa as linhas uma de cada vez dos loops externos para os loops internos, ele geralmente lê as tabelas processadas nos loops internos muitas vezes.

##### Algoritmo de Conclusão por Encadeamento de Laços Aninhados

O algoritmo de junção de laço aninhado (BNL) utiliza o buffer de linhas lidas nos laços externos para reduzir o número de vezes que as tabelas nos laços internos precisam ser lidas. Por exemplo, se 10 linhas são lidas em um buffer e o buffer é passado para o próximo laço interno, cada linha lida no laço interno pode ser comparada com todas as 10 linhas no buffer. Isso reduz em uma ordem de magnitude o número de vezes que a tabela interna precisa ser lida.

O bufferamento de junção no MySQL tem essas características:

- O uso do buffer pode ser feito quando a junção é do tipo `ALL` ou `index` (ou seja, quando não é possível usar nenhuma chave possível e uma varredura completa é realizada, seja nas linhas de dados ou nas linhas do índice, respectivamente), ou `range`. O uso do buffer também é aplicável a junções externas, conforme descrito na Seção 8.2.1.11, “Junções de Bloco de Loop Aninhado e Acesso a Chave em Bateladas”.

- Um buffer de junção nunca é alocado para a primeira tabela não constante, mesmo que ela fosse do tipo `ALL` ou `index`.

- Apenas as colunas de interesse para uma junção são armazenadas em seu buffer de junção, não as linhas inteiras.

- A variável de sistema `join_buffer_size` determina o tamanho de cada buffer de junção usado para processar uma consulta.

- Um buffer é alocado para cada junção que pode ser armazenada em cache, portanto, uma consulta específica pode ser processada usando múltiplos buffers de junção.

- Um buffer de junção é alocado antes de executar a junção e liberado após a consulta ser concluída.

Para o exemplo de junção descrito anteriormente para o algoritmo NLJ (sem bufferização), a junção é feita da seguinte forma usando bufferização de junção:

```sql
for each row in t1 matching range {
  for each row in t2 matching reference key {
    store used columns from t1, t2 in join buffer
    if buffer is full {
      for each row in t3 {
        for each t1, t2 combination in join buffer {
          if row satisfies join conditions, send to client
        }
      }
      empty join buffer
    }
  }
}

if buffer is not empty {
  for each row in t3 {
    for each t1, t2 combination in join buffer {
      if row satisfies join conditions, send to client
    }
  }
}
```

Se *`S`* é o tamanho de cada combinação `t1`, `t2` armazenada no buffer de junção e *`C`* é o número de combinações no buffer, o número de vezes que a tabela `t3` é percorrida é:

```sql
(S * C)/join_buffer_size + 1
```

O número de varreduras de `t3` diminui à medida que o valor de `join_buffer_size` aumenta, até o ponto em que `join_buffer_size` é grande o suficiente para conter todas as combinações de linhas anteriores. Nesse ponto, não há ganho de velocidade ao torná-lo maior.
