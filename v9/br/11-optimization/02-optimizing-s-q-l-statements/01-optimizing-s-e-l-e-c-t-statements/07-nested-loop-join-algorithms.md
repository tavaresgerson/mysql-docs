#### 10.2.1.7 Algoritmos de Conexão de Laço Aninhado

O MySQL executa conexões entre tabelas usando um algoritmo de laço aninhado ou variações dele.

* Algoritmo de Conexão de Laço Aninhado

##### Algoritmo de Conexão de Laço Aninhado

Um algoritmo de conexão de laço aninhado (NLJ) simples lê linhas da primeira tabela em um loop uma de cada vez, passando cada linha para um laço aninhado que processa a próxima tabela na conexão. Esse processo é repetido quantas vezes houver tabelas a serem conectadas.

Suponha que uma conexão entre três tabelas `t1`, `t2` e `t3` deve ser executada usando os seguintes tipos de conexão:

```
Table   Join Type
t1      range
t2      ref
t3      ALL
```

Se um algoritmo NLJ simples for usado, a conexão é processada da seguinte forma:

```
for each row in t1 matching range {
  for each row in t2 matching reference key {
    for each row in t3 {
      if row satisfies join conditions, send to client
    }
  }
}
```

Como o algoritmo NLJ passa linhas uma de cada vez dos laços externos para os laços internos, ele geralmente lê tabelas processadas nos laços internos muitas vezes.