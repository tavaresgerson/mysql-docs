### 14.20.5 Restrições de função de janela

O padrão SQL impõe uma restrição às funções de janela, que não podem ser usadas em instruções `UPDATE` ou `DELETE` para atualizar linhas. O uso dessas funções em uma subconsulta dessas instruções (para selecionar linhas) é permitido.

O MySQL não suporta essas funcionalidades das funções de janela:

- Sintaxe `DISTINCT` para funções de janela agregadas.

- Funções de janela aninhadas.

- Pontos finais de quadro dinâmicos que dependem do valor da linha atual.

O analisador reconhece essas construções de janela, que, no entanto, não são suportadas:

- O especificador de unidades de quadro `GROUPS` é analisado, mas produz um erro. Apenas `ROWS` e `RANGE` são suportados.

- A cláusula `EXCLUDE` para especificação de quadro é analisada, mas produz um erro.

- `IGNORE NULLS` é analisado, mas produz um erro. Apenas `RESPECT NULLS` é suportado.

- `FROM LAST` é analisado, mas produz um erro. Apenas `FROM FIRST` é suportado.

A partir do MySQL 8.0.28, é suportado um máximo de 127 janelas para um determinado `SELECT`. Observe que uma única consulta pode usar múltiplas cláusulas `SELECT`, e cada uma dessas cláusulas suporta até 127 janelas. O número de janelas distintas é definido como a soma das janelas nomeadas e de quaisquer janelas implícitas especificadas como parte de qualquer cláusula `OVER` de uma função de janela. Você também deve estar ciente de que consultas que utilizam um grande número de janelas podem exigir o aumento do tamanho da pilha de threads padrão (variável de sistema `thread_stack`).
