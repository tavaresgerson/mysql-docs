#### 1.6.3.3 Restrições sobre Dados Inválidos

O MySQL 5.7.5 e versões posteriores utilizam o strict SQL mode por padrão, o que trata valores inválidos de forma que o servidor os rejeita e anula a instrução (statement) na qual eles ocorrem (veja Seção 5.1.10, “Server SQL Modes”). Anteriormente, o MySQL era muito mais tolerante a valores incorretos usados na entrada de dados; isso agora exige a desativação do strict mode, o que não é recomendado. O restante desta seção discute o comportamento antigo seguido pelo MySQL quando o strict mode foi desativado.

Se você não estiver usando o strict mode, sempre que você tentar inserir um valor "incorreto" em uma coluna — como um `NULL` em uma coluna `NOT NULL` ou um valor numérico muito grande em uma coluna numérica — o MySQL define a coluna para o "melhor valor possível" em vez de gerar um erro. As regras a seguir descrevem em mais detalhes como isso funciona:

* Se você tentar armazenar um valor fora do intervalo em uma coluna numérica, o MySQL Server armazena, em vez disso, zero, o menor valor possível ou o maior valor possível, o que for mais próximo do valor inválido.

* Para strings, o MySQL armazena a string vazia ou o máximo da string que puder ser armazenado na coluna.

* Se você tentar armazenar uma string que não comece com um número em uma coluna numérica, o MySQL Server armazena 0.

* Valores inválidos para colunas `ENUM` e `SET` são tratados conforme descrito na Seção 1.6.3.4, “ENUM and SET Constraints”.

* O MySQL permite que você armazene certos valores de data incorretos em colunas `DATE` e `DATETIME` (como `'2000-02-31'` ou `'2000-02-00'`). Neste caso, quando uma aplicação não habilitou o strict SQL mode, cabe à aplicação validar as datas antes de armazená-las. Se o MySQL puder armazenar um valor de data e recuperar exatamente o mesmo valor, o MySQL o armazena como fornecido. Se a data estiver totalmente errada (fora da capacidade do servidor de armazená-la), o valor de data "zero" especial `'0000-00-00'` é armazenado na coluna.

* Se você tentar armazenar `NULL` em uma coluna que não aceita valores `NULL`, um erro ocorre para statements `INSERT` de linha única. Para statements `INSERT` de múltiplas linhas ou para statements `INSERT INTO ... SELECT`, o MySQL Server armazena o valor default implícito para o tipo de dado da coluna. Em geral, este é `0` para tipos numéricos, a string vazia (`''`) para tipos de string, e o valor "zero" para tipos de data e hora. Valores default implícitos são discutidos na Seção 11.6, “Valores Default de Tipos de Dados”.

* Se um statement `INSERT` não especificar nenhum valor para uma coluna, o MySQL insere seu valor default se a definição da coluna incluir uma cláusula `DEFAULT` explícita. Se a definição não tiver tal cláusula `DEFAULT`, o MySQL insere o valor default implícito para o tipo de dado da coluna.

A razão para usar as regras precedentes quando o strict mode não está em vigor é que não podemos verificar estas condições até que o statement tenha começado a ser executado. Não podemos simplesmente fazer o roll back se encontrarmos um problema após atualizar algumas linhas, porque o storage engine pode não suportar o rollback. A opção de terminar o statement não é tão boa; neste caso, a atualização estaria "pela metade", o que é provavelmente o pior cenário possível. Neste caso, é melhor "fazer o melhor possível" e então continuar como se nada tivesse acontecido.

Você pode selecionar um tratamento mais rigoroso dos valores de entrada usando os SQL modes `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES`:

```sql
SET sql_mode = 'STRICT_TRANS_TABLES';
SET sql_mode = 'STRICT_ALL_TABLES';
```

`STRICT_TRANS_TABLES` habilita o strict mode para storage engines transacionais, e também, em certa medida, para engines não transacionais. Funciona da seguinte forma:

* Para storage engines transacionais, valores de dados inválidos ocorrendo em qualquer parte de um statement fazem com que o statement seja anulado e o roll back seja executado.

* Para storage engines não transacionais, um statement é anulado se o erro ocorrer na primeira linha a ser inserida ou atualizada. (Quando o erro ocorre na primeira linha, o statement pode ser anulado para deixar a tabela inalterada, assim como em uma tabela transacional.) Erros em linhas após a primeira não anulam o statement, porque a tabela já foi alterada pela primeira linha. Em vez disso, valores de dados inválidos são ajustados e resultam em warnings (avisos) em vez de erros. Em outras palavras, com `STRICT_TRANS_TABLES`, um valor incorreto faz com que o MySQL execute o roll back de todas as atualizações feitas até então, se isso puder ser feito sem alterar a tabela. Mas uma vez que a tabela tenha sido alterada, erros posteriores resultam em ajustes e warnings.

Para uma verificação ainda mais rigorosa, habilite `STRICT_ALL_TABLES`. Isso é o mesmo que `STRICT_TRANS_TABLES`, exceto que para storage engines não transacionais, erros anulam o statement mesmo para dados inválidos em linhas que seguem a primeira linha. Isso significa que, se ocorrer um erro no meio de um INSERT ou UPDATE de múltiplas linhas para uma tabela não transacional, resulta em uma atualização parcial. Linhas anteriores são inseridas ou atualizadas, mas aquelas a partir do ponto do erro em diante não o são. Para evitar isso em tabelas não transacionais, use statements de linha única ou use `STRICT_TRANS_TABLES` se warnings de conversão em vez de erros forem aceitáveis. Para evitar problemas, em primeiro lugar, não use o MySQL para verificar o conteúdo da coluna. É mais seguro (e frequentemente mais rápido) permitir que a aplicação garanta que ela passe apenas valores válidos ao Database.

Com qualquer uma das opções de strict mode, você pode fazer com que os erros sejam tratados como warnings (avisos) usando `INSERT IGNORE` ou `UPDATE IGNORE`, em vez de `INSERT` ou `UPDATE` sem o `IGNORE`.