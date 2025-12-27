#### 10.2.1.21 Otimização de Funções de Janela

As funções de janela afetam as estratégias consideradas pelo otimizador:

* A junção derivada de uma subconsulta é desativada se a subconsulta contiver funções de janela. A subconsulta é sempre materializada.

* Os junções semijoin não são aplicáveis à otimização de funções de janela porque os junções semijoin são aplicadas a subconsultas em `WHERE` e `JOIN ... ON`, que não podem conter funções de janela.

* O otimizador processa múltiplas janelas com os mesmos requisitos de ordenação em sequência, então o ordenamento pode ser ignorado para as janelas que vêm após a primeira.

* O otimizador não tenta mesclar janelas que poderiam ser avaliadas em uma única etapa (por exemplo, quando múltiplas cláusulas `OVER` contêm definições de janela idênticas). A solução é definir a janela em uma cláusula `WINDOW` e referenciar o nome da janela nas cláusulas `OVER`.

Uma função agregada que não é usada como função de janela é agregada na consulta mais externa possível. Por exemplo, nesta consulta, o MySQL vê que `COUNT(t1.b)` é algo que não pode existir na consulta externa devido à sua colocação na cláusula `WHERE`:

```
SELECT * FROM t1 WHERE t1.a = (SELECT COUNT(t1.b) FROM t2);
```

Consequentemente, o MySQL agrega dentro da subconsulta, tratando `t1.b` como uma constante e retornando o número de linhas de `t2`.

Substituir `WHERE` por `HAVING` resulta em um erro:

```
mysql> SELECT * FROM t1 HAVING t1.a = (SELECT COUNT(t1.b) FROM t2);
ERROR 1140 (42000): In aggregated query without GROUP BY, expression #1
of SELECT list contains nonaggregated column 'test.t1.a'; this is
incompatible with sql_mode=only_full_group_by
```

O erro ocorre porque `COUNT(t1.b)` pode existir no `HAVING`, tornando a consulta externa agregada.

As funções de janela (incluindo funções agregadas usadas como funções de janela) não têm a complexidade anterior. Elas sempre agregam na subconsulta onde são escritas, nunca na consulta externa.

A avaliação da função de janela pode ser afetada pelo valor da variável de sistema `windowing_use_high_precision`, que determina se as operações de janela devem ser realizadas sem perda de precisão. Por padrão, `windowing_use_high_precision` está habilitado.

Para alguns agregados de quadros móveis, a função de agregação inversa pode ser aplicada para remover valores do agregado. Isso pode melhorar o desempenho, mas possivelmente com perda de precisão. Por exemplo, adicionar um valor flutuante muito pequeno a um valor muito grande faz com que o valor muito pequeno seja "escondido" pelo grande valor. Quando a inversão do grande valor é realizada posteriormente, o efeito do pequeno valor é perdido.

A perda de precisão devido à agregação inversa é um fator apenas para operações em tipos de dados de ponto flutuante (valores aproximados). Para outros tipos, a agregação inversa é segura; isso inclui `DECIMAL` - DECIMAL, NUMERIC"), que permite uma parte fracionária, mas é um tipo de valor exato.

Para uma execução mais rápida, o MySQL sempre usa a agregação inversa quando é seguro:

* Para valores de ponto flutuante, a agregação inversa nem sempre é segura e pode resultar em perda de precisão. O padrão é evitar a agregação inversa, o que é mais lento, mas preserva a precisão. Se for permitido sacrificar a segurança pela velocidade, `windowing_use_high_precision` pode ser desabilitado para permitir a agregação inversa.

* Para tipos de dados não de ponto flutuante, a agregação inversa é sempre segura e é usada independentemente do valor de `windowing_use_high_precision`.

* `windowing_use_high_precision` não tem efeito em `MIN()` e `MAX()`, que não usam agregação inversa em nenhum caso.

Para a avaliação das funções de variância `STDDEV_POP()`, `STDDEV_SAMP()`, `VAR_POP()`, `VAR_SAMP()`, e seus sinônimos, a avaliação pode ocorrer no modo otimizado ou no modo padrão. O modo otimizado pode produzir resultados ligeiramente diferentes nas últimas casas decimais significativas. Se tais diferenças forem permitidas, `windowing_use_high_precision` pode ser desativado para permitir o modo otimizado.

Para `EXPLAIN`, o plano de execução de windowing é muito extenso para ser exibido no formato de saída tradicional. Para ver as informações de planejamento de windowing, use `EXPLAIN FORMAT=JSON` e procure pelo elemento `windowing`.